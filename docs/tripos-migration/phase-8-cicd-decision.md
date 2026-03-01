# Phase 8: CI/CD Decision

**Created**: 2026-02-09
**Status**: Complete
**Purpose**: Evaluate and select CI/CD solution for TripOS (TripOS) project

---

## Executive Summary

**Recommendation: Hybrid Approach (Vercel CI + GitHub Actions)** for solo developer with Next.js 16 + Supabase stack. Vercel handles all deployments/previews automatically (zero config, free), while GitHub Actions runs tests and database migrations ($0/month for small projects, ~$10-20/month at scale). This combination provides the simplest developer experience, fastest time-to-value, and lowest cost while maintaining flexibility to migrate off Vercel if needed.

---

## GitHub Actions

### Pros

- **Tight GitHub integration** - Lives next to your code, no context switching
- **Generous free tier** - 2,000 minutes/month for private repos, unlimited for public repos
- **Flexible workflows** - Complete control over CI pipeline (testing, linting, migrations, custom scripts)
- **Excellent caching** - Fast builds with dependency and build artifact caching
- **Supabase migration support** - Official Supabase CLI action available
- **Active ecosystem** - Thousands of community actions, well-documented patterns
- **No vendor lock-in** - Standard YAML workflows portable to other CI systems
- **Pricing transparency** - After Jan 1, 2026 pricing reduction (~39% cheaper for hosted runners)

### Cons

