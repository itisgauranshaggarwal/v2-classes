# V2 Classes Website

Official website and content management system for **V2 Classes**, an educational institute in Sector 13, Hisar, Haryana, India.

Built with **TanStack Start + React 19 + TypeScript + Tailwind CSS v4 + Supabase**.

> The approved UI is preserved. This repo is intended for maintainable local development, Supabase-backed content management, and SSR deployment.

## Features

- **Public website**: Home, About, Alumni, Contact pages with responsive UI.
- **Admin panel** (`/admin`): manage site content, faculty, achievements, timeline, walkthrough, contact/social info, media, and enquiries.
- **Supabase backend**: Auth, Postgres, Storage, and RLS policies.
- **Demo fallback**: if Supabase env vars are missing, the app falls back to local browser demo storage for development.
- **SSR-ready**: TanStack Start + Nitro/Vite build (not a static SPA).

## Tech Stack

| Layer      | Tech                                                             |
| ---------- | ---------------------------------------------------------------- |
| Framework  | [TanStack Start](https://tanstack.com/start) (React 19, SSR)     |
| Routing    | [TanStack Router](https://tanstack.com/router) (file-based)      |
| Language   | TypeScript                                                       |
| Styling    | Tailwind CSS v4, shadcn/ui-style components, Lucide icons        |
| Backend    | [Supabase](https://supabase.com/) (Auth, Postgres, Storage, RLS) |
| Validation | Zod, React Hook Form                                             |
| Build      | Vite 8, Nitro                                                    |
| Testing    | Vitest, Testing Library, jsdom                                   |

## Project Structure

```text
.
├── docs/                    # Audit and technical notes
├── public/                  # Static public assets
├── src/
│   ├── assets/              # Local assets/metadata
│   ├── components/
│   │   ├── admin/           # Admin dashboard UI/editors
│   │   ├── site/            # Public website components
│   │   └── ui/              # Shared UI primitives
│   ├── lib/
│   │   ├── content/         # Content types/defaults/store
│   │   ├── supabase/        # Supabase client/env/storage helpers
│   │   └── enquiries.ts     # Contact form schema/submission
│   ├── routes/              # TanStack Router file routes
│   └── test/                # Tests
├── supabase/
│   ├── migrations/          # SQL migrations (schema, RLS, seed, storage, grants)
│   └── setup-admin.sql      # Template for adding an admin user
├── .env.example
├── package.json
└── vite.config.ts
```

## Prerequisites

- **Node.js 22+** (see `.nvmrc`)
- **npm 10+**
- **Git**
- A **Supabase** project (for database-backed mode)

## Local Setup

### 1. Clone and install

```bash
git clone https://github.com/itisgauranshaggarwal/v2-classes.git
cd v2-classes
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Set values in `.env`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-anon-key
VITE_SITE_URL=https://your-production-domain.com
```

Get these from **Supabase Dashboard > Project Settings > API**.

> Never commit `.env` or service-role keys. Only `VITE_` publishable values belong in frontend env.

### 3. Set up Supabase

Run SQL migrations in **Supabase Dashboard > SQL Editor** in order:

1. `supabase/migrations/20261126114649_init.sql`
2. `supabase/migrations/20261126114739_seed_defaults.sql`
3. `supabase/migrations/20261126115616_storage_bucket.sql`
4. `supabase/migrations/20261126162756_enquiry_contact_optional.sql`
5. `supabase/migrations/20261126162826_tighten_grants.sql`

Or use Supabase CLI if your project is linked.

### 4. Create an admin user

1. **Supabase Dashboard > Authentication > Users > Add user** (email + password).
2. Copy the user UUID.
3. Run `supabase/setup-admin.sql` in SQL Editor with your UUID/email:

```sql
insert into public.admin_users (user_id, email)
values ('AUTH_USER_UUID', 'admin@example.com')
on conflict (user_id) do update
set email = excluded.email;
```

### 5. Start development server

```bash
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:3000`).

## Available Commands

| Command                | Purpose                           |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Start local dev server            |
| `npm run build`        | Create production build           |
| `npm run preview`      | Preview production build locally  |
| `npm run lint`         | Run ESLint                        |
| `npm run typecheck`    | TypeScript check (`tsc --noEmit`) |
| `npm run test`         | Run tests once                    |
| `npm run test:watch`   | Run tests in watch mode           |
| `npm run format`       | Format with Prettier              |
| `npm run format:check` | Check formatting                  |

## Admin Panel

- URL: `/admin`
- Sign in with a Supabase Auth user that exists in `public.admin_users`.
- Manage: home/about content, faculty, achievements, timeline, walkthrough video, contact/social settings, media, enquiries.
- Media uploads go to Supabase Storage when Supabase is configured.

## Deployment (Cloudflare / SSR)

This project is **SSR**, not a static SPA. Deploy it using a TanStack Start-compatible SSR path.

### Before deploy

1. Confirm the correct deployment path for the pinned versions:
   - TanStack Start `1.168.x`
   - Vite `8.x`
   - Nitro `3.0.260603-beta`
2. Add required Cloudflare/Wrangler/adapter configuration for SSR.
3. Set environment variables in your hosting provider:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SITE_URL` (your real production domain, used for canonical/OG/sitemap URLs)
4. Ensure Supabase migrations are applied and admin user is configured.

### Deploy checklist

- [ ] Build passes locally (`npm run build`)
- [ ] Env vars set in hosting
- [ ] Supabase migrations applied
- [ ] Admin user added to `public.admin_users`
- [ ] Preview deploy smoke test: `/`, `/about`, `/alumni`, `/contact`, `/admin`
- [ ] Contact form submits enquiry
- [ ] Admin can edit/save content
- [ ] Media upload works

### Useful references

- [TanStack Start Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Supabase Docs](https://supabase.com/docs)

## Handoff / Ownership Checklist

When handing the project to someone else, provide access to:

- **GitHub repo** (code)
- **Supabase project/org** (Auth, DB, Storage, logs, billing)
- **Hosting/Cloudflare project** (deploys, env vars, domain/DNS)
- **Domain registrar/DNS**
- **Admin website login** (Supabase Auth user + `admin_users` row)

Share secrets securely via a password manager. Never commit `.env`, service-role keys, or tokens.

## Troubleshooting

- **Still in demo mode**: check `.env` exists, has correct `VITE_*` keys, and restart `npm run dev`.
- **Admin login fails**: confirm user exists in Supabase Auth and in `public.admin_users`.
- **Saves not persisting**: check browser Network/Console for Supabase errors; confirm migrations and RLS/grants applied.
- **404 images**: placeholder Lovable-hosted asset URLs may remain until replaced with real assets via admin.
- **SSR deploy issues**: verify Cloudflare/Nitro/TanStack Start compatibility for pinned versions.

## Documentation

- [docs/AUDIT.md](docs/AUDIT.md) - audit and technical notes
- [AGENTS.md](AGENTS.md) - agent/developer guidance
- [CONTRIBUTING.md](CONTRIBUTING.md) - contribution workflow
