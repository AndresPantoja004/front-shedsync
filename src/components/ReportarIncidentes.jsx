import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useColorScheme } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

const LABORATORIOS_MOCK = [
  { id_laboratorio: 1, nombre: "LAB QUIMICA AULA A13" },
  { id_laboratorio: 2, nombre: "LAB QUIMICA AULA 11" },
  { id_laboratorio: 3, nombre: "LAB DCCO 04" },
  { id_laboratorio: 4, nombre: "LAB QUIMICA AULA A02" },
  { id_laboratorio: 5, nombre: "LABORATORIO DCCO 06" },
  { id_laboratorio: 6, nombre: "LAB 3" },
  { id_laboratorio: 7, nombre: "LAB QUIM. AULA A02" },
  { id_laboratorio: 8, nombre: "CPE-AULA A-03 O LAB BIOLOGIA CELULAR" },
  { id_laboratorio: 9, nombre: "LAB QUIMICA AULA A10" },
  { id_laboratorio: 10, nombre: "LAB QUÍMICA AULA A04" },
  { id_laboratorio: 11, nombre: "LAB QUÍMICA AULA A13" },
];

const CATEGORIAS = [
  "Equipo dañado",
  "Infraestructura",
  "Limpieza",
  "Objetos Perdidos",
];

export default function ReportarIncidencia({ navigation }) {
  const scheme = useColorScheme();

  const reportesEnMemoria = useRef([]);
  const router = useRouter()

  const [categoria, setCategoria] = useState("Equipo dañado");
  const [laboratorios, setLaboratorios] = useState([]);
  const [laboratorioId, setLaboratorioId] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    // Simula GET /api/laboratorio/
    setLaboratorios(LABORATORIOS_MOCK);
  }, []);

  const enviarReporte = () => {
    if (!laboratorioId || descripcion.trim().length < 10) {
      Alert.alert(
        "Datos incompletos",
        "Selecciona un laboratorio y describe mejor el problema."
      );
      return;
    }

    const nuevoReporte = {
      id: Date.now(),
      categoria,
      laboratorioId,
      descripcion,
      fecha: new Date(),
    };

    reportesEnMemoria.current.push(nuevoReporte);

    console.log("📌 Reportes en memoria:", reportesEnMemoria.current);

    Alert.alert("Reporte enviado", "La incidencia fue registrada correctamente.");

    // Reset form
    setCategoria("Equipo dañado");
    setLaboratorioId("");
    setDescripcion("");
  };

  return (
    <View
      className={`flex-1 ${
        scheme === "dark" ? "bg-background-dark" : "bg-background-dark"
      }`}
    >
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4">
        <TouchableOpacity onPress={() => router.push("/")}>
          <Ionicons name="close" size={26} color="white" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-white">
          Nueva Incidencia
        </Text>

        <Text className="text-primary font-bold text-sm">
          Ayuda
        </Text>
      </View>

      {/* CONTENIDO */}
      <ScrollView
        className="px-6"
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        {/* CATEGORÍA */}
        <Text className="text-2xl font-bold text-white mb-4">
          ¿Qué sucedió?
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-3 mb-8">
            {CATEGORIAS.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategoria(cat)}
                className={`px-5 py-3 rounded-full ${
                  categoria === cat
                    ? "bg-primary"
                    : "bg-surface-dark border border-border-green"
                }`}
              >
                <Text
                  className={`text-sm font-bold ${
                    categoria === cat
                      ? "text-background-dark"
                      : "text-white/80"
                  }`}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* UBICACIÓN */}
        <Text className="text-2xl font-bold text-white mb-4">
          Ubicación
        </Text>

        <View className="bg-surface-dark border border-border-green rounded-xl mb-8">
          <Picker
            selectedValue={laboratorioId}
            onValueChange={(value) => setLaboratorioId(value)}
            dropdownIconColor="#9ca3af"
          >
            <Picker.Item label="Seleccionar laboratorio" value="" />
            {laboratorios.map((lab) => (
              <Picker.Item
                key={lab.id_laboratorio}
                label={lab.nombre}
                value={lab.id_laboratorio}
              />
            ))}
          </Picker>
        </View>

        {/* DETALLES */}
        <Text className="text-2xl font-bold text-white mb-4">
          Detalles
        </Text>

        <TextInput
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          placeholder="Describe el problema detalladamente..."
          placeholderTextColor="#9ca3af"
          className="min-h-[140px] bg-surface-dark border border-border-green rounded-xl p-4 text-white mb-10"
          style={{ textAlignVertical: "top" }}
        />
      </ScrollView>

      {/* BOTÓN ENVIAR */}
      <View className="absolute bottom-24 left-0 w-full px-6">
        <TouchableOpacity
          onPress={enviarReporte}
          className="h-14 bg-primary rounded-full flex-row items-center justify-center gap-2 shadow-lg active:scale-95"
        >
          <Text className="text-background-dark text-lg font-bold">
            Enviar Reporte
          </Text>
          <MaterialIcons name="send" size={20} color="#122017" />
        </TouchableOpacity>
      </View>
    </View>
  );
}