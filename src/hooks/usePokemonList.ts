// hooks/usePokemonList.ts
import { useCallback, useEffect, useState } from "react";
import { PokemonDetail, PokemonListItem, PokemonListResponse } from "../types/pokemon";

export const usePokemonList = (
  initialLimit: number = 20,
  pageSize: number = 20
) => {
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchPage = useCallback(
    async (nextOffset: number, append: boolean) => {
      try {
        setError(null);
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${pageSize}&offset=${nextOffset}`
        );
        if (!res.ok) throw new Error(`Error ${res.status}`);

        const data: PokemonListResponse = await res.json();
        const pokemonsWithImages = await Promise.all(
          data.results.map(async (item) => {
            const id = item.url.split("/").filter(Boolean).pop();
            const image = id
              ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
              : undefined;

            try {
              const detailRes = await fetch(item.url);
              if (!detailRes.ok) throw new Error("Detalle no disponible");
              const detail: PokemonDetail = await detailRes.json();
              return {
                ...item,
                image,
                types: detail.types.map((entry) => entry.type.name),
              };
            } catch {
              return {
                ...item,
                image,
                types: [],
              };
            }
          })
        );

        setPokemons((prev) =>
          append ? [...prev, ...pokemonsWithImages] : pokemonsWithImages
        );
        setOffset(nextOffset + pokemonsWithImages.length);
        setHasMore(nextOffset + pokemonsWithImages.length < data.count);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      if (cancelled) return;
      setPokemons([]);
      setOffset(0);
      setHasMore(true);
      await fetchPage(0, false);
    };

    initialize();

    return () => {
      cancelled = true;
    };
  }, [fetchPage, initialLimit]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    fetchPage(offset, true);
  }, [fetchPage, hasMore, loadingMore, offset]);

  return { pokemons, loading, loadingMore, error, loadMore, hasMore };
};
