# Mobile-First UX Deep Dive

**Created**: February 8, 2026
**Last Revised**: February 8, 2026
**Status**: ✅ Revised - Production Ready
**Purpose**: Comprehensive mobile-first design system, component library, responsive patterns, and touch interaction guidelines for TripOS

**Based On**:
- [gap-analysis-competitive-positioning.md](./gap-analysis-competitive-positioning.md) - Mobile-first competitive advantage (Section 2.1.4)
- [modern-tech-stack-deep-dive.md](./modern-tech-stack-deep-dive.md) - Technical foundation (React 19, Tailwind v4, PWA)
- Competitive analysis: Sygic (desktop-first), Wanderlog (web-optimized), TripIt (mobile secondary)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Mobile-First Design Philosophy](#2-mobile-first-design-philosophy)
3. [Design System](#3-design-system)
4. [Component Library](#4-component-library)
5. [Touch Interaction Patterns](#5-touch-interaction-patterns)
6. [Responsive Patterns](#6-responsive-patterns)
7. [Navigation Architecture](#7-navigation-architecture)
8. [Performance Optimization](#8-performance-optimization)
9. [Progressive Web App (PWA) Patterns](#9-progressive-web-app-patterns)
10. [Accessibility & Inclusive Design](#10-accessibility--inclusive-design)
11. [Implementation Roadmap](#11-implementation-roadmap)

---

## 1. Executive Summary

### 1.1 Core Principle

> **Design for thumbs first, mice second.**

TripOS is designed for mobile from day one because:

- **Travel planning happens on phones** - Quick interactions during commute, coffee breaks, waiting in line (when ideas strike)
- **Group coordination requires quick interactions** - "Vote now" while everyone's together, real-time decision-making
- **During-trip usage is 100% mobile** - No one brings laptops on vacation (accessing itinerary, maps, updates on-the-go)
- **Competitors are desktop-first with clunky mobile** - Sygic (desktop-first), Wanderlog (web-optimized), TripIt (mobile feels like port)

### 1.2 Design Constraints

**Primary Design Target**: iPhone SE (375px × 667px)
**Why**: Smallest common modern device. If it works here, it works everywhere.

**Secondary Targets**:
- iPhone 15 Pro (393px × 852px) - Most common
- Android (360px+ various heights) - Majority of users
- iPad (768px × 1024px) - Desktop-like experience
- Desktop (1280px+) - Enhanced layout

**Golden Rule**: Every interaction must be **thumb-reachable** on iPhone SE held in one hand.

### 1.3 Quality Bar

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Tap Targets** | ≥44×44px | Chrome DevTools touch emulation |
| **Max Taps to Action** | ≤3 taps | User flow testing |
| **Thumb Zone Coverage** | 80% actions in lower 1/3 | Interaction heatmap |
| **Load Time** | <2s on 3G | Lighthouse mobile |
| **Interaction Responsiveness** | <100ms feedback | Performance API |
| **Scroll Performance** | 60fps | React DevTools Profiler |

### 1.4 Competitive Advantage

| Competitor | Mobile Approach | Weakness | Our Advantage |
|------------|----------------|-----------|---------------|
| **Sygic** | Desktop-first, mobile clunky | 50M POIs overwhelming on small screen | Curated for mobile, Google Places API |
| **Wanderlog** | Web-optimized, mobile secondary | Performance degrades with long itineraries | Virtualized lists, code splitting |
| **TripIt** | Mobile exists but feels like port | Removed map from new web version | Mobile-first map integration |
| **Lambus** | Mobile but cluttered | Too many features crammed in | Progressive disclosure, clean hierarchy |

**Bottom Line**: Competitors retrofitted mobile onto desktop apps. We start mobile and enhance for desktop.

---

## 2. Mobile-First Design Philosophy

### 2.1 The Thumb Zone

**Visual Reference**:
```
┌─────────────────────────┐
│  Top: Hard to Reach     │ ← Header, non-critical info
│  (Status, back button)  │
├─────────────────────────┤
│                         │
│  Middle: Easy Reach     │ ← Content, scrollable
│  (Scrollable content)   │
│                         │
├─────────────────────────┤
│  Bottom: Natural Zone   │ ← Primary actions
│  (Primary actions)      │ ← Tab bar, FAB, vote button
└─────────────────────────┘
```

**Design Rule**: Place **primary actions** in bottom 1/3 of screen.

**Examples**:
- ✅ **Good**: "Vote Now" button at bottom of activity card
- ❌ **Bad**: "Create Poll" button in top-right corner
- ✅ **Good**: Tab bar navigation at bottom
- ❌ **Bad**: Hamburger menu in top-left

### 2.2 Progressive Disclosure

**Problem**: Mobile screens are small. Showing everything = overwhelming chaos.

**Solution**: Hide complexity behind progressive layers.

**Example: Activity Card**

**Layer 0 (Default View)**:
```
┌─────────────────────────────────┐
│ 🍕 Dinner at Luigi's            │ ← Title only
│ 7:00 PM • $25/person            │ ← Time + cost
│ 👍 6 of 8 voted                 │ ← Quick status
└─────────────────────────────────┘
```

**Layer 1 (Tap to Expand)**:
```
┌─────────────────────────────────┐
│ 🍕 Dinner at Luigi's            │
│ 7:00 PM • $25/person            │
│ 👍 6 of 8 voted                 │
├─────────────────────────────────┤
│ 📍 123 Main St                  │ ← Location revealed
│ 📝 Best pizza in town!          │ ← Notes revealed
│ [View on Map] [Vote]            │ ← Actions revealed
└─────────────────────────────────┘
```

**Layer 2 (Tap "Vote")**:
```
┌─────────────────────────────────┐
│ Vote on Dinner at Luigi's       │
│                                 │
│ ⭕ I'm in!                      │
│ ⭕ Maybe                        │
│ ⭕ Can't make it                │
│                                 │
│ [Submit Vote]                   │
└─────────────────────────────────┘
```

**Benefits**:
- Default view is scannable (users see all activities at once)
- Details available when needed (tap to expand)
- Actions accessible but not cluttering (vote flows naturally)

### 2.3 One-Handed Interaction Priority

**80% of mobile use is one-handed** (commute, holding coffee, carrying luggage).

**Design Principles**:
1. **Bottom-anchored navigation** (not top hamburger menu)
2. **Floating Action Button (FAB)** for primary action (bottom-right corner)
3. **Swipe gestures** for secondary actions (swipe to delete activity)
4. **Large tap targets** (44×44px minimum, 56×56px preferred)
5. **Avoid top-right actions** (hardest to reach on iPhone)

**Thumb Heatmap** (iPhone SE, right-handed):
```
┌─────────────────────────┐
│ 🔴 🔴 🔴 🔴 🔴 🟠 🟠 🟠 │ ← Red: Very hard
│ 🔴 🟠 🟠 🟡 🟡 🟡 🟢 🟢 │ ← Orange: Hard
│ 🟠 🟠 🟡 🟡 🟡 🟢 🟢 🟢 │ ← Yellow: Moderate
│ 🟡 🟡 🟡 🟢 🟢 🟢 🟢 🟢 │ ← Green: Easy
│ 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 │
│ 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 │
└─────────────────────────┘
```

**Design Validation**: Place UI elements on heatmap. If primary action is in red/orange zone, redesign.

### 2.4 Speed Over Features

**User Expectation**: Mobile = fast. Desktop = feature-rich.

**TripOS Philosophy**:
- ✅ **Mobile**: Fast, focused, essential actions only
- ✅ **Desktop**: Same actions + power-user features (bulk edit, advanced filters)

**Example: Add Activity**

**Mobile Flow** (3 taps, 20 seconds):
1. Tap FAB "+" button
2. Type activity name
3. Tap "Add" (defaults: no time, no cost, current day)

**Desktop Flow** (same + enhancements):
1. Click "Add Activity" button
2. Form with all fields visible: name, time, cost, notes, category
3. Click "Add"
4. **Bonus**: Keyboard shortcuts (Cmd+A to add), batch import

**Why This Works**:
- Mobile users want speed ("Add 'Eiffel Tower' before I forget")
- Desktop users tolerate complexity (planning session, filling in details)
- Both flows coexist without compromising either

---

## 3. Design System

### 3.1 Typography Scale

**Implementation**: Tailwind CSS v4 with fluid typography.

**Mobile-Optimized Scale** (iPhone SE 375px):

| Element | Size | Line Height | Use Case |
|---------|------|-------------|----------|
| **Hero** | 32px | 1.2 | Trip title (max 1 line) |
| **H1** | 24px | 1.3 | Page titles |
| **H2** | 20px | 1.4 | Section headers |
| **H3** | 18px | 1.4 | Card headers |
| **Body Large** | 16px | 1.5 | Primary text |
| **Body** | 14px | 1.5 | Secondary text |
| **Caption** | 12px | 1.4 | Timestamps, metadata |
| **Tiny** | 10px | 1.3 | Badge labels |

**Desktop Scale** (1280px+):

| Element | Size | Difference |
|---------|------|------------|
| **Hero** | 48px | +50% |
| **H1** | 32px | +33% |
| **H2** | 24px | +20% |
| **H3** | 20px | +11% |
| **Body Large** | 18px | +13% |
| **Body** | 16px | +14% |
| **Caption** | 14px | +17% |

**Fluid Implementation** (Tailwind v4):
```css
/* app.css or global styles */
@theme {
  --font-size-hero: clamp(2rem, 5vw, 3rem); /* 32px → 48px */
  --font-size-h1: clamp(1.5rem, 4vw, 2rem); /* 24px → 32px */
  --font-size-h2: clamp(1.25rem, 3vw, 1.5rem); /* 20px → 24px */
  --font-size-body: clamp(0.875rem, 2vw, 1rem); /* 14px → 16px */
}
```

**Usage**:

```tsx
<h1 className="text-[--font-size-hero]">TripOS</h1>
<p className="text-[--font-size-body]">Welcome to group travel planning</p>
```

**Why Fluid Typography**:
- No breakpoint jumps (smooth scaling from 375px to 1920px)
- Automatically optimized for all devices
- Maintains proportions across screen sizes

### 3.2 Color System

**Primary Palette** (Blue: Travel, Trust, Sky):

| Color | Hex | Use Case |
|-------|-----|----------|
| **Primary 50** | `#EFF6FF` | Hover states |
| **Primary 500** | `#3B82F6` | Primary actions, links |
| **Primary 600** | `#2563EB` | Active states |
| **Primary 700** | `#1D4ED8` | Dark mode primary |

**Semantic Colors**:

| Color | Hex | Use Case |
|-------|-----|----------|
| **Success** | `#10B981` | Completed tasks, votes submitted |
| **Warning** | `#F59E0B` | Deadlines approaching |
| **Error** | `#EF4444` | Quorum failed, errors |
| **Info** | `#06B6D4` | Tips, notifications |

**Neutral Scale** (Gray for text, borders):

| Color | Hex | Use Case |
|-------|-----|----------|
| **Gray 50** | `#F9FAFB` | Background |
| **Gray 100** | `#F3F4F6` | Card backgrounds |
| **Gray 300** | `#D1D5DB` | Borders |
| **Gray 600** | `#4B5563` | Secondary text |
| **Gray 900** | `#111827` | Primary text |

**Dark Mode** (Auto-invert with semantic tokens):

```css
/* Light mode (default) */
:root {
  --color-bg-primary: #FFFFFF;
  --color-text-primary: #111827;
  --color-border: #D1D5DB;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #111827;
    --color-text-primary: #F9FAFB;
    --color-border: #374151;
  }
}
```

**Accessibility**: All color combinations meet WCAG AAA contrast ratio (7:1).

### 3.3 Spacing Scale

**Implementation**: Tailwind's 4px base unit scale.

**Mobile-Optimized Spacing**:

| Token | Size | Use Case |
|-------|------|----------|
| `space-1` | 4px | Icon padding |
| `space-2` | 8px | Tight padding (badges) |
| `space-3` | 12px | Compact spacing (between elements) |
| `space-4` | 16px | Default padding (cards, buttons) |
| `space-6` | 24px | Section spacing |
| `space-8` | 32px | Page margins |
| `space-12` | 48px | Large gaps (between sections) |

**Touch Target Padding**:
```tsx
// Minimum touch target: 44×44px
<button className="p-3 min-h-[44px] min-w-[44px]">
  {/* Icon: 24×24px + padding 10px each side = 44×44px */}
  <Icon size={24} />
</button>
```

**Consistent Rhythm**:

- **Page margins**: 16px mobile, 24px tablet, 32px desktop
- **Card padding**: 16px mobile, 20px tablet, 24px desktop
- **Stack spacing**: 12px between related elements, 24px between sections

### 3.4 iOS Safe Areas

**Critical for iPhone**: Modern iPhones have notches, Dynamic Island, and home indicator that **overlap content** if not handled.

**Visual Reference (iPhone 15 Pro)**:

```text
┌─────────────────────────────┐
│ ●●● Dynamic Island ●●●      │ ← Top safe area (59px)
├─────────────────────────────┤
│                             │
│  [Safe content area]        │ ← Content renders here
│                             │
├─────────────────────────────┤
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━  │ ← Home indicator (34px)
└─────────────────────────────┘
```

**Implementation** (CSS environment variables):

```css
/* Global layout - respect safe areas */
.app-container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Fixed header - account for notch */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding-top: env(safe-area-inset-top);
  background: white;
  z-index: 10;
}

/* Fixed tab bar - account for home indicator */
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: env(safe-area-inset-bottom);
  background: white;
  z-index: 20;
}

/* FAB - position above home indicator */
.fab {
  position: fixed;
  bottom: calc(16px + env(safe-area-inset-bottom));
  right: 16px;
  z-index: 30;
}
```

**Tailwind v4 Utilities**:

```css
/* Define safe area utilities */
@theme {
  --spacing-safe-top: env(safe-area-inset-top);
  --spacing-safe-bottom: env(safe-area-inset-bottom);
  --spacing-safe-left: env(safe-area-inset-left);
  --spacing-safe-right: env(safe-area-inset-right);
}
```

**Usage in Components**:

```tsx
// Layout with safe areas
<div className="min-h-screen pt-[--spacing-safe-top] pb-[--spacing-safe-bottom]">
  <Header />
  <main>{children}</main>
  <TabBar />
</div>

// Fixed header
<header className="fixed top-0 inset-x-0 pt-[--spacing-safe-top] bg-white z-10">
  <div className="h-14 px-4 flex items-center">
    <h1>TripOS</h1>
  </div>
</header>

// Fixed tab bar with home indicator spacing
<nav className="fixed bottom-0 inset-x-0 pb-[--spacing-safe-bottom] bg-white z-20">
  <div className="h-16 flex items-center justify-around">
    {tabs.map(tab => <TabButton key={tab.id} {...tab} />)}
  </div>
</nav>

// FAB above home indicator
<button className="fixed bottom-[calc(16px+var(--spacing-safe-bottom))] right-4 z-30">
  <PlusIcon />
</button>
```

**PWA Viewport Meta** (required for safe areas to work):

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

**Key Point**: `viewport-fit=cover` enables safe area insets. Without it, iOS defaults to `viewport-fit=auto` which letterboxes the app.

**Testing Safe Areas**:

- **Device**: Test on real iPhone with notch (iPhone X+)
- **Simulator**: iOS Simulator → Hardware → iPhone 15 Pro
- **Chrome DevTools**: Limited support (doesn't show safe areas accurately)

### 3.6 Border Radius

**Scale**:

| Token | Size | Use Case |
|-------|------|----------|
| `rounded-sm` | 4px | Badges, tags |
| `rounded` | 8px | Buttons, inputs |
| `rounded-md` | 12px | Cards |
| `rounded-lg` | 16px | Modals, sheets |
| `rounded-full` | 9999px | Pills, avatars, FAB |

**Design Principle**: Larger elements = larger border radius (visual hierarchy).

### 3.7 Elevation (Shadows)

**Mobile-First Approach**: Use shadows sparingly (cluttered on small screens).

| Level | Use Case | Tailwind Class |
|-------|----------|----------------|
| **None** | Flat cards, inline elements | `shadow-none` |
| **Subtle** | Resting cards | `shadow-sm` |
| **Medium** | Elevated cards (active) | `shadow-md` |
| **High** | Modals, sheets | `shadow-lg` |
| **Floating** | FAB, tooltips | `shadow-xl` |

**Dark Mode**: Reduce shadow opacity (less visible on dark backgrounds).

```css
/* Light mode */
.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .shadow-md {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4); /* Stronger shadow */
  }
}
```

---

## 4. Component Library

### 4.1 Button Component

**Hierarchy**: Primary > Secondary > Tertiary > Ghost.

**Implementation**:

```tsx
// components/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Base styles (all buttons)
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300',
        tertiary: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
        ghost: 'text-primary-500 hover:bg-primary-50 active:bg-primary-100',
        danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
      },
      size: {
        md: 'h-11 px-4 text-base', // 44px height (min touch target)
        lg: 'h-14 px-6 text-lg', // 56px height (comfortable touch)
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export function Button({
  variant,
  size,
  fullWidth,
  isLoading,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}
```

**Mobile Best Practices**:

- ✅ **Minimum height**: 44px (all sizes meet this requirement)
- ✅ **Full-width on mobile**: `<Button fullWidth>` on small screens for primary actions
- ✅ **Loading state**: Disable + spinner (prevent double-submit)
- ✅ **Active state**: Visual feedback on tap (`:active` styles)
- ⚠️ **No sm size**: Removed to enforce 44px minimum touch target (WCAG 2.1 requirement)

**Usage Example**:
```tsx
// Mobile: Full-width, large
<div className="md:hidden">
  <Button size="lg" fullWidth onClick={handleVote}>
    Submit Vote
  </Button>
</div>

// Desktop: Auto-width, medium
<div className="hidden md:block">
  <Button size="md" onClick={handleVote}>
    Submit Vote
  </Button>
</div>
```

### 4.2 Input Component

**Touch-Optimized Inputs**:

```tsx
// components/Input.tsx
const inputVariants = cva(
  'w-full rounded-lg border border-gray-300 bg-white px-4 text-base transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50',
  {
    variants: {
      size: {
        md: 'h-11', // 44px height (min touch target)
        lg: 'h-14', // 56px height (comfortable mobile)
      },
      hasError: {
        true: 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, className, ...props }: InputProps) {
  const id = useId();

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        id={id}
        className={cn(inputVariants({ hasError: !!error }), className)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        {...props}
      />

      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p id={`${id}-helper`} className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
```

**Mobile Keyboard Optimization**:

```tsx
// Numeric input → show number keyboard on mobile
<Input
  type="number"
  inputMode="decimal" // iOS shows decimal keyboard
  pattern="[0-9]*" // Android shows number keyboard
  label="Budget (per person)"
/>

// Email input → show email keyboard
<Input
  type="email"
  inputMode="email" // Shows @ and .com shortcuts
  label="Invite by email"
/>

// URL input → show URL keyboard
<Input
  type="url"
  inputMode="url" // Shows .com and / shortcuts
  label="Activity link"
/>
```

**Why This Matters**:
- `inputMode` triggers correct mobile keyboard
- Reduces user errors (typing letters when numbers expected)
- Faster input (one tap for `@` instead of switching keyboards)

### 4.3 Card Component

**Anatomy**:
```
┌─────────────────────────────────┐
│ [Header]                        │ ← Optional title + action
├─────────────────────────────────┤
│                                 │
│ [Content]                       │ ← Main content area
│                                 │
├─────────────────────────────────┤
│ [Footer]                        │ ← Optional actions/metadata
└─────────────────────────────────┘
```

**Implementation**:

```tsx
// components/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isInteractive?: boolean;
}

export function Card({ children, className, onClick, isInteractive }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-md bg-white p-4 shadow-sm',
        isInteractive && 'cursor-pointer transition-shadow hover:shadow-md active:shadow-lg',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-3 flex items-center justify-between', className)}>{children}</div>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('space-y-2', className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mt-4 flex items-center justify-between border-t border-gray-100 pt-3', className)}>{children}</div>;
}
```

**Usage Example** (Activity Card):

```tsx
<Card isInteractive onClick={() => setExpanded(!expanded)}>
  <CardHeader>
    <h3 className="text-h3 font-semibold">Dinner at Luigi's</h3>
    <Badge variant="success">6 of 8 voted</Badge>
  </CardHeader>

  <CardContent>
    <div className="flex items-center gap-2 text-gray-600">
      <ClockIcon size={16} />
      <span>7:00 PM</span>
      <span>•</span>
      <DollarIcon size={16} />
      <span>$25/person</span>
    </div>

    {expanded && (
      <>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPinIcon size={16} />
          <span>123 Main St, Rome</span>
        </div>
        <p className="text-sm text-gray-600">Best pizza in town!</p>
      </>
    )}
  </CardContent>

  <CardFooter>
    <Button variant="ghost" size="md">View on Map</Button>
    <Button size="md">Vote</Button>
  </CardFooter>
</Card>
```

**Mobile Optimization**:
- ✅ **Tap to expand**: Progressive disclosure (collapsed by default)
- ✅ **44px min height**: Entire card is tappable
- ✅ **Visual feedback**: Active state on tap (shadow change)
- ✅ **Swipe actions**: Left/right swipe for secondary actions (delete, edit)

### 4.4 Bottom Sheet Component

**Why Bottom Sheets**: Mobile pattern for modals (easier than center modals on small screens).

**Anatomy**:
```
┌─────────────────────────────────┐
│                                 │
│ [Backdrop - 50% opacity]        │
│                                 │
│  ┌───────────────────────────┐  │
│  │ [Handle - drag to dismiss]│  │ ← Drag handle
│  ├───────────────────────────┤  │
│  │ [Header]                  │  │ ← Title + close
│  ├───────────────────────────┤  │
│  │                           │  │
│  │ [Content - scrollable]    │  │ ← Main content
│  │                           │  │
│  ├───────────────────────────┤  │
│  │ [Footer - fixed]          │  │ ← Actions
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

**Implementation** (using Radix UI Dialog + Framer Motion):

```tsx
// components/BottomSheet.tsx
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { useRef } from 'react';

interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function BottomSheet({ open, onOpenChange, title, children, footer }: BottomSheetProps) {
  const dragControls = useDragControls();
  const isDragging = useRef(false);

  const handleDragEnd = (_: any, info: { offset: { y: number } }) => {
    isDragging.current = false;

    // Only close if dragged down significantly
    if (info.offset.y > 100) {
      // Use the same onOpenChange callback for consistency
      onOpenChange(false);
    }
  };

  const handleDragStart = () => {
    isDragging.current = true;
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {/* Backdrop */}
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/50 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  // Only allow backdrop click if not dragging
                  if (!isDragging.current) {
                    onOpenChange(false);
                  }
                }}
              />
            </Dialog.Overlay>

            {/* Sheet */}
            <Dialog.Content asChild>
              <motion.div
                className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-white shadow-xl max-h-[90vh] flex flex-col"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                drag="y"
                dragControls={dragControls}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.5 }}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                {/* Drag Handle */}
                <div className="flex justify-center py-3 cursor-grab active:cursor-grabbing">
                  <div className="w-12 h-1 bg-gray-300 rounded-full" />
                </div>

                {/* Header */}
                {title && (
                  <div className="px-4 pb-4 border-b border-gray-100">
                    <Dialog.Title className="text-h2 font-semibold">
                      {title}
                    </Dialog.Title>
                  </div>
                )}

                {/* Content (scrollable) */}
                <div className="flex-1 overflow-y-auto p-4">
                  {children}
                </div>

                {/* Footer (fixed) */}
                {footer && (
                  <div className="border-t border-gray-100 p-4">
                    {footer}
                  </div>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
```

**Critical Implementation Notes**:

- **State Sync**: Both drag and backdrop click use same `onOpenChange` callback (prevents desync)
- **Drag Flag**: `isDragging` ref prevents backdrop click during drag gesture
- **Single Source of Truth**: `open` prop controls visibility, both close methods update it consistently

**Usage Example** (Vote Sheet):

```tsx
const [voteSheetOpen, setVoteSheetOpen] = useState(false);

<BottomSheet
  open={voteSheetOpen}
  onOpenChange={setVoteSheetOpen}
  title="Vote on Dinner at Luigi's"
  footer={
    <Button fullWidth size="lg" onClick={handleSubmitVote}>
      Submit Vote
    </Button>
  }
>
  <RadioGroup value={vote} onValueChange={setVote}>
    <RadioGroup.Item value="yes">I'm in!</RadioGroup.Item>
    <RadioGroup.Item value="maybe">Maybe</RadioGroup.Item>
    <RadioGroup.Item value="no">Can't make it</RadioGroup.Item>
  </RadioGroup>
</BottomSheet>
```

**Why This Works**:
- ✅ **Thumb-friendly**: Close button at top, action button at bottom
- ✅ **Intuitive dismiss**: Drag down to close (iOS pattern)
- ✅ **Accessible**: Keyboard support, focus trap, screen reader friendly
- ✅ **Performant**: GPU-accelerated animation (Framer Motion)

### 4.5 Floating Action Button (FAB)

**Purpose**: Primary action always accessible (no scrolling needed).

**Implementation**:

```tsx
// components/FAB.tsx
interface FABProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function FAB({ icon, label, onClick, variant = 'primary' }: FABProps) {
  return (
    <button
      className={cn(
        'fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-transform active:scale-95 md:bottom-6',
        variant === 'primary' && 'bg-primary-500 text-white hover:bg-primary-600',
        variant === 'secondary' && 'bg-white text-gray-900 hover:bg-gray-50'
      )}
      onClick={onClick}
      aria-label={label}
    >
      {icon}
    </button>
  );
}

// Extended FAB (with label)
export function ExtendedFAB({ icon, label, onClick }: FABProps) {
  return (
    <button
      className="fixed bottom-20 right-4 z-30 flex h-14 items-center gap-2 rounded-full bg-primary-500 px-6 text-white shadow-xl transition-transform hover:bg-primary-600 active:scale-95 md:bottom-6"
      onClick={onClick}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}
```

**Usage Example**:

```tsx
// Trip page: Add activity FAB
<FAB
  icon={<PlusIcon size={24} />}
  label="Add activity"
  onClick={() => setAddActivitySheetOpen(true)}
/>

// Extended FAB (when space allows)
<ExtendedFAB
  icon={<PlusIcon size={20} />}
  label="Add Activity"
  onClick={() => setAddActivitySheetOpen(true)}
/>
```

**Positioning Rules**:
- **Mobile**: `bottom-20` (above tab bar at `bottom-0`)
- **Desktop**: `bottom-6` (no tab bar, closer to edge)
- **Right-aligned**: `right-4` (thumb zone for right-handed users)
- **Z-index**: `z-30` (above cards `z-10`, below modals `z-40`)

**Accessibility**:
- ✅ **aria-label**: Screen reader announcement
- ✅ **Keyboard accessible**: `Tab` to focus, `Enter` to activate
- ✅ **Active state**: Visual feedback on tap (scale down)

### 4.6 Tab Bar Navigation

**Pattern**: Bottom-anchored navigation (iOS/Android standard).

**Implementation**:

```tsx
// components/TabBar.tsx
interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'trips', label: 'Trips', icon: MapIcon },
  { id: 'activity', label: 'Activity', icon: BellIcon },
  { id: 'profile', label: 'Profile', icon: UserIcon },
];

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 w-full h-full transition-colors',
                isActive ? 'text-primary-500' : 'text-gray-400 hover:text-gray-600'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
```

**Layout Adjustment** (account for tab bar):

```tsx
// Layout component
<div className="min-h-screen pb-16 md:pb-0">
  {/* pb-16 on mobile = 64px tab bar height */}
  {/* pb-0 on desktop = no tab bar */}

  <main>{children}</main>

  <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
</div>
```

**Best Practices**:

- ✅ **3-5 tabs maximum**: More = overwhelming on mobile
- ✅ **Always visible**: Don't hide tab bar on scroll (consistent navigation)
- ✅ **Active state**: Clear visual feedback (color + bold icon)
- ✅ **Desktop**: Hide tab bar, show sidebar instead (`md:hidden` on TabBar)

### 4.7 Toast Notifications

**Pattern**: Non-intrusive feedback for success/error states.

**Implementation** (using `sonner`):

```bash
npm install sonner
```

```tsx
// App.tsx - Setup toast provider
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <YourApp />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            marginTop: 'env(safe-area-inset-top)',
          },
        }}
      />
    </>
  );
}

// Usage in components
import { toast } from 'sonner';

function VoteButton() {
  const handleVote = async () => {
    try {
      await submitVote();
      toast.success('Vote submitted!');
    } catch (error) {
      toast.error('Failed to submit vote');
    }
  };

  return <Button onClick={handleVote}>Submit Vote</Button>;
}
```

**Why Sonner**:

- ✅ Minimal bundle size (~3KB)
- ✅ Mobile-optimized (respects safe areas)
- ✅ Swipe to dismiss
- ✅ Keyboard accessible

### 4.8 Loading Skeletons

**Pattern**: Show content structure while data loads (better than blank screen or spinner).

**Implementation**:

```tsx
// components/Skeleton.tsx
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
      {...props}
    />
  );
}

// Usage: Activity card skeleton
function ActivityCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" /> {/* Title */}
        <Skeleton className="h-4 w-16" /> {/* Badge */}
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}

// Usage: While loading
function TripPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['activities', tripId],
    queryFn: fetchActivities,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <ActivityCardSkeleton />
        <ActivityCardSkeleton />
        <ActivityCardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.activities.map(activity => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </div>
  );
}
```

### 4.9 Empty States

**Pattern**: Guide users when no content exists.

**Implementation**:

```tsx
// components/EmptyState.tsx
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4 text-gray-400">
        {icon}
      </div>
      <h3 className="text-h3 font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-body text-gray-600 mb-6 max-w-sm">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Usage: No trips yet
function TripsPage() {
  const { data } = useQuery({
    queryKey: ['trips'],
    queryFn: fetchTrips,
  });

  if (data?.trips.length === 0) {
    return (
      <EmptyState
        icon={<MapIcon size={48} />}
        title="No trips yet"
        description="Create your first trip to start planning your next adventure with friends."
        action={{
          label: 'Create Trip',
          onClick: () => setCreateTripOpen(true),
        }}
      />
    );
  }

  return <TripList trips={data.trips} />;
}
```

### 4.10 Form Validation

**Pattern**: Real-time validation with clear error messages.

**Implementation** (using React Hook Form + Zod):

```bash
npm install react-hook-form zod @hookform/resolvers
```

```tsx
// schemas/trip.ts
import { z } from 'zod';

export const createTripSchema = z.object({
  name: z.string()
    .min(1, 'Trip name is required')
    .max(100, 'Trip name must be less than 100 characters'),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  endDate: z.date({
    required_error: 'End date is required',
  }),
}).refine(data => data.endDate >= data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

// components/CreateTripForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function CreateTripForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(createTripSchema),
  });

  const onSubmit = async (data) => {
    await createTrip(data);
    toast.success('Trip created!');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Trip Name"
        {...register('name')}
        error={errors.name?.message}
        placeholder="e.g., Japan 2026"
      />

      <Input
        label="Start Date"
        type="date"
        {...register('startDate', { valueAsDate: true })}
        error={errors.startDate?.message}
      />

      <Input
        label="End Date"
        type="date"
        {...register('endDate', { valueAsDate: true })}
        error={errors.endDate?.message}
      />

      <Button type="submit" fullWidth size="lg">
        Create Trip
      </Button>
    </form>
  );
}
```

### 4.11 Dark Mode Support

**Pattern**: Respect system preference, allow manual toggle.

**Implementation**:

```tsx
// hooks/useDarkMode.ts
import { useEffect, useState } from 'react';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';

    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Apply dark mode class to <html>
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Save preference
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  return { darkMode, setDarkMode };
}

