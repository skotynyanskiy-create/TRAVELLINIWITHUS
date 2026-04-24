# Contributing — TRAVELLINIWITHUS

This is a single-owner project (Denys, marketing lead + builder) run with AI-assisted workflows. The contribution model is optimized for that: small, reversible changes; explicit routing of work between Claude Code, Copilot, and human review.

If you are contributing as an AI agent, read `AGENTS.md` first, then `CLAUDE.md`. The routing rules there (BARC — Before-Action Routing Check) are binding.

## Setup

```bash
git clone https://github.com/skotynyanskiy-create/TRAVELLINIWITHUS.git
cd TRAVELLINIWITHUS
npm install
cp .env.example .env.local   # leave all keys blank unless you're doing a pre-deploy session
npm run dev
```

Dev server runs on port 3000 (3001 from the VS Code task). The site must run with zero external keys — every integration is guard-clause gated.

## Branching and commits

- Branch off `main` with a prefix: `codex/`, `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`.
- Conventional-style commit messages (`feat(scope): ...`, `fix(scope): ...`, `chore(scope): ...`).
- Commit small, focused diffs. Avoid bundling a refactor with a bugfix.
- Pre-commit is handled by Husky + lint-staged: ESLint (max-warnings=0) and Prettier run automatically on staged `.ts/.tsx/.css/.md/.json`.

## Definition of done

A change is not done until all of the following are true:

- `npm run typecheck` passes
- `npm run lint` passes (zero warnings on changed files)
- `npm run test` passes
- `npm run build` passes
- UI changes: the flow has been clicked through in a browser at 1280px and at 390px
- UI changes: `npm run audit:ui` passes
- Relevant `docs/` note is updated (see `CLAUDE.md` → "When to update `docs/`")
- No new `any` introduced (project is non-strict TS but new `any` is rejected in review)

For release cuts: `npm run audit:quality` must be green and `docs/10_Projects/PROJECT_RELEASE_READINESS.md` updated.

## Working with AI agents (Claude Code)

The repo ships a full Claude Code configuration: 7 agents, 22 skills, routing hooks, and project-aware slash commands. Use it.

- Unknown territory: start with `/explain-module` or `/bug-triage`.
- Small bug: `/small-fix`.
- UI work: delegate to `travellini-ui-designer` (critique/direction) and `travellini-frontend-builder` (implementation).
- SEO / Italian copy / conversion: `travellini-seo-conversion-strategist`.
- Before committing: `/quick-review`.
- Before pushing / PR: `/predeploy` if the change touches shipped code paths.
- Browser QA: `/audit-browser` (requires a running dev server).

Routing protocol (BARC, defined in `CLAUDE.md` §Smart Routing Protocol):

- Research/grep/"where is X" → `code-explorer` (haiku).
- Single-file edit → sonnet subagent or direct.
- Multi-file refactor or cross-layer debug → opus only with justification.
- Owner override always wins.

Cross-tool rules live in `AGENTS.md` for Cursor / Copilot / Gemini alignment.

## High-risk files

Never edit these without explicit owner sign-off:

- `server.ts`
- `firestore.rules`
- `src/config/admin.ts`
- `firebase-applet-config.json`, `.firebaserc`, `vercel.json`, `firebase.json`

Claude Code surfaces a warning hook on Edit/Write to those paths. Do not suppress it.

## Code conventions

- React 19 + TypeScript, functional components, typed props, named exports where sensible.
- Tailwind 4 + CSS variables from `DESIGN.md`. Do not hardcode hex colors; use `var(--color-*)`.
- Reuse `PageLayout`, `Section`, and lucide-react icons before inventing new primitives.
- Firestore access goes through `src/services/firebaseService.ts`. Always filter by `published` for public queries. Use `serverTimestamp()` for `createdAt` / `updatedAt`.
- React Query for server state; Context for shallow global UI state (cart, auth, favorites); never both for the same data.
- Italian for all public UI copy. No English placeholders in shipped components.

## Pull requests

- Fill in the PR template (`.github/pull_request_template.md`).
- Link the related `docs/10_Projects/*.md` note.
- CI must be green (`quality`, `audit-agents`, `audit-visual` jobs in `.github/workflows/ci.yml`).
- CODEOWNERS will auto-request review.

## Troubleshooting

Common dev-server, Firebase, Stripe, test, lint, and Claude Code hook problems are diagnosed in [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md). Check there before opening a bug note.

## Security

Vulnerabilities are reported privately — see `SECURITY.md`. Open `npm audit` findings that are deferred (e.g. the transitive `uuid <14` chain via `firebase-admin`) are documented as decision notes in `docs/20_Decisions/` so nobody applies `npm audit fix --force` blindly.

## Docs operating model

`docs/` is an Obsidian vault and an operational system, not optional documentation. If a change affects homepage, navbar, collaborations, release readiness, campaigns, or content, update the relevant note. Skip this and the change is not done.
