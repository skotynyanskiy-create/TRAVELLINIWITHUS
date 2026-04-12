# /commit

Create a well-formed git commit for the TRAVELLINIWITHUS project.

## Arguments

Optional: commit message hint (e.g. `/commit fix hero LCP`)

## Steps

### 1. Understand what changed

Run:
```bash
git status
git diff --staged
git diff
```

Read the diff carefully. Identify:
- What files changed
- What was the intent (fix, feature, refactor, content, style, docs)
- Which part of the system is affected (ui, firebase, stripe, seo, admin, content, config)

### 2. Stage files

Stage all relevant modified files. Do NOT stage:
- `.env` or any file with secrets
- `dist/` build output
- `node_modules/`
- Temporary or scratch files

### 3. Write the commit message

Use conventional commit format:

```
type(scope): short imperative description

Optional body: why this change was made, not what.
```

**Types:**
- `feat` — new feature or component
- `fix` — bug fix
- `style` — visual/UI-only change, no logic
- `refactor` — code restructure, no behavior change
- `content` — text, copy, brand content change
- `seo` — meta tags, structured data, sitemap
- `perf` — performance improvement
- `chore` — config, deps, tooling
- `docs` — documentation or Obsidian notes only

**Scopes for this project:**
`hero`, `navbar`, `home`, `destinations`, `shop`, `article`, `admin`, `firebase`, `stripe`, `seo`, `pwa`, `obsidian`, `deps`

**Examples:**
```
feat(home): add trust pills to hero section
fix(navbar): close mobile menu on route change
perf(hero): add fetchpriority=high to LCP image
seo(pwa): generate PNG icons and og-default image
content(hero): update headline copy
```

### 4. Check Obsidian notes

After the commit, ask: does this change affect an open project note?

- UI change → check `docs/10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT.md`
- Release work → check `docs/10_Projects/PROJECT_RELEASE_READINESS.md`
- Marketing → check `docs/MARKETING_OPERATIONS_HUB.md`

If yes, update the note before or in the same commit (use `docs` scope if updating only notes).

### 5. Commit

```bash
git add [specific files]
git commit -m "type(scope): description"
```

## Output

Show the commit hash, message, and list of files committed.
