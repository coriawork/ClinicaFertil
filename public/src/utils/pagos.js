import axios from 'axios';

const numero_grupo = 10;
const BASE_URL = '/pagos/v1';

export const pagosApi = {
    // Obtener todas las obras sociales
    getObrasSociales: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/getObrasSociales`, {
                timeout: 30000
            });
            console.log('OBRAS SOCIALES', response.data);
            return response.data.data;
        } catch (error) {
            console.error('Error al obtener obras sociales:', error);
            throw error;
        }
    },

    // Obtener una obra social específica
    getObraSocial: async (id) => {
        try {
            const response = await axios.post(`${BASE_URL}/get-obra-social`, {
                id
            }, {
                timeout: 30000
            });
            return response.data;
        } catch (error) {
            console.error('Error al obtener obra social:', error);
            throw error;
        }
    },

    // Obtener deuda de un paciente
    getDeudaPaciente: async (idPaciente) => {
        try {
            const response = await axios.post(`${BASE_URL}/deuda-paciente`, {
                id_paciente: idPaciente,
                numero_grupo: numero_grupo
            }, {
                timeout: 30000
            });
            return response.data;
        } catch (error) {
            console.error('Error al obtener deuda del paciente:', error);
            throw error;
        }
    },

    // Obtener deuda de una obra social
    getDeudaObraSocial: async (idObra) => {
        try {
            const response = await axios.post(`${BASE_URL}/deuda-obra-social`, {
                id_obra: idObra,
                numero_grupo: numero_grupo
            }, {
                timeout: 30000
            });
            return response.data.data;
        } catch (error) {
            console.error('Error al obtener deuda de obra social:', error);
            throw error;
        }
    },

    // Obtener total cobrado a una obra social
    getTotalCobradoObra: async (idObra) => {
        try {
            const response = await axios.post(`${BASE_URL}/total-cobrado-obra`, {
                id_obra: idObra,
                numero_grupo: numero_grupo
            }, {
                timeout: 30000
            });
            return response.data;
        } catch (error) {
            console.error('Error al obtener total cobrado a obra social:', error);
            throw error;
        }
    },

    // Obtener total cobrado a un paciente
    getTotalCobradoPaciente: async (idPaciente) => {
        try {
            const response = await axios.post(`${BASE_URL}/total-cobrado-paciente`, {
                id_paciente: idPaciente,
                numero_grupo: numero_grupo
            }, {
                timeout: 30000
            });
            return response.data;
        } catch (error) {
            console.error('Error al obtener total cobrado al paciente:', error);
            throw error;
        }
    },

    // Registrar una orden de pago
    registrarOrdenPago: async (idPaciente, monto, idObra) => {
        try {
            const response = await axios.post(`${BASE_URL}/registrar-orden-pago`, {
                grupo: numero_grupo,
                id_paciente: idPaciente,
                monto: monto,
                id_obra: idObra
            }, {
                timeout: 30000
            });
            return response.data;
        } catch (error) {
            console.error('Error al registrar orden de pago:', error);
            throw error;
        }
    },

    // Registrar un pago
    registrarPago: async (idPago, obraSocialPagada, pacientePagado) => {
        try {
            const response = await axios.post(`${BASE_URL}/registrar-pago-obra-social`, {
                id_grupo: numero_grupo,
                id_pago: idPago,
                obra_social_pagada: obraSocialPagada,
                paciente_pagado: pacientePagado
            }, {
                timeout: 30000
            });
            return response.data;
        } catch (error) {
            console.error('Error al registrar pago:', error);
            throw error;
        }
    },

    // Obtener un pago del grupo
    getPagoGrupo: async (pagoId) => {
        try {
            const response = await axios.post(`${BASE_URL}/get-pago-grupo`, {
                group: numero_grupo,
                pago_id: pagoId
            }, {
                timeout: 30000
            });
            return response.data;
        } catch (error) {
            console.error('Error al obtener pago del grupo:', error);
            throw error;
        }
    },

    // Obtener todos los pagos del grupo
    getTodosPagosGrupo: async () => {
        try {
            const response = await axios.post(`${BASE_URL}/get-pagos-grupo`, {
                group: numero_grupo
            }, {
                timeout: 30000
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error al obtener pagos del grupo:', error);
            throw error;
        }
    }
};