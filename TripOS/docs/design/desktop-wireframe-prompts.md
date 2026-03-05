# TripOS Desktop Wireframe Prompts (D1-D19)

**Created**: 2026-02-10
**Status**: Complete
**Purpose**: Self-contained desktop wireframe generation prompts for Figma Make (AI), each with full design token system (light + dark mode)
**Source of Truth**: style-guide.md (tokens), ux-spec.md (states, flows), design-principles.md (philosophy, voice, anti-patterns), this file (desktop wireframe specs)

---

## Usage Notes — Figma Make

### Overview

Figma Make is an AI prompt-to-code tool inside Figma. You paste a text prompt (and optionally attach visual references), and it generates a functional prototype using React + Tailwind CSS. Key differences from Google Stitch:

- **Visual references** — You can paste existing Figma frames into the prompt box so Make matches your style.
- **`guidelines.md`** — A rules file Make's AI reads before every generation (your design system enforcer).
- **Point and Edit** — Click any element after generation and refine it with a targeted prompt.
- **Variables for dark mode** — Instead of re-generating, switch a Figma variable mode from Light to Dark.
- **Limitation** — One screen per prompt. Cannot generate multi-screen flows at once.

---

### Phase 1: One-Time Design System Setup

Do this once before generating any screens. It takes ~30 minutes and ensures every generated screen is on-brand.

#### Step 1.1 — Create the TripOS Variables Collection

This gives you instant light/dark switching and token-consistent colors across all screens.

