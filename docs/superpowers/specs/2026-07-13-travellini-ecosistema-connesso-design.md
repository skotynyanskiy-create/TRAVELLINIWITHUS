---
type: plan
area: website
status: active
priority: p0
owner: Rodrigo & Betta
created: 2026-07-13
tags:
  - website
  - instagram
  - conversion
  - content-system
  - brand
---

# Travelliniwithus — Ecosistema editoriale proprietario connesso

## Stato della decisione

Questa specifica formalizza la direzione approvata nella sessione del 13 luglio 2026. Rodrigo ha confermato l'approvazione finale il 13 luglio 2026. La homepage
`Atlante Vivo` esistente resta la base. Il progetto non è un redesign totale:
è un intervento coordinato su architettura informativa,
contenuti, conversioni, dati, navigazione e attivazione del dominio pubblico.

Priorità del sistema:

1. costruire audience proprietaria e autorevolezza editoriale;
2. convertire partner qualificati attraverso prove reali;
3. monetizzare in modo contestuale senza trasformare il sito in un Linktree.

## Problema da risolvere

Il profilo Instagram ha 171.847 follower osservabili pubblicamente al momento
dell'audit e produce contenuti con forti differenze di performance in base
all'aderenza al posizionamento. Il sito locale contiene già discovery, mappa,
newsletter, collaborazioni, media kit, risorse, shop e club, ma il dominio
pubblico mostra ancora una pagina di costruzione e il link Instagram porta
principalmente a Linktree e affiliate esterne.

Il problema principale non è la mancanza di pagine. È l'assenza di una catena
unica e attiva:

```text
contenuto social
→ destinazione proprietaria specifica
→ informazione utile e verificata
→ azione successiva coerente
→ relazione, lead o ricavo misurabile
```

## Principi non negoziabili

- `Atlante Vivo` e il design system esistente restano la base visiva.
- Rodrigo e Betta devono essere riconoscibili come persone, non come logo o
  catalogo di offerte.
- Ogni pagina pubblica deve avere un compito principale e una CTA primaria.
- I contenuti reali hanno precedenza sulla simmetria visiva.
- Placeholder, contatori non verificati e offerte non attive non appaiono come
  contenuti reali.
- Le affiliate sono strumenti contestuali, non la gerarchia del sito.
- Shop e Club restano fuori dalla navigazione primaria finché non esiste
  un'offerta consegnabile.
- Nessun numero privato, case study, partner o promessa commerciale viene
  pubblicato senza approvazione R&B.
- Le immagini pubbliche del sito sono fotografie reali autorizzate.
- Ogni comunicazione commerciale deve avere disclosure chiara e collegata al
  soggetto interessato.

## Architettura dell'ecosistema

### Ingresso social

`/vieni-con-noi` è una landing standalone riservata a Instagram e TikTok. Non
è una voce della navigazione interna e non duplica il menu del sito.

Percorsi disponibili:

- `Scopri`: contenuti, destinazioni e luoghi;
- `Organizza`: mappa, guide, itinerari e risorse;
- `Collabora`: proof, media kit e richiesta partner;
- `Ricevi la guida`: opt-in email con consegna reale del lead magnet.

URL canonici:

```text
/vieni-con-noi?utm_source=instagram&utm_medium=bio&utm_campaign=bio_hub
/vieni-con-noi?utm_source=tiktok&utm_medium=bio&utm_campaign=bio_hub
```

### Navigazione interna

Navigazione primaria desktop e mobile:

1. `Esplora`
2. `Mappa`
3. `Organizza`
4. `Chi siamo`
5. `Collabora`
6. CTA `Ricevi la guida`

Utility separate:

- ricerca;
- preferiti, solo quando disponibili;
- accesso personale, solo quando fornisce un beneficio reale.

`Esplora` raggruppa destinazioni, racconti, articoli, guide e luoghi. `Organizza`
raggruppa itinerari, strumenti, risorse consigliate e, quando saranno pronti,
prodotti e Club.

In questa architettura `Organizza` è un raggruppamento di navigazione, non una
nuova rotta `/organizza`: le destinazioni restano le rotte canoniche già
esistenti (`/itinerari`, `/strumenti` e `/risorse`).

Shop e Club non compaiono nella navigazione primaria o nel footer come prodotti
attivi finché non superano il gate di disponibilità.

## Ruolo delle pagine

