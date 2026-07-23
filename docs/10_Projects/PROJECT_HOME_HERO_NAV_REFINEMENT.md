---
type: project
area: product
status: in-progress
priority: p1
owner: codex
repo: TRAVELLINIWITHUS
route: /home
repo_path: src/components/home/HeroSection.tsx
related: '[[10_Projects/PROJECT_TRAVELLINIWITHUS_SITE]]'
source: hero redesign and navbar refinement
tags:
  - project
  - ui
  - product
---

# PROJECT_HOME_HERO_NAV_REFINEMENT

## Superseded by cinematic rebuild — 2026-06-26

Decisione owner: la homepage editoriale precedente viene messa in archivio e il
Sentiero diventa la nuova home esperienziale del sito. Il lavoro futuro e
tracciato in [[PROJECT_CINEMATIC_REBUILD_HOME_2026]].

La vecchia home e conservata in `src/pages/HomeLegacy.tsx` come riferimento da
cui recuperare componenti, contenuti e logiche utili senza tenere quella
struttura come esperienza pubblica principale.

## Obiettivo

Rendere la homepage piu chiara, editoriale e orientata alla conversione, portando in primo piano la coppia Rodrigo & Betta e semplificando la navigazione dell'archivio.

## Contesto

La homepage precedente aveva troppe sezioni, statistiche duplicate e tre voci di navigazione che puntavano allo stesso archivio editoriale con filtri diversi. La nuova struttura concentra la conversione su:

- esplorazione contenuti
- iscrizione newsletter
- collaborazioni e media kit

## Repo context

- route: `/`
- repo_path: `src/components/home/HeroSection.tsx`
- repo_path secondario: `src/components/Navbar.tsx`
- repo_path secondario: `src/components/home/CoupleIntro.tsx`
- repo_path secondario: `src/components/home/HomeDiscoveryCards.tsx`
- repo_path secondario: `src/components/home/HomeLeadMagnet.tsx`
- repo_path secondario: `src/components/home/MonetizationTeaser.tsx`

## Focus attuale

- [x] rimuovere stat cards e trust pills dalla hero
- [x] rifinire hero con promessa editoriale piu precisa
- [x] aggiungere sezione di orientamento subito dopo hero
- [x] sostituire la vecchia sezione di orientamento con `HomeDiscoveryCards` premium
- [x] inserire `CoupleIntro` dopo la hero
- [x] trasformare `CoupleIntro` in manifesto del metodo Travellini
- [x] aggiungere standard del metodo: provato sul posto, foto reali, consigli utili
- [x] spostare newsletter a meta pagina dentro wrapper dark
- [x] rimuovere i componenti homepage legacy non piu usati
- [x] semplificare la nav principale in `Esplora`, `Risorse`, `Collaborazioni`, `Chi siamo`
- [x] nascondere il carrello quando non ci sono item
- [x] pass grafico senior: radius piu controllati, meno ombre, gerarchia editoriale piu netta
- [x] pass clean/modern: rimossi controlli finti, CTA duplicate e testo non necessario
- [x] pass mobile 2026-05-24: nascosta la card reel e il micro-link B2B nella hero mobile per far arrivare prima la discovery
- [x] copy discovery reso piu concreto: scelta per luogo o ritmo invece di metafora "libreria"
- [x] layout articoli stabilizzato quando esiste un solo contenuto pubblicabile
- [x] immagini home principali convertite da PNG a WebP dove gia disponibile
- [x] pass grafico conversione 2026-05-24: aggiunto lead magnet editoriale con mockup PDF e form newsletter compatto
- [x] pass grafico mappa 2026-05-24: sostituito teaser generico con blocco visuale "Mappa editoriale"
- [x] riallineato `Newsletter` con opzione `stacked` per form compatti dentro card strette
- [x] asset demo AI per lead magnet salvato in `public/images/lead-magnets/` e usato come copertina preview
- [x] contenuti demo aggiunti alla mappa editoriale per simulare percorsi e filtri futuri
- [x] controlli floating secondari nascosti su mobile per non coprire contenuti e CTA durante la lettura
- [x] rimossi quiz viaggio e budget viaggio dalla homepage e dal percorso pubblico
- [x] hero 10/10 pass 2026-05-24: rimossa card reel dalla prima piega, copy accorciato, CTA sopra overlay cookie, proof line piu editoriale
- [ ] verificare composizione finale hero su desktop
- [ ] verificare navbar desktop su viewport laptop e wide
- [ ] verificare scroll orizzontale chip su mobile

