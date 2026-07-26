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

| Candidate                         | Status        | Why it matters                                                                      | Next action                                         |
| --------------------------------- | ------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------- |
| Official Agent Skills examples    | scout         | Portable patterns across Claude, Codex, Copilot, Cursor and Gemini                  | Review before creating new local skills             |
| GitHub Copilot custom agents      | scout         | Could route GitHub tasks without bloating repo instructions                         | Evaluate with `github-agent-workflow`               |
| Travellini backup/security skills | adopt         | Already project-specific and low-risk                                               | Keep synchronized and validate with `audit:agents`  |
| Graphify (PyPI graphifyy CLI)     | adopt-limited | Local code graph for dependency/blast-radius queries; no hooks, LLM or vault export | Keep pinned at 0.9.6; verify results against source |

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

| Candidate                | Type                                           | Source                                 | Travellini use case                                              | Benefit                                               | Risk                                                                                                                                                                                                                              | Permissions                  | Duplication                                              | Stage      | Next action                                                                                                                                                                                                                                                                                           |
| ------------------------ | ---------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | -------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **superdesign.dev**      | open-source IDE design agent (Claude Code SDK) | github.com/superdesigndev/superdesign  | Parallel UI exploration locally (`.superdesign/`) inside the IDE | Fast 10x mockup forks, fully local, same model family | Generic output; consumes Claude credits; dual-licensed AGPLv3 + Enterprise; maintainers say the IDE extension itself is "no longer actively maintained" (main product pivoted to a hosted web app) even though the repo is active | local fs; own/Claude API key | partial vs `travellini-ui-designer` + `/design-research` | **lab**    | Verified 2026-07-06: [docs/50_Scratch/TOOLING_EVAL_superdesign_2026-07-06.md](50_Scratch/TOOLING_EVAL_superdesign_2026-07-06.md) — trial the **current** official listing (`SuperdesignDev.superdesign-official`, not the deprecated `iganbold` one) only, isolated sandbox, never the hosted web app |
| **secure-design** (fork) | open-source, privacy-first                     | github.com/hbmartin/secure-design      | Same as superdesign, hardened                                    | Privacy/supply-chain posture                          | **Corrected 2026-07-06**: last commit Oct 2025 — now ~9 months stale vs. upstream's June 2026 activity. No longer "younger but smaller"; it looks abandoned relative to upstream                                                  | local fs                     | same as superdesign                                      | **defer**  | Do not use as a comparison in the superdesign lab trial anymore — upstream is the only active option                                                                                                                                                                                                  |
| **neuform.ai**           | web SaaS, design systems + HTML                | neuform.ai                             | Inspiration source; exports `DESIGN.md` (our format)             | 400+ curated systems, free tier                       | WebGL/threejs heavy = off-brand; cloud SaaS                                                                                                                                                                                       | account (no repo secrets)    | overlaps `/design-research`                              | scout      | Use as occasional reference like awwwards/godly; do not integrate                                                                                                                                                                                                                                     |
| **efferd.com**           | shadcn/ui block library                        | efferd.com / github shabanhr/efferd-ui | —                                                                | ready blocks                                          | shadcn aesthetic (auth/pricing) ≠ editorial brand; new component paradigm                                                                                                                                                         | shadcn CLI                   | conflicts with bespoke `PageLayout`/`Section`            | **reject** | Not aligned; skip                                                                                                                                                                                                                                                                                     |
| **Onlook**               | open-source visual editor for React            | github.com/onlook-dev/onlook           | Click-edit React+Tailwind visually                               | Edits real code, AI chat                              | Next.js-centric (we are Vite+Express); edits bespoke system directly = high regression risk                                                                                                                                       | local fs/project             | overlaps frontend-builder                                | defer      | Re-evaluate only if a Vite path matures                                                                                                                                                                                                                                                               |
| **Anima**                | Figma→code + AI                                | animaapp.com                           | Figma handoff to code                                            | If a real Figma file exists                           | cloud; Figma-dependent                                                                                                                                                                                                            | Figma + cloud                | overlaps Figma MCP                                       | scout      | Only with an actual Figma workflow                                                                                                                                                                                                                                                                    |

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

