# Implementation Plan: E01-S02 User Login with Session Management

## Context

**Why this change:** This story implements secure user login functionality with session management, enabling registered users to authenticate and access their trips. It builds upon E01-S01 (User Registration) by adding the authentication flow that validates credentials and creates secure sessions using HTTP-only cookies.

**What prompted it:** Required for the MVP authentication flow in Epic 1 (User Authentication & Access Control). Without login, registered users cannot access their accounts or trips.

**Intended outcome:** Users can log in with email/password, have their credentials validated by Supabase Auth, receive a secure session token stored in HTTP-only cookies, and be redirected to the dashboard. Sessions persist across page refreshes and expire after 7 days (or 30 days with "Remember me").

---

## Dependencies & Prerequisites

**Critical Dependency:**
- **E01-S01 (User Registration)** must be completed first
  - **Current Status:** IN-PROGRESS (per sprint-status.yaml)
  - **Why it matters:** E01-S01 creates the `users` table and configures Supabase Auth for email/password authentication
  - **What this story needs from E01-S01:**
    - `users` table schema with id, email, password_hash, name, avatar_url, created_at, updated_at
    - Supabase Auth configured for email/password provider
    - Email verification system (optional for login, but should be in place)

**Action:** Coordinate with E01-S01 developer to confirm these are complete before finalizing E01-S02 implementation.

---

## Implementation Approach

### 1. Create Login Page (tripflow-next/src/app/login/page.tsx)

**Route:** `/login`

**Component Structure:**
```tsx
// app/login/page.tsx
import { LoginForm } from '@/components/auth/LoginForm'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Log in to access your trips</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
```

**Styling:**
- Use design tokens from `globals.css` (--bg-surface, --text-primary, --accent-primary)
- Mobile-first responsive layout
- Dark mode support via CSS variables

---

### 2. Build Login Form Component (tripflow-next/src/components/auth/LoginForm.tsx)

**Form Fields:**
- Email input (type="email", autocomplete="email")
- Password input (type="password", autocomplete="current-password")
- "Remember me" checkbox (optional)
- Submit button ("Log in")
- Link to registration ("/register" or "/signup")
- Link to password reset ("/forgot-password")

**Validation with Zod:**

**Note:** Research found the codebase uses **Zod** (NOT Valibot). Package.json shows `"zod": "^4.3.6"`.

Create schema:
```typescript
// lib/schemas/login-schema.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
```

**Form Management:**

Current codebase uses **plain React state** (no React Hook Form). Follow existing pattern:

```typescript
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [rememberMe, setRememberMe] = useState(false)
const [errors, setErrors] = useState<Record<string, string>>({})
const [isPending, setIsPending] = useState(false)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  // Validate with Zod
  const result = loginSchema.safeParse({ email, password, rememberMe })
  if (!result.success) {
    setErrors(result.error.flatten().fieldErrors)
    return
  }

  // Call server action
  setIsPending(true)
  const response = await loginAction(email, password, rememberMe)
  setIsPending(false)

  if (response.error) {
    setErrors({ submit: response.error.message })
  } else {
    router.push('/dashboard')
  }
}
```

**Use Existing UI Components:**
- `<Input />` - from `tripflow-next/src/components/ui/input.tsx`
- `<Button />` - from `tripflow-next/src/components/ui/button.tsx`
- `<Label />` - from `tripflow-next/src/components/ui/label.tsx`
- `<Checkbox />` - from `tripflow-next/src/components/ui/checkbox.tsx`

---

### 3. Create Server Action for Login (tripflow-next/src/app/actions/auth.ts)

**Pattern:** Follow existing server action structure (see `tripflow-next/src/app/actions/blind-budget.ts`)

```typescript
"use server"

import { createServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAction(
  email: string,
  password: string,
  rememberMe: boolean = false
) {
  const supabase = await createServerClient()

  // Sign in with Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      error: {
        code: error.code,
        message: 'Invalid email or password', // Generic message to prevent email enumeration
      },
    }
  }

  // Configure session expiry based on "Remember me"
  const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60 // 30 days or 7 days

  const cookieStore = await cookies()
  cookieStore.set('sb-access-token', data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
  })

  cookieStore.set('sb-refresh-token', data.session.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
  })

  redirect('/dashboard')
}
```

