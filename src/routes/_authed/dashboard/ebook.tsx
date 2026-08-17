import { createFileRoute } from "@tanstack/react-router";
import { BookMarked, Download } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { getEbookUrl } from "@/lib/dashboard/server-fns";

export const Route = createFileRoute("/_authed/dashboard/ebook")({
  loader: () => getEbookUrl(),
  component: EbookPage,
});

function EbookPage() {
  const ebookUrl = Route.useLoaderData();

  return (
    <DashboardShell title="Career Guide eBook">
      {ebookUrl ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-16 text-center shadow-card">
          <span className="grid size-14 place-items-center rounded-full bg-accent">
            <BookMarked className="size-6 text-primary" />
          </span>
          <p className="mt-4 text-[15px] font-bold">Your Career Guide eBook is ready</p>
          <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
            Career planning, interview prep, and resume-writing guidance — yours to keep.
          </p>
          <a
            href={ebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Download className="size-4" /> Download eBook
          </a>
        </div>
      ) : (
        <EmptyState
          icon={BookMarked}
          title="Your eBook is on its way"
          text="It hasn't been uploaded yet — check back soon."
        />
      )}
    </DashboardShell>
  );
}
