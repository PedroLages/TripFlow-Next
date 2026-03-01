# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repo contains two distinct areas:

1. **Asia Trip Planning** (`docs/`) -- A 22-night trip (Aug 27 - Sep 18, 2026) across 6 cities: Shanghai, Hong Kong, Osaka, Kyoto, Tokyo, and Beijing. All trip content is in Markdown files.
2. **TripFlow Web App** (`tripflow-next/`) -- A Next.js travel planning app. Software docs, BMAD output, and design documents live inside `tripflow-next/docs/`.

---

## Document Boundary Rules

**⚠️ CRITICAL: These two documentation areas must NEVER be mixed.**

| Folder | Purpose | What goes here |
|---|---|---|
| `docs/` | Trip planning only | Itineraries, research, budgets, bookings, packing, maps |
| `tripflow-next/docs/` | App development docs | PRDs, architecture, epics, stories, specs, plans, design, BMAD output |

**Rules:**
- **NEVER** place app/software documentation in `docs/`. That folder is exclusively for trip planning.
- **NEVER** place trip planning content in `tripflow-next/docs/`.
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

## TripFlow Web App Docs (`tripflow-next/docs/`)

### File Structure

```text
tripflow-next/docs/
  TRIPFLOW-OVERVIEW.md       -- App overview and vision
  specs/                     -- Feature specifications, requirements
    app-features-specification.md
  plans/                     -- Implementation plans, design decisions
    dashboard-improvement-plan.md
    2026-02-24-blind-budgeting-implementation.md
    2026-02-24-nextjs-blind-budgeting-implementation.md
    2026-02-24-tripos-feature-integration-design.md
    2026-02-25-tripos-to-tripflow-analysis.md
  architecture/              -- System architecture, technical decisions
  epics/                     -- BMAD epics
  stories/                   -- BMAD user stories
  research/                  -- Technical research, library evaluations
  design/                    -- UX/UI design docs, wireframes
```

### App Docs Organization Rules

- **Every new doc must go in a subfolder** — pick the most appropriate one from the structure above.
- If a doc doesn't fit any existing subfolder, **create a new one** with a descriptive kebab-case name.
- **Naming convention**: kebab-case, lowercase. Date-prefix for time-sensitive docs (e.g., `2026-02-24-feature-design.md`).
- **BMAD output**: PRDs go in `specs/`, architecture docs in `architecture/`, epics in `epics/`, stories in `stories/`.
- After creating any new doc, check if `TRIPFLOW-OVERVIEW.md` or a relevant index needs updating.

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

## TripFlow Development Standards

**⚠️ CRITICAL: All TripFlow code MUST follow the comprehensive style guide.**

### Style Guide Location

**Primary Reference:** `tripflow-next/docs/TRIPFLOW-STYLE-GUIDE.md`

This 38-section guide covers:
- Design system (colors, typography, spacing, components)
- Code standards (TypeScript, React, testing, performance)
- Accessibility (WCAG 2.1 AA compliance)
- Cross-functional collaboration

### Mandatory Requirements

**Before Writing ANY Code:**

1. **Read the relevant style guide sections** for your task:
   - New component? → Read [Component Library](#iii-component-library) sections
   - Styling changes? → Read [Styling Conventions](#23-styling-conventions)
   - New feature? → Read [Component API Patterns](#12-component-api-patterns)

2. **Use the Component Checklist** (Section 37):
   - [ ] TypeScript with strict types
   - [ ] Follows shadcn/ui composable pattern
   - [ ] Uses design tokens (no hardcoded colors)
   - [ ] Responsive (mobile-first)
   - [ ] Dark mode support
   - [ ] Accessible (keyboard, ARIA, screen reader)
   - [ ] Tested (unit + E2E if critical)
   - [ ] Documented with usage examples

3. **Reference Quick Reference** (Section 36) while coding:
   - Design tokens (colors, spacing, typography)
   - Common patterns
   - Component API conventions

### Code Review Standards

**Every PR MUST meet these criteria** (Section 32.2):

✅ **Functionality:**
- All tests pass (`npm run test`)
- TypeScript compiles without errors (`npm run build`)
- ESLint passes (`npm run lint`)

✅ **Accessibility:**
- Keyboard navigation works (tab through all interactive elements)
- Screen reader tested (VoiceOver on macOS or NVDA on Windows)
- Color contrast meets WCAG 2.1 AA (4.5:1 for text, 3:1 for UI)
- Focus indicators visible on all interactive elements

✅ **Quality:**
- Follows TypeScript conventions (Section 19)
- Follows React patterns (Section 20)
- Uses design tokens from `globals.css`
- Responsive (test mobile, tablet, desktop)
- Dark mode works

✅ **Testing:**
- Unit tests for component logic
- E2E tests for critical user flows
- Edge cases covered (empty, error, loading states)

### Common Patterns (Reference Section 38)

**Conditional Rendering:**
```tsx
{isLoading ? <Spinner /> : <Content />}
{items.length === 0 && <EmptyState />}
```

**Component Structure:**
```tsx
interface Props {
  // Props with clear types
}

export const Component = ({ ...props }: Props) => {
  // 1. Hooks
  // 2. Effects
  // 3. Event handlers
  // 4. Render
}
```

**Styling:**
```tsx
// ✅ Use design tokens
<div className="bg-bg-surface text-text-primary p-lg rounded-lg">

// ❌ Don't hardcode colors
<div className="bg-white text-black p-6 rounded-lg">
```

### When Uncertain

1. Check the style guide section relevant to your task
2. Look at existing components for patterns (e.g., `Button.tsx`, `Card.tsx`)
3. Ask for clarification if trade-offs exist
4. Default to shadcn/ui patterns and Tailwind utilities

### Enforcement

**AI Assistants (Claude Code, Gemini, etc.):**
- MUST read relevant style guide sections before writing code
- MUST use the Component Checklist for new components
- MUST reference design tokens (Section 36) while coding
- MUST follow code review standards (Section 32.2) before completing work

**Human Developers:**
- Review style guide quarterly
- Update guide when establishing new patterns
- Reference guide during code reviews
- Maintain guide as living document
