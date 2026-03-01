---
stepsCompleted: ['step-01-validate-prerequisites', 'step-01-requirements-extraction-complete', 'step-02-design-epics-complete', 'step-03-create-stories-complete']
inputDocuments:
  - 'docs/planning-artifacts/prd.md'
  - 'docs/planning-artifacts/architecture.md'
  - 'docs/planning-artifacts/ux-design-specification.md'
  - 'tripflow-next/docs/TRIPFLOW-STYLE-GUIDE.md'
  - 'tripflow-next/docs/STYLE-GUIDE-ENFORCEMENT-SUMMARY.md'
  - 'tripflow-next/docs/tripos-migration/style-guide.md'
---

# Asia Trip - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Asia Trip, decomposing the requirements from the PRD, UX Design, Architecture, and Style Guide requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

#### FR1-FR10: Trip Management
- **FR1:** Users can create a new trip with destination, dates, and description
- **FR2:** Trip creators can invite travelers to a trip via email
- **FR3:** Invited travelers can join a trip by accepting an invitation
- **FR4:** Trip members can view the list of all travelers in their trip
- **FR5:** Trip creators can remove travelers from a trip
- **FR6:** Trip members can leave a trip they are part of
- **FR7:** Trip creators can transfer trip ownership to another member
- **FR8:** Users can view all trips they are a member of
- **FR9:** Users can archive completed trips
- **FR10:** Trip members can add a trip image or cover photo

#### FR11-FR20: Blind Budgeting
- **FR11:** Users can set a private budget for a trip in their preferred currency
- **FR12:** Users can update their private budget at any time
- **FR13:** Users can view their own budget value
- **FR14:** Users cannot view other travelers' individual budget values
- **FR15:** Trip members can view collective budget possibilities aggregated across all travelers (e.g., "4 people can afford €150/night hotels")
- **FR16:** The system recalculates collective possibilities when any traveler updates their budget
- **FR17:** Users can see visual indicators (teal color) that signal privacy-preserved budget features
- **FR18:** Users can set budget limits by category (accommodation, activities, food, transport)
- **FR19:** Trip members can see which travelers have completed budget setup vs. not yet set
- **FR20:** The system enforces minimum group size (3+ travelers) before showing collective possibilities

#### FR21-FR30: Itinerary Planning
- **FR21:** Trip members can add activities to the shared itinerary
- **FR22:** Trip members can add accommodations to the shared itinerary
- **FR23:** Trip members can assign activities and accommodations to specific days
- **FR24:** Trip members can edit activity details (name, time, location, estimated cost, notes)
- **FR25:** Trip members can delete activities from the itinerary
- **FR26:** Trip members can reorder activities within a day
- **FR27:** Trip members can move activities between days
- **FR28:** Trip members can view the itinerary in a day-by-day timeline format
- **FR29:** Trip members can add notes or comments to activities
- **FR30:** Trip members can mark activities as booked, estimated, or flexible

#### FR31-FR40: Democratic Decision-Making
- **FR31:** Trip members can create a vote for activities or accommodations
- **FR32:** Trip members can submit their vote on active voting options
- **FR33:** Each trip member can submit one vote per voting item
- **FR34:** Individual votes remain hidden until all trip members have voted
- **FR35:** Voting results are revealed after all members submit votes
- **FR36:** Trip members can see visual indicators (purple color) that signal voting features
- **FR37:** Trip members can view voting history and past decisions
- **FR38:** Trip members can see who has voted vs. who hasn't yet voted (without seeing their vote)
- **FR39:** Vote creators can close a vote manually before all votes are submitted
- **FR40:** Trip members can add options to an existing vote before voting begins

#### FR41-FR49: Expense Management
- **FR41:** Trip members can add shared expenses during or after the trip
- **FR42:** Trip members can assign expense categories (accommodation, food, transport, activities)
- **FR43:** Trip members can specify who paid for an expense
- **FR44:** Trip members can specify who should split an expense (all members or subset)
- **FR45:** The system calculates fair expense splits (equal or custom percentages)
- **FR46:** Trip members can view who owes whom and settlement amounts
- **FR47:** Trip members can mark expenses as settled
- **FR48:** Trip members can view expense history and totals by category
- **FR49:** Trip members can export expense data

#### FR50-FR56: Multi-Currency Support
- **FR50:** Users can set budgets in any supported currency
- **FR51:** Users can add expenses in any supported currency
- **FR52:** The system performs real-time currency conversion for budget calculations
- **FR53:** Users can set their preferred display currency
- **FR54:** The system displays all amounts in the user's preferred currency
- **FR55:** Trip members can view multi-currency breakdowns (original currency + converted)
- **FR56:** The system updates exchange rates periodically for accuracy

#### FR57-FR63: Real-Time Collaboration
- **FR57:** Trip members see itinerary updates from other members in real-time (within 500ms)
- **FR58:** Trip members can see presence indicators showing who is currently online
- **FR59:** Trip members can see which activities were recently edited and by whom
- **FR60:** The system shows typing or editing indicators when members are actively editing
- **FR61:** Trip members receive notifications when votes are created or results are revealed
- **FR62:** Trip members receive notifications when they are invited to a trip
- **FR63:** The system detects when a user's connection is lost and displays offline status

#### FR64-FR72: User & Access Management
- **FR64:** Users can create an account using email and password
- **FR65:** Users can log in using OAuth providers (Google, GitHub, Apple)
- **FR66:** Users can reset their password via email
- **FR67:** Users can update their profile (name, avatar, email)
- **FR68:** Users can delete their account and all associated data
- **FR69:** Users can export their trip data as JSON
- **FR70:** The system enforces trip access permissions (members-only access via Row-Level Security)
- **FR71:** The system prevents users from accessing trips they are not members of
- **FR72:** Users can manage notification preferences (email, push, in-app)

#### FR73-FR77: Project Setup & Infrastructure
- **FR73:** Developers can set up development environment with all required dependencies
- **FR74:** Developers can configure environment variables for all external services (Google Maps, Unsplash, Pexels, Supabase, encryption keys)
- **FR75:** Developers can initialize Supabase local database with migrations
- **FR76:** The system integrates with Google Maps JavaScript API for map features
- **FR77:** The system integrates with photo APIs (Unsplash, Pexels, Google Places) with fallback chain

#### FR78-FR81: Search & Filtering
- **FR78:** Trip members can search activities by name, location, or type
- **FR79:** Trip members can filter itinerary by day, cost range, or category
- **FR80:** Users can search trips by destination or date
- **FR81:** Trip members can filter expenses by category or traveler

#### FR82-FR85: Photo Management (User-Generated)
- **FR82:** Trip members can upload their own photos to activities
- **FR83:** Trip members can delete photos from activities
- **FR84:** The system compresses and optimizes uploaded photos automatically
- **FR85:** Photos are stored in Supabase Storage with CDN delivery for fast loading

#### FR86-FR90: Offline Functionality
- **FR86:** Users can view cached itinerary data while offline
- **FR87:** Users can view their own budget while offline
- **FR88:** Users can add and edit activities offline (queued for sync when reconnected)
- **FR89:** The system shows sync status when reconnecting ("Syncing 3 changes...")
- **FR90:** The system resolves conflicts when multiple users edit the same content offline

#### FR91-FR96: Notification System Details
- **FR91:** Users receive email notifications for trip invitations
- **FR92:** Users receive in-app notifications for vote creation and results
- **FR93:** Users receive vote reminders before voting deadlines
- **FR94:** Users can view notification history
- **FR95:** Users can mark notifications as read or unread
- **FR96:** Users can configure notification batching (real-time vs. daily digest)

#### FR97-FR100: Data Import/Export
- **FR97:** Users can import trips from CSV files
- **FR98:** Users can export trip itinerary to iCal format for calendar integration
- **FR99:** Users can export trip itinerary to PDF for printing or sharing
- **FR100:** Users can import activities from Google Sheets

#### FR101-FR105: Activity Location & Map Integration
- **FR101:** Trip members can add activity location via map pin drop
- **FR102:** Trip members can search for activity locations using Google Places autocomplete
- **FR103:** Trip members can view all activities on an interactive map
- **FR104:** The system displays route planning between activities on the map
- **FR105:** The system clusters activity markers when zoomed out on the map

#### FR106-FR109: Voting System Details
- **FR106:** Vote creators can set voting deadlines for votes
- **FR107:** Trip members receive reminders for upcoming vote deadlines
- **FR108:** Trip members can edit their vote before final submission deadline
- **FR109:** The system handles tie-breaking with transparent rules displayed to users

#### FR110-FR112: Expense Receipt Management
- **FR110:** Trip members can upload receipt photos to expenses
- **FR111:** Trip members can view receipt photos in expense details
- **FR112:** The system stores receipt photos in Supabase Storage with secure access

#### FR113-FR116: Progressive Web App (PWA)
- **FR113:** Users can install the app to their device home screen (Add to Home Screen)
- **FR114:** The app functions offline with Service Worker caching for core features
- **FR115:** Users can receive push notifications (web push) for important updates
- **FR116:** The app displays a splash screen on launch from home screen

#### FR117-FR120: Blind Budgeting Privacy & Onboarding (CRITICAL)
- **FR117:** The system enforces minimum 3 travelers have set budgets before showing collective possibilities
- **FR118:** The system displays privacy warning for trips with fewer than 4 travelers explaining inference risks
- **FR119:** New users complete interactive blind budgeting tutorial on first trip creation
- **FR120:** Tutorial shows live demo with fake users demonstrating privacy mechanics and collective possibilities

#### FR121-FR123: In-App Communication (CRITICAL)
- **FR121:** Trip members can add threaded comments to specific activities
- **FR122:** Trip members can @mention other members in comments to notify them
- **FR123:** Comments show real-time updates with in-app notifications

#### FR124-FR126: Granular Roles & Permissions (CRITICAL)
- **FR124:** Trip creators can assign roles (Owner, Editor, Viewer) to members
- **FR125:** Viewers can view itinerary but cannot edit activities or create votes
- **FR126:** Editors can edit activities but cannot remove members or transfer ownership

#### FR127-FR129: Edit History & Audit Trail (CRITICAL)
- **FR127:** The system maintains complete audit log of all itinerary changes with timestamps
- **FR128:** Trip members can undo any change made in last 24 hours
- **FR129:** Audit log shows who made what change and when with user attribution

#### FR130-FR132: Public Sharing (HIGH PRIORITY)
- **FR130:** Trip creators can generate read-only public share links for non-members
- **FR131:** Public links can have optional password protection and expiry dates
- **FR132:** Public links show itinerary but hide individual budgets and vote details

#### FR133-FR135: Timezone Intelligence (HIGH PRIORITY)
- **FR133:** Activities store timezone information with local time
- **FR134:** The system displays activity times in user's device timezone
- **FR135:** The system detects and warns about DST transitions during trip dates

#### FR136-FR138: Conflict Detection & Resolution (HIGH PRIORITY)
- **FR136:** The system detects when two users edit the same activity simultaneously
- **FR137:** The system shows conflict resolution UI with "Keep Mine" or "Keep Theirs" options
- **FR138:** The system prevents activity deletion while vote is active (soft delete only)

#### FR139-FR141: Calendar Sync (HIGH PRIORITY)
- **FR139:** Users can sync trip activities to Google Calendar automatically
- **FR140:** Users can sync trip activities to Apple Calendar automatically
- **FR141:** Calendar sync is bidirectional (changes in calendar update TripFlow and vice versa)

#### FR142-FR144: Payment Integration (HIGH PRIORITY)
- **FR142:** The system generates payment links for expense settlements (Stripe, PayPal, Venmo)
- **FR143:** Users can settle expenses via integrated payment providers
- **FR144:** Settlement status updates automatically when payment is confirmed

#### FR145-FR147: Post-Trip Closure (HIGH PRIORITY)
- **FR145:** Trip creators can mark trip as complete
- **FR146:** System generates post-trip summary (budget vs actual, photos, highlights, voting results)
- **FR147:** System prompts users to create next trip or clone completed trip for reuse

#### FR148-FR150: Trip Templates & Cloning (HIGH PRIORITY)
- **FR148:** Users can clone any past trip to create new trip with same structure
- **FR149:** Cloned trips preserve activities, categories, and settings but reset votes and expenses
- **FR150:** Users can save trip as reusable template for community sharing

#### FR151-FR153: Receipt OCR & Booking Capture (HIGH PRIORITY)
- **FR151:** Users can scan receipt photos with device camera
- **FR152:** System extracts amount, date, and merchant from receipt via OCR
- **FR153:** Extracted data auto-populates expense form for user confirmation and editing

#### FR154-FR156: Vote Deadlines & Reminders (HIGH PRIORITY)
- **FR154:** Vote creators can set deadline for vote submission
- **FR155:** System sends reminders 24 hours before vote deadline to members who haven't voted
- **FR156:** Votes automatically close at deadline and reveal results to all members

#### FR157-FR159: Privacy Dashboard & Audit (HIGH PRIORITY)
- **FR157:** Users can view privacy dashboard showing exactly what each member can see
- **FR158:** Privacy dashboard includes audit log of all budget-related queries and access
- **FR159:** System displays privacy indicators (teal lock icons) on all sensitive data fields

### Non-Functional Requirements

#### Performance Requirements
- **NFR1:** All user actions must complete in < 500ms
- **NFR2:** Real-time sync latency: Itinerary updates propagate to all group members within 500ms
- **NFR3:** Database queries execute in < 100ms for typical operations (fetch itinerary, load user data)
- **NFR4:** Blind budgeting aggregation Edge Function completes in < 200ms
- **NFR5:** Initial page load (SSR) < 2s on 3G connection
- **NFR6:** Client-side navigation < 300ms (SPA transitions)
- **NFR7:** Time to Interactive (TTI) < 3s on 3G connection
- **NFR8:** Largest Contentful Paint (LCP) < 2.5s (goal: < 1.5s)
- **NFR9:** First Input Delay (FID) < 100ms (goal: < 50ms)
- **NFR10:** Cumulative Layout Shift (CLS) < 0.1 (goal: < 0.05)

#### Security & Privacy Requirements
- **NFR11:** Individual budget values NEVER appear in client-side JavaScript bundles
- **NFR12:** Individual budget values NEVER appear in API responses (REST or Realtime)
- **NFR13:** Individual budget values NEVER appear in browser DevTools Network tab
- **NFR14:** Individual budget values NEVER appear in client-side state (React Query cache, Zustand store)
- **NFR15:** Individual budget values NEVER appear in logs (Vercel logs, Supabase logs)
- **NFR16:** Blind budgeting aggregation executed exclusively via server-side Edge Functions with Row-Level Security (RLS)
- **NFR17:** All data encrypted at rest (Supabase default: AES-256)
- **NFR18:** All data encrypted in transit (HTTPS/TLS)
- **NFR19:** Sensitive budget fields encrypted at database level (additional layer beyond at-rest encryption)
- **NFR20:** Session management uses secure cookies with no exposed tokens
- **NFR21:** Password requirements: Minimum 8 characters
- **NFR22:** All user input sanitized to prevent XSS attacks
- **NFR23:** SQL injection prevented via parameterized queries
- **NFR24:** API endpoints rate-limited (100 requests/minute per user) to prevent abuse

#### Reliability Requirements
- **NFR25:** Zero data loss on trip plans, budgets, and votes (100% data integrity)
- **NFR26:** Offline-first sync: Concurrent edits resolve without data loss when users reconnect
- **NFR27:** RLS enforcement: Users cannot access trips they're not members of (100% data isolation)

#### Scalability Requirements
- **NFR28:** Support 10-person groups with real-time collaboration without lag
- **NFR29:** Handle 1,000+ active trips simultaneously without performance degradation
- **NFR30:** Supabase PostgreSQL scales to support growing user base with consistent query performance

#### Accessibility Requirements (WCAG 2.1 AA)
- **NFR31:** WCAG 2.1 Level AA compliance minimum
- **NFR32:** All interactive elements accessible via keyboard (Tab, Enter, Escape, Arrow keys)
- **NFR33:** Focus indicators visible on all focusable elements
- **NFR34:** Tab order logical (follows visual hierarchy, skips hidden elements)
- **NFR35:** ARIA labels on all interactive elements without visible text
- **NFR36:** ARIA live regions for real-time updates
- **NFR37:** Semantic HTML (nav, main, aside, article, section, footer)
- **NFR38:** Headings hierarchy (one H1 per page, logical H2-H6 structure)
- **NFR39:** Form labels on all inputs (visible labels, placeholder text does not replace labels)
- **NFR40:** Error messages announced to screen readers (ARIA alerts)
- **NFR41:** Text contrast: 4.5:1 minimum for normal text, 3:1 for large text (18px+)
- **NFR42:** UI component contrast: 3:1 minimum for borders, icons, focus indicators
- **NFR43:** Color alone does not convey meaning
- **NFR44:** All images have alt text (or empty alt for decorative images)
- **NFR45:** Icon buttons have ARIA labels
- **NFR46:** Text resizable to 200% without loss of functionality

#### Browser Support & Compatibility
- **NFR47:** Chrome: Last 2 versions (primary development target)
- **NFR48:** Firefox: Last 2 versions (full feature parity)
- **NFR49:** Safari: Last 2 versions (iOS Safari critical for mobile)
- **NFR50:** Edge: Last 2 versions (Chromium-based only)
- **NFR51:** Chrome Android: Last 2 versions (mobile-first testing required)
- **NFR52:** Safari iOS: Last 2 versions (touch interactions must work flawlessly)
- **NFR53:** Internet Explorer 11: NOT supported
- **NFR54:** Core functionality works without JavaScript (progressive enhancement)
- **NFR55:** Real-time features degrade gracefully if WebSocket connection fails

#### Responsive Design Requirements
- **NFR56:** Mobile-first design approach
- **NFR57:** Breakpoints: Mobile (0-640px), Tablet (641px-1024px), Desktop (1025px+)
- **NFR58:** Minimum touch target size: 44x44px (48px preferred)
- **NFR59:** No horizontal scrolling at any breakpoint
- **NFR60:** Base font size 16px (prevents iOS zoom on input focus)

#### GDPR Compliance
- **NFR61:** Users can delete accounts and all associated data (right to deletion)
- **NFR62:** Users can export data as JSON (data portability)
- **NFR63:** Clear privacy policy explaining data collection and usage
- **NFR64:** Cookie consent banner for EU users

### Additional Requirements

#### Technology Stack (Architecture-Mandated)
- **Valibot** validation library (replace Zod 4.3.6 due to Turbopack runtime error "int is not defined")
- **Google Maps JavaScript API** with `@vis.gl/react-google-maps` for map provider (NOT MapLibre)
- **Next.js 16.1.6** with App Router and Turbopack bundler
- **React 19.2.3** (use `isPending` instead of `isLoading`)
- **Supabase**: PostgreSQL 17 + Auth + RLS + Realtime + Edge Functions
- **React Query v5.90.21** for server state (no `useEffect` for data fetching)
- **Zustand** for UI state management (feature-based stores)
- **React Hook Form 7.71.2** with Valibot resolver
- **Tailwind CSS v4** with design tokens via CSS custom properties
- **shadcn/ui** component library (composable, accessible)
- **Photo Libraries**: `react-photo-album`, `yet-another-react-lightbox`, `embla-carousel-react`, `blurhash`
- **Testing**: Playwright (E2E), Vitest (unit), Percy (visual regression)
- **Icons**: Lucide React ONLY (no Material Icons, Heroicons, Font Awesome)

#### Database Architecture
- **15-18 tables total** in Supabase PostgreSQL database
- **Core Trip Management**: `trips`, `trip_members`, `trip_invites`
- **Itinerary & Activities**: `destinations`, `days`, `activities`, `transport`
- **Budgeting**: `budget_settings`, `expenses`, `expense_settlements`
- **Voting**: `votes`, `vote_options`, `vote_ballots` (5 vote types: yes_no, single_choice, ranked_choice, approval, veto)
- **Real-Time Collaboration**: `presence`, `activity_comments`
- **Photos Cache** (future phase): `photo_cache`, `photo_cache_variants`
- **Currency Support**: 4 currencies (USD, EUR, CNY, JPY) stored as DECIMAL(10,2) except JPY (INTEGER)
- **Exchange Rates**: Cached in `exchange_rates` table with daily updates via Frankfurter API
- **RLS Pattern**: FK-based policies via `trip_members` table for multi-tenant isolation
- **Naming Convention**: snake_case for ALL database identifiers

#### Blind Budget Encryption (Critical)
- **pgcrypto Extension**: PostgreSQL pgcrypto for AES encryption
- **Storage**: Encrypted budgets in `trip_members.budget_encrypted` column
- **Edge Function**: `calculate-group-budget` (Deno runtime) aggregates decrypted budgets server-side
- **Client Exposure**: ONLY aggregate values (`group_limit_usd/eur/cny/jpy`), NEVER individual budgets
- **Encryption Key**: Environment variable `BUDGET_ENCRYPTION_KEY` (generate with `openssl rand -base64 32`)

#### API & Communication Patterns
- **Server Actions**: Internal mutations (Next.js 16 App Router) with Valibot validation
  - `createActivityAction(data)`, `updateBlindBudgetAction(tripId, encryptedBudget)`, `submitVoteAction(voteId, ballot)`
- **API Routes** (`app/api/`): External integrations ONLY (webhooks, future mobile API)
- **Realtime Channels**: One channel per trip (`trip:${tripId}`) for activities, expenses, votes, presence
- **Error Handling**: `ActionResult<T>` discriminated union (return expected errors, throw unexpected)

#### State Management Boundaries
- **React Query**: Server state (trips, activities, expenses, votes) with 5min stale time
- **Zustand**: UI state ONLY (selections, filters, modals, sidebar)
  - Feature stores: `itineraryStore`, `budgetStore`, `votingStore`, `uiStore`
  - Pattern: Multiple stores for independent concerns (NOT single global store)
