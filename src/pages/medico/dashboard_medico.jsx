"use client"

import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, Calendar, Activity, ClipboardList, Syringe, FileCheck, TrendingUp } from "lucide-react"

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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pacientes Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+2 desde el mes pasado</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">3 consultas, 5 monitoreos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tratamientos en Curso</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">8 estimulación, 4 FIV</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estudios Pendientes</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Resultados por revisar</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                      <CardTitle className="text-base">{action.title}</CardTitle>
                      <CardDescription className="text-xs">{action.description}</CardDescription>
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
              <CardTitle>Citas de Hoy</CardTitle>
              <CardDescription>Agenda del día</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "María González", time: "09:00", type: "Consulta inicial" },
                  { name: "Laura Pérez", time: "10:00", type: "Monitoreo ecográfico" },
                  { name: "Ana Martínez", time: "11:30", type: "Revisión de resultados" },
                ].map((appointment, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium text-foreground">{appointment.name}</p>
                      <p className="text-sm text-muted-foreground">{appointment.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{appointment.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-4 w-full bg-transparent" asChild>
                <Link to="/medico/agenda">Ver agenda completa</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alertas y Recordatorios</CardTitle>
              <CardDescription>Acciones pendientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                  <p className="text-sm font-medium text-orange-900">Punción programada</p>
                  <p className="text-xs text-orange-700">María González - Mañana 08:00</p>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <p className="text-sm font-medium text-blue-900">Resultados disponibles</p>
                  <p className="text-xs text-blue-700">5 estudios listos para revisar</p>
                </div>
                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                  <p className="text-sm font-medium text-green-900">Transferencia exitosa</p>
                  <p className="text-xs text-green-700">Laura Pérez - Beta HCG en 10 días</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
