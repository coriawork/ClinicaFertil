import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {ShortInfo} from "./info-short"
import { Separator } from "@/components/ui/separator"
export function CardList({title,desc,data, children}) {
    return (
        <Card className="bg-accent/50 border-primary/30 shadow-2xl">
            <CardHeader  className=" text-foreground">
                <CardTitle>{title}</CardTitle>
                <CardDescription className="text-foreground/75">{desc}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {data.map((appointment, i) => (
                        <ShortInfo key={i} h1={appointment.h1} h2={appointment.h2} right={appointment.right} />
                    ))}
                </div>
                {children}
            </CardContent>
        </Card>
   )
}