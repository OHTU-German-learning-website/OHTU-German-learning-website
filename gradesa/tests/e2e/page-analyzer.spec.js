const { test, expect } = require("@playwright/test");
const { takeScreenshot, elementExists } = require("./utils/helpers");

test.describe("Page Structure Analysis", () => {
  test("analyze homepage structure", async ({ page }) => {
    await page.goto("/");
    await page.screenshot({ path: "tests/e2e/screenshots/homepage.png" });

    console.log("Page title:", await page.title());

    const hasNav = await elementExists(page, "nav");
    console.log("Has navigation:", hasNav);

    const hasMain = await elementExists(page, "main");
    console.log("Has main content:", hasMain);

    const hasFooter = await elementExists(page, "footer");
    console.log("Has footer:", hasFooter);

    const links = await page.locator("a").all();
    console.log("Number of links:", links.length);

    // Log first 10 links to avoid overwhelming output
    for (const link of links.slice(0, 10)) {
      const href = await link.getAttribute("href");
      const text = await link.textContent();
      const isVisible = await link.isVisible();
      console.log(
        `Link: href="${href}", text="${text?.trim()}", visible=${isVisible}`
      );
    }
  });

  test("analyze learning page structure", async ({ page }) => {
    await page.goto("/learning");
    await page.screenshot({ path: "tests/e2e/screenshots/learning.png" });

    console.log("Page title:", await page.title());

    const hasH1 = await elementExists(page, "h1");
    console.log("Has h1:", hasH1);

    const hasTabs = await elementExists(page, '[role="tablist"]');
    console.log("Has tablist:", hasTabs);

    const hasButtons = await elementExists(page, "button");
    console.log("Has buttons:", hasButtons);
  });
});
