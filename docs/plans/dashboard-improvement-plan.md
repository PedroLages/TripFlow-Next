# Dashboard & Notifications Improvement Plan

**Date:** 2026-02-25
**Scope:** Dashboard page (`Dashboard.tsx`) + Notifications page (`NotificationsPanel.tsx`) + supporting components
**Aesthetic Direction:** Cinematic travel editorial — warm, luxurious, intentional. Think Wallpaper* magazine meets a premium airline lounge app.

---

## Current State Analysis (from Playwright screenshots)

### What's Working
- Hero banner with trip photo is visually striking
- Dark/light theme switching works and looks cohesive
- "Daily Travel Intel" AI widget is a strong concept
- Playfair Display headings + Inter body pairing gives editorial feel
- Glass-panel design system is consistent

### Critical Bugs
1. **Globe component crashes the entire React tree** in environments without WebGL — no ErrorBoundary wrapping it (partially fixed during audit)
2. **Notifications page is completely blank** — clicking "Notifications" in sidebar sets `activeTab='notifications'` but there's NO matching content in the `AnimatePresence` block; only a small popup overlay appears briefly
3. **Notification popup backdrop blocks all interaction** — the `notifications-backdrop` covers the full viewport at `z-index: 99`, preventing clicks on Dashboard nav or anything else once opened

### Design Issues Identified
| Issue | Severity | Location |
|---|---|---|
| Trip cards stack vertically with 320px images — only 1 visible without scroll | High | `Dashboard.tsx:140-205` |
| Right sidebar "Waiting for You" section cut off below fold | High | `Dashboard.tsx:292-319` |
| Collaborator avatars are generic circles with hardcoded Unsplash URLs in CSS | Medium | `Dashboard.css:214-227` |
| "View All" and "View Activity History" links are dead (no handlers) | Medium | `Dashboard.tsx:137, 143` |
| Magic Drafts section has no interaction beyond hover | Medium | `Dashboard.tsx:229-244` |
| No loading states, skeleton screens, or empty states | Medium | Entire dashboard |
| Header right side truncated at viewport edge | Low | `App.tsx:155-196` |
| No responsive breakpoints — layout breaks below 1200px | Low | `Dashboard.css` |
| `pulse` keyframe has CSS typo: `rgba(2fbbf24, 0.7)` is invalid | Low | `Dashboard.css:323` |

---

## Improvement Plan

### Phase 1: Critical Fixes (Bug Squashing)

#### 1.1 Permanent Globe ErrorBoundary
**File:** `Dashboard.tsx`
- Keep the ErrorBoundary wrapping added during audit
- Render `null` as fallback (globe is decorative, not functional)

#### 1.2 Build a Full-Page Notifications View
**Files:** New `NotificationsPage.tsx` + update `App.tsx` routing

Currently the `NotificationsPanel` is a 380px-wide dropdown overlay. When the sidebar "Notifications" nav is clicked, it should render a **full-page notifications center**, not an empty void.

**Implementation:**
- Create `src/components/Notifications/NotificationsPage.tsx` — a full-width notification center
- Keep `NotificationsPanel.tsx` as the quick-access dropdown (triggered by a bell icon in the header, NOT the sidebar)
- Update `App.tsx` `AnimatePresence` block to render `<NotificationsPage />` when `activeTab === 'notifications'`
- Move the `NotificationsPanel` popup trigger from the sidebar nav item to a bell icon in the top header bar

**NotificationsPage layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Notifications                          Filter ▾  Mark  │
│                                         all read        │
├─────────────────────────────────────────────────────────┤
│  TODAY                                                  │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 🟢 Sarah J. commented on Day 2 Itinerary  10m  │    │
│  └─────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 🔵 Alex C. assigned you: Book Kyoto Tickets 2h │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  YESTERDAY                                              │
│  ┌─────────────────────────────────────────────────┐    │
│  │ ✓  Jessica L. uploaded Hotel Reservation PDF    │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  EARLIER                                                │
│  ┌─────────────────────────────────────────────────┐    │
│  │ AI generated 3 dining suggestions for Kyoto     │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

**Features for full-page view:**
- Group notifications by time period (Today / Yesterday / Earlier / This Week)
- Filter tabs: All | Comments | Tasks | Uploads | AI Suggestions
- Each notification is a wider card with more detail + action buttons (Reply, Go to, Dismiss)
- Notification type icons with color coding per category
- Empty state with illustration: "No notifications — go plan something amazing"
- Animated entrance using Framer Motion stagger (consistent with dashboard)

