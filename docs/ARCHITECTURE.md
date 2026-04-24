---
type: reference
area: engineering
status: active
tags:
  - architecture
  - engineering
  - reference
---

# Architecture — TRAVELLINIWITHUS

Quick reference per orientarsi nel codice. Per convenzioni specifiche,
`.github/copilot-instructions.md` è la versione lunga. Per schema
dati, [`FIRESTORE_SCHEMA.md`](./FIRESTORE_SCHEMA.md). Per contratto
API, [`API_CONTRACT.md`](./API_CONTRACT.md).

## Stack

| Layer           | Tech                                                         |
| --------------- | ------------------------------------------------------------ |
| Runtime         | Node.js ≥22                                                  |
| Package manager | npm ≥10.9                                                    |
| Frontend        | React 19, TypeScript (non-strict), React Router 7            |
| Styling         | Tailwind CSS 4 + CSS variables (vedi `DESIGN.md`)            |
| State           | React Query 5 (server), Context (shallow UI state)           |
| Data layer      | Firebase/Firestore (client + admin SDK)                      |
| Payments        | Stripe Checkout Sessions + webhook                           |
| Backend         | Express 4 (SSR + API), Vite middleware in dev                |
| Build           | Vite 6 + `@tailwindcss/vite`                                 |
| Tests           | Vitest 4 (unit), Playwright (e2e)                            |
| CI              | GitHub Actions: quality, audit-agents, audit-visual          |
| Hosting         | Vercel (frontend) + Firebase (Firestore/Auth/Storage/backup) |

## Top-level layout

```
/
├── server.ts               # Express SSR + API (1746 lines, HIGH-RISK)
├── vite.config.ts          # Vite + Tailwind 4 plugin
├── tsconfig.json           # non-strict; tsconfig.node.json for server
├── firestore.rules         # custom-claim only (HIGH-RISK)
├── src/                    # React app
├── e2e/                    # Playwright specs (see e2e/README.md)
├── scripts/                # Node utility scripts (audit, scaffold, admin)
├── public/                 # static assets (sitemap, media-kit, robots)
├── docs/                   # Obsidian operational vault
├── .claude/                # Claude Code config (agents, skills, hooks)
├── .agents/                # canonical cross-tool skills
└── .github/                # workflows, CODEOWNERS, Dependabot, copilot
```

## Entry points

- **Client**: `src/main.tsx` → `StrictMode` → `ErrorBoundary` →
  `QueryClientProvider` → `HelmetProvider` → `AuthProvider` → `App`.
- **Server**: `server.ts`. Dev: Vite as middleware; prod: serve `dist/`
  static + SSR fallback. Same process per entrambi (vedi
  `createServer()`).

## Source tree (`src/`)

```
src/
├── App.tsx                 # React Router layout + lazy-loaded routes
├── main.tsx                # Provider stack + createRoot
├── index.css               # Tailwind + CSS vars root
├── firebase.ts             # firebaseApp init (re-exports from lib/)
├── types.ts                # shared TypeScript types
│
├── components/             # 52 reusable UI pieces (PageLayout, Section,
│                             Navbar, Hero, cards, consent, forms, …)
├── pages/                  # 24 route components (Home, Shop, Articolo,
│                             admin/*, legal/*, destinazioni/*, …)
├── context/                # AuthContext, CartContext, FavoritesContext
├── services/               # firebaseService (CRUD), analytics,
│                             aiVerificationService
├── lib/                    # affiliate, animations, consent, email,
│                             errorTracking (client+server), firebaseApp,
│                             firebaseAuth, firebaseDb, firebaseStorage
├── hooks/                  # useContactForm, usePagination, useShopGate,
│                             useSiteContent
├── config/                 # admin whitelist, site meta, taxonomies,
│                             siteContent defaults, demoContent
├── data/                   # seed/static data (articles, destinations,
│                             hotels, resources)
├── utils/                  # pure helpers (slugify, validators,
│                             formatters, articleValidator)
├── i18n/                   # translation keys (Italian-primary)
├── pdf/                    # React-PDF templates for media-kit
└── test/                   # vitest setup + utilities
```

## Data flow

```
UI component
   ↓ useQuery(['articles'], fetchArticles)      (React Query)
   ↓ fetchArticles()                            (src/services/firebaseService.ts)
   ↓ getDocs(query(collection, where('published','==',true)))
   ↓ Firestore
```

**Regole inderogabili**:

