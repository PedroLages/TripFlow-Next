# Manual Research Prompts for Gemini & Grok

**Created**: February 8, 2026
**Purpose**: LLM prompts for manual research of blocked content (TripAdvisor, Twitter/X, Facebook)

---

## Instructions

1. **For TripAdvisor & Facebook**: Copy prompts into Google Gemini
2. **For Twitter/X**: Copy prompts into Grok (has direct Twitter/X access)
3. **Paste results** into a new file: `manual-research-findings.md`
4. **Time estimate**: 2-3 hours total (30 min per prompt set)

---

## 🔴 PROMPT SET 1: TripAdvisor Forums (Use Gemini)

### Prompt 1A: High-Priority Bachelor/Bachelorette Party Threads

```
I'm researching budget conflicts in group travel. Please analyze these TripAdvisor forum threads and extract information about budget-related problems:

HIGH-PRIORITY THREADS (Focus on these first):
1. https://www.tripadvisor.com/ShowTopic-g1-i12290-k11277549-Bachelor_Party_on_a_budget_Time_Sensitive-Bargain_Travel.html
2. https://www.tripadvisor.com/ShowTopic-g45963-i10-k6605085-Vegas_Bachelor_Party_Planning_Please_Help-Las_Vegas_Nevada.html
3. https://www.tripadvisor.com/ShowTopic-g659488-i11442-k10530026-Planning_Trip_for_Large_Group_Need_Advice-Riviera_Maya_Yucatan_Peninsula.html
4. https://www.tripadvisor.com/ShowTopic-g34438-i92-k11211676-Bachelorette_Party_Ideas_on_a_Budget-Miami_Florida.html
5. https://www.tripadvisor.com/ShowTopic-g1-i12290-k11062997-How_to_split_group_travel_costs-Bargain_Travel.html

For each accessible thread, please extract:

**Thread Analysis Format:**
- Thread title:
- URL:
- Number of replies:
- Date posted (if visible):
- Original poster's problem summary (2-3 sentences):
- Top 3 most upvoted/helpful responses (quote key advice):
- Budget-related conflicts mentioned (quote specific examples):
- Consequences described (dropout, conflict, stress, etc.):
- Solutions recommended by community:
- Emotional language used (guilt, shame, stress, frustration):

**Key Questions:**
1. Do people describe dropping out of trips due to cost?
2. Is there evidence of budget shame or embarrassment?
3. Do people mention friendships damaged by money issues?
4. What solutions do commenters recommend? (transparent discussion, separate booking, etc.)
5. Are there any mentions of wanting tools/apps to help with budget coordination?

**Output Format:**
Please provide findings in a structured markdown table for easy analysis.

If any threads are inaccessible, please note which ones and provide reasoning (404, 403, etc.).
```

---

### Prompt 1B: Family Travel Budget Threads

```
I'm researching budget constraints in family group travel. Please analyze these TripAdvisor forum threads:

FAMILY TRAVEL THREADS:
1. https://www.tripadvisor.com/ShowTopic-g1-i9658-k7451377-Why_are_family_holidays_so_expensive_this_year-Family_Travel.html
2. https://www.tripadvisor.com/ShowTopic-g1-i9658-k4586021-Average_Family_Vacation_Budget-Family_Travel.html
3. https://www.tripadvisor.com/ShowTopic-g150807-i8-k14398512-o20-Family_trip_on_a_tight_budget-Cancun_Yucatan_Peninsula.html
4. https://www.tripadvisor.com/ShowTopic-g1-i12290-k2710660-Need_Ideas_for_a_Budget_Family_Vacation-Bargain_Travel.html
5. https://www.tripadvisor.com/ShowTopic-g1-i9658-k14349124-1_month_family_holiday_10k_budget-Family_Travel.html

For each thread, extract:
- How do families discuss budget constraints?
- Is there evidence of multi-generational travel with income disparities (grandparents, adult children, etc.)?
- Do people mention feeling judged for having lower budgets?
- What budget ranges are discussed? (helps understand if problem spans income levels)
- Do families coordinate budgets before trips, or is it ad-hoc?

**Specific Evidence to Look For:**
- "Can't afford" or "too expensive" language
- Budget comparison between families
- Tension over spending expectations
- Dropout or exclusion due to cost

Please summarize findings in a structured format with direct quotes where possible.
```

---

### Prompt 1C: Large Group Coordination Threads

