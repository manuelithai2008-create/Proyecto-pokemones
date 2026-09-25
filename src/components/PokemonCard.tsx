import React from "react";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

const TYPE_STYLES: Record<string, { bg: string; soft: string; text: string }> = {
  normal: { bg: "#a8a77a", soft: "#f5f5f5", text: "#4b5563" },
  fire: { bg: "#ee8130", soft: "#fff1e6", text: "#7c2d12" },
  water: { bg: "#6390f0", soft: "#eaf3ff", text: "#1d4ed8" },
  electric: { bg: "#f7d02c", soft: "#fffbe6", text: "#92400e" },
  grass: { bg: "#7ac74c", soft: "#edfdf2", text: "#166534" },
  ice: { bg: "#96d9d6", soft: "#ebfeff", text: "#0f766e" },
  fighting: { bg: "#c22e28", soft: "#fff1f2", text: "#7f1d1d" },
  poison: { bg: "#a33ea1", soft: "#faf5ff", text: "#6b21a8" },
  ground: { bg: "#e2bf65", soft: "#fff7e8", text: "#854d0e" },
  flying: { bg: "#a98ff3", soft: "#f3f0ff", text: "#4c1d95" },
  psychic: { bg: "#f95587", soft: "#fff1f5", text: "#9d174d" },
  bug: { bg: "#a6b91a", soft: "#f7ffe9", text: "#3f6212" },
  rock: { bg: "#b6a136", soft: "#fffbeb", text: "#713f12" },
  ghost: { bg: "#735797", soft: "#f5f3ff", text: "#4c1d95" },
  dragon: { bg: "#6f35fc", soft: "#f3e8ff", text: "#4c1d95" },
  dark: { bg: "#705746", soft: "#f3f4f6", text: "#1f2937" },
  steel: { bg: "#b7b7ce", soft: "#f8fafc", text: "#334155" },
  fairy: { bg: "#d685ad", soft: "#fff1f7", text: "#9d174d" },
};

interface PokemonCardProps {
  name: string;
  imageUri?: string;
  type?: string;
  favorite: boolean;
  onToggleFavorite: () => void;
}

export const PokemonCard = ({
  name,
  imageUri,
  type = "normal",
  favorite,
  onToggleFavorite,
}: PokemonCardProps) => {
  const router = useRouter();
  const palette = TYPE_STYLES[type] ?? TYPE_STYLES.normal;

  return (
    <Pressable
      onPress={() => router.push(`/pokemon/${name}`)}
      style={[styles.card, { backgroundColor: palette.soft, borderColor: `${palette.bg}40` }]}
    >
      <View style={[styles.cardContent, { backgroundColor: palette.soft }]}>
        <Text style={[styles.badge, { backgroundColor: `${palette.bg}20`, color: palette.text }]}>
          #{name.length}
        </Text>

        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            onToggleFavorite();
          }}
          hitSlop={8}
          style={styles.favoriteButton}
        >
          <Text style={styles.favoriteText}>{favorite ? "★" : "☆"}</Text>
        </Pressable>

        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={[styles.image, { backgroundColor: `${palette.bg}18` }]}
            resizeMode="contain"
          />
        ) : null}

        <View style={styles.textWrap}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {name}
          </Text>
          <View style={[styles.typeChip, { backgroundColor: palette.bg }]}>
            <Text style={[styles.type, { color: "#fff" }]} numberOfLines={1} ellipsizeMode="tail">
              {type}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 168,
    height: 168,
    margin: 6,
    borderRadius: 20,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
  },
  cardContent: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 8,
    borderRadius: 18,
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  favoriteButton: {
    position: "absolute",
    right: 14,
    top: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#fff7ed",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  favoriteText: {
    color: "#f59e0b",
    fontSize: 19,
  },
  image: {
    width: 82,
    height: 82,
    alignSelf: "center",
    marginTop: 6,
    borderRadius: 16,
  },
  textWrap: {
    width: "100%",
    maxWidth: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    overflow: "hidden",
  },
  name: {
    width: "100%",
    maxWidth: "100%",
    marginTop: 4,
    color: "#0f172a",
    fontSize: 13.5,
    fontWeight: "800",
    textTransform: "capitalize",
    textAlign: "center",
    lineHeight: 18,
    includeFontPadding: false,
    flexShrink: 1,
  },
  typeChip: {
    marginTop: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  type: {
    width: "100%",
    maxWidth: "100%",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
    textTransform: "capitalize",
    textAlign: "center",
    lineHeight: 14,
    includeFontPadding: false,
    flexShrink: 1,
  },
});
