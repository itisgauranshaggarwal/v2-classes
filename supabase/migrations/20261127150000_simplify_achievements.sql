-- Simplify achievements: keep name, photo, institute, rank, status.
alter table public.achievements add column if not exists institute text not null default '';
alter table public.achievements add column if not exists rank text not null default '';

update public.achievements
set institute = coalesce(nullif(institution, ''), institute)
where (institute = '' or institute is null) and institution is not null;

update public.achievements
set rank = coalesce(nullif(result, ''), rank)
where (rank = '' or rank is null) and result is not null;

alter table public.achievements drop column if exists exam;
alter table public.achievements drop column if exists category;
alter table public.achievements drop column if exists result;
alter table public.achievements drop column if exists institution;
alter table public.achievements drop column if exists year;
alter table public.achievements drop column if exists featured;
alter table public.achievements drop column if exists is_sample;
