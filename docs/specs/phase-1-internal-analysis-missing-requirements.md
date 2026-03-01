# TripFlow Phase 1 Internal Analysis: Missing Requirements Discovery

**Created**: 2026-03-01
**Status**: Complete
**Purpose**: Comprehensive requirements gap analysis across user journeys, error scenarios, and integration points
**Method**: Three-dimensional systematic analysis to identify missing functional requirements before epic design

---

## Executive Summary

This analysis examines the complete TripFlow/TripOS requirements (72 FRs, 16+ NFRs) to identify **missing requirements** that could cause user friction, system failures, or incomplete feature implementation.

**Key Findings**:
- **33 missing requirements** identified across 3 dimensions
- **Critical gaps** in onboarding, error handling, and post-trip workflows
- **Integration requirements** missing for 8+ external services
- **Privacy edge cases** in blind budgeting not fully specified

**Recommendation**: Address all Critical/High severity gaps before Phase 3 epic design to prevent mid-development scope creep.

---

## DIMENSION 1: User Journey Mapping

### Missing Requirements Identified

#### **Phase 1: Discovery & Signup**

**MR-001: Landing Page Value Proposition Display**
- **User Impact**: New visitors don't understand blind budgeting differentiation within 5 seconds
- **Severity**: High
- **Suggested FR**: FR-001: Landing page must display 3-feature comparison table (TripFlow vs competitors) with blind budgeting, voting, and real-time collaboration highlighted within viewport
- **Example Scenario**: User lands from Google search for "group trip planner", sees generic trip planning features, leaves without understanding privacy-first value prop

**MR-002: First-Time User Onboarding Tutorial**
- **User Impact**: Users don't understand core concepts (blind budgeting, voting deadlines, roles) and make mistakes
- **Severity**: High
- **Suggested FR**: FR-002: After first login, display optional 60-second interactive tutorial with 4 steps: (1) Create trip demo, (2) Blind budget explainer, (3) Voting demo, (4) Invite members. Skippable with "Show me later" option stored in user preferences
- **Example Scenario**: New user invited to trip, sets blind budget incorrectly (confuses "group max" with "my personal budget"), creates confusion

**MR-003: Email Verification Flow**
- **User Impact**: Users create accounts but can't access features until email verified; no clear guidance on what to do while waiting
- **Severity**: Medium
- **Suggested FR**: FR-003: After signup with email/password, display verification pending banner with "Resend verification email" button. Limit feature access to view-only (no trip creation, voting, or budget submission) until verified. Email link expires in 24h with clear expiration message
- **Example Scenario**: User signs up, closes tab, returns 2 days later, can't log in, no explanation of expired verification link

**MR-004: Social Login Data Permissions Transparency**
- **User Impact**: Users unsure what data Google/Apple OAuth shares with TripFlow
- **Severity**: Low
- **Suggested FR**: FR-004: OAuth consent screen must display clear bullet list of data requested: (1) Email address (required), (2) Profile name (required), (3) Profile photo (optional). Link to Privacy Policy displayed below consent button
- **Example Scenario**: Privacy-conscious user abandons signup because OAuth screen doesn't explain what data is shared

#### **Phase 2: First Trip Creation**

**MR-005: Trip Invitee Notification Preferences**
- **User Impact**: Invited members receive email invites but have no way to mute notifications before accepting
- **Severity**: Medium
- **Suggested FR**: FR-005: Invite acceptance screen includes "Notification preferences" toggle: (1) All updates (default), (2) Important only (votes closing, budget reminders), (3) Mute all (opt-in to unmute later). Preference saved before trip access granted
- **Example Scenario**: User accepts invite to trip with 15 active members, receives 40+ notifications in first day, feels spammed, mutes entire app instead of just trip

**MR-006: Waiting Room UX During Low Member Count**
- **User Impact**: Trip creator invites members but sees empty trip workspace for days, unsure if invites sent successfully
- **Severity**: Medium
- **Suggested FR**: FR-006: When trip has < 3 members, display "Waiting Room" empty state on Overview tab with: (1) Invite link copy button (large), (2) List of pending invites with "Resend" buttons, (3) Suggested next steps ("Add activities while you wait", "Set your budget")
- **Example Scenario**: Owner creates trip, sends 5 invites, only 1 person accepts in first 48h, owner unsure if feature is broken or people haven't responded

**MR-007: Blind Budget Small Group Privacy Warning**
- **User Impact**: In trips with 2-3 members, group max calculation can reveal individual budgets (if 2 people, lower budget is exposed)
- **Severity**: Critical (Privacy)
- **Suggested FR**: FR-007: When blind budget submitted in trip with < 4 members, display warning: "Small groups may reveal individual budgets. Group max will show when 4+ members submit budgets." Offer option to "Share budget ranges instead" (visible ranges: $500-700/night) as alternative
- **Example Scenario**: Couple (2 people) both set blind budgets. Group max = $150/night. Person who set $150 knows partner set higher amount, defeating privacy purpose

