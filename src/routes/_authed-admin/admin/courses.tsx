import { useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { listAllCourses, createCourse } from "@/lib/admin/server-fns";
import { createCourseSchema, type CreateCourseValues } from "@/lib/admin/schemas";

export const Route = createFileRoute("/_authed-admin/admin/courses")({
  loader: () => listAllCourses(),
  component: AdminCoursesPage,
});

const statusBadgeClass: Record<string, string> = {
  draft: "bg-secondary text-foreground/70",
  published: "bg-accent text-primary",
  archived: "bg-destructive/10 text-destructive",
};

const inputClass =
  "mt-1.5 w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-[13px] outline-none placeholder:text-muted-foreground focus:border-primary";
const labelClass = "text-[12px] font-semibold text-foreground/80";

function NewCourseForm({ onDone }: { onDone: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCourseValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: { currency: "USD", priceCents: 0 },
  });

  async function onSubmit(values: CreateCourseValues) {
    try {
      await createCourse({ data: values });
      toast.success("Course created");
      onDone();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create the course.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-5 space-y-4 rounded-xl border border-border bg-card p-6 shadow-card"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Title</label>
          <input className={inputClass} placeholder="Course title" {...register("title")} />
          {errors.title && (
            <p className="mt-1 text-[11px] text-destructive">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Slug</label>
          <input className={inputClass} placeholder="course-title" {...register("slug")} />
          {errors.slug && (
            <p className="mt-1 text-[11px] text-destructive">{errors.slug.message}</p>
          )}
        </div>
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <textarea rows={3} className={`${inputClass} resize-none`} {...register("description")} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Category</label>
          <input className={inputClass} {...register("category")} />
        </div>
        <div>
          <label className={labelClass}>Price (cents)</label>
          <input type="number" className={inputClass} {...register("priceCents")} />
        </div>
        <div>
          <label className={labelClass}>Currency</label>
          <input className={inputClass} {...register("currency")} />
        </div>
      </div>
      <button
        disabled={isSubmitting}
        className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        Create course
      </button>
    </form>
  );
}

function AdminCoursesPage() {
  const courses = Route.useLoaderData();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  return (
    <AdminShell title="Courses">
      <div className="mb-5 flex justify-end">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {showForm ? <X className="size-4" /> : <Plus className="size-4" />}
          {showForm ? "Cancel" : "New course"}
        </button>
      </div>

      {showForm && (
        <NewCourseForm
          onDone={() => {
            setShowForm(false);
            router.invalidate();
          }}
        />
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-border text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3.5 font-semibold">Title</th>
              <th className="px-5 py-3.5 font-semibold">Category</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 font-semibold">Price</th>
              <th className="px-5 py-3.5 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3.5 font-medium">{c.title}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{c.category ?? "—"}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusBadgeClass[c.status]}`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  {(c.price_cents / 100).toFixed(2)} {c.currency}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link
                    to="/admin/courses/$courseId"
                    params={{ courseId: c.id }}
                    className="text-[12.5px] font-semibold text-primary"
                  >
                    Manage content
                  </Link>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                  No courses yet — create the first one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
