---
title: HANDOFF_lead-magnet_F1.10_editorial-writer_to_owner
status: open
created: 2026-05-15
from: travellini-editorial-writer
to: owner (Rodrigo & Betta) — approval + downstream agents
slug: lead-magnet-10-posti-italiani-particolari
expires: 2026-06-15
---

# Handoff: Lead magnet PDF "10 Posti Italiani Particolari" — outline editoriale

## Why this work matters

`public/lead-magnet-posti-italiani.pdf` attuale è placeholder. Sostituirlo con un PDF editoriale reale è critico perché:

- è il lead magnet primario della newsletter (gate per ogni signup),
- comunica voce R+B al primo contatto (deve far innamorare del brand),
- funziona da seed per upsell (link interni a guide gratuite → shop/club),
- è tracciabile via UTM per misurare ROI del lead capture.

Target lettura: ~9 minuti attivi, 15 con foto. PDF < 8MB totale.

## Decisions already made

### Architettura PDF — 13 pagine

| Page   | Scope                   | Note                                                                                                                           |
| ------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| p.1    | Cover                   | Titolo + sopratitolo + claim "Le cose che ci siamo segnati sul taccuino dopo cinque anni in giro per l'Italia" + edizione 2026 |
| p.2    | Intro R+B + mappa       | ~150 parole intro + ritratto R+B + mappa illustrata 10 pin                                                                     |
| p.3-12 | 10 posti (1 per pagina) | Header (nome + regione + tipologia), 1 foto landscape, copy 150-180 parole, riga "Dove / Quando ha senso"                      |
| p.13   | Outro + CTA             | "Ogni venerdì un posto nuovo via email" + 2 CTA finali                                                                         |

### Selezione 10 luoghi (bilanciamento Nord/Centro/Sud verificato)

1. **Specchia** — Puglia (Salento interno, LE) — Borgo
2. **Matera Sasso Caveoso all'alba** — Basilicata (MT) — Borgo + esperienza
3. **Marzamemi** — Sicilia (SR) — Borgo + food
4. **Civita di Bagnoregio** — Lazio (VT) — Borgo + natura
5. **Castelluccio di Norcia + Piano Grande** — Umbria (PG) — Natura
6. **Polignano-Monopoli costa nord** — Puglia (BA) — Natura + esperienza
7. **Procida Marina Corricella** — Campania (NA, isola minore) — Isola + borgo
8. **Apricale** — Liguria entroterra (IM) — Borgo + food
9. **Cividale del Friuli** — Friuli (UD) — Borgo + artigianato
10. **Val di Funes / Santa Maddalena** — Trentino-AA (BZ, Dolomiti minori) — Natura

Mix: 4 Sud, 3 Centro, 3 Nord. 5 borghi, 2 natura, 1 isola, 1 food-led, 1 esperienza-costa. Zero mete iper-mainstream.

### Voice cheat-sheet

**Parole/frasi ricorrenti**:

- "Ci siamo accorti che..." / "abbiamo capito che..."
- "A 200 metri da..." / "venti minuti a piedi" (specificità geografica)
- "Alle sette di mattina" / "verso le sei di sera" (momento del giorno preciso)
- "Non funziona se..." / "salta se..." (onestà operativa)
- "Il signor [nome]" / "la famiglia che gestisce..." (persone reali)

**VIETATE**:

- "Imperdibile" / "must-see" / "must-do"
- "Destinazione da sogno" / "luogo magico" / "borgo incantato"
- "Mozzafiato" / "spettacolare" / "indimenticabile"
- "Lasciati ispirare" / "parti alla scoperta" / "vivi un'esperienza"
- "Una delle più belle d'Italia"

### Modello stilistico — bozza luogo #1 (Specchia, ~150 parole)

> **Specchia — Puglia (Lecce)**
>
> Siamo arrivati a Specchia per sbaglio. Cercavamo benzina fuori da Tricase e ci siamo trovati in una piazza di pietra bianca, vuota, alle quattro del pomeriggio di un giovedì di settembre. Tre vecchi seduti, una signora che stendeva i panni a una finestra del primo piano, e un odore di sugo che usciva da una porta aperta.
>
> Specchia è uno di quei borghi del Salento interno che il turismo agostano scavalca, perché si fermano tutti a Otranto e Gallipoli. Sbagliano. Qui le case sono bianche di calce vera, non di smalto, e a mezzogiorno chiudono sul serio — se arrivi all'una e mezza, non mangi.
>
> Da Specchia il mare di Pescoluse è a venti minuti di macchina. Vale come base per dormire: stessa Puglia, metà del prezzo, zero parcheggi a pagamento.
>
> _Dove_: 50 km a sud di Lecce. _Quando ha senso_: maggio-giugno, settembre-ottobre.

**Regole per gli altri 9 luoghi**:

- Apri sempre con dettaglio concreto (l'arrivo, l'ora, persona, odore).
- Una micro-onestà operativa per luogo ("chiudono a mezzogiorno", "non funziona ad agosto", "parcheggio disastro").
- Chiudi con _Dove_ (riferimento geografico vero) + _Quando ha senso_ (mesi).
- 150-180 parole, mai oltre 200.

### CTA strategy

**CTA principale (p.13)**:

- Primario: `travelliniwithus.it/esplora?utm_source=lead-magnet-pdf&utm_medium=pdf&utm_campaign=10-posti-italiani&utm_content=cta-finale`
- Secondario: `instagram.com/travelliniwithus` (senza UTM)

