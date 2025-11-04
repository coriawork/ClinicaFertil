"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {Link} from "react-router-dom"

export default function LoginPage() {
    const { user, login, isLoading } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!isLoading && user) {
        // Redirect based on role
        switch (user.role) {
            case "paciente":
            navigate("/paciente")
            break
            case "medico":
            navigate("/medico")
            break
            case "operador_laboratorio":
            navigate("/laboratorio")
            break
            default:
            break
        }
        }
    }, [user, isLoading, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setIsSubmitting(true)

        try {
            const success = await login(email, password)
            if (success) {
                toast({
                    title: "Inicio de sesión exitoso",
                    description: "Bienvenido al sistema",
                })
            } else {
                setError("Credenciales incorrectas")
            }
        } catch (err) {
            setError("Error al iniciar sesión")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return <div className="flex min-h-screen items-center justify-center">Cargando...</div>
    }

    return (
        <div className="flex min-h-screen items-center justify-center  p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-4 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                        <Heart className="h-8 w-8 text-primary-foreground" fill="currentColor" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl">FertilCare</CardTitle>
                        <CardDescription>Sistema de Gestión de Clínica de Fertilidad</CardDescription>
                    </div>
                </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                    id="email"
                    placeholder="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                    />
                </div>

                {error && (
                    <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                    </div>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
                <div>
                    <Link to="/registrar" className="text-sm text-muted-foreground underline hover:text-primary"> 
                        ¿No tenes una cuenta? Regístrate
                    </Link>
                </div>

                <div className="rounded-lg bg-muted p-4 text-sm">
                    <p className="mb-2 font-medium">Usuarios de prueba:</p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                    <p>
                        <strong>Paciente:</strong> paciente / 1
                    </p>
                    <p>
                        <strong>Médico:</strong> medico / 1
                    </p>
                    <p>
                        <strong>Laboratorio:</strong> laboratorio / 1
                    </p>
                    </div>
                </div>
                </form>
            </CardContent>
            </Card>
        </div>
    )
}
