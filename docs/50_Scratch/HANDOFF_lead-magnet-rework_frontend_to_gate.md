---
title: HANDOFF_lead-magnet-rework_frontend_to_gate
status: open
created: 2026-07-23
from: travellini-frontend-builder
to: travellini-quality-auditor + browser-auditor + travellini-security-auditor
slug: lead-magnet-rework
expires: 2026-08-06
type: handoff
area: delivery
---

# Handoff: gate finale landing lead magnet (quality + browser + security light)

## Why this work matters

Prima di dichiarare "best in class" e proporre il commit all'owner, la landing
rinnovata + il rename dello slug devono passare un gate osservabile. La pagina è
di lead-capture: la sicurezza va verificata anche se leggera.

## Decisions already made

Rework completo implementato da frontend-builder in questa sessione, a partire
da tre handoff consumati in ordine (tutti ora `status: consumed`):
`HANDOFF_lead-magnet-rework_seo_to_ui.md`, `HANDOFF_lead-magnet-rework_ui_to_asset.md`,
`HANDOFF_lead-magnet-rework_asset_to_frontend.md`.

- **Slug rename completo**: `/guida-in-regalo` renderizza `VieniConNoi`.
  `/italia-nascosta`, `/vieni-con-noi`, `/iscrivi` sono tutti e tre
  `<Navigate replace>` diretti a `/guida-in-regalo` (nessuna catena doppia).
  `?from=lead-magnet` preservato sul redirect di fallback in `LeadMagnet.tsx`.
- **Naming unificato**: titolo "Alla scoperta dell'Italia nascosta" invariato
  ovunque compaia come titolo. Nuovo descrittore "10 posti provati e
  consigliati da noi" sostituisce ogni variante frammentata trovata —
  comprese due occorrenze in `src/lib/email.ts` (welcome email HTML +
  plain-text) **non presenti in nessun inventario degli handoff**, trovate
  seguendo l'istruzione esplicita "trova ogni occorrenza". Deliberatamente
  NON toccati: `src/pdf/LeadMagnetDocument.tsx` (copertina PDF, differita al
  prossimo rigen) e `src/components/home/diario/DiarioConversionSection.tsx`
  (wip, non live) — entrambi esclusi esplicitamente dagli handoff.
