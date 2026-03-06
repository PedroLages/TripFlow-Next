# Critique Workflow Integration Analysis

**Created:** 2026-02-11
**Status:** Planning - Pre-Installation Review
**Purpose:** Analyze integration between annotate-critiques skill, Impeccable commands, critical-review, and Agentation

---

## Executive Summary

Before installing Impeccable.style, we need to understand how our custom **annotate-critiques skill** will integrate with:
1. **Impeccable's `/audit` and `/critique` commands** (design critique automation)
2. **Existing `/critical-review` command** (general deliverable review)
3. **Agentation skill** (visual annotation toolbar)

**Key Finding:** Our annotate-critiques skill currently assumes Impeccable generates JSON critiques, but we need to verify actual output format and refactor accordingly.

---

## Current Tooling Landscape

### 1. Our Custom Skill: `/annotate-critiques`

**Location:** `.claude/skills/annotate-critiques/SKILL.md`

**Purpose:** Phase 4 visual audit pipeline automation

**Current Workflow:**
```
Step 1: Launch Playwright Audit
  └─ Capture screenshots (mobile 390×844, desktop 1440×900)
  └─ Extract DOM structure ([data-testid], button, input, h1, h2)
  └─ Save to audit-output/run-[timestamp]/

Step 2: Generate Critiques (MANUAL FOR MVP)
  └─ Option A: /impeccable audit audit-output/M15-Mobile.png
  └─ Option B: Manual JSON creation (fallback)
  └─ Expected JSON format:
      {
        "screen": "M15-Blind-Budget",
        "critiques": [
          {
            "type": "token_violation",
            "severity": "P1",
            "description": "Budget input uses #16A34A instead of hsl(162 72% 37%)",
            "element": "budget cap input"
          }
        ]
      }

Step 3: Map Critiques to DOM Selectors
  └─ Heuristic 1: Match by data-testid (confidence 1.0)
  └─ Heuristic 2: Match by text content (confidence 0.7-0.9)
  └─ Heuristic 3: Match by element type (confidence 0.8)

Step 4: Annotate with Agentation (MANUAL)
  └─ Open localhost:3000/trips/[id]/budget/blind
  └─ Click selectors, paste critique text
  └─ Export annotated feedback

Step 5: Generate Formatted Report
  └─ Markdown with P0/P1/P2 issues
  └─ File paths and line numbers
  └─ Suggested fixes
```

**Assumed Impeccable Integration:**
- Line 66: `/impeccable audit audit-output/run-[timestamp]/M15-Mobile.png`
- Line 68-85: Assumes JSON output with critique structure
- **⚠️ ASSUMPTION NOT VERIFIED** - We don't know actual Impeccable output format

**Dependencies:**
- Playwright (screenshot capture)
- Impeccable.style (critique generation) ← NOT INSTALLED YET
- Agentation (manual annotation) ← NOT INSTALLED YET

---

### 2. Impeccable.style Commands (To Be Installed)

