import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { getCarreras } from "../../services/api/carrera";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useEffect } from "react";
import { useContext } from "react";
import { RegisterContext } from "../../../src/context/RegisterContext";

const CAREER_UI = {
  BIOTECNOLOGÍA: {
    icon: <MaterialCommunityIcons name="bio" size={24} color="#34d399" />,
    color: "bg-emerald-500/10 text-emerald-400",
    faculty: "Facultad de Ciencias",
  },
  AGROPECUARIA: {
    icon: (
      <MaterialCommunityIcons name="forest-outline" size={24} color="#22c55e" />
    ),
    color: "bg-green-500/10 text-green-400",
    faculty: "Facultad de Agricultura",
  },
  TECNOLOGÍA: {
    icon: <FontAwesome6 name="laptop-code" size={24} color="#a855f7" />,
    color: "bg-purple-500/10 text-purple-400",
    faculty: "Facultad de Ingeniería",
  },
};

const STUDENT_TYPES = [
  {
    id: "Z",
    title: "Estudiante Tipo Z",
    status: "Seleccionado",
    description:
      "Estudiante regular. No repito asignaturas y sigo el plan de estudios estándar.",
    icon: <AntDesign name="check-circle" size={24} color="green" />,
  },
  {
    id: "C",
    title: "Estudiante Tipo C",
    status: "Irregular",
    description:
      "Estudiante irregular. Necesito inscribir asignaturas que estoy repitiendo de semestres anteriores.",
    icon: <AntDesign name="clock-circle" size={24} color="green" />,
  },
];

export default function RegisterStep2() {
  const { registro, setRegistro } = useContext(RegisterContext);

  const [careers, setCareers] = useState([]);
  const [career, setCareer] = useState(registro.paso2.careerId || null);
  const [type, setType] = useState(registro.paso2.studentType || "Z");

  const router = useRouter();
  const [loadingCareers, setLoadingCareers] = useState(true);

  const guardarPaso2 = () => {
    if (!career) {
      alert("Selecciona una carrera");
      return;
    }

    setRegistro((prev) => ({
      ...prev,
      paso2: {
        careerId: career,
        studentType: type,
      },
    }));

    if (type === "C") {
      router.push("/register/step3");
    } else {
      router.push("/register/step3"); // o finalizar directo
    }
  };

  /*   const redirectStep3 = (career, type) => {
    router.push("/register/step3", {
      career,
      type,
    });
  };
 */
  useEffect(() => {
    const loadCareers = async () => {
      try {
        const data = await getCarreras();

        const mapped = data.map((c) => {
          let ui = {};

          if (c.nombre.includes("BIOTEC")) ui = CAREER_UI.BIOTECNOLOGÍA;
          else if (c.nombre.includes("AGRO")) ui = CAREER_UI.AGROPECUARIA;
          else if (c.nombre.includes("TECNOLOG")) ui = CAREER_UI.TECNOLOGÍA;

          return {
            id: c.id_carrera,
            title: c.nombre,
            totalSemestres: c.total_semestres,
            ...ui,
          };
        });

        setCareers(mapped);
      } catch (err) {
        console.error("Error cargando carreras", err);
      } finally {
        setLoadingCareers(false);
      }
    };

    loadCareers();
  }, []);

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
          Datos Academicos
        </Text>
      </View>

      {/* STEPS */}
      <View className="items-center gap-2 py-4 px-6">
        <View className="flex-row gap-3 w-full">
          <View className="h-1.5 flex-1 rounded-full bg-slate-700" />
          <View className="h-1.5 flex-1 rounded-full bg-primary" />
          <View className="h-1.5 flex-1 rounded-full bg-slate-700" />
        </View>
        <Text className="text-xs text-white dark:text-slate-400">
          Paso 1 de 3
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        {/* CAREER TITLE */}
        <View className="px-5">
          <Text className="text-[28px] font-extrabold text-white mb-2">
            Selecciona tu Carrera
          </Text>
          <Text className="text-slate-400 mb-6">
            ¿Qué carrera estás cursando actualmente? Esto nos ayuda a
            personalizar tu horario.
          </Text>
        </View>

        {/* CAREER LIST */}
        <View className="px-5 gap-4">
          {careers.map((item) => {
            const selected = career === item.id;

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setCareer(item.id)}
                activeOpacity={0.85}
                className={`flex-row items-center gap-4 rounded-xl p-4 border ${
                  selected
                    ? "border-primary bg-primary/10"
                    : "border-slate-700 bg-surface-dark"
                }`}
              >
                <View
                  className={`h-10 w-10 rounded-lg items-center justify-center ${item.color}`}
                >
                  {item.icon}
                </View>

                <View className="flex-1">
                  <Text className="text-white font-semibold text-base">
                    {item.title}
                  </Text>
                  <Text className="text-slate-400 text-sm">{item.faculty}</Text>
                </View>

                <View
                  className={`h-6 w-6 rounded-full border-2 items-center justify-center ${
                    selected ? "border-primary bg-primary" : "border-slate-500"
                  }`}
                >
                  {selected && <Text className="text-white text-xs">✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
          {loadingCareers && (
            <Text className="text-slate-400 px-5">Cargando carreras...</Text>
          )}
        </View>

        {/* STUDENT TYPE TITLE */}
        <View className="px-5 pt-10">
          <Text className="text-white tracking-tight text-[28px] font-extrabold pb-3">
            ¿Qué tipo de estudiante eres?
          </Text>
          <Text className="text-slate-400 text-base pb-6">
            Selecciona tu estado actual para optimizar la generación de tu
            horario.
          </Text>
        </View>

        {/* STUDENT TYPE LIST */}
        <View className="px-5 gap-4">
          {STUDENT_TYPES.map((item) => {
            const selected = type === item.id;

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setType(item.id)}
                activeOpacity={0.85}
                className={`rounded-xl p-4 border ${
                  selected
                    ? "border-primary bg-primary/10"
                    : "border-slate-700 bg-surface-dark"
                }`}
              >
                <View className="flex-row items-start justify-between gap-4">
                  <View className="flex-row gap-4 flex-1">
                    <View
                      className={`h-12 w-12 rounded-lg items-center justify-center ${
                        selected ? "bg-primary/10" : "bg-slate-700"
                      }`}
                    >
                      <Text className="text-xl">{item.icon}</Text>
                    </View>

                    <View className="flex-1">
                      <Text className="text-white text-lg font-bold">
                        {item.title}
                      </Text>
                      <Text
                        className={`text-sm font-medium mt-1 ${
                          selected ? "text-primary" : "text-slate-400"
                        }`}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  <View
                    className={`h-6 w-6 rounded-full border-2 items-center justify-center ${
                      selected
                        ? "border-primary bg-primary"
                        : "border-slate-500"
                    }`}
                  >
                    {selected && <Text className="text-white text-xs">✓</Text>}
                  </View>
                </View>

                <View className="mt-3 pl-16">
                  <Text className="text-slate-400 text-sm leading-relaxed">
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* BUTTON */}
      <View className="absolute bottom-0 w-full px-4 pb-4 bg-background-dark border-t border-slate-800">
        <TouchableOpacity
          onPress={() => guardarPaso2()}
          className="bg-primary py-4 rounded-xl items-center my-4"
          activeOpacity={0.85}
        >
          <Text className="text-white font-bold text-base">Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
