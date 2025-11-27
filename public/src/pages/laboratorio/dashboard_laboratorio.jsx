"use client"

import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"

import { CardList } from "../../components/ui/card-list"

export function LaboratorioDashboard () {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "operador_laboratorio")) {
      navigate("/")
    }
  }, [user, isLoading, navigate])

  if (isLoading || !user) {
    return null
  }

  return (
    <DashboardLayout role="operador_laboratorio">
        <div className="space-y-6">
            <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Bienvenido, {user.name}</h2>
            <p className="text-muted-foreground">Gestiona tus pacientes y tratamientos</p>
            </div>

            <div className="grid gap-4  md:grid-cols-2">
                <CardList title="Citas de hoy" desc="Agenda" data={[{ h1: "María González", right: "09:00", h2: "Punsion" },{ h1: "Laura Pérez", right: "10:00", h2: "Punsion" },{ h1: "Ana Martínez", right: "11:30", h2: "Punsion" }]}>
                    <Button variant="outline" className="mt-4 bg-white w-full" asChild>
                        <Link to="/medico/agenda">Ver agenda completa</Link>
                    </Button>
                </CardList>
               

            </div>
        </div>
    </DashboardLayout>
  )
}