| Rotta               | Ruolo principale                           | CTA primaria                      |
| ------------------- | ------------------------------------------ | --------------------------------- |
| `/`                 | Presentare il brand e iniziare la scoperta | Esplora i luoghi                  |
| `/vieni-con-noi`    | Smistare il traffico social                | Percorso scelto dall'utente       |
| `/esplora`          | Archivio unico filtrabile                  | Apri un contenuto                 |
| `/mappa`            | Esplorazione geografica                    | Apri luogo o percorso             |
| `/destinazione/...` | Hub territoriale                           | Esplora i contenuti reali         |
| `/posto/:slug`      | Scheda pratica del singolo luogo           | Salva o continua la scoperta      |
| `/articolo/:slug`   | Approfondimento editoriale                 | Contenuto o risorsa correlata     |
| `/guide/:slug`      | Guida strutturata                          | Usa o ottieni la guida            |
| `/itinerari`        | Pianificazione                             | Apri un itinerario                |
| `/strumenti`        | Utility di viaggio                         | Usa lo strumento                  |
| `/risorse`          | Affiliate e strumenti selezionati          | Apri una risorsa contestuale      |
| `/chi-siamo`        | Identità e metodo editoriale               | Scopri il metodo o collabora      |
| `/collaborazioni`   | Offerta B2B                                | Verifica proof e media kit        |
| `/media-kit`        | Dati e prove approvate                     | Invia richiesta qualificata       |
| `/press`            | Autorevolezza esterna                      | Contatta o apri il media kit      |
| `/lead-magnet`      | Acquisizione email e consegna              | Ricevi la guida                   |
| `/shop`             | Prodotti consegnabili                      | Acquista o lista d'attesa reale   |
| `/club`             | Relazione ricorrente                       | Iscrizione o lista d'attesa reale |

## Homepage `Atlante Vivo`

### Elementi conservati

- hero e promessa `Posti particolari che valgono davvero`;
- tono `andiamo, proviamo, solo dopo consigliamo`;
- palette sabbia, terracotta e inchiostro;
- tipografia Fraunces/Inter;
- filtri Italia, Europa e Mondo;
- `Sfoglia per tipo`;
- pezzo forte editoriale;
- sezione Reel;
- metodo editoriale;
- aree geografiche;
- newsletter;
- CTA finale.

### Modifiche

#### Hero

- CTA primaria: `Esplora i luoghi` → `/esplora`;
- CTA secondaria: `Apri la mappa` → `/mappa`;
- il collegamento ai Reel viene rimosso dal hero perché la sezione Reel è già
  presente nella pagina;
- i filtri continuano a portare a query canoniche di `/esplora`.

#### Pezzo forte

La CTA principale apre `/posto/:slug` o `/articolo/:slug`. Il video resta una
azione secondaria. Un contenuto privo di destinazione proprietaria completa non
viene promosso come pezzo forte.

#### Reel

Ogni card distingue tre azioni:

1. aprire la scheda proprietaria;
2. riprodurre il video;
3. aprire il post originale su Instagram/TikTok.

Le card mostrano località, tipologia e disclosure. La sezione non importa
automaticamente contenuti non curati o placeholder.

#### Metodo e persone

La sezione conserva copy e gerarchia attuali e aggiunge una fotografia reale di
Rodrigo e Betta. I criteri dichiarati devono essere verificabili: esperienza,
costi, pubblico adatto, limiti e natura della collaborazione.

La frase assoluta `Disclosure pubblicitaria sempre dichiarata` viene sostituita
con una formulazione verificabile finché non è concluso l'audit storico delle
pubblicazioni.

#### Aree geografiche

Una card territoriale appare solo quando esiste almeno un contenuto reale
pubblicato. Le aree senza contenuti vengono nascoste; non vengono mostrate card
vuote con la sola funzione di mantenere la simmetria.

#### Newsletter

La promessa generica diventa il lead magnet reale:

`10 posti italiani che sembrano inventati`.

La sezione contiene una breve anteprima, un solo campo email, consenso chiaro,
consegna verificabile e tracciamento di signup e download. Se il contenuto non è
approvato e disponibile, la CTA torna a una newsletter editoriale senza
promettere il PDF.

#### CTA finale

- primaria: `Apri Esplora`;
- secondaria: `Collabora con noi`.

## Modello unico dei contenuti

`ContentItem` resta la fonte unica per i luoghi derivati da Instagram e TikTok.
L'ID è uno slug stabile, per esempio `better-sushi-ravenna`.

Un singolo item può alimentare:

- `/posto/:slug`;
- card in `/esplora`;
- marker in `/mappa`;
- hub territoriale;
- contenuto correlato in un articolo;
- homepage quando `featured`;
- deal contestuale;
- proof commerciale quando approvata.

### Campi obbligatori per la pubblicazione

