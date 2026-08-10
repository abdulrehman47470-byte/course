-- Profiles: extends auth.users with app-specific fields + role.
create type public.user_role as enum ('student', 'instructor', 'admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'student',
  display_name text not null,
  avatar_url text,
  headline text,
  bio text,
  phone text,
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile row the instant a new auth.users row appears
-- (fires right after Supabase Auth signup, before email verification).
create function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    'student'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for any auth.users rows that predate this migration
-- (e.g. someone signed up before the schema existed). The earliest such
-- user becomes the platform's first admin so there's a way in without a
-- second manual SQL step; everyone else backfills as a student.
insert into public.profiles (id, display_name, role)
select
  u.id,
  coalesce(u.raw_user_meta_data ->> 'display_name', split_part(u.email, '@', 1)),
  case when row_number() over (order by u.created_at) = 1 then 'admin'::public.user_role
       else 'student'::public.user_role end
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);
