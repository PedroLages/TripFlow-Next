/**
 * Playwright global setup – pre-warms Turbopack routes so tests don't hit
 * a 404 from cold compilation. Runs once before all tests.
 */

const ROUTES_TO_WARM = [
  'http://localhost:3000/',
  'http://localhost:3000/trips/1',
  'http://localhost:3000/trips/1/itinerary',
];

async function globalSetup() {
  for (const url of ROUTES_TO_WARM) {
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const res = await fetch(url);
        if (res.ok) break;
      } catch {
        // Server may still be starting
      }
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

export default globalSetup;
