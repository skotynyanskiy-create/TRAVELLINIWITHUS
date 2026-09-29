---
title: HANDOFF_webapp-travelliniwithus_seo_to_orchestrator
status: consumed
created: 2026-09-29
from: travellini-seo-conversion-strategist
to: travellini-orchestrator
slug: webapp-travelliniwithus
expires: 2026-10-13
type: handoff
area: delivery
round: R1 (divergenza, indipendente dalle altre uscite R1)
consumes: HANDOFF_webapp-travelliniwithus_orchestrator_to_seo
---

# Handoff: una webapp a schermo unico con URL vere. Architettura SEO/AI-search e lessico dell'interfaccia

## Esito in testa

- **Domanda 1, risposta breve.** Quando Google porta qualcuno su `/posto/<slug>` deve arrivare
  una sola cosa: **una pagina completa che è già l'app**. Stessa URL, stesso `h1`, stesso
  contenuto; cambia solo la veste. Dentro l'app la scheda si apre come foglio sopra la mappa o
  l'elenco e l'URL diventa `/posto/<slug>`. Da un accesso diretto la stessa scheda si apre a
  tutta pagina, con il guscio (barra delle schede) attorno.
- **Il punto chiave per i crawler AI è confermato.** In produzione ogni `/posto/<id>` serve
  la testa giusta (title, description, OG, JSON-LD `Review`), ma il corpo è il preloader
  «Travelliniwithus / Rodrigo & Betta». Un crawler che non esegue JavaScript non vede `h1`,
  testo né link. La cura è scrivere a build il corpo vero e visibile dentro `#root`, nello
  script che già scrive la testa (`scripts/generate-route-html.js`). **Non tocca `server.ts`.**
- **Il precedente `/sentiero` non vale in produzione.** `injectSentieroPrerender` sta in
  `server.ts`, ma in produzione `server.ts` non serve HTML: l'hosting è Firebase statico e
  `firebase.json` rimanda `/sentiero` a `/` con un 301. Il precedente buono è
  `generate-route-html.js`.
- **Raccomandazione.** Opzione A + C1 (guscio con URL vere + corpo statico a build), poi C2
  (stesso HTML generato dai componenti React e idratato). Tutte e quattro le schede dell'app
  stanno su rotte che esistono già (`/`, `/mappa`, `/esplora?vista=video`, `/preferiti`):
  **nessuna modifica a `server.ts`**. Una rotta top-level nuova (per esempio `/video`) resta
  una decisione dell'owner, con il suo costo.
- **Tracce: ipotesi valida, con tre correzioni.**
  1. Nessuna URL propria, ma le tracce devono comparire in HTML leggibile: oggi la mappa sta
     dietro consenso e JavaScript, quindi per i motori non esiste.
  2. I reel girati in un posto che ha già la scheda (86) vanno su quella scheda: non sono
     tracce.
  3. Le etichette generiche («Italia», «Milano»: 369 reel) non diventano né tracce né pin.
- **Zone bianche.** Le sei regioni a zero reel (Basilicata, Friuli Venezia Giulia, Marche,
  Molise, Puglia, Sardegna) vanno in `noindex, follow`, fuori dalla sitemap, con un vuoto
  onesto e una sola azione: «Avvisami se ci andiamo». **Puglia e Sardegna usano oggi una
  copertina `ai-generated` di un luogo reale**: è una violazione della regola sulle immagini
  vere, da togliere a prescindere dalla webapp.
- **Domanda 2, risposta breve.** Ogni etichetta nomina l'oggetto o il numero che chi legge
  può controllare: «I miei posti» al posto di «Preferiti», «Salva», «12 posti in Lombardia»,
  «Qui non ci siamo stati», «Prezzo rilevato · gennaio 2026», «Controllato su <fonte> il
  <data>», «Ci siamo tornati» al posto di «Popolari». Sono 40 righe nella sezione 4.
- **Tre contraddizioni nello strato che i motori leggono per primo.** Vanno sistemate prima
  di qualunque webapp:
  1. La description della home promette «il consiglio onesto se un posto merita il viaggio»,
     mentre `llms.txt` dice «Il registro non contiene voti, punteggi né verdetti».
  2. `llms.txt` usa `www.travelliniwithus.it`, canonical e sitemap usano
     `travelliniwithus.it`.
  3. `dist/index.html` fa da fallback per ogni rotta senza file proprio e porta il canonical
     della home [VERIFY con una build].

## Why this work matters

La webapp ha senso solo se ogni posto resta una pagina che Google e i motori di risposta
leggono, citano e mandano avanti. Il guscio decide come ci si muove; le URL decidono se si
viene trovati. Questo documento fissa la relazione tra le due cose, il lessico
dell'interfaccia e le condizioni sotto cui un fatto della scheda diventa citabile.

## Decisions already made (rispettate, non rimesse in discussione)

- Travelliniwithus diventa una webapp con lo schermo unico al centro.
- `/posto/<slug>` e `/articolo/<slug>` restano URL indicizzabili, un solo `h1` per pagina,
  copy italiano, CTA specifica.
- Regola delle immagini vere (`docs/20_Decisions/DECISION_IMAGERY_TRUTH_RULE_2026-07-22.md`),
  che vale anche per OG e schema.org. Nessun numero social nel codice.
- Correzioni del main thread, applicate:
  - numeri dal fact pack (1.192 reel; 409 luoghi nuovi utilizzabili per coordinata, 297 in
    Italia, 484 reel; 533 è un tetto; sei regioni a zero reel, Puglia inclusa);
  - «Il Timbro» tolto il 15 agosto: non citato in nessuna idea né microcopy;
  - modale AudienceGate spenta dal 17 agosto: nessuna proposta la reintroduce;
  - `server.ts` fuori scope: ne segnalo il costo, non propongo di aggirarlo.

## Scoperte che cambiano la risposta (verificate nel checkout BEST, commit 4fe1794)