## QA

- controllare viewport desktop ampia
- controllare viewport laptop standard
- verificare che il reel non rubi attenzione al titolo
- verificare che i CTA siano bilanciati
- controllare mobile 390px
- eseguire `npm run typecheck`
- eseguire `npm run build`
- eseguire `npm run audit:ui`

## Snapshot 2026-04-14

- hero home resa piu netta sulla promessa: posti particolari, informazioni utili, prova reale
- aggiunto sotto-hero con tre traiettorie chiare: scoperta, strumenti, collaborazioni
- `CoupleIntro` spostata ancora di piu sul metodo e meno sulla semplice biografia
- newsletter home resa piu desiderabile e meno marketing-driven nel tono
- CTA finale B2B della home allineata al nuovo funnel `Collaborazioni` -> `Media Kit`

## Architettura homepage definitiva

Ordine sezioni:

1. `HeroSection`
2. `HomeDiscoveryFinder`
3. `CoupleIntro`
4. `HomeLeadMagnet`
5. `HomeTrustStrip`
6. `HomePartnerSignal`
7. `LatestArticles`
8. `InstagramGrid`
9. `NewsletterFeature`
10. `MonetizationTeaser`
11. `HomeCollaborationCta`

Ritmo visuale: hero immersiva, finder utile, metodo umano, conversione soft, proof,
partner, magazine, community, newsletter, mappa, B2B.

## Rimozione quiz/budget - 2026-05-24

Decisione: quiz viaggio e budget viaggio non sono piu parte del percorso pubblico. La
homepage deve portare verso archivio, mappa, lead magnet, newsletter e collaborazioni,
senza strumenti che distraggono dal posizionamento editoriale.

- rimosso `HomeQuizBudgetTeaser` dalla homepage
- `/strumenti` resta una pagina di supporto con calendario, builder itinerario e mappa
- `/quiz` viene reindirizzato a `/esplora`
- tolti riferimenti a quiz/calcolatore da assistente demo, Club, PDF lead magnet,
  sitemap e file `llms-full.txt`

## Hero 10/10 pass - 2026-05-24

Decisione: la hero deve far vincere H1, immagine e CTA primaria. La card
"Ultimo reel Instagram" era coerente col brand, ma in prima piega competeva
troppo con la promessa principale.

- rimossa la colonna reel dalla hero: Instagram resta nelle sezioni successive
- copy hero ridotto a una promessa piu concreta e leggibile
- proof point trasformati in riga editoriale sobria, non pill/card
- CTA secondaria "Ultime guide" nascosta su mobile per non comprimere il primo fold
- micro CTA B2B rimossa dalla hero: il percorso resta nella navbar e nelle sezioni dedicate
- mobile riallineato al centro per mantenere "Apri Esplora" visibile anche con banner cookie

## Pass grafico conversione e mappa - 2026-05-24

Decisione: migliorare la percezione premium senza inventare prove finte. Niente volti AI
di Rodrigo & Betta e niente loghi partner inventati; le parti generate sono trattate come
mockup/editorial UI.

