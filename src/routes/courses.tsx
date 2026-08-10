import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type ComponentType } from "react";
import {
  ArrowRight,
  Award,
  Bot,
  Briefcase,
  Calculator,
  Code2,
  Dna,
  FileText,
  FlaskConical,
  Linkedin,
  MonitorPlay,
  PieChart,
  Rocket,
  Search,
  Star,
  Syringe,
  Target,
  Wallet,
  Workflow,
  X,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaFooter } from "@/components/site/CtaFooter";
import courseAi from "@/assets/course-ai.jpg";
import courseData from "@/assets/course-data.jpg";
import courseWeb from "@/assets/course-web.jpg";
import courseMarketing from "@/assets/course-marketing.jpg";
import courseCyber from "@/assets/course-cyber.jpg";

const title = "Courses — CareerBooster";
const description =
  "Browse industry-designed courses in AI, data, bioscience, web development, marketing, and career growth — with CPD & IBEI recognized certification.";

export const Route = createFileRoute("/courses")({
  validateSearch: (search: Record<string, unknown>): { q?: string } => {
    const q = search["q"];
    return typeof q === "string" ? { q } : {};
  },
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
  }),
  component: CoursesPage,
});

type Course = {
  category: string;
  image?: string;
  icon?: ComponentType<{ className?: string }>;
  tag: string;
  tagClass: string;
  title: string;
  text: string;
  objectives: string[];
  skills: string[];
  outcome: string;
  rating: string;
  reviews: string;
};

const categories = [
  "All Courses",
  "AI & Machine Learning",
  "Data Science",
  "Bioscience & Research",
  "Web Development",
  "Marketing",
  "Cybersecurity",
  "Career Services",
];

