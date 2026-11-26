# AGENTS.md — V2 Classes Website

Instructions for future OpenCode agents working in this repository.

## Project Summary

- **Project**: V2 Classes official website (Sector 13, Hisar, Haryana, India).
- **Stack**: TanStack Start + TanStack Router + React 19 + TypeScript + Vite 8 + Nitro + Tailwind CSS v4.
- **Package manager**: npm.
- **Data layer**: Supabase foundation integrated (Auth, Postgres, Storage, RLS) with local demo fallback when env vars are missing.
- **Deployment target (planned)**: Cloudflare, using a TanStack Start SSR-compatible path.

## Non-Negotiable Rules

1. **Preserve the approved UI/design**. Do not redesign, regenerate UI, or change typography/colors/layout/animations unless explicitly requested and necessary.
2. **Do not rewrite from scratch**. Make incremental, maintainable changes.
3. **Do not claim verification you did not run**. Report passed/failed/not run clearly.
4. **No secrets in git**. Never commit `.env`, `.dev.vars`, credentials, tokens, or service keys.
5. **No force-push** and no destructive git history rewrites.
6. **Supabase is integrated but requires setup**. Migrations in `supabase/migrations/` must be applied; admin users must be added to `public.admin_users`. Do not claim production-ready until verified.
7. **Preserve RLS and auth boundaries**. Public users can read published content/submit enquiries; admin writes require Supabase Auth + `admin_users` membership.

## Key Directories

- `src/routes/` — file-based routes (`__root.tsx`, `index.tsx`, `about.tsx`, `alumni.tsx`, `contact.tsx`, `admin.tsx`).
- `src/components/site/` — public website components.
- `src/components/admin/` — admin dashboard components.
- `src/components/ui/` — shared UI primitives.
- `src/lib/content/` — content types, defaults, localStorage demo store.
- `src/lib/` — utilities, enquiry schema/submit placeholder, error handling.
- `src/assets/` — local assets/asset metadata.
- `docs/` — audit and technical documentation.

## Content Architecture

- All site content should flow through `useContent()` from `src/lib/content/store.tsx`.
- `store.tsx` is the local demo repository. Future Supabase integration should replace load/save/data operations here (or behind an equivalent abstraction) while keeping consumer APIs stable where practical.
- Missing real information should remain clearly labeled/placeholders; do not invent institute facts, alumni records, testimonials, or biographies.
- Sample alumni entries use `isSample` and must be excluded from statistics.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run format:check
```

## Verification Expectations

Before finishing meaningful changes, run relevant checks:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

If a check cannot run, report why. If UI/routes are affected, smoke test key pages: `/`, `/about`, `/alumni`, `/contact`, `/admin`.

## Supabase Integration Guidance

Supabase foundation is in place. When extending it:

- Keep schema/RLS changes in `supabase/migrations/`; do not edit applied migrations, add new ones.
- Use Supabase Auth for admin authentication; admin access is gated by `public.admin_users` and RLS.
- Keep public UI components consuming stable `useContent()` interfaces; avoid UI rewrites.
- Store media in Supabase Storage and persist metadata/URLs in DB.
- Add server-side spam protection, notifications, and stronger admin route protection before production.

## Git Rules

- Small, descriptive commits.
- No force-push.
- No history rewrite on published branches.
- Inspect `git status` and diffs before committing.
- Never commit generated secrets or local env files.
