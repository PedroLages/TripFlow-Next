# CSS to Tailwind Migration Plan
**Date:** 2026-03-04
**Status:** In Progress
**Priority:** High

## Executive Summary

TripFlow is currently on **Tailwind CSS v4** with CSS-first configuration, but has significant custom CSS that should be migrated to utility classes for better maintainability and consistency with the style guide.

## Audit Results

### Current State
- **Tailwind Version**: v4 (already upgraded ✅)
- **Total TypeScript Files**: 136
- **Custom CSS Files**: 2 (globals.css, MapPin.module.css)
- **Files with Inline Styles**: 43

### Custom CSS Breakdown

#### 1. globals.css (388 lines)
**Location**: `src/app/globals.css`

**Current Contents**:
- ✅ `@theme` directive (v4 CSS-first config) - **KEEP**
- ✅ CSS Variables in `:root` and `:root[data-theme="dark"]` - **KEEP**
- ⚠️ `.glass-panel` utility class (lines 224-248) - **MIGRATE**
- ⚠️ Custom scrollbar styles (lines 263-276) - **EVALUATE**
- ⚠️ Typography base styles (lines 251-260) - **KEEP/REFACTOR**
- ⚠️ `@apply` usage in `@layer base` (lines 372-379) - **REFACTOR**
- ✅ Custom animations `@keyframes fadeIn` (lines 292-295) - **CONVERT TO @utility**
- ✅ Base reset (lines 203-221) - **KEEP**
- ✅ Focus styles (lines 286-289) - **KEEP**
- ✅ Reduced motion media queries - **KEEP**

#### 2. MapPin.module.css (56 lines)
**Location**: `src/components/Itinerary/MapPin.module.css`

**Current Contents**:
- ⚠️ `@keyframes pulse-ring` animation - **CONVERT TO @utility**
- ⚠️ `.pin`, `.hovered`, `.selected` classes - **MIGRATE TO TAILWIND**
- ⚠️ `.pulseRing` class - **MIGRATE TO TAILWIND**

**Migration Complexity**: Medium
- CSS Module → Tailwind utilities
- State-based styling (hovered, selected) → Tailwind variants
- Custom animation → `@utility` directive

#### 3. Inline Styles (43 files)
**Locations**: Throughout `src/components/`

**Common Patterns**:
1. **Dynamic colors** (city colors, backgrounds):
   ```tsx
   style={{ color: `var(${config.cssVar})` }}
   style={{ backgroundImage: `url(${trip.imageUrl})` }}
   ```
   **Action**: ✅ **KEEP** - Dynamic values can't be replaced

2. **Font utilities**:
   ```tsx
   style={{ fontVariantNumeric: 'tabular-nums' }}
   ```
   **Action**: ⚠️ **MIGRATE** - Use Tailwind's `tabular-nums` class

3. **Spacing tweaks**:
   ```tsx
   style={{ margin: '0 0 4px 0', marginRight: '4px' }}
   ```
   **Action**: ⚠️ **MIGRATE** - Use Tailwind spacing classes

4. **Layout properties**:
   ```tsx
   style={{ objectFit: 'cover' }}
   style={{ opacity: 0 }}
   ```
   **Action**: ⚠️ **MIGRATE** - Use `object-cover`, `opacity-0`

5. **Link resets**:
   ```tsx
   style={{ textDecoration: 'none', color: 'inherit' }}
   ```
   **Action**: ⚠️ **MIGRATE** - Use `no-underline text-inherit`

## Migration Strategy

### Phase 1: MapPin Component Refactor (HIGH PRIORITY)
**Estimated Time**: 1-2 hours
**Files**: 1

**Before**:
```css
/* MapPin.module.css */
@keyframes pulse-ring { ... }
.pin { ... }
.hovered { ... }
```

**After**:
```css
/* In globals.css */
@utility pulse-ring {
  animation: pulse-ring 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.55; }
  100% { transform: scale(1.9); opacity: 0; }
}
```

