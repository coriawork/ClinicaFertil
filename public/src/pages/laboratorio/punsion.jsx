import { use, useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator";
import { MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";


const nombrePaciente = "Ana";
const apellidoPaciente = "García";

export function Punsion() {
    const [quirofano, setQuirofano] = useState("");
    const [problemas, setProblemas] = useState("");
    const [ovocitos, setOvocitos] = useState([]);
    const [nuevoOvocito, setNuevoOvocito] = useState({
        estado: ""
    });


    // Para descartar ovocito
    const [descartarIdx, setDescartarIdx] = useState(null);
    const [causaDescarte, setCausaDescarte] = useState("");

    const [crioDialogIdx, setCrioDialogIdx] = useState(null);
    const [crioTubo, setCrioTubo] = useState("");
    const [crioRack, setCrioRack] = useState("");

    // Modifica la función criopreservarOvocito para usar los datos del diálogo
    const confirmarCriopreservar = () => {
        setOvocitos(ovocitos.map((ovo, i) =>
            i === crioDialogIdx
                ? { 
                    ...ovo, 
                    criopreservado: true, 
                    estado: "criopreservado", // Cambia el estado aquí
                    criodata: { tubo: crioTubo, rack: crioRack } 
                }
                : ovo
        ));
        setCrioDialogIdx(null);
        setCrioTubo("");
        setCrioRack("");
    };

    const cancelarCriopreservar = () => {
        setCrioDialogIdx(null);
        setCrioTubo("");
        setCrioRack("");
    };

    const getBadgeColor = (estado) => {
       switch (estado) {
            case "maduro":
                return "bg-green-500 text-white";
            case "inmaduro":
                return "bg-yellow-500 text-black";
            case "muy_inmaduro":
                return "bg-blue-500 text-white";
            case "in vitro":
                return "bg-purple-500 text-white";
            case "criopreservado":
                return "bg-cyan-600 text-white";
            case "descartado":
                return "bg-red-600 text-white";
            case "fecundado":
                return "bg-pink-500 text-white";
            default:
                return "bg-gray-400 text-white";
        }
    };
    const fecundarOvocito = (idx) => {
        setOvocitos(ovocitos.map((ovo, i) =>
            i === idx ? { ...ovo, estado: "fecundado" } : ovo
        ));
    };
    
    const [cambiarEstadoIdx, setCambiarEstadoIdx] = useState(null);
    const [nuevoEstado, setNuevoEstado] = useState("");

    const confirmarCambioEstado = () => {
        setOvocitos(ovocitos.map((ovo, idx) =>
            idx === cambiarEstadoIdx
                ? { ...ovo, estado: nuevoEstado }
                : ovo
        ));
        setCambiarEstadoIdx(null);
        setNuevoEstado("");
    };

    const cancelarCambioEstado = () => {
        setCambiarEstadoIdx(null);
        setNuevoEstado("");
    };
    const generarCodigoOvocito = (index) => {
        const hoy = new Date();
        const yy = hoy.getFullYear().toString().slice(-2);
        const mm = String(hoy.getMonth() + 1).padStart(2, "0");
        const dd = String(hoy.getDate()).padStart(2, "0");
        return `Ovo_${yy}/${mm}/${dd}_${apellidoPaciente.slice(0, 3)}_${nombrePaciente.slice(0, 3)}_${index + 1}`;
    };

    const handleAgregarOvocito = () => {
        setOvocitos([
            ...ovocitos,
            {
                estado: nuevoOvocito.estado,
                codigo: generarCodigoOvocito(ovocitos.length),
                decision: "",
                descartado: false,
                causaDescarte: "",
                criopreservado: false,
                criodata:{tubo:'',rack:''}
            }
        ]);
        setNuevoOvocito({ estado: "" });
    };



    const confirmarDescartar = () => {
        setOvocitos(ovocitos.map((ovo, idx) =>
            idx === descartarIdx
                ? { ...ovo, descartado: true, causaDescarte: causaDescarte, estado: "descartado" }
                : ovo
        ));
        setDescartarIdx(null);
        setCausaDescarte("");
    };

    const madurarInVitro = (idx) => {
        setOvocitos(ovocitos.map((ovo, i) =>
            i === idx ? { ...ovo, estado: "in vitro" } : ovo
        ));
    };

    const cancelarDescartar = () => {
        setDescartarIdx(null);
        setCausaDescarte("");
    };


    return (
        <DashboardLayout role="operador_laboratorio">
            <Card className="rounded-[5px]">
                <CardHeader>
                    <h2 className="text-lg font-bold">Registrar Punción</h2>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <Input
                            placeholder="Número de quirófano"
                            value={quirofano}
                            onChange={e => setQuirofano(e.target.value)}
                            className={'rounded-[5px]'}
                        />
                        <Input
                            placeholder="Problemas (opcional)"
                            value={problemas}
                            onChange={e => setProblemas(e.target.value)}
                            className={'rounded-[5px]'}
                        />
                    </div>
                    <Button className={'font-bold'}>REGISTRAR</Button>
                    <div className="border-t pt-4 mt-4">
                        <h3 className="font-semibold mb-2">Agregar Ovocito</h3>
                        <div className="flex gap-2 mb-2">
                            <Select
                                value={nuevoOvocito.estado}
                                onValueChange={estado => setNuevoOvocito({ estado })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Estado inicial" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="muy_inmaduro">Muy inmaduro</SelectItem>
                                    <SelectItem value="inmaduro">Inmaduro</SelectItem>
                                    <SelectItem value="maduro">Maduro</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleAgregarOvocito} disabled={!nuevoOvocito.estado}>
                                Agregar
                            </Button>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Ovocitos registrados:</h4>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Código</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>ACCIONES</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ovocitos.map((ovo, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            <Badge className={`font-bold rounded-[5px] ${getBadgeColor(ovo.estado)}`}>{ovo.codigo}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`font-bold rounded-[5px] ${getBadgeColor(ovo.estado)}`}>{ovo.estado}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                   <Button variant="ghost" size="icon" aria-label="Acciones">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-56" align="start">
                                                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                    <Separator/>
                                                    <DropdownMenuGroup >
                                                        {
                                                        (ovo.estado === 'maduro')&&(
                                                            <>
                                                            <DropdownMenuItem variant="" onClick={() => setCrioDialogIdx(idx)}>
                                                                Criopreservar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem variant="" onClick={() => fecundarOvocito(idx)}>
                                                                Fecundar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            </>
                                                        ) ||
                                                        (ovo.estado === 'inmaduro')&&(
                                                            <>
                                                            <DropdownMenuItem variant="" onClick={() => madurarInVitro(idx)}>
                                                                Madurar Invitro
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            </>
                                                        )
                                                        }
                                                        <Link to="/laboratorio/ovocito/1">
                                                            <DropdownMenuItem variant="">
                                                                    ver ovocito
                                                            </DropdownMenuItem>
                                                        </Link>    
                                                        <DropdownMenuItem variant="destructive" onClick={() => setCambiarEstadoIdx(idx)}>    
                                                            Cambiar estado
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem variant="destructive" onClick={() => setDescartarIdx(idx)}>    
                                                            Descartar
                                                        </DropdownMenuItem>
                                                        
                                                    </DropdownMenuGroup>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                   
                </CardFooter>
            </Card>
            <Dialog open={descartarIdx !== null} onOpenChange={cancelarDescartar}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Descarte de ovocito</DialogTitle>
                    </DialogHeader>
                    <div>
                        <p>Por favor, indique la causa del descarte:</p>
                        <Textarea
                            placeholder="Causa del descarte"
                            value={causaDescarte}
                            onChange={e => setCausaDescarte(e.target.value)}
                            className="mt-2"
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={confirmarDescartar}
                            disabled={!causaDescarte.trim()}
                        >
                            Confirmar descarte
                        </Button>
                        <Button variant="outline" onClick={cancelarDescartar}>
                            Cancelar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={crioDialogIdx !== null} onOpenChange={cancelarCriopreservar}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Criopreservar ovocito</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                        <Input
                            placeholder="Tubo"
                            value={crioTubo}
                            onChange={e => setCrioTubo(e.target.value)}
                        />
                        <Input
                            placeholder="Rack"
                            value={crioRack}
                            onChange={e => setCrioRack(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={confirmarCriopreservar}
                            disabled={!crioTubo.trim() || !crioRack.trim()}
                        >
                            Confirmar criopreservación
                        </Button>
                        <Button variant="outline" onClick={cancelarCriopreservar}>
                            Cancelar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={cambiarEstadoIdx !== null} onOpenChange={cancelarCambioEstado}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cambiar estado del ovocito</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                        <Select
                            value={nuevoEstado}
                            onValueChange={setNuevoEstado}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar nuevo estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="muy_inmaduro">Muy inmaduro</SelectItem>
                                <SelectItem value="inmaduro">Inmaduro</SelectItem>
                                <SelectItem value="maduro">Maduro</SelectItem>
                                <SelectItem value="in vitro">In vitro</SelectItem>
                                <SelectItem value="criopreservado">Criopreservado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={confirmarCambioEstado}
                            disabled={!nuevoEstado}
                        >
                            Confirmar cambio
                        </Button>
                        <Button variant="outline" onClick={cancelarCambioEstado}>
                            Cancelar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          
        </DashboardLayout>
    );
}