1. **Produzione = hosting statico.** `firebase.json:17-49` serve `dist/` e ha un'unica
   rewrite `**` → `/index.html`; l'unica rewrite dinamica è `/api/**` verso una funzione.
   `server.ts:737-748` lo dice esplicitamente: in produzione gira solo come funzione su
   `/api/**` e non restituisce HTML. `server.ts` serve l'HTML in tre casi:
   - `npm run dev`, che è anche il `webServer` di Playwright (`playwright.config.ts:25`);
   - il self-host «opzione C»;
   - non Lighthouse, che gira su `vite preview` (`scripts/lhci-preview.mjs`).

   Conseguenza: una rotta top-level nuova va aggiunta ad `ALL_STATIC_APP_ROUTES`
   (`server.ts:183-222`), altrimenti dev ed e2e rispondono 404. Il costo resta: una riga,
   ma su un file ad alto rischio, quindi backend-engineer più conferma dell'owner.
   [VERIFY code-architect R3: nessun'altra via serve HTML in produzione.]
2. **Il corpo non è prerenderizzato.** È chiuso il [VERIFY] del brief. `renderHtml`
   (`generate-route-html.js:336-343`) sostituisce `<title>` e aggiunge il blocco meta prima
   di `</head>`. Il corpo resta quello di `index.html:273-301`, cioè il preloader.
3. **Il fallback porta il canonical della home** [VERIFY: `grep canonical dist/index.html`
   dopo una build].
   - `outputPathFor('/')` scrive proprio `dist/index.html` (`generate-route-html.js:346`),
     con `<link rel="canonical" href="https://travelliniwithus.it/">`.
   - Quel file è la destinazione della rewrite `**` e del `navigateFallback` del service
     worker (`vite.config.ts:104`).
   - Il commento in `index.html:6-13` dice che la shell non deve avere canonical proprio per
     questo motivo: la build lo annulla.
   - Chi lo riceve: `/preferiti`, le 31 schede segnaposto, i `/destinazione/<slug>` legacy,
     gli articoli assenti dalla sitemap al momento della build e **ogni URL inesistente**.
     Tutti rispondono 200 con la testa della home (soft 404).
4. **`lastmod` è l'ora della build** per tutti i posti e le destinazioni
   (`generate-sitemap.js:312`, `:273`). Un `lastmod` sempre nuovo insegna a Google a
   ignorarlo.
5. **Due host.** `generate-llms-index.mjs:25` usa `https://www.travelliniwithus.it`;
   `src/config/site.ts:1`, sitemap, robots, OG e JSON-LD usano `https://travelliniwithus.it`.
   [VERIFY: quale dei due reindirizza all'altro.]
6. **Contraddizione sul giudizio.**
   - `routeMeta.ts:40`, `AtlanteHome.tsx:13` e `index.html:16` dicono «il consiglio onesto
     se un posto merita il viaggio».
   - `homeComposition.ts:150-156` ha già cambiato la frase in «Il posto te lo descriviamo.
     Se vale il viaggio, lo decidi tu.».
   - `types/content.ts:62-65` fissa il modello: «descrive, non giudica»; `llms.txt:39-40`
     dice lo stesso.

   La meta della home è rimasta indietro.
7. **Zone bianche con immagine generata.**
   - Puglia e Sardegna hanno come copertina `/images/destinations/*.webp`
     (`destinations.ts:74`, `:98`), prefisso che `asset-provenance.json:37-38` classifica
     `ai-generated`.
   - Destinazione.tsx la usa come hero e la passa come `image` al componente SEO (`:304`),
     quindi diventa l'og:image dopo il JavaScript.
   - Le intro dichiarano un'esperienza che il corpus non ha: la Puglia ha 0 reel, ma l'intro
     parla di «masserie della Valle d'Itria».
   - Il vuoto dice «Stiamo aggiungendo i posti particolari di …» (`:444-459`): per sei
     regioni non c'è niente da aggiungere.

   [VERIFY: provenienza delle copertine degli altri nodi senza scheda.]
8. **`h1` e title della scheda posto non contengono il nome del posto in testa.**
   - `h1` = hook (`Posto.tsx:230-232`); title = `hook — title` (`Posto.tsx:182`).
   - Esempio: «Il posto perfetto per un weekend romantico? — Granduca di Campigna |
     Travelliniwithus» fa 85 caratteri e il nome parte al 47°, oltre il taglio della SERP.
   - La ricerca vera su una scheda è il nome del posto.
9. **Il meta di `/destinazione` è falso per 12 regioni.** Dice «tutte le 20 regioni
   italiane… con posti particolari provati sul posto», ma `llms.txt:31` elenca schede in 8
   regioni.
10. **`buildPlaceItemListJsonLd` non esiste nel commit 4fe1794.** Nel checkout c'è solo la
    patch locale del main thread; il commento in `seo.ts:204-205` dice «non esiste in nessun
    ramo». È un prerequisito per qualunque `ItemList` (hub, elenco della mappa, articoli).
11. **Inglese nell'interfaccia pubblica.**
    - `PARTNERSHIP_LABEL.gifted = 'Gifted'` (`types/content.ts:28`);
    - «Budget: Medio» sulla scheda (screenshot 06);
    - categoria «Food & Ristoranti»;
    - manifest «Travel blog di Rodrigo & Betta» (`vite.config.ts:36`), senza `lang`,
      `start_url`, `scope` né `shortcuts` dichiarati [VERIFY: default del plugin; potrebbe
      scrivere `lang: "en"`].
12. **La mappa chiede il consenso marketing.** `Mappa.tsx:86-93` attiva `marketing: true`,
    non un consenso «mappa»: il bottone «Attiva la mappa» attiva anche altro
    [VERIFY: cosa abilita `marketing` oltre alle tessere]. È una questione di copy onesto
    (sezione 5) e di privacy (decisione owner).
13. **Il disclosure non è sempre coerente.** Il fact pack §6 trova che su 86 schede con reel
    il campo `partnership.kind` e le diciture nella caption discordano in 12 casi: 7 schede
    `organic` hanno «Adv»/«Invited» nel testo. `llms-full.txt` pubblica «rapporto
    commerciale: nessun accordo» scheda per scheda: un motore AI ripeterebbe una
    dichiarazione forse sbagliata.

## Context the receiver needs

Letti:
- in BEST: `src/config/routeMeta.ts`, `src/config/surfaces.ts`, `src/lib/seo.ts` (esclusa la
  patch locale), `src/lib/placeReviewSchema.ts`, `scripts/generate-route-html.js`,
  `scripts/generate-sitemap.js` (parti), `server.ts` (righe 120-230, 343-420,
  `injectStaticMeta`, `injectSentieroPrerender`), `firebase.json`, `index.html`,
  `vite.config.ts` (PWA), `lighthouserc.json`, `public/llms.txt`, `public/llms-full.txt`
  (inizio), `public/robots.txt`, `src/pages/Posto.tsx`, `Destinazione.tsx`, `Mappa.tsx`,
  `Preferiti.tsx` (parti), `src/types/content.ts`;
- screenshot 01, 04 e 06;
- il fact pack, sezioni «Esito», «Incongruenze», §1, §3, §5, §6, §7, §8, §9, §10, §12, §14,
  §15.

Fonti di voce: `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`, `docs/EDITORIAL_GUIDE.md`
(nel ramo). Lessico delle caption dal fact pack §9.

---

## 1. Tabella delle architetture

A. **Guscio con URL vere, solo `<head>` a build.** Aprire un posto nell'app scrive
`/posto/<slug>` nella cronologia; l'accesso diretto apre la stessa vista con la scheda a
tutta pagina. È lo stato attuale del prerender.

B. **Pagina piena all'ingresso, guscio dopo.** L'accesso diretto mostra una pagina classica;
la barra delle schede compare alla prima navigazione interna.

C. **Corpo statico a build.**
- C1: lo script scrive dentro `#root` l'HTML semantico e **visibile** della scheda; React lo
  sostituisce al montaggio.
- C2: lo stesso HTML nasce dai componenti React (render su server a build) e viene idratato
  con `hydrateRoot`.

D. **HTML generato a runtime** da una funzione o da un server.

| Criterio | A. Guscio, URL vere, `<head>` a build | B. Pagina piena, guscio dopo | C. Corpo statico a build (C1 / C2) | D. HTML a runtime |
| --- | --- | --- | --- | --- |
| Indicizzabilità e canonical | 79 URL in sitemap, canonical corretto nei file prerenderizzati. Il contenuto entra nell'indice solo dopo il rendering JS di Google | Uguale ad A: la «pagina piena» esiste solo dopo il JavaScript | Contenuto già nella prima risposta; canonical invariato | Come C, più veri 404/410 per slug inesistenti |
| `h1` | Nessuno nell'HTML servito (c'è il preloader). Dopo il JS uno solo, a patto di declassare il titolo dello sfondo quando si apre il foglio | Uno, sempre | Nell'HTML servito, identico a quello di React: serve un test che li confronti | Come C |
| JSON-LD | `Review` a build; `BreadcrumbList` solo dopo il JS | Come A | `Review` + `BreadcrumbList` + `WebPage` con `lastReviewed`, tutto a build | Come C, sempre aggiornato |
| Link `<a href>` crawlabili | Zero nell'HTML servito: la scoperta passa solo dalla sitemap | Come A | Sì: regione, 3 posti vicini, `/mappa?place=<id>`, articoli che citano il posto | Sì |
| Sitemap e `llms.txt` | Invariati; `lastmod` = ora della build (difetto) | Invariati | Corpo, sitemap e `llms-full.txt` letti dallo stesso `content-seed.json`: una sola fonte | Da generare a runtime o a build |
| Condivisione dell'URL | Funziona: la card OG è nella testa prerenderizzata | Funziona | Funziona | Funziona |
| Tasto indietro | Nell'app chiude il foglio e ripristina la vista (stato nell'URL: `/mappa?place=`). Da Google torna a Google. «Torna» dentro l'interfaccia va al genitore, mai `history.back()` fuori dal sito | Coerente, ma alla seconda navigazione la pagina diventa app: il cambio di veste si vede | Indipendente: si combina con A | Indipendente |
| Crawler AI senza JS | Leggono title, description e `Review` (nome, indirizzo, descrizione). Niente prezzo, data, disclosure, link | Come A: B è una scelta lato client | Leggono tutta la scheda | Leggono tutto |
| Tocca `server.ts` | **No**, se le schede dell'app stanno su rotte esistenti. **Sì**, per ogni rotta top-level nuova (`ALL_STATIC_APP_ROUTES`) | **No** | **No**: il posto giusto è `generate-route-html.js` | **Sì** (o funzione nuova + rewrite in `firebase.json`): alto rischio |
| Bundle iniziale | Budget a 776/780 KB: guscio e fogli devono stare in chunk lazy o essere compensati | ~0 | C1: 0 KB di JavaScript; HTML più pesante per pagina [VERIFY peso]. C2: ~0, ma `Posto` deve funzionare anche fuori dal browser | 0 lato client |
| Rischio principale | Due `h1` nel DOM; foglio che rompe il tasto indietro | Nessun beneficio SEO; discontinuità visiva | C1: la versione statica e quella React divergono, o la sostituzione crea salti di layout (CLS ≤ 0,1 è bloccante in CI; `/posto/verona-vigna-benini` è già nella lista LHCI). C2: costo di rifattorizzazione | Tocca il file ad alto rischio e introduce infrastruttura |

