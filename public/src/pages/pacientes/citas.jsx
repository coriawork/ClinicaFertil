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
import { ArrowLeft, CalendarIcon, Check } from "lucide-react"

export default function AppointmentBooking() {
    const { user, isLoading } = useAuth()
    const navigate = useNavigate()
    const [appointmentType, setAppointmentType] = useState("")
    const [selectedDate, setSelectedDate] = useState(undefined)
    const [selectedTime, setSelectedTime] = useState("")
    const [notes, setNotes] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)

    useEffect(() => {
        if (!isLoading && (!user || user.role !== "paciente")) {
            navigate("/")
        }
    }, [user, isLoading, navigate])

    if (isLoading || !user) {
        return null
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsSubmitted(true)
        setTimeout(() => {
            navigate("/paciente/mis-citas")
        }, 2000)
    }

    const availableTimes = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"]

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

    return (
        <DashboardLayout role="paciente">
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/paciente">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Link>
                    </Button>
                </div>

                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Solicitar Cita</h2>
                    <p className="text-muted-foreground">Agenda una nueva consulta o monitoreo</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de la Cita</CardTitle>
                            <CardDescription>Completa los detalles para tu cita</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="type">Tipo de Cita</Label>
                                <Select value={appointmentType} onValueChange={setAppointmentType} required>
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="Selecciona el tipo de cita" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="consulta">Consulta General</SelectItem>
                                        <SelectItem value="monitoreo">Monitoreo Ecográfico</SelectItem>
                                        <SelectItem value="resultados">Revisión de Resultados</SelectItem>
                                        <SelectItem value="seguimiento">Seguimiento de Tratamiento</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Fecha Preferida</Label>
                                <div className="rounded-lg border p-4">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                        disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                                        className="mx-auto"
                                    />
                                </div>
                            </div>

                            {selectedDate && (
                                <div className="space-y-2">
                                    <Label htmlFor="time">Hora Preferida</Label>
                                    <Select value={selectedTime} onValueChange={setSelectedTime} required>
                                        <SelectTrigger id="time">
                                            <SelectValue placeholder="Selecciona la hora" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableTimes.map((time) => (
                                                <SelectItem key={time} value={time}>
                                                    {time}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notas Adicionales (Opcional)</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Describe el motivo de tu consulta o cualquier información relevante..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={4}
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button type="submit" disabled={!appointmentType || !selectedDate || !selectedTime}>
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
