import { useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ChevronLeft, Loader2, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  createLesson,
  createQuiz,
  createQuizQuestion,
  deleteLesson,
  deleteQuizQuestion,
  getQuizAdmin,
  listLessonsAdmin,
  type LessonAdminRow,
  type QuizQuestionAdminRow,
} from "@/lib/admin/server-fns";
import { listAllCourses } from "@/lib/admin/server-fns";
import {
  createLessonSchema,
  createQuizQuestionSchema,
  createQuizSchema,
  type CreateLessonValues,
  type CreateQuizQuestionValues,
  type CreateQuizValues,
} from "@/lib/courses/schemas";

export const Route = createFileRoute("/_authed-admin/admin/courses/$courseId")({
  loader: async ({ params }) => {
    const [lessons, courses] = await Promise.all([
      listLessonsAdmin({ data: { courseId: params.courseId } }),
      listAllCourses(),
    ]);
    const course = courses.find((c) => c.id === params.courseId);
    return { lessons, course };
  },
  component: AdminCourseContentPage,
});

const inputClass =
  "mt-1.5 w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-[13px] outline-none placeholder:text-muted-foreground focus:border-primary";
const labelClass = "text-[12px] font-semibold text-foreground/80";

function NewLessonForm({ courseId, onDone }: { courseId: string; onDone: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateLessonValues>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: { courseId },
  });

  async function onSubmit(values: CreateLessonValues) {
    try {
      await createLesson({ data: values });
      toast.success("Lesson added");
      onDone();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not add the lesson.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-5 space-y-4 rounded-xl border border-border bg-card p-6 shadow-card"
    >
      <input type="hidden" {...register("courseId")} />
      <div>
        <label className={labelClass}>Lesson title</label>
        <input className={inputClass} {...register("title")} />
        {errors.title && (
          <p className="mt-1 text-[11px] text-destructive">{errors.title.message}</p>
        )}
      </div>
      <div>
        <label className={labelClass}>Video URL</label>
        <input
          className={inputClass}
          placeholder="https://youtube.com/watch?v=... or a direct .mp4 link"
          {...register("videoUrl")}
        />
        {errors.videoUrl && (
          <p className="mt-1 text-[11px] text-destructive">{errors.videoUrl.message}</p>
        )}
      </div>
      <button
        disabled={isSubmitting}
        className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        Add lesson
      </button>
    </form>
  );
}

function NewQuizForm({ lessonId, onDone }: { lessonId: string; onDone: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateQuizValues>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: { lessonId, passPercent: 70 },
  });

  async function onSubmit(values: CreateQuizValues) {
    try {
      await createQuiz({ data: values });
      toast.success("Quiz added");
      onDone();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not add the quiz.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-3">
      <input type="hidden" {...register("lessonId")} />
      <div>
        <label className={labelClass}>Quiz title (optional)</label>
        <input className={inputClass} placeholder="Quiz" {...register("title")} />
      </div>
      <div>
        <label className={labelClass}>Pass %</label>
        <input type="number" className={`${inputClass} w-24`} {...register("passPercent")} />
      </div>
      <button
        disabled={isSubmitting}
        className="flex h-[42px] items-center gap-2 rounded-md bg-primary px-4 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        Add quiz
      </button>
    </form>
  );
}