const courses: Course[] = [
  {
    category: "AI & Machine Learning",
    image: courseAi,
    tag: "Bestseller",
    tagClass: "bg-primary text-primary-foreground",
    title: "AI & Machine Learning Mastery",
    text: "Applied ML, model deployment, and automation for real products.",
    objectives: [
      "Build and evaluate supervised & unsupervised models",
      "Deploy models into working applications",
      "Automate data pipelines end to end",
    ],
    skills: ["Python", "Scikit-learn", "Model Deployment", "Data Pipelines"],
    outcome: "Move into ML engineer or applied AI roles with a deployable portfolio.",
    rating: "4.8",
    reviews: "2.1K",
  },
  {
    category: "Data Science",
    image: courseData,
    tag: "Popular",
    tagClass: "bg-primary text-primary-foreground",
    title: "Data Science & Analytics Professional",
    text: "Data cleaning, visualization, and storytelling with Tableau & Power BI.",
    objectives: [
      "Clean and structure real-world datasets",
      "Apply statistical methods to uncover patterns",
      "Build dashboards that drive decisions",
    ],
    skills: ["Python", "SQL", "Tableau", "Power BI"],
    outcome: "Step into data analyst or data science roles across any industry.",
    rating: "4.7",
    reviews: "1.8K",
  },
  {
    category: "Web Development",
    image: courseWeb,
    tag: "Trending",
    tagClass: "bg-forest text-forest-foreground",
    title: "Full Stack Web Development",
    text: "Ship production-ready apps across the front end and back end.",
    objectives: [
      "Build responsive front ends with modern frameworks",
      "Design and ship REST APIs",
      "Deploy full applications to production",
    ],
    skills: ["React", "Node.js", "APIs", "Databases"],
    outcome: "Build a launch-ready portfolio and apply for full stack roles.",
    rating: "4.6",
    reviews: "1.6K",
  },
  {
    category: "Marketing",
    image: courseMarketing,
    tag: "New",
    tagClass: "bg-destructive text-destructive-foreground",
    title: "Digital Marketing Strategy",
    text: "Campaign strategy, analytics, and growth channels that convert.",
    objectives: [
      "Plan multi-channel marketing campaigns",
      "Read analytics to optimize spend",
      "Grow an audience through owned and paid channels",
    ],
    skills: ["SEO", "Paid Ads", "Analytics", "Content Strategy"],
    outcome: "Run campaigns confidently as a marketer, freelancer, or founder.",
    rating: "4.5",
    reviews: "980",
  },
  {
    category: "Cybersecurity",
    image: courseCyber,
    tag: "Hot",
    tagClass: "bg-destructive text-destructive-foreground",
    title: "Cybersecurity Essentials",
    text: "Threat modelling, defensive fundamentals, and security operations.",
    objectives: [
      "Model and assess common attack surfaces",
      "Apply defensive security fundamentals",
      "Understand security operations workflows",
    ],
    skills: ["Threat Modelling", "Network Security", "SOC Basics", "Risk Assessment"],
    outcome: "Move toward SOC analyst or security operations roles.",
    rating: "4.7",
    reviews: "1.2K",
  },
  {
    category: "Bioscience & Research",
    icon: Dna,
    image: "https://loremflickr.com/640/512/dna,genetics?lock=129",
    tag: "New",
    tagClass: "bg-forest text-forest-foreground",
    title: "Bioinformatics",
    text: "Analyze biological data using computational tools and pipelines.",
    objectives: [
      "Work with genomic & proteomic data structures",
      "Run sequence alignment & annotation pipelines",
      "Apply Python/R to biological datasets",
    ],
    skills: ["BioPython", "Sequence Alignment", "Genomic Databases", "R"],
    outcome: "Step into bioinformatics analyst or research support roles.",
    rating: "4.8",
    reviews: "410",
  },
  {
    category: "Bioscience & Research",
    icon: FlaskConical,
    image: "https://loremflickr.com/640/512/pharmaceutical,laboratory?lock=130",
    tag: "New",
    tagClass: "bg-forest text-forest-foreground",
    title: "Drug Design",
    text: "Computer-aided drug design — from target identification to lead optimization.",
    objectives: [
      "Identify and validate drug targets",
      "Perform molecular docking & simulation",
      "Evaluate ADME and pharmacokinetic properties",
    ],
    skills: ["Molecular Docking", "GROMACS", "ADME Analysis", "Structure-Based Design"],
    outcome: "Contribute to early-stage drug discovery research teams.",
    rating: "4.7",
    reviews: "265",
  },
  {
    category: "Bioscience & Research",
    icon: Syringe,
    image: "https://loremflickr.com/640/512/vaccine,syringe?lock=131",
    tag: "New",
    tagClass: "bg-forest text-forest-foreground",
    title: "Vaccine Design",
    text: "Modern vaccine development from antigen selection to construct design.",
    objectives: [
      "Select and validate antigen targets",
      "Design multi-epitope vaccine constructs",
      "Apply immunoinformatics tools for analysis",
    ],
    skills: ["Immunoinformatics", "Epitope Mapping", "Construct Design", "Structural Analysis"],
    outcome: "Support vaccine R&D teams or advanced immunology research.",
    rating: "4.8",
    reviews: "198",
  },
  {
    category: "Data Science",
    icon: Calculator,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&h=512&fit=crop&auto=format&q=70",
    tag: "Popular",
    tagClass: "bg-primary text-primary-foreground",
    title: "Data Analysis",
    text: "Turn raw data into clear answers that guide real decisions.",
    objectives: [
      "Clean and structure messy datasets",
      "Apply statistical methods to find patterns",
      "Communicate findings clearly to stakeholders",
    ],
    skills: ["Excel", "SQL", "Pandas", "Statistics"],
    outcome: "Move into data analyst roles across tech, finance, and healthcare.",
    rating: "4.6",
    reviews: "890",
  },
  {
    category: "Data Science",
    icon: PieChart,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=512&fit=crop&auto=format&q=70",
    tag: "Trending",
    tagClass: "bg-forest text-forest-foreground",
    title: "Data Visualization",
    text: "Build dashboards and visuals that make complex data instantly clear.",
    objectives: [
      "Design dashboards in Tableau & Power BI",
      "Apply visualization best practices",
      "Translate analysis into decision-ready visuals",
    ],
    skills: ["Tableau", "Power BI", "Looker Studio", "Visual Storytelling"],
    outcome: "Land BI analyst roles or strengthen any data-facing career.",
    rating: "4.6",
    reviews: "540",
  },
  {
    category: "AI & Machine Learning",
    icon: Workflow,
    image: "https://loremflickr.com/640/512/automation,robot?lock=134",
    tag: "Hot",
    tagClass: "bg-destructive text-destructive-foreground",
    title: "AI & Automation",
    text: "Build AI-powered automations that handle repetitive work for you.",
    objectives: [
      "Design automation workflows with n8n",
      "Integrate AI models into working pipelines",
      "Automate repetitive data & research tasks",
    ],
    skills: ["n8n", "Workflow Automation", "APIs", "Applied AI"],
    outcome: "Apply automation anywhere — or freelance building it for others.",
    rating: "4.7",
    reviews: "620",
  },
  {
    category: "AI & Machine Learning",
    icon: Rocket,
    image: "https://loremflickr.com/640/512/ai,technology?lock=135",
    tag: "New",
    tagClass: "bg-forest text-forest-foreground",
    title: "AI Product Development",
    text: "Go from AI idea to shipped product — prototype, integrate, iterate.",
    objectives: [
      "Prototype AI-powered features quickly",
      "Integrate LLMs and APIs into products",
      "Ship and iterate on real AI products",
    ],
    skills: ["LLM Integration", "Prototyping", "API Design", "AI UX"],
    outcome: "Build toward AI product manager or applied AI engineer roles.",
    rating: "4.8",
    reviews: "375",
  },
  {
    category: "Career Services",
    icon: Linkedin,
    image: "https://loremflickr.com/640/512/linkedin,professional?lock=136",
    tag: "Popular",
    tagClass: "bg-primary text-primary-foreground",
    title: "LinkedIn Optimization",
    text: "Rebuild your profile to attract recruiters and real opportunities.",
    objectives: [
      "Optimize your profile for recruiter search",
      "Build a content strategy that builds authority",
      "Use outreach to open real conversations",
    ],
    skills: ["Personal Branding", "Recruiter SEO", "Content Strategy", "Networking"],
    outcome: "Get discovered by recruiters before you even apply.",
    rating: "4.7",
    reviews: "705",
  },
  {
    category: "Career Services",
    icon: Target,
    image: "https://loremflickr.com/640/512/interview,resume?lock=137",
    tag: "Trending",
    tagClass: "bg-forest text-forest-foreground",
    title: "Job Hunting & Career Preparation",
    text: "A practical playbook for the modern job hunt, start to offer.",
    objectives: [
      "Build a targeted job search strategy",
      "Prepare for technical & behavioral interviews",
      "Negotiate offers with confidence",
    ],
    skills: ["Interview Prep", "CV Strategy", "Negotiation", "Application Tracking"],
    outcome: "Cut your job search time and walk into interviews prepared.",
    rating: "4.6",
    reviews: "612",
  },
  {
    category: "Career Services",
    icon: Wallet,
    image: "https://loremflickr.com/640/512/freelancer,laptop?lock=138",
    tag: "New",
    tagClass: "bg-forest text-forest-foreground",
    title: "Online Earning for Bioscience Professionals",
    text: "Turn bioscience expertise into freelance and remote income.",
    objectives: [
      "Identify freelance & remote income paths in bioscience",
      "Package your expertise into sellable services",
      "Find and pitch your first clients",
    ],
    skills: ["Freelancing", "Remote Work", "Consulting Basics", "Portfolio Building"],
    outcome: "Build income alongside or beyond a traditional bio career.",
    rating: "4.7",
    reviews: "289",
  },
  {
    category: "Career Services",
    icon: Briefcase,
    image: "https://loremflickr.com/640/512/freelancer,remote?lock=139",
    tag: "Popular",
    tagClass: "bg-primary text-primary-foreground",
    title: "Freelancing on Fiverr & Upwork",
    text: "Build a freelance profile and pipeline on the two biggest freelance marketplaces.",
    objectives: [
      "Set up a profile and gigs that convert on Fiverr & Upwork",
      "Price and pitch services with confidence",
      "Manage clients and deliver work that earns repeat business",
    ],
    skills: ["Fiverr", "Upwork", "Client Management", "Proposal Writing"],
    outcome: "Land your first paid freelance clients and build a repeatable income stream.",
    rating: "4.6",
    reviews: "342",
  },
  {
    category: "Career Services",
    icon: Target,
    image: "https://loremflickr.com/640/512/phone,office?lock=140",
    tag: "New",
    tagClass: "bg-forest text-forest-foreground",
    title: "Cold Calling",
    text: "Confidently open conversations and book meetings over the phone.",
    objectives: [
      "Structure a cold call script that doesn't sound scripted",
      "Handle objections and gatekeepers with confidence",
      "Book meetings and follow up systematically",
    ],
    skills: ["Sales Scripts", "Objection Handling", "Lead Qualification", "Follow-up"],
    outcome: "Turn cold outreach into booked meetings and closed deals.",
    rating: "4.5",
    reviews: "204",
  },
  {
    category: "Career Services",
    icon: FileText,
    image: "https://loremflickr.com/640/512/email,marketing?lock=141",
    tag: "New",
    tagClass: "bg-forest text-forest-foreground",
    title: "Cold Emailing",
    text: "Write outreach emails that get opened, read, and replied to.",
    objectives: [
      "Write subject lines and openers that get opened",
      "Structure emails that earn a reply, not a delete",
      "Build and run a repeatable outreach sequence",
    ],
    skills: ["Copywriting", "Outreach Sequences", "Deliverability", "A/B Testing"],
    outcome: "Run outreach campaigns that reliably generate replies and leads.",
    rating: "4.6",
    reviews: "268",
  },
];

