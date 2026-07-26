---
name: verify-facts
description: Fact-check sistematico di un draft Travelliniwithus prima della pubblicazione — estrae ogni claim concreto (prezzi, orari, distanze, nomi luoghi, eventi, contatti) e verifica via web/WebFetch/MCP. Classifica claim come verified/stale/unverified/risk. Per pillar editoriali e lead magnet. Usa quando l'utente dice "fact-check", "verifica fatti", "controlla draft", "verifica claim", o PRIMA della pubblicazione di ogni pillar.
---

# /verify-facts — Fact-check editoriale

Travellini campa di affidabilita. Pubblicare un articolo che dice "il traghetto costa 8€" quando ne costa 14 è un colpo al brand. Questa skill estrae ogni claim verificabile da un draft e dichiara lo status di ognuno.

NON è un agent di research generico: è un controllo di consistenza pre-pubblicazione.

## Quando attivare

- Pillar article appena scritto da `travellini-editorial-writer` o appena rifinito da `/anti-ai-slop`
- Lead magnet PDF prima dell'export
- Risoluzione dei flag `[VERIFY: ...]` lasciati da `/anti-ai-slop`
- Articolo "ereditato" (pubblicato >6 mesi fa, da revisionare)
- "Fact-check del draft Lisbona"
- "Controlla i prezzi nell'articolo Salento"

## Quando NON attivare

- Editoriale narrativo puro senza claim verificabili (storia, riflessione)
- Caption Instagram o newsletter corte
- Articolo gia fact-checked nelle ultime 8 settimane (vedi frontmatter `fact_check_at`)

## Cosa è un "claim verificabile"

Affermazioni a fatto, non opinioni:

| È claim verificabile                            | NON è claim verificabile         |
| ----------------------------------------------- | -------------------------------- |
| "Il traghetto Pozzuoli-Procida costa 12,50€"    | "Il traghetto non costa troppo"  |
| "Il museo è aperto 9-19 da martedi a domenica"  | "Il museo è aperto fino a tardi" |
| "60 km in 90 minuti su A14"                     | "Si arriva in fretta"            |
| "Ristorante La Lampara, via Roma 12, Marzamemi" | "Un buon ristorante a Marzamemi" |
| "Festival dura dal 15 al 22 agosto 2025"        | "Festival è a meta agosto"       |
| "Email: info@partner.it"                        | "Si puo scrivere al partner"     |
| "Codice sconto TRAVELLINI10 valido fino al X"   | "Sconto disponibile"             |

Categorie:

1. **Prezzi** — biglietti, ingressi, traghetti, ristoranti, hotel
2. **Orari** — apertura/chiusura, frequenza traghetti, voli
3. **Distanze / tempi** — km, minuti, durata percorsi
4. **Indirizzi / contatti** — via, civico, telefono, email, web
5. **Date / eventi** — festival, sagre, eventi temporanei
6. **Nomi propri** — ristoranti, hotel, partner, persone
7. **Dati storici / culturali** — date di costruzione, fatti citati
8. **Codici / offerte** — promo codes, link affiliate, scadenze

## Protocollo

### Fase 1 — Estrazione claim

Leggi il file (`src/data/articles/[slug].seed.ts` o `docs/13_Content/ARTICLE_*.md` o `public/lead-magnet-*.md` sorgente).

Produci tabella di TUTTI i claim, una riga per claim, con:

| #   | Categoria | Claim                               | Posizione (line/§) | Sorgente nel testo                 |
| --- | --------- | ----------------------------------- | ------------------ | ---------------------------------- |
| 1   | Prezzo    | "Traghetto Pozzuoli-Procida 12,50€" | §3 r2              | "Il biglietto costa 12,50€"        |
| 2   | Orario    | "Museo aperto 9-19 mar-dom"         | §5 r4              | "9-19 da martedi a domenica"       |
| 3   | Distanza  | "60 km Bari-Polignano A14"          | §2 r1              | "60 km, un'ora a meta lungo l'A14" |

Se ci sono >30 claim, raggrupparli per categoria.

### Fase 2 — Verifica

Per ogni claim, **tentare** verifica nell'ordine:

1. **Frontmatter timestamp**: il claim ha una data di rilevazione esplicita nell'articolo? (es. "rilevato luglio 2025"). Se SI e fresca (<6 mesi), marcare `dated`.
2. **Web fetch** ufficiale: sito del partner/ente. Es. per traghetti → sito Caremar; per musei → sito ufficiale museo.
3. **Knowledge cutoff**: il modello sa il claim? OK come prior, MAI come unica fonte.
4. **MCP** se applicabile (firebase per dati interni partner, ma raramente serve qui).

**Mai inventare una sorgente**. Se non puoi verificare, marcare `unverified`.

### Fase 3 — Classificazione

