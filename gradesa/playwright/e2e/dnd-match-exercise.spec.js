const { test, expect } = require("@playwright/test");

async function gotoDndMatchList(page) {
  await page.goto("/grammar/exercises/dnd-match", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
}

function isOnLogin(url) {
  return url.includes("/auth/login");
}

test.describe("Zuordnungs-Übungen", () => {
  // ── List page ──────────────────────────────────────────────────────────────

  test("should load zuordnungs list page or redirect to login", async ({
    page,
  }) => {
    test.setTimeout(60000);

    await gotoDndMatchList(page);

    const currentUrl = page.url();
    if (isOnLogin(currentUrl)) {
      await expect(page).toHaveURL(/\/auth\/login\?redirect=/);
      await expect(page.locator("form")).toBeVisible();
      return;
    }

    await expect(page).toHaveURL(/\/grammar\/exercises\/dnd-match/);
    await expect(
      page.getByRole("heading", { name: /Zuordnungs-Übungen/i })
    ).toBeVisible();
  });

  test("should show exercise links or empty state on list page", async ({
    page,
  }) => {
    test.setTimeout(60000);

    await gotoDndMatchList(page);

    const currentUrl = page.url();
    if (isOnLogin(currentUrl)) {
      test.skip();
      return;
    }

    const exerciseLinks = page.locator(
      'a[href*="/grammar/exercises/dnd-match/"]'
    );
    const emptyState = page.getByText("Zurzeit sind keine Übungen verfügbar.");

    const linkCount = await exerciseLinks.count();
    if (linkCount > 0) {
      await expect(exerciseLinks.first()).toBeVisible();
    } else {
      await expect(emptyState).toBeVisible();
    }
  });

  // ── Detail page ────────────────────────────────────────────────────────────

  test("should open a zuordnungs exercise detail page when available", async ({
    page,
  }) => {
    test.setTimeout(60000);

    await gotoDndMatchList(page);

    const currentUrl = page.url();
    if (isOnLogin(currentUrl)) {
      test.skip();
      return;
    }

    const exerciseLinks = page.locator(
      'a[href*="/grammar/exercises/dnd-match/"]'
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
  });

  test("should render submit and reset buttons on exercise detail page", async ({
    page,
  }) => {
    test.setTimeout(60000);

    await gotoDndMatchList(page);

    const currentUrl = page.url();
    if (isOnLogin(currentUrl)) {
      test.skip();
      return;
    }

    const exerciseLinks = page.locator(
      'a[href*="/grammar/exercises/dnd-match/"]'
    );
    const linkCount = await exerciseLinks.count();

    if (linkCount === 0) {
      test.skip();
      return;
    }

    const href = await exerciseLinks.first().getAttribute("href");
    await page.goto(href, { waitUntil: "domcontentloaded", timeout: 60000 });

    // Submit button should be visible but disabled until all slots are filled
    const submitBtn = page.getByRole("button", {
      name: /Antworten einreichen/i,
    });
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeDisabled();

    // Reset button is always available
    await expect(
      page.getByRole("button", { name: /Erneut versuchen/i })
    ).toBeVisible();
  });

  test("should render left slots and right draggable cards on detail page", async ({
    page,
  }) => {
    test.setTimeout(60000);

    await gotoDndMatchList(page);

    const currentUrl = page.url();
    if (isOnLogin(currentUrl)) {
      test.skip();
      return;
    }

    const exerciseLinks = page.locator(
      'a[href*="/grammar/exercises/dnd-match/"]'
    );
    const linkCount = await exerciseLinks.count();

    if (linkCount === 0) {
      test.skip();
      return;
    }

    const href = await exerciseLinks.first().getAttribute("href");
    await page.goto(href, { waitUntil: "domcontentloaded", timeout: 60000 });

    // At least one drop slot and one draggable card must be visible
    await expect(
      page.locator('[data-testid="match-slot"]').first()
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="match-card"]').first()
    ).toBeVisible();
  });

  test("should enable submit button only when all slots are filled", async ({
    page,
  }) => {
    test.setTimeout(60000);

    await gotoDndMatchList(page);

    const currentUrl = page.url();
    if (isOnLogin(currentUrl)) {
      test.skip();
      return;
    }

    const exerciseLinks = page.locator(
      'a[href*="/grammar/exercises/dnd-match/"]'
    );
    const linkCount = await exerciseLinks.count();

    if (linkCount === 0) {
      test.skip();
      return;
    }

    const href = await exerciseLinks.first().getAttribute("href");
    await page.goto(href, { waitUntil: "domcontentloaded", timeout: 60000 });

    const submitBtn = page.getByRole("button", {
      name: /Antworten einreichen/i,
    });

    // Initially disabled — no cards placed yet
    await expect(submitBtn).toBeDisabled();

    const slots = page.locator('[data-testid="match-slot"]');
    const cards = page.locator('[data-testid="match-card"]');

    const slotCount = await slots.count();
    const cardCount = await cards.count();

    if (slotCount === 0 || cardCount === 0) {
      test.skip();
      return;
    }

    // Drag each card into the corresponding slot using mouse events
    for (let i = 0; i < slotCount; i++) {
      const card = cards.nth(0); // always take the first remaining card
      const slot = slots.nth(i);

      const cardBox = await card.boundingBox();
      const slotBox = await slot.boundingBox();

      if (!cardBox || !slotBox) continue;

      // Drag the card over the slot drop zone
      await page.mouse.move(
        cardBox.x + cardBox.width / 2,
        cardBox.y + cardBox.height / 2
      );
      await page.mouse.down();
      await page.mouse.move(
        slotBox.x + slotBox.width / 2,
        slotBox.y + slotBox.height / 2,
        { steps: 10 }
      );
      await page.mouse.up();

      // Small pause to let React state update
      await page.waitForTimeout(200);
    }

    // After all slots are filled the submit button should become enabled
    await expect(submitBtn).toBeEnabled({ timeout: 5000 });
  });

  test("should show result feedback after submitting answers", async ({
    page,
  }) => {
    test.setTimeout(60000);

    await gotoDndMatchList(page);

    const currentUrl = page.url();
    if (isOnLogin(currentUrl)) {
      test.skip();
      return;
    }

    const exerciseLinks = page.locator(
      'a[href*="/grammar/exercises/dnd-match/"]'
    );
    const linkCount = await exerciseLinks.count();

    if (linkCount === 0) {
      test.skip();
      return;
    }

    const href = await exerciseLinks.first().getAttribute("href");
    await page.goto(href, { waitUntil: "domcontentloaded", timeout: 60000 });

    const slots = page.locator('[data-testid="match-slot"]');
    const slotCount = await slots.count();

    if (slotCount === 0) {
      test.skip();
      return;
    }

    // Fill all slots with whatever card is available (may not be correct)
    for (let i = 0; i < slotCount; i++) {
      const card = page.locator('[data-testid="match-card"]').nth(0);
      const slot = slots.nth(i);

      const cardBox = await card.boundingBox();
      const slotBox = await slot.boundingBox();

      if (!cardBox || !slotBox) continue;

      await page.mouse.move(
        cardBox.x + cardBox.width / 2,
        cardBox.y + cardBox.height / 2
      );
      await page.mouse.down();
      await page.mouse.move(
        slotBox.x + slotBox.width / 2,
        slotBox.y + slotBox.height / 2,
        { steps: 10 }
      );
      await page.mouse.up();
      await page.waitForTimeout(200);
    }

    const submitBtn = page.getByRole("button", {
      name: /Antworten einreichen/i,
    });
    await expect(submitBtn).toBeEnabled({ timeout: 5000 });
    await submitBtn.click();

    // Result banner must appear (either success or fail)
    const resultBanner = page.locator(
      ".dnd-match-result--success, .dnd-match-result--fail"
    );
    await expect(resultBanner).toBeVisible({ timeout: 10000 });
  });

  test("should reset slots and hide result after clicking Erneut versuchen", async ({
    page,
  }) => {
    test.setTimeout(60000);

    await gotoDndMatchList(page);

    const currentUrl = page.url();
    if (isOnLogin(currentUrl)) {
      test.skip();
      return;
    }

    const exerciseLinks = page.locator(
      'a[href*="/grammar/exercises/dnd-match/"]'
    );
    const linkCount = await exerciseLinks.count();

    if (linkCount === 0) {
      test.skip();
      return;
    }

    const href = await exerciseLinks.first().getAttribute("href");
    await page.goto(href, { waitUntil: "domcontentloaded", timeout: 60000 });

    const slots = page.locator('[data-testid="match-slot"]');
    const slotCount = await slots.count();

    if (slotCount === 0) {
      test.skip();
      return;
    }

    // Fill and submit
    for (let i = 0; i < slotCount; i++) {
      const card = page.locator('[data-testid="match-card"]').nth(0);
      const slot = slots.nth(i);

      const cardBox = await card.boundingBox();
      const slotBox = await slot.boundingBox();
      if (!cardBox || !slotBox) continue;

      await page.mouse.move(
        cardBox.x + cardBox.width / 2,
        cardBox.y + cardBox.height / 2
      );
      await page.mouse.down();
      await page.mouse.move(
        slotBox.x + slotBox.width / 2,
        slotBox.y + slotBox.height / 2,
        { steps: 10 }
      );
      await page.mouse.up();
      await page.waitForTimeout(200);
    }

    await page.getByRole("button", { name: /Antworten einreichen/i }).click();
    await expect(
      page.locator(".dnd-match-result--success, .dnd-match-result--fail")
    ).toBeVisible({ timeout: 10000 });

    // Click reset
    await page.getByRole("button", { name: /Erneut versuchen/i }).click();

    // Result banner disappears and submit button is disabled again
    await expect(
      page.locator(".dnd-match-result--success, .dnd-match-result--fail")
    ).not.toBeVisible({ timeout: 5000 });
    await expect(
      page.getByRole("button", { name: /Antworten einreichen/i })
    ).toBeDisabled();

    // Right-column cards reappear
    await expect(
      page.locator('[data-testid="match-card"]').first()
    ).toBeVisible();
  });

  // ── Back-navigation ────────────────────────────────────────────────────────

  test("should have a back link to the exercise list on the detail page", async ({
    page,
  }) => {
    test.setTimeout(60000);

    await gotoDndMatchList(page);

    const currentUrl = page.url();
    if (isOnLogin(currentUrl)) {
      test.skip();
      return;
    }

    const exerciseLinks = page.locator(
      'a[href*="/grammar/exercises/dnd-match/"]'
    );
    const linkCount = await exerciseLinks.count();

    if (linkCount === 0) {
      test.skip();
      return;
    }

    const href = await exerciseLinks.first().getAttribute("href");
    await page.goto(href, { waitUntil: "domcontentloaded", timeout: 60000 });

    const backLink = page.getByRole("link", {
      name: /Zurück zu allen Zuordnungs-Übungen/i,
    });
    await expect(backLink).toBeVisible();

    await backLink.click();
    await expect(page).toHaveURL(/\/grammar\/exercises\/dnd-match$/);
  });
});
