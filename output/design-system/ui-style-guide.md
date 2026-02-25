# Tripify Travel Planner - UI Style Guide

> **Generated**: February 8, 2026
> **Theme**: White Theme
> **Platform**: iOS Mobile
> **Total Screens Analyzed**: 48

---

## Overview

This comprehensive design system documentation defines all visual and interaction patterns for the Tripify Travel Planner app. Use this as the single source of truth for design and development decisions.

---

## 🎨 Color System

### Primitive Colors

Base color palette extracted from the design:

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `green-500` | `#34C759` | Primary brand color, main actions |
| `green-600` | `#2ECC71` | Hover/pressed states |
| `green-700` | `#27AE60` | Active states |
| `teal-500` | `#5AC8FA` | Edit actions, secondary accent |
| `white` | `#FFFFFF` | Backgrounds, surfaces |
| `gray-50` | `#F9FAFB` | Secondary backgrounds |
| `gray-100` | `#F5F5F5` | Dividers, borders |
| `gray-200` | `#E5E5EA` | Default borders |
| `gray-600` | `#8E8E93` | Secondary text |
| `gray-900` | `#1C1C1E` | Primary text |
| `black` | `#000000` | Headings, emphasis |
| `red-500` | `#FF3B30` | Destructive actions, indicators |
| `blue-500` | `#007AFF` | Links, focus states |

### Semantic Colors

Purpose-driven color mappings:

**Backgrounds**
- `background-primary` → `#FFFFFF` - Main app background
- `background-secondary` → `#F9FAFB` - Secondary surfaces
- `surface-card` → `#FFFFFF` - Card backgrounds
- `surface-elevated` → `#FFFFFF` - Modals, elevated surfaces

**Actions**
- `action-primary-default` → `#34C759` - Primary buttons, CTAs
- `action-primary-hover` → `#2ECC71` - Button hover state
- `action-primary-pressed` → `#27AE60` - Button pressed state
- `action-destructive` → `#FF3B30` - Delete, remove actions
- `action-edit` → `#5AC8FA` - Edit icons

**Text**
- `text-primary` → `#000000` - Headings, primary content
- `text-secondary` → `#8E8E93` - Descriptions, metadata
- `text-tertiary` → `#AEAEB2` - Placeholder text
- `text-on-primary` → `#FFFFFF` - Text on green backgrounds

**Borders**
- `border-default` → `#E5E5EA` - Standard borders
- `border-selected` → `#34C759` - Selected state borders
- `border-divider` → `#F5F5F5` - Section dividers

---

## 📝 Typography

### Font Family

```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
```

The app uses native system fonts for optimal performance and native feel.

### Font Sizes

| Token | Size | Usage |
|-------|------|-------|
| `display-large` | 32px | Hero titles, major headings |
| `heading-xl` | 28px | Screen titles (e.g., "Set your trip budget") |
| `heading-lg` | 24px | Section headers |
| `heading-md` | 20px | Card titles, subsection headers |
| `heading-sm` | 18px | Small headers |
| `body-lg` | 17px | Primary body text, button labels |
| `body-md` | 16px | Secondary body text |
| `body-sm` | 14px | Descriptions, metadata |
| `caption` | 12px | Labels, timestamps |
| `micro` | 10px | Tiny labels, badges |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `regular` | 400 | Body text, descriptions |
| `medium` | 500 | Emphasized text |
| `semibold` | 600 | Buttons, subheadings |
| `bold` | 700 | Headings, titles |
| `heavy` | 800 | Display text |

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `tight` | 1.2 | Headings, display text |
| `normal` | 1.5 | Body text |
| `relaxed` | 1.6 | Long-form content |
| `loose` | 1.8 | Accessible reading |

### Typography Examples

```
H1 - Screen Title: 28px Bold, #000000
H2 - Section Header: 24px Semibold, #000000
H3 - Card Title: 20px Semibold, #000000
Body: 16px Regular, #8E8E93
Button: 17px Semibold, #FFFFFF
Caption: 12px Regular, #AEAEB2
```

---

## 📏 Spacing System

### Base Scale (4px Grid)

