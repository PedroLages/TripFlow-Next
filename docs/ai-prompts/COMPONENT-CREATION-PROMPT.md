# AI Prompt Template: Component Creation

Use this template when asking AI assistants (Claude Code, Gemini, ChatGPT) to create components.

---

## Prompt Template

```
I need to create a new [COMPONENT_NAME] component for TripFlow.

IMPORTANT: Before writing any code, please:
1. Read tripflow-next/docs/TRIPFLOW-STYLE-GUIDE.md sections:
   - Section 11: Component Anatomy
   - Section 12: Component API Patterns
   - Section 13-18: Relevant component type
   - Section 37: Component Checklist

2. Follow these MANDATORY requirements:
   ✓ TypeScript with strict types (Section 19)
   ✓ shadcn/ui composable pattern (Section 11.1)
   ✓ Use design tokens from globals.css (Section 5)
   ✓ Mobile-first responsive design (Section 23.3)
   ✓ Dark mode support via CSS variables
   ✓ WCAG 2.1 AA accessibility (Section 27)
   ✓ Keyboard navigation (Section 28)
   ✓ Screen reader support (Section 29)

3. Component API must include:
   - Variants using class-variance-authority (Section 12.1)
   - Ref forwarding for imperative access
   - Standard props: className, children, asChild
   - Proper TypeScript interfaces

4. Testing requirements:
   - Unit tests with Vitest (Section 25.1)
   - Test user interactions, not implementation
   - Test all variants and states
   - Test accessibility (keyboard, ARIA)

Component requirements:
[DESCRIBE YOUR COMPONENT REQUIREMENTS HERE]

After implementation:
- Run the Component Checklist (Section 37)
- Verify against Quick Reference (Section 36)
- Ensure Code Review Standards are met (Section 32.2)
```

---

## Example Usage

```
I need to create a new CityBadge component for TripFlow.

IMPORTANT: Before writing any code, please:
[... include template above ...]

Component requirements:
- Display city name with color-coded background
- Use city color system from globals.css (--city-tokyo, --city-osaka, etc.)
- Variants: default (with color), muted (subtle background), outlined (border only)
- Sizes: sm (12px text), md (14px text), lg (16px text)
- Should accept onClick for interactive badges
- Must be accessible as a tag or button depending on interactivity
```

---

## Why This Works

1. **Forces Context Loading**: AI must read the style guide first
2. **Clear Constraints**: No ambiguity about requirements
3. **Checklist Verification**: Built-in quality gate
4. **Consistent Output**: All components follow the same patterns
