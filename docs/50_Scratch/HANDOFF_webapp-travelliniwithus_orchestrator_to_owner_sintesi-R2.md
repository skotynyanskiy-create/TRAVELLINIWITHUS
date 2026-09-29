---
title: HANDOFF_webapp-travelliniwithus_orchestrator_to_owner_sintesi-R2
status: open
created: 2026-09-29
from: travellini-orchestrator
to: owner (Skott) + main thread
slug: webapp-travelliniwithus
expires: 2026-10-13
type: handoff
area: delivery
round: R2 (sintesi, convergenza)
consumes:
  - docs/50_Scratch/HANDOFF_webapp-travelliniwithus_data-analyst_to_divergenza.md
  - docs/50_Scratch/HANDOFF_webapp-travelliniwithus_ui-designer-direzione_to_orchestrator.md
  - docs/50_Scratch/HANDOFF_webapp-travelliniwithus_ui-designer-architettura_to_orchestrator.md
  - docs/50_Scratch/HANDOFF_webapp-travelliniwithus_growth_to_orchestrator.md
  - docs/50_Scratch/HANDOFF_webapp-travelliniwithus_social_to_orchestrator.md
  - docs/50_Scratch/HANDOFF_webapp-travelliniwithus_seo_to_orchestrator.md
  - docs/50_Scratch/HANDOFF_webapp-travelliniwithus_asset-curator_to_orchestrator.md
next: docs/50_Scratch/HANDOFF_webapp-travelliniwithus_orchestrator_to_code-architect.md
---

# Sintesi R2: Travelliniwithus diventa una webapp. Cosa è emerso e cosa scegliere

Documento in un repo pubblico. Qui non compaiono id di post in deny-list, nomi di strutture
sanitarie o abitazioni, coordinate né dati personali. I numeri vengono dal fact pack del
data-analyst (sezioni citate come «fp §N»). Quello che non è verificato è marcato `[VERIFY]`.
Le quattro domande all'owner del primo piano (Q1-Q4) non hanno ancora risposta: le idee che
dipendono dalle mie raccomandazioni portano nella colonna «Dipende da» il codice della
decisione (E1-E6, sezione E).

---

## A. Per l'owner, in due pagine

### Cosa è emerso

1. **Ciò che rende l'app vostra non è il colore né il font. È la prova di passaggio**: il
   fotogramma del reel girato da voi, con la data, attaccato a un indirizzo. Coprite il
   fotogramma e la data, e quello che resta potrebbe stare su Google Maps. Tutte le 79 schede
   visibili hanno già questa prova.
2. **L'archivio è molto più grande del sito.** Sono 1.192 reel in 62 mesi di fila, senza un
   mese vuoto. Dei 1.016 reel con un luogo, 939 non hanno una scheda. Il sito ne mostra 79. I
   posti nuovi che potrebbero diventare schede sono **409** (297 in Italia).
3. **Il vostro stile regge anche come app.** Si rompe l'impaginazione pensata per lo scroll
   lungo (testate impilate, nome del posto sotto la piega), non la DNA. La direzione nuova
   («Rullino»: fondo scuro, reel a tutto schermo) è stata esplorata seriamente. La scegliete
   guardando i due prototipi affiancati (sezione D).
4. **Non serve nessuna pagina nuova sul server.** L'app sta tutta su indirizzi che esistono
   già, quindi il file più delicato non si tocca.
5. **Tre verità scomode**, che l'app renderebbe visibili e che vanno sistemate comunque:
   - sei regioni hanno zero reel (Puglia compresa) ma pagine indicizzate, e Puglia e Sardegna
     usano come copertina un'immagine **generata** di un luogo reale. È una violazione della
     vostra regola sulle immagini;
   - 12 schede su 86 dichiarano un rapporto commerciale diverso da quello scritto nella
     caption;
   - il bottone «Attiva la mappa» dà anche il consenso pubblicitario. Il codice lo conferma:
     con quel consenso gli eventi partono verso Meta e TikTok, se i pixel sono caricati
     `[VERIFY: pixel attivi in produzione]`.
6. **Oggi nessuna email arriva davvero al server** `[VERIFY]`. Il bug P0 sugli endpoint in
   produzione è ancora aperto. Finché non si chiude, ogni idea che raccoglie contatti si ferma
   sul telefono di chi la usa.
7. **Per i 409 posti nuovi non esiste nessuna immagine su disco.** Si lancia con i 79; i
   nuovi arrivano con l'export di Instagram.
8. **Il corpus intero, con le coordinate esatte, è in un repository pubblico**, comprese le
   voci che la vostra deny-list esclude. L'interfaccia non basta a risolverlo: vedi la sezione
   «Da decidere prima di fondere il PR #27».

### Le 15 idee sopravvissute

Chi le sostiene: UD = ui-designer direzione, UA = ui-designer architettura, GR = growth,
SO = social, SE = seo, AS = asset-curator, OR = orchestratore. Ogni idea ha almeno due angoli
(doppia adozione).

Punteggi da 1 a 5, dati da me (le autovalutazioni degli agenti sono servite solo come input):
- **Costo 5** vuol dire economico; **Carico owner 5** vuol dire leggero per voi.
- **Trovabilità** = Google e motori AI.
- **Pesi**: Stupore ×3, Business ×2, Carico owner ×2, Costo ×1,5, Trovabilità ×1,5, su un
  massimo di 50.
- **Verità** non dà punti: è un cancello, e la colonna dice a quale condizione passa.

