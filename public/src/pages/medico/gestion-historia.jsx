"use client"

import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Calendar,Ruler, Phone, Mail, MapPin, Heart, Info,Activity, Ban, X, Cigarette, Wine, Pill, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState,useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Combobox } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FamilyTree } from "@/components/family-tree"
import {Select, SelectContent, SelectGroup, SelectTrigger, SelectLabel, SelectValue, SelectItem} from "@/components/ui/select"
import { SearchAntecedentes } from "@/components/ui/searchAntecedentes"
import { useParams } from "react-router-dom"
import {pagosApi} from "@/utils/pagos"

export default function GestionHistoria() {
    const [editG, setEditG] = useState(false)
    const [editH, setEditH] = useState(false)
    const [loadingPDF, setLoadingPDF] = useState(false)
    
    const {id} = useParams()

    // Mockup de datos de pacientes/parejas
    const [datosPareja, setDatosPareja] = useState(null)
    const [tienePareja, setTienePareja] = useState(false)
    const [esPareja, setEsPareja] = useState(false) // true si el ID actual corresponde a una pareja
    const [pacienteActual, setPacienteActual] = useState(null)

    // Mockup de base de datos
    const mockupPacientes = {
        "2": {
            esPrincipal: true,
            tienePareja: true,
            sexoBiologico: "femenino",
            objetivo: "ROPA",
            idPareja: "4",
            nombre: "María",
            apellido: "García"
        },
        "4": {
            esPrincipal: false,
            esParejaDe: "1",
            sexoBiologico: "femenino",
            objetivo: "ROPA",
            nombre: "Laura",
            apellido: "Martínez"
        },
        "5": {
            esPrincipal: true,
            tienePareja: true,
            sexoBiologico: "femenino",
            objetivo: "gametos-propios",
            idPareja: "3",
            nombre: "Ana",
            apellido: "López"
        },
        "3": {
            esPrincipal: false,
            esParejaDe: "5",
            sexoBiologico: "masculino",
            objetivo: "gametos-propios",
            nombre: "Carlos",
            apellido: "Rodríguez"
        },
        "6": {
            esPrincipal: true,
            tienePareja: true,
            sexoBiologico: "femenino",
            objetivo: "donante",
            idPareja: "7",
            nombre: "Sofía",
            apellido: "Fernández"
        },
        "7": {
            esPrincipal: false,
            esParejaDe: "6",
            sexoBiologico: "femenino",
            objetivo: "donante",
            nombre: "Paula",
            apellido: "Torres"
        },
        "1": {
            esPrincipal: true,
            tienePareja: false,
            sexoBiologico: "femenino",
            objetivo: "preservacion",
            nombre: "Elena",
            apellido: "Ruiz"
        }
    }

    // Determinar qué formularios mostrar según el contexto
    const [mostrarFormularios, setMostrarFormularios] = useState({
        ginecologicos: true,
        genitales: false,
        datosCompletos: true
    })

    useEffect(() => {
        // Obtener datos del paciente actual
        const paciente = mockupPacientes[id]
        
        if (!paciente) {
            console.error("Paciente no encontrado")
            return
        }

        setPacienteActual(paciente)

        // Determinar si es pareja
        setEsPareja(!paciente.esPrincipal)
        
        if (paciente.esPrincipal && paciente.tienePareja) {
            setTienePareja(true)
            const pareja = mockupPacientes[paciente.idPareja]
            setDatosPareja(pareja)
        }

        // Configurar qué formularios mostrar
        configurarFormularios(paciente)
    }, [id])

    const configurarFormularios = (paciente) => {
        let config = {
            ginecologicos: false,
            genitales: false,
            datosCompletos: true
        }

        // Si es el paciente principal (mujer que busca embarazo)
        if (paciente.esPrincipal) {
            config.ginecologicos = true
            config.datosCompletos = true
        }
        // Si es pareja
        else {
            const pacientePrincipal = mockupPacientes[paciente.esParejaDe]
            
            // Pareja masculina
            if (paciente.sexoBiologico === "masculino") {
                config.genitales = true
                config.datosCompletos = true
            }
            // Pareja femenina
            else if (paciente.sexoBiologico === "femenino") {
                // Método ROPA: mismos datos que la mujer principal
                if (pacientePrincipal.objetivo === "ROPA") {
                    config.ginecologicos = true
                    config.datosCompletos = true
                }
                // No es ROPA: solo datos personales
                else {
                    config.datosCompletos = false
                }
            }
        }

        setMostrarFormularios(config)
    }

    const [antecedentesGenitales, setAntecedentesGenitales] = useState({
        antecedentesUrologicos: '',
        estudiosEsperma: ''
    })
    const [antecedentesGenitalesCache, setAntecedentesGenitalesCache] = useState({})
    const [editGen, setEditGen] = useState(false)

    const handleAntecedentesGenitalesChange = (field, value) => {
        setAntecedentesGenitales(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSaveAntecedentesGenitales = () => {
        console.log("Antecedentes genitales guardados:", antecedentesGenitales)
        setAntecedentesGenitalesCache(antecedentesGenitales)
        setEditGen(false)
    }

    const handleCancelEditGenitales = () => {
        setAntecedentesGenitales(antecedentesGenitalesCache)
        setEditGen(false)
    }

    // Datos personales de pareja
    const [datosPersonalesPareja, setDatosPersonalesPareja] = useState({
        nombre: '',
        apellido: '',
        sexoBiologico: '',
        ocupacion: '',
        telefono: '',
        email: '',
        dni: '',
        obraSocial: '',
        nroSocio: '',
        fechaNacimiento: ''
    })
    const [datosPersonalesParejaCache, setDatosPersonalesParejaCache] = useState({})
    const [editDP, setEditDP] = useState(false)
    const [cargandoObras, setCargandoObras] = useState(false)
    const [obrasSociales, setObrasSociales] = useState([])
    const [obraSocialSeleccionada, setObraSocialSeleccionada] = useState(null)

    useEffect(() => {
        setCargandoObras(true)
        pagosApi.getObrasSociales().then(data => {
            const nuevasObras = data.map(os => ({
                value: os.nombre,
                label: os?.sigla ? os.sigla : os.nombre
            }))
            setObrasSociales(nuevasObras)
        }).catch(err => {
            console.error("ERROR AL CARGAR OBRAS SOCIALES", err)
        }).finally(() => {
            setCargandoObras(false)
        })
    }, [])

    const handleDatosPersonalesParejaChange = (field, value) => {
        setDatosPersonalesPareja(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSaveDatosPersonalesPareja = () => {
        console.log("Datos personales pareja guardados:", datosPersonalesPareja)
        setDatosPersonalesParejaCache(datosPersonalesPareja)
        setEditDP(false)
    }

    const handleCancelEditDatosPersonalesPareja = () => {
        setDatosPersonalesPareja(datosPersonalesParejaCache)
        setEditDP(false)
    }

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
    const addQuirurgico = (item)=>{
        if (!item) return
        
        // Extraer el label del item devuelto por la API
        const termino = typeof item === "string" ? item : (item.label ?? item.value ?? item.termino)
        
        if (!termino) return
        
        // Evitar duplicados
        setQuirurgicoSelected(prev => {
            return prev.includes(termino) ? prev : [...prev, termino]
        })
    }

    return (
        <DashboardLayout role="medico">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Gestionar Historial Clinico</h1>
                    {pacienteActual && (
                        <p className="text-muted-foreground mt-2">
                            {pacienteActual.nombre} {pacienteActual.apellido} 
                            {esPareja && " (Pareja)"}
                        </p>
                    )}
                </div>

                {esPareja && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-2xl gap-2">
                                <User className="h-6 w-6" />
                                Datos Personales de la Pareja
                            </CardTitle>
                            <CardDescription>
                                Información básica requerida para el historial
                            </CardDescription>
                            <Separator/>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre" className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Nombre
                                    </Label>
                                    {editDP ? (
                                        <Input
                                            id="nombre"
                                            value={datosPersonalesPareja.nombre || ''}
                                            onChange={(e) => handleDatosPersonalesParejaChange('nombre', e.target.value)}
                                            placeholder="Ingrese el nombre"
                                        />
                                    ) : (
                                        <p className="text-sm pl-6 text-muted-foreground">
                                            {datosPersonalesPareja.nombre || 'No registrado'}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="apellido" className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Apellido
                                    </Label>
                                    {editDP ? (
                                        <Input
                                            id="apellido"
                                            value={datosPersonalesPareja.apellido || ''}
                                            onChange={(e) => handleDatosPersonalesParejaChange('apellido', e.target.value)}
                                            placeholder="Ingrese el apellido"
                                        />
                                    ) : (
                                        <p className="text-sm pl-6 text-muted-foreground">
                                            {datosPersonalesPareja.apellido || 'No registrado'}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dni" className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        DNI
                                    </Label>
                                    {editDP ? (
                                        <Input
                                            id="dni"
                                            value={datosPersonalesPareja.dni || ''}
                                            onChange={(e) => handleDatosPersonalesParejaChange('dni', e.target.value)}
                                            placeholder="Ingrese el DNI"
                                        />
                                    ) : (
                                        <p className="text-sm pl-6 text-muted-foreground">
                                            {datosPersonalesPareja.dni || 'No registrado'}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sexoBiologico" className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Sexo Biológico
                                    </Label>
                                    {editDP ? (
                                        <Select
                                            value={datosPersonalesPareja.sexoBiologico || ''}
                                            onValueChange={(value) => handleDatosPersonalesParejaChange('sexoBiologico', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione sexo biológico" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="femenino">Femenino</SelectItem>
                                                <SelectItem value="masculino">Masculino</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <p className="text-sm pl-6 text-muted-foreground capitalize">
                                            {datosPersonalesPareja.sexoBiologico || 'No registrado'}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fechaNacimiento" className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Fecha de Nacimiento
                                    </Label>
                                    {editDP ? (
                                        <Input
                                            id="fechaNacimiento"
                                            type="date"
                                            value={datosPersonalesPareja.fechaNacimiento || ''}
                                            onChange={(e) => handleDatosPersonalesParejaChange('fechaNacimiento', e.target.value)}
                                        />
                                    ) : (
                                        <p className="text-sm pl-6 text-muted-foreground">
                                            {datosPersonalesPareja.fechaNacimiento || 'No registrado'}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ocupacion" className="flex items-center gap-2">
                                        <Activity className="h-4 w-4" />
                                        Ocupación
                                    </Label>
                                    {editDP ? (
                                        <Input
                                            id="ocupacion"
                                            value={datosPersonalesPareja.ocupacion || ''}
                                            onChange={(e) => handleDatosPersonalesParejaChange('ocupacion', e.target.value)}
                                            placeholder="Ingrese la ocupación"
                                        />
                                    ) : (
                                        <p className="text-sm pl-6 text-muted-foreground">
                                            {datosPersonalesPareja.ocupacion || 'No registrado'}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="telefono" className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        Teléfono
                                    </Label>
                                    {editDP ? (
                                        <Input
                                            id="telefono"
                                            value={datosPersonalesPareja.telefono || ''}
                                            onChange={(e) => handleDatosPersonalesParejaChange('telefono', e.target.value)}
                                            placeholder="Ingrese el teléfono"
                                        />
                                    ) : (
                                        <p className="text-sm pl-6 text-muted-foreground">
                                            {datosPersonalesPareja.telefono || 'No registrado'}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Email
                                    </Label>
                                    {editDP ? (
                                        <Input
                                            id="email"
                                            type="email"
                                            value={datosPersonalesPareja.email || ''}
                                            onChange={(e) => handleDatosPersonalesParejaChange('email', e.target.value)}
                                            placeholder="ejemplo@email.com"
                                        />
                                    ) : (
                                        <p className="text-sm pl-6 text-muted-foreground">
                                            {datosPersonalesPareja.email || 'No registrado'}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="obraSocial" className="flex items-center gap-2">
                                        <Heart className="h-4 w-4" />
                                        Obra Social
                                    </Label>
                                    {editDP ? (
                                        <Combobox 
                                            id='obraSocial' 
                                            datas={obrasSociales} 
                                            disabled={cargandoObras} 
                                            title={cargandoObras ? "Cargando obras sociales..." : "Elegi una obra social"}
                                            value={obraSocialSeleccionada}
                                            onSelect={(value) => {
                                                setObraSocialSeleccionada(value)
                                                handleDatosPersonalesParejaChange('obraSocial', value)
                                            }}
                                            className="w-full"
                                        />
                                    ) : (
                                        <p className="text-sm pl-6 text-muted-foreground">
                                            {datosPersonalesPareja.obraSocial || 'No registrado'}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nroSocio" className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Número de Socio
                                    </Label>
                                    {editDP ? (
                                        <Input
                                            id="nroSocio"
                                            value={datosPersonalesPareja.nroSocio || ''}
                                            onChange={(e) => handleDatosPersonalesParejaChange('nroSocio', e.target.value)}
                                            placeholder="Número de socio"
                                        />
                                    ) : (
                                        <p className="text-sm pl-6 text-muted-foreground">
                                            {datosPersonalesPareja.nroSocio || 'No registrado'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                            {editDP ? (
                                <>
                                    <Button onClick={handleSaveDatosPersonalesPareja} variant="default" className="flex-1">
                                        Guardar Cambios
                                    </Button>
                                    <Button onClick={handleCancelEditDatosPersonalesPareja} variant="outline" className="flex-1">
                                        Cancelar
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={() => setEditDP(true)} variant="action" className="w-full">
                                    {Object.values(datosPersonalesPareja).some(val => val !== null && val !== '') 
                                        ? 'Editar información' 
                                        : 'Agregar información'}
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                )}

                {mostrarFormularios.datosCompletos && (
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex text-2xl items-center gap-2">
                                    Antecedentes Quirurgicos
                                </CardTitle>
                                <Separator/>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2 w-full">
                                    <Label className={"text-muted-foregroun/50 ml-5px"} htmlFor="antecedentesSelect">Busca y agrega antecedentes quirúrgicos</Label>
                                    <SearchAntecedentes agregar={addQuirurgico}/>
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
                        
                        {mostrarFormularios.ginecologicos && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center text-2xl gap-2">
                                        Antecedentes Ginecológicos
                                    </CardTitle>
                                    <Separator/>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4 flex gap-5 flex-col">
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
                                        

                                        <div className="space-y-3 bg-accent/10 p-2 rounded-2xl">
                                            <Label className="text-sm font-semibold">
                                                Historial Obstétrico (G-P-AB-ST)
                                            </Label>
                                            
                                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                        )}

                        {mostrarFormularios.genitales && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center text-2xl gap-2">
                                        Antecedentes Genitales
                                    </CardTitle>
                                    <Separator/>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4 flex gap-5 flex-col">
                                        {/* Antecedentes Urológicos */}
                                        <div className="space-y-2 bg-accent/10 p-2 rounded-2xl">
                                            <Label htmlFor="antecedentesUrologicos" className="text-sm font-semibold">
                                                Antecedentes Urológicos
                                            </Label>
                                            {editGen ? (
                                                <Textarea
                                                    id="antecedentesUrologicos"
                                                    value={antecedentesGenitales.antecedentesUrologicos || ''}
                                                    onChange={(e) => handleAntecedentesGenitalesChange('antecedentesUrologicos', e.target.value)}
                                                    placeholder="Ej: Varicocele, criptorquidia, infecciones, cirugías previas..."
                                                    rows={3}
                                                />
                                            ) : (
                                                <p className="text-sm pl-6 text-muted-foreground">
                                                    {antecedentesGenitales.antecedentesUrologicos || 'No registrado'}
                                                </p>
                                            )}
                                        </div>

                                        {/* Estudios de Esperma */}
                                        <div className="space-y-2 bg-accent/10 p-2 rounded-2xl">
                                            <Label htmlFor="estudiosEsperma" className="text-sm font-semibold">
                                                Estudios de Esperma (Espermatograma)
                                            </Label>
                                            {editGen ? (
                                                <Textarea
                                                    id="estudiosEsperma"
                                                    value={antecedentesGenitales.estudiosEsperma || ''}
                                                    onChange={(e) => handleAntecedentesGenitalesChange('estudiosEsperma', e.target.value)}
                                                    placeholder="Resultados de espermatograma, concentración, movilidad, morfología..."
                                                    rows={4}
                                                />
                                            ) : (
                                                <p className="text-sm pl-6 text-muted-foreground">
                                                    {antecedentesGenitales.estudiosEsperma || 'No registrado'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex gap-2">
                                    {editGen ? (
                                        <>
                                            <Button onClick={handleSaveAntecedentesGenitales} variant="default" className="flex-1">
                                                Guardar Cambios
                                            </Button>
                                            <Button onClick={handleCancelEditGenitales} variant="outline" className="flex-1">
                                                Cancelar
                                            </Button>
                                        </>
                                    ) : (
                                        <Button onClick={() => setEditGen(true)} variant="action" className="w-full">
                                            {Object.values(antecedentesGenitales).some(val => val !== null && val !== '') 
                                                ? 'Editar información' 
                                                : 'Agregar información'}
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex text-2xl items-center gap-2">
                                    Hábitos
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
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
            
                        <Card>
                            <CardContent>
                                <FamilyTree patientName={pacienteActual ? `${pacienteActual.nombre} ${pacienteActual.apellido}` : "Paciente"} />
                            </CardContent>
                        </Card>        
                    </>
                )}
            </div>
        </DashboardLayout>
    )
}
