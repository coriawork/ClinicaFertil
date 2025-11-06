import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Link, useParams } from "react-router-dom"
import {
    CalendarCheck,
    ClipboardList,
    FileText,
    HeartPulse,
    Stethoscope,
    Upload,
    UserRound
} from "lucide-react"

const pacientes = [
    {
        id: "PAC-001",
        nombre: "María González",
        edad: 34,
        telefono: "+54 11 4567-8890",
        email: "maria.gonzalez@example.com",
        obraSocial: "OSDE 410",
        es_pareja: false,
        pareja: { id: "PAC-004", nombre: "Juan Pérez" },
        historiaClinica: {
            diagnostico: "Infertilidad tubárica con antecedentes de endometriosis.",
            antecedentes: ["Endometriosis estadio II", "Hipotiroidismo subclínico", "Cirugía laparoscópica 2022"],
            ultimaActualizacion: "2025-10-28"
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
        id: "PAC-002",
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
        id: "PAC-004",
        nombre: "Juan Pérez",
        edad: 36,
        telefono: "+54 11 9876-5432",
        email: "juan.perez@example.com",
        obraSocial: "OSDE 410",
        es_pareja: true,
        pareja: { id: "PAC-001", nombre: "María González" },
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
    const paciente = pacientes.find((item) => item.id === id) ?? pacientes[0]

    if (!paciente) {
        return (
            <DashboardLayout role="medico">
                <div className="flex min-h-[60vh] items-center justify-center">
                    <Card className="max-w-md border-dashed border-border/60 bg-muted/40 text-center shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg text-foreground">Paciente no encontrado</CardTitle>
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
                <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 shadow-inset-strong">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                            Panel del médico
                        </p>
                        <h1 className="text-2xl font-semibold text-foreground">{paciente.nombre}</h1>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">{paciente.id}</Badge>
                            <Badge variant="outline" className="text-muted-foreground">
                                {paciente.obraSocial}
                            </Badge>
                            {paciente.es_pareja && (
                                <Badge className="bg-primary/15 text-primary">Pareja</Badge>
                            )}
                        </div>
                        <div className="mt-4 flex flex-col items-stretch gap-2 md:flex-row md:items-center md:justify-start md:gap-3">
                            <div className="flex flex-wrap gap-2">
                                <Button variant="outline" size="sm">
                                    Pedir estudio
                                </Button>
                                <Button variant="outline" size="sm">
                                    Generar monitoreo
                                </Button>
                                <Button variant="outline" size="sm">
                                    Registrar objetivo
                                </Button>
                                <Button variant="outline" size="sm">
                                    Registrar tratamiento
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button asChild variant="outline" size="sm">
                            <Link to="/medico/pacientes">Volver al listado</Link>
                        </Button>
                        <Button variant="primary" size="sm" className="shadow-md">
                            <CalendarCheck className="mr-2 h-4 w-4" />
                            Programar control
                        </Button>
                    </div>
                </header>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr,1fr]">
                    <Card className="border-border/60 shadow-md">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Stethoscope className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg text-foreground">Datos generales</CardTitle>
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
                            <Separator />
                            <div className="space-y-4 rounded-2xl border border-border/60 bg-muted/40 p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <ClipboardList className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                                Historia clínica
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Última actualización: {formatDate(paciente.historiaClinica.ultimaActualizacion)}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        Ver historia clínica
                                    </Button>
                                </div>
                                <p className="text-sm leading-relaxed text-foreground">
                                    {paciente.historiaClinica.diagnostico}
                                </p>
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Antecedentes relevantes
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {paciente.historiaClinica.antecedentes.map((item) => (
                                            <Badge key={item} variant="secondary" className="rounded-full px-3 py-1 text-xs">
                                                {item}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border/60 bg-card/70 shadow-md">
                        <CardHeader>
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <UserRound className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-lg text-foreground">Vínculo de pareja</CardTitle>
                                </div>
                                {paciente.pareja ? (
                                    <Badge className="bg-primary/15 text-primary">Vinculado</Badge>
                                ) : (
                                    <Badge variant="outline" className="text-muted-foreground">
                                        Sin pareja registrada
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {paciente.pareja ? (
                                <>
                                    <p className="text-sm text-muted-foreground">
                                        Esta persona comparte la misma vista clínica para seguimiento coordinado.
                                    </p>
                                    <Button asChild variant="ghost" size="sm" className="w-full justify-start text-primary hover:text-primary">
                                        <Link to={`/medico/pacientes/${paciente.pareja.id}`}>
                                            Ver ficha de {paciente.pareja.nombre}
                                        </Link>
                                    </Button>
                                </>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Registrá una pareja para habilitar la vista compartida y sincronizar tratamientos.
                                </p>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" size="sm" className="w-full">
                                Gestionar vínculo
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
                {paciente.tratamiento && (
                    <Card className="border-primary/40 bg-primary/5 shadow-lg">
                        <CardHeader>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <HeartPulse className="h-5 w-5 text-primary" />
                                    <div>
                                        <CardTitle className="text-lg text-foreground">Tratamiento activo</CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {paciente.tratamiento.nombre}
                                        </p>
                                    </div>
                                </div>
                                <Badge className="bg-primary text-primary-foreground">
                                    {paciente.tratamiento.estado}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Progress value={paciente.tratamiento.progreso} className="h-2 rounded-full bg-secondary" />
                            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <dt className="text-muted-foreground">Fecha de inicio</dt>
                                    <dd className="font-medium text-foreground">
                                        {formatDate(paciente.tratamiento.inicio)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Próximo control</dt>
                                    <dd className="font-medium text-foreground">
                                        {formatDate(paciente.tratamiento.controlProximo)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Estado actual</dt>
                                    <dd className="font-medium text-foreground">
                                        {paciente.tratamiento.estado}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Progreso</dt>
                                    <dd className="font-medium text-foreground">
                                        {paciente.tratamiento.progreso}%
                                    </dd>
                                </div>
                            </dl>
                        </CardContent>
                        <CardFooter className="flex flex-wrap items-center justify-end gap-2">
                            <Button variant="outline" size="sm">
                                Registrar evolución
                            </Button>
                            <Button size="sm">Ver plan completo</Button>
                        </CardFooter>
                    </Card>
                )}
                <Card className="border-border/60 shadow-md">
                    <CardHeader>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <div>
                                    <CardTitle className="text-lg text-foreground">Estudios realizados</CardTitle>
                                    <p className="text-xs text-muted-foreground">
                                        Resumen de estudios y carga de resultados pendientes.
                                    </p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="border-primary/40 text-primary hover:bg-primary/10">
                                <Upload className="mr-2 h-4 w-4" />
                                Cargar resultados
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Separator />
                        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                            {paciente.estudios.map((estudio) => (
                                <div
                                    key={`${paciente.id}-${estudio.nombre}`}
                                    className="flex flex-col gap-3 rounded-xl border border-border/40 bg-muted/30 p-4"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{estudio.nombre}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Realizado el {formatDate(estudio.fecha)}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant={estudio.estado === "Completado" ? "secondary" : "outline"}>
                                            {estudio.estado}
                                        </Badge>
                                        {estudio.resultadoPendiente ? (
                                            <Badge variant="outline" className="border-amber-400 text-amber-600">
                                                Resultado pendiente
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-emerald-500/20 text-emerald-600">
                                                Resultado cargado
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}