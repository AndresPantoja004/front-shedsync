import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RegisterProvider } from "../../src/context/RegisterContext";

export default function RegisterLayout() {
  return (
    <RegisterProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </RegisterProvider>
  );
}