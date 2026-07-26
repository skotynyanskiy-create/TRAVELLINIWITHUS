---
type: reference
area: quality
status: active
owner: team
tags:
  - reference
---

# 00 — Baseline forense TRAVELLINIWITHUS (Grok 4.5)

**Data snapshot:** 2026-07-24  
**Coordinatore:** Grok 4.5 via OpenCode  
**Modalità:** sola lettura su codice/config/git · scrittura solo in `docs/audit-grok45/`  
**Codice di produzione modificato da questa fase:** NESSUNO  
**Etichette evidenza:** VERIFICATO DA GIT | VERIFICATO DAL CODICE | VERIFICATO DAL ROUTING | VERIFICATO DA CONFIGURAZIONE | INFERENZA RAGIONEVOLE | IPOTESI DA VALIDARE | NON DETERMINABILE | CONTRADDETTO

---

## 1. Stato Git

| Campo                   | Valore                                                      | Evidenza                                                       |
| ----------------------- | ----------------------------------------------------------- | -------------------------------------------------------------- |
| Branch                  | `wip/2026-07-19-diario-e-cinematic-home`                    | VERIFICATO DA GIT                                              |
| HEAD                    | `c3bb51f` — fail-fast Stripe webhook secret (TASK-033)      | VERIFICATO DA GIT                                              |
| Tracking                | `origin/wip/2026-07-19-diario-e-cinematic-home` **ahead 3** | VERIFICATO DA GIT                                              |
| Working tree            | **dirty**                                                   | VERIFICATO DA GIT                                              |
| File tracked modificati | **36**                                                      | VERIFICATO DA GIT (`git diff --name-only`)                     |
| Elementi non tracciati  | **8**                                                       | VERIFICATO DA GIT (`git ls-files --others --exclude-standard`) |
| Diff volume (testo)     | +507 / −331 su 36 file                                      | VERIFICATO DA GIT                                              |

### Ultimi 15 commit (oneline)

```
c3bb51f fix(payments): fail-fast STRIPE_WEBHOOK_SECRET (TASK-033)
30dfe27 chore(docs): scollega link spezzati (TASK-006)
f8a7f16 chore(cleanup): rimuove codice orfano /strumenti (TASK-034)
5b329a7 fix(security,analytics): audit runtime + predeploy gate
c166608 feat(routing): landing /guida-in-regalo + SEO routes
545b4b0 chore(cleanup): remove 19 unused orphan home components
791807d chore(git): ignore Higgsfield artifacts
ca32a31 feat(experiments): immersive homepage prototypes
d7cbf17 feat(dev): Diario homepage preview
e8bed72 assets: refresh media kit and social previews
26a69c1 docs: update handoff and tooling evaluation
bc6653e perf(home): defer map/lazy sections
430526e chore(sitemap): regenerate
d938cd4 feat(copy): Cosa usiamo, Shop, mappa
ff8315a docs(release): gate mappa stale reference
```

---

## 2. Classificazione modifiche preesistenti

### 2.1 Tracked modificati (36)

| Area                    | File                                                                         | Note                                                                       |
| ----------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **configurazione**      | `.claude/settings.json`                                                      | Rimosse deny `Edit/Write(server.ts)` — ALTO rischio agent                  |
| **documentazione**      | `docs/20_Decisions/ROUTING_LOG.md`, `docs/audit/DEVELOPMENT_PLAN.md`         | Task mass-CLOSED                                                           |
| **test / evidence**     | `docs/audit/evidence/*` (JSON + 4 PNG)                                       | Refresh Playwright evidence                                                |
| **SEO**                 | `public/sitemap.xml`                                                         | Solo `lastmod`                                                             |
| **contenuti**           | `public/lead-magnet-posti-italiani.pdf`, `public/media-kit.pdf`              | Binary touch (numstat `- -`)                                               |
| **server**              | `server.ts`                                                                  | Admin routes allargate (`/admin/*` → 200)                                  |
| **navigazione**         | `Navbar.tsx`, `Footer.tsx`                                                   | Navbar = diff maggiore (+229/−139): mode B2B/B2C + localStorage + navigate |
| **homepage**            | `CinematicHomepage.tsx`, `CleanCuratedHero.tsx`, `CleanEditorialPromise.tsx` | WeekendGenerator rimosso dalla home; copy da `BRAND_PROMISE`               |
| **Collaborazioni**      | `Collaborazioni.tsx`, `ChiSiamo.tsx`, `Contatti.tsx`, `MediaKit.tsx`         | Mount widget B2B; Contatti audience switcher                               |
| **contenuti/config**    | `src/config/site.ts`                                                         | Nuovo `BRAND_PROMISE`                                                      |
| **design system**       | article/\*, admin metrics, PostoStamp, AiAssistant                           | Token / touch target                                                       |
| **sistema viaggiatori** | `InteractiveMap.tsx`                                                         | Close button a11y                                                          |
| **altro**               | `CartDrawer.tsx`, `MediaManager.tsx`, `firestoreErrorHandler.ts`             | Checkout UX; MIME; evento `twu:firestore-error` senza listener             |