```
I'm researching coordination challenges in large group travel (6+ people). Please analyze these TripAdvisor threads:

LARGE GROUP THREADS:
1. https://www.tripadvisor.com/ShowTopic-g45963-i10-k2428074-Best_way_to_plan_a_20_group_trip_to_Vegas-Las_Vegas_Nevada.html
2. https://www.tripadvisor.com/ShowTopic-g1-i10702-k11506979-Organize_a_Group_Trip-Air_Travel.html
3. https://www.tripadvisor.com/ShowTopic-g45963-i10-k5345045-Planning_a_group_trip_Which_website_to_use_Travel_agent-Las_Vegas_Nevada.html
4. https://www.tripadvisor.com/ShowTopic-g1-i12530-k7953575-Best_Website_App_for_Planning_Group_Trip-Travel_Gadgets_and_Gear.html

For each thread, extract:
- What are the TOP coordination challenges mentioned? (logistics, budget, preferences, etc.)
- How do budget differences complicate large group planning?
- What tools/apps/methods do people recommend?
- Do people mention avoiding financial coordination entirely? (e.g., "everyone book separately")
- Are there mentions of organizer burnout or unequal planning labor?

**Key Question:**
What problems exist that NO current app solves? (Look for frustrations, workarounds, "I wish there was...")

Please provide findings with direct quotes and categorize by problem type.
```

---

## 🔴 PROMPT SET 2: Twitter/X Real-Time (Use Grok)

### Prompt 2A: Bachelorette/Bachelor Party Budget Complaints

```
I'm researching budget conflicts in bachelor/bachelorette parties. Please search Twitter/X for recent posts (2024-2025) and analyze sentiment:

SEARCH QUERIES:
1. "bachelorette party" expensive "can't afford"
2. "bachelor party" budget debt
3. "bachelorette" dropped out cost
4. "bachelor party" "too expensive" friends
5. "bachelorette" "broke" OR "going broke"
6. "destination bachelorette" afford budget

For each search, please provide:

**Twitter Analysis Format:**
- Search query used:
- Number of relevant tweets found (approximate):
- Date range of tweets:
- Top 5 most viral/engaged tweets (likes + retweets > 1000):
  - Tweet text (verbatim):
  - URL:
  - Engagement metrics (likes, retweets, replies):
  - Sentiment (complaint, advice, humor, outrage):
  - Key themes (debt, shame, exclusion, etc.):

**Questions to Answer:**
1. How many people explicitly mention going into debt for bachelor/bachelorette parties?
2. What language indicates budget shame? (e.g., "don't want to seem cheap", "can't tell her I can't afford it")
3. Are there stories of people dropping out or being excluded due to cost?
4. What's the community sentiment? (sympathy for budget-constrained, or criticism?)
5. Do people suggest solutions? (what are they?)

**Viral Stories to Identify:**
- The Cabo bachelorette $15 bottle service dispute (we know this went viral)
- Any other stories with 100K+ views about budget conflicts

Please provide findings in structured format with direct tweet links for verification.
```

---

### Prompt 2B: Group Trip Budget Complaints (General)

```
I'm researching budget issues in friend group travel. Please search Twitter/X for posts about group trip budget problems:

SEARCH QUERIES:
1. "group trip" budget "can't afford" OR "too expensive"
2. "friends trip" money "different budgets"
3. "group vacation" expensive dropped out
4. "travel with friends" afford budget
5. "group trip" planning budget awkward
6. "friends trip" rich friend expensive

For each search, extract:

**Analysis Focus:**
- How often do people complain about budget mismatches in friend groups?
- What consequences do people describe? (conflict, dropout, resentment)
- Is there evidence of "rich friend" dynamics causing issues?
- Do people mention feeling pressure to overspend to keep up?
- Are budget discussions described as "awkward" or uncomfortable?

**Specific Evidence Types:**
1. **Direct complaints**: "My friends planned a trip I can't afford"
2. **Advice requests**: "How do I tell my friends I can't afford the trip?"
3. **Vent posts**: Stories about trips that went wrong due to money
4. **Solution requests**: "How do you plan trips with different budgets?"

**Output Format:**
- Total relevant tweets found (estimate):
- Top 10 most representative tweets (text + URL + engagement):
- Common themes (rank by frequency):
- Language patterns (how people talk about budget issues):
- Solutions mentioned (if any):

Please focus on tweets from 2024-2025 for recency.
```

---

### Prompt 2C: Verification of Specific Viral Stories

```
I'm verifying specific viral stories about group travel budget conflicts. Please search for and analyze these:

KNOWN VIRAL STORIES TO VERIFY:
1. Cabo bachelorette party - $800 bottle service split caused $15 dispute, friendships ended (Sept 2024, ~4.9M views)
   - Search: "cabo bachelorette" bottle service OR "$15" friendship
   - Search: @moneytomiles bachelorette OR bridesmaids costs

2. Bachelorette party debt viral thread (woman went into debt 10 years ago)
   - Search: "went into debt" bachelorette party 10 years
   - Possible user: @kaitduffy (status 2003673365958263147)

3. Any other highly viral stories (>1M views) about:
   - Group travel budget conflicts
   - Bachelorette/bachelor party costs
   - "Rich friend" problems on trips
   - Destination wedding expenses

For each story found, please provide:
- Original tweet/thread URL:
- Date posted:
- Engagement metrics (views, likes, RTs, replies):
- Full story summary:
- Community reaction (what did replies say?):
- Did it get news coverage? (search for news articles about it):

**Key Question:**
Do these viral stories validate that budget conflicts in group travel are widespread enough to capture public attention?

Please verify engagement numbers and provide screenshots/archives if possible.
```

