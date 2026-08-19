---
type: project
area: product
status: archived
priority: p0
owner: team
repo: TRAVELLINIWITHUS
route: /
related:
  - '[[10_Projects/PROJECT_SITE_BLUEPRINT_2026]]'
  - '[[10_Projects/PROJECT_SITE_V2_ADVANCED_IMPROVEMENT_PLAN]]'
  - '[[10_Projects/PROJECT_RELEASE_READINESS]]'
source: owner direction 2026-06-26
tags:
  - project
  - cinematic-home
  - rebuild
  - product
  - brand
superseded_by: PROJECT_HOME_RICOMPOSIZIONE_2026-07-26
---

> **Superato il 2026-07-31.** Questo piano non è più "cosa fare".
> Il lavoro ancora vivo è confluito in [[10_Projects/PROJECT_BACKLOG_UNICO_2026-07-31]]; la direzione è in `PROJECT_HOME_RICOMPOSIZIONE_2026-07-26`.
> Resta leggibile come storico — non aggiungerci voci nuove.

# PROJECT_CINEMATIC_REBUILD_HOME_2026

## Social baseline — Diario delle meraviglie vere (2026-07-21)

Decisione owner: fermare la raccolta a 30 contenuti Instagram e usarli come
base sufficiente. Il dossier e in
[[13_Content/INSTAGRAM_CONTENT_AUDIT_2026-07-21]]. La nuova ipotesi creativa
mantiene il calore vintage e personale richiesto, ma usa un'architettura web
moderna: taccuino a capitoli, cambio pagina con scroll nativo, prova concreta e
CTA reali.

Evidenze che devono guidare la prossima iterazione:

- meraviglia e sorpresa prima di sconto/prodotto;
- `Sembra impossibile`, `Altrove, vicino`, `Dormire dentro una storia`,
  `Mangiare dentro una storia`, `Vale davvero?` come capitoli;
- Rodrigo & Betta come voce e filtro umano;
- AI solo per art direction editoriale, non per falsificare persone o prove;
- motion di pagina desktop progressivo e fallback mobile verticale intenzionale;
- risorse/affiliazioni separate dalla prima impressione di brand.

## Implementazione — Diario delle meraviglie vere (2026-07-21)

La direzione è stata implementata sulla route pubblica `/` in
`src/components/home/cinematic/CinematicHomepage.tsx`. Il concept approvato è stato tradotto in
cinque pagine digitali: `Sembra impossibile`, `Altrove, vicino`, `Dentro una storia`, `Vale
davvero?` e `Prossima traccia`.

Decisioni bloccate:

- rilegatura e testata persistenti come identità dell'oggetto;
- scroll nativo con prospettiva Motion leggera solo su desktop;
- versione mobile verticale, senza simulazione fisica della pagina;
- tre immagini ImageGen dichiarate come visuali editoriali, non prove fotografiche;
- CTA verso `/mappa`, `/destinazione/italia`, `/esplora`, `/chi-siamo` e
  `/collaborazioni`;
- capitolo `Vale davvero?` come differenza funzionale fra sito e social.

Verifica finale: typecheck e build pass; audit UI con zero errori; visual smoke 14/14; matrice
320/375/768/1024/1536 senza overflow né errori console; axe homepage zero violazioni. Il source
of truth e il confronto visuale sono registrati in `design-qa.md`.

## Prima pagina interna — Mappa delle tracce (2026-07-21)

La route `/mappa` e stata ricomposta come il foglio cartografico successivo del
taccuino: ingresso editoriale breve, filtri a linguetta, mappa MapLibre scura
incorniciata, tre percorsi suggeriti, scheda contestuale e archivio finale.

Decisioni bloccate:

- motore `react-map-gl/maplibre` + OpenFreeMap preservato, senza token o nuovo provider;
- desktop a tavola mappa/preset e mobile interamente in-flow;
- cluster, marker, filtri, preset, deep link e tracking preservati;
- immagini mostrate solo con `imageVerified: true`; le anteprime demo restano paper-first;
- errore dati esclusivo con `Riprova` e uscita verso l'archivio;
- assistente, exit intent e smooth scroll disattivati sulla route per non coprire o rallentare la mappa;
- controlli e filtri con target touch di almeno 44 px, focus tastiera restituito al marker;
- Fraunces alleggerito alla variante variable `wght` mantenendo famiglia e pesi del brand.

Il contratto completo vive in
`docs/50_Scratch/PLAN_mappa-delle-tracce-redesign-2026.md`; `/esplora` resta il
prossimo incremento e non e stato ridisegnato in questo passaggio.

