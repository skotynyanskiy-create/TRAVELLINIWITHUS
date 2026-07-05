---
title: BUG — Statistiche "0K+" rilevate dal browser audit Playwright (FALSO POSITIVO)
status: done
priority: P3
type: bug
owner: skotxx
related-projects:
  - [[PROJECT_FULL_SITE_MARKETING_TECH_AUDIT]]
  - [[PROJECT_HOME_HERO_NAV_REFINEMENT]]
created: 2026-05-14
closed: 2026-05-14
discovered-via: browser-auditor Playwright audit 2026-05-14
resolved-via: visual screenshot review owner + code inspection
area: engineering
---

# BUG — Statistiche "0K+" — FALSO POSITIVO

## Esito

**CHIUSO — falso positivo.** Le statistiche reali sono presenti e funzionanti in homepage. Screenshot visivo dell'owner conferma: `500K+` reach / `167K+` IG / `90K+` TikTok / `150+` destinazioni vengono renderizzati correttamente.

## Cosa era stato rilevato dal browser-auditor

Il browser-auditor (Playwright MCP) ha riportato "0K+" follower / "0+" destinazioni in `/` e `/collaborazioni`. Conclusione iniziale: incoerenza con `/media-kit` e `/chi-siamo` che mostravano i numeri reali.

## Causa root del falso positivo

[src/components/home/HomeTrustStrip.tsx](../../src/components/home/HomeTrustStrip.tsx) usa [AnimatedCounter](../../src/components/AnimatedCounter.tsx) per renderizzare i numeri:

```tsx
// HomeTrustStrip.tsx:24-29
const TRUST_ITEMS: TrustItem[] = [
  { icon: Eye, numericValue: 500, suffix: 'K+', label: 'Pubblico mensile' },
  { icon: Instagram, numericValue: 167, suffix: 'K+', label: 'Follower Instagram' },
  { icon: Users, numericValue: 90, suffix: 'K+', label: 'Follower TikTok' },
  { icon: MapPin, numericValue: 150, suffix: '+', label: 'Destinazioni esplorate' },
];
```

`AnimatedCounter` usa `motion.useSpring` con trigger via `IntersectionObserver`: il componente parte da `0` e anima fino al `numericValue` SOLO quando entra nel viewport. Playwright `browser_snapshot` cattura il DOM in un singolo tick — se l'elemento non e' ancora entrato in viewport (o se l'animazione non ha ancora completato), il testo nel DOM e' `"0K+"`.

I valori reali sono gia' centralizzati in [src/config/site.ts:20-29](../../src/config/site.ts) come `BRAND_STATS`:

```ts
export const BRAND_STATS = {
  instagramFollowers: '167K+',
  tiktokFollowers: '90K+',
  engagementRate: '6.5%',
  monthlyReach: '500K+',
  postsPublished: '800+',
  destinationsExplored: '150+',
  yearsOfTravel: '8',
  totalFollowers: '250K+',
} as const;
```

`HomeTrustStrip` parsifica manualmente i valori da `BRAND_STATS` perche `AnimatedCounter` richiede `number`, non stringa formattata. **La fonte unica esiste gia'.**

## Implicazioni residue (non bloccanti)

Anche se non e' un bug di brand/trust, restano due osservazioni utili:

### Issue 1 — a11y screen reader

`AnimatedCounter` parte da `0` e anima al target. Uno screen reader che legge il DOM durante l'animazione puo' annunciare "0K+ pubblico mensile" prima di "500K+". **Priorita P3 a11y**, low impact (la maggior parte degli SR aspetta `aria-live` esplicito).

**Mitigazione opzionale:**

```tsx
<AnimatedCounter
  value={item.numericValue}
  suffix={item.suffix}
  aria-label={`${item.numericValue}${item.suffix} ${item.label}`}
  aria-live="off"
/>
```

### Issue 2 — automation friendliness

Playwright (e Lighthouse) catturano DOM prima dell'animazione → falsi positivi in CI/audit. **Priorita P2 tooling.**

**Mitigazione opzionale:**

- Aggiungere `data-animated-value={item.numericValue}` sul wrapper di AnimatedCounter. I test possono leggere il valore target indipendentemente dallo stato dell'animazione.
- Aggiungere `[data-test="trust-strip-ready"]` con flag che diventa `true` quando IntersectionObserver fire + animazione completa.

## Insegnamento per audit futuri

Quando il browser-auditor reporta numeri "0" o stringhe vuote in un blocco statistico, **verificare PRIMA** se il componente usa animazione + IntersectionObserver. Pattern comune nel codebase:

- `AnimatedCounter` (motion useSpring)
- `IntersectionObserver` su elementi above-fold ritardati

Aggiungere allo skill [`audit-browser`](../../.agents/skills/audit-browser/SKILL.md) una nota: "prima di reportare numeri zero, attendere `page.waitForFunction(() => !document.body.dataset.animating)` o scrollare l'elemento in viewport e attendere `1500ms`".

## Riferimenti

- [src/config/site.ts:20-29](../../src/config/site.ts)
- [src/components/home/HomeTrustStrip.tsx](../../src/components/home/HomeTrustStrip.tsx)
- [src/components/AnimatedCounter.tsx](../../src/components/AnimatedCounter.tsx)
- [docs/10_Projects/PROJECT_FULL_SITE_MARKETING_TECH_AUDIT.md](../10_Projects/PROJECT_FULL_SITE_MARKETING_TECH_AUDIT.md) sezione 5 #1 — aggiornata in stessa sessione
- Screenshot owner 2026-05-14 — homepage mostra valori finali animati correttamente
