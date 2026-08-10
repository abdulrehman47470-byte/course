import {
  BarChart3,
  Brain,
  Code2,
  FileSearch,
  Globe,
  Handshake,
  Layers,
  SearchCheck,
  ShieldCheck,
  Workflow,
} from "lucide-react";

const aiModules = [
  {
    icon: Brain,
    title: "Applied AI & Machine Learning",
    text: "Move from theory to practice with supervised and unsupervised models, automated pipelines, and real deployment workflows.",
    img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=480&h=280&fit=crop&auto=format&q=70",
  },
  {
    icon: BarChart3,
    title: "Data Analytics & Visualization",
    text: "Master data cleaning and storytelling with Tableau, Power BI, and Looker Studio to turn raw data into decision-ready insights.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=480&h=280&fit=crop&auto=format&q=70",
  },
  {
    icon: Code2,
    title: "Python & R Foundations",
    text: "Build a strong coding foundation for automation and analysis — no prior programming background required.",
    img: "https://loremflickr.com/480/280/programming,code?lock=119",
  },
  {
    icon: Workflow,
    title: "Agentic Workflow Automation",
    text: "Design autonomous agents with tools like n8n to handle repetitive data tasks and free up time for high-value work.",
    img: "https://loremflickr.com/480/280/automation,workflow?lock=120",
  },
  {
    icon: Layers,
    title: "Industry-Specific Specializations",
    text: "Go deeper with track-specific capstones across AI, cybersecurity, marketing analytics, and web engineering.",
    img: "https://loremflickr.com/480/280/biotechnology,laboratory?lock=121",
  },
  {
    icon: FileSearch,
    title: "Portfolio & Case Study Building",
    text: "Turn every module into a case study you can show employers — real projects, not just certificates.",
    img: "https://loremflickr.com/480/280/portfolio,laptop?lock=122",
  },
];

export function AITrack() {
  return (
    <section id="ai-data-science" className="scroll-mt-20 bg-surface py-16">
      <div className="mx-auto max-w-[1240px] px-5">
        <h2 className="text-center font-display text-[48px] font-bold tracking-tight">
          Go Deeper with <span className="text-primary">AI & Data Science</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[14px] leading-relaxed text-muted-foreground">
          Purpose-built modules that merge applied AI, machine learning, and analytics with real
          industry workflows — not just theory.
        </p>
        <div className="mx-auto mt-4 h-[3px] w-14 rounded-full bg-primary" />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {aiModules.map((m) => (
            <article
              key={m.title}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-float"
            >
              <img src={m.img} alt={m.title} loading="lazy" className="h-[140px] w-full object-cover" />
              <div className="p-6">
                <h3 className="text-[15px] font-bold leading-snug">{m.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{m.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const researchPoints = [
  "1-on-1 mentorship on literature review, methodology, and data validation",
  "Manuscript and portfolio preparation for publication-grade output",
  "Guidance on selecting the right journals, platforms, or venues",
  "IP, authorship, and confidentiality protection with an NDA-backed process",
];

const internshipPoints = [
  "Placements with hiring partners across AI, data, marketing & web tracks",
  "Remote and global roles, not just local openings",
  "LinkedIn branding and freelance positioning strategy",
  "Dedicated job-hunting and outreach coaching from mentors",
];

export function ResearchMentorship() {
  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-[1240px] px-5">
        <h2 className="text-center font-display text-[48px] font-bold tracking-tight">
          Research Guidance & <span className="text-primary">Career Placement</span>
        </h2>
        <div className="mx-auto mt-4 h-[3px] w-14 rounded-full bg-primary" />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-7 shadow-card">
            <span className="grid size-12 place-items-center rounded-xl bg-accent">
              <SearchCheck className="size-6 text-primary" />
            </span>
            <h3 className="mt-4 text-[16px] font-bold">Research & Publication Guidance</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Structured, one-on-one mentorship for learners taking a project from idea to
              publication-ready or portfolio-ready work.
            </p>
            <ul className="mt-5 space-y-3">
              {researchPoints.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[13px]">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-7 shadow-card">
            <span className="grid size-12 place-items-center rounded-xl bg-accent">
              <Handshake className="size-6 text-primary" />
            </span>
            <h3 className="mt-4 text-[16px] font-bold">Professional Internships & Placement</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Hands-on industry placement support that turns course completion into real job offers.
            </p>
            <ul className="mt-5 space-y-3">
              {internshipPoints.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[13px]">
                  <Globe className="mt-0.5 size-4 shrink-0 text-primary" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
