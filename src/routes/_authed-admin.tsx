import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { checkAdminGate } from "@/lib/admin/gate-server-fns";

export const Route = createFileRoute("/_authed-admin")({
  beforeLoad: async ({ context }) => {
    if (!context.sessionUser) {
      throw redirect({ to: "/sign-in" });
    }
    if (context.sessionUser.profile.role !== "admin") {
      throw redirect({ to: "/dashboard" });
    }
    const gate = await checkAdminGate();
    if (!gate.ok) {
      throw redirect({ to: "/admin-access" });
    }
  },
  component: () => <Outlet />,
});
