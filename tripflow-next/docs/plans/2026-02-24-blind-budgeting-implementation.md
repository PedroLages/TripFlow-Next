# Blind Budgeting Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Wire up tripflow-web's existing Budget UI to a real Supabase backend with blind budgeting — each trip member sets a private budget cap, system calculates group limit as MIN(all caps).

**Architecture:** React/Vite SPA with Supabase for data. Mock auth context simulates multiple users for demo. Tailwind v4 + shadcn/ui for new components alongside existing custom CSS. Pure functions for business logic, React Query hooks for data fetching.

**Tech Stack:** React 19, Vite 7, TypeScript 5.9, Supabase JS v2, Tailwind CSS v4, shadcn/ui, Framer Motion, Vitest, Zod

**Reference docs:**
- Design: `docs/plans/2026-02-24-tripos-feature-integration-design.md`
- TripOS blind budgeting spec: `/Volumes/SSD/Dev/Apps/TripOS/docs/strategy/blind-budgeting-deep-dive.md`
- TripOS UX spec: `/Volumes/SSD/Dev/Apps/TripOS/docs/design/ux-spec.md`

---

## Phase 1: Infrastructure Setup

### Task 1: Install Tailwind CSS v4

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Modify: `src/index.css` (add import at top)

**Step 1: Install dependencies**

Run:
```bash
cd /Volumes/SSD/Dev/Asia\ Trip/tripflow-web
npm install tailwindcss @tailwindcss/vite
```

**Step 2: Add Vite plugin**

Modify `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**Step 3: Add Tailwind import to CSS entry**

Add to the very top of `src/index.css` (before the font imports):
```css
@import "tailwindcss";
```

**Step 4: Verify it works**

Run: `npm run dev`
Expected: Dev server starts without errors. Existing UI unchanged.

**Step 5: Commit**

```bash
git add package.json package-lock.json vite.config.ts src/index.css
git commit -m "feat: add Tailwind CSS v4 with Vite plugin"
```

---

### Task 2: Map CSS Variables to Tailwind Theme

**Files:**
- Modify: `src/index.css` (add `@theme` block)

**Step 1: Add Tailwind theme mapping**

Add this block in `src/index.css` right after `@import "tailwindcss";` and before the font imports:

```css
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
```

**Step 2: Verify**

Run: `npm run dev`
Expected: No errors. You can now use `bg-teal`, `text-privacy`, etc. in Tailwind classes.

**Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: map CSS variables to Tailwind theme tokens"
```

---

### Task 3: Add Path Aliases for shadcn/ui

**Files:**
- Modify: `tsconfig.app.json`
- Modify: `vite.config.ts`

**Step 1: Add path aliases to tsconfig**

Add `baseUrl` and `paths` to `tsconfig.app.json` compilerOptions:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

**Step 2: Add Vite path resolution**

Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Step 3: Verify**

Run: `npm run dev`
Expected: No errors.

**Step 4: Commit**

```bash
git add tsconfig.app.json vite.config.ts
git commit -m "feat: add @ path alias for shadcn/ui compatibility"
```

---

### Task 4: Install and Initialize shadcn/ui

**Files:**
- Create: `src/components/ui/` (shadcn components will be added here)
- Create: `src/lib/utils.ts`
- Create: `components.json`

**Step 1: Install shadcn/ui dependencies**

```bash
npm install class-variance-authority clsx tailwind-merge
```

**Step 2: Create utility file**

Create `src/lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Step 3: Initialize shadcn/ui**

```bash
npx shadcn@latest init
```

When prompted:
- Style: New York
- Base color: Neutral
- CSS variables: Yes
- Components directory: `src/components/ui`
- Utils: `src/lib/utils.ts` (already created)

If the CLI asks to overwrite `src/lib/utils.ts`, say yes.

**Step 4: Install first shadcn components we'll need**

```bash
npx shadcn@latest add dialog input label badge tooltip
```

**Step 5: Verify**

Run: `npm run dev`
Expected: Dev server starts. Existing UI unchanged. New shadcn components available in `src/components/ui/`.

Note: shadcn/ui component files will coexist alongside your existing `Button.tsx`, `Card.tsx`, etc. The existing components continue to work unchanged. New blind budgeting components will import from the shadcn versions where appropriate.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: install and configure shadcn/ui with dialog, input, label, badge, tooltip"
```

---

