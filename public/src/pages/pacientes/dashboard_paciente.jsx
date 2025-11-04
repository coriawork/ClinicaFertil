import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MessageCircle, Heart, FileText, Clock, Activity } from "lucide-react"

export default function PatientDashboard() {
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

  const quickActions = [
    {
      title: "Solicitar Cita",
      description: "Agendar una nueva consulta",
      icon: Calendar,
      href: "/paciente/citas",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Mis Citas",
      description: "Ver citas programadas",
      icon: Clock,
      href: "/paciente/mis-citas",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Historia Clínica",
      description: "Ver mi historial médico",
      icon: FileText,
      href: "/paciente/historia",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Consultas",
      description: "Hacer preguntas al chatbot",
      icon: MessageCircle,
      href: "/paciente/chatbot",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "Donación",
      description: "Registrar donación",
      icon: Heart,
      href: "/paciente/donacion",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Mi Tratamiento",
      description: "Seguimiento de tratamiento",
      icon: Activity,
      href: "/paciente/tratamiento",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <DashboardLayout role="paciente">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Bienvenida, {user.name}</h2>
          <p className="text-muted-foreground">Gestiona tus citas y consulta tu información médica</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.href} to={action.href}>
                <Card className="transition-all hover:shadow-md">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${action.bgColor}`}>
                      <Icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription className="text-sm">{action.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Próximas Citas</CardTitle>
              <CardDescription>Tus citas programadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium text-foreground">Consulta de Seguimiento</p>
                    <p className="text-sm text-muted-foreground">Dr. Carlos Rodríguez</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">15 Ene 2025</p>
                    <p className="text-sm text-muted-foreground">10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium text-foreground">Monitoreo Ecográfico</p>
                    <p className="text-sm text-muted-foreground">Dr. Carlos Rodríguez</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">18 Ene 2025</p>
                    <p className="text-sm text-muted-foreground">09:30 AM</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full bg-transparent" asChild>
                <Link to="/paciente/mis-citas">Ver todas las citas</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado del Tratamiento</CardTitle>
              <CardDescription>Información actual</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-22">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Fase actual</span>
                            <span className="font-medium text-foreground">Estimulación Ovárica</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Día del ciclo</span>
                            <span className="font-medium text-foreground">Día 8</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Próximo monitoreo</span>
                            <span className="font-medium text-foreground">18 Ene 2025</span>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                        <Link to="/paciente/tratamiento">Ver detalles completos</Link>
                    </Button>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
