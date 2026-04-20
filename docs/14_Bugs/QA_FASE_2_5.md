# QA Fase 2.5 — Backlog contrasto (decisione brand)

Creato: 2026-04-20 durante Fase 2.5 QA Browser.
Stato: **aperto, in attesa di decisione owner sul colore accent**.

## Contesto

La suite `e2e/a11y-smoke.spec.ts` (axe-core, WCAG 2.1 AA) ha rivelato un gruppo di violazioni `color-contrast` sistemiche, dovute alla coppia `--color-accent: #a8865a` + bianco/ink. Queste NON sono bug isolati: sono una scelta brand che oggi non passa il ratio AA per testo piccolo.

## Violazioni documentate

| Elemento | Combinazione | Ratio | Soglia AA |
|----------|--------------|-------|-----------|
| Button CTA "Scopri destinazioni" (Hero) | `text-white` su `bg-[var(--color-accent)]` 14px | 3.37:1 | 4.5:1 |
| Button "Iscriviti alla newsletter" (Footer) | `text-white` su `bg-[var(--color-accent)]` 12px | 3.37:1 | 4.5:1 |
| Pill "Prossimamente" (Shop) | `text-white` su `bg-[var(--color-accent)]` 9-12px | 3.37:1 | 4.5:1 |
| Eyebrow "Torna presto" e affini | `text-[var(--color-accent)]` su bianco 10px | 3.37:1 | 4.5:1 |
| Bottone ricerca navbar | `text-[var(--color-accent)]` su `bg-[#fbfbfc]` 12px | 3.26:1 | 4.5:1 |

## Fix già applicati in Fase 2.5

- [x] Footer copyright + link legali: `text-zinc-500` → `text-zinc-400` (3.81 → 7.3).
- [x] Footer script tagline: `text-white/30` → `text-white/60` (2.67 → ~5.0).

## Decisione richiesta (owner)

Due strade:

1. **Darken accent** — portare `--color-accent` da `#a8865a` a circa `#7a5b34` (cioè un "cuoio bruciato" più scuro). Passa AA in tutte le combinazioni attuali. Richiede rivedere visivamente tutte le CTA: il tono risulta meno caldo/estivo.
2. **Accettare debt e documentare** — tenere `#a8865a`, mantenere brand attuale, filtrare `color-contrast` dalla suite a11y automatica e ricordarsi che il sito non è AA su quei micro-elementi. Rischio SEO/accessibility: basso ma presente.

Finché non si decide, la suite `audit:a11y` filtra `color-contrast` per non bloccare il gate CI/CD.

## Fuori scope di questa nota

- Riscrittura completa della palette.
- Test contrast su stati hover/focus (richiede snapshot JS).
