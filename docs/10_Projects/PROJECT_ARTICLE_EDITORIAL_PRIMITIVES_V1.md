---
title: PROJECT_ARTICLE_EDITORIAL_PRIMITIVES_V1
status: shipped
started: 2026-05-18
shipped: 2026-05-18
slug: editorial-primitives-v1
owner: Rodrigo
type: editorial-tooling
risk: low
---

# Primitive editoriali v1 — DropCap, PullQuote, FullBleedFigure, InlineFigure, SourceBlock

## Obiettivo

Portare il template articolo da "Medium-tier pulito" (post polish chirurgico [PROJECT_ARTICLE_DESTINATION_POLISH](PROJECT_ARTICLE_DESTINATION_POLISH.md)) a "rivista premium" introducendo 5 primitive editoriali opt-in.

## Sequenza eseguita

1. **travellini-ui-designer** — direzione visiva ([HANDOFF status: consumed](../50_Scratch/HANDOFF_editorial-primitives-v1_ui-designer_to_frontend-builder.md))
2. Owner conferma 3 open questions critiche (DropCap scope, FullBleed sopra xl, remark-directive si/no) sui default raccomandati
3. **travellini-frontend-builder** — implementazione P4 → P1 → P3 → P2 → P5
4. **browser-auditor** — smoke test: `clean`, zero regressioni
5. `typecheck` + `audit:ui` + `vitest` tutti verdi

## Decisioni lockate

- **DropCap automatico** su tutti gli articoli se primo paragrafo body markdown >= 280 char. Include numerali.
- **FullBleed disattivato sopra `xl` (1280px)**: sotto xl full-bleed effettivo, sopra xl inline con border-radius (no glitch sotto sidebar).
- **SourceBlock `verified`**: onore dell'autore, no check di build.
- **remark-directive** introdotto come unica nuova dipendenza (~6KB gz).
- Tutte le primitive sono **opt-in al 100%**: articoli che non le usano renderizzano identici a pre-v1.

## File creati

- [src/components/article/editorial/DropCap.tsx](../../src/components/article/editorial/DropCap.tsx)
- [src/components/article/editorial/InlineFigure.tsx](../../src/components/article/editorial/InlineFigure.tsx)
- [src/components/article/editorial/FullBleedFigure.tsx](../../src/components/article/editorial/FullBleedFigure.tsx)
- [src/components/article/editorial/PullQuote.tsx](../../src/components/article/editorial/PullQuote.tsx)
- [src/components/article/editorial/SourceBlock.tsx](../../src/components/article/editorial/SourceBlock.tsx)

## File modificati

- [src/pages/Articolo.tsx](../../src/pages/Articolo.tsx) — import `remarkDirective` + 5 componenti, inline plugin `remarkEditorialDirectives`, estensione `components` map del `ReactMarkdown` per: DropCap automatico sul primo `<p>` con counter, InlineFigure su `img`, gestione directive `pullquote` / `fullbleed` / `source`.
- [src/index.css](../../src/index.css) — utility `.drop-cap` (responsive 3.5em mobile / 4.5em desktop), rimossa la regola CSS `::first-letter` precedente.

## Dipendenze

