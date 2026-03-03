# Next.js Migration + Blind Budgeting Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a new Next.js 16 App Router project, migrate tripflow-web's existing UI components, and implement blind budgeting with Server Actions for real privacy guarantees.

**Architecture:** Next.js 16 App Router with Supabase SSR. Server Actions handle all blind budget operations — individual amounts never leave the server. Mock auth context simulates multiple users. Tailwind v4 + shadcn/ui for new components alongside existing custom CSS. Pure functions for business logic, React Query hooks for client-side data fetching.

**Tech Stack:** Next.js 16.1, React 19.2, TypeScript 5.9, Supabase JS + SSR, Tailwind CSS v4, shadcn/ui, Framer Motion 12, Vitest, @tanstack/react-query v5, Lucide React, Zod

**Reference docs:**
- Design: `docs/plans/2026-02-24-tripos-feature-integration-design.md`
- Old Vite plan (superseded by this plan): `docs/plans/2026-02-24-blind-budgeting-implementation.md`
- TripOS blind budgeting spec: `/Volumes/SSD/Dev/Apps/TripOS/docs/strategy/blind-budgeting-deep-dive.md`
- TripOS UX spec: `/Volumes/SSD/Dev/Apps/TripOS/docs/design/ux-spec.md`
- Old Vite project (component source): `/Volumes/SSD/Dev/Asia Trip/tripflow-web/`

**Key improvement over old plan:** Server Actions keep the Supabase `service_role` key server-side. The `getGroupLimit` action returns only `MIN(all caps)` and count — individual budget amounts never reach the client. This is the primary reason for the Next.js migration.

---

## Phase 1: Next.js Project Creation & Configuration

### Task 1: Create Next.js 16 Project

**Files:**
- Create: `/Volumes/SSD/Dev/Asia Trip/tripflow-next/` (entire project directory)

**Step 1: Create the project**

```bash
cd "/Volumes/SSD/Dev/Asia Trip"
npx create-next-app@latest tripflow-next --typescript --tailwind --eslint --app --src-dir --turbopack --import-alias "@/*" --yes
```

This creates a Next.js 16 project with TypeScript, Tailwind, ESLint, App Router, `src/` directory, Turbopack, and `@/*` import alias.

**Step 2: Verify versions**

```bash
cd "/Volumes/SSD/Dev/Asia Trip/tripflow-next"
npx next --version
```

Expected: `16.x.x`

Also check `package.json` to see installed React and Tailwind versions.

**Step 3: Install additional dependencies from old project**

```bash
npm install @fontsource/inter @fontsource/playfair-display framer-motion lucide-react cobe @supabase/supabase-js @supabase/ssr @tanstack/react-query zod
```

**Step 4: Verify dev server starts**

```bash
npm run dev
```

Expected: Dev server starts at localhost:3000 with the default Next.js page.

**Step 5: Copy docs from old project**

```bash
cp -r "/Volumes/SSD/Dev/Asia Trip/tripflow-web/docs" "/Volumes/SSD/Dev/Asia Trip/tripflow-next/docs"
```

**Step 6: Git init and commit**

```bash
cd "/Volumes/SSD/Dev/Asia Trip/tripflow-next"
git init
git add -A
git commit -m "feat: create Next.js 16 project with dependencies"
```

---

### Task 2: Configure Tailwind v4 Theme Tokens

**Files:**
- Modify: `src/app/globals.css`
- Delete: `tailwind.config.ts` (if exists — Tailwind v4 uses CSS-first config)

Tailwind v4 uses CSS-first configuration via `@theme` blocks. The `create-next-app` scaffolding may have generated a `tailwind.config.ts` — we'll remove it in favor of the `@theme` approach.

**Step 1: Check Tailwind version**

```bash
npx tailwindcss --help 2>&1 | head -1
```

If it shows Tailwind v3.x, upgrade:

```bash
npm uninstall tailwindcss
npm install tailwindcss@latest @tailwindcss/postcss@latest
```

Then update `postcss.config.mjs` to:

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
```

If already v4, skip the upgrade step.

**Step 2: Remove tailwind.config.ts if it exists**

```bash
rm -f tailwind.config.ts tailwind.config.js
```

**Step 3: Replace globals.css**

Replace the entire contents of `src/app/globals.css` with this (adapted from old project's `index.css`):

```css
@import "tailwindcss";

@theme {
  /* Map existing CSS variables to Tailwind tokens */
  --color-teal: #0D9488;
  --color-teal-light: #14B8A6;
  --color-coral: #FF5A5F;
  --color-coral-light: #FF767A;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
  --color-info: #3B82F6;
  --color-purple: #8b5cf6;

  /* Semantic tokens for blind budgeting */
  --color-privacy: #0D9488;
  --color-privacy-light: rgba(13, 148, 136, 0.15);

  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
}

@import '@fontsource/inter/300.css';
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/500.css';
@import '@fontsource/inter/600.css';
@import '@fontsource/inter/700.css';
@import '@fontsource/playfair-display/400.css';
@import '@fontsource/playfair-display/500.css';
@import '@fontsource/playfair-display/600.css';
@import '@fontsource/playfair-display/700.css';

:root {
  /* 2026 Cinematic Travel System - Light Mode First */
  --bg-base: #fcfcfc;
  --bg-surface: #ffffff;
  --bg-surface-hover: #f5f5f5;
  --bg-surface-subtle: rgba(0, 0, 0, 0.02);

  --text-primary: #1a1a1a;
  --text-secondary: #5e5e5e;

  /* Semantic Colors */
  --color-green: #10B981;
  --color-amber: #F59E0B;
  --color-red: #EF4444;
  --color-blue: #3B82F6;

  /* Accents */
  --accent-primary: #0D9488;
  --accent-glow: rgba(13, 148, 136, 0.15);
  --accent-secondary: #FF5A5F;

  --bg-glass: rgba(255, 255, 255, 0.85);
  --shimmer-bg: rgba(0, 0, 0, 0.04);
  --overlay-bg: rgba(0, 0, 0, 0.1);

  --border-subtle: rgba(0, 0, 0, 0.06);
  --border-focus: rgba(13, 148, 136, 0.3);
  --border-gradient: transparent;

  /* Depth */
  --glass-blur: blur(0px);
  --glass-shadow: 0 4px 12px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.05);
  --glass-inner-shadow: none;

  /* Layout */
  --sidebar-width: 280px;

  /* Typography */
  --font-base: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-heading: "Playfair Display", Georgia, serif;

  /* Transitions */
  --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-smooth: 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  --transition-bounce: 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

:root[data-theme="dark"] {
  --bg-base: #121212;
  --bg-surface: #1E1E1E;
  --bg-surface-hover: #2A2A2A;

  --text-primary: #F5F5F5;
  --text-secondary: #A3A3A3;

  --accent-primary: #14B8A6;
  --accent-glow: rgba(20, 184, 166, 0.3);
  --accent-secondary: #FF767A;

  --bg-glass: rgba(18, 18, 18, 0.85);
  --shimmer-bg: rgba(255, 255, 255, 0.04);
  --overlay-bg: rgba(0, 0, 0, 0.6);

  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-focus: rgba(20, 184, 166, 0.4);
  --border-gradient: transparent;

  --glass-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  --glass-inner-shadow: none;
}

/* Base Reset */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-base);
  background-color: var(--bg-base);
  color: var(--text-primary);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.5;
  overflow-x: hidden;
  transition: background-color var(--transition-smooth), color var(--transition-smooth);
}

/* Glassmorphic Panel Utility */
.glass-panel {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  position: relative;
  border-radius: var(--radius-lg);
  box-shadow: var(--glass-shadow);
  transition: all var(--transition-smooth);
}

.glass-panel:hover {
  background: var(--bg-surface-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
}

/* Typography Utilities */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}

p {
  color: var(--text-secondary);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--bg-surface-hover);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--accent-primary);
}