**Raccomandazione: A + C1 subito, C2 quando `Posto` è pronto per il render su server.**
- B non aiuta nessun crawler. È una scelta di esperienza, e A la copre meglio: la pagina a
  tutta altezza è già la vista d'ingresso di A.
- C1 va fatto senza `sr-only`, a differenza di `/sentiero`. Il corpo statico è la pagina per
  chi non ha JavaScript: deve essere visibile, stesso HTML per tutti, niente testo nascosto.
- Contenuto minimo del corpo statico:
  - `h1` identico a quello montato da React;
  - cover `real-frame` con dimensioni esplicite (è anche l'LCP);
  - blocco «In breve» (sezione 6);
  - «Prima di andare» e «Cosa sapere prima» con la riga «Dati controllati su <fonte> il
    <data>»;
  - disclosure;
  - 3-5 link `<a href>`.
- D è la sola strada per avere 404 veri senza toccare `firebase.json`, ma costa troppo per
  questo giro.

**Correzioni trasversali (valgono per ogni opzione, nessuna tocca `server.ts`):**
1. **Shell di fallback senza canonical.** Una proposta tra le possibili: `dist/index.html`
   resta la home, e la destinazione della rewrite e del `navigateFallback` diventa un file a
   parte, neutro, senza canonical né `og:url`.
2. **404 veri per i posti in produzione.** Tutti i posti reali hanno un file statico,
   quindi basterebbe che la rewrite catch-all non coprisse `/posto/**`: uno slug inesistente
   cadrebbe su `404.html` con status 404. [Da valutare in R3: `firebase.json` è config di
   deploy, non file ad alto rischio, ma cambia il routing.]
3. **`X-Robots-Tag: noindex`** via `firebase.json` per le rotte private (`/preferiti`,
   `/guida-in-regalo`, `/lead-magnet`, `/manifesto`). Oggi il loro `noindex` arriva solo col
   JavaScript.
4. **`lastmod` vero** in sitemap (sezione 6).
5. **Un solo host** in `llms.txt` e `llms-full.txt`: `SITE_URL`.
6. **`BreadcrumbList` nel prerender**, accanto a `Review`.
7. **Precache del service worker.** Escludere `**/posto/**/index.html` e
   `**/articolo/**/index.html`. Le pagine passano da 79 a centinaia, e il service worker
   serve comunque la shell per quelle URL [VERIFY: default `globPatterns` del plugin, che
   include `html`].

**Crescita da 79 a 409 e oltre.** Non tocca `server.ts` finché le schede vivono in
`content-seed.json`: `REAL_POSTO_IDS` (`server.ts:152-156`) e la sitemap si derivano da lì.
Se le schede migrassero in un indice separato, `server.ts` andrebbe aggiornato: meglio tenere
il registro unico.

### Cosa succede esattamente su `/posto/<slug>`

Oggi, in produzione:
1. Firebase trova `dist/posto/<id>/index.html` prima della rewrite → 200. Testa corretta, JSON-LD
   `Review` e grafo `Organization`/`WebSite`; corpo = preloader.
2. Googlebot mette la pagina in coda per il rendering, esegue il JS e indicizza la versione
   renderizzata: `h1` = hook, testo, link, `BreadcrumbList`.
3. Una persona da Google vede preloader, poi React. Nessuna modale (AudienceGate spenta dal
   17/8). Indietro → Google.
4. Chi torna con il service worker installato riceve `/index.html`, cioè la home, dal
   `navigateFallback`, e React ridisegna la scheda [VERIFY: il precache ha l'HTML del posto,
   ma l'URL senza barra finale non lo trova].
5. GPTBot, ClaudeBot, PerplexityBot e CCBot leggono solo la testa [VERIFY per crawler: studio
   Vercel/MERJ, dicembre 2024]. Gli scraper social leggono la card OG.
6. Slug inesistente → 200 con la testa della home.

Con la raccomandazione:
1. Uguale al punto 1 di oggi, ma il corpo contiene la scheda vera, visibile.
2. React monta il guscio (barra delle schede) attorno alla scheda a tutta pagina. «Torna» porta
   alla regione del posto; indietro del browser → Google.
3. Dentro l'app: tocco su un pin → `pushState('/posto/<id>')`, foglio sopra la mappa, sfondo
   `inert`, title e canonical aggiornati. Indietro → foglio chiuso, mappa com'era
   (`/mappa?place=<id>`).
4. Slug inesistente → 404 vero, se la correzione trasversale 2 passa in R3.

---

## 2. Posti e tracce, zone bianche

### Validazione dell'ipotesi «posto / traccia»

**Valida.** Una traccia non ha URL propria: 409 pagine con un reel e un nome di geotag
sarebbero esattamente le pagine sottili che il brief vieta. Tre correzioni:

| Oggetto (fact pack §15, reel usabili) | Reel | URL | Indicizzazione | Dove vive per i crawler | Nota |
| --- | --- | --- | --- | --- | --- |
| **Posto** (A: reel con scheda) | 77 con coordinate | `/posto/<slug>` | index, sitemap, `llms-full` | corpo statico (C1) | 79 schede visibili |
| **Storia del posto** (B: reel su un posto che ha già la scheda) | 86 | nessuna | parte della scheda | elenco «Altri video girati qui» sulla scheda, con data e link al reel | Non è una traccia: arricchisce una pagina che esiste. Base di «Ci siamo tornati» |
| **Traccia** (C: locale senza scheda) | 484 su 409 coordinate (297 in Italia) | nessuna | nessuna (non esiste come pagina) | elenco di testo nella pagina della regione e nella lista «Mappa senza mappa»; pin distinto sulla mappa | Solo testo: nessuno dei 897 reel candidati fuori registro ha una cover reale su disco (§10) |
| **Etichetta generica** (D: «Italia», «Milano», città) | 369 | nessuna | nessuna | da nessuna parte come luogo | L'etichetta «Italia» cade in Umbria (§7): un pin sarebbe un falso geografico |
| **Senza coordinate / senza luogo** (F, G) | 25 + 149 | nessuna | nessuna | eventualmente nel profilo Instagram | Fuori dall'app |

**Condivisione di una traccia.** Nell'app una traccia apre un mini-foglio. L'URL è
`/mappa?traccia=<id-stabile>`: canonical `/mappa`, niente pagina nuova, indietro funziona.
Il link esterno va al reel su Instagram, la casa canonica della traccia. Niente fragment per
singola traccia; un'ancora di sezione (`#tracce`) va bene.

**Quando una traccia diventa posto.** Soglia di pubblicazione proposta, da confermare
all'owner. Tutte le condizioni insieme:
1. cover `real-frame` certificata per singolo file, non solo per cartella: oggi 13 delle 79
   cover sono `real-frame` solo per prefisso (§10);
2. nome, città e paese verificati fuori dal geotag;
3. descrizione nella voce R+B, almeno 60 parole [soglia proposta];
4. almeno un fatto datato (prezzo con data, oppure `checked`, oppure `toKnow`);
5. `partnership.kind` coerente con la caption (§6).

Sotto soglia resta traccia. Il bacino è 409 luoghi; non è un obiettivo di pubblicazione.

**Affidabilità della regione, da dichiarare sempre.** La regione di una traccia viene dal
reverse geocoding (Nominatim) della coordinata del geotag Instagram. Nel controllo, 10
etichette su 51 che nominano un paese risolvono in un altro paese (19,6%). I nomi di regione
differiscono tra corpus e albero delle destinazioni («Emilia-Romagna» / «Emilia Romagna»,
«Friuli-Venezia Giulia» / «Friuli Venezia Giulia»): serve una normalizzazione. Nell'elenco
tracce, una riga fissa: «Posizione presa dal geotag di Instagram, non ricontrollata.»
Nessun titolo o pagina nasce da una regione di traccia.

### Zone bianche: tre livelli

| Livello | Regioni | Stato proposto | Contenuto |
| --- | --- | --- | --- |
| **0: zero reel** (§7) | Basilicata, Friuli Venezia Giulia, Marche, Molise, Puglia, Sardegna | `noindex, follow`; fuori sitemap; restano raggiungibili dall'elenco regioni con «0 posti» | Via la copertina AI (Puglia, Sardegna; altre [VERIFY]); intro riscritta senza esperienza dichiarata; vuoto onesto + «Avvisami se ci andiamo» (idea 4) |
| **1: reel sì, scheda no** | Liguria, Trentino-Alto Adige, Umbria, Abruzzo, Sicilia, Valle d'Aosta [VERIFY: Trentino ha una scheda segnaposto?] | `noindex, follow` finché non ha almeno 3 schede visibili [soglia proposta] | Quaderno delle tracce (solo etichette locali, riga di affidabilità) |
| **2: almeno una scheda** | Lombardia 21, Toscana 12, Veneto 12, Emilia-Romagna 4, Campania 3, Lazio 3, Piemonte 3, Calabria 1 (`llms.txt`) | index se ha almeno 3 schede; Calabria (1) resta `noindex, follow` fino alla terza | Schede + tracce + `ItemList` (dopo il fix di `buildPlaceItemListJsonLd`) |

Note tecniche:
- oggi `SEO.tsx:109` emette sempre `noindex, nofollow`: serve la variante `noindex, follow`;
- la soglia va calcolata da una sola funzione, usata sia dalla pagina sia da
  `generate-sitemap.js` (stesso schema di `isIndexable`);
- il meta di `/destinazione` va riscritto (sezione 3);
- prima di togliere pagine dall'indice: [VERIFY data-analyst: impressioni Search Console
  delle 12 URL di regione senza scheda].

---

## 3. Superfici proprie dell'app

### Regola «un solo `h1`» dentro un guscio

1. L'`h1` appartiene alla **rotta**, non al guscio. Barra delle schede, intestazione e logo
   non contengono mai un `h1` (il logo è un link).
2. In ogni istante il DOM ha **un** `h1`, quello dell'URL corrente.
   - Foglio aperto (URL `/posto/<slug>`): l'`h1` è nel foglio. Lo sfondo diventa `inert` e il
     suo titolo scende a testo semplice finché il foglio resta aperto.
   - Foglio chiuso: si torna allo stato precedente.
3. Stati alternativi della stessa rotta si escludono: consenso/mappa, elenco/video. Oggi
   `MapConsentPlaceholder` e `FullScreenMapExperience` hanno lo stesso `h1` e non sono mai
   montati insieme: il modello è già giusto.
4. `document.title`, canonical e JSON-LD seguono l'`h1`: aprire un foglio li aggiorna,
   chiuderlo li ripristina.
5. L'`h1` del corpo statico (C1) è identico, carattere per carattere, a quello montato da
   React. Da verificare in un test.

### Home app: `/`

```
Page: /
Search intent: navigazionale sul marchio («travelliniwithus», «rodrigo e betta») e «posti particolari in italia»
Keyword cluster: posti particolari + posti particolari in Italia, alloggi insoliti, ristoranti a tema, Rodrigo e Betta
H1: Posti che sembrano inventati. Ma esistono davvero. (invariato, PR #27)
Meta title: Posti particolari in Italia e nel mondo | Travelliniwithus (chars: 58)
Meta description: Siamo Rodrigo e Betta e ogni posto qui l'abbiamo visto di persona. Trovi il video girato lì, il prezzo con la data quando c'è e se eravamo ospiti. (chars: 146)
Hero headline: invariato
Hero subhead: invariato («Siamo Rodrigo e Betta. Prima ci andiamo, poi qui trovate…»)
Primary CTA: Guarda l'indice → #indice (esistente)
Secondary CTA: Vai alla mappa → /mappa (esistente)
Schema.org: WebSite + Organization (già in index.html) + ItemList dei posti in home (dopo il fix di buildPlaceItemListJsonLd)
Internal links to add: /mappa · /destinazione/italia/lombardia · /articolo/dormire-posti-sembrano-inventati · /chi-siamo
Risks: stessa stringa in tre file (routeMeta.ts:40, AtlanteHome.tsx:13, index.html:16), da allineare insieme; «se eravamo ospiti» è vero solo dopo la riconciliazione del disclosure (scoperta 13)
Docs to update: docs/10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT.md
```

Il title attuale fa 73 caratteri e viene troncato. La description attuale promette un giudizio
che il modello non dà più.

### Scheda Mappa: `/mappa`

```
Page: /mappa
Search intent: «mappa posti particolari», navigazionale dal marchio [VERIFY volumi]
Keyword cluster: mappa dei posti particolari + posti particolari in Italia, dove siamo stati
H1: Dove siamo stati davvero (invariato; uno solo tra muro di consenso e mappa)
Meta title: Mappa dei posti particolari | Travelliniwithus (chars: 46)
Meta description: Ogni punto è un posto dove siamo stati noi, con il video e la scheda. Senza consenso alla mappa trovi gli stessi posti in elenco, regione per regione. (chars: 150)
  (se l'elenco non si fa: «Ogni punto è un posto dove siamo stati noi, con il video e la scheda. La mappa si attiva solo con il tuo consenso.», chars: 114)
Hero headline: Dove siamo stati davvero
Hero subhead: vedi microcopy «mappa senza consenso» (sezione 5)
Primary CTA: Attiva la mappa → consenso
Secondary CTA: Vai all'elenco → #elenco (stessa pagina, intento diverso: chi non vuole la mappa)
Schema.org: CollectionPage + ItemList dei posti (prerequisito: buildPlaceItemListJsonLd)
Internal links to add: una /posto/<id> per voce dell'elenco · /destinazione/italia · /
Risks: il title attuale «Mappa Interattiva delle Destinazioni» e la description con «Esplora» (verbo vietato) e «filtra hotel, trattorie, borghi» [VERIFY: filtri reali] vanno sostituiti; se le tracce diventano pin, «con la scheda» non vale più per tutti i punti
Docs to update: docs/10_Projects/PROJECT_DESTINATIONS_SECTION_REVIEW.md
```

### Scheda Video: nessuna rotta nuova, o `/video` con il suo costo

Raccomandato: vista di una rotta esistente, `/esplora?vista=video`, con canonical `/esplora`.
Non tocca `server.ts`. Un flusso di video non è una pagina d'ingresso da Google: la SEO dei
video si fa sulla scheda, con `VideoObject` [VERIFY: solo se i file sono serviti davvero;
`public/video/` non ha file tracciati e 66 schede su 79 hanno `videoSrc`].

Se l'owner vuole comunque `/video` come rotta propria: `server.ts` sì (una riga in
`ALL_STATIC_APP_ROUTES`), backend-engineer + conferma. Le stringhe sono pronte:

