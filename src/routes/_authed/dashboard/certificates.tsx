import { createFileRoute } from "@tanstack/react-router";
import { Award } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EmptyState } from "@/components/dashboard/EmptyState";

export const Route = createFileRoute("/_authed/dashboard/certificates")({
  component: CertificatesPage,
});

function CertificatesPage() {
  return (
    <DashboardShell title="Certificates">
      <EmptyState
        icon={Award}
        title="No certificates yet"
        text="Finish all required lessons in a course to automatically earn a verifiable digital certificate — it'll appear here with a downloadable PDF."
        action={{ label: "Browse courses", to: "/courses" }}
      />
    </DashboardShell>
  );
}
