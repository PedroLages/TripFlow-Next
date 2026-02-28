# AI Prompt Template: Code Review

Use this template when asking AI assistants to review code against TripFlow standards.

---

## Prompt Template

```
Please review my code changes against the TripFlow Style Guide.

MANDATORY: Read these sections before reviewing:
- Section 19: TypeScript Conventions
- Section 20: React Component Patterns
- Section 23: Styling Conventions
- Section 27-30: Accessibility Standards
- Section 32.2: Code Review Checklist

Review criteria (from Style Guide Section 32.2):

✅ FUNCTIONALITY:
- [ ] All tests pass
- [ ] TypeScript compiles without errors
- [ ] ESLint passes with no warnings
- [ ] No console errors or warnings

✅ ACCESSIBILITY:
- [ ] Keyboard navigation works (Tab through all elements)
- [ ] Screen reader compatible (proper ARIA labels)
- [ ] Color contrast ≥ 4.5:1 for text, ≥ 3:1 for UI components
- [ ] Focus indicators visible (not removed with outline: none)
- [ ] Semantic HTML (button for actions, a for links, nav for navigation)

✅ QUALITY:
- [ ] Uses design tokens (no hardcoded colors like #fff or #000)
- [ ] TypeScript strict mode compliant (no any, no implicit types)
- [ ] Follows React patterns (hooks, functional components)
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Dark mode works (uses CSS variables)
- [ ] No performance anti-patterns (large lists virtualized, images lazy loaded)

✅ TESTING:
- [ ] Unit tests cover component logic
- [ ] Tests focus on user behavior, not implementation
- [ ] Edge cases tested (empty states, errors, loading)
- [ ] Critical flows have E2E tests

✅ CODE STYLE:
- [ ] Follows naming conventions (Section 22)
- [ ] Component structure matches Section 20.1
- [ ] Imports organized properly (Section 21.3)
- [ ] Comments explain "why", not "what"

Files to review:
[LIST YOUR FILES HERE]

Please provide:
1. Issues found (categorized by severity: blocking, should-fix, suggestion)
2. Specific line references
3. Suggestions for fixes
4. Overall quality assessment
```

---

## Example Usage

```
Please review my code changes against the TripFlow Style Guide.

[... include full template above ...]

Files to review:
- src/components/Budget/BudgetCalculator.tsx
- src/components/Budget/BudgetCalculator.test.tsx
- src/components/Budget/BudgetCalculator.css

Context: This component calculates trip budget with blind budgeting support.
```

---

## Why This Works

1. **Comprehensive Review**: Covers all aspects of the style guide
2. **Structured Output**: Clear categorization of issues
3. **Actionable Feedback**: Specific fixes, not vague suggestions
4. **Quality Gate**: Ensures nothing slips through
