---
title: HANDOFF_site-levelup_asset_to_frontend
status: open
created: 2026-07-05
from: travellini-asset-curator
to: travellini-frontend-builder
slug: site-levelup
expires: 2026-07-19
type: handoff
area: delivery
---

# Handoff: TIER 2 photo plan — real assets in, stock/AI out, targa dove non c'è foto vera

## Why this work matters

Il layout targa (ui-designer P0.4) è già lockato. Il compito TIER 2 era mettere
FOTO REALI sulle superfici. L'inventario dimostra che **le uniche foto reali in
repo (le 5 cover reel) hanno testo + watermark TikTok bruciati dentro** → usabili
solo nel contesto "reel", non come foto editoriali di luogo. **Le immagini
`/images/destinations/*` sono postcard stock/AI-generate** (savana al tramonto,
Val d'Orcia idealizzata, Dolomiti-cartolina) → violano la regola "no AI imagery".
Quindi la mossa corretta non è aggiungere foto: è **ritirare le postcard AI** e
lasciare le targhe, dando all'owner la shot-list esatta che sblocca le foto vere.

## Decisions already made (LOCK — non ridiscutere)

1. **Solo foto reali. Zero stock, zero AI.** Confermato dall'inventario.
2. **Le 5 cover reel restano SOLO nel contesto reel** (ReelStrip, PezzoForte,
   lightbox video): lì il testo+watermark bruciati sono coerenti col formato
   social. NON vanno usate come cover editoriali di destinazione/ContentCard/hero.
3. **`/images/destinations/*.webp` sono stock/AI** (verificato a vista:
   `africa.webp`, `toscana.webp`, `dolomiti.webp` sono cartoline AI-generate;
   `puglia/sardegna/giappone/islanda/oceania/americhe` sono lo stesso lotto
   generico già segnalato in `docs/13_Content/PHOTO_PLAN_R_B_2026_05_15.md`).
   Non usarle come "posti veri".
4. **ContentCard e tile senza cover → targa** (ui-designer P0.4 / P1.3): confermato,
   è la scelta giusta finché non ci sono frame puliti.

## Context the receiver needs

- Superfici toccate: `/destinazione` (hub + DestinationWorld), `/esplora`, home
  reel strip (live home = `AtlanteHome`).
- Asset reali verificati: 5 cover reel `public/images/reels/reel-{1..5}-cover.{avif,webp}`
  (720×1296, 9:16). Pesi: AVIF 31–81 KB, WebP 58–127 KB. Responsive -320/-480 presenti.
- Config sorgente: [src/config/destinations.ts], [src/config/reels.ts],
  [src/data/content-seed.json] (40 item, tutti `cover: ""`).
- Componenti reel: [src/components/home/atlante/ReelStrip.tsx],
  [src/components/home/atlante/PezzoForte.tsx],
  [src/components/home/atlante/ZoneBand.tsx],
  [src/components/home/atlante/HeroCopertina.tsx].
- `OptimizedImage` genera già `<picture>` AVIF→WebP per i path `/images/*` e usa
  `responsiveWidths` per lo srcset. Nessun wiring nuovo di componente serve.

## What the receiver should produce

### P0 — Ritirare le cover stock/AI (integrità brand, LCP-neutral)

In [src/config/destinations.ts] rimuovere il campo `cover` da 4 nodi (le foto
sono AI/stock e geograficamente disoneste rispetto al contenuto reale):

| Nodo            | Riga | Campo da rimuovere                            | Effetto render                                                    |
| --------------- | ---- | --------------------------------------------- | ----------------------------------------------------------------- |
| `toscana`       | L69  | `cover: '/images/destinations/toscana.webp'`  | DestinationWorld → header sand editoriale (branch già codificato) |
| `alto-adige`    | L137 | `cover: '/images/destinations/dolomiti.webp'` | idem                                                              |
| `africa` (zona) | L229 | `cover: '/images/destinations/africa.webp'`   | tile hub Africa → targa editoriale (P0.4)                         |
| `egitto`        | L240 | `cover: '/images/destinations/africa.webp'`   | DestinationWorld → header sand                                    |

Nessun file va cancellato fisicamente (l'owner decide se ripulire
`public/images/destinations/`). Solo unwire in config.

Accept: `grep "images/destinations" src/config/destinations.ts` = 0 match; nessuna
foto AI/stock su `/destinazione*`; nessun rettangolo scuro vuoto (targa P0.4 gestisce).

### P0 — Alt text reel strip specifici (a11y + descrittivi)

Oggi ReelStrip usa `alt={`${reel.location} — ${reel.hook}`}` (hook = domanda, non
descrizione di ciò che si vede). Aggiungere un campo `alt` a `ReelEntry` in
[src/config/reels.ts] e consumarlo in ReelStrip L110, PezzoForte L72, ZoneBand,
con questi valori (IT, 70–125 char, descrivono la scena visibile):

- `reel-egitto-mar-rosso`: `"Acqua trasparente del Mar Rosso vista da sott'acqua, con reef e fondale sabbioso a Marsa Alam"`
- `reel-toscana-sushi-kibo`: `"Sala di un ristorante di sushi in Toscana con passerella sull'acqua e pareti in legno"`
- `reel-toscana-tavernal`: `"Vetrata a tema fantasy con drago rosso e torre in una taverna a tema in Toscana"`
- `reel-malesia-batu-caves`: `"La statua dorata e la scalinata arcobaleno delle Batu Caves a Kuala Lumpur"`
- `reel-toscana-volterra-volturi`: `"Portone medievale a Volterra con persone in abiti gotici sui gradini in pietra"`

Accept: ogni cover reel ha alt che descrive la scena, non solo l'hook-domanda.

### P1 — ContentCard: restano targa (nessun wiring cover ora)

Non wire-are cover ai 40 ContentItem: le uniche foto sarebbero frame reel con
testo bruciato. Lasciare la targa P1.3. Preparare (NON eseguire) la lista dei 3
item pronti al wiring appena arrivano i frame PULITI (§ Assets missing):
`egitto-marsa-alam-dream-lagoon` ← reel-1, `malesia-batu-caves` ← reel-4,
`toscana-aperitivo-volterra` ← reel-5 (stesso posto del reel, match esatto).

## Photo plan per superficie

| Superficie                         | Slot                      | File                            | Crop / focal                                  | Ruolo               | Peso target   | Alt (IT)            | LCP-critico     |
| ---------------------------------- | ------------------------- | ------------------------------- | --------------------------------------------- | ------------------- | ------------- | ------------------- | --------------- |
| `/destinazione` hub                | Tile Italia               | — (targa)                       | —                                             | Targa P0.4          | 0 KB          | n/a (aria dal nome) | No              |
| `/destinazione` hub                | Tile Europa               | — (targa)                       | —                                             | Targa P0.4          | 0 KB          | n/a                 | No              |
| `/destinazione` hub                | Tile Africa               | ~~africa.webp~~ → targa         | —                                             | Targa (ex stock AI) | 0 KB          | n/a                 | No              |
| `/destinazione` hub                | Tile Asia                 | — (targa)                       | —                                             | Targa P0.4          | 0 KB          | n/a                 | No              |
| `/destinazione/*/toscana`          | Hero                      | ~~toscana.webp~~ → header sand  | —                                             | Header editoriale   | 0 KB          | n/a                 | No              |
| `/destinazione/*/alto-adige`       | Hero                      | ~~dolomiti.webp~~ → header sand | —                                             | Header editoriale   | 0 KB          | n/a                 | No              |
| `/destinazione/africa` · `/egitto` | Hero                      | ~~africa.webp~~ → header sand   | —                                             | Header editoriale   | 0 KB          | n/a                 | No              |
| `/esplora`                         | Griglia ContentCard (×40) | — (targa P1.3)                  | —                                             | Targa categoria     | 0 KB          | n/a                 | No              |
| Home `ReelStrip`                   | Cover ×5                  | reel-{1..5}-cover               | 9:16 nativo (box 9:16, no crop)               | Reel thumb          | AVIF ≤81 KB ✓ | vedi alt sopra      | No (below fold) |
| Home `PezzoForte`                  | Cover story               | reel-3-cover                    | 9:16→4:5, focal centro (crop verticale lieve) | Reel feature        | AVIF 63 KB ✓  | alt reel-3          | No              |
| Home `ZoneBand`                    | Card Italia               | reel-3-cover                    | 9:16→4:5, centro                              | Zone card           | AVIF 63 KB    | vedi § flag         | No              |
| Home `ZoneBand`                    | Card Mondo                | reel-1-cover                    | 9:16→4:5, centro                              | Zone card           | AVIF 31 KB    | vedi § flag         | No              |
| Home `HeroCopertina`               | Poster LCP mobile         | reel-3-cover                    | 9:16 in box 78svh                             | Hero poster         | AVIF 63 KB ✓  | vedi § flag         | **Sì (mobile)** |

## Replacements proposed

- **africa.webp / toscana.webp / dolomiti.webp** (cover destinazioni) — Problema:
  AI-generate + geograficamente disoneste (savana↔Mar Rosso resort; Val d'Orcia
  cartolina↔mirror house/Volterra/glamping; Dolomiti-cartolina generica).
  Sostituzione: **nessuna foto ora → targa/header sand**; foto vera solo con frame
  puliti o shoot (sotto).
- **HeroCopertina poster = reel-3-cover** (`DEI NANI E` + watermark TikTok) —
  Problema: testo bruciato sull'hero LCP mobile + soggetto di nicchia (murale
  drago) come prima impressione del brand. Sostituzione: frame pulito 16:9 o
  scatto hero dedicato (SET A del PHOTO_PLAN). **Flag TIER 3 / owner**, non un edit TIER 2.
