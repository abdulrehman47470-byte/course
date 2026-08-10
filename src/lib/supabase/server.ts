import { createServerClient } from "@supabase/ssr";
import { getCookies, setCookie } from "@tanstack/react-start/server";
import type { Database } from "./types";

/**
 * Request-scoped Supabase client for use INSIDE server functions only
 * (createServerFn handlers, server routes). Reads the session from the
 * incoming request's cookies and writes any refreshed session back onto the
 * response — runs as the logged-in user, so RLS applies normally. Never
 * import this into code that also renders on the client.
 */
export function getSupabaseServerClient() {
  return createServerClient<Database>(
    import.meta.env["VITE_SUPABASE_URL"],
    import.meta.env["VITE_SUPABASE_ANON_KEY"],
    {
      cookies: {
        getAll() {
          const cookies = getCookies();
          return Object.entries(cookies).map(([name, value]) => ({ name, value }));
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            setCookie(name, value, options);
          }
        },
      },
    },
  );
}
