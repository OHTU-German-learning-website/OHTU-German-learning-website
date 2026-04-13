const { test, expect } = require("@playwright/test");

test.describe("Resources Detail Pages", () => {
  test("should display chapter content", async ({ page }) => {
    await page.goto("/pages/resources/1", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/.*pages\/resources\/1/);
    await expect(page.getByRole("main").first()).toBeVisible();

    const heading = page.getByRole("heading").first();
    await expect(heading).toBeVisible();
  });

  test("should navigate between chapters", async ({ page }) => {
    await page.goto("/pages/resources/1", {
      waitUntil: "commit",
      timeout: 60000,
    });
    await expect(page).toHaveURL(/.*pages\/resources\/1/);

    const nextLink = page.getByRole("link", { name: /^Weiter$/ }).last();
    await expect(nextLink).toBeVisible();
    await expect(nextLink).toHaveAttribute("href", "/pages/resources/2");

    const href = await nextLink.getAttribute("href");
    await expect(href).toBeTruthy();

    await page.goto(href, { waitUntil: "commit", timeout: 60000 });

    await expect(page).toHaveURL(/.*pages\/resources\/2/);
    await expect(page.getByRole("main").first()).toBeVisible();
  });

  test("should return to resources index from chapter page", async ({
    page,
  }) => {
    await page.goto("/pages/resources/1", { waitUntil: "domcontentloaded" });

    const resourcesLink = page.getByRole("link", {
      name: "Effektiv online lernen",
    });

    if (await resourcesLink.isVisible()) {
      const href = await resourcesLink.getAttribute("href");
      await expect(href).toBeTruthy();

      await page.goto(href, { waitUntil: "domcontentloaded" });

      await expect(page).toHaveURL(/.*pages\/resources(\/?)?$/);
      await expect(page.getByRole("main").first()).toBeVisible();
    }
  });

  test("should show chapter content with text and possibly images", async ({
    page,
  }) => {
    await page.goto("/pages/resources/1", { waitUntil: "domcontentloaded" });

    const paragraphs = page.locator("p");
    await expect(paragraphs.first()).toBeVisible();

    const contentLength = await paragraphs.count();
    expect(contentLength).toBeGreaterThan(0);

    const headings = page.getByRole("heading").first();
    await expect(headings).toBeVisible();
  });
});
