import { createFileRoute } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EmptyState } from "@/components/dashboard/EmptyState";

export const Route = createFileRoute("/_authed/dashboard/career-toolkit")({
  component: CareerToolkitPage,
});

function CareerToolkitPage() {
  return (
    <DashboardShell title="Career Toolkit">
      <EmptyState
        icon={Briefcase}
        title="Unlocks after your first certificate"
        text="Earn a certificate and the Career Toolkit unlocks — upload your CV for AI analysis, generate an optimized resume, and get personalized career recommendations."
        action={{ label: "Browse courses", to: "/courses" }}
      />
    </DashboardShell>
  );
}
