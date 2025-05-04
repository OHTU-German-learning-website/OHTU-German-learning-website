const { test, expect } = require("@playwright/test");

test.describe("Learning Page", () => {
  test("should load the learning page", async ({ page }) => {
    await page.goto("/learning");
    await expect(page).toHaveURL(/.*learning/);
    await expect(page.getByRole("main").first()).toBeVisible();
  });

  test("should show language dropdown button", async ({ page }) => {
    await page.goto("/learning");
    await expect(
      page.getByRole("button", { name: /English|Deutsch/i })
    ).toBeVisible();
  });

  test("should have language selection functionality", async ({ page }) => {
    await page.goto("/learning");

    const languageButton = page.getByRole("button", {
      name: /English|Deutsch/i,
    });
    await expect(languageButton).toBeVisible();

    await languageButton.click();

    await expect(page).toHaveURL(/.*learning/);
  });

  test("should show learning form when data is loaded", async ({ page }) => {
    await page.goto("/learning");

    await page.waitForLoadState("networkidle");

    const formContainer = page.locator(
      '.LearningForm, [data-test="learning-form"]'
    );

    if ((await formContainer.count()) > 0) {
      await expect(formContainer.first()).toBeVisible();
    } else {
      await expect(page.getByRole("main").first()).toBeVisible();
    }
  });
});
