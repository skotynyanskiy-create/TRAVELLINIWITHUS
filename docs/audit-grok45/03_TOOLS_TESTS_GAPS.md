---
type: reference
area: quality
status: active
owner: team
tags:
  - reference
---

# 03 — Tools, Tests & Operational Gaps

**Snapshot:** 2026-07-24  
**Fonte:** `package.json`, config files, deps, presenza binari (non suite completa)  
**Label:** VERIFICATO DA CONFIGURAZIONE | VERIFICATO DAL CODICE

---

## 1. Inventario script `package.json`

### 1.1 Sviluppo

| Script    | Funzione              | Modifica file? | Servizi      | Credenziali  | Evidence | Safe future phases? |
| --------- | --------------------- | -------------- | ------------ | ------------ | -------- | ------------------- |
| `dev`     | Express+tsx watch     | no (runtime)   | local server | optional env | logs     | SÌ                  |
| `start`   | node server prod-like | no             | local        | env          | logs     | SÌ                  |
| `preview` | vite preview          | no             | local        | no           | —        | SÌ                  |

### 1.2 Build / generate

| Script                                      | Funzione                           | Modifica?              | Safe?               |
| ------------------------------------------- | ---------------------------------- | ---------------------- | ------------------- |
| `build`                                     | PDF + OG + images + sitemap + vite | **SÌ** dist/public gen | ATTENZIONE baseline |
| `clean`                                     | rm dist                            | SÌ                     | ok                  |
| `generate:media-kit` / `lead-magnet` / `og` | asset gen                          | SÌ public              | OWNER/BUILD         |
| `optimize:images`                           | image pipeline                     | SÌ                     | BUILD               |
| `generate:obsidian-index`                   | vault index                        | SÌ docs                | docs only           |

### 1.3 Lint / typecheck / format

| Script                     | Modifica?                | Safe?        |
| -------------------------- | ------------------------ | ------------ |
| `typecheck`                | no                       | **SAFE**     |
| `lint`                     | no                       | **SAFE**     |
| `lint:fix` / `format`      | **SÌ**                   | no in freeze |
| `format:check` / `lint:md` | no                       | SAFE         |
| `check`                    | no (typecheck+lint+unit) | SAFE heavy   |

### 1.4 Unit / E2E / visual

| Script               | Funzione            | Servizi    | Safe?         |
| -------------------- | ------------------- | ---------- | ------------- |
| `test` / `test:unit` | Vitest              | no         | **SAFE**      |
| `e2e` / `test:e2e`   | Playwright `e2e/`   | dev server | SAFE non-prod |
| `audit:visual`       | visual-quality.spec | dev server | SAFE          |

**Osservato:** 19 file unit `src/**/*.test.*`; 5 e2e specs (`home`, `shop-and-checkout`, `contact-rate-limit`, `stripe-webhook-signature`, `visual-quality`).  
Label: VERIFICATO DAL CODICE.

### 1.5 UI / a11y / SEO / perf

| Script                         | Funzione                     | Note                                     | Safe?          |
| ------------------------------ | ---------------------------- | ---------------------------------------- | -------------- |
| `audit:ui`                     | check-ui.mjs tokens/patterns | static                                   | **SAFE**       |
| `audit:a11y`                   | axe-core CLI via **npx**     | serve :3000; package non in node_modules | SAFE + network |
| `audit:ai-seo`                 | llms/SEO guards              | static                                   | SAFE           |
| `audit:cwv`                    | LHCI autorun                 | **build** + npx lhci                     | heavy          |
| `audit:bulk`                   | unlighthouse                 | server up                                | release-only   |
| `audit:size`                   | check-size.mjs               | custom (non size-limit pkg)              | SAFE           |
| `audit:bundle:viz` / `analyze` | visualizer                   | scrive HTML                              | ok             |

### 1.6 Sicurezza / Firebase / Stripe

| Script                                  | Funzione           | Creds                  | Safe?                                                       |
| --------------------------------------- | ------------------ | ---------------------- | ----------------------------------------------------------- |
| `audit:secrets*`                        | gitleaks redact    | binary PATH            | SAFE se redact                                              |
| `audit:env`                             | env safety         | no values print atteso | SAFE                                                        |
| `audit:firebase` / `stripe` / `revenue` | static domain      | no                     | **SAFE**                                                    |
| `emulators`                             | firebase emulators | firebase CLI           | **DEBOLE** (no emulators block solido; CLI non sempre PATH) |
| `webhook:listen`                        | stripe CLI forward | Stripe keys            | OWNER                                                       |

### 1.7 Agents / docs / graphify / deploy

