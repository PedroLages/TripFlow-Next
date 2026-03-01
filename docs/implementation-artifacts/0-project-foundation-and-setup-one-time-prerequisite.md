---
story_id: E0-S0
story_name: Project Foundation & Setup (One-Time Prerequisite)
status: in-progress
started: 2026-03-01
completed:
reviewed: false
review_started:
review_gates_passed: []
---

# E0-S0: Project Foundation & Setup (One-Time Prerequisite)

## Story Description

**IMPORTANT:** This is a one-time developer setup story that must be completed before any Epic 1 user stories can be implemented. It consolidates all infrastructure and development environment configuration into a single prerequisite task.

As a **developer**,
I want **to set up the complete development infrastructure and integrate all external services**,
So that **I can begin implementing user-facing features with a fully configured environment**.

## Acceptance Criteria

### 1. Development Environment Setup

**Given** I have cloned the TripFlow repository
**When** I run the setup script or follow the installation guide
**Then** all dependencies are installed (Node.js 20+, pnpm, Git)
**And** I can run `pnpm install` successfully without errors
**And** I can run `pnpm dev` and access the app at localhost:3000
**And** Turbopack bundler compiles without "int is not defined" error
**And** README.md includes clear setup instructions with system requirements

### 2. Environment Variables Configuration

