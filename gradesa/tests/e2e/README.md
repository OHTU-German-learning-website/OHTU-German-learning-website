# End-to-End Testing with Playwright

## Setup

```
npm install --save-dev @playwright/test
npx playwright install
```

## Commands

```bash
npm run test:e2e              # Run all tests
npm run test:e2e:ui           # Run with UI mode
npm run test:e2e:debug        # Run in debug mode
npx playwright test [file]    # Run specific test file
```

## Test Structure

- `homepage.spec.js` - Home page tests
- `navigation.spec.js` - Navigation tests
- `auth.spec.js` - Authentication tests
- `components.spec.js` - Component interaction tests
- `forms.spec.js` - Form tests
- `page-analyzer.spec.js` - Page analysis utilities
- `advanced.spec.js` - Advanced interaction examples
- `utils/helpers.js` - Helper functions

## Key Findings

1. **Navigation** - `page.goto()` is more reliable than clicking links
2. **Selectors** - `getByRole()` is more reliable than `locator()` with CSS selectors
3. **Structure** - Main navigation has links to grammar, resources, and auth pages

## Page Structure Notes

- Home page: Links to resources, grammar, login, and register
- Resources: Chapter navigation and content
- No hamburger menu or mobile-specific UI elements

## Best Practices

1. Use `page-analyzer.spec.js` to understand page structure
2. Review screenshots in `screenshots/` to understand the UI
3. Use role-based selectors: `getByRole('link', { name: 'Kapitel 1' })`
4. For navigation, use direct `page.goto()` rather than clicking links
5. Add appropriate assertions to verify page content

## Common Issues

- **Element not found**: Use more robust selectors
- **Strict mode violations**: Use more specific selectors when multiple elements match
- **Navigation timeouts**: Use direct navigation
- **Timing issues**: Use `waitForLoadState('networkidle')`

## Next Steps

1. Form submission tests after analyzing form behavior
2. Content interaction tests
3. User journey tests
4. Visual regression tests

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
