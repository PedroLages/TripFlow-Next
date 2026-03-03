# Review Story

Comprehensive story review: runs tests, linting, code review, and validates acceptance criteria.

**Project-specific skill:** Integrates with TripFlow test suite and BMAD code-review workflow.

## Usage

```
/review-story          # reviews current story
/review-story E01-S03  # reviews specific story
```

## What It Does

1. **Test Validation**
   - Runs `npm test` to verify all tests pass
   - Runs E2E tests for the current story if they exist
   - Reports any test failures with context

2. **Code Quality**
   - Runs `npm run lint` to check for style violations
   - Uses BMAD code-review workflow for deep analysis
   - Checks TripFlow style guide compliance

3. **Story Validation**
   - Verifies acceptance criteria are met
   - Checks that story file is updated
   - Validates sprint-status.yaml is current

4. **Readiness Report**
   - ✅ All tests passing
   - ✅ No linting errors
   - ✅ Code review clean (or lists specific issues)
   - ✅ Acceptance criteria met
   - ✅ Documentation updated

## Configuration

```yaml
trigger: review-story
description: Review story implementation and readiness
version: 1.0.0
```

## When to Use

- Before running `/finish-story`
- After completing implementation
- Before requesting code review from team
- When story seems complete but you want validation

## Integration with BMAD

This skill wraps the BMAD code-review workflow and adds TripFlow-specific checks:
- Tests must pass in `tripflow-next/`
- Style guide compliance from `tripflow-next/docs/TRIPFLOW-STYLE-GUIDE.md`
- Story files in `tripflow-next/docs/stories/`
- E2E tests in `tripflow-next/e2e/story-*.spec.ts`

---

**Note:** This skill automates the pre-completion checklist. If issues are found, they'll be presented with actionable fixes.
