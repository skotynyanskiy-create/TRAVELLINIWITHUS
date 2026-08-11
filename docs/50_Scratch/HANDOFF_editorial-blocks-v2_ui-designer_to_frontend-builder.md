---
title: HANDOFF_editorial-blocks-v2_ui-designer_to_frontend-builder
status: open
created: 2026-08-11
from: travellini-ui-designer
to: travellini-frontend-builder
slug: editorial-blocks-v2
expires: 2026-09-15
type: handoff
area: delivery
---

# Handoff: 6 blocchi editoriali richiamabili (non 8)

## Why this work matters

Gli articoli oggi hanno 4 primitive (`pullquote`, `fullbleed`, `source`, `verified`,
in `src/components/article/editorial/`). Servono i blocchi che portano la sostanza
del brand dentro il testo — il verdetto, il posto, il costo — senza trasformare
l'articolo in una fiera di riquadri.

## Decisions already made (non rilitigare)

1. **Otto richieste → sei blocchi + una leaf directive.** `costi` e `info pratiche`
   sono lo stesso componente (`:::dati{tipo="costi|pratiche"}`): entrambi sono una
   `<dl>` di coppie etichetta/valore, cambia solo il set di etichette e l'icona.
   `link affiliato` **non è un blocco**: è una leaf directive inline
   (`:affiliato[testo]{href="" provider=""}`). Un riquadro attorno a un link è un
   banner, e questa è la cosa che il brand non fa.
2. **Tre livelli di peso visivo, non uno per blocco.**
   - L1 scuro (`--color-ink-deep`, accenti `--color-accent-on-dark`): SOLO `verdetto`.
     Uno per articolo. È l'unico momento in cui il testo si ferma e giudica.
   - L2 superficie (`--color-surface`, `border-[var(--color-border)]`,
     `rounded-[var(--radius-lg)]`, nessun fondo colorato): `posto`, `reel`. Il peso
     lo porta la foto.
   - L3 filo (nessuna card: `border-y border-[var(--color-border)]`, zero radius,
     zero fondo): `dati`, `domande`, `mappa`(cornice).
     Motivo: con 4 blocchi tutti "card su fondo colorato" la pagina diventa a scacchi.
     `verified` e `source` occupano già `--color-accent-soft` e `--color-sand`.
3. **Tre larghezze, non sei.** In colonna (`verdetto`, `dati`, `domande`);
   edge-to-edge solo su mobile `-mx-5 md:mx-0` (`posto`, `reel`); break-out
   `w-screen ... xl:mx-0` con la stessa meccanica di `FullBleedFigure` (solo `mappa`).
4. **Il verdetto si scrive nel markdown, non si legge dal seed.** Verificato in
   `src/data/content-seed.json`: `forWho` 1/110, `notForWho` 1/110. Un componente
   che legge il seed renderizzerebbe vuoto su 109 posti.
5. **Nessun video parte da solo.** `public/video` pesa 277 MB, file fino a 31 MB.
   `preload="none"`, poster obbligatorio, play solo al tap.
6. **Niente mappa finta senza consenso.** Ripiego = elenco dei posti citati con
   link, copy e pattern identici a `src/components/home/HomeMapSection.tsx` righe 89-104.
7. **Budget anti-fiera** (validato in dev con `console.warn`, non a runtime in prod):
   max 8 blocchi per articolo; max 3 sotto le 1.200 parole; mai due blocchi
   consecutivi senza almeno 2 paragrafi (~150 parole) in mezzo; `verdetto` 1,
   `mappa` 1, `domande` 1, `dati` 2 (uno costi + uno pratiche), `reel` 2, `posto` 3.
   Non convivono: `posto` + `verdetto` sullo stesso posto; `reel` subito dopo
   `fullbleed`; `domande` + `dati{tipo=pratiche}` nella stessa sezione H2.
   **Non merita un blocco**: un orario, un prezzo singolo, un consiglio, un link.
   Il blocco si guadagna con ≥3 righe di dato vero.

