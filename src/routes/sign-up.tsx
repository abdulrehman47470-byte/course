import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { AuthCard } from "@/components/auth/AuthCard";
import { SignUpForm } from "@/components/auth/SignUpForm";

const title = "Sign Up — CareerBooster";
const description =
  "Create your account to start learning, earn certificates, and grow your career.";

export const Route = createFileRoute("/sign-up")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AuthCard
        title="Create your account"
        subtitle="Start learning in minutes — it's free to join."
      >
        <SignUpForm />
      </AuthCard>
    </div>
  );
}
