"use client"

import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, Calendar, Activity, ClipboardList, Syringe, FileCheck, TrendingUp } from "lucide-react"
import {CardShort} from "@/components/ui/card-short"

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
                <Card className="card-3d-hover bg-gradient-soft hover:shadow-lg ">
                        <CardHeader className="flex  flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm rounded-2xl text-background  font-medium ">Citas Hoy</CardTitle>
                            <div className="bg-white p-2 rounded-md shadow-inset-custom ">
                                <Calendar className="h-4 w-6 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-background">8</div>
                            <p className="text-xs text-background">3 consultas, 5 monitoreos</p>
                        </CardContent>
                </Card>
            </Link>
            <Link to="/medico/tratamientos">
                <Card className="card-3d-hover bg-gradient-soft hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm rounded-2xl text-background font-medium ">Tratamientos en Curso</CardTitle>
                        <div className="bg-white p-2 rounded-md shadow-inset-custom">
                            <Activity className="h-4 w-6 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-background">12</div>
                        <p className="text-xs text-background">8 estimulación, 4 FIV</p>
                    </CardContent>
                </Card>
            </Link>
            <Link to="/medico/estudios" className="">
                <Card className="card-3d-hover bg-gradient-soft hover:shadow-lg ">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm rounded-2xl text-background font-medium ">Estudios Pendientes</CardTitle>
                            <div className="bg-white p-2 rounded-md shadow-inset-custom">
                                <ClipboardList className="h-4  w-6 text-primary" />
                            </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-background">5</div>
                        <p className="text-xs text-background">Resultados por revisar</p>
                    </CardContent>
                </Card>
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
          <Card className="bg-gradient ">
            <CardHeader  className="border-b  text-white">
              <CardTitle>Citas de Hoy</CardTitle>
              <CardDescription className="text-white/75">Agenda del día</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "María González", time: "09:00", type: "Consulta inicial" },
                  { name: "Laura Pérez", time: "10:00", type: "Monitoreo ecográfico" },
                  { name: "Ana Martínez", time: "11:30", type: "Revisión de resultados" },
                ].map((appointment, i) => (
                    <div key={i} className="group flex cursor-pointer bg-white items-center justify-between rounded-lg border p-3 hover:shadow-md transition-all">
                        <div className="">
                            <p className="font-medium text-foreground">{appointment.name}</p>
                            <p className="text-sm text-muted-foreground">{appointment.type}</p>
                        </div>
                         <div className="text-right group-hover:translate-x-1 transition-all">
                            <p className="text-sm font-medium text-purple-600 hidden group-hover:block">Ver cita</p>

                            <p className="text-sm font-medium text-white bg-primary px-2 py-1 rounded hidden group-hover:block">Ver cita</p>
                        </div>
                    </div>
                ))}
              </div>
              <Button variant="outline" className="mt-4 bg-white  w-full " asChild>
                <Link to="/medico/agenda">Ver agenda completa</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className>
            <CardHeader>
              <CardTitle>Alertas y Recordatorios</CardTitle>
              <CardDescription>Acciones pendientes</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 ">
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
