import es from './locales/es.json';
import en from './locales/en.json';

export type Lang = 'es' | 'en';

/** Tipar `en` contra la forma de `es` hace que falte una clave sea error, no
 *  una cadena `"about.principles"` renderizada en la página. */
type Dict = typeof es;

export const defaultLang: Lang = 'es';

export const ui: Record<Lang, Dict> = { es, en };
