# Prompt Improvements from Phase A Audit

**Created**: 2026-02-10
**Status**: Complete
**Purpose**: Document systemic wireframe issues identified in Phase A audit and the prompt changes needed to prevent recurrence

---

## Executive Summary

Phase A audit of 51 generated wireframes revealed 5 systemic issues affecting all screens. These issues stem from **missing or unclear prompt language**, not from the design system itself. The style-guide.md and design-principles.md correctly define the rules — the wireframe generation prompts (desktop-wireframe-prompts.md) failed to enforce them.

**Critical insight**: These are prompt engineering problems. The design tokens are correct. The principles are clear. The prompts were underspecified.

**Impact**: All 51 generated wireframes need fixes. More importantly, the prompts must be updated so future regenerations (and Phase B mobile wireframes) don't repeat these errors.

---

## Systemic Issues → Prompt Fixes

### Issue 1: Primary Color Fracture

**Problem**: Budget and voting screens used teal/purple as PRIMARY colors for all buttons and interactive elements, instead of reserving them as semantic accent colors. Indigo (--primary) was absent from these screens entirely.

**Root cause in prompts**:
- D8 (Voting, line 1024): `"Create Poll" button (vote-colored background, white text, Vote icon)`
- D11 (Blind Budget, line 1475): `"Save Privately" button: privacy-colored background, white text, Lock icon left`
- D9 (Cast Vote, line 1186): `"Yes" button: background hsl(var(--vote-subtle)), border hsl(var(--vote))`

These instructions tell AI to use feature colors as primary button colors. The prompts never say "Use --primary (indigo) for primary actions; use --vote/--privacy as SECONDARY highlights only."

**Prompt changes made**:

#### 1. Added to style-guide.md § Color Palette (new section after line 101)

```markdown
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
   - ✅ Icon color inside a primary button: `<button class="bg-primary">🔒 Save Privately</button>` (teal lock icon, indigo button)
   - ✅ Badge color: `<span class="bg-privacy-subtle text-privacy">Private</span>`
   - ❌ Button background: `<button class="bg-privacy">Save</button>` (makes teal the primary color — WRONG)

**Exception**: Buttons whose ONLY purpose is the feature itself may use feature color:
- "Lock Budget" button on privacy settings → can be teal (it IS the privacy action)
- "Open Poll Settings" inside an active poll card → can be purple (it IS the voting context)

**Default rule**: When in doubt, use --primary (indigo) for buttons and links. Feature colors are semantic highlights, not primary CTAs.
```

#### 2. Updated D8 (Voting) prompt (line 1024):

**Before**:
```
- "Create Poll" button (vote-colored background, white text, Vote icon) — top right
```

**After**:
```
- "Create Poll" button (PRIMARY color background, white text, Vote icon) — top right
  - IMPORTANT: Use --primary (indigo), NOT --vote (purple). Purple is for poll cards and badges, NOT primary actions.
```

#### 3. Updated D11 (Blind Budget) prompt (line 1475):

**Before**:
```
- "Save Privately" button: privacy-colored background, white text, Lock icon left
```

**After**:
```
- "Save Privately" button: PRIMARY color background, white text, Lock icon (privacy-colored) left
  - IMPORTANT: Button uses --primary (indigo), only the Lock icon uses --privacy (teal). Teal is for privacy indicators, NOT primary button backgrounds.
```

#### 4. Updated D9 (Cast Vote) prompt (lines 1184-1187):

**Before**:
```
- Two large buttons side-by-side (desktop) or stacked (mobile):
  - "Yes" button: `hsl(var(--vote-subtle))` background, `hsl(var(--vote))` border (2px), Check icon, min height 56px
  - "No" button: `hsl(var(--muted))` background, `hsl(var(--border))` border (1px), X icon, min height 56px
```

**After**:
```
- Two large buttons side-by-side (desktop) or stacked (mobile):
  - "Yes" button: `hsl(var(--primary))` background (indigo), `hsl(var(--primary-foreground))` text, Check icon, min height 56px
  - "No" button: `hsl(var(--secondary))` background, `hsl(var(--secondary-foreground))` text, X icon, min height 56px
  - IMPORTANT: Vote buttons use standard button colors. Purple (--vote) is for the poll card border and badges, NOT for the voting action buttons themselves.
```

