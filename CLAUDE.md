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

Portafolio personal con **Astro 7** y CSS propio (design system token-driven en `global.css`, sin framework de utilidades), desplegado en **Cloudflare Workers** (assets estáticos servidos vía `wrangler.jsonc`, fallback a `404-page`) con compresión gzip/brotli precomputada en el build. Diseño minimalista cálido: una sola landing, tipografía expresiva (serif italic) sobre lectura limpia (grotesk), paleta warm neutral con un acento verde.

### Single-page

- Todo el sitio es **una landing por idioma**. No hay subrutas (`/work`, `/projects`, etc. ya no existen).
- `src/pages/index.astro` (ES) y `src/pages/en.astro` (EN) renderizan `Landing.astro`, que compone las secciones en orden: Hero → About → Stack → Work → Projects → Education → Speaking → Contact → SiteFooter.
- La navegación es por **anclas**; el navbar resalta la sección activa con un scrollspy (IntersectionObserver). Los enlaces del nav son `#about`, `#work`, `#projects`, `#education`, `#speaking`, `#contact`. La sección Stack (`#stack`) tiene ancla pero **no** figura en el nav.
- Cada sección recibe `lang: "es" | "en"` como prop y lleva su `<style>` scoped.
- `src/config.ts` activa/desactiva secciones. Apagar una la quita de la landing y del nav. **Speaking está apagada ahora mismo.**

### Enrutamiento bilingüe (ES/EN)

- Español por defecto (`/`); inglés con prefijo (`/en`).
- Traducciones en `src/i18n/locales/{es,en}.json`. `useTranslations(lang)` devuelve `t(key)` con notación de punto.
- Algunas claves traen HTML inline (`<em>`, `<strong>`) y se renderizan con `set:html`.
- Arrays en el JSON (p.ej. `about.principles`, `projects.list.*.specs`, `work.*.achievements`) se consumen con `t(...) as unknown as T[]`.
- **La autodetección propone, no redirige.** `LanguageHint` (`src/components/ui/LanguageHint.astro`) lee `navigator.languages` y, si no coincide con el idioma de la página, muestra un aviso descartable con el enlace al otro idioma. Redirigir automáticamente sacaba a los rastreadores de `/` —canonical y x-default—, contra las anotaciones del propio `<head>`.
- El único redirect que queda exige preferencia explícita: el `LanguagePicker` la guarda en `localStorage['preferred-lang']`. `lang-hint-dismissed` recuerda que el aviso se cerró.
- Las URLs internas de inglés llevan barra final (`/en/`): es la forma que emite el build, la del canonical y la del sitemap.

### 404

- **Una página por idioma**: `src/pages/404.astro` y `src/pages/en/404.astro`, ambas envoltorios finos sobre `@sections/NotFound.astro`. El idioma va **hardcodeado** en cada página: el build congela cada HTML y `getLangFromUrl` devolvería siempre `es`.
- Cloudflare sirve el `404.html` más cercano al path pedido, así que `/en/*` cae en el suyo. Astro escribe las rutas anidadas como `en/404/index.html`, y la integración `nested-404` de `astro.config.ts` lo renombra a `en/404.html` al terminar el build. Sin ese paso el 404 inglés no se encuentra nunca.
- Fuera de la landing, el `Navbar` convierte sus anclas en absolutas (`/#about`): en el 404 esas secciones no existen y el clic no hacía nada.

### SEO

- hreflang ES/EN + x-default, canonical, Open Graph, Twitter Cards y JSON-LD (`Person`) en `Layout.astro`.
- `Layout` acepta `noindex` (lo usan los 404): emite `noindex, follow` y omite canonical y hreflang. No añadir un `<meta name="googlebot">` con `index`: para Googlebot **tiene prioridad sobre `robots`** y anularía el `noindex`.
- Sitemap vía `@astrojs/sitemap`, con un `filter` que descarta los 404; `robots.txt` en `public/`.

### Temas

