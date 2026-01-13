import { Link } from "expo-router";
import { Text, View } from "react-native";
export default function About() {
  return (
    <View className="items-center justify-center flex-1 bg-black p-4">
      <Text className="text-white text-3xl">Acerca de Mi Aplicación Móvil</Text>
      <Text className="text-white text-lg mt-4 bg-gray-400 p-4">
        Esta aplicación es un ejemplo sencillo de una aplicación móvil
        construida con React Native y Expo Router.{" "}
      </Text>
      <Link href="/" className="my-5">
        <View className="rounded-md p-4 bg-white">
            <Text className=" text-blue-500   ">Ir al Inicio</Text>
        </View>
      </Link>
    </View>
  );
}
