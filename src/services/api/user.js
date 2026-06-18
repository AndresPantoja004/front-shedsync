import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "./client";

export const userInfo = async () => {
  const storedToken = await AsyncStorage.getItem("token");
  return apiRequest("/estudiante", {
    method: "GET",
    headers: { Authorization: `Bearer ${storedToken}` },
  });
};

export const asignarRol = async (id_usuario, id_rol) => {
  return apiRequest(`/usuario/${id_usuario}/asignar-rol`, {
    method: "POST",
    body: JSON.stringify({ id_rol }),
  });
};

// Actualizar info user
export const actualizarPerfil = async (token, datos) => {
  return apiRequest("/usuario/perfil", {
    method: "PUT", // Verifica si en tu backend es PUT o POST
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(datos),
  });
};