```
Page: /esplora?vista=video (raccomandato) oppure /video (decisione owner, tocca server.ts)
Search intent: interno all'app; nessuna query da intercettare
Keyword cluster: video dei posti particolari + posti particolari
H1: I posti come li abbiamo girati (sostituisce l'h1 di /esplora quando vista=video)
Meta title: I video girati nei posti particolari | Travelliniwithus (chars: 55) (solo con /video)
Meta description: Un video per ogni posto, girato da noi lì. Guardalo, poi apri la scheda: dove si trova, quanto costa se lo sappiamo, cosa sapere prima. (chars: 135)
Hero headline: I posti come li abbiamo girati
Hero subhead: nessuno (il video è il contenuto)
Primary CTA: Apri la scheda → /posto/<id>
Secondary CTA: Salva → I miei posti
Schema.org: nessuno sulla vista; VideoObject sulla scheda posto (senza interactionStatistic: sarebbe un numero social)
Internal links to add: /posto/<id> per ogni video
Risks: autoplay e peso dei video contro il budget e l'LCP; «un video per ogni posto» vale solo per le schede con video
Docs to update: nessuno oltre al ciclo R2
```

### «I miei posti»: `/preferiti`

L'URL resta `/preferiti`. È privata e non indicizzata, quindi la parola nell'URL non conta per
la ricerca, e rinominarla vorrebbe dire una rotta nuova in `server.ts` più un redirect.
Cambiano solo le etichette.

