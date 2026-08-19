---
title: HANDOFF_dormire-posti-sembrano-inventati_asset_to_frontend
status: consumed
created: 2026-08-18
from: travellini-asset-curator
to: travellini-frontend-builder
slug: dormire-posti-sembrano-inventati
expires: 2026-09-30
type: handoff
area: delivery
---

# Handoff: applicare hero, section photo e OG card al pillar «Posti che sembrano inventati, e ci dormi»

## Why this work matters

Il photo plan è chiuso (`docs/13_Content/ARTICLE_dormire-posti-sembrano-inventati.md`,
sezione `## Assets`). Mancano solo i collegamenti in codice/seed e la card OG
finale — senza quelli l'articolo pubblica con hero e sezioni vuote e con un
og:image tipografico che non prova la tesi del pezzo ("ci siamo stati davvero").

## Decisions already made (locked — non rilitigare)

1. **Hero = Emotional Grand Motel**, non Spino Fiorito (motivazione completa
   nella content note). File già ritagliati e ottimizzati.
2. **Le cover del registro/manifest reel restano intatte.** Ogni asset nuovo è
   un file separato in `public/images/articles/dormire-posti-sembrano-inventati/`,
   non una sostituzione. Provenienza già registrata in
   `src/data/asset-provenance.json` (`real-frame`), `npm run audit:provenance`
   verde.
3. **5 section photo, una per ciascuna delle voci senza blocco** (Placat,
   Fattorie di Celli, Enjoy House, Suite Spa Civico 4, Relais Freedom) — markdown
   pronto da incollare nella content note.
4. **OG card fotografica, non il template tipografico standard.** Sorgente
   1200×630 già pronta; manca solo la composizione finale (testo + scrim).

## Context the receiver needs

- Photo plan completo, con tabelle pesi/crop/alt: `ARTICLE_dormire-posti-sembrano-inventati.md`, sezione `## Assets`.
- File immagine nuovi: `public/images/articles/dormire-posti-sembrano-inventati/`
  (hero + 5 section photo, ciascuno con `.webp`/`.avif` base + varianti
  `-480`/`-768`, più `og-source-emotional-grand-motel.jpg`).
- `ArticleHero.tsx:53-60` — l'`<OptimizedImage>` esiste già, prende `article.image`
  / `article.imageAlt` dal seed. Basta puntare quei due campi ai file nuovi.
- `ArticleMarkdownBody.tsx:135-138` → `InlineFigure.tsx` — renderizza le immagini
  markdown del corpo con un `<img>` **semplice**, non `OptimizedImage`: **nessun
  `<picture>` con sorgente AVIF** per le immagini inline. Il markdown fornito
  punta al `.webp` apposta (supporto universale). Gli `.avif` sono già pronti
  nella stessa cartella se si decide di aggiornare `InlineFigure` a `<picture>`
  prima del publish — è un gap che riguarda **tutte** le immagini inline del
  sito, non solo questo articolo: valutare se risolverlo qui o segnalarlo al
  backlog come voce separata.
- `scripts/generate-og-images.mjs` — oggi produce solo card tipografiche
  (`buildSvg()`, nessuna foto di sfondo mai composta). Per questo articolo serve
  un output fotografico: o si estende lo script con un ramo "photo template", o
  si compone `/og/dormire-posti-sembrano-inventati.jpg` a mano una tantum con
  `sharp` a partire dalla sorgente fornita. Specifica esatta (testo, scrim,
  wordmark) nella content note, sezione `## Assets` → `### OG card`.

## What the receiver should produce

- `article.image` / `article.imageAlt` del seed
  (`src/data/articles/dormire-posti-sembrano-inventati.seed.ts`) collegati a
  `hero-emotional-grand-motel.webp` + alt fornito.
- Le 5 immagini di sezione inserite nel `content` del seed, nei punti indicati
  (subito dopo il paragrafo di ciascuna delle 5 sezioni senza blocco). Il
  markdown esatto è già scritto nella content note — copia/incolla.
- `/og/dormire-posti-sembrano-inventati.jpg` (+ `.webp` compagno, per parità con
  gli altri OG del sito) generato dalla sorgente fornita, con testo overlay
  "Posti che sembrano inventati" (IT, 4 parole) e scrim sul terzo sinistro.
- `article.ogImage` (o equivalente) puntato al nuovo file — verificare che non
  cada nel default `coverImage.webp` descritto in `Articolo.tsx:410`.

## Out of scope (do NOT touch)

- Non toccare `## Body`, gli H2/H3, l'ordine delle voci, i 5 blocchi
  `:::posto`/`:::reel` esistenti (portano già la loro immagine).
- Non sostituire le `cover` del registro (`content-seed.json`) o del manifest
  (`reels.ts`): sono condivise con `/posto/:id` e la home.
