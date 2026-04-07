# Travelliniwithus Master Plan

Last updated: 2026-03-18
Scope: strategic and operational direction for the replacement version contained in this repository.

## Premessa

Questo documento non valuta `travelliniwithus.it` come prodotto finale.

Base corretta di lavoro:

- il sito live attuale e` una versione temporanea/in costruzione
- questa codebase locale e` la vera base della prossima versione da pubblicare

Quindi:

- il live serve solo a capire la percezione pubblica attuale
- questo repository serve a costruire la versione definitiva

## Decisione Centrale

La direzione migliore non e`:

- travel blog generalista
- luxury travel puro
- hub sconti/affiliate puro
- travel agency
- brand che parla di tutto

La direzione migliore e`:

- media brand creator-led di scoperta viaggi
- centrato su posti particolari, esperienze memorabili e consigli davvero utili
- con forte storytelling visivo
- con una prospettiva chiara di coppia

Formula sintetica:

- `posti particolari + informazioni utili + storytelling visivo + fiducia`

## Posizionamento Consigliato

### Cosa deve diventare Travelliniwithus

Travelliniwithus deve diventare uno dei riferimenti italiani per:

- luoghi curiosi
- locali insoliti
- soggiorni belli ma credibili
- esperienze da salvare
- mini fughe, weekend e itinerari memorabili
- dritte pratiche che fanno agire davvero le persone

### Promessa corretta

Promessa di brand consigliata:

- ti facciamo scoprire posti particolari e ti diamo le informazioni giuste per viverli davvero

Oppure, in forma piu` editoriale:

- scopriamo, selezioniamo e rendiamo semplici da vivere luoghi ed esperienze che meritano davvero

### Cosa non deve sembrare

Non deve sembrare:

- un sito coupon
- un progetto premium costruito solo su estetica
- un magazine generalista senza angolo distintivo
- un portfolio B2B travestito da brand consumer
- una raccolta di pagine belle ma non operative

## Perche' questa e` la direzione giusta

I segnali piu` forti raccolti dal progetto e dalla presenza pubblica puntano tutti nella stessa direzione:

- Instagram e Linktree suggeriscono contenuti social ad alta salvabilita`
- il tono migliore del progetto emerge quando parli di scoperte, luoghi curiosi e esperienze
- la monetizzazione piu` naturale nasce da fiducia, utilita` e selezione
- il lato B2B funziona meglio se poggia su una identita` editoriale riconoscibile, non su servizi generici

In pratica:

- l'attenzione arriva dal contenuto discovery
- la fiducia arriva dall'utilita`
- la monetizzazione arriva dalla selezione
- il premium arriva dalla cura, non dal lessico

## Architettura Del Brand

Il brand deve avere due livelli chiari.

### Livello B2C

Serve per:

- ispirare
- aiutare
- convertire utenti in community, click qualificati, prodotti digitali e richieste

Pilastri consigliati:

- posti particolari
- esperienze e locali memorabili
- guide pratiche
- risorse utili
- prodotti digitali selettivi

### Livello B2B

Serve per:

- attrarre brand, hotel, destinazioni e partner
- mostrare prova
- generare richieste qualificate

Pilastri consigliati:

- collaborazioni
- media kit reale
- case study
- metriche vere
- contatto business semplice e credibile

## Cosa Tenere Della Codebase Attuale

### Da tenere quasi sicuramente

- direzione visiva premium-editoriale della home
- tono raffinato ma umano delle sezioni piu` riuscite
- separazione gia` abbozzata tra contenuto, brand e shop
- page design di Collaborazioni, Shop, Risorse e Contatti come base estetica
- brand feeling caldo, cinematografico e curato

### Da tenere ma rifocalizzare

- shop: non come catalogo generico, ma come libreria selettiva di strumenti e prodotti travel
- risorse: da lista lunga affiliata a pagina utilissima e curata
- collaborazioni: da pagina aspirazionale a pagina con prova, numeri e casi reali
- chi siamo: da manifesto astratto a pagina che spiega perche' fidarsi di voi

### Da tagliare o ridurre

