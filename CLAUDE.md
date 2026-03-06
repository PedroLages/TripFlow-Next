# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repo contains two distinct areas:

1. **Asia Trip Planning** (`docs/`) -- A 22-night trip (Aug 27 - Sep 18, 2026) across 6 cities: Shanghai, Hong Kong, Osaka, Kyoto, Tokyo, and Beijing. All trip content is in Markdown files.
2. **TripOS Web App** (`TripOS/`) -- A collaborative group trip planning platform (Next.js 16 + Supabase monorepo). All app documentation, architecture, design, and code live in `TripOS/`.

---

## Document Boundary Rules

**⚠️ CRITICAL: These two documentation areas must NEVER be mixed.**

| Folder | Purpose | What goes here |
|---|---|---|
| `docs/` | Trip planning only | Itineraries, research, budgets, bookings, packing, maps |
| `TripOS/docs/` | App development docs | Architecture, design, epics, stories, specs, research, BMAD output |

**Rules:**
- **NEVER** place app/software documentation in `docs/`. That folder is exclusively for trip planning.
- **NEVER** place trip planning content in `TripOS/docs/`.
- **Legacy:** `tripflow-next/` is the old app structure being phased out. All new work goes in `TripOS/`.
- Every new `.md` file must go into an appropriate **subfolder** — never loose at the top level of either docs directory (except index/overview files).
- If no suitable subfolder exists, create one with a clear, descriptive name.

---

## Trip Planning Docs (`docs/`)

### File Structure

```text
docs/
  00-MASTER-ITINERARY.md    -- Trip overview, transport, checklists, weather
  01-DAY-BY-DAY-PLANNER.md  -- All 23 days with timed activities, costs, bookings
  02-BUDGET-TRACKER.md      -- Three-tier budget, per-city breakdowns, expense log
  bookings/
    *.pdf                   -- Flight/hotel/activity booking confirmations
  tracking/
    expense-tracker.csv     -- Main spending tracker (import to Google Sheets)
    booking-tracker.csv     -- What's booked vs estimated
    daily-log-template.csv  -- Daily journal template
    README.md               -- How to use tracking files
  research/
    01-shanghai-research.md  -- Aug 27-30
    01a-suzhou-research.md   -- Day trip from Shanghai
    02-hong-kong-research.md -- Aug 30 - Sep 2
    03-osaka-research.md     -- Sep 2-5
    04-kyoto-research.md     -- Sep 5-9
    05-tokyo-research.md     -- Sep 9-15
    06-beijing-research.md   -- Sep 15-18
    07-accommodation-research.md -- Cross-city lodging strategy, booking tips, unique stays
    08-hotel-recommendations.md -- Specific hotel properties by tier for all 6 cities
    09-booking-timeline.md   -- Chronological booking checklist: what to book and when
    10-transport-booking-guide.md -- Complete guide to all inter-city transport
    11-food-guide.md         -- Where to eat: must-try dishes, restaurants, food markets, hidden gems
    12-phrases-cheat-sheet.md -- Useful phrases in Mandarin, Cantonese, and Japanese
    13-shopping-guide.md     -- What to buy: markets, crafts, souvenirs, tax-free, haggling, shipping
    14-photography-guide.md  -- Best photo spots by city: iconic, golden hour, hidden gems, night
    15-booking-action-plan.md -- Actionable booking steps
    16-apps-digital-prep.md  -- Apps and digital preparation
  maps/
    01-shanghai-routes.md    -- Walking/transit routes
    01a-suzhou-routes.md
    02-hong-kong-routes.md
    03-osaka-routes.md
    04-kyoto-routes.md
    05-tokyo-routes.md
    06-beijing-routes.md
  packing/
    packing-list.md          -- Comprehensive checklist
```

### Trip Docs Organization Rules