```
Page: /preferiti
Search intent: nessuno (privata, noindex)
Keyword cluster: nessuno
H1: I miei posti (oggi «I tuoi preferiti», con occhiello «La tua collezione»)
Meta title: I miei posti | Travelliniwithus (chars: 31)
Meta description: I posti che hai salvato restano qui, su questo dispositivo: niente registrazione, e si aprono anche senza rete. (chars: 111) [la seconda metà vale solo se l'offline delle schede salvate viene costruito]
Hero headline: I miei posti
Hero subhead: vedi microcopy «vuoto» (sezione 5)
Primary CTA: Apri la scheda → /posto/<id>
Secondary CTA: none
Schema.org: nessuno
Internal links to add: /mappa (solo nello stato vuoto)
Risks: noindex oggi solo via JavaScript; aggiungere X-Robots-Tag nell'header (correzione trasversale 3)
Docs to update: nessuno
```

### Bonus, perché la tocca la sezione 2: indice destinazioni `/destinazione`

- Meta title: `Dove siamo stati, regione per regione | Travelliniwithus` (chars: 56). Coincide
  con l'`h1` esistente.
- Meta description: `Le regioni e i paesi dove abbiamo girato davvero, con quanti posti per
  ciascuno. Dove non siamo stati, c'è scritto zero.` (chars: 120).

### Manifest (installabilità come conseguenza)

- `name`: «Travelliniwithus»; `short_name`: «Travellini»; `lang`: «it».
- `description`: «I posti particolari dove siamo stati davvero, da salvare e ritrovare
  anche senza rete.» La seconda metà vale solo con l'offline.
- `shortcuts`: «I miei posti» → `/preferiti`; «Mappa» → `/mappa`.
- `start_url` e l'eventuale parametro di attribuzione: decide growth.

---

## 4. Lessico dell'interfaccia

Principio: **l'etichetta nomina l'oggetto o il numero che chi legge può controllare.** Se
non c'è niente da controllare, l'etichetta non esiste. Dove il lessico delle caption (§9)
offre una parola già usata da anni con chi segue, la prendo; dove offre un cliché
(«esperienza unica» 22 caption, «vista mozzafiato» 11, «devi assolutamente» 22), lo scarto.

| # | Termine generico | Termine Travelliniwithus | Perché |
| --- | --- | --- | --- |
| 1 | Home / Dashboard | «Posti» (etichetta della scheda) | La prima schermata mostra posti, non un riassunto di attività. Non c'è niente da monitorare |
| 2 | Feed | «Video» | «Feed» è inglese e promette un flusso infinito. «Video» dice cosa c'è; «reel» resta nel testo corrente come nome del formato Instagram [decisione owner] |
| 3 | Preferiti (sezione) | «I miei posti» | Dice cosa contiene e di chi è. «Preferiti» è la lingua del browser |
| 4 | Aggiungi ai preferiti | «Salva» | È il verbo con cui le caption chiedono da anni di tenere un post: chi arriva da Instagram lo riconosce |
| 5 | Rimuovi dai preferiti | «Togli dai miei posti» | Il gesto inverso, con lo stesso nome del posto in cui finisce |
| 6 | Filtri | «Stringi per: regione · che posto è · spesa» | Nomina le dimensioni vere; se un filtro non esiste non compare |
| 7 | Risultati | «12 posti in Lombardia» | Numero e luogo, controllabili contando le schede |
| 8 | Nessun risultato | «Qui non ci siamo stati» | Dice la verità del vuoto invece di suggerire un errore di ricerca |
| 9 | Esplora (CTA, titolo) | «Tutti i posti» / «Guarda l'indice» | «Esplora» è nella lista dei verbi vietati; l'indice è un oggetto che esiste |
| 10 | Scopri di più | «Apri la scheda» | Dice dove porta il tocco |
| 11 | Leggi tutto | «Tutta la scheda» / «Tutto l'articolo» | Stesso motivo |
| 12 | Condividi | «Mandalo a chi viene con te» | Porta «tagga qualcuno» (18 caption) in un gesto privato; la riga «Salvalo, o mandalo a chi ci deve venire» esiste già sulla scheda |
| 13 | Mappa interattiva | «Mappa» (etichetta), «Dove siamo stati davvero» (titolo) | «Interattiva» è ovvio e non promette niente. Ogni punto è un posto visto |
| 14 | Destinazioni | «Dove siamo stati» | «Destinazione» suggerisce un catalogo; il sito ha solo i posti visti, e lo zero dove non ce ne sono |
| 15 | Categorie | «Che posto è» | Una domanda con risposte d'uso invece di un'etichetta di catalogo |
| 16 | Food & Ristoranti | «Mangiare» | Niente inglese; è la domanda che ci si fa davvero |
| 17 | Hotel / Alloggi | «Dormire» (nel guscio); «alloggi insoliti» (nei titoli di pagina) | «Alloggi insoliti» è il loro bigramma (25 caption); nel guscio serve un verbo corto |
| 18 | Recensione | «Cosa abbiamo trovato» | Dal 15 agosto il modello descrive e non giudica; «recensione» promette un giudizio che non c'è |
| 19 | Voto / stelle / punteggio | nessuna etichetta; in «Come funziona»: «Niente voti: prezzo, data e cosa sapere» | Lo dice anche `llms.txt`. Uno spazio per il voto vuoto sarebbe una bugia |
| 20 | Prezzo | «Prezzo rilevato · gennaio 2026» | Un prezzo senza data invecchia in silenzio. «Pagato» solo se il rapporto è «nessun accordo» |
| 21 | Budget | «Spesa» («Spesa: media») | «Budget» è inglese (oggi sulla scheda); la spesa è quello che esce dal portafoglio |
| 22 | Verificato ✓ | «Controllato su <fonte> il <data>» | Una spunta non dice chi ha controllato cosa, né quando |
| 23 | Aggiornato | «Ricontrollato il <data>» | Stesso motivo, sul secondo controllo |
| 24 | Novità / Nuovi arrivi | «Appena girati» | Ordinati per data del video: controllabile |
| 25 | Popolari / Di tendenza | «Ci siamo tornati» | Nessun numero social: conta i nostri video pubblicati a più di un mese di distanza (62 locali, §3) |
| 26 | Vicino a te | «A 40 km da te» (con la posizione concessa) | Un numero si controlla, «vicino» no |
| 27 | Nelle vicinanze (sulla scheda) | «Nello stesso giro · entro 30 km» | Dice il raggio; «giro» è come si parla di un weekend in macchina |
| 28 | Suggeriti per te | «Stessa zona, stesso genere» | Non c'è profilazione, quindi non si finge |
| 29 | Iscriviti alla newsletter | «Ricevi i posti nuovi» (+ cadenza dichiarata [VERIFY]) | Dice cosa arriva. La scheda ha già «Ricevi i prossimi posti da salvare» |
| 30 | Attiva le notifiche | «Avvisami se ci andiamo» (zona bianca) | Una promessa con un solo evento, verificabile |
| 31 | Installa l'app | «Tienila sul telefono» | «Installa» evoca uno store; qui non ci sono né store né registrazione |
| 32 | Offline | «Senza rete» | Italiano corrente |
| 33 | Account / Profilo | «Su questo dispositivo» | Non esistono account: dirlo è una garanzia di privacy |
| 34 | Impostazioni | «Privacy e mappa» | Le sole impostazioni reali sono consenso e mappa |
| 35 | Accetta i cookie (per la mappa) | «Attiva la mappa» + riga «Attivarla vuol dire accettare i cookie di marketing» | L'etichetta è onesta solo se dice che cosa si accetta (scoperta 12) |
| 36 | Errore | «Non si è aperta» | Il soggetto è la scheda, non chi legge |
| 37 | 404 / Pagina non trovata | «Questo indirizzo non porta a nessun posto» | Coerente con l'oggetto del sito |
| 38 | Chiudi (foglio) | «Torna alla mappa» / «Torna all'elenco» | Dice dove si torna, non che cosa si chiude |
| 39 | Sponsor / Partner / Gifted | «ADV» · «Su invito» · «In collaborazione» · «Affiliato» · «Omaggio» | Le diciture di legge restano; «Gifted» è inglese (`PARTNERSHIP_LABEL`) e diventa «Omaggio» |
| 40 | FAQ | «Domande pratiche» | Non abbiamo il testo dei commenti per dire «domande che ci fate» (il corpus non li contiene) |
| 41 | Onboarding / Tutorial | «Come funziona, in tre righe» | Una promessa di brevità controllabile |

