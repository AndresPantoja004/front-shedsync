# SchedSync — Frontend

Breve guía para entender, configurar y ejecutar el frontend de SchedSync (React Native / Expo).

**Requisitos**
- **Node.js**: v16+ recomendado.
- **npm** o **yarn**: para instalar dependencias.
- **Expo CLI / EAS**: si usas servicios de Expo (se usan en este proyecto).

**Instalación rápida**

1. Instala dependencias:

```bash
npm install
# o
yarn install
```

2. Iniciar en modo desarrollo (Metro / Expo):

```bash
npm start
# o
expo start
```

3. Build con EAS (Android/iOS) — si tienes configurado EAS:

```bash
eas build -p android --profile preview
```

**Estructura principal**

- **app/**: rutas y pantallas usadas por `expo-router` (vía filesystem routing). Ej.: [app/index.js](app/index.js), [app/perfil.js](app/perfil.js).
- **src/components/**: componentes reutilizables y pantallas principales (ej.: [src/components/Home.jsx](src/components/Home.jsx), [src/components/Profile.jsx](src/components/Profile.jsx), [src/components/AulasDisponibles.jsx](src/components/AulasDisponibles.jsx), [src/components/ReportarIncidentes.jsx](src/components/ReportarIncidentes.jsx)).
- **src/context/**: contextos globales (autenticación y registro). Principalmente [src/context/AuthContext.jsx](src/context/AuthContext.jsx) y [src/context/RegisterContext.jsx](src/context/RegisterContext.jsx).
- **src/services/api/**: wrappers para llamadas a la API (login, usuario, espacios, reservas, etc.). Ver [src/services/api/config.js](src/services/api/config.js) para la URL base.
- **src/navigation/**: navigator y helpers (ej.: [src/navigation/AppNavigator.jsx](src/navigation/AppNavigator.jsx)).
- **assets/**: imágenes y recursos (logo en assets/images).
- **tailwind / nativewind**: el proyecto usa utilidades tipo Tailwind para estilos (ver `tailwind.config.js` y `babel.config.js`).

**Flujo de autenticación**

- La pantalla de login se encuentra en [src/components/Auth/Login.jsx](src/components/Auth/Login.jsx).
- `AuthContext` maneja `login`, `logout` y persistencia en AsyncStorage. Después de un login exitoso, el token y el usuario se guardan en el contexto y en AsyncStorage para mantener la sesión.
- Muchas pantallas leen `user` desde `AuthContext` para mostrar datos o condicionar acciones.

**Componentes y responsabilidades clave**

- `Home.jsx`: lógica de horario, detección de clase actual y próxima, notificaciones programadas.
- `AulasDisponibles.jsx`: búsqueda, filtros y reserva de espacios (modal con horarios por espacio).
- `Profile.jsx`: vista de perfil del usuario y logout (usa `AuthContext`).
- `ReportarIncidentes.jsx`: formulario para enviar incidencias con imagen, selección de espacio y categoría.
- `Inputs/`, `Layout/`, `Navigation/`: utilidades y componentes de presentación.

**APIs y servicios**

- Las funciones que llaman al backend están en `src/services/api/` (ej.: `auth.js`, `espacios.js`, `reserva.js`). Ajusta la URL base en [src/services/api/config.js](src/services/api/config.js) si tu backend está en otra dirección.

**Variables / Configuración**

- API base: editar en [src/services/api/config.js](src/services/api/config.js).
- EAS / Expo: revisa `eas.json` y `app.json` para parámetros de build.

**Comandos útiles**

- Instalar dependencias: `npm install` o `yarn install`.
- Ejecutar en desarrollo: `npm start` / `expo start`.
- Limpiar cache (Metro/Expo): `expo start -c`.
- Build con EAS: `eas build -p android --profile preview`.

**Problemas comunes**

- Si no carga el bundler: ejecuta `expo start -c` para limpiar cache.
- Errores de dependencias nativas: asegúrate de usar la versión de Expo SDK indicada en `app.json` y reinstala con `npm install`.
- Error de token/autorization: revisar la respuesta del backend desde `src/services/api/auth.js` y la persistencia en `AuthContext`.

**Contribuir / Extender**

- Añadir pantallas: puedes crear nuevas páginas en `app/` (expo-router las detecta automáticamente).
- Lógica compartida: colocar helpers en `src/utils` o nuevos servicios en `src/services/api/`.

**Referencias rápidas (archivos importantes)**

- `app/` — rutas: [app/index.js](app/index.js)
- Contexto auth: [src/context/AuthContext.jsx](src/context/AuthContext.jsx)
- Login: [src/components/Auth/Login.jsx](src/components/Auth/Login.jsx)
- Home: [src/components/Home.jsx](src/components/Home.jsx)
- Aulas: [src/components/AulasDisponibles.jsx](src/components/AulasDisponibles.jsx)
- APIs: [src/services/api/config.js](src/services/api/config.js)


Fecha: 2026-02-13
