import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";

export const obtenerHorario = async (idEstudiante) => {
  const response = await fetch(
    `${API_URL}/horario/${idEstudiante}/estudiante`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al obtener horario");
  }

  return data;
};