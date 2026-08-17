import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Header } from "@/components/site/Header";
import {
  AuthCard,
  authErrorClass,
  authInputClass,
  authSubmitClass,
} from "@/components/auth/AuthCard";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

const title = "Verify Your Email — CareerBooster";

export const Route = createFileRoute("/verify-email")({
  head: () => ({ meta: [{ title }] }),
  component: VerifyEmailPage,
});

function ResendForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("sending");
    setError(null);
    const supabase = getSupabaseBrowserClient();
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/verify-email` },
    });
    if (resendError) {
      setError(resendError.message);
      setState("idle");
      return;
    }
    setState("sent");
  }

  if (state === "sent") {
    return (
      <p className="mt-4 text-[13px] font-medium text-primary">
        New link sent to {email}. Check your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-4 flex flex-col gap-2 sm:flex-row">
      <input
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={authInputClass(!!error) + " mt-0"}
      />
      <button disabled={state === "sending"} className={authSubmitClass + " sm:w-auto sm:shrink-0"}>
        {state === "sending" && <Loader2 className="size-4 animate-spin" />}
        Resend link
      </button>
      {error && <p className={authErrorClass}>{error}</p>}
    </form>
  );
}

function VerifyEmailPage() {
  const [status, setStatus] = useState<"checking" | "verified" | "failed">("checking");

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") setStatus("verified");
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setStatus("verified");
    });
    const timeout = window.setTimeout(() => {
      setStatus((current) => (current === "checking" ? "failed" : current));
    }, 4000);
    return () => {
      subscription.unsubscribe();
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AuthCard title="Email verification" subtitle="Confirming your account...">
        {status === "checking" && (
          <div className="flex justify-center py-4">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}
        {status === "verified" && (
          <div className="text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent">
              <CheckCircle2 className="size-6 text-primary" />
            </span>
            <p className="mt-4 text-[14px] font-semibold">You're verified!</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
              Your account is active. Complete payment to unlock your dashboard and courses.
            </p>
            <Link
              to="/payment"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Continue to payment <ArrowRight className="size-4" />
            </Link>
          </div>
        )}
        {status === "failed" && (
          <div className="text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent">
              <AlertTriangle className="size-6 text-destructive" />
            </span>
            <p className="mt-4 text-[14px] font-semibold">Verification link invalid or expired</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
              Enter your email to get a new link — you can request as many as you need.
            </p>
            <ResendForm />
            <Link to="/sign-in" className="mt-4 inline-flex text-[13px] font-semibold text-primary">
              Already verified? Go to sign in
            </Link>
          </div>
        )}
      </AuthCard>
    </div>
  );
}