const included = [
  { icon: MonitorPlay, text: "HD video lectures with lifetime access" },
  { icon: Code2, text: "Hands-on, portfolio-ready projects" },
  { icon: Award, text: "CPD & IBEI recognized certification" },
  { icon: FileText, text: "AI CV Builder for every graduate" },
  { icon: Briefcase, text: "Career & job portal access" },
];

function CourseIcon({ course }: { course: Course }) {
  if (course.image) {
    return (
      <img
        src={course.image}
        alt={course.title}
        loading="lazy"
        width={640}
        height={512}
        className="h-[160px] w-full object-cover"
      />
    );
  }
  const Icon = course.icon ?? Bot;
  return (
    <div className="flex h-[160px] w-full items-center justify-center bg-gradient-to-br from-forest-deep to-forest">
      <Icon className="size-14 text-emerald-bright" strokeWidth={1.5} />
    </div>
  );
}

function CoursesPage() {
  const { q } = Route.useSearch();
  const [query, setQuery] = useState(q ?? "");
  const [category, setCategory] = useState("All Courses");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return courses.filter((c) => {
      const inCategory = category === "All Courses" || c.category === category;
      const inQuery =
        needle === "" ||
        c.title.toLowerCase().includes(needle) ||
        c.text.toLowerCase().includes(needle) ||
        c.skills.some((s) => s.toLowerCase().includes(needle));
      return inCategory && inQuery;
    });
  }, [query, category]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageHeader
          eyebrow="Courses"
          title={
            <>
              Industry Courses Built for <span className="text-emerald-bright">Modern Careers</span>
            </>
          }
          subtitle="Every course is designed with working practitioners, structured around real projects, and backed by internationally recognized certification."
          image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&h=500&fit=crop&auto=format&q=70"
        />

        <section className="bg-surface py-10">
          <div className="mx-auto max-w-[1240px] px-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2.5">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`rounded-full px-4 py-2 text-[12px] font-semibold transition-colors ${
                      category === c
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card text-foreground/80 hover:bg-secondary"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="relative w-full max-w-xs">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search courses or skills..."
                  className="h-11 w-full rounded-md border border-border bg-card pl-10 pr-9 text-sm outline-none focus:border-primary"
                />
                {query && (
                  <button
                    aria-label="Clear search"
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            </div>

            <p className="mt-4 text-[12px] text-muted-foreground">
              Showing {filtered.length} of {courses.length} courses
            </p>

            {filtered.length === 0 ? (
              <div className="mt-8 rounded-lg border border-dashed border-border bg-card py-16 text-center">
                <p className="text-sm font-semibold">No courses match your search</p>
                <button
                  onClick={() => {
                    setQuery("");
                    setCategory("All Courses");
                  }}
                  className="mt-3 text-[12px] font-semibold text-primary"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((c) => (
                  <article
                    key={c.title}
                    className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-float"
                  >
                    <div className="relative">
                      <CourseIcon course={c} />
                      <span
                        className={`absolute left-3 top-3 rounded px-2 py-1 text-[10px] font-bold ${c.tagClass}`}
                      >
                        {c.tag}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        {c.category}
                      </span>
                      <h3 className="mt-1.5 text-[16px] font-bold leading-snug">{c.title}</h3>
                      <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
                        {c.text}
                      </p>

                      <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-foreground/70">
                        You'll learn to
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {c.objectives.map((o) => (
                          <li
                            key={o}
                            className="flex items-start gap-2 text-[12px] leading-relaxed text-muted-foreground"
                          >
                            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                            {o}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {c.skills.map((s) => (
                          <span
                            key={s}
                            className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-primary"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      <p className="mt-4 flex items-start gap-2 text-[12px] leading-relaxed text-foreground/80">
                        <Briefcase className="mt-0.5 size-3.5 shrink-0 text-primary" />
                        {c.outcome}
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                        <span className="flex items-center gap-1 text-[12px] font-semibold">
                          <Star className="size-3.5 shrink-0 fill-star text-star" />
                          {c.rating}
                          <span className="text-muted-foreground">({c.reviews})</span>
                        </span>
                        <span className="text-[13px] font-bold">PKR 4,999</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-background py-14">
          <div className="mx-auto max-w-[1240px] px-5">
            <div className="grid gap-8 rounded-lg bg-forest-deep p-8 text-forest-foreground lg:grid-cols-[1fr_auto_1fr] lg:items-center">
              <div>
                <h2 className="text-lg font-bold leading-snug">Every Course Includes</h2>
                <p className="mt-3 text-[11px] leading-relaxed text-forest-foreground/70">
                  The essentials that turn a course into a career outcome — built in, not sold
                  separately.
                </p>
              </div>
              <div className="hidden h-24 w-px bg-forest-foreground/20 lg:block" />
              <ul className="space-y-2.5">
                {included.map((i) => (
                  <li key={i.text} className="flex items-center gap-2.5 text-[11px]">
                    <i.icon className="size-4 shrink-0 text-emerald-bright" />
                    {i.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 text-center">
              <Link
                to="/career-services"
                className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                See Career Services <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <CtaFooter />
    </div>
  );
}
