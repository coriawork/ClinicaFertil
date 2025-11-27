import { DashboardLayout } from "@/layouts/dashboard-layout";
import { useState, useRef, use } from "react"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { DTE } from "./DTE";
import { Input } from "@/components/ui/input";
import  {MoreVertical} from 'lucide-react' 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select"

export function Ovocito(){
    
    const [openDescartar,setOpenDescartar] = useState(false)
    const [openCrio,setOpenCrio] = useState(false)
    const [openEstado,setOpenEstado] = useState(false)
    const [nuevoEstado,setNuevoEstado] = useState()
    const [transiciones,setTransiones] = useState([{ estado: "muy inmaduro", fecha: "2025/11/25" },{ estado: "muy inmaduro", fecha: "2025/11/25" }])
    const [tubo,setTubo]=useState('')
    const [rack,setRack]=useState('')
    const [motivo,setMotivo] = useState('')

    const [ovo,setOvo] = useState({
        estado_actual:'inmaduro',
        id: "Ovo_25/11/25_Gar_Ana_1"
    })
    
    function setCrioPreservado(){
        confirmarCambioEstado('criopreservado')

    }

    function setInvitro(){
        confirmarCambioEstado('in vitro')
    }
    
    function confirmarCambioEstado(estado){
        setOvo({id:"Ovo_25/11/25_Gar_Ana_1",estado_actual:estado})
        setTransiones([...transiciones,{estado:estado,fecha:"2025/12/2" }])
    }

   return(
    <DashboardLayout role={'operador_laboratorio'}>
        <div className="flex flex-col items-center w-full px-2 sm:px-0">
            <div className="bg-card  rounded-xl shadow-sm p-5 mb-8">
                <div className="flex flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-8">
                   
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-20 w-full">
                        <div>
                            <h3 className="text-sm font-medium text-foreground/80">Identificador</h3>
                            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2 break-all">{ovo.id}</h2>
                            <Badge className={'bg-primary/50 text-foreground/50'}>{ovo.estado_actual}</Badge>
                        </div>                            
                        <DropdownMenu className='w-full'>
                            <DropdownMenuTrigger asChild disabled={(ovo.estado_actual == 'descartado')}>
                                <Button variant="" size="icon" >
                                    <MoreVertical className="w-5 h-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="start">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <Separator/>
                                <DropdownMenuGroup >
                                    {
                                    (ovo.estado_actual === 'maduro')&&(
                                        <>
                                        <DropdownMenuItem variant="" onClick={()=>setOpenCrio(true)}>
                                            Criopreservar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem variant="" onClick={()=>confirmarCambioEstado('fecundado')}>
                                            Fecundar
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        </>
                                    ) ||
                                    (ovo.estado_actual === 'in vitro')&&(
                                        <>
                                        <DropdownMenuItem variant="" onClick={()=>confirmarCambioEstado('maduro')}>
                                            madurar
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        </>
                                    ) ||
                                    (ovo.estado_actual === 'inmaduro')&&(
                                        <>
                                            <DropdownMenuItem onClick={()=>setInvitro()} variant="">
                                                Madurar Invitro
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                        </>)
                                    }
                                    {(ovo.estado_actual !='descartado') &&(<>
                                        <DropdownMenuItem variant="destructive" onClick={()=>setOpenEstado(true)}>    
                                            Cambiar estado_actual
                                        </DropdownMenuItem>
                                        <DropdownMenuItem variant="destructive" onClick={()=>setOpenDescartar(true)} >    
                                            Descartar
                                        </DropdownMenuItem>
                                    </>)                                             
                                    }
                                    
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
            <div className="w-ful max-w-screen">
                <DTE transiciones={transiciones}></DTE>
            </div>
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
        <Dialog open={openCrio } onOpenChange={()=>setOpenCrio(false)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Criopreservar ovocito</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    <Input
                        placeholder="Tubo"
                        value={tubo}
                        onChange={e => setTubo(e.target.value)}
                    />
                    <Input
                        placeholder="Rack"
                        value={rack}
                        onChange={e => setRack(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button
                        onClick={()=>{setCrioPreservado();setOpenCrio(false)}}
                    >
                        Confirmar criopreservación
                    </Button>
                    <Button variant="outline" onClick={()=>setOpenCrio(false)}>
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


