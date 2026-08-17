import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Course, Enrollment, Profile } from "@/lib/supabase/types";
import { z } from "zod";
import {
  createCourseSchema,
  enrollStudentSchema,
  updateEnrollmentSchema,
  updateUserRoleSchema,
  type CreateCourseValues,
  type EnrollStudentValues,
  type UpdateEnrollmentValues,
  type UpdateUserRoleValues,
} from "./schemas";

// All of these rely on RLS's is_admin() policies — they run as the calling
// user via the request-scoped server client, not the service-role client.
// A non-admin caller simply gets empty results / a permission error from
// Postgres, which is the correct defense-in-depth behavior even though the
// _authed-admin layout route already blocks non-admins from reaching here.

export type AdminCounts = { userCount: number; courseCount: number; enrollmentCount: number };

// Row counts only — uses head:true so Postgres returns just the count,
// not the underlying rows. Avoids pulling every profiles/courses/enrollments
// row over the wire just to display three numbers on the overview page.
export const getAdminCounts = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminCounts> => {
    const supabase = getSupabaseServerClient();
    const [users, courses, enrollments] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("courses").select("*", { count: "exact", head: true }),
      supabase.from("enrollments").select("*", { count: "exact", head: true }),
    ]);
    return {
      userCount: users.count ?? 0,
      courseCount: courses.count ?? 0,
      enrollmentCount: enrollments.count ?? 0,
    };
  },
);

export const listUsers = createServerFn({ method: "GET" }).handler(async (): Promise<Profile[]> => {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
});

export const listAllCourses = createServerFn({ method: "GET" }).handler(
  async (): Promise<Course[]> => {
    const supabase = getSupabaseServerClient();
    const { data } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });
    return data ?? [];
  },
);

export const createCourse = createServerFn({ method: "POST" })
  .validator((input: unknown): CreateCourseValues => createCourseSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("courses").insert({
      title: data.title,
      slug: data.slug,
      description: data.description || null,
      category: data.category || null,
      price_cents: data.priceCents,
      currency: data.currency,
    });
    if (error) {
      throw new Error(
        error.code === "23505" ? "A course with that slug already exists." : error.message,
      );
    }
    return { success: true as const };
  });

/**
 * RLS's profiles_update_own policy already lets an admin caller update any
 * profile's role (the `public.is_admin()` branch of its `with check`), so
 * this runs through the request-scoped client, not the service-role one —
 * the calling admin's own elevated permission is what authorizes it.
 * Blocks self-service role changes so an admin can't accidentally demote
 * or lock out their own account; use a second admin account for that.
 */
export const adminUpdateUserRole = createServerFn({ method: "POST" })
  .validator((input: unknown): UpdateUserRoleValues => updateUserRoleSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("You must be signed in.");
    if (user.id === data.userId) {
      throw new Error("You can't change your own role — use a different admin account.");
    }

    const { error } = await supabase
      .from("profiles")
      .update({ role: data.role })
      .eq("id", data.userId);
    if (error) throw new Error(error.message);
    return { success: true as const };
  });

export type EnrollmentAdminRow = Enrollment & {
  course: { title: string } | null;
  student: { display_name: string } | null;
};

export const listEnrollmentsAdmin = createServerFn({ method: "GET" }).handler(
  async (): Promise<EnrollmentAdminRow[]> => {
    const supabase = getSupabaseServerClient();
    const { data } = await supabase
      .from("enrollments")
      .select("*, course:courses(title), student:profiles(display_name)")
      .order("enrolled_at", { ascending: false });
    return (data ?? []) as unknown as EnrollmentAdminRow[];
  },
);

export type StudentEnrollment = Enrollment & { course: Course | null };
export type StudentDetail = { profile: Profile; enrollments: StudentEnrollment[] };

export const getStudentDetail = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ studentId: z.string().uuid() }).parse(input))
  .handler(async ({ data }): Promise<StudentDetail | null> => {
    const supabase = getSupabaseServerClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.studentId)
      .single();
    if (!profile) return null;

    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("*, course:courses(*)")
      .eq("student_id", data.studentId)
      .order("enrolled_at", { ascending: false });

    return { profile, enrollments: (enrollments ?? []) as unknown as StudentEnrollment[] };
  });

/**
 * Admin-granted course access — bypasses payment entirely (there is no
 * working payment gateway wired up yet). Useful for comps, testing, and
 * manual access grants. Goes through the request-scoped client: RLS's
 * enrollments_admin_write policy is what actually authorizes the insert.
 */
export const enrollStudent = createServerFn({ method: "POST" })
  .validator((input: unknown): EnrollStudentValues => enrollStudentSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("enrollments").insert({
      student_id: data.studentId,
      course_id: data.courseId,
    });
    if (error) {
      throw new Error(
        error.code === "23505" ? "This student is already enrolled in that course." : error.message,
      );
    }
    return { success: true as const };
  });

export const updateEnrollmentStatus = createServerFn({ method: "POST" })
  .validator((input: unknown): UpdateEnrollmentValues => updateEnrollmentSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from("enrollments")
      .update({ status: data.status })
      .eq("id", data.enrollmentId);
    if (error) throw new Error(error.message);
    return { success: true as const };
  });
