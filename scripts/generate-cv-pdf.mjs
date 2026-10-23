// Generates the one-page A4 CV PDFs from the built site into public/cv/.
// Usage: pnpm cv:pdf   (builds, renders /cv/ and /en/cv/, then rebuilds with the PDFs)
// Fails if the content does not fit on one page, instead of silently clipping it.
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
    });
    await page.goto(`http://localhost:${PORT}${job.path}`, {
      waitUntil: "networkidle",
    });
    await page.emulateMedia({ media: "print" });
    await page.evaluate(() => document.fonts.ready);

    // The last block must end inside the sheet's bottom padding (overflow is clipped).
    const fit = await page.evaluate(() => {
      const sheet = document.querySelector(".sheet");
      const last = sheet?.lastElementChild;
      if (!sheet || !last) return null;
      const bottom = sheet.getBoundingClientRect().bottom;
      const padding = parseFloat(getComputedStyle(sheet).paddingBottom);
      return {
        content: Math.ceil(
          last.getBoundingClientRect().bottom -
            sheet.getBoundingClientRect().top,
        ),
        page: Math.floor(bottom - padding - sheet.getBoundingClientRect().top),
      };
    });
    if (!fit || fit.content > fit.page) {
      console.error(
        `✗ ${job.path}: content (${fit?.content}px) exceeds one A4 page (${fit?.page}px)`,
      );
      failed = true;
    }

    const pdf = await page.pdf({
      preferCSSPageSize: true,
      printBackground: true,
    });
    const pages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? [])
      .length;
    if (pages !== 1) {
      console.error(`✗ ${job.path}: ${pages} pages`);
      failed = true;
    }
    await writeFile(job.file, pdf);
    console.log(
      `✓ ${job.file} (${pages} page, ${Math.round(pdf.length / 1024)} KB, ${fit?.content}/${fit?.page}px)`,
    );
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}
if (failed) process.exit(1);
