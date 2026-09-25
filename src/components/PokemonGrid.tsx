import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { PokemonListItem } from "../types/pokemon";
import { PokemonCard } from "./PokemonCard";

interface PokemonGridProps {
  data: PokemonListItem[];
  favoriteNames: string[];
  onToggleFavorite: (name: string) => void;
  columns: number;
  onEndReached?: () => void;
  loadingMore?: boolean;
}

export const PokemonGrid = ({
  data,
  favoriteNames,
  onToggleFavorite,
  columns,
  onEndReached,
  loadingMore,
}: PokemonGridProps) => {
  return (
    <FlatList
      key={columns}
      data={data}
      numColumns={columns}
      keyExtractor={(item) => item.name}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      ListFooterComponent={() =>
        loadingMore ? (
          <View style={styles.footer}>
            <ActivityIndicator size="small" color="#7c3aed" />
            <Text style={styles.footerText}>Cargando más...</Text>
          </View>
        ) : null
      }
      renderItem={({ item }) => (
        <View style={styles.itemWrap}>
          <PokemonCard
            name={item.name}
            imageUri={item.image}
            type={item.types?.[0] ?? "normal"}
            favorite={favoriteNames.includes(item.name)}
            onToggleFavorite={() => onToggleFavorite(item.name)}
          />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    paddingTop: 12,
  },
  itemWrap: {
    flex: 1,
    minWidth: 142,
    maxWidth: "50%",
    justifyContent: "center",
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  footerText: {
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "700",
  },
});
