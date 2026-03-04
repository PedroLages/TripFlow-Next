# Test Coverage Review: E01-S02 User Login with Session Management

**Date:** 2026-03-04
**Story:** E01-S02 - User Login with Session Management
**Review Type:** Test Coverage and Quality

---

## Summary

The test coverage for E01-S02 shows **good E2E coverage but significant gaps in unit testing**. The E2E test suite (`story-e01-s02.spec.ts`) covers the critical user journey well, and the validation schema has comprehensive unit tests. However, **critical components lack unit tests**, particularly the `LoginForm` component, `loginAction` server action, and the `AuthContext`. This creates risk for regressions during refactoring and makes debugging more difficult.

**Overall Test Quality Score: 7/10**
- E2E Coverage: 8.5/10 (excellent behavioral coverage)
- Unit Test Coverage: 5/10 (schema tested, but components untested)
- Integration Test Coverage: 2/10 (major gaps)

---

## AC Coverage Table

| AC # | Acceptance Criterion | Unit Tests | E2E Tests | Coverage Status | Confidence |
|------|---------------------|------------|-----------|-----------------|------------|
| AC1 | User can enter email and password | None | AC1 test (lines 24-38) | Partial - E2E only | 90 |
| AC2 | Form validates email format | login-schema.test.ts (lines 45-55, 57-66) | None | Good - Schema tested | 95 |
| AC3 | Form validates password requirements (min 8 chars) | login-schema.test.ts (lines 68-78, 80-89, 91-97) | None | Good - Schema tested | 95 |
| AC4 | Error messages display for invalid inputs | None | AC3 test (lines 67-83) | Partial - E2E only | 85 |
| AC5 | Submit button disabled during authentication | None | None | **NOT COVERED** | 100 |
| AC6 | User redirected to dashboard on successful login | None | AC1 test (lines 33-37) | Partial - E2E only | 90 |
| AC7 | Error message shown for invalid credentials | None | AC3 test (lines 67-83) | Partial - E2E only | 90 |
| AC8 | Session persists across page reloads | None | AC4 test (lines 85-98) | Partial - E2E only | 90 |
| AC9 | Protected routes redirect to login when not authenticated | None | None (middleware exists) | **NOT COVERED BY TESTS** | 100 |
| AC10 | Auth state properly managed in context | None | None | **NOT COVERED** | 100 |
| AC11 (Story) | Session tokens in HTTP-only cookies (not localStorage) | None | AC2 test (lines 40-65) | Good - E2E verified | 95 |
| AC12 (Story) | Keyboard accessibility | None | AC5 test (lines 100-127) | Good - E2E verified | 85 |
| AC13 (Story) | ARIA labels for screen readers | None | AC6 test (lines 129-161) | Good - E2E verified | 80 |
| AC14 (Story) | "Remember me" extends session to 30 days | login-schema.test.ts (lines 13-35, 37-43) | AC7 test (lines 163-190) | Partial - UI only, no session verification | 75 |

**Coverage Legend:**
- **Good**: Comprehensive test coverage with proper assertions
- **Partial**: Some coverage but missing critical aspects (E2E-only or incomplete)
- **NOT COVERED**: No tests exist for this criterion

---

## Critical Gaps (Confidence 95-100)

### 1. Submit Button Disabled State - NOT TESTED
**Criticality: 9/10** | **Confidence: 100**

**Missing Coverage:**
- No test verifies the button is disabled when `isPending` is true
- No test verifies the button text changes to "Logging in..." during submission

**Why This Matters:**
- Prevents double-submission bugs that could create duplicate sessions
- Critical UX feedback mechanism - users could think the form isn't working
- Could lead to race conditions if multiple submissions are allowed

