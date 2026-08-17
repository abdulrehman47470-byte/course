import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  createScholarship,
  deleteScholarship,
  listScholarships,
} from "@/lib/scholarships/server-fns";
import { createScholarshipSchema, type CreateScholarshipValues } from "@/lib/scholarships/schemas";

export const Route = createFileRoute("/_authed-admin/admin/scholarships")({
  loader: () => listScholarships(),
  component: AdminScholarshipsPage,
});

const inputClass =
  "mt-1.5 w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-[13px] outline-none placeholder:text-muted-foreground focus:border-primary";
const labelClass = "text-[12px] font-semibold text-foreground/80";

function NewScholarshipForm({ onDone }: { onDone: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateScholarshipValues>({ resolver: zodResolver(createScholarshipSchema) });

  async function onSubmit(values: CreateScholarshipValues) {
    try {
      await createScholarship({ data: values });
      toast.success("Scholarship added");
      onDone();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not add the scholarship.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-5 space-y-4 rounded-xl border border-border bg-card p-6 shadow-card"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Scholarship name</label>
          <input className={inputClass} {...register("name")} />
          {errors.name && (
            <p className="mt-1 text-[11px] text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Organization</label>
          <input className={inputClass} {...register("organization")} />
          {errors.organization && (
            <p className="mt-1 text-[11px] text-destructive">{errors.organization.message}</p>
          )}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Country</label>
          <input className={inputClass} {...register("country")} />
        </div>
        <div>
          <label className={labelClass}>Degree / program</label>
          <input className={inputClass} {...register("degreeLevel")} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Eligibility criteria</label>
        <textarea rows={2} className={`${inputClass} resize-none`} {...register("eligibility")} />
      </div>
      <div>
        <label className={labelClass}>Funding details</label>
        <textarea
          rows={2}
          className={`${inputClass} resize-none`}
          {...register("fundingDetails")}
        />
      </div>
      <div>
        <label className={labelClass}>Application requirements</label>
        <textarea
          rows={2}
          className={`${inputClass} resize-none`}
          {...register("applicationRequirements")}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Application URL</label>
          <input className={inputClass} placeholder="https://..." {...register("applicationUrl")} />
          {errors.applicationUrl && (
            <p className="mt-1 text-[11px] text-destructive">{errors.applicationUrl.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Opens</label>
          <input type="date" className={inputClass} {...register("opensAt")} />
        </div>
        <div>
          <label className={labelClass}>Closes</label>
          <input type="date" className={inputClass} {...register("closesAt")} />
        </div>
      </div>
      <button
        disabled={isSubmitting}
        className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        Add scholarship
      </button>
    </form>
  );
}

function AdminScholarshipsPage() {
  const scholarships = Route.useLoaderData();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function onDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteScholarship({ data: { id } });
      router.invalidate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete the scholarship.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AdminShell title="Scholarships">
      <div className="mb-5 flex justify-end">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {showForm ? <X className="size-4" /> : <Plus className="size-4" />}
          {showForm ? "Cancel" : "New scholarship"}
        </button>
      </div>

      {showForm && (
        <NewScholarshipForm
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
              <th className="px-5 py-3.5 font-semibold">Name</th>
              <th className="px-5 py-3.5 font-semibold">Organization</th>
              <th className="px-5 py-3.5 font-semibold">Closes</th>
              <th className="px-5 py-3.5 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {scholarships.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3.5 font-medium">{s.name}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{s.organization}</td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  {s.closes_at ? new Date(s.closes_at).toLocaleDateString() : "—"}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => onDelete(s.id)}
                    disabled={deletingId === s.id}
                    aria-label="Delete scholarship"
                    className="text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
                  >
                    {deletingId === s.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
            {scholarships.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">
                  No scholarships yet — add the first one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
