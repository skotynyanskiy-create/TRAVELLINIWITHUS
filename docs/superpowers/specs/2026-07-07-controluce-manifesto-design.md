---
type: reference
area: workspace
status: active
tags:
  - design
  - webgl
  - lab
  - manifesto
---

# Spec — CONTROLUCE (`/manifesto`)

Approved 2026-07-07 by owner after a 5-creator / 3-judge brainstorm panel
(winner: "Controluce — telo di lino", 2/3 judges + highest aggregate 137/165,
highest feasibility score). Purpose: **portfolio-tier wow piece** on an
isolated lab route. Not a site page; zero impact on live routes.

## 1. Concept

A single handwoven **linen cloth stretched between the viewer and the light**
— Balinese shadow theater meets Malick's curtains and Vermeer's light. The
scroll is **the sun completing one full day behind the cloth**: dawn → broken
stained-glass light → low tungsten → vertical gold → terracotta ember that
dies into the site's sand color. Five poetic acts (Partire, Perdersi,
Assaporare, Meravigliarsi, Tornare) surface as readable DOM sections. The 5
real reels are **decoration only**: small openings in the weave, never
protagonists.

**Signature moment** (Act IV): wind stops — silence — then something ENORMOUS
moves behind the linen: the luminance of the real Batu Caves video, thresholded
and blurred (FBO ¼ res), projected as a **colossal shadow** of the golden
statue breathing behind the cloth, the staircase rainbow filtering up through
the threads. Match cut: the shadow contracts and resolves into a small, honest
300px video fragment. The primordial gesture of cinema — immense shadow, then
the source revealed — and the shadow IS real content.

## 2. The four grafts (from losing concepts — judges' consensus)

1. **Pacing curve as an asset** (montatore): hand-authored ease on the
   scroll→timeline mapping, per act (compressed in Assaporare, loose in
   Perdersi) + the **held frame**: ~600ms plateau at the shadow's apex,
   telegraphed so it reads as authorial, not jank.
2. **Near-dark beat** (scenografo): right before the reveal, backlight drops
   to ~20% floor, wind zero, one single Fraunces line visible in the dark.
3. **Text occludes light** (tipografo): act titles rasterized to a
   CanvasTexture and summed into the cloth's thickness map — the Fraunces
   letters **physically block the sun** (rim-light on glyph edges). Fraunces
   variable axes (SOFT/WONK/opsz) shift per act as "typographic acting".
4. **Permanent filigrana** (shader-artist): a small accumulation FBO (⅛ res,
   never cleared during the session) records where light and windows passed —
   a faint watermark memory on the cloth.

## 3. Act 0 — the opening (owner-validated reaction curve)

Hard constraints, in order:

- **Frame 1**: cloth already visible and breathing (no empty/loading frame).
- **≤3s**: first Fraunces line legible (title / first verse of Partire).
- **Scroll cue**: discreet poetic invite (light subtly pulling downward +
  a small "scorri" hint) — appears by ~5s if no scroll yet.
- **First scroll response is instantaneous** — no long easing at t≈0; the
  responsiveness IS the contract ("the light is mine to move").

Intended curve: quiete → riconoscimento materico (lino!) → senso (testo) →
scoperta del controllo. Calm premium entrance, not a loud one.

## 4. Acts

| #   | Act           | Light hour                                | Fabric treatment                                                                              | Reel decoration (small, marginal)                                                                                           |
| --- | ------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| I   | Partire       | alba — rosa freddo→oro, luce laterale sx  | vela che si gonfia, vento monta 0→max, varchi scintillano                                     | Egitto/Mar Rosso: oblò turchese dove la trama si dirada, caustiche deboli attorno, ~240px                                   |
| II  | Perdersi      | luce rotta — rifrazione RGB per canale    | il lino diventa vetrata; sagome SDF di archi passano dietro; camera "sbanda"                  | Tavernal: tessera di vetrata col drago rosso, bordi che rifrangono                                                          |
| III | Assaporare    | tungsteno 2700K basso da dx, fermo        | caustiche d'acqua lente (voronoi-edge), vento a un respiro, tempo dilatato (scroll compresso) | Sushi Kibo: finestra cinemascope 2.39:1 ~320px che si apre come uno shoji; il legno tinge la luce                           |
| IV  | Meravigliarsi | oro verticale che sale                    | near-dark beat → ombra colossale Batu (FBO luminanza) → match cut → held frame ~600ms         | Batu Caves: prima ombra gigante (mai video diretto), poi frammento reale ~300px bordo sfrangiato                            |
| V   | Tornare       | brace terracotta #c2410c → sabbia #faf8f4 | telo si affloscia e si distende; translucenza→0; il film si dissolve nella pagina             | Volterra/Volturi: ultima finestra piccola centrata che si chiude per prima; sotto, manifesto firmato + CTA unica → /esplora |

