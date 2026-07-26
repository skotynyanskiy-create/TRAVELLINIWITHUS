---
title: HANDOFF_lead-magnet-rework_growth_to_seo
status: open
created: 2026-07-23
from: travellini-growth-revenue-operator
to: travellini-seo-conversion-strategist
slug: lead-magnet-rework
expires: 2026-08-06
type: handoff
area: delivery
---

# Handoff: URL definitivo + copy + meta + redirect map per la landing lead magnet

## Why this work matters

L'owner non gradisce l'URL `/italia-nascosta` e vuole un'alternativa migliore.
Tu owni la decisione URL (con approvazione owner), la copy della landing, i meta
e la strategia di redirect. Nota chiave: la pagina è `noindex`, quindi lo slug
**non** compete su Google — l'obiettivo è memorabilità, condivisibilità in bio
IG/TikTok, coerenza brand e igiene dei redirect, non il ranking organico. Sii
onesto su questo nel brief.

## Decisions already made (growth — lockate 2026-07-23)

Non rimettere in discussione i punti seguenti. Sono l'input di offerta/funnel su
cui costruisci URL + copy + meta.

### Persona (una sola)

**La coppia italiana che pianifica il prossimo viaggio "particolare" in Italia.**
28-45 anni, segue @travelliniwithus su IG/TikTok, arriva quasi sempre da
bio-link (quindi **mobile-first**, sessione breve, warm). Cerca "posti
particolari" — coerente con la bio IG verbatim "POSTI PARTICOLARI IN TUTTO IL
MONDO" — non turismo di massa, non l'ennesima classifica SEO/Pinterest. Decide
in coppia, salva idee per dopo. Vuole una **shortlist corta, provata da persone
reali di cui si fida**, con indicazioni pratiche. La copy parla a "voi due", non
a un pubblico generico.

### Angolo di valore (perché la guida vale un'email)

L'email non si scambia per "un PDF": si scambia per **i criteri di selezione di
Rodrigo & Betta**. Quattro leve, in ordine:

1. **Curata da persone reali** (community 260K+, couple-led) — non da un
   algoritmo. Prova sociale + fiducia.
2. **Provata sul campo** — "ci siamo stati", non scraping. Coerente con la
   promessa pubblica "meraviglia concreta" (luogo + prezzo + prova personale).
3. **Pratica e decidibile** — per ogni posto: quando andare, ritmo, cosa
   evitare, come arrivare / ordine di costo. Non lirica.
4. **Corta** — 10 posti, una lista che si tiene pronta, non una wishlist
   infinita.

L'email dà accesso **prima degli altri** ai "posti particolari" nuovi: è il
motivo per restare iscritti, non solo per scaricare una volta.

### Metrica primaria

**Conversion rate della landing consolidata = `newsletter_signup` (accoppiato a
`lead_magnet_signup`) / `landing_view`, sulla sola landing.** È il numero che
decide go/no-go sul redesign. Secondarie: (a) signup confermati/settimana; (b)
**integrità di consegna** = `lead_magnet_download` / `lead_magnet_signup` (scopre
rotture nella gamba di delivery). Nessun target inventato qui: il baseline e le
soglie di kill vanno estratti da GA4/Firestore. `[VERIFY: baseline conversion
rate landing + volume settimanale via travellini-data-analyst prima di fissare
il target/kill]`. Oggi il baseline pulito **non è calcolabile** perché la
cattura è frammentata su 4 superfici con `source` e comportamenti divergenti
(vedi funnel map) — consolidare **è** ciò che rende la metrica misurabile.

### Consolidamento delle superfici di cattura — Opzione A (locked)

**La home NON ospita più un form parallelo. La landing consolidata è l'unica
superficie con il form email.** La sezione home (`HomeLeadMagnet.tsx`) diventa un
**teaser editoriale minimale con una sola CTA** che porta alla landing (nessun
`<Newsletter>` inline, nessuno stato success duplicato in home).

Motivazione:

- Un solo form = un solo percorso di submit, un solo success state, una sola
  attribuzione → la metrica primaria diventa calcolabile.
- Un solo posto dove ottimizzare copy/design → niente divergenza di naming e
  promessa (oggi la guida ha **almeno 4 nomi diversi** tra le superfici, vedi
  vincolo naming).
- La landing regge più prova/reassurance di una striscia home → converte meglio
  l'opt-in "considerato". Il pubblico bio-link atterra comunque già sulla
  landing: per loro zero attrito aggiunto.
- Elimina la ridondanza attuale (la home ha **sia** un link "Vedi cosa ricevi"
  **sia** un form: due inviti in competizione nello stesso blocco).

Scartata l'Opzione B (tenere due form sincronizzati a mano): due submit path,
attribuzione spezzata e drift di copy perenne — esattamente ciò che l'owner
vuole eliminare.

### Vincolo di naming della guida (conseguenza del consolidamento)

