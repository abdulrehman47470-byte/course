import { useEffect, useState } from "react";
import { useRouteContext, useRouter } from "@tanstack/react-router";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
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
    return () => subscription.unsubscribe();
  }, [router]);

  return sessionUser;
}
