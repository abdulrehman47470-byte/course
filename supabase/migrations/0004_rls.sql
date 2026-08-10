alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.contact_messages enable row level security;
alter table public.newsletter_subscribers enable row level security;

create function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- profiles: a user can read/update their own row; admins can read/update all.
-- The `with check` clause on the non-admin branch freezes `role` so a
-- student can't self-promote via a raw client-side update — actual role
-- changes go through an admin-only server function (Phase 6).
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id or public.is_admin())
  with check (
    (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()))
    or public.is_admin()
  );

create policy "profiles_insert_self" on public.profiles
  for insert with check (auth.uid() = id);

-- courses: published rows are publicly readable; owner/admin can write.
create policy "courses_select_published_or_owner" on public.courses
  for select using (status = 'published' or instructor_id = auth.uid() or public.is_admin());

create policy "courses_admin_write" on public.courses
  for insert with check (public.is_admin());
create policy "courses_admin_update" on public.courses
  for update using (public.is_admin() or instructor_id = auth.uid());
create policy "courses_admin_delete" on public.courses
  for delete using (public.is_admin());

-- enrollments: a student sees only their own; writes are admin/service-role
-- only (Phase 3's payment webhook uses the service-role key, which bypasses
-- RLS entirely — this policy just blocks students from self-enrolling for
-- free by inserting a row directly).
create policy "enrollments_select_own" on public.enrollments
  for select using (student_id = auth.uid() or public.is_admin());
create policy "enrollments_admin_write" on public.enrollments
  for insert with check (public.is_admin());
create policy "enrollments_admin_update" on public.enrollments
  for update using (public.is_admin());

-- contact_messages / newsletter_subscribers: insert-only from anyone,
-- readable only by admins.
create policy "contact_insert_anyone" on public.contact_messages
  for insert with check (true);
create policy "contact_select_admin" on public.contact_messages
  for select using (public.is_admin());

create policy "newsletter_insert_anyone" on public.newsletter_subscribers
  for insert with check (true);
create policy "newsletter_select_admin" on public.newsletter_subscribers
  for select using (public.is_admin());