## Specifiche per blocco

### 1. `:::posto{id="praga-dog-cafe"}`

Legge `ContentItem` dal seed. Campi verificati e usabili: `cover`, `coverAlt`,
`coverFocusY`, `title`, `place.name/city/region/country`, `value.price`,
`partnership.kind` → `PARTNERSHIP_LABEL`, `id` → `/posto/:id`.
Layout: mobile foto 4:3 sopra edge-to-edge, testo sotto; da `md` due colonne
40/60. Occhiello `Dal registro` (10px, `tracking-[0.22em]`, `--color-accent-text`),
titolo Fraunces `text-xl md:text-2xl`, luogo `--color-muted-fg`, prezzo in
`tabular-nums` medium, disclosure partnership come **testo** (mai solo colore),
CTA testuale `Scheda del posto →` (non pill: dentro l'articolo la pill compete con
la CTA di fine pezzo).
Regole: se `value.price` manca non si scrive nulla (mai "n.d."); se
`isPlaceholder === true` il blocco **non renderizza** e avvisa in dev.
`<aside aria-label="Posto dal registro: {title}">`. Non riusare `ContentCard`
(hover-lift + QuickView sono vocabolario da griglia, non da corpo testo);
riusare `PARTNERSHIP_LABEL` e la logica di `SchedaVerifica`.

### 2. `:::verdetto{titolo="Vale la pena?"}`

Corpo markdown: **esattamente due paragrafi** — primo "Per chi sì", secondo
"Per chi no". In dev, warn se sono 1 o >2. Nessun attributo dati, nessun voto,
nessuna stella (`DECISION` già presa in `src/types/content.ts`).
Fondo `--color-ink-deep`, testo `--color-sand`, etichette
`--color-accent-on-dark`, `p-6 md:p-8`, `my-12 md:my-16`, radius `--radius-lg`.
Due righe con icona lucide (`ThumbsUp` / `ThumbsDown` oppure `Check` / `Minus`),
etichetta uppercase 10px sopra il testo, mai a due colonne sotto `md`.
Contrasto: verificare `--color-sand` su `--color-ink-deep` ≥ 4,5 e
`--color-accent-on-dark` su `--color-ink-deep` ≥ 4,5 nei tre temi audience.
`<aside aria-label="Verdetto">`.

### 3. `:::reel{id="reel-..." | posto="id"}`

Poster-first. Cover dal manifest `src/config/reels.ts` (`cover` + varianti
320/480/768 in `public/images/reels/`), `srcset` obbligatorio.
Ratio 9:16, `max-h-[70vh]` mobile / `max-h-[560px]` desktop, larghezza max
`max-w-[380px] mx-auto` da `md`. Bottone play centrale = `<button>` reale con
label `Guarda il reel: {titolo}`; al tap monta `<video controls preload="none"
playsInline>`. Se `videoSrc` manca → il poster diventa link al permalink IG con
label esplicita `Guarda su Instagram ↗`. Sotto: una riga di didascalia serif
italic come `InlineFigure`. Mai autoplay, mai loop muto decorativo.
[VERIFY: i reel non hanno traccia sottotitoli — se il parlato porta informazione,
la didascalia deve riassumerla in testo.]

### 4. `:::mappa{posti="id1,id2,id3"}`

`coordinates` presenti su 109/110 → dato affidabile. Altezza 220px mobile /
320px desktop, break-out come `FullBleedFigure` (disattivato sopra `xl`), niente
controlli di zoom finti, marker = il pin custom già in
`src/components/map/MapboxWorldMap.tsx`. Sotto la mappa, sempre, l'elenco testuale
dei posti citati con link a `/posto/:id` (è anche l'accessibilità della mappa).
**Senza consenso marketing**: la mappa non monta; resta solo l'elenco su fondo
`--color-ink-deep` più la riga «L'anteprima è ferma… Attivala» (riusa
`canLoad('marketing')`, `onConsentChange`, `setConsent` da `src/lib/consent`).
Non caricare MapLibre finché il blocco non è in viewport.

