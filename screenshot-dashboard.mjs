import { chromium } from 'playwright';

const SCREENSHOTS_DIR = './screenshots';
const BASE_URL = 'http://localhost:3100';

async function run() {
  const browser = await chromium.launch({ headless: true });

  // Desktop viewport
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: 'light',
  });
  const desktopPage = await desktopContext.newPage();

  console.log('Taking desktop light mode screenshots...');
  await desktopPage.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await desktopPage.waitForTimeout(3000); // wait for animations and hydration

  // Full page screenshot
  await desktopPage.screenshot({
    path: `${SCREENSHOTS_DIR}/01-dashboard-desktop-light-full.png`,
    fullPage: true,
  });

  // Viewport only screenshot
  await desktopPage.screenshot({
    path: `${SCREENSHOTS_DIR}/02-dashboard-desktop-light-viewport.png`,
    fullPage: false,
  });

  // Hero/header area
  const heroArea = await desktopPage.$('.dashboard-container') || await desktopPage.$('main');
  if (heroArea) {
    await heroArea.screenshot({
      path: `${SCREENSHOTS_DIR}/03-dashboard-hero-area.png`,
    });
  }

  // Dark mode
  console.log('Taking desktop dark mode screenshots...');
  const darkContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
  });
  const darkPage = await darkContext.newPage();
  await darkPage.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await darkPage.waitForTimeout(3000);

  // Toggle to dark mode if not already dark (respects prefers-color-scheme)
  try {
    const isDark = await darkPage.evaluate(() => document.documentElement.getAttribute('data-theme') === 'dark');
    if (!isDark) {
      const themeToggle = await darkPage.$('button[aria-label*="theme"], button[aria-label*="Theme"], button[aria-label*="dark"], button[aria-label*="mode"], [data-testid="theme-toggle"]');
      if (themeToggle) {
        await themeToggle.click();
        await darkPage.waitForTimeout(1000);
      }
    } else {
      console.log('Page already in dark mode via prefers-color-scheme');
    }
  } catch {
    console.log('Could not find theme toggle, using OS dark mode preference');
  }

  await darkPage.screenshot({
    path: `${SCREENSHOTS_DIR}/04-dashboard-desktop-dark-full.png`,
    fullPage: true,
  });

  await darkPage.screenshot({
    path: `${SCREENSHOTS_DIR}/05-dashboard-desktop-dark-viewport.png`,
    fullPage: false,
  });

  // Tablet viewport
  console.log('Taking tablet screenshots...');
  const tabletContext = await browser.newContext({
    viewport: { width: 768, height: 1024 },
    deviceScaleFactor: 2,
    colorScheme: 'light',
  });
  const tabletPage = await tabletContext.newPage();
  await tabletPage.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await tabletPage.waitForTimeout(3000);

  await tabletPage.screenshot({
    path: `${SCREENSHOTS_DIR}/06-dashboard-tablet-full.png`,
    fullPage: true,
  });

  await tabletPage.screenshot({
    path: `${SCREENSHOTS_DIR}/07-dashboard-tablet-viewport.png`,
    fullPage: false,
  });

  // Mobile viewport
  console.log('Taking mobile screenshots...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    colorScheme: 'light',
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await mobilePage.waitForTimeout(3000);

  await mobilePage.screenshot({
    path: `${SCREENSHOTS_DIR}/08-dashboard-mobile-full.png`,
    fullPage: true,
  });

  await mobilePage.screenshot({
    path: `${SCREENSHOTS_DIR}/09-dashboard-mobile-viewport.png`,
    fullPage: false,
  });

  // Scroll down on mobile to capture more sections
  await mobilePage.evaluate(() => window.scrollBy(0, 800));
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({
    path: `${SCREENSHOTS_DIR}/10-dashboard-mobile-scrolled.png`,
    fullPage: false,
  });

  // Wide desktop (1920)
  console.log('Taking wide desktop screenshots...');
  const wideContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
  });
  const widePage = await wideContext.newPage();
  await widePage.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await widePage.waitForTimeout(3000);

  await widePage.screenshot({
    path: `${SCREENSHOTS_DIR}/11-dashboard-wide-desktop-full.png`,
    fullPage: true,
  });

  await widePage.screenshot({
    path: `${SCREENSHOTS_DIR}/12-dashboard-wide-desktop-viewport.png`,
    fullPage: false,
  });

  console.log('All screenshots taken!');
  await browser.close();
}

run().catch(console.error);
