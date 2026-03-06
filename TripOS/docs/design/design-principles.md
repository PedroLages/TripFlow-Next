# TripOS Design Principles

**Created**: 2026-02-10
**Status**: Complete
**Purpose**: The design philosophy governing every screen, interaction, and pixel in TripOS. Read this FIRST, before style-guide.md or ux-spec.md.

---

## 1. Design Vision

### 1.1 What TripOS Feels Like

Opening TripOS feels like spreading a map across a table with friends — organized but alive, structured but warm. The interface hums with quiet confidence: polls counting down, budgets safely locked away, itineraries taking shape in real time. There is no chaos here, but there is energy. Every member sees the same workspace. Every voice carries equal weight. The app does not nag or gamify — it moves the group forward with the steady assurance of a friend who is good at planning but never makes you feel bad about it. Money is handled honestly because it is handled privately. Decisions land because deadlines exist. And when the trip comes together, it feels like the group did it — not one exhausted organizer.

### 1.2 Aesthetic DNA: Stripe x Airbnb x Linear

We borrow from three products that each mastered one dimension of trust. **Stripe** proved that meticulous craft — pixel-perfect alignment, restrained color, precise typography — makes people comfortable handing over sensitive data. We need that same earned trust for blind budgeting. **Airbnb** showed that warmth and human-centered photography can coexist with functional density; we adopt their generous whitespace and conversational tone without tipping into playfulness. **Linear** demonstrated that opinionated defaults and keyboard-first speed create loyalty among power users; we take their bias toward closure — every action resolves, nothing lingers unfinished. TripOS synthesizes these into something none of them are: a collaborative governance tool that feels as safe as a bank, as inviting as a vacation rental listing, and as decisive as a project tracker.

### 1.3 The Emotions We Design For

- **Trust** — Users share private financial data with us. Every pixel must reinforce safety — lock icons, encryption language, teal privacy signals.
- **Momentum** — Group planning stalls by default. The UI pushes toward decisions with deadlines, quorum bars, and winner declarations.
- **Belonging** — Every member occupies the same workspace. No one is a second-class participant, regardless of budget or role.
- **Relief** — The moment a user sets their budget privately and sees "Only you can see this," we dissolve the anxiety that made group trips dreadful.
- **Fairness** — Structured voting, visible quorum, and clear results prove that the outcome was democratic, not dictated.
- **Accomplishment** — When the itinerary fills in and polls resolve, the group feels collective ownership over a plan they built together.

---

## 2. Core Principles

### 2.1 Privacy You Can See

> Trust is visual: lock icons, teal color, and "only you" labels persist everywhere private data lives.

**Why this matters for TripOS**: We ask users to enter their most sensitive travel data — how much they can afford — into a shared planning tool. If privacy feels like a backend implementation detail, users will not believe it. Budget shame causes 50% of group travel conflicts. We must make privacy a constant, visible reassurance, not a settings toggle buried three screens deep.

**How it shows up**:
- The blind budget input card renders a teal border and lock icon at all times, not just on focus
- "Only you can see this" labels appear below every private field, persisting after data entry
- The group max display uses distinct visual language (aggregate bar, no individual breakdowns) so users can see the wall between their data and the group

| Do | Don't |
|----|-------|
| Show a lock icon on the budget card at rest and during input | Show the lock only on hover or in a tooltip |
| Use teal exclusively for privacy-related elements | Use teal for decorative accents or non-privacy features |
| Display "Only you" labels persistently, not just on first use | Rely on a one-time onboarding tooltip to explain privacy |

> See [blind-budgeting-ux-patterns.md](../research/blind-budgeting-ux-patterns.md) for trust pattern research

### 2.2 Decide, Don't Debate

> Every screen drives toward closure: deadlines, quorum bars, winner declarations.

**Why this matters for TripOS**: The average group trip decision takes 73 messages across multiple platforms and still produces no outcome. TripOS exists because groups need governance, not another discussion space. Every poll, every vote, every itinerary slot must push the group from deliberation to resolution with visible urgency.

**How it shows up**:
- Poll cards always display a countdown timer and quorum progress bar — urgency is structural, not decorative
- When a poll closes, the winning option is declared immediately with a "Decided" badge and auto-suggested for the itinerary
- The votes tab separates "Active" from "Decided" polls, reinforcing that decisions are final

| Do | Don't |
|----|-------|
| Show a quorum bar ("4 of 6 voted") on every active poll | Hide vote counts until the poll closes |
| Auto-close polls at the deadline and declare a winner | Let polls linger without resolution |
| Offer "Add to itinerary" directly on decided polls | Require users to manually recreate decided options |

### 2.3 Warm Structure

> Generous padding, rounded corners, strict hierarchy — and copy that speaks like a friend who is good at planning.

**Why this matters for TripOS**: We handle sensitive topics — money, fairness, group dynamics — where cold efficiency feels alienating and loose playfulness feels untrustworthy. The interface must feel like a well-organized friend: structured enough to keep things moving, warm enough that no one feels judged for their budget or their indecision.

