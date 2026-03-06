---
project_name: 'TripOS'
user_name: 'Pedro'
date: '2026-02-12'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'code_quality', 'workflow_rules', 'critical_rules']
status: 'complete'
rule_count: 72
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

| Technology | Version | Constraint |
|---|---|---|
| Next.js | 16.1.6 | App Router, Turbopack, RSC default |
| React | 19.1.0 | `useWatch()` not `watch()`, `isPending` not `isLoading` |
| TypeScript | 5.7.0 | Strict mode, `@/*` path alias |
| @supabase/supabase-js | 2.95.3 | Destructure `{ data, error }`, never `.then()/.catch()` |
| @supabase/ssr | 0.8.0 | Cookie-based auth, separate server/client/middleware clients |
| @tanstack/react-query | 5.90.20 | `isPending` (never `isLoading`), `staleTime: 30s` default |
| Zustand | 5.0.11 | UI state only, individual property selectors |
| Zod | 3.23.8 | **MUST stay 3.x** — Zod 4 runtime error with Turbopack |
| React Hook Form | 7.71.1 | `useWatch()` (never `watch()` in React 19) |
| Tailwind CSS | 4.1.0 | Design tokens via CSS variables, no hardcoded hex |
| date-fns | 4.1.0 | Store UTC, display in user timezone |
| nuqs | 2.8.8 | URL state for search/filter/pagination |
| next-themes | 0.4.6 | Class-based `.dark` on `<html>` |
| next-intl | 4.8.2 | English MVP, translation keys in place |
| Vitest | 3.0.0 | jsdom, co-located `*.test.{ts,tsx}` |
| Playwright | 1.58.2 | Mobile 390x844, Desktop 1440x900 |
| Turbo | 2.5.0 | `pnpm build/dev/lint/typecheck/test` |
| pnpm | 9.15.0 | Workspace: `apps/*`, `packages/*` |

## Critical Implementation Rules

### Language-Specific Rules (TypeScript)

- **Strict mode** enforced via `@repo/tsconfig`. Never disable or weaken.
- **Path alias**: `@/*` resolves to `./src/*`. Use it for all non-relative imports.
- **No `any`**: Use Supabase-generated types from `@repo/types` or define explicit interfaces.
- **snake_case data**: Database columns are `snake_case`. JSON transport preserves `snake_case`. TypeScript code works with `snake_case` properties. No camelCase mapping layer.
- **Supabase error handling**: Always `const { data, error } = await supabase.from(...)`. Never `.then()/.catch()`. Never wrap in `try/catch`.
- **Edge Function errors**: Return `{ error: { code: string, message: string } }` with HTTP status (400/401/403/404/429/500).
- **Boolean columns**: Prefix with `is_` — `is_public`, `is_anonymous`, `is_settled`. No double negatives.
- **Constants**: `UPPER_SNAKE_CASE` — `MAX_MEMBERS_PER_TRIP`, `BUDGET_RATE_LIMIT_MS`.
- **Import order** (enforced by ESLint): React/Next → external → `@/lib` → `@/components/ui` → `@/components/shared` → `@/features` → `@/hooks` → `@/stores` → `@/types` → relative → styles.
- **Barrel exports**: Each feature module exposes public API via `index.ts`. No reaching into another feature's internals.

### Framework-Specific Rules (Next.js + React + Supabase)

- **Server Components default**: Add `'use client'` only for interactivity/hooks/browser APIs. Privacy data stays server-side.
- **React Query for server state**: Never `useState` for data from Supabase. Never `useEffect` to fetch. Use `useQuery`/`useMutation`.
- **Optimistic UI pattern**: Every mutation uses `onMutate` (cancel queries, snapshot, optimistic update) → `onError` (rollback, error toast) → `onSettled` (invalidate) → `onSuccess` (success toast).
- **Zustand for UI only**: Sidebar, modals, filters, search. Never server data. Select individual properties, never entire store.
- **URL state via nuqs**: Search params, filter selections, pagination. Shareable and bookmarkable.
- **Form pattern**: `useForm` + `zodResolver` + `useMutation`. Submit via `form.handleSubmit`, never `onClick`. Disable button while `mutation.isPending`.
- **Three Supabase clients**: `client.ts` (browser), `server.ts` (RSC/Server Actions), `middleware.ts` (token refresh). Never mix.
- **Realtime**: One channel per trip. Direct `queryClient.setQueryData` on events — never refetch/invalidate on realtime.
- **RLS is law**: All data access enforced at database level. Never bypass with service_role in client code.
- **Edge Functions**: Complex business logic only (budget calc, poll close, settlement, exports). Invoked via `supabase.functions.invoke()`.
- **Component boundaries**: `ui/` (no logic) → `shared/` (layout) → `features/{name}/` (business). Features never import from other features (except `use-trip-permissions`).
- **Permission checks**: Use `can('manage_activities')` from `useTripPermissions` hook. Never compare role strings directly.
- **React Query keys**: Array format, feature-prefixed — `['trips', tripId]`, `['polls', tripId, 'active']`.
- **Loading states**: Skeleton loaders (never spinners) for initial load. `isPending` for mutations. `loading.tsx` per route segment.
- **Error boundaries**: Per route segment via `error.tsx`, not global. Toast for mutation errors. Banner for network disconnection.

### Testing Rules