**3 micro-CTA distribuite**:

- p.3 (Salento) → `/articolo/salento-cosa-vedere?utm_*&utm_content=salento-p3`
- p.5 (Marzamemi) → `/esplora?zona=italia&tipo=itinerario&utm_*&utm_content=sicilia-p5`
- p.8 (Polignano/Monopoli) → `/esplora?zona=italia&tipo=food-e-ristoranti&utm_*&utm_content=puglia-p8`

**Regola**: max 4 link cliccabili totali (3 micro + 1 finale).

### UTM schema

```
utm_source=lead-magnet-pdf
utm_medium=pdf
utm_campaign=10-posti-italiani
utm_content=<posizione>
```

### Metriche di successo

- **Primaria**: CTR sui link interni del PDF ≥ 8% download → sito entro 30 giorni.
- **Secondaria**: open rate prima mail welcome series ≥ 50%.
- **Terziaria**: tempo medio sul sito visitatori UTM lead-magnet vs organic ≥ 2× la media.

## Open questions for R+B (BLOCKING per produzione finale)

1. **Toscana sì/no?**: outline non include Toscana (priorità Lazio/Umbria al Centro). Volete sostituire un luogo con Pitigliano (al posto di Civita) o Sant'Antimo (Val d'Orcia)?
2. **Polignano vs. Monopoli (p.8)**: meglio raccontare la calata di Monopoli (più sconosciuta, più "particolare") o Grotta Palazzese (più Instagram-friendly)?
3. **Foto p.8 e p.10**: sono in archivio R+B? Se no, sostituiamo luogo o pianifichiamo scatti?
4. **Edizione**: "2026" o senza data (più longeva, meno urgenza)?
5. **Apricale vs. Tellaro vs. Varese Ligure**: Apricale è pick attuale per Liguria interna — preferenza?

## What the receiver should produce (downstream)

Dopo approvazione owner, sequenza handoff:

1. **`travellini-editorial-writer`**: scrive copy completo 10 luoghi (~1.500 parole) seguendo modello Specchia.
2. **`travellini-asset-curator`**: master shopping list foto + produzione mappa illustrata + verifica archivio R+B.
3. **`travellini-ui-designer`**: layout PDF (impaginazione, tipografia, griglia).
4. **`travellini-seo-conversion-strategist`**: meta PDF + schema.org per landing newsletter.
5. **`travellini-data-analyst`**: setup UTM tracking + GA4 custom dimension.
6. **`travellini-social-content-operator`**: caption Instagram di lancio + welcome email series.

## Master shopping list foto

| #   | Soggetto                                   | Use       | Disponibile archivio?            | Orientation          |
| --- | ------------------------------------------ | --------- | -------------------------------- | -------------------- |
| 1   | Paesaggio italiano evocativo (luce serale) | Cover p.1 | [VERIFY R+B]                     | Landscape full-bleed |
| 2   | Ritratto R+B in viaggio                    | Intro p.2 | sì                               | Portrait             |
| 3   | Specchia — vicolo/piazza bianca            | p.3       | [VERIFY R+B]                     | Landscape            |
| 4   | Matera Sasso Caveoso alba                  | p.4       | [VERIFY R+B]                     | Landscape            |
| 5   | Marzamemi piazza tonnara controluce        | p.5       | [VERIFY R+B]                     | Landscape            |
| 6   | Civita di Bagnoregio passerella alba       | p.6       | [VERIFY R+B]                     | Landscape            |
| 7   | Castelluccio + Piano Grande figura umana   | p.7       | [VERIFY R+B]                     | Landscape            |
| 8   | Polignano/Monopoli calata sera             | p.8       | [VERIFY — possibile da scattare] | Landscape            |
| 9   | Procida Marina Corricella                  | p.9       | [VERIFY R+B]                     | Landscape            |
| 10  | Apricale vicolo pietra                     | p.10      | [VERIFY — possibile gap]         | Landscape            |
| 11  | Cividale Ponte del Diavolo                 | p.11      | [VERIFY R+B]                     | Landscape            |
| 12  | Val di Funes Santa Maddalena               | p.12      | [VERIFY R+B]                     | Landscape            |
| 13  | R+B di spalle (outro)                      | p.13      | sì                               | Landscape o square   |
| 14  | Mappa Italia illustrata 10 pin             | p.2       | DA PRODURRE (illustrazione)      | Portrait             |

**Vincoli foto**: 300dpi stampa, ottimizzata PDF < 500kb cad, ore dorate, persone reali (non modelle), no insegne brand visibili, no AI-generated.

## Out of scope

- Implementazione layout PDF (passa a ui-designer dopo copy approvato).
- Pubblicazione effettiva del nuovo PDF (passa a frontend-builder per sostituire `public/lead-magnet-posti-italiani.pdf` + redirect).
- Welcome email series finale (passa a social-content-operator dopo).

## Next hand-off

- **Next agent**: owner (Rodrigo & Betta) — risponde alle 5 open questions sopra.
- **Trigger**: appena owner risponde alle 5 questions → editorial-writer scrive copy completo.

## Notes

- Outline rispetta brand voice ([BRAND_MESSAGING_STRATEGY.md](../BRAND_MESSAGING_STRATEGY.md)).
- Zero mete mainstream selezionate (no Cinque Terre, Positano, Tre Cime, Firenze/Siena, Lago di Como).
- Bilanciamento geografico verificato: 4 Sud / 3 Centro / 3 Nord.
- Lunghezza target totale: ~1.700 parole copy + intro + outro.
