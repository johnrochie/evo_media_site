import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client — server-only, never import this from a
 * client component or anything bundled to the browser. Unlike lib/supabase.ts
 * (the anon-key client used by public form submissions), this bypasses row
 * level security entirely, so it's the only way to read back client_projects
 * — a table deliberately given no anonymous-access policy at all, since it
 * holds payment/PII data (see supabase-schema.sql's comment on that table).
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (never NEXT_PUBLIC_*, or it ships to
 * the browser) in addition to the existing NEXT_PUBLIC_SUPABASE_URL.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin: SupabaseClient | null =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;
