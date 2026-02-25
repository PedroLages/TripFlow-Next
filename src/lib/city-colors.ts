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
}

export const CITY_CONFIGS: Record<CitySlug, CityConfig> = {
  shanghai: { slug: 'shanghai', name: 'Shanghai', nights: 3, dateRange: 'Aug 27-30', icon: Building2, cssVar: '--city-shanghai', glowVar: '--city-shanghai-glow', mutedVar: '--city-shanghai-muted' },
  hongkong: { slug: 'hongkong', name: 'Hong Kong', nights: 3, dateRange: 'Aug 30 - Sep 2', icon: Ship, cssVar: '--city-hongkong', glowVar: '--city-hongkong-glow', mutedVar: '--city-hongkong-muted' },
  osaka: { slug: 'osaka', name: 'Osaka', nights: 3, dateRange: 'Sep 2-5', icon: Castle, cssVar: '--city-osaka', glowVar: '--city-osaka-glow', mutedVar: '--city-osaka-muted' },
  kyoto: { slug: 'kyoto', name: 'Kyoto', nights: 4, dateRange: 'Sep 5-9', icon: Trees, cssVar: '--city-kyoto', glowVar: '--city-kyoto-glow', mutedVar: '--city-kyoto-muted' },
  tokyo: { slug: 'tokyo', name: 'Tokyo', nights: 6, dateRange: 'Sep 9-15', icon: Zap, cssVar: '--city-tokyo', glowVar: '--city-tokyo-glow', mutedVar: '--city-tokyo-muted' },
  beijing: { slug: 'beijing', name: 'Beijing', nights: 3, dateRange: 'Sep 15-18', icon: Landmark, cssVar: '--city-beijing', glowVar: '--city-beijing-glow', mutedVar: '--city-beijing-muted' },
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

export function getCityStyle(city: CitySlug): React.CSSProperties {
  const config = CITY_CONFIGS[city];
  return {
    '--city-color': `var(${config.cssVar})`,
    '--city-glow': `var(${config.glowVar})`,
    '--city-muted': `var(${config.mutedVar})`,
  } as React.CSSProperties;
}
