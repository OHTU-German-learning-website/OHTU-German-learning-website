const { test, expect } = require("@playwright/test");

async function gotoWithRetry(page, url, options, retries = 1) {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      await page.goto(url, options);
      return;
    } catch (error) {
      const message = String(error?.message || "");
      const isRetryable =
        message.includes("NS_ERROR_NET_RESET") ||
        message.includes("ERR_CONNECTION_RESET");

      if (!isRetryable || attempt === retries) {
        throw error;
      }
    }
  }
}

async function getFirstAlphabeticalGrammarHref(page) {
  await gotoWithRetry(page, "/grammar/alphabetical", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  const firstGrammarLink = page
    .locator('a[href*="/grammar/themes/"][href*="view=alphabetical"]')
    .first();

  await expect(firstGrammarLink).toBeVisible();

  const href = await firstGrammarLink.getAttribute("href");
  expect(href).toBeTruthy();

  return href;
}

test.describe("Grammar Pages", () => {
  test("should load the grammar overview page", async ({ page }) => {
    await page.goto("/grammar");
    await expect(page).toHaveURL(/.*\/grammar$/);
    await expect(page.getByRole("main").first()).toBeVisible();
  });

  test("should render topics-view grammar page directly", async ({ page }) => {
    test.setTimeout(60000);

    await page.goto("/grammar/themes/adjektivdeklination?view=topics", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await expect(page).toHaveURL(/view=topics/);
    await expect(page.getByRole("main").first()).toBeVisible();
    await expect(page.getByRole("heading").first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Weiter" })).toBeVisible();
  });

  test("should render alphabetical-view grammar page directly", async ({
    page,
  }) => {
    test.setTimeout(60000);

    const href = await getFirstAlphabeticalGrammarHref(page);
    await gotoWithRetry(page, href, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await expect(page).toHaveURL(/view=alphabetical/);
    await expect(page.getByRole("heading").first()).toBeVisible();
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
    test.setTimeout(60000);

    const href = await getFirstAlphabeticalGrammarHref(page);
    await gotoWithRetry(page, href, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    const weiterButton = page.getByRole("link", { name: "Weiter" });
    if (await weiterButton.isVisible()) {
      await expect(weiterButton).toHaveAttribute("href", /view=alphabetical/);
      await Promise.all([
        page.waitForURL(/view=alphabetical/, {
          timeout: 60000,
        }),
        weiterButton.click(),
      ]);
    }
  });

  test("should not show Ohne Thema in topics overview", async ({ page }) => {
    await page.goto("/grammar/themes");

    await expect(
      page.getByRole("heading", { name: /Ohne Thema/i })
    ).toHaveCount(0);
  });
});
