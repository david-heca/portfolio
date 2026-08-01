/**
 * Proyectos de la landing.
 *
 * Los ejes taxonómicos son enums cerrados: sus etiquetas visibles viven en
 * `projects.context/domain/status/link` de cada locale, no en cada proyecto.
 * Así ES y EN no pueden divergir y un proyecto nuevo no inventa vocabulario.
 *
 * Lo traducible de cada proyecto es solo el texto propio (título, descripción
 * y las tres ranuras reto/rol/impacto), en `projects.list.<slug>`.
 */

export type Context = "work" | "personal";
export type Domain = "ai" | "mobile" | "desktop" | "web";
export type Status = "production" | "delivered" | "live" | "archived";

/** `private` cubre lo que no se puede enlazar: sistemas internos de cliente. */
export type Link =
  | { kind: "repo" | "live"; href: string }
  | { kind: "private" };

export interface Project {
  slug: string;
  context: Context;
  domain: Domain;
  status: Status;
  year: string;
  tags: string[];
  image: string;
  link: Link;
}

/** Orden curatorial, no cronológico: es "trabajo seleccionado". */
export const projects: Project[] = [
  {
    slug: "connie",
    context: "work",
    domain: "ai",
    status: "production",
    year: "2025",
    tags: ["RAG", "MCP", "Azure", "Python", "SQL"],
    image: "/assets/projects/connie.webp",
    link: { kind: "private" },
  },
  {
    slug: "handheld",
    context: "work",
    domain: "mobile",
    status: "production",
    year: "2024",
    tags: ["Java", "Android", "SQL"],
    image: "/assets/projects/handheld.webp",
    link: { kind: "private" },
  },
  {
    slug: "trace",
    context: "work",
    domain: "desktop",
    status: "delivered",
    year: "2024",
    tags: ["C#", "DevExpress", "SQL"],
    image: "/assets/projects/trace.webp",
    link: { kind: "private" },
  },
  {
    slug: "portfolio",
    context: "personal",
    domain: "web",
    status: "live",
    year: "2026",
    tags: ["Astro", "CSS", "TS"],
    image: "/assets/projects/portfolio.webp",
    link: { kind: "repo", href: "https://github.com/david-heca/portfolio" },
  },
];
