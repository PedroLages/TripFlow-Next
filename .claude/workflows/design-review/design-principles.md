# TripFlow AI Design Principles

## Core Philosophy

**Travel-First Design**: Every interface decision should reduce planning friction and inspire confidence in travelers. The platform prioritizes clarity, emotional connection, and accessibility to create an inclusive travel planning experience.

**Key Tenets:**
- **Clarity over Complexity**: Travel planning is stressful enough—interfaces should be intuitive and calming
- **Trust Through Transparency**: Show real data, real costs, real timelines—no surprises
- **Accessibility is Essential**: WCAG 2.1 AA compliance minimum for inclusive travel planning
- **Performance = Confidence**: Fast interfaces reduce anxiety and build user trust

---

## Design System Foundations

### Color Architecture

**Primary Palette:**
- Background Base: `#fcfcfc` (light mode) / `#121212` (dark mode)
- Background Surface: `#ffffff` (light) / `#1E1E1E` (dark)
- Text Primary: `#1a1a1a` (light) / `#F5F5F5` (dark)
- Text Secondary: `#5e5e5e` (light) / `#A3A3A3` (dark)

**Brand Accents:**
- Accent Primary (Teal): `#0D9488` (light) / `#14B8A6` (dark) - CTAs, active states, interactive elements
- Accent Secondary (Coral): `#FF5A5F` (light) / `#FF767A` (dark) - Highlights, warnings
- Accent Glow: `rgba(13, 148, 136, 0.15)` - Subtle emphasis effects

**Semantic Colors:**
- Success (Green): `#10B981` - Bookings confirmed, tasks completed
- Warning (Amber): `#F59E0B` - Pending actions, budget alerts
- Danger (Red): `#EF4444` - Errors, destructive actions
- Info (Blue): `#3B82F6` - Tips, informational messages

**City Color System** (for multi-city trips):
- Shanghai: `#C2185B` (pink/magenta)
- Hong Kong: `#E65100` (deep orange)
- Osaka: `#00838F` (cyan/teal)
- Kyoto: `#558B2F` (light green)
- Tokyo: `#283593` (indigo)
- Beijing: `#BF360C` (red-orange)

Each city color has variants: `-glow` (0.15-0.20 opacity) and `-muted` (0.08 opacity) for layered visual hierarchy.

**Accessibility Requirements:**
- All text must meet WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Dark mode support with verified contrast ratios
- Never use color as the sole indicator of information
- City colors are supplemental—always pair with labels or icons

### Typography Standards

**Font Stack:**
- Base: `"DM Sans"` - Clean, modern sans-serif for UI and body text
- Heading: `"Playfair Display"` - Elegant serif for headings and emotional moments
- Mono: `"JetBrains Mono"` - Technical data, confirmation codes, budget numbers

**Readability Rules:**
- Line Height: 1.5 for optimal reading comprehension
- Font Weights: 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- Headings use `--font-heading` (Playfair Display) for elegance
- Letter spacing: -0.01em on headings for tighter visual balance
- Left-aligned text (never center-align body text)

### Spacing & Layout

**Border Radius:**
- Cards/Panels: `var(--radius-lg)` (12px) for modern, approachable feel
- Buttons: `var(--radius-md)` (8px) for clear clickability
- Large surfaces: `var(--radius-xl)` (16px) for hero components
- Small elements: `var(--radius-sm)` for tags, badges

**Transitions:**
- Fast interactions: `var(--transition-fast)` (0.15s) - hovers, clicks
- Smooth state changes: `var(--transition-smooth)` (0.4s) - color, background
- Playful emphasis: `var(--transition-bounce)` (0.6s) - success states, celebrations

**Layout:**
- Sidebar width: `280px` (desktop)
- Use design tokens from `globals.css` - never hardcode colors or spacing
- Consistent spacing using 8px base grid (multiples of 0.5rem via Tailwind)

---

## Component Design Standards

### Navigation Components

**Sidebar Navigation:**
- Always visible on desktop (≥1024px), collapsible on tablet/mobile
- Active state clearly indicated with background color + visual emphasis
- Icons + labels for clarity
- Logical grouping with visual separators

