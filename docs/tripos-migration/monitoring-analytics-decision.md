# Phase 9: Monitoring & Analytics Decision

**Created**: 2026-02-09
**Status**: Complete
**Purpose**: Research-based decision framework for monitoring and analytics stack for TripOS MVP

---

## Executive Summary

**Recommended MVP Stack (Weeks 0-22):**
- **Error Tracking**: Sentry (5K events/month free, then $26/month)
- **Product Analytics**: PostHog (1M events/month free, all features included)
- **Performance Monitoring**: Vercel Speed Insights (included free with Pro plan)
- **Session Replay**: **DEFER** until post-MVP (privacy concerns + not essential for validation)

**Total MVP Cost**: $46/month ($26 Sentry + $20 Vercel Pro, PostHog free tier)

**Rationale**: This stack provides essential observability without compromising user privacy in a travel planning app. PostHog's generous free tier (1M events) covers analytics needs through initial growth. Session replay is deferred due to GDPR/privacy concerns with sensitive travel data (budgets, destinations, group dynamics).

**Post-MVP Additions** (after 1K+ users, validated product-market fit):
- Consider session replay (OpenReplay self-hosted for privacy control)
- Upgrade PostHog if exceeding 1M events/month
- Add specialized monitoring if Supabase performance becomes bottleneck

---

## Error Tracking

### Sentry

**Pros:**
- Industry standard with best-in-class error monitoring
- Excellent Next.js integration (5 lines of code to set up)
- Source map support for production debugging
- User context tracking (identify which users hit errors)
- Breadcrumbs show events leading up to errors
- Release tracking and deploy notifications
- GitHub/Slack/Jira integrations
- Performance monitoring bundled (see APM section)
- Strong community and documentation

**Cons:**
- Reported implementation issues with Next.js in some releases
- Can become expensive at scale (5K free → $26/month → usage-based)
- Source map uploads can cause build errors (configuration complexity)
- Event limits can be hit quickly if not properly filtered

**Free Tier:**
- 5,000 error events per month
- 1 user included
- 90-day data retention
- All core features (breadcrumbs, releases, integrations)

**Paid Tier:**
- Team plan: $26/month (billed annually) for up to 50K events
- Includes 20 custom dashboards, unlimited metric alerts
- Unlimited users and third-party integrations
- Enhanced debugging with Seer (AI-powered error grouping)

**Setup Time:** 1-2 hours (SDK integration + source map configuration)

**Scaling Costs:**
- 0-5K events: $0/month
- 5K-50K events: $26/month (Team plan)
- 50K-100K events: ~$52/month
- 100K-500K events: ~$150-250/month (custom pricing)

---

### Rollbar (Alternative)

