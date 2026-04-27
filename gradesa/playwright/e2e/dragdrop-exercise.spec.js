const { test, expect } = require("@playwright/test");

async function gotoDragdropExerciseList(page) {
  await page.goto("/grammar/exercises/dragdrop", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
}

function isOnLogin(url) {
  return url.includes("/auth/login");
}

test.describe("Drag-und-Drop-Übungen", () => {
  test("should load dragdrop exercises list or redirect to login", async ({
    page,
  }) => {
    test.setTimeout(60000);

    await gotoDragdropExerciseList(page);

    const currentUrl = page.url();
    if (isOnLogin(currentUrl)) {
      await expect(page).toHaveURL(/\/auth\/login\?redirect=/);
      await expect(page.locator("form")).toBeVisible();
      return;
    }

    await expect(page).toHaveURL(/\/grammar\/exercises\/dragdrop/);
    await expect(
      page.getByRole("heading", { name: /Drag-und-Drop-Übungen/i })
    ).toBeVisible();
  });

  test("should show dragdrop links or empty state", async ({ page }) => {
    test.setTimeout(60000);

    await gotoDragdropExerciseList(page);

    const currentUrl = page.url();
    if (isOnLogin(currentUrl)) {
      test.skip();
      return;
    }

    const exerciseLinks = page.locator(
      'a[href*="/grammar/exercises/dragdrop/"]'
    );
    const emptyState = page.getByText("Zurzeit sind keine Übungen verfügbar.");

    const linkCount = await exerciseLinks.count();
    if (linkCount > 0) {
      await expect(exerciseLinks.first()).toBeVisible();
    } else {
      await expect(emptyState).toBeVisible();
    }
  });

  test("should open a dragdrop exercise detail page when available", async ({
    page,
  }) => {
    test.setTimeout(60000);

    await gotoDragdropExerciseList(page);

    const currentUrl = page.url();
    if (isOnLogin(currentUrl)) {
      test.skip();
      return;
    }

    const exerciseLinks = page.locator(
      'a[href*="/grammar/exercises/dragdrop/"]'
    );
    const linkCount = await exerciseLinks.count();

    if (linkCount === 0) {
      test.skip();
      return;
    }

    const href = await exerciseLinks.first().getAttribute("href");
    expect(href).toBeTruthy();

    await page.goto(href, { waitUntil: "domcontentloaded", timeout: 60000 });

    await expect(page).toHaveURL(
      new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    );
    await expect(page.getByRole("heading").first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Antworten einreichen/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Erneut versuchen/i })
    ).toBeVisible();
  });
});
