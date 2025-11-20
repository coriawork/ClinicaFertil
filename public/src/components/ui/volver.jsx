import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"

export function Volver(){
    const navigate = useNavigate()
    const location = useLocation()
    const [canGoBack, setCanGoBack] = useState(false)
    
    useEffect(() => {
        // Verificar si hay historial previo dentro de la aplicación
        setCanGoBack(window.history.length > 1)
    }, [location])
    
    return(
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate(-1)}
                    disabled={!canGoBack}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                </Button>
            </div>
        </div>
    )
}