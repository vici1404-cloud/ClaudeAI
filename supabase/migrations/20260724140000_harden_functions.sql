-- Security hardening surfaced by Supabase advisors after the auth trigger:
-- pin search_path on trigger functions (blocks schema-hijack) and revoke
-- public execute on the SECURITY DEFINER signup function so it is only
-- reachable as a trigger, never via the REST RPC surface.
alter function public.ingredients_closure_sync() set search_path = public, pg_temp;
alter function public.inventory_items_sync_ingredient() set search_path = public, pg_temp;
-- Functions grant EXECUTE to PUBLIC by default, so revoking only from
-- anon/authenticated leaves the privilege intact via PUBLIC. Revoke PUBLIC.
revoke execute on function public.handle_new_user() from public;