- `remark-directive@4.0.0` (installato con `--legacy-peer-deps` per peer conflict con `react-simple-maps@3`, pattern gia' usato nel repo).

## Sintassi markdown (cheat sheet per editorial-writer)

### DropCap (automatico)

Nessuna sintassi. Si applica automaticamente al primo paragrafo del body se >= 280 caratteri. Se vuoi attivarlo, scrivi un primo paragrafo narrativo lungo invece di un riassunto breve.

### InlineFigure (automatico su tutte le immagini)

```markdown
![alt accessibile](url.avif 'Caption visibile | Foto: Rodrigo Trav.')
```

Il `title` markdown viene parsato:

- `|` (pipe con spazi) → split in caption + credit
- Senza pipe → tutto e' caption
- Vuoto → no figcaption (immagine nuda)

### PullQuote

```markdown
:::pullquote
La sera, dalle terrazze di Polignano, il mare cambia colore tre volte in dieci minuti.
— Rodrigo, settembre 2025
:::
```

Ultimo paragrafo che inizia con `—`, `--`, `–` diventa attribuzione automatica.

### FullBleedFigure

```markdown
:::fullbleed
![Tramonto sui faraglioni di Polignano](url.avif 'Polignano a Mare, sett. 2025 | Foto: Rodrigo Trav.')
:::
```

Immagine full-viewport sotto xl, inline sopra xl. Caption + credit derivati dal `title` (stesso parsing di InlineFigure).

### SourceBlock

```markdown
:::source{href="https://www.istat.it/..." author="Istat" verified="true" date="2024"}
Il flusso turistico in Salento nel 2024 ha superato i 4.2M di arrivi, +12% sul 2023.
:::
```

Attributi tutti opzionali tranne il body. `verified="true"` mostra check accent. `href` rende author cliccabile con `↗ target="_blank"`.

## Verifica

| Check                                                                                              | Risultato                                                                                                          |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `npm install remark-directive`                                                                     | OK (`--legacy-peer-deps`)                                                                                          |
| `npm run typecheck`                                                                                | Clean                                                                                                              |
| `npm run audit:ui`                                                                                 | +1 warning giustificato (inline `style={{aspectRatio}}` su FullBleedFigure — Tailwind non supporta valori runtime) |
| `vitest`                                                                                           | 10/10 pass                                                                                                         |
| Smoke browser 375 / 1280 su `/articolo/puglia-trulli-masserie` e `/articolo/salento-agosto-coppia` | Zero regressioni, zero errori console                                                                              |

## Limitazioni note

- **DropCap non visibile sugli articoli demo correnti** perche' usano `generateBody()` procedurale con primo paragrafo = `excerpt` (sempre < 280 char). Sara' visibile sul primo content reale lungo (Sessione 2 Puglia, prossimi pillar).
- **Reading mode** non parsa le directive: aprire un articolo con `:::fullbleed` in ReadingMode mostrera' il blocco come testo letterale. Accettato in v1 (reading mode = lettura concentrata, niente foto evento).
- **mdast type import** transitive: se `react-markdown` lo dedupe in futuro il typecheck puo' rompersi. Easy fix con declaration locale o `as any`.

## Lascito / next

- **Sessione 2 della roadmap "fai di meglio" — SHIPPED 2026-05-18**: body Puglia riscritto da editorial-writer (1850 parole), 5 primitive in azione su pillar reale, 4 bug post-audit fixati (`[VERIFY]` leak, hydration figure-in-p, DropCap non attivo, PullQuote attribution fusa) + separator spacing. Re-audit verdetto `ship`. Foto reali non ancora selezionate (Unsplash automatico fallito, scelta manuale Rodrigo posticipata): slot popolati con 2 SVG placeholder editoriali ([puglia-placeholder-43.svg](../../public/images/placeholders/puglia-placeholder-43.svg) + [puglia-placeholder-169.svg](../../public/images/placeholders/puglia-placeholder-169.svg)). Pillar Puglia renderizza end-to-end con DropCap, 3 InlineFigure, 2 FullBleedFigure, 1 PullQuote, 1 SourceBlock. Quando arrivano gli scatti reali R+B, sostituire i 5 path placeholder mantenendo alt + caption.
- **Sessione 2 — Bug fix shipped**: aggiunto `remark-unwrap-images` come dipendenza, plugin remark `markFirstBodyParagraph` per DropCap stateless, doppio percorso estrazione attribution in PullQuote (paragrafo dedicato + soft-break fallback).
- **Sessione 3**: template specializzato per categoria (Guida / Itinerario / Storia) — le primitive saranno parte del kit a disposizione per ogni variante.
- Misurazione effetto: una volta che 2+ articoli reali useranno 3+ primitive, raccogliere GA4 (time on page, scroll depth) pre/post e feedback editoriale per decidere v1.1 (refinement) o v2 (footnote, sidenote, carousel).
- Quality bar non aggiornato (le primitive sono opt-in, nessun articolo le usa ancora — quality bar live si misurera' a Sessione 2).

## Cheat sheet rapido per nuovi pillar

Per scrivere un pillar che sfrutta TUTTE le primitive:

1. Apri con un paragrafo narrativo di **>= 280 caratteri** → DropCap appare automatico.
2. Inserisci 1-2 immagini inline con `title` "Caption | Foto: X" → InlineFigure con figcaption.
3. Dopo ~600-800 parole, inserisci 1 `:::pullquote` con una frase chiave del pezzo.
4. Per la foto piu' forte del pezzo, usa `:::fullbleed` (massimo 2 per articolo).
5. Per ogni dato/statistica esterna, usa `:::source` con `href` + `author` + `verified="true"` se hai passato `/verify-facts`.
6. Mai 2 pull quote consecutive. Mai full-bleed nei primi 200 parole. Source block dove serve costruire trust, non a caso.