- **Minute consumption** - E2E tests with Playwright can consume minutes quickly (5-15 min/run)
- **Cold start overhead** - Runner provisioning adds 20-60 seconds per workflow
- **Complexity for beginners** - YAML syntax and workflow concepts have learning curve
- **Deployment friction** - Requires explicit Vercel CLI integration (vs Vercel's automatic deploys)
- **Platform fee incoming** - Self-hosted runners will cost $0.002/min starting March 2026 (delayed)
- **No built-in secrets management** - Must manually configure GitHub Secrets for Supabase credentials

### Free Tier (2026)

- **Build minutes**: 2,000 minutes/month (private repos), unlimited (public repos)
- **Storage**: 500 MB package storage
- **Concurrent jobs**: 20 concurrent jobs
- **Runner specs**: 2-core CPU, 7 GB RAM, 14 GB SSD (Linux)
- **Limitations**:
  - No minute rollover (use it or lose it)
  - Cannot purchase additional minutes on free tier
  - Must upgrade to Team ($4/user/month) to buy extra minutes

### Paid Tier (Team Plan)

- **Cost**: $4/user/month + $0.008/minute for Linux runners (after 3,000 included minutes)
- **What you get**:
  - 3,000 minutes/month included (50% more than free tier)
  - Purchase additional minutes at $0.008/min (~$8 per 1,000 minutes)
  - Larger runners available (4-core, 8-core options)
  - Enhanced security features (deployment protection, required reviewers)

### Typical Setup for This Project

**Workflow 1: Test & Lint** (runs on every push)
```yaml
# .github/workflows/test.yml
- Checkout code
- Setup Node.js 24
- Cache node_modules (actions/cache)
- Cache Playwright browsers (actions/cache)
- npm ci (clean install)
- Run ESLint
- Run type checking (tsc --noEmit)
- Run unit tests (Jest/Vitest)
- Run E2E tests (Playwright) - **only on PRs to save minutes**
```

**Workflow 2: Supabase Migrations** (runs on merge to main)
```yaml
# .github/workflows/supabase-deploy.yml
- Checkout code
- Setup Supabase CLI (supabase/setup-cli@v1)
- Link to Supabase project
- Run supabase db push (apply migrations)
- Generate TypeScript types
- Commit updated types (if changed)
```

**Minute consumption estimate:**
- Test & Lint: ~3-5 minutes per run
- Supabase Migrations: ~1-2 minutes per run
- 20 PRs/month × 5 min = 100 minutes
- 20 merges/month × 2 min = 40 minutes
- **Total: ~140-200 minutes/month** (well under 2,000 free limit)

---

## Vercel CI

### Pros

- **Zero configuration** - Connects to GitHub, auto-detects Next.js, deploys immediately
- **Automatic preview deployments** - Every PR gets a unique preview URL (invaluable for collaboration)
- **Blazing fast builds** - Next.js optimizations built-in, intelligent caching, edge network deployment
- **Built-in framework detection** - No config files needed for Next.js 16 App Router
- **First-class Next.js support** - Vercel created Next.js, so integration is seamless
- **Production-grade infrastructure** - Edge network, automatic HTTPS, DDoS protection, analytics included
- **Deployment protection** - Can require checks to pass before promoting to production
- **Instant rollbacks** - One-click rollback to any previous deployment
- **Simple developer experience** - Push code → deployed, no pipeline management needed

### Cons

- **Limited CI capabilities** - Only handles build/deploy, no test orchestration
- **Cannot run E2E tests natively** - Must use GitHub Actions or webhooks to trigger tests
- **No database migration support** - Vercel doesn't handle Supabase migrations
- **Vendor lock-in risk** - Heavy reliance on Vercel platform (though Next.js apps are portable)
- **Build minute limits** - Free tier has 6,000 minutes/month (but Next.js builds are fast: 2-5 min)
- **Commercial use restriction** - Hobby (free) tier is **strictly non-commercial only**
- **No secrets rotation** - Environment variables must be manually updated in Vercel dashboard
- **Bandwidth limits** - Hobby: 100 GB/month (fine for MVP, but can hit limits at 10K+ MAU)

### Free Tier (Hobby Plan)

- **Build minutes**: 6,000 minutes/month (Next.js builds typically 2-5 min)
- **Bandwidth**: 100 GB/month (~100,000 visitors/month)
- **Function invocations**: 150,000 requests/month (serverless functions)
- **Deployments**: Unlimited projects, unlimited deployments
- **Team size**: 1 user (personal, non-commercial use only)
- **Preview deployments**: Unlimited (every PR gets a preview URL)
- **Limitations**:
  - **Non-commercial use only** (must upgrade to Pro once monetizing)
  - No deployment protection (checks bypass)
  - No password protection for previews
  - No advanced analytics
  - No SAML SSO or team features

### Paid Tier (Pro Plan)

- **Cost**: $20/user/month
- **What you get**:
  - 1 TB bandwidth/month + $20 per extra 100 GB
  - 1 million function invocations + $4 per extra 100K
  - Deployment protection (require checks before production)
  - Password-protected previews
  - Advanced analytics and web vitals
  - Priority support
  - **Commercial use allowed**
  - Team collaboration features
  - Custom domains for preview deployments

### Typical Setup for This Project

**Automatic Workflow** (Vercel does this for you):
1. Push to branch → Vercel triggers build
2. Build Next.js app (~2-5 minutes)
3. Deploy to preview URL (if PR) or production (if main branch)
4. Optional: Wait for deployment protection checks (GitHub Actions tests)
5. Promote to edge network

**Environment-specific deployments:**
- `main` branch → Production (squadtrip.app)
- All other branches → Preview (unique URL per commit)
- Pull requests → Preview with GitHub integration comment

**What Vercel does NOT do:**
- Run tests (no Jest, Playwright, ESLint execution)
- Apply database migrations (no Supabase CLI integration)
- Custom pre-deploy scripts (beyond build hooks)

---

## Hybrid Approach (RECOMMENDED)

### How It Works

**Vercel**: Handles all deployments and hosting
- Automatic preview deployments for every PR
- Automatic production deploys on merge to main
- Zero configuration required
- Fast builds with intelligent caching

**GitHub Actions**: Handles quality checks and migrations
- Runs tests (unit + E2E) on every PR
- Applies Supabase migrations on merge to main
- Generates TypeScript types from database schema
- Blocks Vercel production deployment if checks fail (via Vercel Deployment Protection)

### Pros

- **Best of both worlds** - Vercel's deployment simplicity + GitHub Actions' flexibility
- **Minimal configuration** - Vercel works out-of-box, GitHub Actions only for tests/migrations
- **Cost optimized** - Most work happens on Vercel's free build minutes (6,000/month), GitHub Actions only consumes ~200 min/month
- **Developer experience** - Push code → tests run → auto-deploy if passing
- **Deployment protection** - Vercel waits for GitHub Actions checks before promoting to production
- **No vendor lock-in** - Can migrate off Vercel to Netlify/Cloudflare Pages (GitHub Actions workflows stay the same)
- **E2E testing on preview URLs** - GitHub Actions can test Vercel preview deployments before production
- **Database migration safety** - Migrations run in CI with Supabase CLI, not on developer machines

### Cons

- **Two systems to manage** - Vercel dashboard + GitHub Actions YAML (though both are simple)
- **Requires coordination** - Must configure Vercel deployment protection to wait for GitHub checks
- **Debugging complexity** - Build failures might be in Vercel OR GitHub Actions (need to check both)
- **Slightly longer feedback loop** - Tests run in GitHub Actions, then Vercel deploys (adds 1-3 min vs Vercel-only)

### Cost Analysis

**Free Tier (0-500 users):**
- Vercel Hobby: $0/month (6,000 build minutes, 100 GB bandwidth)
- GitHub Actions: $0/month (~200 minutes used of 2,000 free)
- **Total: $0/month**

**Early Growth (500-5K users):**
- Vercel Pro: $20/month (**required for commercial use**)
- GitHub Actions: $0/month (still under 2,000 free minutes unless running E2E tests on every commit)
- **Total: $20/month**

**Scale (5K-50K users):**
- Vercel Pro: $20/month + ~$40/month bandwidth overages (assuming 200 GB/month)
- GitHub Actions Team: $4/month + ~$8/month extra minutes (assuming 4,000 min/month with frequent E2E tests)
- **Total: ~$72/month**

### Workflow Architecture

```
Developer pushes to feature branch
  ↓
GitHub Actions Workflow #1: test.yml
  - Install dependencies (cached)
  - Run ESLint
  - Run type checking
  - Run unit tests
  - Install Playwright browsers (cached)
  - Run E2E tests (if PR, not every commit)
  - Report status to GitHub (check: passed/failed)
  ↓
Vercel Build (triggered automatically)
  - Build Next.js app
  - Deploy to preview URL
  - Wait for GitHub Actions checks (if Deployment Protection enabled)
  - Post preview URL to PR comments
  ↓
Developer merges PR to main
  ↓
GitHub Actions Workflow #2: supabase-deploy.yml
  - Setup Supabase CLI
  - Apply migrations (supabase db push)
  - Generate TypeScript types
  - Commit types if changed
  ↓
Vercel Production Deploy
  - Build Next.js app
  - Deploy to production (squadtrip.app)
  - Promote to edge network globally
```

### Implementation Steps

**Week 1: Vercel Setup (2 hours)**
1. Connect GitHub repo to Vercel
2. Configure environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
3. Set production environment secrets (SUPABASE_SERVICE_ROLE_KEY)
4. Test automatic preview deployments (create a PR)

**Week 2: GitHub Actions - Testing (4 hours)**
1. Create `.github/workflows/test.yml`
2. Configure Node.js caching (actions/cache)
3. Add ESLint + TypeScript checks
4. Add unit test job (Jest/Vitest)
5. Add Playwright browser caching
6. Add E2E test job (only on PRs)
7. Test the workflow with a dummy PR

**Week 3: GitHub Actions - Migrations (3 hours)**
1. Create `.github/workflows/supabase-deploy.yml`
2. Add Supabase credentials to GitHub Secrets
3. Configure supabase/setup-cli action
4. Test migration deployment to staging Supabase project
5. Add TypeScript type generation step

**Week 4: Deployment Protection (1 hour)**
1. Upgrade Vercel to Pro plan (when ready for commercial use)
2. Enable "Vercel Deployment Protection" in Vercel dashboard
3. Configure protection to require GitHub Actions checks
4. Test end-to-end: PR → tests → preview → merge → production

**Total: ~10 hours setup time**

---

## Other Options Considered

### CircleCI

**When to choose:** Performance-critical scenarios with heavy Docker builds, need multi-VCS support (GitLab, Bitbucket).

**Why not for this project:**
- Overkill for solo developer (complex credit-based pricing model)
- No meaningful advantage over GitHub Actions for Next.js + Supabase
- 10 credits/minute for medium Linux instance = expensive for frequent E2E tests
- Better suited for teams with advanced CI needs (test splitting, SSH debugging, Docker layer caching)

**Cost:** Free tier includes 6,000 credits/month (~600 min on medium Linux instance). Paid plans start at $15/month for 25,000 credits (~2,500 min).

### GitLab CI

**When to choose:** Need full DevOps platform (integrated issue tracking, wiki, container registry), replacing multiple tools (Jira, GitHub, Jenkins).

**Why not for this project:**
- Already using GitHub for version control (would require migration)
- Per-user pricing makes it most expensive option for solo dev ($19/user/month for Premium)
- Overkill for solo developer (built for enterprise compliance, security scanning, advanced deployment strategies)
- No advantage over GitHub Actions for Next.js + Supabase stack

**Cost:** Free tier is generous but limited. Premium plan $19/user/month required for advanced CI features.

### Summary Table

| Feature | GitHub Actions | Vercel CI | Hybrid | CircleCI | GitLab CI |
|---------|---------------|-----------|--------|----------|-----------|
| **Setup time** | 4-6 hours | 30 minutes | 10 hours | 6-8 hours | 8-10 hours |
| **Free tier** | 2,000 min/month | 6,000 min/month | Both free tiers | 600 min/month | Generous but limited |
| **Cost at scale** | ~$12/month | ~$60/month | ~$72/month | ~$30/month | ~$19/month |
| **Next.js integration** | Good | Excellent | Excellent | Good | Good |
| **Supabase migrations** | Yes | No | Yes | Yes | Yes |
| **E2E testing** | Yes | Via webhooks | Yes | Yes | Yes |
| **Preview deployments** | Manual | Automatic | Automatic | Manual | Manual |
| **Vendor lock-in** | Low | Medium | Low | Low | High |
| **Solo dev friendly** | ✅ Yes | ✅ Yes | ✅ Yes | ⚠️ Complex | ❌ Overkill |

---

## Winner: Hybrid Approach (Confidence: 95%)

### Rationale

For a solo developer building a Next.js 16 + Supabase SaaS in pre-MVP phase, the **Hybrid Approach (Vercel CI + GitHub Actions)** offers the optimal balance of simplicity, cost, and flexibility:

1. **Fastest time-to-value**: Vercel handles deployments with zero config (30 min setup). You don't write deployment scripts, manage infrastructure, or debug build failures. Push code → deployed.

2. **Cost-optimized for solo dev**: $0/month during development, $20/month once commercial (Vercel Pro required for business use). GitHub Actions stays free until you scale to 50K+ users with frequent E2E tests.

3. **Best developer experience**: Automatic preview deployments for every PR are invaluable for testing features before merge. Vercel posts preview URLs directly in PR comments. No other solution makes this as seamless.

4. **Handles Supabase migrations properly**: GitHub Actions runs Supabase CLI in CI (not on your laptop), ensuring migrations apply consistently to staging/production. Vercel can't do this alone.

5. **E2E testing on real deployments**: GitHub Actions waits for Vercel preview URL, runs Playwright tests against it, blocks production deploy if tests fail. This workflow is battle-tested and well-documented.

6. **No vendor lock-in**: If Vercel pricing becomes prohibitive, migrate to Netlify/Cloudflare Pages (1-2 days of work). GitHub Actions workflows stay unchanged. You own the deployment logic.

7. **Scales with you**: Free during MVP development, $20/month for first 5K users, ~$72/month for 50K users. Linear cost scaling, no surprise bills.

**When this choice breaks down:**
- If you need multi-cloud deployments (AWS + GCP + Azure) → Use CircleCI or GitLab CI
- If you're building a Docker-heavy monolith → Use CircleCI for Docker layer caching
- If you want to self-host everything → Use GitLab CI on your own servers
- If Vercel costs exceed $200/month → Consider Cloudflare Pages + GitHub Actions

None of these scenarios apply to a solo-dev Next.js SaaS in 2026.

### Typical CI Pipeline

**On every PR:**
1. GitHub Actions runs linting + type checking (~1 min)
2. GitHub Actions runs unit tests (~2 min)
3. GitHub Actions installs Playwright browsers (cached, ~30 sec)
4. Vercel builds Next.js app (~3 min)
5. Vercel deploys to preview URL
6. GitHub Actions runs E2E tests against preview URL (~5 min)
7. GitHub reports check status (✅ or ❌)
8. Developer reviews preview deployment + test results
9. If passing, merge to main

**On merge to main:**
1. GitHub Actions applies Supabase migrations (~1 min)
2. GitHub Actions generates TypeScript types from schema (~30 sec)
3. GitHub Actions commits updated types (if changed)
4. Vercel builds Next.js app (~3 min)
5. Vercel deploys to production (squadtrip.app)
6. Vercel promotes to edge network globally

**Total pipeline time:** ~12 minutes from PR creation to production (if tests pass and PR is merged).

---

## Implementation Timeline

**Assumptions:**
- Next.js 16 app already exists (boilerplate ready)
- Supabase project created with initial schema
- GitHub repo exists with main branch

### Phase 1: Vercel Setup (Week 1, ~2 hours)

**Day 1:**
- [ ] Create Vercel account, connect GitHub repo (15 min)
- [ ] Configure environment variables in Vercel dashboard (30 min)
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (production only)
- [ ] Test automatic deployment: push to main, verify build succeeds (15 min)
- [ ] Test preview deployment: create PR, verify preview URL generated (30 min)

**Day 2:**
- [ ] Set up Vercel CLI locally (`npm i -g vercel`) (10 min)
- [ ] Test manual deployment: `vercel --prod` (10 min)
- [ ] Configure custom domain (if applicable) (20 min)

### Phase 2: GitHub Actions - Testing (Week 2, ~4 hours)

**Day 1:**
- [ ] Create `.github/workflows/test.yml` (30 min)
- [ ] Add dependency caching (actions/cache for node_modules) (20 min)
- [ ] Add linting job (ESLint) (20 min)
- [ ] Add type checking job (tsc --noEmit) (20 min)
- [ ] Push and verify workflow runs (10 min)

**Day 2:**
- [ ] Add unit test job (Jest or Vitest) (30 min)
- [ ] Configure test coverage reporting (optional) (20 min)
- [ ] Add Playwright browser caching (30 min)
- [ ] Add E2E test job (Playwright) (40 min)
  - Only run on PRs (not every commit)
  - Use `if: github.event_name == 'pull_request'`

**Day 3:**
- [ ] Test full workflow: create PR, verify all checks pass (30 min)
- [ ] Optimize: ensure browsers cached, tests run in parallel (30 min)

### Phase 3: GitHub Actions - Migrations (Week 3, ~3 hours)

**Day 1:**
- [ ] Add Supabase credentials to GitHub Secrets (15 min)
  - `SUPABASE_ACCESS_TOKEN`
  - `SUPABASE_DB_PASSWORD`
  - `SUPABASE_PROJECT_ID`
- [ ] Create `.github/workflows/supabase-deploy.yml` (30 min)
- [ ] Add Supabase CLI setup (supabase/setup-cli@v1) (15 min)

**Day 2:**
- [ ] Add migration job: `supabase db push` (30 min)
- [ ] Add TypeScript type generation: `supabase gen types` (20 min)
- [ ] Configure Git to commit generated types (if changed) (30 min)

**Day 3:**
- [ ] Test migration workflow: create test migration, merge to main, verify applied (30 min)
- [ ] Set up staging environment (optional, recommended) (30 min)
  - Separate Supabase project for staging
  - Workflow runs on merge to `develop` branch

### Phase 4: Deployment Protection (Week 4, ~1 hour)

**When ready for commercial use (upgrade to Vercel Pro):**
- [ ] Upgrade Vercel to Pro plan ($20/month) (5 min)
- [ ] Enable "Deployment Protection" in Vercel project settings (10 min)
- [ ] Configure: "Require checks to pass before deploying to production" (10 min)
- [ ] Test end-to-end: create PR → tests fail → fix → tests pass → merge → production deploy (30 min)

**Total: 10-12 hours setup time** (spread across 4 weeks, or compress into 2-3 days of focused work)

---

## Cost Projection

### MVP Phase (0-500 users, Months 0-6)

**Vercel:**
- Plan: Hobby (Free) - **only if non-commercial development**
- Build minutes used: ~60 min/month (20 deploys × 3 min builds)
- Bandwidth used: ~10 GB/month (500 users × 20 MB avg)
- Cost: **$0/month**

**GitHub Actions:**
- Build minutes used: ~200 min/month (20 PRs × 10 min tests)
- Cost: **$0/month** (under 2,000 free limit)

**Total: $0/month**

**⚠️ Important**: Vercel Hobby plan is **non-commercial only**. If you're building a SaaS with intent to monetize, you must upgrade to Pro immediately, even at 0 users.

### Commercial Launch (0-500 users, Months 0-6)

**Vercel:**
- Plan: Pro ($20/month) - **required for commercial use**
- Build minutes used: ~60 min/month
- Bandwidth used: ~10 GB/month
- Cost: **$20/month**

**GitHub Actions:**
- Build minutes used: ~200 min/month
- Cost: **$0/month**

**Total: $20/month**

### Early Growth (500-5K users, Months 6-12)

**Vercel:**
- Plan: Pro ($20/month)
- Build minutes used: ~150 min/month (40 deploys × 3-4 min builds, growing codebase)
- Bandwidth used: ~80 GB/month (5,000 users × 16 MB avg)
- Cost: **$20/month** (within 1 TB included bandwidth)

**GitHub Actions:**
- Build minutes used: ~500 min/month (40 PRs × 12 min tests with E2E)
- Cost: **$0/month** (under 2,000 free limit)

**Total: $20/month**

### Scale (5K-50K users, Months 12-24)

**Vercel:**
- Plan: Pro ($20/month)
- Build minutes used: ~300 min/month (60 deploys × 5 min builds, larger app)
- Bandwidth used: ~200 GB/month (50,000 users × 4 MB avg, optimized assets)
- Bandwidth overage: 200 GB - 1,000 GB (included) = no overage
- Cost: **$20/month**

**GitHub Actions:**
- Build minutes used: ~4,000 min/month (80 PRs × 50 min total with extensive E2E tests)
- Overage: 4,000 - 2,000 (free) = 2,000 min × $0.008 = $16/month
- Team plan: $4/month (required to buy extra minutes)
- Cost: **$20/month** ($4 base + $16 overages)

**Total: $40/month**

**Note:** Most projects won't hit 4,000 min/month GitHub Actions usage unless running full E2E suites on every commit. Optimize by:
- Only running E2E tests on PRs (not every push)
- Using test sharding (split tests across jobs)
- Caching Playwright browsers aggressively
- Running smoke tests on every commit, full E2E suite nightly

### Hyper-Scale (50K+ users, Months 24+)

**Vercel:**
- Plan: Pro or Enterprise (custom pricing for >100K users)
- Bandwidth used: ~500 GB/month (100,000 users × 5 MB avg)
- Bandwidth overage: 500 GB - 1,000 GB (included) = no overage (still within Pro limits!)
- Cost: **$20-50/month** (may need Enterprise for advanced features, SLA)

**GitHub Actions:**
- Build minutes used: ~6,000 min/month (100+ PRs, extensive testing)
- Overage: 6,000 - 2,000 = 4,000 min × $0.008 = $32/month
- Team plan: $4/month
- Cost: **$36/month**

**Total: $56-86/month**

**Migration consideration:** At 100K+ users with high bandwidth (>1 TB/month), evaluate Cloudflare Pages (cheaper bandwidth) or self-hosted infrastructure. But this is a good problem to have.

---

## Risk Mitigation

### Risk 1: Vercel Costs Explode at Scale

**Likelihood:** Medium (bandwidth overages can surprise at 50K+ users)
**Impact:** High (could 10x hosting costs overnight)

**Mitigation:**
- Set up Vercel spending alerts ($50, $100 thresholds)
- Optimize Next.js Image component (automatic WebP, lazy loading)
- Enable aggressive CDN caching for static assets
- Monitor bandwidth in Vercel dashboard weekly
- Have migration plan ready for Cloudflare Pages (1-2 days to migrate)

### Risk 2: GitHub Actions Minutes Exhausted

**Likelihood:** Low (free tier is generous for solo dev)
**Impact:** Medium (CI pipeline stops, can't merge PRs)

**Mitigation:**
- Only run E2E tests on PRs, not every commit
- Use Playwright browser caching (saves 3 min per run)
- Implement test sharding for faster execution
- Monitor usage in GitHub billing dashboard monthly
- Upgrade to Team plan ($4/month) if approaching 2,000 min limit

### Risk 3: Supabase Migration Fails in CI

**Likelihood:** Medium (schema conflicts, missing credentials)
**Impact:** High (production database corrupted, downtime)

**Mitigation:**
- Always test migrations on staging Supabase project first
- Use `supabase db diff` to preview changes before applying
- Implement migration rollback scripts (down migrations)
- Never run migrations directly on production from local machine
- Use Supabase branching (preview branches for schema changes)

### Risk 4: Vercel Vendor Lock-in

**Likelihood:** Low (Next.js apps are portable)
**Impact:** Medium (1-2 days migration work)

**Mitigation:**
- Avoid Vercel-specific features (Vercel KV, Vercel Postgres, Vercel Blob)
- Use Supabase for database (already platform-agnostic)
- Use standard Next.js features (not Vercel Edge Config, etc.)
- Keep deployment logic in GitHub Actions (can switch deploy target)
- Document migration path to Cloudflare Pages or Netlify (1 page doc)

### Risk 5: E2E Tests Flake in CI

**Likelihood:** High (network issues, timing problems common with Playwright)
**Impact:** Medium (false negatives block PRs, slow development)

**Mitigation:**
- Configure 2 retries in Playwright config (reduces false negatives 40%)
- Use explicit waits, not sleeps (waitForSelector, waitForLoadState)
- Run tests in headed mode locally, headless in CI
- Implement test isolation (each test creates fresh data)
- Use Playwright trace viewer for debugging failures

---

## Next Steps

**Immediate (Week 1):**
1. Create Vercel account and connect GitHub repo (30 min)
2. Deploy current Next.js app to Vercel (verify it builds) (30 min)
3. Configure environment variables in Vercel dashboard (30 min)

**Short-term (Weeks 2-4):**
1. Implement GitHub Actions testing workflow (4 hours)
2. Implement GitHub Actions Supabase migration workflow (3 hours)
3. Test end-to-end: PR → tests → preview → merge → production (1 hour)

**Before Launch:**
1. Upgrade to Vercel Pro ($20/month) - **required for commercial use**
2. Enable Vercel Deployment Protection (10 min)
3. Set up monitoring and alerts (Vercel dashboard + GitHub notifications) (1 hour)

**Post-Launch Optimization:**
1. Add Playwright test sharding if E2E suite exceeds 10 min (2 hours)
2. Implement nightly E2E runs (full suite) vs PR smoke tests (1 hour)
3. Set up Supabase staging environment for safer migrations (2 hours)

---

## Sources

- [GitHub Actions pricing changes 2026](https://github.blog/changelog/2025-12-16-coming-soon-simpler-pricing-and-a-better-experience-for-github-actions/)
- [GitHub Actions billing documentation](https://docs.github.com/billing/managing-billing-for-github-actions/about-billing-for-github-actions)
- [Vercel pricing plans](https://vercel.com/pricing)
- [Vercel Hobby plan details](https://vercel.com/docs/plans/hobby)
- [Deploying Next.js to Vercel with GitHub Actions](https://www.ali-dev.com/blog/deploying-next-js-to-vercel-with-github-actions-a-quick-guide)
- [Setting up CI/CD for Next.js apps](https://medium.com/@vdsnini/setting-up-ci-cd-for-a-next-js-app-with-github-actions-a7286f3b8f1d)
- [Next.js CI build caching guide](https://nextjs.org/docs/pages/guides/ci-build-caching)
- [Deploying Supabase migrations with GitHub Actions](https://techblog.finalist.nl/blog/deploying-supabase-migrations-github-actions)
- [Supabase managing environments](https://supabase.com/docs/guides/deployment/managing-environments)
- [Automate Supabase migrations with CI/CD](https://saintlouvent.com/blog/automate-supabase-migrations-with-ci)
- [Supabase CLI Action](https://github.com/marketplace/actions/supabase-cli-action)
- [Caching Playwright browsers in GitHub Actions](https://dev.to/ayomiku222/how-to-cache-playwright-browser-on-github-actions-51o6)
- [How to cache Playwright on GitHub Actions](https://playwrightsolutions.com/playwright-github-action-to-cache-the-browser-binaries/)
- [Automating Playwright tests with GitHub Actions](https://medium.com/@andrewmart.in/automating-playwright-tests-with-github-actions-5f9ba3dc06a7)
- [Running E2E tests on Vercel preview deployments](https://vercel.com/kb/guide/how-can-i-run-end-to-end-tests-after-my-vercel-preview-deployment)
- [How to use Playwright with GitHub Actions for Vercel previews](https://cushionapp.com/journal/how-to-use-playwright-with-github-actions-for-e2e-testing-of-vercel-preview)
- [CircleCI vs GitHub Actions comparison](https://northflank.com/blog/circleci-vs-github-actions)
- [Jenkins vs GitLab CI vs CircleCI vs GitHub Actions](https://technologymatch.com/blog/jenkins-vs-gitlab-ci-vs-circleci-vs-github-actions-the-ci-cd-decision-guide-in-2026)
- [GitHub Actions vs CircleCI official comparison](https://circleci.com/compare/github-actions-vs-circleci/)

---

## Last Updated

2026-02-09 - Initial decision document created based on comprehensive research of CI/CD solutions for Next.js 16 + Supabase stack.
