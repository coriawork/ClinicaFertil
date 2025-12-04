import {  Link } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { Button } from "@/components/ui/button"
import { Users, Calendar, Activity, ClipboardList, Clock } from "lucide-react"
import {CardShort} from "@/components/ui/card-short"
import { CardInfo } from "../../components/ui/card-info"
import { CardList } from "../../components/ui/card-list"
import { DashboardLayout } from "@/layouts/dashboard-layout"

export function DashboardDirector() {
    const { user} = useAuth()
  
    const quickActions = [
        {
            title: "Pacientes",
            description: "Ver lista de pacientes",
            icon: Users,
            href: "/pacientes",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Medicos",
            description: "Ver lista de medicos",
            icon: ClipboardList,
            href: "/director/medicos",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
    ]

    return (
        <DashboardLayout role="director">
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Bienvenido, {user.name}</h2>
                    <p className="text-muted-foreground">Gestiona tus pacientes y tratamientos</p>
                </div>

            
                <div className="grid gap-4 md:grid-cols-2  lg:grid-cols-4">
                    {quickActions.map((action) => {
                        const Icon = action.icon
                        return (
                            <Link key={action.href} to={action.href}>
                                <CardShort title={action.title} description={action.description} color={action.color} >
                                    <action.icon className={`h-6 w-6  ${action.color}`} />
                                </CardShort>
                            </Link>
                        )
                    })}
                </div>
                    
            </div>
        </DashboardLayout>
    )
}
