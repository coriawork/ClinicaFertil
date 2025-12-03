import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Separator } from "@/components/ui/separator"
import { Card,CardHeader,CardFooter,CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Combobox } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

export function Estimulacion(){

    const drogas = [
        { value: '', label: '' },
        { value: 'clomifeno', label: 'Clomifeno' },
        { value: 'letrozol', label: 'Letrozol' },
        { value: 'gonadotrofina-menopausica-humana', label: 'Gonadotrofina Menopáusica Humana (hMG)' },
        { value: 'fsh-recombinante', label: 'FSH Recombinante' },
        { value: 'lh-recombinante', label: 'LH Recombinante' },
        { value: 'gonadotrofina-corionica-humana', label: 'Gonadotrofina Coriónica Humana (hCG)' },
        { value: 'antagonista-gnrh', label: 'Antagonista de GnRH' },
        { value: 'agonista-gnrh', label: 'Agonista de GnRH' },
        { value: 'metformina', label: 'Metformina' },
        { value: 'bromocriptina', label: 'Bromocriptina' },
        { value: 'cabergolina', label: 'Cabergolina' },
        { value: 'progesterona', label: 'Progesterona' },
        { value: 'estradiol', label: 'Estradiol' },
        { value: 'dexametasona', label: 'Dexametasona' },
        { value: 'prednisona', label: 'Prednisona' },
        { value: 'letrozole', label: 'Letrozole' },
        { value: 'menotropina', label: 'Menotropina' },
        { value: 'urofollitropina', label: 'Urofollitropina' },
        { value: 'corifolitropina', label: 'Corifolitropina' },
        { value: 'cetrorelix', label: 'Cetrorelix' },
        { value: 'ganirelix', label: 'Ganirelix' },
        { value: 'triptorelina', label: 'Triptorelina' },
        { value: 'leuprolida', label: 'Leuprolida' },
        { value: 'nafarelina', label: 'Nafarelina' },
        { value: 'goserelina', label: 'Goserelina' },
        { value: 'follitropina-alfa', label: 'Follitropina Alfa' },
        { value: 'follitropina-beta', label: 'Follitropina Beta' },
        { value: 'menopur', label: 'Menopur' },
        { value: 'ovidrel', label: 'Ovidrel' },
        { value: 'pergonal', label: 'Pergonal' },
        { value: 'puregon', label: 'Puregon' },
        { value: 'gonal-f', label: 'Gonal-F' },
        { value: 'luveris', label: 'Luveris' },
        { value: 'ovitrelle', label: 'Ovitrelle' },
        { value: 'crinone', label: 'Crinone' },
        { value: 'utrogestan', label: 'Utrogestan' },
        { value: 'prolutex', label: 'Prolutex' },
        { value: 'estrace', label: 'Estrace' },
        { value: 'estradot', label: 'Estradot' },
        { value: 'estrogel', label: 'Estrogel' },
        { value: 'progynova', label: 'Progynova' },
        { value: 'duphaston', label: 'Duphaston' },
        { value: 'primogyna', label: 'Primogyna' },
        { value: 'vitamina-e', label: 'Vitamina E' },
        { value: 'aspirina-baja-dosis', label: 'Aspirina (baja dosis)' },
        { value: 'heparina', label: 'Heparina' },
        { value: 'enoxaparina', label: 'Enoxaparina' },
        { value: 'prednisolona', label: 'Prednisolona' },
        { value: 'hidrocortisona', label: 'Hidrocortisona' }
    ]

    const Tiposmedicaciones = [
        {value:'inyectable',label:'Inyectable'},
        {value:'oral',label:'Oral'},
        {value:'mixto',label:'Mixto'}
    ]

    const [monitoreos, setMonitoreos] = useState([])
    const [nuevoMonitoreo, setNuevoMonitoreo] = useState("")

    const handleAgregarMonitoreo = () => {
        if (!nuevoMonitoreo.trim()) return
        setMonitoreos(prev => [
            ...prev,
            {
                fecha: new Date().toLocaleString(),
                observacion: nuevoMonitoreo
            }
        ])
        setNuevoMonitoreo("")
    }

    const [tipo, setTipo] = useState("")
    const [droga, setDroga] = useState("")
    const [dosis, setDosis] = useState("")
    const [duracion, setDuracion] = useState("")
    const [estimuloFijado, setEstimuloFijado] = useState(false)
    const [consentimiento, setConsentimiento] = useState(undefined)
    const selectTipo = (value) => setTipo(value)
    const selectDroga = (value) => setDroga(value)

    const habilitar = tipo && droga && dosis && duracion

    const handleResetFijado = () => {
        setEstimuloFijado(false)
    }

    return(
        <DashboardLayout role={"medico"}>
            <h1 className="text-2xl font-bold">GESTION DE ESTIMULACION</h1>
            <Card>
                <CardTitle className={'px-5 flex items-center justify-between'}>
                    <h2 className="text-2xl font-bold">REGISTRAR DROGA</h2>
                    <RotateCcw 
                        className="cursor-pointer rotate-hover hover:text-chart-4"
                        onClick={handleResetFijado}
                        title="Reiniciar fijado"
                    />    
                </CardTitle>
                <CardDescription className={'px-5'}>para subir pedir consentimiento fija la droga y luego para comenzar estimulo, solo subi consentimiento</CardDescription>
                <Separator/>
                <CardContent className={'gap-5 flex flex-col'}> 
                    <div className="space-y-2 w-full">
                        <Label className={"text-muted-foregroun/50 ml-5px"} htmlFor="tipoSelect">
                            Tipo de medicacion
                        </Label>
                        <Combobox 
                            id='tipoSelect' 
                            datas={Tiposmedicaciones} 
                            title="Lista de tipos de drogas" 
                            action={selectTipo} 
                            className="rounded-none w-full"
                            disabled={estimuloFijado}
                            value={tipo}
                        />
                    </div>       
                    <div className="space-y-2 w-full">
                        <Label className={"text-muted-foregroun/50 ml-5px"} htmlFor="drogaSelect">Elegi la droga de la estimulacion</Label>
                        <Combobox 
                            id='drogaSelect' 
                            datas={drogas} 
                            title="Lista de drogas" 
                            action={selectDroga} 
                            className="rounded-none w-full"
                            disabled={estimuloFijado}
                            value={droga}
                        />
                    </div>       
                    <div className="space-y-2 w-full">
                        <Label className={"text-muted-foregroun/50 ml-5px"} htmlFor="dosis">Dosis</Label>
                        <Input 
                            id='dosis' 
                            placeholder={"2ml cada 6"} 
                            type={"text"} 
                            className="rounded-none w-full" 
                            value={dosis} 
                            onChange={e => setDosis(e.target.value)}
                            disabled={estimuloFijado}
                        />
                    </div>       
                    <div className="space-y-2 w-full">
                        <Label className={"text-muted-foregroun/50 ml-5px"} htmlFor="duracion">Duracion</Label>
                        <Input 
                            id='duracion' 
                            placeholder={"duracion en dias"} 
                            type={"number"} 
                            className="rounded-none w-full" 
                            value={duracion} 
                            onChange={e => setDuracion(e.target.value)}
                            disabled={estimuloFijado}
                        />
                    </div>     

                    {!estimuloFijado ? (
                        <Button 
                            variant={'action'} 
                            className={"text-white"} 
                            disabled={!habilitar}
                            onClick={() => setEstimuloFijado(true)}
                        >
                            Imprimir contrato de consentimiento 
                        </Button>
                    ) : (
                        <div className="space-y-2 w-full">
                            <Label className={"text-muted-foregroun/50 ml-5px"} htmlFor="file">Subir consentimiento firmado</Label>
                            <Input id='file' placeholder={""} type={"file"} className="w-full rounded-none "/>
                            <Button 
                                variant={'action'} 
                                className={"text-white"} 
                                onClick={()=>setConsentimiento(true)}
                            >
                                Confirmar consentimiento 
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
            <Button asChild>
                <Link to={'/medico/agenda'}>Pedir monitoreo</Link>
            </Button>
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Monitoreo</CardTitle>
                    <CardDescription>
                        Agregá y visualizá los controles de monitoreo realizados durante la estimulación.
                    </CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="flex flex-col gap-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Observaciones del monitoreo"
                            value={nuevoMonitoreo}
                            disabled={!consentimiento}
                            onChange={e => setNuevoMonitoreo(e.target.value)}
                            className="w-full"
                        />
                        <Button onClick={handleAgregarMonitoreo} disabled={!nuevoMonitoreo.trim()}>
                            Agregar
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {monitoreos.length === 0 && (
                            <p className="text-muted-foreground text-sm">No hay monitoreos registrados.</p>
                        )}
                        {monitoreos.map((m, idx) => (
                            <div key={idx} className="border rounded p-2 bg-muted">
                                <div className="text-xs text-muted-foreground">{m.fecha}</div>
                                <div className="font-medium">{m.observacion}</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </DashboardLayout>
    )
}