- **Planning docs** (numbered `00-`, `01-`, `02-`) go directly in `docs/`.
- **Research files** go in `docs/research/`. Prefix with trip-order number.
- **New categories** get their own subfolder under `docs/` (e.g., `bookings/`, `packing/`, `maps/`).
- **Naming convention**: kebab-case, lowercase, no spaces or underscores. Number prefixes for ordering.
- When creating a new research file, add a cross-reference link in the master itinerary and update this file structure tree.

### How Trip Documents Relate

The **master itinerary** is the top-level summary. The **day-by-day planner** pulls specific activities and costs from the 6 research files. The **budget tracker** consolidates all cost estimates from both the planner and research files into trackable tables. When updating costs or activities in one file, check the others for consistency.

---

## TripOS Web App (`TripOS/`)

### Primary References

**⚠️ IMPORTANT: For all TripOS development, refer to the comprehensive documentation in `TripOS/`:**

- **[TripOS/CLAUDE.md](TripOS/CLAUDE.md)** - Primary developer guide (non-negotiable rules, commands, patterns)
- **[TripOS/README.md](TripOS/README.md)** - Complete project overview, architecture, folder structure
- **[TripOS/docs/](TripOS/docs/)** - All app documentation (architecture, design, epics, stories, research)

### Quick Reference Structure

```text
TripOS/
├── CLAUDE.md                   -- Primary developer guide (READ FIRST)
├── README.md                   -- Complete project overview
├── TRIPOS_DESCRIPTION.md       -- Product overview
│
├── apps/web/                   -- Next.js 16 web application
│   ├── src/app/                -- Route groups: (marketing), (auth), (app), (public)
│   ├── src/features/           -- Feature modules (trips, voting, budget, etc.)
│   └── e2e/                    -- Playwright E2E tests
│
├── packages/
│   ├── types/                  -- @repo/types (Supabase DB types)
│   ├── schemas/                -- @repo/schemas (Zod validation)
│   └── tsconfig/               -- @repo/tsconfig (shared TS configs)
│
├── supabase/
│   ├── migrations/             -- 29+ SQL migrations
│   └── functions/              -- Edge Functions (Deno)
│
├── docs/
│   ├── architecture/           -- Technical architecture
│   ├── design/                 -- Design system, UX specs, wireframes
│   ├── stories/                -- 98 user stories across 13 epics
│   ├── strategy/               -- Deep dives (blind budgeting, voting, RBAC)
│   ├── research/               -- 40+ technology research reports
│   └── database/               -- Schema, migrations, RLS policies
│
└── wireframes-TripOS/          -- 51 wireframe screens (desktop + mobile)
```

### Development Commands (from TripOS/)

```bash
pnpm dev                    # Start Next.js with Turbopack
pnpm build                  # Production build
pnpm lint                   # ESLint
pnpm typecheck              # TypeScript check
pnpm test                   # Vitest unit tests
pnpm test:e2e               # Playwright E2E tests

pnpm db:start               # Start local Supabase (Docker)
pnpm db:reset               # Reset DB + re-run migrations
pnpm db:types               # Regenerate TypeScript types from schema
```

### Non-Negotiable Rules (from TripOS/CLAUDE.md)

1. **Blind budgeting privacy:** Individual budget values NEVER appear in client bundles/API/logs
2. **RLS enforced on ALL tables:** Never bypass via service_role key in client code
3. **Semantic colors are exclusive:** teal = privacy/budget, purple = voting, indigo = primary, amber = CTAs
4. **Server Components by default:** Add `'use client'` only when needed
5. **Design tokens only:** Use CSS variables from `TripOS/docs/design/style-guide.md`
6. **React Query for all async state:** Zustand only for UI state (modals, sidebars)
7. **Zod 3.x required:** Zod 4 breaks with Turbopack
8. **useWatch() not watch():** React 19 compatibility

### App Docs Organization Rules

- **All app documentation goes in `TripOS/docs/`** with appropriate subfolders
- **Naming convention:** kebab-case, lowercase, no spaces or underscores
- **BMAD output:** Stories go in `docs/stories/`, architecture in `docs/architecture/`, design in `docs/design/`
- After creating any new doc, check if `TripOS/README.md` or `TripOS/docs/index.md` needs updating

