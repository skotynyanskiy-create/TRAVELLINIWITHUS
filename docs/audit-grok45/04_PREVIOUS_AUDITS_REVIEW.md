---
type: reference
area: quality
status: active
owner: team
tags:
  - reference
---

# 04 — Previous Audits Review

**Snapshot:** 2026-07-24  
**Fonti lette (quando presenti):**

- `docs/audit/TRAVELLINIWITHUS_MASTER_AUDIT.md` (untracked)
- `docs/audit/00_BASELINE_FORENSE.md` (untracked; conteggi stale)
- `docs/audit/COMPLETE_AUDIT.md`
- `docs/audit/DEVELOPMENT_PLAN.md` (dirty)
- `docs/implementation/00_STABILIZZAZIONE_BASELINE.md` (Antigravity)
- `docs/implementation/01_ARCHITETTURA_NAVIGAZIONE.md`
- `docs/implementation/FASE_01_UI_SECURITY_ACCESSIBILITY.md`
- `graphify-out/GRAPH_REPORT.md`
- evidence sotto `docs/audit/evidence/`

**walkthrough.md:** ASSENTE in repo (citato solo path esterno Antigravity brain).

**Questa fase non corregge gli audit precedenti** — li classifica.

---

## 1. Matrice conclusioni precedenti

| Conclusione precedente                         | Evidenza dichiarata                        | Verdetto 2026-07-24                        | Modifica successiva                                                                                                                           | Rischio                       |
| ---------------------------------------------- | ------------------------------------------ | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| **ROI Calculator: rimuovere (CRIT-STRAT-01)**  | Master Audit code inspection               | **CONTRADDETTO dal codice live**           | Implementation 00 claim “RIMOZIONE TOTALE”; codice ha ancora `RoiCalculatorWidget` + mount Collaborazioni; Arch 01 **celebra** il calcolatore | **CRITICO** doc↔code          |
| **ROI remove-then-enhanced**                   | Baseline Contradiction 1                   | **SUPPORTATO come fallimento di processo** | Widget potenziato ancora live                                                                                                                 | Critico integrity             |
| **Weekend Generator: togliere dalla homepage** | Master CRIT-UX-01                          | **SUPPORTATO per home live**               | Rimosso da `CinematicHomepage` (dirty); file widget ancora su disco (orfano); Diario DEV ha generator                                         | Basso prod / medio rumore     |
| **Metriche 172K+**                             | site.ts; Master AGCOM                      | **PARZIALMENTE SUPPORTATO**                | BRAND_STATS 172K / 260K+; snapshot 2026-07-23; dual hardcode Diario                                                                           | Medio drift live IG           |
| **Case study Castelli del Ducato**             | PUBLIC_PROOF + CaseStudiesSection          | **SUPPORTATO come presenza**               | Componenti su Collaborazioni; metriche numeriche **non source-linked**                                                                        | Medio–alto claim numbers      |
| **Hero rewrite**                               | Baseline hardcoded → new H1                | **SUPPORTATO + migliorato**                | Hero usa `BRAND_PROMISE` da site.ts                                                                                                           | Basso                         |
| **Editorial promise rewrite**                  | Master CRIT-CONT-01                        | **PARZIALE**                               | Titles da BRAND_PROMISE; body pillars ancora hardcode (“Paghiamo il conto…”)                                                                  | Medio brand/legal             |
| **Navbar B2B visibility**                      | Master §7.3                                | **SUPPORTATO**                             | Mode switch + CTA; WIP rewrite grande                                                                                                         | Medio re-proof visual         |
| **Design tokens / anti raw colors**            | Master CRIT-A11Y; FASE_01 closed           | **PARZIALE**                               | Token migration in corso (dirty); residual UI warnings storici 383–430                                                                        | Medio                         |
| **WCAG 2.2 AA “piena conformità”**             | Master executive; FASE_01                  | **NON SUPPORTATO come claim totale**       | axe on-demand npx; TASK-019 ancora test necessario; no gate bloccante                                                                         | Alto overclaim                |
| **JSON-LD dual Person + Place mancante**       | Master CRIT-SEO-01                         | **PARZIALMENTE SUPERATO / outdated**       | DEFAULT_AUTHORS Person×2; Place builders; ChiSiamo Person; Articolo buildArticleJsonLd                                                        | Basso–medio completezza Posto |
| **Sitemap allineata**                          | COMPLETE / TASK-001                        | **SUPPORTATO struttura**                   | generate-sitemap + lastmod 2026-07-23; surfaces test                                                                                          | Re-run post route change      |
| **CMS custom, no WP**                          | Master §11                                 | **SUPPORTATO**                             | Admin suite presente                                                                                                                          | Basso                         |
| **Full audit 90% conf / suite green**          | COMPLETE evidence tags                     | **PARZIALE**                               | Evidence dirs + 19 unit files + 5 e2e; **non rieseguito** su dirty tree                                                                       | Medio stale                   |
| **predeploy 16/16 PASS**                       | COMPLETE AUDIT-009                         | **DICHIARATO only**                        | predeploy.mjs esiste; non rieseguito qui                                                                                                      | Medio                         |
| **Stripe webhook / rate limit / fail-fast**    | COMPLETE + e2e                             | **SUPPORTATO da presenza code+specs**      | HEAD c3bb51f fail-fast; server.ts dirty                                                                                                       | Re-verify                     |
| **Firebase API key restriction**               | AUDIT-002                                  | **SUPPORTATO come OWNER-BLOCKED**          | Decision owner GCP                                                                                                                            | P1 open                       |
| **Typecheck/lint/unit 0 errors**               | Master; implementation                     | **DICHIARATO 2026-07-23**                  | Dirty tree può invalidare                                                                                                                     | Medio                         |
| **Graphify fresco**                            | graphify-out                               | **STALE**                                  | built `430526ef` ≠ HEAD `c3bb51f`                                                                                                             | Medio                         |
| **“Audit completed, clean git”**               | Baseline Contradiction 2 / walkthrough ext | **CONTRADDETTO**                           | Tree ancora dirty; audit artifacts mixed                                                                                                      | Process                       |
| **Implementation Fase 0 ROI removed**          | 00_STABILIZZAZIONE status completed        | **CONTRADDETTO dal codice**                | ROI mounted                                                                                                                                   | **False completion**          |
| **Implementation Fase 1 nav**                  | 01_ARCHITETTURA                            | **QUASI SUPPORTATO**                       | Home Cinematic attiva; B2B nav; ma doc pro-ROI vs Master                                                                                      | Medio strategic               |
| **Homepage 7 sezioni Master**                  | Master §8                                  | **QUASI SUPPORTATO**                       | Live 6 sezioni curated + shell                                                                                                                | Basso                         |
| **Baseline forense conteggi 32/4/36**          | docs/audit/00_BASELINE                     | **STALE**                                  | Live 36 modified / 8 untracked / 44 dirty paths                                                                                               | Medio process                 |
| **DEVELOPMENT_PLAN TASK mass CLOSED**          | dirty plan                                 | **PARZIALMENTE NON SUPPORTATO**            | TASK-028 toast senza listener; alcuni CLOSED senza diff file                                                                                  | Medio false CLOSED            |
| **Contatti B2B complete**                      | implementation claims                      | **PARZIALE / CONTRADDETTO**                | UI company/budget; payload incompleto                                                                                                         | Alto lead quality             |