### 2.2 Untracked (8)

| Path                                                       | Area           | Note                                           |
| ---------------------------------------------------------- | -------------- | ---------------------------------------------- |
| `docs/audit/00_BASELINE_FORENSE.md`                        | documentazione | Baseline agent precedente (conteggi già stale) |
| `docs/audit/TRAVELLINIWITHUS_MASTER_AUDIT.md`              | documentazione | Master audit (raccomanda rimozione ROI)        |
| `docs/implementation/00_STABILIZZAZIONE_BASELINE.md`       | documentazione | Antigravity — claim “ROI rimosso”              |
| `docs/implementation/01_ARCHITETTURA_NAVIGAZIONE.md`       | documentazione | Antigravity — nav; celebra calcolatore         |
| `docs/implementation/FASE_01_UI_SECURITY_ACCESSIBILITY.md` | documentazione | Antigravity — UI/a11y                          |
| `src/components/collaborazioni/CaseStudiesSection.tsx`     | Collaborazioni | NEW, montato                                   |
| `src/components/collaborazioni/PressProofSection.tsx`      | Collaborazioni | NEW, montato                                   |
| `src/components/collaborazioni/RoiCalculatorWidget.tsx`    | Collaborazioni | NEW, montato — **contraddice audit**           |

### 2.3 Produzione vs docs

| Bucket                                 |         Count approssimativo |
| -------------------------------------- | ---------------------------: |
| Codice runtime (`server.ts`, `src/**`) | 22 tracked + 3 untracked TSX |
| Public/SEO                             |                            3 |
| Docs/audit/agent                       | ~14 tracked + 5 untracked md |
| Evidence test                          |                            8 |

**Verdetto:** WIP multi-dominio, **non docs-only**. Rischio sovrascrittura **ALTO** se reset/checkout senza commit.  
Label: VERIFICATO DA GIT.

---

## 3. Configurazioni operative

| Path                                          | Piattaforma      | Stato                        | Utilità    | Conflitto / obsolescenza                                    |
| --------------------------------------------- | ---------------- | ---------------------------- | ---------- | ----------------------------------------------------------- |
| `AGENTS.md`                                   | multi-agent      | ATTIVO                       | Alta       | Path Obsidian `ccocu` vs workspace `carme`                  |
| `AGENTS.override.md`                          | —                | ASSENTE                      | —          | —                                                           |
| Nested `AGENTS.md` progetto                   | —                | ASSENTE                      | —          | —                                                           |
| `opencode.json` / `.opencode/`                | OpenCode         | ASSENTE                      | —          | OpenCode usa skill built-in + AGENTS.md repo                |
| `CLAUDE.md`                                   | Claude Code      | ATTIVO                       | Molto alta | Overlap con AGENTS (stack, high-risk, checks)               |
| `.claude/`                                    | Claude           | ATTIVO                       | Alta       | agents, skills, settings, hooks                             |
| `.agents/skills/`                             | canonical skills | ATTIVO                       | Alta       | Source of truth; sync verso .claude/.cursor/.gemini/.github |
| `.mcp.json`                                   | MCP              | ATTIVO                       | Alta       | 12 dichiarati; subset enabled in settings                   |
| `.codex/`                                     | Codex            | ATTIVO                       | Media      | Path `ccocu` hardcodato; MCP @latest drift                  |
| Graphify (`.tools/graphify`, `graphify-out/`) | code graph       | INSTALLATO, indice **stale** | Alta query | Built da commit `430526ef` ≠ HEAD                           |
| Obsidian `docs/`                              | vault            | ATTIVO                       | Molto alta | Tassonomia 10*/…/99*                                        |
| `DESIGN.md`                                   | design law       | ATTIVO                       | Alta       | —                                                           |
| `docs/AI_AGENT_STACK.md`                      | tooling policy   | ATTIVO                       | Alta       | Gate SAFE/BUILD/OWNER                                       |
| Antigravity config in-repo                    | —                | ASSENTE                      | —          | Solo note `docs/implementation/*` author tag                |
| `walkthrough.md` in-repo                      | —                | ASSENTE                      | —          | Citato solo fuori repo (brain Antigravity)                  |
| `.github/workflows`                           | CI               | PRESENTE                     | Alta       | quality / lighthouse / e2e                                  |
| Husky                                         | git hooks        | PRESENTE                     | Media      | prepare                                                     |