// Usage in component
function ThemeToggle() {
  const { darkMode, setDarkMode } = useDarkMode();

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle dark mode"
    >
      {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
    </button>
  );
}
```

**Dark Mode CSS** (Tailwind v4):

```css
/* Global dark mode colors */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #111827;
    --color-text-primary: #F9FAFB;
    --color-border: #374151;
  }
}

/* Manual override via .dark class */
.dark {
  --color-bg-primary: #111827;
  --color-text-primary: #F9FAFB;
  --color-border: #374151;
}
```

**Usage in Components**:

```tsx
// Automatically adapts to dark mode
<div className="bg-[--color-bg-primary] text-[--color-text-primary]">
  <Card className="border-[--color-border]">
    <h2>Content adapts to theme</h2>
  </Card>
</div>
```

---

## 5. Touch Interaction Patterns

### 5.1 Tap Targets (44×44px Minimum)

**WCAG 2.1 Guideline**: Minimum touch target size is 44×44px (9mm × 9mm physical).

**Implementation**:

```tsx
// ❌ BAD: Too small (icon-only button)
<button className="p-1">
  <TrashIcon size={16} /> {/* 16×16 + 4px padding = 24×24 total */}
</button>

// ✅ GOOD: Minimum size
<button className="p-2.5 min-h-[44px] min-w-[44px]">
  <TrashIcon size={20} /> {/* 20×20 + 12px padding each side = 44×44 */}
