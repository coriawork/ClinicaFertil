"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Clock, User, MapPin } from "lucide-react"

export default function AgendaPage() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentWeek, setCurrentWeek] = useState(new Date())

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "medico")) {
      navigate("/")
    }
  }, [user, isLoading, navigate])

  if (isLoading || !user) {
    return null
  }

  const appointments = [
    {
      id: 1,
      patientName: "María González",
      patientId: "P001",
      date: new Date(2025, 0, 10),
      time: "09:00",
      duration: 60,
      type: "Consulta inicial",
      status: "confirmada",
      location: "Consultorio 1",
      notes: "Primera consulta de fertilidad",
    },
  ]

  const getAppointmentsForDate = (date) => {
    return appointments.filter(
      (apt) =>
        apt.date.getDate() === date.getDate() &&
        apt.date.getMonth() === date.getMonth() &&
        apt.date.getFullYear() === date.getFullYear(),
    )
  }

  const getWeekDays = (date) => {
    const week = []
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay() + 1)

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      week.push(day)
    }
    return week
  }

  const weekDays = getWeekDays(currentWeek)

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmada":
        return "bg-green-100 text-green-800 border-green-200"
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelada":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "Consulta inicial":
        return "bg-blue-100 text-blue-800"
      case "Monitoreo ecográfico":
        return "bg-purple-100 text-purple-800"
      case "Punción folicular":
        return "bg-orange-100 text-orange-800"
      case "Transferencia embrionaria":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const selectedDateAppointments = getAppointmentsForDate(selectedDate)

  return (
    <DashboardLayout role="medico">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agenda</h1>
            <p className="text-muted-foreground">Gestiona tus citas y horarios</p>
          </div>
          <Button>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Nueva Cita
          </Button>
        </div>

        <Tabs defaultValue="day" className="space-y-4">
          <TabsList>
            <TabsTrigger value="day">Día</TabsTrigger>
            <TabsTrigger value="week">Semana</TabsTrigger>
            <TabsTrigger value="month">Mes</TabsTrigger>
          </TabsList>

          <TabsContent value="day" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Calendario</CardTitle>
                  <CardDescription>Selecciona una fecha</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                  />
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total de citas:</span>
                      <span className="font-medium">{selectedDateAppointments.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Confirmadas:</span>
                      <span className="font-medium text-green-600">
                        {selectedDateAppointments.filter((a) => a.status === "confirmada").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Pendientes:</span>
                      <span className="font-medium text-yellow-600">
                        {selectedDateAppointments.filter((a) => a.status === "pendiente").length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>
                    Citas del{" "}
                    {selectedDate.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
                  </CardTitle>
                  <CardDescription>
                    {selectedDateAppointments.length} cita{selectedDateAppointments.length !== 1 ? "s" : ""} programada
                    {selectedDateAppointments.length !== 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDateAppointments.length === 0 ? (
                    <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
                      <div className="text-center">
                        <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">No hay citas programadas para este día</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedDateAppointments
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((appointment) => (
                          <div key={appointment.id} className="rounded-lg border p-4 transition-all hover:shadow-md">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-semibold">{appointment.time}</span>
                                  <span className="text-sm text-muted-foreground">({appointment.duration} min)</span>
                                  <Badge className={getTypeColor(appointment.type)}>{appointment.type}</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">{appointment.patientName}</span>
                                  <span className="text-sm text-muted-foreground">({appointment.patientId})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">{appointment.location}</span>
                                </div>
                                {appointment.notes && (
                                  <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                                )}
                              </div>
                              <Badge variant="outline" className={getStatusColor(appointment.status)}>
                                {appointment.status}
                              </Badge>
                            </div>
                            <div className="mt-3 flex gap-2">
                              <Button size="sm" variant="outline">
                                Ver detalles
                              </Button>
                              <Button size="sm" variant="outline">
                                Iniciar consulta
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
