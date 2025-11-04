"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FamilyTree } from "@/components/family-tree"

export default function ClinicalHistoryPage() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const [hasPartner, setHasPartner] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "medico")) {
      navigate("/")
    }
  }, [user, isLoading, navigate])

  if (isLoading || !user) {
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert("Historia clínica guardada exitosamente")
  }

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
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Historia Clínica</h2>
          <p className="text-muted-foreground">Registrar información médica del paciente</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="patient" className="space-y-6">
            <TabsList>
              <TabsTrigger value="patient">Paciente</TabsTrigger>
              <TabsTrigger value="partner" disabled={!hasPartner}>
                Pareja
              </TabsTrigger>
            </TabsList>

            <TabsContent value="patient" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Seleccionar Paciente</CardTitle>
                  <CardDescription>Elige el paciente para registrar su historia clínica</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient">Paciente</Label>
                    <Select required>
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

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasPartner"
                      checked={hasPartner}
                      onCheckedChange={(checked) => setHasPartner(checked === true)}
                    />
                    <Label htmlFor="hasPartner" className="font-normal">
                      El paciente tiene pareja
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Datos Personales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="dni">DNI</Label>
                      <Input id="dni" placeholder="12345678" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                      <Input id="birthDate" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" type="tel" placeholder="+34 600 000 000" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Grupo Sanguíneo</Label>
                      <Select>
                        <SelectTrigger id="bloodType">
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input id="address" placeholder="Calle, número, ciudad" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Antecedentes Médicos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="pregnancies">Embarazos Previos</Label>
                      <Input id="pregnancies" type="number" min="0" defaultValue="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="births">Partos Previos</Label>
                      <Input id="births" type="number" min="0" defaultValue="0" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Alergias</Label>
                    <Textarea id="allergies" placeholder="Lista de alergias conocidas..." rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diseases">Enfermedades Crónicas</Label>
                    <Textarea id="diseases" placeholder="Diabetes, hipertensión, etc..." rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medications">Medicación Actual</Label>
                    <Textarea id="medications" placeholder="Lista de medicamentos que toma actualmente..." rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas Adicionales</Label>
                    <Textarea id="notes" placeholder="Información relevante adicional..." rows={4} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Antecedentes Genealógicos</CardTitle>
                  <CardDescription>
                    Registra el historial médico familiar para identificar posibles condiciones hereditarias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FamilyTree patientName="María González" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="partner" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Datos de la Pareja</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="partnerName">Nombre Completo</Label>
                      <Input id="partnerName" placeholder="Nombre de la pareja" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="partnerDni">DNI</Label>
                      <Input id="partnerDni" placeholder="12345678" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="partnerBirthDate">Fecha de Nacimiento</Label>
                      <Input id="partnerBirthDate" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="partnerBloodType">Grupo Sanguíneo</Label>
                      <Select>
                        <SelectTrigger id="partnerBloodType">
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partnerDiseases">Enfermedades Crónicas</Label>
                    <Textarea id="partnerDiseases" placeholder="Diabetes, hipertensión, etc..." rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partnerNotes">Notas Adicionales</Label>
                    <Textarea id="partnerNotes" placeholder="Información relevante adicional..." rows={4} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3">
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Guardar Historia Clínica
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link to="/medico">Cancelar</Link>
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