| # | Idea | Cosa fa | Sostenuta da | Stup. | Business | Carico owner | Costo | Trovab. | Punti | Verità | Regole toccate | Dipende da |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | **Qui non ci siamo stati** | Le sei regioni a zero reel diventano pagine oneste, fuori da Google e senza immagine generata, con un solo gesto: «Avvisami se ci andiamo» | UD, GR, SO, SE, OR | 5 | 4 | 4 | 4 | 4 | **43** | passa (corregge una violazione); nessuna data promessa | imagery (corregge), SEO-URL, privacy | P0 per l'avviso; E6 |
| 2 | **La prova sotto ogni foto** | Sotto ogni foto una riga vera: «fotogramma del reel di gennaio 2026 · controllato su <fonte> il <data>». Un registro per fotogramma la tiene onesta; la stessa riga è il blocco «In breve» che i motori AI citano. La storia settimanale «Esiste ancora?» la tiene aggiornata | UD, UA, AS, SE, SO, OR | 4 | 4 | 4 | 4 | 5 | **41,5** | passa se le 12 diciture sono riconciliate prima; date sempre come «reel di…», mai «ci siamo stati» | imagery, metriche-pubbliche | B5 |
| 3 | **Il provino dell'owner** | Una pagina locale mostra 40 posti alla volta alla misura vera, con la fascia del titolo impresso già tolta. Approvate con un tasto. Stima: i 79 in circa 25 minuti, i 409 in circa 2 ore `[VERIFY: test su 10 posti]` | AS, UD, UA, OR | 4 | 5 | 4 | 3 | 4 | **40,5** | passa: solo fotogrammi vostri, mai ritocco generativo; minori e gravidanza in attesa per default | imagery, privacy | E4 |
| 4 | **La lista esce da Instagram** | Dopo il primo salvataggio l'app dice la verità («questa lista vive in questo browser») e offre due uscite: un link da mandare a chi viene con te, oppure l'email con indirizzi e prezzi datati | UA, SO, GR | 4 | 5 | 5 | 4 | 1 | **39,5** | passa: lista e newsletter hanno due consensi separati | privacy | E5; l'email solo dopo P0 |
| 5 | **Una URL, due vesti** | La stessa pagina del posto si apre come foglio sopra la mappa dentro l'app e a tutta pagina da Google. Il testo della scheda è già nell'HTML, così lo leggono anche i motori AI senza JavaScript. Il link condiviso mostra una cartolina con la foto vera | SE, UA, SO, AS | 3 | 4 | 5 | 3 | 5 | **39** | passa: stesso testo per persone e motori, niente testo nascosto | SEO-URL, bundle | nessuna |
| 6 | **La mappa che non chiede niente** | La voce Mappa apre subito una carta disegnata in locale, con i posti e l'elenco per regione e senza servizi esterni. La mappa interattiva chiede un consenso suo, non quello pubblicitario | UD, UA, SE, GR, OR | 4 | 3 | 5 | 3 | 4 | **38,5** | passa se il consenso separato supera la verifica legale | privacy, bundle | E6 |
| 7 | **Ci siamo tornati** | Sui posti con reel usciti a mesi di distanza compare una riga di soli fatti («reel di ottobre 2023 e di giugno 2026»). Sono 62 locali | UA, GR, SO, SE, AS | 4 | 4 | 2 | 4 | 4 | **36** | passa se confermate posto per posto che sono ritorni veri; mai su una mappa o con un raggio; dicitura commerciale accanto a ogni reel | privacy, metriche-pubbliche | E6 |
| 8 | **Il rullino dei 62 mesi** | In Esplora, accanto ai posti, tutti i reel mese per mese dal luglio 2021: quelli con scheda con la foto, gli altri come righe di testo che portano al reel | UA, GR, SO, OR | 4 | 3 | 5 | 3 | 2 | **35,5** | passa: niente autoplay, niente feed, niente caption senza revisione | anti-SaaS, privacy, bundle | E1 |
| 9 | **Il mese nell'archivio** | La home cambia da sola il primo del mese: mostra i posti i cui reel sono usciti in quel mese negli anni passati. Zero ore vostre | UA, UD, SO, OR | 3 | 3 | 5 | 5 | 2 | **35,5** | passa: «reel usciti a ottobre», mai «visitati» | nessuna | nessuna |
| 10 | **Le tracce a matita** | I reel senza scheda compaiono come tracce: solo testo, sul comune e mai su un punto preciso, senza pagina propria. La foto arriva solo quando la traccia diventa un posto certificato | UD, UA, SE, AS, GR | 4 | 3 | 4 | 3 | 3 | **35** | passa se la deny-list è nel dato e compare la riga «posizione presa dal geotag, non ricontrollata» | privacy, SEO-URL, bundle | E1 |
| 11 | **La valigia** | Salvare un posto mette da parte anche la sua foto ridotta, e «I miei posti» si apre in aereo. Circa 67 KB a posto, tetto a 60 posti | UA, AS, GR, SE | 4 | 3 | 5 | 3 | 1 | **34** | passa: la cache segue la provenienza (una foto ritirata sparisce anche offline) | bundle, imagery | E5 |
| 12 | **Il ponte del reel** | Ogni reel ha un link per codice (storia del giorno, DM, bio) che porta alla sua scheda o alla sua traccia. Il codice arriva fino all'iscrizione, e per la prima volta sapete quale reel porta iscritti | SO, UA, GR | 3 | 5 | 3 | 4 | 2 | **34** | passa | SEO-URL, privacy | P0, E2 |
| 13 | **La vista del partner** | Nell'edizione Collaborazioni un hotel o un ente sceglie il suo tipo e vede solo reel veri di quel tipo, con dicitura, prezzo e date: la prova di come verrà raccontato | GR, SO, SE | 3 | 5 | 3 | 4 | 2 | **34** | passa se i numeri non verificati sono tolti o marcati «dichiarato»; nessun confronto di rendimento tra collaborazioni e organico | metriche-pubbliche | B5, B6, E2 |
| 14 | **Il guscio: cinque voci, un piano** | Home, Esplora, Mappa, I miei posti, Noi. Un solo piano fisso in basso, nessuna domanda d'ingresso sull'edizione, nessun popup | UD, UA, GR, SE | 3 | 3 | 5 | 2 | 3 | **32,5** | passa | bundle, brand-DNA (edizione come lente) | E5 |
| 15 | **Voglio la scheda** | Su ogni traccia un solo gesto, «Voglio la scheda di questo posto» (email). La domanda del pubblico decide quali schede scrivere prima | GR, UA, SO | 3 | 5 | 3 | 3 | 2 | **32,5** | passa con la promessa scritta «se entro 90 giorni decidiamo di non farla, te lo diciamo»; le richieste non sono mai pubbliche | file-alto-rischio (fase avvisi), privacy | P0, E1, E2 |

