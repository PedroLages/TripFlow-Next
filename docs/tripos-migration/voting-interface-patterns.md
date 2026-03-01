# Voting Interface UX Patterns Research

**Created**: 2026-02-09
**Status**: Complete
**Purpose**: Comprehensive research on voting/polling interface patterns to inform TripOS's structured voting feature (Phase 3 killer feature)

---

## Executive Summary

This research analyzes 12 voting/polling platforms to identify best practices for TripOS's structured voting feature. TripOS needs yes/no polls, ranked choice voting, approval voting, deadlines/quorum, real-time updates, and anonymous/public voting options.

**Key Finding**: Modern voting UIs prioritize mobile-first design, real-time visual feedback, and drag-and-drop interactions. The most successful platforms (Telegram, Loomio, Mentimeter) balance simplicity with power through progressive disclosure, while failing platforms (Doodle, When2meet) suffer from dated grid interfaces and poor mobile optimization.

**Recommendation**: Adopt drag-and-drop for ranked choice, real-time WebSocket updates, progressive disclosure for complexity, clear status indicators, and privacy toggles. Avoid grid-based interfaces, hidden results, complex creation flows, and system adjudication.

---

## Research Scope

**12 Platforms Analyzed**:

1. **Mainstream Messaging**: Slack, Telegram
2. **Scheduling**: Doodle, When2meet
3. **Specialized Polling**: Loomio, Polly, Simple Poll, StrawPoll
4. **Presentation Tools**: Mentimeter, Slido
5. **Dedicated Voting**: RankedVote, OpaVote

**Focus Areas**:
- Poll creation UX
- Voting mechanisms (yes/no, ranked choice, approval, rating scales)
- Real-time updates
- Deadline/quorum UI
- Mobile-first design
- Results display
- Anonymous vs public voting

---

## Platform Analysis

### 1. Slack Polls

**Overview**: Native Slack polling requires emoji reactions or third-party apps (Polly, Simple Poll).

**Key Features**:
- Native: Post question, list options with emojis, ask members to react
- Third-party (Polly): `/polly` command opens creation modal with preview
- Multiple choice, open-ended, rating questions
- Scheduled polls with recurrence (daily, weekly, monthly)
- Anonymous voting option
- Real-time results in web dashboard
- 7-10x faster response than traditional surveys

**UX Strengths**:
- Inline creation via slash commands
- Interactive preview before posting
- No participant login required
- Results export to CSV

**UX Weaknesses**:
- Native polls lack robust features (no anonymous voting, no auto-closing, poor result tracking)
- Requires third-party apps for serious polling
- Complex setup for ranked choice or approval voting

