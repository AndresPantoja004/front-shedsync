import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Image } from "react-native";

export default function AnimatedSplash({ onFinish }) {
  // Valores de animación para escala y opacidad
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Secuencia de animación: Aparecer y escalar
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1.1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
      // Pequeña espera y desvanecimiento final
      Animated.delay(1000),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onFinish) onFinish(); // Avisa que la animación terminó
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Image
          source={require("../../assets/ShedSync_Logo2.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#122017", // Tu color verde oscuro
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
});
