import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Globe2,
  GraduationCap,
  Sparkles,
  Users,
  Wifi,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaFooter } from "@/components/site/CtaFooter";
import { markEligibilitySeen } from "@/lib/eligibility/server-fns";

const title = "Eligibility — CareerBooster";
const description =
  "See who can join CareerBooster — no formal degree required, open to students, graduates, and working professionals ready to build career-ready skills.";

export const Route = createFileRoute("/eligibility")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
  }),
  // Marks the visitor as having seen this page, so the site-wide gate
  // (dormant by default — see src/routes/__root.tsx) won't redirect them
  // back here again this session once it's turned on.
  loader: () => markEligibilitySeen(),
  component: EligibilityPage,
});

const whoCanJoin = [
  {
    icon: GraduationCap,
    title: "Students & Recent Graduates",
    text: "Build job-ready skills alongside — or right after — your degree, no matter your major.",
  },
  {
    icon: Users,
    title: "Working Professionals",
    text: "Upskill or pivot into a new field without pausing your current job.",
  },
  {
    icon: Sparkles,
    title: "Career Changers",
    text: "No prior experience in the field is required — every track starts from the fundamentals.",
  },
];

const requirements = [
  {
    icon: CheckCircle2,
    title: "No Formal Degree Required",
    text: "Most tracks are open to anyone motivated to learn — your background doesn't have to match the course.",
  },
  {
    icon: Wifi,
    title: "A Reliable Internet Connection",
    text: "Everything is delivered online, so a stable connection and a computer or phone are all you need.",
  },
  {
    icon: Clock,
    title: "A Few Hours a Week",
    text: "Courses are self-paced with structured lessons — consistency matters more than free time.",
  },
  {
    icon: Globe2,
    title: "Anywhere in the World",
    text: "There's no location requirement — join from wherever you are.",
  },
];

function EligibilityPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageHeader
          eyebrow="Eligibility"
          title={
            <>
              Who Can Join <span className="text-emerald-bright">CareerBooster</span>
            </>
          }
          subtitle="No gatekeeping, no strict prerequisites — just a clear picture of who our courses are built for and what you'll need to get started."
          image="/images/1521587760476-6c12a4b040da-1600x500.jpg"
        />

        <section className="bg-background py-16">
          <div className="mx-auto max-w-[1240px] px-5">
            <h2 className="text-center font-display text-[36px] font-bold tracking-tight sm:text-[48px]">
              Built for <span className="text-primary">Every Stage</span> of Your Career
            </h2>
            <div className="mx-auto mt-4 h-[3px] w-14 rounded-full bg-primary" />

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {whoCanJoin.map((w) => (
                <div
                  key={w.title}
                  className="rounded-2xl border border-border bg-card p-7 text-center shadow-card"
                >
                  <span className="mx-auto grid size-14 place-items-center rounded-full bg-accent">
                    <w.icon className="size-6 text-primary" />
                  </span>
                  <h3 className="mt-5 text-[15px] font-bold">{w.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{w.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface py-16">
          <div className="mx-auto max-w-[1240px] px-5">
            <h2 className="text-center font-display text-[36px] font-bold tracking-tight sm:text-[48px]">
              What You'll <span className="text-primary">Need</span>
            </h2>
            <div className="mx-auto mt-4 h-[3px] w-14 rounded-full bg-primary" />

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {requirements.map((r) => (
                <div
                  key={r.title}
                  className="rounded-2xl border border-border bg-card p-7 shadow-card"
                >
                  <span className="grid size-12 place-items-center rounded-full bg-forest">
                    <r.icon className="size-5 text-forest-foreground" />
                  </span>
                  <h3 className="mt-4 text-[14px] font-bold">{r.title}</h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
                    {r.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background pb-16">
          <div className="mx-auto max-w-[1240px] px-5">
            <div className="rounded-2xl bg-forest-deep px-8 py-12 text-center text-forest-foreground sm:px-14 sm:py-16">
              <h2 className="font-display text-[28px] font-bold tracking-tight sm:text-[36px]">
                Meet the Criteria? You're Ready to Start.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-forest-foreground/70">
                Browse the full course catalog and find the track that matches where you want your
                career to go next.
              </p>
              <Link
                to="/courses"
                className="mt-7 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-[15px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Browse Courses <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <CtaFooter />
    </div>
  );
}
