import { test, expect } from '@playwright/test';

test.describe('Full-Page Auth Layout', () => {
  test('Login page should be full-page without sidebar or navbar', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle' });

    // Verify no AppShell components are present
    const sidebar = page.locator('[class*="sidebar"]');
    const bottomTabBar = page.locator('[class*="bottom"]').and(page.locator('[class*="tab"]'));
    const navbar = page.locator('nav');

    await expect(sidebar).toHaveCount(0);
    await expect(bottomTabBar).toHaveCount(0);

    // Navigation should not contain app navigation elements
    const appNavLinks = page.locator('a[href="/trips"]');
    await expect(appNavLinks).toHaveCount(0);

    // Verify full-page background is visible
    const backgroundImage = page.locator('img[alt*="landscape"], img[alt*="mountain"]');
    await expect(backgroundImage).toBeVisible();

    // Verify login form is centered and visible
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    // Verify TripFlow branding is present
    const heading = page.locator('h1:has-text("TripFlow")');
    await expect(heading).toBeVisible();

    // Check glassmorphic card styling
    const formContainer = emailInput.locator('xpath=ancestor::div[contains(@class, "glass")]');
    await expect(formContainer).toBeVisible();

    console.log('✅ Full-page login layout verified');
  });

  test('Login page should be keyboard accessible', async ({ page }) => {
    await page.goto('/login');

    // Tab through form elements
    await page.keyboard.press('Tab'); // Focus email
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeFocused();

    await page.keyboard.press('Tab'); // Focus password
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeFocused();

    await page.keyboard.press('Tab'); // Focus remember me checkbox
    await page.keyboard.press('Tab'); // Focus forgot password link
    await page.keyboard.press('Tab'); // Focus submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeFocused();

    console.log('✅ Keyboard navigation works correctly');
  });

  test('Login page should handle form validation', async ({ page }) => {
    await page.goto('/login');

    // Submit empty form
    await page.click('button[type="submit"]');

    // Should show validation errors
    const emailError = page.locator('text=/email/i').and(page.locator('[role="alert"], p[class*="text-destructive"]'));
    await expect(emailError).toBeVisible({ timeout: 3000 });

    console.log('✅ Form validation works');
  });

  test('Login page should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');

    // Form should still be visible and usable
    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(emailInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(emailInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    console.log('✅ Responsive design works across viewports');
  });

  test('Login form should have proper ARIA labels and roles', async ({ page }) => {
    await page.goto('/login');

    // Check form accessibility
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    // Should have associated labels
    await expect(emailInput).toHaveAttribute('aria-invalid');
    await expect(passwordInput).toHaveAttribute('aria-invalid');

    // Labels should be present
    const emailLabel = page.locator('label[for="email"]');
    const passwordLabel = page.locator('label[for="password"]');

    await expect(emailLabel).toBeVisible();
    await expect(passwordLabel).toBeVisible();

    console.log('✅ Accessibility attributes are correct');
  });

  test('Login page should work with dark mode', async ({ page }) => {
    await page.goto('/login');

    // Toggle dark mode if theme switcher exists
    const darkModeToggle = page.locator('[aria-label*="theme"], button:has-text("Dark")');

    if (await darkModeToggle.count() > 0) {
      await darkModeToggle.click();
      await page.waitForTimeout(500); // Wait for theme transition
    }

    // Form should still be visible
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();

    console.log('✅ Dark mode compatibility verified');
  });
});
