---
type: project
area: tooling
status: in-progress
owner: skotxx
created: 2026-05-14
priority: P1
tags:
  - cli
  - tooling
  - audit
  - performance
  - security
  - dx
related-projects:
  - [[PROJECT_FULL_SITE_MARKETING_TECH_AUDIT]]
  - [[PROJECT_RELEASE_READINESS]]
  - [[AI_AGENT_STACK]]
---

# PROJECT — CLI tooling integration

> Catalogo CLI valutati il 2026-05-14 per il progetto TRAVELLINIWITHUS. Scopo: chiudere i gap emersi dall'audit (`PROJECT_FULL_SITE_MARKETING_TECH_AUDIT.md`) — performance reale, secret scanning, a11y automated, webhook testing, bundle budget — senza appesantire `audit:quality`.

## Inventario CLI gia presenti

Verificato il 2026-05-14 su questa macchina Windows.

| CLI                                             | Versione                      | Installazione | Uso attuale                                                  |
| ----------------------------------------------- | ----------------------------- | ------------- | ------------------------------------------------------------ |
| `firebase` (firebase-tools)                     | 15.17.0                       | npm global    | deploy + (potenziale) emulator                               |
| `gh` (GitHub CLI)                               | 2.89.0                        | system        | PR / issue / API (non integrato in npm scripts)              |
| `docker`                                        | 29.3.1                        | system        | (non usato dal progetto, disponibile per emulator/container) |
| `playwright`                                    | via `@playwright/test` devDep | npm           | `npm run e2e`, `npm run audit:visual`                        |
| `vitest`                                        | devDep                        | npm           | `npm run test`                                               |
| `eslint` + `prettier` + `husky` + `lint-staged` | devDep                        | npm           | `npm run lint`, pre-commit                                   |
| `tsx` + `vite` + `tailwindcss` + `sharp`        | devDep                        | npm           | build chain                                                  |
| `@sentry/react` (SDK only)                      | dep                           | npm           | runtime — manca `sentry-cli` per source maps                 |
| `stripe` (SDK only)                             | dep                           | npm           | runtime — manca `stripe` CLI per webhook testing             |
| `web-vitals` (lib)                              | dep                           | npm           | client-side metric capture — manca CLI Lighthouse            |

## CLI proposte per integrazione

Suddivise per priorita (impatto sul progetto + chiusura gap audit). Tutti gli script proposti sono **opt-in** (NON inseriti in `audit:quality`) per non rompere CI.

### P0 — chiudono bug critici dell'audit del 2026-05-14

#### 1. Stripe CLI

- **Cosa risolve:** [BUG] audit:stripe falso positivo + verifica reale di server-side price integrity (vedi [BUG_HOMEPAGE_STATS_INCONSISTENT](../14_Bugs/BUG_HOMEPAGE_STATS_INCONSISTENT.md) sezione `audit:stripe`).
- **Install:**
  ```powershell
  # Windows
  scoop install stripe
  # oppure scarica binario: https://github.com/stripe/stripe-cli/releases
  ```
- **Use cases:**
  - `stripe listen --forward-to localhost:3000/api/webhook` — webhook live in dev
  - `stripe trigger checkout.session.completed` — simulare eventi
  - `stripe events resend evt_xxx` — replay
- **Script proposto:** `npm run webhook:listen` (vedi sezione "Script aggiunti").
- **Lega a:** [src/components/CartDrawer.tsx](../../src/components/CartDrawer.tsx), [server.ts](../../server.ts) endpoint `/api/webhook`.

#### 2. Firebase Emulators (gia disponibile in firebase-tools)

