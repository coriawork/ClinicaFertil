"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, FileText, Check } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function StudiesRequestPage() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const [selectedPatient, setSelectedPatient] = useState("")
  const [selectedStudies, setSelectedStudies] = useState([])
  const [notes, setNotes] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "medico")) {
      navigate("/")
    }
  }, [user, isLoading, navigate])

  if (isLoading || !user) {
    return null
  }

  const availableStudies = [
    { id: "hormonal", name: "Perfil Hormonal Completo", category: "Análisis de Sangre" },
    { id: "fsh", name: "FSH, LH, Estradiol", category: "Análisis de Sangre" },
    { id: "amh", name: "Hormona Antimülleriana (AMH)", category: "Análisis de Sangre" },
    { id: "progesterone", name: "Progesterona", category: "Análisis de Sangre" },
    { id: "thyroid", name: "Perfil Tiroideo", category: "Análisis de Sangre" },
    { id: "ultrasound", name: "Ecografía Transvaginal", category: "Imagenología" },
    { id: "hsg", name: "Histerosalpingografía", category: "Imagenología" },
    { id: "sperm", name: "Espermiograma", category: "Análisis de Semen" },
    { id: "genetic", name: "Cariotipo", category: "Estudios Genéticos" },
  ]

  const handleStudyToggle = (studyId) => {
    setSelectedStudies((prev) => (prev.includes(studyId) ? prev.filter((id) => id !== studyId) : [...prev, studyId]))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => {
      navigate("/medico")
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <DashboardLayout role="medico">
        <div className="flex min-h-[60vh] items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Estudios Solicitados</h3>
                  <p className="text-sm text-muted-foreground">Las solicitudes han sido enviadas al laboratorio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  const groupedStudies = availableStudies.reduce((acc, study) => {
    if (!acc[study.category]) {
      acc[study.category] = []
    }
    acc[study.category].push(study)
    return acc
  }, {})

  return (
    <DashboardLayout role="medico">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/medico">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>
        </div>

        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Solicitar Estudios</h2>
          <p className="text-muted-foreground">Pedir análisis y estudios para pacientes</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Seleccionar Paciente</CardTitle>
                <CardDescription>Elige el paciente para quien solicitas los estudios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="patient">Paciente</Label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient} required>
                    <SelectTrigger id="patient">
                      <SelectValue placeholder="Selecciona un paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">María González</SelectItem>
                      <SelectItem value="2">Laura Pérez</SelectItem>
                      <SelectItem value="3">Ana Martínez</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estudios a Solicitar</CardTitle>
                <CardDescription>Selecciona los estudios necesarios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(groupedStudies).map(([category, studies]) => (
                  <div key={category} className="space-y-3">
                    <h3 className="font-semibold text-foreground">{category}</h3>
                    <div className="space-y-2">
                      {studies.map((study) => (
                        <div key={study.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={study.id}
                            checked={selectedStudies.includes(study.id)}
                            onCheckedChange={() => handleStudyToggle(study.id)}
                          />
                          <Label htmlFor={study.id} className="font-normal">
                            {study.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indicaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notas e Indicaciones Especiales</Label>
                  <Textarea
                    id="notes"
                    placeholder="Indicaciones para el laboratorio, información relevante..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="submit" disabled={!selectedPatient || selectedStudies.length === 0}>
                <FileText className="mr-2 h-4 w-4" />
                Solicitar Estudios ({selectedStudies.length})
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/medico">Cancelar</Link>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
