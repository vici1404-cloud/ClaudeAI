-- Auto-provision a profile + free entitlement whenever a new auth user is
-- created. Server-side (SECURITY DEFINER) so it is reliable regardless of
-- the client, and so a signed-in user always has the rows the app expects.

create function handle_new_user() returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;

  insert into public.entitlements (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
