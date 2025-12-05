import { useState } from "react"
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Edit, Trash2, Mail, Phone, UserCheck, UserX, Microscope, Stethoscope } from "lucide-react"
import { Label } from "@/components/ui/label"
import { emailService } from "@/utils/email"
import {toast} from 'sonner'

export function MedicosCrud() {
    const { user } = useAuth()
    const [busqueda, setBusqueda] = useState("")
    const [filtroEstado, setFiltroEstado] = useState("todos")
    const [filtroTipo, setFiltroTipo] = useState("todos")
    const [dialogoAbierto, setDialogoAbierto] = useState(false)
    const [dialogoEliminar, setDialogoEliminar] = useState(false)
    const [medicoEditando, setMedicoEditando] = useState(null)
    const [medicoEliminar, setMedicoEliminar] = useState(null)
    const [cargandoEmail, setCargandoEmail] = useState(false)

    const [medicos, setMedicos] = useState([
        {
            id: "MED001",
            nombre: "Carlos Rodríguez",
            dni: "28.123.456",
            email: "carlos.rodriguez@fertilcare.com",
            telefono: "+54 9 11 2345-6789",
            matricula: "MN 45678",
            fechaAlta: "15/01/2020",
            estado: "activo",
            tipo: "medico",
            pacientesAsignados: 15
        },
        {
            id: "MED002",
            nombre: "Juan Pérez",
            dni: "30.987.654",
            email: "juan.perez@fertilcare.com",
            telefono: "+54 9 11 9876-5432",
            matricula: "MN 54321",
            fechaAlta: "20/03/2021",
            estado: "activo",
            tipo: "medico",
            pacientesAsignados: 12
        },
        {
            id: "MED003",
            nombre: "María López",
            dni: "32.456.789",
            email: "maria.lopez@fertilcare.com",
            telefono: "+54 9 11 4567-8901",
            matricula: "MN 67890",
            fechaAlta: "10/06/2022",
            estado: "activo",
            tipo: "laboratorio",
            pacientesAsignados: 0
        }
    ])

    const [formulario, setFormulario] = useState({
        nombre: "",
        dni: "",
        email: "",
        telefono: "",
        matricula: "",
        estado: "activo",
        tipo: "medico"
    })

    const tiposProfesional = [
        { value: "medico", label: "Médico Particular" },
        { value: "laboratorio", label: "Operador de Laboratorio" }
    ]

    const generarPassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'
        let password = ''
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return password
    }

    const enviarEmailCredenciales = async (medico, password) => {
        setCargandoEmail(true)
        try {
            const tipoTexto = medico.tipo === "medico" ? "Médico" : "Operador de Laboratorio"
            const htmlBody = emailService.generateEmailTemplate({
                title: 'Bienvenido a FertilCare',
                greeting: `${medico.nombre},`,
                content: `
                    <p>Su cuenta ha sido creada exitosamente en la plataforma FertilCare como <strong>${tipoTexto}</strong>.</p>
                    <div class="estudios-list">
                        <ul>
                            <li><strong>Tipo de cuenta:</strong> ${tipoTexto}</li>
                            <li><strong>Usuario:</strong> ${medico.email}</li>
                            <li><strong>Contraseña temporal:</strong> ${password}</li>
                            <li><strong>Matrícula:</strong> ${medico.matricula}</li>
                        </ul>
                    </div>
                    <p>Por favor, ingrese a la plataforma y cambie su contraseña en el primer acceso.</p>
                `,
                alertBox: `
                    <strong>Seguridad:</strong>
                    <p style="margin: 0;">Esta contraseña es temporal. Por favor cámbiela inmediatamente después de iniciar sesión.</p>
                `,
                signature: 'Clínica FertilCare'
            })

            await emailService.sendEmail({
                group: 10,
                toEmails: ["manuelcoriaesc@gmail.com"],
                subject: `Credenciales de acceso - ${tipoTexto} - FertilCare`,
                htmlBody
            })

            console.log('Email enviado exitosamente a:', medico.email)
        } catch (error) {
            console.error('Error al enviar email:', error)
            toast.error('El profesional fue creado pero hubo un error al enviar el email con las credenciales.')
        } finally {
            setCargandoEmail(false)
        }
    }

    const handleAbrirDialogo = (medico = null) => {
        if (medico) {
            setMedicoEditando(medico)
            setFormulario({
                nombre: medico.nombre,
                dni: medico.dni,
                email: medico.email,
                telefono: medico.telefono,
                matricula: medico.matricula,
                estado: medico.estado,
                tipo: medico.tipo
            })
        } else {
            setMedicoEditando(null)
            setFormulario({
                nombre: "",
                dni: "",
                email: "",
                telefono: "",
                matricula: "",
                estado: "activo",
                tipo: "medico"
            })
        }
        setDialogoAbierto(true)
    }

    const handleGuardar = async () => {
        if (!formulario.nombre || !formulario.dni || !formulario.email || !formulario.telefono || 
            !formulario.matricula || !formulario.tipo) {
            toast.error("Por favor complete todos los campos")
            return
        }

        if (medicoEditando) {
            // Editar médico existente
            setMedicos(medicos.map(m => 
                m.id === medicoEditando.id 
                    ? { ...m, ...formulario }
                    : m
            ))
            toast.success("Profesional actualizado exitosamente")
        } else {
            // Crear nuevo médico
            const password = generarPassword()
            const nuevoMedico = {
                id: `MED${String(medicos.length + 1).padStart(3, '0')}`,
                ...formulario,
                fechaAlta: new Date().toLocaleDateString('es-AR'),
                pacientesAsignados: 0
            }
            
            setMedicos([...medicos, nuevoMedico])
            
            // Enviar email con credenciales
            await enviarEmailCredenciales(nuevoMedico, password)
            
            const tipoTexto = nuevoMedico.tipo === "medico" ? "Médico" : "Operador de Laboratorio"
            toast.success(`${tipoTexto} creado exitosamente.\nSe ha enviado un email a ${nuevoMedico.email} con las credenciales de acceso.`)
        }

        setDialogoAbierto(false)
    }

    const handleEliminar = () => {
        setMedicos(medicos.filter(m => m.id !== medicoEliminar.id))
        toast.success("Profesional eliminado exitosamente")
        setDialogoEliminar(false)
        setMedicoEliminar(null)
    }

    const handleAbrirDialogoEliminar = (medico) => {
        setMedicoEliminar(medico)
        setDialogoEliminar(true)
    }

    const getBadgeVariant = (estado) => {
        return estado === "activo" ? "default" : "secondary"
    }

    const getTipoBadgeVariant = (tipo) => {
        return tipo === "medico" ? "default" : "outline"
    }

    const medicosFiltrados = medicos.filter(m => {
        const cumpleBusqueda = 
            m.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            m.dni.includes(busqueda) ||
            m.email.toLowerCase().includes(busqueda.toLowerCase()) ||
            m.matricula.toLowerCase().includes(busqueda.toLowerCase())
        
        const cumpleEstado = filtroEstado === "todos" || m.estado === filtroEstado

        const cumpleTipo = filtroTipo === "todos" || m.tipo === filtroTipo

        return cumpleBusqueda && cumpleEstado && cumpleTipo
    })

    return (
        <DashboardLayout role="director">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Gestión de Personal</h1>
                        <p className="text-muted-foreground">
                            Administración de médicos y operadores de laboratorio
                        </p>
                    </div>
                    <Button onClick={() => handleAbrirDialogo()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Profesional
                    </Button>
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
                                    placeholder="Buscar por nombre, DNI, email o matrícula..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tipo de profesional" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos los tipos</SelectItem>
                                    <SelectItem value="medico">Médicos</SelectItem>
                                    <SelectItem value="laboratorio">Operadores de Laboratorio</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos los estados</SelectItem>
                                    <SelectItem value="activo">Activo</SelectItem>
                                    <SelectItem value="inactivo">Inactivo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabla de médicos */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Profesionales</CardTitle>
                        <CardDescription>
                            Mostrando {medicosFiltrados.length} de {medicos.length} profesionales
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Profesional</TableHead>
                                    <TableHead>DNI</TableHead>
                                    <TableHead>Matrícula</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Pacientes</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {medicosFiltrados.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                                            No se encontraron profesionales con los filtros aplicados
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    medicosFiltrados.map((medico) => (
                                        <TableRow key={medico.id}>
                                            <TableCell className="font-medium">{medico.id}</TableCell>
                                            <TableCell>
                                                <div className="font-medium">{medico.nombre}</div>
                                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {medico.email}
                                                </div>
                                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <Phone className="h-3 w-3" />
                                                    {medico.telefono}
                                                </div>
                                            </TableCell>
                                            <TableCell>{medico.dni}</TableCell>
                                            <TableCell>{medico.matricula}</TableCell>
                                            <TableCell>
                                                <Badge variant={getTipoBadgeVariant(medico.tipo)}>
                                                    {medico.tipo === "medico" ? (
                                                        <><Stethoscope className="mr-1 h-3 w-3" /> Médico</>
                                                    ) : (
                                                        <><Microscope className="mr-1 h-3 w-3" /> Laboratorio</>
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{medico.pacientesAsignados}</TableCell>
                                            <TableCell>
                                                <Badge variant={getBadgeVariant(medico.estado)}>
                                                    {medico.estado === "activo" ? (
                                                        <><UserCheck className="mr-1 h-3 w-3" /> Activo</>
                                                    ) : (
                                                        <><UserX className="mr-1 h-3 w-3" /> Inactivo</>
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleAbrirDialogo(medico)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleAbrirDialogoEliminar(medico)}
                                                        disabled={medico.pacientesAsignados > 0}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
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

                {/* Diálogo de crear/editar médico */}
                <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                {medicoEditando ? "Editar Profesional" : "Nuevo Profesional"}
                            </DialogTitle>
                            <DialogDescription>
                                {medicoEditando 
                                    ? "Modifique la información del profesional"
                                    : "Complete los datos del nuevo profesional. Se generará una contraseña automática y se enviará por email."
                                }
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="tipo">Tipo de Profesional *</Label>
                                <Select value={formulario.tipo} onValueChange={(value) => setFormulario({...formulario, tipo: value})}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione el tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tiposProfesional.map(tipo => (
                                            <SelectItem key={tipo.value} value={tipo.value}>
                                                {tipo.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre">Nombre Completo *</Label>
                                    <Input
                                        id="nombre"
                                        value={formulario.nombre}
                                        onChange={(e) => setFormulario({...formulario, nombre: e.target.value})}
                                        placeholder="Dr. Juan Pérez"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dni">DNI *</Label>
                                    <Input
                                        id="dni"
                                        value={formulario.dni}
                                        onChange={(e) => setFormulario({...formulario, dni: e.target.value})}
                                        placeholder="12.345.678"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formulario.email}
                                        onChange={(e) => setFormulario({...formulario, email: e.target.value})}
                                        placeholder="profesional@fertilcare.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="telefono">Teléfono *</Label>
                                    <Input
                                        id="telefono"
                                        value={formulario.telefono}
                                        onChange={(e) => setFormulario({...formulario, telefono: e.target.value})}
                                        placeholder="+54 9 11 1234-5678"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="matricula">Matrícula *</Label>
                                    <Input
                                        id="matricula"
                                        value={formulario.matricula}
                                        onChange={(e) => setFormulario({...formulario, matricula: e.target.value})}
                                        placeholder="MN 12345"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="estado">Estado</Label>
                                    <Select value={formulario.estado} onValueChange={(value) => setFormulario({...formulario, estado: value})}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="activo">Activo</SelectItem>
                                            <SelectItem value="inactivo">Inactivo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDialogoAbierto(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleGuardar} disabled={cargandoEmail}>
                                {cargandoEmail ? "Enviando email..." : "Guardar"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Diálogo de confirmación de eliminación */}
                <AlertDialog open={dialogoEliminar} onOpenChange={setDialogoEliminar}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción eliminará permanentemente al profesional <strong>{medicoEliminar?.nombre}</strong>.
                                Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleEliminar}>
                                Eliminar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </DashboardLayout>
    )
}