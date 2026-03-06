# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TripOS is a collaborative group trip planning platform. Split budgets, democratic voting, shared itineraries — without the spreadsheet chaos. Built as a Turborepo monorepo with Next.js 16 + Supabase.

## Non-Negotiable Rules

- **Blind budgeting privacy**: Individual budget values NEVER appear in client bundles, API responses, logs, or client-side state. Aggregation only via server-side Edge Functions.
- **RLS enforced on ALL tables**: Never bypass via service_role key in client code. Supabase anon key is public by design — only service_role key exposure is a vulnerability.
- **Semantic colors are exclusive**: teal = privacy/budget ONLY, purple = voting ONLY, indigo = primary actions, amber = CTAs. No exceptions — using teal on a non-privacy element or purple on a non-voting element is a bug.
- **Server Components by default**: Add `'use client'` only when needed (interactivity, hooks, browser APIs). Privacy-sensitive data must stay in Server Components.
- **Design tokens only**: Use CSS variables from docs/design/style-guide.md — no hardcoded hex values.

## Commands

```bash
# Development
pnpm dev                    # Start all apps (Next.js with Turbopack)
pnpm build                  # Production build (catches type errors)
pnpm lint                   # ESLint across all packages
pnpm typecheck              # TypeScript type checking across all packages

# Testing
pnpm test                   # Vitest unit/integration tests (all packages)
pnpm --filter @tripos/web test -- src/path/to/file.test.ts  # Run single test file
pnpm --filter @tripos/web test:watch                        # Vitest in watch mode
pnpm --filter @tripos/web test:coverage                     # Vitest with coverage
pnpm test:e2e               # Playwright E2E (requires Supabase running)
pnpm --filter @tripos/web test:e2e:ui                       # Playwright interactive UI

# Database (Supabase)
pnpm db:start               # Start local Supabase (API:54321, DB:54322, Studio:54323)
pnpm db:stop                # Stop local Supabase
pnpm db:reset               # Reset DB and re-run all migrations
pnpm db:types               # Regenerate TypeScript types from schema → packages/types/src/database.ts
```

## Tech Stack

- **Frontend**: Next.js 16 App Router (React 19 Server Components + Client Components)
- **Backend**: Supabase (PostgreSQL 15 + Auth + RLS + Realtime + Edge Functions + Storage)
- **State**: React Query (TanStack Query v5) for server state, Zustand for UI state only
- **Forms**: React Hook Form + Zod (shared schemas in `@repo/schemas`)
- **Styling**: Tailwind CSS v4 + shadcn/ui (New York style) + CSS Variables (28 design tokens)
- **Icons**: Lucide only — no Material, Heroicons, or Font Awesome
- **Testing**: Vitest + jsdom (unit/integration), Playwright (E2E)
- **Language**: TypeScript (strict mode)
- **Monorepo**: Turborepo + pnpm

### Version Constraints

- **Zod 3.x only** — Zod 4 has a runtime error with Next.js 16's Turbopack bundler
- **React Hook Form**: Use `useWatch()` not `watch()` for React 19 compatibility
- **React Query**: Use `isPending` not `isLoading` (v5 API)

## Project Structure

```
tripOS/
├── apps/web/                   # Next.js 16 web application
│   ├── src/
│   │   ├── app/                # Route groups: /(marketing), /(auth), /(app), /(public)
│   │   ├── components/         # Shared components (ui/ = shadcn, shared/ = custom)
│   │   ├── features/           # Feature modules (see pattern below)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Supabase clients, auth utilities, helpers
│   │   ├── stores/             # Zustand stores (UI state only)
│   │   ├── styles/             # Global styles, CSS variables
│   │   └── middleware.ts       # Session refresh, route protection
│   └── e2e/                    # Playwright E2E tests
├── packages/
│   ├── tsconfig/               # @repo/tsconfig — shared TS configs
│   ├── types/                  # @repo/types — auto-generated Supabase DB types
│   └── schemas/                # @repo/schemas — Zod validation schemas (shared by forms + Edge Functions)
├── supabase/
│   ├── migrations/             # 20+ SQL migrations (all tables, RLS policies, functions)
│   ├── functions/              # Edge Functions (Deno/TypeScript)
│   └── config.toml             # Local dev config
└── docs/                       # Architecture, design, epics
```

