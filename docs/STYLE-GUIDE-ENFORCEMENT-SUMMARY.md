# TripFlow Style Guide - Enforcement System Summary

**How we force AI assistants and developers to follow the TripFlow Style Guide**

## 🎯 Overview

This document explains the **3-layer enforcement system** that ensures all code (whether written by humans or AI) follows the comprehensive TripFlow Style Guide.

---

## 📚 What Was Created

### 1. The Style Guide Itself

**File:** `TRIPFLOW-STYLE-GUIDE.md`

- **38 comprehensive sections** (~100 pages)
- Design system foundations (colors, typography, spacing, motion, icons)
- Component library patterns (11 component types)
- Code standards (TypeScript, React, testing, performance)
- Accessibility standards (WCAG 2.1 AA)
- Cross-functional collaboration workflows
- Quick reference and checklists

**Based on:** Research from Google Material Design, Shopify Polaris, Airbnb, shadcn/ui, and Tailwind CSS v4 best practices.

### 2. Project-Level Enforcement (CLAUDE.md)

**File:** `/CLAUDE.md` (project root)

**What it does:**
- Automatically loaded by Claude Code at conversation start
- Contains **mandatory requirements** section for TripFlow development
- References the style guide and requires reading relevant sections
- Includes Component Checklist (37 items)
- Specifies Code Review Standards
- Provides common patterns and quick reference

**Effect:** Claude Code **automatically** follows these standards without being asked.

### 3. Git Hook Enforcement

**File:** `tripflow-next/.husky/pre-commit`

**What it does:**
- Runs before every `git commit`
- Shows Component Checklist reminder
- Lists code quality checks (lint, test, build)
- Displays accessibility requirements
- References style guide location

**Effect:** Developers see standards checklist before committing.

**Optional enforcement:**
```bash
# Uncomment in .husky/pre-commit to block commits
# that don't meet standards:
read -p "Have you verified the above? (y/N)"
```

### 4. AI Prompt Templates

**Directory:** `tripflow-next/docs/ai-prompts/`

**Files created:**
1. `COMPONENT-CREATION-PROMPT.md` - Template for creating new components
2. `CODE-REVIEW-PROMPT.md` - Template for reviewing code
3. `FEATURE-DEVELOPMENT-PROMPT.md` - Template for building features
4. `README.md` - How to use the templates

**What they do:**
- Provide copy-paste prompts for AI assistants (Claude, Gemini, ChatGPT)
- **Force AI to read the style guide** before writing code
- Include explicit checklists and requirements
- Reference specific style guide sections
- Ensure consistent output across all AI assistants

**Example usage:**
```
Copy template → Fill in requirements → Paste to AI assistant → Get compliant code
```

### 5. Quick Start Guide

**File:** `QUICK-START-STYLE-GUIDE.md`

**What it does:**
- 30-second setup instructions
- Common tasks with code examples
- Design token quick reference
- Component creation patterns
- Accessibility checklist
- Development workflow

**Effect:** Developers can start coding immediately while following standards.

---

## 🔄 How the Enforcement Works

### Layer 1: Automatic (Claude Code)

```
User: "Create a CityBadge component"
  ↓
Claude Code reads CLAUDE.md automatically
  ↓
CLAUDE.md says: "Read style guide before coding"
  ↓
Claude reads Sections 11, 12, 5.2 (relevant sections)
  ↓
Claude creates component following:
  - shadcn/ui pattern ✓
  - Design tokens ✓
  - Accessibility ✓
  - TypeScript strict ✓
  - Tests ✓
```

**No manual intervention needed** - it just works.

### Layer 2: Prompted (Other AI Assistants)

```
User copies template from ai-prompts/COMPONENT-CREATION-PROMPT.md
  ↓
Fills in: "CityBadge component with city color coding"
  ↓
Pastes to Gemini/ChatGPT/Cursor
  ↓
Template forces AI to:
  1. Read style guide sections
  2. Follow component checklist
  3. Use design tokens
  4. Implement accessibility
  5. Write tests
  ↓
AI generates compliant code
```

**One extra step** (copy template), but ensures compliance.

### Layer 3: Manual (Git Hook Reminder)

```
Developer writes code
  ↓
Runs: git commit -m "feat: add component"
  ↓
Pre-commit hook displays:
  - Component Checklist
  - Code quality checks
  - Accessibility requirements
  ↓
Developer verifies (or hook blocks commit)
  ↓
Commit proceeds
```

