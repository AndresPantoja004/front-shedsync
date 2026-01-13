import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, Text, View, Image, Button, Pressable } from "react-native";
import Header from "./Header";
import { Link } from "expo-router";

export default function Main() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Header />
      <Link href="/about" className="m-5">
        <View className="rounded-md p-4 bg-white">
          <Text className=" text-blue-500   ">About</Text>
        </View>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({});
