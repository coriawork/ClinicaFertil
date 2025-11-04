"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Heart, Check } from "lucide-react"

export default function GameteDonation() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const [donationType, setDonationType] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [medicalHistory, setMedicalHistory] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "paciente")) {
      navigate("/")
    }
  }, [user, isLoading, navigate])

  if (isLoading || !user) {
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => {
      navigate("/paciente")
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <DashboardLayout role="paciente">
        <div className="flex min-h-[60vh] items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Solicitud Enviada</h3>
                  <p className="text-sm text-muted-foreground">
                    Gracias por tu interés en donar. Un coordinador se pondrá en contacto contigo pronto.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
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

        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Donación de Gametos</h2>
          <p className="text-muted-foreground">Ayuda a otras personas a cumplir su sueño de ser padres</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Información de Donación
                </CardTitle>
                <CardDescription>Completa los detalles para registrar tu interés en donar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Tipo de Donación</Label>
                  <RadioGroup value={donationType} onValueChange={setDonationType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ovulos" id="ovulos" />
                      <Label htmlFor="ovulos" className="font-normal">
                        Donación de Óvulos
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="esperma" id="esperma" />
                      <Label htmlFor="esperma" className="font-normal">
                        Donación de Esperma
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="history">Historial Médico Relevante</Label>
                  <Textarea
                    id="history"
                    placeholder="Describe cualquier condición médica relevante, alergias, medicamentos actuales, etc."
                    value={medicalHistory}
                    onChange={(e) => setMedicalHistory(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requisitos y Consentimiento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Requisitos para donantes:</p>
                  <ul className="list-inside list-disc space-y-1">
                    <li>Edad entre 18 y 35 años</li>
                    <li>Buena salud física y mental</li>
                    <li>Sin enfermedades genéticas hereditarias</li>
                    <li>Disponibilidad para evaluaciones médicas</li>
                    <li>Compromiso con el proceso de donación</li>
                  </ul>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                  />
                  <Label htmlFor="terms" className="text-sm font-normal leading-relaxed">
                    Acepto que he leído y entiendo los requisitos para la donación de gametos. Comprendo que se
                    realizarán evaluaciones médicas y psicológicas antes de proceder con la donación.
                  </Label>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={!donationType || !medicalHistory || !acceptedTerms}>
                    <Heart className="mr-2 h-4 w-4" />
                    Enviar Solicitud
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link to="/paciente">Cancelar</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
