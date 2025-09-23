export const languages = {
  es: 'Español',
  en: 'English',
};

export const defaultLang = 'es';
export const showDefaultLang = false;

export const ui = {
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.about': 'Sobre mí',
    'nav.skills': 'Habilidades',
    'nav.work': 'Experiencia',
    'nav.education': 'Formación',
    'nav.projects': 'Proyectos',
    'nav.contact': 'Contacto',
    
    // Common
    'common.back': 'Volver',
    'common.readMore': 'Leer más',
    'common.download': 'Descargar',
    'common.viewProject': 'Ver proyecto',
    'common.contactMe': 'Contáctame',
    
    // Hero
    'hero.greeting': 'Hola, soy',
    'hero.title': 'Ingeniero en TI & Arquitecto de Soluciones IA',
    'hero.description': 'Especializado en el desarrollo de soluciones tecnológicas innovadoras y arquitecturas de inteligencia artificial. Me apasiona transformar ideas en realidades que generan impacto.',
    'hero.cta': 'Conoce mi trabajo',
    
    // About
    'about.title': 'Sobre mí',
    'about.subtitle': 'Pasión por la tecnología y la innovación',
    
    // Skills
    'skills.title': 'Habilidades',
    'skills.subtitle': 'Tecnologías y herramientas que domino',
    
    // Work
    'work.title': 'Experiencia',
    'work.subtitle': 'Mi trayectoria profesional',
    
    // Education
    'education.title': 'Formación',
    'education.subtitle': 'Educación y certificaciones',
    
    // Projects
    'projects.title': 'Proyectos',
    'projects.subtitle': 'Algunos de mis trabajos destacados',
    
    // Contact
    'contact.title': 'Contacto',
    'contact.subtitle': '¿Hablamos de tu próximo proyecto?',
    'contact.name': 'Nombre',
    'contact.email': 'Email',
    'contact.message': 'Mensaje',
    'contact.send': 'Enviar mensaje',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.work': 'Experience',
    'nav.education': 'Education',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    
    // Common
    'common.back': 'Back',
    'common.readMore': 'Read more',
    'common.download': 'Download',
    'common.viewProject': 'View project',
    'common.contactMe': 'Contact me',
    
    // Hero
    'hero.greeting': 'Hi, I\'m',
    'hero.title': 'Systems Engineer & AI Solutions Architect',
    'hero.description': 'Specialized in developing innovative technological solutions and artificial intelligence architectures.',
    'hero.cta': 'See my work',
    
    // About
    'about.title': 'About me',
    'about.subtitle': 'Passion for technology and innovation',
    
    // Skills
    'skills.title': 'Skills',
    'skills.subtitle': 'Technologies and tools I master',
    
    // Work
    'work.title': 'Experience',
    'work.subtitle': 'My professional journey',
    
    // Education
    'education.title': 'Education',
    'education.subtitle': 'Education and certifications',
    
    // Projects
    'projects.title': 'Projects',
    'projects.subtitle': 'Some of my featured work',
    
    // Contact
    'contact.title': 'Contact',
    'contact.subtitle': 'Let\'s talk about your next project?',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send message',
  },
} as const;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}

export function getRouteFromUrl(url: URL): string | undefined {
  const pathname = new URL(url).pathname;
  const parts = pathname?.split('/');
  const path = parts.pop() || parts.pop();

  if (path === undefined) {
    return '/';
  }

  const currentLang = getLangFromUrl(url);

  if (currentLang === defaultLang) {
    return path ? `/${path}` : '/';
  }

  return path ? `/${currentLang}/${path}` : `/${currentLang}`;
}
