import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, UserPlus, LogIn, Heart, Shield, Clock } from "lucide-react"

export default function HomePage() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const handleReservarTurno = () => {
        if (user) {
            navigate("/paciente/citas")
        } else {
            navigate("/register")
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className=" mt-5 ml-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Heart className="h-8 w-8 text-white" />
                        <span className="text-2xl font-bold text-white">Clínica Fértil</span>
                    </div>
                    {user && (
                        <Button
                            variant="secondary"
                            onClick={() => navigate(`/${user.role}`)}
                        >
                            Ir al Panel
                        </Button>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
                <div className="max-w-4xl w-full">
                    <Card variant="ghost" className="p-8 md:p-12 shadow-2xl">
                        {/* Welcome Section */}
                        <div className="text-center space-y-6 mb-10">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient mb-4">
                                <Heart className="h-10 w-10 text-white" />
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                                Bienvenido a Clínica Fértil
                            </h1>
                            
                            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                Centro especializado en medicina reproductiva y fertilidad. 
                                Ofrecemos atención personalizada con tecnología de vanguardia 
                                y un equipo de profesionales comprometidos con hacer realidad 
                                tu sueño de formar una familia.
                            </p>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                            <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50">
                                <Shield className="h-6 w-6 text-primary" />
                                <div>
                                    <h3 className="font-semibold text-sm">Profesionales Expertos</h3>
                                    <p className="text-xs text-muted-foreground">Equipo altamente calificado</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50">
                                <Clock className="h-6 w-6 text-primary" />
                                <div>
                                    <h3 className="font-semibold text-sm">Atención Inmediata</h3>
                                    <p className="text-xs text-muted-foreground">Agenda tu cita fácilmente</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50">
                                <Heart className="h-6 w-6 text-primary" />
                                <div>
                                    <h3 className="font-semibold text-sm">Cuidado Integral</h3>
                                    <p className="text-xs text-muted-foreground">Seguimiento personalizado</p>
                                </div>
                            </div>
                        </div>

                        {/* Main CTA */}
                        <div className="space-y-4">
                            <Button
                                size="lg"
                                className="w-full h-14 text-lg font-semibold bg-gradient hover:opacity-90 transition-opacity"
                                onClick={handleReservarTurno}
                            >
                                <Calendar className="mr-2 h-6 w-6" />
                                Reservar Turno
                            </Button>

                            {/* Secondary Actions */}
                            {!user && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="h-12"
                                        onClick={() => navigate("/register")}
                                    >
                                        <UserPlus className="mr-2 h-5 w-5" />
                                        Registrarse
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="h-12"
                                        onClick={() => navigate("/login")}
                                    >
                                        <LogIn className="mr-2 h-5 w-5" />
                                        Iniciar Sesión
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </main>

            {/* Footer */}
            <footer className="container mx-auto px-4 py-6 text-center text-white/80">
                <p className="text-sm">
                    © 2024 Clínica Fértil. Todos los derechos reservados.
                </p>
            </footer>
        </div>
    )
}
