---
title: HANDOFF_lead-magnet-rework_asset_to_frontend
status: consumed
created: 2026-07-23
updated: 2026-07-23
from: travellini-asset-curator
to: travellini-frontend-builder
slug: lead-magnet-rework
expires: 2026-08-06
type: handoff
area: delivery
---

# Handoff: asset definitivi (cover craft + hero + OG + alt text) + implementazione landing (rename slug + redirect)

## Why this work matters

Due deliverable convergono in questo file. (1) `travellini-ui-designer` ha lockato la
direzione visiva del funnel lead magnet e girato a me (`HANDOFF_lead-magnet-rework_ui_to_asset.md`)
la decisione cover/hero/OG. (2) `seo` + `ui-designer` avevano già preparato qui
l'inventario completo del rename di slug (`/italia-nascosta` → `/guida-in-regalo`).
Li trovi entrambi in questo file: prima gli asset (nuovo, mio), poi il rename
(invariato, sotto). Implementi entrambi nello stesso giro.

## Decisions already made (asset-curator — lockate 2026-07-23)

Ho fatto l'inventario completo della libreria immagini reali del sito prima di
decidere (vedi "Come ci sono arrivato" in fondo per il dettaglio file-per-file).
Verdetto: **Route B — cover craft tipografica**. Route A (foto reale di uno dei 10
posti) non è disponibile: nessun file nella libreria la soddisfa. Dettaglio sotto.

### A1 — Perché Route A è scartata (non è un'opinione, è un inventario)

I 10 posti reali della guida (da `src/pdf/LeadMagnetDocument.tsx` /
`docs/13_Content/LEAD_MAGNET_POSTI_ITALIANI.md`, fonte di verità) sono: **Specchia,
Tricase Porto, Acaya, Vico del Gargano** (Puglia) · **Scanno** (Abruzzo) ·
**Rasiglia, Castelluccio di Norcia** (Umbria) · **Lago di Tovel** (Trentino) ·
**Val di Funes** (Alto Adige) · **Bosa** (Sardegna). Nessun file in
`public/images/**` raffigura uno specifico di questi 10 luoghi. Candidati
verificati e scartati:

