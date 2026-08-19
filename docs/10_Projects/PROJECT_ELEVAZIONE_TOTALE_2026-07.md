---
type: project
area: product
status: archived
priority: p1
owner: team
started: 2026-07-24
related: '[[PROJECT_REDESIGN_DIREZIONE_2026-07-22]] · [[PROJECT_FAMILY_AREA_2026-07-24]] · [[PROJECT_RELEASE_READINESS]]'
tags:
  - project
  - design
  - elevazione
icebox_reason: in attesa di funnel con traffico reale
---

> **Icebox dal 2026-07-31.** Non superato: contiene feature reali mai decise.
> Va ripescato _dopo_ che il funnel ha un ingresso — vedi [[10_Projects/PROJECT_BACKLOG_UNICO_2026-07-31]] §1.
> Non è il backlog corrente.

# PROJECT — Elevazione totale (operazione chirurgica, 2026-07)

Piano approvato dall'owner 2026-07-24: raffinamento enterprise di ogni pagina
(UI/UX/design/copy), con direzione creativa NUOVA scelta dall'owner dopo ricerca,
librerie ammesse con scheda di valutazione, esecuzione pagina-per-pagina al 10/10.
Piano completo in `.claude/plans/` (sessione 2026-07-24); struttura: FASE R
(ricerca+direzione) → FASE 0 (bonifica) → FASE F (fondamenta) → 1..N (pagine).

## Stato

| Voce                         | Stato                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FASE R — ricerca & direzione | 🔶 2026-07-24 R1-R4 FATTE, resta il GATE OWNER (scelta direzione). R1: `docs/30_Design/RESEARCH_DOSSIER_ELEVAZIONE_2026-07.md` — 13 riferimenti verificati nel browser reale. R2: zero install necessarie (SplitText già free in gsap 3.15; watch-item rough-notation). R3: `docs/30_Design/DIREZIONI_CREATIVE_ELEVAZIONE_2026-07.md` via ui-designer — A «Rivista Viva» (journal-\*), B «Atlante di Coppia» (trace-rail + codici), C «Album Cinematico» (full-bleed + didascalie). R4: 4 pagine in `design-lab/` (index + 3 direzioni) con token reali, specimen Fraunces, demo gesto-firma, cover reel reali — verificate nel browser. R5 (DECISION + FOUNDATIONS_SPEC) parte DOPO la scelta.                                  |
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

1. Direzione creativa — **PRONTO PER LA SCELTA**: aprire `design-lab/index.html`
   (confronto + 3 pagine navigabili). Sotto-gate elencati in
   `DIREZIONI_CREATIVE_ELEVAZIONE_2026-07.md`: base scura journal (A),
   trace-red vs terracotta (A/B), famiglia manoscritta (A), rough-notation (B),
   passaggio asset-curator per i frame reali (C, bloccante).
2. Itinerari: standby (restano noindex) vs produrne 2-3 reali.
3. Metriche B2B: fornire export verificabili o confermare il formato senza numeri.
4. Timeline biografica unica (Cuba/anni) prima del copy di chi-siamo.
5. Diritti foto coppia/gravidanza per chi-siamo e family hero.
6. Codice Airalo: confermare che "TRAVELLINI3" è corretto.
7. Ogni npm install (scheda valutazione prima).
8. Registro/accento Family («Un DNA, tre registri», addendum Polarsteps in
   `DIREZIONI_CREATIVE_ELEVAZIONE_2026-07.md`): serve un token nuovo — decidere
   insieme alla direzione.

## Backlog (idee fuori contratto-pagina)

- Campo dedicato company/budget nell'endpoint contact-lead (server.ts, high-risk).
- Offline page vera (catchHandler/injectManifest).
- Refactor seoRoutes→surfaces (fase 7b del progetto family).
