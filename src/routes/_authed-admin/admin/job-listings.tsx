import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { createJobListing, deleteJobListing, listJobListings } from "@/lib/jobs/server-fns";
import { createJobListingSchema, type CreateJobListingValues } from "@/lib/jobs/schemas";

export const Route = createFileRoute("/_authed-admin/admin/job-listings")({
  loader: () => listJobListings(),
  component: AdminJobListingsPage,
});

const inputClass =
  "mt-1.5 w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-[13px] outline-none placeholder:text-muted-foreground focus:border-primary";
const labelClass = "text-[12px] font-semibold text-foreground/80";

function NewJobForm({ onDone }: { onDone: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateJobListingValues>({
    resolver: zodResolver(createJobListingSchema),
    defaultValues: { remoteType: "remote" },
  });

  async function onSubmit(values: CreateJobListingValues) {
    try {
      await createJobListing({ data: values });
      toast.success("Job listing added");
      onDone();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not add the listing.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-5 space-y-4 rounded-xl border border-border bg-card p-6 shadow-card"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Job title</label>
          <input className={inputClass} {...register("title")} />
          {errors.title && (
            <p className="mt-1 text-[11px] text-destructive">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Company</label>
          <input className={inputClass} {...register("company")} />
          {errors.company && (
            <p className="mt-1 text-[11px] text-destructive">{errors.company.message}</p>
          )}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Location</label>
          <input className={inputClass} {...register("location")} />
        </div>
        <div>
          <label className={labelClass}>Remote type</label>
          <select className={inputClass} {...register("remoteType")}>
            <option value="remote">Remote</option>
            <option value="onsite">On-site</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Application deadline</label>
          <input type="date" className={inputClass} {...register("applicationDeadline")} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Skills (comma-separated)</label>
        <input
          className={inputClass}
          placeholder="React, TypeScript, SQL"
          {...register("skills")}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Apply URL</label>
          <input className={inputClass} placeholder="https://..." {...register("applyUrl")} />
          {errors.applyUrl && (
            <p className="mt-1 text-[11px] text-destructive">{errors.applyUrl.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Source</label>
          <input
            className={inputClass}
            placeholder="LinkedIn, company site..."
            {...register("source")}
          />
        </div>
      </div>
      <button
        disabled={isSubmitting}
        className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        Add listing
      </button>
    </form>
  );
}

function AdminJobListingsPage() {
  const jobs = Route.useLoaderData();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function onDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteJobListing({ data: { id } });
      router.invalidate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete the listing.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AdminShell title="Job Listings">
      <div className="mb-5 flex justify-end">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {showForm ? <X className="size-4" /> : <Plus className="size-4" />}
          {showForm ? "Cancel" : "New listing"}
        </button>
      </div>

      {showForm && (
        <NewJobForm
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
              <th className="px-5 py-3.5 font-semibold">Company</th>
              <th className="px-5 py-3.5 font-semibold">Type</th>
              <th className="px-5 py-3.5 font-semibold">Posted</th>
              <th className="px-5 py-3.5 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3.5 font-medium">{j.title}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{j.company}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{j.remote_type}</td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  {new Date(j.posted_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => onDelete(j.id)}
                    disabled={deletingId === j.id}
                    aria-label="Delete listing"
                    className="text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
                  >
                    {deletingId === j.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                  No listings yet — add the first one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
