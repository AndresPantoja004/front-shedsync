import { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { register } from "../../services/api/auth";
import { asignarRol } from "../../services/api/user";
import { crearEstudiante } from "../../services/api/estudiante";
import { asignarSemestre } from "../../services/api/estudiante";

import { RegisterContext } from "../../../src/context/RegisterContext";
import { getSemestresCarrera } from "../../services/api/carrera";

export default function Step3() {
  const router = useRouter();
  const { registro, setRegistro } = useContext(RegisterContext);

  const studentType = registro.paso2.studentType; // "Z" o "C"
  const careerId = registro.paso2.careerId;

  const [semestres, setSemestres] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(
    registro.paso3?.repeatedSubjects || [],
  );

  // Solo para tipo Z
  const [selectedSemestreZ, setSelectedSemestreZ] = useState(null);

  useEffect(() => {
    const fetchSemestres = async () => {
      try {
        console.log("Carrera ID" + careerId);
        const data = await getSemestresCarrera(careerId);
        setSemestres(data);
      } catch (error) {
        console.error("Error cargando semestres", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSemestres();
  }, []);

  // Toggle solo permitido para tipo C
  const toggle = (id_asignatura, id_semestre) => {
    if (studentType === "Z") return;

    setSelected((prev) => {
      const exists = prev.find((item) => item.id_asignatura === id_asignatura);

      if (exists) {
        return prev.filter((item) => item.id_asignatura !== id_asignatura);
      }

      return [...prev, { id_asignatura, id_semestre }];
    });
  };

  const finalizarRegistro = async () => {
    try {
      if (studentType === "Z" && !selectedSemestreZ) {
        alert("Debes seleccionar un semestre completo");
        return;
      }

      console.log("EMAIL Y PASS PARA ENVIAR " + registro.paso1.email);

      // 1️⃣ Registrar usuario
      const userResponse = await register({
        email: registro.paso1.email,
        password: registro.paso1.password,
        phone: registro.paso1.phone,
      });

      console.log(userResponse);

      const idUsuario = userResponse.usuario.id_usuario;

      // 2️⃣ Asignar rol (estudiante)
      await asignarRol(idUsuario, 1); // 👈 asumiendo que 2 = estudiante

      // 3️⃣ Crear estudiante
      const estudianteResponse = await crearEstudiante({
        id_usuario: idUsuario,
        id_carrera: registro.paso2.careerId,
        tipo: registro.paso2.studentType,
        nombres: registro.paso1.nombre,
        tipos: registro.paso1.studentType,
        apellidos: registro.paso1.nombre,
        // Z o C
      });

      console.log(estudianteResponse);

      const idEstudiante = estudianteResponse.id_estudiante;

      console.log(
        "ID ESTUDIANTE REGISTER:",
        idEstudiante,
        selectedSemestreZ,
        registro.paso2.studentType,
        selected,
      );

      // 4️⃣ Asignar semestre + asignaturas
      const asignaturasPayload = selected;

      await asignarSemestre(
        idEstudiante,
        null, // ya no lo necesitamos
        registro.paso2.studentType === "Z" ? 1 : 2,
        asignaturasPayload,
      );

      // 5️⃣ Éxito 🎉
      alert("Registro completado correctamente");
      router.replace("/");
    } catch (error) {
      console.error("Error en registro:", error);
      alert(error.message || "Error al completar el registro");
    }
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
          <Text className="text-xs text-white">Paso 3 de 3</Text>
        </View>

        {/* TITLE */}
        <View className="px-5">
          <Text className="text-white text-3xl font-extrabold mb-2">
            {studentType == "Z"
              ? "Escoge el semestre que perteneces"
              : "Escoge las asignaturas"}
          </Text>
          <Text className="text-slate-400">
            {studentType == "Z"
              ? "Selecciona el semestre que cruzaras por primera vez"
              : "Selecciona las asignaturas que estes cruzando por primera vez o repitiendo"}
          </Text>
        </View>

        {/* CONTENT */}
        {loading ? (
          <Text className="text-white text-center mt-10">
            Cargando semestres...
          </Text>
        ) : (
          <View className="px-4 mt-6 gap-6">
            {semestres.map((sem) => {
              const isSelectedZ = selectedSemestreZ === sem.id_semestre;

              return (
                <View
                  key={sem.id_semestre}
                  className="bg-surface-dark rounded-2xl border border-slate-700 overflow-hidden"
                >
                  {/* SEMESTER HEADER */}
                  <View className="px-5 py-4 border-b border-slate-700 flex-row justify-between items-center">
                    <Text className="text-white text-lg font-bold">
                      Semestre {sem.nivel}
                    </Text>

                    {/* BOTÓN SOLO PARA TIPO Z */}
                    {studentType === "Z" && (
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedSemestreZ(sem.id_semestre);
                          setSelected(
                            (sem.asignaturas || []).map((a) => ({
                              id_asignatura: a.id_asignatura,
                              id_semestre: sem.id_semestre,
                            })),
                          );
                        }}
                        className={`px-3 py-1 rounded-lg ${
                          isSelectedZ ? "bg-primary" : "bg-slate-700"
                        }`}
                      >
                        <Text className="text-white text-xs">
                          {isSelectedZ ? "Seleccionado" : "Elegir semestre"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* SUBJECTS */}
                  {!sem.asignaturas || sem.asignaturas.length === 0 ? (
                    <Text className="text-slate-400 px-5 py-4 text-sm">
                      No hay asignaturas disponibles
                    </Text>
                  ) : (
                    sem.asignaturas.map((subj) => {
                      const checked = selected.some(
                        (x) => x.id_asignatura === subj.id_asignatura,
                      );

                      return (
                        <TouchableOpacity
                          key={subj.id_asignatura}
                          disabled={studentType === "Z"}
                          onPress={() =>
                            toggle(subj.id_asignatura, sem.id_semestre)
                          }
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
                              {subj.nombre}
                            </Text>
                            <Text className="text-slate-400 text-xs">
                              NRC: {subj.nrc}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })
                  )}
                </View>
              );
            })}
          </View>
        )}
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
          onPress={finalizarRegistro}
          className="bg-primary py-4 rounded-xl items-center mb-4"
        >
          <Text className="text-white font-bold">Finalizar Registro</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