**Pros:**
- Generous free tier (25,000 events/month vs Sentry's 5,000)
- Automatic grouping of similar errors based on impact
- Real-time error tracking with detailed context
- Strong PHP, Python, Ruby, Node.js support
- Lower cost at higher volumes

**Cons:**
- Less popular than Sentry (smaller community)
- Fewer third-party integrations
- User feedback collection not as robust
- Performance monitoring not included (errors only)

**Free Tier:**
- 25,000 error events per month (5x more than Sentry)
- Single project
- 30-day data retention

**Paid Tier:**
- Essentials: $21/month (100K events)
- Advanced: $49/month (300K events)
- Enterprise: $82/month+ (1M+ events)

**Setup Time:** 1 hour

---

### Bugsnag (Alternative)

**Pros:**
- Mobile-first focus (iOS, Android, React Native, Unity)
- Can detect ANRs (App Not Responding) and OOM (Out of Memory) errors
- Stability score tracking across releases
- Extensive 3rd party integrations (most in category)
- Good for cross-platform apps (web + mobile future-proofing)

**Cons:**
- More expensive than Sentry/Rollbar for web-only apps
- Smaller free tier than Rollbar
- Overkill for web-first MVP (mobile features not needed yet)

**Free Tier:**
- 7,500 events per month (single user)
- 14-day data retention

**Paid Tier:**
- Team: $59/month (50K events)
- Professional: $199/month (200K events)
- Enterprise: $499/month+ (1M+ events)

**Setup Time:** 1-2 hours

---

### Highlight.io (Open-Source Alternative)

**Pros:**
- Open-source, fullstack monitoring platform
- Combines error tracking + session replay + logging + tracing
- Developer-focused with excellent DX
- Very generous free tier (25K MAUs)
- Privacy controls built-in
- Self-hosting option for complete data control

**Cons:**
- **CRITICAL: Migrating to LaunchDarkly by Feb 28, 2026** (business uncertainty)
- Smaller community than Sentry
- Newer product (less battle-tested)
- Documentation not as comprehensive
- Integration ecosystem less mature

**Free Tier:**
- Up to 25,000 monthly active users (MAU-based, not event-based)
- Unlimited team members
- All features included (session replay, errors, logs, traces)

**Paid Tier:**
- Pricing not clearly published (contact sales)

**Setup Time:** 2-3 hours

**Recommendation:** AVOID due to LaunchDarkly migration uncertainty

---

### Winner: **Sentry** (Confidence: 85%)

**Rationale:**
- Industry standard with proven reliability at scale
- 5K free events sufficient for MVP (expect 100-500 errors/month initially)
- Bundled performance monitoring (see APM section)
- Best Next.js integration despite occasional hiccups
- Strong ecosystem for future integrations (Slack, GitHub, Jira)
- Clear upgrade path as we scale

**When to reconsider:**
- If hitting 5K events/month before revenue → Switch to Rollbar (25K free) temporarily
- If mobile app becomes priority → Evaluate Bugsnag
- If privacy/compliance becomes critical → Self-host Highlight.io (if still available)

---

## Session Replay

### Privacy Context for Travel Apps

**CRITICAL CONSIDERATIONS:**
- Session replay can capture sensitive personal data without explicit consent
- Travel apps contain highly sensitive data:
  - Budget information (especially blind budgeting feature)
  - Destination preferences (privacy/safety concerns)
  - Group member relationships and voting patterns
  - Payment information in expense tracking
  - Personal communication in activity notes
- GDPR, CCPA, PSD2 regulations place strict rules on session data handling
- Failing to comply = heavy fines + reputational damage
- User trust is paramount for group travel (breach = app death)

**Best Practices:**
- Encrypt all session data in transit and at rest
- Implement strict data masking (passwords, credit cards, emails, budgets)
- Require explicit user consent (not just privacy policy checkbox)
- Provide user-facing session deletion controls
- Limit retention to 30 days maximum
- Restrict team access (not all developers should view sessions)

**Recommendation for MVP:** **DEFER** session replay entirely until:
1. Product-market fit validated (500+ active trips)
2. Privacy policy vetted by legal counsel
3. Explicit user consent flows designed
4. GDPR compliance verified
5. Clear product need (are users reporting UI bugs we can't reproduce?)

---

### LogRocket

**Pros:**
- Industry leader in session replay
- Comprehensive frontend monitoring (network requests, console logs, Redux/state changes)
- Error tracking integrated with session context
- Performance monitoring (Core Web Vitals)
- Frustration signals (rage clicks, dead clicks)
- Heatmaps and funnel analysis
- Upfront transparent pricing (unlike FullStory)

**Cons:**
- **Privacy approach: Opt-out by default** (requires manual redaction)
- Performance impact on page load (100-200ms overhead)
- Expensive at scale ($69-$295/month for basic usage)
- Separate pricing for mobile vs web (complexity)
- Can capture sensitive data unless carefully configured
- Free tier very limited (1K sessions = ~30 sessions/day)

**Free Tier:**
- 1,000 sessions per month
- Single project
- Basic features only

**Paid Tier:**
- Team: $69/month (10K sessions)
- Professional: $295/month (50K sessions + AI struggle detection)
- Enterprise: Custom pricing (500K+ sessions)

**Setup Time:** 2-3 hours (SDK + privacy configuration)

**Privacy Configuration Time:** +4-6 hours (identify and mask all sensitive fields)

---

### FullStory

**Pros:**
- Powerful analytics beyond session replay (autocapture all events)
- Advanced search and segmentation
- "Private by default" privacy model (better than LogRocket)
- GDPR/CCPA compliance features built-in
- Customizable data masking rules
- Omnisearch (find sessions by any attribute)
- Enterprise-grade security (SOC 2)

**Cons:**
- **No transparent pricing** (must contact sales = red flag for solo dev)
- Reportedly very expensive (estimates: $199-$500/month minimum)
- Overkill for MVP (too many features you won't use)
- 14-day trial only for Business plan
- Vendor lock-in (difficult to migrate out)
- Heavy JavaScript bundle (performance impact)

**Free Tier:**
- None (14-day trial only, Business plan only)

**Paid Tier:**
- Must contact sales (no public pricing)
- Estimated $199-$500/month minimum based on reviews

**Setup Time:** 3-4 hours

---

### Sentry Session Replay

**Pros:**
- **Privacy-first: Obfuscates all text/images by default** (opt-in to safe data)
- Integrated with Sentry error tracking (same platform, no extra tool)
- Code-level context (see exact line of code where error occurred)
- Cost-effective (bundled with error monitoring)
- Lower performance impact than LogRocket/FullStory
- Familiar UI if already using Sentry errors
- Easy to correlate replays with errors

**Cons:**
- Less mature than LogRocket/FullStory (fewer features)
- No heatmaps or funnel analysis (pure replay, not analytics)
- Limited search/filtering compared to FullStory
- Replay quality occasionally lower (frame rate, compression)
- Relatively new product (launched 2022, still evolving)

**Free Tier:**
- 50 replay sessions per month (very limited)
- Included with Sentry free error tracking tier

**Paid Tier:**
- $26/month (Team plan) includes 500 replay sessions
- Additional replays: ~$0.000050 per replay session
- Example: 5,000 replays = ~$26 + $250 = $276/month

**Setup Time:** 30 minutes (if already using Sentry for errors)

---

### OpenReplay (Open-Source Alternative)

**Pros:**
- **Open-source and self-hostable** (complete data control)
- **Best for privacy/compliance** (data never leaves your infrastructure)
- Full feature parity with LogRocket (session replay, DevTools, performance)
- Co-browsing with live video calls, remote control, annotations
- Unlimited sessions on self-hosted (infrastructure cost only)
- No per-session pricing on cloud option
- No separate mobile vs web pricing
- Generous cloud pricing ($5.95 per 1,000 sessions)

**Cons:**
- Self-hosting requires infrastructure expertise (not ideal for solo dev MVP)
- Cloud option still costs money (no free tier)
- Smaller community than LogRocket/FullStory
- Less polished UI than commercial alternatives
- Self-hosting = maintenance burden (updates, scaling, backups)

**Free Tier:**
- Self-hosted only (no free cloud tier)
- Infrastructure costs: ~$50-100/month for modest traffic (AWS/DigitalOcean)

**Paid Tier (Cloud):**
- Pay-as-you-go: $5.95 per 1,000 sessions (~$30/month for 5K sessions)
- Dedicated cloud: $199/month minimum

**Setup Time:**
- Cloud: 2-3 hours
- Self-hosted: 1-2 days (Docker/Kubernetes setup + SSL + monitoring)

---

### Winner: **DEFER** (Confidence: 90%)

**Rationale:**
- **Privacy risks outweigh benefits for MVP** in a travel app with sensitive data
- **Not essential for initial validation** (error tracking + analytics sufficient)
- **Cost savings**: $70-300/month deferred until needed
- **Development time savings**: 10-15 hours deferred (setup + privacy configuration)
- **Reduced compliance burden**: Simpler GDPR policy without session recording

**When to add session replay:**
- Post-MVP (after 1K users, validated PMF)
- When receiving UI bug reports that can't be reproduced
- When conversion funnels show drop-off but analytics can't explain why
- When budget allows ($100-200/month)

**If you must add session replay pre-MVP:**
1. **Best option: OpenReplay cloud** ($5.95/1K sessions = ~$30/month for MVP)
   - Privacy-focused by design
   - Affordable scaling
   - Can self-host later if needed
2. **Alternative: Sentry Session Replay** (bundled with errors, privacy-first)
   - But free tier only 50 sessions = not useful
   - Would need Team plan ($26/month) for 500 sessions

---

## Product Analytics

### PostHog

**Pros:**
- **Extremely generous free tier**: 1M events/month (vs competitors: 100K-200K)
- **All features included**: Product analytics, web analytics, session replay (5K/month), feature flags (1M requests), surveys (1.5K responses)
- **Open-source** with self-hosting option (complete data control)
- **Privacy-first**: GDPR-compliant, EU hosting available, can self-host
- **No per-seat pricing** (unlimited team members)
- **Transparent pricing**: Usage-based with generous free tier resets monthly
- Event autocapture (zero-code analytics)
- SQL access to raw data (warehouse mode)
- Funnels, cohorts, retention, path analysis
- A/B testing and feature flags (unique in analytics space)

**Cons:**
- All-in-one = steeper learning curve than simple analytics tools
- Self-hosting at scale requires infrastructure expertise (100M+ events)
- Not as simple as Plausible/Fathom for basic website analytics
- Event autocapture can be noisy (need to filter signals)
- Newer product than Mixpanel/Amplitude (less enterprise adoption)

**Free Tier:**
- **1M product analytics events per month**
- 5K session replays per month
- 1M feature flag requests per month
- 1.5K survey responses per month
- All features included (no plan-based limitations)
- Unlimited team members
- Resets every month (not cumulative)

**Paid Tier (Usage-Based):**
- Product analytics: $0.000248/event after 1M (extremely cheap)
- Session replay: $0.005/replay after 5K
- Feature flags: $0.0001/request after 1M
- Example: 2M events = $0 (first 1M free) + $248 (second 1M) = $248/month

**Self-Hosting Costs:**
- Suitable for <100K events/month on basic infrastructure
- >100M events/month: $500-800/month infrastructure (cheaper than cloud)
- Requires DevOps expertise (not recommended for solo dev MVP)

**Setup Time:** 2-3 hours (SDK integration + event schema design)

---

### Vercel Analytics

**Pros:**
- **Built into Vercel platform** (zero-config if already using Vercel)
- **Privacy-first**: No cookies, no personal data, GDPR-compliant by design
- **Zero performance impact**: Runs after page load, uses beacons
- Simple, focused dashboard (page views, referrers, devices)
- **Includes Speed Insights** (Core Web Vitals tracking)
- No JavaScript bundle (built into Vercel edge network)
- Perfect for simple marketing website analytics

**Cons:**
- **Very basic** compared to PostHog/Mixpanel (no events, funnels, cohorts)
- **Page views only** (can't track custom user actions like "voted on poll")
- **Vercel lock-in** (only works on Vercel-hosted apps)
- No event tracking = can't answer product questions ("How many votes cast?")
- No user identification (anonymous page views only)
- **Hobby plan = non-commercial use only** (violates TOS for SaaS app)
- Pro plan required = $20/user/month

**Free Tier (Hobby):**
- **Non-commercial use only** (can't use for TripOS)
- Unlimited page views
- Basic dashboard
- Speed Insights included

**Paid Tier (Pro):**
- $20/user/month (minimum $20/month for solo dev)
- Unlimited page views
- Same features as Hobby (just commercial license)
- Speed Insights included

**Setup Time:** 10 minutes (add `@vercel/analytics` package)

---

### Plausible (Privacy-First Alternative)

**Pros:**
- **Extreme privacy focus**: No cookies, no personal data, GDPR/CCPA compliant by default
- **Open-source** with self-hosting option
- **Lightweight script** (<1KB vs Google Analytics 45KB)
- **Simple, beautiful dashboard** (non-technical stakeholders love it)
- EU-hosted (GDPR data residency)
- Anonymizes visitor data after 24 hours
- Transparent company values (privacy as core mission)
- Perfect for public marketing site analytics

**Cons:**
- **Very expensive** compared to PostHog ($9/month minimum, $69/month for growth)
- **Basic features only**: No funnels, cohorts, retention, user identification
- **Website analytics only** (not product analytics for SaaS app)
- Can't track logged-in user behavior (anonymous only)
- No event tracking on free tier
- Business plan required ($69/month) for ecommerce/custom events
- Overkill if you just need simple privacy-compliant analytics (use Vercel)

**Free Tier:**
- None (30-day trial only)

**Paid Tier:**
- Growth: $9/month (10K page views)
- Growth+: $19/month (100K page views)
- Business: $69/month (100K page views + custom events + funnels + ecommerce)

**Self-Hosting Costs:**
- Free (AGPLv3 license)
- Infrastructure: ~$10-20/month (modest traffic)
- Requires Docker/Kubernetes knowledge

**Setup Time:**
- Cloud: 15 minutes
- Self-hosted: 1-2 hours

---

### Mixpanel (Traditional Product Analytics)

**Pros:**
- Industry standard for product analytics (mature, battle-tested)
- Powerful segmentation and funnel analysis
- Cohort analysis and retention tracking
- Real-time reports
- Predictive analytics (churn risk scoring)
- Strong mobile analytics (future-proofing)

**Cons:**
- **Small free tier** (100K monthly tracked users, but only 1M events vs PostHog's 1M events with unlimited users)
- **Expensive paid plans** ($4.5K-$15K/month for growth stage)
- **Separate pricing for add-ons** (Group Analytics, Data Pipelines, Experiments)
- No session replay (must use separate tool)
- No feature flags (must use separate tool)
- 90-day data retention on free tier (vs PostHog's unlimited)
- Per-seat fees on paid plans (vs PostHog unlimited)

**Free Tier:**
- 1 million events per month (tracked as monthly tracked users)
- 100K monthly tracked users
- 90-day data retention
- Basic features only
- Unlimited team members

**Paid Tier:**
- Growth: Contact sales (estimated $4.5K-$15K/month based on reviews)
- Enterprise: Custom pricing ($15K-$50K/month)

**Setup Time:** 3-4 hours

---

### Winner: **PostHog** (Confidence: 95%)

**Rationale:**
- **1M free events/month covers entire MVP** (expect 50K-200K events in first 3 months)
- **All-in-one platform** = fewer tools to integrate (analytics + feature flags + surveys)
- **Privacy-first** with EU hosting and self-host option (future-proofs compliance)
- **No per-seat pricing** = can invite collaborators without cost
- **Event-based pricing** = only pay for actual usage (not inflated user counts)
- **Clear upgrade path** = $0.000248/event after 1M is extremely affordable

**Cost Projection:**
- MVP (0-500 users, ~100K events/month): $0/month
- Growth (500-5K users, ~500K events/month): $0/month (still under 1M)
- Scale (5K-50K users, ~3M events/month): ~$500/month (2M overage × $0.000248)

**Alternative for Marketing Site Only:**
If TripOS had a separate marketing website (not an app), Vercel Analytics would be perfect for that site, while PostHog tracks the logged-in app. But for MVP, PostHog alone is sufficient.

**When to reconsider:**
- If events exceed 1M/month before revenue → Optimize event tracking (reduce noise)
- If need extremely simple analytics → Add Vercel Analytics for marketing site
- If prioritize extreme privacy → Self-host Plausible (but lose product analytics features)

---

## Performance Monitoring

### Vercel Speed Insights

**Pros:**
- **Built into Vercel platform** (zero extra setup if using @vercel/analytics)
- **Tracks Core Web Vitals**: LCP, FID, CLS, FCP, TTFB, INP
- **Real user monitoring** (RUM from actual visitors, not synthetic tests)
- Simple dashboard integrated with Vercel deployments
- **No performance impact** (edge-based collection)
- Free on Hobby tier (but non-commercial), included on Pro ($20/month)
- Perfect for Next.js apps on Vercel

**Cons:**
- **Basic metrics only** (no API monitoring, no database query insights)
- **Vercel-only** (can't monitor Supabase backend performance)
- No alerting (just dashboards)
- No distributed tracing (can't trace request through full stack)
- No custom performance marks/measures

**Free Tier (Hobby):**
- Non-commercial use only
- All Speed Insights features
- Unlimited page views

**Paid Tier (Pro):**
- $20/user/month
- Same features as Hobby (commercial license)

**Setup Time:** 5 minutes (already included with @vercel/analytics)

---

### Sentry Performance Monitoring

**Pros:**
- **Integrated with error tracking** (same platform, correlated data)
- **Distributed tracing** (trace request from frontend → API → database)
- **Frontend + backend monitoring** (full-stack visibility)
- Transaction-level insights (identify slow API endpoints)
- Database query tracking (see slow Supabase queries)
- Custom instrumentation (add performance marks anywhere)
- Release-based tracking (compare performance across deploys)
- Alerting on performance regressions

**Cons:**
- **Separate quota from errors** (transactions counted separately)
- Can be expensive at scale (charges per transaction)
- Requires instrumentation (not automatic like Vercel)
- Overhead on server (slight performance impact)
- Complex setup for full-stack tracing

**Free Tier:**
- 10,000 transactions per month (separate from 5K error events)
- 90-day retention
- All performance features included

**Paid Tier:**
- Team plan: $26/month includes 100K transactions
- Additional transactions: ~$0.000025 per transaction
- Example: 500K transactions = ~$26 + $10 = $36/month
- **IMPORTANT**: Combined with errors, you're paying for both quotas

**Setup Time:** 2-3 hours (SDK + custom instrumentation)

**Cost Projection:**
- MVP (0-500 users, ~50K transactions/month): $0/month (under 10K? No, likely over)
- Realistic MVP: $26/month (Team plan for 100K transactions)
- Growth (500-5K users, ~500K transactions/month): ~$36/month
- Scale (5K-50K users, ~3M transactions/month): ~$100/month

---

### New Relic APM

**Pros:**
- **Very generous free tier**: 100GB data ingest/month, 1 full platform user
- **Enterprise-grade APM**: Distributed tracing, service maps, anomaly detection
- **Full observability**: APM, infrastructure, logs, browser, mobile, serverless
- **AI-powered insights**: AIOps, intelligent alerting, root cause analysis
- Unlimited basic users (view-only)
- Industry leader (mature, battle-tested)
- Excellent for complex microservices architectures

**Cons:**
- **Overkill for MVP** (you don't have microservices or 10+ services)
- **Steep learning curve** (complex platform designed for enterprises)
- **Data ingest model** = harder to predict costs (vs transaction-based)
- 8-day retention on free tier (vs 90 days for Sentry)
- Heavy instrumentation (performance overhead)
- Not optimized for Next.js/Vercel (generic Node.js agent)

**Free Tier:**
- 100GB data ingest per month
- 1 full platform user
- Unlimited basic users
- 8-day data retention
- All 50+ capabilities included

**Paid Tier:**
- Standard: $10 first user, $99/additional user (up to 5 users)
- Pro: Custom pricing
- Data overage: $0.40/GB (original) or $0.60/GB (Data Plus)

**Setup Time:** 4-6 hours (agent setup + configuration)

---

### Winner: **Vercel Speed Insights** (Confidence: 90%)

**Rationale:**
- **Already included with Vercel Pro** ($20/month for deployment + analytics + speed)
- **Covers essential use case**: Frontend Web Vitals monitoring
- **Zero setup time** (built-in, no extra tool)
- **Sufficient for MVP** (backend performance can be monitored via Supabase Dashboard)

**Post-MVP consideration:**
- Add **Sentry Performance** ($26/month) if:
  - Backend API performance becomes critical
  - Need to debug slow Supabase queries
  - Users reporting performance issues (need distributed tracing)
  - Want to correlate errors with performance (same platform)
- Add **New Relic** only if:
  - Microservices architecture emerges
  - Enterprise customers require APM
  - Multi-cloud deployment (not just Vercel + Supabase)

**For MVP:** Vercel Speed Insights + Supabase Dashboard (free) is sufficient. Defer Sentry Performance until you have actual performance problems to solve.

---

## Recommended Stack

### MVP (Phase 1-5, Weeks 0-22)

| Category | Tool | Cost | Rationale |
|----------|------|------|-----------|
| **Error Tracking** | Sentry | $26/month (Team plan) | Industry standard, 50K events covers MVP, Next.js integration |
| **Product Analytics** | PostHog | $0/month (Free tier) | 1M events free, all features, privacy-first, feature flags included |
| **Performance Monitoring** | Vercel Speed Insights | $0/month (included in Pro) | Built-in Web Vitals, zero setup, sufficient for MVP |
| **Session Replay** | None (Deferred) | $0/month | Privacy concerns + not essential for MVP validation |
| **Deployment** | Vercel Pro | $20/month | Required for commercial use, includes analytics + speed insights |

**Total MVP Cost**: **$46/month** ($26 Sentry + $20 Vercel Pro, PostHog free)

**Setup Time**: ~6-8 hours total
- Sentry: 1-2 hours
- PostHog: 2-3 hours
- Vercel Analytics: 10 minutes
- Vercel Speed Insights: 5 minutes (automatic)

---

### Post-MVP (After 500+ Users, Validated PMF)

**Add when needed:**

| Tool | Trigger | Cost | Purpose |
|------|---------|------|---------|
| OpenReplay (cloud) | UI bugs you can't reproduce | ~$30/month (5K sessions) | Privacy-first session replay |
| Sentry Performance | Backend performance issues | +$0-10/month (bundled) | API/database query insights |
| PostHog (paid) | >1M events/month | ~$250/month (2M events) | Scale analytics |

**Growth Cost (500-5K users)**: ~$76/month
- Sentry: $26/month (errors)
- PostHog: $0/month (still under 1M events likely)
- Vercel Pro: $20/month
- OpenReplay: $30/month (session replay)

**Scale Cost (5K-50K users)**: ~$400-600/month
- Sentry: $50/month (errors + performance)
- PostHog: $250-400/month (2-3M events)
- Vercel Pro: $20/month (may need team plan)
- OpenReplay: $50-100/month (10-20K sessions)

---

## Privacy Considerations

### GDPR/CCPA Compliance for Travel Apps

**Sensitive Data in TripOS:**
- Personal identifiable information (PII): Names, emails, phone numbers
- Financial data: Budget caps, expense amounts, payment methods
- Location data: Trip destinations, activity locations
- Behavioral data: Voting patterns, group dynamics, task completion
- Communication: Activity notes, comments, invite messages

**Required Privacy Measures:**

1. **Analytics (PostHog)**
   - ✅ EU hosting option available (GDPR data residency)
   - ✅ Self-hosting option (complete data control)
   - ✅ IP anonymization built-in
   - ✅ No cookie consent required (first-party only)
   - ⚠️ Action: Configure person profiles to exclude PII (use user IDs only)

2. **Error Tracking (Sentry)**
   - ✅ PII scrubbing rules (auto-redact emails, credit cards)
   - ✅ Custom data masking (redact budget amounts in error context)
   - ⚠️ Action: Configure `beforeSend` hook to strip sensitive fields
   - ⚠️ Action: Enable "enhanced privacy" mode (no IP collection)

3. **Session Replay (Deferred)**
   - ❌ **HIGH RISK**: Can capture budget amounts, destinations, voting choices
   - ❌ Requires explicit user consent (not just privacy policy)
   - ❌ Must implement field-level masking (budget inputs, location fields)
   - ✅ When implemented: Use OpenReplay with self-hosting for complete control

**Privacy Policy Requirements:**
- Disclose Sentry and PostHog usage
- Explain what data is collected (events, errors, performance)
- Clarify data retention (Sentry: 90 days, PostHog: configurable)
- Provide opt-out mechanism (PostHog supports `posthog.opt_out_capturing()`)
- Include data processor agreements (Sentry DPA, PostHog DPA)

**Recommended Approach:**
- Use PostHog's privacy-friendly "anonymous" mode until user creates account
- After login, identify user by ID only (not email/name in analytics)
- Configure Sentry to exclude all financial data from error context
- Add explicit consent toggle for "help improve app" (analytics opt-in)
- Defer session replay until legal counsel reviews implementation

---

## Implementation Timeline

### Week 1 (Error Tracking)

**Days 1-2: Sentry Setup**
- [ ] Create Sentry account and project
- [ ] Install `@sentry/nextjs` package
- [ ] Configure `sentry.client.config.ts` and `sentry.server.config.ts`
- [ ] Set up source map uploads (Vercel integration)
- [ ] Configure PII scrubbing rules (beforeSend hook)
- [ ] Test error reporting (throw test error)
- [ ] Set up Slack integration for critical errors
- [ ] Configure release tracking

**Estimated Time**: 1-2 days (8-16 hours)

---

### Week 1-2 (Product Analytics)

**Days 3-4: PostHog Setup**
- [ ] Create PostHog Cloud account (EU region)
- [ ] Install `posthog-js` package
- [ ] Configure PostHog provider in app layout
- [ ] Define event taxonomy (see Event Schema below)
- [ ] Implement key events (signup, create_trip, invite_member, create_vote)
- [ ] Set up feature flags (for gradual rollout)
- [ ] Test event tracking (use PostHog debugger)
- [ ] Configure data retention and privacy settings

**Estimated Time**: 2-3 days (16-24 hours)

**Event Schema (MVP):**
```javascript
// Authentication
posthog.capture('user_signup', { method: 'email' | 'google' })
posthog.capture('user_login', { method: 'email' | 'google' })

// Trip Management
posthog.capture('trip_created', { member_count: number, has_dates: boolean })
posthog.capture('trip_member_invited', { method: 'email' | 'link' })
posthog.capture('trip_member_joined', { role: 'owner' | 'organizer' | 'member' })

// Itinerary
posthog.capture('activity_added', { type: 'lodging' | 'dining' | 'activity' | 'transport' })
posthog.capture('activity_voted', { vote_type: 'yes_no' | 'ranked' | 'approval' })

// Voting (Phase 3)
posthog.capture('poll_created', { type: 'yes_no' | 'ranked' | 'approval', has_deadline: boolean })
posthog.capture('vote_cast', { poll_type: string })
posthog.capture('poll_closed', { outcome: 'passed' | 'failed', participation_rate: number })

// Budget (Phase 4-5)
posthog.capture('expense_added', { category: string, amount_hidden: true })
posthog.capture('blind_budget_set', { amount_hidden: true })
```

---

### Week 2 (Performance & Analytics)

**Day 5: Vercel Analytics + Speed Insights**
- [ ] Install `@vercel/analytics` package
- [ ] Add `<Analytics />` component to root layout
- [ ] Verify analytics in Vercel dashboard
- [ ] Check Speed Insights data (wait 24 hours for first data)

**Estimated Time**: 0.5 days (4 hours)

---

### Total Implementation Time

**Week 1-2 Total**: 3-4 days (28-44 hours)
- Sentry: 1-2 days
- PostHog: 2-3 days
- Vercel: 0.5 days

**Recommendation**: Allocate 1 full week (40 hours) for monitoring setup before starting feature development. This ensures you have observability from day one, catching bugs in early development.

---

## Cost Projection

### MVP (0-500 Users, Months 1-3)

| Tool | Free Tier Limit | Expected Usage | Cost |
|------|----------------|----------------|------|
| Sentry | 5K events/month | 2-5K events/month | $0 → $26/month* |
| PostHog | 1M events/month | 50-200K events/month | $0/month |
| Vercel Pro | N/A | Required for commercial use | $20/month |
| **Total** | - | - | **$20-46/month** |

*Sentry: Start with free tier (5K events), upgrade to Team ($26/month) when you hit limit or need >1 user access.

**Expected Costs:**
- Month 1 (development): $20/month (Vercel only, Sentry free tier)
- Month 2 (beta launch): $46/month (add Sentry Team for team access)
- Month 3 (public launch): $46/month

---

### Growth (500-5K Users, Months 4-12)

| Tool | Usage | Cost |
|------|-------|------|
| Sentry (errors) | 10-50K events/month | $26/month (Team plan) |
| PostHog (analytics) | 200K-800K events/month | $0/month (still under 1M) |
| Vercel Pro | 1 user | $20/month |
| OpenReplay (optional) | 5-10K sessions/month | $30-60/month |
| **Total** | - | **$46-106/month** |

**Expected Costs:**
- Months 4-6 (growth): $46/month
- Months 7-9 (consider session replay): $76/month (add OpenReplay)
- Months 10-12 (approaching 1M events): $76/month

---

### Scale (5K-50K Users, Year 2)

| Tool | Usage | Cost |
|------|-------|------|
| Sentry (errors + performance) | 100-500K events/month | $50-150/month |
| PostHog (analytics) | 2-5M events/month | $250-1,000/month |
| Vercel Pro | 1-2 users | $20-40/month |
| OpenReplay | 10-50K sessions/month | $60-300/month |
| **Total** | - | **$380-1,490/month** |

**When to optimize:**
- If PostHog costs exceed $500/month before revenue → Reduce event noise (sample non-critical events)
- If Sentry costs exceed $100/month → Implement error sampling (not all errors need tracking)
- If OpenReplay costs exceed $200/month → Sample sessions (record 10% of users, target buggy flows)

**Cost as % of Revenue (assuming SaaS pricing):**
- At $10/user/month with 5K users = $50K MRR → Monitoring is 0.8% of revenue ($380/$50K)
- At $10/user/month with 50K users = $500K MRR → Monitoring is 0.3% of revenue ($1,490/$500K)
- **Industry benchmark**: 1-2% of revenue on monitoring/analytics is healthy

---

## Alternative Scenarios

### Scenario A: Extreme Budget Constraints (<$20/month)

**Recommendation:**
- Error Tracking: **Rollbar free tier** (25K events/month, no cost)
- Analytics: **PostHog free tier** (1M events/month, no cost)
- Performance: **Vercel Hobby tier** (requires non-commercial use until revenue)
- Session Replay: **None**

**Total Cost**: $0-20/month (depends on Vercel Hobby commercial use interpretation)

**Trade-offs:**
- Must switch from Rollbar to Sentry later (migration cost)
- Can't use Vercel Hobby for revenue-generating app (TOS violation risk)
- No team access to error tracking (Rollbar free = 1 user)

---

### Scenario B: Privacy Paranoia (Self-Hosted Everything)

**Recommendation:**
- Error Tracking: **Self-hosted Sentry** (open-source)
- Analytics: **Self-hosted PostHog** (open-source)
- Performance: **Self-hosted Grafana + Prometheus**
- Session Replay: **Self-hosted OpenReplay**

**Total Cost**: $100-300/month (infrastructure) + 2-5 days setup + ongoing maintenance

**Trade-offs:**
- High upfront setup time (not ideal for MVP velocity)
- Ongoing maintenance burden (updates, backups, scaling)
- No managed service support (you're on your own for issues)
- Requires DevOps expertise (Docker, Kubernetes, databases)

**When this makes sense:**
- Enterprise customers requiring on-premise deployment
- Regulatory requirements preventing cloud storage
- >100M events/month (cheaper to self-host at scale)

---

### Scenario C: All-In-One Simplicity (Minimal Tools)

**Recommendation:**
- **PostHog for everything** (errors + analytics + session replay + feature flags)
- **Vercel Speed Insights** (performance)

**Total Cost**: $0-20/month (PostHog free + Vercel Pro)

**Trade-offs:**
- PostHog error tracking not as mature as Sentry
- No source map support in PostHog (harder to debug minified errors)
- PostHog session replay limited (5K/month on free tier)
- Less specialized tools = fewer features

**When this makes sense:**
- Solo developer prioritizing simplicity over best-in-class tools
- MVP with <100 errors/month (PostHog error tracking sufficient)
- Want single dashboard for all observability

---

## Decision Checklist

Before finalizing your monitoring stack, verify:

- [ ] **Privacy policy drafted** (disclose Sentry, PostHog, data retention)
- [ ] **PII scrubbing configured** (Sentry beforeSend, PostHog anonymous mode)
- [ ] **Event schema designed** (avoid tracking sensitive fields)
- [ ] **Budget allocated** ($46/month for MVP, $100-500/month for growth)
- [ ] **Setup time scheduled** (1 week / 40 hours for all tools)
- [ ] **Team access planned** (who needs access to errors? analytics?)
- [ ] **Alert thresholds defined** (when to notify on Slack? email?)
- [ ] **Session replay deferred** (privacy concerns addressed post-MVP)
- [ ] **Cost triggers set** (upgrade Sentry when hitting 5K events, optimize PostHog at $500/month)

---

## Conclusion

**Final Recommendation: Adopt the MVP stack immediately**

| Tool | Purpose | Cost |
|------|---------|------|
| Sentry (Team) | Error tracking + performance | $26/month |
| PostHog (Free) | Product analytics + feature flags | $0/month |
| Vercel Pro | Deployment + web analytics + speed insights | $20/month |
| **Total** | Full observability | **$46/month** |

**Why this stack wins:**
1. **Proven reliability**: Sentry and PostHog are industry-standard tools used by thousands of companies
2. **Generous free tiers**: PostHog's 1M events/month covers entire MVP and early growth
3. **Privacy-first**: Both tools offer EU hosting, self-hosting, and PII controls
4. **Future-proof**: Clear upgrade path as you scale (usage-based pricing)
5. **Developer experience**: Excellent documentation, Next.js integrations, active communities
6. **Cost-efficient**: $46/month is <1% of expected MVP costs (infrastructure, domain, services)

**Next Steps:**
1. Set up Sentry this week (2 hours)
2. Set up PostHog next week (4 hours)
3. Defer session replay until post-MVP
4. Re-evaluate after 1K users or $1K MRR

**Questions to validate before proceeding:**
- Do you need session replay for MVP? (Answer: No, defer for privacy + cost)
- Can you use Vercel Hobby tier? (Answer: No, commercial app requires Pro)
- Should you self-host for privacy? (Answer: No, not worth setup time for MVP)

---

## Sources

### Error Tracking Research
- [Sentry.io Comprehensive Guide 2025](https://www.baytechconsulting.com/blog/sentry-io-comprehensive-guide-2025)
- [Sentry Pricing](https://sentry.io/pricing/)
- [Understanding Sentry Pricing - SigNoz](https://signoz.io/guides/sentry-pricing/)
- [Pricing & Billing - Sentry Docs](https://docs.sentry.io/pricing/)
- [Error Tracking: Sentry vs Rollbar vs Bugsnag Comparison](https://testquality.com/error-tracking-sentry-rollbar-bugsnag/)
- [Rollbar vs Sentry - TrackJS](https://trackjs.com/compare/rollbar-vs-sentry/)
- [8 Best Sentry Alternatives for Error Monitoring in 2026](https://middleware.io/blog/sentry-alternatives/)
- [highlight.io pricing](https://www.highlight.io/pricing)
- [Launch YC: highlight.io](https://www.ycombinator.com/launches/HwV-highlight-io-open-source-session-replay-error-monitoring)

### Session Replay Research
- [FullStory vs LogRocket Features & Pricing Comparison](https://www.zipy.ai/blog/fullstory-vs-logrocket)
- [Top 13 LogRocket Alternatives 2026](https://betterstack.com/community/comparisons/logrocket-alternatives/)
- [6 Session Replay Tools So Detailed Your Privacy Officer Will Cry - Rollbar](https://rollbar.com/blog/session-replay-tools/)
- [Sentry vs LogRocket](https://sentry.io/from/logrocket/)
- [The best session replay tools for developers, compared - PostHog](https://posthog.com/blog/best-session-replay-tools)
- [OpenReplay: The Open Source Alternative to LogRocket](https://blog.openreplay.com/logrocket-vs-openreplay/)
- [Top 6 Open-Source Alternatives to LogRocket](https://blog.openreplay.com/open-source-alternatives-to-logrocket/)
- [OpenReplay GitHub](https://github.com/openreplay/openreplay)

### Session Replay Privacy Research
- [Protecting User Privacy in Session Replay - Sentry](https://docs.sentry.io/security-legal-pii/scrubbing/protecting-user-privacy/)
- [Session Replay privacy - Pendo](https://support.pendo.io/hc/en-us/articles/18049064847515-Session-Replay-privacy)
- [Session Replay Software: Privacy Risks and User Consent](https://verasafe.com/blog/session-replay-software-and-privacy/)
- [Spyware or Useful Tool? The Ethical Dilemma of Session Replay Software](https://userpilot.com/blog/ethical-dilemma-of-session-replay/)
- [What Is Session Replay: Uses, Benefits & GDPR in 2025](https://www.fullview.io/blog/what-is-session-replay)
- [A Guide on Session Recording and Its Privacy Concerns](https://countly.com/blog/session-recording-privacy)
- [GDPR and Fullstory](https://www.fullstory.com/resources/gdpr-and-fullstory/)

### Product Analytics Research
- [The 9 best GDPR-compliant analytics tools - PostHog](https://posthog.com/blog/best-gdpr-compliant-analytics-tools)
- [The best Plausible alternatives & competitors - PostHog](https://posthog.com/blog/best-plausible-alternatives)
- [PostHog vs Plausible in-depth tool comparison](https://posthog.com/blog/posthog-vs-plausible)
- [PostHog vs Plausible: Quick Breakdown](https://vemetric.com/blog/posthog-vs-plausible)
- [Best Privacy-Compliant Analytics Tools for 2026](https://www.mitzu.io/post/best-privacy-compliant-analytics-tools-for-2026)
- [PostHog pricing](https://posthog.com/pricing)
- [PostHog Pricing 2026 - Userorbit](https://userorbit.com/blog/posthog-pricing-guide)
- [PostHog Pricing Guide - FlexPrice](https://flexprice.io/blog/posthog-pricing-guide)
- [PostHog vs Mixpanel in-depth tool comparison](https://posthog.com/blog/posthog-vs-mixpanel)
- [PostHog vs Mixpanel: Which Analytics Platform?](https://userpilot.com/blog/posthog-vs-mixpanel/)
- [The most popular Mixpanel alternatives - PostHog](https://posthog.com/blog/best-mixpanel-alternatives)

### Performance Monitoring Research
- [Vercel Speed Insights Overview](https://vercel.com/docs/speed-insights)
- [@vercel/speed-insights npm](https://www.npmjs.com/package/@vercel/speed-insights)
- [Vercel Observability](https://vercel.com/products/observability)
- [Speed Insights Metrics](https://vercel.com/docs/speed-insights/metrics)
- [Limits and Pricing for Speed Insights](https://vercel.com/docs/speed-insights/limits-and-pricing)
- [Pricing for Web Analytics](https://vercel.com/docs/analytics/limits-and-pricing)
- [Vercel Pricing](https://vercel.com/pricing)
- [Vercel Pro Plan](https://vercel.com/docs/plans/pro-plan)
- [New Relic Pricing](https://newrelic.com/pricing)
- [New Relic Pricing: Monitoring Your Costs In 2026](https://www.cloudzero.com/blog/new-relic-pricing/)
- [New Relic Pricing: Still Worth it in 2025?](https://middleware.io/blog/new-relic-pricing/)
- [Unpacking New Relic's Pricing - SigNoz](https://signoz.io/guides/new-relic-pricing/)
- [Free-Tier Pricing - New Relic](https://newrelic.com/pricing/free-tier)
- [Sentry Application Performance Monitoring](https://sentry.io/for/performance/)
- [Datadog vs. Sentry comparison](https://betterstack.com/community/comparisons/datadog-vs-sentry/)
- [Sentry Performance Monitoring Docs](https://docs.sentry.io/product/performance/)
- [The New APM: Actionable, Affordable, and Actually Built For Developers](https://blog.sentry.io/the-new-apm-actionable-affordable-and-actually-built-for-developers/)
