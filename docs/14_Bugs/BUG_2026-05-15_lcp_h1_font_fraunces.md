---
type: bug
area: performance
severity: high
status: in-progress
priority: p0
owner: travellini-frontend-builder
opened: 2026-05-15
source: audit avanzato 2026-05-15 (perf-engineer)
tags:
  - bug
  - performance
  - cwv
  - lcp
  - fonts
---

# BUG_2026-05-15_lcp_h1_font_fraunces

## Sintesi

LCP misurato 4321 ms su dev server localhost mobile (375×667, no throttle) → equivalente ~6500-9000 ms su 4G mobile reale. Causa: LCP element identificato dal Chrome DevTools trace = **H1 text in Fraunces (`Posti particolari che valgono davvero.`)**, NON l'hero image. Render delay 3855 ms (89% del LCP totale).

Il commit `10d2a8e fix(site): WCAG AA 100/100 lighthouse + LCP hero preload` ha preloadato l'hero AVIF — fix per il problema sbagliato. Il vero collo di bottiglia è la catena font Google Fonts (HTML → CSS Google → 14 woff2 file in cascade).

## Posizione

- [index.html](../../index.html) — `<link href="...googleapis.com/css2?...&display=swap">` con 3 famiglie (Fraunces, Inter, Kalam)
- [src/index.css](../../src/index.css) — `@font-face` o `@import` Google Fonts
- [src/components/home/HeroSection.tsx:182](../../src/components/home/HeroSection.tsx) — H1 element
- [src/pages/Home.tsx:40-54](../../src/pages/Home.tsx) — preload hero AVIF (corretto ma non LCP-critical)

## Fix proposto

1. **Self-host Fraunces 400+500 woff2 subset latin** in `/public/fonts/`. Download da Google Fonts Helper (`gwfh.mranftl.com`) o npm `@fontsource/fraunces`.
2. Aggiungere `@font-face` self-host in `src/index.css` con `font-display: swap`.
3. Aggiungere `<link rel="preload" as="font" type="font/woff2" crossorigin>` in `index.html` per i 2 weight critici.
4. Rimuovere `<link href="...googleapis.com/css2?...">` dall'index.html (eliminare DNS+TLS chain Google).
5. **Drop Kalam** dal load iniziale — usato solo per `font-script` raro in 3-4 punti (sostituire con system handwriting fallback o caricare on-demand).
6. **Ridurre Inter da 5 a 2 weight** (400+600).

## Gain atteso

- LCP -2500/-3000 ms mobile 4G real-user
- Transfer -180 KB (da 14 a 4 file font totali)
- Target post-fix: LCP <2.5 s 4G mobile, <1.8 s desktop

## Verifica post-fix

```bash
npm run build
npm run audit:cwv  # config in lighthouserc.json
```

LCP threshold in lighthouserc.json: `[warn, { maxNumericValue: 2500 }]`.

## Link

- audit avanzato sezione §11 + §13
