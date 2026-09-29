---
title: HANDOFF_webapp-travelliniwithus_social_to_orchestrator
status: open
created: 2026-09-29
from: travellini-social-content-operator
to: travellini-orchestrator
slug: webapp-travelliniwithus
expires: 2026-10-13
type: handoff
area: delivery
round: R1 (divergenza, scritta senza leggere le altre uscite R1)
consumes: HANDOFF_webapp-travelliniwithus_orchestrator_to_social
---

# Handoff: tre loop reel → app, tre formati che esistono solo con l'app, il ponte per codice reel, e dove si rompe tutto

## Why this work matters

Il pubblico sta su Instagram. L'app serve solo se vince il momento dopo il reel e se restituisce
a Instagram formati che senza di lei non esisterebbero. Qui ci sono i loop, i formati, il ponte e
i punti di rottura, pronti per la sintesi R2.

## Risposta breve alle due domande

**1. Cosa fa una persona nei 10 secondi dopo il reel, e come vince l'app contro il tasto Salva.**
Quando il reel finisce, Instagram lo fa ripartire e il reel successivo è già sotto il pollice. Le
azioni possibili sono sei: scorrere, mettere like, salvare, mandarlo a qualcuno, commentare, aprire
il profilo o il geotag. Nessuna esce da Instagram. Solo tre portano a un link cliccabile: il
profilo (poi la bio), il commento (poi una risposta in DM) e la storia del giorno (poi lo sticker).
Quante persone fanno cosa non lo sappiamo, perché il corpus non contiene salvataggi, condivisioni
né visite al profilo `[VERIFY: Insights per reel: salvataggi, condivisioni, visite al profilo, tocchi sul link in bio]`.

L'app **non** vince quei 10 secondi contro il Salva, e non deve provarci: il Salva costa un tocco,
l'app costa un'uscita. Vince su tre cose:

- **Usare il Salva invece di combatterlo.** Il reel dice «salvalo», la storia dello stesso giorno
  porta alla scheda. Il Salva di Instagram diventa anche la rete di sicurezza: se il browser
  integrato perde «I miei posti», il reel salvato resta e la storia in evidenza riporta alla scheda.
- **Trasformare in link il gesto che il pubblico fa già: commentare.** Mediana di 70 commenti per
  reel, nessun reel a zero (fact pack §13). Le caption lo chiedono da anni: «conoscevi» è in 154
  caption, «proveresti» in 133, «piacerebbe provare» in 26, «tagga qualcuno» in 18 (§9).
- **Far uscire dal telefono il salvataggio che conta.** Il Salva di Instagram è una pila senza
  luogo, senza prezzo, senza data e senza «cosa c'è intorno», e non si manda come lista a chi
  viene con te. L'app invece sì, ma solo se la lista finisce in un'email o in un link: la memoria
  del browser integrato potrebbe non sopravvivere `[VERIFY]`. Questa fragilità è una ragione
  onesta per chiedere l'email, e l'email è la metrica primaria.

**2. Quale formato può esistere solo perché esiste l'app.** Quello che usa il tempo come materiale.
Instagram ordina per data e basta: non sa che sei reel pubblicati in tre anni sono lo stesso posto,
non mostra una mappa del profilo, non sa cosa avete pubblicato nella stessa settimana degli anni
passati, non sa quali regioni sono vuote. L'app sì: ha 1.016 reel con coordinate e data, in 62 mesi
consecutivi. Propongo tre formati: «La mappa bianca» (carosello più sondaggio), «Ci siamo tornati»
(reel) e «Esiste ancora?» (storia settimanale). Nessuno dipende dal singolo punto sulla mappa:
lavorano per regione, per posto confermato a mano o per data.

## Decisions already made (rispettate, non rimesse in discussione)

- Travelliniwithus diventa una webapp. Articoli, guide e schede posto restano URL indicizzabili.
- Modello media (spec corpus §2): copertina 9:16 con badge play e handle, il tap apre
  `/reel/<code>`; con la spunta c'è il `<video>` in pagina, `preload="none"`, mai autoplay. Niente
  embed ufficiale. Un carosello non è un reel.
- Imagery truth: solo fotogrammi e riprese reali con provenienza; AI solo per `craft`; mai far dire
  a Rodrigo e Betta cose che non hanno detto.
- Regole di canale: Telegram disabilitato; `/guida-in-regalo` unica landing della bio; 1 contenuto
  partner ogni 4 editoriali; nessun numero social nel codice.
- Dicitura collaborazioni: nel 2026 si passa da «Adv» a «Invited» e «Affiliazione» (fact pack §6).
- Correzioni del main thread, applicate ovunque qui sotto:
  - 1.192 reel e 211.941.714 plays sono il totale; 1.016 reel usabili hanno coordinate.
  - 409 è la cifra dei posti nuovi (533 è un tetto).
  - I geotag hanno errori documentati.
  - La modale AudienceGate è spenta dal 17 agosto: nessun loop qui dipende dalla scelta di edizione.
  - «Il Timbro» è stato tolto dalla scheda il 15 agosto: nessuna idea qui poggia sul verdetto.
  - Il repo è pubblico: in questo file non ci sono id in deny-list, strutture sanitarie, zone
    private, coordinate né dati personali, e nessun contenuto Family come esempio.

## Context the receiver needs

**Letti**: questo brief; il fact pack (`HANDOFF_webapp-travelliniwithus_data-analyst_to_divergenza.md`:
esito, incongruenze, §2-§10, §12-§15); `docs/MARKETING_OPERATIONS_HUB.md`; lo snapshot brand; la
guida editoriale; i pilastri; `BEST/docs/superpowers/specs/2026-08-14-corpus-e-modello-media-design.md`;
`BEST/src/config/reels.ts` (interfaccia e intestazione); gli screenshot 01, 05, 06 e 07. **Non
letti**: le altre uscite R1 e il codice dei componenti. Tutto ciò che riguarda il comportamento del
codice oltre il brief è marcato `[VERIFY]`.

**Fatti su cui poggio** (dal fact pack; dove il brief diverge, vince il fact pack):

