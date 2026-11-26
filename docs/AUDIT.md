# V2 Classes Website — Audit & Stabilization Report

**Date**: 2026-11-26  
**Repository**: https://github.com/itisgauranshaggarwal/v2-classes  
**Project root**: `v2-classes-official-website-main`

## 1. Executive Summary

The project is a TanStack Start + React 19 + TypeScript + Tailwind v4 website for V2 Classes. The approved UI was preserved. The primary issues were Lovable-specific tooling/dependencies, demo-only admin/content persistence, and missing professional local-dev/documentation files. This pass creates a Git backup, removes Lovable runtime/build dependencies, standardizes npm local development, and documents Cloudflare/Supabase next steps.

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

## 6. Future Supabase Integration Plan

1. **Schema design**: map existing types (`SiteContent`, `FacultyMember`, `Achievement`, `TimelineItem`, `Enquiry`, `MediaItem`) to Postgres tables; preserve IDs/slugs/status fields where possible.
2. **Auth/RBAC**: Supabase Auth for admins; admin role table/claims; remove demo sessionStorage login.
3. **RLS**: public read for published content; admin-only write policies; enquiry insert policy for public form with rate limiting/server validation.
4. **Storage**: bucket for faculty/alumni/media/walkthrough assets; store URLs/paths in DB; remove data URL persistence.
5. **Content store migration**: replace localStorage load/save in `src/lib/content/store.tsx` with Supabase queries/mutations; keep `useContent()` API stable for UI.
6. **Admin UX**: add real loading/error states, optimistic updates where safe, and audit timestamps.
7. **Contact flow**: server-side enquiry submission, spam protection, notification email, admin enquiry management backed by DB.

## 7. Verification Status (to be updated after execution)

Verification commands will be run after dependency install and cleanup. Results should be recorded here as passed/failed/not run with notes.
