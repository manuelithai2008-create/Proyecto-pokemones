// app/pokemon/[name].tsx
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  useWindowDimensions,
  Animated,
  ScrollView,
} from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { usePokemonDetail } from "../../hooks/usePokemonDetail";
import { usePokemonList } from "../../hooks/usePokemonList";
import { useFavorites } from "../../context/FavoritesContext";
import { ScreenHeader } from "../../components/ScreenHeader";
import { StatRow } from "../../components/StatRow";

const PokemonDetailScreen = () => {
  const params = useLocalSearchParams<{ name?: string | string[] }>();
  const [toastMessage, setToastMessage] = useState("");
  const pokemonName = Array.isArray(params.name) ? params.name[0] : params.name;
  const { pokemon, loading, error } = usePokemonDetail(pokemonName ?? "");
  const { pokemons: allPokemons } = usePokemonList(20);
  const { esFavorito, toggleFavorito } = useFavorites();
  const { width } = useWindowDimensions();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(0.9)).current;
  const isCompact = width < 500;
  const tamañoImagen = width > 900 ? 220 : width > 600 ? 190 : 150;

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

  useEffect(() => {
    const flickerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(imageAnim, {
          toValue: 1.08,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(imageAnim, {
          toValue: 0.96,
          duration: 170,
          useNativeDriver: true,
        }),
        Animated.timing(imageAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ])
    );

    flickerAnimation.start();
    return () => flickerAnimation.stop();
  }, [imageAnim]);

  const tipos = pokemon?.types.map((t) => t.type.name) ?? [];
  const relatedPokemons = useMemo(() => {
    if (!pokemon || !tipos.length) return [];

    const primaryType = tipos[0];
    return allPokemons
      .filter(
        (item) =>
          item.name !== pokemon.name &&
          (item.types ?? []).includes(primaryType)
      )
      .slice(0, 4);
  }, [allPokemons, pokemon, tipos]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No se pudo cargar el Pokémon.</Text>
      </View>
    );
  }

  const favorito = esFavorito(pokemon.name);
  const traduccionesStats: Record<string, string> = {
    hp: "Vida",
    attack: "Ataque",
    defense: "Defensa",
    "special-attack": "Ataque especial",
    "special-defense": "Defensa especial",
    speed: "Velocidad",
  };
  const descripcion = `${pokemon.name
    .charAt(0)
    .toUpperCase()}${pokemon.name.slice(1)} es un Pokémon de tipo ${tipos.join(", ")}. Tiene una presencia muy marcada, una personalidad fuerte y se destaca por su estilo, agilidad y energía en cada movimiento.`;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={pokemon.name}
        subtitle={`#${pokemon.id} · ${tipos.join(", ")}`}
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
            transform: [{ translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] }) }],
          },
        ]}
      >
        <Text style={styles.toastText}>{toastMessage}</Text>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <View style={[styles.heroSection, isCompact && styles.heroSectionCompact]}>
            <View style={[styles.imagePanel, isCompact && styles.imagePanelCompact]}>
              {pokemon.sprites.front_default && (
                <Animated.View
                  style={{
                    transform: [{ scale: imageAnim }],
                    opacity: imageAnim.interpolate({
                      inputRange: [0.9, 1.08],
                      outputRange: [0.75, 1],
                    }),
                  }}
                >
                  <Image
                    source={{ uri: pokemon.sprites.front_default }}
                    style={{ width: tamañoImagen, height: tamañoImagen }}
                  />
                </Animated.View>
              )}
            </View>

            <View style={[styles.identitySection, isCompact && styles.identitySectionCompact]}>
              <Text style={styles.pokemonId}>#{pokemon.id.toString().padStart(3, "0")}</Text>
              <Text style={styles.pokemonName}>{pokemon.name}</Text>
              <View style={styles.typesRow}>
                {tipos.map((type) => (
                  <Pressable
                    key={type}
                    onPress={() => router.push({ pathname: "/", params: { type } })}
                    style={styles.typeBadge}
                  >
                    <Text style={styles.typeText}>{type}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.descriptionBox}>
            <Text style={styles.sectionLabel}>Descripción</Text>
            <Text style={styles.descriptionText}>{descripcion}</Text>
          </View>

          <View style={styles.actionRow}>
            <Pressable
              onPress={() => {
                if (!favorito) toggleFavorito(pokemon.name);
                router.push("/favoritos");
              }}
              style={[
                styles.actionButton,
                styles.primaryAction,
                favorito && styles.actionButtonActive,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Ir a favoritos"
            >
              <Text style={[styles.actionButtonText, favorito && styles.actionButtonTextActive]}>
                Favoritos
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                if (favorito) {
                  toggleFavorito(pokemon.name);
                  setToastMessage(`${pokemon.name} fue eliminado de tus favoritos.`);
                  router.replace("/");
                }
              }}
              disabled={!favorito}
              style={[
                styles.actionButton,
                styles.removeAction,
                !favorito && styles.actionButtonDisabled,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Eliminar de favoritos"
            >
              <Text style={[styles.actionButtonText, !favorito && styles.actionButtonTextDisabled]}>
                Eliminar
              </Text>
            </Pressable>
          </View>

          <View style={[styles.metricsGrid, isCompact && styles.metricsGridCompact]}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Altura</Text>
              <Text style={styles.metricValue}>{pokemon.height / 10} m</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Peso</Text>
              <Text style={styles.metricValue}>{pokemon.weight / 10} kg</Text>
            </View>
          </View>

          <View style={styles.statsWrap}>
            <StatRow label="Tipos" value={tipos.join(", ")} />
          </View>

          {relatedPokemons.length > 0 ? (
            <View style={styles.relatedSection}>
              <Text style={styles.relatedTitle}>Pokémon relacionados</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedList}
              >
                {relatedPokemons.map((item) => (
                  <Pressable
                    key={item.name}
                    onPress={() => router.push(`/pokemon/${item.name}`)}
                    style={styles.relatedCard}
                  >
                    {item.image ? (
                      <Image
                        source={{ uri: item.image }}
                        style={styles.relatedImage}
                        resizeMode="contain"
                      />
                    ) : null}
                    <Text style={styles.relatedName}>{item.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ) : null}

          <View style={styles.statsSection}>
            <Text style={styles.statsTitle}>Estadísticas</Text>
            {pokemon.stats.map((s) => (
              <StatRow
                key={s.stat.name}
                label={traduccionesStats[s.stat.name] ?? s.stat.name}
                value={s.base_stat}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eef2ff",
  },
  container: {
    flex: 1,
    backgroundColor: "#eef2ff",
  },
  scrollContent: {
    paddingVertical: 18,
    paddingBottom: 30,
  },
  card: {
    flex: 1,
    marginHorizontal: 18,
    marginBottom: 18,
    padding: 20,
    borderRadius: 28,
    backgroundColor: "#ffffff",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4,
  },
  heroSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 18,
  },
  heroSectionCompact: {
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  imagePanel: {
    width: 130,
    height: 130,
    borderRadius: 22,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  imagePanelCompact: {
    width: "100%",
    height: 170,
    marginRight: 0,
    marginBottom: 14,
  },
  identitySection: {
    flex: 1,
  },
  identitySectionCompact: {
    width: "100%",
    alignItems: "center",
  },
  pokemonId: {
    color: "#7c3aed",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 6,
  },
  pokemonName: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0f172a",
    textTransform: "capitalize",
    marginBottom: 10,
  },
  typesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  typeBadge: {
    backgroundColor: "#e0e7ff",
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#c7d2fe",
  },
  typeText: {
    color: "#312e81",
    fontWeight: "700",
    fontSize: 11,
    textTransform: "capitalize",
  },
  descriptionBox: {
    backgroundColor: "#fff7ed",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#fed7aa",
    padding: 14,
    marginBottom: 16,
  },
  sectionLabel: {
    color: "#c2410c",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  descriptionText: {
    color: "#7c2d12",
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "600",
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
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryAction: {
    backgroundColor: "#fff7ed",
    borderColor: "#fbbf24",
  },
  removeAction: {
    backgroundColor: "#fff1f2",
    borderColor: "#fda4af",
    shadowColor: "#f43f5e",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  actionButtonDisabled: {
    opacity: 0.45,
  },
  actionButtonActive: {
    backgroundColor: "#fef3c7",
    borderColor: "#f59e0b",
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    color: "#7c2d12",
    fontWeight: "800",
    textAlign: "center",
  },
  actionButtonTextActive: {
    color: "#92400e",
  },
  actionButtonTextDisabled: {
    color: "#9ca3af",
  },
  metricsGrid: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 12,
  },
  metricsGridCompact: {
    flexDirection: "column",
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 12,
    alignItems: "center",
  },
  metricLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },
  metricValue: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "800",
  },
  statsWrap: {
    width: "100%",
    marginTop: 8,
  },
  relatedSection: {
    width: "100%",
    marginTop: 22,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 10,
  },
  relatedList: {
    paddingRight: 10,
  },
  relatedCard: {
    width: 110,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginRight: 10,
    borderRadius: 18,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  relatedImage: {
    width: 64,
    height: 64,
    marginBottom: 6,
  },
  relatedName: {
    color: "#0f172a",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
    textAlign: "center",
  },
  statsSection: {
    width: "100%",
    marginTop: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 10,
  },
  toast: {
    position: "absolute",
    top: 90,
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
  errorText: {
    textAlign: "center",
    color: "#b91c1c",
    fontSize: 15,
  },
});

export default PokemonDetailScreen;