---

## 2. Hotspot di contraddizione (must-treat-as-fact)

### C1 — ROI Calculator (integrità audit)

| Fonte                                                | Posizione                                                                |
| ---------------------------------------------------- | ------------------------------------------------------------------------ |
| Master Audit                                         | RIMUOVERE                                                                |
| Baseline forense precedente                          | Contradiction remove-then-enhance                                        |
| `docs/implementation/00_STABILIZZAZIONE_BASELINE.md` | “RIMOZIONE TOTALE” + completed                                           |
| `docs/implementation/01_ARCHITETTURA_NAVIGAZIONE.md` | celebra calcolatore stime                                                |
| **Codice live 2026-07-24**                           | `RoiCalculatorWidget.tsx` untracked + import/render `Collaborazioni.tsx` |

**Verdetto:** fallimento di chiusura fase. Non è “audit sbagliato” né “code sbagliato” isolato — è **disallineamento triplo** audit ↔ implementation note ↔ runtime.

### C2 — Weekend Generator

| Fonte                   | Posizione               |
| ----------------------- | ----------------------- |
| Master                  | rimuovi da home         |
| CinematicHomepage dirty | rimosso                 |
| File widget             | ancora presente, orfano |
| Diario DEV              | ancora presente         |

**Verdetto:** obiettivo home **raggiunto**; cleanup incompleto.