| Fatto | Valore | Fonte |
| --- | --- | --- |
| Reel totali / plays | 1.192 / 211.941.714 (snapshot inferito del 14 ago 2026) | §4 |
| Reel usabili (senza deny-list) / con coordinate | 1.190 / 1.016 | §15 |
| Reel geolocalizzati senza scheda propria | 939 su 1.016 (92,4%) | §15 |
| Tracce su locali senza scheda | 484 reel su 409 coordinate (297 luoghi in Italia) | §15, esito |
| Reel senza posto preciso | 369 con etichetta generica, 25 senza coordinate, 149 senza luogo: 543 su 1.190 | §15 |
| Luoghi «di ritorno» (date a più di 30 giorni) | 106 per nome, 62 locali veri. La data è quella di pubblicazione | §3 |
| Continuità | 62 mesi su 62 con almeno un reel; 241-267 reel all'anno dal 2022 | §2 |
| Regioni a zero reel | Basilicata, Friuli-Venezia Giulia, Marche, Molise, Puglia, Sardegna | §7 |
| Qualità dei geotag | 10 etichette su 51 che nominano un paese ne risolvono un altro. L'etichetta «Italia» (89 reel) cade in Umbria | §7 |
| Commenti | mediana 70 per reel, nessuno a zero `[VERIFY: cosa conta il campo]` | §13 |
| Collaborazioni dichiarate | 182 reel (15,3%). Nel 2026: «Invited» 33, «Affiliazione» 8. Registro e testo discordano su 12 schede su 86 | §6 |
| Prezzi in caption | 243 reel (20,4%), sempre legati alla data di pubblicazione | §5 |
| Stagionalità (mese di pubblicazione) | luoghi locali in ogni mese: 31 ad agosto, 54 a novembre. Le 79 schede visibili: 19 su luglio | §8 |
| Cover reali | 0 dei 897 reel candidati fuori dal registro hanno una cover su disco | §10 |
| Aggiornamento del corpus | non si rigenera in CI (feed autenticato); ultimo post 13 ago 2026 | esito, §2 |

## What the receiver should produce

Sintesi R2: scegliere quali loop, formati e opzioni del ponte portare all'owner. Le dipendenze da
decisioni owner sono elencate più sotto.

---

## 1. Tre loop reel → app → salva → condividi → iscritto o follower

**Premessa che vale per tutti.** Su Instagram un link si tocca solo in tre posti: la bio, lo sticker
link nelle storie e i DM `[VERIFY: se l'account ha link cliccabili nei reel o nelle caption]`. Caption e
commenti non sono cliccabili. Un QR dentro un reel è inutile, perché il reel si guarda sullo stesso
telefono che dovrebbe inquadrarlo. Quindi ogni loop deve passare da una storia, da un DM o dalla bio.