## Direzione corrente — Il montaggio delle tracce (2026-07-18)

La home pubblica `/` è stata riallineata al concept approvato **Il montaggio delle tracce**. La composizione vive in `src/components/home/cinematic/CinematicHomepage.tsx` e usa scroll nativo, Fraunces/Inter, asset reali Batu Caves e Tavernal, tre capitoli e una CTA finale. Mobile e `prefers-reduced-motion` sono versioni intenzionali della stessa storia. Nessun backend o file ad alto rischio è stato modificato.

Verifiche eseguite: un solo H1, zero overflow a 375/768/1280/1440, console pulita, link capitoli coerenti e build produzione completata. La documentazione operativa è in `docs/TRAVELLINI-HOMEPAGE.md`; il confronto visuale è in `design-qa.md`.

## Decisione owner

Il sito viene ricostruito attorno a una nuova esperienza immersiva. `Il Sentiero`
diventa la nuova homepage e il resto delle pagine viene considerato materiale da
mettere in standby, rivedere e riattivare solo quando raggiunge il nuovo livello
di brand.

Il vecchio sito non va cancellato: resta come archivio tecnico/editoriale da cui
recuperare componenti, copy, contenuti e logiche utili.

## North Star

La homepage deve sembrare una firma di brand, non una pagina template:

> Un viaggio cinematografico interattivo dentro il mondo di Rodrigo & Betta:
> posti provati, tracce reali, mappe, reel, appunti e deviazioni che portano
> l'utente a scegliere il prossimo passo.

L'utente deve capire in pochi secondi:

- chi sono Rodrigo & Betta;
- che cosa rende Travelliniwithus diverso dagli altri travel creator;
- come esplorare luoghi e contenuti;
- come entrare in relazione: mappa, newsletter, collaborazione.

## Creative Direction

Titolo interno: **La Valigia delle Tracce**.

La home non e una sequenza di sezioni, ma un oggetto narrativo. L'utente apre una
valigia o segue un sentiero di oggetti: Polaroid, mappa piegata, telefono,
taccuino, biglietti, chiave, passaporto. Ogni oggetto apre un capitolo del brand.

### Capitoli

1. **Prologo — Apri la traccia**
   - Mood: buio caldo, grana filmica, luce radente.
   - Messaggio: "Ogni posto che consigliamo lascia una traccia."
   - Azione: entrare nell'esperienza o saltare alla mappa.

2. **Noi — Due persone prima delle guide**
   - Oggetto: Polaroid / frame reale di Rodrigo & Betta.
   - Obiettivo: rendere immediatamente people-led il brand.

3. **Metodo — Provato sul campo**
   - Oggetto: taccuino.
   - Obiettivo: spiegare criteri reali: provato, utile, onesto, non generico.

4. **Mappa Viva — Dove iniziare**
   - Oggetto: mappa piegata che si apre.
   - Obiettivo: dare il momento "wow" e portare alla discovery.

5. **Reel / Tracce Social**
   - Oggetto: telefono.
   - Obiettivo: collegare IG/TikTok al sito senza sembrare un feed incollato.

6. **Deviazioni — Posti particolari**
   - Oggetto: biglietti, ricevute, chiavi, dettagli.
   - Obiettivo: mostrare il DNA reale: food, alloggi insoliti, esperienze,
     valore/prezzo, luoghi salvabili.

7. **Finale — Scegli la tua traccia**
   - CTA: `Apri la mappa`, `Ricevi la prossima guida`, `Collabora con noi`.

## Rebuild Scope

### Tenere attivo subito

- `/` nuova home cinematografica.
- `/sentiero` come alias/laboratorio dell'esperienza.
- `/vieni-con-noi` se serve per bio IG/TikTok.
- `/contatti`, `/collaborazioni`, `/media-kit` solo se riallineate al nuovo tono.
- pagine legal: `/privacy`, `/cookie`, `/termini`, `/disclaimer`.

### Mettere in standby

- vecchia home editoriale;
- `Esplora`, `Shop`, `Club`, `Itinerari`, `Preferiti`;
- pagine articolo/guida se ancora basate su preview;
- sezioni con contenuto demo o asset non approvati.

Queste superfici rientrano una alla volta solo dopo redesign, contenuto reale,
SEO e QA.

## Technical Architecture

Nuove aree consigliate:

- `src/experience/home-cinematic/` — nuova esperienza home;
- `src/experience/sentiero/` — base attuale da rifinire e migrare;
- `src/pages/HomeLegacy.tsx` — archivio della vecchia home;
- `src/config/rebuildMode.ts` — eventuale flag futuro per spegnere route non pronte.

