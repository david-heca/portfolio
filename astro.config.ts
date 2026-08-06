import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import viteCompression from "vite-plugin-compression";
import { readdir, rename, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

/** Cloudflare sirve el `404.html` más cercano al path pedido, pero Astro escribe
 *  las rutas anidadas como `404/index.html`: sin este renombrado `/en/loquesea`
 *  no encuentra el suyo y cae al de la raíz, en español. */
const nested404: import("astro").AstroIntegration = {
  name: "nested-404",
  hooks: {
    "astro:build:done": async ({ dir, logger }) => {
      const root = fileURLToPath(dir);
      for (const entry of await readdir(root, { recursive: true })) {
        const folder = path.dirname(entry);
        if (path.basename(entry) !== "index.html") continue;
        if (path.basename(folder) !== "404") continue;

        const target = path.join(path.dirname(folder), "404.html");
        await rename(path.join(root, entry), path.join(root, target));
        await rm(path.join(root, folder), { recursive: true });
        logger.info(`${target}`);
      }
    },
  },
};

export default defineConfig({
  integrations: [icon(), sitemap({ filter: (page) => !/\/404\/?$/.test(page) }), nested404],
  site: "https://davidherrera.dev",

  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },

  server: {
    host: true,
    open: true,
  },

  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },

  build: {
    inlineStylesheets: "auto",
  },

  vite: {
    plugins: [
      viteCompression({
        verbose: false,
        disable: false,
        threshold: 10240,
        algorithm: "gzip",
        ext: ".gz",
      }),
      viteCompression({
        verbose: false,
        disable: false,
        threshold: 10240,
        algorithm: "brotliCompress",
        ext: ".br",
      }),
    ],
    build: {
      cssCodeSplit: true,
    },
  },
});
