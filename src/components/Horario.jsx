import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useColorScheme } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { obtenerHorario } from "../services/api/horario";

export default function Horario({ navigation }) {
  const scheme = useColorScheme();
  const router = useRouter();
  const [horario, setHorario] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState("LUNES");

  useEffect(() => {
    const cargarHorario = async () => {
      try {
        const data = await obtenerHorario(12); // 🔥 usa id real
        setHorario(data);
      } catch (error) {
        console.error(error);
      }
    };

    cargarHorario();
  }, []);

  const horarioDelDia = horario.filter((h) => h.dia === diaSeleccionado);
  return (
    <View
      className={`flex-1 ${
        scheme === "dark" ? "bg-background-light" : "bg-background-dark"
      }`}
    >
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-xs text-gray-400 uppercase">
            Horario Semanal
          </Text>
          <Text className="text-lg font-bold text-white">Martes</Text>
        </View>

        <Ionicons name="calendar" size={22} color="white" />
      </View>

      {/* DÍAS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-6 mb-4"
      >
        <View className="flex-row gap-3">
          {["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"].map((dia) => (
            <TouchableOpacity
              key={dia}
              onPress={() => setDiaSeleccionado(dia)}
              className={`px-4 py-3 rounded-2xl ${
                dia === diaSeleccionado ? "bg-primary" : "bg-surface-dark"
              }`}
            >
              <Text
                className={`font-bold ${
                  dia === diaSeleccionado
                    ? "text-background-dark"
                    : "text-white"
                }`}
              >
                {dia.slice(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* TIMELINE */}
      <ScrollView
        className="px-6"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {horarioDelDia.map((item, i) => (
          <View key={i} className="flex-row mb-6">
            {/* HORA */}
            {/* LÍNEA DE TIEMPO IZQUIERDA */}
            <View className="items-center w-16 mr-2">
              <Text className="text-[11px] font-bold text-slate-400 mb-1">
                {item.hora_inicio.slice(0, 5)}
              </Text>
              <View className="w-[2px] flex-1 bg-slate-700 my-1 items-center">
                <View className="w-3 h-3 rounded-full bg-primary border-4 border-[#0f172a] -mt-1" />
              </View>
              <Text className="text-[11px] text-slate-500 mt-1 mb-4">
                {item.hora_fin.slice(0, 5)}
              </Text>
            </View>

            {/* CONTENIDO */}
            <View className="flex-1">
              {item.descanso ? (
                <View className="border-2 border-dashed border-white/10 rounded-xl py-4 items-center">
                  <MaterialIcons name="coffee" size={18} color="#9ca3af" />
                  <Text className="text-gray-400 text-xs mt-1">Descanso</Text>
                </View>
              ) : (
                <View className="bg-surface-dark rounded-2xl p-4 relative overflow-hidden">
                  {/* COLOR BAR */}
                  <View
                    className={`absolute left-0 top-0 h-full w-1.5 bg-green-300`}
                  />

                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-xs font-bold text-gray-400">
                      Clase
                    </Text>
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={18}
                      color="#9ca3af"
                    />
                  </View>

                  <Text className="text-base font-bold text-white mb-1">
                    {item.Asignatura.nombre}
                  </Text>

                  <View className="flex-row items-center gap-2 mb-1">
                    <Ionicons name="time-outline" size={14} color="#9ca3af" />
                    <Text className="text-xs text-gray-400">
                      {item.hora_inicio.slice(0, 5)} -{" "}
                      {item.hora_fin.slice(0, 5)}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color="#9ca3af"
                    />
                    <Text className="text-xs text-gray-400">
                      {" "}
                      {item.Espacio.nombre}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
