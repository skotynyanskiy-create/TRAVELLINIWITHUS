---
type: project
area: marketing
status: archived
priority: p0
owner: marketing
date: 2026-06-07
related:
  - '[[50_Scratch/AUDIT_PUBLIC_FOOTPRINT_TRAVELLINIWITHUS_2026-06-07]]'
  - '[[10_Projects/PROJECT_TRAVELLINIWITHUS_SITE]]'
  - '[[MARKETING_OPERATIONS_HUB]]'
  - '[[12_Partnerships/PARTNER_PIPELINE_TRAVELLINIWITHUS]]'
tags:
  - project
  - marketing
  - influencer
  - public-footprint
  - growth
superseded_by: PROJECT_BACKLOG_UNICO_2026-07-31
---

> **Superato il 2026-07-31.** Questo piano non è più "cosa fare".
> Il lavoro ancora vivo è confluito in [[10_Projects/PROJECT_BACKLOG_UNICO_2026-07-31]]; la direzione è in `PROJECT_BACKLOG_UNICO_2026-07-31`.
> Resta leggibile come storico — non aggiungerci voci nuove.

# Ultra Piano Miglioramento — Public Footprint Travelliniwithus

## Obiettivo

Trasformare Travelliniwithus da presenza social forte ma dispersa a ecosistema proprietario credibile, tracciabile e monetizzabile.

Il piano non parte da "fare un sito piu bello". Parte da una priorita piu concreta:

> Instagram e TikTok devono portare attenzione. Il sito deve trasformarla in fiducia, email, articoli, affiliate click qualificati e richieste partner.

## North Star

Promessa centrale:

> Posti particolari che valgono davvero.

Frase ponte:

> Travelliniwithus trasforma il "wow, dove si trova?" in "ecco se ti merita davvero".

Questa frase deve guidare home, bio link, media kit, collaborazioni, newsletter, articoli e outreach partner.

## Diagnosi

### Cosa funziona

- Rodrigo & Betta sono gia riconoscibili come coppia travel creator.
- La nicchia pubblica e chiara: mete fantastiche, luoghi curiosi, locali insoliti, esperienze scenografiche.
- Esistono segnali B2B reali: Castelli del Ducato / Emilia-Fantastica, menzioni editoriali, Linktree monetizzato.
- Le affiliate principali sono coerenti con il viaggio: GetYourGuide, Heymondo, parcheggi, gear, parchi/esperienze.
- Il repo contiene gia un impianto sito/marketing piu maturo del live pubblico.

### Cosa blocca

- Il dominio pubblico `travelliniwithus.it` comunica ancora "SITO IN COSTRUZIONE".
- Linktree e il vero hub attivo, ma comunica prima sconti e poi identita.
- Numeri, handle e profili secondari non sono ancora uniformati.
- Le menzioni terze non sono ancora trasformate in case study o prova commerciale.
- I dati reali da Insights non sono ancora integrati nel media kit.
- Affiliate e codici sconto devono avere disclosure piu esplicite.

## Regola di lavoro

Ogni intervento deve servire almeno uno di questi risultati:

- piu fiducia
- piu dati proprietari
- piu conversione qualificata
- piu prova B2B
- meno dispersione pubblica

Se un task non serve uno di questi cinque punti, non e prioritario.

## Target 90 Giorni

Entro 90 giorni l'ecosistema deve avere:

- sito pubblico attivo come hub principale;
- link in bio primario su landing proprietaria;
- numeri ufficiali e datati in home/media kit/PDF/email;
- 10 contenuti reali trasformati in pagine o schede editoriali;
- 1 case study B2B reale documentato;
- newsletter/lead magnet funzionante;
- media kit pubblico credibile;
- affiliate contestualizzate in risorse editoriali;
- partner pipeline con almeno 5 target reali e 5 outreach inviati.

## KPI

Non inventare baseline. Misurare prima, poi fissare obiettivi.

### KPI da attivare subito