### Task 5: Install Vitest + React Testing Library

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`

**Step 1: Install test dependencies**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @testing-library/user-event
```

**Step 2: Create vitest config**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Step 3: Create test setup**

Create `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom/vitest'
```

**Step 4: Add test script to package.json**

Add to `package.json` scripts:
```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 5: Verify with a smoke test**

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

Run: `npm test`
Expected: 2 tests pass.

**Step 7: Commit**

```bash
git add vitest.config.ts src/test/setup.ts src/lib/__tests__/utils.test.ts package.json package-lock.json
git commit -m "feat: add Vitest + React Testing Library"
```

---

### Task 6: Set Up Supabase Project

**Files:**
- Create: `.env.local`
- Modify: `src/lib/supabase.ts`
- Create: `.env.example`

This task uses a hosted Supabase project (free tier) rather than local Docker for simplicity. Create a new project at https://supabase.com/dashboard.

**Step 1: Create Supabase project**

Go to https://supabase.com/dashboard and create a new project named "tripflow-dev". Note the project URL and anon key from Settings > API.

**Step 2: Create environment files**

Create `.env.local`:
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Create `.env.example`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Step 3: Update Supabase client**

Replace `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Check .env.local')
}

export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || ''
)

// Service role client for operations that bypass RLS (mock auth phase only)
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
export const supabaseAdmin = supabaseServiceKey
  ? createClient<Database>(supabaseUrl || '', supabaseServiceKey)
  : null
```

**Step 4: Add .env.local to .gitignore**

Verify `.gitignore` contains `.env.local` (Vite projects typically include this already). If not, add it.

**Step 5: Commit**

```bash
git add .env.example src/lib/supabase.ts .gitignore
git commit -m "feat: configure Supabase client with typed database and service role"
```

---

## Phase 2: Foundation

### Task 7: Create Database Schema

**Files:**
- Create: `supabase/migrations/001_foundation.sql`

Run this SQL in the Supabase SQL Editor (Dashboard > SQL Editor):

**Step 1: Write and run the migration**

```sql
-- Foundation tables for tripflow-web

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

Also save this file locally for version control:

Create `supabase/migrations/001_foundation.sql` with the SQL above.

**Step 2: Verify in Supabase dashboard**

Go to Table Editor. Confirm you see: `profiles` (4 rows), `trips` (1 row), `trip_members` (4 rows), `blind_budgets` (0 rows).

**Step 3: Disable RLS for mock auth phase**

In Supabase Dashboard > Authentication > Policies, make sure RLS is disabled on all 4 tables (it's off by default for new tables). We'll enable it when we add real auth.

**Step 4: Commit**

```bash
mkdir -p supabase/migrations
git add supabase/migrations/001_foundation.sql
git commit -m "feat: add foundation database schema with seed data"
```

---

### Task 8: Create TypeScript Types for Database

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

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 3: Commit**

```bash
git add src/types/database.ts
git commit -m "feat: add TypeScript types for database schema"
```

---

### Task 9: Create Mock Auth Context

**Files:**
- Create: `src/lib/mock-auth.tsx`
- Modify: `src/App.tsx` (wrap with provider)

**Step 1: Create mock auth provider**

Create `src/lib/mock-auth.tsx`:

```typescript
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
    <MockAuthContext.Provider
      value={{
        user,
        availableUsers: MOCK_USERS,
        switchUser: setCurrentUserId,
      }}
    >
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

**Step 2: Wrap App with MockAuthProvider**

In `src/App.tsx`, add the import at the top:
```typescript
import { MockAuthProvider } from './lib/mock-auth'
```

Wrap the return JSX:
```typescript
return (
  <MockAuthProvider>
    <div className="app-container">
      {/* ... existing JSX unchanged ... */}
    </div>
  </MockAuthProvider>
)
```

**Step 3: Verify**

Run: `npm run dev`
Expected: App works exactly as before (mock auth is invisible until used).

**Step 4: Commit**

```bash
git add src/lib/mock-auth.tsx src/App.tsx
git commit -m "feat: add mock auth context with 4 test users"
```

---

## Phase 3: Blind Budgeting Logic

### Task 10: Create Blind Budget Business Logic (TDD)

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
      { amount_cents: 500000 }, // $5,000
      { amount_cents: 300000 }, // $3,000
      { amount_cents: 800000 }, // $8,000
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
    const budgets = [
      { amount_cents: 500000 },
      { amount_cents: 0 },
    ]
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

Run: `npm test`
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

Run: `npm test`
Expected: All tests pass.

**Step 5: Commit**

```bash
git add src/lib/blind-budget.ts src/lib/__tests__/blind-budget.test.ts
git commit -m "feat: add blind budget business logic with tests"
```

---

### Task 11: Create useBlindBudget Hook

**Files:**
- Create: `src/hooks/use-blind-budget.ts`

This hook handles all Supabase queries for blind budgets. During mock auth phase, it uses the service role client to read/write on behalf of mock users.

**Step 1: Install React Query**

```bash
npm install @tanstack/react-query
```

**Step 2: Create React Query provider**

Create `src/lib/query-provider.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30 seconds
      retry: 1,
    },
  },
})

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

