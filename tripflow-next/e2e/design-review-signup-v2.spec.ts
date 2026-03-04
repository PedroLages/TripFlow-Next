import { test, expect } from '@playwright/test';
import * as path from 'path';

const screenshotDir = path.join(process.cwd(), 'design-review-screenshots');

test.describe('Signup Page - Design Review V2', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');
  });

  test('Capture all key states', async ({ page }) => {
    // Desktop initial
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${screenshotDir}/01-desktop-initial.png`, fullPage: true });

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${screenshotDir}/02-mobile-375.png`, fullPage: true });

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${screenshotDir}/03-tablet-768.png`, fullPage: true });

    // Back to desktop for interactions
    await page.setViewportSize({ width: 1440, height: 900 });

    // Focus states
    await page.click('#name');
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${screenshotDir}/04-name-focused.png` });

    // Validation errors
    await page.click('button[type="submit"]');
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${screenshotDir}/05-validation-errors.png`, fullPage: true });

    // Password mismatch
    await page.fill('#name', 'John Doe');
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password123');
    await page.fill('#confirmPassword', 'different123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${screenshotDir}/06-password-mismatch.png`, fullPage: true });

    // Dark mode
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${screenshotDir}/07-dark-mode.png`, fullPage: true });

    console.log(`Screenshots saved to: ${screenshotDir}`);
  });
});