**How it shows up**:
- Card components use 12px border radius and responsive padding (16px mobile, 24px desktop) — structured but never sharp
- Empty states use empathetic, specific copy ("No one has voted yet — be the first") instead of generic placeholders
- Typography follows a strict scale but uses regular weight for body text, avoiding the clinical feel of all-medium-weight interfaces

| Do | Don't |
|----|-------|
| Write empty states with encouraging, specific copy | Use generic "Nothing here yet" messages |
| Pair structure (grids, cards, clear hierarchy) with rounded corners and breathing room | Use sharp corners and tight spacing to look "professional" |
| Address money topics directly and warmly ("Budget shame is real — that is why yours stays private") | Avoid mentioning money or use overly clinical language ("financial parameters") |

> See [style-guide.md § Brand Identity](style-guide.md) for visual personality definitions

### 2.4 Every Voice, One Screen

> Same workspace for all roles. Organizers get extra actions, not separate dashboards.

**Why this matters for TripOS**: Group travel apps fail when they create information asymmetry — when one person sees a different version of the trip than everyone else. TripOS treats collaboration as the default. Every member sees the same itinerary, the same polls, the same activity feed. Role differences manifest as additional action buttons, not gated views, so the group always shares a single source of truth.

**How it shows up**:
- The trip workspace renders identically for owners, organizers, members, and guests — role determines which action buttons appear, not which content is visible
- Member avatars on the trip header show all participants equally, with role badges as subtle secondary indicators
- The activity feed is visible to every member, creating shared accountability and group awareness

| Do | Don't |
|----|-------|
| Show all trip content to all roles; vary only the available actions | Create an "admin view" that hides content from regular members |
| Display role badges as subtle indicators (small text, muted color) | Use prominent visual hierarchies that make members feel like second-class participants |
| Let guests view polls and itinerary, even if they cannot vote or edit | Gate trip content behind role-based access walls |

### 2.5 Color Means Something

> Teal is privacy. Purple is voting. These assignments are exclusive and never decorative.

**Why this matters for TripOS**: TripOS has two features that no competitor offers — blind budgeting and structured voting. If their visual identities blur into the general palette, users lose the instant recognition that builds trust and habit. Reserving teal exclusively for privacy elements and purple exclusively for voting elements creates a visual language that users internalize: "I see teal, my data is safe. I see purple, a decision is happening."

**How it shows up**:
- Budget cards, lock icons, and "only you" labels all use the teal palette — nothing else in the app does
- Poll cards, vote buttons, quorum bars, and decision badges all use the purple palette — nothing else does
- Neutral UI chrome (navigation, cards, backgrounds) uses slate and gray, never teal or purple

| Do | Don't |
|----|-------|
| Use teal only for privacy: budget inputs, lock icons, encryption indicators | Use teal for a trip category tag or a decorative illustration accent |
| Use purple only for voting: poll cards, vote counts, quorum progress, decision badges | Use purple for a member role badge or a navigation highlight |
| Use the neutral palette for all general UI elements | Introduce teal or purple into buttons, links, or components unrelated to their assigned meaning |

> See [style-guide.md § Feature-Specific Styles](style-guide.md) for exact color tokens

### 2.6 Progressive, Not Hidden

> Simple default, expandable details, dedicated settings. Three layers, always in that order.

**Why this matters for TripOS**: TripOS serves groups with mixed tech comfort — the organizer who wants ranked-choice voting with quorum thresholds and the casual member who just wants to tap a button. Hiding advanced features frustrates power users. Showing everything at once overwhelms casual ones. Progressive disclosure lets us serve both: the default is simple, the details are one tap away, and the full configuration lives in a predictable settings location.

**How it shows up**:
- Creating a poll defaults to simple yes/no with a 48-hour deadline — advanced options (ranked choice, custom quorum, anonymous toggle) expand on demand
- The budget tab shows "My Budget" and "Group Range" by default; expense breakdowns and settlement details expand below
- Activity cards on the itinerary show name, time, and location by default; notes, estimated cost, and vote history expand on tap

| Do | Don't |
|----|-------|
| Default to the simplest useful configuration for every feature | Require users to configure options before they can take an action |
| Place advanced options in a collapsible "More options" section, visible but not intrusive | Hide advanced options in a separate settings page with no contextual link |
| Show summary data by default and full data on expansion | Display every data field at once in a dense, scrollable form |

> See [ux-spec.md § Cognitive Load](../design/ux-spec.md) for reduction strategies

### 2.7 Speed Is Respect

> 150ms interaction feedback. Optimistic UI. Skeleton loading. Users should never wonder if their action registered.

**Why this matters for TripOS**: Group planning is already slow — weeks of indecision, ignored messages, stalled threads. The app itself must never add friction. When a user casts a vote, they see the count update instantly. When they submit a budget, the lock animation confirms receipt before the server responds. Every interaction that feels sluggish signals that the tool is just another bottleneck, not the solution to the group's inertia.

**How it shows up**:
- Vote submissions use optimistic UI: the count increments and the button state changes immediately, rolling back only on server error
- Skeleton screens load within 100ms for the trip dashboard, itinerary, and vote tabs — users never see a blank white screen
- Drag-and-drop itinerary reordering animates at 60fps with immediate visual feedback on grab, move, and drop