---

## 5. Microcopy degli stati (due varianti ciascuno)

Le frasi segnate con «[offline]» valgono solo se le schede salvate vengono messe in cache
(ipotesi owner, non ancora costruita).

| Stato | Variante A | Variante B |
| --- | --- | --- |
| **Vuoto** (I miei posti) | «Qui finiscono i posti che salvi. Per ora è vuoto: tocca Salva su una scheda e lo ritrovi qui.» | «Nessun posto salvato. Comincia dalla mappa o dai video: quando uno ti convince, Salva.» |
| **Senza rete** [offline] | «Sei senza rete. I posti che hai salvato si aprono lo stesso; mappa e video tornano con il segnale.» | «Niente rete, niente video. Le schede che hai salvato però si aprono.» |
| **Mappa senza consenso** | «La mappa carica le tessere da OpenFreeMap, che vede il tuo indirizzo IP. Se preferisci di no, qui sotto trovi gli stessi posti in elenco, regione per regione.» + riga sotto il bottone: «Attivarla vuol dire accettare i cookie di marketing.» [VERIFY] | «Mappa spenta, per tua scelta. Gli stessi posti sono qui sotto, in elenco.» |
| **Salvato** (avviso breve, con «Annulla») | «Salvato in I miei posti.» | «Fatto: lo ritrovi in I miei posti, anche senza rete.» [offline] |
| **Zona bianca** | «In Sardegna non abbiamo ancora girato niente. Non riempiamo il vuoto con posti che non abbiamo visto.» → «Avvisami se ci andiamo» | «Zero posti in Molise, per ora. Lascia la mail e ti scriviamo quando ci andiamo.» |
| **Errore** | «Questa scheda non si è aperta. Riprova tra un attimo, o torna all'indice dei posti.» | (404) «Questo indirizzo non porta a nessun posto. Forse ha cambiato nome: cercalo per città.» |
| **Invito a installare** (mai modale; dopo il secondo Salva) | Android/Chromium: «Tienila sul telefono: si apre come un'app e i posti salvati restano anche senza rete.» [offline] → «Aggiungi alla schermata Home» | iPhone: «Su iPhone: Condividi, poi "Aggiungi alla schermata Home". Niente store, niente registrazione.» |
| **Ritorno dopo tempo** | «Rieccoti. Dalla tua ultima visita ci sono <N> posti nuovi.» [VERIFY: il registro non ha una data di inserimento; `publishedAt` è la data del video] | «Rieccoti. Uno dei tuoi posti salvati ha i dati ricontrollati il <data>.» (da `checked.at`) |

«Rieccoti» e «Dalla tua ultima visita» evitano il genere grammaticale senza giri di parole.

---

## 6. GEO / AI-search: fatti citabili senza dati privati né numeri social

**Chi legge cosa, oggi.** Robots.txt lascia passare tutti.

| Visitatore | Esegue JS | Cosa legge su `/posto/<id>` |
| --- | --- | --- |
| Googlebot (e AI Overviews, dal suo indice) | Sì, con il rendering in coda | tutta la scheda, dopo il rendering |
| Bingbot (fonte anche per la ricerca di ChatGPT [VERIFY]) | Sì, con limiti [VERIFY] | probabilmente tutto |
| GPTBot / OAI-SearchBot, ClaudeBot, PerplexityBot, CCBot | No [VERIFY per crawler, oggi; fonte: studio Vercel/MERJ, dicembre 2024] | solo la testa: nome, indirizzo, descrizione nel `Review` |
| Scraper social (WhatsApp, Facebook, LinkedIn) | No (lo dice `generate-route-html.js`) | card OG |
| Lettori di `llms.txt` | n/d | `llms-full.txt`: 79 posti con prezzo, data, disclosure, fonte (host `www`) [VERIFY: quali motori leggono davvero `llms.txt`] |

**Forma di un fatto citabile.** Affermazione + fonte + data + autore, in testo HTML nella
prima risposta (C1) e ripetuta nel JSON-LD. Modello di blocco «In breve», stessa struttura su
ogni scheda:

> **Granduca di Campigna**, Campigna di Santa Sofia (Emilia-Romagna). Grotta e spa a turni
> privati, animali ammessi. Prezzo rilevato: da 98 €/notte (video di gennaio 2026). Rapporto
> commerciale: nessun accordo. Dati pratici controllati su granducacampigna.it il 15 agosto
> 2026.

(Dati presi da `llms-full.txt:10-19`, nessuna aggiunta.)

1. **Caption «con le loro parole».**
   - Una o due frasi, loro, in `<blockquote cite="<permalink Instagram>">`, con firma
     «Rodrigo e Betta, dalla caption del video» e `<time datetime>`.
   - Criteri di scelta: la frase deve contenere un fatto (cosa c'è, quanto costa, un vincolo),
     non un cliché.
   - Da togliere sempre: righe-formula (2.959 righe su 12.141, §9), hashtag, menzioni, codici
     sconto, link offuscati.
   - Da escludere in blocco: i 2 post in deny-list (a livello di dati, non solo di regola) e le
     caption con parole-chiave sensibili segnalate in §12 (famiglia, salute, scuola). Queste
     ultime passano solo dopo revisione a mano; il family è un marchio separato.
2. **Verdetti.** Non ci sono dal 15 agosto e il modello li esclude. Per GEO al loro posto
   funzionano fatti che orientano senza giudicare:
   - «Ci siamo tornati» (conteggio dei nostri video, §3);
   - i vincoli di `toKnow` (es. «non è una cena tranquilla»);
   - il disclosure.

   Il campo «per chi è / per chi no» c'è su 1 scheda su 79: **nessun campo schema.org per
   questo** finché la copertura è così bassa, perché lo strato strutturato renderebbe visibile
   l'assenza sulle altre 78. La meta della home va allineata (sezione 3).
3. **Date `checked`.**
   - Riga visibile «Dati controllati su <fonte> il <data>» (esiste già);
   - nel JSON-LD: nodo `WebPage` con `lastReviewed` = `checked.at` e `reviewedBy` = le due
     `Person` (`#rodrigo`, `#betta`, già definite in `index.html`);
   - in sitemap: `lastmod` = la data più recente tra `checked.at` e l'ultima modifica della
     scheda; in mancanza, la data del video. Mai l'ora della build.
4. **Prezzi datati.**
   - Testo visibile «Prezzo rilevato: <prezzo> · <mese anno del video>»; «pagato» solo per
     «nessun accordo»;
   - 23 schede su 79 hanno un prezzo (`llms.txt`); nelle caption lo dichiarano 243 reel, 132
     dei quali su luoghi nuovi (§5): è materiale per nuove schede, non per le tracce;
   - **niente `offers`** nel JSON-LD, tolto il 15 agosto per non affiancare offerta e
     giudizio: resta tolto;
   - `priceRange` sull'attività recensita: sconsigliato, perché non porta una data e invecchia
     in silenzio.
5. **Numeri social: zero.** Niente plays, follower o commenti nel codice né nel JSON-LD. In
   particolare **niente `interactionStatistic`** su `VideoObject`: è un numero social travestito
   da schema.
6. **Autore.** `Review.author` oggi è l'`Organization` (`placeReviewSchema.ts:128`). Per
   l'attribuzione nei motori di risposta («secondo Rodrigo e Betta di Travelliniwithus») va
   sulle due `Person` con `sameAs`, e l'`Organization` fa da publisher [VERIFY owner: chi firma
   le schede].
7. **Entità del marchio.** `index.html:163-166` dichiara per Rodrigo `knowsAbout: "isole
   minori italiane"`, ma il corpus ha 0 reel in Sardegna e 1 in Sicilia (§7). I motori leggono
   `knowsAbout` come competenza. Da sostituire con temi che i dati sostengono:
   - «alloggi insoliti» (25 caption);
   - «ristoranti a tema» («harry potter» 29, «tim burton» 16);
   - «escape room» (19);
   - «parchi divertimento» (Movieland, Phantasialand, Europa Park tra i luoghi di ritorno).
