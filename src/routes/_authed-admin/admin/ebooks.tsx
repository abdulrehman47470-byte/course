import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { LockedState } from "@/components/dashboard/EmptyState";

export const Route = createFileRoute("/_authed-admin/admin/ebooks")({
  component: () => (
    <AdminShell title="eBooks">
      <LockedState
        title="Coming in a later phase"
        text="Uploading and managing the Career Guide eBook(s) students can download lands with the Career Toolkit phase."
      />
    </AdminShell>
  ),
});
