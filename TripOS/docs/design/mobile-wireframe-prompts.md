# TripOS Mobile Wireframe Prompts (M1-M16)

**Created**: 2026-02-10
**Status**: Complete
**Purpose**: Self-contained mobile wireframe generation prompts for Figma Make (AI), with iOS (HIG) and Android (Material 3) platform variants
**Source of Truth**: style-guide.md (tokens), ux-spec.md (states, flows), desktop-wireframe-prompts.md (desktop counterparts), design-principles.md (philosophy, voice, anti-patterns)

---

## Usage Notes — Figma Make

### Quick Start

1. **One prompt per generation** — Each M-prompt is self-contained with shared layout + platform variants.
2. **Platform selection** — Generate each prompt TWICE: once for iOS, once for Android. Append to the prompt: "Generate the iOS variant using the iOS-specific rules from the Platform Reference table" or "Generate the Android variant using the Android-specific rules."
3. **M1 first** — M1 defines the navigation shell. Generate M1 first, then attach the resulting frame as a visual reference when generating subsequent screens (M3-M16).
4. **Token fidelity** — All 28 tokens are included in every prompt. Do not modify values.
5. **Reduced motion** — All animations must have `prefers-reduced-motion` alternatives (instant state changes).

### Design System Setup (Do Once)

Follow the same setup as desktop prompts (see `desktop-wireframe-prompts.md` § Design System Setup). Additionally:

1. **Mobile frame sizes** — Set frame dimensions to 390x844 (iPhone) or 360x800 (Android) before generating. Figma Make works best with explicit frame sizes.
2. **Platform-specific variables** — Optionally create two additional variable modes: `iOS` and `Android` for platform-specific values (safe areas, touch target sizes, font families).

### Generating Screens

1. **Attach the M1 shell** — Copy-paste your generated M1 navigation shell frame into Make's prompt box when generating M3-M16. This ensures consistent top bar, bottom tab bar, and safe area handling.
2. **Dark mode** — Duplicate the generated frame (Cmd/Ctrl+D) and switch the Variables mode from Light to Dark. Or prompt: "Generate in dark mode using the `.dark` token values."
3. **Iterate per-element** — Use Make's point-and-edit to swap individual components (e.g., "Replace this icon with `lucide:calendar`" or "Change this bottom sheet to use 16px top corner radius").
4. **Limit 3 attachments per prompt** — Prioritize: (1) the M1 shell, (2) relevant component from your library, (3) the desktop counterpart for layout parity reference.

### Prompt Best Practices for Figma Make

- **Front-load constraints** — Semantic color rules and platform-specific rules should appear early in the prompt. Figma Make's AI reads `guidelines.md` before generation.
- **Be explicit about platform** — Always specify "iOS" or "Android" in the prompt. Don't rely on Make to infer from frame size alone.
- **Break bottom sheets into steps** — Generate the base screen first, then use a follow-up prompt to add the bottom sheet overlay.
- **Use Auto Layout** — Reference components must use Auto Layout for Make to interpret spacing and flow correctly.
- **Verify after generation** — Check for: hex color leaks, wrong icon library (Material instead of Lucide), missing safe areas, incorrect touch target sizes (44pt iOS / 48dp Android).

---

## Platform Reference — iOS vs Android

| Aspect | iOS (HIG) | Android (Material 3) |
|--------|-----------|---------------------|
| Navigation bar | 44pt height + safe area | 64dp top app bar |
| Tab bar | 49pt UITabBar + 34pt home indicator | 80dp Material NavigationBar |
| Primary action | Top-right nav bar button (SF Symbol) | FAB (56dp, bottom-right) |
| Bottom sheets | 2 detents: medium (~50%) + large (~100%) | 3 states: peek/half/full |
| Font | SF Pro (`-apple-system`) | Roboto (system default) |
| Back button | Chevron + previous screen title text | Arrow icon only |
| Touch targets | 44pt minimum | 48dp minimum |
| Tab active indicator | Thin underline | Pill-shaped behind icon |
| Tab icon style | Outline (inactive) / Filled (active) | Outlined always, pill highlight |
| Action sheets | iOS-style bottom action sheet | Material bottom sheet menu |
| Switches | iOS UISwitch style | Material Switch (thumb + track) |
| Segmented controls | UISegmentedControl | Material ButtonToggleGroup |
| Safe areas | Dynamic Island: 59pt top, Home indicator: 34pt bottom | Status bar: 24dp top, nav bar: 48dp bottom |

---

## Common Mobile Design Rules (All Prompts)

**CRITICAL**: These rules apply to ALL mobile prompts (M1-M16). They prevent the systemic issues identified in the desktop wireframe audit.

### Mobile Shell Reference (M3-M16)

All authenticated screens (M3 through M16) MUST use the navigation shell defined in M1:

1. **Top Bar**: Sticky, card background, 1px bottom border, below platform safe area
   - Dashboard context: "TripOS" logo (left) + bell icon (right)
   - Trip workspace context: back button (left) + trip name (center) + bell icon (right)

2. **Bottom Tab Bar**: Fixed at bottom, above platform safe area
   - Dashboard mode (2 tabs): My Trips | Profile
   - Trip workspace mode (5 tabs): Overview | Itinerary | Votes | Budget | Members

3. **Bottom Sheets**: Replace desktop modals. 16px top corner radius, drag handle, backdrop dismiss

**DO NOT** invent custom navigation patterns per screen. Reference M1 for all shell behavior.

### Icon Library

**REQUIRED**: Use Lucide Icons ONLY. Reference format: `lucide:[icon-name]`

Examples:
- `lucide:home` → `<Home className="w-5 h-5" />`
- `lucide:calendar` → `<Calendar className="w-5 h-5" />`
- `lucide:vote` → `<Vote className="w-5 h-5" />`
- `lucide:lock` → `<Lock className="w-5 h-5" />`
- `lucide:users` → `<Users className="w-5 h-5" />`
- `lucide:bell` → `<Bell className="w-5 h-5" />`
- `lucide:dollar-sign` → `<DollarSign className="w-5 h-5" />`

**DO NOT use**: Material Icons, Heroicons, Font Awesome, or custom SVGs.

### Token Usage Rules

**CRITICAL**: Use HSL CSS custom properties via Tailwind classes. NEVER use hex values directly.

**Correct**:
- `bg-primary` → `background-color: hsl(var(--primary))`
- `text-foreground` → `color: hsl(var(--foreground))`
- `border-border` → `border-color: hsl(var(--border))`

**INCORRECT**:
- `bg-[#4F46E5]` ❌ (bypasses tokens, breaks dark mode)
- `style="background-color: #1D4ED8"` ❌ (inline hex value)
- `className="bg-blue-700"` ❌ (Tailwind default, not our token)

Hex values in tables are for designer reference only. Code MUST use token names.

### Accessibility Requirements

**Images:**
- Informative: `<img src="..." alt="Description" />` (standard `alt`, NOT `data-alt`)
- Decorative: `<img src="..." alt="" />`

**Icon Buttons:**
- Icon-only: `<button aria-label="Open notifications"><Bell className="w-5 h-5" /></button>`
- With visible text: `<button>Overview <Home aria-hidden="true" /></button>`

**Touch Targets:**
- iOS: 44pt minimum
- Android: 48dp minimum

**DO NOT**:
- Use `data-alt` (non-standard)
- Omit `aria-label` on icon-only buttons
- Forget `aria-hidden="true"` on decorative icons next to text

### Color Usage Rules

**CRITICAL**: TripOS has a strict color hierarchy:

1. **Primary (indigo)** — `--primary` — ALWAYS use for:
   - Primary action buttons (Create, Save, Submit, Cast Vote)
   - Links and navigation highlights
   - Active tab states (except feature-specific tabs)
   - Focus rings

2. **Feature accent colors** — Use ONLY as SECONDARY visual signals:
   - `--privacy` (teal): Lock icons, "Private" badges, privacy-subtle card backgrounds, budget indicators — **NEVER as primary button background**
   - `--vote` (purple): Poll card borders, vote type badges, quorum bars, option selection highlights — **NEVER as primary button background**

3. **When to use feature colors on buttons**:
   - ✅ Icon color inside a primary button: `<button class="bg-primary"><Lock class="text-privacy" /> Save Privately</button>`
   - ✅ Badge: `<span class="bg-vote-subtle text-vote">Ranked Choice</span>`
   - ✅ Selection toggle (Yes/No options): `vote-subtle bg, vote-color border` (these are selection states, not CTAs)
   - ✅ Outline/secondary buttons within feature context: `privacy-color border, privacy-color text`
   - ❌ Primary CTA: `<button class="bg-vote">Create Poll</button>` (WRONG — use bg-primary)
   - ❌ Submit button: `<button class="bg-privacy">Save Privately</button>` (WRONG — use bg-primary)

**Default rule**: When in doubt, use --primary (indigo) for buttons. Feature colors are semantic highlights, not primary CTAs.

---

## Prompt M1: Foundation — Nav Shell, Tab Bar, Bottom Sheets

### Context
TripOS is a collaborative group travel planning web app. This prompt defines the complete mobile navigation shell, tab bar modes, bottom sheet patterns, and safe area handling for both iOS (HIG) and Android (Material 3) platforms. This is the FOUNDATION — all other M-prompts reference the patterns established here. Generate this first.

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

### Screen Viewport
- Width: 390px (iPhone 15 / Pixel 7 baseline)
- Safe areas: applied per platform variant below

### Bottom Navigation — Two Modes

The tab bar changes context depending on whether the user is inside a trip.

**Dashboard mode (outside a trip) — 2 tabs:**

| Tab | Icon | Label | Active Color |
|-----|------|-------|-------------|
| My Trips | Home | My Trips | primary |
| Profile | User | Profile | primary |

**Trip workspace mode (inside a trip) — 5 tabs:**

| Tab | Icon | Label | Active Color |
|-----|------|-------|-------------|
| Overview | Home | Overview | primary |
| Itinerary | Calendar | Itinerary | primary |
| Votes | Vote | Votes | vote (purple) |
| Budget | Lock | Budget | privacy (teal) |
| Members | Users | Members | primary |

Transition: entering a trip animates tab bar from 2 to 5 tabs (morph animation, 300ms ease-out); backing out collapses 5 to 2.

### Layout & Content

**Top Bar:**
- Background: card color, 1px bottom border
- Sticky at top, sits below the platform safe area
- **Dashboard context:** Left: "TripOS" logo text (font-bold, 18px, primary color). Right: bell icon (24px) with red badge dot (8px circle, destructive color) for unread notifications
- **Trip workspace context:** Left: back button (ChevronLeft icon, 24px). Center: trip name (16px, semibold, truncate with ellipsis if longer than 200px). Right: bell icon with badge
- All icons in top bar have minimum tap target of 44x44px

**Tab Bar:**
- Fixed at bottom, above platform safe area
- Background: card color, 1px top border
- Tabs evenly spaced across full width
- Each tab: icon (24px) centered above label (11px, medium weight)
- Inactive state: muted-foreground for both icon and label
- Active state: colored icon + colored label (using the Active Color from the table) + active indicator per platform
- Tab bar hidden only in full-screen map view (M7)

**Bottom Sheet Pattern (replaces desktop modals):**
- Slides up from bottom with 16px (--radius-xl) top-left and top-right corner radius
- Drag handle: 32px wide x 4px tall pill, muted color, centered, 12px below top edge
- Backdrop: black at 50% opacity, tap to dismiss
- Content is scrollable inside the sheet
- Transition: slide-up 300ms ease-out on open, slide-down 200ms ease-in on dismiss

**Pull-to-Refresh:**
- Available on all scrollable content areas
- Pull down 64px to trigger: circular spinner appears (primary color, 24px)
- Release: content refreshes, spinner retracts with spring bounce
- Progress indicator: circular arc fills 0-100% as user pulls toward 64px threshold

**Primary Action Button Placement:**

| Screen | Action |
|--------|--------|
| Dashboard | Create Trip |
| Itinerary | Add Activity |
| Votes | Create Poll |
| Budget | No primary action (input is inline) |
| Members | Inline "Invite" button below member list |

### Interactions
- Tab tap: content cross-fade transition (200ms). No swipe-between-tabs (conflicts with in-content horizontal scroll)
- Tab switch preserves each tab's independent scroll position
- Bottom sheet dismiss: drag down past threshold OR tap backdrop
- Back button in top bar: navigates to previous screen (trip to dashboard, etc.)
- Orientation: portrait only (no landscape layout)
- No hover states on mobile. Use pressed/active states: opacity-90 on press, scale 0.98

### iOS Variant
- **Top bar height:** 44pt + Dynamic Island safe area (59pt top inset). Total top chrome: 103pt
- **Tab bar:** 49pt UITabBar + 34pt home indicator. Total bottom chrome: 83pt
- **Font:** SF Pro (`-apple-system`). Tab labels: SF Pro 10pt medium
- **Tab active indicator:** Thin 2pt underline below the icon, using the tab's active color
- **Tab icon style:** SF Symbols. Outline variant when inactive, filled variant when active
- **Primary action:** Top-right nav bar button using SF Symbol (e.g., `plus.circle` for create actions). 44pt tap target. NO FABs on iOS
- **Back button:** Chevron-left icon + previous screen title as text label (e.g., "< My Trips"). Tappable area extends 44pt
- **Bottom sheets:** 2 detents only — medium (~50% viewport) and large (~100% viewport). Default: medium for simple content, large for forms
- **Safe areas:** `env(safe-area-inset-top)` = 59pt (Dynamic Island), `env(safe-area-inset-bottom)` = 34pt (home indicator)
- **Haptic feedback:** Light impact on tab switch, medium impact on primary action tap

### Android Variant
- **Top bar height:** 64dp Material top app bar + 24dp status bar. Total top chrome: 88dp
- **Tab bar:** 80dp Material 3 NavigationBar + 48dp system navigation bar. Total bottom chrome: 128dp
- **Font:** Roboto (system default). Tab labels: Roboto 12sp medium
- **Tab active indicator:** Pill-shaped highlight behind the icon (32dp x 64dp, primary-subtle fill), matching Material 3 NavigationBar spec
- **Tab icon style:** Material Symbols Outlined, always outline style. Active state distinguished by pill highlight, not icon fill
- **Primary action:** FAB (56dp diameter, circular, shadow-lg) positioned bottom-right, 16dp from right edge, 16dp above the tab bar. FAB color matches context: primary (Dashboard, Itinerary), vote color (Votes). Plus icon (24dp, white)
- **Back button:** Arrow-left icon only, no text label. 48dp tap target
- **Bottom sheets:** 3 states — peek (~30% viewport), half (~50%), full (~90%). Default: half for simple content, full for forms. Peek for map overlays
- **Safe areas:** Status bar: 24dp top, navigation bar: 48dp bottom
- **Ripple feedback:** Standard Material ripple on tab taps and button presses

