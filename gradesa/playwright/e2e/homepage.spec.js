const { test, expect } = require("@playwright/test");

test.describe("Home page", () => {
  test("should display the home page correctly", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Gradesa/i);
    await expect(page.locator("main")).toBeVisible();
  });
});
