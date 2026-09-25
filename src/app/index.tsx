// app/index.tsx
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  ScrollView,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { usePokemonList } from "../hooks/usePokemonList";
import { useFavorites } from "../context/FavoritesContext";
import { ScreenHeader } from "../components/ScreenHeader";
import { PokemonGrid } from "../components/PokemonGrid";

const HomeScreen = () => {
  const params = useLocalSearchParams<{ type?: string }>();
  const { pokemons, loading, error, loadMore, loadingMore } = usePokemonList(20, 20);
  const { esFavorito, toggleFavorito } = useFavorites();
  const { width } = useWindowDimensions();
  const columnas = width > 768 ? 3 : 2;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState(
    typeof params.type === "string" ? params.type : "all"
  );

  useEffect(() => {
    if (typeof params.type === "string") {
      setSelectedType(params.type);
      return;
    }
    setSelectedType("all");
  }, [params.type]);

  const availableTypes = Array.from(
    new Set(pokemons.flatMap((pokemon) => pokemon.types ?? []))
  ).sort();

  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesSearch = pokemon.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesType =
      selectedType === "all" ||
      (pokemon.types ?? []).includes(selectedType);

    return matchesSearch && matchesType;
  });

  const getSearchTarget = (term: string) => {
    const cleaned = term.trim().toLowerCase();
    if (!cleaned) return null;

    const exactMatch = pokemons.find(
      (pokemon) => pokemon.name.toLowerCase() === cleaned
    );
    if (exactMatch) return exactMatch.name;

    const matchByType = pokemons.find((pokemon) => {
      const matchesType =
        selectedType === "all" ||
        (pokemon.types ?? []).includes(selectedType);
      return matchesType && pokemon.name.toLowerCase().includes(cleaned);
    });

    return matchByType?.name ?? null;
  };

  const navigateToSearchResult = () => {
    const target = getSearchTarget(search);
    if (target) {
      setSearch(target);
      router.push(`/pokemon/${target}`);
    }
  };

  const searchSuggestions = pokemons
    .filter((pokemon) => {
      const matchesSearch = pokemon.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesType =
        selectedType === "all" ||
        (pokemon.types ?? []).includes(selectedType);

      return matchesSearch && matchesType;
    })
    .slice(0, 6);

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

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Ocurrió un error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Pokedex"
        subtitle="Descubre y guarda tus favoritos"
        action={
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Link href="/favoritos" asChild>
              <Pressable style={styles.favoritosLink}>
                <Text style={styles.favoritosLinkText}>★ Favoritos</Text>
              </Pressable>
            </Link>
          </Animated.View>
        }
      />

      <View style={styles.searchWrap}>
        <Text style={styles.searchLabel}>Buscar Pokémon</Text>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={navigateToSearchResult}
            placeholder="Ej: pikachu, charmander..."
            placeholderTextColor="#7c7c7c"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            style={styles.searchInput}
          />
          {search.trim() ? (
            <Pressable onPress={navigateToSearchResult} style={styles.searchAction}>
              <Text style={styles.searchActionText}>Ir</Text>
            </Pressable>
          ) : null}
        </View>
        <View style={styles.searchMeta}>
          <Text style={styles.searchCount}>
            {filteredPokemons.length} Pokémon
          </Text>
          {search ? (
            <Pressable onPress={() => setSearch("")} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Limpiar</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={styles.filterWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        >
          <Pressable
            onPress={() => {
              setSelectedType("all");
              router.setParams({ type: "all" });
            }}
            style={[
              styles.filterChip,
              selectedType === "all" && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedType === "all" && styles.filterChipTextActive,
              ]}
            >
              Todos
            </Text>
          </Pressable>

          {availableTypes.map((type) => (
            <Pressable
              key={type}
              onPress={() => {
                setSelectedType(type);
                router.setParams({ type });
              }}
              style={[
                styles.filterChip,
                selectedType === type && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedType === type && styles.filterChipTextActive,
                ]}
              >
                {type}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {search.trim() ? (
        <View style={styles.suggestionsWrap}>
          {searchSuggestions.length > 0 ? (
            searchSuggestions.map((pokemon) => (
              <Pressable
                key={pokemon.name}
                onPress={() => router.push(`/pokemon/${pokemon.name}`)}
                style={styles.suggestionItem}
              >
                <Text style={styles.suggestionName}>{pokemon.name}</Text>
                <Text style={styles.suggestionType}>{pokemon.types?.join(" · ")}</Text>
              </Pressable>
            ))
          ) : (
            <Text style={styles.noResultsText}>No hay coincidencias para "{search}"</Text>
          )}
        </View>
      ) : null}

      {filteredPokemons.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No se encontraron resultados</Text>
          <Text style={styles.emptyStateText}>
            Intenta con otro nombre para buscar más Pokémon.
          </Text>
        </View>
      ) : (
        <PokemonGrid
          data={filteredPokemons}
          columns={columnas}
          favoriteNames={filteredPokemons
            .filter((p) => esFavorito(p.name))
            .map((p) => p.name)}
          onToggleFavorite={(name) => toggleFavorito(name)}
          onEndReached={() => {
            if (selectedType === "all" && !search.trim()) loadMore();
          }}
          loadingMore={loadingMore}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f3ff",
    padding: 24,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff7ed",
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#7c2d12",
    marginBottom: 10,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#fbbf24",
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 14,
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  searchAction: {
    marginLeft: 8,
    backgroundColor: "#f59e0b",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchActionText: {
    color: "#fff7ed",
    fontSize: 12,
    fontWeight: "800",
  },
  searchIcon: {
    fontSize: 22,
    color: "#7c2d12",
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0f172a",
    fontWeight: "600",
  },
  searchMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 4,
  },
  searchCount: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7c2d12",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  clearButton: {
    backgroundColor: "#fff7ed",
    borderWidth: 1,
    borderColor: "#fbbf24",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  clearButtonText: {
    color: "#7c2d12",
    fontSize: 11,
    fontWeight: "800",
  },
  filterWrap: {
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  filterList: {
    paddingVertical: 8,
    paddingRight: 12,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#f3d6a0",
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: "#f59e0b",
    borderColor: "#d97706",
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#7c2d12",
    textTransform: "capitalize",
  },
  filterChipTextActive: {
    color: "#fff7ed",
  },
  suggestionsWrap: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fbbf24",
    overflow: "hidden",
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#fef3c7",
  },
  suggestionName: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "800",
    textTransform: "capitalize",
  },
  suggestionType: {
    color: "#7c2d12",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  noResultsText: {
    color: "#7c2d12",
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
    lineHeight: 22,
  },
  favoritosLink: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#fff8e1",
    borderWidth: 1,
    borderColor: "#fbbf24",
    shadowColor: "#fbbf24",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 5,
  },
  favoritosLinkText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#7c2d12",
  },
  errorText: {
    fontSize: 15,
    color: "#b91c1c",
    textAlign: "center",
  },
});

export default HomeScreen;
