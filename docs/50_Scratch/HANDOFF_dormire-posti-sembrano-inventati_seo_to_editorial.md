---
title: HANDOFF_dormire-posti-sembrano-inventati_seo_to_editorial
status: consumed
created: 2026-08-18
from: travellini-seo-conversion-strategist
to: travellini-editorial-writer
slug: dormire-posti-sembrano-inventati
expires: 2026-09-15
type: handoff
area: delivery
---

# Handoff: corpo del pillar «Posti che sembrano inventati» — 2.200-2.800 parole in markdown

## Why this work matters

Chi rankano oggi su questa query non c'è mai stato. Il pezzo vince o perde su
una cosa sola: **si legge che ci siamo dormiti**. Ogni riga che potrebbe essere
scritta da chi ha solo guardato le foto della struttura è una riga che ci
riporta in mezzo agli altri.

## Decisions already made (locked — non rilitigare)

1. **Slug** `dormire-posti-sembrano-inventati`. **H1, meta ed excerpt sono già
   scritti** nella sezione `## SEO` della content note: usali, non riscriverli.
2. **Audience, metrica, lista delle voci e loro ordine**: sezione `## Brief`
   della stessa nota. **La lista è chiusa.** Non aggiungere una struttura
   perché «starebbe bene», non toglierne una perché «non ti convince».
3. **Apertura con Emotional Grand Motel**, disclosure `collaboration`
   dichiarata nel corpo alla prima menzione.
4. **Ogni voce porta la sua disclosure nel corpo**, con l'etichetta reale del
   registro. Cinque valori possibili: `organic`, `invited`, `adv`,
   `collaboration`, `affiliate`. Si scrive **a parole**, non solo con un colore
   o un'icona.
5. **Il prezzo si scrive solo se sta in `value.price`** della scheda. Se manca,
   **non si scrive niente**: mai «n.d.», mai «prezzi a partire da circa», mai
   una stima.
6. **Nessun `[VERIFY]` nel corpo.** [MISURATO:
   `scripts/publish-article-seed.mjs:22-28,97-100`] La stringa `[VERIFY` fa
   fallire la pubblicazione. Se hai un dubbio su un dato, **il dato non entra**
   e il dubbio va scritto nella content note sotto `## Body`, fuori dal testo.
7. **La data che possiamo citare è quella del reel**, non della visita: nel repo
   `publishedAt` è la data di pubblicazione. Si scrive «il reel è di
   settembre 2024», non «ci siamo stati il 16 settembre 2024» — a meno che il
   Brief non riporti date di visita confermate dall'owner.
8. **Link interni**: ogni struttura citata linka `/posto/:id` **con l'id del
   seed**. Attenzione: Spino Fiorito ha un doppione placeholder; l'id giusto è
   `casola-spino-fiorito`, **non** `toscana-mirror-house-spinofiorito`.
9. **Aggiunte del 2026-08-18, a valle della sezione `## SEO`** — sono lì per
   esteso, qui solo perché sono le tre cose che si sbagliano leggendo in fretta:
   - **Gli H3 dicono la cosa strana, non il nome del posto.** Il blocco `:::posto`
     stampa già un `<h3>` con l'insegna: ripeterla produce due `h3` gemelli.
   - **Le tre card vanno una per movimento**, non tre nello stesso H2. Quali tre
     resta tua scelta, la distribuzione no.
   - **Le due voci della micro-sezione «dove non si dorme» non si linkano** a
     `/posto/:id`: un clic da lì falserebbe la metrica primaria e gonfierebbe
     l'`ItemList` a dodici. I nomi si scrivono per esteso, senza link.

## Context the receiver needs

- Content note (scrivi lì, sezione `## Body`):
  `docs/13_Content/ARTICLE_dormire-posti-sembrano-inventati.md`
- Registro, unica fonte dei fatti: `src/data/content-seed.json`. Per ogni voce
  usa `title`, `place.name/address/city/region`, `description`, `value.price`,
  `partnership.kind`, `practical.toKnow`, `publishedAt`.
- Manifest reel (per `:::reel`): `src/config/reels.ts` — l'id del reel ha la
  forma `reel-<id del posto>`, es. `reel-novara-emotional-grand-motel`.
- Blocchi editoriali disponibili e **loro budget**:
  `docs/50_Scratch/HANDOFF_editorial-blocks-v2_ui-designer_to_frontend-builder.md`
- Voce del brand: `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`

### Il budget dei blocchi è un vincolo, non un suggerimento

[MISURATO: spec blocchi v2, §«Budget anti-fiera»] Massimo **8 blocchi in tutto
l'articolo**; mai due blocchi consecutivi senza almeno due paragrafi (~150
parole) in mezzo. Per tipo: `verdetto` 1, `mappa` 1, `domande` 1, `dati` 2
(uno `costi`, uno `pratiche`), `reel` 2, `posto` 3.

**Questo significa che 8-10 voci non possono avere ciascuna il proprio
`:::posto`.** Tre voci ricevono il blocco; le altre vivono nella prosa con un
link inline a `/posto/:id`. Scegli tu quali tre, e scrivi in fondo alla content
note perché quelle. Non convivono: `:::posto` e `:::verdetto` sullo stesso
posto; `:::domande` e `:::dati{tipo=pratiche}` nella stessa sezione H2.

