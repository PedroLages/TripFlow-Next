import { test, expect } from '@playwright/test';

test.describe('Landing Page Navigation', () => {
  test('should load landing page with all elements', async ({ page }) => {
    console.log('=== Testing Landing Page Load ===');
    await page.goto('/', { waitUntil: 'networkidle' });

    // Verify page loaded
    console.log('Page URL:', page.url());
    expect(page.url()).toContain('localhost:3001');

    // Check hero section
    const heroHeading = page.getByRole('heading', { name: /Plan Group Trips.*Without the Chaos/i });
    await expect(heroHeading).toBeVisible();
    console.log('✓ Hero heading visible');

    // Check tagline
    const tagline = page.getByText(/all-in-one platform for group travel planning/i);
    await expect(tagline).toBeVisible();
    console.log('✓ Tagline visible');

    // Check header navigation links exist
    const featuresLink = page.getByRole('link', { name: 'Features' });
    const pricingLink = page.getByRole('link', { name: 'Pricing' });
    const loginLink = page.getByRole('link', { name: 'Login', exact: false }).first();
    const signupLink = page.getByRole('link', { name: 'Sign Up' }).first();

    await expect(featuresLink).toBeVisible();
    await expect(pricingLink).toBeVisible();
    await expect(loginLink).toBeVisible();
    await expect(signupLink).toBeVisible();
    console.log('✓ Header navigation links visible');

    // Check CTA buttons
    const startPlanningBtn = page.getByRole('link', { name: /Start Planning Free/i });
    const seeHowItWorksBtn = page.getByRole('link', { name: /See How It Works/i });

    await expect(startPlanningBtn).toBeVisible();
    await expect(seeHowItWorksBtn).toBeVisible();
    console.log('✓ CTA buttons visible');

    // Check features section
    const featuresHeading = page.getByRole('heading', { name: /Everything you need to plan together/i });
    await expect(featuresHeading).toBeVisible();
    console.log('✓ Features section visible');

    // Check footer
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    console.log('✓ Footer visible');
  });

  test('should navigate to login page from header', async ({ page }) => {
    console.log('\n=== Testing Login Navigation ===');
    await page.goto('/');

    // Click Login in header
    const loginLink = page.getByRole('link', { name: 'Login' }).first();
    await loginLink.click();

    // Wait for navigation
    await page.waitForURL('**/login', { timeout: 5000 });
    console.log('Navigated to:', page.url());

    // Verify we're on login page
    expect(page.url()).toContain('/login');
    expect(page.url()).not.toContain('/auth/login'); // Route group should NOT appear in URL
    console.log('✓ Correct URL: /login (not /auth/login)');

    // Check login form exists
    const emailInput = page.getByPlaceholder(/you@example.com/i);
    const passwordInput = page.getByPlaceholder(/••••••••/i);
    const submitButton = page.getByRole('button', { name: /Log in/i });

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    console.log('✓ Login form elements visible');
  });

  test('should navigate to signup page from header', async ({ page }) => {
    console.log('\n=== Testing Signup Navigation from Header ===');
    await page.goto('/');

    // Click Sign Up in header
    const signupLink = page.getByRole('link', { name: 'Sign Up' }).first();
    await signupLink.click();

    // Wait for navigation
    await page.waitForURL('**/signup', { timeout: 5000 });
    console.log('Navigated to:', page.url());

    // Verify we're on signup page
    expect(page.url()).toContain('/signup');
    expect(page.url()).not.toContain('/auth/signup'); // Route group should NOT appear in URL
    console.log('✓ Correct URL: /signup (not /auth/signup)');

    // Check signup form exists
    const nameInput = page.getByPlaceholder(/John Doe/i);
    const emailInput = page.getByPlaceholder(/you@example.com/i);
    const createAccountBtn = page.getByRole('button', { name: /Create Account/i });

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(createAccountBtn).toBeVisible();
    console.log('✓ Signup form elements visible');
  });

  test('should navigate to signup page from "Start Planning Free" button', async ({ page }) => {
    console.log('\n=== Testing "Start Planning Free" CTA ===');
    await page.goto('/');

    // Click "Start Planning Free" button
    const startPlanningBtn = page.getByRole('link', { name: /Start Planning Free/i }).first();
    await startPlanningBtn.click();

    // Wait for navigation
    await page.waitForURL('**/signup', { timeout: 5000 });
    console.log('Navigated to:', page.url());

    // Verify we're on signup page
    expect(page.url()).toContain('/signup');
    console.log('✓ "Start Planning Free" redirects to /signup');
  });

  test('should navigate to signup from footer CTA', async ({ page }) => {
    console.log('\n=== Testing Footer CTA ===');
    await page.goto('/');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Click "Get Started Free" button in footer
    const getStartedBtn = page.getByRole('link', { name: /Get Started Free/i });
    await getStartedBtn.click();

    // Wait for navigation
    await page.waitForURL('**/signup', { timeout: 5000 });
    console.log('Navigated to:', page.url());

    // Verify we're on signup page
    expect(page.url()).toContain('/signup');
    console.log('✓ Footer CTA redirects to /signup');
  });

  test('should have working anchor links for Features section', async ({ page }) => {
    console.log('\n=== Testing Anchor Links ===');
    await page.goto('/');

    // Click Features anchor link
    const featuresAnchorLink = page.getByRole('link', { name: 'Features', exact: true });
    await featuresAnchorLink.click();

    // Wait a moment for smooth scroll
    await page.waitForTimeout(500);

    // Verify we're still on homepage but scrolled to features
    expect(page.url()).toContain('/#features');
    console.log('✓ Features anchor link works');
  });

  test('should cross-navigate between login and signup pages', async ({ page }) => {
    console.log('\n=== Testing Login ↔ Signup Cross-Navigation ===');

    // Start at login page
    await page.goto('/login');

    // Click "Sign up" link in login form
    const signupLinkInLogin = page.getByRole('link', { name: /Sign up/i });
    await signupLinkInLogin.click();

    // Verify we're on signup page
    await page.waitForURL('**/signup', { timeout: 5000 });
    expect(page.url()).toContain('/signup');
    console.log('✓ Login → Signup navigation works');

    // Click "Log in" link in signup form
    const loginLinkInSignup = page.getByRole('link', { name: /Log in/i });
    await loginLinkInSignup.click();

    // Verify we're back on login page
    await page.waitForURL('**/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
    console.log('✓ Signup → Login navigation works');
  });

  test('should NOT have /auth/ in any URLs (route group verification)', async ({ page }) => {
    console.log('\n=== Testing Route Group URL Structure ===');

    const urlsToTest = ['/login', '/signup'];

    for (const url of urlsToTest) {
      await page.goto(url);
      const currentUrl = page.url();

      // Verify route group doesn't appear in URL
      expect(currentUrl).not.toContain('/auth/');
      console.log(`✓ ${url} → ${currentUrl} (no /auth/ prefix)`);
    }
  });

  test('should display all feature cards', async ({ page }) => {
    console.log('\n=== Testing Feature Cards ===');
    await page.goto('/');

    // Scroll to features section
    const featuresSection = page.locator('#features');
    await featuresSection.scrollIntoViewIfNeeded();

    // Check for feature card titles
    const expectedFeatures = [
      'Collaborative Itinerary',
      'Democratic Voting',
      'Blind Budgeting',
      'Smart Scheduling',
      'Expense Splitting',
      'Task Assignment'
    ];

    for (const feature of expectedFeatures) {
      const featureCard = page.getByRole('heading', { name: feature });
      await expect(featureCard).toBeVisible();
      console.log(`✓ Feature card visible: ${feature}`);
    }
  });
});
