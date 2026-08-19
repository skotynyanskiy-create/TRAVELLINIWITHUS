---
paths:
  - 'src/**/*.tsx'
  - 'src/**/*.css'
  - 'DESIGN.md'
  - 'public'
  # Il registro che `audit:provenance` legge: chi lo apre per registrare un
  # asset deve ricevere la regola di verita' delle immagini proprio li'.
  - 'src/data/asset-provenance.json'
---

# Design — legge di brand

Questa regola si carica quando apri un componente, un foglio di stile o un asset.
Il divieto sulla generazione di immagini referenziali sta **anche** in `CLAUDE.md`,
perché può servire prima che tu abbia aperto un file che corrisponde a questi
percorsi.

- Il DNA di brand — Fraunces, sabbia `#faf8f4`, terracotta `#c2410c`, foto VERE,
  icone lucide — è deliberato. **Non è «AI slop» da smontare.** Conserva il
  linguaggio visivo esistente salvo richiesta esplicita di redesign.
- Sul dettaglio vince `DESIGN.md`. La direzione passa da `travellini-ui-designer`,
  l'implementazione dal plugin `frontend-design` sotto quella guardia.
- **Regola di verità delle immagini**
  (`docs/20_Decisions/DECISION_IMAGERY_TRUTH_RULE_2026-07-22.md`): le immagini
  referenziali — luoghi, persone, esperienze — devono essere fotografia reale o
  fotogrammi reali di reel, etichettate per asset (`real-photo` / `real-frame` /
  `craft`). La generazione AI è ammessa **solo** per asset non referenziali di
  fattura (grana della carta, inchiostro, timbri, velature di mappa, matte di
  transizione), etichettati `craft`. Mai generare persone, luoghi o esperienze
  presentati come reali.
- Il cancello che la verifica è `npm run audit:provenance`: **errore non
  negoziabile** per ogni asset non registrato in `src/data/asset-provenance.json`.
  Dal 2026-08-14 gira in CI, in `predeploy` e in `audit:quality`.

## Verifica

- `npm run audit:ui` — un solo `h1` forte, copy italiano, CTA specifica, zero
  overflow orizzontale su mobile, token CSS e componenti esistenti
  (`PageLayout`, `Section`, lucide-react), niente stile inline.
- Modifica visibile in browser: `npm run audit:visual`, **e guarda la pagina
  davvero**. Mai chiedere all'owner di controllare a mano.
