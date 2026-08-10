import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Features, PopularCourses } from "@/components/site/Features";
import { Journey, Platform, Certifications, Partners } from "@/components/site/Journey";
import { Testimonials, PricingFaq } from "@/components/site/Social";
import { AITrack, ResearchMentorship } from "@/components/site/Specializations";
import { CareerRoadmap, MentorSupport } from "@/components/site/CareerSupport";
import { CtaFooter } from "@/components/site/CtaFooter";

const title = "CareerBooster — Build Skills That Build Your Future";
const description =
  "Industry-focused courses with CPD & IBEI recognized certifications to help you upskill, get hired, and grow faster.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <PopularCourses />
        <AITrack />
        <Journey />
        <ResearchMentorship />
        <Platform />
        <CareerRoadmap />
        <Certifications />
        <MentorSupport />
        <Partners />
        <Testimonials />
        <PricingFaq />
      </main>
      <CtaFooter />
    </div>
  );
}
