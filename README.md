# David Herrera — Portfolio

Bilingual single-page portfolio with a warm, minimalist design. Built with Astro.

**[davidherrera.dev](https://davidherrera.dev)**

## Tech Stack

- **Astro 6** — Static single-page site with View Transitions, no UI framework or islands
- **Tailwind CSS 4** — Utility layer alongside a token-driven custom-CSS design system
- **Instrument Serif · Hanken Grotesk · JetBrains Mono** — Typography (Google Fonts)
- **Phosphor icons** via `astro-icon` + `@iconify-json/ph`
- **Cloudflare Workers** — Static asset deployment via `wrangler`, with gzip/brotli precompressed at build

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
│   ├── sections/      # Landing (composer), Hero, About, Stack, GitHub,
│   │                  # Work, Projects, Education, Speaking, Contact
│   └── ui/            # Navbar, SiteFooter, ThemeToggle, LanguagePicker
├── i18n/
│   ├── locales/       # es.json, en.json
│   ├── index.ts       # locale registry
│   └── utils.ts       # useTranslations(lang)
├── layouts/           # Layout.astro (SEO, theme bootstrap, fonts)
├── pages/             # index.astro (ES), en.astro (EN), 404.astro
└── styles/            # global.css (design tokens + shared primitives)
```

The whole site is **one landing per language**. Sections compose in order
(Hero → About → Stack → GitHub → Work → Projects → Education → Speaking → Contact → Footer)
and navigation is anchor-based (`#about`, `#work`, …) with an IntersectionObserver scrollspy.

## Design

Token-driven warm minimalist system — to retune the look you edit CSS variables in
`src/styles/global.css`, not components:

- Warm neutral palette (`#f5f1ea` / `#0e0d0b`) with a single green accent (`#2f7a68` light, `#8fd0bf` dark); translucent variants derive via `color-mix`
- Three typefaces, one role each: Instrument Serif (italic display & titles), Hanken Grotesk (reading & UI), JetBrains Mono (labels, metadata, tags)
- Generous vertical rhythm with fluid `clamp()` spacing and type scale
- Floating pill navbar with backdrop blur and active-section highlight

## Features

- Bilingual (ES/EN) with browser auto-detection, `localStorage` persistence, and hreflang SEO
- Light/dark/system theme with no-flash bootstrap, preserved across View Transitions
- GitHub contribution heatmap fetched at build time (public API, graceful fallback, zero client JS)
- Scroll reveal animations with staggered delays, respects `prefers-reduced-motion`
- View Transitions with a persistent navbar across navigations
- Fully responsive — content max-width 1180px, co-located mobile menu
- SEO: hreflang + x-default, canonical, Open Graph, Twitter Cards, JSON-LD (`Person`), sitemap, `robots.txt`

## License

MIT
