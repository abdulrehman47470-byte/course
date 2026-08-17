-- Course content: lessons (video) and their quizzes, plus per-student
-- progress. Sequential unlocking (video N -> quiz N -> video N+1 -> ...) is
-- enforced server-side in mark_lesson_complete()/submit_quiz_attempt(),
-- not just in the UI, so it can't be bypassed by calling the API directly.
-- Quiz answer keys (quiz_options.is_correct) are never exposed to students:
-- quiz_options has no student-select RLS policy at all — the only way a
-- student reads option text is get_quiz_questions(), which explicitly
-- omits is_correct from its return columns, and grading happens entirely
-- inside submit_quiz_attempt() on the server.

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  video_url text not null,
  order_index int not null,
  created_at timestamptz not null default now(),
  unique (course_id, order_index)
);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null unique references public.lessons(id) on delete cascade,
  title text not null default 'Quiz',
  pass_percent int not null default 70,
  created_at timestamptz not null default now()
);

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question_text text not null,
  order_index int not null
);

create table public.quiz_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  option_text text not null,
  is_correct boolean not null default false,
  order_index int not null
);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (student_id, lesson_id)
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  score_percent int not null,
  passed boolean not null,
  submitted_at timestamptz not null default now()
);

alter table public.lessons enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_options enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_attempts enable row level security;

create policy "lessons_select_enrolled" on public.lessons for select using (
  public.is_admin()
  or exists (select 1 from public.enrollments e where e.course_id = lessons.course_id and e.student_id = auth.uid())
);
create policy "lessons_admin_insert" on public.lessons for insert with check (public.is_admin());
create policy "lessons_admin_update" on public.lessons for update using (public.is_admin());
create policy "lessons_admin_delete" on public.lessons for delete using (public.is_admin());

create policy "quizzes_select_enrolled" on public.quizzes for select using (
  public.is_admin()
  or exists (
    select 1 from public.lessons l
    join public.enrollments e on e.course_id = l.course_id
    where l.id = quizzes.lesson_id and e.student_id = auth.uid()
  )
);
create policy "quizzes_admin_insert" on public.quizzes for insert with check (public.is_admin());
create policy "quizzes_admin_update" on public.quizzes for update using (public.is_admin());
create policy "quizzes_admin_delete" on public.quizzes for delete using (public.is_admin());

create policy "quiz_questions_select_enrolled" on public.quiz_questions for select using (
  public.is_admin()
  or exists (
    select 1 from public.quizzes q
    join public.lessons l on l.id = q.lesson_id
    join public.enrollments e on e.course_id = l.course_id
    where q.id = quiz_questions.quiz_id and e.student_id = auth.uid()
  )
);
create policy "quiz_questions_admin_insert" on public.quiz_questions for insert with check (public.is_admin());
create policy "quiz_questions_admin_update" on public.quiz_questions for update using (public.is_admin());
create policy "quiz_questions_admin_delete" on public.quiz_questions for delete using (public.is_admin());

-- Deliberately admin-only select — this is the table with the answer key.
create policy "quiz_options_select_admin" on public.quiz_options for select using (public.is_admin());
create policy "quiz_options_admin_insert" on public.quiz_options for insert with check (public.is_admin());
create policy "quiz_options_admin_update" on public.quiz_options for update using (public.is_admin());
create policy "quiz_options_admin_delete" on public.quiz_options for delete using (public.is_admin());

-- No student insert policy on purpose — the only way a row appears is
-- through mark_lesson_complete()/submit_quiz_attempt() (security definer,
-- bypasses RLS), which is where the sequential-gate/grading logic lives.
create policy "lesson_progress_select_own" on public.lesson_progress for select using (
  student_id = auth.uid() or public.is_admin()
);
create policy "quiz_attempts_select_own" on public.quiz_attempts for select using (
  student_id = auth.uid() or public.is_admin()
);

create or replace function public.recalculate_course_progress(p_student_id uuid, p_course_id uuid)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_total_steps int;
  v_done_steps int;
  v_percent int;
begin
  select count(l.id) + count(qz.id) into v_total_steps
  from public.lessons l
  left join public.quizzes qz on qz.lesson_id = l.id
  where l.course_id = p_course_id;

  if v_total_steps = 0 then
    return;
  end if;

  select
    (select count(*) from public.lesson_progress lp
       join public.lessons l on l.id = lp.lesson_id
       where lp.student_id = p_student_id and l.course_id = p_course_id)
    +
    (select count(distinct qz.id) from public.quiz_attempts qa
       join public.quizzes qz on qz.id = qa.quiz_id
       join public.lessons l on l.id = qz.lesson_id
       where qa.student_id = p_student_id and l.course_id = p_course_id and qa.passed)
  into v_done_steps;

  v_percent := least(100, round(100.0 * v_done_steps / v_total_steps));

  update public.enrollments
  set progress_percent = v_percent,
      status = case when v_percent >= 100 then 'completed'::enrollment_status else status end,
      completed_at = case when v_percent >= 100 and completed_at is null then now() else completed_at end
  where student_id = p_student_id and course_id = p_course_id;
