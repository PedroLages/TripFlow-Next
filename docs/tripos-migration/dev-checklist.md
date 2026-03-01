# TripOS Developer Checklist

**Created**: 2026-02-10
**Status**: Complete
**Purpose**: Code-level implementation rules for every component and page. Reference during development and PR review. For design philosophy, see [design-principles.md](design-principles.md). For token values, see [style-guide.md](style-guide.md).

---

## 1. Accessibility

Every component must be usable with keyboard, screen reader, and zoom.

- Icon-only buttons require `aria-label` (e.g., lock icon on budget cards, grip handle on itinerary items, close button on modals)
- Every form control needs a visible `<label>` or `aria-label` -- budget inputs, poll option fields, trip name input, date pickers
- Interactive elements require `onKeyDown`/`onKeyUp` alongside `onClick`
- Use `<button>` for actions, `<a>`/`<Link>` for navigation -- never `<div onClick>`
- Images need `alt` text; decorative images get `alt=""`
- Decorative icons get `aria-hidden="true"` (dividers, background illustrations, vote type icons next to their text label)
- Real-time updates (vote counts, activity feed entries, member join notifications) use `aria-live="polite"` -- reserve `"assertive"` for errors only
- Semantic HTML first, ARIA second -- if `<nav>`, `<main>`, `<section>`, or `<dialog>` fits, use it
- Headings follow strict hierarchy `<h1>`-`<h6>` -- never skip levels
- Include a skip link to `<main>` on every page
- Heading anchors need `scroll-margin-top` to clear the sticky header

**Do:** `<button aria-label="Lock budget" onClick={toggleLock}><LockIcon aria-hidden="true" /></button>`
**Don't:** `<div onClick={toggleLock}><LockIcon /></div>`

## 2. Focus States

Keyboard users must always see where focus is.

- Every interactive element needs visible focus: `focus-visible:ring-2 ring-offset-2` (or equivalent custom style)
- Never remove `outline` without providing a replacement
- Prefer `:focus-visible` over `:focus` -- avoid showing focus rings on mouse clicks
- Use `:focus-within` on compound controls (date range pickers, ranked-choice voting cards, inline edit groups)
- Tab order must follow visual order -- avoid positive `tabIndex` values

**Do:** `className="focus-visible:ring-2 focus-visible:ring-primary-500 ring-offset-2"`
**Don't:** `className="outline-none"` (with no replacement)

## 3. Forms

Forms must be fast to fill, hard to break, and forgiving.

- Set `autocomplete` and meaningful `name` on inputs -- especially `email`, `name`, `given-name`, `cc-*`
- Use semantic `type` (`email`, `tel`, `url`, `number`) with matching `inputMode`
- Never block paste -- especially on budget inputs, invite codes, and passwords
- Labels must be clickable: use `htmlFor` pointing to the input `id`, or wrap the input in `<label>`
- Disable spellcheck on email, code, and username fields: `spellCheck={false}`
- Checkbox/radio: the label and control share a single hit target (wrap both in `<label>`)
- Submit button stays enabled until the request starts; show a spinner during the request -- don't disable preemptively
- Errors appear inline next to the field; focus the first error on submit
- Placeholders end with `...` and show example patterns: `"e.g., Lisbon 2026..."`
- Use `autocomplete="off"` on non-auth fields (poll option text, trip description)
- Warn before navigation when there are unsaved changes (trip editing, budget entry, poll creation)

**Do:** `<input type="email" name="email" autoComplete="email" inputMode="email" />`
**Don't:** `<input type="text" name="e" />` (vague name, wrong type, no autocomplete)

## 4. Animation

Motion adds clarity. Gratuitous motion adds nausea.

- Honor `prefers-reduced-motion` -- replace animations with instant state changes via `@media (prefers-reduced-motion: reduce)`
- Animate only `transform` and `opacity` where possible (composited properties, no layout thrash)
- Never use `transition: all` -- list properties explicitly: `transition: transform 200ms ease, opacity 150ms ease`
- Set correct `transform-origin` (center for the lock-click animation, top for dropdown reveals, bottom-right for FAB menus)
- SVG transforms: apply on `<g>` with `transform-box: fill-box; transform-origin: center`
- Animations must be interruptible -- respond to user input mid-animation (especially drag-and-drop itinerary reordering)

## 5. Typography & Content

Text must read well, truncate gracefully, and align properly.

- Use `...` (single ellipsis character U+2026), not `...` (three periods)
- Use curly quotes `\u201C` `\u201D`, not straight `"`
- Non-breaking spaces (`&nbsp;`) for measurements ("12&nbsp;km"), symbols ("$&nbsp;500"), brand names
- Loading text ends with `...`: "Saving budget...", "Counting votes...", "Syncing itinerary..."
- Use `font-variant-numeric: tabular-nums` on vote counts, expense tables, budget displays, countdown timers
- Apply `text-wrap: balance` on headings; `text-pretty` on body paragraphs
- Text containers must handle long content: use `truncate`, `line-clamp-*`, or `break-words` -- trip names, activity names, and poll options can be any length
- Flex children need `min-w-0` for text truncation to work inside flex containers
- Test with "A" (shortest input) and a 200-character trip name (longest plausible input)

**Do:** `<span className="truncate min-w-0">{tripName}</span>` inside a flex parent
**Don't:** Assume trip names fit in one line without overflow handling

## 6. Images

Images must not shift layout or block the critical path.

