import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Course, Lesson, Quiz } from "@/lib/supabase/types";
import { submitQuizSchema, type SubmitQuizValues } from "./schemas";

export type LessonWithStatus = Lesson & {
  quiz: Quiz | null;
  videoCompleted: boolean;
  quizPassed: boolean;
  quizBestScore: number | null;
  unlocked: boolean;
};

export type CourseProgressResult = {
  course: Course;
  lessons: LessonWithStatus[];
  currentLessonId: string | null;
  courseCompleted: boolean;
};

export const getCourseProgress = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ courseId: z.string().uuid() }).parse(input))
  .handler(async ({ data }): Promise<CourseProgressResult> => {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("You must be signed in.");

    const { data: course } = await supabase
      .from("courses")
      .select("*")
      .eq("id", data.courseId)
      .single();
    if (!course) throw new Error("Course not found");

    const { data: lessons } = await supabase
      .from("lessons")
      .select("*, quiz:quizzes(*)")
      .eq("course_id", data.courseId)
      .order("order_index");
    const lessonRows = (lessons ?? []) as unknown as (Lesson & { quiz: Quiz | null })[];

    const lessonIds = lessonRows.map((l) => l.id);
    const quizIds = lessonRows.map((l) => l.quiz?.id).filter((id): id is string => !!id);

    const { data: progressRows } = lessonIds.length
      ? await supabase
          .from("lesson_progress")
          .select("lesson_id")
          .eq("student_id", user.id)
          .in("lesson_id", lessonIds)
      : { data: [] as { lesson_id: string }[] };
    const completedLessonIds = new Set((progressRows ?? []).map((r) => r.lesson_id));

    const { data: attemptRows } = quizIds.length
      ? await supabase
          .from("quiz_attempts")
          .select("quiz_id, score_percent, passed")
          .eq("student_id", user.id)
          .in("quiz_id", quizIds)
      : { data: [] as { quiz_id: string; score_percent: number; passed: boolean }[] };
    const bestByQuiz = new Map<string, { passed: boolean; score: number }>();
    for (const a of attemptRows ?? []) {
      const existing = bestByQuiz.get(a.quiz_id);
      bestByQuiz.set(a.quiz_id, {
        passed: !!existing?.passed || a.passed,
        score: Math.max(existing?.score ?? 0, a.score_percent),
      });
    }

    let unlocked = true;
    let currentLessonId: string | null = null;
    const result: LessonWithStatus[] = [];
    for (const lesson of lessonRows) {
      const videoCompleted = completedLessonIds.has(lesson.id);
      const attempt = lesson.quiz ? bestByQuiz.get(lesson.quiz.id) : undefined;
      const quizPassed = !!attempt?.passed;
      const isDone = videoCompleted && (!lesson.quiz || quizPassed);

      result.push({
        ...lesson,
        videoCompleted,
        quizPassed,
        quizBestScore: attempt?.score ?? null,
        unlocked,
      });
      if (!isDone && currentLessonId === null) currentLessonId = lesson.id;
      unlocked = unlocked && isDone;
    }

    return {
      course,
      lessons: result,
      currentLessonId,
      courseCompleted: currentLessonId === null && lessonRows.length > 0,
    };
  });

export const markLessonComplete = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ lessonId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.rpc("mark_lesson_complete", { p_lesson_id: data.lessonId });
    if (error) throw new Error(error.message);
    return { success: true as const };
  });

export type QuizQuestionForStudent = {
  id: string;
  text: string;
  order: number;
  options: { id: string; text: string; order: number }[];
};

export const getQuizQuestions = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ lessonId: z.string().uuid() }).parse(input))
  .handler(async ({ data }): Promise<QuizQuestionForStudent[]> => {
    const supabase = getSupabaseServerClient();
    const { data: rows, error } = await supabase.rpc("get_quiz_questions", {
      p_lesson_id: data.lessonId,
    });
    if (error) throw new Error(error.message);

    const byQuestion = new Map<string, QuizQuestionForStudent>();
    for (const row of rows ?? []) {
      if (!byQuestion.has(row.question_id)) {
        byQuestion.set(row.question_id, {
          id: row.question_id,
          text: row.question_text,
          order: row.question_order,
          options: [],
        });
      }
      byQuestion.get(row.question_id)?.options.push({
        id: row.option_id,
        text: row.option_text,
        order: row.option_order,
      });
    }
    return Array.from(byQuestion.values())
      .sort((a, b) => a.order - b.order)
      .map((q) => ({ ...q, options: q.options.sort((a, b) => a.order - b.order) }));
  });

export const submitQuizAttempt = createServerFn({ method: "POST" })
  .validator((input: unknown): SubmitQuizValues => submitQuizSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { data: result, error } = await supabase.rpc("submit_quiz_attempt", {
      p_quiz_id: data.quizId,
      p_answers: data.answers,
    });
    if (error) throw new Error(error.message);
    const row = result?.[0];
    if (!row) throw new Error("No result returned from the server.");
    return { scorePercent: row.score_percent, passed: row.passed };
  });