- Variables CSS light/dark en `global.css`. La clase `.dark` en `<html>` se aplica antes del paint.
- Persistido en `localStorage['color-theme']` (`light`/`dark`/`system`), preservado entre View Transitions con `astro:before-swap`.
- Control en `ThemeToggle.astro` (segmented pill `.seg`).

## Sistema de diseño (`src/styles/global.css`)

Todo el design system es **token-driven**: para reajustar el look se editan variables, no componentes.

- **Un solo acento:** `--color-accent` (light `#2f7a68`, dark `#8fd0bf`). Las variantes translúcidas derivan con `color-mix`.
- **Paleta warm neutral:** `--color-bg`, `--color-bg-2`, `--color-surface`, `--color-ink`, `--color-ink-2`, `--color-ink-3`, `--color-line`, `--color-line-strong`.
- **Tres tipografías, un rol cada una.** El serif es la excepción, no la regla: es lo que le da carácter al sitio y por eso hay que racionarlo.
  - `--font-display` → **Junicode italic**: solo hero, títulos de sección, nombres de empresa en Work, el 404 y la marca (nav/footer). Siempre `font-style: italic`; no existe la roman.
  - `--font-text` → **Schibsted Grotesk Variable**: voz de lectura (body, bio, descripciones), UI (nav, botones) y **títulos de card** (rol, grado, certificado, proyecto, principio) en `600` con `letter-spacing: -0.01em`.
  - `--font-mono` → **Maple Mono**: solo etiquetas en mayúsculas con tracking, tags/chips y cifras (años, periodos). Lo que se lee como frase —institución, emisor, ubicación, notas, footer— va en la sans a `--text-meta`.
- **No bajar la italic al nivel de card.** Ya pasó una vez: con Junicode en los seis niveles a la vez la italic deja de significar énfasis y la página se satura. El sitio tiene tres alturas —sección, empresa, card— y solo las dos primeras llevan serif.
- **Junicode se autoaloja** (`public/assets/fonts/junicode-italic.woff2`, OFL, no está en Fontsource). Su `@font-face` vive en `global.css`. Sale del VF de `psb1558/Junicode-font` subseteado a latin: de 1.2 MB a 52 KB, con `wght 300–700` variable, `wdth` y `ENLA` fijados y features `kern,liga`. Para regenerarlo: `pyftsubset` primero (el GSUB completo desborda al guardar) y `varLib.instancer` después.
- **Tokens de layout:** `--container` (1180px), `--section-y` (espaciado vertical generoso por sección), `--radius`, `--radius-sm`.
- **Primitivas compartidas** (en `global.css`): `.container`, `.section`, `.kicker`, `.section-title`, `.lead`, `.prose`, sistema de botones (`.btn` / `.btn--primary` / `.btn--ghost` / `.btn--sm`), `.card`, `.tag` (con `.tag--key`), `.dot`, `.seg` (toggles), y `.reveal` (animación de entrada con IntersectionObserver, escalonada con `.reveal-1..3`).
- Los estilos específicos de cada sección viven en su `<style>` scoped, no en global.

### Componentes

- **Secciones** (`src/components/sections/`): `Landing` (compositor), `Hero`, `About` (bio + principios), `Stack`, `Work`, `Projects`, `Education`, `Speaking`, `Contact`. Astro puro, sin islands.
- **UI** (`src/components/ui/`): `Navbar` (anclas + scrollspy + menú móvil co-locado), `SiteFooter` (footer global único), `ThemeToggle`, `LanguagePicker`.
- **Iconos:** Phosphor vía `astro-icon` + `@iconify-json/ph`, siempre el peso **regular** (nunca `-duotone` ni otras variantes), monocromáticos (`<Icon name="ph:nombre" />`), heredan color con `currentColor`.
- **Nada de glifos como icono:** flechas y símbolos van como `<Icon>`, nunca como carácter (`↗`, `→`). Algunos navegadores los resuelven contra una fuente de emoji y rompen el tono.

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