```tsx
// MapPin.tsx
<div className={cn(
  "relative rounded-full border-[2.5px] border-white",
  "flex items-center justify-center text-white cursor-pointer",
  "opacity-85 transition-all duration-200 ease-out",
  isHovered && "scale-115 opacity-100",
  isSelected && "scale-130 -translate-y-1 opacity-100 brightness-115"
)}>
  {isHovered && (
    <span className="absolute -inset-[2px] rounded-full border-2 border-[--ring-color] pulse-ring pointer-events-none" />
  )}
</div>
```

**Checklist**:
- [x] Move `@keyframes pulse-ring` to globals.css
- [x] Create `@utility pulse-ring` directive
- [x] Replace CSS classes with Tailwind utilities
- [x] Update component to use `cn()` for conditional classes
- [x] Test hover/selection states
- [x] Delete MapPin.module.css
- [ ] Run E2E tests for Itinerary page (in progress)

### Phase 2: Inline Styles Migration (MEDIUM PRIORITY)
**Estimated Time**: 3-4 hours
**Files**: 43

**Priority Groups**:

#### Group A: Simple Replacements (10 files)
Files with `fontVariantNumeric`, `objectFit`, `textDecoration`, simple spacing.

**Example**:
```tsx
// Before
<div style={{ fontVariantNumeric: 'tabular-nums' }}>

// After
<div className="tabular-nums">
```

**Files**:
- ActivityCard.tsx
- CountdownWidget.tsx
- Dashboard.tsx
- AddActivityModal.tsx
- (6 more)

#### Group B: Keep Dynamic Styles (33 files)
Files with truly dynamic values (city colors, images, computed styles).

**Action**: Review and document - these should stay as inline styles.

### Phase 3: globals.css Refactor (LOW PRIORITY)
**Estimated Time**: 2-3 hours
**Files**: 1

**Goals**:
1. Minimize `@apply` usage in `@layer base`
2. Convert `.glass-panel` to component or document pattern
3. Evaluate custom scrollbar (browser support vs. Tailwind plugin)
4. Move `fadeIn` animation to `@utility`

**Before**:
```css
.glass-panel {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  /* ... 10 more properties */
}
```

**After Option 1 - React Component**:
```tsx
// GlassPanel.tsx
export const GlassPanel = ({ children, className }: Props) => (
  <div className={cn(
    "bg-[var(--bg-surface)] border border-[var(--border-subtle)]",
    "relative rounded-[--radius-lg] shadow-[var(--glass-shadow)]",
    "transition-all duration-[--transition-smooth]",
    "hover:bg-[var(--bg-surface-hover)] hover:-translate-y-0.5",
    "hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]",
    className
  )}>
    {children}
  </div>
);
```

**After Option 2 - Document as Pattern**:
```tsx
// In TRIPFLOW-STYLE-GUIDE.md
## Glass Panel Pattern
Use this class combination for glass panels:
className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] ..."
```

## Tooling Setup

### Automated Migration Tools

#### 1. Official Tailwind Upgrade Tool
```bash
npx @tailwindcss/upgrade
```
**Use for**: Already completed ✅ (project is on v4)

