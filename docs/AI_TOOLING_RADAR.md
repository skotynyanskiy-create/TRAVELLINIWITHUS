---
type: reference
area: workspace
status: active
tags:
  - ai
  - tooling
  - radar
  - agents
---

# AI Tooling Radar

This radar tracks new AI/dev capabilities for TRAVELLINIWITHUS without turning
every candidate into a default tool. Use it with `docs/AI_AGENT_STACK.md`,
`AGENTS.md`, `CLAUDE.md`, `docs/MARKETING_OPERATIONS_HUB.md`, and
`docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`.

## Decision Model

| Stage    | Meaning              | Allowed                                             | Not allowed                                     |
| -------- | -------------------- | --------------------------------------------------- | ----------------------------------------------- |
| Scouting | Research and compare | Read docs, inspect registries, summarize candidates | Install, enable MCP, change config, use secrets |
| Lab      | Controlled trial     | Temporary sandbox test after confirmation           | Production credentials, deploy, database writes |
| Adoption | Stable workflow      | Documented config, tests, rollback                  | Adoption without evaluation card                |

Every candidate that moves beyond scouting needs
`docs/90_Templates/TPL_Tooling_Evaluation.md`.

## Radar Categories

### Skills, Agents, Subagents

Evaluate portable Agent Skills, Claude Code skills, Codex-compatible skills,
GitHub Copilot custom agents, specialist subagents and cross-agent handoff
patterns. Prefer narrow, project-adapted skills over importing full catalogs.

Initial candidates:

- Agent Skills repositories and official skill examples.
- GitHub Copilot custom agents and `.instructions.md` files.
- Travellini-specific skills for backup, rollback, secrets and tooling audits.

| Candidate                         | Status | Why it matters                                                     | Next action                                         |
| --------------------------------- | ------ | ------------------------------------------------------------------ | --------------------------------------------------- |
| Official Agent Skills examples    | scout  | Portable patterns across Claude, Codex, Copilot, Cursor and Gemini | Review before creating new local skills             |
| GitHub Copilot custom agents      | scout  | Could route GitHub tasks without bloating repo instructions        | Evaluate with `github-agent-workflow`               |
| Travellini backup/security skills | adopt  | Already project-specific and low-risk                              | Keep synchronized and validate with `audit:agents`  |
| Graphify (PyPI graphifyy CLI)     | watch  | Code graph for AI agents; near-zero delta vs stack; risky install  | Re-evaluate at Next.js rebuild (card in 50_Scratch) |

### MCP

Evaluate MCP servers for concrete tasks only: browser QA, design handoff, docs,
repository operations, observability, Firebase/Stripe inspection and research.
Prefer read-only or scoped modes. Do not enable broad community servers by
default.

Initial candidates:

- Official MCP Registry.
- Figma MCP when a real Figma workflow exists.
- GitHub managed MCP if it reduces local token management.
- Research/crawl MCP only for SEO or design-research tasks.

| Candidate             | Status | Why it matters                                 | Next action                            |
| --------------------- | ------ | ---------------------------------------------- | -------------------------------------- |
| Official MCP Registry | scout  | Best source for discovering maintained servers | Use for research only                  |
| Figma MCP             | scout  | Useful for design handoff and UI QA            | Lab only when a real Figma file exists |
| GitHub managed MCP    | scout  | May reduce local server/token maintenance      | Compare against Codex GitHub plugin    |
| Research/crawl MCP    | scout  | Could improve SEO/design research              | Evaluate privacy and crawl scope first |

### CLI

Evaluate CLI tools by workflow value, install scope, update burden, Windows
compatibility and rollback. Prefer existing npm scripts and opt-in `npx` usage
until a tool proves recurring value.

Initial candidates:

- `gh skill` for portable skill management.
- Gemini CLI or other coding agents as lab-only comparison tools.
- Security scanners that complement `npm run audit:secrets`.

| Candidate                    | Status | Why it matters                                        | Next action                           |
| ---------------------------- | ------ | ----------------------------------------------------- | ------------------------------------- |
| `gh skill`                   | scout  | Could manage portable skills through GitHub workflows | Evaluate before install/use           |
| Gemini CLI                   | scout  | Useful as independent coding/research comparison      | Lab only, no stable adoption yet      |
| Additional security scanners | scout  | Could strengthen secret/supply-chain review           | Compare with existing `audit:secrets` |

