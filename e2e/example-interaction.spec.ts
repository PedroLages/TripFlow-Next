import { test, expect } from '@playwright/test';

/**
 * Example E2E test demonstrating visible mouse clicks, keyboard input,
 * and text assertions. Uses the TripFlow dashboard and trip detail pages.
 *
 * This test exercises:
 *  - Page navigation with real clicks
 *  - Keyboard typing into an input field
 *  - Visible text assertions
 *  - Theme toggle interaction
 */
test.describe('Example: Visible Interaction Flow', () => {
  test('dashboard loads, navigate to trip, interact with task input', async ({ page }) => {
    // 1. Open the dashboard
    await page.goto('/', { waitUntil: 'networkidle' });

    // 2. Verify the dashboard greeting is visible
    await expect(page.locator('text=Good')).toBeVisible({ timeout: 10_000 });

    // 3. Click on the first trip card to navigate to trip detail
    const tripCard = page.locator('a[href*="/trips/"]').first();
    await expect(tripCard).toBeVisible();
    await tripCard.click();

    // 4. Wait for the trip detail page to load
    await page.waitForURL('**/trips/**', { timeout: 10_000 });

    // 5. Verify trip title is visible
    await expect(page.locator('h1, h2').first()).toBeVisible();

    // 6. Find the task input and type into it with realistic keystrokes
    const taskInput = page.getByPlaceholder(/add.*task|new.*task|task/i);
    if (await taskInput.count() > 0) {
      await taskInput.click();
      await taskInput.fill('');
      await taskInput.pressSequentially('Book airport transfer', { delay: 50 });
      await expect(taskInput).toHaveValue('Book airport transfer');

      // 7. Press Enter to submit
      await taskInput.press('Enter');
    }

    // 8. Click the theme toggle button to verify interactive buttons work
    const themeToggle = page.locator('button').filter({ hasText: /theme|dark|light/i }).first();
    if (await themeToggle.count() > 0) {
      await themeToggle.click();
    }

    // 9. Navigate back to dashboard via sidebar link
    const dashboardLink = page.locator('a[href="/"], nav a').filter({ hasText: /dashboard|home/i }).first();
    if (await dashboardLink.count() > 0) {
      await dashboardLink.click();
      await page.waitForURL('/', { timeout: 10_000 });
      await expect(page.locator('text=Good')).toBeVisible();
    }
  });
});
