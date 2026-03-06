# TripOS UX Specification

**Created**: 2026-02-09
**Status**: Complete
**Purpose**: 6-pass UX analysis translating PRD + validated UX research into implementation-ready specifications
**Method**: UX Design Framework 6-pass methodology (Mental Model → IA → Affordances → Cognitive Load → States → Flow Integrity)

---

## Pass 1: Mental Model

### Primary User Intent
"I want to plan a group trip where everyone participates fairly, no one feels excluded, and decisions actually get made."

### What Users Think Is Happening

| Screen | User Mental Model | Reality |
|--------|------------------|---------|
| Trip Dashboard | "This is my home base for all trips" | Next.js app route with React Query cache |
| Trip Detail | "This is a shared workspace my friends and I edit together" | Real-time Supabase subscriptions on trip row |
| Blind Budget Input | "I'm putting my budget in a locked box only I can open" | AES-256 encrypted row with RLS policy |
| Group Max Display | "The app figured out what we can all afford" | Server-side MIN() query, never exposing individual values |
| Voting | "We're all voting like a fair election" | JSONB vote_data with ranked-choice algorithm |
| Activity Feed | "I can see what everyone's been doing on the trip" | Real-time subscription on trip_activity_log table |
| Itinerary | "I'm building our day-by-day schedule" | Activities table with day/order columns, drag reorders |

### Likely Misconceptions

1. **"The organizer can see my budget"** → Must reinforce: even owners cannot see individual caps
2. **"My vote isn't really anonymous"** → Must show lock icon + explain vote privacy
3. **"If I'm the lowest budget, people will know"** → Must explain: group max reveals nothing about who set it
4. **"Real-time means everyone sees me typing"** → Only committed actions broadcast, not keystrokes
5. **"I need an app to use this"** → Web-only, works in browser, no install needed

### UX Principles to Reinforce
- **Privacy is visible**: Lock icons, "Private" badges always present (not hidden in settings)
- **Democracy is structured**: Deadlines, quorum, results — not informal "likes"
- **Collaboration is default**: Everything is shared unless explicitly private (budgets)

---

## Pass 2: Information Architecture

### All User-Visible Concepts

#### Primary (Always Visible)
- **Trips** — The top-level container. Users create, join, and manage trips
- **Itinerary / Activities** — Day-by-day schedule of what the group will do
- **Polls / Votes** — Democratic decisions with deadlines and quorum
- **Members** — People in the trip, with roles and presence
- **My Budget** (private) — Personal budget cap, visible only to self

#### Secondary (Visible in Context)
- **Group Budget Range** — Aggregate display when budgets are submitted
- **Activity Feed** — Timeline of actions taken on the trip
- **Expenses** — Cost tracking and bill splitting
- **Notifications** — Alerts for deadlines, votes, changes
- **Map** — Geographic view of itinerary activities

#### Hidden (Progressive Disclosure)
- **How Blind Budgeting Works** — Explainer shown on first use
- **Advanced Poll Settings** — Quorum, anonymous toggle, vote type
- **Role Permissions** — Details of what each role can do
- **Expense Settlement** — Who owes whom calculations
- **Trip Archive** — Past/completed trips

### Information Hierarchy

```
App Shell
├── Navigation (top bar desktop / bottom tabs mobile)
│   ├── My Trips (dashboard)
│   ├── Notifications (bell icon + badge count)
│   └── Profile / Settings
│
└── Trip Workspace (selected trip)
    ├── Overview Tab
    │   ├── Trip header (name, dates, destination, member avatars)
    │   ├── Quick stats (members, active polls, budget status)
    │   └── Activity feed (recent actions)
    │
    ├── Itinerary Tab
    │   ├── Day-by-day timeline
    │   │   └── Activity cards (time, name, location, cost, vote status)
    │   └── Map view (toggle)
    │
    ├── Votes Tab
    │   ├── Active polls (expandable cards)
    │   ├── Completed polls (collapsed, results visible)
    │   └── Create Poll (FAB or button)
    │
    ├── Budget Tab
    │   ├── My Budget (private card with lock icon)
    │   ├── Group Budget Range (aggregate card)
    │   ├── Expenses list
    │   └── Settlement summary
    │
    └── Members Tab
        ├── Member list (avatar, name, role, online status)
        ├── Invite button
        └── Role management (owner/organizer only)
```