</button>

// ✅ BETTER: Comfortable size
<button className="p-4 min-h-[56px]">
  <TrashIcon size={24} /> {/* 24×24 + 16px padding each side = 56×56 */}
</button>
```

**Audit Tool** (Chrome DevTools):
1. Open DevTools → Settings → Experiments → Enable "Show touch target outline"
2. Inspect mobile view → See visual overlay of touch targets
3. Red outline = below 44×44px (fix it!)

### 5.2 Swipe Gestures

**Pattern**: Swipe left to reveal delete/edit actions (iOS Mail pattern).

**Implementation** (using Framer Motion):

```tsx
// components/SwipeableCard.tsx
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface SwipeableCardProps {
  children: React.ReactNode;
  onDelete?: () => void;
  onEdit?: () => void;
}

export function SwipeableCard({ children, onDelete, onEdit }: SwipeableCardProps) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0], [1, 0]);

  return (
    <div className="relative overflow-hidden">
      {/* Background actions (revealed on swipe) */}
      <motion.div
        className="absolute inset-y-0 right-0 flex items-center gap-2 pr-4"
        style={{ opacity }}
      >
        {onEdit && (
          <button
            className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white"
            onClick={onEdit}
          >
            <EditIcon size={20} />
          </button>
        )}
        {onDelete && (
          <button
            className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white"
            onClick={onDelete}
          >
            <TrashIcon size={20} />
          </button>
        )}
      </motion.div>

      {/* Card (swipeable) */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={{ left: 0.2, right: 0 }}
        style={{ x }}
        onDragEnd={(_, info) => {
          // Snap to open if dragged >50px
          if (info.offset.x < -50) {
            x.set(-100);
          } else {
            x.set(0);
          }
        }}
        className="bg-white"
      >
        {children}
      </motion.div>
    </div>
  );
}
```

**Usage Example**:

```tsx
<SwipeableCard
  onEdit={() => setEditActivitySheetOpen(true)}
  onDelete={() => handleDeleteActivity(activity.id)}
