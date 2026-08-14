import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { STATUSES } from "@/data/projects";

/** La carpeta de primer nivel es el idioma, así que el `id` que emite el loader
 *  llega como `<lang>/<slug>`. El slug es idéntico en los dos idiomas: es lo que
 *  deja `localizePath()` como única implementación del mapeo es↔en. */

const cases = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/cases" }),
  schema: z.object({
    title: z.string(),
    /** Entradilla del índice y `description` del <head>. */
    summary: z.string(),
    role: z.string(),
    year: z.string(),
    status: z.enum(STATUSES),
    tags: z.array(z.string()).default([]),
    /** Ruta bajo `public/`. Sin portada el índice cae a una ficha de solo texto. */
    cover: z.string().optional(),
    /** Enlaza con el proyecto de la portada, si lo hay. */
    project: z.string().optional(),
    draft: z.boolean().default(true),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(true),
  }),
});

export const collections = { cases, notes };
