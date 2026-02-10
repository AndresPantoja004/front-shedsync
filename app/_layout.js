import { Text, View } from "react-native";
import { Slot } from "expo-router";
import "../global.css"
import { AuthProvider } from "../src/context/AuthContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "#122017",
          },
        }} />
      </AuthProvider>
    </SafeAreaProvider>
  );
}