>
  <Card>
    <CardHeader>
      <h3>Dinner at Luigi's</h3>
    </CardHeader>
  </Card>
</SwipeableCard>
```

**Why This Works**:
- ✅ **Intuitive**: Familiar pattern from iOS Mail, WhatsApp
- ✅ **Space-efficient**: No permanent delete button cluttering UI
- ✅ **Discoverable**: Slight drag reveals actions (visual affordance)
- ✅ **Safe**: Requires deliberate action (not accidental tap)

### 5.3 Pull to Refresh

**Pattern**: Pull down on list to refresh data (native app standard).

**⚠️ WARNING**: Custom pull-to-refresh implementations are **complex** and easy to break:
- Transform on `document.body` breaks fixed-position elements (tab bar, FAB)
- Conflicts with Chrome Android's native pull-to-refresh gesture
- Requires careful scroll container management

**Recommended Approach**: Use a battle-tested library.

**Implementation** (using `react-simple-pull-to-refresh`):

```bash
npm install react-simple-pull-to-refresh
```

```tsx
// components/PullToRefresh.tsx
import PullToRefresh from 'react-simple-pull-to-refresh';

interface PullToRefreshWrapperProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefreshWrapper({ onRefresh, children }: PullToRefreshWrapperProps) {
  return (
    <PullToRefresh
      onRefresh={onRefresh}
      pullingContent={
        <div className="flex justify-center py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary-500" />
        </div>
      }
      refreshingContent={
        <div className="flex justify-center py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary-500" />
        </div>
      }
      pullDownThreshold={80}
      maxPullDownDistance={95}
      resistance={2}
    >
      {children}
    </PullToRefresh>
  );
}
```

**Usage Example**:

```tsx
function TripList() {
  const { data, refetch } = useQuery({
    queryKey: ['trips'],
    queryFn: fetchTrips,
  });

  return (
    <PullToRefreshWrapper onRefresh={() => refetch()}>
      <div className="space-y-4">
        {data?.trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </PullToRefreshWrapper>
  );
}
```

**Why Use a Library**:
- ✅ Handles edge cases (scroll containers, touch event conflicts, iOS Safari quirks)
- ✅ Doesn't break fixed-position elements
- ✅ Works with nested scroll containers
- ✅ Customizable spinner and animations
- ✅ Maintained and tested across devices

**Alternative Libraries**:
- `react-pull-to-refresh` - More features, heavier bundle
- `use-pull-to-refresh` - Hook-based, lightweight

### 5.4 Long Press

**Pattern**: Long press to reveal context menu (native mobile pattern).

**Implementation**:

```tsx
// hooks/useLongPress.ts
import { useCallback, useRef } from 'react';

interface UseLongPressOptions {
  onLongPress: () => void;
  delay?: number;
}

export function useLongPress({ onLongPress, delay = 500 }: UseLongPressOptions) {
  const timeout = useRef<NodeJS.Timeout>();
  const preventMouseEvents = useRef(false);

  const start = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    // Prevent mouse events if touch was used (touch devices fire both)
    if (event.type === 'mousedown' && preventMouseEvents.current) {
      return;
    }

    timeout.current = setTimeout(onLongPress, delay);
  }, [onLongPress, delay]);

  const clear = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }, []);

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    preventMouseEvents.current = true;
    start(event);
  }, [start]);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    preventMouseEvents.current = false;
    start(event);
  }, [start]);

  return {
    onMouseDown: handleMouseDown,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: handleTouchStart,
    onTouchEnd: clear,
  };
}
```

**Why This Works**:

- Touch events set `preventMouseEvents` flag to suppress synthetic mouse events
- Mouse events clear the flag (desktop-only interaction)
- Prevents double-firing on touch devices while maintaining desktop support

**Usage Example**:

```tsx
function ActivityCard({ activity }: { activity: Activity }) {
  const [contextMenuOpen, setContextMenuOpen] = useState(false);

  const longPressProps = useLongPress({
    onLongPress: () => setContextMenuOpen(true),
  });

  return (
    <Card {...longPressProps}>
      <h3>{activity.title}</h3>

      {contextMenuOpen && (
        <ContextMenu
          options={[
            { label: 'Edit', onClick: () => {} },
            { label: 'Delete', onClick: () => {} },
            { label: 'Move to...', onClick: () => {} },
          ]}
        />
      )}
    </Card>
  );
}
```

**Why This Works**:
- ✅ **Space-efficient**: No visible "⋯" menu button needed
- ✅ **Power user feature**: Advanced users discover it, casual users don't need it
- ✅ **Native feel**: Same interaction as iOS/Android long press menus

### 5.5 Haptic Feedback (PWA)

**⚠️ CRITICAL LIMITATION**: `navigator.vibrate()` **does not work on iOS Safari** (Apple's policy restricts vibration API). Since iPhone is our primary target platform, haptic feedback via web APIs is **not viable** for TripOS.

**Alternative Strategies**:

1. **Visual feedback only** (works everywhere):

   ```tsx
   // Use scale animations instead of haptics
   <motion.button
     whileTap={{ scale: 0.95 }}
     onClick={handleVote}
   >
     Submit Vote
   </motion.button>
   ```

2. **Android-only haptics** (if building native wrapper):

   ```tsx
   // Only works on Android Chrome, silently fails on iOS
   export const haptics = {
     medium: () => {
       // Works: Android Chrome, Firefox Android
       // Fails silently: iOS Safari, iOS Chrome, iOS Firefox
       if ('vibrate' in navigator) {
         navigator.vibrate(20);
       }
     },
   };
   ```

3. **Native haptics** (requires React Native or Capacitor):

   ```tsx
   // Requires native bridge (Capacitor Haptics plugin)
   import { Haptics, ImpactStyle } from '@capacitor/haptics';

   const hapticsNative = {
     light: () => Haptics.impact({ style: ImpactStyle.Light }),
     medium: () => Haptics.impact({ style: ImpactStyle.Medium }),
     heavy: () => Haptics.impact({ style: ImpactStyle.Heavy }),
   };
   ```

**Recommendation for TripOS**:

- **Phase 1-4 (PWA)**: Skip haptics entirely, rely on visual feedback
- **Phase 5+ (Native Mobile)**: Implement proper haptics via Capacitor

**Why Visual Feedback is Sufficient**:

- ✅ Works on all devices (iOS, Android, desktop)
- ✅ Provides instant confirmation (scale, color change, animation)
- ✅ No platform-specific code
- ✅ Respects `prefers-reduced-motion` automatically (via Framer Motion)

---

## 6. Responsive Patterns

### 6.1 Breakpoint Strategy

**Tailwind v4 Breakpoints**:

| Breakpoint | Width | Device | Strategy |
|------------|-------|--------|----------|
| `xs` | 0-639px | Mobile | Default design (design for this first) |
| `sm` | 640px+ | Large phones | Minor adjustments |
| `md` | 768px+ | Tablets | Layout shifts (sidebar appears) |
| `lg` | 1024px+ | Laptops | Multi-column layouts |
| `xl` | 1280px+ | Desktops | Max-width containers |
| `2xl` | 1536px+ | Large monitors | Extra padding |

**Design Approach**:
1. **Design mobile first** (375px iPhone SE)
2. **Test on tablet** (768px iPad)
3. **Enhance for desktop** (1280px+)

**Anti-pattern**: Don't design desktop-first and cram into mobile (results in cluttered mobile UI).

### 6.2 Layout Patterns

#### Pattern 1: Stack → Sidebar

**Mobile** (default):
```
┌─────────────────────────┐
│ [Header]                │
├─────────────────────────┤
│                         │
│ [Content - full width]  │
│                         │
└─────────────────────────┘
```

**Desktop** (md+):
```
┌────────────┬────────────────────────────┐
│            │ [Header]                   │
│ [Sidebar]  ├────────────────────────────┤
│            │                            │
│            │ [Content]                  │
│            │                            │
└────────────┴────────────────────────────┘
```

**Implementation**:

```tsx
<div className="flex min-h-screen flex-col md:flex-row">
  {/* Sidebar: hidden on mobile, visible on desktop */}
  <aside className="hidden md:flex md:w-64 md:flex-col border-r border-gray-200">
    <Navigation />
  </aside>

  {/* Main content */}
  <main className="flex-1">
    <Header />
    <div className="p-4 md:p-6 lg:p-8">{children}</div>
  </main>

  {/* Tab bar: visible on mobile, hidden on desktop */}
  <TabBar className="md:hidden" />
