
import { API_URL } from "./config";



/**
 * Obtiene los espacios disponibles filtrados por tipo y búsqueda opcional.
 * @param {string} tipo - El tipo de espacio (AULA, LABORATORIO, etc.)
 * @param {string} search - El texto de búsqueda para el nombre del espacio.
 */
export const getEspaciosDisponibles = async (tipo, search = "") => {
    try {
        // Construimos la URL con los parámetros de consulta (Query Params)
        // Usamos encodeURIComponent para manejar espacios o caracteres especiales en la búsqueda
        const url = `${API_URL}/espacio/disponibles?tipo=${tipo}&search=${encodeURIComponent(search)}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Si tu ruta requiere autenticación, no olvides el token:
                // 'Authorization': `Bearer ${token}` 
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener espacios');
        }

        return data;
    } catch (error) {
        console.error('Error en getEspaciosDisponibles:', error);
        throw error;
    }
};


/**
 * Obtiene los espacios disponibles filtrados por tipo y búsqueda opcional.
 * @param {string} tipo - El tipo de espacio (AULA, LABORATORIO, etc.)
 * @param {string} search - El texto de búsqueda para el nombre del espacio.
 */
export const getEspacios = async (tipo, search = "") => {
    try {
        // Construimos la URL con los parámetros de consulta (Query Params)
        // Usamos encodeURIComponent para manejar espacios o caracteres especiales en la búsqueda
        const url = `${API_URL}/espacio/?tipo=${tipo}&search=${encodeURIComponent(search)}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Si tu ruta requiere autenticación, no olvides el token:
                // 'Authorization': `Bearer ${token}` 
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener espacios');
        }

        return data;
    } catch (error) {
        console.error('Error en getEspaciosDisponibles:', error);
        throw error;
    }
};