/* Interactive Elements Base */
button {
  font-family: var(--font-base);
  cursor: pointer;
  border: none;
  background: none;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**Step 4: Verify**

```bash
npm run dev
```

Expected: Dev server starts. The page renders with Inter/Playfair fonts loaded and correct colors.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: configure Tailwind v4 theme tokens and design system CSS"
```

---

### Task 3: Install and Initialize shadcn/ui

**Files:**
- Create: `components.json`
- Create: `src/lib/utils.ts`
- Create: shadcn component files in `src/components/ui/`

**Step 1: Initialize shadcn/ui**

```bash
npx shadcn@latest init
```

When prompted:
- Style: New York
- Base color: Neutral
- CSS variables: Yes

This will create `components.json` and `src/lib/utils.ts` (the `cn()` utility).

**Step 2: Install needed shadcn components**

```bash
npx shadcn@latest add dialog input label badge tooltip
```

**Step 3: Verify**

```bash
npm run dev
```

Expected: No errors. New shadcn component files exist in `src/components/ui/`.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: install and configure shadcn/ui with dialog, input, label, badge, tooltip"
```

---

### Task 4: Install Vitest + React Testing Library

**Files:**
- Create: `vitest.config.mts`
- Modify: `package.json` (add test scripts)

**Step 1: Install test dependencies**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event vite-tsconfig-paths
```

**Step 2: Create vitest config**

Create `vitest.config.mts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
})
```

**Step 3: Create test setup**

Create `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom/vitest'
```

**Step 4: Add test scripts to package.json**

Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 5: Write a smoke test**

Create `src/lib/__tests__/utils.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('cn utility', () => {
  it('merges class names', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
  })

  it('handles conflicting Tailwind classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })
})
```

**Step 6: Run test**

```bash
npm test
```

Expected: 2 tests pass.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Vitest + React Testing Library"
```

---

### Task 5: Set Up Supabase SSR

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/admin.ts`
- Create: `middleware.ts` (in project root, NOT in `src/`)
- Create: `.env.local`
- Create: `.env.example`

The project uses three Supabase clients:
1. **Browser client** — for client components (`createBrowserClient` from `@supabase/ssr`)
2. **Server client** — for server components/actions, reads cookies (`createServerClient` from `@supabase/ssr`)
3. **Admin client** — for server actions that bypass RLS during mock auth phase (uses `service_role` key, NO cookie dependency)

**Step 1: Create browser client**

Create `src/lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Step 2: Create server client**

Create `src/lib/supabase/server.ts`:

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component — safe to ignore
          }
        },
      },
    }
  )
}
```

**Step 3: Create admin client (for mock auth phase)**

Create `src/lib/supabase/admin.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

/**
 * Admin client for server-side operations that bypass RLS.
 * Used during mock auth phase where we don't have real auth sessions.
 * The service_role key NEVER leaves the server (no NEXT_PUBLIC_ prefix).
 *
 * When real auth is added, replace usage of this with the cookie-based server client.
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
```

**Step 4: Create middleware**

Create `middleware.ts` in the **project root** (NOT inside `src/`):

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // During mock auth phase, no redirect logic needed.
  // When real auth is added, check user session and redirect to /login if needed.

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

**Step 5: Create environment files**

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Create `.env.example`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Important:** `SUPABASE_SERVICE_ROLE_KEY` has NO `NEXT_PUBLIC_` prefix — it is only available on the server. This is the key privacy improvement over the old Vite approach.

**Step 6: Verify .gitignore includes .env.local**

Check `.gitignore` (Next.js projects include this by default).

**Step 7: Commit**

```bash
git add .env.example src/lib/supabase/ middleware.ts .gitignore
git commit -m "feat: configure Supabase SSR with browser, server, and admin clients"
```

---

## Phase 2: Migrate Existing UI Components

### Task 6: Copy Components, CSS Files, and Static Assets

**Files:**
- Create: `src/components/` (entire directory tree from old project)
- Create: `src/app/app.css` (from old project's App.css)
- Modify: Various component files (add "use client" directives)

**Step 1: Copy component directories**

Copy ALL component directories from the old project into the new one:

```bash
OLD="/Volumes/SSD/Dev/Asia Trip/tripflow-web/src/components"
NEW="/Volumes/SSD/Dev/Asia Trip/tripflow-next/src/components"

# Copy all feature component directories (excluding ui/ which shadcn already set up)
for dir in AIGenerator Bookings Budget Collaboration Dashboard Expenses Itinerary Notifications Settings TripDetail Voting; do
  cp -r "$OLD/$dir" "$NEW/$dir"
done
```

**Step 2: Copy custom UI components**

The old project has custom UI components (Button, Card, ErrorBoundary, ExportMenu, Globe, Input) alongside what will be shadcn components. Copy them keeping the custom ones alongside shadcn:

```bash
# Copy custom UI components and their CSS files
for file in Button.tsx Button.css Card.tsx Card.css ErrorBoundary.tsx ExportMenu.tsx ExportMenu.css Globe.tsx Input.tsx Input.css; do
  cp "$OLD/ui/$file" "$NEW/components/ui/$file" 2>/dev/null
done
```

**Step 3: Copy component CSS files**

```bash
# Copy all CSS files from feature component directories
find "$OLD" -name "*.css" -exec bash -c 'cp "$1" "$NEW/$(echo "$1" | sed "s|$OLD/||")"' _ {} \; 2>/dev/null
```

Alternatively, copy each feature's CSS manually:

```bash
for dir in AIGenerator Bookings Budget Collaboration Dashboard Expenses Itinerary Notifications Settings TripDetail Voting; do
  find "$OLD/$dir" -name "*.css" -exec cp {} "$NEW/$dir/" \;
done
```

**Step 4: Copy App.css as app.css**

```bash
cp "/Volumes/SSD/Dev/Asia Trip/tripflow-web/src/App.css" "/Volumes/SSD/Dev/Asia Trip/tripflow-next/src/app/app.css"
```

**Step 5: Add "use client" directive to ALL copied components**

Every component from the old project uses React hooks (useState, useEffect, etc.) and/or event handlers. They ALL need the `"use client"` directive at the top.

For each `.tsx` file in the copied directories, add `"use client"` as the very first line (before any imports). Here's the list of files that need it:

Components that use hooks/state/effects:
- `src/components/AIGenerator/AIGeneratorWizard.tsx`
- `src/components/Bookings/Bookings.tsx`
- `src/components/Budget/Budget.tsx`
- `src/components/Collaboration/CollaborationPanel.tsx`
- `src/components/Dashboard/Dashboard.tsx`
- `src/components/Expenses/ExpenseSplitter.tsx`
- `src/components/Itinerary/Itinerary.tsx`
- `src/components/Notifications/NotificationsPanel.tsx`
- `src/components/Settings/SettingsModal.tsx`
- `src/components/TripDetail/TripDetail.tsx`
- `src/components/Voting/Voting.tsx`
- `src/components/ui/ExportMenu.tsx`
- `src/components/ui/Globe.tsx`
- `src/components/ui/ErrorBoundary.tsx`

Components that are pure presentational (may still need "use client" if they use onClick or any DOM event handler):
- `src/components/ui/Button.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Input.tsx`

Add `"use client"` to ALL of them to be safe. Example for each file:

```tsx
"use client"

import { useState } from 'react'
// ... rest of existing imports
```

**Step 6: Fix import paths**

Some components may use relative imports like `'./components/Budget/Budget'`. These should work fine since we preserved the directory structure. However, check for any imports that reference `../App` or similar — those will need updating in later tasks.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: copy existing components from old Vite project with use client directives"
```

---

### Task 7: Build Root Layout with Sidebar and Providers

**Files:**
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Providers.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css` (import app.css at the bottom)

The old `App.tsx` contained everything: sidebar, header, tab routing, modals. We'll extract the sidebar into its own component and use Next.js routing instead of `useState` tabs.

**Step 1: Create Providers component**

Create `src/components/layout/Providers.tsx`:

```tsx
"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

**Step 2: Create Sidebar component**

Create `src/components/layout/Sidebar.tsx`:

```tsx
"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Settings, ChevronLeft, ChevronRight, Bell, MapPin, Sparkles } from 'lucide-react'
import { NotificationsPanel } from '@/components/Notifications/NotificationsPanel'
import { SettingsModal } from '@/components/Settings/SettingsModal'

interface TripData {
  id: string
  destination: string
  accentColor: string
}

const MOCK_TRIPS: TripData[] = [
  { id: '1', destination: 'Japan Circuit', accentColor: 'var(--color-blue)' },
  { id: '2', destination: 'Amalfi Coast Escape', accentColor: 'var(--color-green)' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  return (
    <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="logo-container" style={{ justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }}>
        <div className="logo-icon"></div>
        {!isSidebarCollapsed && <div className="logo-text">TripFlow AI</div>}
      </div>

      <nav className="nav-links">
        <Link
          href="/"
          className={`nav-item ${isActive('/') ? 'active' : ''}`}
          title="Dashboard"
        >
          <LayoutDashboard size={18} /> {!isSidebarCollapsed && <span>Dashboard</span>}
        </Link>

        <div
          className={`nav-item ${isNotificationsOpen ? 'active' : ''}`}
          onClick={() => setIsNotificationsOpen(true)}
          title="Notifications"
          style={{ position: 'relative' }}
        >
          <Bell size={18} /> {!isSidebarCollapsed && <span>Notifications</span>}
          {!isSidebarCollapsed && (
            <span style={{ marginLeft: 'auto', background: 'var(--color-red)', color: 'white', padding: '2px 8px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 600 }}>3</span>
          )}
          <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
        </div>

        {!isSidebarCollapsed && (
          <div className="sidebar-section-title" style={{ marginTop: '24px', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', padding: '0 16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Your Trips
          </div>
        )}

        {MOCK_TRIPS.map(trip => (
          <Link
            key={trip.id}
            href={`/trips/${trip.id}`}
            className={`nav-item ${pathname.startsWith(`/trips/${trip.id}`) ? 'active' : ''}`}
            title={trip.destination}
          >
            <MapPin size={18} color={trip.accentColor} />
            {!isSidebarCollapsed && (
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {trip.destination}
              </span>
            )}
          </Link>
        ))}

        {!isSidebarCollapsed && (
          <div className="nav-item" style={{ color: 'var(--text-secondary)' }}>
            <span style={{ marginLeft: '26px' }}>+ New Trip</span>
          </div>
        )}

        <div className="nav-item" style={{ marginTop: 'auto' }} title="Settings" onClick={() => setIsSettingsOpen(true)}>
          <Settings size={18} /> {!isSidebarCollapsed && <span>Settings</span>}
          <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
      </nav>

      <button
        className="sidebar-collapse-btn"
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      >
        {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  )
}
```

**Step 3: Create ThemeProvider**

Create `src/components/layout/ThemeProvider.tsx`:

```tsx
"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { Moon, Sun } from 'lucide-react'

const ThemeContext = createContext<{ theme: string; toggle: () => void }>({
  theme: 'light',
  toggle: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      className="glass-panel theme-toggle-btn"
      onClick={toggle}
      style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', cursor: 'pointer' }}
      title="Toggle Theme"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
```

**Step 4: Update root layout**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { Providers } from '@/components/layout/Providers'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Sidebar } from '@/components/layout/Sidebar'
import './globals.css'
import './app.css'

export const metadata: Metadata = {
  title: 'TripFlow AI',
  description: 'AI-powered collaborative trip planning',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Providers>
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                {children}
              </main>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Step 5: Append app.css import to globals.css**

The `app.css` file (copied from the old `App.css`) contains sidebar, layout, and navigation styles. Import it at the end of `globals.css`:

Add to the **very end** of `src/app/globals.css`:

```css
/* Layout styles from App.css */
@import './app.css';
```

Or alternatively, the `layout.tsx` already imports `./app.css` directly — either approach works. If you imported it in `layout.tsx`, skip this step.

**Step 6: Verify**

```bash
npm run dev
```

Expected: The sidebar renders on the left. Clicking links navigates (you'll see 404 pages for trip routes since we haven't created them yet, but the sidebar should be visible).

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: create root layout with sidebar, theme provider, and React Query"
```

