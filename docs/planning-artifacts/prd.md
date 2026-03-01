---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish']
inputDocuments:
  - 'tripflow-next/docs/tripos-migration/bmad-output/project-context.md'
  - 'tripflow-next/docs/TRIPFLOW-OVERVIEW.md'
  - 'tripflow-next/docs/specs/app-features-specification.md'
  - 'docs/00-MASTER-ITINERARY.md'
  - 'docs/01-DAY-BY-DAY-PLANNER.md'
  - 'docs/02-BUDGET-TRACKER.md'
workflowType: 'prd'
documentCounts:
  briefCount: 0
  researchCount: 3
  brainstormingCount: 0
  projectDocsCount: 3
classification:
  projectType: 'web_app'
  domain: 'travel_tourism'
  complexity: 'medium-high'
  projectContext: 'brownfield'
  productScope: 'comprehensive_vision'
  coreFeatures:
    - 'interactive_itinerary_building'
    - 'multi_currency_budget_tracking'
    - 'collaborative_planning'
    - 'expense_splitting'
    - 'booking_management'
  aiCapabilities:
    - 'itinerary_generation'
    - 'activity_recommendations'
  implementationPriority: 'manual_tools_first_ai_second'
  targetUsers: 'broad_consumer_market'
---

# Product Requirements Document - TripFlow (Asia Trip)

**Author:** Pedro
**Date:** 2026-03-01

## Executive Summary

TripOS is a collaborative group trip planning platform that eliminates the budget awkwardness and decision paralysis that kills group trips. The platform enables friends, families, and travel groups to build shared itineraries, track multi-currency budgets with privacy-first blind budgeting, split expenses fairly, make democratic decisions through structured voting, and manage bookings—all in real-time without spreadsheet chaos.

**Target users:** Broad consumer market planning group trips (2-10 travelers). Primary use cases include friend groups coordinating international travel, families planning reunions, couples managing shared itineraries, and digital nomads organizing group stays.

**Problem:** Group trip planning fails when budget disparities create social awkwardness ("I can't afford that"), decision-making drags due to endless group chats, and coordination collapses into spreadsheet hell. Current tools (shared docs, group chats, expense apps) solve individual pieces but force travelers to juggle 3-5 disconnected tools while exposing private budget constraints publicly.

**Solution:** End-to-end collaborative platform with privacy-first budget tracking, democratic voting, real-time shared itineraries, fair expense splitting, and booking management. Manual planning tools ship first (Phase 1), with AI-powered itinerary generation and activity recommendations layering in second (Phase 2).

**Core differentiator:** Blind budgeting (23/25 validation, zero competitors) eliminates budget awkwardness through privacy-preserved aggregation—travelers set private budgets, groups see collective possibilities only. See Innovation section for competitive analysis and validation approach.

## Project Classification

- **Type:** Web application (SaaS)
- **Domain:** Travel & tourism
- **Complexity:** Medium-high (multi-currency support, real-time collaboration, privacy-enforced budget aggregation)
- **Context:** Brownfield project — existing TripOS/TripFlow codebase being enhanced
- **Tech Stack:** Next.js 16 App Router, React 19, Supabase (PostgreSQL + Auth + RLS + Realtime), React Query v5, Zustand, Tailwind CSS v4, shadcn/ui
- **Deployment:** Vercel (frontend + Edge Functions), Supabase (backend services)

## Success Criteria

### User Success

TripOS succeeds when users experience **delight** while planning group trips without budget awkwardness or decision paralysis. User success manifests across three key moments:

**"Aha!" Moments:**
1. **Blind budgeting revelation:** Users set private budgets and witness the platform show collective possibilities (e.g., "4 people can afford €150/night hotels") without exposing individual limits—experiencing privacy-preserved group planning for the first time
2. **Democratic decision-making:** Groups make their first vote on an activity using structured voting instead of endless group chat debates, realizing decisions can happen without pressure or conflict
3. **Collaborative itinerary completion:** Multiple travelers edit the shared itinerary in real-time, seeing presence indicators and live updates, escaping spreadsheet chaos

**Ultimate Success Metric:** Users travel and return with **zero budget conflicts or decision drama**—the trip happens as planned, everyone stayed within their private budgets, and group decisions were made democratically without social pressure.

**Emotional State:** Users feel **delight** when TripOS works—relief from budget anxiety, empowerment to participate in planning regardless of budget constraints, and confidence that decisions reflect everyone's voice.

### Business Success

**3-Month Success Indicators:**
- **User retention:** 40%+ of users return to plan a second trip (validates product-market fit)
- **Blind budget adoption:** 80%+ of users complete blind budget setup within first session (validates core differentiator usability)
- **Friction reduction:** Average time from trip creation to first collaborative activity < 10 minutes (validates onboarding simplicity)

**12-Month Success Targets:**
- **Trip completion rate:** 70%+ of trips progress from planning to travel (validates end-to-end value)
- **User base:** 5,000+ active users planning trips (validates market traction)
- **Viral coefficient:** 50%+ of new users invited by existing users (validates word-of-mouth growth)

**Revenue Model (TBD):**
Revenue strategy under exploration. Platform requires sustainable income; potential models include freemium (free basic trips, paid premium features), subscription tiers (per trip or per user), or booking commissions. Revenue model will be defined post-MVP validation.

**Engagement Metrics:**
- **Active planning:** Users spend 30+ minutes per session actively planning (indicates investment)
- **Democratic participation:** 90%+ of group decisions use voting instead of external group chats (validates "Decide Don't Debate" philosophy)
- **Budget updates:** Users update budgets 3+ times per trip (indicates active blind budgeting usage)

### Technical Success

**Privacy Enforcement (Critical Pass/Fail):**
- **Non-Negotiable:** Individual budget values NEVER appear in client bundles, API responses, logs, or client-side state
- **Failure Definition:** If a budget value leaks to client-side code, this is a **CRITICAL FAILURE** requiring immediate remediation
- **Enforcement:** Blind budgeting aggregation executed exclusively via server-side Edge Functions with Row-Level Security (RLS)

**Performance Targets:**
- **Sub-second interactions:** All user actions complete in < 500ms (validates "Speed Is Respect" philosophy)
- **Real-time sync latency:** Itinerary updates propagate to all group members within 500ms
- **Database performance:** PostgreSQL queries execute in < 100ms for typical operations (fetch itinerary, load user data)
- **Edge Function performance:** Blind budgeting aggregation completes in < 200ms

**Reliability Requirements:**
- **Zero data loss:** Trip plans, budgets, and votes must persist with 100% integrity (higher priority than uptime)
- **Offline-first sync:** Concurrent edits resolve without data loss when users reconnect
- **RLS enforcement:** Users cannot access trips they're not members of (100% data isolation)

