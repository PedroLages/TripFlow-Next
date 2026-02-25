# UX Specification: Tripify - AI-Powered Travel Planner

**Source PRD**: tripify-idea-prd.md
**Clarification Session**: tripify-idea-prd-clarification-session.md
**Generated**: February 8, 2026

---

## Pass 1: Mental Model

**Primary user intent:** "I want to plan an amazing trip without spending hours researching and coordinating."

**Likely misconceptions:**
- **"The AI plans everything for me"** → Users may expect zero-input automation; reality is AI-assisted planning with user control
- **"My collaborators can see everything I do"** → Privacy confusion about what's shared vs. personal in group trips
- **"This app books my travel"** → Users may think booking happens in-app; we only provide deep links
- **"Once I start a trip, I'm locked in"** → Fear that itinerary changes are difficult or impossible
- **"The AI knows my budget perfectly"** → Over-trust in AI budget awareness vs. manual expense tracking

**UX principle to reinforce:** **Augmented intelligence, not replacement.** The AI is a copilot that accelerates planning and reduces cognitive load, but the user (or group organizer) remains in control. Every AI suggestion can be overridden.

---

## Pass 2: Information Architecture

**All user-visible concepts:**
- Trip (planning unit)
- Destination (place to visit)
- Activity (thing to do)
- Itinerary (timeline of activities)
- Budget (spending plan)
- Expense (actual spending)
- Collaborator (travel companion)
- Vote (preference signal)
- Preference (user travel style)
- Recommendation (AI suggestion)
- Booking status (planned/booked/cancelled)
- Settlement (who owes whom)

**Grouped structure:**

### Trip Core
- **Trip**: Primary
- **Destination**: Primary
- **Itinerary**: Primary
- **Rationale**: The trip and its timeline are the central organizing concept. Everything else exists to serve the trip.

### Planning & Discovery
- **Activity**: Primary
- **Recommendation**: Primary
- **Preference**: Secondary
- **Rationale**: Discovery and activity selection are the primary planning actions. Preferences are background personalization (secondary/hidden in settings).

### Collaboration
- **Collaborator**: Primary
- **Vote**: Primary
- **Rationale**: Group travel is a core differentiator. Voting and collaborator visibility are primary actions.

### Financial
- **Budget**: Secondary
- **Expense**: Secondary
- **Settlement**: Secondary
- **Rationale**: Money management is important but secondary to the trip experience. Budget/expenses are tabs within trips, not top-level concepts.

### Execution (Hidden until needed)
- **Booking status**: Hidden (activity property)
- **Rationale**: Booking is a progression state of an activity, not a separate workflow. Visible as badges/indicators, not separate screens.

---

## Pass 3: Affordances

| Action | Visual/Interaction Signal |
|--------|---------------------------|
| Create new trip | Large FAB (+) with label "New Trip" or primary card "Plan a Trip" |
| Edit itinerary | Tap activity card → edit mode; drag handle for reorder |
| Vote on activity | Thumbs up/down buttons on activity card; vote count badge |
| Add collaborator | "Invite" button with person icon; share sheet presentation |
| Change trip details | Gear/settings icon on trip header; edit icon next to mutable fields |
| Book activity | "Book" button on activity detail; external link indicator |
| Log expense | "+" button on expense tab; prominent action when budget selected |
| Override AI suggestion | "Replace" button on AI-recommended activity; "Make changes" prompt |
| Undo AI optimization | "Undo" toast after auto-optimization; "Revert" button |
| Save destination for later | Heart/bookmark icon; "Saved" confirmation feedback |
| Access offline trip | Download icon; "Available offline" badge |

**Affordance rules:**
- If user sees an activity card with a vote count, they assume tapping the thumbs icons will register their vote
- If user sees "AI suggested" badge, they assume this can be replaced with manual selection
- If user sees budget progress bar, they assume tapping opens expense breakdown
- If user sees collaborator avatars, they assume tapping shows collaborator details or manages invites
- If user sees a time on an activity, they assume it's editable (tap to modify)
- If user sees an external link icon, they assume this leaves the app for booking

---

