import esTranslations from './es.json';
import enTranslations from './en.json';

export const defaultLang = 'es';

export function getLangFromUrl(url: URL): 'es' | 'en' {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en') return 'en';
  return 'es';
}

export function useTranslations(lang: 'es' | 'en') {
  const translations = lang === 'en' ? enTranslations : esTranslations;
  return translations;
}