### States
- Tab bar mode transition: 2-tab to 5-tab morph animation (300ms ease-out). Tabs slide and resize to accommodate the new count
- Active tab icon: subtle scale 1.0 to 1.1 to 1.0 (150ms, ease-out)
- Bottom sheet: follows finger during drag, snaps to nearest detent/state on release (spring physics, 200ms)
- Pull-to-refresh: pulling (progress arc) to refreshing (spinner loop) to complete (retract, 200ms)
- Loading: skeleton rectangles with pulse animation (opacity oscillates 40%-100%, 1.5s loop) on muted background
- Offline: amber banner below top bar — "You're offline. Changes will sync when reconnected." + wifi-off icon. Content remains visible at 70% opacity. Reconnect: green banner "Back online. Syncing..." then fades away (300ms)

### Constraints
- Viewport range: 375px (iPhone SE) through 430px (iPhone 15 Pro Max / Pixel 7 Pro)
- All touch targets: 44pt minimum (iOS) / 48dp minimum (Android)
- Minimum text size: 16px for body, 11px only for tab bar labels (iOS HIG tab bar convention, platform exception below Caption scale)
- Cards: 16px horizontal padding from screen edges (px-4)
- No horizontal scrolling (except explicitly scrollable elements like day tabs, filter pills)
- Safe area insets applied on all four edges
- Use only the 28 color tokens defined above — no arbitrary colors
- No hover states — pressed/active states only

---

## Prompt M2: Authentication — Sign In, Sign Up, Invite Accept

### Context
TripOS is a collaborative group travel planning web app. These are the authentication screens users see before entering the app. Users arrive from direct access (sign up/in) or via an email invite to join a specific trip. On mobile, the centered card layout becomes a full-screen stacked form. This prompt has iOS and Android variants.

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

### Screen Viewport
- Width: 390px (iPhone 15 / Pixel 7 baseline)
- Safe areas: applied per platform variant below

### Bottom Navigation
- Auth screens have NO bottom tab bar. Full-screen layout.
- After successful auth, user transitions to Dashboard mode (2-tab bar)

### Layout & Content

**Sign Up Screen:**
- Full-screen, vertically centered content with px-6 horizontal padding
- Top section (24px below safe area): TripOS logo text (font-bold, 24px, primary color, centered) + tagline "Plan group trips without the awkwardness" (14px, muted-foreground, centered, max 2 lines)
- Social login buttons stacked vertically, full-width, gap-3:
  - "Continue with Google" — 48px height, card background, 1px border, rounded-lg, Google "G" icon (20px) left of text (16px, medium weight). Pressed: muted background
  - "Continue with Apple" — same style, Apple icon left
- Divider: horizontal line (1px, border color) with "or" text centered (12px, muted-foreground, background-colored padding behind text)
- Email input: full-width, 48px height, 1px border, rounded-lg, placeholder "you@example.com", label "Email" (14px, medium) above
- Password input: full-width, 48px height, 1px border, rounded-lg, show/hide toggle icon (Eye/EyeOff, 20px) right-aligned inside input, label "Password" above. Helper text below: "Minimum 8 characters" (12px, muted-foreground)
- "Create Account" primary button: full-width, 48px height, primary background, primary-foreground text, rounded-lg, font-medium
- Bottom text: "Already have an account? Sign in" — "Sign in" is primary color, tappable (44px target height)
- Footer: "By creating an account, you agree to our Terms and Privacy Policy" (12px, muted-foreground, centered, px-8)

**Sign In Screen:**
- Same layout structure as Sign Up
- Logo + tagline at top
- Social login buttons (Google, Apple)
- Divider
- Email input + Password input (no "minimum 8 characters" helper)
- "Forgot password?" link: right-aligned below password input, primary color, 14px
- "Sign In" primary button (full-width, 48px)
- Bottom: "New to TripOS? Create an account" link

**Invite Accept Screen:**
- Same centered layout
- Logo at top
- Invite card (card background, 1px border, rounded-xl, p-5, shadow-sm):
  - "[Inviter Name] invited you to:" (14px, muted-foreground)
  - Trip name (20px, bold)
  - Trip dates + destination (14px, muted-foreground, MapPin icon inline)
  - Member avatar stack (32px, max 5 overlapping + "+N" overflow badge)
- If logged in: "Join Trip" primary button (full-width, 48px)
- If not logged in: "Create account to join" primary button + "Already have an account? Sign in" link
- If invite expired: destructive-colored banner "This invite has expired" + "Request a new invite" link

**Forgot Password Screen:**
- Logo at top
- "Reset your password" heading (20px, semibold)
- Email input (full-width, 48px)
- "Send Reset Link" primary button (full-width, 48px)
- "Back to Sign In" link (primary color, centered)
- Success state: Check icon (32px, success color, centered) + "Check your email for a reset link" (16px, centered)

### Interactions
- Social login buttons: tap redirects to provider OAuth flow
- Form submission: client-side validation first (email format, password length), then loading state on button, then error handling inline
- Inputs: tap to focus, keyboard pushes content up. Tab between fields, return key submits
- Invite page: if invite expired, show error with "Request a new invite" link
- Biometric prompt: after first successful login, offer "Enable Face ID / Fingerprint" on next launch (platform-specific)

### iOS Variant
- **Safe area:** 59pt top (Dynamic Island), 34pt bottom (home indicator)
- **Font:** SF Pro (`-apple-system`). Body: SF Pro 16pt. Labels: SF Pro 14pt medium
- **Social buttons:** Rounded-lg corners matching iOS aesthetic. Apple button uses SF Symbol apple.logo
- **Input focus:** iOS-style blue ring (ring color)
- **Keyboard:** iOS keyboard pushes view up with scroll. "Next" / "Go" accessory buttons on keyboard toolbar
- **Biometric:** "Enable Face ID" prompt after first login, using LocalAuthentication framework visual

### Android Variant
- **Safe area:** 24dp status bar top, 48dp navigation bar bottom
- **Font:** Roboto. Body: Roboto 16sp. Labels: Roboto 14sp medium
- **Social buttons:** Material ripple effect on press. Google button uses standard Google sign-in branding
- **Input focus:** Material-style underline highlight transitioning to outlined style
- **Keyboard:** Android keyboard adjustResize behavior. "Next" / "Done" IME actions
- **Biometric:** "Enable Fingerprint Unlock" prompt, using BiometricPrompt visual

### States
- Inputs: default (1px border), focused (ring-2 ring color, 2px border primary), error (border destructive + red error text below, 14px)
- Buttons: default, pressed (opacity-90, scale 0.98), loading (spinner replacing text + "Creating account..." or "Signing in..."), disabled (opacity-50)
- Form errors: inline below each field, destructive color text, 14px, AlertTriangle icon (12px) inline
- Social buttons: pressed state (muted background)
- Page transition: fade-in from right (300ms) when navigating between auth screens

### Constraints
- Forms must work at 375px width minimum (iPhone SE)
- All buttons minimum 48px height
- All touch targets minimum 44pt (iOS) / 48dp (Android)
- Password minimum 8 characters (show requirement below field)
- No horizontal scrolling
- Keyboard must not obscure the active input field
- Use only the 28 color tokens defined above — no arbitrary colors

---

## Prompt M3: Dashboard — My Trips

### Context
TripOS is a collaborative group travel planning web app. The Dashboard is the home screen after login, showing all trips the user belongs to. Users can create new trips or continue planning existing ones. This is the Dashboard mode with 2-tab bottom navigation. This prompt has iOS and Android variants.

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

### Screen Viewport
- Width: 390px (iPhone 15 / Pixel 7 baseline)
- Safe areas: applied per platform variant below

### Bottom Navigation
- **Dashboard mode (2 tabs):** My Trips (Home icon, active, primary) | Profile (User icon, inactive, muted-foreground)
- iOS: 49pt UITabBar, SF Pro 10pt labels, outline/filled icon toggle, thin underline active indicator
- Android: 80dp Material 3 NavigationBar, Roboto 12sp labels, pill-shaped active indicator behind icon

### Layout & Content

**Top Bar:**
- Left: "TripOS" logo text (font-bold, 18px, primary color)
- Right: bell icon (24px, muted-foreground) with red badge dot (8px circle) when notifications exist

**Page Content (scrollable area between top bar and tab bar):**
- "My Trips" heading (24px, semibold, left-aligned) with horizontal padding px-4, pt-4
- Filter pills: horizontal scrollable row below heading, gap-2, px-4. Pills: "All" (default selected) | "Upcoming" | "Planning" | "Past". Selected pill: primary background, primary-foreground text, rounded-full, px-4 py-2. Unselected: muted background, foreground text, 1px border
- Trip cards: full-width stacked vertically, gap-3, px-4, pt-4

**Trip Card:**
- Card background, 1px border, rounded-xl, p-4, shadow-sm
- Row 1: Trip name (18px, medium, truncate single line) + date range right-aligned (14px, muted-foreground, e.g., "May 10-17")
- Row 2: MapPin icon (14px, muted-foreground) + destination text (14px, muted-foreground)
- Row 3: Stacked avatars (32px, max 4 + "+N" badge) left-aligned
- Row 4 (status badges, gap-2, flex-wrap):
  - Active polls: vote-subtle background, vote-color text, Vote icon (12px), e.g., "2 polls" — rounded-full badge
  - Budget status: privacy-subtle background, privacy-color text, Lock icon (12px), e.g., "Budget set" — rounded-full badge
  - Days until trip: muted text, e.g., "In 23 days" or "Planning"
- Entire card is tappable: navigates to Trip Overview (M4). Pressed state: muted background shift

**Create Trip Bottom Sheet:**
- Heading: "Create a New Trip" (20px, semibold) with drag handle above
- Fields stacked vertically, gap-4, px-4:
  - Trip name: text input (required), placeholder "Trip name", 48px height
  - Destination: text input with MapPin icon left, Google Maps autocomplete, 48px height
  - Date range: start date + end date pickers (native date inputs), side-by-side in a row
  - Description: textarea (optional, 3 rows), placeholder "Add a description..."
- Footer (sticky at bottom of sheet): "Create Trip" primary button (full-width, 48px) + "Cancel" secondary button (full-width, 44px, muted background, below)

**Empty State (no trips):**
- Centered vertically in scrollable area
- Illustration placeholder area (120px height, centered)
- "No trips yet" heading (20px, semibold, centered)
- "Create your first trip and invite friends to start planning together." (16px, muted-foreground, centered, px-8)
- "Create Your First Trip" primary button (full-width within px-8, 48px)
- Below: "Or join a trip with an invite link" (14px, muted-foreground, centered)

### Interactions
- Tap trip card: navigate to Trip Overview with slide-left transition (300ms)
- Tap create action: opens Create Trip bottom sheet
- Filter pills: tap to filter (client-side), selected pill scrolls into view if off-screen
- Pull-to-refresh on trip list: reloads trips
- Cards sorted by most recent activity
- Swipe between tabs: NOT supported (tap only)

### iOS Variant
- **Top bar:** 44pt height + 59pt Dynamic Island safe area
- **Tab bar:** 49pt + 34pt home indicator. 2 tabs: My Trips (Home filled icon, primary, underline), Profile (User outline icon, muted)
- **Font:** SF Pro. Heading: SF Pro 24pt bold. Body: SF Pro 16pt
- **Primary action:** Top-right nav bar `+` button (SF Symbol `plus.circle`, 24pt, primary color, 44pt tap target). Tapping opens Create Trip bottom sheet
- **Bottom sheet:** 2 detents — medium for quick create, large when keyboard is active. Snap to large automatically when an input is focused
- **Create Trip sheet:** "Cancel" as text link top-left of sheet header, "Create Trip" as blue text button top-right (iOS convention) OR full-width button at bottom

### Android Variant
- **Top bar:** 64dp Material top app bar + 24dp status bar
- **Tab bar:** 80dp + 48dp navigation bar. 2 tabs: My Trips (Home outlined, pill highlight when active), Profile (User outlined)
- **Font:** Roboto. Heading: Roboto 24sp bold. Body: Roboto 16sp
- **Primary action:** FAB (56dp, primary background, Plus icon 24dp white, shadow-lg). Positioned bottom-right, 16dp from right edge, 16dp above tab bar. Tap opens Create Trip bottom sheet
- **Bottom sheet:** 3 states — peek/half/full. Opens at half, expands to full when input focused
- **Create Trip sheet:** Full-width "Create Trip" Material filled button at bottom, "Cancel" as Material text button below

### States
- Trip cards: default (shadow-sm), pressed (muted background shift, scale 0.99)
- Loading: 3 skeleton cards with pulse animation (rounded-xl rectangles with internal rows: title 60% width, subtitle 40%, badges 30%)
- Error: "Couldn't load your trips. Check your connection and try again." (AlertTriangle icon 32px, destructive) + "Try Again" primary button, centered
- Empty: educational empty state as described above
- Create sheet: default fields, validation (trip name required — destructive border + "Trip name is required" error below), submitting (button spinner + "Creating..."), success (sheet dismisses, new card appears at top with fade-in 300ms)
- Pull-to-refresh: pulling (progress arc) to refreshing (spinner) to complete (retract)

### Constraints
- Maximum 50 trips visible (paginate beyond with "Load more" button)
- Cards stack vertically at full width (no grid on mobile)
- All touch targets 44pt (iOS) / 48dp (Android) minimum
- No horizontal scrolling (except filter pills)
- Filter pills have horizontal scroll with momentum, subtle gradient fade on edges when more pills available
- Use only the 28 color tokens defined above — no arbitrary colors

---

## Prompt M4: Trip Overview

### Context
TripOS is a collaborative group travel planning web app. The Trip Overview is the main workspace for a specific trip, providing a summary of trip status, quick access to key features, and the activity feed. Users see this when they tap a trip card on the Dashboard. This is the Trip workspace mode with 5-tab bottom navigation. This prompt has iOS and Android variants.

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