**Recommended Test:**
```typescript
// Unit test for LoginForm component
it('disables submit button during authentication', async () => {
  render(<LoginForm />)
  const submitButton = screen.getByRole('button', { name: /log in/i })

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' }
  })
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'password123' }
  })

  // Mock loginAction to simulate delay
  const loginActionSpy = vi.spyOn(authActions, 'loginAction')
    .mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

  fireEvent.click(submitButton)

  // Button should be disabled immediately
  expect(submitButton).toBeDisabled()
  expect(submitButton).toHaveTextContent('Logging in...')

  await waitFor(() => expect(submitButton).not.toBeDisabled())
})
```

**Files Affected:**
- `src/components/auth/LoginForm.tsx` (lines 19, 69, 91, 107, 128-133)

---

### 2. Protected Route Redirection - NOT TESTED
**Criticality: 9/10** | **Confidence: 100**

**Missing Coverage:**
- No test verifies unauthenticated users are redirected from `/dashboard` to `/login`
- No test verifies authenticated users are redirected from `/login` to `/dashboard`
- Middleware logic exists but is completely untested

**Why This Matters:**
- Security vulnerability - could expose protected data to unauthenticated users
- Authentication is the PRIMARY security boundary for the application
- Middleware bugs could lock out authenticated users or expose sensitive pages

**Recommended Test:**
```typescript
// E2E test - should be added to story-e01-s02.spec.ts
test('AC9: Protected routes redirect unauthenticated users to login', async ({ page }) => {
  // GIVEN I am not logged in
  // WHEN I try to access the dashboard directly
  await page.goto('/dashboard')

  // THEN I am redirected to the login page
  await expect(page).toHaveURL(/\/login/)
})

test('AC9: Authenticated users cannot access login page', async ({ page, context }) => {
  // GIVEN I am logged in
  await page.goto('/login')
  await page.fill('input[type="email"]', 'test@example.com')
  await page.fill('input[type="password"]', 'validpassword123')
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/)

  // WHEN I try to access the login page again
  await page.goto('/login')

  // THEN I am redirected back to the dashboard
  await expect(page).toHaveURL(/\/dashboard/)
})
```

**Files Affected:**
- `middleware.ts` (lines 32-41)

---

### 3. Auth Context State Management - NOT TESTED
**Criticality: 8/10** | **Confidence: 100**

**Missing Coverage:**
- No test verifies `AuthProvider` initializes with correct loading state
- No test verifies user state updates after login
- No test verifies `onAuthStateChange` listener is properly set up/torn down
- No test verifies `signOut` function works correctly

**Why This Matters:**
- Auth context is the source of truth for authentication across the entire app
- Bugs could cause infinite loading states, stale user data, or memory leaks
- State management bugs are notoriously difficult to debug without tests

**Recommended Test:**
```typescript
// Unit test for AuthContext
describe('AuthProvider', () => {
  it('initializes with loading state', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>
    })

    expect(result.current.loading).toBe(true)
    expect(result.current.user).toBe(null)
  })

  it('updates user state when session exists', async () => {
    // Mock Supabase client with session
    const mockSession = { user: { id: '123', email: 'test@example.com' } }
    vi.spyOn(supabaseClient, 'getSession').mockResolvedValue({
      data: { session: mockSession }
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>
    })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user).toEqual(mockSession.user)
  })

  it('cleans up auth listener on unmount', () => {
    const unsubscribeSpy = vi.fn()
    vi.spyOn(supabaseClient.auth, 'onAuthStateChange').mockReturnValue({
      data: { subscription: { unsubscribe: unsubscribeSpy } }
    })

    const { unmount } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>
    })

    unmount()
    expect(unsubscribeSpy).toHaveBeenCalled()
  })
})
```

**Files Affected:**
- `src/lib/auth-context.tsx` (entire file)

---

## Important Improvements (Confidence 80-94)

### 4. LoginForm Component Unit Tests - MISSING
**Criticality: 7/10** | **Confidence: 100**

**Missing Coverage:**
- No unit tests for form validation logic (only schema is tested)
- No tests for error state rendering (email, password, submit errors)
- No tests for form submission flow
- No tests for state management (email, password, rememberMe)

