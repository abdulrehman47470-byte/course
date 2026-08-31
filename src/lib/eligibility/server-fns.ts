import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";

const ELIGIBILITY_SEEN_COOKIE = "mma_seen_eligibility";

/**
 * Dormant by default: ELIGIBILITY_GATE_ENABLED is unset in every
 * environment right now, so this always returns shouldRedirect: false and
 * __root.tsx's beforeLoad is a no-op for this feature — zero behavior
 * change to the live site. Set the env var to "true" (Vercel + redeploy)
 * to turn on "redirect first-time visitors to /eligibility this session."
 */
export const checkEligibilityGate = createServerFn({ method: "GET" }).handler(
  (): { shouldRedirect: boolean } => {
    if (process.env["ELIGIBILITY_GATE_ENABLED"] !== "true") return { shouldRedirect: false };
    return { shouldRedirect: getCookie(ELIGIBILITY_SEEN_COOKIE) !== "1" };
  },
);

// Session cookie (no maxAge) — closing the browser resets it, so the gate
// (once enabled) redirects again on the next visit, not just once ever.
export const markEligibilitySeen = createServerFn({ method: "GET" }).handler(() => {
  setCookie(ELIGIBILITY_SEEN_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return null;
});