- **Cosa risolve:** [BUG_FIRESTORE_ARTICLES_PERMISSIONS](../14_Bugs/BUG_FIRESTORE_ARTICLES_PERMISSIONS.md) verificabile in locale senza rischio prod.
- **Install:** gia presente (`firebase` 15.17 globale).
- **Use cases:**
  - `firebase emulators:start --only firestore,auth` — Firestore + Auth locali
  - `firebase emulators:exec "npm test"` — test contro emulator
  - Connect via `src/services/firebaseInit.ts` con `connectFirestoreEmulator(db, 'localhost', 8080)` se `VITE_USE_FIREBASE_EMULATOR=true`.
- **Script proposto:** `npm run emulators` + flag env `VITE_USE_FIREBASE_EMULATOR`.

#### 3. Lighthouse CI (`@lhci/cli`)

- **Cosa risolve:** misurazione reale **Performance 7.5/10** dell'audit (oggi stima). LCP/INP/CLS budget pre-deploy.
- **Install (opzione A — npx, no commit lockfile):**
  ```bash
  npx @lhci/cli@latest autorun
  ```
- **Install (opzione B — devDep, raccomandato per CI):**
  ```bash
  npm install --save-dev @lhci/cli
  ```
- **Config:** [.lighthouserc.json](../../.lighthouserc.json) (da creare):
  ```json
  {
    "ci": {
      "collect": {
        "url": [
          "http://localhost:3000/",
          "http://localhost:3000/mappa",
          "http://localhost:3000/collaborazioni",
          "http://localhost:3000/media-kit",
          "http://localhost:3000/chi-siamo",
          "http://localhost:3000/articolo/guida-bali"
        ],
        "numberOfRuns": 3,
        "startServerCommand": "npm run preview"
      },
      "assert": {
        "preset": "lighthouse:no-pwa",
        "assertions": {
          "categories:performance": ["error", { "minScore": 0.85 }],
          "categories:accessibility": ["error", { "minScore": 0.95 }],
          "categories:best-practices": ["warn", { "minScore": 0.9 }],
          "categories:seo": ["error", { "minScore": 0.95 }],
          "largest-contentful-paint": ["warn", { "maxNumericValue": 2500 }],
          "cumulative-layout-shift": ["warn", { "maxNumericValue": 0.1 }],
          "total-blocking-time": ["warn", { "maxNumericValue": 300 }]
        }
      },
      "upload": { "target": "temporary-public-storage" }
    }
  }
  ```
- **Script proposto:** `npm run audit:cwv` → `npx @lhci/cli autorun`.

#### 4. Unlighthouse (audit bulk multipagina)

- **Cosa risolve:** audit Lighthouse delle **36 pagine** in 1 passata, ideale per pre-deploy V2.
- **Install:**
  ```bash
  npx unlighthouse --site http://localhost:3000
  ```
- **Use case:** scopre regressioni su pagine non monitorate da `lhci` (lhci copre 6, unlighthouse le 36). Output report HTML interattivo.
- **Script proposto:** `npm run audit:bulk` → `npx unlighthouse --site http://localhost:3000 --output-path .audit-screenshots/unlighthouse`.

### P1 — chiudono gap a11y, security, bundle, docs

#### 5. @axe-core/cli (automated a11y)

- **Cosa risolve:** automated WCAG check su CI senza Playwright (gia presente come skill `a11y-check`). Output JSON parsabile.
- **Install:** `npx @axe-core/cli@latest http://localhost:3000`
- **Script proposto:** `npm run audit:a11y` → `npx @axe-core/cli http://localhost:3000 http://localhost:3000/collaborazioni http://localhost:3000/media-kit --tags wcag2a,wcag2aa,wcag21aa`.

#### 6. Gitleaks (secret scanning pre-commit)

- **Cosa risolve:** previene leak di `STRIPE_SECRET_KEY`, `RESEND_API_KEY`, `BREVO_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GITHUB_TOKEN`, `VITE_MAPBOX_TOKEN` (CLAUDE.md global preferences li lista come critici).
- **Install:**
  ```powershell
  # Windows
  scoop install gitleaks
  # oppure GitHub releases binary
  ```