Stack gia presente:

- Three.js + React Three Fiber;
- drei;
- postprocessing;
- motion;
- GSAP + ScrollTrigger;
- Lenis;
- Playwright per audit visuale.

Non adottare nuovi tool finche una V1 non dimostra il limite dello stack attuale.
Theatre.js puo essere valutato in lab solo se serve regia camera a keyframe.

## Quality Bar

- Nessuna pagina pubblica deve sembrare demo.
- Mobile non e fallback: deve essere una story cinematografica intenzionale.
- Niente stock generico o visual non verificabili.
- Niente UI SaaS, dashboard, gradient blob, card sovraccariche.
- Ogni CTA deve avere un destino reale.
- Ogni route riattivata deve avere scopo, contenuto reale, SEO e metriche.

## Backup / Rollback

Worktree iniziale molto modificato: non usare reset o checkout distruttivi.

Rollback consigliato per questo rebuild:

- recuperare la vecchia home da `src/pages/HomeLegacy.tsx`;
- ripristinare `src/pages/Home.tsx` dal legacy file se la nuova home deve essere
  sospesa;
- mantenere `/sentiero` come rotta standalone per debug;
- usare git diff e commit piccoli quando la direzione e validata.

Esclusioni:

- non copiare `.env`, token, service account o segreti;
- non modificare `server.ts`, `firestore.rules`, `src/config/admin.ts` senza
  conferma owner.

## Fasi

### S0 — Switch controllato

- [x] salvare vecchia home in `src/pages/HomeLegacy.tsx`;
- [x] usare il Sentiero come nuova `/`;
- [x] verificare typecheck.

Verifica iniziale 2026-06-26:

- `npm run typecheck` PASS.
- `npm run build` PASS.
- `npm run audit:ui` PASS: 0 errori, 333 warning esistenti da triagiare nel
  rebuild UI.
- Playwright desktop 1280x800: canvas WebGL presente, full-screen, screenshot non
  vuoto, zero errori console, zero overflow.
- Playwright mobile 375x812: fallback/story senza canvas, screenshot non vuoto,
  zero errori console, zero overflow.
- Screenshot salvati in `.audit-screenshots/cinematic-home-desktop.png` e
  `.audit-screenshots/cinematic-home-mobile.png`.

P0 visuale emerso: il cookie banner attuale rompe l'impatto cinematografico del
primo frame. Va ridisegnato o gestito in modo piu coerente con la nuova home,
restando conforme a privacy/consenso.

### S1 — Art Direction V1

- [ ] riscrivere capitoli, copy e CTA del Sentiero;
- [ ] aggiungere note di campo e prove reali;
- [ ] ridisegnare HUD in stile editoriale/cinematografico;
- [ ] rendere il finale a 3 CTA.

### S2 — Mobile Story

- [ ] trasformare il fallback mobile in una storia verticale premium;
- [ ] controllare 320, 375, 390, 768;
- [ ] evitare canvas pesante su device piccoli.

### S3 — Cinematic Scene Upgrade

- [ ] definire oggetti principali: mappa, polaroid, telefono, taccuino;
- [ ] migliorare camera, luce, grana, transizioni;
- [ ] sostituire asset placeholder con media reali/approvati.

### S4 — Nuova Architettura Pagine

- [x] progettare e implementare nuova `Mappa delle tracce`;
- [ ] progettare nuova pagina `Posto`;
- [ ] progettare nuova `Collaborazioni`;
- [ ] progettare nuovo `Vieni con noi`;
- [ ] riattivare contenuti solo quando sono coerenti.

### S5 — Gate

- [ ] `npm run typecheck`;
- [ ] `npm run build`;
- [ ] `npm run audit:ui`;
- [ ] `npm run audit:visual`;
- [ ] smoke browser su desktop e mobile;
- [ ] aggiornare release note.

## Ultra piano v2 — direzione: "una storia, due fedeltà"

Decisione owner 2026-06-26: la storia editoriale è la base primaria su ogni
device; il WebGL diventa enhancement desktop. Content-layer condiviso, niente
doppia codebase. Esecuzione: P0 subito, poi P1-P3.

### P0 — Conversione reale (DONE 2026-06-26)

- [x] nuovo `src/experience/sentiero/SentieroLeadForm.tsx` condiviso (POST reale a
      `/api/newsletter-subscribe`, honeypot, fallback localStorage, eventi GA4) — niente
      più `alert()` finti; il backend `server.ts` NON è stato toccato (endpoint già live).
