---
name: photo-plan
description: Generate or review the photo plan for a TRAVELLINIWITHUS page or article via travellini-asset-curator. Covers image selection, crop direction, Italian alt text, image-weight budget, format choice, and OG card. Use when scaffolding photos for a new page/article, when LCP is image-driven, or when reviewing existing imagery for brand fit.
---

# /photo-plan

Invokes `travellini-asset-curator` to produce a complete photo plan for a route or article.

## When to use

- Building a new page or article and the photo plan isn't decided
- Reviewing existing imagery for brand fit / editorial register
- `travellini-perf-engineer` flagged image weight as LCP bottleneck
- Designing a social-share OG card
- Auditing gallery composition inside an article
- Mass replacing stock-feeling photos with editorial-feeling ones

Do NOT use for:

- Layout / where the image renders → `travellini-ui-designer`
- Implementing `<Image>` / srcset wiring → `travellini-frontend-builder`
- Video / Reels editing → human task
- Producing or commissioning new shots → human task (the agent can request them)

## Arguments

- **target** (required): a route (`/salento`), an article slug (`salento-agosto-2026`), or "OG card for X"
- **scope** (optional): `full` (default, all images on page) | `hero-only` | `social-only` | `gallery-only`

## Protocol

1. **Locate the asset library**: confirm where images live (`src/assets/`, `public/images/`, or external).

2. **Confirm narrative context**: if the target is an article, the curator should read the body first (or the `editorial-writer` brief from `docs/50_Scratch/HANDOFF_*.md`).

3. **Invoke `travellini-asset-curator`** with target + scope. The agent will:
   - Inventory available assets matching the page
   - Score each on narrative fit + editorial register + composition + color harmony + cliché check
   - Propose crop / focal-point per role (hero, section, thumb, OG)
   - Write Italian alt text (70-125 chars typically)
   - Set weight target per role and flag any image exceeding budget
   - Identify gaps (shots needed that don't exist)

4. **Receive the plan**: table with position, file, crop, role, weight target, alt text, LCP-critical flag.

5. **Flag asset gaps to the user**: if a shot is needed that doesn't exist, request:
   - description of what's needed
   - where it would go
   - why current options fail

6. **Hand off to `travellini-frontend-builder`** for `<Image>` component wiring and srcset:
   `docs/50_Scratch/HANDOFF_<target>_assets_to_frontend.md`

7. **Coordinate with `travellini-perf-engineer`** if hero weight exceeds budget — they may want to re-measure LCP after the new images land.

## Output to user

```
## Photo plan — <target>

### Selected images
| Position | File | Crop | Role | Weight | Alt (IT) | LCP |
|---|---|---|---|---|---|---|
| Hero | salento-tramonto.avif | 21:9 center-right | Hero | 180KB | "Porto di Otranto al tramonto..." | Yes |
| ... | ... | ... | ... | ... | ... | ... |

### Assets to request from R&B
1. <description + where + why>

### OG card direction
- Image: <file>
- Overlay text (IT): <≤6 words>

### Hand-off
- Implementation → travellini-frontend-builder (see docs/50_Scratch/HANDOFF_*.md)
- Re-measure LCP after deploy → travellini-perf-engineer
```

## Hard rules

- **Italian alt text always.** No "Image" / "Photo" prefix.
- **No AI-generated photography** as brand editorial — flag for human replacement.
- **No text burnt into images** on public pages (OG cards are the only exception).
- **Performance is non-negotiable on hero**: if no image fits 200KB budget, propose a different image.
- **Decorative-only images** get `alt=""`, never `alt="decoration"` or skip the attribute.
