# TRAVELLINIWITHUS

Travel media brand, affiliate shop and B2B partnership site by Rodrigo & Betta.
Primary language is Italian. The repository mixes editorial pages, ecommerce flows, admin tooling and a small Express server.

## Actual Stack

- Frontend: React 19 + TypeScript + Vite 6
- Styling: Tailwind CSS 4 + brand CSS variables in `src/index.css`
- Routing: `react-router-dom` with route-level `lazy()` imports in `src/App.tsx`
- Server state: React Query with 5 minute default `staleTime`
- Global client state: Auth, Cart and Favorites contexts
- Backend: Express in `server.ts`
- Data: Firebase client SDK + Firestore
- Payments: Stripe Checkout + webhook handling in `server.ts`
- SEO: `react-helmet-async` via `src/components/SEO.tsx`
- Tests: Vitest + Playwright

## Project Truths

- TypeScript is not currently in `strict` mode. Prefer explicit typing and avoid introducing new `any`, but do not assume compiler strictness that does not exist.
- Brand colors should prefer CSS variables such as `var(--color-accent)` and `var(--color-ink)`, but the codebase already uses neutral Tailwind utilities like `text-black/70`, `bg-white` and `border-zinc-200`.
- React Query is the default choice for read-heavy page data. Raw `fetch('/api/...')` is already used for form submissions, checkout and mutation-like browser flows.
- Firebase web config is intentionally client-visible through `firebase-applet-config.json`. Never treat the public web config as a secret, and never expose admin credentials or Stripe secrets client-side.
- Most content pages use `PageLayout` + `Section` + `SEO`, but special pages can compose directly when needed.

## Editing Conventions

- Keep route components in `src/pages/` and lazy-load them from `src/App.tsx`.
- Prefer typed props via interfaces or local type aliases.
- Keep Firestore access centralized in `src/services/firebaseService.ts` unless there is a clear reason to stay close to an auth or admin flow.
- Preserve the current visual language instead of forcing a brand-new design system.
- Treat `firestore.rules`, `src/config/admin.ts` and `server.ts` as high-risk files. Change them deliberately.

## Operational Commands

```bash
npm run dev
npm run typecheck
npm run lint
npm run test
npm run build
npm run audit:ui
npm run audit:firebase
npm run audit:stripe
npm run audit:all
npm run scaffold:page -- MyPage my-route
npm run predeploy
```

## Codex Alignment

The `.claude/` directory is retained as reference material for Claude Code, but Codex uses the npm workflows above as the executable equivalents for:

- `/audit-ui` -> `npm run audit:ui`
- `/firebase-check` -> `npm run audit:firebase`
- `/stripe-flow` -> `npm run audit:stripe`
- `/new-page` -> `npm run scaffold:page -- PageName route-slug`
- `/predeploy` -> `npm run predeploy`

See `docs/AGENT_WORKFLOWS.md` for the shared mapping and caveats.
