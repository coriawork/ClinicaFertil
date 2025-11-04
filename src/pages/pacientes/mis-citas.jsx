import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react"

export default function MyAppointmentsPage() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

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
      type: "Monitoreo Ecográfico",
      doctor: "Dr. Carlos Rodríguez",
      date: "18 Ene 2025",
      time: "09:30",
      location: "Sala de Ecografía 2",
      status: "confirmada",
    },
    {
      id: "2",
      type: "Punción Ovárica",
      doctor: "Dr. Carlos Rodríguez",
      date: "20 Ene 2025",
      time: "08:00",
      location: "Quirófano 1",
      status: "pendiente",
    },
    {
      id: "3",
      type: "Consulta de Seguimiento",
      doctor: "Dr. Carlos Rodríguez",
      date: "15 Ene 2025",
      time: "10:00",
      location: "Consultorio 3",
      status: "completada",
    },
  ]

  const getStatusBadge = (status) => {
    const variants = {
      confirmada: { variant: "default", label: "Confirmada" },
      pendiente: { variant: "secondary", label: "Pendiente" },
      completada: { variant: "outline", label: "Completada" },
    }
    const config = variants[status] || { variant: "outline", label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
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

        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{appointment.type}</CardTitle>
                    <CardDescription>{appointment.doctor}</CardDescription>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-3">
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
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{appointment.location}</p>
                      <p className="text-xs text-muted-foreground">Ubicación</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
