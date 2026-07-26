---
name: audit-ui
description: Audit UI consistency in the TRAVELLINIWITHUS project across CSS variables, inline styles, Tailwind patterns, responsive behavior, accessibility, icons, and layout wrappers.
---

# /audit-ui

Audit the UI consistency of the TRAVELLINIWITHUS project.

## What to check

1. **CSS Variables** — Scan all `.tsx` files in `src/` for hardcoded colors. Every color must use CSS variables (`var(--color-sand)`, `var(--color-ink)`, `var(--color-accent)`, etc.). Flag any raw hex values, Tailwind color classes like `text-blue-500`, or `bg-red-*`.

2. **No Inline Styles** — Flag any `style={{ }}` attributes in JSX. All styling must use Tailwind classes.

3. **Tailwind Consistency** — Check for inconsistent spacing, padding, margin patterns. Look for one-off values that break the design system.

4. **Responsive Design** — Verify that page components use responsive breakpoints (`sm:`, `md:`, `lg:`). Flag components that only have desktop-width styles.

5. **Accessibility** — Check for:
   - Images without `alt` attributes
   - Buttons/links without accessible labels
   - Form inputs without associated labels
   - Missing `aria-*` attributes on interactive elements

6. **Icon Usage** — Verify all icons come from `lucide-react`. Flag any other icon libraries or inline SVGs.
   - Exception: the TikTok SVG path in `src/components/Navbar.tsx` is intentional (no lucide icon available) — do not flag it.

7. **Component Structure** — Verify pages use `<PageLayout>` and `<Section>` wrappers.

## Output

Report findings grouped by category. For each issue, include the file path and line number. Prioritize issues by severity: breaking > inconsistent > minor.

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
