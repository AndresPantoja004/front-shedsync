import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, Text, View, Image, Button, Pressable } from "react-native";

export default function Main() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <Text className="text-red-400">Hola Mundoo movil vamos ok </Text>
      <Image
        fadeDuration={5}
        source={{
          uri: "https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2020/02/dragon-ball-1864249.jpg?tf=2048x",
        }}
        blurRadius={0}
        style={{ width: 400, height: 400, resizeMode: "contain" }}
      />
      <Text style={{ color: "black", fontWeight: "bold" }}>
        Bienvenido a tu app Mobile no peru
      </Text>
      <Button title="Presioname" onPress={() => alert("Hola Mundo!")} />
      <Pressable
        onPressIn={() => {}}
        style={{
          backgroundColor: "green",
          borderRadius: 10,
          marginTop: 50,
          padding: 7,
        }}
        onPress={() => alert("Hola Mundo desde TouchableHighlight!")}
      >
        {({ pressed }) => (
          <Text
            style={{
              color: "yellow",
              fontWeight: "bold",
              fontSize: pressed ? 20 : 16,
            }}
          >
            Presioname tambien
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({});
