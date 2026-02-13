import { Stack } from "expo-router";
import "../global.css";
import { AuthProvider } from "../src/context/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {

  useEffect(() => {
    const setupNotifications = async () => {
      await Notifications.requestPermissionsAsync();

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.HIGH,
        });
      }
    };

    setupNotifications();
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: "#122017",
            },
          }}
        />
      </AuthProvider>
    </SafeAreaProvider>
  );
}