import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import { XCircle, CheckCircle, RefreshCcw, Calendar, Target, Pill, Activity, AlertCircle } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/AuthContext"

const ESTADOS = {
  vigente: { 
    label: "Vigente", 
    color: "bg-emerald-500 hover:bg-emerald-600 text-white", 
    icon: <RefreshCcw className="w-4 h-4" />
  },
  cancelado: { 
    label: "Cancelado", 
    color: "bg-red-500 hover:bg-red-600 text-white", 
    icon: <XCircle className="w-4 h-4" />
  },
  completado: { 
    label: "Completado", 
    color: "bg-blue-500 hover:bg-blue-600 text-white", 
    icon: <CheckCircle className="w-4 h-4" />
  }
}

const OBJETIVOS_DISPONIBLES = [
  { id: "gametos_propios", label: "Embarazo con gametos propios" },
  { id: "esperma_donado", label: "Embarazo con esperma de donante" },
  { id: "ropa", label: "Método ROPA" },
  { id: "preservacion", label: "Preservación de fertilidad" }
]

const TIPOS_MEDICACION = {
  oral: { label: "Oral", icon: <Pill className="w-4 h-4" /> },
  inyectable: { label: "Inyectable", icon: <Activity className="w-4 h-4" /> },
  mixta: { label: "Mixta", icon: <RefreshCcw className="w-4 h-4" /> }
}

const tratamientosEjemplo = [
  {
    id: 1,
    estado: "vigente",
    objetivo: "gametos_propios",
    estimulo: {
      tipo: "inyectable",
      droga: "Clomifeno",
      dosis: "2ml cada 6h",
      duracion: "10"
    },
    fechaInicio: "2025-11-25",
    fechaFin: null,
    causaCancelacion: null
  },
  {
    id: 3,
    estado: "vigente",
    objetivo: "gametos_propios",
    estimulo: {
      tipo: "inyectable",
      droga: "Clomifeno",
      dosis: "2ml cada 6h",
      duracion: "10"
    },
    fechaInicio: "2025-11-25",
    fechaFin: null,
    causaCancelacion: null
  },
  {
    id: 2,
    estado: "cancelado",
    objetivo: "esperma_donado",
    estimulo: {
      tipo: "oral",
      droga: "Letrozol",
      dosis: "1 pastilla diaria",
      duracion: "7"
    },
    fechaInicio: "2025-10-10",
    fechaFin: "2025-10-20",
    causaCancelacion: "Paciente no completó estudios previos"
  }
]