| Status         | Significato                                                                              |
| -------------- | ---------------------------------------------------------------------------------------- |
| `verified`     | Confermato da fonte autoritativa nelle ultime 8 settimane                                |
| `dated`        | Data di rilevazione esplicita nell'articolo, dato plausibile (no contraddizione fonte)   |
| `stale`        | Verifica trova un valore aggiornato diverso → DA AGGIORNARE                              |
| `unverified`   | Non riuscito a confermare. Lasciare in articolo solo con timestamp esplicito o tagliare  |
| `risk`         | Verifica trova fonte contraddittoria o dato a rischio (es. partner ha cambiato gestione) |
| `missing-attr` | Affermazione citabile senza fonte (es. fatto storico) — aggiungere link o tagliare       |

### Fase 4 — Report

Tabella sintesi + lista azioni concrete.

### Fase 5 — Aggiorna frontmatter

Nel file vault dell'articolo:

```yaml
fact_check_at: YYYY-MM-DD
fact_check_status: clean # clean | needs-fix | abandoned
fact_check_stale: 0
fact_check_unverified: 0
fact_check_risk: 0
```

## Vincoli duri

- **Mai modificare il draft direttamente.** Solo report. Le correzioni le fa l'editorial-writer dopo aver visto il report.
- **Mai sostituire un claim con un altro inventato.** Se "12,50€" è stale, NON scrivere "13€" — chiedere fonte o flaggare.
- **Mai considerare verified un claim solo perche è plausibile.** Plausibile ≠ verificato.
- **Se >30% claim sono `stale` o `unverified`**, raccomandare di **rimandare la pubblicazione** finche non si fa rilevazione fresh.
- **Conflict-of-interest claims** (es. "il nostro partner è il migliore"): NON è fact-checkable e va riformulato dall'editorial-writer come opinione esplicita.

## Output template

```markdown
## /verify-facts — [slug]

**Source:** [path]
**Generated:** YYYY-MM-DD
**Total claim:** [N]

### Sintesi

| Status       | Count | %   |
| ------------ | ----- | --- |
| verified     | X     | X%  |
| dated        | X     | X%  |
| stale        | X     | X%  |
| unverified   | X     | X%  |
| risk         | X     | X%  |
| missing-attr | X     | X%  |

**Verdict:** ✓ pubblicabile / ⚠ correzioni richieste (vedi azioni) / ✗ rimandare pubblicazione (>30% problemi)

### Claim per claim

[tabella estrazione completa, vedi Fase 1, con colonna Status aggiunta]

### Azioni richieste

#### Priorita ALTA (stale + risk)

1. **§3 r2** — Traghetto Procida: l'articolo dice 12,50€, sito Caremar mostra 14€ (rilevato YYYY-MM-DD). → Aggiornare a 14€ con timestamp "ad agosto 2025".
2. **§7 r1** — Ristorante "La Lampara, via Roma 12": Google Maps mostra "via Garibaldi 8". → Verificare con il partner direttamente o togliere indirizzo specifico.

#### Priorita MEDIA (unverified)

3. **§5 r4** — Museo: orari 9-19 da martedi a domenica → fonte non trovata online. Suggerire timestamp esplicito "verificato YYYY-MM" o telefonata al museo.

#### Priorita BASSA (missing-attr)

4. **§2 r4** — "Lisbona ha 7 colline come Roma" → aggiungere riferimento o riformulare come "secondo tradizione popolare".

### Frontmatter da aggiornare

\`\`\`yaml
fact_check_at: YYYY-MM-DD
fact_check_status: needs-fix
fact_check_stale: 2
fact_check_unverified: 3
fact_check_risk: 1
\`\`\`

### Prossimo passo

→ `travellini-editorial-writer` applica le correzioni dei claim stale/risk
→ Re-run `/verify-facts` per validare le correzioni
→ Poi `travellini-quality-auditor` per gate finale
```

## Esempio rapido di scoperta

Claim nell'articolo: "Il biglietto del Castello Sforzesco costa 5€ e si entra gratis la prima domenica del mese."

Verifica:

- Sito ufficiale Castello Sforzesco → biglietto 5€ ✓
- Prima domenica gratis → confermato per musei statali, MA Castello Sforzesco è civico → la regola statale NON si applica. Il claim è `stale` o `risk`.

Output: flaggare per riformulare come "ingresso gratuito alcuni giorni l'anno — verificare calendario civico".

## Skill correlate

- `/anti-ai-slop` — lascia flag `[VERIFY: ...]` che questa skill risolve
- `/seo-check` — controlla data structured, ma non verifica i dati interni
- `/ai-seo` — chiede claim citabili; questa skill assicura che siano VERI
- `travellini-editorial-writer` — applica le correzioni dopo il report
- `travellini-quality-auditor` — gate finale che legge `fact_check_status: clean`

## Project context

- `AGENTS.md` — root operating guide and skill routing.
- `CLAUDE.md` — Claude-specific rules, quality bar, and model routing.
- `docs/MARKETING_OPERATIONS_HUB.md` — funnel state, KPIs, analytics contract, partner pipeline.
- `src/data/articles/` — seed articoli
- `docs/13_Content/ARTICLE_*.md` — vault source of truth
- `public/lead-magnet-posti-italiani.pdf` — lead magnet sorgente
- `docs/14_Bugs/` — log eventuali "fact bug" gia segnalati
- `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md` — promessa di affidabilita al lettore