**MR-008: Trip Template Creation from Past Trips**
- **User Impact**: Repeat travelers (e.g., annual ski trips) must recreate itineraries, member lists, and budget tiers manually
- **Severity**: Medium
- **Suggested FR**: FR-008: Completed trips show "Save as Template" button (owner/organizer only). Template saves: trip structure (destinations, days), activity categories (not specific activities), member list (as suggested invitees), budget tier (Budget/Mid/Comfortable). New trip creation shows "Start from template" option
- **Example Scenario**: User organizes annual Tahoe ski trip with same 8 friends. Year 2 requires copying all members, destinations, and activity types manually

#### **Phase 3: Collaborative Planning**

**MR-009: Activity Conflict Detection and Resolution**
- **User Impact**: Users schedule overlapping activities (e.g., museum tour 2-4pm and lunch reservation at 3pm) without warning
- **Severity**: High
- **Suggested FR**: FR-009: When activity time overlaps with existing activity on same day, display amber warning banner: "Time conflict detected with [Activity Name]". Offer resolution: (1) "Adjust times", (2) "Mark as optional", (3) "Keep both (manual coordination)"
- **Example Scenario**: Group plans Tokyo itinerary, schedules teamLab Borderless (requires 2-3h) at 2pm and dinner reservation at 4pm. Realizes conflict on trip day, misses reservation

**MR-010: Vote Tiebreaker Mechanism**
- **User Impact**: Polls with ranked choice can result in exact ties; no clear process for resolution
- **Severity**: High
- **Suggested FR**: FR-010: When poll closes with tie (2+ options have identical ranked-choice scores), trip owner/organizer receives notification: "Poll '[Poll Name]' ended in tie. Choose resolution: (1) Run-off poll (top 2 options, 24h deadline), (2) Owner decides, (3) Extend deadline 24h for more votes"
- **Example Scenario**: Vote for restaurant (8 options, 12 voters) ends with 2 restaurants tied at 45 points. No mechanism to break tie, group stuck in indecision

**MR-011: Voting Participation Reminders**
- **User Impact**: Polls fail to reach quorum because inactive members don't see deadline approaching
- **Severity**: Medium
- **Suggested FR**: FR-011: Send reminder notification to members who haven't voted when: (1) Poll has 24h remaining, (2) Poll has 2h remaining (if still below quorum). Notification includes direct link to poll and current quorum status ("5 of 8 voted, need 6 to decide")
- **Example Scenario**: Poll requires 60% quorum (8 of 12 members). Only 6 vote by deadline. Poll fails, group must re-create poll, delays decision by 3 days

**MR-012: Activity Proposal vs Confirmed Status Clarity**
- **User Impact**: Users unsure which activities are "definite" vs "suggestions" when browsing itinerary
- **Severity**: Medium
- **Suggested FR**: FR-012: Activities have 3 status states with visual indicators: (1) Confirmed (solid border, checkmark badge), (2) Proposed (dashed border, "Vote" badge if poll active), (3) Tentative (gray border, "Pending" badge). Filter toggle: "Show confirmed only"
- **Example Scenario**: User packs for trip based on itinerary showing 15 activities. Day 1 arrives, discovers only 6 were confirmed, 9 were "proposals" that never got voted on

**MR-013: Member Removal Impact Transparency**
- **User Impact**: Owner removes member but doesn't understand cascading effects (budget recalculation, expense splits invalidated, task reassignments)
- **Severity**: High
- **Suggested FR**: FR-013: Before member removal, display impact preview dialog: "Removing [Name] will: (1) Recalculate group budget (current: $150/night → new: $180/night), (2) Mark 3 shared expenses as 'needs re-split', (3) Unassign 2 tasks. Proceed?" Require confirmation
- **Example Scenario**: Owner removes inactive member. Group max budget jumps from $100 to $200 because removed member had lowest cap. Existing budget-conscious members confused/frustrated

#### **Phase 4: Pre-Trip Finalization**

