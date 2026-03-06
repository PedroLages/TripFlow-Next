# Collaborative Editing UX Patterns Research

**Created**: 2026-02-09
**Status**: Complete
**Purpose**: Survey best-in-class collaborative tools to identify UX patterns for TripOS real-time group collaboration

---

## Executive Summary

This research examines collaborative editing UX patterns across 10 leading tools to inform TripOS's real-time collaboration features for group travel planning (3-12 people editing simultaneously on mobile and desktop).

**Key Findings**:
- **Presence indicators** have evolved from simple avatars to ambient, context-aware signals
- **CRDTs** are replacing Operational Transformation for conflict-free collaboration
- **Local-first architecture** is the 2026 standard for instant, offline-capable experiences
- **Mobile collaboration** requires simplified presence, gesture-based navigation, and haptic feedback
- **Activity feeds** need intelligent batching and granular notification controls

**Recommended Patterns for TripOS**:
1. Avatar stacks with online/offline states (like Linear, Figma)
2. Optimistic UI with local-first sync (Supabase Realtime + CRDTs)
3. Unified activity feed with "For me" personalization (like Linear Pulse)
4. Granular notification controls with intelligent batching
5. Mobile-first gestures with haptic feedback for collaborative actions

**Anti-Patterns to Avoid**:
1. Real-time cursors on mobile (clutters small screens)
2. Uncontrolled notification floods (causes alert fatigue)
3. Server-dependent sync (breaks offline editing)

---

## 1. Tool Survey: Collaborative Features Analysis

### 1.1 Google Docs

**Presence Indicators**:
- Profile bubbles showing active collaborators in header
- Colored text carets showing who's typing where
- "Anonymous user" for non-authenticated viewers
- Click avatar to jump to their cursor location

**Conflict Resolution**:
- Operational Transformation (OT) for text editing
- Server-coordinated to ensure consistency
- Last-write-wins for formatting conflicts
- Requires active server connection

**Activity Feed**:
- Version history with timestamps and author names
- Restore previous versions
- Comment threads with @mentions
- Suggestion mode for tracked changes

**Mobile UX**:
- Simplified presence (avatars only, no cursors on mobile)
- Touch-optimized comment bubbles
- Offline editing with sync when reconnected

**Strengths**: Rock-solid reliability, familiar UX, excellent version history
**Weaknesses**: Limited customization, requires Google account, server-dependent

### 1.2 Notion

