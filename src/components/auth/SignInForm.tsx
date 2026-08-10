import { useState } from "react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { signInSchema, type SignInValues } from "@/lib/auth/schemas";
import { authErrorClass, authInputClass, authLabelClass, authSubmitClass } from "./AuthCard";

export function SignInForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const navigate = useNavigate();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });

  async function onSubmit(values: SignInValues) {
    setFormError(null);
    setResent(false);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      setFormError(
        error.message.toLowerCase().includes("email not confirmed")
          ? "Please verify your email before signing in."
          : "Incorrect email or password.",
      );
      return;
    }
    await router.invalidate();
    navigate({ to: "/dashboard" });
  }

  async function resendVerification() {
    const email = getValues("email");
    if (!email) return;
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.resend({ type: "signup", email });
    setResent(true);
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
      <div>
        <div className="flex items-center justify-between">
          <label className={authLabelClass}>Password</label>
          <Link to="/forgot-password" className="text-[12px] font-semibold text-primary">
            Forgot password?
          </Link>
        </div>
        <input
          type="password"
          placeholder="Your password"
          className={authInputClass(!!errors.password)}
          {...register("password")}
        />
        {errors.password && <p className={authErrorClass}>{errors.password.message}</p>}
      </div>
      {formError && (
        <div className={authErrorClass}>
          {formError}
          {formError.includes("verify") && (
            <button
              type="button"
              onClick={resendVerification}
              className="ml-1.5 font-semibold text-primary"
            >
              {resent ? "Sent!" : "Resend link"}
            </button>
          )}
        </div>
      )}
      <button disabled={isSubmitting} className={authSubmitClass}>
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        Sign in
      </button>
      <p className="text-center text-[12px] text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/sign-up" className="font-semibold text-primary">
          Sign up
        </Link>
      </p>
    </form>
  );
}