- aggiunto `HomeLeadMagnet` dopo `CoupleIntro`: promessa concreta, mockup PDF, chip di contenuto e form newsletter dedicato
- il form newsletter supporta `stacked` per non comprimere input e CTA nelle card strette
- generato asset demo AI per la copertina del lead magnet, senza persone, loghi o prove finte
- sostituito `MonetizationTeaser` con una scena "Mappa editoriale": immagine locale, route overlay, marker e card di orientamento
- arricchita la mappa con percorsi demo plausibili, da sostituire poi con contenuti reali
- nascosti trigger assistente AI e back-to-top sotto `md` per evitare sovrapposizioni su mobile
- verificato desktop e mobile: lead magnet leggibile, mappa senza overflow, CTA primaria visibile
- prossimo miglioramento grafico utile: asset dedicato reale/AI controllato per il PDF lead magnet e contenuti reali dentro la mappa

## Audit marketing homepage - 2026-05-28

Decisione: la home deve evitare qualsiasi linguaggio pubblico da staging. Le sezioni di
conversione devono sembrare parte del prodotto editoriale, non una demo interna.

- aggiornato `HomeLeadMagnet`: promessa piu concreta, niente "demo/prodotto finale", bullet di valore e CTA piu chiara
- aggiornata `/vieni-con-noi`: rimossi riferimenti a demo, preview e contenuti provvisori nel copy pubblico
- aggiornata la mappa editoriale: niente "percorsi demo", CTA piu specifica e heading meno hero-scale
- aggiornata la trust strip: `500K` diventa `reach mensile`, non "lettori al mese"
- aggiornato `HomePartnerSignal`: posizionamento B2B piu selettivo e orientato al fit
- nota QA: restano da verificare mobile 320/375 e gerarchia completa homepage con audit visuale

## Audit full-site marketing/SEO - 2026-05-29

Decisione: separare con piu rigore pagine indicizzabili, superfici in lavorazione e funnel privati.
La sitemap non deve promuovere URL `noindex` o aree revenue non ancora consegnabili.

- rimossi dalla sitemap statica `/itinerari`, `/itinerari/compare`, `/shop` e `/lead-magnet`
- `/itinerari` ora e `noindex` finche resta basata su itinerari in lavorazione
- `/lead-magnet` richiede sblocco post-submit in sessione e rimanda a `/vieni-con-noi` se aperta direttamente
- newsletter con source `lead_magnet` sblocca il download e mostra link "scarica subito il PDF" nel success state
- `/contatti` legge `topic` e `prodotto` dai query param per non perdere l'intento dai funnel
- `Club` ha ancora waitlist, ma ora ancora corretta `#club-pricing`, piano selezionato e copy "accesso al lancio"
- `MediaKit` ha CTA hero verso il form e form prima della preview su mobile
- corretti title SEO troppo lunghi e rimosso il suffisso parziale `Travellini` da `/esplora`
- rimosso `tracking-tight` dai display title globali e reso `Button` piu tollerante ai CTA lunghi su mobile

### Closeout full-site funnel - 2026-06-03

- `/shop` passa da catalogo fallback multiprodotto a lista d'attesa con un solo SKU prioritario, filtri nascosti quando il catalogo e in lavorazione e newsletter `shop_waitlist_first_product`
- `/risorse` mostra una label commerciale vicino a ogni risorsa: `Affiliato`, `Non affiliato` o `Codice sconto`
- `/collaborazioni` non spinge piu il PDF diretto in hero: manda alla preview del media kit e traccia `media_kit_preview_click`
- `/press` non presenta piu bundle come download immediati: anteprima consultabile e materiali completi su richiesta
- navbar desktop posticipata a `xl` per evitare affollamento tra 1024 e 1180px; tablet usa menu compatto
- `npm run typecheck` PASS dopo il blocco

### Decisione full-mode - 2026-06-03

Decisione owner: il sito deve lavorare in full-mode, non in lite mode.