### C3 — Metriche e case study

| Fonte                           | Posizione                                    |
| ------------------------------- | -------------------------------------------- |
| Master / brand honesty          | non gonfiare risultati                       |
| CaseStudiesSection + PressProof | numeri e quote forti senza URL               |
| site.ts                         | ER 6.5% / reach 500K+ senza Insights in-repo |

**Verdetto:** tensioni tra copy “sobria” e widget proof.

### C4 — Placeholder vs field-verified

| Fonte                     | Posizione                       |
| ------------------------- | ------------------------------- |
| BRAND_PROMISE / Editorial | zero desk, verificato sul campo |
| content-seed              | 40/40 placeholder               |

**Verdetto:** claim di metodo non supportato dallo stato contenuto.

### C5 — WCAG AA dichiarato

| Fonte                 | Posizione                            |
| --------------------- | ------------------------------------ |
| FASE_01 / Master tone | conformità                           |
| Tooling               | axe non bloccante; residual warnings |

**Verdetto:** overclaim di completezza a11y.

---

## 3. Affermazioni non dimostrate (shortlist)

1. “ROI rimosso” — **falsificata dal codice**.
2. “Piena conformità WCAG 2.2 AA” — **non dimostrata da gate**.
3. “predeploy 16/16” sullo stato **corrente** dirty — **non rieseguito**.
4. “87/87 unit green” sul dirty tree — **non rieseguito**.
5. Press quotes di testate nazionali — **nessuna URL/fonte in codice**.
6. Case study conversion metrics — **nessun export Insights**.
7. Contatti B2B “completo” — **campi non nel payload**.
8. TASK-028 CLOSED — **emitter senza consumer**.
9. Graphify “current architecture” — **indice su commit vecchio**.
10. Baseline precedente “36 total dirty” — **già superata (44)**.

---

## 4. Modifiche premature (implementazione senza chiusura forense)

| Area                 | Cosa è successo                          | Problema                                               |
| -------------------- | ---------------------------------------- | ------------------------------------------------------ |
| Collaborazioni       | Aggiunti 3 widget B2B (ROI, Case, Press) | Aumenta claim surface mentre audit diceva ridurre      |
| Contatti             | Audience switcher + company/budget       | UI senza wire dati completo                            |
| Navbar               | Rewrite mode + navigate                  | Comportamento prodotto non decision-logged chiaramente |
| server.ts            | Admin catch-all 200                      | High-risk file; deny Claude rimosso                    |
| DEVELOPMENT_PLAN     | Mass CLOSED                              | Chiusure non tutte riproducibili                       |
| Implementation notes | status completed                         | Falsificabili su ROI                                   |

---

## 5. Cosa resta valido dagli audit precedenti

| Tema                                            | Validità residua                            |
| ----------------------------------------------- | ------------------------------------------- |
| Stack CSR + Express meta                        | Valido                                      |
| Home = Cinematic curated                        | Valido                                      |
| Weekend off home                                | Valido (post dirty)                         |
| CMS custom keep                                 | Valido                                      |
| Firebase API key owner task                     | Valido open                                 |
| Stripe/security technical findings COMPLETE     | Direzionalmente forti se code+specs restano |
| Necessità di proof B2B onesti                   | Valido e **urgente**                        |
| Cleanup orphan home components (commit 545b4b0) | Valido; restano altri orphan                |
| Superfici preview/soon (itinerari, shop)        | Valido                                      |

---

## 6. Policy per Grok audit series

1. **Nessuna nota `status: completed` senza prova codice + SHA.**
2. **Master Audit non è legge se contradetto dal tree — ma le sue raccomandazioni strategiche restano input.**
3. **Implementation Antigravity si tratta come ipotesi, non truth.**
4. **Evidence Playwright storica = indizio, non prova fresca.**
5. **Questa serie scrive solo in `docs/audit-grok45/` finché l’utente non autorizza fasi successive.**

---

## 7. Riferimenti

- Baseline Grok: `00_BASELINE_FORENSE.md`
- Route matrix: `01_ROUTE_PAGE_SECTION_MATRIX.md`
- Claims: `02_CONTENT_DATA_CLAIMS.md`
- Tools: `03_TOOLS_TESTS_GAPS.md`
- State: `AUDIT_STATE.md`
- Roadmap: `AUDIT_ROADMAP.md`