| KPI                                       | Fonte                            | Perche conta                           |
| ----------------------------------------- | -------------------------------- | -------------------------------------- |
| Click da IG bio al sito                   | UTM + GA4                        | misura spostamento da Linktree al sito |
| Opt-in newsletter / lead magnet           | Brevo + Firestore/local fallback | misura owned audience                  |
| Click affiliate contestuali               | UTM/outbound events              | misura monetizzazione non invasiva     |
| Lead media kit                            | form `/media-kit` + Firestore    | misura interesse B2B                   |
| Download / richiesta media kit            | evento sito                      | misura qualita pagina business         |
| Risposte partner                          | note pipeline                    | misura efficacia outreach              |
| Sessioni su contenuti "posti particolari" | GA4/Search Console               | misura SEO/editoriale                  |

### KPI da chiedere a R&B

- reach media ultimi 90 giorni;
- view top 20 reel;
- save-rate top 20 reel;
- share-rate top 20 reel;
- retention 3s / completamento reel;
- click link in bio;
- richieste collaborazione ricevute negli ultimi 12 mesi;
- brand deal o progetti territoriali documentabili.

## Piano Sprint

## Sprint 0 — Verita e controllo pubblico

Durata: 48-72 ore.

Obiettivo: togliere i segnali pubblici piu dannosi e fissare le fonti di verita.

### Task

- Verificare dominio `.it`: cosa vede un utente reale oggi su root, shop, media kit, link bio.
- Decidere se pubblicare subito la nuova V1 o una landing ponte minima.
- Verificare handle TikTok ufficiale e correggere ogni divergenza (`travelliniwithus` vs `travellini.withus`).
- Definire numeri ufficiali pubblicabili:
  - follower IG;
  - follower TikTok;
  - community totale;
  - data rilevazione;
  - eventuale engagement solo se verificato.
- Fare inventario Linktree:
  - cosa tenere;
  - cosa portare sul sito;
  - cosa rimuovere o declassare.
- Scrivere nota "fonti metriche ufficiali" in `docs/`.

### Output

- Fonte numeri unica.
- Lista link ufficiali.
- Decisione su root pubblica.
- Checklist correzioni handle.

### Owner

- Dev/marketing: verifica tecnica e documentazione.
- R&B: conferma numeri e handle.

## Sprint 1 — Hub proprietario

Durata: settimana 1.

Obiettivo: il sito deve diventare il primo link utile, non un progetto parallelo.

### Task sito

- Pubblicare homepage o landing ponte.
- Rendere `/vieni-con-noi` il primo link in bio:
  - `?utm_source=ig_bio&utm_medium=social&utm_campaign=bio_hub`
  - variante TikTok: `?utm_source=tt_bio&utm_medium=social&utm_campaign=bio_hub`
- Inserire in landing:
  - identita breve Rodrigo & Betta;
  - 3 percorsi: posti particolari, risorse viaggio, collabora con noi;
  - CTA newsletter/lead magnet;
  - CTA media kit;
  - affiliate solo in basso o contestualizzate.
- Allineare Navbar/Footer/social link.
- Eliminare o noindicizzare pagine pubbliche non pronte.

### Task marketing

- Aggiornare bio Instagram/TikTok con nuovo link proprietario.
- Ridurre Linktree a fallback o archivio secondario.
- Preparare 3 messaggi story per annunciare il nuovo hub.

### Output

- Link in bio proprietario.
- Primo tracking UTM.
- Landing funzionante.
- Linktree non piu centro dell'ecosistema.

## Sprint 2 — Trust cleanup

Durata: settimana 2.

Obiettivo: nessun numero, immagine, contenuto o promessa deve sembrare finto o non verificabile.

### Task

- Rimuovere o sostituire ogni metrica non documentata.
- Uniformare numeri tra:
  - homepage;
  - media kit;
  - PDF media kit;
  - footer/social CTA;
  - email automatiche;
  - `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`.
- Verificare immagini pubbliche:
  - foto reali R&B;
  - luoghi reali;
  - asset AI dichiarati solo come illustrazioni se restano.