- `.env` e `.env.example` portati a `VITE_LITE_MODE=false`
- `Esplora`, `Shop`, `Club`, `Preferiti` e itinerari restano navigabili nel percorso pubblico
- `Club` riallineato a pre-lancio credibile: non promette checkout live, ma mostra valore, waitlist e stato reale del catalogo
- area autenticata del Club non chiama piu ogni login "membro": diventa area personale con preferiti, acquisti e futuri accessi Club
- FAQ Club riscritta per waitlist/pre-lancio: nessun pagamento, nessun rinnovo, nessun regalo promesso prima del checkout
- `npm run typecheck` PASS

## Decisione homepage V3

Direzione: premium editoriale semplice. La homepage deve essere una porta d'ingresso utile,
non una dashboard.

- la hero risponde in pochi secondi a chi siete, cosa trova l'utente, da dove iniziare e perche fidarsi
- se `FEATURED_REEL.url` o `FEATURED_REEL.thumbnail` sono vuoti, la hero non mostra un telefono finto con la stessa immagine della hero
- il fallback desktop diventa una proof rail testuale con community, destinazioni e anni di viaggio
- `HomeDiscoveryCards` sostituisce la chip strip: due card principali (`Destinazioni`, `Esperienze`) e scorciatoie curate
- riferimento utile: Tripp theme usa una logica efficace di pannello guida + card compatte; adottiamo la struttura, non il look completo
- la sezione esplora usa un pannello scuro "Per luogo" con griglia destinazioni e un pannello chiaro "Per esperienza" con card esperienza
- le mini-card usano configurazioni riutilizzabili: `destinationVisuals.ts` e `experienceContent.ts`
- `CoupleIntro` diventa il manifesto del metodo Rodrigo & Betta, con tre standard concreti
- `LatestArticles` resta massimo 3 contenuti: un featured e due secondari
- B2B resta visibile, ma sotto forma di micro-link nella hero e fascia finale scura

## Pass grafico senior

Decisione: evitare una homepage "ricca" solo per quantita. Il livello premium arriva da
gerarchia, proporzioni e controllo dei dettagli.

- hero meno dispersiva su laptop: CTA piu editoriali, proof line separata e B2B secondario
- discovery ispirata al riferimento Tripp: pannello guida + griglia card compatte
- card con radius contenuto e hover sobri, niente ombre pesanti
- metodo piu manifesto: eyebrow tecnico, titolo grande, foto con caption pulita
- editoriale piu magazine: badge squadrati, massimo tre contenuti, meno effetto blog

## Pass clean/modern

Decisione: mantenere il carattere visuale, ma togliere ogni elemento che sembra demo o decorazione.

- la card reel resta, ma senza controlli finti audio/pausa
- la discovery mantiene la struttura Tripp-like, ma con copy piu corto e una sola azione chiara
- i numeri nel metodo diventano una riga di prova sobria, non un secondo blocco statistiche
- l'editoriale riduce padding e testo nelle card, puntando su gerarchia e immagine

## Sessione Esplora P0 - 2026-05-15

Intervento eseguito su navigazione e discovery:

- `Esplora` ora include anche la mappa visuale e resta attivo su `/mappa`
- la CTA home discovery verso l'archivio non usa piu `?search=` perche la pagina destinazioni non implementa una ricerca inline
- la ricerca globale traccia apertura e no-results e non promette piu navigazione con frecce non implementata
- rimossi preload globali delle immagini home da `index.html`; i preload restano route-specifici in `Home`
- rimosso il caricamento esterno del font script Kalam per evitare 404 in console

## Decisione homepage V2

Direzione: editoriale pulita, utile all'utente finale e coerente con un brand creator people-led.

- la hero deve rispondere subito a chi siete, cosa raccontate e perche fidarsi
- `HomeDiscoveryCards` diventa il primo strumento utile: luogo, esperienza, ricerca
- `CoupleIntro` spiega il metodo, non solo la biografia
- gli articoli arrivano dopo l'orientamento, in stile magazine
- la newsletter resta umana e leggera
- il finale unisce social proof e invito B2B

## Decisione navigazione

