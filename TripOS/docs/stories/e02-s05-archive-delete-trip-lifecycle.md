---
story_id: E02-S05
story_name: Archive, Delete & Trip Lifecycle
status: done
started: 2026-02-15
completed: 2026-02-15
---

# E02-S05: Archive, Delete & Trip Lifecycle

## Overview
Trip owners can archive completed trips (moves to "Past" section, read-only access) and delete trips with confirmation. Delete requires typing exact trip name. Soft-delete pattern with deleted_at timestamp ensures 404 for deleted trips.

## Implementation Plan

### Phase 1: Database Layer

**1.1 Create RLS DELETE Policy**
```sql
-- Location: supabase/migrations/XXXX_delete_trip_rls.sql
-- Allow soft-delete for owner/organizer only
CREATE POLICY "trip_soft_delete_owner_only"
ON trips FOR DELETE
TO authenticated
USING (
  id IN (SELECT get_my_managed_trip_ids(user_id))
);
```

### Phase 2: Server Actions

**2.1 Create `archive-trip.ts`**
```typescript
// Location: apps/web/src/features/trips/actions/archive-trip.ts
// Pattern: Follow existing update-trip.ts structure
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function archiveTrip(tripId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('trips')
    .update({ status: 'archived' })
    .eq('id', tripId)
    .in('id', supabase.rpc('get_my_managed_trip_ids', { user_id: user.id }))

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/trips')
  revalidatePath(`/trips/${tripId}`)
  return { success: true }
}
```

**2.2 Create `delete-trip.ts`**
```typescript
// Location: apps/web/src/features/trips/actions/delete-trip.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteTrip(tripId: string, confirmationText: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Get trip name for validation
  const { data: trip } = await supabase
    .from('trips')
    .select('name')
    .eq('id', tripId)
    .single()

  if (!trip) {
    return { error: 'Trip not found' }
  }

  // Validate confirmation text matches trip name exactly
  if (confirmationText !== trip.name) {
    return { error: 'Confirmation does not match trip name' }
  }

  // Soft-delete: set deleted_at timestamp and status
  const { error } = await supabase
    .from('trips')
    .update({
      deleted_at: new Date().toISOString(),
      status: 'deleted'
    })
    .eq('id', tripId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/trips')
  return { success: true }
}
```

### Phase 3: UI Components

**3.1 Create `ArchiveTripButton` component**
```tsx
// Location: apps/web/src/features/trips/components/archive-trip-button.tsx
'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useActionState } from 'react'
import { archiveTrip } from '../actions/archive-trip'
import { Loader2 } from 'lucide-react'

interface Props {
  tripId: string
  tripName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ArchiveTripButton({ tripId, tripName, open, onOpenChange }: Props) {
  const [state, formAction, isPending] = useActionState(archiveTrip, null)

  const handleArchive = () => {
    formAction(tripId)
    if (!state?.error) {
      onOpenChange(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archive "{tripName}"?</AlertDialogTitle>
          <AlertDialogDescription>
            This trip will be moved to your Past Trips and will be read-only.
            You can unarchive it later from trip settings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleArchive} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Archive
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

**3.2 Create `DeleteTripDialog` component**
```tsx
// Location: apps/web/src/features/trips/components/delete-trip-dialog.tsx
'use client'

import { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useActionState } from 'react'
import { deleteTrip } from '../actions/delete-trip'
import { Loader2 } from 'lucide-react'

interface Props {
  tripId: string
  tripName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete?: () => void
}

