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

        if (!response.ok) {
            throw new Error(data.message || 'Error en el user get');
        }

        return data;
    } catch (error) {
        console.error('Error en la función user get:', error);
        throw error;
    }
};