"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Clock, User, MapPin } from "lucide-react"

export default function AgendaPage() {
    const { user, isLoading } = useAuth()
    const navigate = useNavigate()
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [currentWeek, setCurrentWeek] = useState(new Date())
    useEffect(() => {
        if (!isLoading && (!user || user.role !== "medico")) {
            navigate("/")
        }
    }, [user, isLoading, navigate])

    if (isLoading || !user) {
        return null
    }

    const appointments = [
        {
            id: 1,
            patientName: "María González",
            patientId: "P001",
            date: new Date(2025, 11, 1 ),
            time: "09:00",
            duration: 60,
            type: "Consulta inicial",
            status: "confirmada",
            location: "Consultorio 1",
            notes: "Primera consulta de fertilidad",
        },
    ]

    const getAppointmentsForDate = (date) => {
        return appointments.filter(
            (apt) =>
            apt.date.getDate() === date.getDate() &&
            apt.date.getMonth() === date.getMonth() &&
            apt.date.getFullYear() === date.getFullYear(),
        )
    }

    const getWeekDays = (date) => {
        const week = []
        const startOfWeek = new Date(date)
        startOfWeek.setDate(date.getDate() - date.getDay() + 1)

        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek)
            day.setDate(startOfWeek.getDate() + i)
            week.push(day)
        }
        return week
    }

    const weekDays = getWeekDays(currentWeek)

    const getStatusColor = (status) => {
        switch (status) {
            case "confirmada":
            return "bg-green-100 text-green-800 border-green-200"
            case "pendiente":
            return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "cancelada":
            return "bg-red-100 text-red-800 border-red-200"
            default:
            return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getTypeColor = (type) => {
        switch (type) {
            case "Consulta inicial":
            return "bg-blue-100 text-blue-800"
            case "Monitoreo ecográfico":
            return "bg-purple-100 text-purple-800"
            case "Punción folicular":
            return "bg-orange-100 text-orange-800"
            case "Transferencia embrionaria":
            return "bg-pink-100 text-pink-800"
            default:
            return "bg-gray-100 text-gray-800"
        }
    }

    const selectedDateAppointments = getAppointmentsForDate(selectedDate)

return (
    <DashboardLayout role="medico">
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Agenda</h1>
                    <p className="text-muted-foreground">Gestiona tus citas y horarios</p>
                </div>
                <Button>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Nueva Cita
                </Button>
            </div>

        </div>
    </DashboardLayout>
)
}