- **Nuovo componente condiviso `src/components/LeadMagnetCover.tsx`**: unica
  sorgente per la cover, usata su landing hero, stato di successo landing
  (thumbnail compatta), teaser home e thumbnail popup exit-intent (4 punti
  d'uso, soddisfa D1 "un solo look ovunque"). Route B (carta), zero nuovo
  asset immagine: riusa `--atlante-carta-texture` (già live, approvata,
  tileable) via una nuova classe CSS `.atlante-carta-surface`, più un nuovo
  badge statico `.atlante-stamp-mark` (gemello visivo di `.atlante-stamp-btn`
  senza gli stati interattivi) per il timbro terracotta "01". Entrambe le
  classi aggiunte a `src/styles/atlante.css`.
- **`HomeLeadMagnet.tsx` consolidato**: rimossi il form `<Newsletter>`
  embedded, la riga di rassicurazione `ShieldCheck`, le finte righe TOC
  ("Dove andare/Quando partire/Cosa evitare"), i finti chip
  ("Italia/Lento/Coppia") e i 4 chip `PREVIEW_PLACES` (nessuno dei 4 posti
  nominati — Procida, Maremma, Val d'Orcia, Cilento — è tra i 10 posti reali
  della guida: errore fattuale, non solo di posizionamento). Un solo CTA
  reale "Ricevi la prima guida" verso `/guida-in-regalo`.
- **`ExitIntentPopup.tsx` gated al 100%**: rimosso il download PDF diretto
  ungated e il divisore "oppure" — resta solo il form. **Bug critico
  corretto**: `source` era `"exit_intent_popup"`, stringa che non contiene
  `lead_magnet` → `Newsletter.tsx:151` (`unlocksLeadMagnet`) non scattava mai:
  il popup raccoglieva email senza mai sbloccare/instradare alla guida. Ora
  `source="lead_magnet_exit_popup"`. Anche: rimosso il `backdrop-blur-md`
  della card (resta solo lo scrim esterno `backdrop-blur-sm` — niente
  glassmorphism sulla card), sostituita l'icona `Gift` con una thumbnail
  `LeadMagnetCover`, corretto il Title Case dell'H2 ("10 Posti Italiani
  Insoliti" → titolo lockato in sentence case), eyebrow in sentence case.
- **`Newsletter.tsx`**: aggiunto un ramo di successo specifico per
  `unlocksLeadMagnet` ("Ci sei." + "Apri la guida →" verso `/lead-magnet`)
  al posto del generico "scarica subito il PDF", per rispettare la copy
  lockata del popup. Verificato via grep che oggi questo ramo è raggiungibile
  **solo** da `lead_magnet_exit_popup` (nessun altro degli 8 chiamanti di
  `<Newsletter source=...>` contiene `lead_magnet`) — modifica additiva, non
  breaking. Rimosso anche `onSuccess={close}` dal popup: il pannello di
  successo ora resta visibile invece di chiudersi da solo dopo 1.2s, prima
  ancora che si possa cliccare il link.
- **`VieniConNoi.tsx` riscritta**: eyebrow/H1/subhead/value point/stato di
  successo secondo la copy lockata; floor del clamp H1 abbassato a
  `2.75rem`; ordine mobile eyebrow → H1 → subhead → cover → form → riga
  trust (CSS Grid con `lg:col-start`/`row-start`/`row-span` espliciti,
  nessun riordino via JS); `hero-amalfi.webp` e il suo scrim rimossi del
  tutto (la pagina ora ha **zero** immagini `priority`/raster — vedi
  Deviazione 2); il glow/blur dietro la cover sostituito da un foglio
  sfalsato ("doppia pagina", `--color-atlante-carta-deep`, rotazione
  opposta); aggiunta riga trust con `BRAND_CREDENTIALS`/`BRAND_STATS` +
  icona `BadgeCheck`; value point passati a icona-sopra-label con più
  padding verticale; le 3 parole-teaser ("fuori stagione · senza folla ·
  fuori rotta") disaccoppiate dalla griglia dei 10 marcatori in una riga
  centrata a parte (risolve il rischio overflow mobile); stato di successo
  con thumbnail cover + bottone reale terracotta "Apri la guida", verde
  riservato solo alla piccola label/check "Iscrizione confermata";
  `useReducedMotion` da `motion/react` su tutte le transizioni
  `initial`/`exit`.
- **Token analytics resi evergreen** (per istruzione esplicita del task —
  vedi Deviazione 3 nel dettaglio sotto): `source` →
  `lead_magnet_landing_${utmSource}`, `utm_campaign` default → `lead_magnet`,
  `cta_id` → `lead_magnet_landing_form`, `content_id` → `lead_magnet_guida`
  (stesso `content_id` riusato nel tracking download di `/lead-magnet`, per
  coerenza di funnel). Nessuna di queste stringhe contiene slug o titolo:
  un futuro rename non forka più la metrica di conversione.
- **OG image**: esteso `scripts/generate-og-images.mjs` — rinominata l'entry
  `vieni-con-noi` in `guida-in-regalo` (nuovo titolo/categoria/location),
  aggiornata l'entry `lead-magnet` allo stesso titolo+descrittore lockati, e
  corretto un bug pre-esistente reale: lo script produceva solo `.webp`,
  mentre ogni pagina (`<SEO image=...>`, incluso `default.jpg`) referenzia
  `.jpg` — quei `.jpg` erano artefatti stantii di un passaggio manuale
  separato. Lo script ora emette sia `.webp` sia `.jpg` per ogni entry.
  Eseguito `npm run generate:og`: `guida-in-regalo.jpg` 37.6 KB, `.webp`
  21.3 KB (ben sotto il budget di 300 KB). Rimossi gli stantii
  `public/og/vieni-con-noi.{jpg,webp}`.
- **File inventario aggiornati**: `src/App.tsx`, `src/components/Layout.tsx`,
  `src/components/Navbar.tsx` (2 target CTA, label invariata),
  `src/components/home/curated/CleanCuratedHero.tsx`,
  `src/components/home/diario/DiarioHeroCinematic.tsx`,
  `src/config/site.ts` (`BIO_LINKS`), `src/config/surfaces.ts`,
  `src/experience/sentiero/sentieroData.ts`, `.gitignore` (pattern
  cosmetico).
- **Docs aggiornati**: nuova voce datata in
  `docs/10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT.md`.
- Nessuna modifica backend: `server.ts`/endpoint invariati (vedi però la
  dipendenza aperta su `ALL_STATIC_APP_ROUTES` sotto).

## Deviazioni dal piano (segnalate, non decise in silenzio)

1. **Cover: solo descrittore, niente titolo — risolve una contraddizione
   interna.** La tabella Deliverable B di seo e il D2/A2 di asset-curator
   dicono entrambi che la cover deve tenere il TITOLO (ricolorato, per il
   resto "invariato"). Ma il riepilogo del task stesso, punto (a), diceva
   esplicitamente "la cover mostra il descrittore non il titolo" (eliminare
   la duplicazione titolo tra H1 e cover). Ho seguito l'istruzione esplicita
   del task sopra la riga di tabella degli handoff, perché: (i) il task
   stesso dice che il suo riepilogo è "solo l'indice, verifica i dettagli
   esatti negli handoff" — vale dove i due concordano, qui invece sono in
   contraddizione diretta; (ii) le note di asset-curator riconoscono che la
   scelta layout "niente titolo duplicato" spetta a ui/frontend, non a loro;
   (iii) rende la cover indipendente dal titolo, quindi non richiederà un
   cambio codice quando il titolo di una guida futura ruota (modello seo
   stesso: "titolo ruota, slug+descrittore persistono"). `LeadMagnetCover`
   ora renderizza wordmark + descrittore + timbro "01" — niente stringa
   titolo. **Segnalo per consapevolezza owner/seo/ui**: è una risoluzione
   ragionata di una contraddizione reale, non un cambio di copy unilaterale.
2. **Hero background rimosso del tutto, non solo `hero-amalfi.webp`.**
   Seguendo D5/A4 alla lettera, la pagina ora ha zero immagini raster
   `priority` (la cover è puro CSS/HTML — classe texture + testo, nessun
   `<img>`). Questo supera il checklist di asset-curator "un solo elemento
   priority/fetchpriority=high nella pagina (la cover)" — ora sono **zero**,
   strettamente meglio per l'LCP (nessuna immagine bloccante; l'H1 testuale
   è il candidato LCP più probabile). La guida A6 su `alt=""` non si applica
   perché non c'è nessun `<img>` a cui attaccarla.
3. **OG description**: `SEO.tsx` ha un'unica prop `description` che
   alimenta `<meta name="description">`, `og:description` e
   `twitter:description` — non esiste un campo OG separato. Ho usato il
   valore "meta description" da 148 caratteri (non quello OG-specifico da
   112), perché è il deliverable nominato per primo e si visualizza comunque
   per intero nelle anteprime IG/WhatsApp/Telegram.
4. **OG image lasciata a `.jpg`, non spostata a `.webp`.** Il testo del task
   offriva `.webp` come esempio della via "meno modifiche allo script", ma
   `SEO.tsx` ha una ragione esplicita già documentata per `.jpg`
   ("WhatsApp/LinkedIn renderizzano WebP in modo inaffidabile") — questa è
   una landing da bio-link, condivisa sproporzionatamente via WhatsApp/DM
   IG, quindi rompere quella compatibilità sarebbe il tradeoff sbagliato.
   Corretto invece lo script perché emetta `.jpg` per ogni entry (cambio
   piccolo e uniforme, risolve lo stesso gap anche per
   `default.jpg`/`lead-magnet.jpg`).
5. **Char count del meta title**: il target seo era 47 caratteri assumendo
   un suffisso "| Travellini"; `SEO.tsx` in realtà appende sempre "|
   Travelliniwithus" (non la forma corta) a ogni titolo che non contiene già
   il nome del sito — è la convenzione già in uso su ogni altra pagina (non
   ho toccato `SEO.tsx`). Ho lasciato il titolo lockato nudo come prop
   `title`, coerente con come la pagina funzionava già prima del rework.
   Segnalo solo come gap di assunzione sui caratteri pre-esistente
   sitewide, non introdotto qui.
6. **`Newsletter.tsx` ha ricevuto un cambio piccolo e additivo** (il ramo di
   successo per `unlocksLeadMagnet`) invece di una nuova API a props di
   override, per centrare la copy lockata del popup senza costruire
   un'API generica che oggi serve a un solo chiamante.

## Verifiche eseguite in questa sessione

- `npm run typecheck`: **PASS**, zero errori.
- `npm run audit:ui`: 0 errori, 451 warning totali — ho grepp­ato l'output
  completo per ogni file toccato in questa sessione (`VieniConNoi`,
  `HomeLeadMagnet`, `ExitIntentPopup`, `Newsletter`, `LeadMagnetCover`,
  `LeadMagnet`, `atlante.css`, `email.ts`, `CleanCuratedHero`,
  `DiarioHeroCinematic`, `Navbar`, `Layout`): **zero riscontri**. Tutti i
  451 warning sono pre-esistenti, su file non toccati da questo rework
  (`AdminMetricsOverview.tsx`, `AiAssistant.tsx`, `PostoStamp.tsx`, ecc.).
- **Dipendenza `server.ts` ancora aperta** (autorizzata dall'owner, in
  esecuzione da `travellini-backend-engineer` in parallelo — non l'ho
  toccato). Verificato via curl sul dev server locale in ascolto sulla
  porta 3000: `/guida-in-regalo` → **404**, `/italia-nascosta` → **404**
  (entrambe correttamente assenti da `ALL_STATIC_APP_ROUTES`/
  `STATIC_APP_ROUTES` al momento di questa sessione), `/vieni-con-noi` →
  200, `/iscrivi` → 200, `/lead-magnet` → 200. È esattamente il soft-404
  descritto nel Deliverable E-15 di seo — **non una regressione di questa
  sessione**, ma significa che il nuovo slug bio-link risponde 404 finché
  quell'aggiunta lato server non arriva. Ri-verificare dopo il merge di
  backend-engineer.
- Nessuna verifica browser reale eseguita in questa sessione (nessun tool
  Playwright/chrome-devtools disponibile in questo contesto agente):
  verifica statica (typecheck, audit:ui, grep, smoke check HTTP) è quanto
  ho potuto fare. Il pass `browser-auditor` sotto resta necessario,
  specialmente per: il riordino CSS-grid mobile in `VieniConNoi.tsx`
  (basato su col/row-start, non JS), l'aspirazione "tutto nel primo
  viewport" su telefoni piccoli (375×667), e la resa dell'effetto "doppia
  pagina" sfalsata dietro la cover.

## What the receivers should produce

**quality-auditor (statico):**

- `npm run typecheck` 0 errori; `npm run audit:ui` senza nuovi errori. ✅ Già
  verificato in questa sessione (vedi sopra) — ri-confermare dopo eventuali
  ulteriori cambi.
- Un solo H1, copy italiana, CTA specifica, CSS vars, nessun `any` nuovo.

**browser-auditor (browser reale):**

- Viewport 375/768/1280/1440: un H1, zero overflow orizzontale, zero errori console, immagini non rotte.
- Redirect: `/italia-nascosta`, `/vieni-con-noi`, `/iscrivi` atterrano sulla nuova landing (no catena multipla) — **nota**: fino a quando `server.ts` non include `/guida-in-regalo`/`/italia-nascosta` in `ALL_STATIC_APP_ROUTES`, un hard-load su quei path risponde 404 di stato pur servendo comunque l'app (soft-404); verificare in un browser reale se il redirect client-side scatta comunque dopo l'hydration.
- Roundtrip funnel: submit → success state → `/lead-magnet` → download PDF 200.
- Popup exit-intent: submit → success "Ci sei. Apri la guida →" resta visibile e cliccabile (non si auto-chiude più a 1.2s).
- Misura LCP mobile 4G. Se LCP > 2.5s → escala a `travellini-perf-engineer` (l'aspettativa è che sia più basso di prima: zero immagini priority sulla pagina, solo testo + texture CSS).

**security-auditor (light, backend non toccato):**

- Nessun segreto/PII esposto lato client; honeypot (`website`) intatto; fallback `leadFallback` non logga dati sensibili; nessun `VITE_*_SECRET` nel bundle. Se il perimetro è invariato, basta un PASS conciso.

## Out of scope

- Ridiscutere slug/copy/design (lockati dagli handoff).
- Modifiche a `server.ts`, `firestore.rules`, `src/config/admin.ts` (se
  serve, → backend-engineer + owner).
- `src/pdf/LeadMagnetDocument.tsx` e il PDF stesso (prossimo rigen).
- `src/components/home/diario/DiarioConversionSection.tsx` (wip, non live).
- Attivazione chiavi Resend/Brevo (decisione owner/env).

## Open questions / decisioni per l'owner

- **Deviazione 1** (cover mostra solo il descrittore, non il titolo): per
  favore confermare che questa lettura è corretta — risolve una
  contraddizione reale tra il riepilogo del task e due handoff a monte,
  non è un'istruzione pulita e univoca.
- **Cutover analytics**: l'handoff seo elencava questo come "coordinare con
  `travellini-data-analyst` prima del cambio"; l'istruzione diretta del task
  mi ha detto di implementare subito il token evergreen e documentarlo (fatto
  sopra). Segnalo perché `travellini-growth-revenue-operator`/
  `travellini-data-analyst` sappiano che la forma del token è cambiata in
  questa sessione (`italia_nascosta_*` → `lead_magnet_landing_*`) se stanno
  tracciando valori storici di `source` in GA4/Firestore.
- Tutto il resto lasciato aperto dagli handoff a monte (stato chiavi
  Resend/Brevo, "esiste una foto reale R+B per una futura cover Route A")
  resta aperto esattamente come lasciato da quegli agent — non ridiscusso qui.

## Stop condition

Gate verde su tutti e tre + roundtrip funnel ok + redirect ok (una volta
atterrato il cambio server.ts) → si propone commit all'owner. L'attivazione
email delivery (Resend/Brevo) resta blocco owner separato e non ferma il
merge del rework front-end.

## Next hand-off

- Next agent: nessuno oltre al gate — revisione finale con l'owner
  (approvazione slug + commit). In parallelo, confermare con
  `travellini-backend-engineer` che `ALL_STATIC_APP_ROUTES` include ora
  `/guida-in-regalo` prima di considerare il bio-link pronto alla
  pubblicazione.

## Notes

- **Trovato, non corretto (pre-esistente, fuori scope)**:
  `src/components/Navbar.test.tsx:55` asserisce
  `getAllByText(/Vieni con noi/i).length > 0`, ma il testo live della CTA
  Navbar è "La guida in regalo" già dalla semplificazione nav del
  2026-07-23 (prima di questa sessione) — questa asserzione era già
  stantia/probabilmente fallente prima che iniziassi, non legata a questo
  rework. Vale un piccolo ticket di fix per chi tocca prossimamente
  `Navbar.test.tsx`.
- **Trovato, non corretto (pre-esistente, fuori scope)**:
  `src/components/home/HomeLeadMagnet.tsx` non risulta montato da nessuna
  parte nella home live (`AtlanteHome` → `CinematicHomepage`, che non lo
  importa). Ho comunque consolidato copy/struttura secondo il brief del
  task (è chiaramente pensato per essere live da qualche parte, ed è a
  costo zero tenerlo corretto visto che ci si lavorava già) — segnalo nel
  caso growth/ui intendessero fosse agganciato alla home e non lo sia.
- Promemoria rispettato: nessuna imagery AI "R&B" introdotta; la nuova cover
  è texture di carta + tipografia, nessuna persona, nessun posto finto.
