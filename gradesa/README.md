This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
```

## Testing & Vitest UI

This project uses Vitest for unit tests and V8 for coverage. Two helper scripts are provided:

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