#### 5. Added to EVERY authenticated screen prompt (D3-D19):

**New "Color Usage Reminder" section** (inserted after Design Tokens block):

```markdown
### Color Usage Rules

- **Primary buttons and links**: ALWAYS use `--primary` (indigo)
- **Feature accent colors**:
  - `--privacy` (teal): ONLY for lock icons, "Private" badges, blind budget indicators
  - `--vote` (purple): ONLY for poll card borders, vote type badges, quorum bars
- **Semantic colors**: Use `--success`, `--warning`, `--destructive`, `--info` for status communication
- **When in doubt**: Use `--primary` for interactive elements. Feature colors are highlights, not primary CTAs.
```

**Files updated**:
- `/docs/design/style-guide.md` (added Color Hierarchy section)
- `/docs/design/desktop-wireframe-prompts.md` (updated D8, D9, D11, D12; added reminder to D3-D19)

---

### Issue 2: Navigation Shell Fragmentation

**Problem**: Every authenticated screen (D3-D19) invented its own navigation structure instead of using the standard shell defined in D1. Some had no sidebar, some had different sidebar widths, some changed the top nav layout.

**Root cause in prompts**:
- D1 (Foundation, lines 118-129) defines the standard shell: 64px top nav + 280px left sidebar
- D2-D19 never reference this shell. Each prompt is "self-contained" but doesn't inherit the global layout.
- Prompts say "within the trip workspace" but don't specify what that workspace looks like.

**Prompt changes made**:

#### 1. Added to style-guide.md § Layout & Grid (new section after line 277)

```markdown
### Standard Navigation Shell (Desktop)

All authenticated screens (inside a trip) MUST use this exact layout structure:

**Top Navigation Bar** (applies to ALL screens):
- Height: 64px fixed
- Background: `hsl(var(--background))` (white)
- Border bottom: 1px solid `hsl(var(--border))`
- Contents:
  - Left: TripOS logo (text, font-bold text-xl, primary color)
  - Center: Trip selector dropdown (if inside a trip)
  - Right: Notification bell icon (with badge count), user avatar (40px round) with dropdown menu
- Positioning: Fixed top, spans full viewport width
- Z-index: 50 (always above content)

**Left Sidebar** (applies to trip workspace screens only — D3-D19):
- Width: 280px fixed
- Height: calc(100vh - 64px) (full height minus top nav)
- Background: `hsl(var(--card))` (white)
- Border right: 1px solid `hsl(var(--border))`
- Contents (top to bottom):
  - Trip name + destination (header area, p-4)
  - Navigation links (vertical list):
    - Overview (Home icon)
    - Itinerary (Calendar icon)
    - Votes (Vote icon)
    - Budget (DollarSign icon)
    - Members (Users icon)
  - Active state: `hsl(var(--primary-subtle))` background, `hsl(var(--primary))` text, 4px left border
  - Bottom area: "Invite Members" outline button + "Settings" link
- Positioning: Fixed left, top: 64px

**Main Content Area**:
- Position: Relative
- Margin left: 280px (to clear sidebar)
- Padding: 24px (p-6)
- Min-height: calc(100vh - 64px)
- Background: `hsl(var(--background))`

**DO NOT**:
- Create custom navigation structures per screen
- Change sidebar width (always 280px)
- Change top nav height (always 64px)
- Omit the sidebar on authenticated screens
- Invent alternative layouts

**Unauthenticated screens** (D2: Auth pages, D15: Landing):
- No sidebar
- Top nav: simplified (logo left, "Sign In" link right)
- Centered content layout (max-w-7xl mx-auto)
```

#### 2. Added "Common Shell Requirements" section to desktop-wireframe-prompts.md (after line 17):

```markdown
## Common Shell Requirements (D3-D19 ONLY)

**CRITICAL**: All authenticated screens (D3 through D19) MUST use the standard navigation shell defined in D1. DO NOT create custom navigation structures.

### Standard Shell Structure

Every authenticated screen must render:

1. **Top Navigation Bar** (64px height):
   - Logo (left)
   - Trip selector (center, if in trip context)
   - Notification bell + user avatar (right)

2. **Left Sidebar** (280px width, fixed):
   - Trip name + destination
   - Vertical nav links: Overview, Itinerary, Votes, Budget, Members
   - Active state: primary-subtle bg, primary text, 4px left border
   - Bottom: "Invite Members" button + "Settings" link

3. **Main Content Area**:
   - Margin-left: 280px (to clear sidebar)
   - Padding: 24px
   - This is where your screen-specific content renders

### DO NOT
- Invent custom sidebar widths
- Create alternative navigation patterns
- Omit the sidebar on authenticated screens
- Change the nav structure per screen

### Reference
See D1 (Foundation) lines 118-148 for the canonical shell definition. Your screen prompt provides ONLY the main content area specifics — the shell is inherited.
```