**MR-014: Booking Confirmation Upload and Verification**
- **User Impact**: Users upload booking PDFs but no way to verify details (dates, names, confirmation codes) match trip
- **Severity**: Medium
- **Suggested FR**: FR-014: When uploading booking confirmation PDF, parse document for: (1) Confirmation number (OCR extraction), (2) Dates (auto-match to trip dates, warn if outside range), (3) Names (flag if doesn't match member list). Display parsed data for user verification before saving
- **Example Scenario**: User uploads hotel confirmation for wrong dates (June instead of July). No warning until arrival day, hotel has no reservation

**MR-015: Itinerary Export for Non-Members**
- **User Impact**: Users want to share finalized itinerary with family/emergency contacts who aren't trip members
- **Severity**: Medium
- **Suggested FR**: FR-015: Itinerary tab includes "Export & Share" options: (1) PDF export (full itinerary, no expenses/budgets), (2) Public link (read-only, expenses hidden, expires in 30 days or at trip end), (3) Calendar export (.ics file for Google/Apple Calendar)
- **Example Scenario**: User's family wants to know where they'll be during 2-week Europe trip. No way to share itinerary without inviting as Guest (too much access)

**MR-016: Pre-Trip Checklist Completion Tracking**
- **User Impact**: Users have scattered tasks (visa applications, vaccinations, packing) with no centralized checklist visible to group
- **Severity**: Low
- **Suggested FR**: FR-016: Trip settings include "Pre-Trip Checklist Templates" (Visa & Documents, Health & Safety, Packing, Bookings). Each template creates task list with common items. Members can check off personal completion. Overview shows "3 of 8 members completed Pre-Trip Checklist"
- **Example Scenario**: Group traveling to India. Visa deadline passes. One member didn't realize visa required, discovers too late, can't join trip

**MR-017: Booking Deadline Missed - Notification and Rescheduling**
- **User Impact**: Users set booking reminders but deadline passes without action; no follow-up prompt
- **Severity**: Medium
- **Suggested FR**: FR-017: When booking task deadline passes without completion, send notification: "[Activity Name] booking deadline passed. Action needed: (1) Mark as booked (if completed offline), (2) Snooze 3 days, (3) Remove from itinerary (sold out/unavailable)". Repeat notification every 3 days until resolved
- **Example Scenario**: Group plans to book Harajuku Go-Kart tour. Reminder set for "2 weeks before trip". Deadline passes, no one books, activity sells out

#### **Phase 5: During Trip**

**MR-018: Offline Mode Data Sync Conflict Resolution**
- **User Impact**: User makes changes offline (add expense, vote), reconnects, conflicts with changes made by others during offline period
- **Severity**: High
- **Suggested FR**: FR-018: When offline changes conflict with server state on reconnect, display "Sync Conflict" dialog with side-by-side comparison: "Your offline change: [details]" vs "Server version: [details]". Options: (1) Keep mine (overwrite), (2) Keep server (discard mine), (3) Merge (if possible, e.g., two different expenses)
- **Example Scenario**: User A offline, adds $50 restaurant expense. User B online, adds same expense. Both reconnect. Duplicate expense created, budget tracking incorrect

**MR-019: Real-Time Expense Entry Location Tagging**
- **User Impact**: Users log expenses during trip but forget which city/day expense occurred (important for category analysis later)
- **Severity**: Low
- **Suggested FR**: FR-019: Expense entry form auto-detects current date and location (if GPS permission granted). Displays: "Adding expense for Tokyo, Day 5 (Sep 12)". User can override if incorrect. Desktop: Prompt for manual date/location selection
- **Example Scenario**: Post-trip, user reviews expenses. All expenses show generic "Europe Trip" with no city breakdown. Can't calculate "We spent $600 in Paris vs $400 in Amsterdam"

**MR-020: Photo Upload to Activity Timeline**
- **User Impact**: Users take photos at activities but no way to attach photos to specific itinerary items for memories
- **Severity**: Low
- **Suggested FR**: FR-020: Each activity card includes "Add Photos" button. Upload up to 10 photos per activity. Photos display in activity detail view. Trip Overview shows photo gallery (all photos, filterable by day/activity). Owner can download all trip photos as ZIP
- **Example Scenario**: Post-trip, users want to remember which restaurant the group photo was taken at. Photos scattered in phone camera roll with no connection to itinerary

**MR-021: Group Chat or Activity Comments**
- **User Impact**: Members have questions about specific activities ("What time should we leave hotel?") but no way to discuss in-context
- **Severity**: Medium
- **Suggested FR**: FR-021: Each activity includes "Comments" section (collapsed by default). Members can post questions/notes. Owner/organizer can pin important comments to top. Notifications sent when someone comments on activity user created or voted on
- **Example Scenario**: Group plans morning hike. Member asks "Should we bring lunch or eat after?". Question sent via WhatsApp, lost in 200+ messages, unanswered

#### **Phase 6: Post-Trip**

**MR-022: Expense Settlement Simplification Algorithm**
- **User Impact**: Complex expense splits result in 10+ settlement transactions (A pays B, B pays C, etc.), inefficient
- **Severity**: Medium
- **Suggested FR**: FR-022: Settlement summary uses debt minimization algorithm (graph optimization) to reduce transactions. Example: Instead of "A owes B $50, B owes C $50", show "A owes C $50 (via B)". Display "Optimized to 3 transactions (from 8)"
- **Example Scenario**: 8-person trip with 40 shared expenses. Settlement shows 15 transactions. Users overwhelmed, some never settle debts

**MR-023: Trip Archive vs Delete Distinction**
- **User Impact**: Users unsure if "Archive" deletes data or just hides trip; fear of losing memories
- **Severity**: Medium
- **Suggested FR**: FR-023: Trip settings show two distinct options: (1) "Archive Trip" (hides from dashboard, data preserved, can restore), (2) "Delete Trip Permanently" (requires typing trip name to confirm, warns about data loss). Archived trips accessible via "Archived Trips" filter in dashboard
- **Example Scenario**: User archives trip thinking it deletes data. Wants to review budget breakdown 6 months later, can't find trip, panics

**MR-024: Post-Trip Survey and Feedback**
- **User Impact**: TripFlow team has no insight into which features worked well vs caused friction
- **Severity**: Low (Product)
- **Suggested FR**: FR-024: 7 days after trip end date, trip owner receives optional feedback survey: (1) Rate overall experience (1-5 stars), (2) "What worked well?", (3) "What was frustrating?", (4) "Would you use TripFlow again?" Responses anonymous, used for product improvement
- **Example Scenario**: 500 trips completed. Product team doesn't know if blind budgeting is causing confusion or delighting users

**MR-025: Trip Recap and Memory Export**
- **User Impact**: Users want to preserve trip memories (photos, itinerary, highlights) in shareable format
- **Severity**: Low
- **Suggested FR**: FR-025: Completed trips show "Create Trip Recap" button. Generates PDF with: (1) Trip cover page (destination, dates, members), (2) Daily itinerary with photos (if uploaded), (3) Budget summary (no individual budgets shown), (4) Group stats ("15 activities, 8 cities, 12 polls completed"). Downloadable and shareable
- **Example Scenario**: User wants to show parents the Europe trip itinerary with photos. No consolidated export, must screenshot 20+ pages or verbally explain

#### **Phase 7: Return User**

**MR-026: Quick Re-Invite Previous Trip Members**
- **User Impact**: Organizing second trip with same friend group requires manually adding 8+ emails again
- **Severity**: Medium
- **Suggested FR**: FR-026: Trip creation flow includes "Invite Members" step with "Import from previous trip" option. Displays dropdown of past trips. Select trip → auto-populate member emails (user can remove/add before sending). Saves 2-3 minutes per trip creation
- **Example Scenario**: Annual ski trip organizer creates new trip every January. Must copy-paste 10 email addresses from last year's trip each time

**MR-027: Trip Dashboard Sorting and Filtering**
- **User Impact**: Power users with 10+ trips can't find specific trip quickly
- **Severity**: Low
- **Suggested FR**: FR-027: Dashboard includes filter/sort options: (1) Status filter (Upcoming, In Progress, Completed, Archived), (2) Sort by (Recent activity, Trip start date, Alphabetical), (3) Search by trip name/destination. Preferences saved per user
- **Example Scenario**: User organized 15 trips over 2 years. Wants to reference "Japan 2024" budget breakdown. Scrolls through 15 cards to find it

**MR-028: Notification Digest Mode**
- **User Impact**: Active users in multiple trips receive 50+ notifications/day, overwhelmed
- **Severity**: Medium
- **Suggested FR**: FR-028: User settings include "Notification Digest" mode: (1) Real-time (default), (2) Hourly digest (batched summary), (3) Daily digest (end of day summary, 8pm local time). Digest includes: "3 new votes, 5 activities added, 2 expenses logged" with links
- **Example Scenario**: User in 4 active trips. Phone buzzes 60 times/day. Disables all notifications, misses important vote deadline

---

## DIMENSION 2: Error Scenarios & Edge Cases

### Missing Requirements Identified

#### **Data Integrity**

**MR-029: Activity Deletion with Dependent Votes**
- **User Impact**: Owner deletes activity that has active poll; voters confused when poll references non-existent activity
- **Severity**: High
- **Suggested FR**: FR-029: Before deleting activity with active poll, display warning: "This activity has an active poll with 5 votes. Deleting will: (1) Close poll immediately, (2) Mark result as 'Cancelled - Activity Removed'. Proceed?" Voters notified of poll cancellation
- **Example Scenario**: Owner deletes "teamLab Borderless" activity. Poll asking "Morning or afternoon visit?" remains active. Voters see poll for deleted activity, confusion

**MR-030: Expense Split Recalculation on Member Removal**
- **User Impact**: Member removed mid-trip has paid/owes money in shared expenses; splits become invalid
- **Severity**: Critical
- **Suggested FR**: FR-030: When member with expense history removed, trigger settlement reconciliation: (1) Calculate member's balance (paid vs owed), (2) Display to owner: "[Name] has net balance of -$45 (owes group). Mark debts as: (1) Settled offline, (2) Forgiven (absorb across remaining members), (3) Track externally". Update remaining member balances accordingly
- **Example Scenario**: User removed after paying for $200 hotel (split 4 ways, owed $150). Removal erases debt, hotel payer loses $150

**MR-031: Trip Ownership Transfer on Owner Account Deletion**
- **User Impact**: Owner deletes account; trip becomes orphaned, no one can manage settings/members
- **Severity**: Critical
- **Suggested FR**: FR-031: Before account deletion, check for owned trips. Display: "You own 3 trips. Transfer ownership before deleting account. For each trip: [Select new owner from Organizers/Members dropdown]". If no other members, offer "Delete trip with account"
- **Example Scenario**: Owner deletes account without transferring. 8-person trip still exists but no one can invite members, close polls, or manage permissions

#### **Concurrency & Conflicts**

**MR-032: Simultaneous Activity Edit Collision**
- **User Impact**: Two users edit same activity (User A changes time to 3pm, User B changes location); last save overwrites both changes
- **Severity**: Medium
- **Suggested FR**: FR-032: Implement optimistic locking with version tracking. When save conflicts with newer version, display: "This activity was updated by [User B] while you were editing. Your changes: [diff]. Their changes: [diff]. Choose: (1) Keep mine (overwrite), (2) Keep theirs (discard mine), (3) Review both (merge manually)"
- **Example Scenario**: User A changes lunch time from 1pm to 2pm. User B simultaneously changes restaurant address. User B saves first. User A saves, overwrites address change unknowingly

**MR-033: Vote Submitted After Deadline (Clock Skew)**
- **User Impact**: User on device with incorrect time sees poll as "open", submits vote after actual deadline; vote rejected
- **Severity**: Low
- **Suggested FR**: FR-033: Poll deadline enforcement uses server time (UTC), not client time. If client attempts vote after deadline, return error: "Poll closed [X minutes ago]. Your device clock may be incorrect (Server time: [UTC], Your time: [device time])". Suggest clock sync
- **Example Scenario**: User's phone clock 15 minutes fast. Submits vote at "2:55pm" (device time). Server time 3:10pm, poll closed at 3:00pm. Vote rejected with cryptic error

**MR-034: Budget Update During Group Ceiling Calculation**
- **User Impact**: User updates budget while server calculating group max; calculation uses stale value or throws error
- **Severity**: Medium
- **Suggested FR**: FR-034: Budget submission includes optimistic lock (version number). If calculation in progress, queue update and recalculate after current operation completes. Display to user: "Budget updated. Group max recalculating (5-15 seconds)". Loading spinner on group max card
- **Example Scenario**: 12-person trip. User updates budget from $100 to $150. Server calculates group max using old $100 value. User sees group max = $100, confused why their increase didn't affect it

#### **Privacy & Security**

**MR-035: Two-Person Trip Privacy Leak**
- **User Impact**: With only 2 members, group max always reveals lower budget (covered partially by MR-007 but needs technical spec)
- **Severity**: Critical (Privacy)
- **Suggested FR**: FR-035: Enforce minimum 3 members for blind budget group max display. With < 3 members: (1) Show "Private budget set ✓" (no dollar amount), (2) Display placeholder: "Group max visible when 3+ members submit budgets", (3) Suggest visible budget ranges as alternative. Technical: RLS policy prevents group max query with < 3 rows
- **Example Scenario**: Couple trip. Partner A sets $100/night, Partner B sets $200/night. Group max shows $100, Partner B knows A's exact budget

**MR-036: Blind Budget Timing Attack Mitigation**
- **User Impact**: Malicious user times budget submission, observes group max change, infers another user's budget
- **Severity**: High (Privacy)
- **Suggested FR**: FR-036: Group max calculation includes random delay (5-15 seconds, server-side only) before returning result. Display "Calculating group budget... (up to 15s)" during delay. Prevents timing correlation between submission and max change
- **Example Scenario**: User A sets budget at 2:00:00pm. Malicious User B watches group max. Max changes at 2:00:03pm from $150 to $130. User B infers User A set $130

**MR-037: Invite Link Expiration and Single-Use Tokens**
- **User Impact**: Trip invite links remain valid indefinitely; security risk if link leaked publicly
- **Severity**: Medium (Security)
- **Suggested FR**: FR-037: Invite links include: (1) Expiration (7 days default, configurable 1-30 days), (2) Optional single-use mode (link invalidates after first use), (3) Max uses (e.g., "Generate link for 5 people"). Owner can view active links and revoke. Expired link shows: "This invite has expired. Contact [Owner Name] for new link"
- **Example Scenario**: Owner posts invite link in public Facebook group by mistake. 50 strangers join trip over 6 months. No way to invalidate link

#### **Financial Edge Cases**

**MR-038: Negative Budget or Zero Budget Handling**
- **User Impact**: User accidentally enters $0 or negative budget; breaks group max calculation
- **Severity**: Low
- **Suggested FR**: FR-038: Budget input validation: (1) Minimum $1 (or local currency equivalent), (2) Maximum $100,000 (sanity check), (3) Decimals allowed (e.g., $150.50). Display error: "Budget must be between $1 and $100,000". Server-side validation enforces same limits
- **Example Scenario**: User enters $0 budget as placeholder. Group max calculates as $0. All activities filtered out as "over budget"

**MR-039: Expense Exceeds Group Budget Limit**
- **User Impact**: Activity costs $250/person but group max is $150; no clear warning when adding activity
- **Severity**: Medium
- **Suggested FR**: FR-039: When adding activity with cost > group max, display warning: "This activity ($250) exceeds group budget max ($150). Add anyway? (1) Yes, mark as 'Over budget' (red badge), (2) Split into optional tiers (some attend, some don't), (3) Cancel". Over-budget activities highlighted in itinerary
- **Example Scenario**: Group max $100/night. User adds luxury hotel at $300/night. No warning. Budget-conscious member sees itinerary, feels excluded/surprised

**MR-040: Currency Conversion Rate Fluctuation Handling**
- **User Impact**: Exchange rate changes 10%+ between planning and trip; budgets/expenses misaligned
- **Severity**: Medium
- **Suggested FR**: FR-040: Expenses display original currency + converted amount with exchange rate and date. Example: "¥15,000 ($100 USD at 150 JPY/USD on Sep 12)". Budget summary shows: "Rates updated Sep 12, 3:00pm UTC. Refresh rates". Rate refresh manual (button) or auto (daily)
- **Example Scenario**: Trip planned in January (1 USD = 150 JPY). Trip occurs in July (1 USD = 140 JPY). Budget $1,500 USD = ¥225,000 (Jan) but only ¥210,000 (July). Group overspends without realizing

---

## DIMENSION 3: Integration Points

### Missing Requirements Identified

#### **Currently Specified Integrations (Missing FRs)**

**MR-041: Google Maps API Rate Limit Handling**
- **User Impact**: Free tier allows 28,500 map loads/month (~1,000/day). Exceeding quota breaks maps for all users
- **Severity**: High
- **Suggested FR**: FR-041: Implement client-side map load throttling: (1) Cache map tiles for 7 days (localStorage/IndexedDB), (2) Lazy-load maps (load on tab focus, not page load), (3) Display static map image (Google Static Maps API) as fallback when quota exceeded. Alert admin at 80% quota usage
- **Example Scenario**: App has 500 active trips. Each trip loads map 10x/day. Quota exceeded by day 6 of month. All maps show error for remaining 24 days

**MR-042: Currency API Fallback Chain Failure**
- **User Impact**: Primary (Frankfurter) and fallback (ExchangeRate-API) both fail; no conversion rates available
- **Severity**: Medium
- **Suggested FR**: FR-042: When both APIs fail, display: "Currency conversion unavailable. Options: (1) Enter all expenses in single currency (USD/EUR/JPY), (2) Use last known rates (cached, may be 24h old), (3) Enable manual conversion (user enters rate)". Cache last successful rate for 7 days
- **Example Scenario**: Trip in Japan. Both APIs down due to service outage. Users can't log expenses in JPY with USD conversion. Trip progress blocked

**MR-043: Email Delivery Failure and Retry Logic**
- **User Impact**: Invite/notification emails fail to send (Resend quota, recipient server rejection); user never notified
- **Severity**: High
- **Suggested FR**: FR-043: Email sending includes: (1) Retry logic (3 attempts, exponential backoff), (2) Dead letter queue for permanent failures, (3) Fallback: in-app notification if email fails ("Email to [user@example.com] failed. Invite sent via in-app notification instead"). Owner notified of failed invites
- **Example Scenario**: User sends invite to 10 members. 2 email addresses invalid. Invites silently fail. Owner assumes all invites sent, waits for acceptances that never come

#### **Potentially Missing Integrations**

**MR-044: Calendar Sync (Google Calendar, Apple Calendar)**
- **User Impact**: Users manually copy trip dates/activities to personal calendars; error-prone and tedious
- **Severity**: Medium
- **Suggested FR**: FR-044: Itinerary tab includes "Add to Calendar" button. Options: (1) Download .ics file (universal), (2) Sync with Google Calendar (OAuth, create "TripFlow: [Trip Name]" calendar), (3) Sync with Apple Calendar (via .ics subscription URL). Updates sync automatically when itinerary changes
- **Example Scenario**: User has 15-activity itinerary for Tokyo. Manually creates 15 calendar events. Activity time changes. User forgets to update calendar, arrives 2h late

**MR-045: SMS Notifications for Critical Deadlines**
- **User Impact**: Email-only notifications missed for urgent deadlines (poll closing in 2h, booking deadline today)
- **Severity**: Low
- **Suggested FR**: FR-045: User settings include "SMS notifications" option (requires phone number verification). SMS sent for: (1) Poll closing within 2h (if unvoted), (2) Booking deadline today, (3) Trip starts tomorrow. Limit: Max 3 SMS/day to avoid spam. Uses Twilio API
- **Example Scenario**: User ignores email notifications. Poll closes in 1h, needs 1 more vote for quorum. User checks phone, no awareness, poll fails

**MR-046: Weather API for Packing and Activity Suggestions**
- **User Impact**: Users pack inappropriate clothing; no weather context when planning activities
- **Severity**: Low
- **Suggested FR**: FR-046: Trip Overview displays 7-day forecast for destination (OpenWeatherMap API or WeatherAPI.com). Itinerary shows daily weather icons (sun, rain, snow) next to each day. Packing checklist auto-suggests items based on forecast (e.g., "Rain expected Day 3-5, pack umbrella")
- **Example Scenario**: User packs for Tokyo in June. Brings only t-shirts. Unexpected cold front, 15°C all week. User unprepared, uncomfortable entire trip

**MR-047: Translation API for International Trips**
- **User Impact**: English-only app excludes non-English travelers; activity names/notes in foreign languages cause confusion
- **Severity**: Low (MVP), High (International Expansion)
- **Suggested FR**: FR-047: Activity descriptions/notes include "Translate" button (Google Translate API). Detects language, translates to user's preferred language (set in profile). Future: Full UI translation via next-intl with 5+ languages (Spanish, French, German, Japanese, Mandarin)
- **Example Scenario**: Japanese user joins trip to Paris. All activity names in French. No way to understand itinerary without external translation app

**MR-048: Flight/Train Tracking API**
- **User Impact**: Group books flight/train, schedule changes (delays, cancellations), no automated alerts
- **Severity**: Low
- **Suggested FR**: FR-048: Booking confirmations with flight numbers integrate with FlightAware or AviationStack API. Display real-time status: (1) On-time (green), (2) Delayed [X min] (amber), (3) Cancelled (red). Notifications sent on status changes. Train: RailAPI or Trainline API
- **Example Scenario**: Group booked 9am flight Tokyo → Osaka. Flight delayed to 2pm. No notification. Group arrives at airport 9am, waits 5h

**MR-049: Payment Gateway for In-App Expense Settlement**
- **User Impact**: Expense settlement shows "A owes B $50" but no way to pay within app; users forget/delay payment
- **Severity**: Low (MVP), Medium (Future)
- **Suggested FR**: FR-049: Settlement summary includes "Pay Now" button (Stripe Connect or PayPal integration). Sender pays amount, receiver notified, expense marked as "Settled". Fee: 2.9% + $0.30 (Stripe standard). Optional: users can decline and settle externally (default)
- **Example Scenario**: Post-trip settlement shows 8 transactions. Users say "I'll Venmo you later", never follow through. Debts remain unsettled 6 months later

**MR-050: Error Monitoring and Crash Reporting**
- **User Impact**: App crashes or errors occur, development team unaware until users complain
- **Severity**: High (Product Quality)
- **Suggested FR**: FR-050: Integrate Sentry for: (1) Frontend error tracking (React error boundaries, unhandled rejections), (2) Backend error tracking (Edge Function errors, database query failures), (3) Performance monitoring (slow API calls, large bundle sizes). Alerts sent to dev team for critical errors (>10 users affected)
- **Example Scenario**: Bug in poll ranked-choice algorithm causes crash for 50 users. Dev team unaware for 3 days. Users abandon app, negative reviews

**MR-051: Analytics for Feature Usage and Retention**
- **User Impact**: Product team doesn't know which features drive retention vs cause drop-off
- **Severity**: Medium (Product Strategy)
- **Suggested FR**: FR-051: Integrate PostHog or Mixpanel for: (1) Event tracking (trip created, budget submitted, vote cast, expense logged), (2) Funnel analysis (signup → trip creation → invite members → completion), (3) Retention cohorts (Day 1, Day 7, Day 30 return rates). Privacy: anonymize user IDs, no PII tracked
- **Example Scenario**: 500 signups/month. Product team doesn't know if users drop off at: (1) Blind budget confusion, (2) Empty trip syndrome (no members), (3) Voting complexity. Can't prioritize improvements

**MR-052: Booking Platform API (Airbnb, Booking.com)**
- **User Impact**: Users research accommodations on Airbnb, manually copy details to TripFlow itinerary
- **Severity**: Low (Future)
- **Suggested FR**: FR-052: Activity creation includes "Import from booking" button. Paste Airbnb/Booking.com URL → API fetches: (1) Property name, (2) Address, (3) Check-in/out dates, (4) Total cost. Pre-fills activity form. Note: Airbnb API restricted; may require web scraping or manual entry
- **Example Scenario**: User books 5 hotels via Booking.com. Must manually type name, address, dates, cost for each. Typos cause incorrect itinerary data

**MR-053: Social Login Providers (GitHub, Facebook)**
- **User Impact**: Users prefer GitHub/Facebook login but only Google/Apple available; barrier to signup
- **Severity**: Low
- **Suggested FR**: FR-053: Add OAuth providers: (1) GitHub (developer audience), (2) Facebook (broad audience). Supabase Auth supports both with minimal config. Display all 4 providers on signup: Google, Apple, GitHub, Facebook
- **Example Scenario**: Developer community user prefers GitHub login (already authenticated). Sees only Google/Apple, creates new account with email/password, poor UX

---

## Summary of Missing Requirements by Severity

| Severity | Count | Examples |
|----------|-------|----------|
| **Critical** | 4 | MR-007 (Small group privacy), MR-030 (Expense recalculation), MR-031 (Ownership transfer), MR-035 (2-person privacy) |
| **High** | 12 | MR-001 (Landing page), MR-002 (Onboarding), MR-009 (Activity conflicts), MR-010 (Tiebreaker), MR-013 (Member removal), MR-018 (Offline sync), MR-029 (Activity deletion), MR-036 (Timing attacks), MR-041 (Maps quota), MR-043 (Email failure), MR-050 (Error monitoring) |
| **Medium** | 20 | MR-003 (Email verification), MR-005 (Notification prefs), MR-006 (Waiting room), MR-008 (Templates), MR-011 (Vote reminders), MR-012 (Activity status), MR-014 (Booking verification), MR-015 (Itinerary export), MR-017 (Booking deadlines), MR-021 (Comments), MR-022 (Settlement optimization), MR-023 (Archive vs delete), MR-026 (Re-invite), MR-028 (Notification digest), MR-032 (Edit conflicts), MR-034 (Budget calc conflicts), MR-037 (Invite expiration), MR-039 (Budget warnings), MR-040 (Currency fluctuation), MR-042 (Currency fallback), MR-044 (Calendar sync), MR-051 (Analytics) |
| **Low** | 17 | MR-004 (OAuth transparency), MR-016 (Pre-trip checklist), MR-019 (Location tagging), MR-020 (Photo upload), MR-024 (Post-trip survey), MR-025 (Trip recap), MR-027 (Dashboard filtering), MR-033 (Clock skew), MR-038 (Budget validation), MR-045 (SMS notifications), MR-046 (Weather API), MR-047 (Translation), MR-048 (Flight tracking), MR-049 (Payment gateway), MR-052 (Booking API), MR-053 (Social logins) |

**Total**: 53 Missing Requirements

---

## Recommendations

### Immediate Action (Before Epic Design)

1. **Address all Critical severity gaps** (MR-007, MR-030, MR-031, MR-035): Blind budgeting privacy is core differentiator; privacy failures are fatal
2. **Spec High severity user journey gaps** (MR-001, MR-002, MR-009, MR-010, MR-013, MR-018): These block core workflows
3. **Define error handling standards** (MR-041, MR-042, MR-043, MR-050): Prevents production incidents

### Phase 2 Additions (Medium Priority)

1. **Notification system enhancements** (MR-005, MR-011, MR-028): Prevents notification fatigue and missed deadlines
2. **Booking workflow improvements** (MR-014, MR-015, MR-017): Critical for pre-trip phase
3. **Collaboration features** (MR-021, MR-026): Improve group coordination

### Phase 3+ (Low Priority / Post-MVP)

1. **Advanced integrations** (MR-044-MR-049, MR-052-MR-053): Calendar sync, weather, translation, payment gateway
2. **Analytics and monitoring** (MR-050, MR-051): Product intelligence
3. **Quality-of-life features** (MR-019, MR-020, MR-024, MR-025, MR-027): Photo upload, trip recap, filtering

---

## Next Steps

1. **Validate Critical/High gaps** with product owner (confirm priorities)
2. **Create functional requirement specs** for approved gaps (add to PRD as FR-073+)
3. **Update UX flows** to include new screens/states (e.g., conflict resolution dialogs, waiting room)
4. **Add technical stories to backlog** for integration points (API setup, error handling)
5. **Proceed to Phase 2: Epic design** with complete requirements baseline

---

**Document Status**: Complete
**Last Updated**: 2026-03-01
**Total Missing Requirements**: 53 (4 Critical, 12 High, 20 Medium, 17 Low)
