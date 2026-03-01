# Prompt for Google Gemini: Generate TripFlow Blind Budgeting Design Directions

**Instructions:** Copy everything below this line and paste it into Google Gemini (gemini.google.com)

---

## Task

Generate a comprehensive HTML design directions visualizer for TripFlow's blind budgeting feature. Create 6 distinct design direction variations that explore different approaches to the budget entry experience.

## Project Context

**Product:** TripFlow - Privacy-first travel planning platform
**Feature:** Blind Budgeting - Private budget entry that enables group trip planning without budget shame
**Core Innovation:** Each traveler privately sets their maximum budget (encrypted, RLS-protected). System calculates the "group affordable limit" (minimum of all budgets) without revealing whose budget it is.

**Target Users:**
- **Primary:** The Anxious Organizer (28-38, Millennial, $50-90K) - Fears being labeled "rich asshole" OR excluding broke friends
- **Secondary:** The Silent Struggler (25-35, Gen Z/Millennial, $30-60K) - Can't afford suggested budgets but won't speak up
- **Tertiary:** The Oblivious Suggester (30-45, $100K+) - Would accommodate lower budgets if made aware

**Validation:** 22/25 GREEN LIGHT score, 150+ research sources, 75% avoid budget conversations, 52% go into debt rather than reveal constraints

## Emotional Journey (Step 4)

**Goal:** Vulnerability → Relief → Inclusion

**Key Emotional States:**
1. **Vulnerability** - Users feel exposed when entering honest budget constraints
2. **Relief** - Privacy indicators and reassurance create safety
3. **Inclusion** - Group max reveal shows everyone can participate

**Success Criteria:**
- Budget Completion Rate: >85%
- Budget Honesty Proxy: <15% variance from actual budget
- Time to First Budget Entry: <2 minutes from invite
- Repeat Usage Rate: >60% for second trip

## UX Patterns to Apply (Step 5)

**From Research (Signal, 1Password, Glassdoor, Blind, Venmo):**

1. **Lock Icon + Badge** (Signal/1Password pattern)
   - Visual: Small lock icon + "Private" badge near input
   - Purpose: Persistent reassurance without paranoia

2. **Progressive Disclosure** (3-tier explanation strategy)
   - Tier 1: Tooltip (< 10 words)
   - Tier 2: Visual explainer (diagram/illustration)
   - Tier 3: FAQ link (comprehensive)

3. **Aggregate Range Display** (Glassdoor pattern)
   - Visual: "$400-800/night" range (not individual budgets)
   - Purpose: Show outcome without revealing data

4. **Activity Without Attribution** (Blind pattern)
   - Visual: "5 of 8 budgets set" (no names)
   - Purpose: Social proof without individual exposure

5. **Visual Comparison Without Specifics** (Airbnb pattern)
   - Visual: Progress bars, participation indicators
   - Purpose: Encourage completion through momentum

## Visual Foundation (Step 8)

**Design System:** shadcn/ui + Tailwind CSS + Radix UI

**Color System:**
- **Privacy State Colors:**
  - Private/Protected: `#737373` (text-muted-foreground) + `#f5f5f5` (bg-muted) - soft gray, non-threatening
  - Active Input: `#3b82f6` (border-primary) - brand color, trustworthy
  - Success: `#16a34a` (text-green-600) + `#f0fdf4` (bg-green-50) - calm green
  - Participation: `#525252` (text-foreground) + `#f4f4f5` (bg-secondary) - neutral

**Typography:**
- **Typeface:** System UI stack (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif)
- **Budget Input:** 30px (text-3xl), font-weight 600 (semibold)
- **"Private" Badge:** 12px (text-xs), font-weight 500 (medium)
- **Body Text:** 16px (text-base), font-weight 400 (normal)
- **Line Heights:** 1.625 (relaxed) for body, 1.25 (tight) for headings

**Spacing:**
- **Base Unit:** 4px (Tailwind scale)
- **Input Padding:** 16px (p-4) - generous tap target
- **Section Spacing:** 32px (space-y-8) - breathing room reduces anxiety
- **Card Padding:** 24px (p-6) - comfortable content area
- **Minimum Touch Target:** 44px (mobile accessibility)

**Accessibility:**
- WCAG 2.1 AA compliance (4.5:1 text contrast, 3:1 UI contrast)
- Privacy indicators use color + icon (not color alone)
- Dark mode support with equivalent contrast ratios

## Core Experience Mechanics (Step 7)

**The Defining Interaction:** Setting a Private Budget Cap Without Fear

**4-Stage Flow:**

**1. Initiation:**
- Trigger: Trip invitation received
- Entry Point: "Set Your Budget (Private)" CTA
- Pre-Interaction Reassurance: Lock icon, "Private" badge visible

**2. Interaction:**
- Budget Input: Numeric keypad, currency auto-detected
- Visual State: Lock icon + badge + input field
- Optional Explanation: 3-tier progressive disclosure
- Save Budget: Loading state + "Saving privately..."

