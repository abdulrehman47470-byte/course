import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EmptyState } from "@/components/dashboard/EmptyState";

export const Route = createFileRoute("/_authed/dashboard/progress")({
  component: ProgressPage,
});

function ProgressPage() {
  return (
    <DashboardShell title="Progress">
      <EmptyState
        icon={TrendingUp}
        title="Lesson-by-lesson progress is coming soon"
        text="Once course modules and lessons launch, your watch progress, completion percentage, and resume points will appear here automatically."
        action={{ label: "Browse courses", to: "/courses" }}
      />
    </DashboardShell>
  );
}
