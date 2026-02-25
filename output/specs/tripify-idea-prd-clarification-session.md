# PRD Clarification Session

**Source PRD**: tripify-idea-prd.md
**Session Started**: February 8, 2026
**Depth Selected**: Long
**Total Questions**: 20
**Progress**: 20/20

---

## Session Log

## Question 1
**Category**: Technical Architecture
**Ambiguity Identified**: PRD lists AI features but doesn't specify implementation approach for MVP
**Question Asked**: Should AI/ML be real from day 1 or mocked for MVP?
**User Response**: Real AI/ML from day 1
**Requirement Clarified**: AI capabilities (recommendations, itinerary building, route optimization) must use real ML models from MVP launch. This requires ML infrastructure, training data, and model serving capabilities.

---

## Question 2
**Category**: Data Sources
**Ambiguity Identified**: PRD doesn't specify where activity/destination data comes from
**Question Asked**: Where does the AI get destination and activity data?
**User Response**: Custom database
**Requirement Clarified**: Tripify will build and maintain its own curated database of destinations and activities. This requires initial content creation/curation and ongoing maintenance, but provides full control over data quality and no dependency on third-party API costs.

---

## Question 3
**Category**: Collaboration Logic
**Ambiguity Identified**: PRD mentions voting but doesn't specify conflict resolution mechanism
**Question Asked**: How does the system resolve conflicting preferences when voting?
**User Response**: Organizer decides
**Requirement Clarified**: The trip organizer has final authority after viewing group votes. This creates a clear hierarchy: collaborators provide input via voting, but the organizer makes final decisions on itinerary composition.

---

## Question 4
**Category**: Authentication & Security
**Ambiguity Identified**: PRD doesn't specify authentication mechanism
**Question Asked**: How should users authenticate and create accounts?
**User Response**: Magic + social
**Requirement Clarified**: Users can authenticate using either magic links (one-time email) or social providers (Google/Apple). This requires implementing OAuth2/OIDC for social providers and an email service for magic links. No password authentication needed.

---

## Question 5
**Category**: Feature Scope
**Ambiguity Identified**: PRD mentions budget tracking but doesn't clarify if it's pre-trip estimates or actual expense logging
**Question Asked**: Is budget & expense for pre-trip planning only, or does it track actual spending?
**User Response**: Full lifecycle
**Requirement Clarified**: The expense feature covers three phases: (1) Pre-trip: estimated costs and budget planning, (2) During trip: actual expense logging and settlement tracking, (3) Post-trip: analysis and reporting. This requires offline expense logging and data persistence across the full trip timeline.

---

## Question 6
**Category**: User Experience
**Ambiguity Identified**: PRD mentions onboarding but doesn't specify how preferences are captured for AI
**Question Asked**: How does the app capture user preferences during onboarding?
**User Response**: Hybrid approach
**Requirement Clarified**: Minimal onboarding (3-5 questions: interests, budget range, travel style) to get started quickly, with optional deep-dive preference survey available in settings. This reduces signup friction while allowing users to provide rich data for better AI recommendations when they choose to.

---

## Question 7
**Category**: Technical Architecture
**Ambiguity Identified**: PRD defers platform decision
**Question Asked**: What should we build first for MVP?
**User Response**: iOS native
**Requirement Clarified**: Tripify MVP will be built as a native iOS app using SwiftUI. This aligns with the existing design system (iOS Mobile) and provides best performance and native user experience. Android and web platforms are deferred to post-MVP.

---

## Question 8
**Category**: Privacy & Security
**Ambiguity Identified**: PRD mentions sharing trips but doesn't specify privacy model
**Question Asked**: Should trips be private by default, or support public discovery?
**User Response**: Private by default
**Requirement Clarified**: All trips are private - only the trip owner and invited collaborators can access. No public trip library or community discovery in MVP. Trips can be shared via invite links, but there's no public browsing. This simplifies privacy implementation and reduces moderation needs.

---

## Question 9
**Category**: Edge Cases
**Ambiguity Identified**: PRD doesn't specify if itinerary can be modified during travel
**Question Asked**: Can travelers modify the itinerary once the trip starts?
**User Response**: Fully editable
**Requirement Clarified**: Itineraries remain fully editable during the trip - travelers can add/remove activities, adjust timing, and make structural changes. This requires real-time sync for all collaborators and offline support for areas with poor connectivity. The itinerary is a living document throughout the trip lifecycle.

---

## Question 10
**Category**: Feature Boundaries
**Ambiguity Identified**: PRD excludes actual bookings but doesn't specify the planning-to-booking transition
**Question Asked**: How should the app handle the transition from planning to booking?
**User Response**: Links with tracking
**Requirement Clarified**: Activities will have deep links to external booking sites (hotels, restaurants, tours). Users can manually mark items as "booked" within Tripify to track completion. This provides a planning-to-booking bridge without transaction complexity. The app shows booking status (not booked, booked, cancelled) for each activity.

---

## Question 11
**Category**: Technical Constraints
**Ambiguity Identified**: PRD mentions offline access but doesn't specify the feature scope
**Question Asked**: What specific features should work without internet?
**User Response**: Full offline editing
**Requirement Clarified**: The app must support full offline editing - users can view and modify itineraries, log expenses, and collaborate without internet. Changes sync when reconnected. This requires local data persistence (Core Data/Realm), conflict resolution for concurrent edits, and background sync. Only AI recommendations require connectivity (cached when available).

