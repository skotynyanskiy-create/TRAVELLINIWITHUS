# Changelog

Tutti i cambiamenti notabili a Travelliniwithus sono documentati qui.
Formato: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning: [SemVer](https://semver.org/spec/v2.0.0.html) — fino al primo tag di release il progetto è in `0.x`.

## [Unreleased]

### Sessione 2026-04-24 · AI-assisted environment hardening + DX

Obiettivo: portare la configurazione Claude Code / Obsidian / VS Code a livello production-professional senza riscrivere niente di già solido.

#### Aggiunto

- **Repo governance**:
  - `SECURITY.md` — responsible disclosure, inventario segreti, high-risk files, pointer a `docs/DISASTER_RECOVERY_RUNBOOK.md`.
  - `CONTRIBUTING.md` — setup, branching, Definition of Done, routing BARC, ancoraggio al sistema skill/agent esistente.
- **Claude Code hooks** (`.claude/settings.json`):
  - `PreToolUse` block su `Edit|Write|Read` dei file secret (`.env.local`, `.env.production`, `service-account*.json`, `serviceAccount*.json`, `*.pem`, pattern `private...key`) → exit 2.
  - `PreToolUse` warn su `Edit|Write` dei file deploy/lockfile (`package-lock.json`, `firebase-applet-config.json`, `.firebaserc`, `vercel.json`, `firebase.json`).
  - `PostToolUse` reminder `npm run typecheck` dopo Edit/Write su `.ts/.tsx` non-test / non-e2e.
- **Gitignore hardening**: pattern espliciti per `service-account*.json`, `serviceAccount*.json`, `firebase-adminsdk*.json`, `*.pem`, `*.p12`, `*.pfx`, `*.key` — defense-in-depth oltre l'hook AI.
- **VS Code DX** (onboarding 2° PC):
  - `.vscode/extensions.json` — 8 recommendations (ESLint, Prettier, Tailwind CSS, Playwright, Vitest Explorer, Firestore, GitHub Actions, GitLens).
  - `.vscode/settings.json` — format-on-save, Prettier come default formatter per linguaggio, ESLint flat config + fixAll on save, TypeScript workspace `tsdk`, Tailwind `classRegex` per `cn()`/`clsx()`, LF EOL, `search.exclude`/`files.exclude` coerenti con `.gitignore`.
- **Test documentation**: `e2e/README.md` — guida ai 6 spec Playwright (cosa testano, come eseguire/debuggare, policy snapshot, quando aggiungere spec), cross-link a `LAUNCH_CHECKLIST` / `DEPLOYMENT_RUNBOOK` / `CONTRIBUTING`.
- **Obsidian vault housekeeping**:
  - Cross-link `PROJECT_RELEASE_READINESS` ↔ `PROJECT_RELEASE_READINESS_2026_04_24_PRODUCTION_PASS` (master ↔ snapshot).
  - `OBSIDIAN_HOME` esteso con sezione "Repo governance (fuori vault)" → link relativi a README/CLAUDE/AGENTS/DESIGN/CONTRIBUTING/SECURITY/CHANGELOG + `AI_AGENT_STACK` nei riferimenti strategici.
  - Daily `docs/40_Daily/2026-04-24.md` con log sessione, decisioni, tomorrow.
- **Routine remota schedulata**: one-time agent per review banner stale il 2026-05-11 07:00 UTC (`trig_01MzJkVuJepwcr83g5jj57eA`).

#### Modificato

- 5 note stale di marzo ricevono callout `> [!warning] Stale` con rimandi a fonti fresche: `TRAVELLINIWITHUS_BRAND_MEMORY.md`, `BRAND_MESSAGING_STRATEGY.md`, `DEMO_PRODUCTS.md`, `QUICK_START.md`, `OPERATIONAL_VERIFICATION_REPORT.md`.
- `docs/QUICK_START.md` refresh completo post-banner: Node ≥22 / npm ≥10.9, `.env.example` al posto di `.env.local.template` ormai non esistente, port 3000 (con nota VS Code tasks override 3001), sezione Testing punta a `e2e/README.md`, Git Workflow allineato a `CONTRIBUTING.md`, Recent Fixes sostituite con pointer a `CHANGELOG.md`.

#### Aggiunto (audit runtime + docs consolidamento)

- **`docs/TROUBLESHOOTING.md`**: diagnosi rapida per 10 aree (dev server, Firebase, Stripe, build, test, lint/commit, Claude Code hooks, npm audit, git, Obsidian). Cross-linkato da `OBSIDIAN_HOME`, `README.md`, `CONTRIBUTING.md`.
- **`docs/ARCHITECTURE.md`**: mappa sintetica dello stack — entry points, struttura `src/`, data flow (React Query → firebaseService → Firestore), tabella 11 endpoint API in `server.ts` con auth/rate-limit, state management, build pipeline, security boundaries, CI/CD, high-risk files, AI-assisted workflow. Cross-linkato da `README.md` e `OBSIDIAN_HOME`.
- **`docs/20_Decisions/DECISION_UUID_FIREBASE_ADMIN_VULNERABILITY.md`**: decision trail sulle 10 moderate vulns `uuid <14` transitive via `firebase-admin@13.8.0` → `@google-cloud/storage`. Decisione: **non** applicare `npm audit fix --force` (richiederebbe downgrade breaking a `firebase-admin@10.1.0`). Monitoraggio via Dependabot fino a bump upstream di `@google-cloud/storage`.

#### Audit runtime (baseline verde)

- `npm run lint` → 0 errors / 0 warnings
- `npm run audit:agents` → 5 canonical skills sync, PASS
- `npm run audit:ui` → 117 files scanned, 11 warnings baseline, 0 new, PASS
- `npm run typecheck` → PASS
- `npm audit` → 10 open (2 low, 8 moderate), tutte `uuid <14` transitive, decision note creata

#### Aggiunto (Codex MCP integration)

- **`.mcp.json`** esteso con entry `codex` (comando `codex mcp-server`, stdio) accanto all'esistente `playwright`. Al prossimo restart Claude Code i tool esposti da Codex diventano invocabili in-session.
- **Codex CLI installato** sul profilo `admin`: `codex-cli 0.124.0` in `C:\Users\admin\AppData\Roaming\npm\codex`. Auth già attivo (`Logged in using ChatGPT`).
- `docs/TROUBLESHOOTING.md` → nuova sezione "MCP server Codex non parte" con prerequisiti, diagnosi, note sul sottocomando corretto `mcp-server` (non `mcp`), Windows multi-profilo, disattivazione temporanea.
- `docs/ARCHITECTURE.md` → sezione "AI-assisted workflow" espansa: coesistenza Claude Code ↔ Codex CLI via AGENTS.md (shared system prompt) + MCP server (delegabile in-session) + branch prefix `codex/**` (CI-level).

**Stato**: **pronto e attivo al prossimo restart Claude Code.** Smoke-test OK (`codex mcp-server` si avvia senza errori). Nessun rischio residuo lato install.

#### Corretto (Vitest 4.1.0 parallelism bug + firebaseService console noise)

- `vitest.config.ts`: aggiunta `fileParallelism: false` per aggirare race condition Vitest 4.1.0 su Windows (tutti gli 8 test file fallivano con `TypeError: Cannot read properties of undefined (reading 'config')` quando eseguiti in parallelo). Run sequenziale: 35s, 86/86 test PASS. Scoperta durante `npm run audit:quality` della sessione. TROUBLESHOOTING aggiornato con diagnosi.
- `src/services/firebaseService.ts` (`fetchArticleBySlug` fallback): convertito `console.error` in early-return silenzioso per `FirebaseError` con `code === 'permission-denied'` o `not-found` (flusso atteso: articolo non pubblicato o non esistente). Altri errori loggano `console.warn` invece di `error`. Risolveva il 3/33 fail di `audit:visual` sulle preview `/articolo/*` che producevano 6× `console.error` per pagina × 3 viewport, causando fail del `expect(consoleErrors).toEqual([])`.

#### Aggiunto (tooling catalog + install CLI + MCP extension)

Dopo analisi approfondita (via `claude-code-guide`) di MCP server, CLI e plugin disponibili nel 2026, applicato il principio skill-diet del progetto (vedi `project_skills_diet_decision_2026_04_20`): install solo di ciò che ha 4+ use case ricorrenti nello stack reale.

**CLI installati**:

- `firebase-tools 15.15.0` via `npm i -g firebase-tools` — deploy/emulate/rules, predeploy verification, admin claim management.
- `gh 2.91.0` via `winget install GitHub.cli` — `gh pr create`, review, release, già referenziato da `CONTRIBUTING.md` e dal pattern di commit + PR. Binary in `C:\Program Files\GitHub CLI\gh.exe`. Richiede **restart della shell Bash** per vederlo nel PATH.

**MCP server estesi** in `.mcp.json`:

- `sequential-thinking` (`@modelcontextprotocol/server-sequential-thinking`, Anthropic ufficiale, no-auth) — reasoning multi-step opt-in per problemi ostico. Si attiva al prossimo restart Claude Code.

**Nuovo documento**: `docs/DEV_TOOLING.md` — catalogo completo CLI/MCP/plugin installati nel progetto, versioni, criteri di scelta, MCP server proposti ma non attivi (Sentry, Obsidian), plugin community policy. Cross-linkato da `ARCHITECTURE.md`, `OBSIDIAN_HOME.md`.

**Non installato** (documentato come "da attivare al bisogno"):

- **Stripe CLI**: `winget install Stripe.StripeCLI` quando si aprirà QA checkout.
- **Sentry MCP**: attivazione contestuale al setup `VITE_SENTRY_DSN` nella sessione finale pre-deploy.
- **Obsidian MCP**: rivalutare se la vault cresce oltre 50 note operative.
- `jq`, `rg`, `fd`, `bat`, `bun`, `ollama`, `supabase`, `gemini-cli`: duplicano tool nativi Claude Code o non pertinenti allo stack.

### Sprint 1 — 2026-04-20 · Infrastruttura production-gate

Obiettivo: chiudere tutti i gap non dipendenti da contenuto reale prima della sessione finale con chiavi API.

#### Aggiunto

- **Admin auth via Firebase Custom Claims** (`docs/20_Decisions/DECISION_ADMIN_CUSTOM_CLAIMS.md`): decisione architetturale, script `setAdminClaim`, template `firestore.rules` aggiornate per `request.auth.token.admin == true`, procedura migrazione owner + MFA.
- **Affiliate tracking v1** (`src/lib/affiliate.ts`, `src/pages/Risorse.tsx`, `src/components/AffiliateBox.tsx`):
  - `AFFILIATE_PARTNERS` registry con flag `disclosure` per ogni vendor.
  - `prepareAffiliateLink(partner, url, meta)` con UTM injection idempotente.
  - `trackAffiliateClick` gated su `canLoad('analytics')` → evento `affiliate_click` con `partner`, `campaign`, `placement`, `label`.
  - Migrazione completa grid Risorse + CTA Heymondo + copy Airalo.
  - Nuovo campo opzionale `partner` su `Resource` interface lato Firestore.
- **Editorial infrastructure**:
  - `src/utils/articleValidator.ts` — validator con regole titolo 20–75, slug kebab, descrizione 80–170, ≥600 parole, ≥3 heading, cover obbligatoria; errori bloccano publish, warning confermano.
  - Integrazione in `src/pages/admin/ArticleEditor.tsx` su `handleSave` quando `published === true`.
  - `docs/13_Content/EDITORIAL_PUBLISH_CHECKLIST.md` — checklist operativa per autori.
- **Schema.org travel esteso** (`src/components/SEO.tsx`):
  - `Article` esteso con `articleSection`, `keywords`, `wordCount`, `about`.
  - Nuovi builder `TouristDestination`, `TouristTrip` (con `subTrip` multi-stop + `geo`), `Review`.
  - Nuovi prop SEO: `destination`, `itinerary`, `review`.
- **Error tracking predisposto** (attivazione SDK in sessione finale):
  - `src/lib/errorTracking.ts` — `initErrorTracking`, `captureException`, `captureMessage`, hook `window.Sentry`.
  - `src/components/ErrorBoundary.tsx` → `onError` inoltra al tracker.
  - `src/lib/serverErrorTracking.ts` — init + capture server-side.
  - `server.ts` → middleware Express error + `unhandledRejection` + `uncaughtException`.
  - Runbook attivazione completo in `docs/20_Decisions/DECISION_ERROR_TRACKING_STRATEGY.md`.
- **Disaster recovery Firestore**:
  - Workflow `.github/workflows/firestore-backup.yml` (cron `0 3 * * 0` + `workflow_dispatch`), OIDC Workload Identity Federation, export su GCS.
  - `docs/DISASTER_RECOVERY_RUNBOOK.md` — RPO ≤7d, RTO ≤4h; setup bucket con lifecycle 30 giorni; scenari restore (corruzione parziale, perdita totale, rollback selettivo); monitoraggio e test trimestrale.
- **Runbook Stripe webhook production**: `docs/STRIPE_WEBHOOK_RUNBOOK.md` — setup endpoint, env vars, smoke test A (test mode `4242`) / B (live mode pagamento reale minimo) / C (error handling firma), procedure incidente (ordine mancante, duplicati, signature failure).
- **Consent banner riaperibile**:
  - `src/lib/consent.ts` → `openConsentPreferences()` + `onConsentReopenRequest(handler)` via CustomEvent `tw:consent-reopen`.
  - `src/components/ConsentBanner.tsx` ascolta l'evento e riapre in modalità `customize`.
  - `src/pages/legal/Cookie.tsx` espone pulsante "Apri preferenze cookie" in evidenza + disclosure vendor specifici (GA4, Meta Pixel, TikTok Pixel) e partner affiliate (Booking, Heymondo, Skyscanner, GetYourGuide, Airalo, Amazon).

#### Modificato

- `src/services/firebaseService.ts` — `Resource` estesa con `partner?: string` per tracking affiliate da CMS.
- `src/main.tsx` — `initErrorTracking()` prima di `createRoot`.
- `src/pages/Risorse.tsx` — Airalo copy button ora traccia anche `trackAffiliateClick` con `partner: 'airalo'`; Heymondo Button ora usa `heymondoCta.href/onClick`.
- `docs/LAUNCH_CHECKLIST.md` — riscritto post Sprint 1: tabella stato area, cross-link a runbook, separazione "contenuti reali" vs "attivazione chiavi".
- `docs/10_Projects/PROJECT_RELEASE_READINESS.md` — sezione Sprint 1 aggiunta con completato/aperto.
- `docs/DEPLOYMENT_RUNBOOK.md` — rifresh completo: cross-link runbook, env vars aggiornate (Sentry, Brevo, pixel, Mapbox), sezione runbook correlati, sezione next steps per sessione finale.

#### Governance (da [Unreleased] precedente)

- Governance GitHub: pull request template, issue template (bug/feature), CODEOWNERS, Dependabot (npm + github-actions).
- `.gitattributes` con normalizzazione LF cross-platform.
- Questo `CHANGELOG.md` root.
- Pulizia vault `docs/`: rimosso canvas Obsidian vuoto.
- Archivio memorie Claude Code legacy pre-aprile 2026.

## [0.1.0] — 2026-04-17 (pre-release)

Stato: `PRE-PRODUCTION` — dettagli in `docs/10_Projects/PROJECT_RELEASE_READINESS.md`.

### Baseline

- Stack: React 19 · TypeScript · Vite 6 · Tailwind 4 · Express · Firebase/Firestore · Stripe · Vitest · Playwright · PWA.
- Pagine pubbliche: home, destinazioni, articolo, guide, esperienze, mappa, shop, prodotto, media kit, collaborazioni, club, contatti, legali.
- Admin: dashboard, article editor, product editor, site content editor, users, orders.
- Audit script: `audit:ui`, `audit:firebase`, `audit:stripe`, `audit:agents`, `audit:visual`, `audit:quality`, `predeploy`.
- CI GitHub Actions: typecheck, lint, test, build, audit:ui, audit:firebase, audit:stripe.

[Unreleased]: https://github.com/skotynyanskiy-create/TRAVELLINIWITHUS/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/skotynyanskiy-create/TRAVELLINIWITHUS/releases/tag/v0.1.0
