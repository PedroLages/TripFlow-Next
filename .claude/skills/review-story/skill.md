---
name: review-story
description: Use when running quality gates on a LevelUp story before shipping. Runs build/lint/tests, dispatches design review (Playwright MCP) and adversarial code review agents, generates consolidated report. Use after implementing a story to catch issues before /finish-story.
argument-hint: "[E##-S##]"
disable-model-invocation: true
---

# Review Story

Runs all quality gates: pre-checks, design review, code review, and test quality review. Produces a consolidated severity-triaged report. Supports resumption — interrupted reviews skip already-completed gates on re-run.

## Usage

```
/review-story E01-S03
/review-story          # derives story ID from branch name
```

## Canonical Gate Names

All gates must use these exact names in `review_gates_passed`. No variants (e.g., `test` instead of `unit-tests`).

| Gate | When added | Required for `reviewed: true` |
|------|-----------|-------------------------------|
| `build` | Pre-checks pass | Yes |
| `bundle-size` | Pre-checks pass | Yes |
| `lint` | Pre-checks pass (or skipped if no script) | Yes (or `lint-skipped`) |
| `unit-tests` | Pre-checks pass (or skipped if no tests) | Yes (or `unit-tests-skipped`) |
| `e2e-tests` | Pre-checks pass (or skipped if no tests) | Yes (or `e2e-tests-skipped`) |
| `visual-regression` | Pre-checks pass (or skipped if no baselines) | Yes (or `visual-regression-skipped`) |
| `performance` | Performance validation completes | Yes (or `performance-skipped` if Lighthouse not configured) |
| `design-review` | Design review agent completes | Yes (or `design-review-skipped` if no UI changes) |
| `code-review` | Code review agent completes | Yes |
| `code-review-testing` | Test coverage agent completes | Yes |

The `-skipped` suffix indicates the gate was intentionally skipped (no lint script, no test files, no UI changes). Both the base name and `-skipped` variant satisfy the requirement.

## Steps

0. **Worktree detection and navigation**:

   a. **Extract story key**:
      - If `$ARGUMENTS` provided: Parse story key (e.g., `E04-S04` → `e04-s04`)
      - If no arguments: Will derive from branch name in step 1, so skip to step 1 first, then return here

   b. **Check for worktree**:
      - Run: `git worktree list`
      - Search output for a worktree matching the story's branch pattern `feature/e##-s##-*` (lowercase)
      - Example match: `feature/e04-s04-view-study-session-history`

   c. **Navigate if found**:
      - **Worktree exists**:
        - Extract worktree path from `git worktree list` output (first column)
        - Navigate: `cd <worktree-path>`
        - Inform user: "📂 Navigating to worktree at `<worktree-path>`"
      - **Worktree not found**:
        - Check current branch: `git branch --show-current`
        - If current branch matches story (`feature/e##-s##-*`): Continue in current location
        - If on different branch: Switch to story branch: `git checkout feature/e##-s##-slug`
        - Inform user: "Working in main workspace (no worktree detected)"

1. **Identify story**: Parse ID from `$ARGUMENTS` or from branch name (`git branch --show-current` → `feature/e01-s03-...` → `E01-S03`).

2. **Read story file** from `docs/implementation-artifacts/`. Extract acceptance criteria, tasks, current status, and **review tracking fields** (`reviewed`, `review_started`, `review_gates_passed`).

3. **Detect resumption**: Check if this is a resumed review:

   - If `reviewed: in-progress` and `review_gates_passed` is non-empty:
     - Inform the user: "Resuming interrupted review. Previously passed gates: [list]. Re-running pre-checks (code may have changed), then skipping already-completed agent reviews."
     - Set `resuming = true` and note which gates passed.
   - If `reviewed: true`:
     - Inform the user: "Story already reviewed. Re-running full review to validate current state."
     - Reset: set `reviewed: in-progress`, clear `review_gates_passed`, update `review_started`.
   - If `reviewed: false` (fresh review):
     - Set `reviewed: in-progress`, `review_started: YYYY-MM-DD`, `review_gates_passed: []` in story frontmatter.