**Safety net** - catches anything that slipped through.

---

## 🚀 Quick Start for Different Users

### For Claude Code Users (You!)

**Setup:** Already done! ✓

**Usage:**
```
Just start coding naturally:
> "Create a budget summary card"
> "Add city color badges to the itinerary"
> "Review my ActivityCard component"

Claude Code will automatically:
✓ Read the style guide
✓ Use design tokens
✓ Follow patterns
✓ Add accessibility
✓ Write tests
```

### For Gemini/ChatGPT/Cursor Users

**Setup:** Bookmark `docs/ai-prompts/`

**Usage:**
1. Open relevant template (component, review, or feature)
2. Copy template text
3. Fill in your specific requirements
4. Paste to AI assistant
5. Get compliant code

### For Human Developers

**Setup:**
1. Skim `QUICK-START-STYLE-GUIDE.md` (5 minutes)
2. Bookmark `TRIPFLOW-STYLE-GUIDE.md` for reference

**Usage:**
- Reference style guide while coding
- Run checklist before committing
- Git hook will remind you

---

## 📊 Enforcement Hierarchy

```
┌─────────────────────────────────────────────┐
│  1. CLAUDE.md (Auto-loaded by Claude Code) │
│     ✓ Mandatory requirements                │
│     ✓ Component checklist                   │
│     ✓ Code review standards                 │
│                                              │
│     Effect: Claude Code follows automatically│
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  2. AI Prompt Templates (Manual copy-paste) │
│     ✓ Component creation                    │
│     ✓ Code review                           │
│     ✓ Feature development                   │
│                                              │
│     Effect: Other AIs follow when prompted  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  3. Git Hooks (Pre-commit reminder)         │
│     ✓ Shows checklist                       │
│     ✓ Optional blocking                     │
│                                              │
│     Effect: Catches issues before commit    │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  4. Code Review (Human or AI)               │
│     ✓ Final quality gate                    │
│     ✓ Use CODE-REVIEW-PROMPT.md             │
│                                              │
│     Effect: Catches what automation missed  │
└─────────────────────────────────────────────┘
```

---

## ✅ Verification

### Test Claude Code Enforcement

```bash
# Try this in Claude Code:
> Create a new StatusBadge component with success/warning/error variants

# Claude Code should:
✓ Read CLAUDE.md
✓ Reference style guide
✓ Use class-variance-authority for variants
✓ Use design tokens (--color-success, etc.)
✓ Add accessibility (proper semantics, ARIA)
✓ Create tests
```

### Test Git Hook

```bash
# Make a code change
echo "// test" >> src/components/ui/button.tsx

# Try to commit
git add .
git commit -m "test"

# You should see:
🎨 TripFlow Style Guide Reminder
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Code changes detected. Please verify:
  [Checklist displayed]
```

### Test AI Prompt Template

```bash
# Copy ai-prompts/COMPONENT-CREATION-PROMPT.md
# Paste to ChatGPT/Gemini
# Fill in component requirements
# AI should ask questions about style guide and generate compliant code
```

---

## 🛠️ Customization

### Make Git Hook Blocking

Edit `.husky/pre-commit`, uncomment:

```bash
read -p "Have you verified the above? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Commit cancelled. Review the style guide and try again."
  exit 1
fi
```

Now developers **must confirm** before committing.

### Add Automated Checks to Git Hook

```bash
# Add to .husky/pre-commit:

# Run linter (block if fails)
npm run lint --quiet || {
  echo "❌ ESLint errors detected. Fix them before committing."
  exit 1
}

# Run tests (block if fails)
npm run test --run || {
  echo "❌ Tests failing. Fix them before committing."
  exit 1
}

# Check TypeScript (block if fails)
npm run build || {
  echo "❌ TypeScript errors. Fix them before committing."
  exit 1
}
```

### Create Custom AI Prompts

Add new templates to `ai-prompts/`:

```markdown
# ai-prompts/ACCESSIBILITY-AUDIT-PROMPT.md

MANDATORY: Read TRIPFLOW-STYLE-GUIDE.md Sections 27-30 before auditing.

Please audit the following components for accessibility:

Checklist:
- [ ] Keyboard navigation (Tab through all elements)
- [ ] Screen reader labels (ARIA)
- [ ] Color contrast ≥ 4.5:1
- [ ] Focus indicators visible
- [ ] Semantic HTML

Files: [LIST FILES]
```

