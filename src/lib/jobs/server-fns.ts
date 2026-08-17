import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { JobListing } from "@/lib/supabase/types";
import { createJobListingSchema, type CreateJobListingValues } from "./schemas";

// RLS (job_listings_select_activated) already restricts rows to admins or
// activated students, so this one query safely serves both audiences.
export const listJobListings = createServerFn({ method: "GET" }).handler(
  async (): Promise<JobListing[]> => {
    const supabase = getSupabaseServerClient();
    const { data } = await supabase
      .from("job_listings")
      .select("*")
      .order("posted_at", { ascending: false });
    return data ?? [];
  },
);

export const createJobListing = createServerFn({ method: "POST" })
  .validator((input: unknown): CreateJobListingValues => createJobListingSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("You must be signed in.");

    const { error } = await supabase.from("job_listings").insert({
      title: data.title,
      company: data.company,
      location: data.location || null,
      remote_type: data.remoteType,
      skills: data.skills
        ? data.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      apply_url: data.applyUrl || null,
      source: data.source || null,
      application_deadline: data.applicationDeadline || null,
      created_by: user.id,
    });
    if (error) throw new Error(error.message);
    return { success: true as const };
  });

export const deleteJobListing = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("job_listings").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true as const };
  });
