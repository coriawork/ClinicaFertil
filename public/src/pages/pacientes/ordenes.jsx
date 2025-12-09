import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { emailService } from "@/utils/email"
import { Separator } from "@/components/ui/separator"
import { 
    Ban, 
    X, 
    FileText, 
    Download, 
    Calendar, 
    Stethoscope, 
    CheckCircle2, 
    Clock,
    Search,
    FileCheck,
    FileX,
    Plus
} from "lucide-react"
import { Combobox } from "@/components/ui/combobox"
import { toast } from "sonner"
import axios from "axios"

export function Estudios_Paciente() {
    const { id } = useParams()
    const { user } = useAuth()
    
    const esMedico = user?.role === "medico"
    const pacienteId = esMedico ? id : user?.id
    
    const [busqueda, setBusqueda] = useState("")
    const [filtroTipo, setFiltroTipo] = useState("todos")
    const [filtroEstado, setFiltroEstado] = useState("todos")
    const [ordenSeleccionada, setOrdenSeleccionada] = useState(null)
    const [dialogoAbierto, setDialogoAbierto] = useState(false)
    const [dialogoResultados, setDialogoResultados] = useState(false)
    const [descargando, setDescargando] = useState(null)
    
    // Estados para pedir estudios (solo médicos)
    const [mostrarFormularioEstudios, setMostrarFormularioEstudios] = useState(false) 
    const [estudiosSelected, setEstudiosSelected] = useState([])
    const [Estudios, setEstudios] = useState([])
    const [loadingEstudios, setLoadingEstudios] = useState(true)
    const [loadingPedido, setLoadingPedido] = useState(false)
    
    const [ordenParaResultados, setOrdenParaResultados] = useState(null)
    const [nuevoResultado, setNuevoResultado] = useState({ nombre: "", valor: "" })

    // Mock de pacientes
    const pacientesEJ = [
        { id: '1', nombre: 'Juan Perez', dni: '12345678' },
        { id: '2', nombre: 'Maria Gomez', dni: '87654321' },
        { id: '3', nombre: 'Carlos Rodriguez', dni: '11223344' }
    ]

    const getUserById = (id) => {
        return pacientesEJ.find(p => p.id === id) || { nombre: 'Paciente Ejemplo', dni: '00000000' }
    }

    const pacienteActual = getUserById(pacienteId)

    // Mock de órdenes médicas
    const [ordenesMedicas, setOrdenesMedicas] = useState([
        {
            id: "OM001",
            medico: {
                nombre: "Dr. Carlos Rodríguez",
                dni: 28123456
            },
            paciente: {
                nombre: pacienteActual.nombre,
                dni: parseInt(pacienteActual.dni)
            },
            tipo_estudio: "estudios_hormonales",
            determinaciones: [
                { id: 1, nombre: "FSH" },
                { id: 2, nombre: "LH" },
                { id: 3, nombre: "PRL" },
                { id: 4, nombre: "E2" },
                { id: 5, nombre: "TSH" },
                { id: 8, nombre: "HAM" }
            ],
            resultados: [],
            fecha: "2024-11-28",
            entregado: false,
            firma_medico: "firma_rodriguez.pdf"
        },
        {
            id: "OM002",
            medico: {
                nombre: "Dr. Juan Pérez",
                dni: 30987654
            },
            paciente: {
                nombre: pacienteActual.nombre,
                dni: parseInt(pacienteActual.dni)
            },
            tipo_estudio: "estudios_ginecologicos",
            determinaciones: [
                { id: 1, nombre: "PAP" },
                { id: 3, nombre: "ECO TV" },
                { id: 4, nombre: "MAMOGRAFÍA" },
                { id: 5, nombre: "ECO MAMARIA" }
            ],
            resultados: [
                { nombre: "PAP", valor: "Normal" },
                { nombre: "ECO TV", valor: "Sin hallazgos patológicos" }
            ],
            fecha: "2024-11-15",
            entregado: true,
            firma_medico: "firma_perez.pdf"
        }
    ])

    const tiposEstudio = {
        estudios_prequirurgicos: { label: "Prequirúrgico", color: "bg-blue-500" },
        estudios_hormonales: { label: "Hormonales", color: "bg-purple-500" },
        estudios_ginecologicos: { label: "Ginecológicos", color: "bg-pink-500" },
        estudios_semen: { label: "Semen", color: "bg-green-500" },
        orden_droga: { label: "Orden de Droga", color: "bg-orange-500" }
    }

    // Cargar estudios disponibles (solo para médicos)
    useEffect(() => {
        if (!esMedico) return
        
        const fetchEstudios = async () => {
            setLoadingEstudios(true)
            const endpoints = [
                { url: 'https://srlgceodssgoifgosyoh.supabase.co/functions/v1/estudio_ginecologico', tipo: 'estudios_ginecologicos' },
                { url: 'https://srlgceodssgoifgosyoh.supabase.co/functions/v1/estudio_hormonales', tipo: 'estudios_hormonales' },
                { url: 'https://srlgceodssgoifgosyoh.supabase.co/functions/v1/get-orden-estudio-prequirurgico', tipo: 'estudios_prequirurgicos' },
                { url: 'https://srlgceodssgoifgosyoh.supabase.co/functions/v1/estudio_semen', tipo: 'estudios_semen' }
            ]

            try {
                const responses = await Promise.all(
                    endpoints.map(endpoint => 
                        fetch(endpoint.url).then(response => ({ response, tipo: endpoint.tipo }))
                    )
                )

                const dataArrays = await Promise.all(
                    responses.map(async ({ response, tipo }) => {
                        if (!response.ok) {
                            console.warn(`Error en ${response.url}: ${response.status}`)
                            return []
                        }
                        const data = await response.json()
                        return data.map(estudio => ({ ...estudio, tipo_estudio: tipo }))
                    })
                )

                const todosLosEstudios = dataArrays.flat()
                const estudiosUnicos = new Map()
                
                todosLosEstudios.forEach(estudio => {
                    if (!estudiosUnicos.has(estudio.nombre)) {
                        estudiosUnicos.set(estudio.nombre, {
                            value: `${estudio.nombre.toLowerCase().replace(/\s+/g, '-')}`,
                            label: estudio.nombre,
                            id: estudio.id,
                            tipo_estudio: estudio.tipo_estudio
                        })
                    }
                })

                setEstudios(Array.from(estudiosUnicos.values()))
            } catch(e) {
                console.error('Error pidiendo estudios:', e)
                toast.error('Error al cargar estudios disponibles')
            } finally {
                setLoadingEstudios(false)
            }
        }
        
        fetchEstudios()
    }, [esMedico])

    // Función para pedir estudios (solo médicos)
    const handlePedirEstudios = async () => {
        if (estudiosSelected.length === 0) return

        setLoadingPedido(true)

        try {
            const gruposPorTipo = new Map()
            
            estudiosSelected.forEach(estudio => {
                const tipo = estudio.tipo_estudio
                if (!gruposPorTipo.has(tipo)) {
                    gruposPorTipo.set(tipo, [])
                }
                gruposPorTipo.get(tipo).push(estudio)
            })

            console.log('Grupos por tipo:', Array.from(gruposPorTipo.entries()))
            
            const listaEstudiosPedidos = []
            
            for (const [tipo_estudio, estudiosDelTipo] of gruposPorTipo.entries()) {
                listaEstudiosPedidos.push({
                    tipo: tipo_estudio.replace('estudios_', ''),
                    estudios: estudiosDelTipo.map(e => e.label)
                })

                // Crear nueva orden médica (mock)
                const nuevaOrden = {
                    id: `OM${String(ordenesMedicas.length + 1).padStart(3, '0')}`,
                    medico: {
                        nombre: user.name,
                        dni: user.dni || 12345678
                    },
                    paciente: {
                        nombre: pacienteActual.nombre,
                        dni: parseInt(pacienteActual.dni)
                    },
                    tipo_estudio: tipo_estudio,
                    determinaciones: estudiosDelTipo.map(e => ({ id: e.id, nombre: e.label })),
                    resultados: [],
                    fecha: new Date().toISOString().split('T')[0],
                    entregado: false,
                    firma_medico: `firma_${user.name}.pdf`
                }

                setOrdenesMedicas(prev => [...prev, nuevaOrden])
            }

            // Enviar email
            await emailService.sendEstudiosEmail({
                pacienteNombre: pacienteActual.nombre,
                medicoNombre: user.name,
                listaEstudios: listaEstudiosPedidos,
            })

            setEstudiosSelected([])
            toast.success("Órdenes generadas y enviadas correctamente")

        } catch (error) {
            console.error('Error al pedir estudios:', error)
            toast.error("Error al generar las órdenes")
        } finally {
            setLoadingPedido(false)
        }
    }

    const handleEliminarEstudios = (index) => {
        setEstudiosSelected(prev => prev.filter((_, i) => i !== index))
    }

    const addEstudios = (currentValue) => {
        if (!currentValue) return
        
        const estudioCompleto = Estudios.find(e => 
            e.value === currentValue || 
            e.label === currentValue ||
            (typeof currentValue === 'object' && (e.value === currentValue.value || e.label === currentValue.label))
        )
        
        if (!estudioCompleto) return
        
        setEstudiosSelected(prev => {
            const yaExiste = prev.some(est => est.label === estudioCompleto.label)
            if (yaExiste) return prev
            
            return [...prev, {
                label: estudioCompleto.label,
                value: estudioCompleto.value,
                id: estudioCompleto.id,
                tipo_estudio: estudioCompleto.tipo_estudio
            }]
        })
    }

    // Función para abrir diálogo de resultados
    const abrirDialogoResultados = (orden) => {
        setOrdenParaResultados(orden)
        setNuevoResultado({ nombre: "", valor: "" })
        setDialogoResultados(true)
    }

    // Función para agregar resultado
    const handleAgregarResultado = () => {
        if (!nuevoResultado.nombre.trim() || !nuevoResultado.valor.trim()) {
            toast.error("Complete todos los campos")
            return
        }

        setOrdenesMedicas(prev => prev.map(orden => {
            if (orden.id === ordenParaResultados.id) {
                const nuevosResultados = [...orden.resultados, nuevoResultado]
                // Si tiene resultados para todas las determinaciones, marcar como entregado
                const entregado = nuevosResultados.length >= orden.determinaciones.length
                
                return {
                    ...orden,
                    resultados: nuevosResultados,
                    entregado
                }
            }
            return orden
        }))

        toast.success("Resultado agregado exitosamente")
        setNuevoResultado({ nombre: "", valor: "" })
    }

    const cerrarDialogoResultados = () => {
        setDialogoResultados(false)
        setOrdenParaResultados(null)
        setNuevoResultado({ nombre: "", valor: "" })
    }

    // Descargar PDF
    const descargarPDF = async (orden) => {
        setDescargando(orden.id)
        try {
            const formData = new FormData()
            
            const payload = {
                medico: { 
                    nombre: orden.medico.nombre, 
                    dni: orden.medico.dni.toString(),
                    firma_url:'1232323'
                },
                paciente: { 
                    nombre: orden.paciente.nombre, 
                    dni: orden.paciente.dni.toString() 
                },
                tipo_estudio: orden.tipo_estudio,
                determinaciones: orden.determinaciones.map(det => ({ 
                    nombre: det.nombre 
                }))
            }
            
            formData.append("payload", JSON.stringify(payload))

            const response = await axios.post(
                '/functions/v1/generar_orden_medica',
                formData,
                {
                    responseType: 'blob',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    timeout: 30000
                }
            )

            const blob = new Blob([response.data], { type: 'application/pdf' })
            const url = window.URL.createObjectURL(blob)
            window.open(url, '_blank')
            
            setTimeout(() => window.URL.revokeObjectURL(url), 100)
            
            toast.success('PDF generado exitosamente')
        } catch (error) {
            console.error('Error al descargar PDF:', error)
          /*   
            if (error.code === 'ECONNABORTED') {
                toast.error('Tiempo de espera agotado.')
            } else if (error.response) {
                const status = error.response.status
                if (status === 404) {
                    toast.error('Servicio no encontrado.')
                } else if (status === 500) {
                    toast.error('Error interno del servidor.')
                } else if (status === 400) {
                    toast.error('Datos inválidos.')
                } else {
                    toast.error(`Error del servidor: ${status}`)
                }
            } else if (error.request) {
                toast.error('No se pudo conectar con el servidor.')
            } else {
                toast.error('Error al procesar la solicitud.')
            } */
        } finally {
            setDescargando(null)
        }
    }

    const verDetalle = (orden) => {
        setOrdenSeleccionada(orden)
        setDialogoAbierto(true)
    }

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    const ordenesFiltradas = ordenesMedicas.filter(orden => {
        const cumpleBusqueda = 
            orden.id.toLowerCase().includes(busqueda.toLowerCase()) ||
            orden.medico.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            orden.tipo_estudio.toLowerCase().includes(busqueda.toLowerCase())
        
        const cumpleTipo = filtroTipo === "todos" || orden.tipo_estudio === filtroTipo
        
        const cumpleEstado = filtroEstado === "todos" || 
            (filtroEstado === "entregado" && orden.entregado) ||
            (filtroEstado === "pendiente" && !orden.entregado)

        return cumpleBusqueda && cumpleTipo && cumpleEstado
    })

    return (
        <DashboardLayout role={user?.role}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {esMedico ? `Órdenes Médicas - ${pacienteActual.nombre}` : 'Mis Órdenes Médicas'}
                        </h1>
                        <p className="text-muted-foreground">
                            {esMedico 
                                ? 'Gestione las órdenes médicas y resultados del paciente'
                                : 'Consulte y descargue sus órdenes de estudios médicos'
                            }
                        </p>
                    </div>
                    {/* Botón para solicitar estudios (solo médicos) */}
                    {esMedico && (
                        <Button 
                            onClick={() => setMostrarFormularioEstudios(!mostrarFormularioEstudios)}
                            variant={mostrarFormularioEstudios ? "outline" : "default"}
                        >
                            {mostrarFormularioEstudios ? (
                                <>
                                    <X className="mr-2 h-4 w-4" />
                                    Cancelar
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Solicitar Nuevos Estudios
                                </>
                            )}
                        </Button>
                    )}
                </div>


                
                {/* Estadísticas */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Órdenes</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{ordenesMedicas.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                            <Clock className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {ordenesMedicas.filter(o => !o.entregado).length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Entregadas</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {ordenesMedicas.filter(o => o.entregado).length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Este Mes</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {ordenesMedicas.filter(o => {
                                    const fecha = new Date(o.fecha)
                                    const hoy = new Date()
                                    return fecha.getMonth() === hoy.getMonth() && 
                                           fecha.getFullYear() === hoy.getFullYear()
                                }).length}
                            </div>
                        </CardContent>
                    </Card>
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
                                    placeholder="Buscar por ID, médico o tipo..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tipo de estudio" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos los tipos</SelectItem>
                                    <SelectItem value="estudios_prequirurgicos">Prequirúrgico</SelectItem>
                                    <SelectItem value="estudios_hormonales">Hormonales</SelectItem>
                                    <SelectItem value="estudios_ginecologicos">Ginecológicos</SelectItem>
                                    <SelectItem value="estudios_semen">Semen</SelectItem>
                                    <SelectItem value="orden_droga">Orden de Droga</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos los estados</SelectItem>
                                    <SelectItem value="pendiente">Pendientes</SelectItem>
                                    <SelectItem value="entregado">Entregadas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
                {esMedico && mostrarFormularioEstudios && (
                    <Card className="border-primary">
                        <CardHeader>
                            <CardTitle className="flex text-2xl uppercase items-center gap-2">
                                Solicitar Nuevos Estudios
                            </CardTitle>
                            <Separator/>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 w-full">
                                <Label className="text-muted-foreground/50 ml-px" htmlFor="estudiosSelected">
                                    Lista de estudios disponibles
                                </Label>
                                <Combobox
                                    id='estudiosSelected' 
                                    datas={loadingEstudios ? [{value: 'loading', label: 'Cargando estudios...'}] : Estudios} 
                                    title="Elija un estudio" 
                                    action={addEstudios} 
                                    className="w-full"
                                    disabled={loadingEstudios}
                                />
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {(estudiosSelected && estudiosSelected.length !== 0) ? (
                                    estudiosSelected.map((estudio, index) => (
                                        <div key={index} className="flex w-fit justify-between items-center p-3 border rounded-lg gap-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm uppercase font-bold">{estudio.label}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {estudio.tipo_estudio?.replace('estudios_', '')}
                                                </span>
                                            </div>
                                            <X 
                                                onClick={() => handleEliminarEstudios(index)} 
                                                className="cursor-pointer hover:text-destructive"
                                                size={18}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex text-muted-foreground gap-5 items-center w-full">
                                        <Ban size={20}/>
                                        <h1>No hay estudios seleccionados aún</h1>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="w-full justify-between">
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    setMostrarFormularioEstudios(false)
                                    setEstudiosSelected([])
                                }}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Cancelar
                            </Button>
                            {(estudiosSelected && estudiosSelected.length !== 0) && (
                                <Button onClick={handlePedirEstudios} disabled={loadingPedido}>
                                    {loadingPedido ? 'Generando órdenes...' : 'Solicitar Estudios'}
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                )}

                {/* Lista de Órdenes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Órdenes Médicas</CardTitle>
                        <CardDescription>
                            Mostrando {ordenesFiltradas.length} de {ordenesMedicas.length} órdenes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Médico</TableHead>
                                    <TableHead>Tipo de Estudio</TableHead>
                                    <TableHead>Determinaciones</TableHead>
                                    <TableHead>Resultados</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ordenesFiltradas.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                                            No se encontraron órdenes con los filtros aplicados
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    ordenesFiltradas.map((orden) => (
                                        <TableRow key={orden.id}>
                                            <TableCell className="font-medium">{orden.id}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    {formatearFecha(orden.fecha)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                                                    <div>
                                                        <div className="font-medium">{orden.medico.nombre}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            DNI: {orden.medico.dni.toLocaleString('es-AR')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge 
                                                    variant="outline" 
                                                    className={`${tiposEstudio[orden.tipo_estudio].color} text-white`}
                                                >
                                                    {tiposEstudio[orden.tipo_estudio].label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button 
                                                    variant="link" 
                                                    onClick={() => verDetalle(orden)}
                                                    className="p-0 h-auto"
                                                >
                                                    Ver {orden.determinaciones.length} estudios
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-muted-foreground">
                                                    {orden.resultados.length} / {orden.determinaciones.length}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={orden.entregado ? "default" : "secondary"}>
                                                    {orden.entregado ? (
                                                        <><FileCheck className="mr-1 h-3 w-3" /> Entregado</>
                                                    ) : (
                                                        <><FileX className="mr-1 h-3 w-3" /> Pendiente</>
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {esMedico && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => abrirDialogoResultados(orden)}
                                                        >
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Resultado
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        onClick={() => descargarPDF(orden)}
                                                        disabled={descargando === orden.id}
                                                    >
                                                        {descargando === orden.id ? (
                                                            <>Generando...</>
                                                        ) : (
                                                            <>
                                                                <Download className="mr-2 h-4 w-4" />
                                                                PDF
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Diálogo de detalle */}
                <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Detalle de la Orden Médica</DialogTitle>
                            <DialogDescription>
                                {ordenSeleccionada?.id} - {ordenSeleccionada && formatearFecha(ordenSeleccionada?.fecha)}
                            </DialogDescription>
                        </DialogHeader>
                        {ordenSeleccionada && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Médico Solicitante</label>
                                        <p className="text-sm text-muted-foreground">
                                            {ordenSeleccionada.medico.nombre}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            DNI: {ordenSeleccionada.medico.dni.toLocaleString('es-AR')}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Tipo de Estudio</label>
                                        <p className="text-sm">
                                            <Badge 
                                                variant="outline" 
                                                className={`${tiposEstudio[ordenSeleccionada.tipo_estudio].color} text-white`}
                                            >
                                                {tiposEstudio[ordenSeleccionada.tipo_estudio].label}
                                            </Badge>
                                        </p>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium">Determinaciones Solicitadas</label>
                                    <ul className="mt-2 space-y-2">
                                        {ordenSeleccionada.determinaciones.map((det) => {
                                            const resultado = ordenSeleccionada.resultados.find(r => r.nombre === det.nombre)
                                            return (
                                                <li key={det.id} className="flex items-start justify-between gap-2 text-sm">
                                                    <div className="flex items-start gap-2">
                                                        <CheckCircle2 className={`h-4 w-4 mt-0.5 ${resultado ? 'text-green-500' : 'text-gray-300'}`} />
                                                        <span>{det.nombre}</span>
                                                    </div>
                                                    {resultado && (
                                                        <span className="text-primary font-medium">{resultado.valor}</span>
                                                    )}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t">
                                    <div>
                                        <label className="text-sm font-medium">Estado</label>
                                        <p className="text-sm">
                                            <Badge variant={ordenSeleccionada.entregado ? "default" : "secondary"}>
                                                {ordenSeleccionada.entregado ? "Entregado" : "Pendiente"}
                                            </Badge>
                                        </p>
                                    </div>
                                    <Button onClick={() => descargarPDF(ordenSeleccionada)}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Descargar PDF
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Diálogo para agregar resultados (solo médicos) */}
                <Dialog open={dialogoResultados} onOpenChange={setDialogoResultados}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Agregar Resultado</DialogTitle>
                            <DialogDescription>
                                Orden: {ordenParaResultados?.id}
                            </DialogDescription>
                        </DialogHeader>
                        {ordenParaResultados && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="determinacion">Determinación</Label>
                                    <Select 
                                        value={nuevoResultado.nombre} 
                                        onValueChange={(value) => setNuevoResultado({...nuevoResultado, nombre: value})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione una determinación" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ordenParaResultados.determinaciones
                                                .filter(det => !ordenParaResultados.resultados.some(r => r.nombre === det.nombre))
                                                .map(det => (
                                                    <SelectItem key={det.id} value={det.nombre}>
                                                        {det.nombre}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="valor">Valor/Resultado</Label>
                                    <Input
                                        id="valor"
                                        value={nuevoResultado.valor}
                                        onChange={(e) => setNuevoResultado({...nuevoResultado, valor: e.target.value})}
                                        placeholder="Ingrese el resultado"
                                    />
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={cerrarDialogoResultados}>
                                Cancelar
                            </Button>
                            <Button onClick={handleAgregarResultado}>
                                Guardar Resultado
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    )
}