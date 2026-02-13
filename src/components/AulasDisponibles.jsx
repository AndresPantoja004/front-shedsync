import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { userInfo } from "../services/api/user";
import { sendMessage } from "../services/wapi/sendMesagge";

// Servicios de API
import { getEspaciosDisponibles } from "../services/api/espacios";
import { crearReserva } from "../services/api/reserva";

export default function BuscarEspacios() {
  const scheme = useColorScheme();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEspacio, setSelectedEspacio] = useState(null);

    // 1️⃣ Cargar usuario
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
  }, []);

  useEffect(() => {
    cargarEspacios(filtro);
  }, [filtro]);

  const cargarEspacios = async (tipo = "") => {
    setLoading(true);
    try {
      const data = await getEspaciosDisponibles(tipo);
      // Guardamos la info incluyendo los horarios que calcula el backend
      const espaciosNormalizados = data.map((e) => ({
        id: e.id_espacio,
        nombre: e.nombre,
        capacidad: e.capacidad,
        tipo: e.tipo.toLowerCase(),
        horarios: e.horarios || [], // El array que procesa tu controlador
      }));
      setEspacios(espaciosNormalizados);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los espacios");
    } finally {
      setLoading(false);
    }
  };

  const handleCrearReserva = async (horario) => {
    try {
      const payload = {
        id_espacio: selectedEspacio.id,
        fecha: new Date().toISOString().split("T")[0], // Fecha actual YYYY-MM-DD
        hora_inicio: horario.hora_inicio,
        hora_fin: horario.hora_fin,
        id_usuario: user?.id_usuario,
      };

      

      await crearReserva(payload);
      await sendMessage("593980098210","Se ha realizado una nueva reservación del "+selectedEspacio.id)
      Alert.alert("¡Éxito!", "Tu reserva ha sido registrada como PENDIENTE.");
      setModalVisible(false);
      cargarEspacios(filtro); // Recargar para actualizar estados visuales
    } catch (error) {
      Alert.alert("Atención", error.message || "Error al procesar reserva");
    }
  };

  const espaciosFiltrados = espacios.filter((e) =>
    e.nombre.toLowerCase().includes(search.toLowerCase()),
  );

  console.log("USUARIO DESDE DISPONIBLES ", user)

  return (
    <View
      className={`flex-1 ${scheme === "dark" ? "bg-background-light" : "bg-background-dark"}`}
    >
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-white">Reservar Espacio</Text>
        <View className="w-6" />
      </View>

      {/* SEARCH */}
      <View className="px-6 mb-3">
        <View className="flex-row items-center bg-surface-dark rounded-xl px-4 h-12">
          <Ionicons name="search" size={18} color="#9ca3af" />
          <TextInput
            placeholder="Buscar aula o laboratorio..."
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
            className="flex-1 ml-3 text-white"
          />
        </View>
      </View>

      {/* FILTROS */}
      <View className="px-6 mb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-3">
            {[
              { key: "", label: "Todos" },
              { key: "AULA", label: "Aulas" },
              { key: "LABORATORIO", label: "Laboratorios" },
            ].map((f) => (
              <TouchableOpacity
                key={f.label}
                onPress={() => setFiltro(f.key)}
                className={`px-4 py-1 rounded-full ${filtro === f.key ? "bg-primary" : "bg-surface-dark"}`}
              >
                <Text
                  className={`font-bold ${filtro === f.key ? "text-background-dark" : "text-white"}`}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* LISTA */}
      {loading ? (
        <ActivityIndicator size="large" color="#00FF00" className="mt-10" />
      ) : (
        <ScrollView
          className="px-6"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {espaciosFiltrados.map((e) => {
            // Un espacio se muestra "Ocupado" si todos sus horarios están ocupados o pasados
            const todosOcupados = e.horarios.every(
              (h) => h.estado !== "DISPONIBLE",
            );

            return (
              <View
                key={e.id}
                className="bg-surface-dark rounded-xl p-4 mb-4 border border-white/5"
              >
                <View className="flex-row justify-between mb-2">
                  <Text className="text-lg font-bold text-white">
                    {e.nombre}
                  </Text>
                  <View
                    className={`px-3 py-1 rounded-full ${todosOcupados ? "bg-red-500/20" : "bg-primary/20"}`}
                  >
                    <Text
                      className={`text-xs font-bold ${todosOcupados ? "text-red-400" : "text-primary"}`}
                    >
                      {todosOcupados ? "Lleno" : "Disponible"}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-4 mb-4">
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons name="layers" size={14} color="#9ca3af" />
                    <Text className="text-xs text-gray-400">
                      {e.tipo.toUpperCase()}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons name="group" size={14} color="#9ca3af" />
                    <Text className="text-xs text-gray-400">
                      Cap: {e.capacidad}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    setSelectedEspacio(e);
                    setModalVisible(true);
                  }}
                  className="bg-primary rounded-lg py-3 flex-row justify-center items-center gap-2"
                >
                  <MaterialIcons name="schedule" size={18} color="#122017" />
                  <Text className="font-bold text-background-dark">
                    Ver Horarios
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* MODAL DE HORARIOS */}
      <Modal transparent visible={modalVisible} animationType="slide">
        <View className="flex-1 bg-black/80 justify-end">
          <View className="bg-surface-dark rounded-t-3xl p-6 h-3/4">
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-xl font-bold text-white">
                  {selectedEspacio?.nombre}
                </Text>
                <Text className="text-gray-400">
                  Selecciona un bloque horario
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={32} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedEspacio?.horarios.map((h, index) => {
                const isDisponible = h.estado === "DISPONIBLE";

                return (
                  <TouchableOpacity
                    key={index}
                    disabled={!isDisponible}
                    onPress={() => handleCrearReserva(h)}
                    className={`flex-row items-center justify-between p-4 mb-3 rounded-xl border ${
                      isDisponible
                        ? "border-primary/30 bg-primary/5"
                        : "border-white/5 bg-white/5 opacity-50"
                    }`}
                  >
                    <View className="flex-row items-center gap-3">
                      <MaterialIcons
                        name="access-time"
                        size={20}
                        color={isDisponible ? "#00FF00" : "#9ca3af"}
                      />
                      <Text
                        className={`font-bold ${isDisponible ? "text-white" : "text-gray-500"}`}
                      >
                        {h.hora_inicio.slice(0, 5)} - {h.hora_fin.slice(0, 5)}
                      </Text>
                    </View>

                    <View
                      className={`px-3 py-1 rounded-md ${isDisponible ? "bg-primary" : "bg-gray-700"}`}
                    >
                      <Text className="text-xs font-bold text-background-dark">
                        {h.estado}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
