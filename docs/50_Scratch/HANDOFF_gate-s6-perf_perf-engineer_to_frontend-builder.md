---
title: HANDOFF_gate-s6-perf_perf-engineer_to_frontend-builder
status: open
created: 2026-07-24
from: travellini-perf-engineer
to: travellini-frontend-builder
slug: gate-s6-perf-sweep
expires: 2026-08-07
type: handoff
area: delivery
---

# Handoff: Gate S6 pre-deploy perf sweep - one release blocker + recurring fixes

## Why this work matters

Fase 1 step 3 (perf-engineer) del gate S6 pre-deploy ha misurato CWV mobile
(375x812, Slow 4G, CPU 4x) su build di PRODUZIONE (vite preview porta 4173,
non dev server) per /, /esplora, /chi-siamo, /collaborazioni, /family,
/family/consigli. Un finding e un blocker di rilascio a se (rompe la
navigazione diretta su quasi tutte le rotte per i visitatori di ritorno);
gli altri sono pattern CWV che ricorrono su tutte le rotte testate e vanno
risolti una volta per chiudere il gate.

## Decisions already made

- Verdict: BLOCKER. Non deployare finche il punto 1 sotto non e corretto.
- Metodologia di misura: SW disinstallato + navigate_page(type:'reload',
  ignoreCache:true) per ogni rotta, per ottenere numeri da prima-visita-vera
  (bypassando sia il bug SW sia la cache HTTP calda). Confermato via A/B
  diretto (sessionStorage twu_gate_dismissed=1) che l'AudienceGate NON causa
  CLS e NON ritarda LCP - LCP home risolve a 1084ms, ben prima che il gate
  possa montare (idle callback / timeout 1200-1800ms). Nessuna azione
  richiesta sull'AudienceGate.
- I numeri buoni gia in mano all'owner (LCP 1.08-1.95s su tutte le rotte)
  vengono da Lighthouse CI con query param ?twu_audit=1, che sostituisce le
  fetch Firestore reali con contenuto demo locale. Senza quel bypass
  (comportamento reale di un utente in produzione), il render delay sale a
  7-8.5s su ogni rotta non-home testata. Il gate CI attuale non vede questo
  perche Lighthouse resetta lo storage/SW ad ogni run - e un blind spot del
  gate stesso, non solo delle pagine.

## Context the receiver needs

### 1. BLOCKER - service worker serve /offline.html su ogni navigazione diretta non-home

File: vite.config.ts (blocco VitePWA -> workbox), righe ~82-85.

navigateFallback: '/offline.html',
navigateFallbackDenylist: [/^\/\_/, /\/[^/?]+\.[^/]+$/],

generateSW registra una NavigationRoute legata INCONDIZIONATAMENTE a
/offline.html per qualunque richiesta di navigazione non in denylist.
/ funziona per caso: precacheAndRoute risolve / in index.html via
directoryIndex di default e quella regola vince PRIMA della
NavigationRoute. Qualsiasi altra rotta (/esplora, /chi-siamo, /family,
/family/consigli, articoli, /shop, ecc.) non ha un match esatto nel
precache, quindi cade nella NavigationRoute e riceve offline.html invece
della pagina reale - SEMPRE, non solo quando l'utente e realmente offline.

Riprodotto live: prima visita su / -> pagina corretta (nessun SW attivo
ancora). Secondo hard-navigate sulla stessa tab verso /esplora -> titolo
"Sei offline - Travelliniwithus", contenuto reale mai arrivato a schermo.
Verificato leggendo dist/sw.js generato: registra
NavigationRoute(createHandlerBoundToURL("/offline.html"), {denylist:...}).

Questo colpisce: refresh su qualunque pagina interna, link diretti
condivisi via social/email per chi ha gia visitato il sito, PWA "aggiungi
a schermata Home" su una rotta interna, crawler/bot con SW cache residua.
Lighthouse CI non lo vede perche resetta lo storage (incl. SW) ad ogni URL.

