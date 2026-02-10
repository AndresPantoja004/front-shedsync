import { StyleSheet } from "react-native";
import { AuthProvider } from "../context/AuthContext";
import AppNavigator from "../navigation/AppNavigator";

export default function Main() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({});
