import { createFileRoute } from "@tanstack/react-router";
import { BookMarked } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EmptyState } from "@/components/dashboard/EmptyState";

export const Route = createFileRoute("/_authed/dashboard/ebook")({
  component: EbookPage,
});

function EbookPage() {
  return (
    <DashboardShell title="Career Guide eBook">
      <EmptyState
        icon={BookMarked}
        title="Your eBook is on its way"
        text="Every enrolled student gets a permanent copy of our Career Guide eBook — career planning, interview prep, and resume-writing guidance. Delivery is launching in a later phase."
        action={{ label: "Browse courses", to: "/courses" }}
      />
    </DashboardShell>
  );
}
