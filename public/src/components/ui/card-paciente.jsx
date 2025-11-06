import { Link } from "react-router-dom"
import { Phone, Mail, Eye, FileText, MoreHorizontal } from "lucide-react"
import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function CardPaciente({ paciente }) {
    const formatFecha = (fecha) => {
        if (!fecha) return "-"
            return new Date(fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }
    /* const getEstadoBadge = (estado) => {
        switch (estado) {
            case "activo":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Activo</Badge>
            case "en_pausa":
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En pausa</Badge>
            case "completado":
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completado</Badge>
            default:
                return <Badge variant="secondary">-</Badge>
        }
    } */
    return (
        <div key={paciente.id} className="cursor-pointer group bg-primary rounded-xl hover:scale-[1.008] transition-all p-4 hover:bg-primary/90 ">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                <div className="w-12 h-12 shadow-inset-strong   rounded-full bg-background flex items-center justify-center">
                    <span className="font-semibold">
                        {paciente.nombre[0]}{paciente.apellido[0]}
                    </span>
                </div>
                
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-background">
                        {paciente.nombre} {paciente.apellido}
                    </h3>
                    {/* {getEstadoBadge(paciente.estado)} */}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/90">
                    <span>DNI: {paciente.dni}</span>
                    <span>•</span>
                    <span>{paciente.edad} años</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/90">
                    <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{paciente.telefono}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span>{paciente.email}</span>
                    </div>
                    </div>
                </div>
                </div>

                <div className="flex items-center gap-2">
                <div className="text-right space-y-1 mr-4">
                    <p className="text-sm font-medium text-white">
                    {paciente.tratamiento}
                    </p>
                    <p className="text-xs text-white/90">
                        Última consulta: {formatFecha(paciente.ultimaConsulta)}
                    </p>
                    {paciente.proximaCita && (
                    <p className="text-xs text-white/90">
                        Próxima cita: {formatFecha(paciente.proximaCita)}
                    </p>
                    )}
                </div>

                <div className="flex gap-1 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" asChild>
                        <Link to={`/medico/pacientes/${paciente.id}`}>
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button>
                    
                    <Button variant="ghost" size="sm" asChild>
                        <Link to={`/medico/pacientes/${paciente.id}/historia`}>
                            <FileText className="h-4 w-4" />
                        </Link>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link to={`/medico/pacientes/${paciente.id}/editar`}>
                                    Editar información
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to={`/medico/agenda/nueva?paciente=${paciente.id}`}>
                                    Agendar cita
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to={`/medico/estudios/nuevo?paciente=${paciente.id}`}>
                                    Solicitar estudio
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                </div>
            </div>
        </div>
    )
}