import { useState } from 'react'
import {Card, CardContent, CardHeader} from './card'
import {ArrowLeft,ArrowRight, Plus} from 'lucide-react'
import { Select, SelectTrigger,SelectValue,SelectGroup,SelectLabel,SelectItem,SelectContent } from './select'
import { Button } from './button'



export function Calendar() {
    // Estado para mes y año
    const [currentMonth, setCurrentMonth] = useState(10); // 0-based: 0=enero, 10=noviembre
    const [currentYear, setCurrentYear] = useState(2025);
    const [selectedDay, setSelectedDay] = useState(null); // { day, month, year }
    const [showModal, setShowModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        day: '',
        month: '',
        year: '',
        startTime: '',
        endTime: '',
        label: '',
        description: '',
        type: ''
    });
    const eventTypes = [
        { value: 'consulta', label: 'Consulta' },
        { value: 'puncion', label: 'Punción' },
        { value: 'transferencia', label: 'Transferencia' },
        { value: 'otro', label: 'Otro' }
    ];

     const handleAddEventClick = () => {
        let autoDay = '';
        let autoMonth = '';
        let autoYear = '';
        if (view === 'day' && selectedDay) {
            autoDay = selectedDay.day;
            autoMonth = selectedDay.month;
            autoYear = selectedDay.year;
        } else if (selectedDay) {
            autoDay = selectedDay.day;
            autoMonth = selectedDay.month;
            autoYear = selectedDay.year;
        } else {
            autoDay = '';
            autoMonth = currentMonth;
            autoYear = currentYear;
        }
        setNewEvent({
            day: autoDay,
            month: autoMonth,
            year: autoYear,
            startTime: '',
            endTime: '',
            label: '',
            description: '',
            type: ''
        });
        setShowModal(true);
    };


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

    const [view, setView] = useState('month');
    
    const [events, setEvents] = useState([
    {
        day: 2,
        month: 10, // noviembre (0-based)
        year: 2025,
        label: 'Punción',
        startTime: '08:30',
        endTime: '11:30',
        description: 'Punción ovárica'
    },
    {
        day: 2,
        month: 10,
        year: 2025,
        label: 'Consulta',
        startTime: '12:30',
        endTime: '13:30',
        description: 'Consulta con Dr. Pérez'
    },
    {
        day: 3,
        month: 10,
        year: 2025,
        label: 'Transferencia',
        startTime: '14:00',
        endTime: '15:00',
        description: 'Transferencia embrionaria'
    },
]);
    // Funciones para cambiar mes
    const goToPrev = () => {
    if (view === 'day') {
        if (selectedDay) {
            let { day, month, year } = selectedDay;
            day -= 1;
            if (day < 1) {
                // Ir al último día del mes anterior
                if (month === 0) {
                    month = 11;
                    year -= 1;
                } else {
                    month -= 1;
                }
                day = new Date(year, month + 1, 0).getDate();
            }
            setSelectedDay({ day, month, year });
        } else {
            // Si no hay día seleccionado, selecciona el primero del mes actual
            setSelectedDay({ day: 1, month: currentMonth, year: currentYear });
        }
    } else {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    }
    };

    const goToNext = () => {
        if (view === 'day') {
            if (selectedDay) {
                let { day, month, year } = selectedDay;
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                day += 1;
                if (day > daysInMonth) {
                    day = 1;
                    if (month === 11) {
                        month = 0;
                        year += 1;
                    } else {
                        month += 1;
                    }
                }
                setSelectedDay({ day, month, year });
            } else {
                // Si no hay día seleccionado, selecciona el primero del mes actual
                setSelectedDay({ day: 1, month: currentMonth, year: currentYear });
            }
        } else {
            if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
            } else {
                setCurrentMonth(currentMonth + 1);
            }
        }
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
        if (view === 'day') {
            setSelectedDay({
                day: today.getDate(),
                month: today.getMonth(),
                year: today.getFullYear()
            });
        }
    };

    function DayView() {
        if (!selectedDay) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-foreground/60">
                    Selecciona un día para ver los eventos.
                </div>
            );
        }

        // Horas a mostrar (8 a 18)
        const desdeH = 6
        const hours = Array.from({ length:18 }, (_, i) => desdeH + i);

        // Filtrar eventos del día seleccionado
        const dayEvents = events
            .filter(ev =>
                ev.day === selectedDay.day &&
                ev.month === selectedDay.month &&
                ev.year === selectedDay.year
            )
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

        // Función para convertir "HH:mm" a minutos
        const toMinutes = (str) => {
            const [h, m] = str.split(':').map(Number);
            return h * 60 + m;
        };

        return (
            <div className="bg-stone-950 rounded-2xl p-6 w-full h-full flex flex-col">
                <div className="relative flex-1 border rounded-lg bg-neutral-900 overflow-y-auto">
                    {/* Horas */}
                    {hours.map((hour, idx) => (
                        <div key={hour} className="relative border-b border-neutral-800 h-16">
                            <span className="absolute left-0 top-2 text-xs text-foreground/40 w-12 text-right pr-2 select-none">
                                {hour}:00
                            </span>
                        </div>
                    ))}
                    {/* Eventos */}
                    {dayEvents.map((ev, i) => {
                        // Calcular posición y altura
                        const start = Math.max(toMinutes(ev.startTime), desdeH * 60);
                        const end = Math.min(toMinutes(ev.endTime), 19 * 60);
                        const top = ((start - desdeH * 60) / 60) * 4; // 4rem por hora
                        const height = ((end - start) / 60) * 4;

                        return (
                            <div
                                key={i}
                                className="absolute flex flex-wrap justify-between  flex-col left-16 right-4 bg-violet-800/50  border-primary   rounded-[5px] p-2 text-white shadow-2xl"
                                style={{
                                    top: `calc(${((start - desdeH * 60) / 60) * 4}rem)`,
                                    height: `calc(${((end - start) / 60) * 4}rem)`,
                                    minHeight: '2.5rem',
                                    zIndex: 10,
                                }}
                                title={ev.description}
                            >
                            
                                <div className="font-bold">{ev.label}</div>
                                <div className="text-xs">{ev.startTime} - {ev.endTime}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    function MonthView({ year, month }) {
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
                        const isSelected = selectedDay &&
                            cell.day === selectedDay.day &&
                            ((cell.current && month === selectedDay.month && year === selectedDay.year) ||
                                (!cell.current && (
                                // Si es del mes anterior
                                    (idx < 7 && (
                                        (month === 0
                                            ? 11
                                            : month - 1) === selectedDay.month &&
                                        (month === 0
                                            ? year - 1
                                            : year) === selectedDay.year
                                    )) ||
                                    // Si es del mes siguiente
                                    (idx >= cells.length - 7 && (
                                        (month === 11
                                            ? 0
                                            : month + 1) === selectedDay.month &&
                                        (month === 11
                                            ? year + 1
                                            : year) === selectedDay.year
                                    ))
                                ))
                            );

                        // Determinar a qué mes/año pertenece la celda
                        let cellMonth = month;
                        let cellYear = year;
                        if (!cell.current) {
                            if (idx < 7) {
                                // Mes anterior
                                cellMonth = month === 0 ? 11 : month - 1;
                                cellYear = month === 0 ? year - 1 : year;
                            } else {
                                // Mes siguiente
                                cellMonth = month === 11 ? 0 : month + 1;
                                cellYear = month === 11 ? year + 1 : year;
                            }
                        }
                        const cellEvents = events.filter(
                            ev =>
                                ev.day === cell.day &&
                                ev.month === cellMonth &&
                                ev.year === cellYear
                        );
                        return (
                            <div
                                key={idx}
                                className={`group relative w-full h-full flex flex-col gap-1.5 p-1.5 max-md:min-h-22 md:gap-1 md:p-2 cursor-pointer
                                    border border-neutral-800
                                    ${cell.current ? 'bg-calendar-bg hover:bg-neutral-900/50 text-foreground' : 'bg-neutral-800 hover:bg-neutral-800/80 text-foreground/40'}`}
                                onClick={() => setSelectedDay({ day: cell.day, month: cellMonth, year: cellYear })}
                            >
                                <span
                                    className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold
                                        ${isToday ? 'bg-primary text-white' : ''}
                                        ${isSelected ? 'border-3 bg-primary/30 border-primary' : ''}`}
                                >
                                    {cell.day}
                                </span>
                                {/* Renderizar eventos */}
                                {cellEvents.slice(0, 3).map((ev, i) => (
                                    <span
                                        key={i}
                                        className='bg-chart-2/20 text-chart-2 border-chart-2 border flex text-xs items-center justify-between px-2 w-full h-6 rounded-[6px] mt-1 overflow-hidden truncate max-md:text-[0px] max-md:px-0 max-md:h-2'
                                        title={ev.description}
                                    >
                                        <span className='font-bold truncate max-md:hidden'>{ev.label}</span>
                                        <span className='truncate max-md:hidden'>{ev.time}</span>
                                    </span>
                                ))}
                                {cellEvents.length > 3 && (
                                    <span className='text-xs text-foreground/60 mt-1'>
                                        {cellEvents.length - 3} más
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    function getWeekOfMonth(date) {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const dayOfWeek = (firstDay.getDay() + 6) % 7; // Lunes=0, Domingo=6
        return Math.ceil((date.getDate() + dayOfWeek) / 7);
    }


    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    return (
        <Card className=" h-1/2 bg-stone-950 w-full rounded-2xl">
            <CardHeader className="bg-stone-950 w-full items-center flex-wrap justify-between flex ">
                <div className='flex gap-3'>
                    <IconCalendar
                        month={
                            view === 'day'
                                ? monthNames[
                                    selectedDay
                                        ? selectedDay.month
                                        : currentMonth
                                ].slice(0, 3).toLowerCase()
                                : monthNames[currentMonth].slice(0, 3).toLowerCase()
                        }
                        day={
                            view === 'day'
                                ? (selectedDay ? selectedDay.day : 1)
                                : 1
                        }
                    />
                    <div className='flex flex-col gap-1'>
                        <div className='flex gap-2 items-center'>
                            <p className='text-xl'>
                                {monthNames[currentMonth]} {currentYear}
                            </p>
                           <span className='border px-1 text-foreground/70 rounded-[5px]'>
                                {view === 'day' && selectedDay
                                    ? `Week ${getWeekOfMonth(new Date(selectedDay.year, selectedDay.month, selectedDay.day))}`
                                    : (() => {
                                        const today = new Date();
                                        if (
                                            today.getFullYear() === currentYear &&
                                            today.getMonth() === currentMonth
                                        ) {
                                            return `Week ${getWeekOfMonth(today)}`;
                                        } else {
                                            return `Week ${getWeekOfMonth(new Date(currentYear, currentMonth, 1))}`;
                                        }
                                    })()
                                }
                            </span>
                        </div>
                        <div className='font-thin text-foreground/70'>
                            {view === 'day'
                                ? (
                                    selectedDay
                                        ? new Date(selectedDay.year, selectedDay.month, selectedDay.day)
                                            .toLocaleDateString('es-ES', { weekday: 'long' })
                                        : ''
                                )
                                : `${monthNames[currentMonth].slice(0,3)} 1, ${currentYear} - ${monthNames[currentMonth].slice(0,3)} ${new Date(currentYear, currentMonth + 1, 0).getDate()}, ${currentYear}`
                            }
                        </div>
                    </div>
                </div>
                <div className=' flex flex-wrap items-center gap-5'>
                    <div className='flex border rounded-[5px] items-center'>
                        <button className='p-2 border-r rounded-l-[5px] cursor-pointer hover:bg-neutral-900 bg-right' onClick={goToPrev}>
                            <ArrowLeft size={22}/>
                        </button>
                        <button  className='p-2 px-5 font-bold cursor-pointer hover:bg-neutral-900 ' onClick={goToToday}>HOY</button>
                        <button className='p-2 border-l rounded-r-[5px] cursor-pointer hover:bg-neutral-900 bg-right' onClick={goToNext}>
                            <ArrowRight size={22}/>
                        </button>
                    </div>
                   
                    {/* Esto puedo agregarlo mas adelante */}
                   <div className=' '>
                        <Select
                            value={view}
                            onValueChange={setView}
                        >
                            <SelectTrigger className=" rounded-[5px] ">
                                <SelectValue placeholder="vistas" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[5px]">
                                <SelectGroup>
                                    <SelectLabel>vistas</SelectLabel>
                                    <SelectItem value="day">Day View</SelectItem>
                                    <SelectItem value="month">Month View</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className=' '>
                        <Button className=' flex items-center  rounded-[5px]' onClick={handleAddEventClick}>
                            <Plus className=''/>
                            <p className='mt-1 text-md'>
                                Add event
                            </p>
                        </Button>
                    </div>
                </div>
            </CardHeader>   
            <CardContent className='h-200 p-5'>
                {view === 'month'
                    ? <MonthView year={currentYear} month={currentMonth}/>
                    : <DayView />}
            </CardContent>
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-neutral-900 p-6 rounded-xl w-full max-w-md shadow-lg relative">
                        <button
                            className="absolute top-2 right-2 text-foreground/60 hover:text-foreground"
                            onClick={() => setShowModal(false)}
                        >✕</button>
                        <h2 className="text-xl font-bold mb-4">Agregar evento</h2>
                        <form className="flex flex-col gap-3">
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    max="31"
                                    placeholder="Día"
                                    className="w-1/3 p-2 rounded bg-neutral-800 text-white"
                                    value={newEvent.day}
                                    onChange={e => setNewEvent(ev => ({ ...ev, day: e.target.value }))}
                                />
                                <select
                                    className="w-1/3 p-2 rounded bg-neutral-800 text-white"
                                    value={newEvent.month}
                                    onChange={e => setNewEvent(ev => ({ ...ev, month: e.target.value }))}
                                >
                                    <option value="">Mes</option>
                                    {monthNames.map((m, idx) => (
                                        <option key={idx} value={idx}>{m}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    min="2020"
                                    max="2100"
                                    placeholder="Año"
                                    className="w-1/3 p-2 rounded bg-neutral-800 text-white"
                                    value={newEvent.year}
                                    onChange={e => setNewEvent(ev => ({ ...ev, year: e.target.value }))}
                                />
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="time"
                                    className="w-1/2 p-2 rounded bg-neutral-800 text-white"
                                    value={newEvent.startTime}
                                    onChange={e => setNewEvent(ev => ({ ...ev, startTime: e.target.value }))}
                                />
                                <input
                                    type="time"
                                    className="w-1/2 p-2 rounded bg-neutral-800 text-white"
                                    value={newEvent.endTime}
                                    onChange={e => setNewEvent(ev => ({ ...ev, endTime: e.target.value }))}
                                />
                            </div>
                            <select
                                className="p-2 rounded bg-neutral-800 text-white"
                                value={newEvent.type}
                                onChange={e => setNewEvent(ev => ({ ...ev, type: e.target.value }))}
                            >
                                <option value="">Tipo de evento</option>
                                {eventTypes.map(t => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Título"
                                className="p-2 rounded bg-neutral-800 text-white"
                                value={newEvent.label}
                                onChange={e => setNewEvent(ev => ({ ...ev, label: e.target.value }))}
                            />
                            <textarea
                                placeholder="Descripción"
                                className="p-2 rounded bg-neutral-800 text-white"
                                value={newEvent.description}
                                onChange={e => setNewEvent(ev => ({ ...ev, description: e.target.value }))}
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                                    Cancelar
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setEvents(prev => [
                                            ...prev,
                                            {
                                                ...newEvent,
                                                day: Number(newEvent.day),
                                                month: Number(newEvent.month),
                                                year: Number(newEvent.year)
                                            }
                                        ]);
                                        setShowModal(false);
                                    }}
                                >
                                    Guardar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Card>
    )
}