#### 3. Updated EVERY authenticated screen prompt (D3-D19) with shell reference:

Added immediately after the "Context" section:

```markdown
### Layout Context
This screen uses the standard navigation shell from D1:
- 64px top navigation bar (logo, trip selector, notifications, avatar)
- 280px left sidebar (trip nav: Overview, Itinerary, Votes, Budget, Members)
- Main content area: margin-left 280px, padding 24px

DO NOT create custom navigation. The requirements below specify ONLY the main content area.
```

**Files updated**:
- `/docs/design/style-guide.md` (added Standard Navigation Shell section)
- `/docs/design/desktop-wireframe-prompts.md` (added Common Shell Requirements header, updated D3-D19 with shell reference)

---

### Issue 3: Icon Library Mismatch

**Problem**: All 51 screens used Material Icons instead of Lucide. The prompts referenced icons by name ("Lock", "Vote", "GripVertical") but never specified the icon library.

**Root cause in prompts**:
- style-guide.md mentions "Lucide Icons (bundled with shadcn/ui)" (line 453) but uses emoji representations in the icon table
- Prompts reference icons by generic names: "Lock icon", "Vote icon", "MapPin icon"
- AI wireframe generators default to Material Icons (most popular library) when no library is specified

**Prompt changes made**:

#### 1. Updated style-guide.md § Iconography (lines 450-485):

**Before**:
```markdown
### Icon Library
**Lucide Icons** (bundled with shadcn/ui)
```

**After**:
```markdown
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
```

#### 2. Updated icon table in style-guide.md (lines 456-479):

**Before** (emoji column):
```markdown
| Feature | Icon | Lucide Name | Usage |
|---------|------|------------|-------|
| Privacy/Lock | 🔒 | `Lock` | Budget privacy, anonymous votes |
```

**After** (lucide: prefix column):
```markdown
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
```

#### 3. Added to EVERY screen prompt (D1-D19) in desktop-wireframe-prompts.md:

**New "Icon Library Requirements" section** (inserted after Typography section):

```markdown
### Icon Library

**REQUIRED**: Use Lucide Icons ONLY. Reference format: `lucide:[icon-name]`

Examples:
- Lock icon → `lucide:lock` → `<Lock className="w-5 h-5 text-privacy" />`
- Vote icon → `lucide:vote` → `<Vote className="w-5 h-5 text-vote" />`
- Users icon → `lucide:users` → `<Users className="w-5 h-5" />`
- Map Pin → `lucide:map-pin` → `<MapPin className="w-4 h-4" />`

**DO NOT use**:
- Material Icons
- Heroicons
- Font Awesome
- Custom SVGs (unless explicitly specified)

All icons in this prompt refer to Lucide icons. When you see "Lock icon" in requirements, use `lucide:lock`.
```

**Files updated**:
- `/docs/design/style-guide.md` (expanded Iconography section, updated icon table)
- `/docs/design/desktop-wireframe-prompts.md` (added Icon Library Requirements to D1-D19)

---

### Issue 4: Token System Bypass

**Problem**: All 51 screens used hex values (`#4F46E5`, `#0D9488`) directly instead of HSL CSS custom properties via Tailwind's `hsl()` function. Prompts show tokens in CSS variable format but don't enforce their usage.

**Root cause in prompts**:
- Prompts define tokens as CSS variables: `:root { --primary: 224 76% 48%; }`
- Prompts show hex equivalents in tables: `| --primary | 224 76% 48% | #1D4ED8 |`
- Prompts NEVER say "Do not use hex values — always use hsl(var(--token))"
- AI wireframe generators see hex values in the table and use those (easier than CSS custom properties syntax)

**Prompt changes made**:

#### 1. Added to style-guide.md § Color Palette (new section after line 101):

```markdown
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
```

