# TripFlow Design Principles

**Authoritative design standards for TripFlow travel planning application**
**Last Updated**: March 1, 2026

---

## Design Philosophy

TripFlow is a modern, accessible travel planning application that prioritizes:
- **Clarity**: Information is easy to find and understand
- **Accessibility**: WCAG 2.1 AA compliance minimum
- **Consistency**: Predictable patterns and familiar interactions
- **Performance**: Fast, responsive, delightful to use

---

## I. Color System

### Base Colors

```css
/* Text */
--text-primary: #1a1a1a       /* Primary text, headings */
--text-secondary: #5e5e5e     /* Secondary text, descriptions */

/* Backgrounds */
--bg-base: #fcfcfc            /* Page background */
--bg-surface: #ffffff         /* Card/panel background */
--bg-surface-hover: #f5f5f5   /* Hover states */

/* Borders */
--border-subtle: rgba(0, 0, 0, 0.06)       /* Borders, dividers */
--border-focus: rgba(13, 148, 136, 0.3)    /* Focus rings */
```

### Accent Colors

```css
--accent-primary: #0D9488     /* Teal - Primary brand, CTAs, links, focus */
--accent-secondary: #FF5A5F   /* Coral - Secondary actions, decorative */
```

### State Colors

```css
--color-success: #10B981      /* Success states, confirmations */
--color-warning: #F59E0B      /* Warnings, cautions */
--color-danger: #EF4444       /* Errors, destructive actions */
--color-info: #3B82F6         /* Informational messages */
```

### Critical Rules

**✅ DO:**
- Use CSS variables for all colors (automatic dark mode support)
- Use semantic colors for UI elements (buttons, alerts, status indicators)
- Ensure text contrast ≥4.5:1, UI components ≥3:1 (WCAG AA)

**❌ DON'T:**
- Hardcode hex values in components
- Use state colors for decorative purposes
- Rely on color alone to convey information

---

## II. Typography

### Scale

```css
H1:         40px / 500 weight / -0.01em letter-spacing
H2:         32px / 500 / -0.01em
H3:         24px / 500 / -0.01em
H4:         20px / 600 / -0.005em
Body:       16px / 400 / 0em
Body Small: 14px / 400 / 0em
```

### Guidelines

- **Font Family**: System fonts with Inter fallback
- **Line Height**: 1.5-1.7 for body text, 1.2-1.3 for headings
- **Alignment**: Left-align body text (better readability)
- **Hierarchy**: Proper heading structure (H1 → H2 → H3, no skipping)

---

## III. Spacing & Layout

### Spacing Scale

```css
xs:  4px   (0.25rem)
sm:  8px   (0.5rem)
md:  16px  (1rem)
lg:  24px  (1.5rem)
xl:  32px  (2rem)
2xl: 48px  (3rem)
3xl: 64px  (4rem)
```

### Layout Rules

- **Mobile edge margins**: Minimum 16px
- **Between major sections**: 24px minimum
- **Card internal padding**: 16px minimum (mobile), 24px (desktop)
- **Button padding**: 12px horizontal, 8px vertical minimum

---

## IV. Border Radius

```css
sm: 6px    /* Small components, tags */
md: 8px    /* Form inputs, buttons */
lg: 12px   /* Cards, panels */
xl: 16px   /* Modals, large containers */
```

---

## V. Components

### Buttons

**Primary Button:**
```tsx
<button className="bg-accent-primary text-white px-4 py-2 rounded-md">
  Book Trip
</button>
```

**States:**
- Hover: Slight darkening or lift effect
- Focus: 2px outline, accent-primary color, 2px offset
- Disabled: 50% opacity, no pointer events
- Loading: Show spinner, disable interaction

### Forms

**Input Fields:**
```tsx
<label htmlFor="name" className="text-sm font-medium">
  Trip Name
</label>
<input
  id="name"
  type="text"
  className="border border-subtle rounded-md px-3 py-2"
/>
```

**Validation:**
- Show errors below field with danger color + icon
- Use aria-describedby to link error messages
- Validate on blur, not on every keystroke

### Cards

```tsx
<div className="bg-surface rounded-lg p-6 shadow-sm">
  <h3 className="text-xl font-medium">Card Title</h3>
  <p className="text-secondary mt-2">Card content</p>
</div>
```

---

## VI. Accessibility Requirements

### Keyboard Navigation

**Focus Indicators:**
```css
:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}
```

