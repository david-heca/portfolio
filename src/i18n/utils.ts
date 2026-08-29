import { ui, defaultLang, type Lang } from './index';

export type { Lang };

/** Portada del idioma. El inglés lleva barra final: es la forma que emite el
 *  build, la del canonical y la del sitemap. */
export function getHome(lang: Lang): string {
  return lang === defaultLang ? '/' : `/${lang}/`;
}

/** El otro idioma. Vive aquí por lo mismo que `localizePath`: dos copias de la
 *  bifurcación acaban divergiendo. */
export function otherLang(lang: Lang): Lang {
  return lang === defaultLang ? 'en' : defaultLang;
}

/** Única implementación del mapeo es↔en. La comparten el hreflang, el
 *  conmutador de idioma y el redirect por preferencia guardada. */
export function localizePath(pathname: string, target: Lang): string {
  const bare = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  if (target === defaultLang) return bare;
  return bare === '/' ? '/en/' : `/en${bare}`;
}

export function useTranslations(lang: Lang) {
  /** El parámetro de tipo cubre las claves que guardan arrays u objetos. */
  return function t<T = string>(key: string): T {
    const value = key
      .split('.')
      .reduce<unknown>(
        (acc, k) => (acc as Record<string, unknown> | undefined)?.[k],
        ui[lang],
      );
    return (value ?? key) as T;
  };
}