| Script                                                     | Modifica?                  | Safe?                    |
| ---------------------------------------------------------- | -------------------------- | ------------------------ |
| `audit:agents` / `audit:obsidian` / `check:graphify`       | no                         | SAFE                     |
| `sync:agents` / `sync:obsidian` / `setup:obsidian-plugins` | **SÌ**                     | no freeze                |
| `graphify:index` / `watch`                                 | **SÌ** graphify-out        | index solo se necessario |
| `graphify:query` / `affected` / `explain`                  | no                         | SAFE se index ok         |
| `predeploy`                                                | no write code; heavy gates | SAFE-ish pre-release     |
| `release:sentry`                                           | Sentry remote              | OWNER                    |
| `import:instagram` / `geocode:content` / `scaffold:page`   | **SÌ** data                | OWNER                    |
| `storybook` / `build-storybook`                            | build scrive               | SAFE                     |

---

## 2. Disponibilità strumenti

| Strumento                      | Disponibile?                                  | Evidenza                                                          |
| ------------------------------ | --------------------------------------------- | ----------------------------------------------------------------- |
| Playwright                     | **SÌ**                                        | deps + config + e2e + evidence JSON                               |
| Lighthouse / LHCI              | **SÌ (npx)**                                  | lighthouserc.json; non in node_modules fisso                      |
| axe-core                       | **SÌ (npx)**                                  | audit:a11y; non installato locale; Storybook addon-a11y sì        |
| Storybook                      | **SÌ**                                        | .storybook + stories                                              |
| Bundle analyzer                | **SÌ**                                        | vite-bundle-analyzer + visualizer                                 |
| Visual regression              | **PARZIALE**                                  | Playwright visual; Chromatic addon presente ma non pipeline cloud |
| Firebase Emulator              | **PARZIALE/DEBOLE**                           | script; config/CLI incompleti in env                              |
| Stripe test                    | **SÌ**                                        | SDK + CLI + e2e signature + ALLOW_MOCK_CHECKOUT                   |
| Graphify                       | **SÌ** (indice **stale**)                     | .tools/graphify + graphify-out                                    |
| Sentry                         | **SÌ** code+MCP                               | live se DSN                                                       |
| MapLibre                       | **SÌ**                                        | deps + components                                                 |
| Obsidian vault                 | **SÌ**                                        | docs/ + .obsidian                                                 |
| Vitest                         | **SÌ**                                        | 19 unit files                                                     |
| Gitleaks                       | **SÌ** (system PATH osservato in audit tools) | audit:secrets                                                     |
| eslint-plugin-jsx-a11y         | **SÌ**                                        | installed                                                         |
| Browser controllato OpenCode   | **DA VALIDARE** in fase browser               | MCP playwright/chrome-devtools dichiarati                         |
| Localhost dev                  | **disponibile se `npm run dev`**              | non avviato in FASE 0                                             |
| Screenshot / console / Network | via Playwright MCP/e2e                        | evidence storica in docs/audit/evidence                           |
| structured-data validator      | **non dedicato**                              | gap                                                               |
| link checker                   | **non dedicato**                              | gap                                                               |
| dependency audit knip          | **SÌ**                                        | audit:deps                                                        |

---

## 3. MCP / agent stack (riassunto)

| Elemento                  | Stato                                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| `.mcp.json`               | 12 server dichiarati                                                                                 |
| Enabled tipici (settings) | firebase, stripe, sentry, playwright, chrome-devtools, context7, github, obsidian, codex, higgsfield |
| Dichiarati non enabled    | firecrawl, analytics                                                                                 |
| Skills canoniche          | `.agents/skills/` (~53)                                                                              |
| OpenCode project config   | **assente** (`opencode.json` / `.opencode/`)                                                         |
| Claude agents             | `.claude/agents/*` travellini-\*                                                                     |

---

## 4. Gap operativi per audit completo

