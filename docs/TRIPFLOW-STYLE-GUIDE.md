# TripFlow Style Guide
**Version 1.0** | Last Updated: February 28, 2026

---

## Table of Contents

### I. Introduction
1. [About This Guide](#1-about-this-guide)
2. [Who This Guide Is For](#2-who-this-guide-is-for)
3. [Design Philosophy](#3-design-philosophy)
4. [How to Use This Guide](#4-how-to-use-this-guide)

### II. Design System Foundations
5. [Color System](#5-color-system)
6. [Typography](#6-typography)
7. [Spacing & Layout](#7-spacing--layout)
8. [Elevation & Depth](#8-elevation--depth)
9. [Motion & Animation](#9-motion--animation)
10. [Iconography](#10-iconography)

### III. Component Library
11. [Component Anatomy](#11-component-anatomy)
12. [Component API Patterns](#12-component-api-patterns)
13. [Button Components](#13-button-components)
14. [Form Components](#14-form-components)
15. [Card Components](#15-card-components)
16. [Navigation Components](#16-navigation-components)
17. [Feedback Components](#17-feedback-components)
18. [Data Display Components](#18-data-display-components)

### IV. Code Standards
19. [TypeScript Conventions](#19-typescript-conventions)
20. [React Component Patterns](#20-react-component-patterns)
21. [File Organization](#21-file-organization)
22. [Naming Conventions](#22-naming-conventions)
23. [Styling Conventions](#23-styling-conventions)
24. [State Management](#24-state-management)
25. [Testing Standards](#25-testing-standards)
26. [Performance Best Practices](#26-performance-best-practices)

### V. Accessibility
27. [Accessibility Standards](#27-accessibility-standards)
28. [Keyboard Navigation](#28-keyboard-navigation)
29. [Screen Reader Support](#29-screen-reader-support)
30. [ARIA Patterns](#30-aria-patterns)

### VI. shadcn/ui Component Standards
35. [Using shadcn Components](#35-using-shadcn-components)
36. [Component Composition](#36-component-composition)
37. [Customization Guidelines](#37-customization-guidelines)
38. [Form Patterns with shadcn](#38-form-patterns-with-shadcn)
39. [Accessibility with shadcn](#39-accessibility-with-shadcn)
40. [TripFlow-Specific Extensions](#40-tripflow-specific-extensions)

### VII. Cross-Functional Collaboration
31. [Designer Workflow](#31-designer-workflow)
32. [Developer Workflow](#32-developer-workflow)
33. [Contributing Guidelines](#33-contributing-guidelines)
34. [Component Lifecycle](#34-component-lifecycle)

### VIII. Quick Reference
41. [Design Tokens Quick Reference](#41-design-tokens-quick-reference)
42. [Component Checklist](#42-component-checklist)
43. [Common Patterns](#43-common-patterns)

---

## I. Introduction

### 1. About This Guide

This comprehensive style guide establishes the design language and development standards for TripFlow, a modern travel planning application. It serves as the single source of truth for visual design, component implementation, and code quality.

**Purpose:**
- Ensure visual and functional consistency across the application
- Accelerate development through shared patterns and conventions
- Maintain code quality and accessibility standards
- Enable effective cross-functional collaboration

**Scope:**
This guide covers both design system elements (colors, typography, components) and development standards (TypeScript, React, testing). It applies to all TripFlow features and should be consulted before creating new components or features.

**Inspiration:**
This guide draws from industry-leading design systems including:
- **Google Material Design** - Comprehensive design principles and component specifications
- **Shopify Polaris** - E-commerce-focused patterns and merchant workflows
- **Airbnb Design System** - Unified experience through shared language
- **shadcn/ui** - Composable, accessible component architecture
- **Tailwind CSS v4** - CSS-first design token system

### 2. Who This Guide Is For

**For Designers:**
- Visual design guidelines and design tokens
- Component specifications and interaction patterns
- Figma-to-code handoff standards
- Accessibility requirements

**For Developers:**
- Code conventions and architectural patterns
- Component implementation standards
- Testing requirements
- Performance optimization guidelines

**For Product Managers:**
- Understanding component capabilities and limitations
- Planning feature feasibility
- Maintaining brand consistency

**For QA Engineers:**
- Component behavior specifications
- Accessibility testing criteria
- Cross-browser compatibility standards

### 3. Design Philosophy

TripFlow's design system is built on four core principles:

#### **1. Cinematic Travel Experience**
Travel planning should feel inspiring and immersive. Our glassmorphic design language with rich city-based color themes creates an elevated, premium experience that evokes the excitement of travel.

**Implementation:**
- Sophisticated glassmorphic surfaces with subtle depth
- Rich, vibrant city color palettes (Shanghai pink, Tokyo indigo, etc.)
- High-quality imagery with thoughtful photography
- Smooth, intentional animations that enhance (never distract)

#### **2. Clarity Over Complexity**
Travel planning involves many details. Our interface prioritizes clarity, making complex information digestible through clear hierarchy, generous whitespace, and progressive disclosure.

**Implementation:**
- Clear visual hierarchy with distinct heading/body typography
- Generous spacing that lets content breathe
- Progressive disclosure - show what's needed, hide what's not
- Purposeful color usage that guides attention

#### **3. Accessible by Default**
Every traveler deserves an excellent experience. All components meet WCAG 2.1 AA standards minimum, with many reaching AAA compliance.

**Implementation:**
- Semantic HTML structure for all components
- Keyboard navigation for all interactive elements
- Sufficient color contrast (4.5:1 for text, 3:1 for UI elements)
- Screen reader tested with NVDA and VoiceOver
- Focus indicators that are always visible

#### **4. Composable & Predictable**
Components should be intuitive to use and easy to extend. We follow shadcn/ui's composable interface pattern where every component shares common conventions.

**Implementation:**
- Consistent prop interfaces across similar components
- Composition over configuration
- Sensible defaults with escape hatches
- Open source code that can be modified when needed

---

## II. Design System Foundations

### 5. Color System

TripFlow's color system consists of three layers: **semantic colors** (for UI states), **city colors** (for location-based theming), and **accent colors** (for brand identity).

#### **5.1 Semantic Colors**

These colors communicate meaning and UI states. They adapt automatically between light and dark themes.

**Light Mode:**
```css
--text-primary: #1a1a1a     /* Primary text, headings */
--text-secondary: #5e5e5e   /* Secondary text, descriptions */

--bg-base: #fcfcfc          /* Page background */
--bg-surface: #ffffff       /* Card/panel background */
--bg-surface-hover: #f5f5f5 /* Hover states */
--bg-surface-subtle: rgba(0, 0, 0, 0.02) /* Subtle backgrounds */

--border-subtle: rgba(0, 0, 0, 0.06)     /* Borders, dividers */
--border-focus: rgba(13, 148, 136, 0.3)  /* Focus rings */
```

**Dark Mode:**
```css
--text-primary: #F5F5F5     /* Primary text, headings */
--text-secondary: #A3A3A3   /* Secondary text, descriptions */

--bg-base: #121212          /* Page background */
--bg-surface: #1E1E1E       /* Card/panel background */
--bg-surface-hover: #2A2A2A /* Hover states */

--border-subtle: rgba(255, 255, 255, 0.08) /* Borders, dividers */
--border-focus: rgba(20, 184, 166, 0.4)    /* Focus rings */
```

**State Colors:**
```css
--color-success: #10B981  /* Success states, confirmations */
--color-warning: #F59E0B  /* Warnings, cautions */
--color-danger: #EF4444   /* Errors, destructive actions */
--color-info: #3B82F6     /* Informational messages */
```

**Usage Guidelines:**
- ✅ **DO**: Use semantic colors for UI elements (buttons, forms, alerts)
- ✅ **DO**: Rely on CSS variables for automatic dark mode support
- ❌ **DON'T**: Hardcode hex values in components
- ❌ **DON'T**: Use state colors for decorative purposes

#### **5.2 City Color System**

Each of the 6 cities in the Asia Trip has a unique color identity. These colors are used for city-specific content, map markers, and thematic elements.

| City | Primary | Glow Effect | Muted Background | Usage |
|------|---------|-------------|------------------|-------|
| **Shanghai** | `#C2185B` (Pink) | `rgba(194, 24, 91, 0.15)` | `rgba(194, 24, 91, 0.08)` | Modern, vibrant, cosmopolitan |
| **Hong Kong** | `#E65100` (Orange) | `rgba(230, 81, 0, 0.15)` | `rgba(230, 81, 0, 0.08)` | Energetic, dynamic, bustling |
| **Osaka** | `#00838F` (Teal) | `rgba(0, 131, 143, 0.15)` | `rgba(0, 131, 143, 0.08)` | Friendly, approachable, food-focused |
| **Kyoto** | `#558B2F` (Green) | `rgba(85, 139, 47, 0.15)` | `rgba(85, 139, 47, 0.08)` | Traditional, serene, cultural |
| **Tokyo** | `#283593` (Indigo) | `rgba(40, 53, 147, 0.15)` | `rgba(40, 53, 147, 0.08)` | Tech-forward, sophisticated, urban |
| **Beijing** | `#BF360C` (Deep Orange) | `rgba(191, 54, 12, 0.15)` | `rgba(191, 54, 12, 0.08)` | Historic, imperial, majestic |

**Implementation Example:**
```typescript
import { getCityStyle } from '@/lib/city-colors';

// Get city color dynamically
const cityStyle = getCityStyle('tokyo');
// Returns: { primary: '#283593', glow: 'rgba(40, 53, 147, 0.15)', ... }
```

**Usage Guidelines:**
- ✅ **DO**: Use city colors for location-specific content (activity cards, city headers, map markers)
- ✅ **DO**: Use glow effects for subtle backgrounds and highlights
- ✅ **DO**: Ensure city colors maintain sufficient contrast with text
- ❌ **DON'T**: Mix multiple city colors in the same component
- ❌ **DON'T**: Use city colors for non-location-related UI elements

#### **5.3 Accent Colors**

Brand accent colors create visual interest and call attention to primary actions.

```css
--accent-primary: #0D9488       /* Teal - Primary brand color */
--accent-glow: rgba(13, 148, 136, 0.15)  /* Teal glow effect */
--accent-secondary: #FF5A5F     /* Coral - Secondary accent */
```

**Usage Guidelines:**
- **Primary Accent (Teal)**: Primary buttons, links, focus states, interactive elements
- **Secondary Accent (Coral)**: Secondary actions, decorative elements, illustrations

#### **5.4 Color Accessibility**

All color combinations meet **WCAG 2.1 AA** standards minimum.

**Contrast Requirements:**
- **Text**: 4.5:1 contrast ratio (large text: 3:1)
- **UI Components**: 3:1 contrast ratio
- **Focus Indicators**: 3:1 contrast ratio

**Testing Colors:**
```bash
# Use this tool to verify contrast ratios:
# https://webaim.org/resources/contrastchecker/
```

**Do's and Don'ts:**
- ✅ **DO**: Test color combinations with contrast checkers
- ✅ **DO**: Provide alternative indicators beyond color (icons, text labels)
- ❌ **DON'T**: Rely on color alone to convey information
- ❌ **DON'T**: Use low-contrast color combinations for text

#### **5.5 Color Coexistence Rules**

TripFlow uses multiple color systems that must coexist harmoniously. This section defines **color hierarchy**, **usage constraints**, and **conflict resolution** strategies.

**Color Hierarchy (Precedence Order):**

```
Tier 1: Semantic UI (success, danger, warning, info)     ← Always wins
Tier 2: Feature Colors (privacy teal, voting purple)     ← Wins in feature contexts
Tier 3: Brand Accent (primary teal, coral)               ← Wins in neutral UI
Tier 4: City Colors (Shanghai pink, Osaka teal, etc.)    ← Context-specific only
```

**Usage Matrix:**

| Color Type | Allowed Usage | Forbidden Usage |
|------------|---------------|-----------------|
| **Semantic UI** | Buttons, alerts, status badges, form validation | Decorative borders, backgrounds |
| **Feature Colors** | Privacy badges, voting indicators, feature-specific icons | Primary actions, city theming |
| **Brand Accent** | Primary buttons, links, focus rings, global UI | Status indicators, feature badges |
| **City Colors** | Left/right borders, map pins, city chips, timeline nodes | Primary buttons, status badges, form inputs |

**⚠️ Critical Conflict: Osaka City Teal vs Privacy Feature Teal**

TripFlow uses **15° hue separation** in OKLCH color space to resolve the Osaka/Privacy teal conflict:

| Color | Hue | OKLCH Value | Usage Context |
|-------|-----|-------------|---------------|
| **Privacy Feature** | 185° | `oklch(0.56 0.14 185)` | Icons, badges, privacy indicators |
| **Osaka City** | 200° | `oklch(0.56 0.14 200)` | Borders, map pins, city theming |

**Spatial Separation Strategy:**

When both colors appear in the same component:
- **City color** → Border (left/right edge)
- **Privacy color** → Icon or badge (interior content)
- **Example**: Osaka activity card with city border + privacy badge coexist without confusion

**Correct Implementation Examples:**

```tsx
// ✅ CORRECT: City border + privacy badge
<div style={{
  ...getCityStyle('osaka'),
  borderLeft: '3px solid var(--city-color)'
}}>
  <h3>Private Dinner Reservation</h3>
  <PrivacyIndicator /> {/* Uses --color-privacy (185° hue) */}
</div>

// ✅ CORRECT: Feature color in feature context
<button className="privacy-toggle">
  <Lock color="var(--color-privacy)" />
  Make Private
</button>

// ✅ CORRECT: Semantic color for status
<Badge variant="success">Booked</Badge>
```

**Incorrect Implementations (Anti-Patterns):**

```tsx
// ❌ WRONG: City color on primary button
<button style={{ background: 'var(--city-osaka)' }}>
  Book Now
</button>

// ❌ WRONG: Feature color for decorative border
<div style={{ borderLeft: '4px solid var(--color-privacy)' }}>
  Generic Content
</div>

// ❌ WRONG: City color for status badge
<Badge style={{ background: 'var(--city-tokyo)' }}>
  Booked
</Badge>
```

**Testing Checklist:**

- [ ] No city colors used on buttons (use `--accent-primary` instead)
- [ ] No feature colors used decoratively (reserved for privacy/voting)
- [ ] No semantic colors used for city theming (use city colors instead)
- [ ] Osaka city + privacy teal can coexist via spatial separation
- [ ] All color combinations pass WCAG AA (4.5:1 text, 3:1 UI)

**Developer Guidelines:**

1. **Read JSDoc first**: Check `getCityStyle()` documentation before using city colors
2. **Check the hierarchy**: Semantic > Feature > Brand > City
3. **Verify hue separation**: Privacy (185°) ≠ Osaka (200°)
4. **Test dark mode**: All colors must adapt correctly
5. **Use design tokens**: Never hardcode hex values

---

### 6. Typography

TripFlow uses a dual-typeface system: **DM Sans** for UI and body text, **Playfair Display** for headings.

#### **6.1 Typeface Selection**

**DM Sans (Body & UI)**
- **Usage**: Body text, UI elements, labels, buttons
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
- **Character**: Geometric, clean, highly legible at small sizes
- **Why**: Optimized for UI with excellent readability across devices

**Playfair Display (Headings)**
- **Usage**: Page titles, section headings, hero text
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
- **Character**: Elegant serif, sophisticated, editorial
- **Why**: Creates visual hierarchy and evokes premium travel aesthetic

#### **6.2 Typography Scale**

Our type scale uses modular scaling (1.25 ratio) for harmonious proportions.

| Level | Element | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|---------|------|--------|-------------|----------------|-------|
| **H1** | Page Title | `2.5rem` (40px) | 500 | 1.2 | `-0.01em` | Page headlines |
| **H2** | Section Title | `2rem` (32px) | 500 | 1.3 | `-0.01em` | Major sections |
| **H3** | Subsection | `1.5rem` (24px) | 500 | 1.4 | `-0.01em` | Subsections |
| **H4** | Component Title | `1.25rem` (20px) | 600 | 1.4 | `-0.005em` | Component headers |
| **Body Large** | Intro Text | `1.125rem` (18px) | 400 | 1.6 | `0` | Lead paragraphs |
| **Body** | Body Text | `1rem` (16px) | 400 | 1.5 | `0` | Default body text |
| **Body Small** | Secondary Text | `0.875rem` (14px) | 400 | 1.5 | `0` | Captions, meta |
| **Caption** | Meta Text | `0.75rem` (12px) | 400 | 1.4 | `0.01em` | Timestamps, labels |

**CSS Implementation:**
```css
/* Headings use Playfair Display */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}

/* Body text uses DM Sans */
body {
  font-family: var(--font-base);
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text-primary);
}

p {
  color: var(--text-secondary);
}
```

#### **6.3 Typography Best Practices**

**Hierarchy:**
- Create clear visual hierarchy through size, weight, and color
- Use one H1 per page for SEO and accessibility
- Don't skip heading levels (H1 → H2 → H3, not H1 → H3)

**Readability:**
- **Line Length**: 50-75 characters per line for optimal readability
- **Line Height**: 1.5-1.6 for body text, 1.2-1.4 for headings
- **Paragraph Spacing**: `1em` between paragraphs

**Responsive Typography:**
```css
/* Scale down headings on mobile */
@media (max-width: 768px) {
  h1 { font-size: 2rem; }    /* 40px → 32px */
  h2 { font-size: 1.5rem; }  /* 32px → 24px */
  h3 { font-size: 1.25rem; } /* 24px → 20px */
}
```

**Do's and Don'ts:**
- ✅ **DO**: Use system font stack as fallback
- ✅ **DO**: Preload custom fonts for performance
- ✅ **DO**: Use relative units (rem, em) for scalability
- ❌ **DON'T**: Use more than 2 typefaces
- ❌ **DON'T**: Use font sizes smaller than 12px
- ❌ **DON'T**: Use ALL CAPS for long text (accessibility issue)

---

### 7. Spacing & Layout

TripFlow uses an 8px base unit spacing system for consistency and mathematical harmony.

#### **7.1 Spacing Scale**

Our spacing scale follows an 8px grid with t-shirt sizing:

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | `0.25rem` (4px) | Tight spacing, icon gaps |
| `sm` | `0.5rem` (8px) | Compact spacing, button padding |
| `md` | `1rem` (16px) | Default spacing, form fields |
| `lg` | `1.5rem` (24px) | Component padding, card spacing |
| `xl` | `2rem` (32px) | Section spacing, generous padding |
| `2xl` | `3rem` (48px) | Major section breaks |
| `3xl` | `4rem` (64px) | Hero spacing, page sections |

**Tailwind Implementation:**
```jsx
<div className="p-md">           {/* padding: 1rem */}
<div className="gap-sm">         {/* gap: 0.5rem */}
<div className="space-y-lg">     {/* vertical spacing: 1.5rem */}
```

#### **7.2 Layout Patterns**

**Container Widths:**
```css
--container-sm: 640px   /* Single column content */
--container-md: 768px   /* Forms, modals */
--container-lg: 1024px  /* Main content area */
--container-xl: 1280px  /* Dashboard layouts */
--container-2xl: 1536px /* Full-width layouts */
```

**Common Layout Patterns:**

**1. Card Grid (Dashboard)**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
  {/* Cards automatically flow in responsive grid */}
</div>
```

**2. Sidebar Layout**
```jsx
<div className="flex">
  <aside className="w-[280px]">{/* Sidebar */}</aside>
  <main className="flex-1">{/* Main content */}</main>
</div>
```

**3. Centered Content**
```jsx
<div className="max-w-container-lg mx-auto px-md">
  {/* Centered content with consistent padding */}
</div>
```

#### **7.3 Responsive Breakpoints**

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | `640px` | Large phones, small tablets |
| `md` | `768px` | Tablets, landscape phones |
| `lg` | `1024px` | Small desktops, large tablets |
| `xl` | `1280px` | Desktops |
| `2xl` | `1536px` | Large desktops |

**Mobile-First Approach:**
```jsx
{/* Default styles = mobile, then enhance */}
<div className="p-sm md:p-md lg:p-lg">
  {/* Spacing increases with screen size */}
</div>
```

#### **7.4 Spacing Best Practices**

**Do's and Don'ts:**
- ✅ **DO**: Use multiples of 8px (4px acceptable for tight spacing)
- ✅ **DO**: Be generous with whitespace - it improves readability
- ✅ **DO**: Maintain consistent spacing within component types
- ❌ **DON'T**: Use arbitrary spacing values (no `padding: 13px`)
- ❌ **DON'T**: Overcrowd interfaces with minimal spacing
- ❌ **DON'T**: Mix spacing systems (stick to our scale)

---

### 8. Elevation & Depth

TripFlow uses a glassmorphic design language with subtle elevation and depth cues.

#### **8.1 Shadow System**

We use a 3-level shadow system for elevation hierarchy:

```css
/* Level 1: Subtle elevation (cards at rest) */
--glass-shadow: 0 4px 12px rgba(0, 0, 0, 0.03),
                0 1px 3px rgba(0, 0, 0, 0.05);

/* Level 2: Raised elevation (cards on hover, dropdowns) */
--shadow-raised: 0 8px 30px rgba(0, 0, 0, 0.06),
                 0 2px 6px rgba(0, 0, 0, 0.08);

/* Level 3: Floating elevation (modals, popovers) */
--shadow-floating: 0 20px 50px rgba(0, 0, 0, 0.12),
                   0 4px 12px rgba(0, 0, 0, 0.08);
```

**Dark Mode Shadows:**
```css
:root[data-theme="dark"] {
  --glass-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-raised: 0 8px 30px rgba(0, 0, 0, 0.6);
  --shadow-floating: 0 20px 50px rgba(0, 0, 0, 0.8);
}
```

#### **8.2 Glassmorphic Surfaces**

Our signature glassmorphic style creates depth without heavy shadows:

```css
.glass-panel {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--glass-shadow);
  transition: all var(--transition-smooth);
}

.glass-panel:hover {
  background: var(--bg-surface-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-raised);
}
```

#### **8.3 Border Radius**

Consistent corner radii create visual cohesion:

```css
--radius-sm: 0.375rem  (6px)   /* Small elements, badges */
--radius-md: 0.5rem    (8px)   /* Buttons, inputs */
--radius-lg: 0.75rem   (12px)  /* Cards, panels */
--radius-xl: 1rem      (16px)  /* Large cards, modals */
--radius-2xl: 1.5rem   (24px)  /* Hero sections */
--radius-full: 9999px          /* Circular elements */
```

**Usage:**
- Small UI elements (badges, tags): `radius-sm`
- Interactive elements (buttons, inputs): `radius-md`
- Cards and panels: `radius-lg`
- Modals and large containers: `radius-xl`
- Avatar images: `radius-full`

---

### 9. Motion & Animation

Animations should feel smooth, purposeful, and never block user interaction.

#### **9.1 Animation Principles**

**1. Purposeful Motion**
- Animations should have a reason (provide feedback, guide attention, smooth transitions)
- Never animate for decoration alone

**2. Responsive Timing**
- Fast enough to feel immediate (100-300ms)
- Not so fast that changes are jarring

**3. Natural Easing**
- Use ease-out for entering animations
- Use ease-in for exiting animations
- Use ease-in-out for state changes

#### **9.2 Timing Functions**

```css
/* Fast, snappy interactions (hover states, toggles) */
--transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);

/* Smooth, fluid transitions (page transitions, modals) */
--transition-smooth: 0.4s cubic-bezier(0.25, 1, 0.5, 1);

/* Bouncy, playful interactions (success states, celebrations) */
--transition-bounce: 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
```

#### **9.3 Common Animation Patterns**

**Fade In:**
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Framer Motion Example:**
```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
  {/* Content */}
</motion.div>
```

**Scale on Hover:**
```css
.interactive-card {
  transition: transform var(--transition-fast);
}

.interactive-card:hover {
  transform: scale(1.02);
}
```

#### **9.4 Animation Best Practices**

**Do's and Don'ts:**
- ✅ **DO**: Respect `prefers-reduced-motion` for accessibility
- ✅ **DO**: Use hardware-accelerated properties (transform, opacity)
- ✅ **DO**: Keep animations under 400ms for most interactions
- ❌ **DON'T**: Animate layout properties (width, height, top, left)
- ❌ **DON'T**: Create animations longer than 1 second
- ❌ **DON'T**: Animate multiple elements simultaneously (stagger instead)

**Accessibility:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### 10. Iconography

TripFlow uses **Lucide React** for a consistent, modern icon system.

#### **10.1 Icon Library**

**Why Lucide:**
- 🎨 Clean, consistent design language
- 📦 Tree-shakeable (only import icons you use)
- ♿ Built-in accessibility attributes
- 🎯 Optimized for React with TypeScript support

**Installation:**
```bash
npm install lucide-react
```

#### **10.2 Icon Sizes**

Standard icon sizes aligned with our design system:

| Size | Pixels | Usage |
|------|--------|-------|
| `xs` | 12px | Inline text icons |
| `sm` | 16px | Small UI elements, form labels |
| `md` | 20px | Default size, buttons |
| `lg` | 24px | Headers, emphasized actions |
| `xl` | 32px | Feature icons, empty states |
| `2xl` | 48px | Hero icons, illustrations |

**Usage Example:**
```tsx
import { MapPin, Calendar, Users } from 'lucide-react';

<MapPin size={20} />        {/* md - default */}
<Calendar size={16} />      {/* sm - subtle */}
<Users className="size-6" /> {/* Tailwind utility */}
```

#### **10.3 Icon Usage Guidelines**

**Color:**
- Default: `currentColor` (inherits text color)
- Interactive states: Use accent colors
- Status icons: Use semantic colors

```tsx
{/* Inherits parent text color */}
<Calendar className="text-text-secondary" size={16} />

{/* Uses accent color */}
<MapPin className="text-accent-primary" size={20} />

{/* Success state */}
<CheckCircle className="text-success" size={20} />
```

**With Text:**
```tsx
{/* Icon + text alignment */}
<div className="flex items-center gap-sm">
  <MapPin size={16} />
  <span>Tokyo, Japan</span>
</div>
```

**Accessibility:**
```tsx
{/* Decorative icon (has adjacent text) */}
<Calendar aria-hidden="true" size={16} />

{/* Meaningful icon (no adjacent text) */}
<MapPin aria-label="Location" size={20} />
```

**Do's and Don'ts:**
- ✅ **DO**: Use consistent sizes throughout the app
- ✅ **DO**: Align icons optically with text
- ✅ **DO**: Add aria-label when icon conveys meaning alone
- ❌ **DON'T**: Mix icon libraries (stick to Lucide)
- ❌ **DON'T**: Use icons smaller than 12px (accessibility)
- ❌ **DON'T**: Use custom colors on decorative icons

---

## III. Component Library

### 11. Component Anatomy

All TripFlow components follow a consistent structure inspired by shadcn/ui's composable architecture.

#### **11.1 Component Structure**

Every component consists of these elements:

```tsx
// 1. Type Definitions
interface ComponentProps {
  // Props interface defines the component API
}

// 2. Variants Definition (using class-variance-authority)
const componentVariants = cva(
  "base-classes", // Base styles applied to all variants
  {
    variants: {
      // Variant definitions
    },
    defaultVariants: {
      // Default variant values
    }
  }
)

// 3. Component Implementation
export const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <element
        ref={ref}
        className={cn(componentVariants({ variant, className }))}
        {...props}
      />
    )
  }
)

// 4. Display Name (for dev tools)
Component.displayName = "Component"
```

#### **11.2 Core Component Principles**

**1. Composition Over Configuration**
```tsx
{/* ❌ DON'T: Too many props */}
<Card
  title="Title"
  description="Description"
  footer="Footer"
  showBorder={true}
  showShadow={true}
/>

{/* ✅ DO: Composable structure */}
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>{/* ... */}</CardContent>
  <CardFooter>{/* ... */}</CardFooter>
</Card>
```

**2. Predictable Props Interface**
Every component accepts these standard props:
- `className`: For custom styling
- `children`: For composition
- `asChild`: For polymorphic rendering (via Radix Slot)
- Standard HTML attributes via spread (`...props`)

**3. Ref Forwarding**
All components forward refs for imperative access:
```tsx
const buttonRef = useRef<HTMLButtonElement>(null);
<Button ref={buttonRef}>Click me</Button>
```

#### **11.3 Component File Structure**

```
component/
├── Component.tsx           # Main component implementation
├── Component.css          # Component-specific styles (if needed)
├── Component.test.tsx     # Unit tests
├── __tests__/
│   └── Component.test.tsx # Additional test files
└── index.ts               # Barrel export
```

**Example Export:**
```tsx
// component/index.ts
export { Component, componentVariants } from './Component';
export type { ComponentProps } from './Component';
```

---

### 12. Component API Patterns

Consistent API patterns make components predictable and easy to use.

#### **12.1 Variant Prop Pattern**

Use `class-variance-authority` for variant-based styling:

```tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Base styles (always applied)
  "inline-flex items-center justify-center rounded-md transition-all",
  {
    variants: {
      // Visual variants
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      // Size variants
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3",
        lg: "h-10 px-6",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Extract variant types
type ButtonProps = VariantProps<typeof buttonVariants>
```

**Benefits:**
- Type-safe variant props
- Automatic TypeScript autocomplete
- Consistent variant naming
- Easy to extend with new variants

#### **12.2 AsChild Pattern (Polymorphic Components)**

Allow components to render as different elements:

```tsx
import { Slot } from 'radix-ui';

function Button({ asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';
  return <Comp {...props} />;
}

// Usage:
<Button>Normal button</Button>

<Button asChild>
  <a href="/link">Link that looks like button</a>
</Button>
```

#### **12.3 Controlled vs Uncontrolled**

Support both controlled and uncontrolled usage:

```tsx
interface ToggleProps {
  // Controlled props
  value?: boolean;
  onChange?: (value: boolean) => void;
  // Uncontrolled props
  defaultValue?: boolean;
}

function Toggle({ value, onChange, defaultValue }: ToggleProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? false);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (newValue: boolean) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  // Use currentValue and handleChange
}

// Uncontrolled usage:
<Toggle defaultValue={false} onChange={(v) => console.log(v)} />

// Controlled usage:
const [value, setValue] = useState(false);
<Toggle value={value} onChange={setValue} />
```

#### **12.4 Render Prop Pattern**

For complex, customizable rendering:

```tsx
interface SelectProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
}

function Select<T>({ items, renderItem, renderEmpty }: SelectProps<T>) {
  return (
    <div>
      {items.length === 0
        ? renderEmpty?.() ?? <p>No items</p>
        : items.map((item, i) => <div key={i}>{renderItem(item)}</div>)
      }
    </div>
  );
}

// Usage:
<Select
  items={cities}
  renderItem={(city) => (
    <div className="flex items-center gap-2">
      <MapPin size={16} />
      <span>{city.name}</span>
    </div>
  )}
  renderEmpty={() => <p>No cities available</p>}
/>
```

---

### 13. Button Components

Buttons are the primary interactive elements in TripFlow.

#### **13.1 Button Variants**

**Visual Variants:**
- `default`: Primary actions (solid teal background)
- `destructive`: Dangerous actions (red, delete confirmations)
- `outline`: Secondary actions (bordered, transparent)
- `ghost`: Tertiary actions (no background until hover)
- `link`: Text-style links

**Size Variants:**
- `xs`: Compact buttons (height: 24px)
- `sm`: Small buttons (height: 32px)
- `default`: Standard buttons (height: 36px)
- `lg`: Large buttons (height: 40px)
- `icon`, `icon-sm`, `icon-lg`: Square icon buttons

#### **13.2 Button Implementation**

```tsx
import { Button } from '@/components/ui/button';

{/* Primary action */}
<Button variant="default">Save Trip</Button>

{/* Secondary action */}
<Button variant="outline">Cancel</Button>

{/* Destructive action */}
<Button variant="destructive">Delete Trip</Button>

{/* Icon button */}
<Button variant="ghost" size="icon">
  <MapPin size={20} />
</Button>

{/* Button with icon */}
<Button variant="default">
  <Calendar size={16} />
  Schedule
</Button>
```

#### **13.3 Button States**

**Loading State:**
```tsx
<Button disabled>
  <Loader2 className="animate-spin" size={16} />
  Loading...
</Button>
```

**Disabled State:**
```tsx
<Button disabled>Disabled Button</Button>
```

**Focus State:**
Automatic via CSS - visible focus ring on keyboard navigation.

#### **13.4 Button Accessibility**

**Do's:**
- ✅ Use descriptive button text ("Save trip" not "Save")
- ✅ Include aria-label for icon-only buttons
- ✅ Use `<button>` for actions, `<a>` for navigation
- ✅ Disable buttons when action unavailable (with reason)

**Don'ts:**
- ❌ Use `<div>` or `<span>` as buttons
- ❌ Create clickable elements without keyboard support
- ❌ Use icon-only buttons without labels

**Example:**
```tsx
{/* Icon button with accessible label */}
<Button variant="ghost" size="icon" aria-label="View on map">
  <MapPin size={20} />
</Button>

{/* Link styled as button */}
<Button asChild>
  <a href="/trips/new">Create New Trip</a>
</Button>
```

---

### 14. Form Components

Form components prioritize clarity, validation feedback, and accessibility.

#### **14.1 Input Fields**

**Basic Input:**
```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div className="space-y-2">
  <Label htmlFor="city">City Name</Label>
  <Input
    id="city"
    type="text"
    placeholder="Enter city name"
    aria-describedby="city-error"
  />
</div>
```

**Input States:**
```tsx
{/* Default */}
<Input placeholder="Default state" />

{/* Disabled */}
<Input disabled placeholder="Disabled state" />

{/* Error */}
<Input
  className="border-destructive focus-visible:ring-destructive/20"
  aria-invalid="true"
  aria-describedby="error-message"
/>
<p id="error-message" className="text-sm text-destructive">
  City name is required
</p>
```

#### **14.2 Form Validation**

Use Zod for type-safe validation:

```tsx
import { z } from 'zod';

const tripSchema = z.object({
  name: z.string().min(3, "Trip name must be at least 3 characters"),
  startDate: z.date(),
  endDate: z.date(),
  budget: z.number().positive("Budget must be positive"),
});

type TripFormData = z.infer<typeof tripSchema>;
```

**Validation Feedback:**
```tsx
<div className="space-y-2">
  <Label htmlFor="trip-name">Trip Name</Label>
  <Input
    id="trip-name"
    aria-invalid={!!errors.name}
    aria-describedby={errors.name ? "name-error" : undefined}
  />
  {errors.name && (
    <p id="name-error" className="text-sm text-destructive">
      {errors.name.message}
    </p>
  )}
</div>
```

#### **14.3 Form Best Practices**

**Layout:**
- Stack form fields vertically
- Group related fields together
- Use consistent label placement (top-aligned)
- Provide sufficient spacing between fields

**Labels:**
- Every input must have a visible label
- Use `<Label>` component with `htmlFor` matching input `id`
- Make labels descriptive and concise

**Error Handling:**
- Show errors inline below the field
- Use red color + icon for visibility
- Provide actionable error messages
- Link errors with `aria-describedby`

**Example Complete Form:**
```tsx
<form className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="trip-name">Trip Name</Label>
    <Input
      id="trip-name"
      type="text"
      placeholder="e.g., Asia Adventure 2026"
    />
  </div>

  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
      <Label htmlFor="start-date">Start Date</Label>
      <Input id="start-date" type="date" />
    </div>
    <div className="space-y-2">
      <Label htmlFor="end-date">End Date</Label>
      <Input id="end-date" type="date" />
    </div>
  </div>

  <div className="flex gap-2 justify-end">
    <Button variant="outline" type="button">Cancel</Button>
    <Button type="submit">Create Trip</Button>
  </div>
</form>
```

---

### 15. Card Components

Cards are the primary content containers in TripFlow.

#### **15.1 Card Structure**

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description or subtitle</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main card content */}
  </CardContent>
  <CardFooter>
    {/* Footer actions or meta information */}
  </CardFooter>
</Card>
```

#### **15.2 Card Variants**

**Glassmorphic Card (Default):**
```tsx
<Card className="glass-panel">
  {/* Content */}
</Card>
```

**Interactive Card:**
```tsx
<Card className="glass-panel cursor-pointer hover:scale-[1.02] transition-transform">
  {/* Clickable card with hover effect */}
</Card>
```

**City-Themed Card:**
```tsx
import { getCityStyle } from '@/lib/city-colors';

const cityStyle = getCityStyle('tokyo');

<Card
  className="glass-panel"
  style={{
    borderColor: cityStyle.primary,
    backgroundColor: cityStyle.muted,
  }}
>
  {/* City-colored card */}
</Card>
```

#### **15.3 Card Best Practices**

**Content:**
- Keep card content focused and scannable
- Use clear visual hierarchy (title, description, content, actions)
- Limit actions to 1-2 primary CTAs

**Layout:**
- Maintain consistent card padding (`p-lg` or `p-4`)
- Use card grids for collections
- Ensure cards have minimum touch target size (44x44px)

**Accessibility:**
- If entire card is clickable, wrap in semantic element (`<article>`, `<a>`)
- Provide clear focus indicators
- Use proper heading hierarchy within cards

---

### 16. Navigation Components

Navigation components help users move through the application.

#### **16.1 Sidebar Navigation**

```tsx
// Sidebar.tsx implementation
<aside className="w-[280px] bg-bg-surface border-r border-border-subtle">
  <nav className="p-4 space-y-1">
    <NavItem href="/dashboard" icon={LayoutDashboard}>
      Dashboard
    </NavItem>
    <NavItem href="/itinerary" icon={MapPin}>
      Itinerary
    </NavItem>
    <NavItem href="/budget" icon={DollarSign}>
      Budget
    </NavItem>
  </nav>
</aside>
```

**Active State:**
```tsx
const isActive = pathname === href;

<a
  className={cn(
    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
    isActive
      ? "bg-accent-primary/10 text-accent-primary"
      : "text-text-secondary hover:bg-bg-surface-hover"
  )}
>
  {/* Nav item content */}
</a>
```

#### **16.2 Bottom Tab Bar (Mobile)**

```tsx
<nav className="fixed bottom-0 left-0 right-0 bg-bg-surface border-t border-border-subtle">
  <div className="flex justify-around p-2">
    <TabItem href="/dashboard" icon={Home} label="Home" />
    <TabItem href="/itinerary" icon={MapPin} label="Itinerary" />
    <TabItem href="/budget" icon={DollarSign} label="Budget" />
    <TabItem href="/settings" icon={Settings} label="Settings" />
  </div>
</nav>
```

#### **16.3 Navigation Best Practices**

**Structure:**
- Limit top-level nav items to 5-7
- Group related items under sections
- Use clear, concise labels

**Visual Feedback:**
- Highlight active page clearly
- Provide hover states
- Use icons consistently with labels

**Accessibility:**
- Use semantic `<nav>` element
- Provide `aria-current="page"` for active items
- Ensure keyboard navigation works
- Include skip links for screen readers

---

### 17. Feedback Components

Feedback components communicate system status and user actions.

#### **17.1 Toast Notifications**

**Success:**
```tsx
toast.success("Trip saved successfully!");
```

**Error:**
```tsx
toast.error("Failed to save trip. Please try again.");
```

**Info:**
```tsx
toast.info("New city added to your itinerary.");
```

**Toast Guidelines:**
- Use toasts for non-critical feedback
- Keep messages brief (under 100 characters)
- Provide actionable toasts with undo when appropriate
- Auto-dismiss after 3-5 seconds

#### **17.2 Loading States**

**Skeleton Loading:**
```tsx
<div className="space-y-4">
  <div className="h-6 bg-shimmer-bg animate-pulse rounded" />
  <div className="h-4 bg-shimmer-bg animate-pulse rounded w-3/4" />
  <div className="h-4 bg-shimmer-bg animate-pulse rounded w-1/2" />
</div>
```

**Spinner:**
```tsx
import { Loader2 } from 'lucide-react';

<Loader2 className="animate-spin text-accent-primary" size={24} />
```

**Progressive Loading:**
- Show skeleton UI for initial page loads
- Use spinners for action-triggered loading
- Provide progress indicators for long operations
- Never block the entire UI unless necessary

#### **17.3 Empty States**

```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <div className="w-16 h-16 rounded-full bg-bg-surface-subtle flex items-center justify-center mb-4">
    <MapPin size={32} className="text-text-secondary" />
  </div>
  <h3 className="text-lg font-medium mb-2">No trips yet</h3>
  <p className="text-text-secondary mb-4 max-w-sm">
    Start planning your next adventure by creating your first trip.
  </p>
  <Button>
    <Plus size={16} />
    Create Trip
  </Button>
</div>
```

**Empty State Guidelines:**
- Use when collections/lists are empty
- Include descriptive illustration or icon
- Explain why it's empty
- Provide clear call-to-action to add content
- Use encouraging, helpful tone

---

### 18. Data Display Components

Components for displaying structured data.

#### **18.1 Tables**

```tsx
<table className="w-full">
  <thead>
    <tr className="border-b border-border-subtle">
      <th className="text-left p-3 font-medium text-text-secondary">City</th>
      <th className="text-left p-3 font-medium text-text-secondary">Dates</th>
      <th className="text-right p-3 font-medium text-text-secondary">Budget</th>
    </tr>
  </thead>
  <tbody>
    {data.map((row) => (
      <tr key={row.id} className="border-b border-border-subtle hover:bg-bg-surface-hover">
        <td className="p-3">{row.city}</td>
        <td className="p-3 text-text-secondary">{row.dates}</td>
        <td className="p-3 text-right font-medium">${row.budget}</td>
      </tr>
    ))}
  </tbody>
</table>
```

**Table Best Practices:**
- Left-align text, right-align numbers
- Use subtle borders (not heavy lines)
- Provide hover states for row interaction
- Make headers sticky on scroll for long tables
- Use responsive patterns (stack on mobile)

#### **18.2 Badges & Tags**

```tsx
// Status badge
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
  <CheckCircle size={12} />
  Confirmed
</span>

// City tag
<span
  className="px-2 py-1 rounded-md text-sm font-medium"
  style={{
    backgroundColor: getCityStyle('tokyo').muted,
    color: getCityStyle('tokyo').primary,
  }}
>
  Tokyo
</span>
```

**Badge Usage:**
- Use for status indicators (confirmed, pending, cancelled)
- Keep text brief (1-2 words)
- Use semantic colors for statuses
- Make badges non-interactive (use buttons for actions)

---

## IV. Code Standards

### 19. TypeScript Conventions

TripFlow is built with TypeScript in strict mode for maximum type safety.

#### **19.1 TypeScript Configuration**

```json
// tsconfig.json highlights
{
  "compilerOptions": {
    "strict": true,              // Enable all strict type checking
    "noImplicitAny": true,       // Disallow implicit any types
    "strictNullChecks": true,    // Enforce null checking
    "noUnusedLocals": true,      // Report unused local variables
    "noUnusedParameters": true   // Report unused function parameters
  }
}
```

#### **19.2 Type Definitions**

**Use `interface` for objects, `type` for unions/primitives:**
```tsx
// ✅ Interface for object shapes
interface TripData {
  id: string;
  name: string;
  startDate: Date;
  cities: City[];
}

// ✅ Type for unions and primitives
type CitySlug = 'shanghai' | 'hongkong' | 'osaka' | 'kyoto' | 'tokyo' | 'beijing';
type Status = 'pending' | 'confirmed' | 'cancelled';
```

**Component Props:**
```tsx
// ✅ Use interface for component props
interface ActivityCardProps {
  activity: Activity;
  citySlug: CitySlug;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onOpenSuggestions?: () => void; // Optional prop with ?
}

// ✅ Use React.FC sparingly, prefer explicit typing
export const ActivityCard = ({
  activity,
  citySlug,
  ...props
}: ActivityCardProps) => {
  // Component implementation
};
```

#### **19.3 Type Best Practices**

**Avoid `any`:**
```tsx
// ❌ DON'T: Using any defeats TypeScript
const processData = (data: any) => { ... }

// ✅ DO: Use specific types or generics
const processData = <T extends Record<string, unknown>>(data: T) => { ... }

// ✅ DO: Use unknown for truly unknown data
const processAPIResponse = (data: unknown) => {
  // Type guard to narrow
  if (isValidResponse(data)) {
    // Now TypeScript knows the type
  }
}
```

**Discriminated Unions:**
```tsx
// ✅ Excellent for handling different states
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

const handleRequest = <T,>(state: RequestState<T>) => {
  switch (state.status) {
    case 'idle':
      return <div>Click to load</div>;
    case 'loading':
      return <Spinner />;
    case 'success':
      return <div>{state.data}</div>; // data is available
    case 'error':
      return <div>{state.error.message}</div>; // error is available
  }
};
```

**Utility Types:**
```tsx
// ✅ Use built-in utility types
type PartialTrip = Partial<Trip>;           // All properties optional
type ReadonlyTrip = Readonly<Trip>;         // All properties readonly
type TripName = Pick<Trip, 'name'>;         // Pick specific properties
type TripWithoutId = Omit<Trip, 'id'>;      // Omit specific properties
type NonNullableCity = NonNullable<City | null>; // Remove null/undefined
```

**Function Typing:**
```tsx
// ✅ Explicit return types for public functions
export const calculateTripCost = (
  activities: Activity[],
  accommodationCost: number
): number => {
  return activities.reduce((sum, a) => sum + a.cost, accommodationCost);
};

// ✅ Type event handlers
const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
  event.preventDefault();
  // Handle click
};
```

#### **19.4 TypeScript Do's and Don'ts**

**Do's:**
- ✅ Enable strict mode in tsconfig.json
- ✅ Define explicit types for function return values
- ✅ Use type guards for runtime type checking
- ✅ Leverage discriminated unions for state management
- ✅ Export types alongside components

**Don'ts:**
- ❌ Use `any` (use `unknown` if type is truly unknown)
- ❌ Disable TypeScript errors with `@ts-ignore` (fix the root cause)
- ❌ Create overly complex generic types (keep it simple)
- ❌ Duplicate type definitions (import and reuse)

---

### 20. React Component Patterns

Consistent React patterns ensure maintainable, performant components.

#### **20.1 Component Structure**

**Functional Components (Preferred):**
```tsx
'use client'; // Only for client components in Next.js App Router

import React, { useState, useEffect } from 'react';
import type { FC } from 'react';

interface MyComponentProps {
  title: string;
  onSave?: () => void;
}

export const MyComponent: FC<MyComponentProps> = ({ title, onSave }) => {
  // 1. Hooks
  const [count, setCount] = useState(0);

  // 2. Effects
  useEffect(() => {
    // Side effects
  }, []);

  // 3. Event handlers
  const handleClick = () => {
    setCount(count + 1);
    onSave?.();
  };

  // 4. Render
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={handleClick}>Count: {count}</button>
    </div>
  );
};
```

**Component Organization:**
1. Client/server directive (`'use client'`)
2. Imports (external libraries, then internal)
3. Type definitions
4. Component implementation
5. Exports

#### **20.2 Hooks Best Practices**

**useState:**
```tsx
// ✅ DO: Initialize with appropriate default
const [trips, setTrips] = useState<Trip[]>([]);

// ✅ DO: Use functional updates when depending on previous state
setCount(prev => prev + 1);

// ❌ DON'T: Rely on stale state
setCount(count + 1); // If count is used elsewhere, this can be stale
```

**useEffect:**
```tsx
// ✅ DO: Include all dependencies
useEffect(() => {
  fetchTrip(tripId);
}, [tripId]); // tripId is a dependency

// ✅ DO: Return cleanup functions
useEffect(() => {
  const subscription = subscribeToUpdates();
  return () => subscription.unsubscribe(); // Cleanup
}, []);

// ❌ DON'T: Use empty dependency array for values that change
useEffect(() => {
  console.log(tripId); // tripId might be stale!
}, []); // Missing tripId dependency
```

**Custom Hooks:**
```tsx
// ✅ Create custom hooks for reusable logic
export const useCityColor = (citySlug: CitySlug) => {
  const [cityStyle, setCityStyle] = useState(() => getCityStyle(citySlug));

  useEffect(() => {
    setCityStyle(getCityStyle(citySlug));
  }, [citySlug]);

  return cityStyle;
};

// Usage:
const cityStyle = useCityColor('tokyo');
```

#### **20.3 Performance Optimization**

**React.memo:**
```tsx
// ✅ Use for expensive components that receive same props often
export const ExpensiveComponent = React.memo<ExpensiveProps>(({ data }) => {
  // Expensive rendering logic
  return <div>{/* ... */}</div>;
});
```

**useMemo:**
```tsx
// ✅ Use for expensive calculations
const sortedActivities = useMemo(() => {
  return activities.sort((a, b) => a.startTime - b.startTime);
}, [activities]);
```

**useCallback:**
```tsx
// ✅ Use for callbacks passed to memoized children
const handleActivityClick = useCallback((activityId: string) => {
  setSelectedActivity(activityId);
}, []); // No dependencies = stable reference

<MemoizedActivityCard onClick={handleActivityClick} />
```

**Performance Do's and Don'ts:**
- ✅ Profile before optimizing (React DevTools Profiler)
- ✅ Use React.memo for expensive components
- ✅ Use useMemo for expensive calculations
- ✅ Use useCallback for stable function references
- ❌ Don't memo everything (adds overhead)
- ❌ Don't optimize without measuring
- ❌ Don't use memo with props that change frequently

#### **20.4 Code Splitting**

```tsx
// ✅ Lazy load components not needed immediately
const LazyMap = lazy(() => import('./MapPanel'));

// Usage with Suspense
<Suspense fallback={<Spinner />}>
  <LazyMap />
</Suspense>
```

---

### 21. File Organization

Consistent file structure improves navigation and scalability.

#### **21.1 Project Structure**

```
tripflow-next/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   ├── globals.css         # Global styles
│   │   └── trips/
│   │       └── [tripId]/       # Dynamic route
│   │           ├── page.tsx
│   │           └── layout.tsx
│   │
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI components (buttons, inputs)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── Card.tsx
│   │   ├── layout/             # Layout components (sidebar, header)
│   │   ├── Itinerary/          # Feature components
│   │   ├── Budget/
│   │   └── Dashboard/
│   │
│   ├── lib/                    # Utilities, helpers, types
│   │   ├── utils.ts            # General utilities (cn, formatDate)
│   │   ├── city-colors.ts      # City color system
│   │   ├── itinerary-data.ts   # Data types
│   │   └── constants.ts        # App constants
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-city-color.ts
│   │   └── use-trip-data.ts
│   │
│   └── types/                  # TypeScript type definitions
│       ├── trip.ts
│       ├── activity.ts
│       └── index.ts
│
├── public/                     # Static assets
│   ├── images/
│   └── icons/
│
├── docs/                       # Documentation
│   ├── TRIPFLOW-STYLE-GUIDE.md
│   └── specs/
│
└── tests/                      # Test files
    ├── e2e/                    # Playwright E2E tests
    └── unit/                   # Unit tests
```

#### **21.2 Component File Organization**

**Single Component:**
```
Button/
├── Button.tsx      # Component implementation
├── Button.css      # Component styles (if not using Tailwind)
├── Button.test.tsx # Tests
└── index.ts        # Barrel export
```

**Complex Component (with subcomponents):**
```
Card/
├── Card.tsx        # Main component
├── CardHeader.tsx  # Subcomponent
├── CardContent.tsx
├── CardFooter.tsx
├── Card.css
├── Card.test.tsx
└── index.ts        # Export all subcomponents
```

**Barrel Export Pattern:**
```tsx
// components/ui/index.ts
export { Button } from './button';
export { Input } from './input';
export { Card, CardHeader, CardContent, CardFooter } from './Card';

// Import usage:
import { Button, Card, CardContent } from '@/components/ui';
```

#### **21.3 Import Organization**

```tsx
// 1. External libraries (React, Next.js, third-party)
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// 2. Internal components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/Card';

// 3. Utilities and helpers
import { cn } from '@/lib/utils';
import { getCityStyle } from '@/lib/city-colors';

// 4. Types
import type { Activity, CitySlug } from '@/lib/itinerary-data';

// 5. Styles (if using CSS modules)
import styles from './Component.module.css';
```

**Import Best Practices:**
- Use path aliases (`@/` for `src/`)
- Group imports logically
- Sort alphabetically within groups
- Use type imports for type-only imports (`import type`)

---

### 22. Naming Conventions

Consistent naming improves code readability and maintainability.

#### **22.1 File Naming**

**Components:**
- PascalCase for component files: `Button.tsx`, `ActivityCard.tsx`
- Match component name to file name

**Utilities:**
- camelCase for utility files: `cityColors.ts`, `formatDate.ts`
- Descriptive, verb-based names

**Types:**
- camelCase with descriptive names: `trip.ts`, `activity.ts`

**Styles:**
- kebab-case for CSS files: `button.css`, `activity-card.css`
- Match component name (lowercase + hyphens)

**Tests:**
- Match source file + `.test.tsx`: `Button.test.tsx`

#### **22.2 Variable Naming**

**Constants:**
```tsx
// UPPER_SNAKE_CASE for true constants
const MAX_TRIP_DAYS = 30;
const API_BASE_URL = 'https://api.tripflow.com';

// camelCase for configuration objects
const defaultMapConfig = {
  zoom: 12,
  center: [0, 0],
};
```

**Functions:**
```tsx
// camelCase, verb-based
const calculateTripCost = (activities: Activity[]) => { ... };
const formatCurrency = (amount: number) => { ... };

// Event handlers: handle + Event
const handleClick = () => { ... };
const handleSubmit = (e: FormEvent) => { ... };

// Boolean functions: is/has/should prefix
const isValidTrip = (trip: Trip) => { ... };
const hasActivities = (trip: Trip) => trip.activities.length > 0;
const shouldShowMap = () => { ... };
```

**React Components:**
```tsx
// PascalCase
const ActivityCard = () => { ... };
const TripDetailPage = () => { ... };

// Boolean props: is/has/should prefix
interface CardProps {
  isExpanded: boolean;
  hasFooter: boolean;
  shouldShowBorder: boolean;
}
```

**State Variables:**
```tsx
// Descriptive names
const [trips, setTrips] = useState<Trip[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [selectedCity, setSelectedCity] = useState<CitySlug | null>(null);

// ❌ Avoid vague names
const [data, setData] = useState(); // What data?
const [flag, setFlag] = useState(false); // What flag?
```

#### **22.3 Type Naming**

**Interfaces:**
```tsx
// PascalCase, descriptive noun
interface Trip { ... }
interface ActivityCard Props { ... }
interface UserProfile { ... }
```

**Type Aliases:**
```tsx
// PascalCase
type CitySlug = 'shanghai' | 'hongkong' | ...;
type Status = 'pending' | 'confirmed' | 'cancelled';
type RequestState<T> = { ... };
```

**Generics:**
```tsx
// Single uppercase letter for simple generics
const identity = <T,>(value: T): T => value;

// Descriptive names for complex generics
const mapResponse = <TInput, TOutput>(
  input: TInput,
  mapper: (input: TInput) => TOutput
): TOutput => { ... };
```

#### **22.4 CSS Class Naming**

**Tailwind Classes:**
- Use utility-first approach
- Organize classes logically (layout → spacing → typography → colors)
- Use `cn()` utility for conditional classes

```tsx
<div className={cn(
  // Layout
  "flex items-center",
  // Spacing
  "p-4 gap-2",
  // Typography
  "text-sm font-medium",
  // Colors
  "bg-bg-surface text-text-primary",
  // Conditional
  isActive && "bg-accent-primary text-white"
)}>
```

**Custom CSS Classes:**
- kebab-case: `.activity-card`, `.glass-panel`
- BEM for complex components: `.card__header`, `.card__header--large`

---

### 23. Styling Conventions

TripFlow uses Tailwind CSS v4 with custom design tokens.

#### **23.1 Tailwind CSS v4 Approach**

**CSS-First Configuration:**
```css
/* globals.css */
@theme {
  --color-teal: #0D9488;
  --color-coral: #FF5A5F;
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

**Benefits:**
- Design tokens are CSS variables (accessible everywhere)
- No JavaScript config file
- Runtime theme switching
- Simpler toolchain

#### **23.2 Styling Patterns**

**Utility-First (Preferred):**
```tsx
// ✅ Use Tailwind utilities
<div className="flex items-center gap-4 p-6 rounded-lg bg-bg-surface">
  {/* Content */}
</div>
```

**Custom CSS (When Needed):**
```tsx
// ✅ Use for complex styles not expressible in Tailwind
// ActivityCard.css
.activity-card-gradient {
  background: linear-gradient(
    135deg,
    var(--city-color) 0%,
    var(--city-color-muted) 100%
  );
}

// Component
<div className="activity-card-gradient">...</div>
```

**Class Variance Authority (Component Variants):**
```tsx
// ✅ Use for component variant systems
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-white",
        outline: "border bg-transparent",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
      },
    },
  }
);
```

#### **23.3 Responsive Design**

**Mobile-First:**
```tsx
{/* Default = mobile, then enhance */}
<div className="
  p-4              {/* Mobile: 16px padding */}
  md:p-6           {/* Tablet: 24px padding */}
  lg:p-8           {/* Desktop: 32px padding */}
">
```

**Breakpoint Usage:**
- Use `sm:` sparingly (640px is large phone)
- `md:` for tablet layouts (768px)
- `lg:` for desktop layouts (1024px)
- `xl:` for large desktops (1280px)

#### **23.4 Dark Mode**

**Using CSS Variables:**
```tsx
// Automatically adapts to theme
<div className="bg-bg-surface text-text-primary">
  {/* Colors change with theme */}
</div>
```

**Dark Mode Utilities:**
```tsx
// ✅ Use sparingly for exceptional cases
<div className="bg-white dark:bg-gray-900">
  {/* Most cases should use CSS variables instead */}
</div>
```

#### **23.5 Styling Best Practices**

**Do's:**
- ✅ Use Tailwind utilities for 90% of styling
- ✅ Use CSS variables for theming
- ✅ Create reusable component variants with cva
- ✅ Keep custom CSS minimal and well-documented
- ✅ Use the `cn()` utility for conditional classes

**Don'ts:**
- ❌ Mix styling approaches (pick Tailwind or CSS, not both for same element)
- ❌ Create one-off custom classes (use Tailwind utilities)
- ❌ Hardcode colors (use design tokens)
- ❌ Forget responsive design (test on mobile)

---

### 24. State Management

TripFlow uses a pragmatic approach to state management.

#### **24.1 State Management Layers**

**1. Component State (useState)**
```tsx
// ✅ Use for UI-only state
const [isExpanded, setIsExpanded] = useState(false);
const [selectedTab, setSelectedTab] = useState('itinerary');
```

**2. Shared Component State (Context)**
```tsx
// ✅ Use for cross-component state (theme, auth)
const ThemeContext = createContext<ThemeContextType>(undefined!);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Usage
const { theme, setTheme } = useContext(ThemeContext);
```

**3. Server State (TanStack Query)**
```tsx
// ✅ Use for API data fetching and caching
import { useQuery } from '@tanstack/react-query';

const useTripData = (tripId: string) => {
  return useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => fetchTrip(tripId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Usage
const { data: trip, isLoading, error } = useTripData(tripId);
```

#### **24.2 State Management Guidelines**

**When to Use What:**

| State Type | Tool | Use Cases |
|------------|------|-----------|
| **UI State** | useState | Modals, dropdowns, form inputs, expand/collapse |
| **Cross-Component State** | Context | Theme, auth, global preferences |
| **Server State** | TanStack Query | API data, caching, optimistic updates |
| **URL State** | Next.js router | Filters, pagination, search queries |
| **Form State** | React Hook Form | Complex forms with validation |

**Best Practices:**
- ✅ Keep state as local as possible
- ✅ Lift state only when necessary
- ✅ Use URL for shareable state (filters, search)
- ✅ Use TanStack Query for all API data
- ❌ Don't use Context for frequently changing state
- ❌ Don't put server data in component state

#### **24.3 Data Fetching Patterns**

**TanStack Query Setup:**
```tsx
// app/layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**Query Hook:**
```tsx
const useActivities = (tripId: string) => {
  return useQuery({
    queryKey: ['activities', tripId],
    queryFn: () => fetchActivities(tripId),
    enabled: !!tripId, // Only fetch if tripId exists
  });
};
```

**Mutation Hook:**
```tsx
const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activity: NewActivity) => createActivity(activity),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};

// Usage
const { mutate: createActivity, isPending } = useCreateActivity();
```

---

### 25. Testing Standards

TripFlow uses Vitest for unit tests and Playwright for E2E tests.

#### **25.1 Unit Testing**

**Test Structure:**
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByText('Click me'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

**Testing Best Practices:**
- ✅ Test user behavior, not implementation
- ✅ Use semantic queries (getByRole, getByLabelText)
- ✅ Test accessibility
- ✅ Keep tests focused and simple
- ❌ Don't test internal component state
- ❌ Don't snapshot test everything

**What to Test:**
1. **User Interactions**: Clicks, typing, form submission
2. **Rendering Logic**: Conditional rendering, dynamic content
3. **Accessibility**: ARIA labels, keyboard navigation
4. **Edge Cases**: Empty states, error states, loading states

#### **25.2 E2E Testing**

**Playwright Test:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Trip Creation Flow', () => {
  test('user can create a new trip', async ({ page }) => {
    await page.goto('/dashboard');

    // Click create trip button
    await page.click('text=Create Trip');

    // Fill form
    await page.fill('[name="tripName"]', 'Asia Adventure 2026');
    await page.fill('[name="startDate"]', '2026-08-27');
    await page.fill('[name="endDate"]', '2026-09-18');

    // Submit
    await page.click('button:has-text("Create")');

    // Verify success
    await expect(page.locator('text=Trip created successfully')).toBeVisible();
    await expect(page).toHaveURL(/\/trips\/[a-z0-9-]+/);
  });
});
```

**E2E Best Practices:**
- ✅ Test critical user journeys
- ✅ Use data-testid for complex selectors
- ✅ Test across multiple browsers
- ✅ Keep tests independent
- ❌ Don't test every edge case (use unit tests)
- ❌ Don't make tests brittle with CSS selectors

#### **25.3 Test Coverage Goals**

| Type | Coverage Target | What to Test |
|------|-----------------|--------------|
| **Unit Tests** | 70%+ | Components, utilities, hooks |
| **Integration Tests** | Key flows | Forms, multi-component interactions |
| **E2E Tests** | Critical paths | Signup, trip creation, booking |

---

### 26. Performance Best Practices

Performance is a feature. TripFlow prioritizes fast, responsive experiences.

#### **26.1 Core Web Vitals Targets**

| Metric | Target | What It Measures |
|--------|--------|------------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Loading performance |
| **FID** (First Input Delay) | < 100ms | Interactivity |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Visual stability |

#### **26.2 Performance Optimization Techniques**

**Image Optimization:**
```tsx
import Image from 'next/image';

// ✅ Use Next.js Image component
<Image
  src="/photos/tokyo.jpg"
  alt="Tokyo skyline"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

**Code Splitting:**
```tsx
import { lazy, Suspense } from 'react';

// ✅ Lazy load heavy components
const LazyMap = lazy(() => import('./MapPanel'));

<Suspense fallback={<MapSkeleton />}>
  <LazyMap />
</Suspense>
```

**Font Optimization:**
```tsx
// app/layout.tsx
import { DM_Sans, Playfair_Display } from 'next/font/google';

// ✅ Optimize font loading
const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-base',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
});
```

**Memoization:**
```tsx
// ✅ Memoize expensive calculations
const sortedActivities = useMemo(() => {
  return activities.sort((a, b) => a.startTime - b.startTime);
}, [activities]);

// ✅ Memoize callbacks for stable references
const handleClick = useCallback(() => {
  setSelected(id);
}, [id]);
```

#### **26.3 Performance Monitoring**

**Measuring Performance:**
```bash
# Lighthouse audit
npm run build
npm run start
# Open Chrome DevTools > Lighthouse > Run audit

# Bundle analysis
npm run build
# Check .next/analyze/ for bundle size
```

**Performance Budget:**
- **JavaScript**: < 200KB (gzipped)
- **CSS**: < 50KB (gzipped)
- **Images**: Lazy load below fold, use WebP
- **Fonts**: < 100KB total

#### **26.4 Performance Do's and Don'ts**

**Do's:**
- ✅ Use Next.js Image component for all images
- ✅ Lazy load components below the fold
- ✅ Implement infinite scroll for long lists
- ✅ Use React.memo for expensive components
- ✅ Optimize third-party scripts

**Don'ts:**
- ❌ Load all images eagerly
- ❌ Import entire icon libraries
- ❌ Render large lists without virtualization
- ❌ Re-render unnecessarily (check with React DevTools)
- ❌ Block rendering with heavy computations

---

## V. Accessibility

### 27. Accessibility Standards

TripFlow is committed to **WCAG 2.1 Level AA compliance** minimum.

#### **27.1 Core Accessibility Principles**

**1. Perceivable**
- All content is available in text form
- Sufficient color contrast (4.5:1 for text, 3:1 for UI)
- Text can be resized up to 200%
- No information conveyed by color alone

**2. Operable**
- All functionality available via keyboard
- No keyboard traps
- Sufficient time for interactions
- No content that causes seizures

**3. Understandable**
- Clear, simple language
- Predictable navigation and interactions
- Input assistance and error prevention
- Helpful error messages

**4. Robust**
- Valid, semantic HTML
- Compatible with assistive technologies
- Progressive enhancement

#### **27.2 Semantic HTML**

**Use Appropriate Elements:**
```tsx
// ✅ Semantic HTML
<nav>
  <ul>
    <li><a href="/dashboard">Dashboard</a></li>
  </ul>
</nav>

<main>
  <article>
    <h1>Trip to Asia</h1>
    <section>
      <h2>Itinerary</h2>
      {/* Content */}
    </section>
  </article>
</main>

// ❌ Non-semantic divs
<div className="nav">
  <div className="nav-item" onClick={...}>Dashboard</div>
</div>
```

**Heading Hierarchy:**
```tsx
// ✅ Logical heading structure
<h1>Trip Overview</h1>          {/* Page title */}
  <h2>Cities</h2>                {/* Section */}
    <h3>Tokyo</h3>               {/* Subsection */}
      <h4>Day 1 Activities</h4>  {/* Detail */}

// ❌ Skip levels or use for styling
<h1>Trip Overview</h1>
  <h3>Cities</h3> {/* Skipped h2! */}
```

#### **27.3 Color Contrast**

**Minimum Ratios:**
- **Text**: 4.5:1 (normal text), 3:1 (large text 18px+)
- **UI Components**: 3:1 (buttons, form borders, focus indicators)

**Testing Contrast:**
```bash
# Use WebAIM Contrast Checker
# https://webaim.org/resources/contrastchecker/

# Example checks:
# Text: #1a1a1a on #ffffff = 16.1:1 ✅
# Button: #0D9488 on #ffffff = 3.5:1 ✅
# Subtle text: #5e5e5e on #ffffff = 7.1:1 ✅
```

**Don't Rely on Color Alone:**
```tsx
// ❌ Color only
<span className="text-red-500">Error</span>

// ✅ Color + icon + text
<span className="text-destructive flex items-center gap-1">
  <AlertCircle size={16} />
  Error: Invalid input
</span>
```

---

### 28. Keyboard Navigation

All interactive elements must be keyboard accessible.

#### **28.1 Focus Management**

**Visible Focus Indicators:**
```css
/* Automatic focus rings via Tailwind */
:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}

/* Component-specific focus styles */
.button:focus-visible {
  ring: 3px solid var(--accent-primary);
}
```

**Tab Order:**
```tsx
// ✅ Logical tab order (follows DOM order)
<form>
  <input name="firstName" />  {/* Tab 1 */}
  <input name="lastName" />   {/* Tab 2 */}
  <button type="submit">     {/* Tab 3 */}
</form>

// ✅ Use tabIndex only when necessary
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  Custom Button
</div>

// ❌ Don't use positive tabIndex
<input tabIndex={5} /> {/* Creates confusing tab order */}
```

**Focus Trapping (Modals):**
```tsx
import FocusTrap from 'focus-trap-react';

<FocusTrap active={isOpen}>
  <div role="dialog" aria-modal="true">
    <h2>Modal Title</h2>
    <button onClick={onClose}>Close</button>
  </div>
</FocusTrap>
```

#### **28.2 Keyboard Shortcuts**

Common keyboard patterns:

| Element | Keys | Action |
|---------|------|--------|
| **Button** | Enter, Space | Activate |
| **Link** | Enter | Navigate |
| **Checkbox** | Space | Toggle |
| **Select** | Arrow Up/Down | Navigate options |
| **Dialog** | Escape | Close |
| **Menu** | Arrow keys | Navigate items |

**Implementation:**
```tsx
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleClick();
  }
  if (e.key === 'Escape') {
    handleClose();
  }
};
```

---

### 29. Screen Reader Support

Screen readers must be able to navigate and understand all content.

#### **29.1 ARIA Labels**

**Descriptive Labels:**
```tsx
// ✅ Icon button with label
<button aria-label="Close dialog">
  <X size={20} />
</button>

// ✅ Input with label
<label htmlFor="city-name">City</label>
<input id="city-name" type="text" />

// ✅ Descriptive link
<a href="/trips/123" aria-label="View Asia Adventure 2026 trip details">
  View trip
</a>
```

**ARIA Described By:**
```tsx
// ✅ Error message
<input
  id="email"
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
/>
{hasError && (
  <p id="email-error" className="text-destructive">
    Please enter a valid email address
  </p>
)}
```

**ARIA Live Regions:**
```tsx
// ✅ Announce dynamic content
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {statusMessage}
</div>

// For urgent messages:
<div
  role="alert"
  aria-live="assertive"
>
  {errorMessage}
</div>
```

#### **29.2 Hidden Content**

**Visually Hidden (Screen Reader Only):**
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

```tsx
// ✅ Extra context for screen readers
<button>
  <X size={20} />
  <span className="sr-only">Close dialog</span>
</button>
```

**Hidden from Everyone:**
```tsx
// ✅ Decorative images
<img src="/decoration.svg" alt="" aria-hidden="true" />

// ✅ Decorative icons (with adjacent text)
<button>
  <Calendar aria-hidden="true" size={16} />
  Schedule Trip
</button>
```

---

### 30. ARIA Patterns

Implement common ARIA patterns for complex widgets.

#### **30.1 Dialog (Modal)**

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">Delete Trip</h2>
  <p id="dialog-description">
    Are you sure you want to delete this trip? This action cannot be undone.
  </p>
  <button onClick={handleDelete}>Delete</button>
  <button onClick={handleClose}>Cancel</button>
</div>
```

#### **30.2 Disclosure (Accordion)**

```tsx
<div>
  <button
    aria-expanded={isExpanded}
    aria-controls="content-1"
    onClick={toggleExpand}
  >
    Show Details
  </button>
  {isExpanded && (
    <div id="content-1">
      {/* Content */}
    </div>
  )}
</div>
```

#### **30.3 Tabs**

```tsx
<div role="tablist" aria-label="Trip sections">
  <button
    role="tab"
    aria-selected={selectedTab === 'itinerary'}
    aria-controls="itinerary-panel"
    onClick={() => setSelectedTab('itinerary')}
  >
    Itinerary
  </button>
  <button
    role="tab"
    aria-selected={selectedTab === 'budget'}
    aria-controls="budget-panel"
    onClick={() => setSelectedTab('budget')}
  >
    Budget
  </button>
</div>

<div
  role="tabpanel"
  id="itinerary-panel"
  aria-labelledby="itinerary-tab"
  hidden={selectedTab !== 'itinerary'}
>
  {/* Itinerary content */}
</div>
```

---

## VI. shadcn/ui Component Standards

### 35. Using shadcn Components

**Always prefer shadcn/ui over custom implementations** for:
- Forms (use `Form` + `react-hook-form` + `zod`)
- Modals (use `Dialog` or `Sheet`)
- Buttons (use `Button` with variants)
- Navigation (use `Tabs`, `Accordion`)
- Feedback (use `Toast`, `Alert`)

**Import pattern:**
```tsx
// ✅ Correct - Named imports
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

// ❌ Avoid - Default imports
import Button from '@/components/ui/button'
```

**Why shadcn?**
- **Type-safe**: Full TypeScript support
- **Accessible**: WCAG 2.1 AA compliant out of the box
- **Customizable**: Uses CSS variables, easy to theme
- **Composable**: Build complex UIs from simple primitives
- **Tree-shakeable**: Only bundle what you use

---

### 36. Component Composition

shadcn components are designed to be composed, not configured.

**✅ Compose shadcn components:**
```tsx
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add Activity</DialogTitle>
      <DialogDescription>Fill in the details below</DialogDescription>
    </DialogHeader>
    <Form>
      {/* Form fields */}
    </Form>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button type="submit">Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**❌ Don't recreate from scratch:**
```tsx
<div className="modal-overlay">
  <div className="modal-content">
    <div className="modal-header">
      <h2>Add Activity</h2>
    </div>
    {/* ... */}
  </div>
</div>
```

**Composition Benefits:**
- Accessibility built-in (focus management, ARIA attributes)
- Keyboard navigation (Tab, Escape, Enter)
- Consistent styling across the app
- Less code to maintain

---

### 37. Customization Guidelines

**Use variants, not className overrides:**

```tsx
// ✅ Preferred - Use built-in variants
<Button variant="destructive" size="sm">Delete</Button>
<Button variant="shanghai">Book Shanghai Hotel</Button>

// ⚠️ Acceptable for one-offs
<Button className="bg-[hsl(var(--chart-shanghai))]">Custom Color</Button>

// ❌ Don't override core styles with !important
<Button className="!bg-red-500 !p-10 !rounded-none">Bad</Button>
```

**When to extend vs. use className:**

**Extend the component** if you'll reuse it 3+ times:
```tsx
// src/components/tripflow/CityCard.tsx
import { Card } from '@/components/ui/card'

export function CityCard({ city, ...props }) {
  return (
    <Card
      className={cn(
        "border-l-4",
        `border-l-[var(--city-${city})]`
      )}
      {...props}
    />
  )
}
```

**Use className** for one-offs:
```tsx
<Card className="border-l-4 border-l-[var(--city-shanghai)]">
  {/* Content */}
</Card>
```

---

### 38. Form Patterns with shadcn

All forms in TripFlow use shadcn Form + react-hook-form + Zod.

**Standard Form Pattern:**

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// 1. Define schema with Zod
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  cost: z.number().min(0, "Cost cannot be negative").optional(),
})

type FormData = z.infer<typeof formSchema>

// 2. Create form with react-hook-form
function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      cost: undefined,
    },
  })

  const onSubmit = (data: FormData) => {
    // Data is type-safe and validated
    console.log(data)
  }

  // 3. Render form with shadcn Form components
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormDescription>
                This will be displayed in your itinerary
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

**Benefits:**
- ✅ **Type-safe**: Zod infers TypeScript types
- ✅ **Validated**: Client-side validation before submit
- ✅ **Accessible**: FormDescription auto-generates aria-describedby
- ✅ **Consistent**: All forms follow same pattern

---

### 39. Accessibility with shadcn

shadcn components are WCAG 2.1 AA compliant by default.

**Built-in Accessibility Features:**

1. **Keyboard Navigation**
   - All interactive elements are keyboard accessible
   - Proper tab order
   - Escape closes dialogs/sheets
   - Enter/Space activates buttons

2. **Screen Readers**
   - ARIA attributes automatically added
   - Semantic HTML elements used
   - Live regions for dynamic content

3. **Focus Management**
   - Focus trapped in modals
   - Focus returns to trigger after close
   - Visible focus indicators

**Your Responsibilities:**

Even with shadcn, you must:

```tsx
// ✅ Add labels to form fields
<FormLabel htmlFor="title">Activity Title</FormLabel>

// ✅ Add aria-label to icon-only buttons
<Button variant="ghost" aria-label="Close">
  <X size={16} />
</Button>

// ✅ Add descriptions to complex inputs
<FormDescription>
  Choose a category to organize your itinerary
</FormDescription>

// ✅ Use semantic HTML
<Sheet>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle> {/* <h2> semantically */}
      <SheetDescription>Manage preferences</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

---

### 40. TripFlow-Specific Extensions

TripFlow extends shadcn with custom variants and wrappers.

**City Button Variants:**

```tsx
<Button variant="shanghai">Shanghai</Button>
<Button variant="hongkong">Hong Kong</Button>
<Button variant="osaka">Osaka</Button>
<Button variant="kyoto">Kyoto</Button>
<Button variant="tokyo">Tokyo</Button>
<Button variant="beijing">Beijing</Button>
```

These use shadcn chart tokens (`--chart-shanghai`, etc.) that automatically adjust for dark mode.

**City Components:**

```tsx
import { CityCard } from '@/components/tripflow'
import { BudgetProgressCard } from '@/components/tripflow'
import { CityTabs } from '@/components/Itinerary/CityTabs'

// CityCard - Wrapper around shadcn Card
<CityCard city="tokyo" title="Tokyo Itinerary">
  {/* Content */}
</CityCard>

// BudgetProgressCard - Budget visualization
<BudgetProgressCard
  city="shanghai"
  totalBudget={5000}
  spent={3200}
/>

// CityTabs - Navigation with city indicators
<CityTabs cities={['shanghai', 'tokyo', 'kyoto']}>
  {(city) => <CityContent city={city} />}
</CityTabs>
```

See [Component Documentation](./components/tripflow-components.md) for full details.

---

## VII. Cross-Functional Collaboration

### 31. Designer Workflow

How designers work with the TripFlow design system.

#### **31.1 Design Tools**

**Figma as Source of Truth:**
- Component library mirrors code components
- Design tokens synced from `globals.css`
- Specs include exact spacing, colors, typography values

**Design Handoff Checklist:**
- [ ] Component states documented (default, hover, focus, disabled)
- [ ] Responsive behavior specified (mobile, tablet, desktop)
- [ ] Spacing values from design system
- [ ] Colors reference design tokens (not hex values)
- [ ] Typography uses type scale
- [ ] Interactive states defined
- [ ] Accessibility notes included
- [ ] Edge cases considered (empty, error, loading states)

#### **31.2 Design-to-Code Process**

**1. Designer Creates Component in Figma**
- Uses design system tokens
- Documents variants and states
- Adds developer notes

**2. Handoff Review Meeting**
- Designer walks through component
- Developer asks clarification questions
- Accessibility requirements discussed
- Edge cases identified

**3. Developer Implements Component**
- Follows component API patterns
- Uses exact design token values
- Implements all states
- Adds accessibility attributes

**4. Design Review**
- Designer reviews implementation in browser
- Checks responsiveness at breakpoints
- Verifies animations and interactions
- Confirms accessibility

#### **31.3 Design System Maintenance**

**Adding New Tokens:**
```css
/* 1. Add to globals.css */
@theme {
  --color-new-accent: #FF6B6B;
}

/* 2. Update Figma variables */
/* 3. Update TRIPFLOW-STYLE-GUIDE.md */
/* 4. Notify team in Slack #design-system */
```

**Requesting New Components:**
1. Create Figma spec with all states
2. Open GitHub issue with "component-request" label
3. Discuss in design-dev sync meeting
4. Assign developer for implementation
5. Review and merge

---

### 32. Developer Workflow

How developers work with the TripFlow design system.

#### **32.1 Starting a New Feature**

**1. Review Requirements**
- Read PRD and user stories
- Review Figma designs
- Identify components needed

**2. Check Existing Components**
```bash
# Browse component library
ls src/components/ui/

# Check if component exists
# Can I use Button, Card, Input?
```

**3. Plan Component Structure**
- Will this be a new base component (`ui/`) or feature component?
- Does it need variants?
- What's the API surface?

**4. Implement Following Patterns**
- Use shadcn/ui composable structure
- Follow TypeScript conventions
- Apply accessibility standards
- Write tests

#### **32.2 Code Review Checklist**

**Before Opening PR:**
- [ ] All tests pass (`npm run test`)
- [ ] TypeScript compiles without errors
- [ ] ESLint passes (`npm run lint`)
- [ ] Components are accessible (keyboard, screen reader tested)
- [ ] Responsive behavior tested (mobile, tablet, desktop)
- [ ] Dark mode tested
- [ ] Loading and error states implemented
- [ ] Code follows style guide conventions

**PR Description Template:**
```markdown
## What

Brief description of changes

## Why

Link to issue/ticket, explanation of why this change is needed

## How

Technical approach, key decisions

## Screenshots

Before/After screenshots (if visual changes)

## Testing

- [ ] Unit tests added/updated
- [ ] E2E tests added/updated (if critical flow)
- [ ] Manually tested on Chrome, Safari, Firefox
- [ ] Tested with keyboard navigation
- [ ] Tested with VoiceOver/NVDA

## Checklist

- [ ] Follows style guide
- [ ] TypeScript strict mode passes
- [ ] No console errors
- [ ] Accessible (WCAG AA)
- [ ] Responsive
- [ ] Dark mode support
```

#### **32.3 Working with Design Tokens**

**Reading Design Tokens:**
```tsx
// ✅ Use CSS variables from design system
<div style={{ backgroundColor: 'var(--bg-surface)' }}>

// ✅ Or use Tailwind utilities that reference tokens
<div className="bg-bg-surface text-text-primary">
```

**Adding New Tokens:**
1. Discuss with design team
2. Add to `globals.css` under `@theme`
3. Update Tailwind config if needed
4. Document in style guide
5. Create PR with "design-system" label

---

### 33. Contributing Guidelines

How to contribute to the TripFlow codebase and design system.

#### **33.1 Git Workflow**

**Branch Naming:**
```
feature/add-budget-calculator
fix/activity-card-overflow
docs/update-style-guide
refactor/button-component
```

**Commit Messages:**
```
feat(budget): add budget calculator component
fix(card): prevent overflow on long city names
docs(guide): add accessibility section
refactor(button): use cva for variant management

# Format: <type>(<scope>): <description>
# Types: feat, fix, docs, style, refactor, test, chore
```

**Pull Request Process:**
1. Create feature branch from `main`
2. Make changes, commit frequently
3. Push and open PR with descriptive title
4. Request review from design (if visual) and 1+ developer
5. Address feedback
6. Merge when approved

#### **33.2 Code Review Standards**

**What Reviewers Check:**
- Code follows style guide conventions
- TypeScript types are correct and strict
- Components are accessible
- Tests are comprehensive
- Performance is considered
- No security vulnerabilities

**Feedback Guidelines:**
- Be constructive and specific
- Explain *why* (not just *what* to change)
- Distinguish between blocking issues and suggestions
- Approve when standards are met

---

### 34. Component Lifecycle

How components evolve from concept to deprecation.

#### **34.1 Component Maturity Stages**

**1. Proposal**
- Figma spec created
- GitHub issue opened
- Discussed in design-dev sync

**2. Development**
- Branch created
- Component implemented
- Tests written
- PR opened

**3. Review**
- Code reviewed
- Design reviewed
- Accessibility tested
- Merged to main

**4. Stable**
- Component is production-ready
- Documented in style guide
- Used across application
- Breaking changes require deprecation process

**5. Deprecated** (if needed)
- Replacement component available
- Migration guide provided
- Deprecated in code with warnings
- Removed in next major version

#### **34.2 Versioning Components**

**Semantic Versioning:**
- **Major**: Breaking changes (remove props, change behavior)
- **Minor**: New features (add props, new variants)
- **Patch**: Bug fixes (no API changes)

**Breaking Changes:**
1. Document in CHANGELOG
2. Provide migration guide
3. Deprecate old API first (one version)
4. Remove in next major version

---

### 35. Version Control & Documentation

Keeping the design system documented and versioned.

#### **35.1 Changelog**

**Maintain CHANGELOG.md:**
```markdown
# Changelog

## [1.1.0] - 2026-02-28

### Added
- New `Badge` component with status variants
- Dark mode support for all components

### Changed
- Updated `Button` focus ring from 2px to 3px for better visibility
- Improved `Card` hover animation timing

### Fixed
- Fixed `Input` border color in dark mode
- Corrected `ActivityCard` overflow on mobile

### Deprecated
- `ButtonLegacy` - use `Button` instead, will be removed in 2.0

## [1.0.0] - 2026-02-15

### Added
- Initial design system release
- Core components (Button, Input, Card, etc.)
- Design tokens and theming system
```

#### **35.2 Documentation Updates**

**When to Update Style Guide:**
- New component added → Add component section
- Design token changed → Update token table
- Pattern established → Document pattern
- Breaking change → Update migration guide

**Documentation Review:**
- Review style guide monthly
- Keep examples up-to-date with code
- Remove outdated patterns
- Add FAQs as questions arise

---

## VIII. Quick Reference

### 41. Design Tokens Quick Reference

**Colors:**
```css
/* Text */
--text-primary: #1a1a1a
--text-secondary: #5e5e5e

/* Backgrounds */
--bg-base: #fcfcfc
--bg-surface: #ffffff
--bg-surface-hover: #f5f5f5

/* Accents */
--accent-primary: #0D9488
--accent-secondary: #FF5A5F

/* Semantic */
--color-success: #10B981
--color-warning: #F59E0B
--color-danger: #EF4444
--color-info: #3B82F6
```

**Spacing:**
```css
xs:  4px  (0.25rem)
sm:  8px  (0.5rem)
md:  16px (1rem)
lg:  24px (1.5rem)
xl:  32px (2rem)
2xl: 48px (3rem)
3xl: 64px (4rem)
```

**Typography:**
```css
H1: 40px / 500 / -0.01em
H2: 32px / 500 / -0.01em
H3: 24px / 500 / -0.01em
H4: 20px / 600 / -0.005em
Body: 16px / 400 / 0
Body Small: 14px / 400 / 0
```

**Border Radius:**
```css
sm: 6px
md: 8px
lg: 12px
xl: 16px
```

---

### 42. Component Checklist

**When Creating a New Component:**

- [ ] **Structure**
  - [ ] Uses TypeScript with strict types
  - [ ] Follows shadcn/ui composable pattern
  - [ ] Exports types alongside component
  - [ ] Forwards ref for imperative access

- [ ] **Styling**
  - [ ] Uses design tokens (no hardcoded colors)
  - [ ] Responsive (mobile-first)
  - [ ] Dark mode support
  - [ ] Uses cva for variants

- [ ] **Accessibility**
  - [ ] Semantic HTML elements
  - [ ] ARIA labels where needed
  - [ ] Keyboard navigation works
  - [ ] Focus indicators visible
  - [ ] Color contrast meets WCAG AA
  - [ ] Tested with screen reader

- [ ] **Testing**
  - [ ] Unit tests for functionality
  - [ ] Accessibility tests
  - [ ] Tests for all variants
  - [ ] E2E tests for critical flows

- [ ] **Documentation**
  - [ ] Added to component library section
  - [ ] Usage examples provided
  - [ ] Props documented
  - [ ] Edge cases noted

---

### 43. Common Patterns

**Conditional Rendering:**
```tsx
{isLoading ? <Spinner /> : <Content />}
{items.length === 0 && <EmptyState />}
{error && <ErrorMessage error={error} />}
```

**Lists:**
```tsx
{items.map((item) => (
  <Item key={item.id} {...item} />
))}
```

**Forms:**
```tsx
<form onSubmit={handleSubmit}>
  <Label htmlFor="name">Name</Label>
  <Input id="name" {...register('name')} />
  {errors.name && <Error>{errors.name.message}</Error>}
  <Button type="submit">Submit</Button>
</form>
```

**Async Data:**
```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['trips'],
  queryFn: fetchTrips,
});

if (isLoading) return <Skeleton />;
if (error) return <ErrorState error={error} />;
return <TripList trips={data} />;
```

---

## Conclusion

This style guide is a living document that will evolve as TripFlow grows. It represents our commitment to quality, consistency, and accessibility.

**Remember:**
- Consistency over cleverness
- Accessibility is not optional
- Performance is a feature
- Test your work
- Ask questions when unsure

**Resources:**
- [Material Design](https://m3.material.io/)
- [Shopify Polaris](https://polaris.shopify.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

**Questions?**
Reach out in #design-system on Slack or open a discussion on GitHub.

---

**Maintained by:** TripFlow Design & Engineering Teams
**Last Updated:** February 28, 2026
**Version:** 1.0
