-- V2 Classes initial schema
-- Apply in Supabase SQL editor or via Supabase CLI against the project.
-- This migration creates content/admin/enquiry tables with RLS.

create extension if not exists pgcrypto;

-- Private schema for security definer helpers (not exposed via Data API).
create schema if not exists private;

-- Admin allowlist. Add rows manually in Supabase after creating auth users.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
  );
$$;

revoke all on function private.is_admin() from public;
revoke all on function private.is_admin() from anon;
revoke all on function private.is_admin() from authenticated;
grant execute on function private.is_admin() to authenticated;

create policy "Admins can read admin_users"
  on public.admin_users
  for select
  to authenticated
  using (private.is_admin() or user_id = auth.uid());

-- Singleton site content. Sections stored as JSONB to match existing UI shape.
create table if not exists public.site_content (
  id text primary key default 'default',
  home jsonb not null default '{}'::jsonb,
  about jsonb not null default '{}'::jsonb,
  walkthrough jsonb not null default '{}'::jsonb,
  contact jsonb not null default '{}'::jsonb,
  social jsonb not null default '{}'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint site_content_singleton check (id = 'default')
);

alter table public.site_content enable row level security;

create policy "Public can read site content"
  on public.site_content
  for select
  to anon, authenticated
  using (true);

create policy "Admins can insert site content"
  on public.site_content
  for insert
  to authenticated
  with check (private.is_admin());

create policy "Admins can update site content"
  on public.site_content
  for update
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

create policy "Admins can delete site content"
  on public.site_content
  for delete
  to authenticated
  using (private.is_admin());

-- Faculty members
create table if not exists public.faculty (
  id text primary key,
  name text not null default '',
  role text not null default '',
  focus text not null default '',
  short_bio text not null default '',
  long_bio text not null default '',
  photo text not null default '',
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.faculty enable row level security;

create policy "Public can read published faculty"
  on public.faculty
  for select
  to anon, authenticated
  using (status = 'published' or private.is_admin());

create policy "Admins can insert faculty"
  on public.faculty
  for insert
  to authenticated
  with check (private.is_admin());

create policy "Admins can update faculty"
  on public.faculty
  for update
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

create policy "Admins can delete faculty"
  on public.faculty
  for delete
  to authenticated
  using (private.is_admin());

-- Alumni achievements
create table if not exists public.achievements (
  id text primary key,
  student_name text not null default '',
  photo text not null default '',
  exam text not null default '',
  category text not null default 'other' check (category in ('iit-jee', 'neet', 'boards', 'other')),
  result text not null default '',
  institution text not null default '',
  year text not null default '',
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  is_sample boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.achievements enable row level security;

create policy "Public can read published achievements"
  on public.achievements
  for select
  to anon, authenticated
  using (status = 'published' or private.is_admin());

create policy "Admins can insert achievements"
  on public.achievements
  for insert
  to authenticated
  with check (private.is_admin());

create policy "Admins can update achievements"
  on public.achievements
  for update
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

create policy "Admins can delete achievements"
  on public.achievements
  for delete
  to authenticated
  using (private.is_admin());

-- Timeline milestones
create table if not exists public.timeline (
  id text primary key,
  year text not null default '',
  title text not null default '',
  description text not null default '',
  is_placeholder boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.timeline enable row level security;

create policy "Public can read published timeline"
  on public.timeline
  for select
  to anon, authenticated
  using (status = 'published' or private.is_admin());

create policy "Admins can insert timeline"
  on public.timeline
  for insert
  to authenticated
  with check (private.is_admin());

create policy "Admins can update timeline"
  on public.timeline
  for update
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

create policy "Admins can delete timeline"
  on public.timeline
  for delete
  to authenticated
  using (private.is_admin());

-- Contact enquiries. Public can submit; only admins can manage.
create table if not exists public.enquiries (
  id text primary key,
  name text not null default '',
  phone text not null default '',
  email text not null default '',
  message text not null default '',
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed'))
);

alter table public.enquiries enable row level security;

create policy "Public can submit enquiries"
  on public.enquiries
  for insert
  to anon, authenticated
  with check (
    char_length(trim(name)) between 2 and 100
    and char_length(trim(phone)) between 10 and 17
    and char_length(trim(email)) <= 255
    and char_length(trim(message)) between 10 and 1000
    and status = 'new'
  );

create policy "Admins can read enquiries"
  on public.enquiries
  for select
  to authenticated
  using (private.is_admin());

create policy "Admins can update enquiries"
  on public.enquiries
  for update
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

create policy "Admins can delete enquiries"
  on public.enquiries
  for delete
  to authenticated
  using (private.is_admin());

-- Media metadata. Files may be hosted in Supabase Storage or external URLs.
create table if not exists public.media (
  id text primary key,
  name text not null default '',
  url text not null default '',
  added_at date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.media enable row level security;

create policy "Public can read media"
  on public.media
  for select
  to anon, authenticated
  using (true);

create policy "Admins can insert media"
  on public.media
  for insert
  to authenticated
  with check (private.is_admin());

create policy "Admins can update media"
  on public.media
  for update
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

create policy "Admins can delete media"
  on public.media
  for delete
  to authenticated
  using (private.is_admin());

-- Updated-at trigger helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_site_content_updated_at on public.site_content;
create trigger set_site_content_updated_at before update on public.site_content
for each row execute function public.set_updated_at();

drop trigger if exists set_faculty_updated_at on public.faculty;
create trigger set_faculty_updated_at before update on public.faculty
for each row execute function public.set_updated_at();

drop trigger if exists set_achievements_updated_at on public.achievements;
create trigger set_achievements_updated_at before update on public.achievements
for each row execute function public.set_updated_at();

drop trigger if exists set_timeline_updated_at on public.timeline;
create trigger set_timeline_updated_at before update on public.timeline
for each row execute function public.set_updated_at();
