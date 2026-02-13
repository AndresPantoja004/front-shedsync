import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";

/**
 * Envía un reporte de incidencia al servidor
 * @param {string} imagenBase64 - String de la imagen en base64
 * @param {string} tipo - Categoría de la incidencia
 * @param {string} descripcion - Detalle del problema
 * @param {number} id_usuario - ID del usuario que reporta
 * @param {number} id_espacio - ID del laboratorio o aula
 * @param {number} id_equipo - ID del equipo específico (opcional)
 */
export const enviarIncidencia = async (imagenBase64, tipo, descripcion, id_usuario, id_espacio, id_equipo) => {
  try {
    // Es recomendable obtener el token si tu ruta está protegida
    const token = await AsyncStorage.getItem("token");
    console.log("USER TOKEN", token)

    const response = await fetch(`${API_URL}/incidencia/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Descomenta si usas JWT
      },
      body: JSON.stringify({
        tipo,
        descripcion,
        imagen: imagenBase64,
        id_usuario: parseInt(id_usuario), // Aseguramos que sean números
        id_espacio: parseInt(id_espacio),
        id_equipo: id_equipo ? parseInt(id_equipo) : null, // Puede ser nulo si es una incidencia general del espacio
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al crear la incidencia');
    }

    console.log('✅ Reporte creado exitosamente:', data);
    return data;

  } catch (error) {
    console.error('❌ Error en enviarIncidencia:', error);
    throw error;
  }
};