**Why This Matters:**
- E2E tests catch behavior but are slow to run and debug
- Component-level bugs could be caught faster with unit tests
- Refactoring the component is riskier without unit tests

**Recommended Tests:** See full test examples in the detailed report.

**Files Affected:**
- `src/components/auth/LoginForm.tsx`

---

### 5. Server Action (loginAction) Unit Tests - MISSING
**Criticality: 7/10** | **Confidence: 100**

**Missing Coverage:**
- No tests for Supabase authentication integration
- No tests for cookie setting logic (HTTP-only, secure, sameSite)
- No tests for "Remember me" functionality (7 days vs 30 days expiry)
- No tests for error handling (network errors, invalid credentials)

**Why This Matters:**
- Cookie configuration is security-critical (httpOnly prevents XSS attacks)
- Session expiry logic is complex and error-prone
- Bugs in server actions are harder to debug than client components

**Files Affected:**
- `src/app/actions/auth.ts` (lines 7-49)

---

### 6. Remember Me Session Expiry Verification - INCOMPLETE
**Criticality: 6/10** | **Confidence: 90**

**Current Coverage:**
- E2E test (AC7, lines 163-190) only verifies UI presence and that login succeeds with checkbox checked
- No verification that session actually expires at the correct time
- Comment in test acknowledges this limitation (line 188)

**Why This Matters:**
- Session expiry is a security feature - sessions should not last forever
- Business requirement explicitly states 7 days vs 30 days
- Could lead to unexpected session timeouts or security issues

**Files Affected:**
- `e2e/story-e01-s02.spec.ts` (lines 163-190)
- `src/app/actions/auth.ts` (lines 31-46)

---

### 7. Network Error Handling - NOT TESTED
**Criticality: 6/10** | **Confidence: 95**

**Missing Coverage:**
- No test for network errors (timeout, connection refused, etc.)
- LoginForm has a generic catch block (line 48) but it's never tested
- No test for Supabase service unavailability

**Why This Matters:**
- Network errors are common in production (spotty connections, service outages)
- Users should see a helpful error message, not a blank screen
- Generic error handling could mask important bugs

**Files Affected:**
- `src/components/auth/LoginForm.tsx` (lines 48-50)

---

## Test Quality Issues (Confidence 75-85)

### Issue 1: E2E Tests Use Brittle Selectors
**Confidence: 85**

**Problem:**
E2E tests use multiple fallback selectors which makes them less maintainable:

```typescript
// Example from line 29
await page.fill('input[type="email"], input[name="email"]', 'test@example.com')

// Example from line 31
await page.click('button[type="submit"], button:has-text("Log in"), button:has-text("Sign in")')
```

**Better Approach:**
Use Playwright's role-based selectors and data-testid attributes:

```typescript
// Better: Use accessible role selectors
await page.getByRole('textbox', { name: /email/i }).fill('test@example.com')
await page.getByRole('button', { name: /log in/i }).click()
```

**Files Affected:**
- `e2e/story-e01-s02.spec.ts` (lines 29-31, 42-44, 72-74, 87-89, etc.)

---

### Issue 2: E2E Tests Have Inconsistent Wait Strategies
**Confidence: 75**

**Problem:**
Some tests use explicit timeouts while others rely on defaults:

```typescript
// Example: Explicit timeout (line 34)
await expect(page).toHaveURL(/\/dashboard|^\/$/, { timeout: 10_000 })

// Example: Different timeout (line 77)
await expect(page.locator('text=/invalid.*email.*password|incorrect.*credentials|login.*failed/i'))
  .toBeVisible({ timeout: 5_000 })
```

**Better Approach:**
Configure default timeouts in Playwright config and only use explicit timeouts for genuinely slow operations.

**Files Affected:**
- `e2e/story-e01-s02.spec.ts` (lines 34, 37, 45, 77, 90, 96, 126)

