import {Card,CardHeader,CardTitle,CardContent,CardFooter} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Target, Check } from "lucide-react"
import { useState } from "react"

const OBJETIVOS_DISPONIBLES = [
    { id: "gametos_propios", label: "Gametos propios" },
    { id: "esperma_donado", label: "Esperma donado" },
    { id: "ropa", label: "ROPA" }
]

export function Objetivo({objetivo, idPac}){
    const [objetivoAsignado, setObjetivoAsignado] = useState(objetivo)
    const [seleccionado, setSeleccionado] = useState(null)

    const handleAsignar = () => {
        if (seleccionado) {
            setObjetivoAsignado(seleccionado)
            // Aquí podrías guardar en el estado global o localStorage
            console.log(`Objetivo ${seleccionado} asignado al paciente ${idPac}`)
        }
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Target className="h-5 w-5 text-foreground" />
                        <CardTitle className="text-2xl text-foreground">
                            Objetivo
                        </CardTitle>
                    </div>
                    <Separator/>
                </CardHeader>
                <CardContent>
                    {objetivoAsignado ? (
                        <div className="flex items-center gap-3 rounded-lg bg-accent/50 p-4">
                            <Check className="h-5 w-5 text-primary" />
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Objetivo asignado
                                </p>
                                <p className="text-lg font-semibold text-foreground">
                                    {OBJETIVOS_DISPONIBLES.find(obj => obj.id === objetivoAsignado)?.label}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Seleccioná un objetivo para este paciente:
                            </p>
                            <div className="space-y-2">
                                {OBJETIVOS_DISPONIBLES.map((obj) => (
                                    <button
                                        key={obj.id}
                                        onClick={() => setSeleccionado(obj.id)}
                                        className={`w-full rounded-lg border p-3 text-left transition-colors ${
                                            seleccionado === obj.id
                                                ? 'border-primary bg-primary/10'
                                                : 'border-border bg-background hover:bg-accent'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-foreground">{obj.label}</span>
                                            {seleccionado === obj.id && (
                                                <Check className="h-4 w-4 text-primary" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>    
                {!objetivoAsignado && (
                    <CardFooter className="flex w-full items-center gap-2">
                        <Button 
                            onClick={handleAsignar} 
                            disabled={!seleccionado}
                            variant="action"
                            className="w-full"
                        >
                            Asignar objetivo
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </>
    )
}