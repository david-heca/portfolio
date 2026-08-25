import { getCollection, type CollectionEntry } from "astro:content";
import type { Lang } from "@i18n/utils";

export type CollectionName = "notes";

export interface LocalizedEntry<N extends CollectionName> {
  slug: string;
  entry: CollectionEntry<N>;
}

/** El loader emite el `id` como `<lang>/<slug>`. */
const langOf = (id: string) => id.slice(0, id.indexOf("/"));
const slugOf = (id: string) => id.slice(id.indexOf("/") + 1);

/**
 * Entradas de una colección para un idioma, ya ordenadas de más reciente a más
 * antigua.
 *
 * Solo sale lo que existe en los dos idiomas: media traducción deja el hreflang
 * apuntando a una página que no se emitió y el conmutador de idioma en un 404.
 * Es la misma regla que `Dict = typeof es` impone sobre las etiquetas de UI.
 *
 * Los borradores se ven mientras se escribe y desaparecen en el build de producción.
 */
export async function localizedEntries<N extends CollectionName>(
  name: N,
  lang: Lang,
): Promise<LocalizedEntry<N>[]> {
  const all = (await getCollection(name)) as CollectionEntry<N>[];
  const visible = import.meta.env.PROD
    ? all.filter((e) => !(e.data as { draft: boolean }).draft)
    : all;

  const slugsIn = (l: Lang) =>
    new Set(visible.filter((e) => langOf(e.id) === l).map((e) => slugOf(e.id)));
  const es = slugsIn("es");
  const en = slugsIn("en");

  return visible
    .filter((e) => langOf(e.id) === lang)
    .map((e) => ({ slug: slugOf(e.id), entry: e }))
    .filter(({ slug }) => es.has(slug) && en.has(slug))
    .sort((a, b) => b.entry.data.date.getTime() - a.entry.data.date.getTime());
}
