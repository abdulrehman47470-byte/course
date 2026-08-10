import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Percent, Users } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { listAllCourses, listEnrollmentsAdmin, listUsers } from "@/lib/admin/server-fns";

export const Route = createFileRoute("/_authed-admin/admin/")({
  loader: async () => {
    const [users, courses, enrollments] = await Promise.all([
      listUsers(),
      listAllCourses(),
      listEnrollmentsAdmin(),
    ]);
    return {
      userCount: users.length,
      courseCount: courses.length,
      enrollmentCount: enrollments.length,
    };
  },
  component: AdminOverviewPage,
});

function AdminOverviewPage() {
  const { userCount, courseCount, enrollmentCount } = Route.useLoaderData();
  const stats = [
    { icon: Users, label: "Total Users", value: userCount },
    { icon: BookOpen, label: "Courses", value: courseCount },
    { icon: Percent, label: "Enrollments", value: enrollmentCount },
  ];

  return (
    <AdminShell title="Overview">
      <div className="grid gap-5 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <s.icon className="size-6 text-primary" />
            <p className="mt-3 text-2xl font-bold">{s.value}</p>
            <p className="mt-1 text-[12px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
