import type { ImageMetadata } from "astro";
import connie from "@/assets/projects/connie.webp";
import handheld from "@/assets/projects/handheld.webp";
import trace from "@/assets/projects/trace.webp";
import portfolio from "@/assets/projects/portfolio.webp";

interface Project {
  slug: string;
  year: string;
  /** Importada, no una ruta de `public/`: así el build emite la miniatura al
   *  tamaño que se pinta en vez de servir el original entero. */
  image: ImageMetadata;
  /** Ausente: sistema interno de cliente, sin nada público que enlazar. */
  href?: string;
}

/** Orden curatorial, no cronológico. */
export const projects: Project[] = [
  { slug: "connie", year: "2025", image: connie },
  { slug: "handheld", year: "2024", image: handheld },
  { slug: "trace", year: "2024", image: trace },
  { slug: "portfolio", year: "2026", image: portfolio, href: "https://github.com/david-heca/portfolio" },
];