- **ZoneBand card Italia = reel-3-cover** — Problema: "I posti dove torniamo"
  rappresentato da un murale-drago (fit debole) + testo bruciato. Fix reale =
  frame pulito. Interim opzionale sconsigliato (ogni altra reel ha comunque testo
  bruciato): meglio non fare churn, aspettare i frame puliti.

## Assets missing (request to R&B) — [VERIFY foto owner]

1. **[VERIFY foto owner: frame PULITI dei 5 reel]** — la leva più veloce.
   Esportare dai clip GREZZI (pre-caption, pre-watermark) un frame per reel in
   **16:9 (1600×900)** e **4:3 (1200×900)**, senza testo bruciato e senza logo/
   @handle TikTok. Priorità: Dream Lagoon/Mar Rosso, Batu Caves, Volterra — sono
   già mappati 1:1 a ContentItem + zone, quindi sbloccano cover reali su
   `/esplora` + pagine Egitto/Malesia/Toscana in un colpo solo. (Estrazione frame
   da video grezzo = task umano/ffmpeg, coord. con social-content-operator.)
2. **[VERIFY foto owner: shoot SET A–D]** del PHOTO_PLAN 2026-05-15 — sostituiscono
   le postcard stock su brand/experiences/destinazioni (hero home, ChiSiamo,
   MonetizationTeaser, /esperienze).
