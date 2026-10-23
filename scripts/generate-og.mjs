// Renders the 1200×630 Open Graph images into public/og/{es,en}/.
// Data comes from the project collection, so re-run after editing content:
//   node scripts/generate-og.mjs
import { chromium } from "@playwright/test";
import { mkdir, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { trefoilSvg } from "../src/shared/brand/trefoil.ts";

const MARK = trefoilSvg({ size: 64 });

const OUT = "public/og";
const NAME = "Johel Andreé Vargas Villanueva";
const DOMAIN = "andr2116d.online";

const font = (await readFile("src/assets/fonts/manrope-latin.woff2")).toString(
  "base64",
);

const base = {
  es: {
    home: {
      kicker: "Ingeniería Química × Sistemas e IA",
      title: NAME,
      subtitle: "La curiosidad hecha código.",
    },
    cv: {
      kicker: "Perfil curricular",
      title: NAME,
      subtitle: "Formación, proyectos y tecnologías.",
    },
  },
  en: {
    home: {
      kicker: "Chemical Engineering × Systems & AI",
      title: NAME,
      subtitle: "Curiosity, written in code.",
    },
    cv: {
      kicker: "Résumé",
      title: NAME,
      subtitle: "Education, projects and technologies.",
    },
  },
};

const projectsDir = "src/content/projects";
const projects = await Promise.all(
  (await readdir(projectsDir))
    .filter((file) => file.endsWith(".json"))
    .map(async (file) => ({
      slug: file.replace(/\.json$/, ""),
      ...JSON.parse(await readFile(join(projectsDir, file), "utf8")),
    })),
);

const escape = (value) =>
  String(value).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );

function template({ kicker, title, subtitle, tag }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: Manrope; src: url(data:font/woff2;base64,${font}) format("woff2"); font-weight: 200 800; }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; font-family: Manrope, sans-serif; color: #f3f1f8;
    background: radial-gradient(700px 420px at 88% 0%, rgba(198,182,247,.2), transparent 70%),
      radial-gradient(500px 360px at 0% 100%, rgba(142,220,195,.14), transparent 70%),
      linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px) 0 0/48px 48px,
      linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px) 0 0/48px 48px, #0d0d11;
    display: flex; flex-direction: column; justify-content: space-between; padding: 64px 72px; }
  .top { display: flex; align-items: center; gap: 18px; font: 500 24px ui-monospace, Menlo, monospace;
    letter-spacing: .04em; text-transform: uppercase; color: #8edcc3; }
  .tag { padding: 4px 12px; border: 1.5px solid #3d3c4b; border-radius: 8px; color: #c6b6f7; }
  h1 { font-size: ${title.length > 24 ? 76 : 96}px; font-weight: 750; letter-spacing: -.05em; line-height: 1.02; max-width: 1000px; }
  p { margin-top: 22px; font-size: 38px; font-weight: 600; letter-spacing: -.02em; max-width: 980px;
    background: linear-gradient(90deg, #8edcc3, #c6b6f7); -webkit-background-clip: text; color: transparent; }
  .foot { display: flex; align-items: center; justify-content: space-between; font-size: 26px; color: #b6b1c3; }
  .brand { display: flex; align-items: center; gap: 14px; color: #f3f1f8; font-weight: 700; }
  .mark, .mark svg { width: 52px; height: 52px; display: block; }
  .watermark { position: absolute; right: -70px; top: 50%; width: 540px; height: 540px; transform: translateY(-50%); opacity: .16; }
  .watermark svg { width: 100%; height: 100%; display: block; }
  body > div:not(.watermark) { position: relative; }
  </style></head><body>
  <div class="watermark">${MARK}</div>
  <div class="top">${tag ? `<span class="tag">${escape(tag)}</span>` : ""}<span>${escape(kicker)}</span></div>
  <div><h1>${escape(title)}</h1><p>${escape(subtitle)}</p></div>
  <div class="foot"><span class="brand"><span class="mark">${MARK}</span>${escape(tag ? NAME : "andreé.")}</span>
    <span>${DOMAIN}</span></div></body></html>`;
}

const jobs = [];
for (const lang of ["es", "en"]) {
  jobs.push({ file: `${lang}/home.png`, ...base[lang].home });
  jobs.push({ file: `${lang}/cv.png`, ...base[lang].cv });
  for (const project of projects) {
    jobs.push({
      file: `${lang}/${project.slug}.png`,
      kicker: project[lang].kind,
      title: project.name,
      subtitle: project[lang].tagline,
      tag: `P-${String(project.order).padStart(2, "0")}`,
    });
  }
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const lang of ["es", "en"])
  await mkdir(join(OUT, lang), { recursive: true });
for (const job of jobs) {
  await page.setContent(template(job), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(OUT, job.file), type: "png" });
}
await browser.close();
console.log(`${jobs.length} Open Graph images written to ${OUT}/`);
