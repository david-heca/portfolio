# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) para trabajar con el código en este repositorio.

## Comandos de desarrollo

```bash
bun run dev       # Servidor de desarrollo con hot reload (localhost:4321)
bun run build     # Build de producción en /dist
bun run preview   # Vista previa del build de producción
```

No hay framework de testing ni linter configurado.

## Arquitectura

Portafolio personal construido con **Astro 5 + React 19 + Tailwind CSS 4**, desplegado con compresión gzip/brotli.

### Enrutamiento bilingüe (ES/EN)

- Español es el idioma por defecto (rutas sin prefijo: `/`, `/work`, `/projects`, etc.)
- Inglés usa prefijo `/en` (`/en`, `/en/work`, `/en/projects`, etc.)
- `src/pages/index.astro` sirve la home en español, `src/pages/en.astro` la de inglés
- `src/pages/[...slug].astro` genera todas las subrutas para ambos idiomas vía `getStaticPaths()`
- Las traducciones viven en `src/i18n/locales/es.json` y `en.json` (~330 líneas cada una)
- `useTranslations(lang)` retorna una función `t(key)` que soporta claves anidadas con notación de punto

### Sistema de temas

- Variables CSS custom en `src/styles/global.css` con variantes light/dark
- La clase `.dark` en `<html>` controla el tema; se aplica antes del paint para evitar flash
- Persistido en `localStorage['color-theme']` y preservado entre View Transitions con `astro:before-swap`

### Componentes

- **Secciones** (`src/components/sections/`): Home, Skills, Work, Projects, Education, Contact — componentes Astro que reciben `lang: "es" | "en"` como prop
- **UI** (`src/components/ui/`): Navbar, ThemeToggle, LanguagePicker, CvDownloadButton — Navbar y Footer usan `transition:persist` para preservarse entre View Transitions
- React se usa solo para componentes interactivos (CvDownloadButton); el resto es Astro puro

### Path aliases (tsconfig.json)

`@/*` → `src/*`, `@components/*`, `@sections/*`, `@ui/*`, `@layouts/*`, `@styles/*`, `@utils/*`, `@i18n/*`, `@assets/*` → `public/assets/*`

### Patrones clave

- Animaciones de revelación con `.reveal` + IntersectionObserver (root margin `-50px`)
- Iconos de React Icons usando el set Phosphor (`PiXxxxx`)
- Color de acento indigo (`--color-accent: #6366F1` light / `#557ce9` dark)
- Fuentes: Inter (sans) y JetBrains Mono (mono)
- Imágenes en formato WebP; imágenes críticas con `loading="eager"`
