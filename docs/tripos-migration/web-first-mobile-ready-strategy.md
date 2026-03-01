# Web-First, Mobile-Ready: TripOS Development Strategy

## Executive Summary

**Strategy**: Build a fully-functional web application first, then develop native mobile apps (iOS/Android) once product-market fit is validated.

**Why This Works**:

- ✅ Faster validation (no App Store approval delays)
- ✅ Rapid iteration (deploy updates instantly)
- ✅ Single codebase initially (lower complexity)
- ✅ Learn what users actually need before building mobile
- ✅ Reusable backend infrastructure for both platforms

**Timeline**:

- Months 1-3: Web app development
- Months 4-6: Validation, user feedback, iteration
- Months 7-12: Native mobile development (if validated)

---

## Core Philosophy: Design for Both from Day One

Even though you're building web first, every technical decision should consider: **"Will this work on mobile later?"**

### Platform Use Cases

| Activity | Platform | Why |
|----------|----------|-----|
| **Creating trip** | Desktop | Faster typing, better overview |
| **Building itinerary** | Desktop | Multiple tabs, calendar view, research |
| **Budget planning** | Desktop | Spreadsheet-style view preferred |
| **Inviting collaborators** | Desktop | Easier to type emails |
| **Voting on options** | Mobile | Quick swipe decisions on the go |
| **Adding suggestions** | Mobile | "Just saw a cool restaurant" → instant add |
| **Checking itinerary** | Mobile | "What's next?" while traveling |
| **Logging expenses** | Mobile | Snap receipt at restaurant |
| **Offline access** | Mobile | No WiFi while traveling |

---

## Architecture Principles for Mobile Readiness

### 1. API-First Design

**Rule**: Never put business logic in the frontend. Always use backend functions.

**Why**: Mobile app will call the same API endpoints.

**Example**:

```javascript
// ❌ BAD: Logic in React component
const handleVoteApproval = async (optionId) => {
  const votes = await supabase.from('votes').select('*').eq('option_id', optionId)
  const yesVotes = votes.filter(v => v.vote === true).length
  const totalMembers = await supabase.from('trip_collaborators').select('*')
  const threshold = Math.ceil(totalMembers.length * 0.7)
  
  if (yesVotes >= threshold) {
    await supabase.from('voting_options').update({ status: 'locked' }).eq('id', optionId)
  }
}

// ✅ GOOD: Logic in backend function
const handleVoteApproval = async (optionId) => {
  await supabase.functions.invoke('check-vote-consensus', { 
    optionId 
  })
}
```

**Backend function** (Supabase Edge Function):

```typescript
// supabase/functions/check-vote-consensus/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from '@supabase/supabase-js'

serve(async (req) => {
  const { optionId } = await req.json()
  
  // Business logic here
  const votes = await supabase.from('votes')...
  // Calculate consensus, update status
  
  return new Response(JSON.stringify({ success: true }))
})
```

**Benefit**: Mobile app calls the same function. Logic is in one place.

---

### 2. Responsive Design from Day One

**Rule**: Every feature must work on mobile viewport (375px width), even if it's not optimized.

**Breakpoints**:

```css
/* Mobile: 375px - 768px */
/* Tablet: 768px - 1024px */  
/* Desktop: 1024px+ */
```

**Why**: Forces you to think mobile-first. Prevents desktop-only patterns that can't be adapted later.

**Example**:

```jsx
// Desktop: Calendar grid
<div className="hidden md:grid grid-cols-7 gap-4">
  {days.map(day => <DayColumn />)}
</div>

// Mobile: Scrollable list
<div className="md:hidden space-y-4">
  {days.map(day => <DayCard />)}
</div>
```

**Test every feature** on Chrome DevTools mobile viewport before marking it "done."

---

### 3. Avoid Desktop-Only Patterns

**Patterns that DON'T translate to mobile**:

| Desktop Pattern | Why It Fails on Mobile | Mobile Alternative |
|-----------------|------------------------|-------------------|
| Hover states | No hover on touch | Use tap/long-press |
| Right-click menus | No right-click | Use bottom sheet menu |
| Drag-and-drop | Clunky on touch | Use handle icon + simplified drag |
| Multiple sidebars | Screen too narrow | Collapsible navigation |
| Tooltips on hover | No hover | Tap-to-show info icon |
| Keyboard shortcuts | No keyboard | On-screen buttons |

**Use patterns that work everywhere**:

