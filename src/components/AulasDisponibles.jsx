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
import { useEffect, useState, useContext } from "react"; // Añadido useContext
import { useColorScheme } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

// Contexto y Servicios
import { AuthContext } from "../context/AuthContext"; // Usar tu contexto global
import { sendMessage } from "../services/wapi/sendMesagge";
import { getEspaciosDisponibles } from "../services/api/espacios";
import { crearReserva } from "../services/api/reserva";

export default function BuscarEspacios() {
  const scheme = useColorScheme();
  const router = useRouter();

  // 1. Obtener usuario directamente del contexto
  const { user } = useContext(AuthContext);

  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEspacio, setSelectedEspacio] = useState(null);

  // 2. Debounce para la búsqueda
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      cargarEspacios(filtro, search);
    }, 500); // Espera 500ms tras dejar de escribir

    return () => clearTimeout(delayDebounceFn);
  }, [search, filtro]);

  const cargarEspacios = async (tipo = "", textoBusqueda = "") => {
    setLoading(true);
    try {
      // Pasamos ambos parámetros a la API optimizada
      const data = await getEspaciosDisponibles(tipo, textoBusqueda);
      console.log("DAtaaa", data);

      const espaciosNormalizados = data.map((e) => ({
        id: e.id_espacio,
        nombre: e.nombre,
        capacidad: e.capacidad,
        tipo: e.tipo.toLowerCase(),
        horarios: e.horarios || [],
      }));
      setEspacios(espaciosNormalizados);
    } catch (error) {
      console.error(error);
      // Alert.alert("Error", "No se pudieron cargar los espacios");
    } finally {
      setLoading(false);
    }
  };

  const handleCrearReserva = async (horario) => {
    try {
      const fechaHoy = new Date().toISOString().split("T")[0];
      const payload = {
        id_espacio: selectedEspacio.id,
        fecha: fechaHoy,
        hora_inicio: horario.hora_inicio,
        hora_fin: horario.hora_fin,
        id_usuario: user?.id_usuario,
      };

      await crearReserva(payload);

      // Estructura del mensaje formal para WhatsApp
      const mensajeReserva = `📅 *SOLICITUD DE RESERVA - SchedSync*
---------------------------------------
✅ *Estado:* PENDIENTE DE APROBACIÓN

📍 *Detalles del Espacio:*
• *Lugar:* ${selectedEspacio.nombre}
• *Fecha:* ${fechaHoy}
• *Horario:* ${horario.hora_inicio.slice(0, 5)} - ${horario.hora_fin.slice(0, 5)}

👤 *Solicitante:*
• ${user?.nombres}
• Correo: ${user?.email}

---------------------------------------
_Este es un aviso automático generado por el sistema de gestión de horarios ESPE._`;

      // Envío del mensaje al administrador
      await sendMessage("593980098210", mensajeReserva);

      Alert.alert(
        "¡Éxito!",
        "Tu reserva ha sido registrada como PENDIENTE y se ha notificado al administrador.",
      );
      setModalVisible(false);
      cargarEspacios(filtro, search);
    } catch (error) {
      Alert.alert("Atención", error.message || "Error al procesar reserva");
    }
  };

  return (
    <View
      className={`flex-1 ${scheme === "dark" ? "bg-background-dark" : "bg-background-dark"}`}
    >
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back-circle-outline"
            size={40}
            color="#38e07b"
          />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-white">Reservar Espacio</Text>
        <View className="w-6" />
      </View>

      {/* SEARCH - Actualizado */}
      <View className="px-6 mb-3">
        <View className="flex-row items-center bg-surface-dark rounded-xl px-4 h-12 border border-white/5">
          <Ionicons name="search" size={18} color="#9ca3af" />
          <TextInput
            placeholder="Buscar por nombre..."
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={(text) => setSearch(text)} // Actualiza el estado y dispara el useEffect
            className="flex-1 ml-3 text-white"
          />
          {loading && <ActivityIndicator size="small" color="#38e07b" />}
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
                className={`px-4 py-1.5 rounded-full ${filtro === f.key ? "bg-primary" : "bg-surface-dark border border-white/5"}`}
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

      {/* LISTA - Se eliminó el filtro local para usar los datos directos de la API */}
      <ScrollView
        className="px-6"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {espacios.length === 0 && !loading ? (
          <Text className="text-gray-500 text-center mt-10">
            No se encontraron resultados
          </Text>
        ) : (
          espacios.map((e) => {
            const todosOcupados = e.horarios.every(
              (h) => h.estado !== "DISPONIBLE",
            );

            return (
              <View
                key={e.id}
                className="bg-surface-dark rounded-xl p-4 mb-4 border border-white/5 shadow-sm"
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
          })
        )}
      </ScrollView>

      {/* MODAL DE HORARIOS (Sin cambios necesarios aquí) */}
      <Modal transparent visible={modalVisible} animationType="slide">
        <View className="flex-1 bg-black/80 justify-end">
          <View className="bg-surface-dark rounded-t-3xl p-6 h-3/4">
            {/* Contenido del modal igual al anterior... */}
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
                    className={`flex-row items-center justify-between p-4 mb-3 rounded-xl border ${isDisponible ? "border-primary/30 bg-primary/5" : "border-white/5 bg-white/5 opacity-50"}`}
                  >
                    <View className="flex-row items-center gap-3">
                      <MaterialIcons
                        name="access-time"
                        size={20}
                        color={isDisponible ? "#38e07b" : "#9ca3af"}
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