**Header:**
- Fixed position with trip switcher, notifications, and user profile
- Trip name prominently displayed
- Notification badge with count indicator
- User avatar with dropdown menu access

### Trip Cards

**Essential Elements:**
- Trip destination with city badges
- Date range clearly displayed
- Budget indicator (uses blind budgeting design if enabled)
- Collaboration indicators (avatars for shared trips)
- Progress indicator (days until departure, planning progress)
- City color accents for visual distinction

**Interaction States:**
- Hover: `.glass-panel:hover` with `translateY(-2px)` elevation
- Active: Border highlight or background change
- Focus: Clear outline for keyboard navigation (`:focus-visible`)

### Data Display

**Tables:**
- Left-align text, right-align numbers
- Bold headers with clear visual separation
- Sortable columns with visual indicators
- Row hover states for scannability
- Responsive: stack on mobile if complex

**Budget Components:**
- Use `--font-mono` for currency amounts (consistent digit alignment)
- Show multi-currency with clear conversion indicators
- Privacy mode: use blur effects and lock icons
- Real-time totals with smooth transitions

**Progress Indicators:**
- Circular progress for completion percentages
- Linear progress bars for budget tracking
- Color-coded: green (on track), amber (approaching limit), red (over budget)
- Always include text label—never progress bar alone

---

## Interaction Patterns

### Forms & Inputs

**Input Fields:**
- Border radius: `var(--radius-md)` (8px)
- Focus state: `border-focus` with 2px accent-primary outline
- Error state: Red border + error message below
- Disabled state: Reduced opacity + no pointer events
- Labels always visible (no placeholder-only inputs)

**Buttons:**
- Primary: Accent-primary background, white text, shadow on hover
- Secondary: Transparent with border, accent text
- Destructive: Red/danger semantic color
- Ghost: No background, text-only, subtle hover state
- Minimum touch target: 44x44px on mobile

**Date Pickers:**
- Custom calendar UI matching design system
- Multi-date selection for trip ranges
- Visual distinction for departure/arrival dates
- City color coding if selecting across multiple cities

### Modal & Overlays

**Modal Dialogs:**
- Centered with overlay backdrop (`var(--overlay-bg)`)
- Glass panel styling (`.glass-panel`)
- Close button top-right (X icon + label)
- Escape key dismisses
- Focus trap within modal while open

**Tooltips & Popovers:**
- Dark background with light text for contrast
- Arrow pointing to trigger element
- Auto-position to avoid viewport edges
- Keyboard accessible (show on focus)

### Loading & Empty States

**Loading:**
- Skeleton screens for content placeholders
- Spinner for short operations (<2s expected)
- Progress bar for long operations (file uploads, AI generation)
- Never block entire UI unless necessary

**Empty States:**
- Illustration + clear message + primary action
- Example: "No trips yet? Start planning your next adventure" + "Create Trip" button
- Helpful, encouraging tone—never blame the user

---

## Accessibility Standards

### WCAG 2.1 AA Compliance

**Visual:**
- Text contrast: ≥4.5:1 for normal text, ≥3:1 for large text (18px+)
- Interactive elements: ≥3:1 contrast against background
- Focus indicators visible on all interactive elements
- No information conveyed by color alone

**Keyboard Navigation:**
- All interactive elements reachable via Tab
- Logical tab order follows visual layout
- Enter/Space activates buttons and links
- Escape closes modals and menus
- Skip links for main content

**Screen Reader Support:**
- ARIA labels on icon-only buttons
- Proper heading hierarchy (H1 → H2 → H3)
- Landmark regions: `<nav>`, `<main>`, `<aside>`, `<footer>`
- Form labels properly associated with inputs
- Dynamic content changes announced (live regions)

**Motion & Animation:**
- Respect `prefers-reduced-motion` media query
- Essential animations < 0.3s
- No auto-playing videos or carousels
- Parallax and decorative motion disabled if user prefers reduced motion

---

## Responsive Design

### Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: ≥ 1024px

### Mobile-First Patterns

