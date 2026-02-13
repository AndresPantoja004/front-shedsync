import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";


export const userInfo = async () => {
    const storedToken = await AsyncStorage.getItem("token");
    try {
        console.log('URL de la API en usuario:', `${API_URL}/estudiante`);
        const response = await fetch(`${API_URL}/estudiante`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`
            },
        });

        const data = await response.json();

        console.log("DATA USER", data)

        if (!response.ok) {
            throw new Error(data.message || 'Error en el user get');
        }

        return data;
    } catch (error) {
        console.error('Error en la función user get:', error);
        throw error;
    }
};

export const asignarRol = async (id_usuario, id_rol) => {
    try {
        const token = await AsyncStorage.getItem("token");

        const response = await fetch(
            `${API_URL}/usuario/${id_usuario}/asignar-rol`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    /* Authorization: token ? `Bearer ${token}` : undefined, */
                },
                body: JSON.stringify({
                    id_rol,
                }),
            }
        );

        console.log("data de ROL ASIG", response)

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg || "Error asignando rol");
        }

        return data;
    } catch (error) {
        console.error("Error en asignarRol:", error);
        throw error;
    }
};

//Actualizar  info user

export const actualizarPerfil = async (token, datos) => {
    try {
        const response = await fetch(`${API_URL}/usuario/perfil`, {
            method: 'PUT', // Verifica si en tu backend es PUT o POST
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(datos),
        });

        // Si el servidor envía un error (como 404 o 500), 'response.json()' fallará si es HTML
        if (!response.ok) {
            const errorText = await response.text(); // Lee el error como texto para depurar
            console.log("Error del servidor (HTML):", errorText);
            throw new Error("Error en el servidor");
        }

        return await response.json();
    } catch (error) {
        console.error('Error detallado:', error);
        throw error;
    }
};
