# Contributing

Thanks for contributing to the V2 Classes website. This project prioritizes **stability, maintainability, and preserving the approved UI**.

## Development Setup

1. Use Node.js 22+ (see `.nvmrc`).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy env template if needed:
   ```bash
   cp .env.example .env
   ```
4. Start dev server:
   ```bash
   npm run dev
   ```

## Workflow

- Create a focused branch for non-trivial work.
- Keep changes small and reviewable.
- Preserve existing UI/behavior unless the task explicitly requires change.
- Do not add unnecessary dependencies.
- Do not commit secrets, `.env` files, or build artifacts.

## Code Guidelines

- **TypeScript**: keep types accurate; avoid `any` unless justified.
- **Routing**: use TanStack Start file-based routes in `src/routes/`.
- **Content**: route content through `useContent()`/content store patterns.
- **Components**: prefer small, reusable components; keep admin/public/shared boundaries clear.
- **Styling**: use existing Tailwind tokens/utilities and design patterns.
- **Accessibility**: preserve semantic HTML, labels, keyboard/focus behavior.

## Checks Before PR/Push

Run relevant checks and report results:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

For UI changes, smoke test `/`, `/about`, `/alumni`, `/contact`, `/admin`.

## Commit Messages

Use clear, descriptive commit messages, e.g.:

- `chore: remove obsolete Lovable infrastructure`
- `docs: update local development setup`
- `fix: handle empty alumni state safely`

## Security / Data

- Admin auth and storage are currently demo-only (localStorage/sessionStorage).
- Do not represent demo auth as production security.
- Future Supabase integration must include proper Auth, RLS, and server-side secret handling.
