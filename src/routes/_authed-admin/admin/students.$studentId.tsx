import { useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { EnrollmentStatusSelect } from "@/components/admin/EnrollmentStatusSelect";
import { enrollStudent, getStudentDetail, listAllCourses } from "@/lib/admin/server-fns";

export const Route = createFileRoute("/_authed-admin/admin/students/$studentId")({
  loader: async ({ params }) => {
    const [detail, courses] = await Promise.all([
      getStudentDetail({ data: { studentId: params.studentId } }),
      listAllCourses(),
    ]);
    return { detail, courses };
  },
  component: StudentDetailPage,
});

function EnrollForm({
  studentId,
  courseOptions,
  onDone,
}: {
  studentId: string;
  courseOptions: { id: string; title: string }[];
  onDone: () => void;
}) {
  const [courseId, setCourseId] = useState(courseOptions[0]?.id ?? "");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!courseId) return;
    setPending(true);
    try {
      await enrollStudent({ data: { studentId, courseId } });
      toast.success("Enrolled");
      onDone();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not enroll student.");
    } finally {
      setPending(false);
    }
  }

  if (courseOptions.length === 0) {
    return (
      <p className="mb-5 text-[12px] text-muted-foreground">
        No courses exist yet —{" "}
        <Link to="/admin/courses" className="font-semibold text-primary">
          create one first
        </Link>
        .
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-5 shadow-card"
    >
      <select
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        className="rounded-md border border-border bg-background px-3.5 py-2.5 text-[13px] outline-none focus:border-primary"
      >
        {courseOptions.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </select>
      <button
        disabled={pending}
        className="flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
        Grant access
      </button>
    </form>
  );
}

function StudentDetailPage() {
  const { detail, courses } = Route.useLoaderData();
  const router = useRouter();
  const [showEnrollForm, setShowEnrollForm] = useState(false);

  if (!detail) {
    return (
      <AdminShell title="Student not found">
        <p className="text-[13px] text-muted-foreground">
          This student doesn't exist.{" "}
          <Link to="/admin/users" className="font-semibold text-primary">
            Back to users
          </Link>
        </p>
      </AdminShell>
    );
  }

  const { profile, enrollments } = detail;
  const enrolledCourseIds = new Set(enrollments.map((e) => e.course_id));
  const courseOptions = courses
    .filter((c) => !enrolledCourseIds.has(c.id))
    .map((c) => ({ id: c.id, title: c.title }));

  return (
    <AdminShell title={profile.display_name}>
      <div className="mb-6 rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[16px] font-bold">{profile.display_name}</p>
            <p className="text-[12px] text-muted-foreground">
              {profile.email ?? "No email on file"}
            </p>
          </div>
          <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase text-primary">
            {profile.role}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-[12px] sm:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Country</p>
            <p className="font-medium">{profile.country ?? "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Phone</p>
            <p className="font-medium">{profile.phone ?? "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Joined</p>
            <p className="font-medium">{new Date(profile.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Enrollments</p>
            <p className="font-medium">{enrollments.length}</p>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-bold">Course Access</h2>
        <button
          onClick={() => setShowEnrollForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[12px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {showEnrollForm ? <X className="size-3.5" /> : <Plus className="size-3.5" />}
          {showEnrollForm ? "Cancel" : "Grant course access"}
        </button>
      </div>

      {showEnrollForm && (
        <EnrollForm
          studentId={profile.id}
          courseOptions={courseOptions}
          onDone={() => {
            setShowEnrollForm(false);
            router.invalidate();
          }}
        />
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-border text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3.5 font-semibold">Course</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 font-semibold">Progress</th>
              <th className="px-5 py-3.5 font-semibold">Enrolled</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((e) => (
              <tr key={e.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3.5 font-medium">{e.course?.title ?? "Untitled course"}</td>
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
                <td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">
                  No course access yet — grant some above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