</div>
```

#### Pattern 2: Single Column → Multi-Column

**Mobile** (default):
```
┌─────────────────────────┐
│ [Card 1]                │
├─────────────────────────┤
│ [Card 2]                │
├─────────────────────────┤
│ [Card 3]                │
└─────────────────────────┘
```

**Desktop** (lg+):
```
┌───────────────┬───────────────┬───────────────┐
│ [Card 1]      │ [Card 2]      │ [Card 3]      │
└───────────────┴───────────────┴───────────────┘
```

**Implementation**:

```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {trips.map((trip) => (
    <TripCard key={trip.id} trip={trip} />
  ))}
</div>
```

**Why This Works**:
- Mobile: Single column = easy to scan vertically
- Desktop: Multi-column = use horizontal space, see more at once

#### Pattern 3: Bottom Sheet → Modal

**Mobile**: Bottom sheet (easier to dismiss on small screens)

**Desktop**: Center modal (traditional desktop pattern)

**Implementation**:

```tsx
function ActionDialog({ open, onOpenChange, children }: DialogProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <BottomSheet open={open} onOpenChange={onOpenChange}>
        {children}
      </BottomSheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">{children}</DialogContent>
    </Dialog>
  );
}
```

### 6.3 Typography Scaling

**Fluid Typography** (automatically scales between breakpoints):

```css
/* app.css or global styles - Tailwind v4 CSS-first config */
@theme {
  /* Mobile (375px) → Desktop (1280px) */
  --font-size-hero: clamp(2rem, 5vw, 3rem); /* 32px → 48px */
  --font-size-h1: clamp(1.5rem, 4vw, 2rem); /* 24px → 32px */
  --font-size-h2: clamp(1.25rem, 3vw, 1.5rem); /* 20px → 24px */
  --font-size-h3: clamp(1.125rem, 2.5vw, 1.25rem); /* 18px → 20px */
  --font-size-body: clamp(0.875rem, 2vw, 1rem); /* 14px → 16px */
}
```

**Usage**:

```tsx
<h1 className="text-[--font-size-hero]">TripOS</h1>
{/* Automatically scales from 32px (mobile) to 48px (desktop) */}
```

**Why This Works**:
- No breakpoint jumps (smooth scaling)
- Automatically optimized for all screen sizes
- Less CSS to maintain

### 6.4 Spacing Scaling

**Container Padding** (responsive):

```tsx
<div className="px-4 md:px-6 lg:px-8">
  {/* Mobile: 16px padding */}
  {/* Tablet: 24px padding */}
  {/* Desktop: 32px padding */}