8. **Disclosure coerente prima di renderla citabile:** riconciliare le 12 schede discordanti
   (§6) prima del blocco «In breve».
9. **Privacy.**
   - Coordinate solo di attività pubbliche e solo per etichette locali.
   - Nessuna funzione tipo «vicino a casa nostra»: §14 mostra che il metodo non dimostra
     un'area di casa, e l'argomento resta una decisione privacy dell'owner.
   - L'elenco «Ci siamo tornati» va controllato dall'owner prima di pubblicarlo: una lista di
     ritorni concentrata può indicare una zona.

---

## 7. Idee

### Idea 1 — Una URL, due vesti
- In una frase: la stessa `/posto/<slug>` si apre come foglio sopra la mappa quando navighi nell'app e a tutta pagina quando arrivi da Google o da un link; indietro chiude il foglio e ti rimette dov'eri.
- Perché stupisce: Betta apre su WhatsApp il link del Granduca di Campigna, legge la scheda a tutta pagina, tocca «Vedilo sulla mappa» e la mappa si apre centrata lì con il foglio già su.
- Dato reale su cui poggia: `/mappa?place=<id>` esiste già (`Posto.tsx:79`); 79 schede con URL propria e testa prerenderizzata; consenso e mappa hanno già lo stesso `h1` e si escludono.
- Cosa richiede: codice (router con vista di sfondo, foglio, `inert`, title/canonical dinamici); dati 0; asset 0; ore owner 0.
- Rischio principale: budget JS a 776/780 KB (il sistema a fogli va in un chunk lazy); due `h1` se lo sfondo non viene declassato.
- Regole toccate: SEO-URL | bundle
- Variante: firma
- Autovalutazione 1-5: Stupore 4 / Verità 5 / Business 4 / Costo 3 / Carico owner 5

### Idea 2 — La scheda senza JavaScript
- In una frase: lo script di build scrive dentro `#root` il corpo vero e visibile della scheda (`h1`, «In breve», prezzo con data, dati pratici con fonte, 3-5 link) e React lo sostituisce al montaggio.
- Perché stupisce: un `curl` sulla URL restituisce tutta la scheda; un motore di risposta cita «prezzo rilevato da 98 €/notte, video di gennaio 2026».
- Dato reale su cui poggia: oggi il corpo servito è il preloader (`index.html:273-301`, `generate-route-html.js:336-343`); `llms-full.txt` ha già gli stessi fatti per 79 posti.
- Cosa richiede: codice in `scripts/generate-route-html.js` (nessun `server.ts`); un test che confronti `h1` e testo statico con React; controllo del CLS in LHCI; ore owner 0.
- Rischio principale: la versione statica e quella React divergono, o la sostituzione crea un salto di layout. Mitigazione: stesso markup sopra la piega, test, poi C2 con `hydrateRoot`.
- Regole toccate: SEO-URL | bundle (0 KB di JS)
- Variante: firma
- Autovalutazione 1-5: Stupore 3 / Verità 5 / Business 5 / Costo 3 / Carico owner 5

### Idea 3 — La mappa senza mappa
- In una frase: chi non dà il consenso non trova un muro nero ma gli stessi posti in elenco per regione, con i link alle schede; è anche l'unica versione della mappa che un crawler può leggere.
- Perché stupisce: la scelta di privacy non costa contenuto: «Mappa spenta, per tua scelta. Gli stessi posti sono qui sotto, in elenco.»
- Dato reale su cui poggia: screenshot 04 (muro scuro con `h1` e bottone); il consenso richiesto è quello marketing (`Mappa.tsx:86-93`).
- Cosa richiede: codice (elenco dai dati già nel bundle) + corpo statico per `/mappa`; ore owner 0.
- Rischio principale: duplicato di `/esplora`. Si distingue con l'ordinamento per regione e il canonical `/mappa`; con le tracce l'elenco si allunga e va diviso per regione.
- Regole toccate: privacy (migliora) | SEO-URL
- Variante: prudente
- Autovalutazione 1-5: Stupore 3 / Verità 5 / Business 4 / Costo 4 / Carico owner 5

### Idea 4 — Avvisami se ci andiamo
- In una frase: le sei regioni a zero reel diventano pagine oneste in `noindex, follow` con una sola azione, la mail per quella regione.
- Perché stupisce: «In Sardegna non abbiamo ancora girato niente. Non riempiamo il vuoto con posti che non abbiamo visto.» È l'opposto di ogni sito di viaggi.
- Dato reale su cui poggia: Basilicata, Friuli Venezia Giulia, Marche, Molise, Puglia, Sardegna a zero reel (§7); oggi indicizzate, con intro che dichiarano esperienza e, per Puglia e Sardegna, copertina `ai-generated`.
- Cosa richiede: codice (noindex, rimozione cover, vuoto); segmentazione email per regione (meccanismo: growth); ore owner: approvare 6 frasi.
- Rischio principale: promessa implicita di andarci. La frase non contiene date né impegni, e la lista per regione deve costare zero se non viene mai usata.
- Regole toccate: imagery-truth (sistema una violazione) | SEO-URL | privacy (consenso email)
- Variante: firma
- Autovalutazione 1-5: Stupore 4 / Verità 5 / Business 4 / Costo 4 / Carico owner 4

### Idea 5 — Il quaderno delle tracce
- In una frase: sotto le schede di ogni regione, un elenco di solo testo dei posti dove abbiamo girato un video ma non ancora scritto la scheda (nome, mese, link al video su Instagram), senza URL nuove e senza immagini.
- Perché stupisce: la pagina della Lombardia mostra le sue 21 schede più un quaderno lungo [VERIFY: conteggio per regione], la prova che la mappa è più grande del sito.
- Dato reale su cui poggia: 484 reel su 409 coordinate senza scheda, 297 in Italia (§15, §1); 0 cover reali per i 897 reel candidati fuori registro (§10), quindi solo testo.
- Cosa richiede: indice derivato in CI dal JSON tracciato (§11) con la deny-list applicata ai dati (oggi è solo una regola); normalizzazione dei nomi di regione e dei geotag; codice; ore owner: revisione a campione.
- Rischio principale: qualità dei geotag (19,6% di paesi sbagliati tra le etichette che ne nominano uno; «Italia» cade in Umbria). Riga fissa: «Posizione presa dal geotag di Instagram, non ricontrollata.»
- Regole toccate: privacy | imagery-truth (nessuna immagine) | SEO-URL (nessuna URL)
- Variante: audace
- Autovalutazione 1-5: Stupore 4 / Verità 3 / Business 3 / Costo 3 / Carico owner 3

### Idea 6 — Ci siamo tornati
- In una frase: invece di «più visti», che richiederebbe numeri social vietati, l'app mostra i posti dove abbiamo pubblicato video a più di un mese di distanza, con quanti video e le date.
- Perché stupisce: «Ristorante al Mago: 6 video tra ottobre 2023 e giugno 2026» è un giudizio fatto solo di date.
- Dato reale su cui poggia: 62 locali veri con almeno due "visite" (§3); la data è di pubblicazione, non della visita.
- Cosa richiede: dati (derivato dal corpus, unione degli alias tipo Warner Bros); conferma owner che siano ritorni veri e non ripubblicazioni; codice leggero.
- Rischio principale: un ritorno pagato letto come preferenza. Accanto a ogni video va il suo rapporto commerciale; la lista va controllata per la privacy (sezione 6, punto 9).
- Regole toccate: metriche-pubbliche (rispettata: conta i nostri video, non le visualizzazioni) | privacy
- Variante: firma
- Autovalutazione 1-5: Stupore 4 / Verità 4 / Business 4 / Costo 4 / Carico owner 3

