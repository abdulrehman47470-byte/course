import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { LockedState } from "@/components/dashboard/EmptyState";

export const Route = createFileRoute("/_authed-admin/admin/resume-templates")({
  component: () => (
    <AdminShell title="Resume Templates">
      <LockedState
        title="Coming in a later phase"
        text="Managing the resume templates the AI Career Toolkit generates against lands with the Career Toolkit phase."
      />
    </AdminShell>
  ),
});
