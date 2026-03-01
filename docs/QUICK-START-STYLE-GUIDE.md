# TripFlow Style Guide - Quick Start

**For developers who want to start coding immediately while following standards.**

## 🚀 30-Second Setup

### For Claude Code Users (Automatic)
Just start coding! Claude Code automatically:
1. Reads `CLAUDE.md` (which enforces the style guide)
2. Uses the Component Checklist before creating components
3. References design tokens while coding
4. Follows code review standards

**Try it:** Say "Create a CityBadge component" and watch Claude Code reference the style guide automatically.

### For Other AI Assistants (Gemini, ChatGPT, Cursor)
Use the AI prompt templates in `docs/ai-prompts/`:
- Creating component? → Use `COMPONENT-CREATION-PROMPT.md`
- Need code review? → Use `CODE-REVIEW-PROMPT.md`
- Building feature? → Use `FEATURE-DEVELOPMENT-PROMPT.md`

## 📖 Essential Reading (5 minutes)

Before coding, skim these sections:

1. **Section 5: Color System** - Never hardcode colors
   ```tsx
   // ✅ Good
   <div className="bg-bg-surface text-text-primary">

   // ❌ Bad
   <div className="bg-white text-black">
   ```

2. **Section 11: Component Anatomy** - All components follow this structure
   ```tsx
   import { cva } from 'class-variance-authority';

   const componentVariants = cva("base-classes", {
     variants: { /* ... */ }
   });

   export const Component = ({ variant, ...props }) => (
     <div className={cn(componentVariants({ variant }))} {...props} />
   );
   ```

3. **Section 36: Quick Reference** - Design tokens at a glance
   ```css
   /* Spacing */
   sm: 8px, md: 16px, lg: 24px, xl: 32px

   /* Typography */
   H1: 40px, H2: 32px, Body: 16px

   /* Colors */
   --accent-primary: #0D9488
   --text-primary: #1a1a1a
   ```

4. **Section 37: Component Checklist** - Use before marking work complete
   - [ ] TypeScript strict types
   - [ ] Design tokens (no hardcoded colors)
   - [ ] Responsive
   - [ ] Accessible
   - [ ] Dark mode
   - [ ] Tested

## 🎯 Common Tasks

### Creating a New Component

1. **Check if it exists:** Browse `src/components/ui/`
2. **Use existing if possible:** Extend Button, Card, Input, etc.
3. **If creating new:**
   ```tsx
   // Follow Section 11.1 pattern
   import { cva, type VariantProps } from 'class-variance-authority';
   import { cn } from '@/lib/utils';

   const myComponentVariants = cva(
     "base-classes-here",
     {
       variants: {
         variant: {
           default: "...",
           secondary: "...",
         },
         size: {
           sm: "...",
           md: "...",
         },
       },
       defaultVariants: {
         variant: "default",
         size: "md",
       },
     }
   );

   interface MyComponentProps
     extends React.HTMLAttributes<HTMLDivElement>,
     VariantProps<typeof myComponentVariants> {
     // Additional props
   }

   export const MyComponent = ({
     variant,
     size,
     className,
     ...props
   }: MyComponentProps) => {
     return (
       <div
         className={cn(myComponentVariants({ variant, size, className }))}
         {...props}
       />
     );
   };
   ```

4. **Add tests:**
   ```tsx
   // MyComponent.test.tsx
   import { render, screen } from '@testing-library/react';
   import { MyComponent } from './MyComponent';

   describe('MyComponent', () => {
     it('renders with default variant', () => {
       render(<MyComponent>Content</MyComponent>);
       expect(screen.getByText('Content')).toBeInTheDocument();
     });
   });
   ```

### Styling a Component

```tsx
// ✅ Mobile-first, design tokens
<div className="
  flex flex-col gap-sm         {/* Layout */}
  p-md md:p-lg                 {/* Responsive spacing */}
  bg-bg-surface                {/* Design token */}
  text-text-primary            {/* Design token */}
  rounded-lg                   {/* Border radius */}
  hover:bg-bg-surface-hover    {/* Interactive state */}
">
```

**Design Tokens Available:**
- Backgrounds: `bg-bg-base`, `bg-bg-surface`, `bg-bg-surface-hover`
- Text: `text-text-primary`, `text-text-secondary`
- Accents: `text-accent-primary`, `bg-accent-primary`
- Cities: `text-city-tokyo`, `bg-city-osaka` (see Section 5.2)
- Spacing: `gap-sm`, `p-md`, `m-lg` (see Section 7)

### Making Components Accessible

```tsx
// ✅ Icon button with label
<button aria-label="Close dialog">
  <X size={20} />
</button>

// ✅ Form input with label
<Label htmlFor="city-name">City</Label>
<Input id="city-name" type="text" />

// ✅ Error message linked to input
<Input
  id="email"
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
/>
{hasError && <p id="email-error">Invalid email</p>}
```

**Checklist:**
- [ ] All interactive elements keyboard accessible (Tab key)
- [ ] Focus indicators visible (never `outline: none`)
- [ ] Color contrast ≥ 4.5:1 for text
- [ ] Icon-only buttons have `aria-label`
- [ ] Form inputs have associated labels

