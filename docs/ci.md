# CI/CD Pipeline Guide

## Overview

The TripFlow project uses GitHub Actions for continuous integration and testing. The pipeline is optimized for fast feedback with parallel test execution, flaky test detection, and comprehensive quality checks.

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Trigger: Push, PR, or Weekly Schedule                 │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │  Lint + Type  │  (~2 min)
         │     Check     │
         └───────┬───────┘
                 │
         ┌───────▼───────┐
         │  Unit Tests   │  (~1 min, 81 tests)
         │   (Vitest)    │
         └───────┬───────┘
                 │
         ┌───────▼────────────────────┐
         │  E2E Tests (Playwright)    │  (~10 min)
         │  ┌────┬────┬────┬────┐    │
         │  │ S1 │ S2 │ S3 │ S4 │    │  4 parallel shards
         │  └────┴────┴────┴────┘    │
         └────────┬──────────────────┘
                  │
         ┌────────▼───────────┐
         │  Burn-In Loop      │  (~40 min, PRs only)
         │  (10 iterations)   │  Flaky detection
         └────────┬───────────┘
                  │
         ┌────────▼────────┐
         │  Test Report    │  Summary & artifacts
         └─────────────────┘
```

## Workflow File

**Location**: `.github/workflows/test.yml`

**Triggers**:
- Push to `main`, `feat/itinerary-redesign`, or `develop`
- Pull requests to these branches
- Weekly schedule (Sundays 2 AM UTC)

## Jobs

### 1. Lint (5 min timeout)

Runs code quality checks:
- ESLint (`npm run lint`)
- TypeScript type checking (`npm run type-check`)

**Fast feedback** - fails immediately if code quality issues found.

### 2. Unit Tests (10 min timeout)

Runs Vitest unit tests:
- 81 tests across components, hooks, utilities
- Uploads coverage on failure
- Fast execution (~1 min)

### 3. E2E Tests (30 min timeout)

Runs Playwright E2E tests with parallel sharding:
- **4 shards** run simultaneously
- Each shard gets 1/4 of the test suite
- Chromium browser only (for speed)
- Uploads test results + traces on failure

**Why sharding?** A 40-minute test suite becomes 10 minutes with 4 shards.

### 4. Burn-In Loop (60 min timeout, PRs only)

Detects flaky tests by running E2E suite 10 times:
- Only runs on pull requests or scheduled runs
- Fails on first error (strict mode)
- Uploads artifacts on failure

**Why burn-in?** Catches timing-dependent bugs that pass 90% of the time but fail in production.

### 5. Test Report (always runs)

Aggregates results and publishes summary:
- Downloads all artifacts
- Generates markdown summary in GitHub UI
- Alerts on flaky test detection

## Helper Scripts

### Run CI Locally

```bash
cd tripflow-next
./scripts/ci-local.sh
```

Mirrors CI environment on your machine (lint → unit → E2E).

### Test Changed Files Only

```bash
cd tripflow-next
./scripts/test-changed.sh
```

Runs tests for files changed in your branch (vs `main`).

### Run Burn-In Loop

```bash
cd tripflow-next
./scripts/burn-in.sh [iterations]
```

Run E2E tests N times (default 10) to detect flaky tests.

## Caching Strategy

The pipeline uses smart caching to speed up builds:

1. **npm dependencies**: Cached by `package-lock.json` hash
2. **Playwright browsers**: Cached by lockfile hash (~200 MB)

**Cache hit?** Dependencies install in <30 seconds instead of 2-3 minutes.

## Artifacts

Artifacts are uploaded **only on failure**:

- **Unit test results**: Coverage reports
- **E2E test results**: HTML reports, traces, screenshots
- **Burn-in failures**: Full diagnostic output

**Retention**: 30 days

**Access**: Download from GitHub Actions → Summary → Artifacts

## Parallel Sharding

E2E tests use Playwright's built-in sharding:

```yaml
matrix:
  shard: [1, 2, 3, 4]

# Each job runs:
npm run test:e2e -- --shard=$shard/4
```

**Adjusting shard count**: Edit the matrix in `.github/workflows/test.yml`. More shards = faster, but uses more CI minutes.

**Rule of thumb**:
- <100 tests: 2 shards
- 100-500 tests: 4 shards
- 500+ tests: 6-8 shards

## Secrets & Environment Variables

See [ci-secrets-checklist.md](./ci-secrets-checklist.md) for required secrets.

Current secrets: None required (tests run without external services).

## Troubleshooting

### Tests pass locally but fail in CI

1. Run `./scripts/ci-local.sh` to mirror CI environment
2. Check Node version matches (24 LTS)
3. Ensure `npm ci` (not `npm install`) is used
4. Check for environment-specific code paths

### Flaky test detected in burn-in

1. Download burn-in artifacts from GitHub Actions
2. Review Playwright traces to find timing issues
3. Check for:
   - Race conditions in async code
   - Missing `await` statements
   - Shared state between tests
   - Network timing assumptions

### Cache not working

1. Check `package-lock.json` hasn't changed
2. Verify cache paths in workflow file
3. GitHub may purge caches after 7 days of no use

### Job timeout

1. Reduce shard count (more shards = more overhead)
2. Check for hanging tests (missing timeouts?)
3. Increase timeout in workflow file (but investigate root cause)

## Status Badge

Add to README.md:

```markdown
[![Test Pipeline](https://github.com/PedroLages/asia-trip/actions/workflows/test.yml/badge.svg)](https://github.com/PedroLages/asia-trip/actions/workflows/test.yml)
```

## Performance Targets

| Stage | Target Time | Notes |
|-------|-------------|-------|
| Lint | <2 min | Fast failure |
| Unit tests | <2 min | 81 tests |
| E2E (per shard) | <10 min | 4 parallel shards |
| Burn-in | <45 min | 10 iterations, PRs only |
| **Total (PR)** | **<15 min** | Without burn-in |
| **Total (PR + burn-in)** | **<50 min** | Full quality gate |

## Next Steps

1. ✅ CI pipeline configured
2. ⏭️ Push to GitHub to trigger first run
3. ⏭️ Monitor first run for any issues
4. ⏭️ Adjust shard count if needed
5. ⏭️ Add CI badge to README

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright Sharding](https://playwright.dev/docs/test-parallel#shard-tests-between-multiple-machines)
- [Vitest Documentation](https://vitest.dev/)
