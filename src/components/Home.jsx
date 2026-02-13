import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useColorScheme } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
//importar iconos
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import { userInfo } from "../services/api/user";
import { useRouter } from "expo-router";
import { obtenerHorario } from "../services/api/horario";

import * as Notifications from "expo-notifications";

const ordenDias = {
  DOMINGO: 0,
  LUNES: 1,
  MARTES: 2,
  MIERCOLES: 3,
  JUEVES: 4,
  VIERNES: 5,
  SABADO: 6,
};

const convertirAMinutosSemana = (dia, hora) => {
  const [h, m] = hora.split(":");
  const minutosDia = parseInt(h) * 60 + parseInt(m);
  return ordenDias[dia] * 1440 + minutosDia;
};

export default function Home() {
  const scheme = useColorScheme();
  const { logout } = useContext(AuthContext);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [horario, setHorario] = useState([]);
  const [claseActual, setClaseActual] = useState(null);
  const [proximaClase, setProximaClase] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(null);
  const [notificacionProgramada, setNotificacionProgramada] = useState(null);

  const programarNotificacion = async (clase) => {
    if (!clase) return;

    const idUnico = `${clase.dia}-${clase.hora_inicio}-${clase.id_asignatura}`;

    if (notificacionProgramada === idUnico) return;

    const ahora = new Date();

    const fechaClase = new Date();
    fechaClase.setHours(10);
    fechaClase.setMinutes(0);

    const fechaNotificacion = new Date(fechaClase.getTime() - 5 * 60000);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test",
        body: "Notificación en 5 segundos",
      },
      trigger: {
        type: "timeInterval",
        seconds: 100000,
      },
    });

    setNotificacionProgramada(idUnico);
  };

  const nombreArray = user?.nombres ? user.nombres.trim().split(" ") : [];
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

  const handleLogout = () => {
    logout();
  };

  const horaEnMinutos = (hora) => {
    const [h, m] = hora.split(":");
    return parseInt(h) * 60 + parseInt(m);
  };

  const calcularClase = () => {
    if (horario.length === 0) return;

    const ahora = new Date();
    const diaActualNumero = ahora.getDay(); // 0-6
    const minutosActual = ahora.getHours() * 60 + ahora.getMinutes();
    const minutosActualSemana = diaActualNumero * 1440 + minutosActual;

    let claseActualTemp = null;
    let proximaTemp = null;
    let menorDiferencia = Infinity;

    horario.forEach((clase) => {
      const inicioSemana = convertirAMinutosSemana(
        clase.dia,
        clase.hora_inicio,
      );
      const finSemana = convertirAMinutosSemana(clase.dia, clase.hora_fin);

      // 1. CLASE EN CURSO
      if (
        minutosActualSemana >= inicioSemana &&
        minutosActualSemana < finSemana
      ) {
        claseActualTemp = clase;
      }
      // 2. CLASE FUTURA (para encontrar la más cercana)
      else if (inicioSemana > minutosActualSemana) {
        const diferencia = inicioSemana - minutosActualSemana;
        if (diferencia < menorDiferencia) {
          menorDiferencia = diferencia;
          proximaTemp = clase;
        }
      }
    });

    // Lógica de visualización y tiempo
    if (claseActualTemp) {
      // Si hay clase ahora, mostrar cuánto falta para que TERMINE
      const finSemana = convertirAMinutosSemana(
        claseActualTemp.dia,
        claseActualTemp.hora_fin,
      );
      setClaseActual(claseActualTemp);
      setTiempoRestante(finSemana - minutosActualSemana);
    } else if (proximaTemp) {
      // Si no hay clase ahora, mostrar cuánto falta para que EMPIECE la próxima
      const inicioSemanaProxima = convertirAMinutosSemana(
        proximaTemp.dia,
        proximaTemp.hora_inicio,
      );
      setClaseActual(null);
      setProximaClase(proximaTemp);
      setTiempoRestante(inicioSemanaProxima - minutosActualSemana);
      programarNotificacion(proximaTemp);
    } else if (horario.length > 0) {
      // Si no hay más clases en la semana, podrías resetear o apuntar a la primera del lunes
      setClaseActual(null);
      setProximaClase(horario[0]);
      setTiempoRestante(null);
    }
  };

  const formatearTiempo = (minutosTotales) => {
    if (!minutosTotales) return "0m";

    const horas = Math.floor(minutosTotales / 60);
    const minutos = minutosTotales % 60;

    if (horas > 0) {
      return `${horas}h ${minutos}m`;
    }

    return `${minutos}m`;
  };

  // 2️⃣ Cargar horario
  useEffect(() => {
    const cargarHorario = async () => {
      try {
        const data = await obtenerHorario(user?.id_estudiante);
        setHorario(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (user?.id_estudiante) {
      cargarHorario();
    }
  }, [user]);

  // 3️⃣ Intervalo tiempo real
  useEffect(() => {
    if (horario.length === 0) return;

    calcularClase();

    const interval = setInterval(() => {
      calcularClase();
    }, 10000); // 🔥 cada segundo

    return () => clearInterval(interval);
  }, [horario]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Cargando...</Text>
      </View>
    );
  }
  return (
    <View
      className={`flex-1 ${scheme === "dark" ? "bg-background-light" : "bg-background-dark"}`}
    >
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-3">
        <View className="flex-row items-center gap-4">
          <View className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary/30">
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsnSHLKhXARpNT9WwCO3TGqDtmTzNiCboB-b9OyZqjzF96RzMY1gXFuIoEHY8-VwX-pU5tqOutxKXBDi3rGGR6ZVJvM5N1OGgWN4Vr3PNlAhdQ4332Wgz7wCW1uvZscSdHsMiabnl5rpxN-abjRNaIzviHvKoloBY5sxHnGQNgWEzDcW_Yy0EPInzjYhRetjEZ60clamx6stvBSD_xBYs4dsUysrHRs1BOulpkCNqPntEWmCaesT0PlzWqMOU5EQU0gJJ1wacVc7s",
              }}
              className="w-full h-full"
            />
          </View>

          <View>
            <Text className="text-sm text-gray-400">Buenos días,</Text>
            <Text className="text-xl font-bold text-white">
              Hola, {nombreArray[0] + " " + nombreArray[2]}
            </Text>
            <TouchableOpacity
              onPress={handleLogout}
              activeOpacity={0.7}
              className="flex-row items-center self-start mt-2 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full"
            >
              <Ionicons name="log-out-outline" size={18} color="#ef4444" />
              <Text className="text-red-500 font-semibold ml-2 text-xs">
                Cerrar Sesiónn
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-12 w-12 rounded-full bg-surface-dark items-center justify-center relative">
          <Text className="text-white text-lg">
            <Ionicons name="notifications" size={24} color="white" />
          </Text>
          <View className="absolute top-3 right-3 h-2.5 w-2.5 rounded-xl bg-green-500" />
        </View>
      </View>

      <ScrollView
        className="px-6"
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* EN CURSO */}
        <View className="mt-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-white">
              {claseActual ? "En curso" : "Próxima clase"}
            </Text>

            <Text className="text-primary text-sm font-semibold">
              {claseActual ? "● Ahora" : "● Próxima"}
            </Text>
          </View>

          {(claseActual || proximaClase) && (
            <View className="rounded-2xl bg-surface-dark p-6 overflow-hidden shadow-lg">
              {/* Encabezado */}
              <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1">
                  <Text className="text-primary text-sm font-semibold mb-1">
                    {claseActual
                      ? claseActual.Espacio?.nombre
                      : proximaClase?.dia}
                  </Text>

                  <Text className="text-2xl font-bold text-white">
                    {claseActual
                      ? claseActual.Asignatura.nombre
                      : proximaClase.Asignatura.nombre}
                  </Text>

                  <Text className="text-gray-400 text-sm mt-1">
                    {claseActual
                      ? `${claseActual.hora_inicio.slice(0, 5)} - ${claseActual.hora_fin.slice(0, 5)}`
                      : `${proximaClase.hora_inicio.slice(0, 5)} - ${proximaClase.hora_fin.slice(0, 5)}`}
                  </Text>
                </View>

                <View className="bg-primary/20 px-4 py-2 rounded-full">
                  <Text className="text-primary font-bold text-base">
                    {formatearTiempo(tiempoRestante)}
                  </Text>
                </View>
              </View>

              {/* Barra progreso solo si está en curso */}
              {claseActual && (
                <View>
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-xs text-gray-400">
                      Tiempo restante
                    </Text>
                    <Text className="text-xs text-gray-400">
                      {formatearTiempo(tiempoRestante)}
                    </Text>
                  </View>

                  <View className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${
                          (tiempoRestante /
                            (horaEnMinutos(claseActual.hora_fin) -
                              horaEnMinutos(claseActual.hora_inicio))) *
                          100
                        }%`,
                      }}
                    />
                  </View>
                </View>
              )}
            </View>
          )}

          {!claseActual && !proximaClase && (
            <View className="rounded-xl bg-surface-dark p-4">
              <Text className="text-gray-400 text-center">
                No tienes clases programadas
              </Text>
            </View>
          )}
        </View>

        {/* ACCESOS RAPIDOS */}
        <View className="mt-6">
          <Text className="text-lg font-bold text-white mb-3">
            Accesos rápidos
          </Text>

          <View className="flex-row justify-between gap-3">
            {[
              {
                label: "Ver\nHorario",
                icon: (
                  <AntDesign name="schedule" size={24} color="bg-primary" />
                ),
                fun: () => router.push("/horario"),
              },
              {
                label: "Buscar\nEspacios",
                icon: <Ionicons name="location" size={24} color="bg-primary" />,
                fun: () => router.push("/aulasdis"),
              },
              {
                label: "Reportar\nIncidente",
                icon: (
                  <Ionicons
                    name="alert-circle-sharp"
                    size={24}
                    color="bg-primary"
                  />
                ),
                fun: () => router.push("/reportar"),
              },
            ].map((item, i) => (
              <TouchableOpacity
                key={i}
                className="flex-1 bg-surface-dark rounded-xl items-center py-4"
                onPress={item.fun}
              >
                <View className="h-12 w-12 rounded-full bg-primary/10 items-center justify-center mb-2">
                  <Text className="text-primary text-xl">{item.icon}</Text>
                </View>
                <Text className="text-sm font-bold text-white text-center">
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* NOVEDADES */}
        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-white">Novedades</Text>
            <Text className="text-primary text-xs font-bold">Ver todo</Text>
          </View>

          {/* Card 1 */}
          <View className="bg-surface-dark rounded-xl p-4 border-l-4 border-primary mb-3">
            <Text className="text-sm font-bold text-white">Cambio de Aula</Text>
            <Text className="text-xs text-gray-400 mt-1">
              La clase de Matemáticas Discretas se mueve al Aula 2B por
              mantenimiento.
            </Text>
            <Text className="text-[10px] text-gray-500 mt-2">Hace 2 horas</Text>
          </View>

          {/* Card 2 */}
          <View className="bg-surface-dark rounded-xl p-4 border-l-4 border-amber-500">
            <Text className="text-sm font-bold text-white">
              Entrega Pendiente
            </Text>
            <Text className="text-xs text-gray-400 mt-1">
              El proyecto final de Ética se entrega mañana antes de las 11:59
              PM.
            </Text>
            <Text className="text-[10px] text-gray-500 mt-2">Hace 30 min</Text>
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM NAV */}
      <View className="absolute bottom-6 left-6 right-6 bg-surface-dark/80 rounded-2xl flex-row justify-between px-4 py-2">
        {[
          <Entypo name="home" size={24} color="#38e07b" />,
          <Entypo name="calendar" size={24} color="gray" />,
          <Entypo name="location" size={24} color="gray" />,
          <AntDesign name="user" size={24} color="gray" />,
        ].map((icon, i) => (
          <View
            key={i}
            className={`flex-1 items-center ${
              i === 0 ? "text-primary" : "text-gray-400"
            }`}
          >
            <Text className="text-xl">{icon}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
