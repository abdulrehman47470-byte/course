import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Briefcase, FileText, Globe, Handshake, Linkedin, Target } from "lucide-react";
import { Header } from "@/components/site/Header";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaFooter } from "@/components/site/CtaFooter";

const title = "Career Services — CareerBooster";
const description =
  "AI CV building, a verified job portal, LinkedIn branding, and dedicated placement support — career services built into every course.";

export const Route = createFileRoute("/career-services")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
  }),
  component: CareerServicesPage,
});

const services = [
  {
    icon: FileText,
    title: "AI CV Builder",
    text: "Upload your existing CV and generate an ATS-optimized version tailored to the roles you're targeting.",
    img: "https://images.unsplash.com/photo-1698047681432-006d2449c631?w=480&h=280&fit=crop&auto=format&q=70",
  },
  {
    icon: Briefcase,
    title: "Career & Job Portal",
    text: "Browse verified openings from our hiring partners, filtered to match your completed courses and skills.",
    img: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=480&h=280&fit=crop&auto=format&q=70",
  },
  {
    icon: Target,
    title: "1-on-1 Career Coaching",
    text: "Work with a mentor on interview prep, salary negotiation, and choosing the right role for your goals.",
    img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=480&h=280&fit=crop&auto=format&q=70",
  },
  {
    icon: Linkedin,
    title: "LinkedIn Branding",
    text: "Rebuild your profile to attract recruiters, with positioning that reflects your new, certified skillset.",
    img: "https://images.unsplash.com/photo-1704382002666-5dc4fbb522c0?w=480&h=280&fit=crop&auto=format&q=70",
  },
  {
    icon: Handshake,
    title: "Internship & Placement",
    text: "Hands-on placement support that connects course completion to real interviews with hiring partners.",
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=480&h=280&fit=crop&auto=format&q=70",
  },
  {
    icon: Globe,
    title: "Remote & Global Roles",
    text: "Guidance on tracking and applying to remote and international roles, not just local openings.",
    img: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=480&h=280&fit=crop&auto=format&q=70",
  },
];

const outcomes = [
  "Land interviews faster with a portfolio, not just a transcript",
  "Apply with confidence using a CV built for applicant tracking systems",
  "Access roles from hiring partners before they go fully public",
  "Get coached through offers, not just left to negotiate alone",
];

function CareerServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageHeader
          eyebrow="Career Services"
          title={
            <>
              From Certificate to <span className="text-emerald-bright">Career Offer</span>
            </>
          }
          subtitle="Skills alone don't get you hired — positioning does. Our career services turn every completed course into a real shot at the job you want."
          image="https://images.unsplash.com/photo-1606836591695-4d58a73eba1e?w=1600&h=500&fit=crop&auto=format&q=70"
        />

        <section className="bg-surface py-16">
          <div className="mx-auto max-w-[1240px] px-5">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <article
                  key={s.title}
                  className="overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-float"
                >
                  <img src={s.img} alt={s.title} loading="lazy" className="h-[140px] w-full object-cover" />
                  <div className="p-6">
                    <h3 className="text-[15px] font-bold leading-snug">{s.title}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{s.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background py-16">
          <div className="mx-auto max-w-[1240px] px-5">
            <div className="grid gap-9 rounded-xl bg-forest-deep p-9 text-forest-foreground lg:grid-cols-[1fr_auto_1fr] lg:items-center">
              <div>
                <h2 className="text-2xl font-bold leading-snug">
                  What You Get With
                  <br />
                  Career Services
                </h2>
                <Link
                  to="/contact"
                  className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Talk to a Career Coach <ArrowRight className="size-4" />
                </Link>
              </div>
              <div className="hidden h-24 w-px bg-forest-foreground/20 lg:block" />
              <ul className="space-y-3">
                {outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-3 text-[13px]">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-bright" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <CtaFooter />
    </div>
  );
}
