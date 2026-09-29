---
title: HANDOFF_webapp-travelliniwithus_growth_to_orchestrator
status: consumed
created: 2026-09-29
from: travellini-growth-revenue-operator
to: travellini-orchestrator
slug: webapp-travelliniwithus
expires: 2026-10-13
type: handoff
area: delivery
round: R1 (divergenza, angolo business e ritorno)
consumes: HANDOFF_webapp-travelliniwithus_orchestrator_to_growth
---

# Handoff: la webapp come asset. Perché si torna, cosa si monetizza, cosa resta libero

Documento interno per la sintesi R2. Numeri solo dal fact pack
(`HANDOFF_webapp-travelliniwithus_data-analyst_to_divergenza.md`, citato come «fp §N»), da
file letti nel checkout `BEST` (commit `4fe1794`) e dalle correzioni del main thread. Il repo è
pubblico: niente id di post in deny-list, niente strutture sanitarie o abitazioni, niente area di
casa, niente partner, prezzi o audience che non stiano nei dati. Quello che non si conosce è
marcato `[VERIFY: ...]`.

## Esito in testa

- **Si torna per decidere, non per rivedere il reel.** Con il tasto Salva Instagram conserva un
  video. L'app conserva un posto: dove sta, quanto l'hanno pagato, cosa sapere prima, quando è
  stato controllato e se Rodrigo e Betta ci sono tornati. Dei cinque motivi (§1) solo uno giustifica
  l'icona sulla schermata home, cioè i posti salvati consultabili senza rete. Gli altri quattro
  funzionano anche nel browser, quindi il valore della webapp non deve dipendere dall'installazione.
- **Confermo la metrica primaria con tre correzioni** (§3). Si contano le email distinte la cui
  *prima* riga in Firestore `leads` porta la `source` di un gesto di utilità, non di un box
  newsletter generico. Il ritorno a 30 giorni sul campione con consenso diventa solo diagnostica e
  al suo posto entrano i click dalle email verso l'app. Le richieste partner qualificate fanno da
  contro-metrica. **Se l'owner risponde che oggi i ricavi arrivano dalle collaborazioni, in R2 la
  primaria deve diventare quella.**
- **Oggi nessuna metrica lato server funziona.** Nel ramo base è ancora aperto il bug P0
  `docs/14_Bugs/BUG_API_ENDPOINTS_SENZA_BACKEND_IN_PROD_2026-07-26.md`: gli endpoint `/api/*`
  non risultano verificati in produzione (ultimo aggiornamento 12 ago). Anche Resend e Brevo sono
  `[VERIFY]`. È il prerequisito numero uno e viene prima di ogni idea.
- **Prima di mostrare l'app a un partner vanno sistemate cinque cose** (§P0):
  - 12 schede su 86 hanno nel registro una dicitura diversa da quella della caption. In 7 casi la
    scheda dice `organic` ma la caption porta un marcatore di collaborazione (fp §6).
  - `BRAND_STATS` mette l'unico dato social verificato accanto a tre dichiarati e mai verificati
    (reach, engagement, TikTok) e a due che il corpus ha già superato.
  - `ExitIntentPopup` è montato su tutte le pagine tranne home, mappa e guida. Il brief vieta i
    pop-up d'uscita, e dentro un'app pesano ancora di più.
  - La home mostra «ci siamo stati <mese>» ricavandolo dalla data di pubblicazione del reel.
  - Il corpus tracciato in un repo pubblico contiene ancora le voci in deny-list.
- **Il piano esistente ha due punti che contraddicono la regola "ci siamo stati davvero".** Lo SKU
  d'ipotesi «Roadtrip in Puglia» (decision log shop, hub) e il pillar «Salento agosto» riguardano
  una regione con **zero reel**: Puglia e Basilicata insieme contano 3 luoghi, tutti in caroselli
  (fp §7). Va chiarito con l'owner prima di qualunque lancio.
- **Ordine consigliato.** Prima «Voglio la scheda» (idea 1) e «Mandami i miei posti» (idea 2). Poi
  la vista partner «Posti come il tuo» (idea 4) con «Cinque anni, datati» (idea 8). Le zone bianche
  (idea 5) arrivano dopo il primo segnale di domanda; affiliati nel solo blocco pratico (idea 6);
  «Ci siamo tornati» (idea 3) solo dopo le prime iscrizioni. Lo shop (idea 7) viene per ultimo, il
  Club resta fermo.

## Raccomandazione (contratto d'uscita)

```
Recommendation: Prima rendere il guscio misurabile e coerente con quello che dichiara (backend
  verificato, dicitura coerente, niente pop-up d'uscita, date corrette). Poi testare solo due gesti
  di utilità che portano email lato server («Voglio la scheda» e «Mandami i miei posti») e una
  vista partner costruita esclusivamente su dati datati.
Hypothesis: Chi chiede o salva un posto preciso lascia l'email più spesso di chi vede un box
  newsletter generico, e le sue richieste indicano quali schede scrivere.
Why now: La webapp è stata decisa oggi e il guscio non esiste ancora. Source, suffisso :pwa e
  punti d'iscrizione costano poco se nascono insieme alle schermate e molto se vanno aggiunti dopo.
  Intanto 939 reel geolocalizzati su 1.016 (92,4%) non hanno una scheda (fp §15).
Smallest test: Le idee 1 e 2 sull'endpoint esistente /api/newsletter-subscribe, con source
  dedicate e nessun backend nuovo. Si confrontano per 8 settimane con i box newsletter generici,
  a produzione verificata.
Primary metric: Email distinte la cui prima riga in Firestore `leads` ha una source app-utilità.
  Obiettivo: superare i box generici nella stessa finestra. Soglia relativa: non esiste ancora una
  baseline assoluta.
Kill criteria: Se dopo 8 settimane di produzione verificata i gesti di utilità, sommati, portano
  meno iscrizioni dei box generici, le idee 1-3 si fermano e si torna a un solo punto d'iscrizione.
Effort: Stima di pianificazione: 6-8 h R&B una tantum (export Insights e TikTok 2 h, revisione
  delle 12 schede 1 h, conferme su zone bianche e snapshot 1 h, rilettura dei messaggi 1 h,
  signup affiliati del gate 1,5 h) più 30-45 min a settimana.
Brand risk: Promesse non mantenute (schede chieste e mai scritte, avvisi mai inviati); numeri
  dichiarati accostati a quelli verificati; affiliati che reintroducono un giudizio pagato; date di
  pubblicazione presentate come date di visita.
Artifacts to create or update:
  - docs/MARKETING_OPERATIONS_HUB.md: dopo R2, marcare [VERIFY] "MediaKit B2B: attivo" finché il
    bug API P0 del ramo base resta aperto; sospendere lo SKU Puglia in attesa della conferma owner.
  - docs/20_Decisions/DECISION_PUBLIC_METRICS_SOURCE_TRAVELLINIWITHUS_2026-06-07.md (ramo base):
    estenderla ai numeri del corpus con `observedAt`, su conferma owner.
  - docs/12_Partnerships/PARTNER_PIPELINE_TRAVELLINIWITHUS.md: la vista partner come prova
    richiesta dalla regola di outreach.
  - docs/50_Scratch/HANDOFF_webapp-travelliniwithus_*: brief R2 verso seo, ui, frontend e data-analyst,
    dopo la sintesi.
Next decision point: Sintesi R2 dell'orchestratore, dopo che l'owner ha risposto alle domande 1-3
  (ricavi per fonte, backend in produzione, Puglia).
```