**Rischio istruzioni duplicate:** AGENTS ↔ CLAUDE ↔ AI_AGENT_STACK ↔ note implementation che riaffermano decisioni prodotto già superate.  
Label: VERIFICATO DA CONFIGURAZIONE / VERIFICATO DAL CODICE.

---

## 4. Stack reale

| Area            | Stato                        | Dettaglio                                                                                               | Label                        |
| --------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------- |
| UI framework    | configurato                  | React 19 + TypeScript                                                                                   | VERIFICATO DAL CODICE        |
| Bundler         | configurato                  | Vite 6                                                                                                  | VERIFICATO DAL CODICE        |
| Routing client  | configurato                  | react-router-dom v7 (`BrowserRouter`)                                                                   | VERIFICATO DAL CODICE        |
| Server          | configurato                  | Express `server.ts` + Vite middleware dev; static `dist` prod                                           | VERIFICATO DAL CODICE        |
| Rendering       | **CSR SPA** + meta injection | Nessun `renderToString`; OG/meta su path SEO; home ha ancora `injectSentieroPrerender` (residuo LEGACY) | VERIFICATO DAL CODICE        |
| Styling         | configurato                  | Tailwind CSS 4 via `@tailwindcss/vite`; token in CSS                                                    | VERIFICATO DAL CODICE        |
| State           | configurato                  | TanStack Query + context Auth/Cart/Favorites                                                            | VERIFICATO DAL CODICE        |
| Firebase        | parzialmente                 | Client + Admin SDK; dati opzionali con fallback demo                                                    | VERIFICATO DAL CODICE        |
| Stripe          | configurato                  | checkout API + webhook fail-fast; shop pubblico in waitlist                                             | VERIFICATO DAL CODICE        |
| MapLibre        | configurato                  | `maplibre-gl` + OpenFreeMap tiles                                                                       | VERIFICATO DAL CODICE        |
| Sentry          | parzialmente                 | `@sentry/react` + release script; live dipende da DSN                                                   | VERIFICATO DA CONFIGURAZIONE |
| Analytics       | parzialmente                 | GA / Meta / TikTok via env `VITE_*`                                                                     | VERIFICATO DA CONFIGURAZIONE |
| SEO             | configurato                  | Helmet, `seo.ts`, JsonLd, sitemap generator                                                             | VERIFICATO DAL CODICE        |
| Animazioni      | configurato                  | GSAP, motion, lenis, R3F (lab)                                                                          | VERIFICATO DAL CODICE        |
| Storybook       | configurato                  | `.storybook/` + stories                                                                                 | VERIFICATO DA CONFIGURAZIONE |
| Test            | configurato                  | Vitest unit (19 file), Playwright e2e (5 spec)                                                          | VERIFICATO DAL CODICE        |
| PWA             | parziale                     | vite-plugin-pwa disabilitata fuori prod                                                                 | VERIFICATO DAL CODICE        |
| Package manager | npm                          | `package-lock.json`                                                                                     | VERIFICATO DA CONFIGURAZIONE |

### Entry point

```
index.html → src/main.tsx (createRoot CSR)
  → App.tsx (providers + unico router)
    → Layout (Navbar + Outlet + Footer) | route fuori Layout
server.ts → API + HTML shell + meta injection + SPA fallback
```

Label: VERIFICATO DAL CODICE.

---

## 5. Struttura directory rilevante (alto livello)

| Path                         | Ruolo                                             |
| ---------------------------- | ------------------------------------------------- |
| `src/pages/`                 | Pagine route                                      |
| `src/components/`            | UI, home, collaborazioni, article, atlante, admin |
| `src/config/`                | site, destinations, surfaces, reels, taxonomy     |
| `src/data/`                  | content-seed, article seeds, demo                 |
| `src/services/` / `src/lib/` | Firestore, API client, utils                      |
| `server.ts`                  | Express monolitico                                |
| `e2e/`                       | Playwright                                        |
| `scripts/`                   | audit, generate, sync, predeploy                  |
| `docs/`                      | vault Obsidian + audit precedenti                 |
| `graphify-out/`              | knowledge graph (stale)                           |
| `.agents/skills/`            | skill canoniche                                   |

