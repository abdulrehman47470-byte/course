import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { signUpSchema, type SignUpValues } from "@/lib/auth/schemas";
import { authErrorClass, authInputClass, authLabelClass, authSubmitClass } from "./AuthCard";

export function SignUpForm() {
  const [sent, setSent] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) });

  async function onSubmit(values: SignUpValues) {
    setFormError(null);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({
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
    setSent(values.email);
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
          . Click it to activate your account.
        </p>
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
