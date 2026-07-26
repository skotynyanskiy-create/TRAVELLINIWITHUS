---
project: Travelliniwithus
type: content-brief
status: in-progress
owner: Rodrigo & Betta
created: 2026-05-14
area: content
priority: p2
---

# Lead magnet: 10 posti italiani non ovvi

## Stato

- Componente PDF: `src/pdf/LeadMagnetDocument.tsx` ✓
- Script generator: `scripts/generate-lead-magnet.tsx` ✓ (10 luoghi reali inseriti)
- Route web: `/lead-magnet` ✓
- Trigger welcome email con link al PDF: `server.ts` ✓ (via `LEAD_MAGNET_URL` env)
- Build pipeline: `npm run generate:lead-magnet` integrato in `npm run build` ✓
- **TODO R+B**: revisione finale dei 10 luoghi prima della promozione in bio IG/TikTok

Il build del 2026-05-15 ha rigenerato `public/lead-magnet-posti-italiani.pdf`
con una selezione editoriale completa. Prima di spingere traffico pubblico,
Rodrigo & Betta devono confermare che i luoghi siano coerenti con esperienza,
tono e promessa "posti provati".

## Luoghi inseriti nel PDF

1. Specchia, Puglia
2. Tricase Porto, Puglia
3. Acaya, Puglia
4. Vico del Gargano, Puglia
5. Scanno, Abruzzo
6. Rasiglia, Umbria
7. Castelluccio di Norcia, Umbria
8. Lago di Tovel, Trentino
9. Val di Funes, Alto Adige
10. Bosa, Sardegna

## Posizionamento

> "Una lista corta, scelta dopo 8 anni di viaggi reali. Per chi viaggia
> in coppia e cerca posti veri, non liste su Pinterest."

Lead magnet differenziante perché:

- È breve (10 posti, non 50). La selezione È il valore.
- È specifico per coppie italiane (target audience site).
- Ogni posto ha dati pratici (costo, come arrivare, when, insider tip).
- Niente cliché ("perla nascosta", "luogo magico", "atmosfera fiabesca").

## Criteri di selezione (R+B compilano)

1. **Italia** prima di tutto. Massimo 1-2 fuori (es. Slovenia/Corsica/Malta confini italici).
2. **Regioni meno battute**. NO Roma, Firenze, Venezia, Cinque Terre, Amalfi standard,
   Capri standard, Costiera Smeralda standard. Sì borghi vicini, frazioni, valli minori.
3. **Visitato davvero** dalla coppia, possibilmente più di una volta.
4. **Mix stagionale**: 3-4 estate (mare/montagna), 2-3 primavera-autunno (borghi/foliage),
   2-3 inverno (montagna/spa/mercatini), 1-2 evergreen.
5. **Mix tipologia**: borghi + natura + mare + cibo + spa/relax + esperienza specifica.
6. **Bilanciare scala**: 2-3 destinazioni regionali ampie (es. "il Cilento") + 7-8 microposti
   specifici (es. "il rifugio X in Val Y").

## Tone of voice

- Caldo, diretto, specifico. Come parlare a un'amica che ti chiede consiglio.
- Niente avverbi enfatici ("davvero", "veramente", "assolutamente").
- Niente cliché travel-blog: nascondere "perla", "gemma", "incanto", "paradiso", "magico".
- Concretezza > poesia. "10 minuti a piedi dal parcheggio" batte "raggiungibile con una breve passeggiata".
- Prima persona plurale ("noi", "abbiamo trovato", "ci siamo tornati") — coerente col brand R+B.
- Niente prezzi finti precisi ("EUR 87.50"). Range realistici ("EUR 80-100 per coppia").

## Schema per ogni location (in `generate-lead-magnet.tsx`)

```ts
{
  number: '01',           // 01..10
  name: 'Nome del luogo', // breve, riconoscibile
  region: 'Regione',      // es. "Puglia", "Trentino", "Cilento"
  why:                    // 3 frasi: atmosfera + dettaglio specifico + perché coppia
    'Ci siamo tornati tre volte. La frazione [X] e' rimasta vera, fuori stagione. ' +
    'Camminiamo dal mare al borgo in 20 minuti, mangiamo dove cucinano per pochi. ' +
    'Funziona se cercate silenzio, non vita notturna.',
  howToReach:             // pratico: ultimo miglio + tempo
    'Treno da Bari a [Stazione], poi 15 min in taxi. Auto in 1h30 da [Citta].',
  bestTime:               // mesi + perché
    'Maggio-giugno e settembre. A luglio si riempie. In agosto chiude meta dei locali.',
  costEstimate:           // range coppia/giorno o coppia/viaggio
    'EUR 90-130 al giorno per coppia, B&B + 2 pasti.',
  insiderTip:             // 1 frase, cosa non c'e su Google
    'Chiedete a [Posto X] del taglione di mucco: non e nel menu, lo fanno solo se ' +
    'arrivate prima delle 13.',
}
```

## Workflow di pubblicazione

1. R+B compilano i 10 luoghi reali in `scripts/generate-lead-magnet.tsx` (~3-4h editorial).
2. `npm run generate:lead-magnet` per generare il PDF localmente (verifica formattazione,
   ~12 pagine A4, ~150-250 KB).
3. Verifica visiva del PDF su mac/PC + mobile (iPhone preview).
4. Commit + push. Il build production rigenera il PDF automaticamente.
5. R+B testano il flusso end-to-end: iscrivono email test su `/vieni-con-noi`,
   ricevono welcome email entro 60s, cliccano CTA download, scaricano PDF reale.

## Distribuzione

- **Entry point primario**: form su `/vieni-con-noi` (landing IG bio).
- **Entry point secondari**: form Newsletter su home, footer, articoli.
- **Email**: welcome email post-iscrizione include CTA download diretto.
- **Backup web**: pagina `/lead-magnet` con CTA download (link condivisibile via DM IG).

## Metriche di successo (target 90 giorni)

- Download rate: >60% degli iscritti newsletter cliccano CTA download in welcome.
- Conversion bio IG → newsletter: +150% vs baseline (oggi: home generica).
- Open rate welcome email: >55% (benchmark settore 35-45%).
- Forward / share: tracciare email "ricevuta da amica" tramite `?utm_source=share`.

## Aggiornamenti consigliati

- **Versioning**: ogni 6 mesi (gennaio + luglio) ruotare almeno 2 location per
  freshness e per dare un motivo agli iscritti di re-engagement.
- **Stagionalità**: in autunno (settembre), aggiungere 1 location "weekend foliage"
  come edizione speciale.
- **Lingue**: rimanere italiano per ora. EN solo se MAU IT > 5K.
