const { test, expect } = require("@playwright/test");

async function gotoFillInTheGapList(page) {
  await page.goto("/grammar/exercises/fillinthegap", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
}

function isOnLogin(url) {
  return url.includes("/auth/login");
}

test.describe("Lückentext-Übungen", () => {
  test("should load the exercises list page", async ({ page }) => {
    test.setTimeout(60000);

    await gotoFillInTheGapList(page);

    const currentUrl = page.url();
    if (isOnLogin(currentUrl)) {
      await expect(page).toHaveURL(/\/auth\/login\?redirect=/);
      await expect(page.locator("form")).toBeVisible();
      return;
    }

    await expect(page).toHaveURL(/\/grammar\/exercises\/fillinthegap/);
    await expect(page.getByRole("main").first()).toBeVisible();
  });

  test("should show the page heading", async ({ page }) => {
    test.setTimeout(60000);

    await gotoFillInTheGapList(page);

    const currentUrl = page.url();
    if (isOnLogin(currentUrl)) {
      await expect(page).toHaveURL(/\/auth\/login\?redirect=/);
      await expect(page.locator("form")).toBeVisible();
      return;
    }

    await expect(
      page.getByRole("heading", { name: /Lückentext-Übungen/i })
    ).toBeVisible();
  });

  test("should show exercises or an empty-state message", async ({ page }) => {
    test.setTimeout(60000);

    await gotoFillInTheGapList(page);

    const currentUrl = page.url();
    if (isOnLogin(currentUrl)) {
      await expect(page).toHaveURL(/\/auth\/login\?redirect=/);
      await expect(page.locator("form")).toBeVisible();
      return;
    }

    // After loading the page should either show exercise links or the empty state
    const exerciseLinks = page.locator(
      'a[href*="/grammar/exercises/fillinthegap/"]'
    );
    const emptyState = page.getByText("Zurzeit sind keine Übungen verfügbar.");

    const linkCount = await exerciseLinks.count();
    if (linkCount > 0) {
      await expect(exerciseLinks.first()).toBeVisible();
    } else {
      await expect(emptyState).toBeVisible();
    }
  });

  test("should navigate to an exercise when one exists", async ({ page }) => {
    test.setTimeout(60000);

    await gotoFillInTheGapList(page);

    const currentUrl = page.url();
    if (isOnLogin(currentUrl)) {
      test.skip();
      return;
    }

    const exerciseLinks = page.locator(
      'a[href*="/grammar/exercises/fillinthegap/"]'
    );

    const linkCount = await exerciseLinks.count();
    if (linkCount === 0) {
      // No exercises seeded in this environment — skip interaction
      test.skip();
      return;
    }

    const href = await exerciseLinks.first().getAttribute("href");
    expect(href).toBeTruthy();

    await page.goto(href, { waitUntil: "domcontentloaded", timeout: 60000 });

    await expect(page).toHaveURL(
      new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    );
    await expect(page.getByRole("main").first()).toBeVisible();
  });
});