---

### Task 8: Build Dashboard Page

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Create dashboard page**

Replace `src/app/page.tsx`:

```tsx
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { Dashboard } from '@/components/Dashboard/Dashboard'
import { AIGeneratorWizard } from '@/components/AIGenerator/AIGeneratorWizard'
import { ThemeToggle } from '@/components/layout/ThemeProvider'

const MOCK_TRIPS = [
  {
    id: 1,
    destination: 'Japan Circuit',
    dates: 'Oct 12 - Oct 26, 2026',
    status: 'PLANNING',
    progress: 45,
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1600&auto=format&fit=crop',
    collaborators: 2,
    accentColor: 'var(--color-blue)',
  },
  {
    id: 2,
    destination: 'Amalfi Coast Escape',
    dates: 'Jun 05 - Jun 15, 2026',
    status: 'BOOKED',
    progress: 100,
    imageUrl: 'https://images.unsplash.com/photo-1533050487297-09b450131914?q=80&w=1600&auto=format&fit=crop',
    collaborators: 4,
    accentColor: 'var(--color-green)',
  },
]

export default function HomePage() {
  const router = useRouter()
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  return (
    <>
      <header className="top-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '16px', paddingBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ marginBottom: '4px' }}>Good afternoon, Pedro.</h1>
            <p>Ready for your next adventure?</p>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <ThemeToggle />
            <div className="search-container" style={{ position: 'relative', cursor: 'text' }} onClick={() => setIsWizardOpen(true)}>
              <Sparkles size={16} className="search-icon" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)', zIndex: 1 }} />
              <input type="text" className="search-bar" placeholder="Ask AI to plan a trip..." readOnly style={{ paddingLeft: '40px', cursor: 'pointer', outline: 'none' }} />
            </div>
            <div className="user-profile">
              <img src="https://i.pravatar.cc/150?u=1" alt="Profile" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </header>

      <Dashboard
        trips={MOCK_TRIPS}
        onTripClick={(tripData) => {
          router.push(`/trips/${tripData.id}`)
        }}
      />

      {isWizardOpen && (
        <AIGeneratorWizard
          onClose={() => setIsWizardOpen(false)}
          onComplete={(data) => {
            console.log('Trip Generated', data)
            setIsWizardOpen(false)
          }}
        />
      )}
    </>
  )
}
```

**Step 2: Verify**

```bash
npm run dev
```

Expected: Dashboard page renders with trip cards and the header. Clicking a trip navigates to `/trips/1` (will 404 for now).

**Note:** If the Dashboard component has TypeScript errors due to the `TripData` interface definition being in the old App.tsx, create a shared types file:

Create `src/types/trip.ts`:

```typescript
export interface TripData {
  id: number
  destination: string
  dates: string
  status: string
  progress: number
  imageUrl: string
  collaborators: number
  accentColor: string
}
```

Update the Dashboard component import and the page to use this shared type.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: build dashboard page with trip cards and AI wizard"
```

---

### Task 9: Build Trip Pages with Tab Navigation

**Files:**
- Create: `src/app/trips/[tripId]/layout.tsx`
- Create: `src/app/trips/[tripId]/page.tsx`
- Create: `src/app/trips/[tripId]/itinerary/page.tsx`
- Create: `src/app/trips/[tripId]/budget/page.tsx`
- Create: `src/app/trips/[tripId]/voting/page.tsx`

**Step 1: Create trip layout with tab navigation**

Create `src/app/trips/[tripId]/layout.tsx`:

```tsx
"use client"

import { useParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { Users, Sparkles } from 'lucide-react'
import { CollaborationPanel } from '@/components/Collaboration/CollaborationPanel'
import { ExportMenu } from '@/components/ui/ExportMenu'
import { ThemeToggle } from '@/components/layout/ThemeProvider'

const MOCK_TRIPS: Record<string, { destination: string; dates: string; collaborators: number }> = {
  '1': { destination: 'Japan Circuit', dates: 'Oct 12 - Oct 26, 2026', collaborators: 2 },
  '2': { destination: 'Amalfi Coast Escape', dates: 'Jun 05 - Jun 15, 2026', collaborators: 4 },
}

const TABS = [
  { label: 'Overview', path: '' },
  { label: 'Itinerary', path: '/itinerary' },
  { label: 'Budget', path: '/budget' },
  { label: 'Voting', path: '/voting' },
]

export default function TripLayout({ children }: { children: React.ReactNode }) {
  const { tripId } = useParams<{ tripId: string }>()
  const pathname = usePathname()
  const [isCollabOpen, setIsCollabOpen] = useState(false)

  const trip = MOCK_TRIPS[tripId] ?? { destination: 'Unknown Trip', dates: '', collaborators: 0 }
  const basePath = `/trips/${tripId}`

  const isTabActive = (tabPath: string) => {
    const fullPath = basePath + tabPath
    if (tabPath === '') return pathname === basePath
    return pathname.startsWith(fullPath)
  }

  return (
    <>
      <header className="top-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '16px', paddingBottom: '0px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ marginBottom: '4px' }}>{trip.destination}</h1>
            <p>{trip.dates} &bull; {trip.collaborators} members</p>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <ThemeToggle />
            <button
              className="glass-panel"
              style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', cursor: 'pointer', borderRadius: '100px' }}
              onClick={() => setIsCollabOpen(true)}
            >
              <Users size={18} />
              <span style={{ fontWeight: 500 }}>Collaborators ({trip.collaborators})</span>
            </button>
            <ExportMenu />
            <div className="user-profile">
              <img src="https://i.pravatar.cc/150?u=1" alt="Profile" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>

        <div className="trip-local-nav" style={{ display: 'flex', gap: '32px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0px', marginTop: '8px' }}>
          {TABS.map(tab => {
            const active = isTabActive(tab.path)
            return (
              <Link
                key={tab.label}
                href={basePath + tab.path}
                style={{
                  padding: '8px 0 16px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: active ? 600 : 500,
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderBottom: active ? '2px solid var(--text-primary)' : '2px solid transparent',
                  marginBottom: '-1px',
                  transition: 'all var(--transition-smooth)',
                  textDecoration: 'none',
                }}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>
      </header>

      <div className="tab-content-wrapper" style={{ position: 'relative', flex: 1 }}>
        {children}
      </div>

      <CollaborationPanel isOpen={isCollabOpen} onClose={() => setIsCollabOpen(false)} />
    </>
  )
}
```

**Step 2: Create trip overview page**

Create `src/app/trips/[tripId]/page.tsx`:

```tsx
"use client"

import { useParams } from 'next/navigation'
import { TripDetail } from '@/components/TripDetail/TripDetail'

const MOCK_TRIPS = [
  {
    id: 1,
    destination: 'Japan Circuit',
    dates: 'Oct 12 - Oct 26, 2026',
    status: 'PLANNING',
    progress: 45,
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1600&auto=format&fit=crop',
    collaborators: 2,
    accentColor: 'var(--color-blue)',
  },
  {
    id: 2,
    destination: 'Amalfi Coast Escape',
    dates: 'Jun 05 - Jun 15, 2026',
    status: 'BOOKED',
    progress: 100,
    imageUrl: 'https://images.unsplash.com/photo-1533050487297-09b450131914?q=80&w=1600&auto=format&fit=crop',
    collaborators: 4,
    accentColor: 'var(--color-green)',
  },
]

export default function TripOverviewPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const trip = MOCK_TRIPS.find(t => String(t.id) === tripId)

  if (!trip) return <p>Trip not found</p>

  return <TripDetail trip={trip} />
}
```

**Step 3: Create itinerary page**

Create `src/app/trips/[tripId]/itinerary/page.tsx`:

```tsx
"use client"

import { Itinerary } from '@/components/Itinerary/Itinerary'

export default function ItineraryPage() {
  return <Itinerary />
}
```

**Step 4: Create budget page**

Create `src/app/trips/[tripId]/budget/page.tsx`:

```tsx
"use client"

import { Budget } from '@/components/Budget/Budget'

export default function BudgetPage() {
  return <Budget />
}
```

**Step 5: Create voting page**

Create `src/app/trips/[tripId]/voting/page.tsx`:

```tsx
"use client"

import { Voting } from '@/components/Voting/Voting'

export default function VotingPage() {
  return <Voting />
}
```

**Step 6: Verify full navigation**

```bash
npm run dev
```

Expected:
- `/` shows the dashboard
- Clicking a trip navigates to `/trips/1`
- Tab navigation works: Overview, Itinerary, Budget, Voting
- Sidebar highlights the active trip
- Theme toggle works

**Note:** There may be TypeScript or import errors to fix. Common issues:
- Components importing from `'./App'` or relative paths that no longer exist
- Missing `TripData` interface — extract to `src/types/trip.ts`
- Any Vite-specific imports (`import.meta.env.VITE_*`) need to change to `process.env.NEXT_PUBLIC_*`

Fix any compilation errors before committing.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: create trip pages with tab navigation (overview, itinerary, budget, voting)"
```

---

## Phase 3: Blind Budgeting Foundation

### Task 10: Create Database Schema

**Files:**
- Create: `supabase/migrations/001_foundation.sql`

Run this SQL in the Supabase SQL Editor (Dashboard > SQL Editor).

**Step 1: Write and run the migration**

```sql
-- Foundation tables for tripflow

-- Profiles (mock auth users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trips
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  destination TEXT,
  start_date DATE,
  end_date DATE,
  currency_code CHAR(3) NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trip Members
CREATE TABLE trip_members (
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'organizer', 'member', 'guest')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (trip_id, user_id)
);

-- Blind Budgets
CREATE TABLE blind_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0 AND amount_cents <= 10000000),
  currency_code CHAR(3) NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(trip_id, user_id)
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blind_budgets_updated_at
  BEFORE UPDATE ON blind_budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Index for group limit queries
CREATE INDEX idx_blind_budgets_trip_id ON blind_budgets(trip_id);

-- Seed mock users
INSERT INTO profiles (id, display_name, avatar_url) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Pedro', 'https://i.pravatar.cc/150?u=pedro'),
  ('00000000-0000-0000-0000-000000000002', 'Sarah J.', 'https://i.pravatar.cc/150?u=sarah'),
  ('00000000-0000-0000-0000-000000000003', 'Alex C.', 'https://i.pravatar.cc/150?u=alex'),
  ('00000000-0000-0000-0000-000000000004', 'Jessica L.', 'https://i.pravatar.cc/150?u=jessica');

-- Seed a mock trip
INSERT INTO trips (id, name, destination, start_date, end_date, currency_code) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Japan Circuit', 'Tokyo, Kyoto, Osaka', '2026-10-12', '2026-10-26', 'USD');

-- Add all users as trip members
INSERT INTO trip_members (trip_id, user_id, role) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'owner'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'member'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'member'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'member');
```

Save this file locally as `supabase/migrations/001_foundation.sql`.

**Step 2: Verify in Supabase dashboard**

Go to Table Editor. Confirm: `profiles` (4 rows), `trips` (1 row), `trip_members` (4 rows), `blind_budgets` (0 rows).

**Step 3: Disable RLS for mock auth phase**

Verify RLS is disabled on all 4 tables (off by default for new tables).

**Step 4: Commit**

```bash
mkdir -p supabase/migrations
git add supabase/migrations/001_foundation.sql
git commit -m "feat: add foundation database schema with seed data"
```

---

### Task 11: Create TypeScript Types for Database

**Files:**
- Create: `src/types/database.ts`

**Step 1: Create database types**

Create `src/types/database.ts`:

```typescript
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          display_name: string
          avatar_url?: string | null
        }
        Update: {
          display_name?: string
          avatar_url?: string | null
        }
      }
      trips: {
        Row: {
          id: string
          name: string
          destination: string | null
          start_date: string | null
          end_date: string | null
          currency_code: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          destination?: string | null
          start_date?: string | null
          end_date?: string | null
          currency_code?: string
        }
        Update: {
          name?: string
          destination?: string | null
          start_date?: string | null
          end_date?: string | null
          currency_code?: string
        }
      }
      trip_members: {
        Row: {
          trip_id: string
          user_id: string
          role: 'owner' | 'organizer' | 'member' | 'guest'
          joined_at: string
        }
        Insert: {
          trip_id: string
          user_id: string
          role?: 'owner' | 'organizer' | 'member' | 'guest'
        }
        Update: {
          role?: 'owner' | 'organizer' | 'member' | 'guest'
        }
      }
      blind_budgets: {
        Row: {
          id: string
          trip_id: string
          user_id: string
          amount_cents: number
          currency_code: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          user_id: string
          amount_cents: number
          currency_code?: string
        }
        Update: {
          amount_cents?: number
          currency_code?: string
        }
      }
    }
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Trip = Database['public']['Tables']['trips']['Row']
export type TripMember = Database['public']['Tables']['trip_members']['Row']
export type BlindBudget = Database['public']['Tables']['blind_budgets']['Row']
```

**Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No type errors from this file (there may be errors from copied components — those will be fixed in context).

**Step 3: Commit**

```bash
git add src/types/database.ts
git commit -m "feat: add TypeScript types for database schema"
```

---

### Task 12: Create Mock Auth Context

**Files:**
- Create: `src/lib/mock-auth.tsx`
- Modify: `src/components/layout/Providers.tsx` (wrap with MockAuthProvider)

**Step 1: Create mock auth provider**

Create `src/lib/mock-auth.tsx`:

```tsx
"use client"

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Profile } from '@/types/database'

const MOCK_USERS: Profile[] = [
  { id: '00000000-0000-0000-0000-000000000001', display_name: 'Pedro', avatar_url: 'https://i.pravatar.cc/150?u=pedro', created_at: '' },
  { id: '00000000-0000-0000-0000-000000000002', display_name: 'Sarah J.', avatar_url: 'https://i.pravatar.cc/150?u=sarah', created_at: '' },
  { id: '00000000-0000-0000-0000-000000000003', display_name: 'Alex C.', avatar_url: 'https://i.pravatar.cc/150?u=alex', created_at: '' },
  { id: '00000000-0000-0000-0000-000000000004', display_name: 'Jessica L.', avatar_url: 'https://i.pravatar.cc/150?u=jessica', created_at: '' },
]

interface MockAuthContextValue {
  user: Profile
  availableUsers: Profile[]
  switchUser: (userId: string) => void
}

const MockAuthContext = createContext<MockAuthContextValue | null>(null)

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState(MOCK_USERS[0].id)
  const user = MOCK_USERS.find(u => u.id === currentUserId) ?? MOCK_USERS[0]

  return (
    <MockAuthContext.Provider value={{ user, availableUsers: MOCK_USERS, switchUser: setCurrentUserId }}>
      {children}
    </MockAuthContext.Provider>
  )
}

export function useMockAuth() {
  const ctx = useContext(MockAuthContext)
  if (!ctx) throw new Error('useMockAuth must be used within MockAuthProvider')
  return ctx
}
```

**Step 2: Add MockAuthProvider to Providers**

Update `src/components/layout/Providers.tsx`:

```tsx
"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MockAuthProvider } from '@/lib/mock-auth'
import { useState, type ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      })
  )

  return (
    <MockAuthProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </MockAuthProvider>
  )
}
```

**Step 3: Verify**

```bash
npm run dev
```

Expected: App works as before (mock auth is invisible until used).

**Step 4: Commit**

```bash
git add src/lib/mock-auth.tsx src/components/layout/Providers.tsx
git commit -m "feat: add mock auth context with 4 test users"
```

---

## Phase 4: Blind Budgeting Logic

### Task 13: Create Blind Budget Business Logic (TDD)

**Files:**
- Create: `src/lib/blind-budget.ts`
- Create: `src/lib/__tests__/blind-budget.test.ts`

**Step 1: Write failing tests**

Create `src/lib/__tests__/blind-budget.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import {
  calculateGroupLimit,
  centsToDollars,
  dollarsToCents,
  formatBudgetAmount,
  isUserSettingGroupMin,
} from '../blind-budget'

describe('centsToDollars', () => {
  it('converts cents to dollars', () => {
    expect(centsToDollars(500000)).toBe(5000)
  })

  it('handles zero', () => {
    expect(centsToDollars(0)).toBe(0)
  })
})

describe('dollarsToCents', () => {
  it('converts dollars to cents', () => {
    expect(dollarsToCents(5000)).toBe(500000)
  })

  it('rounds to avoid floating point issues', () => {
    expect(dollarsToCents(49.99)).toBe(4999)
  })
})

describe('formatBudgetAmount', () => {
  it('formats USD amounts', () => {
    expect(formatBudgetAmount(500000, 'USD')).toBe('$5,000')
  })

  it('formats JPY amounts (no decimals)', () => {
    expect(formatBudgetAmount(50000, 'JPY')).toBe('¥50,000')
  })

  it('formats EUR amounts', () => {
    expect(formatBudgetAmount(300000, 'EUR')).toBe('€3,000')
  })
})

describe('calculateGroupLimit', () => {
  it('returns MIN of all budgets', () => {
    const budgets = [
      { amount_cents: 500000 },
      { amount_cents: 300000 },
      { amount_cents: 800000 },
    ]
    expect(calculateGroupLimit(budgets)).toBe(300000)
  })

  it('returns null when no budgets', () => {
    expect(calculateGroupLimit([])).toBeNull()
  })

  it('returns the single budget when only one', () => {
    expect(calculateGroupLimit([{ amount_cents: 500000 }])).toBe(500000)
  })

  it('handles zero budget (valid — free trip)', () => {
    const budgets = [{ amount_cents: 500000 }, { amount_cents: 0 }]
    expect(calculateGroupLimit(budgets)).toBe(0)
  })
})

describe('isUserSettingGroupMin', () => {
  it('returns true when user has the lowest budget', () => {
    const allBudgets = [
      { user_id: 'a', amount_cents: 300000 },
      { user_id: 'b', amount_cents: 500000 },
      { user_id: 'c', amount_cents: 800000 },
    ]
    expect(isUserSettingGroupMin('a', allBudgets)).toBe(true)
  })

  it('returns false when user is not the lowest', () => {
    const allBudgets = [
      { user_id: 'a', amount_cents: 300000 },
      { user_id: 'b', amount_cents: 500000 },
    ]
    expect(isUserSettingGroupMin('b', allBudgets)).toBe(false)
  })

  it('returns false when tied (multiple at minimum)', () => {
    const allBudgets = [
      { user_id: 'a', amount_cents: 300000 },
      { user_id: 'b', amount_cents: 300000 },
    ]
    expect(isUserSettingGroupMin('a', allBudgets)).toBe(false)
  })

  it('returns false when no budgets', () => {
    expect(isUserSettingGroupMin('a', [])).toBe(false)
  })
})
```

**Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: All tests fail (module not found).

**Step 3: Implement the business logic**

Create `src/lib/blind-budget.ts`:

```typescript
/**
 * Blind Budget business logic.
 * Pure functions — no Supabase dependency, no React dependency.
 * Amounts are always in cents to avoid floating point issues.
 */

export function centsToDollars(cents: number): number {
  return cents / 100
}

export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100)
}

export function formatBudgetAmount(amountCents: number, currencyCode: string): string {
  const dollars = centsToDollars(amountCents)

  const currencyMap: Record<string, { locale: string; currency: string }> = {
    USD: { locale: 'en-US', currency: 'USD' },
    EUR: { locale: 'en-US', currency: 'EUR' },
    GBP: { locale: 'en-GB', currency: 'GBP' },
    JPY: { locale: 'ja-JP', currency: 'JPY' },
  }

  const config = currencyMap[currencyCode] ?? { locale: 'en-US', currency: currencyCode }

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(dollars)
}

export function calculateGroupLimit(
  budgets: Array<{ amount_cents: number }>
): number | null {
  if (budgets.length === 0) return null
  return Math.min(...budgets.map(b => b.amount_cents))
}

export function isUserSettingGroupMin(
  userId: string,
  allBudgets: Array<{ user_id: string; amount_cents: number }>
): boolean {
  if (allBudgets.length === 0) return false

  const min = Math.min(...allBudgets.map(b => b.amount_cents))
  const usersAtMin = allBudgets.filter(b => b.amount_cents === min)

  // Only flag if this user is the SOLE minimum (not tied)
  return usersAtMin.length === 1 && usersAtMin[0].user_id === userId
}
```

**Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: All tests pass.

**Step 5: Commit**

```bash
git add src/lib/blind-budget.ts src/lib/__tests__/blind-budget.test.ts
git commit -m "feat: add blind budget business logic with tests"
```

---

### Task 14: Create Server Actions for Blind Budget

**Files:**
- Create: `src/app/actions/blind-budget.ts`

This is the key architectural difference from the old Vite plan. All budget operations run as Server Actions — the `SUPABASE_SERVICE_ROLE_KEY` stays server-side. The `getGroupLimit` action returns only the aggregate, never individual amounts.

**Step 1: Create server actions**

Create `src/app/actions/blind-budget.ts`:

```typescript
"use server"

import { createAdminClient } from '@/lib/supabase/admin'
import { calculateGroupLimit, isUserSettingGroupMin } from '@/lib/blind-budget'
import type { BlindBudget } from '@/types/database'

/**
 * Set or update a user's blind budget for a trip.
 * Server Action — service_role key never leaves the server.
 */
export async function setBudgetAction(
  tripId: string,
  userId: string,
  amountCents: number
): Promise<BlindBudget> {
  if (amountCents < 0 || amountCents > 10000000) {
    throw new Error('Budget must be between $0 and $100,000')
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('blind_budgets')
    .upsert(
      { trip_id: tripId, user_id: userId, amount_cents: amountCents },
      { onConflict: 'trip_id,user_id' }
    )
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

/**
 * Get the current user's own budget for a trip.
 * Only the user's own amount is returned — no other budgets.
 */
export async function getMyBudgetAction(
  tripId: string,
  userId: string
): Promise<BlindBudget | null> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('blind_budgets')
    .select('*')
    .eq('trip_id', tripId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data
}

/**
 * Get the group's affordable limit (MIN of all budgets).
 * PRIVACY: Returns only the aggregate and count — never individual amounts.
 */
export async function getGroupLimitAction(
  tripId: string
): Promise<{ limitCents: number | null; budgetCount: number }> {
  const supabase = createAdminClient()
  const { data: budgets, error } = await supabase
    .from('blind_budgets')
    .select('amount_cents')
    .eq('trip_id', tripId)

  if (error) throw new Error(error.message)
  if (!budgets || budgets.length === 0) return { limitCents: null, budgetCount: 0 }

  const limitCents = calculateGroupLimit(budgets)
  return { limitCents, budgetCount: budgets.length }
}

/**
 * Get the count of trip members.
 */
export async function getMemberCountAction(
  tripId: string
): Promise<number> {
  const supabase = createAdminClient()
  const { count, error } = await supabase
    .from('trip_members')
    .select('*', { count: 'exact', head: true })
    .eq('trip_id', tripId)

  if (error) throw new Error(error.message)
  return count ?? 0
}

/**
 * Check if the current user's budget is the sole group minimum.
 * PRIVACY: Returns only a boolean — no amounts.
 */
export async function checkIsSettingGroupMinAction(
  tripId: string,
  userId: string
): Promise<boolean> {
  const supabase = createAdminClient()
  const { data: budgets, error } = await supabase
    .from('blind_budgets')
    .select('user_id, amount_cents')
    .eq('trip_id', tripId)

  if (error) throw new Error(error.message)
  if (!budgets || budgets.length === 0) return false

  return isUserSettingGroupMin(userId, budgets)
}

/**
 * Delete a user's budget for a trip.
 */
export async function deleteBudgetAction(
  tripId: string,
  userId: string
): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('blind_budgets')
    .delete()
    .eq('trip_id', tripId)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
}
```

**Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors from this file.

**Step 3: Commit**

```bash
git add src/app/actions/blind-budget.ts
git commit -m "feat: add Server Actions for blind budget operations (privacy-first)"
```

---

### Task 15: Create useBlindBudget Hook

**Files:**
- Create: `src/hooks/use-blind-budget.ts`

This hook uses React Query to call the server actions from client components.

**Step 1: Create the hook**

Create `src/hooks/use-blind-budget.ts`:

```typescript
"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMockAuth } from '@/lib/mock-auth'
import {
  setBudgetAction,
  getMyBudgetAction,
  getGroupLimitAction,
  getMemberCountAction,
  checkIsSettingGroupMinAction,
} from '@/app/actions/blind-budget'

const TRIP_ID = '10000000-0000-0000-0000-000000000001' // Mock trip

export function useBlindBudget(tripId: string = TRIP_ID) {
  const { user } = useMockAuth()
  const queryClient = useQueryClient()

  // Fetch current user's budget
  const myBudgetQuery = useQuery({
    queryKey: ['blind-budget', 'my', tripId, user.id],
    queryFn: () => getMyBudgetAction(tripId, user.id),
  })

  // Fetch group limit (server calculates MIN, returns only aggregate)
  const groupLimitQuery = useQuery({
    queryKey: ['blind-budget', 'group', tripId],
    queryFn: () => getGroupLimitAction(tripId),
  })

  // Fetch trip member count
  const memberCountQuery = useQuery({
    queryKey: ['trip-members', tripId],
    queryFn: () => getMemberCountAction(tripId),
  })

  // Check if user is setting group minimum
  const isMinQuery = useQuery({
    queryKey: ['blind-budget', 'is-min', tripId, user.id],
    queryFn: () => checkIsSettingGroupMinAction(tripId, user.id),
    enabled: !!myBudgetQuery.data,
  })

  // Set or update budget
  const setBudgetMutation = useMutation({
    mutationFn: (amountCents: number) => setBudgetAction(tripId, user.id, amountCents),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blind-budget'] })
    },
  })

  const groupLimit = groupLimitQuery.data
  const memberCount = memberCountQuery.data ?? 0

  return {
    // User's own budget
    myBudget: myBudgetQuery.data ?? null,
    myBudgetLoading: myBudgetQuery.isPending,

    // Group aggregate (no individual amounts ever reach client)
    groupLimitCents: groupLimit?.limitCents ?? null,
    budgetCount: groupLimit?.budgetCount ?? 0,
    memberCount,
    allBudgetsReady: (groupLimit?.budgetCount ?? 0) === memberCount && memberCount > 0,

    // Status flags
    isSettingGroupMin: isMinQuery.data ?? false,

    // Mutations
    setBudget: setBudgetMutation.mutate,
    setBudgetPending: setBudgetMutation.isPending,
  }
}
```

**Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

**Step 3: Commit**

```bash
git add src/hooks/use-blind-budget.ts
git commit -m "feat: add useBlindBudget hook calling server actions via React Query"
```

---

## Phase 5: Blind Budgeting UI

### Task 16: Build PrivacyIndicator Component

**Files:**
- Create: `src/components/BlindBudget/PrivacyIndicator.tsx`

**Step 1: Create the component**

Create `src/components/BlindBudget/PrivacyIndicator.tsx`:

```tsx
import { Lock, Shield } from 'lucide-react'

interface PrivacyIndicatorProps {
  variant?: 'badge' | 'inline'
  label?: string
}

export function PrivacyIndicator({ variant = 'badge', label = 'Private' }: PrivacyIndicatorProps) {
  if (variant === 'inline') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-teal">
        <Lock size={12} />
        {label}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-privacy-light px-3 py-1 text-xs font-semibold text-teal">
      <Shield size={12} />
      {label}
    </span>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/BlindBudget/PrivacyIndicator.tsx
git commit -m "feat: add PrivacyIndicator component (teal lock badge)"
```

---

### Task 17: Build BudgetExplainerCarousel

**Files:**
- Create: `src/components/BlindBudget/BudgetExplainerCarousel.tsx`

**Step 1: Create the component**

Create `src/components/BlindBudget/BudgetExplainerCarousel.tsx`:

```tsx
"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Users, TrendingUp, ArrowRight, ArrowLeft } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

const STEPS = [
  {
    icon: Lock,
    title: 'Your budget stays private',
    description: 'Set a personal budget cap that only you can see. Not even the trip organizer knows your number.',
    color: 'text-teal',
    bg: 'bg-privacy-light',
  },
  {
    icon: Users,
    title: 'We calculate a group limit',
    description: "The system takes the minimum of everyone's private caps to find what the whole group can afford. No individual amounts are ever revealed.",
    color: 'text-teal',
    bg: 'bg-privacy-light',
  },
  {
    icon: TrendingUp,
    title: 'Plan together, spend smart',
    description: "Activities and suggestions are filtered by the group's affordable limit. Everyone plans within a comfortable range without awkward money conversations.",
    color: 'text-teal',
    bg: 'bg-privacy-light',
  },
]

interface BudgetExplainerCarouselProps {
  open: boolean
  onClose: () => void
  onComplete: () => void
}

export function BudgetExplainerCarousel({ open, onClose, onComplete }: BudgetExplainerCarouselProps) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1
  const Icon = current.icon

  const handleNext = () => {
    if (isLast) {
      onComplete()
      setStep(0)
    } else {
      setStep(s => s + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">How Blind Budgeting Works</DialogTitle>
          <DialogDescription className="sr-only">Learn how private budget caps work</DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-4 py-6 text-center"
          >
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${current.bg}`}>
              <Icon size={28} className={current.color} />
            </div>
            <h3 className="text-base font-semibold">{current.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed px-4">{current.description}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2 pb-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-teal' : 'w-1.5 bg-muted'}`}
            />
          ))}
        </div>

        <div className="flex justify-between pt-2">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-0 transition-all"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-1 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            {isLast ? 'Set My Budget' : 'Next'} <ArrowRight size={14} />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/BlindBudget/BudgetExplainerCarousel.tsx
git commit -m "feat: add BudgetExplainerCarousel (3-step onboarding)"
```

---

### Task 18: Build BlindBudgetForm Component

**Files:**
- Create: `src/components/BlindBudget/BlindBudgetForm.tsx`

**Step 1: Create the component**

Create `src/components/BlindBudget/BlindBudgetForm.tsx`:

```tsx
"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, Check, Pencil } from 'lucide-react'
import { PrivacyIndicator } from './PrivacyIndicator'
import { centsToDollars, dollarsToCents, formatBudgetAmount } from '@/lib/blind-budget'

interface BlindBudgetFormProps {
  currentAmountCents: number | null
  currencyCode: string
  isPending: boolean
  isSettingGroupMin: boolean
  onSubmit: (amountCents: number) => void
}

export function BlindBudgetForm({
  currentAmountCents,
  currencyCode,
  isPending,
  isSettingGroupMin,
  onSubmit,
}: BlindBudgetFormProps) {
  const hasExisting = currentAmountCents !== null
  const [isEditing, setIsEditing] = useState(!hasExisting)
  const [inputValue, setInputValue] = useState(
    hasExisting ? String(centsToDollars(currentAmountCents)) : ''
  )

  useEffect(() => {
    if (currentAmountCents !== null) {
      setInputValue(String(centsToDollars(currentAmountCents)))
      setIsEditing(false)
    } else {
      setInputValue('')
      setIsEditing(true)
    }
  }, [currentAmountCents])

  const handleSave = () => {
    const dollars = parseFloat(inputValue)
    if (isNaN(dollars) || dollars < 0) return
    if (dollars > 100000) return
    onSubmit(dollarsToCents(dollars))
    setIsEditing(false)
  }

  // Locked display state
  if (hasExisting && !isEditing) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-teal" />
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Your Private Budget</span>
          </div>
          <PrivacyIndicator />
        </div>

        <div className="flex items-center justify-between rounded-xl p-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {formatBudgetAmount(currentAmountCents!, currencyCode)}
          </span>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-teal/10 text-teal"
          >
            <Pencil size={14} /> Edit
          </button>
        </div>

        {isSettingGroupMin && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
            style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#D97706' }}
          >
            Your budget is currently setting the group limit
          </motion.div>
        )}
      </div>
    )
  }

  // Editing / new budget state
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock size={16} className="text-teal" />
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {hasExisting ? 'Edit Your Budget' : 'Set Your Private Budget'}
          </span>
        </div>
        <PrivacyIndicator />
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>$</span>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="0"
            min={0}
            max={100000}
            step={100}
            className="w-full rounded-xl py-3 pl-8 pr-4 text-xl font-semibold outline-none transition-colors"
            style={{ background: 'var(--bg-surface)', border: '2px solid var(--accent-primary)', color: 'var(--text-primary)' }}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
        </div>
        <button
          onClick={handleSave}
          disabled={isPending || !inputValue}
          className="flex items-center gap-2 rounded-xl px-5 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: 'var(--accent-primary)' }}
        >
          <Check size={16} />
          {isPending ? 'Saving...' : 'Save'}
        </button>
      </div>

      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        Only you can see this amount. It will never be shared with other members.
      </p>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/BlindBudget/BlindBudgetForm.tsx
