"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Ban,X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Combobox } from "@/components/ui/combobox"
import { ShortInfo } from "@/components/ui/info-short"
export default function StudiesRequestPage({paciente = {nombre:'paciente ej'}}) {

    const EstudiosPedidos = [
        {
            titulo: "Radiografía de tórax",
            resultados: [
                { "Hallazgos": "Sin alteraciones" },
                { "Fecha": "20/11/2025" }
            ]
        },
        {
            titulo: "Hemograma completo",
            resultados: [
                { "Glóbulos rojos": "4.8 M/µL" },
                { "Glóbulos blancos": "7.2 K/µL" },
                { "Hemoglobina": "14.2 g/dL" },
                { "Hemoglobina": "14.2 g/dL" },
                { "Hemoglobina": "14.2 g/dL" },
                { "Hemoglobina": "14.2 g/dL" },
                { "Hemoglobina": "14.2 g/dL" },
                { "Hemoglobina": "14.2 g/dL" },
                { "Hemoglobina": "14.2 g/dL" },
                { "Hemoglobina": "14.2 g/dL" },
                { "Hemoglobina": "14.2 g/dL" },
                { "Hemoglobina": "14.2 g/dL" },
                { "Hemoglobina": "14.2 g/dL" },
                { "Hemoglobina": "14.2 g/dL" },
                { "Hemoglobina": "14.2 g/dL" },
                { "Hemoglobina": "14.2 g/dL" },
                { "Hemoglobina": "14.2 g/dL" },
                { "Hemoglobina": "14.2 g/dL" },
                { "Hemoglobina": "14.2 g/dL" },
                { "Hemoglobina": "14.2 g/dL" },
                { "Hemoglobina": "14.2 g/dL" },
                { "Hemoglobina": "14.2 g/dL" },
                { "Hemoglobina": "14.2 g/dL" }
            ]
        },

        {
            titulo: "Ecografía abdominal",
            resultados: [] // No hay resultados aún
        }
    ]

    const [estudiosSelected, setestudiosSelected] = useState([])

    const [estudiosPedidos, setEstudiosPedidos] = useState(EstudiosPedidos)
    const [expandedResults, setExpandedResults] = useState({})
    const [showAddResult, setShowAddResult] = useState(null)
    const [newResultKey, setNewResultKey] = useState("")
    const [newResultValue, setNewResultValue] = useState("")


    const Estudios = [
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

    

    const handleEliminarEstudios = (index) => {
        setestudiosSelected(prev => prev.filter((_, i) => i !== index))
    }
    const addEstudios = (currentValue)=>{
        if (!currentValue) return
        setestudiosSelected(prev => {
            const next = typeof currentValue === "string" ? currentValue : (currentValue.label ?? currentValue.value)
            if (!next) return prev
            return prev.includes(next) ? prev : [...prev, next]
        })
    }
    const handleShowAddResult = (index) => {
        setShowAddResult(index)
        setNewResultKey("")
        setNewResultValue("")
    }
    const handleAddResult = (index) => {
        if (!newResultKey.trim() || !newResultValue.trim()) return
        setEstudiosPedidos(prev => {
            const nuevos = [...prev]
            nuevos[index] = {
                ...nuevos[index],
                resultados: [
                    ...nuevos[index].resultados,
                    { [newResultKey]: newResultValue }
                ]
            }
            return nuevos
        })
        setShowAddResult(null)
        setNewResultKey("")
        setNewResultValue("")
    }
    const toggleExpand = (index) => {
        setExpandedResults(prev => ({
            ...prev,
            [index]: !prev[index]
        }))
    }
  return (
    <DashboardLayout role="medico">
        <div className="space-y-6">

            <div>
            <h2 className="text-3xl font-bold uppercase tracking-tight text-foreground">Gestion de estudios</h2>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex text-2xl uppercase items-center gap-2">
                            Pedir Estudios a <span className="text-primary">{paciente.nombre}</span> 
                        </CardTitle>
                        <Separator/>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 w-full">
                            <Label className={"text-muted-foregroun/50 ml-px"} htmlFor="estudiosSelected">Lista de estudios comunes</Label>
                            <Combobox id='estudiosSelected' datas={Estudios} title="Elegi un estudio" action={addEstudios} className="w-full"/>
                        </div>
                        <div className="flex flex-wrap gap-3 ">
                            {(estudiosSelected && estudiosSelected.length != 0)? (estudiosSelected.map((q, index) => (
                                <div key={index} className="flex w-1/4 justify-between items-center p-3 border rounded-lg">
                                    <span className="text-sm uppercase font-bold mt-1.5">{q}</span>
                                    <X onClick={()=>handleEliminarEstudios(index)} className="cursor-pointer"/>
                                </div>
                            ))):(
                                <div className="flex text-chart-3 gap-5 items-center w-full ">
                                    <Ban size={20}/>
                                    <h1>No hay estudios pedidos aun</h1>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className={'w-full'}>
                        {(estudiosSelected && estudiosSelected.length != 0) &&(
                            <Button>Pedir Estudios</Button>
                        )}
                    </CardFooter>
                </Card>   

                
                <Card className={'rounded-none'}>
                    <CardHeader>
                        <CardTitle className="flex uppercase text-2xl items-center gap-2">
                            Lista de estudios pedidos
                        </CardTitle>
                    </CardHeader>
                    <Separator/>
                    <CardContent className="space-y-4 ">
                        {estudiosPedidos.map((estudio, i) => {
                            const mostrarTodos = expandedResults[i]
                            const tieneMuchosResultados = estudio.resultados.length > 3
                            const resultadosMostrados = mostrarTodos ? estudio.resultados : estudio.resultados.slice(0, 3)
                            return (
                                <div
                                    key={i}
                                    className="group flex flex-col bg-card-list rounded-lg border p-4 shadow-inset-custom hover:shadow-md transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-lg text-foreground">{estudio.titulo}</p>
                                        </div>
                                        {estudio.resultados.length === 0 && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="ml-2"
                                                onClick={() => handleShowAddResult(i)}
                                            >
                                                Cargar resultados
                                            </Button>
                                        )}
                                        {estudio.resultados.length > 0 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="ml-2"
                                                onClick={() => handleShowAddResult(i)}
                                            >
                                                Agregar resultado
                                            </Button>
                                        )}
                                    </div>
                                    {estudio.resultados.length > 0 ? (
                                        <div className="mt-2 space-y-1">
                                            {resultadosMostrados.map((res, idx) => {
                                                const clave = Object.keys(res)[0]
                                                const valor = res[clave]
                                                return (
                                                    <div key={idx} className="flex items-center gap-2 pl-2">
                                                        <Label className="text-muted-foreground text-sm">{clave}:</Label>
                                                        <span className="font-medium text-primary">{valor}</span>
                                                    </div>
                                                )
                                            })}
                                            {tieneMuchosResultados && !mostrarTodos && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="mt-2 text-primary"
                                                    onClick={() => toggleExpand(i)}
                                                >
                                                    Ver más
                                                </Button>
                                            )}
                                            {tieneMuchosResultados && mostrarTodos && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="mt-2 text-primary"
                                                    onClick={() => toggleExpand(i)}
                                                >
                                                    Ver menos
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="mt-2 text-sm text-muted-foreground">Aún no se han cargado resultados.</p>
                                    )}

                                    {showAddResult === i && (
                                        <div className="mt-4 bg-muted p-3 rounded-lg flex flex-col gap-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Clave"
                                                    className="border rounded px-2 py-1 w-1/3"
                                                    value={newResultKey}
                                                    onChange={e => setNewResultKey(e.target.value)}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Valor"
                                                    className="border rounded px-2 py-1 w-2/3"
                                                    value={newResultValue}
                                                    onChange={e => setNewResultValue(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex gap-2 mt-2">
                                                <Button size="sm" onClick={() => handleAddResult(i)}>
                                                    Guardar
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => setShowAddResult(null)}>
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                        </CardContent>
                </Card>
          
            </div>
        </div>
    </DashboardLayout>
  )
}