- ID/slug stabile;
- piattaforma sorgente e permalink;
- tipo di media;
- cover reale autorizzata;
- hook, titolo e descrizione curati;
- luogo e paese;
- tassonomia canonica;
- disclosure partnership;
- stato non-placeholder.

### Campi condizionali

- coordinate per apparire in mappa;
- prezzo solo se verificato e datato;
- recensione solo se compilata da R&B;
- deal solo se attivo, pertinente e con termini;
- partner solo se pubblicabile;
- proof solo con autorizzazione e fonte.

### Ciclo editoriale

```text
Reel pubblicato
→ registrazione catalogo
→ arricchimento editoriale
→ fact-check e disclosure
→ scheda luogo
→ mappa e destinazione
→ articolo/itinerario quando utile
→ newsletter e repurpose
→ case study quando approvato
```

L'inserimento manuale resta supportato senza chiavi API. Nessun adapter social
può pubblicare direttamente contenuti non verificati.

## Conversioni

### Ispirazione

```text
Reel → scheda luogo → contenuti correlati → salva o iscriviti
```

### Organizzazione

```text
Google/Mappa → luogo o articolo → itinerario/risorsa → affiliate contestuale
```

### Business

```text
Instagram/Google → Collaborazioni → proof → Media kit → richiesta qualificata
```

### Audience proprietaria

```text
Homepage/Articolo → guida gratuita → email → newsletter → prodotto futuro
```

## Tracking

Convenzione UTM:

- `utm_source`: `instagram`, `tiktok`, `newsletter`, `partner`;
- `utm_medium`: `bio`, `social`, `email`, `referral`;
- `utm_campaign`: campagna o contenuto;
- `utm_content`: CTA e posizione.

Eventi minimi:

- `bio_hub_view`;
- `bio_hub_path_click`;
- `content_item_view`;
- `content_item_to_map`;
- `content_item_to_related`;
- `reel_play`;
- `reel_to_owned_content`;
- `newsletter_signup`;
- `lead_magnet_download`;
- `affiliate_outbound_click`;
- `media_kit_view`;
- `media_kit_submit`;
- `partner_lead_submit`.

Ogni evento usa parametri consistenti: `source`, `content_id`, `cta_id`,
`partner_kind` e `route` quando applicabili.

## Affiliate e monetizzazione

- Le affiliate compaiono dopo l'informazione editoriale, mai come sostituto.
- Ogni link passa dal modulo condiviso di tracking affiliate.
- Le offerte scadute o prive di termini vengono nascoste.
- Il sito distingue link editoriale, referral, affiliate e ADV.
- Il funnel principale privilegia hospitality, ristorazione, destinazioni,
  esperienze, assicurazione e tecnologia usata durante il viaggio.
- Prodotti estranei al viaggio o family vengono spostati nella superficie
  pertinente o rimossi dal percorso principale.

## TravelliniFamily

`Travelliniwithus` resta il brand travel principale. `TravelliniFamily` è un
sub-brand dedicato a genitorialità, vita quotidiana e viaggio con bambini.

Regole:

- cross-post soltanto se il contenuto è pertinente a entrambi;
- prodotti baby non entrano nelle risorse travel principali;
- CTA e landing family sono separate;
- dati e audience non vengono sommati senza dichiararlo;
- il sito principale può ospitare una sezione family solo dopo l'esistenza di
  contenuti sufficienti e di una decisione editoriale R&B.

## Dati e approvazioni

### Implementabile senza dati privati

- architettura e navigazione;
- ruoli delle pagine;
- eliminazione di placeholder;
- collegamenti interni;
- tracking e convenzioni UTM;
- responsive, accessibilità e performance;
- stato di disponibilità Shop/Club;
- modello unico dei contenuti.

### Richiede approvazione R&B

- follower e metriche ufficiali con data;
- reach, view e audience Insights;
- Top 20 contenuti e relativi periodi;
- partner e case study pubblicabili;
- programmi affiliate attivi, codici e scadenze;
- dieci luoghi e fotografie del lead magnet;
- diritti d'uso delle immagini;
- nome pubblico definitivo;
- contatti e destinatari dei lead;
- formulazione dello stato AGCOM;
- ruolo di TravelliniFamily;
- disponibilità, prezzo e supporto di Shop/Club.

### Owner-only

- deploy in produzione;
- DNS e hosting;
- modifica della bio Instagram/TikTok;
- attivazione di chiavi o integrazioni cloud;
- pubblicazione di dati privati;
- invio di comunicazioni commerciali;
- attivazione di pagamenti.

## Error handling e stati degradati

