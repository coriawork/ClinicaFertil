import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Link, useParams } from "react-router-dom"
import {
    ClipboardList,
    Stethoscope,
    TestTube,
    Activity,
    User,
    Calendar,
    Target,
    CheckCircle2,
    Circle,
    Syringe,
    Microscope,
    Baby
} from "lucide-react"

// MOCKS con diferentes estados de tratamiento
const pacientes = [
    {
        id: "1",
        nombre: "María González",
        edad: 34,
        telefono: "+54 11 4567-8890",
        email: "maria.gonzalez@example.com",
        obraSocial: "OSDE 410",
        es_pareja: false,
        pareja: { id: "3", nombre: "Juan Pérez", email: "juan.perez@example.com" },
        historiaClinica: {
            antecedentes: ["biopsia-mamaria", "amigdalectomía", "histeroscopía"],
        },
        tratamiento: {
            id: "1",
            nombre: "Fertilización in vitro (FIV)",
            estado: "vigente",
            etapa: "fecundacion",
            objetivo: "gametos_propios",
            inicio: "2025-09-10",
            controlProximo: "2025-12-20",
            progreso: 85
        },
        estudios: [
            { nombre: "Perfil hormonal completo", fecha: "2025-10-15", estado: "Completado", resultadoPendiente: false },
            { nombre: "Ecografía transvaginal", fecha: "2025-10-30", estado: "Completado", resultadoPendiente: true },
            { nombre: "Cariotipo", fecha: "2025-11-02", estado: "Completado", resultadoPendiente: false }
        ]
    },
    {
        id: "2",
        nombre: "Lucía Fernández",
        edad: 29,
        telefono: "+54 351 223-7766",
        email: "lucia.fernandez@example.com",
        obraSocial: "Swiss Medical",
        es_pareja: false,
        pareja: null,
        historiaClinica: {
            diagnostico: "Reserva ovárica disminuida (AMH baja).",
            antecedentes: ["Menarquía tardía", "Sin cirugías previas"],
            ultimaActualizacion: "2025-11-01"
        },
        tratamiento: {
            id: "2",
            nombre: "Evaluación inicial",
            estado: "vigente",
            etapa: "segunda_consulta",
            objetivo: "preservacion",
            inicio: "2025-10-28",
            controlProximo: "2025-12-10",
            progreso: 35
        },
        estudios: [
            { nombre: "Hormona antimülleriana (AMH)", fecha: "2025-10-20", estado: "Completado", resultadoPendiente: false },
            { nombre: "Hisopado cervicovaginal", fecha: "2025-11-03", estado: "En proceso", resultadoPendiente: true }
        ]
    },
    {
        id: "3",
        nombre: "Juan Pérez",
        edad: 36,
        telefono: "+54 11 9876-5432",
        email: "juan.perez@example.com",
        obraSocial: "OSDE 410",
        es_pareja: true,
        pareja: { id: "1", nombre: "María González", email: "maria.gonzalez@example.com" },
        historiaClinica: {
            diagnostico: "Factor masculino leve con varicocele tratado.",
            antecedentes: ["Varicocelectomía 2021", "Asma leve controlada"],
            ultimaActualizacion: "2025-10-30"
        },
        tratamiento: null,
        estudios: [
            { nombre: "Seminograma", fecha: "2025-10-12", estado: "Completado", resultadoPendiente: false },
            { nombre: "Fragmentación de ADN espermático", fecha: "2025-11-01", estado: "En proceso", resultadoPendiente: true }
        ]
    },
    {
        id: "4",
        nombre: "Ana Martínez",
        edad: 32,
        telefono: "+54 11 5555-1234",
        email: "ana.martinez@example.com",
        obraSocial: "Galeno",
        es_pareja: false,
        pareja: null,
        historiaClinica: {
            antecedentes: ["Sin antecedentes relevantes"],
        },
        tratamiento: {
            id: "4",
            nombre: "Inicio de tratamiento",
            estado: "vigente",
            etapa: "primer_consulta",
            objetivo: "esperma_donado",
            inicio: "2025-12-01",
            controlProximo: "2025-12-15",
            progreso: 15
        },
        estudios: []
    },
    {
        id: "5",
        nombre: "Carolina Ruiz",
        edad: 38,
        telefono: "+54 11 6789-1234",
        email: "carolina.ruiz@example.com",
        obraSocial: "Medicus",
        es_pareja: false,
        pareja: null,
        historiaClinica: {
            diagnostico: "Baja reserva ovárica",
            antecedentes: ["Endometriosis tratada"],
            ultimaActualizacion: "2025-11-15"
        },
        tratamiento: {
            id: "5",
            nombre: "FIV con ICSI",
            estado: "vigente",
            etapa: "puncion_folicular",
            objetivo: "gametos_propios",
            inicio: "2025-10-01",
            controlProximo: "2025-12-08",
            progreso: 70
        },
        estudios: [
            { nombre: "AMH", fecha: "2025-09-15", estado: "Completado", resultadoPendiente: false },
            { nombre: "Ecografía", fecha: "2025-11-20", estado: "Completado", resultadoPendiente: false }
        ]
    },
    {
        id: "6",
        nombre: "Valentina Costa",
        edad: 31,
        telefono: "+54 11 7890-5678",
        email: "valentina.costa@example.com",
        obraSocial: "OSDE 310",
        es_pareja: false,
        pareja: { id: "7", nombre: "Martín López", email: "martin.lopez@example.com" },
        historiaClinica: {
            diagnostico: "Factores múltiples",
            antecedentes: ["SOP", "Miomectomía 2023"],
            ultimaActualizacion: "2025-11-25"
        },
        tratamiento: {
            id: "6",
            nombre: "Tratamiento FIV avanzado",
            estado: "vigente",
            etapa: "transferencia",
            objetivo: "gametos_propios",
            inicio: "2025-08-15",
            controlProximo: "2025-12-12",
            progreso: 95
        },
        estudios: [
            { nombre: "Perfil completo", fecha: "2025-08-01", estado: "Completado", resultadoPendiente: false },
            { nombre: "PGT", fecha: "2025-11-28", estado: "Completado", resultadoPendiente: false }
        ]
    }
]

