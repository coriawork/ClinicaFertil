import axios from 'axios'

/**
 * Utilidades para el manejo de calendarios y turnos
 */
export const calendarUtils = {
    /**
     * Obtiene los turnos de un médico desde la API
     * @param {number} idMedico - ID del médico
     * @returns {Promise<Object>} Promise con los slots y eventos
     */
    fetchTurnosMedico: (idMedico) => {
        return axios.get(`/turnos/v1/get_turnos_medico?id_medico=${idMedico}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9ncnVwbyI6MTAsImlhdCI6MTc2NDg3NDgxNX0.Lgd1mqiMv6ZdPysSS0Eqwj0VawAXixUL7frx9pm4API`
            }
        })
        .then(response => {
            // Transformar la respuesta de la API al formato que usa el calendario
            const slots = response.data.data.map(turno => {
                const fechaHora = new Date(turno.fecha_hora)
                return {
                    id: turno.id,
                    id_paciente: turno.id_paciente,
                    fecha_hora: turno.fecha_hora,
                    dia_semana: fechaHora.getDay(),
                    horario_inicio: fechaHora.toTimeString().slice(0, 5),
                    fecha: fechaHora.toISOString().split('T')[0],
                    disponible: turno.id_paciente === null
                }
            })

            // Crear eventos automáticamente para los turnos ocupados
            const turnosOcupados = response.data.data
                .filter(turno => turno.id_paciente !== null)
                .map(turno => {
                    const fechaHora = new Date(turno.fecha_hora)
                    const startTime = fechaHora.toTimeString().slice(0, 5)
                    const endTime = calendarUtils.sumar20Minutos(startTime)
                    
                    return {
                        day: fechaHora.getDate(),
                        month: fechaHora.getMonth(),
                        year: fechaHora.getFullYear(),
                        type: 'Consulta',
                        startTime: startTime,
                        endTime: endTime,
                        paciente: String(turno.id_paciente),
                        description: `Turno reservado`,
                        id_turno: turno.id
                    }
                })

            return { slots, eventos: turnosOcupados }
        })
    },

    /**
     * Genera turnos para días específicos de la semana
     * @param {Object} config - Configuración de los turnos
     * @param {number} config.idMedico - ID del médico
     * @param {number[]} config.daysOfWeek - Días de la semana (0-6)
     * @param {string} config.startTime - Hora de inicio (HH:MM)
     * @param {string} config.endTime - Hora de fin (HH:MM)
     * @returns {Promise} Promise con las respuestas de la API
     */
    generarTurnos: ({ idMedico, daysOfWeek, startTime, endTime }) => {
        const requests = daysOfWeek.map(day => 
            axios.post('/turnos/v1/post_turnos', {
                id_medico: idMedico,
                hora_inicio: startTime,
                hora_fin: endTime,
                dia_semana: day
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9ncnVwbyI6MTAsImlhdCI6MTc2NDg3NDgxNX0.Lgd1mqiMv6ZdPysSS0Eqwj0VawAXixUL7frx9pm4API`
                }
            })
        )

        return axios.all(requests)
    },

    /**
     * Reserva un turno para un paciente
     * @param {Object} params - Parámetros de reserva
     * @param {number} params.idPaciente - ID del paciente
     * @param {number} params.idTurno - ID del turno
     * @returns {Promise} Promise con la respuesta de la API
     */
    reservarTurno: ({ idPaciente, idTurno }) => {
        return axios.patch('/turnos/v1/reservar_turno', {
            id_paciente: idPaciente,
            id_turno: idTurno
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9ncnVwbyI6MTAsImlhdCI6MTc2NDg3NDgxNX0.Lgd1mqiMv6ZdPysSS0Eqwj0VawAXixUL7frx9pm4API`
            }
        })
    },

    /**
     * Elimina los turnos de un día específico de la semana
     * @param {Object} params - Parámetros de eliminación
     * @param {number} params.idMedico - ID del médico
     * @param {number} params.diaSemana - Día de la semana (0-6)
     * @returns {Promise} Promise con la respuesta de la API
     */
    eliminarTurnosDia: ({ idMedico, diaSemana }) => {
        return axios.delete(`/turnos/v1/delete_turnos_dia?id_medico=${idMedico}&dia_semana=${diaSemana}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9ncnVwbyI6MTAsImlhdCI6MTc2NDg3NDgxNX0.Lgd1mqiMv6ZdPysSS0Eqwj0VawAXixUL7frx9pm4API`
            }
        })
    },

    /**
     * Suma 20 minutos a una hora en formato HH:MM
     * @param {string} hora - Hora en formato HH:MM
     * @returns {string} Nueva hora en formato HH:MM
     */
    sumar20Minutos: (hora) => {
        if (!hora) return ""
        const [h, m] = hora.split(":").map(Number)
        const date = new Date(0, 0, 0, h, m + 20)
        const hh = String(date.getHours()).padStart(2, "0")
        const mm = String(date.getMinutes()).padStart(2, "0")
        return `${hh}:${mm}`
    },

    /**
     * Convierte una hora HH:MM a minutos
     * @param {string} str - Hora en formato HH:MM
     * @returns {number} Total de minutos
     */
    toMinutes: (str) => {
        const [h, m] = str.split(':').map(Number)
        return h * 60 + m
    },

    /**
     * Verifica si un día tiene slots disponibles
     * @param {number} day - Día del mes
     * @param {number} month - Mes (0-11)
     * @param {number} year - Año
     * @param {Array} slots - Array de slots disponibles
     * @returns {boolean} True si hay slots disponibles
     */
    hasAvailableSlots: (day, month, year, slots) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return slots.some(slot => slot.fecha === dateStr && slot.disponible)
    },

    /**
     * Obtiene los slots disponibles de un día específico
     * @param {number} day - Día del mes
     * @param {number} month - Mes (0-11)
     * @param {number} year - Año
     * @param {Array} slots - Array de slots disponibles
     * @returns {Array} Array de slots disponibles del día
     */
    getAvailableSlotsForDay: (day, month, year, slots) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return slots.filter(slot => slot.fecha === dateStr && slot.disponible)
    },

    /**
     * Obtiene el rango horario disponible para un día
     * @param {number} day - Día del mes
     * @param {number} month - Mes (0-11)
     * @param {number} year - Año
     * @param {Array} slots - Array de slots disponibles
     * @returns {Object|null} Objeto con inicio, fin y minutos o null
     */
    getRangoHorario: (day, month, year, slots) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const slotsDelDia = slots.filter(slot => slot.fecha === dateStr && slot.disponible)
        
        if (slotsDelDia.length === 0) return null

        const horarios = slotsDelDia.map(s => s.horario_inicio).sort()
        const horaInicio = horarios[0]
        const horaFin = calendarUtils.sumar20Minutos(horarios[horarios.length - 1])
        
        return {
            inicio: horaInicio,
            fin: horaFin,
            inicioMinutos: calendarUtils.toMinutes(horaInicio),
            finMinutos: calendarUtils.toMinutes(horaFin)
        }
    },

    /**
     * Obtiene la semana del mes para una fecha
     * @param {Date} date - Fecha
     * @returns {number} Número de semana del mes
     */
    getWeekOfMonth: (date) => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
        const dayOfWeek = (firstDay.getDay() + 6) % 7 // Lunes=0, Domingo=6
        return Math.ceil((date.getDate() + dayOfWeek) / 7)
    },

    /**
     * Obtiene el color según el tipo de evento
     * @param {string} type - Tipo de evento
     * @returns {string} Clases CSS de color
     */
    getEventColor: (type) => {
        switch (type?.toLowerCase()) {
            case 'punción':
            case 'puncion':
                return 'bg-chart-2/30 border-chart-2 text-chart-2'
            case 'consulta':
                return 'bg-chart-1/30 border-chart-1 text-chart-1'
            case 'monitoreo':
                return 'bg-chart-4/30 border-chart-4 text-chart-4'
            default:
                return 'bg-muted border-muted text-foreground'
        }
    },

    /**
     * Obtiene el color del borde según el tipo de cita
     * @param {string} kind - Tipo de cita
     * @returns {string} Clase CSS del borde
     */
    getAppointmentTypeColor: (kind) => {
        const colors = {
            monitoreo: "border-l-chart-4",
            puncion: "border-l-chart-2",
            turno: "border-l-chart-1"
        }
        return colors[kind] || "border-l-primary"
    },
    
    /**
     * Obtiene los turnos de un paciente desde la API
     * @param {number} idPaciente - ID del paciente
     * @returns {Promise<Array>} Promise con los turnos del paciente
     */
    fetchTurnosPaciente: (idPaciente) => {
        return axios.get(`/turnos/v1/get_turnos_paciente?id_paciente=${idPaciente}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9ncnVwbyI6MTAsImlhdCI6MTc2NDg3NDgxNX0.Lgd1mqiMv6ZdPysSS0Eqwj0VawAXixUL7frx9pm4API`
            }
        })
        .then(response => {
            return response.data.data.map(turno => {
                const fechaHora = new Date(turno.fecha_hora)
                return {
                    id: turno.id,
                    id_medico: turno.id_medico,
                    id_paciente: turno.id_paciente,
                    fecha_hora: turno.fecha_hora,
                    fecha: fechaHora.toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }),
                    hora: fechaHora.toTimeString().slice(0, 5),
                    estado: 'confirmada'
                }
            })
        })
    },

    /**
     * Cancela una reserva de turno
     * @param {number} idTurno - ID del turno
     * @returns {Promise} Promise con la respuesta de la API
     */
  
    /**
     * Cancela una reserva de turno
     * @param {number} idTurno - ID del turno
     * @returns {Promise} Promise con la respuesta de la API
     */
    cancelarTurno: (idTurno) => {
        console.log('Cancelando turno con ID:', idTurno) // Debug
        
        if (!idTurno) {
            return Promise.reject(new Error('ID de turno no proporcionado'))
        }
        
        return axios.patch(`/turnos/v1/cancelar_turno?id_turno=${Number(idTurno)}`, null, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9ncnVwbyI6MTAsImlhdCI6MTc2NDg3NDgxNX0.Lgd1mqiMv6ZdPysSS0Eqwj0VawAXixUL7frx9pm4API`
            }
        })
    },
    /**
     * Nombres de los meses
     */
    monthNames: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],

    /**
     * Nombres de los días de la semana
     */
    daysOfWeek: [
        { value: 1, label: 'Lunes' },
        { value: 2, label: 'Martes' },
        { value: 3, label: 'Miércoles' },
        { value: 4, label: 'Jueves' },
        { value: 5, label: 'Viernes' },
        { value: 6, label: 'Sábado' },
        { value: 0, label: 'Domingo' }
    ],

    /**
     * Formatea una fecha a un string legible
     * @param {number} day - Día
     * @param {number} month - Mes (0-11)
     * @param {number} year - Año
     * @returns {string} Fecha formateada
     */
    formatDate: (day, month, year) => {
        return new Date(year, month, day).toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
    }
}