Copy (DRAFT — owner approves before final; voce R&B, specifica, anti-cliché):

- I: "Si parte sempre due volte: una quando lo decidi, una quando chiudi la porta."
- II: "Certe strade esistono solo se le sbagli."
- III: "Certi posti li ricordi con la bocca."
- IV: "Ogni tanto il mondo è più grande di così."
- V: "Si torna sempre un po' stranieri. È il souvenir migliore."

## 5. Architecture

- Route **`/manifesto`**: lazy, **noindex** (meta robots), not in nav, not in
  sitemap. Isolated like the old `/sentiero` (reuse its portal/fallback
  pattern in `src/experience/sentiero/`).
- All code under **`src/experience/controluce/`**:
  - `ControluceRoute.tsx` — route shell, SEO noindex, reduced-motion gate
  - `ControluceCanvas.tsx` — single fullscreen R3F canvas
  - `LinenMaterial.ts` — ShaderMaterial + GLSL (the whole world is one material)
  - `useMasterTimeline.ts` — lenis → scroll t ∈ [0,1] master timeline + pacing curve
  - `ShadowFBO.tsx` — Batu luminance→threshold→blur occluder (¼ res; ref: ping-pong pattern in `src/experience/atlante/signature/TraceSignature.tsx`)
  - `FiligranaFBO.tsx` — ⅛ res accumulation buffer (graft 4)
  - `acts.ts` — per-act config: copy, light color/pos, wind, windows, pacing
  - `ControluceOverlay.tsx` — DOM text (Fraunces), GSAP-synced to timeline
- **One plane** (128×128 subdivided), no 3D scene — everything is material.
  Vertex: 2-octave wind displacement. Fragment: anisotropic weave (warp×weft
  threads w/ per-thread hash jitter) + flying fibers (gradient noise stretched
  20:1) + translucency `uLightColor * exp(-thickness*k)` + soft sun SDF behind
  - per-act modules (voronoi caustics, RGB refraction, spectral gradient)
    gated by smoothstep windows on uScroll — single branch-light shader.
- Uniforms: `uScroll, uTime, uLightPos, uLightColor, uWind, uReveal[5],
uVideoTex, uShadowTex, uTitleTex, uFiligranaTex`.
- Post: bloom + film grain + slight CA (`@react-three/postprocessing`).
- Text: DOM only, GSAP ScrollTrigger on the same master t. Reading rule:
  lines fade in as the light source passes their screen region (uLightPos is
  known in JS → GSAP staggers). Titles: Fraunces italic clamp(3.5rem–8rem).
  Ink-dark on light phases, cream on dark phases — never mid-grey.

## 6. Performance guardrails

- Single canvas; DPR clamp 1.5; plane 64×64 + shadow-FBO off under 768px
  (shadow replaced by animated radial mass); one `VideoTexture` active at a
  time (current+next preloaded, muted/playsinline); covers webp as posters.
- Pause render when tab hidden. Route lazy-loaded; zero cost to other pages.
- `prefers-reduced-motion`: wind 0, light crossfades per act, no clip
  animations — a static readable sequence.

## 7. Scope

- **v1**: cloth shader + master timeline + pacing curve + 5 acts w/ draft copy
  - static cover windows + title-occlusion (graft 3) + near-dark beat +
    post FX + lenis. Everything must _feel_ right before video.
- **v1.1**: Batu shadow FBO + match cut + held frame; active-window video;
  filigrana FBO.
- **Stretch**: ambient sound (opt-in), Fraunces variable-axis acting, deeper
  mobile art direction.

## 8. Verification

Visual truth in the browser (per project rule): screenshots at t≈0, 0.15,
0.35, 0.55, 0.62–0.72 (signature), 0.9, 1.0; console clean; no horizontal
overflow; 60fps target on mid laptop (spot-check via devtools trace).
Smoke: route mounts, canvas present, scroll advances timeline, other routes
untouched (`npm run typecheck` + existing e2e unaffected).

## 9. Reversibility

Delete `src/experience/controluce/` + the one route entry in `App.tsx` →
gone. No shared code modified beyond the route registration. No nav, no
sitemap, noindex. Real photography/video only — no AI imagery anywhere.

## 10. Risks

- Linen must read as LINEN (not "graphic effect") at frame 1 — budget tuning
  time on weave + backlight first; this is the whole concept's credibility.
- Batu shadow depends on luminance separability of the video frame (golden
  statue vs bright sky) — test the threshold EARLY on the real mp4 (v1.1 gate).
- Held frame can read as jank → keep ≤700ms, telegraph with light + sound of
  visuals (wind stop) before it.
- DOM/shader sync drift on title occlusion → titles rasterized to
  CanvasTexture from the same computed styles; verify at multiple viewports.
