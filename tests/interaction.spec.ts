import { expect, test } from "@playwright/test";
import { pages } from "./routes";

test("skip link moves focus to the main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Saltar al contenido" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("theme toggle switches and persists", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const toggle = page.locator("[data-theme-toggle]");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("language link leads to the translated page", async ({
  page,
  isMobile,
}) => {
  await page.goto("/proyectos/quikko/");
  if (isMobile) {
    await page
      .getByRole("button", { name: "Abrir menú de navegación" })
      .click();
    await page
      .locator("#site-menu")
      .getByRole("link", { name: "English" })
      .click();
  } else {
    await page
      .locator(".site-header__actions")
      .getByRole("link", { name: "English" })
      .click();
  }
  await expect(page).toHaveURL(/\/en\/projects\/quikko\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("mobile menu opens, closes with Escape and closes after navigating", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "The menu button is only shown on small screens");
  await page.goto("/");
  const menu = page.locator("#site-menu");
  const button = page.getByRole("button", { name: "Abrir menú de navegación" });

  await button.click();
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();

  await button.click();
  await menu.getByRole("link", { name: "Formación" }).click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/#formacion$/);
});

test("periodic table works with arrow keys", async ({ page }) => {
  await page.goto("/");
  await page.locator("#el-go").focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.locator("#el-python")).toBeChecked();
  await expect(page.locator('[data-detail="python"]')).toBeVisible();
  await expect(page.locator('[data-detail="go"]')).toBeHidden();
});

test("reduced motion keeps the hero art still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const toggle = page.locator("[data-motion-toggle]");
  await expect(toggle).toHaveAttribute("data-state", "paused");
  await expect(toggle).toContainText("Animar");
});

test("pages have no horizontal overflow or console errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 320, height: 720 });
  for (const { path } of pages) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, `${path} overflows horizontally`).toBeLessThanOrEqual(0);
  }
  expect(errors).toEqual([]);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("content and core navigation still work", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Johel Andreé",
    );
    await expect(page.locator(".project-card")).toHaveCount(6);
    await page.locator('label[for="el-redis"]').click();
    await expect(page.locator('[data-detail="redis"]')).toBeVisible();
    // Controls that need JavaScript are hidden instead of broken.
    await expect(page.locator("[data-theme-toggle]")).toBeHidden();
    await expect(page.locator("[data-motion-toggle]")).toBeHidden();
  });
});