Consolidare impone **un solo nome della guida, identico su ogni superficie**:
landing (H1 + mockup cover), `/lead-magnet`, metadati del PDF
(`LeadMagnetDocument.tsx`), teaser home, navbar, exit-intent. Oggi coesistono
"Alla scoperta dell'Italia nascosta" (landing), "10 posti italiani non ovvi"
(`/lead-magnet` + PDF), "10 posti italiani da salvare" (Diario), "10 luoghi
italiani da salvare" (home): va scelto **un** naming e propagato ovunque. La
scelta del titolo definitivo resta owner-decision (vedi Open questions), ma il
vincolo "uno solo, ovunque uguale" è lockato.

### Vincolo strategico sullo slug (per la tua shortlist)

Lo slug è un **bio-link permanente**, non una campagna. La bio dice "posti
particolari **in tutto il mondo**": la guida #1 è Italia, ma il contenitore
dovrà ospitare guide future (altri paesi) **senza rinominare il bio-link**.
Quindi: **preferire uno slug evergreen/di relazione, non geo-loccato su
"italia".** Un URL come `/italia-*` costringe a rinominare il bio-link alla
guida #2 — costo di brand da evitare.

Criteri di brand per i 3 candidati (tu poi raccomandi + owner approva):

- **Breve**: idealmente 1 parola/segmento, path leggibile, ~≤20-22 caratteri.
- **Pronunciabile a voce**: deve funzionare detto in un reel/stories
  ("vai su travelliniwithus.it/\_\_\_") e in uno screenshot bio.
- **Evergreen, non geo-locked**, non stagionale (vedi sopra).
- **Tono**: evocativo ma comprensibile, italiano, coerente con "meraviglia
  concreta" / "posti particolari". Niente "gratis"/"free" nel path (ok in copy).
  "guida"/"regalo" ammessi ma non obbligatori.
- **Igiene tecnica**: minuscolo, trattini, no underscore, no parametri nel path,
  nessun accento.

### Punti fermi già noti

- La pagina resta `noindex` (landing + `/lead-magnet`). Non renderla
  indicizzabile senza mandato owner esplicito. Lo slug quindi **non compete su
  Google**: ottimizza memorabilità e condivisibilità, non ranking.
- L'URL cambia; `/italia-nascosta`, `/vieni-con-noi`, `/iscrivi` restano come
  redirect verso il nuovo slug (spec redirect è tua, senza catene).

## Context the receiver needs

