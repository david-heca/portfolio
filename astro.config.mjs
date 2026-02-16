import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import viteCompression from "vite-plugin-compression";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [react(), sitemap()],
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
      tailwindcss(),
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
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom"],
          },
        },
      },
    },
  },
});