| Candidate                   | What it is                                    | Decision                                               | Form here                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------------------------- | --------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Markitdown (Microsoft, MIT) | Files → Markdown                              | **adopt**                                              | `scripts/ingest-doc.py` + `npm run ingest:doc`, output to `docs/50_Scratch/ingested/`                                                                                                                                                                                                                                                                                                                                                                                                                        |
| last30days-skill            | Recency research across socials               | **adopt (adapted)**                                    | `/trend-research` skill orchestrating existing `brave-search` + `WebSearch` — no external dep                                                                                                                                                                                                                                                                                                                                                                                                                |
| Agent-Reach                 | Multi-source internet search CLI              | **adopt (folded)**                                     | Same scope as last30days → absorbed into `/trend-research`                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Taste-Skill                 | Anti-generic-output quality layer             | **adopt (enhanced existing)**                          | "Taste pass" section added to `/anti-ai-slop` (positive distinctiveness check)                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Hermes-Agent                | Self-hosted agent + memory                    | **reject**                                             | Duplicates existing auto-memory + `travellini-*` agents; no real gap                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Headroom                    | LLM context/token compression (MCP/proxy/lib) | **lab-approved, library/proxy mode only (2026-07-06)** | Confirmed real: `headroomlabs-ai/headroom`, Apache-2.0, actively pushed. Source-read confirmed no outbound calls in plain OSS mode (telemetry off by default and beacon removed even when on); `app.headroomlabs.ai` and subscription-quota OAuth reads are separate, opt-in, enterprise/quota features — see [docs/50_Scratch/TOOLING_EVAL_headroom_2026-07-06.md](50_Scratch/TOOLING_EVAL_headroom_2026-07-06.md). Two unrelated same-named projects exist (`gglucass/headroom-desktop`) — do not conflate |
| ECC (affaan-m/ECC)          | Multi-harness agent config megapack           | **reject tool / mined 2 ideas (2026-07-06)**           | Untrustworthy (implausible ~226k stars in 6mo) + invasive installer that writes agent configs. Do NOT install. Mined 2 patterns natively: `scripts/hooks/config_protection.py` + `scripts/hooks/loop_detector.py` — see [docs/50_Scratch/TOOLING_EVAL_ecc_2026-07-06.md](50_Scratch/TOOLING_EVAL_ecc_2026-07-06.md)                                                                                                                                                                                          |
| Open-Notebook               | Jupyter alternative                           | reject                                                 | No data-science notebook need in stack                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Career-Ops                  | AI job-search auto-apply                      | reject                                                 | Out of scope                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Container                   | "Second brain" knowledge base                 | reject                                                 | Duplicates Obsidian vault                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| PM-Skills                   | Product-manager copilot                       | reject                                                 | Single-owner marketing lead, no product team                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

Adopted in this session: Markitdown, `/trend-research`, `/anti-ai-slop` taste
pass. Headroom existence/identity verified 2026-07-06 (was an open decision;
see table above and the linked eval card) — still scout, not yet lab.

## Scouting pass — 2026-07-06 (owner: "aggiungiamo tutto il necessario")

Owner asked to expand tooling support broadly. Read against the 2026-07-05
lean-config audit (already canonical, deliberately trimmed): the leverage
today is turning on what's already built/decided but dormant (GA4 MCP auth,
`claude-review.yml` secret, GCP/Firebase key rotation), not adding new
surface area. Two genuinely new candidates from the existing radar were
verified this session rather than left as unconfirmed claims:

- **Headroom** — see updated row above and
  [docs/50_Scratch/TOOLING_EVAL_headroom_2026-07-06.md](50_Scratch/TOOLING_EVAL_headroom_2026-07-06.md).
  Confirmed to be a real, actively-maintained project matching the described
  use case; also confirmed a naming collision with an unrelated
  `gglucass/headroom-desktop` product. Still scout, not lab — the data-flow
  question (does anything leave the machine) was not resolved.
