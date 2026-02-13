import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState, useContext } from "react";
import { useColorScheme } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { sendMessage } from "../services/wapi/sendMesagge";

// Servicios
import { enviarIncidencia } from "../services/api/incidencia";
import { getEspaciosDisponibles } from "../services/api/espacios"; // Reutilizamos tu servicio
import { AuthContext } from "../context/AuthContext";

const CATEGORIAS = [
  "Equipo dañado",
  "Infraestructura",
  "Limpieza",
  "Objetos Perdidos",
];



export default function ReportarIncidencia() {
  const scheme = useColorScheme();
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [categoria, setCategoria] = useState("Equipo dañado");
  const [descripcion, setDescripcion] = useState("");
  const [imagenBase64, setImagenBase64] = useState(null);
  const [loading, setLoading] = useState(false);

  // Estados para el Modal de Búsqueda de Espacios
  const [modalVisible, setModalVisible] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [espacios, setEspacios] = useState([]);
  const [espacioSeleccionado, setEspacioSeleccionado] = useState(null);
  const [buscando, setBuscando] = useState(false);

  // Lógica de búsqueda con Debounce
  useEffect(() => {
    if (modalVisible) {
      const delayDebounceFn = setTimeout(() => {
        cargarEspacios(busqueda);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [busqueda, modalVisible]);

  const cargarEspacios = async (texto) => {
    setBuscando(true);
    try {
      // Pasamos vacío en tipo para que busque en todos (Aulas y Labs)
      const data = await getEspaciosDisponibles("", texto);
      setEspacios(data);
    } catch (error) {
      console.error("Error buscando espacios:", error);
    } finally {
      setBuscando(false);
    }
  };

  const seleccionarDeGaleria = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled)
      setImagenBase64(`data:image/jpeg;base64,${result.assets[0].base64}`);
  };

  const tomarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permisos necesarios", "Se requiere acceso a la cámara.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled)
      setImagenBase64(`data:image/jpeg;base64,${result.assets[0].base64}`);
  };

  const manejarEnvio = async () => {
    if (!espacioSeleccionado || descripcion.trim().length < 5) {
      Alert.alert(
        "Datos incompletos",
        "Por favor selecciona el lugar e indica detalles del problema.",
      );
      return;
    }

    setLoading(true);
    try {
      // 1. Guardar en Base de Datos
      await enviarIncidencia(
        imagenBase64,
        categoria,
        descripcion,
        user?.id_usuario || 1,
        espacioSeleccionado.id_espacio,
        null,
      );

      // 2. Construir mensaje formal
      const mensajeFormal = `🏛️ *REPORTE DE INCIDENCIA - SchedSync*\n
---------------------------------------\n
📌 *Detalles del Reporte:*\n
• *Categoría:* ${categoria}\n
• *Ubicación:* ${espacioSeleccionado.nombre}\n
• *Fecha:* ${new Date().toLocaleDateString()}\n

📝 *Descripción:*\n
"${descripcion.trim()}"

👤 *Reportado por:*\n
• ${user?.nombres || "Estudiante"}\n
• ID: ${user?.id_usuario}\n

---------------------------------------\n
_Mensaje generado automáticamente por SchedSync._`;

      // 3. Enviar a la autoridad (reemplaza el número si es necesario)
      await sendMessage("593998920369", mensajeFormal);

      Alert.alert(
        "¡Enviado!",
        "Tu reporte ha sido registrado y notificado a las autoridades.",
      );
      router.replace("/");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo enviar el reporte.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <View className="flex-1 bg-background-dark">
      {/* HEADER */}
      <View className="flex-row items-center px-4 pt-12 pb-2">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back-circle-outline"
            size={40}
            color="#38e07b"
          />
        </TouchableOpacity>
        <Text className="text-white font-bold text-lg ml-4">
          Reportar Incidencia
        </Text>
      </View>

      <ScrollView
        className="px-6"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-xl font-bold text-white mt-6 mb-4">
          ¿Qué sucedió?
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
        >
          <View className="flex-row gap-3">
            {CATEGORIAS.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategoria(cat)}
                className={`px-5 py-3 rounded-full border ${categoria === cat ? "bg-primary border-primary" : "bg-surface-dark border-white/10"}`}
              >
                <Text
                  className={`font-bold ${categoria === cat ? "text-background-dark" : "text-white"}`}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* SELECTOR DE UBICACIÓN (REEMPLAZA AL PICKER) */}
        <Text className="text-xl font-bold text-white mb-4">Ubicación</Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-surface-dark border border-white/10 rounded-xl p-4 flex-row justify-between items-center mb-6"
        >
          <View className="flex-row items-center gap-3">
            <Ionicons name="location" size={20} color="#38e07b" />
            <Text
              className={
                espacioSeleccionado
                  ? "text-white text-lg"
                  : "text-gray-500 text-lg"
              }
            >
              {espacioSeleccionado
                ? espacioSeleccionado.nombre
                : "Seleccionar Aula o Lab..."}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="gray" />
        </TouchableOpacity>

        {/* EVIDENCIA */}
        <Text className="text-xl font-bold text-white mb-4">
          Evidencia Visual
        </Text>
        <View className="flex-row gap-4 mb-6">
          <TouchableOpacity
            onPress={tomarFoto}
            className="flex-1 h-24 bg-surface-dark border border-dashed border-primary/30 rounded-xl items-center justify-center"
          >
            <Ionicons name="camera" size={30} color="#38e07b" />
            <Text className="text-white text-xs mt-1">Cámara</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={seleccionarDeGaleria}
            className="flex-1 h-24 bg-surface-dark border border-dashed border-primary/30 rounded-xl items-center justify-center"
          >
            <Ionicons name="images" size={30} color="#38e07b" />
            <Text className="text-white text-xs mt-1">Galería</Text>
          </TouchableOpacity>
        </View>

        {imagenBase64 && (
          <View className="mb-6 relative">
            <Image
              source={{ uri: imagenBase64 }}
              className="w-full h-48 rounded-xl"
            />
            <TouchableOpacity
              onPress={() => setImagenBase64(null)}
              className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
            >
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}

        <Text className="text-xl font-bold text-white mb-4">Detalles</Text>
        <TextInput
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          placeholder="Describe el problema..."
          placeholderTextColor="#4b5563"
          className="bg-surface-dark border border-white/10 rounded-xl p-4  text-white min-h-[120px]"
          style={{ textAlignVertical: "top" }}
        />
      </ScrollView>

      {/* BOTÓN FLOTANTE DE ENVÍO */}
      <View className="absolute bottom-10 mb-20 left-6 right-6">
        <TouchableOpacity
          onPress={manejarEnvio}
          disabled={loading}
          className={`h-16 rounded-2xl flex-row items-center justify-center gap-3 shadow-xl ${loading ? "bg-gray-700" : "bg-primary"}`}
        >
          {loading ? (
            <ActivityIndicator color="black" />
          ) : (
            <>
              <Text className="text-background-dark text-lg font-bold">
                Enviar Reporte
              </Text>
              <MaterialIcons name="send" size={20} color="#122017" />
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* MODAL DE BÚSQUEDA DE ESPACIOS */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-surface-dark p-6 pt-16">
          <View className="flex-row items-center mb-6">
            <View className="flex-1 flex-row items-center bg-surface-dark-lighter rounded-xl px-4 h-14 border border-primary/20">
              <Ionicons name="search" size={20} color="gray" />
              <TextInput
                autoFocus
                placeholder="Buscar (ej: DCCO 05)..."
                placeholderTextColor="gray"
                value={busqueda}
                onChangeText={setBusqueda}
                className="flex-1 ml-3 text-white text-lg"
              />
              {buscando && <ActivityIndicator size="small" color="#38e07b" />}
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="ml-4"
            >
              <Text className="text-primary font-bold">Cerrar</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={espacios}
            keyExtractor={(item) => item.id_espacio.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setEspacioSeleccionado(item);
                  setModalVisible(false);
                  setBusqueda("");
                }}
                className="py-4 border-b border-white/5"
              >
                <Text className="text-white text-lg font-medium">
                  {item.nombre}
                </Text>
                <Text className="text-gray-500 text-xs">
                  {item.tipo.toUpperCase()} • Cap: {item.capacidad}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() =>
              !buscando && (
                <Text className="text-gray-500 text-center mt-10">
                  No se encontraron espacios con ese nombre.
                </Text>
              )
            }
          />
        </View>
      </Modal>
    </View>
  );
}
