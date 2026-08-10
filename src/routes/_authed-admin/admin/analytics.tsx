import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { LockedState } from "@/components/dashboard/EmptyState";

export const Route = createFileRoute("/_authed-admin/admin/analytics")({
  component: () => (
    <AdminShell title="Analytics">
      <LockedState
        title="Coming in a later phase"
        text="Enrollment growth, revenue, completion rates, and course popularity charts land once there's real transactional data to chart."
      />
    </AdminShell>
  ),
});
