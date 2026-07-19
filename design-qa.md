# Design QA — Homepage cinematografica

- Source visual truth: `.audit-screenshots/homepage-cinematic-reference.png`
- Implementation desktop: `.audit-screenshots/homepage-cinematic-desktop-full.png`
- Implementation mobile: `.audit-screenshots/homepage-cinematic-mobile.png`
- Combined comparison: `.audit-screenshots/homepage-cinematic-comparison.png`
- Viewports: 1440 × 1000 and 375 × 844
- State: homepage loaded, cookie consent accepted for final full-page capture

**Findings**

- No actionable P0/P1/P2 mismatch remains. The implementation preserves the source's defining hierarchy: cinematic Batu Caves opening, oversized Fraunces display type, numbered narrative chapters, alternating ink/sand scenes, Tavernal memory and closing destination CTA.
- Fonts and typography: self-hosted Fraunces Variable and Inter match the editorial serif/sans relationship. One H1 is present and wrapping remains intentional at both viewports.
- Spacing and layout rhythm: desktop uses full-bleed hero and alternating split scenes; mobile becomes a vertical composition. Measured horizontal width equals client width at 1440 and 375.
- Colors and visual tokens: all load-bearing colors use existing sand, ink and terracotta tokens. Contrast remains readable over the real reel imagery through a solid veil.
- Image quality and asset fidelity: real Batu Caves and Tavernal reel covers are used; no placeholder, CSS illustration or fake visual asset is present.
- Copy and content: Italian copy is specific to Rodrigo & Betta and the two real places, with working routes and reel link.

**Open Questions**

- The source mock uses a cleaner photographic frame than the available Batu Caves reel cover, whose original frame contains social-video typography. This is accepted because the repository's real approved media takes priority over an invented replacement.

**Implementation Checklist**

- [x] TypeScript passed.
- [x] Production build passed.
- [x] Desktop and mobile browser captures completed.
- [x] No horizontal overflow.
- [x] One H1.
- [x] Browser console checked: zero errors.
- [x] Native scroll and reduced-motion fallback preserved.

**Follow-up Polish**

- P3: extract a cleaner high-resolution Batu Caves frame from the original reel when an approved timestamp is selected.

## Comparison history

Initial desktop and mobile captures showed no P0/P1/P2 defects. No corrective visual iteration was required. The first desktop capture included the cookie banner; consent was accepted and a clean full-page implementation capture was produced for the final comparison.

final result: passed
