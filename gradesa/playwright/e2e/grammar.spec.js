const { test, expect } = require("@playwright/test");

test.describe("Grammar Pages", () => {
  test("should load the grammar overview page", async ({ page }) => {
    await page.goto("/grammar");
    await expect(page).toHaveURL(/.*\/grammar$/);
    await expect(page.getByRole("main").first()).toBeVisible();
  });

  test("should render topics-view grammar page directly", async ({ page }) => {
    await page.goto("/grammar/themes/adjektivdeklination?view=topics");

    await expect(page).toHaveURL(/view=topics/);
    await expect(
      page.getByRole("heading", {
        name: /Deklinationsarten|Adjektivdeklination/i,
      })
    ).toBeVisible();

    await expect(page.getByRole("link", { name: "Weiter" })).toBeVisible();
  });

  test("should render alphabetical-view grammar page directly", async ({
    page,
  }) => {
    await page.goto("/grammar/themes/artikelw%C3%B6rter?view=alphabetical");

    await expect(page).toHaveURL(/view=alphabetical/);
    await expect(
      page.getByRole("heading", { name: /Artikelwörter/i })
    ).toBeVisible();
  });

  test("should show placeholder for a grammar page without content", async ({
    page,
  }) => {
    test.setTimeout(60000);

    await page.goto("/grammar/themes/e2e-placeholder-page?view=topics", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await expect(page.getByText("Noch kein Inhalt vorhanden.")).toBeVisible({
      timeout: 15000,
    });
  });

  test("should keep topics view when using next navigation", async ({
    page,
  }) => {
    await page.goto("/grammar/themes/adjektivdeklination?view=topics");

    const weiterButton = page.getByRole("link", { name: "Weiter" });
    await expect(weiterButton).toBeVisible();
    await weiterButton.click();

    await expect(page).toHaveURL(/view=topics/);
  });

  test("should keep alphabetical view when using next navigation", async ({
    page,
  }) => {
    await page.goto("/grammar/themes/artikelw%C3%B6rter?view=alphabetical");

    const weiterButton = page.getByRole("link", { name: "Weiter" });
    if (await weiterButton.isVisible()) {
      await weiterButton.click();
      await expect(page).toHaveURL(/view=alphabetical/);
    }
  });
});
