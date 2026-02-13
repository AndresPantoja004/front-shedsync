import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../../src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function PerfilScreen() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  // Función para manejar el cierre de sesión y redirección
  const handleLogout = async () => {
    try {
      // 1. Ejecutamos el logout que limpia AsyncStorage y el estado global
      await logout();
      router.replace("/")
      // 2. Usamos replace para limpiar el stack de navegación
      
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const roles = { 1: "Estudiante", 2: "Profesor", 3: "Administrador" };
  const nombreCompleto = user?.nombres || "Usuario";
  const iniciales = nombreCompleto
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .substring(0, 2);

  const infoAcademica = [
    {
      label: "Rol",
      value: roles[user?.rol] || "N/A",
      icon: "person",
    },
    {
      label: "Carrera",
      value: user?.carrera || "No asignada",
      icon: "code-slash-outline",
    },
    {
      label: "Tipo",
      value: user?.tipo === "Z" ? "Presencial" : "Distancia",
      icon: "layers-outline",
    },
  ];

  return (
    <View className="flex-1 bg-background-dark mb-10">
      <View className="pt-16 pb-8 items-center bg-surface-dark/40 rounded-b-[40px] border-b border-white/5">
        <View className="h-28 w-28 rounded-full bg-primary/20 border-4 border-primary items-center justify-center mb-4 overflow-hidden">
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} className="w-full h-full" />
          ) : (
            <Text className="text-primary text-4xl font-bold">{iniciales}</Text>
          )}
        </View>
        <Text className="text-xl font-bold text-white text-center px-4">
          {nombreCompleto}
        </Text>
        <Text className="text-gray-400 text-sm mt-1">{user?.email}</Text>

        <TouchableOpacity
          className="mt-4 bg-primary px-6 py-2 rounded-full"
          onPress={() => router.push("/editar-perfil")}
        >
          <Text className="text-background-dark font-bold">Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="px-6 mt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-lg font-bold text-white mb-4">
          Información Académica
        </Text>
        <View className="bg-surface-dark rounded-2xl p-4 mb-6">
          {infoAcademica.map((item, index) => (
            <View
              key={index}
              className={`flex-row items-center py-3 ${index !== infoAcademica.length - 1 ? "border-b border-white/10" : ""}`}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color="#38e07b"
                className="mr-4"
              />
              <View>
                <Text className="text-gray-500 text-xs">{item.label}</Text>
                <Text className="text-white font-medium">{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text className="text-lg font-bold text-white mb-4">Contacto</Text>
        <View className="bg-surface-dark rounded-2xl p-4 mb-8">
          <View className="flex-row items-center py-3">
            <Ionicons
              name="call-outline"
              size={20}
              color="#3b82f6"
              className="mr-4"
            />
            <View>
              <Text className="text-gray-500 text-xs">Teléfono</Text>
              <Text className="text-white font-medium">
                {user?.phone || "Sin teléfono"}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={logout}
          className="flex-row items-center justify-center bg-red-500/10 py-4 rounded-2xl mb-20"
        >
          <Ionicons name="log-out-outline" size={22} color="#ef4444" />
          <Text className="text-red-500 font-bold ml-3  text-lg">
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
