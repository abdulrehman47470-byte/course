import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  Bot,
  ChevronRight,
  Compass,
  FileText,
  GraduationCap,
  Linkedin,
  Microscope,
  PlayCircle,
  ScrollText,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaFooter } from "@/components/site/CtaFooter";

const title = "Resources — CareerBooster";
const description =
  "Free guides, webinars, and playbooks on research writing, publishing, AI tools, and career development — plus answers to common questions.";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ResourcesPage,
});

const resourceTypes = [
  {
    icon: FileText,
    title: "Blog",
    text: "Career guides, industry breakdowns, and tips from mentors on breaking into competitive fields.",
    img: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=480&h=280&fit=crop&auto=format&q=70",
  },
  {
    icon: BookOpen,
    title: "Guides & Playbooks",
    text: "Field-by-field roadmaps, project ideas, and worksheets to help you plan your next skill investment.",
    img: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=480&h=280&fit=crop&auto=format&q=70",
  },
  {
    icon: PlayCircle,
    title: "Webinars",
    text: "Live and recorded sessions with mentors covering AI, data, certification, and career strategy.",
    img: "https://images.unsplash.com/photo-1616531770192-6eaea74c2456?w=480&h=280&fit=crop&auto=format&q=70",
  },
];

const freeGuides = [
  {
    icon: ScrollText,
    tag: "Free Guide",
    title: "How to Write a Research Paper",
    text: "A step-by-step walkthrough of structuring a paper — from research question to a draft ready for review.",
  },
  {
    icon: Microscope,
    tag: "Free Guide",
    title: "Publishing in Top International Journals",
    text: "How to choose the right Scopus-indexed or high-impact journal, and navigate the peer-review process.",
  },
  {
    icon: Bot,
    tag: "Free Guide",
    title: "AI Tools for Bioscience Professionals",
    text: "A practical roundup of AI and automation tools for genomic analysis, literature review, and lab workflows.",
  },
  {
    icon: Compass,
    tag: "Playbook",
    title: "The Field-by-Field Career Roadmap",
    text: "A blueprint for planning your next 12 months across AI, data, bioscience, and career-services skill tracks.",
  },
  {
    icon: GraduationCap,
    tag: "Playbook",
    title: "Professional Skill Development Playbook",
    text: "How to prioritize which skills to learn next based on where the job market is actually moving.",
  },
  {
    icon: Linkedin,
    tag: "Free Guide",
    title: "LinkedIn & Job Hunting Toolkit",
    text: "Profile optimization, outreach templates, and an application tracker to run a focused job search.",
  },
];

const faqs = [
  {
    q: "Can I start a course without a technical background?",
    a: "Yes. Most learning tracks are built to take you from the fundamentals up, with no prior coding or technical experience required.",
  },
  {
    q: "Is mentorship available if I'm outside the platform's home country?",
    a: "Yes. Mentorship and live sessions run across time zones with remote-first tools, so location isn't a barrier.",
  },
  {
    q: "Can I get a refund?",
    a: "No. All course and plan purchases are final and strictly non-refundable, regardless of completion status.",
  },
  {
    q: "Is my project or research data kept confidential?",
    a: "Yes. For research mentorship or project work involving unpublished or proprietary material, we can put a formal confidentiality agreement in place before deep review begins.",
  },
  {
    q: "How do I book a 1-on-1 mentorship session?",
    a: "Once enrolled, you can book sessions directly through your course dashboard once it launches, or reach out via our Contact page in the meantime.",
  },
  {
    q: "Do guides and playbooks come with the course, or separately?",
    a: "Core guides and worksheets are bundled with your course. Extended playbooks, like the full career roadmap, are available as a separate free resource.",
  },
  {
    q: "Where do I start if I want help publishing a paper?",
    a: "Start with the 'How to Write a Research Paper' guide, then reach out through Research Guidance & Career Placement on the homepage for 1-on-1 mentorship.",
  },
];

function ResourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageHeader
          eyebrow="Resources"
          title={
            <>
              Guides, Webinars & <span className="text-emerald-bright">Answers</span>
            </>
          }
          subtitle="Everything you need to plan your next move — from research and publishing guidance to career playbooks and answers on how the platform works."
          image="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1600&h=500&fit=crop&auto=format&q=70"
        />

        <section className="bg-surface py-16">
          <div className="mx-auto max-w-[1240px] px-5">
            <div className="grid gap-5 sm:grid-cols-3">
              {resourceTypes.map((r) => (
                <article
                  key={r.title}
                  className="overflow-hidden rounded-xl border border-border bg-card shadow-card"
                >
                  <img src={r.img} alt={r.title} loading="lazy" className="h-[140px] w-full object-cover" />
                  <div className="p-7">
                    <h3 className="text-[15px] font-bold">{r.title}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{r.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background py-16">
          <div className="mx-auto max-w-[1240px] px-5">
            <h2 className="text-center font-display text-[48px] font-bold tracking-tight">
              Free Research & <span className="text-primary">Career Resources</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-[14px] leading-relaxed text-muted-foreground">
              Practical, no-cost guides on research writing, publishing, AI tools, and career growth
              — start applying them today.
            </p>
            <div className="mx-auto mt-4 h-[3px] w-14 rounded-full bg-primary" />

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {freeGuides.map((g) => (
                <article
                  key={g.title}
                  className="rounded-xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-float"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-xl bg-accent">
                      <g.icon className="size-5 text-primary" />
                    </span>
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold text-foreground/70">
                      {g.tag}
                    </span>
                  </div>
                  <h3 className="mt-4 text-[14px] font-bold leading-snug">{g.title}</h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
                    {g.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-20 bg-surface pb-16 pt-16">
          <div className="mx-auto max-w-[1240px] px-5">
            <h2 className="text-xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <div className="mt-6 space-y-3">
              {faqs.map((f) => (
                <div
                  key={f.q}
                  className="rounded-xl border border-border bg-card px-6 py-5 shadow-card"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[14px] font-bold">{f.q}</p>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{f.a}</p>
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
