"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


export function Combobox({datas,title='elegi alguna opcion',disabled = false,action=()=>{},className,initialValue=""}) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState(initialValue)

    // Actualizar el valor cuando cambia initialValue
    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    return (
        <Popover open={open} className='' onOpenChange={setOpen}>
            <PopoverTrigger className={'w-full '+className} asChild>
                {(!disabled && (<Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className=" justify-between"
                >
                    {value
                    ? datas.find((data) => data.value === value)?.label
                    : title}
                    <ChevronsUpDown className="opacity-50" />
                </Button>))|| (disabled && (
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="justify-between text-muted-foreground hover:text-muted-foreground cursor-not-allowed"
                    >
                        {value
                        ? datas.find((data) => data.value === value)?.label
                        : title}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                ))}

            </PopoverTrigger>
            {!disabled && (<PopoverContent className={"p-0"}>
                <Command >
                    <CommandInput placeholder={title} className={"h-9"} />
                    <CommandList >
                        <CommandEmpty >Informacion no encontrada</CommandEmpty>
                        <CommandGroup >
                            {datas.map((data) => (
                                <CommandItem
                                    key={data.value}
                                    value={data.value}
                                    className={'cursor-pointer'}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                        action(currentValue)
                                        
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
                </Command>
            </PopoverContent>
            )}
        </Popover>
    )
}