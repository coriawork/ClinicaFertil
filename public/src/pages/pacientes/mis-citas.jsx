import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader,CardFooter, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react"


export default function MyAppointmentsPage() {
    const { user, isLoading } = useAuth()
    const navigate = useNavigate()
    const [monitoreoTimes, setMonitoreoTimes] = useState({})
    
    const monitoreoDias = [
        { label: "lunes 18", value: "2025-01-18" },
        { label: "martes 19", value: "2025-01-19" },
        { label: "miércoles 20", value: "2025-01-20" },
    ]
    const monitoreoHoras = Array.from({ length: ((22 - 6) * 60) / 20 + 1 }, (_, i) => {
        const totalMinutes = 6 * 60 + i * 20
        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    })

    
    const [monitoreoSeleccion, setMonitoreoSeleccion] = useState({}) // { [id]: { dia, hora } }

    const handleSeleccionMonitoreo = (id, dia, hora) => {
        setMonitoreoSeleccion(prev => ({
            ...prev,
            [id]: { dia, hora }
        }))
    }


    useEffect(() => {
        if (!isLoading && (!user || user.role !== "paciente")) {
            navigate("/")
        }
    }, [user, isLoading, navigate])

    if (isLoading || !user) {
        return null
    }

    const appointments = [
        {
            id: "1",
            kind: "monitoreo",
            type: "Monitoreo ",
            doctor: "Dr. Carlos Rodríguez",
            date: "18 Ene 2025",
            time: "09:30",
            location: "Sala de Ecografía 2",
            status: "pendiente",
        },
        {
            id: "4",
            kind: "monitoreo",
            type: "Monitoreo ",
            doctor: "Dr. Carlos Rodríguez",
            date: "18 Ene 2025",
            time: "09:30",
            location: "Sala de Ecografía 2",
            status: "confirmada",
        },
        {
            id: "2",
            kind: "puncion",
            type: "Punción Ovárica",
            doctor: "Dr. Carlos Rodríguez",
            date: "20 Ene 2025",
            time: "08:00",
            location: "Quirófano 1",
            status: "pendiente",
        },
        {
            id: "3",
            kind: "turno",
            type: "Consulta de Seguimiento",
            doctor: "Dr. Carlos Rodríguez",
            date: "15 Ene 2025",
            time: "10:00",
            location: "Consultorio 3",
            status: "confirmada",
        },
    ]


    const handleChangeTime = (id, newTime) => {
        setMonitoreoTimes(prev => ({ ...prev, [id]: newTime }))
    }
    const renderMonitoreoCard = (appointment) => {
    // Si está confirmada, solo mostrar el día y hora confirmados
    if (appointment.status === "confirmada") {
        return (
            <div className="flex flex-col items-center gap-2 w-full">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{appointment.date}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{appointment.time}</span>
                </div>
            </div>
        )
    }
    // Si no está confirmada, mostrar el calendario de selección
    return (
        <div className="w-full flex flex-col gap-2">
            <div className="w-full  h-100 overflow-y-scroll">
                <table className="w-full  border border-white/30 rounded text-center">
                    <thead>
                        <tr>
                            <th className="px-2 py-1 border border-white/30 bg-black/20 text-white">hs</th>
                            {monitoreoDias.map(dia => (
                                <th key={dia.value} className="px-4 py-1 border border-white/30 bg-black/20 text-white">{dia.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {monitoreoHoras.map(hora => (
                            <tr key={hora}>
                                <td className="px-2 py-1 border border-white/30 text-white">{hora}</td>
                                {monitoreoDias.map(dia => {
                                    const seleccionado = monitoreoSeleccion[appointment.id]?.dia === dia.value && monitoreoSeleccion[appointment.id]?.hora === hora
                                    return (
                                        <td
                                            key={dia.value}
                                            className={`px-4 py-2 border border-white/30 cursor-pointer transition-all ${seleccionado ? "bg-green-400 text-black font-bold" : "hover:bg-white/10 text-white"}`}
                                            onClick={() => handleSeleccionMonitoreo(appointment.id, dia.value, hora)}
                                        >
                                            {seleccionado ? "Elegido" : ""}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Button
                className="w-full mt-2"
                disabled={!monitoreoSeleccion[appointment.id]}
                onClick={() => alert(`Confirmado: ${monitoreoSeleccion[appointment.id]?.dia} ${monitoreoSeleccion[appointment.id]?.hora}`)}
            >
                Confirmar Horario
            </Button>
        </div>
    )
}

    const handleChangeDate = (id, direction) => {
        alert(`Mover fecha de monitoreo ${direction === 1 ? "adelante" : "atrás"}`)
    }

    const renderAction = (appointment) => {
        if (appointment.kind === "turno") {
            return (
                <Button className='w-full bg-chart-3 text-black hover:bg-chart-3/90'>
                    Cancelar Turno
                </Button>
            )
        }
        if (appointment.kind === "puncion") {
            return null // Solo visualización
        }
        if (appointment.kind === "monitoreo") {
            return null
        }
        return null
    }

    const getStatusBadge = (status) => {
        const variants = {
            confirmada: { variant: "default", label: "Confirmada" },
            pendiente: { variant: "outline", label: "Pendiente", "className": "bg-yellow-200 text-yellow-800 border-yellow-600" },
            completada: { variant: "outline", label: "Completada","className": "bg-chart-1 text-black border-green-600" },
        }
        const config = variants[status] || { variant: "outline", label: status }
        return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>
    }
    const getStatusAction={
        'confirmada':<Button className='w-full bg-chart-3 text-black hover:bg-chart-3/90'>Cancelar Turno</Button>,
        'pendiente':<Button className='w-full'>Confirmar Turno</Button>,

    }

    return (
    <DashboardLayout role="paciente">
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Mis Citas</h2>
                    <p className="text-muted-foreground">Todas tus citas programadas</p>
                </div>
                <Button asChild>
                    <Link to="/paciente/citas">
                        <Calendar className="mr-2 h-4 w-4" />
                        Nueva Cita
                    </Link>
                </Button>
            </div>

            <div className="space-y-4 ">
                {appointments.map((appointment) => (
                    <Card key={appointment.id} className="bg-primary/20 border-primary/20 shadow-2xl">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-lg">{appointment.type}</CardTitle>
                                    <CardDescription>{appointment.doctor}</CardDescription>
                                </div>
                                {getStatusBadge(appointment.status)}
                            </div>
                        </CardHeader>
                        <CardContent className="items-center justify-center w-full flex">
                            {appointment.kind !== "monitoreo" ? (
                                <div className="grid gap-3 w-full justify-center items-center md:grid-cols-2">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{appointment.date}</p>
                                            <p className="text-xs text-muted-foreground">Fecha</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{appointment.time}</p>
                                            <p className="text-xs text-muted-foreground">Hora</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Solo mostrar el mini calendario para monitoreo
                                renderMonitoreoCard(appointment)
                            )}
                        </CardContent>
                        <CardFooter>
                            {renderAction(appointment)}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    </DashboardLayout>
)
}