**Presence Indicators**:
- Avatar stacks showing current viewers/editors
- "Recently edited by" metadata on pages
- Live typing indicators in comments
- Presence detection across workspace (who's online)

**Conflict Resolution**:
- Block-level locking (prevents simultaneous edits on same block)
- Optimistic updates with conflict detection
- Shows "Someone else is editing" message when conflicts occur
- Merges non-conflicting changes automatically

**Activity Feed**:
- Dedicated "Updates" inbox for notifications
- Page-level activity log (who viewed/edited/commented)
- @mention notifications
- Granular notification settings (per page, per workspace)

**Mobile UX** (2026 updates):
- One-tap AI transcriptions that work with screen locked
- Mobile-first brainstorming and note-taking
- Full Notion Agent features on mobile
- Seamless switching between apps without losing context

**Strengths**: Excellent activity feed, granular permissions, mobile-first 2026 updates
**Weaknesses**: Block locking can frustrate simultaneous editors, occasional sync lag

### 1.3 Figma

**Presence Indicators**:
- Floating avatars showing each user's position on canvas
- Named cursors with user-specific colors
- "Follow mode" to track another user's viewport
- Option to show/hide cursors
- Button to jump to any collaborator's location

**Conflict Resolution**:
- Switched from OT to CRDTs in 2019
- Allows non-linear, conflict-free editing of complex objects
- CRDTs enable editing shapes, layers, properties without transformation functions
- Real-time sync for up to 50 simultaneous users

**Activity Feed**:
- File history with thumbnails of changes
- Component-level change tracking
- Comment threads pinned to specific elements
- Activity notifications in Figma inbox

**Mobile UX**:
- Simplified presence (avatars without cursor tracking)
- Touch gestures for pan/zoom/select
- View-only or light editing on mobile
- Primary collaboration on desktop

**Strengths**: Best-in-class cursor tracking, CRDT reliability, up to 50 concurrent users
**Weaknesses**: Desktop-first (mobile is view-mostly), steep learning curve

**Technical Innovation**: Uses WebRTC for peer-to-peer sync, CRDTs for conflict-free state management

### 1.4 Linear

**Presence Indicators**:
- Minimal, non-intrusive presence signals
- Shows who's viewing/editing specific issues
- Real-time updates without page refresh
- Presence integrated into notifications

**Conflict Resolution**:
- Field-level conflict detection
- Last-write-wins with conflict warnings
- Shows "Someone updated this issue" banner when conflicts occur
- Encourages communication over technical merges

**Activity Feed**:
- **Pulse feature** (2026): Unified feed of updates across workspace
  - "For me" section: Personalized feed of relevant project/initiative updates
  - Popular and Recent sections: Company-wide visibility
  - Available on iOS and Android apps
- **Inbox**: Notification center for subscribed issues
- Bi-directional Slack sync for comments
- Project updates with rich formatting and @mentions

**Mobile UX**:
- Full Pulse feed on mobile (iOS/Android)
- Swipe gestures for triage/archive
- Smart notification batching
- Offline-capable with sync queue

**Strengths**: Excellent unified activity feed (Pulse), clean UX, strong mobile support
**Weaknesses**: Less real-time collaboration than Figma/Docs (more async workflow)

### 1.5 Miro (Collaborative Whiteboard)

**Presence Indicators**:
- Hundreds of named cursors visible on infinite canvas
- Avatar stacks showing all active participants
- Real-time cursor tracking (can toggle on/off)
- "Go to" button to jump to any user's cursor
- Video chat for up to 25 participants (acquired Around in 2022)

**Conflict Resolution**:
- Object-level locking (only one person edits sticky note at a time)
- Optimistic updates for moving/creating objects
- Visual conflict indicators when two users grab same object
- CRDTs for spatial collaboration

**Activity Feed**:
- Board-level activity log
- Comment threads with pins to canvas locations
- @mention notifications
- Email digests for board activity

**Mobile UX**:
- Touch gestures for pan/zoom
- Simplified presence (avatars only)
- Limited editing on mobile (view and light commenting)
- Designed for desktop collaboration

**Strengths**: Scalable presence (hundreds of cursors), built-in video chat, infinite canvas
**Weaknesses**: Desktop-first, overwhelming on mobile, requires high bandwidth

### 1.6 Asana

**Presence Indicators**:
- Shows who's viewing tasks (limited presence)
- No real-time cursor tracking
- Focused on async collaboration

**Conflict Resolution**:
- Last-write-wins for task updates
- Activity log shows conflict history
- No real-time collaborative editing

**Activity Feed**:
- Unified activity feed in chronological order
- Task comments with @mentions
- Project status updates in shared dashboards
- Granular notification settings

**Mobile UX**:
- Full mobile apps (iOS/Android)
- Push notifications for updates
- Offline task creation with sync
- Touch-optimized task views

**Strengths**: Excellent activity feed, strong mobile apps, async-first design
**Weaknesses**: No real-time collaborative editing, limited presence awareness

### 1.7 Airtable

**Presence Indicators**:
- Shows active collaborators on base/view
- Real-time cursor indicators in grid view
- Limited presence detail compared to Figma/Docs

**Conflict Resolution**:
- Cell-level locking (one editor at a time per cell)
- Real-time sync for non-conflicting changes
- Last-write-wins with conflict warnings
- Shows "Someone else edited this" message

**Activity Feed**:
- Field-level activity log (who changed what)
- Base-level revision history
- Comment threads on records
- Granular permissions (field and table level)

**Mobile UX**:
- Full mobile apps with offline editing
- Touch-optimized grid and form views
- Smart syncing when reconnected
- Limited real-time collaboration on mobile

**Strengths**: Granular permissions, field-level change tracking, strong mobile apps
**Weaknesses**: Complex UX for casual users, cell locking can frustrate simultaneous editors

### 1.8 Coda

**Presence Indicators**:
- Avatar stacks showing current viewers
- Real-time typing indicators
- Shows who's editing which sections

**Conflict Resolution**:
- Block-level conflict detection (similar to Notion)
- Optimistic updates with server sync
- Merges non-conflicting changes automatically

**Activity Feed**:
- Page-level activity log
- Comment notifications
- Version history with restore

**Mobile UX**:
- Mobile apps for iOS/Android
- Simplified editing on mobile
- Real-time sync across devices

**Strengths**: Powerful doc + database hybrid, real-time collaboration
**Weaknesses**: Steep learning curve, desktop-first UX

### 1.9 Supabase Realtime (Infrastructure Layer)

**Not a product, but the infrastructure TripOS will use for collaboration**

**Real-Time Architecture**:
- WebSocket-based subscriptions to PostgreSQL changes
- Uses Postgres LISTEN/NOTIFY + logical decoding (WAL)
- Elixir-based Realtime Server converts DB changes to WebSocket messages
- Sub-100ms latency for message delivery

**Presence Tracking**:
- Built-in Presence API for tracking online users
- Broadcast API for pub/sub messaging
- Postgres Changes API for database subscriptions
- Presence Authorization for privacy controls

**Conflict Resolution**:
- Database-level conflict detection
- Row-level security (RLS) policies
- Optimistic UI with debouncing recommended
- Filter updates at subscription level to reduce noise

**Scale**:
- Handles 10,000+ concurrent WebSocket connections
- 150 concurrent users with zero lag (tested)
- For 100K+ users: requires read replicas + connection pooling

**Strengths**: Built into TripOS's chosen stack, sub-100ms latency, PostgreSQL-native
**Weaknesses**: Requires custom UX layer, not plug-and-play like Firebase

### 1.10 Local-First Tools (2026 Trend)

**Emerging Pattern**: Tools like Replicache, ElectricSQL, SignalDB, RxDB

**Architecture**:
- Local SQLite/IndexedDB storage in browser
- CRDTs for conflict-free merging
- Server sync as enhancement, not requirement
- Offline-first with optimistic UI

**Why This Matters for 2026**:
> "In 2026, tolerance for fragile online-only applications is expected to disappear, with users now expecting web apps to feel as snappy as native desktop software." - [DEV Community](https://dev.to/the_nortern_dev/the-architecture-shift-why-im-betting-on-local-first-in-2026-1nh6)

**Key Principles**:
- WASM + SQLite running in browser
- Optimistic updates (assume success, sync later)
- CRDTs for automatic conflict resolution
- Server as sync hub, not source of truth

**Implications for TripOS**:
- Use Supabase Realtime with local-first patterns
- Implement optimistic UI for all write operations
- Design for offline-capable trip editing
- Sync when connected, queue when offline

---

## 2. Deep Dive: UX Pattern Analysis

### 2.1 Presence Indicators

#### Evolution of Presence (2019 → 2026)

**2019**: Simple avatars and cursors (Google Docs, Figma)
**2026**: Ambient, context-aware presence signals

> "Presence detection needs ambient indicators (light changes, subtle sounds). This represents a shift from purely visual presence signals to more nuanced, non-intrusive feedback mechanisms that don't clutter the interface." - [LinkedIn UX Trends](https://www.linkedin.com/advice/0/how-can-you-design-uiux-software-products-dtg1c)

#### Best Practices

**1. Avatar Stacks** (Linear, Notion, Figma)
- Show all active collaborators in compact header
- Color-coded with user initials/photos
- Tooltip shows full name and status
- Max 5-7 visible, "+N others" overflow
- Click to see full list

**2. Cursor Tracking** (Figma, Google Docs, Miro)
- Named cursors with user-specific colors
- Real-time position updates
- "Follow mode" to track another user's viewport
- **Desktop only** - too cluttered on mobile

**3. Typing Indicators** (Notion, Linear)
- Shows "Alice is typing..." in comments
- Subtle pulse animation
- Disappears after 3-5 seconds of inactivity

**4. Member Location** (Figma, Miro)
- Shows where users are within the workspace
- Important for spatial tools (maps, whiteboards)
- "Go to Alice's location" quick jump
- **Instant updates** - reflect immediately in UI

**5. Ambient Indicators** (2026 Trend)
- Subtle color shifts in UI elements
- Haptic feedback on mobile when others join
- Sound effects (optional, mutable)
- Non-intrusive background signals

#### Mobile Adaptations

**Desktop**: Full cursor tracking, detailed presence
**Mobile**: Simplified to avatar stacks only

> "Over 75% of global internet traffic will come from small screens, with 88% of users likely to leave after a poor visit. Touch gestures should provide clear affordances and haptic feedback." - [Medium Mobile UX Trends](https://webdesignerindia.medium.com/10-mobile-ux-design-trends-2026-231783d97d28)

**Mobile Presence Best Practices**:
- Avatar stacks in collapsible header
- Haptic pulse when new user joins
- No cursor tracking (saves screen space)
- Presence count badge (e.g., "3 online")
- Swipe to see full member list

### 2.2 Conflict Resolution

#### Two Main Approaches

**Operational Transformation (OT)** - Used by Google Docs, older tools
- Transforms concurrent operations to apply in any order
- Server-coordinated for consistency
- Low-latency UX with optimistic updates
- Complex to implement (transformation functions for every property)
- Requires active server connection

**Conflict-free Replicated Data Types (CRDTs)** - Used by Figma, modern tools
- Makes operations mathematically commutative
- No central coordinator needed
- Merges changes conflict-free
- Better for complex objects (shapes, layers, properties)
- Enables offline editing with eventual consistency

> "Figma switched from Operational Transformation to CRDTs in 2019 because multiplayer design involves more than text—shapes, layers, and properties need non-linear conflict resolution, and CRDTs let them model complex state machines without writing transformation functions for every property." - [DEV Community](https://dev.to/astrodevil/build-real-time-presence-features-like-figma-and-google-docs-in-your-app-in-minutes-1lae)

#### When to Use Each

| Approach | Best For | Examples |
|----------|----------|----------|
| **OT** | Linear text editing, simple documents | Google Docs, Etherpad |
| **CRDTs** | Complex objects, spatial data, offline-first | Figma, Miro, local-first apps |

#### Conflict Resolution UX Patterns

**1. Optimistic Updates** (All modern tools)
- Show changes instantly (assume success)
- Sync to server in background
- Rollback on failure with user notification

**2. Field-Level Locking** (Linear, Airtable)
- Lock specific fields when being edited
- Show "Alice is editing this field" indicator
- Unlock on blur or after timeout
- Prevents conflicting edits proactively

**3. Block-Level Locking** (Notion, Coda)
- Lock document blocks (paragraphs, images, etc.)
- Shows "Someone else is editing" message
- Merges non-conflicting changes automatically

**4. Object-Level Locking** (Miro, whiteboards)
- Lock objects when grabbed/moved
- Visual indicator (border, color change)
- Release on drop or escape key

**5. Last-Write-Wins with Warnings** (Asana, Linear)
- Most recent edit takes precedence
- Shows banner: "Someone updated this while you were editing"
- Option to reload or override

**6. Manual Merge UI** (Git-style, rare in consumer apps)
- Shows conflicting versions side-by-side
- User chooses which to keep
- Too complex for casual users - avoid

#### Recommended for TripOS

**Use CRDTs** (via Supabase Realtime + local-first pattern)
- Activities, votes, budgets are complex objects
- Need offline editing for mobile users
- CRDTs handle asynchronous edits well

**Field-level conflict detection**:
- When two users edit same activity simultaneously
- Show "Alice just updated this activity" banner
- Option to merge or reload

**Optimistic UI everywhere**:
- Add activity → shows immediately
- Vote on option → updates instantly
- Edit note → saves in background

### 2.3 Activity Feeds & Audit Trails

#### Core Components

> "Audit logs are a centralized stream of user activity consisting of entries with events, timestamps, and payloads. Audit logs record the occurrence of an event, the time at which it occurred, the responsible user or service, and the impacted entity." - [Medium Audit Logs Guide](https://medium.com/@tony.infisical/guide-to-building-audit-logs-for-application-software-b0083bb58604)

**Essential Fields**:
- **What changed**: Table/record/field name
- **What changed**: Old value → New value
- **Who and when**: User, timestamp, operation type
- **Context**: IP address (optional), user agent, session ID

#### UX Patterns

**1. Unified Activity Feed** (Linear Pulse, Asana)
- Single chronological stream of all updates
- Filterable by project, user, action type
- "For me" personalized section
- "Popular" and "Recent" global sections

**2. Contextual Activity Logs** (Notion, Airtable)
- Page/record-level activity shown in sidebar
- Field-level before/after values
- User avatars + timestamps
- Keyboard navigation between entries

**3. Version History** (Google Docs, Notion)
- Timeline of snapshots
- Visual diff (highlight changes)
- Restore to any previous version
- Named versions (e.g., "v1.0 Draft")

**4. Comment Threads** (All tools)
- Threaded conversations on specific items
- @mention notifications
- Resolve/unresolve status
- Link to exact location (e.g., "Alice commented on Day 3 → Lunch")

#### Display Formats

**Paginated Table** (Enterprise audit logs):
```
| Timestamp | User | Action | Item | Changes |
|-----------|------|--------|------|---------|
| 2026-02-09 3:45pm | Alice | Updated | "Day 2 Lunch" | Location: "Pizza Place" → "Taco Truck" |
```

**Activity Stream** (Consumer apps):
```
Alice updated Day 2 Lunch
Location: Pizza Place → Taco Truck
3 minutes ago
```

**Timeline View** (Version history):
```
Feb 9, 3:45pm - Alice edited
Feb 9, 2:30pm - Bob added vote
Feb 9, 1:15pm - Charlie created activity
```

#### Timestamp Best Practices

- **Relative timestamps** for recent items: "3 minutes ago", "2 hours ago"
- **Absolute timestamps** for older items: "Feb 9, 2026 at 3:45pm"
- **Timezone awareness**: Show in user's local timezone
- **Format**: "YYYY-MM-DD hh:mm am/pm" for accessibility

#### Mobile Adaptations

- Compact activity cards (not full table)
- Swipe to filter by action type
- Tap to expand full details
- Infinite scroll (not pagination)
- Pull-to-refresh for latest updates

### 2.4 Optimistic UI Updates

#### The Pattern

> "An Optimistic User Interface is a design pattern that provides instant feedback to the user by assuming that an operation or server call will succeed, instead of showing loading spinners or waiting for server confirmations." - [Medium Optimistic UI](https://medium.com/@alexglushenkov/optimistic-ui-making-apps-feel-faster-even-when-theyre-not-ea296bc84720)

**How It Works**:
1. User action (e.g., "Add activity")
2. **Immediately update UI** (assume success)
3. Send request to server in background
4. On success: Do nothing (already shown)
5. On failure: Rollback + show error notification

#### Critical Use Cases for TripOS

> "Optimistic updates are critical for real-time feeling features like chat messages, likes, comments, cart updates, poll votes, collaborative editing." - [OpenReplay Blog](https://blog.openreplay.com/optimistic-updates-make-apps-faster/)

**Apply to**:
- Adding/editing activities
- Voting on options
- Adding comments
- Updating budgets
- Reordering itinerary items
- Joining/leaving trips

#### Implementation Pattern (React Query + Optimistic Updates)

**React's `useOptimistic` Hook** (2026):
```javascript
const [optimisticState, addOptimistic] = useOptimistic(
  serverState,
  (state, newItem) => [...state, newItem]
);

function handleAdd(item) {
  addOptimistic(item); // Update UI immediately
  mutate(item); // Send to server
}
```

**Rollback Strategy**:
- Store original state before update
- On server error, revert to original
- Show toast: "Failed to add activity. Retrying..."
- Auto-retry up to 3 times
- If all retries fail, show manual "Retry" button

#### Debouncing for High-Frequency Updates

> "For applications with rapid state changes, debouncing is recommended to optimize performance." - [Supabase Realtime Guide](https://chat2db.ai/resources/blog/supabase-realtime-guide)

**When to debounce**:
- Text input (notes, descriptions): 500ms
- Drag-and-drop reordering: On drop only
- Budget sliders: 300ms after last change
- Vote toggles: Immediate (no debounce)

### 2.5 Mobile vs Desktop UX

#### Key Differences

| Feature | Desktop | Mobile |
|---------|---------|--------|
| **Presence** | Avatar stacks + cursor tracking | Avatar stacks only |
| **Notifications** | Toasts, browser notifications | Push notifications, haptic feedback |
| **Gestures** | Mouse hover, click, drag | Swipe, long-press, pinch, pull-to-refresh |
| **Activity Feed** | Paginated table | Infinite scroll cards |
| **Editing** | Inline editing, multi-select | Full-screen editors, single-item focus |
| **Real-time Updates** | Live cursors, typing indicators | Subtle badges, haptic pulses |

#### Mobile-First Collaboration Principles

**1. Gesture-Based Navigation** (2026 Trend)
> "Top UI/UX trends in mobile apps by 2026 include gesture-based navigation, with touch gestures providing clear affordances and haptic feedback to confirm actions without clutter." - [Medium Mobile UX](https://webdesignerindia.medium.com/10-mobile-ux-design-trends-2026-231783d97d28)

**Common Gestures**:
- **Swipe left** on activity: Delete or archive
- **Swipe right** on activity: Mark complete
- **Long-press** on activity: Multi-select mode
- **Pull-to-refresh**: Reload trip data
- **Pinch-to-zoom**: Map view
- **Tap + hold avatar**: See member details

**2. Haptic Feedback**
- New user joins trip: Light pulse
- Vote submitted: Success vibration
- Conflict detected: Warning pulse
- Activity added: Subtle tap

**3. Adaptive UI**
- Collapse presence avatars into count badge on scroll
- Bottom sheet editors (not modal dialogs)
- Sticky action buttons (add, vote, comment)
- One-handed reachability

**4. Offline-First**
> "WASM + SQLite running in browser is the game changer. Users expect web apps to feel as snappy as native desktop software." - [DEV Community Local-First](https://dev.to/the_nortern_dev/the-architecture-shift-why-im-betting-on-local-first-in-2026-1nh6)

- Cache trip data locally
- Queue mutations when offline
- Sync when reconnected
- Visual indicator: "Syncing...", "Offline", "Online"

**5. Simplified Presence**
- No cursor tracking on mobile (clutters small screen)
- Avatar stacks in collapsible header
- Presence count badge (e.g., "3 online")
- Tap avatar to see last active time

#### Notion's 2026 Mobile Updates (Example to Follow)

> "One tap starts AI note transcriptions (even when switching apps or locking the screen) and summarizes everything into clear summaries, action items, and shareable docs in seconds, with everything Notion Agent can do on desktop now available on phones." - [Notion Releases](https://www.notion.com/releases/2026-01-20)

**Key Lessons**:
- Mobile-first features, not desktop ports
- Background sync (works with screen locked)
- One-tap actions (no multi-step flows)
- Full feature parity with desktop

---

## 3. Recommended Patterns for TripOS

### Pattern 1: Avatar Stacks with Online/Offline States

**Why**: Clear visibility of who's collaborating without cluttering UI

**Implementation**:
- Header component showing max 5-7 avatars
- Color-coded rings: Green (online), Gray (offline), Yellow (idle >5min)
- "+N others" overflow with tap-to-expand list
- Tooltip on hover/tap: "Alice Chen • Online • Last active 2m ago"
- Haptic pulse when new member joins (mobile only)

**Supabase Integration**:
```javascript
// Subscribe to presence
const channel = supabase.channel('trip:123')
  .on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState()
    // Update avatar stack UI
  })
  .subscribe()

// Track current user presence
channel.track({ user_id, online_at: new Date() })
```

**References**: Linear, Notion, Figma

---

### Pattern 2: Optimistic UI with Local-First Sync

**Why**: Instant feedback, offline-capable, feels native

**Implementation**:
- All write operations update UI immediately
- Queue mutations in IndexedDB when offline
- Sync queue to Supabase when reconnected
- Rollback + retry on server error

**User Experience**:
- "Add activity" → Appears instantly in itinerary
- "Vote" → Updates vote count immediately
- "Edit note" → Saves with subtle "Saving..." → "Saved" indicator
- Offline indicator in header: "Working offline • Changes will sync"

**React Query Pattern**:
```javascript
const { mutate } = useMutation({
  mutationFn: addActivity,
  onMutate: async (newActivity) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['activities'])

    // Snapshot previous value
    const previous = queryClient.getQueryData(['activities'])

    // Optimistically update
    queryClient.setQueryData(['activities'], old => [...old, newActivity])

    return { previous }
  },
  onError: (err, newActivity, context) => {
    // Rollback on error
    queryClient.setQueryData(['activities'], context.previous)
    toast.error('Failed to add activity. Retrying...')
  }
})
```

**References**: Figma CRDTs, Replicache, Supabase Realtime

---

### Pattern 3: Unified Activity Feed with "For Me" Personalization

**Why**: Keeps users informed without overwhelming them

**Implementation**:
- **Unified feed** showing all trip updates chronologically
- **Tabs**: "For Me" (personalized), "All Activity" (everything)
- **For Me** shows:
  - Activities/votes assigned to me
  - @mentions and replies to my comments
  - Changes to activities I created
  - Trip members joining/leaving
- **All Activity** shows full audit trail
- Filter by: Action type, User, Date range
- Mark as read/unread

**Activity Item Format**:
```
[Avatar] Alice updated "Day 2 Lunch"
         Location: Pizza Place → Taco Truck
         Cost: $15 → $12
         3 minutes ago
```

**Mobile Adaptation**:
- Infinite scroll cards (not table)
- Swipe left to mark as read
- Pull-to-refresh for latest
- Bottom sheet for filters

**References**: Linear Pulse, Asana activity feed, Notion updates

---

### Pattern 4: Granular Notification Controls with Intelligent Batching

**Why**: Prevents alert fatigue, respects user preferences

**Implementation**:
- **Notification Settings per Trip**:
  - All activity (noisy)
  - @mentions and votes only (default)
  - Trip updates only (quiet)
  - Muted (no notifications)
- **Batching**: Group multiple updates into single notification
  - "Alice and 2 others updated the itinerary" (not 3 separate notifications)
  - Batch window: 5 minutes
- **Channels**: In-app, Email, Push (user chooses per trip)
- **Quiet Hours**: Mute notifications 10pm-8am (user timezone)

**Notification Hierarchy** (High, Medium, Low):
- **High** (always notify): New votes, @mentions, trip invites
- **Medium** (respect batching): Activity updates, comments
- **Low** (daily digest): Member joined, budget updated

**References**: Linear notifications, Asana granular settings, Notion inbox

---

### Pattern 5: Mobile-First Gestures with Haptic Feedback

**Why**: Touch-optimized, one-handed, accessible

**Implementation**:
- **Swipe gestures**:
  - Swipe right on activity → Quick vote
  - Swipe left on activity → Options menu (edit/delete)
  - Pull-down → Refresh trip data
- **Haptic feedback**:
  - Vote submitted → Success pulse
  - Activity added → Subtle tap
  - New member joined → Light vibration
  - Conflict detected → Warning pulse (longer)
- **Long-press actions**:
  - Long-press activity → Multi-select mode
  - Long-press avatar → Member details bottom sheet
- **Bottom sheets** (not modals):
  - Activity editor
  - Vote creator
  - Member invite
  - Filters and settings

**Accessibility**:
- All gestures have button alternatives
- Haptic feedback respects OS settings (can be disabled)
- VoiceOver announcements for all state changes

**References**: Notion mobile 2026, iOS/Android gesture standards

---

## 4. Anti-Patterns to Avoid

### Anti-Pattern 1: Real-Time Cursors on Mobile

**Problem**: Clutters small screens, drains battery, poor touch UX

**Why It Fails**:
- Mobile screens are 5-6 inches, not 15+ like desktop
- Cursors obscure content users are trying to read/edit
- Touch gestures don't map to cursor movement
- High CPU/battery cost for tracking positions

**What to Do Instead**:
- Avatar stacks in header (collapsed to count on scroll)
- Presence indicators without cursor tracking
- "Alice is editing this activity" badges
- Desktop: Show cursors. Mobile: Show avatars only.

**References**: Figma (desktop cursors, mobile avatars), Google Docs (no mobile cursors)

---

### Anti-Pattern 2: Uncontrolled Notification Floods

**Problem**: Causes alert fatigue, users disable all notifications

**Why It Fails**:
- Every edit triggers notification = dozens per minute in active trips
- Users mute app entirely to stop spam
- Misses truly important updates (votes, @mentions)

**What to Do Instead**:
- **Intelligent batching**: Group updates within 5-minute window
  - Bad: "Alice updated Day 2", "Alice updated Day 3", "Alice updated Day 4"
  - Good: "Alice updated 3 activities"
- **Notification hierarchy**: High (always), Medium (batched), Low (digest)
- **Granular controls**: Per-trip settings (All / Mentions only / Muted)
- **Quiet hours**: Default to mute 10pm-8am

**References**: Linear notification settings, Asana granular controls

---

### Anti-Pattern 3: Server-Dependent Sync (No Offline Support)

**Problem**: Breaks on poor connections, unusable on planes/trains

**Why It Fails**:
- Mobile users have spotty connections (tunnels, rural areas, international roaming)
- Plane/train travel = no internet, but perfect time to plan trips
- Loading spinners on every action = slow, frustrating UX

**What to Do Instead**:
- **Local-first architecture**:
  - IndexedDB/SQLite cache of trip data
  - Optimistic UI (update local first)
  - Mutation queue (sync when reconnected)
  - Offline indicator: "Working offline • Changes will sync"
- **Supabase Realtime** handles reconnection automatically
- **Test on throttled 3G** to ensure good offline UX

> "In 2026, tolerance for fragile online-only applications is expected to disappear, with users now expecting web apps to feel as snappy as native desktop software." - [DEV Community](https://dev.to/the_nortern_dev/the-architecture-shift-why-im-betting-on-local-first-in-2026-1nh6)

**References**: Notion mobile offline, Replicache local-first, Figma offline editing

---

## 5. Implementation Guidance for TripOS

### Phase 1: Collaboration Foundation (Weeks 0-6)

**Priority 1: Presence System**
- [ ] Implement Supabase Realtime Presence API
- [ ] Avatar stack component (desktop + mobile)
- [ ] Online/offline/idle states with color-coded rings
- [ ] "Who's online" panel with last active timestamps
- [ ] Haptic feedback when members join (mobile)

**Priority 2: Optimistic UI**
- [ ] React Query setup with optimistic updates
- [ ] IndexedDB cache for trip data
- [ ] Mutation queue for offline editing
- [ ] "Saving..." → "Saved" → "Failed (Retry)" states
- [ ] Offline indicator in header

**Priority 3: Activity Feed**
- [ ] Database schema: `activity_log` table (who, what, when, changes)
- [ ] Unified activity feed component
- [ ] "For Me" personalization logic
- [ ] Filters: Action type, User, Date range
- [ ] Mark as read/unread

**Priority 4: Notifications**
- [ ] Granular settings per trip (All / Mentions / Muted)
- [ ] Batching logic (5-minute window)
- [ ] Notification hierarchy (High, Medium, Low)
- [ ] Quiet hours (10pm-8am default)
- [ ] Push notification setup (web + mobile)

### Phase 3: Structured Voting (Weeks 10-14)

**Real-Time Vote Updates**:
- [ ] Supabase subscription to `votes` table
- [ ] Optimistic vote submission (instant UI update)
- [ ] Live vote count updates for all participants
- [ ] "Alice just voted" activity feed items
- [ ] Vote deadline countdown (real-time)

**Conflict Handling**:
- [ ] Detect duplicate votes (same user, same poll)
- [ ] Handle vote changes (user toggling vote)
- [ ] Show "Vote updated" confirmation

### Phase 5: Blind Budgeting (Weeks 18-22)

**Privacy-First Collaboration**:
- [ ] Private budget stored client-side (encrypted IndexedDB)
- [ ] Group max calculation without revealing individuals
- [ ] Real-time updates when members submit budgets
- [ ] Activity feed: "Alice submitted their budget" (no amount shown)
- [ ] Conflict: What if user changes budget after group max calculated?
  - Solution: Recalculate group max, notify other members ("Budget range updated")

### Mobile-Specific Implementation

**Gestures**:
- [ ] Swipe right on activity → Quick vote
- [ ] Swipe left on activity → Edit/delete menu
- [ ] Pull-to-refresh on trip view
- [ ] Long-press activity → Multi-select mode

**Haptics**:
- [ ] Vote submitted → Success pulse
- [ ] Member joined → Light vibration
- [ ] Conflict detected → Warning pulse
- [ ] Activity added → Subtle tap

**Bottom Sheets**:
- [ ] Activity editor (full-screen on mobile)
- [ ] Vote creator
- [ ] Member invite
- [ ] Settings and filters

### Testing Checklist

**Real-Time Sync**:
- [ ] Test with 3+ simultaneous users
- [ ] Verify sub-100ms update latency
- [ ] Check offline → online sync
- [ ] Test conflict scenarios (same activity edited simultaneously)

**Mobile UX**:
- [ ] Test on throttled 3G connection
- [ ] Verify haptic feedback on iOS/Android
- [ ] Test gestures on small screens (iPhone SE)
- [ ] Ensure one-handed reachability

**Presence**:
- [ ] User goes idle after 5 minutes → Status changes to yellow
- [ ] User closes tab → Status changes to offline
- [ ] User reconnects → Status changes to online
- [ ] Presence updates reflected within 1 second

**Notifications**:
- [ ] Batching works (3 updates in 5 min → 1 notification)
- [ ] Quiet hours respected
- [ ] Push notifications work on mobile
- [ ] Email notifications respect user settings

---

## 6. Additional Patterns & Considerations

### Typing Indicators

**When to Show**:
- Comments (show "Alice is typing...")
- Activity notes (show "Bob is editing this note")
- Not needed for: Quick actions (votes, budget updates)

**Implementation**:
- WebSocket message on keypress (debounced 300ms)
- Clear after 5 seconds of inactivity
- Show max 3 typing users: "Alice, Bob, and 1 other are typing..."

### Conflict Indicators

**Visual Cues**:
- Yellow border on conflicted item
- Banner: "Alice updated this while you were editing"
- Action buttons: "Reload" or "Keep my changes"

**When to Show**:
- Version mismatch detected on save
- User has unsaved changes + server has newer version
- Not needed for: Non-conflicting changes (different fields)

### Connection Status

**States**:
- **Online** (green): Real-time sync active
- **Syncing** (blue): Uploading queued changes
- **Offline** (gray): No connection, changes queued
- **Error** (red): Sync failed, retry needed

**Visual Indicator**:
- Subtle dot in header (mobile)
- Tooltip/banner with details (desktop)
- Toast on reconnection: "You're back online. Syncing changes..."

### Rate Limiting & Throttling

**Problem**: Malicious/buggy client spamming updates

**Solution**:
- Supabase RLS policies limit write rate
- Client-side debouncing for high-frequency updates
- Server-side rate limiting: Max 100 requests/minute per user
- Exponential backoff on repeated failures

### Collaborative Etiquette

**Teach Users Good Habits**:
- Onboarding tip: "Avoid editing the same activity at the same time as others"
- Show who's viewing/editing before you start
- "Follow mode" to coordinate with other planners
- Activity lock: "Ask Alice if you can edit this" (optional, not enforced)

---

## 7. Conclusion

### Key Takeaways

1. **Local-first is the 2026 standard** - Users expect offline-capable, instant UX
2. **CRDTs > OT for complex objects** - Votes, budgets, activities need conflict-free merging
3. **Mobile requires simplified presence** - No cursors, just avatars + haptics
4. **Activity feeds need personalization** - "For me" views prevent information overload
5. **Notification batching prevents fatigue** - Group updates within 5-minute windows

### TripOS Competitive Advantage

**None of the 7 competitors surveyed have**:
- Structured voting with real-time updates (Wanderlog has weak hearts, Kayak has disconnected Huddle)
- Blind budgeting with privacy-first collaboration
- Mobile-first collaborative editing

**By implementing these patterns, TripOS will have**:
- Best-in-class real-time collaboration (on par with Figma, Google Docs)
- Privacy-preserving budget features (completely unique)
- Mobile UX competitive with native apps (Notion 2026 quality)

### Next Steps

1. **Implement presence system** (Supabase Realtime Presence API)
2. **Build optimistic UI layer** (React Query + IndexedDB cache)
3. **Design activity feed** (unified stream with personalization)
4. **Set up notification system** (batching + granular controls)
5. **Test with 3+ users** (validate real-time sync, conflict handling)
6. **Iterate on mobile gestures** (swipes, haptics, bottom sheets)

**Timeline**: Collaborative features should be ready by end of Phase 1 (Week 6), with voting and blind budgeting building on this foundation in Phases 3-5.

---

## Sources

### Collaborative Editing & Real-Time UX
- [How to Design Real-Time Collaborative Document Editor](https://www.designgurus.io/blog/design-real-time-editor)
- [Build Real-Time Presence Features Like Figma and Google Docs](https://dev.to/astrodevil/build-real-time-presence-features-like-figma-and-google-docs-in-your-app-in-minutes-1lae)
- [Collaboration Tools and the Invasion of Live Cursors](https://prototypr.io/post/collaboration-tools-live-cursors)
- [How Figma's Multiplayer Technology Works](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/)
- [Collaboration UX Best Practices](https://ably.com/blog/collaborative-ux-best-practices)

### Conflict Resolution
- [CRDTs vs Operational Transformation](https://hackernoon.com/crdts-vs-operational-transformation-a-practical-guide-to-real-time-collaboration)
- [Building Collaborative Interfaces: OT vs CRDTs](https://dev.to/puritanic/building-collaborative-interfaces-operational-transforms-vs-crdts-2obo)
- [Conflict Resolution in Real-Time Collaborative Editing](https://tryhoverify.com/blog/conflict-resolution-in-real-time-collaborative-editing/)
- [Understanding Real-Time Collaboration with CRDTs](https://shambhavishandilya.medium.com/understanding-real-time-collaboration-with-crdts-e764eb65024e)

### Local-First & Optimistic UI
- [The Architecture Shift: Why I'm Betting on Local-First in 2026](https://dev.to/the_nortern_dev/the-architecture-shift-why-im-betting-on-local-first-in-2026-1nh6)
- [Building an Optimistic UI with RxDB](https://rxdb.info/articles/optimistic-ui.html)
- [How Optimistic Updates Make Apps Feel Faster](https://blog.openreplay.com/optimistic-updates-make-apps-faster/)
- [Optimistic UI: Making Apps Feel Faster](https://medium.com/@alexglushenkov/optimistic-ui-making-apps-feel-faster-even-when-theyre-not-ea296bc84720)

### Activity Feeds & Audit Trails
- [Guide to Building Audit Logs for Application Software](https://medium.com/@tony.infisical/guide-to-building-audit-logs-for-application-software-b0083bb58604)
- [Comprehensive Research: Audit Log Paradigms](https://dev.to/akkaraponph/comprehensive-research-audit-log-paradigms-gopostgresqlgorm-design-patterns-1jmm)
- [Notion Audit Log Help Center](https://www.notion.com/help/audit-log)
- [Linear Notifications Docs](https://linear.app/docs/notifications)
- [Linear Pulse Feature](https://linear.app/now)

### Notifications & UX Best Practices
- [Design Guidelines For Better Notifications UX](https://www.smashingmagazine.com/2025/07/design-guidelines-better-notifications-ux/)
- [How to Build Notifications That Encourage Collaboration](https://liveblocks.io/blog/how-to-build-notifications-that-encourage-collaboration)
- [Best Practices for Designing Notifications](https://app.uxcel.com/courses/ui-components-best-practices/notifications-best-practices-164)
- [Indicators, Validations, and Notifications](https://www.nngroup.com/articles/indicators-validations-notifications/)

### Mobile UX & Gestures
- [10 Mobile UX Design Trends Every Business Must Follow in 2026](https://webdesignerindia.medium.com/10-mobile-ux-design-trends-2026-231783d97d28)
- [The UX Trends 2026 Designers Need to Know](https://medium.com/@mohitphogat/the-ux-trends-2026-designers-need-to-know-not-just-guess-3269d023b0b7)
- [How Gesture-Based Interaction Is Transforming UX/UI Design](https://raw.studio/blog/how-gesture-based-interaction-is-transforming-ux-ui-design/)
- [Notion 2026 Mobile Updates](https://www.notion.com/releases/2026-01-20)

### Supabase Real-Time Implementation
- [Supabase Realtime Documentation](https://supabase.com/docs/guides/realtime)
- [Supabase Realtime Presence](https://supabase.com/features/realtime-presence)
- [How to Implement Supabase Realtime](https://chat2db.ai/resources/blog/supabase-realtime-guide)
- [Supabase Review 2026](https://hackceleration.com/supabase-review/)

### Tool-Specific Reviews
- [Miro Online Whiteboard](https://miro.com/online-whiteboard/)
- [Airtable vs Asana 2026 Comparison](https://www.softr.io/blog/airtable-vs-asana)
- [Linear Initiative and Project Updates](https://linear.app/docs/initiative-and-project-updates)
- [Figma Review 2026](https://saascrmreview.com/figma-review/)

---

**Document Version**: 1.0
**Word Count**: ~7,500 words
**Research Duration**: February 9, 2026
**Tools Surveyed**: 10 (Google Docs, Notion, Figma, Linear, Miro, Asana, Airtable, Coda, Supabase, Local-First Tools)
