# TripOS Documentation Hub

Complete documentation for building TripOS - a collaborative trip planning platform with privacy-first budgeting, multi-algorithm voting, and real-time collaboration.

## 🚀 Quick Start

**New to TripOS?** Start here:

1. **[CLAUDE.md](./CLAUDE.md)** - Developer guidelines, conventions, tech stack (READ FIRST)
2. **[TRIPOS_DESCRIPTION.md](./TRIPOS_DESCRIPTION.md)** - Product overview and key capabilities
3. **[docs/architecture/architecture.md](./docs/architecture/architecture.md)** - Complete technical architecture (1,400+ lines)
4. **[docs/design/style-guide.md](./docs/design/style-guide.md)** - Design system with 28 CSS variable tokens
5. **[docs/epics.md](./docs/epics.md)** - Feature breakdown (98 stories across 13 epics)

---

## 📁 Folder Structure

```
TripOS/
├── README.md                       # This file
├── CLAUDE.md                       # Primary developer guide
├── TRIPOS_DESCRIPTION.md           # Product overview
├── google-ai-studio-spec.md        # AI integration specs
│
├── docs/                           # Documentation
│   ├── index.md                    # Documentation navigation guide
│   ├── epics.md                    # Feature epics (98 stories)
│   ├── project-context.md          # Architecture decision document
│   │
│   ├── architecture/               # Technical architecture
│   │   ├── architecture.md         # Complete architectural decisions (1,400+ lines)
│   │   ├── tech-stack-tracker.md   # Technology decisions and compatibility
│   │   └── maps-hybrid-optimization-plan.md  # Maps API optimization
│   │
│   ├── design/                     # Design system & UX
│   │   ├── style-guide.md          # 28 design tokens & component library
│   │   ├── design-principles.md    # Design philosophy & anti-patterns
│   │   ├── ux-spec.md              # Information architecture & state definitions
│   │   ├── dev-checklist.md        # Implementation checklist for PRs
│   │   ├── desktop-wireframe-prompts.md  # D1-D19 screen descriptions
│   │   ├── mobile-wireframe-prompts.md   # M1-M16 screen descriptions
│   │   └── wireframes/             # Wireframe evaluation docs
│   │
│   ├── stories/                    # Individual user story docs
│   │   ├── e01-s01a-*.md           # Epic 1 stories (Authentication)
│   │   ├── e01-s02-*.md
│   │   ├── e02-s01-*.md            # Epic 2 stories (Trip Management)
│   │   └── ... (98 total stories)
│   │
│   ├── strategy/                   # Deep dives & strategic decisions
│   │   ├── blind-budgeting-deep-dive.md  # CRITICAL: Privacy architecture
│   │   ├── voting-system-deep-dive.md    # Multi-algorithm voting specs
│   │   ├── role-based-permissions-analysis.md  # RBAC implementation
│   │   ├── tech-stack-decision.md
│   │   ├── ci-cd-strategy.md
│   │   ├── monitoring-observability-strategy.md
│   │   ├── email-service-selection.md
│   │   └── currency-api-selection.md
│   │
│   ├── research/                   # Technology research (40+ reports)
│   │   ├── Supabase vs Firebase comparison
│   │   ├── Next.js vs Remix vs SvelteKit
│   │   ├── React Query vs SWR
│   │   ├── Zustand vs Redux
│   │   ├── Tailwind + shadcn/ui evaluation
│   │   ├── Maps API comparisons
│   │   ├── UX patterns for mobile-first design
│   │   └── Blind budgeting validation research
│   │
│   └── database/                   # Database documentation
│       ├── migrations-overview.md  # 29 migrations with summaries
│       ├── schema-overview.md      # Table structure & relationships
│       ├── rls-policies.md         # Row-Level Security policies
│       └── edge-functions.md       # Serverless function docs (2 deployed)
│
├── config/                         # Configuration files
│   ├── web/                        # Next.js app configurations
│   │   ├── package.json            # App dependencies
│   │   ├── next.config.ts          # Next.js config
│   │   ├── tsconfig.json           # TypeScript config
│   │   ├── postcss.config.mjs      # PostCSS + Tailwind
│   │   ├── components.json         # shadcn/ui config
│   │   ├── vitest.config.ts        # Unit test config
│   │   ├── playwright.config.ts    # E2E test config
│   │   └── eslint.config.mjs       # ESLint config
│   │
│   ├── packages/                   # Package configurations
│   │   ├── schemas/                # Zod validation schemas
│   │   ├── types/                  # Supabase DB types
│   │   └── tsconfig/               # Shared TypeScript configs
│   │
│   ├── supabase/                   # Supabase configuration
│   │   └── config.toml             # Local dev config
│   │
│   └── ci-cd/                      # CI/CD workflows
│       └── ci.yml                  # GitHub Actions pipeline
│
├── wireframes-TripOS/              # Wireframe assets
│   ├── desktop/                    # 35+ desktop screens (70+ files)
│   └── mobile/                     # 55+ mobile screens (105+ files)
│
├── package.json                    # Root package config
├── pnpm-workspace.yaml            # Workspace config
└── turbo.json                     # Build pipeline config
```

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 16.1.6 (App Router, Server Components, Turbopack)
- **UI Library:** React 19
- **State Management:**
  - React Query v5.90.20 (server state)
  - Zustand 5.0.11 (UI state only)
