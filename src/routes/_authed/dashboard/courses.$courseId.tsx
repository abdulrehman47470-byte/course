import { useEffect, useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import {
  CheckCircle2,
  ChevronLeft,
  CircleCheck,
  Lock,
  Loader2,
  PartyPopper,
  PlayCircle,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  getCourseProgress,
  getQuizQuestions,
  markLessonComplete,
  submitQuizAttempt,
  type CourseProgressResult,
  type LessonWithStatus,
  type QuizQuestionForStudent,
} from "@/lib/courses/server-fns";

export const Route = createFileRoute("/_authed/dashboard/courses/$courseId")({
  loader: ({ params }) => getCourseProgress({ data: { courseId: params.courseId } }),
  component: CoursePlayerPage,
});

function embedUrlFor(url: string): { type: "youtube" | "vimeo" | "video"; src: string } {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  if (yt) return { type: "youtube", src: `https://www.youtube.com/embed/${yt[1]}` };
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return { type: "vimeo", src: `https://player.vimeo.com/video/${vimeo[1]}` };
  return { type: "video", src: url };
}

function VideoPanel({
  lesson,
  onCompleted,
}: {
  lesson: LessonWithStatus;
  onCompleted: () => void;
}) {
  const [marking, setMarking] = useState(false);
  const embed = embedUrlFor(lesson.video_url);

  async function markComplete() {
    setMarking(true);
    try {
      await markLessonComplete({ data: { lessonId: lesson.id } });
      onCompleted();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save your progress.");
    } finally {
      setMarking(false);
    }
  }

  return (
    <div>
      <div className="aspect-video overflow-hidden rounded-xl border border-border bg-black">
        {embed.type === "video" ? (
          <video
            src={embed.src}
            controls
            className="size-full"
            onEnded={lesson.videoCompleted ? undefined : markComplete}
          />
        ) : (
          <iframe
            src={embed.src}
            title={lesson.title}
            className="size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-[13px] text-muted-foreground">
          {lesson.videoCompleted
            ? "You've completed this video."
            : "Watch the full video, then mark it complete to continue."}
        </p>
        {!lesson.videoCompleted && (
          <button
            onClick={markComplete}
            disabled={marking}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {marking && <Loader2 className="size-4 animate-spin" />}
            Mark video as watched
          </button>
        )}
      </div>
    </div>
  );
}

function QuizPanel({ lesson, onPassed }: { lesson: LessonWithStatus; onPassed: () => void }) {
  const [questions, setQuestions] = useState<QuizQuestionForStudent[] | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ scorePercent: number; passed: boolean } | null>(null);

  useEffect(() => {
    setQuestions(null);
    setAnswers({});
    setResult(null);
    getQuizQuestions({ data: { lessonId: lesson.id } })
      .then(setQuestions)
      .catch((e) => toast.error(e instanceof Error ? e.message : "Could not load the quiz."));
  }, [lesson.id]);

  async function onSubmit() {
    if (!questions || Object.keys(answers).length < questions.length) {
      toast.error("Answer every question before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitQuizAttempt({ data: { quizId: lesson.quiz!.id, answers } });
      setResult(res);
      if (res.passed) onPassed();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not submit the quiz.");
    } finally {
      setSubmitting(false);
    }
  }

  function retry() {
    setResult(null);
    setAnswers({});
  }

  if (!questions) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (result) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center shadow-card">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-accent">
          {result.passed ? (
            <CheckCircle2 className="size-7 text-primary" />
          ) : (
            <Loader2 className="size-7 text-muted-foreground" />
          )}
        </span>
        <p className="mt-4 text-[16px] font-bold">
          {result.passed ? "You passed!" : "Not quite — try again"}
        </p>
        <p className="mt-1.5 text-[13px] text-muted-foreground">
          Score: {result.scorePercent}% (needs {lesson.quiz!.pass_percent}% to pass)
        </p>
        {!result.passed && (
          <button
            onClick={retry}
            className="mt-5 rounded-md bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Retake quiz
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {questions.map((q, i) => (
        <div key={q.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
          <p className="text-[13.5px] font-semibold">
            {i + 1}. {q.text}
          </p>
          <div className="mt-3 space-y-2">
            {q.options.map((o) => (
              <label
                key={o.id}
                className="flex cursor-pointer items-center gap-2.5 rounded-md border border-border px-3.5 py-2.5 text-[13px] transition-colors has-[:checked]:border-primary has-[:checked]:bg-accent"
              >
                <input
                  type="radio"
                  name={q.id}
                  value={o.id}
                  checked={answers[q.id] === o.id}
                  onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: o.id }))}
                  className="size-4 accent-primary"
                />
                {o.text}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={onSubmit}
        disabled={submitting}
        className="flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {submitting && <Loader2 className="size-4 animate-spin" />}
        Submit quiz
      </button>
    </div>
  );
}

function CoursePlayerPage() {
  const data = Route.useLoaderData();
  const router = useRouter();
  const [activeLessonId, setActiveLessonId] = useState<string | null>(
    data.currentLessonId ?? data.lessons[0]?.id ?? null,
  );

  const activeLesson = data.lessons.find((l) => l.id === activeLessonId) ?? null;
  const stage: "video" | "quiz" | "done" = !activeLesson
    ? "done"
    : !activeLesson.videoCompleted
      ? "video"
      : activeLesson.quiz && !activeLesson.quizPassed
        ? "quiz"
        : "done";

  function refresh() {
    router.invalidate();
  }

  return (
    <DashboardShell title={data.course.title}>
      <Link
        to="/dashboard/courses"
        className="mb-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> Back to My Courses
      </Link>

      {data.courseCompleted ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center shadow-card">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-accent">
            <PartyPopper className="size-8 text-primary" />
          </span>
          <p className="mt-4 text-[18px] font-bold">Course complete!</p>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            You've finished every video and quiz in {data.course.title}.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <div className="space-y-1.5">
            {data.lessons.map((lesson, i) => {
              const isDone = lesson.videoCompleted && (!lesson.quiz || lesson.quizPassed);
              const clickable = lesson.unlocked;
              return (
                <button
                  key={lesson.id}
                  onClick={() => clickable && setActiveLessonId(lesson.id)}
                  disabled={!clickable}
                  className={`flex w-full items-center gap-2.5 rounded-lg border px-3.5 py-3 text-left text-[12.5px] transition-colors ${
                    activeLessonId === lesson.id
                      ? "border-primary bg-accent"
                      : "border-border bg-card hover:bg-secondary"
                  } ${!clickable ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  {isDone ? (
                    <CircleCheck className="size-4 shrink-0 text-primary" />
                  ) : clickable ? (
                    <PlayCircle className="size-4 shrink-0 text-foreground/60" />
                  ) : (
                    <Lock className="size-3.5 shrink-0 text-muted-foreground" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">
                      {i + 1}. {lesson.title}
                    </span>
                    {lesson.quiz && (
                      <span className="text-[10.5px] text-muted-foreground">+ quiz</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div>
            {stage === "video" && activeLesson && (
              <VideoPanel lesson={activeLesson} onCompleted={refresh} />
            )}
            {stage === "quiz" && activeLesson && (
              <QuizPanel lesson={activeLesson} onPassed={refresh} />
            )}
            {stage === "done" && activeLesson && (
              <div className="rounded-xl border border-border bg-card p-8 text-center shadow-card">
                <CheckCircle2 className="mx-auto size-8 text-primary" />
                <p className="mt-3 text-[14px] font-semibold">Lesson complete</p>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Pick the next lesson from the list to continue.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