La voce `Destinazioni` diventa `Esplora` e raggruppa:

- `Inizia da qui`: `/esplora` come finder editoriale centrale
- `Per luogo`: `/destinazioni` e filtri da `DESTINATION_GROUPS`
- `Per esperienza`: `/esperienze` e filtri da `EXPERIENCE_TYPES`
- `Guide` e `Mappa visuale`: percorsi specializzati collegati al finder

Le voci `Guide`, `Esperienze` e `Shop` non compaiono piu nel menu principale. Le route restano disponibili per accesso diretto o collegamenti contestuali.

## Sessione Esplora 10/10 - 2026-05-15

- aggiunta route `/esplora` come porta centrale tra destinazioni, esperienze, guide e mappa
- la navbar principale punta a `/esplora` e resta attiva anche su `/destinazioni`, `/esperienze`, `/guide`, `/mappa`
- home discovery traccia `home_discovery_click` su card luogo, esperienza e guide
- search globale include risultati diretti verso finder, gruppi destinazione e tipi esperienza
- conversione soft: lead magnet, newsletter, risorse e collaborazioni restano contestuali, non invasive

## Sessione Esplora 10/10 — closeout 2 (2026-05-15)

Closeout dei P1/P2 lasciati aperti dalla sessione precedente:

- **Mega menu Esplora** ricomposto come decisione editoriale invece di lista
  enciclopedica. Le voci "Per luogo" e "Per esperienza" ora mostrano solo
  3-4 picks editoriali (Italia/Europa/Asia · Posti particolari/Food/Hotel/Weekend)
  con un "Tutte" finale per scendere nell'archivio completo. Aggiunta colonna
  "Strumenti" che raggruppa Guide/Itinerari/Risorse — toglie l'iperestensione
  dei link enciclopedici e accelera la scelta in 1 click.
- **SearchModal raggruppata**: i risultati appaiono ora in sezioni separate
  (Luoghi, Esperienze, Percorsi consigliati, Articoli e guide, Pagine) con
  ordine editoriale e fallback "Altri risultati" per categorie non mappate.
- **Mappa con filtri Esperienza** in aggiunta al continente: l'utente può
  isolare Posti particolari / Food / Hotel / Guide / Weekend e poi salire
  verso `/destinazioni` con i filtri già passati nell'URL.
- **Newsletter contestuale /guide**: `source` dinamico per categoria e
  `ctaLabel` adattivo ("Ricevi le prossime guide su {Categoria}").

## Asset e configurazione

- `/public/images/brand/couple-travel.png`: placeholder AI di coppia in viaggio. Sostituire con foto reale di Rodrigo & Betta.
- `/public/images/hero-amalfi.png`: hero Costiera Amalfitana generata AI. Valutare se sostituire con foto reale.
- `/public/images/destinations/`: 6 immagini destinazioni generate AI (Dolomiti, Puglia, Toscana, Sardegna, Islanda, Giappone).
- `/public/images/experiences/`: 4 immagini esperienze generate AI (Gastronomia, Avventura, Romantico, Insolito).
- `FEATURED_REEL.url`: intenzionalmente vuoto; quando sara presente uno shortcode reale Instagram, la hero renderizzera l'embed desktop.
- `FEATURED_REEL.thumbnail`: campo previsto per aggiornamento manuale futuro.

## Sessione Antigravity - Visual Identity (2026-04-14)

Lavoro eseguito con Antigravity su Sprint Visual Identity:

- generati 12 asset visivi AI premium e salvati in `public/images/`
- aggiornati `destinationVisuals.ts`, `experienceContent.ts`, `demoContent.ts` per usare immagini locali
- aggiornato `HeroSection.tsx`: hero Amalfi + reel fallback Sardegna
- aggiornato `CoupleIntro.tsx`: foto coppia AI locale
- aggiornato `LatestArticles.tsx`: 3 articoli demo (Dolomiti, Puglia, Toscana)
- **redesign completo `CommunitySection.tsx`**: griglia Instagram 4x2, stats animati, social CTAs
- verifiche: `typecheck` zero errori, `vite build` successo, visual check tutte le sezioni OK

