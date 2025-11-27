import { DashboardLayout } from "@/layouts/dashboard-layout"

import { Card,CardHeader,CardContent } from "@/components/ui/card"
import { Combobox } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Select,SelectTrigger,SelectContent,SelectValue,SelectGroup,SelectLabel,SelectItem} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import { Link } from "react-router-dom"
export function GestionPunsion(){
    const punsiones = [
        {
            medico:"Juan Perez",
            paciente:"Maria Gomez",
            estado:"pendiente",
            fecha:"02/12/2025"
        },
        {
            medico:"Juan Perez",
            paciente:"Maria Gomez",
            estado:"pendiente",
            fecha:"02/12/2025"
        },
        {
            medico:"Juan Perez",
            paciente:"Maria Gomez",
            estado:"pendiente",
            fecha:"02/12/2025"
        },
        {
            medico:"Juan Perez",
            paciente:"Maria Gomez",
            estado:"pendiente",
            fecha:"02/12/2025"
        },
        {
            medico:"Juan Perez",
            paciente:"Maria Gomez",
            estado:"pendiente",
            fecha:"02/12/2025"
        },
        {
            medico:"Juan Perez",
            paciente:"Maria Gomez",
            estado:"pendiente",
            fecha:"02/12/2025"
        },
        {
            medico:"Juan Perez",
            paciente:"Maria Gomez",
            estado:"pendiente",
            fecha:"02/12/2025"
        },
        {
            medico:"Juan Perez",
            paciente:"Maria Gomez",
            estado:"pendiente",
            fecha:"02/12/2025"
        },
    ]
    const medicos = [{value:'juan perez',label:'Juan Perez'},{value:'rodrigo paez',label:'Rodrigo Paez'}]
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return(
         <DashboardLayout role="operador_laboratorio">
            <Card className="rounded-[5px]">
                <CardHeader>
                    <h2>FILTROS</h2>
                    <Combobox datas={medicos} title="Busca por medico" className={"rounded-[5px]"}/>
                    <div className="flex gap-2 ">
                        <Input
                            type="number"
                            min="1"
                            max="31"
                            placeholder="Día"
                            className="w-1/3 rounded-[5px]"
                        />
                        <Select
                            
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
                            min="2020"
                            max="2100"
                            placeholder="Año"
                            className="w-1/3 rounded-[5px]"
                        />
                    </div>
                    <Separator className={'mt-5'}/>
                </CardHeader>
                <CardContent className={'h-100 flex  flex-col gap-4 overflow-y-scroll'}>
                    {punsiones.map((p,key)=>(<>
                        <Card className={'bg-chart-4/10 '} key={key}>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p><span className="font-bold text-primary">Medico:</span> {p.medico}</p>
                                        <p><span className="font-bold text-primary">Paciente:</span> {p.paciente}</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <p>{p.fecha}</p>
                                        <Badge className={'uppercase'}>{p.estado}</Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className={'w-full'}>
                                <Link to={'/laboratorio/punsion/'+key}>
                                    <Button className={'w-full rounded-[5px]'} variant={''}>Gestionar</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </>))}
                   
                </CardContent>
            </Card>
         </DashboardLayout>
    )
}