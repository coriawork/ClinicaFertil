import { useState,useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './card'
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectItem, SelectContent } from './select'
import { Button } from './button'
import { Input } from './input'
import { Textarea } from './textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './dialog'
import { Separator } from './separator'
import { Combobox } from './combobox' 
import { useAuth } from '@/lib/AuthContext'
import axios from 'axios'
import { toast } from "sonner"
import { emailService } from '@/utils/email'
import { calendarUtils } from '@/utils/calendar'
import { Tooltip, TooltipTrigger, TooltipContent } from './tooltip'

export function Calendar() {
    // Estado para mes y año
    const [currentMonth, setCurrentMonth] = useState(11); // 0-based: 0=enero, 10=noviembre
    const [currentYear, setCurrentYear] = useState(2025);
    const [selectedDay, setSelectedDay] = useState(null); // { day, month, year }
    const [showModal, setShowModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        day: '',
        month: '',
        year: '',
        startTime: '',
        endTime: '',
        description: '',
        type: '',
        paciente: ''
    });
    const pacientes = [
        { value: '1', label: 'Juan Pérez' },
        { value: '2', label: 'María Gómez' },
        { value: '3', label: 'Ana Torres' },
        { value: '4', label: 'Carlos Díaz' }
    ];
    const eventTypes = [
        { value: 'monitoreo', label: 'Monitoreo' },
        { value: 'puncion', label: 'Punción' },
    ];
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [loadingEvents, setLoadingEvents] = useState(true); 
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [availableSlots, setAvailableSlots] = useState([]);
    const {user} = useAuth();
    const [scheduleConfig, setScheduleConfig] = useState({
        daysOfWeek: [],
        startTime: '08:00',
        endTime: '18:00',
        slotDuration: 20
    });
    const daysOfWeek = [
        { value: 1, label: 'Lunes' },
        { value: 2, label: 'Martes' },
        { value: 3, label: 'Miércoles' },
        { value: 4, label: 'Jueves' },
        { value: 5, label: 'Viernes' },
        { value: 6, label: 'Sábado' },
        { value: 0, label: 'Domingo' }
    ];
    const [view, setView] = useState('month');
    const [events, setEvents] = useState([
    ]);


    useEffect(() => {
        if (user?.id) {
            fetchAvailableSlots();
        }
    }, [user?.id]);
    
   
    const fetchAvailableSlots = () => {
        setLoadingSlots(true)
        setLoadingEvents(true)
        
        calendarUtils.fetchTurnosMedico(user.id)
            .then(({ slots, eventos }) => {
                setAvailableSlots(slots)
                
                // Actualizar eventos: mantener eventos manuales y agregar turnos ocupados
                setEvents(prev => {
                    const eventosManules = prev.filter(ev => !ev.id_turno)
                    return [...eventosManules, ...eventos]
                })
            })
            .catch(error => {
                console.error('Error al cargar turnos disponibles:', error)
                toast.error('Error al cargar turnos')
            })
            .finally(() => {
                setLoadingSlots(false)
                setLoadingEvents(false)
            })
    }

    const toggleDayOfWeek = (day) => {
        setScheduleConfig(prev => ({
            ...prev,
            daysOfWeek: prev.daysOfWeek.includes(day)
                ? prev.daysOfWeek.filter(d => d !== day)
                : [...prev.daysOfWeek, day]
        }));
    };

    const generateTimeSlots = () => {
        const { daysOfWeek, startTime, endTime } = scheduleConfig
        
        if (!daysOfWeek.length || !startTime || !endTime || !user?.id) return

        setLoadingSlots(true)
        
        calendarUtils.generarTurnos({
            idMedico: user.id,
            daysOfWeek,
            startTime,
            endTime
        })
        .then(() => {
            fetchAvailableSlots()
            setShowScheduleModal(false)
            setScheduleConfig({
                daysOfWeek: [],
                startTime: '08:00',
                endTime: '18:00',
            })
            toast.success('Horarios generados exitosamente')
        })
        .catch(error => {
            console.error('Error al generar horarios:', error)
            toast.error('Error al generar horarios')
        })
        .finally(() => {
            setLoadingSlots(false)
        })
    }

    const removeSlotForDay = async (dayOfWeek) => {
        if (confirm(`¿Deseas eliminar todos los horarios del ${daysOfWeek.find(d => d.value === dayOfWeek)?.label}?`)) {
            await fetchAvailableSlots();
        }
    };

    function ScheduleModal() {
        // Obtener días únicos ya configurados
        const configuredDays = Array.from(new Set(availableSlots.map(s => s.dia_semana)));
        
        return (
            <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
                <DialogContent className="bg-neutral-900 p-6 rounded-xl w-full max-w-2xl shadow-lg">
                    <DialogHeader>
                        <DialogTitle>Administrar Horarios Disponibles</DialogTitle>
                        <DialogDescription>
                            Configura los días y horarios en los que habrá turnos disponibles para las próximas 5 semanas.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex flex-col gap-4">
                        {/* Selección de días */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Días de la semana</label>
                            <div className="grid grid-cols-4 gap-2">
                                {daysOfWeek.map(day => (
                                    <Button
                                        key={day.value}
                                        type="button"
                                        variant={scheduleConfig.daysOfWeek.includes(day.value) ? 'default' : 'outline'}
                                        className="rounded-[5px]"
                                        onClick={() => toggleDayOfWeek(day.value)}
                                        disabled={loadingSlots}
                                    >
                                        {day.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Horarios */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Hora de inicio</label>
                                <Input
                                    type="time"
                                    className="rounded-[5px]"
                                    value={scheduleConfig.startTime}
                                    onChange={e => setScheduleConfig(prev => ({ ...prev, startTime: e.target.value }))}
                                    disabled={loadingSlots}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Hora de fin</label>
                                <Input
                                    type="time"
                                    className="rounded-[5px]"
                                    value={scheduleConfig.endTime}
                                    onChange={e => setScheduleConfig(prev => ({ ...prev, endTime: e.target.value }))}
                                    disabled={loadingSlots}
                                />
                            </div>
                        </div>

                        {/* Vista previa */}
                        {scheduleConfig.daysOfWeek.length > 0 && (
                            <div className="bg-neutral-800 p-4 rounded-lg">
                                <p className="text-sm font-medium mb-2">Vista previa:</p>
                                <p className="text-sm text-foreground/70">
                                    Se generarán turnos para{' '}
                                    <span className="font-semibold">
                                        {scheduleConfig.daysOfWeek.map(d => daysOfWeek.find(day => day.value === d)?.label).join(', ')}
                                    </span>{' '}
                                    desde las {scheduleConfig.startTime} hasta las {scheduleConfig.endTime}
                                    {' '}durante las próximas 5 semanas.
                                </p>
                            </div>
                        )}

                        {/* Horarios actuales */}
                        {configuredDays.length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Horarios configurados:</label>
                                    <div className="flex flex-wrap gap-2">
                                        {configuredDays.map(dayNum => {
                                            const dayLabel = daysOfWeek.find(d => d.value === dayNum)?.label;
                                            const slots = availableSlots.filter(s => s.dia_semana === dayNum && s.disponible);
                                            if (slots.length === 0) return null;
                                            
                                            const times = slots.map(s => s.horario_inicio).sort();
                                            const firstTime = times[0];
                                            const lastTime = times[times.length - 1];
                                            
                                            return (
                                                <div key={dayNum} className="bg-neutral-800 px-3 py-2 rounded-lg flex items-center gap-2">
                                                    <span className="text-sm">
                                                        {dayLabel}: {firstTime} - {lastTime}
                                                    </span>
                                                    <button
                                                        onClick={() => removeSlotForDay(dayNum)}
                                                        className="text-red-500 hover:text-red-400 text-xs"
                                                        disabled={loadingSlots}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}

                        {loadingSlots && (
                            <div className="text-center text-sm text-foreground/60">
                                Procesando...
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex justify-end gap-2 mt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={loadingSlots}>
                                Cerrar
                            </Button>
                        </DialogClose>
                        <Button
                            type="button"
                            onClick={generateTimeSlots}
                            disabled={!scheduleConfig.daysOfWeek.length || !scheduleConfig.startTime || !scheduleConfig.endTime || loadingSlots}
                        >
                            {loadingSlots ? 'Generando...' : 'Generar Horarios'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

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
            description: '',
            type: '',
            paciente: ''
        });
        setShowModal(true);
    };

    function IconCalendar({month,day}){
        return(
            <div className='flex flex-col rounded-[5px]  w-15  items-center border-muted border'>
                <div className='bg-accent font-bold w-full items-center flex justify-center text-foreground/60 uppercase'>
                    {month}
                </div> 
                <div className='py-1 text-white'>
                    {day}
                </div> 
            </div>
        )
    }
    
    function getEventColor(type) {
        switch (type?.toLowerCase()) {
            case 'punción':
            case 'puncion':
                return 'bg-chart-2/30 border-chart-2 text-chart-2';
            case 'consulta':
                return 'bg-chart-1/30 border-chart-1 text-chart-1';
            case 'monitoreo':
                return 'bg-chart-4/30 border-chart-4 text-chart-4';
            default:
                return 'bg-muted border-muted text-foreground';
        }
    }

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

    function sumar20Minutos(hora) {
        if (!hora) return "";
        const [h, m] = hora.split(":").map(Number);
        const date = new Date(0, 0, 0, h, m + 20);
        const hh = String(date.getHours()).padStart(2, "0");
        const mm = String(date.getMinutes()).padStart(2, "0");
        return `${hh}:${mm}`;
    }
    
    function DayView() {
        if (!selectedDay) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-foreground/60">
                    Selecciona un día para ver los eventos.
                </div>
            );
        }
        const toMinutes = (str) => {
            const [h, m] = str.split(':').map(Number);
            return h * 60 + m;
        };
        const desdeH = 6;
        const hastaH = 22;
        const hours = Array.from({ length: hastaH - desdeH }, (_, i) => desdeH + i);
        const dayEvents = events
            .filter(ev =>
                ev.day === selectedDay.day &&
                ev.month === selectedDay.month &&
                ev.year === selectedDay.year
            )
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
        
        // Obtener el rango horario disponible para el día seleccionado
        const dateStr = `${selectedDay.year}-${String(selectedDay.month + 1).padStart(2, '0')}-${String(selectedDay.day).padStart(2, '0')}`;
        const slotsDelDia = availableSlots.filter(slot => slot.fecha === dateStr && slot.disponible);
        
        let rangoHorario = null;
        if (slotsDelDia.length > 0) {
            const horarios = slotsDelDia.map(s => s.horario_inicio).sort();
            const horaInicio = horarios[0];
            const horaFin = sumar20Minutos(horarios[horarios.length - 1]);
            rangoHorario = {
                inicio: horaInicio,
                fin: horaFin,
                inicioMinutos: toMinutes(horaInicio),
                finMinutos: toMinutes(horaFin)
            };
        }

        const hourHeight = 120;
        const eventHeight = 100;

        return (
            <div className="bg-stone-950 rounded-2xl p-6 w-full h-full flex flex-col">
                {rangoHorario && (
                    <div className="mb-4 p-3 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="size-3 rounded-full bg-primary/50"></div>
                            <span className="text-sm font-medium text-white">
                                Horario de atención disponible
                            </span>
                        </div>
                        <span className="text-sm font-semibold text-primary">
                            {rangoHorario.inicio} - {rangoHorario.fin}
                        </span>
                    </div>
                )}
                <div className="relative flex-1 border rounded-lg bg-neutral-900 overflow-y-auto" style={{ minHeight: 600, maxHeight: 700 }}>
                    <div style={{ position: "relative", height: hours.length * hourHeight }}>
                        {hours.map((hour, idx) => {
                            const hourStart = hour * 60;
                            const hourEnd = (hour + 1) * 60;
                            const isInRange = rangoHorario && 
                                hourStart < rangoHorario.finMinutos && 
                                hourEnd > rangoHorario.inicioMinutos;

                            return (
                                <div
                                    key={hour}
                                    className={`relative border-b border-neutral-800 ${isInRange ? 'bg-primary/5' : ''}`}
                                    style={{ height: hourHeight }}
                                >
                                    <span className={`absolute left-0 top-2 text-xs w-12 text-right pr-2 select-none ${isInRange ? 'text-primary/70 font-semibold' : 'text-white/40'}`}>
                                        {hour}:00
                                    </span>
                                    {isInRange && (
                                        <div className="absolute left-14 top-0 bottom-0 w-1 bg-primary/30"></div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Overlay del rango horario completo */}
                        {rangoHorario && (
                            <div
                                className="absolute left-20 right-4 border-2 border-primary/30 rounded-lg pointer-events-none"
                                style={{
                                    top: ((rangoHorario.inicioMinutos - desdeH * 60) / 60) * hourHeight,
                                    height: ((rangoHorario.finMinutos - rangoHorario.inicioMinutos) / 60) * hourHeight,
                                    backgroundColor: 'rgba(112, 51, 255, 0.03)',
                                    zIndex: 1
                                }}
                            >
                                <div className="absolute -top-6 left-0 right-0 text-center">
                                    <span className="text-xs bg-primary/20 px-2 py-1 rounded-full text-primary font-medium">
                                        Horario disponible
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Eventos */}
                        {dayEvents.map((ev, i) => {
                            const start = Math.max(toMinutes(ev.startTime), desdeH * 60);
                            const top = ((start - desdeH * 60) / 60) * hourHeight;
                            return (
                                <div
                                    key={i}
                                    className={`absolute flex flex-col left-20 right-4 border rounded-[12px] p-5 text-white shadow-2xl ${getEventColor(ev.type)} transition-all hover:shadow-xl hover:scale-[1.02]`}
                                    style={{
                                        top: top,
                                        height: eventHeight,
                                        minHeight: eventHeight,
                                        zIndex: 10,
                                        fontSize: "1.1rem",
                                        display: "flex",
                                        justifyContent: "center"
                                    }}
                                    title={ev.description}
                                >
                                    <div className="flex items-center gap-4 font-bold text-lg mb-1">
                                        <span className="capitalize">{eventTypes.find(t=>t.value===ev.type?.toLowerCase())?.label || ev.type}</span>
                                        <span className="text-sm font-normal text-foreground/70">{ev.startTime} - {ev.endTime}</span>
                                    </div>
                                    {ev.paciente && (
                                        <div className="text-base text-foreground/90 mt-1">
                                            Paciente: <span className="font-semibold">{pacientes.find(p=>p.value===ev.paciente)?.label || ev.paciente}</span>
                                        </div>
                                    )}
                                    {ev.description && (
                                        <div className="text-sm text-foreground/80 mt-1">{ev.description}</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // Función para verificar si un día tiene horarios disponibles
    const hasAvailableSlots = (day, cellMonth, cellYear) => {
        const dateStr = `${cellYear}-${String(cellMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return availableSlots.some(slot => slot.fecha === dateStr && slot.disponible);
    };

    // Función para obtener slots disponibles de un día específico
    const getAvailableSlotsForDay = (day, cellMonth, cellYear) => {
        const dateStr = `${cellYear}-${String(cellMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return availableSlots.filter(slot => slot.fecha === dateStr && slot.disponible);
    };

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
                                    (idx < 7 && (
                                        (month === 0
                                            ? 11
                                            : month - 1) === selectedDay.month &&
                                        (month === 0
                                            ? year - 1
                                            : year) === selectedDay.year
                                    )) ||
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

                        let cellMonth = month;
                        let cellYear = year;
                        if (!cell.current) {
                            if (idx < 7) {
                                cellMonth = month === 0 ? 11 : month - 1;
                                cellYear = month === 0 ? year - 1 : year;
                            } else {
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

                        const hasSlots = hasAvailableSlots(cell.day, cellMonth, cellYear);
                        const availSlots = getAvailableSlotsForDay(cell.day, cellMonth, cellYear);

                        return (
                            <div
                                key={idx}
                                className={`group relative w-full h-full flex flex-col p-1.5 max-md:min-h-22 md:p-2 cursor-pointer
                                    border border-neutral-800 transition-all duration-200
                                    ${cell.current ? 'bg-calendar-bg hover:bg-neutral-900/50 text-white' : 'bg-neutral-800 hover:bg-neutral-800/80 text-white/40'}
                                    ${hasSlots && cell.current ? 'ring-1 ring-primary/30 hover:ring-primary/50' : ''}`}
                                onClick={() => setSelectedDay({ day: cell.day, month: cellMonth, year: cellYear })}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span
                                        className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold transition-all
                                            ${isToday ? 'bg-primary text-white' : ''}
                                            ${isSelected ? 'border-3z bg-primary/30 border-primary' : ''}`}
                                    >
                                        {cell.day}
                                    </span>
                                    
                                </div>
                                
                                {/* Eventos */}
                                <div className="flex-1 flex flex-col gap-1.5">
                                    {cellEvents.slice(0, 2).map((ev, i) => (
                                        <span
                                            key={i}
                                            className={`border flex text-xs items-center justify-between px-2 w-full h-6 rounded-[6px] overflow-hidden truncate max-md:text-[0px] max-md:px-0 max-md:h-2 ${getEventColor(ev.type)}`}
                                            title={ev.description}
                                        >
                                            <span className='font-bold truncate max-md:hidden'>
                                                {eventTypes.find(t=>t.value===ev.type?.toLowerCase())?.label || ev.type}
                                            </span>
                                            <span className='truncate max-md:hidden'>{ev.time}</span>
                                        </span>
                                    ))}
                                    {cellEvents.length > 2 && (
                                        <span className='text-xs text-foreground/60'>
                                            +{cellEvents.length - 2} más
                                        </span>
                                    )}
                                </div>

                                {/* Indicador visual de horarios - Parte inferior */}
                                {hasSlots && cell.current && (
                                    <div className="mt-auto pt-1.5">
                                        <div className="flex items-center justify-center gap-1.5 py-1 px-2 rounded-md bg-primary/10 border border-primary/20 group-hover:bg-primary/15 transition-colors">
                                            <span className="text-[11px] text-primary font-semibold">
                                                    {availSlots.length}{availSlots.length === 1 ? ' Turno Disponible' : ' Turnos Disponibles'}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Tooltip con horarios disponibles al hacer hover */}
                                {hasSlots && cell.current && availSlots.length > 0 && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="absolute inset-0 z-40" />
                                        </TooltipTrigger>
                                        <TooltipContent 
                                            side="top" 
                                            className="bg-neutral-800 border border-primary/30 shadow-xl p-3 min-w-[160px]"
                                            sideOffset={5}
                                        >
                                            <p className="text-xs font-semibold text-white mb-2">Horarios disponibles:</p>
                                            <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
                                                {availSlots.map((slot, idx) => (
                                                    <div key={idx} className="text-[11px] text-white/80 flex items-center gap-1.5">
                                                        <div className="size-1 rounded-full bg-primary/60"></div>
                                                        {slot.horario_inicio}
                                                    </div>
                                                ))}
                                                
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
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
    
    const handleSaveEvent = () => {
        const eventData = {
            ...newEvent,
            day: Number(newEvent.day),
            month: Number(newEvent.month),
            year: Number(newEvent.year),
            endTime: calendarUtils.sumar20Minutos(newEvent.startTime)
        }

        if (newEvent.type.toLowerCase() === 'monitoreo') {
            const dateStr = `${eventData.year}-${String(eventData.month + 1).padStart(2, '0')}-${String(eventData.day).padStart(2, '0')}`
            const turnoDisponible = availableSlots.find(
                slot => slot.fecha === dateStr && 
                        slot.horario_inicio === eventData.startTime && 
                        slot.disponible
            )

            if (!turnoDisponible) {
                toast.error('No hay turno disponible en esa fecha y hora')
                return
            }

            calendarUtils.reservarTurno({
                idPaciente: Number(newEvent.paciente),
                idTurno: turnoDisponible.id
            })
            .then(() => {
                fetchAvailableSlots()

                const pacienteSeleccionado = pacientes.find(p => p.value === newEvent.paciente)
                const fechaFormateada = calendarUtils.formatDate(eventData.day, eventData.month, eventData.year)

                emailService.sendCitaConfirmadaEmail({
                    pacienteNombre: pacienteSeleccionado?.label || 'Paciente',
                    medicoNombre: user?.name || 'Dr. ',
                    fecha: fechaFormateada,
                    hora: `${eventData.startTime} - ${eventData.endTime}`,
                })
                .then(() => {
                    toast.success('Turno reservado y email enviado')
                })
                .catch(() => {
                    toast.warning('Turno reservado pero error al enviar email')
                })
                
                setShowModal(false)
            })
            .catch(error => {
                console.error('Error al reservar turno:', error)
                toast.error('Error al reservar el turno')
            })
        } else {
            setEvents(prev => [...prev, eventData])
            setShowModal(false)
            toast.success('Evento agregado correctamente')
        }
    }

    return (
        <Card className=" h-1/2 bg-stone-950 w-full rounded-2xl">
            <CardHeader className="bg-stone-950 w-full items-center flex-wrap justify-between flex ">
                <div className='flex gap-3 '>
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
                            <p className='text-xl text-white'>
                                {monthNames[currentMonth]} {currentYear}
                            </p>
                           <span className='border px-1 text-white/70 rounded-[5px]'>
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
                        <div className='font-thin text-white/70'>
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
                    

                    <div className='flex border rounded-[5px] text-white items-center'>
                        <button className='p-2 border-r rounded-l-[5px] cursor-pointer hover:bg-neutral-900 bg-right' onClick={goToPrev}>
                            <ArrowLeft size={22}/>
                        </button>
                        <button  className='p-2 px-5 font-bold cursor-pointer hover:bg-neutral-900 ' onClick={goToToday}>HOY</button>
                        <button className='p-2 border-l rounded-r-[5px] cursor-pointer hover:bg-neutral-900 bg-right' onClick={goToNext}>
                            <ArrowRight size={22}/>
                        </button>
                    </div>
                   
                    {/* Esto puedo agregarlo mas adelante */}
                    <div className='text-white'>
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
                                    <SelectItem value="day">DIA</SelectItem>
                                    <SelectItem value="month">MES</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                   
                    <div className=' '>
                        <Button className=' flex items-center  rounded-[5px]' onClick={handleAddEventClick}>
                            <Plus className=''/>
                            <p className='mt-1 text-md'>
                                Agrega Turno
                            </p>
                        </Button>
                    </div>

                   <Button 
                        variant={'action'} 
                        className=' flex items-center  rounded-[5px]'
                        onClick={() => setShowScheduleModal(true)}
                    >
                        <Plus className=''/>
                        <p className='mt-1 text-md'>
                            Administrar horarios
                        </p>
                    </Button>
                </div>
            </CardHeader>   
            <CardContent className='h-200 p-5'>
                {loadingEvents ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            <p className="text-foreground/60 text-lg">Cargando eventos...</p>
                        </div>
                    </div>
                ) : view === 'month' ? (
                    <MonthView year={currentYear} month={currentMonth}/>
                ) : (
                    <DayView />
                )}
            </CardContent>
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="bg-neutral-900 p-6 rounded-xl w-full max-w-md shadow-lg">
                    <DialogHeader>
                        <DialogTitle>Agregar Turnos</DialogTitle>
                        <DialogDescription>
                            Completa los datos del Turno. La duración será de 20 minutos.
                            {newEvent.type?.toLowerCase() === 'monitoreo' && (
                                <span className="block mt-2 text-primary/70">
                                    Los monitoreos se reservan como consulta
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <form className="flex flex-col gap-3 " onSubmit={e => { e.preventDefault(); }}>
                        <div className="flex gap-2 ">
                            <Input
                                type="number"
                                min="1"
                                max="31"
                                placeholder="Día"
                                className="w-1/3 rounded-[5px]"
                                value={newEvent.day}
                                onChange={e => setNewEvent(ev => ({ ...ev, day: e.target.value }))}
                            />
                            <Select
                                value={newEvent.month !== '' ? String(newEvent.month) : ''}
                                onValueChange={val => setNewEvent(ev => ({ ...ev, month: val }))}
                            >
                                <SelectTrigger className="w-1/3 rounded-[5px]">
                                    <SelectValue placeholder="Mes" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Mes</SelectLabel>
                                        {monthNames.map((m, idx) => (
                                            <SelectItem key={idx} value={String(idx)}>{m}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Input
                                type="number"
                                min="2020"
                                max="2100"
                                placeholder="Año"
                                className="w-1/3 rounded-[5px]"
                                value={newEvent.year}
                                onChange={e => setNewEvent(ev => ({ ...ev, year: e.target.value }))}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Input
                                type="time"
                                className="w-1/2 rounded-[5px]"
                                value={newEvent.startTime}
                                onChange={e => setNewEvent(ev => ({ ...ev, startTime: e.target.value }))}
                            />
                            <Input
                                type="text"
                                className="w-1/2 rounded-[5px] bg-neutral-800 text-white"
                                value={newEvent.startTime ? sumar20Minutos(newEvent.startTime) : ''}
                                readOnly
                                placeholder="Fin (+20min)"
                                tabIndex={-1}
                            />
                        </div>
                        <Separator/>
                        <Combobox
                            datas={pacientes}
                            title="Seleccionar paciente"
                            action={val => setNewEvent(ev => ({ ...ev, paciente: val }))}
                            className="w-full rounded-[5px]"
                            disabled={false}
                        />
                        <Select
                            value={newEvent.type}
                            onValueChange={val => setNewEvent(ev => ({ ...ev, type: val }))}
                        >
                            <SelectTrigger className={'rounded-[5px]'}>
                                <SelectValue placeholder="Tipo de turno" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Tipo de turno</SelectLabel>
                                    {eventTypes.map(t => (
                                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        
                        {/* Advertencia si el horario no está disponible para monitoreo */}
                        {newEvent.type?.toLowerCase() === 'monitoreo' && newEvent.day && newEvent.month !== '' && newEvent.year && newEvent.startTime && (
                            (() => {
                                const dateStr = `${newEvent.year}-${String(Number(newEvent.month) + 1).padStart(2, '0')}-${String(newEvent.day).padStart(2, '0')}`;
                                const turnoDisponible = availableSlots.find(
                                    slot => slot.fecha === dateStr && 
                                            slot.horario_inicio === newEvent.startTime && 
                                            slot.disponible
                                );
                                if (!turnoDisponible) {
                                    return (
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
                                            No hay turno disponible en esta fecha y hora
                                        </div>
                                    );
                                }
                                return (
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-sm text-green-400">
                                        Turno disponible para reservar
                                    </div>
                                );
                            })()
                        )}

                        <DialogFooter className="flex justify-end gap-2 mt-2">
                            <DialogClose asChild>   
                                <Button type="button" variant="secondary">
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button
                                type="button"
                                onClick={handleSaveEvent}
                                disabled={
                                    !newEvent.day ||
                                    newEvent.month === '' ||
                                    !newEvent.year ||
                                    !newEvent.startTime ||
                                    !newEvent.type ||
                                    !newEvent.paciente
                                }
                            >
                                Guardar
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <ScheduleModal />
        </Card>
    )
}