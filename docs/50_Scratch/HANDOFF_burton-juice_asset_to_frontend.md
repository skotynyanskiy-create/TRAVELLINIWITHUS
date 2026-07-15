---
title: HANDOFF_burton-juice_asset_to_frontend
status: open
created: 2026-07-15
from: travellini-asset-curator
to: travellini-frontend-builder
slug: burton-juice-ristorante-tim-burton
expires: 2026-07-29
type: handoff
area: delivery
---

# Handoff: build pagina pillar "The Burton Juice" con scheda recensione

## Why this work matters

Tutti i pezzi (brief, SEO, body, foto reali, recensione) sono pronti nella
content note. Ora vanno assemblati nel seed e resi live come pagina articolo
funzionante, con la scheda recensione renderizzata correttamente e zero
overflow mobile.

## Decisions already made (locked)

- Slug/route: `/articolo/burton-juice-ristorante-tim-burton` (fissi).
- La pagina **deve renderizzare la scheda recensione** via il campo `review`
  su `ArticleData` (componenti `ReviewBlock` + `RatingPill` gia' esistenti).
- Solo le immagini reali indicate dall'asset-curator (mai AI). `coverImage`
  sostituisce il placeholder `/hero-adventure.jpg`.
- H1, meta/excerpt, body, alt: tutti gia' definiti a monte nella content note —
  trascrivi, non riscrivere.
- Content italiano, un solo H1, CTA specifica, nessun overflow orizzontale
  mobile (quality bar del progetto).

## Context the receiver needs

- Content note sorgente (Brief + SEO + Body + Assets tutti compilati):
  [ARTICLE_burton-juice-ristorante-tim-burton.md](../13_Content/ARTICLE_burton-juice-ristorante-tim-burton.md)
- Seed da completare:
  `src/data/articles/burton-juice-ristorante-tim-burton.seed.ts`
  (oggi: `excerpt` placeholder, `content` placeholder, `coverImage`
  placeholder, `tags: []`, `published: false`).
- Tipi e componenti:
  - `ArticleData` / `ContentReview` in `src/components/article/types.ts` e
    `src/types/content.ts` (campo `review`: overall, verdict, summary,
    criteria[{name,score}], pros[], cons[]).
  - Render recensione: `src/components/ReviewBlock.tsx`,
    `src/components/RatingPill.tsx`.
  - Rendering articolo: `src/pages/Articolo.tsx`, primitive editoriali in
    `src/components/article/editorial/`.
- Pipeline dati articolo: `src/utils/articleData.ts`,
  `src/utils/contentArchive.ts`.

## What the receiver should produce

- Seed completato: `excerpt` (dalla SEO), `content` (body markdown
  dall'editorial), `coverImage` + alt (dall'asset), `tags`, campo `review`
  popolato con i dati reali dell'owner, JSON-LD/schema secondo la SEO.
- Immagini reali posizionate sotto `public/` ai path indicati dall'asset.
- Pagina live su localhost a `/articolo/burton-juice-ristorante-tim-burton`
  con hero, body, scheda recensione e OG corretti.
- `published: false` finche' il gate non passa e l'owner non approva (vedi
  stop condition nel piano orchestratore).
- `npm run typecheck` e `npm run audit:ui` verdi dopo le modifiche.
- Verifica reale nel browser (preview / chrome-devtools) con prova visiva:
  hero, ReviewBlock, mobile senza overflow.

## Out of scope (do NOT touch)

- `server.ts`, `firestore.rules`, `src/config/admin.ts`: VIETATI da questo
  agent (solo `travellini-backend-engineer`, con conferma owner). Questo pillar
  non li richiede.
- Non riscrivere copy/SEO/body ne' modificare i voti recensione.
- Non introdurre immagini AI o placeholder inglesi.
- Non abilitare `published: true` prima del gate + ok owner.

## Open questions / decisions for the user

- Se manca ancora il campo `review` reale (dati owner non forniti), NON
  inventarlo: build la pagina con la review omessa (il componente si renderizza
  solo se `review` e' presente) e segnala che manca per il go-live.

## Next hand-off

- Next agents (in parallelo dopo la pagina live):
  1. `travellini-social-content-operator` — brief
     `HANDOFF_burton-juice_frontend_to_social.md`.
  2. Gate `travellini-quality-auditor` + `browser-auditor` — brief
     `HANDOFF_burton-juice_frontend_to_gate.md`.
- Trigger: pagina live su localhost, typecheck + audit:ui verdi, prova visiva
  condivisa.

## Notes

`ReviewBlock` si renderizza solo se `review` e' definito: e' il modo pulito per
gestire lo stato "recensione in attesa dati owner" senza rompere la pagina.
