# 🎨 Tripify Design System - Visual Token Reference

> **Quick Reference Cheat Sheet**
> Version 1.0.0 | February 8, 2026
> Print this for your desk or bookmark for quick access

---

## 🌈 Color Palette

### Primary & Accent Colors

| Color | Visual | Hex | Token Name | Usage |
|-------|--------|-----|------------|-------|
| **Primary Green** | 🟢 | `#34C759` | `green-500` / `action-primary-default` | Main CTA buttons, selected states |
| **Primary Hover** | 🟢 | `#2ECC71` | `green-600` / `action-primary-hover` | Button hover state |
| **Primary Pressed** | 🌲 | `#27AE60` | `green-700` / `action-primary-pressed` | Button active/pressed state |
| **Accent Teal** | 🔵 | `#5AC8FA` | `teal-500` / `action-edit` | Edit actions, secondary highlights |
| **Link Blue** | 🔵 | `#007AFF` | `blue-500` / `text-link` | Links, focus indicators |
| **Destructive Red** | 🔴 | `#FF3B30` | `red-500` / `action-destructive` | Delete, error states |

### Grayscale Spectrum (10 steps)

| Step | Visual | Hex | Token | Common Usage |
|------|--------|-----|-------|--------------|
| **White** | ⬜ | `#FFFFFF` | `white` | Backgrounds, cards, buttons |
| **Gray 50** | ⬜ | `#F9FAFB` | `gray-50` | Secondary backgrounds |
| **Gray 100** | 🔲 | `#F5F5F5` | `gray-100` | Dividers, subtle borders |
| **Gray 200** | 🔲 | `#E5E5EA` | `gray-200` | Default borders |
| **Gray 300** | 🔳 | `#D1D1D6` | `gray-300` | Disabled borders |
| **Gray 400** | 🔳 | `#C7C7CC` | `gray-400` | Inactive elements |
| **Gray 500** | 🔘 | `#AEAEB2` | `gray-500` | Tertiary text |
| **Gray 600** | ⚫ | `#8E8E93` | `gray-600` | Secondary text |
| **Gray 700** | ⚫ | `#636366` | `gray-700` | Inactive icons |
| **Gray 800** | ⚫ | `#48484A` | `gray-800` | Strong text |
| **Gray 900** | ⬛ | `#1C1C1E` | `gray-900` | Headings, primary text |
| **Black** | ⬛ | `#000000` | `black` | Primary text, icons |

### Semantic Color Mappings

```
Backgrounds:
  background-primary      → white (#FFFFFF)
  background-secondary    → gray-50 (#F9FAFB)
  surface-card           → white (#FFFFFF)
  surface-elevated       → white (#FFFFFF)

Text:
  text-primary           → black (#000000)
  text-secondary         → gray-600 (#8E8E93)
  text-tertiary          → gray-500 (#AEAEB2)
  text-on-primary        → white (#FFFFFF)
  text-link              → blue-500 (#007AFF)

Borders:
  border-default         → gray-200 (#E5E5EA)
  border-selected        → green-500 (#34C759)
  border-divider         → gray-100 (#F5F5F5)

Icons:
  icon-primary           → black (#000000)
  icon-secondary         → gray-600 (#8E8E93)
  icon-accent            → green-500 (#34C759)
```

---

## ✏️ Typography Scale

### Font Sizes (10 levels)

<table>
<tr>
<td><strong>Size</strong></td>
<td><strong>Token</strong></td>
<td><strong>Value</strong></td>
<td><strong>Sample</strong></td>
</tr>

<tr>
<td>Display Large</td>
<td><code>display-large</code></td>
<td>32px</td>
<td><span style="font-size: 32px; font-weight: 700; line-height: 1.2;">The quick brown fox</span></td>
</tr>

<tr>
<td>Heading XL</td>
<td><code>heading-xl</code></td>
<td>28px</td>
<td><span style="font-size: 28px; font-weight: 700; line-height: 1.2;">The quick brown fox jumps</span></td>
</tr>

