"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CalendarIcon, Check, Info, Clock, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import axios from "axios"
import { toast } from "sonner"
// Lista de médicos disponibles (puedes obtenerlo de otra API si es necesario)
const MEDICOS = [
    { id: 1, nombre: "Juan Gómez"},
    { id: 2, nombre: "Carlos Rodriguez"},
    { id: 3, nombre: "Carlos Fernández"},
]

export default function AppointmentBooking() {
    const { user, isLoading } = useAuth()
    const navigate = useNavigate()
    const [selectedDoctor, setSelectedDoctor] = useState("general")
    const [selectedDate, setSelectedDate] = useState(undefined)
    const [selectedTime, setSelectedTime] = useState("")
    const [notes, setNotes] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [availableTimes, setAvailableTimes] = useState([])
    const [assignedDoctor, setAssignedDoctor] = useState(null)
    const [loadingSlots, setLoadingSlots] = useState(false)
    const [turnosDisponibles, setTurnosDisponibles] = useState([]) // Todos los turnos de todos los médicos
    const [turnosPorMedico, setTurnosPorMedico] = useState({}) // Organizado por médico
    
    const Ids_medicos = [1, 2, 3] // IDs de los médicos a consultar

    // Cargar turnos disponibles de todos los médicos al montar el componente
    useEffect(() => {
        fetchTurnosDisponibles()
    }, [])

    const fetchTurnosDisponibles = () => {
        setLoadingSlots(true)
        
        // Hacer peticiones para cada médico
        const requests = Ids_medicos.map(idMedico => 
            axios.get(`/turnos/v1/get_turnos_medico?id_medico=${idMedico}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9ncnVwbyI6MTAsImlhdCI6MTc2NDg3NDgxNX0.Lgd1mqiMv6ZdPysSS0Eqwj0VawAXixUL7frx9pm4API`
                }
            })
        )

        axios.all(requests)
            .then(axios.spread((...responses) => {
                let todosLosTurnos = []
                let turnosPorMedicoTemp = {}

                responses.forEach((response, index) => {
                    const idMedico = Ids_medicos[index]
                    const turnosMedico = response.data.data
                        .filter(turno => turno.id_paciente === null) // Solo turnos disponibles
                        .map(turno => ({
                            ...turno,
                            id_medico: idMedico,
                            fecha_hora_obj: new Date(turno.fecha_hora)
                        }))
                    
                    turnosPorMedicoTemp[idMedico] = turnosMedico
                    todosLosTurnos = [...todosLosTurnos, ...turnosMedico]
                })

                setTurnosDisponibles(todosLosTurnos)
                setTurnosPorMedico(turnosPorMedicoTemp)
            }))
            .catch(error => {
                console.error('Error al cargar turnos disponibles:', error)
            })
            .finally(() => {
                setLoadingSlots(false)
            })
    }

    // Verificar si una fecha tiene disponibilidad
    const hasAvailability = (date) => {
        const fechaStr = date.toISOString().split('T')[0]
        
        if (selectedDoctor && selectedDoctor !== "general") {
            // Verificar disponibilidad del médico específico
            const turnosMedico = turnosPorMedico[parseInt(selectedDoctor)] || []
            return turnosMedico.some(turno => 
                turno.fecha_hora_obj.toISOString().split('T')[0] === fechaStr
            )
        }
        
        // Verificar disponibilidad general (cualquier médico)
        return turnosDisponibles.some(turno => 
            turno.fecha_hora_obj.toISOString().split('T')[0] === fechaStr
        )
    }

    // Obtener horarios disponibles para una fecha
    const getHorariosDisponibles = (fecha) => {
        const fechaStr = fecha.toISOString().split('T')[0]
        let turnos = []

        if (selectedDoctor && selectedDoctor !== "general") {
            // Horarios del médico específico
            turnos = turnosPorMedico[parseInt(selectedDoctor)] || []
        } else {
            // Horarios de todos los médicos
            turnos = turnosDisponibles
        }

        const horariosDelDia = turnos
            .filter(turno => turno.fecha_hora_obj.toISOString().split('T')[0] === fechaStr)
            .map(turno => ({
                hora: turno.fecha_hora_obj.toTimeString().slice(0, 5),
                id_turno: turno.id,
                id_medico: turno.id_medico
            }))
            .sort((a, b) => a.hora.localeCompare(b.hora))

        // Eliminar duplicados si hay múltiples médicos con el mismo horario
        const horariosUnicos = Array.from(
            new Map(horariosDelDia.map(item => [item.hora, item])).values()
        )

        return horariosUnicos
    }

    // Obtener médico con más disponibilidad para una fecha y hora específicas
    const getMedicoConMasDisponibilidad = (fecha, hora) => {
        const fechaStr = fecha.toISOString().split('T')[0]
        let medicoSeleccionado = null
        let maxHorarios = 0

        Object.entries(turnosPorMedico).forEach(([idMedico, turnos]) => {
            // Verificar si el médico tiene disponible la hora seleccionada
            const tieneHora = turnos.some(turno => 
                turno.fecha_hora_obj.toISOString().split('T')[0] === fechaStr &&
                turno.fecha_hora_obj.toTimeString().slice(0, 5) === hora
            )
            
            if (tieneHora) {
                const cantidadHorarios = turnos.filter(turno => 
                    turno.fecha_hora_obj.toISOString().split('T')[0] === fechaStr
                ).length
                
                if (cantidadHorarios > maxHorarios) {
                    maxHorarios = cantidadHorarios
                    medicoSeleccionado = MEDICOS.find(m => m.id === parseInt(idMedico))
                }
            }
        })

        return medicoSeleccionado
    }

    // Agrupar horarios por turno (mañana/tarde)
    const groupTimesByShift = (horarios) => {
        const morning = horarios.filter(item => {
            const hour = parseInt(item.hora.split(':')[0])
            return hour < 12
        })
        const afternoon = horarios.filter(item => {
            const hour = parseInt(item.hora.split(':')[0])
            return hour >= 12
        })
        return { morning, afternoon }
    }

    // Actualizar horarios disponibles cuando cambia la fecha o el médico
    useEffect(() => {
        if (selectedDate) {
            const horarios = getHorariosDisponibles(selectedDate)
            setAvailableTimes(horarios)
            
            // Resetear hora seleccionada si ya no está disponible
            if (selectedTime && !horarios.some(h => h.hora === selectedTime)) {
                setSelectedTime("")
            }
        } else {
            setAvailableTimes([])
            setSelectedTime("")
            setAssignedDoctor(null)
        }
    }, [selectedDate, selectedDoctor, turnosDisponibles])

    // Asignar médico automáticamente cuando se selecciona hora sin médico
    useEffect(() => {
        if (selectedDate && selectedTime && (!selectedDoctor || selectedDoctor === "general")) {
            const medico = getMedicoConMasDisponibilidad(selectedDate, selectedTime)
            setAssignedDoctor(medico)
        } else {
            setAssignedDoctor(null)
        }
    }, [selectedDate, selectedTime, selectedDoctor])

    const handleSubmit = (e) => {
        e.preventDefault()
        
        // Obtener el turno seleccionado
        const turnoSeleccionado = availableTimes.find(t => t.hora === selectedTime)
        
        if (!turnoSeleccionado) {
            toast.error('No se encontró el turno seleccionado')
            return
        }

        // Hacer la petición para reservar el turno
        axios.patch('/turnos/v1/reservar_turno', {
            id_paciente: user.id,
            id_turno: turnoSeleccionado.id_turno
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9ncnVwbyI6MTAsImlhdCI6MTc2NDg3NDgxNX0.Lgd1mqiMv6ZdPysSS0Eqwj0VawAXixUL7frx9pm4API`
            }
        })
        .then(response => {
            console.log("Turno reservado exitosamente:", response.data)
            setIsSubmitted(true)
            setTimeout(() => {
                navigate("/paciente/mis-citas")
            }, 2000)
        })
        .catch(error => {
            console.error('Error al reservar turno:', error)
            toast.error('Error al reservar el turno. Por favor, intenta nuevamente.')
        })
    }

    if (loadingSlots) {
        return (
            <DashboardLayout role="paciente">
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="text-foreground/60 text-lg">Cargando disponibilidad...</p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    const { morning, afternoon } = groupTimesByShift(availableTimes)

    return (
        <DashboardLayout role="paciente">
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Solicitar Cita</h2>
                    <p className="text-muted-foreground">Agenda una nueva consulta o monitoreo</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardContent className="space-y-6">
                            <div className="gap-4 flex flex-col">
                                {(!selectedDoctor || selectedDoctor === "general") && (
                                    <p className="text-sm text-muted-foreground">
                                        Se asignará automáticamente el médico con mayor disponibilidad
                                    </p>
                                )}
                                <Label htmlFor="doctor">Médico (Opcional)</Label>
                                <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                                    <SelectTrigger id="doctor" className={'rounded-[5px]'}>
                                        <SelectValue placeholder="Ver disponibilidad general" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="general">Disponibilidad General</SelectItem>
                                        {MEDICOS.map(medico => (
                                            <SelectItem key={medico.id} value={String(medico.id)}>
                                                <div className="flex flex-col">
                                                    <span>{medico.nombre}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                
                            </div>

                            <div className="space-y-2">
                                <Label>Fecha</Label>
                                <div className="rounded-lg border p-4">
                                    <div className="space-y-4">
                                        <div className="flex gap-2 justify-center flex-wrap">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const today = new Date()
                                                    if (hasAvailability(today)) {
                                                        setSelectedDate(today)
                                                    }
                                                }}
                                            >
                                                Hoy
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const tomorrow = new Date()
                                                    tomorrow.setDate(tomorrow.getDate() + 1)
                                                    if (hasAvailability(tomorrow)) {
                                                        setSelectedDate(tomorrow)
                                                    }
                                                }}
                                            >
                                                Mañana
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const nextWeek = new Date()
                                                    nextWeek.setDate(nextWeek.getDate() + 7)
                                                    if (hasAvailability(nextWeek)) {
                                                        setSelectedDate(nextWeek)
                                                    }
                                                }}
                                            >
                                                En 7 días
                                            </Button>
                                        </div>

                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={setSelectedDate}
                                            disabled={(date) => 
                                                date < new Date().setHours(0, 0, 0, 0) || 
                                                !hasAvailability(date)
                                            }
                                            captionLayout="dropdown-months"
                                            fromYear={new Date().getFullYear()}
                                            toYear={new Date().getFullYear() + 1}
                                            defaultMonth={selectedDate || new Date()}
                                            className="rounded-md border mx-auto"
                                            showOutsideDays={false}
                                        />
                                    </div>
                                </div>
                            </div>

                            {selectedDate && availableTimes.length > 0 && (
                                <div className="space-y-4">
                                    <Label>
                                        <Clock className="inline-block mr-2 h-4 w-4" />
                                        Horarios Disponibles
                                    </Label>
                                    
                                    {morning.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium text-muted-foreground">Mañana</h4>
                                            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                                                {morning.map((item) => (
                                                    <Button
                                                        key={`${item.hora}-${item.id_turno}`}
                                                        type="button"
                                                        variant={selectedTime === item.hora ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setSelectedTime(item.hora)}
                                                        className={cn(
                                                            "font-mono",
                                                            selectedTime === item.hora && "ring-2 ring-primary ring-offset-2"
                                                        )}
                                                    >
                                                        {item.hora}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {afternoon.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium text-muted-foreground">Tarde</h4>
                                            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                                                {afternoon.map((item) => (
                                                    <Button
                                                        key={`${item.hora}-${item.id_turno}`}
                                                        type="button"
                                                        variant={selectedTime === item.hora ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setSelectedTime(item.hora)}
                                                        className={cn(
                                                            "font-mono",
                                                            selectedTime === item.hora && "ring-2 ring-primary ring-offset-2"
                                                        )}
                                                    >
                                                        {item.hora}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedDate && availableTimes.length === 0 && (
                                <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertDescription>
                                        No hay horarios disponibles para esta fecha.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {assignedDoctor && (
                                <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertDescription>
                                        Se asignará a: <strong>{assignedDoctor.nombre}</strong> 
                                       
                                        <br />
                                        <span className="text-xs">Médico con mayor disponibilidad</span>
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notas (Opcional)</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Agrega cualquier información adicional sobre tu consulta..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button 
                                    type="submit" 
                                    disabled={!selectedDate || !selectedTime || availableTimes.length === 0}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    Solicitar Cita
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link to="/paciente">Cancelar</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </DashboardLayout>
    )
}