import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";
import { parseQueryParams } from "expo-router/build/fork/getStateFromPath-forks";


export const getEspaciosDisponibles = async (tipo) => {
    try {
        const response = await fetch(`${API_URL}/espacio/disponibles?tipo=${tipo}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        console.log("TIPO DE ESPACIO DIS: ", tipo)
        console.log("DATA ", data)

        if (!response.ok) {
            throw new Error(data.message || 'Error en get espacios');
        }

        return data;
    } catch (error) {
        console.error('Error en la función espacios disponibles get:', error);
        throw error;
    }
};