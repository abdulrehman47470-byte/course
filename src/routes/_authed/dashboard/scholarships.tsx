import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, GraduationCap } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { listScholarships } from "@/lib/scholarships/server-fns";

export const Route = createFileRoute("/_authed/dashboard/scholarships")({
  loader: () => listScholarships(),
  component: ScholarshipsPage,
});

function statusOf(closesAt: string | null, opensAt: string | null): "open" | "upcoming" | "closed" {
  const now = Date.now();
  if (opensAt && new Date(opensAt).getTime() > now) return "upcoming";
  if (closesAt && new Date(closesAt).getTime() < now) return "closed";
  return "open";
}

const statusClass: Record<string, string> = {
  open: "bg-accent text-primary",
  upcoming: "bg-secondary text-foreground/70",
  closed: "bg-destructive/10 text-destructive",
};

function ScholarshipsPage() {
  const scholarships = Route.useLoaderData();

  return (
    <DashboardShell title="Scholarship Opportunities">
      {scholarships.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No scholarships listed yet"
          text="Relevant scholarship opportunities will show up here as they're added."
        />
      ) : (
        <div className="space-y-3">
          {scholarships.map((s) => {
            const status = statusOf(s.closes_at, s.opens_at);
            return (
              <div key={s.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[14px] font-bold">{s.name}</p>
                    <p className="text-[12.5px] text-muted-foreground">
                      {s.organization}
                      {s.country ? ` — ${s.country}` : ""}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusClass[status]}`}
                  >
                    {status}
                  </span>
                </div>
                {s.degree_level && (
                  <p className="mt-2 text-[12.5px] text-muted-foreground">{s.degree_level}</p>
                )}
                {s.eligibility && (
                  <p className="mt-2 text-[12.5px] leading-relaxed text-foreground/80">
                    {s.eligibility}
                  </p>
                )}
                {s.funding_details && (
                  <p className="mt-1.5 text-[12.5px] text-muted-foreground">{s.funding_details}</p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11.5px] text-muted-foreground">
                  {s.opens_at && <span>Opens {new Date(s.opens_at).toLocaleDateString()}</span>}
                  {s.closes_at && <span>Closes {new Date(s.closes_at).toLocaleDateString()}</span>}
                </div>
                {s.application_url && (
                  <a
                    href={s.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary"
                  >
                    Apply now <ExternalLink className="size-3.5" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
