# TRAVELLINIWITHUS — Agent stack

Single source of truth for which agent does what. All agents below are project-scoped (live in this directory). For routing rules and ambiguity resolution, see `CLAUDE.md`.

**Il modello di ciascun agente sta nel `model:` del suo frontmatter, che è ciò
che gira davvero.** Non è elencato qui: una copia in prosa diverge dal file al
primo cambio, e il modello del thread principale lo decide comunque l'harness,
non il repo. Instrada per _agente_, mai asserendo un tier.

---

## Orchestration

| Agent                         | When to invoke                                                                               | Output                                                  |
| ----------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **`travellini-orchestrator`** | Request touches 2+ domains, "voglio lanciare X", "fai una pagina /Y", before pre-deploy gate | Multi-agent plan with locked decisions + handoff briefs |

If unsure where to start: invoke orchestrator first.

---

## Strategy & decisions

| Agent                                    | Owns                                                                                                                      | Does NOT own                                                                           |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **`travellini-growth-revenue-operator`** | Offer design, partner pipeline, campaign prioritization, lead qualification, analytics event contracts, "what next" calls | Italian copy (→ seo-strategist), data interpretation (→ data-analyst)                  |
| **`travellini-data-analyst`**            | Reading GA4 / Sentry / Stripe / Firestore via MCP, weekly reports, funnel analysis, A/B test interpretation               | Defining what to track (→ growth-operator), implementing tracking (→ frontend-builder) |

---

## Content & copy

| Agent                                      | Owns                                                                                                                     | Does NOT own                                                                                   |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| **`travellini-seo-conversion-strategist`** | Italian landing copy, hero/CTA/meta, schema.org, sitemap/robots/canonical, lead-capture/media-kit copy                   | Long-form article body (→ editorial-writer), social captions (→ social-content-operator)       |
| **`travellini-editorial-writer`**          | Pillar articles, destination guides, itineraries, travel stories (1500-3500 parole) in R&B voice                         | Meta/H1/slug (→ seo-strategist), social captions (→ social-content-operator)                   |
| **`travellini-social-content-operator`**   | Instagram/Reels/TikTok concepts, calendars, hooks/captions/shot lists, newsletter drafts, pillar→multi-channel repurpose | Technical SEO (→ seo-strategist), growth strategy (→ growth-operator), UI work (→ ui-designer) |

---

## Design & assets

| Agent                          | Owns                                                                                                               | Does NOT own                                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| **`travellini-ui-designer`**   | Visual direction, premium UI critique, hero/navbar/section direction, media-kit visual design, brand fit           | Implementation (→ frontend-builder), copy (→ seo-strategist), photo selection (→ asset-curator)   |
| **`travellini-asset-curator`** | Photo direction, image selection, alt text Italian, crop/focal point, social-card art direction, image performance | Layout decisions (→ ui-designer), code-level image components (→ frontend-builder), video editing |

---

## Implementation

| Agent                             | Owns                                                                                                                            | Does NOT own                                                                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **`travellini-frontend-builder`** | React/Tailwind for pages and components, route wiring, motion integration, responsive fixes, visible UI bugs                    | `src/server/apiRoutes.ts`/`functions/`/`firestore.rules`/`src/config/admin.ts` (→ backend-engineer), open-ended exploration (→ code-explorer), visual direction (→ ui-designer) |
| **`travellini-backend-engineer`** | `src/server/apiRoutes.ts` (webhook Stripe), `functions/`, `server.ts`, `firestore.rules`, `src/config/admin.ts`, Firebase config, security rules, indexes | Client React components (→ frontend-builder), copy (→ seo-strategist), visual work (→ ui-designer)                                        |

---

## Quality & verification

| Agent                             | Owns                                                                                                                                 | Does NOT own                                                                                                   |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| **`travellini-quality-auditor`**  | Release-readiness, static checks via `npm run audit:*`, code health, a11y basics, SEO basics, broken routes/images, stale docs       | Real-browser audits (→ browser-auditor), Italian copy (→ seo-strategist), code edits                           |
| **`browser-auditor`**             | Real-browser UX/responsive/console audit via Playwright MCP, form flow testing, regression verification at 375/768/1280              | Code edits, file exploration, static analysis (→ quality-auditor)                                              |
| **`travellini-security-auditor`** | Secrets in repo/history, Stripe webhook integrity, Firestore rules audit, Vite `VITE_*` exposure, CORS, security headers, admin gate | Fixing the findings (→ backend-engineer), broader code quality (→ quality-auditor)                             |
| **`travellini-perf-engineer`**    | LCP/INP/CLS/TTFB targets, bundle size, font/image loading, code split, prefetch/preload, route-level perf via Chrome DevTools MCP    | Photo selection (→ asset-curator), implementation (→ frontend-builder), business decisions (→ growth-operator) |

---

## Code intelligence (generic)

| Agent                             | Owns                                                                                | Use when                                                                                                        |
| --------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **`code-explorer`**       | Fast read-only search, file exploration, pattern matching, log reading              | Any "where is X" / "what does Y do" / "show me Z" question. **First choice for anything before touching code.** |
| **`code-architect`** | Multi-file refactor, breaking architectural decisions, complex multi-step debugging | Only when the problem is genuinely hard. Most work doesn't need it.                                             |

---

## Quality model

I gate crescono con quello che è in gioco. Una barra uguale per tutto non viene
rispettata: il `ROUTING_LOG` mostra `quality-auditor` e `browser-auditor` invocati
7 volte su 135 dispatch, cioè la regola «tre gate sempre» non è mai stata la
pratica reale.

**Una singola modifica** — il gate è quello dichiarato accanto alla regola nella
tabella «Cosa significa fatto» di `CLAUDE.md`: typecheck, lint, `audit:ui`,
`audit:visual`, e per qualunque cosa visibile **guardarla in un browser vero**.
Nessun agente di revisione obbligatorio.

**Prima di un rilascio o di un deploy** — i gate completi, che è quello che la
skill `/predeploy` orchestra:

1. **Specialista di dominio** — l'agente che possiede il lavoro firma.
2. **Statico** — `travellini-quality-auditor` esegue gli script e controlla a campione.
3. **Browser reale** — `browser-auditor` verifica il risultato percepito.

Aggiungi **`travellini-security-auditor`** quando la modifica tocca shop, cattura
lead, checkout o autenticazione; **`travellini-perf-engineer`** sulle rotte
sensibili alla performance (home, articoli ad alto traffico).

---

## Excluded global agents

Travelliniwithus uses ONLY the agents above. Global agents under `~/.claude/agents/` (`security-auditor`, `obsidian-librarian`, `python-implementer`, `risk-reviewer`, `test-runner`, `parser-debugger`, `solana-analyst`, `strategy-designer`) belong to other projects and must NOT be invoked from this repo. The travellini-specific equivalents (`travellini-security-auditor`, etc.) are tighter for this stack.

---

## Hand-off pattern

Cross-agent work uses brief files at `docs/50_Scratch/HANDOFF_<slug>_<from>_to_<to>.md` written from `docs/90_Templates/TPL_Agent_Handoff.md`. Decisions get locked once, in writing. After 14 days, untouched handoffs are obsolete.

---

## Canonical workflows

See `CLAUDE.md` → "Cross-agent ambiguity resolution" and `travellini-orchestrator` for the full sequences:

- **S1**: New pillar article
- **S2**: New page / section
- **S3**: Bug (client-only)
- **S4**: Bug (server / Firestore / Stripe)
- **S5**: Performance regression
- **S6**: Pre-deploy gate
- **S7**: Weekly review
- **S8**: A/B test interpretation
- **S9**: Campaign launch
