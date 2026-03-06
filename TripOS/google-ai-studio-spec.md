# TripOS Google AI Studio Prototype Specification


## 1. Complete Style & Color System

### Design Tokens (28 Variables)

All colors use HSL values. Google AI Studio should convert these to CSS custom properties.

#### Surface Colors (Light Mode Default)

```css
:root {
  --background: 0 0% 100%;          /* #FFFFFF - Page background */
  --foreground: 224 71% 4%;         /* #020617 - Default text */
  --card: 0 0% 100%;                /* #FFFFFF - Card surfaces */
  --card-foreground: 224 71% 4%;    /* #020617 - Card text */
  --muted: 220 14% 96%;             /* #F1F5F9 - Muted backgrounds */
  --muted-foreground: 215 16% 47%;  /* #64748B - Secondary text */
  --border: 214 32% 91%;            /* #E2E8F0 - Borders, dividers */
  --input: 214 32% 91%;             /* #E2E8F0 - Input borders */
  --ring: 224 76% 48%;              /* #1D4ED8 - Focus rings */
}
```

#### Feature Colors

**CRITICAL COLOR RULES:**

1. **Indigo (Primary)** — Use for ALL primary buttons, links, active tabs
   - `--primary: 224 76% 48%` (#1D4ED8)
   - `--primary-foreground: 210 40% 98%` (#F8FAFC)
   - `--primary-subtle: 224 76% 95%` (#EEF2FF)

2. **Teal (Privacy)** — EXCLUSIVE to blind budgeting, lock icons, "Private" badges
   - `--privacy: 162 72% 37%` (#0D9488)
   - `--privacy-foreground: 210 40% 98%` (#F8FAFC)
   - `--privacy-subtle: 162 72% 95%` (#F0FDFA)
   - **NEVER use teal as primary button background**

3. **Purple (Voting)** — EXCLUSIVE to polls, vote buttons, quorum bars
   - `--vote: 262 83% 58%` (#7C3AED)
   - `--vote-foreground: 210 40% 98%` (#F8FAFC)
   - `--vote-subtle: 262 83% 96%` (#F5F3FF)
   - **NEVER use purple as primary button background**

4. **Amber (Accent)** — CTAs, highlights, attention-grabbing elements
   - `--accent: 25 95% 53%` (#F59E0B)
   - `--accent-foreground: 20 14% 4%` (#0C0A09)

#### Semantic Colors

```css
--success: 142 76% 36%;      /* #16A34A - Quorum met, budget saved */
--warning: 38 92% 50%;       /* #EAB308 - Deadline approaching */
--destructive: 0 84% 60%;    /* #EF4444 - Errors, delete actions */
--info: 199 89% 48%;         /* #0EA5E9 - Informational badges */
```

#### Dark Mode Colors

```css
.dark {
  --background: 222 47% 11%;        /* #0F172A - Dark slate (not pure black) */
  --foreground: 210 40% 98%;        /* #F8FAFC */
  --card: 217 33% 17%;              /* #1E293B */
  --muted: 217 33% 17%;             /* #1E293B */
  --muted-foreground: 215 20% 65%;  /* #94A3B8 */
  --border: 215 25% 27%;            /* #334155 */
  --ring: 224 76% 58%;              /* #3B82F6 - Brightened for contrast */
  --primary: 224 76% 58%;           /* #3B82F6 - +10% lightness */
  --privacy: 162 72% 45%;           /* #14B8A6 - +8% lightness */
  --privacy-subtle: 162 40% 15%;    /* #1A3A35 - Dark tint */
  --vote: 262 83% 68%;              /* #A78BFA - +10% lightness */
  --vote-subtle: 262 30% 18%;       /* #2E2454 - Dark tint */
}
```

### Typography Scale

**Font**: Inter (Google Fonts: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap`)

| Name | Size / Line-height | Weight | Usage | Tailwind Class |
|------|-------------------|--------|-------|----------------|
| Display | 36px / 40px | 700 Bold | Hero headlines | `text-4xl font-bold` |
| H1 | 30px / 36px | 700 Bold | Page titles | `text-3xl font-bold` |
| H2 | 24px / 32px | 600 Semibold | Section headings | `text-2xl font-semibold` |
| H3 | 20px / 28px | 600 Semibold | Card titles | `text-xl font-semibold` |
| H4 | 18px / 28px | 500 Medium | Labels | `text-lg font-medium` |
| Body | 16px / 24px | 400 Regular | Default text | `text-base` |
| Body Small | 14px / 20px | 400 Regular | Secondary text | `text-sm` |
| Caption | 12px / 16px | 400 Regular | Timestamps, badges | `text-xs` |

**Rules**:
- Minimum body text: 16px (never smaller)
- Never skip heading levels (H1 → H2 → H3)
- Use `font-medium` for interactive labels, `font-semibold` for headings

### Spacing Scale (4px Base Unit)

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `--space-4` | 16px | `p-4` | Default card padding, form fields |
| `--space-6` | 24px | `p-6` | Large card padding, sections |
| `--space-8` | 32px | `gap-8` | Section gaps |
| `--space-12` | 48px | `gap-12` | Major section dividers |

**Card spacing**: `p-4` (compact) or `p-6` (standard)
**Between cards**: `gap-4`
**Between sections**: `gap-8` or `gap-12`

### Border Radius

```css
--radius: 0.5rem;  /* 8px base */
```

| Value | Tailwind | Usage |
|-------|----------|-------|
| 4px | `rounded-sm` | Small badges, tags |
| 8px | `rounded-lg` | **Default** - Buttons, inputs, cards |
| 12px | `rounded-xl` | Modals, popovers, large cards |
| 9999px | `rounded-full` | Avatars, pill badges |

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);          /* Subtle lift */
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1),
          0 1px 2px -1px rgb(0 0 0 / 0.1);           /* Cards, dropdowns */
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1),
             0 2px 4px -2px rgb(0 0 0 / 0.1);        /* Popovers, floating */
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1),
             0 4px 6px -4px rgb(0 0 0 / 0.1);        /* Modals, drag states */
```

**Usage**:
- Cards at rest: `shadow-sm` or `shadow`
- Cards on hover: `shadow-md`
- Modals: `shadow-lg`

### Icons

**CRITICAL**: Use **Lucide Icons ONLY**. Never use Material Icons, Heroicons, or Font Awesome.

**Key Icons**:

| Feature | Lucide Icon | React Component | Usage |
|---------|-------------|-----------------|-------|
| Privacy/Lock | `lucide:lock` | `<Lock />` | Budget privacy, anonymous votes |
| Group | `lucide:users` | `<Users />` | Group data, shared info |
| Vote | `lucide:vote` | `<Vote />` | Polls, voting actions |
| Check | `lucide:check` | `<Check />` | Confirmed, complete |
| Warning | `lucide:alert-triangle` | `<AlertTriangle />` | Deadlines, low quorum |
| Clock | `lucide:clock` | `<Clock />` | Deadlines, timestamps |
| Map Pin | `lucide:map-pin` | `<MapPin />` | Locations, activities |
| Calendar | `lucide:calendar` | `<Calendar />` | Dates, scheduling |
| Drag Handle | `lucide:grip-vertical` | `<GripVertical />` | Drag handles |
| Money | `lucide:dollar-sign` | `<DollarSign />` | Expenses, budgets |
| Plus | `lucide:plus` | `<Plus />` | Add actions |
| Trash | `lucide:trash-2` | `<Trash2 />` | Delete actions |
| Edit | `lucide:pencil` | `<Pencil />` | Edit actions |
| Bell | `lucide:bell` | `<Bell />` | Notifications |
| Home | `lucide:home` | `<Home />` | Dashboard |
| Menu | `lucide:menu` | `<Menu />` | Mobile hamburger |
| X | `lucide:x` | `<X />` | Close modals |

**Sizes**: 16px (inline), 20px (buttons), 24px (headers)

---

## 2. All Pages/Screens (26 Total)

### Phase 1: Marketing, Auth, Dashboard (11 screens)

#### 1. Marketing Landing Page
**Purpose**: Hero, value prop, testimonials, signup CTA
**Key Elements**:
- Hero section with headline: "Plan together without the awkwardness"
- Value prop: Blind budgeting + structured voting
- Screenshot carousel showing key features
- Testimonials with avatars
- Primary CTA: "Get Started Free" (amber accent color)
- Secondary CTA: "See How It Works"

#### 2. Sign Up / Sign In
**Purpose**: Email/password, Google, Apple, magic link auth
**Key Elements**:
- Email + password inputs
- "Continue with Google" button (with Google logo)
- "Continue with Apple" button (with Apple logo)
- "Send magic link" option
- Toggle between Sign Up / Sign In
- Password strength indicator (sign up only)

#### 3. Invite Accept
**Purpose**: Onboarding flow for invited users
**Key Elements**:
- Trip preview card (name, dates, destination, member count)
- "Join [Trip Name]" primary button
- Auto-redirect to trip after signup

#### 4. Dashboard (My Trips)
**Purpose**: Trip cards with search/filter, empty state
**Key Elements**:
- Search bar (top)
- Filter chips: All | Upcoming | Past
- Trip cards grid (3 columns desktop, 1 column mobile):
  - Trip image placeholder
  - Trip name (H3)
  - Dates + destination (text-sm)
  - Member avatars (max 5 + "+N")
  - Active polls badge (purple)
  - Budget status badge (teal if blind budgeting enabled)
- "Create Trip" FAB (bottom-right mobile, top-right desktop)
- Empty state: Illustration + "Create your first trip"

#### 5. Trip Overview
**Purpose**: Summary stats, member avatars, recent activity
**Key Elements**:
- Trip header:
  - Trip name (H1)
  - Dates + destination (text-sm muted)
  - Member avatars with online status dots
  - "Invite" button (secondary)
  - "Settings" button (ghost)
- Quick stats cards (3-column grid):
  - Members count with Users icon
  - Active polls count with Vote icon (purple)
  - Budget status with Lock icon (teal)
- Activity feed preview (5 most recent entries)
- Tab navigation (sticky): Overview | Itinerary | Votes | Budget | Members

#### 6. Members & Invites
**Purpose**: Member list with roles, presence, invite controls
**Key Elements**:
- "Invite Members" button (primary, top-right)
- Member list (cards):
  - Avatar with online status (green dot = online, yellow = away, none = offline)
  - Name (H4) + role badge (Owner | Organizer | Member | Guest)
  - Email (text-sm muted)
  - Actions menu (3 dots): Promote | Remove (owner/organizer only)
- Pending invites section (dashed border cards):
  - Email + "Pending" badge
  - "Resend" | "Cancel" buttons

#### 7. Activity Feed
**Purpose**: Timeline of all trip actions
**Key Elements**:
- Day dividers (e.g., "Today", "Yesterday", "Mar 12, 2026")
- Feed entries (compact):
  - Avatar (32px)
  - Actor name (font-medium) + action + object (regular)
  - Timestamp (text-xs muted-foreground)
- Event types with icons:
  - `activity.created`: Calendar icon
  - `poll.closed`: Vote icon (purple)
  - `member.joined`: Users icon
  - `budget.submitted`: Lock icon (teal)
- Pagination: "Load more" button at bottom

#### 8. Notifications Center
**Purpose**: Unread badge, notification list by type
**Key Elements**:
- Header: "Notifications" (H1) + unread count badge
- Filter tabs: All | Polls | Members | Itinerary | Budget
- Notification list (cards):
  - Icon (type-specific: Vote, Users, Calendar, Lock)
  - Title (font-medium) + description (text-sm)
  - Timestamp (text-xs muted-foreground)
  - Unread dot (primary color, 8px, left edge)
  - Dismiss (X icon, top-right)
- Empty state: "No notifications yet"

#### 9. Profile & Settings
**Purpose**: User profile, preferences, account deletion
**Key Elements**:
- Profile section:
  - Avatar upload (96px circle)
  - Name input
  - Email (read-only)
  - "Save Changes" button (primary)
- Preferences section:
  - Dark mode toggle (system | light | dark)
  - Currency preference dropdown
  - Language preference dropdown
  - Notification preferences (6 toggles):
    - Polls | Members | Itinerary | Budget | Tasks | Expenses
  - Quiet hours time picker
- Danger zone:
  - "Delete Account" button (destructive)
  - Confirmation dialog: "Delete your account? All data will be removed. This can't be undone."

#### 10. Features Page
**Purpose**: Detailed feature descriptions with visuals
**Key Elements**:
- Hero: "Everything you need to plan together"
- Feature grid (3 columns):
  - Blind Budgeting card (teal accent):
    - Lock icon (40px)
    - Title: "Private budgets, honest planning"
    - Description: 2-3 sentences
    - Screenshot or illustration
  - Structured Voting card (purple accent):
    - Vote icon (40px)
    - Title: "Democratic decisions with deadlines"
    - Description + screenshot
  - (+ 4 more: Itinerary, Expenses, Real-time, Tasks)

#### 11. Pricing Page
**Purpose**: Transparent pricing tiers
**Key Elements**:
- 3 pricing cards (side-by-side):
  - Free tier: "Personal" (1-3 trips, basic features)
  - Pro tier: "$9/month" (unlimited trips, advanced voting, exports)
  - Team tier: "$29/month" (team accounts, priority support)
- Feature comparison table
- FAQ accordion

---

### Phase 2: Itinerary (3 screens)

#### 12. Itinerary Day Timeline
**Purpose**: Day-by-day schedule, drag-to-reorder
**Key Elements**:
- View toggle: Timeline | Map (top-right)
- Day dividers (e.g., "Day 1 — Mon, Mar 15")
- Activity cards (timeline):
  - Drag handle (GripVertical icon, left edge)
  - Time badge (e.g., "10:00 AM", left)
  - Activity name (H4)
  - Location (MapPin icon + text-sm)
  - Estimated cost (DollarSign icon + text-sm)
  - Budget indicator (green checkmark | amber warning | red X)
  - Vote status badge (if linked to poll, purple)
  - Actions menu (Edit | Delete)
- Empty state: "No activities yet. Add your first activity to start planning."
- "Add Activity" FAB (bottom-right)

#### 13. Add/Edit Activity
**Purpose**: Form with location search, cost, category
**Key Elements**:
- Modal/bottom sheet (max-width 512px)
- Form fields:
  - Day selector (dropdown: "Day 1", "Day 2", etc.)
  - Activity name input
  - Time picker (HH:MM AM/PM)
  - Location search (Google Maps autocomplete)
    - MapPin icon prefix
    - Autocomplete dropdown with suggestions
  - Notes textarea (optional, expandable)
  - Estimated cost input (currency prefix: $)
  - Category dropdown (Restaurant | Museum | Beach | Transport | Custom)
- "Save Activity" button (primary, bottom)
- "Cancel" button (secondary)

#### 14. Itinerary Map View
**Purpose**: Interactive Google Map with pins, routes
**Key Elements**:
- Google Map (full height)
- Activity markers (color-coded by category):
  - Pin with numbered badge (activity order)
  - Info window on click: Activity name, time, cost
- Route lines connecting sequential activities (dashed line)
- POI search bar (top overlay):
  - Search input with magnifying glass icon
  - "Restaurants", "Museums", "Parks" suggestion chips
- Legend (bottom-left overlay):
  - Category colors with labels
- "Back to Timeline" button (top-left)

---

### Phase 3: Voting (5 screens)

#### 15. Poll List (Active + History)
**Purpose**: Separate sections for active and closed polls
**Key Elements**:
- Tabs: Active | Closed
- Active polls (expandable cards):
  - 4px purple left border
  - Poll question (H3)
  - Vote type badge (purple-subtle bg): "Yes/No" | "Ranked Choice" | "Approval"
  - Countdown badge (amber if < 24h): "Closes in 14 hours"
  - Quorum progress bar (purple fill): "5 of 8 voted"
  - Anonymous badge (Lock icon) if anonymous
  - "Cast Vote" button (primary) if not voted
  - "You voted" checkmark badge if voted
- Closed polls (collapsed cards):
  - Winner highlighted with checkmark
  - "View Results" expandable section
- "Create Poll" FAB (bottom-right)

#### 16. Create Poll
**Purpose**: Form with vote type, deadline, quorum
**Key Elements**:
- Modal (max-width 512px)
- Form:
  - Poll question input (H3 preview below)
  - Vote type selector (cards):
    - Yes/No (default, selected)
    - Single Choice
    - Ranked Choice
    - Approval Voting
    - Veto Voting
  - Options input (for multi-choice types):
    - Dynamic list with "Add Option" button
    - Drag handles to reorder
  - "Advanced Settings" accordion (collapsed by default):
    - Deadline picker (default: 48 hours)
    - Quorum percentage slider (default: 60%)
    - Anonymous toggle (default: ON, with Lock icon)
- "Create Poll" button (primary)
- "Cancel" button (secondary)

#### 17. Cast Vote (Yes/No)
**Purpose**: Simple binary choice
**Key Elements**:
- Poll question (H2)
- Two large buttons (full-width, 48px height):
  - "Yes" button (vote-subtle bg, vote border when selected)
  - "No" button (vote-subtle bg, vote border when selected)
- Selected state: Checkmark icon + border
- "Submit Vote" button (primary, bottom)
- "Cancel" button (secondary)

#### 18. Cast Vote (Ranked Choice)
**Purpose**: Drag-to-rank interface
**Key Elements**:
- Poll question (H2)
- Instructions: "Drag to rank your preferences (1 = favorite)"
- Ranked options list (draggable cards):
  - Rank badge (purple circle with number: 1, 2, 3...)
  - Drag handle (GripVertical icon, left)
  - Option name (H4)
  - Option description (text-sm)
- Up/Down buttons (keyboard alternative)
- "Submit Vote" button (primary)

#### 19. Cast Vote (Approval)
**Purpose**: Select all acceptable options
**Key Elements**:
- Poll question (H2)
- Instructions: "Select all options you approve"
- Option cards (clickable, checkboxes):
  - Checkbox (left)
  - Option name (H4)
  - Option description (text-sm)
  - Selected state: vote-subtle bg, vote border
- "Submit Vote" button (primary)

#### 20. Poll Results
**Purpose**: Winner highlighted, vote distribution chart
**Key Elements**:
- Poll question (H2)
- Status badge: "Closed" (success) | "Tie" (warning) | "Failed" (destructive if no quorum)
- Winner card (if applicable):
  - Checkmark icon (large, success color)
  - Option name (H3, font-bold)
  - Vote count/percentage
  - "Add to Itinerary" button (primary)
- Vote distribution (bar chart or stacked bar):
  - Each option with colored bar (vote color)
  - Percentage + vote count labels
- Quorum indicator: "8 of 8 voted" (success) or "5 of 8 voted (60% required)" (warning)
- "View Rounds" accordion (ranked choice only): Shows elimination rounds
- Voter list (if not anonymous): Avatars of voters

---

### Phase 4: Expenses (2 screens)

#### 21. Expense Entry & List
**Purpose**: Quick-add form, expense list with categories, budget alerts
**Key Elements**:
- **Budget alert banner** (amber, appears when expenses reach 90% of group budget):
  - Warning icon (AlertTriangle, amber)
  - "Trip expenses at $720 of $800 budget (90%)"
  - "View Budget" link
- Quick-add form (top, card):
  - Amount input (currency prefix)
  - Description input (inline)
  - Category dropdown (optional): Restaurant | Museum | Transport | Accommodation | Other
  - **Linked activity dropdown** (optional): "Beach Snorkeling" | "Museum Tour" | None
  - Payer selector (default: current user)
  - Split method selector (default: Even split)
  - "Add Expense" button (primary, small)
- Expense list (cards):
  - Category icon (DollarSign with category color)
  - **Linked activity badge** (if linked): Calendar icon + "Beach Snorkeling" (text-xs, muted, clickable → navigates to activity)
  - Description (H4)
  - Amount (font-semibold, right-aligned)
  - Payer name (text-sm muted)
  - Date (text-xs muted)
  - Split badge: "Split 4 ways" | "Custom split" | "Per-family" | "Custom amounts"
  - Actions menu: Edit | Delete
- Category breakdown chart (bottom):
  - Donut chart or horizontal stacked bar
  - Total amount (H2, center)
  - **Budget comparison** (if blind budgeting enabled): "Total: $720 of $800 group budget"
- "View Settlement" button (secondary, bottom)

#### 22. Settlement Summary
**Purpose**: Who owes whom, optimized transaction graph
**Key Elements**:
- Total trip expenses card (top):
  - Total amount (H1)
  - Per person average (text-sm muted)
  - **Budget status** (if blind budgeting enabled): Progress bar showing "$720 of $800" with success/warning color
- Settlement cards:
  - "Alice pays Bob" (H4)
  - Amount (H2, success color)
  - Arrow icon between avatars
  - "Mark as Paid" checkbox (per transaction)
  - Payment status badge: "Pending" (muted) | "Paid" (success)
- Optimized transactions note: "3 payments settle all expenses" (instead of 12 pairwise)
- **Expense breakdown by activity** (expandable accordion):
  - Activities with linked expenses show total cost
  - Click to see individual expenses for that activity

---

### Phase 5: Budget (3 screens)

#### 23. My Budget (Private Input)
**Purpose**: Teal-bordered card, lock icon, "Only you can see this"
**Key Elements**:
- Card (teal border, privacy-subtle bg):
  - Lock icon (24px, teal, top-left)
  - "Your Budget" (H3)
  - "Only you can see this" (text-sm, privacy color, Lock icon prefix)
  - Budget amount input (currency prefix, large font)
  - "You can change this anytime" reassurance (text-xs muted)
  - "Save Privately" button (primary, Lock icon prefix)
  - Lock animation on save (200ms)
  - Confirmation: "Saved. Only you can see this." (toast)

#### 24. Group Budget Display
**Purpose**: Group max bar chart, confidence indicator
**Key Elements**:
- Two cards side-by-side (desktop) or stacked (mobile):
  - **Your Budget** card (teal):
    - Lock icon + "Private"
    - Your amount (large font, hidden characters: "$•••")
    - "Only you see this" label
  - **Group Max** card (neutral):
    - Users icon + "Group"
    - Group max amount (H2)
    - Confidence indicator: "Based on 8 of 12 members" (text-sm)
    - Progress bar (privacy color fill)
- Budget indicator (if you're setting the max):
  - Amber badge: "Your budget is setting the group max" (private, only you see)
- Filtered activities note:
  - "All activities filtered to $800 or less" (info badge)

#### 25. Blind Budgeting Explainer
**Purpose**: 3-step carousel for first-time users
**Key Elements**:
- Modal overlay (max-width 600px)
- 3-step carousel with dots indicator (bottom):
  - **Step 1**: "Your budget stays private"
    - Lock icon illustration (large, teal)
    - Description: "Only you can see the amount you enter. Not even the trip owner."
  - **Step 2**: "We calculate what everyone can afford"
    - Users + calculation illustration
    - Description: "The app finds the group max without revealing who set it."
  - **Step 3**: "Only you see if you set the group max"
    - Private indicator illustration
    - Description: "You'll see a note if your budget is the limiting factor."
- Navigation: "Next" button (primary) → "Got it" on step 3
- "Skip" link (text-sm, muted, top-right)

---

### Additional Screens (From UX Spec)

#### 26. Trip Settings
**Purpose**: Edit trip details, transfer ownership, delete
**Key Elements**:
- Form:
  - Trip name input
  - Dates picker (start + end)
  - Destination input (location search)
  - Description textarea
  - "Save Changes" button (primary)
- Ownership section (owner only):
  - "Transfer Ownership" button (secondary)
  - Dialog: Select new owner from member dropdown
- Danger zone:
  - "Delete Trip" button (destructive)
  - Confirmation: "Delete '[Trip Name]'? All activities, polls, and member data will be removed. This can't be undone."

---

## 3. Important App Features

### Feature 1: Blind Budgeting (Privacy-First Financial Planning)

**What it is**: Each member sets a private budget that is NEVER revealed to anyone else. The system calculates the group-affordable ceiling server-side.

**Visual language**:
- **Teal color** (`--privacy: 162 72% 37%`) used EXCLUSIVELY for:
  - Lock icons
  - "Private" badges
  - Budget input card borders
  - Privacy-related UI elements
- Lock icon ALWAYS visible on budget inputs (never hidden)
- "Only you can see this" reassurance text persists (not just first-time)

**User flow** (Sam's Journey):
1. Navigate to Budget tab → See empty state with lock icon
2. First time: 3-step carousel explainer (< 10 seconds)
3. Enter budget amount → "Only you can see this" text below input
4. Click "Save Privately" → Lock animation (200ms)
5. See two cards side-by-side:
   - **Your Budget** (teal, private): Shows your amount with lock icon
   - **Group Max** (neutral, shared): Shows aggregate with confidence indicator
6. Browse activities → All auto-filtered by group max
7. See budget indicators on activities (green ✓ = within range, amber ⚠ = near limit, red ✗ = over budget)

**Key states**:
- **Not Set**: Empty input + explainer prompt
- **Set**: Locked input showing amount + "Private" badge
- **Group Ready**: Group max displayed with confidence bar
- **Budget Too Low** (private): Amber note: "Your budget is setting the group max"

**Privacy guarantees** (explain in UI):
- Individual budgets encrypted at database level
- Group max calculated server-side (no individual values sent to clients)
- Timing attack mitigation (normalized response times)
- Small group protection (minimum 3 participants to show group max)

---

### Feature 2: Structured Voting (Democratic Decision-Making)

**What it is**: 5 voting methods with deadlines, quorum requirements, and anonymous voting by default. Polls actually close and declare winners.

**Visual language**:
- **Purple color** (`--vote: 262 83% 58%`) used EXCLUSIVELY for:
  - Poll card borders (4px left border)
  - Vote buttons and selection states
  - Quorum progress bars
  - Poll type badges
- Status badges clearly visible (Active | Voted | Closed)

**5 voting methods**:

1. **Yes/No**: Simple binary choice (default)
   - Two large buttons (Yes | No)
   - Selected state: purple border + checkmark

2. **Single Choice**: Pick one winner
   - Radio buttons or card selection
   - Winner highlighted after close

3. **Ranked Choice**: Instant-runoff voting
   - Drag-to-rank interface with numbered badges (1, 2, 3...)
   - Up/down buttons as keyboard alternative
   - Results show elimination rounds (expandable)

4. **Approval Voting**: Vote for all acceptable options
   - Checkboxes, multiple selection allowed
   - Winner = most approvals

5. **Veto Voting**: Any member can block an option
   - Shows veto count per option
   - Options with vetoes marked with X

**Key features**:
- **Deadlines**: Countdown timer visible (amber badge if < 24h)
  - "Closes in 14 hours" → "Closes in 58 minutes" → "Closed"
- **Quorum**: Progress bar with fraction ("5 of 8 voted")
  - Default 60% required
  - Poll fails if quorum not met by deadline
- **Anonymous voting**: Default ON (Lock icon badge)
  - No voter names shown
  - Only aggregate results visible
- **Real-time updates**: Vote counts update live (< 500ms)
  - Progress bar animates smoothly (300ms ease-out)
- **Automatic closure**: Polls auto-close at deadline
  - Winner declared immediately
  - "Add to Itinerary" button appears on result

**User flow** (Riley's Journey):
1. Click "Create Poll" FAB
2. Enter question → Select vote type (default: Yes/No)
3. Add options (if multi-choice)
4. Set deadline (default: 48h) → Set quorum (default: 60%)
5. Toggle anonymous (default: ON)
6. Click "Create Poll" → Publish
7. Members notified → Cast votes
8. Quorum indicator updates in real-time ("5 of 8 voted")
9. Deadline reached → Results declared
10. Winner highlighted with checkmark + "Decided" badge
11. Activity feed entry: "Poll closed: Winner = Beach Snorkeling"

**Poll states** (8 total):
- **Draft**: Gray border, "Draft" badge (not published)
- **Active**: Purple border, countdown timer, quorum bar
- **Voted**: Checkmark badge, "You voted" label
- **Quorum Met**: Green checkmark on quorum bar
- **Closing Soon**: Amber warning badge (< 24h)
- **Closed - Winner**: Results chart, winner bold + checkmark
- **Closed - Tie**: "Tie" badge, organizer can create tiebreaker
- **Closed - Failed**: Red "Failed" badge (no quorum)

---

### Feature 3: Real-Time Collaboration

**What it is**: Changes propagate to all connected members within 500ms. No refresh needed.

**Visual cues**:
- **Presence indicators** on member avatars:
  - Green dot (8px) = online
  - Yellow dot = away
  - No dot = offline
- **Activity feed** scrolls with real-time events
- **Live vote tallies**: Progress bars animate as votes arrive
- **New activity cards** slide in smoothly (300ms)

**How it works**:
- Supabase Realtime channels (WebSocket subscriptions)
- One channel per trip: `trip:{tripId}`
- Events:
  - `activity.created`, `activity.updated`, `activity.deleted`
  - `poll.created`, `poll.closed`, `vote.cast`
  - `member.joined`, `member.left`
  - `budget.submitted`, `budget.recalculated`
  - `expense.added`

**Optimistic UI**:
- Vote submissions update count immediately (before server confirms)
- Rollback on error with toast: "Couldn't save your vote. Tap to retry."

**Offline queue**:
- Pending changes stored locally
- Sync automatically on reconnection (within 3 seconds)
- Network status banner when offline: "You're offline. Changes will sync when reconnected."

---

### Feature 4: Collaborative Itinerary with Maps

**What it is**: Day-by-day timeline with drag-and-drop reordering, Google Maps integration, and activity proposals.

**Key features**:
- **Day-by-day organization**: Activities grouped by day with date dividers
- **Drag-and-drop**: Reorder within day or move across days
  - Drag handle (GripVertical icon, left edge)
  - Shadow-lg + 2% scale on dragged card
  - Placeholder gap shows drop zone
- **Location search**: Google Places API autocomplete
  - MapPin icon prefix
  - Suggestions dropdown
  - Auto-complete address
- **Map view toggle**: Switch between Timeline | Map
  - Map shows numbered pins (activity order)
  - Route lines connecting sequential activities
  - Info window on click: Activity name, time, cost
- **Budget indicators**: On each activity card
  - Green checkmark = within group max
  - Amber warning = near limit (within 10%)
  - Red X = over budget
- **Activity proposals**: Members can suggest, Organizers approve
  - Proposed activities have dashed border + "Proposed" badge

**Activity card structure**:
```
┌─────────────────────────────────┐
│ [Drag Handle] 10:00 AM          │ ← Time badge (left)
│                                 │
│ Beach Snorkeling                │ ← Activity name (H4)
│ [MapPin] Biscayne Bay           │ ← Location
│ [DollarSign] $45 per person     │ ← Cost + budget indicator (✓/⚠/✗)
│                                 │
│ [Vote badge] Decided (8 votes)  │ ← If linked to poll (purple)
│                                 │
│ [Edit] [Delete]                 │ ← Actions (hover)
└─────────────────────────────────┘
```

**Cost totals**:
- Per-day totals at bottom of each day section
- Trip total at top of itinerary
- Auto-filtered by group max if blind budgeting enabled

---

### Feature 5: Multi-Currency Expenses & Settlement

**What it is**: Log expenses in any currency, split 4 ways, link to activities, see optimized "who owes whom" summary, and get budget alerts.

**4 split methods**:
1. **Even split**: Divide equally among all members (default)
2. **Percentage split**: Custom percentages per person (must sum to 100%)
3. **Custom amounts**: Exact split per person (must sum to total)
4. **Per-family**: Group members into families, split evenly by family

**Currency features (3-tier failover)**:
- Multi-currency support (USD, EUR, GBP, JPY, CAD, AUD, CHF, etc.)
- **Tier 1**: ExchangeRate-API (primary, real-time rates)
  - API call: `https://api.exchangerate-api.com/v4/latest/{base_currency}`
  - Response cached for 1 hour
  - Timeout: 3 seconds
- **Tier 2**: Frankfurter API (fallback, European Central Bank rates)
  - API call: `https://api.frankfurter.app/latest?from={base_currency}`
  - Response cached for 1 hour
  - Timeout: 3 seconds
- **Tier 3**: Manual entry (if both APIs fail)
  - User prompted: "Couldn't fetch exchange rate. Enter rate manually or try again."
  - Input field: "1 EUR = __ USD"
  - "Retry" button to attempt API calls again
- All cached rates show timestamp: "Rate from 2 hours ago (updated hourly)"

**Expense-to-activity linking**:
- Optional dropdown when creating expense: "Link to activity?"
- Select from trip itinerary activities
- Linked expenses show activity badge with Calendar icon
- Click badge → navigate to activity in itinerary
- Activity cards show total linked expenses: "3 expenses totaling $180"
- Unlinked expenses grouped under "General Expenses"

**Edit expense flow**:
1. Click "Edit" on expense card → modal opens
2. Pre-filled form: amount, description, category, payer, split method, linked activity
3. Change any fields
4. Click "Save Changes" → optimistic UI update (card updates immediately)
5. Server validates → success or rollback on error
6. Error handling:
   - Show toast: "Couldn't save changes. Tap to retry."
   - Rollback to previous values
   - "Retry" button in toast
7. Edit history preserved in activity feed: "Alice edited expense 'Dinner at The Wharf'"

**Settlement optimization**:
- Debt graph algorithm minimizes transactions
- Example: "3 payments settle all expenses" (instead of 12 pairwise payments)
- Settlement cards show:
  - "Alice pays Bob $45"
  - Arrow icon between avatars
  - "Mark as Paid" checkbox
  - Payment status: "Pending" | "Paid" (with timestamp)
- "Mark as Paid" triggers optimistic update + confirmation toast

**Budget integration** (if blind budgeting enabled):
- Budget alert at 90% threshold:
  - Amber banner: "Trip expenses at $720 of $800 budget (90%)"
  - Warning icon (AlertTriangle)
  - "View Budget" link → navigates to Budget tab
- Budget alert at 100% threshold:
  - Red banner: "Trip expenses exceed $800 budget by $50"
  - Destructive color (red)
  - "Review Expenses" link
- Expense list shows budget comparison: "Total: $720 of $800 group budget"
- Settlement summary shows budget status with progress bar

**Expense card structure**:
```
┌─────────────────────────────────┐
│ [DollarSign] Restaurant         │ ← Category icon + name
│ [Calendar] Beach Snorkeling     │ ← Linked activity (if any, clickable)
│                                 │
│ Dinner at The Wharf             │ ← Description (H4)
│ $120.00                         │ ← Amount (right-aligned, bold)
│                                 │
│ Paid by Alice · Split 4 ways    │ ← Payer + split method
│ Mar 15, 2026                    │ ← Date
│                                 │
│ [Edit] [Delete]                 │ ← Actions
└─────────────────────────────────┘
```

**Category breakdown**:
- Donut chart or stacked bar
- Categories: Restaurant | Museum | Transport | Accommodation | Other
- Total amount in center
- Budget comparison below (if enabled): "Total: $720 of $800"

---

### Feature 6: Role-Based Access Control (4-Tier RBAC)

**Roles** (hierarchy: Owner > Organizer > Member > Guest):

1. **Owner** (trip creator):
   - All permissions
   - Can delete trip
   - Can transfer ownership
   - Can promote/demote members

2. **Organizer**:
   - Create/edit/delete activities
   - Create/manage polls
   - Invite members
   - Cannot delete trip or change ownership

3. **Member** (default):
   - Vote on polls
   - Propose activities (organizer approval required)
   - Submit budgets
   - Log expenses
   - View all trip content

4. **Guest** (view-only + voting):
   - View itinerary, polls, activities
   - Vote on polls
   - Cannot submit budgets or log expenses

**Visual indicators**:
- Role badges on member list: Small pill badges (muted bg)
- Permissions inline hints: "As a Guest, you can view and vote"
- Disabled buttons for unauthorized actions (with tooltip explaining why)

**Member departure cascades** (automatic cleanup):
- Activities stay but marked "former member"
- Votes preserved in history
- Budget recalculated (group max updates)
- Expense splits flagged for review
- Tasks unassigned

---

### Feature 7: Activity Feed (Audit Trail)

**What it is**: Timeline of all trip actions with timestamps and actors.

**Event types** (with icons):
- `activity.created`: Calendar icon + "Alice added Beach Snorkeling to Day 2"
- `poll.closed`: Vote icon (purple) + "Poll closed: Winner = Seafood Restaurant"
- `member.joined`: Users icon + "Bob joined the trip"
- `budget.submitted`: Lock icon (teal) + "Carol set their private budget"
- `expense.added`: DollarSign icon + "Dave logged $45 for Transportation"

**Feed structure**:
```
Today
┌─────────────────────────────────┐
│ [Avatar] Alice added Beach...   │ ← Actor + action + object
│          2 min ago              │ ← Relative timestamp
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ [Avatar] Bob voted on Poll #3   │
│          1 hour ago             │
└─────────────────────────────────┘

Yesterday
┌─────────────────────────────────┐
│ [Avatar] Carol set budget       │
│          Yesterday at 3:45 PM   │
└─────────────────────────────────┘
```

**Features**:
- Grouped by day with date dividers
- Real-time updates (new entries slide in)
- Pagination: 50 entries per page, "Load more" button
- Clickable entries navigate to context (e.g., click poll event → open poll)
- Compact design (text-sm, 32px avatars)

---

### Feature 8: Notifications & Quiet Hours

**Notification types**:
1. **Polls**: New polls, approaching deadlines (<24h), poll closed
2. **Members**: Member joined, member left
3. **Itinerary**: Activity added/edited/deleted
4. **Budget**: Group max recalculated, you're setting the max
5. **Tasks**: Task assigned, deadline approaching
6. **Expenses**: Expense added, settlement request

**Delivery channels**:
- **In-app**: Notification center with unread badge (bell icon)
- **Email**: Via Resend API (batched, respects quiet hours)

**Preferences** (6 toggles in Settings):
- Polls (default: ON)
- Members (default: ON)
- Itinerary (default: ON)
- Budget (default: ON)
- Tasks (default: ON)
- Expenses (default: OFF)

**Quiet hours**:
- Time picker: "Do not disturb from 10:00 PM to 7:00 AM"
- Applies to email only (in-app notifications always available)

**Batch notifications**:
- Group similar events into single email
- Example: "3 new activities added to Lisbon 2026" (instead of 3 separate emails)

---

### Feature 9: Task Management & Checklists

**What it is**: Create/assign tasks with deadlines, priority, and status. Pre-trip, during-trip, and post-trip checklist templates.

**Task card structure**:
```
┌─────────────────────────────────┐
│ [ ] Book hotel                  │ ← Checkbox + title
│                                 │
│ Assigned to: Alice              │ ← Avatar + name
│ Due: Mar 1, 2026                │ ← Deadline (amber if approaching)
│ Priority: High                  │ ← Badge (destructive if High)
│                                 │
│ Status: To Do                   │ ← Dropdown: To Do | In Progress | Done
└─────────────────────────────────┘
```

**Checklist templates**:
1. **Pre-Trip**:
   - Check passport expiration
   - Book flights
   - Reserve accommodations
   - Purchase travel insurance
   - Notify bank of travel

2. **During-Trip**:
   - Confirm bookings daily
   - Track receipts
   - Take photos

3. **Post-Trip**:
   - Share photos
   - Settle expenses
   - Write reviews

**Task board view**:
- Kanban: To Do | In Progress | Done (3 columns)
- Drag tasks between columns
- Filter by assignee

**Progress indicator**:
- Progress bar per trip: "8 of 12 tasks completed"

---

### Feature 10: Export & PWA

**Export formats**:
1. **PDF Itinerary**: Formatted, printable trip schedule
   - Header: Trip name, dates, destination
   - Day-by-day timeline with activities
   - Map snapshot per day
   - Expense summary

2. **iCalendar (.ics)**: Import activities into Google Calendar, Apple Calendar
   - One event per activity
   - Location, notes, time included

3. **CSV Expenses**: Spreadsheet-ready expense data
   - Columns: Date, Description, Category, Amount, Payer, Split Method

**PWA (Progressive Web App)**:
- Install prompt (mobile): "Add TripOS to your home screen"
- Offline read-only access to cached itinerary
- Service worker caches trip data
- Unsaved changes trigger navigation warning

**Export UI**:
- "Export" button (secondary) on Trip Overview
- Modal with format selection:
  - Radio buttons: PDF | iCalendar | CSV
  - Date range picker (filter)
  - Category filter (expenses only)
- "Download" button (primary)

---

## 4. Component Library (shadcn/ui Patterns)

### Button Variants

```tsx
// Primary (indigo background)
<button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium">
  Create Trip
</button>

// Secondary (outline)
<button className="border border-border text-foreground hover:bg-muted px-4 py-2 rounded-lg font-medium">
  Cancel
</button>

// Destructive (red)
<button className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-lg font-medium">
  Delete Trip
</button>

// Ghost (transparent)
<button className="text-foreground hover:bg-muted px-4 py-2 rounded-lg font-medium">
  Settings
</button>
```

### Card

```tsx
<div className="bg-card border border-border rounded-lg p-6 shadow-sm">
  <h3 className="text-xl font-semibold mb-2">Card Title</h3>
  <p className="text-sm text-muted-foreground">Card content goes here.</p>
</div>
```

### Badge

```tsx
// Default
<span className="bg-muted text-foreground px-2 py-1 rounded-full text-xs font-medium">
  Badge
</span>

// Privacy (teal)
<span className="bg-privacy-subtle text-privacy px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1">
  <Lock className="w-3 h-3" />
  Private
</span>

// Vote (purple)
<span className="bg-vote-subtle text-vote px-2 py-1 rounded-full text-xs font-medium">
  Ranked Choice
</span>

// Success
<span className="bg-success/10 text-success px-2 py-1 rounded-full text-xs font-medium">
  Quorum Met
</span>
```

### Avatar

```tsx
<div className="relative">
  <img
    src="/avatar.jpg"
    alt="Alice"
    className="w-10 h-10 rounded-full"
  />
  {/* Online indicator */}
  <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-background"></span>
</div>
```

### Input

```tsx
<div className="space-y-2">
  <label htmlFor="trip-name" className="text-sm font-medium">
    Trip Name
  </label>
  <input
    id="trip-name"
    type="text"
    className="w-full h-10 px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 outline-none"
    placeholder="Enter trip name"
  />
</div>
```

### Modal/Dialog

```tsx
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
  <div className="bg-card border border-border rounded-xl p-6 shadow-lg max-w-lg w-full">
    <h2 className="text-2xl font-semibold mb-4">Dialog Title</h2>
    <p className="text-sm text-muted-foreground mb-6">Dialog content...</p>
    <div className="flex justify-end gap-2">
      <button className="border border-border px-4 py-2 rounded-lg">Cancel</button>
      <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">Confirm</button>
    </div>
  </div>
</div>
```

---

## 5. Accessibility Checklist

**CRITICAL**: All images and icons MUST follow standard HTML accessibility practices.

### Images

✅ **Correct**:
```html
<!-- Informative images: use standard alt attribute -->
<img src="logo.png" alt="TripOS logo" />

<!-- Decorative images: use empty alt -->
<img src="background.svg" alt="" />
```

❌ **WRONG**:
```html
<!-- NEVER use data-alt (non-standard) -->
<img src="logo.png" data-alt="TripOS logo" />

<!-- NEVER use title for alt text (title is for tooltips) -->
<img src="logo.png" title="TripOS logo" />
```

### Icon Buttons

✅ **Correct**:
```tsx
{/* Icon-only button: MUST have aria-label */}
<button aria-label="Close modal">
  <X className="w-5 h-5" />
</button>

{/* Icon with visible text: icon gets aria-hidden */}
<button>
  Save Privately
  <Lock aria-hidden="true" className="w-4 h-4 ml-2" />
</button>
```

❌ **WRONG**:
```tsx
{/* Missing aria-label: screen reader reads nothing */}
<button>
  <X className="w-5 h-5" />
</button>

{/* Missing aria-hidden: screen reader reads "Save Privately Lock" */}
<button>
  Save Privately
  <Lock className="w-4 h-4 ml-2" />
</button>
```

### Form Inputs

✅ **Correct**:
```tsx
{/* Associated label */}
<label htmlFor="budget">Your budget</label>
<input id="budget" type="number" />

{/* OR aria-label if no visible label */}
<input type="number" aria-label="Your budget" />
```

❌ **WRONG**:
```tsx
{/* Placeholder is NOT a label */}
<input type="number" placeholder="Budget" />
```

### Touch Targets

- **Minimum**: 44x44px on ALL interactive elements
- Buttons, links, checkboxes, radio buttons, drag handles

### Color Contrast

- **Body text**: 4.5:1 minimum (WCAG AA)
- **Large text** (18px+): 3:1 minimum
- Test with: WebAIM Contrast Checker

### Keyboard Navigation

- All interactive elements reachable via Tab
- Visible focus rings (never `outline: none`)
- Enter/Space activate buttons
- Escape closes modals

### Screen Reader Support

- Proper heading hierarchy (H1 → H2 → H3, never skip)
- Landmark regions (`<nav>`, `<main>`, `<aside>`)
- ARIA labels on icon buttons
- Live regions for real-time updates: `aria-live="polite"` on vote tallies, activity feed

---

## 6. Animation & Motion

### Timing Values

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | 150ms | `ease-out` | Button press, toggle, hover |
| Standard | 200ms | `ease-in-out` | Card expand, accordion |
| Enter | 300ms | `ease-out` | Modal appear, toast slide-in |
| Exit | 200ms | `ease-in` | Modal dismiss |

### Key Animations

1. **Vote submission**: Button press → checkmark appears (150ms)
2. **Budget save**: Lock icon clicks shut (200ms)
3. **Real-time vote update**: Progress bar width animates (300ms ease-out)
4. **Drag-and-drop**: Scale up 2% + shadow-lg (150ms)
5. **Toast notification**: Slide up + fade in (300ms)
6. **Skeleton loading**: Pulse on muted backgrounds

### Reduced Motion

**CRITICAL**: Respect `prefers-reduced-motion` media query.

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

When reduced motion is requested, replace animations with instant state changes.

---

## 7. Responsive Breakpoints

### Mobile (< 768px)

- Single-column layout
- Bottom tab navigation (5 tabs max)
- Full-width cards
- Stacked side-by-side elements
- FAB for primary creation actions (bottom-right)
- Budget cards: stack vertically ("Your Budget" above "Group Max")

### Tablet (768px - 1024px)

- Two-column layouts
- Side-by-side budget comparison
- Sidebar collapsed by default (hamburger toggle)
- Poll cards: 2-column grid

### Desktop (> 1024px)

- Sidebar navigation (280px fixed, left)
- Multi-column content area
- Side-by-side budget cards
- Poll cards: 2-3 column grid
- Hover states enabled
- Keyboard shortcuts visible

---

## 8. Anti-Patterns to Avoid

| ❌ NEVER DO | ✅ DO INSTEAD | Why |
|-------------|---------------|-----|
| Use hex colors (#1D4ED8) | Use tokens (bg-primary) | Breaks dark mode, not maintainable |
| Use Material Icons | Use Lucide Icons | Consistency, shadcn/ui bundled |
| Use teal as primary button bg | Use indigo (--primary) | Teal is for privacy indicators ONLY |
| Use purple as primary button bg | Use indigo (--primary) | Purple is for voting indicators ONLY |
| Use `data-alt` on images | Use `alt` attribute | Standard HTML accessibility |
| Skip `aria-label` on icon buttons | Add `aria-label` | Screen reader support |
| Use `outline: none` | Keep visible focus rings | Keyboard accessibility |
| Use generic "Nothing here" | Educational empty states | Guide users to next action |
| Allow horizontal scrolling | Single-column mobile layout | Mobile UX best practice |
| Silent button clicks | Visual feedback within 150ms | Confirm action registered |

---

## 9. Google AI Studio Implementation Notes

### Recommended Approach

1. **Start with Design System**:
   - Define all 28 CSS variables in `:root` and `.dark`
   - Set up Inter font from Google Fonts
   - Create base component styles (Button, Card, Input, Badge)

2. **Build Foundation Screens First**:
   - Marketing Landing Page (simplest, no auth)
   - Sign Up / Sign In (establish auth patterns)
   - Dashboard (establish layout shell)

3. **Add Feature Screens**:
   - Itinerary (core feature, no complex state)
   - Voting (complex state, multiple variants)
   - Budget (privacy indicators, animations)

4. **Test Flows**:
   - New user journey (invite → signup → budget → vote)
   - Poll creation → voting → results
   - Itinerary building with drag-and-drop

### Prompting Strategy for Google AI Studio

For each screen, provide:
1. **Context**: What is this screen for?
2. **Design tokens**: Paste the 28 CSS variables
3. **Component structure**: Describe layout (header, body, footer)
4. **Interactive elements**: Buttons, inputs, cards with exact states
5. **Color usage**: Specify which colors for which elements (indigo for buttons, teal for privacy, etc.)
6. **Icons**: List all Lucide icons needed
7. **Responsive**: Mobile-first, breakpoints at 768px, 1024px
8. **Accessibility**: aria-labels, alt text, touch targets
9. **Example prompt**:

```
Create the TripOS Blind Budget input screen (screen #23).

Context: This screen lets users set a private budget that is never revealed to others. It must feel secure and private.

Design Tokens: [paste 28 variables]

Layout:
- Card with teal border and privacy-subtle background
- Lock icon (24px, teal) top-left
- "Your Budget" heading (H3)
- "Only you can see this" label (text-sm, teal, Lock icon prefix)
- Currency input (large font, $ prefix)
- "You can change this anytime" reassurance (text-xs muted)
- "Save Privately" button (primary indigo bg, Lock icon prefix)

Icons needed:
- lucide:lock (teal color, 24px)

Colors:
- Card border: --privacy (teal)
- Card background: --privacy-subtle (light teal)
- Button: --primary (indigo, not teal)
- Lock icon: --privacy (teal)

Accessibility:
- Input has label "Your budget"
- Lock icon has aria-hidden="true" (decorative next to text)
- Button has Lock icon with aria-hidden="true"

Responsive:
- Mobile: Full-width card, 16px padding
- Desktop: Max-width 480px, 24px padding
```

### Testing Checklist

After generating each screen in Google AI Studio:

- [ ] All colors use CSS variables (no hex values)
- [ ] Correct font (Inter) loaded
- [ ] Lucide icons only (no Material Icons)
- [ ] Primary buttons use indigo (--primary), not teal or purple
- [ ] Teal used only for privacy indicators
- [ ] Purple used only for voting indicators
- [ ] All images have `alt` attribute (not `data-alt`)
- [ ] Icon-only buttons have `aria-label`
- [ ] Touch targets ≥ 44px
- [ ] Responsive at 390px, 768px, 1024px widths
- [ ] Dark mode variant works (switch CSS variables)

---

## Summary

This specification provides everything needed to build a high-fidelity TripOS prototype in Google AI Studio:

✅ **Complete design system**: 28 CSS variables, typography, spacing, shadows, icons
✅ **All 26 screens**: Detailed layouts, components, states, flows
✅ **9 key features**: Blind budgeting, voting, real-time, itinerary, expenses, roles, feed, notifications, tasks
✅ **Component library**: Buttons, cards, badges, inputs, modals (shadcn/ui patterns)
✅ **Accessibility**: WCAG 2.1 AA compliant (alt text, aria-labels, touch targets)
✅ **Responsive**: Mobile-first (390px), tablet (768px), desktop (1024px+)
✅ **Dark mode**: All tokens have light + dark variants
✅ **Anti-patterns**: What NOT to do (hex colors, wrong icons, missing labels)

**Next steps**:
1. Set up design system in Google AI Studio (CSS variables + base components)
2. Generate foundation screens (Landing, Auth, Dashboard)
3. Add feature screens (Itinerary, Voting, Budget)
4. Test user flows (new user, poll creation, budget setting)
5. Verify accessibility and responsiveness

The prototype will accurately represent TripOS's unique design language: Stripe-level craft, Airbnb warmth, Linear decisiveness, with exclusive teal for privacy and purple for voting.