Prossimi step: pagine interne (ChiSiamo, Collaborazioni, MediaKit, Contatti), fix form, Shop, SEO.

## Hero 10/10 pass — 2026-05-24

Rifinitura hero richiesta dall'owner ("voglio una hero da 10/10"), su direzione
`travellini-ui-designer`. Immagine coppia mantenuta (scelta owner: brand
people-led), resa più leggibile invece di sostituirla con foto-luogo.

Cambi in `HeroSection.tsx`:

- H1: scala fluida `clamp(2.75rem, 6vw + 0.5rem, 7.5rem)` (no più step
  `text-5xl→8xl`), `leading-[1.02]` mobile → `lg:leading-[0.95]`,
  `tracking-[-0.01em]`, `[text-wrap:balance]`, `max-w-[15ch]` (2 righe
  bilanciate), drop-shadow alleggerito 0.45 → 0.35.
- Eyebrow: da 10px/bold/0.24em a `text-xs sm:text-sm`/`font-semibold`/0.18em
  - micro drop-shadow (era il testo più debole della prima piega).
- Scrim desktop ammorbidito: picco sinistro 0.82 → 0.74 così la coppia a
  destra non finisce nel nero. Fondo mobile 0.84 → 0.88. Aggiunto micro-scrim
  dal basso (h-1/3) per proteggere la proof line senza scurire il centro.
- CTA: secondaria "Ultime guide" da bottone bordato pari-grado a link ghost
  (no min-w, no border) → la primaria accent domina. Aggiunto micro-link di
  fuga mobile "Oppure leggi le ultime guide" (sotto la primaria, sm:hidden).
- Proof strip: ora visibile anche su mobile (riga inline ·-separata short),
  griglia desktop invertita value-first (dato grande sopra, label occhiello
  sotto).
- Motion: wipe clip-path 1.4s → 1.0s, delay stagger compressi
  (0.35→0.2 … 0.62→0.56), atterraggio intro ~1.1s.
- `HeroBackdrop.tsx`: rimosso
  `saturate-[1.04]` (look "stock vivido"), tenuto `brightness-[0.96]`.

Verifiche:

- `npm run typecheck` PASS.
- Verifica browser reale via Chrome DevTools MCP (Playwright era lockato):
  - Desktop 1280: H1 2 righe bilanciate, coppia leggibile, scrim morbido,
    CTA primaria dominante, proof value-first. PASS.
  - Mobile 375: zero overflow, H1 2 righe senza taglio, "Apri Esplora" in
    prima piega, micro-link fuga presente, proof inline ·-separata,
    secondario nascosto. PASS.
  - Tablet 768: layout sm+ corretto, nessun overflow. PASS.
  - Console: zero errori/warning, nessun 404 immagini hero. PASS.

Pass rifinitura "best of best" (stessa sessione, verificato a schermo):

- H1 clamp ridotto da `6vw+0.5rem,7.5rem` (120px a 1280, 3 righe che invadevano
  la coppia) a `5vw+1rem,6rem` (~80px a 1280, 2 righe calme) — più on-brand
  (calm editorial, non magazine-cover aggressivo).