4. **Pre-checks** (always run — fast, validates current state):

   Run these sequentially — stop on first failure:

   a. `npm run build` — STOP on failure with build errors. On success: add `build` to `review_gates_passed`.

   b. **Bundle size check** — `bash scripts/check-bundle-size.sh 5`
      - Verify dist/ size < 5MB (prevents bloat)
      - If size exceeds threshold, STOP with recommendation to run `npm run build:analyze` to investigate
      - On success: add `bundle-size` to `review_gates_passed`

   c. `npm run lint` — STOP on failure with lint errors (if lint script exists, otherwise skip).
   d. `npm run test:unit -- --run` — STOP on failure. If no unit test script or no test files, note and continue.
   e. E2E tests — run smoke specs + current story's spec on Chromium only:
      ```
      npx playwright test tests/e2e/navigation.spec.ts tests/e2e/overview.spec.ts tests/e2e/courses.spec.ts tests/e2e/story-{id}.spec.ts --project=chromium
      ```
      If the current story has no spec file in `tests/e2e/`, run smoke specs only. STOP on failure. Do NOT run `tests/design-review.spec.ts` or `tests/e2e/regression/` specs here — those are separate.

   f. **Visual regression** — `npm run test:visual` (Chromium only)
      - Compare screenshots against baselines in `tests/e2e/visual-regression.spec.ts-snapshots/`
      - If diffs found: STOP with recommendation to review changes. Provide instructions to run `npm run test:visual:update` to update baselines if changes are intentional.
      - If no baselines exist (first run): Skip with note: "No visual baselines found. Run `npm run test:visual:update` to create initial baselines."
      - If test file doesn't exist: Skip silently (visual regression not configured).
      - On success: add `visual-regression` to `review_gates_passed`

   If any pre-check fails: show the error output, suggest fixes, and STOP. Do not proceed to reviews. Keep `reviewed: in-progress` so next run resumes.

   On success: update `review_gates_passed` using canonical gate names:
   - Always add: `build`, `bundle-size`
   - Add `lint` if lint ran and passed, or `lint-skipped` if no lint script exists
   - Add `unit-tests` if tests ran and passed, or `unit-tests-skipped` if no test files
   - Add `e2e-tests` if tests ran and passed, or `e2e-tests-skipped` if no test files
   - Add `visual-regression` if tests ran and passed, or `visual-regression-skipped` if no baselines exist or test file doesn't exist

