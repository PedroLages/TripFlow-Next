import { type CitySlug, getCityForDay } from './city-colors';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ActivityComment {
  id: number;
  user: string;
  avatar: string;
  text: string;
  time: string;
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  type: 'flight' | 'hotel' | 'food' | 'activity' | 'shopping' | 'transport';
  duration: number; // minutes
  votes: { up: number; down: number };
  comments: ActivityComment[];
  imageUrl?: string;
  status?: 'Booked' | 'Must Do' | 'Optional';
  transitToNext?: { method: 'walk' | 'train' | 'car' | 'metro' | 'ferry'; duration: number };
}

export interface ItineraryDay {
  dayIndex: number;       // 0-22
  date: string;           // "Aug 27"
  fullDate: string;       // "Wed, Aug 27"
  city: CitySlug;
  activities: Activity[];
}

// ---------------------------------------------------------------------------
// Trip metadata
// ---------------------------------------------------------------------------

export const TRIP_TITLE = 'Asia Circuit 2026';
export const TRIP_SUBTITLE = 'Shanghai \u2192 Hong Kong \u2192 Osaka \u2192 Kyoto \u2192 Tokyo \u2192 Beijing';
export const TRIP_DATES = 'Aug 27 - Sep 18, 2026';

// ---------------------------------------------------------------------------
// Image URLs (Unsplash)
// ---------------------------------------------------------------------------

const IMG = {
  bund: 'https://images.unsplash.com/photo-1537531383496-47a782e39c1e?w=800&auto=format&fit=crop',
  yuGarden: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=800&auto=format&fit=crop',
  victoriaPeak: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800&auto=format&fit=crop',
  starFerry: 'https://images.unsplash.com/photo-1563172444-a2860c3a7480?w=800&auto=format&fit=crop',
  dotonbori: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&auto=format&fit=crop',
  osakaCastle: 'https://images.unsplash.com/photo-1589452271712-64b8a66c3929?w=800&auto=format&fit=crop',
  fushimiInari: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800&auto=format&fit=crop',
  arashiyama: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&auto=format&fit=crop',
  shibuya: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&auto=format&fit=crop',
  teamLab: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop',
  greatWall: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&auto=format&fit=crop',
  forbiddenCity: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=800&auto=format&fit=crop',
} as const;

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

function tripDate(dayIndex: number): { date: string; fullDate: string } {
  const base = new Date(2026, 7, 27); // Aug 27, 2026 (month is 0-indexed)
  const d = new Date(base);
  d.setDate(d.getDate() + dayIndex);
  const dayName = DAY_NAMES[d.getDay()];
  const month = MONTH_NAMES[d.getMonth()];
  const dayNum = d.getDate();
  return {
    date: `${month} ${dayNum}`,
    fullDate: `${dayName}, ${month} ${dayNum}`,
  };
}

// ---------------------------------------------------------------------------
// Mock comment helpers
// ---------------------------------------------------------------------------

function comment(id: number, user: string, avatar: string, text: string, time: string): ActivityComment {
  return { id, user, avatar, text, time };
}

const SARAH = { user: 'Sarah J.', avatar: '/avatars/sarah.jpg' };
const ALEX = { user: 'Alex M.', avatar: '/avatars/alex.jpg' };
const GUIDE = { user: 'Local Guide AI', avatar: '/avatars/ai-guide.png' };

// ---------------------------------------------------------------------------
// Per-day activity data
// ---------------------------------------------------------------------------

