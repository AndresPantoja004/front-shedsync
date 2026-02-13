import Input from "../Inputs/Input";
import { Link } from "expo-router";
import { useState, useContext } from "react";
import { RegisterContext } from "../../context/RegisterContext";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons"; // Añadimos Ionicons para el ojo
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";

export default function RegisterStep1() {
  const { registro, setRegistro } = useContext(RegisterContext);
  const router = useRouter();

  // Estados del formulario
  const [nombre, setNombre] = useState(registro.paso1.nombre);
  const [email, setEmail] = useState(registro.paso1.email);
  const [phone, setPhone] = useState(registro.paso1.phone);
  const [password, setPassword] = useState(registro.paso1.password);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rol, setRol] = useState(registro.paso1.rol || "estudiante");

  // Estados de visibilidad
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formatPhone = (text) => {
    // Elimina el 0 inicial si el usuario intenta escribirlo
    let cleaned = text.replace(/^0/, "");
    // Solo permite números
    cleaned = cleaned.replace(/[^0-9]/g, "");
    setPhone(cleaned);
  };

  const guardarPaso1 = () => {
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Guardamos el teléfono con el prefijo incluido
    const fullPhone = `+593${phone}`;

    setRegistro((prev) => ({
      ...prev,
      tipoUsuario: rol[0],
      paso1: {
        nombre,
        email,
        phone: fullPhone,
        password,
        rol,
      },
    }));

    router.push("/register/step2");
  };

  return (
    <View className="flex-1 bg-background-dark">
      {/* HEADER */}
      <View className="flex-row items-center px-4 pt-12 pb-2 justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back-circle-outline"
            size={40}
            color="#38e07b"
          />
        </TouchableOpacity>
      </View>

      {/* STEPS */}
      <View className="items-center gap-2 py-4 px-6">
        <View className="flex-row gap-3 w-full">
          <View className="h-1.5 flex-1 rounded-full bg-primary" />
          <View className="h-1.5 flex-1 rounded-full bg-slate-700" />
          <View className="h-1.5 flex-1 rounded-full bg-slate-700" />
        </View>
        <Text className="text-xs text-slate-400">Paso 1 de 3</Text>
      </View>

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[28px] font-extrabold text-white mb-2">
          Crear Cuenta
        </Text>
        <Text className="text-slate-400 mb-6">
          Ingresa tus datos universitarios.
        </Text>

        {/* INPUTS ESTÁNDAR */}
        <Input
          label="Nombre Completo"
          placeholder="Ej. Juan Pérez"
          value={nombre}
          onChangeText={setNombre}
          labelClass="text-white"
          inputClass="bg-slate-800 text-white"
        />
        <Input
          label="Correo Institucional"
          placeholder="correo@universidad.edu"
          value={email}
          onChangeText={setEmail}
          labelClass="text-white"
          inputClass="bg-slate-800 text-white"
        />

        {/* TELÉFONO CON PREFIJO FIJO */}
        <Text className="text-sm font-bold text-white mt-4 mb-2">Teléfono</Text>
        <View className="flex-row items-center bg-slate-800 rounded-xl px-4 h-14 border border-slate-700">
          <View className="flex-row items-center border-r border-slate-600 pr-3 mr-3">
            <Text className="text-white font-bold">+593</Text>
          </View>
          <TextInput
            placeholder="969632415"
            placeholderTextColor="#64748b"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={formatPhone}
            maxLength={9}
            className="flex-1 text-white text-lg"
          />
        </View>

        {/* CONTRASEÑA CON OJO */}
        <View className="relative mt-4">
          <Input
            label="Contraseña"
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            labelClass="text-white"
            inputClass="bg-slate-800 text-white pr-12"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[40%]"
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="#38e07b"
            />
          </TouchableOpacity>
        </View>

        <View className="relative mt-4">
          <Input
            label="Confirmar Contraseña"
            placeholder="••••••••"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            labelClass="text-white"
            inputClass="bg-slate-800 text-white pr-12"
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-[40%]"
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off" : "eye"}
              size={22}
              color="#38e07b"
            />
          </TouchableOpacity>
        </View>

        {/* ROLE */}
        <Text className="text-sm font-bold text-gray-200 mt-6 mb-3">
          Selecciona tu Rol
        </Text>
        <View className="flex-row gap-4">
          <RoleCard
            label="Estudiante"
            selected={rol === "estudiante"}
            onPress={() => setRol("estudiante")}
            icon="estu"
          />
          <RoleCard
            label="Profesor"
            selected={rol === "profesor"}
            onPress={() => setRol("profesor")}
            icon="profe"
          />
        </View>

        <View className="mt-8 items-center">
          <Text className="text-slate-400">
            ¿Ya tienes cuenta?{" "}
            <Link href={"/"} className="text-primary font-bold">
              Inicia sesión
            </Link>
          </Text>
        </View>
      </ScrollView>

      {/* BOTTOM BUTTON */}
      <View className="absolute bottom-0 w-full px-6 pb-8 bg-background-dark border-t border-slate-800">
        <TouchableOpacity
          className="bg-primary py-4 rounded-2xl items-center mt-4"
          onPress={guardarPaso1}
        >
          <Text className="text-background-dark font-bold text-lg">
            Siguiente
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function RoleCard({ label, icon, selected, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 rounded-2xl p-4 items-center border-2 ${selected ? "border-primary bg-primary/10" : "border-slate-700 bg-slate-800"}`}
    >
      <View className="mb-2">
        {icon === "estu" ? (
          <AntDesign
            name="user"
            size={24}
            color={selected ? "#38e07b" : "gray"}
          />
        ) : (
          <FontAwesome6
            name="user-tie"
            size={24}
            color={selected ? "#38e07b" : "gray"}
          />
        )}
      </View>
      <Text
        className={`font-bold ${selected ? "text-primary" : "text-slate-200"}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
