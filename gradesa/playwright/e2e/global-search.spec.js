const { test, expect } = require("@playwright/test");

test.describe("Global header search", () => {
  test("should search and navigate to a page result", async ({ page }) => {
    test.setTimeout(60000);

    await page.goto("");
    await expect(page.getByLabel("Suche")).toBeVisible();

    const searchInput = page.getByLabel("Suche");
    await searchInput.fill("Glossar");

    await expect(page.locator(".navbar-search-dropdown")).toBeVisible();

    const resultButton = page
      .locator(".navbar-search-item", {
        has: page.locator(".navbar-search-item-title", { hasText: "Glossar" }),
      })
      .first();

    await expect(resultButton).toBeVisible();
    await expect(
      resultButton.locator(".navbar-search-highlight").first()
    ).toBeVisible();

    await resultButton.click();
    await expect(page).toHaveURL(/\/glossary$/);
    await expect(page.locator("main")).toBeVisible();
  });
});