end;
$$;

create or replace function public.mark_lesson_complete(p_lesson_id uuid)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_course_id uuid;
  v_order int;
  v_prev record;
begin
  select course_id, order_index into v_course_id, v_order
  from public.lessons where id = p_lesson_id;
  if v_course_id is null then
    raise exception 'Lesson not found';
  end if;
  if not exists (
    select 1 from public.enrollments where student_id = auth.uid() and course_id = v_course_id
  ) then
    raise exception 'Not enrolled in this course';
  end if;

  select l.id as lesson_id, q.id as quiz_id into v_prev
  from public.lessons l
  left join public.quizzes q on q.lesson_id = l.id
  where l.course_id = v_course_id and l.order_index = v_order - 1;

  if v_prev.lesson_id is not null then
    if not exists (
      select 1 from public.lesson_progress
      where student_id = auth.uid() and lesson_id = v_prev.lesson_id
    ) then
      raise exception 'Complete the previous lesson first';
    end if;
    if v_prev.quiz_id is not null and not exists (
      select 1 from public.quiz_attempts
      where student_id = auth.uid() and quiz_id = v_prev.quiz_id and passed
    ) then
      raise exception 'Pass the previous quiz first';
    end if;
  end if;

  insert into public.lesson_progress (student_id, lesson_id)
  values (auth.uid(), p_lesson_id)
  on conflict (student_id, lesson_id) do nothing;

  perform public.recalculate_course_progress(auth.uid(), v_course_id);
end;
$$;

create or replace function public.get_quiz_questions(p_lesson_id uuid)
returns table (
  question_id uuid,
  question_text text,
  question_order int,
  option_id uuid,
  option_text text,
  option_order int
)
language plpgsql security definer set search_path = public as $$
declare
  v_course_id uuid;
begin
  select course_id into v_course_id from public.lessons where id = p_lesson_id;
  if v_course_id is null then
    raise exception 'Lesson not found';
  end if;
  if not public.is_admin() and not exists (
    select 1 from public.enrollments where student_id = auth.uid() and course_id = v_course_id
  ) then
    raise exception 'Not enrolled in this course';
  end if;

  return query
    select q.id, q.question_text, q.order_index, o.id, o.option_text, o.order_index
    from public.quiz_questions q
    join public.quiz_options o on o.question_id = q.id
    where q.quiz_id = (select id from public.quizzes where lesson_id = p_lesson_id)
    order by q.order_index, o.order_index;
end;
$$;

create or replace function public.submit_quiz_attempt(p_quiz_id uuid, p_answers jsonb)
returns table (score_percent int, passed boolean)
language plpgsql security definer set search_path = public as $$
declare
  v_lesson_id uuid;
  v_course_id uuid;
  v_pass_percent int;
  v_total int;
  v_correct int := 0;
  v_answer record;
  v_score int;
  v_passed boolean;
begin
  select lesson_id, pass_percent into v_lesson_id, v_pass_percent
  from public.quizzes where id = p_quiz_id;
  if v_lesson_id is null then
    raise exception 'Quiz not found';
  end if;
  select course_id into v_course_id from public.lessons where id = v_lesson_id;

  if not exists (
    select 1 from public.enrollments where student_id = auth.uid() and course_id = v_course_id
  ) then
    raise exception 'Not enrolled in this course';
  end if;
  if not exists (
    select 1 from public.lesson_progress where student_id = auth.uid() and lesson_id = v_lesson_id
  ) then
    raise exception 'Watch the video before taking the quiz';
  end if;

  select count(*) into v_total from public.quiz_questions where quiz_id = p_quiz_id;
  if v_total = 0 then
    raise exception 'This quiz has no questions yet';
  end if;

  for v_answer in select * from jsonb_each_text(p_answers) as a(question_id, option_id)
  loop
    if exists (
      select 1 from public.quiz_options
      where id = v_answer.option_id::uuid
        and question_id = v_answer.question_id::uuid
        and is_correct = true
    ) then
      v_correct := v_correct + 1;
    end if;
  end loop;

  v_score := round(100.0 * v_correct / v_total);
  v_passed := v_score >= v_pass_percent;

  insert into public.quiz_attempts (student_id, quiz_id, score_percent, passed)
  values (auth.uid(), p_quiz_id, v_score, v_passed);

  if v_passed then
    perform public.recalculate_course_progress(auth.uid(), v_course_id);
  end if;

  return query select v_score, v_passed;
end;
$$;

grant execute on function public.mark_lesson_complete(uuid) to authenticated;
grant execute on function public.get_quiz_questions(uuid) to authenticated;
grant execute on function public.submit_quiz_attempt(uuid, jsonb) to authenticated;
