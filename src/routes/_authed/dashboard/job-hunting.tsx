import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, ExternalLink, MapPin } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { listJobListings } from "@/lib/jobs/server-fns";

export const Route = createFileRoute("/_authed/dashboard/job-hunting")({
  loader: () => listJobListings(),
  component: JobHuntingPage,
});

const remoteTypeLabel: Record<string, string> = {
  remote: "Remote",
  onsite: "On-site",
  hybrid: "Hybrid",
};

function JobHuntingPage() {
  const jobs = Route.useLoaderData();

  return (
    <DashboardShell title="Job Hunting">
      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No job opportunities yet"
          text="Relevant openings matched to your skills will show up here as they're added."
        />
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[14px] font-bold">{job.title}</p>
                  <p className="text-[12.5px] text-muted-foreground">{job.company}</p>
                </div>
                <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase text-primary">
                  {remoteTypeLabel[job.remote_type] ?? job.remote_type}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-muted-foreground">
                {job.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" /> {job.location}
                  </span>
                )}
                {job.application_deadline && (
                  <span>Apply by {new Date(job.application_deadline).toLocaleDateString()}</span>
                )}
                {job.source && <span>Source: {job.source}</span>}
              </div>
              {job.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-foreground/80"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              {job.apply_url && (
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary"
                >
                  Apply now <ExternalLink className="size-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
