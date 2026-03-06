# Mobile Calendar & Timeline UX Patterns Research

**Created**: 2026-02-09
**Status**: Complete
**Purpose**: Research mobile-responsive calendar/timeline UX patterns for TripOS itinerary feature

---

## Executive Summary

This research analyzes 12 leading calendar and itinerary apps to identify mobile-first timeline patterns suitable for TripOS's day-by-day trip planning feature. The analysis focuses on how apps handle multi-day events, activity cards, navigation, responsive design, and touch interactions.

**Key Finding**: The most successful mobile timeline apps use **vertical continuous scroll with day sections** rather than horizontal swipe-between-days navigation, as it provides better context for multi-day trips and scales naturally to desktop.

**Top Recommendation**: Adopt a **hybrid timeline-map approach** (Wanderlog pattern) where the timeline is the primary view with an integrated map toggle, using **vertical scroll with sticky day headers** for navigation.

---

## Apps Analyzed

### Calendar Apps (5)
1. **Google Calendar** - Industry standard, mobile-optimized agenda view
2. **Fantastical** - Premium calendar with timeline + grid hybrid view
3. **Timepage (Moleskine)** - Continuous timeline without month segregation
4. **Any.do** - Task + calendar integration
5. **Morgen** - Unified calendar dashboard

### Travel Itinerary Apps (7)
6. **Wanderlog** - Map-centric collaborative trip planner
7. **TripIt** - Linear timeline for reservations and bookings
8. **Roadtrippers** - Road trip planner with route visualization
9. **Kayak Trips** - Booking aggregator with basic itineraries
10. **Sygic Travel (Tripomatic)** - Offline maps with day-by-day itineraries
11. **Culture Trip** - Minimalist visual-first travel app
12. **Google Trips (archived)** - Reference for what NOT to do (failed due to lack of collaboration)

---

## Mobile-First Timeline Patterns

### Pattern 1: Vertical Continuous Scroll with Day Sections

**Used by**: Wanderlog, TripIt, Sygic Travel, Google Calendar (Agenda)

**Description**: A single vertically-scrollable timeline where each day is a section with a clear header. Users scroll continuously through all days rather than swiping between isolated day views.

**Pros**:
- Natural mobile interaction (vertical scrolling is intuitive)
- Shows context across multiple days
- No disorientation when jumping between days
- Scales perfectly to desktop (same interaction model)
- Supports infinite scroll for long trips
- Easy to scan entire trip at a glance

**Cons**:
- Can feel overwhelming for 14+ day trips without clear visual breaks
- Harder to jump to a specific distant day (requires date picker)

**Implementation Details**:
- Use sticky day headers that remain visible while scrolling
- Clear visual separation between days (borders, background color shifts)
- "Jump to date" floating action button for long trips
- Scroll position persistence when returning to timeline

---

### Pattern 2: Horizontal Swipe Between Days (Tabs)

**Used by**: Some calendar apps, less common in travel apps

**Description**: Each day is a separate "page" that users swipe left/right to navigate, similar to Instagram Stories or mobile tabs.

**Pros**:
- Focuses attention on one day at a time
- Reduces visual clutter for dense itineraries
- Familiar swipe gesture on mobile