### Screen Viewport
- Width: 390px (iPhone 15 / Pixel 7 baseline)
- Safe areas: applied per platform variant below

### Bottom Navigation
- **Trip workspace mode (5 tabs):** Overview (Home, active, primary) | Itinerary (Calendar, primary) | Votes (Vote, vote purple) | Budget (Lock, privacy teal) | Members (Users, primary)
- iOS: 49pt UITabBar, SF Pro 10pt labels, outline/filled icon toggle, thin underline active indicator
- Android: 80dp Material 3 NavigationBar, Roboto 12sp labels, pill-shaped active indicator behind icon

### Layout & Content

**Top Bar:**
- Left: back button (ChevronLeft, 24px). Center: trip name (16px, semibold, truncated). Right: bell icon with badge

**Trip Header Section (px-4, pt-4):**
- Trip name (24px, semibold)
- Row below: MapPin icon (14px) + destination text (14px, muted-foreground) + date range (14px, muted-foreground, separated by bullet)
- Member avatar row: horizontal scroll of avatars (40px, rounded-full). Each avatar has green dot (8px, success color, bottom-right) if online. Max visible: 6 + "+N" overflow badge (muted background, 12px text). Tapping an avatar shows a tooltip with name
- "Invite" button: outline style, Share2 icon (16px) + "Invite" text, rounded-lg, primary border, primary text, 36px height, right-aligned below avatars

**Quick Stats Row (px-4, pt-4):**
- 2x2 grid of stat cards, gap-3:
  - **Members:** Users icon (20px, primary) + "8 members" text (14px, semibold) + "(3 online)" (12px, success color). Card: card background, 1px border, rounded-lg, p-3. Tappable — navigates to Members tab
  - **Active Polls:** Vote icon (20px, vote color) + "2 active" text (14px, semibold). vote-subtle background, rounded-lg, p-3. Tappable — navigates to Votes tab
  - **Budget:** Lock icon (20px, privacy color) + "Budget set" or "Set budget" text (14px, semibold). privacy-subtle background, rounded-lg, p-3. Tappable — navigates to Budget tab
  - **Activities:** Calendar icon (20px, primary) + "12 planned" text (14px, semibold). Card background, 1px border, rounded-lg, p-3. Tappable — navigates to Itinerary tab

**Active Polls Card (conditional — shown only when active polls exist, px-4, pt-4):**
- Card with 4px left border in vote color, vote-subtle background, rounded-xl, p-4
- "Active Polls" heading (16px, semibold) with Vote icon (16px, vote color)
- List of 1-3 active polls: question text (14px, truncate 1 line) + deadline badge ("2d left", 12px, warning color if <24h) + voter fraction ("5/8", 12px, muted-foreground)
- "View All Polls" link at bottom (14px, vote color)
- Tappable — entire card navigates to Votes tab

**Activity Feed (px-4, pt-6):**
- "Recent Activity" section heading (18px, medium) + "View All" link right-aligned (14px, primary color)
- Feed items, vertical list, most recent first, max 10 visible:
  - Each item: Avatar (32px, left) + action text (14px, flex-grow) + timestamp (12px, muted-foreground, right)
  - Action text: **[Actor name]** (bold) [action] [object]. Examples:
    - **Jordan** created a poll: "Which lodge?"
    - **Sam** set their private budget (Lock icon, privacy color — NEVER shows the amount)
    - **Maya** added "Sunset Hike" to Day 3
    - **Riley** voted on "Restaurant choice"
  - Items separated by 1px border divider
  - Day grouping headers: "Today", "Yesterday", "Feb 7" (12px, semibold, muted-foreground, uppercase tracking-wide)
- "Load more" button at bottom (outline style, full-width, 44px) when more items exist

### Interactions
- Stat cards: tap to navigate to corresponding tab (scale 0.98 press feedback)
- Feed items: tap actor name to view member profile card (bottom sheet). Tap object to navigate to that poll/activity
- Invite button: opens invite bottom sheet (same as M5 invite flow)
- Pull-to-refresh: reloads trip overview data
- Real-time updates: new feed items slide in at top with fade animation (300ms). Stat counts animate when values change (number morphs, 200ms)
- Active polls card: tap navigates to Votes tab

### iOS Variant
- **Top bar:** 44pt + 59pt safe area. Back button: chevron + "My Trips" text label
- **Tab bar:** 49pt + 34pt home indicator. Overview tab: Home filled icon, primary, underline
- **Font:** SF Pro. H1: SF Pro 24pt bold. Body: SF Pro 16pt
- **No FAB** — invite is an inline button. No primary creation action on this screen
- **Feed scroll:** iOS-style bounce at top and bottom of list
- **Avatar row:** iOS horizontal scroll with inertia, no scrollbar visible

### Android Variant
- **Top bar:** 64dp + 24dp status bar. Back button: arrow-left icon only
- **Tab bar:** 80dp + 48dp nav bar. Overview tab: Home outlined, pill highlight active
- **Font:** Roboto. H1: Roboto 24sp bold. Body: Roboto 16sp
- **No FAB on Overview** — no primary creation action here
- **Feed scroll:** Material overscroll glow effect
- **Avatar row:** Material horizontal scroll with edge fade indicators

### States
- Loading: skeleton trip header (title 60% width, subtitle 40%) + 4 skeleton stat cards (p-3 rectangles) + 3 skeleton feed items (avatar circle + two text rows)
- No activity yet: "No activity yet. Create your first poll or add an activity to get started." (centered, 16px, muted-foreground) with Calendar icon (32px, muted) above
- Real-time: new feed items slide in at top with fade (300ms). New items do NOT cause scroll jumps if user has scrolled down
- Offline: amber banner below top bar. Content remains visible at 70% opacity
- Error: "Couldn't load trip details. Check your connection and try again." + "Try Again" button, centered in content area

### Constraints
- Activity feed is read-only (no editing from feed)
- Budget amounts NEVER shown in feed — only "set their private budget"
- Feed loads 10 items initially, "Load more" for pagination
- Stats grid: 2x2 on all mobile widths (never single column, never 4-across)
- All touch targets 44pt (iOS) / 48dp (Android) minimum
- No horizontal scrolling (except avatar row)
- Use only the 28 color tokens defined above — no arbitrary colors

---

## Prompt M5: Members & Invitations

### Context
TripOS is a collaborative group travel planning web app. The Members screen shows all trip members, their roles, and online status. Owners and organizers can invite new members and manage roles. This screen is within the trip workspace (5-tab bar, Members tab active). This prompt has iOS and Android variants.

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

### Screen Viewport
- Width: 390px (iPhone 15 / Pixel 7 baseline)
- Safe areas: applied per platform variant below

### Bottom Navigation
- **Trip workspace mode (5 tabs):** Overview | Itinerary | Votes | Budget | Members (Users, active, primary)
- iOS: 49pt UITabBar, Members tab: Users filled icon, primary, underline
- Android: 80dp Material 3 NavigationBar, Members tab: Users outlined, pill highlight

### Layout & Content

**Top Bar:**
- Left: back button. Center: trip name. Right: bell icon with badge

**Section Header (px-4, pt-4):**
- "Members" heading (20px, semibold) + member count badge (muted background, foreground text, rounded-full, px-2, 12px, e.g., "8")

**Member List (px-4, pt-4):**
- Single-column list, full-width items, separated by 1px border dividers
- Members grouped by role: Owner first, then Organizers, then Members, then Guests, then Pending Invites
- Group label headers: "OWNER", "ORGANIZERS", "MEMBERS", "GUESTS", "PENDING" (12px, semibold, muted-foreground, uppercase, tracking-wide, pt-4 pb-2)
- Each member row (minimum 64px height, py-3):
  - Avatar (48px, rounded-full) with online indicator: green dot (10px, success, bottom-right) for online, yellow dot for away (5min+), no dot for offline
  - Name (16px, medium weight) + email below (14px, muted-foreground)
  - Role badge right-aligned: Owner (primary background, primary-foreground text), Organizer (accent background, accent-foreground text), Member (muted background, foreground text), Guest (muted background, muted-foreground text). All badges: rounded-full, px-2.5, py-0.5, 12px
  - Pending invites: dashed avatar border (2px, muted-foreground), "Pending" warning badge (warning at 10% opacity background, warning text), email shown instead of name
  - Three-dot menu icon (MoreVertical, 20px, muted-foreground, right-aligned, 44px tap target) — visible ONLY for owners/organizers

**Invite Section (px-4, pt-6, pb-4):**
- Below member list, separated by border-top
- "Invite your crew" button: full-width, outline style, primary border, primary text, Share2 icon (16px) left, rounded-lg, 48px height

**Invite Bottom Sheet:**
- Drag handle + "Invite to [Trip Name]" heading (20px, semibold)
- Two methods as segmented control: "Share Link" | "Email"
- **Share Link tab (default):**
  - Generated URL in read-only input (14px, muted-foreground, truncated), full-width
  - "Copy Link" primary button (full-width, 48px, Copy icon left). Tap: clipboard copy, button text changes to "Copied!" with Check icon (1.5s revert)
  - Expiry: "Link expires in 7 days" (12px, muted-foreground, centered)
  - "Share via..." button (outline, full-width, 44px, Share icon) — triggers native share sheet
- **Email tab:**
  - Email tag input: each entered email becomes a pill (muted background, 12px, X to remove). 48px height
  - Role selector: dropdown defaulting to "Member" (Organizer, Member, Guest)
  - "Send Invites" primary button (full-width, 48px)
- Success: toast "Invite sent!" (success green left border, Check icon)

**Role Change Bottom Sheet:**
- Triggered by three-dot menu > "Change Role"
- Drag handle + "[Member Name]" heading (18px, semibold) with avatar (40px)
- Role options as radio list, each 56px height:
  - Organizer: radio + "Organizer" (16px, semibold) + "Can create polls, manage activities, invite members" (14px, muted-foreground)
  - Member: radio + "Member" + "Can vote, suggest activities, view content"
  - Guest: radio + "Guest" + "Can view trip details and vote"
- "Update Role" primary button (full-width, 48px)
- Owner transfer: separate action with confirmation dialog: "Transfer ownership to [Name]? This cannot be undone." + "Cancel" secondary + "Transfer" destructive buttons

### Interactions
- Tap member row: expand inline profile card (name, email, role, joined date, last active) with slide-down (200ms)
- Three-dot menu: opens action bottom sheet with "Change Role" + "Remove Member". Remove shows confirmation
- Copy link: clipboard copy with button state change
- Email invite: validates format inline. Invalid: destructive border + "Invalid email"
- Native share sheet: triggered by "Share via..."
- Pull-to-refresh: reloads member list

### iOS Variant
- **Top bar:** 44pt + 59pt safe area. Back button: chevron + trip name
- **Tab bar:** 49pt + 34pt. Members tab: Users filled, primary, underline
- **Font:** SF Pro
- **No FAB** — invite is inline button
- **Invite sheet:** 2 detents — medium (share link), large (email with keyboard)
- **Segmented control:** UISegmentedControl for Share Link / Email
- **Action sheet:** iOS-style grouped action sheet for three-dot menu
- **Switches:** iOS UISwitch style

### Android Variant
- **Top bar:** 64dp + 24dp status bar. Back button: arrow icon only
- **Tab bar:** 80dp + 48dp. Members tab: Users outlined, pill highlight
- **Font:** Roboto
- **No FAB** — invite is inline button
- **Invite sheet:** 3 states (peek/half/full). Opens at half, full for email
- **Segmented control:** Material ButtonToggleGroup
- **Action menu:** Material bottom sheet menu for three-dot
- **Ripple:** Material ripple on member rows

### States
- Loading: 5 skeleton member rows (avatar circle + two text rows + badge rectangle)
- Populated: grouped member list
- Empty (just owner): single owner row + "Invite your friends" card with illustration + "Invite your crew" button
- Invite sending: button spinner + "Sending..."
- Invite success: toast + pending member appears with dashed avatar
- Pending actions: "Resend" (primary text, 14px) and "Cancel" (destructive text, 14px) visible on pending rows
- Online: green dot, Away: yellow dot, Offline: no dot

### Constraints
- Only owners can remove members or transfer ownership
- Only owners and organizers see three-dot menus
- Members and guests see list but no action menus
- All touch targets 44pt (iOS) / 48dp (Android) minimum
- No horizontal scrolling
- Use only the 28 color tokens defined above — no arbitrary colors

---

## Prompt M6: Itinerary — Day Cards & Swipe Actions

### Context
TripOS is a collaborative group travel planning web app. The Itinerary screen shows a day-by-day view of trip activities. On mobile, the desktop vertical timeline with connector line is replaced by full-width stacked cards with a horizontal scrollable day selector. Swipe gestures replace hover menus for card actions. Long-press activates reorder mode. This prompt has iOS and Android variants.

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

### Screen Viewport
- Width: 390px (iPhone 15 / Pixel 7 baseline)
- Safe areas: applied per platform variant below

### Bottom Navigation
- **Trip workspace mode (5 tabs):** Overview | Itinerary (Calendar, active, primary) | Votes | Budget | Members
- iOS: 49pt UITabBar, Itinerary tab: Calendar filled icon, primary, underline
- Android: 80dp Material 3 NavigationBar, Itinerary tab: Calendar outlined, pill highlight

### Layout & Content

**Top Bar:**
- Left: back button. Center: trip name. Right: bell icon

**Day Selector (sticky below top bar):**
- Horizontal scrollable row of day pills, px-4, gap-2, overflow-x with momentum scroll
- Each pill: rounded-lg, px-3 py-2, minimum 64px wide
  - Line 1: "Day 1" (14px, semibold)
  - Line 2: "May 10" (12px)
  - Active: primary background, primary-foreground text
  - Inactive: muted background, foreground text, 1px border
- Right edge: "Map" toggle button (Map icon, 44x44px, muted background, rounded-lg). Tap switches to M7
- Subtle gradient fade on right edge when more days are scrollable