**Key Security Features:**
- HTTP-only cookies (not localStorage) to prevent XSS attacks
- Secure flag in production (HTTPS only)
- SameSite=lax to prevent CSRF
- Generic error messages to prevent email enumeration
- Configurable session expiry (7 or 30 days)

---

### 4. Configure Supabase Auth Session Management

**Update Supabase Client (tripflow-next/src/lib/supabase/server.ts):**

Ensure the server client correctly reads session from HTTP-only cookies:

```typescript
import { createServerClient as createClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerClient() {
  const cookieStore = await cookies()

  return createClient(
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
            // Can't set cookies in Server Components
          }
        },
      },
    }
  )
}
```

---

### 5. Implement Auth Middleware (Optional but Recommended)

Create middleware to protect routes requiring authentication:

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Redirect to login if no session
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to dashboard if already logged in
  if (session && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
```

---

### 6. Ensure Accessibility (WCAG 2.1 AA Compliance)

**Form Accessibility Checklist:**

- [ ] **Labels:** All inputs have associated `<label>` with `htmlFor` attribute
- [ ] **Keyboard Navigation:** Tab order: Email → Password → Remember me → Submit
- [ ] **Focus Indicators:** Visible focus ring on all interactive elements
- [ ] **Error Messaging:**
  - Use `aria-invalid="true"` on inputs with errors
  - Link error text to input via `aria-describedby`
  - Announce errors with ARIA live region for screen readers
- [ ] **Autocomplete:** Use `autocomplete="email"` and `autocomplete="current-password"`
- [ ] **Submit with Enter:** Form submits when Enter is pressed in any field
- [ ] **Screen Reader:** Test with VoiceOver (macOS) or NVDA (Windows)

**Example Accessible Input:**

```tsx
<div>
  <Label htmlFor="email">Email Address</Label>
  <Input
    id="email"
    type="email"
    name="email"
    autocomplete="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? 'email-error' : undefined}
  />
  {errors.email && (
    <p id="email-error" className="text-sm text-destructive" role="alert">
      {errors.email}
    </p>
  )}
</div>
```

---

### 7. Replace MockAuthProvider with Real Auth Context

**Current State:** The codebase uses `MockAuthProvider` (from `tripflow-next/src/lib/mock-auth.tsx`) for user switching during development.

**Action:** Replace `MockAuthProvider` with a real `AuthProvider` that uses Supabase session:

```typescript
// lib/auth-context.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AuthContextValue {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

Update `tripflow-next/src/components/layout/Providers.tsx`:

```tsx
import { AuthProvider } from '@/lib/auth-context'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}
```

---

### 8. Testing Strategy

**Unit Tests (Vitest):**

File: `tripflow-next/src/lib/schemas/__tests__/login-schema.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { loginSchema } from '@/lib/schemas/login-schema'

describe('loginSchema', () => {
  it('validates correct email and password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'password123',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toEqual(['email'])
  })

  it('rejects password shorter than 8 characters', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'short',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toEqual(['password'])
  })
})
```

**E2E Tests (Playwright):**

Already created at `tripflow-next/e2e/story-e01-s02.spec.ts` with 7 ATDD tests covering all acceptance criteria.

**Test Execution:**
```bash
# Run unit tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Run E2E tests in UI mode (for debugging)
pnpm test:e2e --ui
```

---

## Critical Files to Modify/Create

| File Path | Action | Purpose |
|-----------|--------|---------|
| `tripflow-next/src/app/login/page.tsx` | Create | Login route page |
| `tripflow-next/src/components/auth/LoginForm.tsx` | Create | Login form component |
| `tripflow-next/src/app/actions/auth.ts` | Create | Server action for login |
| `tripflow-next/src/lib/schemas/login-schema.ts` | Create | Zod validation schema |
| `tripflow-next/src/lib/auth-context.tsx` | Create | Auth provider replacing MockAuth |
| `tripflow-next/src/lib/supabase/server.ts` | Verify | Ensure cookie-based sessions work |
| `tripflow-next/src/components/layout/Providers.tsx` | Update | Replace MockAuthProvider with AuthProvider |
| `tripflow-next/middleware.ts` | Create | Auth middleware for route protection |
| `tripflow-next/e2e/story-e01-s02.spec.ts` | Already created | ATDD E2E tests |
| `tripflow-next/src/lib/schemas/__tests__/login-schema.test.ts` | Create | Unit tests for validation |

---

## Existing Code to Reuse

**From tripflow-next/src/lib/supabase/:**
- `client.ts` - Browser Supabase client
- `server.ts` - Server Supabase client with cookie management
- `admin.ts` - Admin client (not needed for login)

**From tripflow-next/src/components/ui/:**
- `Input` - Text/email/password input component
- `Button` - Submit button with loading state
- `Label` - Form label component
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` - Layout components
- `Checkbox` - For "Remember me" checkbox

**From tripflow-next/src/app/globals.css:**
- Design tokens: `--bg-surface`, `--text-primary`, `--accent-primary`, `--color-red`
- Typography: DM Sans, Playfair Display
- Spacing: consistent padding/margin utilities

---

## Verification Plan

### End-to-End Testing Checklist:

1. **Successful Login:**
   - [ ] Navigate to `/login`
   - [ ] Enter valid email and password
   - [ ] Click "Log in"
   - [ ] Verify redirect to `/dashboard`
   - [ ] Verify session cookie exists (check DevTools → Application → Cookies)
   - [ ] Verify cookie is HTTP-only

2. **Session Persistence:**
   - [ ] Log in successfully
   - [ ] Refresh the page
   - [ ] Verify still logged in (not redirected to login)

3. **Invalid Credentials:**
   - [ ] Enter incorrect email or password
   - [ ] Click "Log in"
   - [ ] Verify error message: "Invalid email or password"
   - [ ] Verify no redirect (stay on login page)

4. **Remember Me:**
   - [ ] Check "Remember me" checkbox
   - [ ] Log in
   - [ ] Inspect session cookie expiry (should be 30 days instead of 7)

5. **Keyboard Accessibility:**
   - [ ] Tab through all form fields
   - [ ] Verify focus indicators visible
   - [ ] Press Enter in password field to submit
   - [ ] Verify form submits

6. **Screen Reader:**
   - [ ] Test with VoiceOver (macOS) or NVDA (Windows)
   - [ ] Verify labels announced
   - [ ] Verify errors announced

7. **ATDD Tests:**
   - [ ] Run `pnpm test:e2e` - all 7 tests should PASS

---

## Implementation Notes

**Make granular commits** after completing each task as save points:
- Commit 1: Create login page route and basic layout
- Commit 2: Build LoginForm component with validation
- Commit 3: Add server action for Supabase auth
- Commit 4: Configure HTTP-only cookie sessions
- Commit 5: Replace MockAuthProvider with real AuthProvider
- Commit 6: Add auth middleware for route protection
- Commit 7: Write unit tests for validation schema
- Commit 8: Verify ATDD E2E tests pass

**Error Handling:**
- Display user-friendly messages ("Invalid email or password")
- Avoid revealing whether email exists (prevents enumeration)
- Handle network errors gracefully
- Log errors server-side for debugging

**Security Considerations:**
- NEVER store tokens in localStorage (XSS risk)
- Use HTTP-only cookies for session tokens
- Set Secure flag in production (HTTPS only)
- Use SameSite=lax to prevent CSRF
- Validate all inputs server-side (don't trust client)

---

## Recommended Implementation Workflow

**This story involves UI changes and 3+ tasks → Use "Review first" workflow:**

1. Implement the login functionality following this plan
2. Make granular commits after each task
3. When done, run `/review-story` for design and code review
4. Fix any issues found
5. Run `/finish-story` to merge and ship

**Why review first?**
- UI changes benefit from design review
- Complex authentication logic needs security review
- Multiple tasks increase chance of issues
- Better to catch problems before shipping