- **superdesign.dev** — see updated rows above and
  [docs/50_Scratch/TOOLING_EVAL_superdesign_2026-07-06.md](50_Scratch/TOOLING_EVAL_superdesign_2026-07-06.md).
  Repo is active (contrary to what the deprecated-listing framing alone
  implied), but the maintainers themselves say the IDE extension is no
  longer their focus (product pivoted to a hosted web app); `secure-design`
  fork is now the stale option, not upstream. Lab scope narrowed accordingly.

Everything else scanned in this pass (GitHub managed MCP, `gh skill`, Gemini
CLI, research/crawl MCP, re-enabling the ~90 dormant wshobson/VoltAgent
plugins, generic design skills already banned in `CLAUDE.md`) stays at scout
or reject — no new duplication or off-brand surface was added.

## Scouting pass — 2026-07-21 (owner: "puoi ampliare le tue capacita?")

General capability-expansion scan, not tied to a specific task. Cross-checked
against `AI_AGENT_STACK.md` current MCP set and the 2026-07-06 pass above to
avoid re-litigating settled items.

| Candidate                                                            | Type                 | Source                                                                                                                                                | Travellini use case                                                                                                                                                     | Benefit                                                                                                 | Risk                                                                                                                                                  | Permissions                                         | Duplication                                                                                        | Stage       | Next action                                                                                                                                                |
| -------------------------------------------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Skill Creator 2.0** (test-measure-refine)                          | skill authoring tool | `anthropics/skills` (official, github.com/anthropics/skills)                                                                                          | Measure trigger-rate and catch regressions across the ~50 local Travellini skills, instead of relying on manual "looks good" review                                     | Official, maintained by Anthropic; versioned evals instead of prompt tinkering; no new external surface | Consumes Claude credits per eval run; another meta-layer to keep in sync with `.agents/skills` canonicalization                                       | None beyond normal Claude Code plugin               | None — nothing today measures skill description trigger accuracy                                   | **lab**     | Trial on one already-canonicalized skill (e.g. `mcp-evaluator`) in a sandbox context before any wider rollout                                              |
| **Firecrawl MCP** (official mendableai/firecrawl-mcp-server)         | MCP                  | github.com/firecrawl/firecrawl-mcp-server (official, actively maintained)                                                                             | Fills the open "Research/crawl MCP" radar slot — competitor SEO research, `/design-research` crawling, content extraction for `/verify-facts`/`/ai-seo`                 | Official, keyless free tier for scrape/search, replaces ad hoc `WebFetch` loops for structured crawl    | `crawl`/`map`/`extract` need a paid API key; third-party scraping ToS exposure; another external content-pipeline dependency                          | Keyless for scrape/search; API key for deeper tools | Partial overlap with existing `WebFetch`/`WebSearch` — justified only if crawl depth exceeds those | scout → lab | Lab-only, keyless mode, scoped to one `/design-research` or `/ai-seo` task; evaluation card before anything past that                                      |
| **Google Search Console MCP** (community, no single official server) | MCP                  | Fragmented: `ahonn/mcp-server-gsc`, `AminForou/mcp-gsc`, `acamolese/google-search-console-mcp` (read-only, OAuth, MIT) — no first-party Google server | Live search performance data (queries, CTR, position) feeding `/seo-check` / `/ai-seo` / `travellini-seo-conversion-strategist`, which today are structural-only audits | Real capability gap — nothing in the stack pulls live GSC data                                          | OAuth to the owner's production Search Console property; no single trusted "official" implementation, so source selection itself is supply-chain risk | Google OAuth — **OWNER ONLY**, no repo secrets      | High — duplicates the already-decided-but-dormant GA4 MCP noted in the 2026-07-06 pass             | **defer**   | Do not add a second overlapping Google-auth surface. Activate the already-approved GA4 MCP first; revisit GSC only if GA4 doesn't cover query-level signal |