- Spazio insecabile (U+00A0) tra "che" e "valgono" in `HERO_TITLE`: il wrap
  ora cade dopo "particolari" su tutti i breakpoint ("Posti particolari / che
  valgono davvero."), niente pronome "che" orfano a fine riga.
- Label proof METODO/FOCUS/FILTRO da `white/45` a `white/55` (più leggibili).
- Link ghost "Ultime guide": underline animato (scale-x 0→1) su hover.
- Ricontrollato 1280/375 a schermo + console pulita.

## Nav IA cleanup — 2026-05-24

Audit navbar vs rotte reali (decisioni owner):

- Rimosso il duplicato top bar: la voce centrale "Collaborazioni" puntava a
  `/collaborazioni` come la pill "Collabora con noi". Tenuta solo la pill;
  voce centrale rimossa. Media Kit ora raggiungibile via footer + pagina
  `/collaborazioni`.
- Footer: aggiunti **Club** (colonna Scopri) e **Press** (colonna Progetto).
  `/press` era orfana (nessun link interno) — ora raggiungibile.
- Rinominato footer "Risorse di viaggio" → **"Cosa usiamo"** (toglie la
  collisione di nome con "Strumenti": tool interattivi vs affiliate).

### Verifica Shop/Club a schermo → decisione nav (2026-05-24)

Verificate `/shop` e `/club` nel browser: **entrambe pre-lancio con un buco
di contenuto vuoto.**

- `/shop`: griglia prodotti totalmente vuota, carrello disabilitato, banner
  "boutique in apertura". Header + sezioni editoriali presenti, ma 0 prodotti.
- `/club`: prezzi (€5,90/mese · €49/anno) + FAQ + login presenti, MA checkout
  in waitlist ("avvisami al lancio") e anteprima guida ("prime 200 parole")
  non renderizzata → grande vuoto bianco.

Principio: una voce di nav è una promessa; una pagina vuota dietro rompe la
fiducia. Decisione iniziale era toglierle dalla top nav — **rovesciata
dall'owner: Shop + Club restano in top nav.** Di conseguenza i due empty-state
sotto diventano prioritari (la promessa di nav DEVE essere mantenuta).

Top nav finale: **Esplora · Strumenti · Shop · Club · Chi siamo** + pill
"Collabora con noi".

### Bug aperti (pre-lancio, da fixare prima di ri-promuovere)

- [x] `/shop`: griglia prodotti vuota mitigata — pagina convertita in waitlist
      con un solo SKU prioritario e carrello disabilitato finche il file non e pronto.
- [ ] `/club`: anteprima guida ("prime 200 parole") non renderizzata sotto
      "Le guide del Club sono lunghe, lente, dettagliate" — buco bianco.

- `npm run typecheck` PASS, navbar verificata a schermo a 1280 (3 voci + pill).

## Audit visivo/copy/contenuti — 2026-06-07

Audit full-site (grafica/estetica/copy/contenuti/immagini/conversione) con 4
specialisti in parallelo + verifica browser. Report completo:
[[PROJECT_VISUAL_COPY_CONTENT_AUDIT]].

Fix sicuri implementati che toccano la home (typecheck/build/audit:ui/browser PASS):

- `HomeEditorialPromise`: rimosso `twu-dot-grid` decorativo, corretta animazione
  "morta" (`initial opacity:1` → vero fade), eyebrow tracking `0.36em → 0.3em`.
- `HomeLeadMagnet`: rimosso blob `blur-2xl` arancione (anti-DESIGN.md).
- `HomeFeaturedDestinations`: eyebrow `0.32em → 0.3em`, alt descrittivi per regione
  (campo `alt` dedicato).
- `LatestArticles` + `InstagramGrid`: H2 sezione `md:text-4xl → md:text-5xl`
  (coerenza scala); InstagramGrid alt fedeli all'immagine (la caption descriveva
  luoghi non mostrati dai placeholder brand).
- `NewsletterFeature`: rimossi hover-color/border su `<li>` non interattivi.
- `CoupleIntro` + `MonetizationTeaser`: refusi di encoding (accenti) + "150+".

Aperti per la home (DA-APPROVARE, vedi report): consolidare i 3 discovery ridondanti,
fondere le due sezioni partner, sostituire mappa finta del MonetizationTeaser e mockup
costruito a mano del lead magnet con asset reali, conteggi "N racconti" non verificabili,
trust badge accanto ai form. Blocco #1 invariato: foto reali R+B (hero people-led ancora
su asset AI riciclati).

