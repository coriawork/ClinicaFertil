import { useAuth } from "@/lib/AuthContext"
import { Button } from "@/components/ui/button"
import {
  LogOut,
  Heart,
  Home,
  Calendar,
  MessageSquare,
  Users,
  FileText,
  Target,
  Activity,
  Syringe,
  TestTube,
  Beaker,
  Package,
  ClipboardList,
} from "lucide-react"
import { useNavigate, useLocation, Link } from "react-router-dom"


export function DashboardLayout({ children, role }) {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        navigate("/")
    } 

    const getRoleLabel = (role) => {
        switch (role) {
        case "paciente":
            return "Paciente"
        case "medico":
            return "Médico Tratante"
        case "operador_laboratorio":
            return "Operador de Laboratorio"
        default:
            return role
        }
    }

    const getNavigation = () => {
    switch (role) {
        case "paciente":
        return [
            { href: "/paciente", label: "Inicio", icon: Home },
            { href: "/paciente/citas", label: "Solicitar Cita", icon: Calendar },
            { href: "/paciente/mis-citas", label: "Mis Citas", icon: ClipboardList },
            { href: "/paciente/tratamiento", label: "Mi Tratamiento", icon: Activity },
            { href: "/paciente/historia", label: "Mi Historia Clínica", icon: FileText },
            { href: "/paciente/chatbot", label: "Consultas", icon: MessageSquare },
            { href: "/paciente/donacion", label: "Donación", icon: Heart },
        ]
        case "medico":
        return [
            { href: "/medico", label: "Inicio", icon: Home },
            { href: "/medico/agenda", label: "Agenda", icon: Calendar },
            { href: "/medico/pacientes", label: "Pacientes", icon: Users },
            { href: "/medico/historia-clinica", label: "Historia Clínica", icon: FileText },
            { href: "/medico/estudios", label: "Estudios", icon: TestTube },
            { href: "/medico/objetivos", label: "Objetivos", icon: Target },
            { href: "/medico/tratamientos", label: "Tratamientos", icon: Syringe },
            { href: "/medico/monitoreo", label: "Monitoreo", icon: Activity },
            { href: "/medico/punciones", label: "Punciones", icon: Beaker },
            { href: "/medico/resultados", label: "Resultados", icon: ClipboardList },
        ]
        case "operador_laboratorio":
        return [
            { href: "/laboratorio", label: "Inicio", icon: Home },
            { href: "/laboratorio/ovulos/registrar", label: "Registrar Óvulos", icon: TestTube },
            { href: "/laboratorio/embriones/registrar", label: "Registrar Embriones", icon: Beaker },
            { href: "/laboratorio/inventario", label: "Inventario", icon: Package },
            { href: "/laboratorio/ovulos/gestionar", label: "Gestionar Óvulos", icon: Activity },
            { href: "/laboratorio/embriones/gestionar", label: "Gestionar Embriones", icon: ClipboardList },
        ]
        default:
        return []
    }
    }

    const navigation = getNavigation()

    return (
    <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
            </div>
            <div>
                <h1 className="text-lg font-bold text-foreground">FertilCare</h1>
                <p className="text-xs text-muted-foreground">Sistema de Gestión de Clínica</p>
            </div>
            </div>
            <div className="flex items-center gap-4">
            <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user && getRoleLabel(user.role)}</p>
            </div>
            <Button variant="outline" size="sm" className="cursor-pointer" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Salir
            </Button>
            </div>
        </div>
        </header>

        <div className="container mx-auto flex gap-6 p-4 md:p-6 lg:p-8">
            <aside className=" w-64 shrink-0 lg:block">
                <nav className="space-y-1">
                {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.href
                    return (
                    <Link
                        key={item.href}
                        to={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                    >
                        <Icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                    )
                })}
                </nav>
            </aside>

            <main className="flex-1">{children}</main>
        </div>
    </div>
    )
}
