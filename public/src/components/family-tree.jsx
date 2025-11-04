"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, User } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function FamilyTree({ patientName = "Paciente" }) {
    const [relatives, setRelatives] = useState([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingRelative, setEditingRelative] = useState(null)

    const handleAddRelative = (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        const newRelative = {
            id: editingRelative?.id || Date.now().toString(),
            name: formData.get("name"),
            relationship: formData.get("relationship"),
            medicalInfo: formData.get("medicalInfo"),
            generation: Number.parseInt(formData.get("generation")),
            side: formData.get("side"),
        }

        if (editingRelative) {
            setRelatives(relatives.map((r) => (r.id === editingRelative.id ? newRelative : r)))
        } else {
            setRelatives([...relatives, newRelative])
        }

        setIsDialogOpen(false)
        setEditingRelative(null)
        e.currentTarget.reset()
    }

    const handleDeleteRelative = (id) => {
        setRelatives(relatives.filter((r) => r.id !== id))
    }

    const handleEditRelative = (relative) => {
        setEditingRelative(relative)
        setIsDialogOpen(true)
    }

    const getRelativesByGenerationAndSide = (generation, side) => {
        return relatives.filter((r) => r.generation === generation && r.side === side)
    }

    const RelativeCard = ({ relative }) => (
        <div className="relative group">
            <div className="flex flex-col items-center gap-2 p-4 border-2 border-primary/20 rounded-lg bg-card hover:border-primary/40 transition-colors min-w-[160px]">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center space-y-1">
                    <p className="font-semibold text-sm">{relative.name}</p>
                    <p className="text-xs text-muted-foreground">{relative.relationship}</p>
                    {relative.medicalInfo && <p className="text-xs text-muted-foreground line-clamp-2">{relative.medicalInfo}</p>}
                </div>
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button size="icon" variant="secondary" className="h-6 w-6" onClick={() => handleEditRelative(relative)}>
                        <span className="sr-only">Editar</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3"
                        >
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        </svg>
                    </Button>
                    <Button
                        size="icon"
                        variant="destructive"
                        className="h-6 w-6"
                        onClick={() => handleDeleteRelative(relative.id)}
                    >
                        <Trash2 className="h-3 w-3" />
                        <span className="sr-only">Eliminar</span>
                    </Button>
                </div>
            </div>
        </div>
    )

    const paternalGrandparents = getRelativesByGenerationAndSide(-2, "paternal")
    const maternalGrandparents = getRelativesByGenerationAndSide(-2, "maternal")
    const paternalParents = getRelativesByGenerationAndSide(-1, "paternal")
    const maternalParents = getRelativesByGenerationAndSide(-1, "maternal")
    const children = getRelativesByGenerationAndSide(1, "both")

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Árbol Genealógico</h3>
                    <p className="text-sm text-muted-foreground">
                        Visualización de antecedentes familiares por línea paterna y materna
                    </p>
                </div>
                <Dialog
                    open={isDialogOpen}
                    onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (!open) setEditingRelative(null)
                    }}
                >
                    <DialogTrigger asChild>
                        <Button size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Agregar Familiar
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingRelative ? "Editar Familiar" : "Agregar Familiar"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddRelative} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Nombre del familiar"
                                    defaultValue={editingRelative?.name}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="relationship">Relación con el Paciente</Label>
                                <Input
                                    id="relationship"
                                    name="relationship"
                                    placeholder="ej: Abuelo paterno, Madre, Tío materno"
                                    defaultValue={editingRelative?.relationship}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="side">Línea Familiar</Label>
                                <select
                                    id="side"
                                    name="side"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    defaultValue={editingRelative?.side ?? "paternal"}
                                    required
                                >
                                    <option value="paternal">Línea Paterna (lado del padre)</option>
                                    <option value="maternal">Línea Materna (lado de la madre)</option>
                                    <option value="both">Ambas líneas (hijos del paciente)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="generation">Generación</Label>
                                <select
                                    id="generation"
                                    name="generation"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    defaultValue={editingRelative?.generation ?? -1}
                                    required
                                >
                                    <option value="-2">Abuelos (2ª generación anterior)</option>
                                    <option value="-1">Padres/Tíos (1ª generación anterior)</option>
                                    <option value="1">Hijos (1ª generación posterior)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="medicalInfo">Información Médica Relevante</Label>
                                <Textarea
                                    id="medicalInfo"
                                    name="medicalInfo"
                                    placeholder="Enfermedades hereditarias, condiciones médicas relevantes..."
                                    rows={4}
                                    defaultValue={editingRelative?.medicalInfo}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" className="flex-1">
                                    {editingRelative ? "Actualizar" : "Agregar"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsDialogOpen(false)
                                        setEditingRelative(null)
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <ScrollArea className="w-full">
                        <div className="min-w-max pb-4">
                            <div className="flex flex-col items-center gap-6">
                                {/* Abuelos - Split by paternal and maternal */}
                                {(paternalGrandparents.length > 0 || maternalGrandparents.length > 0) && (
                                    <div className="space-y-4">
                                        <p className="text-xs text-center text-muted-foreground font-medium">Abuelos</p>
                                        <div className="flex gap-16 justify-center items-start">
                                            {/* Paternal Grandparents */}
                                            <div className="flex flex-col items-center gap-2">
                                                <p className="text-xs text-blue-600 font-medium mb-2">Línea Paterna</p>
                                                <div className="flex gap-4">
                                                    {paternalGrandparents.map((relative) => (
                                                        <RelativeCard key={relative.id} relative={relative} />
                                                    ))}
                                                    {paternalGrandparents.length === 0 && (
                                                        <div className="min-w-[160px] h-[140px] border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center">
                                                            <p className="text-xs text-muted-foreground">Sin registros</p>
                                                        </div>
                                                    )}
                                                </div>
                                                {paternalGrandparents.length > 0 && (
                                                    <div className="flex justify-center">
                                                        <div className="w-px h-8 bg-blue-300" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Maternal Grandparents */}
                                            <div className="flex flex-col items-center gap-2">
                                                <p className="text-xs text-pink-600 font-medium mb-2">Línea Materna</p>
                                                <div className="flex gap-4">
                                                    {maternalGrandparents.map((relative) => (
                                                        <RelativeCard key={relative.id} relative={relative} />
                                                    ))}
                                                    {maternalGrandparents.length === 0 && (
                                                        <div className="min-w-[160px] h-[140px] border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center">
                                                            <p className="text-xs text-muted-foreground">Sin registros</p>
                                                        </div>
                                                    )}
                                                </div>
                                                {maternalGrandparents.length > 0 && (
                                                    <div className="flex justify-center">
                                                        <div className="w-px h-8 bg-pink-300" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Padres/Tíos - Split by paternal and maternal */}
                                {(paternalParents.length > 0 || maternalParents.length > 0) && (
                                    <div className="space-y-4">
                                        <p className="text-xs text-center text-muted-foreground font-medium">Padres / Tíos</p>
                                        <div className="flex gap-16 justify-center items-start">
                                            {/* Paternal Side */}
                                            <div className="flex flex-col items-center gap-2">
                                                <p className="text-xs text-blue-600 font-medium mb-2">Lado Paterno</p>
                                                <div className="flex gap-4">
                                                    {paternalParents.map((relative) => (
                                                        <RelativeCard key={relative.id} relative={relative} />
                                                    ))}
                                                    {paternalParents.length === 0 && (
                                                        <div className="min-w-[160px] h-[140px] border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center">
                                                            <p className="text-xs text-muted-foreground">Sin registros</p>
                                                        </div>
                                                    )}
                                                </div>
                                                {paternalParents.length > 0 && (
                                                    <div className="flex justify-center">
                                                        <div className="w-px h-8 bg-blue-300" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Maternal Side */}
                                            <div className="flex flex-col items-center gap-2">
                                                <p className="text-xs text-pink-600 font-medium mb-2">Lado Materno</p>
                                                <div className="flex gap-4">
                                                    {maternalParents.map((relative) => (
                                                        <RelativeCard key={relative.id} relative={relative} />
                                                    ))}
                                                    {maternalParents.length === 0 && (
                                                        <div className="min-w-[160px] h-[140px] border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center">
                                                            <p className="text-xs text-muted-foreground">Sin registros</p>
                                                        </div>
                                                    )}
                                                </div>
                                                {maternalParents.length > 0 && (
                                                    <div className="flex justify-center">
                                                        <div className="w-px h-8 bg-pink-300" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* Connecting lines */}
                                        <div className="flex justify-center">
                                            <div className="relative w-64 h-8">
                                                <div className="absolute left-1/4 top-0 w-px h-full bg-blue-300" />
                                                <div className="absolute right-1/4 top-0 w-px h-full bg-pink-300" />
                                                <div className="absolute left-1/4 right-1/4 top-1/2 h-px bg-border" />
                                                <div className="absolute left-1/2 top-1/2 w-px h-1/2 bg-border -translate-x-1/2" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Paciente */}
                                <div className="space-y-2">
                                    <p className="text-xs text-center text-muted-foreground font-medium">Paciente</p>
                                    <div className="flex flex-col items-center gap-2 p-4 border-2 border-primary rounded-lg bg-primary/5 min-w-[160px]">
                                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                                            <User className="w-6 h-6 text-primary-foreground" />
                                        </div>
                                        <p className="font-semibold text-sm">{patientName}</p>
                                    </div>
                                    {children.length > 0 && (
                                        <div className="flex justify-center">
                                            <div className="w-px h-8 bg-border" />
                                        </div>
                                    )}
                                </div>

                                {/* Hijos */}
                                {children.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-xs text-center text-muted-foreground font-medium">Hijos</p>
                                        <div className="flex gap-4 justify-center">
                                            {children.map((relative) => (
                                                <RelativeCard key={relative.id} relative={relative} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {relatives.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <User className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                        <p className="text-sm">No hay familiares registrados</p>
                                        <p className="text-xs">Haz clic en "Agregar Familiar" para comenzar</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
