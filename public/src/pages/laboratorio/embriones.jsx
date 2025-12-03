import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/AuthContext"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { MoreVertical } from "lucide-react"





function getBadgeColor(estado) {
    switch (estado) {
        case "transferido":
            return "bg-green-500 text-white";
        case "criopreservado":
            return "bg-cyan-600 text-white";
        case "descartado":
            return "bg-red-600 text-white";
        case "fecundado":
            return "bg-pink-500 text-white";
        default:
            return "bg-gray-400 text-white";
    }
}

function AccionesEmbrionMenu({ embrion, index, onTransferir, onCriopreservar, onDescartar, disabled }) {
    const [dialogTransferir, setDialogTransferir] = useState(false)
    const [dialogCrio, setDialogCrio] = useState(false)
    const [dialogDescartar, setDialogDescartar] = useState(false)
    const [causaDescarte, setCausaDescarte] = useState("")
    const [crioTubo, setCrioTubo] = useState("")
    const [crioRack, setCrioRack] = useState("")

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Acciones" disabled={disabled}>
                        <MoreVertical className="w-5 h-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <Separator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setDialogTransferir(true)}>
                            Transferencia
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDialogCrio(true)}>
                            Criopreservación
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDialogDescartar(true)}>
                            Descarte
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Transferencia */}
            <Dialog open={dialogTransferir} onOpenChange={setDialogTransferir}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Transferir embrión</DialogTitle>
                    </DialogHeader>
                    <div>¿Confirmar transferencia del embrión?</div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogTransferir(false)}>Cancelar</Button>
                        <Button onClick={() => { onTransferir(index); setDialogTransferir(false); }}>Confirmar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Criopreservación */}
            <Dialog open={dialogCrio} onOpenChange={setDialogCrio}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Criopreservar embrión</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                        <Input
                            placeholder="Tubo"
                            value={crioTubo}
                            onChange={e => setCrioTubo(e.target.value)}
                            className="rounded-[5px]"
                        />
                        <Input
                            placeholder="Rack"
                            value={crioRack}
                            onChange={e => setCrioRack(e.target.value)}
                            className="rounded-[5px]"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogCrio(false)}>Cancelar</Button>
                        <Button
                            onClick={() => {
                                onCriopreservar(index, { tubo: crioTubo, rack: crioRack });
                                setDialogCrio(false);
                                setCrioTubo("");
                                setCrioRack("");
                            }}
                            disabled={!crioTubo.trim() || !crioRack.trim()}
                        >
                            Confirmar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Descarte */}
            <Dialog open={dialogDescartar} onOpenChange={setDialogDescartar}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Descarte de embrión</DialogTitle>
                    </DialogHeader>
                    <div>
                        <p className="mb-2">Por favor, indique la causa del descarte:</p>
                        <Textarea
                            placeholder="Causa del descarte"
                            value={causaDescarte}
                            onChange={e => setCausaDescarte(e.target.value)}
                            className="rounded-[5px]"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogDescartar(false)}>Cancelar</Button>
                        <Button
                            onClick={() => {
                                onDescartar(index, causaDescarte);
                                setDialogDescartar(false);
                                setCausaDescarte("");
                            }}
                            disabled={!causaDescarte.trim()}
                        >
                            Confirmar descarte
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export function Embriones({role}) {
    const { user } = useAuth()
    const tecnicas = [
        { value: "FIV", label: "FIV" },
        { value: "ICSI", label: "ICSI" }
    ]
    const calidades = [1, 2, 3, 4, 5]
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]
    // Estado de embriones
    const [embriones, setEmbriones] = useState([
        {
            id: "Emb_25/11/25_Gar_Ana_1",
            fechaFertilizacion: "25/11/2025",
            ovocito: "Ovo_25/11/25_Gar_Ana_1",
            tecnica: "FIV",
            operador: "Juan Perez",
            calidad: 4,
            pgt: null,
            estado: "fecundado"
        },
        {
            id: "Emb_12/10/24_Gar_Ana_2",
            fechaFertilizacion: "12/10/2024",
            ovocito: "Ovo_12/10/24_Gar_Ana_2",
            tecnica: "ICSI",
            operador: "Rodrigo Paez",
            calidad: 5,
            pgt: "Ok",
            estado: "fecundado"
        },
        {
            id: "Emb_03/05/23_Gar_Ana_3",
            fechaFertilizacion: "03/05/2023",
            ovocito: "Ovo_03/05/23_Gar_Ana_3",
            tecnica: "FIV",
            operador: "Juan Perez",
            calidad: 3,
            pgt: "Not ok",
            estado: "fecundado"
        }
    ])

    // Filtros
    const [filtroOperador, setFiltroOperador] = useState("")
    const [filtroTecnica, setFiltroTecnica] = useState("")
    const [filtroCalidad, setFiltroCalidad] = useState("")
    const [filtroDia, setFiltroDia] = useState("")
    const [filtroMes, setFiltroMes] = useState("")
    const [filtroAnio, setFiltroAnio] = useState("")

    const limpiarFiltros = () => {
        setFiltroOperador("")
        setFiltroTecnica("")
        setFiltroCalidad("")
        setFiltroDia("")
        setFiltroMes("")
        setFiltroAnio("")
    }

    const embrionesFiltrados = embriones.filter(e => {
        if (filtroOperador && e.operador.toLowerCase() !== filtroOperador.toLowerCase()) return false
        if (filtroTecnica && e.tecnica !== filtroTecnica) return false
        if (filtroCalidad && String(e.calidad) !== filtroCalidad) return false
        if (filtroDia || filtroMes || filtroAnio) {
            const [dia, mes, anio] = e.fechaFertilizacion.split("/")
            if (filtroDia && dia !== filtroDia.padStart(2, "0")) return false
            if (filtroMes && mes !== (parseInt(filtroMes, 10) + 1).toString().padStart(2, "0")) return false
            if (filtroAnio && anio !== filtroAnio) return false
        }
        return true
    })

    // Acciones
    const handleTransferir = (idx) => {
        setEmbriones(prev =>
            prev.map((e, i) => i === idx ? { ...e, estado: "transferido" } : e)
        )
    }
    const handleCriopreservar = (idx, { tubo, rack }) => {
        setEmbriones(prev =>
            prev.map((e, i) => i === idx ? { ...e, estado: "criopreservado", tubo, rack } : e)
        )
    }
    const handleDescartar = (idx, causa) => {
        setEmbriones(prev =>
            prev.map((e, i) => i === idx ? { ...e, estado: "descartado", causaDescarte: causa } : e)
        )
    }

    return (
        <DashboardLayout role={role}>
            <Card className="rounded-[5px]">
                <CardHeader>
                    <CardTitle>
                        <h1 className="p-5">EMBRIONES</h1>
                        <Separator />
                    </CardTitle>
                    <CardDescription className="flex flex-col gap-5">
                        <div className="flex items-center justify-between">
                            <h2>FILTROS</h2>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={limpiarFiltros}
                                className="rounded-[5px]"
                            >
                                Limpiar filtros
                            </Button>
                        </div>
                        <div className="flex gap-20">
                            <Input
                                placeholder="Operador"
                                className="rounded-[5px]"
                                value={filtroOperador}
                                onChange={e => setFiltroOperador(e.target.value)}
                            />
                            <Select
                                value={filtroTecnica}
                                onValueChange={setFiltroTecnica}
                            >
                                <SelectTrigger className="rounded-[5px]">
                                    <SelectValue placeholder="Técnica" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Técnica</SelectLabel>
                                        {tecnicas.map(t => (
                                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Select
                                value={filtroCalidad}
                                onValueChange={setFiltroCalidad}
                            >
                                <SelectTrigger className="rounded-[5px]">
                                    <SelectValue placeholder="Calidad" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Calidad</SelectLabel>
                                        {calidades.map(c => (
                                            <SelectItem key={c} value={String(c)}>{c}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Fecha de fertilización</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    min="1"
                                    max="31"
                                    placeholder="Día"
                                    className="w-1/3 rounded-[5px]"
                                    value={filtroDia}
                                    onChange={e => setFiltroDia(e.target.value)}
                                />
                                <Select
                                    value={filtroMes}
                                    onValueChange={setFiltroMes}
                                >
                                    <SelectTrigger className="w-1/3 rounded-[5px]">
                                        <SelectValue placeholder="Mes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Mes</SelectLabel>
                                            {monthNames.map((m, idx) => (
                                                <SelectItem key={idx} value={String(idx)}>{m}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Input
                                    type="number"
                                    min="2000"
                                    max="2100"
                                    placeholder="Año"
                                    className="w-1/3 rounded-[5px]"
                                    value={filtroAnio}
                                    onChange={e => setFiltroAnio(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">
                            Mostrando {embrionesFiltrados.length} de {embriones.length} embriones
                        </div>
                    </CardDescription>
                </CardHeader>
                 <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Identificador</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Fecha Fertilización</TableHead>
                                <TableHead>Ovocito</TableHead>
                                <TableHead>Técnica</TableHead>
                                <TableHead>Operador</TableHead>
                                <TableHead>Calidad</TableHead>
                                <TableHead>PGT</TableHead>
                                {(user.role === "medico" || user.role === "laboratorio") && (
                                    <TableHead>Acciones</TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {embrionesFiltrados.length > 0 ? (
                                embrionesFiltrados.map((emb, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            <Badge className="font-bold rounded-[5px] bg-blue-500 text-white">
                                                {emb.id}
                                            </Badge>
                                        </TableCell>
                                         <TableCell>
                                            <Badge className={`rounded-[5px] ${getBadgeColor(emb.estado)}`}>
                                                {emb.estado.replace(/_/g, ' ')}
                                            </Badge>
                                            {emb.estado === "criopreservado" && emb.tubo && emb.rack && (
                                                <div className="text-xs mt-1">
                                                    Tubo: {emb.tubo} <br />
                                                    Rack: {emb.rack}
                                                </div>
                                            )}
                                            {emb.estado === "descartado" && emb.causaDescarte && (
                                                <div className="text-xs mt-1 text-muted-foreground">
                                                    Causa: {emb.causaDescarte}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>{emb.fechaFertilizacion}</TableCell>
                                        <TableCell>{emb.ovocito}</TableCell>
                                        <TableCell>{emb.tecnica}</TableCell>
                                        <TableCell>{emb.operador}</TableCell>
                                        <TableCell>
                                            <Badge className="rounded-[5px]">{emb.calidad}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {emb.pgt ? (
                                                <Badge className={`rounded-[5px] ${emb.pgt === "Ok" ? "bg-green-500" : "bg-red-500"} text-white`}>
                                                    {emb.pgt}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground">Sin estudio</span>
                                            )}
                                        </TableCell>
                                       
                                        {(user.role === "medico" || user.role === "laboratorio") && (
                                            <TableCell>
                                                <AccionesEmbrionMenu
                                                    embrion={emb}
                                                    index={idx}
                                                    onTransferir={handleTransferir}
                                                    onCriopreservar={handleCriopreservar}
                                                    onDescartar={handleDescartar}
                                                    disabled={emb.estado !== "fecundado"}
                                                />
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                                        No se encontraron embriones con los filtros aplicados
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </DashboardLayout>
    )
}