---

### Prompt 2D: Expert/Influencer Takes on Group Travel Budgets

```
I'm looking for expert commentary and advice about group travel budgets on Twitter/X. Please search for:

TARGET ACCOUNTS (search their tweets):
1. Travel influencers discussing group travel budget tips
2. Financial advisors commenting on vacation debt
3. Wedding planners discussing bachelorette party costs
4. Personal finance accounts discussing travel budgeting

SEARCH QUERIES:
1. from:NerdWallet OR from:ThePenny Hoarder OR from:getmoney group travel budget
2. from:TheKnot OR from:WeddingWire bachelorette party cost OR budget
3. "travel expert" OR "travel advisor" group trip budget different
4. "financial therapist" OR "money coach" vacation debt friends

For each relevant account/tweet, extract:

**Expert Analysis Format:**
- Account name and credentials:
- Tweet/thread URL:
- Date:
- Main advice/recommendation:
- Is budget shame or awkwardness mentioned?
- Are specific solutions recommended? (what are they?)
- Engagement on the tweet (likes, RTs):

**Key Question:**
Do experts recognize group travel budget coordination as a significant problem? What solutions do they recommend?

Please identify the TOP 5 most authoritative expert takes with highest engagement.
```

---

## 🟡 PROMPT SET 3: Facebook Groups (Use Gemini)

### Prompt 3A: Validation of Expert Recommendations (News/Advice Articles)

```
I'm researching whether travel experts recommend anonymous budget surveys for group travel. We found one strong source (Fodor's), but I want to verify this is a widespread recommendation.

SEARCH QUERIES (use Google via Gemini):
1. "group travel" "anonymous survey" budget
2. "group trip planning" "budget" "avoid awkward"
3. "travel experts recommend" group budget coordination
4. "financial therapist" group travel budget shame
5. "how to ask friends" afford trip budget

Please search these queries and analyze the TOP 10 results for each. Extract:

**Expert Recommendation Analysis:**
- Article title and URL:
- Publication/Source (e.g., NerdWallet, Fodor's, HuffPost):
- Author credentials (travel expert, financial advisor, etc.):
- What problem do they describe? (budget conflicts, awkwardness, dropout):
- What solutions do they recommend? (quote specific advice):
- **CRITICAL**: Do they recommend anonymous/private budget collection? (yes/no + quote):
- Do they mention budget shame or embarrassment explicitly?

**Key Question:**
How many major publications/experts recommend anonymous budget surveys or private budget coordination?

**Output Format:**
- Total articles analyzed:
- Number recommending anonymous/private budgets:
- Number recommending open/transparent budgets:
- Number offering no specific solution:
- TOP 5 strongest expert validations (quote + URL):

This will help us validate whether "experts already recommend this" is a strong claim.
```

---

### Prompt 3B: Facebook Travel Groups Identification & Accessibility

```
I'm trying to understand if Facebook travel groups discuss budget issues, even though I can't access the groups directly.

APPROACH: Search for articles, blog posts, or Reddit discussions that REFERENCE Facebook travel groups discussing budget topics.

SEARCH QUERIES:
1. "facebook travel group" budget "can't afford"
2. "travel facebook group" money different budgets
3. site:reddit.com "facebook group" travel budget conflict
4. "family travel facebook group" budget issues
5. "budget travel babes" OR "travel on a budget official" group discussions

For each search result, extract:

**Secondary Evidence Format:**
- Source (article, blog, Reddit post):
- URL:
- What Facebook group is mentioned?
- What budget issue is described?
- Are there any quotes or screenshots from the Facebook group?
- Is the issue framed as common or rare?

**Alternative Search:**
Search for: "I saw in a facebook group" travel budget OR trip budget OR group trip

This may surface blog posts or articles where people reference Facebook discussions about budget issues.

**Key Question:**
Even without direct Facebook access, can we find evidence that budget issues are discussed in travel Facebook groups?

Please provide top 10 results with direct quotes where available.
```

---

### Prompt 3C: Reddit References to Facebook Travel Groups