const ETAPAS_TRATAMIENTO = [
    {
        id: "primer_consulta",
        nombre: "Primera Consulta",
        descripcion: "Evaluación inicial y definición de objetivo",
        icon: Stethoscope,
        color: "text-chart-4",
        bgColor: "bg-chart-4/10"
    },
    {
        id: "segunda_consulta",
        nombre: "Segunda Consulta",
        descripcion: "Análisis de estudios médicos",
        icon: TestTube,
        color: "text-chart-2",
        bgColor: "bg-chart-2/10"
    },
    {
        id: "estimulacion",
        nombre: "Estimulación",
        descripcion: "Estimulación ovárica en curso",
        icon: Activity,
        color: "text-chart-1",
        bgColor: "bg-chart-1/10"
    },
    {
        id: "puncion_folicular",
        nombre: "Punción Folicular",
        descripcion: "Extracción de óvulos",
        icon: Syringe,
        color: "text-chart-3",
        bgColor: "bg-chart-3/10"
    },
    {
        id: "fecundacion",
        nombre: "Fecundación",
        descripcion: "Proceso de fecundación in vitro",
        icon: Microscope,
        color: "text-primary",
        bgColor: "bg-primary/10"
    },
    {
        id: "transferencia",
        nombre: "Transferencia Embrionaria",
        descripcion: "Implantación de embriones",
        icon: Baby,
        color: "text-accent-foreground",
        bgColor: "bg-accent/30"
    }
]

const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric"
})

const calcularProgreso = (etapaId) => {
    const index = ETAPAS_TRATAMIENTO.findIndex(e => e.id === etapaId)
    if (index === -1) return 0

    // Cada etapa representa un porcentaje equitativo
    // Si estamos en la etapa 0 (primera), mostramos ~17%
    // Si estamos en la etapa 5 (última), mostramos 100%
    const totalEtapas = ETAPAS_TRATAMIENTO.length
    const progreso = Math.round(((index + 1) / totalEtapas) * 100)

    return progreso
}

