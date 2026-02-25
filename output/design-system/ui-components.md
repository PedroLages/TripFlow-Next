# UI Components Library

> **Tripify Travel Planner** - Component Documentation
> Generated: February 8, 2026

---

## Overview

This document catalogs all reusable UI components identified in the Tripify app. Each component is documented with its variants, states, composition, and token usage for consistent implementation.

**Total Components**: 24

---

## 🔘 Buttons

### Primary Button

The main call-to-action button used throughout the app.

**Variants:**
- Large (default) - Full-width, 48px height
- Medium - Fixed width, 48px height
- Small - Compact, 40px height

**States:**
- Default - Green background, white text
- Hover - Lighter green (#2ECC71)
- Pressed - Darker green (#27AE60)
- Disabled - 40% opacity, no interaction
- Loading - Shows spinner, maintains size

**Composition:**
- Text label (17px Semibold)
- Optional leading/trailing icon (20px)
- 24px border radius (pill shape)
- 14px vertical, 24px horizontal padding

**Tokens Used:**
- `action-primary-default` (background)
- `text-on-primary` (text color)
- `button` (border radius)
- `button-padding-horizontal` (24px)
- `button-padding-vertical` (14px)
- `shadow-button` (elevation)

**Example:**
```swift
// SwiftUI
Button("Continue") {
    // action
}
.buttonStyle(PrimaryButtonStyle())
```

---

### Secondary Button

Alternative action button with outline style.

**Variants:**
- Large (full-width)
- Medium (fixed width)

**States:**
- Default - White background, gray border
- Hover - Light gray background
- Pressed - Gray background
- Disabled - 40% opacity

**Composition:**
- White background
- 1px border (#E5E5EA)
- Black text (17px Semibold)
- 24px border radius

**Tokens Used:**
- `action-secondary-default`
- `text-primary`
- `border-default`
- `button` (radius)

---

### Social Login Buttons

OAuth provider buttons (Google, Apple, Facebook, Twitter).

**Variants:**
- Google - Multicolor logo
- Apple - Black logo
- Facebook - Blue logo
- Twitter - Light blue logo

**States:**
- Default - White background, provider logo + text
- Pressed - Light gray background

**Composition:**
- White background
- 1px border (#E5E5EA)
- Provider icon (24px) + text (16px Medium)
- 12px border radius
- 52px height

**Tokens Used:**
- `surface-card`
- `border-default`
- `radius-lg` (12px)
- `body-md` (16px)

---

### Icon Buttons

Circular buttons with icon only (no text).

**Variants:**
- Standard - 44×44px (back, bookmark, menu, share)
- Small - 36×36px (inline actions)

**States:**
- Default - White background with shadow
- Pressed - Gray background

**Composition:**
- Circular (border-radius: 9999px)
- White background (90% opacity)
- Icon (20px)
- Subtle shadow

**Tokens Used:**
- `surface-elevated`
- `radius-full`
- `shadow-sm`
- `icon-md` (20px)

**Common Icons:**
- Back arrow (←)
- Bookmark (outline/filled)
- Share
- Menu (three dots)
- Edit (pencil)
- Close (×)

---

## 🎴 Cards

### Destination Card

Primary card for displaying destinations with image, title, and location.

**Variants:**
- Grid view - Square aspect ratio
- List view - 16:9 aspect ratio
- Compact - Smaller padding

**States:**
- Default - White background, subtle shadow
- Selected - Green border (2px)
- Hover - Slight elevation increase

**Composition:**
- Full-width image (16:9 ratio)
- Title (20px Semibold, black)
- Location (14px Regular, gray) with flag emoji
- Bookmark icon (top-right overlay)
- Menu icon (bottom-right, optional)
- 12px border radius
- 12px content padding

**Tokens Used:**
- `surface-card`
- `radius-card` (12px)
- `shadow-card`
- `heading-md` (20px title)
- `body-sm` (14px location)
- `text-primary`, `text-secondary`

**Example:**
```
┌──────────────────┐
│  [Tokyo Image]   │ ← 16:9 image
│      🔖          │ ← Bookmark icon (overlay)
├──────────────────┤
│ Tokyo, Tokyo     │ ← 20px Semibold
│ 🇯🇵 Japan        │ ← 14px Regular
└──────────────────┘
```

---

### Selection Card

Used for onboarding choices (budget, travel companions, etc.).

**Variants:**
- Default (unselected)
- Selected (green border)
- Disabled (grayed out)

**States:**
- Default - White background, gray border
- Selected - Green border (2px), slight background tint
- Pressed - Gray background

**Composition:**
- Emoji/icon (optional, 24px)
- Title (20px Semibold)
- Description (14px Regular, gray)
- 12px border radius
- 16px padding
- 72px minimum height

**Tokens Used:**
- `surface-card`
- `border-default` / `border-selected`
- `radius-lg` (12px)
- `card-padding` (16px)
- `heading-md`, `body-sm`

**Example:**
```
┌─────────────────────────┐
│ Luxury 💎               │ ← 20px Semibold + emoji
│ High-end, indulgent     │ ← 14px Regular
│ experiences.            │
└─────────────────────────┘
```

---

### Article Card

Displays travel guide articles with image and metadata.

**Composition:**
- Landscape image (16:9)
- Title (16px Semibold, 2 lines max)
- Date (12px Regular, gray)
- Bookmark icon (top-right)

**Tokens Used:**
- `surface-card`
- `radius-card`
- `body-md` (title)
- `caption` (date)

---

## 📝 Inputs & Forms

### Text Input

Standard text input field.

**Variants:**
- Default
- Error (red border)
- Success (green border)
- Disabled (gray background)

**States:**
- Default - White background, gray border
- Focus - Blue border, focus ring
- Error - Red border
- Filled - Contains text
- Empty - Shows placeholder

**Composition:**
- White background
- 1px border (#E5E5EA)
- 8px border radius
- 12px vertical, 16px horizontal padding
- 16px font size
- 48px minimum height
- Placeholder text (#AEAEB2)

**Tokens Used:**
- `surface-card`
- `border-default`
- `radius-input` (8px)
- `body-md` (16px)
- `text-tertiary` (placeholder)

---

### Search Input

Search bar with icon and optional clear button.

**Composition:**
- Light gray background (#F9FAFB)
- Search icon (leading, 20px)
- Clear button (trailing, 20px, only when filled)
- 12px border radius
- No border

**Tokens Used:**
- `background-secondary`
- `radius-lg`
- `icon-md` (20px)

---

## 🏷️ Chips & Tags

### Interest Chip

Small pill-shaped tag for interests, preferences.

**Variants:**
- Default (unselected)
- Selected (filled background)
- Dismissible (with × icon)

**States:**
- Default - White background, gray border
- Selected - Light gray background
- Pressed - Gray background

**Composition:**
- Emoji + text (14px Regular)
- 20px border radius (pill)
- 8px vertical, 16px horizontal padding
- 1px border
- 36px height

**Tokens Used:**
- `surface-card`
- `border-default`
- `radius-chip` (20px)
- `chip-padding-horizontal` (16px)
- `chip-padding-vertical` (8px)
- `body-sm` (14px)

**Example:**
```
┌────────────────────┐
│ 🏖️ Beach Vacations │ ← 14px + emoji
└────────────────────┘
```

---

## 🗺️ Navigation

### Bottom Navigation Bar

Primary app navigation with 4 tabs.

**Tabs:**
1. Home (house icon)
2. Saved (bookmark icon)
3. Trips (map icon)
4. Profile (person icon)

**States:**
- Active - Green icon, green text
- Inactive - Gray icon, gray text
- Pressed - Slight scale effect

**Composition:**
- White background
- 1px top border (#F5F5F5)
- 56px height
- Icons (24px)
- Labels (12px caption, optional)
- Safe area insets respected

**Tokens Used:**
- `surface-card`
- `border-divider`
- `icon-lg` (24px)
- `icon-accent` (active)
- `icon-secondary` (inactive)
- `caption` (12px)

---

### Top Bar / Header

Screen header with title and actions.

**Variants:**
- Transparent (over images)
- Solid (white background)
- With search
- With back button

**Composition:**
- 56px height
- Back button (left, optional)
- Title (center, 17px Semibold)
- Action icons (right, 1-2 icons)
- Status bar spacing

**Tokens Used:**
- `body-lg` (17px title)
- `icon-md` (20px)

---

### Progress Indicator (Linear)

Onboarding progress bar.

**Composition:**
- 4px height
- Light gray background (#E5E5EA)
- Green fill (#34C759)
- Rounded ends (full radius)
- Animates on step change

**Tokens Used:**
- `gray-200` (background)
- `action-primary-default` (fill)
- `radius-full`

---

## 📱 Modals & Overlays

### Bottom Sheet Modal

Slides up from bottom, common for actions/selections.

**Variants:**
- Short (1/3 screen)
- Medium (1/2 screen)
- Full height (dismissible by drag)

**Composition:**
- White background
- 16px top border radius
- 24px padding
- Drag handle (optional, 36×4px gray bar)
- Backdrop overlay (50% black)

**Tokens Used:**
- `surface-elevated`
- `modal-radius` (16px top corners)
- `section-padding` (24px)
- `overlay-modal` (backdrop)

**Common Uses:**
- Share options
- Travel companion selection
- Date picker
- Filter options

---

### Loading Modal / Dialog

Centered modal showing loading state.

**Composition:**
- White background
- 16px border radius (all corners)
- 24px padding
- Circular progress indicator (48px, green)
- Title (17px Semibold)
- Description (14px Regular, gray)
- Percentage text (optional)
- Backdrop overlay (50% black)

**Tokens Used:**
- `surface-elevated`
- `modal-radius`
- `shadow-modal`
- `action-primary-default` (spinner)

**Example:**
```
┌────────────────────────────┐
│                            │
│      [Spinner 56%]         │
│                            │
│  Generating Itinerary...   │ ← 17px Semibold
│                            │
│  Please wait while our AI  │ ← 14px Regular
│  works its magic to create │
│  the perfect trip plan.    │
│                            │
└────────────────────────────┘
```

---

### Contextual Menu / Dropdown

Action menu appearing near tapped element.

**Composition:**
- White background
- 12px border radius
- Shadow (lg)
- List of actions
- Icons (leading, 20px)
- Destructive actions in red

**Common Actions:**
- Regenerate Trip
- Modify Trip Settings
- Delete Trip (red text)

**Tokens Used:**
- `surface-elevated`
- `radius-lg`
- `shadow-lg`
- `action-destructive` (delete actions)

---

## 📸 Images & Media

### Hero Image

Large top-of-screen image on detail pages.

**Composition:**
- Full width
- 300px height (typical)
- Gradient overlay at bottom (optional)
- Action buttons overlaid (bookmark, share, menu)

**Tokens Used:**
- 300px height
- Icon buttons for overlays

---

### Thumbnail Image

Small images in lists, cards.

**Variants:**
- Square (1:1)
- Landscape (16:9)
- Portrait (4:5)

**Composition:**
- 8px border radius
- Object-fit: cover
- Lazy loading

**Common Sizes:**
- List thumbnail: 80×80px
- Card thumbnail: 100×56px (16:9)
- Large thumbnail: 120×120px

---

## 🎨 Illustrations & Icons

### Empty State Illustration

Centered illustration when no content exists.

**Composition:**
- Large icon or illustration (96-120px)
- Title (20px Semibold)
- Description (14px Regular, gray)
- CTA button (optional)
- Centered layout

---

### Status Indicators

Small badges showing status.

**Types:**
- Location pin (red dot)
- Notification badge (red circle with count)
- Active indicator (green dot)

**Tokens Used:**
- `red-dot` (#FF3B30)
- `action-primary-default` (active)

---

## 📋 Lists

### Standard List Item

Row in a list view.

**Composition:**
- Leading image/icon (optional, 56×56px or 80×80px)
- Title (16px Semibold)
- Subtitle (14px Regular, gray)
- Trailing icon (chevron, bookmark, menu)
- 16px padding
- 12px gap between items
- Tap target: 48px minimum height

**Tokens Used:**
- `list-item-padding` (16px)
- `list-item-gap` (12px)
- `body-md`, `body-sm`

---

### Section Header

Divider between list sections.

**Composition:**
- Title (14px Semibold, uppercase or normal case)
- Optional "View All" link (14px, blue)
- 8px vertical padding
- Light gray background (optional)

**Tokens Used:**
- `body-sm` (14px)
- `text-link` (blue)

---

## 🔄 States & Feedback

### Loading States

**Types:**
1. **Circular Spinner** - 48px, green, rotating
2. **Linear Progress** - 4px bar at top
3. **Skeleton** - Gray placeholder boxes

---

### Error States

**Composition:**
- Red error icon (24px)
- Error message (14px Regular, red)
- Retry button (optional)

**Tokens Used:**
- `action-destructive`
- `body-sm`

---

### Success States

**Composition:**
- Green checkmark icon (24px)
- Success message (14px Regular, green)
- Auto-dismiss after 2-3 seconds

---

## 📊 Component Usage Patterns

### Most Common Components

1. **Primary Button** - Used in 90% of screens
2. **Destination Card** - Core content component
3. **Bottom Navigation** - Main app navigation
4. **Icon Buttons** - Universal actions
5. **Selection Cards** - Onboarding & preferences

### Component Relationships

```
Screen
├── Top Bar (back + title + actions)
├── Content Area
│   ├── Cards
│   ├── Lists
│   ├── Inputs
│   └── Buttons
└── Bottom Navigation
```

---

## 🛠️ Implementation Notes

### Reusability

All components should be:
- **Accessible** - WCAG AA compliant, proper tap targets
- **Responsive** - Adapt to screen sizes
- **Consistent** - Use design tokens exclusively
- **Documented** - Include usage examples

### Token Binding

Always reference tokens, never hard-code values:
```swift
// ✅ Good
.background(Color.actionPrimaryDefault)
.cornerRadius(DesignTokens.buttonRadius)

// ❌ Bad
.background(Color.green)
.cornerRadius(24)
```

---

## 🔗 Related Documentation

- [`design-tokens.json`](design-tokens.json) - Token definitions
- [`ui-style-guide.md`](ui-style-guide.md) - Visual style guide
- [`accessibility-tokens.md`](accessibility-tokens.md) - Accessibility standards
- [`screen-reference.md`](screen-reference.md) - Screen compositions

---

**Last Updated**: February 8, 2026
**Component Count**: 24
**Version**: 1.0.0
