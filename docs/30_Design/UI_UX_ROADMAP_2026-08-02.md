---
type: plan
area: design
status: active
created: 2026-08-02
tags:
  - ui
  - ux
  - accessibility
---

# Roadmap UI/UX — 2026-08-02

Seguito operativo di `UI_UX_AUDIT_2026-08-02.md`. Ordinata per rapporto
impatto/rischio, non per gusto.

## Fatto in questa sessione

| Intervento                                                   | File                         | Verifica                          |
| ------------------------------------------------------------ | ---------------------------- | --------------------------------- |
| Marchio navbar ad AA + token morto rimosso                   | `Navbar.tsx:322`             | computed `rgb(194,65,12)`         |
| Voce nav attiva ad AA                                        | `Navbar.tsx:405`             | axe 0 violazioni                  |
| Testo terziario ad AA sui temi                               | `index.css` (family + brand) | 4,99 / 5,01 calcolati             |
| Etichette statistiche non più duplicate                      | `HomeAudienceVoice.tsx`      | 1 occorrenza per etichetta        |
| Conteggio griglia derivato dai dati                          | `CleanFeaturedGrid.tsx`      | stringa identica, 9 tile          |
| **R1** — `--shadow-soft` inesistente → focus ring spento     | `ContentCard.tsx:46`         | anello e ombra tornano            |
| **R1** — chip filtri senza focus                             | `Shop.tsx:190`               | `outlineStyle: none → solid`      |
| **R1** — barra di ricerca senza focus                        | `Esplora.tsx:498`            | ring sul contenitore, 2px accento |
| **R2** — guard sui token inesistenti                         | `scripts/check-ui.mjs`       | reintroducendo il bug: exit 1     |
| **R2** — marchio del PageLoader ad AA + `--color-gold` morto | `App.tsx:84,89`              | 0 token mai definiti              |
| **R3** — contrasto dei token contro ogni tema                | `scripts/check-ui.mjs`       | base, family e brand ≥ 4,5:1      |
| **R6** — target tattili del drawer mobile                    | `Navbar.tsx`                 | controlli ≥ 44×44px               |
| **R7** — preload hero verificato in produzione               | `index.html` + hero          | usato; LCP = titolo H1             |
| **R8** — audit axe ripetibile via Playwright                 | `check-a11y.mjs`             | 4 rotte, 0 violazioni              |
| **R9** — artefatti Functions esclusi dal lint                | `eslint.config.js`           | `npm run lint` verde               |
| **R10** — H1 hero visibile al primo paint                    | hero cinematic               | LCP locale 7,4 → 6,5 s             |

Regressione: `typecheck` OK · `test:unit` 179/179 · `audit:ui` exit 0 · axe **8 → 0** ·
focus: **0 controlli senza affordance** su 554.

---

## Prossimo — alto valore, basso rischio

### ~~R1. Passata sui 28 `focus-visible:ring`~~ — **FATTA**

Esito diverso dalla previsione. Il ring **non era rotto**: la diagnosi che aveva
motivato R1 era un artefatto di misura (box-shadow troncata a 90 caratteri). I
29 componenti funzionano.

La passata corretta — 554 elementi, Tab reale, 8 rotte, indicatore cercato anche
sui discendenti — ha trovato **un solo** controllo davvero senza focus:
`ContentCard.tsx:46`, e per un motivo che nessuna revisione del pattern focus
avrebbe trovato: `shadow-[var(--shadow-soft)]` con `--shadow-soft` **mai
definito**, che invalida l'intera catena `box-shadow` e con essa l'anello.

Risolto. Vedi §4 dell'audit.

### ~~R2. Una var inesistente non deve poter passare~~ — **FATTA**

Il difetto di R1 era invisibile a ogni controllo: `typecheck` non entra nelle
stringhe di classe, `audit:ui` cercava colori grezzi, axe non valuta il focus, e
la CSS resta formalmente valida. Aveva attraversato tutto.

`scripts/check-ui.mjs` ora raccoglie i token dichiarati (CSS del progetto +
`index.html` + le var impostate inline da JSX) e verifica ogni `var(--x)` usata
nei `.tsx`:

- **errore** se il token non esiste e non c'è fallback — dentro un valore
  arbitrario invalida l'intera dichiarazione;
- **warn** se c'è un fallback — degrada, ma resta codice morto.

`--tw-*` è escluso (interni di Tailwind).

**Il guard è stato provato, non solo scritto**: reintroducendo `--shadow-soft` in
`ContentCard.tsx`, `audit:ui` lo segnala come ERROR ed esce 1. Ripristinato il
fix, esce 0. Un guard che non si vede fallire non è un guard.

Trovato e corretto anche l'ultimo token morto: `--color-gold` in `App.tsx:89`,
che rendeva sempre e solo il fallback oro — un colore che il design system non
ha. Il gradiente del loader ora usa due token veri. Nello stesso punto il
marchio ripeteva la violazione AA della navbar (`--color-accent` come testo):
allineato a `--color-accent-text`.

**Token mai definiti nel repo: 0.**

### ~~R3. Chiudere la checklist dei token~~ — **FATTA**

`audit:ui` ora legge il blocco `@theme` e ogni override audience, risolve il
valore effettivo di `--color-sand` e calcola il contrasto dei token di testo.
Fallisce sotto 4,5:1 oppure se un colore non è verificabile. Un tema nuovo non
può quindi introdurre testo poco leggibile confidando nei commenti CSS.

Il guard resta dentro `scripts/check-ui.mjs`, quindi è già incluso in
`audit:quality`.

---

## Da decidere — richiede l'owner

### ~~R4. La home ripete se stessa~~ — **fatta il 2026-08-02**

10,8 schermate, quattro collezioni di posti, otto `h2` che riaffermano la stessa
promessa. Non è un bug: è una scelta di composizione, e va cambiata solo se
l'owner è d'accordo.

La leva esiste già ed è pulita: `sections` in `homeComposition.ts:151`. Nessuna
riscrittura, si tocca un array.

Tre opzioni, in ordine di coraggio:

1. **Togliere `featured` da `viaggiatori`** (−1.026px). `featured` mostra 3 posti
   che `grid` ripropone poche centinaia di pixel più sotto con 9. È la
   ridondanza più letterale della pagina, e `CURATED_IDS` già li esclude dalla
   griglia — quindi il lettore vede due volte lo _stesso tipo_ di blocco, non lo
   stesso contenuto. Costo: una riga. Reversibile all'istante.
2. **Differenziare i titoli.** Se le sezioni restano tutte, almeno smettano di
   dire la stessa cosa: la mappa parli di _dove_, i reel di _come si vede_,
   l'indice di _tutto l'archivio_. Lavoro di copy, non di codice — rotta
   `seo-conversion-strategist`.
3. **Lasciare tutto.** Legittimo: la ripetizione martella il posizionamento. Ma
   allora vale la pena misurare lo scroll-depth reale prima di aggiungere altro.

**Raccomandazione:** opzione 1 + 2. La 1 costa una riga e toglie la ridondanza
più visibile; la 2 recupera valore dalle sezioni che restano.

Scelta applicata: rimosso `featured` da Viaggiatori, promossi nella griglia i
contenuti curati e differenziate le intestazioni di selezione, mappa, reel e
archivio. Il contenuto resta completo, senza doppie collezioni consecutive.

### R5. Il gate d'ingresso come interstiziale — **P2, misurazione in corso**

Il sito apre con una modale bloccante prima di qualsiasi contenuto. Ora è
accessibile da tastiera, ma resta una domanda di prodotto: **è il primo
ostacolo fra il visitatore e la prima riga di testo.**

Il gate serve l'architettura dei temi ed è una scelta deliberata, quindi non è
stato toccato. Il codice è pronto a inviare a GA4, solo dopo consenso analytics,
una vista del gate, una scelta audience oppure una chiusura con metodo button/Esc.
I tre eventi non vengono inoltrati a Meta o TikTok e non contengono dati
personali. L'ambiente locale non ha `VITE_GA_ID`, quindi la ricezione nella
proprietà GA4 va confermata nell'ambiente di produzione prima del conteggio.