- **Use cases:**
  - `gitleaks detect --source . --no-banner` — scan repo intero
  - `gitleaks protect --staged --no-banner` — pre-commit hook
- **Integrazione husky:** aggiungere riga in `.husky/pre-commit` (gia presente con lint-staged).
- **Script proposto:** `npm run audit:secrets` → `gitleaks detect --source . --no-banner --redact`.
- **Riferimento:** [Gitleaks vs TruffleHog 2026](https://appsecsanta.com/sast-tools/gitleaks-vs-trufflehog) — gitleaks vince per velocita pre-commit, TruffleHog meglio in CI per credential verification.

#### 7. Sentry CLI (source maps + release tracking)

- **Cosa risolve:** Sentry React (`@sentry/react`) e gia installato lato runtime, ma SENZA source maps in produzione gli stack trace sono inutilizzabili.
- **Install:** `npm install --save-dev @sentry/cli` (oppure binario standalone).
- **Use cases:**
  - `sentry-cli releases new $(git rev-parse HEAD)` — registra release
  - `sentry-cli sourcemaps upload --release=$(git rev-parse HEAD) dist/assets` — upload source maps
  - `sentry-cli releases finalize $(git rev-parse HEAD)` — finalize
- **Script proposto:** `npm run release:sentry` (chiamato da `predeploy` quando `SENTRY_AUTH_TOKEN` env e' presente).

#### 8. size-limit (bundle budget)

- **Cosa risolve:** **Bundle Mapbox 1.7MB** segnalato in audit. Enforce budget JS/CSS pre-deploy.
- **Install:** `npm install --save-dev size-limit @size-limit/file @size-limit/webpack`
- **Config:** in [package.json](../../package.json):
  ```json
  "size-limit": [
    { "name": "Home entry bundle (gzip)", "path": "dist/assets/index-*.js", "limit": "120 KB" },
    { "name": "Home page chunk (gzip)", "path": "dist/assets/Home-*.js", "limit": "20 KB" },
    { "name": "Articolo chunk (gzip)", "path": "dist/assets/Articolo-*.js", "limit": "15 KB" },
    { "name": "Mapbox chunk (gzip, only /mappa)", "path": "dist/assets/mapbox-*.js", "limit": "500 KB" }
  ]
  ```
- **Script proposto:** `npm run audit:size` → `npx size-limit`.

### P2 — DX e docs hygiene

#### 9. Knip (unused deps + exports)

- **Cosa risolve:** post-canonizzazione skill, alcuni deps potrebbero essere non usati (`react-quill-new`, `embla-carousel-react`, `recharts`, `react-error-boundary`, `react-helmet-async` se altro wrapper).
- **Install:** `npx knip@latest`
- **Script proposto:** `npm run audit:deps` → `npx knip --no-progress`.

#### 10. Markdownlint CLI2

- **Cosa risolve:** docs/ ha 100+ file markdown. Lint per consistenza (heading levels, trailing whitespace, line length).
- **Install:** `npx markdownlint-cli2 "docs/**/*.md"`
- **Script proposto:** `npm run lint:md` → `npx markdownlint-cli2 "docs/**/*.md" "*.md"`.
- **Config:** [.markdownlint-cli2.jsonc](../../.markdownlint-cli2.jsonc) (da creare) con esclusioni per template Obsidian (`[[wikilink]]`, `^callout`).

#### 11. Vite Bundle Visualizer

- **Cosa risolve:** complementare a `size-limit`. Output HTML interattivo per esplorare il bundle.
- **Install:** `npx vite-bundle-visualizer@latest`
- **Script proposto:** `npm run audit:bundle:viz` → `npx vite-bundle-visualizer -o .audit-screenshots/bundle.html`.

#### 12. Wrangler (Cloudflare CLI) — solo se serve

- **Cosa risolve:** Cloudflare tunnel locale (alternativa a ngrok) per esporre dev server per webhook test esterno. Non strettamente necessario perche Stripe CLI fa `stripe listen` direttamente.
- **Status:** **non integrato** salvo richiesta esplicita.

### Non integrati (motivati)

| CLI                         | Motivo                                                                                                          |
| --------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **TruffleHog**              | gitleaks copre il caso d'uso pre-commit. Aggiungere solo se compliance richiede credential verification attiva. |
| **Mapbox CLI**              | nessun custom tileset oggi. Token mgmt via dashboard sufficiente.                                               |
| **ngrok**                   | Stripe CLI fa `stripe listen` senza ngrok. Cloudflare Tunnel se serve webhook esterno.                          |
| **commitlint**              | husky + lint-staged + convention manual sufficienti. Aggiungere se team cresce > 2 dev.                         |
| **bun**                     | tsx + node 24 funzionano. Migrare a bun non e' priority.                                                        |
| **deno**                    | idem.                                                                                                           |
| **typedoc / api-extractor** | overkill per app singola.                                                                                       |
| **k6 / autocannon**         | nessun endpoint API custom da load-testare oltre Stripe (limitato da rate-limit).                               |
| **PostHog CLI**             | analytics gia su GA4 + Meta + TikTok via `src/services/analytics.ts`.                                           |
| **AWS / Azure CLI**         | infra su Firebase, non AWS/Azure.                                                                               |
| **GitLab CLI (glab)**       | repo su GitHub.                                                                                                 |
| **HashiCorp Vault CLI**     | secrets via Firebase Functions config + `.env` per dev.                                                         |

## Script aggiunti a package.json

Tutti opt-in (non chiamati da `audit:quality`). Usano `npx` per non modificare `package-lock.json` se l'utente decide di non installare. Se preferisce performance, l'utente installa la devDep come indicato.

```json
{
  "audit:cwv": "npx @lhci/cli@latest autorun",
  "audit:bulk": "npx unlighthouse@latest --site http://localhost:3000 --output-path .audit-screenshots/unlighthouse",
  "audit:a11y": "npx @axe-core/cli@latest http://localhost:3000 http://localhost:3000/collaborazioni http://localhost:3000/media-kit http://localhost:3000/chi-siamo --tags wcag2a,wcag2aa,wcag21aa",
  "audit:secrets": "gitleaks detect --source . --no-banner --redact || echo 'Install gitleaks: scoop install gitleaks'",
  "audit:size": "npx size-limit",
  "audit:bundle:viz": "npx vite-bundle-visualizer@latest -o .audit-screenshots/bundle.html",
  "audit:deps": "npx knip@latest --no-progress",
  "lint:md": "npx markdownlint-cli2@latest \"docs/**/*.md\" \"*.md\"",
  "webhook:listen": "stripe listen --forward-to localhost:3000/api/webhook || echo 'Install stripe CLI: scoop install stripe'",
  "emulators": "firebase emulators:start --only firestore,auth",
  "release:sentry": "npx @sentry/cli@latest releases new $(git rev-parse HEAD) && npx @sentry/cli@latest sourcemaps upload --release=$(git rev-parse HEAD) dist/assets && npx @sentry/cli@latest releases finalize $(git rev-parse HEAD)"
}
```

## Priorita di adozione (matrice)

| Ordine | CLI                            | Effort install | Chiusura gap audit                           | Impatto              |
| ------ | ------------------------------ | -------------- | -------------------------------------------- | -------------------- |
| 1      | Stripe CLI                     | 5 min          | falso positivo `audit:stripe` + webhook live | **P0** revenue       |
| 2      | Firebase emulators (gia disp.) | 0 min          | BUG Firestore permissions                    | **P0** content       |
| 3      | Lighthouse CI                  | 10 min         | misura Performance 7.5/10 stimato            | **P0** CWV reale     |
| 4      | Unlighthouse                   | 0 min (npx)    | bulk audit 36 pagine                         | **P0** regressioni   |
| 5      | Gitleaks                       | 5 min          | leak prevention secrets                      | **P1** security      |
| 6      | @axe-core/cli                  | 0 min (npx)    | a11y automated WCAG AA                       | **P1** a11y          |
| 7      | Sentry CLI                     | 10 min         | source maps in prod                          | **P1** observability |
| 8      | size-limit                     | 15 min         | budget mapbox 1.7MB                          | **P2** perf budget   |
| 9      | Knip                           | 0 min (npx)    | cleanup deps post-canonization               | **P2** DX            |
| 10     | markdownlint-cli2              | 5 min          | docs/ consistency                            | **P2** DX            |
| 11     | vite-bundle-visualizer         | 0 min (npx)    | exploration bundle                           | **P2** DX            |

## Integrazione skill stack agent

Le skill esistenti in `.agents/skills/` (canonizzate il 2026-05-14) vengono aggiornate per riferire a queste CLI:

- **`cwv`** — aggiunto riferimento a `npm run audit:cwv` (lhci) + `npm run audit:bulk` (unlighthouse) come strumenti primari.
- **`a11y-check`** — aggiunto riferimento a `npm run audit:a11y` (@axe-core/cli) come baseline automated, Playwright per spot-check.
- **`stripe-flow`** — aggiunto `npm run webhook:listen` (Stripe CLI) per test webhook live.
- **`firebase-check`** — aggiunto `npm run emulators` come step diagnostico per BUG permissions.
- **`predeploy`** — sezione opzionale `release:sentry` se `SENTRY_AUTH_TOKEN` presente.

## Test di non-regressione

Dopo aggiunta script:

```bash
npm run typecheck     # PASS atteso
npm run audit:agents  # PASS atteso (skill modifiche minori)
npm run audit:ui      # 94 warn atteso (immutato)
npm run lint          # PASS atteso
npm run build         # PASS atteso (build chain immutata)
```

Esecuzione opzionale dei nuovi script (richiede CLI installate o npx fetch al volo):

```bash
npm run audit:cwv         # ~3-5 min, richiede preview server
npm run audit:bulk        # ~5-10 min, audita 36 pagine
npm run audit:a11y        # ~30s
npm run audit:secrets     # ~5s
npm run audit:size        # ~5s post-build
npm run audit:deps        # ~10s
npm run lint:md           # ~5s
npm run audit:bundle:viz  # ~10s post-build, apre browser HTML
```

## Decisioni aperte

- [ ] Owner: install `@lhci/cli` come devDep (raccomandato) o solo via npx?
- [ ] Owner: aggiungere `gitleaks protect --staged` al pre-commit husky? (raccomandato — basso overhead)
- [ ] Owner: `release:sentry` parte di `predeploy` automatic? Richiede `SENTRY_AUTH_TOKEN` in env CI.
- [ ] Owner: target budget LCP/INP/CLS in `.lighthouserc.json` — i miei valori suggeriti (2500/300/0.1) sono soglie warn. Si vuole error?
- [ ] Owner: aggiungere `audit:cwv` + `audit:size` a `audit:quality` o lasciare opt-in?

## Riferimenti

- [Lighthouse CI guide 2026 (Unlighthouse)](https://unlighthouse.dev/learn-lighthouse/lighthouse-ci)
- [Unlighthouse bulk audit](https://unlighthouse.dev/learn-lighthouse/bulk-lighthouse-testing)
- [Gitleaks vs TruffleHog 2026 benchmarks](https://appsecsanta.com/sast-tools/gitleaks-vs-trufflehog)
- [Stripe CLI documentation](https://docs.stripe.com/stripe-cli)
- [Firebase Local Emulator Suite](https://firebase.google.com/docs/emulator-suite)
- [size-limit](https://github.com/ai/size-limit)
- [Knip — unused exports detection](https://knip.dev)
- [@axe-core/cli](https://www.npmjs.com/package/@axe-core/cli)