Fix atteso: navigateFallback: '/index.html' (o rimuovere del tutto
navigateFallback esplicito e lasciare il default di generateSW, che e gia
l'app shell) cosi che ogni rotta riceva lo shell SPA e React Router prenda
il controllo lato client. Se serve mantenere una vera pagina offline per
l'assenza di rete, va implementata con un catchHandler sulla
NavigationRoute (si attiva SOLO quando il fetch di rete fallisce davvero),
non come navigateFallback primario. Verificare docs/ARCHITECTURE.md riga
~201 e docs/audit/DEVELOPMENT_PLAN.md riga ~529 che documentano la config
attuale come intenzionale - era un fraintendimento del comportamento di
navigateFallback, va corretto in entrambi i posti dopo il fix.

### 2. registerSW.js e render-blocking su ogni rotta

dist/index.html (generato da vite-plugin-pwa):

<script id="vite-plugin-pwa:register-sw" src="/registerSW.js"></script>

subito prima di </head>, senza defer/async. Misurato: FCP/LCP savings
stimati 895-1140ms su /chi-siamo, /collaborazioni, /family (insight
RenderBlocking di Chrome DevTools). Fix: in vite.config.ts blocco
VitePWA(...), impostare injectRegister: 'script-defer' (vite-plugin-pwa
supporta questo valore) cosi lo script porta l'attributo defer.

### 3. CLS ricorrente 0.05-0.11 causato da web font swap (FOUT)

Osservato su / (0.05-0.08), /chi-siamo (0.11 - sopra hard ceiling 0.1),
/family (0.10 - al limite), /family/consigli (0.08). Causa identificata da
Chrome (quando attribuita): inter-latin-400-normal-_.woff2,
inter-latin-500-normal-_.woff2, fraunces-latin-wght-italic-\*.woff2 caricati
via @import in src/index.css (righe 7-11, @fontsource), nessun
link rel=preload. Il testo va a schermo con il font di fallback, poi il
webfont arriva e sostituisce (FOUT), causando reflow. Score ricorrente
0.0805 su piu pagine indipendentemente dal contenuto, segno che e lo
stesso meccanismo ovunque - fix una volta, risolve tutte le rotte.

Fix atteso: preload dei file woff2 effettivamente usati above-the-fold
(Inter 400/500/600 body text, Fraunces wght variable + italic per h1/h2)
via link rel=preload as=font type=font/woff2 crossorigin - nota: il path
finale e hashato da Vite, va risolto post-build (stesso problema gia
gestito per l'hero image, vedi commento in index.html righe 15-19).
Alternativa complementare: size-adjust/ascent-override/descent-override su
un @font-face di fallback per azzerare la differenza di metrica anche se
il preload non arriva in tempo.

### 4. Preload statico dell'hero home si attiva su OGNI rotta, sprecato

index.html righe 26-37: il preload di hero-impossible\*.avif non ha
condizione di rotta - e nell'unico head condiviso da tutta la SPA. Console
warning confermato su /esplora, /chi-siamo, /family, /family/consigli: "was
preloaded using link preload but not used within a few seconds from the
window's load event". Compete per banda con le risorse davvero necessarie
a quelle rotte durante il render delay critico. Fix: condizionare il
preload alla home (via un piccolo script inline che controlla
location.pathname === '/' prima di iniettare il link, o spostarlo
interamente nel componente home via Helmet accettando la nota esistente
sul timing - va verificato che Helmet lo emetta abbastanza presto).

### 5. /family/consigli: la prima card (elemento LCP) fallisce tutti e 3 i check LCPDiscovery

File: src/components/family/FamilyEntryCard.tsx (usa OptimizedImage senza
mai passare priority) e src/pages/family/FamilyConsigli.tsx riga 45
(entries.map((entry) => <FamilyEntryCard key={entry.id} entry={entry} />)

- nessuna distinzione per indice).

Misurato: LCP element = tutto-pronto-o-quasi-cover-768.avif (74KB, peso
OK, non e un problema di asset). fetchpriority=high: FAILED. loading=lazy
presente quando non dovrebbe: FAILED. Discoverable nel documento iniziale:
FAILED. Load delay isolato: 7070ms (quasi tutto downstream degli altri fix
sopra, ma vale comunque sistemarlo).

Fix atteso: passare priority a FamilyEntryCard per entries[0] (prima card
sopra la piega) cosi OptimizedImage applichi loading="eager" +
fetchPriority="high". Pattern da riusare: qualunque componente prima-card-
di-una-lista (es. ContentCard, ArchiveCard) va controllato per lo stesso
anti-pattern - non ho verificato queste ultime in questo giro, solo
FamilyEntryCard perche era la rotta richiesta.

### 6. Bundle iniziale sistematicamente sopra budget su ogni rotta testata

Ogni rotta non-home carica comunque: react-core (92KB gz), index main
chunk (132KB gz), icons (10KB gz), motion (46KB gz), search-utils (7KB gz)

- l'intera catena Firebase (firebase-core 30KB gz + firebase-firestore
  93KB gz + firebaseApp/firebaseDb/firebaseService) + demoContent/
  previewContent/demoArchive/contentTaxonomy/discoveryQuery/contentLibrary -
  tutto molto oltre il budget JS iniziale di 180KB gz (ceiling 250KB gz),
  anche sommando solo react-core+index. Non ho tracciato l'import chain
  esatta in questa sessione (limite di tempo), ma il pattern (stessi chunk
  su /chi-siamo, /esplora, /collaborazioni, /family, pagina About inclusa)
  suggerisce che Navbar/SearchModal in Layout.tsx (montato su ogni rotta) o
  useSiteContent importano Firebase/il content-index eagerly invece che
  on-demand all'apertura effettiva della ricerca. Da investigare con
  npm run audit:bundle:viz / vite-bundle-visualizer per confermare l'import
  chain prima di intervenire - non correggere alla cieca.

## What the receiver should produce

- Fix 1 (blocker) applicato e verificato: hard-reload su /esplora con SW
  attivo (installato da una visita precedente) deve servire la pagina
  reale, non offline.html.
- Fix 2, 3, 4 applicati su vite.config.ts / src/index.css / index.html.
- Fix 5 applicato su FamilyEntryCard.tsx + FamilyConsigli.tsx.
- Fix 6: solo investigazione con bundle visualizer, azione concreta da
  decidere dopo aver visto l'import chain reale (non implementare a
  intuito).