| Do | Don't |
|----|-------|
| Update vote counts optimistically on tap, before server confirmation | Show a loading spinner after every vote submission |
| Use skeleton screens that match the layout of the incoming content | Show a centered spinner or blank screen while data loads |
| Animate transitions at 60fps with easing curves that feel physical | Use jarring instant-swap transitions or slow fades longer than 300ms |

> See [style-guide.md § Motion & Animation](style-guide.md) for timing values

---

## 3. Visual Identity

We designed every visual dimension to reinforce one message: this tool protects your money, respects your vote, and stays out of your way. These subsections explain the philosophy behind our choices. For exact token values, see the cross-references at the end.

### 3.1 How We Use Color

Color in TripOS is a signal, not decoration. Teal means safety — it appears exclusively on blind budgeting surfaces, lock icons, and privacy badges. Purple means democracy — it owns polls, vote buttons, and ranked-choice indicators. Indigo means action — primary buttons, active tabs, links. Amber means attention — deadlines approaching, badges that need a glance.

We earn trust through chromatic discipline. When every element competes for attention, nothing feels important. Most of our UI is neutral grays and whites. Feature colors activate only when their feature is contextually relevant — a poll card gets a purple left border, a budget input gets a teal lock icon. A trip overview with no active polls shows zero purple.

This restraint is what makes the color meaningful when it does appear. A teal badge on a budget field instantly communicates "this is private" because teal never appears anywhere else.

| | Do | Don't |
|---|---|---|
| Feature color | Use teal only for privacy-related surfaces | Use teal as a generic accent or decorative highlight |
| Neutral space | Keep dashboards and lists predominantly neutral | Color-code every card, list item, or section header |
| Semantic meaning | Pair color with an icon (lock + teal, ballot + purple) | Rely on color alone to communicate status or category |

### 3.2 How We Use Space

Generous whitespace signals care. A product that handles your private financial information cannot feel cramped — tight layouts subconsciously read as careless. We give cards breathing room, pad content areas generously, and separate sections with clear vertical gaps.

Travel planning is emotional and often stressful. The interface must feel like a clean desk, not a packed spreadsheet. When a user opens their blind budget, the space around that input field is part of the trust architecture — it says "we gave this its own room because it matters."

We use consistent spacing rhythms so the eye can predict structure. Related items sit closer together, unrelated sections sit further apart. The hierarchy of proximity mirrors the hierarchy of meaning.

| | Do | Don't |
|---|---|---|
| Card padding | Use standard or generous padding inside cards | Shrink padding to fit more cards on screen |
| Section gaps | Separate distinct features (voting, budget, itinerary) with clear vertical space | Stack unrelated sections with minimal separation |

### 3.3 How We Use Typography

Strict heading hierarchy builds scanability and trust. We follow H1 to H2 to H3 without skipping levels — if users cannot predict the structure of a page, they lose confidence in the tool. Body text stays at 16px minimum because group plans are read on phones in bright sunlight, often while walking.

Weight carries meaning. Semibold for headings that anchor sections. Medium for interactive labels like button text and form labels. Regular for body text that carries detail. We cap line lengths for reading comfort because a budget summary that stretches edge-to-edge on a desktop monitor is harder to parse than one held to a comfortable measure.

| | Do | Don't |
|---|---|---|
| Heading levels | Progress H1 to H2 to H3 in order on every page | Jump from H1 to H3, or use heading sizes purely for visual effect |
| Body size | Keep body text at 16px minimum across all breakpoints | Drop to 12px body text to fit more content in a card |
| Weight | Reserve semibold for headings, medium for labels, regular for body | Use bold for emphasis inside body paragraphs — restructure the content instead |

### 3.4 How We Use Depth

Subtle elevation, not dramatic shadows. Cards lift gently off the surface — just enough to define edges, never enough to feel like floating 3D objects. The effect we want is paper layers on a table: clearly separate, but grounded.

Modals dim the world behind them to focus attention. Dragged items gain a slightly deeper shadow to confirm they have been "picked up." But these are the ceiling of our depth system. In dark mode, lighter surface colors replace shadows entirely because shadows are invisible against dark backgrounds — we shift to borders and subtle brightness differences to maintain hierarchy.

| | Do | Don't |
|---|---|---|
| Card depth | Use the lightest shadow that still separates card from background | Apply heavy drop shadows to every card at rest |
| Dark mode | Rely on borders and lighter card surfaces for depth in dark mode | Use the same shadow values as light mode on dark surfaces |
| Drag states | Increase shadow and add minimal scale on picked-up items | Add bounce, glow, or rotation effects to dragged elements |

### 3.5 Light Mode and Dark Mode

Light mode is the default: clean whites and warm grays, designed to feel like a well-lit workspace. Dark mode uses a warm dark slate as its base — never pure black. Pure black feels like a void; dark slate feels like a room at night. The difference is emotional, and it matters for a product people use while winding down after a day of travel.

Both modes are designed with equal intention. Dark mode is not an afterthought inversion — we selected every dark surface, border, and tint deliberately. Borders replace shadows as the primary card-edge strategy because shadows vanish on dark surfaces. Feature colors brighten 8-10% in dark mode to maintain contrast and preserve their semantic identity: teal still means privacy, purple still means voting, even against a dark background.