- promesse troppo ampie
- elementi placeholder
- offerte troppo numerose insieme
- sezioni che sembrano complete ma non lo sono ancora
- funnel finti

## Cosa Oggi Blocca Il Lancio

Questi punti non sono dettagli. Sono blocchi reali per la nuova pubblicazione.

### Blocchi di affidabilita`

- la rotta prodotto non e` coerente: il sito linka `/shop/{slug}` ma il router espone solo `/shop` e `/shop/senza-confini-planner`
- la pagina prodotto dipende dal database e oggi non gestisce bene il prodotto hero statico
- la pagina articolo ha gia` mostrato rotture in runtime
- la route admin accetta qualunque utente loggato

### Blocchi di fiducia

- form contatti oggi non invia nulla, mostra solo successo locale
- newsletter oggi non iscrive davvero nessuno e invia solo un evento analytics
- media kit salva il lead ma scarica un PDF che non esiste
- alcuni testi hanno encoding rotto
- varie metriche e testimonial sono placeholder o troppo generici

### Blocchi di coerenza

- navbar, ricerca, pagine articolo, shop e regole Firestore non parlano lo stesso modello dati
- il modello articolo e` frammentato tra editor admin, frontend e seed locali
- alcuni percorsi di navigazione portano a pagine vuote o non ancora chiuse

## Priorita` Prima Del Lancio

### Fase 1: Stabilita` e verita`

Obiettivo:

- eliminare tutte le false promesse e tutte le rotture

Da fare:

- correggere routing shop e product detail
- correggere articolo runtime
- attivare davvero contatti o sostituirli con flusso reale semplice
- attivare davvero newsletter oppure rimuovere la promessa download
- caricare media kit reale o togliere la pagina fino a disponibilita`
- sistemare testi con encoding rotto
- chiudere accesso admin
- rimuovere numeri, recensioni o offerte non verificabili

### Fase 2: Focus e struttura

Obiettivo:

- far capire in 10 secondi chi siete, a chi servite e cosa offrirete

Da fare:

- riscrivere home con una sola promessa forte
- dare a ogni pagina una CTA primaria
- chiarire la gerarchia tra magazine, risorse, shop e collaborazioni
- ridurre la dispersione nel menu
- legare ogni sezione a un funnel reale

### Fase 3: Monetizzazione e autorevolezza

Obiettivo:

- trasformare attenzione e fiducia in asset di business ripetibili

Da fare:

- prodotti digitali veri
- risorse affiliate curate e contestualizzate
- media kit professionale
- case study collaborazioni
- lead magnet reale
- newsletter con sequenza minima

## Struttura Sito Consigliata

### Home

Ruolo:

- definire chi siete
- mostrare cosa rende unico il brand
- indirizzare il traffico verso i tre assi principali

Tre assi consigliati:

- scopri posti particolari
- organizza meglio il tuo viaggio
- lavora con noi

CTA primarie:

- esplora i posti
- scopri le guide
- collabora con noi

### Destinazioni

Ruolo:

- archivio discovery per area geografica

Deve contenere:

- localita`
- mappe
- filtri veri
- hook utili
- collegamenti a guide, hotel, esperienze e articoli

### Esperienze

Ruolo:

- pagina ad alto potenziale shareable

Tema:

- posti insoliti
- locali curiosi
- esperienze romantiche
- uscite brevi ma forti

### Guide

Ruolo:

- contenuto evergreen ad alto trust

Deve essere:

- piu` pratico di Destinazioni
- meno frammentato
- pensato per traffico organico e salvataggi

### Risorse

Ruolo:

- pagina utility/affiliate

Non deve sembrare:

- un muro di link

Deve sembrare:

- una cassetta degli attrezzi approvata da voi

Struttura consigliata:

- pianificazione
- assicurazione
- prenotazioni
- tech e creator gear
- travel essentials

### Shop

Ruolo:

- piccola boutique digitale

Non deve diventare:

- e-commerce dispersivo

Deve contenere solo prodotti coerenti con il brand:

- planner
- guide geografiche
- mappe curate
- mini itinerari
- bundle tematici

### Collaborazioni

Ruolo:

- pagina commerciale principale B2B

Deve rispondere subito a:

- chi siete
- che audience avete
- che contenuti fate
- per chi siete giusti
- che risultati potete generare
- come si avvia una collaborazione

Da aggiungere in futuro:

- casi studio
- risultati misurabili
- form business breve
- FAQ per brand e hospitality

### Media Kit

Ruolo:

- asset reale, non promessa

Contenuto minimo:

- bio breve
- dati audience
- canali
- servizi
- esempi contenuti
- brand gia` coinvolti
- contatti business

