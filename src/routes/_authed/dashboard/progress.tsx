import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { getMyEnrollments } from "@/lib/dashboard/server-fns";

export const Route = createFileRoute("/_authed/dashboard/progress")({
  loader: () => getMyEnrollments(),
  component: ProgressPage,
});

function ProgressPage() {
  const enrollments = Route.useLoaderData();
  const overall = enrollments.length
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress_percent, 0) / enrollments.length)
    : 0;

  return (
    <DashboardShell title="Progress">
      {enrollments.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No progress yet"
          text="Your course completion and quiz results will appear here once your account is active and course lessons launch."
          action={{ label: "Browse courses", to: "/courses" }}
        />
      ) : (
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <p className="text-[12px] font-semibold text-foreground/80">Overall progress</p>
            <div className="mt-3 h-2 w-full rounded-full bg-secondary">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${overall}%` }} />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              {overall}% across {enrollments.length} course{enrollments.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="space-y-3">
            {enrollments.map((e) => (
              <div key={e.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13px] font-bold">{e.course?.title ?? "Untitled course"}</p>
                  <span className="text-[12px] font-semibold text-muted-foreground">
                    {e.progress_percent}%
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-secondary">
                  <div
                    className="h-1.5 rounded-full bg-primary"
                    style={{ width: `${e.progress_percent}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                  {e.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
