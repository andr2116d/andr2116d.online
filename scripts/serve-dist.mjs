// Minimal static server for dist/, used by the test suite and Lighthouse.
// It behaves like a static host: directory index files, real 404 status with 404.html.
// (`astro preview` daemonizes when there is no TTY, which test runners cannot supervise.)
// Usage: node scripts/serve-dist.mjs [port]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve("dist");
const port = Number(process.argv[2] ?? 4390);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json",
};

async function resolveFile(urlPath) {
  const path = normalize(join(root, decodeURIComponent(urlPath)));
  if (!path.startsWith(root)) return null;
  try {
    const info = await stat(path);
    return info.isDirectory() ? join(path, "index.html") : path;
  } catch {
    return null;
  }
}

createServer(async (request, response) => {
  const { pathname } = new URL(request.url ?? "/", "http://localhost");
  const file = await resolveFile(pathname);
  try {
    if (!file) throw new Error("not found");
    const body = await readFile(file);
    const immutable = pathname.startsWith("/_astro/");
    response.writeHead(200, {
      "Content-Type": types[extname(file)] ?? "application/octet-stream",
      "Cache-Control": immutable
        ? "public, max-age=31536000, immutable"
        : "public, max-age=0, must-revalidate",
    });
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": types[".html"] });
    response.end(await readFile(join(root, "404.html")));
  }
}).listen(port, () => {
  console.log(`Serving dist/ at http://localhost:${port}`);
});
