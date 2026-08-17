import { z } from "zod";

export const updateUserRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["student", "instructor", "admin"]),
});
export type UpdateUserRoleValues = z.infer<typeof updateUserRoleSchema>;

export const createCourseSchema = z.object({
  title: z.string().trim().min(3, "Title is too short").max(160),
  slug: z
    .string()
    .trim()
    .min(3, "Slug is too short")
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  category: z.string().trim().max(80).optional().or(z.literal("")),
  priceCents: z.coerce.number().int().min(0, "Price can't be negative"),
  currency: z.string().trim().length(3, "Use a 3-letter currency code"),
});
export type CreateCourseValues = z.infer<typeof createCourseSchema>;

export const enrollStudentSchema = z.object({
  studentId: z.string().uuid(),
  courseId: z.string().uuid(),
});
export type EnrollStudentValues = z.infer<typeof enrollStudentSchema>;

export const updateEnrollmentSchema = z.object({
  enrollmentId: z.string().uuid(),
  status: z.enum(["active", "completed", "refunded", "revoked"]),
});
export type UpdateEnrollmentValues = z.infer<typeof updateEnrollmentSchema>;

export const reviewPaymentSchema = z.object({
  submissionId: z.string().uuid(),
  decision: z.enum(["approved", "rejected"]),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});
export type ReviewPaymentValues = z.infer<typeof reviewPaymentSchema>;
