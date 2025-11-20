import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link, useParams } from "react-router-dom"
import {
    ClipboardList,
    ArrowLeft,
    Stethoscope,
    TestTube,
    Activity,
    User
} from "lucide-react"
import { Objetivo } from "./objetivo"


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
            nombre: "Fertilización in vitro (FIV)",
            estado: "Estimulación ovárica",
            inicio: "2025-09-10",
            controlProximo: "2025-11-12",
            progreso: 68
        },
        estudios: [
            { nombre: "Perfil hormonal completo", fecha: "2025-10-15", estado: "Completado", resultadoPendiente: false },
            { nombre: "Ecografía transvaginal", fecha: "2025-10-30", estado: "Completado", resultadoPendiente: true },
            { nombre: "Cariotipo", fecha: "2025-11-02", estado: "Pendiente", resultadoPendiente: true }
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
        tratamiento: null,
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
        tratamiento: {
            nombre: "Apoyo andrológico",
            estado: "Monitoreo seminograma",
            inicio: "2025-09-22",
            controlProximo: "2025-11-18",
            progreso: 54
        },
        estudios: [
            { nombre: "Seminograma", fecha: "2025-10-12", estado: "Completado", resultadoPendiente: false },
            { nombre: "Fragmentación de ADN espermático", fecha: "2025-11-01", estado: "En proceso", resultadoPendiente: true }
        ]
    }
]

const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric"
})

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

    return (
        <DashboardLayout role="medico">
            <div className="space-y-8">
                
                <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl  from-primary/10 via-primary/5 to-transparent p-6 shadow-inset-strong">
                    <div className="w-full">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold text-foreground">{paciente.nombre}</h1>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-10">
                                <Badge className="bg-chart-2  text-foreground"> {paciente.es_pareja? (("Pareja de Paciente")) : ("Paciente Principal")}</Badge>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-col items-stretch gap-2 md:flex-row md:items-center md:justify-start md:gap-3">
                            <div className="flex flex-wrap  gap-2">
                                <Link to={'/medico/pacientes/historial/'+id}>
                                    <Button  variant='action' className="w-full">
                                        <ClipboardList/>
                                        Gestionar Historia Clinica
                                    </Button>
                                </Link>
                                <Link to={'/medico/pacientes/estudios/'+id}>
                                    <Button variant="action">
                                        <TestTube className="mr-2 h-4 w-4" />
                                        Gestion Estudio
                                    </Button>
                                </Link>
                              
                                
                            </div>
                        </div>
                    </div>
                </header>

                {paciente.pareja ? (
                    <Card >
                        <CardHeader>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-foreground" />
                                    <div>
                                        <CardTitle className="text-lg text-foreground">{paciente.es_pareja?('Es pareja de: ') : 'Tiene de pareja a:'}</CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {paciente.pareja.nombre}
                                        </p>
                                    </div>
                                </div>
                                <Button asChild  variant="action" >
                                    <Link to={`/medico/pacientes/${paciente.pareja.id}`}>
                                        Administrar Pareja
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>
                ) : null}

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr,1fr]">
                    {/* Historial */}
                    <Card >
                        <CardContent>
                            <p className="text-xs mb-5 font-semibold uppercase tracking-wide text-muted-foreground">
                                Resumen historia clincia
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {paciente.historiaClinica.antecedentes.map((item) => (
                                    <Badge key={item} className=" bg-accent uppercase rounded-full px-3 py-1 text-xs">
                                        {item}
                                    </Badge>
                                ))}
                                <Link className="underline ml-2 hover:text-accent-foreground" to={"/medico/pacientes/historial/"+id}>
                                    ver más
                                </Link>
                            </div>
                        </CardContent>    
                    </Card>
                  
                    {/* Generales */}
                    <Card >
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Stethoscope className="h-5 w-5 text-foreground" />
                                <CardTitle className="text-2xl text-foreground">Datos generales</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 ">
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
                    
                    {/* Objetivo */}
                    <Objetivo idPac={id}/>

                  
                </div>
            
            </div>
        </DashboardLayout>
    )
}