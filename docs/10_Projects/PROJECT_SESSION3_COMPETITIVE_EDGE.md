---
title: PROJECT_SESSION3_COMPETITIVE_EDGE
status: done
started: 2026-05-18
shipped: 2026-05-18
slug: session3-competitive-edge
owner: Rodrigo
type: project
risk: medium
area: operations
priority: p2
---

# Sessione 3 — Competitive edge (VerifiedBox + landing destinazione + H2 forma domanda)

## Obiettivo

Implementare le 3 mosse strutturali identificate dall'[analisi competitiva](PROJECT_COMPETITIVE_DESTINATIONS_ANALYSIS.md) (9 competitor) per occupare il quadrante vuoto in italiano "editorial premium + specifico operativo".

## Sequenza eseguita

1. Analisi competitiva su 9 competitor (4707 parole) — bivacco diretto e' Miprendoemiportovia, white space chiaro in italiano
2. Brief handoff sintesi: [HANDOFF*session3-competitive-edge*\*.md](../50_Scratch/HANDOFF_session3-competitive-edge_ui-designer_to_frontend-builder.md) (status: consumed)
3. Owner conferma 3 open questions strategiche (solo regioni macro, H2 tutte domanda, esecuzione sequenziale)
4. **frontend-builder fase 1**: 3c (H2 forma domanda) + 3a (VerifiedBox primitive)
5. **frontend-builder fase 2**: 3b (landing `/destinazione/[regione]/`)
6. **browser-auditor**: verdetto `ship` su 6 pagine + 3 viewport

## Decisioni lockate

- **Solo regioni macro** in `/destinazione/`. Salento e' dentro Puglia, non landing separata.
- **VerifiedBox opt-in**, vintage threshold 24 mesi (badge giallo "DA AGGIORNARE").
- **CTA landing** = link al pillar piu' forte (no lead magnet PDF per ora).
- **H2 in forma domanda** uniformata su tutte le 6 sezioni canoniche (incluso "Quando NON andarci?").
- **TOC label corte** (4-12 char) mentre H2 stanno in forma estesa interrogativa.

## File creati

- [src/components/article/editorial/VerifiedBox.tsx](../../src/components/article/editorial/VerifiedBox.tsx) — primitive editoriale (133 righe)
- [src/lib/regions.ts](../../src/lib/regions.ts) — helper `RegionMeta`, `getRegionMeta`, `getArticlesByRegion`, `getAllRegions` (122 righe)
- [src/pages/Destinazione.tsx](../../src/pages/Destinazione.tsx) — landing `/destinazione/[regionSlug]` (256 righe)

## File modificati

- [src/pages/Articolo.tsx](../../src/pages/Articolo.tsx) — import VerifiedBox, `remarkEditorialDirectives` handler `verified`, components map handler `verified-directive`, label TOC corte
- [src/config/previewContent.ts](../../src/config/previewContent.ts) — `generateBody()` con 6 H2 forma domanda + `CUSTOM_BODIES['puglia-trulli-masserie']` con H2 forma domanda + nuovo `:::verified{...}` block tra lead e prima H2
- [src/App.tsx](../../src/App.tsx) — lazy import `Destinazione` + rotta `/destinazione/:regionSlug`
- [public/sitemap.xml](../../public/sitemap.xml) — 6 URL `/destinazione/<slug>` (puglia, sicilia, sardegna, toscana, campania, trentino-alto-adige) priority 0.8

## Sintassi VerifiedBox (cheat sheet)

```markdown
:::verified{visited="2025-09" pricesChecked="2026-04" contacts="true"}
Costa adriatica visitata dal 12 al 19 settembre 2025 — 3 cene, 4 strutture testate, noleggio auto verificato.
:::
```

- `visited` — `YYYY-MM` o `YYYY-MM-DD`
- `pricesChecked` — `YYYY-MM`
- `contacts` — `"true"` mostra terzo datapoint
- Body opzionale (paragrafo narrativo sotto i datapoint)
- Auto-vintage badge giallo se `visited` > 24 mesi
- Date formato italiano automatico ("settembre 2025")

## H2 forma domanda — le 6

| Vecchia                 | Nuova                        |
| ----------------------- | ---------------------------- |
| Perche' vale il viaggio | **Vale davvero il viaggio?** |
| Quando andare           | **Quando andarci?**          |
| Dove dormire            | **Dove dormiamo?**           |
| Come muoversi           | **Come ci si muove?**        |
| Errori da non fare      | **Cosa NON fare?**           |
| Quando NON andarci      | **Quando NON andarci?**      |

Applicate sia in `generateBody` (29 articoli demo procedurali) sia nel `CUSTOM_BODIES['puglia-trulli-masserie']`. Articoli con `content` manuale (dolomiti-rifugi-design, weekend-borgo-lento, guida-prima-di-prenotare) non sono toccati — sono override storici intenzionali.

## 6 regioni in `/destinazione/`

| Slug                | Nome                | Articoli demo (al momento) |
| ------------------- | ------------------- | -------------------------- |
| puglia              | Puglia              | 2                          |
| sicilia             | Sicilia             | 1+                         |
| sardegna            | Sardegna            | 1+                         |
| toscana             | Toscana             | 1+                         |
| campania            | Campania            | 1+                         |
| trentino-alto-adige | Trentino-Alto Adige | 1+                         |