- Sistemare contenuti demo o preview:
  - noindex se non pubblicabili;
  - disclaimer se sono anteprime;
  - rimozione da sitemap se non reali.
- Aggiungere disclosure affiliate in pagine risorse e link commerciali.

### Output

- Sito piu affidabile.
- Rischio reputazionale ridotto.
- Base pronta per media kit.

## Sprint 3 — Content proof library

Durata: settimane 2-4.

Obiettivo: trasformare i migliori contenuti social in patrimonio proprietario.

### Metodo

R&B fornisce top 20 post/reel. Per ciascuno:

- URL contenuto;
- luogo/brand/esperienza;
- data;
- se era collaborazione, invito, affiliate o organico;
- metriche principali;
- asset autorizzati;
- note pratiche verificate.

### Output editoriale minimo

Creare 10 schede o articoli brevi:

- nome luogo;
- perche e particolare;
- per chi vale;
- cosa sapere prima;
- costo/fasce prezzo se disponibili;
- link utile;
- disclosure se commerciale;
- CTA coerente.

### Tassonomia consigliata

- Locali insoliti
- Esperienze scenografiche
- Hotel con carattere
- Parchi e mondi immersivi
- Weekend particolari
- Mete wow fuori Italia
- Travel tools provati

### Regola qualità

Ogni contenuto deve essere utile anche senza vedere il reel. Il sito non deve limitarsi a incorporare Instagram.

## Sprint 4 — Media kit e B2B proof

Durata: settimane 3-5.

Obiettivo: rendere credibile il lato collaborazioni.

### Task

- Creare sezione "Proof" su `/media-kit`:
  - progetto Emilia-Fantastica / Castelli del Ducato;
  - menzioni editoriali pubbliche;
  - categorie partner gia attive;
  - numeri ufficiali datati.
- Preparare 1 case study:
  - contesto;
  - obiettivo;
  - contenuti prodotti;
  - risultati solo se verificati;
  - cosa puo replicare un partner.
- Separare bene:
  - collaborazioni territoriali;
  - affiliate;
  - inviti/esperienze;
  - earned media.
- Aggiornare PDF media kit.
- Creare form lead business con campi essenziali:
  - nome;
  - brand/ente;
  - email;
  - tipo collaborazione;
  - periodo;
  - budget indicativo opzionale;
  - messaggio.

### Output

- Media kit non generico.
- Proof reale.
- Funnel B2B tracciabile.

## Sprint 5 — Owned audience

Durata: settimane 4-6.

Obiettivo: non dipendere solo da Instagram.

### Task

- Attivare Brevo/Resend in produzione.
- Rendere reale il lead magnet.
- Creare welcome email minima:
  - grazie;
  - link risorsa;
  - 3 contenuti consigliati;
  - invito a rispondere con prossima meta.
- Segmentare iscritti:
  - viaggiatori;
  - partner/business;
  - shop/waitlist.
- Creare form newsletter coerente su:
  - home;
  - `/vieni-con-noi`;
  - articoli;
  - media kit se business.

### Output

- Primo asset proprietario misurabile.
- Meno dipendenza da algoritmo social.

## Sprint 6 — Affiliate editoriali

Durata: settimane 5-7.

Obiettivo: monetizzare senza sembrare pagina coupon.

### Task

- Trasformare affiliate in risorse editoriali:
  - assicurazione viaggio;
  - escursioni;
  - parcheggi;
  - gear video/foto;
  - parchi/esperienze.
- Per ogni risorsa:
  - quando serve;
  - quando non serve;
  - per chi e utile;
  - codice/link;
  - disclosure visibile.
- Aggiungere eventi outbound.
- Rimuovere o declassare partnership fuori focus se indeboliscono il travel positioning.

### Output

- Pagina risorse credibile.
- Click piu qualificati.
- Meno effetto "coupon wall".

## Sprint 7 — SEO discovery

Durata: settimane 6-10.

