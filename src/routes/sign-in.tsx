import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { AuthCard } from "@/components/auth/AuthCard";
import { SignInForm } from "@/components/auth/SignInForm";

const title = "Sign In — CareerBooster";
const description = "Sign in to access your courses, progress, and certificates.";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AuthCard title="Welcome back" subtitle="Sign in to continue your learning journey.">
        <SignInForm />
      </AuthCard>
    </div>
  );
}
