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
- [x] verificare composizione finale hero su desktop
- [x] verificare navbar desktop su viewport laptop e wide
- [x] verificare scroll orizzontale chip su mobile

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

## Build pass 2026-04-22 - discovery + trust layer

Implementazione riallineata al repo senza cambiare la nav V3:

- `LatestArticles` ora privilegia `featuredPlacement = home-flagship` e mostra anche metadata decisionali (`tripIntents`, `budgetBand`, `verifiedAt`) quando disponibili.
- Le foto brand reali di `ChiSiamo` e `Collaborazioni` passano dal registry `MEDIA`, cosi gli asset editoriali restano centralizzati.
- `ChiSiamo` aggiunge due blocchi espliciti: `Come decidiamo dove andare` e `Cosa verifichiamo`, per spostare la fiducia dal tono al metodo.
- `Risorse` rafforza la semantica "plan a trip" con card `Parti da qui` che collegano il toolkit a `Destinazioni`, `Esperienze` e `Guide`.
- Home e discovery restano dentro la struttura V3 gia approvata; il nuovo layer premium arriva da metadati, selezione flagship e copy piu decisionale, non da nuove route.

## Build pass 2026-04-23 - Salt-style premium layer

Home ri-orchestrata da flusso lineare a portale di esplorazione, seguendo il reference saltinourhair.com adattato al tono italiano del brand.

Ordine sezioni attuale:

1. `HeroSection`
2. `DestinationScroller` (montato — era untracked)
3. `HomeDiscoveryCards`
4. `CoupleIntro`
5. `HomeMapTeaser`
6. `LatestArticles`
7. `HomeToolsTeaser`
8. `InstagramFeed` (nuovo — fixture in dev, Graph API in W8)
9. `PartnerLogos` (nuovo — prop-driven, default fallback credibile)
10. Newsletter inline dark
11. `HomeCollaborationCta`

Componenti nuovi creati in `src/components/home/`:

- `InstagramFeed.tsx` — grid 2×3 / 3×2 con `role="list"`, OptimizedImage, CTA Follow
- `PartnerLogos.tsx` — wordmark o logo img, riusato anche in `Collaborazioni.tsx` con lista B2B dedicata

Navbar: aggiunto sub-link `Dove dormire` dentro gruppo `Guide` del mega-menu `Esplora`. Footer: stesso link nel blocco `Scopri`.

Nessun restyle di token in questa pass. Restyle visivo rimandato a milestone design-review dedicata (non avviata).

## Build pass 2026-04-24 - nav split Guide / Pianifica

Decisione: la nav smette di comprimere tutto dentro `Esplora` + `Risorse`.

- `Esplora` resta per destinazioni ed esperienze
- `Guide` ora dichiara il layer editoriale pratico: guide, itinerari, dove dormire, cosa mangiare
- `Pianifica` diventa il funnel operativo: `Inizia da qui`, `Risorse`, `Dove dormire`
- il cambio serve a rendere leggibile la differenza tra ispirazione, contenuto pratico e workflow di organizzazione

## Build pass 2026-04-24 - senior UI polish (homepage + footer)

Revisione editoriale premium (no redesign) focalizzata su contrast, gerarchia e dedupe navigazionale. Tutti i gate verdi (`typecheck`, `audit:ui` 11/0 new, `build` OK in 20s).

Modifiche:

- **Footer** (`src/components/Footer.tsx`) — dedupe dei link: ogni voce appare una sola volta. Rimossi `Dove dormire` duplicato in Scopri, `Risorse` duplicato in Scopri e Pianifica, `Preferiti` duplicato in Pianifica. Aggiunto `Cosa mangiare` in colonna Pianifica. Ridotta densità senza perdere funzionalità.
- **HeroSection** (`src/components/home/HeroSection.tsx`) — rimosso paragrafo uppercase ridondante sotto i CTA (ripeteva il messaggio dei TRUST_PILLS). Bump opacity: description `text-white/86 → /90`, pill text `/78 → /85`, secondary CTA text `/82 → /88`.
- **Home newsletter section** (`src/pages/Home.tsx`) — italic `text-black/55 → /70`, body `/62 → /72` per soddisfare WCAG AA con margine.
- **HomeDiscoveryCards** (`src/components/home/HomeDiscoveryCards.tsx`) — description principali `text-black/62 → /72`, guide-tile desc `/55 → /65`. Typo `gia → già` corretto nel CTA Pianifica.
- **CoupleIntro** (`src/components/home/CoupleIntro.tsx`) — quote manifesto `text-black/45 → text-accent-text` (dal bronzo WCAG AA compliant). Card standard desc `/55 → /68`. Badge meta `/50 → /62` con bold.
- **LatestArticles** (`src/components/home/LatestArticles.tsx`) — heading ristretta da "Contenuti editoriali da leggere prima di partire" a "Guide e itinerari da leggere prima di partire" (più diretto), eyebrow `Editoriale → Dalla redazione`, body `/60 → /70`, link secondari `/50 → /62`.

