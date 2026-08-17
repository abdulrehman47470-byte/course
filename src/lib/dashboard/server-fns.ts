import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Course, Enrollment } from "@/lib/supabase/types";

export type EnrollmentWithCourse = Enrollment & { course: Course | null };

export const getMyEnrollments = createServerFn({ method: "GET" }).handler(
  async (): Promise<EnrollmentWithCourse[]> => {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
      .from("enrollments")
      .select("*, course:courses(*)")
      .eq("student_id", user.id)
      .order("enrolled_at", { ascending: false });

    return (data ?? []) as unknown as EnrollmentWithCourse[];
  },
);

// Reached only once activation is confirmed (dashboard.tsx layout gates
// on that), so no separate access check is needed here — just whether a
// file has actually been configured yet.
export const getEbookUrl = createServerFn({ method: "GET" }).handler(
  (): string | null => process.env["EBOOK_DOWNLOAD_URL"] || null,
);