---

## 6. Rischi baseline (pre-fase)

| #   | Rischio                                                                      | Livello | Evidenza                                  |
| --- | ---------------------------------------------------------------------------- | ------- | ----------------------------------------- |
| R1  | WIP non committato su Navbar, server, Collaborazioni, Contatti               | ALTO    | VERIFICATO DA GIT                         |
| R2  | ROI Calculator ancora live contro Master Audit + claim “rimosso”             | CRITICO | VERIFICATO DAL CODICE + CONTRADDETTO docs |
| R3  | Case study + press quotes senza fonti URL                                    | ALTO    | VERIFICATO DAL CODICE                     |
| R4  | 40/40 content-seed `isPlaceholder:true` vs claim “posti provati / zero desk” | ALTO    | VERIFICATO DAL CODICE                     |
| R5  | Contatti B2B: company/budget UI non nel payload submit                       | MEDIO   | VERIFICATO DAL CODICE                     |
| R6  | Evento `twu:firestore-error` senza listener; TASK-028 CLOSED                 | MEDIO   | VERIFICATO DAL CODICE                     |
| R7  | `.claude/settings.json` apre edit su `server.ts`                             | ALTO    | VERIFICATO DA GIT                         |
| R8  | Graphify stale vs HEAD                                                       | MEDIO   | VERIFICATO DA CONFIGURAZIONE              |
| R9  | Path machine `ccocu` vs `carme` in AGENTS/Codex                              | MEDIO   | VERIFICATO DA CONFIGURAZIONE              |
| R10 | Metriche pubbliche ER/reach senza Insights export; admin default divergete   | ALTO    | VERIFICATO DAL CODICE                     |
| R11 | Branch ahead 3 + dirty tree = doppia superficie di perdita                   | MEDIO   | VERIFICATO DA GIT                         |
| R12 | WCAG AA dichiarato in audit precedenti senza gate axe bloccante              | MEDIO   | VERIFICATO DA CONFIGURAZIONE + INFERENZA  |

---

## 7. Elementi non determinabili in questa fase

| Elemento                                                | Motivo                                                    | Label               |
| ------------------------------------------------------- | --------------------------------------------------------- | ------------------- |
| Conteggio follower IG/TT live oggi                      | Nessuno scrape eseguito in FASE 0                         | NON DETERMINABILE   |
| Contenuti Firestore produzione                          | Nessuna query live; dipende da credenziali                | NON DETERMINABILE   |
| Esito suite typecheck/unit/e2e sul dirty tree           | Non rieseguita (solo forense)                             | NON DETERMINABILE   |
| Validità legale claim “Paghiamo il conto” / “100% AGCM” | Serve founder/owner                                       | IPOTESI DA VALIDARE |
| Comportamento runtime Contatti payload backend          | Schema server letto parzialmente; E2E non rieseguito      | IPOTESI DA VALIDARE |
| Screenshot evidence aggiornata al dirty tree            | Evidence PNG refreshate ma non correlate 1:1 a ogni claim | NON DETERMINABILE   |

---

## 8. Controlli di integrità FASE 0

| Check                                       | Esito                                    |
| ------------------------------------------- | ---------------------------------------- |
| Codice produzione modificato da Grok FASE 0 | **NO**                                   |
| Config/dipendenze installate                | **NO**                                   |
| Commit / push / reset / stash               | **NO**                                   |
| Secret stampati                             | **NO** (solo nomi env da `.env.example`) |
| Output solo in `docs/audit-grok45/`         | **SÌ**                                   |

---

## 9. Riferimenti incrociati

- Matrice route/pagine/sezioni → `01_ROUTE_PAGE_SECTION_MATRIX.md`
- Contenuti e claim → `02_CONTENT_DATA_CLAIMS.md`
- Tool/test/gap → `03_TOOLS_TESTS_GAPS.md`
- Audit precedenti → `04_PREVIOUS_AUDITS_REVIEW.md`
- Stato operativo → `AUDIT_STATE.md`
- Roadmap fasi → `AUDIT_ROADMAP.md`
