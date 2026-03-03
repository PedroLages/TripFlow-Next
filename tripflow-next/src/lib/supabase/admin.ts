import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

/**
 * Admin client for server-side operations that bypass RLS.
 * Used during mock auth phase where we don't have real auth sessions.
 * The service_role key NEVER leaves the server (no NEXT_PUBLIC_ prefix).
 *
 * When real auth is added, replace usage of this with the cookie-based server client.
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
