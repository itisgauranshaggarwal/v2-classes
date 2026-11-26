# V2 Classes Official Website

Official website for **V2 Classes**, an educational institute in Sector 13, Hisar, Haryana, India (established 2000).

This repository is maintained with **OpenCode CLI** and standard Git workflows. The existing approved UI is preserved; changes should focus on stability, maintainability, and planned backend integration.

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (React 19, SSR)
- **Routing**: [TanStack Router](https://tanstack.com/router) file-based routes
- **Language**: TypeScript
- **Build**: Vite 8, Nitro
- **Styling**: Tailwind CSS v4, shadcn/ui-style components, Lucide icons
- **Forms/Validation**: React Hook Form, Zod
- **Testing**: Vitest, Testing Library, jsdom
- **Planned backend**: Supabase (Auth, Postgres, Storage, RLS) — not integrated yet
- **Planned deployment target**: Cloudflare (Workers-compatible TanStack Start/Nitro path; see audit)

## Project Structure

```text
.
├── docs/                    # Audit and project documentation
├── public/                  # Static public assets
├── src/
│   ├── assets/              # Local image/asset metadata used by UI
│   ├── components/
│   │   ├── admin/           # Admin dashboard editors/managers
│   │   ├── site/            # Public site components
│   │   └── ui/              # Shared UI primitives
│   ├── hooks/               # Shared React hooks
│   ├── lib/
│   │   ├── content/         # Content types, defaults, local demo store
│   │   ├── enquiries.ts     # Contact form schema/placeholder submit
│   │   ├── error-capture.ts # Server/runtime error capture helpers
│   │   └── error-page.ts    # SSR error page rendering
│   ├── routes/              # TanStack Router file routes
│   ├── test/                # Test setup and app tests
│   ├── router.tsx           # Router creation
│   ├── server.ts            # Custom SSR server entry/wrapper
│   ├── start.ts             # TanStack Start middleware/config
│   └── styles.css           # Tailwind v4 theme/tokens/global styles
├── .env.example             # Safe environment variable template
├── AGENTS.md                # Instructions for future coding agents
├── CONTRIBUTING.md          # Development workflow and conventions
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Prerequisites

- **Node.js**: 22+ (see `.nvmrc`)
- **npm**: 10+ (comes with Node)
- **Git**

## Local Development

```bash
git clone https://github.com/itisgauranshaggarwal/v2-classes.git
cd v2-classes
npm install
cp .env.example .env   # optional; no variables required for current demo
npm run dev
```

The dev server URL is printed by Vite/TanStack Start (typically `http://localhost:3000` unless configured otherwise).

## Available Commands

| Command                | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Start local development server                |
| `npm run build`        | Create production build                       |
| `npm run preview`      | Preview production build locally              |
| `npm run lint`         | Run ESLint                                    |
| `npm run format`       | Format files with Prettier                    |
| `npm run format:check` | Check Prettier formatting                     |
| `npm run typecheck`    | Run TypeScript type checking (`tsc --noEmit`) |
| `npm run test`         | Run Vitest tests once                         |
| `npm run test:watch`   | Run Vitest in watch mode                      |

## Environment Variables

The current application runs locally **without required environment variables**. `.env.example` documents current state and reserved future Supabase variables.

**Never commit** `.env`, `.dev.vars`, credentials, tokens, or service-role keys.

## Content & Admin (Current Demo State)

- All site content flows through `useContent()` in `src/lib/content/store.tsx`.
- Current persistence is **browser localStorage** (demo-only). It is not shared across devices and is not a production database.
- Admin `/admin` uses a **demo session** in `sessionStorage` and accepts any email/password. This is not production authentication.
- Contact enquiries are validated client-side and stored locally for demo/admin visibility; no server email/database delivery is configured yet.

These behaviors are intentionally documented and should be replaced by Supabase Auth/Postgres/Storage/RLS in a planned future phase.

## Deployment Notes (Cloudflare Readiness)

The project uses TanStack Start SSR with Nitro. It is **not** a static-only React site. Before deploying to Cloudflare:

1. Confirm the supported TanStack Start + Nitro/Cloudflare deployment path for the pinned versions.
2. Configure required Cloudflare adapter/plugin/wrangler settings for SSR.
3. Validate build output, runtime bindings, and environment variables.
4. Run smoke tests on preview deployment.

See `docs/AUDIT.md` for the current Cloudflare readiness assessment.

## Git Workflow

- Work on feature/fix branches when appropriate.
- Keep commits small and descriptive.
- Do not rewrite published history.
- Do not force-push.
- Do not commit secrets, `.env` files, `node_modules`, or build artifacts.

## Troubleshooting

- **Install issues**: confirm Node 22+ (`node -v`) and remove `node_modules` + rerun `npm install`.
- **Port in use**: Vite will usually pick another port; check terminal output.
- **Type/lint errors**: run `npm run typecheck` and `npm run lint` for exact locations.
- **Stale content in UI**: admin/content is localStorage-backed; use Admin Settings > Reset demo data or clear `v2-content-v1` in browser storage.
- **SSR/build issues**: inspect `vite.config.ts`, `src/server.ts`, and `src/start.ts`; avoid reintroducing Lovable-specific wrappers.

## Documentation

- [docs/AUDIT.md](docs/AUDIT.md) — codebase audit, cleanup notes, Cloudflare/Supabase readiness
- [AGENTS.md](AGENTS.md) — instructions for future OpenCode agents
- [CONTRIBUTING.md](CONTRIBUTING.md) — contribution/development guidelines
