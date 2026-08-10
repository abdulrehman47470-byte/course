import { useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldCheck } from "lucide-react";
import { Header } from "@/components/site/Header";
import {
  AuthCard,
  authErrorClass,
  authInputClass,
  authLabelClass,
  authSubmitClass,
} from "@/components/auth/AuthCard";
import { checkAdminGate, verifyAdminGatePassword } from "@/lib/admin/gate-server-fns";

const title = "Admin Access";

// Deliberately not linked from anywhere in the site UI — reached only by
// navigating here (or to /admin, which redirects here) directly.
export const Route = createFileRoute("/admin-access")({
  head: () => ({ meta: [{ title }] }),
  beforeLoad: async ({ context }) => {
    if (!context.sessionUser) {
      throw redirect({ to: "/sign-in" });
    }
    if (context.sessionUser.profile.role !== "admin") {
      throw redirect({ to: "/dashboard" });
    }
    const gate = await checkAdminGate();
    if (gate.ok) {
      throw redirect({ to: "/admin" });
    }
  },
  component: AdminAccessPage,
});

function AdminAccessPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await verifyAdminGatePassword({ data: { password } });
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Incorrect password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AuthCard title="Admin Access" subtitle="This area requires a separate access password.">
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div>
            <label className={authLabelClass}>Password</label>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin access password"
              className={authInputClass(!!error)}
            />
            {error && <p className={authErrorClass}>{error}</p>}
          </div>
          <button disabled={submitting || !password} className={authSubmitClass}>
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ShieldCheck className="size-4" />
            )}
            Unlock
          </button>
        </form>
      </AuthCard>
    </div>
  );
}
