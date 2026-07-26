---
title: HANDOFF_editorial-primitives-v1_ui-designer_to_frontend-builder
status: consumed
consumed_at: 2026-05-18
consumed_by: travellini-frontend-builder
created: 2026-05-18
from: travellini-ui-designer
to: travellini-frontend-builder
slug: editorial-primitives-v1
expires: 2026-06-01
type: handoff
area: workspace
---

# Handoff: 5 primitive editoriali per template articolo

## Why this work matters

Il polish chirurgico (PROJECT_ARTICLE_DESTINATION_POLISH, shipped 2026-05-18) ha portato il template articolo a un livello "Medium-tier pulito". Per saltare a "rivista premium" (Atlantic / NYT Magazine / Conde Nast Traveler) servono primitive editoriali che facciano respirare il long-form: una lettera capitale, una citazione che ferma lo scroll, una foto che esce dal container, didascalie tipografiche, un blocco fonte verificabile. Sono opt-in, non auto-applicate, e devono integrarsi nella pipeline `ReactMarkdown + remarkGfm` esistente senza rompere i 30+ articoli demo e il pillar Salento.

## Decisions already made

Stack confermato:

- `react-markdown@10.1.0` + `remark-gfm@4.0.1`. Nessun `remark-directive` installato.
- Container body articolo: `max-w-6xl px-5 md:px-8`. Sopra `xl` la colonna body convive con sidebar 320px → larghezza utile ~720-760px. Sotto `xl` la colonna body occupa l'intero container (~1120px max).
- Font serif unico = **Fraunces** (`--font-serif`).
- Palette lockata: `--color-ink`, `--color-ink-2`, `--color-muted-fg`, `--color-accent`, `--color-accent-text`, `--color-sand`, `--color-surface`, `--color-border`.

### Decisione strutturale chiave

**Aggiungere `remark-directive`** (~6KB gzipped) come unico nuovo plugin. Risolve in modo pulito P2/P3/P5 con sintassi consistente `:::name ... :::`. P1 e P4 NON richiedono directive.

### Regola d'oro

Le 5 primitive sono **opt-in al 100%**. Un articolo che non le usa renderizza identico a oggi.

## Output target

- 5 nuovi componenti in `src/components/article/editorial/`:
  - `DropCap.tsx`
  - `PullQuote.tsx`
  - `FullBleedFigure.tsx`
  - `InlineFigure.tsx`
  - `SourceBlock.tsx`
- Modifiche minime a `ArticleBody` in [src/pages/Articolo.tsx](../../src/pages/Articolo.tsx).

---

## A. Direzione visiva per ogni primitiva

### P1 — DropCap

**Trigger:** automatico sul primo `<p>` del body markdown SE >= 280 caratteri. Nessuna sintassi: trattamento tipografico del template.

**Visuale:**

- Font Fraunces 500, color `var(--color-ink)`, size `4.5em` desktop / `3.5em` mobile.
- Line-height `0.85`, margin `mr-3 md:mr-4 mt-1`, `float: left`.
- Solo prima lettera; salta virgolette di apertura; include numeri.

**Componente:** `<DropCap firstChar rest />`.

### P2 — PullQuote

**Sintassi:**

```
:::pullquote
Frase estratta.
— Rodrigo, settembre 2025
:::
```

Attribuzione opzionale come ultima riga con prefisso `—`.

**Visuale:**

- Larghezza: full body column, NO float.
- Font Fraunces italic, weight 400, `text-3xl md:text-4xl`, mobile `text-2xl`.
- Color `var(--color-ink)`, line-height `1.25`, text-left.
- Marker: `border-l-2 border-[var(--color-accent)] pl-6 md:pl-8` (riusa il vocabolario del lead "In breve").
- Niente virgolette decorative giganti.
- My `my-12 md:my-16`.

**Componente:** `<PullQuote attribution?>{children}</PullQuote>`.

### P3 — FullBleedFigure

**Sintassi:**

```
:::fullbleed
![alt accessibile](url.avif "Caption | Foto: Rodrigo Trav.")
:::
```

**Visuale:**

- Larghezza: `w-screen max-w-[1600px] mx-[calc(50%-50vw)]` (break-out classico, cap 1600px).
- Aspect: `16/9` default, override prop `ratio`.
- `my-16 md:my-20`. Border-radius 0. `object-cover`. `loading="lazy"`. `width`+`height` obbligatori (CLS=0).
- Sopra `xl`: **disattivato** (`xl:max-w-full xl:mx-0`). La sidebar resta visibile durante scroll, full-bleed sotto sidebar sembra glitch.
- Sotto `xl`: full-bleed effettivo.

**Caption + Credit:**

