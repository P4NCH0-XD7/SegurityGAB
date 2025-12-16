import { defineConfig } from '@playwright/test';

/**
 * Root Playwright config for:
 * - backend/tests/e2e
 * - backend/tests/blackbox
 * - frontend/tests/blackbox
 *
 * It starts BOTH servers via scripts/e2e-webserver.mjs so tests can run locally/CI
 * without manual setup.
 */
export default defineConfig({
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: process.env.E2E_FRONTEND_URL || 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'node scripts/e2e-webserver.mjs',
    url: process.env.E2E_FRONTEND_URL || 'http://127.0.0.1:3000',
    reuseExistingServer: true,
    timeout: 180_000,
    env: {
      ...process.env,
      // Used by the webserver script to wire FE -> BE.
      E2E_BACKEND_URL: process.env.E2E_BACKEND_URL || 'http://127.0.0.1:3001',
      E2E_FRONTEND_URL: process.env.E2E_FRONTEND_URL || 'http://127.0.0.1:3000',
    },
  },
});