- **Clear Separation**: No `useState` for server data (anti-pattern)

#### UX Patterns (From Design Specification)
- **Blind Budgeting UI**:
  - Teal semantic color (HSL: `162 72% 37%`) for ALL privacy features
  - Lock icon + "Private" badge for privacy indicators
  - Collective possibilities view (e.g., "4 people can afford €150/night hotels")
  - NO individual budget values ever shown in UI

- **Voting Interfaces**:
  - Purple semantic color (HSL: `262 83% 58%`) for ALL voting features
  - Anonymous voting until all members submit
  - Vote types: yes/no, single choice, ranked choice (drag-drop), approval, veto
  - Quorum indicator: Progress bar with fraction ("5 of 8 voted")

- **Real-Time Indicators**:
  - Green dot for online presence
  - Typing indicators: "Sarah is editing activity..."
  - Recent activity: "Updated 2 minutes ago by Alex"
  - Live updates within 500ms

- **Itinerary Timeline**:
  - Day-by-day vertical timeline with left-border connector line
  - Activity cards: Time (left) + Details (right)
  - Drag handle with 6-dot icon
  - City-colored left borders

#### Design System (From Style Guide)
- **Color Tokens** (CSS custom properties in HSL):
  - Primary: `--primary: 224 76% 48%` (Indigo Blue)
  - Privacy: `--privacy: 162 72% 37%` (Teal - blind budgeting ONLY)
  - Vote: `--vote: 262 83% 58%` (Purple - voting ONLY)
  - Semantic: `--success`, `--warning`, `--destructive`, `--info`

- **Typography**:
  - Font stack: Inter (sans-serif), JetBrains Mono (monospace)
  - Type scale: Display (36px), H1 (30px), H2 (24px), H3 (20px), Body (16px), Small (14px), Caption (12px)
  - Minimum: 16px body text for mobile

- **Spacing Scale** (4px base unit):
  - Cards: `p-4` (compact) or `p-6` (standard)
  - Between cards: `gap-4`

- **Border Radius**: `rounded-lg` (8px default), `rounded-xl` (12px large), `rounded-full` (avatars)

- **Shadows**: `shadow-sm` (cards at rest), `shadow-md` (hover), `shadow-lg` (modals)

#### Component Standards
- **Mandatory Checklist** for all new components:
  - [ ] TypeScript with strict types
  - [ ] shadcn/ui composable pattern
  - [ ] Design tokens from `globals.css` (no hardcoded colors)
  - [ ] Responsive (mobile-first)
  - [ ] Dark mode support
  - [ ] Accessible (keyboard nav, ARIA, screen reader tested)
  - [ ] Tested (unit + E2E for critical flows)
  - [ ] Documented with usage examples

#### Testing & CI/CD
- **E2E Tests** (Playwright): One spec per FR category
- **Unit Tests** (Vitest): Co-located with components
- **Visual Regression** (Percy): Screenshot comparison
- **CI/CD**: TypeScript/ESLint/unit tests BLOCKING, E2E tests NON-BLOCKING
- **Deployment**: Vercel + Supabase Cloud (production), Supabase Branching (preview)

#### Photo System
- **Tier 1**: Activities with `place_id` → Google Places Photos API
- **Tier 2**: Custom activities → Free providers (Unsplash → Pexels → Google Places → Fallback)
- **Component**: `PlacePhoto` with size variants (thumb, card, hero, carousel)
- **Caching**: React Query with varying stale times (5min → 60min → 24hr)

#### Accessibility Standards (WCAG 2.1 AA)
- **Images**: Use `alt` attribute (NOT `data-alt` or `title`)
- **Icons**: Icon-only buttons MUST have `aria-label`, decorative icons MUST have `aria-hidden="true"`
- **Links**: Purpose clear from link text alone
- **Forms**: MUST have associated labels (placeholder is NOT a label)

#### Performance Optimization
- **Code Splitting**: Route-based + lazy load heavy components
- **Image Optimization**: Next.js Image, WebP with JPEG fallback
- **API Optimization**: React Query caching, prefetch on hover, debounce input
- **Bundle Size**: Main < 200KB gzipped, total JS < 500KB, CSS < 50KB

#### Validation & Forms
- **Valibot Schemas**: Shared client/server
- **React Hook Form**: Valibot resolver for type-safe validation
- **Database Constraints**: Enforce at PostgreSQL level
- **Error Messages**: Specific and actionable

#### Naming Conventions
- **Database**: snake_case (tables, columns, indexes, policies)
- **TypeScript**: camelCase (variables/functions), PascalCase (components/types)
- **Files**: PascalCase (components), camelCase (utilities), kebab-case (CSS)
- **Server Actions**: camelCase with "Action" suffix (`createActivityAction`)
- **React Query Keys**: Hierarchical factory pattern

### FR Coverage Map

#### Story 0: Project Foundation & Setup (Prerequisite)
FR73, FR74, FR75, FR76, FR77

#### Epic 1: User Authentication & Access Control
FR64, FR65, FR66, FR67, FR68, FR69, FR70, FR71, FR72

#### Epic 2: Trip Creation & Member Management
FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR9, FR10

#### Epic 3: Blind Budgeting - Core Differentiator
FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR20, FR117, FR118, FR119, FR120, FR157, FR158, FR159

#### Epic 4: Collaborative Itinerary Planning
FR21, FR22, FR23, FR24, FR25, FR26, FR27, FR28, FR29, FR30, FR57, FR58, FR59, FR60, FR61, FR62, FR63, FR121, FR122, FR123, FR127, FR128, FR129

#### Epic 5: Democratic Decision-Making
FR31, FR32, FR33, FR34, FR35, FR36, FR37, FR38, FR39, FR40, FR106, FR107, FR108, FR109, FR154, FR155, FR156

#### Epic 6: Interactive Maps & Location Services
FR101, FR102, FR103, FR104, FR105, FR133, FR134, FR135

#### Epic 7: Photo Management & Visual Content
FR82, FR83, FR84, FR85, FR151, FR152, FR153

#### Epic 8: Expense Tracking & Splitting
FR41, FR42, FR43, FR44, FR45, FR46, FR47, FR48, FR49, FR50, FR51, FR52, FR53, FR54, FR55, FR56, FR110, FR111, FR112

#### Epic 9: Payment Integration & Settlement
FR142, FR143, FR144

#### Epic 10: Search, Filter & Discovery
FR78, FR79, FR80, FR81

#### Epic 11: Offline Functionality & Sync
FR86, FR87, FR88, FR89, FR90, FR113, FR114, FR115, FR116, FR136, FR137, FR138

#### Epic 12: Advanced Collaboration & Permissions
FR124, FR125, FR126, FR130, FR131, FR132

#### Epic 13: Calendar Integration & Export
FR97, FR98, FR99, FR100, FR139, FR140, FR141

#### Epic 14: Notifications & Engagement
FR91, FR92, FR93, FR94, FR95, FR96

#### Epic 15: Post-Trip Closure & Retention
FR145, FR146, FR147, FR148, FR149, FR150

## Epic List

### Epic 1: Project Foundation & Authentication
Enable developers and users to set up infrastructure, authenticate securely, and configure the application environment.

**User Outcome:** Developers can deploy TripFlow with all integrations (Google Maps, photo APIs, Supabase). Users can create accounts, log in securely, manage their profiles, and control privacy settings.

**FRs covered:** FR64, FR65, FR66, FR67, FR68, FR69, FR70, FR71, FR72, FR73, FR74, FR75, FR76, FR77

---

### Epic 2: Trip Creation & Member Management
Enable users to create trips, invite collaborators, and manage trip membership throughout the trip lifecycle.

**User Outcome:** Users can create trips with destinations and dates, invite travelers via email, manage the trip roster (add/remove members), and transfer ownership.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR9, FR10

---

### Epic 3: Blind Budgeting - Core Differentiator
Enable travelers to set private budgets and view collective possibilities without revealing individual budget amounts, ensuring privacy-first financial planning.

**User Outcome:** Travelers set private budgets in their preferred currency. The system aggregates budgets to show collective possibilities (e.g., "4 people can afford €150/night hotels") while keeping individual budgets completely private. New users learn the privacy mechanics through an interactive tutorial.

**FRs covered:** FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR20, FR117, FR118, FR119, FR120, FR157, FR158, FR159

---

### Epic 4: Collaborative Itinerary Planning
Enable trip members to collaboratively build, edit, and organize their trip itinerary with real-time updates and complete edit history.

**User Outcome:** Trip members add, edit, delete, and reorder activities across trip days. Changes sync in real-time (500ms). Members see who's editing, view change history, undo recent changes, add threaded comments, and @mention collaborators.

**FRs covered:** FR21, FR22, FR23, FR24, FR25, FR26, FR27, FR28, FR29, FR30, FR57, FR58, FR59, FR60, FR61, FR62, FR63, FR121, FR122, FR123, FR127, FR128, FR129

---

### Epic 5: Democratic Decision-Making
Enable trip members to create votes, cast ballots anonymously, and make group decisions with transparent results and deadline management.

**User Outcome:** Trip members create votes for activities/accommodations with 5 vote types (yes/no, rating, ranking, time selection, budget allocation). Votes remain anonymous until all members vote or deadline passes. Reminders sent before deadlines. Results reveal winning options with tie-breaking rules.

**FRs covered:** FR31, FR32, FR33, FR34, FR35, FR36, FR37, FR38, FR39, FR40, FR106, FR107, FR108, FR109, FR154, FR155, FR156

---

### Epic 6: Interactive Maps & Location Services
Enable trip members to visualize activities on interactive maps, search for locations, plan routes, and manage timezone intelligence.

**User Outcome:** Trip members add activity locations via map pin drop or Google Places autocomplete. All activities display on an interactive map with route planning, marker clustering, and timezone intelligence (DST warnings, local time conversions).

**FRs covered:** FR101, FR102, FR103, FR104, FR105, FR133, FR134, FR135

---

### Epic 7: Photo Management & Visual Content
Enable trip members to upload, manage, and view photos for activities, with receipt scanning and OCR for expense capture.

**User Outcome:** Trip members upload photos to activities with automatic compression and CDN delivery. Users scan receipt photos with device camera, and the system extracts amount, date, and merchant via OCR to auto-populate expense forms.

**FRs covered:** FR82, FR83, FR84, FR85, FR151, FR152, FR153

---

### Epic 8: Expense Tracking & Splitting
Enable trip members to log expenses, split costs fairly, manage multi-currency conversions, and track who owes whom with receipt management.

**User Outcome:** Trip members log expenses with payer, category, and split options (equal, custom, percentage). The system calculates settlements automatically, converts to user's preferred currency, displays expense analytics, and allows receipt photo uploads.

**FRs covered:** FR41, FR42, FR43, FR44, FR45, FR46, FR47, FR48, FR49, FR50, FR51, FR52, FR53, FR54, FR55, FR56, FR110, FR111, FR112

---

### Epic 9: Payment Integration & Settlement
Enable users to settle expenses via integrated payment providers with automatic status tracking.

**User Outcome:** Users generate payment links for settlements (Stripe, PayPal, Venmo), settle expenses via integrated providers, and see settlement status update automatically when payment is confirmed.

**FRs covered:** FR142, FR143, FR144

---

### Epic 10: Search, Filter & Discovery
Enable users to quickly find trips, activities, and expenses using search and filtering capabilities.

**User Outcome:** Users search trips by destination/date, search activities by name/location/type, filter itinerary by day/cost/category, and filter expenses by category/traveler.

**FRs covered:** FR78, FR79, FR80, FR81

---

### Epic 11: Offline Functionality & Sync
Enable users to view and edit trip data while offline with automatic sync, conflict resolution, and PWA installation.

**User Outcome:** Users view cached itinerary and budget offline, add/edit activities offline (queued for sync), see sync status when reconnecting, resolve conflicts, install app to home screen, receive push notifications, and benefit from Service Worker caching.

**FRs covered:** FR86, FR87, FR88, FR89, FR90, FR113, FR114, FR115, FR116, FR136, FR137, FR138

---

### Epic 12: Advanced Collaboration & Permissions
Enable trip creators to assign roles, manage permissions, and generate public share links with privacy controls.

**User Outcome:** Trip creators assign roles (Owner, Editor, Viewer) to members. Viewers can view but not edit. Editors can edit but not remove members. Public share links created with optional password protection and expiry dates (hide budgets/votes).

**FRs covered:** FR124, FR125, FR126, FR130, FR131, FR132

---

### Epic 13: Calendar Integration & Export
Enable users to import/export trip data in multiple formats and sync with external calendars bidirectionally.

**User Outcome:** Users import trips from CSV/Google Sheets, export itinerary to iCal/PDF, and sync trip activities to Google Calendar or Apple Calendar bidirectionally (changes update both ways).

**FRs covered:** FR97, FR98, FR99, FR100, FR139, FR140, FR141

---

### Epic 14: Notifications & Engagement
Enable users to receive timely notifications for trip events with customizable preferences and notification history.

**User Outcome:** Users receive email notifications for invitations, in-app notifications for votes/results, vote reminders before deadlines, view notification history, mark as read/unread, and configure batching (real-time vs daily digest).

**FRs covered:** FR91, FR92, FR93, FR94, FR95, FR96

---

### Epic 15: Post-Trip Closure & Retention
Enable trip creators to mark trips complete, generate post-trip summaries, and clone trips for future use with template sharing.

**User Outcome:** Trip creators mark trips complete, view post-trip summary (budget vs actual, photos, highlights, voting results), clone past trips with same structure, save trips as reusable templates for community sharing.

**FRs covered:** FR145, FR146, FR147, FR148, FR149, FR150

---

## Story 0: Project Foundation & Setup (One-Time Prerequisite)

**IMPORTANT:** This is a one-time developer setup story that must be completed before any Epic 1 user stories can be implemented. It consolidates all infrastructure and development environment configuration into a single prerequisite task.

As a **developer**,
I want **to set up the complete development infrastructure and integrate all external services**,
So that **I can begin implementing user-facing features with a fully configured environment**.

**Acceptance Criteria:**

**Development Environment Setup (from Story 1.1)**

**Given** I have cloned the TripFlow repository
**When** I run the setup script or follow the installation guide
**Then** all dependencies are installed (Node.js 20+, pnpm, Git)
**And** I can run `pnpm install` successfully without errors
**And** I can run `pnpm dev` and access the app at localhost:3000
**And** Turbopack bundler compiles without "int is not defined" error
**And** README.md includes clear setup instructions with system requirements

**Environment Variables Configuration (from Story 1.2)**

