import { API_URL } from './config';

// =======================
// REGISTRO
// =======================
export const register = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en el registro');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// =======================
// LOGIN
// =======================
export const login = async (email, password) => {
  try {
    console.log('Credenciales en LOGIN:', email, password);
    console.log('URL de la API en LOGIN:', `${API_URL}/auth/login`);
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en el login');
    }

    return data;
  } catch (error) {
    console.error('Error en la función login:', error);
    throw error;
  }
};
