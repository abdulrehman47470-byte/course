import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  CheckCircle2,
  FileSearch,
  Globe2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaFooter } from "@/components/site/CtaFooter";

const title = "Certifications — CareerBooster";
const description =
  "Learn how CPD & IBEI recognized certification works, how employers verify it, and why it's built into every course.";

export const Route = createFileRoute("/certifications")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
  }),
  component: CertificationsPage,
});

const certPoints = [
  "International Recognition",
  "Career Advancement",
  "Global Opportunities",
  "Lifetime Verification",
  "Your achievement, always valid",
];

const process = [
  {
    icon: FileSearch,
    title: "Complete the Requirements",
    text: "Finish course modules, assessments, and any required project work.",
  },
  {
    icon: BadgeCheck,
    title: "Get Verified",
    text: "Your work is reviewed against CPD & IBEI professional development standards before issuing.",
  },
  {
    icon: ShieldCheck,
    title: "Receive Your Certificate",
    text: "A CPD & IBEI recognized certificate is issued with a unique, lifetime-verifiable ID.",
  },
  {
    icon: Globe2,
    title: "Share It Anywhere",
    text: "Add it to LinkedIn, your CV, or a job application — employers can verify it instantly online.",
  },
];

const certContents = [
  "Your full name and the course or track completed",
  "Official completion date and total CPD hours earned",
  "A unique, lifetime-verifiable certificate ID",
  "CPD & IBEI recognition marks and issuing signatures",
];

const certFaqs = [
  {
    q: "Are the certificates internationally recognized?",
    a: "Yes. Our courses are structured to meet internationally recognized continuing professional development (CPD) standards, and certification is backed by CPD & IBEI recognition.",
  },
  {
    q: "How does certificate verification work?",
    a: "Every certificate carries a unique ID that can be checked online at any time — by you, an employer, or an institution.",
  },
  {
    q: "Does the certificate expire?",
    a: "No. Once issued, your certificate and its verification record remain valid for life.",
  },
];

function CertificationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageHeader
          eyebrow="Certifications"
          title={
            <>
              Certification Backed by{" "}
              <span className="text-emerald-bright">International Standards</span>
            </>
          }
          subtitle="Every learning path ends in a CPD & IBEI recognized certificate — verifiable, lifetime-valid, and built to be trusted by employers worldwide."
          image="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&h=500&fit=crop&auto=format&q=70"
        />

        <section className="bg-surface py-16">
          <div className="mx-auto max-w-[1240px] px-5">
            <div className="grid gap-9 rounded-xl bg-forest-deep p-9 text-forest-foreground lg:grid-cols-[0.8fr_0.8fr_auto_1.2fr] lg:items-center">
              <div className="text-center">
                <p className="text-3xl font-bold">CPD</p>
                <p className="mt-1.5 text-[11px] text-forest-foreground/60">
                  The CPD Certification Service
                </p>
                <p className="mt-2 text-[10px] font-bold tracking-wider text-emerald-bright">
                  RECOGNIZED
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">IBEI</p>
                <p className="mt-1.5 text-[11px] text-forest-foreground/60">
                  International Board of Education & Innovation
                </p>
                <p className="mt-2 text-[10px] font-bold tracking-wider text-emerald-bright">
                  RECOGNIZED
                </p>
              </div>
              <div className="hidden h-16 w-px bg-forest-foreground/20 lg:block" />
              <ul className="space-y-2.5">
                {certPoints.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-[13px]">
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-bright" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-background py-16">
          <div className="mx-auto max-w-[1240px] px-5">
            <h2 className="text-center font-display text-[48px] font-bold tracking-tight">
              What Your <span className="text-primary">Certificate</span> Looks Like
            </h2>
            <div className="mx-auto mt-4 h-[3px] w-14 rounded-full bg-primary" />

            <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="relative overflow-hidden rounded-2xl border-[3px] border-primary/20 bg-card p-8 shadow-float sm:p-10">
                <div className="absolute inset-4 rounded-xl border border-dashed border-primary/25" />
                <div className="relative text-center">
                  <span className="mx-auto grid size-14 place-items-center rounded-full bg-accent">
                    <Award className="size-7 text-primary" />
                  </span>
                  <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                    Certificate of Completion
                  </p>
                  <p className="mt-5 font-serif text-2xl font-bold italic text-foreground sm:text-3xl">
                    Your Name Here
                  </p>
                  <p className="mx-auto mt-3 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
                    has successfully completed the requirements for
                    <span className="block font-semibold text-foreground">
                      AI & Machine Learning Mastery
                    </span>
                  </p>

                  <div className="mt-7 flex items-center justify-center gap-10">
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">CPD</p>
                      <p className="text-[9px] font-bold tracking-wider text-primary">RECOGNIZED</p>
                    </div>
                    <div className="h-10 w-px bg-border" />
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">IBEI</p>
                      <p className="text-[9px] font-bold tracking-wider text-primary">RECOGNIZED</p>
                    </div>
                  </div>

                  <p className="mt-6 text-[10px] text-muted-foreground">
                    Certificate ID: MMA-000000 &nbsp;·&nbsp; Illustrative sample — not an issued
                    certificate
                  </p>
                </div>
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-[12px] font-semibold text-primary">
                  <Sparkles className="size-3.5" /> On Every Certificate
                </span>
                <h3 className="mt-4 text-2xl font-bold tracking-tight">
                  Built to Be Trusted, Not Just Printed
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                  Every certificate we issue carries the same verifiable details, so an employer
                  never has to take your word for it.
                </p>
                <ul className="mt-5 space-y-3">
                  {certContents.map((c) => (
                    <li key={c} className="flex items-start gap-2.5 text-[13px] text-foreground/80">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface py-16">
          <div className="mx-auto max-w-[1240px] px-5">
            <h2 className="text-center font-display text-[48px] font-bold tracking-tight">
              How <span className="text-primary">Certification</span> Works
            </h2>
            <div className="mx-auto mt-4 h-[3px] w-14 rounded-full bg-primary" />

            <div className="relative mt-12">
              <div className="absolute left-[10%] right-[10%] top-7 hidden border-t border-dashed border-border lg:block" />
              <div className="relative grid gap-9 sm:grid-cols-2 lg:grid-cols-4">
                {process.map((s, i) => (
                  <div key={s.title} className="text-center">
                    <span className="mx-auto grid size-14 place-items-center rounded-full bg-forest">
                      <s.icon className="size-6 text-forest-foreground" />
                    </span>
                    <p className="mt-3.5 text-[12px] font-semibold text-muted-foreground">
                      {i + 1}
                    </p>
                    <h3 className="mt-1 text-[14px] font-bold">{s.title}</h3>
                    <p className="mx-auto mt-2 max-w-[210px] text-[12px] leading-relaxed text-muted-foreground">
                      {s.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background pb-16">
          <div className="mx-auto max-w-[1240px] px-5">
            <h2 className="text-xl font-bold tracking-tight">Certification FAQ</h2>
            <div className="mt-6 space-y-3">
              {certFaqs.map((f) => (
                <div
                  key={f.q}
                  className="rounded-xl border border-border bg-card px-6 py-5 shadow-card"
                >
                  <p className="text-[14px] font-bold">{f.q}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
            <Link
              to="/courses"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-[15px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start a Certified Course <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>
      <CtaFooter />
    </div>
  );
}
