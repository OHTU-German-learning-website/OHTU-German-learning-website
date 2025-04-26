// Use sparingly - prefer proper test assertions
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const takeScreenshot = async (page, name) => {
  await page.screenshot({ path: `./screenshots/${name}.png`, fullPage: true });
};

const elementExists = async (page, selector) => {
  const count = await page.locator(selector).count();
  return count > 0;
};

const getTextContent = async (page, selector) => {
  return await page.locator(selector).textContent();
};

module.exports = {
  wait,
  takeScreenshot,
  elementExists,
  getTextContent,
};
