import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { getMyEnrollments } from "@/lib/dashboard/server-fns";

export const Route = createFileRoute("/_authed/dashboard/courses")({
  loader: () => getMyEnrollments(),
  component: MyCoursesPage,
});

function MyCoursesPage() {
  const enrollments = Route.useLoaderData();

  return (
    <DashboardShell title="My Courses">
      {enrollments.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses yet"
          text="Once you enroll in a course, it'll show up here with your progress and next lesson."
          action={{ label: "Browse courses", to: "/courses" }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((e) => (
            <Link
              key={e.id}
              to="/dashboard/courses"
              className="rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-float"
            >
              <p className="text-[14px] font-bold">{e.course?.title ?? "Untitled course"}</p>
              <div className="mt-3 h-1.5 w-full rounded-full bg-secondary">
                <div
                  className="h-1.5 rounded-full bg-primary"
                  style={{ width: `${e.progress_percent}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {e.progress_percent}% complete
              </p>
            </Link>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
