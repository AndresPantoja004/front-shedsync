import { View, Text, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator } from "react-native";
import { useState, useContext } from "react";
import { AuthContext } from "../src/context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { actualizarPerfil } from "../src/services/api/user";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function EditarPerfil() {
  const { user, token, login } = useContext(AuthContext); // Usamos login para actualizar la caché
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setAvatar(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await actualizarPerfil(token,{ phone, avatar });
      // Actualizamos el contexto global con el nuevo usuario devuelto por el servidor
      await login(token, { ...user, phone: res.usuario.phone, avatar: res.usuario.avatar });
      Alert.alert("Éxito", "Perfil actualizado correctamente");
      router.back();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background-dark px-6 pt-16">
      <View className="flex-row items-center mb-8">
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={28} color="white" /></TouchableOpacity>
        <Text className="text-xl font-bold text-white ml-4">Editar Perfil</Text>
      </View>

      <View className="items-center mb-10">
        <TouchableOpacity onPress={pickImage} className="relative">
          <View className="h-32 w-32 rounded-full bg-surface-dark border-2 border-primary overflow-hidden items-center justify-center">
            {avatar ? <Image source={{ uri: avatar }} className="w-full h-full" /> : <Ionicons name="camera" size={40} color="gray" />}
          </View>
          <View className="absolute bottom-0 right-0 bg-primary p-2 rounded-full"><Ionicons name="pencil" size={16} color="black" /></View>
        </TouchableOpacity>
        <Text className="text-gray-400 mt-4">Toca para cambiar foto</Text>
      </View>

      <Text className="text-white font-bold mb-2 ml-2">Teléfono de contacto</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="+593..."
        placeholderTextColor="gray"
        keyboardType="phone-pad"
        className="bg-surface-dark text-white p-4 rounded-xl border border-white/10 mb-8"
      />

      <TouchableOpacity 
        onPress={handleSave} 
        disabled={loading}
        className="bg-primary py-4 rounded-xl items-center shadow-lg shadow-primary/20"
      >
        {loading ? <ActivityIndicator color="black" /> : <Text className="font-bold text-lg">Guardar Cambios</Text>}
      </TouchableOpacity>
    </View>
  );
}