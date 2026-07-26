---
title: PLAN_mappa-delle-tracce-redesign-2026
status: done
created: 2026-07-21
type: plan
area: product
slug: mappa-delle-tracce-redesign-2026
---

# Orchestration plan — mappa-delle-tracce-redesign-2026

## Request restated

Continuare la costruzione del sito dopo la homepage `Diario delle meraviglie vere`, senza usare Sites e senza riaprire la direzione della home, portando il primo percorso successivo allo stesso livello editoriale, funzionale e mobile.

## Perché la prossima route è `/mappa`

La Mappa è il seguito più logico e più corto della homepage:

- è raggiunta dalla testata, dalla CTA del primo capitolo, dalla scheda del capitolo `Vale davvero?` e dal primo percorso della pagina finale;
- è la prima pagina interna elencata nella fase S4 del rebuild;
- risponde al compito primario del visitatore social: passare dalla meraviglia a un posto da aprire o salvare;
- la route esiste già e conserva logica utile, quindi il lavoro può concentrarsi su continuità visiva e chiarezza senza introdurre nuove integrazioni.

La route attuale è funzionale ma appartiene ancora al linguaggio precedente: pannelli flottanti arrotondati, filtri e percorsi densi, forte presenza di anteprime demo. Il redesign deve trasformarla nella **Mappa delle tracce**, cioè una carta piegata dentro lo stesso taccuino della home, senza sacrificare la leggibilità della mappa.

## Classification

- Type: redesign controllato di una route esistente
- Domains: UI/UX, copy/SEO, asset/provenienza, frontend, performance, accessibilità, browser QA
- Sequence: custom S4 — ui-designer → asset/seo → frontend-builder → perf/quality/browser gate
- Effort: M
- Reversibility: alta; nessun backend e nessun cambio provider

## Decisioni bloccate

1. **Homepage congelata:** `/` e `CinematicHomepage.tsx` sono il riferimento visivo approvato; il lavoro non ne modifica struttura, copy, motion o asset.
2. **Route successiva:** si lavora su `/mappa` prima di `/esplora`, `/destinazione/italia`, `/chi-siamo` e `/collaborazioni`.
3. **Promessa:** la pagina aiuta a scegliere una traccia concreta; non è un atlante enciclopedico né una dashboard di filtri.
4. **Continuità visiva:** carta calda, rilegatura/inchiostro blu, Fraunces, terracotta, timbri e note di campo. La mappa scura resta il piano operativo centrale e deve sembrare inserita nel taccuino, non coperta da card generiche.
5. **Interazione:** pan, zoom, cluster, pin, popup, filtri, preset, deep link `?place=`, tracking e collegamento a `/esplora` vengono preservati. Cambia la regia, non il motore.
6. **Provider:** mantenere l'implementazione corrente `react-map-gl/maplibre` + OpenFreeMap. Nessuna migrazione, chiave, SDK o integrazione nuova.
7. **Dati:** i marker reali e geocodificati hanno priorità; i seed demo restano ammessi solo come anteprime esplicitamente dichiarate. Nessun visual AI viene presentato come prova reale.
8. **Mobile:** sotto 768 px il flusso resta verticale e in-flow: introduzione breve → filtri raggiungibili → mappa → lista delle tracce → CTA. Niente pannelli sovrapposti che sottraggono spazio alla mappa.
9. **Motion:** micro-transizioni su apertura della scheda, cambio filtro e passaggio taccuino→mappa; niente scroll hijacking, parallax pesante o animazioni continue. `prefers-reduced-motion` conserva contenuto e funzioni.
10. **Performance:** mantenere lazy-load della mappa; nessun nuovo pacchetto, canvas decorativo, video o immagine hero che diventi LCP. Il blocco performance globale già registrato non va ampliato.
11. **Scope operativo:** solo locale; niente Sites, deploy, DNS, Firebase console, Stripe, `server.ts`, `firestore.rules` o `src/config/admin.ts`.
12. **Fine incremento:** la route `/mappa` è completata e verificata; `/esplora` diventa il prossimo incremento, non viene ridisegnata in questo passaggio.

## Architettura UX target

### Desktop

1. **Ingresso di continuità:** testata globale + una fascia editoriale molto compatta che riprende numero pagina, data/timbro e promessa del diario.
2. **Carta centrale:** mappa scura ampia, incorniciata come foglio piegato; controlli mappa standard sempre raggiungibili.
3. **Filtri come linguette:** zona ed esperienza su due righe chiare, con stato attivo evidente e senza card-in-card.
4. **Percorsi suggeriti:** massimo tre segnalibri editoriali; selezionano filtri esistenti, non creano un secondo sistema di navigazione.
5. **Scheda traccia:** un solo pannello contestuale per il pin selezionato, con provenienza, categoria, descrizione breve e CTA reale.
6. **Uscita:** `Apri l'archivio` verso `/esplora`, secondaria rispetto all'azione sul pin.

### Mobile

