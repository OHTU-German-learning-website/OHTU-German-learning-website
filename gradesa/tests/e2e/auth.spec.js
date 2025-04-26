const { test, expect } = require("@playwright/test");

test.describe("Authentication", () => {
  test("should navigate to login page", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page).toHaveURL(/.*auth\/login/);
    await page.screenshot({ path: "tests/e2e/screenshots/login-page.png" });
    await expect(page.locator("form")).toBeVisible();
  });

  test("should navigate to register page", async ({ page }) => {
    await page.goto("/auth/register");
    await expect(page).toHaveURL(/.*auth\/register/);
    await page.screenshot({ path: "tests/e2e/screenshots/register-page.png" });
    await expect(page.locator("form")).toBeVisible();
  });
});