1. Open your Figma Design file (not Make)
2. Open the **Variables** panel (right sidebar > Local variables, or `⌥⌘V`)
3. Click **+ Create collection**, name it `TripOS Tokens`
4. Click the **+** on the mode header to add a second mode. Rename the two modes to `Light` and `Dark`
5. Add each token as a **Color variable**. For each one:
   - Name it with the CSS variable name (e.g., `background`, `foreground`, `primary`, `privacy`, `vote`)
   - Set the **Light** mode value using the `:root` HSL values from D1 (convert to hex for Figma's color picker, or type the HSL directly)
   - Set the **Dark** mode value using the `.dark` HSL values from D1

**All 28 tokens to add:**

| Variable Name | Light (`:root` HSL) | Dark (`.dark` HSL) | Purpose |
| --- | --- | --- | --- |
| `background` | `0 0% 100%` | `222 47% 11%` | Page background |
| `foreground` | `224 71% 4%` | `210 40% 98%` | Primary text |
| `card` | `0 0% 100%` | `217 33% 17%` | Card surfaces |
| `card-foreground` | `224 71% 4%` | `210 40% 98%` | Card text |
| `muted` | `220 14% 96%` | `217 33% 17%` | Subtle backgrounds |
| `muted-foreground` | `215 16% 47%` | `215 20% 65%` | Secondary text |
| `border` | `214 32% 91%` | `215 25% 27%` | Borders |
| `input` | `214 32% 91%` | `215 25% 27%` | Input borders |
| `ring` | `224 76% 48%` | `224 76% 58%` | Focus rings |
| `primary` | `224 76% 48%` | `224 76% 58%` | Primary actions (indigo) |
| `primary-foreground` | `210 40% 98%` | `222 47% 11%` | Text on primary |
| `primary-subtle` | `224 76% 95%` | `224 40% 18%` | Primary hover/active bg |
| `secondary` | `217 19% 27%` | `217 33% 17%` | Secondary actions |
| `secondary-foreground` | `210 40% 98%` | `210 40% 98%` | Text on secondary |
| `accent` | `25 95% 53%` | `25 95% 53%` | CTAs (amber) |
| `accent-foreground` | `20 14% 4%` | `20 14% 4%` | Text on accent |
| `destructive` | `0 84% 60%` | `0 84% 60%` | Danger/delete |
| `destructive-foreground` | `210 40% 98%` | `210 40% 98%` | Text on destructive |
| `success` | `142 76% 36%` | `142 76% 42%` | Success states |
| `warning` | `38 92% 50%` | `38 92% 50%` | Warning states |
| `info` | `199 89% 48%` | `199 89% 48%` | Info states |
| `privacy` | `162 72% 37%` | `162 72% 45%` | Privacy/budget (teal) |
| `privacy-foreground` | `210 40% 98%` | `222 47% 11%` | Text on privacy |
| `privacy-subtle` | `162 72% 95%` | `162 40% 15%` | Privacy badge bg |
| `vote` | `262 83% 58%` | `262 83% 68%` | Voting (purple) |
| `vote-foreground` | `210 40% 98%` | `222 47% 11%` | Text on vote |
| `vote-subtle` | `262 83% 96%` | `262 30% 18%` | Vote badge bg |
| `radius` | `0.5rem` | `0.5rem` | Border radius (add as String variable) |

#### Step 1.2 — Publish the Library

1. Still in your Figma Design file, go to **Assets** panel (left sidebar)
2. Click the **book icon** > **Publish library**
3. Add a description: "TripOS Design Tokens — 28 variables, Light + Dark modes"
4. Click **Publish**

#### Step 1.3 — Export the Library for Figma Make

1. After publishing, go to **Assets** > **Libraries**
2. Find your published library and click **"Export for Make"**
3. Wait for the export to complete (takes 1-2 minutes)
4. Click **"Go to Figma Make"** — this opens a new Make file with your library pre-linked

#### Step 1.4 — Create the `guidelines.md` Rules File

This is the most impactful step. Figma Make's AI (Claude Sonnet) reads this file before every generation.

1. In your Figma Make file, open the **Code Editor** (bottom panel)
2. Create a new file called `guidelines.md`
3. Paste the following content:

```markdown
# TripOS Design Guidelines

## Task
Generate TripOS wireframe screens using the design tokens, layout rules, and component library defined below.

## Design Tokens
Use HSL CSS custom properties via Tailwind classes. NEVER use hex values, rgb values, named colors, Tailwind default palette (bg-gray-*, text-slate-*), or arbitrary values (bg-[#xxx]).

### Correct Usage
- `bg-primary` → `background-color: hsl(var(--primary))`
- `text-foreground` → `color: hsl(var(--foreground))`
- `border-border` → `border-color: hsl(var(--border))`

### Forbidden Patterns
- `bg-[#4F46E5]` — bypasses tokens, breaks dark mode
- `style="background-color: #1D4ED8"` — inline hex
- `className="bg-blue-700"` — Tailwind default, not our token
- `rgb(255,255,255)` or `rgba(0,0,0,0.5)` — raw color values
- `white`, `black`, `gray` — named CSS colors

## Semantic Color Rules (CRITICAL)
- **Indigo** (`--primary`) — ALL primary action buttons (Create, Save, Submit), links, active tabs, focus rings
- **Teal** (`--privacy`) — Privacy indicators ONLY: lock icons, "Private" badges. NEVER as button background
- **Purple** (`--vote`) — Voting indicators ONLY: poll badges, quorum bars. NEVER as button background
- **Amber** (`--accent`) — Call-to-action highlights

Exception: A button whose ONLY purpose IS the feature may use the feature color (e.g., "Lock Budget" can be teal).

## Typography
- Font: Inter (sans-serif fallback)
- Headings: text-4xl/bold, text-2xl/semibold, text-xl/semibold, text-lg/semibold
- Body: text-base, text-sm, text-xs
- Weights: font-normal, font-medium, font-semibold, font-bold

## Icons
Use Lucide Icons ONLY. Never use Material Icons, Heroicons, or Font Awesome.

## Components
Use shadcn/ui patterns: Button, Card, Dialog, Input, Select, Badge, Avatar, Tabs.

## Border Radius
Use `--radius: 0.5rem` as base. Cards: rounded-lg. Buttons: rounded-md. Badges: rounded-full.

## Spacing
Follow 4px grid: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px.

## Accessibility
- Images: descriptive `alt` attribute (not `data-alt`)
- Icon buttons: `aria-label` required
- Touch targets: minimum 44px
- Contrast: 4.5:1 minimum for text
```

---

### Phase 2: Generate the Foundation Screen (D1)

#### Step 2.1 — Generate D1

1. Open your Figma Make file (the one linked to your library from Step 1.3)
2. In the prompt box, paste the **entire Prompt D1** section from this file (starting at "### Context" through the end of D1)
3. Click **"Make it"**
4. Wait for generation (30-60 seconds)

#### Step 2.2 — Verify D1 Output

Check the generated D1 frame for:

- [ ] 64px top navigation bar with logo, trip selector, bell + avatar
- [ ] 280px left sidebar with nav links
- [ ] Correct token usage (no hex colors in the code)
- [ ] Inter font
- [ ] Lucide icons (not Material Icons)

#### Step 2.3 — Fix Issues with Point and Edit

If something is wrong, click the element directly in the preview, then type a targeted prompt:

- Wrong icon: "Replace this icon with `lucide:bell`"
- Wrong color: "Change this button background to use `--primary` (indigo), not `--vote` (purple)"
- Wrong spacing: "Set padding to 24px on the main content area"

#### Step 2.4 — Create the Dark Variant

1. In your Figma Design file, duplicate the generated frame (`Cmd+D`)
2. Select the duplicate frame
3. In the right sidebar, find the **Variables** section
4. Switch the mode from `Light` to `Dark`
5. All colors update automatically — no re-generation needed

---

### Phase 3: Generate Subsequent Screens (D3-D19)

Repeat this process for each screen prompt.

#### Step 3.1 — Attach the D1 Shell as Reference

1. Go to your generated D1 frame in the Figma Design file
2. Select the frame and **Copy** it (`Cmd+C`)
3. In Figma Make's prompt box, **Paste** (`Cmd+V`) — it appears as a visual attachment
4. This teaches Make your exact navigation shell, colors, and spacing

#### Step 3.2 — Paste the Screen Prompt

1. In the same prompt box (below or alongside the attachment), paste the full prompt for the screen you're generating (e.g., Prompt D3, D4, etc.)
2. Click **"Make it"**

#### Step 3.3 — Refine with Follow-up Prompts

After the initial generation, you can type follow-up prompts in the same conversation:

- "Move the filter bar above the card grid"
- "Add an empty state with a `lucide:compass` icon and the text 'No trips yet'"
- "Change the 'Create Poll' button from purple to indigo primary"

#### Step 3.4 — For Complex Screens, Work in Layers

Dense screens like D8 (Voting) or D11 (Blind Budget) work better in stages:

1. **First prompt**: Generate the main layout skeleton with the D1 shell
2. **Second prompt**: "Now add the poll cards section with status badges and quorum indicators"
3. **Third prompt**: "Add the results visualization panel on the right"

This gives Make smaller, focused tasks instead of one overwhelming prompt.

#### Step 3.5 — Verify and Create Dark Variant

Same as Step 2.2 and 2.4: verify token compliance, then duplicate + switch variable mode for the dark version.

---

### Phase 4: Quality Checklist (After Each Screen)

Run this check after every generated screen before moving to the next:

| Check | Pass? |
| --- | --- |
| Uses `--primary` (indigo) for all primary buttons | |
| Teal appears ONLY on privacy indicators | |
| Purple appears ONLY on voting indicators | |
| No hex values in generated code | |
| No `bg-gray-*` or Tailwind defaults | |
| Icons are Lucide, not Material | |
| Navigation matches D1 shell exactly | |
| Inter font used throughout | |
| Touch targets ≥ 44px | |
| Alt text on images, aria-labels on icon buttons | |
| Dark variant created via variable mode switch | |

---

### Tips and Gotchas

- **Max 3 attachments per prompt** — Prioritize: (1) D1 shell, (2) library component, (3) adjacent screen
- **Auto Layout matters** — Reference frames with Auto Layout translate much better than absolute-positioned ones
- **Don't manually edit then re-prompt** — Once you make a manual edit in the code, you can't use the conversational prompt anymore. Do all prompt-based refinement first, then make manual edits last
- **Custom fonts** — Figma Make doesn't support custom fonts yet. Inter works because it's a system-level web font
- **Large frames become images** — If an attached frame is too large, Make converts it to a flat image reference (less precise). Keep reference frames focused
- **Token fidelity** — All 28 tokens are included in every prompt. Do not modify values — they match the canonical style-guide.md
- **Reduced motion** — All animations in these prompts must have `prefers-reduced-motion` alternatives that replace motion with instant state changes

---

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

---

## Prompt D1: Foundation — Design Tokens & Desktop Layout Shell

### Context
TripOS is a collaborative group travel planning web app. This is the foundation prompt establishing the design system, global layout shell, and navigation structure that all screens will use. The app is built with Next.js 16, Tailwind CSS, and shadcn/ui components.

### Brand Personality
- Empathetic, pragmatic, inclusive, confident
- Clean but not minimal. Warm but not playful. Structured but not rigid
- Conversational tone using contractions, direct language, and specific references

### Design Tokens

```css
:root {
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --card: 0 0% 100%;
  --card-foreground: 224 71% 4%;
  --muted: 220 14% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 224 76% 48%;
  --primary: 224 76% 48%;
  --primary-foreground: 210 40% 98%;
  --primary-subtle: 224 76% 95%;
  --secondary: 217 19% 27%;
  --secondary-foreground: 210 40% 98%;
  --accent: 25 95% 53%;
  --accent-foreground: 20 14% 4%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 37%;
  --privacy-foreground: 210 40% 98%;
  --privacy-subtle: 162 72% 95%;
  --vote: 262 83% 58%;
  --vote-foreground: 210 40% 98%;
  --vote-subtle: 262 83% 96%;
  --radius: 0.5rem;
}
```

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
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 42%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 45%;
  --privacy-foreground: 222 47% 11%;
  --privacy-subtle: 162 40% 15%;
  --vote: 262 83% 68%;
  --vote-foreground: 222 47% 11%;
  --vote-subtle: 262 30% 18%;
  --radius: 0.5rem;
}
```

### Typography

- Font: Inter (sans-serif fallback stack)
- Display: 36px/40px bold. H1: 30px/36px bold. H2: 24px/32px semibold. H3: 20px/28px semibold
- Body: 16px/24px regular. Small: 14px/20px. Caption: 12px/16px
- Minimum body text: 16px for mobile readability

### Icon Library

**REQUIRED**: Use Lucide Icons ONLY. Reference format: `lucide:[icon-name]`

Examples:

- Home icon → `lucide:home` → `<Home className="w-5 h-5" />`
- Calendar icon → `lucide:calendar` → `<Calendar className="w-5 h-5" />`
- Vote icon → `lucide:vote` → `<Vote className="w-5 h-5" />`
- Dollar Sign icon → `lucide:dollar-sign` → `<DollarSign className="w-5 h-5" />`
- Users icon → `lucide:users` → `<Users className="w-5 h-5" />`
- Bell icon → `lucide:bell` → `<Bell className="w-5 h-5" />`
- Settings icon → `lucide:settings` → `<Settings className="w-4 h-4" />`

**DO NOT use**:

- Material Icons
- Heroicons
- Font Awesome
- Custom SVGs (unless explicitly specified)

All icons in this prompt refer to Lucide icons.

### Token Usage Rules

**CRITICAL**: Use HSL CSS custom properties via Tailwind classes. NEVER use hex values directly.

**Correct examples**:

- Background: `bg-primary` → compiles to `background-color: hsl(var(--primary))`
- Text: `text-foreground` → compiles to `color: hsl(var(--foreground))`
- Border: `border-border` → compiles to `border-color: hsl(var(--border))`

**INCORRECT examples**:

- `bg-[#4F46E5]` ❌ (bypasses tokens, breaks dark mode)
- `style="background-color: #1D4ED8"` ❌ (inline hex value)
- `className="bg-blue-700"` ❌ (Tailwind default blue, not our primary token)

**Why hex values are shown in tables**: For designer reference only (Figma color pickers). Code must use token names.

**Tailwind config reminder**: All tokens are mapped in `tailwind.config.ts`:

```ts
colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
    subtle: 'hsl(var(--primary-subtle))',
  },
  // etc...
}
```

### Accessibility Requirements

**CRITICAL**: Use standard HTML accessibility attributes correctly.

#### Images

- Informative images: `<img src="..." alt="Description" />` (use standard `alt`, NOT `data-alt`)
- Decorative images: `<img src="..." alt="" />`

#### Icons

- Icon-only buttons: `<button aria-label="Open notifications"><Bell className="w-5 h-5" /></button>`
- Icons with visible text: `<button>Overview <Home aria-hidden="true" /></button>`
- Standalone icons conveying meaning: `<Bell aria-label="You have 3 notifications" />`

#### Links

- Link text must describe destination: `<a href="/settings">Trip settings</a>`
- Icon-only links: `<a href="/settings" aria-label="Trip settings"><Settings /></a>`

#### Form Inputs

- All inputs need labels: `<label for="tripname">Trip name</label><input id="tripname" />`
- Or aria-label if no visible label: `<input aria-label="Search trips" />`

**DO NOT**:

- Use `data-alt` (non-standard)
- Use `title` as a replacement for `alt` (title is for tooltips)
- Omit `aria-label` on icon-only buttons
- Forget `aria-hidden="true"` on decorative icons next to text

### Spacing
- 4px base unit. Cards: p-4 (compact) or p-6 (standard). Between cards: gap-4. Between sections: gap-8
- Page margins: px-4 (mobile) → px-6 (tablet) → px-8 (desktop)

### Responsive Breakpoints

| Name | Width | Usage |
|------|-------|-------|
| `sm` | 640px | Large phones landscape |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Requirements — Desktop Layout Shell
Create the desktop app layout:
- **Top navigation bar**: Height 64px, white background, bottom border. Contains:
  - Left: TripOS logo text (font-bold text-xl, primary color)
  - Center: Trip selector dropdown (if inside a trip)
  - Right: Notification bell icon (with red badge count, aria-label: "Notifications"), user avatar (40px round) with dropdown
- **Sidebar** (inside trip): 280px fixed width, left side. Contains:
  - Trip name and destination at top
  - Navigation tabs as vertical list: Overview, Itinerary, Votes, Budget, Members
  - Each tab: icon (20px) + label. Active state: primary background subtle, primary text, left border accent
  - Bottom: "Invite Members" button (outline style) and "Settings" link

### Requirements — Shared Components
- **Card**: White background, 1px border (--border), rounded-xl (12px), shadow-sm, p-6
- **Button Primary**: Primary background, white text, rounded-lg, h-10 (desktop) h-12 (mobile), font-medium
- **Button Secondary**: Muted background, foreground text, border, same sizing
- **Button Destructive**: Red background, white text
- **Input**: h-10, border, rounded-lg, focus ring-2 primary
- **Avatar**: rounded-full, sizes 32/40/48px, initials fallback on primary-subtle bg
- **Badge**: rounded-full, px-2.5 py-0.5, text-xs font-medium

### States
- Default card: shadow-sm. Hover: shadow-md. Active/Selected: primary border
- Buttons: opacity-90 on hover, opacity-50 when disabled
- Focus: ring-2 ring-primary ring-offset-2 on all interactive elements
- Loading: Skeleton rectangles with pulse animation on muted background

### Constraints
- Max container width: 1280px centered
- All touch targets minimum 44x44px
- No horizontal scrolling at any breakpoint
- Use only the color tokens defined above — no arbitrary colors

---

## Prompt D2: Authentication — Sign Up, Sign In, Invite Accept

### Context
TripOS is a collaborative group travel planning web app. These are the authentication screens users see before entering the app. Users can arrive from direct access (sign up/in) or via an email invite to join a specific trip.

### Design Tokens

```css
:root {
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --card: 0 0% 100%;
  --card-foreground: 224 71% 4%;
  --muted: 220 14% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 224 76% 48%;
  --primary: 224 76% 48%;
  --primary-foreground: 210 40% 98%;
  --primary-subtle: 224 76% 95%;
  --secondary: 217 19% 27%;
  --secondary-foreground: 210 40% 98%;
  --accent: 25 95% 53%;
  --accent-foreground: 20 14% 4%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 37%;
  --privacy-foreground: 210 40% 98%;
  --privacy-subtle: 162 72% 95%;
  --vote: 262 83% 58%;
  --vote-foreground: 210 40% 98%;
  --vote-subtle: 262 83% 96%;
  --radius: 0.5rem;
}
```

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
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 42%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 45%;
  --privacy-foreground: 222 47% 11%;
  --privacy-subtle: 162 40% 15%;
  --vote: 262 83% 68%;
  --vote-foreground: 222 47% 11%;
  --vote-subtle: 262 30% 18%;
  --radius: 0.5rem;
}
```

### Typography
- Font: Inter. H1: 30px bold. H2: 24px semibold. Body: 16px regular. Small: 14px. Caption: 12px
- All text minimum 16px for mobile readability

### Icon Library

**REQUIRED**: Use Lucide Icons ONLY. Reference format: `lucide:[icon-name]`

Examples:

- Home icon → `lucide:home` → `<Home className="w-5 h-5" />`
- Calendar icon → `lucide:calendar` → `<Calendar className="w-5 h-5" />`
- Vote icon → `lucide:vote` → `<Vote className="w-5 h-5" />`
- Dollar Sign icon → `lucide:dollar-sign` → `<DollarSign className="w-5 h-5" />`
- Users icon → `lucide:users` → `<Users className="w-5 h-5" />`
- Bell icon → `lucide:bell` → `<Bell className="w-5 h-5" />`
- Settings icon → `lucide:settings` → `<Settings className="w-4 h-4" />`

**DO NOT use**:

- Material Icons
- Heroicons
- Font Awesome
- Custom SVGs (unless explicitly specified)

All icons in this prompt refer to Lucide icons.

### Token Usage Rules

**CRITICAL**: Use HSL CSS custom properties via Tailwind classes. NEVER use hex values directly.

**Correct examples**:

- Background: `bg-primary` → compiles to `background-color: hsl(var(--primary))`
- Text: `text-foreground` → compiles to `color: hsl(var(--foreground))`
- Border: `border-border` → compiles to `border-color: hsl(var(--border))`

**INCORRECT examples**:

- `bg-[#4F46E5]` ❌ (bypasses tokens, breaks dark mode)
- `style="background-color: #1D4ED8"` ❌ (inline hex value)
- `className="bg-blue-700"` ❌ (Tailwind default blue, not our primary token)

**Why hex values are shown in tables**: For designer reference only (Figma color pickers). Code must use token names.

**Tailwind config reminder**: All tokens are mapped in `tailwind.config.ts`:

```ts
colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
    subtle: 'hsl(var(--primary-subtle))',
  },
  // etc...
}
```

### Accessibility Requirements

**CRITICAL**: Use standard HTML accessibility attributes correctly.

#### Images

- Informative images: `<img src="..." alt="Description" />` (use standard `alt`, NOT `data-alt`)
- Decorative images: `<img src="..." alt="" />`

#### Icons

- Icon-only buttons: `<button aria-label="Open notifications"><Bell className="w-5 h-5" /></button>`
- Icons with visible text: `<button>Overview <Home aria-hidden="true" /></button>`
- Standalone icons conveying meaning: `<Bell aria-label="You have 3 notifications" />`

#### Links

- Link text must describe destination: `<a href="/settings">Trip settings</a>`
- Icon-only links: `<a href="/settings" aria-label="Trip settings"><Settings /></a>`

#### Form Inputs

- All inputs need labels: `<label for="tripname">Trip name</label><input id="tripname" />`
- Or aria-label if no visible label: `<input aria-label="Search trips" />`

**DO NOT**:

- Use `data-alt` (non-standard)
- Use `title` as a replacement for `alt` (title is for tooltips)
- Omit `aria-label` on icon-only buttons
- Forget `aria-hidden="true"` on decorative icons next to text

### Color Usage Rules

- **Primary buttons and links**: ALWAYS use `--primary` (indigo)
- **Feature accent colors**:
  - `--privacy` (teal): ONLY for lock icons, "Private" badges, blind budget indicators
  - `--vote` (purple): ONLY for poll card borders, vote type badges, quorum bars
- **Semantic colors**: Use `--success`, `--warning`, `--destructive`, `--info` for status communication
- **When in doubt**: Use `--primary` for interactive elements. Feature colors are highlights, not primary CTAs.

### Requirements — Sign Up Page
- Centered card layout (max-w-md, 480px)
- Card contains:
  - TripOS logo and tagline: "Plan group trips without the awkwardness"
  - "Create your account" heading (H2)
  - Social login buttons: "Continue with Google" and "Continue with Apple" (full-width, outline style, icon left)
  - Divider: "or" with horizontal lines
  - Email input field (label: "Email", placeholder: "you@example.com")
  - Password input field (label: "Password", with show/hide toggle)
  - "Create Account" primary button (full-width)
  - Bottom text: "Already have an account? Sign in" (link to sign in)
- Below card: "By creating an account, you agree to our Terms and Privacy Policy" (caption text, muted)

### Requirements — Sign In Page
- Same centered card layout as sign up
- Card contains:
  - TripOS logo and tagline
  - "Welcome back" heading (H2)
  - Social login buttons (Google, Apple)
  - Divider
  - Email input + Password input
  - "Forgot password?" link (right-aligned, small text, primary color)
  - "Sign In" primary button (full-width)
  - Bottom: "New to TripOS? Create an account" link

### Requirements — Invite Accept Page
- Same centered card layout
- Card contains:
  - TripOS logo
  - Trip invitation card showing:
    - "[Inviter Name] invited you to:" (small text)
    - Trip name (H2, bold)
    - Trip dates and destination (muted text below)
    - Member avatars (stacked, up to 5 + "+N" overflow)
  - If logged in: "Join Trip" primary button
  - If not logged in: "Create account to join" primary button, "Already have an account? Sign in" link

### Requirements — Forgot Password Page
- Centered card, same layout
- "Reset your password" heading
- Email input
- "Send Reset Link" primary button
- "Back to Sign In" link
- Success state: checkmark icon + "Check your email for a reset link"

### States
- Inputs: default (border), focus (ring-2 primary), error (border-destructive + red error text below)
- Buttons: default, hover (opacity-90), loading (spinner + "Creating account..."), disabled (opacity-50)
- Form errors: inline below each field, destructive color, 14px text
- Social buttons: subtle hover (muted background)

### Interactions
- Social login: redirect to provider OAuth flow
- Form submission: validate client-side first, show loading state, handle errors inline
- Invite page: if invite expired, show error state with "Request a new invite" link
- Tab between fields, Enter to submit

### Constraints
- No horizontal scrolling
- Forms work at 320px width (iPhone SE)
- Password minimum 8 characters (show requirement below field)
- All buttons minimum 44px height on mobile
- No arbitrary colors — use only defined tokens

---

## Prompt D3: Dashboard — My Trips

### Context
TripOS is a collaborative group travel planning web app. The dashboard is the home screen after login, showing all trips the user belongs to. Users can create new trips or continue planning existing ones.

### Design Tokens

```css
:root {
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --card: 0 0% 100%;
  --card-foreground: 224 71% 4%;
  --muted: 220 14% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 224 76% 48%;
  --primary: 224 76% 48%;
  --primary-foreground: 210 40% 98%;
  --primary-subtle: 224 76% 95%;
  --secondary: 217 19% 27%;
  --secondary-foreground: 210 40% 98%;
  --accent: 25 95% 53%;
  --accent-foreground: 20 14% 4%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 37%;
  --privacy-foreground: 210 40% 98%;
  --privacy-subtle: 162 72% 95%;
  --vote: 262 83% 58%;
  --vote-foreground: 210 40% 98%;
  --vote-subtle: 262 83% 96%;
  --radius: 0.5rem;
}
```

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
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 42%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 45%;
  --privacy-foreground: 222 47% 11%;
  --privacy-subtle: 162 40% 15%;
  --vote: 262 83% 68%;
  --vote-foreground: 222 47% 11%;
  --vote-subtle: 262 30% 18%;
  --radius: 0.5rem;
}
```

### Typography
- Font: Inter. H1: 30px bold. H2: 24px semibold. H3: 20px semibold. Body: 16px. Small: 14px. Caption: 12px

### Icon Library

**REQUIRED**: Use Lucide Icons ONLY. Reference format: `lucide:[icon-name]`

Examples:

- Home icon → `lucide:home` → `<Home className="w-5 h-5" />`
- Calendar icon → `lucide:calendar` → `<Calendar className="w-5 h-5" />`
- Vote icon → `lucide:vote` → `<Vote className="w-5 h-5" />`
- Dollar Sign icon → `lucide:dollar-sign` → `<DollarSign className="w-5 h-5" />`
- Users icon → `lucide:users` → `<Users className="w-5 h-5" />`
- Bell icon → `lucide:bell` → `<Bell className="w-5 h-5" />`
- Settings icon → `lucide:settings` → `<Settings className="w-4 h-4" />`

**DO NOT use**:

- Material Icons
- Heroicons
- Font Awesome
- Custom SVGs (unless explicitly specified)

All icons in this prompt refer to Lucide icons.

### Token Usage Rules

**CRITICAL**: Use HSL CSS custom properties via Tailwind classes. NEVER use hex values directly.

**Correct examples**:

- Background: `bg-primary` → compiles to `background-color: hsl(var(--primary))`
- Text: `text-foreground` → compiles to `color: hsl(var(--foreground))`
- Border: `border-border` → compiles to `border-color: hsl(var(--border))`

**INCORRECT examples**:

- `bg-[#4F46E5]` ❌ (bypasses tokens, breaks dark mode)
- `style="background-color: #1D4ED8"` ❌ (inline hex value)
- `className="bg-blue-700"` ❌ (Tailwind default blue, not our primary token)

**Why hex values are shown in tables**: For designer reference only (Figma color pickers). Code must use token names.

**Tailwind config reminder**: All tokens are mapped in `tailwind.config.ts`:

```ts
colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
    subtle: 'hsl(var(--primary-subtle))',
  },
  // etc...
}
```

### Accessibility Requirements

**CRITICAL**: Use standard HTML accessibility attributes correctly.

#### Images

- Informative images: `<img src="..." alt="Description" />` (use standard `alt`, NOT `data-alt`)
- Decorative images: `<img src="..." alt="" />`

#### Icons

- Icon-only buttons: `<button aria-label="Open notifications"><Bell className="w-5 h-5" /></button>`
- Icons with visible text: `<button>Overview <Home aria-hidden="true" /></button>`
- Standalone icons conveying meaning: `<Bell aria-label="You have 3 notifications" />`

#### Links

- Link text must describe destination: `<a href="/settings">Trip settings</a>`
- Icon-only links: `<a href="/settings" aria-label="Trip settings"><Settings /></a>`

#### Form Inputs

- All inputs need labels: `<label for="tripname">Trip name</label><input id="tripname" />`
- Or aria-label if no visible label: `<input aria-label="Search trips" />`

**DO NOT**:

- Use `data-alt` (non-standard)
- Use `title` as a replacement for `alt` (title is for tooltips)
- Omit `aria-label` on icon-only buttons
- Forget `aria-hidden="true"` on decorative icons next to text

### Color Usage Rules

- **Primary buttons and links**: ALWAYS use `--primary` (indigo)
- **Feature accent colors**:
  - `--privacy` (teal): ONLY for lock icons, "Private" badges, blind budget indicators
  - `--vote` (purple): ONLY for poll card borders, vote type badges, quorum bars
- **Semantic colors**: Use `--success`, `--warning`, `--destructive`, `--info` for status communication
- **When in doubt**: Use `--primary` for interactive elements. Feature colors are highlights, not primary CTAs.

### Requirements — Dashboard Page
- Page header: "My Trips" (H1) + "Create Trip" primary button (right-aligned)
- Filter tabs below header: "All" | "Upcoming" | "Planning" | "Past" (text tabs with active underline)
- Trip cards in responsive grid: 1 column (mobile), 2 (tablet), 3 (desktop), gap-4

### Requirements — Trip Card
Each trip card contains:
- **Header area**: Trip name (H3, bold) + date range below (14px, muted)
- **Destination**: Location text with MapPin icon (14px, muted)
- **Member row**: Stacked avatars (32px, max 5) + "+N more" text
- **Status indicators** (badges, bottom of card):
  - Active polls count: purple badge with Vote icon (e.g., "2 active polls")
  - Budget status: teal badge (e.g., "Budget set" with lock icon or "Set budget" prompt)
  - Days until trip: "In 23 days" or "Planning" muted text
- **Card behavior**: Entire card is clickable → navigates to Trip Overview
- **Card style**: White bg, 1px border, rounded-xl, shadow-sm, hover:shadow-md, p-5

### Requirements — Create Trip Modal
Triggered by "Create Trip" button. Contains:
- "Create a New Trip" heading (H2)
- Trip name input (required)
- Destination input with location autocomplete (Google Maps)
- Date range picker (start date + end date)
- Description textarea (optional, 3 lines)
- "Create Trip" primary button + "Cancel" secondary button
- Modal: max-w-lg, backdrop blur, rounded-xl, shadow-lg

### Requirements — Empty State
When user has no trips:
- Centered illustration area (placeholder for future illustration)
- "No trips yet" heading (H2)
- "Create your first trip and invite friends to start planning together." body text
- "Create Your First Trip" primary button (large)
- Below: "Or join a trip with an invite link" muted text with link

### States
- Trip cards: default (shadow-sm), hover (shadow-md, slight border change)
- Loading: 3 skeleton cards with pulse animation
- Error: "Couldn't load your trips" with retry button
- Empty: Educational empty state (described above)
- Create modal: loading state on submit button

### Interactions
- Click trip card → navigate to trip
- Click Create Trip → open modal
- Filter tabs → filter trip list (client-side)
- Cards sorted by most recent activity

### Constraints
- Maximum 50 trips visible (paginate beyond)
- Cards stack vertically on mobile (full-width)
- All touch targets 44px minimum
- No horizontal scrolling
- Use only defined color tokens

---

## Prompt D4: Trip Overview

### Context
TripOS is a collaborative group travel planning web app. The Trip Overview is the main workspace for a specific trip. It provides a summary of trip status, quick access to key features, and the activity feed. Displayed within the app layout shell (sidebar on desktop).

### Design Tokens

```css
:root {
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --card: 0 0% 100%;
  --card-foreground: 224 71% 4%;
  --muted: 220 14% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 224 76% 48%;
  --primary: 224 76% 48%;
  --primary-foreground: 210 40% 98%;
  --primary-subtle: 224 76% 95%;
  --secondary: 217 19% 27%;
  --secondary-foreground: 210 40% 98%;
  --accent: 25 95% 53%;
  --accent-foreground: 20 14% 4%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 37%;
  --privacy-foreground: 210 40% 98%;
  --privacy-subtle: 162 72% 95%;
  --vote: 262 83% 58%;
  --vote-foreground: 210 40% 98%;
  --vote-subtle: 262 83% 96%;
  --radius: 0.5rem;
}
```

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
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 42%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 45%;
  --privacy-foreground: 222 47% 11%;
  --privacy-subtle: 162 40% 15%;
  --vote: 262 83% 68%;
  --vote-foreground: 222 47% 11%;
  --vote-subtle: 262 30% 18%;
  --radius: 0.5rem;
}
```

### Typography
- Font: Inter. H1: 30px bold. H2: 24px semibold. H3: 20px semibold. Body: 16px. Small: 14px. Caption: 12px

### Icon Library

**REQUIRED**: Use Lucide Icons ONLY. Reference format: `lucide:[icon-name]`

Examples:

- Home icon → `lucide:home` → `<Home className="w-5 h-5" />`
- Calendar icon → `lucide:calendar` → `<Calendar className="w-5 h-5" />`
- Vote icon → `lucide:vote` → `<Vote className="w-5 h-5" />`
- Dollar Sign icon → `lucide:dollar-sign` → `<DollarSign className="w-5 h-5" />`
- Users icon → `lucide:users` → `<Users className="w-5 h-5" />`
- Bell icon → `lucide:bell` → `<Bell className="w-5 h-5" />`
- Settings icon → `lucide:settings` → `<Settings className="w-4 h-4" />`

**DO NOT use**:

- Material Icons
- Heroicons
- Font Awesome
- Custom SVGs (unless explicitly specified)

All icons in this prompt refer to Lucide icons.

### Token Usage Rules

**CRITICAL**: Use HSL CSS custom properties via Tailwind classes. NEVER use hex values directly.

**Correct examples**:

- Background: `bg-primary` → compiles to `background-color: hsl(var(--primary))`
- Text: `text-foreground` → compiles to `color: hsl(var(--foreground))`
- Border: `border-border` → compiles to `border-color: hsl(var(--border))`

**INCORRECT examples**:

- `bg-[#4F46E5]` ❌ (bypasses tokens, breaks dark mode)
- `style="background-color: #1D4ED8"` ❌ (inline hex value)
- `className="bg-blue-700"` ❌ (Tailwind default blue, not our primary token)

**Why hex values are shown in tables**: For designer reference only (Figma color pickers). Code must use token names.

**Tailwind config reminder**: All tokens are mapped in `tailwind.config.ts`:

```ts
colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
    subtle: 'hsl(var(--primary-subtle))',
  },
  // etc...
}
```

### Accessibility Requirements

**CRITICAL**: Use standard HTML accessibility attributes correctly.

#### Images

- Informative images: `<img src="..." alt="Description" />` (use standard `alt`, NOT `data-alt`)
- Decorative images: `<img src="..." alt="" />`

#### Icons

- Icon-only buttons: `<button aria-label="Open notifications"><Bell className="w-5 h-5" /></button>`
- Icons with visible text: `<button>Overview <Home aria-hidden="true" /></button>`
- Standalone icons conveying meaning: `<Bell aria-label="You have 3 notifications" />`

#### Links

- Link text must describe destination: `<a href="/settings">Trip settings</a>`
- Icon-only links: `<a href="/settings" aria-label="Trip settings"><Settings /></a>`

#### Form Inputs

- All inputs need labels: `<label for="tripname">Trip name</label><input id="tripname" />`
- Or aria-label if no visible label: `<input aria-label="Search trips" />`

**DO NOT**:

- Use `data-alt` (non-standard)
- Use `title` as a replacement for `alt` (title is for tooltips)
- Omit `aria-label` on icon-only buttons
- Forget `aria-hidden="true"` on decorative icons next to text

### Color Usage Rules

- **Primary buttons and links**: ALWAYS use `--primary` (indigo)
- **Feature accent colors**:
  - `--privacy` (teal): ONLY for lock icons, "Private" badges, blind budget indicators
  - `--vote` (purple): ONLY for poll card borders, vote type badges, quorum bars
- **Semantic colors**: Use `--success`, `--warning`, `--destructive`, `--info` for status communication
- **When in doubt**: Use `--primary` for interactive elements. Feature colors are highlights, not primary CTAs.

### Requirements — Trip Header
- Trip name (H1)
- Destination with MapPin icon + date range (muted text below)
- Member avatar stack (40px, max 5 + "+N") with online dots (green circle, bottom-right)
- "Invite" button (outline, Share icon) — right side

### Requirements — Quick Stats Row
Horizontal row of 3-4 stat cards (responsive wrap on mobile):
- **Members**: Users icon + "8 members" + "(3 online)" green text
- **Active Polls**: Vote icon (purple) + "2 active polls" — clickable → Votes tab
- **Budget Status**: Lock icon (teal) + "Budget set" or "Set your budget" — clickable → Budget tab
- **Activities**: Calendar icon + "12 activities planned"
- Each stat card: compact card style, p-4, icon left + text right, clickable

### Requirements — Activity Feed
Below stat cards, taking full width:
- "Recent Activity" section heading (H3) + "View All" link (right)
- Feed items, vertical list, most recent first, max 10 visible:
  - Each item: Avatar (32px) + action text + timestamp (relative: "2h ago")
  - Action text format: **[Actor name]** [action] [object]. Examples:
    - **Jordan** created a poll: "Which lodge?"
    - **Sam** set their private budget
    - **Maya** added "Sunset Hike" to Day 3
    - **Riley** voted on "Restaurant choice"
  - Budget actions: show lock icon, text says "set their private budget" (not the amount)
  - Clicking actor name → member profile card
  - Clicking object → navigate to that item (poll, activity, etc.)
- Items separated by subtle divider lines
- Day grouping headers: "Today", "Yesterday", "Feb 7"

### Requirements — Active Polls Summary (Optional Card)
If there are active polls, show a highlighted card:
- Purple left border (4px), vote-subtle background
- "Active Polls" heading with Vote icon
- List of 1-3 active polls: question text + deadline badge + vote count
- "View All Polls" link

### States
- Loading: skeleton header + 3 skeleton feed items
- No activity yet: "No activity yet. Create your first poll or add an activity to get started."
- Real-time updates: new feed items slide in at top with fade animation (300ms)
- Offline: muted banner "You're offline. Changes will sync when reconnected."

### Interactions
- Stat cards: click to navigate to corresponding tab
- Feed items: click objects to navigate
- Invite button: opens invite modal
- Pull-to-refresh on mobile
- Real-time: new items animate in

### Constraints
- Activity feed is read-only (no editing from feed)
- Budget amounts never shown in feed — only "set their private budget"
- Feed loads 10 items initially, "Load more" for pagination
- Mobile: stats stack 2x2 grid, feed full-width
- Use only defined color tokens

---

## Prompt D5: Members & Invitations

### Context
TripOS is a collaborative group travel planning web app. The Members screen shows all trip members, their roles, and online status. Owners and organizers can invite new members and manage roles. This screen is within the trip workspace.

### Design Tokens

```css
:root {
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --card: 0 0% 100%;
  --card-foreground: 224 71% 4%;
  --muted: 220 14% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 224 76% 48%;
  --primary: 224 76% 48%;
  --primary-foreground: 210 40% 98%;
  --primary-subtle: 224 76% 95%;
  --secondary: 217 19% 27%;
  --secondary-foreground: 210 40% 98%;
  --accent: 25 95% 53%;
  --accent-foreground: 20 14% 4%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 37%;
  --privacy-foreground: 210 40% 98%;
  --privacy-subtle: 162 72% 95%;
  --vote: 262 83% 58%;
  --vote-foreground: 210 40% 98%;
  --vote-subtle: 262 83% 96%;
  --radius: 0.5rem;
}
```

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
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 42%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 45%;
  --privacy-foreground: 222 47% 11%;
  --privacy-subtle: 162 40% 15%;
  --vote: 262 83% 68%;
  --vote-foreground: 222 47% 11%;
  --vote-subtle: 262 30% 18%;
  --radius: 0.5rem;
}
```

### Typography
- Font: Inter. H2: 24px semibold. H3: 20px semibold. Body: 16px. Small: 14px. Caption: 12px

### Icon Library

**REQUIRED**: Use Lucide Icons ONLY. Reference format: `lucide:[icon-name]`

Examples:

- Home icon → `lucide:home` → `<Home className="w-5 h-5" />`
- Calendar icon → `lucide:calendar` → `<Calendar className="w-5 h-5" />`
- Vote icon → `lucide:vote` → `<Vote className="w-5 h-5" />`
- Dollar Sign icon → `lucide:dollar-sign` → `<DollarSign className="w-5 h-5" />`
- Users icon → `lucide:users` → `<Users className="w-5 h-5" />`
- Bell icon → `lucide:bell` → `<Bell className="w-5 h-5" />`
- Settings icon → `lucide:settings` → `<Settings className="w-4 h-4" />`

**DO NOT use**:

- Material Icons
- Heroicons
- Font Awesome
- Custom SVGs (unless explicitly specified)

All icons in this prompt refer to Lucide icons.

### Token Usage Rules

**CRITICAL**: Use HSL CSS custom properties via Tailwind classes. NEVER use hex values directly.

**Correct examples**:

- Background: `bg-primary` → compiles to `background-color: hsl(var(--primary))`
- Text: `text-foreground` → compiles to `color: hsl(var(--foreground))`
- Border: `border-border` → compiles to `border-color: hsl(var(--border))`

**INCORRECT examples**:

- `bg-[#4F46E5]` ❌ (bypasses tokens, breaks dark mode)
- `style="background-color: #1D4ED8"` ❌ (inline hex value)
- `className="bg-blue-700"` ❌ (Tailwind default blue, not our primary token)

**Why hex values are shown in tables**: For designer reference only (Figma color pickers). Code must use token names.

**Tailwind config reminder**: All tokens are mapped in `tailwind.config.ts`:

```ts
colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
    subtle: 'hsl(var(--primary-subtle))',
  },
  // etc...
}
```

### Accessibility Requirements

**CRITICAL**: Use standard HTML accessibility attributes correctly.

#### Images

- Informative images: `<img src="..." alt="Description" />` (use standard `alt`, NOT `data-alt`)
- Decorative images: `<img src="..." alt="" />`

#### Icons

- Icon-only buttons: `<button aria-label="Open notifications"><Bell className="w-5 h-5" /></button>`
- Icons with visible text: `<button>Overview <Home aria-hidden="true" /></button>`
- Standalone icons conveying meaning: `<Bell aria-label="You have 3 notifications" />`

#### Links

- Link text must describe destination: `<a href="/settings">Trip settings</a>`
- Icon-only links: `<a href="/settings" aria-label="Trip settings"><Settings /></a>`

#### Form Inputs

- All inputs need labels: `<label for="tripname">Trip name</label><input id="tripname" />`
- Or aria-label if no visible label: `<input aria-label="Search trips" />`

**DO NOT**:

- Use `data-alt` (non-standard)
- Use `title` as a replacement for `alt` (title is for tooltips)
- Omit `aria-label` on icon-only buttons
- Forget `aria-hidden="true"` on decorative icons next to text

### Color Usage Rules

- **Primary buttons and links**: ALWAYS use `--primary` (indigo)
- **Feature accent colors**:
  - `--privacy` (teal): ONLY for lock icons, "Private" badges, blind budget indicators
  - `--vote` (purple): ONLY for poll card borders, vote type badges, quorum bars
- **Semantic colors**: Use `--success`, `--warning`, `--destructive`, `--info` for status communication
- **When in doubt**: Use `--primary` for interactive elements. Feature colors are highlights, not primary CTAs.

### Requirements — Members List
- Section heading: "Members" (H2) + member count badge + "Invite" primary button (right)
- Member cards in a single-column list:
  - Avatar (48px) with online indicator dot (green/yellow/none)
  - Name (16px, medium weight) + email below (14px, muted)
  - Role badge: Owner (primary badge), Organizer (accent badge), Member (default badge), Guest (muted badge)
  - If pending invite: dashed avatar border, "Pending" warning badge, email shown
  - Actions (for owners/organizers): three-dot menu → Change Role, Remove Member
- Members grouped: Owner first, then Organizers, then Members, then Guests, then Pending Invites
- Divider line between groups

### Requirements — Invite Modal
Triggered by "Invite" button:
- "Invite to [Trip Name]" heading (H2)
- Two invite methods (tabs or radio buttons):
  - **Share Link**: Generated URL with "Copy Link" button + expiry info ("Expires in 7 days")
  - **Email Invite**: Email input field + "Send Invite" button. Can add multiple emails (tag input)
- Role selector: Dropdown defaulting to "Member" (options: Organizer, Member, Guest)
- "Invites sent!" success toast after sending

### Requirements — Role Change
- Dropdown menu from three-dot actions
- Role options shown with permissions summary:
  - Organizer: "Can create polls, manage activities, invite members"
  - Member: "Can vote, suggest activities, view content"
  - Guest: "Can view trip details and vote"
- Confirmation dialog for role changes
- Owner transfer: separate action with strong confirmation ("This cannot be undone")

### States
- Members list: loading (3 skeleton rows), populated, empty (just the owner)
- Invite modal: default, sending (spinner), success (toast), error (inline)
- Pending invites: dashed border, "Pending" badge, "Resend" and "Cancel" actions
- Online status: green dot (online), yellow dot (away/5min), no dot (offline)

### Interactions
- Click member → expand profile card (name, email, role, joined date, last active)
- Three-dot menu → role change or remove
- Copy link → clipboard copy with "Copied!" tooltip
- Email invite → validates email format, shows error inline if invalid

### Constraints
- Only owners can remove members or transfer ownership
- Only owners and organizers can invite or change roles
- Members and guests see the list but no action menus
- Minimum 44px touch targets on all actions
- No horizontal scrolling
- Use only defined color tokens

---

## Prompt D6: Itinerary — Day Timeline & Activity Cards

### Context
TripOS is a collaborative group travel planning web app. The Itinerary screen shows a day-by-day timeline of trip activities. Users can add, edit, reorder (drag-and-drop), and view activities. Each activity has a time, name, location, notes, and estimated cost.

### Design Tokens

```css
:root {
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --card: 0 0% 100%;
  --card-foreground: 224 71% 4%;
  --muted: 220 14% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 224 76% 48%;
  --primary: 224 76% 48%;
  --primary-foreground: 210 40% 98%;
  --primary-subtle: 224 76% 95%;
  --secondary: 217 19% 27%;
  --secondary-foreground: 210 40% 98%;
  --accent: 25 95% 53%;
  --accent-foreground: 20 14% 4%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 37%;
  --privacy-foreground: 210 40% 98%;
  --privacy-subtle: 162 72% 95%;
  --vote: 262 83% 58%;
  --vote-foreground: 210 40% 98%;
  --vote-subtle: 262 83% 96%;
  --radius: 0.5rem;
}
```

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
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 42%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 45%;
  --privacy-foreground: 222 47% 11%;
  --privacy-subtle: 162 40% 15%;
  --vote: 262 83% 68%;
  --vote-foreground: 222 47% 11%;
  --vote-subtle: 262 30% 18%;
  --radius: 0.5rem;
}
```

### Typography
- Font: Inter. H2: 24px semibold. H3: 20px semibold. Body: 16px. Small: 14px. Caption: 12px

### Icon Library

**REQUIRED**: Use Lucide Icons ONLY. Reference format: `lucide:[icon-name]`

Examples:

- Home icon → `lucide:home` → `<Home className="w-5 h-5" />`
- Calendar icon → `lucide:calendar` → `<Calendar className="w-5 h-5" />`
- Vote icon → `lucide:vote` → `<Vote className="w-5 h-5" />`
- Dollar Sign icon → `lucide:dollar-sign` → `<DollarSign className="w-5 h-5" />`
- Users icon → `lucide:users` → `<Users className="w-5 h-5" />`
- Bell icon → `lucide:bell` → `<Bell className="w-5 h-5" />`
- Settings icon → `lucide:settings` → `<Settings className="w-4 h-4" />`

**DO NOT use**:

- Material Icons
- Heroicons
- Font Awesome
- Custom SVGs (unless explicitly specified)

All icons in this prompt refer to Lucide icons.

### Token Usage Rules

**CRITICAL**: Use HSL CSS custom properties via Tailwind classes. NEVER use hex values directly.

**Correct examples**:

- Background: `bg-primary` → compiles to `background-color: hsl(var(--primary))`
- Text: `text-foreground` → compiles to `color: hsl(var(--foreground))`
- Border: `border-border` → compiles to `border-color: hsl(var(--border))`

**INCORRECT examples**:

- `bg-[#4F46E5]` ❌ (bypasses tokens, breaks dark mode)
- `style="background-color: #1D4ED8"` ❌ (inline hex value)
- `className="bg-blue-700"` ❌ (Tailwind default blue, not our primary token)

**Why hex values are shown in tables**: For designer reference only (Figma color pickers). Code must use token names.

**Tailwind config reminder**: All tokens are mapped in `tailwind.config.ts`:

```ts
colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
    subtle: 'hsl(var(--primary-subtle))',
  },
  // etc...
}
```

### Accessibility Requirements

**CRITICAL**: Use standard HTML accessibility attributes correctly.

#### Images

- Informative images: `<img src="..." alt="Description" />` (use standard `alt`, NOT `data-alt`)
- Decorative images: `<img src="..." alt="" />`

#### Icons

- Icon-only buttons: `<button aria-label="Open notifications"><Bell className="w-5 h-5" /></button>`
- Icons with visible text: `<button>Overview <Home aria-hidden="true" /></button>`
- Standalone icons conveying meaning: `<Bell aria-label="You have 3 notifications" />`

#### Links

- Link text must describe destination: `<a href="/settings">Trip settings</a>`
- Icon-only links: `<a href="/settings" aria-label="Trip settings"><Settings /></a>`

#### Form Inputs

- All inputs need labels: `<label for="tripname">Trip name</label><input id="tripname" />`
- Or aria-label if no visible label: `<input aria-label="Search trips" />`

**DO NOT**:

- Use `data-alt` (non-standard)
- Use `title` as a replacement for `alt` (title is for tooltips)
- Omit `aria-label` on icon-only buttons
- Forget `aria-hidden="true"` on decorative icons next to text

### Color Usage Rules

- **Primary buttons and links**: ALWAYS use `--primary` (indigo)
- **Feature accent colors**:
  - `--privacy` (teal): ONLY for lock icons, "Private" badges, blind budget indicators
  - `--vote` (purple): ONLY for poll card borders, vote type badges, quorum bars
- **Semantic colors**: Use `--success`, `--warning`, `--destructive`, `--info` for status communication
- **When in doubt**: Use `--primary` for interactive elements. Feature colors are highlights, not primary CTAs.

### Requirements — Day Timeline Layout
- Day sections stacked vertically with clear separation
- Each day section:
  - **Day header**: "Day 1 — Mon, May 10" (H3) with day's cost total on right ("$180 estimated")
  - **Vertical timeline line**: 2px solid muted border, left side (32px from edge), connecting activity cards
  - **Timeline dots**: 12px circles on the line, primary color for confirmed, muted for proposed
  - Activity cards connected to timeline dots
- "Add Activity" button at end of each day (outline button, Plus icon)
- Day navigation: horizontal scrollable day tabs at top ("Day 1" / "Day 2" / etc.) for quick jumping

### Requirements — Activity Card
Each activity card (connected to timeline):
- **Left**: Time (14px, muted, e.g., "9:00 AM")
- **Main content**:
  - Activity name (16px, medium weight)
  - Location with MapPin icon (14px, muted)
  - Notes preview (14px, muted, 1 line truncated)
  - Estimated cost with DollarSign icon (14px, right-aligned)
- **Right edge**: Drag handle (GripVertical icon, visible always)
- **Status indicators** (badges):
  - If has active poll: purple "Vote" badge with Vote icon
  - If proposed (not confirmed): dashed border, "Proposed" muted badge
  - If over group budget: red DollarSign icon + "Over budget" badge
- **Actions** (on hover desktop, long-press mobile): Edit (Pencil), Delete (Trash2)
- Card style: white bg, 1px border, rounded-xl (12px), p-4, hover:shadow-sm

### Requirements — Add/Edit Activity Modal
- "Add Activity" or "Edit Activity" heading (H2)
- Fields:
  - Activity name (required, text input)
  - Day selector (dropdown: Day 1, Day 2, Day 3...)
  - Time (time picker, optional)
  - Location (Google Maps autocomplete input, with MapPin icon)
  - Estimated cost (number input with currency prefix "$", optional)
  - Notes (textarea, 3 rows, optional)
  - Category selector (optional, pill buttons: Food, Activity, Transport, Accommodation, Other)
- "Save Activity" primary button + "Cancel" secondary button
- "Create Poll for This Activity" link button (opens poll creation with activity pre-linked)

### Requirements — Empty Day State
When a day has no activities:
- Dashed border card
- "No activities planned for this day" text
- "Add an Activity" button (outline style)

### States
- Activity card: default, hover (shadow-sm, edit icon appears), dragging (shadow-lg, scale 1.02, placeholder gap)
- Timeline: loading (3 skeleton cards per day), empty (described above), populated
- Add modal: default, submitting (button loading), validation error (inline red text)
- Drag-and-drop: source fades to 50% opacity, drop target highlights with primary border, smooth animation (200ms)

### Interactions
- Drag-and-drop to reorder activities within and between days
- Click activity card → expand inline details OR open edit modal
- Click "Add Activity" → open modal
- Click Map toggle (top-right) → switch to map view
- Click vote badge → navigate to that poll
- On mobile: swipe actions (edit/delete) or long-press for action menu

### Constraints
- Activities sorted by time within each day
- Drag-and-drop has accessible alternative: up/down arrow buttons per card
- Touch targets: drag handle area 44px wide, all buttons 44px minimum
- Timeline connector line visible on desktop, hidden on mobile (cards stack directly)
- Mobile: full-width cards, no timeline line, time shown inline
- No horizontal scrolling
- Use only defined color tokens

---

## Prompt D7: Map View

### Context
TripOS is a collaborative group travel planning web app. The Map View shows all trip activities plotted on an interactive Google Map. Users can view routes between activities and click pins to see details. Toggled from the Itinerary screen.

### Design Tokens

```css
:root {
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --card: 0 0% 100%;
  --card-foreground: 224 71% 4%;
  --muted: 220 14% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 224 76% 48%;
  --primary: 224 76% 48%;
  --primary-foreground: 210 40% 98%;
  --primary-subtle: 224 76% 95%;
  --secondary: 217 19% 27%;
  --secondary-foreground: 210 40% 98%;
  --accent: 25 95% 53%;
  --accent-foreground: 20 14% 4%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 37%;
  --privacy-foreground: 210 40% 98%;
  --privacy-subtle: 162 72% 95%;
  --vote: 262 83% 58%;
  --vote-foreground: 210 40% 98%;
  --vote-subtle: 262 83% 96%;
  --radius: 0.5rem;
}
```

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
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 42%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 45%;
  --privacy-foreground: 222 47% 11%;
  --privacy-subtle: 162 40% 15%;
  --vote: 262 83% 68%;
  --vote-foreground: 222 47% 11%;
  --vote-subtle: 262 30% 18%;
  --radius: 0.5rem;
}
```

### Typography
- Font: Inter. H3: 20px semibold. Body: 16px. Small: 14px. Caption: 12px

### Icon Library

**REQUIRED**: Use Lucide Icons ONLY. Reference format: `lucide:[icon-name]`

Examples:

- Home icon → `lucide:home` → `<Home className="w-5 h-5" />`
- Calendar icon → `lucide:calendar` → `<Calendar className="w-5 h-5" />`
- Vote icon → `lucide:vote` → `<Vote className="w-5 h-5" />`
- Dollar Sign icon → `lucide:dollar-sign` → `<DollarSign className="w-5 h-5" />`
- Users icon → `lucide:users` → `<Users className="w-5 h-5" />`
- Bell icon → `lucide:bell` → `<Bell className="w-5 h-5" />`
- Settings icon → `lucide:settings` → `<Settings className="w-4 h-4" />`

**DO NOT use**:

- Material Icons
- Heroicons
- Font Awesome
- Custom SVGs (unless explicitly specified)

All icons in this prompt refer to Lucide icons.

### Token Usage Rules

**CRITICAL**: Use HSL CSS custom properties via Tailwind classes. NEVER use hex values directly.

**Correct examples**:

- Background: `bg-primary` → compiles to `background-color: hsl(var(--primary))`
- Text: `text-foreground` → compiles to `color: hsl(var(--foreground))`
- Border: `border-border` → compiles to `border-color: hsl(var(--border))`

**INCORRECT examples**:

- `bg-[#4F46E5]` ❌ (bypasses tokens, breaks dark mode)
- `style="background-color: #1D4ED8"` ❌ (inline hex value)
- `className="bg-blue-700"` ❌ (Tailwind default blue, not our primary token)

**Why hex values are shown in tables**: For designer reference only (Figma color pickers). Code must use token names.

**Tailwind config reminder**: All tokens are mapped in `tailwind.config.ts`:

```ts
colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
    subtle: 'hsl(var(--primary-subtle))',
  },
  // etc...
}
```

### Accessibility Requirements

**CRITICAL**: Use standard HTML accessibility attributes correctly.

#### Images

- Informative images: `<img src="..." alt="Description" />` (use standard `alt`, NOT `data-alt`)
- Decorative images: `<img src="..." alt="" />`

#### Icons

- Icon-only buttons: `<button aria-label="Open notifications"><Bell className="w-5 h-5" /></button>`
- Icons with visible text: `<button>Overview <Home aria-hidden="true" /></button>`
- Standalone icons conveying meaning: `<Bell aria-label="You have 3 notifications" />`

#### Links

- Link text must describe destination: `<a href="/settings">Trip settings</a>`
- Icon-only links: `<a href="/settings" aria-label="Trip settings"><Settings /></a>`

#### Form Inputs

- All inputs need labels: `<label for="tripname">Trip name</label><input id="tripname" />`
- Or aria-label if no visible label: `<input aria-label="Search trips" />`

**DO NOT**:

- Use `data-alt` (non-standard)
- Use `title` as a replacement for `alt` (title is for tooltips)
- Omit `aria-label` on icon-only buttons
- Forget `aria-hidden="true"` on decorative icons next to text

### Color Usage Rules

- **Primary buttons and links**: ALWAYS use `--primary` (indigo)
- **Feature accent colors**:
  - `--privacy` (teal): ONLY for lock icons, "Private" badges, blind budget indicators
  - `--vote` (purple): ONLY for poll card borders, vote type badges, quorum bars
- **Semantic colors**: Use `--success`, `--warning`, `--destructive`, `--info` for status communication
- **When in doubt**: Use `--primary` for interactive elements. Feature colors are highlights, not primary CTAs.

### Requirements
- Full-width map taking main content area (with sidebar visible on desktop)
- **Map pins**: Custom styled pins with day number badge (e.g., "D1" for Day 1 activities)
  - Pin color: primary (confirmed), muted (proposed), vote purple (has active poll)
  - Pin shape: rounded-lg rectangle with day number + small triangle pointer bottom
- **Route lines**: Dotted lines connecting sequential activities within the same day, muted color
- **Pin info window** (on click): Compact card with activity name, time, location, cost, "View Details" link
- **Day filter**: Floating pill selector (top-left overlay): "All Days" / "Day 1" / "Day 2" — filters pins
- **Toggle button**: "List View" button (top-right overlay) to switch back to timeline
- **Activity list sidebar** (desktop only): Collapsible panel showing mini activity cards that highlight corresponding pin on hover

### States
- Loading: Map loads with skeleton overlay, then pins appear
- No location data: "Some activities don't have locations. Add locations to see them on the map." banner
- Map API error: "Map couldn't load. Try refreshing." with retry button + text-based location list fallback
- Single activity: Map centered on that pin, no route lines

### Interactions
- Click pin → show info window popup
- Click "View Details" in popup → expand activity or navigate to itinerary
- Day filter → show/hide pins by day
- Hover activity in sidebar → highlight corresponding pin (pulse animation)
- Zoom and pan: standard Google Maps controls

### Constraints
- Map lazy loads (deferred JavaScript)
- Mobile: map takes full viewport height minus bottom tabs, activity list accessible via bottom sheet
- Day filter must not overlap map controls
- Info window must not overflow viewport
- Use only defined color tokens for custom pins and overlays

---

## Prompt D8: Voting — Poll List & Create Poll

### Context
TripOS is a collaborative group travel planning web app. The Votes tab shows all polls for a trip — active polls requiring action, and completed polls with results. Organizers can create new polls with various voting methods, deadlines, and quorum settings. Voting is the KILLER FEATURE differentiator.

### Layout Context

This screen uses the standard navigation shell from D1:

- 64px top navigation bar (logo, trip selector, notifications, avatar)
- 280px left sidebar (trip nav: Overview, Itinerary, Votes, Budget, Members)
- Main content area: margin-left 280px, padding 24px

DO NOT create custom navigation. The requirements below specify ONLY the main content area.

### Design Tokens

```css
:root {
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --card: 0 0% 100%;
  --card-foreground: 224 71% 4%;
  --muted: 220 14% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 224 76% 48%;
  --primary: 224 76% 48%;
  --primary-foreground: 210 40% 98%;
  --primary-subtle: 224 76% 95%;
  --secondary: 217 19% 27%;
  --secondary-foreground: 210 40% 98%;
  --accent: 25 95% 53%;
  --accent-foreground: 20 14% 4%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 37%;
  --privacy-foreground: 210 40% 98%;
  --privacy-subtle: 162 72% 95%;
  --vote: 262 83% 58%;
  --vote-foreground: 210 40% 98%;
  --vote-subtle: 262 83% 96%;
  --radius: 0.5rem;
}
```

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
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 42%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 45%;
  --privacy-foreground: 222 47% 11%;
  --privacy-subtle: 162 40% 15%;
  --vote: 262 83% 68%;
  --vote-foreground: 222 47% 11%;
  --vote-subtle: 262 30% 18%;
  --radius: 0.5rem;
}
```

### Typography

- Font: Inter. H2: 24px semibold. H3: 20px semibold. Body: 16px. Small: 14px. Caption: 12px

### Icon Library

**REQUIRED**: Use Lucide Icons ONLY. Reference format: `lucide:[icon-name]`

Examples:

- Vote icon → `lucide:vote` → `<Vote className="w-5 h-5 text-vote" />`
- Clock icon → `lucide:clock` → `<Clock className="w-4 h-4" />`
- Users icon → `lucide:users` → `<Users className="w-5 h-5" />`
- Lock icon → `lucide:lock` → `<Lock className="w-4 h-4" />`

**DO NOT use**:

- Material Icons
- Heroicons
- Font Awesome
- Custom SVGs (unless explicitly specified)

All icons in this prompt refer to Lucide icons. When you see "Vote icon" in requirements, use `lucide:vote`.

### Token Usage Rules

**CRITICAL**: Use HSL CSS custom properties via Tailwind classes. NEVER use hex values directly.

**Correct examples**:

- Background: `bg-vote-subtle` → compiles to `background-color: hsl(var(--vote-subtle))`
- Text: `text-primary` → compiles to `color: hsl(var(--primary))`
- Border: `border-vote` → compiles to `border-color: hsl(var(--vote))`

**INCORRECT examples**:

- `bg-[#F5F3FF]` ❌ (bypasses tokens, breaks dark mode)
- `style="background-color: #A855F7"` ❌ (inline hex value)
- `className="bg-purple-700"` ❌ (Tailwind default purple, not our vote token)

**Why hex values are shown in tables**: For designer reference only (Figma color pickers). Code must use token names.

**Tailwind config reminder**: All tokens are mapped in `tailwind.config.ts`:

```ts
colors: {
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
    subtle: 'hsl(var(--primary-subtle))',
  },
  vote: {
    DEFAULT: 'hsl(var(--vote))',
    foreground: 'hsl(var(--vote-foreground))',
    subtle: 'hsl(var(--vote-subtle))',
  },
  // etc...
}
```

### Accessibility Requirements

**CRITICAL**: Use standard HTML accessibility attributes correctly.

#### Images

- Informative images: `<img src="..." alt="Description" />` (use standard `alt`, NOT `data-alt`)
- Decorative images: `<img src="..." alt="" />`

#### Icons

- Icon-only buttons: `<button aria-label="Create poll"><Vote className="w-5 h-5" /></button>`
- Icons with visible text: `<button>Create Poll <Vote aria-hidden="true" /></button>`
- Standalone icons conveying meaning: `<Lock aria-label="Anonymous poll" />`

#### Links

- Link text must describe destination: `<a href="/votes">View all polls</a>`
- Icon-only links: `<a href="/votes" aria-label="View polls"><ChevronRight /></a>`

#### Form Inputs

- All inputs need labels: `<label for="question">Poll question</label><input id="question" />`
- Or aria-label if no visible label: `<input aria-label="Poll question" />`

**DO NOT**:

- Use `data-alt` (non-standard)
- Use `title` as a replacement for `alt` (title is for tooltips)
- Omit `aria-label` on icon-only buttons
- Forget `aria-hidden="true"` on decorative icons next to text

### Color Usage Rules

- **Primary buttons and links**: ALWAYS use `--primary` (indigo)
- **Feature accent colors**:
  - `--privacy` (teal): ONLY for lock icons, "Private" badges, blind budget indicators
  - `--vote` (purple): ONLY for poll card borders, vote type badges, quorum bars
- **Semantic colors**: Use `--success`, `--warning`, `--destructive`, `--info` for status communication
- **When in doubt**: Use `--primary` for interactive elements. Feature colors are highlights, not primary CTAs.

### Requirements — Poll List

- Section tabs: "Active" (with count badge) | "Completed" | "All"
- "Create Poll" button (PRIMARY color background, white text, Vote icon) — top right
  - IMPORTANT: Use --primary (indigo), NOT --vote (purple). Purple is for poll cards and badges, NOT primary actions.
- Poll cards in single-column list:

**Active Poll Card**:
- 4px left border in vote color (purple)
- Vote-subtle background
- Question text (H3)
- Vote type badge: "Yes/No" or "Ranked Choice" or "Approval" (small, vote-subtle bg, vote text)
- Deadline: Clock icon + "Closes in 2 days" (or amber warning "Closes in 4 hours")
- Quorum progress bar: "5 of 8 voted" with visual bar (vote color fill on muted bg)
- Anonymous indicator: Lock icon in --vote color + "Anonymous" text label (if anonymous)
- "Vote Now" button (vote-colored, if user hasn't voted)
- "Voted" checkmark badge (success color, if user already voted)

**Completed Poll Card**:
- Standard border (no purple left border)
- Muted background
- Question text (H3)
- Winner text: "Winner: [Option Name]" with checkmark (success color)
- Vote count: "Decided by 9 votes"
- "View Results" ghost button

### Requirements — Create Poll Modal
- "Create a Poll" heading (H2) with Vote icon
- **Basic fields** (visible by default):
  - Question text (required, text input, placeholder: "What should we decide?")
  - Options (minimum 2, add more with "+ Add Option" link button):
    - Each option: text input + optional description textarea + Remove (X) button
  - "Create Poll" vote-colored button + "Cancel" secondary button

- **Advanced settings** (collapsed accordion: "Advanced Settings"):
  - Vote type radio group (default: Yes/No):
    - Yes/No — "Simple thumbs up/down for quick decisions"
    - Ranked Choice — "Rank options in order of preference"
    - Approval — "Select all options you approve of"
  - Deadline: Date+time picker (default: 48 hours from now)
  - Quorum: Number input or percentage slider (default: 60% of members)
  - Anonymous voting: Toggle switch (default: ON) with Lock icon + "Votes are anonymous"
  - Allow vote changes: Toggle switch (default: ON) + "Members can change their vote before deadline"
  - Link to activity: Dropdown to select a trip activity (optional)

### Requirements — Empty State
When no polls exist:
- Vote icon (48px, muted)
- "No polls yet" heading
- "Create a poll to start making group decisions. Set deadlines and let democracy decide."
- "Create Your First Poll" vote-colored button

### States
- Poll cards: loading (3 skeleton cards), populated, empty (described)
- Create modal: default, validation errors (inline), submitting (button spinner), success (toast "Poll created!")
- Quorum bar: always uses --vote purple fill on --muted background at all percentages. Urgency is communicated by the deadline badge (which uses amber/destructive), not by changing the quorum bar fill color
- Deadline: normal (muted), warning (<24h, amber), critical (<2h, destructive), expired (crossed out)

### Interactions
- Click active poll card → navigate to voting interface
- Click completed poll → expand results inline or navigate to results view
- Create Poll button → open modal
- Advanced settings toggle → smooth accordion expand (200ms)
- Adding options: "+ Add Option" appends new input field (fade in 150ms)
- Removing option: X button removes with fade out (150ms)
- Real-time: quorum bar updates when someone votes (animated bar fill, 300ms)

### Constraints
- Minimum 2 options required to create a poll
- Maximum 12 options per poll
- Deadline required (cannot create poll without deadline)
- Only organizers and owners can create polls
- Members see poll list and can vote but no "Create Poll" button
- Touch targets 44px minimum
- No horizontal scrolling
- Use only defined color tokens

---

## Prompt D9: Voting — Cast Vote Interface (All Types)

### Context
TripOS is a collaborative group travel planning web app. This is the voting interface where members cast their vote on active polls. Three vote types: Yes/No (simple), Ranked Choice (drag-to-rank), and Approval (multi-select). Validated UX patterns from research on 12 voting platforms.

### Design Tokens

```css
:root {
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --card: 0 0% 100%;
  --card-foreground: 224 71% 4%;
  --muted: 220 14% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 224 76% 48%;
  --primary: 224 76% 48%;
  --primary-foreground: 210 40% 98%;
  --primary-subtle: 224 76% 95%;
  --secondary: 217 19% 27%;
  --secondary-foreground: 210 40% 98%;
  --accent: 25 95% 53%;
  --accent-foreground: 20 14% 4%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 37%;
  --privacy-foreground: 210 40% 98%;
  --privacy-subtle: 162 72% 95%;
  --vote: 262 83% 58%;
  --vote-foreground: 210 40% 98%;
  --vote-subtle: 262 83% 96%;
  --radius: 0.5rem;
}
```

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
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 42%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 45%;
  --privacy-foreground: 222 47% 11%;
  --privacy-subtle: 162 40% 15%;
  --vote: 262 83% 68%;
  --vote-foreground: 222 47% 11%;
  --vote-subtle: 262 30% 18%;
  --radius: 0.5rem;
}
```

### Typography
- Font: Inter. H2: 24px semibold. H3: 20px semibold. Body: 16px. Small: 14px. Caption: 12px

### Icon Library

**REQUIRED**: Use Lucide Icons ONLY. Reference format: `lucide:[icon-name]`

Examples:

- Home icon → `lucide:home` → `<Home className="w-5 h-5" />`
- Calendar icon → `lucide:calendar` → `<Calendar className="w-5 h-5" />`
- Vote icon → `lucide:vote` → `<Vote className="w-5 h-5" />`
- Dollar Sign icon → `lucide:dollar-sign` → `<DollarSign className="w-5 h-5" />`
- Users icon → `lucide:users` → `<Users className="w-5 h-5" />`
- Bell icon → `lucide:bell` → `<Bell className="w-5 h-5" />`
- Settings icon → `lucide:settings` → `<Settings className="w-4 h-4" />`

**DO NOT use**:

- Material Icons
- Heroicons
- Font Awesome
- Custom SVGs (unless explicitly specified)

All icons in this prompt refer to Lucide icons.

### Token Usage Rules

**CRITICAL**: Use HSL CSS custom properties via Tailwind classes. NEVER use hex values directly.

**Correct examples**:

- Background: `bg-primary` → compiles to `background-color: hsl(var(--primary))`
- Text: `text-foreground` → compiles to `color: hsl(var(--foreground))`
- Border: `border-border` → compiles to `border-color: hsl(var(--border))`

**INCORRECT examples**:

- `bg-[#4F46E5]` ❌ (bypasses tokens, breaks dark mode)
- `style="background-color: #1D4ED8"` ❌ (inline hex value)
- `className="bg-blue-700"` ❌ (Tailwind default blue, not our primary token)

**Why hex values are shown in tables**: For designer reference only (Figma color pickers). Code must use token names.

**Tailwind config reminder**: All tokens are mapped in `tailwind.config.ts`:

```ts
colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
    subtle: 'hsl(var(--primary-subtle))',
  },
  // etc...
}
```

### Accessibility Requirements

**CRITICAL**: Use standard HTML accessibility attributes correctly.

#### Images

- Informative images: `<img src="..." alt="Description" />` (use standard `alt`, NOT `data-alt`)
- Decorative images: `<img src="..." alt="" />`

#### Icons

- Icon-only buttons: `<button aria-label="Open notifications"><Bell className="w-5 h-5" /></button>`
- Icons with visible text: `<button>Overview <Home aria-hidden="true" /></button>`
- Standalone icons conveying meaning: `<Bell aria-label="You have 3 notifications" />`

#### Links

- Link text must describe destination: `<a href="/settings">Trip settings</a>`
- Icon-only links: `<a href="/settings" aria-label="Trip settings"><Settings /></a>`

#### Form Inputs

- All inputs need labels: `<label for="tripname">Trip name</label><input id="tripname" />`
- Or aria-label if no visible label: `<input aria-label="Search trips" />`

**DO NOT**:

- Use `data-alt` (non-standard)
- Use `title` as a replacement for `alt` (title is for tooltips)
- Omit `aria-label` on icon-only buttons
- Forget `aria-hidden="true"` on decorative icons next to text

### Color Usage Rules

- **Primary buttons and links**: ALWAYS use `--primary` (indigo)
- **Feature accent colors**:
  - `--privacy` (teal): ONLY for lock icons, "Private" badges, blind budget indicators
  - `--vote` (purple): ONLY for poll card borders, vote type badges, quorum bars
- **Semantic colors**: Use `--success`, `--warning`, `--destructive`, `--info` for status communication
- **When in doubt**: Use `--primary` for interactive elements. Feature colors are highlights, not primary CTAs.

### Requirements — Shared Vote Header (All Types)
- Question text (H2)
- Vote type badge (e.g., "Ranked Choice")
- Anonymous indicator: Lock icon in --vote color + "Your vote is anonymous" text label (if anonymous)
- Deadline: Clock icon + countdown ("Closes in 1 day 14:32")
- Quorum progress: "5 of 8 voted (63%)" with progress bar (vote color)
- Creator attribution: "Created by [Name]" (caption, muted)

### Requirements — Yes/No Vote
- Two large buttons side-by-side (desktop) or stacked (mobile):
  - "Yes" button: `hsl(var(--vote-subtle))` background, `hsl(var(--vote))` border (2px), Check icon, min height 56px
  - "No" button: `hsl(var(--muted))` background, `hsl(var(--border))` border (1px), X icon, min height 56px
- Optional: "Abstain" ghost button below (if feature enabled)
- After voting: selected button shows filled state with checkmark, other dims to 30% opacity
- "Change Vote" link appears after voting (if allowed)

### Requirements — Ranked Choice Vote
- **Instruction text**: "Drag to rank your preferences (1 = most preferred)" (14px, muted)
- **Option cards** — full-width, stacked vertically:
  - Each card: numbered rank badge (circle, 32px, vote color, white text: "1", "2", "3"...)
  - Drag handle: GripVertical icon (left side, 44px touch area)
  - Option text (16px) + optional description (14px, muted)
  - Up/Down arrow buttons (right side) — accessible alternative to drag
- **Drag behavior**:
  - Picked up: card elevates (shadow-lg), scale 1.02, 50% opacity on original position
  - Drop zone: highlighted with vote-subtle background + dashed border
  - On drop: smooth reorder animation (200ms), rank badges renumber
  - Haptic feedback on mobile (if supported)
- **Review section** (below cards):
  - "Your ranking:" summary showing options in rank order
  - "Cast Vote" vote-colored button (disabled until all options ranked)
- **Important**: System NEVER auto-reorders without explicit user action

### Requirements — Approval Vote
- **Instruction text**: "Select all options you approve of" (14px, muted)
- **Option cards** — full-width checkboxes:
  - Each option: Checkbox (24px) + option text (16px) + optional description (14px, muted)
  - Selected state: vote-subtle background, vote color checkbox fill, checkmark
  - Counter: "2 of 5 selected" (small text, above submit button)
- "Cast Vote" vote-colored button (disabled until at least 1 selected)

### Requirements — Post-Vote Confirmation
After submitting any vote type:
- Checkmark animation (200ms): large checkmark in vote color, centered
- "Vote submitted!" text (success color)
- Transition to results view (see Prompt D10)
- "Change Vote" link (if changes allowed, before deadline)

### States
- Not voted: vote buttons active, instructions visible
- Voting in progress (ranked): cards being dragged, reordering
- Voted: confirmation shown, options dimmed, "Change Vote" link
- Deadline expired: "This poll has closed" overlay, voting disabled, show results
- Loading: skeleton option cards

### Interactions
- Yes/No: single tap to vote
- Ranked: drag-and-drop OR up/down buttons to reorder, then submit
- Approval: tap checkboxes to toggle, then submit
- Change vote: "Change Vote" link resets to voting state
- Real-time: quorum bar animates when others vote during session
- Keyboard: Tab between options, Space/Enter to select, Arrow keys for ranked reorder

### Constraints
- All option cards minimum 48px height (mobile touch targets)
- Drag handle area: 44px wide minimum
- Ranked choice: ALL options must be ranked before submission (no partial ranking)
- Approval: at least 1 option must be selected
- If deadline passes while voting, show "Poll closed" and save vote if possible
- No horizontal scrolling
- Use only defined color tokens

---

## Prompt D10: Voting — Poll Results

### Context
TripOS is a collaborative group travel planning web app. The results view shows vote outcomes after a poll closes (or in real-time during voting for non-anonymous polls). Supports Yes/No, Ranked Choice, and Approval result displays. Results update in real-time via WebSocket.

### Design Tokens

```css
:root {
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --card: 0 0% 100%;
  --card-foreground: 224 71% 4%;
  --muted: 220 14% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 224 76% 48%;
  --primary: 224 76% 48%;
  --primary-foreground: 210 40% 98%;
  --primary-subtle: 224 76% 95%;
  --secondary: 217 19% 27%;
  --secondary-foreground: 210 40% 98%;
  --accent: 25 95% 53%;
  --accent-foreground: 20 14% 4%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 37%;
  --privacy-foreground: 210 40% 98%;
  --privacy-subtle: 162 72% 95%;
  --vote: 262 83% 58%;
  --vote-foreground: 210 40% 98%;
  --vote-subtle: 262 83% 96%;
  --radius: 0.5rem;
}
```

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
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 42%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 45%;
  --privacy-foreground: 222 47% 11%;
  --privacy-subtle: 162 40% 15%;
  --vote: 262 83% 68%;
  --vote-foreground: 222 47% 11%;
  --vote-subtle: 262 30% 18%;
  --radius: 0.5rem;
}
```

### Typography
- Font: Inter. H2: 24px semibold. H3: 20px semibold. Body: 16px. Small: 14px. Caption: 12px

### Icon Library

**REQUIRED**: Use Lucide Icons ONLY. Reference format: `lucide:[icon-name]`

Examples:

- Home icon → `lucide:home` → `<Home className="w-5 h-5" />`
- Calendar icon → `lucide:calendar` → `<Calendar className="w-5 h-5" />`
- Vote icon → `lucide:vote` → `<Vote className="w-5 h-5" />`
- Dollar Sign icon → `lucide:dollar-sign` → `<DollarSign className="w-5 h-5" />`
- Users icon → `lucide:users` → `<Users className="w-5 h-5" />`
- Bell icon → `lucide:bell` → `<Bell className="w-5 h-5" />`
- Settings icon → `lucide:settings` → `<Settings className="w-4 h-4" />`

**DO NOT use**:

- Material Icons
- Heroicons
- Font Awesome
- Custom SVGs (unless explicitly specified)

All icons in this prompt refer to Lucide icons.

### Token Usage Rules

**CRITICAL**: Use HSL CSS custom properties via Tailwind classes. NEVER use hex values directly.

**Correct examples**:

- Background: `bg-primary` → compiles to `background-color: hsl(var(--primary))`
- Text: `text-foreground` → compiles to `color: hsl(var(--foreground))`
- Border: `border-border` → compiles to `border-color: hsl(var(--border))`

**INCORRECT examples**:

- `bg-[#4F46E5]` ❌ (bypasses tokens, breaks dark mode)
- `style="background-color: #1D4ED8"` ❌ (inline hex value)
- `className="bg-blue-700"` ❌ (Tailwind default blue, not our primary token)

**Why hex values are shown in tables**: For designer reference only (Figma color pickers). Code must use token names.

**Tailwind config reminder**: All tokens are mapped in `tailwind.config.ts`:

```ts
colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
    subtle: 'hsl(var(--primary-subtle))',
  },
  // etc...
}
```

### Accessibility Requirements

**CRITICAL**: Use standard HTML accessibility attributes correctly.

#### Images

- Informative images: `<img src="..." alt="Description" />` (use standard `alt`, NOT `data-alt`)
- Decorative images: `<img src="..." alt="" />`

#### Icons

- Icon-only buttons: `<button aria-label="Open notifications"><Bell className="w-5 h-5" /></button>`
- Icons with visible text: `<button>Overview <Home aria-hidden="true" /></button>`
- Standalone icons conveying meaning: `<Bell aria-label="You have 3 notifications" />`

#### Links

- Link text must describe destination: `<a href="/settings">Trip settings</a>`
- Icon-only links: `<a href="/settings" aria-label="Trip settings"><Settings /></a>`

#### Form Inputs

- All inputs need labels: `<label for="tripname">Trip name</label><input id="tripname" />`
- Or aria-label if no visible label: `<input aria-label="Search trips" />`

**DO NOT**:

- Use `data-alt` (non-standard)
- Use `title` as a replacement for `alt` (title is for tooltips)
- Omit `aria-label` on icon-only buttons
- Forget `aria-hidden="true"` on decorative icons next to text

### Color Usage Rules

- **Primary buttons and links**: ALWAYS use `--primary` (indigo)
- **Feature accent colors**:
  - `--privacy` (teal): ONLY for lock icons, "Private" badges, blind budget indicators
  - `--vote` (purple): ONLY for poll card borders, vote type badges, quorum bars
- **Semantic colors**: Use `--success`, `--warning`, `--destructive`, `--info` for status communication
- **When in doubt**: Use `--primary` for interactive elements. Feature colors are highlights, not primary CTAs.

### Requirements — Results Header
- Question text (H2)
- Status badge: "Decided" (success) or "Tie" (warning) or "No Quorum" (destructive)
- Winner announcement: "Winner: [Option Name]" in large text (H3) with checkmark (success)
- Total votes: "9 of 12 members voted" (muted text)
- Closed date: "Decided Feb 8, 2026 at 11:59 PM"

### Requirements — Yes/No Results
- Two horizontal bars (full-width):
  - "Yes" bar: hsl(var(--vote)) fill, width proportional to %, label "Yes — 7 votes (78%)"
  - "No" bar: hsl(var(--muted-foreground)) fill, width proportional to %, label "No — 2 votes (22%)"
- Winner bar: slightly elevated, bold label
- If public: voter names below each bar (avatar + name chips)
- If anonymous: "Anonymous vote — names hidden"

### Requirements — Ranked Choice Results
- **Winner section**: Large highlighted card showing winner option with trophy icon
- **Round-by-round breakdown** (progressive disclosure):
  - "View elimination rounds" expandable section
  - Table or stepped visualization showing each round:
    - Round 1: vote distribution per option
    - "Eliminated: [Option X] (fewest votes)"
    - Round 2: redistributed votes
    - Continue until winner
  - Active round highlighted, eliminated options grayed out
- **Final ranking**: 1st, 2nd, 3rd (medal badges: gold, silver, bronze) with vote counts

### Requirements — Approval Results
- Horizontal bar chart (all options):
  - Each bar: option name + vote count + percentage
  - Bars sorted by votes (highest first)
  - Winner bar: vote color fill, others muted fill
  - Bar width proportional to max votes
- Winner option highlighted with checkmark badge

### Requirements — Failed Poll States
- **Tie**: "Tie between [A] and [B]" with warning badge. "Organizer: create a tiebreaker poll" action button
- **No Quorum**: "Only 3 of 8 voted — quorum not met" with red progress bar. "Re-open Poll" button for organizers

### States
- Loading: skeleton bars
- Real-time during voting: bars animate as votes come in (300ms ease-out transitions)
- Final results: static, no animation
- Tie: warning state with action prompt
- No quorum: error state with re-open option

### Interactions
- Bars animate on load (grow from 0% to actual %, 500ms staggered)
- Ranked choice rounds: click to expand/collapse
- If public: hover voter name → show avatar tooltip
- "Create Follow-up Poll" button for organizers (appears on ties or close results)
- "Share Results" button copies summary text to clipboard

### Constraints
- Anonymous polls: never show voter names, only aggregate counts
- Real-time updates: bars animate smoothly, don't jump
- Mobile: bars stack vertically, full-width
- Ranked choice rounds: collapsed by default (only winner shown)
- No horizontal scrolling
- Use only defined color tokens

---

## Prompt D11: Blind Budgeting — Private Input & Explainer

### Context
TripOS is a collaborative group travel planning web app. Blind Budgeting is the UNIQUE DIFFERENTIATOR — no competitor has this. It lets members set private budget caps; the system calculates a group maximum without revealing individuals. This screen handles the private budget input and the first-time explainer. Uses TEAL color exclusively (never primary blue) to create a distinct "privacy mode" visual language. Validated UX patterns from research on 10 privacy-focused apps.

### Layout Context

This screen uses the standard navigation shell from D1:

- 64px top navigation bar (logo, trip selector, notifications, avatar)
- 280px left sidebar (trip nav: Overview, Itinerary, Votes, Budget, Members)
- Main content area: margin-left 280px, padding 24px

DO NOT create custom navigation. The requirements below specify ONLY the main content area.

### Design Tokens

```css
:root {
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --card: 0 0% 100%;
  --card-foreground: 224 71% 4%;
  --muted: 220 14% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 224 76% 48%;
  --primary: 224 76% 48%;
  --primary-foreground: 210 40% 98%;
  --primary-subtle: 224 76% 95%;
  --secondary: 217 19% 27%;
  --secondary-foreground: 210 40% 98%;
  --accent: 25 95% 53%;
  --accent-foreground: 20 14% 4%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 37%;
  --privacy-foreground: 210 40% 98%;
  --privacy-subtle: 162 72% 95%;
  --vote: 262 83% 58%;
  --vote-foreground: 210 40% 98%;
  --vote-subtle: 262 83% 96%;
  --radius: 0.5rem;
}
```

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
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 42%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 45%;
  --privacy-foreground: 222 47% 11%;
  --privacy-subtle: 162 40% 15%;
  --vote: 262 83% 68%;
  --vote-foreground: 222 47% 11%;
  --vote-subtle: 262 30% 18%;
  --radius: 0.5rem;
}
```

### Typography

- Font: Inter. H2: 24px semibold. H3: 20px semibold. Body: 16px. Small: 14px. Caption: 12px

### Icon Library

**REQUIRED**: Use Lucide Icons ONLY. Reference format: `lucide:[icon-name]`

Examples:

- Lock icon → `lucide:lock` → `<Lock className="w-5 h-5 text-privacy" />`
- Users icon → `lucide:users` → `<Users className="w-5 h-5" />`
- Shield icon → `lucide:shield` → `<Shield className="w-4 h-4" />`
- Eye Off icon → `lucide:eye-off` → `<EyeOff className="w-4 h-4" />`

**DO NOT use**:

- Material Icons
- Heroicons
- Font Awesome
- Custom SVGs (unless explicitly specified)

All icons in this prompt refer to Lucide icons. When you see "Lock icon" in requirements, use `lucide:lock`.

### Token Usage Rules

**CRITICAL**: Use HSL CSS custom properties via Tailwind classes. NEVER use hex values directly.

**Correct examples**:

- Background: `bg-privacy-subtle` → compiles to `background-color: hsl(var(--privacy-subtle))`
- Text: `text-primary` → compiles to `color: hsl(var(--primary))`
- Border: `border-privacy` → compiles to `border-color: hsl(var(--privacy))`

**INCORRECT examples**:

- `bg-[#F0FDFA]` ❌ (bypasses tokens, breaks dark mode)
- `style="background-color: #0D9488"` ❌ (inline hex value)
- `className="bg-teal-700"` ❌ (Tailwind default teal, not our privacy token)

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

### Accessibility Requirements

**CRITICAL**: Use standard HTML accessibility attributes correctly.

#### Images

- Informative images: `<img src="..." alt="Description" />` (use standard `alt`, NOT `data-alt`)
- Decorative images: `<img src="..." alt="" />`

#### Icons

- Icon-only buttons: `<button aria-label="Save budget"><Lock className="w-5 h-5" /></button>`
- Icons with visible text: `<button>Save Privately <Lock aria-hidden="true" /></button>`
- Standalone icons conveying meaning: `<Lock aria-label="Private budget" />`

#### Links

- Link text must describe destination: `<a href="/privacy">Learn how blind budgeting works</a>`
- Icon-only links: `<a href="/privacy" aria-label="Privacy details"><ChevronDown /></a>`

#### Form Inputs

- All inputs need labels: `<label for="budget">Your budget</label><input id="budget" />`
- Or aria-label if no visible label: `<input aria-label="Budget amount" />`

**DO NOT**:

- Use `data-alt` (non-standard)
- Use `title` as a replacement for `alt` (title is for tooltips)
- Omit `aria-label` on icon-only buttons
- Forget `aria-hidden="true"` on decorative icons next to text

### Color Usage Rules

- **Primary buttons and links**: ALWAYS use `--primary` (indigo)
- **Feature accent colors**:
  - `--privacy` (teal): ONLY for lock icons, "Private" badges, blind budget indicators
  - `--vote` (purple): ONLY for poll card borders, vote type badges, quorum bars
- **Semantic colors**: Use `--success`, `--warning`, `--destructive`, `--info` for status communication
- **When in doubt**: Use `--primary` for interactive elements. Feature colors are highlights, not primary CTAs.

### Requirements — Budget Input Card
Privacy-themed card (NOT standard primary blue):
- Card background: privacy-subtle (light teal)
- Card border: 1px solid privacy color
- Card header: Lock icon (privacy color, 24px) + "Your Private Budget" (H3) + "Private" badge (teal badge with lock icon)
- Input area:
  - Currency prefix "$" (inside input, left)
  - Large number input (font-size 30px, bold, center-aligned)
  - "per person, total trip" label below input (small, muted)
  - "Only you can see this amount" reassurance text (14px, privacy color, Lock icon inline)
- "You can change this anytime" (caption, muted, below reassurance)
- "Save Privately" button: PRIMARY color background, white text, Lock icon (privacy-colored) left
  - IMPORTANT: Button uses --primary (indigo), only the Lock icon uses --privacy (teal). Teal is for privacy indicators, NOT primary button backgrounds.
- After save: checkmark animation + "Budget saved privately" confirmation (privacy color)

### Requirements — Privacy Details (Expandable)
Below the input card, expandable section:
- "Privacy Details" header with ChevronDown icon
- When expanded, privacy "nutrition label" format:
  - "Your budget: Only you can see this" (with Lock icon)
  - "Group sees: Maximum affordable amount" (with Users icon)
  - "We never share: Individual budgets, names linked to amounts" (with EyeOff icon)
  - "Not even the trip organizer can see your budget" (with Shield icon)
- "Learn how blind budgeting works" link → opens explainer modal

### Requirements — First-Time Explainer Modal (3-Step Carousel)
Triggered on first visit to Budget tab:
- Backdrop blur overlay
- Modal: max-w-md, rounded-xl, shadow-lg, p-8
- Step indicators: 3 dots at bottom (active dot: privacy color)
- Swipeable/clickable steps:

**Step 1** (Lock icon, large, centered):
- "Set Your Private Budget"
- "Enter the maximum you're comfortable spending. It's encrypted and only you can see it."

**Step 2** (Calculator icon, large, centered):
- "We Calculate the Group Max"
- "Our system finds the lowest budget in your group — without revealing whose it is."

**Step 3** (Checkmark in circle, large, centered):
- "Everyone Sees What's Affordable"
- "Search results show only options within your group's limit. No budget shame, no awkward conversations."

- "Get Started" privacy-colored button (on step 3)
- "Skip" ghost button (bottom, all steps)

### Requirements — Budget Already Set State
When user returns and budget is already saved:
- Card shows saved amount (large, bold) with Lock icon
- "Edit" button (outline, privacy color) to modify
- Below: "Last updated 2 hours ago" (caption, muted)
- Group status indicator: "8 of 12 members have set their budget" (privacy color progress bar)

### States
- Not set: empty input card + first-time explainer prompt
- First time: explainer carousel modal overlay
- Editing: input active with focus ring (privacy color)
- Saving: button shows spinner + "Saving..."
- Saved: checkmark animation + confirmation text
- Error: red border on input + "Couldn't save your budget. The connection dropped. Tap to retry." error text
- Already set: shows amount with edit option

### Interactions
- Input: tap to focus, numeric keyboard on mobile
- Save: validates non-zero amount, shows loading, confirms
- Explainer: swipe between steps (mobile) or click arrows (desktop)
- Privacy details: click to expand/collapse (smooth accordion, 200ms)
- Edit: "Edit" button clears lock state, enables input
- Real-time: group participation indicator updates as others set budgets

### Constraints
- NEVER show other members' budget amounts anywhere
- ALWAYS show Lock icon on this screen (persistent visual privacy indicator)
- Teal color ONLY (never primary blue) — this screen must feel distinctly "private"
- Budget input accepts whole numbers only (no decimals for MVP)
- Minimum budget: $1. Maximum: $99,999
- Touch targets 44px minimum
- No horizontal scrolling
- Use only defined color tokens

---

## Prompt D12: Blind Budgeting — Group Range Display

### Context
TripOS is a collaborative group travel planning web app. This screen shows the aggregate group budget information that ALL members can see — the group maximum and budget range — without revealing any individual budget amounts. Displayed alongside (desktop) or below (mobile) the private budget input. Uses TEAL color exclusively.

### Design Tokens

```css
:root {
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --card: 0 0% 100%;
  --card-foreground: 224 71% 4%;
  --muted: 220 14% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 224 76% 48%;
  --primary: 224 76% 48%;
  --primary-foreground: 210 40% 98%;
  --primary-subtle: 224 76% 95%;
  --secondary: 217 19% 27%;
  --secondary-foreground: 210 40% 98%;
  --accent: 25 95% 53%;
  --accent-foreground: 20 14% 4%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 37%;
  --privacy-foreground: 210 40% 98%;
  --privacy-subtle: 162 72% 95%;
  --vote: 262 83% 58%;
  --vote-foreground: 210 40% 98%;
  --vote-subtle: 262 83% 96%;
  --radius: 0.5rem;
}
```

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
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 42%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 45%;
  --privacy-foreground: 222 47% 11%;
  --privacy-subtle: 162 40% 15%;
  --vote: 262 83% 68%;
  --vote-foreground: 222 47% 11%;
  --vote-subtle: 262 30% 18%;
  --radius: 0.5rem;
}
```

### Typography
- Font: Inter. H2: 24px semibold. H3: 20px semibold. Body: 16px. Small: 14px. Caption: 12px

### Icon Library

**REQUIRED**: Use Lucide Icons ONLY. Reference format: `lucide:[icon-name]`

Examples:

- Home icon → `lucide:home` → `<Home className="w-5 h-5" />`
- Calendar icon → `lucide:calendar` → `<Calendar className="w-5 h-5" />`
- Vote icon → `lucide:vote` → `<Vote className="w-5 h-5" />`
- Dollar Sign icon → `lucide:dollar-sign` → `<DollarSign className="w-5 h-5" />`
- Users icon → `lucide:users` → `<Users className="w-5 h-5" />`
- Bell icon → `lucide:bell` → `<Bell className="w-5 h-5" />`
- Settings icon → `lucide:settings` → `<Settings className="w-4 h-4" />`

**DO NOT use**:

- Material Icons
- Heroicons
- Font Awesome
- Custom SVGs (unless explicitly specified)

All icons in this prompt refer to Lucide icons.

### Token Usage Rules

**CRITICAL**: Use HSL CSS custom properties via Tailwind classes. NEVER use hex values directly.

**Correct examples**:

- Background: `bg-primary` → compiles to `background-color: hsl(var(--primary))`
- Text: `text-foreground` → compiles to `color: hsl(var(--foreground))`
- Border: `border-border` → compiles to `border-color: hsl(var(--border))`

**INCORRECT examples**:

- `bg-[#4F46E5]` ❌ (bypasses tokens, breaks dark mode)
- `style="background-color: #1D4ED8"` ❌ (inline hex value)
- `className="bg-blue-700"` ❌ (Tailwind default blue, not our primary token)

**Why hex values are shown in tables**: For designer reference only (Figma color pickers). Code must use token names.

**Tailwind config reminder**: All tokens are mapped in `tailwind.config.ts`:

```ts
colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
    subtle: 'hsl(var(--primary-subtle))',
  },
  // etc...
}
```

### Accessibility Requirements

**CRITICAL**: Use standard HTML accessibility attributes correctly.

#### Images

- Informative images: `<img src="..." alt="Description" />` (use standard `alt`, NOT `data-alt`)
- Decorative images: `<img src="..." alt="" />`

#### Icons

- Icon-only buttons: `<button aria-label="Open notifications"><Bell className="w-5 h-5" /></button>`
- Icons with visible text: `<button>Overview <Home aria-hidden="true" /></button>`
- Standalone icons conveying meaning: `<Bell aria-label="You have 3 notifications" />`

#### Links

- Link text must describe destination: `<a href="/settings">Trip settings</a>`
- Icon-only links: `<a href="/settings" aria-label="Trip settings"><Settings /></a>`

#### Form Inputs

- All inputs need labels: `<label for="tripname">Trip name</label><input id="tripname" />`
- Or aria-label if no visible label: `<input aria-label="Search trips" />`

**DO NOT**:

- Use `data-alt` (non-standard)
- Use `title` as a replacement for `alt` (title is for tooltips)
- Omit `aria-label` on icon-only buttons
- Forget `aria-hidden="true"` on decorative icons next to text

### Color Usage Rules

- **Primary buttons and links**: ALWAYS use `--primary` (indigo)
- **Feature accent colors**:
  - `--privacy` (teal): ONLY for lock icons, "Private" badges, blind budget indicators
  - `--vote` (purple): ONLY for poll card borders, vote type badges, quorum bars
- **Semantic colors**: Use `--success`, `--warning`, `--destructive`, `--info` for status communication
- **When in doubt**: Use `--primary` for interactive elements. Feature colors are highlights, not primary CTAs.

### Requirements — Side-by-Side Budget Comparison (Desktop)
Two cards side-by-side (desktop) or stacked (mobile):

**Card 1: "Your Budget" (Private)**
- Lock icon (24px, privacy color) + "Your Budget" heading (H3)
- "Only you see this" label (small, muted, italic)
- Large amount: "$800" (30px, bold)
- "per person, total trip" (caption)
- Status indicator:
  - If within group range: success checkmark + "Within group range" (green)
  - If setting the group max: amber warning icon + "You're setting the group max" (amber, private info)
  - If above everyone: success + "Above group max" (no concern)

**Card 2: "Group Budget" (Shared)**
- Users icon (24px, muted) + "Group Budget" heading (H3)
- "Everyone sees this" label (small, muted, italic)
- Group max: "$600 per person" (30px, bold)
- Confidence: "Based on 8 of 12 members" (small, muted)
- "View affordable options" link (privacy color)

### Requirements — Group Budget Range Chart
Below the comparison cards:
- Horizontal bar chart (Glassdoor-style):
  - Bar background: muted
  - Filled range: privacy color, from 25th to 75th percentile
  - Markers: small triangles or lines at 25th percentile, median, 75th percentile
  - Labels below: "$600" (left/min), "$900 median" (center), "$1,200" (right/max)
- "Your budget" indicator: small green dot positioned on the bar (only user sees this position)
- Privacy note below chart: "Individual budgets are never revealed. This range is calculated from anonymous data." (caption, muted, with Lock icon)
- Last updated: "Updated 5 minutes ago" (caption, muted)

### Requirements — Waiting State (Not Enough Budgets)
When fewer than 3 members have submitted budgets:
- Group card shows: "Waiting for more members" with spinner
- Progress: "3 of 12 members" with progress bar (privacy color, partial fill)
- Explanation: "The group budget will appear once enough members set their budgets. Individual amounts are never revealed." (muted text)
- "Nudge members" button (outline, sends notification reminder)

### Requirements — Activity Filter Preview
At bottom of Budget tab:
- "Affordable Options" section heading
- Summary: "47 hotels within your group's budget" / "12 restaurants within budget"
- 3 preview cards showing filtered suggestions (if available)
- "Browse All Affordable Options" link button

### States
- Waiting: fewer than 3 budgets submitted (spinner, progress bar)
- Calculating: budget just changed, group max recalculating (brief spinner, 200ms)
- Ready: all data shown, chart rendered
- Your budget lower: amber indicator on "Your Budget" card (private)
- Your budget higher: green indicator on "Your Budget" card (private)
- Error: "Couldn't load group budget. Retrying..." with auto-retry

### Interactions
- Side-by-side cards: informational, not clickable (except "View affordable options")
- Range chart: tooltip on hover showing percentile value
- "Your budget" dot: tooltip "Your budget: $800" (only user sees)
- "Nudge members" → sends notification to members who haven't set budgets
- Real-time: chart and group max update with smooth animation when budgets change
- "Browse All" → navigates to filtered itinerary/search view

### Constraints
- NEVER reveal individual budget amounts (only aggregates)
- "Your Budget" card shows only to the logged-in user
- "Group Budget" card data is the same for all members
- Green dot position on range chart is PER-USER (different position for each user)
- Small groups (<5 members): show vague status only ("Most members are within a similar range") to prevent inference
- Teal color exclusively on this screen
- No horizontal scrolling
- Use only defined color tokens

---

## Prompt D13: Expense Management

### Context
TripOS is a collaborative group travel planning web app. The Expenses section lets members record trip expenses, split costs, and view settlement summaries. This is standard expense tracking (NOT blind budgeting). Uses standard primary blue color.

### Design Tokens

```css
:root {
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --card: 0 0% 100%;
  --card-foreground: 224 71% 4%;
  --muted: 220 14% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 224 76% 48%;
  --primary: 224 76% 48%;
  --primary-foreground: 210 40% 98%;
  --primary-subtle: 224 76% 95%;
  --secondary: 217 19% 27%;
  --secondary-foreground: 210 40% 98%;
  --accent: 25 95% 53%;
  --accent-foreground: 20 14% 4%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 37%;
  --privacy-foreground: 210 40% 98%;
  --privacy-subtle: 162 72% 95%;
  --vote: 262 83% 58%;
  --vote-foreground: 210 40% 98%;
  --vote-subtle: 262 83% 96%;
  --radius: 0.5rem;
}
```

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
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 42%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 45%;
  --privacy-foreground: 222 47% 11%;
  --privacy-subtle: 162 40% 15%;
  --vote: 262 83% 68%;
  --vote-foreground: 222 47% 11%;
  --vote-subtle: 262 30% 18%;
  --radius: 0.5rem;
}
```

### Typography
- Font: Inter. H2: 24px semibold. H3: 20px semibold. Body: 16px. Small: 14px. Caption: 12px

### Icon Library

**REQUIRED**: Use Lucide Icons ONLY. Reference format: `lucide:[icon-name]`

Examples:

- Home icon → `lucide:home` → `<Home className="w-5 h-5" />`
- Calendar icon → `lucide:calendar` → `<Calendar className="w-5 h-5" />`
- Vote icon → `lucide:vote` → `<Vote className="w-5 h-5" />`
- Dollar Sign icon → `lucide:dollar-sign` → `<DollarSign className="w-5 h-5" />`
- Users icon → `lucide:users` → `<Users className="w-5 h-5" />`
- Bell icon → `lucide:bell` → `<Bell className="w-5 h-5" />`
- Settings icon → `lucide:settings` → `<Settings className="w-4 h-4" />`

**DO NOT use**:

- Material Icons
- Heroicons
- Font Awesome
- Custom SVGs (unless explicitly specified)

All icons in this prompt refer to Lucide icons.

### Token Usage Rules

**CRITICAL**: Use HSL CSS custom properties via Tailwind classes. NEVER use hex values directly.

**Correct examples**:

- Background: `bg-primary` → compiles to `background-color: hsl(var(--primary))`
- Text: `text-foreground` → compiles to `color: hsl(var(--foreground))`
- Border: `border-border` → compiles to `border-color: hsl(var(--border))`

**INCORRECT examples**:

- `bg-[#4F46E5]` ❌ (bypasses tokens, breaks dark mode)
- `style="background-color: #1D4ED8"` ❌ (inline hex value)
- `className="bg-blue-700"` ❌ (Tailwind default blue, not our primary token)

**Why hex values are shown in tables**: For designer reference only (Figma color pickers). Code must use token names.

**Tailwind config reminder**: All tokens are mapped in `tailwind.config.ts`:

```ts
colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
    subtle: 'hsl(var(--primary-subtle))',
  },
  // etc...
}
```

### Accessibility Requirements

**CRITICAL**: Use standard HTML accessibility attributes correctly.

#### Images

- Informative images: `<img src="..." alt="Description" />` (use standard `alt`, NOT `data-alt`)
- Decorative images: `<img src="..." alt="" />`

#### Icons

- Icon-only buttons: `<button aria-label="Open notifications"><Bell className="w-5 h-5" /></button>`
- Icons with visible text: `<button>Overview <Home aria-hidden="true" /></button>`
- Standalone icons conveying meaning: `<Bell aria-label="You have 3 notifications" />`

#### Links

- Link text must describe destination: `<a href="/settings">Trip settings</a>`
- Icon-only links: `<a href="/settings" aria-label="Trip settings"><Settings /></a>`

#### Form Inputs

- All inputs need labels: `<label for="tripname">Trip name</label><input id="tripname" />`
- Or aria-label if no visible label: `<input aria-label="Search trips" />`

**DO NOT**:

- Use `data-alt` (non-standard)
- Use `title` as a replacement for `alt` (title is for tooltips)
- Omit `aria-label` on icon-only buttons
- Forget `aria-hidden="true"` on decorative icons next to text

### Color Usage Rules

- **Primary buttons and links**: ALWAYS use `--primary` (indigo)
- **Feature accent colors**:
  - `--privacy` (teal): ONLY for lock icons, "Private" badges, blind budget indicators
  - `--vote` (purple): ONLY for poll card borders, vote type badges, quorum bars
- **Semantic colors**: Use `--success`, `--warning`, `--destructive`, `--info` for status communication
- **When in doubt**: Use `--primary` for interactive elements. Feature colors are highlights, not primary CTAs.

### Requirements — Expense List
- Header: "Expenses" (H2) + trip total ("$2,450 total") + "Add Expense" primary button
- Category filter: Horizontal scrollable pills — All, Food, Activity, Transport, Accommodation, Other
- Expense cards in list:
  - Description (16px medium) + amount (16px bold, right-aligned)
  - Category badge + payer name + date (14px, muted)
  - Split info: "Split 4 ways" or "Paid by Jordan" (14px, muted)
  - Linked activity badge (if connected to itinerary item)

### Requirements — Add Expense Modal
- "Add Expense" heading
- Amount input: large, currency prefix, numeric keyboard on mobile
- Description: text input (required)
- Category: pill selector (Food, Activity, Transport, Accommodation, Other)
- Paid by: dropdown (member list)
- Split: "Split equally" (default) or "Custom split" toggle
  - Custom: shows member list with amount input per person
- Currency: dropdown (USD default, multi-currency support)
- Link to activity: optional dropdown
- "Save Expense" primary button

### Requirements — Settlement Summary Card
Compact card at top of expenses page:
- "Who Owes Whom" heading (H3)
- Settlement rows: "[Name] owes [Name] $45" with arrow icon
- "Settle Up" action buttons per row (links to payment apps or marks as paid)
- Net balance per person: "+$120" (green) or "-$45" (destructive)

### States
- Empty: "No expenses yet. Add your first expense to start tracking."
- Loading: skeleton list
- Adding: modal with validation
- Multi-currency: conversion rate shown inline ("EUR45 = $49 USD")

### Interactions
- Click expense → expand details / edit modal
- Swipe left (mobile) → delete with confirmation
- Category filter → client-side filter
- "Settle Up" → mark as paid or open payment app link

### Constraints
- Expenses are public to all trip members (NOT private like budgets)
- Multi-currency: show converted amount alongside original
- Maximum 500 expenses per trip
- Touch targets 44px minimum
- No horizontal scrolling
- Use only defined color tokens

---

## Prompt D14: Activity Feed & Notifications

### Context
TripOS is a collaborative group travel planning web app. The Activity Feed shows a real-time timeline of all actions taken on a trip. The Notification Center collects alerts for the user across all trips. Both update in real-time via WebSocket.

### Design Tokens

```css
:root {
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --card: 0 0% 100%;
  --card-foreground: 224 71% 4%;
  --muted: 220 14% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 224 76% 48%;
  --primary: 224 76% 48%;
  --primary-foreground: 210 40% 98%;
  --primary-subtle: 224 76% 95%;
  --secondary: 217 19% 27%;
  --secondary-foreground: 210 40% 98%;
  --accent: 25 95% 53%;
  --accent-foreground: 20 14% 4%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 37%;
  --privacy-foreground: 210 40% 98%;
  --privacy-subtle: 162 72% 95%;
  --vote: 262 83% 58%;
  --vote-foreground: 210 40% 98%;
  --vote-subtle: 262 83% 96%;
  --radius: 0.5rem;
}
```

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
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 42%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 45%;
  --privacy-foreground: 222 47% 11%;
  --privacy-subtle: 162 40% 15%;
  --vote: 262 83% 68%;
  --vote-foreground: 222 47% 11%;
  --vote-subtle: 262 30% 18%;
  --radius: 0.5rem;
}
```

### Typography
- Font: Inter. H2: 24px semibold. Body: 16px. Small: 14px. Caption: 12px

### Icon Library

**REQUIRED**: Use Lucide Icons ONLY. Reference format: `lucide:[icon-name]`

Examples:

- Home icon → `lucide:home` → `<Home className="w-5 h-5" />`
- Calendar icon → `lucide:calendar` → `<Calendar className="w-5 h-5" />`
- Vote icon → `lucide:vote` → `<Vote className="w-5 h-5" />`
- Dollar Sign icon → `lucide:dollar-sign` → `<DollarSign className="w-5 h-5" />`
- Users icon → `lucide:users` → `<Users className="w-5 h-5" />`
- Bell icon → `lucide:bell` → `<Bell className="w-5 h-5" />`
- Settings icon → `lucide:settings` → `<Settings className="w-4 h-4" />`

**DO NOT use**:

- Material Icons
- Heroicons
- Font Awesome
- Custom SVGs (unless explicitly specified)

All icons in this prompt refer to Lucide icons.

### Token Usage Rules

**CRITICAL**: Use HSL CSS custom properties via Tailwind classes. NEVER use hex values directly.

**Correct examples**:

- Background: `bg-primary` → compiles to `background-color: hsl(var(--primary))`
- Text: `text-foreground` → compiles to `color: hsl(var(--foreground))`
- Border: `border-border` → compiles to `border-color: hsl(var(--border))`

**INCORRECT examples**:

- `bg-[#4F46E5]` ❌ (bypasses tokens, breaks dark mode)
- `style="background-color: #1D4ED8"` ❌ (inline hex value)
- `className="bg-blue-700"` ❌ (Tailwind default blue, not our primary token)

**Why hex values are shown in tables**: For designer reference only (Figma color pickers). Code must use token names.

**Tailwind config reminder**: All tokens are mapped in `tailwind.config.ts`:

```ts
colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
    subtle: 'hsl(var(--primary-subtle))',
  },
  // etc...
}
```

### Accessibility Requirements

**CRITICAL**: Use standard HTML accessibility attributes correctly.

#### Images

- Informative images: `<img src="..." alt="Description" />` (use standard `alt`, NOT `data-alt`)
- Decorative images: `<img src="..." alt="" />`

#### Icons

- Icon-only buttons: `<button aria-label="Open notifications"><Bell className="w-5 h-5" /></button>`
- Icons with visible text: `<button>Overview <Home aria-hidden="true" /></button>`
- Standalone icons conveying meaning: `<Bell aria-label="You have 3 notifications" />`

#### Links

- Link text must describe destination: `<a href="/settings">Trip settings</a>`
- Icon-only links: `<a href="/settings" aria-label="Trip settings"><Settings /></a>`

#### Form Inputs

- All inputs need labels: `<label for="tripname">Trip name</label><input id="tripname" />`
- Or aria-label if no visible label: `<input aria-label="Search trips" />`

**DO NOT**:

- Use `data-alt` (non-standard)
- Use `title` as a replacement for `alt` (title is for tooltips)
- Omit `aria-label` on icon-only buttons
- Forget `aria-hidden="true"` on decorative icons next to text

### Color Usage Rules

- **Primary buttons and links**: ALWAYS use `--primary` (indigo)
- **Feature accent colors**:
  - `--privacy` (teal): ONLY for lock icons, "Private" badges, blind budget indicators
  - `--vote` (purple): ONLY for poll card borders, vote type badges, quorum bars
- **Semantic colors**: Use `--success`, `--warning`, `--destructive`, `--info` for status communication
- **When in doubt**: Use `--primary` for interactive elements. Feature colors are highlights, not primary CTAs.

### Requirements — Activity Feed (Trip-Level)
- Full-width single-column list within trip workspace
- Grouped by day: "Today", "Yesterday", "Feb 7, 2026" headers
- Each feed item:
  - Avatar (32px) left-aligned
  - Action text: **[Name]** [verb] [object] — 16px, name is bold
  - Timestamp: relative ("2h ago", "just now") — 12px, muted, right-aligned
  - Contextual icon: Vote icon (purple) for polls, MapPin for activities, Lock (teal) for budget actions, Users for member changes
- **Privacy rule**: Budget actions show only "set their private budget" — NEVER the amount
- **Vote actions**: "voted on [Poll Name]" — never what they voted for (if anonymous)
- Items sorted newest-first, load 20 at a time, "Load more" button

### Requirements — Notification Center
Accessed via bell icon in top navigation:
- Desktop: Dropdown panel (max-w-sm, 384px), anchored to bell icon
- Mobile: Full-screen sheet sliding up from bottom
- Unread count badge on bell icon (red circle with white number)
- Notification items:
  - Icon (contextual: Vote, Clock, Users, DollarSign, Bell) + text + timestamp
  - Unread: white background, bold text
  - Read: muted background
  - Types:
    - "New poll: [Question]" — Vote icon, purple
    - "Deadline approaching: [Poll] closes in 4 hours" — Clock icon, amber
    - "[Name] joined [Trip Name]" — Users icon
    - "Group budget updated" — Lock icon, teal
    - "You were assigned: [Task]" — Bell icon
  - Click notification → navigate to relevant item
  - "Mark all as read" link at top
- Empty state: "You're all caught up!" with checkmark

### Requirements — Toast Notifications (In-App)
- Position: bottom-center (mobile), bottom-right (desktop)
- Slide up + fade in animation (300ms)
- Auto-dismiss: 4 seconds (info), 6 seconds (warning/error)
- Variants:
  - Success: green left border, Check icon ("Vote submitted!")
  - Error: red left border, AlertTriangle icon ("Couldn't save. Try again.")
  - Info: blue left border, Info icon ("Jordan added a new activity")
  - Warning: amber left border, Clock icon ("Poll closing in 1 hour")
- Dismiss: click X button or swipe right (mobile)
- Stack: max 3 visible, older ones collapse up

### States
- Feed: loading (skeleton items), populated, empty ("No activity yet")
- Notifications: loading, populated, empty ("all caught up"), unread (badge count)
- Real-time: new items slide in at top with fade (300ms), bell badge increments
- Toasts: appear, auto-dismiss, manual dismiss

### Interactions
- Feed items: click object → navigate to poll/activity/member
- Notifications: click → navigate + mark as read
- Toast: click → navigate, X → dismiss, auto-dismiss after timeout
- Bell icon: click toggles notification panel
- "Mark all read": clears unread state + badge

### Constraints
- Activity feed never shows private budget amounts
- Anonymous votes never show what was voted for in feed
- Max 100 notifications retained (older auto-archive)
- Toast stack max 3 (older dismissed when 4th arrives)
- Real-time updates don't cause scroll jumps (new items added above viewport if scrolled down)
- No horizontal scrolling
- Use only defined color tokens

---

## Prompt D15: Marketing — Landing Page

### Context
TripOS is a collaborative group travel planning web app with two unique features: blind budgeting (private budget caps) and structured voting (democratic decision-making). This is the public landing page that converts visitors to signups. It must communicate the core value proposition quickly and build trust.

### Design Tokens

```css
:root {
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --card: 0 0% 100%;
  --card-foreground: 224 71% 4%;
  --muted: 220 14% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 224 76% 48%;
  --primary: 224 76% 48%;
  --primary-foreground: 210 40% 98%;
  --primary-subtle: 224 76% 95%;
  --secondary: 217 19% 27%;
  --secondary-foreground: 210 40% 98%;
  --accent: 25 95% 53%;
  --accent-foreground: 20 14% 4%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 37%;
  --privacy-foreground: 210 40% 98%;
  --privacy-subtle: 162 72% 95%;
  --vote: 262 83% 58%;
  --vote-foreground: 210 40% 98%;
  --vote-subtle: 262 83% 96%;
  --radius: 0.5rem;
}
```

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
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 42%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 45%;
  --privacy-foreground: 222 47% 11%;
  --privacy-subtle: 162 40% 15%;
  --vote: 262 83% 68%;
  --vote-foreground: 222 47% 11%;
  --vote-subtle: 262 30% 18%;
  --radius: 0.5rem;
}
```

### Typography
- Font: Inter. Display: 36px/40px bold. H1: 30px bold. H2: 24px semibold. Body: 16px. Small: 14px

### Icon Library

**REQUIRED**: Use Lucide Icons ONLY. Reference format: `lucide:[icon-name]`

Examples:

- Home icon → `lucide:home` → `<Home className="w-5 h-5" />`
- Calendar icon → `lucide:calendar` → `<Calendar className="w-5 h-5" />`
- Vote icon → `lucide:vote` → `<Vote className="w-5 h-5" />`
- Dollar Sign icon → `lucide:dollar-sign` → `<DollarSign className="w-5 h-5" />`
- Users icon → `lucide:users` → `<Users className="w-5 h-5" />`
- Bell icon → `lucide:bell` → `<Bell className="w-5 h-5" />`
- Settings icon → `lucide:settings` → `<Settings className="w-4 h-4" />`

**DO NOT use**:

- Material Icons
- Heroicons
- Font Awesome
- Custom SVGs (unless explicitly specified)

All icons in this prompt refer to Lucide icons.

### Token Usage Rules

**CRITICAL**: Use HSL CSS custom properties via Tailwind classes. NEVER use hex values directly.

**Correct examples**:

- Background: `bg-primary` → compiles to `background-color: hsl(var(--primary))`
- Text: `text-foreground` → compiles to `color: hsl(var(--foreground))`
- Border: `border-border` → compiles to `border-color: hsl(var(--border))`

**INCORRECT examples**:

- `bg-[#4F46E5]` ❌ (bypasses tokens, breaks dark mode)
- `style="background-color: #1D4ED8"` ❌ (inline hex value)
- `className="bg-blue-700"` ❌ (Tailwind default blue, not our primary token)

**Why hex values are shown in tables**: For designer reference only (Figma color pickers). Code must use token names.

**Tailwind config reminder**: All tokens are mapped in `tailwind.config.ts`:

```ts
colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
    subtle: 'hsl(var(--primary-subtle))',
  },
  // etc...
}
```

### Accessibility Requirements

**CRITICAL**: Use standard HTML accessibility attributes correctly.

#### Images

- Informative images: `<img src="..." alt="Description" />` (use standard `alt`, NOT `data-alt`)
- Decorative images: `<img src="..." alt="" />`

#### Icons

- Icon-only buttons: `<button aria-label="Open notifications"><Bell className="w-5 h-5" /></button>`
- Icons with visible text: `<button>Overview <Home aria-hidden="true" /></button>`
- Standalone icons conveying meaning: `<Bell aria-label="You have 3 notifications" />`

#### Links

- Link text must describe destination: `<a href="/settings">Trip settings</a>`
- Icon-only links: `<a href="/settings" aria-label="Trip settings"><Settings /></a>`

#### Form Inputs

- All inputs need labels: `<label for="tripname">Trip name</label><input id="tripname" />`
- Or aria-label if no visible label: `<input aria-label="Search trips" />`

**DO NOT**:

- Use `data-alt` (non-standard)
- Use `title` as a replacement for `alt` (title is for tooltips)
- Omit `aria-label` on icon-only buttons
- Forget `aria-hidden="true"` on decorative icons next to text

### Color Usage Rules

- **Primary buttons and links**: ALWAYS use `--primary` (indigo)
- **Feature accent colors**:
  - `--privacy` (teal): ONLY for lock icons, "Private" badges, blind budget indicators
  - `--vote` (purple): ONLY for poll card borders, vote type badges, quorum bars
- **Semantic colors**: Use `--success`, `--warning`, `--destructive`, `--info` for status communication
- **When in doubt**: Use `--primary` for interactive elements. Feature colors are highlights, not primary CTAs.

### Requirements — Hero Section
- Full-width, solid muted background
- Navigation: TripOS logo (left) + "Features" "Pricing" links + "Sign In" ghost button + "Get Started" primary button
- Headline (Display): "Plan Group Trips Without the Awkwardness"
- Subheadline (Body, muted): "Private budgets. Democratic voting. Real-time collaboration. TripOS brings structure to group travel — so your friends stay friends."
- CTA buttons: "Start Planning — It's Free" primary large button + "See How It Works" outline button
- Social proof line (below CTAs, small): "Backed by research: 50%+ of travelers have money conflicts in group trips"

### Requirements — Problem Section
- Heading: "Group Travel Planning Is Broken" (H2, centered)
- Three problem cards in a row (1 column mobile):
  - Card 1: DollarSign icon + "Budget Shame" + "50% of travelers argue about money. 1 in 5 end friendships over it."
  - Card 2: MessageSquare icon + "Decision Paralysis" + "73 messages, zero decisions. Endless group chat debates."
  - Card 3: User icon + "Organizer Burnout" + "One person does all the work. Everyone else says 'whatever you think.'"

### Requirements — Solution Section (3 Features)
- Heading: "TripOS Fixes Group Travel" (H2, centered)

**Feature 1 — Blind Budgeting** (privacy-subtle bg card):
- Lock icon (large, teal)
- "Blind Budgeting" heading (H3)
- "Set your budget privately. See what your group can afford together. No one knows your number."
- 3-step visual:
  1. Lock icon + "Set your private max"
  2. Calculator icon + "We find the group's limit"
  3. Check icon + "Everyone sees affordable options"
- "Your budget stays private forever" (caption, teal, Lock icon)

**Feature 2 — Structured Voting** (vote-subtle bg card):
- Vote icon (large, purple)
- "Democratic Voting" heading (H3)
- "Polls with deadlines, quorum, and ranked choice. Make decisions, not debates."
- Visual: example poll card with options, progress bar, deadline

**Feature 3 — Real-Time Collaboration** (primary-subtle bg card):
- Users icon (large, primary)
- "Plan Together" heading (H3)
- "Invite friends, build itineraries, see updates instantly. No more lost spreadsheets."

### Requirements — Trust Section
- Heading: "Backed by Research" (H2)
- Stats row: "50%+ money conflicts" | "1 in 5 friendships lost" | "9,110-person study validates our approach"
- Expert quote: "Financial experts recommend anonymous budget surveys for group travel." — Fodor's, NerdWallet
- "Peer-reviewed research proves financial transparency can backfire. Blind budgeting removes shame."

### Requirements — CTA Section
- Heading: "Ready to Plan Without the Drama?" (H2)
- "Create Your Free Trip" primary large button
- "No credit card required. Free for core features." (small, muted)

### Requirements — Footer
- TripOS logo + tagline
- Links: Features, Pricing, Blog, About, Privacy Policy, Terms
- "Made for groups who want to stay friends" (small, muted)

### States
- Page loads with SSR (static content, instant)
- CTA buttons: hover (opacity-90), click (scale feedback)
- Mobile: all sections single-column, hero condensed

### Interactions
- "Get Started" / CTA → navigate to sign up
- "See How It Works" → smooth scroll to solution section
- Navigation links → route to pages

### Mobile Web Breakpoint
Marketing pages must be responsive for mobile visitors arriving via shared links:
- Single-column layout for all sections
- Stacked cards (problem cards, feature cards) instead of multi-column grid
- Condensed hero: smaller headline (H1 instead of Display), left-aligned text
- Touch-optimized CTAs: minimum 44px height, full-width on mobile
- Hamburger menu replaces horizontal nav links (logo + hamburger icon in top bar)
- Footer links stack in 2-column grid
- Images/screenshots scale to full-width with maintained aspect ratio

### Constraints
- Fully server-rendered (Next.js SSR) for SEO
- LCP < 2.5 seconds
- No JavaScript required for content visibility
- Semantic HTML: proper heading hierarchy, landmarks, alt text
- Mobile-first layout: hero text left-aligned on mobile, centered on desktop
- No horizontal scrolling
- Use only defined color tokens

---

## Prompt D16: States & Feedback — Empty, Loading, Error, Confirmation

### Context
TripOS is a collaborative group travel planning web app. This prompt defines all global state patterns used across the application: empty states, loading skeletons, error handling, and confirmation feedback. These patterns ensure a consistent experience across all features.

### Design Tokens

```css
:root {
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --card: 0 0% 100%;
  --card-foreground: 224 71% 4%;
  --muted: 220 14% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 224 76% 48%;
  --primary: 224 76% 48%;
  --primary-foreground: 210 40% 98%;
  --primary-subtle: 224 76% 95%;
  --secondary: 217 19% 27%;
  --secondary-foreground: 210 40% 98%;
  --accent: 25 95% 53%;
  --accent-foreground: 20 14% 4%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 37%;
  --privacy-foreground: 210 40% 98%;
  --privacy-subtle: 162 72% 95%;
  --vote: 262 83% 58%;
  --vote-foreground: 210 40% 98%;
  --vote-subtle: 262 83% 96%;
  --radius: 0.5rem;
}
```

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
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 42%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 45%;
  --privacy-foreground: 222 47% 11%;
  --privacy-subtle: 162 40% 15%;
  --vote: 262 83% 68%;
  --vote-foreground: 222 47% 11%;
  --vote-subtle: 262 30% 18%;
  --radius: 0.5rem;
}
```

### Typography
- Font: Inter. H2: 24px semibold. H3: 20px semibold. Body: 16px. Small: 14px. Caption: 12px

### Icon Library

**REQUIRED**: Use Lucide Icons ONLY. Reference format: `lucide:[icon-name]`

Examples:

- Home icon → `lucide:home` → `<Home className="w-5 h-5" />`
- Calendar icon → `lucide:calendar` → `<Calendar className="w-5 h-5" />`
- Vote icon → `lucide:vote` → `<Vote className="w-5 h-5" />`
- Dollar Sign icon → `lucide:dollar-sign` → `<DollarSign className="w-5 h-5" />`
- Users icon → `lucide:users` → `<Users className="w-5 h-5" />`
- Bell icon → `lucide:bell` → `<Bell className="w-5 h-5" />`
- Settings icon → `lucide:settings` → `<Settings className="w-4 h-4" />`

**DO NOT use**:

- Material Icons
- Heroicons
- Font Awesome
- Custom SVGs (unless explicitly specified)

All icons in this prompt refer to Lucide icons.

### Token Usage Rules

**CRITICAL**: Use HSL CSS custom properties via Tailwind classes. NEVER use hex values directly.

**Correct examples**:

- Background: `bg-primary` → compiles to `background-color: hsl(var(--primary))`
- Text: `text-foreground` → compiles to `color: hsl(var(--foreground))`
- Border: `border-border` → compiles to `border-color: hsl(var(--border))`

**INCORRECT examples**:

- `bg-[#4F46E5]` ❌ (bypasses tokens, breaks dark mode)
- `style="background-color: #1D4ED8"` ❌ (inline hex value)
- `className="bg-blue-700"` ❌ (Tailwind default blue, not our primary token)

**Why hex values are shown in tables**: For designer reference only (Figma color pickers). Code must use token names.

**Tailwind config reminder**: All tokens are mapped in `tailwind.config.ts`:

```ts
colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
    subtle: 'hsl(var(--primary-subtle))',
  },
  // etc...
}
```

### Accessibility Requirements

**CRITICAL**: Use standard HTML accessibility attributes correctly.

#### Images

- Informative images: `<img src="..." alt="Description" />` (use standard `alt`, NOT `data-alt`)
- Decorative images: `<img src="..." alt="" />`

#### Icons

- Icon-only buttons: `<button aria-label="Open notifications"><Bell className="w-5 h-5" /></button>`
- Icons with visible text: `<button>Overview <Home aria-hidden="true" /></button>`
- Standalone icons conveying meaning: `<Bell aria-label="You have 3 notifications" />`

#### Links

- Link text must describe destination: `<a href="/settings">Trip settings</a>`
- Icon-only links: `<a href="/settings" aria-label="Trip settings"><Settings /></a>`

#### Form Inputs

- All inputs need labels: `<label for="tripname">Trip name</label><input id="tripname" />`
- Or aria-label if no visible label: `<input aria-label="Search trips" />`

**DO NOT**:

- Use `data-alt` (non-standard)
- Use `title` as a replacement for `alt` (title is for tooltips)
- Omit `aria-label` on icon-only buttons
- Forget `aria-hidden="true"` on decorative icons next to text

### Color Usage Rules

- **Primary buttons and links**: ALWAYS use `--primary` (indigo)
- **Feature accent colors**:
  - `--privacy` (teal): ONLY for lock icons, "Private" badges, blind budget indicators
  - `--vote` (purple): ONLY for poll card borders, vote type badges, quorum bars
- **Semantic colors**: Use `--success`, `--warning`, `--destructive`, `--info` for status communication
- **When in doubt**: Use `--primary` for interactive elements. Feature colors are highlights, not primary CTAs.

### Requirements — Empty States
Every major section has an educational empty state. Format:
- Icon or illustration (48px, muted color, centered)
- Heading (H3): what's missing
- Description (Body, muted): what to do next — always actionable
- CTA button: primary action to fill the empty state

| Section | Icon | Heading | Description | CTA |
|---------|------|---------|-------------|-----|
| Trips | MapPin | "No trips yet" | "Create your first trip and invite friends to start planning." | "Create Trip" |
| Itinerary | Calendar | "No activities yet" | "Add your first activity to start building the itinerary." | "Add Activity" |
| Polls | Vote (purple) | "No polls yet" | "Create a poll to start making group decisions." | "Create Poll" |
| Budget | Lock (teal) | "Budget not set" | "Set your private budget to help the group plan affordably." | "Set Budget" |
| Expenses | DollarSign | "No expenses yet" | "Record your first expense to start tracking costs." | "Add Expense" |
| Members | Users | "Just you so far" | "Invite friends to start planning together." | "Invite Members" |
| Activity Feed | Clock | "No activity yet" | "Actions like creating polls, adding activities, and voting will appear here." | — |
| Notifications | Bell | "All caught up!" | "You'll see notifications for polls, deadlines, and trip updates here." | — |

### Requirements — Loading Skeletons
- Replace real content with pulsing gray rectangles matching content shape
- Pulse animation: opacity oscillates between 40% and 100% on muted background (1.5s loop)
- Skeleton shapes:
  - **Card**: rounded-xl rectangle with internal rows for title (60% width), subtitle (40%), body (80%)
  - **Avatar**: rounded-full circle (same size as real avatar)
  - **List item**: avatar circle + two text rows (100% then 60% width)
  - **Chart bar**: full-width rectangle, 24px height
  - **Button**: rounded-lg rectangle matching button dimensions
- Show 3 skeleton items for lists, 1 skeleton for single cards
- Transition from skeleton to real content: 200ms fade

### Requirements — Error States
Three error levels:

**Inline Error** (form fields):
- Red border on input field
- Error text below: destructive color, 14px, AlertTriangle icon (12px) inline
- Example: "Budget must be at least $1"

**Section Error** (content failed to load):
- Within card/section area (replaces content)
- AlertTriangle icon (32px, destructive)
- "Couldn't load [section name]" heading (H3)
- "Check your connection and try again." body text (muted)
- "Try Again" primary button

**Page Error** (full page failure):
- Centered in main content area
- Large AlertTriangle icon (64px, destructive)
- "Something went wrong on our end" heading (H2)
- "We're having trouble loading this page. Try refreshing." body text
- "Refresh Page" primary button + "Go to Dashboard" secondary button

### Requirements — Confirmation Feedback
After successful actions:

**Toast notifications** (already defined in Prompt D14):
- Success: green left border, Check icon, "Budget saved!" / "Vote submitted!" / "Activity added!"
- Auto-dismiss 4 seconds

**Inline confirmations**:
- Checkmark animation: circle draws (200ms) → check draws (150ms) → text fades in (150ms)
- Green success color
- Used for: budget save, vote submission, profile update

**Action confirmations** (before destructive actions):
- Dialog modal: heading names the consequence (e.g., "Delete this activity?", "Remove [member name]?", "Delete this poll?", "Leave this trip?")
- Description of what will happen
- "Cancel" secondary button + "Delete" destructive button (label matches the action)
- Used for: delete activity, remove member, delete poll, leave trip

### Requirements — Offline State
- Banner at top of viewport: amber background, "You're offline. Changes will sync when reconnected." + wifi-off icon
- Content remains visible but greyed (70% opacity)
- Actions queue locally and sync on reconnect
- When reconnected: green banner briefly shows "Back online. Syncing..." then disappears

### States (Meta)
- All states transition smoothly (200ms)
- Skeleton → content: fade crossover (200ms)
- Empty → populated: first item fades in (300ms)
- Error → retry → loading → content: sequential transitions

### Constraints
- Empty states always suggest an action (never just "Nothing here")
- Loading skeletons match exact layout of real content (no layout shift, CLS < 0.1)
- Error retry buttons always visible (never require scroll)
- Offline mode: never block reading, only block writing
- Touch targets 44px minimum on all action buttons
- Use only defined color tokens

---

## Prompt D17: Profile & Settings

### Context
TripOS is a collaborative group travel planning web app. Profile & Settings lets users manage their personal information, notification preferences, and account settings. Accessible from the user avatar dropdown in the top navigation bar. Desktop shows a settings sidebar; mobile shows stacked sections.

### Design Tokens

```css
:root {
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --card: 0 0% 100%;
  --card-foreground: 224 71% 4%;
  --muted: 220 14% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 224 76% 48%;
  --primary: 224 76% 48%;
  --primary-foreground: 210 40% 98%;
  --primary-subtle: 224 76% 95%;
  --secondary: 217 19% 27%;
  --secondary-foreground: 210 40% 98%;
  --accent: 25 95% 53%;
  --accent-foreground: 20 14% 4%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 37%;
  --privacy-foreground: 210 40% 98%;
  --privacy-subtle: 162 72% 95%;
  --vote: 262 83% 58%;
  --vote-foreground: 210 40% 98%;
  --vote-subtle: 262 83% 96%;
  --radius: 0.5rem;
}
```

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
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 42%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 45%;
  --privacy-foreground: 222 47% 11%;
  --privacy-subtle: 162 40% 15%;
  --vote: 262 83% 68%;
  --vote-foreground: 222 47% 11%;
  --vote-subtle: 262 30% 18%;
  --radius: 0.5rem;
}
```

### Typography
- Font: Inter. H2: 24px semibold. H3: 20px semibold. Body: 16px. Small: 14px. Caption: 12px

### Icon Library

**REQUIRED**: Use Lucide Icons ONLY. Reference format: `lucide:[icon-name]`

Examples:

- Home icon → `lucide:home` → `<Home className="w-5 h-5" />`
- Calendar icon → `lucide:calendar` → `<Calendar className="w-5 h-5" />`
- Vote icon → `lucide:vote` → `<Vote className="w-5 h-5" />`
- Dollar Sign icon → `lucide:dollar-sign` → `<DollarSign className="w-5 h-5" />`
- Users icon → `lucide:users` → `<Users className="w-5 h-5" />`
- Bell icon → `lucide:bell` → `<Bell className="w-5 h-5" />`
- Settings icon → `lucide:settings` → `<Settings className="w-4 h-4" />`

**DO NOT use**:

- Material Icons
- Heroicons
- Font Awesome
- Custom SVGs (unless explicitly specified)

All icons in this prompt refer to Lucide icons.

### Token Usage Rules

**CRITICAL**: Use HSL CSS custom properties via Tailwind classes. NEVER use hex values directly.

**Correct examples**:

- Background: `bg-primary` → compiles to `background-color: hsl(var(--primary))`
- Text: `text-foreground` → compiles to `color: hsl(var(--foreground))`
- Border: `border-border` → compiles to `border-color: hsl(var(--border))`

**INCORRECT examples**:

- `bg-[#4F46E5]` ❌ (bypasses tokens, breaks dark mode)
- `style="background-color: #1D4ED8"` ❌ (inline hex value)
- `className="bg-blue-700"` ❌ (Tailwind default blue, not our primary token)

**Why hex values are shown in tables**: For designer reference only (Figma color pickers). Code must use token names.

**Tailwind config reminder**: All tokens are mapped in `tailwind.config.ts`:

```ts
colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
    subtle: 'hsl(var(--primary-subtle))',
  },
  // etc...
}
```

### Accessibility Requirements

**CRITICAL**: Use standard HTML accessibility attributes correctly.

#### Images

- Informative images: `<img src="..." alt="Description" />` (use standard `alt`, NOT `data-alt`)
- Decorative images: `<img src="..." alt="" />`

#### Icons

- Icon-only buttons: `<button aria-label="Open notifications"><Bell className="w-5 h-5" /></button>`
- Icons with visible text: `<button>Overview <Home aria-hidden="true" /></button>`
- Standalone icons conveying meaning: `<Bell aria-label="You have 3 notifications" />`

#### Links

- Link text must describe destination: `<a href="/settings">Trip settings</a>`
- Icon-only links: `<a href="/settings" aria-label="Trip settings"><Settings /></a>`

#### Form Inputs

- All inputs need labels: `<label for="tripname">Trip name</label><input id="tripname" />`
- Or aria-label if no visible label: `<input aria-label="Search trips" />`

**DO NOT**:

- Use `data-alt` (non-standard)
- Use `title` as a replacement for `alt` (title is for tooltips)
- Omit `aria-label` on icon-only buttons
- Forget `aria-hidden="true"` on decorative icons next to text

### Color Usage Rules

- **Primary buttons and links**: ALWAYS use `--primary` (indigo)
- **Feature accent colors**:
  - `--privacy` (teal): ONLY for lock icons, "Private" badges, blind budget indicators
  - `--vote` (purple): ONLY for poll card borders, vote type badges, quorum bars
- **Semantic colors**: Use `--success`, `--warning`, `--destructive`, `--info` for status communication
- **When in doubt**: Use `--primary` for interactive elements. Feature colors are highlights, not primary CTAs.

### Requirements — Layout
- **Desktop**: Two-column layout. Left: vertical nav list (200px) — Profile, Notifications, Account. Right: active section content (max-w-xl). Active nav item: primary text + left border accent
- **Mobile**: Full-width stacked sections with H2 section headers and dividers between

### Requirements — Profile Section
- **Avatar**: 96px round image with camera icon overlay on hover → file picker. Placeholder: initials on primary-subtle bg
- **Display name**: text input (required)
- **Email**: read-only display (muted text) with "Verified" green badge or "Verify" link
- **Timezone**: dropdown (auto-detected on signup, editable)
- "Save Changes" primary button — disabled until changes detected, loading spinner on save, checkmark flash on success

### Requirements — Notification Preferences
- Section heading: "Notifications" (H3)
- **Global toggles** (Switch components, full-width rows with label left + switch right):
  - Email notifications (on/off)
  - Push notifications (on/off)
- **Per-category toggles** (indented under global, each a Switch row):
  - "Poll created or closing soon"
  - "Someone voted on a poll"
  - "New member joined trip"
  - "Activity added or changed"
  - "Expense added"
  - "Budget reminders"
- Muted helper text (12px) below each toggle describing what it controls
- Disabled state: if global toggle is OFF, per-category toggles are muted and non-interactive

### Requirements — Account Management
- Section heading: "Account" (H3)
- **Connected accounts**: Row per provider (Google, Apple) showing status: "Connected" (green badge) with "Disconnect" ghost button, or "Not connected" with "Connect" outline button
- **Change password** (if email-based signup): current password + new password + confirm new password inputs + "Update Password" primary button
- **Danger zone** (bottom, separated by destructive-colored top border):
  - "Delete Account" destructive button → confirmation dialog: "This will permanently delete your account and remove you from all trips. This action cannot be undone." + "Type DELETE to confirm" input + "Delete My Account" destructive button + "Cancel" secondary

### States
- Save button: disabled (no changes) → enabled (changes detected) → loading (saving) → success (checkmark 1s) → disabled
- Avatar upload: default → hover overlay → uploading (spinner) → success (new image)
- Delete: button → dialog → typing confirmation → enabled destructive button
- Unsaved changes: browser-level "Leave page?" warning if navigating away with pending changes

### Interactions
- Settings nav highlights active section (desktop)
- Scroll to section on nav click (mobile)
- Avatar click → native file picker (accept images, max 5MB)
- Toggle switches: immediate save (no save button needed for toggles)

### Constraints
- All form inputs 44px minimum height
- Avatar: max 5MB, JPEG/PNG/WebP only
- No horizontal scrolling
- Use only defined color tokens

---

## Prompt D18: Marketing — Features Page

### Context
TripOS is a collaborative group travel planning web app with two unique features: blind budgeting and structured voting. The Features page provides detailed breakdowns of each major feature with visuals, expanding on the landing page overview. Goal: convince visitors that TripOS solves their specific group travel pain points. Public page — no authentication required.

### Design Tokens

```css
:root {
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --card: 0 0% 100%;
  --card-foreground: 224 71% 4%;
  --muted: 220 14% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 224 76% 48%;
  --primary: 224 76% 48%;
  --primary-foreground: 210 40% 98%;
  --primary-subtle: 224 76% 95%;
  --secondary: 217 19% 27%;
  --secondary-foreground: 210 40% 98%;
  --accent: 25 95% 53%;
  --accent-foreground: 20 14% 4%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 37%;
  --privacy-foreground: 210 40% 98%;
  --privacy-subtle: 162 72% 95%;
  --vote: 262 83% 58%;
  --vote-foreground: 210 40% 98%;
  --vote-subtle: 262 83% 96%;
  --radius: 0.5rem;
}
```

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
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 42%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 45%;
  --privacy-foreground: 222 47% 11%;
  --privacy-subtle: 162 40% 15%;
  --vote: 262 83% 68%;
  --vote-foreground: 222 47% 11%;
  --vote-subtle: 262 30% 18%;
  --radius: 0.5rem;
}
```

### Typography
- Font: Inter. Display: 36px/40px bold. H1: 30px bold. H2: 24px semibold. H3: 20px semibold. Body: 16px. Small: 14px

### Icon Library

**REQUIRED**: Use Lucide Icons ONLY. Reference format: `lucide:[icon-name]`

Examples:

- Home icon → `lucide:home` → `<Home className="w-5 h-5" />`
- Calendar icon → `lucide:calendar` → `<Calendar className="w-5 h-5" />`
- Vote icon → `lucide:vote` → `<Vote className="w-5 h-5" />`
- Dollar Sign icon → `lucide:dollar-sign` → `<DollarSign className="w-5 h-5" />`
- Users icon → `lucide:users` → `<Users className="w-5 h-5" />`
- Bell icon → `lucide:bell` → `<Bell className="w-5 h-5" />`
- Settings icon → `lucide:settings` → `<Settings className="w-4 h-4" />`

**DO NOT use**:

- Material Icons
- Heroicons
- Font Awesome
- Custom SVGs (unless explicitly specified)

All icons in this prompt refer to Lucide icons.

### Token Usage Rules

**CRITICAL**: Use HSL CSS custom properties via Tailwind classes. NEVER use hex values directly.

**Correct examples**:

- Background: `bg-primary` → compiles to `background-color: hsl(var(--primary))`
- Text: `text-foreground` → compiles to `color: hsl(var(--foreground))`
- Border: `border-border` → compiles to `border-color: hsl(var(--border))`

**INCORRECT examples**:

- `bg-[#4F46E5]` ❌ (bypasses tokens, breaks dark mode)
- `style="background-color: #1D4ED8"` ❌ (inline hex value)
- `className="bg-blue-700"` ❌ (Tailwind default blue, not our primary token)

**Why hex values are shown in tables**: For designer reference only (Figma color pickers). Code must use token names.

**Tailwind config reminder**: All tokens are mapped in `tailwind.config.ts`:

```ts
colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
    subtle: 'hsl(var(--primary-subtle))',
  },
  // etc...
}
```

### Accessibility Requirements

**CRITICAL**: Use standard HTML accessibility attributes correctly.

#### Images

- Informative images: `<img src="..." alt="Description" />` (use standard `alt`, NOT `data-alt`)
- Decorative images: `<img src="..." alt="" />`

#### Icons

- Icon-only buttons: `<button aria-label="Open notifications"><Bell className="w-5 h-5" /></button>`
- Icons with visible text: `<button>Overview <Home aria-hidden="true" /></button>`
- Standalone icons conveying meaning: `<Bell aria-label="You have 3 notifications" />`

#### Links

- Link text must describe destination: `<a href="/settings">Trip settings</a>`
- Icon-only links: `<a href="/settings" aria-label="Trip settings"><Settings /></a>`

#### Form Inputs

- All inputs need labels: `<label for="tripname">Trip name</label><input id="tripname" />`
- Or aria-label if no visible label: `<input aria-label="Search trips" />`

**DO NOT**:

- Use `data-alt` (non-standard)
- Use `title` as a replacement for `alt` (title is for tooltips)
- Omit `aria-label` on icon-only buttons
- Forget `aria-hidden="true"` on decorative icons next to text

### Color Usage Rules

- **Primary buttons and links**: ALWAYS use `--primary` (indigo)
- **Feature accent colors**:
  - `--privacy` (teal): ONLY for lock icons, "Private" badges, blind budget indicators
  - `--vote` (purple): ONLY for poll card borders, vote type badges, quorum bars
- **Semantic colors**: Use `--success`, `--warning`, `--destructive`, `--info` for status communication
- **When in doubt**: Use `--primary` for interactive elements. Feature colors are highlights, not primary CTAs.

### Requirements — Navigation
- Same as landing page: TripOS logo (left) + "Features" (active, underlined) + "Pricing" link + "Sign In" ghost button + "Get Started" primary button
- Sticky on scroll, white bg, shadow-sm when scrolled

### Requirements — Page Header
- Full-width, muted bg section, py-16
- H1: "Everything Your Group Needs" (centered)
- Subtitle: "From planning to voting to budgeting — tools designed for how groups actually travel." (Body, muted, centered, max-w-2xl)

### Requirements — Feature Sections
Alternating layout: image-left/text-right, then text-left/image-right. Each section has py-16 spacing. Mobile: single column, image above text.

**Feature 1 — Collaborative Itinerary** (white bg):
- H2: "Plan Together in Real Time"
- Body: "Add activities, drag to reorder, see changes instantly. No more spreadsheets or endless group chats."
- 4 bullet points with Check icons (success color): "Day-by-day timeline", "Drag-and-drop reorder", "Interactive map view", "Cost estimates per activity"
- Right: App screenshot placeholder (rounded-xl, shadow-lg, 1px border, 16:10 aspect ratio)

**Feature 2 — Structured Voting** (vote-subtle bg):
- H2: "Make Decisions Democratically"
- Body: "Create polls with deadlines. Ranked choice, approval, or yes/no. See results in real-time. No more 'whatever you think' group chat replies."
- 4 bullet points with Check icons (vote color): "3 voting methods", "Deadlines & quorum", "Anonymous option", "Real-time results"
- Left: App screenshot placeholder (purple-tinted border)

**Feature 3 — Blind Budgeting** (privacy-subtle bg):
- H2: "Budget Without the Awkwardness"
- Body: "Everyone sets a private budget. The app finds what your group can afford — without revealing anyone's number. No judgment. No shame."
- 4 bullet points with Check icons (privacy color): "100% private input", "Group max calculation", "No one knows your number", "Change anytime"
- Right: App screenshot placeholder (teal-tinted border)
- Below bullets: "Backed by research" callout card — "Peer-reviewed studies (N=9,110) prove financial transparency in groups causes shame and withdrawal. Blind budgeting removes this barrier." (Small text, muted, italic, with BookOpen icon)

**Feature 4 — Expense Tracking** (white bg):
- H2: "Split Costs Fairly"
- Body: "Track expenses, split bills, see who owes whom. Multi-currency support for international trips."
- 4 bullet points: "Quick expense entry", "Equal or custom splits", "Settlement summary", "Multi-currency"
- Left: App screenshot placeholder

**Feature 5 — Real-Time Collaboration** (muted bg):
- H2: "Stay in Sync"
- Body: "See who's online. Get notified when plans change. Every action logged in the activity feed."
- 4 bullet points: "Live presence indicators", "Instant notifications", "Activity feed", "Works on any device"
- Right: App screenshot placeholder

### Requirements — Comparison Section
- White bg, py-16
- H2: "Why Not Just Use a Group Chat?" (centered)
- Three-column comparison table (card-based on mobile):
  - Column headers: "Group Chat", "Spreadsheet", "TripOS" (TripOS column highlighted with primary border-top)
  - Rows: "Structured voting" | "Budget privacy" | "Real-time itinerary" | "Expense tracking" | "Activity history" | "Role management"
  - Group Chat & Spreadsheet: X icon (destructive, muted). TripOS: Check icon (success)

### Requirements — CTA Section
- Primary bg, white text, py-16, centered
- H2: "Ready to Plan Without the Drama?"
- "Start Planning — It's Free" large button (white bg, primary text) + "No credit card required." (small, white/70%)

### Requirements — Footer
- Same as landing page footer

### States
- SSR static page (instant load)
- Feature sections: fade-in + slight upward slide on scroll (IntersectionObserver, 300ms, staggered)
- CTA buttons: hover (opacity-90), active (scale 0.98)
- Mobile: all sections single-column, images above text, comparison table becomes stacked cards

### Mobile Web Breakpoint
Marketing pages must be responsive for mobile visitors arriving via shared links:
- Single-column layout for all feature sections (image stacks above text)
- Stacked comparison cards instead of three-column table
- Condensed hero: H1 instead of Display size, left-aligned
- Touch-optimized CTAs: minimum 44px height, full-width on mobile
- Hamburger menu replaces horizontal nav links
- Screenshot placeholders scale to full-width
- py-8 section spacing (reduced from py-16)

### Constraints
- Consistent navigation and footer with landing page and pricing page
- All screenshot placeholders have descriptive alt text
- Touch targets 44px minimum
- No horizontal scrolling
- Use only defined color tokens

---

## Prompt D19: Marketing — Pricing Page

### Context
TripOS is a collaborative group travel planning web app. The Pricing page shows available plans, compares features, and answers common questions. Must be transparent, minimize decision anxiety, and highlight the generous free tier. Public page — no authentication required.

### Design Tokens

```css
:root {
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --card: 0 0% 100%;
  --card-foreground: 224 71% 4%;
  --muted: 220 14% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 224 76% 48%;
  --primary: 224 76% 48%;
  --primary-foreground: 210 40% 98%;
  --primary-subtle: 224 76% 95%;
  --secondary: 217 19% 27%;
  --secondary-foreground: 210 40% 98%;
  --accent: 25 95% 53%;
  --accent-foreground: 20 14% 4%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 37%;
  --privacy-foreground: 210 40% 98%;
  --privacy-subtle: 162 72% 95%;
  --vote: 262 83% 58%;
  --vote-foreground: 210 40% 98%;
  --vote-subtle: 262 83% 96%;
  --radius: 0.5rem;
}
```

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
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 42%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --privacy: 162 72% 45%;
  --privacy-foreground: 222 47% 11%;
  --privacy-subtle: 162 40% 15%;
  --vote: 262 83% 68%;
  --vote-foreground: 222 47% 11%;
  --vote-subtle: 262 30% 18%;
  --radius: 0.5rem;
}
```

### Typography
- Font: Inter. Display: 36px/40px bold. H1: 30px bold. H2: 24px semibold. H3: 20px semibold. Body: 16px. Small: 14px. Caption: 12px

### Icon Library

**REQUIRED**: Use Lucide Icons ONLY. Reference format: `lucide:[icon-name]`

Examples:

- Home icon → `lucide:home` → `<Home className="w-5 h-5" />`
- Calendar icon → `lucide:calendar` → `<Calendar className="w-5 h-5" />`
- Vote icon → `lucide:vote` → `<Vote className="w-5 h-5" />`
- Dollar Sign icon → `lucide:dollar-sign` → `<DollarSign className="w-5 h-5" />`
- Users icon → `lucide:users` → `<Users className="w-5 h-5" />`
- Bell icon → `lucide:bell` → `<Bell className="w-5 h-5" />`
- Settings icon → `lucide:settings` → `<Settings className="w-4 h-4" />`

**DO NOT use**:

- Material Icons
- Heroicons
- Font Awesome
- Custom SVGs (unless explicitly specified)

All icons in this prompt refer to Lucide icons.

### Token Usage Rules

**CRITICAL**: Use HSL CSS custom properties via Tailwind classes. NEVER use hex values directly.

**Correct examples**:

- Background: `bg-primary` → compiles to `background-color: hsl(var(--primary))`
- Text: `text-foreground` → compiles to `color: hsl(var(--foreground))`
- Border: `border-border` → compiles to `border-color: hsl(var(--border))`

**INCORRECT examples**:

- `bg-[#4F46E5]` ❌ (bypasses tokens, breaks dark mode)
- `style="background-color: #1D4ED8"` ❌ (inline hex value)
- `className="bg-blue-700"` ❌ (Tailwind default blue, not our primary token)

**Why hex values are shown in tables**: For designer reference only (Figma color pickers). Code must use token names.

**Tailwind config reminder**: All tokens are mapped in `tailwind.config.ts`:

```ts
colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
    subtle: 'hsl(var(--primary-subtle))',
  },
  // etc...
}
```

### Accessibility Requirements

**CRITICAL**: Use standard HTML accessibility attributes correctly.

#### Images

- Informative images: `<img src="..." alt="Description" />` (use standard `alt`, NOT `data-alt`)
- Decorative images: `<img src="..." alt="" />`

#### Icons

- Icon-only buttons: `<button aria-label="Open notifications"><Bell className="w-5 h-5" /></button>`
- Icons with visible text: `<button>Overview <Home aria-hidden="true" /></button>`
- Standalone icons conveying meaning: `<Bell aria-label="You have 3 notifications" />`

#### Links

- Link text must describe destination: `<a href="/settings">Trip settings</a>`
- Icon-only links: `<a href="/settings" aria-label="Trip settings"><Settings /></a>`

#### Form Inputs

- All inputs need labels: `<label for="tripname">Trip name</label><input id="tripname" />`
- Or aria-label if no visible label: `<input aria-label="Search trips" />`

**DO NOT**:

- Use `data-alt` (non-standard)
- Use `title` as a replacement for `alt` (title is for tooltips)
- Omit `aria-label` on icon-only buttons
- Forget `aria-hidden="true"` on decorative icons next to text

### Color Usage Rules

- **Primary buttons and links**: ALWAYS use `--primary` (indigo)
- **Feature accent colors**:
  - `--privacy` (teal): ONLY for lock icons, "Private" badges, blind budget indicators
  - `--vote` (purple): ONLY for poll card borders, vote type badges, quorum bars
- **Semantic colors**: Use `--success`, `--warning`, `--destructive`, `--info` for status communication
- **When in doubt**: Use `--primary` for interactive elements. Feature colors are highlights, not primary CTAs.

### Requirements — Navigation
- Same as landing/features pages. "Pricing" link active (underlined)

### Requirements — Page Header
- Centered, py-16
- H1: "Simple, Transparent Pricing" (centered)
- Subtitle: "Start free. Upgrade when your group grows." (Body, muted, centered)

### Requirements — Pricing Cards
Two cards side-by-side, centered (max-w-4xl), gap-8. Stack vertically on mobile.

**Free Plan** (left card):
- Card: white bg, 1px border, rounded-xl, p-8
- "Free" label (Caption, muted, uppercase, tracking-wide)
- "$0" price (Display size, bold) + "/month" (muted, inline)
- "For small groups getting started" (Body, muted)
- Divider (my-6)
- Feature list with Check icons (success color), gap-3:
  - Up to 3 active trips
  - Up to 8 members per trip
  - Basic voting (yes/no)
  - Blind budgeting
  - Expense tracking
  - Activity feed
- "Get Started Free" outline button (full-width, mt-8)

**Pro Plan** (right card, RECOMMENDED):
- Card: primary border (2px), rounded-xl, p-8, shadow-lg
- "MOST POPULAR" badge (primary bg, white text, text-xs, rounded-full, px-3 py-1, positioned top-right of card, -mt-3)
- "Pro" label (Caption, primary color, uppercase, tracking-wide)
- "$9" price (Display size, bold) + "/month per trip" (muted, inline)
- "For groups who plan seriously" (Body, muted)
- Divider (my-6)
- Feature list with Check icons (success color), gap-3:
  - Everything in Free, plus:
  - Unlimited active trips
  - Up to 20 members per trip
  - All voting types (ranked choice, approval)
  - Blind budgeting with insights
  - Advanced expense splitting
  - Priority support
  - Trip templates
  - Export itinerary (PDF)
- "Start 14-Day Free Trial" primary button (full-width, mt-8)

### Requirements — Feature Comparison Table
Below pricing cards, py-16:
- H2: "Compare Plans" (centered, mb-8)
- Table with header row: Feature | Free | Pro
- Grouped rows with category headers (H3, muted bg row):
  - **Planning**: Active trips (3 / Unlimited), Members per trip (8 / 20), Itinerary builder (check / check), Map view (check / check)
  - **Voting**: Yes/No polls (check / check), Ranked choice (— / check), Approval voting (— / check), Anonymous polls (check / check)
  - **Budget**: Blind budgeting (check / check), Budget insights (— / check)
  - **Expenses**: Basic tracking (check / check), Custom splits (— / check), Multi-currency (check / check), Export (— / check)
  - **Support**: Community forum (check / check), Priority email (— / check)
- Check marks: success color. Dashes: muted-foreground
- Mobile: table becomes card-based — each category is a card with feature rows showing Free vs Pro side-by-side

### Requirements — FAQ Section
- py-16, max-w-3xl centered
- H2: "Frequently Asked Questions" (centered, mb-8)
- Accordion items (Collapsible component):
  - "Can I switch plans later?" → "Yes, upgrade or downgrade anytime. Your data stays intact."
  - "What happens to my data if I downgrade?" → "Your trips and data are preserved. Features beyond the free tier become read-only until you upgrade again."
  - "Do all members need to pay?" → "No. Only the trip creator needs a Pro plan. All members can participate fully for free."
  - "Is there a student discount?" → "Yes! Email us with your .edu address for 50% off Pro."
  - "Can I get a refund?" → "We offer a full refund within 14 days of any payment, no questions asked."
- Each item: question (16px, semibold) + ChevronDown icon (rotates on open), answer (14px, muted, py-4)

### Requirements — CTA Section
- muted bg, py-16, centered
- H2: "Ready to plan your next trip?"
- "Start Free" primary button (large) + "or try Pro free for 14 days" (small, muted, below)
- "No credit card required for free plan." (caption, muted)

### Requirements — Footer
- Same as landing/features pages

### States
- SSR static page
- FAQ accordion: collapsed (default), click toggles open/closed, smooth height transition (200ms), ChevronDown rotates 180 degrees on open
- Pricing cards: subtle hover shadow on desktop
- Mobile: cards stack vertically (Free first, Pro second), comparison table becomes cards

### Mobile Web Breakpoint
Marketing pages must be responsive for mobile visitors arriving via shared links:
- Single-column layout: pricing cards stack vertically (Free above Pro)
- Comparison table converts to stacked category cards
- Condensed page header: H1 at 24px, reduced py-8 spacing
- Touch-optimized CTAs: minimum 44px height, full-width buttons
- Hamburger menu replaces horizontal nav links
- FAQ accordion full-width with generous tap targets (48px per question row)
- "MOST POPULAR" badge repositioned to top-center of Pro card

### Constraints
- Pricing visible above the fold on desktop
- "No credit card required" messaging prominent
- Consistent nav/footer with landing and features pages
- Touch targets 44px minimum
- No horizontal scrolling
- Use only defined color tokens

---

## Dependency Graph

```
D1 Foundation
├── D2 Authentication (standalone pages, minimal D1 dependency)
├── D3 Dashboard (uses D1 sidebar + card layout)
│   └── D4 Trip Overview (extends D3's trip card)
│       ├── D5 Members (trip sub-page)
│       ├── D6 Itinerary Timeline (trip sub-page)
│       │   └── D7 Map View (itinerary companion)
│       ├── D8 Voting: List & Create (trip sub-page)
│       │   ├── D9 Voting: Cast Vote (extends D8)
│       │   └── D10 Voting: Results (extends D8)
│       ├── D11 Blind Budget: Input (trip sub-page)
│       │   └── D12 Blind Budget: Group (extends D11)
│       ├── D13 Expenses (trip sub-page)
│       └── D14 Activity Feed (trip companion)
├── D15 Marketing: Landing (standalone page)
├── D16 States & Feedback (pattern library, no specific page)
├── D17 Profile & Settings (standalone page)
├── D18 Marketing: Features (standalone page)
└── D19 Marketing: Pricing (standalone page)
```
