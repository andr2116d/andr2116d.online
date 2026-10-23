// Generates the one-page A4 CV PDFs from the built site into public/cv/.
// Usage: pnpm cv:pdf   (builds, renders /cv/ and /en/cv/, then rebuilds with the PDFs)
// Fails if the content does not fit on one page (print never clips the sheet).
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";

const PORT = 4393;
const jobs = [
  {
    path: "/cv/",
    file: "public/cv/Johel-Andree-Vargas-Villanueva-CV.pdf",
    locale: "es-PE",
  },
  {
    path: "/en/cv/",
    file: "public/cv/Johel-Andree-Vargas-Villanueva-Resume.pdf",
    locale: "en-US",
  },
];

const server = spawn("node", ["scripts/serve-dist.mjs", String(PORT)], {
  stdio: "ignore",
});
await new Promise((resolve) => setTimeout(resolve, 800));

let failed = false;
const browser = await chromium.launch();
try {
  await mkdir("public/cv", { recursive: true });
  for (const job of jobs) {
    const page = await browser.newPage({
      locale: job.locale,
      colorScheme: "light",
      // A4-wide viewport: screen-only zoom rules never apply, so measurements are exact.
      viewport: { width: 794, height: 1123 },
      reducedMotion: "reduce",
    });
    await page.goto(`http://localhost:${PORT}${job.path}`, {
      waitUntil: "networkidle",
    });
    await page.emulateMedia({ media: "print" });
    await page.evaluate(() => document.fonts.ready);

    const pdf = await page.pdf({
      preferCSSPageSize: true,
      printBackground: true,
    });
    const pages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? [])
      .length;
    // The sheet is never clipped in print, so overflow shows up as extra pages.
    if (pages !== 1) {
      console.error(
        `✗ ${job.path}: ${pages} pages — the CV must fit on one A4 page`,
      );
      failed = true;
    } else {
      await writeFile(job.file, pdf);
      console.log(
        `✓ ${job.file} (1 page, ${Math.round(pdf.length / 1024)} KB)`,
      );
    }
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}
if (failed) process.exit(1);