- Container `mx-auto max-w-3xl px-5 md:px-8 mt-4`. NON full-bleed, allineato alla colonna body.
- Caption: `font-serif italic text-[15px] md:text-base leading-[1.5] text-[var(--color-ink-2)]`.
- Credit: separator `·`, `text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted-fg)]`.
- Italiano: "Foto: Rodrigo Trav.".
- Reading mode: si degrada a inline figure.

**Componente:** `<FullBleedFigure src ratio? caption? credit? alt width height />`.

### P4 — InlineFigure

**Sintassi:** default per OGNI `![alt](url "title")` markdown. Override automatico dell'`img`.

Parsing `title`:

- `|` (pipe con spazi) → split caption / credit.
- Senza pipe → tutto caption.
- Vuoto → no figcaption.

**Visuale:**

- `<figure className="my-10 md:my-12">`.
- Img `rounded-[var(--radius-md)] w-full`, aspect mantenuto, `loading="lazy"`, `width`+`height` obbligatori.
- Caption `font-serif italic text-[14px] md:text-[15px] leading-[1.5] text-[var(--color-ink-2)] mt-3 max-w-prose`.
- Credit `text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted-fg)]`, separator `·`.

**Componente:** `<InlineFigure src alt caption? credit? width height />`.

### P5 — SourceBlock

**Sintassi:**

```
:::source{href="https://..." author="Istat" verified="true" date="2024"}
Il flusso turistico in Salento nel 2024 ha superato i 4.2M di arrivi.
:::
```

**Visuale (DISTINGUIBILE da P2):**

- Card `bg-[var(--color-sand)] border-l-2 border-[var(--color-accent)] rounded-r-[var(--radius-md)] p-5 md:p-6 my-10`.
- Top row: badge "FONTE" (`text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]`) + `<CheckCircle2 size={12}>` se `verified` + data opzionale tra parentesi.
- Body: `text-base leading-relaxed text-[var(--color-ink-2)]`. **NON italic, NON serif display.** Sans-serif (Inter) per ancorarlo a "dato verificabile" vs pull quote "voce narrativa".
- Footer: `— ${author}` `text-sm text-[var(--color-muted-fg)]`. Se `href`, link `text-[var(--color-accent-text)] hover:underline` + freccetta `↗` + `target="_blank" rel="noopener noreferrer"`.

**Componente:** `<SourceBlock href? author? verified? date?>{children}</SourceBlock>`.

---

## B. Implementation plan — ordine consigliato

**P4 → P1 → P3 → P2 → P5**

1. P4 (InlineFigure) — fondazione `<figure>+<figcaption>` per P3.
2. P1 (DropCap) — massima resa visiva immediata, automatico, rischio basso.
3. P3 (FullBleedFigure) — introduce `remark-directive`. Test 100vw su Windows scrollbar.
4. P2 (PullQuote) — directive gia' caricato, rischio basso.
5. P5 (SourceBlock) — coordinamento con `/verify-facts`.

**Gate dopo P1+P3+P4**: browser-auditor smoke test su 2 pillar.
**Gate finale**: `audit:ui` + `audit:visual` + `typecheck`.

---

## C. Salvaguardie

- Opt-in al 100%, no regressioni retro.
- Solo CSS vars + Fraunces esistenti. Zero nuovi token.
- Solo `remark-directive` come nuova dep (~6KB gz). Verificare bundle.
- Mobile/desktop pari priorita'. Test 375/768/1280/1920.
- Italiano: "FONTE", "Foto:", "—".
- Reading mode: P1+P2 funzionano; P3 si degrada inline.
- A11y: `<figure>+<figcaption>`, `alt` obbligatorio, `<aside>` per SourceBlock.

---

## D. Open questions per owner

1. **Drop cap automatico su tutti o solo pillar?** Direzione propone: automatico ovunque se p >= 280 char. Alternativa: solo se `readingTime >= 8 min`.
2. **Drop cap su numerali (`Nel 2024...`)?** Direzione propone: si'. Alternativa: skip e fallback paragrafo normale.
3. **FullBleed sopra xl: disattivato o sfora sotto sidebar?** Direzione propone: disattivato (no glitch). Alternativa: full-bleed comunque.
4. **SourceBlock verified — onore dell'autore o check di build?** Direzione propone: onore autore. Alternativa: pre-commit check con `verified-sources.json`.
5. **`remark-directive` ok?** Direzione propone si'. Alternativa zero-deps: parsing regex custom (sconsigliato).

---

## Next hand-off

- Next: `travellini-frontend-builder`
- Trigger: 5 open questions risposte.
- Dopo: `browser-auditor` → `quality-auditor` → `editorial-writer` per primo uso reale.

---

## NON in v1 (esplicito)

- Side-note / margin-note (Tufte). Sidebar `xl` ruba spazio.
- Diagrammi/mappe inline.
- Carousel immagini.
- Video embed.
- Footnote (`[^1]`). Rinviato a v2 dopo prova P5.
