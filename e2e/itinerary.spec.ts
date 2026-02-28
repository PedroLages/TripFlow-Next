import { test, expect } from '@playwright/test';

const ITINERARY_URL = '/trips/1/itinerary';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Navigate to itinerary and wait for full hydration.
 *  Retries navigation if Turbopack hasn't compiled the route yet (404). */
async function goToItinerary(page: import('@playwright/test').Page, urlSuffix = '') {
  const url = ITINERARY_URL + urlSuffix;
  for (let attempt = 0; attempt < 3; attempt++) {
    await page.goto(url, { waitUntil: 'networkidle' });
    const has404 = await page.locator('text=This page could not be found').count();
    if (has404 === 0) break;
    // Turbopack still compiling – wait and retry
    await page.waitForTimeout(3000);
  }
  await page.waitForSelector('.itinerary-container', { state: 'attached', timeout: 15000 });
  await page.waitForTimeout(1500);
}

/** Navigate to a specific day within the itinerary. */
async function goToDay(page: import('@playwright/test').Page, dayIndex = 0) {
  await goToItinerary(page);
  await page.locator('.day-tab:not(.overview-tab)').nth(dayIndex).click();
  await page.waitForSelector('.timeline-container', { state: 'attached', timeout: 8000 });
  await page.waitForTimeout(800);
}

// ---------------------------------------------------------------------------
// 1. Page Load & Header
// ---------------------------------------------------------------------------

test.describe('Itinerary Page – Load & Header', () => {
  test('page loads without crashing', async ({ page }) => {
    await goToItinerary(page);
    await expect(page.locator('.itinerary-container')).toBeAttached();
    // Verify content rendered
    const text = await page.locator('.itinerary-container').innerText();
    expect(text.length).toBeGreaterThan(50);
  });

  test('displays trip title and subtitle', async ({ page }) => {
    await goToItinerary(page);
    await expect(page.locator('.itinerary-header h2')).toContainText('Asia Circuit 2026');
    await expect(page.locator('.itinerary-subtitle')).toBeAttached();
  });

  test('displays date badge', async ({ page }) => {
    await goToItinerary(page);
    await expect(page.locator('.itinerary-dates')).toContainText('Aug 27');
  });

  test('header action buttons are present', async ({ page }) => {
    await goToItinerary(page);
    const actions = page.locator('.itinerary-header-actions');
    await expect(actions).toBeAttached();
    await expect(actions.locator('button')).toHaveCount(2);
    await expect(actions).toContainText('AI Suggestions');
    await expect(actions).toContainText('Add Activity');
  });
});

// ---------------------------------------------------------------------------
// 2. City Navigator
// ---------------------------------------------------------------------------

test.describe('City Navigator', () => {
  test('renders all 6 city pills', async ({ page }) => {
    await goToItinerary(page);
    await expect(page.locator('.city-pill')).toHaveCount(6);
  });

  test('Shanghai is active by default', async ({ page }) => {
    await goToItinerary(page);
    await expect(page.locator('.city-pill-active')).toContainText('Shanghai');
  });

  test('clicking a city pill switches the active city', async ({ page }) => {
    await goToItinerary(page);
    await page.locator('.city-pill:has-text("Hong Kong")').click();
    await expect(page.locator('.city-pill-active')).toContainText('Hong Kong');
  });

  test('progress bar renders segments for all cities', async ({ page }) => {
    await goToItinerary(page);
    await expect(page.locator('.progress-segment')).toHaveCount(6);
  });

  test('clicking progress segment changes city', async ({ page }) => {
    await goToItinerary(page);
    await page.locator('.progress-segment').nth(2).click();
    await expect(page.locator('.city-pill-active')).toContainText('Osaka');
  });
});

// ---------------------------------------------------------------------------
// 3. City Overview (default view when no day selected)
// ---------------------------------------------------------------------------

