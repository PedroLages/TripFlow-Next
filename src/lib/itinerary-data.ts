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
  status?: 'Booked' | 'Paid' | 'Pending' | 'Must Do' | 'Considering' | 'Optional' | 'Cancelled';
  transitToNext?: { method: 'walk' | 'train' | 'car' | 'metro' | 'ferry'; duration: number };
  photos?: string[];          // multiple image URLs for carousel
  coordinates?: Coordinates;  // GPS for map pins
  place?: PlaceMetadata;      // enrichment data
  notes?: string;             // Personal notes (replaces comments for solo trips)
  tags?: string[];            // User-defined tags like "food", "culture", "romantic"
  timezone?: string;          // IANA timezone e.g. 'Asia/Tokyo'
}

export interface PlaceMetadata {
  rating?: number;          // 1.0 - 5.0
  reviewCount?: number;
  openingHours?: string;    // "9:00 AM - 6:00 PM"
  address?: string;
  priceLevel?: 1 | 2 | 3 | 4;
  placeCategory?: string;   // "Temple", "Market", etc.
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ItineraryDay {
  dayIndex: number;       // 0-22
  date: string;           // "Aug 27"
  fullDate: string;       // "Wed, Aug 27"
  city: CitySlug;
  activities: Activity[];
  intention?: 'planned' | 'free' | 'travel' | 'unplanned';
}

export interface LightboxSlide {
  src: string;
  title?: string;
}

// ---------------------------------------------------------------------------
// Trip metadata
// ---------------------------------------------------------------------------

export const TRIP_TITLE = 'Asia Circuit 2026';
export const TRIP_SUBTITLE = 'Shanghai \u2192 Hong Kong \u2192 Osaka \u2192 Kyoto \u2192 Tokyo \u2192 Beijing';
export const TRIP_DATES = 'Aug 27 - Sep 18, 2026';

// ---------------------------------------------------------------------------
// Local responsive images (WebP, processed from Unsplash originals)
// Sizes: 400w (thumbs), 800w (cards), 1200w (medium), 1600w (hero)
// ---------------------------------------------------------------------------

type ImageSize = 400 | 800 | 1200 | 1600;

/** Returns the local path for a responsive image at the given size. */
export function itineraryImage(name: string, size: ImageSize = 800): string {
  return `/images/itinerary/${name}-${size}.webp`;
}

/** Returns a CSS image-set() value for responsive background images. */
export function responsiveBgImage(name: string): string {
  return `image-set(url("/images/itinerary/${name}-800.webp") 1x, url("/images/itinerary/${name}-1600.webp") 2x)`;
}

/** Swaps an itinerary image path to a different size. Falls back to original if not a local image. */
export function resizeItineraryImage(imageUrl: string, size: ImageSize): string {
  const match = imageUrl.match(/^\/images\/itinerary\/(.+)-\d+\.webp$/);
  return match ? itineraryImage(match[1], size) : imageUrl;
}

const IMG = {
  bund:           itineraryImage('bund'),
  yuGarden:       itineraryImage('yu-garden'),
  victoriaPeak:   itineraryImage('victoria-peak'),
  starFerry:      itineraryImage('star-ferry'),
  dotonbori:      itineraryImage('dotonbori'),
  osakaCastle:    itineraryImage('osaka-castle'),
  fushimiInari:   itineraryImage('fushimi-inari'),
  arashiyama:     itineraryImage('arashiyama'),
  shibuya:        itineraryImage('shibuya'),
  teamLab:        itineraryImage('teamlab'),
  greatWall:      itineraryImage('great-wall'),
  forbiddenCity:  itineraryImage('forbidden-city'),
  // Additional activity images
  nanjingRoad:    itineraryImage('nanjing-road'),
  shanghaiSkyline: itineraryImage('shanghai-skyline'),
  dimSum:         itineraryImage('dim-sum'),
  bigBuddha:     itineraryImage('big-buddha'),
  nightMarket:    itineraryImage('night-market'),
  kinkakuji:     itineraryImage('kinkakuji'),
  teaCeremony:   itineraryImage('tea-ceremony'),
  tsukiji:       itineraryImage('tsukiji'),
  shinsekai:     itineraryImage('shinsekai'),
  kuromonMarket: itineraryImage('kuromon-market'),
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
// Timezone mapping by city
// ---------------------------------------------------------------------------

const CITY_TIMEZONE: Record<CitySlug, string> = {
  shanghai: 'Asia/Shanghai',
  hongkong: 'Asia/Hong_Kong',
  osaka: 'Asia/Tokyo',
  kyoto: 'Asia/Tokyo',
  tokyo: 'Asia/Tokyo',
  beijing: 'Asia/Shanghai',
};

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
      coordinates: { lat: 31.1443, lng: 121.8083 },
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
      coordinates: { lat: 31.2400, lng: 121.4900 },
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
      photos: [IMG.bund, itineraryImage('shanghai-skyline'), itineraryImage('nanjing-road')],
      status: 'Must Do',
      transitToNext: { method: 'walk', duration: 10 },
      coordinates: { lat: 31.2400, lng: 121.4900 },
      place: {
        rating: 4.7,
        reviewCount: 12400,
        openingHours: 'Open 24 hours',
        address: 'Zhongshan East 1st Rd, Huangpu',
        placeCategory: 'Waterfront Promenade',
      },
      notes: 'Best at sunset — arrive by 5pm for golden hour photos',
      tags: ['photography', 'must-see'],
    },
    {
      id: 'sh-d0-4',
      time: '05:00 PM',
      title: 'Nanjing Road East shopping district',
      type: 'shopping',
      duration: 90,
      votes: { up: 6, down: 2 },
      comments: [],
      imageUrl: IMG.nanjingRoad,
      photos: [IMG.nanjingRoad],
      status: 'Optional',
      coordinates: { lat: 31.2350, lng: 121.4740 },
      place: {
        rating: 4.3,
        reviewCount: 8200,
        openingHours: '10:00 AM - 10:00 PM',
        address: 'Nanjing East Rd, Huangpu',
        priceLevel: 2,
        placeCategory: 'Shopping Street',
      },
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
      photos: [IMG.yuGarden],
      status: 'Must Do',
      transitToNext: { method: 'metro', duration: 20 },
      coordinates: { lat: 31.2272, lng: 121.4920 },
      place: {
        rating: 4.6,
        reviewCount: 15800,
        openingHours: '8:30 AM - 5:00 PM',
        address: '218 Anren St, Huangpu',
        placeCategory: 'Classical Garden',
      },
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
      coordinates: { lat: 31.2355, lng: 121.4688 },
      place: {
        rating: 4.5,
        reviewCount: 3200,
        openingHours: '7:30 AM - 8:00 PM',
        address: '90 Maoming North Rd, Jing\'an',
        priceLevel: 1,
        placeCategory: 'Dumpling Restaurant',
      },
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
      coordinates: { lat: 31.2100, lng: 121.4400 },
      place: {
        rating: 4.4,
        reviewCount: 5600,
        openingHours: 'Open 24 hours',
        address: 'Former French Concession, Xuhui',
        placeCategory: 'Historic Neighborhood',
      },
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
      coordinates: { lat: 31.2150, lng: 121.4450 },
      place: {
        rating: 4.3,
        reviewCount: 1800,
        openingHours: '11:30 AM - 10:30 PM',
        address: '38 Gaoyou Rd, Xuhui',
        priceLevel: 3,
        placeCategory: 'Yunnan Restaurant',
      },
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
      coordinates: { lat: 31.2565, lng: 121.4581 },
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
      coordinates: { lat: 31.3238, lng: 120.6220 },
      place: {
        rating: 4.7,
        reviewCount: 9400,
        openingHours: '7:30 AM - 5:30 PM',
        address: '178 Dongbei St, Gusu, Suzhou',
        placeCategory: 'UNESCO Garden',
      },
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
      coordinates: { lat: 31.3180, lng: 120.6320 },
      place: {
        rating: 4.4,
        reviewCount: 4100,
        openingHours: 'Open 24 hours',
        address: 'Pingjiang Rd, Gusu, Suzhou',
        priceLevel: 1,
        placeCategory: 'Historic Street Food',
      },
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
      coordinates: { lat: 31.2335, lng: 121.5016 },
      place: {
        rating: 4.6,
        reviewCount: 7200,
        openingHours: '8:30 AM - 9:30 PM',
        address: '501 Yincheng Middle Rd, Pudong',
        priceLevel: 3,
        placeCategory: 'Observation Deck',
      },
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
      coordinates: { lat: 22.3080, lng: 113.9185 },
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
      coordinates: { lat: 22.2988, lng: 114.1722 },
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
      photos: [IMG.starFerry],
      status: 'Must Do',
      transitToNext: { method: 'walk', duration: 15 },
      coordinates: { lat: 22.2867, lng: 114.1610 },
      place: {
        rating: 4.6,
        reviewCount: 8900,
        openingHours: '6:30 AM - 11:30 PM',
        address: 'Star Ferry Pier, Central',
        priceLevel: 1,
        placeCategory: 'Ferry',
      },
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
      photos: [IMG.victoriaPeak],
      status: 'Must Do',
      coordinates: { lat: 22.2759, lng: 114.1455 },
      place: {
        rating: 4.7,
        reviewCount: 21000,
        openingHours: '10:00 AM - 11:00 PM',
        address: '33 Garden Rd, Central',
        priceLevel: 2,
        placeCategory: 'Scenic Viewpoint',
      },
      notes: 'Buy combo ticket for tram + Sky Terrace',
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
      imageUrl: IMG.dimSum,
      photos: [IMG.dimSum],
      status: 'Must Do',
      transitToNext: { method: 'metro', duration: 25 },
      coordinates: { lat: 22.3210, lng: 114.1690 },
      place: {
        rating: 4.4,
        reviewCount: 6800,
        openingHours: '9:00 AM - 9:00 PM',
        address: '2-20 Kwong Wa St, Mong Kok',
        priceLevel: 1,
        placeCategory: 'Dim Sum Restaurant',
      },
      tags: ['food', 'local-favorite'],
    },
    {
      id: 'hk-d4-2',
      time: '11:30 AM',
      title: 'Big Buddha & Ngong Ping',
      type: 'activity',
      duration: 240,
      votes: { up: 14, down: 3 },
      comments: [],
      imageUrl: IMG.bigBuddha,
      photos: [IMG.bigBuddha],
      status: 'Optional',
      transitToNext: { method: 'metro', duration: 45 },
      coordinates: { lat: 22.2540, lng: 113.9050 },
      place: {
        rating: 4.5,
        reviewCount: 11200,
        openingHours: '10:00 AM - 5:30 PM',
        address: 'Ngong Ping, Lantau Island',
        placeCategory: 'Temple & Monument',
      },
    },
    {
      id: 'hk-d4-3',
      time: '05:00 PM',
      title: 'Temple Street Night Market',
      type: 'shopping',
      duration: 120,
      votes: { up: 10, down: 2 },
      comments: [],
      imageUrl: IMG.nightMarket,
      photos: [IMG.nightMarket],
      status: 'Optional',
      coordinates: { lat: 22.3050, lng: 114.1700 },
      place: {
        rating: 4.1,
        reviewCount: 5400,
        openingHours: '4:00 PM - 12:00 AM',
        address: 'Temple St, Yau Ma Tei',
        priceLevel: 1,
        placeCategory: 'Night Market',
      },
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
      coordinates: { lat: 22.2517, lng: 113.8622 },
      place: {
        rating: 4.3,
        reviewCount: 3200,
        openingHours: 'Open 24 hours',
        address: 'Tai O, Lantau Island',
        placeCategory: 'Fishing Village',
      },
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
      coordinates: { lat: 22.2933, lng: 114.1717 },
      place: {
        rating: 4.4,
        reviewCount: 2800,
        openingHours: '10:00 AM - 6:00 PM',
        address: '10 Salisbury Rd, Tsim Sha Tsui',
        placeCategory: 'Art Museum',
      },
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
      coordinates: { lat: 22.3035, lng: 114.1603 },
      place: {
        rating: 4.2,
        reviewCount: 2100,
        openingHours: '5:00 PM - 1:00 AM',
        address: 'ICC, 1 Austin Rd W, Tsim Sha Tsui',
        priceLevel: 4,
        placeCategory: 'Rooftop Bar',
      },
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
      coordinates: { lat: 34.4347, lng: 135.2440 },
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
      photos: [IMG.dotonbori],
      status: 'Must Do',
      coordinates: { lat: 34.6687, lng: 135.5019 },
      place: {
        rating: 4.5,
        reviewCount: 18600,
        openingHours: 'Open 24 hours',
        address: 'Dotonbori, Chuo Ward',
        priceLevel: 2,
        placeCategory: 'Street Food District',
      },
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
      photos: [IMG.osakaCastle],
      status: 'Must Do',
      coordinates: { lat: 34.6873, lng: 135.5262 },
      place: {
        rating: 4.5,
        reviewCount: 14200,
        openingHours: '9:00 AM - 5:00 PM',
        address: '1-1 Osakajo, Chuo Ward',
        priceLevel: 1,
        placeCategory: 'Castle',
      },
    },
    {
      id: 'os-d7-2',
      time: '03:00 PM',
      title: 'Shinsekai & Tsutenkaku Tower',
      type: 'activity',
      duration: 120,
      votes: { up: 9, down: 1 },
      comments: [],
      imageUrl: IMG.shinsekai,
      photos: [IMG.shinsekai],
      status: 'Optional',
      coordinates: { lat: 34.6524, lng: 135.5063 },
      place: {
        rating: 4.2,
        reviewCount: 6800,
        openingHours: '10:00 AM - 8:00 PM',
        address: 'Ebisuhigashi, Naniwa Ward',
        priceLevel: 1,
        placeCategory: 'Retro District',
      },
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
      imageUrl: IMG.kuromonMarket,
      photos: [IMG.kuromonMarket],
      status: 'Must Do',
      coordinates: { lat: 34.6627, lng: 135.5070 },
      place: {
        rating: 4.3,
        reviewCount: 9100,
        openingHours: '8:00 AM - 5:00 PM',
        address: '2-4-1 Nipponbashi, Chuo Ward',
        priceLevel: 2,
        placeCategory: 'Food Market',
      },
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
      coordinates: { lat: 34.6625, lng: 135.5010 },
      place: {
        rating: 4.3,
        reviewCount: 7600,
        openingHours: '10:00 AM - 9:00 PM',
        address: 'Shinsaibashisuji, Chuo Ward',
        priceLevel: 2,
        placeCategory: 'Shopping Arcade',
      },
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
      coordinates: { lat: 34.9856, lng: 135.7588 },
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
      photos: [IMG.fushimiInari],
      status: 'Must Do',
      coordinates: { lat: 34.9671, lng: 135.7727 },
      place: {
        rating: 4.8,
        reviewCount: 32000,
        openingHours: 'Open 24 hours',
        address: '68 Fukakusa Yabunouchicho, Fushimi',
        placeCategory: 'Shinto Shrine',
      },
      notes: 'Start before 8am for empty torii gate photos',
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
      photos: [IMG.arashiyama],
      status: 'Must Do',
      coordinates: { lat: 35.0170, lng: 135.6713 },
      place: {
        rating: 4.6,
        reviewCount: 19500,
        openingHours: 'Open 24 hours',
        address: 'Sagaogurayama, Ukyo Ward',
        placeCategory: 'Natural Landmark',
      },
    },
    {
      id: 'ky-d10-2',
      time: '01:00 PM',
      title: 'Kinkaku-ji Golden Pavilion',
      type: 'activity',
      duration: 90,
      votes: { up: 17, down: 1 },
      comments: [],
      imageUrl: IMG.kinkakuji,
      photos: [IMG.kinkakuji],
      status: 'Must Do',
      coordinates: { lat: 35.0394, lng: 135.7292 },
      place: {
        rating: 4.7,
        reviewCount: 24800,
        openingHours: '9:00 AM - 5:00 PM',
        address: '1 Kinkakujicho, Kita Ward',
        priceLevel: 1,
        placeCategory: 'Temple',
      },
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
      coordinates: { lat: 35.0050, lng: 135.7648 },
      place: {
        rating: 4.4,
        reviewCount: 11200,
        openingHours: '9:00 AM - 6:00 PM',
        address: 'Nishikikoji-dori, Nakagyo Ward',
        priceLevel: 2,
        placeCategory: 'Food Market',
      },
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
      imageUrl: IMG.teaCeremony,
      photos: [IMG.teaCeremony],
      status: 'Optional',
      coordinates: { lat: 35.0032, lng: 135.7780 },
      place: {
        rating: 4.8,
        reviewCount: 1400,
        openingHours: '10:00 AM - 4:00 PM',
        address: 'Gion, Higashiyama Ward',
        priceLevel: 2,
        placeCategory: 'Cultural Experience',
      },
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
      coordinates: { lat: 35.6812, lng: 139.7671 },
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
      photos: [IMG.shibuya],
      status: 'Must Do',
      coordinates: { lat: 35.6595, lng: 139.7004 },
      place: {
        rating: 4.5,
        reviewCount: 28000,
        openingHours: 'Open 24 hours',
        address: 'Dogenzaka, Shibuya',
        placeCategory: 'Iconic Crossing',
      },
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
      photos: [IMG.teamLab],
      status: 'Booked',
      coordinates: { lat: 35.6601, lng: 139.7301 },
      place: {
        rating: 4.8,
        reviewCount: 16400,
        openingHours: '10:00 AM - 7:00 PM',
        address: 'Azabudai Hills, 1-2-4 Azabudai, Minato',
        priceLevel: 3,
        placeCategory: 'Digital Art Museum',
      },
      notes: 'Wear white for best experience. Tickets pre-booked.',
      tags: ['art', 'pre-booked'],
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
      imageUrl: IMG.tsukiji,
      photos: [IMG.tsukiji],
      status: 'Must Do',
      coordinates: { lat: 35.6654, lng: 139.7707 },
      place: {
        rating: 4.4,
        reviewCount: 13800,
        openingHours: '5:00 AM - 2:00 PM',
        address: '4-16-2 Tsukiji, Chuo',
        priceLevel: 2,
        placeCategory: 'Food Market',
      },
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
      coordinates: { lat: 40.0799, lng: 116.6031 },
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
      photos: [IMG.greatWall],
      status: 'Must Do',
      coordinates: { lat: 40.4319, lng: 116.5604 },
      place: {
        rating: 4.9,
        reviewCount: 45000,
        openingHours: '7:30 AM - 5:30 PM',
        address: 'Mutianyu, Huairou District',
        priceLevel: 2,
        placeCategory: 'UNESCO World Heritage',
      },
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
      photos: [IMG.forbiddenCity],
      status: 'Must Do',
      coordinates: { lat: 39.9163, lng: 116.3972 },
      place: {
        rating: 4.8,
        reviewCount: 38000,
        openingHours: '8:30 AM - 5:00 PM',
        address: '4 Jingshan Front St, Dongcheng',
        priceLevel: 1,
        placeCategory: 'Palace Museum',
      },
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
    const activities = activityFn ? activityFn() : [];
    const city = getCityForDay(i);

    // Auto-assign timezone to all activities based on city
    const tz = CITY_TIMEZONE[city];
    for (const activity of activities) {
      if (!activity.timezone) {
        activity.timezone = tz;
      }
    }

    // Auto-detect day intention based on activity patterns
    let intention: ItineraryDay['intention'];
    if (activities.length === 0) {
      intention = 'unplanned';
    } else {
      const hasFlightOrTransport = activities.some(
        (a) => a.type === 'flight' || a.type === 'transport'
      );
      if (hasFlightOrTransport && activities.length <= 2) {
        intention = 'travel';
      } else {
        intention = 'planned';
      }
    }

    days.push({
      dayIndex: i,
      date,
      fullDate,
      city,
      activities,
      intention,
    });
  }

  return days;
}
