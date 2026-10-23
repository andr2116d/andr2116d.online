import { expect, test } from "@playwright/test";

test.describe("language suggestion (no redirects)", () => {
  test("a non-Spanish browser is offered English on Spanish pages", async ({
    browser,
  }) => {
    const context = await browser.newContext({ locale: "de-DE" });
    const page = await context.newPage();
    await page.goto("/proyectos/quikko/");
    await expect(page).toHaveURL(/\/proyectos\/quikko\/$/); // never redirected
    const box = page.locator("[data-lang-suggest]");
    await expect(box).toBeVisible();
    await expect(
      box.getByRole("link", { name: "Read in English" }),
    ).toHaveAttribute("href", "/en/projects/quikko/");

    await box.getByRole("button", { name: "Keep Spanish" }).click();
    await expect(box).toBeHidden();
    await page.reload();
    await expect(box).toBeHidden();
    await context.close();
  });

  test("a Spanish browser sees no suggestion on Spanish pages", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("[data-lang-suggest]")).toBeHidden();
  });

  test("a Spanish browser is offered Spanish on English pages", async ({
    page,
  }) => {
    await page.goto("/en/cv/");
    const box = page.locator("[data-lang-suggest]");
    await expect(box).toBeVisible();
    await expect(
      box.getByRole("link", { name: "Leer en español" }),
    ).toHaveAttribute("href", "/cv/");
  });

  test("an explicit language choice is remembered", async ({ browser }) => {
    const context = await browser.newContext({ locale: "en-US" });
    const page = await context.newPage();
    await page.goto("/");
    await page
      .locator("[data-lang-suggest]")
      .getByRole("link", { name: "Read in English" })
      .click();
    await expect(page).toHaveURL(/\/en\/$/);
    await expect(page.locator("[data-lang-suggest]")).toBeHidden();
    await context.close();
  });
});

test.describe("color scheme", () => {
  test("follows the operating system without any stored choice", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
    const background = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );
    expect(background).toBe("rgb(13, 13, 17)");

    await page.emulateMedia({ colorScheme: "light" });
    await expect
      .poll(() =>
        page.evaluate(() => getComputedStyle(document.body).backgroundColor),
      )
      .toBe("rgb(246, 245, 249)");
  });

  test("choosing the system theme again goes back to following the system", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    const toggle = page.locator("[data-theme-toggle]");
    await toggle.click(); // dark → light (stored)
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await toggle.click(); // light → dark, which is the system theme
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBeNull();
  });
});
