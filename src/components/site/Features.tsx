import { Link } from "@tanstack/react-router";
import { useRef } from "react";
import {
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  Code2,
  FileText,
  MonitorPlay,
  Briefcase,
  BookOpen,
  Star,
} from "lucide-react";
import courseAi from "@/assets/course-ai.jpg";
import courseData from "@/assets/course-data.jpg";
import courseWeb from "@/assets/course-web.jpg";
import courseMarketing from "@/assets/course-marketing.jpg";
import courseCyber from "@/assets/course-cyber.jpg";

const features = [
  {
    icon: BookOpen,
    title: "Expert Courses",
    text: "Industry-designed professional courses built for modern careers.",
    to: "/courses" as const,
    img: "https://loremflickr.com/480/320/elearning,classroom?lock=105",
  },
  {
    icon: MonitorPlay,
    title: "HD Video Learning",
    text: "Learn anytime with HD recordings, notes, quizzes, and lifetime access.",
    to: "/courses" as const,
    img: "https://loremflickr.com/480/320/video,laptop?lock=106",
  },
  {
    icon: Code2,
    title: "Hands-on Projects",
    text: "Real-world portfolio projects to build practical experience and confidence.",
    to: "/courses" as const,
    img: "https://loremflickr.com/480/320/coding,programming?lock=107",
  },
  {
    icon: Award,
    title: "CPD & IBEI Certification",
    text: "Internationally recognized certificates that validate your skills and boost your career.",
    to: "/certifications" as const,
    img: "https://loremflickr.com/480/320/certificate,graduation?lock=108",
  },
  {
    icon: FileText,
    title: "AI CV Builder",
    text: "Upload your CV and generate an ATS-optimized resume that gets you noticed.",
    to: "/career-services" as const,
    img: "https://loremflickr.com/480/320/resume,document?lock=109",
  },
  {
    icon: Briefcase,
    title: "Career & Job Portal",
    text: "Find the right job with LinkedIn integration and access to top opportunities.",
    to: "/career-services" as const,
    img: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=480&h=320&fit=crop&auto=format&q=70",
  },
];

const courses = [
  {
    img: courseAi,
    tag: "Bestseller",
    tagClass: "bg-primary text-primary-foreground",
    title: "AI & Machine Learning Mastery",
    text: "Applied ML, model deployment, and automation for real products.",
    rating: "4.8",
    reviews: "2.1K",
  },
  {
    img: courseData,
    tag: "Popular",
    tagClass: "bg-primary text-primary-foreground",
    title: "Data Science & Analytics Professional",
    text: "Data cleaning, visualization, and storytelling with Tableau & Power BI.",
    rating: "4.7",
    reviews: "1.8K",
  },
  {
    img: courseWeb,
    tag: "Trending",
    tagClass: "bg-forest text-forest-foreground",
    title: "Full Stack Web Development",
    text: "Ship production-ready apps across the front end and back end.",
    rating: "4.6",
    reviews: "1.6K",
  },
  {
    img: courseMarketing,
    tag: "New",
    tagClass: "bg-destructive text-destructive-foreground",
    title: "Digital Marketing Strategy",
    text: "Campaign strategy, analytics, and growth channels that convert.",
    rating: "4.5",
    reviews: "980",
  },
  {
    img: courseCyber,
    tag: "Hot",
    tagClass: "bg-destructive text-destructive-foreground",
    title: "Cybersecurity Essentials",
    text: "Threat modelling, defensive fundamentals, and security operations.",
    rating: "4.7",
    reviews: "1.2K",
  },
];

export function Features() {
  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-[1240px] px-5">
        <h2 className="text-center font-display text-[48px] font-bold tracking-tight">
          Everything You Need to <span className="text-primary">Succeed</span>
        </h2>
        <div className="mx-auto mt-3 h-[3px] w-14 rounded-full bg-primary" />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.title}
              className="overflow-hidden rounded-xl border border-border bg-card text-center shadow-card transition-shadow hover:shadow-float"
            >
              <img src={f.img} alt={f.title} loading="lazy" className="h-[150px] w-full object-cover" />
              <div className="p-6">
                <h3 className="text-[15px] font-bold leading-snug">{f.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{f.text}</p>
                <Link
                  to={f.to}
                  className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-primary"
                >
                  Learn More <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PopularCourses() {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(dir: 1 | -1) {
    trackRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  }

  return (
    <section className="bg-surface pb-16">
      <div className="mx-auto max-w-[1240px] px-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <h2 className="truncate text-2xl font-bold tracking-tight">Popular Courses</h2>
          <Link
            to="/courses"
            className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-primary"
          >
            View All Courses <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="relative mt-5">
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {courses.map((c) => (
              <article
                key={c.title}
                className="w-[340px] shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-float"
              >
                <div className="relative">
                  <img
                    src={c.img}
                    alt={c.title}
                    loading="lazy"
                    width={680}
                    height={420}
                    className="h-[190px] w-full object-cover"
                  />
                  <span
                    className={`absolute left-2.5 top-2.5 rounded px-2 py-1 text-[9px] font-bold ${c.tagClass}`}
                  >
                    {c.tag}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-[16px] font-bold leading-snug">{c.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                    {c.text}
                  </p>
                  <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                    <span className="flex min-w-0 items-center gap-1 text-[12px] font-semibold">
                      <Star className="size-3.5 shrink-0 fill-star text-star" />
                      {c.rating}
                      <span className="text-muted-foreground">({c.reviews})</span>
                    </span>
                    <span className="shrink-0 text-[15px] font-bold">PKR 4,999</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <button
            aria-label="Previous courses"
            onClick={() => scroll(-1)}
            className="absolute -left-3 top-1/3 hidden size-9 -translate-y-1/2 place-items-center rounded-full border border-border bg-card shadow-card transition-colors hover:bg-secondary lg:grid"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            aria-label="Next courses"
            onClick={() => scroll(1)}
            className="absolute -right-3 top-1/3 hidden size-9 -translate-y-1/2 place-items-center rounded-full border border-border bg-card shadow-card transition-colors hover:bg-secondary lg:grid"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