- Non aggiungere immagini alla micro-sezione «Due posti dove non si dorme».

## Open questions / decisions for the user

- Ridondanza hero/card EGM (stessa scena, crop diverso, ~250 parole di
  distanza): accettabile come bookend editoriale secondo asset-curator; se in
  review sembra ripetitivo, l'alternativa è nella content note (crop di Villa
  Tolomei come hero, perde l'aggancio con l'attacco).
- Se aggiornare `InlineFigure` a `<picture>` avif+webp in questo giro o
  aprire una voce di backlog separata (il gap è di tutti gli articoli, non
  solo di questo).

## Next hand-off

- Next agent: `browser-auditor` (misura LCP reale una volta collegata la hero)
  poi `travellini-quality-auditor` per il giro di release.
- Trigger: hero + 5 section photo + OG card applicati al seed/pagina, pagina
  live su localhost.

## Addendum del main thread (ripristinato 2026-08-18 — la riscrittura di questo
## handoff da parte dell'asset-curator lo aveva perso)

**Oltre ai campi immagine, il seed va allineato alle stringhe SEO**: `title` =
H1 definitivo «Posti che sembrano inventati, e ci dormi» (il seed ha ancora il
titolo di lavoro), `excerpt` e `tags` dalla sezione `## SEO` della content note.

**Nota sui handoff `frontend_to_gate` e `frontend_to_social` già presenti**:
sono stati pre-scritti dall'orchestratore insieme agli altri cinque, PRIMA che
il lavoro iniziasse — non descrivono lavoro già fatto. Nessuna incoerenza:
si consumano quando tocca a loro.

**Tre rimedi misurati (da growth + seo), ampliano lo scope oltre il seed.** Se
preferisci patch piccole, falli come slice separata dopo il seed — ma prima del
gate, perché il gate li verifica:

1. **`article_place_click` su OGNI link `/posto/:id` del corpo, non solo dentro
   `:::posto`.** Max 3 blocchi su 10 voci: legare l'evento al solo blocco mutila
   il campione della metrica primaria (soglia ≥8% del Brief). Proprietà: `slug`,
   `place_id`, `position` (1-10, ordine di prima apparizione — la lista esatta è
   nelle note di consegna del Body), `partnership_kind` (valore grezzo). In più
   `article_partner_cta_click` sull'unico link `/collaborazioni` di coda.
   Entrambi via `trackAnalyticsEvent`, NON `trackEvent`
   [MISURATO: `src/services/analytics.ts:140-152`; il link del blocco oggi non
   traccia: `src/components/article/directives/posto.tsx:89-94`].
2. **`ItemList` JSON-LD costruita da ogni riferimento `/posto/:id` del corpo**
   (ordine di prima apparizione, dedup, scarto placeholder) — NON dalle sole
   direttive `:::posto` (uscirebbe 3/10). Riusa `buildItemReviewedJsonLd`;
   `ListItem.url` verso di noi, `item.url` verso il sito della struttura.
3. **Ramo `articoloMeta()` in `scripts/generate-route-html.js`** che legge dai
   seed in repo: `metaForRoute` non copre `/articolo/`
   [MISURATO: `generate-route-html.js:174-178`] — in produzione statica
   title/description/OG/JSON-LD non esistono per crawler e social. NON
   aggiungere a `STATIC_ROUTE_META` (`routeMeta.test.ts:18-22` fallirebbe).

**Decisione sul gap `InlineFigure`** (default del main thread, ribaltabile
dall'owner): NON aggiornare a `<picture>` in questa slice — il gap è sitewide,
il markdown fornito punta già ai `.webp`; aprire una voce di backlog separata.

## Notes

Tutti i pesi sono già verificati sotto budget (hero ≤200KB hero role, sezioni
≤120KB in AVIF servito reale — dettagli e numeri esatti nella content note,
non li riscrivo qui). Le due section photo più pesanti (Placat, Celli) sono
scene di bosco molto testurizzate: non ricomprimere oltre, sotto la soglia
usata la texture si sgranava già visibilmente.

## Consumed — 2026-08-18, travellini-frontend-builder

Fatto: `article.image`/`imageAlt` e `ogImage` collegati nel seed (con il
plumbing seed→Firestore→ArticleData completato in codice, prima assente per
`imageAlt`/inesistente per `ogImage`); 5 section photo inserite nei punti
indicati; `/og/dormire-posti-sembrano-inventati.jpg`+`.webp` composti da
`og-source-emotional-grand-motel.jpg` (scrim sul terzo sinistro, testo
"Posti che sembrano inventati", wordmark). `InlineFigure` **non** aggiornato
a `<picture>` (decisione confermata, invariata). Dettagli e verifiche nel
messaggio di consegna del frontend-builder (typecheck, lint, 381 test unit,
audit:provenance, audit:ui, dry-run publish, lint editoriale — tutti verdi).
