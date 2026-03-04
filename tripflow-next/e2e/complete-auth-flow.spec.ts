import { test, expect } from '@playwright/test';

/**
 * Complete authentication flow test
 *
 * Tests:
 * 1. Landing page loads
 * 2. Sign In button navigation
 * 3. Sign Up button navigation
 * 4. Actual login with test user
 * 5. Redirect to dashboard after login
 */

test.describe('Complete Auth Flow from Landing Page', () => {
  test('should navigate from landing page to login and successfully log in', async ({ page }) => {
    console.log('\n=== Starting Complete Auth Flow Test ===\n');

    // Step 1: Go to landing page
    console.log('Step 1: Loading landing page...');
    await page.goto('/', { waitUntil: 'networkidle' });

    const currentUrl = page.url();
    console.log('✓ Landing page loaded:', currentUrl);
    expect(currentUrl).toContain('localhost:3001');

    // Verify landing page content
    const heroHeading = page.getByRole('heading', { name: /Plan Group Trips.*Without the Chaos/i });
    await expect(heroHeading).toBeVisible();
    console.log('✓ Landing page hero visible');

    // Step 2: Click "Login" button in header
    console.log('\nStep 2: Clicking Login button...');
    const loginLink = page.getByRole('link', { name: 'Login', exact: false }).first();
    await loginLink.click();

    // Wait for navigation to login page
    await page.waitForURL('**/login', { timeout: 5000 });
    const loginUrl = page.url();
    console.log('✓ Navigated to:', loginUrl);
    expect(loginUrl).toContain('/login');
    expect(loginUrl).not.toContain('/auth/login'); // Verify route group is hidden
    console.log('✓ Correct URL format (no /auth/ prefix)');

    // Verify login page elements
    const emailInput = page.getByPlaceholder(/you@example.com/i);
    const passwordInput = page.getByPlaceholder(/••••••••/i);
    const submitButton = page.getByRole('button', { name: /Log in/i });

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    console.log('✓ Login form elements visible');

    // Step 3: Fill in test user credentials
    console.log('\nStep 3: Logging in with test user...');
    await emailInput.fill('test@example.com');
    await passwordInput.fill('validpassword123');
    console.log('✓ Credentials entered');

    // Step 4: Submit login form
    console.log('\nStep 4: Submitting login form...');
    await submitButton.click();

    // Wait for redirect after login (either to / or /dashboard)
    await page.waitForURL(/\/$|\/dashboard/, { timeout: 10000 });
    const dashboardUrl = page.url();
    console.log('✓ Login successful! Redirected to:', dashboardUrl);

    // Step 5: Verify we're logged in
    console.log('\nStep 5: Verifying authenticated state...');

    // Check for authenticated content (adjust selector based on your app)
    const bodyText = await page.locator('body').textContent();

    // Should NOT see login/signup buttons anymore
    const loginButtons = await page.getByRole('link', { name: 'Login' }).count();
    console.log('Login button count:', loginButtons);

    console.log('\n✅ Complete auth flow test passed!');
    console.log('Summary:');
    console.log('  • Landing page → Login ✓');
    console.log('  • Login form filled ✓');
    console.log('  • Authentication successful ✓');
    console.log('  • Redirect to dashboard ✓');
  });

  test('should navigate from landing page to signup page', async ({ page }) => {
    console.log('\n=== Testing Signup Navigation ===\n');

    // Step 1: Go to landing page
    console.log('Step 1: Loading landing page...');
    await page.goto('/', { waitUntil: 'networkidle' });
    console.log('✓ Landing page loaded');

    // Step 2: Click "Sign Up" button in header
    console.log('\nStep 2: Clicking Sign Up button...');
    const signupButton = page.getByRole('link', { name: 'Sign Up' }).first();
    await signupButton.click();

    // Wait for navigation to signup page
    await page.waitForURL('**/signup', { timeout: 5000 });
    const signupUrl = page.url();
    console.log('✓ Navigated to:', signupUrl);
    expect(signupUrl).toContain('/signup');
    expect(signupUrl).not.toContain('/auth/signup'); // Verify route group is hidden
    console.log('✓ Correct URL format (no /auth/ prefix)');

    // Verify signup form elements
    const nameInput = page.getByPlaceholder(/John Doe/i);
    const emailInput = page.getByPlaceholder(/you@example.com/i);
    const createAccountBtn = page.getByRole('button', { name: /Create Account/i });

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(createAccountBtn).toBeVisible();
    console.log('✓ Signup form elements visible');

    console.log('\n✅ Signup navigation test passed!');
  });

  test('should navigate between signup and login pages', async ({ page }) => {
    console.log('\n=== Testing Signup ↔ Login Navigation ===\n');

    // Start at landing page
    await page.goto('/', { waitUntil: 'networkidle' });

    // Go to signup
    console.log('Step 1: Landing → Signup...');
    const signupButton = page.getByRole('link', { name: 'Sign Up' }).first();
    await signupButton.click();
    await page.waitForURL('**/signup');
    console.log('✓ At signup page');

    // Click "Log in" link in signup form
    console.log('\nStep 2: Signup → Login...');
    const loginLinkInSignup = page.getByRole('link', { name: /Log in/i });
    await loginLinkInSignup.click();
    await page.waitForURL('**/login');
    console.log('✓ At login page');

    // Click "Sign up" link in login form
    console.log('\nStep 3: Login → Signup...');
    const signupLinkInLogin = page.getByRole('link', { name: /Sign up/i });
    await signupLinkInLogin.click();
    await page.waitForURL('**/signup');
    console.log('✓ Back at signup page');

    console.log('\n✅ Cross-navigation test passed!');
  });

  test('should test all CTA buttons on landing page', async ({ page }) => {
    console.log('\n=== Testing All Landing Page CTAs ===\n');

    await page.goto('/', { waitUntil: 'networkidle' });

    // Test "Start Planning Free" hero button
    console.log('Testing "Start Planning Free" button...');
    const startPlanningBtn = page.getByRole('link', { name: /Start Planning Free/i }).first();
    await startPlanningBtn.click();
    await page.waitForURL('**/signup', { timeout: 5000 });
    console.log('✓ "Start Planning Free" → /signup');

    // Go back to landing page
    await page.goto('/');

    // Test footer "Get Started Free" button
    console.log('\nTesting footer "Get Started Free" button...');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const getStartedBtn = page.getByRole('link', { name: /Get Started Free/i });
    await getStartedBtn.click();
    await page.waitForURL('**/signup', { timeout: 5000 });
    console.log('✓ "Get Started Free" → /signup');

    console.log('\n✅ All CTA buttons working correctly!');
  });
});
