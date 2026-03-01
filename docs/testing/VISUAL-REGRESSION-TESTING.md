# Visual Regression Testing with Percy

TripFlow uses **Percy** (by BrowserStack) to catch visual regressions before they reach production. Percy automatically detects layout shifts, color changes, dark mode breaks, and responsive issues.

---

## 🎯 What Percy Tests

Percy captures screenshots at multiple viewport widths and compares them against baselines:

- **Color system integrity** - City colors, semantic tokens, dark mode palettes
- **Layout stability** - No unexpected shifts, grid breaks, or overflow
- **Responsive design** - Mobile (375px), tablet (768px), desktop (1280px, 1920px)
- **Component states** - Hover, focus, active, disabled, error states
- **Dark mode parity** - Light/dark mode feature parity

---

## 🚀 Quick Start

### 1. Get a Percy Token

1. Sign up at [percy.io](https://percy.io) (free tier: 5,000 snapshots/month)
2. Create a new project: `tripflow-next`
3. Copy your `PERCY_TOKEN` from project settings

### 2. Set Environment Variable

```bash
# macOS/Linux
export PERCY_TOKEN=your_token_here

# Windows PowerShell
$env:PERCY_TOKEN="your_token_here"

# Add to .env.local (gitignored)
echo "PERCY_TOKEN=your_token_here" >> .env.local
```

### 3. Run Visual Tests

```bash
# Full Percy run (uploads snapshots to Percy cloud)
npm run percy

# Local run (no upload, useful for debugging)
npm run percy:local

# Update baselines (creates new reference screenshots)
npm run percy:update
```

---

## 📸 What Gets Tested

Percy runs **18 visual tests** across 5 pages × 2 themes:

| Page | Light Mode | Dark Mode | Viewports |
|------|-----------|-----------|-----------|
| Homepage | ✅ | ✅ | 375, 768, 1280, 1920 |
| Itinerary | ✅ | ✅ | 375, 768, 1280 |
| Map | ✅ | ✅ | 768, 1280 |
| Budget | ✅ | ✅ | 375, 768, 1280 |
| Voting | ✅ | ✅ | 375, 768, 1280 |

**Component-level tests:**
- Activity card states (default, hover)
- City color accents (Shanghai pink, Osaka teal, etc.)
- Blind budget form (empty, filled)
- Mobile navigation (closed, open)

---

## 🔧 Configuration

Percy config lives in [.percy.yml](/.percy.yml):

```yaml
snapshot:
  widths: [375, 768, 1280, 1920]  # Responsive breakpoints
  percy-css: |
    * {
      animation-duration: 0s !important;  # Disable animations for stable snapshots
    }
```

**Key settings:**
- ✅ Animations disabled (prevents mid-animation captures)
- ✅ Network idle wait (ensures dynamic content loads)
- ✅ Accessibility testing enabled
- ✅ Build artifacts ignored

---

## 🛠️ CI/CD Integration

Percy automatically runs on **every pull request** via GitHub Actions:

1. **PR opened** → GitHub Actions triggers Percy workflow
2. **Percy captures snapshots** → Compares against `main` branch baseline
3. **Visual diff detected?** → Percy comments on PR with diff screenshots
4. **No changes?** → PR check passes ✅

### Setting Up CI

1. Add `PERCY_TOKEN` to GitHub Secrets:
   - GitHub repo → Settings → Secrets and variables → Actions
   - New repository secret: `PERCY_TOKEN` = `your_token_here`

2. Percy workflow auto-runs on:
   - Pull requests to `main` or `dev`
   - Pushes to `main` (updates baselines)

### Viewing Results

Percy posts a comment on your PR with:
- ✅ **No changes** - All snapshots match baseline
- ⚠️ **Visual changes detected** - Click to review diff
- ❌ **New snapshots** - Approve to set as baseline

Click "View build" to see side-by-side comparisons:
- Before (baseline) vs After (PR changes)
- Diff overlay highlighting changed pixels
- Approval workflow (accept or reject changes)

---

## 📝 Writing Visual Tests

Add new visual tests to [e2e/visual-regression.spec.ts](/e2e/visual-regression.spec.ts):

```typescript
import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test('New Page - Light Mode', async ({ page }) => {
  await page.goto('/new-page');
  await page.waitForSelector('main'); // Wait for page to load

  await percySnapshot(page, 'New Page - Light Mode', {
    widths: [375, 768, 1280],  // Responsive breakpoints
  });
});
```

**Best practices:**
- ✅ Wait for content to load (`waitForSelector`)
- ✅ Add explicit waits for animations (`waitForTimeout`)
- ✅ Use descriptive snapshot names (`Homepage - Dark Mode`)
- ✅ Test both light and dark modes
- ✅ Test critical component states (hover, error, empty)

---

## 🐛 Debugging

### Percy shows false positives (flaky diffs)

**Cause:** Animations, async content, or timestamps.

**Fix:**
```typescript
// Wait for animations to settle
await page.waitForTimeout(500);

// Hide dynamic content before snapshot
await page.addStyleTag({
  content: `
    .timestamp { visibility: hidden !important; }
    * { animation: none !important; }
  `
});

await percySnapshot(page, 'Stable Snapshot');
```

### Percy says "No changes" but I see visual differences locally

**Cause:** Percy compares against `main` branch baseline, not your local state.

**Fix:**
```bash
# Update baseline on main branch
git checkout main
npm run percy:update
git add .
git commit -m "chore: update Percy baselines"
git push

# Now your PR will compare against new baseline
```

### Percy fails in CI but passes locally

**Cause:** Different font rendering, screen resolution, or missing dependencies.

**Fix:**
- Check GitHub Actions logs for missing fonts/deps
- Ensure `.percy.yml` widths match your local config
- Add `headless: true` to Playwright config for CI consistency

---

## 📊 Percy Dashboard

View all snapshots at: **https://percy.io/your-org/tripflow-next**

**Features:**
- 📸 **Build history** - Every PR's visual changes
- 🔍 **Diff viewer** - Side-by-side comparisons
- ✅ **Approval workflow** - Accept or reject changes
- 📈 **Analytics** - Snapshot usage, build trends
- 🔔 **Notifications** - Slack/email alerts on visual changes

---

## 💰 Pricing

**Free tier (BrowserStack):**
- 5,000 snapshots/month
- Unlimited projects
- 1 concurrent build
- 30-day snapshot history

**Paid tier ($99/month):**
- 25,000 snapshots/month
- Unlimited concurrent builds
- 1-year snapshot history
- Priority support

**TripFlow usage estimate:**
- 18 tests × 4 viewports × 2 PR reviews/day = ~144 snapshots/day
- ~4,320 snapshots/month (well within free tier)

---

## 🔗 Resources

- **Percy Docs:** https://docs.percy.io/docs
- **Playwright Integration:** https://docs.percy.io/docs/playwright
- **Best Practices:** https://docs.percy.io/docs/best-practices
- **CI Setup:** https://docs.percy.io/docs/github-actions
- **Troubleshooting:** https://docs.percy.io/docs/debugging-sdks

---

## ✅ Checklist for New Features

When adding a new page or component:

- [ ] Add visual test to `e2e/visual-regression.spec.ts`
- [ ] Test both light and dark modes
- [ ] Test responsive breakpoints (mobile, tablet, desktop)
- [ ] Capture critical states (hover, error, empty, loading)
- [ ] Run `npm run percy:local` to verify locally
- [ ] Approve Percy build on PR (if intentional visual change)
- [ ] Merge PR after Percy check passes ✅

---

## 🎨 Color System Testing

Percy specifically guards TripFlow's color system:

**What Percy catches:**
- ✅ Hardcoded hex colors leaking through (ESLint didn't catch)
- ✅ Dark mode color inversions not applying
- ✅ City colors using wrong hue (Osaka teal ≠ Privacy teal)
- ✅ OKLCH rendering incorrectly in older browsers
- ✅ CSS variable fallback failures

**Example caught regression:**
```diff
- background: var(--city-osaka);  /* 200° hue */
+ background: var(--color-privacy); /* 185° hue */
```

Percy diff shows **subtle teal shift** that human reviewers might miss.

---

## 🚦 When to Approve Visual Changes

**✅ APPROVE if:**
- Intentional design update (new feature, UI polish)
- Dark mode color adjustments
- Responsive layout improvements
- Typography/spacing refinements

**❌ REJECT if:**
- Unintended color shift (wrong token used)
- Layout break (overflow, misalignment)
- Dark mode regression (color inversion missing)
- Missing city color accent (border disappeared)

**When in doubt:** Review the diff with the designer or check [TRIPFLOW-STYLE-GUIDE.md](../TRIPFLOW-STYLE-GUIDE.md).

---

**Questions?** Check [Percy Docs](https://docs.percy.io) or ask in #engineering Slack.