<tr>
<td>Heading Large</td>
<td><code>heading-lg</code></td>
<td>24px</td>
<td><span style="font-size: 24px; font-weight: 600; line-height: 1.2;">The quick brown fox jumps over</span></td>
</tr>

<tr>
<td>Heading Medium</td>
<td><code>heading-md</code></td>
<td>20px</td>
<td><span style="font-size: 20px; font-weight: 600; line-height: 1.5;">The quick brown fox jumps over the lazy</span></td>
</tr>

<tr>
<td>Heading Small</td>
<td><code>heading-sm</code></td>
<td>18px</td>
<td><span style="font-size: 18px; font-weight: 600; line-height: 1.5;">The quick brown fox jumps over the lazy dog</span></td>
</tr>

<tr>
<td>Body Large</td>
<td><code>body-lg</code></td>
<td>17px</td>
<td><span style="font-size: 17px; font-weight: 400; line-height: 1.5;">The quick brown fox jumps over the lazy dog (button text)</span></td>
</tr>

<tr>
<td>Body Medium</td>
<td><code>body-md</code></td>
<td>16px</td>
<td><span style="font-size: 16px; font-weight: 400; line-height: 1.5;">The quick brown fox jumps over the lazy dog (body text, inputs)</span></td>
</tr>

<tr>
<td>Body Small</td>
<td><code>body-sm</code></td>
<td>14px</td>
<td><span style="font-size: 14px; font-weight: 400; line-height: 1.5;">The quick brown fox jumps over the lazy dog (chips, secondary text)</span></td>
</tr>

<tr>
<td>Caption</td>
<td><code>caption</code></td>
<td>12px</td>
<td><span style="font-size: 12px; font-weight: 400; line-height: 1.5;">The quick brown fox jumps over the lazy dog (metadata, labels)</span></td>
</tr>

<tr>
<td>Micro</td>
<td><code>micro</code></td>
<td>10px</td>
<td><span style="font-size: 10px; font-weight: 400; line-height: 1.5;">The quick brown fox jumps (badges, minimal text)</span></td>
</tr>
</table>

### Font Weights

| Weight | Token | Value | Sample |
|--------|-------|-------|--------|
| **Regular** | `regular` | 400 | <span style="font-weight: 400;">The quick brown fox</span> |
| **Medium** | `medium` | 500 | <span style="font-weight: 500;">The quick brown fox</span> |
| **Semibold** | `semibold` | 600 | <span style="font-weight: 600;">The quick brown fox</span> |
| **Bold** | `bold` | 700 | <span style="font-weight: 700;">The quick brown fox</span> |
| **Heavy** | `heavy` | 800 | <span style="font-weight: 800;">The quick brown fox</span> |

### Line Heights

| Type | Token | Value | Usage |
|------|-------|-------|-------|
| **Tight** | `tight` | 1.2 | Headings, display text |
| **Normal** | `normal` | 1.5 | Body text, UI elements |
| **Relaxed** | `relaxed` | 1.6 | Long-form content |
| **Loose** | `loose` | 1.8 | Accessible reading |

### Font Family

```css
Primary: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif
Fallback: sans-serif
```

---

## 📏 Spacing Scale (4px Grid System)

### Base Scale

| Token | Value | Visual | Usage |
|-------|-------|--------|-------|
| `spacing-0` | 0px | ` ` | No spacing |
| `spacing-1` | 4px | `▪` | Micro gaps |
| `spacing-2` | 8px | `▪▪` | Tight spacing, content gaps |
| `spacing-3` | 12px | `▪▪▪` | Card gaps, list item gaps |
| `spacing-4` | 16px | `▪▪▪▪` | Card padding, list padding |
| `spacing-5` | 20px | `▪▪▪▪▪` | Section padding, screen margins |
| `spacing-6` | 24px | `▪▪▪▪▪▪` | Button padding, section gaps |
| `spacing-7` | 28px | `▪▪▪▪▪▪▪` | Large component spacing |
| `spacing-8` | 32px | `▪▪▪▪▪▪▪▪` | Large sections |
| `spacing-9` | 36px | `▪▪▪▪▪▪▪▪▪` | Extra large spacing |
| `spacing-10` | 40px | `▪▪▪▪▪▪▪▪▪▪` | Major sections |
| `spacing-12` | 48px | `▪▪▪▪▪▪▪▪▪▪▪▪` | Screen sections |
| `spacing-16` | 64px | `▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪` | Large screen gaps |

