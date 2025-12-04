
import {useEffect,useState}  from "react"
import { Check, Loader, Circle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Axios } from "axios"
export function SearchAntecedentes({agregar}) {
    const [value, setValue] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false)
    const [antecedentes, setAntecedentes] = useState([])
    const [sinBuscar, setSinBuscar] = useState(true)

    async function buscarAntecedentes(term) {
        try{
            const response = await fetch(`https://stqzgokdxgpqjinrmpfu.supabase.co/functions/v1/search_terminos?q=${term}&page=1&limit=10`, {
                method: 'GET',

            })
            const data = await response.json()
            return data
        }
        catch(error){
            console.error("Error fetching antecedentes:", error)
        }
    }
    function convertirData(Antecedentes){
        const resultado = Antecedentes.map((item) => ({
            value: item,
            label: item
        }))
        console.log('resultado', resultado)
        return resultado
    }

    useEffect(() => {
        if (searchTerm.length === 0) {
            setLoading(false)
            setSinBuscar(true)
            setAntecedentes([])
            return
        }
        if (searchTerm.length > 0 && searchTerm.length % 3 === 0) {
            setSinBuscar(false)
            buscarAntecedentes(searchTerm).then(respuesta => {
                console.log(respuesta)
                setLoading(false)
                setAntecedentes(convertirData(respuesta.rows))
            })
        }
    }, [searchTerm])




    return (
    <Command >
        <CommandInput 
            placeholder={'Buscar antecedentes...'} 
            className={"h-9"}
            onValueChange={setSearchTerm}
            />
       
        <CommandList >
            {
                (loading && !sinBuscar)&& (
                    <div className="w-full flex justify-center items-center py-4">
                        <Loader className="animate-spin h-5 w-5 text-muted-foreground"/>
                    </div>
                )||
                (!loading && antecedentes.length === 0 && !sinBuscar) &&(
                    <CommandEmpty >Informacion no encontrada</CommandEmpty>
                )||
                (sinBuscar) &&(
                    <CommandEmpty >Cada 3 letras se buscan los antecedentes</CommandEmpty>
                )

            }
            <CommandGroup >
                {!loading && antecedentes.map((data) => (
                    <CommandItem
                        key={data.value}
                        value={data.value}
                        className={'cursor-pointer'}
                        onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        agregar(currentValue)
                                        
                        }}
                    >
                        {data.label}
                        <Check       
                            className={cn(
                                "ml-auto ",
                                value === data.value ? "opacity-100" : "opacity-0"
                            )}
                        />
                    </CommandItem>
                ))}
            </CommandGroup>
        </CommandList>
    </Command>)
}