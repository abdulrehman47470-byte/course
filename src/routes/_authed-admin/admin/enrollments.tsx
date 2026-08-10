import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { EnrollmentStatusSelect } from "@/components/admin/EnrollmentStatusSelect";
import { listEnrollmentsAdmin } from "@/lib/admin/server-fns";

export const Route = createFileRoute("/_authed-admin/admin/enrollments")({
  loader: () => listEnrollmentsAdmin(),
  component: AdminEnrollmentsPage,
});

function AdminEnrollmentsPage() {
  const enrollments = Route.useLoaderData();

  return (
    <AdminShell title="Enrollments">
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-border text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3.5 font-semibold">Student</th>
              <th className="px-5 py-3.5 font-semibold">Course</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 font-semibold">Progress</th>
              <th className="px-5 py-3.5 font-semibold">Enrolled</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((e) => (
              <tr key={e.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3.5 font-medium">
                  {e.student_id ? (
                    <Link
                      to="/admin/students/$studentId"
                      params={{ studentId: e.student_id }}
                      className="text-primary hover:underline"
                    >
                      {e.student?.display_name ?? "—"}
                    </Link>
                  ) : (
                    (e.student?.display_name ?? "—")
                  )}
                </td>
                <td className="px-5 py-3.5">{e.course?.title ?? "—"}</td>
                <td className="px-5 py-3.5">
                  <EnrollmentStatusSelect enrollmentId={e.id} status={e.status} />
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">{e.progress_percent}%</td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  {new Date(e.enrolled_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {enrollments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                  No enrollments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