Obiettivo: iniziare a posizionare il sito su ricerche coerenti con la nicchia.

### Cluster SEO prioritari

- `locali insoliti + citta/regione`
- `posti particolari + regione`
- `hotel particolari + regione`
- `esperienze particolari + Italia`
- `cosa fare + luogo + coppia`
- `parchi/esperienze immersive + Italia`

### Task

- Creare 3 pillar reali:
  - "Posti particolari in Italia da salvare"
  - "Locali insoliti da provare almeno una volta"
  - "Weekend particolari per coppie"
- Collegare ogni pillar alle 10 schede reali.
- Aggiungere schema.org quando appropriato:
  - Article;
  - Place;
  - FAQPage;
  - Person/Organization;
  - BreadcrumbList.
- Aggiornare sitemap solo con contenuti reali.
- Collegare Search Console.

### Output

- Base SEO coerente con i contenuti social.
- Maggiore utilita editoriale.

## Sprint 8 — Partner pipeline

Durata: settimane 8-12.

Obiettivo: convertire il footprint pubblico in collaborazioni.

### Target

5 proposte inviate entro 90 giorni:

- 1 DMO/territorio;
- 1 parco/esperienza immersiva;
- 1 hotel con carattere;
- 1 travel service;
- 1 brand gear o servizio utile.

### Workflow

Per ogni partner:

- creare nota in `docs/12_Partnerships/`;
- salvare fonte contatto;
- scrivere perche e coerente;
- inviare outreach personalizzato;
- registrare esito;
- fare follow-up a 7 e 21 giorni.

### Regola

Non inviare outreach generico. Ogni email deve citare un dettaglio specifico del partner e proporre un output concreto.

## Roadmap 12 Settimane

| Settimana | Focus                        | Output                                        |
| --------- | ---------------------------- | --------------------------------------------- |
| 1         | Sprint 0 + Sprint 1          | dominio/link bio/hub proprietario             |
| 2         | Trust cleanup                | numeri, handle, pagine non pronte, disclosure |
| 3         | Top 20 contenuti social      | inventario contenuti e metriche               |
| 4         | Prime 5 schede reali         | content proof library avviata                 |
| 5         | Media kit + case study       | B2B proof pubblicabile                        |
| 6         | Newsletter/lead magnet       | owned audience live                           |
| 7         | Risorse affiliate editoriali | monetizzazione piu pulita                     |
| 8         | Altre 5 schede reali         | 10 contenuti proprietari                      |
| 9         | Primo pillar SEO             | contenuto organico strutturato                |
| 10        | Secondo/terzo pillar         | link interni e sitemap                        |
| 11        | Partner shortlist            | 5 target pronti                               |
| 12        | Outreach                     | 5 proposte inviate                            |

## Backlog P0

- [x] Inserire handle TikTok usato dal sito in config (`@travellini.withus`).
- [ ] Confermare handle TikTok corretto con R&B.
- [ ] Confermare numeri ufficiali pubblicabili.
- [ ] Pubblicare homepage/landing ponte al posto di "SITO IN COSTRUZIONE".
- [x] Preparare bio link su dominio proprietario in config e landing.
- [ ] Spostare bio link live su Instagram/TikTok.
- [ ] Aggiornare Linktree come fallback, non hub principale.
- [x] Uniformare social link principali in sito, email e docs.
- [x] Mettere disclosure affiliate su risorse e link commerciali.
- [x] Creare proof note su Castelli del Ducato / Emilia-Fantastica.

## Backlog P1

- [x] Creare scaffold Top 20 contenuti social con metriche.
- [ ] Compilare Top 20 contenuti social con metriche R&B.
- [ ] 10 schede luogo/esperienza reali.
- [x] Media kit aggiornato con fonte metriche e proof pubbliche.
- [ ] Media kit aggiornato con dati ufficiali R&B.
- [ ] Lead magnet reale e welcome email.
- [x] Event tracking outbound affiliate/editoriale separato.
- [ ] Partner pipeline con 5 target nominativi.
- [ ] LinkedIn aggiornato come profilo B2B.
- [ ] Blog/YouTube legacy classificati: archivio o rilancio.

