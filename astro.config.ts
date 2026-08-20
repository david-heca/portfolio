import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import { readdir, rename, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

/** Deja `dist/` como lo espera Cloudflare.
 *
 *  - Los 404 anidados: Cloudflare sirve el `404.html` más cercano al path pedido,
 *    pero Astro escribe las rutas anidadas como `404/index.html`. Sin el renombrado
 *    `/en/loquesea` no encuentra el suyo y cae al de la raíz, en español.
 *  - Los `.DS_Store`: están en `.gitignore`, así que no salen en ningún diff, pero
 *    `public/` se copia entero y acabarían publicados. */
const prepareDist: import("astro").AstroIntegration = {
  name: "prepare-dist",
  hooks: {
    "astro:build:done": async ({ dir, logger }) => {
      const root = fileURLToPath(dir);
      for (const entry of await readdir(root, { recursive: true })) {
        const folder = path.dirname(entry);
        const name = path.basename(entry);

        if (name === ".DS_Store") {
          await rm(path.join(root, entry));
          continue;
        }
        if (name !== "index.html" || path.basename(folder) !== "404") continue;

        const target = path.join(path.dirname(folder), "404.html");
        await rename(path.join(root, entry), path.join(root, target));
        await rm(path.join(root, folder), { recursive: true });
        logger.info(target);
      }
    },
  },
};

export default defineConfig({
  integrations: [icon(), sitemap({ filter: (page) => !/\/404\/?$/.test(page) }), prepareDist],
  site: "https://davidherrera.dev",

  server: {
    host: true,
    open: true,
  },

  /* Nada de precomprimir en el build: Workers no negocia un `.br`/`.gz` de al lado
     -lo serviría como un archivo más- y Cloudflare ya comprime en el edge. */
  build: {
    inlineStylesheets: "auto",
  },
});
