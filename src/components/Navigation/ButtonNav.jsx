import { View, TouchableOpacity } from "react-native";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: "home", icon: "home", lib: Entypo, path: "/" },
    { name: "calendar", icon: "calendar", lib: Entypo, path: "/horario" },
    { name: "location", icon: "location", lib: Entypo, path: "/aulasdis" },
    { name: "user", icon: "user", lib: AntDesign, path: "/perfil" },
  ];

  return (
    <View className="absolute bottom-6 left-6 right-6 bg-surface-dark/90 rounded-2xl flex-row justify-between px-4 py-3 shadow-2xl border border-white/5">
      {tabs.map((tab, i) => {
        const IconLib = tab.lib;
        const isActive = pathname === tab.path;

        return (
          <TouchableOpacity
            key={i}
            onPress={() => router.push(tab.path)}
            className="flex-1 items-center justify-center"
          >
            <IconLib 
              name={tab.icon} 
              size={24} 
              color={isActive ? "#38e07b" : "gray"} 
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}