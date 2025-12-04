import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Eye, Activity, CheckCircle, XCircle, MoreVertical } from "lucide-react"

/**
 * Componente de menú de acciones para tratamientos
 * @param {Object} props
 * @param {Object} props.tratamiento - Objeto del tratamiento
 * @param {string} props.pacienteId - ID del paciente
 * @param {Function} props.onCompletar - Callback para completar tratamiento
 * @param {Function} props.onCancelar - Callback para cancelar tratamiento
 */
export function AccionesTratamiento({ tratamiento, pacienteId, onCompletar, onCancelar }) {
    const navigate = useNavigate()
    const [dialogCancelar, setDialogCancelar] = useState(false)
    const [dialogCompletar, setDialogCompletar] = useState(false)
    const [motivoCancelacion, setMotivoCancelacion] = useState("")

    const handleVerDetalle = () => {
        navigate(`/pacientes/${pacienteId}/tratamiento/${tratamiento.id}`)
    }

    const handleVerEstimulacion = () => {
        navigate(`/pacientes/${pacienteId}/tratamiento/${tratamiento.id}/estimulacion`)
    }

    const handleCompletar = () => {
        setDialogCompletar(true)
    }

    const handleCancelar = () => {
        setDialogCancelar(true)
    }

    const confirmarCompletar = () => {
        onCompletar?.(tratamiento)
        setDialogCompletar(false)
    }

    const confirmarCancelar = () => {
        if (motivoCancelacion.trim()) {
            onCancelar?.(tratamiento, motivoCancelacion)
            setDialogCancelar(false)
            setMotivoCancelacion("")
        }
    }

    const estaActivo = tratamiento.estado === "vigente"

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {/* Acción de visualización */}
                    <DropdownMenuItem onClick={handleVerDetalle}>
                        <Eye className="h-4 w-4" />
                        <span>Ver Detalle</span>
                    </DropdownMenuItem>
                    
                    {estaActivo && (
                        <>
                            <DropdownMenuItem onClick={handleVerEstimulacion}>
                                <Activity className="h-4 w-4" />
                                <span>Ver Estimulación</span>
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            {/* Acciones de cambio de estado */}
                            <DropdownMenuItem onClick={handleCompletar}>
                                <CheckCircle className="h-4 w-4" />
                                <span>Completar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive" onClick={handleCancelar}>
                                <XCircle className="h-4 w-4" />
                                <span>Cancelar</span>
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Dialog de confirmación de completar */}
            <Dialog open={dialogCompletar} onOpenChange={setDialogCompletar}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Completar tratamiento?</DialogTitle>
                        <DialogDescription>
                            Se marcará el tratamiento <span className="font-semibold">{tratamiento?.id}</span> ({tratamiento?.objetivo}) como completado.
                            Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogCompletar(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={confirmarCompletar}>
                            Completar Tratamiento
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog de cancelación con motivo */}
            <Dialog open={dialogCancelar} onOpenChange={setDialogCancelar}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Cancelar tratamiento?</DialogTitle>
                        <DialogDescription>
                            Se cancelará el tratamiento <span className="font-semibold">{tratamiento?.id}</span> ({tratamiento?.objetivo}).
                            Por favor, indique el motivo de la cancelación.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="motivo">Motivo de cancelación *</Label>
                            <Textarea
                                id="motivo"
                                placeholder="Ej: Decisión personal de la paciente, complicaciones médicas, etc."
                                value={motivoCancelacion}
                                onChange={(e) => setMotivoCancelacion(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setDialogCancelar(false)
                                setMotivoCancelacion("")
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmarCancelar}
                            disabled={!motivoCancelacion.trim()}
                        >
                            Confirmar Cancelación
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}