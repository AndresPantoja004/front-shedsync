/**
 * Envía un mensaje de WhatsApp usando la API de WASenderAPI
 * @param {string} phone - Número destino con código de país (ej: "+593987654321")
 * @param {string} message - Contenido del mensaje de texto
 */
export const sendMessage = async (phone, message) => {
  // Cargamos la API KEY desde tu variable de entorno
  const API_KEY = process.env.WAPI_TOKEN; 
  const url = "https://www.wasenderapi.com/api/send-message";

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer cbf806c6311b32325864546f4caf4e6845146c05d2d77a0c6095f89005423ebb`
      },
      body: JSON.stringify({
        to: phone, // WASenderAPI espera el campo "to"
        text: message // WASenderAPI espera el campo "text"
      })
    });

    const data = await response.json();

    // Verificación de éxito de la respuesta
    if (!response.ok) {
      console.error('❌ Error de WASenderAPI:', data);
      throw new Error(data.message || 'Error en la petición al servidor');
    }

    console.log('✅ Mensaje enviado con éxito:', data);
    return data;

  } catch (error) {
    // Manejo de errores de red o configuración
    if (error.message.includes('Network request failed')) {
      console.error('❌ Error de red: No se pudo conectar con WASenderAPI. Revisa tu conexión.');
    } else {
      console.error('❌ Error al procesar el envío:', error.message);
    }
    throw error;
  }
};