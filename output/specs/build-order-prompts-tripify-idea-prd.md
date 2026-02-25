# Build-Order Prompts: Tripify - AI-Powered Travel Planner

## Overview

This document contains sequential, self-contained prompts for building Tripify, an iOS native travel planning app with AI-powered personalization, group collaboration, and expense tracking. Prompts are ordered by dependency: foundations → layout → components → features → polish.

**Platform**: iOS Native (SwiftUI)
**Design System**: Tripify Travel Planner Design System (Green #34C759, 4px grid, WCAG 2.1 AA)
**Total Prompts**: 12

---

## Build Sequence

1. **Foundation - Design Tokens** - Color, typography, spacing, and shared design system
2. **Layout Shell - Navigation** - Tab bar, headers, and screen container structure
3. **Core Components - Cards & Buttons** - Trip card, activity timeline, vote buttons, budget bar
4. **Onboarding Flow** - Welcome + 3-screen preference capture flow
5. **Trip Dashboard** - Home screen with trip list and FAB
6. **Create Trip Flow** - Trip creation with AI itinerary generation
7. **Trip Detail / Itinerary View** - Day-by-day timeline with activities
8. **Activity Detail Modal** - Activity info, voting, and booking integration
9. **Budget & Expenses Tab** - Expense tracking and settlement
10. **Discovery Screen** - Destination browsing with AI recommendations
11. **Settings & Profile** - User preferences and account management
12. **Polish - Offline Mode & Animations** - Offline indicators, haptics, and transitions

---

## Prompt 1: Foundation - Design Tokens

### Context

This is the foundation layer for Tripify. All subsequent components and screens will reference these design tokens. This prompt establishes the visual language of the app.

### Requirements

**Colors (Semantic)**
- Primary action: `#34C759` (green) - main CTAs, selected states, confirmations
- Secondary action: `#FFFFFF` (white) - secondary buttons, card backgrounds
- Edit/secondary: `#5AC8FA` (teal) - edit actions, secondary highlights
- Destructive: `#FF3B30` (red) - delete, error states
- Text primary: `#000000` (black)
- Text secondary: `#8E8E93` (gray)
- Text tertiary: `#AEAEB2` (light gray)
- Text on primary: `#FFFFFF` (white)
- Background primary: `#FFFFFF` (white)
- Background secondary: `#F9FAFB` (gray-50)
- Border default: `#E5E5EA` (gray-200)
- Border selected: `#34C759` (green)

**Typography**
- Font family: SF Pro Display (iOS system font)
- Display Large: 32px, Heavy (800)
- Heading XL: 28px, Semibold (600)
- Heading LG: 24px, Semibold (600)
- Heading MD: 20px, Semibold (600)
- Heading SM: 18px, Semibold (600)
- Body LG: 17px, Regular (400)
- Body MD: 16px, Regular (400)
- Body SM: 14px, Regular (400)
- Caption: 12px, Regular (400)
- Micro: 10px, Regular (400)

**Spacing (4px grid)**
- Scale: 0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 64px
- Screen margin: 20px
- Card padding: 16px
- Section gap: 24px
- Content gap: 8px
- Button padding: 24px horizontal, 14px vertical

**Border Radius**
- Card: 12px
- Button: 24px (full pill)
- Modal: 16px
- Input: 8px
- Chip: 20px

**Shadows**
- Card: `0 2px 8px rgba(0, 0, 0, 0.08)`
- Modal: `0 8px 32px rgba(0, 0, 0, 0.2)`
- Button: `0 2px 4px rgba(52, 199, 89, 0.2)`
- Small: `0 1px 2px rgba(0, 0, 0, 0.05)`

### States

Not applicable - these are static tokens

### Interactions

Not applicable - these are static tokens

### Constraints

- Output as a Swift file or SwiftUI constants
- Include ALL tokens listed above
- Do not include component definitions (those come in later prompts)
- Follow iOS naming conventions (camelCase for values)

---

## Prompt 2: Layout Shell - Navigation Structure

### Context

This is the app shell that contains all screens. It provides the navigation structure (tab bar) and common screen elements (headers, status bar handling).

### Requirements

**Tab Bar (Bottom Navigation)**
- Height: 56px
- Background: `#FFFFFF`
- Border top: 1px solid `#F5F5F5` (divider color)
- Four tabs:
  1. "My Trips" (home icon) - default active
  2. "Discover" (compass icon)
  3. "Budget" (wallet icon)
  4. "Profile" (person icon)
- Active tab color: `#34C759` (primary green)
- Inactive tab color: `#8E8E93` (secondary gray)
- Icon size: 24px
- Label font: Caption (12px)

**Top Bar (Navigation Header)**
- Height: 56px
- Background: Transparent (shows content behind)
- Content: Screen title on left, optional action icon on right
- Title font: Heading LG (24px, Semibold)
- Title color: `#000000`
- Safe area handling: Respect iPhone notch/status bar

**Screen Container**
- Background: `#FFFFFF` (primary) or `#F9FAFB` (secondary)
- Screen margin: 20px on all sides
- Content respects safe areas (notch, home indicator)

**FAB (Floating Action Button)**
- Position: Bottom right, 20px from edge, above tab bar
- Size: 56px circle
- Background: `#34C759` (primary green)
- Icon: Plus sign, 24px, white
- Shadow: Button shadow (`0 2px 4px rgba(52, 199, 89, 0.2)`)
- Minimum tap target: 44px (actual button is 56px)

### States

**Tab Bar**
- Default: All tabs visible, one active
- Active: Icon and label in green
- Inactive: Icon and label in gray

**Top Bar**
- Default: Transparent with title
- Large title mode: Title transitions to large bold on scroll (iOS standard)

**FAB**
- Default: Full opacity
- Pressed: Slightly reduced opacity (0.8)
- Hidden: Off-screen (animate down)

### Interactions

- Tab bar: Tap to switch screens, active tab highlights
- FAB: Tap to trigger primary action (create new trip)
- Back navigation: Standard iOS back button in left side of top bar

### Constraints

- This is the navigation shell only - do NOT include screen content
- Follow iOS Human Interface Guidelines for tab bar and navigation
- Support iPhone and iPad layouts (adaptive spacing)
- Do NOT implement tab switching logic - just visual states

---

## Prompt 3: Core Components - Cards & Interactive Elements

### Context

These are reusable components used throughout the app: trip cards, activity timeline items, voting controls, and budget progress bars. They will be composed into screens in later prompts.

### Requirements

**Trip Card**
- Width: Full container width
- Height: Auto (approximately 180px with cover image)
- Background: `#FFFFFF`, border radius: 12px, shadow: card shadow
- Cover image: 16:9 aspect ratio, border-radius-top: 12px
- Content padding: 16px
- Content structure:
  - Trip name: Heading MD (20px, Semibold), `#000000`
  - Dates & destination: Body MD (16px), `#8E8E93`
  - Budget progress bar: 8px height, shows spent vs. total
  - Collaborator avatars: Overlapping circles, 32px diameter, show max 4 + "+N"
  - Status badge: Pill shape, caption (12px), top right corner
- Gap between elements: 8px

**Activity Timeline Item**
- Layout: Two-column (time label left, activity card right)
- Time label: Width 48px, right-aligned, Body SM (14px), `#8E8E93`
- Connector: Vertical line, 2px width, `#E5E5EA` color, connects activities
- Activity card:
  - Background: `#FFFFFF`, border-radius: 12px, subtle shadow
  - Padding: 12px
  - Activity name: Heading SM (18px, Semibold)
  - Type badge: Pill, Caption (12px), `#F9FAFB` background
  - Duration & location: Body SM (14px), `#8E8E93`
  - Vote buttons: Right-aligned, thumbs up/down icons
  - AI badge: Small pill, "AI" text, subtle teal color `#5AC8FA`

**Vote Buttons**
- Size: 44px tap target each
- Upvote: Thumbs up icon
- Downvote: Thumbs down icon
- States:
  - Inactive: `#AEAEB2` (gray-500)
  - Upvote active: `#34C759` (green)
  - Downvote active: `#FF3B30` (red)
- Vote count: Small number between buttons, Body SM

**Budget Progress Bar**
- Height: 8px
- Border radius: 4px (full pill)
- Track: `#F5F5F5` (gray-200)
- Fill colors:
  - Under 80%: `#34C759` (green)
  - 80-100%: Gradient green to yellow
  - Over 100%: `#FF3B30` (red)
- Label above: "Spent $X of $Y" (Body MD, `#8E8E93`)

**Primary Button (Full Width)**
- Height: 48px
- Background: `#34C759`
- Text: `#FFFFFF`, Body LG (17px), Semibold
- Border radius: 24px (full pill)
- Shadow: `0 2px 4px rgba(52, 199, 89, 0.2)`
- Padding: 24px horizontal

**Secondary Button**
- Height: 48px
- Background: `#FFFFFF`
- Text: `#000000`, Body LG (17px), Semibold
- Border: 1px solid `#E5E5EA`
- Border radius: 24px

### States

**Trip Card**
- Default: White background, subtle shadow
- Hover (iOS equivalent - touch highlight): Slightly darker shadow
- Selected: Green border (2px, `#34C759`)

**Activity Card**
- Default: White background
- Selected: Green border (2px)
- Dragging: Reduced opacity (0.7)

**Vote Buttons**
- Default: Gray, no fill
- Active (up): Green background, white icon
- Active (down): Red background, white icon

**Budget Bar**
- Empty: No fill, track only
- Partial: Fill to percentage
- Full/Over: Complete fill with appropriate color

### Interactions

- Trip card: Tap to open trip detail, long-press for quick actions menu
- Activity card: Tap to open detail, drag to reorder (when in edit mode)
- Vote buttons: Tap to toggle vote state
- Budget bar: Tap to open expense breakdown

### Constraints

- These are standalone components - do NOT include them in a screen layout
- Use exact measurements provided
- Support Dynamic Type for accessibility
- Include tap targets minimum 44x44px

---

## Prompt 4: Onboarding Flow

### Context

First-time user experience for Tripify. A 4-screen flow (welcome + 3 preference screens) that captures minimal user preferences needed for AI recommendations. Users can skip and complete preferences later.

### Requirements

**Screen 1: Welcome**
- Layout: Centered content, full-screen illustration area at top
- Hero illustration: Travel-themed (use placeholder image or icon)
- Headline: "Plan trips in minutes, not hours" - Display Large (32px, Heavy)
- Subhead: "AI-powered planning for solo and group travelers" - Body LG (17px), `#8E8E93`
- Spacing: 32px between illustration and text, 24px between text elements
- Primary CTA: "Get Started" button (full width, 48px height, green background)
- Secondary CTA: "I already have an account" text link (green, Body MD)
- Bottom padding: 40px above button

**Screen 2: Travel Preferences**
- Header: "What do you love?" - Heading XL
- Instruction: "Select at least 3 interests" - Body MD, `#8E8E93`
- Interest tags: Horizontal scrolling chips, 40px height, 20px padding horizontal
  - Tags: Beaches, Mountains, Cities, Food & Drink, Culture, Adventure, Nightlife, Nature, History, Art, Relaxation
  - Unselected: White background, gray border, Body SM text
  - Selected: Green background (`#34C759`), white text
- Minimum selection: 3 (button disabled until met)
- Continue button: Full width at bottom, "Continue" text
- Spacing: 24px between sections

**Screen 3: Budget & Style**
- Header: "How do you travel?" - Heading XL
- Budget range slider:
  - Range: $500 - $10,000+
  - Steps: 500, 1000, 2500, 5000, 7500, 10000+
  - Display selected value in Heading MD above slider
  - Slider track: 8px height, gray with green fill
  - Thumb: 24px circle, green shadow
- Travel style cards (single select):
  - Options: "Relaxed" (1-2 activities/day), "Balanced" (3-4/day), "Packed" (5+/day)
  - Card size: Minimum 72px height, full width
  - Unselected: White background, gray border
  - Selected: Green border (2px), green checkmark icon
- Primary CTA: "Start Planning" button (full width, enabled immediately)

**Screen 4: AI Generation (Transition)**
- Layout: Centered content with animation area
- Animation: AI-branded loading animation (use spinner or custom animation)
- Progress text: "Planning Day 1 of 5..." - Body LG
- Tips carousel: Rotating travel tips, Body MD, `#8E8E93`
- Cancel option: "Customize manually instead" text link - Body MD, secondary color

### States

**Welcome Screen**
- Default: All elements visible
- Button states: Default, pressed (opacity 0.8), disabled (not applicable)

**Preferences Screen**
- Default: All tags unselected, button disabled
- Progress: Tags selected, counter shows "X of 3 minimum"
- Complete: 3+ selected, button enabled

**Budget Screen**
- Default: Slider at mid-range, no style selected
- Adjusting: Slider thumb dragging, value updates live
- Complete: Style selected, button enabled

**AI Screen**
- Generating: Progress animation active, day counter increments
- Complete: Transitions to trip dashboard

### Interactions

- Welcome: Tap "Get Started" → advance to preferences
- Preferences: Tap tags to toggle selection (multi-select), tap "Continue" → advance to budget
- Budget: Drag slider to adjust budget, tap style card to select (single-select), tap "Start Planning" → show AI screen
- AI Screen: Tap "Customize manually" → skip to manual planning mode

### Constraints

- Each screen should be self-contained (full screen)
- Support swipe-back gesture for iOS
- Skip available on each screen except AI generation
- Progress not indicated (each screen is a step, no progress bar)
- Use exact measurements and colors from design tokens
- Keyboard doesn't appear on any screen (no text input)

---

## Prompt 5: Trip Dashboard (Home Screen)

### Context

The home screen of Tripify. Displays user's trips organized by status (upcoming, past, draft) with a FAB to create new trips. This is the primary navigation hub.

### Requirements

**Layout Structure**
- Top bar: "My Trips" title (Heading LG), profile avatar (top right, 32px circle)
- Tabs: Horizontal scroll below top bar
  - Tab items: "Upcoming", "Past", "Draft"
  - Active tab: Green text, green underline indicator (4px height)
  - Inactive: Gray text, no underline
  - Font: Body MD (16px), Semibold
  - Padding: 12px horizontal
- Content area: Vertical scroll list of trip cards
- FAB: Bottom right, "+ New Trip", 56px circle, green background, white plus icon

**Trip Cards (from Prompt 3)**
- Vertical list, 16px gap between cards
- Each card shows:
  - Cover image (16:9 aspect ratio)
  - Trip name (Heading MD, Semibold)
  - Dates & destination (Body MD, gray)
  - Collaborator avatars (overlapping circles, max 4 visible + "+N")
  - Status badge ("In planning", "Confirmed", "Completed")
  - Budget progress bar (thin, below dates)
- Tap behavior: Open trip detail

**Empty State**
- Illustration: Empty suitcase or map icon (64x64px, gray)
- Headline: "No trips yet" (Heading LG)
- Body: "Your next adventure awaits" (Body MD, gray)
- CTA: "Plan your first trip" button (secondary style, 48px height)
- Centered vertically and horizontally in content area

**Loading State**
- Skeleton cards: Gray rectangles with shimmer animation
- Show 3-4 skeleton cards

### States

**Empty (No Trips)**
- Zero trips across all tabs
- Show empty state illustration and CTA

**Loading**
- Skeleton cards in content area
- Tabs and FAB remain interactive

**Success (Has Trips)**
- Trip cards visible in appropriate tabs
- FAB visible and interactive

**Error (Failed to Load)**
- Error illustration
- Message: "Couldn't load your trips" (Body MD)
- "Retry" button (secondary style)

### Interactions

- Tab tap: Switch between upcoming/past/draft views
- Trip card tap: Navigate to trip detail screen
- FAB tap: Navigate to create trip flow
- Pull to refresh: Reload trip list
- Profile avatar tap: Navigate to settings/profile

### Constraints

- Use trip card component from Prompt 3
- Use tab bar from Prompt 2
- Support infinite scroll (if many trips)
- Respect safe areas
- Trip cards should animate in on load (staggered fade-in)
- Do NOT include trip detail screen (that's a separate prompt)

---

## Prompt 6: Create Trip Flow

### Context

The trip creation experience. Users enter trip basics, invite collaborators, and then AI generates an initial itinerary. This is a multi-screen flow.

### Requirements

**Screen 1: Trip Basics**
- Header: "New Trip" with "Cancel" button (left, text) and "Continue" (right, text)
- Form fields:
  - Trip name: Text input, placeholder "Japan Adventure 2026", Body LG
  - Destination: Search input with autocomplete, placeholder "Where to?", Body LG
    - Autocomplete dropdown: Destination cards with image, name, "AI match score"
  - Date range: Date picker, two inputs (start date, end date)
    - Format: "Mon, Aug 27" (Body MD)
  - Cover image: Optional, shows destination-based default, tap to change
- Spacing: 24px between form sections
- Bottom: "Continue" button (full width, primary style)

**Screen 2: Invite Collaborators**
- Header: "Who's joining?" with "Back" and "Create trip" buttons
- Email input: Multi-entry with chips
  - As user types email, show suggestions from contacts
  - On enter/return, create chip with email + remove button (X)
- Alternative: "Share link" toggle
  - When on: Shows share sheet with link
  - Label: "Anyone with link can view" (Body SM, gray)
- Permission note: "You'll be the trip organizer" (Body SM, gray)
- Illustration: People/collaboration graphic (optional)
- Bottom: "Create trip" button (full width, primary style)

**Screen 3: AI Itinerary Generation**
- Full-screen overlay with semi-transparent backdrop
- Center card: White background, rounded corners (16px), 24px padding
- Content:
  - AI-branded illustration or animation
  - Headline: "Crafting your itinerary..." (Heading LG)
  - Progress indicator: "Planning Day 3 of 5" (Body MD, green)
  - Progress bar: Horizontal, 8px height, animated fill
  - Tips carousel: Rotating travel tips (Body SM, gray)
  - Cancel option: "Customize manually instead" (text link, Body MD)

**Screen 4: AI Review (First Trip View)**
- Transition from generation: Show generated itinerary
- "Your itinerary is ready!" toast notification (top, dismisses after 3s)
- First time tooltip: "Tap any activity to see details or make changes"
- Dismissible onboarding tooltip pointing to activity card

### States

**Screen 1 (Basics)**
- Default: All fields empty, Continue button disabled
- Valid: All fields filled, Continue enabled
- Autocomplete open: Destination dropdown visible below input

**Screen 2 (Invite)**
- Default: No emails entered
- With emails: Chips visible for each email
- Share link on: Toggle green, link visible

**Screen 3 (AI Generation)**
- Generating: Animation active, progress counter increments
- Complete: Transitions to itinerary view
- Cancelled: Returns to invite screen or manual mode

**Screen 4 (Review)**
- First view: Tooltip visible
- Tooltip dismissed: Normal itinerary view (see Prompt 7)

### Interactions

**Basics Screen**
- Trip name: Tap to focus, keyboard appears, type to enter
- Destination: Tap to show autocomplete, tap suggestion to select
- Date range: Tap to show iOS date picker
- Cover image: Tap to open photo picker (not implemented, just button state)
- Continue: Tap to advance to invite screen (only when valid)

**Invite Screen**
- Email input: Type and press return to create chip
- Chip X: Tap to remove email
- Share link toggle: Tap to toggle, shows share sheet when on
- Create trip: Tap to trigger AI generation

**AI Screen**
- Customizing manually: Tap to skip AI and go to blank itinerary

### Constraints

- This is a flow, not individual screens - maintain navigation state
- Use text inputs from design system (not custom components)
- Date picker is iOS native (UIDatePicker)
- Share sheet is iOS native (UIActivityViewController)
- AI generation is simulated for now (no real AI integration)
- Transitions between screens should be animated (iOS standard push)

---

## Prompt 7: Trip Detail / Itinerary View

### Context

The main trip planning interface. Shows day-by-day itinerary with activities in a timeline. Users can view, edit, and reorder activities. This is the core planning screen.

### Requirements

**Layout Structure**
- Header: Trip cover image (parallax effect on scroll), trip name overlay
- Day tabs: Horizontal scroll below header
  - Tab format: "Day 1", "Day 2", etc.
  - Active tab: Green background, white text, 40px height
  - Inactive: Gray background, black text
  - Font: Body MD (16px), Semibold
  - Border radius: 20px (full pill)
- Content: Activity timeline (from Prompt 3)
- Bottom bar: "Add activity" button (left), "Optimize route" (center), "View map" (right)

**Activity Timeline**
- Time labels on left (48px width, right-aligned)
- Vertical connector line (2px, gray)
- Activity cards on right (from Prompt 3)
- Gap between activities: 24px
- Last item has no connector extending below

**Activity Card (in Timeline)**
- Name: Heading SM (18px, Semibold)
- Type badge: Pill, 12px height, "Food", "Sightseeing", etc.
- Duration & location: Body SM (14px), gray
- Vote controls: Thumbs up/down icons with count
- AI badge: "AI" pill, subtle teal
- Booking status: Small badge "Booked" or "Not booked"

**Empty State (No Activities)**
- Illustration: Empty calendar or list
- Headline: "No activities planned"
- Body: "Let AI plan your day or add activities manually"
- Buttons: "Add activities" (primary), "Let AI plan" (secondary)

**Edit Mode**
- Triggered by long-press on activity or "Edit" button
- Drag handles appear on each activity card (three horizontal lines)
- Activities can be reordered via drag-drop
- Delete button appears on each card (red trash icon)
- Done button appears in top bar

### States

**Default**
- Timeline visible with activities
- Day tabs scrollable
- Bottom bar visible

**Empty (No Activities)**
- Empty state visible
- Bottom bar still available

**Loading**
- Skeleton cards in timeline
- Day tabs and header visible

**Edit Mode**
- Drag handles visible
- Delete buttons visible
- Bottom bar replaced with "Done" button

**Reordering**
- Dragged activity: Reduced opacity, elevated shadow
- Drop indicator: Line showing where activity will land

### Interactions

- Day tab tap: Switch to that day's activities
- Activity card tap: Open activity detail modal (Prompt 8)
- Activity card long-press: Enter edit mode
- Activity drag: Reorder within timeline (edit mode only)
- Activity swipe: Swipe left to delete, swipe right to duplicate
- "Add activity": Open activity search/add modal
- "Optimize route": Show route optimization view (not implemented, show toast)
- "View map": Show map view with activities plotted (not implemented, show toast)

### Constraints

- Use activity timeline component from Prompt 3
- Support vertical scroll with parallax header
- Pull to refresh available
- Day tabs should loop (scroll past last, goes to first)
- Minimum 3 activities before optimization is available
- Edit mode prevents day tab switching

---

## Prompt 8: Activity Detail Modal

### Context

A modal showing full details for a specific activity. Users can view all information, vote, see collaborator input, and access booking links.

### Requirements

**Modal Layout**
- Half-sheet modal (slides up from bottom, covers ~70% of screen)
- Backdrop: Semi-transparent black (50% opacity)
- Handle bar: 32px wide, 4px tall, centered, gray
- Close button: Top right, X icon, 44px tap target

**Content Structure**
- Hero image: Full width, 200px height (if available), rounded top corners
- Activity name: Heading XL (28px, Semibold), 16px left/right padding
- Type & duration badges: Row below name, 8px gap
- Rating: Stars + review count (Body MD, gray)
- Description: Body LG (16px, Regular), 16px padding, maximum 3 lines with "Read more"
- Cost estimate: Heading MD (20px), green if in budget, red if over
- Booking section:
  - "Book" button: Primary style, full width, external link indicator (arrow icon)
  - Booking status toggle: "Not booked" → "Booked" → "Cancelled" (segmented control)
  - Confirmation notes: Text area (collapsible)
- Collaborator votes:
  - Section header: "Group votes" (Heading SM)
  - Avatars with vote indicators (thumbs up/down badges)
  - Vote count: "3 upvoted, 1 downvoted" (Body SM, gray)
- Action buttons:
  - "Add to itinerary" / "Remove from itinerary" (primary/secondary)
  - "Save for later" (heart icon, toggles filled/outline)

**Booking Integration**
- External link button: "Book on [Provider Name]" (secondary style)
- Link indicator: Arrow up-right icon (opens in Safari)
- Confirmation alert: "You'll leave Tripify to complete booking"

### States

**Default**
- All content visible, close button active
- If not in itinerary: "Add to itinerary" button
- If in itinerary: "Remove from itinerary" button

**Loading**
- Skeleton content in modal
- Handle bar and close button visible

**Empty (No Image)**
- No hero image, content starts at top
- Optional placeholder icon (64x64px)

**Booking States**
- Not booked: Status shows "Not booked", segmented control on "Not booked"
- Booked: Status shows "Booked" in green, segmented control on "Booked"
- Cancelled: Status shows "Cancelled" in red, segmented control on "Cancelled"

### Interactions

- Backdrop tap: Close modal
- Handle bar drag: Dismiss modal (swipe down)
- Close button tap: Close modal
- "Read more": Expand description to full text
- "Book" button tap: Open external booking site in Safari
- Booking status tap: Change status (Not booked → Booked → Cancelled)
- "Add/Remove from itinerary": Toggle activity in trip
- "Save for later": Toggle heart icon filled/outline
- Vote buttons: Same as timeline (upvote/downvote)

### Constraints

- Modal should support swipe-to-dismiss
- Use iOS sheet presentation (UISheetPresentationController)
- External links open in Safari (not in-app browser)
- Booking status is local only (no API integration)
- All measurements from design system
- Safe area handling for bottom sheet

---

## Prompt 9: Budget & Expenses Tab

### Context

The expense tracking interface. Users set budgets, log expenses during trips, and see settlement calculations for group trips.

### Requirements

**Layout Structure**
- Header: "Budget & Expenses" (Heading LG)
- Budget summary card (top):
  - Total budget: Display Large (32px, Heavy), black
  - Spent/remaining: Body LG, gray
  - Progress bar: 8px height, full width, color-coded
  - Breakdown: "Transport: $200, Food: $450" (Body SM, gray)
- "Add expense" FAB: Bottom right, green, 56px circle, plus icon
- Expense list: Vertical scroll, grouped by date
- Settlement card: Bottom section, shows who owes whom

**Budget Summary Card**
- Background: White, border-radius 12px, shadow
- Padding: 20px
- Layout:
  - "Total Budget" label (Body SM, gray) top left
  - Budget amount: "$2,000" (Display Large)
  - Progress bar below: Fill based on spent percentage
  - "Spent $1,200 • $800 remaining" (Body MD, gray)
  - Category breakdown: Small pills showing category spending

**Expense List**
- Date headers: "Mon, Aug 27" (Body MD, gray), 24px top margin
- Expense rows:
  - Icon: Category icon (food, transport, etc.) in circle, 40px
  - Description: Expense name (Body MD), "Sushi dinner"
  - Amount: "$45" (Body MD, Semibold), right-aligned
  - Paid by: Avatar + "Sarah" (Body SM, gray)
  - Split indicator: "Split 3 ways" (Body SM, gray)
  - Receipt thumbnail: Small square if photo attached
  - Row height: 64px minimum
  - Tap to edit

**Add Expense Modal**
- Header: "Add expense" with "Cancel" and "Save"
- Amount input: Large, numeric keypad only
  - Display: "$0" (Display Large, centered)
- Description: Text input, placeholder "What was this for?"
- Category picker: Horizontal scroll chips
  - Categories: Food, Transport, Accommodation, Activities, Other
  - Selected: Green background, white text
- "Paid by" selector: Row of collaborator avatars
- "Split with" multi-select: Checkboxes next to collaborators
- Receipt photo: Camera icon button, opens photo picker
- "Save expense" button: Full width, primary style

**Settlement Summary Card**
- Background: White, border-radius 12px, shadow
- Header: "Settlement" (Heading SM)
- Content: Visual flow diagram showing net money flow
  - Each person: Avatar + name
  - Arrows showing who pays whom
  - Amounts: "Sarah owes John $50"
- Action buttons: "Send reminder" (secondary style, per person)

### States

**Default**
- Summary card visible, expense list visible, settlement visible
- If no expenses: Empty state in list area

**Empty (No Expenses)**
- Illustration: Receipt or wallet icon
- Headline: "No expenses yet"
- Body: "Track spending to stay on budget"
- CTA: "Add expense" button

**Budget Healthy**
- Progress bar green (<80% spent)
- "On track" message

**Budget Warning**
- Progress bar yellow (80-100%)
- "Almost at budget" message

**Budget Over**
- Progress bar red (>100%)
- "$X over budget" message

**Settlement Balanced**
- "Everyone is squared up" message
- No action buttons needed

**Settlement Owed**
- Show who owes whom
- "Send reminder" buttons visible

### Interactions

- Expense row tap: Open edit expense modal (same as add, pre-filled)
- FAB tap: Open add expense modal
- Category chip tap: Select category
- "Paid by" avatar tap: Select payer
- "Split with" toggle: Include/exclude from split
- Receipt photo: Open camera or photo library
- "Send reminder": Send notification to collaborator (simulated)

### Constraints

- Use budget progress bar from Prompt 3
- Amount input is numeric only (auto-formats as currency)
- Settlement calculations: Split expenses equally among selected participants
- Settlement shows net amounts (cancels out if A owes B and B owes A)
- Currencies are single (USD, no multi-currency support in MVP)

---

## Prompt 10: Discovery Screen

### Context

The destination and activity browsing interface. Users explore new destinations, see AI-recommended activities based on preferences, and save items for later.

### Requirements

**Layout Structure**
- Header: "Discover" (Heading LG), search bar
- Search bar:
  - Background: `#F9FAFB`, border-radius 12px
  - Icon: Search magnifying glass (left)
  - Placeholder: "Where to next?" (Body MD, gray)
  - Height: 48px
- Filter chips: Horizontal scroll below search
  - Filters: "Budget", "Duration", "Type"
  - Each chip: 36px height, 20px padding, rounded
- Featured destinations: Horizontal scroll section
  - Section header: "Featured destinations" (Heading SM)
  - Destination cards: 16:9 images, 200px width
    - Destination name overlay (bottom, white text, shadow)
    - AI match score: "95% match" pill (top right, green)
    - "Explore" button (secondary style, small)
- Activity recommendations: Vertical list
  - Section header: "Recommended for you" (Heading SM)
  - Activity cards (similar to timeline, but no time/votes)
    - Activity image (top, 16:9)
    - Name, description, cost estimate
    - "Save" heart icon (top right)
    - "Add to trip" button (bottom)

**Destination Card (Featured)**
- Width: 280px, height: 200px
- Image: Full card, rounded corners (12px)
- Gradient overlay: Bottom 40px, black gradient
- Destination name: White, Heading SM (18px, Semibold)
- AI match score: Green pill, white text, Caption (12px)
- "Explore" button: White background, green text, 32px height

**Activity Card (Recommended)**
- Width: Full container width
- Image: 16:9 aspect ratio, rounded top
- Content padding: 16px
- Name: Heading SM (18px, Semibold)
- Description: Body SM (14px, gray, 2 lines max)
- Cost: Body MD, green, right-aligned
- Save button: Heart icon, outline (gray) or filled (red)
- "Add to trip" button: Primary style, small (40px height)

**Empty State (No Preferences)**
- Illustration: Compass or map icon
- Headline: "Tell us what you love"
- Body: "Set your travel preferences to get personalized recommendations"
- CTA: "Set preferences" button (links to settings)

### States

**Default**
- Search bar, filters, featured destinations, recommendations visible
- Search bar empty (showing placeholder)

**Searching**
- Search bar has text, shows results below
- Featured destinations hidden (or filtered)
- Results show matching destinations and activities

**No Results**
- "No destinations found" message
- "Try different filters" suggestion

**Loading**
- Skeleton cards in recommendations section
- Search bar and filters remain interactive

**Empty (No Preferences Set)**
- Empty state visible
- Featured destinations still shown (not preference-based)

### Interactions

- Search bar tap: Show keyboard, focus input
- Search text: Filter destinations/activities in real-time
- Filter chip tap: Toggle filter state, show filter options (not implemented)
- Destination card tap: Open destination detail (not implemented)
- Destination "Explore" tap: Add to trip or view details
- Activity "Save" tap: Toggle heart icon, save to favorites
- Activity "Add to trip": Open trip selector modal (choose which trip to add to)
- Pull to refresh: Reload recommendations

### Constraints

- Featured destinations are curated (not AI-generated)
- Activity recommendations use AI based on user preferences
- Match scores are percentage-based (0-100%)
- "Add to trip" requires at least one trip exists
- Search is local-only (no API integration in MVP)

---

## Prompt 11: Settings & Profile Screen

### Context

User profile and app settings. Users manage their account, preferences, notifications, and privacy settings.

### Requirements

**Layout Structure**
- Header: Profile section (top)
  - Avatar: 80px circle, editable with camera icon overlay
  - Name: Heading LG (24px, Semibold)
  - Email: Body MD (16px, gray)
- Settings sections: Grouped by category
  - Each section: White background, 12px margin between sections
  - Section header: Heading SM (18px) with gray text
  - List items: 48px height each, disclosure indicator (>) on right

**Preferences Section**
- "Travel interests" → Shows selected interests as chips
- "Budget range" → Shows current range, e.g., "$1,000 - $3,000"
- "Travel style" → Shows current style, e.g., "Balanced"
- Each item: Chevron right indicator, tap to edit

**Notifications Section**
- "Push notifications" toggle (green when on)
- "Email updates" toggle
- "Trip reminders" toggle
  - Sub-item: "1 day before", "1 week before" (multi-select)

**Privacy Section**
- "Data export" → Exports trip data as JSON
- "Delete account" → Destructive action, red text, confirmation alert

**Help Section**
- "Contact support" → Opens email composer
- "Terms of service" → Opens web view
- "Privacy policy" → Opens web view
- App version: "Tripify v1.0.0" (Body SM, gray, centered)

**Edit Preferences Modal**
- Reuses onboarding screens from Prompt 4
- Shows current selections as pre-filled
- "Save changes" button replaces "Continue"

**Delete Account Alert**
- Alert title: "Delete your account?"
- Message: "This will permanently delete all your trips and data. This action cannot be undone."
- Actions: "Cancel" (cancel), "Delete" (destructive, red)
- Confirmation required: Type "DELETE" to confirm

### States

**Default**
- All sections visible, current values displayed
- Toggles show on/off state

**Editing Preferences**
- Modal visible with preference screens
- Changes not saved until "Save" tapped

**Delete Account Flow**
- Alert visible on first "Delete account" tap
- Confirmation screen appears after alert confirmed
- Typing "DELETE" required for final confirmation

**Data Export**
- Loading state: "Preparing your data..." with spinner
- Success: "Export complete, saved to Files" toast
- Failure: "Export failed, please try again" alert

### Interactions

- Avatar tap: Open photo picker to change profile picture
- Section item tap: Navigate to detail or toggle
- Toggle switch: Change on/off state
- "Delete account": Show alert, then confirmation screen
- "Data export": Show loading, then save to Files app
- Back navigation: Standard iOS back button

### Constraints

- Use iOS standard table view (UITableView) for settings list
- Toggles are iOS standard (UISwitch)
- Email composer uses MFMailComposeViewController
- Web views use SFSafariViewController for terms/privacy
- Account deletion is irreversible (local delete only, no API in MVP)
- Profile picture stored locally (not synced to cloud in MVP)

---

## Prompt 12: Polish - Offline Mode & Animations

### Context

Final polish layer. Adds offline indicators, haptic feedback, animations, and edge case handling that elevates the user experience.

### Requirements

**Offline Mode Indicator**
- Banner: Persistent when offline, 56px height
- Background: Gray-200 (`#E5E5EA`) with "Offline" badge
- Icon: WiFi with slash (gray-600)
- Text: "You're offline - edits will sync when connected" (Body MD)
- Position: Below top bar, overlaps content slightly
- Behavior: Visible when no network, auto-dismisses when connected
- Visual treatment: Informational, not alarming

**Offline Badges on Content**
- Green checkmark badge: Top right corner on cached content
- Gray lock icon: On features requiring connection (AI, search)
- Badge size: 16px, subtle, not prominent

**Sync Status (in Settings)**
- "Last synced: 5 minutes ago" (Body SM, gray)
- Sync spinner: Visible when actively syncing
- "Syncing now..." indicator: During sync

**Haptic Feedback**
- Success: Light tap (UIImpactFeedbackGenerator.light)
- Destructive action: Heavy tap (UIImpactFeedbackGenerator.heavy)
- Notification: Success vibration (UINotificationFeedbackGenerator.success)
- Selection: Selection changed (UISelectionFeedbackGenerator())

**Animations**
- Screen transitions: Standard iOS push (0.3s duration)
- Modal presentation: Slide up from bottom (0.25s)
- Activity card appearance: Staggered fade-in (0.1s delay between cards)
- Vote button tap: Scale animation (0.9x → 1.0x, 0.1s)
- FAB press: Scale down (0.95x → 1.0x, 0.1s)
- Pull to refresh: Standard iOS refresh control
- Skeleton loading: Shimmer effect (left to right, 1.5s loop)

**Conflict Resolution (Offline Edits)**
- Alert when reconnecting with unsynced changes
- Title: "Unsynced changes detected"
- Message: "Your changes from offline mode need to be merged. How would you like to proceed?"
- Options: "Keep mine", "Use server's", "Review changes"
- "Review changes" modal: Side-by-side comparison

**Empty State Polish**
- Illustrations: Use consistent illustration style
- Animation: Subtle float or bounce (2s loop)
- CTAs: Clear, action-oriented text
- Microcopy: Helpful, not blamey

**Error State Polish**
- Illustrations: Use consistent error illustration
- Messages: Actionable, not technical
- CTAs: Clear retry or alternative actions
- Tone: Helpful, understanding

**Loading State Polish**
- Skeleton screens: Match actual content layout
- Progress indicators: Show estimated time when possible
- Cancel option: Available on long-running operations

**Accessibility Enhancements**
- Dynamic Type: Support up to 200% text scaling
- VoiceOver: All interactive elements labeled
- High Contrast Mode: Respect system setting
- Reduce Motion: Respect system setting, disable animations
- Touch targets: Minimum 44x44px verified everywhere

### States

**Online (Default)**
- No offline banner
- All features available
- Sync status shows "Synced" or timestamp

**Offline**
- Offline banner visible
- Cached content has checkmark badges
- Online-only features show lock icons
- Edits work normally, queued for sync

**Syncing**
- Sync spinner visible in settings
- Offline banner shows "Syncing..."
- Progress indicator if applicable

**Conflict Detected**
- Alert appears automatically on reconnect
- App pauses until conflict resolved

### Interactions

- Offline banner: Not dismissible (auto-dismisses when online)
- Sync status tap: Manual sync trigger
- Conflict resolution: Choose merge strategy
- Reduced motion: Animations become instant or fades only

### Constraints

- Offline detection uses Reachability (Network framework)
- Sync uses background URLSession for uploads
- Conflict resolution is client-side only (no server merge in MVP)
- All animations respect prefers-reduced-motion setting
- Haptic feedback respects System Haptics setting
- Skeleton layouts must match real content exactly
- Test with VoiceOver for all screens

---

**End of Build-Order Prompts**

## Usage Notes

1. **Build in order**: Each prompt assumes previous prompts are complete
2. **Self-contained**: Each prompt includes all needed context
3. **Measurements are exact**: Use provided values, not estimates
4. **States are complete**: Implement all listed states for each component
5. **Test interactions**: Verify all tap targets are 44px minimum
6. **Accessibility first**: Test with VoiceOver and Dynamic Type

## Implementation Checklist

- [ ] Prompt 1: Design tokens implemented as constants
- [ ] Prompt 2: Tab bar and navigation shell functional
- [ ] Prompt 3: Core components reusable across app
- [ ] Prompt 4: Onboarding flow complete with skip option
- [ ] Prompt 5: Trip dashboard shows trips correctly
- [ ] Prompt 6: Create trip flow with AI simulation
- [ ] Prompt 7: Itinerary view with drag-reorder
- [ ] Prompt 8: Activity modal with booking links
- [ ] Prompt 9: Budget tracking with settlement
- [ ] Prompt 10: Discovery with recommendations
- [ ] Prompt 11: Settings fully functional
- [ ] Prompt 12: Offline mode and haptics working
