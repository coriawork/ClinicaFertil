import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
export function CardShort({ title, description, color, bgColor, children }) {
    return (
        <Card className="transition-all card-3d-hover hover:shadow-md">
            <CardHeader className="flex flex-row items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${bgColor}`}>
                    <div className={`h-6 w-6  rounded-2xl  ${color}`}>
                        {children}
                    </div>
                </div>
                <div className="flex-1">
                    <CardTitle className="text-base">{title}</CardTitle>
                    <CardDescription className="text-xs">{description}</CardDescription>
                </div>
            </CardHeader>
        </Card>
    )
}