- ✅ Click/tap buttons
- ✅ Modal dialogs
- ✅ Swipeable cards (works on desktop with mouse drag)
- ✅ Bottom sheets (works on desktop as modal)
- ✅ Pull-to-refresh (works on desktop as button)

---

### 4. Image Strategy for Multiple Screens

**Rule**: Store images in multiple sizes from day one.

**Why**: Mobile users shouldn't download 4K desktop images on 4G.

**Implementation**:

```javascript
// When uploading to Supabase Storage
const uploadImage = async (file) => {
  // Upload original
  await supabase.storage.from('images').upload(`${id}/original.jpg`, file)
  
  // Generate thumbnails (Supabase Image Transformation)
  // Mobile: 375px wide
  // Tablet: 768px wide
  // Desktop: 1920px wide
}

// When fetching
const getImageUrl = (id, size = 'medium') => {
  return supabase.storage
    .from('images')
    .getPublicUrl(`${id}/original.jpg`, {
      transform: {
        width: size === 'thumb' ? 375 : size === 'medium' ? 768 : 1920,
        quality: 80
      }
    })
}
```

---

### 5. Real-Time Sync Architecture

**Rule**: Use Supabase real-time subscriptions for all collaborative features.

**Why**: Works identically on web and mobile. No separate implementation needed.

**Implementation**:

```javascript
// This exact code works on web AND mobile
useEffect(() => {
  const channel = supabase
    .channel(`trip-${tripId}`)
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'activities',
        filter: `trip_id=eq.${tripId}`
      },
      (payload) => {
        // Refresh data when changes occur
        queryClient.invalidateQueries(['activities', tripId])
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [tripId])
```

**Benefit**: Write once, works everywhere. Mobile app uses identical subscription logic.

---

### 6. Authentication Strategy

**Rule**: Use OAuth providers that work on mobile.

**Initial Setup** (Web):

- Email/password (works everywhere)
- Google OAuth (works on web + mobile)
- Apple OAuth (works on web + mobile, required for iOS)

**Later** (Mobile):

- Apple Sign-In (required for App Store)
- Google Sign-In (native SDK for better UX)
- Biometric auth (fingerprint/face ID)

**Implementation**:

```javascript
// Supabase Auth - same backend for both platforms
// Web
await supabase.auth.signInWithOAuth({ provider: 'google' })

// Mobile (later, using native SDKs)
// React Native handles OAuth differently but hits same Supabase backend
```

---

### 7. State Management

**Rule**: Keep state management simple and portable.

**Recommended**: Zustand (lightweight, easy to port to React Native)

**Avoid**: Redux (too complex, not worth it for this app)

**Example**:

```javascript
// store/tripStore.ts
import create from 'zustand'

interface TripState {
  currentTrip: Trip | null
  activities: Activity[]
  setCurrentTrip: (trip: Trip) => void
  addActivity: (activity: Activity) => void
}

export const useTripStore = create<TripState>((set) => ({
  currentTrip: null,
  activities: [],
  setCurrentTrip: (trip) => set({ currentTrip: trip }),
  addActivity: (activity) => set((state) => ({ 
    activities: [...state.activities, activity] 
  }))
}))
```

**Why**: This exact same store works in React Native with zero changes.

---

## Database Schema (Shared Foundation)

This schema works for **both web and mobile**. Design it once, use it forever.

### Core Tables

