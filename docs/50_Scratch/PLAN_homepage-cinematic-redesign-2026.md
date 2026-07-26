---
title: PLAN_homepage-cinematic-redesign-2026
status: active
created: 2026-07-18
type: plan
area: product
slug: homepage-cinematic-redesign-2026
---

# Orchestration plan — homepage-cinematic-redesign-2026

## Request restated

Ridisegnare completamente la homepage come racconto cinematografico a scroll naturale: la partenza diventa viaggio, Rodrigo & Betta restano il centro umano e la regia evita template, effetti gratuiti, scroll hijacking e peso eccessivo. Prima si consegna una vertical slice completa e verificata; solo dopo approvazione si estende il linguaggio all'intera home e si documenta in `docs/TRAVELLINI-HOMEPAGE.md`.

## Classification

- Type: refactor / visual redesign
- Domains: design, asset, frontend, copy/SEO, perf, a11y, qa, browser
- Reversibility: costly to undo (route pubblica e nuovo linguaggio home), ma con rollback facile finché la slice resta isolata
- Horizon: 1–3 settimane

## Repository baseline (2026-07-18)

- Route `/`: `src/pages/AtlanteHome.tsx`, dentro `Layout` con navbar/footer.
- Stack utile già presente: React 19, Vite 6, Tailwind 4, Motion, GSAP/ScrollTrigger, Lenis, R3F/Three, Playwright, axe/Lighthouse.
- Esperimenti riusabili come ricerca, non come architettura: `src/experience/sentiero/`, `src/experience/atlante/`, `src/experience/controluce/`, `src/pages/HomeLegacy.tsx`.
- Rischio noto: Sentiero/Atlante WebGL usano `ScrollControls` e/o viewport bloccata; incompatibili con il vincolo no scroll hijacking se copiati integralmente.
- Motion esistente frammentata tra Motion e GSAP; reduced-motion già presente ma va verificato end-to-end.
- Asset: 5 MP4 reali, numerose immagini locali AVIF/WebP, ma diverse cover/immagini sono placeholder o hanno watermark; serve inventario con provenienza e approvazione.
- CMS/content: `useSiteContent`, config locali e contenuti seed; non assumere che placeholder o conteggi siano pubblicabili.
- SEO attuale: un H1, SEO/JSON-LD e canonical già nella home Atlante; vanno preservati o migliorati senza duplicazioni.
- Git: worktree condiviso; nessun reset/checkout distruttivo. Vecchi handoff home F2.1 sono `obsolete`.
- Documenti potenzialmente concorrenti: `PROJECT_CINEMATIC_REBUILD_HOME_2026.md` e `PROJECT_ATLANTE_VIVO_HOME_2026-07-04.md`. Nessuno dei due è automaticamente autoritativo per il nuovo redesign senza scelta owner.

## Locked decisions

- Experience principle: scroll nativo; niente scroll hijacking, blocco globale di `html/body`, navigazione a tappe obbligata o smooth-scroll che altera l'input.
- Narrative principle: la progressione visiva comunica partenza → movimento → arrivo; effetti ammessi solo se chiariscono questo passaggio.
- Brand principle: Rodrigo & Betta e media reali/approvati prima di stock o placeholder.
- Delivery principle: vertical slice prima dell'intera homepage.
- Slice scope: hero, prima scena scroll, transizione, una destinazione, CTA.
- Variants: desktop, mobile e reduced-motion sono tre versioni intenzionali della stessa storia.
- Performance principle: HTML/testo/immagine poster funzionano senza JS pesante; WebGL/video sono progressive enhancement e non devono diventare LCP.
- Architecture principle: riuso selettivo dello stack attuale; nessuna nuova libreria prima di dimostrare un limite reale.
- Out of scope: backend, Firestore/Stripe, route interne, CMS migration, redesign navbar/footer, deploy, produzione di nuovi contenuti editoriali lunghi.
- Authoritative handoffs: i due nuovi handoff di questo piano; i vecchi `HANDOFF_home_redesign_F2.1_*` restano obsoleti.

## Open questions for the user (must answer before design-research)

1. Audience primaria: follower social italiani che cercano il prossimo posto, nuovi visitatori da Google, oppure partner/brand? Raccomandazione: follower/nuovi lettori leisure; B2B resta CTA secondaria.
2. Success metric primaria della slice: click verso destinazione/mappa, iscrizione newsletter, oppure completamento fino alla CTA? Raccomandazione: `home_destination_click`, con scroll depth e CTA visibility come diagnostiche.
3. Deadline o trigger di cutover: data precisa oppure “dopo slice approvata + gate verde”? Raccomandazione: nessun cutover finché slice e home estesa non passano i gate.
4. Fonte autoritativa: il nuovo brief sostituisce sia Sentiero sia Atlante Vivo, usando entrambi solo come materiale, oppure uno dei due resta base vincolante? Raccomandazione: nuovo brief autoritativo; Atlante resta rollback pubblico, Sentiero laboratorio.
5. Quale destinazione reale e quali asset R&B approvati entrano nella slice? Senza questa scelta, l'asset-curator può fare inventario ma non finalizzare la scena.

## Canonical sequence