---

## Pass 3: Affordances

### Affordance Map

| Element | Clickable | Editable | Read-Only | Signal |
|---------|-----------|----------|-----------|--------|
| Trip card (dashboard) | ✅ Navigate | — | — | Card hover elevation, cursor pointer |
| Activity card | ✅ Expand details | ✅ Edit (if authorized) | — | Edit icon on hover, drag handle visible |
| Poll card | ✅ Expand/vote | — | ✅ If voted/closed | Status badge (Active/Voted/Closed) |
| Vote option | ✅ Select/rank | — | — | Checkbox/radio affordance, drag handle for ranked |
| Budget input | — | ✅ Enter amount | — | Input field + lock icon + "Private" badge |
| Group max display | — | — | ✅ Always | Bar chart, no edit controls |
| Member avatar | ✅ View profile | — | — | Tooltip on hover, click for profile card |
| Invite button | ✅ Generate link/email | — | — | Primary button style, Share icon |
| Activity feed item | ✅ Navigate to context | — | ✅ Log entry | Subtle link styling on actor/object |
| Map pin | ✅ Select activity | — | — | Pin animation, info window on click |
| Notification | ✅ Navigate + dismiss | — | — | Unread dot, swipe to dismiss (mobile) |
| Drag handle | ✅ Initiate drag | — | — | GripVertical icon, cursor grab |

### Affordance Rules

| Rule | Implementation |
|------|---------------|
| Clickable elements have hover state | `hover:bg-muted` or `hover:shadow-md` |
| Editable fields show edit icon on hover | Pencil icon appears top-right of editable content |
| Read-only data has no interactive signifiers | No hover state, no cursor change |
| Private data always shows lock icon | Lock icon + "Private" badge persistent |
| Shared data shows group icon | Users icon indicates "everyone sees this" |
| Buttons indicate action weight | Primary (filled) > Secondary (outline) > Ghost (text) |
| Drag targets show grip handle | GripVertical icon on left edge of draggable items |
| Destructive actions require confirmation | Red button → confirmation dialog before executing |

---

## Pass 4: Cognitive Load

### Friction Points & Simplifications

| Moment | Friction Type | Simplification |
|--------|-------------|----------------|
| First visit to blind budgeting | **Uncertainty** — "What is this? Is it safe?" | 3-step carousel explainer + "Got it" dismissal |
| Creating a poll | **Choice overload** — 5 vote types, deadline, quorum, anonymous | Default to yes/no, progressive disclosure for advanced |
| Ranked choice voting | **Complexity** — Drag to rank multiple options | Numbered badges + up/down buttons as alternative |
| Setting budget amount | **Anxiety** — "What if I set it wrong?" | "You can change this anytime" reassurance text |
| Inviting members | **Decision** — Email vs link? | Default to shareable link (one click), email as secondary |
| Viewing poll results | **Confusion** — Ranked choice math | Show winner prominently, "View rounds" as expandable detail |
| Understanding roles | **Uncertainty** — What can a Guest do? | Inline permission hints ("As a Guest, you can view and vote") |
| First expense entry | **Effort** — Manual data entry | Quick-add with just amount + description, category optional |
| Interpreting group budget | **Confusion** — What do the numbers mean? | Side-by-side cards: "Your Budget" vs "Group Max" with plain labels |
| Navigating between features | **Disorientation** — Where am I? | Tab bar with icons + labels, active state clear |

### Cognitive Load Reduction Strategies

1. **Smart defaults everywhere**: Yes/no poll type, 48h deadline, anonymous ON, quorum 60%
2. **Progressive disclosure**: Basic form visible, "Advanced settings" accordion hidden
3. **One primary action per screen**: Single prominent CTA, secondary actions muted
4. **Contextual education**: Tooltips at point of use, not upfront tutorials
5. **Familiar patterns**: shadcn/ui components users already know from other apps

---

## Pass 5: State Design

### Trip Dashboard States

