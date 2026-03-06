---
story_id: TECH-E2E-AUTH
story_name: E2E Test Authentication Fixture
status: done
started: 2026-02-13
completed: 2026-02-14
epic: Epic 13 (Production Quality)
priority: medium
---

# TECH-E2E-AUTH: E2E Test Authentication Fixture

## Overview

As a developer running E2E tests in CI, I need authenticated test users so that tests can verify authenticated pages (dashboard, app shell, trip views) without failing on redirect to login.

## Problem Statement

Current E2E tests fail in CI because:
1. Tests attempt to access `/dashboard` and other authenticated routes
2. Middleware redirects unauthenticated requests to `/login`
3. Tests expect dashboard content but receive login page instead
4. Health check passes (Supabase runs correctly), but auth state is missing

**Affected tests** (30 failures in latest CI run):
- `e2e/app-shell.spec.ts` — sidebar, theme toggle, dashboard (all require auth)
- `e2e/auth/signup.spec.ts` — page rendering tests
- Future authenticated page tests

## Acceptance Criteria

- [ ] Create reusable Playwright auth fixture that logs in a test user before tests run
- [ ] Seed test database with a known test user (email: `test@tripos.app`, password in env var)
- [ ] Store authenticated session in Playwright storage state
- [ ] Configure `playwright.config.ts` to use the auth fixture for authenticated tests
- [ ] Update affected test files to use the fixture
- [ ] All E2E tests pass in CI (no auth-related redirects)
- [ ] Document the auth fixture pattern in `apps/web/e2e/README.md`

## Technical Approach

### Option 1: Global Setup with Storage State (Recommended)

Use Playwright's [global setup](https://playwright.io/docs/auth#basic-shared-account-in-all-tests) pattern:

1. Create `apps/web/e2e/global-setup.ts`:
   ```typescript
   import { chromium, FullConfig } from '@playwright/test';

   async function globalSetup(config: FullConfig) {
     const browser = await chromium.launch();
     const page = await browser.newPage();

     await page.goto('http://localhost:3000/login');
     await page.fill('input[name="email"]', 'test@tripos.app');
     await page.fill('input[name="password"]', process.env.E2E_TEST_PASSWORD!);
     await page.click('button[type="submit"]');
     await page.waitForURL('**/dashboard');

     await page.context().storageState({ path: 'e2e/.auth/user.json' });
     await browser.close();
   }

   export default globalSetup;
   ```

2. Update `playwright.config.ts`:
   ```typescript
   export default defineConfig({
     globalSetup: './e2e/global-setup.ts',
     use: {
       storageState: 'e2e/.auth/user.json', // Reuse auth for all tests
     },
   });
   ```

3. Create test user seed in Supabase migrations or via setup script.

### Option 2: Per-Test Fixture

Create a custom fixture in `e2e/fixtures.ts` for tests that need auth:

```typescript
import { test as base } from '@playwright/test';

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@tripos.app');
    await page.fill('input[name="password"]', process.env.E2E_TEST_PASSWORD!);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    await use(page);
  },
});
```

**Recommendation**: Option 1 (global setup) — faster, less code duplication, matches Playwright docs.

## Implementation Steps

1. Add `E2E_TEST_PASSWORD` to CI environment variables (GitHub Actions secrets)
2. Create Supabase migration to seed test user (or use setup script)
3. Implement global setup file
4. Update `playwright.config.ts`
5. Add `.auth/` directory to `.gitignore`
6. Update failing test files to expect authenticated state
7. Verify all tests pass locally with `npm run test:e2e`
8. Verify all tests pass in CI

## Testing Strategy

- Run full E2E suite locally before pushing
- Verify CI passes with all tests green
- Test both fresh database (first run) and existing database (subsequent runs)

## Manual Steps

**[cli]** Add E2E test password to GitHub secrets
```bash
gh secret set E2E_TEST_PASSWORD --body "your-secure-test-password"
```

Then update `.github/workflows/ci.yml` to expose it:
```yaml
- name: Run E2E tests
  env:
    E2E_TEST_PASSWORD: ${{ secrets.E2E_TEST_PASSWORD }}
  run: pnpm test:e2e
```

## Dependencies

- Requires login implementation (E01-S03) ✅ Complete
- Requires Supabase local instance in CI ✅ Already configured

## Definition of Done

- [ ] E2E tests pass locally with authenticated test user
- [ ] E2E tests pass in CI (all 30+ tests green)
- [ ] Auth fixture documented in README
- [ ] Test user credentials secured in GitHub secrets
- [ ] No hardcoded passwords in code

## Notes

This unblocks E2E testing for all future authenticated features (trips, voting, budgets, etc.). Without this, every new feature will have failing E2E tests in CI.

## References

- [Playwright Authentication Guide](https://playwright.io/docs/auth)
- [Supabase Test Helpers](https://supabase.com/docs/guides/testing)
- Current CI run showing failures: https://github.com/PedroLages/TripOS/actions/runs/21995224604
