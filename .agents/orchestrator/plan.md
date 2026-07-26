# Execution Plan — TRAVELLINIWITHUS Enterprise Site Refinement

## Strategy

Follow Project Pattern with rigorous Explorer -> Worker -> Reviewer -> Challenger -> Auditor validation cycles.

## Milestones & Tasks

### Milestone 1: Interactive Traveler Tools & Integrations (R2)

- [x] **M1.1 Explorer Phase**: Analyze existing geo, sharing, maps, and affiliate logic across codebase.
- [x] **M1.2 Worker Phase**: Implement/enhance `src/utils/geo.ts` (Haversine distance in km, geolocation hook), Google Maps directions builder, Google Business Profile contact helper, Web Share API hook/component (`src/utils/share.ts`), and centralized affiliate link tracker (`src/utils/affiliate.ts`). Integrate into relevant components/pages.
- [x] **M1.3 Reviewer Phase**: Review code quality, TypeScript types, and contract adherence.
- [x] **M1.4 Challenger Phase**: Verify Haversine math correctness, boundary conditions (0km, antipodal, null locations), share fallback.
- [x] **M1.5 Forensic Auditor Phase**: Perform integrity check.

### Milestone 2: Enterprise UI/UX & Editorial Refinement (R1)

- [x] **M2.1 Explorer Phase**: Audit 9 key pages (Homepage, Posto, Destinazione, Esplora, Mappa, Chi Siamo, Collaborazioni, Media Kit, Risorse) against brand typography, Sand/Terracotta palette, micro-animations, and Rodrigo & Betta voice.
- [x] **M2.2 Worker Phase**: Refine UI/UX and Italian editorial copy on all 9 key pages, integrating M1 traveler tools.
- [x] **M2.3 Reviewer Phase**: Verify UI design consistency, brand tokens, component usage.
- [x] **M2.4 Challenger Phase**: Verify responsive behavior (375px mobile), visual rendering, interactive state handling.
- [x] **M2.5 Forensic Auditor Phase**: Perform integrity check.

### Milestone 3: Quality, Performance & Security Compliance (R3)

- [x] **M3.1 Worker/Reviewer Phase**: Run `npm run typecheck` and `npm run audit:ui`, fix any issues.
- [x] **M3.2 Accessibility Audit**: Verify WCAG AA compliance (contrast, aria-labels, alt texts, focus indicators).
- [x] **M3.3 Security & High-Risk File Audit**: Confirm zero changes to `server.ts`, `firestore.rules`, `src/config/admin.ts`.
- [x] **M3.4 Final Forensic Audit**: Full integrity veto check across all changed files.

## Completion Criteria

- 0 typecheck errors
- 0 audit:ui errors
- 0 high-risk file modifications
- WCAG AA compliance & 375px mobile overflow clean
- Clean forensic auditor verdict
