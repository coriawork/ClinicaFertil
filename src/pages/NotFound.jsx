import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Heart, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Heart className="h-6 w-6 text-primary-foreground" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">FertilCare</h1>
            <p className="text-xs text-muted-foreground">Sistema de Gestión de Clínica</p>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-10 shadow">
          <div className="text-7xl font-extrabold leading-none bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            404
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-foreground">Página no encontrada</h2>
          <p className="mt-2 text-muted-foreground">
            Lo sentimos, no pudimos encontrar la página que buscás. Verificá la URL o volvé al inicio.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/" className="inline-flex">
              <Button className="cursor-pointer">
                <Home className="mr-2 h-4 w-4" />
                Ir al inicio
              </Button>
            </Link>
            <Button variant="outline" className="cursor-pointer" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver atrás
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Si el problema persiste, contactá al soporte de la clínica.
        </p>
      </div>
    </div>
  )
}