## Pass 4: Cognitive Load

**Friction points:**

| Moment | Type | Simplification |
|--------|------|----------------|
| First launch - entering preferences | Choice (too many options) | Progressive 3-screen onboarding with skip: (1) Interests as selectable tags, (2) Budget range slider, (3) Travel style single-select |
| Choosing from 50+ activities | Choice (paralysis) | AI shows top 5 recommendations first; "See more" reveals full list with filters |
| Collaborators voting simultaneously | Uncertainty (what's changing?) | Live indicator "3 collaborators viewing"; change attribution "Sarah added sushi dinner" |
| Setting budget breakdown | Choice (complex math) | AI suggests budget distribution based on destination costs; user adjusts totals only |
| Reconciling expenses after trip | Uncertainty (who paid what?) | Visual settlement graph showing net flows; "Send reminder" actions |
| AI itinerary changes | Uncertainty (what changed?) | "Before/After" comparison view for major changes; highlighting affected activities |
| Choosing dates for multi-destination trip | Choice (complex timing) | Calendar view with duration bars; AI suggests optimal stay duration per city |
| Adding expenses during trip | Choice (who to split with?) | Default to all trip participants; "Custom split" is secondary action |

**Defaults introduced:**
- **Trip duration**: AI suggests based on destination (e.g., 5 days for Tokyo, 3 days for weekend trip)
- **Activity timing**: AI suggests time blocks (morning/afternoon/evening) based on typical patterns
- **Budget split**: Equal split among all participants by default
- **Itinerary structure**: Day-by-day view by default; alternative views (list, map) are alternatives
- **Notification settings**: Real-time push for all collaboration events by default; mute option in settings
- **AI optimization**: Auto-apply minor changes; prompt for major changes

---

## Pass 5: State Design

### Trip Dashboard (Home)

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Empty | Welcome illustration, "Plan your first trip" CTA, value prop headline | No trips exist; this is trip planning app | Tap "Plan first trip" to create first trip |
| Loading | Skeleton cards for trip list, loading spinner | App is fetching trips | Wait; pull-to-refresh not needed (initial load) |
| Success | List of trips organized by upcoming/past, FAB for new trip | Here are my trips; I can create more | Tap trip to open; tap FAB to create new |
| Partial | Some trips visible with loading indicators below | More trips loading | Scroll to trigger load; tap existing trip |
| Error | Error message with illustration, "Retry" button | Something went wrong loading trips | Tap "Retry"; check connection |

### Itinerary View (Day-by-Day)

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Empty | "No activities planned" message, "Add activities" or "Let AI plan" buttons | This day has nothing scheduled | Tap buttons to manually add or AI-generate |
| Loading | Activity skeleton cards, shimmer effect | Activities are loading | Wait; content will appear |
| Success | Timeline of activities with times, locations, voting status | Here's my plan for the day | Tap activity to details; drag to reorder; swipe to delete |
| Partial | Some activities shown, "AI is finding more..." indicator | AI is generating additional suggestions | Wait or tap existing activity; cancel generation |
| Error | "Couldn't load itinerary" message, "Retry" button | Itinerary failed to load | Tap "Retry"; check if offline |

### Activity Voting (Collaboration)

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Empty (no votes) | Activity card with "Be the first to vote" label | No one has voted yet | Tap thumbs up/down to vote |
| Loading | Vote count showing previous value, loading spinner on vote buttons | Vote is being submitted | Wait for confirmation |
| Success | Updated vote count, "You voted" confirmation, collaborator avatars showing votes | Vote registered; here's who voted | Change vote; view activity details |
| Partial | Vote count updating in real-time, "2 collaborators voting..." indicator | Others are voting simultaneously | Wait or continue browsing |
| Error | "Vote failed" message, "Retry" button | Vote didn't go through | Tap "Retry"; check connection |

### AI Itinerary Generation

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Empty | "Plan your trip" prompt, destination search, date inputs | Need to provide trip basics first | Enter destination and dates |
| Loading | Progress bar "Building your itinerary... Day 3 of 5", AI-branded animation | AI is working; will take a moment | Wait; progress shown |
| Success | Complete itinerary with "AI-generated" badge, "Review & customize" prompt | AI created a plan; I can change it | Review activities; tap "Customize" to edit |
| Partial | Partial itinerary with "Keep going..." message, activities appearing progressively | AI is still generating; can review what's ready | Scroll to see; tap "Generate more" to speed up |
| Error | "AI couldn't generate itinerary" message, "Try again" or "Plan manually" buttons | AI generation failed | Retry or switch to manual planning |

### Budget & Expense Tracking

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Empty | "Set budget" input, "Start tracking" CTA | No budget set yet | Enter budget amount |
| Loading | Budget skeleton, expense list skeletons | Data loading | Wait |
| Success | Budget progress bar (spent vs. total), expense list, settlement summary | Here's my spending vs. plan; here's who owes what | Add expense; tap expense to edit; view settlement |
| Partial | Budget shown, some expenses loading | Expenses still syncing | Add new expense; view available data |
| Error | "Couldn't load expenses" message, "Retry" button | Expense data failed | Tap "Retry"; check if offline |

### Offline Mode

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Empty (not applicable) | N/A | N/A | N/A |
| Loading | "Offline mode" indicator, cached content loading | App is offline; showing saved data | Wait for cached content |
| Success | "Offline" badge in header, full itinerary viewing and editing | I can view and edit without internet | Full editing; changes sync when online |
| Partial | Some content with "Offline" badges, others with "Unavailable offline" | Some features require connection | Work with available content |
| Error | "You're offline" message, "Retry" when connection returns | No internet connection | Check connection; view cached trips |

---

## Pass 6: Flow Integrity

**Flow risks:**

| Risk | Where | Mitigation |
|------|-------|------------|
| User abandons during onboarding | Preference selection screens (3 screens) | Skip button on each screen; can complete preferences later in settings |
| AI suggestions overwhelm user | Destination/activity recommendation screens | Show top 3-5 only; "See more" requires explicit action |
| Collaborator doesn't understand voting | Activity voting interface | Tooltip: "Vote to influence the itinerary" on first vote |
| User expects in-app booking | Activity detail with "Book" button | External link icon; confirmation "You'll leave Tripify to book" |
| Budget anxiety from estimates | Budget setting screen | Show this as "estimated budget" with ability to adjust; emphasize tracking vs. prediction |
| Group conflict from voting results | Vote count display | Emphasize organizer has final decision; show "Organizer will decide" note |
| Offline changes cause conflicts | Multi-person editing while offline | "You have unsynced changes" warning on reconnect; conflict resolution UI |
| AI changes are jarring | Auto-optimization after votes | "Before/After" comparison; "Undo" button for 5 minutes |
| User can't find past trips | Main screen (showing upcoming by default) | Clear tabs: "Upcoming" | "Past" | "Draft" |
| Settlement confusion | Expense settlement screen | Visual graph showing net flows (who pays whom); "Send reminder" actions |

**Visibility decisions:**

**Must be visible:**
- Current trip selection (if multiple trips)
- AI-generated indicator (so users know what's automated)
- Offline status badge (critical for travelers)
- Unviewed collaboration updates (notification badge)
- Budget health indicator (over/under budget)
- Voting participation (who has/hasn't voted)
- Booking status of key activities

**Can be implied:**
- Time is editable (no explicit "edit time" button; tap time to change)
- Activity details available (tap card to expand)
- Itinerary can be reordered (drag handles visible on long-press)
- Expenses can be edited (tap row to modify)
- More activities available (scroll indicator; "See more" at list bottom)

**UX constraints for visual phase:**

1. **AI must feel like a helper, not a replacement** - All AI-generated content must be clearly labeled but not prominently highlighted. It's the default way things work, not a special feature.

2. **Collaboration must feel synchronous** - Show presence indicators ("3 viewing"), real-time vote updates, change attribution. Users should feel like they're planning together, not passing a document around.

3. **Offline is a first-class state** - Offline badge must be prominent but not alarming. Full editing works offline; this is expected behavior, not degraded experience.

4. **Time is flexible** - Times shown are suggestions, not appointments. Visual treatment should communicate "this is when we recommend, not when you must." Use lighter font weight, "suggested" label, or editable indicator.

5. **Budget is a tool, not a judge** - Budget health indicators should be informative, not shaming. Over budget shows as "at 105% of budget" not "over budget!" with red alarm. Use neutral-to-warm color scale, not alarmist red.

6. **The trip is the hero** - Design hierarchy should place the trip experience (itinerary, activities, destinations) above administrative functions (budget, settings, permissions). Money and permissions are important but secondary to the travel dream.

---

## Visual Specifications

*Note: Tripify will leverage the existing Tripify Travel Planner Design System (48 screens, 24 components, 125 tokens). The following visual specifications extend and reference that system.*

### Design System Foundation

**Based on**: [Tripify Travel Planner Design System](../design-system/)

- **Platform**: iOS native (SwiftUI)
- **Primary brand**: Green (#34C759) - growth, adventure, nature
- **Typography**: SF Pro Display system fonts
- **Spacing**: 4px grid system
- **Accessibility**: WCAG 2.1 Level AA

### Screen-by-Screen Specifications

#### 1. Onboarding Flow (3 screens)

**Screen 1: Welcome**
- Hero illustration (travel-themed, aspirational)
- Headline: "Plan trips in minutes, not hours"
- Subhead: "AI-powered planning for solo and group travelers"
- Primary CTA: "Get Started" (green button, full width)
- Secondary CTA: "I already have an account" (text link)

**Screen 2: Travel Preferences**
- Headline: "What do you love?"
- Instruction: "Select at least 3 interests"
- Interest tags as horizontal scrolling chips:
  - Beaches, Mountains, Cities, Food & Drink, Culture, Adventure, Nightlife, Nature, History, Art, Relaxation
- Selected state: Green background, white text
- Bottom: "Continue" button (enabled when 3+ selected)

**Screen 3: Budget & Style**
- Headline: "How do you travel?"
- Budget range slider: "$500 - $10,000+" with stepped increments
- Travel style cards (single select):
  - "Relaxed" - 1-2 activities per day
  - "Balanced" - 3-4 activities per day (default)
  - "Packed" - 5+ activities per day
- Primary CTA: "Start Planning"

#### 2. Trip Dashboard (Home)

**Layout:**
- Top bar: "My Trips" heading, profile avatar (top right)
- Tabs: "Upcoming" (default), "Past", "Draft"
- Trip cards: Vertical scroll list
  - Trip cover image (16:9 aspect ratio)
  - Trip name (heading-lg, semibold)
  - Dates & destination (body-md, secondary color)
  - Collaborator avatars (overlapping circles, max 4 visible + "+N")
  - Status badge: "In planning", "Confirmed", "Completed"
  - Budget progress bar (thin, below dates)
- FAB: "+ New Trip" (bottom right, green, 56px)

**Empty state:**
- Illustration: Empty suitcase or map
- Headline: "No trips yet"
- Body: "Your next adventure awaits"
- CTA: "Plan your first trip"

#### 3. Create Trip Flow

**Screen 1: Trip Basics**
- Input: Trip name (text field, placeholder "Japan Adventure 2026")
- Input: Destination (search with autocomplete)
- Date range picker: Start date, End date
- Cover image selector (optional, default based on destination)
- CTA: "Continue"

**Screen 2: Invite Collaborators**
- Headline: "Who's joining?"
- Input: Email addresses (multi-entry with chips)
- Alternative: "Share link" toggle
- Permission note: "You'll be the trip organizer"
- CTA: "Create trip"

**Screen 3: AI Itinerary Generation**
- Progress animation: AI-branded, shows "Planning Day 1 of 5..."
- Tips carousel: "Did you know? Japan has bullet trains..."
- Cancel option: "Customize manually instead"

#### 4. Trip Detail (Itinerary View)

**Layout:**
- Header: Trip name, cover image (parallax effect on scroll)
- Date tabs: Horizontal scroll for each day (Day 1, Day 2, etc.)
- Content: Timeline of activities
  - Time label (left, gray-600)
  - Activity card (right, connected with vertical line)
    - Activity name (heading-sm, semibold)
    - Type badge (food, sightseeing, etc.)
    - Duration & location (body-sm, secondary)
    - Voting controls (thumbs up/down, vote count)
    - AI-suggested badge (pill, subtle)
- Bottom actions: "Add activity", "Optimize route", "View map"

**Activity Card States:**
- Default: White background, subtle shadow
- Selected: Green border (2px)
- AI-suggested: Subtle "AI" badge in corner
- Booked: "Booked" badge (green)

#### 5. Activity Detail Modal

**Layout:**
- Large hero image (if available)
- Activity name (heading-xl)
- Type & duration badges
- Description (body-lg)
- Rating (stars, review count)
- Cost estimate
- "Book" button (external link indicator)
- Collaborator votes section (avatars, vote counts)
- "Add to itinerary" or "Remove from itinerary" button

**Booking Integration:**
- Deep link button: "Book on [Provider]"
- Booking status toggle: "Not booked" → "Booked" → "Cancelled"
- Confirmation notes field

#### 6. Budget & Expenses Tab

**Layout:**
- Header: Budget summary card
  - Total budget (heading-xl)
  - Spent / remaining (body-lg)
  - Progress bar (color-coded: green <80%, yellow 80-100%, red >100%)
- "Add expense" FAB
- Expense list:
  - Date header
  - Expense rows:
    - Description, amount
    - Paid by avatar
    - Split indicator ("Split 3 ways")
    - Receipt thumbnail (if available)
- Settlement summary card:
  - "Who owes whom" section
  - Visual flow diagram
  - "Send reminder" buttons

**Add Expense Modal:**
- Amount input (large, numeric keypad)
- Description input
- Category selector (food, transport, accommodation, activities, other)
- "Paid by" selector (collaborator avatars)
- "Split with" multi-select (default: all)
- Photo receipt option
- "Save expense" button

#### 7. Discovery Screen

**Layout:**
- Search bar: "Where to next?"
- Filter chips: Budget, Duration, Type
- Destination cards (horizontal scroll)
  - Image (16:9)
  - Destination name
  - AI match score (e.g., "95% match")
  - "Explore" button
- Activity recommendations (vertical list)
  - Based on preferences and trip context
  - "Save for later" heart icon
  - "Add to trip" button

**Empty state (no preferences):**
- Prompt: "Tell us what you love"
- Link to preferences in settings

#### 8. Collaborator Management

**Layout:**
- List of collaborators:
  - Avatar, name, email
  - Permission badge: "Owner", "Editor", "Viewer"
  - Last active indicator
- "Invite more" button (top right)
- Collaborator detail (on tap):
  - Permission selector
  - "Remove from trip" button (destructive, red)

#### 9. Settings / Profile

**Layout:**
- Profile section: Avatar, name, email
- Preferences section:
  - "Travel interests" (link to edit)
  - "Budget range"
  - "Travel style"
- Notifications section:
  - Push notifications toggle
  - Email updates toggle
- Privacy section:
  - "Data export"
  - "Delete account"
- Help section:
  - "Contact support"
  - "Terms of service"
  - "Privacy policy"

#### 10. Offline Mode Indicator

**Presentation:**
- Persistent banner when offline: "You're offline - edits will sync when connected"
- Green checkmark badge on content available offline
- Grayed out + lock icon for features requiring connection (AI, new destination search)
- Sync status in settings: "Last synced: 5 minutes ago"

### Component Specifications

#### Primary Button (Full Width)
- Background: action-primary-default (#34C759)
- Text: text-on-primary (#FFFFFF), body-lg, semibold
- Height: 48px
- Border radius: 24px (full pill)
- Shadow: button (subtle green glow)
- States: Default, Hover (darker green), Pressed (even darker), Disabled (40% opacity)

#### Secondary Button
- Background: action-secondary-default (#FFFFFF)
- Text: text-primary (#000000), body-lg, semibold
- Border: 1px solid border-default (#E5E5EA)
- Height: 48px
- Border radius: 24px

#### Trip Card
- Background: surface-card (#FFFFFF)
- Border radius: card (12px)
- Shadow: card (subtle)
- Padding: 16px
- Cover image: 16:9 aspect ratio, border-radius-top: 12px
- Content gap: 8px

#### Activity Timeline Item
- Time label: 48px width, right-aligned, text-tertiary (#AEAEB2)
- Activity card: Flexible width, border-left: 2px solid border-selected when active
- Connector: Vertical line between activities, gray-300

#### Vote Buttons
- Upvote: Thumbs up icon, gray-500 when inactive, green-500 when active
- Downvote: Thumbs down icon, gray-500 when inactive, red-500 when active
- Size: 44px tap target
- Position: Right-aligned on activity card

#### Budget Progress Bar
- Height: 8px
- Border radius: 4px (full pill)
- Track: gray-200 (#F5F5F5)
- Fill: Gradient from green-500 to green-700 (for under budget)
- Fill (over budget): Gradient from yellow-500 to red-500
- Label above: "Spent $1,200 of $2,000" (body-md)

#### Notification Badge
- Background: red-500 (#FF3B30)
- Text: text-on-primary (#FFFFFF), caption (12px), bold
- Size: 18px circle
- Position: Top-right corner of icon
- Count: Maximum "99+"

### Typography Scale

| Use Case | Token | Size | Weight |
|----------|-------|------|--------|
| Trip name | heading-xl | 28px | Semibold |
| Screen header | heading-lg | 24px | Semibold |
| Activity name | heading-md | 20px | Semibold |
| Body text | body-lg | 17px | Regular |
| Secondary text | body-md | 16px | Regular |
| Captions | caption | 12px | Regular |

### Color Usage

| Element | Token | Hex |
|---------|-------|-----|
| Primary action | action-primary-default | #34C759 |
| Secondary action | action-secondary-default | #FFFFFF |
| Destructive | action-destructive | #FF3B30 |
| Edit/secondary | action-edit | #5AC8FA |
| Text primary | text-primary | #000000 |
| Text secondary | text-secondary | #8E8E93 |
| Background primary | background-primary | #FFFFFF |
| Background secondary | background-secondary | #F9FAFB |
| Border default | border-default | #E5E5EA |
| Border selected | border-selected | #34C759 |

### Spacing Standards

| Context | Token | Value |
|---------|-------|-------|
| Screen margin | screen-margin | 20px |
| Card padding | card-padding | 16px |
| Section gap | section-gap | 24px |
| Content gap | content-gap | 8px |
| Button padding | button-padding | 24px horizontal, 14px vertical |

### Interaction Patterns

**Pull to Refresh:**
- All list screens support pull-to-refresh
- Spinner appears after 60px pull distance
- Release triggers refresh

**Swipe Actions:**
- Activity cards: Swipe left = delete, swipe right = edit
- Expense rows: Swipe left = delete, swipe right = duplicate

**Long Press:**
- Activity cards: Enter reorder mode (drag handles appear)
- Trip cards: Show quick actions (duplicate, archive, delete)

**Haptic Feedback:**
- Successful action: Light tap
- Destructive action: Heavy tap
- Notification: Success vibration

---

## Design Handoff Notes

**For developers:**
- Use SF Symbols for iOS icons
- Implement haptic feedback for all destructive actions
- Support Dynamic Type for accessibility
- Test with VoiceOver for screen reader compatibility
- Implement offline sync with conflict resolution

**For AI/ML integration:**
- All AI-generated content must be labeled but not highlighted
- AI suggestions should feel like the default, not a special feature
- Provide "Why this recommendation?" explanatory tooltip on long-press

**For real-time collaboration:**
- Use WebSocket connections for live updates
- Show presence indicators for collaborators
- Implement optimistic UI updates (show change immediately, sync in background)
- Handle conflicts with "last write wins" plus user notification

**For offline functionality:**
- Cache trip data locally using Core Data
- Queue changes when offline, sync on reconnect
- Show sync status visibly
- Provide conflict resolution UI when changes collide

---

**End of UX Specification**