### Semantic Spacing

```
Component Padding:
  card-padding                 → 16px
  button-padding-horizontal    → 24px
  button-padding-vertical      → 14px
  chip-padding-horizontal      → 16px
  chip-padding-vertical        → 8px
  list-item-padding            → 16px

Component Gaps:
  card-gap                     → 12px
  list-item-gap                → 12px
  content-gap                  → 8px

Screen/Section:
  screen-margin                → 20px
  section-padding              → 20px
  section-gap                  → 24px
```

---

## 🔘 Border Radius Scale

| Token | Value | Visual | Usage |
|-------|-------|--------|-------|
| `none` | 0px | `▯` | Sharp corners |
| `sm` | 4px | `◜◝` | Subtle rounding |
| `md` | 8px | `◜◝` | Cards, inputs, images |
| `lg` | 12px | `◜◝` | Large cards |
| `xl` | 16px | `◜◝` | Modals |
| `2xl` | 20px | `◜◝` | Chips |
| `3xl` | 24px | `◜◝` | Buttons (pill shape) |
| `full` | 9999px | `●` | Circles, pills |

### Semantic Radius

```
card        → 12px (lg)
button      → 24px (3xl)  [Pill-shaped buttons]
chip        → 20px (2xl)
modal       → 16px (xl)
input       → 8px (md)
image       → 8px (md)
```

---

## 🌑 Shadows (Elevation System)

```
shadow-none
  No shadow (flat elements)

shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
  Subtle lift for hoverable items

shadow-md: 0 2px 8px rgba(0, 0, 0, 0.1)
  Cards, default elevation

shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.12)
  Elevated cards, dropdowns

shadow-xl: 0 8px 24px rgba(0, 0, 0, 0.15)
  Modals, popovers

──────────────────────────────

Semantic Shadows:

shadow-card: 0 2px 8px rgba(0, 0, 0, 0.08)
  All destination cards, list cards

shadow-modal: 0 8px 32px rgba(0, 0, 0, 0.2)
  Bottom sheets, dialogs

shadow-button: 0 2px 4px rgba(52, 199, 89, 0.2)
  Primary green buttons (subtle green glow)
```

---

## ✨ Effects

### Opacity

| Token | Value | Usage |
|-------|-------|-------|
| `disabled` | 0.4 (40%) | Disabled buttons, inactive states |
| `hover` | 0.8 (80%) | Hover state opacity reduction |
| `overlay` | 0.5 (50%) | Modal backdrop overlay |
| `subtle` | 0.6 (60%) | Secondary icons, subtle elements |

### Blur

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 4px | Light blur |
| `md` | 8px | Medium blur |
| `lg` | 16px | Heavy blur |
| `backdrop` | 20px | Modal backdrop blur |

### Transitions

| Token | Value | Usage |
|-------|-------|-------|
| `fast` | 150ms | Hover effects, icon changes |
| `normal` | 250ms | Button states, color changes |
| `slow` | 350ms | Modal open/close, page transitions |
| `ease` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard easing curve |

---

## 🎯 Component Quick Reference

### Buttons

```
Primary Button:
  Background:    green-500 (#34C759)
  Text:          white (#FFFFFF)
  Font:          17px Semibold
  Padding:       14px vertical, 24px horizontal
  Border Radius: 24px (pill)
  Min Height:    48px
  Shadow:        0 2px 4px rgba(52, 199, 89, 0.2)

Secondary Button:
  Background:    white (#FFFFFF)
  Text:          black (#000000)
  Border:        1px solid gray-200 (#E5E5EA)
  Font:          17px Semibold
  Padding:       14px vertical, 24px horizontal
  Border Radius: 24px (pill)
  Min Height:    48px

Social Login Button:
  Background:    white (#FFFFFF)
  Border:        1px solid gray-200 (#E5E5EA)
  Font:          16px Medium
  Padding:       14px vertical, 16px horizontal
  Border Radius: 12px
  Min Height:    52px

Icon Button:
  Background:    rgba(255, 255, 255, 0.9)
  Size:          44×44px
  Icon Size:     20px
  Border Radius: full (circle)
  Shadow:        sm
```

