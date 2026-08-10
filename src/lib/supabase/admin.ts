import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Service-role Supabase client — intentionally bypasses Row Level Security.
 * Server-only. Use only where RLS must be deliberately bypassed (e.g. a
 * payment webhook writing an enrollment on a student's behalf). Never call
 * this from code that could end up in a client bundle.
 */
export function getSupabaseAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("getSupabaseAdminClient() must never be called from client code.");
  }
  return createClient<Database>(
    process.env["SUPABASE_URL"] ?? import.meta.env["VITE_SUPABASE_URL"],
    process.env["SUPABASE_SERVICE_ROLE_KEY"] as string,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