Non ho modificato hub né decisioni: questo è il giro di divergenza e lo stato cambia solo dopo R2.

## Correzioni ai fatti del brief che ho usato

| Nel brief | Uso | Fonte |
| --- | --- | --- |
| 1.017 reel, circa 186 M plays | **1.192 reel, 211.941.714 plays** (è una somma di visualizzazioni, non di persone). 1.017 reel e 186.303.699 plays riguardano solo i reel con coordinate | fp §4 |
| Struttura pensata per 533 | **409** nuovi luoghi per coordinata con un reel candidato: 297 in Italia, 484 reel. 533 è un tetto | fp §1 |
| Cinque regioni a zero | **Sei** regioni a zero reel: si aggiunge la Puglia | fp §7 |
| «Il Timbro» e il verdetto | Tolto dalla scheda il 15 ago. Il modello dati oggi «descrive, non giudica» (`src/types/content.ts`, `ContentPractical`) | correzione |
| Modale di scelta edizione | Spenta dal 17 ago. Resta il commutatore in testata (screenshot 01 e 05) | correzione |
| IG 172K verificato il 2026-07-15 | `BRAND_STATS_SOURCE.observedAt` e la decisione metriche riportano **172.680 al 2026-08-15** | `src/config/site.ts` |
| Premio di performance delle collaborazioni | Dal 2023 la differenza non è distinguibile da zero (IC95% [−9.980, +564]). Nel pitch nessun confronto tra collaborazioni e contenuti organici | fp §6 |

## P0: prerequisiti prima di qualunque idea

