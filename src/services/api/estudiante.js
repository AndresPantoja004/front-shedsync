import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";


export const getCarreras = async () => {
    try {
        console.log('URL de la API en estudiante:', `${API_URL}/estudiante`);
        const response = await fetch(`${API_URL}/carrera`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error en get carreras');
        }

        return data;
    } catch (error) {
        console.error('Error en la función carreras get:', error);
        throw error;
    }
};

export const crearEstudiante = async ({
  id_usuario,
  id_carrera,
  nombres,
  apellidos,
  tipo,
}) => {
  try {
    const token = await AsyncStorage.getItem("token");

    const response = await fetch(`${API_URL}/estudiante`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // si luego activas auth, ya queda listo
/*         Authorization: token ? `Bearer ${token}` : undefined, */
      },
      body: JSON.stringify({
        id_usuario,
        id_carrera,
        nombres,
        apellidos,
        tipo,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al crear estudiante");
    }

    return data; // aquí recibes id_estudiante
  } catch (error) {
    console.error("Error creando estudiante:", error);
    throw error;
  }
};


export const asignarSemestre = async (
  idEstudiante,
  id_semestre,
  id_tipoestu,
  asignaturas
) => {
  try {
    /* const token = await AsyncStorage.getItem("token"); */

    const response = await fetch(
      `${API_URL}/estudiante/${idEstudiante}/semestres`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          /* Authorization: `Bearer ${token}`, */
        },
        body: JSON.stringify({
          id_semestre,
          id_tipoestu,
          asignaturas, // array de ids
        }),
      }
    );

    const data = await response.json();
    console.log("DATA ASIGNAR MATERIAS", data )

    if (!response.ok) {
      throw new Error(data.error || "Error al asignar semestre");
    }

    return data;
  } catch (error) {
    console.error("Error asignando semestre:", error);
    throw error;
  }
};