### Codex Plugins And App Integrations

Evaluate plugins that bundle skills, MCP servers and app integrations. Use
project needs to decide, not marketplace novelty.

Initial candidates:

- GitHub plugin for PR, issue and CI workflows.
- Figma/Canva plugins for design production after brand review.
- Google Drive plugin for Docs/Sheets/Slides only when source files live there.
- Stripe plugin only for payment tasks with owner confirmation.

| Candidate           | Status | Why it matters                            | Next action                        |
| ------------------- | ------ | ----------------------------------------- | ---------------------------------- |
| Codex GitHub plugin | adopt  | Already useful for PR/issue/CI work       | Keep task-scoped                   |
| Figma plugin        | scout  | Strong design-to-code potential           | Use only with design brief/file    |
| Canva plugin        | scout  | Useful for brand presentations and assets | Keep as content/design draft input |
| Google Drive plugin | scout  | Useful when source docs live in Drive     | Avoid duplicating repo docs        |
| Stripe plugin       | scout  | High-value but high-risk payment surface  | OWNER ONLY for writes              |

### GitHub Workflows

Evaluate GitHub-native agent capabilities, custom instructions, issue templates,
PR review workflows, CI hardening and Dependabot grouping. Keep repository
instructions short and point back to `AGENTS.md`.

### Design Tools

Evaluate Figma, Canva and visual-generation workflows as design inputs, not
automatic repo truth. All output must pass through `DESIGN.md`, UI QA and the
Travellini brand voice before implementation.

#### AI design-agent scouting — 2026-06-18

Cross-model AI design/UI tools evaluated for the structure/graphics phase. Hard
constraint: stack is Vite + React 19 + Tailwind 4 + a bespoke premium-editorial
design system (`DESIGN.md`), anti-SaaS. Generic AI tools produce exactly the
SaaS look the brand rejects, so their value is **exploration/inspiration only**,
never direct repo code. Everything funnels through `DESIGN.md` →
`travellini-ui-designer` → UI QA.

| Candidate                | Type                                           | Source                                 | Travellini use case                                              | Benefit                                               | Risk                                                                                         | Permissions                  | Duplication                                              | Stage      | Next action                                                        |
| ------------------------ | ---------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------- | -------------------------------------------------------- | ---------- | ------------------------------------------------------------------ |
| **superdesign.dev**      | open-source IDE design agent (Claude Code SDK) | github.com/superdesigndev/superdesign  | Parallel UI exploration locally (`.superdesign/`) inside the IDE | Fast 10x mockup forks, fully local, same model family | Generic output; consumes Claude credits; **Open VSX listing deprecated** → check maintenance | local fs; own/Claude API key | partial vs `travellini-ui-designer` + `/design-research` | **lab**    | Eval card + owner OK before install; sandbox trial, no repo writes |
| **secure-design** (fork) | open-source, privacy-first                     | github.com/hbmartin/secure-design      | Same as superdesign, hardened                                    | Privacy/supply-chain posture                          | younger fork, smaller community                                                              | local fs                     | same as superdesign                                      | scout      | Compare against superdesign in the same lab trial                  |
| **neuform.ai**           | web SaaS, design systems + HTML                | neuform.ai                             | Inspiration source; exports `DESIGN.md` (our format)             | 400+ curated systems, free tier                       | WebGL/threejs heavy = off-brand; cloud SaaS                                                  | account (no repo secrets)    | overlaps `/design-research`                              | scout      | Use as occasional reference like awwwards/godly; do not integrate  |
| **efferd.com**           | shadcn/ui block library                        | efferd.com / github shabanhr/efferd-ui | —                                                                | ready blocks                                          | shadcn aesthetic (auth/pricing) ≠ editorial brand; new component paradigm                    | shadcn CLI                   | conflicts with bespoke `PageLayout`/`Section`            | **reject** | Not aligned; skip                                                  |
| **Onlook**               | open-source visual editor for React            | github.com/onlook-dev/onlook           | Click-edit React+Tailwind visually                               | Edits real code, AI chat                              | Next.js-centric (we are Vite+Express); edits bespoke system directly = high regression risk  | local fs/project             | overlaps frontend-builder                                | defer      | Re-evaluate only if a Vite path matures                            |
| **Anima**                | Figma→code + AI                                | animaapp.com                           | Figma handoff to code                                            | If a real Figma file exists                           | cloud; Figma-dependent                                                                       | Figma + cloud                | overlaps Figma MCP                                       | scout      | Only with an actual Figma workflow                                 |

