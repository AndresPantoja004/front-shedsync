import { View } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../src/context/AuthContext";
import Login from "../src/components/Auth/Login";
import Home from "../src/components/Home";
import BuscarEspacios from "../src/components/AulasDisponibles.jsx";

export default function EspaciosDisponibles() {

  return (
    <BuscarEspacios />
  );
}