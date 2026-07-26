---
name: smoke-test
description: Quick browser smoke test after code changes. Checks homepage loads, nav works, main CTA visible, no console errors.
agent: browser-auditor
---

# /smoke-test

Verifica rapida nel browser dopo modifiche: $ARGUMENTS

## Checklist

1. Homepage carica senza errori
2. Navbar visibile e funzionante
3. Hero / above-the-fold integro
4. CTA principale visibile
5. Footer presente
6. Nessun errore console critico
7. Mobile: nessun overflow orizzontale

## Output

Pass / Fail per ogni check. Se fail: route, problema, fix consigliato.
Tieni il report breve — è una smoke, non un audit completo.

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
