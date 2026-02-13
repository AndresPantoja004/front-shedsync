import { Stack } from "expo-router";
import "../global.css";
import { AuthProvider, AuthContext } from "../src/context/AuthContext"; // Importa ambos
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useContext, useState } from "react";
import BottomNav from "../src/components/Navigation/ButtonNav";
import AnimatedSplash from "../src/components/AnimatedSplash";

// 1. Creamos un componente pequeño para el contenido
function RootLayoutContent() {
  const { token, loading } = useContext(AuthContext);


  // Si está cargando el token de AsyncStorage, no mostramos nada aún
  if (loading) return null;

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "#122017",
          },
        }}
      />
      {/* 2. Ahora sí, aquí el token ya es accesible */}
      {token ? <BottomNav /> : null}
    </>
  );
}

// 3. El RootLayout principal solo envuelve con los Providers
export default function RootLayout() {
  const [splashFinished, setSplashFinished] = useState(false);
  return (
    <SafeAreaProvider>
      <AuthProvider>
        {!splashFinished ? (
          <AnimatedSplash onFinish={() => setSplashFinished(true)} />
        ) : (
          <RootLayoutContent />
        )}
      </AuthProvider>
    </SafeAreaProvider>
  );
}