import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // Nuevo estado para los datos del usuario
  const [loading, setLoading] = useState(true);
  const router =useRouter();

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");

        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser)); // Convertimos el string de vuelta a objeto
      } catch (e) {
        console.error("Error cargando datos de sesión", e);
      } finally {
        setLoading(false);
      }
    };
    loadStorageData();
  }, []);

  const login = async (newToken, userData) => {
    try {
      await AsyncStorage.setItem("token", newToken);
      await AsyncStorage.setItem("user", JSON.stringify(userData)); // Guardamos el objeto como string
      
      setToken(newToken);
      setUser(userData);
    } catch (e) {
      console.error("Error al guardar sesión", e);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      setToken(null);
      setUser(null);
      router.replace('/')
    } catch (e) {
      console.error("Error al cerrar sesión", e);
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}