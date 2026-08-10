import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

let client: ReturnType<typeof createBrowserClient<Database>> | undefined;

/**
 * Browser-only Supabase client. Safe for non-privileged auth calls
 * (signInWithPassword, signUp, resetPasswordForEmail, updateUser,
 * onAuthStateChange) — these are already gated by Supabase Auth's own
 * boundary. Anything that must bypass RLS or use secrets belongs in a
 * server function instead (see src/lib/supabase/server.ts / admin.ts).
 */
export function getSupabaseBrowserClient() {
  if (!client) {
    client = createBrowserClient<Database>(
      import.meta.env["VITE_SUPABASE_URL"],
      import.meta.env["VITE_SUPABASE_ANON_KEY"],
    );
  }
  return client;
}