function NewQuestionForm({ quizId, onDone }: { quizId: string; onDone: () => void }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateQuizQuestionValues>({
    resolver: zodResolver(createQuizQuestionSchema),
    defaultValues: {
      quizId,
      questionText: "",
      options: [
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  });
  const correctIndex = watch("options").findIndex((o) => o.isCorrect);

  async function onSubmit(values: CreateQuizQuestionValues) {
    try {
      await createQuizQuestion({ data: values });
      toast.success("Question added");
      onDone();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not add the question.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-3 space-y-3 rounded-lg border border-border bg-background p-4"
    >
      <input type="hidden" {...register("quizId")} />
      <div>
        <label className={labelClass}>Question</label>
        <input className={inputClass} {...register("questionText")} />
        {errors.questionText && (
          <p className="mt-1 text-[11px] text-destructive">{errors.questionText.message}</p>
        )}
      </div>
      <div className="space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2.5">
            <input
              type="radio"
              name="correct-option"
              checked={correctIndex === i}
              onChange={() => {
                for (let j = 0; j < 4; j++) setValue(`options.${j}.isCorrect`, j === i);
              }}
              className="size-4 accent-primary"
              aria-label={`Mark option ${i + 1} as correct`}
            />
            <input
              className={`${inputClass} mt-0 flex-1`}
              placeholder={`Option ${i + 1}`}
              {...register(`options.${i}.text`)}
            />
          </div>
        ))}
        {errors.options && (
          <p className="text-[11px] text-destructive">
            {errors.options.message ?? errors.options.root?.message}
          </p>
        )}
      </div>
      <button
        disabled={isSubmitting}
        className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[12.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        Add question
      </button>
    </form>
  );
}

function QuizManager({ lesson }: { lesson: LessonAdminRow }) {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuizQuestionAdminRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  async function loadQuestions(quizId: string) {
    setLoading(true);
    try {
      setQuestions(await getQuizAdmin({ data: { quizId } }));
    } finally {
      setLoading(false);
    }
  }

  if (!lesson.quiz) {
    return (
      <div className="mt-4 border-t border-border pt-4">
        <NewQuizForm lessonId={lesson.id} onDone={() => router.invalidate()} />
      </div>
    );
  }

  return (
    <div className="mt-4 border-t border-border pt-4">
      <div className="flex items-center justify-between">
        <p className="text-[12.5px] font-semibold">
          {lesson.quiz.title} — pass at {lesson.quiz.pass_percent}% ({lesson.quiz.questionCount}{" "}
          question{lesson.quiz.questionCount === 1 ? "" : "s"})
        </p>
        <button
          onClick={() => (questions ? setQuestions(null) : loadQuestions(lesson.quiz!.id))}
          className="text-[12px] font-semibold text-primary"
        >
          {loading ? "Loading..." : questions ? "Hide questions" : "View questions"}
        </button>
      </div>

      {questions && (
        <div className="mt-3 space-y-3">
          {questions.map((q) => (
            <div key={q.id} className="rounded-lg border border-border bg-background p-3.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[13px] font-medium">{q.question_text}</p>
                <button
                  onClick={async () => {
                    await deleteQuizQuestion({ data: { questionId: q.id } });
                    setQuestions((prev) => prev?.filter((x) => x.id !== q.id) ?? null);
                    router.invalidate();
                  }}
                  aria-label="Delete question"
                  className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
              <ul className="mt-2 space-y-1">
                {q.options.map((o) => (
                  <li
                    key={o.id}
                    className={`flex items-center gap-1.5 text-[12px] ${o.is_correct ? "font-semibold text-primary" : "text-muted-foreground"}`}
                  >
                    {o.is_correct && <CheckCircle2 className="size-3.5" />}
                    {o.option_text}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {showQuestionForm ? (
            <NewQuestionForm
              quizId={lesson.quiz.id}
              onDone={() => {
                setShowQuestionForm(false);
                loadQuestions(lesson.quiz!.id);
                router.invalidate();
              }}
            />
          ) : (
            <button
              onClick={() => setShowQuestionForm(true)}
              className="flex items-center gap-1.5 text-[12.5px] font-semibold text-primary"
            >
              <Plus className="size-3.5" /> Add question
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function AdminCourseContentPage() {
  const { lessons, course } = Route.useLoaderData();
  const params = Route.useParams();
  const router = useRouter();
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function onDeleteLesson(lessonId: string) {
    setDeletingId(lessonId);
    try {
      await deleteLesson({ data: { lessonId } });
      router.invalidate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete the lesson.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AdminShell title={course ? `Content — ${course.title}` : "Course content"}>
      <Link
        to="/admin/courses"
        className="mb-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> Back to courses
      </Link>

      <div className="mb-5 flex justify-end">
        <button
          onClick={() => setShowLessonForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {showLessonForm ? <X className="size-4" /> : <Plus className="size-4" />}
          {showLessonForm ? "Cancel" : "New lesson"}
        </button>
      </div>

      {showLessonForm && (
        <NewLessonForm
          courseId={params.courseId}
          onDone={() => {
            setShowLessonForm(false);
            router.invalidate();
          }}
        />
      )}

      <div className="space-y-3">
        {lessons.map((lesson, i) => (
          <div key={lesson.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[13px] font-bold">
                  {i + 1}. {lesson.title}
                </p>
                <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
                  {lesson.video_url}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  onClick={() =>
                    setExpandedLessonId((cur) => (cur === lesson.id ? null : lesson.id))
                  }
                  className="text-[12px] font-semibold text-primary"
                >
                  {expandedLessonId === lesson.id ? "Hide quiz" : "Manage quiz"}
                </button>
                <button
                  onClick={() => onDeleteLesson(lesson.id)}
                  disabled={deletingId === lesson.id}
                  aria-label="Delete lesson"
                  className="text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
                >
                  {deletingId === lesson.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </button>
              </div>
            </div>
            {expandedLessonId === lesson.id && <QuizManager lesson={lesson} />}
          </div>
        ))}
        {lessons.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center text-muted-foreground">
            No lessons yet — add the first one above.
          </div>
        )}
      </div>
    </AdminShell>
  );
}
