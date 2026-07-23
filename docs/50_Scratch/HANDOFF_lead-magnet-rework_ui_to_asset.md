---
title: HANDOFF_lead-magnet-rework_ui_to_asset
status: consumed
created: 2026-07-23
updated: 2026-07-23
from: travellini-ui-designer
to: travellini-asset-curator
slug: lead-magnet-rework
expires: 2026-08-06
type: handoff
area: delivery
---

# Handoff: imagery del funnel lead magnet (cover unica + hero + OG + provenienza)

## Why this work matters

La landing `/guida-in-regalo` è la conversione owned primaria (bio-link IG/TikTok,
pubblico warm, mobile-first). L'owner ha chiesto **la miglior forma in assoluto**,
non un ritocco. La direzione visiva è ora lockata (sotto). Il collo di bottiglia
imagery è tuo: oggi la cover è un **placeholder demo** e l'hero è una **foto reale
sprecata al 38% di opacità**. La cover è **l'oggetto-eroe di tutto il funnel** —
si vede su landing, teaser home, popup e OG. Va portata ad asset definitivo,
coerente e leggero per l'LCP.

## Decisions already made (ui-designer — lockate 2026-07-23)

### D1 — Una sola cover, sorgente unica, su 4 superfici

Lo **stesso** asset cover finale va usato su: hero landing (`VieniConNoi.tsx`),
teaser home (`HomeLeadMagnet.tsx`), popup gated (`ExitIntentPopup.tsx`, thumbnail),
e come base della OG card. Un guida, un look ovunque (vincolo di naming growth).
Elimina il suffisso `demo`. Niente varianti divergenti per superficie.

### D2 — La cover deve comunicare "guida vera, provata, premium" — non "PDF generico"

Testo in cover **lockato** (da SEO Deliverable B, non modificarlo):

- TITOLO (Fraunces, riga cover): `Alla scoperta dell'Italia nascosta`
- DESCRITTORE (sub): `10 posti provati e consigliati da noi`
- Wordmark: `Travelliniwithus` (piccolo, alto)

La cover NON deve ripetere solo il titolo su fondo piatto (è ciò che fa la demo
oggi): deve leggersi come **la copertina di un libretto fisico**.

### D3 — Trattamento cover: Route A (raccomandata) o Route B (fallback)

**Route A — libretto editoriale su un luogo italiano REALE (preferita).**

- Una singola fotografia REALE di un luogo italiano che dica "particolare / fuori
  rotta": vicolo di borgo in pietra, collina terrazzata in luce bassa, sentiero
  costiero fuori stagione, vapore delle terme in Maremma. Atmosfera e sobrietà.
- NO cliché da stock (tramonto sulla spiaggia, Colosseo/Duomo cartolina, folla
  turistica). Deve sembrare "ci siamo stati", non un banco immagini.
- Scrim editoriale scuro (usa `twu-cover-scrim`, pesato a sinistra) per la
  leggibilità del type. Aspect 4/5. Fraunces per TITOLO + DESCRITTORE + wordmark.
- Accenti `craft` ammessi e desiderati (etichettati `craft`): grana carta leggera,
  wash di curve di livello / mappa, piccola linguetta indice terracotta o un
  "01–10" inchiostrato a mano. Sottili — scrim + un accento, non uno scrapbook.
- Provenienza foto: `real-photo` (o `real-frame` se estratta da un reel R&B reale).

**Route B — cover craft tipografica pura (fallback, SOLO se manca una foto reale
non-cliché approvata).**

- Nessuna foto di luogo: campo carta/sand `craft`, Fraunces, accento terracotta,
  wash di mappa + grana carta. Onesta al 100% sotto imagery-truth. Meno evocativa
  di A ma sicura e premium. Etichetta `craft`.

### D4 — Vincolo imagery-truth (non negoziabile)

- Le foto "Rodrigo & Betta" nel repo sono **AI-generated, non i creator reali**:
  **non** usarle e **niente volti** in cover/hero/OG.
- Imagery referenziale (luoghi) = foto reale o frame reel reale, con label
  provenienza. AI ammessa **solo** per asset `craft` non referenziali (grana,
  inchiostro, timbri, wash mappa). Mai un luogo AI spacciato per reale.

### D5 — Destino dell'hero-background: stop al ghost al 38%

Oggi `HERO_IMAGE = '/images/hero-amalfi.webp'` è renderizzato al **38% di opacità**
dietro uno scrim sand, clippato sul 58% destro, e **nascosto su mobile**
(`hidden lg:block`). Per un brand image-led è una foto reale forte ridotta a
fantasma decorativo — da eliminare in questa forma. Due opzioni, **tu proponi**:

1. **Rimuoverlo**: la cover diventa l'**unica** immagine forte dell'hero (più
   pulito, più premium, e risolve il conflitto di due immagini `priority`/LCP).
   _È la mia raccomandazione._
2. **Promuoverlo**: se esiste una foto reale che regge come banda editoriale
   leggibile (non un ghost), proponila con sizing LCP corretto — ma allora è
   protagonista, non un velo.
   > Nota LCP: oggi sia hero che cover hanno `priority` → due candidati LCP in gara.
   > Rimuovendo il ghost resta **una** immagine `priority` (la cover). Coordina con
   > perf-engineer/frontend il sizing finale.

### D6 — La cover deve restare leggibile anche a thumbnail

