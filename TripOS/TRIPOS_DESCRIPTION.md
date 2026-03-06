# TripOS — Collaborative Group Trip Planning Platform

## Description

**TripOS** is a collaborative web platform designed to solve the chaos of group trip planning. It replaces endless spreadsheets, WhatsApp threads, and vague "let's meet at 6" messages with a structured, democratic workspace where everyone participates fairly, no one feels excluded, and decisions actually get made.

### The Core Problem It Solves

Group trips typically fail due to three friction points:

1. **Budget Anxiety** — The "how much can you spend?" conversation that makes people uncomfortable. TripOS solves this with **blind budgeting**: each member sets a private cap, the system calculates the group maximum, and nobody sees individual amounts.

2. **Decision Paralysis** — Endless "where should we eat?" loops that kill momentum. TripOS solves this with **structured voting**: multiple voting methods (yes/no, ranked choice, approval voting), deadlines, quorum requirements, and clear results.

3. **Collaboration Chaos** — Scattered info across messages, notes, and memory. TripOS solves this with a **shared workspace**: itinerary, voting, budgets, expenses, and members — all in one place with real-time sync.

---

## Key Capabilities

### 1. Identity & Access
- Email/password registration with secure authentication
- OAuth and magic link (passwordless) login options
- Password reset flow with security best practices
- Profile management with account deletion (GDPR-compliant)

### 2. Trip Management
- Create trips with name, dates, destination, and cover image
- Personal dashboard showing all trips with filtering and search
- Edit trip details after creation
- Archive or delete trips (owner-only)
- Public trip sharing for itinerary viewing

### 3. Team Building — Members & Roles
- Invite members via email or shareable link
- 4-tier permission system: **Owner > Organizer > Member > Guest**
- Role management and promotion
- Member removal and voluntary departure
- Trip ownership transfer

### 4. Collaborative Itinerary Planning
- Day-by-day timeline view
- Create, edit, and delete activities with time, location, notes, and estimated cost
- Drag-and-drop reordering within and between days
- Google Maps integration for location search and autocomplete
- Interactive map view with activity markers and route lines
- Booking status and attendee tracking
- Activity categories and search/filtering

### 5. Democratic Decision Making
- **4 voting methods**: Yes/No, Ranked Choice, Approval Voting, Veto Voting
- Deadline enforcement with countdown timers
- Quorum requirements (minimum votes for validity)
- Real-time vote updates and progress tracking
- Poll results visualization with tiebreaker support
- Anonymous voting with privacy indicators
- Decision history and audit trail

### 6. Financial Privacy — Blind Budgeting
- **Private budget caps** visible only to the user who set them
- Server-side group ceiling calculation (MIN of all caps)
- Individual values NEVER appear in API responses, logs, or client bundles
- Row-Level Security (RLS) enforced at database level
- Educational explainer for first-time users
- Automatic activity filtering by group budget
- Budget indicators on activities (within range, near limit, above)

### 7. Shared Expenses & Settlement
- Expense logging with amount, category, description, and payers
- Split expenses among selected members
- Multi-currency support with automatic conversion
- Expense summary by category
- Settlement summary showing who owes whom

### 8. Live Collaboration
- Real-time data synchronization via Supabase Realtime
- Activity feed with event timeline
- Presence indicators (online/away/offline)
- Offline queue with sync on reconnection

### 9. Notifications & Tasks
- In-app notification center
- Email notifications via Resend
- Notification preferences and quiet hours
- Task creation, assignment, and tracking
- Checklist templates for recurring tasks

### 10. Personalization
- Dark mode and theme switching
- Granular notification controls
- Currency and language preferences
- Per-trip notification mute

### 11. Export & Offline
- PDF itinerary export
- Calendar and CSV export
- PWA installation for offline access

---

## Design Philosophy

TripOS combines the aesthetic sensibilities of **Stripe** x **Airbnb** x **Linear**:

- **Semantic color exclusivity**: teal = privacy/budget, purple = voting, indigo = primary actions, amber = CTAs
- **Privacy-first architecture**: sensitive data stays in Server Components
- **Optimistic UI with rollback**: instant feedback, graceful failure recovery
- **Empty states are educational**: always suggest the next action
- **Progressive disclosure**: simple by default, advanced when needed
