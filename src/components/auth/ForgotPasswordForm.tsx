import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/auth/schemas";
import { authErrorClass, authInputClass, authLabelClass, authSubmitClass } from "./AuthCard";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(values: ForgotPasswordValues) {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    // Always show the same success state regardless of whether the email
    // exists — don't leak account existence via the response.
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent">
          <CheckCircle2 className="size-6 text-primary" />
        </span>
        <p className="mt-4 text-[14px] font-semibold">Check your email</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
          If an account exists for that address, we've sent a link to reset your password.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label className={authLabelClass}>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className={authInputClass(!!errors.email)}
          {...register("email")}
        />
        {errors.email && <p className={authErrorClass}>{errors.email.message}</p>}
      </div>
      <button disabled={isSubmitting} className={authSubmitClass}>
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        Send reset link
      </button>
      <p className="text-center text-[12px] text-muted-foreground">
        Remembered it?{" "}
        <Link to="/sign-in" className="font-semibold text-primary">
          Sign in
        </Link>
      </p>
    </form>
  );
}