| State | What User Sees | What They Understand | What They Can Do |
|-------|---------------|---------------------|-----------------|
| **Empty** | Illustration + "Create your first trip" | No trips yet | Click "Create Trip" button |
| **Loading** | Skeleton cards (3 pulsing rectangles) | Data is loading | Wait (< 1 second) |
| **Populated** | Trip cards sorted by recent activity | These are my trips | Click to open, create new |
| **Error** | "Couldn't load trips. Try again." + retry button | Something went wrong | Click retry or refresh |

### Poll States

| State | Visual | User Understanding | Available Actions |
|-------|--------|-------------------|------------------|
| **Draft** | Gray border, "Draft" badge | Not yet published | Edit, publish, delete |
| **Active** | Purple left border, countdown timer | Voting is open | Cast vote, view progress |
| **Voted** | Checkmark badge, options dimmed slightly | I've already voted | Change vote (if allowed), view progress |
| **Quorum Met** | Green checkmark on quorum bar | Enough people voted | Wait for deadline or view results |
| **Closing Soon** | Amber warning badge, "Closes in X hours" | Deadline approaching | Vote urgently if haven't |
| **Closed - Winner** | Results chart, winner highlighted | Decision made | View results, see audit trail |
| **Closed - Tie** | Results chart, "Tie" badge | No clear winner | Organizer creates tiebreaker |
| **Closed - No Quorum** | Red "Failed" badge, quorum bar incomplete | Not enough people voted | Organizer re-opens or cancels |

### Blind Budget States

| State | Visual | User Understanding | Available Actions |
|-------|--------|-------------------|------------------|
| **Not Set** | Empty input with lock icon, "Set your private budget" prompt | I haven't entered my budget yet | Enter amount, read explainer |
| **First Time** | Explainer carousel (3 steps) overlays input | Learning how this works | Read, dismiss, then enter budget |
| **Set** | Locked input showing amount + "Private" badge + checkmark | My budget is saved privately | Edit amount, view group max |
| **Group Calculating** | Spinner on group max card, "Waiting for more members" | Not enough people yet | Wait or nudge members |
| **Group Ready** | Group max bar chart + "Your Budget" vs "Group Max" cards | I can see what we can all afford | Browse filtered suggestions |
| **Budget Too Low** | Amber indicator: "Your budget is setting the group max" (private) | I'm the limiting factor | Adjust budget or accept |
| **Error** | Red border on input, "Couldn't save. Try again." | Save failed | Retry |

### Activity Card States

| State | Visual | Available Actions |
|-------|--------|------------------|
| **Confirmed** | Solid card, checkmark | Edit, delete, view on map |
| **Proposed** | Dashed border, "Proposed" badge | Vote, edit, delete |
| **Voted On** | Purple vote badge with result | View vote results |
| **Over Budget** | Red DollarSign icon, strikethrough cost | Remove or adjust |
| **Dragging** | Elevated shadow, slight scale, placeholder gap | Drop to reorder |

### Member States

| State | Visual |
|-------|--------|
| **Online** | Green dot on avatar |
| **Away** | Yellow dot on avatar |
| **Offline** | No dot, slightly muted avatar |
| **Invited (pending)** | Dashed avatar ring, "Pending" label |

---

## Pass 6: Flow Integrity

### Critical User Flows

#### Flow 1: New User Joins Trip (Priya's Journey)
```
Email invite → Landing page → Sign up (Google/email) → Trip overview
→ Tooltip: "Set your private budget" → Budget input → Explainer carousel
→ Budget saved → See filtered activities → First vote notification
→ Cast vote → See results → Converted user
```

**Where users could get lost:**
- After signup, unsure where to go → Auto-redirect to trip that invited them
- Budget explainer too complex → Keep to 3 steps, under 10 seconds
- Don't understand "Group Max" → Side-by-side comparison card with clear labels

**First-time user failures prevented:**
- Guided tooltip sequence (budget → vote → explore)
- No dead ends: every screen has a clear next action
- Empty states always suggest what to do

#### Flow 2: Create and Complete a Poll (Riley's Journey)
```
Click "Create Poll" → Enter question → Add options → Set deadline (default 48h)
→ [Optional: expand advanced settings] → Publish → Notify members
→ Members vote → Quorum indicator updates → Deadline reached
→ Results declared → Winner highlighted → Activity feed entry
```

