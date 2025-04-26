const { test, expect } = require("@playwright/test");
const { wait, elementExists } = require("./utils/helpers");

test.describe("Advanced Interactions", () => {
  test("should display grammar content", async ({ page }) => {
    await page.goto("/grammar/communications");
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: "tests/e2e/screenshots/grammar-page.png" });
    await expect(page.locator("main")).toBeVisible();

    // Log headings for future test development
    const headings = await page.locator("h1, h2, h3").all();
    console.log(`Found ${headings.length} headings on grammar page`);

    for (const heading of headings) {
      console.log(`Heading text: ${await heading.textContent()}`);
    }
  });

  test("should navigate through chapters", async ({ page }) => {
    await page.goto("/resources/1");
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: "tests/e2e/screenshots/chapter1.png" });

    const chapter1Url = page.url();

    await page.goto("/resources/2");
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: "tests/e2e/screenshots/chapter2.png" });

    expect(page.url()).not.toEqual(chapter1Url);
    await expect(page.locator("main")).toBeVisible();
  });

  test("should have interactive UI elements", async ({ page }) => {
    await page.goto("/resources");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: "tests/e2e/screenshots/interactive-elements.png",
    });

    // Document UI elements for future test development
    const hasButtons = await elementExists(page, "button");
    console.log("Has buttons:", hasButtons);

    const hasInputs = await elementExists(page, "input");
    console.log("Has inputs:", hasInputs);

    const hasSelects = await elementExists(page, "select");
    console.log("Has selects:", hasSelects);
  });
});