export default function PacienteDetail() {

    const { id } = useParams()
    const paciente = pacientes.find((item) => item.id === id) ?? null
    
    if (!paciente) {
        return (
            <DashboardLayout role="medico">
                <div className="flex min-h-[60vh] items-center justify-center">
                    <Card className="max-w-md border-dashed border-border/60 bg-muted/40 text-center shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl text-foreground">Paciente no encontrado</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Verificá el identificador o seleccioná un paciente desde el listado.
                        </CardContent>
                        <CardFooter className="justify-center">
                            <Button asChild variant="primary" size="sm">
                                <Link to="/medico/pacientes">Volver al listado</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </DashboardLayout>
        )
    }

    // Calcular el progreso basado en la etapa actual
    const progresoCalculado = paciente.tratamiento 
        ? calcularProgreso(paciente.tratamiento.etapa)
        : 0
    const etapaActual = paciente.tratamiento 
        ? ETAPAS_TRATAMIENTO.find(e => e.id === paciente.tratamiento.etapa)
        : null

    return (
        <DashboardLayout role="medico">
            <div className="space-y-8">
                
                <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl from-primary/10 via-primary/5 to-transparent p-6 shadow-inset-strong">
                    <div className="w-full">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold text-foreground">{paciente.nombre}</h1>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-10">
                                <Badge className="bg-chart-2 text-foreground">
                                    {paciente.es_pareja ? "Pareja de Paciente" : "Paciente Principal"}
                                </Badge>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-col items-stretch gap-2 md:flex-row md:items-center md:justify-start md:gap-3">
                            <div className="flex flex-wrap gap-2">
                                <Link to={'/pacientes/'+id+'/historial'}>
                                    <Button variant='action' className="w-full">
                                        <ClipboardList/>
                                        Gestionar Historia Clinica
                                    </Button>
                                </Link>
                                <Link to={'/pacientes/'+id+'/estudios/'}>
                                    <Button variant="action">
                                        <TestTube className="mr-2 h-4 w-4" />
                                        Gestion Estudio
                                    </Button>
                                </Link>
                                {paciente.tratamiento && !paciente.es_pareja &&
                                    <Link to={'/pacientes/'+id+'/tratamientos/'}>
                                        <Button variant="action">
                                            <Target className="mr-2 h-4 w-4" />
                                            Gestion Tratamiento
                                        </Button>
                                    </Link>
                                }
                            </div>
                        </div>
                    </div>
                </header>

                {/* Card de Progreso del Tratamiento */}
                {paciente.tratamiento && etapaActual && (
                    <Card className="border-primary/20 bg-background/50 shadow-sm">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Target className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-lg text-foreground">Tratamiento en Curso</CardTitle>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Iniciado el {formatDate(paciente.tratamiento.inicio)}
                                    </p>
                                </div>
                                <Badge variant="outline" className="bg-chart-2 text-foreground">
                                    {paciente.tratamiento.estado}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Etapa Actual Destacada */}
                            <div className="rounded-lg bg-background shadow-2xl p-4 shadow-sm border border-primary/20">
                                <div className="flex items-start gap-4">
                                    <div className={`rounded-full p-3 ${etapaActual.bgColor}`}>
                                        <etapaActual.icon className={`h-6 w-6 ${etapaActual.color}`} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-foreground mb-1">
                                            {etapaActual.nombre}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {etapaActual.descripcion}
                                        </p>
                                        <div className="mt-3 space-y-2">
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>Progreso del tratamiento</span>
                                                <span className="font-medium">{progresoCalculado}%</span>
                                            </div>
                                            <Progress value={progresoCalculado} className="h-2" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline de Etapas */}
                            <div className="space-y-3">
                                {ETAPAS_TRATAMIENTO.map((etapa, index) => {
                                    const currentIndex = ETAPAS_TRATAMIENTO.findIndex(e => e.id === etapaActual.id)
                                    const isCompleted = currentIndex > index
                                    const isCurrent = etapa.id === etapaActual.id
                                    
                                    return (
                                        <div key={etapa.id} className="flex items-center gap-3">
                                            <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                                                isCompleted 
                                                    ? 'border-chart-1 bg-chart-1 text-white' 
                                                    : isCurrent 
                                                        ? `border-primary bg-primary text-white`
                                                        : 'border-muted bg-muted text-muted-foreground'
                                            }`}>
                                                {isCompleted ? (
                                                    <CheckCircle2 className="h-4 w-4" />
                                                ) : (
                                                    <Circle className="h-3 w-3" fill="currentColor" />
                                                )}
                                            </div>
                                            <div className="flex-1 flex items-center gap-2">
                                                <etapa.icon className={`h-4 w-4 ${
                                                    isCurrent ? etapa.color : 'text-muted-foreground'
                                                }`} />
                                                <p className={`text-sm font-medium ${
                                                    isCurrent ? 'text-foreground' : 'text-muted-foreground'
                                                }`}>
                                                    {etapa.nombre}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {paciente.pareja ? (
                    <Card>
                        <CardHeader>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-foreground" />
                                    <div>
                                        <CardTitle className="text-lg text-foreground">
                                            {paciente.es_pareja ? 'Es pareja de: ' : 'Tiene de pareja a:'}
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {paciente.pareja.nombre}
                                        </p>
                                    </div>
                                </div>
                                <Button asChild variant="action">
                                    <Link to={`/pacientes/${paciente.pareja.id}`}>
                                        Administrar Pareja
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>
                ) : null}

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr,1fr]">
                    {/* Generales */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Stethoscope className="h-5 w-5 text-foreground" />
                                <CardTitle className="text-2xl text-foreground">Datos generales</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <dl className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                                <div>
                                    <dt className="text-muted-foreground">Edad</dt>
                                    <dd className="font-medium text-foreground">{paciente.edad} años</dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Teléfono</dt>
                                    <dd className="font-medium text-foreground">{paciente.telefono}</dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Correo electrónico</dt>
                                    <dd className="font-medium text-foreground">{paciente.email}</dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Cobertura</dt>
                                    <dd className="font-medium text-foreground">{paciente.obraSocial}</dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}