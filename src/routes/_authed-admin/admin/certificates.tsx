import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { LockedState } from "@/components/dashboard/EmptyState";

export const Route = createFileRoute("/_authed-admin/admin/certificates")({
  component: () => (
    <AdminShell title="Certificates">
      <LockedState
        title="Coming in a later phase"
        text="Certificate templates, issued-certificate records, and the public verification page land with the certificates phase."
      />
    </AdminShell>
  ),
});
