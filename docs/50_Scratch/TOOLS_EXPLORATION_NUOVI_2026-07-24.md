---
type: strategy
area: growth
status: active
created: 2026-07-24
owner: growth-revenue-operator
related: '[[TOOLS_INTEGRATIONS_STRATEGY_2026-07-15]]'
tags:
  - growth
  - tools
  - place-page
  - favorites
  - analytics
---

# Strumenti-viaggio NUOVI — esplorazione oltre il piano 2026-07-15

Richiesta owner (FASE R, "Elevazione Totale"): oltre al verdetto sul posto, offrire
strumenti/servizi per aiutare l'utente a **organizzare il viaggio** usando i contenuti
che il sito ha gia' (29 posti reali con schede/verdetti, itinerari, guide, mappa).
Scelta owner esplicita: **esplorare idee NUOVE**, non richiedere il P1 gia' deciso.

Questa nota sta a valle di [[TOOLS_INTEGRATIONS_STRATEGY_2026-07-15]] (LOCKED) e ne
eredita tutti i vincoli. Non rilitiga nulla di quel documento.

## Metodo (uguale al doc 07-15: evidenza, non gusto)

Prima di proporre, tre verita' verificate oggi nel codice/vault:

1. **L'evidenza forte e' single-place, non multi-place.** I 918 commenti "DOVE?!" e i
   cluster Google Suggest documentano intento su **un posto** ("dove si trova / come ci
   arrivo / prenoto"). Questo e' gia' coperto dal P0 (live) e completato dal P1.
   **Non esiste evidenza osservata** che l'utente voglia _collezionare piu' posti in un
   viaggio_. Tutti i candidati "organizza il viaggio" qui sotto poggiano quindi su
   un'ipotesi di comportamento **non ancora misurata**. Lo dico esplicitamente: non
   invento domanda che non ho.

2. **I preferiti esistono ma oggi tengono solo articoli.** `FavoritesContext.tsx` salva
   slug (localStorage + Firestore), ma `Preferiti.tsx` risolve gli slug **solo contro gli
   articoli**: un posto salvato finirebbe nel ramo "non disponibili". Quindi appena il P1
   aggiunge "Salva" sulla pagina-posto, `Preferiti` **va comunque esteso** ai posti o si
   rompe. Questo da' un "why now" reale (non inventato) al candidato lista-viaggio.

3. **`ItinerariCompare.tsx` NON e' un motore di confronto riusabile.** E' contenuto demo
   statico (3 `DEMO_ITINERARIES` hardcoded). "Estenderlo" a un confronto di posti salvati
   sarebbe net-new, non un'estensione.

Dipendenza trasversale: **P1 (Salva sulla pagina-posto) e' il prerequisito** di quasi
tutto qui sotto. Il P1 e' lavoro separato dell'owner — questi candidati sono cio' che il
P1 abilita, non un suo sostituto.

## Vincoli ereditati (VINCOLO DURO — non aggirabili)

NON COSTRUIRE, per motivi gia' motivati nel doc 07-15 e in
[[10_Projects/PROJECT_ESPLORA_CONSOLIDATION]]:
quiz archetipi / calcolatori budget / audio guide (rimossi due volte, "non resuscitare");
DB orari/telefoni proprietario; motore di prenotazione interno; **motore di routing
proprietario**; chat/AI che inventa consigli; assicurazione/eSIM fuori contesto.
Regola contesto affiliate: mai instradare prenotazioni/WhatsApp di terzi su R+B.

---

## Candidati valutati

### A — "Lista viaggio": preferiti estesi ai posti, condivisibile + esportabile — VALIDARE (primo test)

- **Domanda reale**: "ho salvato 4-5 posti, come li tengo insieme per quando organizzo?"
  Estende un comportamento **gia' provato** (i preferiti esistono). Evidenza di
  collect-intent multi-posto: **assente oggi** — va misurata, non assunta.
- **Perche' e' il piu' solido**: non e' solo nice-to-have. Appena il P1 mette "Salva" sul
  posto, `Preferiti.tsx` deve comunque gestire i posti (oggi li scarterebbe). Il "why now"
  e' il completamento naturale del P1, non domanda inventata.
- **Effort**: R+B ~0h (lavoro dev). Dev medio: risoluzione slug-posto in `Preferiti`,
  vista "lista" che raggruppa i posti salvati, Condividi (pattern Web Share P0.3 gia'
  deciso), versione stampabile/printable. **Dipende da P1** (place-save).
- **Rischio brand**: basso. Contenuto owned, nessun terzo. Rischio solo se diventa un
  "planner tool" SaaS (finto-controllo, contro la quality-bar) — tenerlo editoriale.
- **Conflitto NON COSTRUIRE**: nessuno.
- **Verdict**: VALIDARE, ma **misurazione prima della feature** (vedi output contract).

### B — Percorso multi-tappa via deep-link Google Maps (delegato) — VALIDARE con vincolo stretto

- **Domanda reale**: "questi 4 posti in Toscana sono vicini? Ci sta un weekend?"
- **Vincolo duro**: SOLO deep-link Google Maps multi-waypoint dai posti salvati (Google
  calcola distanze/percorso). **Nessun calcolo di distanza o ordinamento in-app** = quello
  sarebbe il motore di routing proprietario vietato. Stesso principio del P0 (deleghiamo a
  Google, noi costruiamo il link).
- **Effort**: dev medio (~poche h per il link multi-tappa). Il rischio e' lo scope-creep
  verso un trip-builder (ordina tappe, raggruppa per giorno) = effort + SaaS-drift.
- **Rischio brand**: medio (registro aggregatore/finto-controllo se si esagera).
- **Conflitto**: borderline — accettabile SOLO nella versione delegata pura.
- **Verdict**: VALIDARE dopo A, e solo se A mostra collect-intent reale. Downstream di P1+A.

### C — Pagina "prima di partire": checklist editoriale scritta da R+B — SCARTARE (come "tool")

- **Domanda reale**: "cosa mi serve sapere/portare per questo tipo di viaggio?" Legittima
  e on-brand (voce R+B, people-led, non generata).
- **Perche' scartarlo come strumento nuovo**: non e' un tool, e' **contenuto**. Il sito ha
  gia' il formato `Lista pratica` (`FORMATS` in `contentTaxonomy.ts`). Una checklist
  "prima di partire" e' un articolo Lista pratica, non una nuova superficie.
- **Costo vero**: tempo di **scrittura R+B** (alto — e' il collo di bottiglia del brand),
  in competizione con i pillar gia' a calendario.
- **Verdict**: SCARTARE come "strumento". Se l'owner lo vuole, instradarlo come contenuto
  nel [[13_Content/CONTENT_CALENDAR_H2_2026]], non come esperimento growth.

### D — Confronto affiancato di 2-3 posti salvati — SCARTARE

- **Reality-check**: `ItinerariCompare.tsx` e' demo statico, non riusabile: sarebbe net-new.
- **Mismatch di registro**: il brand ha gia' **dato il verdetto** per ogni posto
  (scheda/voto). Una tabella-confronto ribalta la decisione sull'utente e mina la promessa
  "l'abbiamo gia' giudicato per te". I posti sono eterogenei (mirror house vs hotel spa):
  non confrontabili come SKU.
- **Rischio brand**: medio (registro aggregatore/SaaS, contro quality-bar; spirito vicino
  al "calcolatore" vietato).
- **Verdict**: SCARTARE. Domanda debole, registro sbagliato, dipendenza mal posta.

### E — Digest email "il tuo viaggio in Toscana" dai salvati+filtrati — SERVE PIU' DATO (gated)

- **Idea giusta, tempo sbagliato**: trasforma un salvataggio in un touch email owned
  (allineato: newsletter = conversione relazione primaria).
- **Blocco duro**: la newsletter **non e' live** (Brevo/Resend gated dall'activation gate).
  Un digest _personalizzato_ dai posti salvati richiede: P1 + place-save + automazione
  segmentata/triggered su una ESP non ancora attiva. Stack di dipendenze pesante.
- **Regola violata se forzato**: "no push prima che la delivery sia reale" (lead senza
  delivery). Il doc hub avverte esattamente contro questo.
- **Verdict**: SERVE PIU' DATO. Parcheggiare fino a Brevo/Resend attivi **e** dopo che A
  ha provato il collect-intent. Non prima.

---

## Sintesi verdict

| #   | Candidato                                  | Verdict            | Blocco principale                          |
| --- | ------------------------------------------ | ------------------ | ------------------------------------------ |
| A   | Lista viaggio (preferiti→posti, condividi) | **VALIDARE (1°)**  | downstream P1; misurare prima di costruire |
| B   | Percorso multi-tappa via Google Maps       | VALIDARE (dopo A)  | solo delegato; no routing engine           |
| C   | Checklist "prima di partire" editoriale    | SCARTARE (as tool) | e' contenuto, non tool; tempo R+B          |
| D   | Confronto affiancato posti salvati         | SCARTARE           | mismatch "verdetto gia' dato"; no evidenza |
| E   | Digest email personalizzato dai salvati    | SERVE PIU' DATO    | newsletter non live; downstream P1+A       |

---

## Raccomandazione: primo test (output contract, stile doc 07-15)

Il primo test **non e' una feature: e' una misura**. Prima di costruire qualunque
strumento-viaggio, provare che il collect-intent multi-posto esista davvero — a costo
quasi zero — e usarlo come cancello per A/B/E.

Recommendation: appena il P1 espone "Salva" sulla pagina-posto, strumentare il
comportamento di collezione (evento `place_favorite_add` gia' previsto nel doc 07-15 +
metrica derivata "sessioni con >=2 posti salvati") e lasciare che 2-4 settimane di
traffico reale decidano se il territorio "organizza il viaggio" e' reale, PRIMA di
costruire la Lista viaggio (A).
Hypothesis: se gli utenti salvano piu' di un posto nella stessa sessione con frequenza
misurabile, esiste una domanda di "raccolta viaggio" che oggi si perde; se salvano quasi
sempre un solo posto, l'intero territorio A/B/E e' un'ipotesi da abbandonare.
Why now: il P1 sta per aggiungere "Salva" sul posto; `Preferiti.tsx` andra' comunque
toccato per non scartare i posti salvati; e' il momento a costo minimo per attaccare
l'evento senza inventare domanda.
Smallest test: aggiungere l'evento `place_favorite_add { place_id, source:'posto' }` e la
metrica derivata "% sessioni con >=2 place-save" — nessuna nuova UI, nessun tempo R+B.
(La Lista viaggio A si costruisce SOLO se la soglia sotto e' superata.)
Primary metric: % di sessioni con >=1 place-save che ne salvano >=2. [VERIFY baseline con
travellini-data-analyst — nessun numero inventato qui.]
Kill criteria: se dopo traffico reale sufficiente la stragrande maggioranza dei salvataggi
resta a 1 posto/sessione, si abbandonano A/B/E come strumenti-viaggio e si resta su
single-place (P0/P1). Soglia go/no-go da fissare col data-analyst sul primo dato reale.
Effort: R+B ~0h. Dev ~1h per l'evento (nell'ambito del lavoro P1 su `Preferiti`); la
feature A e' ~mezza giornata dev, ma solo dopo il go.
Brand risk: minimo (solo analytics consent-gated). Il rischio vero e' costruire A/B/E su
un'ipotesi non verificata: questo test lo previene.

Artifacts to create or update:

- `docs/50_Scratch/TOOLS_EXPLORATION_NUOVI_2026-07-24.md`: questa nota (creata).
- `docs/10_Projects/PROJECT_SITE_V2_ADVANCED_IMPROVEMENT_PLAN.md`: aggiungere la metrica
  "collect-intent (>=2 place-save/sessione)" alla event taxonomy come cancello per gli
  strumenti-viaggio. [al greenlight owner]
- Quando A viene approvato: handoff a `seo-conversion-strategist` (microcopy IT lista +
  Condividi) → `ui-designer` (registro lista, no SaaS) → `frontend-builder`
  (`Preferiti.tsx` risolve posti + Web Share + vista stampabile; NO server.ts) →
  `quality-auditor` + `browser-auditor` (gate).

Next decision point: alla chiusura del P1 (place-save live), chiedere al data-analyst la
baseline collect-intent; sopra soglia → costruire A; sotto soglia → chiudere il territorio
e non aprire B/E.

## Aperte (owner / dato)

- Fissare la soglia go/no-go collect-intent col primo traffico reale (data-analyst).
- ~~Confermare che P1 espone "Salva" sul posto~~ — **verificato 2026-07-24: era già P0,
  non P1.** `Posto.tsx` salva il posto e spara `place_favorite_add` da prima di questa
  nota. Il vero gap era a valle: `Preferiti.tsx` risolveva gli slug SOLO contro gli
  articoli, quindi ogni posto salvato veniva mostrato come "non disponibile" — bug
  reale, non ipotetico, indipendente da qualunque decisione su A/B/E. **Corretto oggi**
  ([src/pages/Preferiti.tsx](../../src/pages/Preferiti.tsx)): risolve anche i posti via
  `getContentById`, sezione "Posti salvati" dedicata, `missingFavoritesCount` non conta
  più i posti come mancanti. Verificato typecheck + audit:ui (0 errori) + browser
  desktop/mobile con dati reali e un id fittizio. Nessuna nuova UI oltre la
  visualizzazione corretta di ciò che l'utente può già salvare oggi — non è
  l'implementazione del candidato A (nessuna vista-lista aggregata, nessun Condividi
  dedicato, nessuna versione stampabile).
- La misurazione `place_favorite_add` è quindi **già raccolta in produzione da quando
  P0 e' andato live**, non da avviare. Prossimo passo reale: chiedere al
  `travellini-data-analyst` la baseline "% sessioni con >=2 place-save" quando c'e'
  traffico sufficiente — nessuna nuova istrumentazione necessaria.
- Newsletter (Brevo/Resend) live: prerequisito duro per E, non toccare E prima.