**Cons**:
- Loses context of adjacent days (can't see yesterday/tomorrow)
- Poor desktop experience (requires reimagining for larger screens)
- Difficult to compare activities across multiple days
- Navigation friction for multi-day trips (7+ swipes to see full week)
- Can't see empty days vs full days without swiping through all

**Verdict**: ❌ **Not recommended for TripOS** - Loses multi-day context critical for trip planning

---

### Pattern 3: Hybrid Timeline + Grid (Fantastical Pattern)

**Used by**: Fantastical

**Description**: Split-screen design showing both a calendar grid (month view) and a detailed timeline (agenda) simultaneously on larger screens, with ability to toggle on mobile.

**Pros**:
- Best of both worlds on desktop/tablet
- Quick navigation via calendar grid + detail via timeline
- Power users love dual views

**Cons**:
- Complex to implement
- Requires significant screen real estate (doesn't work on small phones)
- May be overkill for trip planning (vs professional calendar management)

**Verdict**: ⚠️ **Consider for Phase 2** - Great for desktop experience but adds complexity

---

### Pattern 4: Timeline + Map Integration (Wanderlog Pattern)

**Used by**: Wanderlog, Sygic Travel, Roadtrippers

**Description**: Map view is equally important as timeline, with color-coded markers showing activities by day. Users can toggle between list/map or see both simultaneously.

**Pros**:
- Visualizes geographic flow of trip
- Helps identify routing issues (backtracking)
- Essential for location-based planning
- Natural for travel (vs pure calendar apps)

**Cons**:
- Requires robust map integration
- More complex state management (timeline + map sync)

**Verdict**: ✅ **HIGHLY RECOMMENDED** - This is the competitive standard for travel apps

---

### Pattern 5: Continuous Timeline Without Segregation (Timepage Pattern)

**Used by**: Timepage

**Description**: Events flow as a continuous stream without hard day boundaries, emphasizing the "flow of time" rather than discrete days.

**Pros**:
- Visually elegant and minimalist
- Great for appointments/meetings that span arbitrary times
- Delightful microinteractions and animations

**Cons**:
- Confusing for multi-day trip planning (day boundaries matter)
- Harder to budget/plan when days aren't clearly separated
- Empty days have equal visual weight to full days (wasteful)

**Verdict**: ❌ **Not suitable for TripOS** - Trip planning needs clear day structure

---

## Responsive Design Strategies

### Mobile (320-768px)

**Google Calendar Mobile**:
- Vertical event list (agenda view) as default
- Swipe gestures for quick navigation
- Adaptive layouts that feel native
- Touch-friendly tap targets (minimum 44×44 points iOS, 48×48dp Android)

**Wanderlog Mobile**:
- Map view is front and center on mobile
- Timeline accessible via bottom sheet or tab toggle
- Color-coded day markers on map
- Drag-and-drop disabled (too error-prone on small screens)

**Best Practices**:
- Use vertical scroll as primary navigation
- Minimum touch target: 44×44pt (iOS) / 48×48dp (Android)
- Spacing multiples of 8px (iOS 8-point grid, Android 8dp grid)
- Sticky day headers for orientation
- Floating action button for "Add Activity" (one-tap access)
- Bottom sheet modals for forms (better than full-screen on small devices)

---

### Tablet (768-1024px)

**Transition Zone Strategy**:
- Keep mobile-style vertical timeline but increase card width
- Show more information per activity card (no truncation)
- Enable drag-and-drop reordering (bigger touch targets)
- Side-by-side map + timeline (50/50 split or 60/40)

**Best Practices**:
- Use responsive breakpoint at 768px to shift layouts
- Increase spacing from 8px to 16px between major sections
- Show 2-column grids for wide activity cards
- Enable hover states (user may have mouse + touch)

---

### Desktop (1024px+)

**Fantastical Desktop**:
- Split-screen: Calendar grid (left) + Timeline detail (right)
- Keyboard shortcuts for power users
- Dense information display (more vertical space utilization)

**Wanderlog Desktop**:
- Map takes 60% of screen (left), timeline 40% (right)
- Drag-and-drop between days and map
- Multi-select activities for bulk actions
- Hover previews for collapsed details

**Best Practices**:
- Horizontal layout: Map/Calendar + Timeline side-by-side
- Utilize vertical space (desktops have more height)
- Enable drag-and-drop with visual feedback
- Keyboard navigation (arrow keys, shortcuts)
- Show more metadata per activity (full addresses, notes, etc.)

---

## Activity Card Design

### Essential Information Hierarchy

Based on travel itinerary templates and app patterns:

**Compact Mobile Card** (280-320px width):
```
┌─────────────────────────────────────┐
│ 🕒 9:00 AM - 11:00 AM       ⋮       │ ← Time + Action Menu
│ 🏛️ Louvre Museum                     │ ← Activity Name (bold)
│ 📍 Rue de Rivoli, Paris              │ ← Location (truncated with ellipsis)
│ 💰 €17 pp  •  🗳️ 5/8 votes           │ ← Cost + Voting Status
│ ────────────────────────────────     │
│ "Book tickets online to skip..."    │ ← Notes preview (optional, 1 line)
└─────────────────────────────────────┘
```

**Expanded Desktop Card** (400-600px width):
```
┌───────────────────────────────────────────────────┐
│ 🕒 9:00 AM - 11:00 AM                    ⋮  ✓     │ ← Time + Menu + Completion
│ 🏛️ Louvre Museum                                  │ ← Activity Name
│ 📍 Rue de Rivoli, 75001 Paris, France             │ ← Full Address
│ 💰 €17 per person  •  🗳️ 5/8 voted  •  ⏱️ 2h      │ ← Cost + Votes + Duration
│ ──────────────────────────────────────────────    │
│ 📝 "Book tickets online to skip the queue.        │ ← Notes (multi-line)
│     Arrive early for Mona Lisa viewing."          │
│ ──────────────────────────────────────────────    │
│ 🔗 louvre.fr  •  👤 Added by Sarah                │ ← Link + Attribution
└───────────────────────────────────────────────────┘
```

### Design Principles

1. **Progressive Disclosure**: Show core info on mobile (time, name, location), expand on desktop
2. **Visual Hierarchy**: Bold activity name, lighter metadata
3. **Iconography**: Use icons to save space and improve scannability
4. **Truncation**: Addresses truncate with ellipsis on mobile, full text on desktop
5. **Tap Targets**: Entire card is tappable to open detail view, separate menu icon for actions
6. **Color Coding**: Background tint by category (food, lodging, activity, transport)

### Spacing (Mobile)

- **Card padding**: 12-16px internal padding
- **Between cards**: 8px gap (same day), 24px gap (different days)
- **Day header padding**: 16px vertical, 16px horizontal
- **Sticky header height**: 48-56px

---

## Drag-and-Drop Patterns

### Mobile (Touch-Friendly)

**iOS Standard Pattern**:
- **Press and hold** list item (400-600ms)
- Item "pops out" with haptic feedback
- Drag to new position
- Drop with haptic "bump"
- Other items shift with animation

**Best Practices**:
- Use visual **drag handle** (six-dot icon) on right side of card
- Haptic feedback on grab and drop (iOS/Android vibration)
- Highlight drop zones with colored borders
- Animate other cards shifting out of the way
- Scroll timeline automatically when dragging near top/bottom edges
- **Disable on small screens** (<375px) - too error-prone

**Alternative for Small Screens**:
- **Up/Down arrow buttons** to reorder (no dragging)
- **Long-press menu** → "Move to Day 2"
- **Swipe gestures** (swipe right = move up, swipe left = move down)

### Desktop (Mouse + Touch)

**Wanderlog/Trello Pattern**:
- Hover over card shows drag handle
- Click and drag to reorder within day
- Drag to different day section (cross-day move)
- Drag to map to update location
- Visual feedback: semi-transparent card preview follows cursor

**Best Practices**:
- Use `cursor: grab` / `cursor: grabbing` states
- Show drop zone indicators (dashed borders, color highlights)
- Prevent text selection during drag
- Smooth animations (200-300ms)
- Multi-select support (Shift+click, Cmd+click)

---

## Multi-Day Navigation

### Vertical Scroll (Recommended)

**Pattern**: Continuous vertical scroll with sticky day headers

**Orientation Aids**:
- Sticky header shows current day as you scroll
- "Jump to date" floating action button (opens date picker)
- Timeline scrubber (vertical slider showing position in trip)
- Visual progress indicator (e.g., "Day 3 of 7")

**Implementation**:
```
┌──────────────────────────────┐
│  🗓️ Jump to Date     [=]     │ ← Floating Action Buttons
├──────────────────────────────┤
│  📅 Tuesday, June 10         │ ← Sticky Day Header (scrolling)
├──────────────────────────────┤
│  [Activity Card]             │
│  [Activity Card]             │
│  [Activity Card]             │
├──────────────────────────────┤
│  📅 Wednesday, June 11       │ ← Next Day (sticky when scrolled to)
├──────────────────────────────┤
│  [Activity Card]             │
│  ...                         │
```

**Pros**:
- Natural scrolling behavior
- See context of multiple days
- Easy to implement
- Works identically on mobile and desktop

---

### Horizontal Swipe (Not Recommended)

**Pattern**: Swipe left/right to change days (like Instagram Stories)

**Why Not**:
- Loses multi-day context (can't see adjacent days)
- Poor discoverability (users don't know to swipe)
- Doesn't scale to desktop (awkward with mouse)
- Requires complex gesture detection
- Can't compare activities across days

**Exception**: Could work for **day detail view** (drill down into single day after selecting from timeline)

---

### Tabbed Navigation (Hybrid Approach)

**Pattern**: Day tabs at top (mobile horizontal scroll tabs, desktop fixed tabs)

**When It Works**:
- Short trips (3-5 days max)
- Each day is very dense (10+ activities)
- Users need to focus on one day at a time

**When It Fails**:
- Long trips (7+ days = too many tabs)
- Sparse days (wasted tab space)
- Comparing across days (have to switch tabs repeatedly)

**Verdict**: ⚠️ **Use only for dense short trips** - Most trips are better with continuous scroll

---

## Visual Density & Spacing

### Mobile Spacing Rules

Based on iOS and Android design guidelines:

**8-Point Grid System**:
- **Small spacing**: 8px (icon + text, tight elements)
- **Medium spacing**: 16px (between related sections, card padding)
- **Large spacing**: 24-32px (between days, major sections)
- **Extra large spacing**: 48-64px (visual breaks)

**Card Spacing**:
- **Internal padding**: 12-16px inside card
- **Between cards (same day)**: 8px
- **Between cards (different days)**: 24px
- **Day header padding**: 16px vertical, 16px horizontal

**Touch Targets**:
- **Minimum size**: 44×44pt (iOS), 48×48dp (Android)
- **Recommended**: 48×48px for all interactive elements
- **Spacing between targets**: At least 8px to prevent mis-taps

### Platform Philosophy Differences

**iOS**:
- Generous white space (premium feel)
- Larger margins (16-24px)
- More breathing room between elements
- **Don't cram on iOS** - users expect spaciousness

**Android**:
- Tighter information density
- Smaller margins (12-16px)
- More content per screen
- Material Design elevation (cards, shadows)

**TripOS Strategy**: **Favor iOS spacing** (generous) but ensure Android doesn't feel wasteful. Use responsive breakpoints to adjust density based on screen size, not platform.

---

## Patterns to Adopt for TripOS

### 1. ✅ Vertical Continuous Scroll with Sticky Day Headers

**Why**: Industry standard for multi-day events, works on all screen sizes, provides context.

**Implementation**:
- Each day is a section in a single scrollable container
- Day headers are sticky (remain visible while scrolling)
- "Jump to Date" FAB for quick navigation
- Scroll position persists when leaving/returning

**Apps Using This**: Wanderlog, TripIt, Sygic Travel, Google Calendar Agenda

---

### 2. ✅ Hybrid Timeline + Map View (Wanderlog Pattern)

**Why**: Maps are essential for trip planning, helps visualize geographic flow, competitive differentiator.

**Implementation**:
- **Mobile**: Toggle between Map and Timeline views (bottom tabs or FAB)
- **Tablet**: 50/50 split (map left, timeline right) or map as bottom sheet
- **Desktop**: 60/40 split (map left, timeline right)
- Color-coded day markers on map
- Clicking map marker scrolls timeline to that activity
- Clicking timeline card highlights map marker

**Apps Using This**: Wanderlog, Sygic Travel, Roadtrippers

---

### 3. ✅ Compact Activity Cards with Progressive Disclosure

**Why**: Mobile screens are limited, desktop has space for details.

**Implementation**:
- **Mobile**: Show time, name, location (1 line), cost, votes
- **Desktop**: Add full address, notes preview, attribution, links
- **Detail View**: Tap card to open modal/side panel with all info
- Use icons to save space (🕒 time, 📍 location, 💰 cost, 🗳️ votes)

**Apps Using This**: All modern travel apps, Google Calendar

---

### 4. ✅ Touch-Friendly Drag-and-Drop with Fallbacks

**Why**: Reordering is essential for itinerary planning, must work on all devices.

**Implementation**:
- **Desktop**: Standard drag-and-drop with mouse
- **Tablet**: Touch drag with drag handles (six-dot icon)
- **Mobile (large)**: Touch drag with haptic feedback
- **Mobile (small <375px)**: Disable drag, use up/down arrow buttons or menu
- Visual feedback: drop zones, animations, haptic bumps

**Apps Using This**: Wanderlog (desktop), Notion, Trello

---

### 5. ✅ Responsive Breakpoint Strategy (Mobile → Desktop)

**Why**: One codebase, multiple screen sizes. Design must adapt gracefully.

**Implementation**:
- **< 768px (Mobile)**: Vertical timeline only, map as separate view, FAB for add
- **768-1024px (Tablet)**: Map + Timeline side-by-side, drag-and-drop enabled
- **> 1024px (Desktop)**: Full feature set, keyboard shortcuts, dense layout
- Use CSS Grid and Flexbox for responsive layouts
- Adjust spacing: 8px (mobile) → 16px (desktop) for major sections

**Best Practice**: **Design mobile-first, enhance for desktop** (not desktop-first scaled down)

---

## Anti-Patterns to Avoid

### 1. ❌ Horizontal Swipe Between Days (Without Context)

**Why It Fails**:
- Users lose orientation in multi-day trips
- Can't compare activities across days
- Poor desktop experience
- Navigation friction (7+ swipes to see week)

**What To Do Instead**: Use vertical scroll with sticky day headers (provides context)

**Exceptions**: Swipe CAN work for day detail view (after selecting day from timeline)

---

### 2. ❌ Forcing a Single Layout (No View Options)

**Why It Fails**:
- Different users prefer different views (timeline vs map vs agenda)
- Mobile users may want map, desktop users may want list
- Rigid design alienates part of your audience

**What To Do Instead**:
- Offer toggle between Timeline and Map views
- Allow users to choose default view (settings)
- Remember user preference per device

**Apps That Do This Well**: Wanderlog (map/timeline toggle), Fantastical (grid/agenda toggle)

---

### 3. ❌ Tiny Touch Targets and Cramped Spacing

**Why It Fails**:
- Mis-taps are frustrating (deleting wrong activity, tapping wrong day)
- Accessibility issues (users with motor impairments can't use app)
- Feels amateur and unprofessional

**What To Do Instead**:
- Minimum 44×44pt (iOS) / 48×48dp (Android) touch targets
- 8px minimum spacing between interactive elements
- Use 8-point grid system for all spacing
- Test on small phones (iPhone SE 375px width)

**Common Culprits**: Hidden "+" buttons, tiny edit icons, close-together checkboxes

---

### 4. ❌ Hiding Essential Actions (Deep Menus)

**Why It Fails**:
- Users can't find how to add/edit/delete activities
- Cognitive load ("where is the button?")
- Slows down core workflows

**What To Do Instead**:
- Floating Action Button (FAB) for "Add Activity" (always visible)
- Obvious edit/delete in card action menu (⋮ icon)
- Swipe gestures for common actions (swipe left = delete, swipe right = edit)

**Apps That Do This Well**: Google Calendar (FAB), Wanderlog (visible + button)

---

### 5. ❌ Poor Mobile Responsiveness (Desktop Port)

**Why It Fails**:
- Mobile users are 60%+ of travel app traffic
- Broken layouts on small screens kill conversions
- App Store reviews will destroy you ("doesn't work on my phone")

**What To Do Instead**:
- Design mobile-first, enhance for desktop
- Test on real devices (iPhone SE 375px, Pixel 7, iPad)
- Use responsive frameworks (Tailwind, Chakra UI, Material UI)
- Progressive enhancement (add desktop features, don't remove mobile)

**Warning Signs**: Horizontal scroll on mobile, tiny text, overlapping UI elements

---

## Recommendations for TripOS

### Phase 1: Mobile Timeline Foundation (Weeks 6-10)

**Core Features**:
1. **Vertical continuous scroll timeline** with sticky day headers
2. **Compact activity cards** showing time, name, location, cost, votes
3. **"Jump to Date" FAB** for quick navigation in long trips
4. **Add Activity FAB** (always visible, one-tap access)
5. **Day-by-day sections** with clear visual separation (borders, bg color)

**Mobile UX**:
- Touch targets: Minimum 48×48px
- Spacing: 8-point grid (8px, 16px, 24px increments)
- Cards: 12-16px internal padding, 8px gap between cards
- Sticky day headers: 48-56px height
- Bottom sheet modals for forms

**Map Integration** (if time permits in Phase 1):
- Toggle between Timeline and Map views (bottom tabs)
- Color-coded day markers
- Clicking marker scrolls timeline to activity

---

### Phase 2: Desktop Enhancements (Weeks 10-12)

**Responsive Layout**:
- **< 768px**: Mobile timeline (vertical scroll only)
- **768-1024px**: Map + Timeline side-by-side (50/50 split)
- **> 1024px**: Map (60%) + Timeline (40%) with expanded cards

**Desktop-Only Features**:
- Drag-and-drop reordering (within day and cross-day)
- Keyboard shortcuts (n = new activity, e = edit, del = delete, ↑↓ = navigate)
- Hover states for cards (show edit/delete icons)
- Multi-select activities (Shift+click)
- Expanded activity cards (full address, notes, links)

**Layout Strategy**:
- Use CSS Grid for responsive layouts
- `display: grid; grid-template-columns: 1fr;` (mobile)
- `grid-template-columns: 60% 40%;` (desktop)
- Adjust spacing: 16px desktop vs 8px mobile for major sections

---

### Phase 3: Polish & Advanced Features (Weeks 12-14)

**Navigation Enhancements**:
- Timeline scrubber (vertical slider showing position in trip)
- "Today" indicator for current day
- Empty state for days with no activities ("Add your first activity")
- Scroll position persistence (remember where user was)

**Activity Card Enhancements**:
- Category color coding (food, lodging, activity, transport)
- Estimated travel time between activities (based on map routing)
- Real-time voting status (5/8 voted, 3 pending)
- Assignee avatars (who's responsible)

**Drag-and-Drop Polish**:
- Smooth animations (200-300ms)
- Haptic feedback on mobile (grab, drop)
- Auto-scroll when dragging near edges
- Visual drop zone indicators (dashed borders)

---

### Technical Stack Recommendations

**Responsive Layout**:
- **Tailwind CSS** with mobile-first breakpoints (sm, md, lg, xl)
- **CSS Grid** for timeline/map layout
- **Flexbox** for activity cards

**Drag-and-Drop**:
- **@dnd-kit/core** (React) - Modern, accessible, touch-friendly
- **react-beautiful-dnd** (alternative) - Mature, battle-tested
- Disable on small screens, use buttons instead

**Map Integration**:
- **Google Maps JavaScript API** (already chosen in tech stack)
- **React Google Maps** wrapper
- Color-coded markers by day
- Polylines between activities (travel routes)

**Scroll Behavior**:
- **Intersection Observer API** for sticky headers
- **scrollIntoView()** for "Jump to Date"
- **localStorage** for scroll position persistence

---

### Visual Design Guidelines

**Color Coding by Day** (Map Markers + Card Accents):
- Day 1: Blue (#3B82F6)
- Day 2: Green (#10B981)
- Day 3: Purple (#8B5CF6)
- Day 4: Orange (#F59E0B)
- Day 5: Pink (#EC4899)
- Day 6+: Rotate through palette

**Typography**:
- Activity Name: 16px bold (mobile), 18px bold (desktop)
- Metadata (time, location): 14px regular, gray
- Day Headers: 18px bold (mobile), 20px bold (desktop)

**Spacing Scale**:
- xs: 4px (icon spacing)
- sm: 8px (card gaps)
- md: 16px (card padding, section spacing)
- lg: 24px (day gaps)
- xl: 32px (major sections)
- 2xl: 48px (visual breaks)

**Elevation (Material Design)**:
- Activity Cards: shadow-sm (subtle, not flat)
- Sticky Day Header: shadow-md (floating effect)
- Modals/Bottom Sheets: shadow-lg (clear separation)

---

## Sources

### Calendar UI Design
- [Calendar UI Examples: 33 Inspiring Designs [+ UX Tips]](https://www.eleken.co/blog-posts/calendar-ui)
- [10 Calendar UI Examples for Effective Scheduling Design](https://bricxlabs.com/blogs/calendar-ui-examples)
- [10 Best Calendar Management Tools in 2026](https://www.morgen.so/blog-posts/best-calendar-management-tools)
- [Calendar Design: UX/UI Tips for Functionality | Page Flows](https://pageflows.com/resources/exploring-calendar-design/)
- [Best Practices for Calendar design — FIX-UX](https://medium.com/design-bootcamp/best-practices-for-calendar-design-fix-ux-dc57b62d9bb7)

### Travel Itinerary Apps
- [Wanderlog vs TripIt – Wanderlog blog](https://wanderlog.com/blog/2024/11/26/wanderlog-vs-tripit/)
- [We Tried The Most Popular Travel Itinerary Apps](https://www.explore.com/1440646/we-tried-popular-travel-itinerary-apps-here-is-our-favorite/)
- [8 Best Alternatives to Google Travel Trip Summaries](https://wanderlog.com/blog/2024/09/20/8-best-alternatives-to-google-travel-trip-summaries/)

### Mobile Design Patterns
- [Timeline demos for web and mobile | Mobiscroll](https://demo.mobiscroll.com/timeline)
- [Responsive event calendar scheduler | Mobiscroll](https://mobiscroll.com/event-calendar-scheduler)
- [Event calendar demos for web and mobile | Mobiscroll](https://demo.mobiscroll.com/eventcalendar)

### Drag-and-Drop UX
- [Drag & Drop UX Design Best Practices - Pencil & Paper](https://www.pencilandpaper.io/articles/ux-pattern-drag-and-drop)
- [Drag-and-Drop UX: Guidelines and Best Practices](https://smart-interface-design-patterns.com/articles/drag-and-drop-ux/)
- [Designing drag and drop UIs - LogRocket](https://blog.logrocket.com/ux-design/drag-and-drop-ui-examples/)
- [Drag–and–Drop: How to Design for Ease of Use - Nielsen Norman Group](https://www.nngroup.com/articles/drag-drop/)

### Responsive Design
- [What Spacing Rules Create Better Mobile App Layouts?](https://thisisglance.com/learning-centre/what-spacing-rules-create-better-mobile-app-layouts)
- [Designing for Mobile: Screen Densities and Asset Scaling](https://medium.muz.li/designing-for-mobile-a-deep-dive-into-responsive-ui-screen-densities-and-asset-scaling-f8766363ab08)
- [Content composition and structure | Android Developers](https://developer.android.com/design/ui/mobile/guides/layout-and-content/content-structure)
- [Grids and units | Android Developers](https://developer.android.com/design/ui/mobile/guides/layout-and-content/grids-and-units)

### Navigation Patterns
- [Tabs UX: Best Practices and Examples](https://www.eleken.co/blog-posts/tabs-ux)
- [Infinite scroll best practices](https://www.justinmind.com/ui-design/infinite-scroll)
- [Tabbed navigation in UX - LogRocket](https://blog.logrocket.com/ux-design/tabs-ux-best-practices/)
- [Mobile Navigation UX Best Practices 2026](https://www.designstudiouiux.com/blog/mobile-navigation-ux/)

### Specific Apps
- [UX/UI Case Study: Timepage by Moleskine](https://medium.com/@nadiahussain96/ux-ui-case-study-a9975c79e642)
- [Adding an Itinerary feature to Culture Trip](https://medium.com/@nelegroosman/design-sprint-adding-structure-to-the-culture-trip-app-e12744f9c021)
- [The Best Calendar App for Android | Any.do](https://www.any.do/calendar-app-for-android)

### Anti-Patterns
- [10 Most Common UI Design Mistakes](https://www.mindinventory.com/blog/ui-design-mistakes/)
- [Examples of Mobile Design Anti-Patterns](https://www.sitepoint.com/examples-mobile-design-anti-patterns/)

---

## Next Steps

1. **Create wireframes** based on recommended patterns (vertical timeline + map toggle)
2. **Design activity card component** with mobile/desktop responsive variants
3. **Prototype drag-and-drop** behavior (test on mobile + desktop)
4. **User test navigation** (continuous scroll vs swipe) with 5-8 users
5. **Build Phase 1 timeline** (vertical scroll, sticky headers, activity cards)
6. **Integrate map** in Phase 2 with toggle view
7. **Polish interactions** in Phase 3 (animations, haptics, keyboard shortcuts)

---

**Last Updated**: 2026-02-09
