import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

// Gates the entire /dashboard/* group on account activation (set once an
// admin approves a payment submission — src/lib/admin/server-fns.ts
// reviewPayment). Admins bypass this since they don't go through payment.
export const Route = createFileRoute("/_authed/dashboard")({
  beforeLoad: ({ context }) => {
    const profile = context.sessionUser?.profile;
    if (profile && profile.role !== "admin" && !profile.activated_at) {
      throw redirect({ to: "/payment" });
    }
  },
  component: () => <Outlet />,
});
