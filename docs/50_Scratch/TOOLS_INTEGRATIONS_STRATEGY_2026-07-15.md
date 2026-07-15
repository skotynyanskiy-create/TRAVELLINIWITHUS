---
type: strategy
area: growth
status: active
created: 2026-07-15
owner: growth-revenue-operator
source: evidence pack 2026-07-15 (reel Burton Juice comments + Google Suggest + IG_CONTENT_ANALYSIS)
related: '[[10_Projects/PROJECT_SITE_V2_ADVANCED_IMPROVEMENT_PLAN]]'
tags:
  - growth
  - tools
  - integrations
  - place-page
  - analytics
---

# Strumenti-visitatore e integrazioni — decisione 2026-07-15

## Insight che comanda tutto (North Star di questa decisione)

La domanda dominante, ripetuta, sotto un reel da 63K like / 918 commenti e' una sola:
**"DOVE si trova?"**. Il reel non lo dice. Google Suggest lo conferma su tre cluster
(`the burton juice napoli/parcheggio/prenotazioni`, `posti particolari dove mangiare
[citta]`, `... vicino a me`): il nome del brand e' gia' una query di intento locale.

> Il lavoro numero uno del sito e' essere la risposta definitiva che la sezione
> commenti di Instagram sta gia' chiedendo a voce alta. Se una pagina-posto non
> risolve "dove" e "come ci arrivo" sopra la piega, ha fallito — a prescindere da
> quanto sia bella.

Tutto il resto (prenotazione, orari, dettagli esperienza, condivisione) e'
secondario ma necessario per chiudere il ciclo intento -> azione. La leva
strategica: la maggior parte di queste risposte **NON va costruita da zero**, va
**delegata a Google** (Maps + Business Profile), che e' gia' la fonte canonica di
indirizzo, orari, telefono, prenota. Noi costruiamo il link derivato; Google mette
il dato. Costo owner ~zero, copertura immediata su tutti i ~40 posti.

---

## Mappatura evidenza -> domanda -> strumento

| Domanda reale (evidenza)              | Cluster            | Strumento che la chiude                                                    | Chi possiede il dato |
| ------------------------------------- | ------------------ | -------------------------------------------------------------------------- | -------------------- |
| "Dove si trova? / ma dove e'?"        | commenti + Suggest | Indirizzo visibile + **Indicazioni (Google Maps deep-link)** + pin         | derivato (noi)       |
| "Come prenoto? / i contatti?"         | commenti + Suggest | **Vedi su Google** (Business Profile) + link ufficiale/telefono se forniti | Google + owner opz.  |
| "Ma e' sempre aperto?" (orari)        | commenti           | Orari delegati a Google ("Vedi orari") o campo owner opz.                  | Google + owner opz.  |
| "C'e' qualcosa a tema X?" (dettagli)  | commenti + Suggest | hook + descrizione + scheda recensione + tag tema                          | noi (gia' esiste)    |
| Tag-a-friend "dobbiamo andare"        | commenti           | **Condividi (Web Share API)** + Salva nei preferiti                        | noi (gia'/costruire) |
| "dove mangiare [citta] / vicino a me" | Suggest            | filtro geo "vicino a me" su Esplora/Mappa + pagine-citta                   | noi (costruire)      |

---

## 1. Strumenti-visitatore prioritizzati

Legenda stato: **[ESISTE]** da esporre meglio · **[COSTRUIRE]** nuovo ·
**[NON COSTRUIRE]** con motivo.

### P0 — la pagina-posto deve risolvere "dove" e "come ci arrivo/prenoto"

1. **Blocco "Dove si trova" con Indicazioni** — risponde: _dove si trova_ (domanda dominante).
   **[COSTRUIRE]**. Oggi `Posto.tsx` mostra solo `city, region, country` come testo e un
   bottone "Apri sulla mappa" che porta alla `/mappa` generica (non al pin). Serve:
   riga indirizzo + bottone **Indicazioni** che apre Google Maps con deep-link derivato
   da coordinate (o da `nome + citta` quando le coordinate mancano). Zero dato owner:
   funziona su tutti i posti gia' oggi. Questo e' il singolo cambiamento a piu' alto
   ritorno di tutta la lista.

2. **Blocco "Prenota / Contatti / Orari" via Google Business** — risponde: _come prenoto,
   contatti, orari_. **[COSTRUIRE]**. Un link **"Vedi su Google"** (deep-link Business
   Profile da `nome + citta`) che porta alla scheda dove Google mostra gia' orari,
   telefono, "Prenota", recensioni. Delega la fonte canonica invece di ricostruirla.
   Progressive enhancement: se l'owner fornisce `bookingUrl` / `phone` / `hours`, si
   rendono come blocchi nativi; se no, resta il link Google. Rende su tutti i posti da
   subito, migliora quando l'owner compila.

3. **Condividi (Web Share API)** — risponde: _tag-a-friend "dobbiamo andare"_.
   **[COSTRUIRE]**. Bottone "Manda a chi ci deve venire" che apre lo share sheet nativo
   (mobile -> WhatsApp/gruppo in un tap). Sul desktop, fallback copia-link. Copre il
   comportamento social del gruppo meglio di un `wa.me` fisso. Zero dato owner, solo
   frontend. Da affiancare al "Salva" gia' esistente.

4. **Salva nei preferiti dalla pagina-posto** — risponde: _pianificazione ("dobbiamo andare")_.
   **[ESISTE]** (FavoritesContext + Preferiti). Va **esposto sulla pagina-posto** con CTA
   esplicita accanto a Condividi; oggi il save e' presente su card/quick-view ma la
   pagina-posto non ha un'azione salva chiara.

### P1 — discovery per intento locale e relazione

5. **Filtro "vicino a me" (geolocalizzazione) su Esplora/Mappa** — risponde:
   _"dove mangiare [citta] / vicino a me"_ (pattern Suggest fortissimo). **[COSTRUIRE]**.
   Browser Geolocation API, consenso esplicito, ordina i posti per distanza. Nessun dato
   owner. Chiude l'intento geo che oggi si perde su Google.

6. **Pagine-citta / hub geo** — risponde: _"posti particolari dove mangiare [milano/torino/
   napoli...]"_. **[ESISTE parziale]** (Esplora ha facets in URL; le destinazioni coprono
   regioni/paesi, non citta). Da valutare route citta indicizzabili solo quando c'e' massa
   critica di posti per quella citta (>=3). Cattura long-tail che IG non da'.

