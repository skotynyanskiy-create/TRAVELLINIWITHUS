---
name: anti-ai-slop
description: Rifinisce testi italiani lunghi (pillar article, lead magnet, newsletter, About) togliendo i pattern AI-generated tipici — ritmo monotono, transizioni cliché, elenchi rigidi, superlativi vuoti, generalita. Mantiene voce Rodrigo & Betta. Usa DOPO l'editorial-writer su qualsiasi draft >800 parole, o quando l'utente dice "rifinisci", "togli sapore AI", "rifinitura editoriale", "humanize".
---

# /anti-ai-slop — Rifinitura anti-pattern AI

Passo di rifinitura per testi lunghi prodotti da agent o da Claude in pipeline editorial. Non genera contenuto nuovo: ripulisce.

Si applica quando il contenuto è gia stato strutturato (`travellini-editorial-writer` ha consegnato la prima stesura). Si applica PRIMA di `quality-auditor` finale e PRIMA del freeze articolo.

## Quando attivare

- Pillar article >1500 parole appena consegnato da `travellini-editorial-writer`
- Body lead magnet PDF prima dell'export
- Newsletter long-form (>400 parole)
- Pagine editoriali tipo About / ChiSiamo / Manifesto
- Quando l'utente dice "rifinisci", "humanize questo", "rendi meno AI", "smooth il testo"

## Quando NON attivare

- Copy corto (hero, CTA, meta) → usa `/copywriting-italian`
- Caption social Instagram → l'agent social-operator gia produce nel tono giusto
- Testi tecnici (TOS, privacy, FAQ funzionali) — la "voce AI" qui non è un problema

## Pattern AI da rimuovere (italiano-specific)

### Ritmo

| Sintomo                                               | Fix                                                 |
| ----------------------------------------------------- | --------------------------------------------------- |
| Tre frasi consecutive stessa lunghezza (15-20 parole) | Spezzare: una lunga, una corta, una media           |
| Apertura paragrafo sempre con soggetto + verbo        | Variare: avverbiale, frase nominale, domanda        |
| Elenchi puntati con item della stessa forma           | Mescolare lunghezza/struttura o sciogliere in prosa |

### Lessico vietato

- "Nel cuore di" / "Nel cuore pulsante"
- "Un'esperienza unica" / "Un viaggio indimenticabile"
- "Tra storia e modernita"
- "Una cornice mozzafiato"
- "Lasciati conquistare da" / "Lasciati avvolgere da"
- "Non potrai resistere a"
- "Il piatto forte" come metafora
- "Imperdibile" / "must-see" / "must-do"
- "Vale la pena" (uso eccessivo: max 1 per articolo)
- "Sicuramente" / "certamente" come riempitivo
- "In definitiva" / "in conclusione" / "per concludere" come chiusura
- "Inoltre" / "in aggiunta" / "altresi" come connettore

### Transizioni AI

| Cliché                       | Sostituire con                                           |
| ---------------------------- | -------------------------------------------------------- |
| "Inoltre, ..."               | Stacco di frase, o dettaglio concreto che lega           |
| "Tuttavia, ..."              | "Eppure", "Solo che", inizio frase con dato contrastante |
| "D'altra parte, ..."         | Sciogliere nella frase precedente                        |
| "E non finisce qui"          | Tagliare. Mai.                                           |
| "Ma c'e di piu"              | Tagliare. Mai.                                           |
| "Ora che abbiamo visto X..." | Tagliare il meta-commento, passare al punto              |

### Struttura

- **NO** "In questo articolo scopriremo..." → entra direttamente nella scena/dato
- **NO** ricapitolazione finale che riassume cosa hai gia detto
- **NO** elenchi numerati per concetti che potrebbero essere prosa (max 1 elenco per sezione)
- **NO** sezioni "Bonus tip" / "Pro tip" tipiche del blogging US tradotto
- **NO** ogni sezione che apre con domanda retorica ("Vi siete mai chiesti...?")

### Generalita (il piu importante)

Travellini campa di **specificita**. Ogni paragrafo deve avere almeno un dato verificabile:

- nome luogo + quartiere
- prezzo con valuta + anno di rilevazione
- distanza/tempo concreto
- nome ristorante, hotel, partner — non "un buon ristorante locale"
- mese/stagione specifica — non "in alta stagione"

Se un paragrafo non ha alcun dato concreto, va riscritto o tagliato.

