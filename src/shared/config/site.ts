/**
 * Single source of truth for identity data reused by pages, structured data and the CV.
 * Every value here is public and verified (GitHub profile, LinkedIn URL, owner-approved contacts).
 */
export const SITE = {
  name: "Johel Andreé Vargas Villanueva",
  givenName: "Johel Andreé",
  familyName: "Vargas Villanueva",
  shortName: "Andreé Vargas",
  handle: "andr2116d",
  domain: "andr2116d.online",
  email: "johelandreevargasvillanueva07@gmail.com",
  location: {
    city: "Trujillo",
    region: "La Libertad",
    country: "PE",
    // Plaza de Armas de Trujillo (8.1116° S, 79.0288° W), a decorative label only.
    latitude: "8°07′S",
    longitude: "79°02′",
  },
  links: {
    github: "https://github.com/andr2116d",
    linkedin:
      "https://www.linkedin.com/in/johel-andre%C3%A9-vargas-villanueva-2309862b8",
    instagram: "https://www.instagram.com/andvtr_2",
  },
  /** Last content review; shown on the CV and used as sitemap/JSON-LD dateModified. */
  updated: "2026-10-23",
} as const;

export type Site = typeof SITE;