Proposte rimandate (medio rischio, richiedono approval):

- **B1**. Home consolidation: valutare fusione `InstagramFeed + PartnerLogos` in strip social proof unica, e riordino `HomeMapTeaser` dopo `DestinationScroller`.
- **B2**. Design token: introdurre `.text-muted` (/70) e `.text-meta` (/55) in `@theme` per eliminare i `/55 /62 /65 /68` dispersi nei componenti.

Fuori scope (pre-esistente, non toccato):

- Warning IDE `suggestCanonicalClasses` (`text-[var(--color-accent)] → text-accent`) — presenti in tutto il codebase, non introdotti dalle modifiche.
- Navbar refactor (stabile, 713 righe).
- Sostituzione immagini AI con foto reali Rodrigo & Betta (owner task).

## Build pass 2026-04-24 - wave 2 + 3 (home residui + pagine conversione)

Seconda e terza ondata della senior UI review, sullo stesso gate giornaliero. Tutti i gate verdi (`typecheck`, `audit:ui` 11/0 new, `build` OK in 25s).

Wave 2 — home components residui:

- **HomeToolsTeaser** (`src/components/home/HomeToolsTeaser.tsx`) — main description `text-black/62 → /72`, card descriptions `/56 → /68`, CTA meta `/42 → /60` per migliore affordance dei link "Vai alle risorse".
- **HomeMapTeaser** (`src/components/home/HomeMapTeaser.tsx`) — italic `text-black/55 → /70`, description `/62 → /72`. SVG world shapes `strokeOpacity 0.18 → 0.22`, marker-pulse `fillOpacity 0.18 → 0.24` per migliore riconoscibilità geografica.
- **HomeCollaborationCta** (`src/components/home/HomeCollaborationCta.tsx`) — secondary button "Richiedi il media kit" rinforzato: `border-white/18 → /24`, `text-white/76 → /92`. Parity visuale con il primary CTA senza perdere la gerarchia.

Wave 3 — pagine di conversione:

- **InstagramFeed** (`src/components/home/InstagramFeed.tsx`) — stesso pattern italic+body `/55 → /70`, `/62 → /72`.
- **Collaborazioni** (`src/pages/Collaborazioni.tsx`) — badge "Con priorità alla qualità del racconto" `text-black/45 → /60` per leggibilità mobile sulla floating card B2B.

Pagine auditate ma non modificate (copy e gerarchia già molto forti, nessun quick win giustificato):

- `src/pages/ChiSiamo.tsx` — `/70` su cards principi è borderline ma accettabile. Rinvio a pass design token (B2).
- `src/pages/MediaKit.tsx` — success message usa `text-accent-text` (bronzo WCAG AA), già al limite corretto.
- `src/pages/IniziaDaQui.tsx` — card body `/65` adeguato, gerarchia forte, no interventi.

Totale ondate 1+2+3: **11 file src toccati** (Footer, HeroSection, Home, HomeDiscoveryCards, HomeToolsTeaser, HomeMapTeaser, HomeCollaborationCta, CoupleIntro, LatestArticles, InstagramFeed, Collaborazioni), 0 regression, 0 new audit warning, build stabile.

### Wave 4 — smoke test reale (Playwright MCP) e fix follow-up

Eseguito smoke test via `browser-auditor` su `http://localhost:3000` — homepage desktop 1280×800, homepage mobile 390×844, `/collaborazioni` desktop. Verdict: nessun blocker, nessun errore console, nessuna regressione strutturale. 5 screenshot salvati.

Issue trovati dallo smoke test:

1. **Footer grid desktop wrap** (pre-esistente, scoperto durante il test) — a 1280px la colonna `Progetto` andava a capo su una seconda riga. Calcolo grid: logo `lg:col-span-2` + 4 colonne link × 1 = 6 colonne necessarie, ma grid era `lg:grid-cols-5`. Fix: `lg:grid-cols-5 → lg:grid-cols-6` in `src/components/Footer.tsx`. Ora le 5 colonne desktop si distribuiscono pulite: Logo (2) + Scopri + Pianifica + Risorse + Progetto.