### 5. `:::dati{tipo="costi|pratiche" titolo="..." totale="..."}`

Corpo = lista markdown `- Etichetta | Valore | nota opzionale`.
Render `<dl>` a filo (`border-y`), riga `flex justify-between` con etichetta
`--color-ink-2` a sinistra e valore `tabular-nums` a destra, separatore
`border-b border-dashed border-[var(--color-border)]/60` fra le righe.
`tipo="costi"`: icona `Receipt`, ultima riga **Totale** in `font-medium
--color-ink` con filo pieno sopra; opzionale attributo `perQuante="2 persone,
3 notti"` reso come nota 11px sotto il totale (senza questo un totale non
significa niente).
`tipo="pratiche"`: icona `Compass`, etichette suggerite «Come si arriva»,
«Quando andare», «Da sapere prima», valori più lunghi → su mobile etichetta sopra
e valore sotto (`sm:flex-row`).
Nessun campo dati esiste nel seed per costi e "come arrivare": **si scrive
nell'articolo**. `place.hours`, `place.phone`, `place.bookingUrl` esistono, ma
sono dati del posto, non dell'articolo: non auto-iniettarli qui.

### 6. `:::domande`

Corpo = sequenza `### Domanda` + paragrafo di risposta.
Render `<details>`/`<summary>` nativi — tastiera e screen reader gratis, funziona
senza JS, zero motion. Prima voce `open`. Icona `Plus`/`Minus` con
`group-open:` (come `ClubFaq`, senza il motion). Peso L3: nessuna card, solo fili.
Se le risposte stanno in una riga non è `domande`, è `dati`.
JSON-LD `FAQPage`: emesso **una sola volta** per pagina e solo se il blocco è
visibile; se l'articolo ha già FAQ altrove, non duplicare.

### 7 (inline). `:affiliato[testo del link]{href="..." provider="Booking"}`

Leaf directive, non blocco. Link `--color-accent-text` con underline
`underline-offset-2`, seguito da un marcatore visibile `· affiliato` in
`text-[11px] uppercase tracking-[0.14em] --color-muted-fg` (AGCOM: dichiarazione
visibile senza azioni aggiuntive). `rel="sponsored nofollow noopener"`,
`target="_blank"`, `aria-label="{testo} — link affiliato, si apre in una nuova
scheda"`. Max uno per sezione H2.
Il caso "offerta con codice" ha già `DealCard` (`src/components/DealCard.tsx`) e il
campo `deal` sul `ContentItem`: se serve nel corpo, riusare quello con
`:::offerta{posto="id"}`, non reinventarlo.

## Out of scope

- Non toccare `pullquote`, `fullbleed`, `source`, `verified`: restano come sono.
- Nessun nuovo token colore, nessun nuovo font, nessuna dipendenza nuova.
- Niente campi nuovi in `src/types/content.ts` in questa slice (vedi open questions).
- Niente carousel, niente tabelle comparative, niente contatori.

## Open questions per l'owner

1. Aggiungere `costs?: { label: string; amount: string; note?: string }[]` al
   `ContentItem`? Direzione: **no per ora** — i costi di un articolo sono di viaggio,
   non di posto. Si riapre solo se gli stessi costi devono comparire su `/posto/:id`.
2. `forWho`/`notForWho` sono compilati su 1 posto su 110
   (`docs/50_Scratch/VERDETTI_29_DA_COMPILARE.md`). Finché restano vuoti, `:::posto`
   non mostra verdetto: confermato?

## Next hand-off

- Next: `browser-auditor` (375/768/1280 + console + tastiera) → `travellini-quality-auditor`.
- Trigger: i 6 blocchi renderizzano in un articolo di prova con il budget attivo in dev.