---

## Question 12
**Category**: Collaboration Logic
**Ambiguity Identified**: PRD mentions permission levels but doesn't define capabilities
**Question Asked**: What permission levels should exist for trip collaborators?
**User Response**: 3-level hierarchy
**Requirement Clarified**: Three permission levels: (1) Owner - full control including trip deletion, managing collaborators, budget settings; (2) Editor - can edit itinerary, vote on activities, add expenses, invite viewers; (3) Viewer - read-only access to itinerary, can view but not modify. Only the owner can delete the trip or change owner status.

---

## Question 13
**Category**: AI Behavior
**Ambiguity Identified**: PRD doesn't specify when/how AI re-optimizes after preference changes
**Question Asked**: Should AI automatically re-optimize itinerary after votes/preference changes?
**User Response**: Smart hybrid
**Requirement Clarified**: AI uses hybrid approach: minor optimizations (reordering within day, adjusting timing) apply automatically; major structural changes (adding/removing days, changing destinations, significant activity replacement) require organizer approval. This balances automation with user control, preventing jarring unintended changes.

---

## Question 14
**Category**: Data Requirements
**Ambiguity Identified**: PRD doesn't specify the activity data model needed for AI
**Question Asked**: What data attributes must each activity have?
**User Response**: All categories (basic, contextual, social, ML)
**Requirement Clarified**: Comprehensive activity data model with four layers: (1) Basic metadata - type, duration, cost, location, hours; (2) Contextual factors - best time, crowd level, weather dependency, physical intensity; (3) Social signals - ratings, popularity, suitability tags; (4) ML enrichment - photos, descriptions, tags, vector embeddings for similarity matching. This rich data enables sophisticated personalization.

---

## Question 15
**Category**: User Experience
**Ambiguity Identified**: PRD doesn't specify how time is represented in itineraries
**Question Asked**: How should the itinerary represent time - specific times, time blocks, or order?
**User Response**: Hybrid with suggestions (Google Trips model)
**Requirement Clarified**: AI generates suggested times for activities (e.g., "9:00 AM - Breakfast at Tsukiji", "11:00 AM - Senso-ji Temple") but users can override any time. This balances structure (helpful for planning) with flexibility (travel is unpredictable). Activities must have duration but specific times are editable suggestions.

---

## Question 16
**Category**: Feature Logic
**Ambiguity Identified**: PRD mentions expense splitting but doesn't specify the calculation method
**Question Asked**: How should expenses be split among trip participants?
**User Response**: Flexible options
**Requirement Clarified**: Support three splitting methods per expense: (1) Equal split among all participants, (2) Selective splitting (choose specific people to include), (3) Custom splits (percentages or exact amounts). This handles real-world scenarios like group dinners, individual purchases, and uneven contributions. Settlement calculations track all splits and suggest who pays whom.

---

## Question 17
**Category**: Real-time Features
**Ambiguity Identified**: PRD mentions real-time updates but doesn't specify notification behavior
**Question Asked**: How should collaborators be notified of trip changes and updates?
**User Response**: Real-time push for everything
**Requirement Clarified**: All collaboration events trigger immediate push notifications: itinerary changes, new votes, expenses added, comments, invitations. This ensures all collaborators stay synchronized. Requires Apple Push Notification Service (APNs) integration and background sync. Users can disable notifications per-trip in settings if desired (optional mute).

---

## Question 18
**Category**: Data Policy
**Ambiguity Identified**: PRD doesn't specify trip data retention policy
**Question Asked**: What happens to trip data after the trip is completed?
**User Response**: Permanent (industry standard)
**Requirement Clarified**: All trip data is stored indefinitely in the cloud. Users can manually delete trips, but there is no auto-archive or time-based deletion. Past trips remain accessible in the "Past Trips" section for reference, rebooking inspiration, and creating similar trips. This aligns with industry standards (TripIt, Booking.com, Expedia) where trip history drives repeat engagement.

---

## Question 19
**Category**: Success Criteria
**Ambiguity Identified**: PRD mentions success metrics but doesn't define MVP completion criteria
**Question Asked**: What specific outcomes define MVP success?
**User Response**: End-to-end trip creation, Group collaboration works, AI provides value
**Requirement Clarified**: MVP success is defined qualitatively: (1) Users can independently create complete trips from discovery through finalization without support; (2) Groups of 3+ travelers can collaborate with real-time voting and expense tracking; (3) AI recommendations measurably reduce planning time and are rated useful by users. Quantitative targets (user counts, retention) are post-MVP.

---

## Question 20
**Category**: Post-Trip Features
**Ambiguity Identified**: PRD doesn't specify post-trip user experience
**Question Asked**: What should happen when users complete a trip?
**User Response**: Trip recap/summary, Feedback collection, Memory keepsakes
**Requirement Clarified**: Post-trip features include: (1) Trip recap/summary - stats dashboard showing destinations visited, activities completed, total spent vs. budget, distance traveled; (2) Feedback collection - users rate activities/destinations to improve AI recommendations; (3) Memory keepsakes - auto-generated travel journal with itinerary, photos, and key moments. Trip templates are not in MVP (deferred).

---

## Session Complete

**All 20 questions completed.** Session ended: February 8, 2026
