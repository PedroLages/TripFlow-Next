# CSS to Tailwind Migration Checklist

This checklist guides you through migrating custom CSS to Tailwind utilities while maintaining style guide compliance.

## Pre-Migration Checklist

- [ ] Read [Migration Plan](../docs/plans/2026-03-04-css-to-tailwind-migration.md)
- [ ] Review [Style Guide Section 23: Styling Conventions](../docs/TRIPFLOW-STYLE-GUIDE.md#23-styling-conventions)
- [ ] Install helper tools (see below)
- [ ] Create feature branch: `git checkout -b refactor/css-to-tailwind-[component-name]`
- [ ] Take screenshots of component before migration (for visual regression testing)

## Helper Tools

### 1. Find Inline Styles Script
```bash
# Show all available patterns
./scripts/find-inline-styles.sh

# Find specific patterns
./scripts/find-inline-styles.sh fontVariantNumeric
./scripts/find-inline-styles.sh objectFit
./scripts/find-inline-styles.sh textDecoration
./scripts/find-inline-styles.sh spacing
./scripts/find-inline-styles.sh opacity
./scripts/find-inline-styles.sh all
```

### 2. Online CSS to Tailwind Converters
- **Loopple**: https://www.loopple.com/low-code-builder/tools/css-to-tailwind-converter
- **folge.me**: https://folge.me/tools/css-to-tailwind-converter

### 3. Tailwind Playground
- Test complex conversions: https://play.tailwindcss.com/

## Migration Steps

### For CSS Modules (e.g., MapPin.module.css)

- [ ] **Step 1**: Extract custom animations
  - [ ] Copy `@keyframes` to `globals.css`
  - [ ] Create `@utility` directive for the animation
  - [ ] Test animation works with new utility class

- [ ] **Step 2**: Convert class-based styles to Tailwind
  - [ ] Copy CSS class content to online converter
  - [ ] Review generated Tailwind classes
  - [ ] Manually adjust for design tokens (use CSS variables, not hardcoded colors)
  - [ ] Replace in component with `className` prop

- [ ] **Step 3**: Handle conditional/state classes
  - [ ] Use `cn()` helper from `lib/utils`
  - [ ] Map states to Tailwind variants (hover:, focus:, etc.)
  - [ ] Test all states (normal, hover, focus, active, disabled)

- [ ] **Step 4**: Remove CSS Module
  - [ ] Delete `.module.css` file
  - [ ] Remove import from component
  - [ ] Search codebase for any remaining references

### For Inline Styles

- [ ] **Step 1**: Identify style type
  - [ ] Static style → Migrate to Tailwind
  - [ ] Dynamic style (CSS variables, computed values) → Keep as inline style
  - [ ] Partially dynamic → Extract static parts to className, keep dynamic in style

- [ ] **Step 2**: Convert static styles
  ```tsx
  // Before
  <div style={{ fontVariantNumeric: 'tabular-nums', margin: '0 0 4px 0' }}>

  // After
  <div className="tabular-nums mb-1">
  ```

- [ ] **Step 3**: Handle dynamic styles
  ```tsx
  // Keep these as inline styles
  <div style={{ color: `var(${config.cssVar})` }}>
  <div style={{ backgroundImage: `url(${imageUrl})` }}>
  ```

- [ ] **Step 4**: Optimize partially dynamic styles
  ```tsx
  // Before
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: dynamicColor }}>

  // After
  <div className="flex items-center gap-1.5" style={{ color: dynamicColor }}>
  ```

### For globals.css Utilities

- [ ] **Step 1**: Evaluate usage
  - [ ] Search codebase for class usage: `grep -r "glass-panel" src/`
  - [ ] Count occurrences
  - [ ] Identify common patterns

- [ ] **Step 2**: Choose migration path
  - [ ] **Option A**: React component (if used 5+ times)
    - [ ] Create component in `src/components/ui/`
    - [ ] Add to component library
    - [ ] Document in style guide
  - [ ] **Option B**: Document as pattern (if used 2-4 times)
    - [ ] Add to style guide with class combination
    - [ ] Update existing usage
  - [ ] **Option C**: Inline (if used 1 time)
    - [ ] Replace with Tailwind classes directly

- [ ] **Step 3**: Minimize @apply usage
  - [ ] Review `@layer base` section
  - [ ] Extract @apply to components where possible
  - [ ] Keep only essential base styles

## Style Guide Compliance Checklist

After migrating each component, verify:

### Design Tokens
- [ ] Uses CSS variables for colors (e.g., `bg-[var(--bg-surface)]`)
- [ ] No hardcoded color values (#fff, rgb(), etc.)
- [ ] Uses spacing tokens (p-lg, m-md, gap-sm)
- [ ] Uses radius tokens (rounded-[--radius-lg])

### Responsive Design
- [ ] Mobile-first approach
- [ ] Uses Tailwind breakpoints (sm:, md:, lg:, xl:, 2xl:)
- [ ] Tested on mobile, tablet, desktop

### Dark Mode
- [ ] Works in both light and dark themes
- [ ] Uses theme-aware CSS variables
- [ ] No fixed light/dark colors

### Accessibility
- [ ] Focus indicators visible (outline-ring)
- [ ] Touch targets ≥ 44px (min-h-[--size-touch])
- [ ] Color contrast passes WCAG AA (4.5:1 for text, 3:1 for UI)
- [ ] Keyboard navigation works
- [ ] Screen reader tested (if interactive)

### Performance
- [ ] No unnecessary inline styles
- [ ] Uses Tailwind's JIT compiler (classes are purged)
- [ ] No duplicate CSS (removed old CSS Module)

## Testing Checklist

### Visual Testing
- [ ] Take "after" screenshots
- [ ] Compare with "before" screenshots
- [ ] Check all states (normal, hover, focus, active, disabled)
- [ ] Test in both light and dark modes
- [ ] Test on different screen sizes

### Functional Testing
- [ ] All interactions work (click, hover, focus)
- [ ] Animations/transitions work correctly
- [ ] No console errors or warnings
- [ ] Unit tests pass: `pnpm test`

### E2E Testing
- [ ] E2E tests pass: `pnpm test:e2e`
- [ ] Manual walkthrough of user flows

### Accessibility Testing
- [ ] Keyboard navigation: Tab through all interactive elements
- [ ] Screen reader: Test with VoiceOver (macOS) or NVDA (Windows)
- [ ] Color contrast: Use browser DevTools or axe DevTools
- [ ] Focus indicators: Ensure visible on all focusable elements

## Post-Migration Checklist

- [ ] Run linter: `pnpm lint`
- [ ] Format code: `prettier --write <files>`
- [ ] Update migration plan with progress
- [ ] Commit changes with descriptive message:
  ```
  refactor: migrate [Component] from CSS Module to Tailwind

  - Converted [Component].module.css to Tailwind utilities
  - Moved @keyframes to globals.css with @utility directive
  - Replaced inline styles with className
  - Maintained all functionality and accessibility
  - Tested in light/dark modes, all screen sizes

  Refs: docs/plans/2026-03-04-css-to-tailwind-migration.md
  ```
- [ ] Update todo list
- [ ] Create PR if ready for review

## Common Patterns Reference

### Animations
```css
/* globals.css */
@utility fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Conditional Classes with cn()
```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  isDisabled && "disabled-classes",
  className // Allow prop override
)}>
```

### Design Token Usage
```tsx
// ✅ Correct - Uses design tokens
<div className="bg-[var(--bg-surface)] text-[var(--text-primary)]">