## Link

- [[PROJECT_VISUAL_COPY_CONTENT_AUDIT]]
- [[OBSIDIAN_DASHBOARD]]
- [[TRAVELLINIWITHUS_EXECUTION_PLAN]]
- [[AGENT_WORKFLOWS]]

## Semplificazione navbar editoriale — 2026-07-23

- Ridotte le voci B2C a due assi distinti: `Mete` per la navigazione geografica e `Guide e racconti` per la navigazione editoriale.
- Rimossa la voce autonoma `Esplora`, perché duplicava l'accesso agli stessi contenuti di `Guide e racconti`.
- Il menu editoriale ora raccoglie `Guide`, `Itinerari`, `Racconti` e `Tutti i contenuti`.
- La sequenza principale diventa `Mete · Guide e racconti · Mappa · Chi siamo`.
- La CTA reader passa da `Vieni con noi` a `La guida in regalo`: la landing esplicita il funnel newsletter e usa `Ricevi la prima guida` come azione finale.
- La landing reader viene riposizionata su `/italia-nascosta` (slug poi sostituito da `/guida-in-regalo` nel rework sotto — vedi sezione successiva); `/vieni-con-noi` e `/iscrivi` restano redirect compatibili. La pagina è breve e focalizzata sulla prima guida: 10 destinazioni particolari, nessun nome anticipato e un solo funnel newsletter.

## Rework funnel lead magnet — slug + naming + imagery — 2026-07-23

Rework completo su handoff `seo → ui → asset → frontend` (vedi
`docs/50_Scratch/HANDOFF_lead-magnet-rework_*.md`). Slug definitivo
`/guida-in-regalo` (la CTA navbar "La guida in regalo" ora coincide
verbatim con lo slug — label invariata, solo il target cambia).
`/italia-nascosta`, `/vieni-con-noi`, `/iscrivi` diventano tutti e tre
redirect diretti a `/guida-in-regalo` (nessuna catena doppia).

- Naming disaccoppiato: TITOLO invariato ("Alla scoperta dell'Italia
  nascosta"), nuovo DESCRITTORE unico ("10 posti provati e consigliati da
  noi") sostituisce le 5 varianti frammentate su landing, teaser home,
  popup, download page e welcome email.
- Cover del lead magnet: niente più placeholder demo. Route B (craft
  tipografica) — riusa la texture carta dell'Atlante (`atlante-carta-tile`)
  invece di una foto, perché nessuno dei 10 posti reali della guida ha uno
  scatto certificato in libreria. Un solo componente (`LeadMagnetCover`,
  `src/components/LeadMagnetCover.tsx`) su landing, teaser home e thumbnail
  popup.
- Hero `hero-amalfi.webp` rimosso dalla landing `/guida-in-regalo`:
  contraddiceva la promessa "non ovvio" (la guida esclude esplicitamente
  Amalfi standard) e creava un doppio candidato LCP con la cover.
- `HomeLeadMagnet` consolidato: via il form `<Newsletter>` embedded, via i
  chip con nomi di luogo reali (non presenti nei 10 posti veri — errore
  fattuale, non solo di posizionamento), un solo CTA verso la landing.
- `ExitIntentPopup` ora è gated al 100%: rimosso il download PDF diretto
  ungated. Bug corretto: `source` passava `"exit_intent_popup"` (non
  sbloccava nulla in `Newsletter.tsx`, che richiede la sottostringa
  `lead_magnet`) → ora `"lead_magnet_exit_popup"`.
- Token analytics (`source`/`content_id`/`cta_id`) resi evergreen
  (`lead_magnet_landing_*`, `lead_magnet_guida`), disaccoppiati da slug e
  titolo così un futuro rename non forka la metrica di conversione.
- Dettaglio completo, deviazioni e stato check:
  `docs/50_Scratch/HANDOFF_lead-magnet-rework_frontend_to_gate.md`.
