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

- `Per luogo`: `/destinazioni` e filtri da `DESTINATION_GROUPS`
- `Per esperienza`: `/esperienze` e filtri da `EXPERIENCE_TYPES`

Le voci `Guide`, `Esperienze` e `Shop` non compaiono piu nel menu principale. Le route restano disponibili per accesso diretto o collegamenti contestuali.

## Asset e configurazione

- `/public/rodrigo-betta.jpg`: mancante; `CoupleIntro` usa un placeholder temporaneo.
- `FEATURED_REEL.url`: intenzionalmente vuoto; quando sara presente uno shortcode reale Instagram, la hero renderizzera l'embed desktop.
- `FEATURED_REEL.thumbnail`: campo previsto per aggiornamento manuale futuro.

## Link

- [[OBSIDIAN_DASHBOARD]]
- [[TRAVELLINIWITHUS_EXECUTION_PLAN]]
- [[AGENT_WORKFLOWS]]
