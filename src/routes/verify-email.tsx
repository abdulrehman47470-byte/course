import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Header } from "@/components/site/Header";
import { AuthCard } from "@/components/auth/AuthCard";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

const title = "Verify Your Email — CareerBooster";

export const Route = createFileRoute("/verify-email")({
  head: () => ({ meta: [{ title }] }),
  component: VerifyEmailPage,
});

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
              Your account is active. Head to your dashboard to get started.
            </p>
            <Link
              to="/dashboard"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Go to dashboard <ArrowRight className="size-4" />
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
              Try signing in — if your email still isn't confirmed, you can resend the link from
              there.
            </p>
            <Link to="/sign-in" className="mt-5 inline-flex text-[13px] font-semibold text-primary">
              Go to sign in
            </Link>
          </div>
        )}
      </AuthCard>
    </div>
  );
}
