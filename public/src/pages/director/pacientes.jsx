import { useState } from "react"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { useAuth } from "@/lib/AuthContext"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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

import {AccionesPaciente } from "@/pages/acciones/Acciones_Pacientes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Eye, FileText, Calendar, Activity, User, Phone, Mail, CreditCard } from "lucide-react"

export function GestionPacientes() {
    const { user } = useAuth()
    const [busqueda, setBusqueda] = useState("")
    const [filtroEstado, setFiltroEstado] = useState("todos")
    const [filtroMedico, setFiltroMedico] = useState("todos")
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null)

    const handleEditarPaciente = (paciente) => {
        console.log("Editar paciente:", paciente)
    }

    const handleEliminarPaciente = (paciente) => {
        console.log("Eliminar paciente:", paciente)
    }

    const pacientes = [
        {
            id: "1",
            nombre: "María González",
            dni: "35.123.456",
            fechaNacimiento: "15/03/1990",
            edad: 34,
            telefono: "+54 9 11 1234-5678",
            email: "maria.gonzalez@email.com",
            coberturaMedica: "Swiss Medical",
            numeroSocio: "123456789",
            medicoTratante: "Dr. Carlos Rodríguez",
            tratamientos: [
                {
                    id: "TRT001",
                    objetivo: "Embarazo con gametos propios",
                    estado: "vigente",
                    fechaInicio: "10/11/2024",
                    ultimaConsulta: "25/11/2024",
                    etapaActual: "Monitoreo"
                }
            ],
            ultimoTratamiento: "Estimulación Ovárica",
            estadoTratamiento: "vigente",
            proximoTurno: "05/12/2024 - 10:30hs"
        },
        {
            id: "2",
            nombre: "Ana Martínez",
            dni: "32.987.654",
            fechaNacimiento: "22/07/1988",
            edad: 36,
            telefono: "+54 9 11 9876-5432",
            email: "ana.martinez@email.com",
            coberturaMedica: "OSDE",
            numeroSocio: "987654321",
            medicoTratante: "Dr. Juan Pérez",
            tratamientos: [
                {
                    id: "TRT002",
                    objetivo: "Preservación de ovocitos",
                    estado: "completado",
                    fechaInicio: "15/08/2024",
                    fechaFin: "20/10/2024",
                    etapaActual: "Completado"
                }
            ],
            ultimoTratamiento: "Preservación de ovocitos",
            estadoTratamiento: "completado",
            proximoTurno: "-"
        },
        {
            id: "3",
            nombre: "Laura Fernández",
            dni: "38.456.789",
            fechaNacimiento: "05/12/1992",
            edad: 32,
            telefono: "+54 9 11 4567-8901",
            email: "laura.fernandez@email.com",
            coberturaMedica: "Galeno",
            numeroSocio: "456789123",
            medicoTratante: "Dr. Carlos Rodríguez",
            tratamientos: [
                {
                    id: "TRT003",
                    objetivo: "Método ROPA",
                    estado: "vigente",
                    fechaInicio: "20/10/2024",
                    ultimaConsulta: "28/11/2024",
                    etapaActual: "Segunda consulta"
                }
            ],
            ultimoTratamiento: "Segunda consulta",
            estadoTratamiento: "vigente",
            proximoTurno: "08/12/2024 - 14:00hs"
        },
        {
            id: "4",
            nombre: "Sofía Ramírez",
            dni: "40.234.567",
            fechaNacimiento: "18/04/1995",
            edad: 29,
            telefono: "+54 9 11 2345-6789",
            email: "sofia.ramirez@email.com",
            coberturaMedica: "Medicus",
            numeroSocio: "234567890",
            medicoTratante: "Dr. Juan Pérez",
            tratamientos: [
                {
                    id: "TRT004",
                    objetivo: "Embarazo con donante",
                    estado: "cancelado",
                    fechaInicio: "05/06/2024",
                    fechaCancelacion: "15/09/2024",
                    motivoCancelacion: "Decisión personal de la paciente",
                    etapaActual: "Cancelado"
                }
            ],
            ultimoTratamiento: "Primera Consulta",
            estadoTratamiento: "cancelado",
            proximoTurno: "-"
        }
    ]

    const medicos = [
        { value: "todos", label: "Todos los médicos" },
        { value: "dr-carlos", label: "Dr. Carlos Rodríguez" },
        { value: "dr-juan", label: "Dr. Juan Pérez" }
    ]

    const getBadgeVariant = (estado) => {
        const variants = {
            vigente: "default",
            completado: "secondary",
            cancelado: "destructive"
        }
        return variants[estado] || "outline"
    }

    const pacientesFiltrados = pacientes.filter(p => {
        const cumpleBusqueda = 
            p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.dni.includes(busqueda) ||
            p.id.toLowerCase().includes(busqueda.toLowerCase())
        
        const cumpleEstado = filtroEstado === "todos" || p.estadoTratamiento === filtroEstado
        
        const cumpleMedico = filtroMedico === "todos" || 
            p.medicoTratante.toLowerCase().includes(filtroMedico.replace("dr-", "").replace("-", " "))

        return cumpleBusqueda && cumpleEstado && cumpleMedico
    })

    return (
        <DashboardLayout role="director">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de Pacientes</h1>
                    <p className="text-muted-foreground">
                        Administración completa de pacientes y sus tratamientos
                    </p>
                </div>

                {/* Filtros */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filtros de Búsqueda</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por nombre, DNI o ID..."
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
                            {/* <Select value={filtroMedico} onValueChange={setFiltroMedico}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Médico tratante" />
                                </SelectTrigger>
                                <SelectContent>
                                    {medicos.map(medico => (
                                        <SelectItem key={medico.value} value={medico.value}>
                                            {medico.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select> */}
                        </div>
                    </CardContent>
                </Card>

                {/* Tabla de pacientes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Pacientes</CardTitle>
                        <CardDescription>
                            Mostrando {pacientesFiltrados.length} de {pacientes.length} pacientes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Paciente</TableHead>
                                    <TableHead>DNI</TableHead>
                                    {/* <TableHead>Edad</TableHead> */}
                                    {
                                        (user.role == "director") && (
                                            <TableHead>Médico Tratante</TableHead>
                                        )
                                    }
                                    <TableHead>Etapa Actual</TableHead>
                                    <TableHead>Estado</TableHead>
                                    {/* <TableHead>Próximo Turno</TableHead> */}
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pacientesFiltrados.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center text-muted-foreground">
                                            No se encontraron pacientes con los filtros aplicados
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pacientesFiltrados.map((paciente) => (
                                        <TableRow key={paciente.id}>
                                            <TableCell className="font-medium">{paciente.id}</TableCell>
                                            <TableCell>
                                                <div className="font-medium">{paciente.nombre}</div>
                                                <div className="text-sm text-muted-foreground">{paciente.email}</div>
                                            </TableCell>
                                            <TableCell>{paciente.dni}</TableCell>
                                            {/* <TableCell>{paciente.edad} años</TableCell> */}
                                             {
                                            (user.role == "director") && (
                                            <TableCell>{paciente.medicoTratante}</TableCell>
                                            )}
                                            <TableCell>{paciente.ultimoTratamiento}</TableCell>
                                            <TableCell>
                                                <Badge variant={getBadgeVariant(paciente.estadoTratamiento)}>
                                                    {paciente.estadoTratamiento}
                                                </Badge>
                                            </TableCell>
                                            {/* <TableCell>{paciente.proximoTurno}</TableCell> */}
                                            <TableCell className="text-right">
                                                <AccionesPaciente
                                                    paciente={paciente}
                                                    onEditar={handleEditarPaciente}
                                                    onEliminar={handleEliminarPaciente}
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