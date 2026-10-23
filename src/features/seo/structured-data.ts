/**
 * Schema.org JSON-LD builders. Every page emits one @graph that references the same
 * Person and WebSite nodes by @id, so search engines can join them into one entity.
 * Only verifiable facts are described: no job titles, employers or ratings.
 */
import { SITE } from "@/shared/config/site";
import { LOCALES, paths, type Lang } from "@/shared/i18n/config";

type Node = Record<string, unknown>;

export const absolute = (path: string, site: URL) =>
  new URL(path, site).toString();

const ids = (site: URL) => ({
  person: absolute("/#person", site),
  website: absolute("/#website", site),
});

const personDescription = {
  es: "Estudiante de Ingeniería Química en la Universidad Nacional de Trujillo y de Ingeniería de Sistemas e Inteligencia Artificial en la Universidad Privada Antenor Orrego. Desarrollador backend, frontend e inteligencia artificial.",
  en: "Chemical Engineering student at Universidad Nacional de Trujillo and Systems Engineering & Artificial Intelligence student at Universidad Privada Antenor Orrego. Backend, frontend and AI developer.",
} as const;

export const UNIVERSITIES = {
  unt: {
    "@type": "CollegeOrUniversity",
    name: "Universidad Nacional de Trujillo",
    alternateName: "UNT",
    url: "https://www.unitru.edu.pe/",
    sameAs: "https://es.wikipedia.org/wiki/Universidad_Nacional_de_Trujillo",
  },
  upao: {
    "@type": "CollegeOrUniversity",
    name: "Universidad Privada Antenor Orrego",
    alternateName: "UPAO",
    url: "https://www.upao.edu.pe/",
    sameAs: "https://es.wikipedia.org/wiki/Universidad_Privada_Antenor_Orrego",
  },
} as const;

export function personNode(lang: Lang, site: URL): Node {
  return {
    "@type": "Person",
    "@id": ids(site).person,
    name: SITE.name,
    givenName: SITE.givenName,
    familyName: SITE.familyName,
    alternateName: [SITE.shortName, SITE.handle],
    url: absolute(paths.home("es"), site),
    email: `mailto:${SITE.email}`,
    description: personDescription[lang],
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.location.city,
      addressRegion: SITE.location.region,
      addressCountry: SITE.location.country,
    },
    affiliation: [UNIVERSITIES.unt, UNIVERSITIES.upao],
    knowsAbout: [
      lang === "es" ? "Ingeniería química" : "Chemical engineering",
      lang === "es" ? "Inteligencia artificial" : "Artificial intelligence",
      lang === "es" ? "Desarrollo web" : "Web development",
      "Python",
      "TypeScript",
      "Go",
      "FastAPI",
      "Next.js",
      "PyTorch",
      "AWS",
    ],
    sameAs: [SITE.links.github, SITE.links.linkedin, SITE.links.instagram],
  };
}

export function websiteNode(site: URL): Node {
  return {
    "@type": "WebSite",
    "@id": ids(site).website,
    url: absolute("/", site),
    name: SITE.name,
    alternateName: [SITE.shortName, SITE.domain],
    inLanguage: [LOCALES.es.html, LOCALES.en.html],
    publisher: { "@id": ids(site).person },
  };
}

interface PageInput {
  lang: Lang;
  site: URL;
  url: string;
  title: string;
  description: string;
}

export function profilePageNode({
  lang,
  site,
  url,
  title,
  description,
}: PageInput): Node {
  return {
    "@type": "ProfilePage",
    "@id": `${url}#page`,
    url,
    name: title,
    description,
    inLanguage: LOCALES[lang].html,
    dateModified: SITE.updated,
    isPartOf: { "@id": ids(site).website },
    mainEntity: { "@id": ids(site).person },
  };
}

export function webPageNode({
  lang,
  site,
  url,
  title,
  description,
}: PageInput): Node {
  return {
    "@type": "WebPage",
    "@id": `${url}#page`,
    url,
    name: title,
    description,
    inLanguage: LOCALES[lang].html,
    isPartOf: { "@id": ids(site).website },
    about: { "@id": ids(site).person },
  };
}

export function breadcrumbNode(items: { name: string; url: string }[]): Node {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

interface SourceCodeInput {
  lang: Lang;
  site: URL;
  url: string;
  name: string;
  description: string;
  repository: string;
  demo?: string | undefined;
  languages: string[];
  image?: string | undefined;
  /** Team projects credit the owner as a contributor, not as the sole author. */
  team: boolean;
}

export function sourceCodeNode(input: SourceCodeInput): Node {
  return {
    "@type": "SoftwareSourceCode",
    "@id": `${input.url}#project`,
    name: input.name,
    description: input.description,
    url: input.url,
    codeRepository: input.repository,
    programmingLanguage: input.languages,
    inLanguage: LOCALES[input.lang].html,
    [input.team ? "contributor" : "author"]: { "@id": ids(input.site).person },
    ...(input.demo
      ? {
          targetProduct: {
            "@type": "WebApplication",
            name: input.name,
            url: input.demo,
            applicationCategory: "WebApplication",
            operatingSystem: "Web",
          },
        }
      : {}),
    ...(input.image ? { image: input.image } : {}),
  };
}

export function graph(nodes: Node[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
