import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";

const ELIGIBILITY_SEEN_COOKIE = "mma_seen_eligibility";

/**
 * On by default — every first-time visitor each browser session gets
 * redirected to /eligibility before anything else. Set
 * ELIGIBILITY_GATE_ENABLED="false" (Vercel + redeploy) to switch it back
 * off without a code change, if that's ever needed.
 */
export const checkEligibilityGate = createServerFn({ method: "GET" }).handler(
  (): { shouldRedirect: boolean } => {
    if (process.env["ELIGIBILITY_GATE_ENABLED"] === "false") return { shouldRedirect: false };
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
