# TripOS Design System & Style Guide

**Created**: 2026-02-09
**Status**: Complete
**Purpose**: Design tokens, visual language, and component patterns for consistent wireframe and UI generation

---

## 1. Brand Personality

### Voice Attributes
- **Empathetic**: We understand money is awkward, decisions are hard, planning sucks
- **Pragmatic**: Structure over fluff. Tools that solve real problems
- **Inclusive**: Every voice matters, every budget is valid
- **Confident**: Direct and specific, never vague or corporate

### Tone Rules
- Use contractions (we're, you'll, it's)
- Address pain directly ("Stop pretending you can afford it")
- Be specific ("73 messages, zero decisions" not "endless debates")
- Never shame users, never overpromise, never use jargon

### Visual Personality
- **Clean, not minimal**: Enough structure to guide, not so sparse it feels empty
- **Warm, not playful**: Friendly professionalism, not gamified
- **Structured, not rigid**: Clear hierarchy with breathing room
- **Trustworthy, not corporate**: Modern and approachable

---

## 2. Color Palette

### Core Colors (HSL for CSS Variables)

#### Primary - Indigo Blue
Trust, reliability, collaboration. Used for primary actions, active states, links.

| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| `--primary` | 224 76% 48% | #1D4ED8 | Primary buttons, active tabs, links |
| `--primary-foreground` | 210 40% 98% | #F8FAFC | Text on primary surfaces |
| `--primary-hover` | 224 76% 42% | #1E40AF | Hover state |
| `--primary-subtle` | 224 76% 95% | #EEF2FF | Tinted backgrounds, selected rows |

#### Secondary - Slate
Neutral, structured. Used for secondary actions, borders, text hierarchy.

| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| `--secondary` | 217 19% 27% | #374151 | Secondary buttons, body text |
| `--secondary-foreground` | 210 40% 98% | #F8FAFC | Text on secondary surfaces |

#### Accent - Warm Amber
Energy, action, warmth. Used for CTAs, highlights, attention-grabbing elements.

| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| `--accent` | 25 95% 53% | #F59E0B | Secondary CTAs, badges, highlights |
| `--accent-foreground` | 20 14% 4% | #0C0A09 | Text on accent surfaces |

#### Privacy - Teal Green
Security, trust, verified. Exclusive to blind budgeting and privacy indicators.

| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| `--privacy` | 162 72% 37% | #0D9488 | Lock icons, "Private" badges, encryption indicators |
| `--privacy-foreground` | 210 40% 98% | #F8FAFC | Text on privacy surfaces |
| `--privacy-subtle` | 162 72% 95% | #F0FDFA | Privacy info backgrounds |

#### Vote - Purple
Democracy, choice, fairness. Exclusive to voting and polling features.

| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| `--vote` | 262 83% 58% | #7C3AED | Vote buttons, poll badges, ranked choice indicators |
| `--vote-foreground` | 210 40% 98% | #F8FAFC | Text on vote surfaces |
| `--vote-subtle` | 262 83% 96% | #F5F3FF | Poll card backgrounds |

### Semantic Colors

| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| `--success` | 142 76% 36% | #16A34A | Quorum met, budget saved, vote confirmed |
| `--warning` | 38 92% 50% | #EAB308 | Deadline approaching, quorum close |
| `--destructive` | 0 84% 60% | #EF4444 | Errors, delete actions, deadline expired |
| `--info` | 199 89% 48% | #0EA5E9 | Informational badges, tooltips |

### Surface Colors

| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| `--background` | 0 0% 100% | #FFFFFF | Page background |
| `--foreground` | 224 71% 4% | #020617 | Default text |
| `--card` | 0 0% 100% | #FFFFFF | Card surfaces |
| `--card-foreground` | 224 71% 4% | #020617 | Card text |
| `--muted` | 220 14% 96% | #F1F5F9 | Muted backgrounds, disabled states |
| `--muted-foreground` | 215 16% 47% | #64748B | Secondary text, placeholders |
| `--border` | 214 32% 91% | #E2E8F0 | Borders, dividers |
| `--input` | 214 32% 91% | #E2E8F0 | Input borders |
| `--ring` | 224 76% 48% | #1D4ED8 | Focus rings |

### Color Hierarchy & Usage Rules

**CRITICAL**: TripOS has a strict color hierarchy to maintain visual clarity and semantic meaning:

1. **Primary color (indigo)** — `--primary: 224 76% 48%` — ALWAYS use for:
   - Primary action buttons (Create, Save, Submit)
   - Links and navigation highlights
   - Active tab states
   - Focus rings
   - Selected states

2. **Feature accent colors (teal, purple)** — Use ONLY as SECONDARY visual signals:
   - `--privacy` (teal): Lock icons, "Private" badges, privacy indicators — NEVER as primary button color
   - `--vote` (purple): Vote badges, poll type indicators, quorum progress bars — NEVER as primary button color

3. **When to use feature colors on buttons**:
   - ✅ Icon color inside a primary button: `<button class="bg-primary"><Lock className="text-privacy" /> Save Privately</button>`
   - ✅ Badge color: `<span class="bg-privacy-subtle text-privacy">Private</span>`
   - ❌ Button background: `<button class="bg-privacy">Save</button>` (makes teal the primary color — WRONG)

**Exception**: Buttons whose ONLY purpose is the feature itself may use feature color:
- "Lock Budget" button on privacy settings → can be teal (it IS the privacy action)
- "Open Poll Settings" inside an active poll card → can be purple (it IS the voting context)

**Default rule**: When in doubt, use `--primary` (indigo) for buttons and links. Feature colors are semantic highlights, not primary CTAs.

### Color Token Usage (Critical)

**REQUIRED**: All colors MUST use HSL CSS custom properties via Tailwind's `hsl()` function. NEVER use hex values directly.

**Correct usage**:
```css
/* In Tailwind config (tailwind.config.ts) */
colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
  },
  privacy: {
    DEFAULT: 'hsl(var(--privacy))',
    foreground: 'hsl(var(--privacy-foreground))',
    subtle: 'hsl(var(--privacy-subtle))',
  },
  vote: {
    DEFAULT: 'hsl(var(--vote))',
    foreground: 'hsl(var(--vote-foreground))',
    subtle: 'hsl(var(--vote-subtle))',
  },
  // ... etc
}

/* In CSS/components */
.budget-card {
  background-color: hsl(var(--privacy-subtle));
  border-color: hsl(var(--privacy));
  color: hsl(var(--privacy));
}

/* In JSX with Tailwind classes */
<div className="bg-privacy-subtle border-privacy text-privacy">
  Private Budget Card
</div>
```

**INCORRECT usage** (never do this):
```css
/* ❌ Direct hex values */
.budget-card {
  background-color: #F0FDFA;  /* WRONG - bypasses token system */
  border-color: #0D9488;      /* WRONG - breaks dark mode */
  color: #0D9488;             /* WRONG - not maintainable */
}

/* ❌ Arbitrary Tailwind values with hex */
<div className="bg-[#F0FDFA] border-[#0D9488] text-[#0D9488]">
  <!-- WRONG - all three issues above -->
</div>
```

**Why this matters**:
1. **Dark mode**: Hex values don't switch with `.dark` class — only CSS custom properties change
2. **Maintainability**: Changing a brand color requires updating ONE token, not 500 hex values
3. **Semantic meaning**: `bg-privacy-subtle` communicates intent; `bg-[#F0FDFA]` is opaque

**Hex values in documentation**:
- Hex equivalents appear in tables for reference ONLY (designers need them for Figma color pickers)
- Code must NEVER use hex values
- Always map to the token name: `#F0FDFA` → `hsl(var(--privacy-subtle))`

### Dark Mode

Activated via `.dark` class on `<html>` element (Tailwind class-based dark mode, consistent with shadcn/ui). Detect system preference on initial load via `prefers-color-scheme`, allow manual toggle in Settings. **Light mode is the default.**

#### Dark Surface Colors

| Token | HSL (Dark) | Hex | Light Equivalent |
|-------|-----------|-----|-----------------|
| `--background` | 222 47% 11% | #0F172A | #FFFFFF |
| `--foreground` | 210 40% 98% | #F8FAFC | #020617 |
| `--card` | 217 33% 17% | #1E293B | #FFFFFF |
| `--card-foreground` | 210 40% 98% | #F8FAFC | #020617 |
| `--muted` | 217 33% 17% | #1E293B | #F1F5F9 |
| `--muted-foreground` | 215 20% 65% | #94A3B8 | #64748B |
| `--border` | 215 25% 27% | #334155 | #E2E8F0 |
| `--input` | 215 25% 27% | #334155 | #E2E8F0 |
| `--ring` | 224 76% 58% | #3B82F6 | #1D4ED8 |

#### Dark Feature Colors

Feature colors are brightened for visibility on dark surfaces while maintaining their distinct identity.

| Token | HSL (Dark) | Hex | Adjustment |
|-------|-----------|-----|-----------|
| `--primary` | 224 76% 58% | #3B82F6 | +10% lightness |
| `--primary-foreground` | 222 47% 11% | #0F172A | Inverted |
| `--primary-subtle` | 224 40% 18% | #1E3A5F | Dark tint |
| `--privacy` | 162 72% 45% | #14B8A6 | +8% lightness |
| `--privacy-subtle` | 162 40% 15% | #1A3A35 | Dark tint |
| `--vote` | 262 83% 68% | #A78BFA | +10% lightness |
| `--vote-subtle` | 262 30% 18% | #2E2454 | Dark tint |

#### Dark Semantic Colors

| Token | HSL (Dark) | Hex | Adjustment |
|-------|-----------|-----|-----------|
| `--success` | 142 76% 42% | #22C55E | +6% lightness |
| `--warning` | 38 92% 50% | #EAB308 | Unchanged |
| `--destructive` | 0 84% 60% | #EF4444 | Unchanged |
| `--info` | 199 89% 48% | #0EA5E9 | Unchanged |

#### CSS Implementation

```css
.dark {
  --background: 222 47% 11%;
  --foreground: 210 40% 98%;
  --card: 217 33% 17%;
  --card-foreground: 210 40% 98%;
  --muted: 217 33% 17%;
  --muted-foreground: 215 20% 65%;
  --border: 215 25% 27%;
  --input: 215 25% 27%;
  --ring: 224 76% 58%;
  --primary: 224 76% 58%;
  --primary-foreground: 222 47% 11%;
  --primary-subtle: 224 40% 18%;
  --secondary: 217 33% 17%;
  --secondary-foreground: 210 40% 98%;
  --accent: 25 95% 53%;
  --accent-foreground: 20 14% 4%;
  --privacy: 162 72% 45%;
  --privacy-foreground: 222 47% 11%;
  --privacy-subtle: 162 40% 15%;
  --vote: 262 83% 68%;
  --vote-foreground: 222 47% 11%;
  --vote-subtle: 262 30% 18%;
  --success: 142 76% 42%;
  --warning: 38 92% 50%;
  --destructive: 0 84% 60%;
  --info: 199 89% 48%;
  --radius: 0.5rem;
}
```

#### Dark Mode Design Rules

1. **Never use pure black** (#000) — use dark slate (#0F172A) for warmth consistent with brand
2. **Elevate with lightness, not shadow** — cards are lighter than background; shadows invisible on dark, so rely on borders and subtle lightness differences
3. **Feature colors brightened** — teal, purple, and indigo gain +8-10% lightness for dark surface contrast
4. **Borders are critical** — on dark surfaces, borders (not shadows) define card edges and hierarchy
5. **Preserve color meaning** — teal = privacy, purple = voting, even in dark mode
6. **Subtle backgrounds for feature sections** — `--privacy-subtle` and `--vote-subtle` become very dark tints, not bright washes

---

## 3. Typography

### Font Stack

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

**Inter** chosen for: excellent readability at small sizes, extensive weight range, professional yet friendly character, free and widely available.

### Type Scale (Tailwind Classes)

| Name | Class | Size / Line-height | Weight | Usage |
|------|-------|-------------------|--------|-------|
| Display | `text-4xl` | 36px / 40px | 700 Bold | Hero headlines, landing page |
| H1 | `text-3xl` | 30px / 36px | 700 Bold | Page titles |
| H2 | `text-2xl` | 24px / 32px | 600 Semibold | Section headings |
| H3 | `text-xl` | 20px / 28px | 600 Semibold | Card titles, subsections |
| H4 | `text-lg` | 18px / 28px | 500 Medium | Labels, group headings |
| Body | `text-base` | 16px / 24px | 400 Regular | Default text, paragraphs |
| Body Small | `text-sm` | 14px / 20px | 400 Regular | Secondary text, metadata |
| Caption | `text-xs` | 12px / 16px | 400 Regular | Timestamps, badges, helpers |
| Tab Label | — | 11px / 14px | 500 Medium | Tab bar labels only (iOS HIG convention, platform exception below Caption scale) |
| Overline | `text-xs` | 12px / 16px | 600 Semibold + uppercase + tracking-wide | Section labels |

### Typography Rules
- Minimum body text: 16px (mobile readability)
- Maximum line length: 65-75 characters (reading comfort)
- Heading hierarchy: never skip levels (H1 → H2 → H3)
- Use `font-medium` (500) for interactive labels, `font-semibold` (600) for headings

---

## 4. Spacing Scale

Based on 4px base unit, using Tailwind spacing:

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `--space-1` | 4px | `p-1` | Tight gaps, icon padding |
| `--space-2` | 8px | `p-2` | Inline element spacing |
| `--space-3` | 12px | `p-3` | Small card padding |
| `--space-4` | 16px | `p-4` | Default card padding, form field spacing |
| `--space-5` | 20px | `p-5` | Medium card padding |
| `--space-6` | 24px | `p-6` | Large card padding, section spacing |
| `--space-8` | 32px | `p-8` | Section gaps |
| `--space-10` | 40px | `p-10` | Page section spacing |
| `--space-12` | 48px | `p-12` | Major section dividers |
| `--space-16` | 64px | `p-16` | Page-level vertical rhythm |

### Spacing Rules
- Cards: `p-4` (compact) or `p-6` (standard)
- Between cards: `gap-4`
- Between sections: `gap-8` or `gap-12`
- Form fields: `gap-4` vertical spacing
- Page margins: `px-4` (mobile) → `px-6` (tablet) → `px-8` (desktop)

---

## 5. Layout & Grid

### Breakpoints (Tailwind Defaults)

| Name | Width | Usage |
|------|-------|-------|
| `sm` | 640px | Large phones landscape |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Container
- Max width: 1280px (`max-w-7xl`)
- Centered with auto margins
- Responsive padding: `px-4 sm:px-6 lg:px-8`

### Grid Patterns
- **Dashboard/Trip view**: Sidebar (280px fixed) + Main content (fluid)
- **Cards**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- **Forms**: Single column, max-width 480px (`max-w-md`)
- **Itinerary**: Single column timeline layout

### Mobile-First Rules
- Design mobile layout first, enhance for larger screens
- No horizontal scrolling at any breakpoint
- Touch targets: minimum 44x44px (48px preferred)
- Bottom navigation or sticky action buttons on mobile
- Stack side-by-side elements vertically on mobile

---

## 6. Border Radius

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `--radius-sm` | 4px | `rounded-sm` | Small badges, tags |
| `--radius` | 8px | `rounded-lg` | Buttons, inputs, cards |
| `--radius-lg` | 12px | `rounded-xl` | Modals, popovers, large cards |
| `--radius-xl` | 16px | `rounded-2xl` | Bottom sheets, large mobile containers |
| `--radius-full` | 9999px | `rounded-full` | Avatars, pill badges, toggles |

**Default**: `rounded-lg` (8px) — Modern, friendly without being childish.

---

## 7. Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Subtle lift (buttons, badges) |
| `--shadow` | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` | Cards, dropdowns |
| `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` | Popovers, floating elements |
| `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` | Modals, drag states |

### Shadow Rules
- Cards at rest: `shadow-sm` or `shadow`
- Cards on hover: `shadow-md`
- Modals/dialogs: `shadow-lg`
- Dragged items: `shadow-lg` + slight scale (`scale-[1.02]`)

---

## 8. Component Patterns

All components built on **shadcn/ui** primitives with TripOS theme overrides.

### Buttons

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| Primary | `--primary` | `--primary-foreground` | none | Main CTAs (Save, Create, Submit) |
| Secondary | `--muted` | `--secondary` | `--border` | Secondary actions (Cancel, Back) |
| Outline | transparent | `--primary` | `--primary` | Tertiary actions |
| Destructive | `--destructive` | white | none | Delete, Remove |
| Ghost | transparent | `--foreground` | none | Nav items, icon buttons |
| Privacy | `--privacy` | `--privacy-foreground` | none | Save Privately, Lock actions |
| Vote | `--vote` | `--vote-foreground` | none | Cast Vote, Create Poll |

**Sizes**: `sm` (32px height), `default` (40px), `lg` (48px)
**Mobile**: Minimum `lg` size for primary actions (48px touch target)

### Cards

```
┌─────────────────────────────────┐
│ Card Header (optional)    [···] │ ← Actions menu
│─────────────────────────────────│
│                                 │
│ Card Content                    │ ← p-6 padding
│                                 │
│─────────────────────────────────│
│ Card Footer (optional)          │ ← Actions, metadata
└─────────────────────────────────┘
```

- Background: `--card` (white)
- Border: `1px solid --border`
- Radius: `--radius-lg` (12px)
- Shadow: `--shadow-sm`
- Padding: `p-6`

### Inputs

- Height: 40px (default), 48px (mobile-primary)
- Border: `1px solid --input`
- Focus: `ring-2 ring-offset-2 ring-[--ring]`
- Radius: `--radius` (8px)
- Placeholder: `--muted-foreground`
- Error state: `border-[--destructive]` + error message below

### Avatars & Presence

- Sizes: `sm` (32px), `md` (40px), `lg` (48px)
- Shape: `rounded-full`
- Fallback: Initials on `--primary-subtle` background
- Online indicator: 10px green dot, bottom-right
- Stack (group): Overlapping with `-ml-2`, max 5 visible + "+N" badge

### Badges

| Variant | Background | Text | Usage |
|---------|-----------|------|-------|
| Default | `--muted` | `--foreground` | General labels |
| Privacy | `--privacy-subtle` | `--privacy` | "Private", "Encrypted" |
| Vote | `--vote-subtle` | `--vote` | Poll types, vote status |
| Success | `--success/10%` | `--success` | "Quorum Met", "Completed" |
| Warning | `--warning/10%` | `--warning` | "Closing Soon", "Low Participation" |
| Destructive | `--destructive/10%` | `--destructive` | "Expired", "Failed" |

### Modals / Dialogs

- Max width: `max-w-lg` (512px)
- Backdrop: `bg-black/50` with blur
- Radius: `--radius-lg`
- Shadow: `--shadow-lg`
- Animation: Fade in + scale from 95%

### Toast Notifications

- Position: Bottom-center (mobile), bottom-right (desktop)
- Duration: 4 seconds (info), 6 seconds (error), persistent (action required)
- Variants: success (green left border), error (red), info (blue), warning (amber)

---

## 9. Feature-Specific Styles

### Blind Budgeting

**Color system**: Uses `--privacy` teal exclusively (never `--primary` blue)

- **Budget input field**: Standard input with lock icon (left) + "Private" badge (right)
- **Privacy card background**: `--privacy-subtle` (#F0FDFA)
- **Lock icon**: `--privacy` color, 20px size
- **"Private" badge**: Teal badge with lock icon prefix
- **Group max card**: Standard card with group icon, neutral `--card` background
- **Confidence bar**: Horizontal bar using `--privacy` fill
- **Explainer modal**: 3-step carousel with numbered steps, teal accent

```
Visual language:
🔒 Lock icon = "only you see this"
👥 Group icon = "everyone sees this"
✅ Checkmark = "budget saved privately"
```

### Structured Voting

**Color system**: Uses `--vote` purple exclusively

- **Poll card**: White card with purple left border (4px)
- **Vote buttons**: Large, tappable (48px height minimum)
- **Ranked choice**: Drag-and-drop cards with numbered rank badges (purple circles)
- **Progress bars**: `--vote` fill on `--muted` background
- **Deadline badge**: Warning badge when < 24h remaining
- **Quorum indicator**: Progress bar with fraction ("5 of 8 voted")

```
Visual language:
🗳️ Ballot icon = "active poll"
✅ Checkmark = "you've voted"
⏰ Clock icon = "deadline approaching"
🔒 Lock icon = "anonymous poll"
```

### Activity Feed

- Compact list layout, single column
- Avatar (32px) + Action text + Timestamp
- Grouped by day with date dividers
- Subtle background alternation for readability

### Itinerary

- Day-by-day timeline with left-border connector line
- Activity cards: Time (left) + Details (right)
- Drag handle: 6-dot hamburger icon, left edge
- Map pin colors: Match activity category

---

## 10. Iconography

### Icon Library

**CRITICAL**: TripOS uses **Lucide Icons ONLY**. Never use Material Icons, Heroicons, Font Awesome, or any other icon library.

**Why Lucide**:
- Bundled with shadcn/ui (zero additional dependencies)
- Consistent stroke-based design
- Comprehensive icon set (1000+ icons)
- React components available via `lucide-react` package

**How to reference in wireframes and code**:
- Format: `lucide:[icon-name]`
- Examples: `lucide:lock`, `lucide:vote`, `lucide:users`, `lucide:map-pin`
- Component: `<Lock className="w-5 h-5" />` (React), `<i data-lucide="lock"></i>` (HTML)

**Icon naming**:
- Use kebab-case: `lucide:arrow-up`, not `lucide:ArrowUp`
- Use Lucide's exact icon names (see lucide.dev for full list)
- If icon doesn't exist in Lucide, choose closest equivalent or request custom icon

### Key Icons by Feature

| Feature | Lucide Reference | React Component | Usage |
|---------|------------------|-----------------|-------|
| Privacy/Lock | `lucide:lock` | `<Lock />` | Budget privacy, anonymous votes |
| Unlock | `lucide:unlock` | `<Unlock />` | Public votes, visible data |
| Group | `lucide:users` | `<Users />` | Group data, shared information |
| Vote | `lucide:vote` | `<Vote />` | Polls, voting actions |
| Check | `lucide:check` | `<Check />` | Confirmed, complete, valid |
| Warning | `lucide:alert-triangle` | `<AlertTriangle />` | Deadlines, low quorum |
| Clock | `lucide:clock` | `<Clock />` | Deadlines, timestamps |
| Map Pin | `lucide:map-pin` | `<MapPin />` | Locations, activities |
| Calendar | `lucide:calendar` | `<Calendar />` | Dates, scheduling |
| Drag Handle | `lucide:grip-vertical` | `<GripVertical />` | Drag handles |
| Budget/Money | `lucide:dollar-sign` | `<DollarSign />` | Expenses, budgets |
| Eye | `lucide:eye` | `<Eye />` | Public/visible toggle |
| Eye Off | `lucide:eye-off` | `<EyeOff />` | Hidden/private toggle |
| Shield | `lucide:shield` | `<Shield />` | Security, protection |
| Arrow Up | `lucide:arrow-up` | `<ArrowUp />` | Rank adjustment, sort ascending |
| Arrow Down | `lucide:arrow-down` | `<ArrowDown />` | Rank adjustment, sort descending |
| Plus | `lucide:plus` | `<Plus />` | Add actions |
| Trash | `lucide:trash-2` | `<Trash2 />` | Delete actions |
| Edit | `lucide:pencil` | `<Pencil />` | Edit actions |
| Share | `lucide:share-2` | `<Share2 />` | Invite, share |
| Bell | `lucide:bell` | `<Bell />` | Notifications |
| Settings | `lucide:settings` | `<Settings />` | Settings, configuration |
| Home | `lucide:home` | `<Home />` | Overview, dashboard |
| Menu | `lucide:menu` | `<Menu />` | Mobile hamburger menu |
| X/Close | `lucide:x` | `<X />` | Close modals, dismiss |
| Chevron Down | `lucide:chevron-down` | `<ChevronDown />` | Expand/collapse, dropdown indicator |

### Icon Rules
- Size: 16px (inline), 20px (buttons), 24px (headers)
- Color: Inherit from parent text color
- Feature icons: Use feature color (teal for privacy, purple for voting)
- Interactive icons: Include hover state (opacity or color shift)

---

## 11. Motion & Animation

### Principles
- **Purposeful**: Every animation communicates state change
- **Quick**: 150-200ms for micro-interactions, 300ms for modals
- **Consistent**: Same easing curve throughout

### Timing

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | 150ms | `ease-out` | Button press, toggle, hover |
| Standard | 200ms | `ease-in-out` | Card expand, accordion, tab switch |
| Enter | 300ms | `ease-out` | Modal appear, toast slide-in |
| Exit | 200ms | `ease-in` | Modal dismiss, toast fade-out |
| Long | 500ms | `ease-in-out` | Page transition, skeleton load |

### Key Animations
- **Vote submission**: Button press → checkmark appears (150ms)
- **Budget save**: Lock icon animates to "locked" state (200ms)
- **Real-time vote update**: Progress bar width animates (300ms ease-out)
- **Drag-and-drop**: Picked item scales up 2% + shadow-lg (150ms)
- **Toast notification**: Slide up from bottom + fade in (300ms)
- **Skeleton loading**: Pulse animation on `--muted` backgrounds

---

## 12. Responsive Behavior

### Mobile (< 768px)
- Single-column layout
- Bottom tab navigation (5 items max)
- Full-width cards
- Stacked side-by-side elements
- Budget cards: stack vertically ("Your Budget" above "Group Max")
- Poll options: full-width cards, large touch targets
- Floating action button for primary creation actions

### Tablet (768px - 1024px)
- Two-column layouts where appropriate
- Side-by-side budget comparison cards
- Sidebar collapsed by default (hamburger toggle)
- Poll cards: 2-column grid

### Desktop (> 1024px)
- Sidebar navigation (280px fixed)
- Multi-column content area
- Side-by-side budget comparison cards
- Poll cards: 2-3 column grid
- Hover states enabled
- Keyboard shortcuts visible

---

## 13. Accessibility

### WCAG 2.1 AA Compliance

**CRITICAL**: Use standard HTML accessibility attributes. Never invent custom attributes.

#### Images

- **Informative images**: Use standard `alt` attribute (NOT `data-alt`, `title`, or custom attributes)
  - ✅ `<img src="logo.png" alt="TripOS logo" />`
  - ❌ `<img src="logo.png" data-alt="TripOS logo" />` (non-standard)
  - ❌ `<img src="logo.png" title="TripOS logo" />` (title is for tooltips, not alt text)

- **Decorative images**: Use empty alt attribute
  - ✅ `<img src="background-pattern.svg" alt="" />`
  - NOT `data-decorative` or omitting the attribute entirely

#### Icons

- **Icon buttons** (buttons with ONLY an icon, no visible text):
  - MUST have `aria-label` describing the action
  - ✅ `<button aria-label="Close modal"><X className="w-5 h-5" /></button>`
  - ❌ `<button><X /></button>` (screen reader reads nothing)

- **Decorative icons** (icons accompanying visible text):
  - MUST have `aria-hidden="true"` to prevent double-reading
  - ✅ `<button>Save Privately <Lock aria-hidden="true" className="w-4 h-4" /></button>`
  - ❌ `<button>Save Privately <Lock className="w-4 h-4" /></button>` (screen reader reads "Save Privately Lock")

- **Icons with visible label in DOM**:
  - Icon still needs `aria-hidden="true"` (label provides context)
  - ✅ `<div><Lock aria-hidden="true" /> <span>Private Budget</span></div>`

#### Links

- **Link purpose must be clear from link text alone**:
  - ✅ `<a href="/votes">View all polls</a>`
  - ❌ `<a href="/votes">Click here</a>` (ambiguous)
  - If context is only visual: add `aria-label`
    - ✅ `<a href="/votes" aria-label="View all polls"><ChevronRight /></a>`

#### Form Inputs

- **All inputs MUST have associated labels**:
  - ✅ `<label for="budget">Your budget</label><input id="budget" type="number" />`
  - ✅ `<input type="number" aria-label="Your budget" />` (if no visible label)
  - ❌ `<input type="number" placeholder="Budget" />` (placeholder is not a label)

#### Common Violations to Avoid

| ❌ WRONG | ✅ CORRECT | Why |
|---------|-----------|-----|
| `<img data-alt="logo">` | `<img alt="logo">` | `data-alt` is non-standard; use `alt` |
| `<button><X /></button>` | `<button aria-label="Close"><X /></button>` | Icon-only button needs aria-label |
| `<button>Save <Lock /></button>` | `<button>Save <Lock aria-hidden="true" /></button>` | Decorative icon next to text needs aria-hidden |
| `<a href="/votes">More</a>` | `<a href="/votes">View all polls</a>` | Link text must describe destination |
| `<input placeholder="Email">` | `<label>Email<input /></label>` | Placeholder is not a label |

#### Other WCAG Requirements

- **Color contrast**: Minimum 4.5:1 for body text, 3:1 for large text
- **Focus indicators**: Visible ring on all interactive elements (`ring-2`)
- **Touch targets**: Minimum 44x44px
- **Keyboard navigation**: Full tab-through support, Enter/Space for activation
- **Reduced motion**: Respect `prefers-reduced-motion` (disable animations)

### Voting Accessibility
- Drag-and-drop has up/down button alternatives
- Color + icon (never color alone) for status indicators
- Screen reader announces: poll question, options, current votes, deadline

### Blind Budgeting Accessibility
- Lock icon + "Private" label (not icon alone)
- Screen reader announces: "Your budget is private. Only you can see this amount."
- Numeric input with clear currency label

---

## Quick Reference: CSS Variables Block

```css
:root {
  /* Surface */
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --card: 0 0% 100%;
  --card-foreground: 224 71% 4%;
  --popover: 0 0% 100%;
  --popover-foreground: 224 71% 4%;
  --muted: 220 14% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 224 76% 48%;

  /* Primary - Indigo Blue */
  --primary: 224 76% 48%;
  --primary-foreground: 210 40% 98%;

  /* Secondary - Slate */
  --secondary: 217 19% 27%;
  --secondary-foreground: 210 40% 98%;

  /* Accent - Warm Amber */
  --accent: 25 95% 53%;
  --accent-foreground: 20 14% 4%;

  /* Destructive - Red */
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;

  /* Semantic */
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;

  /* Feature: Privacy (Blind Budgeting) */
  --privacy: 162 72% 37%;
  --privacy-foreground: 210 40% 98%;
  --privacy-subtle: 162 72% 95%;

  /* Feature: Voting */
  --vote: 262 83% 58%;
  --vote-foreground: 210 40% 98%;
  --vote-subtle: 262 83% 96%;

  /* Radius */
  --radius: 0.5rem;
}
```

---

**End of Style Guide**
