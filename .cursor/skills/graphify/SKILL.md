---
name: graphify
description: Query and maintain the local Graphify code knowledge graph for TRAVELLINIWITHUS. Use for architecture, dependency, call-path, blast-radius, affected-code, or cross-file questions when graphify-out/graph.json exists, and when the user asks to build, refresh, inspect, benchmark, or use Graphify. Do not use for editorial vault searches or ordinary single-file lookups.
---

# Graphify

Use the project-local, pinned CLI. Do not run Graphify's platform installers,
MCP mode, global graph, git hooks, watch mode, semantic extraction, labeling,
URL ingestion, media extraction, or Obsidian export unless the owner explicitly
approves that additional scope.

## Project anchors

Before changing the integration, read `AGENTS.md`, `CLAUDE.md`,
`docs/MARKETING_OPERATIONS_HUB.md` and
`docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`.

## Workflow

1. Confirm `.tools/graphify/Scripts/graphify.exe` exists. If missing, run
   `npm run graphify:setup`.
2. Confirm `.graphifyignore` still limits indexing to code and architecture
   files. Never index `.env*`, `.obsidian/`, `docs/`, `public/`, media, or local
   agent configuration.
3. If `graphify-out/graph.json` is missing or stale after structural code
   changes, run `npm run graphify:index`.
4. Prefer the smallest relevant command:
   - architecture/dependency question:
     `npm run graphify:query -- "<question>"`
   - impact analysis:
     `npm run graphify:affected -- "<symbol>" --depth 2`
   - focused symbol context:
     `npm run graphify:explain -- "<symbol>"`
   - relationship between two symbols:
     `npm run graphify:path -- "<A>" "<B>"`
5. Treat graph output as an index, not proof. Open and verify the cited source
   files before making changes or reporting exact behavior.
6. Use `GRAPH_REPORT.md` only for broad architecture review. Do not load it for
   routine questions when a scoped query is sufficient.
7. Fall back to `rg` for route literals, URL strings, dynamic imports, runtime
   wiring, or ambiguous symbol names. Graphify 0.9.6 can miss string-based
   relationships such as `fetch('/api/...')`.

## Obsidian coexistence

- Keep Graphify code-only. Obsidian owns the operational `docs/` knowledge
  graph; do not export a Graphify wiki into the live vault.
- Keep `.tools/` and `graphify-out/` in Obsidian's `userIgnoreFilters`.
- Use `npm run graphify:watch` only during sustained architecture work. It is
  intentionally not an automatic startup task or git hook.
- Use `npm run graphify:check` to check whether the local graph needs refresh.

## Maintenance

- Keep `graphifyy==0.9.6` pinned in `scripts/setup-graphify.ps1`.
- Keep `.tools/` and `graphify-out/` ignored by Git.
- Refresh the graph after route, service, data-flow, or dependency changes.
- Run `npm run graphify:benchmark` only when measuring usefulness; it must not
  become a release gate.
- Prefer file labels in `affected` and fully qualified symbols in `path` when
  common names produce an ambiguity warning.

## Rollback

Remove `.tools/graphify` and `graphify-out` only after owner confirmation, then
revert the tracked Graphify files with Git. Graphify's automatic uninstall is
not applicable because its platform installers and hooks are intentionally not
used.