- `<img>` needs explicit `width` and `height` attributes (prevents CLS)
- Below-fold images: `loading="lazy"`
- Above-fold hero/map images: use `priority` (Next.js `<Image>`) or `fetchpriority="high"`
- Avatar images: provide a text fallback (initials) when the image fails to load

## 7. Performance

Real-time collaboration means performance is a feature.

- Lists > 50 items: virtualize with `react-window` or use `content-visibility: auto` (poll results, expense lists, activity feed history)
- No DOM layout reads during render -- batch reads and writes separately
- Prefer uncontrolled inputs where possible (let the form library manage state)
- Add `<link rel="preconnect">` for Supabase CDN, Google Maps API, and font CDNs
- Critical fonts: `<link rel="preload" as="font" crossOrigin="anonymous">` with `font-display: swap`
- Debounce real-time search/filter inputs (300ms) -- trip search, activity filter, member lookup
- Memoize expensive derived data (vote tallies, budget aggregations) with `useMemo`

## 8. Navigation & URL State

URLs are the API of the UI. Every meaningful view state belongs in the URL.

- URL reflects meaningful state: active tab, selected day, poll filter, expense category -- use query params (`?day=3&tab=expenses`)
- Navigation links use `<a>` / Next.js `<Link>` -- supports Cmd/Ctrl+click, middle-click, browser history
- Deep-link stateful UI -- sharing a URL to a specific poll or itinerary day must work
- Destructive actions need a confirmation dialog or an undo window
- Back button must always work predictably -- never trap users

**Do:** `/trips/abc123/itinerary?day=3` (deep-linkable, shareable)
**Don't:** Store the selected day only in React state with no URL reflection

## 9. Touch & Interaction

Mobile-first means touch interactions must feel native.

- Set `touch-action: manipulation` on interactive areas (prevents 300ms double-tap zoom delay)
- Set `-webkit-tap-highlight-color` intentionally (`transparent` or a themed subtle color)
- `overscroll-behavior: contain` on modals, drawers, bottom sheets, and slide-out panels
- During drag operations: disable text selection (`user-select: none`), set `inert` on background content
- Use `autoFocus` sparingly -- only on the single primary input when opening a modal/dialog on desktop; avoid on mobile

## 10. Dark Mode

Dark mode is not an inversion filter. It requires intentional color choices.

- Set `color-scheme: dark` on `<html>` when dark mode is active
- `<meta name="theme-color">` must match the current mode's background color
- Native `<select>` elements: set explicit `background-color` and `color` (they don't inherit CSS custom properties reliably)
- Test shadows, borders, and elevation -- they behave differently on dark backgrounds
- Budget privacy indicators (lock icons, masked values) must remain clearly visible in both modes

## 11. Internationalization

TripOS is for groups that travel internationally. Formats must respect locale.

- Dates: always use `Intl.DateTimeFormat` -- never hardcode `"MM/DD/YYYY"` or `"DD/MM/YYYY"`
- Numbers and currency: always use `Intl.NumberFormat` -- critical for multi-currency expense displays and budget caps
- Detect user locale via `Accept-Language` header (server) or `navigator.languages` (client)
- All of these must be locale-aware: trip dates, expense amounts, budget displays, countdown timers, distance units
- Use `lang` attribute on elements containing user-generated content in mixed-language trips

## 12. Hydration Safety (Next.js)

Server and client must render identical HTML on first paint.

- Controlled inputs require `onChange`; uncontrolled inputs use `defaultValue` -- never mix
- Guard date/time rendering against hydration mismatch: render relative timestamps ("2 min ago") only on the client, or use a consistent server format
- Minimize `suppressHydrationWarning` -- fix the root cause instead of suppressing
- Avoid accessing `window`, `localStorage`, or `navigator` during server render -- gate behind `useEffect` or dynamic imports with `ssr: false`
- User-specific data (member role, budget visibility) should load client-side via React Query, not bake into server HTML

## 13. Anti-Pattern Flags

Flag these during PR review. Each one indicates a likely bug or accessibility failure.

| Flag | Why |
|---|---|
| `user-scalable=no` or `maximum-scale=1` | Blocks accessibility zoom |
| `onPaste` with `preventDefault` | Breaks paste on budget/password fields |
| `transition: all` | Performance hit and unintended side-effect animations |
| `outline: none` / `outline-none` without replacement | Removes keyboard focus indicator |
| `<div onClick>` or `<span onClick>` for navigation | Breaks Cmd+click, screen readers, browser history |
| `<div>` / `<span>` with click handler (non-navigation) | Use `<button>` -- semantic, focusable, keyboard-accessible |
| `<img>` without `width`/`height` | Causes cumulative layout shift |
| Large arrays rendered without virtualization | Performance on expense lists, activity feeds, poll results |
| Form input without `<label>` or `aria-label` | Inaccessible to screen readers |
| Icon button without `aria-label` | Screen reader announces nothing useful |
| Hardcoded date/number format strings | Breaks for international users -- use `Intl` APIs |
| `autoFocus` without clear justification | Disorienting on mobile, problematic for screen readers |
| `suppressHydrationWarning` without comment | Hiding a real bug instead of fixing it |

---

## Cross-References

| Topic | Document |
|---|---|
| Design philosophy and principles | [design-principles.md](design-principles.md) |
| Color tokens, typography scale, spacing | [style-guide.md](style-guide.md) |
| UX patterns, state design, user flows | [ux-spec.md](ux-spec.md) |
| Desktop wireframe specifications | [desktop-wireframe-prompts.md](desktop-wireframe-prompts.md) |
| Mobile wireframe specifications | [mobile-wireframe-prompts.md](mobile-wireframe-prompts.md) |