| Candidato                                              | Perché scartato                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public/images/destinations/puglia.webp`               | Alberobello (trulli) — non è nessuno dei 4 posti Puglia della guida; è il cliché-Puglia più generico che esista; oltretutto la stessa immagine è già cover di **decine** di voci diverse in `src/config/destinations.ts` (righe 61, e riusata in `HomeFeaturedDestinations.tsx:35`, `demoItineraries.ts:214`, `demoArchive.ts:19`, `Diary3DScroll.tsx:39`, `previewContent.ts:724`) — zero distintività, e provenienza mai certificata `real-photo` in `docs/ASSET_STRATEGY.md` (resa iper-satura, zero persone, zero imperfezione: stessa "famiglia" sospetta delle altre tre sotto) |
| `public/images/destinations/sardegna.webp`             | Spiaggia della Pelosa/Stintino — non è Bosa; stesso cliché "spiaggia paradiso" da vietare per regola anti-cliché; stessa provenienza non certificata, stesso riuso massiccio (`destinations.ts` righe 85/181/229/332, `HomeFeaturedDestinations.tsx:65`, `demoItineraries.ts:22`, `demoArchive.ts:21`)                                                                                                                                                                                                                                                                                |
| `public/images/destinations/dolomiti.webp`             | Cadini di Misurina — punto panoramico iconico/da cartolina, non Val di Funes; stessa provenienza non certificata, stesso riuso massiccio (righe 97/169/217/265/343 in `destinations.ts`, più `HomeDiscoveryFinder.tsx`, `Diary3DScroll.tsx`, `previewContent.ts:613`)                                                                                                                                                                                                                                                                                                                 |
| `public/images/hero-amalfi.webp`                       | Positano/Costiera — non è nessuno dei 10 posti, ed è **esattamente** la categoria che il criterio editoriale della guida esclude esplicitamente ("NO... Amalfi standard", `LEAD_MAGNET_POSTI_ITALIANI.md` §Criteri). Vedi A4.                                                                                                                                                                                                                                                                                                                                                         |
| `public/images/reels/reel-1..5-cover.webp`             | Nessuno dei 5 reel è su uno dei 10 posti (Egitto, Toscana×3, Malesia). Tutti e 5 hanno **testo bruciato nell'immagine e/o watermark TikTok** (violazione dura, non negoziabile — vedi §6 `ASSET_STRATEGY.md`). Anche a parità di soggetto sarebbero da scartare.                                                                                                                                                                                                                                                                                                                      |
| `public/images/home-journal/*`                         | Provenienza "da certificare" per decisione esplicita (`DECISION_IMAGERY_TRUTH_RULE_2026-07-22.md`): nessuna nuova superficie può adottarli come prova finché non certificati. Soggetti comunque non pertinenti (Burton Juice/Campania, Caribe Bay/Jesolo, Garden Village/Bled) e `altrove-vicino.png` ha pure testo bruciato ("CARIBE BAY — I CARAIBI D'ITALIA?").                                                                                                                                                                                                                    |
| `public/images/experiences/*`, `public/images/brand/*` | Categoria generica non-luogo (experiences) o coppia AI vietata da regola (brand/couple-travel, brand/about-editorial). Non applicabili.                                                                                                                                                                                                                                                                                                                                                                                                                                               |

Conclusione: onestà sotto imagery-truth rule impone **Route B**. Non è un
ripiego debole — è la scelta corretta finché non esiste una foto reale
certificata di uno dei 10 posti.

### A2 — Composizione cover (Route B, craft, spec esatta)

Idea guida: la cover non è "un poster con una foto sopra", è **una pagina del
taccuino di viaggio reale di Rodrigo & Betta** — lo stesso linguaggio "atlante"
già live su `ChiSiamo`, `/posto`, home journal (`src/styles/atlante.css`,
`--color-atlante-*` in `index.css`). Non sto inventando un sistema visivo nuovo:
riuso quello che esiste, il che è anche perché **non serve nessuna nuova
generazione Higgsfield per la maggior parte di questo asset** (dettaglio sotto).

**Livello 1 — base (riuso, zero generazione nuova):**
Stessa ricetta di `.journal-hero` / `.journal-page` (`src/index.css:1130-1140`):
`background-color: var(--color-atlante-carta)` (#f2ecdf) +
`background-image: linear-gradient(104deg, rgb(255 255 255/16%), transparent 42%,
rgb(120 89 48/4%)), var(--atlante-carta-texture)` — dove `--atlante-carta-texture`
è già `generated/approved/atlante-carta-tile.png` (approvato owner 2026-07-22,
craft, non referenziale, 8 KB AVIF / 23 KB WebP, tileable senza cuciture).
Nessun nuovo prompt creativo richiesto: o si applica la stessa classe CSS
direttamente al riquadro cover, oppure — se preferite mantenere l'attuale
struttura a `<OptimizedImage>` per il controllo su `priority`/`fetchpriority`
(consigliato per LCP, vedi Performance sotto) — si esporta un file piatto
880×1100 (4:5, retina-safe per il rendering a 440 CSS px) che tassella la
stessa texture sullo stesso canvas. Entrambe le strade sono la stessa
"fotografia": **una texture di carta, senza testo dentro**, non un luogo, non
una persona.

**Livello 2 — testo (HTML live, non nell'immagine — invariato rispetto a oggi):**
Wordmark "Travelliniwithus" piccolo in alto (come oggi), TITOLO e DESCRITTORE
come da lock D2/seo (non li tocco, sono copy). Unica differenza: **il colore del
testo cambia da bianco a inchiostro**, perché la base non è più una foto scura
scrimmata ma carta chiara: usate `var(--color-atlante-inchiostro)` (o
`--color-ink`) per TITOLO e wordmark, `var(--color-atlante-timbro-text)` per il
DESCRITTORE (stesso terracotta-AA già usato per gli eyebrow atlante). **Non
applicate `twu-cover-scrim`**: è costruito per scurire una foto per testo
bianco (`rgb(17 17 17/78%→12%)`), qui non serve e sporcherebbe la carta.

**Livello 3 — l'unico accento (uno solo, non uno scrapbook):**
Un timbro circolare terracotta con "**01**" (Fraunces), in alto a destra dove
oggi c'è l'icona Map. Ricalca **esattamente** `.atlante-stamp-btn` già in
produzione (`src/styles/atlante.css:174-192`): `border: 3px double
var(--color-atlante-timbro)`, `border-radius: 999px`, sfondo `color-mix(in srgb,
var(--color-atlante-carta) 92%, transparent)`, leggera rotazione (usate un verso
opposto alla card, es. +4deg contro il -2deg della card, per un effetto
"timbrato a mano" non allineato). È un elemento statico (non un bottone), quindi
niente `:hover`/`:focus-visible` — solo la resa visiva. **Zero generazione
Higgsfield richiesta**: è CSS/SVG puro, costruito da voi.
Perché "01" e non un wash di mappa: comunica "prima guida di una collana" — coerente
con la copy già lockata ("La prima guida di Rodrigo & Betta") e con la promessa
seo che titoli futuri ruoteranno mantenendo slug/descrittore fissi. Un wash di
mappa sarebbe un secondo accento decorativo sullo stesso oggetto: la spec ui
chiede "uno solo".

**Container (invariato):** `-rotate-2`, `rounded-[var(--radius-lg)]`,
`shadow-[var(--shadow-premium)]`, bordo — restano, fanno già il lavoro di "oggetto
fisico appoggiato" indipendentemente da cosa c'è dentro.

### A3 — Micro-variante per il popup (thumbnail 72–96px)

Vantaggio di Route B: la texture è uniforme e tileable, quindi **non serve un
file/crop separato per il thumbnail** (a differenza di una foto, dove il
soggetto cade fuori quadro se si ritaglia stretto). A quella dimensione TITOLO e
DESCRITTORE cadono per forza (troppi caratteri per 80px) — quello che deve
restare leggibile è il timbro "01" (alto contrasto, una forma sola) più,
opzionale, l'iniziale del wordmark. Composizione thumbnail: stessa texture di
sfondo, overlay ridotto a solo timbro "01" (scalato ~28-32px) + eventualmente la
sola iniziale "T" del wordmark. Non serve chiedere nulla a Higgsfield per
questo: è la stessa texture, altra composizione HTML a dimensione ridotta.

### A4 — Hero background: rimuovere `hero-amalfi.webp` (risolve D5)

Confermo e rinforzo la raccomandazione di ui-designer (D5, opzione 1): **rimuovere**
il blocco `<OptimizedImage src={HERO_IMAGE}>` e il suo div-scrim
(`VieniConNoi.tsx:123-131`). Motivazioni, in ordine di peso:

1. **Contraddice la promessa della pagina.** `hero-amalfi.webp` è Positano/Costiera
   — la guida esclude esplicitamente "Amalfi standard" dai suoi criteri di
   selezione (`LEAD_MAGNET_POSTI_ITALIANI.md`). Mettere Amalfi come atmosfera di
   sfondo su una pagina che vende "l'Italia nascosta, non ovvia" è una
   contraddizione visibile, non solo un dettaglio di peso file.
2. **Provenienza non certificata.** Nessuna nota in `docs/ASSET_STRATEGY.md` marca
   `hero-amalfi` come `real-photo`. La resa (iper-satura, zero persone, luce e
   nitidezza da drone perfette) è nella stessa famiglia sospetta delle immagini
   `destinations/*` già scartate in A1. Non lo approvo come asset editoriale
   finché R+B non confermano che è un loro scatto reale.
3. **Risolve il doppio LCP.** Oggi sia hero (58% destro, opacità 38%, `priority`)
   sia cover (`priority`) competono per l'LCP. Con l'hero rimosso resta **una sola**
   immagine `priority`: la cover.

Nota separata (non azionata qui, fuori scope): `hero-amalfi.webp` è riusato in
almeno 6 altri punti del sito con lo stesso problema di provenienza
(`HeroSection.tsx` mobile, `regions.ts:89`, `articleData.ts:7` come immagine
articolo di default, `demoItineraries.ts:264`, `demoContent.ts:7`,
`demoArchive.ts:22`). Segnalo per un audit dedicato — non è compito di questo
handoff risolverlo sitewide.

### A5 — OG card `/og/guida-in-regalo.jpg`

Non serve un asset nuovo "disegnato": il sito ha già una pipeline programmatica
(`scripts/generate-og-images.mjs`, sfondo gradient sabbia + regola accento +
titolo serif + wordmark, già usata per `lead-magnet.jpg`, `vieni-con-noi.jpg`,
`default.jpg`). Raccomando di **estendere quella**, non di commissionare una
composizione a parte — più coerente con la famiglia OG del sito, zero
Higgsfield, zero rischio.

- Aggiungere una entry `ARTICLES` (o rinominare quella `vieni-con-noi`
  esistente) con: `slug: 'guida-in-regalo'`, `title: "Alla scoperta dell'Italia
nascosta"` (OG title lockato da seo), `category: "Guida gratuita"`, `location:
"10 posti provati e consigliati da noi"` (riusa lo slot `location` come sub-riga,
  esattamente come fa già l'entry `vieni-con-noi` attuale con "10 posti italiani
  non ovvi").
- Consigliato (piccolo, non bloccante): aggiungere nel template SVG un cerchio +
  testo "01" in terracotta (stesso accento della cover live), per continuità
  visiva IG-preview → pagina reale. Se preferite zero modifiche al template
  condiviso, va bene anche solo l'aggiornamento testo.
- **Verificare l'output `.jpg`**: lo script oggi produce **solo `.webp**`
(`sharp(...).webp(...).toFile()`, riga 113-115) — non genera mai `.jpg`. I file
`.jpg`già in`public/og/`(incluso`vieni-con-noi.jpg`) sono più vecchi
(timestamp 21/07) dei `.webp`corrispondenti (23/07): sono stati prodotti da un
passaggio diverso e **non si rigenerano più insieme allo script**.`SEO.tsx`punta di default a`.jpg`per compatibilità WhatsApp/LinkedIn — quindi lo
script va esteso con un secondo output`.jpeg({quality: 88}).toFile(...jpg)`,
altrimenti il path lockato da seo (`/og/guida-in-regalo.jpg`) non avrà un file
  reale generato dal build. Segnalo qui perché è un prerequisito tecnico del
  Deliverable D di seo, non una mia preferenza.
- Peso atteso: i `.jpg` fratelli attuali pesano 20-29 KB — ben dentro il budget
  ≤300KB.

### A6 — Alt text (pronti da incollare)

Tutte le occorrenze della cover (landing, teaser home, popup) sono la **stessa
texture decorativa**, non una foto di un luogo: la regola "niente alt
decorativo generico" si traduce qui in **`alt=""` deliberato**, non
nell'omissione dell'attributo. Motivo: il contenuto informativo (titolo,
descrittore, wordmark, numero) è già testo HTML separato e già accessibile;
l'immagine sotto non aggiunge un fatto verificabile da descrivere, e oggi
l'alt esistente (`"Copertina della guida Alla scoperta dell'Italia nascosta"`)
**duplica** parola per parola il testo visibile subito sopra — uno screen
reader lo annuncia due volte. Consiglio quindi:

```
Landing hero cover (VieniConNoi.tsx):        alt=""
Teaser home cover (HomeLeadMagnet.tsx):      alt=""
Popup thumbnail cover (ExitIntentPopup.tsx): alt=""
```

Se preferite comunque una label non vuota (difendibile, non la mia scelta
primaria): `"Copertina della guida, su carta, con timbro numerato 01"` — non
ripete titolo/descrittore, resta neutra.

`og:image:alt` (`SEO.tsx:88-90`): oggi è una stringa fissa a livello di sito
("Travelliniwithus - posti particolari, esperienze reali e consigli di
viaggio"), uguale su ogni pagina — non è per-pagina. Non è compito mio
cambiare `SEO.tsx`; se in futuro diventa per-pagina, testo pronto: `"Copertina
della guida Alla scoperta dell'Italia nascosta, su carta, con timbro numerato
01 — Travelliniwithus"`.

### A7 — Tabella provenienza

| Asset                                                | Provenienza                     | Fonte / lineage                                                                                                                                 | Note                                                                                                       |
| ---------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Texture carta base (riuso)                           | `craft`                         | `generated/approved/atlante-carta-tile.png` — Higgsfield `gpt_image_2`, approvato owner 2026-07-22 (`generated/metadata/atlante-carta-tile.md`) | Non referenziale: nessun luogo/persona raffigurato. Già in produzione su `ChiSiamo`/`/posto`/home journal. |
| Export cover 880×1100 (se scelta la via file piatto) | `craft`                         | Stesso lineage di cui sopra — export meccanico, nessun nuovo prompt creativo                                                                    | Solo se si preferisce `<img>` a CSS background per controllo LCP                                           |
| Timbro "01"                                          | `craft` (CSS/SVG, non immagine) | Codice — ricalca `.atlante-stamp-btn` esistente                                                                                                 | Nessuna generazione                                                                                        |
| Accento OG "01" (opzionale)                          | `craft` (SVG, non immagine)     | Codice — `scripts/generate-og-images.mjs`                                                                                                       | Nessuna generazione                                                                                        |
| `hero-amalfi.webp`                                   | non usato in questa pagina      | provenienza non certificata altrove nel repo                                                                                                    | Vedi A4 — rimosso, non sostituito                                                                          |

## Decisions already made (a monte — seo + ui, invariate da qui in giù)

- Slug definitivo + copy + meta + redirect map: da seo (vedi
  `HANDOFF_lead-magnet-rework_seo_to_ui.md`).
- Direzione visiva + layout: da ui-designer (vedi
  `HANDOFF_lead-magnet-rework_ui_to_asset.md`).
- Asset (cover/hero/OG) + alt text + provenienza: da asset-curator — sezioni A1-A7 sopra.
- Nessuna modifica a `server.ts` / `firestore.rules` / `src/config/admin.ts` / endpoint `/api/newsletter-subscribe`. Se emergesse la necessità di un redirect server-side o di aggiungere lo slug a `STATIC_APP_ROUTES` in `server.ts`, **fermati** ed escala a `travellini-backend-engineer` (file high-risk, conferma owner — nota: l'owner ha già autorizzato l'aggiunta di `/guida-in-regalo` a `ALL_STATIC_APP_ROUTES`, vedi Deliverable E-15 di seo; l'esecuzione resta comunque a backend-engineer).

## Context the receiver needs

- File immagine coinvolti oggi: `COVER_IMAGE =
'/images/lead-magnets/posti-italiani-cover-demo.webp'` (`VieniConNoi.tsx:20`,
  `HomeLeadMagnet.tsx:81`) e `HERO_IMAGE = '/images/hero-amalfi.webp'`
  (`VieniConNoi.tsx:21`) — entrambi da sostituire/rimuovere per A1-A4 sopra.
  Rinominate il file cover finale senza il suffisso `demo` (es.
  `/images/lead-magnets/guida-in-regalo-cover.avif|webp`).
- Dove la cover è renderizzata: landing hero (`VieniConNoi.tsx:163-192`, aspect
  4/5, `sizes="(max-width: 1024px) 82vw, 440px"`, `-rotate-2`, `priority`),
  teaser home (`HomeLeadMagnet.tsx:76-124`, aspect 4/5, `-rotate-2`, **non**
  `priority` — corretto, resta lazy), popup (`ExitIntentPopup.tsx` — oggi non
  mostra affatto una cover/thumbnail: se si implementa D6 del ui-designer, va
  aggiunta come nuovo elemento, piccola, non `priority`).
- Token CSS pertinenti: `--color-atlante-carta`, `--color-atlante-carta-deep`,
  `--color-atlante-inchiostro`, `--color-atlante-timbro`,
  `--color-atlante-timbro-text` (`src/index.css:93-98`), `--atlante-carta-texture`
  (`src/styles/atlante.css:17-22`), classe `.atlante-stamp-btn` come riferimento
  per il timbro (`src/styles/atlante.css:174-192`). **Non** usare
  `twu-cover-scrim` su Route B (è per foto scure, non per carta chiara).

## What the receiver should produce

### Implementazione asset (nuovo — da asset-curator)

1. Cover finale (texture carta + timbro "01", testo HTML separato) su landing,
   teaser home; micro-variante overlay per popup se implementate il thumbnail
   D6. Un solo file/texture sorgente per tutte le superfici (A2/A3).
2. Rimozione blocco `HERO_IMAGE` in `VieniConNoi.tsx:123-131` (A4).
3. `alt=""` sulla cover nelle tre superfici (A6) — sostituendo l'alt descrittivo
   attuale.
4. Estensione `scripts/generate-og-images.mjs` per `guida-in-regalo` + fix
   output `.jpg` mancante (A5). Rigenerare e verificare peso (`npm run
generate:og-images` o equivalente).
5. **Verifica indipendente, utile ma non tua a fixare ora**: `PREVIEW_PLACES` in
   `HomeLeadMagnet.tsx:6-11` (`Procida fuori stagione`, `Maremma termale`, `Val
d'Orcia lenta`, `Cilento interno`) **non corrispondono a nessuno dei 10 posti
   reali della guida** (Specchia/Tricase Porto/Acaya/Vico del
   Gargano/Scanno/Rasiglia/Castelluccio di Norcia/Lago di Tovel/Val di
   Funes/Bosa — fonte: `LeadMagnetDocument.tsx`). Non è solo la questione di
   esclusività già sollevata da seo (Deliverable C): sono luoghi **assenti**
   dalla guida vera. Se restano in pagina, il teaser promette contenuto che il
   PDF non contiene. Dato che sei già su questo file per il rename, è il
   momento più economico per toglierli o sostituirli con le categorie astratte
   che seo raccomanda.

### Inventario rename (tutti i punti che referenziano `/italia-nascosta`)

Codice (aggiornare al nuovo slug, e aggiungere il redirect dal vecchio):

- `src/App.tsx:112` — dichiarazione route `italia-nascosta` → nuovo slug.
- `src/App.tsx:99-100` — redirect `/vieni-con-noi` e `/iscrivi`: puntarli **direttamente** al nuovo slug. Aggiungere una nuova route redirect `/italia-nascosta` → nuovo slug.
- `src/config/surfaces.ts:57` — voce registro superfici `{ path: '/italia-nascosta', ... }`.
- `src/config/site.ts:21-22` — `BIO_LINKS.instagram` / `.tiktok` (URL con UTM).
- `src/pages/VieniConNoi.tsx` — `canonical` (116), `route` tracking (97), id/htmlFor form (297, 306, 335, 339), OG image path (117), + tutta la copy/asset nuovi.
- `src/pages/LeadMagnet.tsx:31` — `<Navigate to="/italia-nascosta?from=lead-magnet">` → nuovo slug.
- `src/components/Layout.tsx:31` — `isGuideLanding = pathname === '/italia-nascosta'` → nuovo slug.
- `src/components/Navbar.tsx:502` e `:836` — CTA "La guida in regalo" (desktop + mobile).
- `src/components/home/HomeLeadMagnet.tsx:65` — link "Vedi cosa ricevi".
- `src/components/home/curated/CleanCuratedHero.tsx:55`.
- `src/components/home/diario/DiarioHeroCinematic.tsx:59`.
- `src/experience/sentiero/sentieroData.ts:123` (home sperimentale, verificare se attiva; aggiornare comunque per coerenza).

Non-codice (aggiornare dopo lock owner):

- `public/sitemap.xml` — `/italia-nascosta` NON è presente (noindex): nessuna modifica salvo diversa decisione owner.
- Docs che citano lo slug (`docs/...`): aggiornabili ma non bloccanti.

Fuori dal repo (azione owner, non tua): bio IG/TikTok. Il redirect dal vecchio slug copre il periodo di transizione.

### Verifiche prima di consegnare

- `npm run typecheck` e `npm run audit:ui` verdi.
- Vecchi URL (`/italia-nascosta`, `/vieni-con-noi`, `/iscrivi`) atterrano sulla nuova landing senza catene multiple.
- Roundtrip funnel in locale: submit form → `sessionStorage` unlock → redirect `/lead-magnet` → download PDF ok.
- Nessun secondo H1, zero overflow orizzontale a 375px.
- **Nuovo**: peso cover texture misurato (target ≤40KB, ben sotto i 200KB standard hero — è una texture, non una foto). Un solo elemento `priority`/`fetchpriority=high` nella pagina (la cover). OG `.jpg` rigenerato e ≤300KB. Contrasto testo-su-carta verificato (AA) con i token indicati in A2.

- Dove atterra: `docs/50_Scratch/HANDOFF_lead-magnet-rework_frontend_to_gate.md`.

## Out of scope (do NOT touch)

- `server.ts`, `firestore.rules`, `admin.ts`, endpoint API.
- Contenuto del PDF; attivazione chiavi Resend/Brevo (env owner).
- Redecidere slug/copy/layout/asset (le decisioni A1-A7 sono lockate; se una si rivela impraticabile in implementazione, torna qui prima di deviare).
- Rigenerare il PDF (il titolo cover interno del PDF si allinea al prossimo rigen, non ora).

## Open questions / decisions for the user

- Nessuna sulla scelta Route B (motivata sopra da inventario, non da preferenza).
- Se in futuro R+B forniscono uno scatto reale, non stock, di uno dei 10 posti
  (verticale, senza volti necessari ma presenza umana benvenuta, senza
  testo/watermark bruciato) — Route A torna disponibile e la cover si aggiorna
  mantenendo lo stesso layout testo/timbro. Richiesta esplicita a R+B: **una
  foto verticale (crop 4:5) di uno qualsiasi dei 10 posti della guida, scattata
  da loro**, per sostituire la texture craft con una foto reale in futuro.
- `PREVIEW_PLACES` errati in `HomeLeadMagnet.tsx` (vedi sopra): decisione
  copy, non mia — segnalo con urgenza perché è un errore fattuale, non solo
  una preferenza di posizionamento.

## Next hand-off

- Next agent: `travellini-quality-auditor` + `browser-auditor` (+ `travellini-security-auditor`, light) in parallelo.
- Trigger: pagina live in locale con rename, redirect e asset nuovi funzionanti.

## Notes

- **Come ci sono arrivato (per chi vuole il dettaglio):** ho aperto e valutato
  visivamente `hero-amalfi.png`, `destinations/{puglia,sardegna,dolomiti}.png`,
  `reels/reel-{1..5}-cover.webp`, `experiences/insolito.png`,
  `home-journal/altrove-vicino.png`, oltre a leggere
  `docs/ASSET_STRATEGY.md` e `DECISION_IMAGERY_TRUTH_RULE_2026-07-22.md` per la
  certificazione di provenienza. Nessun file è stato scartato "a naso": ogni
  riga della tabella A1 corrisponde a un file aperto e a un motivo verificabile.
- **Trovata utile per il backlog (non azionata qui):** `destinations/puglia.webp`,
  `sardegna.webp`, `dolomiti.webp`, `toscana.webp` sono probabilmente la stessa
  famiglia di immagini non certificate (iper-sature, zero persone, composizione
  da cartolina) usate come cover di **decine** di posti specifici diversi in
  `src/config/destinations.ts` — un problema di imagery-truth potenzialmente
  molto più grande di questo funnel, che vale un audit dedicato a parte (fuori
  scope qui).
- Memoria: le foto "R&B" nel repo sono AI, non i creator reali — non le ho
  considerate in nessun punto.
- Le route noindex restano fuori da sitemap e `STATIC_ROUTE_META`: comportamento corretto.
- **Titolo con verbo "bandito" — lock deliberato, NON correggere.** "Alla scoperta
  di…" è nella lista anti-cliché interna, ma l'owner ha scelto consapevolmente
  di mantenerlo come titolo evocativo. Non "correggerlo".