1. **Backend in produzione verificato** `[VERIFY]`. Senza `/api/newsletter-subscribe`,
   `/api/media-kit-lead` e Firestore configurato, i form finiscono nel fallback `localStorage`
   (dal 12 ago l'interfaccia lo dichiara ed emette `*_fallback`). In quello stato non esiste lead,
   metrica o vista partner che regga. Stato di `RESEND_API_KEY`, `BREVO_API_KEY` e `BREVO_LIST_ID`:
   `[VERIFY]`.
2. **Dicitura coerente**: 12 discordanze su 86 schede tra `partnership.kind` e caption (fp §6). Le
   7 schede `organic` con marcatore nel testo mostrano sul sito **meno** disclosure della caption.
   Per un profilo iscritto AGCOM (`BRAND_CREDENTIALS`) il rischio è pubblico. Tocca anche il
   «33 collaborazioni dichiarate» della home: `[VERIFY: come si calcola 33 e se regge dopo la
   revisione]`.
3. **Deny-list applicata ai dati**: il JSON tracciato contiene ancora 2 post e 1 chiave in
   deny-list (fp, Esito in testa) e il repo è pubblico. Le tracce (idea 1) pubblicano una parte in
   più del corpus, quindi non escono prima che la deny-list sia nel dato e non solo nelle viste.
4. **`BRAND_STATS` pulito per la vista partner**:
   - `instagramFollowers` è l'unico dato verificato;
   - `monthlyReach` `500K+`, `engagementRate` `6.5%` e `tiktokFollowers` `90K+` sono dichiarati e
     non verificati;
   - `postsPublished: '1.272'` e `destinationsExplored: '150+'` sono stati superati dal corpus
     (1.283 post; 595 luoghi con reel in 26 paesi).

   I valori non verificati si mostrano con l'etichetta «dichiarato» oppure non si mostrano.
5. **Via il pop-up d'uscita dal guscio**: `src/components/Layout.tsx` monta `ExitIntentPopup` su
   ogni pagina tranne `/`, `/mappa` e `/guida-in-regalo`. Su mobile scatta con uno scroll rapido
   verso l'alto vicino alla cima della pagina, cioè il gesto di chi arriva da un reel.
6. **P1, verità delle date**: `BrandCoherentHero.tsx` stampa «ci siamo stati <mese anno>» usando
   `publishedAt` (screenshot 01: «ci siamo stati a giugno 2026»). Il modello dati dice che
   `publishedAt` è la data d'uscita del video e non quella della visita, e il registro non ha
   ancora nessun `visitedAt`. Le idee 3 e 8 si reggono sulle date, quindi l'etichetta va corretta
   (per esempio «reel di giugno 2026») oppure alimentata da `visitedAt`.

## 1. Motivi d'installazione e di ritorno

Solo il motivo C è un motivo d'**installazione**. A, B, D ed E sono motivi di **ritorno** e
funzionano anche senza icona. Conseguenza per il guscio: la proposta d'installazione compare solo
dopo il terzo salvataggio e mai al primo accesso.

### A. «Dove andiamo sabato?» (ritorno)

- **Dato**: 595 luoghi con almeno un reel in 26 paesi, di cui 467 locali veri e 342 in Italia
  (fp §7). Il 76,0% dei locali italiani sta nelle otto regioni del Nord (Lombardia 123, Veneto 60).
  1.016 reel usabili hanno coordinate. **Limite**: 1 etichetta su 5 che nomina un paese cade in un
  paese diverso (fp §7), quindi il punto sulla mappa non è sempre affidabile.
- **Cosa Instagram non dà**: le raccolte salvate sono video in ordine di salvataggio, senza
  distanza e senza filtri per prezzo o tipo. Il profilo è una griglia di 1.192 reel in ordine di
  data. Le pagine-luogo dei geotag le creano gli utenti.
- **Misura senza consenso**: non si può misurare l'uso diretto di una lista letta sul dispositivo.
  Se ne misura l'effetto, cioè le iscrizioni con `source` delle superfici a cui la lista porta
  (idee 1 e 2). Nota per ui-designer: la lista deve funzionare senza mappa (senza consenso
  marketing le tessere mostrano un muro scuro) e senza chiedere la geolocalizzazione all'apertura.

### B. «Il conto prima di partire» (ritorno)

- **Dato**: 243 reel (20,4%) hanno un prezzo in euro in caption. Dal 2023 la quota è tra il 22,9%
  e il 29,6% dei post di ogni anno (fp §5). Mediane per unità, con classi euristiche: pasto/menu
  28 € (77 importi), ingresso 18 € (59), a persona 30 € (47), a notte 140 € (17). Nel registro, a
  conteggio grezzo sul file (visibili e segnaposto insieme): `checked` con fonte e data in 78 voci
  su 110, `toKnow` in 49, `price` in 30. La home promette già «Costi in chiaro dove li abbiamo
  pagati».
- **Cosa Instagram non dà**: il prezzo sta nella caption, che si tronca dopo poche righe, non si
  può cercare e non porta una data di controllo.
- **Misura senza consenso**: non si misura, perché è lettura. Si misura solo il suo effetto nelle
  iscrizioni nate dalla scheda.

### C. «I miei posti, anche senza rete» (installazione)

- **Dato**: «I miei posti» funziona già senza account (`travellini_favorites` in `localStorage`;
  la sincronizzazione Firestore c'è solo con login, `src/context/FavoritesContext.tsx`). Oggi la
  PWA non ha contenuti offline né un momento d'installazione (brief). Il budget `initial-js` è a
  776 KB su 780, quindi il pacchetto offline va messo in cache dopo, non nel bundle iniziale.
- **Cosa Instagram non dà**: una modalità senza rete per i contenuti salvati. In più indirizzo e
  prezzo non vi compaiono come dati strutturati.
- **Misura senza consenso**, debole:
  - suffisso `:pwa` sulla `source` delle iscrizioni, quando l'app gira installata (si legge
    `display-mode: standalone` al momento dell'invio, da citare nell'informativa);
  - conteggio aggregato dei lanci da icona tramite uno `start_url` dedicato nei log di Hosting
    `[VERIFY: log di richiesta di Firebase Hosting attivi]`. Il conteggio è per costruzione
    sottostimato se il service worker serve la shell dalla cache.

### D. «Ci siamo tornati» (ritorno)

- **Dato**: 106 luoghi hanno reel pubblicati a più di 30 giorni l'uno dall'altro, e 62 sono locali
  veri. Il più ripetuto conta 6 visite in 3 anni. Nei luoghi non amministrativi, quelli di ritorno
  portano il 32,2% dei reel (fp §3). Il ritmo non si è mai fermato: 62 mesi su 62 hanno almeno un
  reel, con 241-267 reel l'anno dal 2022 (fp §2).
- **Cosa Instagram non dà**: il nuovo reel arriva nel feed ma non si aggancia al vecchio che hai
  salvato, e nessuno ti avvisa «siamo tornati nel posto che hai salvato».
- **Misura senza consenso**: iscrizioni `app_segui:*` e click dagli avvisi verso la scheda,
  misurati da Brevo `[VERIFY: tracciamento click attivo e citato nell'informativa]`.

### E. «Tutto l'archivio, anche senza scheda» (ritorno)

- **Dato**: 939 reel geolocalizzati su 1.016 (92,4%) non hanno una scheda. Ci sono 484 reel su
  409 locali senza scheda, e 254 di questi sono del 2022-2023 (fp §15).
- **Cosa Instagram non dà**: il profilo non si cerca per luogo, e per ritrovare un reel del 2022
  bisogna scorrere una griglia di 1.192.
- **Misura senza consenso**: le richieste «Voglio la scheda» (`app_traccia:*`, idea 1).

## 2. Meccanismi di business

Otto schede. Copertura: lead ed email (1, 2, 3), vista partner (4), affiliati (6), shop e club
(7), zone bianche (5), prova dei plays (8). Sotto ogni scheda c'è il test con il quadro decisionale.
Le ore sono stime di pianificazione, non misure.

### Idea 1 — Voglio la scheda

- In una frase: ogni traccia, cioè un reel geolocalizzato che non ha ancora una scheda, porta un
  solo gesto, «Voglio la scheda di questo posto». Chi lo tocca lascia l'email, e l'ordine delle
  prossime schede lo decide la domanda e non l'intuito.
- Perché stupisce (la schermata che l'owner manderebbe a Betta): la lista settimanale «le tracce
  più chieste» nell'area admin, dove si vede quale posto del 2022 la gente vuole ancora, con il
  reel accanto.
- Dato reale su cui poggia:
  - 484 reel su 409 locali senza scheda (297 in Italia), 53 luoghi con almeno 2 reel (fp §1, §15);
  - nessuna cover reale su disco per i reel candidati fuori registro (fp §10, fatto 7);
  - l'indice derivato si può costruire in CI dal JSON tracciato (fp §11).
- Cosa richiede:
  - dati: l'indice delle 409 coordinate con la deny-list applicata al dato (P0.3);
  - asset: nessuna immagine (la traccia è testo, punto e link al reel), oppure fotogrammi reali
    estratti da travellini-asset-curator;
  - codice: le tracce in lista, e sulla mappa solo con consenso, più un form sull'endpoint
    esistente con `source: app_traccia:<id opaco>`; l'indice si carica a richiesta per il budget JS;
  - ore owner: 15 min a settimana per la classifica, più le ore per scheda `[VERIFY: da misurare
    sulle prossime 5 schede]`.
- Rischio principale: la promessa non mantenuta. Regola da scrivere nel form: «Ti scriviamo quando
  esce. Se entro 90 giorni decidiamo di non farla, te lo diciamo.» Rischio secondario: il punto
  sbagliato sulla mappa (vedi il limite dei geotag in §1.A).
- Regole toccate: privacy | imagery-truth | bundle | SEO-URL (le tracce non dovrebbero avere un URL
  indicizzabile; decide seo)
- Variante: firma
- Autovalutazione 1-5: Stupore 4 / Verità 5 / Business 4 / Costo 3 / Carico owner 3

**Test.**
- Ipotesi: una richiesta legata a un posto preciso porta più iscrizioni del box generico, e si
  concentra su poche tracce.
- Perché ora: la distinzione tra tracce e posti è già nell'ipotesi dell'orchestratore, e il form
  va disegnato insieme alla traccia.
- Test minimo: le 53 tracce con almeno 2 reel `[VERIFY: quante sono in Italia]`, mostrate in lista.
- Metrica: email distinte con prima `source` `app_traccia:*`, più la quota di richieste sulle 5
  tracce più chieste.
- Kill: dopo 8 settimane di produzione verificata, meno iscrizioni del box generico nella stessa
  finestra, oppure nessuna traccia con più di una richiesta.
- Ore R&B: 1 h una tantum per scorrere le 53 tracce e togliere quelle da non riproporre, poi 15 min
  a settimana.

### Idea 2 — Mandami i miei posti

- In una frase: al terzo posto salvato, «I miei posti» propone di mandarti la lista per email, con
  indirizzo, prezzo pagato e cosa sapere prima. L'iscrizione alla newsletter è una casella separata
  e non spuntata.
- Perché stupisce: arriva un'email con i tuoi tre posti e, sotto ognuno, la data «controllato il …».
  È la lista che Instagram non ti manda.
- Dato reale su cui poggia:
  - «I miei posti» esiste senza account;
  - l'evento `place_favorite_add` esiste (`Posto.tsx`);
  - `/api/newsletter-subscribe` salva `email`, `source` e `createdAt` in Firestore `leads`
    (`src/server/apiRoutes.ts`);
  - `checked` è presente in 78 voci su 110, `toKnow` in 49 (conteggi grezzi).
- Cosa richiede:
  - codice: una CTA dopo il terzo salvataggio con `source: app_miei_posti`, e la separazione di
    posti e articoli, che oggi stanno nello stesso array;
  - email: un nuovo messaggio con la lista, che richiede backend e conferma owner (fase 2);
  - fase 1 senza backend: iscrizione con source dedicata e link condivisibile della lista (slug
    nell'URL, solo frontend) mostrato nella conferma;
  - ore owner: 30 min per rileggere il messaggio.
- Rischio principale: confondere servizio e marketing. Chi chiede la lista non ha chiesto la
  newsletter, quindi servono due consensi e due conteggi separati. La data di controllo va sempre
  stampata, altrimenti la lista mostra dati vecchi come se fossero freschi.
- Regole toccate: privacy | bundle | file-alto-rischio (solo la fase 2, per l'email nuova)
- Variante: prudente
- Autovalutazione 1-5: Stupore 3 / Verità 5 / Business 4 / Costo 4 / Carico owner 5

**Test.**
- Ipotesi: chi ha già salvato tre posti lascia l'email per ritrovarli più spesso di chi vede il box
  generico.
- Perché ora: «I miei posti» è il cuore del guscio, e il punto d'iscrizione va progettato con la
  schermata, non aggiunto dopo.
- Test minimo: la CTA più la source dedicata, senza email nuova nella fase 1.
- Metrica: email distinte con prima `source` `app_miei_posti` e consenso newsletter. Le richieste
  della sola lista si contano a parte.
- Kill: se dopo 8 settimane la CTA porta meno iscrizioni del box generico nella stessa finestra,
  si toglie la CTA e resta solo la lista.
- Ore R&B: 0,5 h.

### Idea 3 — Ci siamo tornati

- In una frase: sulla scheda c'è «Avvisami se ci torniamo». Parte un'email solo quando un posto
  seguito riceve un nuovo reel o un controllo con una data nuova, e per nient'altro.
- Perché stupisce: la scheda con la riga dei ritorni («sei volte in tre anni») e l'email «Ci siamo
  tornati: ecco cosa è cambiato».
- Dato reale su cui poggia:
  - 106 luoghi di ritorno, di cui 62 locali veri;
  - il più ripetuto conta 6 visite in 3 anni;
  - i luoghi di ritorno portano il 32,2% dei reel nei luoghi non amministrativi (fp §3).

  Limiti: la data è quella di pubblicazione e non della visita (vedi P0.6). Lo stesso locale ha a
  volte più etichette (un caso con 3 etichette e 8 reel).
- Cosa richiede:
  - dati: unire gli alias per luogo e rilevare all'import quando un nuovo reel cade su un posto che
    ha già una scheda;
  - codice: la CTA con `source: app_segui:<slug>`;
  - backend: invii mirati per posto. Brevo è chiamato con `updateEnabled: true` e sovrascrive
    l'attributo `SOURCE` a ogni iscrizione, quindi di chi segue tre posti resta solo l'ultimo. Serve
    leggere `leads` in Firestore o una struttura dedicata: richiede backend e conferma owner;
  - ore owner: nessuna per il nuovo reel, che esce comunque; 20-30 min al mese se si promettono
    anche i controlli.
- Rischio principale: promettere aggiornamenti su prezzi e aperture che nessuno controlla. Si
  promette solo l'evento che accade comunque, cioè il nuovo reel.
- Regole toccate: privacy | file-alto-rischio
- Variante: firma
- Autovalutazione 1-5: Stupore 4 / Verità 4 / Business 3 / Costo 2 / Carico owner 3

**Test.**
- Ipotesi: chi segue un posto torna dall'email più spesso di chi riceve la newsletter mensile.
- Perché ora: da costruire solo dopo che le idee 1 e 2 hanno portato iscrizioni. È in scheda perché
  impone una scelta di struttura dati da fare adesso: il posto come unità, con gli alias uniti.
- Test minimo: il gesto sulle schede dei locali di ritorno che hanno già una scheda visibile
  `[VERIFY: quanti dei 62 sono tra le 79 visibili]`, con il primo avviso inviato a mano.
- Metrica: click dall'avviso verso la scheda per ogni avviso inviato (Brevo).
- Kill: se dopo 3 invii i click per avviso non superano quelli della newsletter mensile, il gesto
  si chiude e gli avvisi confluiscono nella newsletter.
- Ore R&B: 1 h per il primo invio.

### Idea 4 — Posti come il tuo

- In una frase: nell'edizione Collaborazioni chi arriva dice cosa rappresenta (hotel, ristorante,
  attrazione, territorio) e, prima di qualunque modulo, vede solo reel veri di quel tipo con
  visualizzazioni datate, prezzo pagato e dicitura.
- Perché stupisce: una frase come «Hotel: 17 prezzi a notte nelle caption, mediana 140 €», con
  accanto tre copertine reali che portano «Adv» o «Invito» in chiaro. Il partner vede come sarà
  raccontato, non riceve un pitch.
- Dato reale su cui poggia:
  - 182 reel con dicitura in caption (15,3%) su 125 luoghi; la forma cambia nel tempo, con «Adv»
    dal 2022 al 2026 e «Invited» e «Affiliazione» solo nel 2026 (fp §6);
  - le card mostrano già ADV e SU INVITO (screenshot 05);
  - reel tipico 41.965 plays, 1 su 10 sopra 428.856 (fp §4), snapshot del 14 ago 2026 inferito
    `[VERIFY]`;
  - distribuzione per categoria `[VERIFY: da calcolare, travellini-data-analyst]`.
- Cosa richiede:
  - dati: plays per reel e per categoria in config, con data;
  - le 12 discordanze risolte (P0.2);
  - export Insights di 90 giorni, come chiede la decisione metriche;
  - codice: un filtro per tipo nell'edizione esistente. L'attribuzione passa dal campo `topic` del
    modulo media kit, che viene già salvato, mentre la `source` è fissa (`media-kit-page`) e per
    cambiarla serve il backend;
  - ore owner: 2-3 h per gli export di Meta e TikTok e la revisione delle 12 schede.
- Rischio principale: accostare i numeri non verificati all'unico verificato. La decisione metriche
  lo dice già: la vicinanza li fa sembrare tutti veri. Nessun confronto di performance tra
  collaborazioni e contenuti organici (fp §6).
- Regole toccate: metriche-pubbliche | imagery-truth
- Variante: prudente
- Autovalutazione 1-5: Stupore 3 / Verità 5 / Business 5 / Costo 4 / Carico owner 3

**Test.**
- Ipotesi: un partner che vede reel veri del suo tipo, con numeri datati, compila il modulo più
  spesso di chi vede il media kit generico.
- Perché ora: la pipeline partner ha 0 outreach inviati, e la regola di outreach chiede una prova
  salvata. Questa vista è quella prova.
- Test minimo: una sola categoria (hotel) nella vista esistente, e il ciclo di 5 proposte già
  previsto dall'hub che rimanda lì.
- Metrica: richieste media kit qualificate, cioè con budget e periodo compilati (già obbligatori),
  con `topic` della vista.
- Kill: zero richieste qualificate dopo il ciclo di 5 proposte vuol dire che la vista non è la prova
  giusta, e si torna al caso territoriale di `PUBLIC_PROOF_SIGNALS`.
- Ore R&B: 2-3 h.

### Idea 5 — Qui non ci siamo stati

- In una frase: le sei regioni a zero reel smettono di essere pagine vuote e dicono la verità. Hanno
  due porte: il lettore chiede di essere avvisato, l'ente o la struttura propone un periodo.
- Perché stupisce: l'Italia sulla mappa con sei regioni vuote e la frase «Non ci siamo ancora
  stati», che nessun sito di viaggi scrive.
- Dato reale su cui poggia:
  - Basilicata, Friuli-Venezia Giulia, Marche, Molise, Puglia e Sardegna hanno zero reel;
  - Abruzzo, Sicilia e Valle d'Aosta hanno un solo locale;
  - le menzioni in caption di quelle regioni sono quasi nulle (fp §7);
  - le pagine destinazione sono già indicizzabili e senza contenuto (brief).
- Cosa richiede:
  - dati: le richieste per regione in `leads` (`source: app_zona:<regione>`); gli enti passano dal
    modulo media kit con topic «zona»;
  - codice: uno stato vuoto sulla pagina destinazione;
  - ore owner: 1 h per dichiarare cosa è vero regione per regione (a cominciare dai 3 luoghi in
    caroselli tra Puglia e Basilicata), poi l'ora settimanale di outreach già prevista dall'hub.
- Rischio principale: promettere viaggi non pianificati o far sembrare la regione in vendita.
  Regole: nessuna data promessa; nessun logo di ente finché il viaggio non è fatto; il viaggio
  finanziato conta nella quota di 1 contenuto partner ogni 4 editoriali e porta la dicitura.
  L'indicizzazione delle pagine vuote la decide travellini-seo-conversion-strategist.
- Regole toccate: SEO-URL | metriche-pubbliche | privacy
- Variante: audace
- Autovalutazione 1-5: Stupore 4 / Verità 5 / Business 4 / Costo 4 / Carico owner 3

**Test.**
- Ipotesi: la domanda dei lettori per una regione vuota convince un ente più del numero di
  follower.
- Perché ora: le pagine oggi sono una debolezza pubblica, e il calendario ha già un pillar in Puglia
  da chiarire.
- Test minimo: le sei pagine con lo stato vuoto e il form per i lettori, nessun contatto con gli
  enti finché non c'è domanda.
- Metrica: email distinte per regione (`app_zona:*`).
- Kill: se dopo 12 settimane nessuna regione ha raggiunto la soglia per essere citata a un ente, la
  pagina resta ma la pipeline enti si ferma. La soglia la fissa l'owner; per i contatori pubblici
  vale il minimo di 50 già in uso per la newsletter (`NEWSLETTER_COUNTER_MIN_VISIBLE`).
- Ore R&B: 1 h, più 1 h a settimana quando la pipeline parte.

### Idea 6 — Qui abbiamo pagato noi

- In una frase: gli affiliati stanno solo nel blocco pratico «Prima di partire» (assicurazione,
  escursioni, prenotazione) e solo sui posti che R&B hanno pagato. Mai nell'ordine delle liste, mai
  sulle schede `invited`, `adv` o `collaboration`, mai con un'etichetta che suoni come un giudizio.
- Perché stupisce: la scheda che dice «L'abbiamo pagato noi» con il prezzo della caption, e sotto il
  link commerciale dichiarato. È il contrario di una vetrina.
- Dato reale su cui poggia:
  - la bio promuove già sconti, assicurazione ed escursioni (formula ricorrente in caption);
  - nel quadro maggio-luglio erano attivi 2 affiliati su 6, Heymondo e GetYourGuide `[VERIFY:
    stato attuale]`;
  - `/risorse` usa già `rel="sponsored"` (hub);
  - `deal.validUntil` è obbligatorio e oggi nessuna voce del registro ha un `deal`;
  - 44 schede sono `organic` e senza marcatore (fp §6);
  - il verdetto è stato tolto il 15 ago: l'affiliato non deve riportarlo sotto forma di badge
    «consigliato».
- Cosa richiede:
  - dati: l'elenco dei posti `organic` con prezzo;
  - codice: il modulo esistente spostato nel blocco pratico;
  - misura senza consenso: sub-id per superficie nei pannelli dei programmi `[VERIFY: supporto
    sub-id per programma]`, oppure un redirect lato server, che richiede backend e conferma owner;
  - ore owner: circa 1,5 h per completare i signup del gate di attivazione (hub).
- Rischio principale: il verdetto che rientra dalla porta di servizio, e il doppio incasso sullo
  stesso posto (ospitalità pagata dal posto più commissione).
- Regole toccate: brand-DNA | privacy
- Variante: prudente
- Autovalutazione 1-5: Stupore 2 / Verità 4 / Business 3 / Costo 4 / Carico owner 4

**Test.**
- Ipotesi: un link pratico nel punto giusto porta click senza togliere iscrizioni.
- Perché ora: il blocco «Prima di partire» si disegna adesso. Se l'affiliato non ha un posto
  previsto, finisce dove capita.
- Test minimo: un solo programma attivo `[VERIFY]` sulle schede estere `organic` con prezzo, con
  sub-id per superficie.
- Metrica: click per sub-id.
- Kill: se le iscrizioni dalle schede con il modulo scendono rispetto a quelle senza, nella stessa
  finestra, il modulo si toglie. L'email vale più della commissione.
- Ore R&B: 1,5 h.

### Idea 7 — Il sabato fuori porta

- In una frase: il primo prodotto va dove i posti ci sono (Lombardia o Veneto), non dove mancano. È
  un pacchetto da usare offline con percorso, ordine e costi sommati, costruito da schede che restano
  gratuite. Il Club non entra nell'app finché lo shop non ha 20 persone in lista.
- Perché stupisce: «Un sabato a un'ora da casa: N posti dove siamo stati, costi in chiaro, anche
  senza rete», con N preso dalle schede vere `[VERIFY]`.
- Dato reale su cui poggia:
  - Lombardia ha 123 locali e 281 reel, Veneto 60 e 117; per mese di pubblicazione sono le uniche
    due regioni con reel in tutti i 12 mesi (fp §7, §8);
  - regola shop: preorder-first, 1 SKU, Stripe live solo con almeno 20 persone in lista (hub);
  - SKU d'ipotesi «Roadtrip in Puglia» o «Fuga in Trentino»: la Puglia ha 0 reel, il
    Trentino-Alto Adige 9 locali e 16 reel;
  - `/club` è `live` e promette una quota, `/shop` è `soon`.
- Cosa richiede:
  - dati: una selezione di schede con prezzo e `checked`;
  - asset: le copertine real-frame che esistono già;
  - codice: la lista d'attesa esistente con `source: app_shop:<sku>`;
  - ore owner: 0,5 h per scegliere la zona; il prodotto (stima 5-8 h) solo dopo 20 iscritti.
- Rischio principale: sembrare un paywall. Le schede restano gratuite e il prodotto vende solo ciò
  che gratis non esiste: ordine, percorso, costi sommati, versione stampabile. Per il Club, una quota
  promessa senza un backend verificato rischia di fallire proprio al pagamento.
- Regole toccate: brand-DNA | imagery-truth
- Variante: prudente
- Autovalutazione 1-5: Stupore 2 / Verità 4 / Business 3 / Costo 4 / Carico owner 2

**Test.**
- Ipotesi: un pacchetto nella zona più densa arriva a 20 persone in lista prima di uno su una zona
  mai girata.
- Perché ora: non è il momento di costruirlo. È il momento di togliere la Puglia dall'ipotesi SKU,
  in attesa della conferma owner.
- Test minimo: una pagina di lista d'attesa, senza scrivere il prodotto.
- Metrica: iscritti in lista con `app_shop:*` (la regola dei 20 è già in vigore).
- Kill: meno di 20 in lista dopo 8 settimane di produzione verificata vuol dire niente prodotto, e
  il Club resta fermo.
- Ore R&B: 0,5 h.

### Idea 8 — Cinque anni, datati

- In una frase: una sola schermata di prova con i fatti del corpus e la loro data: 62 mesi di fila
  con almeno un reel, 1.192 reel, 595 luoghi in 26 paesi, il reel tipico, e in fondo, in piccolo,
  la somma delle visualizzazioni con la dicitura «somma di visualizzazioni, non persone».
- Perché stupisce: la striscia dei 62 mesi, nessuno vuoto. Un partner capisce la costanza meglio di
  qualunque numero di follower.
- Dato reale su cui poggia:
  - 62 mesi su 62 con almeno un reel; 241-267 reel l'anno dal 2022 (fp §2);
  - 211.941.714 plays in totale, mediana 41.965 per reel, p90 428.856 (fp §4);
  - snapshot del 14 ago 2026, inferito `[VERIFY]`;
  - 595 luoghi con reel in 26 paesi (fp §7).

  Limiti: i plays non si confrontano tra anni (mediana 2021: 6.684; 2022: 56.415), e il 36,0% sta
  su etichette generiche (fp §4).
- Cosa richiede:
  - config: i campi del corpus in `src/config/site.ts` con `observedAt`, perché la decisione
    metriche vieta i numeri scritti nel codice (estensione da confermare con l'owner);
  - codice: una schermata nell'edizione Collaborazioni;
  - ore owner: 0,5 h per confermare giorno e ora dello snapshot.
- Rischio principale: la vanity. Se 211,9 milioni finisce in grande nella testata, la prova diventa
  uno slogan. La somma sta in fondo, con la data.
- Regole toccate: metriche-pubbliche
- Variante: prudente
- Autovalutazione 1-5: Stupore 3 / Verità 5 / Business 4 / Costo 5 / Carico owner 5

**Test.**
- Ipotesi: costanza e distribuzione convincono più della somma.
- Perché ora: se il guscio nasce senza questi campi in config, prima o poi qualcuno li scriverà nel
  JSX.
- Test minimo: la schermata dentro la vista partner dell'idea 4, non una pagina a sé.
- Metrica: nessuna propria, si legge con l'idea 4.
- Kill: se l'export Insights contraddice uno dei numeri mostrati, la schermata si toglie finché non
  torna allineata.
- Ore R&B: 0,5 h.

## 3. Metrica primaria

### Verdetto: confermata, con tre correzioni

1. **Cosa si conta.** Le email distinte la cui **prima** riga in Firestore `leads`
   (`type: newsletter`) ha una `source` della famiglia app-utilità: `app_miei_posti`,
   `app_traccia:*`, `app_segui:*`, `app_zona:*`, `app_shop:*`, con il suffisso `:pwa` quando l'app
   gira installata.
   - **Motivo**: se tutto il sito diventa app, «nata nell'app» vale per ogni iscrizione e non
     distingue niente. La distinzione che dice se la webapp aggiunge valore è tra gesto di utilità
     e box generico.
   - **Baseline**: i box esistenti (`article_bottom`, `article_sidebar`, `resources_newsletter`,
     `lead_magnet_page`, `esplora_no_content`).
   - **Non si conta su Brevo**: con `updateEnabled: true` sovrascrive `SOURCE` e la prima origine
     si perde.
2. **Secondaria**: i click dalle email (avvisi e newsletter) verso l'app, per invio, da Brevo. È un
   ritorno causato da noi e non dipende dal banner cookie. Il ritorno a 30 giorni sul campione con
   consenso resta **diagnostica**: chi accetta i cookie non è un campione casuale, e prima della
   produzione non c'è una base di confronto.
3. **Contro-metrica B2B**: le richieste media kit qualificate che arrivano dalla vista
   Collaborazioni. **È qui che va contestata l'ipotesi**: nel breve i ricavi di un creator vengono
   spesso dalle collaborazioni più che dalla lista, ma non ho dati per dirlo di questo progetto.
   `[VERIFY: ricavi per fonte negli ultimi 12 mesi, owner]`. Se la risposta è «collaborazioni», in
   R2 la primaria diventa questa e le email passano a secondaria.

### Percorso di misura

1. Il form invia `POST /api/newsletter-subscribe` con `{ email, source }`.
2. Il server iscrive su Brevo (se chiave e lista ci sono), poi `saveLeadBackup` scrive in Firestore
   `leads` `{ email, type, source, createdAt }`. Se nessuno dei due salva risponde 503. Il campo
   honeypot `website` risponde "successo" senza salvare, e va bene così.
3. Il fallback `localStorage` non è un lead e non si conta: gli eventi sono già `*_fallback` dal
   12 ago.
4. Lettura settimanale: la prima riga per email, raggruppata per `source`. La fa
   travellini-data-analyst, oppure un pannello admin `[VERIFY: se LocalLeadsPanel o
   AdminMetricsOverview leggono già la raccolta leads]`.

### Prerequisiti

- Endpoint `/api/*` in produzione e validati (P0.1) `[VERIFY]`.
- Firestore `projectId` e `firestoreDatabaseId` configurati in produzione `[VERIFY]`.
- `BREVO_API_KEY` e `BREVO_LIST_ID` `[VERIFY]`; `RESEND_API_KEY` per l'email di benvenuto
  `[VERIFY]`.
- Doppio opt-in `[VERIFY: se è configurato in Brevo]`. Senza, la lista si sporca e il conteggio si
  gonfia.
- Una allowlist scritta delle `source`: oggi il client la manda come testo libero. Per il test basta
  un elenco in una nota; la validazione lato server è lavoro di backend.
- Informativa privacy aggiornata: `source` e `:pwa` come dati del contesto d'iscrizione.

### Soglie

Nessun numero assoluto finché non esiste una base. Le prime 4 settimane di produzione verificata
servono da baseline dei box generici, poi valgono le soglie relative delle schede. **Kill
complessivo**: se dopo 8 settimane le source app-utilità sommate non superano i box generici, la
webapp non sta aggiungendo lead, e va detto all'owner prima di costruire altro.

### Contratto eventi (diagnostica, solo con consenso analytics)

| Evento | Quando | Proprietà | Esiste |
| --- | --- | --- | --- |
| `place_favorite_add` | salvataggio | `place_id`, `source`, `display_mode` | sì (senza `display_mode`) |
| `favorites_email_request` | invio del form lista | `count_saved`, `newsletter_optin` | no |
| `trace_card_request` | «Voglio la scheda» | `trace_id` (opaco) | no |
| `place_follow` | «Avvisami se ci torniamo» | `place_id` | no |
| `zone_alert_request` | regione bianca | `region` | no |
| `collab_view_step` | passo della vista partner | `step` (1-5), `partner_type` | no |
| `install_prompt_shown` / `install_prompt_result` | solo dopo il 3° salvataggio, mai al primo accesso | `outcome` | no |

Proprietà comuni: `edition` e `display_mode`. Mai email o testo libero negli eventi.

## 4. Lista "non monetizzare"

1. **L'ordine della scoperta** (liste, «vicino a te», ricerca, mappa): non va mai ordinato, spinto
   o filtrato per commissione o collaborazione. Se l'ordine si compra, «ci siamo stati davvero»
   diventa «ci hanno pagati per metterlo primo».
2. **La mappa**: niente pin sponsorizzati e niente livello partner. Le tessere chiedono già il
   consenso marketing, e mettere sponsor sulla stessa superficie fa sembrare quel consenso un
   pedaggio.
3. **«I miei posti» e il pacchetto offline**: niente pubblicità, inserimenti o badge affiliati. È
   lo spazio della persona.
4. **«Cosa sapere prima» e il prezzo pagato**: nessun link commerciale dentro. Il prezzo mostrato è
   quello pagato, mai sostituito dal «da X €» di un programma.
5. **Le schede `invited`, `adv` e `collaboration`**: nessun affiliato, per evitare il doppio incasso
   sullo stesso posto.
6. **Tracce e archivio**: nessuna monetizzazione. Sono la prova.
7. **Zone bianche**: nessun logo di ente e nessun «in arrivo» sponsorizzato prima che il viaggio sia
   fatto.
8. **Avvisi «ci siamo tornati» ed email della lista**: nessun blocco sponsor. Gli spazi partner, se
   esistono, stanno solo nella newsletter mensile e dichiarati.
9. **Family, gravidanza e salute**: nessun affiliato. Il fact pack segnala caption sensibili su
   nascita e salute (fp §12, solo conteggi).
10. **Guscio**: niente interstiziali né pop-up d'uscita (P0.5), niente paywall su ciò che oggi è
    gratuito, niente etichetta «consigliato» accanto a un link a commissione.

## 5. Persona

**Verdetto: la contesto in parte.** «Chi arriva da un reel sul telefono» descrive il canale
d'ingresso, non la persona. Dice come entra, non perché torna. Il ritorno avviene in un altro
momento, quando si decide.

**Persona proposta: chi decide la prossima uscita.** Una coppia o un gruppo di amici che a metà
settimana cerca «un posto particolare» per una sera o un weekend a poche ore da casa, con un budget
da cena o da una notte. Ha già salvato dei reel su Instagram e non riesce a ritrovarli.

Evidenza:
- **Lessico** da sera e da weekend (fp §9): «posto» in 237 caption, «esperienza» 219, «locale» 186,
  «cena» 104, «serata» 96, «aperitivo» 88. Bigrammi: «posti particolari» 28, «alloggi insoliti» 25,
  «san valentino» 22, «weekend romantico» 15.
- **Prezzi** da uscita, non da viaggio lungo (fp §5): mediana di 28 € a pasto o menu, 18 € a
  ingresso, 140 € a notte.
- **Geografia** di prossimità (fp §7): il 76,0% dei locali italiani sta al Nord.
- **Formule** che sono domande di scelta: «piacerebbe» (155), «proveresti» (133), «tagga qualcuno»
  (18).

Cosa non sappiamo, e conta: **dove vive il pubblico**. Se il pubblico è distribuito in tutta
Italia e i posti sono al Nord, «vicino a te» delude chi sta al Sud e le zone bianche diventano più
urgenti. `[VERIFY: export Insights città e regioni del pubblico, owner]`,
`[VERIFY: quota di ingressi da Instagram su mobile, travellini-data-analyst quando GA4 avrà dati di
produzione]`.

Conseguenza per ui-designer (il *perché*, non il *come*): l'**ingresso** va progettato per il reel,
che deve atterrare sulla scheda giusta. Il **ritorno** va progettato per la decisione: lista per
distanza, prezzo e tipo, che funzioni senza mappa e senza geolocalizzazione chiesta all'apertura.

## 6. Cosa vede un partner in 90 secondi

Si entra dal commutatore «Collaborazioni» in testata (la modale è spenta dal 17 ago). **Nessuna di
queste schermate va mostrata a un partner prima di P0.2 e P0.4.** Tutte usano copertine real-frame
(79 su 79 visibili, fp §10) e dati letti dalla config con la loro data.

| Tempo | Schermata | Cosa vede (reale e datato) | Cosa non vede |
| --- | --- | --- | --- |
| 0-10 s | Chi siamo, in tre righe | Rodrigo e Betta; IG 172.680 follower al 15 ago 2026 (unico dato social verificato); 1.192 reel in 62 mesi di fila fino al 13 ago 2026; iscritti AGCOM | reach, engagement e TikTok se non confermati da export; nessuna somma di plays in testata |
| 10-35 s | Posti come il tuo (idea 4) | scelta del tipo; 3-6 schede reali di quel tipo con dicitura visibile, prezzo pagato e plays del reel con data | posti senza scheda o con dicitura non revisionata |
| 35-55 s | Come lo raccontiamo | le etichette Adv, Invito e Affiliazione come appaiono; la regola di 1 contenuto partner ogni 4 editoriali; 182 reel dichiarati su 1.190 | qualunque confronto di performance tra collaborazioni e organico (fp §6) |
| 55-75 s | Ci torniamo, cinque anni (idee 3 e 8) | 62 locali veri con più visite, il più ripetuto 6 volte in 3 anni; la striscia dei 62 mesi; reel tipico 41.965 plays, 1 su 10 sopra 428.856, al 14 ago 2026 | nomi dei locali di ritorno di cui non è stata verificata la dicitura |
| 75-90 s | Dove non siamo ancora stati, più il modulo | le sei regioni a zero reel; il modulo esistente (azienda, email, focus, budget, periodo, brief) con risposta automatica `[VERIFY: Resend attivo]` | tariffe, pacchetti a prezzo, promesse di date |

La richiesta nasce dal fatto che il partner si riconosce in uno dei tipi, non da un invito generico.
Come link di appoggio c'è il caso territoriale già in `PUBLIC_PROOF_SIGNALS`, `[VERIFY:
autorizzazione dell'owner al case study, hub]`.

## Sequenza consigliata e cosa NON fare ora

1. **Settimana 0**: P0, lavoro bloccante e non di growth. Backend, dicitura, deny-list,
   `BRAND_STATS`, pop-up e date.
2. **Poi, in parallelo**: idee 2 e 1 (lead) e idee 4 e 8 (partner).
3. **Dopo 4 settimane di baseline**: idea 5 se le richieste dell'idea 1 si concentrano; idea 6 nel
   blocco pratico.
4. **Dopo le prime iscrizioni**: idea 3.
5. **Per ultima**: idea 7. Il Club resta fermo.

Da non fare ora:
- **Notifiche push**: vietate al primo accesso, e anche dopo richiedono backend e un ritmo d'invio
  che l'owner non ha.
- **Spesa a pagamento**: offerta, tracciamento, consegna e supporto non sono ancora reali.
- **Qualunque lancio senza la firma di travellini-quality-auditor.**

## Domande aperte

Per l'owner (bloccanti per R2):
1. Da dove arrivano oggi i ricavi (collaborazioni, affiliati, altro)? La risposta decide la
   metrica primaria.
2. Gli endpoint `/api/*` sono in produzione e validati? Resend e Brevo sono attivi? C'è il doppio
   opt-in?
3. Siete stati in Puglia o in Salento, e con quale materiale reale? Dalla risposta dipendono lo
   SKU e il pillar.
4. Export Insights di 90 giorni e dato TikTok, come chiede la decisione metriche.
5. Revisione delle 12 schede con dicitura discordante.
6. Giorno e ora dello snapshot dei plays (il 14 ago è inferito).

Per travellini-data-analyst:
1. Distribuzione dei plays per categoria (hotel, ristorante, attrazione) sui reel con coordinate,
   con la data dello snapshot.
2. Quanti dei 62 locali di ritorno hanno già una scheda visibile.
3. Come si calcola «33 collaborazioni dichiarate» e se regge dopo la revisione.
4. Quante delle 53 tracce con almeno 2 reel sono in Italia.
5. Audience per regione, quando l'owner fornisce l'export.

## Out of scope (rispettato)

- Nessun file di codice modificato. `BEST` è stato letto in sola lettura; la modifica locale a
  `src/lib/seo.ts` è stata ignorata.
- Nessuna schermata, interazione o copy definitivo: le frasi tra virgolette sopra servono solo a
  spiegare le idee, e il copy lo scrive seo. Nessun formato social.
- Nessuna stima di conversioni, ricavi, CPM o tariffe. Le ore sono stime di pianificazione del
  carico owner.
- Nessuna idea vietata: niente gamification, paywall, pop-up d'uscita (se ne chiede anzi la
  rimozione), push al primo accesso, CTA Telegram, né partner o prezzi non documentati.
- Dove un'idea richiede backend l'ho scritto nella scheda: richiede backend e conferma owner.

## Next hand-off

- Next agent: travellini-orchestrator (sintesi R2).
- Trigger: questo file su disco con i punti 1-6, più le risposte dell'owner alle domande 1-3.

## Notes

**Idee scartate, con il motivo:**
- Classifica «i posti più visti»: ordina per plays, confonde attenzione e qualità, e il 36,0% dei
  plays sta su etichette generiche.
- Pitch «le collaborazioni rendono come l'organico»: il fact pack non lo dimostra (fp §6).
- Contatore pubblico «N persone aspettano questa scheda» sotto quota 50: vale la stessa regola del
  contatore newsletter.
- Anteprime generate per le tracce senza copertina: le vieta la regola sull'imagery.
- Club a quota dentro l'app adesso: verrebbe percepito come paywall, e il backend non è verificato.
- Badge o livelli per chi salva di più: è gamification, ed è vietata.

**Miglioramento operativo proposto (non applicato):** un **contratto delle `source`**. Ogni nuovo
form d'iscrizione dichiara la propria `source` in un'unica allowlist documentata, per esempio come
estensione della decisione metriche. Il conteggio primario legge la prima riga per email in
Firestore `leads` e non Brevo, che con `updateEnabled` sovrascrive `SOURCE`. Evita due errori che
questo giro ha trovato: attribuzioni perse e metriche che non distinguono il gesto dal box.
