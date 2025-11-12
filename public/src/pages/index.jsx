import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { Button } from "@/components/ui/button"
import { Calendar, UserPlus, LogIn, Heart, Shield, Clock } from "lucide-react"

export default function HomePage() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const handleReservarTurno = () => {
        if (user) {
            navigate("/paciente/citas")
        } else {
            navigate("/registrar")
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-soft">
            {/* Header */}
            <header className="mt-5 ml-5">
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
            <main className="flex-1  container mx-auto px-4 py-12 flex items-center justify-center">
                <div className="max-w-4xl w-full space-y-10">
                    {/* Welcome Section */}
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient mb-4">
                            <Heart className="h-10 w-10 text-white" />
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            Bienvenido a Clínica Fértil
                        </h1>
                        
                        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                          Te ofrecemos <span className="bg-white text-primary p-1 font-bold">atención personalizada</span> y tratamientos de fertilidad diseñados para ti.
                        </p>
                    </div>

              
                    {/* Main CTA */}
                    <div className="space-y-4 max-w-2xl mx-auto">
                        <Button
                            size="lg"
                            className="w-full h-14 text-lg font-semibold bg-white text-black hover:bg-white/90 transition-opacity"
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
                                    className="h-12 hover:bg-accent hover:text-primary"
                                    onClick={() => navigate("/registrar")}
                                >
                                    <UserPlus className="mr-2 h-5 w-5" />
                                    Registrarse
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                     className="h-12 hover:bg-accent hover:text-primary"
                                    onClick={() => navigate("/login")}
                                >
                                    <LogIn className="mr-2 h-5 w-5" />
                                    Iniciar Sesión
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
