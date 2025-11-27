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
  Sun,Moon,
  ClipboardList,
} from "lucide-react"
import { useTheme } from "@/lib/ThemeContex"
import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { Volver } from "@/components/ui/volver"

export function DashboardLayout({ children, role }) {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const { theme, setTheme } = useTheme()
    
    const toggleTheme = () => {
        // Solo alterna entre light y dark
        if (theme === "dark") {
        setTheme("light")
        } else {
        setTheme("dark")
        }
    }

    const getThemeIcon = () => {
        switch (theme) {
        case "light":
            return <Sun className="h-4 w-4" />
            case "dark":
            return <Moon className="h-4 w-4" />
        default:
            return <Sun className="h-4 w-4" />
        }
    }
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
        ]
        case "medico":
        return [
            { href: "/medico", label: "Inicio", icon: Home },
            { href: "/medico/agenda", label: "Agenda", icon: Calendar },
            { href: "/medico/pacientes", label: "Pacientes", icon: Users },
        ]
        case "operador_laboratorio":
        return [
            { href: "/laboratorio", label: "Inicio", icon: Home },
            { href: "/laboratorio/punsiones", label: "Gestion Punsion", icon: Activity },
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

    const [isDarkMode,setDarrkMode]=useState(false);
    const navigation = getNavigation()

    return (
    <div className={"min-h-screen bg-background transition-colors duration-500 ease-in-out "+(isDarkMode ? "dark" : "")}>
        <header className="sticky top-0 z-50 border-b bg-background/10 shadow-sm backdrop-blur-xl">
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
                    <Button onClick={toggleTheme} variant="ghost" size="sm" className="text-foreground cursor-pointer">
                        {getThemeIcon()}
                    </Button>
                    <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user && getRoleLabel(user.role)}</p>
                    </div>
                    <Button variant="primary" size="sm" className="cursor-pointer" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Salir
                    </Button>
                </div>
            </div>
        </header>

        <div className="container mx-auto flex gap-6 p-4 md:p-6 lg:p-8">
            <aside className="">
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
                                ? "bg-primary text-background "
                                : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                        )
                    })}
                </nav>
            </aside>

            <main className="flex-1 flex gap-5 flex-col">
                <Volver className=""/>
                {children}
            </main>
        </div>
    </div>
    )
}
