# Phase 7: Testing Framework Decision

**Created**: 2026-02-09
**Status**: Complete
**Purpose**: Research-backed recommendation for unit, integration, and E2E testing frameworks for TripOS

---

## Executive Summary

**Recommendation**: Vitest + React Testing Library for unit/component testing, Playwright for E2E testing. This stack offers 10-20x faster test execution than Jest, native Next.js 16 compatibility, superior WebSocket/real-time testing support, and zero paid cloud dependencies. Total setup time: 1-2 days. Confidence: **95%**.

---

## Unit Testing: Vitest vs Jest

### Vitest

**Pros:**
- **10-20x faster execution** - One real-world benchmark: Jest 12 minutes for 500 tests, Vitest 8 seconds (86x speedup)
- **Native ESM/TypeScript support** - No babel-jest or ts-jest configuration needed
- **Instant HMR in watch mode** - 0.2s feedback cycle vs Jest's 3.8s (19x faster)
- **Lower memory footprint** - 800 MB vs Jest's 1.2 GB (cuts CI costs)
- **Vite integration** - Reuses existing Vite config, same plugins as dev environment
- **Browser Mode UI** - Live test results, error navigation, natural debugging experience
- **Official Next.js 16 support** - [Next.js docs include Vitest guide](https://nextjs.org/docs/app/guides/testing/vitest)
- **Minimal configuration** - Out-of-the-box TypeScript, JSX, path aliases

**Cons:**
- **Async Server Components unsupported** - Must use E2E tests for async RSC (Next.js App Router limitation)
- **Smaller ecosystem** - Fewer StackOverflow answers than Jest (though growing rapidly)
- **Relatively newer** - Jest has 10+ years of battle-testing vs Vitest's ~3 years

**Cost:** Free (MIT license)

**Setup Time:** 30-60 minutes
- Install: `npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react vite-tsconfig-paths`
- Create `vitest.config.mts` (~15 lines)
- Add test scripts to `package.json`

### Jest

**Pros:**
- **Mature ecosystem** - 10+ years, massive community, extensive documentation
- **Industry standard** - More developers familiar with it
- **Comprehensive mocking** - Well-established patterns for complex mocks
- **Jest 30 improvements** - Released June 2025, better ESM support (still experimental)

**Cons:**
- **Slow execution** - 15.5s vs Vitest's 3.8s for same 100-test suite
- **Complex TypeScript setup** - Requires `ts-jest` or Babel configuration
- **ESM support still experimental** - Needs `--experimental-vm-modules` flag
- **Heavy memory usage** - 1.2 GB vs Vitest's 800 MB
- **Isolated Node.js environments** - More overhead than Vitest's Vite pipeline
- **Slower feedback loop** - 3.8s cycles vs Vitest's 0.2s in watch mode

**Cost:** Free (MIT license)

**Setup Time:** 1-2 hours
- Install: `npm install -D jest ts-jest @types/jest @testing-library/react @testing-library/jest-dom`
- Configure `jest.config.js` with TypeScript transformer
- Add Next.js-specific mocks
- Configure path aliases separately

### Winner: **Vitest** (Confidence: 95%)

**Rationale:** For a solo developer on a new Next.js 16 project in 2026, Vitest is the clear winner. The 10-20x speed improvement directly translates to faster iteration cycles during development. Native ESM/TypeScript support eliminates configuration headaches. The official Next.js documentation endorsement and [with-vitest example template](https://nextjs.org/docs/app/guides/testing/vitest) reduce setup friction.

While Jest's maturity is appealing, the [2026 consensus is that Vitest is now the better default](https://dev.to/dataformathub/vitest-vs-jest-30-why-2026-is-the-year-of-browser-native-testing-2fgb) for modern projects. The async Server Component limitation is acceptable since E2E tests (Playwright) will cover those scenarios.

The only scenario favoring Jest: if you're migrating an existing large codebase with thousands of Jest tests. For TripOS (greenfield project), Vitest wins decisively.

---

## E2E Testing: Playwright vs Cypress

### Playwright

**Pros:**
- **4x faster than Cypress** - Direct WebSocket browser communication vs proxy layer
- **Native parallel execution** - Free, no cloud service required (sharding built-in)
- **Multi-browser support** - Chromium, Firefox, WebKit (Safari) with identical API
- **Cross-domain testing** - Critical for Supabase OAuth flows (Cypress limited by same-origin policy)
- **WebSocket-first architecture** - Near-native browser API access, ideal for real-time testing
- **Mobile emulation** - Test responsive designs with device presets
- **Auto-wait built-in** - No manual wait() calls for most interactions
- **Lower CI costs** - Free parallelization on GitHub Actions, no per-stream fees
- **[Supawright test harness](https://github.com/isaacharrisholt/supawright)** - Specialized Playwright tool for Supabase E2E tests (database setup/teardown)
- **Trace viewer** - Visual debugger showing every action, screenshot, network request

**Cons:**
- **Steeper learning curve** - More API surface area than Cypress
- **Less real-time feedback** - No live browser preview during development (runs headless by default)
- **Newer ecosystem** - Fewer community resources than Cypress (though growing rapidly)

**Cost:** Free (Apache 2.0 license)
- No cloud service required for parallelization
- CI costs = compute time only (typically fixed budget)

**Setup Time:** 45-90 minutes
- Install: `npm install -D @playwright/test`
- Run: `npx playwright install` (downloads browsers ~300MB)
- Create `playwright.config.ts` (~30 lines for Next.js)
- Set up Supabase auth helper utilities (if using Supawright: +30 mins)

### Cypress

**Pros:**
- **Developer-friendly UI** - Live browser preview, time-travel debugging, instant feedback
- **JavaScript-first DX** - Smooth experience for frontend developers, minimal setup
- **Mature ecosystem** - 8+ years, extensive plugins, large community
- **Excellent documentation** - Beginner-friendly guides and examples
- **Real-time test runner** - See tests execute in browser as you write them

**Cons:**
- **Parallelization requires paid cloud** - [Cypress Cloud subscription needed](https://bugbug.io/blog/test-automation-tools/cypress-vs-playwright/) for reliable parallel execution
- **Same-origin policy limitations** - [Challenging for cross-domain auth flows](https://github.com/orgs/supabase/discussions/9377) like Supabase OAuth
- **Slower execution** - Proxy-layer architecture adds latency vs Playwright's WebSocket approach
- **Single browser focus** - Chrome/Electron primary, Firefox/WebKit support limited
- **Scaling costs** - Per-user or per-parallelism stream fees increase with team size

**Cost:**
- **Open-source**: Free (MIT license)
- **Cypress Cloud (for parallelization)**: $67-75/month for 3 users, scales linearly
- Solo developer estimate: $0-67/month depending on need for parallelization

**Setup Time:** 30-60 minutes
- Install: `npm install -D cypress`
- Run: `npx cypress open` (launches config wizard)
- Create `cypress.config.ts` (~20 lines)
- Add Next.js baseUrl
- Supabase auth setup may require [workarounds for OAuth](https://github.com/orgs/supabase/discussions/9377)

### Winner: **Playwright** (Confidence: 90%)

**Rationale:** For TripOS specifically, Playwright's advantages align perfectly with project requirements:

1. **Real-time testing**: WebSocket-first architecture is purpose-built for [testing real-time subscriptions](https://www.testmuai.com/blog/cypress-vs-playwright/), critical for TripOS's collaboration features
2. **Supabase auth**: Cross-domain capabilities handle OAuth flows that [Cypress struggles with](https://github.com/orgs/supabase/discussions/9377)
3. **Zero paid services**: Free parallelization saves $67-75/month (meaningful for solo developer)
4. **CI/CD efficiency**: Native sharding on GitHub Actions without external dependencies
5. **Future-proof**: Multi-browser support prepares for Safari/Firefox users

Cypress's DX is superior for simple apps, but TripOS's complexity (real-time sync, OAuth, WebSockets, multi-user collaboration) plays to Playwright's strengths. The [Supawright test harness](https://github.com/isaacharrisholt/supawright) specifically targets Playwright + Supabase, indicating community consensus.

**When Cypress wins**: If you prioritize developer experience over performance and budget, and your app doesn't require extensive real-time/WebSocket testing.

---

## Component Testing

### Recommendation: React Testing Library + Vitest

**Why this combination:**
- [React Testing Library + Vitest is the standard pairing](https://medium.com/@rational_cardinal_ant_861/next-js-application-testing-with-vitest-and-testing-library-592948bb039c) for modern React/Next.js projects
- Tests components in isolation (unit) or with context providers (integration)
- User-centric queries (`getByRole`, `getByText`) enforce accessibility best practices
- Vitest's speed makes component test suites instant (critical for TDD workflow)

**Alternative considered: Playwright Component Testing**
- Playwright added component testing in 2022, but it's less mature than their E2E offering
- React Testing Library + Vitest is more idiomatic for React ecosystem
- Reserve Playwright for full E2E flows

**Setup included in Vitest setup** (no additional time):
- `@testing-library/react` - Component rendering and queries
- `@testing-library/dom` - DOM utilities
- `jsdom` - Browser environment simulation

---

## Recommended Testing Stack

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Unit Tests (Vitest + React Testing Library)           │
│  - Pure functions (voting logic, budget calculations)  │
│  - React hooks (useVote, useBlindBudget)               │
│  - Utility modules (date formatters, validators)       │
│  - Component rendering (isolated, no API calls)        │
│  - Run: npm run test:unit (watch mode default)         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Integration Tests (Vitest + React Testing Library)    │
│  - Components with React Query + Zustand               │
│  - Form flows with validation                          │
│  - Multi-component interactions (mocked API)           │
│  - Run: npm run test:integration                       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  E2E Tests (Playwright)                                │
│  - Full user journeys (signup → create trip → vote)   │
│  - Real-time collaboration (multiple browser contexts) │
│  - Supabase auth flows (OAuth, magic link)            │
│  - RLS policy enforcement                             │
│  - Run: npm run test:e2e                              │
└─────────────────────────────────────────────────────────┘
```

### Test Distribution (Target Coverage)

- **60% Unit Tests** - Fast, isolated, catch regressions early
- **30% Integration Tests** - Component interactions, realistic mocks
- **10% E2E Tests** - Critical paths only (slow, expensive to maintain)

### File Structure

```
src/
├── app/
│   └── (routes)/
│       └── trips/
│           ├── page.tsx
│           └── page.test.tsx              # Vitest component test
├── lib/
│   ├── voting/
│   │   ├── ranked-choice.ts
│   │   └── ranked-choice.test.ts         # Vitest unit test
│   └── supabase/
│       ├── client.ts
│       └── client.test.ts                # Vitest integration test
└── tests/
    └── e2e/
        ├── auth.spec.ts                   # Playwright E2E test
        ├── voting-flow.spec.ts            # Playwright E2E test
        └── fixtures/
            └── supabase-auth.ts           # Shared test utilities
```

---

## Implementation Timeline

### Phase 1: Vitest Setup (Day 1, 4-6 hours)

**Morning (2-3 hours):**
1. Install dependencies (`vitest`, `@testing-library/react`, `jsdom`, etc.)
2. Create `vitest.config.mts` with Next.js-specific settings
3. Add test scripts to `package.json`:
   ```json
   {
     "scripts": {
       "test": "vitest",
       "test:ui": "vitest --ui",
       "test:coverage": "vitest --coverage"
     }
   }
   ```
4. Set up path aliases (if not already configured)

**Afternoon (2-3 hours):**
1. Write first unit test (simple utility function)
2. Write first component test (basic rendering)
3. Configure coverage thresholds (`vitest.config.mts`)
4. Add GitHub Actions workflow for CI (`.github/workflows/test.yml`)

**Resources:**
- [Next.js Official Vitest Guide](https://nextjs.org/docs/app/guides/testing/vitest)
- [Next.js with-vitest Example](https://nextjs.org/docs/app/guides/testing/vitest)

### Phase 2: Playwright Setup (Day 2, 4-6 hours)

**Morning (2-3 hours):**
1. Install Playwright: `npm install -D @playwright/test`
2. Download browsers: `npx playwright install` (~5 mins for 300MB download)
3. Create `playwright.config.ts`:
   - Set baseURL to `http://localhost:3000`
   - Configure parallel workers (2 for local, 4 for CI)
   - Set up test directories
4. Write first E2E test (homepage navigation)

**Afternoon (2-3 hours):**
1. Set up Supabase test utilities:
   - Install [Supawright](https://github.com/isaacharrisholt/supawright) (optional, saves time)
   - Create auth helper (login, signup, session management)
   - Configure database cleanup between tests
2. Write auth flow E2E test (signup → login → protected route)
3. Add Playwright to GitHub Actions (runs in parallel with Vitest)

**Resources:**
- [Testing Supabase Magic Login with Playwright](https://www.bekapod.dev/articles/supabase-magic-login-testing-with-playwright/)
- [Supawright GitHub Repo](https://github.com/isaacharrisholt/supawright)

### Phase 3: Supabase Testing Best Practices (Day 3, optional polish)

**Focus Areas:**
1. **RLS Policy Testing** - [Write tests for Row Level Security](https://supabase.com/docs/guides/database/testing) with different user roles
2. **Real-time Subscriptions** - Test Broadcast channels with [private channels and authorization](https://supabase.com/docs/guides/realtime/authorization)
3. **Database State Management** - Use Supabase Local Development for isolated test databases
4. **Performance Benchmarks** - Ensure [subscription latency meets targets](https://supabase.com/docs/guides/realtime/benchmarks) (<100ms)

**Resources:**
- [Supabase Testing Overview](https://supabase.com/docs/guides/local-development/testing/overview)
- [Supabase RLS Automated Testing](https://aaronblondeau.com/posts/march_2024/supabase_rls_testing/)

---

## Cost Projection

### Development Phase (Months 0-6)

| Service | Cost | Notes |
|---------|------|-------|
| Vitest | $0 | MIT license, self-hosted |
| Playwright | $0 | Apache 2.0 license, self-hosted |
| React Testing Library | $0 | MIT license |
| GitHub Actions (CI) | $0 | 2,000 free minutes/month (sufficient for solo dev) |
| **Total** | **$0/month** | |

**CI Runtime Estimates:**
- Vitest suite: 30 seconds (500 tests)
- Playwright E2E: 5 minutes (20 tests, 2 workers)
- Total per push: ~6 minutes
- Monthly (60 pushes): ~360 minutes (well under 2,000 free limit)

### MVP Phase (Months 6-12)

| Service | Cost | Notes |
|---------|------|-------|
| Testing frameworks | $0 | Still free |
| GitHub Actions | $0 | Free tier sufficient until ~200 pushes/month |
| **Total** | **$0/month** | |

### Growth Phase (Months 12-24)

| Service | Cost | Notes |
|---------|------|-------|
| Testing frameworks | $0 | Always free |
| GitHub Actions | $0-4 | May exceed free tier with larger team (unlikely solo) |
| **Total** | **$0-4/month** | |

### Scale Phase (Year 2+)

| Service | Cost | Notes |
|---------|------|-------|
| Testing frameworks | $0 | Always free |
| GitHub Actions | $8-20 | Team of 3-5 devs, ~500 pushes/month |
| BrowserStack (optional) | $29-99 | If cross-browser testing becomes critical |
| **Total** | **$8-119/month** | |

**Key Insight:** By choosing Playwright over Cypress, TripOS avoids $67-75/month in cloud parallelization fees from day one. Over 2 years, that's **$1,600-1,800 saved**.

---

## Supabase-Specific Testing Considerations

### 1. Real-Time Subscriptions

**Challenge:** Testing WebSocket connections and Broadcast channels requires live server.

**Solution:**
- Use [Supabase Local Development](https://supabase.com/docs/guides/local-development/testing/overview) (Docker-based) for isolated test environments
- Playwright's WebSocket support handles real-time updates naturally
- Test with [private channels and RLS authorization](https://supabase.com/docs/guides/realtime/authorization)

**Example Test Flow:**
```typescript
// Playwright E2E test
test('real-time collaboration - activity update', async ({ page, context }) => {
  // User 1: Create trip and add activity
  await page.goto('/trips/123');
  await page.fill('[data-testid="activity-name"]', 'Dinner');
  await page.click('[data-testid="add-activity"]');

  // User 2: Open same trip in new browser context
  const page2 = await context.newPage();
  await page2.goto('/trips/123');

  // Verify User 2 sees real-time update
  await expect(page2.locator('text=Dinner')).toBeVisible({ timeout: 2000 });
});
```

### 2. Row Level Security (RLS) Policies

**Challenge:** Ensuring users only see/modify data they're authorized for.

**Solution:**
- Write Vitest integration tests with [multiple Supabase client instances](https://supabase.com/docs/guides/database/testing)
- Test each user role (Owner, Organizer, Member, Guest)
- Verify negative cases (unauthorized access returns empty/error)

**Critical Test Cases:**
- Owner can delete trip, Organizer cannot
- Members see blind budget max but not individual caps
- Guests can view but not vote
- Users cannot access trips they're not invited to

### 3. Authentication Flows

**Challenge:** OAuth redirects, magic links, session management across tests.

**Solution:**
- Use Playwright's [global setup](https://www.bekapod.dev/articles/supabase-magic-login-testing-with-playwright/) to authenticate once, reuse session
- Create test users via Supabase Admin API (bypass email verification)
- Store session in Playwright storage state, load in tests

**Avoid:**
- Repeating full OAuth flow in every test (slow, flaky)
- Using production OAuth providers in CI (rate limits, security risk)

---

## Decision Validation

### Why This Stack Is Right for TripOS

**1. Real-Time Collaboration Focus**
- Playwright's WebSocket-first architecture matches TripOS's core value proposition
- Vitest's speed enables TDD for complex real-time state management

**2. Solo Developer Efficiency**
- Zero paid services during development (GitHub Actions free tier sufficient)
- Fast test execution preserves flow state (Vitest 0.2s feedback loops)
- Minimal configuration (both tools "just work" with Next.js 16)

**3. Future-Proof Architecture**
- Playwright scales to multi-browser testing when mobile web matters
- Vitest's browser mode enables future transition to actual browser testing
- Both tools have strong momentum (won't be abandoned)

**4. Supabase Ecosystem Fit**
- [Community consensus: Playwright + Supabase](https://github.com/supabase-community/e2e)
- Specialized tools like [Supawright](https://github.com/isaacharrisholt/supawright) exist for this exact stack
- Cross-domain testing handles Supabase OAuth cleanly

**5. Cost Efficiency**
- $0 for first 12-18 months (critical for bootstrapped solo project)
- $1,600-1,800 saved over 2 years vs Cypress Cloud
- Saved budget reallocates to Supabase Pro tier or marketing

---

## Alternative Stacks Considered

### Jest + Cypress
**Rejected because:**
- 10-20x slower than Vitest (kills TDD workflow)
- Cypress parallelization requires $67-75/month
- Jest's ESM support still experimental in 2026
- No compelling advantage over Vitest + Playwright

### Vitest + Cypress
**Rejected because:**
- Cypress's same-origin limitations problematic for Supabase OAuth
- Paid cloud required for parallelization (unnecessary expense)
- Playwright's WebSocket architecture better for real-time testing

### Jest + Playwright
**Rejected because:**
- Jest's slow execution undermines Playwright's speed gains
- No benefit to mixing old (Jest) and new (Playwright) paradigms
- Vitest + Playwright is the modern consensus stack

---

## Next Steps

### Immediate (Week 1)
1. ✅ Complete this research document
2. ⬜ Set up Vitest (Day 1, 4-6 hours)
3. ⬜ Set up Playwright (Day 2, 4-6 hours)
4. ⬜ Write first test for each layer (unit, integration, E2E)
5. ⬜ Configure GitHub Actions CI workflow

### Short-Term (Weeks 2-4)
1. ⬜ Establish test coverage baselines (60% unit, 30% integration, 10% E2E)
2. ⬜ Write RLS policy tests for each user role
3. ⬜ Create real-time subscription test utilities
4. ⬜ Document testing patterns for future reference

### Long-Term (Ongoing)
1. ⬜ Maintain test suite as features ship (TDD for new code)
2. ⬜ Monitor CI runtime, optimize if exceeding free tier
3. ⬜ Add visual regression testing if UI complexity grows (Playwright has built-in screenshots)
4. ⬜ Consider BrowserStack only if real Safari/iOS bugs emerge

---

## References

### Vitest vs Jest
- [Vitest vs Jest: Performance Comparison](https://betterstack.com/community/guides/scaling-nodejs/vitest-vs-jest/)
- [Jest vs Vitest 2025 Guide](https://medium.com/@ruverd/jest-vs-vitest-which-test-runner-should-you-use-in-2025-5c85e4f2bda9)
- [Why 2026 is the Year of Browser-Native Testing](https://dev.to/dataformathub/vitest-vs-jest-30-why-2026-is-the-year-of-browser-native-testing-2fgb)
- [Jest Took 12 Minutes, Vitest Took 8 Seconds](https://medium.com/engineering-playbook/jest-took-12-minutes-to-run-500-tests-vitest-took-8-seconds-860e7be3ffb6)
- [Vitest Developer Experience Comparison](https://howtotestfrontend.com/resources/vitest-vs-jest-which-to-pick)

### Playwright vs Cypress
- [Playwright vs Cypress 2026 Guide](https://bugbug.io/blog/test-automation-tools/cypress-vs-playwright/)
- [Playwright vs Cypress Enterprise Guide](https://devin-rosario.medium.com/playwright-vs-cypress-the-2026-enterprise-testing-guide-ade8b56d3478)
- [Why We Chose Playwright Over Cypress](https://www.qawolf.com/blog/why-qa-wolf-chose-playwright-over-cypress)
- [Playwright vs Cypress Key Differences](https://www.testmuai.com/blog/cypress-vs-playwright/)

### Next.js 16 + Vitest
- [Next.js Official Vitest Guide](https://nextjs.org/docs/app/guides/testing/vitest)
- [Setting Up Vitest with Next.js 16](https://www.codemancers.com/blog/2024-04-26-setup-vitest-on-nextjs-14)
- [Next.js Testing with Vitest and Playwright](https://strapi.io/blog/nextjs-testing-guide-unit-and-e2e-tests-with-vitest-and-playwright)
- [React Testing Library + Vitest for Next.js](https://medium.com/@rational_cardinal_ant_861/next-js-application-testing-with-vitest-and-testing-library-592948bb039c)

### Supabase Testing
- [Supabase Testing Overview](https://supabase.com/docs/guides/local-development/testing/overview)
- [Supabase Database Testing](https://supabase.com/docs/guides/database/testing)
- [Supabase Realtime Authorization](https://supabase.com/docs/guides/realtime/authorization)
- [Supabase Best Practices](https://www.leanware.co/insights/supabase-best-practices)
- [Testing Supabase Magic Login with Playwright](https://www.bekapod.dev/articles/supabase-magic-login-testing-with-playwright/)
- [Supawright Test Harness](https://github.com/isaacharrisholt/supawright)
- [Supabase RLS Automated Testing](https://aaronblondeau.com/posts/march_2024/supabase_rls_testing/)

### CI/CD Integration
- [Playwright and GitHub Actions Integration](https://dzone.com/articles/seamless-ci-cd-integration-playwright-and-github-actions)
- [Cypress Parallel Testing with GitHub Actions](https://www.cypress.io/blog/how-to-execute-test-cases-in-parallel-with-cypress-cloud-using-github-ci-cd-actions)
- [Playwright in GitHub Actions Guide](https://www.browsercat.com/post/playwright-github-actions-cicd-guide)

---

## Appendix: Quick Start Commands

### Vitest Setup
```bash
# Install dependencies
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths

# Run tests (watch mode)
npm run test

# Run with UI
npm run test:ui

# Coverage report
npm run test:coverage
```

### Playwright Setup
```bash
# Install Playwright
npm install -D @playwright/test

# Download browsers
npx playwright install

# Run E2E tests
npx playwright test

# Run with UI (debug mode)
npx playwright test --ui

# Run specific test file
npx playwright test tests/e2e/auth.spec.ts
```

### Combined CI Command
```bash
# Run all tests (for GitHub Actions)
npm run test:ci && npx playwright test
```

---

**Last Updated:** 2026-02-09
**Next Review:** After Phase 1 implementation (Week 6)
**Owner:** Solo Developer (TripOS Project)