Rejected as noise this pass: a cluster of SEO "MCP" listicles (SE Ranking,
Ahrefs, Semrush, DataForSEO official connectors) surfaced almost entirely
through vendor-marketing blogs (seoprofy, seranking, mcp.directory,
contextbolt, agilityportal) rather than neutral sources — same pattern as the
2026-06-22 syntaix.ai carousel. No unmet need is documented for a paid
rank-tracking suite on a single-owner site; reject until the owner names a
specific subscription already in use. Also out of scope: Datadog MCP,
Atlassian/Jira MCP, Docker MCP — no observability/ticketing/container need in
this stack.

### Expanded pass, same session — additional categories

| Candidate                                                       | Type                        | Source                                                             | Travellini use case                                                                                                                           | Benefit                                                                                                                   | Risk                                                                                                                                                         | Permissions                                | Duplication                                                | Stage                    | Next action                                                                                                                                                                                                                            |
| --------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------ | ---------------------------------------------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GitHub Copilot Agent HQ / agentic PR review**                 | GitHub-native agent         | github.blog changelog, docs.github.com (official)                  | Copilot's agentic code review now reads repo-level `AGENTS.md` directly — the project already maintains one as the canonical cross-tool guide | Zero new setup if Copilot is ever enabled on this repo; reuses existing `AGENTS.md` instead of a second instructions file | Only matters if GitHub Copilot is actually enabled for this repo — unconfirmed                                                                               | Repo/org Copilot license                   | None — additive to existing `AGENTS.md`, not a replacement | scout                    | No action unless the owner enables Copilot on this repo; if so, no new doc needed, `AGENTS.md` already qualifies                                                                                                                       |
| **AI photo-editing tools** (Luminar Neo, Aftershoot, Imagen AI) | desktop/SaaS photo software | Vendor sites, cross-checked across multiple 2026 comparison pieces | Batch culling/editing of Rodrigo & Betta's own travel photography before it enters `travellini-asset-curator`'s pipeline                      | Real gap — nothing in the current stack touches raw-photo editing, only in-repo image handling/optimization               | Paid subscriptions; output quality claims are vendor-sourced, not independently verified here                                                                | Local app / vendor account, no repo access | None — upstream of the repo, doesn't touch code or MCP     | scout                    | Only relevant if the owners want to change their offline photo workflow; not a code/MCP decision, flag to `travellini-asset-curator` scope only if raised                                                                              |
| **Firebase MCP — expanded scope** (already-adopted server)      | MCP (existing)              | firebase.blog (official), last updated 2026-07-14                  | The already-enabled `firebase` MCP now also exposes Cloud Messaging, Remote Config, and Crashlytics, not just Firestore/Auth                  | No new integration needed — capability grew on a server already trusted and enabled                                       | Broader blast radius on an already-trusted server; confirm which of the new tool categories are actually exposed under current scopes before relying on them | Same as current `firebase` MCP auth        | N/A — same server, wider surface                           | **re-verify**            | Before using Remote Config/Crashlytics/Messaging tools from this MCP, confirm they're read-scoped the same way Firestore tools are today                                                                                               |
| **Stripe MCP — Treasury tools** (already-adopted server)        | MCP (existing)              | docs.stripe.com (official)                                         | The already-enabled `stripe` MCP can now be extended with Treasury tools that move money, pay bills, and manage cards                         | N/A — this is a risk flag, not a benefit for this project                                                                 | High — money-movement actions on a server already in `.mcp.json`; must never be reachable without explicit owner approval per turn                           | Stripe account/API key already configured  | N/A                                                        | **flag — do not enable** | Verify Treasury tools are not part of the current Stripe MCP tool allowlist in `.mcp.json`/`settings.json`; if they are, restrict immediately — OWNER ONLY, matches existing Stripe write-op policy in `CLAUDE.md`/`AI_AGENT_STACK.md` |

No new stable adoption from this expanded pass. The two "already-adopted server gained new scope" rows are the highest-value finding: they're not new integrations to evaluate, they're **known servers whose blast radius changed underneath the existing config** and should be spot-checked, especially the Stripe Treasury addition.
