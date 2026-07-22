# Design QA — Diario delle meraviglie vere

- Source visual truth: `docs/30_Design/references/home-journal-target-2026-07-21.png`
- Implementation desktop: `.audit-screenshots/home-journal-1536.png`
- Implementation mobile: `.audit-screenshots/home-journal-320.png`
- Combined comparison: `.audit-screenshots/home-journal-comparison.png`
- Additional chapter captures: `.audit-screenshots/home-journal-page-02.png` through `home-journal-page-05.png`
- Viewports: 1536 × 1024 source/desktop; responsive matrix 320, 375, 768, 1024 and 1536 px
- State: homepage loaded with cookie choice pre-recorded for an unobstructed visual comparison

## Visual comparison

- The implementation preserves the source hierarchy: navy textile binding, warm paper,
  editorial serif title, quiet navigation, dated field note, terracotta action, large
  landscape and a visible preview of the next page.
- The generated hero is composed for the measured slot and retains the source focal balance:
  headline on the left, extraordinary architecture and travelling couple on the right.
- The lower-right reveal is implemented as a functional link to page 02 rather than a static
  decoration. The exact torn-paper edge and drawn route from the concept are intentionally not
  reproduced as fake CSS artwork.
- Chapters 02–05 extend the same visual grammar with polaroid-like editorial frames, handwritten
  notes, a dark-blue verdict spread and a quiet closing page.

## Findings and fixes

1. P1 — the first internal-page capture rendered inside only one grid column. Cause: the chapter
   class was attached to the scroll wrapper rather than the page surface. Fixed by moving the
   modifier class onto `.journal-page`.
2. P1 — the persistent header scrolled away after page 01. Cause: `perspective` on the root changed
   the fixed-position containing block. Fixed by keeping perspective only on each page step.
3. P2 — anchor destinations could sit too close to the fixed header. Fixed with an explicit
   96 px scroll margin; normal mobile flow remains transform-free.
4. Final comparison: no actionable P0, P1 or P2 visual mismatch remains.

## Functional and responsive checks

- Exactly one H1 at every tested viewport.
- Document width equals viewport width at 320, 375, 768, 1024 and 1536 px.
- Desktop primary CTA reaches `#pagina-02` and updates the live page indicator to 02/05.
- Mobile menu opens and exposes all four primary destinations.
- Header and textile binding remain fixed across all five desktop chapters.
- Images have explicit alt attributes; decorative instances use empty alt text.
- Injected axe-core WCAG 2A/AA/2.1AA scan: zero violations on the homepage.
- Browser console: zero errors in all five responsive captures.
- Reduced-motion mode removes page transforms and non-essential transitions.

## Automated verification

- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm run audit:ui`: passed with zero errors; repository-wide pre-existing warnings remain.
- `npm run audit:visual`: 14/14 Playwright checks passed.

final result: passed
