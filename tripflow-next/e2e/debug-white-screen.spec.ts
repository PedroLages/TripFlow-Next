import { test } from '@playwright/test';

test('capture console errors on white screen', async ({ page }) => {
  const consoleMessages: string[] = [];
  const errors: string[] = [];

  // Capture console messages
  page.on('console', msg => {
    const text = `[${msg.type()}] ${msg.text()}`;
    consoleMessages.push(text);
    console.log(text);
  });

  // Capture page errors
  page.on('pageerror', error => {
    const text = `PAGE ERROR: ${error.message}\n${error.stack}`;
    errors.push(text);
    console.log(text);
  });

  // Navigate to homepage
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 10000 });

  // Wait a bit for any errors to surface
  await page.waitForTimeout(2000);

  // Take a screenshot
  await page.screenshot({ path: '/tmp/white-screen-debug.png', fullPage: true });

  // Print summary
  console.log('\n=== CONSOLE MESSAGES ===');
  consoleMessages.forEach(msg => console.log(msg));

  console.log('\n=== ERRORS ===');
  errors.forEach(err => console.log(err));

  console.log('\n=== PAGE TITLE ===');
  console.log(await page.title());

  console.log('\n=== PAGE HTML (first 500 chars) ===');
  const html = await page.content();
  console.log(html.substring(0, 500));
});