**Given** I have access to the required API keys and credentials
**When** I create a `.env.local` file from the `.env.example` template
**Then** the file includes variables for:
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`
- `NEXT_PUBLIC_PEXELS_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BUDGET_ENCRYPTION_KEY` (generate with `openssl rand -base64 32`)
**And** `.env.example` file documents all required variables with descriptions
**And** `.env.local` is in `.gitignore` to prevent credential leakage
**And** the app fails gracefully with clear error messages if required variables are missing

**Supabase Database Initialization (from Story 1.3 - USERS TABLE REMOVED)**

**Given** I have Supabase CLI installed and configured
**When** I run `supabase db reset` or the initialization command
**Then** PostgreSQL 17 database is created locally
**And** pgcrypto extension is enabled for budget encryption
**And** Supabase Auth is configured with email/password provider enabled
**And** Migration files are versioned and tracked in `supabase/migrations/`

**Google Maps API Integration (from Story 1.4)**

**Given** I have a valid Google Maps API key with Places API enabled
**When** I add the `@vis.gl/react-google-maps` library to the project
**Then** the library is installed and configured correctly
**And** a basic map component renders on a test page
**And** the Google Maps script loads asynchronously without blocking page load
**And** API key is stored in `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` environment variable
**And** Console shows no CORS, API key, or loading errors
**And** Documentation includes instructions for obtaining and configuring the API key

**Photo APIs Integration with Fallback Chain (from Story 1.5)**

**Given** I have valid API keys for Unsplash and Pexels
**When** I configure the photo service with the fallback chain
**Then** the service attempts photo sources in order: Unsplash → Pexels → Google Places → Fallback
**And** if Unsplash fails (rate limit/network error), the service automatically tries Pexels
**And** if all APIs fail, a generic placeholder image is displayed
**And** API keys are stored in environment variables securely
**And** React Query caches photo URLs to minimize API calls
**And** a `PlacePhoto` component accepts size variants (thumb, card, hero, carousel)
**And** unit tests verify the fallback chain behavior

---

## Epic 1: User Authentication & Access Control

Enable users to register, authenticate securely, manage their profiles, and access trips with proper authorization.

### Story 1.1: User Registration with Email and Password

As a **new user**,
I want **to register for a TripFlow account using my email and password**,
So that **I can create and manage trips**.

**Acceptance Criteria:**

**Database Setup (moved from Story 0 - Story 1.3)**

**Given** Supabase database is initialized
**When** I create the first user migration
**Then** the migration creates the `users` table with columns:
- `id` (UUID, primary key)
- `email` (TEXT, unique, not null)
- `password_hash` (TEXT, not null for email auth)
- `name` (TEXT)
- `avatar_url` (TEXT)
- `created_at` (TIMESTAMPTZ, default now())
- `updated_at` (TIMESTAMPTZ, default now())
**And** the table is tracked in `supabase/migrations/`

**User Registration Flow**

**Given** I am on the registration page
**When** I enter a valid email and a password (min 8 characters)
**Then** a new user account is created in Supabase Auth
**And** the `users` table is updated with my user profile
**And** I receive a verification email to confirm my email address
**And** I am redirected to the dashboard after successful registration
**And** if the email is already registered, I see an error: "Email already in use"
**And** if the password is too weak, I see validation errors before submission
**And** form inputs have accessible labels and ARIA attributes (WCAG 2.1 AA)
**And** form works with keyboard navigation only (Tab, Enter)

---

### Story 1.2: User Login with Session Management

As a **registered user**,
I want **to log in to my TripFlow account with email and password**,
So that **I can access my trips and data securely**.

**Acceptance Criteria:**

**Given** I am on the login page
**When** I enter my registered email and correct password
**Then** Supabase Auth validates my credentials and creates a session
**And** session tokens are stored in secure HTTP-only cookies (not localStorage)
**And** I am redirected to the dashboard
**And** my session persists across page refreshes
**And** session expires after 7 days of inactivity
**And** if credentials are incorrect, I see: "Invalid email or password"
**And** login form is accessible with keyboard and screen readers
**And** "Remember me" checkbox extends session to 30 days

---

### Story 1.3: OAuth Login (Google, GitHub, Apple)

As a **user**,
I want **to log in using my Google, GitHub, or Apple account**,
So that **I can access TripFlow without creating a separate password**.

**Acceptance Criteria:**

**Given** I am on the login page
**When** I click "Continue with Google" (or GitHub/Apple)
**Then** I am redirected to the OAuth provider's login page
**And** after successful authentication, I am redirected back to TripFlow
**And** a user account is created in the `users` table if this is my first login
**And** my profile is populated with OAuth data (name, avatar from provider)
**And** subsequent logins recognize me and skip account creation
**And** OAuth buttons have clear labels and accessible ARIA attributes
**And** if OAuth fails (user cancels or provider error), I see a clear error message
**And** OAuth providers are configured in Supabase dashboard

---

### Story 1.4: Password Reset via Email

As a **user who forgot my password**,
I want **to reset my password via email**,
So that **I can regain access to my account**.

**Acceptance Criteria:**

**Given** I am on the "Forgot Password" page
**When** I enter my registered email and click "Send Reset Link"
**Then** Supabase sends a password reset email to my address
**And** the email contains a secure reset link valid for 1 hour
**When** I click the reset link in my email
**Then** I am redirected to a "Set New Password" page
**And** I can enter and confirm a new password (min 8 characters)
**And** my password is updated securely in Supabase Auth
**And** I am redirected to the login page with a success message
**And** the reset link becomes invalid after one use
**And** if the email is not registered, I see: "If this email exists, a reset link has been sent" (security: no user enumeration)

---

### Story 1.5: User Profile Editing

As a **logged-in user**,
I want **to update my profile information (name, avatar, email)**,
So that **my account reflects my current details**.

**Acceptance Criteria:**

**Given** I am logged in and on the profile settings page
**When** I update my name and click "Save Changes"
**Then** the `users.name` field is updated in the database
**And** my new name is reflected immediately across the UI
**When** I upload a new avatar image
**Then** the image is uploaded to Supabase Storage (`avatars/` bucket)
**And** the image is resized to 200x200px automatically
**And** `users.avatar_url` is updated with the CDN URL
**And** my avatar appears throughout the app
**When** I change my email
**Then** Supabase sends a verification email to the new address
**And** my email is updated only after I confirm the new address
**And** all form fields are accessible with keyboard and screen readers
**And** success/error messages are announced to screen readers via ARIA live regions

---

### Story 1.6: Account Deletion and Data Export

As a **logged-in user**,
I want **to delete my account and export my data**,
So that **I can exercise my right to data portability and deletion (GDPR compliance)**.

**Acceptance Criteria:**

**Given** I am logged in and on the account settings page
**When** I click "Export My Data"
**Then** the system generates a JSON file with all my data (trips, budgets, expenses, votes)
**And** the file is downloaded to my device
**And** personal identifiable information is included in the export
**When** I click "Delete My Account"
**Then** I am shown a confirmation dialog: "Are you sure? This action cannot be undone."
**And** I must re-enter my password to confirm deletion
**When** I confirm deletion
**Then** all my data is deleted from the database:
- User profile from `users` table
- All trip memberships
- All budgets, expenses, votes created by me
- All uploaded photos from Supabase Storage
**And** I am logged out and redirected to the homepage
**And** I receive a confirmation email: "Your account has been deleted"
**And** my Supabase Auth account is permanently deleted

---

### Story 1.7: Notification Preferences Management

As a **logged-in user**,
I want **to manage my notification preferences (email, push, in-app)**,
So that **I can control how and when I receive trip updates**.

**Acceptance Criteria:**

**Given** I am logged in and on the notification settings page
**When** I view my notification preferences
**Then** I see toggle switches for:
- Email notifications (trip invites, vote results, expense updates)
- Push notifications (web push for important updates)
- In-app notifications (real-time updates in notification center)
**And** I can toggle each notification type independently
**When** I disable email notifications
**Then** the `users` table is updated with my preferences
**And** I no longer receive email notifications (except critical account security emails)
**And** push/in-app notifications continue to work if enabled
**And** all toggles are keyboard accessible
**And** changes are saved automatically with visual confirmation ("Preferences saved")

---

### Story 1.8: Row-Level Security (RLS) Policies for Trip Access

As a **developer**,
I want **to implement Row-Level Security (RLS) policies on the trips table**,
So that **users can only access trips they are members of**.

**Acceptance Criteria:**

**Given** RLS is enabled on the database
**When** I create the `trips` and `trip_members` tables
**Then** RLS policies are defined:
- Policy 1: `SELECT` - Users can only SELECT trips where they are a member (via `trip_members.user_id`)
- Policy 2: `INSERT` - Authenticated users can INSERT new trips
- Policy 3: `UPDATE` - Users can only UPDATE trips where they are the owner
- Policy 4: `DELETE` - Users can only DELETE trips where they are the owner
**And** the `trip_members` table has RLS policies:
- Users can only view memberships for trips they belong to
**And** foreign key constraints enforce referential integrity
**And** unit tests verify users cannot access trips they are not members of
**And** attempting to bypass RLS via direct SQL queries fails with permission error

---

### Story 1.9: Unauthorized Access Prevention

As a **system**,
I want **to prevent users from accessing trips they are not members of**,
So that **trip data remains private and secure**.

**Acceptance Criteria:**

**Given** I am a logged-in user
**When** I attempt to access a trip URL I am not a member of
**Then** the API returns a 403 Forbidden error
**And** I am redirected to the dashboard with an error message: "You do not have access to this trip"
**And** no trip data is exposed in the API response
**And** the browser console does not log sensitive trip information
**When** I attempt to fetch trip data via API with a forged request
**Then** the Supabase RLS policies block the query
**And** the API returns an empty result set or 403 error
**And** E2E tests verify unauthorized access attempts are blocked
**And** rate limiting prevents brute-force attempts to guess trip IDs (100 requests/minute per user)

---

## Epic 2: Trip Creation & Member Management

Enable users to create trips, invite collaborators, and manage trip membership throughout the trip lifecycle.

### Story 2.1: Create New Trip with Basic Details

As a **logged-in user**,
I want **to create a new trip with destination, dates, and description**,
So that **I can start planning a group trip with collaborators**.

**Acceptance Criteria:**

**Given** I am logged in and on the dashboard
**When** I click "Create New Trip"
**Then** I see a trip creation form with fields:
- Trip name (TEXT, required, max 100 characters)
- Destination (TEXT, required)
- Start date (DATE, required)
- End date (DATE, required, must be after start date)
- Description (TEXT, optional, max 500 characters)
**When** I fill in all required fields and click "Create Trip"
**Then** a new `trips` record is created in the database with:
- `id` (UUID, auto-generated)
- `name`, `destination`, `start_date`, `end_date`, `description`
- `created_by` (my user ID)
- `created_at`, `updated_at` (auto-generated timestamps)
**And** a `trip_members` record is created with my user as the owner (role: 'owner')
**And** I am redirected to the trip itinerary page
**And** validation errors appear if required fields are missing or invalid
**And** form is keyboard accessible with proper focus management

---

### Story 2.2: Upload Trip Cover Photo

As a **trip owner**,
I want **to upload a cover photo for my trip**,
So that **the trip is visually distinctive in the dashboard**.

**Acceptance Criteria:**

**Given** I am on the trip settings page
**When** I click "Upload Cover Photo"
**Then** I can select an image file from my device (JPG, PNG, WebP, max 5MB)
**When** I select a valid image
**Then** the image is uploaded to Supabase Storage (`trip-covers/` bucket)
**And** the image is resized to 1200x630px (16:9 aspect ratio) automatically
**And** a WebP version is generated for optimal performance
**And** the `trips.cover_image_url` field is updated with the CDN URL
**And** the cover photo appears on the trip card and trip header
**When** I upload an invalid file (too large, wrong format)
**Then** I see a clear error message: "File must be JPG, PNG, or WebP under 5MB"
**And** the upload is rejected before processing
**And** drag-and-drop file upload is supported as an alternative to file picker

---

### Story 2.3: View All Trips Dashboard

As a **logged-in user**,
I want **to view all trips I'm a member of in a dashboard**,
So that **I can quickly access any of my trips**.

**Acceptance Criteria:**

**Given** I am logged in and navigate to the dashboard
**When** the page loads
**Then** I see a grid/list of all trips I'm a member of
**And** each trip card displays:
- Trip name
- Destination
- Start date - End date
- Cover photo (or placeholder if none)
- Member count (e.g., "5 travelers")
- My role badge (Owner, Editor, Viewer)
**And** trips are sorted by start date (upcoming trips first)
**When** I click on a trip card
**Then** I am navigated to that trip's itinerary page
**When** I have no trips
**Then** I see an empty state: "No trips yet. Create your first trip!"
**And** a prominent "Create New Trip" button
**And** the dashboard is responsive (grid on desktop, list on mobile)
**And** trip cards have hover states and focus indicators

---

### Story 2.4: Invite Travelers via Email

As a **trip owner or editor**,
I want **to invite travelers to my trip via email**,
So that **collaborators can join and contribute to planning**.

**Acceptance Criteria:**

**Given** I am on the trip members page as owner or editor
**When** I click "Invite Member"
**Then** I see an invitation form with:
- Email address field (required, must be valid email format)
- Role dropdown (Editor, Viewer - Owner cannot be assigned via invite)
- Optional personal message (TEXT, max 200 characters)
**When** I enter a valid email and click "Send Invitation"
**Then** a `trip_invites` record is created with:
- `trip_id`, `email`, `role`, `invited_by` (my user ID), `created_at`
- `token` (secure random token for the invite link)
- `expires_at` (7 days from creation)
**And** an email is sent to the invitee with:
- Trip name and destination
- Inviter's name
- "Accept Invitation" link with the secure token
- Personal message if provided
**And** I see a success message: "Invitation sent to [email]"
**When** the email is already a member
**Then** I see an error: "This user is already a member of this trip"
**And** multiple invitations can be sent simultaneously (batch invite)

---

### Story 2.5: Accept or Decline Trip Invitation

As an **invited user**,
I want **to accept or decline a trip invitation**,
So that **I can join trips I'm interested in and ignore others**.

**Acceptance Criteria:**

**Given** I receive a trip invitation email
**When** I click the "Accept Invitation" link
**Then** I am redirected to TripFlow (login page if not authenticated)
**When** I log in (or I'm already logged in)
**Then** I see an invitation preview page showing:
- Trip name, destination, dates
- Who invited me
- Trip cover photo
- "Accept" and "Decline" buttons
**When** I click "Accept"
**Then** a `trip_members` record is created with my user ID and the invited role
**And** the `trip_invites` record is marked as `accepted_at` (timestamp)
**And** I am redirected to the trip itinerary page
**And** all trip members receive a notification: "[My name] joined the trip"
**When** I click "Decline"
**Then** the `trip_invites` record is marked as `declined_at` (timestamp)
**And** I see a message: "Invitation declined"
**And** the trip owner is notified
**When** the invitation has expired (>7 days)
**Then** I see an error: "This invitation has expired. Request a new one."
**And** the accept/decline actions are disabled

---

### Story 2.6: View Trip Roster and Member Roles

As a **trip member**,
I want **to view the complete trip roster with member roles**,
So that **I know who can edit the itinerary and who is just viewing**.

**Acceptance Criteria:**

**Given** I am a trip member and on the trip members page
**When** the page loads
**Then** I see a list of all trip members with:
- Avatar (or initial placeholder)
- Name
- Email (partially obscured for privacy: j***@example.com)
- Role badge (Owner, Editor, Viewer)
- "Joined [date]" timestamp
**And** the trip owner is displayed first with a crown icon
**And** members are sorted by role (Owner → Editors → Viewers)
**When** I hover over a role badge
**Then** I see a tooltip explaining permissions:
- Owner: "Full control. Can edit, invite, remove members, and delete trip."
- Editor: "Can edit itinerary, add expenses, and create votes."
- Viewer: "Can view itinerary but cannot make changes."
**And** pending invitations are shown separately with "Pending" status
**And** member count is displayed: "5 members, 2 pending invitations"
**And** the roster is accessible with keyboard navigation and screen readers

---

### Story 2.7: Remove Members from Trip (Owner Only)

As a **trip owner**,
I want **to remove members from the trip**,
So that **I can manage the trip roster if someone is no longer participating**.

**Acceptance Criteria:**

**Given** I am the trip owner and on the trip members page
**When** I hover over a member (not myself)
**Then** I see a "Remove" button (trash icon)
**When** I click "Remove"
**Then** I see a confirmation dialog: "Remove [member name] from this trip? They will lose access immediately."
**When** I confirm removal
**Then** the `trip_members` record for that user is deleted
**And** the member is removed from the roster immediately
**And** the removed member sees a notification: "You have been removed from [trip name]"
**And** the removed member can no longer access the trip (RLS enforces this)
**And** all trip members are notified: "[Member name] was removed from the trip"
**When** I attempt to remove myself (the owner)
**Then** the "Remove" button is disabled
**And** I see a tooltip: "Transfer ownership first to leave this trip"
**And** audit log records the removal with timestamp and who performed it

---

### Story 2.8: Leave Trip Voluntarily

As a **trip member (not owner)**,
I want **to leave a trip I no longer want to participate in**,
So that **I can remove myself without needing the owner's action**.

**Acceptance Criteria:**

**Given** I am a trip member (not owner) and on the trip settings page
**When** I click "Leave Trip"
**Then** I see a confirmation dialog: "Are you sure you want to leave this trip? You'll need a new invitation to rejoin."
**When** I confirm
**Then** my `trip_members` record is deleted
**And** I am redirected to the dashboard
**And** the trip no longer appears in my trips list
**And** remaining trip members are notified: "[My name] left the trip"
**When** I am the trip owner
**Then** the "Leave Trip" button is replaced with "Transfer Ownership" prompt
**And** I cannot leave until ownership is transferred
**And** leaving the trip does not delete my past contributions (expenses, votes, comments remain attributed to me)

---

### Story 2.9: Transfer Trip Ownership

As a **trip owner**,
I want **to transfer ownership to another member**,
So that **I can delegate trip management or leave the trip**.

**Acceptance Criteria:**

**Given** I am the trip owner and on the trip members page
**When** I click "Transfer Ownership"
**Then** I see a dialog with a dropdown listing all trip members (excluding myself)
**And** the dialog warns: "The new owner will have full control. You will become an Editor."
**When** I select a member and confirm
**Then** the `trip_members` records are updated:
- New owner: `role` changes to 'owner'
- My role: `role` changes to 'editor'
**And** the `trips.created_by` field is updated to the new owner's ID (optional, for audit)
**And** all trip members are notified: "[New owner name] is now the trip owner"
**And** the new owner receives an email notification with their new permissions
**When** I am the only member of the trip
**Then** transfer is disabled
**And** I see a message: "Add other members before transferring ownership"
**And** ownership transfer is irreversible (only the new owner can transfer back)
**And** audit log records the ownership change with timestamp

---

### Story 2.10: Archive Completed Trips

As a **logged-in user**,
I want **to archive completed trips**,
So that **my dashboard focuses on upcoming trips while preserving access to past trips**.

**Acceptance Criteria:**

**Given** I am a trip member and the trip end date has passed
**When** I view the trip settings page
**Then** I see an "Archive Trip" button
**When** I click "Archive Trip"
**Then** I see a confirmation: "Archive this trip? It will move to your archived trips."
**When** I confirm
**Then** the `trips.archived_at` field is set to the current timestamp
**And** the trip no longer appears in my active trips dashboard
**And** the trip appears in a separate "Archived Trips" section
**When** I view archived trips
**Then** I can still access all trip data (itinerary, expenses, votes, photos)
**And** the trip is marked as read-only (no editing allowed)
**And** I can "Unarchive" the trip to restore it to active trips
**And** archived trips do not count toward any potential trip limits
**And** archiving is reversible (unarchive restores full editing capabilities)

---

## Epic 3: Blind Budgeting - Core Differentiator

Enable travelers to set private budgets and view collective possibilities without revealing individual budget amounts, ensuring privacy-first financial planning.

### Story 3.1: Set Private Budget in Preferred Currency

As a **trip member**,
I want **to set my private budget for the trip in my preferred currency**,
So that **I can plan spending without revealing my budget to others**.

**Acceptance Criteria:**

**Given** I am a trip member and on the budget settings page
**When** I click "Set My Budget"
**Then** I see a budget input form with:
- Currency selector (USD, EUR, CNY, JPY)
- Budget amount input (DECIMAL for USD/EUR/CNY, INTEGER for JPY)
- Optional category breakdown (accommodation, food, activities, transport)
- Teal privacy indicator: "Your budget is private and encrypted"
**When** I enter a budget amount and click "Save Budget"
**Then** the budget is encrypted server-side using pgcrypto before storage
**And** the `trip_members.budget_encrypted` field stores the encrypted value
**And** the `trip_members.budget_currency` field stores my currency preference
**And** my budget is NEVER sent to the client in plaintext
**And** I see a confirmation: "Budget saved securely" with teal lock icon
**And** the form validates positive numbers only
**And** form is keyboard accessible with ARIA labels

---

### Story 3.2: Update Private Budget at Any Time

As a **trip member with an existing budget**,
I want **to update my budget at any time**,
So that **I can adjust my spending limits as plans change**.

**Acceptance Criteria:**

**Given** I have previously set a budget
**When** I navigate to the budget settings page
**Then** I see my current budget amount displayed (decrypted server-side for my eyes only)
**And** a teal lock icon indicates: "Only you can see your budget"
**When** I change the budget amount and click "Update Budget"
**Then** the new budget is re-encrypted with pgcrypto
**And** the `trip_members.budget_encrypted` field is updated
**And** the Edge Function recalculates collective possibilities within 200ms
**And** all trip members see updated collective possibilities (not individual budgets)
**And** I receive confirmation: "Budget updated successfully"
**And** audit log records the update timestamp (not the value)
**And** no budget value appears in browser DevTools, Network tab, or console logs

---

### Story 3.3: View My Own Budget (Encrypted Retrieval)

As a **trip member**,
I want **to view my own budget at any time**,
So that **I can track my spending limits without revealing them to others**.

**Acceptance Criteria:**

**Given** I have set a budget
**When** I navigate to the budget page
**Then** a server action decrypts my budget using the `BUDGET_ENCRYPTION_KEY`
**And** my budget amount is displayed to me (and only me)
**And** the budget value NEVER appears in:
- Client-side JavaScript bundles
- API responses (REST or Realtime)
- Browser DevTools Network tab
- React Query cache
- Zustand store
- Supabase Realtime channels
**And** decryption happens exclusively server-side in Edge Functions
**And** the UI displays a teal lock icon: "Your budget is private"
**And** other trip members cannot see my budget (enforced by RLS)

---

### Story 3.4: Set Category-Specific Budget Limits

As a **trip member**,
I want **to set budget limits by category (accommodation, food, activities, transport)**,
So that **I can allocate my total budget across spending categories**.

**Acceptance Criteria:**

**Given** I am setting or editing my budget
**When** I expand "Category Breakdown" (optional)
**Then** I see input fields for:
- Accommodation budget
- Food budget
- Activities budget
- Transport budget
**And** the sum of categories cannot exceed my total budget
**And** real-time validation shows remaining budget: "€200 remaining"
**When** I save category breakdowns
**Then** each category amount is encrypted separately in `trip_members` table columns:
- `accommodation_budget_encrypted`
- `food_budget_encrypted`
- `activities_budget_encrypted`
- `transport_budget_encrypted`
**And** category budgets NEVER appear in client-side code
**And** validation prevents negative values or category sum > total budget
**And** categories are optional (can set total budget only)

---

### Story 3.5: Server-Side Budget Encryption with pgcrypto

As a **developer**,
I want **to encrypt all budget values server-side using PostgreSQL pgcrypto**,
So that **individual budgets are never exposed to the client or application layer**.

**Acceptance Criteria:**

**Given** pgcrypto extension is enabled in Supabase
**When** a budget is saved via server action
**Then** the budget value is encrypted using `pgp_sym_encrypt()` with `BUDGET_ENCRYPTION_KEY`
**And** encrypted value is stored in `trip_members.budget_encrypted` (BYTEA column)
**And** no plaintext budget value is logged in Supabase logs or Vercel logs
**When** a budget is retrieved for the owner
**Then** decryption happens server-side using `pgp_sym_decrypt()`
**And** decrypted value is returned ONLY to the budget owner via server action
**And** RLS policies prevent other users from accessing encrypted budgets
**And** encryption key is stored in environment variable (NEVER in code)
**And** unit tests verify encryption/decryption round-trip accuracy
**And** migration creates encrypted columns with BYTEA data type

---

### Story 3.6: Edge Function for Collective Possibilities Calculation

As a **developer**,
I want **to create an Edge Function that aggregates encrypted budgets**,
So that **collective possibilities are calculated server-side without exposing individual budgets**.

**Acceptance Criteria:**

**Given** the Edge Function `calculate-group-budget` exists
**When** any trip member's budget changes
**Then** the Edge Function:
1. Fetches all encrypted budgets for the trip (via service role key)
2. Decrypts each budget server-side using pgcrypto
3. Converts all budgets to a common currency (USD) using exchange rates
4. Calculates aggregates:
   - Minimum group budget (lowest individual budget)
   - Maximum group budget (highest individual budget)
   - Average group budget
   - Total collective budget
5. Returns ONLY aggregate values (never individual budgets)
**And** the function completes in < 200ms (NFR4)
**And** the function is called via authenticated server action (not client-side)
**And** aggregate values are stored in `trips` table:
- `group_min_budget_usd`, `group_max_budget_usd`, `group_avg_budget_usd`, `group_total_budget_usd`
**And** individual budget values NEVER appear in Edge Function logs
**And** E2E tests verify aggregation accuracy

---

### Story 3.7: Display Collective Possibilities with Teal Privacy Indicators

As a **trip member**,
I want **to see collective budget possibilities without seeing individual budgets**,
So that **I know what the group can afford together while preserving everyone's privacy**.

**Acceptance Criteria:**

**Given** at least 3 trip members have set budgets
**When** I navigate to the budget page
**Then** I see collective possibilities displayed:
- "Your group can afford up to €150/night for accommodation"
- "Total group budget: €5,000"
- "Average budget per person: €1,250"
**And** ALL collective possibilities are styled with teal color (HSL: 162 72% 37%)
**And** a teal lock icon appears next to each collective value
**And** tooltip explains: "Calculated from group budgets. Individual budgets remain private."
**When** fewer than 3 members have set budgets
**Then** I see: "Waiting for more members to set budgets (3+ required for privacy)"
**And** collective possibilities are hidden until minimum threshold met
**And** no individual budget values are visible anywhere in the UI
**And** UI updates in real-time when budgets change (via Supabase Realtime on `trips` table)

---

### Story 3.8: Real-Time Collective Possibilities Updates

As a **trip member**,
I want **to see collective possibilities update in real-time when anyone changes their budget**,
So that **I always see current group possibilities without page refresh**.

**Acceptance Criteria:**

**Given** I am viewing the budget page
**When** another trip member updates their budget
**Then** the Edge Function recalculates aggregate values within 200ms
**And** the `trips` table updates with new aggregates
**And** Supabase Realtime channel `trip:${tripId}` broadcasts the update
**And** my UI updates automatically with new collective possibilities
**And** no individual budget value is broadcast over Realtime
**And** only aggregate values are transmitted
**And** teal indicators remain throughout the update
**And** loading state shows: "Updating group possibilities..."
**And** updates happen without full page reload

---

### Story 3.9: Budget Setup Status Indicator

As a **trip member**,
I want **to see which members have set budgets vs. not yet set**,
So that **I know when enough members have contributed for accurate collective possibilities**.

**Acceptance Criteria:**

**Given** I am on the budget page
**When** I view the budget setup status
**Then** I see a list of trip members with setup indicators:
- ✅ Name (Budget set) - for members who've set budgets
- ⏳ Name (Not set) - for members who haven't
**And** member names are sorted: "Budget set" members first
**And** individual budget amounts are NEVER shown
**And** progress indicator shows: "5 of 8 members have set budgets"
**When** fewer than 3 members have set budgets
**Then** I see a warning: "Need 3+ budgets to show collective possibilities"
**And** remaining members are encouraged: "Set your budget to unlock group possibilities"
**And** status updates in real-time as members set budgets

---

### Story 3.10: Minimum Group Size Enforcement (3+ Travelers)

As a **system**,
I want **to enforce a minimum of 3 travelers with set budgets before showing collective possibilities**,
So that **individual budgets cannot be inferred in very small groups**.

**Acceptance Criteria:**

**Given** a trip has fewer than 3 members with set budgets
**When** any trip member views the budget page
**Then** collective possibilities are hidden
**And** a message displays: "Collective possibilities appear when 3+ members set budgets"
**And** individual members can still set and view their own budgets
**And** budget setup status shows how many more are needed: "2 more needed"
**When** the 3rd member sets their budget
**Then** the Edge Function calculates collective possibilities
**And** all members immediately see the collective values via Realtime
**And** teal privacy indicators appear
**And** the system prevents displaying collective values if count < 3 (enforced in Edge Function)

---

### Story 3.11: Privacy Warning for Small Groups (<4 Travelers)

As a **trip member in a small group**,
I want **to see a privacy warning if the trip has fewer than 4 travelers**,
So that **I understand the inference risks in small groups**.

**Acceptance Criteria:**

**Given** a trip has 3 members (minimum for collective possibilities)
**When** I view the budget page
**Then** I see a prominent privacy warning banner (teal background):
- Title: "⚠️ Privacy Notice: Small Group"
- Message: "With only 3 members, individual budgets may be partially inferable from collective values. Add more members for stronger privacy."
**And** the warning is dismissible but reappears on page reload
**When** a 4th member joins the trip
**Then** the privacy warning is automatically removed
**And** collective possibilities remain visible
**And** the warning does NOT prevent budget functionality (informational only)
**And** the warning is accessible with ARIA role="alert"
**And** screen readers announce the privacy risk

---

### Story 3.12: Interactive Blind Budgeting Tutorial for New Users

As a **new user creating their first trip**,
I want **to complete an interactive tutorial explaining blind budgeting**,
So that **I understand how privacy is preserved before setting my budget**.

**Acceptance Criteria:**

**Given** I am a new user who has never set a budget
**When** I create my first trip and navigate to the budget page
**Then** an interactive tutorial modal appears with:
- Step 1: "What is Blind Budgeting?" (explanation with teal icons)
- Step 2: "Your Budget Stays Private" (encryption explanation)
- Step 3: "How Collective Possibilities Work" (aggregation demo)
- Step 4: "Live Demo" (fake users showing the concept)
**And** I can navigate between steps with "Next" and "Back" buttons
**And** tutorial is skippable: "Skip Tutorial" button
**When** I complete the tutorial
**Then** a flag is set: `users.completed_budget_tutorial = true`
**And** the tutorial never appears again for this user
**And** I can access the tutorial later via "Help" → "Budget Tutorial"
**And** tutorial is keyboard navigable and screen reader accessible

---

### Story 3.13: Live Demo with Fake Users in Tutorial

As a **new user in the blind budgeting tutorial**,
I want **to see a live demo with fake users**,
So that **I can understand privacy mechanics before setting my real budget**.

**Acceptance Criteria:**

**Given** I am on Step 4 of the budget tutorial ("Live Demo")
**When** the demo loads
**Then** I see a simulated trip with 4 fake users:
- "Alice" (set budget: hidden)
- "Bob" (set budget: hidden)
- "Charlie" (not set yet)
- "Me" (interactive - I can set a fake budget)
**And** I can set a fake budget amount in the demo
**When** I set a budget in the demo
**Then** I see collective possibilities update in real-time
**And** the demo shows: "With 3 budgets set, the group can afford..."
**And** the demo emphasizes: "Notice how you can't see Alice or Bob's budgets!"
**When** I change my fake budget in the demo
**Then** collective values update dynamically
**And** tooltips explain: "This is what you'll see in real trips"
**And** demo data is NOT saved (purely educational)
**And** "Finish Tutorial" button completes the onboarding

---

### Story 3.14: Privacy Dashboard Showing What Each Member Sees

As a **trip member**,
I want **to view a privacy dashboard showing exactly what each member can see**,
So that **I can verify my budget remains private**.

**Acceptance Criteria:**

**Given** I am on the privacy dashboard page
**When** I view the dashboard
**Then** I see a section for each trip member showing their view:
- "What I See": My own budget + collective possibilities
- "What Alice Sees": Collective possibilities only (budget hidden)
- "What Bob Sees": Collective possibilities only (budget hidden)
**And** my own budget is highlighted in teal: "Only visible to you"
**And** other members' sections show: "Individual budgets: Hidden 🔒"
**And** collective values are shown consistently across all views
**When** I toggle "Show Collective Possibilities"
**Then** I can simulate hiding/showing collective values to understand visibility
**And** tooltips explain: "This is exactly what Alice sees when viewing budgets"
**And** the dashboard is read-only (cannot modify budgets here)

---

### Story 3.15: Audit Log for Budget-Related Queries

As a **trip member**,
I want **to view an audit log of all budget-related queries and access**,
So that **I can verify no unauthorized access to budget data has occurred**.

**Acceptance Criteria:**

**Given** I am on the privacy dashboard
**When** I view the "Budget Access Audit Log"
**Then** I see a chronological list of all budget-related events:
- "You viewed your budget" (timestamp)
- "You updated your budget" (timestamp, no value)
- "Collective possibilities calculated" (timestamp, triggered by: member name)
- "Aggregate values broadcast to trip members" (timestamp)
**And** the log shows WHO accessed what and WHEN
**And** the log NEVER shows actual budget values
**And** the log shows Edge Function invocations for collective calculations
**And** I can filter by date range
**And** suspicious activity is flagged (e.g., excessive decryption attempts)
**And** the log is append-only (cannot be modified or deleted)
**And** logs are stored in `budget_access_logs` table with RLS

---

### Story 3.16: Teal Lock Icons on All Sensitive Budget Fields

As a **trip member**,
I want **to see teal lock icons on all budget-related fields**,
So that **I can immediately identify privacy-protected information**.

**Acceptance Criteria:**

**Given** I am viewing any budget-related UI
**When** I see my own budget input field
**Then** a teal lock icon appears next to it
**And** tooltip on hover: "Private - only you can see this"
**When** I see collective possibilities
**Then** each collective value has a teal lock icon
**And** tooltip: "Calculated from encrypted budgets. Individual values remain private."
**And** all teal elements use the exact HSL value: `162 72% 37%`
**And** lock icons use Lucide React `Lock` icon
**And** icons have `aria-label="Privacy protected"`
**And** teal color meets WCAG 2.1 AA contrast ratio (4.5:1) on white background
**And** dark mode uses a lighter teal variant for contrast
**And** icons are visually consistent across all budget pages

---

## Epic 4: Collaborative Itinerary Planning

Enable trip members to collaboratively build, edit, and organize their trip itinerary with real-time updates and complete edit history.

### Story 4.1: Add Activities with Basic Details

As a **trip member**,
I want **to add new activities to any trip day with basic details**,
So that **I can build the trip itinerary collaboratively**.

**Acceptance Criteria:**

**Given** I am a trip member with editor or owner role
**When** I navigate to a specific trip day and click "Add Activity"
**Then** I see an activity creation form with fields:
- Activity name (TEXT, required, max 100 characters)
- Category (SELECT: Accommodation, Food, Activity, Transport, Other)
- Time slot (TIME, optional)
- Estimated duration (INTEGER, minutes)
- Estimated cost (DECIMAL, optional)
- Notes/details (TEXT, optional, max 500 characters)
**When** I fill required fields and click "Create Activity"
**Then** a new `activities` record is created with:
- `id` (UUID, auto-generated)
- `trip_id` (FK to trips)
- `day_number` (INTEGER, which day of the trip)
- `order` (INTEGER, position within the day)
- `name`, `category`, `time_slot`, `duration`, `cost`, `notes`
- `created_by` (my user ID)
- `created_at`, `updated_at` (auto-generated)
**And** the activity appears immediately in the itinerary view
**And** all trip members see the new activity via Realtime sync (500ms)
**And** validation errors appear if required fields are missing
**And** form is keyboard accessible with proper focus management

---

### Story 4.2: Edit and Update Activities

As a **trip member**,
I want **to edit any activity details at any time**,
So that **I can update plans as they evolve**.

**Acceptance Criteria:**

**Given** I am a trip member with editor or owner role
**When** I click on an activity in the itinerary
**Then** I see an activity detail modal with all fields editable
**When** I modify any field (name, time, cost, notes) and click "Save Changes"
**Then** the `activities` record is updated in the database
**And** the `updated_at` timestamp is set to now
**And** all trip members see the updated activity via Realtime sync within 500ms
**And** a change history record is created in `activity_changes` table:
- `activity_id`, `changed_by`, `changed_at`, `field_name`, `old_value`, `new_value`
**When** another member is editing the same activity (presence detected)
**Then** I see a warning: "Alice is also editing this activity"
**And** my changes are queued until they finish or I force save
**And** form validates required fields and data types
**And** changes are debounced (500ms) to avoid excessive API calls

---

### Story 4.3: Delete Activities

As a **trip member**,
I want **to delete activities from the itinerary**,
So that **I can remove canceled or unwanted items**.

**Acceptance Criteria:**

**Given** I am a trip member with editor or owner role
**When** I click the "Delete" button on an activity
**Then** I see a confirmation dialog: "Delete this activity? This action cannot be undone."
**When** I confirm deletion
**Then** the `activities` record is soft-deleted (or hard-deleted based on retention policy)
**And** the activity is removed from the itinerary view immediately
**And** all trip members see the deletion via Realtime sync within 500ms
**And** a deletion record is created in `activity_changes` table for audit trail
**When** I attempt to delete an activity I didn't create
**Then** deletion is allowed (editors can delete any activity)
**And** the creator is notified: "[My name] deleted your activity: [Activity name]"
**When** the activity has associated expenses
**Then** I see a warning: "This activity has 3 expenses. Delete anyway?"
**And** expenses remain but the `activity_id` FK is set to NULL (orphaned)

---

### Story 4.4: Reorder Activities via Drag-and-Drop

As a **trip member**,
I want **to reorder activities within a day using drag-and-drop**,
So that **I can organize the itinerary chronologically or by preference**.

**Acceptance Criteria:**

**Given** I am viewing the itinerary for a specific day
**When** I drag an activity card and drop it at a new position
**Then** the activity's `order` field is updated to reflect the new position
**And** other activities in the day are reordered automatically (order increments)
**And** the new order is persisted to the database immediately
**And** all trip members see the reordered activities via Realtime sync within 500ms
**And** drag-and-drop works on desktop with mouse and on mobile with touch
**When** I drop an activity at an invalid position (outside the day container)
**Then** the drag operation is canceled and the activity returns to its original position
**And** a toast notification appears: "Invalid drop position"
**And** drag handles are keyboard accessible (arrow keys to reorder)
**And** screen readers announce: "Activity moved from position 3 to position 1"

---

### Story 4.5: Move Activities Between Days

As a **trip member**,
I want **to move activities from one day to another**,
So that **I can reorganize the itinerary across multiple days**.

**Acceptance Criteria:**

**Given** I am viewing the multi-day itinerary
**When** I drag an activity from Day 2 and drop it into Day 3
**Then** the activity's `day_number` field is updated from 2 to 3
**And** the activity's `order` is set to the last position in Day 3
**And** Day 2 activities are reordered to fill the gap
**And** the change is persisted immediately
**And** all trip members see the move via Realtime sync within 500ms
**When** I use the "Move to..." dropdown on an activity
**Then** I can select any trip day from the list
**And** the activity is moved to the end of the selected day
**And** keyboard navigation allows moving activities without drag-and-drop
**And** undo action is available for 10 seconds: "Moved to Day 3. Undo?"

---

### Story 4.6: Real-Time Activity Sync (500ms)

As a **trip member**,
I want **to see itinerary changes made by others in real-time**,
So that **I always have the latest view without refreshing**.

**Acceptance Criteria:**

**Given** I am viewing the itinerary page
**When** another trip member adds, edits, or deletes an activity
**Then** I see the change reflected in my view within 500ms (NFR2)
**And** Supabase Realtime channel `trip:${tripId}:activities` broadcasts the change
**And** my UI updates automatically without page reload
**And** new activities slide in with animation
**And** deleted activities fade out with animation
**And** edited activities flash briefly to indicate the change
**When** my internet connection is lost
**Then** I see a banner: "Offline - changes will sync when reconnected"
**And** my edits are queued locally for sync when connection returns
**And** Realtime reconnects automatically when network is available
**And** sync conflicts are detected and resolved (see Story 4.12)

---

### Story 4.7: Presence Indicators for Concurrent Editing

As a **trip member**,
I want **to see which members are currently viewing or editing the itinerary**,
So that **I can coordinate changes and avoid conflicts**.

**Acceptance Criteria:**

**Given** I am viewing the itinerary page
**When** another trip member opens the same itinerary
**Then** I see a presence indicator: "[Alice's avatar] viewing"
**And** presence is tracked via Supabase Realtime presence tracking
**When** another member starts editing a specific activity
**Then** I see an indicator on that activity: "[Bob] editing"
**And** the activity card shows a pulsing border in their assigned color
**When** I start editing an activity
**Then** all other members see my presence indicator on that activity
**And** my avatar and name are broadcast via Realtime channel
**When** a member closes the page or disconnects
**Then** their presence indicator is removed within 5 seconds
**And** Realtime heartbeat mechanism detects disconnections
**And** presence indicators are accessible with screen reader announcements: "Alice started editing Activity 1"

---

### Story 4.8: Activity Change History and Audit Trail

As a **trip member**,
I want **to view the complete change history for any activity**,
So that **I can see who made what changes and when**.

**Acceptance Criteria:**

**Given** I am viewing an activity detail modal
**When** I click "View History"
**Then** I see a chronological list of all changes to this activity:
- Timestamp (e.g., "2 hours ago")
- Changed by (member name and avatar)
- Field changed (e.g., "Time slot changed")
- Old value → New value (e.g., "10:00 AM → 11:30 AM")
**And** the history is fetched from the `activity_changes` table
**And** changes are ordered by `changed_at` DESC (most recent first)
**When** the activity has never been edited
**Then** I see: "No changes yet. Created by [Alice] on [date]."
**And** creation event is shown as the first history entry
**When** I filter history by member
**Then** I see only changes made by that specific member
**And** the change history is read-only (cannot be modified)
**And** pagination is supported for activities with 100+ changes

---

### Story 4.9: Undo Recent Changes

As a **trip member**,
I want **to undo my recent changes to activities**,
So that **I can quickly revert mistakes without manual editing**.

**Acceptance Criteria:**

**Given** I have just edited or deleted an activity
**When** the change is saved
**Then** I see a toast notification: "Activity updated. Undo?"
**And** the undo option is available for 10 seconds
**When** I click "Undo" within 10 seconds
**Then** the activity is reverted to its previous state
**And** the previous values are fetched from `activity_changes` table
**And** the revert is persisted immediately
**And** all trip members see the reverted activity via Realtime sync
**And** a new change history entry is created: "Undone by [My name]"
**When** the 10-second window expires
**Then** the undo option disappears
**And** I can still revert via the change history manually
**When** I undo a deletion
**Then** the activity is restored to its original position
**And** keyboard shortcut Cmd+Z (Mac) / Ctrl+Z (Windows) triggers undo

---

### Story 4.10: Threaded Comments on Activities

As a **trip member**,
I want **to add comments to activities for discussion**,
So that **collaborators can ask questions and provide feedback**.

**Acceptance Criteria:**

**Given** I am viewing an activity detail modal
**When** I click "Add Comment"
**Then** I see a comment input field (TEXT, max 500 characters)
**When** I type a comment and click "Post"
**Then** a new `activity_comments` record is created:
- `activity_id`, `user_id`, `comment_text`, `created_at`, `parent_comment_id` (NULL for top-level)
**And** the comment appears immediately below the activity
**And** all trip members see the new comment via Realtime sync within 500ms
**When** I reply to an existing comment
**Then** the reply is nested under the parent comment (threaded)
**And** the `parent_comment_id` FK links to the parent comment
**And** replies are indented visually to show hierarchy
**When** I edit my own comment
**Then** the comment is updated with "Edited" indicator
**And** original text is not preserved (no edit history for comments)
**When** I delete my comment
**Then** the comment is soft-deleted and replaced with "[Deleted]"
**And** replies remain visible

---

### Story 4.11: @Mention Collaborators in Comments

As a **trip member**,
I want **to @mention other trip members in comments**,
So that **I can notify specific people about discussions**.

**Acceptance Criteria:**

**Given** I am writing a comment on an activity
**When** I type "@" followed by a letter
**Then** I see an autocomplete dropdown with trip members matching the input
**And** the dropdown shows member name and avatar
**When** I select a member from the dropdown
**Then** the mention is inserted as "@Alice" in the comment
**And** the comment is saved with a `mentions` JSON array: `["user_id_1", "user_id_2"]`
**When** the comment is posted
**Then** mentioned members receive an in-app notification: "[My name] mentioned you in a comment"
**And** email notification is sent if the member has email notifications enabled
**And** the notification links directly to the activity with the comment
**And** @mentions are highlighted in teal color in the comment text
**And** clicking an @mention navigates to that member's profile (optional)
**And** autocomplete is keyboard accessible (arrow keys to select, Enter to confirm)

---

### Story 4.12: Conflict Detection and Resolution

As a **trip member**,
I want **to be notified of conflicts when multiple people edit the same activity**,
So that **changes aren't lost due to simultaneous edits**.

**Acceptance Criteria:**

**Given** I am editing an activity
**When** another member saves changes to the same activity while I'm editing
**Then** I see a conflict warning: "This activity was updated by [Bob] while you were editing. Review changes?"
**And** I see a diff view comparing my changes with Bob's changes
**When** I choose "Keep My Changes"
**Then** my changes overwrite Bob's changes
**And** Bob is notified: "[My name] overwrote your changes to [Activity]"
**When** I choose "Keep Their Changes"
**Then** my changes are discarded and Bob's changes are kept
**And** I see Bob's version of the activity
**When** I choose "Merge Changes"
**Then** both sets of changes are combined intelligently:
- If fields are different, both are preserved (e.g., I changed time, Bob changed cost → both saved)
- If the same field is changed, I see a manual resolution prompt
**And** optimistic locking is used to detect conflicts (version number increments)
**And** conflicts are rare due to presence indicators preventing simultaneous edits

---

### Story 4.13: Bulk Operations on Activities

As a **trip member**,
I want **to perform bulk operations on multiple activities at once**,
So that **I can manage large itineraries efficiently**.

**Acceptance Criteria:**

**Given** I am viewing the itinerary
**When** I enable "Bulk Edit Mode"
**Then** I see checkboxes next to each activity
**When** I select multiple activities (e.g., 5 activities)
**Then** I see a bulk actions toolbar with options:
- Move to Day (dropdown)
- Change Category (dropdown)
- Delete Selected
- Duplicate Selected
**When** I select "Move to Day 3" for 5 selected activities
**Then** all 5 activities are moved to Day 3 atomically (single transaction)
**And** the activities maintain their relative order
**And** all trip members see the bulk move via Realtime sync
**When** I select "Delete Selected"
**Then** I see a confirmation: "Delete 5 activities? This cannot be undone."
**And** all selected activities are deleted in one operation
**When** I select "Duplicate Selected"
**Then** copies of the activities are created with "(Copy)" suffix
**And** keyboard shortcuts are available: Cmd+A (select all), Cmd+D (duplicate)

---

### Story 4.14: Activity Templates for Quick Creation

As a **trip member**,
I want **to create activities from predefined templates**,
So that **I can quickly add common activities without retyping details**.

**Acceptance Criteria:**

**Given** I am creating a new activity
**When** I click "Use Template"
**Then** I see a list of activity templates:
- "Morning Coffee" (Category: Food, Duration: 30 min, Cost: $5)
- "Airport Transfer" (Category: Transport, Duration: 60 min, Cost: $30)
- "Guided Tour" (Category: Activity, Duration: 180 min, Cost: $50)
- "Hotel Check-in" (Category: Accommodation, Duration: 15 min)
**And** templates are stored in the `activity_templates` table
**When** I select a template
**Then** the activity form is pre-filled with template values
**And** I can modify any field before saving
**When** I save the activity
**Then** it is created as a normal activity (not linked to the template)
**When** I create a custom template from an existing activity
**Then** I click "Save as Template" on the activity
**And** the activity is saved to `activity_templates` with my user ID as creator
**And** my custom templates are available only to me (private) or shared with the trip (optional)

---

### Story 4.15: Activity Status Tracking

As a **trip member**,
I want **to track the status of each activity (planned, booked, completed)**,
So that **I know which activities need action and which are confirmed**.

**Acceptance Criteria:**

**Given** I am viewing an activity
**When** I click the status dropdown
**Then** I see status options:
- 🔲 Planned (default)
- ✅ Booked (confirmed reservation)
- ✈️ In Progress (currently happening)
- ✔️ Completed (finished)
- ❌ Canceled
**When** I change the status to "Booked"
**Then** the `activities.status` field is updated
**And** the activity card shows a green "Booked" badge
**And** all trip members see the status update via Realtime sync
**When** I filter the itinerary by status
**Then** I see only activities matching the selected status
**And** status filter options: All, Planned, Booked, Completed
**When** an activity's trip day has passed
**Then** the system auto-updates status from "Planned" to "Completed" (optional automation)
**And** I can manually override the auto-status
**And** status changes are logged in the change history

---

### Story 4.16: Activity Dependencies and Sequencing

As a **trip member**,
I want **to define dependencies between activities**,
So that **certain activities are marked as prerequisites for others**.

**Acceptance Criteria:**

**Given** I am editing an activity
**When** I click "Add Dependency"
**Then** I see a dropdown listing all activities in the trip
**When** I select "Activity A must be completed before this activity"
**Then** a `activity_dependencies` record is created:
- `activity_id` (current activity)
- `depends_on_activity_id` (Activity A)
- `dependency_type` ('must_complete_before')
**And** the current activity shows a dependency indicator: "Depends on: Activity A"
**When** I attempt to mark the current activity as "Completed" but Activity A is not completed
**Then** I see a warning: "This activity depends on Activity A, which is not yet completed. Proceed anyway?"
**And** I can override the warning if needed
**When** I view the itinerary
**Then** activities with dependencies show a chain icon
**And** tooltip explains: "This activity depends on 2 other activities"
**And** circular dependencies are prevented (validation error if detected)

---

### Story 4.17: Activity Milestones and Progress

As a **trip member**,
I want **to mark key activities as milestones and track overall progress**,
So that **I can see how much of the itinerary is complete**.

**Acceptance Criteria:**

**Given** I am editing an activity
**When** I toggle "Mark as Milestone"
**Then** the `activities.is_milestone` field is set to TRUE
**And** the activity card displays a star icon indicating milestone status
**And** milestones are highlighted in the itinerary view
**When** I view the trip overview
**Then** I see a progress bar: "Itinerary Progress: 12 of 30 activities completed (40%)"
**And** milestones show separately: "Key Milestones: 3 of 5 completed"
**When** a milestone activity is marked as "Completed"
**Then** all trip members receive a notification: "Milestone completed: [Activity name]"
**And** the progress bar updates in real-time
**And** completed milestones are visually distinct (gold star icon)
**When** I filter the itinerary to show only milestones
**Then** I see all milestone activities across all days
**And** progress tracking respects activity status (only "Completed" counts toward progress)

---

## Epic 5: Democratic Decision-Making

Enable trip members to create votes, cast ballots anonymously, and make group decisions with transparent results and deadline management.

### Story 5.1: Create Yes/No Votes

As a **trip member**,
I want **to create a yes/no vote for a decision (e.g., "Should we visit Suzhou?")**,
So that **the group can quickly decide on binary choices**.

**Acceptance Criteria:**

**Given** I am a trip member with editor or owner role
**When** I click "Create Vote" and select "Yes/No" type
**Then** I see a vote creation form with fields:
- Question (TEXT, required, max 200 characters)
- Description (TEXT, optional, max 500 characters)
- Deadline (DATETIME, optional)
- Options: "Yes" and "No" (automatically generated)
**When** I fill the question and click "Create Vote"
**Then** a new `votes` record is created:
- `id`, `trip_id`, `created_by`, `question`, `description`, `vote_type` ('yes_no'), `deadline`, `created_at`
**And** a `vote_options` record is created for "Yes" and "No"
**And** all trip members receive a notification: "[My name] created a vote: [Question]"
**And** the vote appears in the "Active Votes" section of the trip
**And** vote status shows: "0 of 5 members voted"
**And** form is keyboard accessible

---

### Story 5.2: Create Rating Votes (1-5 Stars)

As a **trip member**,
I want **to create a rating vote for activities or accommodations**,
So that **members can rate options on a 1-5 scale**.

**Acceptance Criteria:**

**Given** I am creating a new vote
**When** I select "Rating (1-5 Stars)" as the vote type
**Then** I can add multiple options to rate (e.g., "Hotel A", "Hotel B", "Hotel C")
**And** each option has a name field (TEXT, required)
**When** I save the vote
**Then** a `votes` record is created with `vote_type` = 'rating'
**And** a `vote_options` record is created for each option
**When** members vote
**Then** they rate each option from 1 star (worst) to 5 stars (best)
**And** votes are stored in `vote_responses` table:
- `vote_id`, `user_id`, `option_id`, `rating_value` (1-5)
**And** I can add up to 10 options per rating vote
**And** I can optionally link vote options to existing activities in the itinerary

---

### Story 5.3: Create Ranking Votes (Order Preferences)

As a **trip member**,
I want **to create a ranking vote where members order their preferences**,
So that **we can identify the most preferred option using ranked-choice voting**.

**Acceptance Criteria:**

**Given** I am creating a new vote
**When** I select "Ranking" as the vote type
**Then** I can add multiple options to rank (e.g., "Restaurant A", "Restaurant B", "Restaurant C")
**When** members vote
**Then** they drag options to reorder them from most preferred (1) to least preferred (N)
**And** votes are stored as rank numbers in `vote_responses.rank_value` (1, 2, 3, ...)
**When** the vote closes
**Then** results are calculated using Borda count or instant-runoff voting:
- Borda: 1st place = N points, 2nd = N-1, ..., last = 1 point
- Winner = option with most total points
**And** I can configure the ranking method when creating the vote
**And** ranking is implemented with drag-and-drop or up/down arrows
**And** keyboard accessible (arrow keys to reorder)

---

### Story 5.4: Create Time Selection Votes

As a **trip member**,
I want **to create a time selection vote where members pick preferred times**,
So that **we can schedule activities at times that work for everyone**.

**Acceptance Criteria:**

**Given** I am creating a new vote
**When** I select "Time Selection" as the vote type
**Then** I can add multiple time slot options (e.g., "9:00 AM", "1:00 PM", "6:00 PM")
**And** each time slot can have a date attached (optional)
**When** members vote
**Then** they select one or more preferred time slots (multi-select allowed)
**And** votes are stored with `can_attend` boolean for each time option
**When** the vote closes
**Then** results show which time slot has the most availability
**And** a heatmap displays: "5/5 members can attend at 1:00 PM" (green), "2/5 at 9:00 AM" (red)
**And** time slots are timezone-aware (stored in UTC, displayed in user's timezone)

---

### Story 5.5: Create Budget Allocation Votes

As a **trip member**,
I want **to create a budget allocation vote where members distribute budget across categories**,
So that **we can decide how to spend group funds democratically**.

**Acceptance Criteria:**

**Given** I am creating a new vote
**When** I select "Budget Allocation" as the vote type
**Then** I can set a total budget amount (e.g., $500)
**And** I add categories to allocate budget to (e.g., "Food", "Transport", "Activities")
**When** members vote
**Then** they distribute the total budget across categories using sliders
**And** the sum of allocations must equal the total budget (validation enforced)
**And** votes are stored with `allocated_amount` for each category option
**When** the vote closes
**Then** results show the average allocation per category:
- "Food: $200 (40%)"
- "Transport: $150 (30%)"
- "Activities: $150 (30%)"
**And** results can be used to guide actual spending
**And** sliders are keyboard accessible with arrow keys

---

### Story 5.6: Cast Vote Anonymously

As a **trip member**,
I want **to cast my vote anonymously**,
So that **I can vote honestly without peer pressure**.

**Acceptance Criteria:**

**Given** I am viewing an active vote I haven't voted on yet
**When** I click "Vote Now"
**Then** I see the vote question and all options
**When** I select my choice(s) and click "Submit Vote"
**Then** my vote is stored in `vote_responses` table:
- `vote_id`, `user_id`, `option_id` (or `rating_value`, `rank_value`, `allocated_amount`)
- `voted_at` (timestamp)
**And** my vote is NEVER revealed to other members until the vote closes
**And** other members see vote status update: "3 of 5 voted" (not WHO voted)
**And** I see a confirmation: "Your vote has been recorded anonymously"
**And** I cannot see other members' votes before the deadline
**And** anonymous voting is enforced by RLS policies (users can only see their own votes)

---

### Story 5.7: View Vote Status (How Many Voted)

As a **trip member**,
I want **to see how many members have voted without seeing individual votes**,
So that **I know if we're waiting on anyone**.

**Acceptance Criteria:**

**Given** I am viewing an active vote
**When** I look at the vote card
**Then** I see a progress indicator: "3 of 5 members voted (60%)"
**And** I see avatars of members who have NOT voted yet (grayed out)
**And** I do NOT see WHO has voted (only the count)
**When** all members have voted
**Then** the status updates to: "All members voted! Revealing results..."
**And** results are automatically revealed (see Story 5.11)
**When** I have not voted yet
**Then** I see a prompt: "You haven't voted yet. Vote now!"
**And** the vote card is highlighted in my view

---

### Story 5.8: Anonymous Voting Until All Vote or Deadline

As a **trip member**,
I want **votes to remain anonymous until everyone votes or the deadline passes**,
So that **early votes don't influence later voters**.

**Acceptance Criteria:**

**Given** a vote is active and some members have voted
**When** I view the vote
**Then** I see ONLY the vote status (e.g., "3 of 5 voted")
**And** I do NOT see any individual votes or results
**When** the last member votes (5 of 5)
**Then** results are revealed immediately to all members
**And** Supabase Realtime broadcasts: "Vote completed. Results available."
**When** the deadline passes before all members vote
**Then** results are revealed based on the votes received
**And** members who didn't vote see: "You missed this vote. Results are final."
**And** no votes can be cast after the deadline
**And** a server cron job or Edge Function checks deadlines every minute

---

### Story 5.9: Set Vote Deadlines

As a **trip member creating a vote**,
I want **to set a deadline for the vote**,
So that **decisions are made in a timely manner**.

**Acceptance Criteria:**

**Given** I am creating a new vote
**When** I toggle "Set Deadline"
**Then** I see a date-time picker to select the deadline
**And** the deadline is stored in `votes.deadline` (TIMESTAMPTZ)
**When** I create the vote with a deadline
**Then** all members see the deadline displayed: "Deadline: Feb 28, 2026 at 5:00 PM"
**And** a countdown timer shows time remaining: "2 days 5 hours remaining"
**When** the deadline is less than 24 hours away
**Then** the countdown turns red/orange to indicate urgency
**When** the deadline passes
**Then** the vote closes automatically
**And** results are revealed (see Story 5.11)
**And** late votes are rejected with error: "This vote has closed"
**And** I can extend the deadline before it expires if I'm the vote creator

---

### Story 5.10: Vote Reminder Notifications

As a **trip member**,
I want **to receive reminders if I haven't voted before the deadline**,
So that **I don't miss important decisions**.

**Acceptance Criteria:**

**Given** a vote has a deadline set
**When** the deadline is 24 hours away and I haven't voted
**Then** I receive a notification: "Reminder: Vote on '[Question]' by tomorrow at 5:00 PM"
**And** the notification is sent via:
- In-app notification (notification center)
- Email (if email notifications enabled)
- Push notification (if enabled)
**When** the deadline is 1 hour away and I still haven't voted
**Then** I receive a final reminder: "Last chance: Vote closes in 1 hour!"
**When** I vote before the deadline
**Then** reminder notifications stop for this vote
**And** I see a confirmation: "Vote recorded. No more reminders."
**When** I have disabled vote notifications in settings
**Then** I do not receive reminders (respects user preferences)

---

### Story 5.11: View Vote Results After Completion

As a **trip member**,
I want **to view detailed vote results after the vote closes**,
So that **I can see the outcome and how everyone voted**.

**Acceptance Criteria:**

**Given** a vote has closed (all voted or deadline passed)
**When** I view the vote
**Then** I see the vote results:
- **Yes/No**: "Yes: 4 votes (80%), No: 1 vote (20%)" with bar chart
- **Rating**: "Hotel A: 4.2 stars (avg), Hotel B: 3.8 stars" with star ratings
- **Ranking**: "Winner: Restaurant A (18 points), 2nd: Restaurant B (12 points)"
- **Time Selection**: "Most popular: 1:00 PM (5 members available)"
- **Budget Allocation**: "Average allocation: Food $200, Transport $150, Activities $150"
**And** individual votes are revealed with member names:
- "Alice voted Yes, Bob voted Yes, Charlie voted No, ..."
**And** I can see my own vote highlighted
**When** I view the results page
**Then** I see a "Winning Option" badge on the top result
**And** I can export results as CSV or PDF
**And** results are read-only (cannot change votes after closing)

---

### Story 5.12: Tie-Breaking Rules for Results

As a **system**,
I want **to apply tie-breaking rules when votes result in a tie**,
So that **a clear decision is made**.

**Acceptance Criteria:**

**Given** a vote has closed with tied results (e.g., "Yes: 3, No: 3")
**When** results are calculated
**Then** the system applies tie-breaking rules:
- **Yes/No**: No winner declared, status = "Tie - needs discussion"
- **Rating**: Highest average wins, if tied → most 5-star votes wins
- **Ranking**: Borda count winner, if tied → most 1st-place votes wins
- **Time Selection**: Most availability wins, if tied → earliest time wins
- **Budget Allocation**: No tie possible (average is always unique)
**And** tie-breaking logic is configurable by vote creator (optional)
**When** a tie occurs in Yes/No vote
**Then** I see: "Result: Tie (3 Yes, 3 No). Revote or discuss?"
**And** I can create a follow-up vote or reopen the vote
**And** tie-breaking rules are displayed in the vote results

---

### Story 5.13: Vote on Multiple Activities Simultaneously

As a **trip member**,
I want **to vote on multiple activities in a single vote**,
So that **we can efficiently decide on several options at once**.

**Acceptance Criteria:**

**Given** I am creating a rating or ranking vote
**When** I link the vote to multiple activities from the itinerary
**Then** I can select activities to include in the vote (e.g., "Activity A", "Activity B", "Activity C")
**And** each activity becomes a vote option
**When** members vote
**Then** they rate or rank all selected activities
**When** the vote closes
**Then** results show which activities are most preferred
**And** I can bulk-apply the results: "Mark top 3 activities as 'Booked'"
**And** I can create a vote from the itinerary page by selecting multiple activities and clicking "Create Vote"

---

### Story 5.14: Revote/Change Vote Before Deadline

As a **trip member**,
I want **to change my vote before the deadline**,
So that **I can update my decision if plans change**.

**Acceptance Criteria:**

**Given** I have already voted on an active vote
**When** I view the vote before the deadline
**Then** I see my current vote displayed
**And** I see a "Change Vote" button
**When** I click "Change Vote"
**Then** I can update my selection(s)
**When** I submit the updated vote
**Then** my previous vote is replaced with the new vote
**And** the `vote_responses.voted_at` timestamp is updated
**And** other members do NOT see that I changed my vote (still anonymous)
**And** vote status count remains the same (still "3 of 5 voted")
**When** the deadline has passed
**Then** the "Change Vote" button is disabled
**And** I see: "Vote closed. Changes not allowed."

---

### Story 5.15: Vote History and Audit Trail

As a **trip member**,
I want **to view all past votes and their results**,
So that **I can reference previous decisions**.

**Acceptance Criteria:**

**Given** I am on the votes page
**When** I view the "Past Votes" section
**Then** I see a chronological list of all closed votes:
- Vote question
- Vote type
- Created by (member name)
- Closed date
- Winning option
**When** I click on a past vote
**Then** I see the full results and all individual votes
**And** I can see who created the vote and when
**And** I can see the change history if the vote deadline was extended
**When** I filter votes by status
**Then** I can filter by: Active, Closed, Upcoming (with future deadlines)
**And** I can search votes by question text
**And** pagination is supported for trips with 100+ votes

---

### Story 5.16: Vote Templates for Common Decisions

As a **trip member**,
I want **to create votes from predefined templates**,
So that **I can quickly create common vote types without manual setup**.

**Acceptance Criteria:**

**Given** I am creating a new vote
**When** I click "Use Template"
**Then** I see a list of vote templates:
- "Choose Restaurant" (Ranking vote with 5 options)
- "Pick Activity Time" (Time Selection vote)
- "Yes/No Decision" (Yes/No vote)
- "Rate Accommodations" (Rating vote)
**When** I select a template
**Then** the vote form is pre-filled with template settings
**And** I can modify the question, options, and deadline
**When** I save the vote
**Then** it is created as a normal vote (not linked to the template)
**When** I create a custom template from an existing vote
**Then** I click "Save as Template" on a closed vote
**And** the vote is saved to `vote_templates` table
**And** my custom templates are available only to me or shared with the trip

---

### Story 5.17: Weighted Voting (Optional Priority)

As a **trip member creating a vote**,
I want **to assign different weights to voters**,
So that **certain members' votes count more (e.g., trip organizer)**.

**Acceptance Criteria:**

**Given** I am creating a new vote
**When** I toggle "Enable Weighted Voting"
**Then** I see a weight assignment UI for each trip member
**And** I can assign weights (e.g., "Alice: 2x, Bob: 1x, Charlie: 1x")
**And** default weight is 1x for all members
**When** members vote
**Then** their votes are counted with their assigned weight
**When** results are calculated
**Then** weighted votes are summed:
- "Yes: 5 votes (Alice 2x Yes = 2, Bob 1x Yes = 1, Charlie 1x Yes = 1, Dave 1x Yes = 1)"
**And** results display: "Yes: 5 weighted votes (4 members)"
**And** weighted voting is optional and defaults to equal weights
**And** only the vote creator can assign weights
**And** weights are visible to all members (transparent, not anonymous)

---

## Epic 6: Interactive Maps & Location Services

Enable trip members to visualize activities on interactive maps, search for locations, plan routes, and manage timezone intelligence.

### Story 6.1: Add Activity Location via Pin Drop

As a **trip member**,
I want **to add a location to an activity by dropping a pin on the map**,
So that **I can precisely mark where the activity takes place**.

**Acceptance Criteria:**

**Given** I am creating or editing an activity
**When** I click "Add Location on Map"
**Then** I see an interactive Google Maps view centered on the trip destination
**When** I click anywhere on the map
**Then** a pin is dropped at that location
**And** the coordinates (latitude, longitude) are captured
**When** I click "Save Location"
**Then** the `activities` table is updated with:
- `location_lat` (DECIMAL)
- `location_lng` (DECIMAL)
- `location_name` (TEXT, auto-populated via Google Places reverse geocoding)
- `location_address` (TEXT, full address from reverse geocoding)
**And** the activity shows a location badge: "📍 [Location name]"
**And** the pin appears on the trip map immediately
**And** I can drag the pin to adjust the location before saving
**And** I can clear the location by clicking "Remove Location"

---

### Story 6.2: Add Activity Location via Google Places Search

As a **trip member**,
I want **to search for a location using Google Places autocomplete**,
So that **I can quickly find restaurants, hotels, and attractions by name**.

**Acceptance Criteria:**

**Given** I am creating or editing an activity
**When** I type in the "Location" search field
**Then** I see autocomplete suggestions from Google Places API
**And** suggestions show:
- Place name
- Address
- Category icon (restaurant, hotel, landmark, etc.)
**When** I select a suggestion (e.g., "Tokyo Skytree")
**Then** the activity is populated with:
- `location_lat`, `location_lng` (from place details)
- `location_name` ("Tokyo Skytree")
- `location_address` (full address)
- `place_id` (Google Place ID for future API calls)
**And** the activity shows the location badge
**And** a pin is added to the trip map at the selected location
**And** autocomplete respects the trip destination as search bias (e.g., searches near Tokyo if trip is in Tokyo)
**And** I can refine the search by typing more specific queries
**And** search is debounced (500ms) to avoid excessive API calls

---

### Story 6.3: Display All Activities on Interactive Map

As a **trip member**,
I want **to view all trip activities on a single interactive map**,
So that **I can visualize the spatial layout of the itinerary**.

**Acceptance Criteria:**

**Given** I am on the trip map page
**When** the page loads
**Then** I see an interactive Google Maps view with all activities that have locations
**And** each activity is represented by a color-coded pin:
- Red: Accommodation
- Blue: Activity
- Green: Food
- Yellow: Transport
**When** I click on a pin
**Then** I see an info window with:
- Activity name
- Time slot
- Estimated cost
- "View Details" link
**When** I click "View Details"
**Then** I navigate to the activity detail modal
**When** I filter activities by day
**Then** only activities from the selected day(s) are shown on the map
**And** the map auto-zooms to fit all visible pins
**And** I can toggle map layers: "Show Accommodation", "Show Food", "Show Activities"

---

### Story 6.4: Route Planning Between Activities

As a **trip member**,
I want **to plan routes between activities on the map**,
So that **I can estimate travel time and visualize the path**.

**Acceptance Criteria:**

**Given** I am viewing the trip map with multiple activities
**When** I click "Plan Route"
**Then** I see a route planner UI with a list of activities in chronological order
**When** I select activities to include in the route (e.g., "Hotel → Breakfast → Museum → Lunch")
**Then** the Google Directions API calculates the route
**And** the map displays a polyline connecting the activities
**And** I see route details:
- Total distance (e.g., "12.5 km")
- Total travel time (e.g., "45 minutes by walking")
- Travel mode selector (walking, driving, transit, bicycling)
**When** I change the travel mode
**Then** the route is recalculated for the selected mode
**And** travel time updates accordingly
**And** I can reorder activities in the route by dragging
**And** I can save the route to the itinerary (optional feature)

---

### Story 6.5: Marker Clustering for Dense Activity Groups

As a **trip member**,
I want **to see activity pins clustered when they are close together**,
So that **the map remains readable when many activities are nearby**.

**Acceptance Criteria:**

**Given** I am viewing the trip map with many activities in a small area
**When** the map loads
**Then** nearby pins are automatically clustered into numbered markers
**And** cluster markers show the count: "5" (indicates 5 activities)
**And** cluster markers use a distinct color (e.g., purple)
**When** I click on a cluster marker
**Then** the map zooms in to reveal the individual pins
**When** I zoom out
**Then** pins re-cluster automatically to keep the map clean
**And** clustering uses the @googlemaps/markerclusterer library
**And** clustering threshold is configurable (default: 50px radius)
**And** I can disable clustering via a toggle: "Show Individual Pins"

---

### Story 6.6: Timezone Intelligence and DST Warnings

As a **trip member**,
I want **to see timezone information for each trip destination**,
So that **I can plan activities with correct local times and avoid DST issues**.

**Acceptance Criteria:**

**Given** I am viewing an activity with a location
**When** the activity's location is in a different timezone than my current timezone
**Then** I see a timezone indicator: "🌍 Tokyo (JST, UTC+9)"
**And** the activity time is displayed in the local timezone
**When** the activity date falls during a DST transition
**Then** I see a DST warning: "⚠️ Daylight Saving Time begins on this date. Clocks move forward 1 hour."
**And** the warning is fetched from a timezone API (e.g., Google Time Zone API)
**When** I view the itinerary
**Then** I see a timezone summary for the trip: "Cities in 3 timezones: Shanghai (UTC+8), Tokyo (UTC+9), Beijing (UTC+8)"
**And** multi-day trips spanning timezones show timezone changes clearly
**And** I can toggle between "Local Time" and "My Time" views

---

### Story 6.7: Local Time Conversions for Activities

As a **trip member**,
I want **to see activity times converted to my local timezone**,
So that **I can coordinate with people at home or in other timezones**.

**Acceptance Criteria:**

**Given** I am viewing an activity with a time slot
**When** the activity is in a different timezone than my current timezone
**Then** I see both times displayed:
- "10:00 AM JST (Tokyo local time)"
- "6:00 PM PST (Your time)"
**And** my timezone is detected automatically from browser settings
**When** I hover over the time
**Then** I see a tooltip with conversion details: "10:00 AM in Tokyo = 6:00 PM yesterday in Los Angeles"
**When** I share the activity via link
**Then** the recipient sees times in THEIR timezone
**And** timezone conversions respect DST rules for both timezones
**And** I can manually override my detected timezone in settings

---

### Story 6.8: Map View Customization (Satellite, Terrain, etc.)

As a **trip member**,
I want **to switch between different map view types**,
So that **I can see the area in satellite, terrain, or street view**.

**Acceptance Criteria:**

**Given** I am viewing the trip map
**When** I click the map type selector
**Then** I see options:
- Roadmap (default)
- Satellite
- Terrain
- Hybrid (satellite + labels)
**When** I select "Satellite"
**Then** the map switches to satellite imagery view
**And** all activity pins remain visible on the satellite view
**And** my map type preference is saved to localStorage
**When** I revisit the map
**Then** my previous map type selection is restored
**And** I can toggle traffic layer (real-time traffic data)
**And** I can toggle transit layer (public transport routes)
**And** map controls are keyboard accessible

---

## Epic 7: Photo Management & Visual Content

Enable trip members to upload, manage, and view photos for activities, with receipt scanning and OCR for expense capture.

### Story 7.1: Upload Photos to Activities

As a **trip member**,
I want **to upload photos to activities**,
So that **I can visually document the trip and share memories**.

**Acceptance Criteria:**

**Given** I am viewing an activity detail modal
**When** I click "Add Photos"
**Then** I see a file picker to select photos from my device
**And** I can select multiple photos at once (JPG, PNG, WebP, HEIF)
**And** max file size is 10MB per photo
**When** I select photos and click "Upload"
**Then** photos are uploaded to Supabase Storage (`activity-photos/` bucket)
**And** a `photos` record is created for each photo:
- `id`, `activity_id`, `user_id`, `url` (CDN URL), `uploaded_at`
**And** I see upload progress indicators for each photo
**When** uploads complete
**Then** photos appear in the activity's photo gallery immediately
**And** all trip members see the new photos via Realtime sync
**And** drag-and-drop upload is supported as an alternative to file picker
**And** I can upload photos from the itinerary view or activity modal

---

### Story 7.2: Automatic Photo Compression and Optimization

As a **developer**,
I want **to automatically compress and optimize uploaded photos**,
So that **storage costs are minimized and page load times are fast**.

**Acceptance Criteria:**

**Given** a user uploads a photo to an activity
**When** the photo is uploaded to Supabase Storage
**Then** a server-side Edge Function or Supabase Storage hook processes the image:
1. Compress the image to 85% quality (lossy compression)
2. Resize to max width 1920px (maintain aspect ratio)
3. Generate a WebP version for modern browsers
4. Generate thumbnails: 200px (thumb), 400px (card), 800px (preview)
**And** original image is optionally retained for download (configurable)
**And** the `photos` table stores URLs for all variants:
- `url_original`, `url_webp`, `url_thumb`, `url_card`, `url_preview`
**When** a photo is displayed in the UI
**Then** the appropriate variant is served:
- Thumbnail in photo grids
- Card-sized in activity galleries
- Full preview in lightbox
**And** WebP is served to browsers that support it (via `<picture>` element)
**And** compression reduces file size by 60-80% on average

---

### Story 7.3: Photo CDN Delivery

As a **trip member**,
I want **photos to load quickly from a CDN**,
So that **I can view images without delays, even on slow connections**.

**Acceptance Criteria:**

**Given** photos are stored in Supabase Storage
**When** a photo is requested by the UI
**Then** the photo is served via Supabase's CDN (CloudFront or equivalent)
**And** CDN caching headers are set:
- `Cache-Control: public, max-age=31536000, immutable` (1 year)
**And** photos are served from edge locations close to the user
**When** I view a photo for the first time
**Then** it is fetched from storage and cached by the CDN
**When** I view the same photo again
**Then** it is served from the CDN cache (near-instant load)
**And** browser caching is enabled to avoid redundant requests
**And** lazy loading is implemented for photo grids (images load as user scrolls)

---

### Story 7.4: Scan Receipt Photos with Device Camera

As a **trip member**,
I want **to scan receipt photos using my device's camera**,
So that **I can capture expense details quickly without manual entry**.

**Acceptance Criteria:**

**Given** I am creating a new expense
**When** I click "Scan Receipt"
**Then** my device's camera is activated (via browser API)
**And** I can take a photo of the receipt
**When** I capture the photo
**Then** the photo is uploaded to Supabase Storage (`receipt-photos/` bucket)
**And** the photo is automatically processed for OCR (see Story 7.5)
**And** I see a preview of the captured receipt photo
**When** I retake the photo
**Then** I can delete the previous photo and capture a new one
**And** camera access respects browser permissions (requests permission if needed)
**And** I can alternatively upload a receipt photo from my device's photo library
**And** receipt photos are linked to the expense record in `expenses.receipt_url`

---

### Story 7.5: OCR for Receipt Data Extraction

As a **developer**,
I want **to extract text from receipt photos using OCR**,
So that **expense amounts, dates, and merchants are automatically detected**.

**Acceptance Criteria:**

**Given** a receipt photo has been uploaded
**When** the photo is processed
**Then** an OCR service (Google Cloud Vision API, Tesseract, or similar) extracts text
**And** the OCR service identifies key fields:
- **Amount**: Total amount paid (e.g., "$45.50", "¥3200")
- **Date**: Transaction date (e.g., "2026-08-28")
- **Merchant**: Vendor name (e.g., "Starbucks Tokyo")
**And** extracted data is returned as JSON:
```json
{
  "amount": "45.50",
  "currency": "USD",
  "date": "2026-08-28",
  "merchant": "Starbucks Tokyo"
}
```
**And** OCR processing completes within 3 seconds (NFR4)
**When** OCR fails to extract data (poor photo quality)
**Then** the user is notified: "Unable to read receipt. Please enter details manually."
**And** the receipt photo is still saved for reference
**And** OCR results are stored in `expenses` table for review before saving

---

### Story 7.6: Auto-populate Expense Forms from Receipt Data

As a **trip member**,
I want **expense forms to auto-populate with OCR-extracted data**,
So that **I can create expenses with minimal manual input**.

**Acceptance Criteria:**

**Given** I have scanned a receipt photo
**When** OCR extraction completes
**Then** the expense form is auto-populated with:
- Amount field: "45.50"
- Currency field: "USD" (or detected currency)
- Date field: "August 28, 2026"
- Description field: "Starbucks Tokyo"
**And** I see a confirmation: "✅ Receipt scanned successfully. Review details below."
**And** all auto-populated fields are editable (I can correct errors)
**When** OCR extracts an amount in a foreign currency (e.g., "¥3200")
**Then** the system auto-detects the currency symbol and sets the currency field
**And** amount is converted to my preferred currency using live exchange rates
**When** I review the auto-populated data and click "Create Expense"
**Then** the expense is saved with the OCR-extracted data
**And** the receipt photo is attached to the expense record
**And** I can manually edit any field before saving

---

### Story 7.7: Manage and Delete Photos

As a **trip member**,
I want **to manage and delete photos I've uploaded**,
So that **I can remove duplicates or unwanted images**.

**Acceptance Criteria:**

**Given** I am viewing an activity's photo gallery
**When** I click on a photo I uploaded
**Then** I see options:
- "Download Original" (download full-resolution photo)
- "Delete Photo"
**When** I click "Delete Photo"
**Then** I see a confirmation: "Delete this photo? This cannot be undone."
**When** I confirm deletion
**Then** the `photos` record is deleted from the database
**And** the photo files are deleted from Supabase Storage (all variants)
**And** the photo disappears from the gallery immediately
**And** all trip members see the deletion via Realtime sync
**When** I attempt to delete a photo uploaded by another member
**Then** deletion is allowed if I am the trip owner
**And** the original uploader is notified: "[My name] deleted your photo"
**And** photo deletion respects storage cleanup (orphaned files are removed)

---

## Epic 8: Expense Tracking & Splitting

Enable trip members to log expenses, split costs fairly, manage multi-currency conversions, and track who owes whom with receipt management.

### Story 8.1: Log Expense with Basic Details

As a **trip member**,
I want **to log an expense with payer, amount, category, and description**,
So that **we can track all trip spending in one place**.

**Acceptance Criteria:**

**Given** I am a trip member
**When** I click "Add Expense"
**Then** I see an expense creation form with fields:
- Amount (DECIMAL, required)
- Currency (SELECT: USD, EUR, CNY, JPY)
- Category (SELECT: Accommodation, Food, Transport, Activity, Other)
- Description (TEXT, required, max 200 characters)
- Paid by (SELECT: trip members)
- Date (DATE, defaults to today)
- Receipt photo (optional, see Story 7.4)
**When** I fill required fields and click "Create Expense"
**Then** a new `expenses` record is created:
- `id`, `trip_id`, `amount`, `currency`, `category`, `description`, `paid_by` (user ID), `expense_date`, `created_at`
**And** the expense appears in the trip's expense list immediately
**And** all trip members see the new expense via Realtime sync
**And** validation ensures amount > 0 and required fields are filled
**And** form is keyboard accessible

---

### Story 8.2: Split Expense Equally Among Members

As a **trip member logging an expense**,
I want **to split the expense equally among all trip members**,
So that **everyone pays their fair share**.

**Acceptance Criteria:**

**Given** I am creating a new expense
**When** I select "Split Equally" as the split type
**Then** the expense is divided equally among all trip members
**And** split amounts are calculated: `total_amount / number_of_members`
**And** `expense_splits` records are created for each member:
- `expense_id`, `user_id`, `amount_owed` (equal share)
**When** the trip has 5 members and the expense is $100
**Then** each member owes $20
**And** the member who paid ($100) is owed $80 total
**And** split calculation handles rounding (leftover cents go to payer)
**And** I can exclude specific members from the split before saving
**And** excluded members have `amount_owed = 0` in their split record

---

### Story 8.3: Split Expense with Custom Amounts

As a **trip member logging an expense**,
I want **to split the expense with custom amounts per person**,
So that **I can handle unequal sharing (e.g., some people ordered more)**.

**Acceptance Criteria:**

**Given** I am creating a new expense
**When** I select "Custom Split" as the split type
**Then** I see input fields for each trip member to enter their share
**And** I can set custom amounts (e.g., "Alice: $40, Bob: $30, Charlie: $30")
**When** I enter custom amounts
**Then** the system validates that the sum equals the total expense amount
**And** I see a running total: "Total: $100 / $100 ✅" (or "Total: $90 / $100 ❌ $10 remaining")
**When** the total doesn't match
**Then** I see an error: "Split amounts must equal $100. Currently $90."
**And** I cannot save the expense until amounts match
**And** I can click "Auto-fill Remaining" to distribute the leftover amount equally
**And** custom split amounts are stored in `expense_splits.amount_owed`

---

### Story 8.4: Split Expense by Percentage

As a **trip member logging an expense**,
I want **to split the expense by percentage (e.g., 50%, 30%, 20%)**,
So that **I can allocate costs proportionally**.

**Acceptance Criteria:**

**Given** I am creating a new expense
**When** I select "Percentage Split" as the split type
**Then** I see percentage input fields for each trip member
**And** I can set percentages (e.g., "Alice: 50%, Bob: 30%, Charlie: 20%")
**When** I enter percentages
**Then** the system validates that the sum equals 100%
**And** I see a running total: "Total: 100% ✅" (or "Total: 90% ❌ 10% remaining")
**When** the total doesn't equal 100%
**Then** I see an error: "Percentages must total 100%. Currently 90%."
**When** I save the expense
**Then** percentage amounts are calculated:
- Alice owes: $100 × 50% = $50
- Bob owes: $100 × 30% = $30
- Charlie owes: $100 × 20% = $20
**And** calculated amounts are stored in `expense_splits.amount_owed`
**And** percentage values are stored in `expense_splits.percentage`

---

### Story 8.5: Multi-Currency Expense Logging

As a **trip member**,
I want **to log expenses in different currencies (USD, EUR, CNY, JPY)**,
So that **I can track spending in the local currency where it occurred**.

**Acceptance Criteria:**

**Given** I am creating a new expense
**When** I select a currency from the dropdown
**Then** I can choose from: USD, EUR, CNY, JPY (the 4 supported currencies)
**And** the currency symbol is displayed next to the amount field
**When** I save the expense
**Then** the `expenses.currency` field stores the selected currency
**And** the expense is displayed with the correct currency symbol (e.g., "¥3200")
**When** I view the expense list
**Then** expenses are grouped by currency or displayed with mixed currencies
**And** I can filter expenses by currency
**And** currency symbols follow internationalization standards (USD: $, EUR: €, CNY: ¥, JPY: ¥)
**And** I can set my preferred display currency in settings

---

### Story 8.6: Automatic Currency Conversion

As a **trip member**,
I want **to see expenses converted to my preferred currency**,
So that **I can understand total spending in one currency**.

**Acceptance Criteria:**

**Given** I have set my preferred currency to USD in settings
**When** I view an expense logged in EUR (e.g., €50)
**Then** I see the converted amount: "€50 (≈ $54.50 USD)"
**And** conversion uses live exchange rates from Frankfurter API
**When** I view the trip expense summary
**Then** all expenses are converted to my preferred currency for the total
**And** I see: "Total Spending: $1,250 USD (includes conversions)"
**And** individual expenses still display in their original currency
**When** exchange rates are updated (daily)
**Then** cached rates are refreshed automatically
**And** historical expenses use the exchange rate from the expense date (not current rate)
**And** conversion rates are stored in `expense_splits` table for historical accuracy

---

### Story 8.7: Calculate Who Owes Whom (Settlement Optimization)

As a **trip member**,
I want **to see who owes whom and how much**,
So that **we can settle expenses efficiently at the end of the trip**.

**Acceptance Criteria:**

**Given** the trip has multiple expenses with various payers
**When** I view the "Settlements" page
**Then** I see a list of debts optimized to minimize transactions:
- "Alice owes Bob $50"
- "Charlie owes Bob $30"
- "Bob is owed $80 total"
**And** the system uses a settlement optimization algorithm:
1. Calculate net balance for each member (total paid - total owed)
2. Minimize number of transactions (e.g., 3 people → max 2 transactions)
**When** Alice paid $100, Bob paid $50, Charlie paid $50, all split equally ($66.67 each)
**Then** settlements are:
- Alice is owed: $100 - $66.67 = $33.33
- Bob owes: $66.67 - $50 = $16.67
- Charlie owes: $66.67 - $50 = $16.67
- Result: "Bob pays Alice $16.67, Charlie pays Alice $16.67"
**And** settlements are displayed in each member's preferred currency
**And** settlements update in real-time as expenses are added/edited

---

### Story 8.8: View Expense Analytics and Reports

As a **trip member**,
I want **to view expense analytics and visual reports**,
So that **I can understand spending patterns and stay within budget**.

**Acceptance Criteria:**

**Given** I am on the expense analytics page
**When** I view the analytics dashboard
**Then** I see:
- **Total Spending**: "$1,250" (all expenses summed)
- **Spending by Category**: Pie chart (Food: 40%, Transport: 30%, Accommodation: 20%, Activities: 10%)
- **Spending by Member**: Bar chart (who paid the most)
- **Daily Spending Trend**: Line chart (spending over time)
- **Budget vs Actual**: Progress bar (e.g., "$1,250 / $1,500 budget (83%)")
**When** I filter by date range
**Then** analytics update to show only expenses in that range
**When** I filter by category
**Then** I see spending breakdown for that category only
**And** I can export analytics as PDF or CSV
**And** charts are accessible with ARIA labels and keyboard navigation

---

### Story 8.9: Filter and Search Expenses

As a **trip member**,
I want **to filter and search expenses**,
So that **I can quickly find specific transactions**.

**Acceptance Criteria:**

**Given** I am on the expense list page
**When** I use the search bar
**Then** I can search by:
- Description (e.g., "Starbucks")
- Category (e.g., "Food")
- Amount range (e.g., "$20 - $50")
- Paid by (e.g., "Alice")
**When** I apply filters
**Then** the expense list updates to show only matching expenses
**And** I see: "Showing 5 of 30 expenses"
**When** I select multiple filters (e.g., "Food" + "Paid by Alice")
**Then** results are intersected (AND logic)
**And** I can clear all filters with "Reset Filters" button
**And** search is debounced (500ms) to avoid excessive queries
**And** filter state persists in URL query params (shareable link)

---

### Story 8.10: Attach Receipt Photos to Expenses

As a **trip member**,
I want **to attach receipt photos to expenses**,
So that **we have proof of purchase for record-keeping**.

**Acceptance Criteria:**

**Given** I am creating or editing an expense
**When** I click "Attach Receipt"
**Then** I can upload a receipt photo (see Story 7.1)
**And** the photo is stored in Supabase Storage (`receipt-photos/` bucket)
**And** the `expenses.receipt_url` field is updated with the photo URL
**When** I view the expense
**Then** I see a receipt thumbnail
**When** I click the receipt thumbnail
**Then** the receipt opens in a lightbox for full viewing
**And** I can download the receipt photo
**And** I can replace the receipt photo with a new one
**And** I can remove the receipt photo (sets `receipt_url` to NULL)
**And** multiple receipts per expense are supported (stored in `expense_receipts` table)

---

### Story 8.11: Edit and Delete Expenses

As a **trip member**,
I want **to edit or delete expenses I've logged**,
So that **I can correct mistakes or remove duplicates**.

**Acceptance Criteria:**

**Given** I am viewing an expense I created
**When** I click "Edit Expense"
**Then** I see the expense form pre-filled with current values
**When** I modify any field (amount, category, split type) and click "Save"
**Then** the `expenses` record is updated
**And** the `expense_splits` records are recalculated if split type or amount changed
**And** all trip members see the updated expense via Realtime sync
**And** a change record is created in `expense_changes` table for audit trail
**When** I click "Delete Expense"
**Then** I see a confirmation: "Delete this expense? This cannot be undone."
**When** I confirm deletion
**Then** the `expenses` record is deleted
**And** associated `expense_splits` records are deleted (cascading delete)
**And** the expense is removed from the list immediately
**And** settlements are recalculated automatically
**When** I attempt to edit/delete an expense created by another member
**Then** edit/delete is allowed if I am the trip owner
**And** the creator is notified of the change/deletion

---

### Story 8.12: Expense Categories and Tagging

As a **trip member**,
I want **to categorize expenses and add custom tags**,
So that **I can organize expenses beyond predefined categories**.

**Acceptance Criteria:**

**Given** I am creating a new expense
**When** I select a category
**Then** I can choose from:
- Accommodation
- Food & Dining
- Transportation
- Activities & Tours
- Shopping & Souvenirs
- Other
**And** categories are color-coded in the expense list
**When** I add custom tags (e.g., "breakfast", "shared taxi", "museum")
**Then** tags are stored in `expenses.tags` (TEXT[] array)
**And** I can add multiple tags per expense
**When** I filter expenses by tag
**Then** I see only expenses with that tag
**And** tag autocomplete suggests previously used tags
**And** I can create new tags on-the-fly
**And** tags are case-insensitive (normalized to lowercase)

---

### Story 8.13: Mark Expenses as Paid/Settled

As a **trip member**,
I want **to mark expenses as settled when debts are paid**,
So that **we know which balances have been resolved**.

**Acceptance Criteria:**

**Given** I am viewing the settlements page
**When** I see "Bob owes Alice $50"
**Then** I see a "Mark as Settled" button
**When** I click "Mark as Settled"
**Then** the `expense_splits.settled` field is set to TRUE
**And** the `expense_splits.settled_at` timestamp is recorded
**And** the settlement is visually marked as complete (strikethrough or checkmark)
**And** the debt no longer appears in the "Outstanding Balances" section
**When** I view the settlement history
**Then** I see all settled debts with settlement dates
**And** I can filter settlements: All, Outstanding, Settled
**And** I can undo a settlement: "Mark as Unsettled" (sets `settled = FALSE`)
**And** settled expenses are excluded from the "Who Owes Whom" calculation

---

### Story 8.14: Expense Approval Workflow (Optional)

As a **trip owner**,
I want **to require approval for large expenses before they count toward totals**,
So that **we can prevent unauthorized spending**.

**Acceptance Criteria:**

**Given** I am the trip owner
**When** I enable "Expense Approval" in trip settings
**Then** I can set an approval threshold (e.g., "Expenses over $100 require approval")
**When** a member logs an expense over the threshold
**Then** the expense is created with `status = 'pending'`
**And** I receive a notification: "[Member] submitted an expense for approval: $150"
**When** I view the pending expense
**Then** I see "Approve" and "Reject" buttons
**When** I click "Approve"
**Then** the expense `status` changes to 'approved'
**And** the expense is included in totals and settlements
**And** the member is notified: "Your expense was approved"
**When** I click "Reject"
**Then** the expense `status` changes to 'rejected'
**And** the expense is excluded from totals
**And** the member is notified with rejection reason
**And** approval workflow is optional and defaults to disabled

---

### Story 8.15: Recurring Expenses (Optional)

As a **trip member**,
I want **to create recurring expenses (e.g., daily accommodation)**,
So that **I don't have to log the same expense repeatedly**.

**Acceptance Criteria:**

**Given** I am creating a new expense
**When** I toggle "Recurring Expense"
**Then** I see recurrence options:
- Frequency (Daily, Weekly)
- Start date
- End date or number of occurrences
**When** I save a daily recurring expense (e.g., "$100 hotel per day for 7 days")
**Then** 7 `expenses` records are created, one for each day
**And** each expense has the same amount, category, and split
**And** each expense is dated sequentially (Day 1, Day 2, ..., Day 7)
**When** I edit a recurring expense
**Then** I see options: "Edit this occurrence only" or "Edit all future occurrences"
**And** editing all occurrences updates all future expense records
**And** past occurrences are not modified
**And** I can stop a recurring expense early

---

### Story 8.16: Export Expenses to CSV/PDF

As a **trip member**,
I want **to export all expenses to CSV or PDF**,
So that **I can use the data in spreadsheets or share reports**.

**Acceptance Criteria:**

**Given** I am on the expense list page
**When** I click "Export Expenses"
**Then** I see export format options: CSV, PDF
**When** I select "CSV"
**Then** a CSV file is generated with columns:
- Date, Description, Category, Amount, Currency, Paid By, Split Type, Tags, Receipt URL
**And** the file is downloaded: `trip-expenses-2026-08-27.csv`
**When** I select "PDF"
**Then** a formatted PDF report is generated with:
- Trip name and date range
- Expense list (table format)
- Total spending summary
- Settlements summary
**And** the PDF is downloaded: `trip-expenses-2026-08-27.pdf`
**And** I can filter expenses before exporting (e.g., export only "Food" expenses)
**And** exported data respects user permissions (no budgets included)

---

### Story 8.17: Expense Notifications

As a **trip member**,
I want **to receive notifications when expenses are added or settled**,
So that **I stay informed about trip spending**.

**Acceptance Criteria:**

**Given** another trip member logs a new expense
**When** the expense is saved
**Then** I receive a notification: "[Alice] added an expense: $50 for Lunch"
**And** the notification is sent via:
- In-app notification (notification center)
- Email (if enabled in settings)
**When** an expense is edited
**Then** I receive a notification: "[Bob] updated an expense: Breakfast ($20 → $25)"
**When** an expense I owe is marked as settled
**Then** I receive a notification: "Your payment to [Charlie] ($30) was marked as settled"
**And** I can configure notification preferences: All Expenses, Only expenses I'm involved in, None
**And** notification batching is supported (daily digest option)

---

### Story 8.18: Per-Person Expense Summary

As a **trip member**,
I want **to view a summary of my own expenses and what I owe/am owed**,
So that **I can track my personal spending and balances**.

**Acceptance Criteria:**

**Given** I am on my personal expense summary page
**When** I view the summary
**Then** I see:
- **Total I Paid**: "$300" (sum of expenses I paid for)
- **Total I Owe**: "$250" (sum of my splits from others' expenses)
- **Net Balance**: "$50" (I am owed $50) or "-$50" (I owe $50)
- **Outstanding Debts**: List of people I owe (e.g., "You owe Bob $30")
- **People Who Owe Me**: List of people who owe me (e.g., "Alice owes you $20")
**When** I filter by date range
**Then** the summary updates to show only expenses in that range
**And** I can view my expense history (chronological list)
**And** I can export my personal summary as PDF
**And** the summary respects settled expenses (excluded from outstanding balances)

---

### Story 8.19: Expense History and Audit Trail

As a **trip member**,
I want **to view the complete history of expense changes**,
So that **I can track who modified what and when**.

**Acceptance Criteria:**

**Given** I am viewing an expense detail modal
**When** I click "View History"
**Then** I see a chronological list of all changes to this expense:
- Timestamp (e.g., "2 hours ago")
- Changed by (member name and avatar)
- Field changed (e.g., "Amount changed")
- Old value → New value (e.g., "$50 → $55")
**And** the history is fetched from the `expense_changes` table
**And** changes are ordered by `changed_at` DESC (most recent first)
**When** the expense has never been edited
**Then** I see: "No changes yet. Created by [Alice] on [date]."
**When** the expense is deleted
**Then** the deletion is logged: "Deleted by [Bob] on [date]"
**And** the audit trail is preserved even after deletion (soft delete or separate log table)
**And** I can filter history by member or field

---

## Epic 9: Payment Integration & Settlement

Enable users to settle expenses via integrated payment providers with automatic status tracking.

### Story 9.1: Generate Payment Links for Settlements

As a **trip member**,
I want **to generate payment links for people who owe me money**,
So that **they can pay me easily via Stripe, PayPal, or Venmo**.

**Acceptance Criteria:**

**Given** I am viewing a settlement where someone owes me money (e.g., "Bob owes you $50")
**When** I click "Generate Payment Link"
**Then** I see payment provider options:
- Stripe (credit/debit card)
- PayPal
- Venmo (US only)
**When** I select "Stripe"
**Then** a Stripe Payment Link is generated via Stripe API with:
- Amount: $50
- Description: "Trip settlement: [Trip Name]"
- Recipient: My Stripe account (configured in settings)
**And** I see the generated link: `https://pay.stripe.com/...`
**And** I can copy the link or share it directly with Bob via:
- In-app message
- Email
- SMS (if phone number available)
**When** I share the link with Bob
**Then** Bob receives the link and can click to pay
**And** the link opens a Stripe checkout page
**And** I receive a notification when payment is initiated