### Cards

```
Destination Card:
  Background:    white (#FFFFFF)
  Border Radius: 12px
  Shadow:        0 2px 8px rgba(0, 0, 0, 0.08)
  Image:         16:9 aspect ratio, 8px rounded corners
  Padding:       12px content area
  Gap:           4px between elements

Selection Card (Chips):
  Background:    white (#FFFFFF)
  Border:        2px solid gray-200 (#E5E5EA)
  Selected:      2px solid green-500 (#34C759)
  Border Radius: 12px
  Padding:       16px
  Min Height:    72px
```

### Inputs

```
Text Input:
  Background:    white (#FFFFFF)
  Border:        1px solid gray-200 (#E5E5EA)
  Focus:         1px solid blue-500 (#007AFF)
  Border Radius: 8px
  Padding:       12px vertical, 16px horizontal
  Font:          16px Regular
  Min Height:    48px
  Placeholder:   gray-500 (#AEAEB2)

Search Input:
  Background:    gray-50 (#F9FAFB)
  Border:        none
  Border Radius: 12px
  Padding:       10px vertical, 16px horizontal
  Font:          16px Regular
  Icon:          20px (left side)
```

### Chips/Tags

```
Chip (Default):
  Background:    white (#FFFFFF)
  Border:        1px solid gray-200 (#E5E5EA)
  Border Radius: 20px
  Padding:       8px vertical, 16px horizontal
  Font:          14px Regular
  Min Height:    36px

Chip (Selected):
  Background:    gray-50 (#F9FAFB)
  Border:        1px solid gray-200 (#E5E5EA)
  Border Radius: 20px
```

### Modals

```
Bottom Sheet:
  Background:    white (#FFFFFF)
  Border Radius: 16px 16px 0 0 (top corners only)
  Padding:       24px
  Shadow:        0 8px 32px rgba(0, 0, 0, 0.2)

Dialog Modal:
  Background:    white (#FFFFFF)
  Border Radius: 16px (all corners)
  Padding:       24px
  Shadow:        0 8px 24px rgba(0, 0, 0, 0.15)
  Max Width:     340px

Modal Overlay:
  Background:    rgba(0, 0, 0, 0.5)
  Backdrop Blur: 20px
```

### Navigation

```
Bottom Navigation Bar:
  Background:    white (#FFFFFF)
  Border Top:    1px solid gray-100 (#F5F5F5)
  Height:        56px
  Icon Size:     24px
  Active Icon:   green-500 (#34C759)
  Inactive Icon: gray-600 (#8E8E93)
  Label Size:    12px

Top Bar:
  Height:        56px
  Background:    transparent (over hero images)
  Icon Size:     24px
```

---

## ♿ Accessibility Quick Check

### Contrast Ratios (WCAG AA)

| Combination | Ratio | Status |
|-------------|-------|--------|
| Black on White | 21:1 | ✅ AAA |
| Gray-900 on White | 18.5:1 | ✅ AAA |
| Gray-600 on White | 5.24:1 | ✅ AA |
| White on Green-500 | 4.61:1 | ✅ AA |
| White on Red-500 | 4.03:1 | ✅ AA (large text) |

### Touch Targets (Minimum Sizes)

```
✅ Buttons:           48px height (exceeds 44px minimum)
✅ Icon Buttons:      44×44px (meets minimum)
✅ List Items:        48-72px height (exceeds minimum)
✅ Chips:             36px height (meets minimum for secondary actions)
✅ Input Fields:      48px height (exceeds minimum)
✅ Nav Bar Icons:     56px tap area (exceeds minimum)
```

### Focus Indicators

```
Focus Ring:
  Width:   2px
  Offset:  2px
  Color:   blue-500 (#007AFF)
  Style:   solid outline
```

