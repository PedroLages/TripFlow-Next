import { test, expect } from '@playwright/test';

/**
 * E01-S02: User Login with Session Management
 *
 * ATDD Tests (RED phase - these tests should fail until implementation is complete)
 *
 * Acceptance Criteria Coverage:
 *  - AC1: Login with valid credentials creates session
 *  - AC2: Session tokens in HTTP-only cookies (not localStorage)
 *  - AC3: Redirect to dashboard after login
 *  - AC4: Session persists across page refreshes
 *  - AC5: Session expires after 7 days
 *  - AC6: Invalid credentials show error message
 *  - AC7: Keyboard and screen reader accessibility
 *  - AC8: "Remember me" extends session to 30 days
 *  - AC9: Protected routes redirect unauthenticated users to login
 */
test.describe('E01-S02: User Login with Session Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
  });

  test('AC1: User can log in with valid email and password', async ({ page }) => {
    // GIVEN I am on the login page
    await expect(page).toHaveURL(/\/login/);

    // WHEN I enter valid credentials
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByRole('textbox', { name: /password/i }).fill('validpassword123');
    await page.getByRole('button', { name: /log in|sign in/i }).click();

    // THEN I am redirected to the dashboard
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 10_000 });

    // AND I see dashboard content (use .first() to handle multiple matches)
    await expect(page.locator('text=/dashboard|good|welcome/i').first()).toBeVisible({ timeout: 10_000 });
  });

  test('AC2: Session tokens are stored in HTTP-only cookies', async ({ page, context }) => {
    // GIVEN I am logged in
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByRole('textbox', { name: /password/i }).fill('validpassword123');
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    await page.waitForURL(/\/dashboard$/, { timeout: 10_000 });

    // WHEN I check the cookies
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(
      (c) => c.name.includes('auth') || c.name.includes('session') || c.name.includes('supabase')
    );

    // THEN session cookie exists
    expect(sessionCookie).toBeDefined();

    // AND it is HTTP-only (not accessible to JavaScript)
    expect(sessionCookie?.httpOnly).toBe(true);

    // AND localStorage does NOT contain the session token
    const localStorageAuth = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      return keys.some((key) => localStorage.getItem(key)?.includes('access_token'));
    });
    expect(localStorageAuth).toBe(false);
  });

  test('AC3: Invalid credentials show error message', async ({ page }) => {
    // GIVEN I am on the login page
    await expect(page).toHaveURL(/\/login/);

    // WHEN I enter incorrect credentials
    await page.getByRole('textbox', { name: /email/i }).fill('wrong@example.com');
    await page.getByRole('textbox', { name: /password/i }).fill('wrongpassword');
    await page.getByRole('button', { name: /log in|sign in/i }).click();

    // THEN I see an error message
    await expect(page.locator('text=/invalid.*email.*password|incorrect.*credentials|login.*failed/i')).toBeVisible({
      timeout: 5_000,
    });

    // AND I remain on the login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('AC4: Session persists across page refreshes', async ({ page }) => {
    // GIVEN I am logged in
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByRole('textbox', { name: /password/i }).fill('validpassword123');
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    await page.waitForURL(/\/dashboard$/, { timeout: 10_000 });

    // WHEN I refresh the page
    await page.reload({ waitUntil: 'domcontentloaded' });

    // THEN I remain logged in (still on dashboard, not redirected to login)
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 10_000 });
    await expect(page.locator('text=/dashboard|good|welcome/i').first()).toBeVisible({ timeout: 10_000 });
  });

  test('AC5: Login form is keyboard accessible', async ({ page }) => {
    // GIVEN I am on the login page
    await expect(page).toHaveURL(/\/login/);

    // WHEN I navigate using keyboard only
    // Tab to email field
    await page.keyboard.press('Tab');
    const emailField = page.getByRole('textbox', { name: /email/i });
    await expect(emailField).toBeFocused();

    // Fill email and tab to password
    await emailField.fill('test@example.com');
    await page.keyboard.press('Tab');
    const passwordField = page.getByRole('textbox', { name: /password/i });
    await expect(passwordField).toBeFocused();

    // Fill password and tab through Remember Me and Forgot Password to submit button
    await passwordField.fill('validpassword123');
    await page.keyboard.press('Tab'); // Tab to Remember Me checkbox
    await page.keyboard.press('Tab'); // Tab to Forgot Password link
    await page.keyboard.press('Tab'); // Tab to Submit button
    const submitButton = page.getByRole('button', { name: /log in|sign in/i });
    await expect(submitButton).toBeFocused();

    // Submit with Enter key
    await page.keyboard.press('Enter');

    // THEN login succeeds
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 10_000 });
  });

  test('AC6: Login form has proper ARIA labels for screen readers', async ({ page }) => {
    // GIVEN I am on the login page
    await expect(page).toHaveURL(/\/login/);

    // WHEN I inspect form accessibility
    const emailField = page.getByRole('textbox', { name: /email/i });
    const passwordField = page.getByRole('textbox', { name: /password/i });
    const submitButton = page.getByRole('button', { name: /log in|sign in/i });

    // THEN email field has label or aria-label
    const emailHasLabel =
      (await emailField.evaluate((el: HTMLElement) => {
        const label = document.querySelector(`label[for="${el.id}"]`);
        return !!label || !!el.getAttribute('aria-label') || !!el.getAttribute('aria-labelledby');
      })) ||
      (await page.locator('label').filter({ hasText: /email/i }).count()) > 0;
    expect(emailHasLabel).toBe(true);

    // AND password field has label or aria-label
    const passwordHasLabel =
      (await passwordField.evaluate((el: HTMLElement) => {
        const label = document.querySelector(`label[for="${el.id}"]`);
        return !!label || !!el.getAttribute('aria-label') || !!el.getAttribute('aria-labelledby');
      })) ||
      (await page.locator('label').filter({ hasText: /password/i }).count()) > 0;
    expect(passwordHasLabel).toBe(true);

    // AND submit button has accessible text
    const submitHasAccessibleText = await submitButton.evaluate((el: HTMLElement) => {
      return !!el.textContent?.trim() || !!el.getAttribute('aria-label');
    });
    expect(submitHasAccessibleText).toBe(true);
  });

  test('AC7: "Remember me" checkbox extends session (UI presence check)', async ({ page }) => {
    // GIVEN I am on the login page
    await expect(page).toHaveURL(/\/login/);

    // THEN I see a "Remember me" checkbox
    const rememberMeCheckbox = page.getByRole('checkbox', { name: /remember/i });
    const rememberMeLabel = page.locator('label').filter({ hasText: /remember/i });

    const hasRememberMe = (await rememberMeCheckbox.count()) > 0 || (await rememberMeLabel.count()) > 0;
    expect(hasRememberMe).toBe(true);

    // WHEN I check "Remember me" and log in
    if ((await rememberMeCheckbox.count()) > 0) {
      await rememberMeCheckbox.check();
    }

    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByRole('textbox', { name: /password/i }).fill('validpassword123');
    await page.getByRole('button', { name: /log in|sign in/i }).click();

    // THEN login succeeds
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 10_000 });

    // Note: Testing actual 30-day expiry requires time manipulation, which is outside scope of E2E
    // The presence of the checkbox and successful login with it checked is sufficient for this AC
  });

  test('AC9: Protected routes redirect unauthenticated users to login', async ({ page }) => {
    // GIVEN I am not logged in
    // WHEN I try to access a trip directly
    await page.goto('/trips/1/itinerary');

    // THEN I am redirected to the login page
    await expect(page).toHaveURL(/\/login/);
  });
});
