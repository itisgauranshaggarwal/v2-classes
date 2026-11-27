-- Restore achievements schema after alumni simplification revert.
alter table public.achievements add column if not exists exam text not null default '';
alter table public.achievements add column if not exists category text not null default 'other';
alter table public.achievements add column if not exists result text not null default '';
alter table public.achievements add column if not exists institution text not null default '';
alter table public.achievements add column if not exists year text not null default '';
alter table public.achievements add column if not exists featured boolean not null default false;
alter table public.achievements add column if not exists is_sample boolean not null default false;

update public.achievements
set result = coalesce(nullif(rank, ''), result)
where (result = '' or result is null) and rank is not null;

update public.achievements
set institution = coalesce(nullif(institute, ''), institution)
where (institution = '' or institution is null) and institute is not null;

alter table public.achievements drop column if exists rank;
alter table public.achievements drop column if exists institute;

do $$ begin
  alter table public.achievements
    add constraint achievements_category_check check (category in ('iit-jee', 'neet', 'boards', 'other'));
exception when duplicate_object then null; end $$;
