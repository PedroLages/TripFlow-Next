# AI Prompt Template: Feature Development

Use this template when asking AI assistants to implement a complete feature.

---

## Prompt Template

```
I need to implement [FEATURE_NAME] for TripFlow.

CRITICAL SETUP - Read before writing ANY code:

1. Style Guide Sections:
   - Section 11-12: Component Architecture
   - Section 19-26: Code Standards
   - Section 27-30: Accessibility
   - Section 36-38: Quick Reference & Patterns

2. Development Process:
   ✓ Mobile-first design (Section 23.3)
   ✓ Design tokens only (Section 5, no hardcoded values)
   ✓ TypeScript strict mode (Section 19)
   ✓ Accessible by default (Section 27)
   ✓ Test as you build (Section 25)

3. Quality Gates:
   - Run Component Checklist (Section 37) for each component
   - Verify against Code Review Standards (Section 32.2)
   - Test keyboard navigation and screen readers
   - Ensure responsive behavior

Feature Requirements:
[DESCRIBE YOUR FEATURE HERE]

Implementation Steps:
1. Plan component structure (list components needed)
2. Identify design tokens to use (from Section 36)
3. Implement components following Section 11.1 pattern
4. Write tests (Section 25)
5. Verify accessibility (Sections 27-30)
6. Run full checklist (Section 37)

After implementation, confirm:
- [ ] All tests pass (npm run test)
- [ ] No TypeScript errors (npm run build)
- [ ] No ESLint warnings (npm run lint)
- [ ] Keyboard accessible
- [ ] Screen reader tested
- [ ] Mobile responsive
- [ ] Dark mode works
```

---

## Example Usage

```
I need to implement a Trip Budget Summary Dashboard for TripFlow.

CRITICAL SETUP - Read before writing ANY code:
[... include full template ...]

Feature Requirements:
- Display total budget across all cities
- Show per-city breakdowns with city color coding
- Include spending vs. budget visualization (progress bars)
- Support blind budgeting mode (hide amounts for some users)
- Responsive: mobile (stacked), tablet (2-col), desktop (3-col grid)
- Accessible to screen readers with clear labels

Design Notes:
- Use Card component (Section 15) for each city
- Use city color tokens (--city-tokyo, etc.) for visual coding
- Use spacing-lg for card gaps (Section 7)
- Typography: H2 for total, H4 for city names (Section 6)
```

---

## Why This Works

1. **Upfront Context**: AI loads all relevant knowledge first
2. **Process Guidance**: Step-by-step implementation approach
3. **Quality Built-In**: Checklist ensures standards are met
4. **Complete Coverage**: From architecture to accessibility