### Legacy Code

- **`tripflow-next/`** is the old app structure being phased out
- All new development, documentation, and features go in `TripOS/`
- Do not add new files to `tripflow-next/` unless explicitly instructed

## Key Data Points

- Currency rates: $1 USD = ~7.2 CNY | ~7.8 HKD | ~150 JPY | €1 EUR ≈ $1.09 USD
- Trip route: Shanghai (3N) -> Hong Kong (3N) -> Osaka (3N) -> Kyoto (4N) -> Tokyo (6N) -> Beijing (3N)
- Research was compiled February 2026; prices and policies should be re-verified closer to travel dates

---

## Expense & Booking Tracking Rules

**⚠️ CRITICAL: Whenever adding expenses or bookings, update BOTH:**

1. **docs/02-BUDGET-TRACKER.md** - Markdown budget tracker
   - Add to "Additional / Companion Travel Costs" table for home flights
   - Add to "Booking Tracker" table with booking date
   - Update "Booking Progress" percentages

2. **docs/tracking/expense-tracker.csv** - CSV spreadsheet
   - Add new row with all details (date, city, category, costs)
   - Update status (🔲 Not Started / ✅ Booked)
   - Add booking reference if applicable

3. **docs/bookings/** folder
   - Copy PDF confirmations with descriptive filename
   - Use format: `{traveler}-{route}-{provider}.pdf`
   - Example: `pedro-ams-shanghai-beijing-ams-klm.pdf`

**Files are kept in sync:**
- Markdown = permanent documentation & planning
- CSV = active tracking during trip (Google Sheets)
- PDFs = proof of purchase

---

## TripOS Development Standards

**⚠️ CRITICAL: All TripOS code follows comprehensive standards defined in the TripOS documentation.**

### Primary Standards Reference

**[TripOS/CLAUDE.md](TripOS/CLAUDE.md)** contains all development standards, including:
- Non-negotiable rules (blind budgeting privacy, RLS, semantic colors, etc.)
- Tech stack and version constraints (Zod 3.x, React 19 patterns, etc.)
- Project structure and feature module patterns
- Testing conventions (Vitest + Playwright)
- Commands and workflows

### Design System Reference

**[TripOS/docs/design/style-guide.md](TripOS/docs/design/style-guide.md)** contains:
- 28 design tokens (CSS variables)
- Color palette (semantic colors: teal=privacy, purple=voting, etc.)
- Typography, spacing, component library
- Responsive design standards (390px mobile, 1440px desktop)
- WCAG 2.1 AA accessibility requirements

### Key Standards Summary

**Privacy & Security:**
- Individual budget values NEVER in client code/bundles/logs
- RLS enforced on ALL database tables
- Server Components by default; `'use client'` only when necessary

**Code Quality:**
- TypeScript strict mode
- React Query for server state, Zustand for UI state only
- shadcn/ui components (no reimplementation)
- Design tokens only (no hardcoded colors)
- Tests co-located with source files

**Version Requirements:**
- Zod 3.x (Zod 4 breaks with Turbopack)
- React Hook Form: use `useWatch()` not `watch()`
- React Query v5: use `isPending` not `isLoading`

### When Working on TripOS

1. **Always `cd TripOS/` first** before running commands
2. **Read [TripOS/CLAUDE.md](TripOS/CLAUDE.md)** for comprehensive developer guide
3. **Check [TripOS/README.md](TripOS/README.md)** for project overview and architecture
4. **Reference [TripOS/docs/design/style-guide.md](TripOS/docs/design/style-guide.md)** when building UI
5. **Use pnpm** (not npm/yarn) for all package management

### Legacy Note

**`tripflow-next/`** contains the old app structure. Do not reference its documentation or add new code there. All TripOS standards supersede any tripflow-next conventions.
