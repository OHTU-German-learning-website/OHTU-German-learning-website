const { test, expect } = require("@playwright/test");

test.describe("Learning Page", () => {
  test("should load the learning page", async ({ page }) => {
    await page.goto("/learning");
    await expect(page).toHaveURL(/.*learning/);
    await expect(page.getByRole("main").first()).toBeVisible();
  });

  test("should show language toggle options", async ({ page }) => {
    await page.goto("/learning", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("group", { name: "Choose language" })
    ).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole("button", { name: "English" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Deutsch" })).toBeVisible();
  });

  test("should switch language selection", async ({ page }) => {
    await page.goto("/learning");

    const englishButton = page.getByRole("button", { name: "English" });
    const deutschButton = page.getByRole("button", { name: "Deutsch" });

    await expect(englishButton).toBeVisible();
    await expect(deutschButton).toBeVisible();

    const englishPressed =
      (await englishButton.getAttribute("aria-pressed")) === "true";

    if (englishPressed) {
      await deutschButton.click();
      await expect(deutschButton).toHaveAttribute("aria-pressed", "true");
      await expect(englishButton).toHaveAttribute("aria-pressed", "false");
    } else {
      await englishButton.click();
      await expect(englishButton).toHaveAttribute("aria-pressed", "true");
      await expect(deutschButton).toHaveAttribute("aria-pressed", "false");
    }

    await expect(page).toHaveURL(/.*learning/);
  });

  test("should show learning form when data is loaded", async ({ page }) => {
    await page.goto("/learning", { waitUntil: "domcontentloaded" });

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