**Progettare per il caso peggiore** (salvataggi persi all'uscita dal browser integrato): ogni loop
lascia almeno un appiglio fuori da quella memoria. Può essere il reel salvato su Instagram, la
storia in evidenza, il DM (resta nella casella), l'email con la lista o il link della lista.
L'email è anche l'uscita dal browser integrato: si apre nel client di posta e, da lì, in un browser
dove l'installazione è possibile `[VERIFY: browser usato da Gmail e Mail su iOS e Android]`.

### Loop A: «Storia-ponte» (sticker nella storia del giorno)

- **Ingresso**: sticker link in una storia pubblicata lo stesso giorno del reel, con un fotogramma
  reale del reel. Poi in evidenza, per posto o per regione `[VERIFY: gli sticker link restano
  cliccabili nelle storie in evidenza]`.
- **Passi**:
  1. Il reel chiude con una riga a schermo: «Salvalo. La scheda è nella storia di oggi.»
  2. La storia ha lo sticker «Prezzo e indirizzo», che apre
     `/esplora?reel=<code>&utm_source=instagram&utm_medium=story&utm_campaign=reel&utm_content=<code>` (vedi §3).
  3. Il browser integrato apre l'app; il resolver porta alla scheda, se esiste, o alla traccia.
  4. La persona ha appena visto il reel: le azioni principali sono «Salva nei miei posti» e «Manda
     a chi viene con te». «Apri su Instagram» passa in secondo piano, perché la riporta indietro.
  5. Dopo il primo salvataggio: «Questa lista vive in questo browser. Te la mandiamo per email, così
     non la perdi?». La lista è un invio richiesto; la newsletter è una casella separata, non spuntata.
  6. Condivisione come link della lista (idea 3) su WhatsApp o iMessage.
- **Uscita**: iscritto alla newsletter (metrica primaria), oppure lista condivisa. Chi la riceve la
  apre fuori da Instagram. Dalla scheda, il link al profilo può portare un nuovo follower.
- **Misure**:

| Passo | Cosa si misura | Dove | Consenso |
| --- | --- | --- | --- |
| Storia | tocchi sullo sticker, uscite | Insights IG (owner) | nessuno lato sito; dato aggregato di Meta |
| Arrivo | page_view con `utm_content=<code>` | GA4 | analytics `[VERIFY: categoria nel banner attuale]` |
| Salvataggio | evento di conteggio | GA4 | analytics. Il salvataggio in sé è una funzione richiesta dall'utente `[VERIFY: privacy policy]` |
| Email | iscrizione con attributo `origine=reel:<code>` | Brevo `[VERIFY: attivo in produzione]` | consenso newsletter esplicito, doppio opt-in `[VERIFY]` |
| Condivisione | evento di condivisione; arrivo con `utm_source=lista` | GA4 | analytics di chi manda e di chi riceve |
| Follower | visite al profilo, nuovi follower | Insights IG | nessuno; non attribuibile alla singola persona |

- **Dove si rompe**:
  - **Scadenza**: la storia dura 24 ore. Dopo, il link vive solo nell'evidenza. Un reel che cresce
    al terzo giorno perde il ponte `[VERIFY: quota di plays dopo le prime 24 ore, non nel corpus]`.
  - **Reel senza posto preciso**: 543 su 1.190 (etichetta generica, senza coordinate o senza
    luogo). Per loro lo sticker può portare solo a una zona, o a niente.
  - **Reel nuovi**: quelli pubblicati dopo il 13 agosto 2026 non sono nel corpus. Ogni reel nuovo va
    registrato a mano prima della storia: al ritmo di 241-267 reel l'anno, circa 20 al mese. Se il
    passaggio salta, il reel più fresco (il più visto in quel momento) cade nel ripiego.
  - **Browser integrato di Instagram**:
    - memoria separata da Safari e Chrome, forse cancellata alla chiusura `[VERIFY iOS e Android]`;
    - nessun momento di installazione `[VERIFY]`;
    - il banner del consenso copre la scheda nel momento chiave, forse a ogni sessione se la
      memoria si azzera `[VERIFY]`;
    - il tap sulla copertina del reel (`instagram.com/reel/<code>`) può riportare nell'app Instagram
      e chiudere il loop dalla parte sbagliata `[VERIFY: comportamento dentro il browser integrato]`.
  - **Tracce sulla mappa**: le tessere della mappa sono dietro il consenso marketing. Senza quel
    consenso, chi arriva vede una mappa vuota. La traccia deve aprirsi come riquadro con testo, e la
    mappa resta facoltativa. Per queste tracce oggi non c'è nessun fotogramma reale su disco (§10).
  - **Carico owner**: una storia in più per ogni reel.

### Loop B: «Parola nei commenti» (risposta a un commento, link in DM)

- **Ingresso**: la risposta a un commento. Il reel chiede una parola: «Scrivi SCHEDA nei commenti:
  ti mandiamo il link in privato.» Un'automazione risponde in DM.
- **Passi**:
  1. La persona commenta con la parola: è l'unico loop che cattura davvero i 10 secondi.
  2. Arriva un DM con `/esplora?reel=<code>&utm_source=instagram&utm_medium=dm&utm_campaign=reel&utm_content=<code>`.
  3. Da qui si prosegue come nei passi 3-6 del Loop A.
- **Uscita**: iscritto o lista condivisa, come nel Loop A. In più, **il DM stesso è un salvataggio
  che sopravvive al browser integrato**: il link resta nella conversazione.
- **Misure**:
  - commenti con la parola e DM inviati (strumento, lato owner);
  - arrivi (GA4, con consenso);
  - iscrizioni con origine (Brevo, con consenso newsletter).
  L'attribuzione per reel è piena: la parola e `utm_content` identificano il reel. Lo strumento
  tratta l'handle di chi commenta: va aggiornata l'informativa `[VERIFY]`.
- **Dove si rompe**:
  - **Nessuno strumento documentato**. Servono una scheda `TPL_Tooling_Evaluation` e la conferma
    dell'owner (Scouting → Lab → Adoption). Senza automazione, rispondere a mano con una mediana di
    70 commenti per reel non regge. `[VERIFY: se la riga ricorrente «S@lva… scr1vic1» delle caption
    alimenta già un'automazione]`: in quel caso il loop si aggancia a quella, niente secondo strumento.
  - **Regole Meta**: messaggi automatici e «commenta per ricevere» come esca di engagement
    `[VERIFY: policy attuale]`. Niente condizione «seguici per ricevere il link»: il link arriva a
    tutti.
  - **Richieste di messaggio**: un DM a chi non ti segue può finire nelle richieste
    `[VERIFY: dove arrivano le risposte automatiche]`.
  - **Prova sociale**: i commenti diventano un muro di «SCHEDA» e le domande vere si perdono.
  - **Browser integrato**: il link del DM si apre lì, con gli stessi limiti del Loop A.
  - **Posto preciso**: per i 543 reel senza posto la parola non può promettere «la scheda».

### Loop C: «Il reel di ieri» (bio → `/guida-in-regalo`)

- **Ingresso**: la bio. Il link resta quello; cambia cosa trova chi arriva. `/guida-in-regalo` si
  apre così:
  1. una striscia «Hai appena visto un nostro reel? Eccolo.», con le ultime sei copertine reali;
  2. la guida in regalo (email);
  3. più sotto, sconti e assicurazione (link commerciali marcati).
- **Passi**:
  1. Profilo, poi bio.
  2. Tocco sulla copertina del reel appena visto: si apre la scheda o la traccia.
  3. «Salva» e «Mandami la lista e la guida»: una sola email, con due caselle distinte.
  4. Condivisione.
- **Uscita**: iscritto con `origine=bio:<code>`. Il tocco sulla copertina è un'autodichiarazione del
  reel di provenienza: è l'unico modo di attribuire un arrivo al singolo reel quando il link è unico.
- **Misure**: tocchi sul link in bio (Insights); page_view con `utm_source=ig_bio` (GA4, con
  consenso); tocco sulla copertina (GA4, con consenso); iscrizione con origine (Brevo, con consenso
  newsletter).
- **Dove si rompe**:
  - **La bio oggi non punta qui.** Lo snapshot brand (23 luglio) dice Linktree e «non modificare
    bio IG per ora»; nel Marketing Hub il gate «Bio IG + TikTok aggiornate» non è spuntato. **Questo
    loop dipende da una decisione owner già aperta** `[VERIFY: link attuale in bio]`.
  - **Aspettativa sbagliata.** La bio dice «SCONTI-ATTIVITÀ-ASSICURAZIONE IN BIO» e la formula in
    chiusura di caption dice «L1nk in bi@ per super sc@nti…»: chi tocca la bio cerca uno sconto. Se
    la pagina si apre con una guida, la promessa della caption è rotta. Gli sconti vanno tenuti
    trovabili sulla stessa pagina, sotto, perché lo snapshot vuole che codici e assicurazioni non
    guidino la hero.
  - **La striscia invecchia.** Senza un aggiornamento a mano per ogni reel nuovo, «il reel di ieri»
    resta quello di agosto.
  - **Email non attiva.** Nel Marketing Hub (`main`, 11 agosto) newsletter e lead magnet sono
    collegati ma non attivi: mancano Resend e Brevo, e il PDF va compilato con 10 luoghi
    `[VERIFY: stato in produzione sul ramo del PR #27]`. Se l'email non parte, **tutti e tre i loop
    si fermano al salvataggio locale**.

### Confronto

| | A. Storia-ponte | B. Parola nei commenti | C. Il reel di ieri |
| --- | --- | --- | --- |
| Momento catturato | chi guarda le storie, entro 24 ore | i 10 secondi (il commento) | chi apre il profilo |
| Attribuzione per reel | sì (`utm_content`) | sì, piena | sì, se tocca la copertina |
| Dipende da | registrare a mano ogni reel nuovo | uno strumento e la conferma owner | bio aggiornata (decisione aperta) e striscia aggiornata |
| Carico owner | una storia per reel | basso con lo strumento, alto a mano | un aggiornamento per reel |
| Si rompe prima per | la storia scaduta | lo strumento che manca | la bio non ancora cambiata |
| Variante | prudente | audace | firma |

Ordine consigliato: A subito (servono solo il resolver e la registrazione a mano). C quando l'owner
sblocca la bio. B come prova di strumento, con conferma.

---

## 2. Tre formati che esistono solo perché esiste l'app

Il brief esclude i beat, le caption complete e gli script oltre l'hook: qui ci sono i campi del
contratto di uscita che restano in perimetro.

### F1: «La mappa bianca» (carosello più storie con sondaggio)

- **Pilastro**: posti particolari, poi guide utili per decidere.
- **Hook (copertina, parole esatte)**: «Sulla nostra mappa ci sono sei regioni vuote. Scegli tu la prima.»
- **Valore**: chi guarda vede per la prima volta la geografia di cinque anni di reel. Capisce che
  ciò che mostriamo è stato girato, non raccolto. E sceglie la prossima regione.
- **Perché esiste solo con l'app**: Instagram non ha una mappa del profilo. La mappa esiste solo
  come vista dell'app sui 1.016 reel con coordinate; il carosello ne è una fotografia e il link
  rimanda alla vista viva.
- **Materiali reali**: mappa come asset `craft` (map wash), con presenza aggregata per regione;
  fotogrammi reali (`real-frame`) dai reel delle regioni piene; nessuna immagine generata delle
  regioni vuote.
- **Guardrail di verità**:
  - La mappa usa solo i luoghi locali. L'etichetta «Italia» (89 reel) cade in Umbria e la
    accenderebbe per errore (§7).
  - Si ragiona per regione, dove l'ordine di grandezza regge, mai sul singolo punto.
  - Si dice «vuote sulla nostra mappa», non «mai state»: le caption nominano la Puglia 3 volte e il
    Friuli 4, e Puglia e Basilicata hanno 3 luoghi con soli caroselli.
  - Ogni numero pubblico porta la fonte datata («dati al 14 agosto 2026»).
- **CTA**: nel carosello, «Salvalo e vota nelle storie di oggi». Nelle storie, il sondaggio
  `[VERIFY: numero di opzioni dello sticker]` e uno sticker link alla pagina della regione, dove un
  pulsante «Avvisami quando girate qui» raccoglie l'email con `origine=mappa-bianca:<regione>`
  (idea 9). Il link non porta alla mappa, perché senza consenso marketing le tessere non si vedono.
- **Repurpose**: carosello → storie con sondaggio → newsletter («Avete scelto: …») → reel dalla
  regione, solo se il viaggio si fa → la pagina della regione si accende.
- **Obiettivo di business**: raccolta contatti, con un interesse regionale dichiarato.
- **Metrica primaria**: iscrizioni «Avvisami» per regione. Secondarie: salvataggi del carosello e
  voti (Insights).
- **Rischio**: il sondaggio promette implicitamente un viaggio. Serve un impegno dell'owner, oppure
  una frase che non promette («vi scriviamo quando succede»).

### F2: «Ci siamo tornati» (reel, 30-45 secondi)

- **Pilastro**: esperienze reali e provate, poi travel couple lifestyle.
- **Hook (parole esatte, a schermo e voce)**: «Primo reel qui: 2023. L'ultimo: 2026. Perché continuiamo a tornarci?»
  `[VERIFY: l'owner conferma che sono ritorni veri]`. Le date sono quelle di pubblicazione di
  Movieland Park (2023-04 → 2026-07) e Ristorante al Mago (2023-10 → 2026-06), fact pack §3.
- **Valore**: un posto che regge al ritorno vale più di uno visto una volta. Il reel mostra cosa è
  rimasto uguale e cosa è cambiato (menù, prezzi datati, spazi).
- **Perché esiste solo con l'app**: su Instagram quei reel sono sparsi in tre anni di griglia. Solo
  l'app li riconosce come stesso posto e li mette in fila nella scheda, come una linea del tempo
  con tutti i reel girati lì.
- **Materiali reali**: fotogrammi `real-frame` di ogni reel del posto, ciascuno con la sua data di
  pubblicazione; audio originale, oppure una voce nuova di Rodrigo e Betta registrata per questo
  reel. Mai frasi attribuite che non hanno detto.
- **Base dati**: 62 luoghi locali veri con date di pubblicazione a più di 30 giorni l'una
  dall'altra.
- **Guardrail**:
  - Nel fact pack la «visita» è una finestra di pubblicazione, non un viaggio: prima di scrivere
    «ci siamo tornati» serve la conferma dell'owner.
  - I posti più ripetuti sono attività commerciali. Se un solo reel del posto porta un marcatore di
    collaborazione, o il registro dice `invited`/`adv`, il nuovo reel conta come contenuto partner
    nella regola 1 su 4 e porta la dicitura del 2026. Vanno controllati sia il testo sia il
    registro, che discordano su 12 schede su 86.
  - Privacy dell'area di casa (§14, decisione owner aperta): i ritorni vicini non vanno mai
    mostrati insieme su una mappa o con un raggio. Un posto per volta, alternato con ritorni
    lontani: il dato ne ha a Madrid, Londra, Luxor e Rust.
  - Le etichette doppie si uniscono a mano: il Warner Bros Studio Tour di Londra ha 3 etichette.
- **CTA**: «Tutti i reel di questo posto, in ordine, sono nella scheda: link nella storia di oggi.»
  (Loop A).
- **Repurpose**: reel → storia con link → linea del tempo nella scheda → newsletter («Il posto dove
  torniamo») → carosello «Cinque posti dove siamo tornati», solo con posti non partner.
- **Obiettivo di business**: autorevolezza, poi raccolta contatti.
- **Metrica primaria**: condivisioni e salvataggi (Insights). Secondaria: tocchi sullo sticker.

### F3: «Esiste ancora?» (storia settimanale, 3-4 schermate, in evidenza per anno)

- **Pilastro**: guide utili per decidere, poi posti particolari.
- **Hook (parole esatte)**: «Questo reel ha tre anni. Il posto esiste ancora?»
- **Valore**: chi aveva salvato un reel vecchio scopre se può ancora andarci, e a che prezzo. È il
  difetto del Salva di Instagram: i salvataggi invecchiano male e nessuno te lo dice.
- **Perché esiste solo con l'app**: l'app sa cosa è uscito nella stessa settimana degli anni
  passati (62 mesi consecutivi con almeno un reel) e registra l'esito sulla scheda o sulla traccia.
  La storia scade, la verifica resta.
- **Materiali reali**: il fotogramma del reel originale con la data di pubblicazione. Una ripresa
  nuova solo se ci tornano, mai ricostruzioni. L'esito lo scrivono Rodrigo e Betta: «aperto»,
  «chiuso» o «cambiato», con la fonte della verifica `[VERIFY: metodo, per esempio telefono o sito ufficiale]`.
- **Base dati**: l'arretrato è vecchio (254 dei 484 reel su locali senza scheda sono del 2022-2023).
  243 reel hanno un prezzo in caption: il confronto «allora / oggi» vale solo per quelli, e il
  prezzo di allora va sempre datato.
- **Effetto sulla produzione**: una traccia verificata «aperta» è una candidata a diventare
  scheda. La serie riduce l'arretrato dei 409 di un posto verificato a settimana.
- **Guardrail**:
  - Non è un verdetto «per chi è / per chi no», ma uno stato verificato: non dipende dal ritorno
    del Timbro.
  - La settimana la propone l'app, ma sceglie una persona: deny-list e contenuti Family esclusi.
  - Se il reel scelto era una collaborazione, vale la dicitura del 2026 e il contenuto conta
    nell'1 su 4.
- **CTA**: sondaggio «L'avevi salvato?» e sticker link
  `/esplora?reel=<code>&utm_medium=story&utm_campaign=esiste-ancora&utm_content=<code>`.
- **Repurpose**: storia → evidenza «Esiste ancora?» → riga nella newsletter mensile («Tre posti
  verificati questo mese») → scheda aggiornata.
- **Obiettivo di business**: fiducia e autorevolezza.
- **Metrica primaria**: risposte al sondaggio e tocchi sullo sticker. Secondaria: tracce promosse
  a scheda.

**Da aggiornare dopo l'approvazione R2**: `docs/13_Content/CONTENT_CALENDAR_H2_2026.md` (slot dei
tre formati) e `docs/MARKETING_OPERATIONS_HUB.md` (loop e regole di canale).

