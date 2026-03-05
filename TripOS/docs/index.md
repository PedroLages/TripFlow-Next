# TripOS Documentation Index

Complete navigation guide for TripOS documentation. Use this index to find the right documentation for your needs.

---

## 🏁 Getting Started

**New to TripOS?** Start with these essential documents:

| Document | Description | Audience |
|----------|-------------|----------|
| **[../CLAUDE.md](../CLAUDE.md)** | Developer guidelines, conventions, non-negotiable rules | **All developers** |
| **[../TRIPOS_DESCRIPTION.md](../TRIPOS_DESCRIPTION.md)** | Product overview and key capabilities | All team members |
| **[architecture/architecture.md](./architecture/architecture.md)** | Complete technical architecture (1,400+ lines) | Developers, Architects |
| **[design/style-guide.md](./design/style-guide.md)** | Design system with 28 CSS variable tokens | Developers, Designers |
| **[epics.md](./epics.md)** | Feature breakdown (98 stories across 13 epics) | PMs, Developers |

---

## 📂 Documentation Categories

### 1. Architecture & Infrastructure

| Document | Description |
|----------|-------------|
| **[architecture/architecture.md](./architecture/architecture.md)** | Complete architectural decisions (1,400+ lines) |
| **[architecture/tech-stack-tracker.md](./architecture/tech-stack-tracker.md)** | Technology decisions and compatibility matrix |
| **[architecture/maps-hybrid-optimization-plan.md](./architecture/maps-hybrid-optimization-plan.md)** | Maps API optimization strategy |
| **[project-context.md](./project-context.md)** | Architecture decision document (BMAD output) |

**When to use:**
- Setting up the development environment
- Understanding technology choices
- Evaluating new technology additions
- Resolving architectural questions

---

### 2. Design System & UX

| Document | Description |
|----------|-------------|
| **[design/style-guide.md](./design/style-guide.md)** | 28 design tokens & component library (CRITICAL) |
| **[design/design-principles.md](./design/design-principles.md)** | Design philosophy & anti-patterns |
| **[design/ux-spec.md](./design/ux-spec.md)** | Information architecture & state definitions |
| **[design/dev-checklist.md](./design/dev-checklist.md)** | Implementation checklist for PRs |
| **[design/desktop-wireframe-prompts.md](./design/desktop-wireframe-prompts.md)** | Desktop screen descriptions (D1-D19) |
| **[design/mobile-wireframe-prompts.md](./design/mobile-wireframe-prompts.md)** | Mobile screen descriptions (M1-M16) |
| **[design/wireframes/](./design/wireframes/)** | Wireframe evaluation docs |

**When to use:**
- Implementing new UI components
- Styling existing components
- Reviewing design consistency
- Creating wireframes or mockups

**Critical:** Always use design tokens from `style-guide.md`. Never hardcode colors.

---

### 3. Database & Backend

| Document | Description |
|----------|-------------|
| **[database/schema-overview.md](./database/schema-overview.md)** | Table structure & relationships (18 tables) |
| **[database/rls-policies.md](./database/rls-policies.md)** | Row-Level Security policies (CRITICAL) |
| **[database/migrations-overview.md](./database/migrations-overview.md)** | 29 migrations with summaries |
| **[database/edge-functions.md](./database/edge-functions.md)** | Serverless function documentation (2 deployed) |

**When to use:**
- Working with database queries
- Creating new tables or migrations
- Understanding data relationships
- Implementing RLS policies
- Deploying Edge Functions

**Critical:** All tables have RLS enabled. Understand RLS policies before querying data.

---

### 4. Product Specifications

| Document | Description |
|----------|-------------|
| **[epics.md](./epics.md)** | Complete feature breakdown (98 stories across 13 epics) |
| **[stories/](./stories/)** | Individual user story documentation (98 files) |

**Epic Structure:**
- **Epic 1:** Authentication & Onboarding (Stories 1-3)
- **Epic 2:** Trip Management (Stories 1-5)
- **Epic 3:** Activity Planning
- **Epic 4:** Voting & Decision Making
- **Epic 5:** Blind Budgeting (Privacy-Critical)
- **Epic 6:** Expense Tracking
- **Epic 7:** Task Management
- **Epic 8:** Members & Permissions
- **Epic 9:** Notifications & Activity Feed
- **Epic 10:** Real-Time Collaboration
- **Epic 11:** Search & Filtering
- **Epic 12:** Settings & Profile
- **Epic 13:** Admin & Moderation

