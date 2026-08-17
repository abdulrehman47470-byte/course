import { useRef } from "react";
import {
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Linkedin,
  PlayCircle,
  TrendingUp,
  UserPlus,
} from "lucide-react";

const steps = [
  {
    icon: BookOpen,
    title: "Choose a Course",
    text: "Browse and enroll in a course that fits your goals.",
  },
  {
    icon: UserPlus,
    title: "Create Your Account",
    text: "Sign up, choose your plan, and get started.",
  },
  {
    icon: PlayCircle,
    title: "Learn & Complete",
    text: "Learn at your pace and complete all requirements.",
  },
  { icon: Award, title: "Earn CPD & IBEI", text: "Get internationally recognized certification." },
  { icon: Briefcase, title: "Get Hired", text: "Apply to jobs and get hired with confidence." },
];

export function Journey() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-background py-16">
      <div className="mx-auto max-w-[1240px] px-5">
        <h2 className="text-center font-display text-[48px] font-bold tracking-tight">
          From Learning to <span className="text-primary">Earning</span>
        </h2>
        <div className="relative mt-12">
          <div className="absolute left-[10%] right-[10%] top-7 hidden border-t border-dashed border-border lg:block" />
          <div className="relative grid gap-9 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s, i) => (
              <div key={s.title} className="text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-forest">
                  <s.icon className="size-6 text-forest-foreground" />
                </span>
                <p className="mt-3.5 text-[12px] font-semibold text-muted-foreground">{i + 1}</p>
                <h3 className="mt-1 text-[14px] font-bold">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-[200px] text-[12px] leading-relaxed text-muted-foreground">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const platform = [
  {
    icon: PlayCircle,
    title: "Interactive Learning",
    text: "Engaging video lectures with real-world examples.",
    img: "https://images.unsplash.com/photo-1758685848208-e108b6af94cc?w=480&h=280&fit=crop&auto=format&q=70",
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    text: "Track your progress and achievements in real time.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=480&h=280&fit=crop&auto=format&q=70",
  },
  {
    icon: Award,
    title: "Earn Certificates",
    text: "Get CPD & IBEI recognized certificates globally.",
    img: "https://images.unsplash.com/photo-1638636241638-aef5120c5153?w=480&h=280&fit=crop&auto=format&q=70",
  },
  {
    icon: FileText,
    title: "AI CV Builder",
    text: "Create ATS-friendly CVs that get you interviews.",
    img: "https://images.unsplash.com/photo-1698047681432-006d2449c631?w=480&h=280&fit=crop&auto=format&q=70",
  },
  {
    icon: Briefcase,
    title: "Job Portal",
    text: "Access verified job opportunities.",
    img: "https://images.unsplash.com/photo-1713947503588-8ff8196dc4a3?w=480&h=280&fit=crop&auto=format&q=70",
  },
  {
    icon: Linkedin,
    title: "LinkedIn Integration",
    text: "Connect, build your network and get hired faster.",
    img: "https://images.unsplash.com/photo-1704382002666-5dc4fbb522c0?w=480&h=280&fit=crop&auto=format&q=70",
  },
];

export function Platform() {
  return (
    <section className="bg-background pb-16">
      <div className="mx-auto max-w-[1240px] px-5">
        <h2 className="text-center font-display text-[48px] font-bold tracking-tight">
          One Platform. Unlimited Possibilities.
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {platform.map((p) => (
            <article
              key={p.title}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-float"
            >
              <img src={p.img} alt={p.title} loading="lazy" className="h-[130px] w-full object-cover" />
              <div className="p-4">
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

const certPoints = [
  "International Recognition",
  "Career Advancement",
  "Global Opportunities",
  "Lifetime Verification",
  "Your achievement, always valid",
];

export function Certifications() {
  return (
    <section className="bg-background pb-16">
      <div className="mx-auto max-w-[1240px] px-5">
        <div className="grid gap-9 rounded-xl bg-forest-deep p-9 text-forest-foreground lg:grid-cols-[1.1fr_auto_0.8fr_0.8fr_auto_1.2fr] lg:items-center">
          <div>
            <h2 className="text-xl font-bold leading-snug">
              Globally Recognized
              <br />
              Certifications
            </h2>
            <p className="mt-3.5 text-[13px] leading-relaxed text-forest-foreground/70">
              Get certified by CPD & IBEI and boost your career worldwide.
            </p>
          </div>
          <div className="hidden h-16 w-px bg-forest-foreground/20 lg:block" />
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
  );
}

const partners = [
  "Microsoft",
  "Google",
  "amazon",
  "IBM",
  "Deloitte.",
  "pwc",
  "NHS",
  "Pfizer",
  "shopify",
];

export function Partners() {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(dir: 1 | -1) {
    trackRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  }

  return (
    <section className="bg-background pb-16">
      <div className="mx-auto max-w-[1240px] px-5">
        <h2 className="text-[18px] font-bold tracking-tight">Our Hiring Partners</h2>
        <div className="mt-6 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4">
          <button
            aria-label="Previous partners"
            onClick={() => scroll(-1)}
            className="grid size-8 shrink-0 place-items-center rounded-full border border-border transition-colors hover:bg-secondary"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div
            ref={trackRef}
            className="flex min-w-0 gap-10 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {partners.map((p) => (
              <span
                key={p}
                className="shrink-0 text-lg font-bold tracking-tight text-muted-foreground/80"
              >
                {p}
              </span>
            ))}
          </div>
          <button
            aria-label="Next partners"
            onClick={() => scroll(1)}
            className="grid size-8 shrink-0 place-items-center rounded-full border border-border transition-colors hover:bg-secondary"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