```sql
-- Users (handled by Supabase Auth)
-- You reference auth.users(id)

-- Trips
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  total_budget DECIMAL(10,2),
  currency TEXT DEFAULT 'EUR',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Destinations (multi-city trips)
CREATE TABLE destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  country TEXT,
  nights INTEGER NOT NULL,
  order_index INTEGER NOT NULL,
  arrival_date DATE NOT NULL,
  departure_date DATE NOT NULL
);

-- Activities (the atomic unit)
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES destinations(id),
  day_number INTEGER NOT NULL,
  time TIME,
  name TEXT NOT NULL,
  description TEXT,
  cost DECIMAL(10,2),
  currency TEXT DEFAULT 'EUR',
  booking_url TEXT,
  booking_status TEXT CHECK (booking_status IN ('not_started', 'to_book', 'booked', 'sold_out')),
  category TEXT, -- 'transport', 'accommodation', 'food', 'activity', 'other'
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Collaborators (group members)
CREATE TABLE trip_collaborators (
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('organizer', 'member')),
  invitation_status TEXT CHECK (invitation_status IN ('pending', 'accepted', 'declined')),
  invited_at TIMESTAMP DEFAULT NOW(),
  joined_at TIMESTAMP,
  PRIMARY KEY (trip_id, user_id)
);

-- Budget Categories
CREATE TABLE budget_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- 'flights', 'hotels', 'food', 'activities', 'transport', 'other'
  estimated_amount DECIMAL(10,2),
  actual_amount DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'EUR'
);

-- Expenses (logged during trip)
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  description TEXT,
  receipt_url TEXT, -- Supabase Storage URL
  location TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Voting Options (for group decisions)
CREATE TABLE voting_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('hotel', 'activity', 'restaurant', 'other')),
  name TEXT NOT NULL,
  description TEXT,
  cost DECIMAL(10,2),
  currency TEXT DEFAULT 'EUR',
  url TEXT,
  image_url TEXT,
  voting_deadline TIMESTAMP,
  status TEXT CHECK (status IN ('active', 'locked', 'rejected')) DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Votes (individual member votes)
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  option_id UUID REFERENCES voting_options(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  vote BOOLEAN NOT NULL, -- true = yes, false = no
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(option_id, user_id)
);

-- Member Budgets (blind budgeting - kept private)
CREATE TABLE member_budgets (
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  max_budget DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (trip_id, user_id)
);

-- Tasks (distributed work)
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'done')) DEFAULT 'not_started',
  due_date DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Suggestions (members propose activities)
CREATE TABLE suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  type TEXT CHECK (type IN ('activity', 'restaurant', 'hotel', 'other')),
  name TEXT NOT NULL,
  description TEXT,
  cost DECIMAL(10,2),
  url TEXT,
  image_url TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Booking Deadlines (time-sensitive alerts)
CREATE TABLE booking_deadlines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  activity_name TEXT NOT NULL,
  venue_name TEXT,
  booking_url TEXT,
  deadline_date TIMESTAMP NOT NULL,
  alert_days_before INTEGER[] DEFAULT ARRAY[30, 14, 7, 3, 1], -- When to send reminders
  reminder_sent BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pre-Trip Checklist Items
CREATE TABLE checklist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'visa', 'insurance', 'apps', 'payment', 'health', 'other'
  due_days_before INTEGER, -- How many days before trip this is due
  completed BOOLEAN DEFAULT FALSE,
  completed_by UUID REFERENCES auth.users(id),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security (RLS) Policies

**Critical**: Set up RLS so users can only access their own data.

```sql
-- Example: Users can only see trips they're part of
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own trips"
  ON trips FOR SELECT
  USING (
    created_by = auth.uid() 
    OR id IN (
      SELECT trip_id FROM trip_collaborators 
      WHERE user_id = auth.uid() AND invitation_status = 'accepted'
    )
  );

CREATE POLICY "Users can update trips they organize"
  ON trips FOR UPDATE
  USING (created_by = auth.uid());

-- Example: Members can view activities for their trips
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view activities for their trips"
  ON activities FOR SELECT
  USING (
    trip_id IN (
      SELECT trip_id FROM trip_collaborators 
      WHERE user_id = auth.uid() AND invitation_status = 'accepted'
    )
  );

CREATE POLICY "Only organizers can modify activities"
  ON activities FOR INSERT
  USING (
    trip_id IN (
      SELECT trip_id FROM trip_collaborators 
      WHERE user_id = auth.uid() AND role = 'organizer'
    )
  );

