import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Objetivo } from "./objetivo"
import { useState } from "react"
import { XCircle, CheckCircle, RefreshCcw, PlusCircle, ArrowRight } from "lucide-react"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Link } from "react-router-dom" // Asegúrate de tener react-router-dom instalado
import { Combobox } from "@/components/ui/combobox"

const ESTADOS = {
    vigente: { label: "Vigente", color: "bg-chart-1 text-white", icon: <RefreshCcw className="w-4 h-4" /> },
    cancelado: { label: "Cancelado", color: "bg-destructive text-white", icon: <XCircle className="w-4 h-4" /> },
    completado: { label: "Completado", color: "bg-primary text-white", icon: <CheckCircle className="w-4 h-4" /> }
}
const tratamientosEjemplo = [
    {
        id: 1,
        estado: "cancelado",
        objetivo: "gametos_propios",
        estimulo: {
            tipo: "inyectable",
            droga: "Clomifeno",
            dosis: "2ml cada 6h",
            duracion: "10",
            consentimiento: true,
            monitoreos: [
            { fecha: "2025-11-28 10:00", observacion: "Monitoreo inicial OK" }
            ]
        },
        fechaInicio: "2025-11-25",
        fechaFin: null,
        causaCancelacion: null,
        cancelacionAutomatica: false
    },
    {
        id: 2,
        estado: "cancelado",
        objetivo: "esperma_donado",
        estimulo: {
            tipo: "oral",
            droga: "Letrozol",
            dosis: "1 pastilla diaria",
            duracion: "7",
            consentimiento: true,
            monitoreos: []
        },
        fechaInicio: "2025-10-10",
        fechaFin: "2025-10-20",
        causaCancelacion: "Paciente no completó estudios previos",
        cancelacionAutomatica: false
    },

]
const pacienteEjemplo = {
    id:1,
    nombre:'Carla'
}

// NUEVO: Componente para elegir objetivo y crear tratamiento
const OBJETIVOS_DISPONIBLES = [
    { id: "gametos_propios", label: "Gametos propios" },
    { id: "esperma_donado", label: "Esperma donado" },
    { id: "ropa", label: "ROPA" },
    { id: "preservacion", label: "Preservar Gametos" }
]

function NuevoTratamiento({ onCrear, disabled }) {
    const [objetivo, setObjetivo] = useState("")
    return (
        <Card className="mb-8 border-dashed border-2 border-primary bg-chart-4/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                    <PlusCircle className="w-5 h-5 " />
                    <p className="mt-1">
                        Nuevo tratamiento
                    </p>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {( disabled ) && (
                        <CardDescription className="text-destructive/50">
                            Ya existe un tratamiento vigente.
                        </CardDescription>
                    )}
                    <select
                        className={"w-full rounded px-2 py-2 text-foreground bg-chart-4/20 "+ (disabled ? "opacity-50 cursor-not-allowed" : "")}
                        value={objetivo}
                        onChange={e => setObjetivo(e.target.value)}
                        disabled={disabled}
                    >
                        <option value="" className="text-black">Seleccionar objetivo...</option>
                        {OBJETIVOS_DISPONIBLES.map(obj => (
                            <option key={obj.id} className="text-black " value={obj.id}>{obj.label}</option>
                        ))}
                    </select>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                variant="action"
                className="w-full"
                disabled={!objetivo || disabled}
                onClick={() => {
                    onCrear(objetivo)
                    setObjetivo("")
                }}
                >
                    Crear tratamiento
                </Button>
            </CardFooter>
        </Card>
    )
}
export function ListadoTratamientosPaciente({ paciente = pacienteEjemplo, tratamientos = tratamientosEjemplo }) {
    const [tratamientosState, setTratamientosState] = useState(tratamientos)
    const [cancelandoId, setCancelandoId] = useState(null)
    const [causaCancelacion, setCausaCancelacion] = useState("")

    // Solo puede haber un tratamiento vigente
    const hayVigente = tratamientosState.some(t => t.estado === "vigente")

    const handleCancelar = (id) => {
        setCancelandoId(id)
        setCausaCancelacion("")
    }

    const confirmarCancelacion = (id) => {
        setTratamientosState(tratamientosState.map(t =>
        t.id === id
            ? { ...t, estado: "cancelado", causaCancelacion, fechaFin: new Date().toISOString().slice(0, 10), cancelacionAutomatica: false }
            : t
        ))
        setCancelandoId(null)
        setCausaCancelacion("")
    }

    // NUEVO: Crear tratamiento al elegir objetivo
    const crearNuevoTratamiento = (objetivo) => {
        const nuevo = {
            id: tratamientosState.length + 1,
            estado: "vigente",
            objetivo,
            estimulo: {
                tipo: "",
                droga: "",
                dosis: "",
                duracion: "",
                consentimiento: false,
                monitoreos: []
            },
            fechaInicio: new Date().toISOString().slice(0, 10),
            fechaFin: null,
            causaCancelacion: null,
            cancelacionAutomatica: false
        }
        setTratamientosState([nuevo, ...tratamientosState])
    }

    return (
        <DashboardLayout role={'medico'}>
        <div className="max-w-3xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Tratamientos de {paciente?.nombre || "Paciente"}</h1>
            {/* NUEVO: Formulario para crear tratamiento */}
            <NuevoTratamiento onCrear={crearNuevoTratamiento} disabled={hayVigente} />
            <div className="space-y-4">
                {tratamientosState.length === 0 && (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            No hay tratamientos registrados para este paciente.
                        </CardContent>
                    </Card>
                )}
                {tratamientosState.map(trat => (
                    <Card key={trat.id} className=" p-4">
                        <CardHeader className='flex justify-between items-center'>
                            <div className="flex items-center gap-2">
                                <Badge className={`flex items-center font-semibold ${ESTADOS[trat.estado].color}`}>
                                    {ESTADOS[trat.estado].icon}
                                    {ESTADOS[trat.estado].label}
                                </Badge>
                                <span className="font-semibold ">#{trat.id}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                <span className="font-medium">{OBJETIVOS_DISPONIBLES.find(o => o.id === trat.objetivo)?.label || "-"}</span>
                            </div>
                        </CardHeader>
                        <Separator></Separator>
                        <CardFooter className='flex justify-between items-center'>
                            <div className="flex flex-col text-md text-muted-foreground">
                                <p>Iniciado: {trat.fechaInicio}</p>
                                {trat.fechaFin && <p> Finalizado: {trat.fechaFin}</p>}
                            </div>
                            <Link to={`/medico/pacientes/tratamiento/${trat.id}`} className="inline-flex items-center rounded bg-primary p-2 gap-2 text-white hover:bg-primary/80 transition">  
                                Ver detalle <ArrowRight className="w-4 h-4" />
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <div className="mt-8 text-xs text-muted-foreground text-center">
            <p>
                <b>Nota:</b> Si un paciente regresa tras un tratamiento cancelado, se debe crear un nuevo tratamiento independiente.<br />
                El tratamiento inicia al elegir objetivo y termina cuando todos los embriones fueron transferidos o criopreservados.
            </p>
            </div>
        </div>
        </DashboardLayout>
    )
}