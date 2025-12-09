import {useEffect, useState } from "react";
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
import { MoreVertical, Eye } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import axios from "axios";
import { toast } from "sonner";
import { OvoManage } from "@/utils/ovoCrio";

/**
 * Componente de menú de acciones para ovocitos
 * @param {Object} props
 * @param {Object} props.ovocito - Objeto del ovocito con su estado e id
 * @param {number} props.index - Índice del ovocito (opcional, para lista)
 * @param {Function} props.onCriopreservar - Callback para criopreservar (recibe ovocitoId, {tubo, rack})
 * @param {Function} props.onFecundar - Callback para fecundar (recibe ovocitoId, datos del formulario)
 * @param {Function} props.onMadurarInvitro - Callback para madurar in vitro (recibe ovocitoId)
 * @param {Function} props.onMadurar - Callback para madurar (recibe ovocitoId)
 * @param {Function} props.onCambiarEstado - Callback para cambiar estado (recibe ovocitoId, nuevoEstado)
 * @param {Function} props.onDescartar - Callback para descartar (recibe ovocitoId, causaDescarte)
 * @param {Function} props.onDonar - Callback para donar (recibe ovocitoId, motivoDonacion)
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
  onDonar,
  onVerDetalle,
  mostrarVerDetalle = false
}) {
    const estado = ovocito.estado || ovocito.estado_actual;
    const estaDescartado = estado === "descartado";
    const estaDonado = estado === "donado";
    const { user } = useAuth();
    
    
    // Determinar permisos segun rol
    const esPaciente = user?.role === "paciente";
    const puedeManejarOvocitos = user?.role === "medico" || user?.role === "laboratorio";

    // Estado para el dialogo de fecundacion
    const [dialogFecundar, setDialogFecundar] = useState(false);
    const [fechaFertilizacion, setFechaFertilizacion] = useState("");
    const [calidad, setCalidad] = useState(0);
    const [tecnica, setTecnica] = useState("");
    const [pgt, setPgt] = useState("");

    // Estado para el dialogo de criepreservacion
    const [dialogCrio, setDialogCrio] = useState(false);
    const [crioTubo, setCrioTubo] = useState("");
    const [crioRack, setCrioRack] = useState("");
    const [cargandoCrio, setCargandoCrio] = useState(false);

    // Estado para el dialogo de cambiar estado
    const [dialogCambiarEstado, setDialogCambiarEstado] = useState(false);
    const [nuevoEstado, setNuevoEstado] = useState("");

    // Estado para el diálogo de descartar
    const [dialogDescartar, setDialogDescartar] = useState(false);
    const [causaDescarte, setCausaDescarte] = useState("");
    const [estaCriopreservado, setEstaCriopreservado] = useState(false);
    const [verificandoCrio, setVerificandoCrio] = useState(false);

    // Estado para el diálogo de donar
    const [dialogDonar, setDialogDonar] = useState(false);
    const [motivoDonacion, setMotivoDonacion] = useState("");

    // Verificar al montar si el ovocito ya está criopreservado
    useEffect(() => {
        const verificarCriopreservacion = async () => {
            if (!ovocito.id) return;
            
            setVerificandoCrio(true);
            try {
                const resultado = await OvoManage.buscarOvocitoPorId(ovocito.id);
                
                if (resultado.encontrado) {
                    setEstaCriopreservado(true);
                    setCrioTubo(resultado.tubo);
                    setCrioRack(resultado.rack);
                    
                    // Notificar al componente padre que el ovocito está criopreservado
                    if (estado !== "criopreservado") {
                        onCambiarEstado?.(ovocito.id, "criopreservado");
                        onCriopreservar?.(ovocito.id, {
                            tubo: resultado.tubo,
                            rack: resultado.rack
                        });
                    }
                }
            } catch (error) {
                console.error('Error al verificar criopreservación:', error);
            } finally {
                setVerificandoCrio(false);
            }
        };

        verificarCriopreservacion();
    }, [ovocito.id])
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
            onFecundar?.(ovocito.id, {
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

    const confirmarCriopreservar = async () => {
        setCargandoCrio(true);
        
        try {
            const resultado = await OvoManage.criopreservar(ovocito.id);
            
            if (resultado.exito) {
                setEstaCriopreservado(true);
                setCrioTubo(resultado.tubo);
                setCrioRack(resultado.rack);
                
                onCriopreservar?.(ovocito.id, {
                    tubo: resultado.tubo,
                    rack: resultado.rack
                });
                
                cancelarCriopreservar();
            }
        } catch (error) {
            // El error ya se maneja en OvoManage.criopreservar
        } finally {
            setCargandoCrio(false);
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
            onCambiarEstado?.(ovocito.id, nuevoEstado);
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
            onDescartar?.(ovocito.id, causaDescarte);
            cancelarDescartar();
        }
    };

    const abrirDialogDonar = () => {
        setDialogDonar(true);
    };

    const cancelarDonar = () => {
        setDialogDonar(false);
        setMotivoDonacion("");
    };

    const confirmarDonar = () => {
        if (motivoDonacion.trim()) {
            onDonar?.(ovocito.id, motivoDonacion);
            cancelarDonar();
        }
    };

    // Si es paciente y solo hay opcion de ver detalle, mostrar boton simple
    if (esPaciente && mostrarVerDetalle && onVerDetalle) {
        return (
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onVerDetalle?.(ovocito.id)}
                aria-label="Ver detalle del ovocito"
            >
                <Eye className="w-5 h-5" />
            </Button>
        );
    }

    // Si es paciente y no hay ver detalle, no mostrar nada
    if (esPaciente) {
        return null;
    }

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
                        {/* Ver detalle (disponible para todos si esta habilitado) */}
                        {mostrarVerDetalle && onVerDetalle && (
                            <>
                                <DropdownMenuItem onClick={() => onVerDetalle?.(index)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver ovocito
                                </DropdownMenuItem>
                                {puedeManejarOvocitos && <DropdownMenuSeparator />}
                            </>
                        )}

                        {puedeManejarOvocitos && (
                            <>
                                {/* Acciones segun estado */}
                                {estado === "maduro" && !estaCriopreservado && (
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

                                {estado === "criopreservado" && (
                                    <>
                                        <DropdownMenuItem disabled>
                                            <span className="text-muted-foreground">
                                                Ya criopreservado (Tubo: {crioTubo}, Rack: {crioRack})
                                            </span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                    </>
                                )}

                                {estado === "inmaduro" && (
                                    <>
                                        <DropdownMenuItem onClick={() => onMadurarInvitro?.(ovocito.id)}>
                                            Madurar Invitro
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                    </>
                                )}

                                {estado === "in vitro" && (
                                    <>
                                        <DropdownMenuItem onClick={() => onMadurar?.(ovocito.id)}>
                                            Madurar
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                    </>
                                )}

                                {/* Acciones generales (no mostrar si esta descartado) */}
                                {!estaDescartado && !estaDonado && (
                                    <>
                                        <DropdownMenuItem onClick={abrirDialogCambiarEstado}>
                                            Cambiar estado
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            onClick={abrirDialogDonar}
                                        >
                                            Donar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            className="text-destructive focus:text-destructive"
                                            onClick={abrirDialogDescartar}
                                        >
                                            Descartar
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </>
                        )}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Diálogos (solo se renderizan si el usuario puede manejar ovocitos) */}
            {puedeManejarOvocitos && (
                <>
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
                            <div className="space-y-4">
                                {verificandoCrio ? (
                                    <p className="text-sm text-muted-foreground">
                                        Verificando estado del ovocito...
                                    </p>
                                ) : estaCriopreservado ? (
                                    <div className="space-y-2">
                                        <p className="text-sm text-yellow-600 font-medium">
                                            Este ovocito ya está criopreservado
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Tubo:</span> {crioTubo}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Rack:</span> {crioRack}
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm text-muted-foreground">
                                            Se asignará automáticamente un tubo y rack al ovocito.
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">ID del ovocito:</span> {ovocito.id}
                                        </p>
                                    </>
                                )}
                            </div>
                            <DialogFooter>
                                <Button 
                                    variant="outline" 
                                    onClick={cancelarCriopreservar}
                                    disabled={cargandoCrio}
                                >
                                    {estaCriopreservado ? 'Cerrar' : 'Cancelar'}
                                </Button>
                                {!estaCriopreservado && (
                                    <Button
                                        onClick={confirmarCriopreservar}
                                        disabled={cargandoCrio || verificandoCrio}
                                    >
                                        {cargandoCrio ? 'Procesando...' : 'Confirmar criopreservación'}
                                    </Button>
                                )}
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
                    <Dialog open={dialogDonar} onOpenChange={setDialogDonar}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Donación de ovocito</DialogTitle>
                            </DialogHeader>
                            <div>
                                <p className="mb-2">Por favor, indique el motivo de la donación:</p>
                                <Textarea
                                    placeholder="Motivo de la donación"
                                    value={motivoDonacion}
                                    onChange={(e) => setMotivoDonacion(e.target.value)}
                                    className="rounded-[5px]"
                                />
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={cancelarDonar}>
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={confirmarDonar}
                                    disabled={!motivoDonacion.trim()}
                                >
                                    Confirmar donación
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </>
    );
}