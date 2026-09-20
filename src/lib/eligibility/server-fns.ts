import { createServerFn } from "@tanstack/react-start";

/**
 * On by default — every visit to any route other than /eligibility redirects
 * there first; the rest of the site is on hold until that changes. Set
 * ELIGIBILITY_GATE_ENABLED="false" (Vercel + redeploy) to switch it back
 * off without a code change, if that's ever needed.
 */
export const checkEligibilityGate = createServerFn({ method: "GET" }).handler(
  (): { shouldRedirect: boolean } => {
    return { shouldRedirect: process.env["ELIGIBILITY_GATE_ENABLED"] !== "false" };
  },
);
