import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/site/Header";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-surface px-5 py-14">
      <div className="w-full max-w-md">
        <Link to="/" className="mx-auto flex w-fit items-center justify-center">
          <Logo />
        </Link>
        <div className="mt-8 rounded-xl border border-border bg-card p-8 shadow-card">
          <h1 className="text-[22px] font-bold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-[13px] text-muted-foreground">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
        {footer && <p className="mt-6 text-center text-[13px] text-muted-foreground">{footer}</p>}
      </div>
    </div>
  );
}

export const authInputClass = (hasError: boolean) =>
  `mt-2 w-full rounded-md border bg-background px-4 py-3 text-[13px] outline-none placeholder:text-muted-foreground focus:border-primary ${
    hasError ? "border-destructive" : "border-border"
  }`;

export const authLabelClass = "text-[12px] font-semibold text-foreground/80";
export const authErrorClass = "mt-1 text-[11px] text-destructive";
export const authSubmitClass =
  "flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3.5 text-[15px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-70";
