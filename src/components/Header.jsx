import { View, Text, Image } from "react-native";
import { getComics } from "../../services/comics";

export default function Header() {


    return (
        <View className="items-center justify-center p-4 bg-blue-600">
            <Text className="text-white text-2xl font-bold">Mi Aplicación Móvill</Text>
        </View>
    )
}