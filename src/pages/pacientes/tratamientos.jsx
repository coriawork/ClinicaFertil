"use client"

import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Pill, Activity, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function PatientTreatmentPage() {
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

  const medications = [
    { name: "Gonal-F", dosage: "150 UI", frequency: "Diaria", time: "20:00", active: true },
    { name: "Cetrotide", dosage: "0.25 mg", frequency: "Diaria", time: "08:00", active: true },
    { name: "Progesterona", dosage: "200 mg", frequency: "Cada 12h", time: "08:00 y 20:00", active: false },
  ]

  const monitoringRecords = [
    { date: "10 Ene 2025", follicles: 6, size: "10-12 mm", endometrium: "7.2 mm", estradiol: 850 },
    { date: "13 Ene 2025", follicles: 8, size: "14-16 mm", endometrium: "8.5 mm", estradiol: 1450 },
    { date: "15 Ene 2025", follicles: 8, size: "18-20 mm", endometrium: "9.8 mm", estradiol: 2100 },
  ]

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
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Mi Tratamiento</h2>
          <p className="text-muted-foreground">Seguimiento de tu tratamiento de fertilidad</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Estado del Tratamiento</CardTitle>
                <CardDescription>Estimulación Ovárica</CardDescription>
              </div>
              <Badge>En Curso</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progreso del ciclo</span>
                <span className="font-medium text-foreground">Día 8 de 12</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Fecha de inicio</p>
                <p className="font-medium text-foreground">08 Ene 2025</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Próximo monitoreo</p>
                <p className="font-medium text-foreground">18 Ene 2025</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Punción estimada</p>
                <p className="font-medium text-foreground">20 Ene 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Medicación Actual
            </CardTitle>
            <CardDescription>Protocolo de medicamentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {medications.map((med, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{med.name}</p>
                      {med.active ? (
                        <Badge variant="default" className="text-xs">
                          Activo
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Próximamente
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {med.dosage} - {med.frequency}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{med.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Historial de Monitoreo
            </CardTitle>
            <CardDescription>Evolución del tratamiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monitoringRecords.map((record, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{record.date}</span>
                    </div>
                    {index === monitoringRecords.length - 1 && (
                      <Badge variant="outline" className="text-xs">
                        Más reciente
                      </Badge>
                    )}
                  </div>
                  <div className="grid gap-3 md:grid-cols-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Folículos</p>
                      <p className="font-medium text-foreground">{record.follicles}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tamaño</p>
                      <p className="font-medium text-foreground">{record.size}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Endometrio</p>
                      <p className="font-medium text-foreground">{record.endometrium}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Estradiol</p>
                      <p className="font-medium text-foreground">{record.estradiol} pg/mL</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recomendaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="rounded-lg bg-blue-50 p-3">
                <p className="text-sm font-medium text-blue-900">Continúa con tu medicación según lo indicado</p>
                <p className="text-xs text-blue-700">No olvides tomar tus medicamentos a la hora programada</p>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <p className="text-sm font-medium text-green-900">Mantén una dieta balanceada</p>
                <p className="text-xs text-green-700">Consume alimentos ricos en proteínas y vitaminas</p>
              </div>
              <div className="rounded-lg bg-orange-50 p-3">
                <p className="text-sm font-medium text-orange-900">Evita ejercicio intenso</p>
                <p className="text-xs text-orange-700">Realiza actividades suaves como caminar o yoga</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