#### 2. CSS to Tailwind Converters
- [Loopple](https://www.loopple.com/low-code-builder/tools/css-to-tailwind-converter)
- [folge.me](https://folge.me/tools/css-to-tailwind-converter)

**Use for**: Converting individual CSS blocks from MapPin.module.css

#### 3. codemod for inline styles
Create custom script to detect replaceable patterns:
```bash
# Find all fontVariantNumeric
grep -r "fontVariantNumeric" tripflow-next/src --include="*.tsx"

# Find all objectFit
grep -r "objectFit" tripflow-next/src --include="*.tsx"
```

### ESLint Rules (Future)
Consider adding:
- `no-restricted-syntax` to prevent new inline styles
- Custom rule to enforce Tailwind over CSS modules

## Implementation Timeline

### Week 1 (March 4-8, 2026)
- [x] **Day 1**: Audit complete
- [x] **Day 1**: Create migration plan (this doc)
- [x] **Day 1**: Phase 1 - MapPin component ✅
- [ ] **Day 2**: Phase 2 Group A - Simple inline styles (5 files)
- [ ] **Day 3**: Phase 2 Group A - Remaining files (5 files)
- [ ] **Day 4**: Testing and style guide validation

### Week 2 (March 11-15, 2026)
- [ ] **Day 1-2**: Phase 3 - globals.css refactor
- [ ] **Day 3**: Document patterns in style guide
- [ ] **Day 4**: Code review with checklist
- [ ] **Day 5**: Final testing and deployment

## Success Criteria

### Quantitative Metrics
- [ ] Reduce CSS Module files from 1 → 0
- [ ] Reduce inline styles in 43 files by 50% (keep only dynamic)
- [ ] Reduce `@apply` usage in globals.css
- [ ] All E2E tests passing
- [ ] No visual regressions

### Qualitative Metrics
- [ ] All migrated code follows style guide (Section 23: Styling Conventions)
- [ ] Uses design tokens (no hardcoded colors)
- [ ] Maintains dark mode support
- [ ] Passes accessibility checks (keyboard, contrast)
- [ ] Code review approved

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Visual regressions | Take before/after screenshots, use Percy/Chromatic |
| Breaking dark mode | Test both themes after each change |
| Performance issues | Benchmark with Lighthouse before/after |
| Accessibility issues | Run axe-core and manual keyboard testing |
| Lost functionality | Comprehensive E2E test suite |

## Rollback Plan

If critical issues arise:
1. Git revert to last stable commit
2. Deploy previous version
3. Document issue in this file
4. Schedule fix for next sprint

## Style Guide Compliance

All refactored code MUST meet checklist (Section 37):
- [ ] TypeScript with strict types
- [ ] Follows shadcn/ui composable pattern
- [ ] Uses design tokens (no hardcoded colors)
- [ ] Responsive (mobile-first)
- [ ] Dark mode support
- [ ] Accessible (keyboard, ARIA, screen reader)
- [ ] Tested (unit + E2E if critical)
- [ ] Documented with usage examples

## References

### Internal Docs
- [TripFlow Style Guide](../TRIPFLOW-STYLE-GUIDE.md)
- [Component Checklist](../TRIPFLOW-STYLE-GUIDE.md#37-component-implementation-checklist)
- [Styling Conventions](../TRIPFLOW-STYLE-GUIDE.md#23-styling-conventions)

### External Resources
- [Tailwind CSS v4 Migration Guide](https://tailwindcss.com/docs/upgrade-guide)
- [shadcn/ui Tailwind v4 Docs](https://ui.shadcn.com/docs/tailwind-v4)
- [CSS to Tailwind: Complete Migration Guide 2026](https://dev.to/arenasbob2024cell/css-to-tailwind-the-complete-migration-guide-for-2026-1cgn)

## Appendix

### File Inventory

#### Custom CSS Files
1. `src/app/globals.css` (388 lines)
2. `src/components/Itinerary/MapPin.module.css` (56 lines)

#### Files with Inline Styles (43 total)
**Itinerary** (13):
- ActivityCard.tsx
- PhotoCarousel.tsx
- Itinerary.tsx
- MapPanel.tsx
- TripOverview.tsx
- DayNavigator.tsx
- CityOverview.tsx
- DayTimeline.tsx
- CityNavigator.tsx
- MapPin.tsx
- CompactDaySummary.tsx
- DaySummary.tsx
- AddActivityModal.tsx

**Dashboard** (2):
- Dashboard.tsx
- CountdownWidget.tsx

**Other Components** (28):
- Voting.tsx
- NotificationsPanel.tsx
- AIGeneratorWizard.tsx
- Budget.tsx
- NotificationBell.tsx
- TripContextBar.tsx
- TravelDayView.tsx
- TripDetail.tsx
- MapContainer.tsx
- TripOverviewLayer.tsx
- AISuggestionsPanel.tsx
- ExpenseSplitter.tsx
- Sidebar.tsx
- BottomTabBar.tsx
- GroupLimitDisplay.tsx
- MockUserSwitcher.tsx
- BlindBudgetForm.tsx
- Bookings.tsx
- CollaborationPanel.tsx
- SettingsModal.tsx
- ExportMenu.tsx
- Globe.tsx
- PlacePhoto.tsx
- ThemeProvider.tsx

**App Files** (5):
- app/page.tsx
- app/layout.tsx
- app/(app)/page.tsx
- app/(app)/trips/[tripId]/layout.tsx

---

**Last Updated**: 2026-03-04
**Next Review**: 2026-03-08 (after Phase 1 completion)
