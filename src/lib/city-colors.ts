import { Building2, Ship, Castle, Trees, Zap, Landmark, type LucideIcon } from 'lucide-react';

export type CitySlug = 'shanghai' | 'hongkong' | 'osaka' | 'kyoto' | 'tokyo' | 'beijing';

export interface CityConfig {
  slug: CitySlug;
  name: string;
  nights: number;
  dateRange: string;
  icon: LucideIcon;
  cssVar: string;
  glowVar: string;
  mutedVar: string;
  // City Overview fields
  tagline: string;
  heroImage: string;
  climate: string;
  transitTip: string;
  budgetRange: string;
  languageTip: string;
  highlights: string[];
}

export const CITY_CONFIGS: Record<CitySlug, CityConfig> = {
  shanghai: {
    slug: 'shanghai',
    name: 'Shanghai',
    nights: 3,
    dateRange: 'Aug 27-30',
    icon: Building2,
    cssVar: '--city-shanghai',
    glowVar: '--city-shanghai-glow',
    mutedVar: '--city-shanghai-muted',
    tagline: 'Where futurism meets French Concession charm',
    heroImage: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=1600&auto=format&fit=crop',
    climate: 'Hot & humid, 28-33°C',
    transitTip: 'Metro + walking',
    budgetRange: '~$80/day',
    languageTip: 'Mandarin · 你好 nǐ hǎo',
    highlights: ['The Bund', 'Yu Garden', 'French Concession', 'Nanjing Road'],
  },
  hongkong: {
    slug: 'hongkong',
    name: 'Hong Kong',
    nights: 3,
    dateRange: 'Aug 30 - Sep 2',
    icon: Ship,
    cssVar: '--city-hongkong',
    glowVar: '--city-hongkong-glow',
    mutedVar: '--city-hongkong-muted',
    tagline: 'Skyscrapers, street food & harbour lights',
    heroImage: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=1600&auto=format&fit=crop',
    climate: 'Tropical, 28-31°C',
    transitTip: 'MTR + Star Ferry',
    budgetRange: '~$120/day',
    languageTip: 'Cantonese · 你好 néih hóu',
    highlights: ['Victoria Peak', 'Star Ferry', 'Temple Street', 'Dim Sum Trail'],
  },
  osaka: {
    slug: 'osaka',
    name: 'Osaka',
    nights: 3,
    dateRange: 'Sep 2-5',
    icon: Castle,
    cssVar: '--city-osaka',
    glowVar: '--city-osaka-glow',
    mutedVar: '--city-osaka-muted',
    tagline: "Japan's kitchen — bold flavours, neon glow",
    heroImage: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=1600&auto=format&fit=crop',
    climate: 'Warm & sunny, 26-30°C',
    transitTip: 'Metro + walking',
    budgetRange: '~$100/day',
    languageTip: 'Japanese · こんにちは konnichiwa',
    highlights: ['Dotonbori', 'Osaka Castle', 'Shinsekai', 'Street Food'],
  },
  kyoto: {
    slug: 'kyoto',
    name: 'Kyoto',
    nights: 4,
    dateRange: 'Sep 5-9',
    icon: Trees,
    cssVar: '--city-kyoto',
    glowVar: '--city-kyoto-glow',
    mutedVar: '--city-kyoto-muted',
    tagline: 'Ancient temples wrapped in bamboo & moss',
    heroImage: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=1600&auto=format&fit=crop',
    climate: 'Pleasant, 24-28°C',
    transitTip: 'Bus + bicycle',
    budgetRange: '~$90/day',
    languageTip: 'Japanese · こんにちは konnichiwa',
    highlights: ['Fushimi Inari', 'Arashiyama', 'Kinkaku-ji', 'Gion District'],
  },
  tokyo: {
    slug: 'tokyo',
    name: 'Tokyo',
    nights: 6,
    dateRange: 'Sep 9-15',
    icon: Zap,
    cssVar: '--city-tokyo',
    glowVar: '--city-tokyo-glow',
    mutedVar: '--city-tokyo-muted',
    tagline: 'Neon-lit nights & ancient shrines',
    heroImage: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1600&auto=format&fit=crop',
    climate: 'Clear skies, 24-27°C',
    transitTip: 'JR + Metro',
    budgetRange: '~$110/day',
    languageTip: 'Japanese · こんにちは konnichiwa',
    highlights: ['Shibuya Crossing', 'TeamLab', 'Tsukiji Outer Market', 'Akihabara'],
  },
  beijing: {
    slug: 'beijing',
    name: 'Beijing',
    nights: 3,
    dateRange: 'Sep 15-18',
    icon: Landmark,
    cssVar: '--city-beijing',
    glowVar: '--city-beijing-glow',
    mutedVar: '--city-beijing-muted',
    tagline: 'Imperial grandeur & hutong hidden gems',
    heroImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1600&auto=format&fit=crop',
    climate: 'Dry & clear, 22-26°C',
    transitTip: 'Metro + taxi',
    budgetRange: '~$70/day',
    languageTip: 'Mandarin · 你好 nǐ hǎo',
    highlights: ['Great Wall', 'Forbidden City', 'Hutongs', 'Temple of Heaven'],
  },
};