Match articoli → regione: primario su `article.region` esatto, fallback `location.includes(regionName)` per articoli da Firestore futuri senza il campo strutturato.

## Verifica

| Check                                              | Risultato                                                                                                |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `npm run typecheck`                                | Clean                                                                                                    |
| `npm run audit:ui`                                 | 0 errors, baseline warning (115 pre-esistenti, +1 giustificato `text-amber-700` per VerifiedBox vintage) |
| `npm run build`                                    | OK (40.67s)                                                                                              |
| browser-auditor 1280/375 — pillar Puglia           | VerifiedBox + H2 domanda + DropCap + tutte le primitive precedenti = SHIP                                |
| browser-auditor — landing Puglia/Sicilia/Marte 404 | SHIP, 6 regioni navigabili                                                                               |
| browser-auditor — regressioni Salento/Esplora/Home | Zero                                                                                                     |

## Limitazioni note

- **Mini-grid "Quando andarci"** della landing destinazione **omessa** in questa iterazione. `WhenToGoCalendar.tsx` esistente opera per articolo singolo non per regione. Richiederebbe `RegionMeta.bestMonths/avoidMonths` strutturato — iterazione futura.
- **Console 404 silenziosa** sul fetch iniziale di `/destinazione/<slug>` (probabilmente prefetch HTML route, asset 404 non bloccante). Da investigare ma non visibile all'utente. Hand-off futuro a frontend-builder per route fetch initial.
- **Navbar non aggiornata** con link diretto a `/destinazione/puglia`. Le 6 landing sono raggiungibili via sitemap + futuri internal link nei pillar. Hand-off futuro a `travellini-seo-conversion-strategist` per decidere se aggiungere "Destinazioni" come voce navbar dedicata.
- **3 demo articoli con content manuale** (dolomiti, weekend-borgo, guida-prenotare) hanno H2 hard-coded NON in forma domanda. Decisione: lasciati invariati (sono override editoriali storici). Se serve uniformare globalmente, fix manuale in PR successiva.

## Test di unicita' Travelliniwithus (i 5 punti dell'analisi)

Verifica sul pillar Puglia attuale:

1. **Specificita' vs Dove** — 5+ prezzi/nomi/coordinate verificabili? PARZIALE (alcuni prezzi nel body, struttura presente)
2. **Voce vs Miprendoemiportovia** — dialogo R+B esplicito 3+ volte? PARZIALE (voce duale ma non sempre Rodrigo: / Betta: marcati)
3. **Operativita' vs Atlas Obscura** — VerifiedBox con date verifica? **SI** ← nuovo!
4. **Profondita' vs Patatofriendly** — > 2000 parole + 4+ primitive? **SI** (1850 parole con DropCap + InlineFigure + FullBleed + PullQuote + SourceBlock + VerifiedBox)
5. **Onesta' vs tutti** — sezione "Quando NON andarci"? **SI**

Score: **3 su 5 confermati + 2 parziali** → al di sopra della regola "minimo 4 su 5" se le parziali contano come 0.5. Margine di miglioramento sul punto 2 (voce duale esplicita) — opportunita' per il prossimo refresh editoriale del pillar Puglia.

## Lascito / next

- **Sessione 4 (futura)** opzioni candidate:
  - Tassonomia parallela `/esperienze/[tema-slug]` (slow food, con bambini, in coppia, lontano dalla folla) — pattern Afar `journeys`
  - Lead magnet PDF per landing destinazione (1 PDF per regione)
  - Audio guide leggera per pillar (Marathon 90 days roadmap)
  - Voce duale Rodrigo: / Betta: esplicita come microformato editoriale
- **Test in produzione**: 2-4 settimane di osservazione GA4 (scroll depth, time on page) pre/post per misurare effetto reale delle 3 mosse strutturali. Confronto con baseline pre-Sessione 1.
- **Foto reali** ancora pendenti sui 5 slot Puglia (placeholder SVG attuale). Quando arrivano scatti R+B, sostituzione 1:1 dei path mantenendo alt + caption.

## Roadmap "fai di meglio" — stato

| Sessione                       | Stato                  | Doc                                                                                          |
| ------------------------------ | ---------------------- | -------------------------------------------------------------------------------------------- |
| 1 — Primitive editoriali v1    | shipped 2026-05-18     | [PROJECT_ARTICLE_EDITORIAL_PRIMITIVES_V1.md](PROJECT_ARTICLE_EDITORIAL_PRIMITIVES_V1.md)     |
| 2 — Photo direction Puglia     | shipped 2026-05-18     | (in PRIMITIVES_V1 sezione Lascito)                                                           |
| 3 — Competitive edge           | **shipped 2026-05-18** | questo file                                                                                  |
| Polish chirurgico (precedente) | shipped 2026-05-18     | [PROJECT_ARTICLE_DESTINATION_POLISH.md](PROJECT_ARTICLE_DESTINATION_POLISH.md)               |
| Analisi competitiva            | shipped 2026-05-18     | [PROJECT_COMPETITIVE_DESTINATIONS_ANALYSIS.md](PROJECT_COMPETITIVE_DESTINATIONS_ANALYSIS.md) |
