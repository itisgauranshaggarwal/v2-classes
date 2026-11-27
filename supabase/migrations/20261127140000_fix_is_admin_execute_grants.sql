-- Fix: allow anon/authenticated to execute private.is_admin() so public RLS policies
-- that use "status = 'published' or private.is_admin()" do not fail for anon users.
-- The function is SECURITY DEFINER and only checks auth.uid() against public.admin_users;
-- it safely returns false for anonymous users.

grant execute on function private.is_admin() to anon;
grant execute on function private.is_admin() to authenticated;