---

## 3. Il ponte dal reel all'app: deep link per codice reel

**Cosa deve risolvere il ponte** (fact pack §15, 1.190 reel usabili):

| Caso | Reel | Dove porta |
| --- | --- | --- |
| Reel con scheda propria | 77 con coordinate (86 in tutto) | la scheda |
| Reel su un posto che ha già una scheda | 86 | la scheda di quel posto |
| Traccia su un locale senza scheda | 484 (409 coordinate) | riquadro traccia: nome, data, «Apri su Instagram», «Salva». Oggi nessun fotogramma reale su disco |
| Etichetta generica (città, regione, paese) | 369 | la zona, mai un punto preciso |
| Senza coordinate / senza luogo | 25 + 149 | nessun posto: ripiego sugli ultimi posti o sulla guida |
| Reel pubblicati dopo il 13 ago 2026 | non nel corpus | ripiego finché non vengono registrati a mano |

Per quasi metà dei reel (543 su 1.190) il ponte non può promettere un posto. Per le 484 tracce,
senza fotogrammi estratti e visti dall'owner, il riquadro resta senza immagine: nessuna immagine è
meglio di un'immagine non vera. La copertina presa dai server di Instagram non è un'opzione
`[VERIFY: termini d'uso e scadenza degli URL]`.