### Eliminate, e il cancello che hanno violato

| Idea | Da chi | Cancello violato |
| --- | --- | --- |
| Immagini di riempimento per posti o tracce senza foto: generate, stock o prese dai server di Instagram | GR, SO, AS (scartate da loro) | regola sulle immagini vere |
| Cancellare il titolo impresso con ritocco generativo, o allargare in 16:9 una foto verticale inventando i bordi | AS (scartate) | regola sulle immagini vere: si inventano pixel di un luogo |
| «Voi avete guardato, noi abbiamo giudicato» (visualizzazioni contro verdetto) | OR (mio seme) | la vostra decisione del 15 agosto (la scheda descrive, non giudica), più la regola sulle metriche pubbliche |
| Classifica dei posti o dei reel «più visti» | GR, SO (scartate) | regola sulle metriche pubbliche |
| «Qui niente è generato» come frase pubblica, **oggi** | OR (mio seme) | sarebbe falsa: le copertine di Puglia e Sardegna sono generate. Torna dopo la pulizia (B3) |
| Tracce come punti precisi (fino a 939 punti) e «Riavvolgi» come percorso ricostruito sulla mappa | AS, OR | privacy (coordinate esatte, repo pubblico, zona di casa non determinabile, fp §14), più 1 geotag su 5 che cade nel paese sbagliato (fp §7). Sopravvive la versione sul comune (idee 8 e 10) |
| Una pagina per ogni traccia (409 URL) | SE (scartata) | pagine sottili |
| Testo della scheda nascosto per i soli motori (come `/sentiero`) | SE (scartata) | testo nascosto |
| Voce «Reel» nella barra, feed verticale, autoplay | UA, UD (scartate) | anti-SaaS, feed vietato |
| Base scura del design-lab, font manoscritto, codici d'archivio, numeri grandi a contatore | UD (scartate) | DNA e anti-SaaS |
| Badge per chi salva di più; contatore pubblico «N persone aspettano» | GR (scartate) | gamification; metriche pubbliche |

**In riserva** (nessun cancello violato, ma le sostiene un solo angolo):
- «Parola nei commenti» (serve uno strumento da valutare);
- «A metà strada tra voi due» (dipende dal punto preciso);
- «Avete cercato, non abbiamo» (servono dati di uso);
- pagine per domanda (tocca `server.ts`);
- «Il sabato fuori porta» (shop, dopo 20 iscritti in lista);
- il numero del mese curato a mano (carico ricorrente per voi);
- `/r/<codice>` (tocca `server.ts`).

### I tre pacchetti (cumulativi: ognuno contiene il precedente)

**Base comune, in tutti e tre**: 14 Il guscio · 5 Una URL, due vesti · 6 La mappa che non
chiede niente · 2 La prova sotto ogni foto. In più, la lista B «da sistemare comunque».

**Prudente: «L'app dei 79»**
- Architettura: cinque voci; l'edizione si deduce dall'indirizzo d'ingresso; solo i 79 posti,
  nessuna traccia.
- Idee: 9 Il mese nell'archivio · 4 La lista esce da Instagram (solo il link) · 11 La valigia.
- Ore vostre: circa 2-3 ore una tantum (revisione delle 12 diciture, provino dei 79, decisioni),
  poi 0 a settimana `[stima]`.
- File ad alto rischio: nessuno previsto. `firestore.rules` entra solo se cambia la forma dei
  salvati per chi ha un account `[VERIFY code-architect]`.
- Resta fuori: tutto il corpus nell'interfaccia, le email nuove, le zone bianche con avviso, la
  vista partner, il ponte del reel.

**Firma: «L'archivio intero, onesto»** (la mia raccomandazione)
- Architettura: come Prudente, più Esplora con due viste (Posti · Reel) e tracce al comune.
- Idee aggiunte: 1 Qui non ci siamo stati · 10 Le tracce a matita · 8 Il rullino dei 62 mesi ·
  3 Il provino dell'owner (con l'export) · 4 con l'email, quando il P0 è chiuso.
- Ore vostre: circa 5-7 ore una tantum (provino dei 409 circa 2 ore, richiesta dell'export, sei
  frasi per le regioni, decisione privacy); poi 0-30 minuti a settimana `[stima]`.
- File ad alto rischio: nessuno per l'app. Il P0 del backend tocca il lato server e serve
  comunque, con travellini-backend-engineer e la vostra conferma.
- Resta fuori: ponte del reel, «Voglio la scheda», «Ci siamo tornati», vista partner.

**Audace: «L'app che fa lavorare Instagram»**
- Architettura: come Firma, più il resolver per codice reel e gli avvisi per posto e per
  traccia.
