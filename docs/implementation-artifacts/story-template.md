---
story_id: E##-S##
story_name: Story Name Here
status: in-progress
started: YYYY-MM-DD
completed:
reviewed: false
review_started:
review_gates_passed: []
---

# E##-S##: Story Name Here

## Story Description

[Brief description of what this story delivers and why it matters for TripFlow users]

## Acceptance Criteria

1. **AC1**: [Description of the first acceptance criterion]
   - User can [action]
   - System should [behavior]
   - Expected result: [outcome]

2. **AC2**: [Description of the second acceptance criterion]
   - User can [action]
   - System should [behavior]
   - Expected result: [outcome]

3. **AC3**: [Additional acceptance criteria as needed]

## Tasks

- [ ] **Task 1**: [Description of first implementation task]
- [ ] **Task 2**: [Description of second implementation task]
- [ ] **Task 3**: [Description of third implementation task]

## Dependencies

**Depends on:**
- E##-S## ([Story Name]) - [Why this is needed first]

**Blocks:**
- E##-S## ([Story Name]) - [Why this blocks that story]

## Technical Notes

**Files to Modify:**
- `tripflow-next/src/app/[path]/page.tsx` - [Why]
- `tripflow-next/src/components/[component].tsx` - [Why]

**New Files to Create:**
- `tripflow-next/src/lib/[utility].ts` - [Purpose]

**Tech Stack Patterns:**
- **Data Fetching**: Use TanStack Query with Supabase client
- **State Management**: React hooks or TanStack Query cache
- **Forms**: react-hook-form + zod validation
- **Styling**: Tailwind utilities + CSS variables from globals.css
- **Components**: shadcn/ui for base components

**Key Considerations:**
- [Any important technical decisions or constraints]
- [Performance considerations]
- [Accessibility requirements]
- [Edge cases to handle]

## Implementation Plan

[This section will be auto-populated by /start-story after plan mode]

## Design Review Feedback

[This section will be auto-populated by /review-story if design review runs]

## Code Review Feedback

[This section will be auto-populated by /review-story after code review]

## Testing Notes

**E2E Tests:**
- [Location of story-specific E2E test file, if created]

**Unit Tests:**
- [Location of relevant unit tests]

**Manual Testing:**
1. [Step-by-step manual verification]
2. [Expected results]

## Challenges and Lessons Learned

[This section will be populated during or after implementation]

**Challenges:**
- [Any blockers or difficulties encountered]

**Solutions:**
- [How the challenges were resolved]

**Lessons:**
- [Key takeaways for future stories]

---

**Epic**: E## - [Epic Name]
**Sprint**: [Sprint identifier if applicable]
**Story Points**: [If using story points]