| | A. Parametro su una rotta esistente | B. `/r/<code>` |
| --- | --- | --- |
| Esempio | `/esplora?reel=<code>` → `/posto/<slug>?reel=<code>` oppure la traccia | `/r/<code>` → redirect 302 verso la scheda o la traccia, con le UTM |
| File ad alto rischio | no | sì, `server.ts` (solo travellini-backend-engineer, con conferma owner) |
| Anteprima quando il link si incolla in chat | quella generica di `/esplora` `[VERIFY: meta prerenderizzati per rotta o solo lato client]` | può essere quella del reel, con il fotogramma reale |
| Reel non nell'indice | ripiego lato client | ripiego lato server, anche verso `instagram.com/reel/<code>` |
| Attribuzione per reel senza consenso analytics | solo tramite l'iscrizione (`origine` nel record) | anche conteggi lato server senza cookie `[VERIFY: privacy]` |
| Forma dell'URL | lunga, ma nessuno la digita (i codici distinguono maiuscole e minuscole) | corta; serve solo per QR stampati o un secondo schermo |
| SEO | canonical sulla rotta base, parametri non indicizzati (lo conferma il SEO strategist) | 302 e noindex; nessuna pagina nuova |
| Rischio | un refactor di `/esplora` può perdere il parametro: la spec §5 dice che è ancora costruita attorno all'articolo | una rotta in più nel file più delicato |

**Raccomandazione: A subito, con quattro regole.**

1. **Un solo resolver** (`?reel=`), letto da una tabella codice → destinazione generata in CI dal
   JSON tracciato. La tabella esclude la deny-list e non contiene plays né caption (nessun numero
   social nel codice) e si carica solo quando il parametro c'è (budget del bundle).
2. **UTM standard** più `utm_content=<code>`. Il resolver ignora i parametri che aggiunge
   Instagram `[VERIFY: quali, per esempio fbclid]`.
3. **Il codice arriva fino al modulo di iscrizione** (campo `origine`). La metrica primaria diventa
   attribuibile per reel anche senza consenso analytics, dentro il consenso newsletter già dato,
   con informativa `[VERIFY]`.
4. **Ripiego esplicito per quattro casi**: traccia, etichetta generica, reel senza luogo, reel nuovo.

**B solo se** i dati di A mostrano che contano le condivisioni in chat (dove servono anteprime per
reel) o se l'owner vuole QR stampati. Resta una decisione per travellini-backend-engineer con
conferma owner, non per R1.

---

## 4. Il loop inverso: cosa l'app restituisce a Instagram

**Dal corpus, disponibile subito, senza dati degli utenti:**

| Dato | Contenuto per Instagram | Materiale reale | Regola |
| --- | --- | --- | --- |
| Sei regioni vuote | F1 «La mappa bianca» e sondaggio | map wash `craft` e fotogrammi reali | per regione, mai per punto; «vuote sulla nostra mappa» |
| Ritorni (62 locali) | F2 «Ci siamo tornati» | fotogrammi datati | conferma owner; controllo partner; privacy della zona di casa |
| Stessa settimana negli anni | F3 «Esiste ancora?» | fotogramma e verifica | scelta umana; deny-list e Family esclusi |
| Mese di pubblicazione | storia mensile «Cosa vi abbiamo mostrato a novembre, in cinque anni» | cover reali di schede e tracce | è il mese di pubblicazione, non un consiglio di stagione. Serve anche a bilanciare le schede, sbilanciate su luglio (19 su 79) |
| Prezzi in caption (243 reel) | «Quanto costava», dentro F3 | caption originale | sempre con mese e anno; mai «costa» senza verifica |

**Dall'uso dell'app, dopo il lancio: solo dati aggregati e solo con consenso analytics:**