</div>
```

**Stack Spacing** (responsive):

```tsx
<div className="space-y-4 md:space-y-6 lg:space-y-8">
  {/* Mobile: 16px gaps */}
  {/* Tablet: 24px gaps */}
  {/* Desktop: 32px gaps */}
</div>
```

**Grid Gaps** (responsive):

```tsx
<div className="grid gap-4 md:gap-6 lg:gap-8">
  {/* Mobile: 16px gaps */}
  {/* Tablet: 24px gaps */}
  {/* Desktop: 32px gaps */}
</div>
```

---

## 7. Navigation Architecture

### 7.1 Mobile Navigation Pattern

**Primary Navigation**: Bottom tab bar (3-5 tabs)

**Secondary Navigation**: Top header with back button

**Tertiary Navigation**: Within-page tabs or segmented control

**Architecture**:
```
┌─────────────────────────────────┐
│ [← Back]  [Title]  [Actions]    │ ← Header (secondary nav)
├─────────────────────────────────┤
│                                 │
│ [Content]                       │
│                                 │
├─────────────────────────────────┤
│ [Trips] [Activity] [Profile]    │ ← Tab bar (primary nav)
└─────────────────────────────────┘
```

**Implementation**:

```tsx
// Layout with nested navigation
<div className="min-h-screen pb-16">
  {/* Secondary nav: Header with back button */}
  <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
    <div className="flex items-center h-14 px-4">
      {showBackButton && (
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ChevronLeftIcon size={24} />
        </button>
      )}
      <h1 className="text-h1 font-semibold">{title}</h1>
    </div>
  </header>

  {/* Content */}
  <main className="p-4">{children}</main>

  {/* Primary nav: Tab bar */}
  <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
</div>
```

### 7.2 Desktop Navigation Pattern

**Primary Navigation**: Sidebar (always visible)

**Secondary Navigation**: Top header with breadcrumbs

**Tertiary Navigation**: Within-page tabs

**Architecture**:
```
┌────────────┬────────────────────────────────────┐
│            │ [Breadcrumbs]  [User Menu]         │ ← Header
│            ├────────────────────────────────────┤
│ [Logo]     │                                    │
│            │                                    │
│ [Trips]    │ [Content]                          │
│ [Activity] │                                    │
│ [Profile]  │                                    │
│            │                                    │
└────────────┴────────────────────────────────────┘
```

**Implementation**:

```tsx
// Desktop layout with sidebar
<div className="flex min-h-screen">
  {/* Sidebar (primary nav) */}
  <aside className="hidden md:flex md:w-64 md:flex-col border-r border-gray-200">
    <div className="p-6">
      <Logo />
    </div>
    <nav className="flex-1 space-y-1 px-3">
      <NavLink href="/trips" icon={MapIcon}>Trips</NavLink>
      <NavLink href="/activity" icon={BellIcon}>Activity</NavLink>
      <NavLink href="/profile" icon={UserIcon}>Profile</NavLink>
    </nav>
  </aside>

  {/* Main content */}
  <div className="flex-1">
    {/* Header (secondary nav) */}
    <header className="border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-6 h-16">
        <Breadcrumbs items={breadcrumbs} />
        <UserMenu />
      </div>
    </header>

    {/* Content */}
    <main className="p-6 lg:p-8">{children}</main>
  </div>
</div>
```

### 7.3 Breadcrumb Navigation

**Desktop Only**: Breadcrumbs for deep navigation hierarchy.

**Example**:
```
Home > Trips > Japan 2026 > Day 3 > Dinner at Luigi's
```

**Implementation**:

```tsx
interface BreadcrumbItem {
  label: string;
  href: string;
}

