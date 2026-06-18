import { apiRequest } from "./client";

export const getCarreras = async () => {
  const data = await apiRequest("/carrera", { method: "GET" });
  return Array.isArray(data) ? data : [];
};

// Semestres por carrera
export const getSemestresCarrera = async (id) => {
  const data = await apiRequest(`/carrera/${id}/semestre`, { method: "GET" });
  return Array.isArray(data) ? data : [];
};
