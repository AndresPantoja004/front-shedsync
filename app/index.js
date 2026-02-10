import { View } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../src/context/AuthContext";
import Login from "../src/components/Auth/Login";
import Home from "../src/components/Home";

export default function Index() {
  const { token } = useContext(AuthContext);

  return (
    <View className="flex-1 bg-background-dark">
      {!token ? <Login /> : <Home />}
    </View>
  );
}