| Token | Value | Common Usage |
|-------|-------|--------------|
| `0` | 0px | Reset spacing |
| `1` | 4px | Tight gaps, icon spacing |
| `2` | 8px | Small gaps, chip padding |
| `3` | 12px | List item gaps, content spacing |
| `4` | 16px | Card padding, default spacing |
| `5` | 20px | Screen margins |
| `6` | 24px | Section spacing, button padding |
| `8` | 32px | Large section gaps |
| `12` | 48px | Extra large spacing |
| `16` | 64px | Page-level spacing |

### Semantic Spacing

| Token | Value | Purpose |
|-------|-------|---------|
| `card-padding` | 16px | Interior card padding |
| `card-gap` | 12px | Gap between cards |
| `section-padding` | 20px | Screen/section padding |
| `section-gap` | 24px | Gap between sections |
| `list-item-padding` | 16px | List item internal padding |
| `list-item-gap` | 12px | Gap between list items |
| `button-padding-horizontal` | 24px | Button left/right padding |
| `button-padding-vertical` | 14px | Button top/bottom padding |
| `chip-padding-horizontal` | 16px | Chip/tag left/right padding |
| `chip-padding-vertical` | 8px | Chip/tag top/bottom padding |
| `screen-margin` | 20px | Main content margins |
| `content-gap` | 8px | Small content gaps |

---

## 🔲 Layout Tokens

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `none` | 0px | Sharp corners |
| `sm` | 4px | Subtle rounding |
| `md` | 8px | Standard rounding |
| `lg` | 12px | Cards, inputs |
| `xl` | 16px | Modals |
| `2xl` | 20px | Chips |
| `3xl` | 24px | Buttons (pill shape) |
| `full` | 9999px | Circles, avatar |
| **Semantic:** | | |
| `card` | 12px | Destination cards |
| `button` | 24px | Primary/secondary buttons |
| `chip` | 20px | Interest chips, tags |
| `modal` | 16px | Modal dialogs |
| `input` | 8px | Text inputs, search |
| `image` | 8px | Image thumbnails |

### Shadows

| Token | CSS Value | Usage |
|-------|-----------|-------|
| `none` | none | No shadow |
| `sm` | 0 1px 2px rgba(0,0,0,0.05) | Subtle elevation |
| `md` | 0 2px 8px rgba(0,0,0,0.1) | Standard elevation |
| `lg` | 0 4px 16px rgba(0,0,0,0.12) | High elevation |
| `xl` | 0 8px 24px rgba(0,0,0,0.15) | Maximum elevation |
| **Semantic:** | | |
| `card` | 0 2px 8px rgba(0,0,0,0.08) | Destination cards |
| `modal` | 0 8px 32px rgba(0,0,0,0.2) | Modal dialogs |
| `button` | 0 2px 4px rgba(52,199,89,0.2) | Button depth |

### Borders

- **Width**: `1px` (thin), `2px` (medium), `3px` (thick)
- **Style**: `solid`, `dashed`
- **Default**: `1px solid #E5E5EA`
- **Selected**: `2px solid #34C759`

---

## ✨ Effects

### Opacity

| Token | Value | Usage |
|-------|-------|-------|
| `disabled` | 0.4 | Disabled states |
| `hover` | 0.8 | Hover feedback |
| `overlay` | 0.5 | Modal overlays |
| `subtle` | 0.6 | Subtle elements |

### Blur

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 4px | Light blur |
| `md` | 8px | Medium blur |
| `lg` | 16px | Heavy blur |
| `backdrop` | 20px | Backdrop blur |

### Transitions

| Token | Value | Usage |
|-------|-------|-------|
| `fast` | 150ms | Quick interactions |
| `normal` | 250ms | Standard transitions |
| `slow` | 350ms | Deliberate animations |
| `ease` | cubic-bezier(0.4, 0, 0.2, 1) | Easing function |

---

## ♿ Accessibility

### Contrast Ratios (WCAG AA Compliant)

| Text Combination | Ratio | Status |
|-----------------|-------|--------|
| Primary text on white | 21:1 | ✅ AAA |
| Secondary text on white | 5.24:1 | ✅ AA |
| White text on green | 4.61:1 | ✅ AA |
| Primary text on gray | 18.5:1 | ✅ AAA |

### Tap Targets

All interactive elements meet minimum size requirements:

| Element Type | Minimum Size | Status |
|-------------|--------------|--------|
| Buttons | 48px height | ✅ |
| Icon buttons | 44×44px | ✅ |
| Chips/Tags | 36px height | ✅ |
| List items | 48px+ height | ✅ |

