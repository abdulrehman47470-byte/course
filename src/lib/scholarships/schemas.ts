import { z } from "zod";

export const createScholarshipSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(200),
  organization: z.string().trim().min(1, "Organization is required").max(200),
  country: z.string().trim().max(120).optional().or(z.literal("")),
  degreeLevel: z.string().trim().max(120).optional().or(z.literal("")),
  eligibility: z.string().trim().max(1000).optional().or(z.literal("")),
  fundingDetails: z.string().trim().max(1000).optional().or(z.literal("")),
  applicationRequirements: z.string().trim().max(1000).optional().or(z.literal("")),
  applicationUrl: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  opensAt: z.string().trim().optional().or(z.literal("")),
  closesAt: z.string().trim().optional().or(z.literal("")),
});
export type CreateScholarshipValues = z.infer<typeof createScholarshipSchema>;
