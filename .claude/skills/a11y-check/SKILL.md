---
name: a11y-check
description: Audit accessibilita WCAG AA per TRAVELLINIWITHUS via Playwright accessibility tree — contrasto colori, alt text, focus visibile, aria label, keyboard navigation. Usa quando l'utente dice "a11y", "accessibilita", "WCAG", "screen reader".
---

# Accessibility Check — Travelliniwithus

Audit WCAG 2.1 AA su una rotta. Usa Playwright accessibility snapshot + checks manuali.

## Quando attivare

- "Verifica a11y di /collaborazioni"
- "WCAG sul form contatti"
- "Controlla i contrasti della homepage"
- Pre-deploy di pagina pubblica nuova

## Standard target (WCAG AA)

| Criterio                      | Soglia                                        |
| ----------------------------- | --------------------------------------------- |
| Contrasto testo normale       | 4.5:1                                         |
| Contrasto testo large (18px+) | 3:1                                           |
| Contrasto UI/icone            | 3:1                                           |
| Touch target mobile           | min 44x44px                                   |
| Focus visible                 | sempre, mai `outline: none` senza alternativa |
| Alt text immagini contenuto   | obbligatorio                                  |
| Lang attribute                | `lang="it"` su `<html>`                       |
| Keyboard navigation           | tutto raggiungibile via Tab                   |

## Pipeline

1. **Naviga alla pagina** (`mcp__playwright__browser_navigate`)
2. **Accessibility snapshot** (`mcp__playwright__browser_snapshot`) → restituisce ARIA tree
3. **Verifica esplicita**:
   - Esattamente 1 `h1`
   - Heading hierarchy senza salti (H1 → H2 → H3, no H1 → H4)
   - Tutti i bottoni hanno testo o `aria-label`
   - Tutti i link hanno testo significativo (non "clicca qui")
   - Tutte le immagini contenuto hanno `alt`; decorative hanno `alt=""`
   - Form fields hanno `<label>` o `aria-labelledby`
   - Color contrast su testo principale (eval CSS)
   - Focus order logico via Tab simulation
4. **Keyboard test** (`mcp__playwright__browser_press_key`):
   - Tab → primo focus su skip-link o nav?
   - Enter su CTA primario → naviga/submit?
   - Esc su modale → chiude?
5. **Lang attribute check**:
   - HTML root deve avere `lang="it"`
   - Eventuali sezioni in altre lingue con `lang="..."` esplicito

## Output template

```markdown
## Pagina auditata

URL: [url]

## Checklist WCAG AA

| Check             | Status  | Note                         |
| ----------------- | ------- | ---------------------------- |
| Single h1         | ok/fail |                              |
| Heading hierarchy | ok/fail |                              |
| Alt text          | ok/fail | [N immagini senza alt]       |
| Button labels     | ok/fail | [N bottoni senza testo/aria] |
| Link labels       | ok/fail |                              |
| Form labels       | ok/fail |                              |
| Color contrast    | ok/fail | [punti critici]              |
| Focus visible     | ok/fail |                              |
| Keyboard nav      | ok/fail |                              |
| Lang attribute    | ok/fail |                              |
| Touch target 44px | ok/fail |                              |

## Issue trovati

1. [file:line] - problema - fix suggerito
   ...

## Verdict

[pass / warn / fail]
```

## Fix comuni nel repo

- Alt mancante → usa `OptimizedImage` con prop `alt` obbligatoria
- Bottone icon-only senza label → aggiungi `aria-label="Apri menu"` etc.
- Contrasto scarso → check CSS vars, usa `--text-primary` su `--bg-primary` (gia conformi WCAG AA)
- `outline: none` → sostituisci con `focus-visible:ring-2 ring-offset-2`
- Form senza label → aggiungi `<label htmlFor>` o `aria-label`

## Skill correlate

- `/audit-ui` include check a11y a livello statico (CSS vars, alt)
- `/responsive-check` per touch target mobile
- `npm run audit:ui` per audit script-based