**Step 3: Add QueryProvider to App.tsx**

In `src/App.tsx`, add import:
```typescript
import { QueryProvider } from './lib/query-provider'
```

Wrap inside MockAuthProvider:
```typescript
return (
  <MockAuthProvider>
    <QueryProvider>
      <div className="app-container">
        {/* ... */}
      </div>
    </QueryProvider>
  </MockAuthProvider>
)
```

**Step 4: Create the hook**

Create `src/hooks/use-blind-budget.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { useMockAuth } from '@/lib/mock-auth'
import { calculateGroupLimit, isUserSettingGroupMin } from '@/lib/blind-budget'
import type { BlindBudget } from '@/types/database'

const TRIP_ID = '10000000-0000-0000-0000-000000000001' // Mock trip

// Use admin client during mock auth phase (bypasses RLS)
const db = supabaseAdmin ?? supabase

export function useBlindBudget(tripId: string = TRIP_ID) {
  const { user } = useMockAuth()
  const queryClient = useQueryClient()

  // Fetch current user's budget
  const myBudgetQuery = useQuery({
    queryKey: ['blind-budget', 'my', tripId, user.id],
    queryFn: async (): Promise<BlindBudget | null> => {
      const { data, error } = await db
        .from('blind_budgets')
        .select('*')
        .eq('trip_id', tripId)
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) throw error
      return data
    },
  })

  // Fetch all budgets for group limit calculation
  // In production, this would be an Edge Function that returns only the aggregate.
  // During mock auth, we fetch all to calculate client-side.
  const allBudgetsQuery = useQuery({
    queryKey: ['blind-budget', 'all', tripId],
    queryFn: async (): Promise<BlindBudget[]> => {
      const { data, error } = await db
        .from('blind_budgets')
        .select('*')
        .eq('trip_id', tripId)

      if (error) throw error
      return data ?? []
    },
  })

  // Fetch trip member count
  const membersQuery = useQuery({
    queryKey: ['trip-members', tripId],
    queryFn: async () => {
      const { count, error } = await db
        .from('trip_members')
        .select('*', { count: 'exact', head: true })
        .eq('trip_id', tripId)

      if (error) throw error
      return count ?? 0
    },
  })

  // Set or update budget
  const setBudgetMutation = useMutation({
    mutationFn: async (amountCents: number) => {
      const { data, error } = await db
        .from('blind_budgets')
        .upsert(
          {
            trip_id: tripId,
            user_id: user.id,
            amount_cents: amountCents,
          },
          { onConflict: 'trip_id,user_id' }
        )
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blind-budget', 'my', tripId, user.id] })
      queryClient.invalidateQueries({ queryKey: ['blind-budget', 'all', tripId] })
    },
  })

  // Delete budget
  const deleteBudgetMutation = useMutation({
    mutationFn: async () => {
      const { error } = await db
        .from('blind_budgets')
        .delete()
        .eq('trip_id', tripId)
        .eq('user_id', user.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blind-budget', 'my', tripId, user.id] })
      queryClient.invalidateQueries({ queryKey: ['blind-budget', 'all', tripId] })
    },
  })

  const allBudgets = allBudgetsQuery.data ?? []
  const groupLimitCents = calculateGroupLimit(allBudgets)
  const budgetCount = allBudgets.length
  const memberCount = membersQuery.data ?? 0
  const isSettingGroupMin = myBudgetQuery.data
    ? isUserSettingGroupMin(user.id, allBudgets)
    : false

  return {
    // User's own budget
    myBudget: myBudgetQuery.data,
    myBudgetLoading: myBudgetQuery.isPending,

    // Group aggregate
    groupLimitCents,
    budgetCount,
    memberCount,
    allBudgetsReady: budgetCount === memberCount && memberCount > 0,

    // Status flags
    isSettingGroupMin,

    // Mutations
    setBudget: setBudgetMutation.mutate,
    setBudgetPending: setBudgetMutation.isPending,
    deleteBudget: deleteBudgetMutation.mutate,
  }
}
```

**Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 6: Commit**

```bash
git add src/hooks/use-blind-budget.ts src/lib/query-provider.tsx src/App.tsx package.json package-lock.json
git commit -m "feat: add useBlindBudget hook with React Query + Supabase"
```

---

## Phase 4: Blind Budgeting UI

### Task 12: Build PrivacyIndicator Component

**Files:**
- Create: `src/components/BlindBudget/PrivacyIndicator.tsx`

A small reusable badge showing a teal lock icon + "Private" text. Used on budget inputs to reassure users.

**Step 1: Create the component**

Create `src/components/BlindBudget/PrivacyIndicator.tsx`:

```tsx
import { Lock, Shield } from 'lucide-react'

interface PrivacyIndicatorProps {
  variant?: 'badge' | 'inline'
  label?: string
}

export function PrivacyIndicator({
  variant = 'badge',
  label = 'Private',
}: PrivacyIndicatorProps) {
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

**Step 2: Verify it renders**

Temporarily add to Budget.tsx or test in isolation. The teal color comes from the Tailwind theme token we set up in Task 2.

**Step 3: Commit**

```bash
git add src/components/BlindBudget/PrivacyIndicator.tsx
git commit -m "feat: add PrivacyIndicator component (teal lock badge)"
```

---

### Task 13: Build BudgetExplainerCarousel

**Files:**
- Create: `src/components/BlindBudget/BudgetExplainerCarousel.tsx`

3-step onboarding carousel shown on first budget setup. Uses shadcn Dialog.

**Step 1: Create the component**

Create `src/components/BlindBudget/BudgetExplainerCarousel.tsx`:

```tsx
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
    description:
      'Set a personal budget cap that only you can see. Not even the trip organizer knows your number.',
    color: 'text-teal',
    bg: 'bg-privacy-light',
  },
  {
    icon: Users,
    title: 'We calculate a group limit',
    description:
      'The system takes the minimum of everyone\'s private caps to find what the whole group can afford. No individual amounts are ever revealed.',
    color: 'text-teal',
    bg: 'bg-privacy-light',
  },
  {
    icon: TrendingUp,
    title: 'Plan together, spend smart',
    description:
      'Activities and suggestions are filtered by the group\'s affordable limit. Everyone plans within a comfortable range without awkward money conversations.',
    color: 'text-teal',
    bg: 'bg-privacy-light',
  },
]

interface BudgetExplainerCarouselProps {
  open: boolean
  onClose: () => void
  onComplete: () => void
}

