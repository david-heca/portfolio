import type { ImageMetadata } from "astro";
import connie from "@/assets/projects/connie.webp";
import handheld from "@/assets/projects/handheld.webp";
import trace from "@/assets/projects/trace.webp";
import portfolio from "@/assets/projects/portfolio.webp";

/** Las etiquetas de `status`/`link` viven en los locales, no aquí, para que ES y EN no diverjan. */
export type Status = "production" | "delivered" | "live" | "archived";

/** `private` cubre lo que no se puede enlazar: sistemas internos de cliente. */
export type Link =
  | { kind: "repo" | "live"; href: string }
  | { kind: "private" };

export interface Project {
  slug: string;
  status: Status;
  year: string;
  tags: string[];
  /** Importada, no una ruta de `public/`: así el build emite la miniatura al
   *  tamaño que se pinta en vez de servir el original entero. */
  image: ImageMetadata;
  link: Link;
}

/** Orden curatorial, no cronológico: es "trabajo seleccionado". */
export const projects: Project[] = [
  {
    slug: "connie",
    status: "production",
    year: "2025",
    tags: ["RAG", "MCP", "Azure", "Python", "SQL"],
    image: connie,
    link: { kind: "private" },
  },
  {
    slug: "handheld",
    status: "production",
    year: "2024",
    tags: ["Java", "Android", "SQL"],
    image: handheld,
    link: { kind: "private" },
  },
  {
    slug: "trace",
    status: "delivered",
    year: "2024",
    tags: ["C#", "DevExpress", "SQL"],
    image: trace,
    link: { kind: "private" },
  },
  {
    slug: "portfolio",
    status: "live",
    year: "2026",
    tags: ["Astro", "CSS", "TS"],
    image: portfolio,
    link: { kind: "repo", href: "https://github.com/david-heca/portfolio" },
  },
];
