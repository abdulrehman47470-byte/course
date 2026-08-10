import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, BadgeCheck, BookOpen, Briefcase, Target, Users } from "lucide-react";
import { Header } from "@/components/site/Header";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaFooter } from "@/components/site/CtaFooter";
import heroImage from "@/assets/hero-student.jpg";

const title = "About Us — CareerBooster";
const description =
  "We bridge the gap between learning and earning with mentor-led courses, internationally recognized certifications, and real career outcomes.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AboutPage,
});

const stats = [
  { icon: BookOpen, value: "500+", label: "Expert Courses" },
  { icon: Users, value: "50K+", label: "Happy Learners" },
  { icon: BadgeCheck, value: "CPD & IBEI", label: "Recognized Certificates" },
  { icon: Briefcase, value: "1000+", label: "Hiring Partners" },
];

const values = [
  {
    icon: Target,
    title: "Skill-Based Learning",
    text: "We teach the exact frameworks and tools employers ask for, not just theory that stays on a slide.",
  },
  {
    icon: Award,
    title: "Real-World Expertise",
    text: "Mentors are practitioners — published researchers, patent holders, and industry leaders — not just presenters.",
  },
  {
    icon: BadgeCheck,
    title: "Recognized Outcomes",
    text: "Every learning path ends in something verifiable: a certificate, a portfolio, or a placement.",
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageHeader
          eyebrow="About Us"
          title={
            <>
              Bridging the Gap Between{" "}
              <span className="text-emerald-bright">Learning and Earning</span>
            </>
          }
          subtitle="CareerBooster exists to turn industry knowledge into career outcomes — through mentor-led courses, recognized certification, and direct paths to employment."
          image="https://images.unsplash.com/photo-1603201667141-5a2d4c673378?w=1600&h=500&fit=crop&auto=format&q=70"
        />

        <section className="bg-surface py-16">
          <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-[48px] font-bold tracking-tight">
                Our <span className="text-primary">Mission</span>
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
                Too many talented people finish a degree or a bootcamp and still can't translate
                what they know into a job offer. We built CareerBooster to close that gap —
                pairing industry-designed courses with hands-on mentorship, internationally
                recognized certification, and direct career support, all on one platform.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                From your first lesson to your first job offer, every part of the journey is built
                around one goal: making your skills visible, verifiable, and hireable.
              </p>
              <Link
                to="/courses"
                className="mt-7 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-[15px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Explore Courses <ArrowRight className="size-4" />
              </Link>
            </div>
            <img
              src={heroImage}
              alt="Learner studying online with a laptop"
              width={1024}
              height={1024}
              className="h-[340px] w-full rounded-xl object-cover object-top lg:h-[400px]"
            />
          </div>
        </section>

        <section className="bg-background py-16">
          <div className="mx-auto max-w-[1240px] px-5">
            <h2 className="text-center font-display text-[48px] font-bold tracking-tight">
              What We <span className="text-primary">Stand For</span>
            </h2>
            <div className="mx-auto mt-4 h-[3px] w-14 rounded-full bg-primary" />

            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {values.map((v) => (
                <article
                  key={v.title}
                  className="rounded-xl border border-border bg-card p-7 text-center shadow-card"
                >
                  <span className="mx-auto grid size-12 place-items-center rounded-xl bg-accent">
                    <v.icon className="size-6 text-primary" />
                  </span>
                  <h3 className="mt-4 text-[15px] font-bold">{v.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{v.text}</p>
                </article>
              ))}
            </div>

            <div className="mt-9 grid grid-cols-2 gap-7 rounded-xl border border-border bg-card px-9 py-7 shadow-card lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <s.icon className="size-6 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="text-base font-bold">{s.value}</p>
                    <p className="truncate text-[12px] text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <CtaFooter />
    </div>
  );
}