Un blocco si guadagna con **almeno tre righe di dato vero**. Un orario, un
prezzo singolo, un consiglio o un link **non meritano un blocco**.

Regole di render da conoscere prima di scrivere:

- `:::posto{id="..."}` **non renderizza** se la scheda ha `isPlaceholder: true`.
  Tutte le voci del Brief sono complete: verifica comunque prima di usarlo.
- `:::verdetto` vuole **esattamente due paragrafi**: «per chi sì», «per chi no».
  Uno solo o tre generano un warning in dev.
- `:::dati{tipo="costi"}` senza l'attributo `perQuante="2 persone, 2 notti"` è
  un totale che non significa niente. Se non sai per quante persone, non usare
  il blocco costi.
- `:::mappa{posti="id1,id2,..."}` senza consenso marketing degrada all'elenco
  testuale. Va bene: l'elenco è anche la sua accessibilità.

## What the receiver should produce

Nella sezione `## Body` della content note, il **corpo completo in markdown**,
pronto da incollare nel campo `content` del seed:

- **2.200-2.800 parole.** Sotto le 2.000 non è un pillar; sopra le 3.000 nessuno
  arriva in fondo.
- **Un attacco che non è una lista.** Le prime 150 parole devono contenere una
  cosa che solo chi c'è stato può scrivere: un dettaglio fisico, un imprevisto,
  una cosa che non torna. Non «l'Italia è piena di posti incredibili».
- **La struttura H2 decisa dalla SEO**, con il raggruppamento motivato: non una
  sezione per struttura in fila, che è esattamente il formato dei concorrenti.
- **Per ogni voce**: cosa la rende strana per davvero (dalla `description` del
  registro), com'è dormirci, per chi **non** va bene, la disclosure, il prezzo
  se e solo se c'è, il link `/posto/:id`.
- **Un `:::verdetto`** su tutto il pezzo, o sulla voce che merita di più — non
  uno per struttura.
- **Una chiusa che porta due strade**: al lettore («scegline uno, prenotalo») e
  a chi gestisce una struttura (una riga sobria verso `/collaborazioni`, il
  posizionamento è nel Brief). Una riga, non un paragrafo di vendita.
- In coda alla nota, fuori dal corpo: l'elenco dei **dubbi non risolti**, dei
  dati che avresti voluto e non c'erano, e delle tre voci a cui hai dato
  `:::posto` con la motivazione.

## Out of scope (do NOT touch)

- Non toccare H1, meta, excerpt, slug (già lockati dalla SEO).
- Non scegliere le foto né scrivere gli alt (asset-curator).
- Non toccare `src/`, il seed, il registro, i manifest.
- Non aggiungere strutture fuori dal registro, nemmeno come «menzione».
- Nessun `[VERIFY]`, nessun prezzo stimato, nessuna data di visita inventata,
  nessun superlativo generico («magico», «da sogno», «incredibile»).
- Niente `:affiliato` a meno che il Brief non lo chieda esplicitamente: un link
  affiliato dentro un pezzo che espone disclosure di collaborazione va deciso,
  non improvvisato.

## Open questions / decisions for the user

- Se il Brief non ha chiuso la domanda sui **costi reali pagati**, scrivi il
  pezzo senza il blocco `:::dati{tipo="costi"}` e segnalalo: si aggiunge dopo,
  in una riga, se l'owner fornisce i numeri.

## Next hand-off

- Next agent: `travellini-asset-curator`
- Trigger: corpo completo in `## Body`, conteggio parole dichiarato, elenco dei
  blocchi usati con il budget rispettato. Brief pronto in
  `HANDOFF_dormire-posti-sembrano-inventati_editorial_to_asset.md`.

## Consumato — 2026-08-18, travellini-editorial-writer

Corpo completo in `## Body` della content note (~2.700 parole, 7 blocchi su 8:
`posto` 3 · `reel` 2 · `dati{pratiche}` 1 · `domande` 1). Ordine delle dieci voci
e tre movimenti rispettati, apertura su Emotional Grand Motel, una card per
movimento (EGM · Granduca · Villa Tolomei, motivate in coda alla nota), nessun
blocco su `bossico-placat`, micro-sezione in prosa senza link né blocchi,
disclosure a parole su tutte e dodici le voci, un solo link a `/collaborazioni`.

**Due cose che questo handoff dava per buone e non lo erano** — entrambe misurate
sul codice, entrambe risolte nel corpo, entrambe da girare a chi implementa:

1. **`:::verdetto` non esiste.** `directiveRegistry` non lo registra e non c'è
   nessun `directives/verdetto.tsx` [MISURATO:
   `src/components/article/directives/index.ts:30-41`]. Scritto in prosa, stessa
   forma a due tempi, in fondo al movimento 3.
2. **`:::dati` separa le righe con `·`, non con `|`.** La spec blocchi v2 dice
   `- Etichetta | Valore`, l'implementazione scarta ogni riga senza `·`
   [MISURATO: `directives/dati.tsx:26-32`]. Il corpo usa `·`; la spec è da
   correggere, non il corpo.

## Notes

Dopo la stesura passano `/anti-ai-slop` e `/verify-facts` prima del gate. Sono
due filtri che leggono lo stesso testo con due domande diverse: «suona come una
macchina?» e «questo numero esiste?». Scrivere pensando a loro adesso costa meno
che riscrivere dopo.
