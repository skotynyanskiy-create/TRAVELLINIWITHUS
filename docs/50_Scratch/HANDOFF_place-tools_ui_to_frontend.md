---
title: HANDOFF_place-tools_ui_to_frontend
status: consumed
created: 2026-07-16
from: travellini-ui-designer
to: travellini-frontend-builder
slug: place-tools
expires: 2026-07-30
type: handoff
area: delivery
---

# Handoff: layout dei 4 strumenti pagina-posto (Dove / Orari-contatti / Condividi / Salva)

## Why this work matters

Sotto il reel Burton Juice la domanda dominante e' "dove si trova?". La pagina-posto
deve rispondere sopra la piega. Questa direzione fissa layout, gerarchia, iconografia,
stati e comportamento mobile/desktop dei 4 blocchi P0, riusando le stringhe IT gia'
bloccate dal SEO (`HANDOFF_place-tools_seo_to_ui.md`) e il registro calmo del brand.

## Decisions already made (SEO + growth — NON rilitigare)

- "Dove" e' priorita' 1, sopra la piega. Metrica primaria: `place_directions_click` >= 15%.
  Quindi **Indicazioni deve essere l'azione visivamente primaria della pagina**.
- Orari/telefono/prenota si delegano a Google finche' non c'e' dato owner; blocchi nativi
  solo se il campo esiste (mai placeholder finto).
- Stringhe IT esatte, `useFavorites()`, pattern share di `Articolo.tsx`, eventi `place_*`:
  gia' definiti nel handoff SEO. Uso quelle, non le cambio.
- Nessun affiliate/widget fuori contesto su questa pagina.

## Decisioni di layout che fisso io (design law)

### Grouping: 1 card "Info pratiche" + 1 riga leggera "Salva/Condividi"

I 4 strumenti si dividono in **due pesi visivi**, non quattro blocchi separati:

- **Card "Info pratiche"** (una sola card) = riferimento su cui si agisce: sezione DOVE +
  sezione ORARI E CONTATTI, divise da un hairline interno.
- **Riga "Salva / Condividi"** = azioni social/utility, chrome-light, FUORI dalla card,
  appoggiate sul fondo sand. Peso inferiore, cosi' non competono con Indicazioni.

Motivo: un'unica card con 3 gruppi di bottoni diventa una "statistic strip" da dashboard
(vietata dal brand). Due pesi distinti tengono la gerarchia: **un solo elemento primario
in pagina = Indicazioni**.

### Superficie card (famiglia visiva gia' esistente)

