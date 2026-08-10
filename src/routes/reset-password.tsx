import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { AuthCard } from "@/components/auth/AuthCard";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

const title = "Set a New Password — CareerBooster";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AuthCard title="Set a new password" subtitle="Choose a strong password for your account.">
        <ResetPasswordForm />
      </AuthCard>
    </div>
  );
}
