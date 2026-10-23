import type { Lang } from "./config";

/** Interface strings shared across features. Feature copy lives next to each feature. */
const ui = {
  es: {
    skip: "Saltar al contenido",
    "nav.label": "Principal",
    "nav.projects": "Proyectos",
    "nav.education": "Formación",
    "nav.stack": "Stack",
    "nav.contact": "Contacto",
    "nav.cv": "CV",
    "nav.home": "Inicio",
    "brand.label": "Johel Andreé Vargas Villanueva, inicio",
    "menu.open": "Menú",
    "menu.label": "Abrir menú de navegación",
    "menu.close": "Cerrar menú",
    "theme.label": "Cambiar tema de color",
    "theme.light": "Tema claro",
    "theme.dark": "Tema oscuro",
    "lang.switch": "Read in English",
    "lang.short": "EN",
    "external.newTab": "(se abre en una pestaña nueva)",
    "footer.built":
      "Diseñado y desarrollado por Johel Andreé con Astro. Sin rastreadores.",
    "footer.top": "Volver arriba",
    "notFound.title": "Página no encontrada",
    "notFound.body":
      "Esta dirección no existe o ha cambiado. Puedes volver al inicio o revisar mis proyectos.",
    "notFound.home": "Ir al inicio",
  },
  en: {
    skip: "Skip to content",
    "nav.label": "Main",
    "nav.projects": "Projects",
    "nav.education": "Education",
    "nav.stack": "Stack",
    "nav.contact": "Contact",
    "nav.cv": "CV",
    "nav.home": "Home",
    "brand.label": "Johel Andreé Vargas Villanueva, home",
    "menu.open": "Menu",
    "menu.label": "Open navigation menu",
    "menu.close": "Close menu",
    "theme.label": "Change color theme",
    "theme.light": "Light theme",
    "theme.dark": "Dark theme",
    "lang.switch": "Leer en español",
    "lang.short": "ES",
    "external.newTab": "(opens in a new tab)",
    "footer.built":
      "Designed and built by Johel Andreé with Astro. No trackers.",
    "footer.top": "Back to top",
    "notFound.title": "Page not found",
    "notFound.body":
      "This address doesn’t exist or has changed. Head back home or browse my projects.",
    "notFound.home": "Go home",
  },
} as const;

export type UiKey = keyof (typeof ui)["es"];

export function useTranslations(lang: Lang) {
  return (key: UiKey): string => ui[lang][key];
}