**Activity Cards (scrollable below day selector, px-4, gap-2):**
- No timeline connector line — cards stack directly
- Each card (minimum 72px height, card background, 1px border, rounded-xl, p-3):
  - **Row 1:** Activity name (16px, semibold, truncate) + time right-aligned (14px, muted-foreground)
  - **Row 2:** MapPin icon (14px) + location (14px, muted-foreground, truncate) + DollarSign icon + cost right-aligned (14px, muted-foreground)
  - **Row 3 (conditional):** Status badges — "Proposed" (muted badge, dashed card border), "Vote" (vote-subtle, vote text), "Over budget" (destructive at 10% opacity, destructive text)
  - Pressed state: muted background shift

**Swipe Actions:**
- Swipe left reveals action buttons from right:
  - "Edit": 64px wide, primary background, Pencil icon (24px, white)
  - "Delete": 64px wide, destructive background, Trash2 icon (24px, white)
- Partial swipe (<40%) bounces back. Full swipe (>40%) holds position
- Tap action button to execute. Tap elsewhere or swipe right to close
- Swipe right: no action

**Reorder Mode (long-press 500ms):**
- Banner below day selector: "Reorder Activities" (14px, semibold) + "Done" primary button (36px height, right)
- All cards show GripVertical handle (left edge, 32px wide, muted)
- Drag: card lifts (shadow-lg, scale 1.03), drag vertically, placeholder gap at drop position, release snaps (200ms spring)
- Haptic: light on pickup, medium on drop
- "Done" exits mode, handles disappear

**Add Activity Bottom Sheet (90% viewport):**
- Drag handle + "Add Activity" heading (20px, semibold)
- Fields, gap-4, px-4:
  - Activity name: text input (required), placeholder "What are you doing?", 48px
  - Day: horizontal scroll pills matching day selector style, pre-selects current day
  - Time: native time picker, optional, 48px
  - Location: text input with MapPin icon, Google Maps autocomplete, 48px
  - Estimated cost: numeric input (`inputmode="numeric"`, `pattern="[0-9]*"`) with "$" prefix, optional, 48px
  - Notes: textarea (2 rows), placeholder "Any details..."
  - Category: horizontal scroll pills — Food, Activity, Transport, Accommodation, Other. Single-select
- Footer (sticky): "Save Activity" primary button (full-width, 48px) + "Create Poll for This" link (14px, vote color)

**Empty Day:**
- Dashed border card (rounded-lg, p-6, centered)
- Calendar icon (32px, muted)
- "No activities for Day 1" (16px, muted-foreground)
- "Add Activity" outline button (primary, full-width, 44px)

### Interactions
- Tap day pill: scroll content to that day, update active pill (300ms)
- Tap card: expand inline details (notes, category, linked poll) with slide-down (300ms)
- Swipe left: reveal edit/delete
- Long-press (500ms): enter reorder mode with haptic
- Tap Map toggle: switch to M7
- Tap vote badge: navigate to that poll
- Pull-to-refresh: reload activities

### iOS Variant
- **Top bar:** 44pt + 59pt safe area
- **Tab bar:** 49pt + 34pt. Itinerary: Calendar filled, primary, underline
- **Font:** SF Pro
- **Primary action:** Top-right nav bar `+` button (SF Symbol, primary, 44pt). Opens Add Activity sheet
- **Bottom sheet:** 2 detents — medium (quick view), large (form with keyboard)
- **Swipe:** iOS elastic bounce spring physics
- **Reorder:** iOS shadow lift + haptic (UIImpactFeedbackGenerator)

### Android Variant
- **Top bar:** 64dp + 24dp status bar
- **Tab bar:** 80dp + 48dp. Itinerary: Calendar outlined, pill highlight
- **Font:** Roboto
- **Primary action:** FAB (56dp, primary, Plus 24dp white). Bottom-right, 16dp margins
- **Bottom sheet:** 3 states. Add Activity opens at full
- **Swipe:** Material overscroll resistance
- **Reorder:** Material elevation change + ripple feedback

### States
- Day pills: momentum scroll, active primary fill
- Cards: default, expanded (tap), swiped (swipe-left), reordering (long-press, shadow)
- Loading: skeleton day pills + 3 skeleton cards per day
- Empty day: dashed card with CTA
- Add activity: validation (name required), submitting (spinner), success (sheet dismiss, card fade-in 300ms)

### Constraints
- No timeline connector line on mobile
- No hover states — pressed/active only
- Day selector scroll independent from content scroll
- Reorder drag only via grip handle (not card body)
- All touch targets 44pt (iOS) / 48dp (Android) minimum
- Cards: px-4 margins
- No horizontal scrolling (except day pills, category pills)
- Use only the 28 color tokens defined above — no arbitrary colors

---

## Prompt M7: Map View — Full Screen

### Context
TripOS is a collaborative group travel planning web app. The Map View shows all trip activities plotted on an interactive map. On mobile, the map fills the entire screen with a draggable bottom sheet for the activity list. The bottom tab bar is HIDDEN in this view. Toggled from the Itinerary day selector (M6). This prompt has iOS and Android variants.

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

### Screen Viewport
- Width: 390px (iPhone 15 / Pixel 7 baseline)
- Safe areas: applied per platform variant below

### Bottom Navigation
- **Tab bar is HIDDEN** in full-screen map view
- Exiting map returns to Trip workspace (5 tabs), Itinerary tab active

### Layout & Content

**Top Bar (floating over map):**
- Semi-transparent card background (90% opacity) + blur backdrop, 1px bottom border
- Left: back arrow (returns to list), 44px tap target
- Center: "Day 2 — Map" (16px, semibold)
- Right: day dropdown (ChevronDown + label, muted background, rounded-lg, 36px). Tap: day picker popover with "All Days" / "Day 1" / "Day 2" list

**Map (full viewport):**
- Fills screen between top bar and bottom sheet
- Standard Google Maps, zoom/pan controls
- **Pins:** Numbered circles (28px, primary background, primary-foreground text, bold, shadow-sm). Numbers = activity order within day
  - Active day: full opacity, primary
  - Other days ("All Days"): 40% opacity, muted
  - Pin with poll: vote-color background
  - Selected: scale 1.3 + pulsing ring (primary, 200ms loop)
- **Route lines:** Dashed (primary, 2px) connecting sequential same-day activities

**Bottom Sheet Overlay:**
- Always visible above system safe area
- **Peek (~15%):** Summary: "5 activities" + "Day 2" + ChevronUp icon. Drag handle at top
- **Half (~50%):** Scrollable compact rows (48px each): number badge (20px circle, primary) + name (14px, truncate) + time (12px, muted). Active row: primary-subtle background, 3px primary left border
- **Full (~80%):** Detailed activity cards matching M6 layout
- Drag follows finger, snaps to nearest state (spring 200ms)

### Interactions
- Tap pin: sheet snaps to half, scrolls to activity, pin scales up
- Tap activity row: zooms map to pin, selects it
- Day dropdown: filter pins. "All Days" shows all with non-active at 40%
- Back arrow: return to M6 (slide-right 300ms)
- Pinch/drag: standard map gestures
- Sheet drag: peek to half to full. Does NOT dismiss below peek

### iOS Variant
- **Top bar:** 44pt + 59pt safe area. Back: chevron + "Itinerary" text. UIBlurEffect backdrop
- **Font:** SF Pro
- **Sheet:** 2 detents — medium (~50%), large (~80%). Peek is collapsed summary bar
- **Map:** MapKit or Google Maps iOS SDK
- **Safe area:** Sheet respects 34pt home indicator

### Android Variant
- **Top bar:** 64dp + 24dp. Back: arrow icon only. Material elevation (4dp)
- **Font:** Roboto
- **Sheet:** 3 states — peek (~15%), half (~50%), full (~80%). Material BottomSheetBehavior
- **Map:** Google Maps Android SDK
- **Safe area:** Sheet respects 48dp navigation bar

### States
- Map loading: gray skeleton, then pins appear staggered (50ms each, fade-in + scale 0.5 to 1.0)
- No locations: amber banner "Some activities don't have locations" + dismiss X
- Map error: "Map couldn't load" card + "Try Again" + "Show as List" buttons
- Single activity: centered pin, no route lines
- Pin selected: scale 1.3 + pulse. Row highlighted in sheet
- Sheet transitions: spring physics (200ms)

### Constraints
- Tab bar HIDDEN — map is full-screen
- Sheet peek must not block map controls
- Day dropdown must not overlap zoom controls
- All touch targets 44pt (iOS) / 48dp (Android) minimum
- No horizontal scrolling
- Use only the 28 color tokens defined above — no arbitrary colors

---

## Prompt M8: Voting — Poll List & Create

### Context
TripOS is a collaborative group travel planning web app. The Votes tab shows all polls for a trip — active polls requiring action and completed polls with results. Organizers can create new polls. Voting is the KILLER FEATURE — vote tokens (purple) are used for poll cards, badges, quorum bars, and selection states. Primary action buttons (Create Poll, etc.) use --primary (indigo). See "Common Mobile Design Rules" for color hierarchy. This prompt has iOS and Android variants.

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

### Screen Viewport
- Width: 390px (iPhone 15 / Pixel 7 baseline)
- Safe areas: applied per platform variant below

### Bottom Navigation
- **Trip workspace mode (5 tabs):** Overview | Itinerary | Votes (Vote, active, vote purple) | Budget | Members
- iOS: 49pt UITabBar, Votes tab: Vote filled icon, vote color, underline (vote color)
- Android: 80dp Material 3 NavigationBar, Votes tab: Vote outlined, pill highlight (vote-subtle)

### Layout & Content

**Top Bar:**
- Left: back button. Center: trip name. Right: bell icon

**Section Tabs (px-4, pt-4):**
- Horizontal row: "Active" (with count badge "(3)") | "Completed" | "All"
- Active tab: vote-color text, 2px bottom border. Inactive: muted-foreground
- Evenly spaced across full width

**Active Poll Cards (px-4, pt-4, gap-3):**
- Full-width stacked. Each card:
  - 4px left border, vote color
  - vote-subtle background, rounded-xl, p-4
  - Question (16px, semibold, max 2 lines ellipsis)
  - Status row (gap-2, pt-2): vote type badge ("Yes/No"/"Ranked"/"Approval", vote-subtle bg, vote text, rounded-full, px-2, 12px) + Clock icon + deadline ("2d 5h", 12px, muted. Amber if <24h. Destructive if <2h) + Lock icon in --vote color + "Anonymous" text label (if applicable, 12px)
  - Quorum bar (full-width, 6px, rounded, mt-2): muted bg, vote-color fill. "5 of 8 voted" (12px, muted)
  - Action badge (mt-2): "Vote Now" (vote bg, vote-foreground, rounded-full, px-3 py-1, 14px semibold) OR "Voted" (success at 10% bg, success text, Check icon)
  - Tap: navigate to M9 (if not voted/open) or M10 (if voted/closed)

**Completed Poll Cards:**
- Card background, 1px border, rounded-xl, p-4 (no purple left border)
- Question (16px, semibold) + "Winner: [Option]" (14px, success, Check icon) + "9 votes" (12px, muted)
- Tap: navigate to M10

**Create Poll Bottom Sheet (90% viewport):**
- Drag handle + "Create Poll" (20px, semibold) + Vote icon (20px, vote color)
- Question input: required, placeholder "What should we decide?", 48px
- Options: 2 initial inputs + X delete (only if >2) + "+ Add Option" (vote color, Plus icon)
- Vote type pills: "Yes/No" (default) | "Ranked" | "Approval". Selected: vote bg, vote-foreground. Unselected: muted bg
- Advanced (collapsed accordion): deadline pickers, anonymous toggle (default ON), quorum slider (30-100%, default 60%), allow changes toggle (ON), link to activity dropdown
- Footer (sticky): "Create Poll" (PRIMARY bg, primary-foreground, full-width, 48px)

**Empty State:**
- Vote icon (48px, muted), "No polls yet" (20px, semibold), description (16px, muted, px-8), "Create Your First Poll" (PRIMARY bg, primary-foreground, full-width, 48px)

### Interactions
- Tap active card: navigate to M9 (slide-left 300ms)
- Tap completed card: navigate to M10
- Tab switch: filter with crossfade (200ms)
- Create: open bottom sheet. Advanced toggle: accordion expand (200ms)
- Add/remove options: fade-in/out (150ms)
- Real-time: quorum bars animate on vote (300ms ease-out)
- Pull-to-refresh: reload polls

### iOS Variant
- **Top bar:** 44pt + 59pt. **Tab bar:** 49pt + 34pt. Votes: Vote filled, vote color, underline
- **Font:** SF Pro
- **Primary action:** Top-right `+` button (primary color, 44pt). Opens Create Poll sheet
- **Sheet:** 2 detents — medium (browse), large (create form)
- **Toggles:** iOS UISwitch

### Android Variant
- **Top bar:** 64dp + 24dp. **Tab bar:** 80dp + 48dp. Votes: Vote outlined, vote-subtle pill
- **Font:** Roboto
- **Primary action:** FAB (56dp, PRIMARY bg, Plus 24dp white). Bottom-right
- **Sheet:** 3 states. Create opens at full
- **Toggles:** Material Switch

### States
- Loading: 3 skeleton cards with vote-color left border placeholder
- Create: validation (question required, min 2 options), submitting (spinner), success (toast "Poll created!")
- Quorum: vote color normal, success when met, warning near deadline, destructive low + near deadline
- Deadline: muted (normal), warning (<24h), destructive (<2h), line-through (expired)

### Constraints
- Min 2, max 12 options. Deadline required
- Only organizers/owners see create action
- Vote color (purple) for poll cards, badges, quorum bars, and selection states. Primary action buttons use --primary (indigo). See "Common Mobile Design Rules § Color Usage Rules"
- All touch targets 44pt (iOS) / 48dp (Android) minimum
- No horizontal scrolling
- Use only the 28 color tokens defined above — no arbitrary colors

---

## Prompt M9: Voting — Cast Vote (All Types)

### Context
TripOS is a collaborative group travel planning web app. This is the mobile voting interface where members cast their vote on active polls. Three vote types: Yes/No (simple), Ranked Choice (tap-to-rank with arrow buttons — NO drag-and-drop on mobile), and Approval (multi-select). Vote tokens (purple) are used for option selection states, badges, and quorum bars. Submit buttons (Cast Vote, Save Rankings, Confirm Votes) use --primary (indigo). **BUG FIX**: Yes/No option buttons use vote-color (purple), NOT green/red — but the submit CTA uses --primary. See "Common Mobile Design Rules" for color hierarchy. This prompt has iOS and Android variants.

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

