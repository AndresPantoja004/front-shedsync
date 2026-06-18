import { API_URL } from "./config";

// Tiempo máximo de espera antes de considerar al microservicio como caído/colgado.
const TIMEOUT_MS = 15000;

/**
 * Cliente HTTP central para toda la app.
 *
 * Resuelve los modos de fallo típicos cuando un microservicio se detiene:
 *  - `fetch` lanza `TypeError: Network request failed` (conexión rechazada / sin red).
 *  - El gateway responde con HTML (502/503) y `response.json()` reventaría con SyntaxError.
 *  - La petición se queda colgada (timeout).
 *  - Respuesta vacía (204 / sin cuerpo).
 *
 * Garantiza que SIEMPRE se lance un `Error` con un mensaje legible en español,
 * para que la UI solo muestre el error y la app no se caiga.
 *
 * @param {string} path - Ruta relativa (ej. "/carrera") o URL absoluta.
 * @param {RequestInit} options - Opciones estándar de fetch.
 * @returns {Promise<any>} El cuerpo de la respuesta parseado (o null si está vacío).
 */
export async function apiRequest(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;

  let response;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      });
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    // Aquí caen: microservicio detenido (conexión rechazada), sin internet,
    // DNS, o timeout (AbortError). Nunca exponemos el error técnico crudo.
    if (error?.name === "AbortError") {
      throw new Error(
        "El servidor tardó demasiado en responder. Intenta de nuevo más tarde.",
      );
    }
    throw new Error(
      "No se pudo conectar con el servidor. Verifica tu conexión o el servicio no está disponible.",
    );
  }

  // Leemos el cuerpo como texto primero: así un 502/503 con HTML no rompe el parseo.
  const rawBody = await response.text().catch(() => "");
  let data = null;
  if (rawBody) {
    try {
      data = JSON.parse(rawBody);
    } catch {
      // El servicio respondió algo que no es JSON (página de error del gateway, etc.)
      data = null;
    }
  }

  if (!response.ok) {
    const message =
      (data && (data.message || data.error || data.msg)) ||
      `El servicio no está disponible en este momento (código ${response.status}).`;
    throw new Error(message);
  }

  return data;
}