- Idee aggiunte: 12 Il ponte del reel · 15 Voglio la scheda · 7 Ci siamo tornati · 13 La vista
  del partner.
- Ore vostre: altre 3-4 ore una tantum (conferma dei ritorni, export Insights, rilettura dei
  messaggi), poi circa 1-2 ore a settimana (una storia per reel, registrazione dei reel nuovi,
  lettura delle richieste) `[stima]`.
- File ad alto rischio: `firestore.rules` probabile (richieste per traccia, avvisi per posto),
  più email mirate lato server. Tutto con travellini-backend-engineer e la vostra conferma.
  `server.ts` no: il ponte usa un parametro, non una rotta nuova.
- Resta fuori: `/r/<codice>`, automazione dei DM, shop, Club.

**Raccomandazione: Firma, con direzione A salvo diverso esito della griglia.** Ordine:
1. la lista B (P0);
2. la base comune più Prudente;
3. il resto di Firma;
4. Audace solo dopo 8 settimane di dati veri, con i criteri di stop di growth.

---

## Da decidere prima di fondere il PR #27: privacy del corpus (non è un'idea di brainstorming)

**Fatti.**
- Il repository è pubblico (verificato dal main thread).
- `src/data/instagram-corpus.json` è tracciato nel ramo del PR #27 e contiene le coordinate
  esatte di circa 1.087 post (fp §1). Lo stesso file e `corpus-places.json` contengono ancora
  le voci che la deny-list esclude (fp, «Esito in testa»: 2 post, 1 chiave).
- I due file sono entrati con due commit del 14 e del 15 agosto (fp §11): anche togliendoli
  ora, restano nella storia del ramo.
- I dati non permettono di stabilire quale sia la zona di casa (fp §14). Proprio per questo
  nessuna generalizzazione fatta nell'interfaccia protegge ciò che nel file è già leggibile.

**Opzioni.**
- (a) Prima del merge, togliere i due file grezzi dal PR e committare solo un **indice derivato
  e generalizzato**: codice pubblico del reel, comune, regione, mese; niente coordinate esatte,
  niente visualizzazioni, niente caption; deny-list applicata al dato. I file grezzi restano
  solo sul vostro computer.
- (b) Come (a), più la riscrittura della storia del ramo prima del merge. Costa meno adesso che
  dopo, perché il ramo non è ancora su `main`. Richiede un force-push, quindi la vostra
  conferma esplicita (regole di sicurezza del repo).
- (c) Rendere privato il repository.
- (d) Accettare il rischio. Sconsigliato.

**Raccomandazione: (a) + (b)**, con un audit di travellini-security-auditor prima di eseguire.
L'audit verifica quante copie esistono già (fork, clone, cache) `[VERIFY]`. Esegue il main
thread, mai senza la vostra conferma.

**Conseguenza per il piano.** Le idee 8, 10, 12 e 15 (e la tabella codice → posto) leggono
l'indice derivato, non il grezzo. Se il grezzo esce dal repo, la CI non può più rigenerare
l'indice: va generato in locale e committato. È nel brief R3a.

---

## E. Decisioni per l'owner al gate R4 (sei, in ordine di quanto bloccano)

Ognuna sostituisce e assorbe le domande Q1-Q4 del primo piano e quelle nuove emerse in R1.

1. **Privacy del corpus e approvazione della spec del 14 agosto** (sezione sopra; assorbe Q3).
   - Raccomandazione: (a)+(b), e approvare la spec con la deny-list applicata al dato.
   - Sblocca: il merge del PR #27 e le idee 8, 10, 12, 15.
2. **Cosa misura l'app** (assorbe Q4 e due domande nuove di growth): gli endpoint `/api/*` sono
   in produzione? Resend e Brevo sono attivi, con doppio opt-in? Da dove arrivano oggi i ricavi:
   collaborazioni, affiliati, altro?
   - Raccomandazione: chiudere prima il bug P0 con travellini-backend-engineer.
   - Metrica primaria: email distinte la cui **prima** origine è un gesto dell'app (lista,
     traccia, regione, posto). Contro-metrica: richieste partner qualificate.
   - Se i ricavi vengono soprattutto dalle collaborazioni, le due si scambiano.
3. **Pacchetto e direzione.**
   - Raccomandazione: Firma. A o B secondo la griglia D, con A come default.
4. **Immagini per i 409 posti** (assorbe Q2 e la domanda di asset-curator).
   - (a) Export di Instagram, token, oppure solo i 79. Raccomandazione: export (una richiesta,
     circa 5 minuti `[VERIFY]`), ma il lancio avviene comunque con i 79.
   - (b) Minori, gravidanza e neonato: in attesa per default, li sbloccate voi uno per uno.
     Personaggi con licenza di terzi (ristoranti a tema): segnalati, decidete caso per caso.
   - (c) Titolo in HTML e immagine senza testo impresso, tranne dove l'immagine è mostrata come
     locandina del reel, con il badge play. Raccomandazione: sì.
5. **Che forma ha la webapp** (assorbe Q1). Raccomandazione:
   - (a) «Webapp» = guscio persistente a schede + home a schermo unico + «I miei posti» senza
     account e leggibili offline. L'installazione è una conseguenza, proposta solo dalla seconda
     visita e mai dentro Instagram.
   - (b) Cinque voci, con «Noi».
   - (c) L'edizione diventa una lente: cambia l'accento dei contenuti, non la cornice. Via la
     fascia a tre porte. È una modifica a `DESIGN.md` «Temi per audience».
   - (d) L'`h1` della scheda diventa il nome del posto; la domanda scende a sottotitolo. Title:
     «<nome> a <città> | Travelliniwithus».
