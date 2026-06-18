import { apiRequest } from "./client";

/**
 * Obtiene los espacios disponibles filtrados por tipo y búsqueda opcional.
 * @param {string} tipo - El tipo de espacio (AULA, LABORATORIO, etc.)
 * @param {string} search - El texto de búsqueda para el nombre del espacio.
 */
export const getEspaciosDisponibles = async (tipo, search = "") => {
  const url = `/espacio/disponibles?tipo=${tipo}&search=${encodeURIComponent(search)}`;
  const data = await apiRequest(url, { method: "GET" });
  return Array.isArray(data) ? data : [];
};

/**
 * Obtiene los espacios filtrados por tipo y búsqueda opcional.
 * @param {string} tipo - El tipo de espacio (AULA, LABORATORIO, etc.)
 * @param {string} search - El texto de búsqueda para el nombre del espacio.
 */
export const getEspacios = async (tipo, search = "") => {
  const url = `/espacio/?tipo=${tipo}&search=${encodeURIComponent(search)}`;
  const data = await apiRequest(url, { method: "GET" });
  return Array.isArray(data) ? data : [];
};
