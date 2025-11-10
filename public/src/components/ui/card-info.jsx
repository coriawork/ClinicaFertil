import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
export function CardInfo({title,cant,desc,children}){
    return (
        <Card className="card-3d-hover border-primary/20 bg-chart-4/50  hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm rounded-2xl text-foreground font-medium ">{title}</CardTitle>
                <div className="bg-background p-2 rounded-md shadow-inset-custom">
                        {children}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-foreground">{cant}</div>
                <p className="text-xs text-foreground">{desc}</p>
            </CardContent>
        </Card>
    )
}