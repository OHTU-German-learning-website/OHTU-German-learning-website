const { test, expect } = require("@playwright/test");

test.describe("Component Interactions", () => {
  test("should display chapter navigation", async ({ page }) => {
    await page.goto("/pages/resources");
    await expect(page).toHaveURL(/.*pages\/resources$/);
    await page.screenshot({ path: "tests/e2e/screenshots/resources-page.png" });
    await expect(page.locator("main")).toBeVisible();
  });

  test("should load resource content", async ({ page }) => {
    await page.goto("/pages/resources/1");
    await expect(page.locator("main")).toBeVisible();
    await page.screenshot({ path: "tests/e2e/screenshots/chapter-page.png" });
  });
});
