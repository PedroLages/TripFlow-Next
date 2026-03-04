# TripFlow - Collaborative Trip Planning

TripFlow is a modern, collaborative trip planning application built with Next.js, Supabase, and Google Maps. Plan trips with friends, manage budgets, track itineraries, and discover destinations together.

## System Requirements

- **Node.js** 20+ (verify with `node -v`)
- **pnpm** 8+ (install with `npm install -g pnpm`)
- **Docker Desktop** (for local Supabase)
- **Supabase CLI** (install with `brew install supabase/tap/supabase` on macOS)

## Quick Start

### 1. Clone and Install

```bash
git clone <repo-url>
cd tripflow-next
pnpm install
```

### 2. Configure Environment Variables

Copy the example file and fill in your API keys:

```bash
cp .env.example .env.local
```

#### Required API Keys

**Supabase** (Get from local instance - see step 3):
- `NEXT_PUBLIC_SUPABASE_URL` - Local: `http://127.0.0.1:54421`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - From `supabase start` output
- `SUPABASE_SERVICE_ROLE_KEY` - From `supabase start` output

**Budget Encryption**:
```bash
# Generate a secure key
openssl rand -base64 32
```
Add to `.env.local` as `BUDGET_ENCRYPTION_KEY`

**Google Maps** ([Get API key](https://console.cloud.google.com/apis/credentials)):
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Same key for both
- `GOOGLE_PLACES_API_KEY`

Required APIs to enable:
- **Places API (New)** - [Enable here](https://console.cloud.google.com/apis/library/places-backend.googleapis.com)
  - ⚠️ **Important**: Use the NEW API, not the legacy "Places API"
  - TripFlow uses `places.googleapis.com/v1` endpoints
- Maps JavaScript API (optional - only needed for `/test-maps` page)

**Photo Providers** (Optional - fallback chain handles missing keys):
- `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` - [Get key](https://unsplash.com/developers) (50 req/hour free)
- `NEXT_PUBLIC_PEXELS_API_KEY` - [Get key](https://www.pexels.com/api/) (200 req/hour free)

### 3. Start Local Supabase

```bash
supabase start
```

This outputs your local credentials. Copy these to `.env.local`:
- `API URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3100](http://localhost:3100) - app should load without errors.

### 5. Verify Setup

- **Google Maps**: Visit [/test-maps](http://localhost:3100/test-maps) - map should render
- **Supabase Studio**: Visit [http://127.0.0.1:54423](http://127.0.0.1:54423)
- **Browser Console**: No API key errors or CORS issues

## Project Structure

```
tripflow-next/
├── src/
│   ├── app/                    # Next.js 16 App Router pages
│   ├── components/
│   │   └── ui/                 # shadcn/ui components
│   ├── lib/
│   │   ├── photo-providers/    # Photo API integrations
│   │   └── env.ts              # Environment validation (Valibot)
│   └── types/                  # TypeScript type definitions
├── supabase/
│   ├── migrations/             # Database schema versions
│   └── config.toml            # Supabase configuration
└── docs/                       # Architecture, specs, plans
```

## Tech Stack

- **Frontend**: Next.js 16.1.6, React 19.2.3, Tailwind CSS v4
- **State**: React Query v5, Zustand
- **Backend**: Supabase (PostgreSQL 17, Auth, Realtime)
- **Maps**: Google Maps API (`@vis.gl/react-google-maps`)
- **Photos**: Unsplash, Pexels, Google Places (4-tier fallback chain)
- **UI**: shadcn/ui, Radix UI primitives
- **Validation**: Valibot (migrating from Zod)
- **Testing**: Vitest (unit), Playwright (E2E), Percy (visual regression)

## Development Commands

```bash
pnpm dev              # Start dev server (port 3100)
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # TypeScript type checking

# Testing
pnpm test             # Unit tests (Vitest)
pnpm test:watch       # Unit tests in watch mode
pnpm test:e2e         # E2E tests (Playwright)
pnpm percy            # Visual regression tests

# Database
supabase start        # Start local Supabase
supabase stop         # Stop local Supabase
supabase status       # Check service status
supabase db reset     # Reset database (apply migrations)
```

## Troubleshooting

### "int is not defined" Turbopack error
- **Cause**: Zod 4.3.6 incompatibility with Turbopack
- **Status**: Migrating to Valibot (tracked in `docs/architecture.md`)
- **Workaround**: New code uses Valibot; existing Zod schemas being migrated

### Google Maps not loading
1. Check `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local`
2. Enable **Places API (New)** in [Google Cloud Console](https://console.cloud.google.com/apis/library/places-backend.googleapis.com)
   - ⚠️ Common mistake: Enabling the legacy "Places API" instead of "Places API (New)"
   - Correct API: `places.googleapis.com/v1` (NEW)
   - Legacy API: `maps.googleapis.com/maps/api/place` (NOT used)
3. Verify API key restrictions allow `localhost:3100`
4. Check browser console for specific error messages

### Supabase connection failed
```bash
# Check service status
supabase status

# If containers unhealthy, restart
supabase stop
supabase start

# Verify Docker Desktop is running
docker ps
```

### Photo search returns placeholders
- **Expected behavior**: Fallback chain tries Unsplash → Pexels → Placeholder
- **Rate limits**: Unsplash (50/hour), Pexels (200/hour)
- **Solution**: Add API keys to `.env.local` or wait for rate limit reset

### Port 3100 already in use
```bash
# Find and kill process
lsof -ti:3100 | xargs kill -9

# Or change port in package.json
"dev": "next dev --port 3200"
```

## Coding Standards

**All code MUST follow the comprehensive style guide:**

📖 **Read**: [`docs/TRIPFLOW-STYLE-GUIDE.md`](./docs/TRIPFLOW-STYLE-GUIDE.md)

### Quick Reference

**Before writing ANY code:**
1. Read relevant style guide sections
2. Use Component Checklist (Section 37) for new components
3. Reference Quick Reference (Section 36) for design tokens

**Component Checklist:**
- [ ] TypeScript with strict types
- [ ] Follows shadcn/ui composable pattern
- [ ] Uses design tokens (no hardcoded colors)
- [ ] Responsive (mobile-first)
- [ ] Dark mode support
- [ ] Accessible (keyboard, ARIA, screen reader)
- [ ] Tested (unit + E2E if critical)
- [ ] Documented with usage examples

**Design Tokens** (from `src/app/globals.css`):
```tsx
// ✅ Use tokens
<div className="bg-bg-surface text-text-primary p-lg rounded-lg">

// ❌ Don't hardcode
<div className="bg-white text-black p-6 rounded-lg">
```

## Contributing

1. Read the [style guide](./docs/TRIPFLOW-STYLE-GUIDE.md)
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Follow TypeScript, React, and accessibility conventions
4. Write tests (unit + E2E for critical flows)
5. Ensure all checks pass: `pnpm lint && pnpm type-check && pnpm test`
6. Create pull request

## Documentation

- **Style Guide**: [`docs/TRIPFLOW-STYLE-GUIDE.md`](./docs/TRIPFLOW-STYLE-GUIDE.md) - 38 sections on design system, code standards, accessibility
- **Architecture**: `docs/architecture/` - Technical decisions, patterns
- **Features**: `docs/specs/` - Feature specifications, requirements
- **Plans**: `docs/plans/` - Implementation plans, design decisions

## License

[License details to be added]

---

**Need help?** Check the [troubleshooting section](#troubleshooting) or review the [style guide](./docs/TRIPFLOW-STYLE-GUIDE.md).