function shanghaiDay0(): Activity[] {
  return [
    {
      id: 'sh-d0-1',
      time: '10:30 AM',
      title: 'Arrive at Shanghai Pudong',
      type: 'flight',
      duration: 60,
      votes: { up: 5, down: 0 },
      comments: [],
      status: 'Booked',
      transitToNext: { method: 'metro', duration: 45 },
    },
    {
      id: 'sh-d0-2',
      time: '01:00 PM',
      title: 'Check in at The Bund area hotel',
      type: 'hotel',
      duration: 60,
      votes: { up: 3, down: 0 },
      comments: [],
      status: 'Booked',
      transitToNext: { method: 'walk', duration: 15 },
    },
    {
      id: 'sh-d0-3',
      time: '02:30 PM',
      title: 'Walk The Bund waterfront',
      type: 'activity',
      duration: 120,
      votes: { up: 12, down: 1 },
      comments: [],
      imageUrl: IMG.bund,
      status: 'Must Do',
      transitToNext: { method: 'walk', duration: 10 },
    },
    {
      id: 'sh-d0-4',
      time: '05:00 PM',
      title: 'Nanjing Road East shopping district',
      type: 'shopping',
      duration: 90,
      votes: { up: 6, down: 2 },
      comments: [],
      status: 'Optional',
    },
  ];
}

function shanghaiDay1(): Activity[] {
  return [
    {
      id: 'sh-d1-1',
      time: '09:00 AM',
      title: 'Yu Garden & Bazaar',
      type: 'activity',
      duration: 150,
      votes: { up: 18, down: 2 },
      comments: [
        comment(1, SARAH.user, SARAH.avatar, 'Go early to beat the crowds! The garden is magical before 10am.', '2 days ago'),
        comment(2, GUIDE.user, GUIDE.avatar, 'Entry is 40 CNY. The bazaar outside is free and great for souvenirs.', '1 day ago'),
      ],
      imageUrl: IMG.yuGarden,
      status: 'Must Do',
      transitToNext: { method: 'metro', duration: 20 },
    },
    {
      id: 'sh-d1-2',
      time: '12:00 PM',
      title: 'Xiaolongbao at Jia Jia Tang Bao',
      type: 'food',
      duration: 60,
      votes: { up: 14, down: 0 },
      comments: [],
      status: 'Must Do',
      transitToNext: { method: 'metro', duration: 30 },
    },
    {
      id: 'sh-d1-3',
      time: '02:00 PM',
      title: 'French Concession walking tour',
      type: 'activity',
      duration: 180,
      votes: { up: 9, down: 1 },
      comments: [],
      status: 'Optional',
      transitToNext: { method: 'walk', duration: 15 },
    },
    {
      id: 'sh-d1-4',
      time: '06:00 PM',
      title: 'Dinner at Lost Heaven',
      type: 'food',
      duration: 90,
      votes: { up: 7, down: 1 },
      comments: [],
      status: 'Optional',
    },
  ];
}

function shanghaiDay2(): Activity[] {
  return [
    {
      id: 'sh-d2-1',
      time: '08:00 AM',
      title: 'Day trip to Suzhou \u2014 train',
      type: 'transport',
      duration: 30,
      votes: { up: 10, down: 0 },
      comments: [],
      status: 'Booked',
      transitToNext: { method: 'walk', duration: 10 },
    },
    {
      id: 'sh-d2-2',
      time: '09:00 AM',
      title: "Humble Administrator's Garden",
      type: 'activity',
      duration: 120,
      votes: { up: 11, down: 1 },
      comments: [],
      status: 'Must Do',
      transitToNext: { method: 'walk', duration: 20 },
    },
    {
      id: 'sh-d2-3',
      time: '11:30 AM',
      title: 'Pingjiang Historic Street & lunch',
      type: 'food',
      duration: 90,
      votes: { up: 8, down: 0 },
      comments: [],
      status: 'Optional',
      transitToNext: { method: 'train', duration: 30 },
    },
    {
      id: 'sh-d2-4',
      time: '03:00 PM',
      title: 'Shanghai Tower observation deck',
      type: 'activity',
      duration: 90,
      votes: { up: 13, down: 2 },
      comments: [],
      status: 'Optional',
    },
  ];
}