git commit -m "feat: add BlindBudgetForm with edit/locked states"
```

---

### Task 19: Build GroupLimitDisplay Component

**Files:**
- Create: `src/components/BlindBudget/GroupLimitDisplay.tsx`

**Step 1: Create the component**

Create `src/components/BlindBudget/GroupLimitDisplay.tsx`:

```tsx
"use client"

import { motion } from 'framer-motion'
import { Users, Lock, CheckCircle } from 'lucide-react'
import { formatBudgetAmount } from '@/lib/blind-budget'

interface GroupLimitDisplayProps {
  groupLimitCents: number | null
  budgetCount: number
  memberCount: number
  currencyCode: string
  allReady: boolean
}

export function GroupLimitDisplay({
  groupLimitCents,
  budgetCount,
  memberCount,
  currencyCode,
  allReady,
}: GroupLimitDisplayProps) {
  const progress = memberCount > 0 ? (budgetCount / memberCount) * 100 : 0

  if (budgetCount === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl p-6 text-center" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
        <Users size={24} style={{ color: 'var(--text-secondary)' }} />
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          Waiting for members to set their budgets
        </p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          0 of {memberCount} members ready
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-xl p-5" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} style={{ color: 'var(--text-secondary)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Group Affordable Limit</span>
          </div>
          {allReady && (
            <span className="flex items-center gap-1 text-xs font-medium text-teal">
              <CheckCircle size={12} /> All set
            </span>
          )}
        </div>

        {groupLimitCents !== null ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            {formatBudgetAmount(groupLimitCents, currencyCode)}
          </motion.div>
        ) : (
          <div className="text-lg" style={{ color: 'var(--text-secondary)' }}>Calculating...</div>
        )}

        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--bg-surface-hover)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--accent-primary)' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <Lock size={10} />
            {budgetCount} of {memberCount} members set their budget
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/BlindBudget/GroupLimitDisplay.tsx
git commit -m "feat: add GroupLimitDisplay with progress bar"
```

---

### Task 20: Build MockUserSwitcher + Integrate into Budget Page

**Files:**
- Create: `src/components/BlindBudget/MockUserSwitcher.tsx`
- Modify: `src/components/Budget/Budget.tsx`

**Step 1: Create MockUserSwitcher**

Create `src/components/BlindBudget/MockUserSwitcher.tsx`:

```tsx
"use client"