**Sources**: [Slack Help](https://slack.com/help/articles/229002507-Conversations--Create-a-poll-in-Slack), [Polly](https://www.polly.ai/slack-poll), [Simple Poll](https://simplepoll.rocks)

---

### 2. Telegram Polls

**Overview**: Built-in polling with quiz mode, visible votes, and multiple answers.

**Key Features**:
- **Visible Polls**: Toggle to show who voted for what (default: anonymous)
- **Multiple Answer Options**: Users can select multiple choices
- **Quiz Mode**: Mark correct answers, show results after voting
- **Visual Results**: Percentage bars + participant count
- Up to 11 answer options
- No account required for participants

**UX Strengths**:
- Simple creation: few taps to launch
- Customizable with images/GIFs
- Clear visual feedback (progress bars, percentages)
- Privacy toggle is prominent and clear

**UX Weaknesses**:
- Limited to multiple choice (no ranked choice or approval voting)
- No deadline or quorum features
- No integration with external tools

**Sources**: [Telegram Blog - Polls 2.0](https://telegram.org/blog/polls-2-0-vmq), [Telegram Blog - Polls](https://telegram.org/blog/polls), [AnyControl Guide](https://anycontrol.app/blog/post/create-telegram-poll)

---

### 3. Doodle

**Overview**: Scheduling-focused polling with time slot availability.

**Key Features**:
- Time slot selection for group scheduling
- Visual calendar interface
- Real-time availability heatmap
- Integration with calendar apps

**UX Strengths**:
- Simple, minimal setup
- Clean interface for non-technical users
- Good for scheduling-specific use cases

**UX Weaknesses**:
- **Clunky interface** (multiple reviews cite this)
- **Intrusive ads on free plan**
- **Rudimentary booking interface** - difficult to add context
- **No self-rescheduling** - organizers must cancel and rebook
- **Not mobile-optimized** - criticized as "dated"
- Grid format doesn't scale well to mobile

**Sources**: [Orbit AI - Doodle Alternatives](https://orbitforms.ai/blog/doodle-poll-alternative), [HypeGig - Doodle Review](https://hypegig.com/doodle-review/), [Calday - When2meet vs Doodle](https://calday.com/blog/when2meet-vs-doodle)

---

### 4. When2meet

**Overview**: Free, no-account scheduling with click-and-drag time selection.

**Key Features**:
- Color-coded grid (darker green = more overlap)
- Click-and-drag to select availability
- 15-minute time blocks
- Instant visual heatmap of group availability
- Zero setup (no login, no account)

**UX Strengths**:
- Truly zero friction for participants
- Visual heatmap makes consensus obvious
- Free and simple

**UX Weaknesses**:
- **Notoriously dated, clunky design** (multiple sources cite this)
- **Not optimized for mobile** - difficult on phone screens
- **One-trick pony** - only works for scheduling
- Grid interface doesn't adapt well to small screens
- No integration with calendars or other tools

**Sources**: [Calday - When2meet Guide](https://calday.com/blog/when2meet-guide), [ClickUp - When2meet Alternatives](https://clickup.com/blog/when-2-meet-alternatives/), [MeeterGo](https://meetergo.com/en/magazine/when2meet)

---

### 5. Loomio

**Overview**: Collaborative decision-making platform with multiple voting methods.

**Key Features**:
- **Vote types**: Show of thumbs, multiple choice, score voting, ranked choice, dot voting, time polls
- **Ranked Choice**: Drag-and-drop to rank options, results show 1st/2nd/3rd place counts
- **Customization**: Edit voting options with explanatory text for each choice
- Proposal-based workflow (discussion → proposal → vote)
- Thread-based context for each decision

**UX Strengths**:
- Most flexible voting types (6+ methods)
- Drag-and-drop ranked choice is intuitive
- Utilitarian, distraction-free design
- Strong focus on facilitating group consensus
- Results clearly show ranking distribution

**UX Weaknesses**:
- Interface can feel "utilitarian" vs graphically rich tools
- Learning curve for non-technical users
- Designed for governance, not casual use

**Use Cases**: Best for structured decision-making (boards, co-ops, organizations)

**Sources**: [Loomio Website](https://www.loomio.com/), [Loomio Help - Polls](https://help.loomio.com/en/user_manual/polls/starting_proposals/index.html), [Ranked Choice Announcement](https://www.loomio.com/d/6h72mQEo/new-polling-type-ranked-choice)

---

### 6. Polly (Slack App)

**Overview**: Advanced Slack polling with surveys, Q&A, word clouds, and quizzes.

**Key Features**:
- Free unlimited polls (multiple choice, open-ended, rating)
- Up to 92 choices per poll
- Web dashboard with interactive preview
- Scheduled polls with recurrence
- Reminders for non-voters
- Anonymous voting option
- Real-time results visualization
- Export to CSV

**UX Strengths**:
- `/polly` command is fast and intuitive
- Preview before posting reduces errors
- Scheduling and reminders increase response rates
- 7-10x faster response than email surveys
- Advanced settings accessible via web dashboard

**UX Weaknesses**:
- Requires Slack workspace
- Premium features locked behind paywall
- No ranked choice or approval voting

**Sources**: [Polly Slack](https://www.polly.ai/slack-poll), [Polly Help - Creating Polls](https://www.polly.ai/help/slack/creating-polls), [Capterra - Polly](https://www.capterra.com/p/220058/Polly/)

---

### 7. Simple Poll

**Overview**: General polling UI design patterns (from design showcases).

**Key Features** (from design community analysis):
- Mobile-first UI kits
- Vote tracking with privacy preservation
- Post-vote confirmation (emails, receipts)
- Security and usability balance

**UX Principles**:
- **Simplicity**: Voting should be one-click where possible
- **Transparency**: Show vote flow without revealing individuals
- **Confirmation**: Post-vote feedback makes experience feel "real"
- **Accessibility**: Design for all abilities, screen sizes

**Sources**: [Dribbble - Poll Designs](https://dribbble.com/tags/poll), [Medium - UX of Electronic Elections](https://electpoll.medium.com/the-ux-of-electronic-elections-db15daf8ad4e), [Envato - Polling UI Kit](https://elements.envato.com/polling-mobile-app-ui-kit-QL9H44X)

---

### 8. StrawPoll

**Overview**: Instant, no-login online polls with real-time results.

**Key Features**:
- Create poll in seconds, no account required
- Real-time results via WebSocket push updates
- Results displayed as pie charts or bar graphs
- Customization: deadlines, emoji support, bot/VPN blocking
- Allow multiple answers per voter (configurable)

**UX Strengths**:
- **Fastest creation flow** - truly instant
- **Real-time push updates** keep results current
- **Visual clarity** - pie/bar charts are immediately understandable
- **Zero friction** - no participant login
- Share via link instantly

**UX Weaknesses**:
- Very basic feature set (no ranked choice, approval voting, quorum)
- No discussion or context features
- Results are always public (no privacy toggle)

**Sources**: [StrawPoll](https://strawpoll.com/), [StrawPoll Demo](https://strawpoll.com/demo/), [Polling.com - Free Poll Makers](https://blog.polling.com/best-free-poll-makers-2025-unlimited-responses-compared/)

---

### 9. Mentimeter

**Overview**: Interactive presentation tool with live polling, quizzes, Q&A.

**Key Features**:
- **Interactive slide types**: Polls, word clouds, quizzes, pin-on-image, ranking, 2x2 grids
- **Real-time display**: Submissions appear on screen instantly
- **Presentation mode**: Only active slide visible to audience
- **Anonymous feedback** by default
- Generous free tier (unlimited presentations and participants)

**UX Strengths**:
- Streamlined interface
- Dynamic visual feedback (results animate in real-time)
- No audience account required (join via code)
- Wide variety of question types

**UX Weaknesses**:
- **Learning curve** for new users (customization, question types, settings)
- Designed for presentations, not asynchronous voting
- Requires presenter to control pacing

**Sources**: [Mentimeter](https://www.mentimeter.com/), [Capterra - Mentimeter Reviews](https://www.capterra.com/p/160936/Mentimeter/reviews/), [Beekast - Mentimeter Alternatives](https://www.beekast.com/blog/best-mentimeter-alternatives-for-interactive-representations/)

---

### 10. Slido

**Overview**: Audience interaction platform for Q&A, polling, and quizzes.

**Key Features**:
- **5 poll types** (multiple choice, word cloud, rating, ranking, open-ended)
- **Q&A with upvoting**: Audience asks questions, others upvote favorites
- **Anonymous participation** by default
- **Real-time results**: Display live in "Present Mode"
- **No login required**: Join via link or QR code
- Integrations: Webex, Teams, PowerPoint, Google Slides
- Export results to Excel, PDF, Google Sheets

**UX Strengths**:
- Simple join flow (link/QR code)
- Present Mode shows questions + votes instantly
- Upvoting surfaces best questions
- Strong integrations with video conferencing

**UX Weaknesses**:
- Designed for live events (not async voting)
- Presenter controls pacing
- Limited customization options

**Sources**: [Slido](https://www.slido.com/), [Slido - Live Polling](https://www.slido.com/features-live-polling), [GetApp - Slido](https://www.getapp.com/collaboration-software/a/slido/)

---

### 11. RankedVote & OpaVote

**Overview**: Dedicated ranked choice voting platforms.

**Key Features**:
- **Drag-and-drop ballot**: Reorder candidates by dragging
- **Grid ballot**: Traditional paper-style ballot (better for many candidates)
- **Mobile optimization**: Touch gestures work well on phones
- **Results**: Show round-by-round elimination, winner calculation
- **No account required** for voters

**UX Strengths (Mobile-Optimized Design)**:
- **Clear rank indicators**: Visible rank numbers on each candidate
- **Always-visible controls**: Rank adjustment buttons on each card
- **Drag-and-drop with visual feedback**: Fade-out effect + placeholder on drop target
- **"Put in Order" button**: Reorders list automatically after selection
- **Review screen**: Shows candidates in rank order for final confirmation

**UX Best Practices (from Civic Design research)**:
- **Voter control**: System never reorders candidates without explicit user action (avoid "adjudication")
- **Instructions at point of use**: Explain how to rank within each contest, not just at top
- **Review screen**: Allow voters to verify ranking order before submission
- **Mobile-first**: Design for small screens first, then scale up

**UX Anti-patterns**:
- Table format (rows=candidates, columns=ranks) doesn't work on mobile
- Auto-reordering candidates as side effect of other actions (breaks trust)

**Sources**: [RankedVote Demo](https://www.rankedvote.co/demo), [OpaVote](https://opavote.com/), [Nearform - RCV Mobile Challenge](https://nearform.com/digital-community/ranked-choice-voting-the-mobile-challenge/), [Civic Design - RCV Best Practices](https://civicdesign.org/wp-content/uploads/2022/10/CCD-RCV-Best-Practices-Ballot-Design-2022-1.pdf)

---

## Key UX Patterns by Voting Type

### Yes/No Polls

**Best Practices**:
- Large, tappable buttons (minimum 20mm touch target)
- Clear visual distinction between options (color, icons)
- Instant feedback on tap (animation, state change)
- Results shown as progress bars + percentages
- Anonymous by default, with toggle for public votes

**Examples**: Telegram (simple yes/no with visible votes toggle), Slack reactions (emoji-based), StrawPoll (multiple choice with single-select)

---

### Ranked Choice Voting

**Best Practices**:
- **Drag-and-drop interface**: Intuitive for mobile and desktop
  - Show numbered rank badges on each option
  - Visual feedback during drag (fade-out source, highlight drop target)
  - Smooth animations to reinforce ranking order
- **Alternative: Up/Down buttons**: For accessibility or complex lists
- **"Put in Order" button**: Auto-sort after selection (explicit user action)
- **Review screen**: Show final ranking order before submission
- **Results display**: Table showing 1st/2nd/3rd place vote counts per option

**Key Principle**: Users must always control ranking order - no automatic reordering as side effects

**Examples**: Loomio (drag-and-drop with results table), RankedVote (mobile-optimized with visual feedback), OpaVote (grid ballot for many candidates)

**Sources**: [Civic Design - RCV Best Practices](https://civicdesign.org/wp-content/uploads/2022/10/CCD-RCV-Best-Practices-Ballot-Design-2022-1.pdf), [Nearform - RCV Mobile](https://nearform.com/digital-community/ranked-choice-voting-the-mobile-challenge/)

---

### Approval Voting (Select Multiple)

**Best Practices**:
- Checkboxes or toggle buttons (clear multi-select affordance)
- Show count of selections (e.g., "3 of 8 selected")
- Optional: Set maximum selections (e.g., "Choose up to 3")
- Results show total votes per option (same as multiple choice)
- Progress bars for visual comparison

**Examples**: Telegram (multiple answer polls), Loomio (multiple choice), Polly (up to 92 options)

**Note**: Approval voting is functionally "multiple choice with multiple answers allowed"

---

### Rating Scales / Score Voting

**Best Practices**:
- Star ratings (1-5 or 1-10 scale)
- Thumbs up/down with neutral option
- Slider for continuous range
- Show average score + distribution histogram
- Mobile: Large touch targets for each rating level

**Examples**: Loomio (score voting), Polly (rating questions), Mentimeter (scale questions)

---

## Real-Time Updates

### Technical Implementation

**WebSocket-Based Push Updates**:
- Server pushes vote updates to all connected clients
- Frontend updates UI instantly without page reload
- Redis or in-memory cache for fast vote count updates
- Broadcast to poll-specific channels (not all users)

**Typical Stack**:
- Socket.IO or native WebSockets
- Redis for real-time vote tracking
- React hooks for state management

**Visual Feedback**:
- Progress bars animate when votes change
- Vote counts increment with smooth transitions
- Percentage updates in real-time
- Optional: Show "Someone just voted" notification

**Sources**: [Medium - FastAPI WebSockets Polling](https://abdadeel.medium.com/fastapi-websockets-create-real-time-polling-app-with-fastapi-5c65b01ef581), [GitHub - Real-Time Poll](https://github.com/DaleWebb/real-time-poll), [Medium - Go WebSockets Voting](https://medium.com/@ferdousazad12/real-time-voting-polling-system-with-go-websockets-redis-postgresql-and-docker-b414f122cb5b)

---

### User Experience Benefits

- **Higher engagement**: Users stay to see results
- **Trust**: Live updates feel more legitimate than static results
- **Participation incentive**: Social proof encourages voting

**Examples**: StrawPoll (WebSocket push), Mentimeter (real-time display), Slido (instant results in Present Mode)

---

## Deadline & Quorum UI Patterns

### Deadline Display

**Best Practices**:
- Show deadline prominently above poll (e.g., "Closes in 2 days")
- Countdown timer for urgent deadlines (e.g., "23:45:12 remaining")
- Time zones: Show in voter's local time, clarify timezone
- Visual urgency cues (red text, warning icon when <24 hours remain)

**Examples**: Polly (scheduled polls with reminders), AssociationVoting (real-time deadline tracking)

---

### Quorum Indicators

**Definition**: Minimum votes required for poll to be valid

**Best Practices**:
- Progress bar: "5 of 8 voted" or "63% participation"
- Visual distinction between "quorum met" and "quorum not met"
  - Green checkmark when met
  - Yellow warning when close
  - Red alert when deadline approaching with low participation
- Remind non-voters via notifications (optional opt-in)

**Examples**: AssociationVoting (real-time vote tallies + quorum tracking), ElectionBuddy (turnout quorum vs approval quorum)

**Sources**: [GetApp - AssociationVoting](https://www.getapp.com/collaboration-software/a/associationvoting/), [ElectionBuddy - Quorum](https://electionbuddy.com/blog/2024/07/10/what-is-a-voting-quorum/), [POLYAS - Quorum](https://www.polyas.com/election-glossary/quorum)

---

## Anonymous vs Public Voting

### Privacy Toggle Patterns

**Best Practices**:
- **Default**: Anonymous (most democratic)
- **Toggle**: Clearly labeled "Show votes publicly" or "Visible votes"
- **Icons**: Lock icon (anonymous) vs eye icon (public)
- **Explanation text**: "Names will be hidden" or "Who voted for what will be visible"
- **Privacy indicators**: Show lock badge on poll card if anonymous

**Technical Considerations**:
- Anonymous: Store votes without user ID linkage
- Public: Store voter identity with vote (display in results)
- Hybrid: Show who voted, but not what they voted for

**Examples**: Telegram (visible polls toggle), Polly (anonymous option), eBallot (anonymous voting system)

**Sources**: [Telegram - Polls 2.0](https://telegram.org/blog/polls-2-0-vmq), [eBallot - Anonymous Voting](https://www.eballot.com/anonymous-secret-voting-system), [Enghouse Insights - Online Voting 2025](https://www.enghouseinsights.com/blog/anonymous-secure-inclusive-rethinking-online-voting-in-2025/)

---

### Results Display

**Anonymous Polls**:
- Show aggregated totals only (e.g., "5 votes for Option A")
- Progress bars, pie charts, bar graphs
- Hide individual voter names

**Public Polls**:
- Show voter names next to their choices (e.g., "Alice, Bob, Carol voted for Option A")
- Optional: Avatar/profile pictures
- Useful for accountability (e.g., "Did everyone vote?")

---

## Mobile-First Design Patterns

### Touch Gesture Guidelines

**Minimum Touch Targets**:
- 20mm x 20mm active area per button
- 6.35mm spacing between targets
- Prefer **tap** over complex gestures (swipe, pinch) for accessibility

**Drag-and-Drop on Mobile**:
- Large drag handles (hamburger icon or entire card)
- Clear visual feedback (shadow, scale up, fade-out source)
- Drop zones highlighted during drag
- Haptic feedback on drop (if supported)

**Responsive Design**:
- Single-column layouts for small screens
- Large, thumb-friendly buttons
- Avoid multi-column grids (difficult on phones)
- Bottom navigation or sticky action buttons

**Sources**: [SpringerLink - Touchscreen Voting](https://link.springer.com/chapter/10.1007/978-3-319-39399-5_16), [SurveyMonkey - Mobile Surveys](https://www.surveymonkey.com/mp/how-and-why-to-create-mobile-centric-surveys/)

---

### Mobile-Hostile Anti-patterns

- **Grid layouts** (Doodle, When2meet) - don't scale to small screens
- **Hover states** - no hover on touch devices
- **Small touch targets** - frustrating, error-prone
- **Horizontal scrolling** - awkward on phones
- **Fixed desktop widths** - requires zooming/panning

---

## Progressive Disclosure for Complexity

### Principle

Start simple, reveal advanced options only when needed.

**Examples**:
- **Poll creation**: Basic form (question + 2-3 options) → "Advanced settings" expands to deadline, quorum, anonymous toggle
- **Vote types**: Default to multiple choice → "More vote types" shows ranked choice, approval, rating
- **Results**: Show winner → "View detailed results" shows round-by-round breakdown (for ranked choice)

**Benefits**:
- Reduces cognitive load for casual users
- Keeps interface clean and focused
- Power users can access advanced features without clutter

**Examples**: Loomio (proposal → poll type → advanced settings), Polly (simple command → web dashboard for advanced config)

---

## 5 Patterns TripOS Should Adopt

### 1. Drag-and-Drop for Ranked Choice Voting

**Why**: Most intuitive interaction for ranking preferences, works well on mobile and desktop.

**Implementation**:
- Numbered rank badges on each option card
- Drag handles (hamburger icon or entire card)
- Visual feedback: Fade-out source, highlight drop target, smooth animation
- Always-visible rank adjustment buttons (up/down arrows) for accessibility
- Review screen showing final ranking order

**Examples**: Loomio, RankedVote, OpaVote

**Validation**: [Civic Design research](https://civicdesign.org/wp-content/uploads/2022/10/CCD-RCV-Best-Practices-Ballot-Design-2022-1.pdf), [Nearform mobile voting](https://nearform.com/digital-community/ranked-choice-voting-the-mobile-challenge/)

---

### 2. Real-Time WebSocket Updates with Visual Feedback

**Why**: Increases engagement, builds trust, creates sense of participation.

**Implementation**:
- WebSocket connection for live vote updates
- Animated progress bars (smooth transitions when votes change)
- Vote counts increment with fade-in effect
- Optional: "Someone just voted" toast notification
- Redis or in-memory cache for fast updates

**Examples**: StrawPoll, Mentimeter, Slido, Polly

**Validation**: [Multiple](https://abdadeel.medium.com/fastapi-websockets-create-real-time-polling-app-with-fastapi-5c65b01ef581) [technical](https://github.com/DaleWebb/real-time-poll) [implementations](https://medium.com/@ferdousazad12/real-time-voting-polling-system-with-go-websockets-redis-postgresql-and-docker-b414f122cb5b)

---

### 3. Clear Deadline & Quorum Status Indicators

**Why**: Groups need accountability and urgency to reach consensus.

**Implementation**:
- Progress bar: "5 of 8 voted (63%)"
- Visual states:
  - Green checkmark: Quorum met
  - Yellow warning: Close to quorum
  - Red alert: Deadline approaching, low participation
- Countdown timer: "Closes in 2 days 14:32:15"
- Reminders: Notify non-voters 24 hours before deadline

**Examples**: AssociationVoting, Polly, ElectionBuddy

**Validation**: [AssociationVoting](https://www.getapp.com/collaboration-software/a/associationvoting/), [ElectionBuddy quorum guide](https://electionbuddy.com/blog/2024/07/10/what-is-a-voting-quorum/)

---

### 4. Anonymous/Public Toggle with Privacy Indicators

**Why**: Some decisions need privacy (budget caps), others need transparency (task assignments).

**Implementation**:
- Toggle during poll creation: "Anonymous voting" (default ON)
- Icons: Lock (anonymous) vs eye (public)
- Explanation text: "Names will be hidden" or "Who voted for what will be visible"
- Badge on poll card: Lock icon if anonymous
- Results page: Show voter names only if public

**Examples**: Telegram, Polly, eBallot

**Validation**: [Telegram Polls 2.0](https://telegram.org/blog/polls-2-0-vmq), [eBallot anonymous voting](https://www.eballot.com/anonymous-secret-voting-system)

---

### 5. Progressive Disclosure for Advanced Settings

**Why**: Keep poll creation simple for casual users, reveal power features for complex decisions.

**Implementation**:
- **Basic creation form**: Question + options + submit
- **"Advanced settings" accordion**:
  - Vote type (yes/no, ranked choice, approval, rating)
  - Deadline (date + time)
  - Quorum (% or absolute number)
  - Anonymous vs public
  - Allow vote changes
  - Multiple votes per person
- **Results page**: Show winner → "View detailed results" expands breakdown

**Examples**: Loomio (proposal workflow), Polly (command → web dashboard)

**Validation**: General UX best practice for complex forms

---

## 3 Anti-Patterns TripOS Must Avoid

### 1. Grid-Based Interfaces (Not Mobile-Friendly)

**Why Bad**: Grid layouts (rows=options, columns=attributes) don't scale to small screens. Requires horizontal scrolling, tiny tap targets, difficult to parse.

**Examples of Failure**: Doodle (criticized as "clunky"), When2meet ("notoriously dated, not mobile-optimized")

**TripOS Alternative**: Single-column card-based layout with vertical stacking. Each poll option is a full-width card with large touch targets.

**Sources**: [Calday - When2meet Guide](https://calday.com/blog/when2meet-guide), [HypeGig - Doodle Review](https://hypegig.com/doodle-review/)

---

### 2. Hidden or Delayed Results

**Why Bad**: Users lose trust if results aren't immediately visible after voting. Delayed results reduce engagement and create suspicion.

**Examples of Failure**: Traditional surveys (email results days later), government voting systems (delayed tallies)

**TripOS Alternative**: Real-time results visible immediately after voting. Use progress bars, pie charts, and percentages. For anonymous polls, show aggregated totals without revealing individuals.

**Sources**: [Civic Design - Transparency](https://www.law.upenn.edu/live/news/17588-election-transparency-and-voter-privacy), [StrawPoll real-time](https://strawpoll.com/)

---

### 3. System Adjudication (Auto-Reordering Without User Consent)

**Why Bad**: If the system automatically reorders ranked choices or changes votes as a side effect of other actions, users lose trust. They feel the system is making decisions for them.

**Example**: Auto-sorting candidates as you rank them (without explicit "Put in Order" button) can confuse users or accidentally change their intended ranking.

**TripOS Alternative**: Users maintain explicit control. Only reorder options when user clicks "Put in Order" or drags manually. Always show review screen before final submission.

**Sources**: [Civic Design - Voter Control](https://civicdesign.org/putting-voters-with-disabilities-in-control-in-ranked-choice-voting/), [RCV Best Practices](https://civicdesign.org/wp-content/uploads/2022/10/CCD-RCV-Best-Practices-Ballot-Design-2022-1.pdf)

---

## Implementation Recommendations for TripOS

### Phase 3 Priority (Weeks 10-14)

**Must-Have Features**:
1. Yes/no polls (simplest, highest usage)
2. Multiple choice with single select
3. Real-time results (WebSocket updates)
4. Deadline setting
5. Anonymous/public toggle

**Should-Have Features**:
1. Quorum indicator (% voted)
2. Vote on activities (directly from itinerary)
3. Poll history and audit trail
4. Notifications for deadlines

**Nice-to-Have (Phase 4+)**:
1. Ranked choice voting (drag-and-drop)
2. Approval voting (multi-select)
3. Rating scales (1-5 stars)
4. Recurring polls

---

### Technical Stack Recommendations

**Real-Time Updates**:
- Use Supabase Realtime (already in stack)
- Subscribe to `votes` table changes
- Broadcast updates to poll-specific channels
- Optimistic UI updates (show vote immediately, confirm via server)

**Database Schema** (suggested):
```
polls
  - id, trip_id, creator_id, question, poll_type (yes_no, multiple_choice, ranked_choice, approval, rating)
  - deadline, quorum_required (%), is_anonymous, allow_multiple_votes, allow_vote_changes
  - created_at, closed_at

poll_options
  - id, poll_id, option_text, option_order

votes
  - id, poll_id, option_id, voter_id (NULL if anonymous), rank (for ranked choice), created_at
  - Unique constraint: (poll_id, voter_id) if allow_multiple_votes=false

poll_results (materialized view or computed)
  - poll_id, option_id, vote_count, percentage, rank_distribution (JSON for ranked choice)
```

**UI Components** (suggested):
- `<PollCard>` - Display poll on trip page
- `<PollCreationModal>` - Create new poll
- `<VotingInterface>` - Different UIs for each vote type
- `<PollResults>` - Real-time results display
- `<PollStatusBadge>` - Deadline, quorum, "Voted" indicator

---

### Mobile-First Design Checklist

- [ ] All buttons minimum 20mm x 20mm touch targets
- [ ] Single-column layout for poll options (no grids)
- [ ] Drag-and-drop with large drag handles and visual feedback
- [ ] Bottom navigation or sticky action buttons
- [ ] Responsive text sizes (16px minimum for body text)
- [ ] Progress bars use full width
- [ ] Avoid hover states (use tap/long-press instead)
- [ ] Test on 320px viewport (iPhone SE)

---

### Privacy Architecture

**Anonymous Polls**:
- Store votes without `voter_id` linkage
- Use Row Level Security (RLS) to prevent vote attribution queries
- Hash voter IDs if tracking "who voted" but not "what they voted"

**Public Polls**:
- Store `voter_id` with each vote
- Display voter names in results
- Useful for accountability (task assignments, activity planning)

**Audit Trail**:
- Always log poll creation, closes, vote changes
- Show in activity feed: "Alice created a poll: Where should we eat?"
- Don't show individual votes if anonymous

---

## Competitive Advantage for TripOS

**What TripOS Has That Competitors Don't**:
1. **Structured voting integrated with trip planning** (vote on activities, restaurants, dates)
2. **Ranked choice and approval voting** (most competitors only have simple polls)
3. **Deadline and quorum for group accountability** (missing everywhere)
4. **Anonymous voting for sensitive decisions** (e.g., budget caps)
5. **Real-time updates with context** (see who voted, what's pending)

**What Competitors Have**:
- Wanderlog: Basic hearts (not true voting, no deadlines, no quorum)
- Kayak Huddle: Disconnected polling (not integrated with trip activities)
- Everyone else: No voting at all

**Positioning**: TripOS is the only group travel app that treats decision-making as a first-class feature, not an afterthought.

---

## Next Steps

1. **User interviews**: Show voting mockups to 5-10 potential users, validate need for ranked choice vs approval voting
2. **Prioritize vote types**: Start with yes/no + multiple choice, add ranked choice in Phase 4 if validated
3. **Database schema**: Design tables for polls, options, votes, results
4. **Proof-of-concept**: Build drag-and-drop ranked choice interface, test on mobile
5. **Real-time sync**: Test Supabase Realtime with 10+ concurrent voters

---

## Sources

### Mainstream Tools
- [Slack Help - Create a Poll](https://slack.com/help/articles/229002507-Conversations--Create-a-poll-in-Slack)
- [Telegram Blog - Polls 2.0](https://telegram.org/blog/polls-2-0-vmq)
- [Telegram Blog - Polls](https://telegram.org/blog/polls)
- [Doodle Review - HypeGig](https://hypegig.com/doodle-review/)
- [When2meet vs Doodle - Calday](https://calday.com/blog/when2meet-vs-doodle)

### Specialized Platforms
- [Loomio - Decision Making](https://www.loomio.com/)
- [Loomio - Ranked Choice](https://www.loomio.com/d/6h72mQEo/new-polling-type-ranked-choice)
- [Polly for Slack](https://www.polly.ai/slack-poll)
- [StrawPoll](https://strawpoll.com/)
- [Mentimeter](https://www.mentimeter.com/)
- [Slido - Live Polling](https://www.slido.com/features-live-polling)

### Ranked Choice Voting
- [RankedVote Demo](https://www.rankedvote.co/demo)
- [OpaVote](https://opavote.com/)
- [Nearform - RCV Mobile Challenge](https://nearform.com/digital-community/ranked-choice-voting-the-mobile-challenge/)
- [Civic Design - RCV Best Practices (PDF)](https://civicdesign.org/wp-content/uploads/2022/10/CCD-RCV-Best-Practices-Ballot-Design-2022-1.pdf)
- [Civic Design - Voter Control](https://civicdesign.org/putting-voters-with-disabilities-in-control-in-ranked-choice-voting/)

### Real-Time Implementation
- [Medium - FastAPI WebSockets Polling](https://abdadeel.medium.com/fastapi-websockets-create-real-time-polling-app-with-fastapi-5c65b01ef581)
- [GitHub - Real-Time Poll](https://github.com/DaleWebb/real-time-poll)
- [Medium - Go WebSockets Voting](https://medium.com/@ferdousazad12/real-time-voting-polling-system-with-go-websockets-redis-postgresql-and-docker-b414f122cb5b)

### Privacy & Anonymity
- [Telegram - Polls 2.0 (Visible Votes)](https://telegram.org/blog/polls-2-0-vmq)
- [eBallot - Anonymous Voting](https://www.eballot.com/anonymous-secret-voting-system)
- [Enghouse Insights - Online Voting 2025](https://www.enghouseinsights.com/blog/anonymous-secure-inclusive-rethinking-online-voting-in-2025/)

### Mobile Design
- [SpringerLink - Touchscreen Voting](https://link.springer.com/chapter/10.1007/978-3-319-39399-5_16)
- [SurveyMonkey - Mobile Surveys](https://www.surveymonkey.com/mp/how-and-why-to-create-mobile-centric-surveys/)

### Quorum & Deadlines
- [GetApp - AssociationVoting](https://www.getapp.com/collaboration-software/a/associationvoting/)
- [ElectionBuddy - Quorum](https://electionbuddy.com/blog/2024/07/10/what-is-a-voting-quorum/)
- [POLYAS - Quorum Definition](https://www.polyas.com/election-glossary/quorum)

### Design Resources
- [Dribbble - Poll Designs](https://dribbble.com/tags/poll)
- [Medium - UX of Electronic Elections](https://electpoll.medium.com/the-ux-of-electronic-elections-db15daf8ad4e)
- [Envato - Polling UI Kit](https://elements.envato.com/polling-mobile-app-ui-kit-QL9H44X)

---

**End of Document**
