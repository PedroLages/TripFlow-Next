import { test, expect } from '@playwright/test';

test('debug: capture page state', async ({ page }) => {
  const logs: string[] = [];
  const errors: string[] = [];

  page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => errors.push(err.message));

  await page.goto('/trips/1/itinerary', { waitUntil: 'networkidle', timeout: 30000 });

  // Wait a bit for React hydration
  await page.waitForTimeout(5000);

  // Capture page content
  const html = await page.content();
  const bodyText = await page.locator('body').innerText();
  const hasItinerary = html.includes('itinerary-container');
  const title = await page.title();

  console.log('=== PAGE TITLE ===');
  console.log(title);
  console.log('=== BODY TEXT (first 500 chars) ===');
  console.log(bodyText.substring(0, 500));
  console.log('=== HAS .itinerary-container ===');
  console.log(hasItinerary);
  console.log('=== CONSOLE ERRORS ===');
  errors.forEach(e => console.log(e));
  console.log('=== CONSOLE LOGS (last 20) ===');
  logs.slice(-20).forEach(l => console.log(l));
  console.log('=== HTML BODY CLASSES ===');
  const bodyClasses = await page.locator('body').getAttribute('class');
  console.log(bodyClasses);
  console.log('=== ALL TOP-LEVEL DIVS ===');
  const topDivs = await page.locator('body > *').evaluateAll(els =>
    els.map(el => `<${el.tagName.toLowerCase()} class="${el.className}">`)
  );
  topDivs.forEach(d => console.log(d));

  // Take screenshot
  await page.screenshot({ path: '/tmp/playwright-debug.png', fullPage: true });

  expect(true).toBe(true); // Always pass - just want the output
});
