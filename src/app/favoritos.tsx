// app/favoritos.tsx
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Link, router } from "expo-router";
import { useFavorites } from "../context/FavoritesContext";
import { ScreenHeader } from "../components/ScreenHeader";
import { EmptyState } from "../components/EmptyState";

const FavoritosScreen = () => {
  const { favoritos, loading, toggleFavorito } = useFavorites();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!toastMessage) return;

    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.delay(1200),
      Animated.timing(toastAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => setToastMessage(""));
  }, [toastMessage, toastAnim]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  if (favoritos.length === 0) {
    return (
      <>
        <ScreenHeader
          title="Favoritos"
          subtitle="Tu colección aún está vacía"
          action={
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Pressable onPress={() => router.replace("/")} style={styles.homeButton}>
                <Text style={styles.homeButtonText}>← Inicio</Text>
              </Pressable>
            </Animated.View>
          }
        />
        <EmptyState
          title="Sin favoritos aún"
          message="Toca la ★ junto a un Pokémon en la lista para agregarlo a tu colección."
        />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Favoritos"
        subtitle={`${favoritos.length} Pokémon guardados`}
        action={
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Pressable onPress={() => router.replace("/")} style={styles.homeButton}>
              <Text style={styles.homeButtonText}>← Inicio</Text>
            </Pressable>
          </Animated.View>
        }
      />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.toast,
          {
            opacity: toastAnim,
            transform: [{ translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] }) }],
          },
        ]}
      >
        <Text style={styles.toastText}>{toastMessage}</Text>
      </Animated.View>

      <FlatList
        data={favoritos}
        keyExtractor={(name) => name}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: name }) => (
          <View style={styles.row}>
            <Link href={`/pokemon/${name}`} asChild>
              <Pressable style={styles.rowTouchable}>
                <Text style={styles.name}>{name}</Text>
              </Pressable>
            </Link>
            <Pressable
              onPress={() => {
                toggleFavorito(name);
                setToastMessage(`${name} fue eliminado de tus favoritos.`);
                router.replace("/");
              }}
              hitSlop={8}
              style={styles.remove}
            >
              <Text style={styles.removeText}>Quitar</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef2ff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#eef2ff",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#475569",
    lineHeight: 24,
    marginTop: 8,
  },
  list: { padding: 16 },
  toast: {
    position: "absolute",
    top: 96,
    left: 20,
    right: 20,
    zIndex: 20,
    backgroundColor: "rgba(15, 23, 42, 0.88)",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 5,
  },
  toastText: {
    color: "#f8fafc",
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  rowTouchable: { flex: 1 },
  name: {
    fontSize: 18,
    textTransform: "capitalize",
    color: "#0f172a",
    fontWeight: "700",
  },
  homeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#fff7ed",
    borderWidth: 1,
    borderColor: "#fbbf24",
  },
  homeButtonText: {
    color: "#7c2d12",
    fontSize: 12,
    fontWeight: "800",
  },
  remove: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  removeText: { fontSize: 13, color: "#334155", fontWeight: "700" },
});

export default FavoritosScreen;
