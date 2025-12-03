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
import { ArrowLeft, CalendarIcon, Check, Info, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

// Simulación de datos de médicos (reemplazar con API real)
const MEDICOS = [
    { id: "dr-gomez", nombre: "Dr. Juan Gómez", especialidad: "Endocrinología Reproductiva" },
    { id: "dra-lopez", nombre: "Dra. María López", especialidad: "Ginecología" },
    { id: "dr-fernandez", nombre: "Dr. Carlos Fernández", especialidad: "Andrología" },
    { id: "dra-martinez", nombre: "Dra. Ana Martínez", especialidad: "Fertilidad" },
    { id: "dr-rodriguez", nombre: "Dr. Luis Rodríguez", especialidad: "Embriología" },
    { id: "dra-sanchez", nombre: "Dra. Carmen Sánchez", especialidad: "Medicina Reproductiva" }
]

// Simulación de disponibilidad ampliada (reemplazar con API real)
const DISPONIBILIDAD_MEDICOS = {
    "dr-gomez": {
        "2025-12-11": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "16:00", "16:30", "17:00"],
        "2025-11-12": ["08:00", "08:30", "09:00", "14:00", "14:30", "15:00", "15:30", "16:00", "17:00", "17:30"],
        "2025-11-13": ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "15:00", "16:00"],
        "2025-11-14": ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
        "2025-11-15": ["08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
        "2025-11-18": ["08:00", "08:30", "09:00", "09:30", "10:00", "16:00", "16:30", "17:00", "17:30"],
        "2025-11-19": ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"],
        "2025-11-20": ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    },
    "dra-lopez": {
        "2025-11-26": ["09:00", "10:00", "11:00", "14:00", "14:30", "15:00", "15:30", "16:00"],
        "2025-11-12": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "15:00"],
        "2025-11-13": ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"],
        "2025-11-14": ["08:00", "09:00", "10:00", "11:00", "14:30", "15:30", "16:30"],
        "2025-12-15": ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"],
        "2025-11-18": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
        "2025-11-19": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00"],
        "2025-11-20": ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30"],
    },
    "dr-fernandez": {
        "2025-11-11": ["08:00", "09:00", "10:00", "10:30", "11:00", "11:30", "15:00", "16:00"],
        "2025-11-12": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
        "2025-11-13": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
        "2025-11-14": ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"],
        "2025-11-15": ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00"],
        "2025-11-18": ["08:30", "09:30", "10:30", "11:30", "14:30", "15:30", "16:30"],
        "2025-12-22": ["14:00", "15:00", "16:00", "17:00"],
        "2025-11-20": ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
    },
    "dra-martinez": {
        "2025-11-11": ["08:00", "09:00", "10:00", "11:00", "14:00", "14:30", "15:00", "15:30", "16:00"],
        "2025-11-12": ["09:00", "10:00", "10:30", "11:00", "14:30", "15:00", "15:30", "16:00", "17:00"],
        "2025-11-13": ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
        "2025-11-14": ["08:30", "09:30", "10:30", "11:30", "14:00", "15:00", "16:00"],
        "2025-11-15": ["09:00", "10:00", "11:00", "14:00", "14:30", "15:00", "15:30"],
        "2025-11-18": ["08:00", "08:30", "09:00", "09:30", "10:00", "14:00", "15:00", "16:00"],
        "2025-11-19": ["10:00", "11:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"],
        "2025-11-20": ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00"],
    },
    "dr-rodriguez": {
        "2025-11-11": ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"],
        "2025-11-12": ["08:00", "09:00", "10:00", "11:00"],
        "2025-11-13": ["14:00", "15:00", "16:00", "17:00"],
        "2025-12-14": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00"],
        "2025-11-15": ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30"],
        "2025-11-18": ["14:00", "15:00", "16:00", "17:00"],
        "2025-11-19": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
        "2025-11-20": ["14:30", "15:30", "16:30", "17:30"],
    },
    "dra-sanchez": {
        "2025-11-11": ["08:30", "09:30", "10:30", "11:30", "15:00", "16:00"],
        "2025-11-12": ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"],
        "2025-11-13": ["08:00", "09:00", "10:00", "11:00"],
        "2025-11-14": ["14:00", "15:00", "16:00", "17:00"],
        "2025-11-15": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
        "2025-11-18": ["14:30", "15:00", "15:30", "16:00", "16:30", "17:00"],
        "2025-11-19": ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00"],
        "2025-11-20": ["08:00", "08:30", "09:00", "09:30", "10:00"],
    }
}

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

    // Calcular disponibilidad general (suma de todos los médicos)
    const getDisponibilidadGeneral = (fecha) => {
        const fechaKey = fecha.toISOString().split('T')[0]
        const horariosUnicos = new Set()
        
        Object.values(DISPONIBILIDAD_MEDICOS).forEach(disponibilidad => {
            if (disponibilidad[fechaKey]) {
                disponibilidad[fechaKey].forEach(hora => horariosUnicos.add(hora))
            }
        })
        
        return Array.from(horariosUnicos).sort()
    }

    // Obtener médico con más disponibilidad para una fecha y hora específicas
    const getMedicoConMasDisponibilidad = (fecha, hora) => {
        const fechaKey = fecha.toISOString().split('T')[0]
        let medicoSeleccionado = null
        let maxHorarios = 0

        MEDICOS.forEach(medico => {
            const disponibilidad = DISPONIBILIDAD_MEDICOS[medico.id]?.[fechaKey] || []
            
            // Verificar si el médico tiene disponible la hora seleccionada
            if (disponibilidad.includes(hora)) {
                const cantidadHorarios = disponibilidad.length
                
                if (cantidadHorarios > maxHorarios) {
                    maxHorarios = cantidadHorarios
                    medicoSeleccionado = medico
                }
            }
        })

        return medicoSeleccionado
    }

    // Verificar si una fecha tiene disponibilidad
    const hasAvailability = (date) => {
        const fechaKey = date.toISOString().split('T')[0]
        
        if (selectedDoctor && selectedDoctor !== "general") {
            const disponibilidad = DISPONIBILIDAD_MEDICOS[selectedDoctor]?.[fechaKey]
            return disponibilidad && disponibilidad.length > 0
        }
        
        // Verificar disponibilidad general
        return Object.values(DISPONIBILIDAD_MEDICOS).some(
            disponibilidad => disponibilidad[fechaKey] && disponibilidad[fechaKey].length > 0
        )
    }

    // Agrupar horarios por turno (mañana/tarde)
    const groupTimesByShift = (times) => {
        const morning = times.filter(time => {
            const hour = parseInt(time.split(':')[0])
            return hour < 12
        })
        const afternoon = times.filter(time => {
            const hour = parseInt(time.split(':')[0])
            return hour >= 12
        })
        return { morning, afternoon }
    }

    // Actualizar horarios disponibles cuando cambia la fecha o el médico
    useEffect(() => {
        if (selectedDate) {
            const fechaKey = selectedDate.toISOString().split('T')[0]
            
            if (selectedDoctor && selectedDoctor !== "general") {
                // Mostrar horarios del médico seleccionado
                const horarios = DISPONIBILIDAD_MEDICOS[selectedDoctor]?.[fechaKey] || []
                setAvailableTimes(horarios)
                setAssignedDoctor(null)
            } else {
                // Mostrar disponibilidad general
                const horarios = getDisponibilidadGeneral(selectedDate)
                setAvailableTimes(horarios)
            }
            
            // Resetear hora seleccionada si ya no está disponible
            if (selectedTime && !availableTimes.includes(selectedTime)) {
                setSelectedTime("")
            }
        } else {
            setAvailableTimes([])
            setSelectedTime("")
            setAssignedDoctor(null)
        }
    }, [selectedDate, selectedDoctor])

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
        
        // Aquí enviarías los datos a tu API
        const citaData = {
            medicoId: (selectedDoctor && selectedDoctor !== "general") ? selectedDoctor : assignedDoctor?.id,
            medicoNombre: (selectedDoctor && selectedDoctor !== "general")
                ? MEDICOS.find(m => m.id === selectedDoctor)?.nombre 
                : assignedDoctor?.nombre,
            fecha: selectedDate,
            hora: selectedTime,
            notas: notes,
            pacienteId: user.id
        }
        
        console.log("Datos de la cita:", citaData)
        
        setIsSubmitted(true)
        setTimeout(() => {
            navigate("/paciente/mis-citas")
        }, 2000)
    }

    if (isSubmitted) {
        return (
            <DashboardLayout role="paciente">
                <div className="flex min-h-[60vh] items-center justify-center">
                    <Card className="w-full max-w-md">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center space-y-4 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <Check className="h-8 w-8 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-foreground">Cita Solicitada</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Tu solicitud ha sido enviada. Recibirás una confirmación pronto.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
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
                        <CardHeader>
                            <CardTitle>Información de la Cita</CardTitle>
                            <CardDescription>
                                Puedes elegir un médico específico o ver la disponibilidad general
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="doctor">Médico (Opcional)</Label>
                                <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                                    <SelectTrigger id="doctor">
                                        <SelectValue placeholder="Ver disponibilidad general" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="general">Disponibilidad General</SelectItem>
                                        {MEDICOS.map(medico => (
                                            <SelectItem key={medico.id} value={medico.id}>
                                                <div className="flex flex-col">
                                                    <span>{medico.nombre}</span>
                                                    <span className="text-xs text-muted-foreground">{medico.especialidad}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {(!selectedDoctor || selectedDoctor === "general") && (
                                    <p className="text-sm text-muted-foreground">
                                        Se asignará automáticamente el médico con mayor disponibilidad
                                    </p>
                                )}
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
                                                date.getDay() === 0 || 
                                                date.getDay() === 6 ||
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
                                                {morning.map((time) => (
                                                    <Button
                                                        key={time}
                                                        type="button"
                                                        variant={selectedTime === time ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setSelectedTime(time)}
                                                        className={cn(
                                                            "font-mono",
                                                            selectedTime === time && "ring-2 ring-primary ring-offset-2"
                                                        )}
                                                    >
                                                        {time}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {afternoon.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium text-muted-foreground">Tarde</h4>
                                            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                                                {afternoon.map((time) => (
                                                    <Button
                                                        key={time}
                                                        type="button"
                                                        variant={selectedTime === time ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setSelectedTime(time)}
                                                        className={cn(
                                                            "font-mono",
                                                            selectedTime === time && "ring-2 ring-primary ring-offset-2"
                                                        )}
                                                    >
                                                        {time}
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
                                        <span className="text-muted-foreground"> ({assignedDoctor.especialidad})</span>
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