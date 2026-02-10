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