### Screen Viewport
- Width: 390px (iPhone 15 / Pixel 7 baseline)
- Safe areas: applied per platform variant below

### Bottom Navigation
- **Trip workspace mode (5 tabs):** Overview | Itinerary | Votes (Vote, active, vote purple) | Budget | Members
- iOS: 49pt UITabBar, Votes tab active
- Android: 80dp Material 3 NavigationBar, Votes tab active

### Layout & Content

**Vote Header (shared across all vote types, px-4, pt-4):**
- Question text (20px, semibold)
- Vote type badge: "Yes/No" or "Ranked Choice" or "Approval" (vote-subtle background, vote-color text, rounded-full, px-2, 12px)
- Anonymous indicator (if anonymous): Lock icon (14px, vote color) + "Your vote is anonymous" text label (14px, muted-foreground)
- Deadline row: Clock icon (14px) + countdown ("Closes in 1d 14h", 14px, muted-foreground). Warning color if <24h
- Quorum bar: full-width, 6px, rounded, muted background, vote-color fill. "5 of 8 voted (63%)" (12px, muted-foreground)
- Creator: "Created by [Name]" (12px, muted-foreground)

**Yes/No Vote (px-4, pt-6):**
- **IMPORTANT: Yes/No buttons use vote-color (purple), NOT green/red**
- Two large buttons stacked vertically, gap-3, full-width:
  - **"Yes" button:** 56px height, vote-subtle background, 2px vote-color border, rounded-xl, text centered (16px, semibold, vote-color). Check icon (20px, vote-color) left of text
  - **"No" button:** 56px height, muted background, 1px border color, rounded-xl, text centered (16px, semibold, foreground). X icon (20px, muted-foreground) left of text
- Selected state:
  - Yes selected: vote-color background, vote-foreground text, Check icon white. Pulse scale (1.05 to 1.0, 150ms)
  - No selected: vote-subtle background, vote-foreground text. Pulse scale
  - Deselected sibling dims to 60% opacity
- Optional "Abstain" ghost button below (if enabled): muted-foreground text, 44px height
- "Cast Vote" button (PRIMARY background, primary-foreground text, full-width, 48px, mt-4). IMPORTANT: Use --primary (indigo), NOT --vote (purple). Purple is for option selection states, not submit CTAs.
- Below submit: "Anonymous vote" indicator if applicable (Lock icon in --vote color + text label, 12px, muted, centered)

**Ranked Choice Vote (px-4, pt-6):**
- **CRITICAL: NO drag-and-drop on mobile. Tap + arrow buttons ONLY.**
- Instruction: "Tap options to rank them, or use arrows to reorder" (14px, muted-foreground)
- **Ranked section (top):** Numbered option cards, gap-2
  - Each card: 64px min height, full-width, rounded-xl, vote-subtle background, 1px vote-color border
    - Left: rank number in circle (32px diameter, vote-color background, white text, bold)
    - Center: option text (16px, flex-grow)
    - Right: ChevronUp button (44x44px tap target, vote-color icon) + ChevronDown button (44x44px, vote-color icon)
  - Tap up arrow: moves card up one position (slide animation, 200ms)
  - Tap down arrow: moves card down one position
  - First item: up arrow disabled (muted-foreground). Last item: down arrow disabled
  - X button (24px, muted-foreground) on each ranked card: removes rank, moves back to unranked
- **Divider:** Dashed line + "Unranked" label (12px, muted-foreground, centered)
- **Unranked section (bottom):** Remaining option cards
  - Each: muted background, 1px border, rounded-xl, 56px height, no rank number
  - Tap card: adds to bottom of ranked list with next number (slide-in animation, 200ms)
- "Save Rankings" button (PRIMARY background, primary-foreground text, full-width, 48px, sticky at bottom). Disabled until ALL options ranked. IMPORTANT: Use --primary (indigo), NOT --vote.

**Approval Vote (px-4, pt-6):**
- Instruction: "Select all options you approve of" (14px, muted-foreground)
- Option cards: full-width, gap-2
  - Default: card background, 1px border, rounded-xl, 56px height, px-4
  - Content: option text (16px) left, empty circle (24px, muted border) right
  - Selected: vote-subtle background, 2px vote-color border, Check icon (vote-color, 24px) replaces circle. Subtle pulse (1.02 to 1.0)
  - Tap to toggle select/deselect
- Counter: "3 of 6 selected" (14px, muted-foreground, centered, above submit)
- "Confirm Votes" button (PRIMARY background, primary-foreground text, full-width, 48px). Disabled until >= 1 selected. IMPORTANT: Use --primary (indigo), NOT --vote.

**Post-Vote Confirmation (all types):**
- Checkmark animation (200ms): large Check icon (48px) in vote-color, centered, scale from 0 to 1 with bounce
- "Vote submitted!" text (16px, semibold, vote-color, centered)
- Transitions to results preview after 1 second
- "Change Vote" link (14px, vote-color, centered) if changes allowed before deadline

### Interactions
- Yes/No: single tap to select, then submit. Two-step to prevent accidental votes
- Ranked: tap unranked card to add to ranking. Tap arrows to reorder. Tap X to remove. Then submit
- Approval: tap cards to toggle. Then submit
- Change vote: "Change Vote" resets to voting state
- Real-time: quorum bar animates when others vote (300ms ease-out)
- Keyboard: not applicable (no text input on vote screens)

### iOS Variant
- **Top bar:** 44pt + 59pt safe area. Back button: chevron + "Polls" text
- **Tab bar:** 49pt + 34pt
- **Font:** SF Pro
- **Submit button:** Sticky at bottom with 34pt home indicator padding
- **Haptic:** Light impact on option select, medium on submit
- **Ranked arrows:** SF Symbols chevron.up / chevron.down

### Android Variant
- **Top bar:** 64dp + 24dp. Back button: arrow icon only
- **Tab bar:** 80dp + 48dp
- **Font:** Roboto
- **Submit button:** Sticky at bottom with 48dp nav bar padding
- **Ripple:** Material ripple on option cards and buttons
- **Ranked arrows:** Material expand_less / expand_more icons

### States
- Not voted: options interactive, instructions visible
- Selecting (Yes/No): one option highlighted, sibling dimmed
- Ranking in progress: cards animating between positions (200ms)
- Submitting: button shows spinner + "Submitting..."
- Submitted: checkmark animation + confirmation text + transition to results
- Deadline expired: "This poll has closed" overlay (semi-transparent muted background), voting disabled, auto-show results
- Loading: skeleton option cards (3 rectangles)

### Constraints
- **Yes/No option buttons use vote-color (purple), NOT green/red** — deliberate design choice for visual consistency. But the submit CTA ("Cast Vote") uses --primary (indigo)
- NO drag-and-drop for ranked choice on mobile — tap + arrow buttons ONLY
- Ranked choice: ALL options must be ranked before submission (no partial ranking)
- Approval: at least 1 option must be selected
- All option cards minimum 56px height. All arrow buttons 44x44px tap targets
- Primary actions in thumb zone (bottom 40% of screen)
- Vote color (purple) for option cards, selection states, badges, and quorum bars. Submit buttons use --primary (indigo). See "Common Mobile Design Rules § Color Usage Rules"
- No horizontal scrolling
- Use only the 28 color tokens defined above — no arbitrary colors

---

## Prompt M10: Voting — Poll Results

### Context
TripOS is a collaborative group travel planning web app. The results view shows vote outcomes after a poll closes or in real-time during voting for non-anonymous polls. Supports Yes/No, Ranked Choice, and Approval result displays. Vote tokens (purple) are used for result bars, winner cards, and badges. Action buttons (Create Tiebreaker, Re-open Poll) use --primary (indigo). See "Common Mobile Design Rules" for color hierarchy. This prompt has iOS and Android variants.

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

### Screen Viewport
- Width: 390px (iPhone 15 / Pixel 7 baseline)
- Safe areas: applied per platform variant below

### Bottom Navigation
- **Trip workspace mode (5 tabs):** Votes tab active (vote purple)
- iOS: 49pt + 34pt. Android: 80dp + 48dp

### Layout & Content

**Results Header (px-4, pt-4):**
- Question text (20px, semibold)
- Status badge: "Decided" (success background at 10%, success text, Check icon) OR "Tie" (warning background at 10%, warning text) OR "No Quorum" (destructive background at 10%, destructive text)
- Winner announcement (if decided): vote-color background card, rounded-xl, p-4, mt-3
  - Trophy icon (24px, vote-foreground) + winner option text (18px, bold, vote-foreground) + percentage (24px, bold, vote-foreground)
- Total votes: "9 of 12 members voted" (14px, muted-foreground)
- Closed date: "Decided Feb 8, 2026" (12px, muted-foreground)

**Yes/No Results (px-4, pt-4):**
- Two horizontal bars, full-width, gap-3:
  - "Yes" bar: vote-color fill, width proportional to percentage. Label above: "Yes — 7 votes (78%)" (14px, semibold). Bar: 12px height, rounded-full, muted background with vote-color fill
  - "No" bar: muted-foreground fill, width proportional. Label: "No — 2 votes (22%)" (14px). Bar: 12px height, rounded-full
- Winner bar: slightly bolder label
- If public votes: voter avatar chips below each bar (24px avatars, name 12px)
- If anonymous: "Anonymous vote — names hidden" (12px, muted-foreground, Lock icon in --vote color)

**Ranked Choice Results (px-4, pt-4):**
- Winner card as described in header
- Final ranking below: numbered list with medal badges
  - 1st: gold circle badge (accent color) + option name (16px, semibold) + vote count
  - 2nd: silver circle badge (muted-foreground) + option name (14px) + vote count
  - 3rd: bronze circle badge (accent at 60% opacity) + option name (14px) + vote count
  - Remaining: numbered (14px, muted-foreground)
- "View elimination rounds" expandable section (ChevronDown, 14px, vote-color):
  - When expanded: round-by-round breakdown
  - Each round: "Round N" header (14px, semibold) + vote distribution bars per option + "Eliminated: [Option]" (14px, destructive, line-through)
  - Eliminated options grayed out in subsequent rounds

**Approval Results (px-4, pt-4):**
- Winner card as described in header
- Horizontal bar chart, all options:
  - Each row: option name (14px) left + vote count + percentage right (14px, semibold)
  - Bar below text: full-width, 8px, rounded-full. Winner: vote-color fill. Others: muted fill
  - Bars sorted by votes (highest first)
  - Winner has Check icon badge (success)

**Failed Poll States:**
- **Tie:** Warning-colored card (warning at 10% background, warning border). "Tie between [A] and [B]" (16px, semibold). "Create Tiebreaker" button (PRIMARY bg, primary-foreground, full-width, 48px) — organizers only
- **No Quorum:** Destructive-colored card. "Only 3 of 8 voted — quorum not met" (16px). Red progress bar showing shortfall. "Re-open Poll" button (PRIMARY bg, primary-foreground, full-width, 48px) — organizers only

**Participation Footer (px-4, pt-4, pb-4):**
- "You voted: [option name]" with Check icon (success) — or "You didn't vote" (muted-foreground)
- Stacked avatar row (24px, max 5 + "+N") of voters
- "Share Results" outline button (full-width, 44px, Share2 icon). Copies summary to clipboard

### Interactions
- Bars animate on load: grow from 0% to actual percentage (500ms, staggered 100ms between bars)
- Ranked choice rounds: tap to expand/collapse (200ms accordion)
- "Share Results": copies text summary to clipboard, button changes to "Copied!" (1.5s)
- "Create Tiebreaker" / "Re-open Poll": opens M8 create flow pre-populated
- If public: tap voter avatar to see name tooltip
- Real-time (during active poll): bars animate smoothly when new votes arrive (300ms ease-out)

### iOS Variant
- **Top bar:** 44pt + 59pt. Back: chevron + "Polls"
- **Tab bar:** 49pt + 34pt
- **Font:** SF Pro
- **Bar animations:** Core Animation spring curves
- **Share:** Uses UIActivityViewController for native share sheet

### Android Variant
- **Top bar:** 64dp + 24dp. Back: arrow icon
- **Tab bar:** 80dp + 48dp
- **Font:** Roboto
- **Bar animations:** Material motion spring curves
- **Share:** Uses Android share intent

### States
- Loading: skeleton bars (3 rectangles at varying widths)
- Real-time voting: bars animate as votes arrive (300ms ease-out)
- Final results: static after poll closes
- Tie: warning state with action prompt
- No quorum: error state with re-open option
- Bars animate on initial load (staggered 500ms)

### Constraints
- Anonymous polls: NEVER show voter names, only aggregate counts
- Real-time bar updates: smooth animation, no jumps
- Ranked choice rounds: collapsed by default (only winner shown)
- Vote color (purple) for result bars, winner cards, and badges. Action buttons use --primary (indigo)
- All touch targets 44pt (iOS) / 48dp (Android) minimum
- No horizontal scrolling
- Use only the 28 color tokens defined above — no arbitrary colors

---

## Prompt M11: Blind Budgeting — Input & Explainer

### Context
TripOS is a collaborative group travel planning web app. Blind Budgeting is the UNIQUE DIFFERENTIATOR — no competitor has this. Members set private budget caps; the system calculates a group maximum without revealing individuals. This screen handles the private budget input and the first-time explainer carousel. Privacy tokens (teal) are used for Lock icons, "Private" badges, privacy-subtle card backgrounds, and indicators. Action buttons (Save Privately, Next, Got It) use --primary (indigo). See "Common Mobile Design Rules" for color hierarchy. **BUG FIX**: Budget input uses `inputmode="numeric"` + `pattern="[0-9]*"`, NOT `inputmode="decimal"`. This prompt has iOS and Android variants.

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

### Screen Viewport
- Width: 390px (iPhone 15 / Pixel 7 baseline)
- Safe areas: applied per platform variant below

### Bottom Navigation
- **Trip workspace mode (5 tabs):** Overview | Itinerary | Votes | Budget (Lock, active, privacy teal) | Members
- iOS: 49pt UITabBar, Budget tab: Lock filled icon, privacy color, underline (privacy color)
- Android: 80dp Material 3 NavigationBar, Budget tab: Lock outlined, pill highlight (privacy-subtle)

### Layout & Content

**Top Bar:**
- Left: back button. Center: trip name. Right: bell icon

**Budget Tab Layout (scrollable, px-4, gap-4):**
1. Private budget card (top)
2. Group budget card (below — see M12)
3. "How does this work?" link (bottom)

