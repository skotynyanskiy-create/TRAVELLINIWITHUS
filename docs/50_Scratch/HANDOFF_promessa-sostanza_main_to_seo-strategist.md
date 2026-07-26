---
type: handoff
area: content
from: main-thread
to: travellini-seo-conversion-strategist
feature: promessa-sostanza
status: open
created: 2026-07-23
expires: 2026-08-06
related: '[[superpowers/specs/2026-07-22-promessa-sostanza-design]]'
---

# Handoff — copy per «promessa = sostanza»

## Contesto in tre righe

Il sito prometteva in navigazione più di quanto il contenuto mantenesse: Shop e
Itinerari primari ma `noindex`, `/mappa` senza `h1`, quattro nomi per lo Shop,
40 contenuti placeholder mai dichiarati. Un piano di 12 task ha chiuso la parte
strutturale. Restano quattro testi, lasciati provvisori apposta perché la copy
pubblica italiana non si improvvisa.

**Vincoli che valgono per tutti e quattro:** italiano, voce Rodrigo & Betta
(calda, diretta, specifica), nessun superlativo vuoto, nessun cliché da brochure.
**Nessun numero inventato**: l'unico dato verificato è **40 posti**. Non
introdurre prezzi, percentuali, conteggi di pubblico o date.

---

## 1. `/risorse` — title e h1

**Problema.** La pagina si chiamava in tre modi e il suo `h1` rubava la parola
«Strumenti» a `/strumenti`, che è una pagina diversa.

**Deciso dall'owner e già applicato ovunque:** la sezione si chiama
**«Cosa usiamo»** — navbar, footer, label admin.

**Cosa contiene davvero** (verificato): GetYourGuide, Heymondo, Skyscanner,
Booking, Airalo, Revolut, Splitwise, Peak Design, Sony A7IV, DJI Mini 3. Nove
domini in affiliazione dichiarata. È «le cose che usiamo noi», non «gli
strumenti che ti diamo noi» — quello è `/strumenti`.

**Da riscrivere:**

| Dove                          | Oggi                             |
| ----------------------------- | -------------------------------- |
| `<title>` (`Risorse.tsx:238`) | `Risorse di viaggio selezionate` |
| `h1` (`Risorse.tsx:261`)      | `Strumenti scelti con criterio`  |

**Vincolo forte:** la parola «Strumenti» non può comparire né nel title né
nell'`h1`. Appartiene a `/strumenti`.

Il paragrafo sotto l'`h1` («Questa non è una pagina di link a caso…») è buono:
toccalo solo se il nuovo `h1` lo rende ridondante.

---

## 2. `/shop` — description SEO

**Stato.** Superficie `soon`: nessun prodotto acquistabile, `noindex`, in
navigazione appare come «Shop presto». L'`h1` — «Gli strumenti di viaggio /
stanno prendendo forma» — è buono e **resta**.

**Da riscrivere** (`Shop.tsx:123`), unico residuo del vecchio nome:

> In questa **boutique** condividiamo i nostri strumenti di viaggio curati. Al
> momento i prodotti sono in anteprima: iscriviti alla lista d'attesa per essere
> avvisato al lancio!

Due problemi: dice «boutique» quando la pagina ora si chiama Shop ovunque, e ha
un punto esclamativo che stona col registro editoriale del resto del sito.

---

## 3. `/mappa` — testata editoriale

**Stato.** `/mappa` era l'unica pagina del sito senza `h1`. La testata è stata
reintrodotta con testo **provvisorio**, che devi confermare o sostituire.

```
occhiello:  Mappa delle tracce
h1:         Dove siamo stati davvero
deck:       Ogni segno e un posto che abbiamo provato di persona. 40 in tutto.
```

**Vincoli tecnici:**

- il deck è nascosto sotto 640px, quindi l'`h1` deve reggere da solo su mobile
- il numero **40** arriva da `allItems.length`, non è scritto a mano: non
  cambiarlo in un altro numero, e se lo togli dillo
- la testata occupa 134px di altezza: un `h1` che va a capo su due righe su
  desktop costa spazio alla mappa. Tienilo corto.
- nel deck manca l'accento su «e» (dovrebbe essere «è»): correggilo comunque

---

## 4. Domanda di posizionamento — non è copy, ma serve la tua lettura

Durante il lavoro è emerso che `/shop` ha **già** una lista d'attesa dedicata:
`<Newsletter variant="business" source="shop_waitlist_first_product" />`, con
titolo «Rimani vicino al progetto».

Sta però a **circa 3550px dall'inizio della pagina**: chi legge l'`h1` «stanno
prendendo forma» e si ferma lì non la vede mai.

Un tentativo di aggiungerne una seconda più in alto è stato revocato — creava
due catture email in competizione sulla stessa pagina. La domanda giusta non è
«quante», è **dove**.

Dimmi se secondo te la lista d'attesa esistente va spostata più in alto, e in
quel caso quale copy la introduce. Se invece pensi che stia bene dov'è, dillo:
è una risposta legittima e chiude il punto.

---

## Contratto di output

Per ognuno dei punti 1-3: il testo nuovo, in italiano, pronto da incollare.
Per il punto 4: una raccomandazione motivata in tre righe.

Segna `[VERIFY: ...]` qualsiasi affermazione che non puoi verificare dal
repository. Non produrre copy per pagine diverse da queste.
