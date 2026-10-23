import { expect, test } from "@playwright/test";
import { pages, SITE } from "./routes";

test.describe("technical SEO", () => {
  test.skip(({ isMobile }) => isMobile, "Markup is identical on every device");

  const titles = new Set<string>();
  const descriptions = new Set<string>();

  for (const { path, lang, alt } of pages) {
    test(`${path} metadata`, async ({ page, request }) => {
      await page.goto(path);

      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await expect(page.locator("h1")).toHaveCount(1);

      const title = await page.title();
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThanOrEqual(70);
      expect(titles.has(title), `duplicate title: ${title}`).toBe(false);
      titles.add(title);

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(description?.length).toBeGreaterThanOrEqual(50);
      expect(description?.length).toBeLessThanOrEqual(160);
      expect(descriptions.has(description!)).toBe(false);
      descriptions.add(description!);

      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `${SITE}${path}`,
      );
      await expect(
        page.locator('link[rel="alternate"][hreflang="x-default"]'),
      ).toHaveCount(1);
      const alternates = await page
        .locator('link[rel="alternate"][hreflang]')
        .evaluateAll((links) => links.map((l) => l.getAttribute("href")));
      expect(alternates).toContain(`${SITE}${path}`);
      expect(alternates).toContain(`${SITE}${alt}`);

      // The language counterpart must exist.
      expect((await request.get(alt)).status()).toBe(200);

      // Open Graph image must be served.
      const og = await page
        .locator('meta[property="og:image"]')
        .getAttribute("content");
      const ogPath = new URL(og!).pathname;
      const image = await request.get(ogPath);
      expect(image.status()).toBe(200);
      expect(image.headers()["content-type"]).toContain("image/png");

      // JSON-LD must parse and describe the same Person.
      const jsonLd = await page
        .locator('script[type="application/ld+json"]')
        .textContent();
      const data = JSON.parse(jsonLd!);
      const person = data["@graph"].find(
        (node: { "@type": string }) => node["@type"] === "Person",
      );
      expect(person.name).toBe("Johel Andreé Vargas Villanueva");
    });
  }

  test("robots.txt and sitemap", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain(`Sitemap: ${SITE}/sitemap-index.xml`);

    const sitemap = await (await request.get("/sitemap-0.xml")).text();
    for (const { path } of pages) {
      expect(sitemap).toContain(`<loc>${SITE}${path}</loc>`);
    }
    expect(sitemap).not.toContain("404");
  });

  test("404 page is not indexable", async ({ page }) => {
    const response = await page.goto("/esta-pagina-no-existe/");
    expect(response?.status()).toBe(404);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
  });
});