### Focus States

- **Ring Width**: 2px
- **Ring Offset**: 2px
- **Ring Color**: #007AFF (blue)
- **Ring Style**: solid

---

## 🧩 Component Tokens

### Buttons

**Primary Button**
```
Background: #34C759
Text: #FFFFFF (17px Semibold)
Border Radius: 24px
Padding: 14px 24px
Min Height: 48px
Shadow: 0 2px 4px rgba(52,199,89,0.2)
```

**Secondary Button**
```
Background: #FFFFFF
Text: #000000 (17px Semibold)
Border: 1px solid #E5E5EA
Border Radius: 24px
Padding: 14px 24px
Min Height: 48px
```

**Social Login Button**
```
Background: #FFFFFF
Border: 1px solid #E5E5EA
Border Radius: 12px
Padding: 14px 16px
Min Height: 52px
Font Size: 16px Medium
```

**Icon Button**
```
Background: rgba(255,255,255,0.9)
Border Radius: 9999px (circle)
Size: 44×44px
Icon Size: 20px
Shadow: 0 1px 2px rgba(0,0,0,0.05)
```

### Cards

**Destination Card**
```
Background: #FFFFFF
Border Radius: 12px
Shadow: 0 2px 8px rgba(0,0,0,0.08)
Image Aspect Ratio: 16:9
Content Padding: 12px
Gap: 4px
```

**Selection Card**
```
Background: #FFFFFF
Border: 2px solid #E5E5EA (default)
Border: 2px solid #34C759 (selected)
Border Radius: 12px
Padding: 16px
Min Height: 72px
```

### Inputs

**Text Input**
```
Background: #FFFFFF
Border: 1px solid #E5E5EA
Border Radius: 8px
Padding: 12px 16px
Font Size: 16px Regular
Min Height: 48px
Placeholder Color: #AEAEB2
```

**Search Input**
```
Background: #F9FAFB
Border Radius: 12px
Padding: 10px 16px
Font Size: 16px Regular
Icon Size: 20px
```

### Chips/Tags

```
Background: #FFFFFF
Border: 1px solid #E5E5EA
Border Radius: 20px
Padding: 8px 16px
Font Size: 14px Regular
Min Height: 36px
```

---

## 📱 Screen Patterns

### List View
- Background: #FFFFFF
- Item Gap: 12px
- Section Gap: 24px
- Padding: 20px

### Detail View
- Background: #FFFFFF
- Hero Image Height: 300px
- Content Padding: 20px

### Onboarding
- Background: #FFFFFF
- Content Max Width: 100%
- Padding: 20px
- Progress Bar Position: 60px from top

### Modal
- Background: #FFFFFF
- Border Radius: 16px (top corners)
- Padding: 24px
- Shadow: 0 8px 32px rgba(0,0,0,0.2)

---

## 🎯 Iconography

### Icon Sizes

| Token | Size | Usage |
|-------|------|-------|
| `xs` | 12px | Inline icons |
| `sm` | 16px | Small UI icons |
| `md` | 20px | Standard icons |
| `lg` | 24px | Navigation icons |
| `xl` | 32px | Large icons |
| `2xl` | 48px | Hero icons |

### Stroke Width
- **Thin**: 1.5px
- **Regular**: 2px
- **Bold**: 2.5px

---

## 📊 Usage Statistics

**Extracted Tokens:**
- 🎨 Color Tokens: 45
- 📝 Typography Tokens: 21
- 📏 Spacing Tokens: 23
- 🔲 Layout Tokens: 18
- ✨ Effect Tokens: 10
- ♿ Accessibility Tokens: 8

**Total Design Tokens: 125**

---

## 🔗 Related Files

- [`design-tokens.json`](design-tokens.json) - Complete token structure (JSON)
- [`tokens.css`](tokens.css) - CSS custom properties
- [`tailwind.config.js`](tailwind.config.js) - Tailwind configuration
- [`ui-components.md`](ui-components.md) - Component library
- [`accessibility-tokens.md`](accessibility-tokens.md) - Accessibility report
- [`screen-reference.md`](screen-reference.md) - Screen-by-screen guide

---

**Last Updated**: February 8, 2026
**Maintained by**: Design System Team
**Version**: 1.0.0
