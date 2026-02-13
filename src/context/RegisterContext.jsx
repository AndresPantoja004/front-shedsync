import { createContext, useState } from "react";

export const RegisterContext = createContext(null);

export function RegisterProvider({ children }) {
  const [registro, setRegistro] = useState({
    tipoUsuario: "S",
    paso1: {
      nombre: "",
      email: "",
      password: "",
      rol: ""
    },
    paso2: {},
    paso3: {}
  });

  return (
    <RegisterContext.Provider value={{ registro, setRegistro }}>
      {children}
    </RegisterContext.Provider>
  );
}