-- profiles never stored email (it lives in auth.users) but the admin UI
-- needs a way to identify "who is this student" without a service-role
-- call, so mirror it onto profiles at signup time.
alter table public.profiles add column email text;

update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id and p.email is null;

create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, display_name, role, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    'student',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;
