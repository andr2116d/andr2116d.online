// Captures the public demo of each project for its card and detail page.
// Usage: node scripts/capture-projects.mjs [outDir]
// Output is a 1600×1000 PNG per demo; Astro converts it to AVIF/WebP at build time.
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const outDir = process.argv[2] ?? "src/assets/projects";

const demos = [
  { slug: "quikko", url: "https://quikko.vercel.app/" },
  { slug: "unitru-academic", url: "https://unitru-academic.vercel.app/" },
  {
    slug: "gemelo-socioeconomico",
    url: "https://gemelo-socioeconomico-ll.vercel.app/",
  },
  { slug: "la-previa", url: "https://canchas-reservas.vercel.app/" },
];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  colorScheme: "dark",
  locale: "es-PE",
});

for (const { slug, url } of demos) {
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
    await page.waitForTimeout(1500);
    const file = join(outDir, `${slug}.png`);
    await page.screenshot({ path: file });
    console.log(`✓ ${slug} → ${file}`);
  } catch (error) {
    console.error(`✗ ${slug}: ${error.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