2. **Navbar sticky copre prima voce footer su mobile** (pre-esistente, WARN minore) — il z-index della navbar sticky sovrappone visivamente la prima voce di `Scopri` (Destinazioni) quando lo scroll raggiunge il footer. Il link è presente e funzionale, solo oscurato visivamente. **Non fixato in questa pass**: richiede intervento sulla Navbar, fuori scope. Aggiunto qui come tech debt noto.

Totale post wave 4: **11 file src** (ri-toccato Footer per il grid fix), 0 regression, 0 nuovi audit warning.

## Build pass 2026-04-24 - wave 5 (editorial polish: magazine feel)

Passaggio da "buon sito creator" a "rivista travel digitale": infrastruttura editoriale + copy più specifica. Tutti i gate verdi (`typecheck` clean, `audit:ui` 119 file / 11-0 new, `build` 22.26s).

### Nuovi componenti editoriali riusabili

- **`src/components/article/PullQuote.tsx`** — blockquote visivo con accent-line a sinistra, icona Quote floating, font serif italic 2xl/3xl, attribuzione opzionale in accent-text small-caps. Sostituisce la trasformazione inline "Consiglio Travellini" in markdown con un blocco visivo che spezza il ritmo del corpo articolo.
- **`src/components/article/FactBox.tsx`** — fast-facts card con `<dl>` semantica, grid 1/2/4 colonne responsive (sm/lg), label uppercase sottile e valore in serif prominente. Progettato per "destinazione in breve" (es. "Ring Road: 1.332 km · 10 giorni · €3.500–5.000").

Entrambi esportati da `src/components/article/index.ts` e accessibili da qualunque pagina articolo.

### Estensione tipo `ArticleData` (`src/components/article/types.ts`)

Aggiunti 3 campi opzionali:

- `verifiedContext?: string` — etichetta rich del badge "Verificato" (es. `"10 giorni lungo la Ring Road"`), rimpiazza il generico "Verificato" quando popolato.
- `pullQuote?: { text: string; attribution?: string }` — contenuto PullQuote strutturato.
- `factBox?: { title?: string; items: { label: string; value: string }[] }` — fast-facts strutturati.

Nessuno è required: articoli esistenti continuano a renderizzare senza variazioni.

### Wiring render (`src/pages/Articolo.tsx`)

- FactBox renderizzato subito dopo la sezione "Perché salvarlo" (highlights), prima del body. Target: lettori scanner che vogliono i numeri prima della prosa.
- PullQuote renderizzato dopo `ArticleBody`, prima dell'itinerario. Target: punto di respiro visivo tra il racconto discorsivo e le sezioni pratiche.
- `ArticleHero` ora mostra `verifiedContext` con bordo/bg accent anziché bianco neutro, quando presente. Badge cresce da puro statement a micro-credibility statement.

### 3 pillar popolati (`src/config/previewContent.ts`)

Tutti i campi usano **solo dati già presenti nel body** (duration, period, costs, content) — zero numeri inventati, zero claim verificabili non supportati.

- **Puglia roadtrip**: verifiedContext `"5 giorni in Valle d'Itria"`, factBox (durata/periodo/budget/distanze), pullQuote estratto da "Consiglio Travellini" del body.
- **Islanda Ring Road estate**: verifiedContext `"10 giorni lungo la Ring Road"`, factBox con km reali (1.332), pullQuote "Non inseguire ogni cascata...".
- **Islanda Ring Road inverno**: verifiedContext `"Ring Road in pieno inverno, 10 giorni"`, factBox con budget esplicito (€3.500–5.000 esclusi voli, come dichiarato nel body), pullQuote "Metà febbraio è la nostra sweet spot...".

### Home copy: da astratta a specifica (con pillar names reali)

- **`HeroSection.tsx`**: description da `"Guide pratiche scritte da chi ha vissuto..."` a `"Itinerari scritti dopo il viaggio, hotel testati sul posto, costi e stagioni reali. Non la lista più lunga: quella che ti fa decidere meglio."`.
- **`siteContent.ts`** → `home.heroDescription` default CMS allineato alla nuova copy (admin editor mostra la stessa voce).
- **`LatestArticles.tsx`**: heading da `"Guide e itinerari da leggere prima di partire."` a `"Le guide che stiamo finendo di scrivere."` + body che nomina i 3 pillar reali (Puglia slow, Islanda estate, Islanda inverno).
- **`HomeMapTeaser.tsx`**: heading da `"Un mondo di posti vissuti davvero"` a `"I posti che stiamo raccontando"` (onesto sullo stato draft) + body che cita Valle d'Itria e Ring Road.

### Vincoli rispettati

