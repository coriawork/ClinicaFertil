"use client"

import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, Calendar, Activity, ClipboardList, Syringe, FileCheck, TrendingUp, Clock } from "lucide-react"
import {CardShort} from "@/components/ui/card-short"
import { CardInfo } from "../../components/ui/card-info"
import { CardList } from "../../components/ui/card-list"
export default function DoctorDashboard() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "medico")) {
      navigate("/")
    }
  }, [user, isLoading, navigate])

  if (isLoading || !user) {
    return null
  }

  const quickActions = [
    {
      title: "Mis Pacientes",
      description: "Ver lista de pacientes",
      icon: Users,
      href: "/medico/pacientes",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Historia Clínica",
      description: "Registrar historia clínica",
      icon: FileText,
      href: "/medico/historia-clinica",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Solicitar Estudios",
      description: "Pedir análisis y estudios",
      icon: ClipboardList,
      href: "/medico/estudios",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Objetivos de Tratamiento",
      description: "Definir plan terapéutico",
      icon: TrendingUp,
      href: "/medico/objetivos",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Tratamientos",
      description: "Gestionar tratamientos",
      icon: Syringe,
      href: "/medico/tratamientos",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Monitoreo",
      description: "Seguimiento de pacientes",
      icon: Activity,
      href: "/medico/monitoreo",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "Punciones",
      description: "Registrar punciones",
      icon: FileCheck,
      href: "/medico/punciones",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Agenda",
      description: "Ver citas programadas",
      icon: Calendar,
      href: "/medico/agenda",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
  ]

  return (
    <DashboardLayout role="medico">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Bienvenido, {user.name}</h2>
          <p className="text-muted-foreground">Gestiona tus pacientes y tratamientos</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link to="/medico/agenda">
                <CardInfo title="Citas Agendadas" cant="24" desc="Próximas citas programadas">
                    <Calendar className="text-primary h-4 w-6"/>
                </CardInfo>
            </Link>
            <Link to="/medico/tratamientos">
                <CardInfo title="Tratamientos en Curso" cant="12" desc="8 estimulación, 4 FIV">
                    <Activity className="h-4 w-6 text-primary" />
                </CardInfo>
            </Link>
            <Link to="/medico/estudios" className="">
                <CardInfo title="Estudios Pendientes" cant="5" desc="Resultados por revisar">
                    <ClipboardList className="h-4 w-6 text-primary" />
                </CardInfo>
            </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2  lg:grid-cols-4">
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

        <div className="grid gap-4  md:grid-cols-2">
            <CardList title="Citas de hoy" desc="Agenda" data={[{ h1: "María González", right: "09:00", h2: "Consulta inicial" },{ h1: "Laura Pérez", right: "10:00", h2: "Monitoreo ecográfico" },{ h1: "Ana Martínez", right: "11:30", h2: "Revisión de resultados" }]}>
                <Button variant="outline" className="mt-4 bg-white  w-full" asChild>
                    <Link to="/medico/agenda">Ver agenda completa</Link>
                </Button>
            </CardList>
            <CardList title="Alertas y recordatorios" desc="Acciones pendientes" data={[{ h1: "María Punción programada", h2: "María González - Mañana 08:00", right:  <Clock className="h-4 w-4 text-purple-700" />}]}/>

        </div>
      </div>
    </DashboardLayout>
  )
}
