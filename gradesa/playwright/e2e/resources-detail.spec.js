const { test, expect } = require("@playwright/test");

test.describe("Resources Detail Pages", () => {
  test("should display chapter content", async ({ page }) => {
    await page.goto("pages/resources/1");
    await expect(page).toHaveURL(/.*pages\/resources\/1/);
    await expect(page.getByRole("main").first()).toBeVisible();

    const heading = page.getByRole("heading");
    await expect(heading).toBeVisible();
  });

  test("should navigate between chapters", async ({ page }) => {
    await page.goto("/pages/resources/1");
    await expect(page).toHaveURL(/.*pages\/resources\/1/);

    const nextLink = page.getByRole("link", { name: "Weiter" });
    if (await nextLink.isVisible()) {
      await nextLink.click();
      await expect(page).toHaveURL(/.*pages\/resources\/2/);
      await expect(page.getByRole("main").first()).toBeVisible();
    }
  });

  test("should return to resources index from chapter page", async ({
    page,
  }) => {
    await page.goto("/pages/resources/1");

    const resourcesLink = page.getByRole("link", {
      name: "Richtig Online Lernen",
    });
    if (await resourcesLink.isVisible()) {
      await resourcesLink.click();
      await expect(page).toHaveURL(/.*pages\/resources(\/?)?$/);
      await expect(page.getByRole("main").first()).toBeVisible();
    }
  });

  test("should show chapter content with text and possibly images", async ({
    page,
  }) => {
    await page.goto("/pages/resources/1");
    await page.waitForLoadState("networkidle");

    const paragraphs = page.locator("p");
    await expect(paragraphs.first()).toBeVisible();

    const contentLength = await paragraphs.count();
    expect(contentLength).toBeGreaterThan(0);

    const headings = page.getByRole("heading");
    await expect(headings.first()).toBeVisible();
  });
});