6. **Tre verità da dire in pubblico.**
   - (a) Mostrare le sei regioni a zero. Siete stati in Puglia o nel Salento, e con quale
     materiale reale? Finché non c'è, sospendere lo SKU «Roadtrip in Puglia» e il pillar
     «Salento agosto».
   - (b) «Ci siamo tornati» è un fatto datato, non un verdetto. Lo confermate posto per posto.
   - (c) La mappa interattiva ha un consenso suo, separato da quello pubblicitario, dopo la
     verifica legale.
   - Raccomandazione: sì a tutte e tre.

---

## D. Griglia di valutazione A/B (da compilare guardando le catture)

**Dove.** `/tmp/claude-0/-home-user-TRAVELLINIWITHUS/8c6b9c85-6fd1-5455-93cb-7a8ffe3e982f/scratchpad/prototipi/A`
e `/B`. Al momento della sintesi ci sono solo le cartelle degli asset: l'HTML e le catture non
sono ancora arrivati.

**Catture per direzione:**
1. 390×844, primo schermo;
2. 1440×900, primo schermo;
3. ausiliaria 390×844 dopo lo scroll su «Altri posti».

**Chi compila.**
- browser-auditor misura: axe, contrasto, overflow e dimensioni.
- ui-designer compila i criteri 2, 4, 7 e 9.
- Owner e Betta fanno il test alla cieca (criterio 3).
- code-architect fornisce il criterio 6 (delta di `initial-js`) dal brief R3a.

**Correzioni che blocco ai criteri di R1a:**
- il criterio 1 si giudica con 4 voci, come nel prototipo; la quinta voce non cambia le misure
  (UA);
- il criterio 3 diventa un test alla cieca solo tra A e B, senza il confronto con altre app;
- i criteri 5 e 10 non sono valutabili su questi prototipi (manca una scheda senza foto; c'è
  una sola edizione): valgono «non valutato» e non entrano nella regola;
- il criterio 6 usa i numeri di R3a, non i prototipi.

| # | Criterio | Come si verifica | Bloccante | A | B | Note |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Leggibilità a 390×844, posto aperto, senza scroll | nella cattura 1 si vedono: fotogramma reale alto ≥ 280 px; nome del posto come testo più grande; comune e regione; azione primaria; barra delle voci. Testo ≥ 16 px, etichette ≥ 13 px, nulla sotto 12; axe AA senza violazioni (anche su testo sopra foto); tocchi ≥ 44 px | sì | ☐ passa ☐ no · misure: | ☐ passa ☐ no · misure: | |
| 2 | Densità senza dashboard | cattura 2: almeno 6 posti reali riconoscibili dal nome senza hover; zero contatori, zero chip-filtro, nessuna card dentro una card, massimo 3 livelli tipografici per card. Test della sfocatura a 8 px: si legge una pagina, non un pannello | no | | | |
| 3 | Riconoscibilità senza logo | marchio coperto, A e B affiancati in ordine casuale: owner e Betta indicano «la nostra» in 5 secondi e nominano 3 elementi loro che non siano il colore dei bottoni | no (ma serve a B per vincere) | | | |
| 4 | Tenuta con fotogrammi imperfetti | La Santoria (poca luce, rosso) e The Burton Juice (cartiglio lungo, testa alta): nessuna scritta del fotogramma mozzata, nessuna collisione tra il nostro testo e il suo, nessun testo in colore accento sopra una foto. Il cartiglio intero è ammesso solo dove l'immagine è la locandina del reel | sì | | | |
| 5 | Tenuta senza foto | **non valutato** su questi prototipi | — | n/v | n/v | eventuale secondo giro, solo in caso di parità |
| 6 | Costo tecnico | font e librerie nuove (numero e KB), token cambiati, componenti toccati fuori dal guscio, delta di `initial-js` ≤ 0 (da R3a) | no | | | |
| 7 | Coerenza tra guscio e livelli | stessa barra alta, stesso piano in basso, stessa scala tipografica tra posto e articolo; ≤ 2 colori di fondo tra voci e livelli; mai due piani fissi in basso | sì | | | |
| 8 | Mappa senza consenso | la carta locale mostra posti, non un muro; il comando per la mappa interattiva è nel primo schermo a entrambe le misure; nessuna richiesta esterna prima del consenso (controllo di rete sull'HTML) | sì | | | |
| 9 | Motion e reduced motion | un solo gesto per transizione, ≤ 320 ms, solo transform e opacità; con `prefers-reduced-motion` niente animazioni e nessuna informazione persa | no | | | |
| 10 | Tenuta delle edizioni | **non valutato** (solo Viaggiatori nel prototipo) | — | n/v | n/v | |

**Regola di decisione.**
1. Se una direzione fallisce un criterio bloccante (1, 4, 7, 8) e l'altra no, vince l'altra.
2. **B vince solo se valgono tutte e quattro le condizioni:**
   - passa tutti i bloccanti;
   - batte A in almeno un criterio che A non può recuperare restando nella sua DNA, scritto in
     una frase che non sia di gusto («più moderna» o «più app» non valgono);
   - al test alla cieca owner e Betta la indicano come «nostra»;
   - non perde su 4 e su 7.
3. Altrimenti vince A. In caso di parità vince A, perché costa meno e non tocca la DNA.
4. Anche se B vince, il fondo inchiostro resta una proposta con gate dell'owner: si scrive in
   `DESIGN.md` solo dopo la conferma.

**Cosa mi farebbe cambiare idea.**
- Verso B:
  - test alla cieca netto per B, con B che passa 1, 4 e 8 senza scivolare in feed o storie;
  - una pipeline che garantisce la foto certificata ad almeno il 90% dei posti mostrati. Oggi
    vale per 79 su 79 visibili e per 0 dei 409 nuovi, quindi la precondizione di B oggi manca.
- Verso A:
  - A a 390 px non sembra un sito ristretto;
  - B mostra due titoli in conflitto (cartiglio più nome) o collisioni di testo.

---

## B. Da sistemare a prescindere dalla webapp

«Alto rischio» = tocca `server.ts`, `firestore.rules` o `src/config/admin.ts`: solo
travellini-backend-engineer, con la conferma dell'owner. Numerazione usata nella matrice (B3,
B5, B6).

