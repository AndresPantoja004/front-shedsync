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
import { AntDesign } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";

export default function RegisterStep1() {
  const { registro, setRegistro } = useContext(RegisterContext);
  const router = useRouter();

  const [nombre, setNombre] = useState(registro.paso1.nombre);
  const [email, setEmail] = useState(registro.paso1.email);
  const [password, setPassword] = useState(registro.paso1.password);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rol, setRol] = useState(registro.paso1.rol || "student");
  const guardarPaso1 = () => {
    if (!nombre || !email || !password) {
      alert("Completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    setRegistro((prev) => ({
      ...prev,
      paso1: {
        nombre,
        email,
        password,
        rol,
      },
    }));

    router.push("/register/step2");
  };

  return (
    <View className="flex-1 bg-background-dark">
      {/* HEADER */}
      <View className="flex-row items-center px-4 pt-4 pb-2 justify-between">
        <TouchableOpacity className="w-12 h-12 items-center justify-center rounded-full">
          <Text className="text-xl text-black dark:text-white">‹</Text>
        </TouchableOpacity>
      </View>

      {/* STEPS */}
      <View className="items-center gap-2 py-4 px-6">
        <View className="flex-row gap-3 w-full">
          <View className="h-1.5 flex-1 rounded-full bg-primary" />
          <View className="h-1.5 flex-1 rounded-full bg-slate-700" />
          {/* <View className="h-1.5 flex-1 rounded-full bg-slate-700" /> */}
        </View>
        <Text className="text-xs text-white dark:text-slate-400">
          Paso 1 de 2
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* TITLE */}
        <Text className="text-[28px] font-extrabold text-primary dark:text-white mb-2">
          Crear Cuenta
        </Text>
        <Text className="text-slate-400 mb-6">
          Ingresa tus datos y selecciona tu rol universitario para comenzar.
        </Text>

        {/* INPUTS */}
        <Input
          label="Nombre Completo"
          placeholder="Ej. Juan Pérez"
          value={nombre}
          onChangeText={setNombre}
          labelClass="text-white"
          containerClass="mt-2"
          inputClass="text-lg bg-slate-800"
        />

        <Input
          label="Correo Institucional"
          placeholder="correo@universidad.edu"
          value={email}
          onChangeText={setEmail}
          labelClass="text-white"
          containerClass="mt-2"
          inputClass="text-lg bg-slate-800"
        />

        <Input
          label="Contraseña"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          labelClass="text-white"
          containerClass="mt-2"
          inputClass="text-lg bg-slate-800"
        />

        <Input
          label="Confirmar Contraseña"
          placeholder="••••••••"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          labelClass="text-white"
          inputClass="tracking-widest bg-slate-800"
        />

        {/* ROLE */}
        <Text className="text-sm font-bold text-gray-200 mt-4 mb-3">
          Selecciona tu Rol
        </Text>

        <View className="flex-row gap-4 ">
          <RoleCard
            label="Estudiante"
            selected={rol === "student"}
            onPress={() => setRol("student")}
            icon="estu"
          />
          <RoleCard
            label="Profesor"
            selected={rol === "professor"}
            onPress={() => setRol("professor")}
            className="bg-slate-800 "
          />
        </View>

        {/* FOOTER LINK */}
        <View className="mt-6 items-center">
          <Text className="text-slate-400 text-MD">
            ¿Ya tienes cuenta?
            <Link href={"/"} className="text-primary font-bold">
              {" "}
              Inicia sesión
            </Link>
          </Text>
        </View>
      </ScrollView>

      {/* BOTTOM BUTTON */}
      <View className="absolute bottom-0 w-full px-4 pb-4 bg-background-dark border-t border-slate-800">
        <TouchableOpacity
          className="bg-primary py-4 rounded-xl items-center my-4"
          onPress={() => guardarPaso1()}
        >
          <Text className="text-white font-bold text-base">Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------- COMPONENTES AUX ---------------- */

function RoleCard({ label, icon, selected, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 rounded-xl p-4 items-center border-2  ${
        selected
          ? "border-primary bg-primary/10"
          : "border-slate-700 bg-slate-800"
      }`}
    >
      <Text className="text-2xl mb-2">
        {icon == "estu" ? (
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
      </Text>
      <Text
        className={`font-bold ${selected ? "text-primary" : "text-slate-200"}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