- Tutti i query pubblici filtrano per `published: true`.
- `createdAt` / `updatedAt` sempre con `serverTimestamp()`.
- Accesso Firestore passa **solo** da `src/services/firebaseService.ts`.
- Mai importare Firebase config client-side.

## Routing

React Router 7 in `src/App.tsx`:

- Tutte le pages sono `lazy()` con `<Suspense>` fallback `PageLoader`.
- Admin gated da `<ProtectedRoute>` (Auth + claim `admin == true`).
- Order: specific routes prima, `*` catch-all per NotFound.
- Query params per filtri (`?group=Europa`), route params per IDs
  (`/shop/:slug`, `/articolo/:slug`).

## Server API

Tutti gli endpoint sono in `server.ts`. Rate-limit via
`express-rate-limit` (gruppi: `newsletter`, `checkout`, `contact`,
`ai`, `general`).

| Endpoint                       | Method | Auth                   | Scope                             |
| ------------------------------ | ------ | ---------------------- | --------------------------------- |
| `/api/health`                  | GET    | no                     | healthcheck                       |
| `/api/webhook`                 | POST   | Stripe signature       | eventi Stripe (ordine completato) |
| `/api/newsletter-subscribe`    | POST   | no                     | Brevo DOI + Firestore `leads`     |
| `/api/contact-lead`            | POST   | no                     | Firestore `leads` + Resend email  |
| `/api/media-kit-lead`          | POST   | no                     | Firestore `leads` + PDF link      |
| `/api/create-checkout-session` | POST   | no                     | Stripe Checkout Session           |
| `/api/validate-coupon`         | POST   | no                     | Stripe coupon check               |
| `/api/ai/verify-search`        | POST   | admin (firebase claim) | Gemini verification               |
| `/api/ai/verify-maps`          | POST   | admin                  | Gemini verification               |
| `/sitemap.xml`                 | GET    | no                     | server-generated sitemap          |
| `/rss.xml`                     | GET    | no                     | server-generated feed             |

CORS in prod è ristretto a `APP_URL`, `FRONTEND_URL`, `STAGING_URL` + dominio pubblico.

Contratti completi request/response in [`API_CONTRACT.md`](./API_CONTRACT.md).

## State management

- **Server state** (Firestore data, API responses): React Query.
  `staleTime: 5min`, `gcTime: 30min`, `refetchOnWindowFocus: false`.
- **Shallow global UI state**: Context (cart, auth, favorites). ≤3
  provider totali.
- **Form state**: controlled inputs + hook dedicati (`useContactForm`).
- **Server-side config**: `src/config/siteContent.ts` + Firestore doc
  `siteContent/*` (admin-editabili).

Non mescolare: React Query per server state, Context per UI state
derivato.

## Build pipeline

`npm run build` esegue in ordine:

1. `scripts/generate-media-kit.tsx` → `public/media-kit.pdf`
2. `scripts/generate-sitemap.js` → `public/sitemap.xml`
3. `vite build` → `dist/`

Output `dist/` servito poi da `server.ts` in prod (o da Vercel
direttamente per il frontend).

## Auth & admin model

- Login via Firebase Auth (Google provider).
- Admin gating: `request.auth.token.admin == true` primario (Firebase
  custom claim), fallback legacy `users/{uid}.role == 'admin'` +
  email whitelist `src/config/admin.ts`.
- Assegnazione claim: `npm run admin:grant <email>`. Revoke:
  `npm run admin:revoke`. List: `npm run admin:list`.
- Vedi [`20_Decisions/DECISION_ADMIN_CUSTOM_CLAIMS.md`](./20_Decisions/DECISION_ADMIN_CUSTOM_CLAIMS.md).

## Security boundaries

| Boundary           | Where                                | Mechanism                                   |
| ------------------ | ------------------------------------ | ------------------------------------------- |
| Client input → API | `server.ts` rate-limits + validation | express-rate-limit, server-side price check |
| API → Firestore    | `firestore.rules`                    | custom-claim, `published` filter            |
| Webhook ingress    | `/api/webhook`                       | Stripe signature verification               |
| Secrets            | `.env.local` (gitignored)            | `.claude/settings.json` hook block          |
| CORS               | `server.ts` production branch        | whitelist APP_URL/FRONTEND_URL/STAGING_URL  |

## Testing architecture

- **Unit (Vitest)**: `src/**/*.test.tsx` — 8 file oggi (Button,
  ErrorBoundary, Layout, Navbar, contentTaxonomy, articleData,
  articleRoutes, articleValidator).