Stessa ricetta di `ReviewBlock`/`DealCard`, cosi' la pagina resta una famiglia sola:
`rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]
p-6 md:p-8 shadow-[var(--shadow-sm)]`. Niente shadow pesanti, niente card-in-card.
Eyebrow di sezione identico agli altri: `text-[10px] font-bold uppercase
tracking-[0.22em] text-[var(--color-accent-text)]` (come "Prezzo indicativo" / "La nostra
scheda").

### Posizione + ordine DOM (risolve il fold su desktop E mobile)

Tutto vive nella **colonna sinistra (reading column)**, NON nel rail destro. Il rail destro
resta commerciale (Prezzo indicativo + `DealCard`). Ordine nella colonna sinistra:

1. `h1` (hook) — invariato
2. riga luogo + `RatingPill` — invariata
3. **riga Salva / Condividi** (leggera) — NUOVA, subito sotto il luogo
4. **card "Info pratiche"** (Dove + Orari) — NUOVA, prima della descrizione
5. descrizione — invariata (spezza le due card, evita card-on-card)
6. `ReviewBlock` — invariato
7. riga CTA reel — vedi "Cleanup" sotto

Cosi' su mobile (colonna singola) Indicazioni resta alto, sopra la piega, senza nessun
hack di `order`/grid. Su desktop la card sta comunque accanto all'`h1`, sopra la piega.
Il rail destro NON ospita gli strumenti proprio per non rompere lo stacking mobile.

## Anatomia dei blocchi (stringhe = quelle SEO, esatte)

### Card "Info pratiche" — sezione 1: DOVE

- Eyebrow: `Dove si trova`
- Riga luogo derivata (gia' esiste): `nome — citta, regione, paese`, `text-[var(--color-ink-2)]`,
  con `MapPin` size 14 come marker (MapPin resta per l'indirizzo).
- **Bottone primario `Indicazioni`** — pill piena, peso identico a "Guarda il reel":
  `bg-[var(--color-ink)] text-white hover:bg-[var(--color-accent)]`, icona `Navigation`
  (NON MapPin: MapPin e' gia' il marker indirizzo — un'icona per ruolo). Full-width su mobile.
- **Link secondario quiet `Apri sulla mappa`** (solo se `coordinates`) → pin su `/mappa`:
  text-link con underline-offset, `MapPin` size 14, NON un secondo pill (evita due pill che
  competono). Se niente coordinate: si omette, "Indicazioni" resta (query nome+citta).

### Card "Info pratiche" — sezione 2: ORARI E CONTATTI (divisa da `border-t border-[var(--color-border)] pt-6 mt-6`)

- Eyebrow: `Orari e contatti` (opz. `Clock` size 13 accanto).
- Ordine adattivo:
  - `place.hours` (gated) → testo semplice `Mar-Dom 19:00-23:00` con `Clock`, mai placeholder.
  - `place.phone` (gated) → riga `tel:` "Chiama · +39…", icona `Phone`, come text-link.
  - `place.bookingUrl` (gated) → `Prenota un tavolo` (Food) / `Prenota`: pill **outline**
    (stessa dello style secondario), icona `CalendarCheck`, `rel="sponsored noopener"`.
  - **`Vedi su Google`** (sempre) — pill **outline secondaria**:
    `border border-[var(--color-border)] hover:border-[var(--color-accent)]
hover:text-[var(--color-accent)]`, icona `ExternalLink` (segnala off-site). E' l'ancora
    canonica: sempre presente anche senza dato nativo.
  - **Micro-disclaimer** (sempre): `Orari, telefono e prenotazione sono aggiornati
direttamente da Google.` — `text-[11px] text-[var(--color-muted-fg)]`, NIENTE box/border/
    icona/allerta. Calmo e piccolo.
- Vincolo gerarchia: nella card **un solo primario = Indicazioni**. "Vedi su Google" e
  "Prenota" restano entrambi outline (non due pieni che competono).

### Riga "Salva / Condividi" (fuori card, sopra la descrizione, dopo il luogo)

- Riga di contesto calda (una sola): `Salvalo, o mandalo a chi ci deve venire.`
  `text-sm text-[var(--color-ink-2)]`. Su desktop a sinistra, bottoni a destra; su mobile
  sopra i due bottoni.
- **`Salva`** — ghost pill; stato salvato = `bg-[var(--color-accent)] text-white` + `Heart`
  fill (identico ad `ArchiveCard`). `aria-pressed`, label `Salva`/`Salvato`, aria-label
  `Salva nei preferiti`/`Rimuovi dai preferiti`. `useFavorites()`, slug = `item.id`.
- **`Condividi`** — ghost pill, icona `Share2`; su copia-link desktop diventa `Link copiato`
  - `CheckCircle` per ~2s poi torna (identico ad `ArticleHero`). aria-label `Condividi questo
posto`. `sr-only` `role="status" aria-live="polite"` per la conferma. Mobile: share sheet
    nativo, nessuna conferma in-app, silenzioso su cancel.
- I due bottoni sono pari-peso tra loro, entrambi piu' leggeri di Indicazioni. Su mobile:
  affiancati 50/50 full-width, min tap 44px.

## Cleanup necessario (evita duplicati)

- Rimuovere l'attuale bottone "Apri sulla mappa" dalla riga CTA reel: oggi punta a `/mappa`
  generica (bug) ed e' ridondante col nuovo pin nella card. La riga CTA reel resta con **solo
  "Guarda il reel"**. Il ritorno alla discovery lo copre gia' `PostNavigation`.
- Non introdurre un secondo `MapPin` come icona-bottone: MapPin = marker indirizzo,
  `Navigation` = azione Indicazioni.

## Stati (hover/focus/motion) — validi per tutti i nuovi controlli

- Primario Indicazioni: `bg-ink → hover:bg-accent`.
- Secondari (Vedi su Google, Prenota, Salva-non-salvato, Condividi): outline/ghost
  `border-[var(--color-border)] → hover:border-accent hover:text-accent`.
- **focus-visible esplicito su ogni controllo** (l'a11y e' un gate CI, >=0.95):
  `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]
focus-visible:ring-offset-2`.
- `motion-reduce`: nessun feedback solo-trasform; il cambio di colore/label resta.
- Salvato: `bg-accent text-white` + heart fill. Copiato: `text-accent-text` + `CheckCircle`,
  reset 2s.

## Mobile vs desktop

- Card: desktop 2 colonne interne (Dove | Orari e contatti); mobile stack singolo, hairline
  tra le due sezioni. Bottoni full-width mobile, auto inline desktop. Zero overflow: indirizzo
  e bottoni wrappano.
- Riga Salva/Condividi: desktop inline con warm-line a sinistra; mobile warm-line sopra,
  bottoni 50/50 sotto.
- Web Share: mobile nativo (nessuna conferma), desktop clipboard + "Link copiato".

## Icon lock (lucide-react)

`Navigation` (Indicazioni) · `MapPin` (marker indirizzo + link "Apri sulla mappa") ·
`Clock` (orari) · `Phone` (Chiama) · `CalendarCheck` (Prenota) · `ExternalLink`
(Vedi su Google) · `Heart` (Salva, outline→fill) · `Share2`→`CheckCircle` (Condividi→copiato).

## What the receiver should produce

- `src/pages/Posto.tsx`: card "Info pratiche" + riga Salva/Condividi nell'ordine sopra;
  cleanup del bottone mappa duplicato nella riga reel.
- Deep-link builder (Indicazioni Maps, Vedi su Google), campi opzionali `ContentPlace`
  (`hours`/`phone`/`website`/`bookingUrl`/`googlePlaceQuery`), eventi `place_*`
  consent-gated, JSON-LD esteso **solo se dato owner** (pattern del handoff SEO).
- Gate finale: `travellini-quality-auditor` + `browser-auditor` (a11y, no overflow 375px,
  focus visibile, link/eventi corretti).

## Out of scope (do NOT touch)

- Le stringhe IT (le fissa il SEO) — non riscriverle.
- `server.ts`, `firestore.rules`, `admin.ts`.
- Rail destro commerciale (Prezzo + DealCard): non spostarci gli strumenti (romperebbe
  lo stacking mobile del fold).
- Nessun affiliate/eSIM/assicurazione su questa pagina (regola di contesto).

## Open questions / decisions for the user

- Conferma copia-link: `Link copiato` (consiglio SEO+design) vs `Copiato!` (parita' col resto
  del sito). Design non blocca: se si vuole parita' stretta, `Copiato!` e' accettabile.
- Quali posti pilota avranno `hours`/`phone`/`bookingUrl` nativi (altrimenti tutto su Google).

## Next hand-off

- Next agent: `travellini-frontend-builder`.
- Trigger: questa direzione approvata → implementazione layout + deep-link + eventi.
