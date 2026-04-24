---
type: reference
area: product
status: active
priority: p0
owner: team
repo: TRAVELLINIWITHUS
related: '[[10_Projects/PROJECT_SITE_REBUILD_AUTHORITY_PREMIUM]]'
source: competitive analysis + rebuild mandate
tags:
  - product
  - strategy
  - rebuild
  - premium
---

# TRAVELLINIWITHUS MASTER PLAN

## Executive verdict

Travelliniwithus non ha bisogno di "piu pagine". Ha bisogno di diventare un **travel media brand editoriale premium** con una struttura piu netta, una gerarchia piu severa e un modello contenutistico piu rigoroso.

Il repo attuale non e da buttare. Ha gia tre basi preziose:

1. un impianto tecnico pubblicabile
2. un funnel B2B gia piu maturo della media creator
3. un embrione credibile di sistema editoriale

Non e ancora best-in-class per quattro motivi:

1. troppe superfici discovery con responsabilita parzialmente sovrapposte
2. tassonomie ancora miste tra luogo, intento, formato e utility
3. contenuti e asset in parte ancora percepibili come preview o transitori
4. mancanza di una gerarchia definitiva tra authority editoriale, planning e monetizzazione

Verdetto netto:

- **non serve una migrazione di stack come prima mossa**
- **serve una rifondazione guidata di information architecture, page system, content model e design discipline**
- **l'obiettivo corretto e diventare il riferimento italiano nel modello Salt in Our Hair + Along Dusty Roads, non imitare un travel blog creator classico**

## Top competitor benchmark

### Primary model: Salt in Our Hair

Da prendere:

- homepage come portale di esplorazione
- guide strutturate per il viaggio reale
- separazione chiara tra contenuto, planning e monetizzazione
- pagina collaborazioni autorevole

Da adattare:

- tono meno "travel business" e piu mediterraneo
- meno packaging da creator-product machine, piu selezione editoriale

Da evitare:

- espansione prematura di shop e asset se il catalogo reale non e ancora all'altezza

### Editorial tone model: Along Dusty Roads

Da prendere:

- tono adulto, indipendente, non rumoroso
- posizionamento basato su fiducia e criterio
- sensazione da publication, non da feed riciclato

Da adattare:

- piu calore people-led e piu presenza della coppia

Da evitare:

- eccesso di understatement se penalizza la conversione commerciale

### Guide template model: Anywhere We Roam

Da prendere:

- guide leggibili e molto ben segmentate
- Table of Contents utile
- promessa iniziale chiara
- struttura pensata per decidere, non solo per ispirare

### Commercial model: The Blonde Abroad

Da prendere:

- productization disciplinata
- funnel newsletter forte
- capacita di trasformare il brand in motore commerciale

Da evitare:

- tono troppo americano
- espansione lifestyle non coerente con il cuore travel editoriale

### Supplementary model: Bruised Passports

Da prendere:

- forza della coppia come asset narrativo e commerciale
- uso esplicito del social proof

## Current-state audit

### Scorecard sintetica

| Area                      | Score | Verdetto                                                          |
| ------------------------- | ----: | ----------------------------------------------------------------- |
| Posizionamento brand      |   7.5 | buono, ma ancora non definitivo                                   |
| Information architecture  |   6.0 | troppo larga, con cluster da semplificare                         |
| Homepage                  |   7.0 | ricca di segnali giusti, ma ancora non gerarchicamente definitiva |
| Template articolo         |   8.0 | base solida, uno dei punti migliori del repo                      |
| Hubs destinazione         |   6.5 | buona direzione, ancora eterogenea                                |
| Funnel B2B                |   8.0 | sopra la media del progetto                                       |
| Monetizzazione editoriale |   6.5 | sensata, ma non ancora perfettamente calibrata                    |
| CMS/admin                 |   7.5 | promettente, ma da governare piu duramente                        |
| Design system             |   6.5 | identita in crescita, ancora non completamente blindata           |
| SEO structure             |   6.5 | potenziale alto, struttura URL e tipi contenuto da razionalizzare |

### Cosa tenere