export function DeleteTripDialog({ tripId, tripName, open, onOpenChange, onDelete }: Props) {
  const [confirmationText, setConfirmationText] = useState('')
  const [state, formAction, isPending] = useActionState(deleteTrip, null)
  const isValid = confirmationText === tripName

  const handleSubmit = (formData: FormData) => {
    formData.append('tripId', tripId)
    formAction(formData)
    if (!state?.error && !isPending) {
      onOpenChange(false)
      onDelete?.()
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">Delete "{tripName}"?</AlertDialogTitle>
          <AlertDialogDescription>
            All activities, polls, members, and data will be permanently removed.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form action={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="confirmation">Type "{tripName}" to confirm</Label>
              <Input
                id="confirmation"
                name="confirmationText"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder={tripName}
                className={isValid ? 'border-green-500' : ''}
              />
              {!isValid && confirmationText.length > 0 && (
                <p className="text-sm text-destructive">Does not match trip name</p>
              )}
            </div>
          </div>

          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              disabled={!isValid || isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Trip
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

**3.3 Update `trip-header.tsx` with dropdown menu**
```tsx
// Location: apps/web/src/features/trips/components/trip-header.tsx
// Add DropdownMenu with archive/delete options

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { ArchiveTripButton } from './archive-trip-button'
import { DeleteTripDialog } from './delete-trip-dialog'
import { MoreVertical, Archive, Trash2 } from 'lucide-react'
import { useState } from 'react'

// In the component, add after existing edit button:
{canEdit && (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <MoreVertical className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => setArchiveOpen(true)}>
        <Archive className="mr-2 h-4 w-4" />
        Archive Trip
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="text-destructive focus:text-destructive"
        onClick={() => setDeleteOpen(true)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete Trip
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)}

<ArchiveTripButton
  tripId={trip.id}
  tripName={trip.name}
  open={archiveOpen}
  onOpenChange={setArchiveOpen}
/>
<DeleteTripDialog
  tripId={trip.id}
  tripName={trip.name}
  open={deleteOpen}
  onOpenChange={setDeleteOpen}
  onDelete={() => window.location.href = '/trips'}
/>
```

### Phase 4: Filter Update

**4.1 Update `trip-filters.ts`**
```typescript
// Location: apps/web/src/features/trips/lib/trip-filters.ts
// Update the 'past' filter to include archived trips

export function filterTripsByTab(trips: Trip[], tab: TripTab): Trip[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  switch (tab) {
    case 'past':
      return trips.filter(trip =>
        trip.end_date < today.toISOString() ||
        trip.status === 'archived'
      )
    // ... other cases remain the same
  }
}
```

### Phase 5: Testing

**5.1 Unit Tests**
- Test server action error handling (unauthorized, trip not found)
- Test confirmation validation logic
- Test status changes (active → archived → deleted)

**5.2 E2E Tests**
- Test archive flow (trip appears in Past tab)
- Test delete confirmation dialog (exact match required)
- Test delete redirects to dashboard
- Test 404 for deleted trip URLs

### Design Tokens Reference
- Destructive actions: `--destructive` (red #EF4444)
- Use `destructive` variant for Delete button
- Use `outline` variant for Archive button
- Use `icon` variant for dropdown trigger

### Dependencies Met
- ✅ E02-S01: Trip creation (completed)
- ✅ E02-S02: Dashboard and filters (completed)
- ✅ E02-S03: Search/filtering (completed)
- ✅ E02-S04: Edit trip details (completed)

## Challenges & Struggles
<!-- filled after implementation -->

## Lessons Learned
<!-- filled after implementation -->

## Code Review Feedback

**Status**: Approved (after fixes applied)

**Critical Issues Fixed**:

- Added `.neq('status', 'deleted')` filter to trip page query to ensure 404 for deleted trips
- Fixed revalidation paths in archive action from `/trips` to `/dashboard` and `/trips/${tripId}` to `/trip/${tripId}`

**Improvements Noted**:

- Consider adding `staleTime` to React Query hook (deferred to future story)

**Security Analysis**: PASS - RLS compliance verified, no service_role bypass, proper authorization checks

## Design Review Feedback

**Status**: Approved (no blockers)

**Strengths**:

- Excellent safety patterns with type-to-confirm for delete
- Semantic color compliance (destructive = red)
- Clear visual hierarchy between archive (neutral) and delete (destructive)
- Strong accessibility with ARIA labels, keyboard nav, focus management

**Medium-Priority Suggestions** (optional follow-up):

- Consider using `border-success` token instead of `border-green-500`
- Archive dialog could provide clearer post-action guidance
- Consider "Archive Trip" for parallel structure with "Delete Trip"

## Manual Steps
1. Run migration: `supabase db push` or via Studio
2. Test archive flow (trip → Past tab)
3. Test delete confirmation (exact name match required)
4. Verify 404 for deleted trips
