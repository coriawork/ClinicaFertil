import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {ShortInfo} from "./info-short"
export function CardList({title,desc,data, children}) {
    return (
        <Card className="bg-gradient shadow-2xl">
            <CardHeader  className="border-b text-white">
                <CardTitle>{title}</CardTitle>
                <CardDescription className="text-white/75">{desc}</CardDescription>
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