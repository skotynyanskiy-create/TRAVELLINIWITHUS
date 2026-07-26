---
title: HANDOFF_burton-juice_frontend_to_gate
status: open
created: 2026-07-15
from: travellini-frontend-builder
to: travellini-quality-auditor + browser-auditor
slug: burton-juice-ristorante-tim-burton
expires: 2026-07-29
type: handoff
area: delivery
---

# Handoff: gate qualita' del pillar "The Burton Juice" (static + real-browser)

## Why this work matters

E' l'ultimo cancello prima del go-live del pillar. Verifica che la pagina
regga la quality bar del progetto (static + browser reale) e che la scheda
recensione — l'elemento nuovo — si comporti bene su mobile e desktop.

## Decisions already made (locked)

- Questo pillar NON tocca shop/lead-capture/checkout/`server.ts`/
  `firestore.rules`/`admin.ts`: **security-auditor NON e' richiesto** per questo
  articolo (nessuna superficie sensibile toccata).
- Perf: e' una nuova rotta pubblica image-heavy → **minimo obbligatorio =
  browser-auditor misura LCP**. Escala a `travellini-perf-engineer` SOLO se LCP
  mobile > 2.0s.
- La pagina resta `published: false` finche' questo gate e' verde E l'owner ha
  approvato il body + il voto recensione.

## Context the receiver needs

- Rotta da auditare: `/articolo/burton-juice-ristorante-tim-burton` (dev server
  attivo: `npm run dev`).
- Seed/pagina: `src/data/articles/burton-juice-ristorante-tim-burton.seed.ts`,
  `src/pages/Articolo.tsx`.
- Componenti recensione da stressare: `src/components/ReviewBlock.tsx`,
  `src/components/RatingPill.tsx`.
- Content note (per confronto fatti/alt/H1):
  [ARTICLE_burton-juice-ristorante-tim-burton.md](../13_Content/ARTICLE_burton-juice-ristorante-tim-burton.md)

## What the receiver should produce

**travellini-quality-auditor (static):**

- `npm run typecheck` PASS
- `npm run audit:ui` PASS (CSS vars, no inline style, a11y, icone, wrapper)
- `npm run audit:visual` PASS
- Check: un solo H1, meta + excerpt presenti, alt italiano su tutte le
  immagini, nessun placeholder inglese, nessuna immagine AI, tutti i `[VERIFY]`
  risolti o esplicitamente non pubblicati.

**browser-auditor (real-browser, Playwright MCP):**

- Nessun overflow orizzontale mobile su `/articolo/burton-juice-...`.
- `ReviewBlock` + `RatingPill` renderizzano corretti su mobile e desktop
  (voto, criteri, pro/contro leggibili, nessun clipping).
- Console pulita (no error/warning bloccanti), immagini reali caricano (no 404).
- **Misura LCP** su mobile 4G: soglia <= 2.0s. Se sfora, handoff a
  perf-engineer.
- OG card corretta.

## Out of scope (do NOT touch)

- Non modificare copy, seed, o codice: siete auditor. I fix vanno rimandati al
  `frontend-builder` (UI) o `asset-curator` (immagini), poi re-audit.
- Non abilitare `published: true`: e' decisione owner post-gate.

## Open questions / decisions for the user

- Se LCP sfora per peso immagini, decidere se ottimizzare (asset-curator +
  perf-engineer) o ridurre il numero di foto: non degradare la qualita' reale
  con upscale/AI.

## Next hand-off

- Next agent: none — se verde, `travellini-frontend-builder` esegue
  `/verify-facts` finale su prezzi/orari, poi review owner → `published: true`.
- Trigger: entrambi gli audit verdi + LCP <= 2.0s.

## Notes

Gate site-wide separato: il deploy in produzione del sito e' bloccato da leak
storici GCP-key in git history (owner action, vedi PROJECT_RELEASE_READINESS).
NON e' un blocker di questo pillar (che vive nella content pipeline sul sito
gia' live), ma va ricordato quando si pianifica il go-live pubblico complessivo.