| Dato dell'app | Contenuto per Instagram | Regola |
| --- | --- | --- |
| Ricerche senza risultati | «La regione che cercate e che non abbiamo», che alimenta F1 | nessun numero senza fonte datata; dire che il campione è solo chi ha dato il consenso |
| Posti più salvati | carosello «I posti che avete messo da parte questo mese», con fotogrammi reali | niente classifiche per plays; nessun numero nel codice |
| Tracce più aperte | quale traccia diventa scheda per prima; storia «Questo reel del 2022 adesso ha una pagina» | decide l'owner; ogni cover la guarda una persona |
| «Avvisami» per regione | newsletter e storia quando il viaggio c'è | solo se il viaggio si fa davvero |
| Liste condivise | nessun contenuto | mai mostrare liste individuali |

Vincoli comuni: niente volti di follower, niente UGC, niente premi, niente numeri di views nel
codice, solo fotogrammi reali con provenienza.

---

## 5. Rischi di canale

1. **Il link unico in bio.** Tre cose competono per lo stesso tocco: gli sconti e l'assicurazione
   (quello che bio e caption promettono oggi; affiliazioni attive Heymondo e GetYourGuide), la
   guida in regalo e l'app. Proposta senza cambiare il link: `/guida-in-regalo` diventa la porta
   dell'app, in quest'ordine: reel di ieri, guida, sconti marcati. Due decisioni owner, nessuna
   nuova:
   - puntare la bio a `/guida-in-regalo`, oggi sospeso dal 23 luglio;
   - l'eventuale ritocco della formula in caption «L1nk in bi@ per super sc@nti…», che promette
     sconti a chi poi trova una guida.
   Loop A e B non dipendono dalla bio. `[VERIFY]` Instagram consente più link in bio: l'unica
   landing è una scelta di brand, e qui non propongo di cambiarla.
2. **Uno su quattro.** I formati che riusano reel vecchi (F2, F3, idea 10) pescano anche tra i 182
   reel con marcatore (15,3%). Regola proposta: un pezzo nuovo che contiene anche un solo segmento
   di collaborazione conta come partner e porta la dicitura del 2026; oppure le compilation
   editoriali usano solo reel non marcati. In entrambi i casi il marcatore si controlla sul testo e
   sul registro, che discordano sul 14% delle schede. Anche gli sticker verso schede partner contano
   nel rapporto. Poiché l'account dichiara di essere «IN ELENCO AGCOM», servono le regole AGCOM sul
   riuso di contenuti commerciali `[VERIFY]`.
3. **Family e deny-list.** Ogni selezione automatica (settimana, ritorni, mappa) parte dal corpus
   usabile, che esclude la deny-list, e passa da una revisione umana. Il fact pack §12 conta
   parole-spia nelle caption (nascita, salute, scuola): non sono deny-list, ma bloccano la
   selezione automatica finché una persona non ha guardato. I contenuti Family vanno solo sulle
   superfici previste dalla decisione del 24 luglio e non compaiono mai come esempio.
4. **Zona di casa.** I formati sui ritorni possono triangolare la zona di casa: mai raggio, mai
   mappa dei ritorni, finché l'owner non decide (§14).
5. **Telegram nelle caption vecchie.** Le caption contengono righe ricorrenti tipo «PS. Vuoi unirti
   ai Travellini» e «gruppo telegram» (fact pack §9). Qualsiasi testo di caption mostrato nell'app o
   riusato deve togliere quelle righe e il link offuscato, ma **tenere** le etichette di
   collaborazione. La regex del fact pack §9 toglie anche le etichette isolate: va bene per
   analizzare il lessico, non per mostrare il testo.
6. **Data di pubblicazione ≠ data della visita.** Il corpus ha solo la pubblicazione. Nei formati
   si scrive «pubblicato», non «ci siamo stati». La home (screenshot 01) mostra «ci siamo stati a
   giugno 2026» `[VERIFY: da dove viene quel mese]`.
7. **Numeri pubblici.** Ogni conteggio usato in un contenuto porta la fonte datata (dati al 14
   agosto 2026), come prevede `DECISION_PUBLIC_METRICS_SOURCE`. Plays e views non entrano nel
   codice. L'intestazione di `reels.ts` dice che la hero sceglie «il reel con più views se il
   manifest è popolato», e il tipo ha un campo `views`: popolarlo violerebbe la regola.
8. **Corpus fermo.** Tutto ciò che nasce dal corpus si ferma al 13 agosto 2026 finché ogni reel
   nuovo non viene registrato a mano. È il costo ricorrente più sottovalutato di tutti e tre i loop.
9. **Geotag.** F1 lavora per regione. L'idea 11 («A metà strada») dipende dal singolo punto: è
   marcata audace per questo.

---

## 6. Schede idea

### Idea 1 — Storia-ponte per ogni reel

- In una frase: ogni reel ha la sua storia dello stesso giorno, con uno sticker che apre la scheda o
  la traccia tramite il codice del reel, e il codice arriva fino all'iscrizione.
- Perché stupisce: la prima riga di un report che dice quale reel ha portato iscritti, non solo views.
- Dato reale su cui poggia: 163 reel portano già a una scheda (77 + 86); 939 reel geolocalizzati su
  1.016 non hanno una scheda propria (§15).
- Cosa richiede:
  - dati: la tabella codice → destinazione, generata dal JSON tracciato;
  - asset: un fotogramma reale per storia;
  - codice: il resolver `?reel=` e il campo `origine` nel modulo;
  - ore owner: una storia per reel, più la registrazione di ogni reel nuovo.
- Rischio principale: la storia scade in 24 ore; i reel nuovi non sono nel corpus.
- Regole toccate: imagery-truth | SEO-URL | privacy | bundle
- Variante: prudente
- Autovalutazione 1-5: Stupore 2 / Verità 5 / Business 4 / Costo 4 / Carico owner 3

### Idea 2 — La lista esce dal telefono

- In una frase: dopo il primo salvataggio l'app dice la verità («questa lista vive in questo
  browser») e offre due uscite, l'email o il link.
- Perché stupisce: un salvataggio fatto dentro Instagram che arriva nella casella di posta, con
  copertine vere, prezzi datati e indirizzi.
- Dato reale su cui poggia: «I miei posti» = `/preferiti`, senza account, con posti e articoli nello
  stesso array (brief). Comportamento del browser integrato `[VERIFY]`.
- Cosa richiede:
  - codice: email transazionale con la lista e casella newsletter separata;
  - ore owner: conferma della base giuridica.
- Rischio principale: se l'invio email non è attivo `[VERIFY]` l'uscita non esiste. E se la lista
  si ottiene solo iscrivendosi alla newsletter, il consenso non è più libero.
- Regole toccate: privacy | anti-SaaS
- Variante: firma
- Autovalutazione 1-5: Stupore 3 / Verità 5 / Business 5 / Costo 3 / Carico owner 5