function hongKongDay3(): Activity[] {
  return [
    {
      id: 'hk-d3-1',
      time: '08:00 AM',
      title: 'Flight Shanghai \u2192 Hong Kong',
      type: 'flight',
      duration: 150,
      votes: { up: 4, down: 0 },
      comments: [],
      status: 'Booked',
      transitToNext: { method: 'train', duration: 25 },
    },
    {
      id: 'hk-d3-2',
      time: '12:00 PM',
      title: 'Check in Tsim Sha Tsui hotel',
      type: 'hotel',
      duration: 45,
      votes: { up: 3, down: 0 },
      comments: [],
      status: 'Booked',
      transitToNext: { method: 'ferry', duration: 10 },
    },
    {
      id: 'hk-d3-3',
      time: '02:00 PM',
      title: 'Star Ferry to Central',
      type: 'activity',
      duration: 30,
      votes: { up: 15, down: 0 },
      comments: [],
      imageUrl: IMG.starFerry,
      status: 'Must Do',
      transitToNext: { method: 'walk', duration: 15 },
    },
    {
      id: 'hk-d3-4',
      time: '03:00 PM',
      title: 'Victoria Peak via Peak Tram',
      type: 'activity',
      duration: 180,
      votes: { up: 22, down: 1 },
      comments: [
        comment(3, ALEX.user, ALEX.avatar, 'The sunset from the top is absolutely breathtaking. Time it right!', '3 days ago'),
        comment(4, SARAH.user, SARAH.avatar, 'Buy the combo ticket for tram + Sky Terrace. Worth every dollar.', '2 days ago'),
        comment(5, GUIDE.user, GUIDE.avatar, 'Consider walking down via Old Peak Road for scenic views. Takes about 45 min.', '1 day ago'),
      ],
      imageUrl: IMG.victoriaPeak,
      status: 'Must Do',
    },
  ];
}

function hongKongDay4(): Activity[] {
  return [
    {
      id: 'hk-d4-1',
      time: '09:00 AM',
      title: 'Dim Sum at Tim Ho Wan',
      type: 'food',
      duration: 90,
      votes: { up: 16, down: 1 },
      comments: [],
      status: 'Must Do',
      transitToNext: { method: 'metro', duration: 25 },
    },
    {
      id: 'hk-d4-2',
      time: '11:30 AM',
      title: 'Big Buddha & Ngong Ping',
      type: 'activity',
      duration: 240,
      votes: { up: 14, down: 3 },
      comments: [],
      status: 'Optional',
      transitToNext: { method: 'metro', duration: 45 },
    },
    {
      id: 'hk-d4-3',
      time: '05:00 PM',
      title: 'Temple Street Night Market',
      type: 'shopping',
      duration: 120,
      votes: { up: 10, down: 2 },
      comments: [],
      status: 'Optional',
    },
  ];
}

function hongKongDay5(): Activity[] {
  return [
    {
      id: 'hk-d5-1',
      time: '09:00 AM',
      title: 'Tai O fishing village',
      type: 'activity',
      duration: 180,
      votes: { up: 8, down: 1 },
      comments: [],
      status: 'Optional',
      transitToNext: { method: 'metro', duration: 40 },
    },
    {
      id: 'hk-d5-2',
      time: '02:00 PM',
      title: 'Hong Kong Museum of Art',
      type: 'activity',
      duration: 120,
      votes: { up: 6, down: 1 },
      comments: [],
      status: 'Optional',
      transitToNext: { method: 'walk', duration: 10 },
    },
    {
      id: 'hk-d5-3',
      time: '05:00 PM',
      title: 'Rooftop drinks at Ozone Bar',
      type: 'food',
      duration: 90,
      votes: { up: 11, down: 2 },
      comments: [],
      status: 'Optional',
    },
  ];
}

function osakaDay6(): Activity[] {
  return [
    {
      id: 'os-d6-1',
      time: '09:00 AM',
      title: 'Flight Hong Kong \u2192 Osaka',
      type: 'flight',
      duration: 180,
      votes: { up: 4, down: 0 },
      comments: [],
      status: 'Booked',
    },
    {
      id: 'os-d6-2',
      time: '03:00 PM',
      title: 'Dotonbori street food crawl',
      type: 'food',
      duration: 120,
      votes: { up: 19, down: 1 },
      comments: [],
      imageUrl: IMG.dotonbori,
      status: 'Must Do',
    },
  ];
}

