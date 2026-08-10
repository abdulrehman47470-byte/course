import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateEnrollmentStatus } from "@/lib/admin/server-fns";
import type { EnrollmentStatus } from "@/lib/supabase/types";

const statusBadgeClass: Record<EnrollmentStatus, string> = {
  active: "bg-accent text-primary",
  completed: "bg-primary/10 text-primary",
  refunded: "bg-secondary text-foreground/70",
  revoked: "bg-destructive/10 text-destructive",
};

const statuses: EnrollmentStatus[] = ["active", "completed", "refunded", "revoked"];

export function EnrollmentStatusSelect({
  enrollmentId,
  status,
}: {
  enrollmentId: string;
  status: EnrollmentStatus;
}) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function onChange(next: EnrollmentStatus) {
    if (next === status) return;
    setPending(true);
    try {
      await updateEnrollmentStatus({ data: { enrollmentId, status: next } });
      toast.success(`Marked ${next}`);
      router.invalidate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update status.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        disabled={pending}
        onChange={(e) => onChange(e.target.value as EnrollmentStatus)}
        className={`rounded-full border-0 px-2.5 py-1 text-[10px] font-bold uppercase outline-none disabled:opacity-60 ${statusBadgeClass[status]}`}
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {pending && <Loader2 className="size-3.5 animate-spin text-muted-foreground" />}
    </div>
  );
}
