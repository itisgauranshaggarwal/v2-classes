-- Supabase Storage bucket for media uploads
-- Public read, admin-only write.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Allow public read access to media bucket objects
drop policy if exists "Public can read media bucket" on storage.objects;
create policy "Public can read media bucket"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'media');

-- Allow admins to upload media
drop policy if exists "Admins can upload media" on storage.objects;
create policy "Admins can upload media"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'media' and private.is_admin());

-- Allow admins to update media
drop policy if exists "Admins can update media objects" on storage.objects;
create policy "Admins can update media objects"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'media' and private.is_admin())
  with check (bucket_id = 'media' and private.is_admin());

-- Allow admins to delete media
drop policy if exists "Admins can delete media objects" on storage.objects;
create policy "Admins can delete media objects"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'media' and private.is_admin());
