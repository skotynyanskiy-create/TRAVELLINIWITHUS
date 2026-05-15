---
name: animate
description: Applica pattern motion premium a un componente TRAVELLINIWITHUS usando GSAP, motion (Framer), lenis, e wrapper esistenti (TiltCard, MagneticWrapper, AnimatedCounter). Usa quando l'utente chiede "anima questo", "aggiungi motion", "rendi piu vivo X", o vuole evolvere una sezione statica.
---

# Animate — Pattern motion Travelliniwithus

Aggiungere motion seguendo il DNA "cinematic ma trattenuto" definito in [[design-dna]].

## Quando attivare

- "Anima la hero"
- "Aggiungi micro-interazioni alle card"
- "Rendi il counter dinamico"
- "Smooth reveal della sezione X"

## Librerie disponibili (gia in package.json)

- **lenis** — smooth scroll globale (`SmoothScrollProvider` wrappa app)
- **GSAP** + `@gsap/react` — timeline complesse, ScrollTrigger, pin/parallax
- **motion** (Framer Motion v12) — micro-interazioni componenti, variants
- **embla-carousel-react** — carousel performante (gia usato in `LatestArticlesCarousel`)

## Wrapper pronti

- `TiltCard` — hover tilt 3D
- `MagneticWrapper` — magnetic hover su CTA
- `AnimatedCounter` — count-up numerico
- `ScrollProgressBar` — barra progresso scroll
- `motion.div` — variant fade-in standard

## Pipeline

1. **Identifica target** (componente o pagina)
2. **Definisci intent**: reveal, hover, parallax, count, transition?
3. **Scegli libreria**:
   - Single componente, micro-interazione → `motion`
   - Timeline / ScrollTrigger / pin → GSAP + `useGSAP`
   - Smooth scroll page-level → gia attivo via lenis, non duplicare
4. **Verifica vincoli [[design-dna]]**:
   - Motion trattenuto, MAI flashy
   - Nessun bounce esagerato, nessun rainbow
   - Durate: 200-600ms (UI), 800-1500ms (hero reveal)
   - Easing: `easeOutCubic`, `easeOutQuart`, mai `linear` salvo loop
5. **Performance**: rispetta `prefers-reduced-motion` (ALWAYS), evita layout thrash, preferisci `transform`/`opacity` solo.

## Pattern reference

### Fade-in al scroll (motion)

```tsx
import { motion } from 'motion/react';

<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-100px' }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
>
  {children}
</motion.div>;
```

### Hero parallax (GSAP)

```tsx
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

useGSAP(() => {
  gsap.to('.hero-bg', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', scrub: true },
  });
}, []);
```

### Magnetic CTA (wrapper esistente)

```tsx
<MagneticWrapper strength={0.4}>
  <Button variant="primary">Scopri</Button>
</MagneticWrapper>
```

## Vincoli

- `prefers-reduced-motion: reduce` -> motion disabilitata (gestire con `useReducedMotion()` di motion o check CSS).
- Mai animare > 3 elementi simultaneamente nello stesso viewport.
- Mai animare `height`/`width` -> usa `scaleY`/`scaleX`.
- Test su mobile reale (low-end) prima di approvare.

## Output

- Diff puntuale del componente con motion aggiunta
- Commento WHY solo se la motion segue una regola non-ovvia (es. "scrub: true perche allineato a lenis")
- Verifica con `npm run audit:visual` dopo l'edit

## Skill correlate

- `/cwv` dopo l'edit per verificare LCP/CLS non degradati
- `/audit-visual` per screenshot regression
- `travellini-ui-designer` per critique estetica

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
