import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { LockedState } from "@/components/dashboard/EmptyState";

export const Route = createFileRoute("/_authed-admin/admin/settings")({
  component: () => (
    <AdminShell title="Settings">
      <LockedState
        title="Coming in a later phase"
        text="Platform-wide configuration (default currency, maintenance mode, and more) lands with the admin platform phase."
      />
    </AdminShell>
  ),
});
