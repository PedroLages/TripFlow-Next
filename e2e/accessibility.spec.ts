import { test, expect } from '@playwright/test'

test.describe('Keyboard Navigation', () => {
  test('can navigate AddActivityModal with keyboard only', async ({ page }) => {
    await page.goto('/trips/demo/itinerary')

    // Open modal with keyboard
    await page.keyboard.press('Tab') // Focus first interactive element
    // Navigate to "Add Activity" button (implementation-specific)
    await page.keyboard.press('Enter')

    // Verify modal is open and focused
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // Tab through form fields
    await page.keyboard.press('Tab') // Title input
    await expect(page.getByLabel('Activity Title')).toBeFocused()

    await page.keyboard.press('Tab') // Category select
    await expect(page.getByRole('combobox', { name: 'Category' })).toBeFocused()

    // Fill form with keyboard
    await page.getByLabel('Activity Title').fill('Test Activity')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Space') // Open select
    await page.keyboard.press('ArrowDown') // Navigate options
    await page.keyboard.press('Enter') // Select option

    // Submit with Enter
    await page.keyboard.press('Tab') // Navigate to submit button
    await page.keyboard.press('Enter')

    // Verify modal closes
    await expect(dialog).not.toBeVisible()
  })

  test('can close modal with Escape key', async ({ page }) => {
    await page.goto('/trips/demo/itinerary')

    // Open modal (implementation depends on page structure)
    const addButton = page.getByRole('button', { name: /add activity/i })
    await addButton.click()

    // Verify modal is open
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // Close with Escape
    await page.keyboard.press('Escape')

    // Verify modal closes
    await expect(dialog).not.toBeVisible()
  })

  test('focus trap keeps focus within modal', async ({ page }) => {
    await page.goto('/trips/demo/itinerary')

    // Open modal
    const addButton = page.getByRole('button', { name: /add activity/i })
    await addButton.click()

    // Verify modal is open
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // Tab through all focusable elements
    const focusableElements = await dialog.locator('button, input, select, textarea, [tabindex]:not([tabindex="-1"])').count()

    // Tab through all elements multiple times to test focus trap
    for (let i = 0; i < focusableElements + 2; i++) {
      await page.keyboard.press('Tab')
    }

    // Focus should still be within the dialog
    const isWithinDialog = await dialog.locator(':focus').count() > 0
    expect(isWithinDialog).toBeTruthy()
  })

  test('shift+tab navigates backwards through form', async ({ page }) => {
    await page.goto('/trips/demo/itinerary')

    // Open modal
    const addButton = page.getByRole('button', { name: /add activity/i })
    await addButton.click()

    // Verify modal is open
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // Tab forward to second field
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Shift+Tab back to first field
    await page.keyboard.press('Shift+Tab')
    await expect(page.getByLabel('Activity Title')).toBeFocused()
  })
})