### Idea 3 — La lista in un link, per due

- In una frase: la lista si manda come link (`/preferiti?lista=…`) a chi viene con te, che la apre
  fuori da Instagram e la aggiunge alla sua.
- Perché stupisce: Betta manda a Rodrigo la lista «ottobre» su WhatsApp e lui la apre con le
  copertine dei reel.
- Dato reale su cui poggia: il pubblico già manda i reel a qualcuno. Nel lessico: «tagga qualcuno»
  18, «weekend romantico» 15, «fuga romantica» 9, «piacerebbe provare» 26 (§9).
- Cosa richiede: codice (lista codificata nell'URL, noindex, unione di due liste). Niente ore owner.
- Rischio principale: con A l'anteprima in chat è generica. Instagram ha già raccolte condivise
  `[VERIFY]`: il vantaggio dell'app è posto, prezzo e zona, non la condivisione in sé.
- Regole toccate: SEO-URL | privacy
- Variante: firma
- Autovalutazione 1-5: Stupore 3 / Verità 5 / Business 4 / Costo 4 / Carico owner 5

### Idea 4 — Parola nei commenti, link in DM

- In una frase: «Scrivi SCHEDA nei commenti»; un'automazione risponde in DM con il link per codice
  reel.
- Perché stupisce: i commenti «SCHEDA» sotto il reel e, nel report, i link aperti da quei DM, reel
  per reel.
- Dato reale su cui poggia: mediana di 70 commenti per reel, nessuno a zero (§13); formule che
  chiedono il commento in centinaia di caption (§9).
- Cosa richiede: uno strumento (scheda di valutazione e conferma owner); codice: il resolver
  dell'idea 1; ore owner basse con lo strumento, insostenibili a mano.
- Rischio principale: policy Meta sui messaggi automatici e sull'esca di engagement `[VERIFY]`; i DM
  che finiscono nelle richieste.
- Regole toccate: privacy
- Variante: audace
- Autovalutazione 1-5: Stupore 3 / Verità 4 / Business 5 / Costo 2 / Carico owner 3

### Idea 5 — Il reel di ieri in bio

- In una frase: `/guida-in-regalo` si apre con le ultime sei copertine reali. Il tocco porta alla
  scheda e attribuisce l'arrivo a quel reel.
- Perché stupisce: una landing in bio che si apre con il reel di ieri, come se sapesse da dove arrivi.
- Dato reale su cui poggia: bio unica verso `/guida-in-regalo` (regola di canale); la bio attuale
  promette sconti e assicurazione (snapshot).
- Cosa richiede:
  - codice: la striscia sulla landing esistente;
  - asset: copertine `real-frame` viste dall'owner;
  - ore owner: un aggiornamento per ogni reel nuovo e la decisione, già aperta, sulla bio.
- Rischio principale: la bio non punta ancora lì; chi arriva cercando sconti trova una guida.
- Regole toccate: imagery-truth | brand-DNA | privacy
- Variante: firma
- Autovalutazione 1-5: Stupore 3 / Verità 5 / Business 4 / Costo 4 / Carico owner 3

### Idea 6 — La mappa bianca

- In una frase: carosello con la mappa di cinque anni di reel e sei regioni vuote; sondaggio nelle
  storie; «Avvisami» sulla pagina della regione.
- Perché stupisce: la mappa d'Italia con sei regioni bianche e, sotto, «Scegli tu la prima».
- Dato reale su cui poggia: sei regioni a zero reel; il 76,0% dei luoghi locali italiani sta nelle
  otto regioni del Nord (§7).
- Cosa richiede:
  - dati: aggregazione per regione dei soli luoghi locali;
  - asset: map wash `craft` e fotogrammi reali;
  - ore owner: approvare le slide, decidere l'impegno sul viaggio.
- Rischio principale: il sondaggio promette un viaggio; l'etichetta «Italia» accende l'Umbria se
  non viene esclusa.
- Regole toccate: imagery-truth | metriche-pubbliche | SEO-URL
- Variante: firma
- Autovalutazione 1-5: Stupore 4 / Verità 4 / Business 4 / Costo 3 / Carico owner 3

### Idea 7 — Ci siamo tornati

- In una frase: un reel che mette in fila i fotogrammi datati dello stesso posto negli anni, e la
  scheda che diventa la sua linea del tempo.
- Perché stupisce: sei fotogrammi dello stesso posto con sei date, dal 2023 al 2026, uno sotto
  l'altro nella scheda.
- Dato reale su cui poggia: 62 luoghi locali con date di pubblicazione a più di 30 giorni l'una
  dall'altra (§3).
- Cosa richiede:
  - dati: unione a mano delle etichette doppie;
  - asset: fotogrammi da ogni reel;
  - codice: un blocco «i nostri reel qui» nella scheda;
  - ore owner: conferma dei ritorni veri e controllo partner.
- Rischio principale: un «ritorno» nel dato può essere una pubblicazione in differita; i posti più
  ripetuti sono commerciali.
- Regole toccate: imagery-truth | privacy
- Variante: firma
- Autovalutazione 1-5: Stupore 4 / Verità 3 / Business 3 / Costo 3 / Carico owner 2

### Idea 8 — Esiste ancora?

- In una frase: ogni settimana una storia riprende un reel di anni fa e dice, dopo averlo
  verificato, se il posto c'è ancora. L'esito resta sulla scheda.
- Perché stupisce: la storia con il fotogramma del 2022 e sopra la scritta «Verificato: aperto,
  settembre 2026».
- Dato reale su cui poggia: 62 mesi consecutivi con almeno un reel; 254 dei 484 reel su locali senza
  scheda sono del 2022-2023 (§2, §15).
- Cosa richiede:
  - dati: una proposta settimanale automatica;
  - codice: un campo «verificato il» sulla scheda e sulla traccia `[VERIFY: non esiste oggi]`;
  - ore owner: una verifica a settimana.
- Rischio principale: il carico della verifica; un reel scelto in automatico che tocca contenuti
  Family o in deny-list, se salta la revisione umana.
- Regole toccate: imagery-truth | privacy
- Variante: firma
- Autovalutazione 1-5: Stupore 4 / Verità 5 / Business 3 / Costo 3 / Carico owner 2

### Idea 9 — Avvisami quando girate qui

- In una frase: le pagine delle regioni vuote smettono di scusarsi e raccolgono un'iscrizione con
  interesse («Avvisami quando girate in Sardegna»).
- Perché stupisce: la pagina Sardegna, vuota da sempre, che diventa una lista d'attesa.
- Dato reale su cui poggia: sei regioni a zero reel; le pagine destinazione di quelle regioni sono
  vive e indicizzabili (spec §1).
- Cosa richiede: codice (modulo con attributo regione sulla pagina esistente). Poche ore owner.
- Rischio principale: letto come promessa di viaggio; l'invio email deve essere attivo.
- Regole toccate: privacy | SEO-URL
- Variante: prudente
- Autovalutazione 1-5: Stupore 3 / Verità 5 / Business 5 / Costo 4 / Carico owner 4

### Idea 10 — Avete cercato, non abbiamo

- In una frase: dopo il lancio, le ricerche senza risultati nell'app diventano contenuto: «la
  regione che cercate e non abbiamo mai girato».
- Perché stupisce: un contenuto che nasce da ciò che il pubblico ha cercato davvero, non da un
  sondaggio.
- Dato reale su cui poggia: non esiste ancora. Nasce dall'uso dell'app, con consenso analytics e un
  evento di ricerca `[VERIFY: se la ricerca è tracciata]`.
- Cosa richiede: codice (evento di ricerca senza risultati); dati: settimane di uso; poche ore owner.
- Rischio principale: il campione è solo chi ha dato il consenso; il numero va pubblicato con fonte
  e data, o non va pubblicato.
- Regole toccate: privacy | metriche-pubbliche
- Variante: audace
- Autovalutazione 1-5: Stupore 4 / Verità 4 / Business 3 / Costo 3 / Carico owner 4

### Idea 11 — A metà strada tra voi due

- In una frase: nelle storie, «Scrivi le vostre due città»; l'app mostra i posti che abbiamo girato a
  metà strada, come elenco e non come mappa.
- Perché stupisce: una risposta del tipo «Milano e Bologna: i posti che abbiamo girato a metà
  strada», fatta per una coppia che vive in due città.
- Dato reale su cui poggia: 467 luoghi locali con coordinate, il 76,0% di quelli italiani al Nord:
  funziona al Nord e poco al Sud (§7).
- Cosa richiede:
  - codice: ricerca per corridoio tra due città, in una vista elenco;
  - ore owner: alte se le risposte sono a mano, basse se la storia rimanda allo strumento
    nell'app.
- Rischio principale: dipende dal singolo punto sulla mappa, e i geotag hanno errori documentati; le
  città degli utenti non vanno salvate.
- Regole toccate: privacy | anti-SaaS | bundle
- Variante: audace
- Autovalutazione 1-5: Stupore 5 / Verità 3 / Business 3 / Costo 2 / Carico owner 3

### Idea 12 — Il ponte corto `/r/<code>`

- In una frase: una rotta corta per reel, con redirect lato server, anteprima con il fotogramma e
  conteggi senza cookie.
- Perché stupisce: un link incollato in chat che mostra il fotogramma vero del reel.
- Dato reale su cui poggia: brief, una rotta top-level nuova richiede `server.ts`; codici di 11
  caratteri che distinguono maiuscole e minuscole.
- Cosa richiede: codice (`server.ts`, solo travellini-backend-engineer); ore owner: conferma.
- Rischio principale: modifica al file più delicato per un guadagno che A in parte copre già.
- Regole toccate: file-alto-rischio | SEO-URL | privacy
- Variante: audace
- Autovalutazione 1-5: Stupore 3 / Verità 5 / Business 3 / Costo 2 / Carico owner 4

---

## Out of scope (rispettato; da non dedurre da questo file)

- Nessun codice toccato, nessun file di `BEST` modificato, nessun file ad alto rischio.
- Niente calendario editoriale, niente caption complete, niente script oltre l'hook.
- Non propongo di cambiare il link in bio né di sostituire `/guida-in-regalo`: solo come usarla.
- Niente embed, niente autoplay, niente feed «per te», niente gamification, niente premi, niente
  volti di follower, niente Telegram, niente views nel codice.

## Open questions / decisions for the user

Nessuna decisione nuova. Dipendenze da decisioni owner già aperte o implicite nei loop:

- **Bio verso `/guida-in-regalo`** (sospeso dal 23 luglio). Serve al Loop C e all'idea 5; A e B non
  ne dipendono.
- **Strumento per le risposte in DM** (Loop B, idea 4): va aperta una scheda di valutazione e serve
  la conferma, secondo la policy degli strumenti.
- **Ritorni veri e zona di casa** (F2, idea 7; fact pack §14).
- **Impegno sul viaggio** dietro il sondaggio della mappa bianca (F1, idea 6).
- **Formula di chiusura delle caption**: promette sconti; resta così o cambia.

## Next hand-off

- Next agent: travellini-orchestrator (sintesi R2).
- Trigger: questo file esiste con i punti 1-6.
- Dopo la R2, se approvato: travellini-seo-conversion-strategist per il canonical e il noindex di
  `?reel=` e `?lista=` e per il testo di `/guida-in-regalo`; travellini-asset-curator per i
  fotogrammi delle tracce (0 cover su disco per i 897 candidati); travellini-frontend-builder per il
  resolver e il campo `origine`; travellini-backend-engineer solo se si sceglie `/r/<code>`.

## Notes

- **Incongruenze viste strada facendo**:
  - La home mostra «33 collaborazioni dichiarate», mentre il corpus ha 182 reel con marcatore; 33 è
    anche il numero di aperture «Invited» del 2026 `[VERIFY: base del numero in home]`.
  - Lo snapshot brand dice che la bio è Linktree, la regola di canale dice `/guida-in-regalo`: la
    regola c'è, lo stato no.
  - Il Marketing Hub ipotizza uno SKU «Roadtrip in Puglia», e la Puglia è a zero reel: un rischio di
    credibilità da portare a travellini-growth-revenue-operator.
- **Idee scartate**:
  - Classifica dei reel più visti: servono numeri di views nel codice.
  - QR dentro il reel: il reel si guarda sullo stesso telefono.
  - Timbri raccolti sul posto: è gamification.
  - Aprire forzatamente il browser di sistema con trucchi `intent://`: fragile e ostile.
  - Mostrare le liste degli utenti: privacy.
  - Copertine prese dai server di Instagram per le tracce: imagery truth e termini d'uso.
- **Miglioramento operativo proposto**, da registrare in `docs/` se la R2 lo conferma: prima di
  progettare un loop social, elencare in una riga dove il link è cliccabile (bio, sticker, DM) e dove
  vive il salvataggio se il browser integrato lo perde. Queste due righe avrebbero escluso subito
  metà delle idee deboli.
