import { defineConfig, devices } from '@playwright/test';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Load .env.local for Supabase credentials (needed by auth.setup.ts)
const envLocalPath = join(__dirname, '.env.local');
if (existsSync(envLocalPath)) {
  const envContent = readFileSync(envLocalPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      if (key) {
        process.env[key] = value;
      }
    }
  });
}

// Path to authenticated user storage state
const AUTH_FILE = 'e2e/.auth/user.json';

/**
 * Playwright E2E Test Configuration for TripOS
 *
 * Supports dual viewport testing:
 * - Mobile: 390×844 (iPhone 12 Pro baseline, M1-M16 wireframes)
 * - Desktop: 1440×900 (MacBook Pro 15" baseline, D1-D19 wireframes)
 */
export default defineConfig({
  testDir: './e2e',

  // Maximum time one test can run (30 seconds)
  timeout: 30 * 1000,

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['json', { outputFile: 'playwright-results.json' }]
  ],

  // Shared settings for all the projects below
  use: {
    // Base URL for all tests (change to your dev server)
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',

    // Always headless; use --headed flag to see browsers when debugging
    headless: true,

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',
  },

  // CI runs chromium only (desktop + mobile) for speed.
  // Full cross-browser matrix runs locally.
  projects: process.env.CI
    ? [
        // Setup project: create test user and authenticate
        {
          name: 'setup',
          testMatch: /auth\.setup\.ts/,
        },
        {
          name: 'mobile-chrome',
          use: {
            ...devices['Pixel 7'],
            viewport: { width: 390, height: 844 },
            storageState: AUTH_FILE,
          },
          dependencies: ['setup'],
        },
        {
          name: 'desktop-chrome',
          use: {
            ...devices['Desktop Chrome'],
            viewport: { width: 1440, height: 900 },
            storageState: AUTH_FILE,
          },
          dependencies: ['setup'],
        },
      ]
    : [
        // Setup project: create test user and authenticate
        {
          name: 'setup',
          testMatch: /auth\.setup\.ts/,
        },
        // Mobile viewport (390×844 - iPhone 12 Pro baseline for M1-M16 wireframes)
        {
          name: 'mobile-chrome',
          use: {
            ...devices['iPhone 12 Pro'],
            viewport: { width: 390, height: 844 },
            storageState: AUTH_FILE,
          },
          dependencies: ['setup'],
        },
        {
          name: 'mobile-safari',
          use: {
            ...devices['iPhone 12 Pro'],
            viewport: { width: 390, height: 844 },
            storageState: AUTH_FILE,
          },
          dependencies: ['setup'],
        },

        // Desktop viewport (1440×900 - MacBook Pro 15" baseline for D1-D19 wireframes)
        {
          name: 'desktop-chrome',
          use: {
            ...devices['Desktop Chrome'],
            viewport: { width: 1440, height: 900 },
            storageState: AUTH_FILE,
          },
          dependencies: ['setup'],
        },
        {
          name: 'desktop-firefox',
          use: {
            ...devices['Desktop Firefox'],
            viewport: { width: 1440, height: 900 },
            storageState: AUTH_FILE,
          },
          dependencies: ['setup'],
        },
        {
          name: 'desktop-safari',
          use: {
            ...devices['Desktop Safari'],
            viewport: { width: 1440, height: 900 },
            storageState: AUTH_FILE,
          },
          dependencies: ['setup'],
        },
      ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000/api/health',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
