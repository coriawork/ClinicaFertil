import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { useAuth } from "@/lib/AuthContext"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, ArrowLeft } from "lucide-react"
import { AccionesTratamiento } from "@/pages/acciones/Acciones_Tratamientos"
export function ListadoTratamientosPaciente() {
    const { id } = useParams()
    const { user } = useAuth()
    const [busqueda, setBusqueda] = useState("")
    const [filtroEstado, setFiltroEstado] = useState("todos")

    const paciente = {
        id: id,
        nombre: "María González",
        dni: "35.123.456",
        email: "maria.gonzalez@email.com"
    }

    const tratamientos = [
        {
            id: "1",
            objetivo: "Embarazo con gametos propios",
            estado: "vigente",
            fechaInicio: "10/11/2024",
            ultimaConsulta: "25/11/2024",
            etapaActual: "Estimulación Ovárica",
            medicoTratante: "Dr. Carlos Rodríguez",
            proximaEtapa: "Monitoreo",
            proximoTurno: "05/12/2024 - 10:30hs"
        },
        {
            id: "2",
            objetivo: "Preservación de ovocitos",
            estado: "completado",
            fechaInicio: "15/08/2024",
            fechaFin: "20/10/2024",
            ultimaConsulta: "20/10/2024",
            etapaActual: "Completado",
            medicoTratante: "Dr. Carlos Rodríguez",
            proximaEtapa: "-",
            proximoTurno: "-"
        },
        {
            id: "3",
            objetivo: "FIV con ICSI",
            estado: "vigente",
            fechaInicio: "01/10/2024",
            ultimaConsulta: "28/11/2024",
            etapaActual: "Segunda Consulta",
            medicoTratante: "Dr. Juan Pérez",
            proximaEtapa: "Estimulación",
            proximoTurno: "10/12/2024 - 09:00hs"
        },
        {
            id: "4",
            objetivo: "Método ROPA",
            estado: "cancelado",
            fechaInicio: "05/06/2024",
            fechaCancelacion: "15/09/2024",
            ultimaConsulta: "10/09/2024",
            motivoCancelacion: "Decisión personal de la paciente",
            etapaActual: "Primera Consulta",
            medicoTratante: "Dr. Carlos Rodríguez",
            proximaEtapa: "-",
            proximoTurno: "-"
        }
    ]

    const handleEditarTratamiento = (tratamiento) => {
        console.log("Editar tratamiento:", tratamiento)
    }

    const handleEliminarTratamiento = (tratamiento) => {
        console.log("Eliminar tratamiento:", tratamiento)
    }

    const getBadgeVariant = (estado) => {
        const variants = {
            vigente: "default",
            completado: "secondary",
            cancelado: "destructive"
        }
        return variants[estado] || "outline"
    }

    const tratamientosFiltrados = tratamientos.filter(t => {
        const cumpleBusqueda = 
            t.objetivo.toLowerCase().includes(busqueda.toLowerCase()) ||
            t.id.toLowerCase().includes(busqueda.toLowerCase()) ||
            t.etapaActual.toLowerCase().includes(busqueda.toLowerCase())
        
        const cumpleEstado = filtroEstado === "todos" || t.estado === filtroEstado

        return cumpleBusqueda && cumpleEstado
    })

    return (
        <DashboardLayout role={user?.role}>
            <div className="space-y-6">

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Tratamientos</h1>
                            <p className="text-muted-foreground">
                                Paciente: {paciente.nombre} - DNI: {paciente.dni}
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link to={`/pacientes/${id}/tratamiento/nuevo`}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo Tratamiento
                        </Link>
                    </Button>
                </div>

           

                {/* Filtros */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filtros de Búsqueda</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por ID, objetivo o etapa..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Estado del tratamiento" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos los estados</SelectItem>
                                    <SelectItem value="vigente">Vigente</SelectItem>
                                    <SelectItem value="completado">Completado</SelectItem>
                                    <SelectItem value="cancelado">Cancelado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

      
                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Tratamientos</CardTitle>
                        <CardDescription>
                            Mostrando {tratamientosFiltrados.length} de {tratamientos.length} tratamientos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Objetivo</TableHead>
                                    <TableHead>Etapa Actual</TableHead>
                                    <TableHead>Estado</TableHead>       
                                    <TableHead>Fecha Inicio</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tratamientosFiltrados.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                                            No se encontraron tratamientos con los filtros aplicados
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tratamientosFiltrados.map((tratamiento) => (
                                        <TableRow key={tratamiento.id}>
                                            <TableCell className="font-medium">
                                                <Link to={`/pacientes/${id}/tratamiento/${tratamiento.id}`} className="hover:underline">
                                                    {tratamiento.id}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{tratamiento.objetivo}</div>
                                            </TableCell>
                                            
                                            <TableCell>
                                                <div>{tratamiento.etapaActual}</div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge variant={getBadgeVariant(tratamiento.estado)}>
                                                    {tratamiento.estado}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{tratamiento.fechaInicio}</TableCell>
                                                
                                         
                                            <TableCell className="text-right">
                                                <AccionesTratamiento
                                                    tratamiento={tratamiento}
                                                    pacienteId={id}
                                                    onEditar={handleEditarTratamiento}
                                                    onEliminar={handleEliminarTratamiento}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}