## Feature Module Pattern

Each feature in `src/features/` follows this structure:

```
features/{feature}/
├── actions/        # Next.js Server Actions (validate with Zod, return state objects)
├── components/     # Feature-specific UI components
├── hooks/          # React Query hooks (queries + query keys)
└── lib/            # Utilities, filters, formatters
```

**Server Action pattern** — Actions receive FormData, validate via `@repo/schemas`, return a typed state object (`{ success?, error?, fieldErrors? }`), and call `revalidatePath()`:

```typescript
// actions/create-thing.ts
export async function createThing(prev: State, formData: FormData): Promise<State> {
  const parsed = schema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors }
  // ... Supabase mutation
  revalidatePath('/path')
  return { success: true }
}
```

**Client form pattern** — Components use `useActionState` + React Hook Form + `zodResolver`. On success: toast, invalidate React Query cache, close dialog/redirect. Field errors from server are mapped back via `form.setError()`.

**Query hook pattern** — Each feature exports query keys and hooks wrapping `useQuery`:

```typescript
export const thingsQueryKey = ['things'] as const
export function useThings() {
  return useQuery({ queryKey: thingsQueryKey, queryFn: ... })
}
```

## Key Conventions

- **React Query** for all server/async state. **Zustand** for UI-only state (sidebar, modals). Never duplicate server state in Zustand.
- **Optimistic UI** with rollback on mutation failure.
- **4-tier RBAC** enforced at database level: Owner > Organizer > Member > Guest.
- **Shared packages**: Import types from `@repo/types`, validation schemas from `@repo/schemas`. Path alias `@/*` maps to `src/*` within apps/web.
- **shadcn/ui components** — use existing, do not reimplement.
- **Responsive**: 390px mobile baseline, 1440px desktop.
- **WCAG 2.1 AA**: 4.5:1 contrast, 44px touch targets, keyboard nav, screen reader support.
- **Tests co-located** next to source files (not in separate `__tests__` directories).

## Authentication & Middleware

- Cookie-based sessions via `@supabase/ssr` (not localStorage)
- `middleware.ts` refreshes tokens on every request and protects routes
- Protected routes (`/dashboard`, `/trip/*`, `/settings`) redirect to `/login` if unauthenticated
- Auth routes (`/login`, `/signup`) redirect to `/dashboard` if already authenticated
- Client uses `createClient()` from `lib/supabase/client.ts` (browser, anon key, RLS-enforced)
- Server uses `createClient()` from `lib/supabase/server.ts` (reads cookies, anon key)

## E2E Tests (Playwright)

- Auth setup project (`auth.setup.ts`) creates a test user; storage state saved to `e2e/.auth/user.json`
- Two viewport profiles: mobile (390×844) and desktop (1440×900)
- CI runs Chromium only; local adds Safari and Firefox
- Artifacts: HTML report, screenshots/video on failure

## CI Pipeline

GitHub Actions (`.github/workflows/ci.yml`): Node 22, pnpm 9.15.0, ubuntu-latest.
- **quality** job: lint → typecheck → unit tests
- **e2e** job: starts Supabase, runs Playwright (mobile + desktop viewports)

## Reference Docs (read on-demand, NOT auto-loaded)

- `docs/architecture.md` — Architectural decisions, implementation patterns, all anti-patterns, library versions
- `docs/design/style-guide.md` — 28 design tokens, color palette, typography, spacing, component patterns
- `docs/design/design-principles.md` — Design philosophy, interaction principles, feature design languages
- `docs/design/ux-spec.md` — Information architecture, mental models, state definitions
- `docs/epics.md` — 98 stories across 13 epics

## Compaction Guidance

When compacting context, always preserve: semantic color rules, RLS/blind budgeting privacy rules, version constraints (Zod 3.x, useWatch, isPending), test commands, monorepo structure (apps/web, packages/*), and the current task's modified file list.
