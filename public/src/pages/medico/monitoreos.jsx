export function Monitoreos(){
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
    return(
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
    )
}