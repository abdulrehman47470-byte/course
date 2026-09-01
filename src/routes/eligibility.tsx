import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  BarChart3,
  Briefcase,
  BrainCircuit,
  Calendar,
  CheckCircle2,
  Clock,
  Facebook,
  GraduationCap,
  ImageIcon,
  Linkedin,
  Loader2,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { markEligibilitySeen } from "@/lib/eligibility/server-fns";

// No real WhatsApp number exists anywhere in this codebase yet — set this
// (digits only, country code first, e.g. "923001234567") to wire up the
// registration form's "Chat on WhatsApp" submit below.
const WHATSAPP_NUMBER = "";

const exploreOptions = [
  { id: "feedback" as const, icon: MessageCircle, label: "Feedback", desc: "Student results" },
  {
    id: "mentor" as const,
    icon: GraduationCap,
    label: "About / Mentor",
    desc: "Recognition & bio",
  },
];

const feedbackScreenshots: { src: string; alt: string }[] = [
  {
    src: "/images/feedback/feedback-1.png",
    alt: "LinkedIn comments from Mahnor Abbasi, afia nadeem, and Nuzhat Zia praising the mentorship",
  },
  {
    src: "/images/feedback/feedback-2.png",
    alt: "LinkedIn comments praising a session on critical thinking and practical research skills",
  },
  {
    src: "/images/feedback/feedback-3.png",
    alt: "LinkedIn comments from students on a bioinformatics tools session",
  },
  {
    src: "/images/feedback/feedback-4.png",
    alt: "LinkedIn comments thanking the mentor for step-by-step guidance",
  },
  {
    src: "/images/feedback/feedback-5.png",
    alt: "LinkedIn comments from students on building job-ready skills through the mentorship",
  },
  {
    src: "/images/feedback/feedback-6.png",
    alt: "LinkedIn comments from Naseem Bibi, Nabia Amjad, and Hifza Paracha on their first class",
  },
];

const mentor = {
  name: "Abdur Rehman",
  role: "Founder & Mentor, CareerBooster",
  bio: "Founder of CareerBooster and mentor to students moving into research, data, and technical careers — teaching the practical AI, data, and career skills behind this program.",
  linkedin: "https://www.linkedin.com/in/abdul-rehman147",
  facebook: "https://www.facebook.com/profile.php?id=61586018271684",
};

const title = "Eligibility — CareerBooster";
const description =
  "A clean, practical overview of the AI, data, freelancing, and career-development skills CareerBooster teaches.";

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
  // (see src/routes/__root.tsx) won't redirect them back here again this
  // browser session.
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

