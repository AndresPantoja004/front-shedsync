import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useContext } from "react";
import { RegisterContext } from "../../../src/context/RegisterContext";
import { AuthContext } from "../../../src/context/AuthContext"; // opcional

const SUBJECTS = {
  1: [
    { id: "INF101", name: "Introducción a la Programación" },
    { id: "MAT120", name: "Matemáticas Discretas" },
  ],
  2: [
    { id: "INF202", name: "Estructura de Datos" },
    { id: "FIS110", name: "Física General I" },
    { id: "MAT201", name: "Cálculo Diferencial" },
  ],
};

export default function Step3() {
  const { registro, setRegistro } = useContext(RegisterContext);
  /*   const { login } = useContext(AuthContext); // opcional */

  const router = useRouter();
  const [selected, setSelected] = useState(
    registro.paso3.repeatedSubjects || [],
  );

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const finalizarRegistro = async () => {
    setRegistro((prev) => ({
      ...prev,
      paso3: {
        repeatedSubjects: selected,
      },
    }));

    const payload = {
      ...registro,
      paso3: {
        repeatedSubjects: selected,
      },
    };

    /* try {
      const res = await fetch("http://TU_IP:3000/api/usuarios/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al registrar");
      }

      // Login automático (opcional)
      if (data.token) {
        await login(data.token);
      }

      // Limpiar contexto
      setRegistro({
        tipoUsuario: "C",
        paso1: {},
        paso2: {},
        paso3: {},
      });

      router.replace("/"); 
    } catch (err) {
      alert(err.message);
    } */

    console.log(JSON.stringify(registro))
  };

  return (
    <View className="flex-1 bg-background-dark">
      {/* HEADER */}
      <View className="flex-row items-center px-4 pt-4 pb-2 justify-between mt-8">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back-circle-outline"
            size={40}
            color="#38e07b"
          />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white font-bold text-lg pr-6">
          Registro Asignaturas
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* STEPS */}
        <View className="items-center gap-2 py-4 px-6">
          <View className="flex-row gap-3 w-full">
            <View className="h-1.5 flex-1 rounded-full bg-slate-700" />
            <View className="h-1.5 flex-1 rounded-full bg-slate-700" />
            <View className="h-1.5 flex-1 rounded-full bg-primary" />
          </View>
          <Text className="text-xs text-white dark:text-slate-400">
            Paso 3 de 3
          </Text>
        </View>

        {/* TITLE */}
        <View className="px-5">
          <Text className="text-white text-3xl font-extrabold mb-2">
            Asignaturas Repetidas
          </Text>
          <Text className="text-slate-400">
            Selecciona las materias que cursarás por segunda vez.
          </Text>
        </View>

        {/* SEMESTERS */}
        <View className="px-4 mt-6 gap-6">
          {Object.entries(SUBJECTS).map(([semester, items]) => (
            <View
              key={semester}
              className="bg-surface-dark rounded-2xl border border-slate-700 overflow-hidden"
            >
              <View className="px-5 py-4 border-b border-slate-700">
                <Text className="text-white text-lg font-bold">
                  Semestre {semester}
                </Text>
              </View>

              {items.map((subj) => {
                const checked = selected.includes(subj.id);

                return (
                  <TouchableOpacity
                    key={subj.id}
                    onPress={() => toggle(subj.id)}
                    className="flex-row items-center p-4 border-t border-slate-700"
                  >
                    <View
                      className={`h-6 w-6 rounded-md border items-center justify-center ${
                        checked
                          ? "bg-primary border-primary"
                          : "border-slate-500"
                      }`}
                    >
                      {checked && (
                        <Text className="text-background-dark font-bold">
                          ✓
                        </Text>
                      )}
                    </View>

                    <View className="ml-4">
                      <Text className="text-white font-medium">
                        {subj.name}
                      </Text>
                      <Text className="text-slate-400 text-xs">
                        Código: {subj.id}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View className="absolute bottom-0 w-full px-4 pb-4 bg-background-dark border-t border-slate-800">
        <View className="flex-row justify-between mb-3 mt-4">
          <Text className="text-slate-400">Seleccionadas</Text>
          <Text className="text-primary font-bold">
            {selected.length} asignatura(s)
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => finalizarRegistro()}
          className="bg-primary py-4 rounded-xl items-center mb-4"
        >
          <Text className="text-white font-bold">Finalizar Registro</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