- **E2E (Playwright)**: `e2e/*.spec.ts` — 6 file. Vedi
  [`../e2e/README.md`](../e2e/README.md).
- **Script audit**: `scripts/check-*.mjs` + `audit:ui`, `audit:firebase`,
  `audit:stripe`, `audit:agents`, `audit:visual`, `audit:a11y`,
  `audit:forms`, `audit:lighthouse`. Aggregati in `audit:quality` per
  full sweep.

## CI/CD

- **CI**: `.github/workflows/ci.yml` — 3 job (quality, audit-agents,
  audit-visual). Run su push `main`/`codex/**`/`feat/**`/`fix/**` + PR
  to main.
- **Firestore backup**: `.github/workflows/firestore-backup.yml` —
  cron `0 3 * * 0`, OIDC Workload Identity Federation, export su GCS
  con lifecycle 30 giorni.
- **Lighthouse**: `.github/workflows/lighthouse.yml` — performance budget
  su 4 URL chiave.
- **Dependabot**: `.github/dependabot.yml` — weekly npm + github-actions.

## High-risk files

Modifiche richiedono conferma esplicita owner. Hook
`.claude/settings.json` avvisa su `Edit|Write`:

- `server.ts`
- `firestore.rules`
- `src/config/admin.ts`
- `firebase-applet-config.json`, `.firebaserc`, `vercel.json`, `firebase.json`

## AI-assisted workflow

- `CLAUDE.md` → Claude Code routing (BARC)
- `AGENTS.md` → cross-tool rules (letto nativamente da OpenAI Codex CLI)
- `.claude/agents/` → 7 agent
- `.claude/skills/` → 22 skill
- `.agents/skills/` → 5 canonical (mirrored cross-tool)
- `.mcp.json` → MCP servers condivisi: `playwright` (browser test runner), `codex` (OpenAI Codex CLI come agent delegabile), `sequential-thinking` (extended reasoning multi-step). Prerequisiti e troubleshooting in [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md)
- `docs/AI_AGENT_STACK.md` → stack spec completo
- `docs/DEV_TOOLING.md` → catalogo CLI/MCP/plugin installati + criteri di selezione

**Coesistenza Claude Code ↔ Codex CLI**: entrambi leggono `AGENTS.md` come system prompt condiviso. In più Claude Code può invocare Codex in-session tramite il MCP server dichiarato in `.mcp.json`. Branch prefix `codex/**` nella CI è riservato a lavori prodotti da Codex.

## Gotchas

- **Dev server port 3000** (Vite/Express unified), **ma VS Code task**
  avvia con `PORT=3001` (vedi `.vscode/tasks.json`). Playwright usa 3000.
- Service worker PWA: hard refresh necessario dopo deploy su Chrome se
  cache old html.
- `npm run test:watch` / `npm run test:coverage` non sono definiti nel
  `package.json`. Usa `npx vitest --watch` / `npx vitest run --coverage`.
- `dotenv.config()` in `server.ts` legge `.env` + `.env.local`. Non
  committare né `.env` né `.env.local` (gitignored).
- `firebase-admin@13` porta 10 vulns `uuid <14` transitive — deferred.
  Vedi [`20_Decisions/DECISION_UUID_FIREBASE_ADMIN_VULNERABILITY.md`](./20_Decisions/DECISION_UUID_FIREBASE_ADMIN_VULNERABILITY.md).

## Related docs

- Setup / onboarding: [`QUICK_START.md`](./QUICK_START.md)
- Contributing: [`../CONTRIBUTING.md`](../CONTRIBUTING.md)
- Security: [`../SECURITY.md`](../SECURITY.md)
- Troubleshooting: [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md)
- Deploy: [`DEPLOYMENT_RUNBOOK.md`](./DEPLOYMENT_RUNBOOK.md)
- Disaster recovery: [`DISASTER_RECOVERY_RUNBOOK.md`](./DISASTER_RECOVERY_RUNBOOK.md)
- Stripe webhook: [`STRIPE_WEBHOOK_RUNBOOK.md`](./STRIPE_WEBHOOK_RUNBOOK.md)
- Schema Firestore: [`FIRESTORE_SCHEMA.md`](./FIRESTORE_SCHEMA.md)
- API contract: [`API_CONTRACT.md`](./API_CONTRACT.md)
- Design system: [`../DESIGN.md`](../DESIGN.md) + [`DESIGN_SYSTEM_CHEATSHEET.md`](./DESIGN_SYSTEM_CHEATSHEET.md)