-- Apply similar policies to all tables
```

**Why**: Same security model works for web and mobile. No separate auth logic needed.

---

## Web App Feature Roadmap

### Phase 1: Core Trip Creation (Weeks 1-2)

**Goal**: Organizer can create a trip and build an itinerary

#### Features

- [ ] Landing page with "Create Trip" CTA
- [ ] User authentication (email/password + Google OAuth)
- [ ] Trip creation form (name, start date, end date)
- [ ] Add destinations with nights allocation
- [ ] Day-by-day itinerary builder
- [ ] Add activity form (name, time, cost, booking URL, status)
- [ ] Edit/delete activities
- [ ] List view (mobile-friendly)
- [ ] Calendar grid view (desktop only for now)

#### UI Components Needed

- Navigation bar (logo, user menu)
- Trip creation modal
- Destination card
- Activity card
- Activity form modal
- Calendar grid (desktop)
- Day list (mobile)

#### Success Metric

- You can plan your own Asia trip in the app
- 10 test users can create a trip without confusion

---

### Phase 2: Budget Tracker (Weeks 3-4)

**Goal**: Users can plan and track trip finances

#### Features

- [ ] Budget setup wizard (total budget + category breakdown)
- [ ] Category budget cards (Flights, Hotels, Food, Activities, Transport, Other)
- [ ] Estimated vs. actual cost tracking
- [ ] Progress bars per category (visual feedback)
- [ ] Expense form (quick add during trip)
- [ ] Multi-currency support (display in EUR, but log in local currency)
- [ ] Budget summary on trip overview
- [ ] Spending alerts ("Food budget 90% used")

#### UI Components Needed

- Budget setup modal
- Category budget card
- Progress bar component
- Expense form modal
- Currency selector
- Budget chart (pie chart or bar chart)

#### Success Metric

- Users track at least 5 expenses during a test trip
- Budget alerts trigger correctly

---

### Phase 3: Collaboration & Real-Time Sync (Weeks 5-6)

**Goal**: Enable group trips with multiple users

#### Features

- [ ] Invite collaborators via email
- [ ] Invitation email template
- [ ] Role-based permissions (Organizer vs. Member)
- [ ] Real-time sync (Supabase subscriptions)
- [ ] Presence indicators ("Sarah is viewing this trip")
- [ ] Activity feed ("Mike added a restaurant")
- [ ] Member list with roles
- [ ] Remove collaborators (organizer only)

#### Technical Implementation

```javascript
// Real-time subscription
const channel = supabase
  .channel(`trip-${tripId}`)
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'activities' },
    () => queryClient.invalidateQueries(['activities'])
  )
  .on('presence', { event: 'sync' }, () => {
    // Show who's online
  })
  .subscribe()
```

#### Success Metric

- 5 groups create trips with 4+ members
- Real-time updates work without manual refresh
- No sync conflicts (last-write-wins works)

---

### Phase 4: Voting System (Weeks 7-8)

**Goal**: Group consensus on hotels/activities

#### Features

- [ ] Organizer adds voting options (3 hotels, for example)
- [ ] Voting card UI (desktop: thumbs up/down, mobile: swipeable later)
- [ ] Vote tallies (hidden until threshold reached)
- [ ] Consensus threshold settings (100%, 75%, 50% or majority)
- [ ] "Locked" status when consensus achieved
- [ ] Voting deadline notifications (email for now)
- [ ] Vote history ("You voted Yes on Hotel A")

#### UI Components

- Voting option card
- Vote button (thumbs up/down)
- Consensus progress bar
- Locked indicator
- Voting deadline timer

#### Technical Implementation

```javascript
// Supabase Edge Function: check-vote-consensus
export async function checkVoteConsensus(optionId: string) {
  const votes = await supabase.from('votes')
    .select('vote')
    .eq('option_id', optionId)
  
  const members = await supabase.from('trip_collaborators')
    .select('user_id')
    .eq('invitation_status', 'accepted')
  
  const yesVotes = votes.filter(v => v.vote === true).length
  const threshold = Math.ceil(members.length * 0.7) // 70% consensus
  
  if (yesVotes >= threshold) {
    await supabase.from('voting_options')
      .update({ status: 'locked' })
      .eq('id', optionId)
  }
}
```

#### Success Metric

- 10 groups successfully vote and lock a hotel
- No confusion about voting status
- Notifications sent correctly

---

### Phase 5: Blind Budgeting (Weeks 9-10)

**Goal**: Remove financial awkwardness from group trips

#### Features

- [ ] Private budget input for each member
- [ ] Budget collection modal (appears once when joining trip)
- [ ] "Everyone can afford up to €X" reveal (organizer sees group max, not individuals)
- [ ] Filter voting options by group budget
- [ ] Budget range indicator on voting options
- [ ] "Above budget" warning on expensive options
- [ ] Budget update feature (members can revise their max)

#### Privacy Implementation

```sql
-- Only show group minimum, never individual amounts
CREATE FUNCTION get_group_budget_max(trip_id UUID)
RETURNS DECIMAL AS $$
  SELECT MIN(max_budget) 
  FROM member_budgets 
  WHERE trip_id = trip_id
$$ LANGUAGE SQL SECURITY DEFINER;

