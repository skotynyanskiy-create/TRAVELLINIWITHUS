---
title: Homepage "Diario delle Tracce" — design
type: spec
status: draft-for-review
area: product
route: /
created: 2026-07-21
related:
  - '[[10_Projects/PROJECT_CINEMATIC_REBUILD_HOME_2026]]'
  - '[[13_Content/INSTAGRAM_CONTENT_AUDIT_2026-07-21]]'
---

# Homepage "Diario delle Tracce" — design

## 1. Problema

La homepage cinematografica attuale (`src/components/home/cinematic/CinematicHomepage.tsx`)
ha una buona ossatura narrativa a taccuino, ma tradisce la promessa del brand:
usa immagini **AI** che fingono Rodrigo & Betta e inventano luoghi, con didascalie
che dichiarano "generata". Il brand vive di "ci siamo stati, l'abbiamo provato" —
illustrarlo con persone e posti inventati smonta la tesi nel primo secondo.

In parallelo, l'owner (webmaster, senza token Instagram Graph API) si sente in
stallo: vuole un sito **creativo, moderno E utile** — non solo un bel racconto,
ma uno strumento per organizzare viaggi e trovare spunti da Travellini.

## 2. La svolta — il materiale reale esiste già

Verificato il 2026-07-21:

- **Nessun token necessario.** I contenuti sono pubblici e del brand stesso. Con
  `yt-dlp` (open-source, nessun sito terzo, nessun login) si scaricano i reel del
  profilo: video + caption integrali + cover ufficiale. Testato: 8/8 reel top
  dell'audit scaricati.
- **Le foto reali di R&B ci sono**, dentro le cover/frame dei reel. Verificato a
  vista: Betta nella sala "Alice" del Burton Juice (Somma Vesuviana), Rodrigo al
  glamping di Bled. Persone vere, luoghi veri, con il cartello editoriale del brand
  (domanda-hook + località) già sopra.
- **40 Tracce curate** in `src/data/content-seed.json`: hook, descrizione, città,
  regione, **coordinate GPS reali**, tipologia, partnership. Manca solo la foto —
  e in un taccuino una scheda-luogo tipografico-cartografica è comunque completa.
- **La formula del brand è nelle caption**, misurata dall'audit:
  `👇 DOMANDA IN MAIUSCOLO 👇` → reveal del posto → dettagli concreti (prezzo,
  dove, quando) → domanda finale. Questa è voce vera, non inventata.
- **Screenshot profilo** (`@travelliniwithus`, verificato, 172K, "VIAGGIA CON NOI")
  come prova reale per il capitolo "Noi", senza ritratti fabbricati.

Inventario asset v1 (reali, disponibili ora): 5 reel già in repo + 8 reel top
scaricati = **13 reel reali**; 40 Tracce con GPS; 1 screenshot profilo.

## 3. Concept

**"Il Reel quando hai tempo di leggerlo davvero."**

Il sito è la versione leggibile e utile della formula che già funziona su Instagram.
Chi arriva dai social riconosce il ritmo; chi arriva dal sito capisce perché
funzionano. Due strati in un solo oggetto:

- **Il Diario racconta** (strato emotivo): homepage a taccuino, la formula del reel
  rallentata e resa leggibile.
- **La Traccia organizza** (strato utile): ogni capitolo sfocia in schede-luogo
  reali, filtrabili e salvabili, con pin sulla mappa.

## 4. Architettura

Due strati, un content-layer condiviso. Niente doppia codebase.

### 4.1 Strato Diario (homepage `/`)

Rifattorizzazione di `CinematicHomepage.tsx` mantenendo la "pelle" taccuino
(rilegatura, testata persistente, Fraunces, timbro "Provato"). Arco emotivo
**libero**, non un pillar rigido per capitolo:

1. **La scoperta** — apertura ad alta meraviglia. Reel candidato: Tim Burton
   (Betta nella sala Alice) o Bled. "Sembra inventato. Ci siamo stati."
2. **La prova** — il metodo: più luoghi in sequenza a dimostrare che "proviamo sul
   campo" è un pattern, non uno slogan. 3–4 reel misti.
3. **Vale davvero?** — la differenza sito vs Reel: prezzo, stagione, per chi è,
   **limite onesto**. Qui il sito aggiunge ciò che 15 secondi di reel non contengono.
4. **Noi** — screenshot profilo reale + nota in prima persona (voce R./B.).

Chiusura → 3 CTA reali: `Apri la mappa` (/mappa), `Ricevi la prossima traccia`
(riusa `SentieroLeadForm` esistente, POST reale), `Collabora con noi`
(/collaborazioni).

### 4.2 Strato Tracce (utilità)