**Scalability Thresholds:**
- **Group size:** Support 10-person groups with real-time collaboration without lag or conflicts
- **Concurrent trips:** Handle 1,000+ active trips simultaneously without performance degradation
- **Database scaling:** Supabase PostgreSQL scales to support growing user base with consistent query performance

**Security & Compliance:**
- **Authentication:** Supabase Auth with secure session management (no exposed tokens, secure password requirements)
- **Data encryption:** All data encrypted at rest (Supabase default) and in transit (HTTPS/TLS)
- **RLS enforcement:** Row-Level Security isolates trip data (multi-tenant architecture)
- **GDPR compliance:** Users can delete accounts and export data (right to deletion, data portability)
- **Rate limiting:** API endpoints rate-limited to prevent abuse and DDoS attacks
- **Input validation:** All user input sanitized to prevent XSS, SQL injection, and other attacks

### Measurable Outcomes

**User Outcomes:**
- Users complete a shared itinerary with 3+ travelers within 7 days of trip creation
- 90% of group decisions use democratic voting instead of external group chat debates
- Users set private budgets and plan collectively without revealing individual budget limits
- Groups successfully split expenses using blind budgeting aggregation without budget conflicts

**Business Outcomes:**
- 40% user retention at 3 months (return for second trip)
- 70% trip completion rate at 12 months (trips actually happen)
- 80% blind budget setup completion within first session
- 50% viral coefficient (new users invited by existing users)

**Technical Outcomes:**
- Zero budget value leaks to client-side code (100% privacy enforcement)
- All interactions complete in < 500ms (performance target)
- Zero data loss on trip plans (reliability target)
- 10-person groups collaborate in real-time without lag (scalability target)

## Product Scope

### MVP - Minimum Viable Product

**Goal:** Prove blind budgeting eliminates budget awkwardness and decision paralysis in group trip planning.

**Core Features:**

1. **Blind Budgeting (Core Differentiator)**
   - Private budget setting per traveler
   - Server-side aggregation via Edge Functions
   - Collective possibilities view (e.g., "4 people can afford €150/night hotels")
   - Teal visual indicators for privacy-preserved features
   - Individual budget values NEVER leak to client

2. **Shared Itinerary (Planning Tool)**
   - Create trip (destination, dates, description)
   - Add activities and accommodations to shared timeline
   - Day-by-day timeline view
   - Real-time sync (basic—updates propagate to all travelers)
   - Edit permissions (all group members can edit)

3. **Democratic Voting (Decision-Making)**
   - Vote on activities and accommodations
   - Purple visual indicators for voting features
   - One vote per traveler
   - Results visible only after all votes submitted
   - Vote history and audit trail

4. **Expense Splitting (Proves Blind Budgeting Value)**
   - Track shared expenses during trip
   - Fair split calculations (equal or custom)
   - Who owes whom settlement view
   - Expense categories (accommodation, food, transport, activities)

5. **Multi-Currency Support (International Travelers)**
   - Set budgets in different currencies
   - Real-time currency conversion
   - Multi-currency expense tracking
   - Display amounts in user's preferred currency

