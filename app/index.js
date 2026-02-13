import { View, ActivityIndicator } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../src/context/AuthContext";
import Login from "../src/components/Auth/Login";
import Home from "../src/components/Home";

export default function Index() {
  const { token, loading } = useContext(AuthContext);

  // IMPORTANTE: Si está cargando (leyendo o borrando de AsyncStorage), 
  // no renderizamos nada que dispare peticiones API.
  if (loading) {
    return (
      <View className="flex-1 bg-background-dark items-center justify-center">
        <ActivityIndicator size="large" color="#38e07b" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-dark">
      {!token ? <Login /> : <Home />}
    </View>
  );
}