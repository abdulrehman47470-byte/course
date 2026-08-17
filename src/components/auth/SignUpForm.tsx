import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { signUpSchema, type SignUpValues } from "@/lib/auth/schemas";
import { authErrorClass, authInputClass, authLabelClass, authSubmitClass } from "./AuthCard";

const RESEND_COOLDOWN_SECONDS = 45;

export function SignUpForm() {
  const [sent, setSent] = useState<string | null>(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent">("idle");
  const [resendError, setResendError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) });

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => window.clearInterval(id);
  }, [cooldown]);

  async function onSubmit(values: SignUpValues) {
    setFormError(null);
    setAlreadyRegistered(null);
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { display_name: values.displayName },
        emailRedirectTo: `${window.location.origin}/verify-email`,
      },
    });
    if (error) {
      setFormError(error.message);
      return;
    }
    // Supabase returns a user with an empty identities array (no error) when
    // the email already belongs to a *confirmed* account — its own
    // anti-enumeration behavior. Catch that here so we point the person at
    // sign-in/reset instead of implying a fresh account or email was created.
    // (An existing *unconfirmed* email hits the normal success path below —
    // Supabase resends the confirmation email to it automatically, so the
    // "check your email" screen is exactly the right response for that case.)
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      setAlreadyRegistered(values.email);
      return;
    }
    setCooldown(RESEND_COOLDOWN_SECONDS);
    setSent(values.email);
  }

  async function resend() {
    if (!sent || cooldown > 0) return;
    setResendState("sending");
    setResendError(null);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.resend({ type: "signup", email: sent });
    if (error) {
      setResendError(error.message);
      setResendState("idle");
      return;
    }
    setResendState("sent");
    setCooldown(RESEND_COOLDOWN_SECONDS);
  }

  if (alreadyRegistered) {
    return (
      <div className="text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent">
          <AlertCircle className="size-6 text-primary" />
        </span>
        <p className="mt-4 text-[14px] font-semibold">You already have an account</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
          An account already exists for{" "}
          <span className="font-medium text-foreground">{alreadyRegistered}</span>. Sign in to pick
          up where you left off, or reset your password if you don't remember it.
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <Link
            to="/sign-in"
            className="rounded-md bg-primary px-5 py-3 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Sign in
          </Link>
          <Link
            to="/forgot-password"
            className="rounded-md border border-border px-5 py-3 text-[13px] font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            Forgot password
          </Link>
        </div>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent">
          <CheckCircle2 className="size-6 text-primary" />
        </span>
        <p className="mt-4 text-[14px] font-semibold">Check your email</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
          We sent a verification link to <span className="font-medium text-foreground">{sent}</span>
          . Click it to activate your account. The link stays valid for 3 days.
        </p>
        <div className="mt-5">
          <button
            type="button"
            onClick={resend}
            disabled={cooldown > 0 || resendState === "sending"}
            className="text-[13px] font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {resendState === "sending"
              ? "Sending..."
              : cooldown > 0
                ? `Resend link (${cooldown}s)`
                : resendState === "sent"
                  ? "Sent! Resend again"
                  : "Didn't get it? Resend link"}
          </button>
          {resendError && <p className={authErrorClass}>{resendError}</p>}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label className={authLabelClass}>Full name</label>
        <input
          type="text"
          placeholder="Your name"
          className={authInputClass(!!errors.displayName)}
          {...register("displayName")}
        />
        {errors.displayName && <p className={authErrorClass}>{errors.displayName.message}</p>}
      </div>
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
      <div>
        <label className={authLabelClass}>Password</label>
        <input
          type="password"
          placeholder="At least 8 characters"
          className={authInputClass(!!errors.password)}
          {...register("password")}
        />
        {errors.password && <p className={authErrorClass}>{errors.password.message}</p>}
      </div>
      <div>
        <label className={authLabelClass}>Confirm password</label>
        <input
          type="password"
          placeholder="Repeat your password"
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
        Create account
      </button>
      <p className="text-center text-[12px] text-muted-foreground">
        Already have an account?{" "}
        <Link to="/sign-in" className="font-semibold text-primary">
          Sign in
        </Link>
      </p>
    </form>
  );
}