**When to use:**
- Planning implementation
- Understanding feature requirements
- Prioritizing development work
- Writing user stories

---

### 5. Strategy & Deep Dives

| Document | Description | Priority |
|----------|-------------|----------|
| **[strategy/blind-budgeting-deep-dive.md](./strategy/blind-budgeting-deep-dive.md)** | Privacy architecture spec | **CRITICAL** |
| **[strategy/voting-system-deep-dive.md](./strategy/voting-system-deep-dive.md)** | Multi-algorithm voting specs | **CRITICAL** |
| **[strategy/role-based-permissions-analysis.md](./strategy/role-based-permissions-analysis.md)** | RBAC implementation | High |
| **[strategy/tech-stack-decision.md](./strategy/tech-stack-decision.md)** | Tech stack rationale | Medium |
| **[strategy/ci-cd-strategy.md](./strategy/ci-cd-strategy.md)** | CI/CD pipeline design | Medium |
| **[strategy/monitoring-observability-strategy.md](./strategy/monitoring-observability-strategy.md)** | Monitoring strategy | Medium |
| **[strategy/email-service-selection.md](./strategy/email-service-selection.md)** | Email provider choice | Low |
| **[strategy/currency-api-selection.md](./strategy/currency-api-selection.md)** | Currency API choice | Low |

**When to use:**
- Implementing critical features (blind budgeting, voting)
- Understanding privacy requirements
- Implementing RBAC
- Choosing external services

**Critical Reading:**
- **Blind budgeting** - Must read before implementing budget features
- **Voting system** - Must read before implementing polls/voting

---

### 6. Research & Technology Evaluations

**Location:** [research/](./research/) (40+ reports)

**Topics Covered:**
- Supabase vs Firebase comparison
- Next.js vs Remix vs SvelteKit
- React Query vs SWR
- Zustand vs Redux
- Tailwind CSS + shadcn/ui evaluation
- Maps API comparisons (Google, Mapbox, OpenStreetMap)
- UX patterns for mobile-first design
- Blind budgeting validation research
- Authentication patterns
- Real-time collaboration strategies
- State management patterns
- Testing frameworks (Vitest, Playwright)

**When to use:**
- Evaluating new technologies
- Understanding why specific tech was chosen
- Comparing alternative solutions
- Planning technology upgrades

---

## 🎯 Documentation by Role

### For Developers

**Essential Reading:**
1. [../CLAUDE.md](../CLAUDE.md) - Developer guidelines (non-negotiable rules)
2. [architecture/architecture.md](./architecture/architecture.md) - Technical architecture
3. [design/style-guide.md](./design/style-guide.md) - Design tokens & component library
4. [database/schema-overview.md](./database/schema-overview.md) - Database structure
5. [database/rls-policies.md](./database/rls-policies.md) - RLS policies

**Feature Implementation:**
1. [epics.md](./epics.md) - Find relevant epic
2. [stories/](./stories/) - Read user story documentation
3. [design/dev-checklist.md](./design/dev-checklist.md) - PR checklist
4. [strategy/](./strategy/) - Read relevant deep dive (if critical feature)

**Before Every PR:**
- [ ] Read relevant user story documentation
- [ ] Follow design tokens (never hardcode colors)
- [ ] Test with RLS enabled
- [ ] Complete dev checklist
- [ ] Add unit tests (Vitest)
- [ ] Add E2E tests (Playwright) if critical flow

---

### For Product Managers

**Essential Reading:**
1. [../TRIPOS_DESCRIPTION.md](../TRIPOS_DESCRIPTION.md) - Product overview
2. [epics.md](./epics.md) - Complete feature breakdown
3. [design/ux-spec.md](./design/ux-spec.md) - UX specifications
4. [stories/](./stories/) - Individual user stories

**Planning:**
1. [epics.md](./epics.md) - Feature prioritization
2. [strategy/](./strategy/) - Strategic decisions
3. [research/](./research/) - Technology constraints

---

### For Designers

