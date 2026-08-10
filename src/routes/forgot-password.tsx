import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

const title = "Reset Password — CareerBooster";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AuthCard
        title="Forgot your password?"
        subtitle="Enter your email and we'll send you a reset link."
      >
        <ForgotPasswordForm />
      </AuthCard>
    </div>
  );
}