### P0: verità, legale, sicurezza

| # | Difetto | Evidenza | Chi | Alto rischio |
| --- | --- | --- | --- | --- |
| B1 | Endpoint `/api/*` non verificati in produzione: nessun lead reale; Resend e Brevo `[VERIFY]` | `docs/14_Bugs/BUG_API_ENDPOINTS_SENZA_BACKEND_IN_PROD_2026-07-26.md` (ramo base), rilievo di growth | travellini-backend-engineer + owner | **probabile** `[VERIFY: quali file]` |
| B2 | Corpus grezzo con coordinate esatte e voci in deny-list nel repo pubblico | sezione «Da decidere prima di fondere il PR #27» | owner + travellini-security-auditor; esegue il main thread | force-push: conferma owner |
| B3 | Copertine `ai-generated` (`/images/destinations/`) usate come hero e og:image delle regioni (Puglia, Sardegna; altre `[VERIFY]`); anche `/images/experiences/` è classificato `ai-generated` `[VERIFY: dove è usato]`. Le intro regionali dichiarano esperienze non fatte (Puglia) | `asset-provenance.json:37-38`, `destinations.ts:74, :98`, `Destinazione.tsx:304` (SE) | frontend-builder (scheda tipografica al posto dell'immagine) + seo (testi) + asset-curator (elenco usi) | no |
| B4 | «Attiva la mappa» imposta il consenso `marketing`; con quel consenso `trackEvent` e `trackPageview` inviano a Meta e TikTok se i pixel sono caricati | `Mappa.tsx:86-93`; `analytics.ts:154-185` (letto in R2); pixel in produzione `[VERIFY env]` | owner (legale) + frontend-builder (categoria «mappe»); nel frattempo etichetta onesta | no |
| B5 | Dicitura commerciale incoerente su 12 schede su 86 (7 «organic» con marcatore nella caption); `llms-full.txt` ripete «nessun accordo»; base del «33 collaborazioni dichiarate» `[VERIFY]` | fp §6; SE scoperta 13 | owner (revisione, circa 1 h) + frontend-builder (seed e rigenerazione di llms) | no |
| B6 | `BRAND_STATS`: l'unico dato verificato (IG 172.680 al 15 ago 2026) sta accanto a tre dichiarati e mai verificati, e a due già superati dal corpus | `src/config/site.ts` (GR, P0.4) | owner (export Insights) + main thread | no |
| B7 | Date di pubblicazione presentate come date di visita: «ci siamo stati a giugno 2026» in home; ripiego di `SchedaVerifica` | `BrandCoherentHero.tsx`; `SchedaVerifica.tsx:36-43` | frontend-builder + seo (testo «reel di…») | no |
| B8 | `ExitIntentPopup` montato su tutte le pagine tranne `/`, `/mappa` e `/guida-in-regalo` | `Layout.tsx:32-59` | frontend-builder, con la conferma owner (toglie una funzione di growth) | no |
| B9 | La meta della home promette «il consiglio onesto se un posto merita il viaggio», ma dal 15 agosto il modello descrive e non giudica | `routeMeta.ts:40`, `AtlanteHome.tsx:13`, `index.html:16` (SE) | seo + frontend-builder | no |
| B10 | SKU d'ipotesi «Roadtrip in Puglia» e pillar «Salento agosto» su una regione a zero reel | hub marketing, fp §7 | owner (E6a) | no |

### P1: bug visibili

| # | Difetto | Evidenza | Chi | Alto rischio |
| --- | --- | --- | --- | --- |
| B11 | «Vedi sulla mappa» rotto: la scheda apre `/mappa?place=`, la mappa legge `?posto=`. Attenzione: anche le proposte di SE usano `?place=`; il nome giusto è `posto` | `Posto.tsx:79`, `FullScreenMapExperience.tsx:666` (verificato) | frontend-builder + test e2e di andata e ritorno | no |
| B12 | La produzione è hosting statico con rewrite `**` → `/index.html`: slug inesistenti, `/preferiti` e segnaposto rispondono 200 con la testa della home; il fallback porta il canonical della home `[VERIFY con una build]` | `firebase.json:37-49` (verificato), SE scoperte 1-3 | code-architect (R3a) → frontend-builder. `firebase.json` non è in lista ad alto rischio ma cambia il routing di produzione: conferma owner | no |
| B13 | Il corpo delle pagine non è prerenderizzato (solo `<head>`): i motori AI senza JavaScript non leggono la scheda | `generate-route-html.js:336-343` (SE) | code-architect → frontend-builder | no |
| B14 | «Torna alla sezione» finisce sopra il logo in `/articolo` desktop | `Articolo.tsx:492-501` (UD) | frontend-builder | no |
| B15 | `buildPlaceItemListJsonLd` non esiste nel commit 4fe1794 (nel checkout c'è solo una patch locale non committata): gli articoli sono rotti | SE scoperta 10; fp, «Cornice» | main thread / frontend-builder | no |
| B16 | Titolo impresso mozzato nei ritagli attuali (mezza riga di località sopra la foto) | `coverFocusY` 64, screenshot 05 e 07 (UD, AS) | frontend-builder (regola di ritaglio) + asset-curator | no |
| B17 | Uno slug sconosciuto rimanda senza avviso a `/esplora` | `Posto.tsx:52-54` (UA) | frontend-builder | no |
| B18 | Il fallback di Suspense avvolge anche la testata: lo schermo intero passa al loader | `App.tsx:81-96` (UA) | frontend-builder | no |
| B19 | Mappa senza consenso: muro scuro con colore fuori token, occhiello a 10 px, «Attiva la mappa» tagliato a 1440×900; suono al tocco del pin acceso di default; volo di 1,8 s inclinato | `Mappa.tsx:42-75`; `FullScreenMapExperience.tsx:455, 611-650` (UD, UA) | frontend-builder | no |

### P2: SEO e igiene

| # | Difetto | Evidenza | Chi | Alto rischio |
| --- | --- | --- | --- | --- |
| B20 | Due host: `llms.txt` usa `www`, canonical e sitemap no | `generate-llms-index.mjs:25` (SE) | frontend-builder | no |
| B21 | `lastmod` della sitemap = ora della build | `generate-sitemap.js:273, :312` (SE) | frontend-builder | no |
| B22 | Meta di `/destinazione` falsa («tutte le 20 regioni… provati») | SE scoperta 9 | seo | no |
| B23 | Inglese nell'interfaccia: «Gifted», «Budget: Medio», «Food & Ristoranti», manifest «Travel blog» | SE scoperta 11 | seo + frontend-builder | no |
| B24 | Manifest: `theme_color #ffffff` contro `#faf8f4`; niente `lang`, `start_url`, `scope`, `id`; icona 512 «any maskable» sullo stesso file | `vite.config.ts:33-53` | frontend-builder | no |
| B25 | `knowsAbout` «isole minori italiane» nel JSON-LD, non sostenuto dai dati (Sardegna 0, Sicilia 1) | `index.html:163-166` (SE) | seo + frontend-builder | no |
| B26 | `noindex` delle rotte private solo via JavaScript; `SEO.tsx` emette sempre «noindex, nofollow» | SE, correzioni trasversali 3 | frontend-builder (più header in `firebase.json`) | no |
| B27 | Provenienza per cartella: 13 cover visibili fuori censimento; orfani `reel-1..5` con logo TikTok (3,05 MB) | fp §10; AS | asset-curator (più conferma owner per rimuovere) | no |
| B28 | Immagini con header `immutable` e nomi senza hash: una cover ritagliata con lo stesso nome non si aggiorna nei browser | `firebase.json:61-62` (AS) | regola per asset-curator e frontend-builder | no |
| B29 | `reels.ts` prevede di scegliere la hero per «views»: popolare quel campo violerebbe la regola metriche | SO rischio 7 | frontend-builder | no |
| B30 | Brevo con `updateEnabled: true` sovrascrive la `SOURCE`: la prima origine si perde, quindi il conteggio si fa su Firestore `leads` | GR §3 | travellini-backend-engineer | `[VERIFY: file]` |
| B31 | Deriva documentale: la roadmap UI/UX R5 descrive un gate spento; `DESIGN.md:186` descrive un layout non più applicato; `AudienceGate` spento ma ancora nel codice | UD, UA | main thread (docs) + frontend-builder | no |
| B32 | Lo script di cattura degli screenshot non fallisce sulle pagine 404: 6 catture su 18 lo erano | UD, note | travellini-quality-auditor | no |

---

## Contraddizioni tra specialisti, e come ho deciso

| Tema | Chi dice cosa | Decisione | Evidenza |
| --- | --- | --- | --- |
| Verdetto | Il mio seme «voi avete guardato, noi giudicato» lo usava; UD, UA, GR, SO e SE lo danno per tolto | Nessuna idea usa il verdetto. «Ci siamo tornati» sopravvive come fatto datato, con la vostra conferma (E6b) | Verdetto tolto il 15 agosto (`Posto.tsx:234-236`, `types/content.ts`: «descrive, non giudica») |
| Lancio «79 + 21 reel» | La mia ipotesi Q2; AS la smentisce | Lancio con i **79**; i 21 entrano con l'export | 0 dei 897 reel candidati hanno una cover su disco (fp §10) |
| Metrica primaria | La mia ipotesi: «email nate nell'app»; GR la corregge (prima origine da un gesto di utilità, contro-metrica partner, scambio se i ricavi sono B2B) | Adotto la definizione di GR; la scelta finale è in E2. Oggi nessuna delle due è misurabile | bug P0 aperto (B1); Brevo sovrascrive l'origine (B30) |
| Tracce con o senza immagine | GR: nessuna, oppure fotogrammi estratti; AS: foto di un altro reel dello stesso punto, o punto d'inchiostro; UA e SE: mai | Nessuna immagine al lancio. **La foto è il segno che una traccia è diventata un posto** | 0 cover su disco (fp §10); regola sulle immagini vere |
| Tracce su un punto o sul comune | AS: punto alla coordinata (fino a 939); SE: «pin distinto»; UA: segno sul comune | **Comune** | 19,6% di etichette con paese sbagliato (fp §7); zona di casa non determinabile (fp §14); coordinate nel repo pubblico; tetto di 60 marcatori |
| Consenso della mappa | SE: tenerlo, con etichetta onesta; UA: consenso «mappe» separato; UD: carta locale come stato di partenza | Carta locale sempre come partenza; consenso separato raccomandato (E6c); nel frattempo l'etichetta onesta di SE | `analytics.ts:154-185` |
| Parametri d'ingresso da un reel | SO: `/esplora?reel=<code>`; UA: `/esplora?traccia=<codice>`; SE: `/mappa?traccia=<id>` | **Un solo parametro in entrata, `reel=<codice>`**, che risolve con `replace` verso `/posto/<slug>` o verso lo stato traccia. I nomi finali nel contratto di R3a | tre schemi diversi per la stessa cosa |
| Cartiglio (titolo impresso) | AS: sempre via, titolo in HTML; UD-B: il cartiglio resta, è la locandina; UD-A: cartiglio intero solo nella vista «Guarda il reel» | Il cartiglio compare **solo dove l'immagine è presentata come locandina del reel**, con il badge play (modello media deciso). Ovunque altro, ritaglio sicuro | 86 cover su 86 con testo impresso (AS); spec media §2 |
| Home: numero del mese | UD idea 10: scelto a mano ogni mese; UA idea 3: automatico | Automatico (idea 9); quello curato va in riserva | carico ricorrente per voi |
| Voci della barra | UD, prototipo: 4; UA: 5 (con «Noi») | 5 raccomandate (E5b). I prototipi si giudicano a 4 | UA: il quinto slot non cambia le misure |
| `h1` della scheda | UD: il nome; SE: l'hook con il nome dentro | `h1` = nome del posto, domanda come sottotitolo, title con il nome in testa (E5d) | title attuale di 85 caratteri con il nome al 47° (SE scoperta 8) |
| Persona | Brief: «chi arriva da un reel»; GR: quello è un canale; la persona è «chi decide la prossima uscita» | Ingresso progettato per il reel, ritorno per chi decide | lessico «cena» 104, «serata» 96; mediana 28 € a pasto (fp §5, §9) |
| Momento d'installazione | GR: dopo il terzo salvataggio; UA: dalla seconda sessione con almeno un salvataggio; SE: dopo il secondo | UA come regola; mai alla prima visita, mai dentro Instagram, mai in modale | — |
| Fondo delle cartoline OG | AS: `#f7f0e5` | Sabbia `#faf8f4` | `index.html:18`: `#f7f0e5` non è un fondo del sito |
| AudienceGate | Il mio brief: modale bloccante; UD, UA, GR: spenta dal 17 agosto | Via dal codice e via la fascia a tre porte dal guscio (E5c) | `AudienceGate.tsx:29` |

## Ipotesi di lavoro Q1-Q4: stato

| Domanda | Stato dopo R1 | Dove si decide | Idee che ne dipendono |
| --- | --- | --- | --- |
| Q1 Cosa vuol dire webapp | ipotesi confermata da UA, GR, AS | E5 | 4, 11, 14 |
| Q2 Spec corpus e lancio | lancio con i 79 (corretto da AS); spec da approvare con la deny-list nel dato | E1, E4 | 3, 8, 10, 12, 15 |
| Q3 Privacy della linea del tempo | in parte risolta dai dati: zona di casa non determinabile, quindi tutte le tracce stanno al comune; resta la conferma dell'owner | E1, E6 | 7, 8, 10 |
| Q4 Metrica primaria | raffinata da GR; condizionata alla fonte dei ricavi | E2 | 1, 4, 12, 13, 15 |

## Prossimi passi

- **R3a** travellini-code-architect: `docs/50_Scratch/HANDOFF_webapp-travelliniwithus_orchestrator_to_code-architect.md`.
  Parte subito, in parallelo alla griglia.
- **Griglia A/B (D)**: si compila quando arrivano le catture. browser-auditor misura axe,
  contrasto e overflow sull'HTML dei prototipi.
- **Da preparare solo se l'owner sceglie (a) o (b) in E1**: un brief per
  travellini-security-auditor (storia git, fork, copie del corpus).
- **Gate R4**: sintesi più griglia compilata più R3a. L'owner risponde a E1-E6. Tempo stimato:
  45-60 minuti `[stima]`. Solo dopo nasce il file DECISION e il piano d'implementazione (nuova
  invocazione dell'orchestratore).
- **Da non fare adesso**: perf-engineer (misura quando c'è codice), quality-auditor (idem),
  Codex, workflow a ventaglio.

## Note per il main thread

- Da marcare `status: consumed` nel frontmatter, una riga per file (non ho uno strumento di
  modifica puntuale e non riscrivo file da 700-1.600 righe):
  - `HANDOFF_webapp-travelliniwithus_data-analyst_to_divergenza.md`
  - `HANDOFF_webapp-travelliniwithus_ui-designer-direzione_to_orchestrator.md`
  - `HANDOFF_webapp-travelliniwithus_ui-designer-architettura_to_orchestrator.md`
  - `HANDOFF_webapp-travelliniwithus_growth_to_orchestrator.md`
  - `HANDOFF_webapp-travelliniwithus_social_to_orchestrator.md`
  - `HANDOFF_webapp-travelliniwithus_seo_to_orchestrator.md`
  - `HANDOFF_webapp-travelliniwithus_asset-curator_to_orchestrator.md`

  I sette brief `orchestrator_to_*` sono già `consumed`.
- Nel brief `..._orchestrator_to_data-analyst.md`, riga 55, la sostituzione dell'id ha lasciato
  il refuso «il post il post».
- Miglioria operativa riusabile (proposta, non applicata): un template di brainstorming in
  `docs/90_Templates/` con domanda che forza, lista del vietato, scheda idea, doppia adozione e
  cancelli duri. Questo giro ha prodotto 62 schede idea confrontabili in un solo formato (più
  gli 8 semi dell'orchestratore).
