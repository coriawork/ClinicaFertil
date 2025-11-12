import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { 
  Search, 
  Filter, 
  UserPlus, 
  Eye, 
  Phone, 
  Mail, 
  Calendar,
  FileText,
  Activity,
  MoreHorizontal,
  SortAsc,
  SortDesc
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Link} from "react-router-dom"
import { CardShort } from "@/components/ui/card-short"
import { CardInfo } from "../../components/ui/card-info"
import { CardPaciente } from "@/components/ui/card-paciente"

export default function PacientesPage() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("todos")
  const [sortOrder, setSortOrder] = useState("asc")
  const [isLoadingPatients, setIsLoadingPatients] = useState(true)

  // Datos simulados de pacientes
  const [pacientes, setPacientes] = useState([
    {
      id: 1,
      nombre: "María",
      apellido: "González",
      edad: 32,
      dni: "12345678",
      telefono: "11-2345-6789",
      email: "maria.gonzalez@email.com",
      fechaRegistro: "2024-01-15",
      ultimaConsulta: "2024-11-01",
      estado: "activo",
      tratamiento: "Estimulación ovárica",
      proximaCita: "2024-11-07"
    },
    {
      id: 2,
      nombre: "Laura",
      apellido: "Pérez",
      edad: 28,
      dni: "87654321",
      telefono: "11-8765-4321",
      email: "laura.perez@email.com",
      fechaRegistro: "2024-02-20",
      ultimaConsulta: "2024-10-28",
      estado: "activo",
      tratamiento: "FIV",
      proximaCita: "2024-11-10"
    },
    {
      id: 3,
      nombre: "Ana",
      apellido: "Martínez",
      edad: 35,
      dni: "11223344",
      telefono: "11-1122-3344",
      email: "ana.martinez@email.com",
      fechaRegistro: "2024-03-10",
      ultimaConsulta: "2024-10-25",
      estado: "en_pausa",
      tratamiento: "Consulta inicial",
      proximaCita: null
    },
    {
      id: 4,
      nombre: "Carmen",
      apellido: "López",
      edad: 30,
      dni: "55667788",
      telefono: "11-5566-7788",
      email: "carmen.lopez@email.com",
      fechaRegistro: "2024-04-05",
      ultimaConsulta: "2024-11-02",
      estado: "activo",
      tratamiento: "Monitoreo",
      proximaCita: "2024-11-08"
    }
  ])

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "medico")) {
      navigate("/")
    }
    // Simular carga de datos
    setTimeout(() => setIsLoadingPatients(false), 1000)
  }, [user, isLoading, navigate])

    const pacientesFiltrados = pacientes
    .filter(paciente => {
        const matchesSearch = 
        paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paciente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paciente.dni.includes(searchTerm)
        
        const matchesFilter = selectedFilter === "todos" || paciente.estado === selectedFilter
        
        return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
        const comparison = a.apellido.localeCompare(b.apellido)
        return sortOrder === "asc" ? comparison : -comparison
    })

  if (isLoading || !user) {
    return null
  }

  return (
    <DashboardLayout role="medico">
        <div className="space-y-6 ">
        {/* Header */}
        <div className="flex justify-between items-center">
            <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Mis Pacientes</h2>
            <p className="text-muted-foreground">Gestiona y consulta la información de tus pacientes</p>
            </div>
            
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid gap-4 md:grid-cols-4">
            <CardInfo variant="" title="Total Pacientes" cant={pacientes.length} desc="Cantidad totatl de tus pacientes">
                <Activity className="h-4 w-4 text-primary" />
            </CardInfo>

            <CardInfo variant="" title="Pacientes Activos" cant={pacientes.filter(p => p.estado === "activo").length} desc="Cantidad de pacientes activos">
                <UserPlus className="h-4 w-4 text-primary" />
            </CardInfo>

            <CardInfo variant="" title="Nuevos este mes" cant="3" desc="Pacientes registrados este mes">
                <Calendar className="h-4 w-4 text-primary" />
            </CardInfo>

            <CardInfo variant="" title="Citas esta semana" cant="8" desc="Citas programadas para esta semana">
                <Calendar className="h-4 w-4 text-primary" />
            </CardInfo>
        </div>
        {/* Filtros y búsqueda */}
        <Card>
            <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-1 gap-4 max-w-md">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                    placeholder="Buscar por nombre, apellido o DNI..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    />
                </div>
                </div>
                
                <div className="flex gap-2 ">
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="w-[140px] bg-primary text-white hover:bg-primary/90 ">
                        <Filter className="text-white h-4 w-4 mr-2" />
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent  className="w-[140px] bg-primary text-white hover:bg-primary/90 ">
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="activo">Activos</SelectItem>
                        <SelectItem value="en_pausa">En pausa</SelectItem>
                        <SelectItem value="completado">Completados</SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                    {sortOrder === "asc" ? (
                    <SortAsc className="h-4 w-4" />
                    ) : (
                    <SortDesc className="h-4 w-4" />
                    )}
                </Button>
                </div>
            </div>
            </CardHeader>
        </Card>
        

        {/* Lista de pacientes */}
        <Card>
            <CardHeader>
            <CardTitle>Pacientes ({pacientesFiltrados.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
            {isLoadingPatients ? (
                <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Cargando pacientes...</p>
                </div>
            ) : pacientesFiltrados.length === 0 ? (
                <div className="p-8 text-center">
                <p className="text-muted-foreground">No se encontraron pacientes</p>
                </div>
            ) : (
                <div className="divide-y p-10 gap-2 flex flex-col">
                    {pacientesFiltrados.map((paciente) => (
                        <Link to={`/medico/pacientes/${paciente.id}`} key={paciente.id} className="no-underline">
                            <CardPaciente paciente={paciente} />
                        </Link>
                    ))}
                </div>
            )}
            </CardContent>
        </Card>
        </div>
    </DashboardLayout>
  )
}