**Given** I have access to the required API keys and credentials
**When** I create a `.env.local` file from the `.env.example` template
**Then** the file includes variables for:
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`
- `NEXT_PUBLIC_PEXELS_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BUDGET_ENCRYPTION_KEY` (generate with `openssl rand -base64 32`)
**And** `.env.example` file documents all required variables with descriptions
**And** `.env.local` is in `.gitignore` to prevent credential leakage
**And** the app fails gracefully with clear error messages if required variables are missing

### 3. Supabase Database Initialization

**Given** I have Supabase CLI installed and configured
**When** I run `supabase db reset` or the initialization command
**Then** PostgreSQL 17 database is created locally
**And** pgcrypto extension is enabled for budget encryption
**And** Supabase Auth is configured with email/password provider enabled
**And** Migration files are versioned and tracked in `supabase/migrations/`

### 4. Google Maps API Integration

**Given** I have a valid Google Maps API key with Places API enabled
**When** I add the `@vis.gl/react-google-maps` library to the project
**Then** the library is installed and configured correctly
**And** a basic map component renders on a test page
**And** the Google Maps script loads asynchronously without blocking page load
**And** API key is stored in `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` environment variable
**And** Console shows no CORS, API key, or loading errors
**And** Documentation includes instructions for obtaining and configuring the API key

### 5. Photo APIs Integration with Fallback Chain

**Given** I have valid API keys for Unsplash and Pexels
**When** I configure the photo service with the fallback chain
**Then** the service attempts photo sources in order: Unsplash → Pexels → Google Places → Fallback
**And** if Unsplash fails (rate limit/network error), the service automatically tries Pexels
**And** if all APIs fail, a generic placeholder image is displayed
**And** API keys are stored in environment variables securely
**And** React Query caches photo URLs to minimize API calls
**And** a `PlacePhoto` component accepts size variants (thumb, card, hero, carousel)
**And** unit tests verify the fallback chain behavior

## Tasks

- [ ] **Task 1**: Set up development environment and verify Node.js 20+, pnpm installation
- [ ] **Task 2**: Create `.env.example` template with all required API keys documented
- [ ] **Task 3**: Add graceful error handling for missing environment variables
- [ ] **Task 4**: Initialize Supabase locally with PostgreSQL 17 and pgcrypto extension
- [ ] **Task 5**: Configure Supabase Auth with email/password provider
- [ ] **Task 6**: Install and configure `@vis.gl/react-google-maps` library
- [ ] **Task 7**: Create basic map component and verify Google Maps loads correctly
- [ ] **Task 8**: Implement photo service with Unsplash → Pexels → Google Places → Fallback chain
- [ ] **Task 9**: Create `PlacePhoto` component with size variants (thumb, card, hero, carousel)
- [ ] **Task 10**: Write unit tests for photo fallback chain behavior
- [ ] **Task 11**: Update README.md with setup instructions and system requirements

## Dependencies

**Depends on:**
- None (This is the foundation prerequisite)

**Blocks:**
- E1-S1 (User Registration) - Requires Supabase Auth setup
- E1-S2 (User Login) - Requires Supabase Auth setup
- E1-S3 (OAuth Login) - Requires Supabase Auth setup
- E2-S1 (Create Trip) - Requires database initialization
- E6-S1 (Add Activity Location) - Requires Google Maps API setup
- E7-S1 (Upload Photos) - Requires photo APIs setup

## Technical Notes

**Files to Create:**
- `tripflow-next/.env.example` - Environment variable template with documentation
- `tripflow-next/src/lib/photos/photo-service.ts` - Photo API fallback chain service
- `tripflow-next/src/components/ui/PlacePhoto.tsx` - Photo component with size variants
- `tripflow-next/src/components/ui/GoogleMap.tsx` - Basic Google Maps wrapper component
- `tripflow-next/supabase/migrations/00000000000000_init.sql` - Initial database setup
- `tripflow-next/__tests__/lib/photos/photo-service.test.ts` - Photo service unit tests

**Files to Modify:**
- `tripflow-next/README.md` - Add setup instructions and system requirements
- `tripflow-next/.gitignore` - Ensure `.env.local` is excluded
- `tripflow-next/package.json` - Add Google Maps library dependency

**Tech Stack Patterns:**
- **Photo Service**: React Query for caching, fallback chain pattern
- **Maps**: `@vis.gl/react-google-maps` for Google Maps integration
- **Database**: Supabase CLI for migrations, PostgreSQL 17 with pgcrypto
- **Environment**: Next.js environment variables (`NEXT_PUBLIC_*` for client-side)
- **Testing**: Jest/Vitest for unit tests, verify fallback behavior

**Key Considerations:**
- Security: Never commit `.env.local` to Git
- Performance: React Query caching to minimize API calls
- Resilience: Graceful degradation if APIs fail (photo fallback chain)
- DX: Clear error messages if required env vars are missing
- Accessibility: Ensure map and photo components have proper ARIA labels
- Documentation: README must be clear enough for new developers to set up without help

**API Key Requirements:**
1. **Google Maps Platform** (console.cloud.google.com):
   - Enable Maps JavaScript API
   - Enable Places API
   - Create API key with HTTP referrer restrictions
2. **Unsplash** (unsplash.com/developers):
   - Create app to get access key
   - Free tier: 50 requests/hour
3. **Pexels** (pexels.com/api):
   - Free API key
   - Rate limit: 200 requests/hour
4. **Supabase** (supabase.com):
   - Create project to get URL and anon key
   - Service role key from project settings

## Implementation Plan

See [plan](/Users/pedro/.claude/plans/synthetic-mixing-puzzle.md) for implementation approach.

**Key workstreams (commit each separately):**
1. Environment Variables Documentation (~30 min)
2. Supabase Database Initialization (~20 min)
3. Google Maps API Integration (~45 min)
4. Photo Service Fallback Chain (~60 min)
5. Documentation & README Update (~20 min)

**Total estimated time:** ~3 hours

## Design Review Feedback

[This section will be auto-populated by /review-story if design review runs]

## Code Review Feedback

[This section will be auto-populated by /review-story after code review]

## Testing Notes

**E2E Tests:**
- Not applicable for infrastructure setup story

**Unit Tests:**
- `__tests__/lib/photos/photo-service.test.ts` - Photo fallback chain tests

**Manual Testing:**
1. Clone repo and run `pnpm install` - verify no errors
2. Create `.env.local` from `.env.example` - verify all vars documented
3. Run `pnpm dev` - verify app starts at localhost:3000
4. Access test map page - verify Google Maps renders
5. Test photo component - verify fallback chain works (simulate API failures)
6. Check console - verify no errors for CORS, API keys, or loading

## Challenges and Lessons Learned

[This section will be populated during or after implementation]

**Challenges:**
- [Any blockers or difficulties encountered]

**Solutions:**
- [How the challenges were resolved]

**Lessons:**
- [Key takeaways for future stories]

---

**Epic**: Epic 0 - Project Foundation & Setup
**Sprint**: Sprint 1
**Story Points**: 8
