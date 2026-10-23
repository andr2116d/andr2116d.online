// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/shared/config/site.ts";

const SITE_URL = process.env.SITE_URL ?? "https://andr2116d.online";
const cvFont = (/** @type {number} */ weight) =>
  `./src/assets/fonts/manrope-static/manrope-latin-${weight}-normal.woff2`;

export default defineConfig({
  site: SITE_URL,
  output: "static",
  trailingSlash: "always",
  build: { format: "directory" },
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: { prefixDefaultLocale: false },
  },
  prefetch: { prefetchAll: false, defaultStrategy: "hover" },
  // Content-Security-Policy <meta> with hashes for every inline script and style.
  security: { csp: true },
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Manrope",
      cssVariable: "--font-manrope",
      fallbacks: ["system-ui", "sans-serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/manrope-latin.woff2"],
            weight: "200 800",
            style: "normal",
          },
        ],
      },
    },
    {
      // Static instances for the CV: Chrome embeds variable fonts in PDFs as Type 3,
      // which applicant tracking systems read without spaces. Loaded on /cv/ only.
      provider: fontProviders.local(),
      name: "Manrope Static",
      cssVariable: "--font-cv",
      fallbacks: ["Arial", "sans-serif"],
      options: {
        variants: [
          { src: [cvFont(400)], weight: "400", style: "normal" },
          { src: [cvFont(500)], weight: "500", style: "normal" },
          { src: [cvFont(600)], weight: "600", style: "normal" },
          { src: [cvFont(700)], weight: "700", style: "normal" },
          { src: [cvFont(800)], weight: "800", style: "normal" },
        ],
      },
    },
  ],
  integrations: [
    sitemap({
      i18n: { defaultLocale: "es", locales: { es: "es-PE", en: "en" } },
      filter: (page) => !page.includes("/404"),
      // Date of the last content review; update SITE.updated when content changes.
      lastmod: new Date(SITE.updated),
      // Project pages use translated sections (/proyectos/ ↔ /en/projects/),
      // which the i18n option cannot pair on its own.
      serialize(item) {
        const match = item.url.match(
          /\/(?:en\/projects|proyectos)\/([^/]+)\/$/,
        );
        if (match) {
          item.links = [
            {
              lang: "es-PE",
              url: new URL(`/proyectos/${match[1]}/`, SITE_URL).href,
            },
            {
              lang: "en",
              url: new URL(`/en/projects/${match[1]}/`, SITE_URL).href,
            },
          ];
        }
        return item;
      },
    }),
  ],
});
