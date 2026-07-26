---
title: HANDOFF_lead-magnet-rework_seo_to_ui
status: consumed
created: 2026-07-23
updated: 2026-07-23
from: travellini-seo-conversion-strategist
to: travellini-ui-designer
slug: lead-magnet-rework
expires: 2026-08-06
type: handoff
area: delivery
---

# Handoff: slug + nome guida + copy + meta + redirect + microcopy popup (poi direzione visiva)

## Why this work matters

La landing lead magnet è la conversione owned primaria (bio-link IG/TikTok,
pubblico warm, mobile-first). Va portata a uno standard premium e resa **coerente
su un solo descrittore guida** (oggi frammentato in 5 varianti) e su **un solo URL
evergreen**. Slug e naming sono ora **decisi e lockati dall'owner** (vedi sotto):
non sono più shortlist, non ri-proporre alternative. Tu ci costruisci sopra la
direzione visiva.

## Owner decisions — FINAL (2026-07-23)

Tre lock dall'owner, dopo le proposte seo:

1. **Slug**: `/guida-in-regalo` (l'owner ha ripreso testualmente la CTA navbar già
   esistente "La guida in regalo"). Verificato: nessuna collisione route in
   `App.tsx`, 15 char + slash, minuscolo/trattini/no accenti, evergreen (non
   nomina "Italia"). **Non** è uno dei 3 candidati seo — è la scelta owner e va usata.
2. **Naming disaccoppiato** (titolo evocativo invariato + descrittore unico nuovo):
   - **TITOLO** (H1, invariato): `Alla scoperta dell'Italia nascosta`
   - **DESCRITTORE** (unico, nuovo, sostituisce TUTTE le varianti): `10 posti provati e consigliati da noi`
3. **PDF esclusivamente email-gated ovunque**: il varco ungated in
   `ExitIntentPopup.tsx` (download PDF diretto senza email) **si chiude**. Il popup
   usa solo il form newsletter, con titolo+descrittore finali (Deliverable F). Stesso
   principio per `DiarioConversionSection.tsx` (home diario/cinematic wip).

Nessun blocco tecnico su slug o naming. Note non bloccanti in fondo (§ Notes).

---

## Deliverable A — Slug FINALE: `/guida-in-regalo`

- Path: `guida-in-regalo` (15 char, 16 con lo slash). Igiene ok: minuscolo,
  trattini, no underscore, no accenti, no parametri.
- Evergreen/worldwide: non nomina "Italia" → può ospitare guide future di altri
  paesi senza rinominare il bio-link.
