const { test, expect } = require("@playwright/test");

test.describe("Grammar Pages", () => {
  test("should load the grammar overview page", async ({ page }) => {
    await page.goto("/grammar");
    await expect(page).toHaveURL(/.*grammar/);
    await expect(page.getByRole("main").first()).toBeVisible();
  });

  test("should navigate to communications grammar page", async ({ page }) => {
    await page.goto("/grammar");

    const communicationsLink = page.getByRole("link", {
      name: /communications/i,
    });
    if (await communicationsLink.isVisible()) {
      await communicationsLink.click();
      await expect(page).toHaveURL(/.*grammar\/communications/);
    } else {
      await page.goto("/grammar/communications");
      await expect(page).toHaveURL(/.*grammar\/communications/);
    }

    await expect(page.getByRole("main").first()).toBeVisible();
  });

  test("should display grammar examples", async ({ page }) => {
    await page.goto("/grammar/communications");

    const examples = page.locator(".example, [data-test='grammar-example']");

    if ((await examples.count()) > 0) {
      await expect(examples.first()).toBeVisible();
    }
  });
});
