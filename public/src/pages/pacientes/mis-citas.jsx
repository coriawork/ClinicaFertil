import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Clock, MapPin, User, AlertCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {calendarUtils} from "@/utils/calendar"

export default function MyAppointmentsPage() {
    const { user, isLoading } = useAuth()
    const navigate = useNavigate()
    const [appointments, setAppointments] = useState([])
    const [loadingAppointments, setLoadingAppointments] = useState(true)
    const [monitoreoSeleccion, setMonitoreoSeleccion] = useState({})
    const [cancelingTurno, setCancelingTurno] = useState(null)
    
    const monitoreoDias = [
        { label: "lun 18", value: "2025-01-18" },
        { label: "mar 19", value: "2025-01-19" },
        { label: "mié 20", value: "2025-01-20" },
    ]
    const monitoreoHoras = Array.from({ length: ((22 - 6) * 60) / 20 + 1 }, (_, i) => {
        const totalMinutes = 6 * 60 + i * 20
        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    })

    // Mock data para monitoreos y punciones
    const mockAppointments = [
        {
            id: "mock-1",
            kind: "monitoreo",
            type: "Monitoreo Ecográfico",
            doctor: "Dr. Carlos Rodríguez",
            date: "18 Ene 2025",
            time: "09:30",
            location: "Sala de Ecografía 2",
            status: "pendiente",
        },
        {
            id: "mock-2",
            kind: "puncion",
            type: "Punción Ovárica",
            doctor: "Dr. Carlos Rodríguez",
            date: "20 Ene 2025",
            time: "08:00",
            location: "Quirófano 1",
            status: "confirmada",
        },
    ]

    useEffect(() => {
        if (!isLoading && (!user || user.role !== "paciente")) {
            navigate("/")
        }
    }, [user, isLoading, navigate])

    useEffect(() => {
        if (user && user.id) {
            cargarCitas()
        }
    }, [user])

    const cargarCitas = async () => {
        setLoadingAppointments(true)
        try {
            // Obtener turnos reales de la API
            const turnosReales = await calendarUtils.fetchTurnosPaciente(user.id)
            
            // Transformar turnos reales al formato del componente
            const citasReales = turnosReales.map(turno => ({
                id: turno.id,
                kind: "turno",
                type: "Consulta",
                doctor: "Dr. Carlos Rodríguez", // TODO: Obtener nombre del médico desde la API
                date: turno.fecha,
                time: turno.hora,
                location: "Consultorio", // TODO: Obtener ubicación desde la API
                status: turno.estado,
                isReal: true // Marcador para identificar citas reales
            }))

            // Combinar con citas mock (monitoreos y punciones)
            setAppointments([...mockAppointments, ...citasReales])
        } catch (error) {
            console.error("Error al cargar citas:", error)
            toast.error("Error al cargar las citas. Por favor, intenta nuevamente.")
            // En caso de error, mostrar solo las citas mock
            setAppointments(mockAppointments)
        } finally {
            setLoadingAppointments(false)
        }
    }

    const handleCancelarTurno = async (appointmentId) => {
        const appointment = appointments.find(a => a.id === appointmentId)
        if (!appointment || !appointment.isReal) {
            toast.error("No se puede cancelar esta cita")
            return
        }

        setCancelingTurno(appointmentId)
        try {
            await calendarUtils.cancelarTurno(appointmentId)
            toast.success("Turno cancelado exitosamente")
            // Recargar citas
            await cargarCitas()
        } catch (error) {
            console.error("Error al cancelar turno:", error)
            toast.error("Error al cancelar el turno. Por favor, intenta nuevamente.")
        } finally {
            setCancelingTurno(null)
        }
    }

    const handleSeleccionMonitoreo = (id, dia, hora) => {
        setMonitoreoSeleccion(prev => ({
            ...prev,
            [id]: { dia, hora }
        }))
    }

    const handleConfirmarMonitoreo = (appointmentId) => {
        const seleccion = monitoreoSeleccion[appointmentId]
        if (!seleccion) {
            toast.error("Por favor selecciona un horario")
            return
        }

        // TODO: Enviar a la API cuando esté disponible
        toast.success(`Horario confirmado para el ${seleccion.dia} a las ${seleccion.hora}`)
        
        // Actualizar estado local
        setAppointments(prev => prev.map(apt => 
            apt.id === appointmentId 
                ? { ...apt, status: 'confirmada', date: seleccion.dia, time: seleccion.hora }
                : apt
        ))
    }

    if (isLoading || !user) {
        return null
    }

    const renderMonitoreoCard = (appointment) => {
        if (appointment.status === "confirmada") {
            return (
                <div className="bg-neutral-800/50 rounded-lg p-4 border border-primary/20">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground uppercase tracking-wide">Fecha</span>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span className="text-sm font-semibold text-foreground">{appointment.date}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground uppercase tracking-wide">Hora</span>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                <span className="text-sm font-semibold text-foreground">{appointment.time}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="w-full flex flex-col gap-4">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                        <p className="font-medium text-yellow-500 mb-1">Acción requerida</p>
                        <p className="text-foreground/70">Por favor, selecciona un horario disponible para tu monitoreo.</p>
                    </div>
                </div>
                
                <div className="w-full max-h-[300px] overflow-y-auto rounded-lg border border-neutral-700">
                    <table className="w-full text-center">
                        <thead className="sticky top-0 bg-neutral-800 z-10">
                            <tr>
                                <th className="px-3 py-2 border-b border-neutral-700 text-xs font-semibold text-foreground uppercase tracking-wide">Hora</th>
                                {monitoreoDias.map(dia => (
                                    <th key={dia.value} className="px-4 py-2 border-b border-neutral-700 text-xs font-semibold text-foreground uppercase tracking-wide">
                                        {dia.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {monitoreoHoras.map((hora, idx) => (
                                <tr key={hora} className={idx % 2 === 0 ? 'bg-neutral-900/30' : 'bg-neutral-900/10'}>
                                    <td className="px-3 py-2 border-b border-neutral-800 text-xs font-mono text-foreground/80"> 
                                        {hora}
                                    </td>
                                    {monitoreoDias.map(dia => {
                                        const seleccionado = monitoreoSeleccion[appointment.id]?.dia === dia.value && monitoreoSeleccion[appointment.id]?.hora === hora
                                        return (
                                            <td
                                                key={dia.value}
                                                className={`px-4 py-2 border-b border-neutral-800 cursor-pointer transition-all ${
                                                    seleccionado 
                                                        ? "bg-primary text-primary-foreground font-semibold" 
                                                        : "hover:bg-primary/10 text-foreground/60 hover:text-foreground"
                                                }`}
                                                onClick={() => handleSeleccionMonitoreo(appointment.id, dia.value, hora)}
                                            >
                                                {seleccionado && <CheckCircle2 className="h-4 w-4 mx-auto" />}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Button
                    className="w-full"
                    disabled={!monitoreoSeleccion[appointment.id]}
                    onClick={() => handleConfirmarMonitoreo(appointment.id)}
                >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Confirmar Horario Seleccionado
                </Button>
            </div>
        )
    }

    const getStatusConfig = (status) => {
        const configs = {
            confirmada: {
                icon: CheckCircle2,
                variant: "default",
                label: "Confirmada",
                className: "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
            },
            pendiente: {
                icon: AlertCircle,
                variant: "outline",
                label: "Pendiente",
                className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30"
            },
            completada: {
                icon: CheckCircle2,
                variant: "outline",
                label: "Completada",
                className: "bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30"
            },
            cancelada: {
                icon: XCircle,
                variant: "outline",
                label: "Cancelada",
                className: "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
            }
        }
        return configs[status] || configs.pendiente
    }

    const getAppointmentTypeColor = (kind) => {
        const colors = {
            monitoreo: "border-l-chart-4",
            puncion: "border-l-chart-2",
            turno: "border-l-chart-1"
        }
        return colors[kind] || "border-l-primary"
    }

    if (loadingAppointments) {
        return (
            <DashboardLayout role="paciente">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Cargando citas...</p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout role="paciente">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Mis Citas</h2>
                        <p className="text-muted-foreground">Gestiona y revisa todas tus citas programadas</p>
                    </div>
                    <Button asChild size="lg">
                        <Link to="/paciente/citas">
                            <Calendar className="mr-2 h-4 w-4" />
                            Solicitar Nueva Cita
                        </Link>
                    </Button>
                </div>

                {appointments.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">No tienes citas programadas</h3>
                        <p className="text-muted-foreground mb-6">Solicita una nueva cita para comenzar</p>
                        <Button asChild>
                            <Link to="/paciente/citas">
                                <Calendar className="mr-2 h-4 w-4" />
                                Solicitar Cita
                            </Link>
                        </Button>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {appointments.map((appointment) => {
                            const statusConfig = getStatusConfig(appointment.status)
                            const StatusIcon = statusConfig.icon
                            
                            return (
                                <Card 
                                    key={appointment.id} 
                                    className={`overflow-hidden border-l-4 ${getAppointmentTypeColor(appointment.kind)} transition-all hover:shadow-lg`}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <CardTitle className="text-xl mb-2">{appointment.type}</CardTitle>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <User className="h-4 w-4" />
                                                    <span className="text-sm font-medium">{appointment.doctor}</span>
                                                </div>
                                            </div>
                                            <Badge className={statusConfig.className}>
                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                {statusConfig.label}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <Separator />

                                    <CardContent className="pt-6">
                                        {appointment.kind !== "monitoreo" ? (
                                            <div className="space-y-4">
                                                <div className="grid gap-4 md:grid-cols-3">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Fecha</span>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-primary" />
                                                            <span className="text-sm font-semibold">{appointment.date}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Hora</span>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4 text-primary" />
                                                            <span className="text-sm font-semibold">{appointment.time}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Ubicación</span>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-4 w-4 text-primary" />
                                                            <span className="text-sm font-semibold">{appointment.location}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            renderMonitoreoCard(appointment)
                                        )}
                                    </CardContent>

                                    {appointment.status === "confirmada" && appointment.kind === "turno" && appointment.isReal && (
                                        <>
                                            <Separator />
                                            <CardFooter className="pt-4">
                                                <Button 
                                                    variant="destructive" 
                                                    className="w-full"
                                                    disabled={cancelingTurno === appointment.id}
                                                    onClick={() => handleCancelarTurno(appointment.id)}
                                                >
                                                    {cancelingTurno === appointment.id ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Cancelando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="mr-2 h-4 w-4" />
                                                            Cancelar Cita
                                                        </>
                                                    )}
                                                </Button>
                                            </CardFooter>
                                        </>
                                    )}
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}