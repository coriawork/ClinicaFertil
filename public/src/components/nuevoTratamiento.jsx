import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const OBJETIVOS_TRATAMIENTO = [
    {
        value: "gametos-propios",
        label: "Embarazo con gametos propios",
        descripcion: "Ovocito de la mujer y espermatozoide del hombre"
    },
    {
        value: "donante-espermatozoide",
        label: "Embarazo con espermatozoide de donante",
        descripcion: "Ovocito propio y espermatozoide de donante"
    },
    {
        value: "metodo-ropa",
        label: "Método ROPA",
        descripcion: "Una mujer aporta ovocito y la otra gesta"
    },
    {
        value: "preservacion",
        label: "Preservación de ovocitos",
        descripcion: "Preservación de fertilidad para el futuro"
    }
]

/**
 * Componente de diálogo para crear un nuevo tratamiento
 * @param {Object} props
 * @param {boolean} props.open - Estado de apertura del diálogo
 * @param {Function} props.onOpenChange - Callback para cambiar el estado de apertura
 * @param {Function} props.onCrear - Callback para crear el tratamiento
 * @param {boolean} props.tieneTratamientoVigente - Indica si ya existe un tratamiento vigente
 */
export function DialogNuevoTratamiento({ open, onOpenChange, onCrear, tieneTratamientoVigente }) {
    const [objetivoSeleccionado, setObjetivoSeleccionado] = useState("")
    const [error, setError] = useState("")

    const handleCrear = () => {
        // Validar que se haya seleccionado un objetivo
        if (!objetivoSeleccionado) {
            setError("Debe seleccionar un objetivo de tratamiento")
            return
        }

        // Validar que no exista un tratamiento vigente
        if (tieneTratamientoVigente) {
            setError("No se puede crear un nuevo tratamiento mientras exista uno vigente")
            return
        }

        // Obtener la información completa del objetivo seleccionado
        const objetivoInfo = OBJETIVOS_TRATAMIENTO.find(obj => obj.value === objetivoSeleccionado)

        // Crear el objeto del nuevo tratamiento
        const nuevoTratamiento = {
            objetivo: objetivoInfo.label,
            etapaActual: "Primera Consulta",
            proximaEtapa: "Estudios Médicos",
            proximoTurno: "-"
        }

        // Llamar al callback con el nuevo tratamiento
        onCrear(nuevoTratamiento)

        // Limpiar el formulario y cerrar el diálogo
        setObjetivoSeleccionado("")
        setError("")
        onOpenChange(false)
    }

    const handleCancel = () => {
        setObjetivoSeleccionado("")
        setError("")
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Tratamiento</DialogTitle>
                    <DialogDescription>
                        Seleccione el objetivo del tratamiento para el paciente.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Alerta de tratamiento vigente */}
                    {tieneTratamientoVigente && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                El paciente ya tiene un tratamiento vigente. Complete o cancele el tratamiento actual antes de crear uno nuevo.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Selector de objetivo */}
                    <div className="space-y-2">
                        <Label htmlFor="objetivo">Objetivo del Tratamiento *</Label>
                        <Select
                            value={objetivoSeleccionado}
                            onValueChange={(value) => {
                                setObjetivoSeleccionado(value)
                                setError("")
                            }}
                            disabled={tieneTratamientoVigente}
                        >
                            <SelectTrigger id="objetivo">
                                <SelectValue placeholder="Seleccione un objetivo" />
                            </SelectTrigger>
                            <SelectContent>
                                {OBJETIVOS_TRATAMIENTO.map((objetivo) => (
                                    <SelectItem key={objetivo.value} value={objetivo.value}>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{objetivo.label}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {objetivo.descripcion}
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {objetivoSeleccionado && (
                            <p className="text-sm text-muted-foreground">
                                {OBJETIVOS_TRATAMIENTO.find(obj => obj.value === objetivoSeleccionado)?.descripcion}
                            </p>
                        )}
                    </div>

                    {/* Mensaje de error */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleCrear}
                        disabled={tieneTratamientoVigente}
                    >
                        Crear Tratamiento
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}