function osakaDay7(): Activity[] {
  return [
    {
      id: 'os-d7-1',
      time: '10:00 AM',
      title: 'Osaka Castle',
      type: 'activity',
      duration: 150,
      votes: { up: 15, down: 2 },
      comments: [],
      imageUrl: IMG.osakaCastle,
      status: 'Must Do',
    },
    {
      id: 'os-d7-2',
      time: '03:00 PM',
      title: 'Shinsekai & Tsutenkaku Tower',
      type: 'activity',
      duration: 120,
      votes: { up: 9, down: 1 },
      comments: [],
      status: 'Optional',
    },
  ];
}

function osakaDay8(): Activity[] {
  return [
    {
      id: 'os-d8-1',
      time: '09:00 AM',
      title: 'Kuromon Market morning',
      type: 'food',
      duration: 120,
      votes: { up: 13, down: 1 },
      comments: [],
      status: 'Must Do',
    },
    {
      id: 'os-d8-2',
      time: '02:00 PM',
      title: 'Namba & Shinsaibashi shopping',
      type: 'shopping',
      duration: 180,
      votes: { up: 7, down: 2 },
      comments: [],
      status: 'Optional',
    },
  ];
}

function kyotoDay9(): Activity[] {
  return [
    {
      id: 'ky-d9-1',
      time: '08:00 AM',
      title: 'Train Osaka \u2192 Kyoto',
      type: 'transport',
      duration: 15,
      votes: { up: 5, down: 0 },
      comments: [],
      status: 'Booked',
    },
    {
      id: 'ky-d9-2',
      time: '10:00 AM',
      title: 'Fushimi Inari Shrine',
      type: 'activity',
      duration: 180,
      votes: { up: 25, down: 1 },
      comments: [
        comment(6, ALEX.user, ALEX.avatar, 'Start super early (before 8am) for empty torii gates photos. By 10am it gets packed.', '4 days ago'),
        comment(7, GUIDE.user, GUIDE.avatar, 'The full hike to the summit takes about 2-3 hours. Most tourists only do the first section.', '3 days ago'),
        comment(8, SARAH.user, SARAH.avatar, 'Night visits are also possible and incredibly atmospheric. The shrine is open 24/7!', '1 day ago'),
      ],
      imageUrl: IMG.fushimiInari,
      status: 'Must Do',
    },
  ];
}

function kyotoDay10(): Activity[] {
  return [
    {
      id: 'ky-d10-1',
      time: '08:00 AM',
      title: 'Arashiyama Bamboo Grove',
      type: 'activity',
      duration: 120,
      votes: { up: 20, down: 1 },
      comments: [],
      imageUrl: IMG.arashiyama,
      status: 'Must Do',
    },
    {
      id: 'ky-d10-2',
      time: '01:00 PM',
      title: 'Kinkaku-ji Golden Pavilion',
      type: 'activity',
      duration: 90,
      votes: { up: 17, down: 1 },
      comments: [],
      status: 'Must Do',
    },
  ];
}

function kyotoDay11(): Activity[] {
  return [
    {
      id: 'ky-d11-1',
      time: '09:00 AM',
      title: 'Nishiki Market food tour',
      type: 'food',
      duration: 120,
      votes: { up: 12, down: 1 },
      comments: [],
      status: 'Optional',
    },
  ];
}

function kyotoDay12(): Activity[] {
  return [
    {
      id: 'ky-d12-1',
      time: '10:00 AM',
      title: 'Tea ceremony experience',
      type: 'activity',
      duration: 90,
      votes: { up: 10, down: 0 },
      comments: [],
      status: 'Optional',
    },
  ];
}

function tokyoDay13(): Activity[] {
  return [
    {
      id: 'tk-d13-1',
      time: '08:00 AM',
      title: 'Shinkansen Kyoto \u2192 Tokyo',
      type: 'transport',
      duration: 135,
      votes: { up: 8, down: 0 },
      comments: [],
      status: 'Booked',
    },
    {
      id: 'tk-d13-2',
      time: '02:00 PM',
      title: 'Shibuya Crossing & Hachiko',
      type: 'activity',
      duration: 60,
      votes: { up: 16, down: 1 },
      comments: [],
      imageUrl: IMG.shibuya,
      status: 'Must Do',
    },
  ];
}

