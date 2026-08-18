---
type: partner
area: commercial
status: active
priority: p1
owner: marketing
company: multiple
stage: pipeline
offer_type: media kit / brand collaboration
related: '[[10_Projects/PROJECT_TRAVELLINIWITHUS_SITE]]'
source: business development
tags:
  - partner
  - commercial
---

# PARTNER_PIPELINE_TRAVELLINIWITHUS

## Goal

Tenere ordinata la pipeline di collaborazioni coerenti con il brand.

## Priority verticals

- travel experiences
- hospitality
- food experience
- destination marketing
- travel services

## Next step

- [x] definire schema media kit sul sito (in `MediaKit.tsx` + form lead capture + tracking GA4 attivo da 2026-05-14)
- [x] rendere piu concreti i pacchetti demo della pagina `/collaborazioni` (Stay editoriale, Destinazione da costruire, Content kit per brand) senza inserire prezzi, loghi o case study non verificati — 2026-05-24
- [x] allineare `/media-kit` e PDF generato agli stessi 3 pacchetti demo commerciali — 2026-05-24
- [ ] creare shortlist brand partner ideali — **5 categorie target Q3 2026 (R+B compila nomi reali)**

## Website commercial page update — 2026-05-24

Aggiornata la sezione format della pagina `/collaborazioni` per trasformarla da elenco generico a primo schema commerciale leggibile:

- `Stay editoriale`: proposta per hotel, masserie, relais e soggiorni speciali.
- `Destinazione da costruire`: proposta piu completa per DMO, territori e itinerari multi-contenuto.
- `Content kit per brand`: proposta per prodotti, servizi e travel gear usati in viaggio.

Nota di posizionamento: i pacchetti restano demo, non listini rigidi. Finche non ci sono case study reali e dati autorizzati, evitare loghi partner, testimonianze inventate, risultati numerici non documentati e prezzi pubblici.

Aggiornamento successivo: anche `/media-kit` e il PDF generato da `scripts/generate-media-kit.tsx` usano gli stessi format tramite `siteContentDefaults.collaborations.collaborationFormats`, cosi landing, pagina business e documento scaricabile restano coerenti.

## Shortlist 5 categorie (framework Q3 2026)

### 1. Hotel boutique italiani (×2)

Target: 2 boutique hotel italiani (preferibilmente Puglia + Toscana o Liguria).
Caratteristiche ideali:

- 8-25 camere (no catena)
- Pubblico premium ma non luxury extremo
- Storia interessante (recupero, family-run, design distintivo)
- Apertura a UGC + reel + 1 articolo dedicato

Offerta pacchetto:

- 2 notti gratuite per R+B + breakfast/dinner
- In cambio: 1 articolo sito (1000-1500 parole) + 2 reel IG + 1 stories serie
- Affiliate Heymondo extra per assicurazione (revenue R+B)
- Disclosure FTC visibile sempre

**TODO R+B**: nominare 2 hotel reali (es. Masseria X in Puglia, Hotel Y in Lunigiana). Servono contatti diretti email/IG DM.

### 2. DMO regionale italiana (×1)

Target: 1 ente turismo regionale italiano (Marche, Umbria, Basilicata, Molise — regioni meno over-Pinterest-ate).
Caratteristiche ideali:

- Budget annuale promo per creator (~3-15K)
- Apertura a partnership pluriennale (no one-shot)
- Permesso di articolo onesto (incluso "cosa migliorare")

Offerta pacchetto:

- 1 viaggio 5-7 giorni con itinerario co-progettato
- In cambio: 1 articolo pillar 1500+ parole + 4 reel + 2 newsletter + serie stories
- Compenso onorario o copertura spese + fee

**TODO R+B**: identificare DMO già contattata o nuova (priorità: ente Marche/Umbria che ha già lavorato con creator simili).

### 3. Experience provider verticale (×1)

Target: 1 fornitore esperienza (cooking class autentica, sailing, slow tour ferroviario, fotografia naturalistica).
Caratteristiche ideali:

- Esperienza repeatable e premium
- Owner-led (non franchising)
- Coerente con "viaggi in coppia"

Offerta pacchetto:

- Esperienza per R+B gratuita
- In cambio: 1 articolo dedicato + 1 reel + GetYourGuide affiliate
- Co-marketing su prossime esperienze

**TODO R+B**: scegliere 1 esperienza già vissuta + amata (es. cooking class in Sicilia, sailing Sardegna).

### 4. Brand travel-gear premium (×1)

Target: 1 brand prodotti viaggio premium (Bric's, Aer, Peak Design, Tortuga, Bellroy, Away — quelli accessibili).
Caratteristiche ideali:

- Prodotto durevole, non gadget
- Brand affinity con audience adulta R+B (no Gen Z gadget)
- Apertura a UGC review onesto (incluso cons)

Offerta pacchetto:

- Prodotto in regalo + sconto codice per audience
- In cambio: 1 review onesta 600-800 parole + 1 reel "in viaggio con X"
- Affiliate code dedicato (revenue R+B)

**TODO R+B**: scegliere brand già usato (no untested) — la review onesta funziona solo se autentica.

### 5. Affiliate program "evergreen" (deja attivi, da consolidare)

Status già documentato:

- ✓ GetYourGuide (link affiliato attivo)
- ✓ Heymondo (link affiliato attivo)
- ⚠ Skyscanner (TODO R+B: registrarsi al programma BFCA)
- ⚠ Booking.com BFCA (TODO R+B: registrarsi)
- ⚠ Airalo (TODO R+B: registrarsi)
- ⚠ Revolut Affiliate (TODO R+B: registrarsi)

## Outreach template email (proposta consigliata)

```text
Oggetto: Collaborazione editoriale Travelliniwithus — [nome brand]

Ciao [Nome contatto],

sono Rodrigo, insieme a mia moglie Betta gestiamo Travelliniwithus
(172K Instagram, 90K TikTok, sito editoriale). Lavoriamo solo su
collaborazioni allineate con il brand e con piena libertà
editoriale.

Ho seguito [dettaglio specifico del loro lavoro/struttura], e
volevo proporvi una collaborazione su [tipo: hotel stay, esperienza,
articolo dedicato].

Lo schema che funziona bene per i nostri lettori e per le strutture
che lavorano con noi:
- [1-2 frasi su cosa produciamo: 1 articolo sito + reel + stories]
- Pubblico tracciabile (sessioni post-articolo, click bio)
- Disclosure FTC visibile

Vi giro il media kit sintetico: travelliniwithus.it/media-kit

Se vi interessa approfondire, possiamo fare 20 minuti di call?

A presto,
Rodrigo & Betta
```

## Target Q3 2026

- 5 proposte inviate entro 2026-09-30
- 2 risposte positive minimum (40% rate è realistico per outreach
  targeted)
- 1 collaborazione chiusa entro 2026-10-31

## Tracking pipeline (mantenere aggiornato)

Per ogni partner crea note in `docs/12_Partnerships/[nome-partner].md` con:

- Status (cold / contacted / replied / in_negotiation / closed / archived)
- Last touch date
- Channel (email, IG DM, referral, evento)
- Note conversazione
- Output atteso (articolo, reel, ecc.) + scadenza

## Links

- [[MARKETING_OPERATIONS_HUB]]
- [[90_Templates/TPL_Partner]]
- [[../10_Projects/PROJECT_RELEASE_READINESS]]
