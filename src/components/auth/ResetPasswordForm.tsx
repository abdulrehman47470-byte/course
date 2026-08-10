import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { resetPasswordSchema, type ResetPasswordValues } from "@/lib/auth/schemas";
import { authErrorClass, authInputClass, authLabelClass, authSubmitClass } from "./AuthCard";

export function ResetPasswordForm() {
  const [ready, setReady] = useState<"checking" | "ready" | "invalid">("checking");
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({ resolver: zodResolver(resetPasswordSchema) });

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    // The recovery link establishes a temporary session client-side via the
    // URL fragment; onAuthStateChange fires PASSWORD_RECOVERY once it lands.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady("ready");
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady("ready");
    });
    const timeout = window.setTimeout(() => {
      setReady((current) => (current === "checking" ? "invalid" : current));
    }, 4000);
    return () => {
      subscription.unsubscribe();
      window.clearTimeout(timeout);
    };
  }, []);

  async function onSubmit(values: ResetPasswordValues) {
    setFormError(null);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password: values.password });
    if (error) {
      setFormError(error.message);
      return;
    }
    setDone(true);
    window.setTimeout(() => navigate({ to: "/sign-in" }), 1800);
  }

  if (ready === "checking") {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (ready === "invalid") {
    return (
      <div className="text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent">
          <AlertTriangle className="size-6 text-destructive" />
        </span>
        <p className="mt-4 text-[14px] font-semibold">This link has expired</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
          Password reset links are only valid for a short time. Request a new one from the sign-in
          page.
        </p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent">
          <CheckCircle2 className="size-6 text-primary" />
        </span>
        <p className="mt-4 text-[14px] font-semibold">Password updated</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
          Redirecting you to sign in...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label className={authLabelClass}>New password</label>
        <input
          type="password"
          placeholder="At least 8 characters"
          className={authInputClass(!!errors.password)}
          {...register("password")}
        />
        {errors.password && <p className={authErrorClass}>{errors.password.message}</p>}
      </div>
      <div>
        <label className={authLabelClass}>Confirm new password</label>
        <input
          type="password"
          placeholder="Repeat your new password"
          className={authInputClass(!!errors.confirmPassword)}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className={authErrorClass}>{errors.confirmPassword.message}</p>
        )}
      </div>
      {formError && <p className={authErrorClass}>{formError}</p>}
      <button disabled={isSubmitting} className={authSubmitClass}>
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        Update password
      </button>
    </form>
  );
}