**Tab Order:**
- Follows DOM order (logical, predictable)
- No positive tabIndex values
- All interactive elements are keyboard accessible

**Key Patterns:**
- **Buttons**: Enter or Space to activate
- **Links**: Enter to navigate
- **Dialogs**: Escape to close
- **Menus**: Arrow keys to navigate

### Touch Targets

- **Minimum size**: 44x44px on mobile (WCAG Level AAA)
- Applies to: buttons, links, form controls, interactive icons

### Semantic HTML

**✅ DO:**
```tsx
<button onClick={handleClick}>Click Me</button>
<nav><a href="/trips">Trips</a></nav>
<main><h1>Page Title</h1></main>
```

**❌ DON'T:**
```tsx
<div onClick={handleClick}>Click Me</div>  {/* Use <button> */}
<img />  {/* Missing alt text */}
<div className="button">  {/* Non-semantic */}
```

### ARIA

- **Labels**: All icon-only buttons must have `aria-label`
- **Live Regions**: Use `aria-live` for dynamic content updates
- **Landmarks**: Use semantic HTML (nav, main, aside) over ARIA roles when possible

---

## VII. Responsive Design

### Breakpoints

```css
mobile:  < 640px
tablet:  640px - 1024px
desktop: > 1024px
```

### Mobile-First Approach

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 column mobile, 2 tablet, 3 desktop */}
</div>
```

### Critical Checks

- No horizontal scroll on any viewport
- Touch targets ≥44px on mobile
- Readable text without zooming (minimum 16px body)
- Navigation adapts for small screens (hamburger menu or bottom nav)

---

## VIII. Motion & Animation

### Timing

```css
--duration-fast:   150ms   /* Hover states, quick interactions */
--duration-base:   250ms   /* Modals, dropdowns */
--duration-slow:   350ms   /* Page transitions */
```

### Easing

```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
--ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### Reduced Motion

```tsx
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## IX. Common Anti-Patterns

### ❌ Avoid These

**Hardcoded Colors:**
```tsx
// ❌ BAD
<div style={{ color: '#0D9488' }}>Text</div>

// ✅ GOOD
<div className="text-accent-primary">Text</div>
```

**Non-Semantic HTML:**
```tsx
// ❌ BAD
<div onClick={handleClick} className="cursor-pointer">

// ✅ GOOD
<button onClick={handleClick}>
```

**Missing Accessibility:**
```tsx
// ❌ BAD
<img src="map.png" />

// ✅ GOOD
<img src="map.png" alt="Map of Tokyo with activity markers" />
```

**Broken Responsive:**
```tsx
// ❌ BAD
<div style={{ width: '1200px' }}>  {/* Fixed width breaks mobile */}

// ✅ GOOD
<div className="max-w-7xl mx-auto px-4">  {/* Responsive container */}
```

---

## X. Quick Checklist

Before marking a design review as PASS, verify:

### Visual
- [ ] Uses CSS variables (no hardcoded colors)
- [ ] Follows spacing scale (no arbitrary px values)
- [ ] Border radius matches design system
- [ ] Typography scale is correct
- [ ] Dark mode works (if applicable)

### Accessibility
- [ ] Text contrast ≥4.5:1 (WCAG AA)
- [ ] Focus indicators visible on all interactive elements
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Touch targets ≥44px on mobile
- [ ] Semantic HTML (button, nav, main, etc.)
- [ ] ARIA labels on icon-only buttons
- [ ] Proper heading hierarchy (H1 → H2 → H3)

### Responsive
- [ ] No horizontal scroll on mobile (375px)
- [ ] Layout adapts at 768px and 1024px breakpoints
- [ ] Touch targets are large enough on mobile
- [ ] Text is readable without zooming

### Code Quality
- [ ] No inline `style` attributes (use Tailwind or CSS variables)
- [ ] No relative imports (use `@/` alias)
- [ ] TypeScript types defined (no `any`)
- [ ] No console errors or warnings

---

## XI. Resources

- **Full Style Guide**: `tripflow-next/docs/TRIPFLOW-STYLE-GUIDE.md`
- **shadcn/ui Docs**: https://ui.shadcn.com/
- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Contrast Checker**: https://webaim.org/resources/contrastchecker/

---

**Remember**: This is a living document. When in doubt, refer to the full style guide or ask for clarification. Consistency and accessibility are not optional — they're core to the TripFlow experience.
