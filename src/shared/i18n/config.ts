export const LANGS = ["es", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "es";

/** Values for <html lang>, hreflang and Open Graph. */
export const LOCALES: Record<
  Lang,
  { html: string; og: string; label: string }
> = {
  es: { html: "es-PE", og: "es_PE", label: "Español" },
  en: { html: "en", og: "en_US", label: "English" },
};

/** Copy that exists in every language. Features keep their own `Localized` content. */
export type Localized<T> = Record<Lang, T>;

export function isLang(value: unknown): value is Lang {
  return LANGS.includes(value as Lang);
}

export function otherLang(lang: Lang): Lang {
  return lang === "es" ? "en" : "es";
}

/** Section anchors are translated so that shared links read naturally. */
export const SECTION_IDS = {
  projects: { es: "proyectos", en: "projects" },
  education: { es: "formacion", en: "education" },
  stack: { es: "stack", en: "stack" },
  contact: { es: "contacto", en: "contact" },
} satisfies Record<string, Localized<string>>;

export type SectionKey = keyof typeof SECTION_IDS;

const prefix = (lang: Lang) => (lang === DEFAULT_LANG ? "" : `/${lang}`);

export const paths = {
  home: (lang: Lang) => `${prefix(lang)}/`,
  cv: (lang: Lang) => `${prefix(lang)}/cv/`,
  project: (lang: Lang, slug: string) =>
    `${prefix(lang)}/${lang === "es" ? "proyectos" : "projects"}/${slug}/`,
  section: (lang: Lang, key: SectionKey) =>
    `${prefix(lang)}/#${SECTION_IDS[key][lang]}`,
};

export type Alternates = Localized<string>;
