import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Combobox } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectValue, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { useState } from "react"

export function GestionPunsion() {
    const medicos = [
        { value: 'juan perez', label: 'Juan Perez' },
        { value: 'rodrigo paez', label: 'Rodrigo Paez' }
    ]
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const pacientes = [
        ...Array.from(new Set([
            "Maria Gomez", "Ana Torres", "Luis Fernandez", "Pedro Martinez"
        ])).map(p => ({ value: p.toLowerCase(), label: p }))
    ];

    const [filtroMedico, setFiltroMedico] = useState("");
    const [filtroPaciente, setFiltroPaciente] = useState("");
    const [filtroDia, setFiltroDia] = useState("");
    const [filtroMes, setFiltroMes] = useState("");
    const [filtroAnio, setFiltroAnio] = useState("");

    const [punsiones] = useState([
        {
            codigo: "PUN-001",
            medico: "Juan Perez",
            paciente: "Maria Gomez",
            estado: "pendiente",
            fecha: "02/12/2025"
        },
        {
            codigo: "PUN-002",
            medico: "Juan Perez",
            paciente: "Maria Gomez",
            estado: "pendiente",
            fecha: "02/12/2025"
        },
        {
            codigo: "PUN-003",
            medico: "Rodrigo Paez",
            paciente: "Ana Torres",
            estado: "completada",
            fecha: "15/11/2024"
        },
        {
            codigo: "PUN-004",
            medico: "Juan Perez",
            paciente: "Luis Fernandez",
            estado: "cancelada",
            fecha: "01/10/2023"
        },
        {
            codigo: "PUN-005",
            medico: "Rodrigo Paez",
            paciente: "Pedro Martinez",
            estado: "pendiente",
            fecha: "20/09/2025"
        },
    ]);

    const limpiarFiltros = () => {
        setFiltroMedico("");
        setFiltroPaciente("");
        setFiltroDia("");
        setFiltroMes("");
        setFiltroAnio("");
    };

    const punsionesFiltradas = punsiones.filter(pun => {
        // Filtrar por médico
        if (filtroMedico) {
            const medicoNormalizado = pun.medico.trim().toLowerCase();
            const filtroNormalizado = filtroMedico.trim().toLowerCase();
            if (medicoNormalizado !== filtroNormalizado) {
                return false;
            }
        }

        // Filtrar por paciente
        if (filtroPaciente) {
            const pacienteNormalizado = pun.paciente.trim().toLowerCase();
            const filtroNormalizado = filtroPaciente.trim().toLowerCase();
            if (pacienteNormalizado !== filtroNormalizado) {
                return false;
            }
        }

        // Filtrar por fecha
        if (filtroDia || filtroMes || filtroAnio) {
            const [dia, mes, anio] = pun.fecha.split("/");

            if (filtroDia && dia !== filtroDia.padStart(2, "0")) {
                return false;
            }
            if (filtroMes && mes !== (parseInt(filtroMes, 10) + 1).toString().padStart(2, "0")) {
                return false;
            }
            if (filtroAnio && anio !== filtroAnio) {
                return false;
            }
        }

        return true;
    });

    function getBadgeColor(estado) {
        switch (estado) {
            case "pendiente":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "completada":
                return "bg-green-100 text-green-800 border-green-300";
            case "cancelada":
                return "bg-red-100 text-red-800 border-red-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    }

    return (
        <DashboardLayout role="laboratorio">
            <Card className="rounded-xl border-primary/20 bg-card/80 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                        PUNCIONES
                    </CardTitle>
                    <CardDescription className="mb-2 text-muted-foreground">
                        Filtra las punciones por médico, paciente y fecha
                    </CardDescription>
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">FILTROS</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={limpiarFiltros}
                            className="rounded-[5px]"
                        >
                            Limpiar filtros
                        </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mb-2">
                        <Combobox
                            datas={medicos}
                            title="Busca por médico"
                            className="rounded-md w-full sm:w-1/4"
                            action={v => setFiltroMedico(v || "")}
                        />
                        <Combobox
                            datas={pacientes}
                            title="Busca por paciente"
                            className="rounded-md w-full sm:w-1/4"
                            action={v => setFiltroPaciente(v || "")}
                        />
                        <Input
                            type="number"
                            min="1"
                            max="31"
                            placeholder="Día"
                            className="rounded-md w-full sm:w-1/6"
                            value={filtroDia}
                            onChange={e => setFiltroDia(e.target.value)}
                        />
                        <Select
                            value={filtroMes}
                            onValueChange={setFiltroMes}
                        >
                            <SelectTrigger className="rounded-md w-full sm:w-1/6">
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
                            className="rounded-md w-full sm:w-1/6"
                            value={filtroAnio}
                            onChange={e => setFiltroAnio(e.target.value)}
                        />
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                        Mostrando {punsionesFiltradas.length} de {punsiones.length} punciones
                    </div>
                    <Separator className="my-2" />
                </CardHeader>
                <CardContent className="max-h-[60vh] overflow-y-auto">
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
                            {punsionesFiltradas.length > 0 ? (
                                punsionesFiltradas.map((p, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            <Badge className={`font-bold rounded-[5px] bg-primary/10 text-primary`}>
                                                {p.codigo || `PUN-${idx + 1}`}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`font-bold rounded-[5px] ${getBadgeColor(p.estado)}`}>
                                                {p.estado.replace(/_/g, ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span>{p.fecha}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span>{p.paciente}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span>{p.medico}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Link to={`/laboratorio/punsion/${idx}`}>
                                                <Button size="sm" variant="secondary" className="rounded-md">
                                                    Gestionar
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                        No hay punciones registradas para los filtros seleccionados.
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