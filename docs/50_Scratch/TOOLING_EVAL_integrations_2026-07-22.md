---
type: reference
area: workspace
status: active
tags:
  - ai
  - tooling
  - evaluation
  - mcp
  - skills
---

# Tooling Evaluation — 2026-07-22 Integrations Pass

Evaluation card for the four high-leverage integrations requested and approved by the owner on 2026-07-22.

## 1. Firecrawl MCP (`firecrawl`)

- **Type**: MCP Server
- **Source**: `@mendable/firecrawl-mcp-server` (Official, MIT)
- **Purpose**: Deep web scraping, competitor SEO research, design reference crawling, and fact verification (`/verify-facts`, `/ai-seo`, `/design-research`).
- **Configuration**: Added to `.mcp.json` under `firecrawl`. Works in keyless free-tier for basic scrape/search; optional `FIRECRAWL_API_KEY` for deep crawling.
- **Stage**: `lab` $\rightarrow$ `adopt`

## 2. GA4 Analytics MCP (`analytics`)

- **Type**: MCP Server
- **Source**: `@google-cloud/analytics-mcp@0.1.0` (Official Google Cloud)
- **Purpose**: Live extraction of Google Analytics 4 traffic, conversion, and event data for `travellini-data-analyst`.
- **Configuration**: Added to `.mcp.json` under `analytics`.
- **Owner Action Needed**: Run `gcloud auth application-default login` to authenticate Application Default Credentials.
- **Stage**: `lab`

## 3. Superdesign.dev IDE Sandbox (`.superdesign/`)

- **Type**: IDE Prototyping Companion
- **Source**: `SuperdesignDev.superdesign-official`
- **Purpose**: Isolated visual component mockups for React 19 + Tailwind 4 inside `.superdesign/`.
- **Configuration**: `.superdesign/` added to `.gitignore` so experimental mockups never pollute production repository code directly.
- **Stage**: `lab`

## 4. Skill Creator 2.0 (`scripts/eval-skills.mjs`)

- **Type**: Skill Evaluation & Quality Framework
- **Source**: Local Travellini adaptation of Anthropic Skill Creator pattern.
- **Purpose**: Measure trigger quality, YAML frontmatter integrity, description length, and project doc references across all 53 canonical skills.
- **Configuration**: Added `scripts/eval-skills.mjs` and `"eval:skills"` npm script.
- **Stage**: `adopt`