3. **[VERIFY foto owner: OG card dedicate]** 1200×630 per `/destinazione` ed
   `/esplora`, quando esiste un frame hero pulito. Finché non ci sono, resta l'OG
   default (`public/og/default.jpg`, 22 KB) — accettabile.

## OG card (stato attuale)

- `/destinazione` (hub) e `/esplora`: nessun `image` in SEO → usano `og/default.jpg`. OK.
- DestinationWorld: `image={node.cover}`. Rimuovendo i cover stock, l'OG cade sul
  default → **meglio** (niente AI nell'anteprima social). Nessuna azione richiesta.
- Nessun testo bruciato aggiunto: gli OG restano quelli esistenti.

## Performance summary

- **Targa su `/destinazione` e `/esplora` = 0 KB immagini above-fold** → aiuta
  direttamente il target LCP ≤ 2.0s mobile (niente hero da scaricare).
- Reel strip (home): tutte le cover AVIF ≤ 81 KB (budget thumb/gallery ok);
  WebP reel-3 (101 KB) e reel-5 (127 KB) leggermente sopra 100 KB ma è il fallback
  per browser vecchi — AVIF copre i moderni. Reel strip è below-the-fold → lazy.
- Hero mobile LCP: poster `reel-3-cover.avif` = 63 KB (dentro budget hero ≤200 KB);
  il rischio LCP qui è il testo/WebGL, non il peso immagine.
- Coverage formati: AVIF ✓ / WebP ✓ (via Optimizedpicture). JPG fallback non
  necessario per i reel (webp+avif bastano ai target browser).

## Out of scope (do NOT touch)

- Layout/rendering targa (ui-designer, già lockato P0.4/P1.3).
- Copy/meta/schema (seo-strategist), corpo schede (editorial-writer).
- `server.ts`, `firestore.rules`, `admin.ts`.
- Cancellazione fisica dei file stock in `public/images/` (decisione owner).
- HeroCopertina poster swap → è TIER 3 / owner (solo flag qui).
- Import IG Graph API (parcheggiato).

## Open questions / decisions for the user

- OK ritirare le 3 cover AI (africa/toscana/dolomiti) da `/destinazione*`? È
  reversibile e allinea alla regola "no AI imagery"; default consigliato = sì.
- Priorità frame puliti: confermi Mar Rosso + Batu Caves + Volterra come primi 3?

## Next hand-off

- Next agent: `browser-auditor` (LCP ≤ 2.0s mobile su `/`, `/destinazione`,
  `/esplora`; verifica 0 rettangoli vuoti e 0 AI-postcard) → poi `travellini-quality-auditor`.
- Trigger: P0 (unwire cover stock + alt reel) implementati e verificati in browser.

## Notes

- **Handoff `HANDOFF_real-content-realign_growth_to_seo` (scade 2026-07-06):** la
  sua struttura ContentItem/hub è REALIZZATA (destinations.ts + content-seed.json +
  contentLibrary sono live). Il suo sotto-task "asset-curator (cover/alt)" è
  BLOCCATO dallo stesso gap: nessun frame pulito per le cover ContentItem. Può
  scadere: la direzione è realizzata a livello struttura, il pezzo cover si
  riattiva solo con i frame puliti (§ Assets missing #1). Nessuna azione per tenerlo aperto.
- **Coerenza editoriale:** oggi il sito mescola cartoline AI idealizzate
  (savana, Val d'Orcia, Dolomiti) con frame reel reali "grezzi" (murale-drago,
  ripresa subacquea). È esattamente il clash "sembra stock, non un brand solo".
  Targa + reel-nel-loro-contesto è PIÙ coerente delle postcard AI. Ritirarle è un
  upgrade di percepito, non una perdita.
- **InstagramGrid.tsx** (usa i brand/\*.webp stock nei FALLBACK_ITEMS) è su
  `HomeLegacy`, non sulla home live → quei placeholder stock NON renderizzano in
  produzione. Nessuna azione ora.
  </content>
  </invoke>