### Idea 7 — In breve, citabile
- In una frase: ogni scheda apre con le stesse righe di fatti (cos'è, dove, prezzo con data, rapporto commerciale, controllato il), in HTML e in `llms-full.txt`, dalla stessa fonte.
- Perché stupisce: la risposta di un motore AI riprende le righe quasi alla lettera, con la data.
- Dato reale su cui poggia: `llms-full.txt` genera già questi campi per 79 posti; 23 su 79 con prezzo, 68 su 79 con informazioni pratiche (`llms.txt`).
- Cosa richiede: codice (componente + generatore); riconciliazione delle 12 schede con disclosure discordante (§6); ore owner: 12 schede.
- Rischio principale: rendere citabile un disclosure sbagliato. Il prezzo mancante si mostra una volta sola: «Prezzo: non l'abbiamo segnato».
- Regole toccate: metriche-pubbliche | privacy
- Variante: prudente
- Autovalutazione 1-5: Stupore 2 / Verità 5 / Business 5 / Costo 4 / Carico owner 4

### Idea 8 — La data che Google legge
- In una frase: in sitemap un `lastmod` vero (data del controllo o dell'ultima modifica della scheda, non l'ora della build), `WebPage.lastReviewed` nel JSON-LD e la riga visibile «Dati controllati su <fonte> il <data>».
- Perché stupisce: poco per Betta, molto in Search Console [VERIFY dopo 4-8 settimane].
- Dato reale su cui poggia: `generate-sitemap.js:312` scrive `lastmod: now` per ogni posto; il campo `checked {source, at}` esiste nel modello.
- Cosa richiede: codice in due script di build; ore owner 0.
- Rischio principale: schede senza `checked` → si ripiega sulla data del video, mai sulla build.
- Regole toccate: nessuna
- Variante: prudente
- Autovalutazione 1-5: Stupore 1 / Verità 5 / Business 3 / Costo 5 / Carico owner 5

### Idea 9 — Il titolo dice il nome
- In una frase: title della scheda con il nome in testa (`<nome> a <città> | Travelliniwithus`) e `h1` che tiene l'hook e aggiunge il nome, in un solo elemento.
- Perché stupisce: «Granduca di Campigna a Santa Sofia | Travelliniwithus» (53 caratteri) invece di 85 caratteri con il nome tagliato.
- Dato reale su cui poggia: `Posto.tsx:182` e `:230-232`; `generate-route-html.js:104-106` replica lo stesso title (vanno cambiati insieme).
- Cosa richiede: codice (template in due punti); per i borghi il nome coincide con la città → nome + regione; ore owner 0.
- Rischio principale: l'hook perde peso nella SERP; Google riscrive comunque molti title.
- Regole toccate: SEO-URL (nessuna URL cambia)
- Variante: prudente
- Autovalutazione 1-5: Stupore 1 / Verità 5 / Business 4 / Costo 5 / Carico owner 5

### Idea 10 — Il manifest parla italiano
- In una frase: nome, descrizione, lingua e scorciatoie del manifest in italiano, con «I miei posti» e «Mappa» a una pressione lunga sull'icona.
- Perché stupisce: tieni premuta l'icona sul telefono e compare «I miei posti».
- Dato reale su cui poggia: `vite.config.ts:33-53` (description «Travel blog di Rodrigo & Betta», nessun `lang`, `shortcuts`, `start_url` o `scope` dichiarati).
- Cosa richiede: codice (una configurazione); ore owner 0.
- Rischio principale: le scorciatoie non funzionano ovunque [VERIFY iOS].
- Regole toccate: nessuna
- Variante: prudente
- Autovalutazione 1-5: Stupore 3 / Verità 5 / Business 2 / Costo 5 / Carico owner 5

### Idea 11 — Pagine per domanda, solo se piene
- In una frase: pagine indice per tipo e regione («Alloggi insoliti in Toscana») generate solo quando la combinazione ha almeno 5 schede vere; sotto soglia non esistono.
- Perché stupisce: chi cerca «dove dormire in un posto strano in Toscana» atterra su cinque posti veri, con il prezzo datato.
- Dato reale su cui poggia: bigrammi delle caption «alloggi insoliti» 25, «posti particolari» 28, «weekend romantico» 15; Toscana 12 schede, Lombardia 21; [VERIFY: volumi di ricerca].
- Cosa richiede: codice; rotte nuove sotto `/esplora/...` → **`server.ts` sì** (`resolveAppStatus` conosce solo `/esplora` esatto), quindi backend-engineer + conferma owner; ore owner: un paragrafo d'apertura per pagina.
- Rischio principale: pagine sottili se la soglia scende; sovrapposizione con `/destinazione`.
- Regole toccate: SEO-URL | file-alto-rischio
- Variante: audace
- Autovalutazione 1-5: Stupore 3 / Verità 4 / Business 4 / Costo 2 / Carico owner 3

---

## Out of scope (rispettato)

- Nessun codice modificato; BEST letto e non toccato; `server.ts` solo letto.
- Nessuna meta per i 533 posti né per gli articoli; nessun fix di `buildPlaceItemListJsonLd`
  (solo segnalato).
- Nessuna direzione visiva e nessun meccanismo di business: la segmentazione email e le
  scorciatoie di attribuzione sono di growth.
- Nessuna pagina sottile, nessun cloaking (il corpo statico è visibile e identico per
  tutti), nessun hash routing, nessun numero social, nessun inglese proposto nell'interfaccia.

## Open questions / decisions for the user

1. **`server.ts` sì o no.** La raccomandazione non lo richiede: le quattro schede stanno su
   rotte esistenti. Serve solo se l'owner vuole `/video` (o le pagine dell'idea 11) come rotte
   top-level. Alternativa senza costo: `/esplora?vista=video`. Motivazione e costo: una riga in
   `ALL_STATIC_APP_ROUTES`, file ad alto rischio, backend-engineer + conferma.
2. **Rewrite di `firebase.json`.** Shell di fallback senza canonical e 404 veri per
   `/posto/**` (correzioni trasversali 1-3). Non è un file ad alto rischio, ma cambia il
   routing di produzione: da valutare in R3.
3. **«Reel» nell'interfaccia:** etichetta «Video» e «reel» solo nel testo corrente come nome
   del formato Instagram?
4. **Meta della home:** confermare che la description non prometta più un giudizio
   (allineamento a `homeComposition.ts:156` e a `llms.txt`).
5. **Soglie proposte:** 3 schede per indicizzare una regione; 5 condizioni per promuovere
   una traccia; 5 schede per una pagina tipo × regione.
6. **Consenso della mappa:** tenerlo agganciato al marketing o creare una finalità «mappa»?
   (privacy/legale, decisione owner)
7. **«Ci siamo tornati»:** sono ritorni veri? L'elenco va pubblicato? (privacy)

## Next hand-off

- Next agent: travellini-orchestrator (sintesi R2), poi travellini-code-architect (R3).
- Da verificare in R3, in ordine:
  1. canonical di `dist/index.html` dopo una build;
  2. host che reindirizza;
  3. precache HTML del service worker;
  4. fattibilità di C2 su `Posto.tsx`;
  5. rewrite di Firebase senza `/posto/**`.
- Trigger: questo file su disco con i punti 1-7.

## Notes

- **Docs to update** (quando la sintesi decide):
  - `docs/10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT.md` (meta home);
  - `docs/10_Projects/PROJECT_DESTINATIONS_SECTION_REVIEW.md` (zone bianche, cover AI);
  - `docs/10_Projects/PROJECT_RELEASE_READINESS.md` (canonical del fallback, `lastmod`, host);
  - una scheda in `docs/14_Bugs/` per il canonical del fallback, se la build lo conferma.
- **Miglioria operativa riusabile (proposta).** Uno script `audit:prerender` in CI che, dopo
  la build:
  1. per ogni URL della sitemap apre il file statico e controlla un solo `h1` e un canonical
     uguale alla URL;
  2. controlla che la destinazione della rewrite non abbia canonical;
  3. controlla che nessun `og:image` o `image` del JSON-LD punti a un prefisso
     `ai-generated`.

  Avrebbe preso le scoperte 3 e 7.
- **Idee scartate.**
  - `noscript` con il corpo: incerto per gli estrattori AI e ignorato dal rendering di Google.
  - Contenitore `sr-only` come `/sentiero`: testo nascosto per 400 pagine.
  - Una URL per traccia: pagine sottili.
  - `priceRange` nel JSON-LD: senza data.
- **Numeri usati** (fonte: fact pack, che vince sul brief): 1.192 reel; 409 luoghi nuovi
  utilizzabili per coordinata (297 in Italia, 484 reel); 533 come tetto; 79 schede visibili su
  110; sei regioni a zero reel; 62 locali di ritorno; 243 reel con prezzo; 12 discordanze di
  disclosure su 86. Nessun numero social compare in proposte di copy.
