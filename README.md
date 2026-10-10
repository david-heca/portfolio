# davidherrera.dev

My personal site, v5. Astro, hand-written CSS, Cloudflare Workers. Spanish at
`/`, English at `/en/`.

**[davidherrera.dev](https://davidherrera.dev)**

```bash
pnpm install
pnpm dev
pnpm run deploy   # `pnpm deploy` is a pnpm built-in
```

## Bits worth stealing

- The nav settles with a scroll-driven animation, no JS. On the home page the
  wordmark waits for the `<h1>` to scroll away.
- Language is suggested, never redirected, so crawlers always land on `/`.
- One function, `localizePath()`, maps es ↔ en for hreflang and the switcher.
- A note only ships if it exists in both languages.
- Junicode self-hosted and subset: 1 MB → 43 KB.

Design rules and their reasons live in [`CLAUDE.md`](CLAUDE.md), in Spanish.

## License

Code is MIT ([LICENSE](LICENSE)). The copy, photos and project images are mine.