Ogni capitolo del Diario porta a una **scheda Traccia**: cos'è, dove (pin mappa),
quanto costa, quando andarci, "vale davvero?" col limite, link al reel, disclosure
se ADV/invited. Salvabile, filtrabile per pillar. Alimentata dalle 40 Tracce con
GPS già curate + i 13 reel. Riusa `/mappa` e `/esplora` (filtri già funzionanti).

### 4.3 Dispositivi di personalità (cosa ci rende diversi)

Non decorazione: firma. Da usare con parsimonia (budget motion sotto).

- **Oggetto tangibile** al posto della sola foto: scontrino, angolo di biglietto,
  banconota, mappa con una X. Rende fisica la prova.
- **Voce nominata e datata**: capitoli firmati "— R." / "— B.", non narratore
  anonimo. Corrispondenza che arriva, non archivio.
- **Un solo margine vivo per capitolo**: una reazione a matita (prezzo barrato e
  riscritto, "!!", una freccia). Imperfetto, non calligrafico. MAI accumulato.

## 5. Design system — rientro nei binari

- **Palette ai token di brand.** Via gli accenti fuori-brand della home attuale
  (`--journal-red #b84d2e`, `--journal-blue #17375a`, fondo taupe `#d1c6b7`).
  Fondo nella famiglia sand (`#faf8f4`), "carta calda" ammessa come **variazione di
  tono**, non sub-brand. Accento = terracotta `--color-accent #c2410c`.
- **Budget motion: UNA firma di movimento.** La home attuale impila giro-pagina
  (rotateX) + reveal serif + page-dots + progress + scroll-cue + timbro + handnote.
  Tenere UNA (il reveal serif O il giro-pagina, non entrambi). Ridurre il rotateX o
  limitarlo alla foto, mai sul corpo testo. `useReducedMotion` resta.
- **Nav coerente.** La testata bespoke della home deve usare le **stesse etichette
  e destinazioni** della Navbar globale ("Chi siamo", non "Noi").

## 6. Pipeline contenuti (documentata, riproducibile, senza token)

1. `yt-dlp` per reel pubblici del profilo → video + `.info.json` (caption, like) +
   cover ufficiale (`--write-thumbnail`). Nessun sito terzo, nessun login.
2. Raw in cartella locale gitignored (mai committare i grezzi).
3. Cover: le title-card del brand (domanda + località) sono già on-brand — decidere
   per-caso se tenerle o ri-comporre il testo in Fraunces su frame pulito.
4. `asset-curator`: selezione, crop 9:16/4:5, alt text IT, budget peso, formati
   avif/webp responsive (come i reel già in repo).
5. I master in qualità piena arrivano dall'archivio owner quando disponibili →
   sostituzione senza toccare il codice.

## 7. Scope

### v1 (ora)

- Rifattorizzazione `CinematicHomepage.tsx`: 4 capitoli arco libero, contenuti
  reali (13 reel + screenshot), palette token, motion ridotto, nav coerente.
- Strato Tracce v1: schede dalle 40 curate, pin su /mappa, filtro pillar.
- Lead capture reintegrata (`SentieroLeadForm`), CTA hero con destinazione reale.

### v2 (backlog)

- Reel-in-movimento nella scena (già risolto tecnicamente in passato, vedi
  PROJECT note — riattivabile con cautela CWV).
- Espansione Tracce con foto master owner.
- Altri pillar dall'audit (Horror Park, Harry Potter, Caraibi in Italia) man mano
  che si curano i frame.

### Non-goals

- Nessuna immagine AI che finge persone o luoghi provati (AI solo texture/timbri/mappe).
- Nessun nuovo tool oltre `yt-dlp` senza conferma owner.
- Nessuna modifica a `server.ts` / `firestore.rules` / `admin.ts`.
- Nessun scraping loggato con account personale (solo pubblico anonimo).

## 8. Rischi e decisioni aperte

- **Rimozione immagini AI esistenti.** `couple-travel` / `about-editorial` (AI)
  sono usate anche in `ChiSiamo`, `CoupleIntro`, `HeroSection`, article hero. La
  loro sostituzione con frame reali è lavoro oltre la home — da pianificare a parte
  per non gonfiare questo scope. [decisione owner]
- **Title-card sulle cover**: tenerle (già on-brand) o ricomporle in Fraunces?
  [decisione design in implementazione]
- **Disclosure ADV/invited** va mantenuta sul sito per i reel hosted (Sushi Romagna,
  Horror Park, Bled), come su IG.
- **Qualità cover**: sono la versione IG (~1080px lato lungo). Sufficiente per
  9:16 nel taccuino; master owner in v2.

## 9. Verifica (gate implementazione)

`npm run typecheck` · `npm run audit:ui` · `npm run audit:visual` · matrice
320/375/768/1024/1440 senza overflow · axe zero violazioni · un solo h1 · CTA con
destinazioni reali · nessuna stringa "generata" · console pulita.
