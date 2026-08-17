-- Account activation: set once an admin approves a payment submission.
-- null = not yet activated. Gates the entire /dashboard/* route group
-- (src/routes/_authed/dashboard.tsx) for non-admin users.
alter table public.profiles add column activated_at timestamptz;

-- Atomic payment review: one transaction updates the submission, activates
-- the student's account, and auto-enrolls them in every published course
-- (there's no per-course purchase flow yet — one payment unlocks the
-- catalog). security definer + the is_admin() check inside means this is
-- safe to call through the request-scoped client, same pattern as the
-- other admin server functions.
create or replace function public.admin_review_payment(
  p_submission_id uuid,
  p_decision public.payment_submission_status,
  p_notes text default null
) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_student_id uuid;
begin
  if not public.is_admin() then
    raise exception 'Only admins can review payments';
  end if;
  if p_decision not in ('approved', 'rejected') then
    raise exception 'Invalid decision';
  end if;

  update public.payment_submissions
  set status = p_decision,
      reviewed_at = now(),
      reviewed_by = auth.uid(),
      notes = p_notes
  where id = p_submission_id
  returning student_id into v_student_id;

  if v_student_id is null then
    raise exception 'Payment submission not found';
  end if;

  if p_decision = 'approved' then
    update public.profiles
    set activated_at = coalesce(activated_at, now())
    where id = v_student_id;

    insert into public.enrollments (student_id, course_id)
    select v_student_id, c.id
    from public.courses c
    where c.status = 'published'
    on conflict (student_id, course_id) do nothing;
  end if;
end;
$$;

grant execute on function public.admin_review_payment(uuid, public.payment_submission_status, text)
  to authenticated;

-- Job listings and scholarships: admin-managed, visible to activated
-- students (or admins) only.
create table public.job_listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  location text,
  remote_type text not null default 'onsite',
  skills text[] not null default '{}',
  apply_url text,
  source text,
  application_deadline date,
  posted_at timestamptz not null default now(),
  created_by uuid references public.profiles(id)
);

create table public.scholarships (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization text not null,
  country text,
  degree_level text,
  eligibility text,
  funding_details text,
  application_requirements text,
  application_url text,
  opens_at date,
  closes_at date,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id)
);

alter table public.job_listings enable row level security;
alter table public.scholarships enable row level security;

create policy "job_listings_select_activated" on public.job_listings
  for select using (
    public.is_admin()
    or exists (select 1 from public.profiles where id = auth.uid() and activated_at is not null)
  );
create policy "job_listings_admin_insert" on public.job_listings
  for insert with check (public.is_admin());
create policy "job_listings_admin_update" on public.job_listings
  for update using (public.is_admin());
create policy "job_listings_admin_delete" on public.job_listings
  for delete using (public.is_admin());

create policy "scholarships_select_activated" on public.scholarships
  for select using (
    public.is_admin()
    or exists (select 1 from public.profiles where id = auth.uid() and activated_at is not null)
  );
create policy "scholarships_admin_insert" on public.scholarships
  for insert with check (public.is_admin());
create policy "scholarships_admin_update" on public.scholarships
  for update using (public.is_admin());
create policy "scholarships_admin_delete" on public.scholarships
  for delete using (public.is_admin());
