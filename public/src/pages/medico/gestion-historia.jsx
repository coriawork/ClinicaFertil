"use client"

import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Calendar,Ruler, Phone, Mail, MapPin, Heart, Info,Activity, Ban, X, Cigarette, Wine, Pill, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Combobox } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FamilyTree } from "@/components/family-tree"
import {Select, SelectContent, SelectGroup, SelectTrigger, SelectLabel, SelectValue, SelectItem} from "@/components/ui/select"

export default function GestionHistoria() {
    const [editG, setEditG] = useState(false)
    const [editH, setEditH] = useState(false)


    const [fenotipo, setFenotipo] = useState({
        colorOjos: '',
        colorPelo: '',
        tipoPelo: '',
        altura: null,
        complexion: ''
    })
    const [fenotipoCache, setFenotipoCache] = useState({})
    const [editF, setEditF] = useState(false)

    const coloresOjos = [
        { value: 'marron', label: 'Marrón' },
        { value: 'negro', label: 'Negro' },
        { value: 'verde', label: 'Verde' },
        { value: 'azul', label: 'Azul' },
        { value: 'gris', label: 'Gris' },
        { value: 'avellana', label: 'Avellana' },
        { value: 'miel', label: 'Miel' }
    ]

    const coloresPelo = [
        { value: 'negro', label: 'Negro' },
        { value: 'castaño-oscuro', label: 'Castaño Oscuro' },
        { value: 'castaño', label: 'Castaño' },
        { value: 'castaño-claro', label: 'Castaño Claro' },
        { value: 'rubio-oscuro', label: 'Rubio Oscuro' },
        { value: 'rubio', label: 'Rubio' },
        { value: 'rubio-claro', label: 'Rubio Claro' },
        { value: 'pelirrojo', label: 'Pelirrojo' },
        { value: 'blanco', label: 'Blanco/Canoso' }
    ]

    const tiposPelo = [
        { value: 'liso', label: 'Liso' },
        { value: 'ondulado', label: 'Ondulado' },
        { value: 'rizado', label: 'Rizado' },
        { value: 'muy-rizado', label: 'Muy Rizado/Afro' }
    ]

    const complexiones = [
        { value: 'delgada', label: 'Delgada' },
        { value: 'media', label: 'Media' },
        { value: 'robusta', label: 'Robusta' }
    ]

    const handleFenotipoChange = (field, value) => {
        setFenotipo(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSaveFenotipo = () => {
        console.log("Fenotipo guardado:", fenotipo)
        setFenotipoCache(fenotipo)
        setEditF(false)
    }

    const handleCancelEditFenotipo = () => {
        setFenotipo(fenotipoCache)
        setEditF(false)
    }


    const [habitos, setHabitos] = useState({
        fuma: false,
        cigarrillosPorDia: 0,
        añosFumando: 0,
        tomaAlcohol: false,
        frecuenciaAlcohol: '',
        cantidadAlcohol: '',
        consumeDrogas: false,
        tiposDrogas: '',
        observaciones: '',
        fisico:''
    })

    const [habitosCache, setHabitosCache] = useState({})

    const [quirurgicoSelected, setQuirurgicoSelected] = useState([])

    const AntQuirurgico = [
        {value:"apendicectomía", label:"Apendicectomía"},
        {value:"cesárea", label:"Cesárea"},
        {value:"laparoscopía", label:"Laparoscopía"},
        {value:"histeroscopía", label:"Histeroscopía"},
        {value:"miomectomía", label:"Miomectomía"},
        {value:"salpingectomía", label:"Salpingectomía"},
        {value:"ooforectomía", label:"Ooforectomía"},
        {value:"colecistectomía", label:"Colecistectomía"},
        {value:"herniorrafia", label:"Herniorrafia"},
        {value:"amigdalectomía", label:"Amigdalectomía"},
        {value:"adenoidectomía", label:"Adenoidectomía"},
        {value:"ligadura-trompas", label:"Ligadura de trompas"},
        {value:"quiste-ovárico", label:"Quiste ovárico"},
        {value:"polipectomía", label:"Polipectomía"},
        {value:"conización-cervical", label:"Conización cervical"},
        {value:"mastectomía", label:"Mastectomía"},
        {value:"biopsia-mamaria", label:"Biopsia mamaria"},
        {value:"tiroidectomía", label:"Tiroidectomía"},
        {value:"cirugía-endometriosis", label:"Cirugía de endometriosis"},
        {value:"cirugía-várices", label:"Cirugía de várices"}
    ]

    
    const calcularPackYears = () => {
        if (!habitos.fuma || !habitos.cigarrillosPorDia || !habitos.añosFumando) return 0
        return ((habitos.cigarrillosPorDia * habitos.añosFumando) / 20).toFixed(2)
    }

    const handleHabitosChange = (field, value) => {
        setHabitos(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSaveHabitos = () => {
        console.log("Hábitos guardados:", habitos)
        setHabitosCache(habitos)
        setEditH(false)
    }

    const handleCancelEditHabitos = () => {
        setHabitos(habitosCache)
        setEditH(false)
    }

    const [ginecologico,setGinecologico] = useState({})
    const [ginecologicoCache,setGinecologicoCache] = useState({})

    const handleGinecologicoChange = (field, value)=> {
        setGinecologico(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSaveGinecologico = () => {
        // Simulacion api
        console.log("Datos guardados:", ginecologico)
        setGinecologicoCache(ginecologico)
        setEditG(false)
        
    }

    const handleCancelEdit = () => {
        setGinecologico(ginecologicoCache) 
        setEditG(false)
    }


    const personalInfo = {
    name: "María",
    last_name:"Garcia",
    birthDate: "1988-05-15",
    age: 36,
    phone: "+34 612 345 678",
    email: "maria.garcia@email.com",
    address: "Calle Principal 123, Madrid",
    sexo:"Femenino",
    obra_social:"OSDE",
    nro_socio:'21324/6'
    }


    const handleEliminarQuirurgico = (index) => {
        setQuirurgicoSelected(prev => prev.filter((_, i) => i !== index))
    }
    const addQuirurgico = (currentValue)=>{
        if (!currentValue) return
        setQuirurgicoSelected(prev => {
            const next = typeof currentValue === "string" ? currentValue : (currentValue.label ?? currentValue.value)
            if (!next) return prev
            return prev.includes(next) ? prev : [...prev, next]
        })
    }

    return (
        <DashboardLayout role="medico">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Gestionar Historial Clinico</h1>
                </div>

                {/* Antecedentes quirurgicos */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex text-2xl items-center gap-2">
                            Antecedentes Quirurgicos
                        </CardTitle>
                        <Separator/>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 w-full">
                            <Label className={"text-muted-foregroun/50 ml-5px"} htmlFor="antecedentesSelect">Agrega antecedentes quirurgicos</Label>
                            <Combobox id='antecedentesSelect' datas={AntQuirurgico} title="Elegi un antecedente" action={addQuirurgico} className="w-full"/>
                        </div>
                        <div className="flex flex-wrap gap-3 ">
                            {(quirurgicoSelected && quirurgicoSelected.length != 0)? (quirurgicoSelected.map((q, index) => (
                                <div key={index} className="flex w-1/4 justify-between items-center p-3 border rounded-lg">
                                    <span className="text-sm uppercase font-bold">{q}</span>
                                    <X onClick={()=>handleEliminarQuirurgico(index)} className="cursor-pointer"/>
                                </div>
                            ))):(
                                <div className="flex gap-5 items-center w-full ">
                                    <Ban/>
                                    <h1>No hay antecedentes registrados aun</h1>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className={'w-full'}>

                    </CardFooter>
                </Card>             
                
                {/* Historial Ginecologico */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-2xl gap-2">
                            Antecedentes Ginecológicos
                        </CardTitle>
                        <Separator/>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 flex gap-5 flex-col">
                            {/* Menarca */}
                            <div className="space-y-2 bg-accent/10 p-2 rounded-2xl">
                                <Label htmlFor="menarca" className="text-sm font-semibold">
                                    Menarca
                                </Label>
                                {editG ? (
                                    <Input
                                        id="menarca"
                                        type="number"
                                        min="8"
                                        max="20"
                                        value={ginecologico.menarca || ''}
                                        onChange={(e) => handleGinecologicoChange('menarca', parseInt(e.target.value) || null)}
                                        placeholder="Edad en años"
                                    />
                                ) : (
                                    <p className="text-sm pl-6">
                                        {ginecologico.menarca ? `${ginecologico.menarca} años` : 'No registrado'}
                                    </p>
                                )}
                            </div>

                            {/* Ciclo Menstrual */}
                            <div className="space-y-2 bg-accent/10 p-2 rounded-2xl">
                                <Label className="text-sm font-semibold">
                                    Ciclo Menstrual
                                </Label>
                                {editG ? (
                                    <div className="space-y-3 pl-6">
                                        <RadioGroup 
                                            value={ginecologico.cicloRegular === null ? "" : (ginecologico.cicloRegular ? "regular" : "irregular")}
                                            onValueChange={(value) => handleGinecologicoChange('cicloRegular', value === "regular")}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="regular" id="ciclo-regular" />
                                                <Label htmlFor="ciclo-regular">Regular</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="irregular" id="ciclo-irregular" />
                                                <Label htmlFor="ciclo-irregular">Irregular</Label>
                                            </div>
                                        </RadioGroup>

                                        <div className="space-y-2">
                                            <Label htmlFor="duracionCiclo">Duración del ciclo (días)</Label>
                                            <Input
                                                id="duracionCiclo"
                                                type="number"
                                                min="21"
                                                max="45"
                                                value={ginecologico.duracionCiclo || ''}
                                                onChange={(e) => handleGinecologicoChange('duracionCiclo', parseInt(e.target.value) || null)}
                                                placeholder="Ej: 28"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm pl-6 space-y-1">
                                        <p>
                                            <span className="text-muted-foreground">Tipo:</span>{' '}
                                            <span className="font-medium">
                                                {ginecologico.cicloRegular === null 
                                                    ? 'No registrado' 
                                                    : ginecologico.cicloRegular ? 'Regular' : 'Irregular'}
                                            </span>
                                        </p>
                                        <p>
                                            <span className="text-muted-foreground">Duración:</span>{' '}
                                            <span className="font-medium">
                                                {ginecologico.duracionCiclo ? `${ginecologico.duracionCiclo} días` : 'No registrado'}
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Características del Sangrado */}
                            <div className="space-y-2 bg-accent/10 p-2 rounded-2xl">
                                <Label htmlFor="caracteristicasSangrado" className="text-sm font-semibold">
                                    Características del Sangrado
                                </Label>

                                {editG ? (
                                    <Textarea
                                        id="caracteristicasSangrado"
                                        value={ginecologico.caracteristicasSangrado || ''}
                                        onChange={(e) => handleGinecologicoChange('caracteristicasSangrado', e.target.value)}
                                        placeholder="Ej: Sangrado moderado, 5 días de duración, color rojo oscuro, sin coágulos..."
                                        rows={3}
                                    />
                                ) : (
                                    <p className="text-sm pl-6 text-muted-foreground">
                                        {ginecologico.caracteristicasSangrado || 'No registrado'}
                                    </p>
                                )}
                            </div>
                            

                            {/* Historial Obstétrico - G P AB ST */}
                            <div className="space-y-3 bg-accent/10 p-2 rounded-2xl">
                                <Label className="text-sm font-semibold">
                                    Historial Obstétrico (G-P-AB-ST)
                                </Label>
                                
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    {/* G - Embarazos */}
                                    <div className="space-y-2">
                                        <Label htmlFor="embarazos" className="text-sm">
                                            G (Gestas/Embarazos)
                                        </Label>
                                        {editG ? (
                                            <Input
                                                id="embarazos"
                                                type="number"
                                                min="0"
                                                value={ginecologico.embarazos || ''}
                                                onChange={(e) => handleGinecologicoChange('embarazos', parseInt(e.target.value) || 0)}
                                                placeholder="0"
                                            />
                                        ) : (
                                            <p className="font-medium">
                                                {ginecologico.embarazos ?? 0}
                                            </p>
                                        )}
                                    </div>

                                    {/* P - Partos */}
                                    <div className="space-y-2">
                                        <Label htmlFor="partos" className="text-sm">
                                            P (Partos)
                                        </Label>
                                        {editG ? (
                                            <Input
                                                id="partos"
                                                type="number"
                                                min="0"
                                                max={ginecologico.embarazos || undefined}
                                                value={ginecologico.partos || ''}
                                                onChange={(e) => handleGinecologicoChange('partos', parseInt(e.target.value) || 0)}
                                                placeholder="0"
                                            />
                                        ) : (
                                            <p className="font-medium">
                                                {ginecologico.partos ?? 0}
                                            </p>
                                        )}
                                    </div>

                                    {/* AB - Abortos */}
                                    <div className="space-y-2">
                                        <Label htmlFor="abortos" className="text-sm">
                                            AB (Abortos)
                                        </Label>
                                        {editG ? (
                                            <Input
                                                id="abortos"
                                                type="number"
                                                min="0"
                                                max={ginecologico.embarazos || undefined}
                                                value={ginecologico.abortos || ''}
                                                onChange={(e) => handleGinecologicoChange('abortos', parseInt(e.target.value) || 0)}
                                                placeholder="0"
                                            />
                                        ) : (
                                            <p className="font-medium">
                                                {ginecologico.abortos ?? 0}
                                            </p>
                                        )}
                                    </div>

                                    {/* ST - Embarazos Ectópicos */}
                                    <div className="space-y-2 b">
                                        <Label htmlFor="embarazosEctopicos" className="text-sm">
                                            ST (Ectópicos)
                                        </Label>
                                        {editG ? (
                                            <Input
                                                id="embarazosEctopicos"
                                                type="number"
                                                min="0"
                                                max={ginecologico.embarazos || undefined}
                                                value={ginecologico.embarazosEctopicos || ''}
                                                onChange={(e) => handleGinecologicoChange('embarazosEctopicos', parseInt(e.target.value) || 0)}
                                                placeholder="0"
                                            />
                                        ) : (
                                            <p className="font-medium">
                                                {ginecologico.embarazosEctopicos ?? 0}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Etapa 3 */}
                            <div className=" flex bg-accent/10 p-2  rounded-2xl">
                                <Label htmlFor="gametos" className="text-sm flex-1 w-full font-semibold">
                                    Gametos viables
                                </Label>

                                {editG ? (
                                    <Input 
                                        type={"checkbox"}
                                        id="gametos"
                                        className={"w-5 "}
                                        value={ginecologico.gametos || false}
                                        onChange={(e) => handleGinecologicoChange('gametos', e.target.value)}
                                    />
                                ) : (
                                    <p className="text-sm pl-6 text-muted-foreground">
                                        {ginecologico.gametos === false && ("no viable") || ginecologico.gametos === true && ("viable") || 'No registrado'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                        {editG ? (
                            <>
                                <Button onClick={handleSaveGinecologico} variant="default" className="flex-1">
                                    Guardar Cambios
                                </Button>
                                <Button onClick={handleCancelEdit} variant="outline" className="flex-1">
                                    Cancelar
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setEditG(true)} variant="action" className="w-full">
                                {Object.values(ginecologico).some(val => val !== null && val !== '' && val !== false && val !== 0) 
                                    ? 'Editar información' 
                                    : 'Agregar información'}
                            </Button>
                        )}
                    </CardFooter>
                </Card> 

                {/* Habitos */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex text-2xl items-center gap-2">
                            Hábitos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Tabaquismo */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Cigarette className="h-4 w-4 text-muted-foreground" />
                                    <Label className="text-sm font-semibold">Tabaquismo</Label>
                                </div>
                                
                                {editH ? (
                                    <div className="space-y-3 pl-6">
                                        <RadioGroup 
                                            value={habitos.fuma ? "si" : "no"}
                                            onValueChange={(value) => handleHabitosChange('fuma', value === "si")}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="si" id="fuma-si" />
                                                <Label htmlFor="fuma-si">Sí, fuma</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="no" id="fuma-no" />
                                                <Label htmlFor="fuma-no">No fuma</Label>
                                            </div>
                                        </RadioGroup>

                                        {habitos.fuma && (
                                            <div className="grid gap-3 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="cigarrillosPorDia">Cigarrillos por día</Label>
                                                    <Input
                                                        id="cigarrillosPorDia"
                                                        type="number"
                                                        min="0"
                                                        value={habitos.cigarrillosPorDia || ''}
                                                        onChange={(e) => handleHabitosChange('cigarrillosPorDia', parseInt(e.target.value) || 0)}
                                                        placeholder="Ej: 10"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="añosFumando">Años fumando</Label>
                                                    <Input
                                                        id="añosFumando"
                                                        type="number"
                                                        min="0"
                                                        value={habitos.añosFumando || ''}
                                                        onChange={(e) => handleHabitosChange('añosFumando', parseInt(e.target.value) || 0)}
                                                        placeholder="Ej: 5"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="pl-6 space-y-1">
                                        <p className="text-sm">
                                            <span className="text-muted-foreground">Estado:</span>{' '}
                                            <span className="font-medium">
                                                {habitos.fuma ? 'Fumador' : 'No fumador'}
                                            </span>
                                        </p>
                                        {habitos.fuma && (
                                            <>
                                                <p className="text-sm">
                                                    <span className="text-muted-foreground">Consumo:</span>{' '}
                                                    <span className="font-medium">
                                                        {habitos.cigarrillosPorDia} cigarrillos al día
                                                    </span>
                                                </p>
                                                <p className="text-sm">
                                                    <span className="text-muted-foreground">Años fumando:</span>{' '}
                                                    <span className="font-medium">{habitos.añosFumando} años</span>
                                                </p>
                                                <p className="text-sm">
                                                    <span className="text-muted-foreground">Packs/Dias:</span>{' '}
                                                    <span className="font-medium">{calcularPackYears()}</span>
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            <Separator />

                            {/* Alcohol */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Wine className="h-4 w-4 text-muted-foreground" />
                                    <Label className="text-sm font-semibold">Consumo de Alcohol</Label>
                                </div>
                                
                                {editH ? (
                                    <div className="space-y-3 pl-6">
                                        <RadioGroup 
                                            value={habitos.tomaAlcohol ? "si" : "no"}
                                            onValueChange={(value) => handleHabitosChange('tomaAlcohol', value === "si")}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="si" id="alcohol-si" />
                                                <Label htmlFor="alcohol-si">Sí, consume alcohol</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="no" id="alcohol-no" />
                                                <Label htmlFor="alcohol-no">No consume alcohol</Label>
                                            </div>
                                        </RadioGroup>

                                        {habitos.tomaAlcohol && (
                                            <div className="grid gap-3 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="frecuenciaAlcohol">Frecuencia</Label>
                                                    <Input
                                                        id="frecuenciaAlcohol"
                                                        type="text"
                                                        value={habitos.frecuenciaAlcohol || ''}
                                                        onChange={(e) => handleHabitosChange('frecuenciaAlcohol', e.target.value)}
                                                        placeholder="Ej: Fines de semana"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="cantidadAlcohol">Cantidad</Label>
                                                    <Input
                                                        id="cantidadAlcohol"
                                                        type="text"
                                                        value={habitos.cantidadAlcohol || ''}
                                                        onChange={(e) => handleHabitosChange('cantidadAlcohol', e.target.value)}
                                                        placeholder="Ej: 2-3 copas"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="pl-6 space-y-1">
                                        <p className="text-sm">
                                            <span className="text-muted-foreground">Estado:</span>{' '}
                                            <span className="font-medium">
                                                {habitos.tomaAlcohol ? 'Consume alcohol' : 'No consume alcohol'}
                                            </span>
                                        </p>
                                        {habitos.tomaAlcohol && (
                                            <>
                                                <p className="text-sm">
                                                    <span className="text-muted-foreground">Frecuencia:</span>{' '}
                                                    <span className="font-medium">
                                                        {habitos.frecuenciaAlcohol || 'No especificado'}
                                                    </span>
                                                </p>
                                                <p className="text-sm">
                                                    <span className="text-muted-foreground">Cantidad:</span>{' '}
                                                    <span className="font-medium">
                                                        {habitos.cantidadAlcohol || 'No especificado'}
                                                    </span>
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            <Separator />

                            {/* Drogas Recreativas */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Pill className="h-4 w-4 text-muted-foreground" />
                                    <Label className="text-sm font-semibold">Drogas Recreativas</Label>
                                </div>
                                
                                {editH ? (
                                    <div className="space-y-3 pl-6">
                                        <RadioGroup 
                                            value={habitos.consumeDrogas ? "si" : "no"}
                                            onValueChange={(value) => handleHabitosChange('consumeDrogas', value === "si")}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="si" id="drogas-si" />
                                                <Label htmlFor="drogas-si">Sí, consume</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="no" id="drogas-no" />
                                                <Label htmlFor="drogas-no">No consume</Label>
                                            </div>
                                        </RadioGroup>

                                    </div>
                                ) : (
                                    <div className="pl-6 space-y-1">
                                        <p className="text-sm">
                                            <span className="text-muted-foreground">Estado:</span>{' '}
                                            <span className="font-medium">
                                                {habitos.consumeDrogas ? 'Consume drogas recreativas' : 'No consume drogas recreativas'}
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            {/* Observaciones */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <Label className="text-sm font-semibold">Observaciones sobre hábitos</Label>
                                </div>
                                
                                {editH ? (
                                    <div className="pl-6">
                                        <Textarea
                                            id="observaciones"
                                            value={habitos.observaciones || ''}
                                            onChange={(e) => handleHabitosChange('observaciones', e.target.value)}
                                            placeholder="Información adicional sobre hábitos de vida, ejercicio, dieta, etc..."
                                            rows={3}
                                        />
                                    </div>
                                ) : (
                                    <div className="pl-6">
                                        <p className="text-sm text-muted-foreground">
                                            {habitos.observaciones || 'Sin observaciones registradas'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Examen fisico */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <Label className="text-sm font-semibold">Examen Fisico</Label>
                                </div>
                                
                                {editH ? (
                                    <div className="pl-6">
                                        <Textarea
                                            id="fisico"
                                            value={habitos.fisico || ''}
                                            onChange={(e) => handleHabitosChange('fisico', e.target.value)}
                                            placeholder="Examen fisico sobre el paciente"
                                            rows={4}
                                        />
                                    </div>
                                ) : (
                                    <div className="pl-6">
                                        <p className="text-sm text-muted-foreground">
                                            {habitos.fisico || 'Sin observaciones registradas'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                        {editH ? (
                            <>
                                <Button onClick={handleSaveHabitos} variant="default" className="flex-1">
                                    Guardar Cambios
                                </Button>
                                <Button onClick={handleCancelEditHabitos} variant="outline" className="flex-1">
                                    Cancelar
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setEditH(true)} variant="action" className="w-full">
                                {Object.values(habitos).some(val => val !== null && val !== '' && val !== false) 
                                    ? 'Editar información' 
                                    : 'Agregar información'}
                            </Button>
                        )}
                    </CardFooter>
                </Card>

                {/* Fenotipo */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex text-2xl items-center gap-2">
                            Características Fenotípicas
                        </CardTitle>
                        
                        <Separator/>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Color de Ojos */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                                    <Label className="text-sm font-semibold">Color de Ojos</Label>
                                </div>
                                
                                {editF ? (
                                    <div className="pl-6">
                                        <Select 
                                            value={fenotipo.colorOjos} 
                                            onValueChange={(value) => handleFenotipoChange('colorOjos', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar color de ojos" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {coloresOjos.map((color) => (
                                                    <SelectItem key={color.value} value={color.value}>
                                                        {color.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ) : (
                                    <div className="pl-6">
                                        <p className="text-sm">
                                            {fenotipo.colorOjos 
                                                ? coloresOjos.find(c => c.value === fenotipo.colorOjos)?.label 
                                                : 'No registrado'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            {/* Color de Pelo */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 bg-muted-foreground rounded-full" />
                                    <Label className="text-sm font-semibold">Color de Pelo</Label>
                                </div>
                                
                                {editF ? (
                                    <div className="pl-6">
                                        <Select 
                                            value={fenotipo.colorPelo} 
                                            onValueChange={(value) => handleFenotipoChange('colorPelo', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar color de pelo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {coloresPelo.map((color) => (
                                                    <SelectItem key={color.value} value={color.value}>
                                                        {color.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ) : (
                                    <div className="pl-6">
                                        <p className="text-sm">
                                            {fenotipo.colorPelo 
                                                ? coloresPelo.find(c => c.value === fenotipo.colorPelo)?.label 
                                                : 'No registrado'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            {/* Tipo de Pelo */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                    <Label className="text-sm font-semibold">Tipo de Pelo</Label>
                                </div>
                                
                                {editF ? (
                                    <div className="pl-6">
                                        <Select 
                                            value={fenotipo.tipoPelo} 
                                            onValueChange={(value) => handleFenotipoChange('tipoPelo', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar tipo de pelo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {tiposPelo.map((tipo) => (
                                                    <SelectItem key={tipo.value} value={tipo.value}>
                                                        {tipo.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ) : (
                                    <div className="pl-6">
                                        <p className="text-sm">
                                            {fenotipo.tipoPelo 
                                                ? tiposPelo.find(t => t.value === fenotipo.tipoPelo)?.label 
                                                : 'No registrado'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            {/* Altura */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Ruler className="h-4 w-4 text-muted-foreground" />
                                    <Label className="text-sm font-semibold">Altura</Label>
                                </div>
                                
                                {editF ? (
                                    <div className="pl-6 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                min="140"
                                                max="220"
                                                step="0.01"
                                                value={fenotipo.altura || ''}
                                                onChange={(e) => handleFenotipoChange('altura', parseFloat(e.target.value) || null)}
                                                placeholder="Ej: 165"
                                                className="max-w-[200px]"
                                            />
                                            <span className="text-sm text-muted-foreground">cm</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="pl-6">
                                        <p className="text-sm">
                                            {fenotipo.altura ? `${fenotipo.altura} cm` : 'No registrado'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            {/* Complexión Corporal */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <Label className="text-sm font-semibold">Complexión Corporal</Label>
                                </div>
                                
                                {editF ? (
                                    <div className="pl-6">
                                        <RadioGroup 
                                            value={fenotipo.complexion}
                                            onValueChange={(value) => handleFenotipoChange('complexion', value)}
                                        >
                                            {complexiones.map((comp) => (
                                                <div key={comp.value} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={comp.value} id={`comp-${comp.value}`} />
                                                    <Label htmlFor={`comp-${comp.value}`}>{comp.label}</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </div>
                                ) : (
                                    <div className="pl-6">
                                        <p className="text-sm">
                                            {fenotipo.complexion 
                                                ? complexiones.find(c => c.value === fenotipo.complexion)?.label 
                                                : 'No registrado'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                        {editF ? (
                            <>
                                <Button onClick={handleSaveFenotipo} variant="default" className="flex-1">
                                    Guardar Cambios
                                </Button>
                                <Button onClick={handleCancelEditFenotipo} variant="outline" className="flex-1">
                                    Cancelar
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setEditF(true)} variant="action" className="w-full">
                                {Object.values(fenotipo).some(val => val !== null && val !== '') 
                                    ? 'Editar información' 
                                    : 'Agregar información'}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
        
                {/* Historial genealogico */}
                <Card>
                    <CardContent>
                        <FamilyTree patientName="María González" />
                    </CardContent>
                </Card>        
    
            </div>
        </DashboardLayout>
    )
}
