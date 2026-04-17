# Claude Code Session Start

For a new session on TRAVELLINIWITHUS, Claude already auto-loads `CLAUDE.md`. That covers stack, model routing, code discipline, quality bar, commands, and skill/agent routing.

If the session needs deeper project memory, read on demand (not preemptively):

- `AGENTS.md` — expanded operating rules
- `DESIGN.md` — design-system source (UI, Stitch/Figma prompts)
- `docs/10_Projects/PROJECT_TRAVELLINIWITHUS_SITE.md` — current project hub
- `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md` — brand snapshot

Do not load the whole `docs/` tree. Open only what the task actually needs.

## Non-negotiable rules (quick reference)

- Italian for public UI and copy.
- Preserve premium editorial language unless the user asks for a redesign.
- Smallest change that solves the problem. No refactor during bugfix.
- `server.ts`, `firestore.rules`, `src/config/admin.ts` are high-risk — confirm before editing.
- Default model: **sonnet**. Escalate to opus only for multi-file architecture / hard debugging.
- Use `code-explorer` (haiku) for any "where is X / what does Y do" research before touching code.

## First response pattern

On a new task, say in 3 lines:
1. what the task is
2. which files / routes are likely touched
3. which `docs/` note (if any) will be updated