---

### Issue 3: Schema Tests Are Tightly Coupled to Error Messages
**Confidence: 80**

**Problem:**
Schema tests assert on exact error message strings. Changes to error message copy will break tests even if behavior is correct.

**Better Approach:**
Test the structure and path, but be flexible about exact message:

```typescript
it('rejects invalid email', () => {
  const result = loginSchema.safeParse({
    email: 'invalid-email',
    password: 'password123',
  })
  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error.issues[0].path).toEqual(['email'])
    expect(result.error.issues[0].message).toMatch(/valid email/i)
  }
})
```

**Files Affected:**
- `src/lib/schemas/__tests__/login-schema.test.ts` (lines 52-54, 75-77)

---

## Positive Observations

### 1. Excellent Schema Test Coverage
The `login-schema.test.ts` file provides comprehensive validation coverage:
- Tests valid inputs (lines 5-11)
- Tests all permutations of rememberMe field (lines 13-43)
- Tests invalid email formats (lines 45-55)
- Tests empty email (lines 57-66)
- Tests password length validation (lines 68-97)
- Tests missing fields (lines 99-105)
- Tests boundary conditions (exactly 8 characters, line 91-97)

**This is a model for schema testing** - it covers all validation rules, edge cases, and optional fields.

### 2. Well-Structured E2E Tests
The E2E test file follows ATDD principles:
- Clear test descriptions with AC numbers (lines 24, 40, 67, etc.)
- Given/When/Then comments for readability (lines 25-37)
- Comprehensive coverage of user journey
- Tests both success and failure paths

### 3. Accessibility Testing in E2E
Tests AC5 (keyboard accessibility) and AC6 (ARIA labels) are excellent examples of accessibility testing:
- Verifies keyboard navigation (lines 100-127)
- Checks for proper labels and ARIA attributes (lines 129-161)
- These tests would catch regressions in accessibility support

### 4. Security-Focused Testing
E2E test AC2 (lines 40-65) verifies HTTP-only cookies and absence of localStorage tokens:
- This is a critical security test that many teams overlook
- Directly tests the security requirement from the story
- Would catch dangerous regressions (e.g., accidentally storing tokens in localStorage)

---

## Recommendations Summary

### Immediate Priorities (Must Fix Before Merge)
1. **Add unit tests for submit button disabled state** (Criticality 9/10)
2. **Add E2E tests for protected route redirection** (Criticality 9/10)
3. **Add unit tests for AuthContext state management** (Criticality 8/10)

### Important Follow-ups (Should Fix Soon)
4. **Add unit tests for LoginForm component** (Criticality 7/10)
5. **Add unit tests for loginAction server action** (Criticality 7/10)
6. **Add network error handling tests** (Criticality 6/10)

### Nice-to-Have Improvements
7. Refactor E2E selectors to use role-based selectors
8. Standardize timeout configuration
9. Make schema tests less brittle to message changes

---

## Test Files Summary

### Existing Test Files:
1. `src/lib/schemas/__tests__/login-schema.test.ts` - 106 lines, comprehensive schema validation
2. `e2e/story-e01-s02.spec.ts` - 191 lines, ATDD-style E2E tests

### Missing Test Files (Need to Create):
3. `src/components/auth/__tests__/LoginForm.test.tsx` - Unit tests for form component
4. `src/app/actions/__tests__/auth.test.ts` - Unit tests for server actions
5. `src/lib/__tests__/auth-context.test.tsx` - Unit tests for auth context

### Test Coverage Breakdown:
- **Schema Validation**: 100% covered (excellent)
- **E2E User Journey**: 85% covered (very good)
- **Component Unit Tests**: 0% covered (critical gap)
- **Server Action Tests**: 0% covered (critical gap)
- **Auth Context Tests**: 0% covered (critical gap)
- **Middleware Tests**: 0% covered (critical gap)