- **Forms:** React Hook Form 7.71.1 + Zod 3.23.8 (NOT 4.x - breaks with Turbopack)
- **Styling:** Tailwind CSS v4 + shadcn/ui + 28 CSS variable design tokens
- **Icons:** Lucide React only

### Backend
- **Database:** Supabase (PostgreSQL 15)
- **Authentication:** Supabase Auth
- **Real-time:** Supabase Realtime
- **Storage:** Supabase Storage
- **Edge Functions:** Deno/TypeScript (2 deployed)

### Testing
- **Unit Tests:** Vitest
- **E2E Tests:** Playwright
- **CI/CD:** GitHub Actions (Node 22, pnpm 9.15.0)

### Monorepo
- **Package Manager:** pnpm 9.15.0
- **Build Tool:** Turborepo

---

## 📊 Project Scale

- **98 user stories** across **13 epics**
- **18 database tables** with full RLS policies
- **2 Edge Functions** deployed (5 more planned)
- **26 UI screens** (marketing, auth, app, public)
- **8 feature modules**: trips, activities, voting, budget, expenses, tasks, members, notifications
- **51 wireframe screens** (35 desktop, 55+ mobile)

---

## 🎯 Key Features

### 1. **Blind Budgeting** (Unique Feature)
**Privacy-first budget planning** where individual budget caps are RLS-isolated per user. The group ceiling is calculated server-side only, with timing delays (5-15s random) to prevent timing attacks.