- **Co-located tests**: `poll-card.test.tsx` next to `poll-card.tsx`. Never in separate `__tests__/` directory.
- **Vitest for unit/integration**: Components, hooks, utilities. jsdom environment, globals enabled.
- **Playwright for E2E**: Separate `e2e/` directory. 5 projects: mobile-chrome/safari (390x844), desktop-chrome/firefox/safari (1440x900).
- **Test file naming**: `{source-file}.test.ts` or `{source-file}.test.tsx`. Match source file name exactly.
- **Run before completion**: `pnpm lint`, `pnpm typecheck`, and `pnpm test` must pass before any task is considered done.
- **Supabase mocking**: Mock `@/lib/supabase/client` for unit tests. Never call real Supabase in unit tests.
- **React Query testing**: Wrap components in `QueryClientProvider` with fresh `QueryClient` per test.
- **No snapshot tests**: Prefer explicit assertions over snapshots for maintainability.

### Code Quality & Style Rules

- **Naming**: Components `PascalCase`, files `kebab-case.tsx`, hooks `useCamelCase` in `use-kebab-case.ts`, schemas `camelCaseSchema`, stores `useCamelCaseStore`.
- **Database naming**: Tables `snake_case` plural, columns `snake_case`, FKs `{table_singular}_id`, indexes `ix_{table}_{columns}`, RLS policies `{table}_{action}_{description}`.
- **No hardcoded colors**: Always CSS variable tokens from `globals.css`. Violation = bug.
- **Semantic color lock**: teal (`--privacy`) = budget/privacy ONLY. purple (`--vote`) = voting ONLY. indigo = primary actions. amber = CTAs. Misuse = bug.
- **shadcn/ui only**: Never reimplement Button, Dialog, Card, Input, Select, Tabs, Toast, Skeleton, etc. Use `npx shadcn@latest add {component}`.
- **Lucide icons only**: No Font Awesome, Heroicons, or other icon sets.
- **Feature module structure**: `components/`, `hooks/`, `schemas/`, `utils/`, `types.ts`, `index.ts`.
- **Route naming**: Segments `kebab-case`, dynamic params `[camelCase]`, groups `(groupName)`.
- **Accessibility**: 44px touch targets (48px preferred), 4.5:1 contrast, keyboard navigation, `aria-label` for icon-only buttons.
- **Responsive**: 390px mobile baseline, 1440px desktop. Mobile-first approach.

### Development Workflow Rules

- **Monorepo commands**: `pnpm build`, `pnpm dev`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`.
- **Database commands**: `pnpm db:start` (local Supabase), `pnpm db:reset` (apply migrations + seed), `pnpm db:types` (regenerate TS types).
- **Branch naming**: `feat/E{epic}-S{story}-{description}` — e.g., `feat/E1-S1a-project-scaffolding`.
- **Type regeneration**: Run `pnpm db:types` after any schema migration. Commit generated types to git.
- **Story workflow**: Stories in `docs/stories/`, tracked in `docs/sprint-status.yaml`. Statuses: backlog → ready-for-dev → in-progress → review → done.
- **CI pipeline**: lint → typecheck → test → e2e → deploy. All must pass before merge to `main`.
- **Preview deployments**: Every PR gets a Vercel preview URL. Playwright E2E runs against it.
- **Environment variables**: `.env.local` for dev (gitignored). Vercel env vars for preview/production. Never commit secrets.
- **Supabase anon key**: Safe for client code (RLS enforces security). Only `service_role` key is sensitive.

### Critical Don't-Miss Rules

**Privacy (Non-Negotiable):**

- Blind budget values NEVER in client bundles, API responses, logs, or client state.
- Budget aggregation ONLY via `calculate-group-budget` Edge Function (server-side, service_role).
- Activity feed: `budget.submitted` event only — never log amounts or deltas.
- Timing attack mitigation: Edge Function adds random 5-15s delay to budget aggregation.

**React 19 Gotchas:**

- `watch()` broken in React 19 → use `useWatch()`.
- `isLoading` removed in RQ v5 → use `isPending` (initial) / `isFetching` (background).
- Zod 4 breaks Turbopack → stay on 3.23.8.

**Anti-Pattern Table:**

| Never Do This | Do This Instead |
| --- | --- |
| `useState` for server data | `useQuery` from React Query |
| `useEffect` to fetch | `useQuery` with Supabase client |
| `fetch('/api/...')` for data | `supabase.from('table').select()` |
| Manual loading boolean | `isPending` / `isFetching` from RQ |
| `try/catch` around Supabase | Destructure `{ data, error }` |
| Global CSS classes | Tailwind utilities |
| `any` type | Supabase generated types |
| `console.log` errors | Toast notification or Sentry |
| `localStorage` for auth | Cookie-based `@supabase/ssr` |
| Direct DOM manipulation | React refs or state |
| Teal on non-privacy elements | Use indigo/amber/neutral instead |
| Purple on non-voting elements | Use indigo/amber/neutral instead |
| Compare role strings directly | Use `can()` from `useTripPermissions` |
| Import another feature's internals | Use React Query cache or Realtime |

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Reference `docs/architecture.md` for detailed patterns with code examples
- Reference `docs/design/style-guide.md` for complete design token values

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack or versions change
- Review quarterly for outdated rules
- Remove rules that become obvious over time

Last Updated: 2026-02-12
