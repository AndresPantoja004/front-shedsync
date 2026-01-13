import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { login } from "../../services/api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log("Hola dua dua")
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    console.log("Credenciales", email, password)

    try {
      setLoading(true);
      const result = await login(email, password);
      console.log("Login OK:", result);

      Alert.alert("Éxito", "Inicio de sesión correcto");

      // TODO: guardar token con AsyncStorage
      // await AsyncStorage.setItem('token', result.token);

      // navigation.replace("Home");
    } catch (error) {
      Alert.alert("Error", error.message || "Credenciales incorrectas");
      console.log(error)
    } finally {
      setLoading(false);
      
    }
  };

  return (
    <View className="flex-1 bg-[#171b18] items-center justify-center px-4">
      {/* Card */}
      <View className="w-full max-w-[420px] gap-8">
        {/* Header */}
        <View className="items-center gap-4 pt-4">
          {/* Logo */}
          <View className="w-24 h-24 rounded-full bg-[#1b3124] items-center justify-center shadow-2xl border-4 border-white overflow-hidden">
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8HtdBNHJWgaCTuxuOS39YixvWEEVk-6cwV85m-qTkl4xwjTyiD58Ps8st_a783rhLkl-TIHcLCCIrQ37bJoAJd-VKA5QQjRGqB_AAbJSaOwRQ7QNXLWt1tgvbd5CQ0gaObJj3TtN8Koho3tokMlTLpVTw44_Ka3g_HJjIg8pC6HS6fGgWYUe1ETsjmplaLStUarhRxV7_kCUxwnqj-0uMsSrsOySITQUrcmG09Rb5B4JYKd7sAcpJtI7nzrjLiOR3B6USVNApfL0",
              }}
              className="w-full h-full opacity-90"
              resizeMode="cover"
            />
          </View>

          {/* Titles */}
          <View className="items-center gap-1">
            <Text className="text-[28px] font-bold text-white">
              Bienvenido a SchedSync
            </Text>
            <Text className="text-[#96c5a9] text-base font-medium">
              Gestión Universitaria Simplificada
            </Text>
          </View>
        </View>

        {/* Form */}
        <View className="gap-5">
          {/* Email */}
          <View className="gap-2">
            <Text className="text-white text-sm font-semibold ml-4 uppercase tracking-wider">
              Correo Institucional
            </Text>

            <View className="bg-[#1b3124] rounded-xl h-16 justify-center px-5 shadow-sm">
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="usuario@universidad.edu"
                placeholderTextColor="#94a3b8"
                autoCapitalize="none"
                keyboardType="email-address"
                className="text-base text-white"
              />
            </View>
          </View>

          {/* Password */}
          <View className="gap-2">
            <Text className="text-white text-sm font-semibold ml-4 uppercase tracking-wider">
              Contraseña
            </Text>

            <View className="bg-[#1b3124] rounded-xl h-16 justify-center px-5 shadow-sm">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                className="text-base text-white"
              />
            </View>

            <TouchableOpacity className="items-end pr-2 pt-1">
              <Text className="text-[#96c5a9] text-sm font-medium">
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className={`mt-4 h-16 rounded-xl items-center justify-center shadow-lg ${
              loading ? "bg-[#2f6b45]" : "bg-[#38a75e]"
            }`}
          >
            <Text className="text-[#122017] font-bold text-lg">
              {loading ? "Ingresando..." : "Iniciar Sesión →"}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center justify-center my-2">
            <View className="flex-1 h-px bg-[#2a4635]" />
            <Text className="mx-4 text-xs font-semibold uppercase tracking-widest text-[#5a7c68]">
              Acceso Rápido
            </Text>
            <View className="flex-1 h-px bg-[#2a4635]" />
          </View>

          {/* Fingerprint */}
          <TouchableOpacity className="h-14 border border-[#366348] rounded-xl items-center justify-center">
            <Text className="text-white font-semibold">Usar huella</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="items-center pb-6">
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text className="text-[#96c5a9] text-sm">
              ¿No tienes cuenta?
              <Text className="text-[#38a75e] font-bold"> Regístrate</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
