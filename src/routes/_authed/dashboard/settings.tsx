import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { resetPasswordSchema, type ResetPasswordValues } from "@/lib/auth/schemas";

export const Route = createFileRoute("/_authed/dashboard/settings")({
  component: SettingsPage,
});

const inputClass =
  "mt-2 w-full rounded-md border border-border bg-background px-4 py-3 text-[13px] outline-none placeholder:text-muted-foreground focus:border-primary";
const labelClass = "text-[12px] font-semibold text-foreground/80";

function SettingsPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({ resolver: zodResolver(resetPasswordSchema) });

  async function onSubmit(values: ResetPasswordValues) {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password: values.password });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated");
    reset();
  }

  return (
    <DashboardShell title="Settings">
      <div className="max-w-xl space-y-6">
        <div className="rounded-xl border border-border bg-card p-7 shadow-card">
          <h2 className="text-[15px] font-bold">Change password</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <div>
              <label className={labelClass}>New password</label>
              <input type="password" className={inputClass} {...register("password")} />
              {errors.password && (
                <p className="mt-1 text-[11px] text-destructive">{errors.password.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Confirm new password</label>
              <input type="password" className={inputClass} {...register("confirmPassword")} />
              {errors.confirmPassword && (
                <p className="mt-1 text-[11px] text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <button
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Update password
            </button>
          </form>
        </div>

        <div className="rounded-xl border border-border bg-card p-7 shadow-card">
          <h2 className="text-[15px] font-bold">Notifications</h2>
          <p className="mt-1.5 text-[12px] text-muted-foreground">
            Email preferences for course updates and announcements are coming in a later phase.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
