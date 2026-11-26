-- Add an admin user to V2 Classes allowlist.
-- 1. Create the user in Supabase Dashboard > Authentication > Users.
-- 2. Copy the user's UUID and email.
-- 3. Replace the placeholders below.
-- 4. Run this in Supabase SQL Editor.

insert into public.admin_users (user_id, email)
values (
  'bd9b3912-4c21-412e-a0ef-1dd214b2ba98',
  'itisgauranshaggarwal@gmail.com'
)
on conflict (user_id) do update
set email = excluded.email;