**Essential Reading:**
1. [design/style-guide.md](./design/style-guide.md) - Design system (28 tokens)
2. [design/design-principles.md](./design/design-principles.md) - Design philosophy
3. [design/ux-spec.md](./design/ux-spec.md) - UX specifications
4. [design/desktop-wireframe-prompts.md](./design/desktop-wireframe-prompts.md) - Desktop screens
5. [design/mobile-wireframe-prompts.md](./design/mobile-wireframe-prompts.md) - Mobile screens

**Wireframe Assets:**
- [../wireframes-TripOS/desktop/](../wireframes-TripOS/desktop/) - 35+ desktop screens
- [../wireframes-TripOS/mobile/](../wireframes-TripOS/mobile/) - 55+ mobile screens

---

### For Architects

**Essential Reading:**
1. [architecture/architecture.md](./architecture/architecture.md) - Complete architecture
2. [architecture/tech-stack-tracker.md](./architecture/tech-stack-tracker.md) - Tech decisions
3. [project-context.md](./project-context.md) - Architecture decision document
4. [database/schema-overview.md](./database/schema-overview.md) - Database design
5. [database/rls-policies.md](./database/rls-policies.md) - Security policies

**Deep Dives:**
1. [strategy/blind-budgeting-deep-dive.md](./strategy/blind-budgeting-deep-dive.md) - Privacy architecture
2. [strategy/voting-system-deep-dive.md](./strategy/voting-system-deep-dive.md) - Voting algorithms
3. [strategy/role-based-permissions-analysis.md](./strategy/role-based-permissions-analysis.md) - RBAC

**Research:**
- [research/](./research/) - 40+ technology evaluation reports

---

### For QA Engineers

**Essential Reading:**
1. [epics.md](./epics.md) - Feature requirements
2. [stories/](./stories/) - User story acceptance criteria
3. [design/ux-spec.md](./design/ux-spec.md) - Expected behavior
4. [database/rls-policies.md](./database/rls-policies.md) - Security test cases

**Test Configurations:**
- [../config/web/vitest.config.ts](../config/web/vitest.config.ts) - Unit test config
- [../config/web/playwright.config.ts](../config/web/playwright.config.ts) - E2E test config
- [../config/ci-cd/ci.yml](../config/ci-cd/ci.yml) - CI pipeline

---

## 🔍 Finding Documentation by Topic

### Authentication & Authorization
- [stories/e01-s01a-*.md](./stories/) - User registration stories
- [stories/e01-s02-*.md](./stories/) - Login stories
- [database/rls-policies.md](./database/rls-policies.md) - RLS policies
- [strategy/role-based-permissions-analysis.md](./strategy/role-based-permissions-analysis.md) - RBAC

