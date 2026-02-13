import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";


export const getCarreras = async () => {
    try {
        console.log('URL de la API en carrera:', `${API_URL}/carrera`);
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


//Semestres por carrera
export const getSemestresCarrera = async (id) => {
    try {
        console.log('URL de la API en carrera:', `${API_URL}/carrera/${id}/semestre`);
        const response = await fetch(`${API_URL}/carrera/${id}/semestre`, {
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