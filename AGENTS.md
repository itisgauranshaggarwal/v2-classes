# AGENTS.md — V2 Classes Website

Instructions for future OpenCode agents working in this repository.

## Project Summary

- **Project**: V2 Classes official website (Sector 13, Hisar, Haryana, India).
- **Stack**: TanStack Start + TanStack Router + React 19 + TypeScript + Vite 8 + Nitro + Tailwind CSS v4.
- **Package manager**: npm.
- **Current data layer**: localStorage demo content store (no Supabase integration yet).
- **Deployment target (planned)**: Cloudflare, using a TanStack Start SSR-compatible path.

## Non-Negotiable Rules

1. **Preserve the approved UI/design**. Do not redesign, regenerate UI, or change typography/colors/layout/animations unless explicitly requested and necessary.
2. **Do not rewrite from scratch**. Make incremental, maintainable changes.
3. **Do not claim verification you did not run**. Report passed/failed/not run clearly.
4. **No secrets in git**. Never commit `.env`, `.dev.vars`, credentials, tokens, or service keys.
5. **No force-push** and no destructive git history rewrites.
6. **Supabase is not implemented yet**. Do not add fake production auth/db behavior; document and prepare interfaces instead.
7. **Admin auth is currently demo-only**. Do not present it as secure production authentication.

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

## Supabase Future Integration Guidance

When implementing Supabase later (separate phase):

- Use Supabase Auth for real admin authentication; remove demo sessionStorage login.
- Use Postgres tables aligned with existing content types in `src/lib/content/types.ts`.
- Add RLS policies for public read/published content and authenticated admin writes.
- Use Supabase Storage for media uploads; replace data URL/localStorage media handling.
- Store enquiries in DB; send notifications via secure server-side function/edge workflow.
- Keep public UI components consuming stable content interfaces; avoid UI rewrites.

## Git Rules

- Small, descriptive commits.
- No force-push.
- No history rewrite on published branches.
- Inspect `git status` and diffs before committing.
- Never commit generated secrets or local env files.