**Layout:**
- Single column stack on mobile
- Sidebar becomes bottom navigation or hamburger menu
- Cards expand to full width
- Touch targets minimum 44x44px

**Typography:**
- Reduce heading sizes proportionally
- Maintain readability at smaller sizes
- Never let text scale below 14px

**Forms:**
- Stack form fields vertically
- Full-width inputs on mobile
- Large, easy-to-tap buttons
- Native input types for mobile keyboards (email, tel, date)

---

## Dark Mode

**Implementation:**
- User toggle in settings (persists via localStorage)
- System preference detection on first visit
- Smooth transitions between modes (`var(--transition-smooth)`)
- All design tokens have dark mode variants in `globals.css`

**Visual Adjustments:**
- Reduce shadow intensity (use subtler shadows)
- Adjust accent colors for better contrast (e.g., teal becomes brighter)
- Maintain WCAG contrast ratios in both modes
- Test all interactive states in both modes

---

## Testing Checklist

Before shipping any UI change, verify:

- [ ] Text contrast meets WCAG AA in light and dark mode
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus indicators visible on all interactive elements
- [ ] Responsive at mobile (375px), tablet (768px), desktop (1440px)
- [ ] Hover states exist and feel responsive
- [ ] Loading states don't block critical actions
- [ ] Empty states are helpful and actionable
- [ ] Error messages are specific and guide next steps
- [ ] Design tokens from `globals.css` used (no hardcoded colors)
- [ ] Works with `prefers-reduced-motion`

---

## Anti-Patterns to Avoid

**Visual:**
- Hardcoded hex colors (use CSS variables)
- Inline styles (use Tailwind utilities or design tokens)
- Inconsistent border radius (use `--radius-*` tokens)
- Low contrast text (always check WCAG ratios)

**Interaction:**
- `<div onClick>` instead of `<button>` (use semantic HTML)
- Icon-only buttons without labels/ARIA (always add `aria-label`)
- Disabled buttons without explanation (show why disabled)
- Auto-focus on page load (disorienting for keyboard users)

**Responsive:**
- Horizontal scroll on mobile (test at 375px)
- Touch targets < 44px (fingers are bigger than cursors)
- Fixed-width layouts (use responsive units)
- Assuming desktop viewport (design mobile-first)

---

## TripFlow-Specific Patterns

### Blind Budgeting Mode

When privacy mode enabled:
- Budget numbers use `blur(8px)` effect
- Hover/tap reveals temporarily
- Lock icon indicates privacy mode active
- Color coding preserved (can't hide urgency)

### City Color Coding

Multi-city trips use city colors for visual distinction:
- Itinerary sections use city color accents
- Budget breakdowns grouped by city
- Timeline visualization uses city colors
- Always pair with text labels—color is supplemental

### Collaboration Indicators

Shared trips show:
- Avatar stack for collaborators (max 3 visible + count)
- Real-time presence indicators (who's viewing)
- Last edit timestamp with editor name
- Conflict warnings if simultaneous edits

---

## Design Token Reference (Quick Access)

From `src/app/globals.css`:

```css
/* Backgrounds */
--bg-base: #fcfcfc (light) / #121212 (dark)
--bg-surface: #ffffff (light) / #1E1E1E (dark)
--bg-surface-hover: #f5f5f5 (light) / #2A2A2A (dark)

/* Text */
--text-primary: #1a1a1a (light) / #F5F5F5 (dark)
--text-secondary: #5e5e5e (light) / #A3A3A3 (dark)

/* Accents */
--accent-primary: #0D9488 (light) / #14B8A6 (dark)
--accent-secondary: #FF5A5F (light) / #FF767A (dark)

/* Semantic */
--color-green: #10B981
--color-amber: #F59E0B
--color-red: #EF4444
--color-blue: #3B82F6

/* Radius */
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px

/* Fonts */
--font-base: "DM Sans"
--font-heading: "Playfair Display"
--font-mono: "JetBrains Mono"

/* Transitions */
--transition-fast: 0.15s
--transition-smooth: 0.4s
--transition-bounce: 0.6s
```

Always reference these tokens—never hardcode values.