| #   | Problema                              | Soluzione preferita                               | Valore      | Complessità | Rischio          | Costo | Manutenzione | Fase                | Raccomandazione        |
| --- | ------------------------------------- | ------------------------------------------------- | ----------- | ----------- | ---------------- | ----- | ------------ | ------------------- | ---------------------- |
| 1   | ROI live vs docs “rimosso”            | Decisione unica owner + fix allineato docs/code   | Critico     | L-M         | Alto se left     | Basso | Bassa        | Prima di “complete” | **ADOTTARE**           |
| 2   | False completion Antigravity          | Protocollo: completed ⇒ git proof + SHA           | Alto        | Basso       | Medio            | Basso | Bassa        | Ora                 | **ADOTTARE**           |
| 3   | Graphify stale                        | `graphify:index` post commit strutturali          | Medio       | Basso       | Basso            | CPU   | Bassa        | Post structural     | **ADOTTARE**           |
| 4   | Path `ccocu` vs `carme`               | Path relativi machine-agnostic                    | Medio       | Basso       | Medio MCP        | Basso | Bassa        | Soon                | **ADOTTARE**           |
| 5   | WCAG AA senza gate axe                | Evidence `audit:a11y` in docs; chiudi TASK-019    | Alto        | Medio       | Basso            | npx   | Media        | FASE 19             | **ADOTTARE**           |
| 6   | predeploy senza a11y/cwv/e2e full     | `audit:release` opzionale                         | Release     | Medio       | Tempo            | L-M   | Media        | Pre-release         | **ADOTTARE**           |
| 7   | Firebase emulators deboli             | Config completa o nascondi script                 | DX          | Medio       | Confusione       | Basso | Bassa        | Se tocchi FS        | **SOLO SE NECESSARIO** |
| 8   | Orphan WeekendGenerator + lab         | Quarantena lab/ o delete                          | Chiarezza   | Basso       | Basso            | Basso | Bassa        | Cleanup             | **ADOTTARE**           |
| 9   | MCP sprawl                            | Core QA only; creative off finché eval card       | Hygiene     | Basso       | Medio            | Basso | Bassa        | Continuo            | **ADOTTARE**           |
| 10  | Dual hardcode 172K                    | Solo BRAND_STATS                                  | Trust       | Basso       | Medio            | Basso | Bassa        | Content             | **ADOTTARE**           |
| 11  | Claim “Paghiamo il conto”             | Checkbox founder                                  | Brand/legal | Basso       | Medio            | Basso | Bassa        | FASE 1/15           | **ADOTTARE**           |
| 12  | Chromatic cloud                       | Non adottare finché budget visual                 | Design QA   | Alto        | $$               | Alto  | Media        | Later               | **SOLO SE NECESSARIO** |
| 13  | Unlighthouse ogni giorno              | Solo RC                                           | Perf map    | Basso       | Noise            | npx   | Bassa        | Release             | **SOLO SE NECESSARIO** |
| 14  | CMS headless/WP                       | Fuori scope (Master §11)                          | —           | Alto        | Alto             | Alto  | Alta         | —                   | **NON ADOTTARE**       |
| 15  | Nuovo agent OS OpenCode parallelo     | No benefit                                        | —           | Medio       | Dup instructions | Medio | Media        | —                   | **NON ADOTTARE**       |
| 16  | Guard weakening (lesson AUDIT-004)    | Checklist property originale                      | Honesty     | Basso       | Alto se miss     | Basso | Bassa        | Always              | **ADOTTARE**           |
| 17  | Dirty git multi-dominio               | Freeze commit; split docs vs code                 | Reprod.     | Basso       | Alto             | Basso | Bassa        | Ora                 | **ADOTTARE**           |
| 18  | size-limit docs mismatch              | Allinea AI_AGENT_STACK a check-size.mjs           | Docs        | Trivial     | Basso            | Basso | Bassa        | Docs                | **ADOTTARE**           |
| 19  | No structured-data validator dedicato | Script locale o rich results manual + test JsonLd | SEO         | Medio       | Medio            | Basso | Media        | FASE 20             | **SOLO SE NECESSARIO** |
| 20  | No link checker dedicato              | Playwright crawl o script temp                    | SEO/QA      | Medio       | Link morti       | Basso | Media        | FASE 23             | **SOLO SE NECESSARIO** |

---

## 5. Comandi SAFE raccomandati per fasi future (non eseguiti qui)

```bash
npm run typecheck
npm run lint
npm run test:unit
npm run audit:ui
npm run audit:firebase
npm run audit:stripe
npm run audit:revenue
npm run audit:agents
npm run audit:obsidian
npm run check:graphify
npm run format:check
```

**Evitare in freeze baseline:** `format`, `lint:fix`, `sync:*`, `build` (se non si vogliono rigenerare PDF/sitemap), `graphify:index` senza necessità, install/update pacchetti.

---

## 6. Capacità disponibili vs mancanti (sintesi)

### Disponibili (forti)

- Static domain audits (UI, Firebase, Stripe, revenue, agents, secrets)
- Unit + E2E + visual Playwright
- predeploy 16-step (dichiarato; non rieseguito)
- Storybook, Graphify, Obsidian OS, multi-agent skills
- MapLibre, Sentry SDK, Stripe test path

### Mancanti o deboli

- axe bloccante in CI
- Firebase emulator robusto
- Structured-data validator dedicato
- Link checker dedicato
- Graphify fresco su HEAD
- Evidence a11y/CWV fresche sul dirty tree
- OpenCode project config (non necessario se AGENTS.md basta)

---

## 7. Evidence storica già presente

Path: `docs/audit/evidence/`  
Include: console-errors, network-failures, playwright-route-results, playwright-responsive-matrix, screenshots.  
**Attenzione:** evidence refreshate nel dirty tree; non ri-correlate a ogni claim Master Audit in questa fase.  
Label: VERIFICATO DA GIT / IPOTESI DA VALIDARE sulla completezza.
