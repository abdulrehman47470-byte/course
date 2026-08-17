-- Manual bank-transfer payment flow: a verified student submits a
-- reference/transaction id, an admin reviews it, and approval is what
-- ultimately grants course access (enrollStudent, src/lib/admin/server-fns.ts)
-- — this table only records the claim, it doesn't grant access by itself.
create type public.payment_submission_status as enum ('pending', 'approved', 'rejected');

create table public.payment_submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  method text not null default 'bank_transfer',
  reference text not null,
  status public.payment_submission_status not null default 'pending',
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id),
  notes text
);

alter table public.payment_submissions enable row level security;

create policy "payment_submissions_select_own" on public.payment_submissions
  for select using (student_id = auth.uid() or public.is_admin());

create policy "payment_submissions_insert_own" on public.payment_submissions
  for insert with check (student_id = auth.uid());

create policy "payment_submissions_admin_update" on public.payment_submissions
  for update using (public.is_admin());
