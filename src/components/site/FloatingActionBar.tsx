import { ClipboardCheck, MessageCircle } from "lucide-react";
import { Link, useRouter } from "@tanstack/react-router";

export function FloatingActionBar() {
  const router = useRouter();

  // Runs on every click, even repeat ones where the URL hash doesn't
  // change (so the router itself wouldn't re-trigger a scroll). Navigates
  // first (for visitors not already on /eligibility), then always scrolls
  // the form into view directly.
  function goToForm(e: React.MouseEvent) {
    e.preventDefault();
    void router.navigate({ to: "/eligibility", hash: "registration-form" });
    document.getElementById("registration-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:bottom-6">
      <div className="flex items-center gap-2.5 rounded-full border border-forest-foreground/10 bg-forest-deep/95 p-2 shadow-float backdrop-blur">
        <Link
          to="/eligibility"
          hash="registration-form"
          onClick={goToForm}
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-[14.5px] font-bold text-primary-foreground transition-opacity hover:opacity-90 sm:px-6"
        >
          <ClipboardCheck className="size-[18px] shrink-0" />
          <span>Enrollment Form</span>
        </Link>
        {/* WhatsApp opens only after the enrollment form below is submitted
            (see RegistrationForm in src/routes/eligibility.tsx) — this button
            takes the user there first, same as the Enrollment Form button,
            every single click. */}
        <Link
          to="/eligibility"
          hash="registration-form"
          onClick={goToForm}
          className="flex items-center gap-2 rounded-full bg-emerald-bright px-5 py-3.5 text-[14.5px] font-bold text-forest-deep transition-opacity hover:opacity-90 sm:px-6"
        >
          <MessageCircle className="size-[18px] shrink-0" />
          <span>WhatsApp</span>
        </Link>
      </div>
    </div>
  );
}