- Pagina di cattura: `src/pages/VieniConNoi.tsx` (H1 attuale: "Alla scoperta dell'Italia nascosta"; meta title/description e `canonical` alle righe 113-119).
- Pagina post-iscrizione: `src/pages/LeadMagnet.tsx` (SEO alle righe 36-42, anch'essa `noindex`).
- Redirect esistenti: `src/App.tsx:99-100` (`/vieni-con-noi`, `/iscrivi` → `/italia-nascosta`).
- `/italia-nascosta` NON è in `public/sitemap.xml` (corretto: è noindex). Nessuna modifica sitemap necessaria per lo slug, salvo decisione di indicizzare.

### Funnel map end-to-end (stato attuale, con i punti di rottura)

Entry point → landing → submit → unlock → `/lead-magnet` → download → welcome email.

**Entry points reali oggi** (tutti puntano a `/italia-nascosta`, da rinominare):

- Bio IG / TikTok → `BIO_LINKS` in `src/config/site.ts:20-23`
  (`?utm_source=ig_bio|tt_bio`) — **canale principale, mobile-first**.
- Navbar "La guida in regalo", desktop + mobile → `Navbar.tsx:502, 836`.
- Hero home → `CleanCuratedHero.tsx:55` (`clean_hero_biohub`) e
  `DiarioHeroCinematic.tsx:59` (`diario_clean_hero_biohub`).
- Teaser home `HomeLeadMagnet.tsx:65` (link "Vedi cosa ricevi") **+ form inline**
  (`<Newsletter source="home_lead_magnet">`, riga 134) → **doppio invito**.

**Landing** (`VieniConNoi.tsx`): fire `landing_view`; submit →
`newsletter_submit_attempt` → POST `/api/newsletter-subscribe` → success
`completeSignup(false)` **oppure** fetch fail → `appendLeadFallback` localStorage
→ `completeSignup(true)`. Entrambe: `sessionStorage twu_lead_magnet_unlocked='1'`

- fire **`newsletter_signup` e `lead_magnet_signup`** → success state con link
  "Apri la guida" → `/lead-magnet`.

**`/lead-magnet`** (`LeadMagnet.tsx`): gated da sessionStorage; se non unlocked →
`Navigate` a `/italia-nascosta?from=lead-magnet`. Se unlocked → bottone download
`/lead-magnet-posti-italiani.pdf` (asset statico in `public/`, funziona) →
`lead_magnet_download`. Copy in pagina promette anche consegna via email.

**Welcome email**: server, RESEND/BREVO. Fallback "save-lead-only" se le chiavi
mancano (lead salvato, niente email).

**Punti di rottura da conoscere per la copy (non li risolvi tu, ma la copy non
deve prometterli come garantiti):**

1. **Welcome email owner-blocked**: per i docs, `RESEND_API_KEY`/`BREVO_API_KEY`
   non risultano attivi in prod. Oggi la consegna **reale** avviene sulla pagina
   `/lead-magnet` (download diretto), non via email. La copy di `/lead-magnet`
   che dice "arriva anche via email entro qualche minuto" è **falsa a chiavi
   spente** → rischio fiducia. Attenua la promessa email finché non confermata.
2. **Frammentazione a 4 superfici**: oltre a landing + home, esistono
   `ExitIntentPopup.tsx` e `DiarioConversionSection.tsx`, entrambe con form
   proprio **e un download PDF ungated** (`/lead-magnet-posti-italiani.pdf` in
   chiaro, senza email). L'`ExitIntentPopup` usa `source="exit_intent_popup"`
   che **non** contiene `lead_magnet`, quindi (per `Newsletter.tsx:151`) **non
   unlocka e non mostra** il link a `/lead-magnet`. Attribuzione e comportamento
   divergono; solo la landing emette la coppia `newsletter_signup +
lead_magnet_signup`. Consolidamento home→landing è lockato; il destino di
   exit-intent/diario e del **PDF ungated** è owner-decision (vedi Open
   questions) — non è compito tuo, ma non introdurre naming nuovo che li
   allontani ancora.
3. **Unlock solo sessionStorage**: se l'utente chiude la scheda prima del
   download e la gamba email è spenta, deve re-iscriversi. Consegna fragile.

Inventario completo dei riferimenti da rinominare: vedi
`HANDOFF_lead-magnet-rework_asset_to_frontend.md`, sezione "Inventario rename".

## What the receiver should produce

1. **Shortlist di 3 slug candidati** con motivazione (memorabilità, lunghezza, coerenza brand, pronunciabilità a voce, pulizia in bio-link). Marca la raccomandazione e lascia l'ultima parola all'owner. Considera se lo slug deve contenere "guida"/"regalo"/"gratis" o restare evocativo.
2. **Copy della landing**: H1, sottotitolo, microcopy CTA (bottone attuale "Ricevi la prima guida"), righe di valore, reassurance privacy, stato success. Italiano, specifico, no verbi banditi.
3. **Meta**: title + description + OG (title/description/image) — contano per la condivisione social anche se noindex.
4. **Redirect map completa** (spec, non codice): vecchio slug `/italia-nascosta` → nuovo; `/vieni-con-noi` e `/iscrivi` → puntare **direttamente** al nuovo slug (evitare catene di redirect). Chiarire che è redirect client-side in `App.tsx` (non `server.ts`).
5. **Coerenza titolo guida ↔ slug**: raccomandazione se allineare il titolo "Italia nascosta" al nuovo naming.

- Dove atterra: `docs/50_Scratch/HANDOFF_lead-magnet-rework_seo_to_ui.md`.

## Out of scope (do NOT touch)

- Direzione visiva, layout, scelta foto, OG image design (ui-designer + asset-curator).
- Implementazione dei redirect (frontend-builder).
- Rendere la pagina indicizzabile senza mandato owner.
- `server.ts` e l'endpoint API.

## Open questions / decisions for the user

- Approvazione dello slug finale dalla shortlist.
- **Titolo guida definitivo** (uno solo, poi propagato ovunque per il vincolo di
  naming): coerente con lo slug evergreen, non geo-locked se possibile.
- **PDF ungated in `ExitIntentPopup` + `DiarioConversionSection`**: la guida oggi
  è scaricabile senza email da due superfici. Un lead magnet regalato senza
  cattura non è un lead magnet e abbassa la metrica primaria. Raccomandazione
  growth: **gate email-first** su tutte le superfici, oppure decidere
  consapevolmente di tenere l'ungated come gesto "high-trust" solo in exit-intent
  (mai in home/landing). Decisione owner.
- **Gamba welcome email** (`RESEND`/`BREVO`): confermare se attiva in prod. Se
  no, la copy non deve prometterla come garantita.
- **Home diario/cinematic in arrivo** (branch `wip/...diario-e-cinematic-home`):
  se la nuova home va live, la sua sezione di conversione deve adottare lo stesso
  pattern consolidato (una CTA verso la landing unica), non introdurre un
  ennesimo form divergente.

## Next hand-off

- Next agent: `travellini-ui-designer`
- Trigger: slug lockato dall'owner + copy/meta/redirect spec pronti.

## Notes

- Inventario completo dei punti che referenziano `/italia-nascosta` (per la redirect map e per frontend): vedi `HANDOFF_lead-magnet-rework_asset_to_frontend.md`, sezione "Inventario rename".
