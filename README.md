# TM6 Recetas

PWA con más de 4400 recetas para Thermomix TM6. Diseñada como app nativa para iPhone con soporte offline.

## Funcionalidades

- **4400+ recetas** organizadas por categorías con pasos detallados para TM6
- **Buscador** con filtros por categoría, dificultad, tiempo, ingredientes (incluir/excluir), dieta y utensilios
- **Favoritos** (❤️) y **Hacer más tarde** (🔖)
- **Lista de la compra** con checkboxes, vinculada a cada receta
- **Modo cocción** paso a paso con temporizador integrado y wake lock
- **Añadir/editar recetas** con wizard de 4 pasos
- **Tema claro/oscuro** con detección automática del sistema
- **PWA** instalable en iPhone (Añadir a pantalla de inicio)

## Uso

Abre https://tecladooscuro.github.io/TM6 en Safari en tu iPhone y pulsa **Compartir > Añadir a pantalla de inicio**.

## Desarrollo

```bash
npm install
npm run dev       # desarrollo local
npm run build     # build producción
```

## Stack

React 19 · TypeScript · TailwindCSS v4 · Framer Motion · Zustand · Dexie.js (IndexedDB) · Vite · vite-plugin-pwa