// ❌ Wrong - Hardcoded colors
<div className="bg-white text-black">
```

### Responsive Design
```tsx
// ✅ Mobile-first
<div className="flex-col md:flex-row">

// ❌ Desktop-first
<div className="flex-row md:flex-col">
```

### Dark Mode
```tsx
// ✅ Uses theme-aware variables
<div className="bg-[var(--bg-surface)]">

// ❌ Manually switches
<div className="bg-white dark:bg-gray-900">
```

## Troubleshooting

### Issue: Tailwind class not working
- **Solution**: Check if it's a valid Tailwind utility in v4
- **Solution**: Verify the class is not being purged (check `tailwind.config` if exists)
- **Solution**: Use arbitrary values if needed: `bg-[#custom]`

### Issue: Animation not working after migration
- **Solution**: Ensure `@keyframes` is in `globals.css`
- **Solution**: Verify `@utility` directive is correct
- **Solution**: Check that `tw-animate-css` is imported

### Issue: Dark mode broken
- **Solution**: Verify CSS variables are defined in both `:root` and `:root[data-theme="dark"]`
- **Solution**: Check that `ThemeProvider` is wrapping the app
- **Solution**: Use browser DevTools to inspect computed values

### Issue: Visual differences after migration
- **Solution**: Check spacing (Tailwind uses 4px scale, your old CSS might not)
- **Solution**: Verify border-radius values match
- **Solution**: Inspect with DevTools to find exact differences

## Resources

- [Tailwind CSS v4 Docs](https://tailwindcss.com/)
- [shadcn/ui Tailwind v4 Migration](https://ui.shadcn.com/docs/tailwind-v4)
- [TripFlow Style Guide](../docs/TRIPFLOW-STYLE-GUIDE.md)
- [Migration Plan](../docs/plans/2026-03-04-css-to-tailwind-migration.md)
