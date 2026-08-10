import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CheckCircle2,
  Facebook,
  GraduationCap,
  Instagram,
  Linkedin,
  Loader2,
  Twitter,
  Youtube,
} from "lucide-react";
import { Logo } from "./Header";
import { subscribeNewsletter } from "@/lib/auth/server-fns";

const columns = [
  {
    title: "Courses",
    links: [
      { label: "All Courses", to: "/courses" as const },
      { label: "Categories", to: "/courses" as const },
      { label: "Learning Paths", to: "/courses" as const, hash: "ai-data-science" },
      { label: "New Courses", to: "/courses" as const },
    ],
  },
  {
    title: "Certifications",
    links: [
      { label: "CPD Certification", to: "/certifications" as const },
      { label: "IBEI Certification", to: "/certifications" as const },
      { label: "Verification", to: "/certifications" as const },
    ],
  },
  {
    title: "Career Services",
    links: [
      { label: "AI CV Builder", to: "/career-services" as const },
      { label: "Job Opportunities", to: "/career-services" as const },
      { label: "Career Coaching", to: "/career-services" as const },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", to: "/resources" as const },
      { label: "Guides", to: "/resources" as const },
      { label: "Webinars", to: "/resources" as const },
      { label: "FAQ", to: "/resources" as const, hash: "faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" as const },
      { label: "Contact Us", to: "/contact" as const },
      { label: "Careers", to: "/about" as const },
      { label: "Press", to: "/about" as const },
    ],
  },
];

const socials = [Facebook, Twitter, Linkedin, Instagram, Youtube];

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      await subscribeNewsletter({ data: { email } });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex w-full max-w-md items-center gap-2 rounded-md bg-card px-4 py-3 text-[13px] font-semibold text-primary">
        <CheckCircle2 className="size-4 shrink-0" />
        You're on the list — we'll be in touch.
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <form className="flex overflow-hidden rounded-md bg-card" onSubmit={onSubmit} noValidate>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="Enter your email address"
          aria-label="Email address"
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-[13px] text-card-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          disabled={status === "loading"}
          className="flex shrink-0 items-center gap-1.5 bg-primary px-5 text-[13px] font-semibold text-primary-foreground disabled:opacity-70"
        >
          {status === "loading" && <Loader2 className="size-3.5 animate-spin" />}
          Get Started Free
        </button>
      </form>
      {status === "error" && (
        <p className="mt-1.5 text-[11px] font-medium text-destructive">
          Enter a valid email address.
        </p>
      )}
    </div>
  );
}

export function CtaFooter() {
  return (
    <footer className="bg-forest-deep text-forest-foreground">
      <div className="border-b border-forest-foreground/10 bg-forest">
        <div className="mx-auto grid max-w-[1240px] gap-6 px-5 py-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="flex min-w-0 items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-forest-foreground">
              <GraduationCap className="size-6 text-forest" />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-bold">Start Your Journey Today</h2>
              <p className="mt-1 text-[13px] text-forest-foreground/70">
                Empowering learners worldwide with in-demand skills and career opportunities.
              </p>
            </div>
          </div>
          <NewsletterForm />
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-5 py-12">
        <div className="grid gap-9 lg:grid-cols-[1.4fr_repeat(5,minmax(0,1fr))]">
          <div>
            <Link to="/" aria-label="CareerBooster home">
              <Logo tone="light" />
            </Link>
            <p className="mt-4 max-w-[240px] text-[12px] leading-relaxed text-forest-foreground/60">
              Industry-focused education, recognized certifications, and career opportunities — all
              in one platform.
            </p>
            <div className="mt-5 flex gap-3.5">
              {socials.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="text-forest-foreground/70 transition-colors hover:text-emerald-bright"
                >
                  <Icon className="size-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[13px] font-bold">{col.title}</h3>
              <ul className="mt-3.5 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      {...("hash" in l ? { hash: l.hash } : {})}
                      className="text-[12px] text-forest-foreground/60 transition-colors hover:text-emerald-bright"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-3 border-t border-forest-foreground/10 pt-6 text-[12px] text-forest-foreground/50 sm:grid-cols-[minmax(0,1fr)_auto]">
          <p>© 2026 CareerBooster. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="hover:text-emerald-bright">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-emerald-bright">
              Terms of Service
            </a>
            <a href="#" className="hover:text-emerald-bright">
              Refund Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
