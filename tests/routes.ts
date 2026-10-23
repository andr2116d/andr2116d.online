import { readdirSync } from "node:fs";

/** Every public route, derived from the content so new projects are tested automatically. */
const slugs = readdirSync("src/content/projects")
  .filter((file) => file.endsWith(".json"))
  .map((file) => file.replace(/\.json$/, ""));

export const pages = [
  { path: "/", lang: "es-PE", alt: "/en/" },
  { path: "/en/", lang: "en", alt: "/" },
  { path: "/cv/", lang: "es-PE", alt: "/en/cv/" },
  { path: "/en/cv/", lang: "en", alt: "/cv/" },
  ...slugs.flatMap((slug) => [
    {
      path: `/proyectos/${slug}/`,
      lang: "es-PE",
      alt: `/en/projects/${slug}/`,
    },
    {
      path: `/en/projects/${slug}/`,
      lang: "en",
      alt: `/proyectos/${slug}/`,
    },
  ]),
];

export const SITE = "https://andr2116d.online";
