import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Scholarship } from "@/lib/supabase/types";
import { createScholarshipSchema, type CreateScholarshipValues } from "./schemas";

// RLS (scholarships_select_activated) already restricts rows to admins or
// activated students, so this one query safely serves both audiences.
export const listScholarships = createServerFn({ method: "GET" }).handler(
  async (): Promise<Scholarship[]> => {
    const supabase = getSupabaseServerClient();
    const { data } = await supabase
      .from("scholarships")
      .select("*")
      .order("closes_at", { ascending: true, nullsFirst: false });
    return data ?? [];
  },
);

export const createScholarship = createServerFn({ method: "POST" })
  .validator((input: unknown): CreateScholarshipValues => createScholarshipSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("You must be signed in.");

    const { error } = await supabase.from("scholarships").insert({
      name: data.name,
      organization: data.organization,
      country: data.country || null,
      degree_level: data.degreeLevel || null,
      eligibility: data.eligibility || null,
      funding_details: data.fundingDetails || null,
      application_requirements: data.applicationRequirements || null,
      application_url: data.applicationUrl || null,
      opens_at: data.opensAt || null,
      closes_at: data.closesAt || null,
      created_by: user.id,
    });
    if (error) throw new Error(error.message);
    return { success: true as const };
  });

export const deleteScholarship = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("scholarships").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true as const };
  });
