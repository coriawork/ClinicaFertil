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
import { Eye, FileText, Activity, Pencil, Trash2, MoreVertical } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
/**
 * Componente de menú de acciones para pacientes
 * @param {Object} props
 * @param {Object} props.paciente - Objeto del paciente
 * @param {Function} props.onEditar - Callback para editar paciente
 * @param {Function} props.onEliminar - Callback para eliminar paciente
 */
export function AccionesPaciente({ paciente, onEditar, onEliminar }) {
    const navigate = useNavigate()
    const [dialogEliminar, setDialogEliminar] = useState(false)
    const { user } = useAuth()
    const role = user?.role

    const handleVerPaciente = () => {
        navigate(`/pacientes/${paciente.id}`)
    }

    const handleVerTratamiento = () => {
        navigate(`/pacientes/${paciente.id}/tratamientos`)
    }

    const handleVerHistorial = () => {
        navigate(`/pacientes/${paciente.id}/historial`)
    }

    const handleEditar = () => {
        onEditar?.(paciente)
    }

    const handleEliminar = () => {
        setDialogEliminar(true)
    }

    const confirmarEliminar = () => {
        onEliminar?.(paciente)
        setDialogEliminar(false)
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {/* Acciones de visualización */}
                    <DropdownMenuItem onClick={handleVerPaciente}>
                        <Eye className="h-4 w-4" />
                        <span>Ver Paciente</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleVerTratamiento}>
                        <Activity className="h-4 w-4" />
                        <span>Ver Tratamiento</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleVerHistorial}>
                        <FileText className="h-4 w-4" />
                        <span>Ver Historial</span>
                    </DropdownMenuItem>
                    
                    
                    {/* Acciones de edición */}
                    {(role === "director" )&&(
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleEditar}>
                                <Pencil className="h-4 w-4" />
                                <span>Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive" onClick={handleEliminar}>
                                <Trash2 className="h-4 w-4" />
                                <span>Eliminar</span>
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Dialog de confirmación de eliminación */}
            <Dialog open={dialogEliminar} onOpenChange={setDialogEliminar}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Está seguro?</DialogTitle>
                        <DialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente el paciente{" "}
                            <span className="font-semibold">{paciente?.nombre}</span> y todos sus datos asociados.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogEliminar(false)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmarEliminar}
                        >
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}