**Source:** [Impeccable.style](https://impeccable.style) + [Command Cheatsheet](https://impeccable.style/cheatsheet)

**Installation Location:** `.claude/` (hidden folder at project root)

**17 Commands in 6 Categories:**

#### Diagnostic Commands
- **`/audit`** - Technical quality audit
  - Leads to: normalize, harden, optimize, adapt, clarify
  - **Use case:** System-level design issues (tokens, a11y, responsive)

- **`/critique`** - UX and design review
  - Leads to: polish, simplify, bolder, quieter
  - **Use case:** Per-screen aesthetic and UX issues

#### Other Command Categories
- **Quality:** /normalize, /polish, /optimize, /harden
- **Intensity:** /quieter, /bolder (pair together)
- **Adaptation:** /clarify, /simplify, /adapt
- **Enhancement:** /animate, /colorize, /delight
- **System:** /teach-impeccable, /extract, /onboard

**Key Questions (Unanswered Until Installation):**
1. ❓ What is the output format of `/audit screenshot.png`? (JSON? Markdown? Inline text?)
2. ❓ Does `/critique` differ from `/audit` in output structure?
3. ❓ Can commands output structured data for programmatic use?
4. ❓ Do commands take file paths or screenshots as input?
5. ❓ Is there a batch mode for auditing multiple screens?

---

### 3. Existing `/critical-review` Command

**Location:** `.claude/skills/critical-review/SKILL.md` (per MEMORY.md)

**Purpose:** Senior reviewer skill for docs + code

**When to Use:**
- Production-grade deliverables
- Architecture reviews
- Code reviews
- Documents with >1yr lifetime

**Output Structure:**
1. Verdict (APPROVED / REJECTED / NEEDS WORK)
2. Strengths
3. Weaknesses
4. Gaps
5. Risks
6. Required Changes
7. Approval Gate

**How It Differs from Impeccable:**
- **critical-review:** General-purpose code/doc review (broad scope)
- **Impeccable /audit:** Design-specific technical audit (narrow scope: tokens, a11y, responsive)
- **Impeccable /critique:** UX-specific aesthetic review (narrow scope: polish, simplify, bolder)

**Integration Opportunity:**
- Use `/critical-review` for Phase 5 Quorum Validation (code quality)
- Use Impeccable `/audit` for Phase 4 Visual Audit (design quality)
- Complementary, not overlapping

---

### 4. Agentation Skill

**Location:** `.agents/skills/agentation/SKILL.md`

**Purpose:** Visual feedback toolbar for manual UI annotation

**Setup:**
1. Install: `npm install agentation`
2. Add component to `app/layout.tsx`:
   ```tsx
   {process.env.NODE_ENV === "development" && <Agentation />}
   ```
3. Configure MCP server: `claude mcp add agentation -- npx agentation-mcp server`

**Workflow:**
1. Developer opens localhost:3000 in browser
2. Agentation toolbar appears (development only)
3. Click elements to annotate with feedback notes
4. Annotations sync to Claude via MCP server
5. Export annotated feedback

**How It Fits:**
- **Step 4 of annotate-critiques** uses Agentation for manual annotation
- After critique → selector mapping, user clicks selectors in browser
- Pastes critique text as feedback notes
- **This is manual for MVP** (future: automate via Agentation API)

---

## Integration Points & Conflicts

### ✅ Complementary (No Conflicts)

1. **critical-review + Impeccable**
   - critical-review: Code quality (Phase 5 Quorum)
   - Impeccable: Design quality (Phase 4 Visual Audit)
   - Use both in separate phases

2. **Agentation + annotate-critiques**
   - Agentation: Manual annotation UI
   - annotate-critiques: Automation framework around manual step
   - Agentation is Step 4 of annotate-critiques workflow

### ⚠️ Needs Refactoring (Assumptions)

1. **annotate-critiques assumes Impeccable outputs JSON**
   - **Current assumption:** `/impeccable audit screenshot.png` returns JSON
   - **Reality check needed:** Impeccable commands may output markdown or inline text
   - **Refactor required:** Adapt Step 2 based on actual Impeccable output

2. **Manual critique generation fallback**
   - **Current state:** Option B provides manual JSON creation template
   - **Post-Impeccable:** May need to adjust JSON schema to match Impeccable's format
   - **Risk:** If Impeccable doesn't output structured data, we need a parser

### 🔄 Potential Workflow Changes

**Current MVP Workflow (Manual):**
```
Playwright → Screenshots → MANUAL Impeccable → MANUAL JSON → Map → MANUAL Agentation → Report
```

**Post-Impeccable Workflow (Semi-Automated):**
```
Playwright → Screenshots → /audit command → Parse Output → Map → MANUAL Agentation → Report
```

**Future Automated Workflow:**
```
Playwright → Screenshots → /audit command → Parse Output → Map → Agentation API → Report
```

---

## Recommended Actions

### Phase 1: Pre-Installation (This Document)
- ✅ Document current annotate-critiques workflow
- ✅ Research Impeccable commands
- ✅ Identify integration points
- ✅ Flag assumptions for verification

### Phase 2: Install & Test Impeccable
1. **Install Impeccable:**
   ```bash
   # Download from https://impeccable.style/#downloads
   # Extract to project root (creates .claude/ folder)
   ```

2. **Test /audit command:**
   ```bash
   # In Claude Code chat:
   /audit audit-output/run-[timestamp]/M15-Mobile.png

   # Observe output format:
   # - Is it JSON?
   # - Is it markdown?
   # - Is it inline conversational text?
   # - Does it match our assumed schema?
   ```

3. **Test /critique command:**
   ```bash
   /critique audit-output/run-[timestamp]/M15-Mobile.png

   # Compare with /audit output:
   # - Different format?
   # - Different critique categories?
   # - Which is better for our use case?
   ```

4. **Document actual behavior:**
   - Create `docs/architecture/impeccable-output-format.md`
   - Include examples of actual command outputs
   - Note differences between /audit and /critique

### Phase 3: Refactor annotate-critiques Skill

Based on actual Impeccable behavior, update `.claude/skills/annotate-critiques/SKILL.md`:

**Scenario A: Impeccable outputs structured JSON**
- ✅ Minimal changes needed
- Update JSON schema in Step 2 to match actual format
- Remove "Option B" manual fallback (or keep for offline use)

**Scenario B: Impeccable outputs markdown**
- 🔧 Add parsing step: Markdown → JSON conversion
- Create `scripts/audit/parse-impeccable-markdown.ts`
- Update Step 2 to call parser

**Scenario C: Impeccable outputs conversational text**
- 🔧 Major refactor needed
- Either:
  - Extract structured data from text (regex/AI parsing)
  - OR: Keep manual JSON creation as primary method
  - OR: Use Impeccable for inspiration, manual entry for structure

**Scenario D: Impeccable has API mode**
- ✅ Best case scenario
- Update Step 2 to call Impeccable API directly
- Full automation possible

### Phase 4: Update Supporting Scripts

After refactoring annotate-critiques, update:

1. **scripts/audit/types.ts:**
   - Add `ImpeccableOutput` type based on actual format
   - Add parser function signatures

2. **scripts/audit/playwright-audit.ts:**
   - Optionally: Auto-invoke Impeccable after screenshot capture
   - Save raw Impeccable output alongside screenshots

3. **finish-feature skill:**
   - Update Phase 4 instructions based on new workflow
   - Update example commands to match actual Impeccable syntax

### Phase 5: Test End-to-End

Run complete workflow with a real feature:

```bash
# Phase 4: Visual Audit
npm run audit:screen M15-Blind-Budget /trips/[id]/budget/blind

# Use Impeccable (updated command based on actual format)
/audit audit-output/run-[timestamp]/M15-Mobile.png

# Continue pipeline
npm run audit:map <critique-file> <dom-file>
npm run audit:report <mapped-file>

# Verify output
cat audit-output/run-[timestamp]/M15-critique-report.md
```

---

## Risk Assessment

### High Risk (Must Resolve Before Production Use)

1. **Impeccable Output Format Unknown**
   - **Impact:** Entire Step 2 of annotate-critiques may need rewrite
   - **Mitigation:** Install and test immediately (Phase 2)
   - **Timeline:** 1-2 hours testing + 2-4 hours refactor if needed

2. **Manual Steps Break Automation**
   - **Impact:** Phase 4 visual audit is 50% manual (Impeccable + Agentation)
   - **Mitigation:** Accept for MVP, automate in Phase 2+ of project
   - **Timeline:** Manual workflow acceptable for solo dev in Weeks 0-6

### Medium Risk (Manageable)

1. **Impeccable Commands Overlap with Scripts**
   - **Impact:** User confusion about which tool to use when
   - **Mitigation:** Clear documentation in annotate-critiques skill
   - **Timeline:** 30 min documentation update

2. **Agentation Not Installed Yet**
   - **Impact:** Step 4 of annotate-critiques cannot execute
   - **Mitigation:** Install Agentation (documented in agentation skill)
   - **Timeline:** 15 min installation + 30 min testing

### Low Risk (Acceptable)

1. **Three Critique Tools (critical-review, /audit, /critique)**
   - **Impact:** Tool proliferation, but each serves different purpose
   - **Mitigation:** Document when to use each (see "How It Differs" sections above)
   - **Timeline:** Already documented in this file

---

## Next Immediate Steps

1. **Install Impeccable** (30 min)
   - Download from https://impeccable.style/#downloads
   - Extract to project root
   - Verify `.claude/` folder created

2. **Test Commands** (1-2 hours)
   - Run `/audit` on a sample screenshot
   - Run `/critique` on same screenshot
   - Document actual output format in `docs/architecture/impeccable-output-format.md`

3. **Refactor annotate-critiques** (2-4 hours)
   - Update Step 2 based on actual Impeccable behavior
   - Add parsers if needed
   - Test end-to-end with M15-Blind-Budget example

4. **Install Agentation** (45 min)
   - Run `/agentation` skill
   - Test manual annotation workflow
   - Verify MCP server integration

5. **Document Final Workflow** (30 min)
   - Update `finish-feature` skill with actual commands
   - Add troubleshooting section for common issues
   - Create quick reference card for Phase 4

---

## Open Questions (To Resolve After Installation)

1. ❓ Does Impeccable `/audit` support batch processing (multiple screenshots at once)?
2. ❓ Can Impeccable commands be invoked programmatically from scripts?
3. ❓ What critique categories does Impeccable use? (Do they match our 9-dimension framework?)
4. ❓ Does Impeccable detect design tokens automatically, or need configuration?
5. ❓ Can Agentation MCP server export annotations as structured JSON?
6. ❓ Should we use `/audit` (technical) or `/critique` (UX) for Phase 4? Or both?

---

## Sources

- [Impeccable.style](https://impeccable.style)
- [Impeccable Command Cheatsheet](https://impeccable.style/cheatsheet)
- [Claude Skills vs MCP: The 2026 Guide](https://www.cometapi.com/claude-skills-vs-mcp-the-2026-guide-to-agentic-architecture/)
- [Claude Docs: Agent Skills Guide](https://docs.claude.com/en/api/skills-guide)
