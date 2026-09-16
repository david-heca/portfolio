# David Herrera - Portfolio

Bilingual portfolio: a single-column home per language, plus a real route tree
for the long-form writing. Achromatic, typographic, no framework.

**[davidherrera.dev](https://davidherrera.dev)**

## Tech Stack

- **Astro 7** - static output with View Transitions; no UI framework, no islands, no tests, no linter
- **Custom CSS** - token-driven design system in `global.css`, no utility framework
- **Outfit · Maple Mono · Junicode** - the first two via `@fontsource`, Junicode self-hosted in `public/assets/fonts/` (it isn't on Fontsource; only the italic, subset to latin)
- **Phosphor icons** via `astro-icon` + `@iconify-json/ph`
- **`sharp`** at build time: the avatar and the project thumbnails are imported from `src/assets/` and emitted at the size they're painted
- **Cloudflare Workers** - static assets deployed with `wrangler`; response headers in `public/_headers`

## Quick Start

```bash
pnpm install
pnpm run dev      # localhost:4321
pnpm run build    # production build → /dist
pnpm run preview  # preview production build
pnpm run deploy   # build + deploy to Cloudflare Workers
```

## Project Structure

```
src/
├── assets/            # avatar and project thumbnails (processed at build)
├── components/
│   ├── sections/      # Intro, Projects, Work, Notes,
│   │                  # Speaking, Education, Contact
│   ├── ui/            # Navbar, SiteFooter, ThemeToggle,
│   │                  # LanguagePicker, LanguageHint, NoteList
│   ├── Landing.astro  # composes the sections in order
│   ├── NotesIndex · NoteDetail
│   └── NotFound.astro # shared 404 body
├── content/           # long-form prose: notes/{es,en}
├── data/              # projects.ts, education.ts, collections.ts
├── i18n/
│   ├── locales/       # es.json, en.json — every visible UI string
│   ├── index.ts       # locale registry; `en` is typed against `es`
│   └── utils.ts       # useTranslations(lang), localizePath(), getHome()
├── layouts/           # Layout.astro (head, theme bootstrap, fonts)
├── pages/             # index, notes/, 404 — and the same under en/
└── styles/            # global.css (design tokens + shared primitives)
```

## Routing

The home page is one column per language (Intro → Projects → Work → Notes →
Speaking → Education → Contact) and the nav only links real routes:

| ES | EN |
| --- | --- |
| `/` | `/en/` |
| `/notes/`, `/notes/<slug>/` | `/en/notes/`, `/en/notes/<slug>/` |
| `/404.html` | `/en/404.html` |

Neither the segment nor the slug is translated - `/notes/<slug>` and
`/en/notes/<slug>` - so `localizePath()` stays the single implementation of the
es↔en mapping, shared by the hreflang tags, the language switcher and the
stored-preference redirect.

Prose lives in `src/content/`, never in the locales: those are for UI labels.
An entry is only published when it exists in **both** languages
(`localizedEntries()` hides the ones that don't), and `draft: true` entries are
visible in dev and dropped from the production build.

The 404 is one hardcoded page per language. A build integration in
`astro.config.ts` rewrites Astro's nested `404/index.html` to `404.html`, which
is the filename Cloudflare looks for when it serves the closest 404 to the
requested path.

## Design

Token-driven - to retune the look you edit CSS variables in
`src/styles/global.css`, not components:

- **No hue.** Pure white, pure black and neutral grays; there is no accent color anywhere. Emphasis is carried by weight, underline and inversion (ink background, paper text) for the primary action
- **One column, and the column is the measure.** 640px of content, no two-column grids, no bleeds; what doesn't fit is listed, not laid out. Rows with a monospaced rail, fact rows with a glyph, and one box for every image
- **Square corners** (`--radius` at 0). The only circles left are the ones that are dots
- **One role per typeface**: Outfit for titles, reading and UI; Maple Mono for uppercase tracked labels, tags and figures; Junicode italic signs the wordmark and nothing else
- 4px rhythm for the space *between* elements; the padding of anything with a background is shape, calibrated against its own text
- Light/dark/system theme with a no-flash bootstrap, preserved across View Transitions; every animation respects `prefers-reduced-motion`

## Head, SEO and delivery

- Canonical, hreflang + x-default, Open Graph, Twitter cards and `Person`
  JSON-LD all come from `Layout`; sitemap via `@astrojs/sitemap`, `robots.txt`
  in `public/`
- Bilingual with `localStorage` persistence. Browser language is only ever
  *suggested*, in a dismissible hint that links to the equivalent page in the
  other language - it never redirects on its own, so crawlers always land on the
  canonical `/`
- `public/_headers` carries the CSP and the rest of the security headers, plus
  immutable caching for hashed assets and for the self-hosted font
- Fully responsive, content max-width 640px, no mobile menu -the nav fits-, and
  a skip link ahead of the nav

## License

The **code** is MIT - see [LICENSE](LICENSE). Feel free to reuse the structure,
design system, or i18n setup.

The **content** is not: personal copy, biography, photographs, and project imagery
are excluded from the license. Please swap them for your own.