## Backlog P2

- [ ] Pinterest board per contenuti evergreen.
- [ ] Pillar SEO "posti particolari".
- [ ] Pillar SEO "locali insoliti".
- [ ] Pillar SEO "weekend particolari per coppie".
- [ ] Template ricorrente per schede luogo.
- [ ] Sistema mensile di report marketing.

## Cosa non fare ora

- Non lanciare Club prima di avere audience owned e contenuti reali.
- Non aprire shop checkout prima di avere prodotto consegnabile.
- Non aggiungere altre affiliate solo per riempire.
- Non pubblicare metriche non datate.
- Non usare loghi partner senza autorizzazione.
- Non trasformare il sito in una replica di Linktree.
- Non fare nuove pagine se prima non si risolve la root pubblica.

## Dati bloccanti da chiedere a R&B

Messaggio breve consigliato:

```text
Ci servono questi dati per chiudere sito e media kit senza numeri inventati:

1. screenshot/export Meta Insights ultimi 90 giorni;
2. screenshot/export TikTok Analytics ultimi 90 giorni;
3. lista dei 20 reel/post migliori con view, salvataggi, condivisioni e reach;
4. conferma handle TikTok ufficiale;
5. numeri follower ufficiali da pubblicare con data;
6. elenco collaborazioni/affiliate attive;
7. materiali e risultati autorizzati del progetto Emilia/Castelli;
8. foto reali autorizzate per sito e media kit.
```

## Implementazione repo — 2026-06-07

Completato:

- aggiunti `BIO_LINKS`, `BRAND_STATS_SOURCE` e `PUBLIC_PROOF_SIGNALS` in `src/config/site.ts`;
- disattivato counter newsletter pubblico finche non esiste dato Brevo/Firestore verificato;
- ampliata `/vieni-con-noi` come hub proprietario per IG/TikTok;
- aggiunte proof pubbliche e fonte numeri su `/media-kit`, `/collaborazioni` e `/press`;
- corretti tracking e `rel` dei link in `/risorse`;
- uniformata email welcome ai dati social centralizzati;
- create note:
  - [[20_Decisions/DECISION_PUBLIC_METRICS_SOURCE_TRAVELLINIWITHUS_2026-06-07]]
  - [[13_Content/CONTENT_PROOF_LIBRARY_TRAVELLINIWITHUS]]
  - [[12_Partnerships/CASE_STUDY_EMILIA_FANTASTICA_CASTELLI_DUCATO]]

Rimangono bloccati da dati o azioni owner:

- aggiornamento bio social live;
- conferma numeri ufficiali;
- top 20 contenuti social con metriche;
- autorizzazione materiali e risultati case study;
- pubblicazione/deploy del dominio live.

## Checklist di uscita

Il piano puo considerarsi completato quando:

- [ ] il dominio live non mostra piu "SITO IN COSTRUZIONE";
- [ ] il primo link bio punta al sito;
- [ ] media kit e sito usano gli stessi numeri ufficiali;
- [ ] esistono almeno 10 contenuti reali proprietari;
- [ ] esiste almeno 1 case study reale;
- [ ] newsletter/lead magnet funzionano;
- [ ] affiliate hanno disclosure e tracking;
- [ ] 5 partner reali sono stati contattati;
- [ ] `MARKETING_OPERATIONS_HUB` e partner pipeline sono aggiornati.

## Note collegate

- Audit pubblico: [[50_Scratch/AUDIT_PUBLIC_FOOTPRINT_TRAVELLINIWITHUS_2026-06-07]]
- Progetto sito: [[10_Projects/PROJECT_TRAVELLINIWITHUS_SITE]]
- Marketing hub: [[MARKETING_OPERATIONS_HUB]]
- Pipeline partner: [[12_Partnerships/PARTNER_PIPELINE_TRAVELLINIWITHUS]]
