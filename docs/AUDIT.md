# V2 Classes Website — Audit & Stabilization Report

**Date**: 2026-11-26  
**Repository**: https://github.com/itisgauranshaggarwal/v2-classes  
**Project root**: `v2-classes-official-website-main`

## 1. Executive Summary

The project is a TanStack Start + React 19 + TypeScript + Tailwind v4 website for V2 Classes. The approved UI was preserved. Lovable-specific tooling was removed, npm local development was standardized, and a Supabase foundation was integrated (Auth, Postgres schema/RLS, Storage bucket migration, content store, admin auth, enquiries). The app falls back to local demo mode when Supabase env vars are missing. Database-backed mode requires applying migrations in `supabase/migrations/` and adding an admin user to `public.admin_users`.

## 2. Architecture & Stack (Observed)

| Area             | Current state                                                                             |
| ---------------- | ----------------------------------------------------------------------------------------- |
| Framework        | TanStack Start `1.168.61`, TanStack Router `1.170.42`, React 19                           |
| Build/runtime    | Vite 8, Nitro `3.0.260603-beta`, SSR enabled                                              |
| Language         | TypeScript (strict compiler options)                                                      |
| Styling          | Tailwind CSS v4 via `@tailwindcss/vite`, design tokens in `src/styles.css`                |
| UI               | shadcn/ui-style components, Lucide icons, Sonner                                          |
| Forms/validation | React Hook Form + Zod (contact form/enquiry schema)                                       |
| State/content    | React context content store in `src/lib/content/store.tsx`, localStorage demo persistence |
| Tests            | Vitest + Testing Library + jsdom (minimal existing tests)                                 |
| Package manager  | npm (standardized during cleanup; prior repo included `bun.lock`/`bunfig.toml`)           |

## 3. Key Findings

### 3.1 Lovable Remnants (removed/replaced)

- `@lovable.dev/vite-tanstack-config` dev dependency and wrapped `vite.config.ts`.
- `src/lib/lovable-error-reporting.ts` and `__root.tsx` telemetry hook usage.
- `.lovable/project.json`.
- `bunfig.toml` Lovable package excludes and `bun.lock`.
- Lovable-managed sections/instructions in `README.md` and `AGENTS.md`.
- Lovable Cloud comment in `src/start.ts`.

### 3.2 Security / Production Readiness Concerns

- **Admin auth is demo-only**: `/admin` accepts any email/password and stores session in `sessionStorage` (`SESSION` key). No real identity, password verification, RBAC, or server-side session.
- **Content persistence is demo-only**: content/media/enquiries stored in browser `localStorage` (`v2-content-v1`). Not shared across users/devices, not backed up, no audit trail, vulnerable to quota/data loss.
- **Media uploads**: stored as data URLs in localStorage; unsuitable for production scale/security.
- **Contact form**: client-side validation exists; `submitEnquiry` is a placeholder. Enquiries are only saved locally for demo visibility. No server delivery/email/DB.
- **No RLS/database/auth backend**: expected for this phase, but must be clearly documented.

### 3.3 Codebase / Maintainability Observations

- UI and route structure are generally clear and modular.
- Content abstraction (`useContent`) is a good seam for future Supabase integration.
- `routeTree.gen.ts` is generated; should not be hand-edited.
- Some UI primitives are present but may be unused; removal should be done only with verified reference checks.
- Existing tests are minimal (routing match + alumni filtering/stats). They are useful smoke checks but not comprehensive.

### 3.4 Files Added / Updated / Removed

**Added**

- `.env.example` — safe env template (no secrets).
- `.editorconfig` — consistent editor formatting defaults.
- `.nvmrc` — Node 22.
- `CONTRIBUTING.md` — dev workflow/conventions.
- `docs/AUDIT.md` — this report.

**Updated**

- `package.json` — renamed package, npm scripts (`typecheck`, `format:check`), removed Lovable config dependency.
- `vite.config.ts` — standard TanStack Start/Tailwind/tsconfig paths/React/Nitro Vite config.
- `src/routes/__root.tsx` — removed Lovable error reporting hook.
- `src/start.ts` — removed Lovable Cloud comment; kept CSRF/error middleware.
- `.gitignore` — added env/coverage/tsbuildinfo safeguards.
- `README.md`, `AGENTS.md` — replaced Lovable workflow docs with OpenCode/local-dev/project rules.

**Removed**

- `src/lib/lovable-error-reporting.ts`
- `.lovable/`
- `bun.lock`
- `bunfig.toml`

## 4. Admin & Content System Audit

