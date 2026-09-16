import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/** El `id` del loader llega como `<lang>/<slug>`; el slug es el mismo en los
 *  dos idiomas. */

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
