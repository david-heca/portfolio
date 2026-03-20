# David Herrera - Portfolio

Minimal, modern, and bilingual portfolio built with Astro.

**[davidherrera.dev](https://davidherrera.dev)**

## Tech Stack

- **Astro 5** — Static site generation with View Transitions
- **React 19** — Interactive components
- **Tailwind CSS 4** — Styling with dark mode
- **Satoshi + JetBrains Mono** — Typography
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
│   └── ui/            # Navbar, ThemeToggle, LanguagePicker, CvDownloadButton
├── i18n/
│   ├── locales/       # es.json, en.json
│   └── utils.ts       # useTranslations(lang)
├── layouts/           # Layout.astro (SEO, theme, fonts)
├── pages/             # Routing (index, en, [...slug])
└── styles/            # global.css (theme variables, Tailwind)
```

## Features

- Bilingual (ES/EN) with auto-detection and hreflang SEO
- Light/dark theme with system preference support
- Scroll reveal animations with staggered delays
- Copy-to-clipboard contact actions
- Social links with brand color hover effects
- Responsive across all breakpoints

## License

MIT
