import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { LockedState } from "@/components/dashboard/EmptyState";

export const Route = createFileRoute("/_authed-admin/admin/payments")({
  component: () => (
    <AdminShell title="Payments">
      <LockedState
        title="Coming in a later phase"
        text="Order history, PayFast transaction records, and refund management land with the payments & enrollment phase."
      />
    </AdminShell>
  ),
});
