# Blind Budgeting - Technical Deep Dive

**Created**: February 8, 2026
**Status**: Draft - Technical Specification (Security Review Pending)
**Purpose**: Complete technical specification, UX flows, and privacy architecture for TripOS's unique blind budgeting feature
**Related**: [final-blind-budgeting-decision.md](../research/final-blind-budgeting-decision.md) | [gap-analysis-competitive-positioning.md](./gap-analysis-competitive-positioning.md)

---

## ⚠️ SECURITY REVIEW STATUS

**Version**: 1.1 (Revised after adversarial review)
**Critical Issues Fixed**: 7
**Pending Security Review**: Required before implementation

---

## Executive Summary

Blind budgeting is TripOS's **unique differentiator**—a privacy-first approach to group trip budgeting that solves the social dynamics problem of budget shame. This document specifies the complete technical implementation, UX flows, database schema, and privacy architecture.

**Validation Status**: ✅ GREEN LIGHT (22/25) - See [final-blind-budgeting-decision.md](../research/final-blind-budgeting-decision.md)

**Development Phase**: Phase 5 (Weeks 18-22)

---

## Table of Contents

1. [Problem & Solution Overview](#1-problem--solution-overview)
2. [User Experience Flows](#2-user-experience-flows)
3. [Technical Architecture](#3-technical-architecture)
4. [Database Schema](#4-database-schema)
5. [API Design](#5-api-design)
6. [Privacy & Security](#6-privacy--security)
7. [Edge Cases & Error Handling](#7-edge-cases--error-handling)
8. [Testing Strategy](#8-testing-strategy)
9. [Implementation Checklist](#9-implementation-checklist)

---

## 1. Problem & Solution Overview

### 1.1 The Problem

**Budget Shame prevents honest trip planning:**

| Scenario | What Happens | Result |
|----------|--------------|--------|
| **Rich friend domination** | Wealthy friend suggests $500/night hotels | Broke friend can't afford but won't say so |
| **The "Cheap" label** | Someone speaks up about budget constraints | Gets labeled "the cheap one" for life |
| **Withdrawal** | Person can't afford options | Drops out of trip entirely to avoid shame |
| **Stalled planning** | No one wants to reveal budget | Trip planning stalls indefinitely |

### 1.2 Our Solution: Blind Budgeting

**Core Concept**: Private budget caps → Group affordable limit → Filtered suggestions

```
Member A sets: $1,500 cap  ─┐
Member B sets: $800 cap   ─┼─→ System calculates: $800 group affordable limit
Member C sets: $2,000 cap ─┘       (No one sees individual caps)
                                  ────────────────────────────────
                                  Suggestions shown: ≤$800/night hotels only
```

**Key Properties**:
- Individual budgets are **never visible** to other members
- Only the **group minimum** (lowest cap) is used for filtering
- No one knows WHO set the lowest cap
- Dignity preserved → Everyone participates honestly

### 1.3 User Personas & Use Cases

| Persona | Scenario | How Blind Budgeting Helps |
|---------|----------|---------------------------|
| **Marcus** (College student, broke) | Friends want $300/night hotels | Sets $1,200 cap privately; trip plans to $150/night options |
| **Jessica** (Family planner, varied incomes) | Cousin's boyfriend (wealthy) joining | Everyone sets private caps; system finds middle ground |
| **David** (Budget-conscious) | Doesn't want to be "the cheap one" | Sets cap privately; no one knows he's the constraint |
| **Sarah** (Organizer, wealthy) | Wants everyone to afford trip | Sets high cap; lets system find inclusive options |

---

## 2. User Experience Flows

### 2.1 Setup Flow

#### Step 1: Onboarding / Trip Creation

```
┌─────────────────────────────────────────────────────────────┐
│  Set Your Budget Cap                                        │
│                                                             │
│  💰 How much can you spend on this trip?                    │
│                                                             │
│  This is PRIVATE. Only you will see this number.           │
│                                                             │
│  Your Budget Cap: [$1,500]                                 │
│                                                             │
│  ⓘ What's this?                                            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ We'll use the lowest budget from the group to find  │   │
│  │ options everyone can afford. No one will see your    │   │
│  │ individual budget.                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [Skip for now]  [Set Budget]                              │
└─────────────────────────────────────────────────────────────┘
```

**UX Notes**:
- **Skip is always available** - Don't force users during onboarding
- **Inline help tooltip** - Explains the concept without breaking flow
- **Currency auto-detect** - Based on trip destination
- **Input validation** - Must be > 0, reasonable max (e.g., $100,000)
- **Accessibility**: Full keyboard navigation, ARIA labels, screen reader support

#### Step 2: Budget Confirmation (After Setting)

```
┌─────────────────────────────────────────────────────────────┐
│  ✅ Budget Set                                              │
│                                                             │
│  Your private budget cap: $1,500 USD                       │
│                                                             │
│  ⓘ Remember: This is never shown to other trip members.    │
│                                                             │
│  You can change this anytime in Trip Settings.             │
│                                                             │
│  [Got it]                                                   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 During Trip Planning

#### Group Budget Indicator (Visible to All)

```
┌─────────────────────────────────────────────────────────────┐
│  Trip Budget  ⓘ                                            │
│                                                             │
│  Group Affordable Limit: $800 per person                   │
│                                                             │
│  ✓ All 4 members have set budgets                          │
│                                                             │
│  Suggestions filtered to options everyone can afford.      │
└─────────────────────────────────────────────────────────────┘
```

**Privacy Rules**:
- Show "Group Affordable Limit" (NOT "Group Maximum" - this is the minimum of all budgets)
- For small groups (<5), show vague status: "Most members have set budgets" instead of exact counts
- NEVER show who set budgets
- NEVER show individual caps
- ONLY show the calculated group minimum

### 2.3 Viewing Suggestions (Blind Budgeting in Action)

#### Hotel/Accommodation Search

```
┌─────────────────────────────────────────────────────────────┐
│  Find Hotels                                                │
│                                                             │
│  🔍 Showing options within group budget: ≤$150/night      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🏨 Grand Central Hotel            $145/night         │   │
│  │    ⭐⭐⭐⭐  4.2 (234 reviews)                     │   │
│  │    ✓ Within everyone's budget                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🏨 City Center Inn                 $120/night         │   │
│  │    ⭐⭐⭐  3.8 (156 reviews)                      │   │
│  │    ✓ Within everyone's budget                      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**UX Behavior**:
- **Default**: Hide options above group budget
- **NO "Show anyway" button** - This would out the person with the lowest budget
- Visual indicator: Mark which options are within budget
- Never reveal: Which member's budget caused the filtering

### 2.4 Managing Your Budget

#### Settings Page (Member Only)

```
┌─────────────────────────────────────────────────────────────┐
│  Your Budget Settings  (Only you see this)                  │
│                                                             │
│  Your Private Budget Cap: [$1,500 USD]                     │
│                                                             │
│  Current Group Affordable Limit: $800 per person           │
│                                                             │
│  ⓘ Your individual budget is NEVER shown to other          │
│  members, including the trip organizer.                    │
│                                                             │
│  ⚠️  Your budget changes may affect the group limit,       │
│  but the specific change won't be revealed to others.      │
│                                                             │
│  [Save Changes]  [Cancel]                                   │
└─────────────────────────────────────────────────────────────┘
```

**CRITICAL**: No "What If" preview showing specific values. This prevents probing attacks.

### 2.5 Organizer View (Same as Everyone Else)

**Critical**: Organizers do NOT see individual budgets. They only see the same group limit everyone else sees.

```
┌─────────────────────────────────────────────────────────────┐
│  ⚠️ Important: Even as organizer, you CANNOT see            │
│  individual member budgets. Blind budgeting privacy        │
│  applies to everyone, including you.                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Technical Architecture

### 3.1 System Design

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Budget UI   │  │  Suggestion  │  │   Activity   │     │
│  │  Components  │  │   Filters    │  │    Feed      │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
└─────────┼──────────────────┼──────────────────┼────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                     SUPABASE CLIENT                         │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Client-Side Privacy Filter (Never request raw)    │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE BACKEND                         │
│  ┌────────────────────────────────────────────────────┐    │
│  │              ROW-LEVEL SECURITY (RLS)              │    │
│  │  ┌──────────────────────────────────────────────┐ │    │
│  │  │  Policy: Users can ONLY see their own budget │ │    │
│  │  │  Policy: Group limit computed server-side     │ │    │
│  │  └──────────────────────────────────────────────┘ │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │   blind_budgets  │  │   Computed       │               │
│  │   (RLS Protected)│  │   group_limit    │               │
│  └──────────────────┘  └──────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Privacy Principles

| Principle | Implementation |
|-----------|----------------|
| **Never expose raw data** | Client never queries other users' budgets |
| **Server-side computation** | Group limit calculated in database, never exposed |
| **RLS at database level** | Even API owners can't see individual budgets |
| **Audit logging (hash-only)** | Log changes occurred, not actual amounts |
| **No admin override** | Even system admins cannot view private budgets |
| **Timing attack protection** | Randomized delays for group limit updates |
| **Small group protection** | Vague status counts for groups < 5 members |

### 3.3 Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Database** | PostgreSQL 15+ via Supabase | RLS policies, security_invoker views |
| **API Layer** | Supabase Edge Functions | Budget calculations, filtering |
| **Real-time** | Supabase Realtime (with delay) | Group limit updates with random jitter |
| **State Management** | Zustand | Client-side budget state |
| **Validation** | Zod | Runtime type safety for budget inputs |
| **Currencies** | Open Exchange Rates API | Phase 4 dependency for conversion |

---

## 4. Database Schema

### 4.1 Tables

#### `blind_budgets` Table

```sql
CREATE TABLE blind_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,  -- Stored in cents to avoid floating point
  currency_code CHAR(3) NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure one budget per user per trip
  UNIQUE(trip_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_blind_budgets_trip_id ON blind_budgets(trip_id);
-- Note: No separate user_id index needed - UNIQUE constraint covers it

-- Auto-update trigger for updated_at
CREATE TRIGGER update_blind_budgets_updated_at
  BEFORE UPDATE ON blind_budgets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### Row-Level Security Policies

```sql
-- Enable RLS
ALTER TABLE blind_budgets ENABLE ROW LEVEL SECURITY;

-- POLICY 1: Users can only see their own budget
CREATE POLICY "Users can only see own budget"
  ON blind_budgets
  FOR SELECT
  USING (auth.uid() = user_id);

-- POLICY 2: Users can insert their own budget
CREATE POLICY "Users can insert own budget"
  ON blind_budgets
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- POLICY 3: Users can update their own budget
CREATE POLICY "Users can update own budget"
  ON blind_budgets
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- POLICY 4: Users can delete their own budget
CREATE POLICY "Users can delete own budget"
  ON blind_budgets
  FOR DELETE
  USING (auth.uid() = user_id);
```

### 4.2 Computed Group Limit Function

```sql
-- Function to compute group affordable limit (minimum of all budgets)
-- SECURITY DEFINER + membership check for security
CREATE OR REPLACE FUNCTION get_trip_group_limit(
  p_trip_id UUID,
  p_currency_code CHAR(3) DEFAULT 'USD'
)
RETURNS TABLE (
  group_limit_cents INTEGER,
  member_count INTEGER,
  budget_set_count INTEGER,
  is_small_group BOOLEAN
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  -- First verify the caller is a trip member
  WITH member_check AS (
    SELECT 1
    FROM trip_members
    WHERE trip_id = p_trip_id
      AND user_id = auth.uid()
    LIMIT 1
  ),
  counts AS (
    SELECT
      COUNT(*) as budget_set_count,
      (SELECT COUNT(*) FROM trip_members WHERE trip_id = p_trip_id) as member_count
    FROM blind_budgets
    WHERE trip_id = p_trip_id
      AND currency_code = p_currency_code
  )
  SELECT
    MIN(b.amount_cents) as group_limit_cents,
    c.member_count,
    c.budget_set_count,
    c.member_count < 5 as is_small_group
  FROM member_check mc, blind_budgets b, counts c
  WHERE b.trip_id = p_trip_id
    AND b.currency_code = p_currency_code
  CROSS JOIN c;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION get_trip_group_limit TO authenticated;
```

### 4.3 Views for Client Access

#### `trip_budget_summary` View (PostgreSQL 15+ with security_invoker)

```sql
-- This view provides the public-safe budget summary
-- No individual budgets exposed, only aggregated data
-- security_invoker = true ensures RLS is enforced
CREATE OR REPLACE VIEW trip_budget_summary
WITH (security_invoker = true) AS
SELECT
  b.trip_id,
  COUNT(b.id) as budget_count,
  (SELECT COUNT(*) FROM trip_members WHERE trip_id = b.trip_id) as total_members,
  MIN(b.amount_cents) as group_limit_cents,
  MIN(b.currency_code) as currency_code,  -- Fixed: arbitrary but consistent
  (SELECT COUNT(*) FROM trip_members WHERE trip_id = b.trip_id) < 5 as is_small_group
FROM blind_budgets b
GROUP BY b.trip_id;

-- Grant read access to all trip members (RLS enforced via security_invoker)
GRANT SELECT ON trip_budget_summary TO authenticated;
```

**Note**: If using PostgreSQL < 15, use a SECURITY DEFINER function instead of a view.

### 4.4 Audit Log (Hash-Only for Privacy)

```sql
-- Audit log stores ONLY hashes, never actual amounts
CREATE TABLE blind_budget_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL,
  user_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'created', 'updated', 'deleted', 'accessed'
  amount_hash TEXT NOT NULL,  -- SHA-256 hash, not the actual amount
  accessed_by UUID, -- Who accessed (if different from user_id)
  access_reason TEXT,
  ip_address INET,  -- For security monitoring
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: Only service role can read audit log
ALTER TABLE blind_budget_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access to audit log"
  ON blind_budget_audit_log
  FOR ALL
  USING (auth.role() = 'service_role');

-- Index for security queries
CREATE INDEX idx_audit_log_trip_created ON blind_budget_audit_log(trip_id, created_at DESC);
```

**Hash Function Helper**:
```sql
-- Function to create budget amount hash for audit logging
CREATE OR REPLACE FUNCTION hash_budget_amount(
  amount_cents INTEGER,
  user_id UUID,
  trip_id UUID
)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE PARALLEL SAFE
AS $$
  SELECT encode(
    digest(amount_cents::TEXT || user_id::TEXT || trip_id::TEXT || 'salt-from-env', 'sha256'),
    'hex'
  );
$$;
```

### 4.5 Rate Limiting Table

```sql
-- Track budget changes to enforce rate limits
CREATE TABLE blind_budget_rate_limit (
  user_id UUID PRIMARY KEY,
  last_change_at TIMESTAMPTZ NOT NULL,
  change_count INTEGER DEFAULT 1
);

-- Clean up old entries (run via cron job)
DELETE FROM blind_budget_rate_limit WHERE last_change_at < NOW() - INTERVAL '1 hour';
```

---

## 5. API Design

### 5.1 Edge Functions

#### `set-budget` Edge Function (Supabase v2 API)

```typescript
// supabase/functions/set-budget/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // Verify authentication using Supabase v2 API
  const authHeader = req.headers.get('Authorization')!
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )

  // Get authenticated user (v2 syntax)
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const { tripId, amountCents, currencyCode = 'USD' } = await req.json()

  // Validation
  if (amountCents < 0) {
    return new Response(JSON.stringify({ error: 'Budget cannot be negative' }), { status: 400 })
  }
  if (amountCents > 10000000) {
    return new Response(JSON.stringify({ error: 'Budget exceeds maximum allowed' }), { status: 400 })
  }

  // Verify user is a trip member
  const { data: member, error: memberError } = await supabase
    .from('trip_members')
    .select('role')
    .eq('trip_id', tripId)
    .eq('user_id', user.id)
    .single()

  if (memberError || !member) {
    return new Response(JSON.stringify({ error: 'Not a trip member' }), { status: 403 })
  }

  // Rate limit check (max 1 change per minute)
  const { data: rateLimit } = await supabase
    .from('blind_budget_rate_limit')
    .select('last_change_at, change_count')
    .eq('user_id', user.id)
    .single()

  if (rateLimit) {
    const timeSinceLastChange = Date.now() - new Date(rateLimit.last_change_at).getTime()
    if (timeSinceLastChange < 60000) {  // 60 seconds
      return new Response(JSON.stringify({
        error: 'Please wait before changing your budget again',
        retryAfter: Math.ceil((60000 - timeSinceLastChange) / 1000)
      }), { status: 429 })
    }
  }

  // Get old budget for audit hash
  const { data: oldBudget } = await supabase
    .from('blind_budgets')
    .select('amount_cents')
    .eq('trip_id', tripId)
    .eq('user_id', user.id)
    .single()

  // Upsert budget
  const { data, error } = await supabase
    .from('blind_budgets')
    .upsert({
      trip_id: tripId,
      user_id: user.id,
      amount_cents: amountCents,
      currency_code: currencyCode
    })
    .select('amount_cents, currency_code')
    .single()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  // Update rate limit
  await supabase
    .from('blind_budget_rate_limit')
    .upsert({
      user_id: user.id,
      last_change_at: new Date().toISOString(),
      change_count: (rateLimit?.change_count || 0) + 1
    })

  // Log audit (hash-only, no actual amounts)
  const oldHash = oldBudget
    ? await supabase.rpc('hash_budget_amount', {
        amount_cents: oldBudget.amount_cents,
        user_id: user.id,
        trip_id: tripId
      })
    : null

  const newHash = await supabase.rpc('hash_budget_amount', {
    amount_cents,
    user_id: user.id,
    trip_id: tripId
  })

  await supabase.from('blind_budget_audit_log').insert({
    trip_id: tripId,
    user_id: user.id,
    action: oldBudget ? 'updated' : 'created',
    amount_hash: newHash.data,
    accessed_by: user.id,
    ip_address: req.headers.get('x-forwarded-for')?.split(',')[0] || null,
    user_agent: req.headers.get('user-agent') || null
  })

  // Return ONLY user's own budget (privacy preserved)
  return new Response(JSON.stringify({
    success: true,
    budget: {
      amount_cents: data.amount_cents,
      currency_code: data.currency_code
    }
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

#### `get-group-limit` Edge Function

```typescript
// supabase/functions/get-group-limit/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const authHeader = req.headers.get('Authorization')!
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const { tripId, currencyCode = 'USD' } = await req.json()

  // Verify membership BEFORE returning any data
  const { data: member } = await supabase
    .from('trip_members')
    .select('id')
    .eq('trip_id', tripId)
    .eq('user_id', user.id)
    .single()

  if (!member) {
    return new Response(JSON.stringify({ error: 'Not a trip member' }), { status: 403 })
  }

  // Call the function (which has its own membership check as defense-in-depth)
  const { data, error } = await supabase
    .rpc('get_trip_group_limit', {
      p_trip_id: tripId,
      p_currency_code: currencyCode
    })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  const result = data[0] || { group_limit_cents: null, member_count: 0, budget_set_count: 0, is_small_group: false }

  // For small groups, return vague counts to prevent inference
  const response = {
    group_limit_cents: result.group_limit_cents,
    budget_status: result.is_small_group
      ? (result.budget_set_count === result.member_count ? 'All set' : 'Most set')
      : `${result.budget_set_count} of ${result.member_count} set`,
    is_small_group: result.is_small_group
  }

  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### 5.2 Client-Side Hooks

#### `useBlindBudget` Hook (Complete Implementation)

```typescript
// src/features/budget/hooks/useBlindBudget.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Budget = Database['public']['Tables']['blind_budgets']['Row']
type GroupLimit = {
  group_limit_cents: number | null
  budget_status: string
  is_small_group: boolean
}

export function useBlindBudget(tripId: string) {
  const queryClient = useQueryClient()

  // Get authenticated user
  const { data: { user } } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser()
      return data
    }
  })

  // Get user's own budget (private)
  const { data: myBudget, isLoading: loadingMyBudget } = useQuery<Budget>({
    queryKey: ['blind-budget', tripId, 'my-budget'],
    queryFn: async () => {
      if (!user?.id) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('blind_budgets')
        .select('amount_cents, currency_code, created_at, updated_at')
        .eq('trip_id', tripId)
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data
    },
    enabled: !!user?.id
  })

  // Get group limit (public, aggregated)
  const { data: groupLimit, isLoading: loadingGroupLimit } = useQuery<GroupLimit>({
    queryKey: ['blind-budget', tripId, 'group-limit'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-group-limit', {
        body: { tripId, currencyCode: 'USD' }
      })

      if (error) throw error
      return data
    },
    refetchInterval: 30000  // Poll every 30s for non-realtime fallback
  })

  // Set budget mutation
  const setBudget = useMutation({
    mutationFn: async (amountCents: number) => {
      const { data, error } = await supabase.functions.invoke('set-budget', {
        body: { tripId, amountCents, currencyCode: 'USD' }
      })

      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: () => {
      // Invalidate both queries
      queryClient.invalidateQueries({ queryKey: ['blind-budget', tripId] })
    }
  })

  return {
    myBudget,
    groupLimit,
    isLoading: loadingMyBudget || loadingGroupLimit,
    setBudget: setBudget.mutate,
    isSettingBudget: setBudget.isPending,
    setBudgetError: setBudget.error
  }
}
```

### 5.3 Real-time Subscriptions (With Timing Protection)

```typescript
// Subscribe to group limit changes with randomized delay
useEffect(() => {
  if (!tripId) return

  // Random delay between 5-15 seconds to prevent timing attacks
  const randomDelay = Math.floor(Math.random() * 10000) + 5000

  const channel = supabase
    .channel(`budget-changes-${tripId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'blind_budgets',
        filter: `trip_id=eq.${tripId}`
      },
      async () => {
        // Apply random delay before updating
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['blind-budget', tripId, 'group-limit'] })
        }, randomDelay)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [tripId, queryClient])
```

---

## 6. Privacy & Security

### 6.1 Threat Model

| Threat | Mitigation |
|--------|------------|
| **Client-side attack** (devtools inspection) | RLS blocks access at database level |
| **API compromise** (stolen API key) | RLS policies apply even with API key |
| **Database breach** | Audit logs store hashes only, not amounts |
| **Insider threat** (admin snooping) | Hash-only audit + no admin override |
| **SQL injection** | Prepared statements + RLS prevents cross-user access |
| **Session hijacking** | Standard auth tokens + short-lived sessions |
| **Probing attacks** ("What If" preview) | Removed from UI, no feedback on specific values |
| **Timing attacks** | Randomized delays (5-15s) on group limit updates |
| **Small group inference** | Vague status ("Most set") for groups < 5 |
| **Rate limit bypass** | Database-backed rate limiting with 1-min cooldown |

### 6.2 Security Checklist

Before launch, verify:

- [ ] User A cannot query User B's budget (direct SQL test)
- [ ] RLS policies block cross-trip access
- [ ] Audit log contains hashes only, never amounts
- [ ] "What If" preview is removed from settings
- [ ] Small groups show vague counts
- [ ] Timing delays prevent immediate correlation
- [ ] Rate limiting enforced server-side
- [ ] View uses security_invoker (PostgreSQL 15+)
- [ ] All API calls verify trip membership
- [ ] No "Show anyway" button that outs lowest budget

### 6.3 Data Lifecycle

| Event | Action |
|-------|--------|
| **Trip created** | No budget data until users set |
| **User sets budget** | Hash logged to audit |
| **User leaves trip** | Budget deleted, group limit recalculated |
| **Trip ends** | Budgets retained for 90 days, then purged |
| **User deletes account** | All budgets deleted via CASCADE |
| **Export request (GDPR)** | Export user's own budgets only, never others |

### 6.4 Accessibility Requirements

Per WCAG 2.1 AA:

- Budget input: Full keyboard support, ARIA labels, error announcements
- Screen reader: "Group Affordable Limit" announced clearly
- Focus management: Logical tab order, visible focus indicators
- Color: Status not conveyed by color alone (icons + text)
- Touch: 44x44px minimum tap targets
- Language: Simple language for budget concepts

---

## 7. Edge Cases & Error Handling

### 7.1 Core Edge Cases

| Scenario | Behavior |
|----------|----------|
| **No budgets set** | Show "No budgets set" message, no filtering |
| **Only 1 budget set** | Group limit = that budget, show "1 of X" (or vague if small group) |
| **Currency mismatch** | **BLOCK**: Require all budgets in trip's base currency (Phase 4 adds conversion) |
| **User leaves trip** | Budget deleted, group limit recalculated after random delay |
| **User sets $0 budget** | Valid (free trip), filter to $0 options |
| **User sets extremely high budget** | Clamped at $100,000 |
| **Organizer wants to see budgets** | Same as everyone else: only group limit |
| **Frequent budget changes** | Rate limited: max 1 change per minute, 429 error with retry-after |

### 7.2 Group Composition Changes

| Event | Privacy Handling |
|-------|------------------|
| **Member removed (was lowest)** | Group limit increases after delay, no indication who was removed |
| **New member joins** | Sees existing group limit, may cause anchoring bias (documented limitation) |
| **Trip merged** | Invalidate all budgets, require re-setting |
| **Trip split** | Create new budgets table for split trip |

### 7.3 Error Messages (User-Facing)

| Error | Message |
|----------------------------|
| Negative budget | "Budget cannot be negative. Please enter a positive amount." |
| Budget too high | "Budget exceeds maximum allowed ($100,000). Contact support if you need more." |
| Not a member | "You must be a trip member to set a budget." |
| Rate limited | "Please wait {X} seconds before changing your budget again." |
| Currency mismatch | "All budgets must be in USD. Multi-currency support coming soon." |
| Network error | "Unable to save budget. Check your connection and try again." |

---

## 8. Testing Strategy

### 8.1 Privacy Regression Tests

```typescript
// tests/security/blind-budget-privacy.test.ts
describe('Blind Budget Privacy', () => {
  it('should NOT allow user A to see user B budget', async () => {
    const userA = await createUser()
    const userB = await createUser()
    const trip = await createTrip([userA.id, userB.id])

    await setBudget(userB, trip.id, 50000)

    // Direct table query - should fail
    const result = await supabase(userA)
      .from('blind_budgets')
      .select('*')
      .eq('user_id', userB.id)

    expect(result.error).toBeTruthy()
    expect(result.data).toBeNull()
  })

  it('should NOT reveal who set the lowest budget', async () => {
    const users = await createUsers(4)
    const trip = await createTrip(users.map(u => u.id))

    await setBudget(users[0], trip.id, 10000)  // Lowest
    await setBudget(users[1], trip.id, 50000)
    await setBudget(users[2], trip.id, 100000)
    await setBudget(users[3], trip.id, 200000)

    const groupLimit = await getGroupLimit(users[0], trip.id)
    expect(groupLimit.group_limit_cents).toBe(10000)

    // Verify no user IDs exposed
    expect(groupLimit.lowest_user_id).toBeUndefined()
  })

  it('should NOT allow probing via "What If" scenarios', async () => {
    const user = await createUser()
    const trip = await createTrip([user.id, (await createUser()).id])

    // Set initial budget
    await setBudget(user, trip.id, 50000)

    // Try to probe by changing value
    const result1 = await setBudget(user, trip.id, 30000)
    expect(result1.feedback_on_group_limit).toBeUndefined()

    const result2 = await setBudget(user, trip.id, 100000)
    expect(result2.feedback_on_group_limit).toBeUndefined()
  })
})
```

### 8.2 Small Group Inference Tests

```typescript
describe('Small Group Privacy', () => {
  it('should hide exact counts for 3-person trips', async () => {
    const users = await createUsers(3)
    const trip = await createTrip(users.map(u => u.id))

    await setBudget(users[0], trip.id, 10000)

    const result = await getGroupLimit(users[0], trip.id)
    expect(result.is_small_group).toBe(true)
    expect(result.budget_status).toMatch(/Most set|All set/)
    expect(result.budget_status).not.toContain('1 of 3')
  })

  it('should show exact counts for 8-person trips', async () => {
    const users = await createUsers(8)
    const trip = await createTrip(users.map(u => u.id))

    await setBudget(users[0], trip.id, 10000)

    const result = await getGroupLimit(users[0], trip.id)
    expect(result.is_small_group).toBe(false)
    expect(result.budget_status).toBe('1 of 8 set')
  })
})
```

### 8.3 Timing Attack Tests

```typescript
describe('Timing Attack Protection', () => {
  it('should add random delay to group limit updates', async () => {
    const users = await createUsers(6)
    const trip = await createTrip(users.map(u => u.id))

    const startTime = Date.now()
    await setBudget(users[0], trip.id, 50000)
    const elapsed = Date.now() - startTime

    // Update should be instant for user
    expect(elapsed).toBeLessThan(1000)

    // But group limit notification to others should be delayed
    const updateReceived = await waitForGroupLimitUpdate(users[1], trip.id)
    const notificationDelay = updateReceived - startTime

    expect(notificationDelay).toBeGreaterThanOrEqual(5000)  // Min 5s delay
    expect(notificationDelay).toBeLessThanOrEqual(15000)    // Max 15s delay
  })
})
```

### 8.4 RLS Bypass Tests

```typescript
describe('RLS Security', () => {
  it('should block view-based bypass attempts', async () => {
    const userA = await createUser()
    const userB = await createUser()
    const trip = await createTrip([userA.id, userB.id])

    await setBudget(userB, trip.id, 50000)

    // Try to access via view (should still be blocked by security_invoker)
    const result = await supabase(userA)
      .from('trip_budget_summary')
      .select('*')
      .eq('trip_id', trip.id)

    // Should only see aggregated data, not individual
    expect(result.data[0].budget_count).toBeDefined()
    expect(result.data[0].individual_budgets).toBeUndefined()
  })

  it('should block RPC injection attempts', async () => {
    const user = await createUser()
    const trip = await createTrip([user.id])

    // Try to inject additional SQL
    const result = await supabase(user).rpc('get_trip_group_limit', {
      p_trip_id: trip.id,
      p_currency_code: "USD'; SELECT * FROM blind_budgets; --"
    })

    expect(result.error).toBeTruthy()
  })
})
```

### 8.5 Audit Log Privacy Tests

```typescript
describe('Audit Log Privacy', () => {
  it('should store hashes, not amounts', async () => {
    const user = await createUser()
    const trip = await createTrip([user.id])

    await setBudget(user, trip.id, 50000)

    const auditLog = await supabase.rpc('admin_get_audit_log', { trip_id: trip.id })

    expect(auditLog[0].amount_cents).toBeUndefined()
    expect(auditLog[0].amount_hash).toMatch(/^[a-f0-9]{64}$/)  // SHA-256 hex
  })

  it('should not allow hash reversal to amounts', async () => {
    // Verify that hashes are salted and cannot be reversed
    const hash1 = await hashBudgetAmount(50000, user1.id, trip1.id)
    const hash2 = await hashBudgetAmount(50000, user1.id, trip1.id)

    expect(hash1).toBe(hash2)  // Same input = same hash
    expect(hash1).not.toMatch(/50000/)  // Amount not in hash
  })
})
```

---

## 9. Implementation Checklist

### Phase 5: Blind Budgeting Development (Weeks 18-22)

#### Week 18: Database & Foundation
- [ ] Create `blind_budgets` table with RLS policies
- [ ] Create `get_trip_group_limit` function (with membership check)
- [ ] Create `trip_budget_summary` view (security_invoker)
- [ ] Create `blind_budget_audit_log` table (hash-only)
- [ ] Create `blind_budget_rate_limit` table
- [ ] Create `hash_budget_amount` function
- [ ] Create `update_updated_at_column` trigger
- [ ] Write database migration
- [ ] **SECURITY AUDIT**: Test RLS policies with direct SQL

#### Week 19: API Layer
- [ ] Implement `set-budget` Edge Function (v2 API, rate limiting)
- [ ] Implement `get-group-limit` Edge Function (membership check)
- [ ] Add Supabase v2 authentication helpers
- [ ] Add rate limiting with 429 retry-after
- [ ] Add hash-only audit logging
- [ ] Write API integration tests
- [ ] **SECURITY AUDIT**: Test API with stolen tokens

#### Week 20: Frontend Components
- [ ] Budget setup onboarding modal
- [ ] Budget settings page (NO "What If" preview)
- [ ] Group limit indicator component
- [ ] Budget edit form
- [ ] "What's blind budgeting?" tooltip
- [ ] Small group vague status display
- [ ] **A11Y AUDIT**: Screen reader testing

#### Week 21: Integration & Filtering
- [ ] Integrate with accommodation search filter
- [ ] NO "Show anyway" button (removed for privacy)
- [ ] Real-time subscriptions with random delays
- [ ] Activity feed events (vague: "Budget updated")
- [ ] Currency validation (block mismatch, Phase 4 for conversion)

#### Week 22: Testing & Polish
- [ ] Privacy regression tests (full suite)
- [ ] Small group inference tests
- [ ] Timing attack tests
- [ ] RLS bypass tests
- [ ] Audit log privacy tests
- [ ] Security penetration testing (external)
- [ ] Mobile responsive testing
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Explainer video (60 seconds)
- [ ] Interactive demo with fake data
- [ ] **SECURITY SIGN-OFF**: Required before launch

---

## Appendix A: FAQ

**Q: What if no one sets a budget?**
A: No filtering is applied. All options are shown.

**Q: Can the organizer override the group limit?**
A: No. Organizers have the same visibility as everyone else.

**Q: Can I see who set the lowest budget?**
A: No. This is the core privacy guarantee.

**Q: Is my budget encrypted?**
A: For MVP, Row-Level Security provides strong privacy. Phase 7+ will add encryption-at-rest.

**Q: Why can't I see "What if I change my budget to X"?**
A: This would let you probe to discover others' budgets. Privacy > convenience.

**Q: Why the random delay on updates?**
A: Prevents timing attacks where you correlate your budget change with group limit changes.

**Q: What if the group is only 3 people?**
A: We show vague status ("Most members have set budgets") to prevent inference.

**Q: Can I use different currencies?**
A: Not yet. All budgets must be in the trip's base currency. Multi-currency coming in Phase 4.

---

## Appendix B: Security Review Findings (v1.1)

**Fixed Issues**:
1. ✅ Removed "What If" preview (probing attack vector)
2. ✅ Renamed "Group Maximum" to "Group Affordable Limit" (clarity)
3. ✅ Fixed trip_budget_summary SQL bug (ambiguous self-reference)
4. ✅ Audit log now stores hashes only, not amounts
5. ✅ Added membership check to get-group-limit
6. ✅ Updated to Supabase v2 API syntax
7. ✅ Removed "Show anyway" button

**Added Protections**:
8. ✅ Timing attack mitigation (random delays)
9. ✅ Small group vague status
10. ✅ Rate limiting implementation
11. ✅ updated_at trigger
12. ✅ Data lifecycle policy
13. ✅ Accessibility requirements

**Pending**:
- External security penetration testing
- Currency conversion (Phase 4 dependency)

---

## Document Status

**Version**: 1.1 (Security-hardened)
**Last Updated**: February 8, 2026
**Status**: ⚠️ **REQUIRES EXTERNAL SECURITY REVIEW BEFORE IMPLEMENTATION**

**Dependencies**:
- [final-blind-budgeting-decision.md](../research/final-blind-budgeting-decision.md)
- [gap-analysis-competitive-positioning.md](./gap-analysis-competitive-positioning.md)

**Next Steps**:
1. External security review of this specification
2. Phase 3 user interviews (validate UX, trust understanding)
3. Database migration development
4. Security penetration testing (before launch)
