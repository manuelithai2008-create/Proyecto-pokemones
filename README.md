# Pokedex Lite

Proyecto final del curso **"De React a React Native, sin dar nada por
sentado"** (Instructor: Edwin Rozo Gómez). App de 3 pantallas construida con
Expo Router + TypeScript, consumiendo la [PokeAPI](https://pokeapi.co/).

## Rutas

| Ruta                | Pantalla   | Qué hace                                                         |
| -------------------- | ---------- | ------------------------------------------------------------------ |
| `/`                   | Lista      | Trae los primeros 20 Pokémon y los muestra en una lista/grilla     |
| `/pokemon/[name]`     | Detalle    | Imagen, tipos, altura, peso y estadísticas del Pokémon             |
| `/favoritos`          | Favoritos  | Lista los Pokémon marcados con ★, persistidos con AsyncStorage     |

## Estructura

```
pokedex-lite/
├── app/
│   ├── _layout.tsx          ← Stack raíz (index, pokemon/[name], favoritos)
│   ├── index.tsx             ← Lista (responsive: 1/2/3 columnas)
│   ├── favoritos.tsx         ← Favoritos
│   └── pokemon/[name].tsx    ← Detalle (ruta dinámica)
├── context/
│   └── FavoritesContext.tsx  ← Estado global de favoritos + AsyncStorage
├── hooks/
│   ├── usePokemonList.ts     ← fetch a /pokemon?limit=20&offset=0
│   └── usePokemonDetail.ts   ← fetch a /pokemon/{name}
├── types/
│   └── pokemon.ts            ← Tipos de las respuestas de la PokeAPI
├── app.json
├── package.json
└── tsconfig.json
```

## Cómo correrlo

Este directorio contiene el código fuente, no un proyecto ya inicializado
con `node_modules`. Para levantarlo:

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Levanta el servidor de desarrollo (Metro):

   ```bash
   npx expo start
   ```

3. Con el servidor corriendo, en la misma terminal:
   - **Plan A — Emulador Android**: presiona `a` (necesitas Android Studio
     con un dispositivo virtual creado).
   - **Plan B — Web**: presiona `w`.
   - **Celular físico**: escanea el QR con la app **Expo Go**.

## Favoritos: cómo funciona

`FavoritesProvider` (en `context/FavoritesContext.tsx`) envuelve toda la app
desde `app/_layout.tsx`. Guarda el arreglo de nombres favoritos con
`AsyncStorage`, así que sobreviven a cerrar la app. Desde la lista o el
detalle puedes tocar la ★ para agregar/quitar un Pokémon, y `/favoritos`
muestra la lista completa con acceso directo al detalle de cada uno.

## Troubleshooting rápido

- **Metro se queda pegado / cambios no se reflejan**: `npx expo start -c`
  (limpia caché).
- **`numColumns` no cambia el layout al redimensionar**: ya está resuelto
  con `key={columnas}` en el `FlatList` de `app/index.tsx` — FlatList
  necesita remontarse cuando cambia esa prop.
- **Error de red al hacer fetch en el emulador**: confirma que el emulador
  tenga internet (abre un navegador dentro de él).
