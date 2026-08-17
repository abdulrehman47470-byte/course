import { z } from "zod";

export const createLessonSchema = z.object({
  courseId: z.string().uuid(),
  title: z.string().trim().min(2, "Title is too short").max(200),
  videoUrl: z.string().trim().url("Enter a valid video URL"),
});
export type CreateLessonValues = z.infer<typeof createLessonSchema>;

export const createQuizSchema = z.object({
  lessonId: z.string().uuid(),
  title: z.string().trim().min(2).max(200).optional().or(z.literal("")),
  passPercent: z.coerce.number().int().min(1).max(100),
});
export type CreateQuizValues = z.infer<typeof createQuizSchema>;

const optionSchema = z.object({
  text: z.string().trim().min(1, "Required"),
  isCorrect: z.boolean(),
});

export const createQuizQuestionSchema = z
  .object({
    quizId: z.string().uuid(),
    questionText: z.string().trim().min(3, "Question is too short").max(500),
    options: z.array(optionSchema).length(4, "Exactly 4 options are required"),
  })
  .refine((data) => data.options.filter((o) => o.isCorrect).length === 1, {
    message: "Mark exactly one option as correct",
    path: ["options"],
  });
export type CreateQuizQuestionValues = z.infer<typeof createQuizQuestionSchema>;

export const submitQuizSchema = z.object({
  quizId: z.string().uuid(),
  answers: z.record(z.string().uuid(), z.string().uuid()),
});
export type SubmitQuizValues = z.infer<typeof submitQuizSchema>;