### Adding Tests

```tsx
// Unit test example
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('MyComponent', () => {
  it('handles user interaction', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is accessible', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

## 🛠️ Development Workflow

### 1. Before Starting
```bash
# Ensure dependencies are installed
npm install

# Read relevant style guide section
# - Component? → Section 11-18
# - Styling? → Section 5, 7, 23
# - Accessibility? → Section 27-30
```

### 2. During Development
```bash
# Run dev server
npm run dev

# Test as you go
npm run test -- --watch

# Check types
npm run build
```

### 3. Before Committing
```bash
# Run all checks
npm run lint          # ESLint
npm run test          # Tests
npm run build         # TypeScript

# Verify Component Checklist (Section 37):
# - [ ] TypeScript strict
# - [ ] Design tokens
# - [ ] Responsive
# - [ ] Accessible
# - [ ] Dark mode
# - [ ] Tested
```

### 4. Git Commit
```bash
git add .
git commit -m "feat(component): add CityBadge component"

# Pre-commit hook will show style guide reminder ✓
```

### 5. Opening PR
Use the PR template (Section 32.2):
```markdown
## What
Added CityBadge component for displaying city names

## Why
Needed consistent city labeling across itinerary and budget views

## Testing
- [x] Unit tests pass
- [x] Keyboard accessible
- [x] Screen reader tested
- [x] Responsive (mobile/tablet/desktop)
- [x] Dark mode works
```

## ⚡ Power Tips

### 1. Use Existing Components
Don't reinvent the wheel:
```tsx
import { Button, Card, Input, Label } from '@/components/ui';
```

### 2. City Colors Made Easy
```tsx
import { getCityStyle } from '@/lib/city-colors';

const cityStyle = getCityStyle('tokyo');
// { primary: '#283593', glow: 'rgba(40, 53, 147, 0.15)', ... }

<div style={{ backgroundColor: cityStyle.muted }}>
  Tokyo content
</div>
```

### 3. Responsive Breakpoints
```tsx
// Mobile-first approach
<div className="
  grid grid-cols-1        {/* Mobile: 1 column */}
  md:grid-cols-2          {/* Tablet: 2 columns */}
  lg:grid-cols-3          {/* Desktop: 3 columns */}
  gap-md lg:gap-lg        {/* Responsive spacing */}
">
```

### 4. Dark Mode Automatic
Use CSS variables → dark mode works automatically:
```tsx
<div className="bg-bg-surface text-text-primary">
  {/* Automatically adapts to light/dark theme */}
</div>
```

### 5. Component Variants
```tsx
const buttonVariants = cva("base", {
  variants: {
    variant: { default: "...", destructive: "..." },
    size: { sm: "...", md: "..." },
  },
});

<Button variant="destructive" size="sm">Delete</Button>
```

## 🚨 Common Mistakes to Avoid

### ❌ Hardcoded Colors
```tsx
// Bad
<div className="bg-white text-black">

// Good
<div className="bg-bg-surface text-text-primary">
```

### ❌ Missing Accessibility
```tsx
// Bad
<div onClick={handleClick}>Click me</div>

// Good
<button onClick={handleClick}>Click me</button>
```

### ❌ Skipping Tests
```tsx
// Bad: No tests

// Good: Test critical behavior
it('calls onClick when clicked', async () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click</Button>);
  await userEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalled();
});
```

### ❌ Non-Responsive
```tsx
// Bad: Fixed width
<div className="w-[800px]">

// Good: Responsive
<div className="w-full max-w-screen-lg">
```

### ❌ Using `any` in TypeScript
```tsx
// Bad
const processData = (data: any) => { ... }

// Good
interface DataShape {
  id: string;
  name: string;
}
const processData = (data: DataShape) => { ... }
```

## 📚 Where to Find More

| Need | Go To |
|------|-------|
| Full style guide | `TRIPFLOW-STYLE-GUIDE.md` |
| AI prompt templates | `ai-prompts/README.md` |
| Project instructions | `../../CLAUDE.md` |
| Component examples | `src/components/ui/` |
| Design tokens | `src/app/globals.css` |

## 🎓 Learning Path

**Week 1:** Read Sections 5-10 (Design System)
**Week 2:** Read Sections 11-18 (Components)
**Week 3:** Read Sections 19-26 (Code Standards)
**Week 4:** Read Sections 27-30 (Accessibility)

Or just reference as needed! The guide is organized for quick lookups.

## ✅ Final Checklist

Before marking any work complete:

- [ ] Read relevant style guide sections
- [ ] Used design tokens (no hardcoded values)
- [ ] TypeScript strict mode passes
- [ ] Tests written and passing
- [ ] Keyboard accessible (Tab through UI)
- [ ] Screen reader tested (VoiceOver/NVDA)
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Dark mode works
- [ ] ESLint passes
- [ ] Component Checklist complete (Section 37)

---

**Questions?** See the full style guide or ask in #design-system Slack.

**Happy coding!** 🚀
