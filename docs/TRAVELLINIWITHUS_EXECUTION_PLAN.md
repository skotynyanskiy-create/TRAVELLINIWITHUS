# Travelliniwithus Execution Plan

Last updated: 2026-03-18
Goal: turn the current local codebase into a publishable, credible, focused, high-conversion version of Travelliniwithus.

## Obiettivo

Migliorare il progetto in questo ordine:

1. renderlo vero e affidabile
2. renderlo chiaro e focalizzato
3. renderlo utile e convertente
4. renderlo scalabile

## Priorita' Assolute

Prima di qualsiasi rifinitura estetica o SEO avanzata, il sito deve:

- non rompersi
- non promettere cose finte
- non avere link incoerenti
- non mostrare placeholder evidenti
- far capire subito chi siete e cosa offrite

## Fase 1: Bloccanti Tecnici

Obiettivo:

- eliminare i problemi che oggi impediscono un lancio serio

Da fare:

- correggere il routing prodotti
- trasformare `shop/senza-confini-planner` in un sistema coerente con `shop/:slug`
- sistemare `ProductPage` per il prodotto hero e per i prodotti Firestore
- correggere la ricerca, che oggi manda gli articoli a `/articolo/{doc.id}` e i prodotti a `/shop`
- chiudere l'accesso admin solo agli utenti autorizzati
- sistemare la pagina articolo e gli errori runtime
- correggere i testi con encoding rotto

Esito atteso:

- tutte le pagine principali apribili
- nessun CTA importante che porta a errore
- area admin non esposta in modo improprio

## Fase 2: Verita' Dei Funnel

Obiettivo:

- sostituire i funnel simulati con funnel reali

Da fare:

- rendere operativo il form contatti
- collegare la newsletter a un sistema reale oppure rimuovere la promessa di iscrizione
- sostituire il lead magnet con un file reale oppure togliere la CTA
- caricare un media kit vero oppure disattivare temporaneamente la pagina
- rivedere tutti i pulsanti che oggi sembrano “funzionanti” ma non producono niente

Esito atteso:

- ogni conversione principale produce un risultato reale
- il sito non finge processi non ancora pronti

## Fase 3: Messa A Fuoco Del Brand

Obiettivo:

- far capire in pochi secondi cosa rende unico Travelliniwithus

Da fare:

- riscrivere hero e messaggio chiave della home
- allineare `Home`, `Chi Siamo`, `Collaborazioni`, `Risorse` e `Shop` allo stesso posizionamento
- togliere linguaggio troppo ampio, astratto o “premium vuoto”
- far emergere meglio:
  - posti particolari
  - esperienze memorabili
  - informazioni utili
  - prospettiva autentica di coppia

Esito atteso:

- brand piu' riconoscibile
- meno dispersione tra lato editoriale, affiliate e B2B

## Fase 4: Struttura E Navigazione

Obiettivo:

- semplificare il sistema e farlo lavorare come ecosistema

Da fare:

- ridurre il menu alle aree davvero utili
- far combaciare navbar, pagine, filtri e query params
- dare a ogni pagina una CTA primaria
- collegare meglio:
  - contenuti
  - risorse
  - shop
  - collaborazioni
- trasformare la ricerca in uno strumento davvero utile

Esito atteso:

- navigazione piu' comprensibile
- meno rimbalzi
- piu' passaggi naturali tra contenuti e conversione

## Fase 5: Contenuti E Dati

Obiettivo:

- rendere il sito mantenibile e coerente

Da fare:

- unificare il modello dati di articoli, prodotti e tassonomie
- allineare admin, frontend, ricerca e Firestore rules
- decidere campi standard per:
  - articoli
  - guide
  - prodotti
  - destinazioni
- eliminare doppioni tra contenuti hardcoded e contenuti da database

Esito atteso:

- CMS piu' stabile
- meno bug derivati da campi incoerenti
- base pronta per crescita editoriale

## Fase 6: Monetizzazione Intelligente

Obiettivo:

- far guadagnare il brand senza farlo sembrare commerciale in modo cheap

Da fare:

- ripulire la pagina `Risorse`
- tenere solo affiliate coerenti e utili
- trasformare lo shop in boutique digitale selettiva
- definire 1-3 prodotti digitali veri
- progettare funnel chiari per:
  - affiliate
  - prodotti digitali
  - richieste B2B

Esito atteso:

- monetizzazione piu' coerente col brand
- piu' trust
- piu' conversione su cio' che conta davvero

## Fase 7: Credibilita' B2B

Obiettivo:

- trasformare la pagina collaborazioni in una vera pagina commerciale

Da fare:

- sostituire metriche placeholder con dati reali
- aggiungere case study o almeno esempi verificabili
- chiarire i servizi davvero offerti
- semplificare pacchetti e CTA
- rendere il media kit uno strumento serio

Esito atteso:

- richieste business piu' qualificate
- percezione piu' professionale

## Fase 8: SEO, Performance E Qualita'

Obiettivo:

- consolidare il progetto dopo la pulizia strategica

Da fare:

- sistemare head management e meta
- risolvere gli errori TypeScript
- rimettere in ordine i test
- alleggerire i bundle piu' grandi
- controllare sitemap, link interni e contenuti indicizzabili

Esito atteso:

- base tecnica solida
- miglior mantenibilita'
- miglior rendimento organico nel tempo

## Ordine Pratico Di Lavoro

Ordine consigliato reale:

1. fix tecnici bloccanti
2. funnel reali
3. copy e posizionamento
4. navigazione e struttura
5. modello dati e CMS
6. monetizzazione
7. credibilita' B2B
8. SEO e performance

## Quick Wins

Cose da fare subito per migliorare molto senza aspettare tutto:

- sistemare route shop
- togliere WhatsApp placeholder
- togliere media kit fake se non esiste ancora
- togliere download guide se il file non esiste
- sistemare i titoli piu' importanti della home
- correggere i testi con encoding rotto
- chiudere admin

## Piano Consigliato Di Esecuzione

### Sprint 1

Focus:

- Fase 1 + quick wins

Risultato:

- sito non rotto e piu' credibile

### Sprint 2

Focus:

- Fase 2 + Fase 3

Risultato:

- sito vero e con identita' piu' chiara

### Sprint 3

Focus:

- Fase 4 + Fase 5

Risultato:

- struttura pulita e base dati piu' robusta

### Sprint 4

Focus:

- Fase 6 + Fase 7 + Fase 8

Risultato:

- progetto pronto per crescere, monetizzare e posizionarsi bene

## Criterio Di Decisione

Per ogni scelta futura, applicare questa domanda:

- aumenta fiducia?
- chiarisce il brand?
- aiuta davvero l'utente?
- sostiene un funnel reale?

Se la risposta e` no, non e` prioritaria.