export function BudgetExplainerCarousel({
  open,
  onClose,
  onComplete,
}: BudgetExplainerCarouselProps) {
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
          <DialogDescription className="sr-only">
            Learn how private budget caps work
          </DialogDescription>
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
            <p className="text-sm text-muted-foreground leading-relaxed px-4">
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 pb-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-teal' : 'w-1.5 bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
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

### Task 14: Build BlindBudgetForm Component

**Files:**
- Create: `src/components/BlindBudget/BlindBudgetForm.tsx`

The private budget input form. Shows current budget if set, allows editing. Always shows the privacy indicator.

**Step 1: Create the component**

Create `src/components/BlindBudget/BlindBudgetForm.tsx`:

```tsx
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

  // Sync when currentAmountCents changes (e.g., after user switch)
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
    if (dollars > 100000) return // Max $100,000
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
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Your Private Budget
            </span>
          </div>
          <PrivacyIndicator />
        </div>

        <div className="flex items-center justify-between rounded-xl p-4"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
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
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>
            $
          </span>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="0"
            min={0}
            max={100000}
            step={100}
            className="w-full rounded-xl py-3 pl-8 pr-4 text-xl font-semibold outline-none transition-colors"
            style={{
              background: 'var(--bg-surface)',
              border: '2px solid var(--accent-primary)',
              color: 'var(--text-primary)',
            }}
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

### Task 15: Build GroupLimitDisplay Component

**Files:**
- Create: `src/components/BlindBudget/GroupLimitDisplay.tsx`

Shows the group's affordable limit and member progress.

**Step 1: Create the component**

Create `src/components/BlindBudget/GroupLimitDisplay.tsx`:

```tsx
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

  // No budgets set yet
  if (budgetCount === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl p-6 text-center"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
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
      {/* Group limit card */}
      <div className="flex flex-col gap-3 rounded-xl p-5"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} style={{ color: 'var(--text-secondary)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Group Affordable Limit
            </span>
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
          <div className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Calculating...
          </div>
        )}

        {/* Progress bar */}
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

### Task 16: Build MockUserSwitcher Component

**Files:**
- Create: `src/components/BlindBudget/MockUserSwitcher.tsx`

A floating dev-tools bar for switching between mock users to test blind budgeting from different perspectives.

**Step 1: Create the component**

Create `src/components/BlindBudget/MockUserSwitcher.tsx`:

```tsx
import { useMockAuth } from '@/lib/mock-auth'

export function MockUserSwitcher() {
  const { user, availableUsers, switchUser } = useMockAuth()

  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-2"
      style={{
        background: 'var(--bg-surface)',
        border: '1px dashed var(--border-subtle)',
      }}
    >
      <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
        Viewing as:
      </span>
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
            <img
              src={u.avatar_url ?? ''}
              alt={u.display_name}
              className="h-5 w-5 rounded-full object-cover"
            />
            {u.display_name.split(' ')[0]}
          </button>
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/BlindBudget/MockUserSwitcher.tsx
git commit -m "feat: add MockUserSwitcher for testing blind budgeting perspectives"
```

---

### Task 17: Integrate Blind Budgeting into Budget.tsx

**Files:**
- Modify: `src/components/Budget/Budget.tsx`

Replace the hardcoded budget data and blind mode toggle with the real hook and new components. Keep the existing expense list and category breakdown as-is (they'll be connected to Supabase in the Expense Splitting feature later).

**Step 1: Update imports and add hook**

At the top of `Budget.tsx`, add:

```typescript
import { useBlindBudget } from '@/hooks/use-blind-budget'
import { useMockAuth } from '@/lib/mock-auth'
import { BlindBudgetForm } from '../BlindBudget/BlindBudgetForm'
import { GroupLimitDisplay } from '../BlindBudget/GroupLimitDisplay'
import { BudgetExplainerCarousel } from '../BlindBudget/BudgetExplainerCarousel'
import { MockUserSwitcher } from '../BlindBudget/MockUserSwitcher'
import { centsToDollars, formatBudgetAmount } from '@/lib/blind-budget'
```

**Step 2: Replace hardcoded state with hook**

Replace these lines:
```typescript
const [isBlindMode, setIsBlindMode] = useState(true);

const totalBudget = 5000;
const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
const percentSpent = (totalSpent / totalBudget) * 100;
```

With:
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

**Step 3: Replace the blind mode header buttons**

Replace the header buttons section (the div containing currency selector, blind mode button, and add expense button) with:

```tsx
<div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
  <MockUserSwitcher />
  <select className="currency-selector" value={currency} onChange={(e) => setCurrency(e.target.value)}>
    <option value="USD">USD ($)</option>
    <option value="EUR">EUR (€)</option>
    <option value="JPY">JPY (¥)</option>
    <option value="GBP">GBP (£)</option>
  </select>
  <Button icon={<Plus size={16} />} onClick={() => setIsAddExpenseOpen(true)}>Add Expense</Button>
</div>
```

**Step 4: Replace the top metrics row**

Replace the first metric card (the one showing "Target Budget" / "Remaining Budget") with the BlindBudgetForm and GroupLimitDisplay. Replace the entire `budget-metrics-grid` div with:

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

{/* Spending Metrics (kept from original) */}
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
  <Card className="metric-card">
    <CardContent style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div className="metric-header">
        <span className="metric-label">Total Spent</span>
        <div className="metric-icon"><CreditCard size={16} /></div>
      </div>
      <div className="metric-value">${totalSpent.toLocaleString()}</div>
      {totalBudget && (
        <>
          <div className="progress-bar-container small" style={{ marginTop: '8px' }}>
            <div className="progress-bar-fill gradient" style={{ width: `${Math.min(percentSpent, 100)}%` }}></div>
          </div>
          <div className="metric-subtext">{percentSpent.toFixed(1)}% of {formatBudgetAmount(groupLimitCents!, currency)} group limit</div>
        </>
      )}
    </CardContent>
  </Card>

  <Card className="metric-card">
    <CardContent style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div className="metric-header">
        <span className="metric-label">Daily Average</span>
        <div className="metric-icon"><TrendingUp size={16} /></div>
      </div>
      <div className="metric-value">$185.50</div>
      <div className="metric-trend negative">
        <ArrowUpRight size={14} /> +$15.00 from yesterday
      </div>
    </CardContent>
  </Card>
</div>
```

**Step 5: Replace the blind budget setup modal**

Replace the existing `{/* Blind Budget Setup Modal */}` AnimatePresence block with:

```tsx
<BudgetExplainerCarousel
  open={isExplainerOpen}
  onClose={() => setIsExplainerOpen(false)}
  onComplete={() => setIsExplainerOpen(false)}
/>
```

**Step 6: Remove unused imports**

Remove these imports that are no longer needed:
- `EyeOff`, `Eye`, `Lock` from lucide-react (they're now in sub-components)
- `Wallet` from lucide-react

Keep: `PieChart, DollarSign, TrendingUp, Plus, Plane, Hotel, Utensils, ShoppingBag, ArrowUpRight, ArrowDownRight, CreditCard`

Also remove:
- `const [isSetupOpen, setIsSetupOpen] = useState(false);`
- `const [isBlindMode, setIsBlindMode] = useState(true);`

**Step 7: Verify**

Run: `npm run dev`
Expected: Budget page shows the blind budget form, group limit display, mock user switcher, and the existing expenses/categories. Switch users and set budgets from different perspectives.

**Step 8: Commit**

```bash
git add src/components/Budget/Budget.tsx
git commit -m "feat: integrate blind budgeting into Budget page with real Supabase data"
```

---

### Task 18: End-to-End Verification

**Step 1: Start the app**

Run: `npm run dev`

**Step 2: Test the full flow**

1. Navigate to a trip > Budget tab
2. As Pedro: see empty blind budget form with lock icon
3. Enter $5,000 and save — see it lock with "Private" badge
4. Switch to Sarah (mock user switcher) — Pedro's budget is invisible, Sarah sees empty form
5. As Sarah: enter $3,000 and save
6. Both users now see "Group Affordable Limit: $3,000" (MIN of 5000, 3000)
7. Switch back to Pedro — see amber "Your budget is not setting the group limit"
8. Switch to Sarah — see amber "Your budget is currently setting the group limit"
9. Progress bar shows "2 of 4 members set their budget"

**Step 3: Run all tests**

Run: `npm test`
Expected: All business logic tests pass.

**Step 4: Run type check**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 5: Run lint**

Run: `npm run lint`
Expected: No errors (or only pre-existing warnings).

**Step 6: Final commit**

```bash
git add -A
git commit -m "feat: complete blind budgeting MVP with mock auth and Supabase"
```

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | Install Tailwind CSS v4 | package.json, vite.config.ts, index.css |
| 2 | Map CSS variables to Tailwind theme | index.css |
| 3 | Add path aliases | tsconfig.app.json, vite.config.ts |
| 4 | Install shadcn/ui | components.json, lib/utils.ts, ui components |
| 5 | Install Vitest | vitest.config.ts, test/setup.ts |
| 6 | Set up Supabase | .env.local, lib/supabase.ts |
| 7 | Create database schema | supabase/migrations/001_foundation.sql |
| 8 | TypeScript database types | types/database.ts |
| 9 | Mock auth context | lib/mock-auth.tsx, App.tsx |
| 10 | Blind budget business logic (TDD) | lib/blind-budget.ts + tests |
| 11 | useBlindBudget hook | hooks/use-blind-budget.ts |
| 12 | PrivacyIndicator component | BlindBudget/PrivacyIndicator.tsx |
| 13 | BudgetExplainerCarousel | BlindBudget/BudgetExplainerCarousel.tsx |
| 14 | BlindBudgetForm | BlindBudget/BlindBudgetForm.tsx |
| 15 | GroupLimitDisplay | BlindBudget/GroupLimitDisplay.tsx |
| 16 | MockUserSwitcher | BlindBudget/MockUserSwitcher.tsx |
| 17 | Integrate into Budget.tsx | Budget/Budget.tsx |
| 18 | End-to-end verification | (all files) |
