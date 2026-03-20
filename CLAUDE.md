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
- Detección automática de idioma del navegador en primera visita; persistido en `localStorage['preferred-lang']`

### SEO

- hreflang alternates (ES/EN + x-default) generados en `Layout.astro`
- Sitemap automático vía `@astrojs/sitemap` + `robots.txt` en `public/`
- Canonical URLs, Open Graph y Twitter Cards en cada página

### Sistema de temas

- Variables CSS custom en `src/styles/global.css` con variantes light/dark
- La clase `.dark` en `<html>` controla el tema; se aplica antes del paint para evitar flash
- Persistido en `localStorage['color-theme']` y preservado entre View Transitions con `astro:before-swap`

### Componentes

- **Secciones** (`src/components/sections/`): Home, Work, Projects, Education, Contact — componentes Astro que reciben `lang: "es" | "en"` como prop
- **UI** (`src/components/ui/`): Navbar, ThemeToggle, LanguagePicker, CvDownloadButton — Navbar y Footer usan `transition:persist` para preservarse entre View Transitions
- React se usa solo para componentes interactivos (CvDownloadButton); el resto es Astro puro

### Path aliases (tsconfig.json)

`@/*` → `src/*`, `@components/*`, `@sections/*`, `@ui/*`, `@layouts/*`, `@styles/*`, `@utils/*`, `@i18n/*`, `@assets/*` → `public/assets/*`

### Patrones clave

- Animaciones de revelación con `.reveal` + IntersectionObserver (root margin `-50px`), escalonadas con `transition-delay`
- Iconos de React Icons: Phosphor (`PiXxxxx`) para UI, Simple Icons (`SiXxxxx`) para tech logos
- Color de acento cyan (`--color-accent: #06B6D4` light / `#22D3EE` dark)
- Fuentes: Satoshi (sans, vía Fontshare) y JetBrains Mono (mono, vía Google Fonts)
- Imágenes en formato WebP; imágenes críticas con `loading="eager"`
- Copy-to-clipboard en Contact (email/teléfono) con feedback visual
- Social links con brand colors en hover