Custom visual-redesign sequence: code-explorer → design-research skill + ui-designer → asset-curator + seo strategist → frontend-builder (slice) → perf + quality + browser gate → owner approval → frontend-builder (extension + docs) → final parallel gate.

| #   | Agent                                                                   | Trigger                        | Deliverable                                                                                           | Handoff file written                                        |
| --- | ----------------------------------------------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 1   | code-explorer                                                           | owner answers locked questions | evidence map: route, components, CSS/motion, assets, CMS, responsive, perf, SEO, a11y, git/diff risks | `HANDOFF_homepage-cinematic_recon_to_ui.md`                 |
| 2   | design-research skill + travellini-ui-designer                          | recon complete                 | 2–3 references analyzed, one selected direction, storyboard and motion grammar for slice/all variants | `HANDOFF_homepage-cinematic_ui_to_asset-seo.md`             |
| 3   | travellini-asset-curator + travellini-seo-conversion-strategist         | direction locked               | approved asset manifest/crops/alt/perf budget + H1/CTA/meta/schema/content contract                   | `HANDOFF_homepage-cinematic_asset-seo_to_frontend-slice.md` |
| 4   | travellini-frontend-builder                                             | asset/copy contract complete   | isolated vertical slice on preview route/flag; desktop/mobile/reduced-motion; telemetry hooks         | `HANDOFF_homepage-cinematic_slice_to_gate.md`               |
| 5   | travellini-perf-engineer + travellini-quality-auditor + browser-auditor | slice implemented              | measured slice report and defects at 320/375/768/1024/1440; keyboard/reduced-motion/console/CWV       | `HANDOFF_homepage-cinematic_gate_to_owner.md`               |
| 6   | Owner                                                                   | gate green                     | explicit approve/revise decision on slice                                                             | n/a                                                         |
| 7   | travellini-frontend-builder                                             | explicit owner approval        | extend approved grammar to full homepage; write `docs/TRAVELLINI-HOMEPAGE.md`; preserve rollback      | `HANDOFF_homepage-cinematic_extension_to_final-gate.md`     |
| 8   | travellini-perf-engineer + travellini-quality-auditor + browser-auditor | extension complete             | final green release-readiness report; no deploy                                                       | n/a                                                         |

## Vertical slice acceptance contract

- Hero communicates who/what in ≤5 seconds with one visible Italian H1 and usable CTA.
- Native wheel/touch/keyboard scrolling always works; no pinned sequence may trap the user.
- First scene visibly initiates “departure”; transition has a semantic before/after, not decoration.
- Destination scene names one real place and offers a real route/CTA.
- Mobile is composed, not merely animation-disabled desktop.
- Reduced-motion removes scrubbing/parallax/autoplay while preserving order, meaning and CTA.
- No new unapproved dependency; no high-risk backend file touched.

## Quality gates before declaring done

- [ ] `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build` pass.
- [ ] `npm run audit:ui`, `npm run audit:visual`, `npm run audit:a11y`, `npm run audit:size` pass.
- [ ] Lighthouse/CWV: mobile LCP ≤2.5s, CLS ≤0.1, INP ≤200ms; a11y and SEO ≥0.95.
- [ ] Zero horizontal overflow at 320/375/768/1024/1440; no console errors.
- [ ] Keyboard, focus, landmarks, one H1, alt text and contrast verified.
- [ ] Reduced-motion verified with media emulation; no essential content depends on motion.
- [ ] Video/WebGL lazy; poster/text path remains complete on failure and low-power devices.
- [ ] SEO canonical/meta/JSON-LD preserved; destination CTA resolves to a real public route.
- [ ] `docs/TRAVELLINI-HOMEPAGE.md` explains narrative, components, motion rules, asset contract, responsive/reduced-motion behavior, perf budgets, analytics and rollback.
- [ ] Owner approves the slice before extension and the final homepage before cutover.

## Stop condition

Done means the approved vertical-slice grammar has been extended to the whole homepage, the documentation exists, all final gates are green on the responsive matrix and reduced-motion, and the owner explicitly signs off. Deployment is not part of this plan.

## Cost estimate

- R&B time: 3–5 hours (decisioni, asset selection, slice review, final review); 6–10 hours if real asset cleanup/shoot selection is required.
- Token cost: high.
- Calendar landing: 7–12 working days after the five open decisions and assets are supplied; 2–3 weeks if asset remediation is needed.

## Risks / what could derail this

- Conflicting “source of truth” between Sentiero and Atlante leads to relitigation.
- Real R&B asset shortage forces placeholder-looking design.
- Mixing Motion, GSAP, Lenis and R3F without a single motion owner inflates bundle and interaction risk.
- Cinematic ambition pushes LCP/INP beyond budget, especially on mobile.
- Slice approved visually without reduced-motion/keyboard testing creates expensive rework later.
- Concurrent worktree edits overlap `App.tsx`, `AtlanteHome.tsx`, `src/index.css` or shared layout.

## What to do NOW

Answer the five open questions. Then invoke `code-explorer` with `docs/50_Scratch/HANDOFF_homepage-cinematic_orchestrator_to_recon.md`; do not start visual implementation yet.
