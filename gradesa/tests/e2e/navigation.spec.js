const { test, expect } = require("@playwright/test");

test.describe("Navigation", () => {
  test("should navigate to grammar communication page", async ({ page }) => {
    await page.goto("/grammar/communications");
    await expect(page).toHaveURL(/.*grammar\/communications/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("should navigate to learning resources page", async ({ page }) => {
    await page.goto("/resources");
    await expect(page).toHaveURL(/.*resources/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("should navigate to a specific chapter", async ({ page }) => {
    await page.goto("/resources/1");
    await expect(page).toHaveURL(/.*resources\/1/);
    await expect(page.locator("main")).toBeVisible();
  });
});