- Aggiornare docs/ARCHITECTURE.md (riga ~201) e
  docs/audit/DEVELOPMENT_PLAN.md (riga ~529) per riflettere il fix del SW.
- Richiedere travellini-perf-engineer per re-misurare tutte e 6 le rotte
  dopo i fix, prima di considerare il gate S6 chiuso.

## Out of scope (do NOT touch)

- server.ts, firestore.rules, src/config/admin.ts - non toccare da qui.
- Nessuna modifica visiva/di design: tutti i fix sono di loading strategy,
  non di contenuto o layout.
- Non rimuovere l'AudienceGate ne cambiarne il timing: confermato che non
  causa regressioni CWV.
- Non provare a risolvere il problema Firestore-latency-reale sostituendo
  con demo content in produzione - quello e il bug del gate CI, non del
  sito; va segnalato a parte (vedi nota sotto), non mascherato lato client.

## Open questions / decisions for the user

- Il gate CI (lighthouserc.json) usa ?twu_audit=1 su tutte le URL, che
  maschera la latenza reale di Firestore. Va deciso se il gate deve
  continuare a testare il fast-path (attuale) o se serve un secondo run
  senza il bypass per catturare la latenza reale utente - proposta per
  travellini-quality-auditor / owner, non decisione mia.

## Next hand-off

- Next agent: travellini-perf-engineer (re-misura dopo i fix)
- Trigger: fix 1-5 mergiati in build di produzione

## Notes

- Metodologia di misura per chi rieseguira: SEMPRE disinstallare il SW
  (navigator.serviceWorker.getRegistrations() -> unregister()) prima di
  ogni navigazione di test, poi navigate_page(type:'reload',
  ignoreCache:true) per bypassare la cache HTTP calda - un semplice reload
  senza ignoreCache riusa la disk cache e produce numeri falsamente ottimi
  (es. LCP 106ms misurato per errore su /esplora al primo tentativo).
- Build usata: npm run build (produzione) servita via
  npx vite preview --host 127.0.0.1 --port 4173 - stesso meccanismo di
  scripts/lhci-preview.mjs usato dal gate CI.
