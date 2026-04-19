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

Portafolio personal construido con **Astro 5 + React 19 + Tailwind CSS 4**, desplegado con compresión gzip/brotli. Diseño v.2026 editorial-brutalista soft (tipografía expresiva, grid de construcción visible, paleta warm neutral con acento azul eléctrico).

### Enrutamiento bilingüe (ES/EN)

- Español es el idioma por defecto (rutas sin prefijo: `/`, `/work`, `/projects`, etc.)
- Inglés usa prefijo `/en` (`/en`, `/en/work`, `/en/projects`, etc.)
- `src/pages/index.astro` sirve la home en español, `src/pages/en.astro` la de inglés
- `src/pages/[...slug].astro` genera todas las subrutas para ambos idiomas vía `getStaticPaths()`
- Las traducciones viven en `src/i18n/locales/es.json` y `en.json` (~246 líneas cada una)
- `useTranslations(lang)` retorna una función `t(key)` que soporta claves anidadas con notación de punto
- Algunas claves contienen HTML (p.ej. `<em>`, `<br/>`) — se rendean con `set:html`
- Detección automática de idioma del navegador en primera visita; persistido en `localStorage['preferred-lang']`

### SEO

- hreflang alternates (ES/EN + x-default) generados en `Layout.astro`
- Sitemap automático vía `@astrojs/sitemap` + `robots.txt` en `public/`
- Canonical URLs, Open Graph y Twitter Cards en cada página

### Sistema de temas

- Variables CSS custom en `src/styles/global.css` con variantes light/dark
- La clase `.dark` en `<html>` controla el tema; se aplica antes del paint para evitar flash
- Persistido en `localStorage['color-theme']` y preservado entre View Transitions con `astro:before-swap`
- Toggle con botones `LIGHT/DARK` en el navbar (mono pill)

### Componentes

- **Secciones** (`src/components/sections/`): Home, Work, Projects, Education, Contact — componentes Astro puros que reciben `lang: "es" | "en"` como prop
- **UI** (`src/components/ui/`):
  - `Navbar.astro` — full-width con `.nav__inner` max-width 1280px, índices numéricos `00–04`, `transition:persist="navbar"`
  - `ThemeToggle.astro`, `LanguagePicker.astro` — mono pill
  - `PageFooter.astro` — footer por página numerado (`00/04`, `01/04`, ...) con link al siguiente
  - `TechRing.astro` — SVG inline circular con texto rotando (hero decoration, solo `lg+`)
  - `MetaBar.astro` — reloj live CDMX + ciudad + status (solo `md+`)
- 100% Astro (no hay islands React)

### Path aliases (tsconfig.json)

`@/*` → `src/*`, `@components/*`, `@sections/*`, `@ui/*`, `@layouts/*`, `@styles/*`, `@utils/*`, `@i18n/*`, `@assets/*` → `public/assets/*`

### Sistema de diseño

- **Una sola variable de acento**: `--color-accent` (light `#1e4fff`, dark `#4d7cff`). El resto de variantes translúcidas se derivan con `color-mix(in srgb, var(--color-accent) N%, transparent)` — para cambiar toda la paleta basta con editar dos líneas.
- Paleta warm neutral: `--color-bg`, `--color-bg-2`, `--color-ink`, `--color-ink-2`, `--color-ink-3`, `--color-line`, `--color-line-strong`.
- Fuentes: Satoshi (300–900, vía Fontshare) y JetBrains Mono (400, 500, vía Google Fonts).
- **Container pattern**: `.container-editorial` (y `.nav__inner`, `.footer__inner`) aplican `max-width: 1280px` + padding-inline responsive (24/32/48/64px). Elementos con line/border full-width (`.nav`, `.footer`, `.marquee`) viven fuera del container para que su línea atraviese todo el viewport.
- **Grid de construcción**: `.page::before` dibuja líneas verticales (12 cols `lg+`, 6 `sm–md`, 4 `<sm`) con `box-shadow: inset -1px 0` para cerrar el grid en el borde derecho.
- **Tipografía fluida**: `clamp()` en todos los headings gigantes (hero 56→220px, headers 44→140px, contact 52→180px).
- **Glifos tipográficos**: el diseño usa unicode (`✦` marquee, `↗` contact, `→` CTA, `↓` footer, `★` featured) en vez de iconos — es parte de la estética editorial.

### Patrones clave

- Animaciones de revelación con `.reveal` + IntersectionObserver (root margin `-50px`), escalonadas con `reveal-delay-1..4`
- Marquee con `@keyframes slide` y separador `✦` entre items (`marquee__item::after`)
- Pulse del live dot del hero vía `@keyframes pulse`
- Rotación lenta del `tech-ring` SVG (`60s linear infinite`)
- Todas las animaciones respetan `prefers-reduced-motion: reduce`
- Imágenes en formato WebP; hero photo con `loading="eager"`

### Cosas que **no** tiene este proyecto

- No hay componentes React (todos los sections son `.astro`).
- No hay iconos de React Icons — se usan unicode typographic symbols.
- No hay spotlight/tilt/hover-card/text-gradient (removidos del diseño anterior).
- No hay sección de skills ni CV download button (removidos en v.2026).
