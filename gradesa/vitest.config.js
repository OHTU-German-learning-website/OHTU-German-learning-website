import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    exclude: ["playwright/e2e/**/*", "node_modules/**/*"],
    coverage: {
      clean: true,
      enabled: true,
      subdir: true,
      reporters: ["text", "json", "html"],
      // Collect coverage only for server/backend code and API handlers.
      // Excluding Next.js app pages, client components and other UI-only
      // files prevents the report from being flooded with frontend files
      // that aren't exercised by the Node test environment.
      include: [
        "src/backend/**/*.{js,ts}",
        "src/app/api/**/*.{js,ts}",
        // include only necessary shared files (schemas/constants) used by backend tests
        "src/shared/const.{js,ts}",
        "src/shared/schemas/**/*.{js,ts}",
      ],
      // Exclude tests, Playwright e2e helpers and client-only code.
      exclude: [
        "**/*.test.*",
        "**/test/**",
        "node_modules/**",
        // exclude Next.js app pages and client components
        "src/app/**/page.*",
        "src/app/**/layout.*",
        "src/app/**/client**/*",
        "src/components/**",
        "src/app/**/editor-section.*",
        "src/app/**/page.module.css",
        // exclude client-only shared helpers and hooks
        "src/shared/hooks/**",
        "src/shared/utils/**",
      ],
      // Include untested files in the report so missing coverage is visible
      // for all files matched by the `include` globs.
      all: true,
      provider: "v8",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
