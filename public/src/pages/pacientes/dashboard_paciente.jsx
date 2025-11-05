import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MessageCircle, Heart, FileText, Clock, Activity } from "lucide-react"
import {CardShort} from "@/components/ui/card-short"
import {CardList} from "@/components/ui/card-list"

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
                    <CardShort title={action.title} description={action.description} color={action.color} bgColor={action.bgColor}>
                        <action.icon className={`h-6 w-6 ${action.color}`} />
                    </CardShort>
                </Link>
            )
            })}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
            <CardList title="Proximas Citas" data={[{ h1: "Consulta de Seguimiento", right: <div><p>15 Ene 2025</p><p>10:00 AM</p></div>, h2: "Dr. Carlos Rodríguez" },{ h1: "Monitoreo ecográfico", right: <div><p>18 Ene 2025</p><p>09:30 AM</p></div>, h2: "Laura Pérez" }]}>
                <Button variant="primary" className="mt-4 w-full ">Ver Citas</Button>
            </CardList> 
      </div>
      </div>    
    </DashboardLayout>
  )
}
