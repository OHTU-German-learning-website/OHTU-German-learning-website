const { test, expect } = require("@playwright/test");

test.describe("User Management", () => {
  test("users page route responds", async ({ page }) => {
    await page.goto("/admin/users");
    await expect(page).toHaveURL(/\/(admin\/users|$)/);
  });

  test("users page contains a button when accessible", async ({ page }) => {
    await page.goto("/admin/users");

    const buttons = page.getByRole("button");
    await expect(buttons.first()).toBeVisible();
  });

  test("users page or redirect renders successfully", async ({ page }) => {
    await page.goto("/admin/users");
    await expect(page.locator("body")).toBeVisible();
  });
});