- `Articolo` come base del template editoriale premium
- `Collaborazioni` e `Media Kit` come ossatura del funnel B2B
- il principio di contenuti flagship, preview controllate e publish validation
- i componenti di trust editoriale e monetizzazione contestuale
- l'impianto admin/Firestore come base operativa

### Cosa rifare

- la gerarchia complessiva delle route pubbliche
- il ruolo reciproco di `Destinazioni`, `Guide`, `Esperienze`, `Risorse`, `Inizia da qui`, `Dove dormire`, `Cosa mangiare`
- la homepage come mappa coerente dell'intero sistema
- il design language di card, hub, menu e CTA
- la distinzione tra contenuto ispirazionale, contenuto decisionale e contenuto commerciale

### Cosa unire

- discovery per luogo e discovery per formato in un sistema piu chiaro
- guide pratiche e itinerary logic sotto un modello editoriale unico
- `Risorse` e `Inizia da qui` dentro un funnel planning non ridondante

### Cosa eliminare o declassare

- qualsiasi superficie che esiste ma non ha densita editoriale sufficiente
- feature account/social che non aiutano scoperta, pianificazione o collaborazione
- sezioni home che sembrano "riempitive"
- asset AI o demo presentati con intensita uguale a contenuti reali

## End-state vision

Travelliniwithus deve apparire come:

**il travel media brand editoriale premium italiano per chi vuole scegliere bene dove andare, come viverlo e cosa vale davvero**

Tre promesse:

1. **selezione**: non tutto merita di essere consigliato
2. **utilita**: ogni pagina aiuta a decidere qualcosa
3. **credibilita**: prima si prova, poi si pubblica

Tre pubblici:

1. viaggiatore che cerca ispirazione filtrata
2. viaggiatore che sta pianificando in modo concreto
3. brand o struttura che cerca una collaborazione credibile

## New information architecture

### Principio guida

La nuova IA deve rispondere a tre soli job-to-be-done:

1. **Esplora**: dove andare e cosa vale davvero
2. **Pianifica**: come organizzare il viaggio
3. **Collabora**: come lavorare con Travelliniwithus

### Top navigation raccomandata

- `Esplora`
- `Guide`
- `Pianifica`
- `Collaborazioni`
- `Chi siamo`

`Shop` non entra come voce primaria finche non ha almeno 3 prodotti reali forti.

### Route map target

- `/`
- `/destinazioni`
- `/destinazioni/[paese]`
- `/destinazioni/[paese]/[area-o-luogo]`
- `/guide`
- `/guide/[slug]`
- `/itinerari`
- `/itinerari/[slug]`
- `/dove-dormire`
- `/dove-dormire/[slug]`
- `/risorse`
- `/inizia-da-qui`
- `/collaborazioni`
- `/media-kit`
- `/chi-siamo`
- `/shop`
- `/shop/[slug]`

### Regole IA

- una route, un lavoro chiaro
- niente route "contenitore" senza densita
- niente tassonomia che mescola geografia, formato e intento nello stesso livello
- i country hubs devono vivere sotto `destinazioni`, non come mini-sito parallelo

## New content model

### Tipi contenuto core

- `pillar`
- `guide`
- `itinerary`
- `hotel`
- `resource`
- `product`
- `case-study`
- `testimonial`
- `page`

### Campi obbligatori per contenuti editoriali pubblicabili

- titolo
- slug
- tipo contenuto
- promessa/meta description
- hero image reale o approvata
- `verifiedAt`
- disclosure
- destination/country/region coerenti
- struttura minima del template
- CTA primaria unica
- related content coerente

### Governance

- nessun publish senza superare quality gate
- i contenuti preview devono restare chiaramente distinti
- i pillar devono essere pochi e migliori del resto
- i contenuti commerciali non possono avere una qualita inferiore ai contenuti editoriali

## New page system and templates

### 1. Homepage

Funzione: portale editoriale.

Deve fare solo questo:

- chiarire il posizionamento
- far partire esplorazione e planning
- mostrare il metodo
- aprire il funnel B2B senza rubare la scena

### 2. Destination hub

Funzione: pagina madre per un paese o macro-area.

Blocchi minimi:

- hero con promessa del territorio
- sub-destinations curate
- best guides
- planning essentials
- dove dormire
- related food/experience

### 3. Pillar guide

Funzione: pagina definitiva su un tema forte.

