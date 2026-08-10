# David Herrera - Portfolio

Bilingual single-page portfolio with a warm, minimalist design. Built with Astro.

**[davidherrera.dev](https://davidherrera.dev)**

## Tech Stack

- **Astro 7** - Static single-page site with View Transitions, no UI framework or islands
- **Custom CSS** - Token-driven design system in `global.css`, no utility framework
- **Junicode · Schibsted Grotesk · Maple Mono** - Typography; the last two via `@fontsource`, Junicode self-hosted in `public/assets/fonts/` (it isn't on Fontsource)
- **Phosphor icons** via `astro-icon` + `@iconify-json/ph`
- **Cloudflare Workers** - Static asset deployment via `wrangler`, with gzip/brotli precompressed at build

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
├── components/
│   ├── sections/      # Hero, About, Stack, Work,
│   │                  # Projects, Education, Speaking, Contact
│   ├── ui/            # Navbar, SiteFooter, ThemeToggle,
│   │                  # LanguagePicker, LanguageHint
│   ├── Landing.astro  # composes the sections in order
│   └── NotFound.astro # shared 404 body
├── data/              # projects.ts
├── i18n/
│   ├── locales/       # es.json, en.json
│   ├── index.ts       # locale registry
│   └── utils.ts       # useTranslations(lang), localizePath(), getHome()
├── layouts/           # Layout.astro (SEO, theme bootstrap, fonts)
├── pages/
│   ├── index.astro    # ES landing
│   ├── 404.astro      # ES 404
│   └── en/            # index.astro, 404.astro
└── styles/            # global.css (design tokens + shared primitives)
```

The whole site is **one landing per language**. Sections compose in order
(Hero → About → Stack → Work → Projects → Education → Speaking → Contact → Footer)
and navigation is anchor-based (`#about`, `#work`, …) with a scroll-position scrollspy.

The 404 is one hardcoded page per language. A build integration in `astro.config.ts`
rewrites Astro's nested `404/index.html` to `404.html`, which is the filename
Cloudflare looks for when it serves the closest 404 to the requested path.

## Design

Token-driven warm minimalist system - to retune the look you edit CSS variables in
`src/styles/global.css`, not components:

- Warm neutral palette (`#f5f1ea` / `#0e0d0b`) with a single green accent (`#256254` light, `#5fae9a` dark); translucent variants derive via `color-mix`
- Three typefaces, one role each: Junicode (italic display & section titles), Schibsted Grotesk (reading & UI), Maple Mono (labels, metadata, tags)
- Generous vertical rhythm with fluid `clamp()` spacing and type scale
- Floating pill navbar with backdrop blur and active-section highlight

## Features

- Bilingual (ES/EN) with hreflang SEO and `localStorage` persistence. Browser language is only ever *suggested* in a dismissible hint - it never redirects, so crawlers always land on the canonical `/`
- Light/dark/system theme with no-flash bootstrap, preserved across View Transitions
- Scroll reveal animations with staggered delays, respects `prefers-reduced-motion`
- View Transitions with a persistent navbar across navigations
- Fully responsive - content max-width 1180px, co-located mobile menu
- SEO: hreflang + x-default, canonical, Open Graph, Twitter Cards, JSON-LD (`Person`), sitemap, `robots.txt`

## License

The **code** is MIT - see [LICENSE](LICENSE). Feel free to reuse the structure,
design system, or i18n setup.

The **content** is not: personal copy, biography, photographs, and project imagery
are excluded from the license. Please swap them for your own.