**3. Feedback:**
- Immediate: Checkmark animation + "Budget saved privately" toast + haptic
- Secondary: Participation count updates, avatar checkmarks
- Error Handling: "Your budget is still private" (reassurance first)

**4. Completion:**
- Success State: Checkmark persists, input locks, "Edit" button appears
- What's Next: Different CTAs based on participation level:
  - <50%: "Invite more friends to unlock group budget"
  - 50-80%: "View your group budget" (group max revealed)
  - 100%: "Everyone's in! Find hotels" (celebration moment)

## Design Directions to Generate

Create **6 distinct design directions** in a single HTML file. Each direction should be a complete, interactive mockup exploring different balances of:

### Direction 1: Minimal Trust (Signal-inspired)
- **Privacy Emphasis:** Subtle (small lock icon, muted badge)
- **Explainability:** Minimal (single-line helper text)
- **Social Proof:** None (focus on individual)
- **Visual Weight:** Airy (maximum whitespace)
- **Tone:** Professional, understated
- **Layout:** Centered input, minimal UI elements

### Direction 2: Progressive Explainer (Onboarding-first)
- **Privacy Emphasis:** Moderate (lock icon in context)
- **Explainability:** High ("How it works" section, 3-step explainer)
- **Social Proof:** Low (education over gamification)
- **Visual Weight:** Structured (clear sections)
- **Tone:** Educational, confidence-building
- **Layout:** Explainer → Input → CTA

### Direction 3: Social Proof Heavy (Airbnb-inspired)
- **Privacy Emphasis:** Moderate (privacy balanced with participation)
- **Explainability:** Low (action over education)
- **Social Proof:** High (avatars, progress bars, activity feed)
- **Visual Weight:** Dense (lots of participation indicators)
- **Tone:** Motivational, community-focused
- **Layout:** Participant avatars → Progress → Input

### Direction 4: Privacy Fortress (1Password-inspired)
- **Privacy Emphasis:** Maximum (bold lock icons, encryption messaging)
- **Explainability:** Moderate (security-focused copy)
- **Social Proof:** None (individual security focus)
- **Visual Weight:** Bold (strong visual security)
- **Tone:** Serious, trust-building
- **Layout:** Dark theme, encryption badges, fortress aesthetic

### Direction 5: Friendly & Casual (Venmo-inspired)
- **Privacy Emphasis:** Moderate (friendly privacy messaging)
- **Explainability:** Moderate (casual explanations)
- **Social Proof:** Low (individual focus)
- **Visual Weight:** Soft (rounded corners, gentle colors)
- **Tone:** Casual, approachable (emojis, friendly copy)
- **Layout:** Emoji header → Friendly card → Conversational input

### Direction 6: Data Dashboard (Glassdoor-inspired)
- **Privacy Emphasis:** Moderate (privacy in context of data)
- **Explainability:** High (visual data transparency)
- **Social Proof:** High (range visualization, participation stats)
- **Visual Weight:** Dense (charts, graphs, analytics)
- **Tone:** Analytical, data-forward
- **Layout:** Stats grid → Range visualization → Input

## HTML Output Requirements

**File Structure:**
- Single HTML file with inline CSS (no external dependencies)
- Responsive design (mobile-first, works on all screen sizes)
- Clean, semantic HTML5
- Modern CSS (flexbox, grid, CSS variables)

**Visual Requirements:**
- Each direction in a card layout (side-by-side on desktop, stacked on mobile)
- Interactive hover states
- Realistic input fields (placeholder text, focus states)
- Complete UI examples (not wireframes - use real colors, typography, spacing)
- Include all UX patterns mentioned (lock icons, badges, progress bars, etc.)

**Content Requirements:**
- Direction title and subtitle for each variation
- Tags showing key characteristics (e.g., "Subtle Privacy", "High Explanation")
- Complete mockup showing the budget entry experience
- Evaluation criteria section at bottom (6 criteria: Privacy Emphasis, Explainability, Social Proof, Visual Weight, Tone, Trust Building)

**Design Tokens to Use:**
- Colors: Use hex values from the color system above
- Typography: System font stack as specified
- Spacing: 4px base unit, use multiples (8px, 12px, 16px, 24px, 32px, 48px)
- Border Radius: 8px (standard), 12px (cards), 20px (friendly)

## Expected Output

Generate a complete, production-quality HTML file that:
1. Shows all 6 design directions in a grid layout
2. Uses the visual foundation (colors, typography, spacing) specified above
3. Demonstrates the 4-stage interaction flow for budget entry
4. Includes realistic content (not lorem ipsum)
5. Has interactive elements (hover states, focus states)
6. Works on mobile and desktop
7. Includes a comparison footer with evaluation criteria

**File should be ~400-600 lines of well-structured HTML + CSS.**

The goal is to help stakeholders visually compare different approaches to the budget entry experience and make an informed design direction decision.

---

**After Gemini generates the HTML, save it as:** `ux-design-directions-gemini.html`