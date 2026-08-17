---
title: L'hero della home cambia per edizione, la meta di «/» no
date: 2026-08-17
type: decision
status: active
area: delivery
---

# L'hero della home cambia per edizione, la meta di «/» no (2026-08-17)

## Il problema

Il commutatore delle edizioni cambiava già il corpo della home — claim,
scorciatoie, CTA, e su `family` circa metà del contenuto — **ma non l'apertura**.
Tutte e tre le edizioni aprivano con «Posti che sembrano inventati. Ma esistono
davvero.», stessa fotografia e stessa CTA. Chi entrava come Family leggeva la
frase dei viaggiatori sul primo schermo, che è quello che decide.

Misurato il 2026-08-17 sulle tre edizioni renderizzate: `h1` identico, sezioni
sotto diverse, `main` da 11.429 · 5.762 · 11.025 caratteri.

## La decisione

**Cambiano titolo, sommario e le due azioni. Nient'altro.** Struttura,
fotografia, chip, post-it e barra delle prove restano identici: sono la firma del
sito, e tenerli fermi è anche ciò che protegge il vincolo sotto.

Il testo vive in `src/config/heroEditions.ts`; `BrandCoherentHero` legge
l'edizione e sceglie la variante.

**`viaggiatori` non è stato toccato**, e non per conservatorismo:
`scripts/generate-route-html.js` inietta solo `<head>`, il corpo lo rende il
client, e senza `localStorage` il client cade sempre sul default. Quindi
**`viaggiatori` è la variante che i crawler vedono**, ed è l'unica allineata alla
meta di `/` in `routeMeta.ts`. Il difetto non era quella frase: era che le altre
due se la prendevano in prestito. Si chiude togliendo il prestito.

**La meta di `/` resta una sola.** Nessuna rotta nuova, nessun redirect, nessun
canonical aggiuntivo: le tre varianti sono personalizzazione lato client per chi
ha già scelto, non contenuto indicizzabile.

## Il vincolo che va rimisurato, non stimato

Il commento in `homeComposition.ts` chiedeva che **l'elemento LCP resti identico
a ogni visita**. Regge per due motivi indipendenti: l'edizione è risolta sincrona
nell'inizializzatore di stato del context — non in un effetto — quindi il primo
paint ha già il titolo giusto; e le tre aperture hanno **geometria identica**,
misurata: 3 righe · 191px a 1280, 2 · 102 a 768, 3 · 114 a 390.

Quell'identità è fragile e dipende dalla lunghezza del corsivo. Il budget
ricevuto insieme al testo diceva «due righe, tetto 26 caratteri»: **era
sbagliato**. L'H1 ne rende tre, e con 26 e 23 caratteri sul corsivo ne rendeva
quattro — 63px più alto, con l'ultima parola orfana su una riga quasi vuota
(`text-balance` non salva, perché non bilancia attraverso il `<br />`).

Tetto vero, misurato a 1280px: **21 caratteri sul corsivo**, sul metro dei 20 di
`viaggiatori` che stanno su una riga sola. Chi aggiunge una variante rimisura.

## Cosa cambia altrove

`familyHomeLabel` passa da «Gravidanza» a «Da dove iniziare»: puntava a
`/family`, che è l'indice della sezione, quindi prometteva un tema e consegnava
un sommario. Le voci accanto — Consigli, Codici sconto, Chi siamo — nominano
tutte una pagina, e il tema lo dichiara già il commutatore sopra. L'etichetta
nuova non scade il giorno della nascita.

## Cosa resta aperto, e non è nostro

- Il sommario `family` dichiara che col piccolo non ci siete ancora andati. Il
  giorno in cui non è più vero, va riscritto — insieme alla descrizione in
  `audienceEditions.ts`, che dice «— presto — col piccolo».
- `/family/shop` resta *anteprima* finché non arrivano i codici sconto.
- Se le tre varianti devono diventare modificabili da `/admin` senza deploy,
  `siteContent.home.heroTitleMain / heroTitleAccent / heroDescription` esistono
  ma **non sono letti da nessuna pagina**: è modifica strutturale, non copy.
