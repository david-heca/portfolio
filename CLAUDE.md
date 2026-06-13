# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) para trabajar con el código en este repositorio.

## Comandos de desarrollo

```bash
pnpm dev       # Servidor de desarrollo con hot reload (localhost:4321)
pnpm build     # Build de producción en /dist
pnpm preview   # Vista previa del build de producción
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

- **Secciones** (`src/components/sections/`): Home, Work, Projects, Education, Contact — componentes Astro puros que reciben `lang: "es" | "en"` como prop. Cada sección lleva su propio `<style>` scoped con los estilos específicos de esa sección.
- **UI** (`src/components/ui/`):
  - `Navbar.astro` — full-width con `.nav__inner` max-width 1280px, índices numéricos `00–04`, `transition:persist="navbar"`. Estilos y script del menú móvil co-locados.
  - `ThemeToggle.astro`, `LanguagePicker.astro` — mono pill
  - `PageHeader.astro` — encabezado de página (kicker + título italic + subtítulo)
  - `PageFooter.astro` — footer por página numerado (`00/04`, `01/04`, ...) con link al siguiente
  - `Stamp.astro` — sello SVG circular con texto rotando (decoración del hero, solo `lg+`)
- 100% Astro (no hay islands React). Cada componente con estilos propios los lleva en su `<style>` scoped.

### Path aliases (tsconfig.json)

`@/*` → `src/*`, `@components/*`, `@sections/*`, `@ui/*`, `@layouts/*`, `@styles/*`, `@utils/*`, `@i18n/*`, `@assets/*` → `public/assets/*`

### Sistema de diseño

- **CSS modular**: `src/styles/global.css` contiene solo el design system (tokens, reset, primitivas y utilidades compartidas como `.stats-strip` y `.contact__cta-btn`). Los estilos específicos de cada componente o sección viven en su `<style>` scoped.
- **Una sola variable de acento**: `--color-accent` (light `#1e4fff`, dark `#4d7cff`). El resto de variantes translúcidas se derivan con `color-mix(in srgb, var(--color-accent) N%, transparent)` — para cambiar toda la paleta basta con editar dos líneas.
- Paleta warm neutral: `--color-bg`, `--color-bg-2`, `--color-ink`, `--color-ink-2`, `--color-ink-3`, `--color-line`, `--color-line-strong`.
- **Sistema tipográfico de tres voces** (la identidad es **mono + serif**; cada fuente tiene un rol — no mezclar):
  - `--font-display` → **Instrument Serif** (italic, Google Fonts): titulares gigantes expresivos y títulos de card.
  - `--font-mono` → **JetBrains Mono** (300–500, Google Fonts): hace **doble trabajo intencional** — (a) voz de **lectura**: body, bio, descripciones, subtítulos, logros (calibrada con interlínea `--leading-prose` y medida `--measure` para leerse cómoda); (b) capa de **datos/etiquetas**: kickers, índices `00–04`, `.label`, chips, fichas (`.spec-sheet`), metadatos.
  - `--font-sans` → **alias de `--font-mono`** (`--font-sans: var(--font-mono)`). Es la fuente del `<body>`. Se probó Satoshi como sans neutra pero desentonaba con las voces expresivas (serif/hand/mono) — se descartó.
  - `--font-hand` → **Caveat** (Google Fonts): solo guiños manuscritos decorativos cortos (sticker, flechas, "más proyectos", roles count, invite de contacto). **Nunca contenido real de lectura.**
- **Escala tipográfica tokenizada** (en `:root`, para matar el drift de tamaños): prosa y etiquetas usan tokens, no px sueltos.
  - `--text-lead: 15px` (prosa principal: subtítulos, bio, descripciones, logros) · `--text-body: 13.5px` (prosa secundaria: notas, datos de ficha, "construyendo ahora").
  - `--leading-prose: 1.75` + `--measure: 62ch` → interlínea y ancho de línea para que la mono se lea cómoda en bloques largos.
  - `--text-title: clamp(22px, 2.6vw, 26px)` (Instrument Serif · todos los títulos de card: role/edu/cert).
  - `--text-label: 11px` / `--text-label-sm: 10px` (JetBrains Mono) con `--track-label: 0.18em` (tracking único para toda etiqueta mono).
  - Regla: al añadir texto, elige el token por **rol de contenido**, no inventes px. Los titulares gigantes (hero/page-header/featured) sí llevan `clamp()` por contexto.
- **Container pattern**: `.container-editorial` (y `.nav__inner`, `.footer__inner`) aplican `max-width: 1280px` + padding-inline responsive (24/32/48/64px). Elementos con line/border full-width (`.nav`, `.footer`) viven fuera del container para que su línea atraviese todo el viewport.
- **Grid de construcción**: `.page::before` dibuja líneas verticales (12 cols `lg+`, 6 `sm–md`, 4 `<sm`) con `box-shadow: inset -1px 0` para cerrar el grid en el borde derecho.
- **Tipografía fluida**: `clamp()` en todos los headings gigantes (hero 56→220px, headers 44→140px, contact 52→180px).
- **Iconos**: Phosphor vía `astro-icon` + `@iconify-json/ph`, renderizados como SVG inline (`<Icon name="ph:nombre-duotone" />`). Llevan atributo `[data-icon]` y heredan color con `currentColor`. Además se usan algunos glifos unicode (`↗`, `→`, `↓`) como parte de la estética editorial.

### Patrones clave

- Animaciones de revelación con `.reveal` + IntersectionObserver (root margin `-50px`), escalonadas con `reveal-delay-1..4`
- Stack técnico (`.home-credits`) debajo del hero: **terminal falso** (`.terminal`) con barra (dots + título `stack — david@portfolio`), línea de comando con caret parpadeante (`@keyframes terminal-blink`, respeta `reduced-motion`) y "output" por categoría (`backend/frontend/cloud/ai`). Las tecnologías clave se resaltan en accent vía el `Set` `stackHighlight` en el frontmatter (`.NET`, `Python`, `Azure`, `LLMs`, `RAG`, `MCP`, `MLOps`); los items se parten por `·` en tokens individuales. Cierra con línea `✓ {done}`.
- Pulse del live dot del hero vía `@keyframes pulse-ring`
- Rotación lenta del sello `Stamp` SVG (`@keyframes stamp-spin`, `16s linear infinite`)
- Todas las animaciones respetan `prefers-reduced-motion: reduce`
- Imágenes en formato WebP; hero photo con `loading="eager"`

### Cosas que **no** tiene este proyecto

- No hay componentes React (todos los sections son `.astro`).
- No hay spotlight/tilt/hover-card/text-gradient (removidos del diseño anterior).