---

### Story 9.2: Settle Expenses via Integrated Payment Providers

As a **trip member who owes money**,
I want **to pay settlements directly via payment links**,
So that **I can settle debts quickly without manual bank transfers**.

**Acceptance Criteria:**

**Given** I receive a payment link from Alice
**When** I click the link
**Then** I am redirected to the payment provider's checkout page (Stripe/PayPal/Venmo)
**And** I see the payment details:
- Amount: $50
- Recipient: Alice
- Description: "Trip settlement: Tokyo Adventure"
**When** I complete the payment
**Then** the payment provider processes the transaction
**And** I receive a payment confirmation email from the provider
**And** TripFlow receives a webhook from the payment provider
**And** the settlement is automatically marked as settled in TripFlow
**And** Alice is notified: "Bob paid you $50 via Stripe"
**When** payment fails (insufficient funds, declined card)
**Then** I see an error from the payment provider
**And** the settlement remains unsettled in TripFlow
**And** I can retry payment

---

### Story 9.3: Automatic Settlement Status Tracking

As a **system**,
I want **to automatically update settlement status when payments are confirmed**,
So that **users don't have to manually mark settlements as paid**.

**Acceptance Criteria:**

**Given** a payment is completed via Stripe/PayPal/Venmo
**When** TripFlow receives a webhook notification from the payment provider
**Then** the webhook payload is validated (signature verification)
**And** the corresponding settlement is identified via `payment_id` or metadata
**When** payment status is "succeeded"
**Then** the `expense_splits.settled` field is set to TRUE
**And** the `expense_splits.settled_at` timestamp is recorded
**And** the `expense_splits.payment_method` is set to the provider (e.g., "stripe")
**And** both payer and recipient are notified
**When** payment status is "refunded"
**Then** the settlement is marked as unsettled again
**And** both parties are notified of the refund
**And** webhook handling is idempotent (duplicate webhooks are ignored)
**And** webhook failures are logged and retried (exponential backoff)