1. Un solo H1 e una spiegazione di una riga prima dei controlli.
2. Filtri sticky ma non bloccanti, con target di almeno 44 px e overflow dichiarato.
3. Mappa alta circa metà viewport, senza overlay editoriali sopra i controlli nativi.
4. Lista verticale delle tracce filtrate; tap su una voce mette a fuoco il pin senza perdere il contesto.
5. CTA archivio in-flow; nessuna duplicazione con una sticky CTA concorrente.

### Stati obbligatori

- caricamento;
- contenuti reali disponibili;
- mix reale + anteprime;
- solo anteprime;
- filtro senza risultati;
- pin selezionato;
- errore dati esclusivo, con retry e uscita utile verso l'archivio;
- reduced motion;
- navigazione tastiera e focus visibile.

## Sequenza eseguibile

| #   | Owner                                                                         | Input                                                           | Deliverable                                                                                                                | Exit condition                                             |
| --- | ----------------------------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1   | `travellini-ui-designer`                                                      | Homepage approvata, `design-qa.md`, Mappa corrente, `DESIGN.md` | Una sola direzione esecutiva desktop/mobile, gerarchia, component map, state matrix e motion grammar                       | Nessuna decisione visuale aperta per il builder            |
| 2   | `travellini-asset-curator` + `travellini-seo-conversion-strategist`           | Direzione UI e contenuti mappa correnti                         | Manifest provenienza/alt/placeholder + contratto copy/SEO italiano per H1, intro, filtri, preview notice, popup e CTA      | Copy e asset non inventano luoghi o prove                  |
| 3   | `travellini-frontend-builder`                                                 | Handoff UI + asset/copy                                         | Refactor mirato di `Mappa.tsx` e `MapboxWorldMap.tsx`, CSS locale necessario, comportamento desktop/mobile/reduced-motion  | Typecheck/build/UI audit verdi; nessuna modifica high-risk |
| 4   | `travellini-perf-engineer` + `travellini-quality-auditor` + `browser-auditor` | Implementazione locale                                          | Gate prestazioni, statico e browser a 320/375/768/1024/1440; verifica home→mappa→pin→esplora                               | Nessun P0/P1/P2 aperto; report locale, nessun deploy       |
| 5   | Thread principale                                                             | Gate verde                                                      | Aggiornare progetto rebuild, release readiness, eventuale nota Mappa e correzione del decision log provider in `DESIGN.md` | Incremento documentato e pronto per revisione owner        |

## Dipendenze

- La homepage `Diario delle meraviglie vere` e `design-qa.md` sono il source of truth visivo.
- Il dataset corrente e i marker in `MapboxWorldMap.tsx` restano la base; non servono chiavi o accessi nuovi.
- `/esplora` deve continuare a risolvere come destinazione del CTA, ma il suo redesign è fuori scope.
- Se l'asset audit trova immagini non pubblicabili, il builder usa una presentazione testuale/paper-first e non genera prove sostitutive.

## Criteri di accettazione

- L'ingresso da qualunque CTA `/mappa` della home sembra il capitolo successivo dello stesso prodotto.
- Un solo H1 in italiano; compito della pagina comprensibile entro 5 secondi.
- Pan, zoom, cluster, pin, popup, filtri, preset, deep link e CTA funzionano come prima o meglio.
- Il notice delle anteprime è chiaro ma non domina la pagina.
- Nessun dato, contatore, prezzo, visita o partnership inventato.
- Zero overflow orizzontale a 320/375/768/1024/1440.
- Focus visibile, target touch ≥44 px, contrasto AA, dialog/popup raggiungibile e chiudibile da tastiera.
- Reduced motion non perde contenuto o funzionalità.
- Console senza errori; nessuna richiesta fallita provocata dal redesign.
- `npm run typecheck`, `npm run build`, `npm run audit:ui` e `npm run audit:visual` passano.
- Misura locale di LCP/INP/TBT non peggiora rispetto alla route attuale; qualunque blocco generale già noto resta esplicitamente separato.
- Documentazione aggiornata; nessun deploy o commit automatico.

## Open questions

Nessuna domanda blocca la V1 locale. La sostituzione completa dei seed con luoghi e media proprietari resta un input futuro di Rodrigo & Betta e non impedisce il redesign trasparente della struttura.

## Stop condition

Il lavoro termina quando `/mappa` è coerente con il taccuino della homepage, conserva tutte le funzioni mappa, supera il gate responsive/accessibilità/performance locale e la documentazione registra la nuova route. Non include il redesign di `/esplora` né il deploy.

## Esito 2026-07-21

Implementazione completata localmente. La route conserva MapLibre/OpenFreeMap,
cluster, marker, filtri, preset, deep link e tracking; introduce la regia
paper-first desktop/mobile, stati trasparenti e navigazione tastiera. Nessun
deploy o commit e stato eseguito. Gate finale: browser, qualità e accessibilità
PASS; performance mobile 4G/CPU 4x con LCP 1,72 s e CLS 0,044. `/esplora` resta
il prossimo incremento.

## Prossima azione

Pianificare il redesign di `/esplora` come indice del taccuino, senza riaprire
la home o la Mappa delle tracce gia validate.
