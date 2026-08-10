import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { updateProfileSchema, type UpdateProfileValues } from "@/lib/auth/schemas";
import { updateProfile } from "@/lib/auth/server-fns";

export const Route = createFileRoute("/_authed/dashboard/profile")({
  component: ProfilePage,
});

const inputClass =
  "mt-2 w-full rounded-md border border-border bg-background px-4 py-3 text-[13px] outline-none placeholder:text-muted-foreground focus:border-primary";
const labelClass = "text-[12px] font-semibold text-foreground/80";

function ProfilePage() {
  const { sessionUser } = Route.useRouteContext();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      displayName: sessionUser?.profile.display_name ?? "",
      headline: sessionUser?.profile.headline ?? "",
      bio: sessionUser?.profile.bio ?? "",
      phone: sessionUser?.profile.phone ?? "",
      country: sessionUser?.profile.country ?? "",
    },
  });

  async function onSubmit(values: UpdateProfileValues) {
    try {
      await updateProfile({ data: values });
      toast.success("Profile updated");
      router.invalidate();
    } catch {
      toast.error("Could not update your profile. Please try again.");
    }
  }

  return (
    <DashboardShell title="Profile">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl space-y-5 rounded-xl border border-border bg-card p-7 shadow-card"
      >
        <div>
          <label className={labelClass}>Email</label>
          <input disabled value={sessionUser?.email ?? ""} className={`${inputClass} opacity-60`} />
        </div>
        <div>
          <label className={labelClass}>Full name</label>
          <input className={inputClass} {...register("displayName")} />
        </div>
        <div>
          <label className={labelClass}>Headline</label>
          <input
            placeholder="e.g. Aspiring Data Scientist"
            className={inputClass}
            {...register("headline")}
          />
        </div>
        <div>
          <label className={labelClass}>Bio</label>
          <textarea rows={4} className={`${inputClass} resize-none`} {...register("bio")} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Phone</label>
            <input className={inputClass} {...register("phone")} />
          </div>
          <div>
            <label className={labelClass}>Country</label>
            <input className={inputClass} {...register("country")} />
          </div>
        </div>
        <button
          disabled={isSubmitting || !isDirty}
          className="flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Save changes
        </button>
      </form>
    </DashboardShell>
  );
}
