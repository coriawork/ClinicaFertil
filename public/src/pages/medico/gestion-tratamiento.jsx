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
import { Search, Plus } from "lucide-react"
import { AccionesTratamiento } from "@/pages/acciones/Acciones_Tratamientos"
import { DialogNuevoTratamiento } from "@/components/nuevoTratamiento"

export function ListadoTratamientosPaciente() {
    const { id } = useParams()
    const { user } = useAuth()
    const [busqueda, setBusqueda] = useState("")
    const [filtroEstado, setFiltroEstado] = useState("todos")
    const [dialogNuevoAbierto, setDialogNuevoAbierto] = useState(false)
    const [tratamientos, setTratamientos] = useState([
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
            estado: "completado",
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
    ])

    const paciente = {
        id: id,
        nombre: "María González",
        dni: "35.123.456",
        email: "maria.gonzalez@email.com"
    }

    // Verificar si existe un tratamiento vigente
    const tieneTratamientoVigente = tratamientos.some(t => t.estado === "vigente")

    const getBadgeVariant = (estado) => {
        const variants = {
            vigente: "default",
            completado: "secondary",
            cancelado: "destructive"
        }
        return variants[estado] || "outline"
    }

    const handleCompletarTratamiento = (tratamiento) => {
        const fechaActual = new Date().toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })

        setTratamientos(prev => prev.map(t => 
            t.id === tratamiento.id 
                ? {
                    ...t,
                    estado: "completado",
                    fechaFin: fechaActual,
                    etapaActual: "Completado",
                    proximaEtapa: "-",
                    proximoTurno: "-"
                }
                : t
        ))

        console.log("Tratamiento completado:", tratamiento.id)
        // Aquí puedes agregar una llamada a la API para actualizar en el backend
    }

    const handleCancelarTratamiento = (tratamiento, motivo) => {
        const fechaActual = new Date().toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })

        setTratamientos(prev => prev.map(t => 
            t.id === tratamiento.id 
                ? {
                    ...t,
                    estado: "cancelado",
                    fechaCancelacion: fechaActual,
                    motivoCancelacion: motivo,
                    proximaEtapa: "-",
                    proximoTurno: "-"
                }
                : t
        ))

        console.log("Tratamiento cancelado:", tratamiento.id, "Motivo:", motivo)
        // Aquí puedes agregar una llamada a la API para actualizar en el backend
    }

    const handleNuevoTratamiento = (nuevoTratamiento) => {
        const tratamientoConId = {
            ...nuevoTratamiento,
            id: (tratamientos.length + 1).toString(),
            estado: "vigente",
            fechaInicio: new Date().toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }),
            ultimaConsulta: new Date().toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }),
            medicoTratante: user?.name || "Dr. Asignado"
        }

        setTratamientos(prev => [tratamientoConId, ...prev])
        console.log("Nuevo tratamiento agregado:", tratamientoConId)
        // Aquí puedes agregar una llamada a la API para guardar en el backend
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
        <DashboardLayout>
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
                    {
                        (user.role === 'paciente' ) ? null : (
                            <Button onClick={() => setDialogNuevoAbierto(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Nuevo Tratamiento
                            </Button>

                        )
                    }
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

                {/* Tabla de tratamientos */}
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
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
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
                                                    onCompletar={handleCompletarTratamiento}
                                                    onCancelar={handleCancelarTratamiento}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Diálogo para nuevo tratamiento */}
                <DialogNuevoTratamiento
                    open={dialogNuevoAbierto}
                    onOpenChange={setDialogNuevoAbierto}
                    onCrear={handleNuevoTratamiento}
                    tieneTratamientoVigente={tieneTratamientoVigente}
                />
            </div>
        </DashboardLayout>
    )
}