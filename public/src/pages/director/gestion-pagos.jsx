import { DashboardLayout } from "@/layouts/dashboard-layout"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Building2, User, DollarSign, Edit, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { pagosApi } from "@/utils/pagos"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Combobox } from "@/components/ui/combobox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

export function GestionPagos(){
    const [pagos, setPagos] = useState([])
    const [cargandoPagos, setCargandoPagos] = useState(true)
    const [pagoSeleccionado, setPagoSeleccionado] = useState(null)
    const [dialogoRegistrarPago, setDialogoRegistrarPago] = useState(false)
    const [dialogoNuevaOrden, setDialogoNuevaOrden] = useState(false)
    const [cargandoRegistro, setCargandoRegistro] = useState(false)
    const [cargandoOrden, setCargandoOrden] = useState(false)
    const [obrasSociales, setObrasSociales] = useState([])
    const [formularioPago, setFormularioPago] = useState({
        obraSocialPagada: false,
        pacientePagado: false
    })
    const [formularioOrden, setFormularioOrden] = useState({
        idPaciente: "",
        nombrePaciente: "",
        dniPaciente: "",
        idObra: "",
        monto: ""
    })

    const PACIENTES_MOCK = [
        { id: 1, nombre: "Juan Pérez", dni: "30.123.456"},
        { id: 8, nombre: "María Gómez", dni: "35.987.654" },
        { id: 3, nombre: "Carlos Rodríguez", dni: "28.456.789"},
    ];

    useEffect(()=>{
        if(pagos.length === 0){
            cargarPagos()
            cargarObrasSociales()
        }
    },[pagos])

    const cargarPagos = () => {
        setCargandoPagos(true)
        pagosApi.getTodosPagosGrupo().then((data)=>{
            setPagos(data.pagos)
        }).catch((error)=>{
            console.error('Error al obtener pagos del grupo',error)
            toast.error("Error al cargar los pagos")
        }).finally(()=>{
            setCargandoPagos(false)
        })
    }

    const cargarObrasSociales = async () => {
        try {
            const obras = await pagosApi.getObrasSociales()
            setObrasSociales(obras)
        } catch (error) {
            console.error('Error al cargar obras sociales:', error)
            toast.error("Error al cargar las obras sociales")
        }
    }

    const handleAbrirDialogoRegistrar = (pago) => {
        setPagoSeleccionado(pago)
        setFormularioPago({
            obraSocialPagada: pago.estado_obra_social === "pagado",
            pacientePagado: pago.estado_paciente === "pagado"
        })
        setDialogoRegistrarPago(true)
    }

    const handleAbrirDialogoNuevaOrden = () => {
        setFormularioOrden({
            idPaciente: "",
            nombrePaciente: "",
            dniPaciente: "",
            idObra: "",
            monto: ""
        })
        setDialogoNuevaOrden(true)
    }

    const handleCrearOrdenPago = async () => {
        // Validaciones
        if (!formularioOrden.idPaciente || !formularioOrden.monto || !formularioOrden.idObra) {
            toast.error("Por favor complete todos los campos obligatorios (ID Paciente, Monto y Obra Social)")
            return
        }

        if (parseFloat(formularioOrden.monto) <= 0) {
            toast.error("El monto debe ser mayor a 0")
            return
        }

        setCargandoOrden(true)
        try {
            const response = await pagosApi.registrarOrdenPago(
                parseInt(formularioOrden.idPaciente),
                parseFloat(formularioOrden.monto),
                parseInt(formularioOrden.idObra)
            )
            if (response.pago && response.pago.id) {
                // Obtener la información completa del pago recién creado
                const pagoCompleto = await pagosApi.getPagoGrupo(response.pago.id)
                
                setPagos([])
                toast.success("Orden de pago creada exitosamente")
                setDialogoNuevaOrden(false)
            }
        } catch (error) {
            console.error("Error al crear orden de pago:", error)
            toast.error("Error al crear la orden de pago")
        } finally {
            setCargandoOrden(false)
        }
    }

    const handleRegistrarPago = async () => {
        if (!pagoSeleccionado) return

        setCargandoRegistro(true)
        try {
            const response = await pagosApi.registrarPago(
                pagoSeleccionado.id,
                formularioPago.obraSocialPagada,
                formularioPago.pacientePagado
            )

            // Actualizar el pago en la lista local
            setPagos(pagos.map(p => 
                p.id === pagoSeleccionado.id 
                    ? {
                        ...p,
                        estado_obra_social: response.pago.estado_obra_social,
                        estado_paciente: response.pago.estado_paciente
                    }
                    : p
            ))

            toast.success("Estado de pago actualizado exitosamente")
            setDialogoRegistrarPago(false)
        } catch (error) {
            console.error("Error al registrar pago:", error)
            toast.error("Error al actualizar el estado del pago")
        } finally {
            setCargandoRegistro(false)
        }
    }

    const handleSeleccionarPaciente = (idPaciente) => {
        const paciente = PACIENTES_MOCK.find(p => p.id === parseInt(idPaciente))
        if (paciente) {
            setFormularioOrden({
                ...formularioOrden,
                idPaciente: idPaciente,
                nombrePaciente: paciente.nombre,
                dniPaciente: paciente.dni
            })
        }
    }

    const handleSeleccionarObraSocial = (idObra) => {
        setFormularioOrden({
            ...formularioOrden,
            idObra: idObra
        })
    }

    function deudaPac(deudaTotal, cobertura, pagado = "pendiente"){
        return pagado === 'pagado' ? 0 : deudaTotal - (deudaTotal * cobertura) 
    }

    function deudaObraSocial(deudaTotal, cobertura, pagado = "pendiente"){
        return pagado === 'pagado' ? 0 : deudaTotal * cobertura
    }

    // Calcular estadísticas
    const calcularEstadisticas = () => {
        const deudaObrasSociales = pagos
            .filter(p => p.estado_obra_social === "pendiente")
            .reduce((sum, p) => sum + (p.monto_total * p.obra_social.cobertura), 0)

        const deudaPacientes = pagos
            .filter(p => p.estado_paciente === "pendiente")
            .reduce((sum, p) => sum + deudaPac(p.monto_total, p.obra_social.cobertura, p.estado_paciente), 0)

        const totalCobrado = pagos
            .filter(p => p.estado_obra_social === "pagado" && p.estado_paciente === "pagado")
            .reduce((sum, p) => sum + p.monto_total, 0)

        return { deudaObrasSociales, deudaPacientes, totalCobrado }
    }

    const { deudaObrasSociales, deudaPacientes, totalCobrado } = calcularEstadisticas()

    // Preparar opciones para el Combobox de obras sociales
    const opcionesObrasSociales = obrasSociales.map(obra => ({
        value: obra.id.toString(),
        label: obra.sigla || obra.nombre
    }))

    return(
        <DashboardLayout>
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de Pagos</h1>
                    <p className="text-muted-foreground">
                        Administración de órdenes de pago y cobros
                    </p>
                </div>
                <Button variant={'action'} onClick={handleAbrirDialogoNuevaOrden}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Orden de Pago
                </Button>
            </div>

            {/* Estadísticas */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Deuda Obras Sociales</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl text-orange-300 font-bold">
                            ${deudaObrasSociales.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Pendiente de cobro
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Deuda Pacientes</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl text-orange-300 font-bold">
                            ${deudaPacientes.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Pendiente de cobro
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Cobrado</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl text-green-300 font-bold">
                            ${totalCobrado.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Pagos completados
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Pagos Realizados</CardTitle>
                    <CardDescription>
                        Listado de órdenes de pago 
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID_PAGO</TableHead>
                                <TableHead>PACIENTE</TableHead>
                                <TableHead>OBRA SOCIAL</TableHead>
                                <TableHead>DEUDA PACIENTE</TableHead>
                                <TableHead>ESTADO PACIENTE</TableHead>
                                <TableHead>DEUDA OBRA SOCIAL</TableHead>
                                <TableHead>ESTADO OBRA SOCIAL</TableHead>
                                <TableHead>DEUDA TOTAL</TableHead>
                                <TableHead>ACCION</TableHead>
                            </TableRow>
                        </TableHeader>
                        {cargandoPagos ? (
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-8">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Cargando pagos...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        ) : (
                            <TableBody>
                                {pagos.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center text-muted-foreground">
                                            No se encontraron pagos registrados
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pagos.map((pago) => (
                                        <TableRow key={pago.id}>
                                            <TableCell className="font-medium">
                                                <p>{pago.id}</p>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <p>{PACIENTES_MOCK.find(p => p.id === pago.id_paciente)?.nombre || 'Desconocido'}</p>
                                            </TableCell>
                                            <TableCell className="font-medium wrap ">
                                                <p>{pago.obra_social.sigla || (pago.obra_social.nombre.length > 15? pago.obra_social.nombre.slice(0, 15) + "..." : pago.obra_social.nombre)}</p>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <p>${deudaPac(pago.monto_total, pago.obra_social.cobertura, pago.estado_paciente).toFixed(2)}</p>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <Badge className={pago.estado_paciente === 'pendiente' ? 'bg-orange-500' : 'bg-green-500'}>
                                                    {pago.estado_paciente}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <p>${deudaObraSocial(pago.monto_total, pago.obra_social.cobertura, pago.estado_obra_social).toFixed(2)}</p>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <Badge className={pago.estado_obra_social === 'pendiente' ? 'bg-orange-500' : 'bg-green-500'}>
                                                    {pago.estado_obra_social}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <p>${pago.monto_total.toFixed(2)}</p>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleAbrirDialogoRegistrar(pago)}
                                                    disabled={pago.estado_obra_social === "pagado" && pago.estado_paciente === "pagado"}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        )}
                    </Table>
                </CardContent>
            </Card>

            {/* Dialog para nueva orden de pago */}
            <Dialog open={dialogoNuevaOrden} onOpenChange={setDialogoNuevaOrden}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Nueva Orden de Pago</DialogTitle>
                        <DialogDescription>
                            Complete los datos para generar una nueva orden de pago. Los campos marcados con * son obligatorios.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        {/* Selección de paciente */}
                        <div className="space-y-2">
                            <Label htmlFor="paciente">Paciente *</Label>
                            <Select 
                                value={formularioOrden.idPaciente} 
                                onValueChange={handleSeleccionarPaciente}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione un paciente" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PACIENTES_MOCK.map(paciente => (
                                        <SelectItem key={paciente.id} value={paciente.id.toString()}>
                                            {paciente.nombre} - DNI: {paciente.dni}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Información del paciente seleccionado */}
                        {formularioOrden.nombrePaciente && (
                            <div className="rounded-lg border p-3 bg-muted/50">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="font-medium">Nombre:</span> {formularioOrden.nombrePaciente}
                                    </div>
                                    <div>
                                        <span className="font-medium">DNI:</span> {formularioOrden.dniPaciente}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Obra Social con Combobox */}
                        <div className="space-y-2">
                            <Label htmlFor="obraSocial">Obra Social *</Label>
                            <Combobox
                                datas={opcionesObrasSociales}
                                title="Seleccione una obra social"
                                action={handleSeleccionarObraSocial}
                                className="w-full"
                            />
                            {formularioOrden.idObra && (
                                <p className="text-xs text-muted-foreground">
                                    {(() => {
                                        const obra = obrasSociales.find(o => o.id.toString() === formularioOrden.idObra)
                                        return obra ? `${obra.nombre}`:''
                                    })()}
                                </p>
                            )}
                        </div>

                        {/* Monto */}
                        <div className="space-y-2">
                            <Label htmlFor="monto">Monto Total *</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="monto"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formularioOrden.monto}
                                    onChange={(e) => setFormularioOrden({...formularioOrden, monto: e.target.value})}
                                    placeholder="12000.00"
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        {/* Preview de distribución si hay obra social y monto */}
                      {/*   {formularioOrden.idObra && formularioOrden.monto && parseFloat(formularioOrden.monto) > 0 && (
                            <div className="rounded-lg border p-4 bg-blue-50 dark:bg-blue-950/20">
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    Distribución del Pago
                                </h4>
                                {(() => {
                                    const obra = obrasSociales.find(o => o.id.toString() === formularioOrden.idObra)
                                    if (!obra) return null
                                    
                                    const montoTotal = parseFloat(formularioOrden.monto)
                                    const montoObra = montoTotal * obra.cobertura
                                    const montoPaciente = montoTotal - montoObra
                                    
                                    return (
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="flex items-center gap-2">
                                                    <Building2 className="h-3 w-3" />
                                                    Obra Social ({(obra.cobertura * 100).toFixed(0)}%):
                                                </span>
                                                <span className="font-bold text-orange-600 dark:text-orange-400">
                                                    ${montoObra.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="flex items-center gap-2">
                                                    <User className="h-3 w-3" />
                                                    Paciente ({((1 - obra.cobertura) * 100).toFixed(0)}%):
                                                </span>
                                                <span className="font-bold text-blue-600 dark:text-blue-400">
                                                    ${montoPaciente.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="border-t pt-2 flex justify-between font-bold">
                                                <span>Total:</span>
                                                <span>${montoTotal.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    )
                                })()}
                            </div>
                        )} */}
                    </div>
                    
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setDialogoNuevaOrden(false)}
                            disabled={cargandoOrden}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={handleCrearOrdenPago}
                            disabled={cargandoOrden}
                        >
                            {cargandoOrden ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creando...
                                </>
                            ) : (
                                "Crear Orden"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog para registrar pago */}
            <Dialog open={dialogoRegistrarPago} onOpenChange={setDialogoRegistrarPago}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Registrar Pago</DialogTitle>
                        <DialogDescription>
                            Actualice el estado de los pagos para la orden #{pagoSeleccionado?.id}
                        </DialogDescription>
                    </DialogHeader>
                    
                    {pagoSeleccionado && (
                        <div className="space-y-4 py-4">
                            {/* Información del pago */}
                            <div className="rounded-lg border p-4 space-y-3 bg-muted/50">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Paciente:</span>
                                    <span className="text-sm font-bold">
                                        {PACIENTES_MOCK.find(p => p.id === pagoSeleccionado.id_paciente)?.nombre || 'Desconocido'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Obra Social:</span>
                                    <span className="text-sm">
                                        {pagoSeleccionado.obra_social.sigla || pagoSeleccionado.obra_social.nombre}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Cobertura:</span>
                                    <span className="text-sm font-semibold">
                                        {(pagoSeleccionado.obra_social.cobertura * 100).toFixed(0)}%
                                    </span>
                                </div>
                                <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Monto Total:</span>
                                        <span className="text-lg font-bold">
                                            ${pagoSeleccionado.monto_total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Desglose de deudas */}
                            <div className="space-y-3">
                                <div className="rounded-lg border p-3 bg-orange-50 dark:bg-orange-950/20">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium flex items-center gap-2">
                                            <Building2 className="h-4 w-4" />
                                            Deuda Obra Social:
                                        </span>
                                        <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                                            ${deudaObraSocial(
                                                pagoSeleccionado.monto_total, 
                                                pagoSeleccionado.obra_social.cobertura, 
                                                pagoSeleccionado.estado_obra_social
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                    <Badge className={pagoSeleccionado.estado_obra_social === 'pendiente' ? 'bg-orange-500' : 'bg-green-500'}>
                                        {pagoSeleccionado.estado_obra_social}
                                    </Badge>
                                </div>

                                <div className="rounded-lg border p-3 bg-blue-50 dark:bg-blue-950/20">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Deuda Paciente:
                                        </span>
                                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                            ${deudaPac(
                                                pagoSeleccionado.monto_total, 
                                                pagoSeleccionado.obra_social.cobertura, 
                                                pagoSeleccionado.estado_paciente
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                    <Badge className={pagoSeleccionado.estado_paciente === 'pendiente' ? 'bg-orange-500' : 'bg-green-500'}>
                                        {pagoSeleccionado.estado_paciente}
                                    </Badge>
                                </div>
                            </div>

                            {/* Checkboxes para actualizar estado */}
                            <div className="space-y-4 pt-2">
                                <div className="flex items-start space-x-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        id="obraSocialPagada"
                                        checked={formularioPago.obraSocialPagada}
                                        onChange={(e) => setFormularioPago({
                                            ...formularioPago, 
                                            obraSocialPagada: e.target.checked
                                        })}
                                        className="mt-1 h-4 w-4 rounded border-gray-300"
                                        disabled={pagoSeleccionado.estado_obra_social === "pagado"}
                                    />
                                    <div className="flex-1">
                                        <Label 
                                            htmlFor="obraSocialPagada" 
                                            className="cursor-pointer font-medium"
                                        >
                                            Obra Social ha pagado
                                        </Label>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Marcar como pagado: ${(pagoSeleccionado.monto_total * pagoSeleccionado.obra_social.cobertura).toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        id="pacientePagado"
                                        checked={formularioPago.pacientePagado}
                                        onChange={(e) => setFormularioPago({
                                            ...formularioPago, 
                                            pacientePagado: e.target.checked
                                        })}
                                        className="mt-1 h-4 w-4 rounded border-gray-300"
                                        disabled={pagoSeleccionado.estado_paciente === "pagado"}
                                    />
                                    <div className="flex-1">
                                        <Label 
                                            htmlFor="pacientePagado" 
                                            className="cursor-pointer font-medium"
                                        >
                                            Paciente ha pagado
                                        </Label>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Marcar como pagado: ${deudaPac(
                                                pagoSeleccionado.monto_total, 
                                                pagoSeleccionado.obra_social.cobertura, 
                                                "pendiente"
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setDialogoRegistrarPago(false)}
                            disabled={cargandoRegistro}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={handleRegistrarPago}
                            disabled={cargandoRegistro}
                        >
                            {cargandoRegistro ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Actualizando...
                                </>
                            ) : (
                                "Actualizar Estado"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    )
}