"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Clock, User, MapPin } from "lucide-react"
import { Calendar } from "@/components/ui/calendargod"
export default function AgendaPage() {
 
return (
    <DashboardLayout role="medico">
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Agenda</h1>
                    <p className="text-muted-foreground">Gestiona tus citas y horarios</p>
                </div>
            </div>  
            <div>
                <Calendar/>
            </div>
        </div>
    </DashboardLayout>
)
}