5. **Performance Budget Validation** (conditional, skippable on resume):

   **Skip condition**: If resuming AND `performance` is already in `review_gates_passed` — skip with message: "Performance validation already completed."

   **Skip if no Lighthouse**: If `npm run lighthouse` script doesn't exist or `lighthouserc.cjs` not found:
   - Add `performance-skipped` to `review_gates_passed`.
   - Note in consolidated report: "Skipped — Lighthouse not configured."

   **Run Lighthouse CI**:

   Run: `npm run lighthouse` (configured to test against Vite preview on localhost:4173)

   **Validates:**
   - Performance score ≥ 90%
   - Accessibility score ≥ 90%
   - Core Web Vitals: FCP < 2s, LCP < 2.5s, CLS < 0.1
   - Total Blocking Time < 300ms
   - Speed Index < 3s

   **Behavior:**
   - If performance score < 90%: STOP with specific failing metrics. Show which pages failed and scores.
   - If accessibility score < 90%: STOP (design review will also catch accessibility issues).
   - If Core Web Vitals fail: WARN (don't block, but include in report).
   - If Lighthouse run fails (e.g., preview server unreachable): STOP and suggest manual check.

   On success: add `performance` to `review_gates_passed`.

   **Report location:** Lighthouse HTML reports saved to `.lighthouseci/` directory.

6. **Design review** (conditional, skippable on resume):

   **Skip condition**: If resuming AND `design-review` is already in `review_gates_passed` AND the report file `docs/reviews/design/design-review-*-{story-id}.md` exists — skip with message: "Design review already completed. Report: [path]".

   **No UI changes**: If `git diff --name-only main...HEAD` shows NO changes in `src/app/` (pages, components, styles):
   - Add `design-review-skipped` to `review_gates_passed`.
   - Note in consolidated report: "Skipped — no UI changes."

   **UI changes detected**: Run the design review:

   a. Check dev server: `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173`.
      - Not reachable → start `npm run dev` in background via Bash (`npm run dev &`), wait up to 30s.
      - Still unreachable → **do NOT skip silently**. Warn the user: "Dev server unreachable. Design review cannot run." Do NOT add `design-review` to gates. The review stays incomplete — this blocks `reviewed: true`.
   b. Dispatch to `design-review` agent via Task tool:
      ```
      Task({
        subagent_type: "design-review",
        prompt: "Review story E##-S## changes. Affected routes: [mapped from files]. Focus on: [ACs that involve UI]. Git diff summary: [key changes].",
        description: "Design review E##-S##"
      })
      ```
   c. **Validate agent result**: If the agent returns an error, empty report, or the report lacks the expected severity sections:
      - Warn the user: "Design review agent failed. Likely cause: Playwright MCP tools unavailable."
      - Do NOT add `design-review` to `review_gates_passed`.
      - Note in consolidated report: "**FAILED** — agent error. Re-run after fixing MCP configuration."
      - Continue to code reviews (design review failure does not block other gates).
   d. On success: save report to `docs/reviews/design/design-review-{YYYY-MM-DD}-{story-id}.md`
   e. Parse severity from returned report.
   f. Update `review_gates_passed` to include `design-review`.

6. **Code reviews** (parallel, skippable on resume):

   Two agents run in parallel: `code-review` (architecture/security/correctness) and `code-review-testing` (AC coverage/test quality).

   **Skip conditions** (checked independently):
   - Skip `code-review` if: resuming AND `code-review` in `review_gates_passed` AND report file `docs/reviews/code/code-review-*-{story-id}.md` exists.
   - Skip `code-review-testing` if: resuming AND `code-review-testing` in `review_gates_passed` AND report file `docs/reviews/code/code-review-testing-*-{story-id}.md` exists.

   For each agent not skipped, dispatch via Task tool **in parallel** (both in the same message):
   ```
   Task({
     subagent_type: "code-review",
     prompt: "Review story E##-S## at docs/implementation-artifacts/{key}.md. Run git diff main...HEAD for changes. Focus on architecture, security, correctness, silent failures, and LevelUp stack patterns. Score each finding with confidence (0-100).",
     description: "Code review E##-S##"
   })

   Task({
     subagent_type: "code-review-testing",
     prompt: "Review test coverage for story E##-S## at docs/implementation-artifacts/{key}.md. Run git diff main...HEAD for changes. Map every acceptance criterion to its tests. Review test quality, isolation, and edge case coverage. Score each finding with confidence (0-100).",
     description: "Test coverage review E##-S##"
   })
   ```

   Save reports:
   - `docs/reviews/code/code-review-{YYYY-MM-DD}-{story-id}.md`
   - `docs/reviews/code/code-review-testing-{YYYY-MM-DD}-{story-id}.md`

   Parse severity from both reports.

   **Deduplicate**: If both agents flag the same file:line, keep the finding with the higher confidence score. Prefix deduplicated findings with their source agent.

   Update `review_gates_passed` to include `code-review` and `code-review-testing` as each completes.

7. **Merge test quality findings**:

   The `code-review-testing` agent replaces the previous inline test quality checks. Extract its AC Coverage Table and test quality findings for the consolidated report. No additional inline checks needed — the agent handles test isolation, selector quality, factory usage, and AC coverage.

8. **Consolidated report**:

   Combine all findings into a single severity-triaged view:

   ```markdown
   ## Review Summary: E##-S## — [Story Name]

   ### Pre-checks
   - Build: [pass/fail]
   - Lint: [pass/fail/skipped]
   - Unit tests: [pass/fail/skipped] ([N] tests)
   - E2E tests: [pass/fail/skipped] ([N] tests)

   ### Design Review
   [Summary or "Skipped — no UI changes" or "Reused from previous run — [path]"]
   Report: docs/reviews/design/design-review-{date}-{id}.md

   ### Code Review (Architecture)
   [Summary with finding counts by severity or "Reused from previous run — [path]"]
   Report: docs/reviews/code/code-review-{date}-{id}.md

   ### Code Review (Testing)
   [AC coverage summary: N/N ACs covered, N gaps. Finding counts by severity or "Reused from previous run — [path]"]
   Report: docs/reviews/code/code-review-testing-{date}-{id}.md

   ### Consolidated Findings

   #### Blockers (must fix)
   - [Source]: [Finding]

   #### High Priority (should fix)
   - [Source]: [Finding]

   #### Medium (fix when possible)
   - [Source]: [Finding]

   #### Nits (optional)
   - [Source]: [Finding]

   ### Verdict
   [PASS — ready for /finish-story | BLOCKED — fix [N] blockers first]
   ```

   - **Blocker/Critical findings** → STOP with specific fix instructions and file:line references.
   - **Non-blocking findings** → listed as warnings. Story can proceed to `/finish-story`.

9. **Mark reviewed** (with gate validation):

   **Validate all required gates** before marking `reviewed: true`. Check that `review_gates_passed` contains one entry (base or `-skipped` variant) for each of the 10 canonical gates: `build`, `bundle-size`, `lint`, `unit-tests`, `e2e-tests`, `visual-regression`, `performance`, `design-review`, `code-review`, `code-review-testing`.

   - **All gates present**: Set `reviewed: true`. Set `review_gates_passed` to the full list. Append review summary to `## Design Review Feedback` and `## Code Review Feedback` sections.
   - **Missing gates**: Do NOT set `reviewed: true`. Keep `reviewed: in-progress`. Warn the user:
     ```
     Cannot mark as reviewed — missing gates: [list].
     [For each missing gate, explain why it's missing and how to fix.]
     Re-run /review-story after fixing.
     ```

10. **Completion output**: Display the following summary to the user:

    **If PASS (no blockers)**:

    ```markdown
    ---

    ## Review Complete: E##-S## — [Story Name]

    | Gate                  | Result                    |
    | --------------------- | ------------------------- |
    | Build                 | [pass/fail]               |
    | Lint                  | [pass/fail/skipped]       |
    | Unit tests            | [pass (N tests)/skipped]  |
    | E2E tests             | [pass (N tests)/skipped]  |
    | Design review         | [pass/N warnings/skipped] |
    | Code review           | [pass/N warnings]         |
    | Code review (testing) | [N/N ACs covered/N warnings] |

    **Verdict: PASS** — Story is ready to ship.

    ### Next Step

    Run `/finish-story` to create the PR (lightweight — reviews already done).

    Reports saved:
    - `docs/reviews/design/design-review-{date}-{id}.md`
    - `docs/reviews/code/code-review-{date}-{id}.md`
    - `docs/reviews/code/code-review-testing-{date}-{id}.md`

    ---
    ```

    **If BLOCKED (blockers found)**:

    ```markdown
    ---

    ## Review Blocked: E##-S## — [Story Name]

    **Verdict: BLOCKED** — Fix [N] blocker(s) before shipping.

    ### Blockers to Fix

    1. [Source — file:line]: [Description]
    2. [Source — file:line]: [Description]

    ### After Fixing

    Re-run `/review-story` to validate fixes. Pre-checks will re-run; completed agent reviews will be reused.

    ---
    ```

After fixing issues, re-run `/review-story` — completed agent reviews are preserved and reused.

## Route Map

| Source file pattern | Route |
|---|---|
| `pages/Overview.tsx` | `/` |
| `pages/MyClass.tsx` | `/my-class` |
| `pages/Courses.tsx` | `/courses` |
| `pages/CourseDetail.tsx` | `/courses/:courseId` |
| `pages/LessonPlayer.tsx` | `/courses/:courseId/:lessonId` |
| `pages/Library.tsx` | `/library` |
| `pages/Messages.tsx` | `/messages` |
| `pages/Instructors.tsx` | `/instructors` |
| `pages/Reports.tsx` | `/reports` |
| `pages/Settings.tsx` | `/settings` |

## When Review Agents Find Issues

Apply `receiving-code-review` principles when processing review feedback:
- Verify findings technically before implementing fixes
- Don't blindly implement every suggestion — assess whether each applies
- Apply `systematic-debugging` for complex issues: 4-phase root cause analysis before any fixes

## Recovery

- **Pre-checks fail**: Fix errors, re-run `/review-story`. Agent reviews already completed are preserved.
- **Design review agent fails**: Check dev server, check Playwright MCP tools available, re-run. Only the failed gate re-runs.
- **Code review agent(s) fail**: Check git diff is accessible, re-run. Only the failed gate(s) re-run — `code-review` and `code-review-testing` are tracked independently.
- **Interrupted mid-review**: Story stays `reviewed: in-progress` with `review_gates_passed` tracking progress. Re-run resumes from where it left off — pre-checks always re-run (fast), completed agent reviews are skipped.
- **Stale review after code changes**: If you fix blockers and re-run, pre-checks validate the new code. Agent reviews from the previous run are reused unless you want a fresh review — in that case, manually set `reviewed: false` and clear `review_gates_passed: []` in the story frontmatter.
