import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { listPaymentSubmissions, reviewPayment } from "@/lib/admin/server-fns";
import type { PaymentSubmissionAdminRow } from "@/lib/admin/server-fns";

export const Route = createFileRoute("/_authed-admin/admin/payments")({
  loader: () => listPaymentSubmissions(),
  component: AdminPaymentsPage,
});

const statusBadgeClass: Record<string, string> = {
  pending: "bg-secondary text-foreground/70",
  approved: "bg-accent text-primary",
  rejected: "bg-destructive/10 text-destructive",
};

function ReviewRow({ submission }: { submission: PaymentSubmissionAdminRow }) {
  const [notes, setNotes] = useState("");
  const [pending, setPending] = useState<"approved" | "rejected" | null>(null);
  const router = useRouter();

  async function decide(decision: "approved" | "rejected") {
    setPending(decision);
    try {
      await reviewPayment({ data: { submissionId: submission.id, decision, notes } });
      toast.success(decision === "approved" ? "Approved — account activated" : "Rejected");
      router.invalidate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not review this payment.");
    } finally {
      setPending(null);
    }
  }

  return (
    <tr className="border-b border-border last:border-0 align-top">
      <td className="px-5 py-3.5">
        <p className="font-medium">{submission.student?.display_name ?? "Unknown"}</p>
        <p className="text-[11.5px] text-muted-foreground">{submission.student?.email ?? "—"}</p>
      </td>
      <td className="px-5 py-3.5 font-mono text-[12px]">{submission.reference}</td>
      <td className="px-5 py-3.5 text-muted-foreground">
        {new Date(submission.submitted_at).toLocaleString()}
      </td>
      <td className="px-5 py-3.5">
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusBadgeClass[submission.status]}`}
        >
          {submission.status}
        </span>
        {submission.notes && (
          <p className="mt-1.5 max-w-xs text-[11px] text-muted-foreground">{submission.notes}</p>
        )}
      </td>
      <td className="px-5 py-3.5">
        {submission.status === "pending" ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Notes (optional, e.g. rejection reason)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-48 rounded-md border border-border bg-background px-2.5 py-1.5 text-[12px] outline-none focus:border-primary"
            />
            <div className="flex gap-2">
              <button
                onClick={() => decide("approved")}
                disabled={pending !== null}
                className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[12px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {pending === "approved" && <Loader2 className="size-3.5 animate-spin" />}
                Approve
              </button>
              <button
                onClick={() => decide("rejected")}
                disabled={pending !== null}
                className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-[12px] font-semibold text-destructive transition-colors hover:bg-destructive/5 disabled:opacity-60"
              >
                {pending === "rejected" && <Loader2 className="size-3.5 animate-spin" />}
                Reject
              </button>
            </div>
          </div>
        ) : (
          <span className="text-[11.5px] text-muted-foreground">
            {submission.reviewed_at && new Date(submission.reviewed_at).toLocaleDateString()}
          </span>
        )}
      </td>
    </tr>
  );
}

function AdminPaymentsPage() {
  const submissions = Route.useLoaderData();

  return (
    <AdminShell title="Payments">
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-border text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3.5 font-semibold">Student</th>
              <th className="px-5 py-3.5 font-semibold">Reference</th>
              <th className="px-5 py-3.5 font-semibold">Submitted</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 font-semibold">Review</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <ReviewRow key={s.id} submission={s} />
            ))}
            {submissions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                  No payment submissions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