### Trip Management
- [stories/e02-*.md](./stories/) - Trip management stories
- [database/schema-overview.md](./database/schema-overview.md#2-trip-management) - Trip tables

### Activity Planning
- [epics.md](./epics.md#epic-3-activity-planning) - Activity epic
- [database/schema-overview.md](./database/schema-overview.md#3-activities) - Activity tables

### Voting & Decision Making
- [strategy/voting-system-deep-dive.md](./strategy/voting-system-deep-dive.md) - Voting algorithms (CRITICAL)
- [epics.md](./epics.md#epic-4-voting-decision-making) - Voting epic
- [database/schema-overview.md](./database/schema-overview.md#4-voting-decision-making) - Voting tables

### Blind Budgeting (Privacy-Critical)
- [strategy/blind-budgeting-deep-dive.md](./strategy/blind-budgeting-deep-dive.md) - Privacy architecture (CRITICAL)
- [epics.md](./epics.md#epic-5-blind-budgeting) - Budget epic
- [database/rls-policies.md](./database/rls-policies.md#7-blind_budgets) - RLS isolation

### Expense Tracking
- [epics.md](./epics.md#epic-6-expense-tracking) - Expense epic
- [database/schema-overview.md](./database/schema-overview.md#5-budget-expenses) - Expense tables

### Task Management
- [epics.md](./epics.md#epic-7-task-management) - Task epic
- [database/schema-overview.md](./database/schema-overview.md#6-tasks-checklists) - Task tables

### Real-Time Collaboration
- [epics.md](./epics.md#epic-10-real-time-collaboration) - Real-time epic
- [architecture/architecture.md](./architecture/architecture.md) - Supabase Realtime setup

### Testing
- [design/dev-checklist.md](./design/dev-checklist.md) - Testing checklist
- [../config/web/vitest.config.ts](../config/web/vitest.config.ts) - Unit tests
- [../config/web/playwright.config.ts](../config/web/playwright.config.ts) - E2E tests

---

## 🚨 Critical Documentation

**READ BEFORE IMPLEMENTING:**

### Blind Budgeting
❗ **[strategy/blind-budgeting-deep-dive.md](./strategy/blind-budgeting-deep-dive.md)**

**Why critical:**
- Individual budgets must NEVER be exposed to client
- RLS policies strictly isolate per user
- Timing delays prevent timing attacks
- Audit logs use hash-only

**Consequences of ignoring:**
- Privacy violation (exposing individual budgets)
- Security vulnerability (timing attacks)
- Compliance failure (audit trail)

---

### Row-Level Security
❗ **[database/rls-policies.md](./database/rls-policies.md)**

**Why critical:**
- All data access enforced at database level
- Application code cannot bypass RLS
- Role hierarchy: Owner > Organizer > Member > Guest
- Guest restrictions: read-only with limited visibility

**Consequences of ignoring:**
- Unauthorized data access
- Security breach
- Data leakage between trips

---

### Design Tokens
❗ **[design/style-guide.md](./design/style-guide.md)**

**Why critical:**
- 28 CSS variable tokens define entire design system
- Never hardcode colors (use tokens only)
- Dark mode support built-in
- Consistency across all components

**Consequences of ignoring:**
- Design inconsistencies
- Dark mode breakage
- Maintenance burden

---

## 📊 Documentation Stats

- **Total markdown files:** ~95+ files
- **Documentation size:** ~5-10 MB (text-based)
- **Architecture docs:** 3 files (1,400+ lines of architecture.md)
- **Design docs:** 7 files + wireframe evaluations
- **User stories:** 98 story files
- **Strategy docs:** 8 deep dive reports
- **Research reports:** 40+ technology evaluations
- **Database docs:** 4 comprehensive guides
- **Configuration files:** 15+ JSON/YAML/TS configs

---

## 🔄 Documentation Updates

**This documentation was compiled:** February 2026

**Source project:** `/Volumes/SSD/Dev/Apps/TripOS`

**To update documentation:**
1. Make changes in source project
2. Re-run copy script
3. Update this index if new docs added

---

## 📝 Contributing to Documentation

### Adding New Documentation

**New design patterns:**
- Add to [design/style-guide.md](./design/style-guide.md)
- Update [design/design-principles.md](./design/design-principles.md)

**New architectural decisions:**
- Add to [architecture/architecture.md](./architecture/architecture.md)
- Update [architecture/tech-stack-tracker.md](./architecture/tech-stack-tracker.md)

**New database tables:**
- Add migration to `supabase/migrations/`
- Update [database/schema-overview.md](./database/schema-overview.md)
- Add RLS policies to [database/rls-policies.md](./database/rls-policies.md)

**New Edge Functions:**
- Deploy function to `supabase/functions/`
- Document in [database/edge-functions.md](./database/edge-functions.md)

**New research:**
- Add report to [research/](./research/)
- Update this index

---

## 🆘 Need Help?

**Can't find what you're looking for?**

1. **Search the documentation:** Use your editor's search (Cmd/Ctrl + Shift + F)
2. **Check the README:** [../README.md](../README.md) has a comprehensive overview
3. **Read CLAUDE.md:** [../CLAUDE.md](../CLAUDE.md) has all the critical rules
4. **Review the architecture:** [architecture/architecture.md](./architecture/architecture.md) has 1,400+ lines of context

**Common questions:**

- **"How do I...?"** → Check [../CLAUDE.md](../CLAUDE.md) and [design/dev-checklist.md](./design/dev-checklist.md)
- **"Why did we choose...?"** → Check [research/](./research/) and [architecture/tech-stack-tracker.md](./architecture/tech-stack-tracker.md)
- **"What does this table do?"** → Check [database/schema-overview.md](./database/schema-overview.md)
- **"How do I implement...?"** → Check [epics.md](./epics.md) → [stories/](./stories/) → Strategy docs
- **"What are the design tokens?"** → Check [design/style-guide.md](./design/style-guide.md)

---

**Last Updated:** February 2026
**Documentation Index Version:** 1.0