---

## Epic 10: Search, Filter & Discovery

Enable users to quickly find trips, activities, and expenses using search and filtering capabilities.

### Story 10.1: Search Trips by Destination or Date

As a **logged-in user**,
I want **to search my trips by destination or date range**,
So that **I can quickly find the trip I'm looking for**.

**Acceptance Criteria:**

**Given** I am on the trips dashboard
**When** I type in the search bar
**Then** I can search by:
- Trip name (e.g., "Tokyo Adventure")
- Destination (e.g., "Tokyo", "Japan")
- Date range (e.g., "August 2026")
**When** I type "Tokyo"
**Then** the trip list filters to show only trips with "Tokyo" in the name or destination
**And** search is case-insensitive
**And** partial matches are supported (e.g., "Tok" matches "Tokyo")
**When** I clear the search
**Then** all trips are displayed again
**And** search is debounced (500ms) to avoid excessive queries
**And** search results highlight matching text

---

### Story 10.2: Search Activities by Name, Location, or Type

As a **trip member**,
I want **to search activities within the itinerary**,
So that **I can quickly find specific plans**.

**Acceptance Criteria:**

**Given** I am viewing the trip itinerary
**When** I type in the activity search bar
**Then** I can search by:
- Activity name (e.g., "Tokyo Tower")
- Location (e.g., "Shibuya")
- Category (e.g., "Food", "Museum")
**When** I type "Tower"
**Then** the itinerary filters to show only activities with "Tower" in the name or location
**And** matching activities are highlighted
**And** search works across all trip days
**When** I select a search result
**Then** the itinerary scrolls to that activity
**And** the activity is highlighted with a pulsing border
**And** I can clear search to return to full view