7. **CTA community Telegram** — risponde: _pianificazione sociale + relazione_.
   **[ESISTE fuori sito]** (community Telegram gia' attiva, link in bio). **[COSTRUIRE]** =
   esporla sul sito come CTA relazione secondaria (footer / `/vieni-con-noi` / preferiti),
   **non** in competizione testa-a-testa con la newsletter su ogni pagina. Owned email >
   canale in affitto: la newsletter resta la conversione primaria di relazione.

8. **Affiliate contestuali (assicurazione / attivita / eSIM)** — risponde: _monetizzazione
   validata_ (la caption in leetspeak spinge gia' sconti+assicurazione+escursioni).
   **[ESISTE parziale, DUE SISTEMI SEPARATI — verificato nel codice]**:
   (a) `src/lib/affiliateLink.ts` + `DealCard` = builder generico gated da env var,
   copre Skyscanner/Booking/Airalo/Revolut, **tutti e 4 disabilitati** (nessuna env
   var settata oggi); (b) Heymondo e GetYourGuide sono **gia' live e cliccabili**,
   ma come link hardcoded in `src/pages/Risorse.tsx` (pagina "Cosa usiamo"), fuori
   dal builder. Per portare Heymondo/GetYourGuide su una pagina-posto contestuale
   (es. biglietti GetYourGuide su un'attrazione), riusare lo stesso pattern URL di
   Risorse.tsx — non assumere che passino da `affiliateLink.ts`. Consolidare i due
   sistemi e' un miglioramento futuro, non un blocker per il P0/P1.

### P2 — utile ma dipende da dato owner o da traffico reale

9. **Prenotazione ristorante nativa (link ufficiale / TheFork)** — **[COSTRUIRE, gated]**.
   Solo con `bookingUrl` fornito dall'owner per-posto; altrimenti resta il link Google
   (che gia' espone "Prenota"). Non costruire un motore di prenotazione.

10. **Biglietti parchi/attrazioni (GetYourGuide / link ufficiale)** — **[COSTRUIRE, gated]**.
    Solo su posti di tipo attrazione/esperienza (Movieland, Caneva, Horror Park sono
    partner reali di luglio). Su un ristorante locale non ha senso. Contestuale al tipo.

11. **WhatsApp booking per-posto (`wa.me`)** — **[COSTRUIRE, gated]**. Solo se il posto
    fornisce un suo numero. **Mai** instradare a R+B: diventerebbero il call-center di
    ristoranti terzi (rischio brand + carico di supporto insostenibile). Preferire Google
    "Prenota". Il Web Share (P0.3) copre gia' l'uso "manda al gruppo".

### NON COSTRUIRE (e perche')

- **Quiz archetipi / calcolatori budget / audio guide** — gia' rimossi in passato. Non
  rispondono a nessuna delle 5 domande reali; aggiungono peso e finto-controllo (anti
  quality-bar). Non resuscitare.
- **Database orari/telefoni proprietario** — ricostruirebbe Google Business a mano, dato
  che invecchia e ci rende responsabili di info sbagliate su attivita' terze. Delegare a
  Google.
- **Motore di prenotazione interno** — fuori scope, fuori banda owner, rischio post-vendita.
- **Chat/AI che inventa consigli** — vietato dal principio "no AI pubblica che inventa"
  del piano V2. La scheda recensione reale e' il registro giusto.
- **Assicurazione/eSIM su ogni pagina-posto** — su un ristorante italiano un widget
  "assicurazione viaggio" e' fuori contesto e brucia fiducia (vedi regola contesto).

---

## 2. Integrazioni esterne da predisporre

| Integrazione                                         | A cosa serve                                    | Effort (R+B / noi)                 | Prerequisiti                                    | Chi possiede |
| ---------------------------------------------------- | ----------------------------------------------- | ---------------------------------- | ----------------------------------------------- | ------------ |
| **Google Maps directions** (deep-link)               | risponde "dove / come ci arrivo"                | R+B 0h · noi ~2-3h                 | nessuno (deriva da coordinate o nome+citta)     | noi          |
| **Google Business Profile** (deep-link)              | risponde "prenota / contatti / orari" delegando | R+B 0h · noi ~1-2h                 | nessuno (deriva da nome+citta)                  | noi + Google |
| **Web Share API** (condividi)                        | tag-a-friend, pianificazione di gruppo          | R+B 0h · noi ~1-2h                 | nessuno                                         | noi          |
| **Geolocation "vicino a me"**                        | intento "dove mangiare vicino a me"             | R+B 0h · noi ~3-4h                 | consenso browser; coordinate popolate sui posti | noi          |
| **Telegram community**                               | canale relazione secondario                     | R+B ~10min (dare URL) · noi ~1h    | link community ufficiale in `site.ts`           | owner        |
| **Heymondo (assicurazione)**                         | affiliate su guide internazionali               | gia' attivo · noi contestualizzare | nessuno (gia' attivo)                           | owner/attivo |
| **GetYourGuide (attivita/biglietti)**                | affiliate su esperienze/attrazioni              | gia' attivo · noi contestualizzare | nessuno (gia' attivo)                           | owner/attivo |
| **Airalo (eSIM)**                                    | affiliate su guide extra-UE                     | R+B ~20min signup · noi ~1h        | `VITE_AFFILIATE_AIRALO_ID` in env               | owner        |
| **Booking / Skyscanner / Revolut**                   | affiliate hotel/voli/carta                      | R+B ~60min signup · noi wired      | rispettivi `VITE_AFFILIATE_*_ID`                | owner        |
| **Prenotazione ristoranti** (link ufficiale/TheFork) | prenota nativo su posto                         | R+B per-posto · noi ~1-2h          | `place.bookingUrl` per-posto                    | owner        |
| **Biglietti parchi** (GYG/ufficiale)                 | biglietti su attrazioni/parchi                  | R+B per-posto · noi ~1h            | link per-posto o tipo attrazione                | owner + noi  |
| **WhatsApp booking per-posto**                       | prenota via WhatsApp del locale                 | R+B per-posto (raro) · noi ~1h     | numero WhatsApp del posto (NON di R+B)          | il posto     |

Nota affiliate: il builder `src/lib/affiliateLink.ts` restituisce gia' l'URL base pulito
finche' il partner e' disabilitato — sicuro da spedire. Nessuna spesa/attivazione va fatta
prima che signup + tracking + contesto siano reali (regola: no paid prima di offer+tracking
+delivery+support reali).

### Regola di contesto affiliate (per non bruciare fiducia)

- **Ristorante / food locale (IT)** -> NIENTE assicurazione/eSIM/voli. Solo: Indicazioni,
  Google, Condividi, eventuale `bookingUrl`/deal reale.
- **Attrazione / parco / esperienza** -> biglietti (GetYourGuide/ufficiale) coerenti.
- **Destinazione / guida internazionale** -> assicurazione (Heymondo) + eSIM (Airalo) +
  hotel (Booking) sono in contesto e utili.
- Sempre `rel="sponsored noopener"` sui commerciali; deal reali soltanto (mai inventati).

---

## 3. Contratto informativo minimo della pagina-posto

Ogni pagina-posto deve rispondere alle 5 domande **sopra la piega dove possibile**. I dati
owner sono opzionali e progressive-enhancement: il fallback derivato copre sempre il minimo.

1. **DOVE (obbligatorio, sopra la piega).**
   - riga luogo leggibile: `nome del posto — citta, regione, paese`
   - **bottone Indicazioni** -> Google Maps (deep-link da coordinate, o da nome+citta)
   - pin/mappa collegato al punto reale (non alla `/mappa` generica)

2. **PRENOTA / CONTATTI (obbligatorio come minimo delegato).**
   - **"Vedi su Google"** -> Business Profile (mostra prenota/telefono/orari)
   - se owner fornisce: `bookingUrl` (link ufficiale) e/o `phone` (`tel:`) come blocchi nativi

3. **ORARI (minimo delegato).**
   - link "Vedi orari su Google" (stesso Business Profile)
   - se owner fornisce `hours`: render nativo (es. "Mar-Dom 19:00-23:00")

4. **COSA ASPETTARSI / dettagli esperienza (obbligatorio, gia' presente).**
   - hook (h1) + descrizione R+B + scheda recensione (voto/criteri/pro/contro)
   - tag tema esplicito quando pertinente (es. "a tema Tim Burton")
   - CTA "Guarda il reel" (permalink IG) — gia' presente

5. **CONDIVIDI / SALVA (obbligatorio).**
   - **Condividi** (Web Share / copia-link) "manda a chi ci deve venire"
   - **Salva nei preferiti** con CTA esplicita sulla pagina-posto

Campi nuovi (opzionali) da aggiungere a `ContentPlace` / `ContentItem`, stesso pattern
render-solo-se-presente di `review`/`deal`: `place.address`, `place.hours`, `place.phone`,
`place.website`, `place.bookingUrl`, `place.googlePlaceQuery` (override della query Google).
Nessun dato inventato: se manca, si usa il derivato Google e basta.

---

## 4. Analytics contract (per validare gli strumenti)

Eventi nuovi/da confermare, oltre a quelli gia' in `analytics.ts` (newsletter, media kit,
affiliate_click, favorite_add). Tutti consent-gated dal `trackEvent` esistente.

| Evento                       | Quando                            | Proprieta'                               | Serve a validare      |
| ---------------------------- | --------------------------------- | ---------------------------------------- | --------------------- |
| `place_directions_click`     | click "Indicazioni"               | `place_id`, `has_coordinates` (bool)     | domanda "dove" (P0.1) |
| `place_google_listing_click` | click "Vedi su Google"            | `place_id`                               | prenota/orari (P0.2)  |
| `place_booking_click`        | click link ufficiale/`bookingUrl` | `place_id`, `provider`                   | prenota nativo (P2.9) |
| `place_phone_click`          | click `tel:`                      | `place_id`                               | contatti (P0.2)       |
| `place_share_click`          | click Condividi                   | `place_id`, `method` (`native`\|`copy`)  | tag-a-friend (P0.3)   |
| `place_favorite_add`         | salva dalla pagina-posto          | `place_id`, `source: 'posto'`            | pianificazione (P0.4) |
| `place_reel_click`           | click "Guarda il reel"            | `place_id`                               | ritorno a IG          |
| `nearby_search_use`          | attiva "vicino a me"              | `results_count`, `radius_km`             | intento geo (P1.5)    |
| `telegram_community_click`   | click CTA Telegram                | `source` (page)                          | relazione (P1.7)      |
| `affiliate_click`            | click affiliato (gia' previsto)   | `partner`, `context`, `place_id`, `type` | monetizzazione (P1.8) |

Soglie di successo iniziali (go/no-go, da rivalutare col primo traffico reale — no numeri
inventati sull'audience):

- **`place_directions_click`**: e' la metrica primaria dell'intera decisione. Target: >=15%
  dei visitatori pagina-posto cliccano Indicazioni o "Vedi su Google". Se <5% dopo traffico
  reale sufficiente -> la pagina non risolve "dove", ripensare il layout.
- **`place_share_click`**: >=3% dei visitatori pagina-posto. Sotto -> il tag-a-friend non
  si traduce, valutare posizione/copy del bottone.
- **`nearby_search_use`**: >=8% delle sessioni Esplora/Mappa mobile. Sotto -> feature di
  nicchia, non promuoverla.

---

## 5. Sintesi decisione (output contract)

Recommendation: fare della pagina-posto la risposta definitiva a "dove/come ci arrivo/prenoto"
delegando a Google (Maps + Business) e aggiungendo Condividi/Salva — prima di ogni nuova feature.
Hypothesis: esporre indirizzo + Indicazioni + "Vedi su Google" + Condividi sopra la piega
converte il traffico-commenti IG ("dove?!") in visite utili e azioni, che oggi si perde.
Why now: c'e' evidenza fresca e non ambigua (918 commenti "dove", Google Suggest geo, il
nome-brand e' gia' query) e la pagina-posto e' appena stata potenziata con la scheda recensione,
quindi il momento per chiudere il contratto informativo e' adesso.
Smallest test: aggiornare `Posto.tsx` con i tre link derivati (Indicazioni, Vedi su Google,
Condividi) + evento `place_directions_click`, su tutti i posti, senza chiedere dati all'owner.
Primary metric: `place_directions_click` >=15% dei visitatori pagina-posto.
Kill criteria: <5% click Indicazioni/Google dopo traffico reale sufficiente -> il layout non
risolve "dove", si ripensa.
Effort: R+B ~0h per il P0 (tutto derivato); ~90min una-tantum per completare i signup affiliate;
~10min per dare l'URL Telegram. Il resto e' lavoro nostro.
Brand risk: instradare prenotazioni/WhatsApp di terzi su R+B li trasforma in customer service
(no, mai); mettere affiliate fuori contesto (assicurazione su un ristorante) brucia fiducia
(regola di contesto sopra).

Artifacts to create or update:

- `docs/50_Scratch/TOOLS_INTEGRATIONS_STRATEGY_2026-07-15.md`: questo documento (creato).
- `docs/10_Projects/PROJECT_SITE_V2_ADVANCED_IMPROVEMENT_PLAN.md`: aggiungere al backlog
  `/posto/:slug` il contratto informativo minimo (dove/prenota/orari/condividi) e gli eventi
  place\_\* alla event taxonomy (sezione 11). [al greenlight owner]
- `docs/MARKETING_OPERATIONS_HUB.md`: annotare Telegram community come canale relazione
  secondario e la regola di contesto affiliate. [al greenlight owner]

Next decision point: quando l'orchestratore chiude l'handoff burton-juice, usare quella pagina
come primo pilota del contratto informativo (e' il posto con la domanda "dove" piu' forte) e
misurare `place_directions_click` prima di estendere agli altri ~40 posti.

---

## 6. Handoff a valle (quando l'owner da' il via)

Catena consigliata per implementare il P0 (contratto informativo pagina-posto):

1. `travellini-seo-conversion-strategist` — label/microcopy IT dei blocchi (Indicazioni,
   Vedi su Google, Orari, Condividi) + eventuale JSON-LD `openingHours`/`telephone` quando
   il dato owner esiste.
2. `travellini-ui-designer` — come si vedono i blocchi "Dove / Prenota / Orari / Condividi"
   sulla pagina-posto, coerenti col registro calmo (no banner spammosi).
3. `travellini-frontend-builder` — `Posto.tsx` + nuovi campi opzionali in `ContentPlace` +
   deep-link derivati + eventi `place_*`. NON toccare `server.ts`.
4. `travellini-quality-auditor` + `browser-auditor` — gate (a11y, no overflow mobile, link
   corretti, eventi che sparano).

Locked (non rilitigare): (a) "dove" e' priorita' 1; (b) orari/prenota si delegano a Google
finche' l'owner non fornisce il dato; (c) niente WhatsApp/prenotazione instradati su R+B;
(d) niente affiliate fuori contesto; (e) niente quiz/calcolatori/audioguide.
Aperte (owner): completare signup affiliate; fornire URL Telegram; decidere se/quali posti
avranno `bookingUrl`/`hours`/`phone` nativi.
