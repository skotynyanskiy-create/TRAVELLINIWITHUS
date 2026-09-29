---
title: HANDOFF_webapp-travelliniwithus_orchestrator_to_growth
status: consumed
created: 2026-09-29
from: travellini-orchestrator
to: travellini-growth-revenue-operator
slug: webapp-travelliniwithus
expires: 2026-10-13
type: handoff
area: delivery
round: R1 (divergenza, in parallelo con ui-designer x2, social, seo, asset-curator)
---

# Handoff: perché la webapp è un asset di business, e perché uno la installa e ci torna

## Why this work matters

L'owner ha deciso che Travelliniwithus diventa una **webapp**. Un'app bella che non
porta lead, collaborazioni o ritorni è un costo. Tu decidi cosa la rende un asset:
lead, partner, affiliati, shop, e come i 5 anni di reel diventano una prova senza
diventare una vanity metric. In più, insieme a travellini-ui-designer (che copre il
*come*), porti il *perché*: il motivo per cui una persona mette l'icona sul telefono e
torna.

## Le domande che devi risolvere (angolo divergente)

> **1. Perché una persona che segue già @travelliniwithus su Instagram dovrebbe mettere
> l'icona di Rodrigo e Betta sulla schermata home? Cosa le dà l'app che Instagram, con il
> tasto Salva, non le dà?**
>
> **2. Se un ente del turismo o un hotel aprisse l'app per 90 secondi, cosa dovrebbe
> vedere per scriverci? E cosa, dentro l'app, NON va monetizzato per non bruciare la
> fiducia?**

## Decisions already made

- **Travelliniwithus diventa una webapp** (decisione owner, 2026-09-29), con lo schermo
  unico al centro. Non rimetterla in discussione.
- **Articoli, guide e schede posto restano**: sono livelli di contenuto dentro l'app, con
  URL indicizzabili. SEO e AI-search restano il canale con cui il sito viene trovato.
- **Imagery truth (non negoziabile)** — `docs/20_Decisions/DECISION_IMAGERY_TRUTH_RULE_2026-07-22.md`:
  luoghi, persone ed esperienze solo con foto o fotogrammi reali, con etichetta di
  provenienza. AI solo per asset `craft` non referenziali. Vale anche per i materiali
  destinati ai partner: nessun mockup con immagini generate.
- **Metriche pubbliche** — `BEST/docs/20_Decisions/DECISION_PUBLIC_METRICS_SOURCE_TRAVELLINIWITHUS_2026-06-07.md`:
  - nessun numero social scritto nel codice di pagine, email o PDF;
  - ogni pagina business dichiara che i dati sono uno snapshot da aggiornare;
  - la fonte tecnica è `BRAND_STATS` in `src/config/site.ts`.
- **Invariati**: brand, consenso per la mappa, budget del bundle, file ad alto rischio
  fuori scope, nessun segreto, **nessun numero inventato** (audience, conversioni,
  prezzi, partner). Ciò che non sai va marcato `[VERIFY: ...]`.

## Ipotesi di lavoro (raccomandazioni dell'orchestratore, da confermare dall'owner prima della sintesi R2)

- "Webapp" significa: un guscio persistente con navigazione a schede, una home a schermo
  unico e «I miei posti» salvati senza account e leggibili offline. L'installabilità è
  una conseguenza. Nessun login obbligatorio.
- Si lancia con i 79 posti visibili (più il primo lotto di 21 reel), con una struttura
  pensata per 533 e oltre. Il corpus può comparire come **tracce** (reel geolocalizzati
  senza pagina) distinte dai **posti** (scheda e URL).
- Metrica primaria: **iscrizioni email nate nell'app**. Si contano lato server, quindi
  non dipendono dal consenso analytics. Metrica secondaria: ritorno entro 30 giorni,
  misurato solo sul campione che dà il consenso. **Puoi contestarla con argomenti.**
- Persona primaria: chi arriva da un reel sul telefono. Anche questa si può contestare.

## Context the receiver needs