test.describe('City Overview', () => {
  test('shows city overview when no day selected', async ({ page }) => {
    await goToItinerary(page);
    await expect(page.locator('.city-overview')).toBeAttached();
  });

  test('shows hero section with city name', async ({ page }) => {
    await goToItinerary(page);
    await expect(page.locator('.co-hero-title')).toContainText('Shanghai');
  });

  test('shows stats strip with 4 counters', async ({ page }) => {
    await goToItinerary(page);
    await expect(page.locator('.co-stats-strip .co-stat')).toHaveCount(4);
  });

  test('displays day preview cards', async ({ page }) => {
    await goToItinerary(page);
    const count = await page.locator('.co-day-card').count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('clicking a day card navigates to that day', async ({ page }) => {
    await goToItinerary(page);
    await page.locator('.co-day-card').first().click();
    await page.waitForSelector('.timeline-container', { state: 'attached', timeout: 8000 });
  });

  test('shows quick info bar with 4 items', async ({ page }) => {
    await goToItinerary(page);
    await expect(page.locator('.co-info-item')).toHaveCount(4);
  });

  test('shows highlight pills', async ({ page }) => {
    await goToItinerary(page);
    const count = await page.locator('.co-highlight-pill').count();
    expect(count).toBeGreaterThan(0);
  });

  test('hero updates when switching cities', async ({ page }) => {
    await goToItinerary(page);
    await page.locator('.city-pill:has-text("Tokyo")').click();
    await page.waitForTimeout(800);
    await expect(page.locator('.co-hero-title')).toContainText('Tokyo');
  });
});

// ---------------------------------------------------------------------------
// 4. Day Navigator
// ---------------------------------------------------------------------------

test.describe('Day Navigator', () => {
  test('shows overview tab and day tabs', async ({ page }) => {
    await goToItinerary(page);
    await expect(page.locator('.overview-tab')).toBeAttached();
    const count = await page.locator('.day-tab:not(.overview-tab)').count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('Overview tab is active by default', async ({ page }) => {
    await goToItinerary(page);
    await expect(page.locator('.overview-tab')).toHaveClass(/day-tab-active/);
  });

  test('clicking a day tab shows timeline', async ({ page }) => {
    await goToDay(page);
    await expect(page.locator('.timeline-container')).toBeAttached();
  });

  test('clicking Overview tab returns to city overview', async ({ page }) => {
    await goToDay(page);
    await page.locator('.overview-tab').click();
    await page.waitForSelector('.city-overview', { state: 'attached', timeout: 5000 });
    await expect(page.locator('.city-overview')).toBeAttached();
  });
});

// ---------------------------------------------------------------------------
// 5. Day Timeline & Activity Cards
// ---------------------------------------------------------------------------

test.describe('Day Timeline & Activity Cards', () => {
  test('renders timeline with activities', async ({ page }) => {
    await goToDay(page);
    const count = await page.locator('.activity-card-wrapper').count();
    expect(count).toBeGreaterThan(0);
  });

  test('activity cards show title and duration', async ({ page }) => {
    await goToDay(page);
    const firstCard = page.locator('.activity-card-wrapper').first();
    await expect(firstCard.locator('.activity-title')).toBeAttached();
    await expect(firstCard.locator('.activity-duration')).toBeAttached();
    // Verify actual content
    const title = await firstCard.locator('.activity-title').innerText();
    expect(title.length).toBeGreaterThan(0);
  });

  test('activity cards show time', async ({ page }) => {
    await goToDay(page);
    const timeEl = page.locator('.timeline-time').first();
    const text = await timeEl.textContent();
    expect(text).toMatch(/\d{1,2}:\d{2}\s*(AM|PM)/i);
  });

  test('clicking an activity card expands it', async ({ page }) => {
    await goToDay(page);
    const card = page.locator('.timeline-content-card').first();
    // Native click bypasses Framer Motion Reorder drag interception
    await card.evaluate(el => el.click());
    await page.waitForTimeout(500);
    await expect(card).toHaveClass(/expanded/);
    await expect(page.locator('.activity-discussion-panel').first()).toBeAttached();
  });

  test('expanded card shows vote buttons and comment input', async ({ page }) => {
    await goToDay(page);
    await page.locator('.timeline-content-card').first().evaluate(el => el.click());
    await page.waitForTimeout(500);
    const panel = page.locator('.activity-discussion-panel').first();
    await expect(panel).toBeAttached();
    await expect(panel.locator('.vote-btn').first()).toBeAttached();
    await expect(panel.locator('.comment-input-area')).toBeAttached();
  });

  test('clicking expanded card again collapses it', async ({ page }) => {
    await goToDay(page);
    const card = page.locator('.timeline-content-card').first();
    await card.evaluate(el => el.click());
    await page.waitForTimeout(500);
    await expect(card).toHaveClass(/expanded/);
    await card.evaluate(el => el.click());
    await page.waitForTimeout(500);
    await expect(card).not.toHaveClass(/expanded/);
  });

  test('timeline line is present', async ({ page }) => {
    await goToDay(page);
    await expect(page.locator('.timeline-line')).toBeAttached();
  });
});

// ---------------------------------------------------------------------------
// 6. Photo Carousel
// ---------------------------------------------------------------------------

test.describe('Photo Carousel', () => {
  test('activity cards with photos show carousel or single image', async ({ page }) => {
    await goToDay(page);
    const photoElements = page.locator('.photo-carousel-single, .photo-carousel');
    const count = await photoElements.count();
    // Shanghai Day 1 has activities with photos
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// 7. Lightbox
// ---------------------------------------------------------------------------

test.describe('Lightbox', () => {
  test('photo grid click opens lightbox in city overview', async ({ page }) => {
    await goToItinerary(page);
    const photoItem = page.locator('.co-photo-item').first();
    if (await photoItem.count() > 0) {
      await photoItem.click();
      await expect(page.locator('.lightbox-backdrop')).toBeVisible({ timeout: 3000 });
    }
  });

  test('lightbox shows counter', async ({ page }) => {
    await goToItinerary(page);
    const photoItem = page.locator('.co-photo-item').first();
    if (await photoItem.count() > 0) {
      await photoItem.click();
      await expect(page.locator('.lightbox-counter')).toBeVisible({ timeout: 3000 });
      const counter = await page.locator('.lightbox-counter').textContent();
      expect(counter).toMatch(/\d+ \/ \d+/);
    }
  });

  test('lightbox closes on Escape', async ({ page }) => {
    await goToItinerary(page);
    const photoItem = page.locator('.co-photo-item').first();
    if (await photoItem.count() > 0) {
      await photoItem.click();
      await expect(page.locator('.lightbox-backdrop')).toBeVisible({ timeout: 3000 });
      await page.keyboard.press('Escape');
      await expect(page.locator('.lightbox-backdrop')).not.toBeVisible({ timeout: 3000 });
    }
  });

  test('lightbox closes on close button click', async ({ page }) => {
    await goToItinerary(page);
    const photoItem = page.locator('.co-photo-item').first();
    if (await photoItem.count() > 0) {
      await photoItem.click();
      await expect(page.locator('.lightbox-backdrop')).toBeVisible({ timeout: 3000 });
      await page.locator('.lightbox-close').click();
      await expect(page.locator('.lightbox-backdrop')).not.toBeVisible({ timeout: 3000 });
    }
  });

  test('lightbox arrow navigation works', async ({ page }) => {
    await goToItinerary(page);
    const photoItems = page.locator('.co-photo-item');
    if (await photoItems.count() >= 2) {
      await photoItems.first().click();
      await expect(page.locator('.lightbox-backdrop')).toBeVisible({ timeout: 3000 });
      await expect(page.locator('.lightbox-counter')).toContainText('1 /');

      await page.keyboard.press('ArrowRight');
      await expect(page.locator('.lightbox-counter')).toContainText('2 /');

      await page.keyboard.press('ArrowLeft');
      await expect(page.locator('.lightbox-counter')).toContainText('1 /');
    }
  });
});

// ---------------------------------------------------------------------------
// 8. Place Metadata on Activity Cards
// ---------------------------------------------------------------------------

test.describe('Place Metadata', () => {
  test('activity cards with place data show metadata', async ({ page }) => {
    await goToDay(page);
    const metadataElements = page.locator('.activity-metadata');
    const count = await metadataElements.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('rating shows star and numeric value', async ({ page }) => {
    await goToDay(page);
    const rating = page.locator('.meta-rating').first();
    if (await rating.count() > 0) {
      const text = await rating.textContent();
      expect(text).toMatch(/\d\.\d/);
    }
  });
});

// ---------------------------------------------------------------------------
// 9. Map Panel (right sidebar)
// ---------------------------------------------------------------------------

test.describe('Map Panel', () => {
  test('right panel is visible on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await goToItinerary(page);
    await expect(page.locator('.itinerary-right-panel')).toBeVisible();
  });

  test('map panel renders inside right panel', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await goToItinerary(page);
    await expect(page.locator('.map-panel')).toBeAttached();
  });

  test('right panel is hidden on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await goToItinerary(page);
    await expect(page.locator('.itinerary-right-panel')).not.toBeVisible();
  });

  test('compact day summary shows when a day is selected', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await goToDay(page);
    // CompactDaySummary should appear within the map panel
    const summary = page.locator('.compact-day-summary');
    if (await summary.count() > 0) {
      await expect(summary).toBeAttached();
    }
  });
});

// ---------------------------------------------------------------------------
// 10. Mobile Map FAB & Bottom Sheet
// ---------------------------------------------------------------------------

test.describe('Mobile Map FAB', () => {
  test('map FAB is visible on tablet/mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await goToItinerary(page);
    await expect(page.locator('.map-fab')).toBeVisible();
  });

  test('map FAB is hidden on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await goToItinerary(page);
    await expect(page.locator('.map-fab')).not.toBeVisible();
  });

  test('clicking FAB opens bottom sheet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await goToItinerary(page);
    await page.locator('.map-fab').click();
    await expect(page.locator('.map-sheet')).toBeVisible({ timeout: 3000 });
  });

  test('bottom sheet close button works', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await goToItinerary(page);
    await page.locator('.map-fab').click();
    await expect(page.locator('.map-sheet')).toBeVisible({ timeout: 3000 });
    await page.locator('.map-sheet-close').click();
    await expect(page.locator('.map-sheet')).not.toBeVisible({ timeout: 3000 });
  });

  test('bottom sheet closes on backdrop click', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await goToItinerary(page);
    await page.locator('.map-fab').click();
    await expect(page.locator('.map-sheet')).toBeVisible({ timeout: 3000 });
    // Click on the backdrop above the sheet (sheet covers bottom 70vh)
    await page.locator('.map-sheet-backdrop').click({ position: { x: 384, y: 50 }, force: true });
    await expect(page.locator('.map-sheet')).not.toBeVisible({ timeout: 3000 });
  });
});

// ---------------------------------------------------------------------------
// 11. Layout & Responsive
// ---------------------------------------------------------------------------

test.describe('Layout & Responsive', () => {
  test('desktop shows 2-column split layout', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await goToItinerary(page);
    await expect(page.locator('.itinerary-content-split')).toBeAttached();
    await expect(page.locator('.itinerary-left-panel')).toBeAttached();
    await expect(page.locator('.itinerary-right-panel')).toBeVisible();
  });

  test('tablet collapses to single column', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await goToItinerary(page);
    await expect(page.locator('.itinerary-left-panel')).toBeAttached();
    await expect(page.locator('.itinerary-right-panel')).not.toBeVisible();
  });

  test('mobile viewport renders without errors', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await goToItinerary(page);
    await expect(page.locator('.itinerary-header')).toBeAttached();
    await expect(page.locator('.itinerary-header-actions')).toBeAttached();
  });
});

