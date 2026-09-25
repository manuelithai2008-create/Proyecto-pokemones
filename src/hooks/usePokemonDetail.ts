// hooks/usePokemonDetail.ts
import { useEffect, useState } from "react";
import { PokemonDetail } from "../types/pokemon";

export const usePokemonDetail = (name: string) => {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const pokemonName = Array.isArray(name) ? name[0] : name;

    const fetchDetail = async () => {
      if (!pokemonName) {
        if (!cancelled) {
          setPokemon(null);
          setError("No se especificó el Pokémon.");
          setLoading(false);
        }
        return;
      }

      try {
        setError(null);
        setLoading(true);
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: PokemonDetail = await res.json();
        if (!cancelled) setPokemon(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error desconocido");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDetail();

    return () => {
      cancelled = true;
    };
  }, [name]);

  return { pokemon, loading, error };
};