function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="hidden md:flex items-center gap-2 text-sm">
      {items.map((item, index) => (
        <Fragment key={item.href}>
          {index > 0 && <ChevronRightIcon size={16} className="text-gray-400" />}

          {index === items.length - 1 ? (
            <span className="text-gray-900 font-medium">{item.label}</span>
          ) : (
            <Link href={item.href} className="text-gray-600 hover:text-gray-900">
              {item.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
```

---

## 8. Performance Optimization

### 8.1 Bundle Size Optimization

**Target**: <200 KB initial JS bundle (gzipped).

**Strategies**:

#### Strategy 1: Code Splitting

```tsx
// Lazy load heavy components
const MapView = lazy(() => import('./components/MapView'));
const VotingModal = lazy(() => import('./components/VotingModal'));

function TripPage() {
  const [showMap, setShowMap] = useState(false);

  return (
    <>
      <Button onClick={() => setShowMap(true)}>View Map</Button>

      {showMap && (
        <Suspense fallback={<Spinner />}>
          <MapView />
        </Suspense>
      )}
    </>
  );
}
```

**Why This Works**:
- Google Maps API is ~100 KB → only load when user clicks "View Map"
- Voting UI is heavy → only load when user opens voting sheet
- Initial page load is faster (smaller bundle)

#### Strategy 2: Tree Shaking

```tsx
// ❌ BAD: Imports entire library
import _ from 'lodash';
const sorted = _.sortBy(items, 'date');

// ✅ GOOD: Import only what you need
import { sortBy } from 'lodash-es';
const sorted = sortBy(items, 'date');

// ✅ BETTER: Use native methods
const sorted = items.sort((a, b) => a.date - b.date);
```

#### Strategy 3: Icon Tree Shaking

```tsx
// ❌ BAD: Bundle includes all icons
import { MapIcon, BellIcon, UserIcon } from 'lucide-react';

// ✅ GOOD: Import individual icons
import MapIcon from 'lucide-react/dist/esm/icons/map';
import BellIcon from 'lucide-react/dist/esm/icons/bell';
import UserIcon from 'lucide-react/dist/esm/icons/user';
```

### 8.2 Image Optimization

**Strategy**: Use next-gen formats (WebP, AVIF) with fallbacks.

**Implementation** (Vite plugin):

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import imagemin from 'vite-plugin-imagemin';

export default defineConfig({
  plugins: [
    imagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.8, 0.9], speed: 4 },
      svgo: {
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'removeEmptyAttrs', active: false },
        ],
      },
      webp: { quality: 80 },
      avif: { quality: 70 },
    }),
  ],
});
```

**Usage**:

```tsx
<picture>
  <source srcSet="image.avif" type="image/avif" />
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Activity" />
</picture>
```

**Why This Works**:

- AVIF = 50% smaller than JPEG (modern browsers)
- WebP = 30% smaller than JPEG (fallback for Safari <14)
- JPEG = universal fallback

### 8.3 Font Loading Strategy

**Problem**: Custom fonts cause Flash of Invisible Text (FOIT) or Flash of Unstyled Text (FOUT), degrading perceived performance.

**Solution**: Use system fonts with optional enhancement strategy.

**System Font Stack** (0 bytes, instant rendering):

```css
/* Tailwind v4 default */
@theme {
  --font-family-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
```

**Benefits**:

- ✅ **Zero latency**: No network request, no FOIT/FOUT
- ✅ **Native feel**: Uses OS-native fonts (San Francisco on iOS, Roboto on Android)
- ✅ **Perfect legibility**: Fonts optimized for each platform
- ✅ **Zero bundle cost**: No font files to download

**Custom Font Enhancement** (if brand requires it):

```css
/* Load custom font asynchronously */
@font-face {
  font-family: 'CustomBrand';
  src: url('/fonts/CustomBrand-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap; /* Show fallback immediately, swap when loaded */
}

@theme {
  --font-family-brand: 'CustomBrand', system-ui, sans-serif;
}
```

**Usage**:

```tsx
/* Default: System fonts everywhere */
<body className="font-sans">

/* Brand font for marketing pages only */
<h1 className="font-[--font-family-brand]">Welcome to TripOS</h1>
```

**Font Loading Performance**:

```tsx
// Preload critical fonts (if using custom fonts)
// In app HTML <head>:
<link
  rel="preload"
  href="/fonts/CustomBrand-Regular.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>
```

**Recommendation for TripOS**:

- **Phase 1-2**: Use system fonts only (fastest, native feel)
- **Phase 3+**: Add brand font for landing page/marketing only, keep app UI with system fonts

**Why System Fonts Win for Mobile Apps**:

- Users expect native feel (WhatsApp, Instagram use system fonts in-app)
- Faster initial load (critical on 3G/4G)
- Better battery life (no extra font parsing)
- Automatic dark mode support (system fonts handle this natively)

### 8.5 List Virtualization

**Problem**: Long itineraries (50+ activities) cause scroll lag.

**Solution**: Render only visible items (virtual scrolling).

**Implementation** (using `@tanstack/react-virtual`):

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function ActivityList({ activities }: { activities: Activity[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: activities.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Estimated height of activity card
    overscan: 5, // Render 5 extra items above/below viewport
  });

  return (
    <div ref={parentRef} className="h-screen overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ActivityCard activity={activities[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Why This Works**:

- 1,000 activities → only render ~20 visible items
- Smooth 60fps scrolling even with massive lists
- Wanderlog struggles with this (performance degrades with long itineraries)

### 8.6 Real-Time Subscription Optimization

**Problem**: Subscribing to entire `trips` table = unnecessary re-renders.

**Solution**: Subscribe only to specific trip's changes.

```tsx
// ❌ BAD: Subscribe to all trips (wastes bandwidth)
supabase
  .channel('trips')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'trips' }, (payload) => {
    // Fires for EVERY trip change (even trips user isn't viewing)
  })
  .subscribe();

// ✅ GOOD: Subscribe to specific trip
supabase
  .channel(`trip:${tripId}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'trips',
    filter: `id=eq.${tripId}`,
  }, (payload) => {
    // Only fires for this trip's changes
  })
  .subscribe();
```

**Why This Works**:
- Reduces real-time message volume (less bandwidth)
- Prevents unnecessary re-renders (only update if current trip changed)
- Scales better (1,000 concurrent users won't overwhelm server)

---

## 9. Progressive Web App (PWA) Patterns

### 9.1 Offline Support

**Strategy**: Cache critical resources, queue mutations.

**Implementation** (Vite PWA plugin):

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'TripOS',
        short_name: 'TripOS',
        description: 'Democratic group travel planning',
        theme_color: '#3B82F6',
        background_color: '#FFFFFF',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            // Cache Google Maps tiles
            urlPattern: /^https:\/\/maps\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-maps-cache',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            // Cache API responses
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
            },
          },
        ],
      },
    }),
  ],
});
```

**Offline Mutation Queue** (using TanStack Query):

```tsx
// lib/offlineQueue.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (was cacheTime)
      retry: 3,
      networkMode: 'offlineFirst', // Use cached data when offline
    },
    mutations: {
      retry: 3,
      networkMode: 'offlineFirst', // Queue mutations when offline
    },
  },
});
```

**Usage**:

```tsx
function AddActivityButton() {
  const mutation = useMutation({
    mutationFn: addActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities', tripId] });
    },
    onError: () => {
      toast.error('Failed to add activity. Will retry when online.');
    },
  });

  return (
    <Button onClick={() => mutation.mutate(activityData)}>
      Add Activity
    </Button>
  );
}
```

**Why This Works**:
- User can add activities offline → syncs when back online
- Maps work offline (cached tiles)
- No "You're offline" error screens (graceful degradation)

### 9.2 Install Prompt

**Pattern**: Prompt user to install PWA (iOS/Android).

**Implementation**:

```tsx
// hooks/useInstallPrompt.ts
import { useEffect, useState } from 'react';

export function useInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const promptInstall = async () => {
    if (!installPrompt) return;

    (installPrompt as any).prompt();
    const { outcome } = await (installPrompt as any).userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed');
    }

    setInstallPrompt(null);
  };

  return { canInstall: !!installPrompt, promptInstall };
}
```

**Usage**:

```tsx
function InstallBanner() {
  const { canInstall, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  return (
    <div className="fixed bottom-20 inset-x-4 z-50 rounded-lg bg-primary-500 p-4 text-white shadow-xl">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-semibold">Install TripOS</h3>
          <p className="text-sm opacity-90">
            Add to your home screen for faster access and offline support.
          </p>
        </div>
        <button onClick={() => setDismissed(true)} className="p-1">
          <XIcon size={20} />
        </button>
      </div>

      <div className="mt-3 flex gap-2">
        <Button variant="secondary" size="sm" fullWidth onClick={promptInstall}>
          Install
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}>
          Not Now
        </Button>
      </div>
    </div>
  );
}
```

**Why This Works**:
- ✅ **Deferred prompt**: Show at optimal time (not immediately on load)
- ✅ **Dismissible**: User can decline without annoyance
- ✅ **Clear value prop**: "Faster access + offline support"

---

## 10. Accessibility & Inclusive Design

### 10.1 Screen Reader Support

**Semantic HTML**:

```tsx
// ✅ GOOD: Semantic HTML
<nav>
  <ul>
    <li><a href="/trips">Trips</a></li>
    <li><a href="/activity">Activity</a></li>
  </ul>
</nav>

// ❌ BAD: Divs everywhere
<div>
  <div onClick={() => navigate('/trips')}>Trips</div>
  <div onClick={() => navigate('/activity')}>Activity</div>
</div>
```

**ARIA Labels**:

```tsx
// Button with icon only
<button aria-label="Delete activity">
  <TrashIcon size={20} />
</button>

// Button with text (no aria-label needed)
<button>
  <TrashIcon size={20} />
  <span>Delete</span>
</button>

// Status indicators
<div role="status" aria-live="polite">
  6 of 8 members voted
</div>

// Loading states
<button disabled aria-busy="true">
  <Spinner />
  Loading...
</button>
```

### 10.2 Keyboard Navigation

**Focus Management**:

```tsx
// Modal: Trap focus inside
import { Dialog } from '@radix-ui/react-dialog';

<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Content>
    {/* Focus trapped inside modal */}
    {/* Escape key closes modal */}
    {/* Tab cycles through focusable elements */}
  </Dialog.Content>
</Dialog.Root>

// Skip to content link
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-primary-500 focus:px-4 focus:py-2 focus:text-white"
>
  Skip to content
</a>
```

**Keyboard Shortcuts**:

```tsx
// Global keyboard shortcuts
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Cmd/Ctrl + K: Search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setSearchOpen(true);
    }

    // Cmd/Ctrl + N: New trip
    if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
      e.preventDefault();
      setCreateTripOpen(true);
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

### 10.3 Color Contrast

**WCAG AAA Compliance** (7:1 contrast ratio):

| Element | Foreground | Background | Contrast |
|---------|------------|------------|----------|
| Primary text | `#111827` | `#FFFFFF` | 16.1:1 ✅ |
| Secondary text | `#4B5563` | `#FFFFFF` | 8.6:1 ✅ |
| Primary button | `#FFFFFF` | `#3B82F6` | 8.6:1 ✅ |
| Links | `#2563EB` | `#FFFFFF` | 8.2:1 ✅ |

**Audit Tool**: Use Chrome DevTools Lighthouse accessibility audit.

### 10.4 Reduced Motion

**Respect user preference**:

```css
/* Disable animations for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Implementation** (Framer Motion):

```tsx
import { useReducedMotion } from 'framer-motion';

function AnimatedCard() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
    >
      {/* Content */}
    </motion.div>
  );
}
```

---

## 11. Implementation Roadmap

### 11.1 Phase 1: Foundation (Weeks 0-2)

**Setup**:
- ✅ Install Tailwind CSS v4
- ✅ Configure design tokens (colors, spacing, typography)
- ✅ Setup Radix UI primitives (Dialog, DropdownMenu, RadioGroup, etc.)
- ✅ Install Framer Motion for animations
- ✅ Configure Vite PWA plugin

**Core Components**:
- ✅ Button component (all variants)
- ✅ Input component (text, email, number, etc.)
- ✅ Card component (header, content, footer)
- ✅ Bottom sheet component
- ✅ Tab bar component

**Deliverables**:
- Design system documented in Storybook
- Component library ready for use
- PWA manifest configured

### 11.2 Phase 2: Layout & Navigation (Weeks 2-4)

**Mobile Layout**:
- ✅ Bottom tab bar navigation
- ✅ Sticky header with back button
- ✅ FAB positioning
- ✅ Page transitions

**Desktop Layout**:
- ✅ Sidebar navigation
- ✅ Breadcrumb navigation
- ✅ Multi-column layouts

**Responsive**:
- ✅ Mobile → tablet → desktop breakpoints
- ✅ Test on real devices (iPhone SE, iPad, MacBook)

### 11.3 Phase 3: Interactions (Weeks 4-6)

**Touch Gestures**:
- ✅ Swipe to delete/edit
- ✅ Pull to refresh
- ✅ Long press context menu
- ✅ Haptic feedback

**Performance**:
- ✅ List virtualization for long itineraries
- ✅ Code splitting (lazy load Map, Voting UI)
- ✅ Image optimization

**Offline**:
- ✅ Service worker caching
- ✅ Offline mutation queue
- ✅ Install prompt

### 11.4 Acceptance Criteria

**Quality Gates** (must pass before launch):

| Metric | Target | How to Test |
|--------|--------|-------------|
| **Lighthouse Mobile Score** | ≥90 | Chrome DevTools Lighthouse |
| **Lighthouse Performance** | ≥90 | Chrome DevTools Lighthouse |
| **Lighthouse Accessibility** | 100 | Chrome DevTools Lighthouse |
| **First Contentful Paint** | <2s on 3G | Lighthouse throttling |
| **Time to Interactive** | <3.5s on 3G | Lighthouse throttling |
| **Touch Target Violations** | 0 | Chrome DevTools overlay |
| **Color Contrast Violations** | 0 | axe DevTools |
| **Keyboard Navigation** | All features accessible | Manual testing |
| **Screen Reader** | All features announced | VoiceOver (iOS), TalkBack (Android) |

**Device Testing Matrix**:

| Device | Browser | Screen Size | Priority |
|--------|---------|-------------|----------|
| iPhone SE | Safari | 375×667 | P0 (min size) |
| iPhone 15 Pro | Safari | 393×852 | P0 (most common) |
| Pixel 7 | Chrome | 412×915 | P1 (Android) |
| iPad | Safari | 768×1024 | P1 (tablet) |
| MacBook Pro | Chrome | 1440×900 | P1 (desktop) |

---

## Summary

### Core Principles Recap

1. **Design for thumbs first, mice second**
2. **44×44px minimum touch targets**
3. **≤3 taps to any action**
4. **80% of actions in thumb zone (bottom 1/3)**
5. **Progressive disclosure** (hide complexity)
6. **One-handed interaction priority**

### Competitive Advantage

TripOS's mobile-first UX is a **differentiator**, not just table stakes:

- **Sygic**: Desktop-first, mobile is clunky
- **Wanderlog**: Web-optimized, mobile is secondary
- **TripIt**: Mobile exists but feels like port
- **Lambus**: Mobile but cluttered

**We win because**:
- Designed for phone from day one
- Touch-optimized interactions (swipe, long press, pull to refresh)
- Fast actions (vote in <3 taps, add activity in <20 seconds)
- Works offline (PWA with cached maps)
- Smooth performance (virtualized lists, code splitting)

### Next Steps

1. **Review this document with design team** (if expanding beyond solo dev)
2. **Setup Figma prototypes** (test flows with users before building)
3. **Build component library** (Weeks 0-2 in Phase 1)
4. **User testing on real devices** (iPhone SE, Pixel, iPad)
5. **Iterate based on usability findings**

---

**Document Status**: ✅ Revised - Production Ready
**Last Updated**: February 8, 2026
**Version**: 1.1

**Revision History**:

- v1.1 (Feb 8, 2026): Fixed Tailwind v4 syntax, removed non-functional iOS haptics, replaced broken pull-to-refresh, removed Button sm variant, fixed useLongPress double-firing, fixed BottomSheet state sync, added iOS safe areas, added font loading strategy, added missing UI patterns (toast, skeletons, empty states, form validation, dark mode)
- v1.0 (Feb 8, 2026): Initial comprehensive mobile-first UX guide

**Related Documents**:
- [modern-tech-stack-deep-dive.md](./modern-tech-stack-deep-dive.md) - Technical foundation
- [gap-analysis-competitive-positioning.md](./gap-analysis-competitive-positioning.md) - Mobile-first competitive advantage
- [voting-system-deep-dive.md](./voting-system-deep-dive.md) - Mobile voting UX patterns
