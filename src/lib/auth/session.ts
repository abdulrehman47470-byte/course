import { useEffect, useState } from "react";
import { useRouteContext, useRouter } from "@tanstack/react-router";
import type { SessionUser } from "./server-fns";

/**
 * Reads the session seeded by the root route's beforeLoad (so first paint —
 * including SSR — never flashes the wrong signed-in/out state), then keeps
 * itself live for auth events that happen without a navigation (e.g. sign
 * out from a dropdown on a marketing page). On SIGNED_OUT we can clear
 * state immediately; on SIGNED_IN we don't have the profile row client-side,
 * so we invalidate the router to let beforeLoad refetch it.
 */
export function useSession(): SessionUser | null {
  const context = useRouteContext({ strict: false }) as { sessionUser?: SessionUser | null };
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(context.sessionUser ?? null);
  const router = useRouter();

  useEffect(() => {
    setSessionUser(context.sessionUser ?? null);
  }, [context.sessionUser]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    // Dynamically imported so the (large) Supabase JS SDK isn't part of the
    // Header's initial bundle — every page renders Header, so keeping this
    // import lazy keeps first paint/hydration from waiting on it. The nav's
    // signed-in/out state itself already comes from the SSR-seeded context
    // above; this subscription only keeps it live for in-page auth events.
    import("@/lib/supabase/browser").then(({ getSupabaseBrowserClient }) => {
      if (cancelled) return;
      const supabase = getSupabaseBrowserClient();
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_OUT") {
          setSessionUser(null);
        } else if (event === "SIGNED_IN") {
          router.invalidate();
        }
      });
      unsubscribe = () => subscription.unsubscribe();
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [router]);

  return sessionUser;
}
