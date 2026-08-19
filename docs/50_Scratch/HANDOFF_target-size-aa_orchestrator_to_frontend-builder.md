---
title: HANDOFF_target-size-aa_orchestrator_to_frontend-builder
status: consumed
created: 2026-08-15
from: travellini-orchestrator
to: travellini-frontend-builder
slug: target-size-aa
expires: 2026-08-29
type: handoff
area: delivery
---

> **Consumed 2026-08-17.** Superato da un incarico più ampio, guidato dal
> cancello meccanico `e2e/rotte-target-e-overflow.spec.ts` (20 rotte × 4
> larghezze), non dai quattro casi elencati sotto a mano. I quattro sono stati
> corretti insieme a ~25 altri controlli reali (footer email, «Tutti sulla
> mappa», etichette luogo, «Dettagli» su `/shop`, ecc.) più tre salti di
> gerarchia titoli emersi durante la verifica (`/contatti`, `/itinerari`,
> `/media-kit`). Dettaglio completo nella risposta finale della sessione, non
> ripetuto qui.

# Handoff: quattro bersagli di tocco sotto WCAG 2.5.8 AA

> **Binario parallelo.** Non dipende dal lavoro sulla scheda posto e non lo blocca.
> Commit separato. Non è un progetto: sono quattro correzioni misurate.

## Why this work matters

Quattro controlli su superfici pubbliche sono sotto il minimo WCAG 2.5.8 AA
(24×24 CSS px). Misurati in browser reale a 375px il 2026-08-15. Sono piccoli,
sicuri e verificabili: si chiudono in una sessione corta e non vanno gonfiati.

L'a11y è un gate CI bloccante (≥ 0,95), quindi questo lavoro difende un gate che
già esiste.

## Decisions already made (NON rilitigare)

- **La soglia è 24×24 (WCAG 2.5.8 AA), non 44.** La convenzione 44px che il codice
  applica in navbar è più severa dello standard: dove il controllo è già ≥ 24 ma
  < 44, **non è un difetto di accessibilità** ed entra in una decisione separata
  (vedi sotto).
- **Nessun redesign.** Si aumenta l'area di tocco. Non si cambia gerarchia,
  colore, posizione o copy.
- Il DNA di brand resta. Il linguaggio visivo non si tocca.

## Context the receiver needs

### I quattro difetti reali — sotto 24×24, da correggere

| Controllo                        | Misurato | File                                                                                |
| -------------------------------- | -------- | ----------------------------------------------------------------------------------- |
| «Vedi tutte le destinazioni»     | 327×16   | `src/components/home/curated/CleanFeaturedGrid.tsx:110` **e** `CleanFeaturedPlaces.tsx:75` |
| «Vai alla mappa»                 | 154×16   | `src/components/home/cinematic/BrandCoherentHero.tsx:170`                           |
| Breadcrumb «Home» (icona sola)   | 14×14    | `src/components/Breadcrumbs.tsx:69-70` — `<Home size={14} />` + `sr-only`            |
| Breadcrumb «Esplora»             | 64×17    | `src/components/Breadcrumbs.tsx:90`                                                 |

Nota: «Vedi tutte le destinazioni» esiste in **due** componenti. Correggerne uno
solo lascia il difetto vivo sull'altra composizione della home.

`Breadcrumbs.tsx` è condiviso: la correzione vale su tutte le pagine che lo usano,
scheda posto compresa. È un vantaggio, ma verifica di non spostare il layout altrove.

### Quello che NON è un difetto AA — decisione, non correzione

Questi passano 2.5.8 AA e falliscono solo la convenzione interna dei 44px:

- Frecce del carosello reel, **36×36** —
  `src/components/home/cinematic/HiggsfieldReelCarousel.tsx:214` e `:222`
- «Provato — apri la scheda», **281×34** — `BrandCoherentHero.tsx:207`

E il pattern 36×36 **non è isolato**: compare anche in
`src/components/content/ContentCard.tsx:51`, `src/components/discovery/ArchiveCard.tsx:69`,
`src/components/LeadMagnetCover.tsx:48` e quattro volte in
`src/components/article/ShareButtons.tsx:27,37,47,57`.

Quindi «alzare le frecce a 44» non è una correzione locale: è **cambiare una
convenzione in almeno otto punti**. Se lo si fa, si fa ovunque o si crea
incoerenza. **Non farlo in questo handoff.** Portalo all'owner come domanda.

## What the receiver should produce

- I quattro controlli portati **almeno a 24×24 CSS px** di area di tocco, senza
  cambiare l'aspetto: padding, `min-h`, o area cliccabile estesa — non un bottone
  più grande a schermo se il design non lo prevede.
- Verifica in browser reale a 375px con **le misure prima e dopo**. Lo screenshot
  qui fallisce («pane not displayed»): usa probe JS di geometria.
- Controllo che nessun layout si sposti: `Breadcrumbs.tsx` è condiviso e la home ha
  già una composizione verificata.
- `npm run typecheck` e `npm run audit:ui` verdi.
- **Commit separato**, non mescolato al lavoro sulla scheda posto.

## Out of scope (do NOT touch)

- Le frecce 36×36 e il bottone 281×34: passano AA, sono una decisione dell'owner.
- Qualunque modifica di copy, colore, gerarchia o posizione.
- La composizione della home, la lunghezza della pagina, la `griglia-posti`.
- La scheda posto oltre l'effetto condiviso di `Breadcrumbs.tsx`.
- `server.ts`, `firestore.rules`, `src/config/admin.ts`.

## Open questions / decisions for the user

- **La convenzione 44px**: vale ovunque o solo in navbar? Oggi il repo la applica in
  navbar e non altrove, in almeno otto punti. Non è un bug — è una convenzione mai
  estesa. L'owner decide se estenderla, e in quel caso diventa un lavoro suo, con
  il suo handoff.

## Next hand-off

- Next agent: `browser-auditor` per la ri-misura, se l'owner la vuole indipendente.
  Altrimenti nessuno: la verifica la fai tu e la mostri.
- Trigger: quattro controlli ≥ 24×24 misurati a 375px.

## Notes

Il working tree aveva 67 file modificati al 2026-08-15. Verifica lo stato del branch
prima di partire e stagia per percorso: **mai `git add -A` su questo albero.**
