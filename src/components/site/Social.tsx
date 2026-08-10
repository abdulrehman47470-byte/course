import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ChevronRight, Check, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Data Scientist at Microsoft",
    initials: "SJ",
    quote:
      "The courses are top-notch! I gained practical skills and landed my dream job within 3 months.",
  },
  {
    name: "David Chen",
    role: "ML Engineer at Amazon",
    initials: "DC",
    quote: "The CPD & IBEI certification added great value to my profile. Highly recommended!",
  },
  {
    name: "Aisha Khan",
    role: "Product Manager at Google",
    initials: "AK",
    quote: "The AI CV builder and job support helped me secure interviews at top companies.",
  },
  {
    name: "Michael Torres",
    role: "Bioinformatics Analyst at Novartis",
    initials: "MT",
    quote: "The Bioinformatics track finally connected my biology degree to real data skills.",
  },
  {
    name: "Priya Patel",
    role: "Research Scholar",
    initials: "PP",
    quote: "The research and publication mentorship helped me get my first paper accepted.",
  },
  {
    name: "James Okafor",
    role: "Freelance Data Consultant",
    initials: "JO",
    quote: "The career services turned a stalled job search into three offers in six weeks.",
  },
];

const PAGE_SIZE = 3;

export function Testimonials() {
  const [page, setPage] = useState(0);
  const pages = Math.ceil(testimonials.length / PAGE_SIZE);
  const visible = testimonials.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section className="bg-background pb-16">
      <div className="mx-auto max-w-[1240px] px-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <h2 className="truncate text-2xl font-bold tracking-tight">What Our Learners Say</h2>
          <Link
            to="/about"
            className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-primary"
          >
            View All Reviews <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {visible.map((t) => (
            <figure
              key={t.name}
              className="rounded-xl border border-border bg-card p-7 shadow-card"
            >
              <div className="flex items-center gap-3.5">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-[14px] font-bold text-primary">
                  {t.initials}
                </span>
                <div className="min-w-0">
                  <figcaption className="truncate text-[14px] font-bold">{t.name}</figcaption>
                  <p className="truncate text-[12px] text-muted-foreground">{t.role}</p>
                  <div className="mt-1 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-3 fill-star text-star" />
                    ))}
                  </div>
                </div>
              </div>
              <blockquote className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
                “{t.quote}”
              </blockquote>
            </figure>
          ))}
        </div>

        {pages > 1 && (
          <div className="mt-6 flex justify-center gap-1.5">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                aria-label={`Show testimonials page ${i + 1}`}
                onClick={() => setPage(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === page ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const plans = [
  {
    name: "Basic Tier",
    price: 1500,
    features: ["Access to courses", "CV upload feature"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Standard Tier",
    price: 2000,
    features: ["Access to courses", "eBook", "Certificate", "Job Hunting support"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Premium Tier",
    price: 3000,
    features: ["Everything in Standard Tier", "1-on-1 live classes"],
    cta: "Get Started",
    highlight: true,
  },
];

const faqs = [
  "Are the certificates recognized?",
  "How does the AI CV Builder work?",
  "Is there lifetime access to courses?",
  "Can I get a refund?",
  "How do I contact support?",
];

export function PricingFaq() {
  return (
    <section className="bg-background pb-16">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Choose the Plan That's Right for You
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {plans.map((p) => (
              <article
                key={p.name}
                className={`relative rounded-xl border bg-card p-6 shadow-card ${
                  p.highlight ? "border-primary" : "border-border"
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded bg-primary px-2.5 py-1 text-[9px] font-bold text-primary-foreground">
                    Most Popular
                  </span>
                )}
                <h3 className="text-[14px] font-bold">{p.name}</h3>
                <p className="mt-2 text-3xl font-bold">PKR {p.price.toLocaleString()}</p>
                <ul className="mt-5 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[12px]">
                      <Check className="mt-[2px] size-3.5 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-6 w-full rounded-md px-3 py-2.5 text-[12px] font-semibold transition-opacity hover:opacity-90 ${
                    p.highlight
                      ? "bg-primary text-primary-foreground"
                      : "border border-primary text-primary"
                  }`}
                >
                  {p.cta}
                </button>
              </article>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-3">
            {faqs.map((q) => (
              <Link
                key={q}
                to="/resources"
                hash="faq"
                className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 text-left shadow-card transition-colors hover:bg-secondary"
              >
                <span className="truncate text-[13px] font-medium">{q}</span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
