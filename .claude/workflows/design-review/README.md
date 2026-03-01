# Design Review Workflow

This workflow provides automated design reviews using Playwright MCP to test live applications in a real browser.

## Architecture

```
.claude/
├── skills/
│   └── design-review/           # Skill wrapper (user-facing command)
│       └── SKILL.md
├── agents/
│   └── design-review.md         # Agent implementation (MCP testing logic)
└── workflows/
    └── design-review/
        ├── design-principles.md # TripFlow design system standards
        └── README.md            # This file
```

## How It Works

### 1. User invokes `/design-review` or `/review-story` calls the agent

### 2. Skill checks prerequisites:
- Dev server running on port 3100
- Playwright MCP tools available
- Git changes exist in `tripflow-next/src/`

### 3. Agent dispatches via Task tool:
```typescript
Task({
  subagent_type: "design-review",
  prompt: "Review E01-S03 changes affecting /trips/:tripId/itinerary...",
  description: "Design review E01-S03"
})
```

### 4. Agent executes seven-phase review:
- **Phase 0**: Context gathering (git diff, design standards)
- **Phase 1**: Interactive browser testing (click, hover, type)
- **Phase 2**: Responsive testing (1440px, 768px, 375px)
- **Phase 3**: Visual polish (computed styles, code patterns)
- **Phase 4**: Accessibility audit (keyboard, ARIA, contrast)
- **Phase 5**: Robustness testing (forms, console, loading)
- **Phase 6**: Code health analysis (TypeScript, imports, Tailwind)
- **Phase 7**: Report generation (severity-triaged findings)

### 5. Report saved to:
`docs/reviews/design/design-review-{YYYY-MM-DD}-{story-id}.md`

## Design Principles

The agent enforces TripFlow design standards from `design-principles.md`:

**Core Standards:**
- **Colors**: CSS variables only (no hardcoded hex)
- **Spacing**: Design token scale (xs: 4px → 3xl: 64px)
- **Typography**: System fonts, proper hierarchy (H1→H2→H3)
- **Accessibility**: WCAG 2.1 AA minimum (4.5:1 text contrast)
- **Responsive**: Mobile-first, 44px touch targets
- **Components**: shadcn/ui patterns, semantic HTML

## Severity Triage

**Blockers** (Must fix before merge):
- WCAG AA violations
- Broken keyboard navigation
- Non-functional UI elements
- Wrong accent color (#0D9488 teal required)

**High Priority** (Should fix):
- Missing hover/focus states
- Inconsistent spacing
- Hardcoded colors
- Console errors

**Medium Priority** (Fix when possible):
- Minor visual inconsistencies
- Import conventions
- Suboptimal organization

**Nitpicks** (Optional):
- Spacing tweaks
- Alternative approaches

## Integration with Story Workflow

The design review agent is automatically called by `/review-story`:

```
/start-story E01-S03
→ implement changes
→ /review-story E01-S03
  ├── Pre-checks (build, lint, tests)
  ├── Design review ← Uses this agent
  ├── Code review (architecture)
  └── Code review (testing)
→ /finish-story E01-S03
```

## Manual Usage

```bash
# Start dev server (required)
cd tripflow-next && npm run dev

# In a separate terminal, invoke the skill
/design-review
```

## Troubleshooting

**Dev server not reachable:**
- Ensure `npm run dev` is running in `tripflow-next/`
- Check port 3100 is not in use: `lsof -ti:3100`

**Playwright MCP tools unavailable:**
- Verify MCP server is configured in Claude Code settings
- Check `mcp__playwright__browser_navigate` tool is accessible

**No UI changes detected:**
- Skill skips review if no changes in `tripflow-next/src/`
- Adds `design-review-skipped` gate to review status

## Related Files

- **Story workflow skills**: `.claude/skills/{start,review,finish}-story/`
- **Review reports**: `docs/reviews/design/`
- **TripFlow style guide**: `tripflow-next/docs/TRIPFLOW-STYLE-GUIDE.md`

---

**Last Updated**: March 1, 2026
