// Captures the public demo of each project for its card cover and case page.
// Usage: node scripts/capture-projects.mjs [outDir]
// Only public, logged-out screens are captured. `clip` keeps the area with real UI
// (e.g. Gemelo's metrics, avoiding the message shown while its backend sleeps).
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const outDir = process.argv[2] ?? "src/assets/projects";

const demos = [
  { slug: "quikko", url: "https://quikko.vercel.app/" },
  {
    slug: "unitru-academic",
    url: "https://unitru-academic.vercel.app/",
    clip: { x: 240, y: 150, width: 960, height: 600 },
  },
  {
    slug: "gemelo-socioeconomico",
    url: "https://gemelo-socioeconomico-ll.vercel.app/",
    // 16:9 top area: header, title and metrics, above the map that needs the API.
    clip: { x: 0, y: 0, width: 880, height: 495 },
    viewport: { width: 880, height: 550 },
  },
  {
    slug: "la-previa",
    url: "https://canchas-reservas.vercel.app/",
    clip: { x: 240, y: 150, width: 960, height: 600 },
  },
];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: "dark",
  locale: "es-PE",
});

for (const { slug, url, clip, viewport } of demos) {
  const page = await context.newPage();
  if (viewport) await page.setViewportSize(viewport);
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
    await page.waitForTimeout(1500);
    const file = join(outDir, `${slug}.png`);
    await page.screenshot({ path: file, ...(clip ? { clip } : {}) });
    console.log(`✓ ${slug} → ${file}`);
  } catch (error) {
    console.error(`✗ ${slug}: ${error.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
