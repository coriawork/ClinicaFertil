import { DashboardLayout } from "@/layouts/dashboard-layout";
import { useState, useRef, use } from "react"

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { DTE } from "./DTE";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select"
import {AccionesOvocitoMenu} from "@/pages/ovocitos/acciones"
import { useAuth } from "@/lib/AuthContext";

export function Ovocito(){
    
    const { user } = useAuth()
    const [openDescartar,setOpenDescartar] = useState(false)
    const [openCrio,setOpenCrio] = useState(false)
    const [openEstado,setOpenEstado] = useState(false)
    const [nuevoEstado,setNuevoEstado] = useState()
    const [transiciones,setTransiones] = useState([{ estado: "muy inmaduro", fecha: "2025/11/25" },])
    const [tubo,setTubo]=useState('')
    const [rack,setRack]=useState('')
    const [motivo,setMotivo] = useState('')
    console.log('OVOCITO',user)
    const [ovo,setOvo] = useState({
        estado_actual:'inmaduro',
        id: "Ovo_12/20/25_Gar_Ana_1"
    })
    
    function setCrioPreservado(ovocitoId, datos){
        confirmarCambioEstado('criopreservado', datos)
    }

    function setInvitro(ovocitoId){
        confirmarCambioEstado('in vitro')
    }
    
    function confirmarCambioEstado(estado, datosAdicionales = {}){
        setOvo({...ovo, estado_actual: estado, ...datosAdicionales})
        setTransiones([...transiciones, {estado: estado, fecha: "2025/12/2"}])
    }


   return(
    <DashboardLayout role={user.role}>
        <div className="flex flex-col items-center w-full px-2 sm:px-0">
            <div className="bg-card  rounded-xl shadow-sm p-5 mb-8">
                <div className="flex flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-8">
                   
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-20 w-full">
                        <div>
                            <h3 className="text-sm font-medium text-foreground/80">Identificador</h3>
                            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2 break-all">{ovo.id}</h2>
                            <Badge className={'bg-primary/50 text-foreground/50'}>{ovo.estado_actual}</Badge>
                        </div>                            
                        <AccionesOvocitoMenu
                            ovocito={ovo}
                            onCriopreservar={(ovocitoId, datos) => {
                                setOvo({...ovo, estado_actual: "criopreservado", tubo: datos.tubo, rack: datos.rack});
                                setTubo(datos.tubo);
                                setRack(datos.rack);
                                setTransiones([...transiciones, {estado: "criopreservado", fecha: "2025/12/2"}]);
                            }}
                            onFecundar={(ovocitoId, datos) => {
                                confirmarCambioEstado('fecundado');
                            }}
                            onMadurarInvitro={(ovocitoId) => setInvitro(ovocitoId)}
                            onMadurar={(ovocitoId) => confirmarCambioEstado('maduro')}
                            onCambiarEstado={(ovocitoId, nuevoEstado) => {
                                confirmarCambioEstado(nuevoEstado);
                            }}
                            onDescartar={(ovocitoId, causa) => {
                                setMotivo(causa);
                                confirmarCambioEstado('descartado');
                            }}
                            mostrarVerDetalle={false}
                        />
                    </div>  
                </div>
                {(tubo !== undefined && rack !== undefined && ovo.estado_actual == 'criopreservado' ) &&
                (
                    <div className="p-3 sm:p-5">
                        <Separator className={'my-5'}/>    
                        <div className="font-bold uppercase mb-2 ">
                            Ubicado en:
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                            <Badge>Tubo {ovo.tubo}</Badge>
                            <Badge>Rack {ovo.tubo}</Badge>
                        </div>
                    </div>
                )
                }
                {(motivo !== undefined && ovo.estado_actual =='descartado')&&(
                    <div className="">
                        <Separator className={'my-5'}/>    
                        <div className="font-bold uppercase mb-2 ">
                            motivo del descarte:
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                            <Badge variant={'destructive'}>{motivo}</Badge>
                        </div>
                    </div> 
                )}
            </div>
            <DTE transiciones={transiciones}></DTE>
        </div>            

        <Dialog open={openDescartar} onOpenChange={()=>setOpenDescartar(false)} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Descarte de ovocito</DialogTitle>
                </DialogHeader>
                <div>
                    <p>Por favor, indique la causa del descarte:</p>
                    <Input
                        placeholder="Causa del descarte"
                        className="mt-2"
                        value={motivo}
                        onChange={e => setMotivo(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button onClick={()=>{confirmarCambioEstado('descartado'); setOpenDescartar(false)}}>
                        Confirmar descarte
                    </Button>
                    <Button variant="outline" onClick={()=>setOpenDescartar(false)}>
                        Cancelar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
       
        <Dialog open={openEstado}onOpenChange={()=>setOpenEstado(false)} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cambiar estado_actual del ovocito</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    <Select
                        value={nuevoEstado}
                        onValueChange={setNuevoEstado}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar nuevo estado_actual" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="muy_inmaduro">Muy inmaduro</SelectItem>
                            <SelectItem value="inmaduro">Inmaduro</SelectItem>
                            <SelectItem value="maduro">Maduro</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button
                        onClick={()=>{confirmarCambioEstado(nuevoEstado);setOpenEstado(false)}}
                        disabled={!nuevoEstado}
                    >
                        Confirmar cambio
                    </Button>
                    <Button variant="outline" onClick={()=>setOpenEstado(false)}>
                        Cancelar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </DashboardLayout>
)
}


