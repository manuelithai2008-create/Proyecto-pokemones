// app/_layout.tsx
import { Stack } from "expo-router";
import { FavoritesProvider } from "../context/FavoritesContext";

const RootLayout = () => {
  return (
    <FavoritesProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Pokedex Lite" }} />
        <Stack.Screen
          name="pokemon/[name]"
          options={{ title: "Detalle" }}
        />
        <Stack.Screen name="favoritos" options={{ title: "Favoritos" }} />
      </Stack>
    </FavoritesProvider>
  );
};

export default RootLayout;