```
I'm looking for Reddit posts where people reference budget discussions from Facebook travel groups.

SEARCH ON REDDIT (via Gemini):
1. site:reddit.com "facebook group" travel budget
2. site:reddit.com "facebook" group trip money OR budget different
3. site:reddit.com r/travel "saw in a facebook group" budget
4. site:reddit.com r/travel facebook recommendation trip budget

For each Reddit post/comment found, extract:

**Reddit-to-Facebook Connection:**
- Reddit post URL:
- Subreddit:
- Date:
- What Facebook group is referenced? (name if mentioned):
- What budget issue is discussed?
- Reddit community's response:
- Upvotes/engagement:

**Questions to Answer:**
1. Do Reddit users reference Facebook travel groups as places where budget issues come up?
2. Are there cross-posted stories (originated on Facebook, discussed on Reddit)?
3. Do Reddit users recommend Facebook groups for budget travel planning?

**Output Format:**
- Total relevant Reddit posts found:
- Top 5 posts with highest engagement:
- Common themes across posts:

This provides indirect evidence of Facebook group discussions without needing direct access.
```

---

## 📋 OUTPUT TEMPLATE FOR FINDINGS

When you complete the manual research, please format findings using this template:

```markdown
# Manual Research Findings - [Platform Name]

**Date completed**: YYYY-MM-DD
**Researcher**: [Your name]
**Prompts used**: [Prompt numbers, e.g., 1A, 2B, 3C]
**Time spent**: [X hours]

---

## Summary

**Total sources analyzed**: [number]
**Key findings**: [3-5 bullet points]
**Strongest evidence**: [What's the smoking gun?]
**Disconfirming evidence**: [What contradicts our hypothesis?]

---

## Detailed Findings

### [Platform/Topic]

**What we were looking for:**
[Description]

**What we found:**
[Analysis]

**Direct quotes** (top 5):
1. "[Quote]" — [Source URL]
2. "[Quote]" — [Source URL]
3. ...

**Evidence strength**: [High/Medium/Low]

**Impact on validation**: [Does this strengthen or weaken our 23/25 score?]

---

## Recommendations

Based on manual research findings:
1. [Recommendation 1]
2. [Recommendation 2]
3. [Should we adjust validation score?]

---

## Sources

[Full list of URLs accessed]
```

---

## Quick Reference: Which Tool for Which Prompt?

| Platform | Prompt Set | Recommended AI Tool | Why |
|----------|-----------|---------------------|-----|
| TripAdvisor | 1A, 1B, 1C | **Google Gemini** | Can access web pages directly |
| Twitter/X | 2A, 2B, 2C, 2D | **Grok** | Has native Twitter/X search access |
| Facebook (indirect) | 3A, 3B, 3C | **Google Gemini** | Search for articles referencing FB groups |

---

## Time Estimates

| Prompt Set | Estimated Time | Priority |
|-----------|---------------|----------|
| **2A-2D: Twitter/X via Grok** | 45-60 min | **HIGH** (biggest gap in validation) |
| **1A: TripAdvisor bachelor/bachelorette** | 30-45 min | **MEDIUM** (nice-to-have quotes) |
| **3A: Expert validation** | 30 min | **MEDIUM** (strengthen existing finding) |
| **1B: TripAdvisor family travel** | 20-30 min | **LOW** (demographic expansion) |
| **1C: TripAdvisor large groups** | 20-30 min | **LOW** (coordination issues) |
| **3B-3C: Facebook indirect** | 30 min | **LOW** (indirect evidence only) |

**Total estimated time**: 3-4 hours
**Minimum viable research**: Prompts 2A-2D (Twitter/X) = 1 hour

---

## Success Criteria

### What would STRENGTHEN validation (increase score)?

**Demand Signal 4/5 → 5/5:**
- Find explicit user requests: "I wish there was an app that..."
- Find Twitter threads with >100 replies discussing need for budget tools
- Find evidence of competitors TRYING to build this but failing

**Problem Intensity 5/5 (already max, but more evidence):**
- Find more stories of severe consequences (debt, ended friendships)
- Find quantitative data on trip cancellation rates due to budget issues

### What would WEAKEN validation (decrease score)?

**Red flags to watch for:**
- Evidence that "just talking openly" works well for most groups
- Existing tools that solve this adequately (that we missed in competitor research)
- Cultural evidence that budget transparency is NOT stigmatized

---

## Post-Research Checklist

After completing manual research:

- [ ] Save findings to: `/docs/research/manual-research-findings.md`
- [ ] Update VALIDATION-COMPLETE-SUMMARY.md with new evidence (if significant)
- [ ] Decide: Does this change validation score? (23/25 → ?)
- [ ] Extract best quotes for marketing messaging framework
- [ ] Identify any new risks or concerns
- [ ] Update AGENT-ACCESS-LIMITATIONS-SUMMARY.md with "Manual Research Completed" section

---

**Last Updated**: February 8, 2026
**Status**: Ready for manual research execution
**Priority**: Twitter/X research via Grok (highest impact on validation)
