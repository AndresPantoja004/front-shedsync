import { apiRequest } from "./client";

export const obtenerHorario = async (idEstudiante) => {
  const data = await apiRequest(`/horario/${idEstudiante}/estudiante`, {
    method: "GET",
  });
  return Array.isArray(data) ? data : [];
};
