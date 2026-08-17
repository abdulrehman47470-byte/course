import { z } from "zod";

export const createJobListingSchema = z.object({
  title: z.string().trim().min(2, "Title is too short").max(160),
  company: z.string().trim().min(1, "Company is required").max(160),
  location: z.string().trim().max(160).optional().or(z.literal("")),
  remoteType: z.enum(["remote", "onsite", "hybrid"]),
  skills: z.string().trim().max(400).optional().or(z.literal("")),
  applyUrl: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  source: z.string().trim().max(80).optional().or(z.literal("")),
  applicationDeadline: z.string().trim().optional().or(z.literal("")),
});
export type CreateJobListingValues = z.infer<typeof createJobListingSchema>;
