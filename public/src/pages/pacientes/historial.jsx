"use client"

import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Calendar, Phone, Mail, MapPin, Heart, Activity } from "lucide-react"

export default function HistoriaClinicaPage() {
  const clinicalHistory = {
    personalInfo: {
      name: "María García",
      birthDate: "1988-05-15",
      age: 36,
      phone: "+34 612 345 678",
      email: "maria.garcia@email.com",
      address: "Calle Principal 123, Madrid",
    },
    medicalHistory: {
      bloodType: "A+",
      allergies: ["Penicilina"],
      chronicDiseases: [],
      previousSurgeries: ["Apendicectomía (2010)"],
      medications: [],
    },
    gynecologicalHistory: {
      menarche: 13,
      cycleLength: 28,
      cycleDuration: 5,
      lastPeriod: "2025-01-01",
      previousPregnancies: 0,
      previousBirths: 0,
      previousAbortions: 0,
    },
    fertilityStudies: [
      {
        type: "Hormonal",
        date: "2024-12-15",
        results: "FSH: 7.2 mUI/mL, LH: 5.1 mUI/mL, AMH: 2.8 ng/mL",
        status: "Normal",
      },
      {
        type: "Ecografía Transvaginal",
        date: "2024-12-20",
        results: "Útero normal, ovarios con folículos antrales: 12 (derecho), 10 (izquierdo)",
        status: "Normal",
      },
    ],
  }

  return (
    <DashboardLayout role="paciente">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mi Historia Clínica</h1>
          <p className="text-muted-foreground">Información médica y estudios realizados</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Fecha de nacimiento:</span>
                <span className="font-medium">
                  {new Date(clinicalHistory.personalInfo.birthDate).toLocaleDateString("es-ES")} (
                  {clinicalHistory.personalInfo.age} años)
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Teléfono:</span>
                <span className="font-medium">{clinicalHistory.personalInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{clinicalHistory.personalInfo.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Dirección:</span>
                <span className="font-medium">{clinicalHistory.personalInfo.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Antecedentes Médicos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <span className="text-sm text-muted-foreground">Grupo sanguíneo:</span>
                <p className="font-medium">{clinicalHistory.medicalHistory.bloodType}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Alergias:</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {clinicalHistory.medicalHistory.allergies.length > 0 ? (
                    clinicalHistory.medicalHistory.allergies.map((allergy) => (
                      <Badge key={allergy} variant="destructive">
                        {allergy}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Ninguna</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Cirugías previas:</span>
                <div className="mt-1">
                  {clinicalHistory.medicalHistory.previousSurgeries.length > 0 ? (
                    clinicalHistory.medicalHistory.previousSurgeries.map((surgery, index) => (
                      <p key={index} className="text-sm">
                        {surgery}
                      </p>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Ninguna</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Historia Ginecológica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <span className="text-sm text-muted-foreground">Edad de menarquia:</span>
                <p className="font-medium">{clinicalHistory.gynecologicalHistory.menarche} años</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Duración del ciclo:</span>
                <p className="font-medium">{clinicalHistory.gynecologicalHistory.cycleLength} días</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Duración de menstruación:</span>
                <p className="font-medium">{clinicalHistory.gynecologicalHistory.cycleDuration} días</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Última menstruación:</span>
                <p className="font-medium">
                  {new Date(clinicalHistory.gynecologicalHistory.lastPeriod).toLocaleDateString("es-ES")}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Embarazos previos:</span>
                <p className="font-medium">{clinicalHistory.gynecologicalHistory.previousPregnancies}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Partos previos:</span>
                <p className="font-medium">{clinicalHistory.gynecologicalHistory.previousBirths}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estudios de Fertilidad</CardTitle>
            <CardDescription>Resultados de estudios realizados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clinicalHistory.fertilityStudies.map((study, index) => (
                <div key={index}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{study.type}</h4>
                      <Badge variant={study.status === "Normal" ? "default" : "secondary"}>{study.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Fecha: {new Date(study.date).toLocaleDateString("es-ES")}
                    </p>
                    <p className="text-sm">{study.results}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