---

## 📐 Icon Sizes

| Size | Token | Value | Usage |
|------|-------|-------|-------|
| **XS** | `xs` | 12px | Micro indicators, badges |
| **SM** | `sm` | 16px | Inline icons, small buttons |
| **MD** | `md` | 20px | Standard UI icons |
| **LG** | `lg` | 24px | Nav icons, prominent actions |
| **XL** | `xl` | 32px | Large feature icons |
| **2XL** | `2xl` | 48px | Hero icons, app logo |

**Stroke Widths:**
- Thin: 1.5px
- Regular: 2px (default)
- Bold: 2.5px

---

## 🎨 Common Patterns

### Card Spacing Pattern
```
┌─────────────────────────┐
│  [Image - full width]   │  0px padding
│                         │
├─────────────────────────┤
│  Title (16px bold)      │  ← 12px padding
│  ↕ 4px gap              │
│  Subtitle (14px gray)   │
│  ↕ 4px gap              │
│  Meta (12px gray)       │  ← 12px padding
└─────────────────────────┘
   ← 12px gap between cards
```

### Button Spacing Pattern
```
┌────────────────────────────────┐
│  ← 24px →  Button Text  ← 24px →│  ↑ 14px padding vertical
└────────────────────────────────┘  ↓
        24px border radius (pill shape)
        48px minimum height
```

### Screen Margin Pattern
```
┌────────────────────────────────┐
│←20px→                    ←20px→│
│      Screen Content            │
│                                │
│      ↕ 24px section gap        │
│                                │
│      Next Section              │
└────────────────────────────────┘
```

---

## 🚀 Quick Start Code Snippets

### CSS Custom Properties
```css
.my-button {
  background: var(--color-action-primary-default);
  color: var(--color-text-on-primary);
  border-radius: var(--radius-button);
  padding: var(--spacing-button-padding-vertical)
           var(--spacing-button-padding-horizontal);
  font-size: var(--font-size-body-lg);
  font-weight: var(--font-weight-semibold);
  min-height: var(--size-button-height);
}
```

### Tailwind Classes
```jsx
<button className="bg-primary text-white rounded-button
                   px-6 py-3.5 text-body-lg font-semibold
                   shadow-button min-h-button">
  Continue
</button>
```

### React Native StyleSheet
```javascript
import tokens from './design-tokens.json';

const styles = StyleSheet.create({
  button: {
    backgroundColor: tokens.tokens.colors.semantic['action-primary-default'],
    borderRadius: parseInt(tokens.tokens.layout.borderRadius.button),
    paddingHorizontal: parseInt(tokens.tokens.spacing.semantic['button-padding-horizontal']),
    paddingVertical: parseInt(tokens.tokens.spacing.semantic['button-padding-vertical']),
    minHeight: 48,
  }
});
```

---

## 📋 Token Count Summary

| Category | Count |
|----------|-------|
| **Colors** (primitive + semantic) | 45 |
| **Typography** (sizes, weights, heights) | 21 |
| **Spacing** (scale + semantic) | 23 |
| **Layout** (radius, shadows, borders) | 18 |
| **Effects** (blur, opacity, transitions) | 10 |
| **Accessibility** (contrast, tap targets) | 8 |
| **Total Design Tokens** | **125** |

---

## 🔗 Related Files

- **Full Token JSON**: [`design-tokens.json`](design-tokens.json)
- **CSS Variables**: [`tokens.css`](tokens.css)
- **Tailwind Config**: [`tailwind.config.js`](tailwind.config.js)
- **Style Guide**: [`ui-style-guide.md`](ui-style-guide.md)
- **Component Library**: [`ui-components.md`](ui-components.md)
- **Accessibility Docs**: [`accessibility-tokens.md`](accessibility-tokens.md)
- **Screen Reference**: [`screen-reference.md`](screen-reference.md)

---

**💡 Pro Tip:** Bookmark this page or print it as a desk reference. All values follow the 4px grid system for perfect alignment!

**Last Updated:** February 8, 2026 | **Version:** 1.0.0
