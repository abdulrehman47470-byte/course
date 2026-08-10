import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { getMyEnrollments } from "@/lib/dashboard/server-fns";

export const Route = createFileRoute("/_authed/dashboard/")({
  loader: () => getMyEnrollments(),
  component: DashboardOverviewPage,
});

function DashboardOverviewPage() {
  const { sessionUser } = Route.useRouteContext();
  const enrollments = Route.useLoaderData();

  return (
    <DashboardShell title="Overview">
      <p className="text-[13px] text-muted-foreground">
        Welcome back, {sessionUser?.profile.display_name?.split(" ")[0]}.
      </p>
      {enrollments.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={BookOpen}
            title="You haven't enrolled in a course yet"
            text="Browse the catalog and find a course that matches your goals — your progress and certificates will show up here."
            action={{ label: "Browse courses", to: "/courses" }}
          />
        </div>
      ) : (
        <p className="mt-6 text-[13px] text-muted-foreground">
          You're enrolled in {enrollments.length} course{enrollments.length === 1 ? "" : "s"}.
        </p>
      )}
    </DashboardShell>
  );
}
