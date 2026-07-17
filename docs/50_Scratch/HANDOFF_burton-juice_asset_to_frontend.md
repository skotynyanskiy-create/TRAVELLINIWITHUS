---
title: HANDOFF_burton-juice_asset_to_frontend
status: blocked
created: 2026-07-15
updated: 2026-07-16
from: travellini-asset-curator
to: travellini-frontend-builder
slug: burton-juice-ristorante-tim-burton
expires: 2026-07-30
type: handoff
area: delivery
---

# Handoff: build pagina pillar "The Burton Juice" con scheda recensione

## ASSET STATUS (aggiornato 2026-07-16 da travellini-asset-curator) — BLOCKED

**Le foto reali NON esistono ancora in repo.** Non wirare immagini finché R+B
non consegnano il materiale. Verificato: il reel pinned NON è tra i 5 MP4 in
`public/video/`; `content-seed.json`/`campania-burton-juice` ha `cover: ""`;
il seed usa il placeholder `/hero-adventure.jpg` (NON il locale). Nessun frame
estraibile (manca anche il video-sorgente). Path con immagini inventate = 404 +
violazione DNA (niente AI/stock).

- **Fonte del piano immagini:** sezione `## Assets` della content note (tabella
  path/ruoli/pesi + alt IT + OG brief + richiesta materiali a R+B). Leggila prima
  di toccare le immagini.
- **Sblocco immagini:** R+B consegnano almeno il set minimo (1 scatto
  **orizzontale** ingresso/sala Alice per hero+OG + 1 attori in sala) E i diritti
  sono confermati. Hero/OG da scatto orizzontale, NON da frame verticale del reel.
- **Path target:** `public/images/articles/burton-juice/` con varianti responsive
  `-320/-480/-768/-1280` in `.avif` + `.webp`. Hero `eager` + preload (LCP);
  sezioni lazy; `<picture>` con fallback WebP; OG 1200×630 JPG ≤300KB.
- **Rights da risolvere:** `content-seed.json` marca `adv @theburtonjuice`, il
  brief editorial dice "organico puro". Discrepanza da chiarire con owner +
  conferma diritti d'uso web di ogni immagine prima di pubblicare.
- **Nel frattempo puoi comunque** procedere sul resto (seed testo, struttura,
  review) tenendo `coverImage`/figure come placeholder e `published: false`.

## Why this work matters

Il body/SEO/recensione vanno assemblati nel seed e resi live come pagina
articolo funzionante, con la scheda recensione renderizzata correttamente e zero
overflow mobile. Le immagini reali si aggiungono a materiale ricevuto (vedi
ASSET STATUS sopra).

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