**Protocollo di misura (owner):**

1. Verificare che `VITE_GA_ID` sia impostato nell'ambiente di produzione, poi
   validare in GA4 DebugView un opt-in analytics seguito da una vista, una
   scelta e una chiusura del gate.
2. Registrare come dimensioni personalizzate event-scoped i tre parametri
   `entry_path`, `audience` e `method`; servono per leggere i valori nei report
   e diventano disponibili dopo l'elaborazione GA4.
3. Annotare la data del primo evento confermato; da quel punto attendere almeno
   14 giorni **e** 300 `audience_gate_view` prima di modificare il prodotto.

| Lettura | Formula | Risposta alla domanda di prodotto |
| --- | --- | --- |
| Scelta audience | `audience_gate_select / audience_gate_view` | Il gate orienta davvero? |
| Decido dopo | `audience_gate_dismiss / audience_gate_view` | Il gate viene soprattutto evitato? |
| Ripartizione scelte | `audience` su `audience_gate_select` | Family e B2B meritano un ingresso dedicato? |
| Modalità di chiusura | `method` su `audience_gate_dismiss` | Il tasto è sufficiente o il gate è troppo intrusivo? |

Se le chiusure superano stabilmente le scelte, il passo successivo è un pilot
senza gate: audience inferita dalla rotta di ingresso e switcher in navbar. È
una modifica di prodotto, quindi richiede approvazione owner dopo la lettura.

**Alternativa se il dato è brutto:** inferire l'audience dalla rotta d'ingresso
(`audienceFromPath` esiste già) e offrire lo switch in navbar senza bloccare.

---

## Rifiniture — quando c'è tempo

- **~~R6. Target tattili del drawer mobile~~ — FATTA (2026-08-02).** Voci di
  navigazione, chip audience, chiusura, ricerca, CTA compatta, link B2B,
  azioni social e accesso hanno ora un'area di almeno 44×44px. Il contenuto e
  la gerarchia del drawer restano invariati.
- **~~R7. Preload hero~~ — FATTA (2026-08-02).** La build Vite isolata e la
  preview di produzione confermano che il preload AVIF della hero viene usato;
  Lighthouse non segnala preload inutilizzati. L'LCP locale rilevato è il
  titolo H1 (non l'immagine), quindi non è giustificata una modifica alla hero.
- **~~R8. Audit accessibilita' ripetibile~~ — FATTA (2026-08-02).**
  `npm run audit:a11y` inietta l'axe-core gia' disponibile nel progetto in un
  browser Playwright e conserva le quattro rotte e i tag WCAG del controllo
  precedente. Non usa ChromeDriver, quindi non dipende piu' dalla versione di
  Chrome installata sul computer.
- **~~R9. Escludere `functions/lib/` dal lint~~ — FATTA (2026-08-02).** La
  configurazione corrente esclude gli artefatti compilati `functions/lib/` e
  `functions/node_modules/`; `npm run lint` torna verde senza nascondere il
  codice sorgente di `functions/src/`.
- **~~R10. H1 hero senza doppia animazione~~ — FATTA (2026-08-02).** L'H1
  LCP non viene piu' nascosto dalle animazioni iniziali del wrapper e della
  hero. Nella stessa preview di produzione locale, LCP passa da 7,4 a 6,5 s e
  il ritardo di rendering dell'H1 da 1,22 a 0,59 s; e' una misura diagnostica
  locale, non sostituisce i Core Web Vitals reali.

## Non fare

- Sostituzione di massa delle 226 occorrenze di `text-[var(--color-accent)]`:
  sono quasi tutte icone, per cui la soglia è 3:1 e l'uso è corretto.
- Redesign. Il sistema di design è coerente e già verificato; i difetti trovati
  erano punti in cui il sistema veniva aggirato, non il sistema stesso.
- Aggiungere motion. Console pulita, CLS già a posto: non è lì il collo di
  bottiglia.
