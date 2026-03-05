# Democratic Decision-Making: Structured Voting System - Deep Dive

**Created**: February 8, 2026
**Status**: Complete - Ready for Implementation
**Purpose**: Comprehensive feature specification for TripOS's killer feature - structured voting and democratic decision-making

**Based On**:
- [gap-analysis-competitive-positioning.md](gap-analysis-competitive-positioning.md) - Section 1.2 Market Gap Analysis
- Competitive research: Wanderlog (weak hearts), Kayak (disconnected Huddle), others (nothing)

---

## Executive Summary

**The Problem**: Group travel decisions happen in chaotic WhatsApp threads. 47 messages about dinner, no decision by bedtime. Silent members don't participate. Vocal members dominate. No record of what was decided or why.

**The Solution**: Structured voting integrated into every aspect of trip planning. Polls with deadlines, quorum requirements, multiple vote types, decision history, and automated reminders.

**Competitive Gap**:
- **Wanderlog**: Basic "hearts" (likes), not structured voting
- **Kayak**: Trip Huddle (disconnected from main app, pre-booking only)
- **Others**: Nothing (Lambus users cite "no voting" as #1 missing feature)

**Our Advantage**: Built into foundation, not bolt-on. Democratic decision-making IS the product.

---

## Table of Contents

1. [User Stories & Jobs-to-be-Done](#1-user-stories--jobs-to-be-done)
2. [Vote Types & When to Use Each](#2-vote-types--when-to-use-each)
3. [Core Features & Requirements](#3-core-features--requirements)
4. [User Flows & Wireframes](#4-user-flows--wireframes)
5. [Technical Implementation](#5-technical-implementation)
6. [Decision Logic & Algorithms](#6-decision-logic--algorithms)
7. [Edge Cases & Error Handling](#7-edge-cases--error-handling)
8. [UX Principles & Design Guidelines](#8-ux-principles--design-guidelines)
9. [Notifications & Reminders](#9-notifications--reminders)
10. [Success Metrics](#10-success-metrics)

---

## 1. User Stories & Jobs-to-be-Done

### 1.1 Primary User Stories

**As Sarah (Persona 1 - The Organizer)**, I want to:
- Create a poll so the group decides instead of me deciding alone
- Set a deadline so we don't debate endlessly
- See who hasn't voted yet so I can remind them
- Have a record of decisions so people can't say "I never agreed to that"

**As Marcus (Persona 2 - The Budget-Conscious Friend)**, I want to:
- Vote anonymously on expensive options without judgment
- Veto options I truly can't afford
- See voting results without revealing my individual vote
- Participate equally despite having less money

**As Jessica (Persona 3 - The Family Trip Coordinator)**, I want to:
- Require quorum (8 of 12 must vote) before deciding
- Use ranked choice for complex decisions (multiple destination options)
- Respect everyone's input (including quiet family members)
- Avoid family drama by making the process objective

**As Alex (Persona 4 - The Efficient Planner)**, I want to:
- Vote quickly on my phone (not desktop-only)
- Use templates ("Where to eat tonight?") for common decisions
- See results in real-time as people vote
- Not be blocked by slow voters (deadlines enforce progress)

**As David (Persona 5 - The Indecisive Friend)**, I want to:
- See all options clearly before voting
- Change my vote if I change my mind
- Understand what happens if I don't vote (does my vote count as abstain?)
- Not hold up the group (deadline makes me commit)

---

### 1.2 Jobs-to-be-Done Framework

**When** I need to make a group decision about our trip,
**I want to** create a structured poll with clear options and rules,
**So that** everyone participates fairly and we reach consensus without endless debate.

**Functional Job**: Collect group input and determine winning option
**Emotional Job**: Reduce anxiety about being the "decider", avoid conflict
**Social Job**: Ensure everyone feels heard and respected

---

## 2. Vote Types & When to Use Each

### 2.1 Vote Type Matrix

| Vote Type | When to Use | Example Scenarios | Decision Logic |
|-----------|-------------|-------------------|----------------|
| **Yes/No** | Simple binary decision | - "Should we add a day trip to Kyoto?"<br/>- "Book this hotel?"<br/>- "Wake up at 6am for sunrise?" | ≥50% yes = approved<br/>≥50% no = rejected<br/>Tie = status quo (no change) |
| **Single Choice** | Pick one option from list | - "Which restaurant tonight?"<br/>- "Morning, afternoon, or evening flight?"<br/>- "Beach, museum, or hiking?" | Highest vote count wins<br/>Ties handled by runoff or organizer |
| **Ranked Choice** | Complex decision, many options | - "Rank 5 destination cities"<br/>- "Priority order: hotel, flights, activities"<br/>- "Top 3 restaurants" | Instant runoff voting<br/>Eliminates lowest, redistributes |
| **Approval Voting** | Multiple acceptable options | - "Which activities are you OK with?"<br/>- "Approve all restaurants you'd eat at"<br/>- "Which dates work for you?" | Options with most approvals win<br/>Can approve 0 to all options |
| **Veto** | Critical constraint | - "Veto if you absolutely can't do this"<br/>- "Block if outside your budget"<br/>- "Reject if allergic/religious reason" | 1 veto = option eliminated<br/>Rarely used, serious only |

---

### 2.2 Detailed Vote Type Specifications

#### **2.2.1 Yes/No Vote**

**Description**: Simple binary decision (approve or reject)

**Use Cases**:
- Add/remove activity from itinerary
- Book a specific hotel/flight
- Change travel dates
- Approve budget increase
- Accept new member to trip

**UI Elements**:
- Large Yes/No buttons (green/red)
- Real-time vote counts (if public)
- Progress bar: "5 of 8 voted"
- Optional: Show who voted what (if transparency enabled)

**Decision Logic**:
```
if (yes_votes / total_votes >= 0.5):
    result = "APPROVED"
elif (no_votes / total_votes >= 0.5):
    result = "REJECTED"
else:
    result = "TIE" (defaults to status quo - no change)
```

**Example**:
> **Poll**: Should we add a cooking class in Rome?
> - 6 Yes (75%)
> - 2 No (25%)
> - **Result**: APPROVED ✅

---

#### **2.2.2 Single Choice Vote**

**Description**: Pick exactly one option from 2+ choices

**Use Cases**:
- Choose restaurant for tonight
- Pick hotel from shortlist
- Select activity for afternoon
- Choose departure time

**UI Elements**:
- Radio buttons (only one selectable)
- Option details expandable (price, location, reviews)
- Real-time vote distribution (bar chart)
- Highlight winning option dynamically

**Decision Logic**:
```
winner = option with most votes

if (tie for first place):
    if (deadline passed):
        organizer breaks tie OR automatic runoff
    else:
        extend deadline, notify tied voters
```

**Example**:
> **Poll**: Where to eat dinner tonight?
> - Pizza Napoli: 4 votes (50%)
> - Sushi Bar: 3 votes (37.5%)
> - Thai Street Food: 1 vote (12.5%)
> - **Winner**: Pizza Napoli 🍕

---

#### **2.2.3 Ranked Choice Vote** (Phase 3+)

**Description**: Rank options in order of preference (1st, 2nd, 3rd...)

**Use Cases**:
- Choose destination city (many options)
- Prioritize activities (can't do all)
- Rank hotel preferences
- Order multi-city itinerary

**UI Elements**:
- Drag-to-reorder list
- Number badges (1, 2, 3...)
- "Rank your top 3" instruction
- Explanation: "If your #1 doesn't win, your #2 vote counts"

**Decision Logic** (Instant Runoff Voting):
```
1. Count first-choice votes
2. If option has >50%, it wins
3. If no majority:
   - Eliminate option with fewest first-choice votes
   - Redistribute those votes to voters' next choice
   - Repeat until winner has >50%
```

**Example**:
> **Poll**: Choose our destination city
>
> **Round 1** (first choices):
> - Barcelona: 3 votes (37.5%)
> - Lisbon: 2 votes (25%)
> - Porto: 2 votes (25%)
> - Seville: 1 vote (12.5%)
>
> No majority → Eliminate Seville (lowest)
>
> **Round 2** (Seville voter's 2nd choice was Porto):
> - Barcelona: 3 votes (37.5%)
> - Porto: 3 votes (37.5%) [gained 1]
> - Lisbon: 2 votes (25%)
>
> Still no majority → Eliminate Lisbon
>
> **Round 3** (Lisbon voters' 2nd choices: 1 Barcelona, 1 Porto):
> - Barcelona: 4 votes (50%)
> - Porto: 4 votes (50%)
>
> Tie → Organizer breaks OR extend deadline

**Note**: Ranked choice is complex. Include explainer video in UI.

---

#### **2.2.4 Approval Voting**

**Description**: Check all options you approve (0 to all)

**Use Cases**:
- "Which dates work for you?" (select all that work)
- "Approve all activities you'd enjoy"
- "Which restaurants are you OK with?"
- Finding consensus (options most people approve)

**UI Elements**:
- Checkboxes (multi-select)
- "Select all you approve" instruction
- Approval count per option (e.g., "6 of 8 approve")
- Sort by approval rate

**Decision Logic**:
```
approval_count = {option: count of approvals}
winner = option(s) with most approvals

# Can select top N winners
top_3_restaurants = sorted(approval_count)[:3]
```

**Example**:
> **Poll**: Which activities are you interested in? (Check all you approve)
>
> - Bike tour: 7 approvals (87.5%) ✅
> - Cooking class: 6 approvals (75%) ✅
> - Museum visit: 5 approvals (62.5%)
> - Boat tour: 4 approvals (50%)
> - Nightclub: 2 approvals (25%)
>
> **Result**: Let's do bike tour and cooking class (top 2 by approval)

---

#### **2.2.5 Veto Vote** (Use Sparingly)

**Description**: Any member can block an option with serious reason

**Use Cases**:
- Budget constraint ("I absolutely can't afford this")
- Accessibility issue ("I can't hike 10 miles")
- Dietary restriction ("I'm allergic to seafood")
- Religious/ethical concern ("I don't drink alcohol")

**UI Elements**:
- Red "Veto" button (visually serious)
- Required: "Why are you vetoing?" text field (keeps people honest)
- Warning: "Vetoes are rare and serious. Use only if you truly cannot do this option."
- Veto count visible: "1 member vetoed this option"

**Decision Logic**:
```
if (any member vetoes):
    option.status = "ELIMINATED"
    reason = veto.reason  # Display to group

# Psychological check:
if (user_veto_count > 3 in same trip):
    show_warning("You've used 3 vetoes. Consider if alternatives exist.")
```

**Social Dynamics**:
- Vetoes are transparent (everyone sees who vetoed and why)
- Encourages restraint (don't want to be "the person who vetoes everything")
- Protects individuals with real constraints

**Example**:
> **Poll**: Choose restaurant for tonight
>
> - Seafood Shack: ~~6 votes~~ **VETOED by Sarah** ❌
>   - Reason: "Severe shellfish allergy, can't risk cross-contamination"
> - Pizza Napoli: 5 votes ✅
> - Thai Street: 3 votes
>
> **Winner**: Pizza Napoli (Seafood eliminated by veto)

---

## 3. Core Features & Requirements

### 3.1 Poll Creation

**Required Fields**:
- **Question**: "Where to eat tonight?" (max 200 chars)
- **Vote Type**: Yes/No, Single Choice, Ranked Choice, Approval, Veto
- **Options**: 2-10 options (if not Yes/No)
- **Deadline**: Optional (default: 24 hours from now)
- **Quorum**: Optional (default: all members must vote)
- **Visibility**: Public results (default) or anonymous

**Optional Fields**:
- **Description**: Additional context (500 chars)
- **Attachments**: Photos, links, location pins for options
- **Estimated Cost**: Show cost per option (helps budget-conscious voters)
- **Notification**: Remind non-voters at deadline - 2 hours

**Templates** (Quick Start):
- "Where to eat? (tonight)"
- "Choose hotel (from shortlist)"
- "Pick activity (for afternoon)"
- "Should we add this? (Yes/No)"
- "Which dates work? (Approval voting)"

---

### 3.2 Voting Interface

**Requirements**:
- ✅ Mobile-first (works on phone)
- ✅ <3 taps to vote
- ✅ Visual feedback (button changes color when selected)
- ✅ Confirm vote (prevent accidental taps)
- ✅ Change vote allowed (until deadline)
- ✅ Real-time results (if public)
- ✅ Show who voted / who hasn't (if transparency enabled)

**UI Elements**:
- Poll card in activity feed
- Large, thumb-friendly buttons
- Progress indicator: "5 of 8 voted"
- Deadline countdown: "Closes in 3 hours"
- Notification badge: "New poll - vote now!"

---

### 3.3 Deadline & Quorum Logic

**Deadline Options**:
- No deadline (open-ended)
- Specific time: "Friday 6pm"
- Relative: "24 hours from now"
- Smart default: Dinner poll → closes 2 hours before dinner time

**Quorum Options**:
- All members must vote (default for important decisions)
- Majority (>50% must vote)
- Specific number: "At least 6 of 8"
- No quorum (results valid with any participation)

**Decision Logic**:
```python
def resolve_poll(poll):
    if poll.deadline_passed:
        if poll.votes_count >= poll.quorum:
            return calculate_winner(poll)
        else:
            return "FAILED - Quorum not met" (extend deadline or cancel)
    else:
        return "PENDING - Voting open"
```

---

### 3.4 Notifications & Reminders

**When to Notify**:

| Event | Who Gets Notified | Timing |
|-------|------------------|--------|
| Poll created | All trip members | Immediately |
| New vote cast | Poll creator (optional) | Real-time |
| Deadline approaching | Non-voters only | 2 hours before |
| Deadline passed | Poll creator | Immediately |
| Poll resolved | All members | When winner determined |
| Tie needs breaking | Organizer | When tie detected |

**Notification Channels**:
- ✅ In-app push notification
- ✅ Email (if user enabled)
- ⬜ SMS (Phase 7+, premium feature)

**Example Notification**:
> 🗳️ **New poll: Where to eat tonight?**
> Sarah created a poll for dinner. Vote by 6pm.
> [Vote Now →]

---

## 4. User Flows & Wireframes

### 4.1 Create Poll Flow

**Steps**:
1. User taps "Create Poll" button (from trip view or activity)
2. Select poll type (or choose template)
3. Enter question
4. Add options (2-10)
5. Set deadline (optional)
6. Set quorum (optional)
7. Review & create
8. Poll appears in activity feed + notifications sent

**Wireframe** (ASCII mockup):
```
┌─────────────────────────┐
│  Create Poll            │
├─────────────────────────┤
│ Question:               │
│ [Where to eat tonight?] │
│                         │
│ Vote Type:              │
│ ○ Yes/No                │
│ ● Single Choice         │
│ ○ Ranked Choice         │
│ ○ Approval Voting       │
│                         │
│ Options:                │
│ 1. [Pizza Napoli     ⓘ] │
│ 2. [Sushi Bar        ⓘ] │
│ 3. [Thai Street Food ⓘ] │
│ [+ Add Option]          │
│                         │
│ Deadline:               │
│ [Today at 6:00 PM    ▼] │
│                         │
│ Quorum:                 │
│ [All members (8/8)   ▼] │
│                         │
│ [Cancel]  [Create Poll] │
└─────────────────────────┘
```

---

### 4.2 Vote Flow

**Steps**:
1. User sees poll in feed (or gets notification)
2. Tap poll card to expand
3. Review options (see details, cost, photos)
4. Select choice(s) based on vote type
5. Tap "Submit Vote"
6. Confirmation: "Your vote was recorded ✓"
7. See real-time results (if public)

**Wireframe** (ASCII mockup):
```
┌─────────────────────────┐
│ 🗳️ Where to eat tonight?│
│ Created by Sarah        │
│ Closes in 3 hours       │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │ ● Pizza Napoli      │ │
│ │   €€ • Italian      │ │
│ │   4 votes (50%)     │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ ○ Sushi Bar         │ │
│ │   €€€ • Japanese    │ │
│ │   3 votes (37%)     │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ ○ Thai Street Food  │ │
│ │   € • Thai          │ │
│ │   1 vote (13%)      │ │
│ └─────────────────────┘ │
│                         │
│ Status: 5 of 8 voted    │
│ Waiting on: Alex, Mike  │
│                         │
│ [Submit Vote]           │
└─────────────────────────┘
```

---

### 4.3 Results Flow

**Steps**:
1. Poll closes (deadline passed + quorum met)
2. Winner calculated automatically
3. All members notified: "Poll resolved: Pizza Napoli won!"
4. Result appears in activity feed
5. Decision recorded in trip history
6. If hotel/restaurant/activity → option to "Book Now" or "Add to Itinerary"

**Wireframe** (ASCII mockup):
```
┌─────────────────────────┐
│ ✅ Poll Closed          │
│ Where to eat tonight?   │
├─────────────────────────┤
│ 🏆 Winner: Pizza Napoli │
│    6 votes (75%)        │
│                         │
│ Results:                │
│ ██████████ Pizza (75%)  │
│ ████ Sushi (25%)        │
│ █ Thai (12%)            │
│                         │
│ 8 of 8 members voted    │
│ Closed: Feb 8, 6:00 PM  │
│                         │
│ [Add to Itinerary]      │
│ [View Details]          │
└─────────────────────────┘
```

---

## 5. Technical Implementation

### 5.1 Database Schema

**Table: `polls`**
```sql
CREATE TABLE polls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES profiles(id),

    question TEXT NOT NULL,
    description TEXT,
    vote_type VARCHAR(20) NOT NULL, -- 'yes_no', 'single_choice', 'ranked', 'approval', 'veto'

    deadline TIMESTAMPTZ,
    quorum_type VARCHAR(20), -- 'all', 'majority', 'specific'
    quorum_count INTEGER,

    visibility VARCHAR(20) DEFAULT 'public', -- 'public', 'anonymous'
    status VARCHAR(20) DEFAULT 'open', -- 'open', 'closed', 'failed'

    result JSONB, -- Store winner, vote counts, etc.

    created_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ,

    -- Metadata
    linked_activity_id UUID REFERENCES activities(id), -- If poll is about specific activity
    estimated_cost_per_option JSONB -- {option_id: cost}
);
```

**Table: `poll_options`**
```sql
CREATE TABLE poll_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,

    option_text TEXT NOT NULL,
    option_order INTEGER NOT NULL,

    details TEXT, -- Additional info
    location_lat FLOAT,
    location_lng FLOAT,
    estimated_cost DECIMAL(10,2),

    image_url TEXT,
    link_url TEXT,

    vetoed BOOLEAN DEFAULT FALSE,
    vetoed_by UUID REFERENCES profiles(id),
    veto_reason TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_poll_options_poll_id ON poll_options(poll_id);
```

**Table: `votes`**
```sql
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
    voter_id UUID REFERENCES profiles(id),

    vote_data JSONB NOT NULL,
    -- Examples:
    -- Yes/No: {"choice": "yes"}
    -- Single: {"option_id": "abc123"}
    -- Ranked: {"rankings": ["opt1", "opt2", "opt3"]}
    -- Approval: {"approved_options": ["opt1", "opt3"]}
    -- Veto: {"vetoed_option": "opt2", "reason": "allergy"}

    voted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(poll_id, voter_id) -- One vote per person per poll
);

CREATE INDEX idx_votes_poll_id ON votes(poll_id);
CREATE INDEX idx_votes_voter_id ON votes(voter_id);
```

---

### 5.2 Row-Level Security (RLS) Policies

```sql
-- Polls: Members of trip can view
CREATE POLICY "Trip members can view polls"
ON polls FOR SELECT
USING (
    trip_id IN (
        SELECT trip_id FROM trip_members WHERE user_id = auth.uid()
    )
);

-- Polls: Organizers can create
CREATE POLICY "Organizers can create polls"
ON polls FOR INSERT
WITH CHECK (
    trip_id IN (
        SELECT trip_id FROM trip_members
        WHERE user_id = auth.uid()
        AND role IN ('owner', 'organizer')
    )
);

-- Votes: User can insert own vote
CREATE POLICY "Users can vote"
ON votes FOR INSERT
WITH CHECK (voter_id = auth.uid());

-- Votes: User can update own vote (before deadline)
CREATE POLICY "Users can change own vote"
ON votes FOR UPDATE
USING (voter_id = auth.uid())
WITH CHECK (voter_id = auth.uid());

-- Votes: Visibility depends on poll settings
CREATE POLICY "View votes based on poll visibility"
ON votes FOR SELECT
USING (
    -- Public polls: everyone in trip can see votes
    (SELECT visibility FROM polls WHERE id = poll_id) = 'public'
    AND poll_id IN (
        SELECT id FROM polls WHERE trip_id IN (
            SELECT trip_id FROM trip_members WHERE user_id = auth.uid()
        )
    )
    OR
    -- Anonymous polls: only see own vote
    voter_id = auth.uid()
);
```

---

### 5.3 Supabase Edge Functions

**Function: `resolve_poll`** (Runs on deadline)
```typescript
// supabase/functions/resolve-poll/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { poll_id } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  )

  // Get poll data
  const { data: poll } = await supabase
    .from('polls')
    .select('*, votes(*), poll_options(*)')
    .eq('id', poll_id)
    .single()

  // Check quorum
  const votesCount = poll.votes.length
  const quorumMet = checkQuorum(poll, votesCount)

  if (!quorumMet) {
    await supabase
      .from('polls')
      .update({ status: 'failed', closed_at: new Date() })
      .eq('id', poll_id)

    return new Response(JSON.stringify({ status: 'failed', reason: 'quorum_not_met' }))
  }

  // Calculate winner based on vote type
  const result = calculateWinner(poll)

  // Update poll with result
  await supabase
    .from('polls')
    .update({
      status: 'closed',
      result,
      closed_at: new Date()
    })
    .eq('id', poll_id)

  // Send notifications to all members
  await sendPollResultNotification(poll, result)

  return new Response(JSON.stringify({ status: 'closed', result }))
})

function checkQuorum(poll, votesCount) {
  if (!poll.quorum_type) return true // No quorum requirement

  if (poll.quorum_type === 'all') {
    const memberCount = poll.trip.members.length
    return votesCount === memberCount
  }

  if (poll.quorum_type === 'majority') {
    const memberCount = poll.trip.members.length
    return votesCount > (memberCount / 2)
  }

  if (poll.quorum_type === 'specific') {
    return votesCount >= poll.quorum_count
  }
}

function calculateWinner(poll) {
  switch (poll.vote_type) {
    case 'yes_no':
      return calculateYesNo(poll.votes)
    case 'single_choice':
      return calculateSingleChoice(poll.votes)
    case 'ranked':
      return calculateRankedChoice(poll.votes, poll.poll_options)
    case 'approval':
      return calculateApproval(poll.votes)
    default:
      throw new Error('Unknown vote type')
  }
}
```

---

## 6. Decision Logic & Algorithms

### 6.1 Yes/No Vote

```typescript
function calculateYesNo(votes) {
  const yes = votes.filter(v => v.vote_data.choice === 'yes').length
  const no = votes.filter(v => v.vote_data.choice === 'no').length
  const total = votes.length

  const yesPercent = (yes / total) * 100
  const noPercent = (no / total) * 100

  if (yes > no) {
    return {
      winner: 'yes',
      yes_count: yes,
      no_count: no,
      yes_percent: yesPercent,
      no_percent: noPercent
    }
  } else if (no > yes) {
    return {
      winner: 'no',
      yes_count: yes,
      no_count: no,
      yes_percent: yesPercent,
      no_percent: noPercent
    }
  } else {
    return {
      winner: 'tie',
      yes_count: yes,
      no_count: no,
      yes_percent: yesPercent,
      no_percent: noPercent,
      tie_breaking_needed: true
    }
  }
}
```

---

### 6.2 Single Choice Vote

```typescript
function calculateSingleChoice(votes) {
  const voteCounts = {}

  votes.forEach(vote => {
    const optionId = vote.vote_data.option_id
    voteCounts[optionId] = (voteCounts[optionId] || 0) + 1
  })

  const sorted = Object.entries(voteCounts).sort((a, b) => b[1] - a[1])
  const [winnerId, winnerCount] = sorted[0]

  // Check for tie
  const tiedOptions = sorted.filter(([_, count]) => count === winnerCount)

  if (tiedOptions.length > 1) {
    return {
      winner: null,
      tie: true,
      tied_options: tiedOptions.map(([id, _]) => id),
      vote_counts: voteCounts
    }
  }

  return {
    winner: winnerId,
    vote_counts: voteCounts,
    winner_count: winnerCount,
    winner_percent: (winnerCount / votes.length) * 100
  }
}
```

---

### 6.3 Ranked Choice (Instant Runoff Voting)

```typescript
function calculateRankedChoice(votes, options) {
  let remainingOptions = options.map(o => o.id)
  let round = 1
  const rounds = []

  while (remainingOptions.length > 1) {
    // Count first-choice votes for remaining options
    const firstChoiceCounts = {}
    remainingOptions.forEach(id => firstChoiceCounts[id] = 0)

    votes.forEach(vote => {
      const rankings = vote.vote_data.rankings
      // Find first remaining option in this voter's rankings
      const firstChoice = rankings.find(id => remainingOptions.includes(id))
      if (firstChoice) {
        firstChoiceCounts[firstChoice]++
      }
    })

    rounds.push({ round, counts: { ...firstChoiceCounts } })

    // Check if any option has majority
    const totalVotes = Object.values(firstChoiceCounts).reduce((a, b) => a + b, 0)
    const majority = totalVotes / 2

    for (const [optionId, count] of Object.entries(firstChoiceCounts)) {
      if (count > majority) {
        return {
          winner: optionId,
          winner_count: count,
          winner_percent: (count / totalVotes) * 100,
          rounds,
          method: 'instant_runoff'
        }
      }
    }

    // No majority - eliminate option with fewest votes
    const sorted = Object.entries(firstChoiceCounts).sort((a, b) => a[1] - b[1])
    const [eliminatedId, _] = sorted[0]
    remainingOptions = remainingOptions.filter(id => id !== eliminatedId)
    round++
  }

  // Only one option left
  return {
    winner: remainingOptions[0],
    rounds,
    method: 'instant_runoff'
  }
}
```

---

### 6.4 Approval Voting

```typescript
function calculateApproval(votes) {
  const approvalCounts = {}

  votes.forEach(vote => {
    vote.vote_data.approved_options.forEach(optionId => {
      approvalCounts[optionId] = (approvalCounts[optionId] || 0) + 1
    })
  })

  const sorted = Object.entries(approvalCounts).sort((a, b) => b[1] - a[1])
  const [winnerId, winnerCount] = sorted[0]

  return {
    winner: winnerId,
    approval_counts: approvalCounts,
    winner_count: winnerCount,
    winner_percent: (winnerCount / votes.length) * 100,
    method: 'approval'
  }
}
```

---

## 7. Edge Cases & Error Handling

### 7.1 Common Edge Cases

| Edge Case | Handling Strategy |
|-----------|------------------|
| **Tie in votes** | - Organizer breaks tie<br/>- OR extend deadline<br/>- OR automatic runoff poll |
| **Quorum not met** | - Mark poll as "FAILED"<br/>- Notify organizer<br/>- Option to extend deadline or lower quorum |
| **Member joins after poll created** | - Can vote if poll still open<br/>- Update quorum count automatically |
| **Member leaves trip** | - Their vote stays (historical record)<br/>- Adjust quorum count down |
| **Vote changed after deadline** | - Not allowed (deadline enforced)<br/>- Show error: "Poll closed, can't change vote" |
| **Poll deleted** | - Soft delete (keep in history)<br/>- Notify members: "Poll cancelled by Sarah" |
| **Veto after voting started** | - Allowed (veto is serious, overrides votes)<br/>- Eliminate option, recalculate winner<br/>- Notify: "Option eliminated by veto" |
| **All options vetoed** | - Poll fails<br/>- Notify: "No valid options remaining" |

---

### 7.2 Error Messages

**User-Friendly Error Messages**:

| Error | Message | Action |
|-------|---------|--------|
| Deadline passed | "This poll closed 2 hours ago. You can't vote now." | Show results instead |
| Not a member | "You must be a trip member to vote." | Redirect to join trip |
| Already voted | "You already voted! Tap 'Change Vote' to update." | Show edit button |
| No options selected | "Please select at least one option before submitting." | Highlight options |
| Quorum failed | "Only 4 of 8 members voted. Poll failed to reach quorum." | Extend or cancel |
| Server error | "Oops! Couldn't submit your vote. Try again?" | Retry button |

---

## 8. UX Principles & Design Guidelines

### 8.1 Core UX Principles

**1. Make Voting Feel Fun, Not Like Work**
- Use playful language: "Cast your vote!" not "Submit response"
- Celebrate participation: "🎉 You voted! 7 of 8 members have voted."
- Visual feedback: Button animations, confetti on final vote
- Progress feels good: Real-time vote counts climbing

**2. Speed Matters**
- <3 taps to vote (poll card → select option → submit)
- No unnecessary confirmation dialogs
- Optimistic UI (instant feedback)
- Voting feels instant, not slow

**3. Transparency Builds Trust**
- Show who voted, who hasn't (if public)
- Display deadline countdown clearly
- Explain decision logic ("Highest vote wins")
- Audit trail: "We voted on this 2 weeks ago"

**4. Respect Privacy When Needed**
- Anonymous voting option (for sensitive decisions)
- Budget-related votes default to anonymous
- Vetoes show name (accountability prevents abuse)

**5. Reduce Friction**
- Templates for common polls ("Where to eat?")
- Smart defaults (deadline = 24 hours, quorum = all)
- Option to skip optional fields
- Mobile-first (thumb-friendly buttons)

---

### 8.2 Design Guidelines

**Visual Hierarchy**:
```
MOST PROMINENT:
1. Question ("Where to eat tonight?")
2. Options (large tap targets)
3. Vote button (call-to-action)

SECONDARY:
4. Vote counts / percentages
5. Deadline countdown
6. Who voted / who hasn't

TERTIARY:
7. Poll metadata (created by, type)
8. Option details (expandable)
```

**Color Usage**:
- Green: Approved, winning option, positive action
- Red: Rejected, veto, serious warning
- Blue: Neutral, voting in progress
- Gray: Closed, inactive, past deadline

**Typography**:
- Question: Bold, 18-20px
- Options: Medium, 16-18px
- Vote counts: Regular, 14px
- Metadata: Light, 12px

**Spacing**:
- Large tap targets: 44x44px minimum (iOS guideline)
- Padding between options: 12px
- Margin around poll card: 16px

---

## 9. Notifications & Reminders

### 9.1 Notification Types

**1. Poll Created**
- **Trigger**: New poll created
- **Recipients**: All trip members
- **Timing**: Immediately
- **Message**: "🗳️ Sarah created a poll: Where to eat tonight? Vote by 6pm."
- **Action**: [Vote Now] button

**2. Deadline Approaching**
- **Trigger**: 2 hours before deadline
- **Recipients**: Non-voters only
- **Timing**: Deadline - 2 hours
- **Message**: "⏰ Poll closes in 2 hours! Vote now: Where to eat tonight?"
- **Action**: [Vote Now] button

**3. Final Reminder**
- **Trigger**: 15 minutes before deadline
- **Recipients**: Non-voters only
- **Timing**: Deadline - 15 minutes
- **Message**: "🚨 Last chance! Poll closes in 15 minutes."
- **Action**: [Vote Now] button

**4. Poll Closed**
- **Trigger**: Deadline passed
- **Recipients**: All members
- **Timing**: Immediately
- **Message**: "✅ Poll closed! Winner: Pizza Napoli (6 votes)"
- **Action**: [View Results] button

**5. Quorum Failed**
- **Trigger**: Deadline passed but quorum not met
- **Recipients**: Organizer only
- **Timing**: Immediately
- **Message**: "⚠️ Poll failed (only 4 of 8 voted). Extend deadline?"
- **Action**: [Extend Deadline] [Cancel Poll]

**6. Tie Needs Breaking**
- **Trigger**: Deadline passed, tie detected
- **Recipients**: Organizer only
- **Timing**: Immediately
- **Message**: "🤝 Tie vote! Pizza and Sushi both have 4 votes. Break the tie?"
- **Action**: [Choose Winner] [Create Runoff]

---

### 9.2 Notification Frequency Settings

**User Controls**:
- ✅ "Notify me for new polls" (default: on)
- ✅ "Remind me to vote" (default: on)
- ✅ "Notify me when results are in" (default: on)
- ⬜ "Notify me for every vote cast" (default: off, noisy)

**Smart Throttling**:
- Max 3 reminders per poll (don't spam)
- Batch notifications if multiple polls close same time
- Respect "Do Not Disturb" hours (11pm - 8am local time)

---

## 10. Success Metrics

### 10.1 Launch Targets (First 3 Months)

| Metric | Target | Stretch | Why It Matters |
|--------|--------|---------|----------------|
| **Voting Usage** | 60% | 80% | % of trips with ≥1 poll created |
| **Vote Completion** | 70% | 85% | % of polls reaching quorum |
| **Avg Votes per Trip** | 3 | 5 | Frequency of usage |
| **Time to Vote** | <2 min | <1 min | Friction indicator |
| **Vote Changes** | <10% | <5% | Decision confidence |
| **Deadline Compliance** | 80% | 90% | % voting before deadline |

---

### 10.2 Qualitative Success Signals

**Positive Signals**:
- ✅ User testimonials: "Voting saved us from arguing"
- ✅ Feature requests for more vote types
- ✅ High engagement (polls created spontaneously, not just pre-planned)
- ✅ Users saying "better than Wanderlog because voting"

**Negative Signals**:
- ⚠️ Polls created but nobody votes (bad UX or not useful)
- ⚠️ Lots of "quorum failed" (quorum too high, deadlines too short)
- ⚠️ Users skip voting, decide in WhatsApp (feature didn't solve problem)
- ⚠️ Feedback: "Too complicated" or "Feels like work"

---

### 10.3 Iteration Priorities Based on Metrics

**If voting usage <40%**:
- Problem: Feature not discoverable or not perceived as valuable
- Fix: Add onboarding prompts, templates, explainer videos

**If quorum fails >30% of polls**:
- Problem: Default quorum too strict or deadlines too short
- Fix: Lower default quorum, extend deadlines, smarter reminders

**If vote changes >20%**:
- Problem: Options unclear or users voting without thinking
- Fix: Better option presentation, more details before voting

**If time to vote >3 minutes**:
- Problem: UX too complex
- Fix: Reduce taps, simplify interface, faster loading

---

## Next Steps

**Phase 3 Implementation** (Weeks 10-14):

1. **Week 10-11**: Core voting system
   - Database schema (polls, poll_options, votes tables)
   - RLS policies for permissions
   - Yes/No and Single Choice vote types
   - Basic poll creation UI

2. **Week 12**: Notifications & real-time
   - Supabase real-time subscriptions (live vote updates)
   - Push notifications (new poll, deadline approaching)
   - Email reminders

3. **Week 13**: Advanced features
   - Approval voting
   - Veto functionality
   - Poll templates
   - Deadline/quorum logic

4. **Week 14**: Polish & testing
   - Mobile UX optimization
   - Edge case handling
   - Load testing (100 concurrent voters)
   - User testing with beta group

**Phase 7+ Enhancements**:
- Ranked choice voting (complex, defer unless requested)
- AI-suggested options ("Based on your budget, here are 3 restaurants...")
- Integration with booking (vote on hotel → book winner directly)
- Analytics dashboard (which member votes most, least)

---

**Document Status**: ✅ Complete - Ready for Implementation
**Last Updated**: February 8, 2026
**Next**: Begin Phase 3 development (after Phase 1-2 complete)
