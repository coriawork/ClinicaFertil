import { useState } from 'react'
import {Card, CardContent, CardHeader} from './card'
import {ArrowLeft,ArrowRight, Plus} from 'lucide-react'
import { Select, SelectTrigger,SelectValue,SelectGroup,SelectLabel,SelectItem,SelectContent } from './select'
import { Button } from './button'




export function Calendar() {
    // Estado para mes y año
    const [currentMonth, setCurrentMonth] = useState(10); // 0-based: 0=enero, 10=noviembre
    const [currentYear, setCurrentYear] = useState(2025);

    function IconCalendar({month,day}){
        return(
            <div className='flex flex-col rounded-[5px]  w-15  items-center border-muted border'>
                <div className='bg-accent font-bold w-full items-center flex justify-center text-foreground/60 uppercase'>
                    {month}
                </div> 
                <div className='py-1'>
                    {day}
                </div> 
            </div>
        )
    }


    // Funciones para cambiar mes
    const goToPrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
    };

    function MonthView({ year, month }) {
        // ...usa year y month recibidos por props...
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

        let firstDay = new Date(year, month, 1).getDay();
        firstDay = (firstDay === 0) ? 6 : firstDay - 1;

        const prevMonthDays = new Date(year, month, 0).getDate();
        const cells = [];

        for (let i = firstDay - 1; i >= 0; i--) {
            cells.push({
                day: prevMonthDays - i,
                current: false
            });
        }
        for (let d = 1; d <= daysInMonth; d++) {
            cells.push({
                day: d,
                current: true
            });
        }
        let nextDay = 1;
        while (cells.length < 35) {
            cells.push({
                day: nextDay++,
                current: false
            });
        }

        return (
            <div className='flex flex-1 flex-col h-full'>
                <div className='grid grid-cols-7 '>
                    {['lun','mar','mier','jue','vier','sab','dom'].map((day) => (
                        <div
                            key={day}
                            className='relative uppercase font-bold flex w-full flex-col items-center justify-center gap-1.5 bg-primary p-2 md:flex-row md:gap-1 before:pointer-events-none '
                        >
                            <span className='text-xs font-medium text-quaternary'>{day}</span>
                        </div>
                    ))}
                </div>
                <div className='grid flex-1 grid-cols-7 grid-rows-5 h-full'>
                    {cells.map((cell, idx) => {
                        const isToday = cell.current && isCurrentMonth && cell.day === today.getDate();
                        return (
                            <div
                                key={idx}
                                className={`group relative w-full h-full flex flex-col gap-1.5 p-1.5 hover:bg-stone-900 max-md:min-h-22 md:gap-1 md:p-2 cursor-pointer
                                    ${cell.current ? 'bg-neutral-900 text-foreground' : 'bg-neutral-800 text-foreground/40'}`}
                            >
                                <span
                                    className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold
                                        ${isToday ? 'bg-primary text-white' : ''}`}
                                >
                                    {cell.day}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Utilidad para mostrar el nombre del mes
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    return (
        <Card className=" h-1/2 bg-stone-950 w-full rounded-2xl">
            <CardHeader className="bg-stone-950 w-full items-center flex-wrap justify-between flex ">
                <div className='flex gap-3'>
                    <IconCalendar month={monthNames[currentMonth].slice(0,3).toLowerCase()} day={1}/>
                    <div className='flex flex-col gap-1'>
                        <div className='flex gap-2 items-center'>
                            <p className='text-xl'>
                                {monthNames[currentMonth]} {currentYear}
                            </p>
                            <span className='border px-1 text-foreground/70 rounded-[5px]'>Week 4</span>
                        </div>
                        <div className='font-thin text-foreground/70'>
                            {monthNames[currentMonth].slice(0,3)} 1, {currentYear} - {monthNames[currentMonth].slice(0,3)} {new Date(currentYear, currentMonth + 1, 0).getDate()}, {currentYear}
                        </div>
                    </div>
                </div>
                <div className=' flex flex-wrap items-center gap-5'>
                    <div className='flex items-center'>
                        <button className='border p-2 rounded-l-[5px] cursor-pointer hover:bg-neutral-900 bg-right' onClick={goToPrevMonth}>
                            <ArrowLeft size={22}/>
                        </button>
                        <button  className='border-y p-2 px-5 font-bold cursor-pointer hover:bg-neutral-900 ' onClick={goToToday}>HOY</button>
                        <button className='border p-2 rounded-r-[5px] cursor-pointer hover:bg-neutral-900 bg-right' onClick={goToNextMonth}>
                            <ArrowRight size={22}/>
                        </button>
                    </div>
                    <div className=' '>
                        <Select className="">
                            <SelectTrigger className=" rounded-[5px] ">
                                <SelectValue  placeholder="vistas" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[5px]">
                                <SelectGroup>
                                    <SelectLabel>vistas</SelectLabel>
                                    <SelectItem value="day">Day View</SelectItem>
                                    <SelectItem value="week">Week View</SelectItem>
                                    <SelectItem value="month">Month View</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className=' '>
                        <Button className=' flex items-center  rounded-[5px]'>
                            <Plus className=''/>
                            <p className='mt-1 text-md'>
                                Add event
                            </p>
                        </Button>
                    </div>
                </div>
            </CardHeader>   
            <CardContent className='h-200 p-5'>
                <MonthView year={currentYear} month={currentMonth}/>
            </CardContent>
        </Card>
    )
}