const roadmapStages = [
  {
    stage: "Stage 1",
    title: "AI & Automation",
    icon: BrainCircuit,
    description:
      "Build practical skills for using AI to create, automate, and improve real-world work.",
    featured: true,
    items: [
      "Generative AI and AI-powered productivity",
      "Prompt engineering and advanced prompting",
      "AI-assisted research and information synthesis",
      "AI-powered problem solving",
      "AI workflow design",
      "AI agents and intelligent automation",
      "AI-powered business workflows",
      "AI-assisted website and web-app development",
      "AI-assisted coding, debugging, and testing",
      "Product idea generation and validation using AI",
      "Product planning, prototyping, and MVP development",
      "AI-assisted UI/UX and product design",
      "AI image generation and editing",
      "AI graphic and marketing creative generation",
      "AI video generation and editing",
      "Text-to-video and image-to-video workflows",
      "AI content writing and copywriting",
      "Blog, social media, website, and marketing content creation",
      "AI-assisted presentations and visual content",
      "AI voice, narration, captions, and subtitles",
      "AI content repurposing",
      "Connecting AI tools with APIs and other applications",
      "No-code and low-code automation",
      "Automated data collection and processing",
      "Automated reporting and business workflows",
      "AI-powered customer, marketing, and lead workflows",
      "Selecting and integrating the right AI tools for different tasks",
      "Evaluating, fact-checking, and improving AI-generated outputs",
      "Building repeatable AI-powered workflows for professional work",
    ],
  },
  {
    stage: "Stage 2",
    title: "Data Science & Data Analysis",
    icon: BarChart3,
    description:
      "Develop practical data skills for turning raw information into useful insights and better decisions.",
    featured: false,
    items: [
      "Data collection and organization",
      "Data cleaning and preprocessing",
      "Exploratory data analysis",
      "Data visualization",
      "Statistical fundamentals",
      "SQL and database fundamentals",
      "Excel and spreadsheet-based analysis",
      "Interactive dashboards and reporting",
      "Business data analysis",
      "Scientific data analysis",
      "Identifying trends, patterns, and relationships",
      "Data-driven decision making",
      "Basic machine learning",
      "AI-assisted data analysis",
      "Automated data analysis and reporting",
      "Data storytelling",
      "Professional presentation of findings",
    ],
  },
  {
    stage: "Stage 3",
    title: "Freelancing & Online Earning",
    icon: Briefcase,
    description:
      "Learn how to turn technical, AI, data, and digital skills into real freelance and remote-work opportunities.",
    featured: false,
    items: [
      "Finding profitable freelance skills",
      "Choosing the right freelance niche",
      "Creating professional freelance profiles",
      "Building a strong portfolio",
      "Creating service packages",
      "Writing high-quality proposals",
      "Finding freelance projects and clients",
      "Client communication and management",
      "Project planning and delivery",
      "Pricing freelance services",
      "Negotiating with clients",
      "AI-assisted freelancing",
      "Using AI to increase productivity and delivery speed",
      "Delivering professional technical and creative services",
      "Building long-term client relationships",
      "Getting repeat clients",
      "Remote work strategies",
      "Working with international clients",
      "Building multiple online income streams",
      "Developing a professional personal brand",
    ],
  },
  {
    stage: "Stage 4",
    title: "Job Hunting & Career Development",
    icon: GraduationCap,
    description:
      "Develop the practical skills needed to compete for jobs and build a long-term professional career.",
    featured: false,
    items: [
      "Professional CV/resume development",
      "ATS-friendly CV optimization",
      "LinkedIn profile optimization",
      "Professional portfolio development",
      "Personal branding",
      "Finding relevant job opportunities",
      "Effective job-search strategies",
      "Job application optimization",
      "Writing professional cover letters",
      "AI-assisted job searching and application preparation",
      "Interview preparation",
      "Technical interview preparation",
      "AI-assisted interview practice",
      "Identifying and demonstrating job-ready skills",
      "Building project-based evidence of skills",
      "Professional networking",
      "Finding remote and international jobs",
      "Career planning and progression",
      "Upskilling based on industry demand",
      "Preparing for career transitions",
      "Building a strong professional online presence",
    ],
  },
];

const achievements = [
  { icon: BrainCircuit, title: "AI & Automation Skills" },
  { icon: BarChart3, title: "High-Demand Data Science Skills" },
  { icon: Briefcase, title: "Freelance & Remote-Work Skills" },
  { icon: Award, title: "CPD & IBEI Recognized Certificate" },
  { icon: GraduationCap, title: "Job Hunting Support" },
  { icon: Sparkles, title: "Professional Portfolio" },
];

const classDetails = [
  {
    icon: Sparkles,
    title: "Completely Online",
    text: "Learn from anywhere in the world — no campus, no commute.",
  },
  {
    icon: Calendar,
    title: "Friday & Sunday Live Classes",
    text: "Live sessions run every Friday and Sunday across a 6-month program — every class is recorded too, so you're never stuck if you miss one.",
  },
  {
    icon: Clock,
    title: "Self-Paced Lessons",
    text: "A structured video-and-quiz sequence you move through on your own schedule.",
  },
  {
    icon: RefreshCw,
    title: "Progress Auto-Saved",
    text: "Pick up exactly where you left off, every time you sign back in.",
  },
  {
    icon: Award,
    title: "Recognized Certificate",
    text: "A CPD & IBEI recognized certificate is issued automatically once every lesson and quiz is complete.",
  },
  {
    icon: ShieldCheck,
    title: "Reviewed Enrollment",
    text: "Pay via bank transfer, submit your reference, and our team reviews and activates your account.",
  },
];

type ExploreTab = (typeof exploreOptions)[number]["id"];

