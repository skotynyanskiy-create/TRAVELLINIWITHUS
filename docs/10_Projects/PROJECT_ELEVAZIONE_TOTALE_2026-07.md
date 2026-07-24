---
type: project
area: product
status: in-progress
priority: p1
owner: team
started: 2026-07-24
related: '[[PROJECT_REDESIGN_DIREZIONE_2026-07-22]] · [[PROJECT_FAMILY_AREA_2026-07-24]] · [[PROJECT_RELEASE_READINESS]]'
tags:
  - project
  - design
  - elevazione
---

# PROJECT — Elevazione totale (operazione chirurgica, 2026-07)

Piano approvato dall'owner 2026-07-24: raffinamento enterprise di ogni pagina
(UI/UX/design/copy), con direzione creativa NUOVA scelta dall'owner dopo ricerca,
librerie ammesse con scheda di valutazione, esecuzione pagina-per-pagina al 10/10.
Piano completo in `.claude/plans/` (sessione 2026-07-24); struttura: FASE R
(ricerca+direzione) → FASE 0 (bonifica) → FASE F (fondamenta) → 1..N (pagine).

## Stato

| Voce                         | Stato                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FASE R — ricerca & direzione | ⏳ da avviare (design-research + 3 direction pages in `design-lab/`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| FASE 0.1 — SEO emergency     | ✅ 2026-07-24 — FALSO POSITIVO: /itinerari\* e /shop erano GIÀ noindex via registro surfaces (verificato nel browser: robots `noindex, nofollow`). Nessun fix necessario. Resta il gate owner: itinerari standby vs reali.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| FASE 0.2 — bug               | ✅ 2026-07-24 — Contatti: company/budget ora incorporati nel messaggio (endpoint accetta solo 5 campi, server.ts:1597; campo dedicato = estensione futura high-risk). Club: bottone "Ricevuta PDF" morto rimosso.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| FASE 0.3 — integrità B2B     | ✅ 2026-07-24 — RoiCalculatorWidget rimosso da /collaborazioni (file resta su disco per la pulizia 0.7). CaseStudiesSection: da "Case Study & Proof Reali" con metriche inventate (142.000+, 8.4%, 89.500+, 9.2%…) a "Format di collaborazione" con soli fatti verificabili; unico nome reale mantenuto: Castelli del Ducato. PressProofSection RISCRITTA: rimosse 4 citazioni attribuite a TGCOM24/Vanity Fair/Repubblica/Radio105 senza fonte (rischio reputazionale), rimosso "Compliance 100% AGCM", rimossi i gradient blob vietati; restano solo credenziali verificabili (AGCOM, Meta verified, pratica disclosure). MediaKit: rimossa nota interna "AGGIORNARE IN CALL", cella Reach → "In call / dai dati nativi Meta". |
| FASE 0.4 — CMS-ombra         | ⏳ (chiavi siteContent morte + override inline ChiSiamo/Collaborazioni)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| FASE 0.5 — micro-fix         | ✅ 2026-07-24 — accenti Risorse (3), bottone Airalo mostra il codice ("Airalo: TRAVELLINI3 — copia"; VERIFICARE con owner che il codice sia giusto), testo redazionale interno CMS sostituito con copy pubblico.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| FASE 0.6 — perf quick-win    | ⏳ (registerSW defer, font preload, hero preload condizionale)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| FASE 0.7 — pulizia dormienti | ⏳ (dopo scelta direzione: si elimina ciò che la direzione non riusa)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| FASE F — fondamenta          | ⏳ (dopo FASE R)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Pagine 1..N                  | ⏳ (ordine: home → posto → esplora → chi-siamo → collab+mediakit → family → …)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

## Gate owner aperti

1. Direzione creativa (fine FASE R — 3 direction pages da navigare).
2. Itinerari: standby (restano noindex) vs produrne 2-3 reali.
3. Metriche B2B: fornire export verificabili o confermare il formato senza numeri.
4. Timeline biografica unica (Cuba/anni) prima del copy di chi-siamo.
5. Diritti foto coppia/gravidanza per chi-siamo e family hero.
6. Codice Airalo: confermare che "TRAVELLINI3" è corretto.
7. Ogni npm install (scheda valutazione prima).

## Backlog (idee fuori contratto-pagina)

- Campo dedicato company/budget nell'endpoint contact-lead (server.ts, high-risk).
- Offline page vera (catchHandler/injectManifest).
- Refactor seoRoutes→surfaces (fase 7b del progetto family).
