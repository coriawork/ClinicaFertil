import { useEffect, useState } from "react"
import { useNavigate, Link, useParams } from "react-router-dom"
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
import axios from "axios"
import { toast } from "sonner"

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
    const {id} = useParams()
    const { user } = useAuth()

    const pacientesEJ = [
        {
            id: '1',
            nombre: 'Juan Perez',
            dni: '12345678'
        },
        {
            id: '2',
            nombre: 'Maria Gomez',
            dni: '87654321'
        },
        {
            id: '3',
            nombre: 'Carlos Rodriguez',
            dni: '11223344'
        }
    ]

    const getUserById = (id) => {
        return pacientesEJ.find(p => p.id === id) || {nombre: 'Paciente Ejemplo', dni: '00000000'}
    }

    const [estudiosSelected, setestudiosSelected] = useState([])
    const [estudiosPedidos, setEstudiosPedidos] = useState(EstudiosPedidos)
    const [expandedResults, setExpandedResults] = useState({})
    const [showAddResult, setShowAddResult] = useState(null)
    const [newResultKey, setNewResultKey] = useState("")
    const [newResultValue, setNewResultValue] = useState("")
    const [estudisoFetch, setEstudiosFetch] = useState([])
    const [Estudios, setEstudios] = useState([])
    const [loadingEstudios, setLoadingEstudios] = useState(true)
    const [loadingPedido, setLoadingPedido] = useState(false)

    //? Manejo de la api aca

    const handlePedirEstudios = async () => {
        if (estudiosSelected.length === 0) return;

        setLoadingPedido(true);

        try {
            // Agrupar los estudios seleccionados por tipo_estudio
            const gruposPorTipo = new Map();
            
            estudiosSelected.forEach(estudio => {
                const tipo = estudio.tipo_estudio;
                if (!gruposPorTipo.has(tipo)) {
                    gruposPorTipo.set(tipo, []);
                }
                gruposPorTipo.get(tipo).push(estudio);
            });

            const usuario = getUserById(id);
            console.log('medico para los estudios', user);
            console.log('Grupos por tipo:', Array.from(gruposPorTipo.entries()));
            
            // Crear lista de estudios pedidos para el email
            const listaEstudiosPedidos = [];
            
            for (const [tipo_estudio, estudiosDelTipo] of gruposPorTipo.entries()) {
                listaEstudiosPedidos.push({
                    tipo: tipo_estudio.replace('estudios_', ''),
                    estudios: estudiosDelTipo.map(e => e.label)
                });
            }

            // Crear HTML con la lista de estudios
            const listaEstudiosHTML = listaEstudiosPedidos.map(grupo => `
                <li>
                    <strong>${grupo.tipo.charAt(0).toUpperCase() + grupo.tipo.slice(1)}:</strong>
                    <ul style="margin-top: 5px;">
                        ${grupo.estudios.map(estudio => `<li>${estudio}</li>`).join('')}
                    </ul>
                </li>
            `).join('');

            // Enviar email informativo
            const emailPayload = {
                group: 10,
                toEmails: ['manuelcoriaesc@gmail.com'],
                subject: `Nuevos Estudios Solicitados - ${usuario.nombre}`,
                htmlBody: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            body {
                                font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                                background: #e4c8ff;
                                color: #000000;
                                margin: 0;
                                padding: 20px;
                                line-height: 1.6;
                            }
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                background: #fdfdfd;
                                border-radius: 1.4rem;
                                padding: 32px;
                                box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.2);
                            }
                            .email-header {
                                display: flex;
                                align-items: center;
                                gap: 12px;
                                padding: 16px 24px;
                                background: #ffffff;
                                border-bottom: 1px solid #e7e7ee;
                                border-radius: 1.2rem 1.2rem 0 0;
                                margin: -32px -32px 24px -32px;
                            }
                            .logo-circle {
                                width: 40px;
                                height: 40px;
                                background: linear-gradient(180deg, rgba(112, 51, 255, 1) 0%, rgba(54, 0, 181, 1) 100%);
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }
                            .logo-circle svg {
                                width: 20px;
                                height: 20px;
                                fill: #ffffff;
                            }
                            .clinic-name {
                                font-size: 18px;
                                font-weight: 700;
                                color: #000000;
                                margin: 0;
                            }
                            .header {
                                background: linear-gradient(180deg, rgba(112, 51, 255, 1) 0%, rgba(54, 0, 181, 1) 100%);
                                color: #ffffff;
                                padding: 24px;
                                border-radius: 1.2rem;
                                margin-bottom: 24px;
                                text-align: center;
                            }
                            h2 {
                                margin: 0;
                                font-size: 24px;
                                font-weight: 700;
                                text-transform: uppercase;
                                letter-spacing: 0.5px;
                            }
                            .greeting {
                                font-size: 16px;
                                color: #000000;
                                margin-bottom: 16px;
                            }
                            .content {
                                color: #000000;
                                margin-bottom: 20px;
                            }
                            .estudios-list {
                                background: #e2ebff;
                                border: 1px solid #e7e7ee;
                                border-radius: 1rem;
                                padding: 20px;
                                margin: 20px 0;
                            }
                            .estudios-list ul {
                                margin: 10px 0;
                                padding-left: 20px;
                                list-style: none;
                            }
                            .estudios-list li {
                                margin: 8px 0;
                                position: relative;
                                padding-left: 8px;
                            }
                            .estudios-list strong {
                                color: #7033ff;
                                font-weight: 700;
                                text-transform: uppercase;
                                font-size: 14px;
                            }
                            .estudios-list ul ul {
                                margin-top: 8px;
                                padding-left: 16px;
                            }
                            .estudios-list ul ul li {
                                color: #525252;
                                font-size: 14px;
                                padding-left: 12px;
                                border-left: 2px solid #7033ff;
                                margin: 6px 0;
                            }
                            .alert-box {
                                background: linear-gradient(135deg, #7033ff 0%, #8c5cff 100%);
                                color: #ffffff;
                                padding: 20px;
                                border-radius: 1rem;
                                margin: 24px 0;
                                border-left: 4px solid #ffffff;
                            }
                            .alert-box strong {
                                display: block;
                                font-size: 16px;
                                margin-bottom: 8px;
                                text-transform: uppercase;
                                letter-spacing: 0.5px;
                            }
                            .footer {
                                margin-top: 32px;
                                padding-top: 20px;
                                border-top: 1px solid #e7e7ee;
                                color: #525252;
                                font-size: 14px;
                            }
                            .signature {
                                color: #000000;
                                font-weight: 600;
                                margin-top: 16px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="email-header">
                                <h1 class="clinic-name">FertilCare</h1>
                            </div>
                            
                            <div class="header">
                                <h2>Solicitud de Estudios Médicos</h2>
                            </div>
                            
                            <p class="greeting"><strong>Estimado/a ${usuario.nombre},</strong></p>
                            
                            <p class="content">El Dr. ${user.name} ha solicitado los siguientes estudios médicos:</p>
                            
                            <div class="estudios-list">
                                <ul>
                                    ${listaEstudiosHTML}
                                </ul>
                            </div>
                            
                            <div class="alert-box">
                                <strong>Importante:</strong>
                                <p style="margin: 0;">Las órdenes médicas estarán disponibles para descargar desde su perfil en la plataforma.</p>
                            </div>
                            
                            <div class="footer">
                                <p>Saludos cordiales,</p>
                                <p class="signature">Dr. ${user.name}</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            };
            
            const emailResponse = await axios.post(
                '/email/v1/send_email_v2',
                emailPayload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            console.log(`Email enviado con ${listaEstudiosPedidos.length} tipos de estudios:`, emailResponse.status);

            // Limpiar estudios seleccionados después de generar todas las órdenes
            setestudiosSelected([]);
            toast.success("Ordenes enviadas correctamente");
            console.log(`Se generaron ${gruposPorTipo.size} órdenes médicas exitosamente`);

        } catch (error) {
            console.error('Error al pedir estudios:', error);
            toast.error("Error al generar las ordenes o enviar el email");
        } finally {
            setLoadingPedido(false);
        }
    };

    
    useEffect(() => {
        const fetchEstudios = async () => {
            setLoadingEstudios(true)
            const endpoints = [
                { url: 'https://srlgceodssgoifgosyoh.supabase.co/functions/v1/estudio_ginecologico', tipo: 'estudios_ginecologicos' },
                { url: 'https://srlgceodssgoifgosyoh.supabase.co/functions/v1/estudio_hormonales', tipo: 'estudios_hormonales' },
                { url: 'https://srlgceodssgoifgosyoh.supabase.co/functions/v1/get-orden-estudio-prequirurgico', tipo: 'estudios_prequirurgicos' },
                { url: 'https://srlgceodssgoifgosyoh.supabase.co/functions/v1/estudio_semen', tipo: 'estudios_semen' }
            ];

            try {
                const responses = await Promise.all(
                    endpoints.map(endpoint => 
                        fetch(endpoint.url)
                            .then(response => ({ response, tipo: endpoint.tipo }))
                    )
                );

                const dataArrays = await Promise.all(
                    responses.map(async ({ response, tipo }) => {
                        if (!response.ok) {
                            console.warn(`Error en ${response.url}: ${response.status}`);
                            return [];
                        }
                        const data = await response.json();
                        // Marcar cada estudio con su tipo
                        return data.map(estudio => ({ ...estudio, tipo_estudio: tipo }));
                    })
                );

                // Unificar todos los estudios y eliminar duplicados por nombre
                const todosLosEstudios = dataArrays.flat();
                
                // Usar un Map para eliminar duplicados por nombre
                const estudiosUnicos = new Map();
                todosLosEstudios.forEach(estudio => {
                    if (!estudiosUnicos.has(estudio.nombre)) {
                        estudiosUnicos.set(estudio.nombre, {
                            value: `${estudio.nombre.toLowerCase().replace(/\s+/g, '-')}`,
                            label: estudio.nombre,
                            id: estudio.id,
                            tipo_estudio: estudio.tipo_estudio
                        });
                    }
                });

                const estudiosFinales = Array.from(estudiosUnicos.values());

                console.log('Estudios unificados con tipo:', estudiosFinales);
                setEstudios(estudiosFinales);
                
            } catch(e) {
                console.log('Error pidiendo estudios:', e);
            } finally {
                setLoadingEstudios(false)
            }
        };
        fetchEstudios();
    }, [])

    //? Hasta aca manejo de la api
    

    const handleEliminarEstudios = (index) => {
        setestudiosSelected(prev => prev.filter((_, i) => i !== index))
    }

    const addEstudios = (currentValue)=>{
        if (!currentValue) return
        
        // Buscar el estudio completo en la lista de Estudios para obtener su tipo
        const estudioCompleto = Estudios.find(e => 
            e.value === currentValue || 
            e.label === currentValue ||
            (typeof currentValue === 'object' && (e.value === currentValue.value || e.label === currentValue.label))
        )
        
        if (!estudioCompleto) return
        
        setestudiosSelected(prev => {
            // Verificar si ya existe por label
            const yaExiste = prev.some(est => est.label === estudioCompleto.label)
            if (yaExiste) return prev
            
            return [...prev, {
                label: estudioCompleto.label,
                value: estudioCompleto.value,
                id: estudioCompleto.id,
                tipo_estudio: estudioCompleto.tipo_estudio
            }]
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
                                <Combobox
                                    id='estudiosSelected' 
                                    datas={loadingEstudios ? [{value: 'loading', label: 'Cargando estudios...'}] : Estudios} 
                                    title="Elegi un estudio" 
                                    action={addEstudios} 
                                    className="w-full"
                                    disabled={loadingEstudios}
                                 />
                            </div>
                            <div className="flex flex-wrap gap-3 ">
                                {(estudiosSelected && estudiosSelected.length != 0)? (estudiosSelected.map((estudio, index) => (
                                    <div key={index} className="flex w-1/4 justify-between items-center p-3 border rounded-lg">
                                        <div className="flex flex-col">
                                            <span className="text-sm uppercase font-bold">{estudio.label}</span>
                                            <span className="text-xs text-muted-foreground">{estudio.tipo_estudio?.replace('estudios_', '')}</span>
                                        </div>
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
                            {(estudiosSelected && estudiosSelected.length != 0) && (
                                <Button onClick={handlePedirEstudios} disabled={loadingPedido}>
                                    {loadingPedido ? 'Generando orden...' : 'Pedir Estudios'}
                                </Button>
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
