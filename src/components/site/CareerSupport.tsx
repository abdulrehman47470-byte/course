import {
  Award,
  ArrowRight,
  BookMarked,
  Clock,
  Globe,
  LifeBuoy,
  Sparkles,
  Users,
} from "lucide-react";

const roadmapPoints = [
  "Field-by-field blueprints across AI, data, cybersecurity, marketing & web",
  "250+ project and startup ideas to build a standout portfolio",
  "500+ ready-to-use AI prompts to speed up your learning",
  "Cheat sheets, worksheets, and ready-to-pursue project directions",
];

export function CareerRoadmap() {
  return (
    <section className="bg-background pb-16">
      <div className="mx-auto max-w-[1240px] px-5">
        <div className="grid gap-9 rounded-xl bg-forest-deep p-9 text-forest-foreground lg:grid-cols-[1.1fr_auto_1fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-emerald-bright/15 px-3.5 py-1.5 text-[12px] font-semibold text-emerald-bright ring-1 ring-emerald-bright/30">
              Free Resource
            </span>
            <h2 className="mt-4 text-2xl font-bold leading-snug">
              Your Personalized
              <br />
              Career Roadmap
            </h2>
            <p className="mt-3.5 max-w-xs text-[13px] leading-relaxed text-forest-foreground/70">
              A field-tested, field-by-field roadmap to the high-income skills employers are hiring
              for right now.
            </p>
            <button className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90">
              Get the Roadmap <ArrowRight className="size-4" />
            </button>
          </div>
          <div className="hidden h-32 w-px bg-forest-foreground/20 lg:block" />
          <ul className="space-y-3.5">
            {roadmapPoints.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[13px]">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-emerald-bright" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const mentorStats = [
  { icon: Award, value: "Published Researchers", label: "On our mentor roster" },
  { icon: BookMarked, value: "Patent & IP Holders", label: "Real-world protected work" },
  { icon: Users, value: "Ex-Industry Leaders", label: "From top hiring partners" },
  { icon: LifeBuoy, value: "Peer Reviewers", label: "For international journals & publications" },
];

const supportPoints = [
  {
    icon: Users,
    title: "Direct Mentor Access",
    text: "Get 1-on-1 time with mentors, not just recorded lectures.",
    img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=480&h=280&fit=crop&auto=format&q=70",
  },
  {
    icon: Globe,
    title: "Global Batch Community",
    text: "Learn alongside peers from different countries and time zones.",
    img: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=480&h=280&fit=crop&auto=format&q=70",
  },
  {
    icon: Clock,
    title: "Flexible Timezones",
    text: "Live sessions and support scheduled to work globally.",
    img: "https://images.unsplash.com/photo-1533749047139-189de3cf06d3?w=480&h=280&fit=crop&auto=format&q=70",
  },
  {
    icon: LifeBuoy,
    title: "Dedicated Support Team",
    text: "Real humans to help whenever you get stuck.",
    img: "https://images.unsplash.com/photo-1553775282-20af80779df7?w=480&h=280&fit=crop&auto=format&q=70",
  },
];

export function MentorSupport() {
  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-[1240px] px-5">
        <h2 className="text-center font-display text-[48px] font-bold tracking-tight">
          Learn From <span className="text-primary">Real Practitioners</span>
        </h2>
        <div className="mx-auto mt-4 h-[3px] w-14 rounded-full bg-primary" />

        <div className="mt-9 grid gap-7 rounded-xl border border-border bg-card px-9 py-7 shadow-card sm:grid-cols-2 lg:grid-cols-4">
          {mentorStats.map((s) => (
            <div key={s.label} className="flex items-center gap-3.5">
              <s.icon className="size-7 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="truncate text-[14px] font-bold">{s.value}</p>
                <p className="truncate text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {supportPoints.map((p) => (
            <article
              key={p.title}
              className="overflow-hidden rounded-xl border border-border bg-card text-center shadow-card"
            >
              <img src={p.img} alt={p.title} loading="lazy" className="h-[120px] w-full object-cover" />
              <div className="p-5">
                <h3 className="text-[14px] font-bold">{p.title}</h3>
                <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{p.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
