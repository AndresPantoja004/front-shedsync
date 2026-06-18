import { apiRequest } from "./client";

/**
 * Crear una nueva reserva en la base de datos
 * @param {Object} reservaData - { id_espacio, fecha, hora_inicio, hora_fin }
 */
export const crearReserva = async (reservaData) => {
  return apiRequest("/reservas", {
    method: "POST",
    headers: { Accept: "application/json" },
    body: JSON.stringify(reservaData),
  });
};

/**
 * Obtener reservas filtradas por fecha
 */
export const obtenerReservasPorFecha = async (fecha) => {
  const data = await apiRequest(`/reservas?fecha=${fecha}`, { method: "GET" });
  return Array.isArray(data) ? data : [];
};

/**
 * Cancelar una reserva existente
 */
export const cancelarReserva = async (idReserva) => {
  return apiRequest(`/reservas/${idReserva}/cancelar`, { method: "PUT" });
};