We test both modes at every stage. A component that looks polished in light mode but washed out in dark mode is not finished.

| | Do | Don't |
|---|---|---|
| Dark base | Use warm dark slate as the background surface | Use pure black (#000) — it creates harsh contrast and feels lifeless |
| Feature colors | Brighten teal, purple, and indigo for dark surface legibility | Use the same lightness values from light mode on dark surfaces |
| Parity | Design and test both modes for every new component or screen | Treat dark mode as a CSS filter or simple color inversion |

> **Token values and CSS variables**: See [style-guide.md § Color Palette, Typography, Spacing](style-guide.md)

---

## 4. Interaction Principles

### 4.1 Every Action Gets a Response

No silent buttons. Every tap in TripOS produces visual feedback within 150ms. Vote cast? A checkmark animates into place. Budget saved? The lock icon clicks shut. Poll created? The new card slides into the list. Users should never wonder "did that work?" — the interface confirms immediately.

We use optimistic UI for real-time operations. When a user submits a vote, the tally updates instantly on their screen while the sync happens in the background. If the operation fails, we undo gracefully with a toast notification explaining what happened and offering a retry. The user sees speed; the system handles reliability.

This is especially critical for group interactions where multiple people act simultaneously. If someone casts a vote and sees no response for two seconds, they will tap again — and now we have a double-vote problem. Immediate feedback prevents confusion and duplicate actions.

| | Do | Don't |
|---|---|---|
| Button response | Show visual state change (pressed, loading, complete) within 150ms | Leave a button in its default state while waiting for a server response |
| Optimistic updates | Update vote tallies and activity lists immediately on the client | Block the UI with a spinner while waiting for the server to confirm |
| Failure recovery | Undo the optimistic update, show a toast with the error and a retry action | Show a generic "Something went wrong" modal that requires dismissal |

### 4.2 Smart Defaults, Less Deciding

Group planning already requires too many decisions — where to eat, what to visit, how to split costs. The tool should absorb decision load, not add to it. Every feature in TripOS ships with sensible defaults: poll type defaults to Yes/No, deadlines default to 48 hours, anonymous voting defaults to ON, quorum defaults to 60%.

These defaults are opinionated because we have done the research. Anonymous voting defaults to on because our blind budgeting validation showed people are more honest when shielded from social pressure. A 48-hour deadline prevents polls from lingering indefinitely. 60% quorum means a majority decides without requiring unanimity from people who may be offline.

Advanced options exist for users who want control, but they live behind expanders — never on the primary creation form. The first-time experience should feel like three taps, not a configuration panel.

| | Do | Don't |
|---|---|---|
| Creation flows | Pre-fill sensible defaults so users can tap "Create" immediately | Present blank forms that require filling every field before proceeding |
| Advanced options | Tuck non-essential settings behind an "Advanced" or "More options" expander | Show quorum percentage, vote weighting, and deadline granularity on the main form |
| Default rationale | Choose defaults backed by research (anonymity reduces social pressure) | Default to the most permissive or neutral option just to avoid making a choice |

### 4.3 Touch and Keyboard Parity

Every action achievable by touch is also achievable by keyboard. Drag-and-drop for ranked-choice voting has up/down button alternatives. Tab navigation reaches every interactive element in logical order. Focus rings are always visible — we never hide them for aesthetics because a keyboard user without a focus indicator is a user who is lost.

Mobile touch targets are 44px minimum. This is not a guideline we bend when space is tight — it is a hard constraint. If a design cannot fit 44px touch targets, the design has too many elements, not too little space. We solve density problems with progressive disclosure, not by shrinking targets.

This is not just about accessibility compliance. It is about respecting how people actually use our app: sometimes with a mouse at a desk during a planning session, sometimes with a thumb on a crowded train, sometimes with assistive technology. All three users deserve the same confidence that their input will land.

| | Do | Don't |
|---|---|---|
| Focus visibility | Show a visible focus ring on every interactive element in every mode | Remove focus outlines with `outline: none` for visual cleanliness |
| Alternative inputs | Provide button-based alternatives for every drag-and-drop interaction | Require drag-and-drop as the only way to reorder ranked-choice options |
| Touch targets | Enforce 44px minimum on all tappable elements — redesign if it does not fit | Shrink icons or buttons below 44px to accommodate more items on screen |

### 4.4 Motion as Communication

Animation in TripOS exists to communicate state changes, not to entertain. A vote submission animates a checkmark to confirm the action landed. A budget lock icon clicks shut to reinforce that the value is now private. Real-time vote tallies animate their width so users perceive the change as live rather than jumped. Every animation answers the question: "what just happened?"

Loading states use skeleton placeholders — shapes that match the content layout — not spinners. Skeletons tell the user what is coming and where it will appear. A spinner says "wait"; a skeleton says "your content is almost here, and it will look like this."

All motion respects `prefers-reduced-motion`. When a user has requested reduced motion, we replace animations with instant state changes. The information still communicates — the checkmark still appears, the lock still shows as locked — but without movement. Accessibility is not a degraded experience; it is a parallel one.

| | Do | Don't |
|---|---|---|
| Purposeful motion | Animate vote confirmations, privacy locks, and real-time tally changes | Add entrance animations to every card, list item, or page transition |
| Loading states | Show skeleton placeholders that mirror the shape of incoming content | Use generic spinners or progress bars that convey no structural information |
| Reduced motion | Replace animations with instant state changes when `prefers-reduced-motion` is set | Ignore the media query or disable functionality when motion is reduced |

> **Timing values and easing curves**: See [style-guide.md § Motion & Animation](style-guide.md)

### 4.5 Accessible by Default

Accessibility is a design value, not a compliance task. TripOS is built for international groups with varying abilities, screen sizes, network conditions, and assistive technology. When we say "every voice, one screen" (§2.4), we mean every voice — including those navigating by keyboard, screen reader, or switch control. Treating accessibility as a bolt-on audit is how products end up with pixel-perfect voting cards that a blind user cannot cast a vote on. We build it in from the first sketch.

The foundation is semantic structure. The same heading hierarchy that makes a trip dashboard scannable for sighted users (§3.3) is exactly what a screen reader uses to orient someone who cannot see the page. Landmarks, labels, and logical reading order are not separate accessibility work — they are the same information architecture that builds trust and clarity for everyone. When we get structure right, we get accessibility right.

Real-time updates deserve special attention. TripOS is a live collaboration tool — vote counts change, activity feeds scroll, members join and leave. Sighted users see these updates as they happen. Assistive technology users must also know when a poll closes, when a new vote shifts the tally, or when someone adds an activity to the itinerary. Updates that arrive silently for screen reader users create a two-tier experience, and we do not build two-tier experiences. Every real-time change announces itself to assistive technology, just as every animation communicates to sighted users (§4.4).

| | Do | Don't |
|---|---|---|
| Semantic structure | Use headings, landmarks, and labels as the primary navigation scaffold — the same hierarchy that serves visual clarity serves assistive technology | Treat semantic markup as a separate accessibility pass done after visual design is finished |
| Icon buttons | Give every icon button a text equivalent — mystery meat navigation is already in our anti-patterns (§7), and screen readers deserve the same clarity | Ship icon-only buttons that rely on visual context a non-sighted user cannot perceive |
| Real-time announcements | Ensure vote count changes, activity feed updates, and poll closures are announced to assistive technology as they happen | Let real-time updates arrive silently for screen reader users while sighted users see them instantly |
| Keyboard navigability | Preserve visible focus rings (§4.3) and logical tab order everywhere — never trade visual polish for keyboard access | Remove or suppress focus indicators to achieve a cleaner visual design |

### 4.6 URL Is the Interface

Every meaningful view in TripOS is a shareable link. In a group travel app, the URL is how collaboration spreads. When someone finds the perfect poll result or a day-by-day itinerary view, they should be able to copy the URL from their browser bar and drop it into the group chat. No "share" button required, no special export flow, no screenshot. The URL already contains the context.

This means filters, active tabs, selected polls, itinerary days, and vote results all reflect in URL query parameters. If a user navigates to the Votes tab, filters by "Active," and opens a ranked-choice poll — the URL captures all of that state. Hitting the back button returns to the previous view. Refreshing the page restores the exact same screen. Browser navigation is app navigation, and we never break that contract.

This principle also shapes how we build links. Navigation elements use proper anchor tags so that Cmd+click and middle-click open new tabs — because group planners multitask. A user reviewing the itinerary while checking a poll result in another tab is not an edge case; it is the primary workflow. Links that swallow these browser conventions force users into a single-threaded experience that fights against how groups actually plan.

| | Do | Don't |
|---|---|---|
| URL state | Reflect filters, active tabs, selected items, and itinerary days in URL query parameters | Store view state only in component memory that vanishes on refresh or share |
| Shareability | Let users share any view by copying the browser URL — the link restores the exact context | Require a dedicated share flow or export button to communicate a specific view to the group |
| Browser navigation | Ensure back and forward buttons traverse view history correctly — tab changes, filter changes, and detail views are all navigable | Trap users in a single-page state where the back button exits the app instead of returning to the previous view |
| Link behavior | Use proper anchor elements for all navigation so Cmd+click and middle-click open new tabs | Use click handlers on non-anchor elements that block standard browser link behavior |

> **Implementation specifics**: See [dev-checklist.md](dev-checklist.md) for URL state management rules and semantic HTML requirements

---

## 5. Content Principles

TripOS speaks inside the product differently than it speaks in marketing. Marketing is punchy, headline-driven, and problem-aware ("Stop pretending you can afford it"). Product voice is calmer. We're past the pitch. The user is here, planning a trip, and we're the competent friend helping them do it.

> **Marketing voice guidelines**: See [messaging-framework.md § Brand Voice](../strategy/messaging-framework.md)

### 5.1 Voice in the UI

TripOS speaks like a friend who's organized three trips and learned from every one: direct, warm, never condescending. We use contractions. We name the action, not the abstraction. We acknowledge difficulty when it's real ("Money's awkward -- that's why budgets are private") and stay out of the way when it's not. Every word earns its place. If helper text doesn't reduce anxiety or prevent a mistake, cut it.

| Do | Don't |
|----|-------|
| "Save privately" | "Submit form" |
| "Invite your crew" | "Add participants to this trip instance" |
| "You can change this anytime" | "This value may be modified at a later date" |

### 5.2 Labels and Actions

Button labels describe what happens next, not what the button is. The user should be able to predict the outcome before they tap. "Create poll" not "Submit." "Save privately" not "Save." "Join trip" not "Accept." Destructive actions name the consequence: "Delete trip" not "Confirm." Navigation labels match the destination exactly -- the tab says "Votes" and the page header says "Votes."

| Do | Don't | Why |
|----|-------|-----|
| Create poll | Submit | Names the outcome |
| Save privately | Save | Reinforces privacy at point of action |
| Delete trip | Confirm | Names the consequence, not the gesture |
| Join trip | Accept invitation | Shorter, action-oriented |

### 5.3 Error Messages

Every error message has three parts: what happened, why, and what to do next. "Couldn't save your budget. The connection dropped. Tap to retry." Never blame the user. Never surface technical details -- no error codes, no stack traces, no "422 Unprocessable Entity." If the error is ours, own it plainly: "Something went wrong on our end. We're looking into it."

| Do | Don't | Why |
|----|-------|-----|
| "Couldn't save your budget. The connection dropped. Tap to retry." | "Error: NetworkError at line 42" | Three parts: what, why, next step |
| "Something went wrong on our end." | "An unexpected error occurred." | Own it; don't hide behind passive voice |
| "That invite link has expired. Ask the organizer for a new one." | "Invalid token." | Give the user a path forward |
| "Poll couldn't close -- not enough votes yet." | "Error: Quorum not met (5/8 required)." | Plain language, not system jargon |

### 5.4 Empty States

Empty states are invitations, not dead ends. Every empty state has three things: a brief message, context for why it's empty, and a primary action to fill it. The tone is encouraging without being patronizing -- we're not cheerleading, we're pointing to the next step.

| Do | Don't | Why |
|----|-------|-----|
| "No polls yet. Create one to help the group decide." | "No data." | Explains what's missing and what to do |
| "Invite your crew to start planning together." | "Nothing here." | Tells the user their next move |
| "Set your private budget to see what the group can afford." | "No budget set." | Connects the action to a benefit |

### 5.5 Confirmations and Reassurances

Reduce anxiety at commitment points. After a budget save: "Saved. Only you can see this." After a vote: "Your vote is in." Before a destructive action, name exactly what will be lost: "Delete 'Lisbon 2026'? All activities, polls, and member data will be removed. This can't be undone." Reassure at privacy boundaries -- not once, but every time: "Your budget stays private even after the trip ends."

| Do | Don't | Why |
|----|-------|-----|
| "Saved. Only you can see this." | "Budget updated successfully." | Reinforces privacy at the moment it matters |
| "Delete 'Lisbon 2026'? All activities, polls, and member data will be removed. This can't be undone." | "Are you sure?" | Names the stakes; "Are you sure?" is meaningless |
| "Your vote is in. Results update as others vote." | "Vote submitted." | Tells the user what happens next |

---

## 6. Feature Design Languages

Each core feature has its own visual and emotional world. These are not just color assignments -- they are complete moods that shift the feel of the interface when users move between contexts. A user entering their budget should feel the room change. A user casting a vote should feel the formality rise. These worlds are distinct so users always know where they are and what the rules are.

> **Feature color tokens and component patterns**: See [style-guide.md § Feature-Specific Styles](style-guide.md)

### 6.1 Blind Budgeting -- The Teal World

The teal world feels like a private vault inside a warm room: secure but non-judgmental. Every surface communicates "this is yours alone." Teal activates the moment financial privacy is relevant -- on budget input fields, on the "Private" badge, on the lock icon -- and recedes when it is not. The lock icon is ever-present on budget surfaces. Not because we doubt users understand, but because trust requires constant visual reinforcement. You never have to wonder whether your number is visible to others. The answer is always on screen.

- **Mood**: Safe, private, calm, judgment-free
- **Visual cues**: Teal-tinted card backgrounds (`--privacy-subtle`), lock icons in `--privacy` teal, "Private" badges on every budget surface, muted teal borders on input fields
- **Typography**: Helper text always present -- "Only you can see this." Confirmation messages lead with the lock: "Saved. Only you can see this."
- **Interaction**: Budget inputs save with a lock-click micro-animation (200ms). The lock is never passively unlocked -- it starts locked and stays locked. Saving reinforces the seal, it does not break it
- **Sound of this world** (metaphor for designers): A door closing softly behind you

### 6.2 Structured Voting -- The Purple World

The purple world feels like a ballot box: fair, final, transparent. Every poll drives toward a result. Active polls show countdown urgency. Closed polls show clear winners. Purple signals "democracy in action" -- a color and mood distinct from the primary indigo workspace and the teal privacy enclave. When you see purple, a decision is being made or has been made. There is no ambiguity about the state of a poll; the badge, the border, and the progress bar all agree.

- **Mood**: Democratic, decisive, urgent, fair
- **Visual cues**: 4px purple left border on poll cards, `--vote` purple vote buttons, progress bars in `--vote` fill, deadline countdown badges in amber when closing soon, quorum fractions ("5 of 8 voted") displayed prominently
- **Typography**: The winning option is bold. Quorum counts are body-sized, not footnotes. Deadline text uses relative time ("Closes in 14 hours") until the final hour, then switches to a countdown
- **Interaction**: Casting a vote produces an immediate checkmark (150ms). Results bars animate smoothly as votes arrive in real time via WebSocket. Ranked-choice options use drag-and-drop with numbered badges and up/down button alternatives
- **Sound of this world**: A gavel tapping -- firm but not aggressive

### 6.3 Collaboration -- The Living Workspace

Collaboration uses the primary indigo palette. It is the default mode, the connective tissue between every feature-specific world. The workspace feels alive: avatar stacks show who is online, the activity feed scrolls with recent actions, real-time updates ripple through cards and lists without requiring a refresh. This is not a static document. It is a shared table where the group sits together. When someone adds an activity or casts a vote, you see it happen.

- **Mood**: Alive, connected, shared, transparent
- **Visual cues**: Avatar stacks with green/yellow/no presence dots, activity feed entries with relative timestamps ("2 min ago"), real-time update shimmer on changed cards, member count badges on trip headers
- **Typography**: Activity feed uses `text-sm`, names in `font-medium`, actions and objects in regular weight. Relative time is secondary text color
- **Interaction**: Changes by other members animate in smoothly (300ms ease-out) -- a new activity slides into the feed, a vote count increments, a member avatar appears. Never a jarring refresh, never a "pull to reload" requirement for fresh data
- **Sound of this world**: Friends chatting at a cafe -- busy but not chaotic

### 6.4 Itinerary -- The Timeline

The itinerary is sequential, geographic, and visual. It reads like a train schedule: ordered by day and time, with clear destinations and durations. Map markers connect to timeline entries. The design is structured and scannable -- when you are standing in a foreign city checking your next activity, you need the answer in two seconds. Day dividers break the flow into digestible chunks. Time and place are the loudest elements on every card. Notes, costs, and vote status are secondary.

- **Mood**: Organized, sequential, reliable, glanceable
- **Visual cues**: Day dividers with date headers, time slots on the left edge, location pins with category colors, duration indicators between activities, drag handles (GripVertical) on the left edge of each card for reordering
- **Typography**: Time in `font-medium`, place name in `text-base font-semibold`, notes and costs in `text-sm text-muted-foreground`. The hierarchy is: when, where, then everything else
- **Interaction**: Drag-and-drop reordering with shadow-lg elevation and 2% scale on the dragged card. Tap to expand activity details. Map view syncs with timeline scroll position -- scrolling past Day 2 centers the map on Day 2 locations

---

## 7. Anti-Patterns

These aren't preferences -- they're guardrails. Each anti-pattern was chosen because it would directly undermine TripOS's core value: trusted group decision-making.

| Anti-Pattern | Why We Reject It | What We Do Instead |
|---|---|---|
| **Gamification** (points, streaks, badges) | Travel planning isn't a game. Gamifying budget or voting behavior trivializes financial privacy and democratic choice. | We motivate through utility: the app is useful, so people use it. |
| **Dark patterns** (confirm-shaming, hidden unsubscribe, pre-checked boxes, forced defaults) | A product built on trust cannot manipulate. Every opt-in is explicit, every opt-out is obvious. | Clear labels, obvious exits, honest defaults. |
| **Gratuitous animation** (bouncing elements, confetti, parallax, decorative transitions) | Motion that doesn't communicate state change is noise. On slow connections it becomes lag. | Every animation communicates: checkmark = confirmed, lock = saved privately, width = vote count changed. |
| **Information density without purpose** (cramming data into tables, dashboard widget overload) | Group travel data is read in stolen moments on phones, not on analyst workstations. | Cards with clear hierarchy, one primary action per view, expandable details. |
| **Color without meaning** (decorative gradients, rainbow categories, color for visual interest) | Color is our trust signal system. Decorative color dilutes teal=privacy and purple=voting associations. | Neutral UI with strategic color activation only when feature context is relevant. |
| **Mystery meat navigation** (icons without labels, gestures without discovery, hidden menus) | New members join trips and must orient instantly without tutorials. | Icons always have text labels. Primary actions are visible buttons, not hidden in menus. Tab bars show both icon and label. |
| **Infinite scroll on decision screens** (endless lists of polls, activities, expenses) | Decisions require overview and comparison. Infinite scroll makes it impossible to know "how many polls are active?" | Paginated or complete lists with counts ("3 active polls, 7 closed"). |
| **Social pressure mechanics** (showing who hasn't voted by name, public budget shaming, "X is falling behind" notifications) | The app exists because group dynamics create social pressure around money and decisions. We reduce pressure, never weaponize it. | Anonymous defaults, private budgets, neutral "5 of 8 voted" counts without naming non-voters. |
| **Zoom restrictions** (disabling pinch-to-zoom or capping scale) | Blocks low-vision users from reading blind budget summaries, poll options, or itinerary details at the size they need. Violates WCAG. | Allow pinch-to-zoom everywhere. Layouts accommodate zoom without breaking. |
| **Blocking paste on inputs** | Breaks password managers and assistive technology on the most sensitive inputs in the app — login, invite codes, budget amounts. Creates friction exactly where we need trust. | Never intercept paste. Password, code, and budget fields always accept pasted content. |
| **Animating all properties** (broad transition shorthand instead of named properties) | Causes layout thrashing, animates unintended properties, and degrades performance on low-end devices — the same devices our international travelers carry. | List animated properties explicitly. Stick to transform and opacity where possible. See style-guide.md for approved animation properties. |
| **Divs as buttons or links** (click handlers on non-interactive elements for navigation) | Breaks Cmd+click, screen readers, middle-click, and browser history. In a group planning tool where URL-sharing is core (§4.6), this destroys collaboration workflows. | Use anchor elements for navigation, button elements for actions. Semantic HTML is not optional. |
| **Images without dimensions** (omitting explicit width and height) | Causes cumulative layout shift. The itinerary timeline and activity cards jump as images load, making the interface feel unstable while users scroll through their trip plan. | Always set explicit width and height. Lazy-load images below the fold. |
| **Hardcoded date and number formats** (assuming a single locale for dates, times, currencies) | TripOS handles multi-currency trips planned by international groups across countries and time zones. Hardcoded formats break for everyone outside the developer's locale. | Use locale-aware formatting for all dates, times, numbers, and currencies. Never assume a single format. |

When in doubt, ask: does this feature help the group decide, or does it just look clever?

> **Implementation checklist**: See [dev-checklist.md](dev-checklist.md) for code-level rules and review flags

---

## 8. Platform Principles

### 8.1 What Stays Consistent Everywhere

These elements never change across web, iOS, or Android:

- **Brand colors and feature color meanings** -- teal = privacy, purple = voting, indigo = primary action
- **Typography scale and hierarchy** -- Inter font family (with system fallbacks per platform)
- **Design principles** -- all seven apply on every platform, no exceptions
- **Content and copy** -- same labels, same voice, same microcopy
- **Feature logic** -- same workflows, same defaults, same privacy behavior
- **Card-based layout language** -- cards are the universal content container
- **Privacy indicators** -- lock icons, "Private" badges, teal activation on every platform
- **Date and number formatting** -- adapts to the user's locale, never hardcoded. TripOS handles multi-currency trips across countries; dates, times, currencies, and number separators must respect local conventions on every platform

### 8.2 What Adapts to the Platform

| Element | Web | iOS | Android |
|---------|-----|-----|---------|
| Navigation | Sidebar (280px) | 49pt UITabBar (bottom) | 80dp NavigationBar (bottom) |
| Primary creation | Top-right button | Top-right nav bar button | 56dp FAB (bottom-right) |
| Sheets/modals | Centered dialog | 2-detent bottom sheet | 3-state bottom sheet |
| Back navigation | Breadcrumbs | "< Back" with text label | Arrow icon only |
| Touch targets | Click (no minimum) | 44pt minimum | 48dp minimum |
| System font fallback | Inter (loaded) | SF Pro (system) | Roboto (system) |
| Date/number formatting | Browser locale via Intl APIs | System locale via Foundation formatters | System locale via android.icu formatters |

### 8.3 Web-First, Mobile-Ready

TripOS ships web first. The web app is the canonical experience. Mobile (iOS, Android) adapts the web design to platform conventions -- it does not redesign from scratch.

This means: we design every feature for web first, then verify it translates to mobile constraints (single column, bottom navigation, thumb-reachable touch targets). Platform-native controls (date pickers, share sheets, haptics) enhance but never override TripOS identity. When a platform convention conflicts with a TripOS principle, the principle wins.

> **iOS and Android specifications**: See [mobile-wireframe-prompts.md](mobile-wireframe-prompts.md) platform reference table
> **Mobile-first design strategy**: See [mobile-first-ux-deep-dive.md](../strategy/mobile-first-ux-deep-dive.md)

---

## Cross-References

| Topic | Document |
|-------|----------|
| Color tokens, typography scale, spacing system | [style-guide.md](style-guide.md) |
| Cognitive load reduction, state design, user flows | [ux-spec.md](ux-spec.md) |
| Marketing voice and messaging framework | [messaging-framework.md](../strategy/messaging-framework.md) |
| Blind budgeting trust patterns (research) | [blind-budgeting-ux-patterns.md](../research/blind-budgeting-ux-patterns.md) |
| Voting interface patterns (research) | [voting-interface-patterns.md](../research/voting-interface-patterns.md) |
| Mobile platform specifications (iOS/Android) | [mobile-wireframe-prompts.md](mobile-wireframe-prompts.md) |
| Mobile-first design strategy | [mobile-first-ux-deep-dive.md](../strategy/mobile-first-ux-deep-dive.md) |
| Desktop wireframe prompts (D1-D19) | [desktop-wireframe-prompts.md](desktop-wireframe-prompts.md) |
