/**
 * Visual Regression Tests with Percy
 *
 * These tests capture screenshots of key pages and components to detect
 * unintended visual changes (layout shifts, color regressions, dark mode breaks).
 *
 * Run locally:
 *   PERCY_TOKEN=<your-token> npm run percy:exec
 *
 * Run in CI:
 *   Set PERCY_TOKEN in GitHub Secrets, Percy auto-runs on PR commits
 *
 * View results:
 *   https://percy.io/your-org/tripflow-next
 */

import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Visual Regression Tests', () => {
  test.describe.configure({ mode: 'serial' }); // Run sequentially for consistent snapshots

  test.describe('Light Mode', () => {
    test.beforeEach(async ({ page }) => {
      // Ensure light mode
      await page.goto('/');
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'light');
      });
    });

    test('Homepage - Light', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="hero-section"], h1', { timeout: 5000 });
      await percySnapshot(page, 'Homepage - Light Mode', {
        widths: [375, 768, 1280, 1920],
      });
    });

    test('Itinerary Page - Light', async ({ page }) => {
      await page.goto('/itinerary');
      await page.waitForSelector('.day-timeline, h1', { timeout: 5000 });
      // Wait for city colors to load
      await page.waitForTimeout(500);
      await percySnapshot(page, 'Itinerary - Light Mode', {
        widths: [375, 768, 1280],
      });
    });

    test('Map Page - Light', async ({ page }) => {
      await page.goto('/map');
      await page.waitForSelector('canvas, [role="region"]', { timeout: 10000 });
      // Wait for map to render
      await page.waitForTimeout(1500);
      await percySnapshot(page, 'Map - Light Mode', {
        widths: [768, 1280],
        // Only desktop widths - mobile map has different layout
      });
    });

    test('Budget Page - Light', async ({ page }) => {
      await page.goto('/budget');
      await page.waitForSelector('.budget-container, h2', { timeout: 5000 });
      await percySnapshot(page, 'Budget - Light Mode', {
        widths: [375, 768, 1280],
      });
    });

    test('Voting Page - Light', async ({ page }) => {
      await page.goto('/voting');
      await page.waitForSelector('.voting-container, h1', { timeout: 5000 });
      await percySnapshot(page, 'Voting - Light Mode', {
        widths: [375, 768, 1280],
      });
    });
  });

  test.describe('Dark Mode', () => {
    test.beforeEach(async ({ page }) => {
      // Ensure dark mode
      await page.goto('/');
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
      });
    });

    test('Homepage - Dark', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="hero-section"], h1', { timeout: 5000 });
      await percySnapshot(page, 'Homepage - Dark Mode', {
        widths: [375, 768, 1280, 1920],
      });
    });

    test('Itinerary Page - Dark', async ({ page }) => {
      await page.goto('/itinerary');
      await page.waitForSelector('.day-timeline, h1', { timeout: 5000 });
      await page.waitForTimeout(500);
      await percySnapshot(page, 'Itinerary - Dark Mode', {
        widths: [375, 768, 1280],
      });
    });

    test('Map Page - Dark', async ({ page }) => {
      await page.goto('/map');
      await page.waitForSelector('canvas, [role="region"]', { timeout: 10000 });
      await page.waitForTimeout(1500);
      await percySnapshot(page, 'Map - Dark Mode', {
        widths: [768, 1280],
      });
    });

    test('Budget Page - Dark', async ({ page }) => {
      await page.goto('/budget');
      await page.waitForSelector('.budget-container, h2', { timeout: 5000 });
      await percySnapshot(page, 'Budget - Dark Mode', {
        widths: [375, 768, 1280],
      });
    });

    test('Voting Page - Dark', async ({ page }) => {
      await page.goto('/voting');
      await page.waitForSelector('.voting-container, h1', { timeout: 5000 });
      await percySnapshot(page, 'Voting - Dark Mode', {
        widths: [375, 768, 1280],
      });
    });
  });

  test.describe('Component States', () => {
    test('Activity Card - All States', async ({ page }) => {
      await page.goto('/itinerary');
      await page.waitForSelector('.activity-card', { timeout: 5000 });

      // Capture default state
      await percySnapshot(page, 'Activity Card - Default State', {
        widths: [375, 768],
        scope: '.activity-card:first-child',
      });

      // Hover state (if interactive)
      const firstCard = page.locator('.activity-card').first();
      await firstCard.hover();
      await page.waitForTimeout(200);
      await percySnapshot(page, 'Activity Card - Hover State', {
        widths: [375, 768],
        scope: '.activity-card:first-child',
      });
    });

    test('City Color Accents', async ({ page }) => {
      await page.goto('/itinerary');
      await page.waitForSelector('[data-city="shanghai"], .activity-card', { timeout: 5000 });
      await page.waitForTimeout(500);

      // Capture cards with different city colors to verify color system
      await percySnapshot(page, 'City Colors - Shanghai', {
        widths: [768],
        scope: '[data-city="shanghai"]',
      });
    });

    test('Blind Budget Form', async ({ page }) => {
      await page.goto('/budget');
      await page.waitForSelector('.blind-budget-form, form', { timeout: 5000 });

      await percySnapshot(page, 'Blind Budget - Empty State', {
        widths: [375, 768],
      });

      // Fill in budget (if form exists)
      const input = page.locator('input[type="number"]').first();
      if (await input.count() > 0) {
        await input.fill('3000');
        await page.waitForTimeout(200);
        await percySnapshot(page, 'Blind Budget - Filled State', {
          widths: [375, 768],
        });
      }
    });
  });

  test.describe('Responsive Layouts', () => {
    test('Mobile Navigation', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForSelector('nav, header', { timeout: 5000 });

      await percySnapshot(page, 'Mobile Navigation - Closed', {
        widths: [375],
      });

      // Open mobile menu (if hamburger exists)
      const menuButton = page.locator('[aria-label*="menu"], button[aria-expanded]').first();
      if (await menuButton.count() > 0) {
        await menuButton.click();
        await page.waitForTimeout(300);
        await percySnapshot(page, 'Mobile Navigation - Open', {
          widths: [375],
        });
      }
    });

    test('Tablet Layout', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/itinerary');
      await page.waitForSelector('.day-timeline, main', { timeout: 5000 });

      await percySnapshot(page, 'Tablet Layout - Itinerary', {
        widths: [768],
      });
    });
  });
});
