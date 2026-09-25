// context/FavoritesContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@pokedex-lite/favoritos";

interface FavoritesContextValue {
  favoritos: string[];
  loading: boolean;
  esFavorito: (name: string) => boolean;
  toggleFavorito: (name: string) => void;
}

// Se crea con un valor por defecto "vacío" solo para que TS no se queje;
// el valor real siempre llega desde <FavoritesProvider>.
const FavoritesContext = createContext<FavoritesContextValue>({
  favoritos: [],
  loading: true,
  esFavorito: () => false,
  toggleFavorito: () => {},
});

interface FavoritesProviderProps {
  children: React.ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Carga inicial: lee lo guardado en el dispositivo, si existe.
  useEffect(() => {
    let cancelled = false;

    const cargarFavoritos = async () => {
      try {
        const guardado = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && guardado) {
          setFavoritos(JSON.parse(guardado) as string[]);
        }
      } catch (err) {
        // Si falla la lectura (p.ej. dato corrupto), seguimos con lista vacía.
        console.warn("No se pudieron cargar los favoritos:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    cargarFavoritos();

    return () => {
      cancelled = true;
    };
  }, []);

  // Cada vez que cambian los favoritos (después de la carga inicial), se guardan.
  useEffect(() => {
    if (loading) return; // evita sobreescribir con [] antes de terminar de leer
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favoritos)).catch((err) =>
      console.warn("No se pudieron guardar los favoritos:", err)
    );
  }, [favoritos, loading]);

  const esFavorito = (name: string): boolean => favoritos.includes(name);

  const toggleFavorito = (name: string) => {
    setFavoritos((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <FavoritesContext.Provider
      value={{ favoritos, loading, esFavorito, toggleFavorito }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