#### 1.3 Fix Notification Backdrop Z-Index Bug
**File:** `NotificationsPanel.css`
- The `.notifications-backdrop` with `position: fixed; inset: 0; z-index: 99` blocks ALL clicks outside the panel including the sidebar navigation
- Fix: scope the backdrop to only the sidebar area, or use `pointer-events` management
- Better approach: move the popup trigger to the header bell icon and position the panel relative to the header, not the sidebar nav item

#### 1.4 Fix CSS Typo in Pulse Animation
**File:** `Dashboard.css:323`
- `rgba(2fbbf24, 0.7)` should be `rgba(251, 191, 36, 0.7)`

---

### Phase 2: Dashboard Layout Redesign

#### 2.1 Horizontal Trip Cards (Side-by-Side)
**File:** `Dashboard.tsx` + `Dashboard.css`

Current trip cards are stacked vertically with massive 320px hero images, meaning you can only see ~1 card without scrolling. Redesign to a **horizontal card grid**:

```
┌──────────────────────┐  ┌──────────────────────┐  ┌─────────────────┐
│ ┌──────────────────┐ │  │ ┌──────────────────┐ │  │    ✨            │
│ │  Japan Circuit    │ │  │ │  Amalfi Coast    │ │  │  Where to next? │
│ │  [photo]         │ │  │ │  [photo]         │ │  │  Let AI draft   │
│ │  Oct 12-26       │ │  │ │  Jun 5-15        │ │  │  your itinerary │
│ │  ████████░░ 45%  │ │  │ │  ██████████ 100% │ │  │                 │
│ │  👥 2  [Open]    │ │  │ │  👥 4  [Open]    │ │  │  [Generate]     │
│ └──────────────────┘ │  │ └──────────────────┘ │  └─────────────────┘
└──────────────────────┘  └──────────────────────┘
```

**Changes:**
- `trip-cards-grid`: change to `grid-template-columns: repeat(auto-fill, minmax(340px, 1fr))`
- Reduce `.trip-card-image` height from 320px to 180px
- Move the "Where to next?" CTA into the grid as the last card, matching card height
- This makes 2-3 trips visible at once without scrolling

#### 2.2 Tighten the Right Sidebar
**File:** `Dashboard.tsx` + `Dashboard.css`

The right sidebar (30% width) has 3 stacked cards: AI Briefing, Team Activity, Waiting for You. The "Waiting for You" section is pushed below the fold.

**Changes:**
- Reduce spacing between sidebar cards from `mt-6` (24px) to `mt-4` (16px)
- Make the AI Briefing card more compact (reduce padding, tighter text)
- Add a max-height with scroll to "Waiting for You" if more than 3 items
- Consider collapsible sections with chevron toggles for Activity and Actions

#### 2.3 Countdown Widget in Hero
**File:** `Dashboard.tsx`

The hero already shows "Upcoming in 14 Days" as a static badge. Upgrade this to a **live countdown** component:

```tsx
// Countdown showing days/hours/minutes
<div className="hero-countdown">
  <div className="countdown-segment">
    <span className="countdown-number">14</span>
    <span className="countdown-label">days</span>
  </div>
  <div className="countdown-segment">
    <span className="countdown-number">06</span>
    <span className="countdown-label">hours</span>
  </div>
  <div className="countdown-segment">
    <span className="countdown-number">32</span>
    <span className="countdown-label">min</span>
  </div>
</div>
```

Style with glassmorphic segments, monospace numbers, subtle pulse animation.

#### 2.4 Weather + Packing Readiness in Hero Quick Actions
**File:** `Dashboard.tsx`

The current hero quick actions (Boarding Passes, 22C Tokyo, Quick Expense) are static buttons. Make them **interactive mini-widgets**:

- **Weather pill**: Show weather icon + temp, click to expand 5-day forecast overlay
- **Packing readiness**: "Packing: 60% ready" progress ring — click to go to packing checklist
- **Boarding pass**: Keep as-is but add a subtle airplane animation on hover
- **Budget snapshot**: "$2,100 / $4,250 spent" mini progress bar

---

### Phase 3: Visual Polish & Motion

#### 3.1 Typography Upgrade
**File:** `index.css`

The frontend-design skill flags Inter as generic. While the Playfair Display heading font is strong, consider upgrading the body font:

**Option A (Recommended):** Keep current pairing but add a distinctive **display weight** for hero text:
- Install `@fontsource/playfair-display/800-italic.css`
- Use Playfair Display 800 italic for the hero destination name ("Japan Circuit") — gives it an editorial magazine cover feel
- Keep Inter for UI text (it's functional and readable at small sizes)

**Option B:** Swap Inter for **DM Sans** or **Satoshi** for a warmer, more premium feel that pairs better with Playfair Display. Both available via fontsource.

#### 3.2 Staggered Page Load Animation
**File:** `Dashboard.tsx`

The current `containerVariants` and `itemVariants` provide basic fade+slide-up. Upgrade to a more cinematic entrance:

```tsx
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};
```

Add `filter: blur()` to the hidden state for a **cinematic focus pull** effect as elements appear.

#### 3.3 Trip Card Hover Interaction
**File:** `Dashboard.css`

Current hover is just `translateY(-4px)` and shadow. Add:
- Image ken-burns zoom already exists (`scale(1.02)`) — increase to `scale(1.06)` for more drama
- Add a subtle color overlay tint on hover (trip's accent color at 10% opacity)
- Reveal a small "arrow" or "Open" indicator that slides in from the right on hover

#### 3.4 Magic Drafts Card Enhancement
**File:** `Dashboard.tsx` + `Dashboard.css`

The Magic Drafts cards have tags + title + "Adopt Trip" link. Enhance:
- Add a **shimmer/sparkle animation** on the "Curated for you by AI" subtitle
- On hover, the "Adopt Trip" button should slide up with a glassmorphic pill appearance
- Add a subtle parallax effect — image shifts slightly opposite to mouse movement (using `onMouseMove`)

#### 3.5 Ambient Background Texture
**File:** `Dashboard.css`

The dashboard background is flat `--bg-base` (#fcfcfc in light). Add a subtle atmospheric layer:
- Light mode: soft radial gradient from warm ivory center to cool white edges, plus a faint noise texture
- Dark mode: subtle gradient from deep navy-black center to charcoal edges
- This creates depth without being distracting

```css
.dashboard-container::before {
  content: '';
  position: fixed;
  inset: 0;
  background: radial-gradient(
    ellipse at 30% 20%,
    rgba(13, 148, 136, 0.03) 0%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
}
```

---

### Phase 4: Functional Improvements

#### 4.1 Collaborator Avatars from Mock Data
**File:** `Dashboard.tsx` + `Dashboard.css`

Currently avatar circles use hardcoded Unsplash URLs in CSS. Fix by:
- Pass actual avatar URLs through trip data (add to `TripData` interface and `MOCK_TRIPS`)
- Render actual `<img>` elements inside avatar circles
- Add a "+N" overflow indicator when collaborators > 3

#### 4.2 Wire Up Dead Links
**Files:** `Dashboard.tsx`, `App.tsx`

- "View All" button in "Your Journeys" header: should scroll to / expand to show all trips
- "View Activity History" in notifications footer: should navigate to notifications page
- "Resolve" buttons in "Waiting for You": should navigate to the relevant trip section (voting, budget, itinerary)
- "Adopt Trip" in Magic Drafts: should open the AI Generator Wizard pre-filled with that draft

#### 4.3 Add Loading Skeleton States
**File:** New `DashboardSkeleton.tsx`

When data is loading (even mock data), show pulsing skeleton cards:
- Hero: gray rectangle with shimmer
- Trip cards: rounded rectangles with shimmer for image, title, progress
- Sidebar cards: text line placeholders with shimmer
- Use CSS `@keyframes shimmer` with gradient animation

#### 4.4 Add Empty State for Zero Trips
**File:** `Dashboard.tsx`

If `trips.length === 0`, show an engaging empty state:
- Illustration or large icon (compass, map, airplane)
- "Your adventure starts here" heading
- "Create your first trip" CTA button pointing to AI wizard
- Subtle particle/confetti animation on the CTA

#### 4.5 Quick-Add Expense from Dashboard
**File:** `Dashboard.tsx`

The hero has a "Quick Expense" button that does nothing. Wire it to open a small modal/sheet:
- Amount input (large, prominent)
- Category picker (Food, Transport, Activity, Accommodation)
- Currency selector
- "Add" button that saves to the trip budget

---

### Phase 5: Responsive Design

#### 5.1 Tablet Breakpoint (768px - 1200px)
**File:** `Dashboard.css`, `App.css`

- Sidebar auto-collapses to icon-only mode
- Dashboard main columns switch from `7fr 3fr` to `1fr` (stack sidebar below)
- Trip cards grid stays at 2 columns
- Hero quick actions wrap to 2x2 grid

#### 5.2 Mobile Breakpoint (< 768px)
**File:** `Dashboard.css`, `App.css`

- Sidebar becomes a bottom tab bar (Dashboard, Trips, Notifications, Settings)
- Hero section becomes full-width with smaller height (200px)
- Trip cards become full-width stacked
- Magic Drafts becomes a horizontal scroll carousel
- Right sidebar content (AI briefing, activity, actions) stacks below trips

---

### Phase 6: Notifications Full Redesign

#### 6.1 NotificationsPage Component
**File:** New `src/components/Notifications/NotificationsPage.tsx`

Full-page notification center with:

**Header:**
- "Notifications" title with unread count badge
- Filter tabs: All | Comments | Tasks | Uploads | AI
- "Mark all as read" action
- Settings gear icon for notification preferences

**Notification Cards:**
- Wider than the popup version (fills content area)
- Show full context: "Sarah J. commented on **Day 2 Itinerary**: 'Should we add Fushimi Inari in the morning?'"
- Action buttons per notification: Reply, View, Dismiss
- Swipe-to-dismiss on mobile (Framer Motion drag gesture)
- Group by date sections with sticky headers

**Notification Types with Distinct Styling:**
- Comments: speech bubble icon, blue accent
- Tasks: checkbox icon, purple accent
- Uploads: cloud-upload icon, green accent
- AI Suggestions: sparkles icon, teal accent
- Booking Confirmations: ticket icon, amber accent
- Voting Reminders: bar-chart icon, coral accent

**Empty State:**
- Illustration of an open suitcase with confetti
- "You're all caught up! Time to plan your next adventure."

#### 6.2 Notification Preferences
**File:** Extend `SettingsModal.tsx` or create inline settings

Allow toggling notification types:
- Comments on my itinerary items
- Task assignments
- File uploads
- AI suggestions
- Voting reminders
- Booking status changes

#### 6.3 Notification Badge System
**File:** `App.tsx` sidebar

- Animate the badge count with a spring animation when it changes
- Add a subtle red pulse/glow to the badge for urgent notifications
- When entering the notifications page, animate the count to 0

---

## Implementation Priority

| Priority | Phase | Effort | Impact |
|---|---|---|---|
| P0 | 1.2 Build Notifications Page | Medium | Fixes completely broken page |
| P0 | 1.3 Fix Backdrop Z-Index | Small | Fixes navigation-blocking bug |
| P0 | 1.4 Fix CSS Typo | Trivial | Bug fix |
| P1 | 2.1 Horizontal Trip Cards | Medium | Major UX improvement |
| P1 | 2.2 Tighten Right Sidebar | Small | Content visibility |
| P1 | 4.1 Fix Collaborator Avatars | Small | Visual quality |
| P1 | 4.2 Wire Up Dead Links | Medium | Functional completeness |
| P2 | 2.3 Countdown Widget | Small | Delight |
| P2 | 3.1 Typography Upgrade | Small | Visual refinement |
| P2 | 3.2 Staggered Load Animation | Small | Delight |
| P2 | 3.3 Trip Card Hover | Small | Polish |
| P2 | 6.1 Full Notifications Page | Large | Complete feature |
| P3 | 3.4 Magic Drafts Enhancement | Medium | Polish |
| P3 | 3.5 Ambient Background | Small | Atmosphere |
| P3 | 4.3 Skeleton Loading | Medium | UX polish |
| P3 | 4.4 Empty State | Small | Edge case |
| P3 | 4.5 Quick Expense Modal | Medium | Functionality |
| P3 | 5.1-5.2 Responsive Design | Large | Mobile support |
| P3 | 6.2-6.3 Notification Prefs/Badges | Medium | Feature completeness |

---

## Files to Create/Modify

### New Files
- `src/components/Notifications/NotificationsPage.tsx` — Full-page notifications center
- `src/components/Notifications/NotificationsPage.css` — Styles for full page
- `src/components/Dashboard/DashboardSkeleton.tsx` — Loading state
- `src/components/Dashboard/CountdownWidget.tsx` — Trip countdown

### Modified Files
- `src/App.tsx` — Add notifications route, move bell to header
- `src/components/Dashboard/Dashboard.tsx` — Layout changes, countdown, avatars
- `src/components/Dashboard/Dashboard.css` — Card grid, hover states, bg texture, fix typo
- `src/components/Notifications/NotificationsPanel.tsx` — Refactor as header dropdown only
- `src/components/Notifications/NotificationsPanel.css` — Fix backdrop, reposition
- `src/index.css` — Typography upgrade, noise texture utility
- `src/App.css` — Responsive breakpoints

---

## Design Tokens to Add

```css
/* New tokens for notifications */
--color-notif-comment: #3B82F6;
--color-notif-task: #8B5CF6;
--color-notif-upload: #10B981;
--color-notif-ai: #0D9488;
--color-notif-booking: #F59E0B;
--color-notif-voting: #FF5A5F;

/* Animation timing */
--transition-stagger-base: 0.08s;
--transition-cinematic: 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
```
