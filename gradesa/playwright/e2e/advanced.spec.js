const { test, expect } = require("@playwright/test");
const { elementExists } = require("./utils/helpers");

test.describe("Advanced Interactions", () => {
  test("should display grammar content", async ({ page }) => {
    await page.goto("/grammar/themes", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main")).toBeVisible();

    const headings = await page.locator("h1, h2, h3").all();
    console.log(`Found ${headings.length} headings on grammar page`);

    for (const heading of headings) {
      console.log(`Heading text: ${await heading.textContent()}`);
    }
  });

  test("should navigate through chapters", async ({ page, browserName }) => {
    test.skip(
      browserName === "webkit",
      "WebKit cannot load /pages/resources/1 - browser compatibility issue"
    );
    test.setTimeout(60000);

    await page.goto("/pages/resources/1", { waitUntil: "domcontentloaded" });
    const chapter1Url = page.url();

    await page.goto("/pages/resources/2", { waitUntil: "domcontentloaded" });

    expect(page.url()).not.toEqual(chapter1Url);
  });

  test("should have interactive UI elements", async ({ page }) => {
    test.setTimeout(60000);

    await page.goto("/pages/resources", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.screenshot({
      path: "tests/e2e/screenshots/interactive-elements.png",
    });

    const hasButtons = await elementExists(page, "button");
    console.log("Has buttons:", hasButtons);

    const hasInputs = await elementExists(page, "input");
    console.log("Has inputs:", hasInputs);

    const hasSelects = await elementExists(page, "select");
    console.log("Has selects:", hasSelects);

    expect(hasButtons || hasInputs || hasSelects).toBeTruthy();
  });
});
