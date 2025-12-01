# Next.js Application Guide

_Last Updated: November 30, 2025_

This is a [Next.js](https://nextjs.org) v15 project using the App Router architecture. This guide covers development workflow specific to the Next.js application in the `gradesa/` directory.

> **Note**: For overall project setup, see the [root README](../README.md).

## Getting Started

Run the development server from inside the container at `/host/gradesa`:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.js`. The page auto-updates as you edit the file (hot module replacement).

## Project Structure

- `src/app/` - Pages, layouts, and API routes (Next.js App Router)
- `src/backend/` - Server-side utilities (database, auth, middleware)
- `src/components/` - Reusable UI components
- `src/shared/` - Code shared between client and server
- See [SOURCE_OVERVIEW.md](src/SOURCE_OVERVIEW.md) for detailed structure

## Available Scripts

### Development

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Create production build
- `npm start` - Run production build (applies migrations first)
- `npm run lint` - Run ESLint

### Testing

- `npm test` or `npm run test` - Run unit tests with Vitest
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:coverage:ui` - Open Vitest UI with coverage
- `npm run test:coverage:ui:localhost` - Vitest UI bound to localhost
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run test:e2e:ui` - Run E2E tests with Playwright UI
- `npm run test:e2e:debug` - Debug E2E tests

### Database

- `npm run db:migrate` - Apply database migrations (run from root)
- `npm run db:reset` - Reset database and reapply migrations (run from root)

## Deployment

This project deploys to **University of Helsinki OpenShift** (not Vercel). See the [root README](../README.md#openshift) for deployment details.

## Testing

### Unit Tests (Vitest)

This project uses [Vitest](https://vitest.dev/) for unit tests and V8 for coverage.

**Test Location**: Place test files adjacent to the code being tested with `.test.js` extension:

- Component tests: `src/components/**/*.test.js`
- Backend tests: `src/backend/**/*.test.js`
- Hook tests: `src/shared/hooks/**/*.test.js`

**Scripts**:

- `npm run test:coverage` — run tests with coverage in the terminal (no UI).
- `npm run test:coverage:ui` — start the Vitest UI bound to all interfaces so you can open the browser on your host:

  - Server: `http://localhost:51204/__vitest__/`
  - Use this when accessing the UI from outside a container (port `51204` is forwarded in `docker-compose.yml`).

- `npm run test:coverage:ui:localhost` — start the Vitest UI bound to `127.0.0.1`:
  - Server: `http://127.0.0.1:51204/__vitest__/`
  - Use this for local browser debugging (helps with Firefox connection issues).

Notes & Troubleshooting

- If the UI shows "Connecting…" in Firefox but works in Chrome:
  - Try the `:localhost` script and open `http://127.0.0.1:51204`.
  - Disable privacy extensions or open the UI in a Private Window.
  - Clear site data / unregister service workers for that origin (DevTools → Application → Service Workers).
  - Check the DevTools Console / Network tab for blocked WebSocket (ws://) connections.
- When running inside Docker/devcontainer:
  - Ensure port `51204` is forwarded (the provided `docker-compose.yml` already maps `51204:51204`).
  - If Vitest attempts to open a browser inside the container, use `--open=false` (already set in scripts).

### End-to-End Tests (Playwright)

E2E tests use [Playwright](https://playwright.dev/) to test the application in real browsers.

**Test Location**: `playwright/e2e/*.spec.js`

See [E2E_TESTS.md](playwright/e2e/E2E_TESTS.md) for detailed E2E testing documentation.

## Learn More

To learn more about Next.js and related tooling:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- E2E tests: see `playwright/e2e/E2E_TESTS.md` (Playwright)