-- Organizer calls this function, gets group max only
```

#### UI Flow

1. Member joins trip → Modal: "What's your maximum budget?"
2. Member inputs €500 → Saved privately
3. Organizer sees: "Everyone can afford up to €450/person" (lowest budget in group)
4. Voting options show: "€400 ✅ Within budget" or "€600 ⚠️ Above budget"

#### Success Metric

- Users report they avoided "awkward money conversation"
- 80%+ of members input their budget without confusion
- No privacy leaks (individual budgets stay hidden)

---

### Phase 6: Task Assignment & Checklists (Weeks 11-12)

**Goal**: Distribute work and automate reminders

#### Features

- [ ] Task creation (organizer assigns tasks to members)
- [ ] Task list view (grouped by status)
- [ ] Task assignment notifications
- [ ] Task status updates (Not Started | In Progress | Done)
- [ ] Pre-trip checklist templates (visa, insurance, apps, payment)
- [ ] Customizable checklist items
- [ ] Automated reminders (30 days out, 7 days out, 1 day out)
- [ ] Task completion tracking

#### Pre-Trip Checklist Templates

**Template: International Trip (Asia)**

- [ ] 90 days before: Apply for visa if needed
- [ ] 60 days before: Book flights
- [ ] 45 days before: Book hotels
- [ ] 30 days before: Purchase travel insurance
- [ ] 30 days before: Notify bank of travel dates
- [ ] 14 days before: Download VPN (for China)
- [ ] 14 days before: Purchase eSIM
- [ ] 7 days before: Download offline maps
- [ ] 7 days before: Download translation apps
- [ ] 3 days before: Check passport validity (6+ months)
- [ ] 1 day before: Print booking confirmations
- [ ] 1 day before: Pack based on weather forecast

#### Success Metric

- 80% of assigned tasks get completed before departure
- Users report less nagging/"Who's doing what?" confusion
- Reminders sent at correct times

---

## Features Deferred to Mobile App

These features are **mobile-first experiences** and should NOT be built in the web app:

### 1. Tinder-Style Swipe Voting ❌ (Web: Use buttons instead)

**Why**: Swipe gestures feel natural on mobile, clunky on desktop
**Web alternative**: Thumbs up/down buttons
**Mobile**: Full swipeable card stack with animations

### 2. Receipt Camera Scanning ❌ (Web: Upload image instead)

**Why**: Desktop users rarely have receipts to scan
**Web alternative**: Upload image file or enter manually
**Mobile**: Camera opens directly, AI extracts amount/category

### 3. Offline-First Architecture ❌ (Web: Requires internet)

**Why**: Desktop users typically have stable WiFi
**Web alternative**: Show "No internet" banner, queue failed requests
**Mobile**: Full offline support with local database (SQLite)

### 4. Native Push Notifications ❌ (Web: Use email)

**Why**: Web push is unreliable, especially on iOS Safari
**Web alternative**: Email notifications
**Mobile**: Native push via FCM (Firebase Cloud Messaging)

### 5. "Add Suggestion on the Go" ❌ (Web: Desktop form is fine)

**Why**: The whole point is quick capture while walking around
**Web alternative**: Full form (works, but not as fast)
**Mobile**: Quick capture (photo + name + submit in 10 seconds)

### 6. Live Location Sharing ❌ (Not needed on web)

**Why**: Desktop users aren't walking around a city
**Web alternative**: Don't build this
**Mobile**: Optional "Share my location" during trip (for meetups)

### 7. Today's Itinerary Widget ❌ (Not useful on desktop)

**Why**: You're not checking your laptop while walking around Rome
**Web alternative**: Don't build this
**Mobile**: Home screen widget showing next 3 activities

---

## Transition Plan: When to Build Mobile

### Criteria for Starting Mobile Development

**Milestone 1: Product-Market Fit ✅**

- 1,000+ registered users
- 500+ trips created
- 100+ group trips (4+ members)
- 20%+ conversion rate (trips → actual bookings)
- Users explicitly asking: "When's the mobile app?"

**Milestone 2: Revenue Validation ✅**

- Affiliate revenue generating €1,000+/month
- Clear understanding of LTV (Lifetime Value) per user
- Willingness to pay for premium features validated
- Capital available (€20K-50K for 3-6 months development)

**Milestone 3: Technical Readiness ✅**

- Backend API is stable (no major breaking changes expected)
- Database schema is finalized (no major restructures)
- Authentication flow is proven and secure
- Real-time sync works reliably under load
- Edge functions are well-tested

**Timeline**: If web app launches Month 1, consider mobile in Month 6-9.

---

### Mobile App MVP Scope

When you do build mobile, **don't rebuild everything**. Focus on:

#### P0 (Must-Have for Mobile)

- [ ] Authentication (same Supabase backend)
- [ ] View trip overview
- [ ] View day-by-day itinerary
- [ ] **Tinder-style swipe voting** (the killer mobile feature)
- [ ] Add suggestion (quick capture: photo + name)
- [ ] Log expense (camera receipt scan)
- [ ] Check budget status
- [ ] Offline support (view itinerary without internet)
- [ ] Push notifications (voting deadlines, task reminders)

#### P1 (Add After Mobile MVP Works)

- [ ] Edit activities (members request changes)
- [ ] Task management (mark tasks complete)
- [ ] Real-time chat (for trip coordination)
- [ ] Maps integration (directions to activities)
- [ ] Weather widget per day

#### P2 (Much Later)

- [ ] Create trip on mobile (most will still do this on desktop)
- [ ] Full budget editing (too complex for mobile)
- [ ] Advanced itinerary builder (desktop is better for this)

---

### Mobile Tech Stack Recommendation

**React Native + Expo** (when you're ready)

**Why**:

- ✅ You already know React
- ✅ ~70% code reuse from web (same business logic)
- ✅ One codebase for iOS + Android
- ✅ Expo handles native features (camera, push, offline)
- ✅ Same Supabase JS SDK (no backend changes)

**Stack**:

```
React Native 0.73+
Expo SDK 50+
TypeScript
React Navigation (routing)
TanStack Query (same as web!)
Zustand (same store as web!)
Supabase JS (same backend!)
```

**What stays the same**:

- Database schema (no changes)
- API endpoints (no changes)
- Authentication (same Supabase Auth)
- Real-time subscriptions (same Supabase Realtime)
- State management (same Zustand stores)

**What's new**:

- UI components (native mobile components)
- Navigation (React Navigation instead of React Router)
- Offline storage (SQLite instead of browser localStorage)
- Camera (Expo Camera API)
- Push notifications (Expo Notifications API)

---

## Key Takeaways

### ✅ Do This (Web Development)

1. **Design API-first** - All logic in backend functions
2. **Test mobile viewport** - Every feature works at 375px width
3. **Use Supabase real-time** - Works identically on mobile later
4. **Keep it simple** - Avoid desktop-only patterns
5. **Think responsive** - Mobile layout from day one
6. **Use portable state** - Zustand works on React Native
7. **Store multiple image sizes** - Prepare for mobile screens

### ❌ Don't Do This (Web Development)

1. **Don't build mobile-first features** - Save swipe voting, camera scan for mobile
2. **Don't use hover-only interactions** - Won't work on touch
3. **Don't build complex offline sync** - Wait for mobile
4. **Don't use desktop-only libraries** - Check React Native compatibility
5. **Don't embed logic in components** - Backend functions instead
6. **Don't ignore responsive design** - Test mobile viewport always

### 🎯 Success Criteria

**After Web App (Month 3)**:

- ✅ 1,000+ users
- ✅ Core features work flawlessly
- ✅ Users asking for mobile app
- ✅ Backend API is stable
- ✅ Revenue validated (affiliates converting)

**Then**: Build mobile with confidence, knowing exactly what users need.

---

## Immediate Action Items

### This Week

1. Set up React + TypeScript + Vite project
2. Create Supabase account and project
3. Design database schema (use tables above)
4. Set up authentication (email + Google OAuth)
5. Build landing page + "Create Trip" flow

### Next Week

1. Trip overview dashboard
2. Add destinations
3. Day-by-day itinerary builder
4. Add activity form
5. Basic styling (Tailwind CSS)

### Week 3

1. Real-time sync setup (Supabase subscriptions)
2. Edit/delete activities
3. Calendar grid view (desktop)
4. Responsive mobile layout
5. Deploy to Vercel

### Week 4

1. Invite collaborators
2. Role-based permissions
3. Budget tracker MVP
4. First user testing with friends

---

## Document Updates

**Last Updated**: February 8, 2026  
**Version**: 1.0  
**Next Review**: After web MVP launch (Month 3)

**Changes Log**:

- Initial strategy document created
- Defined web-first, mobile-later approach
- Outlined 12-week web app roadmap
- Specified mobile transition criteria
- Database schema finalized

---

**Remember**: The goal isn't to build everything. The goal is to build the **minimum needed to validate** that group travel planning is painful enough that people will use your app. Once that's proven, mobile becomes an obvious next step—and you'll have the infrastructure, users, and revenue to make it happen.