**Fatti verificati** (usa solo questi; tutto il resto va marcato `[VERIFY: ...]`):

Base e corpus
- Base = ramo del PR #27, commit 4fe1794, checkout in sola lettura:
  `BEST = /tmp/claude-0/-home-user-TRAVELLINIWITHUS/8c6b9c85-6fd1-5455-93cb-7a8ffe3e982f/scratchpad/best`.
  `/home/user/TRAVELLINIWITHUS` è `main`, fermo all'11 agosto: non è la base.
- 1.283 post Instagram (dal 25 lug 2021 al 13 ago 2026); 624 luoghi geocodificati (463
  Italia, 31 Spagna, 17 UK, 15 Emirati, 11 Francia, 10 Egitto; 120 solo città o
  regione); 1.017 reel citano un luogo; **circa 186 milioni di visualizzazioni sommate**.
  È una somma di plays, non una reach unica, e la data di snapshot è da verificare.
- Squilibrio geografico: Lombardia 147, Veneto 62, Emilia-Romagna 48; Puglia 1, Sicilia
  2; **Sardegna, Marche, Friuli Venezia Giulia, Molise e Basilicata a zero**, con pagine
  destinazione già indicizzabili e senza contenuto.
- Caption: nel primo lotto della spec, 9 reel su 21 hanno già il prezzo in caption. La
  formula ricorrente in chiusura è «L1nk in bi@ per super sc@nti di ogni
  genere/assicurazione viaggio/escursioni»: la bio promuove già sconti, assicurazione ed
  escursioni.
- Sul sito: 79 schede posto visibili su 110; la home dichiara «79 posti provati di
  persona · 33 collaborazioni dichiarate» (screenshot 01). Il verdetto «per chi è / per
  chi no» esiste su 1 scheda su 79 (spec corpus §4).
- IG: 172K follower, verificati da og-meta il 2026-07-15
  (`BEST/docs/13_Content/INSTAGRAM_IMPORT_RUNBOOK.md`). Il TikTok 90K non è verificabile
  senza l'owner.

Revenue surface (da `docs/MARKETING_OPERATIONS_HUB.md`; quadro di maggio-luglio,
**stato attuale [VERIFY]**)
- Newsletter e lead magnet: collegati ma non attivi (manca `RESEND_API_KEY`).
- Partner pipeline B2B: collegata, 0 outreach inviati.
- Affiliati: 2 attivi su 6 (Heymondo, GetYourGuide).
- Shop: preorder-first con 1 SKU in waitlist; Stripe live solo con almeno 20 iscritti
  in lista.
- Media kit: form attivo.
- Regole in vigore:
  - 1 contenuto partner ogni 4 editoriali;
  - Telegram disabilitato (nessuna CTA);
  - `/guida-in-regalo` è l'unica landing della bio;
  - la regola di outreach chiede almeno un case study o uno screenshot di dashboard
    salvato come prova.

Già costruito nel PR #27
- Scheda posto con «Il Timbro», «Cosa sapere prima», `checked` (fonte e data).
- Edizioni Viaggiatori, Family e Collaborazioni con commutatore in testata. All'ingresso
  c'è una modale bloccante di scelta edizione, con misurazione GA4 in corso.
- Mappa con tetto di 60 marcatori; tessere solo con il consenso marketing (senza, un muro
  scuro).
- «I miei posti» su `/preferiti`, con posti e articoli nello stesso array.
- PWA "da blog": manifest «Travel blog di Rodrigo & Betta», nessun momento
  d'installazione, nessun contenuto offline.
- Budget `initial-js`: 776 KB su 780.

**Da leggere (solo questo):** `docs/MARKETING_OPERATIONS_HUB.md`,
`BEST/src/config/site.ts` (`BRAND_STATS`, fonte), `BEST/src/config/surfaces.ts`, gli
screenshot 01 e 05 in
`/tmp/claude-0/-home-user-TRAVELLINIWITHUS/8c6b9c85-6fd1-5455-93cb-7a8ffe3e982f/scratchpad/shots/`,
e il fact pack se è pronto
(`docs/50_Scratch/HANDOFF_webapp-travelliniwithus_data-analyst_to_divergenza.md`),
dove trovi prezzi, collaborazioni e concentrazione dei plays.

