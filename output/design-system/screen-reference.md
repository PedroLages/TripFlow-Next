# Screen Reference Guide

> **Tripify Travel Planner** - Complete Screen Catalog
> Generated: February 8, 2026
> **Total Screens**: 48

---

## Overview

This document provides a comprehensive reference for all screens in the Tripify app, organized by user flow and screen type. Each screen includes composition details, components used, and UX patterns.

---

## 📱 Screen Categories

1. [Authentication](#authentication) (2 screens)
2. [Onboarding](#onboarding) (8 screens)
3. [Home & Discovery](#home--discovery) (5 screens)
4. [Destinations](#destinations) (11 screens)
5. [Trip Planning](#trip-planning) (8 screens)
6. [Saved & Favorites](#saved--favorites) (4 screens)
7. [Modals & Overlays](#modals--overlays) (6 screens)
8. [Components & Docs](#components--docs) (4 screens)

---

## 🔐 Authentication

### auth-social-login.png

**Screen Name**: Social Login
**Type**: Authentication
**Primary Intent**: User account creation/login

**Layout:**
- App logo (green tulip icon, centered)
- Headline: "Let's Get Started!"
- Tagline: "Your Passport to Adventure Awaits"
- 4 social login buttons (stacked)
- Footer links: Privacy Policy | Terms of Service

**Components:**
- `Logo Icon` (green, 96px)
- `Heading` (28px Bold, black)
- `Body Text` (16px Regular, gray)
- `Social Login Buttons` × 4:
  - Google (white bg, multicolor logo)
  - Apple (white bg, black logo)
  - Facebook (white bg, blue logo)
  - Twitter (white bg, light blue logo)
- `Text Links` (14px Regular, gray)

**UX Patterns:**
- Single-tap social authentication
- No email/password form (reduced friction)
- Legal links in footer
- Clean, minimal design

**Tokens Used:**
```
Colors: background-primary, text-primary, text-secondary
Typography: display-large, body-lg, body-sm
Spacing: section-gap (24px), button-gap (16px)
Radius: button (12px social buttons)
```

---

## 🎯 Onboarding

### onboarding-ai-planning-intro.png

**Screen Name**: AI Planning Introduction
**Type**: Onboarding - Welcome
**Primary Intent**: Introduce app's core value proposition

**Layout:**
- Green status bar
- Phone mockup showing Tokyo destination
- Headline: "Intelligent Trip Planning with Tripify AI"
- Description paragraph
- Progress indicator (dots, 1/8)
- Primary button: "Continue"
- No back button (first screen)

**Components:**
- `Hero Phone Mockup` (3D illustration)
- `Destination Card Preview` (inside mockup)
- `Heading XL` (28px Bold)
- `Body Text` (16px Regular, gray)
- `Progress Dots` (8 total, 1st active)
- `Primary Button` (green, pill)

**UX Patterns:**
- Visual storytelling with mockup
- Progressive disclosure (step 1 of 8)
- Single CTA (no cognitive overload)

---

### onboarding-saved-feature.png

**Screen Name**: Saved Feature Tutorial
**Type**: Onboarding - Feature Introduction
**Primary Intent**: Explain saved destinations feature

**Layout:**
- Progress bar (green, ~60% complete)
- Back button (top-left)
- Phone mockup showing saved screen
- Headline: "Save and Plan Your Adventures"
- Description text
- Progress indicator (dots)
- "Skip" link (bottom-left)
- "Continue" button (bottom-right)

**Components:**
- `Linear Progress Bar` (4px, green)
- `Back Button` (icon only, 44px)
- `Phone Mockup` (centered)
- `Heading XL` (24-28px Bold)
- `Body Text` (16px Regular)
- `Progress Dots` (8 total, ~5th active)
- `Text Link` ("Skip", gray)
- `Primary Button` ("Continue", green)

**UX Patterns:**
- Optional skip link (user agency)
- Visual demonstration via mockup
- Consistent progress indication

---

### onboarding-personal-touch.png

**Screen Name**: Profile Setup
**Type**: Onboarding - Form
**Primary Intent**: Collect user profile information

**Layout:**
- Progress bar (~40%)
- Back button
- Headline: "Add a Personal Touch"
- Form fields (4):
  - Name (text input)
  - Email (email input)
  - Country (dropdown/select)
  - Phone Number (tel input)
- Continue button

**Components:**
- `Text Input` × 4 (white bg, gray border, 48px height)
- `Heading XL` (28px Bold)
- `Form Labels` (14px Regular)
- `Primary Button` (full-width, green)

**Validation:**
- Real-time validation on blur
- Error states shown below inputs
- Disable button until form valid

---

### onboarding-travel-preferences.png

**Screen Name**: Travel Preferences Selection
**Type**: Onboarding - Multi-select
**Primary Intent**: Capture user's travel interests

**Layout:**
- Progress bar (~25%)
- Back button
- Headline: "What Sparks Your Wanderlust?"
- Instruction: "Select at least 5 travel styles"
- Grid of preference cards (2 columns, scrollable)
- Selection counter: "5 selected"
- Continue button (enabled when ≥5)

**Components:**
- `Selection Cards` (emoji + title + description)
  - Default state: white bg, gray border
  - Selected state: green border, subtle bg tint
- Each card ~72px height, 12px radius
- `Counter Badge` (gray text)

**UX Patterns:**
- Minimum selection requirement (5)
- Visual selection feedback (border change)
- Counter provides progress clarity
- Scrollable grid (responsive)

**Example Preferences:**
- 🏖️ Beach Vacations
- 🏛️ City Breaks
- 🌿 Nature Escapes
- 🍔 Food Tourism
- 🎭 Cultural Experiences

---

### onboarding-travel-dates.png / modal-travel-companions.png

**Screen Name**: Trip Date Selection
**Type**: Onboarding - Date Picker
**Primary Intent**: Select trip dates

**Layout:**
- Progress bar (~40%)
- Back button
- Headline: "When are you planning to go?"
- Dual-month calendar view
- Selected dates highlighted (green)
- Date range shown below calendar
- Continue button

**Components:**
- `Calendar Component` (2-month view)
  - Month headers (18px Semibold)
  - Day grid (7 columns)
  - Selected dates (green circular bg)
  - Date range connector (green bar)
  - Past dates (grayed out)
- `Date Range Display` ("Dec 12 - Dec 14, 2023")

---

### onboarding-travel-companions.png (Who is Going)

**Screen Name**: Travel Companion Selection
**Type**: Onboarding - Single Select
**Primary Intent**: Determine travel party composition

**Layout:**
- Progress bar (~30%)
- Back button
- Headline: "Who is going? 🧳"
- Description: "Let's get started by selecting who you're traveling with."
- 5 selection cards (stacked)
- Continue button

**Options:**
- 🚶 Only Me (solo travel)
- ❤️ A Couple (romantic getaway)
- 👨‍👩‍👧‍👦 Family (quality time)
- 🌟 Friends (adventure)
- 💼 Work (business/corporate)

**Components:**
- `Selection Cards` (single-select radio style)
- Selected state: green border (2px)

---

### onboarding-travel-budget.png

**Screen Name**: Budget Selection
**Type**: Onboarding - Single Select
**Primary Intent**: Determine budget preferences for AI recommendations

**Layout:**
- Progress bar (~50%)
- Back button
- Headline: "Set your trip budget 💰"
- Description explaining how this affects itinerary
- 4 budget option cards
- Continue button

**Budget Options:**
1. **Cheap 💰** - Budget-friendly, economical travel
2. **Balanced 💼** - Moderate spending for a balanced trip
3. **Luxury 💎** - High-end, indulgent experiences (SELECTED in image)
4. **Flexible 💫** - No budget restrictions

**Components:**
- `Selection Cards` (stacked, single-select)
- Selected: "Luxury" with green border
- Emoji indicators for each tier

---

### onboarding-complete.png

**Screen Name**: Onboarding Completion
**Type**: Onboarding - Success
**Primary Intent**: Celebrate completion, transition to app

**Layout:**
- Centered success icon (green circle with phone/person icon)
- Headline: "You're all set!"
- Success message: "Congratulations! You're now part of the Tripify community..."
- Large green button: "Explore Destinations"
- No back button (completion state)

**Components:**
- `Success Illustration` (96×96px green circle, white icon)
- `Heading XL` (28px Bold)
- `Body Text` (16px Regular, centered, gray)
- `Primary Button` (full-width, green)

**UX Patterns:**
- Positive reinforcement
- Single clear CTA (no confusion)
- Transition to main app experience

---

## 🏠 Home & Discovery

### trip-planning-home.png

**Screen Name**: Trip Planning Home
**Type**: Main App - Home/Discovery
**Primary Intent**: Browse destinations and start planning

**Layout:**
- Top bar: App logo (left), search icon (right)
- Search input: "Search destinations"
- Section: "Popular Destinations" with "View All" link
  - Horizontal card carousel (Tokyo, Paris)
- Section: "Popular Articles" with "View All"
  - Horizontal card carousel
- Bottom navigation bar (4 tabs)

**Components:**
- `Search Bar` (gray bg, magnifying glass icon)
- `Section Header` (14px Semibold + link)
- `Destination Cards` (horizontal scroll)
  - Image (16:9), title, location, bookmark icon
- `Article Cards` (horizontal scroll)
  - Image, title, date, bookmark icon
- `Bottom Nav` (Home, Saved, Trips, Profile)

**UX Patterns:**
- Search-first interface
- Horizontal scrolling carousels (mobile-optimized)
- "View All" links for deeper browsing
- Persistent bottom navigation

---

### discovery-popular-destinations.png

**Screen Name**: Popular Destinations List
**Type**: Discovery - List View
**Primary Intent**: Browse curated destination list

**Layout:**
- Top bar: Back button, "Popular Destinations" title, search icon
- Vertical list of destination cards
- Each card: image, title, location, bookmark, menu
- Bottom navigation

**Components:**
- `Destination Cards` (full-width, stacked)
  - Hero image (16:9, 8px radius)
  - Title (20px Semibold)
  - Location (14px Regular, flag emoji)
  - Bookmark icon (top-right overlay)
  - Menu dots (bottom-right)

**List Items:**
- Tokyo, Tokyo (Japan)
- Paris, Paris (France)
- [More destinations...]

---

### discovery-popular-searches.png (Search Results)

**Screen Name**: Search Results - Japan
**Type**: Discovery - Search
**Primary Intent**: Show relevant search results

**Layout:**
- Top bar: Back button, search input "Japan", clear (×) button
- Results count: "12 Results"
- Vertical list of destination cards (compact style)
  - Thumbnail (left, 80×80px)
  - Title + location (right)
  - Chevron (far right)

**Components:**
- `Search Input` (active state)
- `Results Counter` (14px Regular, gray)
- `Compact List Items` (48-56px height each)
  - Square thumbnail (80px)
  - Title (16px Semibold)
  - Location (14px Regular, red pin + "Japan")
  - Chevron icon (right)

**Results Shown:**
- Tokyo, Tokyo
- Kyoto, Kyoto Prefecture
- Osaka, Osaka Prefecture
- Hiroshima
- Nara
- Kanazawa
- Sapporo

---

## 🗺️ Destinations

### destination-detail-tokyo.png

**Screen Name**: Tokyo Destination Detail
**Type**: Destination - Detail View
**Primary Intent**: View destination information, take action

**Layout:**
- Hero image (full-width, 300px height)
  - Overlay icons: back (top-left), bookmark, share, menu (top-right)
  - "Saved!" badge (center)
- Content area:
  - Title: "Tokyo, Tokyo"
  - Location: 🇯🇵 Japan (red pin)
  - Description paragraph (3-4 lines)
  - "Gallery" label
  - Thumbnail row (horizontal scroll, 3 visible)
  - Primary button: "Start a Trip" (green)

**Components:**
- `Hero Image` with overlays
- `Icon Buttons` (white bg, 44px circles)
- `Badge` ("Saved!" green bg, white text)
- `Heading XL` (24px Bold)
- `Location Label` (14px Regular, icon + text)
- `Body Text` (16px Regular, gray)
- `Image Thumbnails` (80×80px, 8px radius)
- `Primary Button` (full-width, green)

**UX Patterns:**
- Image-first design (emotional appeal)
- Quick actions as overlays
- Gallery preview (expandable)
- Clear CTA

---

### destination-detail-paris.png
### destination-detail-bangkok.png
### destination-detail-barcelona.png
### destination-detail-istanbul.png
### destination-detail-london.png
### destination-detail-new-york.png
### destination-detail-sydney.png
### destination-detail-bali.png

**Similar Structure to Tokyo**

All destination detail screens follow the same layout pattern:
- Hero image (specific to destination)
- Location badge
- Description text (destination-specific)
- Gallery thumbnails
- "Start a Trip" CTA

**Destinations Cataloged:**
- Paris, France (Eiffel Tower image)
- Bangkok, Thailand
- Barcelona, Spain
- Istanbul, Turkey
- London, United Kingdom
- New York, USA
- Sydney, Australia
- Bali, Indonesia

---

## 🧳 Trip Planning

### 31.png (Modify Trip Modal)

**Screen Name**: Modify Trip
**Type**: Trip Planning - Form
**Primary Intent**: Edit existing trip details

**Layout:**
- Modal header: Close (×) button (left), "Modify Trip" title
- Form sections:
  1. **Destination** (edit icon)
     - Tokyo thumbnail + name
  2. **Party** (edit icon)
     - "Family 👨‍👩‍👧‍👦"
  3. **Trip Dates** (edit icon)
     - "December 12 to December 16, 2023"
  4. **5 Interests** (edit icon)
     - Chip tags: City Breaks, Nature Escapes, Food Tourism, Staycations, Wildlife Safaris
  5. **Budget** (edit icon)
     - "Balanced 💼"
- Primary button: "Save & Regenerate Trip"

**Components:**
- `Modal Container` (white bg, 16px top radius)
- `Section Icons` (location, people, calendar, star, dollar)
- `Editable Sections` (each with edit icon, teal)
- `Thumbnail Image` (destination)
- `Chip Tags` (white bg, gray border, emoji + text)
- `Primary Button` (full-width, green)

**UX Patterns:**
- Inline editing (icon triggers individual section edit)
- Summary view (all settings at a glance)
- Regenerate AI itinerary after save

---

### trip-planning-home.png (Context Menu)

**Screen Name**: Trip Action Menu
**Type**: Contextual Menu
**Primary Intent**: Quick trip actions

**Menu Options:**
1. 🔄 Regenerate Trip
2. ⚙️ Modify Trip Settings
3. 🗑️ Delete Trip (red text)

**Components:**
- `Dropdown Menu` (white bg, 12px radius, shadow-lg)
- `Menu Items` (icon + label, 48px height)
- `Destructive Action` (red text for delete)

**UX Patterns:**
- Contextual menu from three-dot icon
- Destructive action visually differentiated
- Backdrop dismisses menu

---

## 💾 Saved & Favorites

### main-saved-screen.png

**Screen Name**: Saved Destinations
**Type**: Main App - Collection
**Primary Intent**: View and manage saved destinations

**Layout:**
- Top bar: App icon (left), "Saved" title (center), search (right)
- Vertical list of destination cards
  - Tokyo (with cherry blossoms)
  - Prague (European architecture)
  - [More destinations...]
- Bottom navigation (Saved tab active - green)

**Components:**
- `App Logo` (green icon, 32px)
- `Screen Title` (17px Semibold, centered)
- `Search Icon` (top-right)
- `Destination Cards` (same as discovery)
- `Bottom Nav` (Saved tab highlighted green)

**List Actions:**
- Bookmark icon (remove from saved)
- Menu dots (more actions)

---

### saved-destinations.png (Onboarding Variant)

Similar to main saved screen but shown during onboarding as a tutorial screen.

---

### saved-destinations-removed.png

**Screen Name**: Saved - Item Removed
**Type**: Saved - State Change
**Primary Intent**: Provide feedback after removal

**UX Pattern:**
- Toast notification: "Destination removed from saved"
- Undo action available (time-limited)

---

## 📋 Modals & Overlays

### modal-generating-itinerary.png

**Screen Name**: Generating Itinerary Loading
**Type**: Modal - Loading State
**Primary Intent**: Show AI generation progress

**Layout:**
- Blurred background (trip details visible behind)
- Centered modal card
  - Circular progress indicator (green, 56%)
  - Title: "Generating Itinerary... (56%)"
  - Description: "Please wait while our AI works its magic to create the perfect trip plan tailored to your preferences."

**Components:**
- `Modal Backdrop` (50% black overlay, blur)
- `Modal Card` (white, 16px radius, centered)
- `Circular Progress` (48px, green stroke)
- `Percentage` (56%, inside spinner)
- `Heading` (17px Semibold)
- `Body Text` (14px Regular, gray)

**UX Patterns:**
- Non-dismissible loading (process running)
- Progress percentage (clear expectation)
- Friendly copy (reduces anxiety)

---

### modal-share-bottom-sheet.png

**Screen Name**: Share Bottom Sheet
**Type**: Bottom Sheet
**Primary Intent**: Share trip with contacts/social

**Layout:**
- Drag handle (centered top)
- Title: "Share with"
- Section: "Recent Contacts" (horizontal avatar row)
- Section: "Share via Social Media"
  - Icons: Instagram, Facebook, WhatsApp, Telegram, Twitter, More
- Backdrop overlay

**Components:**
- `Drag Handle` (gray bar, 36×4px)
- `Section Headers` (14px Semibold)
- `Avatar Grid` (circular, 56px, with names)
- `Social Icons` (branded colors, 48px)
- `Bottom Sheet Container` (white, 16px top radius)

**UX Patterns:**
- Swipe down to dismiss
- Backdrop tap to dismiss
- Recent contacts for quick sharing
- Multiple sharing methods

---

### modal-travel-companions.png

See Onboarding section - used both in onboarding and trip modification.

---

## 🎨 Components & Docs

### component-button-styles.png

**Actual Content**: Budget Selection Screen (not button docs)

Shows budget preference selection with four cards:
- Cheap 💰
- Balanced 💼
- **Luxury 💎** (selected, green border)
- Flexible 💫

---

### component-input-fields.png

**Actual Content**: Review Summary Screen

Shows trip planning summary with sections:
- Destination (Tokyo thumbnail + edit icon)
- Party (A Couple ❤️)
- Trip Dates (December 12 to December 14, 2023)
- 5 Interests (chip tags: Adventure Travel, Beach Vacations, Road Trips, Food Tourism, Art Galleries)
- Budget (Luxury 💎)
- Primary button: "Build My Itinerary"

---

### travel-guide-hidden-gems.png

**Screen Name**: Travel Guide Article
**Type**: Content - Article
**Primary Intent**: Read travel guide content

**Layout:**
- Hero image (full-width)
- Article title: "Hidden Gems: Uncovering Secret Destinations"
- Author/metadata
- Article body text (scrollable)
- Related articles (bottom)

**Components:**
- `Hero Image` (16:9)
- `Article Title` (24px Bold)
- `Meta Info` (date, author, reading time)
- `Body Content` (16px Regular, 1.6 line-height)
- `Related Cards` (horizontal scroll)

---

## 📊 Screen Flow Diagrams

### Onboarding Flow

```
1. AI Planning Intro
   ↓
2. Social Login
   ↓
3. Profile Setup
   ↓
4. Travel Preferences (select 5)
   ↓
5. Travel Companions
   ↓
6. Trip Dates
   ↓
7. Budget Selection
   ↓
8. Saved Feature Tutorial
   ↓
9. Completion → Main App
```

### Trip Planning Flow

```
Home/Discovery
   ↓
Search or Browse
   ↓
Destination Detail
   ↓
"Start a Trip" button
   ↓
(Confirm/Modify Trip Details)
   ↓
Generating Itinerary (loading)
   ↓
Trip Itinerary View
   ↓
Save/Share/Modify
```

### Saved Destinations Flow

```
Browse Destinations
   ↓
Tap Bookmark Icon
   ↓
Added to Saved
   ↓
View in Saved Tab
   ↓
Tap to View Details
   ↓
Start Trip or Remove
```

---

## 🔗 Related Documentation

- [`ui-components.md`](ui-components.md) - Component specifications
- [`ui-style-guide.md`](ui-style-guide.md) - Visual design tokens
- [`design-tokens.json`](design-tokens.json) - Token definitions

---

**Last Updated**: February 8, 2026
**Total Screens Documented**: 48
**Version**: 1.0.0
