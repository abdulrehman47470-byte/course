import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import heroImage from "@/assets/hero-student.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-forest-deep text-forest-foreground">
      <div className="absolute inset-0 hero-grid-bg opacity-70" />
      <div className="relative mx-auto max-w-[1240px] px-5 pb-14 pt-14 lg:pb-16 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div>
            <h1 className="font-display text-[42px] font-bold leading-[1.06] tracking-tight sm:text-[68px]">
              Build Skills That
              <br />
              Build <span className="text-emerald-bright">Your Future.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-forest-foreground/70">
              Industry-focused courses with CPD & IBEI recognized certifications to help you
              upskill, get hired, and grow faster.
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-[15px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Explore Courses <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/"
                hash="how-it-works"
                className="inline-flex items-center gap-2 rounded-md border border-forest-foreground/25 px-6 py-3.5 text-[15px] font-semibold text-forest-foreground transition-colors hover:bg-forest-foreground/10"
              >
                How It Works <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="Learner studying online with a laptop"
              width={1024}
              height={1024}
              fetchPriority="high"
              decoding="async"
              className="ml-auto h-[320px] w-full max-w-[440px] rounded-xl object-cover object-top lg:h-[380px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
