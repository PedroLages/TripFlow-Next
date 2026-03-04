import { test, expect } from '@playwright/test';

test('Navigate from homepage and test login', async ({ page }) => {
  // Start at homepage
  console.log('=== Navigating to homepage ===');
  await page.goto('/', { waitUntil: 'networkidle' });

  // Capture homepage state
  console.log('Page Title:', await page.title());
  console.log('Page URL:', page.url());

  // Find all links on the page
  const links = await page.$$eval('a', anchors =>
    anchors.map(a => ({
      text: a.textContent?.trim(),
      href: a.href,
      visible: a.offsetParent !== null
    }))
  );

  console.log('\n=== All links on homepage ===');
  links.forEach((link, i) => {
    if (link.visible) {
      console.log(`${i + 1}. Text: "${link.text}" → ${link.href}`);
    }
  });

  // Look for login/auth buttons
  console.log('\n=== Looking for login/auth links ===');
  const authLinks = links.filter(link =>
    link.href.includes('login') ||
    link.href.includes('auth') ||
    link.text?.toLowerCase().includes('login') ||
    link.text?.toLowerCase().includes('sign in')
  );

  if (authLinks.length > 0) {
    console.log('Found auth-related links:');
    authLinks.forEach(link => {
      console.log(`  - "${link.text}" → ${link.href}`);
    });

    // Click the first login link found
    const firstLoginLink = authLinks[0];
    console.log(`\n=== Clicking: "${firstLoginLink.text}" ===`);

    const linkElement = page.locator(`a[href*="${firstLoginLink.href.split('/').pop()}"]`).first();
    await linkElement.click();

    // Wait for navigation
    await page.waitForLoadState('networkidle');
    console.log('After click, URL:', page.url());

    // Check if we're on an error page
    const bodyText = await page.locator('body').textContent();
    if (bodyText?.includes('error') || bodyText?.includes('not found')) {
      console.log('ERROR PAGE DETECTED!');
      console.log('Page content:', bodyText);
    }
  } else {
    console.log('No login/auth links found on homepage');
  }

  // Now go directly to /login and test
  console.log('\n=== Testing direct login at /login ===');
  await page.goto('/login');
  console.log('Login page URL:', page.url());

  // Fill login form
  await page.fill('input[type="email"], input[name="email"]', 'test@example.com');
  await page.fill('input[type="password"], input[name="password"]', 'validpassword123');
  await page.click('button[type="submit"]');

  // Wait for redirect
  await page.waitForURL(/\/dashboard|^\/$/, { timeout: 10_000 });
  console.log('After login, URL:', page.url());
  console.log('Login successful! ✓');

  // Check cookies
  const cookies = await page.context().cookies();
  const authCookies = cookies.filter(c =>
    c.name.includes('sb-') ||
    c.name.includes('auth') ||
    c.name.includes('supabase')
  );

  console.log('\n=== Auth Cookies ===');
  authCookies.forEach(c => {
    console.log(`  ${c.name}: HttpOnly=${c.httpOnly}, Secure=${c.secure}`);
  });
});
