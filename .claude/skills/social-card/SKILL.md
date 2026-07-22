---
name: social-card
description: Genera OG image per pagina o articolo TRAVELLINIWITHUS — 1200x630, brand-coherent, italiano. Usa quando l'utente dice "OG image", "social card", "preview link", "card per Instagram/Twitter".
---

# Social Card Generator — Travelliniwithus

Genera Open Graph image / Twitter Card brand-coherent per condivisioni social.

## Quando attivare

- "Crea OG image per articolo X"
- "Social card della homepage"
- "Preview link Instagram"
- Quando nuovo articolo/pagina pubblicato

## Specifiche tecniche

| Property        | Valore                      |
| --------------- | --------------------------- |
| Dimensioni      | 1200 x 630 px (OG standard) |
| Formato         | WebP (fallback PNG)         |
| Peso target     | < 300 KB                    |
| Aspect ratio    | 1.91:1                      |
| Safe zone testo | margine 60px                |

## Vincoli brand (da `DESIGN.md` + `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`)

- Palette: sand / ink / accent caldo, NO blu corporate
- Tipografia: serif-led per titolo, sans per metadata
- Foto: priorità a foto autentiche Rodrigo & Betta; fallback Unsplash brand-coherent
- Logo: bottom-right o top-left, restrained
- Testo: 1 frase forte (max 8-10 parole), in italiano

## Pipeline

1. **Identifica contesto**:
   - Articolo: titolo + categoria + hero image
   - Pagina statica: titolo + sottotitolo + immagine brand
2. **Brief 1 riga**: cosa deve comunicare la card
3. **Genera via**:
   - **Opzione A** (consigliata): script Node con `sharp` + composizione SVG → file in `public/og/<slug>.webp`
   - **Opzione B**: Canva MCP via `mcp__claude_ai_Canva__generate-design`
   - **Opzione C**: Figma MCP via `mcp__claude_ai_Figma__create_new_file` (per design system più rigoroso)
4. **Layout standard**:
   - Hero image full bleed con overlay scuro 40-60%
   - Titolo in serif bianco/sand, font-size ~64-72px
   - Eyebrow categoria sopra titolo, sans uppercase 14px
   - Logo `travelliniwithus` bottom-right
5. **Output**: file in `public/og/<slug>.webp` + update meta tag nella pagina:
   ```tsx
   <SEO ogImage="/og/<slug>.webp" />
   ```

## Template SVG di partenza

Layout standard (per script sharp):

```
+----------------------------------+
|  [HERO IMAGE FULL BLEED]         |
|  [OVERLAY scuro 50%]             |
|                                  |
|  EYEBROW (categoria)             |
|  Titolo grande serif             |
|  (max 2 righe)                   |
|                                  |
|              [logo bottom-right] |
+----------------------------------+
```

## Vincoli

- NO gradient blob / orbs / glitch effects
- NO emoji nel testo
- NO testo inglese
- Massimo 1 immagine + 1 titolo + 1 eyebrow + 1 logo
- Mai sovraccarico visivo: respiro è premium

## Output

- File salvato in `public/og/<slug>.webp`
- Meta tag aggiornato nella route corrispondente via `<SEO>` component
- Verifica preview con: `https://www.opengraph.xyz/url/https://travelliniwithus.it/<route>`

## Skill correlate

- `/new-article` può chiamare social-card automaticamente
- `/seo-check` verifica presenza OG image
- `travellini-stitch-figma-bridge` per design system OG ufficiale

## Project context

Before applying this skill, anchor in the local operating system:

- `AGENTS.md` — root operating guide and skill routing.
- `CLAUDE.md` — Claude-specific rules, quality bar, and model routing.
- `DESIGN.md` — design tokens, palette, typography and component conventions.
- `docs/` — the Obsidian-style operational vault; treat it as source of truth.
- `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md` — brand positioning, audience, tone.
- `docs/MARKETING_OPERATIONS_HUB.md` — funnel state, KPIs, analytics contract, partner pipeline.
- `docs/AI_AGENT_STACK.md` — current skills, agents, MCP policy.

Every finding must respect Italian public copy, premium editorial tone, and the release readiness gate documented in `docs/10_Projects/PROJECT_RELEASE_READINESS.md`.