function tokyoDay14(): Activity[] {
  return [
    {
      id: 'tk-d14-1',
      time: '09:00 AM',
      title: 'TeamLab Borderless',
      type: 'activity',
      duration: 180,
      votes: { up: 24, down: 2 },
      comments: [
        comment(9, SARAH.user, SARAH.avatar, 'Book tickets well in advance \u2014 they sell out weeks ahead! Wear white for the best experience.', '5 days ago'),
        comment(10, ALEX.user, ALEX.avatar, 'Absolutely mind-blowing. Plan at least 3 hours. The Crystal Universe room is unreal.', '3 days ago'),
        comment(11, GUIDE.user, GUIDE.avatar, 'The new Azabudai Hills location opened in 2024. It is a completely reimagined experience from the Odaiba original.', '2 days ago'),
      ],
      imageUrl: IMG.teamLab,
      status: 'Booked',
    },
  ];
}

function tokyoDay15(): Activity[] {
  return [
    {
      id: 'tk-d15-1',
      time: '07:00 AM',
      title: 'Tsukiji Outer Market',
      type: 'food',
      duration: 120,
      votes: { up: 14, down: 1 },
      comments: [],
      status: 'Must Do',
    },
  ];
}

// Days 16-18: empty (Tokyo free days)
function tokyoDay16(): Activity[] {
  return [];
}

function tokyoDay17(): Activity[] {
  return [];
}

function tokyoDay18(): Activity[] {
  return [];
}

function beijingDay19(): Activity[] {
  return [
    {
      id: 'bj-d19-1',
      time: '09:00 AM',
      title: 'Flight Tokyo \u2192 Beijing',
      type: 'flight',
      duration: 210,
      votes: { up: 4, down: 0 },
      comments: [],
      status: 'Booked',
    },
  ];
}

function beijingDay20(): Activity[] {
  return [
    {
      id: 'bj-d20-1',
      time: '08:00 AM',
      title: 'Great Wall at Mutianyu',
      type: 'activity',
      duration: 360,
      votes: { up: 26, down: 0 },
      comments: [],
      imageUrl: IMG.greatWall,
      status: 'Must Do',
    },
  ];
}

function beijingDay21(): Activity[] {
  return [
    {
      id: 'bj-d21-1',
      time: '09:00 AM',
      title: 'Forbidden City & Tiananmen',
      type: 'activity',
      duration: 240,
      votes: { up: 21, down: 1 },
      comments: [],
      imageUrl: IMG.forbiddenCity,
      status: 'Must Do',
    },
  ];
}

// Day 22: departure day, empty
function beijingDay22(): Activity[] {
  return [];
}

// ---------------------------------------------------------------------------
// Activity data lookup by day index
// ---------------------------------------------------------------------------

const DAY_ACTIVITIES: Record<number, () => Activity[]> = {
  0: shanghaiDay0,
  1: shanghaiDay1,
  2: shanghaiDay2,
  3: hongKongDay3,
  4: hongKongDay4,
  5: hongKongDay5,
  6: osakaDay6,
  7: osakaDay7,
  8: osakaDay8,
  9: kyotoDay9,
  10: kyotoDay10,
  11: kyotoDay11,
  12: kyotoDay12,
  13: tokyoDay13,
  14: tokyoDay14,
  15: tokyoDay15,
  16: tokyoDay16,
  17: tokyoDay17,
  18: tokyoDay18,
  19: beijingDay19,
  20: beijingDay20,
  21: beijingDay21,
  22: beijingDay22,
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function generateItineraryDays(): ItineraryDay[] {
  const days: ItineraryDay[] = [];

  for (let i = 0; i <= 22; i++) {
    const { date, fullDate } = tripDate(i);
    const activityFn = DAY_ACTIVITIES[i];

    days.push({
      dayIndex: i,
      date,
      fullDate,
      city: getCityForDay(i),
      activities: activityFn ? activityFn() : [],
    });
  }

  return days;
}
