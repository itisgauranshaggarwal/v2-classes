-- Rework achievements: Featured, Name, Photo, Exam, Achievement, Extra Field
alter table public.achievements add column if not exists name text not null default '';
alter table public.achievements add column if not exists achievement text not null default '';
alter table public.achievements add column if not exists extra_field text not null default '';

update public.achievements
set name = coalesce(nullif(student_name, ''), name)
where (name = '' or name is null);

update public.achievements
set achievement = coalesce(nullif(result, ''), achievement)
where (achievement = '' or achievement is null);

alter table public.achievements drop constraint if exists achievements_category_check;
alter table public.achievements drop column if exists student_name;
alter table public.achievements drop column if exists category;
alter table public.achievements drop column if exists result;
alter table public.achievements drop column if exists institution;
alter table public.achievements drop column if exists year;
alter table public.achievements drop column if exists is_sample;