## Pipeline

1. **Leggi il draft** dal path indicato (`src/data/articles/[slug].seed.ts` o `docs/13_Content/ARTICLE_*.md` o `public/lead-magnet-*.pdf` sorgente).
2. **Identifica pattern** percorrendo le checklist sopra. Annota line:section + tipo di pattern.
3. **Rewrite paragraph-by-paragraph**, non whole-file. Mostra diff per ogni paragrafo modificato.
4. **Verifica preservazione fatti**: nessun dato concreto (nome, prezzo, distanza) deve essere alterato. Se un dato è incerto, **non inventare** — flaggare come `[VERIFY: dato originale]`.
5. **Variazione cadenza**: dopo rewrite, verifica che la sequenza di lunghezze frase nei primi 3 paragrafi non sia monotona.
6. **Output**: diff structured + sommario pattern rimossi.

## Vincoli duri

- **Mai inventare fatti.** Se il draft dice "Lisbona ha 50 funicolari", non aggiungere "secondo la guida ufficiale". Se è incerto, marcare `[VERIFY]`.
- **Mai cambiare struttura H2/H3.** Solo prosa.
- **Mai cambiare la tesi.** Se il pillar dice "Salento ad agosto è scomodo ma vale", non addolcire in "Salento ad agosto ha pro e contro".
- **Mai inserire emoji** nelle pagine pubbliche (regola brand globale).
- **Italiano caldo + diretto + specifico** (vedi `brand_voice.md` memory).

## Output template

```markdown
## Pattern AI trovati

| Riga / sezione | Pattern                          | Fix applicato                      |
| -------------- | -------------------------------- | ---------------------------------- |
| §2 r3          | "Nel cuore pulsante di Lisbona"  | "A meta tra Alfama e Mouraria"     |
| §4 r1          | Ritmo monotono 3 frasi 18 parole | Spezzato: 22 / 8 / 15              |
| §5 r2          | "In definitiva" come chiusura    | Tagliato + ultima frase rinforzata |

## Specificita aggiunta o richiesta

- §3 menzionava "un buon ristorante locale" → flaggato `[VERIFY: nome ristorante]`
- §6 menzionava "in alta stagione" → suggerito "tra giugno e settembre"

## Rewrite per paragrafo

### §2 (originale)

[testo originale 80 parole]

### §2 (rifinito)

[testo rifinito stessa lunghezza ± 10%]

### §4 (originale)

...

### §4 (rifinito)

...

## Diff sommario

- Paragrafi modificati: 6 su 14
- Frasi tagliate (cliché): 8
- Frasi riscritte (ritmo): 11
- Flag [VERIFY] aperti: 2
- Specificita aggiunta: 0 (preservato originale; aperto un flag)

## Prossimo passo consigliato

→ `/verify-facts <path>` per risolvere i `[VERIFY]` flag
→ Poi `travellini-quality-auditor` per gate finale
```

## Esempi rapidi

### Prima

> Lisbona è una città che ti conquista al primo sguardo. Nel cuore pulsante della capitale portoghese, tra storia e modernità, troverai esperienze uniche e indimenticabili. Inoltre, la sua atmosfera vibrante e i suoi quartieri caratteristici sapranno conquistarti. In definitiva, un viaggio a Lisbona è sicuramente qualcosa che vale la pena fare.

### Dopo

> Lisbona si lascia camminare. Tre giorni bastano appena: Alfama al mattino quando la luce taglia i muri gialli, Belém nel pomeriggio se il vento dal Tago non è troppo, e la sera i tavoli fuori in Bairro Alto fino a tardi. Le funicolari costano 3,80€ a corsa, ma dopo due salite a piedi capirete perche.

(Variazione cadenza, dati concreti, taglio cliché.)

## Skill correlate

- `/verify-facts` — risolve i flag `[VERIFY]` aperti
- `/copywriting-italian` — per copy CORTO (hero/CTA/meta), non per rifinire long-form
- `travellini-editorial-writer` — produce la prima stesura (questo skill arriva dopo)
- `travellini-quality-auditor` — gate finale dopo rifinitura

## Project context

- `CLAUDE.md` — quality bar e routing
- `brand_voice.md` (memory) — tono Rodrigo & Betta
- `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md` — positioning e audience
- `docs/13_Content/` — vault articoli con frontmatter status
