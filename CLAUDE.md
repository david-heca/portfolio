# CLAUDE.md

Orientación para Claude Code al trabajar en este repositorio.

## Comandos

```bash
pnpm dev       # Dev server con hot reload (localhost:4321)
pnpm build     # Build de producción en /dist
pnpm preview   # Vista previa del build
pnpm deploy    # Build + despliegue a Cloudflare Workers (wrangler)
```

No hay testing ni linter configurado.

## Arquitectura

Portafolio personal con **Astro 6** y CSS propio (design system token-driven en `global.css`, sin framework de utilidades), desplegado en **Cloudflare Workers** (assets estáticos servidos vía `wrangler.jsonc`, fallback a `404-page`) con compresión gzip/brotli precomputada en el build. Diseño minimalista cálido: una sola landing, tipografía expresiva (serif italic) sobre lectura limpia (grotesk), paleta warm neutral con un acento verde.

### Single-page

- Todo el sitio es **una landing por idioma**. No hay subrutas (`/work`, `/projects`, etc. ya no existen).
- `src/pages/index.astro` (ES) y `src/pages/en.astro` (EN) renderizan `Landing.astro`, que compone las secciones en orden: Hero → About → Stack → Work → Projects → Education → Speaking → Contact → SiteFooter.
- La navegación es por **anclas**; el navbar resalta la sección activa con un scrollspy (IntersectionObserver). Los enlaces del nav son `#about`, `#work`, `#projects`, `#education`, `#speaking`, `#contact`. La sección Stack (`#stack`) tiene ancla pero **no** figura en el nav.
- Cada sección recibe `lang: "es" | "en"` como prop y lleva su `<style>` scoped.

### Enrutamiento bilingüe (ES/EN)

- Español por defecto (`/`); inglés con prefijo (`/en`).
- Traducciones en `src/i18n/locales/{es,en}.json`. `useTranslations(lang)` devuelve `t(key)` con notación de punto.
- Algunas claves traen HTML inline (`<em>`, `<strong>`) y se renderizan con `set:html`.
- Arrays en el JSON (p.ej. `about.principles`, `projects.list.*.specs`, `work.*.achievements`) se consumen con `t(...) as unknown as T[]`.
- Detección de idioma del navegador en la primera visita; persistida en `localStorage['preferred-lang']`.

### SEO

- hreflang ES/EN + x-default, canonical, Open Graph, Twitter Cards y JSON-LD (`Person`) en `Layout.astro`.
- Sitemap vía `@astrojs/sitemap`; `robots.txt` en `public/`.

### Temas

- Variables CSS light/dark en `global.css`. La clase `.dark` en `<html>` se aplica antes del paint.
- Persistido en `localStorage['color-theme']` (`light`/`dark`/`system`), preservado entre View Transitions con `astro:before-swap`.
- Control en `ThemeToggle.astro` (segmented pill `.seg`).

## Sistema de diseño (`src/styles/global.css`)

Todo el design system es **token-driven**: para reajustar el look se editan variables, no componentes.

- **Un solo acento:** `--color-accent` (light `#2f7a68`, dark `#8fd0bf`). Las variantes translúcidas derivan con `color-mix`.
- **Paleta warm neutral:** `--color-bg`, `--color-bg-2`, `--color-surface`, `--color-ink`, `--color-ink-2`, `--color-ink-3`, `--color-line`, `--color-line-strong`.
- **Tres tipografías, un rol cada una** (Google Fonts):
  - `--font-display` → **Instrument Serif** (italic): titulares y títulos de sección/card.
  - `--font-sans` → **Hanken Grotesk**: voz de lectura (body, bio, descripciones) y UI (nav, botones).
  - `--font-mono` → **JetBrains Mono**: etiquetas, metadatos, periodos, tags (`.kicker`, `.tag`).
- **Tokens de layout:** `--container` (1180px), `--section-y` (espaciado vertical generoso por sección), `--radius`, `--radius-sm`.
- **Primitivas compartidas** (en `global.css`): `.container`, `.section`, `.kicker`, `.section-title`, `.lead`, `.prose`, sistema de botones (`.btn` / `.btn--primary` / `.btn--ghost` / `.btn--sm`), `.card`, `.tag` (con `.tag--key`), `.dot`, `.seg` (toggles), y `.reveal` (animación de entrada con IntersectionObserver, escalonada con `.reveal-1..3`).
- Los estilos específicos de cada sección viven en su `<style>` scoped, no en global.

### Componentes

- **Secciones** (`src/components/sections/`): `Landing` (compositor), `Hero`, `About` (bio + principios), `Stack`, `Work`, `Projects`, `Education`, `Speaking`, `Contact`. Astro puro, sin islands.
- **UI** (`src/components/ui/`): `Navbar` (anclas + scrollspy + menú móvil co-locado), `SiteFooter` (footer global único), `ThemeToggle`, `LanguagePicker`.
- **Iconos:** Phosphor vía `astro-icon` + `@iconify-json/ph`, monocromáticos (`<Icon name="ph:nombre" />`), heredan color con `currentColor`. Uso mínimo y deliberado.

### Path aliases (tsconfig.json)

`@/*` → `src/*`, `@components/*`, `@sections/*`, `@ui/*`, `@layouts/*`, `@styles/*`, `@utils/*`, `@i18n/*`, `@assets/*` → `public/assets/*`

### Principios de mantenimiento

- Minimalismo: antes de añadir un elemento decorativo, preferir más espacio y mejor jerarquía.
- Sin comentarios-ensayo: comentar solo lo no obvio.
- Jerarquía de acciones: una sola acción primaria por vista; el resto, `.btn--ghost` o `.link`.
- Imágenes en WebP; el retrato del hero con `loading="eager"`.
- Todas las animaciones respetan `prefers-reduced-motion`.

### Lo que este proyecto **no** tiene

- No hay subrutas ni páginas separadas por sección (es single-page).
- No hay React, islands, terminal falso, sellos, stickers, ni tipografía manuscrita (Caveat).
- No hay framework de testing ni linter.