import { useMockAuth } from '@/lib/mock-auth'

export function MockUserSwitcher() {
  const { user, availableUsers, switchUser } = useMockAuth()

  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-2" style={{ background: 'var(--bg-surface)', border: '1px dashed var(--border-subtle)' }}>
      <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Viewing as:</span>
      <div className="flex gap-1">
        {availableUsers.map((u) => (
          <button
            key={u.id}
            onClick={() => switchUser(u.id)}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all"
            style={{
              background: u.id === user.id ? 'var(--accent-primary)' : 'transparent',
              color: u.id === user.id ? 'white' : 'var(--text-secondary)',
            }}
            title={u.display_name}
          >
            <img src={u.avatar_url ?? ''} alt={u.display_name} className="h-5 w-5 rounded-full object-cover" />
            {u.display_name.split(' ')[0]}
          </button>
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Integrate blind budgeting into Budget.tsx**

Open `src/components/Budget/Budget.tsx` and make these changes:

**2a. Add imports at the top** (after the `"use client"` directive):

```typescript
import { useBlindBudget } from '@/hooks/use-blind-budget'
import { useMockAuth } from '@/lib/mock-auth'
import { BlindBudgetForm } from '../BlindBudget/BlindBudgetForm'
import { GroupLimitDisplay } from '../BlindBudget/GroupLimitDisplay'
import { BudgetExplainerCarousel } from '../BlindBudget/BudgetExplainerCarousel'
import { MockUserSwitcher } from '../BlindBudget/MockUserSwitcher'
import { centsToDollars, formatBudgetAmount } from '@/lib/blind-budget'
```

**2b. Replace hardcoded budget state** with the hook:

Remove:
```typescript
const [isBlindMode, setIsBlindMode] = useState(true);
const totalBudget = 5000;
const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
const percentSpent = (totalSpent / totalBudget) * 100;
```

Replace with:
```typescript
const { user } = useMockAuth()
const {
  myBudget,
  myBudgetLoading,
  groupLimitCents,
  budgetCount,
  memberCount,
  allBudgetsReady,
  isSettingGroupMin,
  setBudget,
  setBudgetPending,
} = useBlindBudget()

const [isExplainerOpen, setIsExplainerOpen] = useState(false)

const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
const totalBudget = groupLimitCents !== null ? centsToDollars(groupLimitCents) : null
const percentSpent = totalBudget ? (totalSpent / totalBudget) * 100 : 0
```

**2c. Add MockUserSwitcher** to the header area (near the currency selector).

**2d. Replace the metrics grid** with the blind budgeting components:

```tsx
{/* Blind Budgeting Section */}
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
  <Card className="metric-card">
    <CardContent style={{ padding: '24px' }}>
      <BlindBudgetForm
        currentAmountCents={myBudget?.amount_cents ?? null}
        currencyCode={currency}
        isPending={setBudgetPending}
        isSettingGroupMin={isSettingGroupMin}
        onSubmit={setBudget}
      />
    </CardContent>
  </Card>

  <Card className="metric-card">
    <CardContent style={{ padding: '24px' }}>
      <GroupLimitDisplay
        groupLimitCents={groupLimitCents}
        budgetCount={budgetCount}
        memberCount={memberCount}
        currencyCode={currency}
        allReady={allBudgetsReady}
      />
    </CardContent>
  </Card>
</div>
```

**2e. Replace the old blind budget modal** with:

```tsx
<BudgetExplainerCarousel
  open={isExplainerOpen}
  onClose={() => setIsExplainerOpen(false)}
  onComplete={() => setIsExplainerOpen(false)}
/>
```

**2f. Remove unused imports** (EyeOff, Eye, Lock from lucide if they came from old blind mode toggle, Wallet, etc.)

**Step 3: Verify**

```bash
npm run dev
```

Navigate to `/trips/1/budget`. Expected:
- MockUserSwitcher bar at top
- BlindBudgetForm on left, GroupLimitDisplay on right
- Existing expense list and categories below

**Step 4: Commit**

```bash
git add src/components/BlindBudget/MockUserSwitcher.tsx src/components/Budget/Budget.tsx
git commit -m "feat: integrate blind budgeting into Budget page with server actions"
```

---

## Phase 6: Verification

### Task 21: End-to-End Verification

**Step 1: Start the app**

```bash
npm run dev
```

**Step 2: Test the full flow**

1. Navigate to a trip > Budget tab (`/trips/1/budget`)
2. As Pedro: see empty blind budget form with lock icon
3. Enter $5,000 and save — see it lock with "Private" badge
4. Switch to Sarah (mock user switcher) — Pedro's budget is invisible, Sarah sees empty form
5. As Sarah: enter $3,000 and save
6. Both users now see "Group Affordable Limit: $3,000" (MIN of 5000, 3000)
7. Switch back to Pedro — amber "Your budget is not setting the group limit" is NOT shown (Pedro's is higher)
8. Switch to Sarah — see amber "Your budget is currently setting the group limit"
9. Progress bar shows "2 of 4 members set their budget"
10. Navigate between tabs and back — data persists

**Step 3: Run all tests**

```bash
npm test
```

Expected: All business logic tests pass.

**Step 4: Run type check**

```bash
npx tsc --noEmit
```

Expected: No errors.

**Step 5: Run lint**

```bash
npm run lint
```

Expected: No errors (or only pre-existing warnings from copied components).

**Step 6: Run build**

```bash
npm run build
```

Expected: Build completes successfully. This verifies Server Actions compile correctly.

**Step 7: Final commit**

```bash
git add -A
git commit -m "feat: complete blind budgeting MVP with Next.js Server Actions and mock auth"
```

---

## Summary

| Task | What | Key Files |
|------|------|-----------|
| 1 | Create Next.js 16 project | package.json, next.config.ts |
| 2 | Tailwind v4 theme tokens | globals.css |
| 3 | Install shadcn/ui | components.json, lib/utils.ts |
| 4 | Install Vitest | vitest.config.mts, test/setup.ts |
| 5 | Supabase SSR clients | lib/supabase/{client,server,admin}.ts, middleware.ts |
| 6 | Copy existing components | components/**/\*.tsx (with "use client") |
| 7 | Root layout + sidebar | layout.tsx, Sidebar.tsx, Providers.tsx, ThemeProvider.tsx |
| 8 | Dashboard page | app/page.tsx |
| 9 | Trip pages + tab nav | app/trips/[tripId]/{layout,page}.tsx + sub-pages |
| 10 | Database schema | supabase/migrations/001_foundation.sql |
| 11 | TypeScript DB types | types/database.ts |
| 12 | Mock auth context | lib/mock-auth.tsx |
| 13 | Business logic (TDD) | lib/blind-budget.ts + tests |
| 14 | **Server Actions** | app/actions/blind-budget.ts |
| 15 | useBlindBudget hook | hooks/use-blind-budget.ts |
| 16 | PrivacyIndicator | BlindBudget/PrivacyIndicator.tsx |
| 17 | BudgetExplainerCarousel | BlindBudget/BudgetExplainerCarousel.tsx |
| 18 | BlindBudgetForm | BlindBudget/BlindBudgetForm.tsx |
| 19 | GroupLimitDisplay | BlindBudget/GroupLimitDisplay.tsx |
| 20 | MockUserSwitcher + integration | BlindBudget/MockUserSwitcher.tsx, Budget.tsx |
| 21 | E2E verification | (all files) |

## Privacy Architecture (Next.js advantage)

```
Client (Browser)                    Server (Next.js)
──────────────────                  ──────────────────

  BlindBudgetForm ──setBudget()──→  setBudgetAction()
    (input: $)                        ↓
                                    SUPABASE_SERVICE_ROLE_KEY
                                    (never exposed to client)
                                      ↓
                                    INSERT/UPSERT blind_budgets
                                      ↓
  myBudget ←──────getMyBudget()───  SELECT WHERE user_id = me
  (only MY amount)                    ↓

  GroupLimitDisplay ←─getGroup()──  SELECT all amounts
    (only MIN + count)                ↓ calculateGroupLimit()
                                    returns { limitCents, count }
                                    (individual amounts STAY here)
```