**First-Time Explainer Carousel (bottom sheet, 90% viewport, auto-opens on first visit):**
- Drag handle at top
- 3 slides, swipe horizontally with snap (momentum + magnetic):
  - **Slide 1:** Lock icon (64px, privacy color, centered) + "Your Budget Is Private" (20px, semibold, centered) + "Only you can see your budget amount. Not even the trip organizer." (16px, muted-foreground, centered, max-w-xs) + illustration placeholder (160px height)
  - **Slide 2:** Calculator icon (64px, privacy color) + "We Find the Group Max" (20px, semibold) + "The app calculates what everyone can afford — without showing individual numbers."
  - **Slide 3:** Shield icon (64px, privacy color) + "Zero Judgment" (20px, semibold) + "No one knows if you're the highest or lowest. Plan trips without budget shame."
- Dot indicators: 3 dots centered, active dot privacy color (8px), inactive muted (6px)
- Buttons: "Next" on slides 1-2 (PRIMARY background, primary-foreground text, full-width, 48px). Slide 3: "Got It — Set My Budget" (same style). IMPORTANT: Use --primary (indigo), NOT --privacy (teal). Teal is for icons and badges, not button backgrounds.
- "Skip" link (12px, muted-foreground, top-right) on all slides
- Swipe between slides independently. Drag handle dismisses sheet

**Budget Input Card:**
- Full-width card, privacy-subtle background, 2px privacy-color border, rounded-xl, p-4
- **Header row:** Lock icon (20px, privacy color) + "My Private Budget" (16px, semibold) + "Private" badge (privacy background, privacy-foreground text, rounded-full, px-2, py-0.5, 12px)
- **Input area (centered, py-6):**
  - Currency prefix "$" (24px, muted-foreground, inline-left)
  - Amount: 36px font, bold, privacy color when focused, centered
  - **Input attributes: `inputmode="numeric"`, `pattern="[0-9]*"`** — opens numeric keypad WITHOUT decimal point
  - Clear button: X icon (20px, muted) inside input right edge, appears when value present
- **Reassurance text:** "You can change this anytime. Only you can see this." (14px, muted-foreground, italic, centered)
- **Save button:** "Save Privately" full-width, 48px, PRIMARY background, primary-foreground text, rounded-lg, Lock icon (16px, privacy color) left of text. IMPORTANT: Button uses --primary (indigo), only the Lock icon uses --privacy (teal).
- **Help link:** "How does this work?" (14px, privacy color, centered, below save) — re-opens explainer

**Privacy Details (expandable, below input card):**
- "Privacy Details" header + ChevronDown icon (14px, muted-foreground). Tap to expand (200ms accordion)
- When expanded:
  - Check icon (privacy) + "Your budget: Only you can see this" (14px)
  - Check icon (privacy) + "Group sees: Maximum affordable amount" (14px)
  - X icon (destructive) + "We never share: Individual budgets, names linked to amounts" (14px)
  - Shield icon (privacy) + "Not even the trip organizer can see your budget" (14px)

**Budget Saved State:**
- Lock animation: lock icon clicks shut (200ms) + circle draws around it (200ms) + privacy-color checkmark (150ms)
- Amount displays large: Lock icon (20px) + "$2,500" (30px, bold, privacy color)
- "Edit" link (14px, privacy color, underline) below amount
- Card background: solid privacy-subtle
- "Last updated 2 hours ago" (12px, muted-foreground)
- Tap "Edit": amount becomes editable input again (200ms fade transition)

### Interactions
- Input: tap to focus, numeric keypad opens (no decimal key)
- Save: validates non-zero amount ($1-$99,999), shows loading, confirms with lock animation
- Explainer: swipe between slides. "Next" / "Got It" buttons advance slides
- Privacy details: tap to expand/collapse (200ms)
- Edit: tap "Edit" clears lock state, enables input
- Real-time: group participation indicator updates as others set budgets
- Help link: re-opens explainer carousel

### iOS Variant
- **Top bar:** 44pt + 59pt. Back: chevron + trip name
- **Tab bar:** 49pt + 34pt. Budget: Lock filled, privacy color, underline
- **Font:** SF Pro. Amount: SF Pro 36pt bold
- **No FAB** — budget input is inline
- **Explainer sheet:** 2 detents — large only (content needs full height for illustration + text)
- **Numeric keyboard:** iOS number pad (0-9 only, no decimal)
- **Save animation:** Core Animation for lock icon transition

### Android Variant
- **Top bar:** 64dp + 24dp. Back: arrow icon
- **Tab bar:** 80dp + 48dp. Budget: Lock outlined, privacy-subtle pill
- **Font:** Roboto. Amount: Roboto 36sp bold
- **No FAB** — budget input is inline
- **Explainer sheet:** 3 states. Opens at full for carousel
- **Numeric keyboard:** Android number pad (0-9 only)
- **Save animation:** Material motion for lock icon

### States
- Not set: empty input card + first-time explainer prompt
- First time: explainer carousel auto-opens
- Entering: keyboard open, input focused with privacy-color ring
- Saving: button spinner + "Saving...", input disabled
- Saved: lock animation then display mode
- Editing: tap "Edit" returns to input mode
- Error: destructive border on input + toast "Couldn't save your budget. Check your connection and try again."
- Group participation: progress bar below group card showing "8 of 12 members"

### Constraints
- **`inputmode="numeric"` + `pattern="[0-9]*"`** — NOT `inputmode="decimal"`. Whole numbers only for MVP
- Lock icon ALWAYS visible on private budget card — never hidden or scrolled away
- Teal (privacy) for Lock icons, "Private" badges, privacy-subtle backgrounds, and indicators. Action buttons use --primary (indigo). See "Common Mobile Design Rules § Color Usage Rules"
- "Private" badge always visible alongside budget amount
- Minimum budget: $1. Maximum: $99,999
- All touch targets 44pt (iOS) / 48dp (Android) minimum
- Cards: px-4 margins
- No horizontal scrolling
- Use only the 28 color tokens defined above — no arbitrary colors

---

## Prompt M12: Blind Budgeting — Group Display

### Context
TripOS is a collaborative group travel planning web app. This screen shows the aggregate group budget that ALL members can see — the group maximum and participation status — without revealing any individual amounts. Displayed below the private budget card (M11) in the Budget tab. Privacy tokens (teal) are used for indicators, confidence bars, and subtle backgrounds. Action buttons use --primary (indigo). See "Common Mobile Design Rules" for color hierarchy. This prompt has iOS and Android variants.

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

### Screen Viewport
- Width: 390px (iPhone 15 / Pixel 7 baseline)
- Safe areas: applied per platform variant below

### Bottom Navigation
- **Trip workspace mode (5 tabs):** Budget tab active (Lock, privacy teal)
- iOS: 49pt + 34pt. Android: 80dp + 48dp

### Layout & Content

**Side-by-Side Comparison (stacked vertically on mobile, px-4, gap-4):**

**Card 1: "Your Budget" (Private) — privacy-subtle background, 2px privacy-color border, rounded-xl, p-4:**
- Lock icon (20px, privacy color) + "Your Budget" (16px, semibold) + "Only you see this" (12px, muted-foreground, italic)
- Amount: "$800" (30px, bold, privacy color, centered)
- "per person, total trip" (12px, muted-foreground, centered)
- Status indicator:
  - Within range: success Check icon + "Within group range" (14px, success)
  - Setting the max: warning AlertTriangle icon + "You're setting the group max" (14px, warning) — private
  - Above everyone: success Check + "Above group max" (14px, success)

**Card 2: "Group Budget" (Shared) — card background, 1px border, rounded-xl, p-4:**
- Users icon (20px, muted-foreground) + "Group Budget" (16px, semibold) + "Everyone sees this" (12px, muted-foreground, italic)
- Group max: "$600 per person" (30px, bold, privacy color, centered)
- "Group Maximum" label (12px, muted-foreground, centered)
- Confidence: "Based on 8 of 12 members" (12px, muted-foreground)
- Confidence bar: full-width, 8px, rounded-full, privacy-subtle background, privacy-color fill proportional to participation (8/12 = 67%)

**Range Visualization (below cards, px-4, pt-4):**
- Horizontal bar chart: full-width, 24px height, rounded-lg
  - Background: muted
  - Filled range (25th to 75th percentile): privacy-color gradient (privacy-subtle to privacy)
  - Labels below bar: "$600" (left/min), "$900 median" (center), "$1,200" (right/max) — all 12px, muted-foreground
- "Your position is hidden" (12px, muted-foreground, italic, Lock icon inline, centered below)
- Privacy note: "Individual budgets are never revealed." (12px, muted-foreground, centered)
- "Updated 5 minutes ago" (12px, muted-foreground, centered)