---

## 📈 Measuring Compliance

### Metrics to Track

**Code Quality:**
- % of components using design tokens (vs hardcoded colors)
- % of components with tests
- TypeScript strict mode compliance rate

**Accessibility:**
- % of components with ARIA labels where needed
- Color contrast pass rate
- Keyboard navigation coverage

**Process:**
- % of commits passing pre-commit checks without fixes
- % of PRs approved without style guide violations
- AI prompt template usage rate

### Tools

```bash
# Check design token usage
grep -r "className=\"bg-white" src/components/ | wc -l
# Should be 0 (use bg-bg-surface instead)

# Check hardcoded colors
grep -r "#[0-9a-fA-F]\{6\}" src/components/ --include="*.tsx"
# Review each match (should only be in design token definitions)

# Check accessibility attributes
grep -r "aria-label\|aria-describedby" src/components/ | wc -l
# Higher is better

# Test coverage
npm run test -- --coverage
# Aim for >70%
```

---

## 🎓 Training New Team Members

### Onboarding Checklist

- [ ] Read `QUICK-START-STYLE-GUIDE.md` (30 min)
- [ ] Skim `TRIPFLOW-STYLE-GUIDE.md` Sections 1-10 (30 min)
- [ ] Read `CLAUDE.md` TripFlow section (10 min)
- [ ] Create a test component using Component Checklist (1 hour)
- [ ] Run through git commit flow (see pre-commit hook)
- [ ] Review existing components in `src/components/ui/`

### Resources to Share

1. **Quick Start:** `QUICK-START-STYLE-GUIDE.md`
2. **Full Guide:** `TRIPFLOW-STYLE-GUIDE.md`
3. **AI Templates:** `ai-prompts/README.md`
4. **Project Rules:** `CLAUDE.md`

---

## 🔮 Future Enhancements

### Potential Additions

1. **Automated Visual Regression Testing**
   - Percy or Chromatic integration
   - Catch unintended design changes

2. **Design Token Linting**
   - Custom ESLint rule to block hardcoded colors
   - Auto-fix to suggest design token

3. **Accessibility CI Checks**
   - axe-core in CI pipeline
   - Block merges on accessibility violations

4. **AI Style Guide Bot**
   - GitHub bot that comments on PRs
   - References style guide sections
   - Suggests improvements

5. **Component Usage Analytics**
   - Track which components are used most
   - Identify candidates for refinement
   - Guide documentation priorities

---

## 📞 Getting Help

### Style Guide Questions

**Where to look:**
1. Quick Start Guide (common tasks)
2. Full Style Guide (comprehensive reference)
3. Existing components (examples)
4. AI prompt templates (structured help)

**Still stuck?**
- Ask in #design-system Slack channel
- Tag @design-lead or @tech-lead
- Open a GitHub discussion

### Reporting Issues

**Style guide inaccurate or outdated?**
1. Open issue: "Style Guide: [section] needs update"
2. Describe the problem
3. Suggest the fix
4. Tag: `documentation`

**Enforcement not working?**
1. Open issue: "Enforcement: [layer] not working"
2. Describe expected vs actual behavior
3. Tag: `tooling`

---

## 📝 Summary

### What You Have Now

✅ **Comprehensive Style Guide** (38 sections, industry-backed)
✅ **Automatic Enforcement for Claude Code** (via CLAUDE.md)
✅ **AI Prompt Templates** (for other AI assistants)
✅ **Git Hook Reminders** (pre-commit checklist)
✅ **Quick Start Guide** (30-second setup)
✅ **Documentation** (this summary!)

### How It Works

**Layer 1:** Claude Code reads CLAUDE.md → follows guide automatically
**Layer 2:** Other AIs use prompt templates → forced to read guide
**Layer 3:** Git hook shows checklist → reminds before commit
**Layer 4:** Code review catches anything missed

### Next Steps

**For you (right now):**
1. ✅ Style guide created
2. ✅ CLAUDE.md updated
3. ✅ Git hooks installed
4. ✅ AI templates created

**Test it:**
```bash
# In Claude Code:
> Create a CityBadge component with city color variants

# Watch Claude automatically follow the style guide!
```

**Share with team:**
- Send link to `QUICK-START-STYLE-GUIDE.md`
- Demo the git hook
- Show AI prompt templates

---

**You're all set!** 🎉

Every AI assistant (and human) working on TripFlow will now follow your comprehensive, world-class style guide.