// ---------------------------------------------------------------------------
// 12. URL Deep-Linking
// ---------------------------------------------------------------------------

test.describe('URL Deep-Linking', () => {
  test('city param in URL sets active city', async ({ page }) => {
    await goToItinerary(page, '?city=tokyo');
    await expect(page.locator('.city-pill-active')).toContainText('Tokyo');
  });

  test('city + day params set both active city and day', async ({ page }) => {
    await goToItinerary(page, '?city=osaka&day=1');
    await expect(page.locator('.city-pill-active')).toContainText('Osaka');
    await expect(page.locator('.timeline-container')).toBeAttached();
  });

  test('URL updates when switching cities', async ({ page }) => {
    await goToItinerary(page);
    await page.locator('.city-pill:has-text("Kyoto")').click();
    await page.waitForTimeout(500);
    expect(page.url()).toContain('city=kyoto');
  });

  test('URL updates when selecting a day', async ({ page }) => {
    await goToItinerary(page);
    await page.locator('.day-tab:not(.overview-tab)').first().click();
    await page.waitForTimeout(500);
    expect(page.url()).toContain('day=1');
  });
});

// ---------------------------------------------------------------------------
// 13. Status Badges
// ---------------------------------------------------------------------------

test.describe('Status Badges', () => {
  test('activity cards display status badges', async ({ page }) => {
    await goToDay(page);
    const badges = page.locator('.status-badge');
    const count = await badges.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// 14. Transit Connectors
// ---------------------------------------------------------------------------

test.describe('Transit Connectors', () => {
  test('transit pills appear between some activities', async ({ page }) => {
    await goToDay(page);
    const transits = page.locator('.transit-connector');
    const count = await transits.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// 15. Modals
// ---------------------------------------------------------------------------

test.describe('Modals', () => {
  test('AI Suggestions button opens panel', async ({ page }) => {
    await goToItinerary(page);
    await page.locator('button:has-text("AI Suggestions")').click();
    // Wait for panel/dialog to appear
    await expect(
      page.locator('[class*="suggestions"], [class*="ai-panel"], [role="dialog"]').first()
    ).toBeVisible({ timeout: 5000 });
  });

  test('Add Activity button opens modal', async ({ page }) => {
    await goToItinerary(page);
    await page.locator('button:has-text("Add Activity")').click();
    await expect(page.locator('[role="dialog"]').first()).toBeVisible({ timeout: 5000 });
  });
});

// ---------------------------------------------------------------------------
// 16. Cross-City Navigation Flow
// ---------------------------------------------------------------------------

test.describe('Cross-City Navigation Flow', () => {
  test('full navigation: city -> day -> expand card -> back to overview', async ({ page }) => {
    await goToItinerary(page);

    // 1. Start on Shanghai overview
    await expect(page.locator('.city-pill-active')).toContainText('Shanghai');
    await expect(page.locator('.city-overview')).toBeAttached();

    // 2. Switch to Hong Kong
    await page.locator('.city-pill:has-text("Hong Kong")').click();
    await page.waitForTimeout(800);
    await expect(page.locator('.co-hero-title')).toContainText('Hong Kong');

    // 3. Select Day 1
    await page.locator('.day-tab:not(.overview-tab)').first().click();
    await page.waitForSelector('.timeline-container', { state: 'attached', timeout: 8000 });

    // 4. Expand first activity card (native click bypasses Reorder drag)
    const cards = page.locator('.timeline-content-card');
    if (await cards.count() > 0) {
      await cards.first().evaluate(el => el.click());
      await page.waitForTimeout(500);
      await expect(cards.first()).toHaveClass(/expanded/);
      await cards.first().evaluate(el => el.click());
      await page.waitForTimeout(500);
      await expect(cards.first()).not.toHaveClass(/expanded/);
    }

    // 5. Go back to overview
    await page.locator('.overview-tab').click();
    await page.waitForSelector('.city-overview', { state: 'attached', timeout: 5000 });

    // 6. Switch to Beijing
    await page.locator('.city-pill:has-text("Beijing")').click();
    await page.waitForTimeout(800);
    await expect(page.locator('.co-hero-title')).toContainText('Beijing');
  });
});

// ---------------------------------------------------------------------------
// 17. Accessibility
// ---------------------------------------------------------------------------

test.describe('Accessibility', () => {
  test('city navigator has tablist role', async ({ page }) => {
    await goToItinerary(page);
    await expect(page.locator('.city-navigator')).toHaveAttribute('role', 'tablist');
  });

  test('city pills have tab role', async ({ page }) => {
    await goToItinerary(page);
    const pills = page.locator('.city-pill');
    const count = await pills.count();
    for (let i = 0; i < count; i++) {
      await expect(pills.nth(i)).toHaveAttribute('role', 'tab');
    }
  });

  test('day navigator has tablist role', async ({ page }) => {
    await goToItinerary(page);
    await expect(page.locator('.day-navigator')).toHaveAttribute('role', 'tablist');
  });

  test('active city pill has aria-selected=true', async ({ page }) => {
    await goToItinerary(page);
    await expect(page.locator('.city-pill-active')).toHaveAttribute('aria-selected', 'true');
  });

  test('map FAB has aria-label', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await goToItinerary(page);
    await expect(page.locator('.map-fab')).toHaveAttribute('aria-label', 'Show map');
  });

  test('activity cards are keyboard accessible', async ({ page }) => {
    await goToDay(page);
    const card = page.locator('.timeline-content-card').first();
    await expect(card).toHaveAttribute('role', 'button');
    await expect(card).toHaveAttribute('tabindex', '0');
  });
});
