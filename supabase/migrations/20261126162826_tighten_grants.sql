-- Tighten table grants. RLS remains the primary row-level control.
-- anon: read public content, insert enquiries only.
-- authenticated: read public content + admin writes gated by RLS.

revoke all on all tables in schema public from anon, authenticated;

-- Public read tables
grant select on table public.site_content to anon, authenticated;
grant select on table public.faculty to anon, authenticated;
grant select on table public.achievements to anon, authenticated;
grant select on table public.timeline to anon, authenticated;
grant select on table public.media to anon, authenticated;

-- Public enquiry submission
grant insert on table public.enquiries to anon, authenticated;

-- Admin-managed tables (RLS enforces admin_users membership)
grant select, insert, update, delete on table public.site_content to authenticated;
grant select, insert, update, delete on table public.faculty to authenticated;
grant select, insert, update, delete on table public.achievements to authenticated;
grant select, insert, update, delete on table public.timeline to authenticated;
grant select, insert, update, delete on table public.media to authenticated;
grant select, update, delete on table public.enquiries to authenticated;
grant select on table public.admin_users to authenticated;
