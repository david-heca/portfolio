# David Herrera — Portfolio

Bilingual portfolio with an editorial-brutalist design. Built with Astro.

**[davidherrera.dev](https://davidherrera.dev)**

## Tech Stack

- **Astro 5** — Static site generation with View Transitions
- **React 19** — (installed; no islands in use currently)
- **Tailwind CSS 4** — Utility layer alongside a semantic custom-CSS design system
- **Satoshi + JetBrains Mono** — Typography (Fontshare + Google Fonts)
- **Vercel** — Deployment with gzip/brotli compression

## Quick Start

```bash
bun install
bun run dev        # localhost:4321
bun run build      # production build → /dist
bun run preview    # preview production build
```

## Project Structure

```
src/
├── components/
│   ├── sections/      # Home, Work, Projects, Education, Contact
│   └── ui/            # Navbar, ThemeToggle, LanguagePicker,
│                      # PageFooter, TechRing, MetaBar
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
- Circular SVG tech ring, ticker marquee with `✦` separators, numbered per-page footers
- Unicode typographic glyphs (`↗`, `→`, `↓`, `★`, `✦`) instead of UI icons

## Features

- Bilingual (ES/EN) with browser auto-detection, `localStorage` persistence, and hreflang SEO
- Light/dark theme with system preference and no-flash bootstrap
- Live local-time clock (CDMX, GMT-6) in the hero meta-bar
- Scroll reveal animations with staggered delays, respects `prefers-reduced-motion`
- View Transitions with persistent navbar across navigations
- Fully responsive — content max-width 1280px with full-width nav/footer borders

## License

MIT
