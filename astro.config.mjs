// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/shared/config/site.ts";

const SITE_URL = process.env.SITE_URL ?? "https://andr2116d.online";

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