#### 2. Updated EVERY screen prompt (D1-D19) Design Tokens section:

Added immediately after the dark mode CSS variables block:

```markdown
### Token Usage Rules

**CRITICAL**: Use HSL CSS custom properties via Tailwind classes. NEVER use hex values directly.

**Correct examples**:
- Background: `bg-privacy-subtle` → compiles to `background-color: hsl(var(--privacy-subtle))`
- Text: `text-primary` → compiles to `color: hsl(var(--primary))`
- Border: `border-vote` → compiles to `border-color: hsl(var(--vote))`

**INCORRECT examples**:
- `bg-[#F0FDFA]` ❌ (bypasses tokens, breaks dark mode)
- `style="background-color: #1D4ED8"` ❌ (inline hex value)
- `className="bg-blue-700"` ❌ (Tailwind default blue, not our primary)

**Why hex values are shown in tables**: For designer reference only (Figma color pickers). Code must use token names.

**Tailwind config reminder**: All tokens are mapped in `tailwind.config.ts`:
```ts
colors: {
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
    subtle: 'hsl(var(--primary-subtle))',
  },
  privacy: {
    DEFAULT: 'hsl(var(--privacy))',
    foreground: 'hsl(var(--privacy-foreground))',
    subtle: 'hsl(var(--privacy-subtle))',
  },
  // etc...
}
```
```

**Files updated**:
- `/docs/design/style-guide.md` (added Color Token Usage section)
- `/docs/design/desktop-wireframe-prompts.md` (added Token Usage Rules to all D1-D19 prompts)

---

### Issue 5: Accessibility Violations

**Problem**: All 51 screens used non-standard attributes and missing ARIA labels:
- Used `data-alt` instead of standard `alt` attributes on images
- Missing `aria-label` on icon-only buttons
- Missing `aria-hidden="true"` on decorative icons

**Root cause in prompts**:
- style-guide.md § Accessibility (lines 542-563) mentions WCAG compliance but doesn't specify attribute names
- Prompts never mention `alt`, `aria-label`, or `aria-hidden` explicitly
- AI wireframe generators invent non-standard attributes (`data-alt`, `title`, etc.) when not told exactly what to use

**Prompt changes made**:

#### 1. Updated style-guide.md § Accessibility (lines 542-563):

**Before**:
```markdown
### WCAG 2.1 AA Compliance

- **Screen readers**: All icons have `aria-label`, decorative icons `aria-hidden="true"`
```

**After**:
```markdown
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
```

#### 2. Added to EVERY screen prompt (D1-D19):

**New "Accessibility Requirements" section** (inserted after Icon Library section):

```markdown
### Accessibility Requirements

**CRITICAL**: Use standard HTML accessibility attributes correctly.

#### Images
- Informative images: `<img src="..." alt="Description" />` (use standard `alt`, NOT `data-alt`)
- Decorative images: `<img src="..." alt="" />`

#### Icons
- Icon-only buttons: `<button aria-label="Close"><X className="w-5 h-5" /></button>`
- Icons with visible text: `<button>Save <Lock aria-hidden="true" /></button>`
- Standalone icons conveying meaning: `<Lock aria-label="Private budget" />`

#### Links
- Link text must describe destination: `<a href="/votes">View all polls</a>`
- Icon-only links: `<a href="/votes" aria-label="View polls"><ChevronRight /></a>`

#### Form Inputs
- All inputs need labels: `<label for="budget">Budget</label><input id="budget" />`
- Or aria-label if no visible label: `<input aria-label="Budget" />`

**DO NOT**:
- Use `data-alt` (non-standard)
- Use `title` as a replacement for `alt` (title is for tooltips)
- Omit `aria-label` on icon-only buttons
- Forget `aria-hidden="true"` on decorative icons next to text
```

**Files updated**:
- `/docs/design/style-guide.md` (expanded Accessibility section with attribute specifications)
- `/docs/design/desktop-wireframe-prompts.md` (added Accessibility Requirements to all D1-D19 prompts)

---

## Updated Prompt Sections

### Style Guide Updates (Before/After)

#### Before (Color Palette):
```markdown
## 2. Color Palette

### Core Colors (HSL for CSS Variables)

#### Primary - Indigo Blue
Trust, reliability, collaboration. Used for primary actions, active states, links.
```

#### After (Color Palette):
```markdown
## 2. Color Palette

### Core Colors (HSL for CSS Variables)

#### Primary - Indigo Blue
Trust, reliability, collaboration. Used for primary actions, active states, links.

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

[... rest of hierarchy rules ...]

### Color Token Usage (Critical)

**REQUIRED**: All colors MUST use HSL CSS custom properties via Tailwind's `hsl()` function. NEVER use hex values directly.

[... rest of token usage rules ...]
```

---

### Screen Prompt Updates (D8: Voting)

#### Before (Create Poll button):
```markdown
- "Create Poll" button (vote-colored background, white text, Vote icon) — top right
```

#### After:
```markdown
- "Create Poll" button (PRIMARY color background, white text, Vote icon) — top right
  - IMPORTANT: Use --primary (indigo), NOT --vote (purple). Purple is for poll cards and badges, NOT primary actions.

### Layout Context
This screen uses the standard navigation shell from D1:
- 64px top navigation bar (logo, trip selector, notifications, avatar)
- 280px left sidebar (trip nav: Overview, Itinerary, Votes, Budget, Members)
- Main content area: margin-left 280px, padding 24px

DO NOT create custom navigation. The requirements below specify ONLY the main content area.

### Icon Library

**REQUIRED**: Use Lucide Icons ONLY. Reference format: `lucide:[icon-name]`

Examples:
- Vote icon → `lucide:vote` → `<Vote className="w-5 h-5 text-vote" />`
- Clock icon → `lucide:clock` → `<Clock className="w-4 h-4" />`

**DO NOT use**: Material Icons, Heroicons, Font Awesome, or custom SVGs.

### Token Usage Rules

**CRITICAL**: Use HSL CSS custom properties via Tailwind classes. NEVER use hex values directly.

**Correct examples**:
- Background: `bg-vote-subtle` → `hsl(var(--vote-subtle))`
- Text: `text-primary` → `hsl(var(--primary))`

**INCORRECT examples**:
- `bg-[#F5F3FF]` ❌ (bypasses tokens, breaks dark mode)

### Accessibility Requirements

**CRITICAL**: Use standard HTML accessibility attributes correctly.

- Icon-only buttons: `<button aria-label="Create poll"><Vote className="w-5 h-5" /></button>`
- Icons with text: `<button>Create Poll <Vote aria-hidden="true" /></button>`
- Images: `<img src="..." alt="Description" />` (NOT `data-alt`)
```

---

## Validation

### Regeneration Test Plan

**Objective**: Verify that updated prompts generate wireframes without the 5 systemic issues.

**Test screens**:
- D1 (Foundation) — tests navigation shell definition
- D8 (Voting) — tests primary color usage, not purple for buttons
- D11 (Blind Budget) — tests primary color usage, not teal for buttons

**Validation checklist per screen**:

#### D8 (Voting) Test
1. **Primary Color**: ✅ "Create Poll" button uses indigo (#1D4ED8), NOT purple
2. **Navigation Shell**: ✅ 64px top nav + 280px left sidebar present
3. **Icon Library**: ✅ Icons reference Lucide: `lucide:vote`, `lucide:clock`
4. **Token System**: ✅ Colors use `hsl(var(--token))` NOT hex values
5. **Accessibility**: ✅ Icon buttons have `aria-label`, decorative icons have `aria-hidden="true"`, images use `alt` not `data-alt`

#### D11 (Blind Budget) Test
1. **Primary Color**: ✅ "Save Privately" button uses indigo, only Lock icon is teal
2. **Navigation Shell**: ✅ Standard shell present
3. **Icon Library**: ✅ `lucide:lock`, `lucide:users`, `lucide:shield`
4. **Token System**: ✅ `bg-privacy-subtle`, `text-privacy`, no hex values
5. **Accessibility**: ✅ All standards met

#### D1 (Foundation) Test
1. **Navigation Shell**: ✅ Shell definition matches updated spec (64px top, 280px sidebar)
2. **Icon Library**: ✅ References Lucide throughout
3. **Token System**: ✅ Tailwind config example uses `hsl(var(--token))`
4. **Accessibility**: ✅ Shell components have proper ARIA labels

**Expected outcome**: All 3 test screens pass all 5 checks.

**If fails**:
- Identify which prompt section was ignored
- Add more explicit "DO NOT" language
- Move critical rules higher in prompt (closer to top)
- Increase specificity of examples

---

## Next Steps

### Phase 1: Update Generation Prompts ✅ COMPLETE
- [x] Update `/docs/design/style-guide.md` (5 new sections)
- [x] Update `/docs/design/desktop-wireframe-prompts.md` (D1-D19 all screens)
- [x] Add Common Shell Requirements section
- [x] Add Color Hierarchy rules
- [x] Add Icon Library requirements
- [x] Add Token Usage rules
- [x] Add Accessibility Requirements

### Phase 2: Validate Prompt Improvements
- [ ] Regenerate D1, D8, D11 with updated prompts (3 test screens)
- [ ] Run validation checklist on generated HTML
- [ ] Compare against Phase A audit findings
- [ ] Document any remaining issues
- [ ] Refine prompts if needed

### Phase 3: Fix Existing Wireframes (Batch Process)
After validating prompts work correctly:

- [ ] **Primary Color Fix** (25 screens):
  - D8-D10 (voting): Change button backgrounds from `--vote` to `--primary`
  - D11-D12 (budget): Change button backgrounds from `--privacy` to `--primary`
  - D13 (expenses): Verify uses `--primary` not semantic colors

- [ ] **Navigation Shell Fix** (40 screens):
  - D3-D19: Add standard shell (64px top nav + 280px sidebar) if missing
  - Ensure main content area has `margin-left: 280px`

- [ ] **Icon Library Fix** (51 screens):
  - Global find/replace: Material icon references → Lucide references
  - Update icon class names to match Lucide naming
  - Example: `<i class="material-icons">lock</i>` → `<Lock className="w-5 h-5" />`

- [ ] **Token System Fix** (51 screens):
  - Find all hex color values
  - Map to corresponding token
  - Replace with Tailwind class or `hsl(var(--token))`
  - Example: `background-color: #F0FDFA` → `className="bg-privacy-subtle"`

- [ ] **Accessibility Fix** (51 screens):
  - Find all `data-alt` → replace with `alt`
  - Find all icon-only buttons → add `aria-label`
  - Find all decorative icons next to text → add `aria-hidden="true"`

### Phase 4: Spot-Check Validation
- [ ] Randomly select 5 screens (mix of D3-D19)
- [ ] Verify all 5 fixes applied correctly
- [ ] Check for regressions (unintended changes)
- [ ] Document edge cases

---

## Success Criteria

✅ All 5 systemic issues have corresponding prompt fixes
✅ Prompt language is clear, specific, and actionable
✅ Style guide has new sections for icons, tokens, accessibility
✅ Screen prompts reference common shell requirements
✅ Before/after examples show what changed
✅ Test plan exists to validate prompt improvements

**Remember**: The prompts are the product. The wireframe fixes are just validation that the prompt fixes work.

---

## Lessons Learned

### What Went Wrong
1. **Assumed context transfer**: We thought D2-D19 would "inherit" D1's shell — they didn't
2. **Showed hex values in tables**: AI saw hex, used hex (even though tables said "for reference only")
3. **Generic icon names**: "Lock icon" could be Material Lock, Heroicons Lock, etc.
4. **Implicit rules**: "Use tokens" is not the same as "NEVER use hex values"
5. **Missing negative examples**: Prompts said what TO do, not what NOT to do

### What Works for AI Prompt Engineering
1. **Explicit library names**: "Lucide Icons ONLY" + examples
2. **DO/DON'T tables**: Show correct + incorrect side-by-side
3. **CRITICAL/IMPORTANT tags**: Flag non-negotiable rules
4. **Repeat critical rules**: Add to style guide AND individual prompts
5. **Reference existing sections**: "Use standard shell from D1" creates dependency
6. **Negative examples**: Show the wrong way + why it's wrong

### Applying to Phase B (Mobile)
When creating mobile wireframe prompts:
1. ✅ Include Icon Library section from day 1
2. ✅ Include Token Usage Rules from day 1
3. ✅ Include Accessibility Requirements from day 1
4. ✅ Define common shell ONCE (M1), reference in all others
5. ✅ Add Color Hierarchy reminder to budget/voting prompts
6. ✅ Use CRITICAL tags on rules that broke in Phase A

---

**End of Prompt Improvements Document**
