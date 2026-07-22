---
title: "PROJECT — L'Atlante delle Meraviglie Vere"
type: project
status: in-progress
updated: 2026-07-22
area: product
tags:
  - atlante
  - redesign
  - posto
  - brand
---

# L'Atlante delle Meraviglie Vere

Redesign approvato dall'owner il 2026-07-22. Il sito smette di essere un blog
editoriale generico e diventa **l'atlante permanente dei posti che Rodrigo e
Betta hanno provato davvero**: quello che i reel possono solo mostrare per 30
secondi, qui resta cercabile, verificato e utile.

> Il dispositivo firma: ogni posto ha due facce. **«Sembra inventato»** (la foto)
> ⇄ **«Esiste davvero»** (la scheda: dove, prezzo, per chi è / per chi no,
> verdetto, trasparenza). Il timbro gira la carta.

Concept, direzioni scartate e piano completo: piano di sessione
`analyze-the-existing-travelliniwithus-sharded-pebble.md`.
Regola immagini: `docs/20_Decisions/DECISION_IMAGERY_TRUTH_RULE_2026-07-22.md`.
Composizione home: `docs/TRAVELLINI-HOMEPAGE.md`.

## Stato delle fasi

| Fase | Contenuto                                                                              | Stato                            |
| ---- | -------------------------------------------------------------------------------------- | -------------------------------- |
| 0    | Truth rule ratificata, `CLAUDE.md` + `ASSET_STRATEGY.md` emendati                      | ✅ 2026-07-22                    |
| 0.5  | Token `--color-atlante-*` + `src/styles/atlante.css`                                   | ✅ 2026-07-22                    |
| 1    | Vertical slice: home atlante + `PostoStamp` su `/posto/:slug`                          | ✅ 2026-07-22                    |
| 2    | Reskin atlante di `/esplora` + `/mappa` (switch Mappa\|Archivio)                       | ✅ 2026-07-22                    |
| 3    | Rimozione coppia AI dalle superfici live                                               | ✅ 2026-07-22                    |
| 4    | Bio hub: deep link reel → scheda del posto                                             | ✅ 2026-07-22                    |
| 5    | Cancellazione dead code (3 home vecchie, `V2/`, `experience/*`, ~14 componenti orfani) | ⏸ gated owner                    |
| 6    | `server.ts`: fix 404 `/posto/:slug` + rimozione prerender Sentiero                     | ⏸ gated owner + backend-engineer |
| 7    | De-placeholdering continuo dei 40 posti (3-5/settimana)                                | ⏸ dipende da 6                   |

## Componenti dell'atlante

| File                                               | Ruolo                                                               |
| -------------------------------------------------- | ------------------------------------------------------------------- |
| `src/components/atlante/PostoStamp.tsx`            | la carta a due facce (fronte foto ⇄ retro scheda)                   |
| `src/components/atlante/SchedaVerifica.tsx`        | le righe della scheda, condivise home ↔ posto                       |
| `src/components/atlante/AtlanteCard.tsx`           | riga del registro (indice)                                          |
| `src/components/atlante/AtlanteViews.tsx`          | switch Mappa \| Archivio (lite-aware)                               |
| `src/components/home/cinematic/HomeIndiceVivo.tsx` | il registro in home                                                 |
| `src/styles/atlante.css`                           | primitive riusabili (`atlante-paper/-ledger/-scheda/-stamp/-views`) |

Dati: `src/data/content-seed.json` → `getRegistroItems` / `getContentById`
(`src/config/contentLibrary.ts`). Reel → posto: `postoId` su `ReelEntry`
(`src/config/reels.ts`), oggi mappato su 3 reel su 5.

## Onestà del contenuto — regole che il codice applica

- Un posto senza dati verificati **non finge di averli**: la scheda dichiara
  «In arrivo — lo pubblichiamo solo verificato fino all'ultimo euro».
- `isPlaceholder: true` ⇒ `noindex` (`Posto.tsx`): le schede incomplete restano
  visibili ma fuori dall'indice.
- Il registro etichetta ogni voce: «Scheda completa» vs «Scheda in lavorazione».
- Nessun voto, prezzo o periodo entra in `content-seed` senza `/verify-facts`.

## Verifica 2026-07-22 (fasi 0-4)

typecheck · lint 0 warning · unit 71/71 · build · `audit:size` (home 12,5/110 KB)
· e2e 34/34 · Lighthouse: `/` 98 perf / 100 a11y / CLS 0.000, tutte e 6 le rotte
del gate passano (a11y ≥95, CLS ≤0.1) · nessun overflow orizzontale a 375px ·
console pulita.

## Prossimo passo bloccante

Certificare la provenienza di `home-journal/hero-impossible` (owner) e sbloccare
la Fase 6: senza il fix del 404 su `/posto/:slug` nessuna scheda può diventare
indicizzabile, e l'intero valore SEO dell'atlante resta fermo.