Blocchi minimi:

- intro decisionale
- TOC
- highlights
- logistica
- dormire
- budget
- periodo migliore
- related map / risorse / prodotti

### 4. Standard guide / itinerary

Funzione: articolo pratico a profondita media.

Principio: meno "blog post", piu "pagina utile".

### 5. Planning pages

`Dove dormire`, `Risorse`, `Inizia da qui` devono essere pagine di sistema, non riempitivi.

### 6. B2B pages

`Collaborazioni` e `Media Kit` devono mantenere un tono piu sobrio e piu premium del resto del mercato creator.

## New feature system

### Core

- ricerca e filtri editoriali
- related content forte
- trust/disclosure layer
- newsletter contestuale
- affiliate modules contestuali
- products integrati solo quando coerenti

### Secondary

- preferiti
- community/social widgets
- mappe avanzate

Regola: se una feature non aumenta decisione, fiducia o conversione, non e core.

## Design and UX direction

### Direzione

Premium editoriale mediterraneo. Non lusso finto, non creator-template, non SaaS travestito.

### Regole visive

- hero sobrie ma forti
- typography con contrasto chiaro tra titoli e corpo
- spacing generoso, non molle
- cards disciplinate
- immagini reali e con peso gerarchico
- CTA poche, chiare, distribuite per ruolo

### Da evitare

- blocchi ripetuti
- numeri decorativi
- badge superflui
- widget social invadenti
- layout che sembrano demo

## Technology recommendation

### Raccomandazione

**Restare su React + TypeScript + Vite + Firebase/Firestore + Stripe** per il rebuild.

### Motivo

Il limite oggi non e lo stack. Il limite e la disciplina di prodotto.

Cambiare stack ora produrrebbe:

- costo alto
- rischio alto
- ritardo sul lavoro davvero importante

### Cambi richiesti senza replatform

- consolidare content layer e route schema
- ridurre complessita dei template
- separare meglio public model e admin model
- modularizzare progressivamente il server
- valutare SSR o pre-render solo se l'audit SEO successivo lo rende necessario

## Non-negotiables

1. Ogni route deve avere un ruolo unico.
2. Nessun contenuto debole deve andare live solo per riempire il sito.
3. Nessuna monetizzazione deve rompere la lettura.
4. Il brand deve sembrare una publication premium, non un blog con plugin.
5. Le immagini reali restano il target; gli asset temporanei sono debito, non verita finale.
6. `Collaborazioni` e `Media Kit` devono parlare con lo stesso livello di qualita del lato editoriale.

## Kill list

- route e cluster semanticamente sovrapposti
- pagine con tassonomia poco difendibile
- CTA concorrenti nella stessa sezione
- blocchi "social proof" senza prova forte
- sezioni shop troppo visibili prima che il catalogo sia maturo
- food o experience hubs standalone se non raggiungono massa critica

## Quick wins

1. Bloccare la nuova IA e la mappa route definitiva.
2. Portare i country hubs dentro la gerarchia `destinazioni`.
3. Unificare il page system in 4 template forti.
4. Demotare o nascondere tutte le superfici non ancora mature.
5. Rendere `Inizia da qui` il vero ingresso planning.
6. Alzare il publish gate per articoli, hotel e risorse.

## Launch model

### Modello raccomandato

Lancio **ampio ma curato**, non totale indiscriminato.

### Struttura lancio

- homepage definitiva
- destinazioni e 3 country hubs forti
- guide archive con pillar + standard guides
- `Inizia da qui`
- `Dove dormire`
- `Risorse`
- `Collaborazioni` + `Media Kit`
- shop aperto solo se il catalogo reale regge il livello

### Regola finale

Meglio un sito che sembra gia il migliore nel 70% delle superfici, che un sito pieno ma disomogeneo nel 100%.

## Link operativi

- [[TRAVELLINIWITHUS_EXECUTION_PLAN]]
- [[10_Projects/PROJECT_SITE_REBUILD_AUTHORITY_PREMIUM]]
- [[87_References/COMPETITIVE_ANALYSIS_TRAVEL_INFLUENCER_SITES]]
- [[10_Projects/PROJECT_TRAVELLINIWITHUS_SITE]]