- **Coerenza bonus**: coincide _verbatim_ con la CTA navbar già live
  ("La guida in regalo", `Navbar.tsx:502` e `:836`) → la label navbar **resta
  invariata** (non serve più cambiarla; annulla la mia precedente proposta "La prima
  guida").
- `noindex` → lo slug non compete su Google: conta solo memorabilità /
  condivisibilità / pulizia redirect. Nessuna obiezione tecnica: si procede.

---

## Deliverable B — Naming FINALE (titolo + descrittore) e propagazione

Titolo e descrittore sono **disaccoppiati dallo slug** (opzione che avevo indicato
valida). Il **descrittore unico** sostituisce le 5 varianti oggi in giro:
"10 posti italiani non ovvi", "10 posti italiani da salvare", "10 luoghi italiani da
salvare", "10 Posti Italiani Insoliti", "10 destinazioni particolari…".

- **TITOLO** (evocativo, invariato): `Alla scoperta dell'Italia nascosta`
- **DESCRITTORE** (unico, nuovo): `10 posti provati e consigliati da noi`

> Nota evergreen: la geo ("Italia nascosta") vive nel **titolo**, che è specifico
> della guida #1 e **ruoterà** quando la guida in evidenza cambia (guida #2, altro
> paese). Lo **slug** e il **pattern descrittore** ("10 posti provati e consigliati
> da noi") restano evergreen e non cambiano. Modello: titolo ruota, slug+descrittore
> persistono.

### Tabella di propagazione (8+ touchpoint — per il brief frontend)

| Superficie             | File:riga                     | Attuale                                                             | → Finale                                                  |
| ---------------------- | ----------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------- |
| Landing H1             | `VieniConNoi.tsx:141`         | "Alla scoperta dell'Italia nascosta"                                | **TITOLO** (invariato)                                    |
| Landing subhead        | `VieniConNoi.tsx:145`         | "10 destinazioni particolari, scelte e provate da Rodrigo e Betta." | **DESCRITTORE** + riga meccanica (Deliverable C)          |
| Landing cover — titolo | `VieniConNoi.tsx:184-185`     | "Alla scoperta dell'Italia nascosta"                                | **TITOLO** (invariato)                                    |
| Landing cover — sub    | `VieniConNoi.tsx:186-188`     | "10 destinazioni particolari scelte da Travelliniwithus."           | **DESCRITTORE**                                           |
| Landing cover — alt    | `VieniConNoi.tsx:168`         | "Copertina della guida Alla scoperta dell'Italia nascosta"          | invariato (già corretto)                                  |
| Download page — ref    | `LeadMagnet.tsx:60`           | "10 posti italiani non ovvi"                                        | **DESCRITTORE** (+ TITOLO nel sottotitolo, Deliverable C) |
| Home teaser — cover    | `HomeLeadMagnet.tsx:96-97`    | "10 posti italiani da salvare."                                     | **DESCRITTORE**                                           |
| Home teaser — sub      | `HomeLeadMagnet.tsx:37`       | "…10 luoghi italiani da salvare"                                    | **DESCRITTORE**                                           |
| Popup exit-intent      | `ExitIntentPopup.tsx:156-157` | "10 Posti Italiani Insoliti"                                        | **TITOLO** (H2) + **DESCRITTORE** (riga sotto)            |
| Metadati/cover PDF     | `LeadMagnetDocument.tsx`      | "10 posti italiani non ovvi"                                        | **TITOLO + DESCRITTORE** (al prossimo rigen. PDF)         |

> Il **filename statico** `public/lead-magnet-posti-italiani.pdf` può restare (opaco
> all'utente). Solo il **titolo mostrato dentro** il PDF va allineato al prossimo
> rigen (asset-curator) — non blocca la copy.

---

## Deliverable C — Copy della landing `/guida-in-regalo`

Italiano, specifico, warm, "a voi due", zero verbi banditi (unica eccezione: il
titolo "Alla scoperta di…" — **lock owner**, vedi § Notes; non correggerlo).
Stringhe sollevabili verbatim dal frontend.

**Eyebrow (kicker):** `La prima guida di Rodrigo & Betta`

**H1 (= TITOLO lockato):** `Alla scoperta dell'Italia nascosta`

**Sottotitolo (2 righe):**

- riga 1 (descrittore + differenziazione): `10 posti provati e consigliati da noi — non un algoritmo, non una classifica.`
- riga 2 (meccanica email + first access): `La ricevi lasciando la tua email. Da lì in poi sei nella lista: i prossimi te li mandiamo prima.`

**Value points (tris di icone — label; icone finali le scegli tu):**

1. `Provati e consigliati da noi, sul campo` _(Compass — persone reali)_
2. `Quando andare, che ritmo, cosa evitare` _(Map — pratico, decidibile)_
3. `Una lista corta, solo per chi è iscritto` _(Sparkles — corta + esclusività)_

> Rimosso il value point "La prima guida è gratuita": guidare col "gratis" svaluta
> un brand premium; la leva ora è curatela + esclusività (il gate email è reale al 100%).

**Fascia "nessuno spoiler"** (`VieniConNoi.tsx:196-230`, mantiene la meccanica):

- eyebrow: `Dieci posti. Nessuno spoiler.`
- parole-teaser italic (niente nomi di luogo, per non bruciare la guida ora esclusiva):
  `fuori stagione` · `senza folla` · `fuori rotta`

**Form — CTA (bottone):** `Ricevi la prima guida`
_(alt mobile stretto: `Ricevi la guida`)_
**Placeholder email:** `La tua email` (invariato)
**Micro sotto il form:** `Con l'email entri nella lista di Travellini. Esci quando vuoi.`

**Reassurance privacy** (`VieniConNoi.tsx:250-256`):
`Solo posti nuovi e consigli che vale la pena salvare — niente spam. Esci quando vuoi.` + link `Privacy` → `/privacy`

**Stato success** (`VieniConNoi.tsx:369-378`) — NON promette la welcome email come
garantita (chiavi Resend/Brevo non confermate in prod; il download da `/lead-magnet`
è l'azione che funziona davvero):

- H2: `Ci sei. La guida è tua.`
- body: `Aprila subito qui sotto — è pronta. Ti scriviamo noi quando esce il prossimo posto.`
- link: `Apri la guida →` → `/lead-magnet`

### Copy correlata — pagina download `/lead-magnet` (`LeadMagnet.tsx`)

- H1 (`:55-57`): `La tua guida è pronta.`
- Sottotitolo (`:59-62`): `Alla scoperta dell'Italia nascosta: 10 posti provati e consigliati da noi, dopo 8 anni di viaggi. Posti veri, non liste su Pinterest.` _(8 anni = `BRAND_STATS.yearsOfTravel`, reale)_
- Riga email (`:83-90`) — **rimuovere la promessa di consegna garantita via email**:
  `Se hai lasciato l'email, ti scriviamo noi quando esce il prossimo posto. Per qualsiasi cosa: info@travelliniwithus.it.`
  _(elimina "La guida arriva anche via email entro qualche minuto", falsa a chiavi spente)_

### Copy correlata — teaser home (Opzione A: teaser-only, no form inline)

Il teaser home diventa **una sola CTA verso la landing** (niente `<Newsletter>`
inline — consolidamento lockato da growth). Copy:

- eyebrow: `La prima guida`
- H2: `Una lista corta per il prossimo posto giusto.` _(invariata, on-brand)_
- sub: `10 posti provati e consigliati da noi. La ricevi lasciando l'email.`
- CTA singola: `Ricevi la prima guida →` → `/guida-in-regalo`
- cover mockup: aggiornare al **descrittore** (tabella B).
- **Raccomandazione:** togliere dal teaser i nomi di luogo reali (oggi "Procida
  fuori stagione", "Maremma termale"… `HomeLeadMagnet.tsx:6-11`): rivelare 4/10 posti
  gratis indebolisce l'esclusività ora che la guida è gated. Usare parole-teaser
  astratte o categorie.

---

## Deliverable D — Meta / canonical / OG (route `/guida-in-regalo`)

Pagina `noindex`, ma title/description/OG contano per la condivisione. Componente
`<SEO>` invariato (props `title`, `description`, `canonical`, `image`, `noindex`).

- **Meta title** (47 char): `Alla scoperta dell'Italia nascosta | Travellini`
- **Meta description** (148 char): `Alla scoperta dell'Italia nascosta: 10 posti provati e consigliati da Rodrigo & Betta. La ricevi lasciando l'email; i prossimi te li mandiamo prima.`
- **Canonical**: `https://travelliniwithus.it/guida-in-regalo` (self)
- **OG title**: `Alla scoperta dell'Italia nascosta`
- **OG description** (112 char): `10 posti provati e consigliati da Rodrigo & Betta. La ricevi lasciando l'email; i prossimi te li mandiamo prima.`
- **OG image**: `${SITE_URL}/og/guida-in-regalo.jpg` — 1200×630, JPG. Rinominare da
  `/og/vieni-con-noi.jpg` (design card = asset-curator/ui; io fisso path+dimensioni).
- **Twitter card**: `summary_large_image` (verificare che `SEO.tsx` lo emetta; altrimenti flag a frontend).
- **`og:locale`**: `it_IT`; **`og:type`**: `website`.

Igiene tecnica (nessun cambio, solo verificare):

- Resta `noindex`; **non** aggiungere lo slug a `robots.txt` Disallow (il Disallow
  impedirebbe al crawler di _vedere_ il noindex).
- **Non** aggiungere lo slug a `public/sitemap.xml` né a `STATIC_ROUTE_META` in `server.ts` (rotte noindex ne restano fuori — corretto).
- `lang="it"` già a root; nessun hreflang (non esistono versioni EN).

---

## Deliverable E — Redirect map completa

**Nessun URL storico si rompe, nessuna catena doppia.** Nuovo slug = `/guida-in-regalo`.

### Tabella redirect (client-side `<Navigate replace>` in `src/App.tsx`)

| Source             | Oggi                 | Dopo                             | Tipo                 | Hop |
| ------------------ | -------------------- | -------------------------------- | -------------------- | --- |
| `/guida-in-regalo` | —                    | rende `VieniConNoi`              | `<Route>`            | —   |
| `/italia-nascosta` | rende la pagina      | → `/guida-in-regalo`             | `<Navigate replace>` | 1   |
| `/vieni-con-noi`   | → `/italia-nascosta` | → `/guida-in-regalo` **diretto** | `<Navigate replace>` | 1   |
| `/iscrivi`         | → `/italia-nascosta` | → `/guida-in-regalo` **diretto** | `<Navigate replace>` | 1   |

⚠️ **Anti-catena:** oggi `/vieni-con-noi` e `/iscrivi` puntano a `/italia-nascosta`.
Vanno **ripuntati direttamente a `/guida-in-regalo`** (altrimenti catena doppia).
Preserva `?from=lead-magnet` (usato da `LeadMagnet.tsx:31`).

### Inventario file da aggiornare (per il brief frontend)

**Codice client — rinomina a `/guida-in-regalo` (frontend-builder):**

1. `src/App.tsx:112` — dichiarazione route `italia-nascosta` → `guida-in-regalo`.
2. `src/App.tsx:99` — redirect `/vieni-con-noi` → ripunta a `/guida-in-regalo`.
3. `src/App.tsx:100` — redirect `/iscrivi` → ripunta a `/guida-in-regalo`.
4. `src/App.tsx` — **aggiungere** route redirect `/italia-nascosta` → `/guida-in-regalo`.
5. `src/pages/VieniConNoi.tsx` — canonical (`:116`), OG image (`:117`), meta
   title/description (`:114-115`), `route` tracking (`:97`), id/htmlFor form
   (`:297,306,335,339`) coerenti al nuovo slug; + copy Deliverable C.
6. `src/pages/LeadMagnet.tsx:31` — `Navigate to "/italia-nascosta?from=lead-magnet"` → `/guida-in-regalo?from=lead-magnet`; + copy Deliverable C.
7. `src/components/Layout.tsx:31` — `isGuideLanding = pathname === '/italia-nascosta'` → `'/guida-in-regalo'`.
8. `src/components/Navbar.tsx:502` e `:836` — target CTA "La guida in regalo" → `/guida-in-regalo` (label testo **invariata**, coincide con lo slug).
9. `src/components/home/HomeLeadMagnet.tsx:65` — link → `/guida-in-regalo` + copy teaser.
10. `src/components/home/curated/CleanCuratedHero.tsx:55` — hero CTA → `/guida-in-regalo`.
11. `src/components/home/diario/DiarioHeroCinematic.tsx:59` — hero CTA → `/guida-in-regalo`.
12. `src/config/site.ts:21-22` — `BIO_LINKS.instagram/.tiktok` → `/guida-in-regalo?utm...`.
13. `src/config/surfaces.ts:57` — `{ path: '/italia-nascosta', ... }` → `'/guida-in-regalo'`.
14. `src/experience/sentiero/sentieroData.ts:123` — `route: '/italia-nascosta'` → `'/guida-in-regalo'`.

**HIGH-RISK — `server.ts` (SOLO `travellini-backend-engineer`; owner HA AUTORIZZATO il fix):** 15. `server.ts:258` `ALL_STATIC_APP_ROUTES` — **aggiungere `/guida-in-regalo`.**
Finding: `resolveAppStatus()` (`server.ts:582`) ritorna 404 per ogni path non
presente nel Set. Oggi `/italia-nascosta` **non c'è** → soft-404 su hard load. Il
nuovo bio-link **deve** entrare nel Set per rispondere **200**. Vale anche per i
redirect (la source deve servire la SPA 200 perché il `<Navigate>` scatti su hard
load): valutare di aggiungere anche `/italia-nascosta`. `/vieni-con-noi` e
`/iscrivi` sono già nel Set. **Owner ha autorizzato**; esecuzione a backend-engineer
nello step implementazione — qui è solo inventariato, come richiesto. 16. `server.ts:2012` (sitemap runtime) — contiene `/vieni-con-noi` benché noindex
(incoerenza pre-esistente). **Non** aggiungere `/guida-in-regalo`. Opzionale
(igiene, non bloccante): rimuovere `/vieni-con-noi` dalla sitemap runtime.

**Non-codice (non bloccante):** 17. `scripts/generate-og-images.mjs:97` — slug `'vieni-con-noi'` → `'guida-in-regalo'` (genera `/og/guida-in-regalo.jpg`). (asset/frontend) 18. `.gitignore:156` `vieni-con-noi-*.png` → pattern `guida-in-regalo-*.png` (cosmetico). 19. `public/robots.txt:5`, `public/llms.txt`, `public/llms-full.txt:90` — citano `/iscrivi`: nessun cambio funzionale richiesto. 20. Docs vari citano `/vieni-con-noi` e `/italia-nascosta`: aggiornabili in sweep separato, non bloccanti.

---

## Deliverable F — Microcopy popup exit-intent (ora gated)

`ExitIntentPopup.tsx` perde il download ungated. **Una sola azione: il form.**
Frontend rimuove il bottone "Scarica la Guida Gratis (PDF)" (`:166-178`) e il
divisore "oppure" (`:181-188`); resta solo `<Newsletter>` + dismiss. Microcopy:

- eyebrow (`:150-152`): `Prima di uscire` _(sostituisce "Regalo di addio...")_
- H2 (`:156-157`) = **TITOLO**: `Alla scoperta dell'Italia nascosta`
- descrittore + body (`:159-163`): `10 posti provati e consigliati da noi. La mandiamo solo a chi entra nella lista: lascia l'email e la apri subito.`
- CTA form: `Ricevi la guida`
- success (inline, come la landing): `Ci sei. Apri la guida →` → `/lead-magnet`
- dismiss (`:198-203`): `No grazie, continuo a leggere` (invariato)

**Nota funzionale per frontend (non microcopy):** il `<Newsletter>` del popup usa
`source="exit_intent_popup"`, che **non** contiene `lead_magnet` → per
`Newsletter.tsx:151` **non** sblocca né mostra il link a `/lead-magnet`. Ora che il
popup **è** il gate, la `source` deve contenere `lead_magnet` (es.
`source="lead_magnet_exit_popup"`), così sblocca e instrada alla guida come la
landing e l'attribuzione converge. Senza questo, il popup gated raccoglie email ma
non consegna nulla.

**`DiarioConversionSection.tsx`** (home diario/cinematic, wip): stessa regola —
niente download ungated, stesso titolo+descrittore, una CTA verso `/guida-in-regalo`.
Copy piena quando si consolida (branch non live).

---

## Output contract (SEO) — landing

```
Page: /guida-in-regalo
Search intent: pubblico warm da bio IG/TikTok che vuole "la guida in regalo" di R&B — posti provati, non una classifica
Keyword cluster: guida posti particolari + posti provati + guida coppia + lista curata (NB: noindex, non per ranking ma per coerenza copy/share)
H1: Alla scoperta dell'Italia nascosta
Meta title: Alla scoperta dell'Italia nascosta | Travellini (char: 47)
Meta description: Alla scoperta dell'Italia nascosta: 10 posti provati e consigliati da Rodrigo & Betta. La ricevi lasciando l'email; i prossimi te li mandiamo prima. (char: 148)
Hero headline: Alla scoperta dell'Italia nascosta
Hero subhead: 10 posti provati e consigliati da noi — non un algoritmo, non una classifica. La ricevi lasciando la tua email; i prossimi te li mandiamo prima.
Primary CTA: Ricevi la prima guida → (form, stessa pagina)
Secondary CTA: none (una sola azione per la conversione)
Schema.org: nessuno (noindex; niente structured data che inviti all'indicizzazione)
Internal links to add: nessuno in-page (landing chrome-less, IA-isolata). Post-success → /lead-magnet.
Risks: vedi sezione Rischi
Docs to update: vedi sezione Docs
```

---

## Rischi (SEO + conversione + tecnici)

- **Soft-404 server-side (bloccante per bio-link, ma OWNER-AUTORIZZATO):** il nuovo
  slug DEVE entrare in `ALL_STATIC_APP_ROUTES` (`server.ts`, high-risk →
  backend-engineer). Autorizzato dall'owner; se non eseguito, il bio-link risponde 404. Vedi Deliverable E-15.
- **Continuità analytics:** rinominare i token interni (`source italia_nascosta_*`,
  `utm_campaign` default `italia_nascosta`, `cta_id`/`content_id` `italia_nascosta_*`
  in `VieniConNoi.tsx:39-40,100-101`) **forka la storia della metrica primaria** di
  growth. **Raccomandazione durevole:** disaccoppiare gli identificatori analytics
  sia dallo slug sia dal titolo, con un token **evergreen stabile** (es.
  `source="lead_magnet_landing"`, `content_id="lead_magnet_guida"`,
  `utm_campaign=lead_magnet` — già usato in `BIO_LINKS`), così futuri rename non
  rompono il tracking. → coordinare la data di cutover con `travellini-data-analyst`.
- **Promessa email:** finché Resend/Brevo non confermate in prod, la copy non
  promette consegna email garantita (già corretto in Deliverable C).
- **Esclusività vs teaser home:** nominare posti reali sulla home svaluta la guida
  gated (raccomandata rimozione, Deliverable C).
- **Popup non-consegna:** senza `source` con `lead_magnet`, il popup gated raccoglie email ma non sblocca la guida (Deliverable F).

---

## Cosa deve produrre ora `travellini-ui-designer`

Direzione visiva (decisioni, non codice), ancorata alla copy lockata sopra:

1. Audit layout attuale vs premium bar: gerarchia, prominenza form, above-the-fold
   mobile, trust signal AGCOM/Meta-verified (`BRAND_CREDENTIALS` in `site.ts`) sopra la piega.
2. Layout lockato desktop + mobile: struttura, spaziature, dove cade il form, resa
   della cover e della fascia "nessuno spoiler".
3. Trattamento cover guida: foto reale vs cover craft tipografica (regola
   imagery-truth: niente persone/luoghi finti; craft ammesso, da etichettare). La
   cover mostra **TITOLO + DESCRITTORE** lockati (Deliverable B).
4. Stato success + microinterazioni (`useReducedMotion`); design del nuovo success
   "Ci sei. La guida è tua." con azione primaria = Apri la guida.
5. Direzione visiva del **popup gated** (una sola azione) e coerenza con la landing.
6. A11y: un solo H1, contrasti, tap target ≥44px, focus visibile.

- Dove atterra: `docs/50_Scratch/HANDOFF_lead-magnet-rework_ui_to_asset.md`.

## Out of scope (do NOT touch)

- Copy, slug e naming (lockati dall'owner).
- Selezione/produzione foto e alt text (asset-curator).
- Implementazione (frontend-builder) e `server.ts`/`firestore.rules`/`admin.ts`.
- Rendere la pagina indicizzabile senza mandato owner.

## Open questions / decisions for the user

Slug + naming: **LOCKED** (non più aperti). `server.ts` soft-404 fix: **autorizzato**.
Restano:

1. **Cutover analytics** dei token `source/content_id/utm_campaign`: coordinare con `travellini-data-analyst` (racc. token evergreen stabile) prima del cambio.
2. **Chiavi welcome email** (Resend/Brevo) attive in prod? Se no, la copy resta come qui (nessuna promessa email garantita).

## Next hand-off

- Next agent: `travellini-ui-designer` (poi asset-curator → frontend-builder; il punto E-15 su `server.ts` a `travellini-backend-engineer`).
- Trigger: questo file (slug + naming lockati) → direzione visiva.

## Notes

- **Titolo con verbo "bandito" — lock deliberato, NON correggere.** "Alla scoperta
  di…" è nella lista anti-cliché interna (CLAUDE.md Italian copy rules +
  EDITORIAL_GUIDE). L'owner ha scelto consapevolmente di mantenerlo come titolo
  evocativo. Downstream (editorial/ui/frontend) **non deve "correggerlo"** pensando
  a una svista: è una decisione, non un errore.
- **"regalo" nello slug**: comunica gratuità/dono in un URL permanente, mentre la
  copy vende esclusività — lieve tensione di posizionamento, **non** un problema
  tecnico; scelta owner consapevole (riprende la CTA navbar già live). Nessuna azione.
- Memoria: le foto "R&B" nel repo sono AI, non i creator reali. Non introdurre imagery che finga persone reali.
- Le route noindex restano fuori da sitemap e `STATIC_ROUTE_META`: comportamento corretto.
