// Audits the production build with Lighthouse (mobile with simulated slow 4G, and desktop).
// Usage: pnpm build && pnpm lighthouse
// HTML reports are written to reports/lighthouse/ (git-ignored).
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";

const PORT = 4392;
const BASE = `http://localhost:${PORT}`;
const PAGES = ["/", "/en/", "/proyectos/quikko/", "/cv/"];
const OUT = "reports/lighthouse";

const server = spawn("node", ["scripts/serve-dist.mjs", String(PORT)], {
  stdio: "ignore",
});
await new Promise((resolve) => setTimeout(resolve, 800));

const chrome = await chromeLauncher.launch({
  chromePath: chromium.executablePath(),
  chromeFlags: ["--headless=new", "--no-sandbox"],
});

await mkdir(OUT, { recursive: true });
const rows = [];
try {
  for (const formFactor of ["mobile", "desktop"]) {
    for (const path of PAGES) {
      const result = await lighthouse(
        `${BASE}${path}`,
        { port: chrome.port, output: "html", logLevel: "error" },
        formFactor === "desktop" ? desktopConfig : undefined,
      );
      const { categories, audits } = result.lhr;
      const name = `${formFactor}${path.replace(/\//g, "_")}`.replace(/_$/, "");
      await writeFile(`${OUT}/${name}.html`, result.report);
      rows.push({
        page: path,
        device: formFactor,
        perf: Math.round(categories.performance.score * 100),
        a11y: Math.round(categories.accessibility.score * 100),
        bp: Math.round(categories["best-practices"].score * 100),
        seo: Math.round(categories.seo.score * 100),
        LCP: audits["largest-contentful-paint"].displayValue,
        CLS: audits["cumulative-layout-shift"].displayValue,
        TBT: audits["total-blocking-time"].displayValue,
      });
    }
  }
} finally {
  chrome.kill();
  server.kill();
}

console.table(rows);