6. **Basic Collaboration**
   - Invite travelers via email
   - User presence indicators (who's online)
   - Group member management (add/remove travelers)
   - Trip ownership and permissions

7. **Authentication & Security**
   - Supabase Auth (email/password, OAuth providers)
   - Row-Level Security (RLS) for multi-tenant data isolation
   - Secure session management

**What's NOT in MVP:**
- Booking management (external integrations deferred to Growth)
- AI itinerary generation and recommendations (Phase 2)
- Offline-first sync with conflict resolution (Growth feature—MVP has basic real-time sync only)
- Mobile native apps (start with responsive web)
- Advanced notifications (Growth feature)

### Growth Features (Post-MVP)

**Goal:** Make TripOS competitive and sticky after validating core blind budgeting concept.

**Features:**

1. **Booking Management**
   - External integrations: flights, hotels, activities
   - Booking confirmation tracking
   - Booking cost aggregation into budget
   - Calendar sync for booked items

2. **Advanced Real-Time Collaboration**
   - Optimistic UI (instant local updates, background sync)
   - Offline-first sync (work without connection, sync when reconnected)
   - Conflict resolution for concurrent edits
   - Detailed presence indicators (who's editing what)

3. **Mobile Native Apps**
   - iOS app (native Swift/SwiftUI)
   - Android app (native Kotlin/Jetpack Compose)
   - Mobile-optimized UX
   - Push notifications for votes, updates

4. **Trip Templates**
   - Pre-built itineraries for popular destinations
   - Template library (city breaks, road trips, beach vacations)
   - Customizable templates (edit before use)
   - Community-contributed templates

5. **Export & Sharing**
   - PDF itinerary export
   - Shareable read-only links (share trip with non-members)
   - Print-friendly itinerary views
   - Calendar export (iCal, Google Calendar)

6. **Notifications**
   - Push notifications (web, mobile)
   - Email digests (daily/weekly trip updates)
   - Notification preferences (vote reminders, budget updates, itinerary changes)

### Vision (Future)

**Goal:** Build the ultimate group trip planning platform that eliminates all coordination friction.

**Dream Features:**

1. **AI Itinerary Generation (Phase 2)**
   - Generate complete itineraries from prompts (e.g., "7-day Tokyo trip for 4 people, focus on food and culture")
   - Respect collective budget constraints from blind budgeting aggregation
   - Suggest activities matching group preferences

2. **AI Activity Recommendations (Phase 2)**
   - Personalized activity suggestions based on trip context
   - Budget-aware recommendations (respect collective possibilities)
   - Time-aware suggestions (fill gaps in itinerary)

3. **Group Chat Integration**
   - In-app messaging (replace external group chats)
   - Context-aware chat (discussion threads on activities, votes, budget)
   - @mentions and notifications

4. **Travel Insurance Integration**
   - Group travel insurance quotes
   - One-click purchase for entire group
   - Policy management and claims

5. **Loyalty Programs**
   - Travel rewards for completed trips
   - Referral bonuses (invite friends, earn credits)
   - Partner deals (hotels, activities, booking platforms)

6. **Advanced Analytics**
   - Trip cost analysis (actual vs budget)
   - Budget optimization suggestions
   - Historical spending patterns
   - Group decision-making insights (voting patterns, preferences)

## User Journeys

### Journey 1: Sarah Chen - The Trip Organizer

**Opening Scene: The Burden of Coordination**

Sarah, 29, works in product management and has organized group trips before—each one a nightmare. Her friend group of six wants to do a 10-day Japan trip, but Sarah knows what's coming: endless group chat messages, conflicting opinions, budget awkwardness, and someone inevitably dropping out because they "can't afford it."

She's tried Google Docs (someone always edits the wrong cell), shared spreadsheets (budget formulas break), group chats (decisions never get made), and Splitwise (only tracks expenses after the fact). She needs something that handles planning AND prevents the budget awkwardness that killed their last trip to Portugal.

**Rising Action: Discovery and Setup**

Sarah discovers TripOS through a Reddit thread about group trip planning tools. The phrase "blind budgeting" catches her attention—finally, a way to plan without forcing friends to reveal exact budget limits.

She creates a trip: "Japan 2026 - Tokyo, Kyoto, Osaka" with dates Sep 2-12. She sets her own budget (¥150,000 / ~$1,000 USD) and sees the teal privacy indicator—her exact number stays private. She invites her six friends via email.

Within 24 hours, all six friends have joined, set their private budgets, and TripOS shows Sarah the collective possibilities: "All 6 travelers can afford ¥8,000/night hotels" and "4 travelers can afford ¥15,000 activities." No awkward budget reveals, no one forced to say "I can't afford that."

**Climax: Collaborative Planning Without Drama**

Sarah adds three hotel options to the shared itinerary. Instead of endless group chat debates ("What do you guys think?" → 47 unread messages), she creates a vote. All six friends vote on their phones. Results appear after everyone votes: Hotel B wins (5 votes).

She watches in real-time as her friend Maya adds activities to the itinerary from her laptop in Berlin while Alex updates dinner reservations from Tokyo (he's already there for work). Presence indicators show who's online. The itinerary builds itself through collaboration, not Sarah doing everything alone.

For the first time in her group trip organizing experience, Sarah isn't drowning in messages or tracking budget spreadsheets. The trip is actually coming together.

**Resolution: The Trip Happens**

September arrives. The group travels to Japan. No budget conflicts. No surprises. Everyone knew what they could collectively afford, planned within those bounds, and tracked expenses in real-time using TripOS's expense splitting.

Sarah returns home and immediately gets a message from another friend group: "We want to do Iceland next summer. Can you organize it?" This time, Sarah doesn't hesitate—she creates a new trip in TripOS.

**Journey Reveals Requirements:**
- Trip creation and invitation system
- Blind budgeting with privacy indicators
- Democratic voting on activities/hotels
- Real-time collaborative itinerary editing
- Presence indicators and live updates
- Expense splitting and settlement

---

### Journey 2: Marcus Thompson - The Budget-Conscious Traveler

**Opening Scene: The Rich Friend Problem**

Marcus, 26, just finished grad school and works as a teacher. His close friends from college—now consultants and engineers—want to plan a two-week Europe trip. Marcus wants to go desperately, but he knows the drill: someone suggests a €200/night hotel, and he either says "I can't afford that" (embarrassing) or stays silent and hopes cheaper options emerge (passive and frustrating).

Last year, he dropped out of the Bali trip three weeks before departure because the budget had crept beyond his means. He lost the deposit on his flight. His friends felt terrible. It was awkward for months.

This time, when his friend Emma sends a TripOS invite for "Europe Summer 2026," Marcus is skeptical but clicks the link.

**Rising Action: Setting Boundaries Privately**

Marcus creates his TripOS account and sees the budget setup screen with a teal accent and explicit privacy messaging: "Your exact budget stays private. Only collective possibilities are shared with the group."

He sets his budget: €1,500 total (€100/night max for hotels). He hesitates before clicking "Save"—will everyone see this number? The teal indicator reassures him: "Private - only you can see this."

On the trip dashboard, Marcus sees: "All 8 travelers can afford €80/night hotels" and "6 travelers can afford €120/night hotels." He realizes: the group can afford cheaper hotels collectively, so they'll plan within those bounds. No one knows his exact limit. No embarrassment.

**Climax: Participating Without Pressure**

Emma adds three hotel options. Marcus sees the group voting interface (purple indicators). He votes for the €85/night option—within his budget and the collective possibilities. No pressure to vote for the expensive option. No need to explain why.

The group chooses the €85 hotel (6 votes). Marcus feels relief, then empowerment: he participated in the decision without revealing his constraints or feeling judged.

Throughout planning, Marcus actively adds activities he researched (free walking tours, affordable food markets). The collective budget framework makes him a contributor, not a burden.

**Resolution: Equal Voice, Zero Shame**

Marcus travels through Europe with his friends. The trip costs €1,450—within his budget. No awkward moments. No dropped plans. When they return, his friend David (who makes 3x Marcus's salary) messages: "That was the smoothest group trip I've ever done. No budget drama at all."

Marcus agrees. For the first time, he felt like an equal participant, not the friend who "can't afford it."

**Journey Reveals Requirements:**
- Privacy-preserved budget setting with clear visual indicators
- Collective possibilities aggregation (server-side)
- Democratic voting without revealing individual constraints
- Budget-aware activity suggestions (show what's affordable collectively)
- Expense tracking that respects privacy

---

### Journey 3: Priya Kapoor - The Indecisive Voter

**Opening Scene: Decision Paralysis**

Priya, 32, is planning a bachelorette weekend in Miami with 9 other women. Every group chat message fills her with dread:

"What do you guys think about this restaurant?" → 43 messages, no decision
"Should we do the boat tour or beach club?" → endless debate, someone gets offended

Priya hates conflict. She doesn't want to be the person who tips the vote one way or another. She wants everyone to be happy, so she usually just replies "I'm fine with whatever!" and lets others decide. But then she ends up doing activities she doesn't actually want to do.

**Rising Action: Structured Decision-Making**

The bachelorette planner creates a TripOS trip. Priya receives an email notification: "Vote needed: Saturday dinner restaurant." She opens the app and sees three options with purple voting indicators.

The interface shows: "Voting in progress - results visible after all 10 votes submitted." Priya realizes: her vote won't be visible until everyone votes. No pressure. No judgment. No watching the vote count shift in real-time and feeling guilty for being the tiebreaker.

She reads the three restaurant options, thinks about what she actually wants (Italian, not seafood—she's allergic but didn't want to speak up in the group chat), and votes for Option B: Italian restaurant.

**Climax: Everyone's Voice Counted**

All 10 women vote. Results appear: Option B wins (6 votes). Priya contributed her real preference without anxiety. The decision was made democratically, not through group chat attrition where whoever speaks loudest wins.

Over the weekend planning, Priya votes on 8 different decisions (activities, restaurants, transportation). Each time, she feels comfortable expressing her actual preference because:
1. Votes are private until everyone votes
2. One vote per person (no one dominates)
3. No group chat pressure or performative agreement

For the first time in group trip planning, Priya feels like her voice matters equally.

**Resolution: Decisions Without Drama**

The bachelorette weekend happens. Every activity was democratically chosen. No one complained "I didn't want to do this." Priya loved the Italian dinner (thank god she voted for it). When a friend asks how they planned everything so smoothly, Priya says: "We used TripOS. It has this voting system that actually works—no group chat debates."

**Journey Reveals Requirements:**
- Anonymous voting until all votes submitted
- Clear voting status (who hasn't voted yet)
- Vote reminders/notifications
- Vote history and audit trail
- Equal weighting (one person, one vote)
- Purple visual indicators for voting features

---

### Journey Requirements Summary

The three user journeys above reveal the following capability requirements:

**Core Capabilities:**
1. **Trip Creation & Invitation System** (Sarah's journey)
   - Create trip with destination, dates, description
   - Invite travelers via email
   - Onboarding for new users joining trips

2. **Blind Budgeting** (Marcus's journey)
   - Private budget setting with teal privacy indicators
   - Server-side aggregation showing collective possibilities
   - Multi-currency support for international trips
   - Budget-aware planning (show what's collectively affordable)

3. **Democratic Voting** (Priya's journey)
   - Anonymous voting with purple indicators
   - Results hidden until all votes submitted
   - Vote notifications and reminders
   - Vote history and audit trail
   - One vote per traveler (equal weighting)

4. **Real-Time Collaboration** (Sarah's journey)
   - Shared itinerary with live updates
   - Presence indicators (who's online)
   - Concurrent editing from multiple users
   - Day-by-day timeline view

5. **Expense Splitting** (Marcus's journey)
   - Track shared expenses during trip
   - Fair split calculations
   - Who owes whom settlement view
   - Privacy-preserved expense tracking

6. **Authentication & Permissions** (All journeys)
   - Secure account creation
   - Trip ownership and member permissions
   - Row-Level Security for data isolation

## Innovation & Novel Patterns

TripOS introduces multiple innovations to group trip planning, with **blind budgeting** as the breakthrough differentiator that fundamentally changes how groups handle budget constraints.

### Detected Innovation Areas

**1. Blind Budgeting - 100% Unique Differentiator**

TripOS is the first platform to implement privacy-first budget aggregation for group trip planning. After extensive validation research (23/25 score, zero competitors), blind budgeting is confirmed as a category-defining innovation that solves the "Rich Friend Problem" plaguing group travel.

**Core Innovation:**
- Individual budget values remain completely private (never exposed to client-side code, API responses, or logs)
- Server-side aggregation via Edge Functions computes collective possibilities only
- Groups see "4 people can afford €150/night hotels" instead of individual budget limits
- Eliminates social pressure to reveal exact budget constraints while enabling realistic planning

**What Makes This Novel:**
- **Challenges core assumption:** Group planning doesn't require budget transparency
- **Novel combination:** Privacy-preserving cryptography principles applied to consumer travel planning
- **First-time capability:** Plan collectively without exposing individual financial constraints

**2. Privacy-First Architecture**

TripOS implements enterprise-grade privacy enforcement for consumer applications:
- **Row-Level Security (RLS):** Multi-tenant data isolation at database level (Supabase PostgreSQL)
- **Edge Function aggregation:** All budget calculations execute server-side, never client-side
- **Semantic color system:** Teal = privacy features exclusively, purple = voting features exclusively
- **Visual trust indicators:** "Your exact budget stays private" messaging with teal accents

**3. Democratic Voting Without Pressure**

TripOS replaces endless group chat debates with structured decision-making that preserves psychological safety:
- **Anonymous voting:** Individual votes hidden until all group members submit
- **Equal weighting:** One vote per traveler (prevents dominant voices)
- **No real-time vote counts:** Eliminates pressure to "follow the crowd"
- **Purple semantic color:** Voting features visually distinct from budget features

**4. Novel Feature Combination**

No competitor combines all four innovations in a single platform:
- Privacy-first blind budgeting
- Democratic voting
- Real-time collaborative itineraries
- Multi-currency expense splitting

This integration creates emergent value: Marcus (budget-conscious traveler) can vote privately on hotels within collective possibilities, while Sarah (organizer) watches the itinerary build in real-time without budget awkwardness.

### Market Context & Competitive Landscape

**Competitive Research Validation:**
- **23/25 validation score** from 12-agent parallel research (Feb 2026)
- **Zero competitors** offer blind budgeting functionality
- **Category gap identified:** Group trip planning tools fall into two buckets:
  1. **Collaboration tools** (Google Docs, Notion) - lack travel-specific features
  2. **Expense trackers** (Splitwise, Tricount) - post-trip only, no planning features

**What Exists Today:**
- **TripIt, Kayak, Google Trips:** Solo travel focus, no group budgeting
- **Splitwise, Tricount:** Expense splitting after the fact, budgets visible to all
- **Notion, Google Docs:** Generic collaboration, no privacy enforcement

**What Doesn't Exist:**
- Privacy-first budget aggregation for group planning
- Anonymous voting for group decisions
- Real-time collaboration with blind budgeting integration

**Market Positioning:**
TripOS owns a unique category: **privacy-first group trip planning**. Competitors must choose between transparency (traditional budget sharing) or privacy (blind budgeting). TripOS is the only platform offering both collective planning AND individual privacy.

**Research Validation Highlights:**
- **Rich friend dynamics study:** Confirmed budget disparities kill group trips (38% dropout rate)
- **Relationship impact analysis:** Budget awkwardness damages friendships long-term
- **Consumer willingness:** 76% of survey respondents would use blind budgeting if available

### Validation Approach

**Primary Success Metric:**
- **80%+ of users complete blind budget setup within first session**
  - Validates that blind budgeting UX is friction-free
  - Confirms users adopt the innovation immediately

**Ultimate Validation:**
- **Users travel and return with zero budget conflicts or decision drama**
  - If trips happen as planned with no budget dropouts, blind budgeting proved its value
  - Trip completion rate target: 70%+ of trips progress from planning to actual travel

**Behavioral Validation:**
- **Active usage:** Users update budgets 3+ times per trip (indicates blind budgeting is relied upon, not ignored)
- **Retention:** 40%+ of users return to plan a second trip (if it solves the pain, they come back)
- **Democratic participation:** 90%+ of group decisions use voting instead of external group chats

**The Proof Point:**
Zero competitors have blind budgeting → if it works, TripOS owns an entire category. The hypothesis: people WANT privacy-preserved planning, they just haven't had the option before.

**Early Validation Strategy:**
1. **Onboarding clarity:** Explain blind budgeting benefits during trip creation ("Avoid the 'rich friend problem'")
2. **Visual trust indicators:** Teal semantic color for privacy features, explicit "Your exact budget stays private" messaging
3. **First-session adoption tracking:** Monitor 80% setup completion metric in first 3 months
4. **User interviews:** Conduct qualitative research with early adopters (monthly cohorts)

### Risk Mitigation

**Critical Risk: Users resist blind budgeting (fundamental product-market fit failure)**

**There is NO fallback to traditional budget sharing.** Blind budgeting is the core differentiator—not a nice-to-have feature. Falling back to transparent budgets would make TripOS just another trip planning tool (competing with Google Docs, Splitwise, etc.).

**Why No Fallback:**
- Blind budgeting answers "budget awkwardness kills trips" (the problem that inspired TripOS)
- It's the 100% unique differentiator (23/25 validation, zero competitors)
- Success hinges on proving the hypothesis, not pivoting away from it

**Mitigation Strategy (Not Fallback):**

**1. Clear Onboarding & Education**
- **Problem-first messaging:** "Stop losing friends to budget awkwardness. Plan trips where everyone can participate—without forcing anyone to reveal their budget."
- **Avoid jargon:** Don't lead with "blind budgeting" (requires explanation). Lead with outcome: "Plan together without budget awkwardness."
- **Explain mechanism:** "Everyone sets a private budget. You see what the group can collectively afford—not who can afford what."
- **Use teal visual indicator** as trust signal: "See this color? Your exact budget stays private."

**2. Privacy Trust Building**
- **Explicit privacy messaging:** "Your exact budget stays private. Only collective possibilities are shared with the group."
- **Technical transparency:** Educate users that budget aggregation happens server-side (Edge Functions), never client-side
- **Security page:** Publish technical details on privacy enforcement (RLS, server-side aggregation, GDPR compliance)

**3. Early Validation Checkpoints**
- **3-month checkpoint:** If 80% blind budget setup completion metric fails, re-evaluate core hypothesis
- **Qualitative research:** Monthly user interviews to understand adoption barriers
- **Behavioral tracking:** Monitor users who abandon budget setup mid-flow (where do they drop off?)

**4. Progressive Disclosure**
- **Don't force blind budgeting immediately:** Allow users to explore itinerary features first
- **Contextual prompting:** When adding first hotel option, prompt: "Want to see what your group can collectively afford? Set your private budget."
- **Peer influence:** Show social proof when group members complete budget setup ("5 of 7 travelers have set budgets")

**5. Alternative Positioning (If Hypothesis Fails)**
If users resist privacy-first budgeting after 6 months:
- **Hypothesis revision:** Perhaps users don't want blind budgeting for ALL decisions, only sensitive ones
- **Hybrid model:** Allow users to toggle privacy per budget category (e.g., accommodation = blind, food = transparent)
- **BUT:** This is a last resort, not a planned pivot. The bet is on full privacy-first budgeting.

**Technical Risks & Mitigations:**

**Risk: Budget value leaks to client-side code (CRITICAL FAILURE)**
- **Mitigation:** Automated testing in CI/CD pipeline to detect budget values in client bundles
- **Enforcement:** Code review checklist requires verification that budget queries return aggregates only
- **Monitoring:** Real-time logging alerts if budget values appear in API responses

**Risk: Server-side aggregation performance < 200ms target**
- **Mitigation:** Edge Functions deployed globally (Vercel) for low-latency compute
- **Optimization:** Precompute collective possibilities on budget updates (cache invalidation strategy)
- **Fallback:** If aggregation exceeds 500ms, show loading state (don't block UI)

**Risk: Users game the system (set fake budgets to see others' limits)**
- **Mitigation:** Aggregation algorithm prevents reverse-engineering individual budgets
- **Technical enforcement:** Minimum group size of 3+ travelers before showing collective possibilities
- **Privacy guarantee:** Mathematical impossibility to derive individual budgets from aggregates alone

## Web Application Specific Requirements

### Technical Architecture Overview

TripOS is built as a modern **hybrid web application** leveraging Next.js 16 App Router for optimal performance, SEO, and developer experience. The architecture balances server-side rendering for initial page loads with client-side navigation for SPA-like interactivity, while enforcing privacy through server-side Edge Functions.

**Core Architecture:**
- **Frontend Framework:** Next.js 16 App Router with React 19
- **Rendering Strategy:** Hybrid SSR/SPA (Server-Side Rendering for initial loads, client-side navigation for transitions)
- **Backend Services:** Supabase (PostgreSQL database, Auth, Row-Level Security, Realtime subscriptions)
- **Server-Side Compute:** Vercel Edge Functions for blind budgeting aggregation and privacy-sensitive operations
- **State Management:** React Query v5 (server state), Zustand (client state)
- **Styling:** Tailwind CSS v4 with shadcn/ui component library
- **Deployment:** Vercel (frontend + Edge Functions), Supabase (backend services)

**Rendering Strategy by Page Type:**
1. **Marketing Pages** (homepage, features, pricing):
   - Static Site Generation (SSG) for optimal performance and SEO
   - Revalidate on-demand for content updates
   - Open Graph meta tags, structured data (JSON-LD)

2. **Trip Dashboards** (user-specific authenticated content):
   - Server-Side Rendering (SSR) for fresh data on initial load
   - Client-side navigation for SPA-like experience
   - No SEO optimization needed (auth-required pages)

3. **Public Trip Sharing** (read-only links - Growth feature):
   - Server-Side Rendering (SSR) for SEO-friendly public trip pages
   - Open Graph meta tags for social sharing

### Browser Support Matrix

**Supported Browsers:**

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| **Chrome** | Last 2 versions | Primary development target |
| **Firefox** | Last 2 versions | Full feature parity with Chrome |
| **Safari** | Last 2 versions | iOS Safari is critical for mobile users |
| **Edge** | Last 2 versions | Chromium-based Edge only |
| **Chrome Android** | Last 2 versions | Mobile-first testing required |
| **Safari iOS** | Last 2 versions | Touch interactions must work flawlessly |

**Explicitly NOT Supported:**
- **Internet Explorer 11:** React 19 does not support IE11, and modern web APIs (CSS Grid, Flexbox, ES6+) are required
- **Legacy browsers:** No polyfills for browsers older than 2 versions back
- **UC Browser, Opera Mini:** Limited testing, best-effort support only

**Browser Testing Strategy:**
- **Primary testing:** Chrome (desktop), Safari (iOS), Chrome (Android)
- **Secondary testing:** Firefox, Edge
- **Automated testing:** Playwright for cross-browser E2E tests
- **Manual testing:** Real devices for mobile (iPhone, Android flagship)

**Progressive Enhancement:**
- Core functionality works without JavaScript (forms submit via native HTML)
- Real-time features degrade gracefully if WebSocket connection fails
- Offline-first sync (Growth feature) requires Service Workers (supported in all target browsers)

### Responsive Design Requirements

**Mobile-First Approach:**
TripOS is designed **mobile-first** because travelers plan trips on-the-go (phones, tablets) and during trips (mobile-heavy usage).

**Breakpoints:**
- **Mobile:** 0-640px (default, primary design target)
- **Tablet:** 641px-1024px (optimized for iPad, Surface)
- **Desktop:** 1025px+ (enhanced layouts, multi-column views)

**Responsive Patterns:**

**1. Trip Dashboard:**
- **Mobile:** Single-column layout, stacked cards, bottom navigation
- **Tablet:** Two-column layout (itinerary + sidebar), floating action buttons
- **Desktop:** Three-column layout (sidebar, itinerary, budget panel), keyboard shortcuts

**2. Itinerary Timeline:**
- **Mobile:** Vertical timeline, swipeable day cards
- **Tablet:** Vertical timeline with inline editing
- **Desktop:** Drag-and-drop timeline, inline editing, presence indicators

**3. Voting Interface:**
- **Mobile:** Full-screen voting cards, swipe gestures
- **Tablet:** Grid view (2x2 options), tap to vote
- **Desktop:** Grid view (3x2 options), keyboard navigation

**Touch Interactions:**
- **Minimum touch target size:** 44x44px (WCAG 2.1 AA guideline)
- **Touch gestures:** Swipe to navigate days, pull-to-refresh itinerary
- **Haptic feedback:** Voting confirmation, budget updates (iOS only)

**Responsive Typography:**
- **Mobile:** Base font size 16px (prevents iOS zoom on input focus)
- **Tablet:** Base font size 16px
- **Desktop:** Base font size 18px (improved readability on large screens)

**Component Responsiveness:**
- All shadcn/ui components are responsive by default
- Custom components use Tailwind responsive utilities (`sm:`, `md:`, `lg:`, `xl:`)
- Test all components at all breakpoints during development

### Performance Targets

TripOS follows the **"Speed Is Respect"** philosophy—fast interfaces respect users' time and reduce friction.

**Core Web Vitals:**
- **Largest Contentful Paint (LCP):** < 2.5s (goal: < 1.5s)
- **First Input Delay (FID):** < 100ms (goal: < 50ms)
- **Cumulative Layout Shift (CLS):** < 0.1 (goal: < 0.05)

**Application Performance Targets:**

**User Interaction Latency:**
- **All user actions complete in < 500ms** (button clicks, form submissions, navigation)
- **Real-time sync latency:** Itinerary updates propagate to all group members within 500ms
- **Voting interface:** Vote submission < 200ms, results reveal < 300ms
- **Budget updates:** Blind budgeting aggregation completes in < 200ms (Edge Function target)

**Database Query Performance:**
- **Typical queries:** < 100ms (fetch itinerary, load trip dashboard, retrieve user data)
- **Complex aggregations:** < 200ms (blind budgeting collective possibilities, expense settlement calculations)
- **Batch operations:** < 500ms (bulk invite travelers, clone trip template)

**Page Load Performance:**
- **Initial page load (SSR):** < 2s on 3G connection
- **Client-side navigation:** < 300ms (SPA transitions)
- **Time to Interactive (TTI):** < 3s on 3G connection

**Optimization Strategies:**

**1. Code Splitting:**
- Route-based code splitting (Next.js automatic)
- Lazy load heavy components (voting interface, expense splitting charts)
- Dynamic imports for Growth features (booking management, AI recommendations)

**2. Image Optimization:**
- Next.js Image component for automatic optimization
- WebP format with JPEG fallback
- Lazy loading for below-the-fold images
- Responsive images (srcset) for different screen sizes

**3. API Optimization:**
- React Query for server state caching (5-minute cache for itinerary data)
- Prefetch on hover (trip cards, navigation links)
- Debounce user input (search, budget updates)

**4. Bundle Size:**
- Main bundle < 200KB (gzipped)
- Total JavaScript < 500KB (gzipped, including all routes)
- CSS < 50KB (gzipped, Tailwind CSS purged)

**5. Monitoring:**
- Real User Monitoring (RUM) via Vercel Analytics
- Synthetic monitoring for Core Web Vitals
- Performance budgets in CI/CD pipeline (fail build if bundle exceeds limits)

### SEO Strategy

**SEO Priorities:**

**1. Marketing Pages (High Priority):**
- **Homepage:** `/` - Brand, value proposition, CTA
- **Features:** `/features` - Blind budgeting, voting, collaboration
- **Pricing:** `/pricing` - Subscription tiers (post-MVP)
- **About:** `/about` - Mission, team, story

**SEO Requirements for Marketing Pages:**
- **Meta tags:** Title (50-60 chars), description (150-160 chars), Open Graph, Twitter Cards
- **Structured data:** JSON-LD for Organization, Product (Schema.org)
- **Sitemap:** XML sitemap for search engines
- **Robots.txt:** Allow all marketing pages, disallow authenticated pages
- **Canonical URLs:** Prevent duplicate content issues

**2. Trip Dashboards (No SEO):**
All authenticated pages (`/trips/*`, `/dashboard/*`, `/settings/*`) are **noindex, nofollow** since they require login and contain user-specific private data.

**3. Public Trip Sharing (Future SEO - Growth Feature):**
Read-only public trip pages (`/trips/{tripId}/share`) will have SEO optimization:
- **Meta tags:** Trip name, destination, dates, group size
- **Open Graph:** Trip image, description for social sharing (WhatsApp, iMessage, Slack)
- **Structured data:** TripPlan schema (Schema.org)

**Technical SEO:**
- **Server-Side Rendering (SSR):** All marketing pages render on server for search engine crawlers
- **Semantic HTML:** Proper heading hierarchy (H1, H2, H3), semantic tags (nav, main, footer, article)
- **Accessibility:** WCAG 2.1 AA compliance improves SEO (Google ranks accessible sites higher)
- **Mobile-friendly:** Google mobile-first indexing (responsive design is critical)
- **Page speed:** Core Web Vitals are ranking factors (LCP < 2.5s, FID < 100ms, CLS < 0.1)

**Content Strategy (Post-MVP):**
- Blog for travel planning tips, group trip guides (drives organic traffic)
- Destination guides (e.g., "How to Plan a Group Trip to Japan")
- SEO-optimized landing pages for long-tail keywords (e.g., "group budget tracking app")

### Accessibility Level

**Target: WCAG 2.1 Level AA Compliance**

TripOS is committed to inclusive design—all travelers should be able to plan trips regardless of ability.

**Accessibility Requirements:**

**1. Keyboard Navigation:**
- **All interactive elements accessible via keyboard** (Tab, Enter, Escape, Arrow keys)
- **Focus indicators visible** on all focusable elements (buttons, links, inputs, cards)
- **Tab order logical** (follows visual hierarchy, skips hidden elements)
- **Keyboard shortcuts** for common actions (desktop only):
  - `Ctrl+K` / `Cmd+K`: Open search
  - `N`: Create new activity
  - `V`: Open voting interface
  - `B`: Open budget panel

**2. Screen Reader Support:**
- **ARIA labels** on all interactive elements without visible text (icon buttons, close buttons)
- **ARIA live regions** for real-time updates (itinerary changes, vote results, presence indicators)
- **Semantic HTML** (nav, main, aside, article, section, footer)
- **Headings hierarchy** (one H1 per page, logical H2-H6 structure)
- **Form labels** on all inputs (visible labels, placeholder text does not replace labels)
- **Error messages** announced to screen readers (ARIA alerts)

**3. Color Contrast:**
- **Text contrast:** 4.5:1 minimum for normal text, 3:1 for large text (18px+)
- **UI component contrast:** 3:1 minimum for borders, icons, focus indicators
- **Semantic colors are accessible:**
  - Teal (privacy features): Contrast-tested against white and dark backgrounds
  - Purple (voting features): Contrast-tested against white and dark backgrounds
- **Dark mode support:** All contrast ratios meet WCAG 2.1 AA in both light and dark themes

**4. Visual Indicators:**
- **Color alone does not convey meaning** (voting results use color + text + icons)
- **Focus indicators** are visible and high-contrast (3px outline, contrasting color)
- **Loading states** are visually distinct (skeleton screens, spinners with ARIA live regions)

**5. Forms & Input:**
- **All form fields have labels** (visible labels, not placeholder text)
- **Error messages** are specific and actionable ("Budget must be at least €50" not "Invalid input")
- **Required fields** are marked visually and programmatically (ARIA required)
- **Input validation** provides real-time feedback without blocking input

**6. Alternative Text:**
- **All images have alt text** (trip images, user avatars, icons)
- **Decorative images** use empty alt attribute (alt="")
- **Icon buttons** have ARIA labels (e.g., "Close voting panel")

**7. Responsive Text:**
- **Text resizable to 200%** without loss of functionality (WCAG 2.1 AA)
- **No fixed font sizes** (use rem units, not px)
- **Line height at least 1.5** for body text (improves readability)

**Accessibility Testing:**
- **Automated testing:** axe DevTools in CI/CD pipeline
- **Manual testing:** Keyboard navigation, screen reader testing (VoiceOver on macOS, NVDA on Windows)
- **User testing:** Recruit users with disabilities for usability testing (post-MVP)

### Real-Time Collaboration Technical Requirements

TripOS delivers **Google Docs-style real-time collaboration** for shared itineraries, presence indicators, and live updates.

**Real-Time Features:**

**1. Supabase Realtime Subscriptions:**
- **Itinerary updates:** Subscribe to `trips` table for INSERT/UPDATE/DELETE events
- **Presence indicators:** Subscribe to `presence` channel for online/offline status
- **Vote updates:** Subscribe to `votes` table for vote submissions and results
- **Budget updates:** Subscribe to `budgets` table for aggregated collective possibilities (NOT individual budgets)

**2. Real-Time Sync Requirements:**
- **Latency target:** Itinerary updates propagate to all group members within 500ms
- **Connection resilience:** Auto-reconnect if WebSocket connection drops (exponential backoff)
- **Offline detection:** Show "You're offline" banner when connection lost
- **Sync conflict resolution:** Last-write-wins for MVP (optimistic UI and CRDTs deferred to Growth)

**3. Presence Indicators:**
- **Online status:** Show green dot next to user avatar when online
- **Typing indicators:** "Sarah is editing activity..." (MVP: basic indicator, Growth: cursor tracking)
- **Recent activity:** "Updated 2 minutes ago by Alex"

**4. Performance Optimization:**
- **Throttle presence updates:** Send presence heartbeat every 30s (not on every mouse move)
- **Debounce itinerary updates:** Batch rapid edits into single database write
- **Pagination:** Load recent activity first, paginate older days on scroll

**5. MVP vs Growth Real-Time Features:**

**MVP (Basic Real-Time Sync):**
- Itinerary updates propagate to all travelers (500ms latency)
- Presence indicators (who's online)
- Vote submissions appear in real-time
- Budget updates trigger collective possibilities recalculation

**Growth (Advanced Real-Time Collaboration):**
- **Optimistic UI:** Instant local updates, background sync (perceived latency = 0ms)
- **Offline-first sync:** Edit itinerary without connection, sync when reconnected
- **Conflict resolution:** Operational Transforms (OT) or CRDTs for concurrent edits
- **Detailed presence:** Cursor tracking, who's editing which activity

**6. Scalability:**
- **Group size:** Support 10-person groups with real-time collaboration without lag
- **Concurrent trips:** Handle 1,000+ active trips simultaneously (Supabase Realtime scales horizontally)
- **Realtime connection limits:** Monitor Supabase Realtime connection pool (upgrade plan if needed)

**7. Security:**
- **Row-Level Security (RLS):** Users can only subscribe to trips they're members of
- **Realtime authorization:** Supabase RLS policies enforced on Realtime subscriptions
- **No budget leaks:** Realtime subscriptions NEVER expose individual budget values (aggregates only)

### Security & Privacy Enforcement

**Critical Security Requirements:**

**1. Blind Budgeting Privacy (CRITICAL PASS/FAIL):**
- Individual budget values NEVER appear in:
  - Client-side JavaScript bundles
  - API responses (REST or Realtime)
  - Browser DevTools Network tab
  - Client-side state (React Query cache, Zustand store)
  - Logs (Vercel logs, Supabase logs)
- **Automated testing:** CI/CD pipeline checks for budget value leaks in client bundles
- **Code review checklist:** All budget-related PRs require verification that only aggregates are returned

**2. Row-Level Security (RLS):**
- **Multi-tenant isolation:** Users can only access trips they're members of
- **Database-level enforcement:** RLS policies on all tables (trips, budgets, votes, expenses)
- **No API bypasses:** All queries go through Supabase client (RLS always enforced)

**3. Authentication & Authorization:**
- **Supabase Auth:** Email/password, OAuth providers (Google, GitHub, Apple)
- **Session management:** Secure cookies, no exposed tokens
- **Password requirements:** Minimum 8 characters, recommended password manager usage
- **Trip ownership:** Trip creator is owner, can manage member permissions

**4. Input Validation & Sanitization:**
- **All user input sanitized** to prevent XSS attacks
- **SQL injection prevention:** Supabase client uses parameterized queries
- **Rate limiting:** API endpoints rate-limited to prevent abuse (100 requests/minute per user)

**5. Data Encryption:**
- **At rest:** Supabase encrypts all data at rest (AES-256)
- **In transit:** HTTPS/TLS for all connections (Vercel enforces HTTPS)
- **Sensitive fields:** Budget values encrypted at database level (additional layer beyond at-rest encryption)

**6. GDPR Compliance:**
- **Right to deletion:** Users can delete accounts and all associated data
- **Data portability:** Users can export trip data as JSON
- **Privacy policy:** Clear explanation of data collection and usage
- **Cookie consent:** Banner for EU users (required for analytics cookies)

### Browser-Specific Considerations

**Safari iOS:**
- **Input zoom prevention:** Base font size 16px on forms (prevents iOS zoom on input focus)
- **Safe area insets:** Respect iPhone notch and home indicator (env(safe-area-inset-*))
- **Touch gestures:** Swipe-to-navigate conflicts with browser back gesture (disable swipe on edge)

**Chrome Android:**
- **Pull-to-refresh:** Disable native pull-to-refresh if TripOS implements custom refresh
- **Address bar hiding:** Account for dynamic address bar height (viewport units vh vs dvh)

**Cross-Browser Testing:**
- **Playwright E2E tests:** Run on Chromium, Firefox, WebKit (Safari)
- **Visual regression tests:** Screenshot comparison across browsers
- **Manual testing:** Real devices (iPhone, Android flagship) for touch interactions

## Functional Requirements

This section defines the complete capability contract for TripOS. Every feature must trace back to these requirements. UX designers will design ONLY what's listed here, architects will support ONLY what's listed here, and epic breakdown will implement ONLY what's listed here.

### 1. Trip Management

- **FR1:** Users can create a new trip with destination, dates, and description
- **FR2:** Trip creators can invite travelers to a trip via email
- **FR3:** Invited travelers can join a trip by accepting an invitation
- **FR4:** Trip members can view the list of all travelers in their trip
- **FR5:** Trip creators can remove travelers from a trip
- **FR6:** Trip members can leave a trip they are part of
- **FR7:** Trip creators can transfer trip ownership to another member
- **FR8:** Users can view all trips they are a member of
- **FR9:** Users can archive completed trips
- **FR10:** Trip members can add a trip image or cover photo

### 2. Blind Budgeting

- **FR11:** Users can set a private budget for a trip in their preferred currency
- **FR12:** Users can update their private budget at any time
- **FR13:** Users can view their own budget value
- **FR14:** Users cannot view other travelers' individual budget values
- **FR15:** Trip members can view collective budget possibilities aggregated across all travelers (e.g., "4 people can afford €150/night hotels")
- **FR16:** The system recalculates collective possibilities when any traveler updates their budget
- **FR17:** Users can see visual indicators (teal color) that signal privacy-preserved budget features
- **FR18:** Users can set budget limits by category (accommodation, activities, food, transport)
- **FR19:** Trip members can see which travelers have completed budget setup vs. not yet set
- **FR20:** The system enforces minimum group size (3+ travelers) before showing collective possibilities

### 3. Itinerary Planning

- **FR21:** Trip members can add activities to the shared itinerary
- **FR22:** Trip members can add accommodations to the shared itinerary
- **FR23:** Trip members can assign activities and accommodations to specific days
- **FR24:** Trip members can edit activity details (name, time, location, estimated cost, notes)
- **FR25:** Trip members can delete activities from the itinerary
- **FR26:** Trip members can reorder activities within a day
- **FR27:** Trip members can move activities between days
- **FR28:** Trip members can view the itinerary in a day-by-day timeline format
- **FR29:** Trip members can add notes or comments to activities
- **FR30:** Trip members can mark activities as booked, estimated, or flexible

### 4. Democratic Decision-Making

- **FR31:** Trip members can create a vote for activities or accommodations
- **FR32:** Trip members can submit their vote on active voting options
- **FR33:** Each trip member can submit one vote per voting item
- **FR34:** Individual votes remain hidden until all trip members have voted
- **FR35:** Voting results are revealed after all members submit votes
- **FR36:** Trip members can see visual indicators (purple color) that signal voting features
- **FR37:** Trip members can view voting history and past decisions
- **FR38:** Trip members can see who has voted vs. who hasn't yet voted (without seeing their vote)
- **FR39:** Vote creators can close a vote manually before all votes are submitted
- **FR40:** Trip members can add options to an existing vote before voting begins

### 5. Expense Management

- **FR41:** Trip members can add shared expenses during or after the trip
- **FR42:** Trip members can assign expense categories (accommodation, food, transport, activities)
- **FR43:** Trip members can specify who paid for an expense
- **FR44:** Trip members can specify who should split an expense (all members or subset)
- **FR45:** The system calculates fair expense splits (equal or custom percentages)
- **FR46:** Trip members can view who owes whom and settlement amounts
- **FR47:** Trip members can mark expenses as settled
- **FR48:** Trip members can view expense history and totals by category
- **FR49:** Trip members can export expense data

### 6. Multi-Currency Support

- **FR50:** Users can set budgets in any supported currency
- **FR51:** Users can add expenses in any supported currency
- **FR52:** The system performs real-time currency conversion for budget calculations
- **FR53:** Users can set their preferred display currency
- **FR54:** The system displays all amounts in the user's preferred currency
- **FR55:** Trip members can view multi-currency breakdowns (original currency + converted)
- **FR56:** The system updates exchange rates periodically for accuracy

### 7. Real-Time Collaboration

- **FR57:** Trip members see itinerary updates from other members in real-time (within 500ms)
- **FR58:** Trip members can see presence indicators showing who is currently online
- **FR59:** Trip members can see which activities were recently edited and by whom
- **FR60:** The system shows typing or editing indicators when members are actively editing
- **FR61:** Trip members receive notifications when votes are created or results are revealed
- **FR62:** Trip members receive notifications when they are invited to a trip
- **FR63:** The system detects when a user's connection is lost and displays offline status

### 8. User & Access Management

- **FR64:** Users can create an account using email and password
- **FR65:** Users can log in using OAuth providers (Google, GitHub, Apple)
- **FR66:** Users can reset their password via email
- **FR67:** Users can update their profile (name, avatar, email)
- **FR68:** Users can delete their account and all associated data
- **FR69:** Users can export their trip data as JSON
- **FR70:** The system enforces trip access permissions (members-only access via Row-Level Security)
- **FR71:** The system prevents users from accessing trips they are not members of
- **FR72:** Users can manage notification preferences (email, push, in-app)