- [x] pannello finale desktop (`SentieroHud.tsx`) e mobile (`SentieroFallback.tsx`):
      CTA Mappa → `/mappa` (live), Collaborazioni → `/collaborazioni` (live), Newsletter
      → form vero.
- [x] rimossi numeri inventati: "1.200 posti" e "260.000 viaggiatori".
- [x] fix bug `L\'inizio` → `L'inizio` nel finale mobile.
- [x] verificato: `typecheck` PASS; browser mobile 390px → POST a
      `/api/newsletter-subscribe` confermato + stato di successo on-brand
      (`.playwright-mcp/sentiero-mobile-final-success.jpeg`).

### P1 — Unificazione + art direction (DONE 2026-06-26, verificato in browser)

- [x] ridisegno scena 3D (`SentieroCanvas.tsx`): rimossi sfera wireframe `WorldGlobe`,
      alone dithered, props canvas-texture (taccuino/biglietto/smartphone), frame sabbia,
      una `Sparkles`. Fotogramma unico 9:16 con passe-partout ink `#1a1512` + hairline
      terracotta. Traccia sottile + 6 waypoint terracotta. Bloom 1.1→0.55, emissive traccia
      2.4→0.8, fog ristretta, DPR cap [1,1.5], grana mantenuta. Direzione: ui-designer; impl:
      frontend-builder.
- [x] HUD card → tipografia su scrim (`SentieroHud.tsx`, ramo `active !== 5`): via il
      pannello sabbia e la card-in-card; h2 serif bianco, nota di campo a filo accent senza box,
      CTA pill unico elemento pieno.
- [x] backdrop a campo-colore astratto (`SentieroBackdrop.tsx`): blur 14→28, brightness
      0.82→0.45, scrim rinforzato — niente più "stesso reel due volte".
- [x] `AiAssistant` + `ExitIntentPopup` spenti sulla home cinematografica (`Layout.tsx`,
      gate `isCinematicHome`).
- [x] **Decisione v1 (owner 2026-06-26):** il fotogramma attivo mostra la COVER reale del
      reel (statica) e NON il video live. Il path `useVideoTexture` renderizzava nero su 4/6
      tappe (bug fragile + rischio CWV); rimosso `ActiveVideoPlane`. I reel live restano nella
      story mobile e sulle pagine destinazione. **Reel-in-movimento-3D = task v2.**
- [x] verificato in browser (desktop 1440): scena pulita, 6 tappe renderizzano la cover,
      zero frame neri, 0 errori console, typecheck + audit:ui verdi.

Nota asset (v2): alcune cover reel hanno watermark TikTok / testo baked-in — sostituire con
cover pulite via asset-curator quando si rifinisce.

### P1 residuo (non bloccante, rimandato)

- [ ] estrarre content-layer condiviso `StageCard`/`FinalPanel`/`StageMedia` (oltre a
      `SentieroLeadForm` già condiviso) per azzerare del tutto la duplicazione desktop/mobile.

### P2 — Igiene + perf (DONE 2026-06-26, verificato in browser 375px)

- [x] lazy-load video uno alla volta — **già implementato** prima di questo passaggio:
      `LazyVideo` in `SentieroFallback.tsx` monta l'MP4 solo in viewport via
      `IntersectionObserver` (`threshold 0.5`, `preload="none"`, `src` settato solo a
      `isIntersecting`), mette in pausa fuori vista. Non scarica più 4 reel insieme.
- [x] fix doppio-01 nel kicker mobile — **già risolto**: il kicker mostra il numero
      via `padStart`, e `stage.kicker.replace(/^\d+\s*\/\s*/, '')` toglie il numero
      duplicato dal testo del kicker. Verificato: tappe rendono "01 — La Scintilla" ecc.
      con un solo numero.
- [x] type leggibile — alzati gli offender sul testo di lettura nel fallback:
      label "Nota di Campo" `text-[7px]`→`text-[10px]`, corpo nota `text-[11px]`→`text-xs`
      (12px), descrizioni CTA del pannello finale `text-[10px]`→`text-[11px]`. Le
      micro-eyebrow uppercase restano 9-10px per coerenza editoriale (non sub-leggibili).
- [x] audio muto di default con toggle — `LazyVideo` ora ha stato `muted` (default on)
  - bottone tap-to-unmute in overlay (icona `Volume2`/`VolumeX`, aria-label IT) su
    ogni tappa video; si ri-muta da solo allo scroll fuori vista così non suonano due
    reel insieme. Verificato: 4 tappe video col toggle, tappe immagine senza, 0 errori
    console.

Asset noto (resta v2): alcune cover reel hanno ancora watermark/testo baked-in
(es. "RESORT 5 ECONOMICO A SHARM EL SHEIK?") — sostituire con cover pulite via
asset-curator.

