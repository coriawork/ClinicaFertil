import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Combobox } from "@/components/ui/combobox"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function Ovocitos(){
    const medicos = [{value:'juan perez',label:'Juan Perez'},{value:'rodrigo paez',label:'Rodrigo Paez'}]
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const pacientes = [
        ...Array.from(new Set([
            "Garcia Ana","Paez Luis","Rodriguez Maria","Fernandez Julia",
            "Gonzalez Pedro","Martinez Laura","Sanchez Carla",
            "Lopez Josefina","Ramirez Mateo","Barrios Florencia"
        ])).map(p => ({ value: p.toLowerCase(), label: p }))
    ];
    
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
    
    const [filtroMedico, setFiltroMedico] = useState("");
    const [filtroPaciente, setFiltroPaciente] = useState("");
    const [filtroDia, setFiltroDia] = useState("");
    const [filtroMes, setFiltroMes] = useState("");
    const [filtroAnio, setFiltroAnio] = useState("");

    const [ovocitos] = useState([
        {
            codigo: 'Ovo_25/11/25_Gar_Ana_1',
            estado: 'maduro',
            punsion: '25/11/2025',
            paciente: 'Garcia Ana',
            medico: 'Juan Perez',
            idx: 1
        },
        {
            codigo: 'Ovo_12/10/24_Pae_Luis_2',
            estado: 'inmaduro',
            punsion: '12/10/2024',
            paciente: 'Paez Luis',
            medico: 'Rodrigo Paez',
            idx: 2
        },
        {
            codigo: 'Ovo_03/05/23_Rod_Mar_3',
            estado: 'muy_inmaduro',
            punsion: '03/05/2023',
            paciente: 'Rodriguez Maria',
            medico: 'Juan Perez',
            idx: 3
        },
        {
            codigo: 'Ovo_18/07/22_Fer_Jul_4',
            estado: 'in vitro',
            punsion: '18/07/2022',
            paciente: 'Fernandez Julia',
            medico: 'Rodrigo Paez',
            idx: 4
        },
        {
            codigo: 'Ovo_09/09/21_Gon_Ped_5',
            estado: 'criopreservado',
            punsion: '09/09/2021',
            paciente: 'Gonzalez Pedro',
            medico: 'Juan Perez',
            idx: 5
        },
        {
            codigo: 'Ovo_14/02/20_Mar_Lau_6',
            estado: 'descartado',
            punsion: '14/02/2020',
            paciente: 'Martinez Laura',
            medico: 'Rodrigo Paez',
            idx: 6
        },
        {
            codigo: 'Ovo_27/03/19_San_Car_7',
            estado: 'fecundado',
            punsion: '27/03/2019',
            paciente: 'Sanchez Carla',
            medico: 'Juan Perez',
            idx: 7
        },
        {
            codigo: 'Ovo_05/08/18_Lop_Jos_8',
            estado: 'maduro',
            punsion: '05/08/2018',
            paciente: 'Lopez Josefina',
            medico: 'Rodrigo Paez',
            idx: 8
        },
        {
            codigo: 'Ovo_22/12/17_Ram_Mat_9',
            estado: 'inmaduro',
            punsion: '22/12/2017',
            paciente: 'Ramirez Mateo',
            medico: 'Juan Perez',
            idx: 9
        },
        {
            codigo: 'Ovo_30/01/16_Bar_Flo_10',
            estado: 'muy_inmaduro',
            punsion: '30/01/2016',
            paciente: 'Barrios Florencia',
            medico: 'Rodrigo Paez',
            idx: 10
        }
    ]);
    
    const limpiarFiltros = () => {
        setFiltroMedico("");
        setFiltroPaciente("");
        setFiltroDia("");
        setFiltroMes("");
        setFiltroAnio("");
    };
    
    const ovocitosFiltrados = ovocitos.filter(ovo => {
        // Filtrar por médico (normalizar ambos valores a minúsculas)
        if (filtroMedico) {
            const medicoNormalizado = ovo.medico.trim().toLowerCase();
            const filtroNormalizado = filtroMedico.trim().toLowerCase();
            if (medicoNormalizado !== filtroNormalizado) {
                return false;
            }
        }
        
        // Filtrar por paciente (normalizar ambos valores a minúsculas)
        if (filtroPaciente) {
            const pacienteNormalizado = ovo.paciente.trim().toLowerCase();
            const filtroNormalizado = filtroPaciente.trim().toLowerCase();
            if (pacienteNormalizado !== filtroNormalizado) {
                return false;
            }
        }
        
        // Filtrar por fecha
        if (filtroDia || filtroMes || filtroAnio) {
            const [dia, mes, anio] = ovo.punsion.split("/");
            
            // Comparar día (asegurar formato con 2 dígitos)
            if (filtroDia && dia !== filtroDia.padStart(2, "0")) {
                return false;
            }
            
            // Comparar mes (convertir mes de la fecha a índice 0-11)
            if (filtroMes && mes !== (parseInt(filtroMes, 10) + 1).toString().padStart(2, "0")) {
                return false;
            }
            
            // Comparar año
            if (filtroAnio && anio !== filtroAnio) {
                return false;
            }
        }
        
        return true;
    });

    return(
        <DashboardLayout role="operador_laboratorio">
            <Card className={'rounded-[5px]'}>
                <CardHeader>
                    <CardTitle>
                        <h1 className="p-5">
                            OVOCITOS
                        </h1>
                        <Separator/>
                    </CardTitle>
                    <CardDescription className={'flex flex-col gap-2'}>
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
                        <Combobox
                            datas={medicos}
                            title="Busca por medico"
                            className={"rounded-[5px]"}
                            action={v => setFiltroMedico(v || "")}
                        />
                        <Combobox
                            datas={pacientes}
                            title="Busca por paciente"
                            className={"rounded-[5px]"}
                            action={v => setFiltroPaciente(v || "")}
                        />
                        <div className="flex flex-col gap-2">
                            <Label>
                                Fecha de punsion
                            </Label>
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
                            Mostrando {ovocitosFiltrados.length} de {ovocitos.length} ovocitos
                        </div>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Código</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Fecha Punsion</TableHead>
                                <TableHead>Paciente</TableHead>
                                <TableHead>Medico Encargado</TableHead>
                                <TableHead>ACCIONES</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ovocitosFiltrados.length > 0 ? (
                                ovocitosFiltrados.map((ovo, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            <Badge className={`font-bold rounded-[5px] ${getBadgeColor(ovo.estado)}`}>
                                                {ovo.codigo}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`font-bold rounded-[5px] ${getBadgeColor(ovo.estado)}`}>
                                                {ovo.estado.replace(/_/g, ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <p>{ovo.punsion}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p>{ovo.paciente}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p>{ovo.medico}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Link 
                                                to={'/laboratorio/ovocito/' + ovo.idx}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Ver detalles
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                        No se encontraron ovocitos con los filtros aplicados
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