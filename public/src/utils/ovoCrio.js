import axios from "axios";
const nro_grupo = 10;
import {toast} from "sonner";

export const OvoManage = {
    buscarOvocitoPorId: async (id) => {
        try {
            const response = await axios.post(
                '/ovocitos/v1/get-ovocito-posicion', 
                { ovocito_id: id, nro_grupo }, 
                { 
                    headers: {'Content-Type': 'application/json'},
                    timeout: 30000
                }
            );
            console.log('OVOCITO POR ID', response.data);
            return {
                encontrado: true,
                tubo: response.data.tanque_id,
                rack: response.data.rack_id,
                ...response.data
            };
        } catch (error) {
            console.error('Error al buscar ovocito por ID:', error);
            
            // Si el error es 404, el ovocito no está criopreservado
            if (error.response?.status === 404) {
                return {
                    encontrado: false,
                    tubo: null,
                    rack: null
                };
            }
            
            // Para otros errores, lanzar la excepción
            throw error;
        }
    },

    criopreservar: async (id) => {
        try {
            const response = await axios.post(
                '/ovocitos/v1/assign-ovocyte', 
                { ovocito_id: id, nro_grupo }, 
                { 
                    headers: {'Content-Type': 'application/json'},
                    timeout: 30000
                }
            );
            console.log('OVOCITO CRIOPRESERVADO', response.data);
            
            const { tubo, rack } = response.data;
            toast.success(`Ovocito criopreservado exitosamente. Tubo: ${tubo}, Rack: ${rack}`);
            
            return {
                exito: true,
                tubo: response.data.tanque_id || tubo,
                rack: response.data.rack_id || rack,
                ...response.data
            };
        } catch (error) {
            console.error('Error al criopreservar ovocito:', error);
            
            if (error.code === 'ECONNABORTED') {
                toast.error('Tiempo de espera agotado. Intente nuevamente.');
            } else if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.error || error.response.data?.message;
                
                if (status === 400) {
                    toast.error(message || 'El ovocito ya está registrado o datos inválidos.');
                } else if (status === 404) {
                    toast.error('Ovocito no encontrado.');
                } else if (status === 409) {
                    toast.error(message || 'El ovocito ya está criopreservado.');
                } else if (status === 500) {
                    toast.error('Error interno del servidor. Contacte al administrador.');
                } else {
                    toast.error(message || `Error del servidor: ${status}`);
                }
            } else if (error.request) {
                toast.error('No se pudo conectar con el servidor. Verifique su conexión.');
            } else {
                toast.error('Error al procesar la solicitud.');
            }
            
            throw error;
        }
    }
};