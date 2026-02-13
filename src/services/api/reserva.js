import { API_URL } from "./config";

/**
 * Crear una nueva reserva en la base de datos
 * @param {Object} reservaData - { id_espacio, fecha, hora_inicio, hora_fin }
 */
export const crearReserva = async (reservaData) => {
  const response = await fetch(`${API_URL}/reservas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(reservaData),
  });

  const data = await response.json();

  if (!response.ok) {
    // Esto captura el error "El espacio ya está reservado..." de tu controlador
    throw new Error(data.error || "Error al crear la reserva");
  }

  return data;
};

/**
 * Obtener reservas filtradas por fecha
 */
export const obtenerReservasPorFecha = async (fecha) => {
  const response = await fetch(`${API_URL}/reservas?fecha=${fecha}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al obtener reservas");
  }

  return data;
};

/**
 * Cancelar una reserva existente
 */
export const cancelarReserva = async (idReserva) => {
  const response = await fetch(`${API_URL}/reservas/${idReserva}/cancelar`, {
    method: "PUT",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al cancelar la reserva");
  }

  return data;
};