function RegistrationForm() {
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!WHATSAPP_NUMBER) {
      alert("This form isn't connected to a WhatsApp number yet — contact the site owner.");
      return;
    }
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const phone = String(data.get("phone") || "");

    setSubmitting(true);
    const message = `New Registration — CareerBooster\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nI agree to pay the PKR 4,999 program fee. Please send me the payment details.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    setSubmitting(false);
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-[13px] font-bold text-foreground/80">Full Name</label>
        <input
          name="name"
          required
          className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-[15px] outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="text-[13px] font-bold text-foreground/80">Email</label>
        <input
          type="email"
          name="email"
          required
          className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-[15px] outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="text-[13px] font-bold text-foreground/80">Phone Number (WhatsApp)</label>
        <input
          type="tel"
          name="phone"
          required
          className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-[15px] outline-none focus:border-primary"
        />
      </div>
      <label className="flex items-start gap-2.5 text-[13.5px] text-muted-foreground">
        <input type="checkbox" required className="mt-1 size-4 accent-primary" />I agree to pay the
        PKR 4,999 program fee to confirm my seat.
      </label>
      <button
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-[15px] font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {submitting && <Loader2 className="size-4 animate-spin" />}
        Submit Details & Chat on WhatsApp
      </button>
      {!WHATSAPP_NUMBER && (
        <p className="text-center text-[12.5px] font-semibold text-destructive">
          Not yet connected to a WhatsApp number — this is a preview.
        </p>
      )}
    </form>
  );
}

function EligibilityPage() {
  const [activeTab, setActiveTab] = useState<ExploreTab | null>(null);
  const tabContentRef = useRef<HTMLDivElement>(null);

  function openTab(id: ExploreTab) {
    setActiveTab((cur) => (cur === id ? null : id));
    window.setTimeout(() => {
      tabContentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  return (
    <div className="min-h-screen bg-background">
      <main>
        <section className="bg-gradient-to-br from-accent/40 to-background py-16 sm:py-24">
          <div className="mx-auto max-w-[1000px] px-5 text-center">
            <div className="mb-8 inline-flex flex-col items-center gap-1.5 rounded-[2rem] bg-forest-deep px-8 py-6 shadow-float sm:px-10">
              <span className="text-[12.5px] font-bold uppercase tracking-widest text-forest-foreground/50">
                Program Fee
              </span>
              <span className="text-[42px] font-bold text-emerald-bright sm:text-[54px]">
                PKR 4,999
              </span>
              <span className="mt-1 text-[12.5px] font-semibold text-forest-foreground/70">
                One-time payment · Full course access
              </span>
            </div>

            <h1 className="font-display text-[38px] font-bold leading-[1.08] tracking-tight text-foreground sm:text-[56px]">
              Learn <span className="text-primary">High-Demand & High-Earning</span> Skills for Your
              Career
            </h1>

            <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-2xl border-2 border-primary/30 bg-accent px-6 py-4 text-left sm:px-8 sm:py-5">
              <Sparkles className="size-7 shrink-0 text-primary sm:size-8" />
              <p className="text-[16px] font-bold leading-snug text-foreground sm:text-xl">
                Browse the courses and see exactly what skills you'll walk away with.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-background py-16">
          <div className="mx-auto max-w-[1240px] px-5">
            <h2 className="text-center font-display text-[38px] font-bold tracking-tight sm:text-[52px]">
              Built for <span className="text-primary">Every Stage</span> of Your Career
            </h2>
            <div className="mx-auto mt-4 h-[3px] w-14 rounded-full bg-primary" />

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {whoCanJoin.map((w) => (
                <div
                  key={w.title}
                  className="rounded-2xl border-[3px] border-primary bg-card p-7 text-center shadow-card"
                >
                  <span className="mx-auto grid size-14 place-items-center rounded-full bg-accent">
                    <w.icon className="size-6 text-primary" />
                  </span>
                  <h3 className="mt-5 text-[17px] font-bold">{w.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{w.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills roadmap — four major areas */}
        <section className="bg-surface py-16 lg:py-24">
          <div className="mx-auto max-w-[1350px] px-5">
            <div className="mx-auto mb-12 max-w-3xl text-center lg:mb-16">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-[13px] font-bold uppercase tracking-widest text-primary">
                What You'll Learn
              </span>
              <h2 className="mt-4 font-display text-[34px] font-bold tracking-tight sm:text-[48px]">
                Master AI, Data & <span className="text-primary">Digital Skills</span> for
                Real-World Work
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-muted-foreground sm:text-lg">
                CareerBooster is built around practical, job-ready skills — the kind you can use
                immediately to build digital products, use AI professionally, automate repetitive
                work, analyze data, create content, generate images and videos, build a portfolio,
                freelance, find remote work, apply for jobs, and grow a long-term career.
              </p>
            </div>

            <div className="space-y-8">
              {roadmapStages.map((s) =>
                s.featured ? (
                  <div
                    key={s.stage}
                    className="rounded-[2rem] border-[3px] border-primary bg-card p-7 shadow-float sm:p-10 lg:p-12"
                  >
                    <div className="mb-7 flex items-center gap-4">
                      <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary shadow-card">
                        <s.icon className="size-7 text-primary-foreground" />
                      </span>
                      <div>
                        <p className="text-[12px] font-bold uppercase tracking-widest text-primary">
                          {s.stage}
                        </p>
                        <h3 className="text-[24px] font-bold leading-tight text-foreground sm:text-[28px]">
                          {s.title}
                        </h3>
                      </div>
                    </div>
                    <p className="mb-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
                      {s.description}
                    </p>
                    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {s.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[14.5px]">
                          <CheckCircle2 className="mt-0.5 size-[18px] shrink-0 text-primary" />
                          <span className="leading-snug text-foreground/80">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div
                    key={s.stage}
                    className="rounded-[2rem] border-[3px] border-primary bg-card p-7 shadow-card sm:p-10 lg:p-12"
                  >
                    <div className="mb-7 flex items-center gap-4">
                      <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-forest shadow-card">
                        <s.icon className="size-7 text-forest-foreground" />
                      </span>
                      <div>
                        <p className="text-[12px] font-bold uppercase tracking-widest text-primary">
                          {s.stage}
                        </p>
                        <h3 className="text-[22px] font-bold leading-tight sm:text-[26px]">
                          {s.title}
                        </h3>
                      </div>
                    </div>
                    <p className="mb-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
                      {s.description}
                    </p>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {s.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[14.5px]">
                          <CheckCircle2 className="mt-0.5 size-[18px] shrink-0 text-primary" />
                          <span className="leading-snug text-foreground/80">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="bg-forest-deep py-16 lg:py-24">
          <div className="mx-auto max-w-[1240px] px-5">
            <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-14">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[13px] font-bold uppercase tracking-widest text-forest-foreground">
                Learning Outcomes & Career Benefits
              </span>
              <h2 className="mt-4 font-display text-[30px] font-bold tracking-tight text-forest-foreground sm:text-[40px]">
                Achievements After This Program
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {achievements.map((a) => (
                <div
                  key={a.title}
                  className="flex items-center gap-4 rounded-2xl bg-card p-6 shadow-card"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent">
                    <a.icon className="size-6 text-primary" />
                  </span>
                  <p className="text-[15.5px] font-bold leading-snug">{a.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About the classes */}
        <section className="bg-surface py-16 lg:py-24">
          <div className="mx-auto max-w-[1240px] px-5">
            <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-14">
              <span className="text-[14px] font-bold uppercase tracking-widest text-primary">
                How It Works
              </span>
              <h2 className="mt-3 font-display text-[30px] font-bold tracking-tight sm:text-[40px]">
                About the Classes
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {classDetails.map((d) => (
                <div
                  key={d.title}
                  className="rounded-2xl border-[3px] border-primary bg-card p-7 shadow-card"
                >
                  <span className="grid size-12 place-items-center rounded-2xl bg-accent">
                    <d.icon className="size-6 text-primary" />
                  </span>
                  <h3 className="mt-4 text-[16px] font-bold">{d.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
                    {d.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Explore More */}
        <section className="bg-background py-16 lg:py-24">
          <div className="mx-auto max-w-[1100px] px-5">
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <span className="text-[14px] font-bold uppercase tracking-widest text-primary">
                Explore More
              </span>
              <h2 className="mt-3 font-display text-[30px] font-bold tracking-tight sm:text-[40px]">
                Want More Before You Enroll?
              </h2>
              <p className="mt-3 text-[15px] text-muted-foreground">
                Tap any option to see the full detail.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {exploreOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => openTab(opt.id)}
                  className={`flex flex-col items-center gap-3 rounded-[1.75rem] border-[3px] border-primary p-8 text-center transition-all ${
                    activeTab === opt.id
                      ? "-translate-y-1 bg-forest-deep shadow-float"
                      : "bg-card hover:-translate-y-1 hover:shadow-card"
                  }`}
                >
                  <span
                    className={`grid size-14 place-items-center rounded-2xl ${activeTab === opt.id ? "bg-primary" : "bg-accent"}`}
                  >
                    <opt.icon
                      className={`size-7 ${activeTab === opt.id ? "text-primary-foreground" : "text-primary"}`}
                    />
                  </span>
                  <div>
                    <p
                      className={`text-[17px] font-bold ${activeTab === opt.id ? "text-forest-foreground" : "text-foreground"}`}
                    >
                      {opt.label}
                    </p>
                    <p
                      className={`mt-1 text-[13px] font-semibold ${activeTab === opt.id ? "text-forest-foreground/60" : "text-muted-foreground"}`}
                    >
                      {opt.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {activeTab && (
          <div ref={tabContentRef} className="scroll-mt-8">
            {activeTab === "feedback" && (
              <section className="bg-surface py-16 lg:py-24">
                <div className="mx-auto max-w-[1240px] px-5">
                  <div className="mx-auto mb-10 max-w-2xl text-center">
                    <h2 className="font-display text-[30px] font-bold tracking-tight sm:text-[40px]">
                      Student Feedback
                    </h2>
                    <p className="mt-3 text-[15px] text-muted-foreground">
                      Real results from real students.
                    </p>
                  </div>
                  {feedbackScreenshots.length > 0 ? (
                    <div className="columns-1 gap-5 space-y-5 sm:columns-2 lg:columns-3">
                      {feedbackScreenshots.map((shot) => (
                        <img
                          key={shot.src}
                          src={shot.src}
                          alt={shot.alt}
                          loading="lazy"
                          className="block w-full break-inside-avoid rounded-2xl border border-border shadow-card"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
                      <ImageIcon className="size-8 text-muted-foreground" />
                      <p className="mt-3 text-[14px] font-semibold">
                        Student feedback screenshots are being added here.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeTab === "mentor" && (
              <section className="bg-surface py-16 lg:py-24">
                <div className="mx-auto max-w-[700px] px-5 text-center">
                  <span className="mx-auto grid size-16 place-items-center rounded-full bg-forest-deep">
                    <GraduationCap className="size-8 text-forest-foreground" />
                  </span>
                  <h2 className="mt-5 font-display text-[26px] font-bold tracking-tight sm:text-[32px]">
                    {mentor.name}
                  </h2>
                  <p className="mt-1 text-[14px] font-semibold text-primary">{mentor.role}</p>
                  <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
                    {mentor.bio}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={mentor.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-[13.5px] font-bold transition-colors hover:border-primary hover:text-primary"
                    >
                      <Linkedin className="size-4" /> LinkedIn
                    </a>
                    <a
                      href={mentor.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-[13.5px] font-bold transition-colors hover:border-primary hover:text-primary"
                    >
                      <Facebook className="size-4" /> Facebook
                    </a>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {/* Registration */}
        <section className="bg-background py-16 lg:py-24">
          <div className="mx-auto max-w-[560px] px-5">
            <div className="rounded-[2rem] border border-border bg-card p-8 shadow-card sm:p-10">
              <div className="text-center">
                <span className="text-[13px] font-bold uppercase tracking-widest text-primary">
                  Final Step
                </span>
                <h2 className="mt-2 font-display text-[26px] font-bold tracking-tight sm:text-[32px]">
                  Join the CareerBooster Program
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                  Fill out the form below — it lands directly on WhatsApp so we can confirm your
                  seat right away.
                </p>
              </div>
              <div className="mt-7">
                <RegistrationForm />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
