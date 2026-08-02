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

Regressione: `typecheck` OK · `test:unit` 154/154 · `audit:ui` exit 0 · axe **8 → 0** ·
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

### R3. Chiudere la checklist dei token — **P2**

`DESIGN.md` ora include `muted-fg` fra i contrasti da verificare. Renderlo
**eseguibile**: uno script che calcola ogni token di testo contro ogni
`--color-sand` di tema e fallisce sotto 4,5. Un tema nuovo non deve poter entrare
con un contrasto non verificato — è esattamente come è passato questo.

Aggancio naturale: `scripts/check-ui.mjs`, già in `audit:quality`.

---

## Da decidere — richiede l'owner

### R4. La home ripete se stessa — **P2**

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

**Da verificare prima:** scroll-depth e tasso di arrivo all'`indice-vivo`. Se
quasi nessuno arriva in fondo, la discussione cambia — e il dato è
`travellini-data-analyst`, non un'opinione di design.

### R5. Il gate d'ingresso come interstiziale — **P2**

Il sito apre con una modale bloccante prima di qualsiasi contenuto. Ora è
accessibile da tastiera, ma resta una domanda di prodotto: **è il primo
ostacolo fra il visitatore e la prima riga di testo.**

Il gate serve l'architettura dei temi ed è una scelta deliberata, quindi non è
stato toccato. Vale però misurare quanti lo chiudono con «Decido dopo» e quanti
abbandonano: se la maggioranza rimbalza, la personalizzazione sta costando più
di quanto rende.

**Alternativa se il dato è brutto:** inferire l'audience dalla rotta d'ingresso
(`audienceFromPath` esiste già) e offrire lo switch in navbar senza bloccare.

---

## Rifiniture — quando c'è tempo

- **R6.** Target tattili del drawer mobile da 31-32px a 44px. Sopra il minimo
  WCAG 2.2, sotto il comfort. Tocca il ritmo verticale: da valutare con
  `ui-designer`.
- **R7.** Preload hero: confermare con Lighthouse reale prima di intervenire.
  L'invariante dichiarata dal codice risulta rispettata.
- **R8.** Ripristinare `npm run audit:a11y` (ChromeDriver 151 vs Chrome 150), o
  sostituirlo con l'iniezione axe-core via Playwright, che qui ha funzionato e
  non dipende dalla versione di Chrome installata.
- **R9.** Escludere `functions/lib/` dal lint per togliere il falso rosso locale.
  Attenzione: `eslint.config.js` è protetto da `config_protection.py` — serve
  passaggio esplicito dall'owner.

## Non fare

- Sostituzione di massa delle 226 occorrenze di `text-[var(--color-accent)]`:
  sono quasi tutte icone, per cui la soglia è 3:1 e l'uso è corretto.
- Redesign. Il sistema di design è coerente e già verificato; i difetti trovati
  erano punti in cui il sistema veniva aggirato, non il sistema stesso.
- Aggiungere motion. Console pulita, CLS già a posto: non è lì il collo di
  bottiglia.
