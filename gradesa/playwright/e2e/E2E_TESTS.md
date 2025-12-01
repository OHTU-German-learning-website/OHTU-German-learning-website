# End-to-End Testing with Playwright

_Last Updated: November 30, 2025_

This directory contains E2E tests using [Playwright](https://playwright.dev/) to test the application in real browsers.

## Prerequisites

- **Node.js**: v20+ (included in dev container)
- **Environment**: Run commands inside the dev container at `/host/gradesa`
- **Database**: Tests run against the test database (configured via `.env.test`)

## Initial Setup

Playwright is already configured in this project. If setting up from scratch:

```
npm install --save-dev @playwright/test
npx playwright install
```

## Quick E2E checklist

- Ensure the app is running (dev server at `http://localhost:3000`).
- Ensure the test database is migrated/available (`npm run db:migrate` with `.env.test` set if needed).
- Install Playwright browsers: `npx playwright install`.
- Run tests: `npm run test:e2e` (or `npx playwright test <file>`).

## Commands

Run these commands from `/host/gradesa` inside the container:

```bash
npm run test:e2e              # Run all tests
npm run test:e2e:ui           # Run with UI mode
npm run test:e2e:debug        # Run in debug mode
npx playwright test [file]    # Run specific test file
```

## CI/CD Integration

Playwright tests run automatically in the GitHub Actions pipeline:

- Triggered on pull requests to `master`
- Tests run in headless mode
- Screenshots and videos captured on failure
- Test results available in GitHub Actions artifacts

## Writing New Tests

### File Naming

Follow the existing pattern: `feature-name.spec.js`

### Test Structure

```javascript
import { test, expect } from "@playwright/test";

test.describe("Feature Name", () => {
  test.beforeEach(async ({ page }) => {
    // Setup: navigate to page, login if needed
    await page.goto("/your-route");
  });

  test("should do something specific", async ({ page }) => {
    // Arrange: Set up test data
    // Act: Perform user actions
    // Assert: Verify results
    await expect(page.locator("selector")).toBeVisible();
  });
});
```

### Naming Conventions

- Use descriptive test names: `should display error message when form is invalid`
- Group related tests in `test.describe` blocks
- Use `test.beforeEach` for common setup

### Finding Elements

Prefer semantic selectors (in order of preference):

1. `getByRole()` - Most robust, uses accessibility roles
2. `getByLabel()` - For form fields
3. `getByText()` - For unique text content
4. `getByTestId()` - Last resort, requires adding `data-testid`

## Test Files Structure

Current test files in this directory:

- `homepage.spec.js` - Home page tests
- `navigation.spec.js` - Navigation tests
- `auth.spec.js` - Authentication tests
- `components.spec.js` - Component interaction tests
- `forms.spec.js` - Form tests
- `grammar.spec.js` - Grammar feature tests
- `page-analyzer.spec.js` - Page analysis utilities
- `advanced.spec.js` - Advanced interaction examples
- `utils/helpers.js` - Helper functions

## Developer Notes

The following sections contain observations and findings from E2E test development. These are helpful for understanding the application structure and writing effective tests.

### Key Findings

1. **Navigation** - `page.goto()` is more reliable than clicking links
2. **Selectors** - `getByRole()` is more reliable than `locator()` with CSS selectors
3. **Structure** - Main navigation has links to grammar, resources, and auth pages

## Page Structure Notes

- Home page: Links to resources, grammar, login, and register
- Resources: Chapter navigation and content
- No hamburger menu or mobile-specific UI elements

### Screenshots

Playwright automatically captures screenshots on test failures. These are saved in:

- `test-results/` directory (gitignored)
- Available as artifacts in CI/CD runs

To manually capture screenshots during development:

```javascript
await page.screenshot({ path: "debug-screenshot.png" });
```

## Best Practices

1. **Understand page structure first**: Use `page-analyzer.spec.js` to explore pages
2. **Review screenshots**: Check `test-results/` and `screenshots/` to understand the UI
3. **Use semantic selectors**: Prefer `getByRole('link', { name: 'Kapitel 1' })`
4. **Direct navigation**: Use `page.goto()` for navigation rather than clicking links when appropriate
5. **Wait for stability**: Use `waitForLoadState('networkidle')` after navigation
6. **Isolate tests**: Each test should be independent and not rely on others
7. **Clean up**: Reset state after tests (e.g., delete created data)

## Common Issues & Debugging

### Element Not Found

- **Solution**: Use more robust selectors (role-based)
- **Debug**: Use `await page.pause()` to inspect the page
- **Debug**: Print available elements: `console.log(await page.content())`

### Strict Mode Violations

- **Error**: "locator resolved to multiple elements"
- **Solution**: Make selector more specific or use `.first()`, `.last()`, `.nth()`

### Navigation Timeouts

- **Solution**: Use direct navigation with `page.goto()`
- **Solution**: Increase timeout: `await page.goto(url, { timeout: 60000 })`

### Timing Issues

- **Solution**: Use Playwright's auto-waiting (preferred)
- **Solution**: Explicit waits: `await page.waitForSelector('selector')`
- **Avoid**: `page.waitForTimeout()` - this is an anti-pattern

### Debugging Tips

```javascript
// Pause test execution
await page.pause();

// Take screenshot at specific point
await page.screenshot({ path: "debug.png" });

// Print page HTML
console.log(await page.content());

// Check what's visible
const visible = await page.locator("selector").isVisible();
console.log("Element visible:", visible);
```

## Further Development

Planned improvements:

1. Form submission tests with various input scenarios
2. Content interaction tests (exercise completion flows)
3. User journey tests (end-to-end user scenarios)
4. Visual regression tests
5. Accessibility tests using Playwright's accessibility testing

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro) - Getting started guide
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright) - Complete API docs
- [Playwright Best Practices](https://playwright.dev/docs/best-practices) - Official best practices
- [Playwright Test Generator](https://playwright.dev/docs/codegen) - Generate tests by recording actions
- [Debugging Tests](https://playwright.dev/docs/debug) - Debugging guide