export function TratamientoDetalle() {
    const {user} = useAuth()
    const { tratamientoId,id } = useParams()
    const navigate = useNavigate()
    const [tratamiento, setTratamiento] = useState(tratamientosEjemplo.find(t => t.id === Number(tratamientoId)))
    const [dialogOpen, setDialogOpen] = useState(false)
    const [nuevoEstado, setNuevoEstado] = useState("")
    const [motivoCancelacion, setMotivoCancelacion] = useState("")

    if (!tratamiento) {
        return (
            <DashboardLayout role="medico">
                <div className="max-w-4xl mx-auto py-12">
                    <Card className="border-destructive">
                        <CardContent className="py-12 text-center">
                            <XCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
                            <h2 className="text-2xl font-bold text-destructive mb-2">Tratamiento no encontrado</h2>
                            <Button onClick={() => navigate(-1)} variant="outline">Volver</Button>
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        )
    }

    const estadoConfig = ESTADOS[tratamiento.estado]
    const objetivoInfo = OBJETIVOS_DISPONIBLES.find(o => o.tratamientoId === tratamiento.objetivo)
    const tipoMedicacion = TIPOS_MEDICACION[tratamiento.estimulo.tipo]

    const handleCambiarEstado = (estado) => {
        setNuevoEstado(estado)
        setDialogOpen(true)
    }

    const confirmarCambioEstado = () => {
        const fechaActual = new Date().toISOString().split('T')[0]
        
        setTratamiento({
            ...tratamiento,
            estado: nuevoEstado,
            fechaFin: nuevoEstado !== "vigente" ? fechaActual : null,
            causaCancelacion: nuevoEstado === "cancelado" ? motivoCancelacion : null
        })
        
        setDialogOpen(false)
        setMotivoCancelacion("")
    }

    return (
        <DashboardLayout role="medico">
            <div className="w-full mx-auto py-8 space-y-6">
                {/* Header */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold">Tratamiento #{tratamiento.id}</h1>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Inicio: {tratamiento.fechaInicio}
                                    {tratamiento.fechaFin && ` • Fin: ${tratamiento.fechaFin}`}
                                </p>
                            </div>
                            <Badge className={`flex items-center gap-2 px-3 py-1.5 ${estadoConfig.color}`}>
                                {estadoConfig.icon}
                                {estadoConfig.label}
                            </Badge>
                        </div>
                        {
                            (user.role === 'medico' || user.role === 'laboratorio') && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <Link to={`/pacientes/${id}/tratamiento/${tratamientoId}/estimulacion/`}>
                                        <Button size="sm">
                                            <Activity className="w-4 h-4 mr-2" />
                                            Estimulación
                                        </Button>
                                    </Link>
                                    

                                    {tratamiento.estado === "vigente" && (
                                        <>
                                            <Button 
                                                size="sm" 
                                                variant="outline"
                                                className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                                onClick={() => handleCambiarEstado("completado")}
                                            >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Completar
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="outline"
                                                className="text-red-600 border-red-600 hover:bg-red-50"
                                                onClick={() => handleCambiarEstado("cancelado")}
                                            >
                                                <XCircle className="w-4 h-4 mr-2" />
                                                Cancelar
                                            </Button>
                                        </>
                                    )}
                                </div>
                            )
                        }
                    </CardContent>
                </Card>

                {/* Objetivo */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary" />
                            <CardTitle>Objetivo</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="font-semibold">{tratamientosEjemplo[tratamientoId]?.objetivo || "No especificado"}</p>
                    </CardContent>
                </Card>

                {/* Estimulación */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Pill className="w-5 h-5 text-primary" />
                            <CardTitle>Estimulación Ovárica</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs text-muted-foreground">Tipo</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    {tipoMedicacion?.icon}
                                    <span className="font-semibold">{tipoMedicacion?.label}</span>
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">Droga</Label>
                                <p className="font-semibold mt-1">{tratamiento.estimulo.droga}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">Dosis</Label>
                                <p className="font-semibold mt-1">{tratamiento.estimulo.dosis}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">Duración</Label>
                                <p className="font-semibold mt-1">{tratamiento.estimulo.duracion} días</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Cancelación */}
                {tratamiento.estado === "cancelado" && tratamiento.causaCancelacion && (
                    <Card className="border-destructive/50 bg-destructive/5">
                        <CardHeader>
                            <div className="flex items-center gap-2 text-destructive">
                                <AlertCircle className="w-5 h-5" />
                                <CardTitle>Motivo de Cancelación</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">{tratamiento.causaCancelacion}</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Dialog Cambio de Estado */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {nuevoEstado === "completado" ? "Completar" : "Cancelar"} Tratamiento
                        </DialogTitle>
                        <DialogDescription>
                            {nuevoEstado === "completado" 
                                ? "¿Está seguro que desea marcar este tratamiento como completado?"
                                : "Indique el motivo de la cancelación del tratamiento"
                            }
                        </DialogDescription>
                    </DialogHeader>
                    
                    {nuevoEstado === "cancelado" && (
                        <div className="space-y-2">
                            <Label>Motivo de cancelación</Label>
                            <Textarea
                                placeholder="Describa el motivo..."
                                value={motivoCancelacion}
                                onChange={(e) => setMotivoCancelacion(e.target.value)}
                                rows={4}
                            />
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button 
                            onClick={confirmarCambioEstado}
                            disabled={nuevoEstado === "cancelado" && !motivoCancelacion.trim()}
                        >
                            Confirmar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    )
}