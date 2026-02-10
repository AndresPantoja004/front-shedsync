import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useColorScheme } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
//importar iconos
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import { userInfo } from "../services/api/user";

export default function Home() {
  const scheme = useColorScheme();
  const { logout } = useContext(AuthContext);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await userInfo();
        setUser(data);
      } catch (error) {
        console.error("Error cargando usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []); // 👈 IMPORTANTE: array vacío

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Cargando...</Text>
      </View>
    );
  }
  return (
    <View
      className={`flex-1 ${scheme === "dark" ? "bg-background-light" : "bg-background-dark"}`}
    >
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-3">
        <View className="flex-row items-center gap-4">
          <View className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary/30">
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsnSHLKhXARpNT9WwCO3TGqDtmTzNiCboB-b9OyZqjzF96RzMY1gXFuIoEHY8-VwX-pU5tqOutxKXBDi3rGGR6ZVJvM5N1OGgWN4Vr3PNlAhdQ4332Wgz7wCW1uvZscSdHsMiabnl5rpxN-abjRNaIzviHvKoloBY5sxHnGQNgWEzDcW_Yy0EPInzjYhRetjEZ60clamx6stvBSD_xBYs4dsUysrHRs1BOulpkCNqPntEWmCaesT0PlzWqMOU5EQU0gJJ1wacVc7s",
              }}
              className="w-full h-full"
            />
          </View>

          <View>
            <Text className="text-sm text-gray-400">Buenos días,</Text>
            <Text className="text-xl font-bold text-white">
              Hola, {user?.nombres}
            </Text>
            <TouchableOpacity
              onPress={() => handleLogout()}
              className="flex flex-row text-center items-center justify-center"
            >
              <Text className="flex flex-row justify-center items-center r text-primary  font-bold mt-1 bg-red-500/20 px-2 py-1 rounded  ">
                <Ionicons
                  name="close-circle-outline"
                  size={24}
                  color="white"
                  className="mr-1"
                />
                <Text className="text-center justify-center items-center">
                  Cerrar Sesión{" "}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-12 w-12 rounded-full bg-surface-dark items-center justify-center relative">
          <Text className="text-white text-lg">
            <Ionicons name="notifications" size={24} color="white" />
          </Text>
          <View className="absolute top-3 right-3 h-2.5 w-2.5 rounded-xl bg-green-500" />
        </View>
      </View>

      <ScrollView
        className="px-6"
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* EN CURSO */}
        <View className="mt-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold text-white">En curso</Text>
            <Text className="text-primary text-sm font-semibold">● Ahora</Text>
          </View>

          <View className="rounded-xl bg-surface-dark p-5 overflow-hidden">
            <View className="flex-row justify-between mb-4">
              <View>
                <Text className="text-primary text-sm font-medium">
                  Laboratorio 404
                </Text>
                <Text className="text-2xl font-bold text-white">
                  Base de Datos II
                </Text>
              </View>

              <View className="bg-primary/20 px-3 py-1 rounded-full text-center justify-center">
                <Text className="text-primary text-base font-bold text-center">
                  10:00 - 12:00
                </Text>
              </View>
            </View>

            <View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-xs text-gray-300">Tiempo restante</Text>
                <Text className="text-xs text-gray-300">45 min</Text>
              </View>

              <View className="h-2 bg-white/10 rounded-full overflow-hidden">
                <View className="h-full bg-primary w-[65%] rounded-full" />
              </View>
            </View>
          </View>
        </View>

        {/* ACCESOS RAPIDOS */}
        <View className="mt-6">
          <Text className="text-lg font-bold text-white mb-3">
            Accesos rápidos
          </Text>

          <View className="flex-row justify-between gap-3">
            {[
              {
                label: "Ver\nHorario",
                icon: (
                  <AntDesign name="schedule" size={24} color="bg-primary" />
                ),
              },
              {
                label: "Buscar\nEspacios",
                icon: <Ionicons name="location" size={24} color="bg-primary" />,
              },
              {
                label: "Reportar\nIncidente",
                icon: (
                  <Ionicons
                    name="alert-circle-sharp"
                    size={24}
                    color="bg-primary"
                  />
                ),
              },
            ].map((item, i) => (
              <TouchableOpacity
                key={i}
                className="flex-1 bg-surface-dark rounded-xl items-center py-4"
              >
                <View className="h-12 w-12 rounded-full bg-primary/10 items-center justify-center mb-2">
                  <Text className="text-primary text-xl">{item.icon}</Text>
                </View>
                <Text className="text-sm font-bold text-white text-center">
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* NOVEDADES */}
        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-white">Novedades</Text>
            <Text className="text-primary text-xs font-bold">Ver todo</Text>
          </View>

          {/* Card 1 */}
          <View className="bg-surface-dark rounded-xl p-4 border-l-4 border-primary mb-3">
            <Text className="text-sm font-bold text-white">Cambio de Aula</Text>
            <Text className="text-xs text-gray-400 mt-1">
              La clase de Matemáticas Discretas se mueve al Aula 2B por
              mantenimiento.
            </Text>
            <Text className="text-[10px] text-gray-500 mt-2">Hace 2 horas</Text>
          </View>

          {/* Card 2 */}
          <View className="bg-surface-dark rounded-xl p-4 border-l-4 border-amber-500">
            <Text className="text-sm font-bold text-white">
              Entrega Pendiente
            </Text>
            <Text className="text-xs text-gray-400 mt-1">
              El proyecto final de Ética se entrega mañana antes de las 11:59
              PM.
            </Text>
            <Text className="text-[10px] text-gray-500 mt-2">Hace 30 min</Text>
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM NAV */}
      <View className="absolute bottom-6 left-6 right-6 bg-surface-dark/80 rounded-2xl flex-row justify-between px-4 py-2">
        {[
          <Entypo name="home" size={24} color="#38e07b" />,
          <Entypo name="calendar" size={24} color="gray" />,
          <Entypo name="location" size={24} color="gray" />,
          <AntDesign name="user" size={24} color="gray" />,
        ].map((icon, i) => (
          <View
            key={i}
            className={`flex-1 items-center ${
              i === 0 ? "text-primary" : "text-gray-400"
            }`}
          >
            <Text className="text-xl">{icon}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
