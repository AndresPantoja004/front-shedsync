import { Text, View} from "react-native";
import { Slot } from "expo-router";
import "../global.css"

export default function RootLayout() {
  return (
    <View className="bg-black flex-auto">
      <Slot />
    </View>
  );
}