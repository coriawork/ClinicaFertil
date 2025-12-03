import { use, useState,useMemo } from "react";
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { AccionesOvocitoMenu } from "../ovocitos/acciones";
import { useNavigate } from "react-router-dom";
const nombrePaciente = "Ana";
const apellidoPaciente = "García";
export function Punsion() {
    const navigate = useNavigate();
    const [quirofano, setQuirofano] = useState("");
    const [problemas, setProblemas] = useState("");
    const [ovocitos, setOvocitos] = useState([]);
    const [nuevoOvocito, setNuevoOvocito] = useState({
        estado: ""
    });

    const estadisticas = useMemo(() => {
        const conteo = {
            "Muy inmaduro": { cantidad: 0, color: "#3b82f6" },
            "Inmaduro": { cantidad: 0, color: "#eab308" },
            "Maduro": { cantidad: 0, color: "#22c55e" },
            "In vitro": { cantidad: 0, color: "#a855f7" },
            "Criopreservado": { cantidad: 0, color: "#06b6d4" },
            "Descartado": { cantidad: 0, color: "#dc2626" },
            "Fecundado": { cantidad: 0, color: "#ec4899" }
        };

        ovocitos.forEach(ovo => {
            switch(ovo.estado) {
                case "muy_inmaduro":
                    conteo["Muy inmaduro"].cantidad++;
                    break;
                case "inmaduro":
                    conteo["Inmaduro"].cantidad++;
                    break;
                case "maduro":
                    conteo["Maduro"].cantidad++;
                    break;
                case "in vitro":
                    conteo["In vitro"].cantidad++;
                    break;
                case "criopreservado":
                    conteo["Criopreservado"].cantidad++;
                    break;
                case "descartado":
                    conteo["Descartado"].cantidad++;
                    break;
                case "fecundado":
                    conteo["Fecundado"].cantidad++;
                    break;
            }
        });

        return Object.entries(conteo).map(([estado, data]) => ({
            estado,
            cantidad: data.cantidad,
            color: data.color
        }));
    }, [ovocitos]);


 
    const [punsionReg,setPunsionReg] = useState(false);

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

   
    const madurarInVitro = (idx) => {
        setOvocitos(ovocitos.map((ovo, i) =>
            i === idx ? { ...ovo, estado: "in vitro" } : ovo
        ));
    };
    const madurar = (idx) => {
        setOvocitos(ovocitos.map((ovo, i) =>
            i === idx ? { ...ovo, estado: "maduro" } : ovo
        ));
    };

    function registrarPunsion(){
        if(!quirofano )return null
        setPunsionReg(true)

    }


    return (
        <DashboardLayout role="laboratorio">
            <Tabs defaultValue="Punsion" className="">
                <TabsList>
                    <TabsTrigger value="Punsion">Punsion</TabsTrigger>
                    <TabsTrigger value="Estadisticas">Estadisticas</TabsTrigger>
                </TabsList>
                <TabsContent value="Punsion">
                    <Card className="rounded-[5px]">
                        <CardHeader>
                            <h2 className="text-lg font-bold">Registrar Punción</h2>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4">
                                {quirofano && (<p>quirofano registrado</p>)}
                                <div className="flex gap-20 ">
                                    <Input
                                        placeholder="Número de quirófano"
                                        value={quirofano}
                                        disabled={punsionReg}
                                        onChange={e => setQuirofano(e.target.value)}
                                        className={'rounded-[5px]'}
                                        />
                                    <Input
                                        placeholder="Problemas (opcional)"
                                        value={problemas}
                                        disabled={punsionReg}
                                        onChange={e => setProblemas(e.target.value)}
                                        className={'rounded-[5px]'}
                                    />
                                </div>
                            </div>
                            <Button disabled={punsionReg} onClick={()=>registrarPunsion()} className={'font-bold'}>REGISTRAR</Button>
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
                                                        <AccionesOvocitoMenu
                                                            ovocito={ovo}
                                                            index={idx}
                                                            onCriopreservar={(idx, datos) => {
                                                                setOvocitos(ovocitos.map((ovo, i) =>
                                                                    i === idx ? { ...ovo, estado: "criopreservado", criodata: datos } : ovo
                                                                ));
                                                            }}
                                                            onFecundar={(idx, datos) => {
                                                                setOvocitos(ovocitos.map((ovo, i) =>
                                                                    i === idx ? { ...ovo, estado: "fecundado", ...datos } : ovo
                                                                ));
                                                            }}
                                                            onMadurarInvitro={madurarInVitro}
                                                            onMadurar={madurar}
                                                            onCambiarEstado={(idx, nuevoEstado) => {
                                                                setOvocitos(ovocitos.map((ovo, i) =>
                                                                    i === idx ? { ...ovo, estado: nuevoEstado } : ovo
                                                                ));
                                                            }}
                                                            onDescartar={(idx, causa) => {
                                                                setOvocitos(ovocitos.map((ovo, i) =>
                                                                    i === idx ? { ...ovo, estado: "descartado", causaDescarte: causa } : ovo
                                                                ));
                                                            }}
                                                            onVerDetalle={(idx) => {
                                                                navigate(`/laboratorio/ovocito/${idx}`);
                                                            }}
                                                            mostrarVerDetalle={true}
                                                        />
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

                </TabsContent>
                <TabsContent value="Estadisticas">
                    {ovocitos.length > 0 && (
                        <Card className="rounded-lg shadow-md">
                            <CardHeader className="border-b">
                                <h2 className="text-xl font-bold text-foreground">Estadísticas de Ovocitos</h2>
                                <p className="text-sm text-foreground/70 mt-1">Total: {ovocitos.length} ovocitos registrados</p>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <ResponsiveContainer width="100%" height={320}>
                                    <BarChart data={estadisticas} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis 
                                            dataKey="estado" 
                                            angle={-45}
                                            textAnchor="end"
                                            height={100}
                                            fontSize={11}
                                            stroke="#6b7280"
                                        />
                                        <YAxis 
                                            allowDecimals={false}
                                            label={{ value: 'Cantidad', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
                                            stroke="#6b7280"
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'var(--background)', 
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                            }}
                                            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                                        />
                                        <Bar 
                                            dataKey="cantidad" 
                                            radius={[8, 8, 0, 0]}
                                        >
                                            {estadisticas.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )|| ovocitos.length == 0 &&(<>no hay ovocitos en esta punsion</>)}  
                </TabsContent>
                
            </Tabs>
            
        </DashboardLayout>
    );
}