- Zero numeri inventati (seguita la regola CLAUDE.md "non inventare promesse commerciali non supportate").
- Zero claim su follower/metriche social.
- `const` field `verifiedContext` è opzionale: articoli senza il campo mantengono il badge "Verificato sul posto" di default.
- Pull-quote estratti dal body esistente — non scritti ex novo.

### Follow-up editoriale consigliati (owner action)

- Espandere i 3 pillar: ogni body è ~300-400 parole. Per "feature magazine" servono 1.500-2.500 (già indicato in EDITORIAL_GUIDE: pillar 1800-3000 parole).
- Sostituire immagini pillar Unsplash con foto reali Rodrigo & Betta sul posto.
- Aggiungere gallery reale e hotel testati nei 3 pillar.
- Valutare aggiunta `updatedAt` timestamp ad ogni revisione per trigger di "maintenance" in bullet footer articolo.

Totale wave 5: **9 file modificati** (types, index, ArticleHero, Articolo, HeroSection, LatestArticles, HomeMapTeaser, siteContent, previewContent) + **2 file creati** (PullQuote, FactBox). 0 regression, 0 nuovi audit warning.

## Build pass 2026-04-24 - wave 6 (allineamento copy↔contenuto + Instagram dedup)

Re-check browser post wave 5 ha trovato 3 problemi concreti da sistemare — tutti chiusi in questa wave.

Fix eseguiti:

1. **LatestArticles mostrava solo "Guida a Bali" invece dei 3 pillar promessi dalla copy.** Root cause: quando Firestore restituiva anche 1 articolo, il fallback logic di `LatestArticles.tsx` soppiantava completamente i demo previews, senza merge. Fix: in modalità demo (`showEditorialDemo=true`), se Firestore ha < 3 flagship, si fa merge di Firestore + `EDITORIAL_PREVIEWS` (dedup per id) per garantire i flagship editoriali. Firestore mantiene priorità sui dati reali.

2. **Mismatch copy↔contenuto demo flagship.** La nuova copy della wave 5 nominava "Puglia slow, Islanda Ring Road d'estate e d'inverno", ma i demo `featuredPlacement: 'home-flagship'` erano su Dolomiti + Puglia + Sicilia, e Islanda inverno non era neanche in `demoContent.ts`. Fix in `src/config/demoContent.ts`:
   - Rimosso `featuredPlacement` da Dolomiti (DEMO_ARTICLE_PREVIEW) e da Sicilia.
   - Aggiunto `featuredPlacement: 'home-flagship'` a Islanda estate.
   - Aggiunta nuova entry Islanda inverno con `featuredPlacement: 'home-flagship'`, createdAt `2026-04-24` (il più recente → diventa flagship visuale).
     Top 3 flagship ora per createdAt desc: Islanda inverno, Puglia, Islanda estate. Coincide con la copy.

3. **Instagram duplicato pre-footer.** La home mostrava `InstagramFeed` (sezione editoriale dedicata) + subito sotto `InstagramGrid` renderizzato dal `Footer.tsx` (band generica pre-footer presente su ogni pagina). Fix: in `Footer.tsx` aggiunto guard `showInstagramGrid = location.pathname !== '/'`. Le altre pagine mantengono il grid generico; la home ha solo la sua versione editoriale.

Bug minore fix:

- **Encoding UTF-8 "cittÃ d'arte"** in `demoContent.ts` L52 — double-encoded mojibake (bytes `0xC3 0x83 0xC2 0xA0` invece di `0xC3 0xA0` per `à`). Corretto a byte-level a `città d'arte`. Impatto: accessibility tree, tag card, rich snippet Google.

### Verdict browser post-wave 6

Home auditor confermato:

- LatestArticles mostra ora i 3 pillar corretti (Islanda inverno flagship + Puglia + Islanda estate). Copy=contenuto.
- Instagram appare esattamente 1 volta sulla home; resta visibile su `/collaborazioni` come prima.
- 0 console errors.
- Encoding pulito.

### Tech debt residuo (fuori scope wave 6)

- `/collaborazioni` ha alcune "sezioni con molto spazio vuoto" rilevate nel browser audit — probabilmente immagini Firestore non disponibili in locale. Da investigare in una pass dedicata alla pagina Collaborazioni.
- HomeDiscoveryCards mantiene la densità di 3 blocchi di navigazione consecutivi — pattern editoriale da rivedere (B1 rimandata).

Totale wave 6: **3 file src toccati** (`demoContent.ts`, `LatestArticles.tsx`, `Footer.tsx`). 0 regression, 0 nuovi audit warning, build OK.