**Where users could get lost:**
- Too many vote types → Default to yes/no, others behind "More types" link
- Quorum concept confusing → Show as simple fraction: "5 of 8 voted"
- Ranked choice complex → Numbered badges + drag + up/down buttons

#### Flow 3: Set Blind Budget (Sam's Journey)
```
Navigate to Budget tab → See empty state with explainer prompt
→ First time: 3-step carousel → Enter budget amount
→ "Only you can see this" reassurance → Save → Lock animation
→ See "Your Budget" card (private) → See "Group Max" card (shared)
→ Browse activities filtered by group max
```

**Where users could get lost:**
- Don't trust privacy → Persistent lock icon + expandable privacy details
- Don't understand group max → "Based on 8 of 12 members" confidence indicator
- Confused about what others see → Side-by-side "only you" vs "everyone" cards

#### Flow 4: Plan Itinerary Collaboratively
```
Open Itinerary tab → See day-by-day timeline (or empty state)
→ Click "Add Activity" → Fill in details (name, time, location, cost)
→ Location search (Google Maps autocomplete) → Save
→ Activity appears in timeline → Drag to reorder → Toggle map view
→ See all activities on map with route lines
```

**Where users could get lost:**
- Which day to add to → Day selector prominent in "Add Activity" modal
- Location search fails → Fallback to manual text entry
- Reordering not obvious → Drag handle visible, instruction tooltip on first use

### UX Constraints for Visual Phase

1. **Lock icon must always be visible** on budget inputs and anonymous polls — never rely on memory
2. **Poll status must be scannable** at glance — badge system (Active/Voted/Closed/Failed)
3. **Touch targets ≥ 44px** on all interactive elements — especially vote buttons and drag handles
4. **No horizontal scrolling** at any breakpoint — single-column cards on mobile
5. **Empty states are educational** — never just "Nothing here," always suggest the next action
6. **Destructive actions require 2 steps** — click → confirm dialog
7. **Real-time updates must animate** — not suddenly appear (jarring) or require refresh (stale)
8. **Progressive disclosure at 3 levels**: (1) default simple view, (2) expandable details, (3) dedicated settings page
9. **Privacy indicators use teal** (#0D9488) — never primary blue — to create a distinct "privacy mode" visual language
10. **Voting indicators use purple** (#7C3AED) — distinct from primary actions — to create a "democratic" visual language

---

## Screen Inventory

### Full Screen List (Build Order)

| # | Screen | Priority | Phase |
|---|--------|----------|-------|
| 1 | Marketing - Landing Page | P1 | 1 |
| 2 | Auth - Sign Up / Sign In | P1 | 1 |
| 3 | Auth - Invite Accept | P1 | 1 |
| 4 | Dashboard - My Trips | P1 | 1 |
| 5 | Trip - Create New Trip | P1 | 1 |
| 6 | Trip - Overview | P1 | 1 |
| 7 | Trip - Members & Invites | P1 | 1 |
| 8 | Itinerary - Day Timeline | P1 | 2 |
| 9 | Itinerary - Add/Edit Activity | P1 | 2 |
| 10 | Itinerary - Map View | P1 | 2 |
| 11 | Voting - Poll List (Active + History) | P1 | 3 |
| 12 | Voting - Create Poll | P1 | 3 |
| 13 | Voting - Cast Vote (Yes/No) | P1 | 3 |
| 14 | Voting - Cast Vote (Ranked Choice) | P1 | 3 |
| 15 | Voting - Cast Vote (Approval) | P1 | 3 |
| 16 | Voting - Poll Results | P1 | 3 |
| 17 | Budget - My Budget (Private Input) | P1 | 5 |
| 18 | Budget - Group Range Display | P1 | 5 |
| 19 | Budget - Blind Budgeting Explainer | P1 | 5 |
| 20 | Expenses - Entry & List | P2 | 4 |
| 21 | Expenses - Settlement Summary | P2 | 4 |
| 22 | Activity Feed | P1 | 1 |
| 23 | Notifications Center | P2 | 1 |
| 24 | Profile & Settings | P2 | 1 |
| 25 | Marketing - Features Page | P2 | 1 |
| 26 | Marketing - Pricing Page | P2 | 1 |

---

**End of UX Specification**
