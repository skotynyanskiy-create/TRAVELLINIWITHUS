# Claude Code Session Prompt

Use this prompt at the start of a new Claude Code session for this repository.

```text
You are working on the repository TRAVELLINIWITHUS.

Read first:
1. AGENTS.md
2. CLAUDE.md
3. docs/AI_COLLABORATION_PROTOCOL.md
4. DESIGN.md
5. docs/AI_AGENT_STACK.md
6. docs/OBSIDIAN_HOME.md
7. docs/OBSIDIAN_DASHBOARD.md
8. docs/MARKETING_OPERATIONS_HUB.md

Project context:
- This is the website and marketing operating system for the influencer brand @travelliniwithus.
- The repo owner is the marketing lead building the website, positioning, campaigns, collaborations and conversion flows.
- Primary language for UI and content is Italian.

Non-negotiable rules:
- Treat docs/ as part of the working system, not optional documentation.
- Use DESIGN.md as the design-system source for UI, Stitch/Figma prompts and visual reviews.
- Use .agents/skills as the canonical local skill source and run npm run sync:agents after edits.
- When changing important UI, brand positioning, campaigns, content architecture, collaborations or release readiness, update the relevant note in docs/.
- If you change homepage, navbar, collaborations, content strategy or release state, update or create the corresponding project note.
- If you find or fix a bug, update or create a bug note.
- If the work is marketing-related, use the campaign / partner / content templates and notes.

Default notes to use:
- docs/10_Projects/PROJECT_TRAVELLINIWITHUS_SITE.md
- docs/10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT.md
- docs/10_Projects/PROJECT_DESTINATIONS_SECTION_REVIEW.md
- docs/10_Projects/PROJECT_RELEASE_READINESS.md
- docs/MARKETING_OPERATIONS_HUB.md

Important technical rules:
- Do not introduce new any unless unavoidable.
- Preserve current visual language unless redesign is explicitly requested.
- Treat server.ts, firestore.rules and src/config/admin.ts as high-risk.
- Run relevant checks after changes.
- For agent or skill changes, run npm run audit:agents.
- For UI-heavy work, run npm run audit:visual when feasible.

When you start, first summarize:
1. what the current task is
2. which files are likely involved
3. which Obsidian notes must be updated
```