---

### Story 10.3: Filter Itinerary by Day, Cost, or Category

As a **trip member**,
I want **to filter the itinerary by day, cost range, or category**,
So that **I can focus on specific types of activities**.

**Acceptance Criteria:**

**Given** I am viewing the trip itinerary
**When** I apply filters
**Then** I can filter by:
- **Day**: Select one or more days (e.g., "Day 1", "Day 2")
- **Category**: Select one or more categories (e.g., "Food", "Activity")
- **Cost Range**: Slider or input (e.g., "$0 - $50")
- **Status**: Planned, Booked, Completed
**When** I select "Day 1" and "Food" category
**Then** the itinerary shows only food activities on Day 1
**And** other activities are hidden
**And** I see: "Showing 3 of 30 activities"
**When** I set cost range to "$0 - $50"
**Then** only activities with estimated cost ≤ $50 are shown
**When** I clear all filters
**Then** all activities are displayed again
**And** filter state persists in URL query params (shareable)

---

### Story 10.4: Filter Expenses by Category or Traveler

As a **trip member**,
I want **to filter expenses by category or who paid**,
So that **I can analyze specific spending patterns**.

**Acceptance Criteria:**

**Given** I am viewing the expense list
**When** I apply filters
**Then** I can filter by:
- **Category**: Food, Transport, Accommodation, etc.
- **Paid By**: Select one or more members
- **Date Range**: Calendar date picker
- **Amount Range**: Slider or input
**When** I select "Food" category
**Then** only food expenses are displayed
**And** the total is recalculated: "Food Spending: $450 (18 expenses)"
**When** I select "Paid By Alice"
**Then** only expenses Alice paid for are shown
**And** I see: "Alice paid $300 across 12 expenses"
**When** I combine filters (e.g., "Food" + "Paid By Alice")
**Then** results are intersected (AND logic)
**And** I can clear individual filters or all filters at once
**And** filtered view can be exported to CSV/PDF

