---
title: HANDOFF_webapp-travelliniwithus_orchestrator_to_code-architect
status: open
created: 2026-09-29
from: travellini-orchestrator
to: code-architect
slug: webapp-travelliniwithus
expires: 2026-10-13
type: handoff
area: delivery
round: R3a (fattibilità, in parallelo alla griglia A/B dei prototipi)
---

# Handoff: fattibilità architetturale della webapp Travelliniwithus (tre pacchetti)

## Why this work matters

L'owner ha deciso che Travelliniwithus diventa una webapp: guscio persistente, schermo unico
al centro, contenuti editoriali come livelli con URL indicizzabili. La sintesi R2 ha ridotto
le 62 schede idea di R1 (più gli 8 semi dell'orchestratore) a 15 idee e a tre pacchetti
cumulativi (Prudente ⊂ Firma ⊂ Audace). Prima che l'owner scelga al gate R4 serve una risposta
tecnica con numeri: cosa si costruisce, dove, a quale costo di bundle, con quali rischi e con
quali tocchi ai file ad alto rischio. Sei l'unico agente di questo giro che legge il codice per
decidere un'architettura. **Non scrivi codice.**

## Decisions already made (non rinegoziare)

- **Webapp** (owner, 2026-09-29). Articoli, guide e schede posto restano URL indicizzabili:
  `/posto/<slug>`, `/articolo/<slug>`, `/destinazione/...`.
- **Nessuna rotta top-level nuova.** Voci e viste stanno su rotte esistenti (`/`, `/esplora`,
  `/mappa`, `/preferiti`, `/chi-siamo`) con stato in query. Una rotta nuova richiederebbe
  `server.ts` (vedi sotto): va proposta solo se non c'è alternativa, con costo scritto.
- **File ad alto rischio** (`server.ts`, `firestore.rules`, `src/config/admin.ts`): non li
  modifichi. Se una soluzione li richiede, lo scrivi come «richiede travellini-backend-engineer
  + conferma owner», con il perché.
- **Imagery truth** (`docs/20_Decisions/DECISION_IMAGERY_TRUTH_RULE_2026-07-22.md`, nel ramo
  base): solo foto o fotogrammi reali con provenienza, AI solo per asset `craft`. La cache
  offline segue la provenienza: una cover ritirata sparisce anche offline.
- **Privacy**: repository **pubblico**. Nei file che scrivi niente id di post in deny-list,
  nomi di strutture sanitarie o abitazioni, coordinate o dati personali. Le tracce del corpus
  stanno **sul comune**, mai su un punto preciso.
- **Budget**: `initial-js` 776 KB su 780 (`scripts/check-size.mjs`, `initialBudget =
  { name: 'initial-js', maxKb: 780, maxGzipKb: 250 }`). CI bloccante: Lighthouse a11y ≥ 0,95
  e CLS ≤ 0,1; e2e Playwright; gitleaks.
- **Brand DNA** invariata nel guscio (Fraunces, sabbia `#faf8f4`, terracotta `#c2410c`,
  lucide). La scelta visiva A/B non cambia l'architettura: barra, piano unico, stati e URL sono
  gli stessi con A e con B (ui-designer architettura).

## Context the receiver needs

**Base di codice, sola lettura:**
`BEST = /tmp/claude-0/-home-user-TRAVELLINIWITHUS/8c6b9c85-6fd1-5455-93cb-7a8ffe3e982f/scratchpad/best`
(ramo PR #27, commit 4fe1794). C'è una patch locale non committata a `src/lib/seo.ts`
(`buildPlaceItemListJsonLd`): trattala come assente dal commit. Il repo
`/home/user/TRAVELLINIWITHUS` è `main`, fermo all'11 agosto: non è la base.

**Se ti serve una build** per chiudere un `[VERIFY]`:
- clona in locale in scratchpad (`git clone --local "$BEST" <scratchpad>/arch-build`);
- collega `node_modules` di BEST con un symlink ed esegui `npm run build` lì;
- **mai** scrivere in BEST, **mai** `npm install` di pacchetti nuovi, mai deploy, mai commit.

**Leggi prima (in quest'ordine, solo le parti che servono):**
1. `docs/50_Scratch/HANDOFF_webapp-travelliniwithus_orchestrator_to_owner_sintesi-R2.md`:
   matrice, pacchetti, lista B, contraddizioni risolte.
2. `docs/50_Scratch/HANDOFF_webapp-travelliniwithus_ui-designer-architettura_to_orchestrator.md`:
   §0 (rilievi), §1 (gerarchia), §2 (ingressi), §4 (ritorno e offline), §5 (tracce), §6 (stati).
3. `docs/50_Scratch/HANDOFF_webapp-travelliniwithus_seo_to_orchestrator.md`: «Scoperte» e §1
   (architetture A/B/C/D, correzioni trasversali).
4. `docs/50_Scratch/HANDOFF_webapp-travelliniwithus_asset-curator_to_orchestrator.md`: §3
   (forme e pesi), §6 (valigia offline).
5. `docs/50_Scratch/HANDOFF_webapp-travelliniwithus_data-analyst_to_divergenza.md`: «Esito in
   testa», §11 (git), §15 (tracce e posti). Salta i blocchi `<details>`.

**Fatti verificati (usa questi; il resto è `[VERIFY]`):**

- **Produzione = hosting statico Firebase.** `firebase.json`: rewrite `/api/**` → funzione,
  poi `**` → `/index.html`. `server.ts` in produzione gira solo come funzione su `/api/**` e
  non serve HTML. Serve HTML solo in `npm run dev` (anche `webServer` di Playwright) e nel
  self-host. Lighthouse gira su `vite preview`. Conseguenza: una rotta top-level nuova va
  aggiunta a `ALL_STATIC_APP_ROUTES` (`server.ts:183-222`), altrimenti dev ed e2e rispondono
  404. `REAL_POSTO_IDS` (`server.ts:152-156`) deriva da `content-seed.json` (`!isPlaceholder`),
  come `scripts/generate-route-html.js`, che scrive `dist/posto/<id>/index.html` con la sola
  testa.
- **Corpo non prerenderizzato.** `generate-route-html.js:336-343` sostituisce `<title>` e
  aggiunge meta; il corpo resta il preloader di `index.html:273-301`.
  `injectSentieroPrerender` (`server.ts`) in produzione non vale (`/sentiero` è un 301 in
  `firebase.json`).
- **Fallback con il canonical della home** `[VERIFY: grep canonical dist/index.html dopo la
  build]`. `outputPathFor('/')` scrive `dist/index.html`, che è anche la destinazione della
  rewrite `**` e del `navigateFallback`. Risultato: soft 404 con la testa della home per slug
  inesistenti, `/preferiti` e segnaposto.
- **Service worker** (`vite.config.ts:12-108`):
  - `vite-plugin-pwa` ^1.2.0, `generateSW`, `registerType: 'autoUpdate'`,
    `injectRegister: 'script-defer'`, `clientsClaim: true`, `skipWaiting: true`, disattivato
    in dev;
  - precache con `globIgnores` per video, chunk mappa/charts/editor/pdf/three e tutte le
    varianti `-320|480|768|1024` (avif/webp);
  - `runtimeCaching` solo per i chunk pesanti (`CacheFirst`, 30 voci, 30 giorni);
  - nessuna regola per immagini, dati o font [VERIFY: `globPatterns` di default];
  - `navigateFallback: '/index.html'`; `offline.html` è inclusa ma non è servita.
  - Manifest: description «Travel blog di Rodrigo & Betta», `theme_color #ffffff`
    (`index.html` usa `#faf8f4`, riscritto per edizione), `display: standalone`, icone 192 e
    512 (512 «any maskable» sullo stesso file); niente `lang`, `start_url`, `scope`, `id`,
    `shortcuts`.
- **Guscio e bundle.** Candidati da togliere o sostituire per pagare la barra persistente:
  - Navbar, Footer, EditionBand;
  - AudienceGate (spento, `AUDIENCE_GATE_ENABLED = false` in `AudienceGate.tsx:24-29`);
  - ExitIntentPopup (montato in `Layout.tsx:32-59` su tutte le pagine tranne `/`, `/mappa`,
    `/guida-in-regalo`; importa Newsletter e LeadMagnetCover);
  - ScrollProgressBar, SmoothScrollProvider (lenis, gsap);
  - MobileBottomBar, StickyMobileCTA (8 pagine).

  `Mappa` è eager (`App.tsx:17-19`); MapLibre è caricata solo dentro `FullScreenMapExperience`.
  Il fallback di Suspense avvolge anche Layout (`App.tsx:81-96`).
- **Parametri URL.**
  - Bug verificato: `Posto.tsx:79` apre `/mappa?place=<id>`, ma
    `FullScreenMapExperience.tsx:666` legge `?posto=`.
  - Parametri esistenti su `/esplora`: `zone`, `type`, `format`, `q` (`App.tsx:135-138`).
  - Uno slug sconosciuto rimanda a `/esplora` senza avviso (`Posto.tsx:52-54`).
  - Le proposte R1 usano tre schemi diversi per la stessa entrata da un reel
    (`/esplora?reel=`, `/esplora?traccia=`, `/mappa?traccia=`). La sintesi ha deciso **un solo
    parametro in entrata, `reel=<codice>`**, risolto con `replace` verso `/posto/<slug>` o
    verso lo stato traccia.
- **Salvati.** `FavoritesContext.tsx:15-18, 105-110`: array di stringhe in `localStorage`
  (`travellini_favorites`), posti (id) e articoli (slug) mescolati, senza data. Sincronizzazione
  Firestore solo con login. Gli articoli si risolvono con una chiamata a Firestore
  (`Preferiti.tsx:37-91`).
- **Corpus.**
  - `src/data/instagram-corpus.json` (1.516.164 byte) e `corpus-places.json` (107.952 byte)
    sono tracciati in 4fe1794, non importati da nessun modulo di `src/` (fuori dal bundle), e
    la CI li vede (fp §11).
  - `corpus-places.json` **non ha coordinate**: le coordinate per reel stanno in
    `instagram-corpus.json`.
  - Il corpus non si rigenera in CI (feed autenticato).
  - I JSON contengono ancora le voci in deny-list. La deny-list è una regola, non è nel dato:
    l'elenco per codice sta fuori dal repo (variabile d'ambiente).
  - **Decisione owner aperta (E1)**: togliere i grezzi dal PR e committare solo un indice
    derivato e generalizzato, più eventuale riscrittura della storia. Progetta per entrambi gli
    scenari.
- **Tracce** (fp §15, reel usabili):
  - 484 reel su 409 coordinate di locali senza scheda (297 in Italia);
  - 86 reel su posti che hanno già la scheda (vanno sulla scheda, non sono tracce);
  - 369 con etichetta generica (né tracce né pin);
  - 25 senza coordinate, 149 senza luogo;
  - qualità dei geotag: 10 etichette su 51 che nominano un paese ne risolvono un altro (fp §7).
- **Immagini e offline** (asset-curator):
  - forme `p916`, `c45`, `s11`, `h169` con larghezze fisse;
  - nomi con hash `/images/places/<slug>/<hash8>-<forma>-<larghezza>.<avif|webp>`, perché
    `firebase.json` serve le immagini con `immutable`;
  - valigia: cache `my-places-v1` fuori dal precache, `s11-192` + `c45-540` (media 67 KB, max
    114) più `p916-480` opzionale, tetto 220 KB a posto e 60 posti; cache di navigazione
    `places-browse` 120 voci; `navigator.storage.persist()`; invalidazione per hash.
- **Consenso.** «Attiva la mappa» imposta `marketing: true` (`Mappa.tsx:86-93`); con quel
  consenso `trackEvent` e `trackPageview` chiamano `fbq`/`ttq` se caricati
  (`analytics.ts:154-185`, letto in R2). Proposta: categoria «mappe» separata in `consent.ts`.

## What the receiver should produce

Un documento di fattibilità, con numeri dove si possono misurare e `[VERIFY]` dove no.

**1. Tabella per pacchetto** (Prudente, Firma, Audace). Per ciascuno:
- componenti nuovi e toccati;
- chunk lazy nuovi con peso stimato;
- **delta netto di `initial-js`** (KB e gzip, con il metodo di stima);
- file ad alto rischio toccati (sì/no e perché);
- altri file di config toccati (`firebase.json`, `vite.config.ts`, `consent.ts`);
- rischi;
- ordine di costruzione in slice verificabili (ogni slice passa la CI da sola).

**2. Risposte ai 7 punti di fattibilità di R1b:**
1. confine di Suspense dentro il guscio e delta netto di `initial-js`: cosa esce dal bundle
   iniziale e quanto pesa, perché il guscio sia in pari o in attivo;
2. rotte con «background location» per il pannello desktop su `/posto/<slug>`: `inert` sullo
   sfondo, un solo `h1` nel DOM, `document.title` e canonical dinamici, destino di
   `QuickViewDrawer`;
3. schema v2 dei salvati `{ tipo: posto | articolo | traccia, id, salvatoIl }`: migrazione
   dall'array attuale; impatto su Firestore per chi ha un account (campo e regole: se tocca
   `firestore.rules`, scrivilo);
4. indice statico delle tracce e tabella `codice reel → destinazione`:
   - campi (codice pubblico, comune, regione, paese, mese; niente plays, niente caption,
     niente coordinate esatte);
   - peso;
   - dove si applica la deny-list (in ingresso, da variabile d'ambiente);
   - fonte dei centroidi comunali (gazetteer pubblico, licenza `[VERIFY]`);
   - **due scenari**: grezzo tracciato in CI oppure indice derivato generato in locale e
     committato (decisione E1);
5. runtime cache al salvataggio («valigia») e copia offline delle guide salvate (JSON statico
   al salvataggio contro persistenza offline di Firestore);
6. contratto unico dei parametri URL:
   - nomi: `posto`, `traccia`, `reel`, `vista`, `mese`, `miei`, `lista`, più quelli esistenti
     `zone`, `type`, `format`, `q`;
   - `replace` per sfogliare e `push` per aprire;
   - canonical per ogni stato;
   - dove vive il contratto (proposta: un modulo in `src/config/`);
   - un test e2e di andata e ritorno per parametro, che avrebbe preso il bug `place`/`posto`;
7. comportamento del browser integrato di Instagram e dell'app installata su iOS (storage
   separato, installazione, `100dvh`, safe area). Non verificabile da codice: elenca cosa va
   provato su dispositivo con browser-auditor e con quale protocollo.

**3. Prerender del corpo (SE: A + C1, poi C2):**
- fattibilità di C1 in `generate-route-html.js`: corpo visibile nel `#root`, stesso `h1` di
  React, niente `sr-only`, cover con dimensioni esplicite;
- rischio CLS alla sostituzione React e come si misura (`/posto/verona-vigna-benini` è già in
  LHCI);
- fattibilità di C2 (`hydrateRoot`) su `Posto.tsx`: cosa impedisce oggi il render fuori dal
  browser;
- test di parità statico/React.

**4. Correzioni trasversali di SE:**
- shell di fallback senza canonical e senza `og:url`;
- 404 veri per `/posto/**` togliendo la rewrite catch-all su quel prefisso;
- `X-Robots-Tag: noindex` per le rotte private;
- `lastmod` vero;
- un solo host in `llms.txt`;
- esclusione degli HTML per rotta dal precache.

Per ciascuna: file toccato, rischio di routing in produzione, se serve la conferma owner
(`firebase.json` non è in lista ad alto rischio, ma cambia la produzione).

**5. Service worker:**
- con `autoUpdate` + `skipWaiting` + `clientsClaim`, un guscio persistente può ritrovarsi a
  metà sessione con chunk lazy di una versione rimossa `[VERIFY: comportamento attuale e
  gestione degli errori di import dinamico]`. Proponi la strategia: aggiornamento differito con
  avviso nel guscio, ricarica al cambio di rotta, oppure altro;
- `generateSW` contro `injectManifest` (serve un `catchHandler` per una vera pagina offline):
  cosa guadagna la valigia con ciascuno;
- manifest da app (`lang: it`, `start_url` con marcatore di sorgente, `scope`, `id`,
  `shortcuts`, `theme_color` allineato);
- cosa succede oggi ai visitatori di ritorno su `/posto/<id>` quando il SW serve
  `/index.html` dal `navigateFallback` `[VERIFY]`.

**6. Consenso «mappe»:** impatto di una nuova categoria in `consent.ts`, nel banner e in
`/cookie`, e stato della carta locale (SVG in chunk lazy, nessuna chiamata esterna) come
partenza della voce Mappa.

**7. Budget per crescita:** testo dei posti (circa 1,3 KB a posto) nel bundle oltre i 200
posti; quando va in un chunk lazy; impatto su ricerca (`SearchModal`) e su `REAL_POSTO_IDS`.

**8. Risposte ai `[VERIFY]` chiudibili con una build:**
- canonical di `dist/index.html`;
- manifest del precache in `dist/sw.js` (pattern di default, peso della shell);
- peso reale di Navbar, Footer, EditionBand, ExitIntentPopup, SmoothScrollProvider e
  ScrollProgressBar nel bundle iniziale.

Formato: tabelle brevi, `file:riga` per ogni affermazione sul codice, una raccomandazione per
punto.

- Where it lands: `docs/50_Scratch/HANDOFF_webapp-travelliniwithus_code-architect_to_orchestrator.md`
  nel repo `/home/user/TRAVELLINIWITHUS`, con il frontmatter del template handoff.

## Out of scope (do NOT touch)

- Scrivere codice, modificare BEST, committare, fare push, deploy, `npm install` di pacchetti
  nuovi.
- Modificare `server.ts`, `firestore.rules`, `src/config/admin.ts`, anche solo per prova.
- Direzione visiva, copy e lessico (sintesi R2, UD, SE), metriche di business (GR).
- La privacy del corpus nel repo: è la decisione E1 (owner più security-auditor). Tu progetti
  l'indice per entrambi gli scenari, non scegli.
- Rotte top-level nuove, salvo il caso in cui dimostri che non c'è alternativa.

## Open questions / decisions for the user

- Nessuna nuova. Se un punto richiede un file ad alto rischio o una modifica al routing di
  produzione (`firebase.json`), elencalo in una sezione «Richiede conferma owner» con
  alternativa e costo.

## Next hand-off

- Next agent: travellini-orchestrator (chiusura del gate R4 insieme alla griglia A/B). Dopo la
  scelta dell'owner: piano d'implementazione (nuova invocazione dell'orchestratore), con
  travellini-backend-engineer per le parti ad alto rischio e travellini-perf-engineer per la
  misura sul codice vero.
- Trigger: il tuo file di uscita esiste con i punti 1-8.

## Notes

- Il budget di 4 KB su `initial-js` è la vera frontiera: un guscio che non si ripaga
  togliendo qualcosa non passa la CI. La prima riga della tua risposta dovrebbe essere il
  delta netto stimato del guscio.
- Il tetto di 60 marcatori sulla mappa (22 contro 109, 603 nodi DOM contro 2.476) è una
  conquista di performance del PR #27: le tracce al comune devono restarci dentro.
