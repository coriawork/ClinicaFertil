import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { MoreVertical } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
/**
 * Componente de menú de acciones para ovocitos
 * @param {Object} props
 * @param {Object} props.ovocito - Objeto del ovocito con su estado
 * @param {number} props.index - Índice del ovocito (opcional, para lista)
 * @param {Function} props.onCriopreservar - Callback para criopreservar (recibe index, {tubo, rack})
 * @param {Function} props.onFecundar - Callback para fecundar (recibe index, datos del formulario)
 * @param {Function} props.onMadurarInvitro - Callback para madurar in vitro
 * @param {Function} props.onMadurar - Callback para madurar
 * @param {Function} props.onCambiarEstado - Callback para cambiar estado (recibe index, nuevoEstado)
 * @param {Function} props.onDescartar - Callback para descartar (recibe index, causaDescarte)
 * @param {Function} props.onVerDetalle - Callback para ver detalle (opcional)
 * @param {boolean} props.mostrarVerDetalle - Mostrar opción de ver detalle
 */
export function AccionesOvocitoMenu({
  ovocito,
  index,
  onCriopreservar,
  onFecundar,
  onMadurarInvitro,
  onMadurar,
  onCambiarEstado,
  onDescartar,
  onVerDetalle,
  mostrarVerDetalle = false
}) {
    const estado = ovocito.estado || ovocito.estado_actual;
    const estaDescartado = estado === "descartado";
    const {user} = useAuth()
    // Estado para el diálogo de fecundación
    const [dialogFecundar, setDialogFecundar] = useState(false);
    const [fechaFertilizacion, setFechaFertilizacion] = useState("");
    const [calidad, setCalidad] = useState(0);
    const [tecnica, setTecnica] = useState("");
    const [pgt, setPgt] = useState("");

    // Estado para el diálogo de criopreservación
    const [dialogCrio, setDialogCrio] = useState(false);
    const [crioTubo, setCrioTubo] = useState("");
    const [crioRack, setCrioRack] = useState("");

    // Estado para el diálogo de cambiar estado
    const [dialogCambiarEstado, setDialogCambiarEstado] = useState(false);
    const [nuevoEstado, setNuevoEstado] = useState("");

    // Estado para el diálogo de descartar
    const [dialogDescartar, setDialogDescartar] = useState(false);
    const [causaDescarte, setCausaDescarte] = useState("");

    const abrirDialogFecundar = () => {
        setDialogFecundar(true);
    };

    const cancelarFecundacion = () => {
        setDialogFecundar(false);
        setFechaFertilizacion("");
        setCalidad(0);
        setTecnica("");
        setPgt("");
    };

    const confirmarFecundacion = () => {
        if (tecnica && pgt && fechaFertilizacion) {
        onFecundar?.(index, {
            fechaFertilizacion,
            calidad,
            tecnica,
            pgt
        });
        cancelarFecundacion();
        }
    };

    const abrirDialogCrio = () => {
        setDialogCrio(true);
    };

    const cancelarCriopreservar = () => {
        setDialogCrio(false);
        setCrioTubo("");
        setCrioRack("");
    };

    const confirmarCriopreservar = () => {
        if (crioTubo.trim() && crioRack.trim()) {
        onCriopreservar?.(index, {
            tubo: crioTubo,
            rack: crioRack
        });
        cancelarCriopreservar();
        }
    };

    const abrirDialogCambiarEstado = () => {
        setDialogCambiarEstado(true);
    };

    const cancelarCambioEstado = () => {
        setDialogCambiarEstado(false);
        setNuevoEstado("");
    };

    const confirmarCambioEstado = () => {
        if (nuevoEstado) {
        onCambiarEstado?.(index, nuevoEstado);
        cancelarCambioEstado();
        }
    };

    const abrirDialogDescartar = () => {
        setDialogDescartar(true);
    };

    const cancelarDescartar = () => {
        setDialogDescartar(false);
        setCausaDescarte("");
    };

    const confirmarDescartar = () => {
        if (causaDescarte.trim()) {
        onDescartar?.(index, causaDescarte);
        cancelarDescartar();
        }
    };
    console.log(user)
    return (
        <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button 
                variant="ghost" 
                size="icon" 
                aria-label="Acciones"
                disabled={estaDescartado}
            >
                <MoreVertical className="w-5 h-5" />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <Separator />
            <DropdownMenuGroup>
                {/* Acciones específicas según estado */}
                {estado === "maduro" && (
                <>
                    <DropdownMenuItem onClick={abrirDialogCrio}>
                        Criopreservar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={abrirDialogFecundar}>
                        Fecundar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                </>
                )}

                {estado === "inmaduro" && (
                <>
                    <DropdownMenuItem onClick={() => onMadurarInvitro?.(index)}>
                    Madurar Invitro
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                </>
                )}

                {estado === "in vitro" && (
                <>
                    <DropdownMenuItem onClick={() => onMadurar?.(index)}>
                    Madurar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                </>
                )}

                {/* Ver detalle (solo en listas) */}
                {mostrarVerDetalle && onVerDetalle && (
                <DropdownMenuItem onClick={() => onVerDetalle?.(index)}>
                    Ver ovocito
                </DropdownMenuItem>
                )}  

                {/* Acciones generales (no mostrar si está descartado) */}
                {!estaDescartado && (
                <>
                    <DropdownMenuItem 
                    variant="destructive" 
                    onClick={abrirDialogCambiarEstado}
                    >
                        Cambiar estado
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                    variant="destructive" 
                    onClick={abrirDialogDescartar}
                    >
                        Descartar
                    </DropdownMenuItem>
                </>
                )}
            </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>

        {/* Dialog de Fecundación */}
        <Dialog open={dialogFecundar} onOpenChange={setDialogFecundar}>
            <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
                <DialogTitle>Pasar de ovocito a embrión</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-5">
                <div className="flex gap-2 flex-col">
                <Label>Fecha de la fertilización</Label>
                <Input
                    className="rounded-[5px]"
                    placeholder="Fecha"
                    type="date"
                    value={fechaFertilizacion}
                    onChange={(e) => setFechaFertilizacion(e.target.value)}
                />
                </div>
                
                <Separator />
                
                <div className="flex border rounded-[5px] p-5 flex-col gap-3">
                <Label>Calidad</Label>
                <div className="flex gap-5 items-center">
                    <Slider
                    className="w-1/2"
                    value={[calidad]}
                    onValueChange={(values) => setCalidad(values[0])}
                    max={5}
                    step={1}
                    />
                    <p className="font-bold">{calidad}</p>
                </div>
                </div>
                
                <Select value={tecnica} onValueChange={setTecnica}>
                <SelectTrigger className="rounded-[5px] w-full">
                    <SelectValue placeholder="Seleccionar la técnica" />
                </SelectTrigger>
                <SelectContent className="rounded-[5px]">
                    <SelectItem value="FIP">FIP</SelectItem>
                    <SelectItem value="ICSI">ICSI</SelectItem>
                </SelectContent>
                </Select>
                
                <Select value={pgt} onValueChange={setPgt}>
                <SelectTrigger className="rounded-[5px] w-full">
                    <SelectValue placeholder="PGT" />
                </SelectTrigger>
                <SelectContent className="rounded-[5px]">
                    <SelectItem value="PGT_OK">PGT OK</SelectItem>
                    <SelectItem value="PGT_NOT_OK">PGT NOT OK</SelectItem>
                    <SelectItem value="NOT_PGT">SIN PGT</SelectItem>
                </SelectContent>
                </Select>
            </div>
            
            <DialogFooter>
                <Button variant="outline" onClick={cancelarFecundacion}>
                Cancelar
                </Button>
                <Button
                onClick={confirmarFecundacion}
                disabled={!tecnica || !pgt || !fechaFertilizacion}
                >
                Confirmar Fecundación
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Dialog de Criopreservación */}
        <Dialog open={dialogCrio} onOpenChange={setDialogCrio}>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>Criopreservar ovocito</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2">
                <Input
                placeholder="Tubo"
                value={crioTubo}
                onChange={(e) => setCrioTubo(e.target.value)}
                className="rounded-[5px]"
                />
                <Input
                placeholder="Rack"
                value={crioRack}
                onChange={(e) => setCrioRack(e.target.value)}
                className="rounded-[5px]"
                />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={cancelarCriopreservar}>
                Cancelar
                </Button>
                <Button
                onClick={confirmarCriopreservar}
                disabled={!crioTubo.trim() || !crioRack.trim()}
                >
                Confirmar criopreservación
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Dialog de Cambiar Estado */}
        <Dialog open={dialogCambiarEstado} onOpenChange={setDialogCambiarEstado}>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>Cambiar estado del ovocito</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2">
                <Select value={nuevoEstado} onValueChange={setNuevoEstado}>
                <SelectTrigger className="rounded-[5px]">
                    <SelectValue placeholder="Seleccionar nuevo estado" />
                </SelectTrigger>
                <SelectContent className="rounded-[5px]">
                    <SelectItem value="muy_inmaduro">Muy inmaduro</SelectItem>
                    <SelectItem value="inmaduro">Inmaduro</SelectItem>
                    <SelectItem value="maduro">Maduro</SelectItem>
                </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={cancelarCambioEstado}>
                Cancelar
                </Button>
                <Button
                onClick={confirmarCambioEstado}
                disabled={!nuevoEstado}
                >
                Confirmar cambio
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Dialog de Descartar */}
        <Dialog open={dialogDescartar} onOpenChange={setDialogDescartar}>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>Descarte de ovocito</DialogTitle>
            </DialogHeader>
            <div>
                <p className="mb-2">Por favor, indique la causa del descarte:</p>
                <Textarea
                placeholder="Causa del descarte"
                value={causaDescarte}
                onChange={(e) => setCausaDescarte(e.target.value)}
                className="rounded-[5px]"
                />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={cancelarDescartar}>
                Cancelar
                </Button>
                <Button
                onClick={confirmarDescartar}
                disabled={!causaDescarte.trim()}
                >
                Confirmar descarte
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    );
}