-- Seed default content for a fresh V2 Classes Supabase project.
-- Values mirror src/lib/content/defaults.ts so the approved UI has content on first load.

insert into public.site_content (id, home, about, walkthrough, contact, social, settings)
values (
  'default',
  jsonb_build_object(
    'eyebrow', 'Welcome to V2 Classes',
    'heading', 'Building Concepts. Shaping Futures.',
    'quote', '[Varun Sir''s quote — add it from the admin dashboard]',
    'quoteAuthor', 'Varun Sir, Founder',
    'intro', 'Since 2000, V2 Classes in Sector 13, Hisar has helped students build strong concepts in mathematics and science. Focused guidance, regular testing and a disciplined classroom.',
    'heroPhoto', '/__l5e/assets-v1/f1c041b8-8571-4e0f-b4b7-7d7b029da34a/varun_portrait.jpg',
    'heroLabel', 'Founder & Educator'
  ),
  jsonb_build_object(
    'heading', 'A Legacy of Learning. A Future of Possibilities.',
    'intro', 'V2 Classes is an educational institute in Sector 13, Hisar, Haryana, guiding students since 2000.',
    'founded', '2000',
    'philosophy', '[Teaching philosophy — to be written by V2 Classes]',
    'location', 'Sector 13, Hisar, Haryana',
    'founderJourney', '[Varun Sir''s personal journey — to be provided]',
    'beginnings', '[How V2 Classes began — to be provided]',
    'growth', '[Growth and development of the institute — to be provided]',
    'values', jsonb_build_array(
      jsonb_build_object('title', 'Concepts first', 'body', '[Describe this value]'),
      jsonb_build_object('title', 'Regular evaluation', 'body', '[Describe this value]'),
      jsonb_build_object('title', 'Discipline', 'body', '[Describe this value]')
    )
  ),
  jsonb_build_object(
    'title', 'Step Inside V2 Classes.',
    'videoUrl', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'poster', '/__l5e/assets-v1/53c9f885-1a09-4f58-91b1-623a5ddecb4c/classroom_hall.jpg',
    'isPlaceholder', true,
    'caption', 'Placeholder video — the real institute walkthrough will replace this.'
  ),
  jsonb_build_object(
    'address', '50, Shopping Complex, MDR108, Sector 13, Hisar, Haryana 125005',
    'phone', '+91 98962 68600',
    'whatsapp', '919896268600',
    'email', '[email@v2classes.in]',
    'mapQuery', 'V2 Classes, Sector 13, Hisar, Haryana',
    'hours', '[Office hours]'
  ),
  jsonb_build_object(
    'instagram', '',
    'facebook', '',
    'youtube', ''
  ),
  jsonb_build_object(
    'siteName', 'V2 Classes',
    'tagline', 'Building Concepts. Shaping Futures.',
    'footerText', 'An educational institute in Sector 13, Hisar, guiding students since 2000.',
    'marqueeSpeed', 60
  )
)
on conflict (id) do nothing;

insert into public.faculty (id, name, role, focus, short_bio, long_bio, photo, sort_order, status) values
  ('f1', 'Varun Sir', 'Founder', 'Mathematics & academic guidance', 'Founder of V2 Classes. Teaches mathematics and guides students academically.', '[Detailed profile — to be provided]', '/__l5e/assets-v1/f1c041b8-8571-4e0f-b4b7-7d7b029da34a/varun_portrait.jpg', 1, 'published'),
  ('f2', 'Sunny Sir', 'Academic Systems', 'Test papers & evaluation', 'Prepares test papers and runs evaluation and the institute''s academic systems.', '[Detailed profile — to be provided]', '', 2, 'published'),
  ('f3', 'Vikas Sir', 'Student Affairs', 'Discipline & student assistance', 'Looks after discipline, invigilation and day-to-day student assistance.', '[Detailed profile — to be provided]', '', 3, 'published')
on conflict (id) do nothing;

insert into public.achievements (id, student_name, photo, exam, category, result, institution, year, featured, status, is_sample) values
  ('s1', 'Student Name', '', 'JEE Main', 'iit-jee', 'Rank / Score', 'Institution / Admission', 'Year', true, 'published', true),
  ('s2', 'Student Name', '', 'NEET', 'neet', 'Rank / Score', 'Institution / Admission', 'Year', false, 'published', true),
  ('s3', 'Student Name', '', 'Class XII Boards', 'boards', 'Rank / Score', 'Institution / Admission', 'Year', false, 'published', true),
  ('s4', 'Student Name', '', 'Olympiad', 'other', 'Rank / Score', 'Institution / Admission', 'Year', true, 'published', true),
  ('s5', 'Student Name', '', 'JEE Main', 'iit-jee', 'Rank / Score', 'Institution / Admission', 'Year', false, 'published', true),
  ('s6', 'Student Name', '', 'NEET', 'neet', 'Rank / Score', 'Institution / Admission', 'Year', false, 'published', true),
  ('s7', 'Student Name', '', 'Class XII Boards', 'boards', 'Rank / Score', 'Institution / Admission', 'Year', true, 'published', true),
  ('s8', 'Student Name', '', 'Olympiad', 'other', 'Rank / Score', 'Institution / Admission', 'Year', false, 'published', true)
on conflict (id) do nothing;

insert into public.timeline (id, year, title, description, is_placeholder, status, sort_order) values
  ('t1', '2000', 'V2 Classes is founded', 'The institute opens in Hisar.', false, 'published', 1),
  ('t2', '[Year]', '[Milestone]', '[Add milestone details from the admin dashboard]', true, 'published', 2),
  ('t3', '[Year]', '[Milestone]', '[Add milestone details from the admin dashboard]', true, 'published', 3)
on conflict (id) do nothing;

insert into public.media (id, name, url, added_at) values
  ('m1', 'Varun Sir portrait', '/__l5e/assets-v1/f1c041b8-8571-4e0f-b4b7-7d7b029da34a/varun_portrait.jpg', '2026-11-25'),
  ('m2', 'Classroom hall', '/__l5e/assets-v1/53c9f885-1a09-4f58-91b1-623a5ddecb4c/classroom_hall.jpg', '2026-11-25'),
  ('m3', 'Classroom with board', '/__l5e/assets-v1/81bb7066-6555-42ab-80d4-2b67976c457a/classroom_board.jpg', '2026-11-25')
on conflict (id) do nothing;
