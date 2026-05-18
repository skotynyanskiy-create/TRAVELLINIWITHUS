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
2. `HomeDiscoveryCards`
3. `CoupleIntro`
4. `LatestArticles`
5. `Newsletter` dentro wrapper dark
6. `CommunitySection` come social strip compatta

Ritmo visuale: dark, white, sand, white, dark/sand, dark.

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

## Link

- [[OBSIDIAN_DASHBOARD]]
- [[TRAVELLINIWITHUS_EXECUTION_PLAN]]
- [[AGENT_WORKFLOWS]]