export const CITY_ORDER: CitySlug[] = ['shanghai', 'hongkong', 'osaka', 'kyoto', 'tokyo', 'beijing'];

export const TOTAL_NIGHTS = 22;

export function getCityForDay(dayIndex: number): CitySlug {
  if (dayIndex < 3) return 'shanghai';
  if (dayIndex < 6) return 'hongkong';
  if (dayIndex < 9) return 'osaka';
  if (dayIndex < 13) return 'kyoto';
  if (dayIndex < 19) return 'tokyo';
  return 'beijing';
}

export function getDaysForCity(city: CitySlug): number[] {
  const ranges: Record<CitySlug, [number, number]> = {
    shanghai: [0, 3],
    hongkong: [3, 6],
    osaka: [6, 9],
    kyoto: [9, 13],
    tokyo: [13, 19],
    beijing: [19, 22],
  };
  const [start, end] = ranges[city];
  return Array.from({ length: end - start }, (_, i) => start + i);
}

export function getFirstDayOfCity(city: CitySlug): number {
  return getDaysForCity(city)[0];
}

/**
 * Get city color CSS variables for inline styles.
 *
 * **⚠️ USAGE RULES - Color Hierarchy:**
 * ```
 * Tier 1: Semantic UI (success, danger, warning, info)     ← Always wins
 * Tier 2: Feature Colors (privacy teal, voting purple)     ← Wins in feature contexts
 * Tier 3: Brand Accent (primary teal, coral)               ← Wins in neutral UI
 * Tier 4: City Colors (Shanghai pink, Osaka teal, etc.)    ← Context-specific only
 * ```
 *
 * **✅ ALLOWED USAGE:**
 * - Left/Right borders on cards and panels (decorative accent)
 * - Map pins and route lines (geographic theming)
 * - City navigation chips and badges (location context)
 * - Timeline nodes and connectors (itinerary theming)
 *
 * **❌ FORBIDDEN USAGE:**
 * - Primary buttons (use `--accent-primary` instead)
 * - Status badges (use `--color-success/warning/danger` instead)
 * - Form inputs and focus states (use `--border-focus` instead)
 * - Feature indicators (use `--color-privacy/vote` instead)
 *
 * **⚠️ CONFLICT RESOLUTION:**
 * - **Osaka city color** (200° hue) ≠ **Privacy feature color** (185° hue)
 * - **15° hue separation** ensures visual distinction
 * - **Spatial separation**: Borders ≠ Icons ≠ Badges
 * - If both appear in same component, city = border, privacy = icon/badge
 *
 * @param city - City slug (shanghai, hongkong, osaka, kyoto, tokyo, beijing)
 * @returns CSS custom properties object for inline styles
 *
 * @example
 * // ✅ CORRECT: Border accent on activity card
 * <div style={{
 *   ...getCityStyle('osaka'),
 *   borderLeft: '4px solid var(--city-color)'
 * }}>
 *
 * @example
 * // ❌ WRONG: City color on primary button
 * <button style={{ background: getCityStyle('osaka')['--city-color'] }}>
 *   Book Now
 * </button>
 *
 * @example
 * // ✅ CORRECT: City border + privacy badge coexist
 * <div style={{
 *   ...getCityStyle('osaka'),
 *   borderLeft: '3px solid var(--city-color)'
 * }}>
 *   <PrivacyIndicator /> // Uses --color-privacy (different hue)
 * </div>
 */
export function getCityStyle(city: CitySlug): React.CSSProperties {
  const config = CITY_CONFIGS[city];
  return {
    '--city-color': `var(${config.cssVar})`,
    '--city-glow': `var(${config.glowVar})`,
    '--city-muted': `var(${config.mutedVar})`,
  } as React.CSSProperties;
}
