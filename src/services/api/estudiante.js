import { apiRequest } from "./client";

export const getCarreras = async () => {
  const data = await apiRequest("/carrera", { method: "GET" });
  return Array.isArray(data) ? data : [];
};

export const crearEstudiante = async ({
  id_usuario,
  id_carrera,
  nombres,
  apellidos,
  tipo,
}) => {
  return apiRequest("/estudiante", {
    method: "POST",
    body: JSON.stringify({
      id_usuario,
      id_carrera,
      nombres,
      apellidos,
      tipo,
    }),
  });
};

export const asignarSemestre = async (
  idEstudiante,
  id_semestre,
  id_tipoestu,
  asignaturas,
) => {
  return apiRequest(`/estudiante/${idEstudiante}/semestres`, {
    method: "POST",
    body: JSON.stringify({
      id_semestre,
      id_tipoestu,
      asignaturas, // array de ids
    }),
  });
};