### v2 — Reel in movimento nella scena 3D (DONE 2026-06-26)

Il fotogramma del mondo attivo ora mostra il **reel live** (non più solo la cover
statica). Implementazione in `SentieroCanvas.tsx` (`VideoPlane` + `StageCard`):

- **Un solo decoder alla volta**: il `VideoPlane` è montato solo sul mondo attivo
  (`isActive && media.type === 'video'`). Al cambio mondo il cleanup fa
  pause + remove + `texture.dispose()` → un solo reel decodifica. Verificato:
  count video sempre ≤ 1 in tutto il percorso; reel-1 smontato quando reel-3 entra.
- **Niente `useVideoTexture` di drei**: cachea i video via suspend-react e li lascia
  in play dopo lo smontaggio (tutti i reel visti continuerebbero a decodificare).
  Gestiamo l'elemento `<video>` a mano (`new THREE.VideoTexture`).
- **StrictMode-safe**: video+texture in `useMemo`, cleanup che NON azzera il `src`
  (altrimenti al doppio-invoke dell'effect il video tornava morto → `rs:0`).
- **`texture.needsUpdate = true` ogni frame**: il video è off-screen (`opacity:0`) e
  non viene composto, quindi il `requestVideoFrameCallback` interno di `VideoTexture`
  non scatta e la texture resterebbe **nera**. Forzare l'upload del frame decodificato
  risolve. (Causa-radice del black-frame che aveva fatto rinviare il task in v1.)
- **Niente nero all'ingresso**: finché `readyState < HAVE_CURRENT_DATA` il piano video
  sta dietro la cover (la cover fa da poster, lo occlude), poi passa davanti
  (`position.z`, che non confligge col clipping del `StageCard`).
- **La card attiva non si sfuma mai**: il fade anti-clipping vale solo per i mondi
  non attivi — su certe tappe spegneva a nero proprio la card attiva (la più vicina).
- **Cover-fit 9:16**: il reel riempie il fotogramma 3:4 ritagliando alto/basso
  (no stiramento), e taglia parte del watermark in fondo.

Verifica browser (vite puro `localhost:5191`, desktop 1440): stage 02 (reel-1) e
stage 04 (reel-3) mostrano frame live diversi nel tempo (rs:4, currentTime avanza),
stage 01/06 (immagine) mostrano la foto/cover senza video, 0 frame neri.
`typecheck` + `eslint --max-warnings=0` verdi.

Resta v2 (asset): cover/reel con watermark baked-in (TikTok, "NELLA TERRA",
"NON CI SI ANNOIA", "POI") — sostituire con clip pulite via asset-curator.

### P3 — SEO + route (DONE 2026-06-27, verificato in browser)

- [x] dedup `/` vs `/sentiero` + canonical: la rotta `/sentiero` ora redirige a `/`
      (`<Navigate to="/" replace />` in `App.tsx`); rimosso il file morto `src/pages/Sentiero.tsx`
      e il lazy import. Nessun link interno puntava a `/sentiero`; non era in sitemap. Un solo URL
      indicizzabile con canonical `https://travelliniwithus.it/`.
- [x] h1 visibile reale: il wordmark "Travelliniwithus" nel `SentieroPortal` è ora un `<h1>`
      visibile (era `<motion.div>`), con coda `sr-only` " — le tracce dei posti che proviamo davvero"
      per dare testo descrittivo ai crawler. Demosso l'h1 `sr-only` in `SentieroExperience` per
      evitare due h1. Il fallback mobile aveva già un h1 visibile (branch separato → nessun doppio h1).
- [x] `<title>` stabile: niente muta `document.title` durante l'esperienza; dopo il dedup resta
      un solo title su `/` ("Le Tracce — viaggi reali e posti particolari | Travelliniwithus").
- [x] verificato (Playwright, desktop 1280): `/sentiero` → `/`; esattamente 1 h1 visibile
      (450×60px) col testo descrittivo; title stabile; canonical `/`; robots `index, follow`;
      0 errori console (resta un warning THREE.Clock deprecation preesistente); typecheck +
      eslint + audit:ui (0 errori) verdi.

Hardening opzionale (non fatto, fuori scope default-thread): un redirect 301 server-side per
`/sentiero` in `server.ts` sarebbe più robusto del redirect client per i crawler. `server.ts` è
file high-risk → richiede `travellini-backend-engineer` + conferma owner. Il redirect client
attuale è sufficiente (rotta non in sitemap, Google segue i redirect JS coerenti).
