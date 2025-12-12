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
    UserCircle2,
    Stethoscope,
    CalendarRange,
    MessageCircle,
    Egg,
  Sun,Moon,
  ClipboardList,DollarSign
} from "lucide-react"
import { useTheme } from "@/lib/ThemeContex"
import { useState,useEfect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { Volver } from "@/components/ui/volver"
import { Menu } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"


export function DashboardLayout({ children, role }) {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const { theme, setTheme } = useTheme()
    role = user?.role

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
        case "laboratorio":
            return "laboratorio"
        default:
            return role
        }
    }
    const getNavigation = () => {
        switch (role) {
            case "paciente":
            return [
                { href: `/paciente`, label: "Inicio", icon: Home },
                { href: "/paciente/citas", label: "Solicitar Cita", icon: Calendar },
                { href: "/paciente/mis-citas", label: "Mis Citas", icon: ClipboardList },
                { href: "/chatbot", label: "Chatbot", icon: MessageCircle },
                { href: "/paciente/ordenes", label: "Ordenes", icon: FileText },
                { href: "/pacientes/1/tratamientos", label: "Tratamientos", icon: Activity },
                { href: "/ovocitos", label: "Ovocitos", icon: Egg },
                { href: "/embriones", label: "Embriones", icon: Beaker },
            ]
            case "medico":
                return [
                    { href: "/medico", label: "Inicio", icon: Home },
                    { href: "/medico/agenda", label: "Agenda", icon: CalendarRange },
                    { href: "/pacientes", label: "Pacientes", icon: Users },
                    { href: "/ovocitos", label: "Ovocitos", icon: Egg },
                    { href: "/embriones/", label: "Gestion Embriones", icon: Beaker },
            ]
            case "laboratorio":
            return [
                { href: "/laboratorio", label: "Inicio", icon: Home },
                { href: "/laboratorio/punsiones", label: "Gestion Punsion", icon: Syringe },
                { href: "/ovocitos/", label: "Gestion Ovocitos", icon: TestTube },
                { href: "/embriones/", label: "Gestion Embriones", icon: Beaker },
            ]
            case "director":
            return [
                { href: "/director", label: "Inicio", icon: Home },
                { href: "/pacientes", label: "Pacientes", icon: UserCircle2 },
                { href: "/medicos", label: "Médicos", icon: Stethoscope },
                { href: "/director/pagos", label: "Pagos", icon: DollarSign },
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
                {/* Botón hamburguesa  */}
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
                    <div className="uppercase hidden md:block text-sm text-foreground">
                        <span className="text-primary">
                            {user.role} 
                        </span>  
                        {" "+user.name}
                    </div>
                    <Button
                        onClick={toggleTheme}
                        variant="ghost"
                        size="icon"
                        className="text-foreground cursor-pointer p-2"
                    >
                        {getThemeIcon()}
                    </Button>
                    <div className="hidden xs:block text-right">
                        <p className="text-xs  sm:text-sm font-medium text-foreground truncate max-w-20 sm:max-w-none">{user?.name}</p>
                        <p className="hidden sm:block text-xs text-muted-foreground">{user && getRoleLabel(user.role)}</p>
                    </div>
                    <Button
                        variant="primary"
                        size="icon"
                        className="cursor-pointer px-2 py-1 sm:px-3 sm:py-2 flex items-center gap-1"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" />
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
                            onClick={() => setSidebarOpen(false)} 
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
                <Toaster position="top-center" className="bg-primary"/>
                <Volver className=""/>
                {children}
            </main>
        </div>
    </div>
    )
}