**Critical Docs:**
- [docs/strategy/blind-budgeting-deep-dive.md](./docs/strategy/blind-budgeting-deep-dive.md) - Complete privacy architecture
- [docs/database/rls-policies.md](./docs/database/rls-policies.md#7-blind_budgets) - RLS isolation details

### 2. **Multi-Algorithm Voting**
Supports **Single Choice**, **Multiple Choice**, and **Ranked Choice (IRV)** voting with optional anonymous voting.

**Critical Docs:**
- [docs/strategy/voting-system-deep-dive.md](./docs/strategy/voting-system-deep-dive.md) - Algorithm implementations

### 3. **Role-Based Access Control**
4-tier hierarchy (Owner > Organizer > Member > Guest) enforced at the database level via RLS.

**Critical Docs:**
- [docs/strategy/role-based-permissions-analysis.md](./docs/strategy/role-based-permissions-analysis.md) - RBAC design
- [docs/database/rls-policies.md](./docs/database/rls-policies.md) - RLS policy details

### 4. **Real-Time Collaboration**
Supabase Realtime channels for live updates on activities, expenses, voting, and tasks.

### 5. **Activity Management**
Trip itinerary with versioning, drafts, and attendance tracking.

### 6. **Expense Tracking**
Split expenses between members with multi-currency support and settlement calculation.

---

## 🚦 Critical Constraints

### **Non-Negotiable Rules** (from CLAUDE.md)

1. **Blind budgeting privacy:** No individual budget values in client bundles/API/logs
2. **RLS enforcement:** All tables must have Row-Level Security policies
3. **Semantic colors:** Teal = privacy/budget, Purple = voting, Indigo = primary, Amber = CTAs
4. **Server Components by default:** Use `'use client'` only when needed
5. **Design tokens only:** Never hardcode colors (use CSS variables from [style-guide.md](./docs/design/style-guide.md))
6. **React Query for all async state:** Zustand only for UI state (modals, sidebars, etc.)
7. **Zod 3.x required:** Zod 4 breaks with Turbopack
8. **useWatch() not watch():** React 19 compatibility

---

## 🗺️ Development Workflow

### Local Development

```bash
# Install dependencies
pnpm install

# Start local Supabase (Docker)
pnpm db:start

# Apply database migrations
supabase db reset

# Generate TypeScript types from database
pnpm db:types

# Start Next.js dev server (Turbopack)
pnpm dev

# Run unit tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Lint & typecheck
pnpm lint
pnpm typecheck
```

### CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`):
1. **Lint** - ESLint
2. **Typecheck** - TypeScript
3. **Unit Tests** - Vitest
4. **E2E Tests** - Playwright (mobile + desktop viewports)

---

## 📚 Documentation Navigation

### For Developers
1. **[CLAUDE.md](./CLAUDE.md)** - Developer guidelines (start here)
2. **[docs/architecture/architecture.md](./docs/architecture/architecture.md)** - Technical architecture
3. **[docs/design/style-guide.md](./docs/design/style-guide.md)** - Design tokens & component library
4. **[docs/design/dev-checklist.md](./docs/design/dev-checklist.md)** - PR checklist
5. **[docs/database/](./docs/database/)** - Database schema, migrations, RLS policies

### For Product Managers
1. **[TRIPOS_DESCRIPTION.md](./TRIPOS_DESCRIPTION.md)** - Product overview
2. **[docs/epics.md](./docs/epics.md)** - Feature breakdown (98 stories)
3. **[docs/stories/](./docs/stories/)** - Detailed user story documentation
4. **[docs/design/ux-spec.md](./docs/design/ux-spec.md)** - UX specifications

### For Designers
1. **[docs/design/style-guide.md](./docs/design/style-guide.md)** - Design system (28 tokens)
2. **[docs/design/design-principles.md](./docs/design/design-principles.md)** - Design philosophy
3. **[docs/design/desktop-wireframe-prompts.md](./docs/design/desktop-wireframe-prompts.md)** - Desktop screens
4. **[docs/design/mobile-wireframe-prompts.md](./docs/design/mobile-wireframe-prompts.md)** - Mobile screens
5. **[wireframes-TripOS/](./wireframes-TripOS/)** - Wireframe assets

### For Architects
1. **[docs/architecture/architecture.md](./docs/architecture/architecture.md)** - Complete architecture
2. **[docs/architecture/tech-stack-tracker.md](./docs/architecture/tech-stack-tracker.md)** - Tech decisions
3. **[docs/strategy/](./docs/strategy/)** - Strategic deep dives (blind budgeting, voting, RBAC)
4. **[docs/research/](./docs/research/)** - Technology research (40+ reports)
5. **[docs/project-context.md](./docs/project-context.md)** - Architecture decision document

---

## 🔒 Security Notes

### Privacy-Critical Features

**Blind Budgeting:**
- Individual budget caps are **never** exposed to the client
- RLS policies ensure users can only see their own budget
- Group ceiling calculated server-side with timing delays
- Audit logs use hash-only (no plaintext values)

**Anonymous Voting:**
- RLS policies hide voter identity when `polls.is_anonymous = true`
- Vote counts visible, but voter names hidden
- Poll creator cannot see individual voters

**Row-Level Security:**
- All 18 tables have RLS enabled
- Access enforced at PostgreSQL level (cannot be bypassed by malicious clients)
- Service role bypass only via Edge Functions (with permission validation)

---

## 📖 Additional Resources

- **[docs/index.md](./docs/index.md)** - Complete documentation navigation
- **[google-ai-studio-spec.md](./google-ai-studio-spec.md)** - AI integration specifications
- **[config/ci-cd/ci.yml](./config/ci-cd/ci.yml)** - CI/CD pipeline configuration

---

## 🎓 Learning Path

**Recommended reading order for new developers:**

1. **Day 1: Project Overview**
   - [README.md](./README.md) (this file)
   - [CLAUDE.md](./CLAUDE.md)
   - [TRIPOS_DESCRIPTION.md](./TRIPOS_DESCRIPTION.md)

2. **Day 2: Architecture & Design**
   - [docs/architecture/architecture.md](./docs/architecture/architecture.md)
   - [docs/design/style-guide.md](./docs/design/style-guide.md)
   - [docs/design/design-principles.md](./docs/design/design-principles.md)

3. **Day 3: Database & Backend**
   - [docs/database/schema-overview.md](./docs/database/schema-overview.md)
   - [docs/database/rls-policies.md](./docs/database/rls-policies.md)
   - [docs/database/migrations-overview.md](./docs/database/migrations-overview.md)

4. **Day 4: Critical Features**
   - [docs/strategy/blind-budgeting-deep-dive.md](./docs/strategy/blind-budgeting-deep-dive.md)
   - [docs/strategy/voting-system-deep-dive.md](./docs/strategy/voting-system-deep-dive.md)
   - [docs/strategy/role-based-permissions-analysis.md](./docs/strategy/role-based-permissions-analysis.md)

5. **Day 5: Development**
   - [docs/design/dev-checklist.md](./docs/design/dev-checklist.md)
   - [config/web/package.json](./config/web/package.json) - Review dependencies
   - Set up local development environment

---

## 💡 Quick Tips

- **Always read CLAUDE.md first** - It contains critical non-negotiable rules
- **Use design tokens** - Never hardcode colors (see [style-guide.md](./docs/design/style-guide.md))
- **Check the dev checklist** - Before every PR (see [dev-checklist.md](./docs/design/dev-checklist.md))
- **Test with RLS enabled** - Security is enforced at the database level
- **Follow the learning path** - Don't skip the architecture docs

---

**Last Updated:** February 2026
**Documentation Version:** 1.0
**Project Status:** Pre-Implementation (Planning Complete)
