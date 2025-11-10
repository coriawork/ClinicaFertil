export function ShortInfo({ h1,h2,right,i }) {
    return (
       <div key={i} className="group flex  bg-accent items-center justify-between rounded-lg border p-3 hover:shadow-md transition-all">
            <div className="">
                <p className="font-medium text-foreground">{h1}</p>
                <p className="text-sm text-muted-foreground">{h2}</p>
            </div>
                <div className="text-right group-hover:translate-x-1 transition-all">
                <p className="text-sm font-medium text-purple-600  group-hover:block">{right}</p>
            </div>
        </div>
    )
}