**Private Warning (conditional — only shown if user's budget = group min):**
- Warning card below range: warning at 10% opacity background, 1px warning border, rounded-lg, p-3
- Warning icon (16px) + "Your budget is setting the group max" (14px, semibold)
- "Only you can see this" (12px, muted-foreground, Lock icon inline)

**Waiting State (fewer than 3 budgets submitted):**
- Group card shows: spinner (24px, privacy color) + "Waiting for more members" (16px, muted-foreground, centered)
- Progress: "3 of 12 members have set their budget" (14px, muted-foreground)
- Confidence bar shows partial fill
- "Send Reminder" outline button (privacy-color border, privacy-color text, full-width, 44px). Tap: sends notification to members without budgets

### Interactions
- Cards: informational, not tappable (except links)
- Range chart: static on mobile (no hover tooltips)
- "Send Reminder": triggers push notification, button changes to "Reminder Sent!" with Check icon (1.5s revert)
- Real-time: group max and confidence bar animate smoothly when budgets change (300ms ease-out)
- "View affordable options" link (privacy color, below group card): navigates to filtered itinerary/search

### iOS Variant
- **Top bar:** 44pt + 59pt
- **Tab bar:** 49pt + 34pt. Budget: Lock filled, privacy color
- **Font:** SF Pro. Amounts: SF Pro 30pt bold
- **Cards stack vertically** — no side-by-side on any mobile width
- **Animations:** Core Animation for bar fills and value transitions

### Android Variant
- **Top bar:** 64dp + 24dp
- **Tab bar:** 80dp + 48dp. Budget: Lock outlined, privacy-subtle pill
- **Font:** Roboto. Amounts: Roboto 30sp bold
- **Cards stack vertically**
- **Animations:** Material motion for transitions

### States
- Waiting: fewer than 3 budgets (spinner, partial progress bar, "Send Reminder" button)
- Calculating: budget just changed, group max recalculating (brief spinner on group card, 200ms)
- Ready: full data shown, range chart rendered
- Your budget lower: warning card visible (private)
- Your budget higher: success indicator (private)
- Error: "Couldn't load group budget. Retrying..." with auto-retry spinner
- Small group (<5): vague status only: "Most members are within a similar range" (no range chart to prevent inference)

### Constraints
- NEVER reveal individual budget amounts (only aggregates)
- "Your Budget" card shows only to the logged-in user
- "Group Budget" data is identical for all members
- Small groups (<5): show vague status only to prevent inference
- Teal (privacy) for indicators, confidence bars, and subtle backgrounds. Action buttons use --primary (indigo)
- All touch targets 44pt (iOS) / 48dp (Android) minimum
- Cards: px-4 margins, stacked vertically (never side-by-side on mobile)
- No horizontal scrolling
- Use only the 28 color tokens defined above — no arbitrary colors

---

## Prompt M13: Expense Management

### Context
TripOS mobile expense tracking screen. Members record trip expenses, split costs, and view settlement summaries. This is standard expense tracking (NOT blind budgeting) — uses primary blue color, not teal. Quick-add flow optimized for on-the-go entry at restaurants and shops. Adapts desktop Prompt 13 for touch-first interaction with bottom sheet forms and swipe-to-delete.

### Design Tokens (Full 28-Token Canonical Set)

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

### Screen Viewport
- Width: 390px (iPhone 15 / Pixel 7 baseline)
- Height: variable (scrollable)
- Safe areas: respect notch/dynamic island (top), home indicator (bottom)

### Bottom Navigation (Trip Workspace — 5 Tabs)
Budget tab active (this screen is accessed from the Budget tab's expenses sub-section):
| Icon | Label | State |
|------|-------|-------|
| Home | Overview | inactive |
| Calendar | Itinerary | inactive |
| Vote | Votes | inactive |
| Lock | Budget | **active** |
| Users | Members | inactive |

### Layout & Content — Expense List
- **Top bar**: "Expenses" title + trip total right-aligned ("$2,450 total", 16px semibold)
- **Segmented control** below top bar: "Expenses" | "Settlement" (full-width, two segments)
- **Category filter**: horizontal scroll row of filter pills — All (default selected), Food, Activity, Transport, Accommodation, Other. Selected pill: primary bg + primary-foreground text. Unselected: muted bg
- **Expense list**: vertical cards, px-4 margins
  - Each card (card bg, rounded-xl, p-4):
    - Row 1: Description (16px medium, left) + Amount (16px bold, right-aligned)
    - Row 2: Category badge (small pill, muted bg, 12px) + "Paid by [Name]" (14px muted) + Date (14px muted, right)
    - Row 3: Split info: "Split 4 ways" or "You owe $12.50" (14px muted)
    - Optional: linked activity badge (small primary-subtle pill with Calendar icon)

### Layout & Content — Add Expense Bottom Sheet
Triggered by FAB (Android) or top-right "+" button (iOS):
- **Drag handle** centered at top (40x4px, rounded, muted)
- **Amount input**: large centered text, 36px bold, currency prefix ($), `inputmode="decimal"` for numeric keyboard with decimal point
- **Description**: text input (required), placeholder "What was this for?"
- **Category picker**: 5 pill buttons in a wrapping row (Food, Activity, Transport, Accommodation, Other). Single-select
- **Paid by**: tappable row with member avatar + name + ChevronRight. Opens member picker sub-sheet
- **Split method**: "Split equally" default toggle. "Custom split" shows member list with amount input per person
- **Currency**: small tappable pill showing current currency (USD). Opens currency picker sub-sheet
- **Link to activity**: optional tappable row ("Link to activity" + ChevronRight)
- **"Save Expense"** primary button, full-width, 48px height, bottom of sheet

### Layout & Content — Settlement Summary
Shown when "Settlement" segment is selected:
- **Summary card** (card bg, rounded-xl, p-4):
  - "Who Owes Whom" heading (18px semibold)
  - Settlement rows: avatar pair (left-right arrow between) + "[Name] owes [Name]" + "$45" bold
  - "Settle Up" small primary button per row
- **Balance list**: net balance per person
  - "+$120" in success color (you're owed)
  - "-$45" in destructive color (you owe)
  - "$0" in muted (settled)

### Interactions
- Tap expense card: expand to show full details inline (no navigation)
- Swipe left on expense card: reveal red "Delete" button (destructive bg, Trash icon)
- Category filter pills: tap to filter list (client-side, instant)
- Pull-to-refresh: update expense list
- "Settle Up": bottom sheet with payment options (Venmo/PayPal link, or "Mark as Paid")
- Multi-currency: conversion rate shown inline ("€45 ≈ $49 USD")

### iOS Variant
- **Top bar:** 44pt height + 59pt (large title area). "Expenses" large title left-aligned
- **Tab bar:** 49pt + 34pt home indicator. Budget tab: Lock filled, privacy (teal) color
- **Font:** SF Pro. Amounts: SF Pro 36pt bold (input), 16pt bold (list)
- **Add button:** top-right nav bar "+" icon (no FAB)
- **Bottom sheet:** 2-detent — medium (amount + description visible) and large (full form). UISheetPresentationController style
- **Swipe delete:** standard iOS swipe-to-delete with red background

### Android Variant
- **Top bar:** 64dp + 24dp status bar. "Expenses" centered
- **Tab bar:** 80dp NavigationBar + 48dp gesture area. Budget: Lock outlined, privacy-subtle pill on active
- **Font:** Roboto. Amounts: Roboto 36sp bold (input), 16sp bold (list)
- **FAB:** 56dp circle, bottom-right (16dp above tab bar, 16dp from right edge), primary bg, Plus icon
- **Bottom sheet:** Material 3 BottomSheetDialog, 3 drag stops
- **Swipe delete:** Material swipe with red background reveal

### States
- Empty: DollarSign icon (48px, muted) + "No expenses yet" + "Record your first expense to start tracking costs." + "Add Expense" primary button
- Loading: 3 skeleton cards matching expense card layout, pulsing (1.5s loop)
- Adding: bottom sheet with form validation (amount required, description required)
- Multi-currency: conversion shown inline with muted exchange rate text
- Settlement all settled: Check icon (success) + "All settled up!" + "No outstanding balances."
- Error: "Couldn't load expenses. Try again." + retry button

### Constraints
- Expenses are PUBLIC to all trip members (NOT private like budgets)
- Standard primary blue color — never teal (that is for blind budgeting only)
- Multi-currency: show converted amount alongside original
- Maximum 500 expenses per trip
- All touch targets 44pt (iOS) / 48dp (Android) minimum
- Cards: px-4 margins, stacked vertically (never side-by-side on mobile)
- No horizontal scrolling
- Use only the 28 color tokens defined above — no arbitrary colors

---

## Prompt M14: Activity Feed & Notifications

### Context
TripOS mobile activity feed and notification system. The activity feed shows a real-time timeline of all actions taken on a trip. The notification center collects alerts across all trips, accessed from the bell icon. Both update in real-time. Adapts desktop Prompt 14 for mobile with full-screen notification sheet and bottom-positioned toasts.

### Design Tokens (Full 28-Token Canonical Set)

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

### Screen Viewport
- Width: 390px (iPhone 15 / Pixel 7 baseline)
- Height: variable (scrollable)
- Safe areas: respect notch/dynamic island (top), home indicator (bottom)

### Bottom Navigation (Trip Workspace — 5 Tabs)
Overview tab active (activity feed lives on the Overview tab):
| Icon | Label | State |
|------|-------|-------|
| Home | Overview | **active** |
| Calendar | Itinerary | inactive |
| Vote | Votes | inactive |
| Lock | Budget | inactive |
| Users | Members | inactive |

### Layout & Content — Activity Feed (Trip-Level)
Shown as a scrollable section on the Trip Overview screen, below the trip header and quick stats:
- **Section heading**: "Recent Activity" (18px semibold) + "View All" link (14px, primary color, right-aligned)
- **Day group headers**: "Today", "Yesterday", "Feb 7, 2026" — 14px, semibold, muted-foreground, sticky during scroll
- **Feed items** (full-width rows, py-3, border-b):
  - Left: avatar (32px round) with contextual icon overlay (16px, bottom-right of avatar)
    - Vote icon (vote color) for polls
    - MapPin (primary) for activities
    - Lock (privacy color) for budget actions
    - Users (primary) for member changes
    - DollarSign (primary) for expenses
  - Center: action text — **[Name]** [verb] [object] — 14px, name is semibold. Object is tappable (primary color)
  - Right: relative timestamp ("2h ago", "just now") — 12px, muted-foreground
- **Privacy rule**: Budget actions show ONLY "set their private budget" — NEVER the amount
- **Vote privacy**: Anonymous votes show "voted on [Poll Name]" — NEVER what they voted for
- Newest first. Load 20 at a time. "Load more" button (muted bg, 14px) at bottom

### Layout & Content — Notification Center
Accessed via bell icon in top bar (all screens). Bell icon has unread badge (red circle, 12px, white number):
- **Full-screen bottom sheet** (slides up from bottom, covers ~95% of screen)
- **Drag handle** + "Notifications" title (18px semibold) + "Mark all as read" link (14px, primary, right)
- **Notification list** (vertical, full-width):
  - Each item (py-3, px-4, border-b):
    - Left: contextual icon (24px) in colored circle (32px):
      - Vote icon, vote-subtle bg — "New poll: [Question]"
      - Clock icon, warning bg (10% opacity) — "Deadline approaching: [Poll] closes in 4 hours"
      - Users icon, primary-subtle bg — "[Name] joined [Trip Name]"
      - Lock icon, privacy-subtle bg — "Group budget updated"
      - Bell icon, muted bg — general notifications
    - Center: notification text (14px) + trip name (12px, muted) + timestamp (12px, muted)
    - Unread state: card bg (white/card), bold text, blue dot (8px) on left edge
    - Read state: muted bg, normal weight text, no dot
  - Tap notification: navigate to relevant screen + mark as read
- **Empty state**: Bell icon (48px, muted) + "All caught up!" + "Notifications for polls, deadlines, and trip updates will appear here."

### Layout & Content — Toast Notifications
In-app real-time feedback:
- **Position**: bottom-center, 16px above tab bar
- **Width**: calc(100% - 32px), max 358px
- **Animation**: slide up + fade in (300ms ease-out)
- **Auto-dismiss**: 4 seconds (info/success), 6 seconds (warning/error)
- **Variants** (card bg, rounded-xl, p-3, shadow-lg):
  - Success: success color left border (3px), Check icon (success color) + text
  - Error: destructive left border, AlertTriangle icon + text + "Try Again" tappable link
  - Info: info left border, Info icon + text
  - Warning: warning left border, Clock icon + text
- **Dismiss**: tap X button (right edge) or swipe right
- **Stack**: max 3 visible, older toasts collapse upward. 4th toast dismisses oldest

### Interactions
- Feed items: tap object name (primary colored text) to navigate to poll/activity/member
- Pull-to-refresh on activity feed: fetch latest items
- New real-time items: slide in at top with fade (300ms). If user has scrolled down, show "New activity" pill at top of list (tappable to scroll up)
- Notification tap: navigate to relevant screen + mark as read
- Bell icon: tap opens notification sheet
- "Mark all read": clears all unread states + removes badge count
- Toast tap: navigate to related item. Swipe right: dismiss
- Swipe notification left: "Clear" action button (muted bg)

### iOS Variant
- **Top bar:** 44pt + 59pt. Bell icon in top-right nav bar area
- **Tab bar:** 49pt + 34pt home indicator. Overview tab: Home filled
- **Font:** SF Pro. Feed text: SF Pro 14pt. Day headers: SF Pro 14pt semibold
- **Notification sheet:** full-screen UISheetPresentationController (.large detent only)
- **Toasts:** positioned above tab bar (49pt + 34pt + 16pt padding from bottom)
- **Swipe actions:** standard iOS swipe gesture on notifications

### Android Variant
- **Top bar:** 64dp + 24dp. Bell icon in top app bar trailing action
- **Tab bar:** 80dp NavigationBar + 48dp gesture area. Overview: Home outlined, primary-subtle pill
- **Font:** Roboto. Feed text: Roboto 14sp. Day headers: Roboto 14sp medium
- **Notification sheet:** Material 3 full-screen BottomSheetDialog
- **Toasts:** Snackbar-style, positioned above NavigationBar (80dp + 16dp padding)
- **Swipe actions:** Material swipe with background reveal

### States
- Feed loading: 5 skeleton items (avatar circle + 2 text rows pulsing, 1.5s loop)
- Feed populated: items grouped by day, newest first
- Feed empty: Clock icon (48px, muted) + "No activity yet" + "Actions like voting, adding activities, and inviting friends will appear here."
- Feed real-time: new items animate in at top (300ms slide-down + fade)
- Notifications loading: skeleton list
- Notifications populated: unread items at top, read below
- Notifications empty: "All caught up!" with Bell icon
- Notifications unread: badge count on bell icon (red circle). Badge count "9+" for 10+
- Toast appearing: slide-up + fade-in (300ms)
- Toast dismissing: fade-out + slide-down (200ms)
- Offline: feed shows cached items, "Offline — showing cached activity" muted banner below header

### Constraints
- Activity feed NEVER shows private budget amounts (only "set their private budget")
- Anonymous votes NEVER show what was voted for in feed
- Max 100 notifications retained (older auto-archived)
- Toast stack max 3 (oldest dismissed when 4th arrives)
- Real-time updates must NOT cause scroll jumps (new items added above viewport if user has scrolled down)
- All touch targets 44pt (iOS) / 48dp (Android) minimum
- Feed items: px-4 margins, full-width
- No horizontal scrolling
- Use only the 28 color tokens defined above — no arbitrary colors

---

## Prompt M15: States & Feedback — Mobile

### Context
TripOS mobile global state patterns used across ALL screens: empty states, loading skeletons, error handling, confirmation feedback, and offline mode. These patterns ensure consistent visual feedback on mobile. Adapts desktop Prompt 16 for touch interaction with pull-to-refresh, haptic feedback hints, and mobile-specific positioning. **Shell context**: These patterns render WITHIN the M1 navigation shell (top bar + tab bar). See "Common Mobile Design Rules § Mobile Shell Reference" for shell structure. See "Common Mobile Design Rules § Color Usage Rules" for button color hierarchy.

### Design Tokens (Full 28-Token Canonical Set)

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

### Screen Viewport
- Width: 390px (iPhone 15 / Pixel 7 baseline)
- Height: variable
- Safe areas: respect notch/dynamic island (top), home indicator (bottom)

### Layout & Content — Empty States
Every section has an educational empty state. Centered vertically in available content area (between top bar and tab bar). Format:
- Icon (48px, muted-foreground, centered)
- Heading (18px semibold, centered, mt-4)
- Description (14px, muted-foreground, centered, max-w-[260px], mt-2)
- CTA button (primary, 44pt/48dp min height, mt-6) — omitted where no action possible

| Section | Icon | Heading | Description | CTA |
|---------|------|---------|-------------|-----|
| Trips | MapPin | "No trips yet" | "Create your first trip and invite friends to start planning." | "Create Trip" |
| Itinerary | Calendar | "No activities yet" | "Add your first activity to start building the itinerary." | "Add Activity" |
| Polls | Vote (vote color) | "No polls yet" | "Create a poll to start making group decisions." | "Create Poll" |
| Budget | Lock (privacy color) | "Budget not set" | "Set your private budget to help the group plan affordably." | "Set Budget" |
| Expenses | DollarSign | "No expenses yet" | "Record your first expense to start tracking costs." | "Add Expense" |
| Members | Users | "Just you so far" | "Invite friends to start planning together." | "Invite your crew" |
| Activity Feed | Clock | "No activity yet" | "Actions like voting, adding activities, and inviting friends will appear here." | — |
| Notifications | Bell | "All caught up!" | "Notifications for polls, deadlines, and trip updates will appear here." | — |

### Layout & Content — Loading Skeletons
Replace real content with pulsing shapes matching the actual content layout:
- **Pulse animation**: opacity oscillates 40% to 100% on muted bg (1.5s ease-in-out loop)
- **Card skeleton**: rounded-xl rectangle, p-4. Internal rows: title line (60% width, 14px h), subtitle (40% width, 12px h), body (80% width, 12px h). Gap-2 between rows
- **Avatar skeleton**: rounded-full circle (32px or 40px matching real size)
- **List item skeleton**: avatar circle (left) + two text rows (right, 100% then 60% width)
- **Chart bar skeleton**: full-width rectangle, 24px height, rounded
- **Button skeleton**: rounded-lg rectangle matching button dimensions
- Show 3 skeleton items for lists, 1 skeleton for single cards
- **Transition**: skeleton to real content — 200ms crossfade

### Layout & Content — Error States

**Inline Error** (form fields):
- Red (destructive) border on input field (2px)
- Error text below input: destructive color, 12px, AlertTriangle icon (12px) inline left of text
- Example: "Budget must be at least $1"

**Section Error** (content area within a tab):
- Centered in content area (replaces content)
- AlertTriangle icon (32px, destructive color)
- "Couldn't load [section name]" (16px semibold, mt-3)
- "Check your connection and try again." (14px, muted-foreground, mt-1)
- "Try Again" primary button (mt-4, 44pt/48dp min height)

**Page Error** (full screen failure):
- Centered in full viewport (above tab bar)
- AlertTriangle icon (64px, destructive color)
- "Something went wrong" (20px semibold, mt-4)
- "We're having trouble loading this page. Try refreshing." (14px, muted-foreground, mt-2, max-w-[280px], centered)
- "Refresh Page" primary button (mt-6) + "Go to Dashboard" ghost button (mt-2)

### Layout & Content — Confirmation Feedback

**Toast notifications** (see M14 for full spec):
- Success: success left border, Check icon — "Budget saved. Only you can see this." / "Vote submitted!" / "Activity added!"
- Positioned bottom-center, 16px above tab bar. Auto-dismiss 4 seconds

**Inline confirmations**:
- Checkmark animation sequence: circle draws (200ms) then check draws (150ms) then text fades in (150ms)
- Success color. Used for: budget save, vote submission, profile update
- Appears in place of the submit button momentarily (1.5s) before reverting

**Destructive action confirmation** (bottom sheet dialog, NOT centered modal):
- Drag handle + "Delete this activity?" heading (18px semibold)
- Description text (14px, muted): what will happen ("This will permanently delete the activity.")
- "Cancel" secondary button (full-width, 48px) + "Delete" destructive button (full-width, 48px, below cancel)
- Destructive button is always below cancel (thumb-zone friendly — dangerous action requires more reach)

### Layout & Content — Offline State
- **Banner**: full-width bar pinned below top bar. Warning bg (10% opacity), warning color text + WifiOff icon (16px). "You're offline. Changes will sync when reconnected." (14px)
- Content remains visible but 70% opacity
- Actions queue locally, sync on reconnect
- **Reconnect banner**: success bg (10% opacity), success text: "Back online. Syncing..." (2s then fade out, 300ms)

### Layout & Content — Pull-to-Refresh
Available on all scrollable list screens (trips, itinerary, expenses, feed, polls, members):
- Pull down from top of scroll area: spinner appears (24px, primary color)
- Pull threshold: 60px before trigger
- Release: spinner animates, list refreshes
- Complete: spinner fades out (200ms), new content appears

### Interactions
- Pull-to-refresh: triggers data reload on all list screens
- Error "Try Again": re-fetches failed section
- Error "Refresh Page": full page reload
- Destructive confirmation: bottom sheet with 2 buttons (cancel + destructive)
- Toast tap: navigate to related item
- Toast swipe right: dismiss
- Offline: read-only access, write actions queued

### iOS Variant
- **Pull-to-refresh:** UIRefreshControl spinner style (native iOS spinner)
- **Destructive sheet:** UISheetPresentationController with .medium detent
- **Haptic feedback:** light impact on pull-to-refresh trigger, success notification on save confirmation, error notification on failure
- **Toast position:** above tab bar (49pt + 34pt + 16pt = 99pt from bottom)
- **Empty state CTA:** standard UIButton, 44pt height

### Android Variant
- **Pull-to-refresh:** Material 3 pull indicator (circular progress, primary color, appears from top)
- **Destructive sheet:** Material 3 BottomSheetDialog with single drag stop
- **Haptic feedback:** CONFIRM vibration on save, REJECT on error (HapticFeedbackConstants)
- **Toast position:** Snackbar-style, above NavigationBar (80dp + 16dp = 96dp from bottom)
- **Empty state CTA:** Material 3 FilledButton, 48dp height

### States
- All state transitions: 200ms ease-out (skeleton to content, empty to populated, error to retry)
- Skeleton to content: crossfade (200ms)
- Empty to populated (first item added): fade-in (300ms)
- Error to retry to loading to content: sequential transitions (each 200ms)
- Offline to online: banner swap with crossfade (300ms)
- Pull-to-refresh: spinner visible during fetch, fades on complete

### Constraints
- Empty states ALWAYS suggest an action (never just "Nothing here")
- Loading skeletons must match exact layout of real content (no layout shift, CLS < 0.1)
- Error retry buttons always visible without scrolling
- Offline mode: never block reading, only block writing
- Destructive confirmations always use bottom sheet (never centered modal) on mobile
- All touch targets 44pt (iOS) / 48dp (Android) minimum
- No horizontal scrolling
- Use only the 28 color tokens defined above — no arbitrary colors

---

## Prompt M16: Profile & Settings

### Context
TripOS mobile profile and settings screen. Users manage personal information, notification preferences, theme (light/dark), and account settings. Accessed from the Profile tab on the Dashboard, or from avatar tap within a trip. Mobile uses a single-column grouped list layout (iOS Settings style). Adapts desktop Prompt 17 for thumb-friendly grouped sections.

### Design Tokens (Full 28-Token Canonical Set)

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

### Screen Viewport
- Width: 390px (iPhone 15 / Pixel 7 baseline)
- Height: variable (scrollable)
- Safe areas: respect notch/dynamic island (top), home indicator (bottom)

### Bottom Navigation (Dashboard Mode — 2 Tabs)
Profile tab active:
| Icon | Label | State |
|------|-------|-------|
| MapPin | My Trips | inactive |
| User | Profile | **active** |

### Layout & Content — Profile Header
- **Background**: muted bg extending 120px from top bar
- **Avatar**: 80px round, centered horizontally, overlapping background edge by 40px. Camera icon overlay (24px circle, primary bg, Camera icon white) on bottom-right of avatar. Tap opens image picker
- **Display name**: 20px semibold, centered, mt-3 below avatar
- **Email**: 14px, muted-foreground, centered, mt-1. "Verified" badge (success color, small Check icon) or "Verify" link (primary)

### Layout & Content — Grouped Settings List
iOS-Settings-style grouped sections. Each group: section header (12px, uppercase, muted-foreground, px-4, mt-6, mb-1) + card bg container (rounded-xl, mx-4) with rows inside:

**Group 1: "PROFILE"**
- Row: "Display Name" label (left) + current name (right, muted) + ChevronRight → opens edit sheet
- Row: "Email" label + email (right, muted, truncated) + "Verified" badge (success)
- Row: "Timezone" label + current timezone (right, muted) + ChevronRight → opens picker sheet

**Group 2: "APPEARANCE"**
- Row: "Theme" label + segmented control (right): System | Light | Dark. 3 segments, compact size
  - Selected segment: primary bg, primary-foreground text
  - Unselected: muted bg

**Group 3: "NOTIFICATIONS"**
- Row: "Email Notifications" label + Switch toggle (right). Switch: primary color when on, muted when off
- Row: "Push Notifications" label + Switch toggle
- Divider (1px, border color, mx-4)
- Sub-rows (indented 16px left, 14px text): individual notification categories
  - "Poll created or closing soon" + Switch
  - "Someone voted" + Switch
  - "New member joined" + Switch
  - "Activity changes" + Switch
  - "Expense added" + Switch
  - "Budget reminders" + Switch
- If parent toggle (Email or Push) is OFF: sub-rows are 50% opacity, switches disabled (non-interactive)

**Group 4: "CONNECTED ACCOUNTS"**
- Row: Google icon (20px) + "Google" label + status right-aligned:
  - Connected: "Connected" badge (success color, 12px) + "Disconnect" ghost text button
  - Not connected: "Connect" primary text button
- Row: Apple icon + "Apple" label + status (same pattern)

**Group 5: "ACCOUNT" (destructive zone)**
- Section separated by extra mt-8 spacing
- Row: "Change Password" + ChevronRight → opens password change sheet (only if email-based signup)
- Row: "Sign Out" (destructive color text, left-aligned) — no chevron, direct action
- Row: "Delete Account" (destructive color text, left-aligned) + ChevronRight → opens delete confirmation sheet

### Layout & Content — Edit Sheets (Bottom Sheets)

**Display Name Edit:**
- Drag handle + "Display Name" title (18px semibold) + "Save" primary text button (right)
- Text input with current name pre-filled, auto-focused, 48px height
- "Save" disabled until value changes

**Timezone Picker:**
- Drag handle + "Timezone" title + search bar (muted bg, Search icon, "Search timezones...")
- Scrollable list of timezones grouped by region
- Current selection: checkmark (primary) on right

**Change Password:**
- Drag handle + "Change Password" title
- Current password input (SecureField, 48px)
- New password input (48px)
- Confirm new password input (48px)
- "Update Password" primary button (full-width, 48px, mt-4)

**Delete Account Confirmation:**
- Drag handle + "Delete Account" title (destructive color)
- Warning text: "This will permanently delete your account and remove you from all trips. This action cannot be undone." (14px, muted)
- Text input: "Type DELETE to confirm" placeholder (48px)
- "Delete My Account" destructive button (full-width, 48px) — disabled until "DELETE" typed
- "Cancel" secondary button (full-width, 48px, below)

### Interactions
- Avatar tap: native image picker (accept JPEG/PNG/WebP, max 5MB). Shows upload spinner overlay on avatar during upload. Success: new image replaces old with crossfade (200ms)
- Settings rows with ChevronRight: tap opens relevant bottom sheet
- Switch toggles: immediate save (no explicit save button). Brief success flash (check icon replaces switch for 500ms)
- Theme segmented control: immediate application. Entire screen transitions with 200ms crossfade
- "Sign Out": confirmation bottom sheet ("Are you sure you want to sign out?" + "Sign Out" destructive + "Cancel" secondary)
- Unsaved changes in edit sheets: "Discard Changes?" confirmation if dismissing sheet with pending edits

### iOS Variant
- **Top bar:** 44pt + 59pt. "Settings" large title (or "Profile" if accessed from Dashboard tab)
- **Tab bar:** 49pt + 34pt. Profile: User filled, primary color
- **Font:** SF Pro. Section headers: SF Pro 12pt regular, uppercase, tracking 0.5pt
- **Grouped list:** UITableView grouped inset style. Card containers with rounded-xl corners
- **Sheets:** UISheetPresentationController with .medium detent for simple edits, .large for password/delete
- **Switches:** UISwitch (standard 51x31pt)
- **Theme control:** UISegmentedControl (standard iOS)

### Android Variant
- **Top bar:** 64dp + 24dp. "Settings" centered
- **Tab bar:** 80dp NavigationBar + 48dp. Profile: User outlined, primary-subtle pill
- **Font:** Roboto. Section headers: Roboto 12sp medium, uppercase, tracking 0.5sp
- **Grouped list:** Material 3 Card containers (rounded-xl, elevation 0, outlined)
- **Sheets:** Material 3 BottomSheetDialog, 2 drag stops (medium/large)
- **Switches:** Material 3 Switch (52x32dp)
- **Theme control:** Material 3 SegmentedButton (3 segments)

### States
- Profile loading: avatar skeleton (80px circle) + 2 text line skeletons + 3 group skeletons
- Avatar uploading: circular progress overlay on avatar (primary color spinner)
- Avatar error: brief destructive toast "Couldn't upload image. Try again."
- Save button: disabled (no changes) → enabled (changes detected) → loading (spinner, 24px) → success (checkmark 1s) → disabled
- Delete flow: button → sheet → typing "DELETE" → destructive button enables → loading → redirect to auth
- Sign out: confirmation sheet → loading spinner → redirect to auth
- Switch toggle: tapping triggers immediate save with brief check flash
- Theme change: 200ms crossfade to new mode (all tokens swap)
- Unsaved warning: sheet with "Discard Changes?" + "Keep Editing" primary + "Discard" destructive

### Constraints
- All form inputs 48px minimum height on mobile
- Avatar: max 5MB, JPEG/PNG/WebP only. Show file size error before upload attempt
- Switch toggles save immediately (no explicit save button needed)
- Theme changes apply instantly (no save required)
- Sign out and delete always require confirmation (2-step)
- All touch targets 44pt (iOS) / 48dp (Android) minimum
- Grouped list: mx-4 margins, stacked vertically
- No horizontal scrolling
- Use only the 28 color tokens defined above — no arbitrary colors

---

## Dependency Graph & Desktop Cross-Reference

### Build Order Dependencies

```
M1  Foundation (Nav Shell, Tab Bar, Bottom Sheets)
 ├── M2  Authentication
 ├── M3  Dashboard — My Trips
 │    └── M16 Profile & Settings
 └── M4  Trip Overview
      ├── M5  Members & Invitations
      ├── M14 Activity Feed & Notifications
      ├── M6  Itinerary — Day Cards & Swipe Actions
      │    └── M7  Map View — Full Screen
      ├── M8  Voting — Poll List & Create
      │    ├── M9  Voting — Cast Vote (All Types)
      │    └── M10 Voting — Poll Results
      ├── M11 Blind Budgeting — Input & Explainer
      │    └── M12 Blind Budgeting — Group Display
      └── M13 Expense Management
M15 States & Feedback — Mobile (applies to ALL screens, build anytime after M1)
```

### Mobile-to-Desktop Cross-Reference

| Mobile Prompt | Desktop Prompt | Relationship |
|---------------|---------------|--------------|
| M1 — Foundation | D1 — Foundation | Rewrite: bottom tabs replace sidebar, bottom sheets replace modals |
| M2 — Authentication | D2 — Authentication | Adapt: single-column layout, native keyboard handling |
| M3 — Dashboard | D3 — Dashboard | Adapt: single-column card list, pull-to-refresh added |
| M4 — Trip Overview | D4 — Trip Overview | Adapt: stacked sections, quick stats grid 2x2 |
| M5 — Members & Invitations | D5 — Members & Invitations | Adapt: full-width list, share sheet replaces copy button |
| M6 — Itinerary | D6 — Itinerary Day Timeline | Rewrite: swipe actions, long-press reorder, single-column |
| M7 — Map View | D7 — Itinerary Map View | Rewrite: full-screen map, bottom sheet for details |
| M8 — Poll List & Create | D8 — Voting Poll List | Adapt: single-column cards, bottom sheet for create |
| M9 — Cast Vote | D9 — Voting Cast Vote | Rewrite: full-width options, thumb-zone vote buttons |
| M10 — Poll Results | D10 — Voting Results | Adapt: stacked charts, simplified round display |
| M11 — Blind Budget Input | D11 — Blind Budgeting Input | Rewrite: bottom sheet explainer, numeric keyboard |
| M12 — Blind Budget Group | D12 — Blind Budgeting Group | Adapt: stacked cards, no hover tooltips |
| M13 — Expenses | D13 — Expense Management | Adapt: bottom sheet add form, swipe-to-delete |
| M14 — Activity Feed | D14 — Activity Feed & Notifications | Rewrite: full-screen notification sheet, bottom toasts |
| M15 — States & Feedback | D16 — States & Feedback | Rewrite: pull-to-refresh, bottom sheet confirmations, mobile toast positioning |
| M16 — Profile & Settings | D17 — Profile & Settings | Rewrite: grouped list (iOS Settings style), bottom sheet edits |

### Prompts Not Adapted for Mobile
- **D15 — Marketing Landing Page**: Responsive desktop page, not a separate mobile app screen
- **D18-D19 — Desktop-specific patterns**: Sidebar, hover states, keyboard shortcuts

---

**End of Mobile Wireframe Prompts**
