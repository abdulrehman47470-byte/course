import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  image,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  image: string;
}) {
  return (
    <section className="relative overflow-hidden bg-forest-deep text-forest-foreground">
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-forest-deep/80" />
      <div className="absolute inset-0 hero-grid-bg opacity-40" />
      <div className="relative mx-auto max-w-[1240px] px-5 py-16 lg:py-20">
        <span className="inline-flex rounded-full bg-emerald-bright/15 px-3.5 py-1.5 text-[12px] font-semibold text-emerald-bright ring-1 ring-emerald-bright/30">
          {eyebrow}
        </span>
        <h1 className="mt-5 max-w-2xl font-display text-[34px] font-bold leading-[1.08] tracking-tight sm:text-[48px]">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-forest-foreground/70">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
