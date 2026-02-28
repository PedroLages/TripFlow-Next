#!/usr/bin/env node
/**
 * Download Unsplash images and create responsive WebP variants.
 *
 * Outputs:
 *   public/images/itinerary/{name}-{width}.webp
 *
 * Sizes: 400w (thumbs), 800w (cards), 1200w (medium), 1600w (hero/desktop)
 */

import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'images', 'itinerary');

// Ensure output directory exists
mkdirSync(OUT_DIR, { recursive: true });

const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = 82;

/**
 * All images: key is the filename slug, value is the Unsplash CDN photo ID.
 * These are the photo-{timestamp}-{hash} part of the URL.
 */
const IMAGES = {
  // Shanghai
  'bund':              'photo-1748078096034-46086f5b87da',
  'yu-garden':         'photo-1548919973-5cef591cdbc9',
  // Hong Kong
  'victoria-peak':     'photo-1536599018102-9f803c140fc1',
  'star-ferry':        'photo-1577877672838-50903da2ac2f',
  // Osaka
  'dotonbori':         'photo-1590559899731-a382839e5549',
  'osaka-castle':      'photo-1500215417117-bec2d517f8f8',
  // Kyoto
  'fushimi-inari':     'photo-1478436127897-769e1b3f0f36',
  'arashiyama':        'photo-1545569341-9eb8b30979d9',
  // Tokyo
  'shibuya':           'photo-1542051841857-5f90071e7989',
  'teamlab':           'photo-1540959733332-eab4deabeeaf',
  // Beijing
  'great-wall':        'photo-1508804185872-d7badad00f7d',
  'forbidden-city':    'photo-1584646098378-0874589d76b1',
  // Additional activity images (new)
  'nanjing-road':      'photo-1567991964677-38d6cb81637a',
  'shanghai-skyline':  'photo-1516648176391-a4de4541db51',
  'dim-sum':           'photo-1563245372-f21724e3856d',
  'big-buddha':        'photo-1536599424071-0b215a388ba7',
  'night-market':      'photo-1513326738677-b964603b136d',
  'kinkakuji':         'photo-1490761668535-35497054764d',
  'tea-ceremony':      'photo-1576092768241-dec231879fc3',
  'tsukiji':           'photo-1579871494447-9811cf80d66c',
  'shinsekai':         'photo-1524413840807-0c3cb6fa808d',
  'kuromon-market':    'photo-1553621042-f6e147245754',
};

async function downloadAndProcess(name, photoId) {
  // Download at largest size needed (2x of 1600 = 3200, but 2400 is plenty)
  const url = `https://images.unsplash.com/${photoId}?w=2400&q=90&auto=format&fit=crop`;

  console.log(`  Downloading ${name}...`);
  const response = await fetch(url);

  if (!response.ok) {
    console.error(`  FAILED ${name}: HTTP ${response.status} — trying fallback URL`);
    // Try alternative URL format
    const fallbackUrl = `https://images.unsplash.com/${photoId}?w=1600&q=85`;
    const fallbackResponse = await fetch(fallbackUrl);
    if (!fallbackResponse.ok) {
      console.error(`  SKIPPED ${name}: Could not download`);
      return [];
    }
    const buffer = Buffer.from(await fallbackResponse.arrayBuffer());
    return processBuffer(name, buffer);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  return processBuffer(name, buffer);
}

async function processBuffer(name, buffer) {
  const results = [];

  for (const width of WIDTHS) {
    const outPath = join(OUT_DIR, `${name}-${width}.webp`);

    // Skip if already exists
    if (existsSync(outPath)) {
      console.log(`  ✓ ${name}-${width}.webp (cached)`);
      results.push({ name, width, path: outPath });
      continue;
    }

    try {
      await sharp(buffer)
        .resize(width, undefined, { withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 4 })
        .toFile(outPath);

      console.log(`  ✓ ${name}-${width}.webp`);
      results.push({ name, width, path: outPath });
    } catch (err) {
      console.error(`  ✗ ${name}-${width}.webp: ${err.message}`);
    }
  }

  return results;
}

async function main() {
  console.log('Processing images for TripFlow Itinerary...\n');
  console.log(`Output: ${OUT_DIR}`);
  console.log(`Sizes: ${WIDTHS.join(', ')}w`);
  console.log(`Format: WebP @ ${QUALITY}% quality\n`);

  const entries = Object.entries(IMAGES);
  let successCount = 0;
  let failCount = 0;

  // Process in batches of 4 to avoid overwhelming the network
  for (let i = 0; i < entries.length; i += 4) {
    const batch = entries.slice(i, i + 4);
    const results = await Promise.allSettled(
      batch.map(([name, photoId]) => downloadAndProcess(name, photoId))
    );

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.length > 0) {
        successCount++;
      } else {
        failCount++;
      }
    }
  }

  console.log(`\nDone! ${successCount} images processed, ${failCount} failed.`);
  console.log(`Files written to: ${OUT_DIR}`);
}

main().catch(console.error);