| Area            | Current behavior                                      | Risk                                                  | Future direction                                                      |
| --------------- | ----------------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------- |
| Login           | Any email/password accepted; `sessionStorage` flag    | No real auth; insecure for production                 | Supabase Auth + protected routes/server checks                        |
| Authorization   | None; client-side gate only                           | Any user can bypass by setting session/local behavior | Role-based access (`admin` role) + RLS                                |
| Content storage | localStorage JSON blob (`v2-content-v1`)              | Device-local, no multi-user, no audit/versioning      | Supabase Postgres tables mapped from `src/lib/content/types.ts`       |
| Media           | Data URLs/local URLs stored in content/media list     | Large storage, quota, no access control               | Supabase Storage buckets + metadata table                             |
| Enquiries       | Zod-validated, placeholder submit, local demo storage | No real delivery/persistence                          | DB table + server function/email notification + admin status workflow |
| Draft/publish   | `status` fields exist in types/UI                     | Not enforced by backend                               | DB constraints + RLS + server-side filtering                          |

## 5. Cloudflare Readiness Assessment

**Assessment**: _Conditionally ready; deployment config not finalized in this pass._

- The app is **SSR** (TanStack Start + Nitro). It should not be deployed as a static Vite SPA.
- Current config uses `nitro()` in `vite.config.ts` and includes Nitro 3 beta dependency. Cloudflare’s current TanStack Start guidance often uses `@cloudflare/vite-plugin` + Wrangler config; Nitro-based deployment may also be possible depending on exact TanStack Start/Nitro compatibility.
- **Before deployment**, verify the officially supported path for these exact versions:
  - TanStack Start `1.168.61` / Router `1.170.42`
  - Vite 8
  - Nitro `3.0.260603-beta`
- **Required checks before deploy**: SSR routes, server entry behavior, environment variable handling, static assets, and error handling in Cloudflare runtime.
- **Do not deploy yet** until a version-compatible Cloudflare adapter/plugin and wrangler configuration are validated.

## 6. Supabase Integration Status (2026-11-26)

**Implemented (foundation):**

- `supabase/migrations/` — initial schema/RLS + seed defaults + media storage bucket policies.
- `src/lib/supabase/` — browser client, env helpers, storage upload helper.
- `src/lib/content/store.tsx` — loads/persists content via Supabase when env vars are present; local demo fallback otherwise.
- `src/routes/admin.tsx` — Supabase Auth sign-in with `admin_users` allowlist check; demo fallback only when env vars missing.
- `src/lib/enquiries.ts` + `src/routes/contact.tsx` — public enquiry insert to Supabase; local demo fallback.
- `src/components/admin/sections.tsx` — media uploads go to Supabase Storage when configured.

**Still required before production use:**

1. Apply migrations to the Supabase project (`supabase/migrations/*`).
2. Create admin auth user(s) in Supabase Auth and insert into `public.admin_users`.
3. Verify RLS/auth flows with real credentials and anon access checks.
4. Add server-side rate limiting/spam protection and notification workflow for enquiries.
5. Add server-side route protection/middleware for admin if stronger SSR gating is needed (RLS already protects data writes).
6. Run browser smoke tests against a configured Supabase project.

## 7. Verification Status

Executed in `v2-classes-official-website-main` on 2026-11-26 after `npm install`.

| Check                   | Result                                     | Notes                                                                                                                                  |
| ----------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `npm install`           | **Passed**                                 | npm reported 513 packages added, 0 vulnerabilities. `package-lock.json` generated.                                                     |
| `npm run typecheck`     | **Passed**                                 | `tsc --noEmit` completed with no type errors.                                                                                          |
| `npm run lint`          | **Passed with warnings**                   | 0 errors, 10 pre-existing `react-refresh/only-export-components` warnings in UI/store files.                                           |
| `npm run test`          | **Passed**                                 | Vitest: 2 files passed, 4 tests passed.                                                                                                |
| `npm run build`         | **Passed**                                 | Vite/Nitro production build completed; SSR/client outputs generated in `.output/`.                                                     |
| `npm run dev`           | **Not smoke-tested in browser automation** | Dev command not run as a persistent interactive session during this pass; build and tests passed. Manual local smoke test recommended. |
| UI smoke test (browser) | **Not run**                                | No browser automation executed in this pass. Routes/components were statically inspected and build/tests passed.                       |

## 8. Git Backup

- **Repository**: https://github.com/itisgauranshaggarwal/v2-classes
- **Backup branch**: `backup/pre-opencode-takeover`
- **Backup commit**: `f5ef6f57fa991a2200856a833b3dcf6b3ac95320` — "chore: initial project backup (pre-opencode takeover)"
- **Main branch**: pushed with cleanup commits after backup (see final report for latest hash).

## 9. Remaining Issues / Manual Actions

- **Apply Supabase migrations** in `supabase/migrations/` to the target project; create an admin auth user and add to `public.admin_users`.
- **Browser smoke test against real Supabase** not run in this pass; verify `/`, `/about`, `/alumni`, `/contact`, `/admin` after migration.
- **Cloudflare deployment config not finalized**. Validate TanStack Start/Nitro/Cloudflare-compatible deployment path for pinned versions before deploying.
- **Enquiry anti-spam/rate limiting** is minimal; add server-side protections/notifications before production.
- **Pre-existing lint warnings** in UI primitives/store exports remain (non-blocking).