La cover si renderizza grande (~440px sulla landing) **e** piccola (~72–96px come
thumbnail nel popup gated). Fornisci un asset che regge entrambe: nel thumbnail il
TITOLO può cadere, ma **wordmark + DESCRITTORE + foto** devono restare
riconoscibili. Se serve, prepara una micro-variante ritagliata per il thumbnail
(stessa foto, crop più stretto), coerente con la cover grande.

## Context the receiver needs

- Asset attuali da sostituire:
  - `COVER_IMAGE = '/images/lead-magnets/posti-italiani-cover-demo.webp'`
    (`VieniConNoi.tsx:20` e `HomeLeadMagnet.tsx:81`) — **DEMO, da sostituire**.
  - `HERO_IMAGE = '/images/hero-amalfi.webp'` (`VieniConNoi.tsx:21`) — vedi D5.
- Dove la cover è renderizzata (per capire i crop/sizes): landing hero (aspect 4/5,
  `sizes="(max-width: 1024px) 82vw, 440px"`, `-rotate-2`), teaser home (aspect 4/5,
  `-rotate-2`, ma i finti "TOC rows" e i chip Italia/Lento/Coppia **vengono
  rimossi** dal frontend: la cover lì diventa solo l'oggetto, niente sotto-struttura),
  popup thumbnail (nuovo, piccolo).
- OG image: path e dimensioni **lockati da SEO** → `/og/guida-in-regalo.jpg`,
  1200×630, JPG (rinomina da `/og/vieni-con-noi.jpg`). Design = tuo.
- Testo cover lockato: vedi D2. Copy pagina lockata: `HANDOFF_lead-magnet-rework_seo_to_ui.md`.
- Token utili: scrim `twu-cover-scrim` (già in `index.css:180`), radius
  `--radius-lg`, shadow `--shadow-premium`.

## What the receiver should produce

1. **Cover definitiva** (webp + avif, peso controllato per LCP) secondo D2–D3–D6.
   Rimuovere il suffisso `demo`. Una sola cover, sorgente unica per le 4 superfici.
2. **Micro-variante thumbnail** della cover per il popup (se il crop grande non
   regge a ~72–96px), coerente con la grande.
3. **Hero background**: proposta motivata secondo D5 (rimuovere il ghost / promuovere
   una foto reale leggibile) + `sizes`/priority per LCP. Una sola immagine `priority`.
4. **OG card** `/og/guida-in-regalo.jpg` (1200×630): TITOLO + DESCRITTORE + foto,
   wordmark, leggibile in anteprima IG/WhatsApp/Telegram.
5. **Alt text** italiano, editoriale, specifico del luogo reale (se Route A).
6. **Tabella provenienza per-asset** (`real-photo` / `real-frame` / `craft`) con,
   per Route A, la **fonte reale** della foto (licenza/proprietà R&B — NON il set
   AImdella coppia).

- Dove atterra: `docs/50_Scratch/HANDOFF_lead-magnet-rework_asset_to_frontend.md`.

## Out of scope (do NOT touch)

- Layout, copy, slug, redirect, meta (lockati da owner/SEO/ui).
- Implementazione della pagina, del popup, del teaser (frontend-builder).
- `source`/tracking del popup (fix funzionale a frontend — vedi sotto).
- Contenuto interno del PDF (rigenerazione separata; solo il titolo mostrato dentro
  si allinea a TITOLO+DESCRITTORE al prossimo rigen).

## Open questions / decisions for the user

- **Route A vs B**: esiste una foto reale R&B / frame reel approvato di un luogo
  italiano non-cliché per la cover e (eventualmente) per l'hero? Se sì → Route A.
  Se no → Route B craft. (Le foto "R&B" nel repo sono AI: non usabili come reali.)
- Se si sceglie di **promuovere** un hero reale (D5.2): quale foto, con quale licenza.

## Next hand-off

- Next agent: `travellini-frontend-builder`
- Trigger: cover definitiva + thumbnail + hero deciso + OG + alt text + tabella
  provenienza pronti e nominati (senza `demo`).

## Notes — direzione layout/frontend NON tua (solo per coerenza cover)

Queste sono decisioni ui per il frontend; le riporto perché condizionano come la
cover viene usata, ma **non** sono tuo lavoro:

- Landing: eliminato il **titolo duplicato** (oggi l'H1 è ripetuto verbatim sulla
  cover nello stesso viewport). La cover resta l'oggetto-guida; l'H1 di pagina è
  l'unico titolo dominante. → la cover deve reggersi come oggetto, non come "title
  card" gemella dell'H1.
- Trust signal above-the-fold (reale, da `BRAND_CREDENTIALS`/`BRAND_STATS` in
  `site.ts`): riga sobria "Instagram verificato · Iscritti elenco AGCOM · community
  260K+". Nessuna KPI-strip. (Non richiede imagery, ma spiega perché la cover non
  deve caricarsi di badge finti.)
- Teaser home: perde il form `<Newsletter>` e i chip con **nomi di luogo reali**
  (Procida/Maremma/Val d'Orcia/Cilento) — esclusività. La cover lì è solo l'oggetto.
- Popup gated: una sola azione (form), la cover compare come **thumbnail** (D6).
- Fix funzionale a frontend (lo segnalo, non è imagery): il `<Newsletter>` del popup
  usa `source="exit_intent_popup"` che **non** contiene `lead_magnet` → non sblocca
  né mostra "Apri la guida". Va cambiato in una source con `lead_magnet`, altrimenti
  il popup gated raccoglie email ma non consegna nulla.