- Firestore o API non disponibili: mostrare contenuti statici reali, non dati
  inventati.
- Newsletter non disponibile: messaggio chiaro e fallback locale solo in
  sviluppo; in produzione il fallback non può simulare una consegna riuscita.
- Immagine mancante: fallback editoriale dichiarato e alt coerente.
- Deal scaduto: rimuovere CTA e mostrare, se utile, soltanto il contenuto.
- Coordinate mancanti: non mostrare il marker; la scheda resta disponibile.
- Contenuto incompleto: non pubblicare la rotta o indicizzarla.
- Prodotto non consegnabile: lista d'attesa esplicita, nessun checkout.
- Metriche non approvate: omettere il numero, non usare stime.

## Accessibilità e qualità UX

- navigazione completa da tastiera;
- focus visibile;
- contrasto WCAG AA;
- alt text italiano descrittivo;
- disclosure leggibile anche senza audio;
- target touch almeno 44×44 px;
- nessun overflow orizzontale a 320 px;
- reduced motion rispettato;
- un solo `h1` per pagina;
- CTA distinguibili per intenzione;
- nessun leetspeak come `L1nk`, `B10` o `sc@nti` nel sito.

## SEO e indicizzazione

- canonical per ogni pagina pubblica;
- schema `Person` per Rodrigo e Betta;
- schema `Article`, `Place`, `BreadcrumbList` e `Organization` dove corretto;
- sitemap composta solo da contenuti pubblicati;
- pagine demo, lab, admin e contenuti incompleti in `noindex`;
- collegamenti interni tra luogo, destinazione, articolo, mappa e guida;
- titolo e description italiani, specifici e non duplicati;
- redirect conservativi per le rotte legacy.

## Verifica

Gate statico:

```text
npm run typecheck
npm run lint
npm run test
npm run build
npm run audit:ui
npm run audit:firebase
npm run audit:stripe
npm run audit:agents
npm run audit:obsidian
```

Gate browser:

- homepage e `/vieni-con-noi`;
- Esplora, Mappa e i percorsi raccolti sotto `Organizza`;
- una destinazione, un luogo e un articolo reali;
- Collaborazioni e Media kit;
- newsletter e lead magnet;
- matrice 320/375/768/1024/1440;
- tastiera e focus;
- console senza errori applicativi;
- CTA e UTM verificati.

Gate release:

- nessun contenuto demo non dichiarato;
- dominio non più in costruzione;
- primo link bio sul dominio proprietario;
- media kit e sito con gli stessi numeri approvati;
- almeno dieci contenuti reali;
- almeno un case study approvato;
- lead magnet reale e consegna verificata;
- rollback e backup documentati;
- approvazione owner prima del deploy.

## Ordine di implementazione

1. Baseline e inventario delle modifiche esistenti.
2. Navigazione, disponibilità e gerarchia delle CTA.
3. Consolidamento del modello contenuti e collegamenti Reel→scheda.
4. Homepage Atlante Vivo.
5. `/vieni-con-noi` e lead magnet.
6. Esplora, Mappa, destinazioni e pagine luogo.
7. Organizza, risorse e affiliate.
8. Chi siamo, Collaborazioni, Media kit e Press.
9. Tracking, SEO, accessibilità e responsive.
10. Inserimento dei dati approvati.
11. Predeploy e verifica browser.
12. Deploy e aggiornamento bio, entrambi owner-only.

## Non-obiettivi

- rifare da zero il design system;
- introdurre un nuovo framework;
- aggiungere nuove affiliate per riempire il sito;
- aprire checkout senza prodotto;
- creare immagini AI per le superfici pubbliche;
- automatizzare la pubblicazione social senza revisione;
- inventare numeri, recensioni, prezzi o case study;
- modificare `server.ts`, `firestore.rules` o `src/config/admin.ts` senza
  conferma owner e coinvolgimento del ruolo backend previsto dal progetto.

## Criteri di successo

Il lavoro è riuscito quando:

- ogni ingresso principale conduce a una destinazione proprietaria utile;
- nessuna CTA primaria crea un percorso circolare;
- i Reel promossi hanno una scheda proprietaria completa;
- un utente può passare da ispirazione a mappa o organizzazione senza tornare
  a Instagram;
- un partner trova proof, media kit e modulo senza attraversare il funnel
  consumer;
- le offerte commerciali sono riconoscibili e contestuali;
- i dati pubblici sono approvati, datati e coerenti tra sito e media kit;
- il dominio pubblico serve l'applicazione verificata;
- gli eventi permettono di misurare visita, azione e conversione.
