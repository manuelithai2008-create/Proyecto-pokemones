// types/pokemon.ts

export interface PokemonListItem {
  name: string;
  url: string;
  image?: string;
  types?: string[];
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonType {
  slot: number;
  type: { name: string; url: string };
}

export interface PokemonStat {
  base_stat: number;
  stat: { name: string };
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
  };
  types: PokemonType[];
  stats: PokemonStat[];
}