### Contatti

Ruolo:

- conversione semplice

Regola:

- meno forma, piu` sostanza

Se il form non e` operativo:

- meglio email/WhatsApp veri e chiari

### Chi Siamo

Ruolo:

- costruire fiducia

Deve spiegare:

- chi siete
- cosa vi muove
- che tipo di viaggi raccontate
- cosa rende affidabili i vostri consigli

## Funnel Consigliato

### Funnel B2C

1. contenuto social o ricerca
2. pagina sito utile
3. salvataggio o iscrizione
4. click affiliate o acquisto prodotto
5. ritorno tramite newsletter o social

### Funnel B2B

1. scoperta tramite contenuti o passaparola
2. pagina Collaborazioni
3. prova e metriche
4. media kit o contatto diretto
5. call

## Offerta Consigliata

### Oggi

Concentrati su:

- collaborazioni brand e hospitality
- affiliate travel coerenti
- uno o pochi prodotti digitali davvero pronti

### Domani

Poi espandi verso:

- guide premium regionali
- mappe curate
- newsletter premium o club
- itinerari personalizzati solo se processabili bene
- viaggi di gruppo solo se diventa un ramo operativo vero

## Strategia Contenuti

La regola editoriale piu` importante deve essere questa:

- ogni contenuto deve avere una componente `wow` e una componente `utile`

Formato ideale:

- hook forte
- prova visiva
- consiglio pratico
- selezione personale
- call to action naturale

Contenuti da privilegiare:

- posti che non ci si aspetta
- luoghi belli ma vivibili
- locali insoliti
- mini guide da salvare
- weekend e gite
- raccolte curate per zona o tema

Contenuti da evitare:

- guide generiche gia` viste
- articoli troppo ampi
- liste senza angolo
- pagine solo decorative

## Modello Dati Da Unificare

Il progetto deve arrivare a un solo modello coerente per:

- articoli
- destinazioni
- prodotti
- risorse
- statistiche brand

Oggi il sistema e` frammentato.

Il traguardo corretto e`:

- stesso schema tra admin, frontend, ricerca, SEO e regole Firestore

## KPI Da Misurare

### KPI consumer

- click outbound affiliati
- iscrizioni newsletter reali
- salvataggi e traffico verso guide e shop
- conversione prodotto digitale

### KPI B2B

- richieste commerciali qualificate
- download media kit reali
- call prenotate
- chiusure collaborazione

### KPI brand

- pagine piu` utili
- temi piu` salvati
- territori o format che generano piu` interesse

## Principi Non Negoziabili

- meglio meno, ma vero
- meglio un funnel semplice che cinque funnel finti
- meglio una categoria chiara che completezza apparente
- meglio prova reale che linguaggio premium
- meglio utilita` alta che estetica vuota

## Ordine Di Esecuzione Consigliato

1. correggere i blocchi tecnici reali
2. semplificare il messaggio di home e nav
3. rendere veri i funnel di contatto, newsletter e media kit
4. chiudere il sistema prodotto e contenuti
5. aggiungere proof e credibilita` B2B
6. solo dopo spingere crescita, SEO e performance avanzata

## Decisione Finale

Se l'obiettivo e` diventare il migliore in modo utile alle persone, la risposta non e` fare tutto.

La risposta e`:

- diventare il piu` riconoscibile e affidabile nel far scoprire luoghi ed esperienze memorabili
- e poi costruire sopra questa reputazione prodotti, risorse e collaborazioni coerenti

Travelliniwithus vince se riesce a sembrare allo stesso tempo:

- bello
- vero
- utile
- scelto con gusto

Non deve essere il sito di viaggio piu` grande.
Deve essere uno di quelli di cui ci si fida di piu`.
