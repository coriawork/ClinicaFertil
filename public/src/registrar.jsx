import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, AlertCircle, UserPlus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {Link} from "react-router-dom"
import { Combobox } from "@/components/ui/combobox"
import { Separator } from "@/components/ui/separator"


export default function RegistrarPaciente({ onRegistroExitoso, onCancelar }) {
    const obrasSociales = [
        {
            'value': 'osde',
            'label': 'OSDE'
        },
        {
            'value': 'swiss-medical',
            'label': 'Swiss Medical'
        },
        {
            'value': 'galeno',
            'label': 'Galeno'
        },
        {
            'value': 'medicus',
            'label': 'Medicus'
        },
        {
            'value': 'omint',
            'label': 'OMINT'
        },
        {
            'value': 'osecac',
            'label': 'OSECAC'
        },
        {
            'value': 'osperyh',
            'label': 'OSPERYH '
        },
        {
            'value': 'osde-binario',
            'label': 'OSDE Binario'
        },
        {
            'value': 'accord-salud',
            'label': 'Accord Salud'
        },
        {
            'value': 'federada-salud',
            'label': 'Federada Salud'
        },
        {
            'value': 'ospe',
            'label': 'OSPE'
        },
        {
            'value': 'sancor-salud',
            'label': 'Sancor Salud'
        },
        {
            'value': 'osmedica',
            'label': 'OSMEDICA'
        },
        {
            'value': 'aca-salud',
            'label': 'ACA Salud'
        },
        {
            'value': 'amffa',
            'label': 'AMFFA'
        },
        {
            'value': 'opdea',
            'label': 'OPDEA'
        },
        {
            'value': 'osuthgra',
            'label': 'OSUTHGRA'
        },
        {
            'value': 'osmata',
            'label': 'OSMATA'
        },
        {
            'value': 'ospoce',
            'label': 'OSPOCE'
        },
        {
            'value': 'osplad',
            'label': 'OSPLAD'
        },
        {
            'value': 'pami',
            'label': 'PAMI'
        },
        {
            'value': 'ioma',
            'label': 'IOMA'
        },
        {
            'value': 'avalian',
            'label': 'Avalian'
        },
        {
            'value': 'osdepym',
            'label': 'OSDEPYM'
        },
        {
            'value': 'particular',
            'label': 'Particular (sin obra social)'
        }
    ]
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        sexoBiologico: "",
        ocupacion: "",
        telefono: "",
        email: "",
        dni: "",
        fechaNacimiento: "",
        numeroSocioObraSocial: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState({})

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido"
        if (!formData.apellido.trim()) newErrors.apellido = "El apellido es requerido"
        if (!formData.sexoBiologico) newErrors.sexoBiologico = "El sexo biológico es requerido"
        if (!formData.ocupacion.trim()) newErrors.ocupacion = "La ocupación es requerida"
        if (!formData.telefono.trim()) newErrors.telefono = "El teléfono es requerido"
        if (!formData.email.trim()) newErrors.email = "El email es requerido"
        if (!formData.dni.trim()) newErrors.dni = "El DNI es requerido"
        if (!formData.fechaNacimiento) newErrors.fechaNacimiento = "La fecha de nacimiento es requerida"
        if (!formData.numeroSocioObraSocial.trim()) newErrors.numeroSocioObraSocial = "El número de socio es requerido"

        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = "Formato de email inválido"
        }

        // Validación de DNI (solo números)
        const dniRegex = /^\d{7,8}$/
        if (formData.dni && !dniRegex.test(formData.dni)) {
            newErrors.dni = "DNI debe tener 7 u 8 dígitos"
        }

        // Validación de teléfono
        const telefonoRegex = /^\d{10,15}$/
        if (formData.telefono && !telefonoRegex.test(formData.telefono)) {
            newErrors.telefono = "Teléfono debe tener entre 10 y 15 dígitos"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        try {
            // Aca iría la llamada a la API para registrar el paciente
            // const response = await registrarPaciente(formData)
            
            // Simulación de registro exitoso
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            toast({
                title: "Registro exitoso",
                description: "El paciente ha sido registrado correctamente",
            })

            // Llamar al callback de registro exitoso
            if (onRegistroExitoso) {
                onRegistroExitoso(formData)
            }

        } catch (error) {
            toast({
                title: "Error en el registro",
                description: "No se pudo registrar el paciente. Intente nuevamente.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="space-y-4 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                        <UserPlus className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl">Registro de Paciente</CardTitle>
                        <CardDescription>Complete los datos personales para continuar con la solicitud de turno</CardDescription>
                    </div>
                </CardHeader>
                
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nombre y Apellido */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nombre">Nombre </Label>
                                <Input
                                    id="nombre"
                                    placeholder="Ingrese su nombre"
                                    value={formData.nombre}
                                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                                    disabled={isSubmitting}
                                    className={errors.nombre ? "border-destructive" : ""}
                                />
                                {errors.nombre && (
                                    <div className="flex items-center gap-1 text-sm text-destructive">
                                        <AlertCircle className="h-3 w-3" />
                                        <span>{errors.nombre}</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="apellido">Apellido </Label>
                                <Input
                                    id="apellido"
                                    placeholder="Ingrese su apellido"
                                    value={formData.apellido}
                                    onChange={(e) => handleInputChange('apellido', e.target.value)}
                                    disabled={isSubmitting}
                                    className={errors.apellido ? "border-destructive" : ""}
                                />
                                {errors.apellido && (
                                    <div className="flex items-center gap-1 text-sm text-destructive">
                                        <AlertCircle className="h-3 w-3" />
                                        <span>{errors.apellido}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* DNI y Fecha de Nacimiento */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dni">DNI </Label>
                                <Input
                                    id="dni"
                                    placeholder="12345678"
                                    value={formData.dni}
                                    onChange={(e) => handleInputChange('dni', e.target.value)}
                                    disabled={isSubmitting}
                                    className={errors.dni ? "border-destructive" : ""}
                                />
                                {errors.dni && (
                                    <div className="flex items-center gap-1 text-sm text-destructive">
                                        <AlertCircle className="h-3 w-3" />
                                        <span>{errors.dni}</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="fechaNacimiento">Fecha de Nacimiento </Label>
                                <Input
                                    id="fechaNacimiento"
                                    type="date"
                                    value={formData.fechaNacimiento}
                                    onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                                    disabled={isSubmitting}
                                    className={errors.fechaNacimiento ? "border-destructive" : ""}
                                />
                                {errors.fechaNacimiento && (
                                    <div className="flex items-center gap-1 text-sm text-destructive">
                                        <AlertCircle className="h-3 w-3" />
                                        <span>{errors.fechaNacimiento}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Separator/>
                        {/* Ocupación y Sexo Biologico*/}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                    
                            <div className="space-y-2">
                                <Label htmlFor="ocupacion">Ocupación </Label>
                                <Input
                                    id="ocupacion"
                                    placeholder="Ingrese su ocupación"
                                    value={formData.ocupacion}
                                    onChange={(e) => handleInputChange('ocupacion', e.target.value)}
                                    disabled={isSubmitting}
                                    className={errors.ocupacion ? "border-destructive" : ""}
                                />
                                {errors.ocupacion && (
                                    <div className="flex items-center gap-1 text-sm text-destructive">
                                        <AlertCircle className="h-3 w-3" />
                                        <span>{errors.ocupacion}</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="sexoBiologico">Sexo Biológico </Label>
                                <Select 
                                    value={formData.sexoBiologico} 
                                    onValueChange={(value) => handleInputChange('sexoBiologico', value)}
                                    disabled={isSubmitting}
                                    
                                >
                                    <SelectTrigger className={errors.sexoBiologico ? "border-destructive" : ""}>
                                        <SelectValue placeholder="Seleccione su sexo biológico" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="femenino">Femenino</SelectItem>
                                        <SelectItem value="masculino">Masculino</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.sexoBiologico && (
                                    <div className="flex items-center gap-1 text-sm text-destructive">
                                        <AlertCircle className="h-3 w-3" />
                                        <span>{errors.sexoBiologico}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                                
                        {/* Obra social */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="telefono">Teléfono </Label>
                                <Input
                                    id="telefono"
                                    placeholder="1123456789"
                                    value={formData.telefono}
                                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                                    disabled={isSubmitting}
                                    className={errors.telefono ? "border-destructive" : ""}
                                />
                                {errors.telefono && (
                                    <div className="flex items-center gap-1 text-sm text-destructive">
                                        <AlertCircle className="h-3 w-3" />
                                        <span>{errors.telefono}</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="email">Email </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="ejemplo@email.com"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    disabled={isSubmitting}
                                    className={errors.email ? "border-destructive" : ""}
                                />
                                {errors.email && (
                                    <div className="flex items-center gap-1 text-sm text-destructive">
                                        <AlertCircle className="h-3 w-3" />
                                        <span>{errors.email}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator/>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                           
                            <div className="space-y-2">
                                <Label htmlFor="numeroSocioObraSocial">Número de Socio de Obra Social </Label>
                                <Input
                                    id="numeroSocioObraSocial"
                                    placeholder="Ingrese su número de socio"
                                    value={formData.numeroSocioObraSocial}
                                    onChange={(e) => handleInputChange('numeroSocioObraSocial', e.target.value)}
                                    disabled={isSubmitting}
                                    className={errors.numeroSocioObraSocial ? "border-destructive" : ""}
                                />
                                {errors.numeroSocioObraSocial && (
                                    <div className="flex items-center gap-1 text-sm text-destructive">
                                        <AlertCircle className="h-3 w-3" />
                                        <span>{errors.numeroSocioObraSocial}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 w-full">
                                <Label className={"text-muted-foregroun/50 ml-5px"} htmlFor="obras">Selecciona particular si no tenes obra social </Label>
                                <Combobox id='obras' datas={obrasSociales} title="Elegi una obra social" className="w-full"/>
                            </div>
                        </div>


                        {/* Botones */}
                        <div className="flex gap-4 pt-4">
                            <Link to="/" className=" flex-1 text-sm text-muted-foreground hover:text-primary">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={onCancelar}
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </Button>
                            </Link>
                            <Button 
                                type="submit" 
                                className="flex-1" 
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Registrando..." : "Registrar Paciente"}
                            </Button>
                        </div>

                     
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}