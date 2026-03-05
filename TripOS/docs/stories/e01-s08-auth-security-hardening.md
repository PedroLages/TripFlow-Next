---
story_id: E01-S08
story_name: Auth Security Hardening
status: done
started: 2026-02-14
completed: 2026-02-14
---

# E01-S08: Auth Security Hardening

## Overview
Protect authentication endpoints with rate limiting, audit logging, security headers, and an atomic trip ownership transfer Edge Function. Final story in Epic 1 — purely backend security infrastructure, no UI changes.

## Implementation Notes
- Single `auth_events` table serves both audit logging and rate limiting
- SECURITY DEFINER RPC functions bypass RLS for pre-auth operations
- Rate limiting: fail-open (DB errors allow the request through)
- Pre-auth: IP-based limiting; Post-auth: user_id-based limiting
- Magic link/password reset: return success even when rate-limited (email enumeration prevention)
- Atomic ownership transfer via PL/pgSQL function (3 UPDATEs in 1 transaction)
- CSP deferred to Epic 13 (Next.js requires unsafe-inline/unsafe-eval)

## Challenges & Struggles
- Rate limit event type mismatches: signup and account_deletion rate limits used event types that were never logged, making them inert. Caught by code review.
- Missing GRANT EXECUTE on SECURITY DEFINER functions: without explicit grants, RPCs silently fail under Supabase's permission model. Combined with fail-open, this degraded to zero rate limiting.

## Lessons Learned
- Always verify that rate limit event types match what the audit logger writes. A mismatch makes rate limiting silently inert.
- SECURITY DEFINER functions in Supabase need explicit GRANT EXECUTE to the appropriate roles (anon, authenticated).
- Fail-open is the right default for rate limiting, but it also masks configuration errors. Integration tests against a real Supabase instance would catch this.

## Manual Steps

- **Apply Supabase migration** [cli]
  `supabase db reset`
  Resets local DB and applies all migrations including auth_events table and RPC functions.

- **Serve Edge Functions** [cli]
  `supabase functions serve`
  Serves all Edge Functions locally (including transfer-ownership).

## Testing Notes
- 16 new unit tests (rate-limit: 7, audit-log: 4, request-metadata: 5)
- 5 security verification tests (headers, RLS, service_role usage, migration, edge function)
- 2 E2E specs (rate-limiting, security headers) — require running Supabase instance

## Code Review Feedback
Review: `docs/reviews/code/code-review-2026-02-14-E01-S08.md`

2 critical issues found and fixed:
1. Rate limit event type mismatches for signup and account_deletion — aligned event types and added pre-call logging for signup attempts.
2. Missing GRANT EXECUTE on SECURITY DEFINER functions — added grants for anon/authenticated roles.

5 improvements noted (non-blocking): exception-based type detection in SQL, unbounded table growth, login failure-only counting, UUID validation in Edge Function, post-deletion audit log ordering.
