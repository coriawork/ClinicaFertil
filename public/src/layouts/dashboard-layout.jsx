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
import { Menu } from "lucide-react"

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
            { href: "/laboratorio/ovocitos/", label: "Gestion Ovocitos", icon: TestTube },
        ]
        default:
        return []
    }
    }
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isDarkMode,setDarrkMode]=useState(false);
    const navigation = getNavigation()

    return (
    <div className={"min-h-screen bg-background transition-colors duration-500 ease-in-out "+(isDarkMode ? "dark" : "")}>
        <header className="sticky top-0  z-50 border-b bg-background/10 shadow-sm backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-2 sm:px-4">
                {/* Botón hamburguesa solo visible en móvil */}
                <button
                    className="md:hidden mr-2 p-2 rounded hover:bg-primary/10"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-label="Abrir menú"
                >
                    <Menu className="h-6 w-6 text-foreground" />
                </button>
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                        <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
                    </div>
                    <div className=" ">
                        <h1 className="text-base sm:text-lg font-bold text-foreground">FertilCare</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <Button
                        onClick={toggleTheme}
                        variant="ghost"
                        size="icon"
                        className="text-foreground cursor-pointer p-2"
                    >
                        {getThemeIcon()}
                    </Button>
                    <div className="hidden xs:block text-right">
                        <p className="text-xs  sm:text-sm font-medium text-foreground truncate max-w-[80px] sm:max-w-none">{user?.name}</p>
                        <p className="hidden sm:block text-xs text-muted-foreground">{user && getRoleLabel(user.role)}</p>
                    </div>
                    <Button
                        variant="primary"
                        size="icon"
                        className="cursor-pointer px-2 py-1 sm:px-3 sm:py-2 flex items-center gap-1"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Salir</span>
                    </Button>
                </div>
            </div>
        </header>

        <div className="container mx-auto flex gap-6 p-4 md:p-6 lg:p-8">
            <aside
                className={`
                    fixed inset-y-0 left-0 z-40 w-64 bg-background border-r shadow-lg transform
                    transition-transform duration-200 ease-in-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    md:static md:translate-x-0 md:w-auto md:shadow-none md:border-none
                `}
                style={{ maxWidth: "16rem" }}
            >
                <nav className="space-y-1 p-4 md:p-0">
                    {/* Botón cerrar solo en móvil */}
                    <div className="flex justify-end md:hidden mb-4">
                        <button
                            className="p-2 rounded hover:bg-primary/10"
                            onClick={() => setSidebarOpen(false)}
                            aria-label="Cerrar menú"
                        >
                            ✕
                        </button>
                    </div>
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
                            onClick={() => setSidebarOpen(false)} // Cierra menú al navegar en móvil
                        >
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                        )
                    })}
                </nav>
            </aside>

            {/* Overlay para cerrar el menú en móvil */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            
            <main className="flex-1 flex gap-5 flex-col">
                <Volver className=""/>
                {children}
            </main>
        </div>
    </div>
    )
}
