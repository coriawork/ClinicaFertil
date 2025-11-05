import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
export function CardInfo({title,cant,desc,children}){
    return (
        <Card className="card-3d-hover bg-gradient-soft hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm rounded-2xl text-background font-medium ">{title}</CardTitle>
                <div className="bg-white p-2 rounded-md shadow-inset-custom">
                        {children}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-background">{cant}</div>
                <p className="text-xs text-background">{desc}</p>
            </CardContent>
        </Card>
    )
}