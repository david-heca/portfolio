import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/** La carpeta de primer nivel es el idioma, así que el `id` que emite el loader
 *  llega como `<lang>/<slug>`. El slug es idéntico en los dos idiomas: es lo que
 *  deja `localizePath()` como única implementación del mapeo es↔en. */

const notes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string(),
    /** Entradilla del índice y `description` del <head>. */
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(true),
  }),
});

export const collections = { notes };