Recommendation: of the set, only **superdesign.dev** fills a real gap (in-IDE
parallel visual exploration for the current phase) and is worth a **lab** trial
behind an evaluation card. The rest are scout/reject. Do not let any of them
write repo code directly.

### SEO, Marketing And AI Search

Evaluate tools for SEO, GEO/AI-search visibility, content proof, competitor
research, affiliate disclosure, partner outreach and editorial repurposing.
Do not invent metrics or partner proof.

### Security, Backup And Rollback

Evaluate tooling that improves secret handling, rollback confidence, hook
coverage, audit trails, prompt-injection resistance and supply-chain review.
These candidates can justify adoption sooner than novelty tools.

## Candidate Status Values

- `scout`: worth watching or researching.
- `lab`: approved for controlled trial.
- `adopt`: approved for stable workflow.
- `defer`: useful but not now.
- `reject`: not aligned, duplicated or too risky.

## Evaluation Checklist

- Source is official, maintained, or clearly reputable.
- Use case maps to Travellini goals: brand clarity, editorial authority,
  media-kit conversion, lead capture, affiliate/shop monetization or release
  quality.
- Required permissions are scoped and understandable.
- It does not duplicate an existing local skill, agent, MCP or script without a
  clear improvement.
- It has a low-friction rollback path.
- It does not require printing, copying or storing secrets in repo files.
- It can be validated with existing commands such as `npm run audit:agents`,
  `npm run typecheck`, `npm run build`, `npm run audit:ui`, or task-specific
  browser checks.

## Evaluation — syntaix.ai "Top 10 AI repos" carousel (2026-06-22)

Owner shared an Instagram carousel (engagement-bait: round/inflated star
counts, "comment GITHUB" CTA). Repos are mostly real; fit to Travellini is the
filter. Verified real star counts differ from the post (Markitdown ~150k, not
7.3k; last30days ~34k, not 12.4k).

| Candidate                   | What it is                                    | Decision                           | Form here                                                                                     |
| --------------------------- | --------------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------- |
| Markitdown (Microsoft, MIT) | Files → Markdown                              | **adopt**                          | `scripts/ingest-doc.py` + `npm run ingest:doc`, output to `docs/50_Scratch/ingested/`         |
| last30days-skill            | Recency research across socials               | **adopt (adapted)**                | `/trend-research` skill orchestrating existing `brave-search` + `WebSearch` — no external dep |
| Agent-Reach                 | Multi-source internet search CLI              | **adopt (folded)**                 | Same scope as last30days → absorbed into `/trend-research`                                    |
| Taste-Skill                 | Anti-generic-output quality layer             | **adopt (enhanced existing)**      | "Taste pass" section added to `/anti-ai-slop` (positive distinctiveness check)                |
| Hermes-Agent                | Self-hosted agent + memory                    | **reject**                         | Duplicates existing auto-memory + `travellini-*` agents; no real gap                          |
| Headroom                    | LLM context/token compression (MCP/proxy/lib) | **defer → needs `/mcp-evaluator`** | Architectural; owner wants it. Not blind-installed. Requires eval card + confirmation         |
| Open-Notebook               | Jupyter alternative                           | reject                             | No data-science notebook need in stack                                                        |
| Career-Ops                  | AI job-search auto-apply                      | reject                             | Out of scope                                                                                  |
| Container                   | "Second brain" knowledge base                 | reject                             | Duplicates Obsidian vault                                                                     |
| PM-Skills                   | Product-manager copilot                       | reject                             | Single-owner marketing lead, no product team                                                  |

Adopted in this session: Markitdown, `/trend-research`, `/anti-ai-slop` taste
pass. Open decision: Headroom (see below).