## What the receiver should produce

1. **Motivi d'installazione e di ritorno** (al massimo 5). Per ognuno:
   - il dato reale su cui poggia;
   - cosa Instagram non può dare al suo posto;
   - come si misura **senza dipendere dal consenso analytics**, oppure perché non si può.
2. **Meccanismi di business**, da 5 a 8 schede idea (formato sotto), che coprano:
   - lead ed email;
   - la "vista Collaborazioni" dell'app per i partner;
   - dove stanno gli affiliati senza tradire il verdetto;
   - shop e club;
   - le **zone bianche** (regioni a zero) come pipeline per enti e strutture;
   - i ~186M come prova, rispettando la regola delle metriche datate.
3. **Metrica primaria**: conferma o contesta l'ipotesi dell'orchestratore, indicando il
   percorso di misura e i prerequisiti (per esempio l'attivazione di Resend e Brevo
   [VERIFY]).
4. **Lista "non monetizzare"**: ciò che dentro l'app deve restare libero da affiliati o
   sponsor, e perché.
5. **Persona**: conferma o contesta "chi arriva da un reel sul telefono". Se la contesti,
   proponi la persona alternativa con evidenza.
6. **Cosa vede un partner in 90 secondi**: la sequenza di schermate (reali, con dati
   datati) che porta a una richiesta di collaborazione.

Formato scheda idea (obbligatorio, una scheda per idea):

```
### Idea N — <nome italiano, max 5 parole>
- In una frase:
- Perché stupisce (la schermata che l'owner manderebbe a Betta):
- Dato reale su cui poggia: <fatto citato; se ignoto [VERIFY: ...]>
- Cosa richiede: dati / asset / codice / ore owner
- Rischio principale:
- Regole toccate: imagery-truth | anti-SaaS | brand-DNA | SEO-URL | file-alto-rischio | privacy | metriche-pubbliche | bundle | nessuna
- Variante: prudente | firma | audace
- Autovalutazione 1-5: Stupore / Verità / Business / Costo (5 = economico) / Carico owner (5 = leggero)
```

- Where it lands: `docs/50_Scratch/HANDOFF_webapp-travelliniwithus_growth_to_orchestrator.md`
  nel repo `/home/user/TRAVELLINIWITHUS`, con il frontmatter del template handoff.

## Out of scope (do NOT touch)

- Codice e `src/`. `BEST/` è in sola lettura. Nessun file ad alto rischio: se un'idea
  richiede nuove raccolte Firestore o endpoint, segnalalo come "richiede backend e
  conferma owner".
- Interazione e schermate dell'app (ui-designer), copy definitivo (seo), formati social
  (social-content-operator).
- Numeri inventati: nessuna stima di conversioni, ricavi, CPM o tariffe partner. Se
  servono, vanno marcati `[VERIFY: ...]` e chiesti a travellini-data-analyst.
- **Vietato proporre**:
  - gamification, badge o punti;
  - paywall sui contenuti gratuiti di oggi;
  - pop-up d'uscita;
  - notifiche push al primo accesso;
  - nomi di partner o prezzi non documentati;
  - CTA Telegram.

## Open questions / decisions for the user

- Se ritieni che la metrica primaria debba essere un'altra (collaborazioni, ricavi
  affiliati, ritorno), argomentalo: l'owner deciderà prima di R2.

## Next hand-off

- Next agent: travellini-orchestrator (sintesi R2).
- Trigger: il tuo file di uscita esiste con i punti 1-6.

## Notes

- Il valore unico da proteggere è "ci siamo stati davvero": qualunque meccanismo che
  faccia sembrare l'app una vetrina di sponsor va scartato già da te.
- Le zone bianche sono una debolezza oggettiva. Trasformarle in pipeline richiede di
  non promettere viaggi che non sono pianificati.
