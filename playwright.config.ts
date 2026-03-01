import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E configuration for TripFlow.
 *
 * Artifacts (videos, traces, screenshots) are stored under:
 *   test-results/        – per-test folders with videos + failure screenshots
 *   playwright-report/   – HTML report
 *
 * Key settings:
 *   headless: false      – browser window is visible during local runs
 *   video: 'on'          – every test records a .webm video
 *   trace: 'on-first-retry' – full trace collected on first retry (for LLM analysis)
 *   screenshot: 'only-on-failure' – PNG captured only when a test fails
 */
export default defineConfig({
  globalSetup: './e2e/global-setup.ts',
  testDir: './e2e',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  /* Global timeouts */
  timeout: 30_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: 'http://localhost:3100',

    /* Visible browser – set to true in CI via env override */
    headless: !!process.env.CI,

    /* Video recording for every test */
    video: 'on',

    /* Trace collected on first retry – rich artifact for debugging / LLM analysis */
    trace: 'on-first-retry',

    /* Screenshots only when something breaks */
    screenshot: 'only-on-failure',

    /* Per-action and navigation timeouts */
    actionTimeout: 10_000,
    navigationTimeout: 15_000,

    /* Deterministic viewport */
    viewport: { width: 1280, height: 720 },
    locale: 'en-US',
    timezoneId: 'UTC',
    colorScheme: 'light',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3100',
    reuseExistingServer: !process.env.CI,  // Reuse locally, fresh in CI
    timeout: 120_000,
  },
});