---

## Epic 11: Offline Functionality & Sync

Enable users to view and edit trip data while offline with automatic sync, conflict resolution, and PWA installation.

### Story 11.1: View Cached Itinerary Offline

As a **trip member**,
I want **to view the trip itinerary when I'm offline**,
So that **I can access trip plans without internet (e.g., on a flight)**.

**Acceptance Criteria:**

**Given** I have previously viewed the trip itinerary online
**When** my device goes offline (airplane mode, no WiFi)
**Then** I can still access the trip and view the itinerary
**And** activities, dates, locations, and notes are displayed from cache
**And** I see an offline indicator: "🔴 Offline - viewing cached data"
**When** I try to view photos
**Then** cached photo thumbnails are displayed
**And** full-resolution photos may not be available (replaced with placeholder)
**And** Service Worker caches the itinerary data for offline access
**And** cache is updated whenever I view the itinerary online

---

### Story 11.2: Add and Edit Activities Offline

As a **trip member**,
I want **to add and edit activities while offline**,
So that **I can update plans even without internet**.

**Acceptance Criteria:**

**Given** I am viewing the itinerary offline
**When** I create a new activity
**Then** the activity is saved to IndexedDB (local storage)
**And** the activity is marked as "pending sync" with a sync icon
**And** I see a toast: "Activity saved locally. Will sync when online."
**When** I edit an existing activity offline
**Then** the changes are saved to IndexedDB
**And** the activity is marked as "pending sync"
**When** my device reconnects to the internet
**Then** all pending changes are automatically synced to Supabase
**And** the sync happens in the background (user doesn't need to trigger it)
**And** I see a toast: "3 activities synced successfully"
**And** sync icons are removed from synced activities

---

### Story 11.3: Offline Sync Status and Queue

As a **trip member**,
I want **to see the sync status of my offline changes**,
So that **I know which edits are pending upload**.

**Acceptance Criteria:**

**Given** I have made changes offline
**When** I view the sync status panel
**Then** I see a list of pending changes:
- "Activity 'Tokyo Tower' created (pending sync)"
- "Activity 'Breakfast' edited (pending sync)"
- "Expense '$50 Lunch' created (pending sync)"
**And** each pending change shows a sync icon and timestamp
**When** my device reconnects
**Then** the sync queue is processed automatically
**And** I see real-time sync progress: "Syncing 1 of 3 changes..."
**When** all changes are synced
**Then** the sync status panel shows: "✅ All changes synced"
**And** I can manually trigger sync by clicking "Sync Now"
**And** failed syncs are retried automatically (exponential backoff)

---

### Story 11.4: Conflict Resolution for Concurrent Offline Edits

As a **trip member**,
I want **conflicts to be detected and resolved when I sync offline changes**,
So that **data isn't lost when multiple people edit the same activity offline**.

**Acceptance Criteria:**

**Given** I edited "Activity A" offline (changed time from 10:00 to 11:00)
**When** I reconnect and sync
**Then** the system checks if "Activity A" was modified by others while I was offline
**When** another member also edited "Activity A" (changed cost from $50 to $60)
**Then** a conflict is detected (version mismatch)
**And** I see a conflict resolution UI:
- "Your change: Time 10:00 → 11:00"
- "Alice's change: Cost $50 → $60"
**And** I can choose:
- "Keep My Changes" (discard Alice's cost change)
- "Keep Their Changes" (discard my time change)
- "Merge Both Changes" (apply both: time 11:00 + cost $60)
**When** I choose "Merge Both Changes"
**Then** both edits are applied
**And** Alice is notified of the merge
**And** optimistic locking prevents data loss (version numbers are incremented)

---

### Story 11.5: Install App to Home Screen (PWA)

As a **user**,
I want **to install TripFlow as a Progressive Web App (PWA)**,
So that **it behaves like a native app on my device**.

**Acceptance Criteria:**

**Given** I am using TripFlow in a PWA-compatible browser (Chrome, Edge, Safari)
**When** I visit the TripFlow app
**Then** I see a browser prompt: "Install TripFlow to your home screen?"
**And** I can click "Install" or dismiss the prompt
**When** I click "Install"
**Then** TripFlow is added to my device's home screen with an app icon
**And** opening the app from the home screen launches it in standalone mode (no browser UI)
**And** the app has a splash screen during launch
**And** the `manifest.json` file defines:
- App name: "TripFlow"
- Icons: 192px and 512px
- Start URL: "/"
- Display mode: "standalone"
**And** Service Worker is registered for offline functionality
**And** PWA installation works on Android, iOS, and desktop

---

### Story 11.6: Receive Push Notifications (Web Push)

As a **user with the PWA installed**,
I want **to receive push notifications for trip updates**,
So that **I stay informed even when the app is closed**.

**Acceptance Criteria:**

**Given** I have installed the TripFlow PWA
**When** I enable notifications in settings
**Then** I see a browser prompt: "Allow TripFlow to send notifications?"
**When** I click "Allow"
**Then** a push subscription is created and stored in the database
**And** TripFlow can send push notifications to my device
**When** a trip member adds a new activity
**Then** I receive a push notification: "Alice added 'Tokyo Tower' to the itinerary"
**And** the notification appears even if the app is closed
**When** I click the notification
**Then** the app opens and navigates to the relevant activity
**And** push notifications respect user preferences (can be disabled)
**And** push notifications are sent via Web Push API (service worker)

---

### Story 11.7: Service Worker Caching Strategy

As a **developer**,
I want **to implement a Service Worker with an efficient caching strategy**,
So that **the app loads quickly and works offline**.

**Acceptance Criteria:**

**Given** the Service Worker is registered
**When** a user visits TripFlow for the first time
**Then** critical assets are cached:
- HTML shell (index.html)
- CSS bundles
- JavaScript bundles
- App icons and images
**And** the caching strategy is:
- **Cache First** for static assets (CSS, JS, fonts, icons)
- **Network First** for API calls (with fallback to cache if offline)
- **Cache First** for photos (with background sync)
**When** a user revisits TripFlow
**Then** the app loads from the cache immediately (fast load)
**And** the Service Worker checks for updates in the background
**When** a new version of the app is deployed
**Then** the Service Worker is updated
**And** the user is prompted: "New version available. Refresh now?"
**And** clicking "Refresh" updates the app to the latest version

---

### Story 11.8: Background Sync for Failed Requests

As a **trip member**,
I want **failed requests to be retried automatically when I reconnect**,
So that **I don't lose data due to temporary network issues**.

**Acceptance Criteria:**

**Given** I am editing an activity while online
**When** my network connection drops during the save
**Then** the save request fails
**And** the request is queued for background sync
**And** I see a toast: "Network error. Changes will sync when online."
**When** my device reconnects to the internet
**Then** the Service Worker's Background Sync API retries the failed request
**And** the activity is saved successfully
**And** I see a toast: "Activity synced successfully"
**When** the retry also fails (e.g., server error)
**Then** the request is retried again with exponential backoff
**And** after 5 failed retries, I see an error: "Sync failed. Please try again manually."
**And** I can manually trigger sync from the sync status panel

---

### Story 11.9: Offline Budget Viewing (Privacy Preserved)

As a **trip member**,
I want **to view my own budget while offline**,
So that **I can reference my spending limits without internet**.

**Acceptance Criteria:**

**Given** I have previously viewed my budget while online
**When** I go offline and navigate to the budget page
**Then** I can view my own budget amount (cached in IndexedDB)
**And** my budget is stored encrypted in IndexedDB (never in plaintext)
**When** I view collective possibilities offline
**Then** I see the last cached aggregate values
**And** I see a warning: "Offline - showing last synced values from [timestamp]"
**And** I cannot update my budget while offline (encryption requires server)
**And** other members' budgets are NEVER cached (privacy enforcement)

---

### Story 11.10: Offline Expense Logging

As a **trip member**,
I want **to log expenses while offline**,
So that **I can track spending even without internet**.

**Acceptance Criteria:**

**Given** I am offline
**When** I create a new expense
**Then** the expense is saved to IndexedDB
**And** the expense is marked as "pending sync"
**And** I see: "Expense saved locally. Will sync when online."
**When** I reconnect
**Then** the expense is synced to Supabase automatically
**And** `expense_splits` are calculated server-side after sync
**And** settlements are recalculated
**And** all trip members see the new expense via Realtime
**When** I view expenses offline
**Then** I see all previously cached expenses
**And** newly created offline expenses appear with a sync icon
**And** I can edit offline expenses before they sync

---

### Story 11.11: Offline Photo Viewing

As a **trip member**,
I want **to view cached photos while offline**,
So that **I can see trip photos without internet**.

**Acceptance Criteria:**

**Given** I have previously viewed activity photos online
**When** I go offline and view an activity
**Then** I see cached photo thumbnails
**And** thumbnails are stored in the browser cache by the Service Worker
**When** I click a thumbnail to view full-size
**Then** I see the full-size photo if it was previously cached
**And** if the full-size photo is not cached, I see a placeholder: "Photo not available offline"
**When** I try to upload a new photo offline
**Then** the photo is saved to IndexedDB
**And** upload is queued for background sync
**And** when I reconnect, the photo is uploaded automatically
**And** photos are cached with a size limit (e.g., max 50MB total cache)

---

### Story 11.12: Offline Indicator and Connectivity Status

As a **trip member**,
I want **to see a clear indicator when I'm offline**,
So that **I understand why some features are unavailable**.

**Acceptance Criteria:**

**Given** my device is online
**When** I use TripFlow
**Then** I see a green connectivity indicator: "🟢 Online"
**And** the indicator is subtle and non-intrusive (top-right corner)
**When** my connection drops
**Then** I see an offline banner: "🔴 Offline - viewing cached data"
**And** the banner is prominent (top of the screen, orange/red background)
**And** the banner explains: "You can still view and edit. Changes will sync when online."
**When** I reconnect
**Then** the offline banner changes to: "🟢 Reconnected - syncing changes..."
**And** after sync completes, the banner shows: "✅ All changes synced"
**And** the banner auto-dismisses after 3 seconds
**And** connectivity status is monitored via `navigator.onLine` and periodic pings

---

## Epic 12: Advanced Collaboration & Permissions

Enable trip creators to assign roles, manage permissions, and generate public share links with privacy controls.

### Story 12.1: Assign Roles to Trip Members (Owner, Editor, Viewer)

As a **trip owner**,
I want **to assign roles to trip members**,
So that **I can control who can edit vs. who can only view the trip**.

**Acceptance Criteria:**

**Given** I am the trip owner
**When** I view the trip members page
**Then** I see each member's current role: Owner, Editor, Viewer
**When** I click on a member's role dropdown
**Then** I can change their role to:
- **Editor**: Can edit itinerary, add expenses, create votes
- **Viewer**: Can only view, cannot edit
**When** I change Alice from Editor to Viewer
**Then** the `trip_members.role` field is updated to 'viewer'
**And** Alice is notified: "Your role was changed to Viewer"
**And** Alice can no longer edit activities or add expenses (UI buttons are hidden)
**And** API requests from Alice to edit are rejected with 403 Forbidden
**And** RLS policies enforce role-based permissions
**When** I attempt to assign "Owner" role to another member
**Then** I see: "To transfer ownership, use the Transfer Ownership feature"
**And** only one owner is allowed per trip

---

### Story 12.2: Viewer Role Permissions (View Only)

As a **trip member with Viewer role**,
I want **to view all trip data without editing permissions**,
So that **I can stay informed without accidentally changing plans**.

**Acceptance Criteria:**

**Given** I am a trip member with Viewer role
**When** I view the trip itinerary
**Then** I see all activities, dates, and details
**And** I do NOT see "Add Activity", "Edit", or "Delete" buttons
**When** I view expenses
**Then** I see all expense details and settlements
**And** I do NOT see "Add Expense" or "Edit Expense" buttons
**When** I view votes
**Then** I can view active and past votes
**And** I can cast votes (voting is allowed for Viewers)
**And** I can view comments but cannot post new comments
**When** I view the budget page
**Then** I can set my own budget and view collective possibilities
**And** I cannot edit other members' roles or trip settings
**And** all edit actions return 403 Forbidden errors if attempted via API

---

### Story 12.3: Editor Role Permissions (Edit but Not Admin)

As a **trip member with Editor role**,
I want **to edit the itinerary and add expenses but not manage members**,
So that **I can contribute to planning without full admin control**.

**Acceptance Criteria:**

**Given** I am a trip member with Editor role
**When** I view the trip
**Then** I can:
- Add, edit, delete activities
- Add, edit, delete expenses
- Create and vote on votes
- Post comments
- Upload photos
- Set my own budget
**And** I CANNOT:
- Remove trip members (Owner only)
- Change member roles (Owner only)
- Delete the trip (Owner only)
- Transfer ownership (Owner only)
**When** I attempt to remove a member
**Then** I see: "Only the trip owner can remove members"
**And** the action is blocked
**And** RLS policies enforce these restrictions

---

### Story 12.4: Generate Public Share Link with Privacy Controls

As a **trip owner**,
I want **to generate a public share link for the trip**,
So that **I can share read-only access with people outside the trip**.

**Acceptance Criteria:**

**Given** I am the trip owner
**When** I click "Generate Public Link"
**Then** I see a public share link creation form with options:
- **Link Type**: View Only (default), View + Comment
- **Expiry Date**: 7 days, 30 days, Never
- **Password Protection**: Optional password
- **Hide Budgets**: Toggle (default: ON - budgets hidden)
- **Hide Votes**: Toggle (default: ON - votes hidden)
**When** I generate the link
**Then** a `public_links` record is created:
- `trip_id`, `token` (secure random string), `expires_at`, `password_hash`, `permissions` (JSON)
**And** I see the generated link: `https://tripflow.app/share/abc123xyz`
**And** I can copy the link or share it via email/SMS
**When** someone visits the public link
**Then** they see the trip itinerary (read-only)
**And** budgets and votes are hidden (if toggled)
**And** they do NOT need to log in or create an account
**And** they see: "Shared by [Owner Name]"

---

### Story 12.5: Access Public Share Link with Optional Password

As a **public link visitor**,
I want **to view a shared trip via public link**,
So that **I can see trip details without being a member**.

**Acceptance Criteria:**

**Given** I have a public share link
**When** I visit the link
**Then** I see the trip name and destination
**When** the link is password-protected
**Then** I see a password prompt: "This trip is password-protected. Enter password:"
**When** I enter the correct password
**Then** I am granted access to the trip
**And** the password is validated against `public_links.password_hash`
**When** I enter an incorrect password
**Then** I see: "Incorrect password. Try again."
**And** after 5 failed attempts, access is rate-limited (1-hour lockout)
**When** the link has expired
**Then** I see: "This link has expired. Request a new link from the trip owner."
**And** access is denied
**When** I have access
**Then** I see the itinerary in read-only mode
**And** I cannot add, edit, or delete anything
**And** budgets and votes are hidden (if configured)

---

### Story 12.6: Revoke or Extend Public Share Links

As a **trip owner**,
I want **to revoke or extend the expiry of public share links**,
So that **I can control access over time**.

**Acceptance Criteria:**

**Given** I have created a public share link
**When** I view the "Shared Links" management page
**Then** I see a list of all active public links with:
- Link URL
- Created date
- Expiry date
- Views count
- "Revoke" button
- "Extend Expiry" button
**When** I click "Revoke"
**Then** I see a confirmation: "Revoke this link? It will stop working immediately."
**When** I confirm
**Then** the `public_links.revoked_at` field is set to now
**And** the link becomes invalid
**And** visitors see: "This link has been revoked"
**When** I click "Extend Expiry"
**Then** I can set a new expiry date
**And** the `public_links.expires_at` field is updated
**And** the link remains valid until the new expiry date
**And** I can see analytics: "This link was viewed 42 times"

---

## Epic 13: Calendar Integration & Export

Enable users to import/export trip data in multiple formats and sync with external calendars bidirectionally.

### Story 13.1: Import Trip from CSV or Google Sheets

As a **trip creator**,
I want **to import a trip itinerary from a CSV file or Google Sheets**,
So that **I can quickly populate the trip without manual entry**.

**Acceptance Criteria:**

**Given** I am on the trip creation page
**When** I click "Import from CSV"
**Then** I see a file picker to select a CSV file
**And** the CSV format is documented:
- Columns: Day, Activity Name, Category, Time, Duration, Cost, Location, Notes
**When** I upload a valid CSV file
**Then** the system parses the CSV and creates activities for each row
**And** I see a preview: "Found 30 activities. Review before importing."
**When** I review and confirm
**Then** 30 `activities` records are created in the database
**And** activities are assigned to the correct days
**And** I am redirected to the trip itinerary
**When** the CSV has invalid data (missing required fields)
**Then** I see validation errors: "Row 5: Activity name is required"
**And** I can fix errors and re-upload
**When** I import from Google Sheets
**Then** I can paste a Google Sheets URL or share link
**And** the system fetches the sheet data via Google Sheets API
**And** the import process is the same as CSV

---

### Story 13.2: Export Itinerary to iCal Format

As a **trip member**,
I want **to export the trip itinerary to iCal format (.ics)**,
So that **I can import it into my calendar app (Google Calendar, Apple Calendar)**.

**Acceptance Criteria:**

**Given** I am viewing the trip itinerary
**When** I click "Export to iCal"
**Then** an .ics file is generated with all activities as calendar events
**And** each event includes:
- Title: Activity name
- Start time: Activity time slot
- Duration: Estimated duration
- Location: Activity location (if available)
- Description: Activity notes
**When** I download the .ics file
**Then** the file is named: `trip-itinerary-2026-08-27.ics`
**When** I import the .ics file into Google Calendar
**Then** all activities appear as calendar events
**And** events are editable in the calendar app (but not synced back to TripFlow)
**And** I can re-export at any time to get updated events

---

### Story 13.3: Export Itinerary to PDF

As a **trip member**,
I want **to export the trip itinerary as a PDF**,
So that **I can print it or share it offline**.

**Acceptance Criteria:**

**Given** I am viewing the trip itinerary
**When** I click "Export to PDF"
**Then** a formatted PDF is generated with:
- Trip name and destination
- Date range
- All activities organized by day
- Activity details (time, location, cost, notes)
- Maps showing activity locations (optional)
**And** the PDF is styled professionally (logo, colors, fonts)
**When** I download the PDF
**Then** the file is named: `trip-itinerary-2026-08-27.pdf`
**And** I can select which days to include in the PDF
**And** I can toggle: "Include estimated costs", "Include maps"
**And** the PDF is printer-friendly (A4 or Letter size)

---

### Story 13.4: Sync Trip Activities to Google Calendar (Bidirectional)

As a **trip member**,
I want **to sync trip activities to my Google Calendar automatically**,
So that **trip plans appear in my calendar without manual export**.

**Acceptance Criteria:**

**Given** I am on the calendar integration settings page
**When** I click "Connect Google Calendar"
**Then** I am redirected to Google OAuth consent screen
**When** I grant permission
**Then** TripFlow receives a Google Calendar API access token
**And** the token is stored securely in the database
**When** I enable "Sync to Google Calendar"
**Then** all trip activities are created as Google Calendar events
**And** events are created in a dedicated calendar: "TripFlow - [Trip Name]"
**When** I add a new activity in TripFlow
**Then** the activity is automatically added to Google Calendar within 60 seconds
**When** I edit an activity in TripFlow
**Then** the corresponding Google Calendar event is updated
**When** I delete an activity in TripFlow
**Then** the Google Calendar event is deleted
**And** bidirectional sync is supported (changes in Google Calendar sync back to TripFlow)

---

### Story 13.5: Sync Trip Activities to Apple Calendar (iCloud)

As a **trip member using Apple Calendar**,
I want **to sync trip activities to Apple Calendar (iCloud)**,
So that **trip plans appear on my iPhone, iPad, and Mac**.

**Acceptance Criteria:**

**Given** I am on the calendar integration settings page
**When** I click "Connect Apple Calendar"
**Then** I am redirected to Apple OAuth (Sign in with Apple)
**When** I grant permission
**Then** TripFlow receives iCloud Calendar API access
**And** the access token is stored securely
**When** I enable "Sync to Apple Calendar"
**Then** all trip activities are created as iCloud calendar events
**And** events appear in a dedicated calendar: "TripFlow - [Trip Name]"
**And** sync behavior is the same as Google Calendar (bidirectional)
**When** I edit an event in Apple Calendar
**Then** the change syncs back to TripFlow within 60 seconds
**And** conflicts are detected and resolved (see Story 11.4)
**And** I can disconnect the sync at any time

---

### Story 13.6: Handle Calendar Sync Conflicts

As a **trip member with calendar sync enabled**,
I want **conflicts between TripFlow and my calendar to be resolved**,
So that **changes aren't lost when I edit in both places**.

**Acceptance Criteria:**

**Given** I have calendar sync enabled
**When** I edit an activity in TripFlow (change time from 10:00 to 11:00)
**Then** the change is synced to my calendar within 60 seconds
**When** I also edit the same event in my calendar (change location)
**Then** a conflict is detected (both sides modified)
**And** TripFlow fetches the calendar event and compares changes
**When** changes are to different fields (TripFlow: time, Calendar: location)
**Then** both changes are merged automatically
**And** the activity is updated with time 11:00 + new location
**When** changes are to the same field (both changed time)
**Then** I see a conflict resolution UI (see Story 11.4)
**And** I choose which change to keep
**And** conflict resolution happens in the background with notifications

---

### Story 13.7: Manage Calendar Sync Preferences

As a **trip member**,
I want **to configure which trips and activities sync to my calendar**,
So that **I can control calendar clutter**.

**Acceptance Criteria:**

**Given** I am on the calendar sync settings page
**When** I view my sync preferences
**Then** I see options:
- **Sync All Trips**: Sync all my trips to calendar
- **Sync Selected Trips**: Choose specific trips to sync
- **Sync Activity Types**: Select which categories to sync (Food, Transport, etc.)
**When** I select "Sync Selected Trips"
**Then** I see a list of my trips with checkboxes
**And** I can enable/disable sync per trip
**When** I disable sync for a trip
**Then** all calendar events for that trip are deleted from my calendar
**When** I select "Sync Activity Types"
**Then** I can exclude certain categories (e.g., only sync "Activities", not "Food")
**And** only matching activities are synced
**And** I can set sync frequency: Real-time, Hourly, Daily
**And** I can disconnect calendar sync entirely (revokes OAuth tokens)

---

## Epic 14: Notifications & Engagement

Enable users to receive timely notifications for trip events with customizable preferences and notification history.

### Story 14.1: Email Notifications for Trip Invitations

As a **user**,
I want **to receive email notifications when invited to trips**,
So that **I don't miss invitations**.

**Acceptance Criteria:**

**Given** I am invited to a trip
**When** the invitation is created
**Then** I receive an email with:
- Subject: "[Inviter Name] invited you to [Trip Name]"
- Trip name and destination
- Trip dates
- Inviter's name and message (if provided)
- "Accept Invitation" button (links to TripFlow)
**And** the email is sent via Supabase Auth or a transactional email service (e.g., SendGrid)
**When** I click "Accept Invitation"
**Then** I am redirected to TripFlow to accept the invite (see Story 2.5)
**And** email includes a "View Details" link if I'm already logged in
**And** unsubscribe link is included (GDPR compliance)

---

### Story 14.2: In-App Notifications for Votes and Results

As a **trip member**,
I want **to receive in-app notifications when votes are created or results are revealed**,
So that **I can participate in decisions**.

**Acceptance Criteria:**

**Given** another trip member creates a vote
**When** the vote is saved
**Then** I receive an in-app notification: "[Alice] created a vote: Should we visit Suzhou?"
**And** the notification appears in the notification center (bell icon in header)
**And** a red badge shows unread count: "3"
**When** I click the notification
**Then** I am navigated to the vote page
**And** the notification is marked as read
**When** a vote I participated in closes
**Then** I receive a notification: "Vote results: Should we visit Suzhou? - Yes (4 votes)"
**And** the notification links to the vote results
**And** notifications are stored in the `notifications` table
**And** Supabase Realtime broadcasts new notifications in real-time

---

### Story 14.3: Vote Deadline Reminders

As a **trip member**,
I want **to receive reminders before vote deadlines**,
So that **I don't miss voting on important decisions**.

**Acceptance Criteria:**

**Given** a vote has a deadline set
**When** the deadline is 24 hours away and I haven't voted
**Then** I receive a reminder notification:
- In-app: "[Vote] closes in 24 hours. Vote now!"
- Email: "Reminder: Vote on [Question] by [Deadline]"
**When** the deadline is 1 hour away and I still haven't voted
**Then** I receive a final reminder:
- In-app: "Last chance! Vote closes in 1 hour."
- Push notification (if PWA installed)
**When** I vote before the deadline
**Then** reminder notifications stop for that vote
**And** reminders respect user notification preferences
**And** I can snooze reminders for 1 hour

---

### Story 14.4: View Notification History

As a **trip member**,
I want **to view all my past notifications**,
So that **I can review what I might have missed**.

**Acceptance Criteria:**

**Given** I am on the notification center page
**When** I view my notifications
**Then** I see a chronological list of all notifications:
- Type (invitation, vote, expense, activity change)
- Message (e.g., "Alice added Tokyo Tower to the itinerary")
- Timestamp (e.g., "2 hours ago")
- Read/Unread status
**When** I click on a notification
**Then** I am navigated to the relevant page (trip, vote, activity)
**And** the notification is marked as read
**When** I filter by type
**Then** I see only notifications of that type (e.g., "Votes only")
**And** I can mark all notifications as read with one click
**And** notifications older than 30 days are archived (still accessible)
**And** I can delete individual notifications

---

### Story 14.5: Mark Notifications as Read/Unread

As a **trip member**,
I want **to mark notifications as read or unread**,
So that **I can manage my notification list**.

**Acceptance Criteria:**

**Given** I am viewing the notification center
**When** I click on a notification
**Then** it is automatically marked as read
**And** the `notifications.read_at` timestamp is set
**When** I click "Mark as Unread"
**Then** the `notifications.read_at` field is set to NULL
**And** the notification appears as unread (bold text, blue dot)
**When** I click "Mark All as Read"
**Then** all unread notifications are marked as read
**And** the unread badge count is reset to 0
**And** I can batch-select notifications and mark multiple as read/unread
**And** keyboard shortcuts: "R" to mark as read, "U" to mark as unread

---

### Story 14.6: Configure Notification Batching (Real-Time vs Daily Digest)

As a **trip member**,
I want **to configure how often I receive notifications**,
So that **I can avoid notification fatigue**.

**Acceptance Criteria:**

**Given** I am on the notification settings page
**When** I view notification preferences
**Then** I see batching options:
- **Real-Time**: Receive notifications immediately (default)
- **Hourly Digest**: Receive a summary email every hour
- **Daily Digest**: Receive a summary email once per day at 8:00 AM
**When** I select "Daily Digest"
**Then** my preference is saved: `users.notification_frequency = 'daily'`
**And** I no longer receive individual notification emails
**When** 8:00 AM arrives
**Then** I receive a digest email: "Your Daily TripFlow Summary - 5 new notifications"
**And** the email lists all notifications from the past 24 hours
**And** I can still see real-time in-app notifications regardless of email batching
**And** critical notifications (invitations, urgent votes) are sent immediately even with batching enabled

---

## Epic 15: Post-Trip Closure & Retention

Enable trip creators to mark trips complete, generate post-trip summaries, and clone trips for future use with template sharing.

### Story 15.1: Mark Trip as Complete

As a **trip owner**,
I want **to mark a trip as complete after it ends**,
So that **it moves to my completed trips and triggers final summaries**.

**Acceptance Criteria:**

**Given** I am the trip owner and the trip end date has passed
**When** I view the trip settings
**Then** I see a "Mark as Complete" button
**When** I click "Mark as Complete"
**Then** I see a confirmation: "Mark this trip as complete? Final summaries will be generated."
**When** I confirm
**Then** the `trips.completed_at` field is set to the current timestamp
**And** the trip status changes to "Completed"
**And** the trip moves to the "Completed Trips" section in the dashboard
**And** all trip members are notified: "[Trip Name] has been marked complete"
**And** a post-trip summary is automatically generated (see Story 15.2)
**And** the trip remains viewable but editing is disabled by default
**And** I can "Reopen" the trip if needed (sets `completed_at` to NULL)

---

### Story 15.2: Generate Post-Trip Summary

As a **trip owner**,
I want **to view a comprehensive post-trip summary**,
So that **I can review the trip's highlights, spending, and voting results**.

**Acceptance Criteria:**

**Given** I have marked the trip as complete
**When** the post-trip summary is generated
**Then** I see a summary page with sections:
- **Trip Overview**: Dates, destination, member count
- **Budget vs Actual**: Planned budget vs actual spending (with variance %)
- **Spending Breakdown**: Pie chart by category (Food: $450, Transport: $300, etc.)
- **Top Activities**: Most-voted or highest-rated activities
- **Photo Highlights**: Grid of all trip photos (downloadable as ZIP)
- **Voting Results**: Summary of all votes and winning options
- **Member Contributions**: Who paid the most, who organized the most activities
**And** the summary is beautifully formatted with charts and images
**When** I click "Download Summary"
**Then** the summary is exported as a PDF: `trip-summary-2026-08-27.pdf`
**And** I can share the summary with trip members via email
**And** the summary includes a "Trip Stats" section: "30 activities, 50 expenses, 12 votes"

---

### Story 15.3: Clone Past Trip for Reuse

As a **trip creator**,
I want **to clone a past trip to reuse its itinerary**,
So that **I can recreate similar trips quickly**.

**Acceptance Criteria:**

**Given** I am viewing a completed trip
**When** I click "Clone Trip"
**Then** I see a clone confirmation: "Create a new trip based on this itinerary?"
**When** I confirm
**Then** a new trip is created with:
- Same trip name + " (Copy)"
- Empty dates (I can set new dates)
- All activities copied (but with cleared dates initially)
- No expenses copied (fresh expense tracking)
- No votes copied (fresh decision-making)
- Same member list (optional: I can choose to copy members or start fresh)
**And** I am redirected to the new trip's edit page
**When** I set new trip dates
**Then** activities are automatically distributed across the new date range (proportionally)
**And** I can adjust activities as needed
**And** cloned trip has no connection to the original (independent)

---

### Story 15.4: Save Trip as Reusable Template

As a **trip owner**,
I want **to save my trip as a reusable template**,
So that **I or others can use it as a starting point for similar trips**.

**Acceptance Criteria:**

**Given** I am viewing a trip (completed or active)
**When** I click "Save as Template"
**Then** I see a template creation form:
- Template name (e.g., "Tokyo 7-Day Adventure Template")
- Description (what the template includes)
- Visibility: Private (only me), Trip Members, Public (community)
**When** I save the template
**Then** a `trip_templates` record is created:
- `name`, `description`, `visibility`, `created_by`, `trip_id` (source trip)
**And** the template includes:
- Full itinerary (all activities)
- Budget structure (categories, not amounts)
- Trip settings (roles, permissions)
- Packing lists (if implemented)
**When** I create a new trip
**Then** I see an option: "Start from Template"
**And** I can browse my templates or public templates
**When** I select a template
**Then** a new trip is created with the template's itinerary pre-filled
**And** I can customize dates, members, and activities

---

### Story 15.5: Share Trip Templates with Community

As a **trip creator**,
I want **to share my trip template with the TripFlow community**,
So that **others can benefit from my planning**.

**Acceptance Criteria:**

**Given** I have created a trip template
**When** I set visibility to "Public"
**Then** the template appears in the "Community Templates" gallery
**And** other users can browse and use the template
**When** another user views my public template
**Then** they see:
- Template name and description
- Preview of the itinerary
- Number of activities, estimated budget, trip duration
- Creator's name (optional: can be anonymous)
- "Use This Template" button
**When** they click "Use This Template"
**Then** they create a new trip based on the template
**And** I receive a notification: "Your template was used by [User]" (optional)
**And** templates can be rated/reviewed by users (5-star rating)
**And** popular templates appear in "Featured Templates" section
**And** I can unpublish my template at any time

---

### Story 15.6: Post-Trip Photo Album and Sharing

As a **trip member**,
I want **to view all trip photos in a dedicated album**,
So that **I can relive memories and share with others**.

**Acceptance Criteria:**

**Given** the trip has been marked as complete
**When** I view the post-trip summary
**Then** I see a "Photo Album" section with all uploaded photos
**And** photos are organized by day or activity
**And** I can view photos in a lightbox slideshow
**When** I click "Download All Photos"
**Then** all photos are packaged into a ZIP file and downloaded
**And** the ZIP preserves folder structure (organized by day)
**When** I click "Share Album"
**Then** I can generate a public link to the photo album
**And** the link opens a beautiful photo gallery (no login required)
**And** I can set album privacy: Private, Members Only, Public
**And** I can add captions to photos in the album
**And** the album can be embedded on other websites (iframe)

---
