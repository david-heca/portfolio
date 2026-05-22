# David Herrera — Portfolio

Bilingual portfolio with an editorial-brutalist design. Built with Astro.

**[davidherrera.dev](https://davidherrera.dev)**

## Tech Stack

- **Astro 6** — Static site generation with View Transitions
- **Tailwind CSS 4** — Utility layer alongside a semantic custom-CSS design system
- **Satoshi + JetBrains Mono** — Typography (Fontshare + Google Fonts)
- **Cloudflare Workers** — Deployment with global CDN, DDoS protection, and edge caching

## Quick Start

```bash
pnpm install
pnpm run dev # localhost:4321
pnpm run build # production build → /dist
pnpm run preview # preview production build
```

## Project Structure

```
src/
├── components/
│   ├── sections/      # Home, Work, Projects, Education, Contact
│   └── ui/            # Navbar, ThemeToggle, LanguagePicker,
│                      # PageHeader, PageFooter, Stamp
├── i18n/
│   ├── locales/       # es.json, en.json
│   ├── index.ts       # locale registry
│   └── utils.ts       # useTranslations(lang)
├── layouts/           # Layout.astro (SEO, theme bootstrap, fonts)
├── pages/             # Routing (index, en, [...slug], 404)
└── styles/            # global.css (design tokens + editorial classes)
```

## Design

Editorial-brutalist soft, v.2026:

- Warm neutral palette (`#f5f3ee` / `#111110`) with a single electric-blue accent (`#1e4fff` light, `#4d7cff` dark)
- Visible 12-column construction grid (responsive 12 → 6 → 4 cols)
- Large expressive typography (hero name up to 220px, section headers up to 140px) with fluid `clamp()` scaling
- Technical-credits spec sheet and numbered per-page footers
- Unicode typographic glyphs (`↗`, `→`, `↓`, `★`) instead of UI icons

## Features

- Bilingual (ES/EN) with browser auto-detection, `localStorage` persistence, and hreflang SEO
- Light/dark theme with system preference and no-flash bootstrap
- Scroll reveal animations with staggered delays, respects `prefers-reduced-motion`
- View Transitions with persistent navbar across navigations
- Fully responsive — content max-width 1280px with full-width nav/footer borders

## License

MIT 
