// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],

    // Configuración adicional
    plugins: ["prettier"],
    rules: {
      // Integración con Prettier: muestra errores cuando el formato no coincide
      "prettier/prettier": "error",

      // Ejemplos de reglas recomendadas (puedes ajustarlas)
      "no-unused-vars": "warn",
      "react/react-in-jsx-scope": "off", // No necesario con React 17+
    },
  },
]);
