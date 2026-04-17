---
name: audit-browser
description: Full real-browser audit of the TRAVELLINIWITHUS site using Playwright MCP. Checks homepage, navigation, hero, CTAs, responsive, console errors, and key pages.
agent: browser-auditor
---

# /audit-browser

Usa il browser-auditor con Playwright MCP per auditare il sito reale.

**Scope**: $ARGUMENTS (se vuoto: audit completo homepage + nav + mobile)

## Procedura standard

1. Apri `http://localhost:3000` (dev server deve essere in esecuzione)
2. Homepage: above-the-fold, h1, hero, CTA principale, nav
3. Mobile (375px): stacking, leggibilità, CTA, overflow orizzontale
4. Pagine chiave: `/destinazioni`, `/collaborazioni`, `/media-kit`, `/contatti`
5. Errori console in ogni pagina
6. Link rotti o immagini mancanti visibili

## Output

Lista problemi per severità:
- **BLOCKER**: layout rotto, pagina inaccessibile, overflow grave
- **SERIO**: CTA non visibile, testo illeggibile mobile, immagine mancante
- **MINORE**: spaziatura incoerente, copy migliorabile

Per ogni problema: route + componente probabile + fix consigliato.
