---
type: hub
area: brand
status: active
priority: p0
owner: team
tags:
  - brand
  - moc
  - hub
  - knowledge
---

# Brand Knowledge MOC — mappa canonica

> **Punto unico** per brand, social, Family, presenza online e decisioni correlate.  
> Apri questa nota quando lavori su identità, media kit, IG, competitor o coerenza vault.

## Ordine di lettura (agent + umano)

1. [[BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS]] — numeri e handle pubblici
2. [[BRAND_TRAVELLINI_FAMILY]] — sub-brand Family (parte del progetto)
3. [[20_Decisions/DECISION_TRAVELLINI_FAMILY_BOUNDARY_2026-07-23]] — confini ufficiali
4. [[13_Content/DOSSIER_PRESENZA_ONLINE_TRAVELLINIWITHUS_2026-07-23]] — iper-ricerca social (Part I–III)
5. [[TRAVELLINIWITHUS_BRAND_MEMORY]] — memoria estesa (verificare date: aggiornata 2026-03)
6. [[BRAND_MESSAGING_STRATEGY]] — messaging (attenzione: bozze con claim non pubblicabili)
7. [[EDITORIAL_GUIDE]] — voce e regole copy
8. [[20_Decisions/DECISION_PUBLIC_METRICS_SOURCE_TRAVELLINIWITHUS_2026-06-07]] — quali numeri pubblicare
9. [[20_Decisions/DECISION_IMAGERY_TRUTH_RULE_2026-07-22]] — foto reali vs craft

## Cluster per area

### Identità e trust

- Snapshot pubblico · Family · Metrics decision · Imagery truth · AGCOM/Meta in `src/config/site.ts`

### Social e presence

- Dossier presenza online (IG, Linktree, TikTok, footprint, Emilia, competitor)
- [[13_Content/INSTAGRAM_CONTENT_AUDIT_2026-07-21]]
- [[13_Content/IG_CONTENT_ANALYSIS_2026-07-15]]
- [[13_Content/CONTENT_PILLARS_TRAVELLINIWITHUS]]
- [[13_Content/CONTENT_CALENDAR_H2_2026]]
- [[13_Content/CONTENT_PROOF_LIBRARY_TRAVELLINIWITHUS]]

### Commerciale

- [[MARKETING_OPERATIONS_HUB]]
- [[12_Partnerships/PARTNER_PIPELINE_TRAVELLINIWITHUS]]
- [[12_Partnerships/CASE_STUDY_EMILIA_FANTASTICA_CASTELLI_DUCATO]]

### Sito e release

- [[10_Projects/PROJECT_TRAVELLINIWITHUS_SITE]]
- [[10_Projects/PROJECT_RELEASE_READINESS]]
- [[10_Projects/PROJECT_COMPETITIVE_DESTINATIONS_ANALYSIS]]
- Design system repo: `DESIGN.md` (root, fuori vault)

### Workspace dual-graph

- [[20_Decisions/DECISION_0004_OBSIDIAN_GRAPHIFY_SPLIT_VAULT_STRATEGY]]
- [[VAULT_AND_GRAPHIFY_OPERATING_STATE]] — stato operativo dopo allineamento 2026-07-23
- Obsidian = `docs/` · Graphify = codice root

## Regole di coerenza (non negoziabili)

| Tema                      | Fonte di verità                                    |
| ------------------------- | -------------------------------------------------- |
| Follower / stats pubblici | `src/config/site.ts` + snapshot + metrics decision |
| Family                    | [[BRAND_TRAVELLINI_FAMILY]] + decision boundary    |
| Presence research         | Dossier 2026-07-23 (non chat)                      |
| Voce italiana             | [[EDITORIAL_GUIDE]]                                |
| Foto persone/luoghi       | Imagery truth decision                             |
| Vault vs code graph       | DECISION_0004                                      |

## Alert aperti (da dossier Part III)

- [ ] Timeline/anni pubblici (5 vs 8 vs 2017/2018)
- [ ] Nazionalità Rodrigo (cubano vs llms “italiano”)
- [ ] Rewrite `public/llms*.txt`
- [ ] Telegram URL in site config
- [ ] Bio hub path unico
- [ ] Sito live holding vs repo
- [ ] Insights owner

## Non usare come verità

- Chat AI non salvata in `docs/`
- Claim in `BRAND_MESSAGING_STRATEGY` con case study/prezzi non verificati
- Third-party analytics non datati (TikBuddy, ecc.)
- Somma audience Travel+Family

## Manutenzione

| Quando               | Azione                                            |
| -------------------- | ------------------------------------------------- |
| Nuova ricerca social | Aggiornare dossier o sotto-nota datata + link qui |
| Cambio metriche      | `site.ts` + snapshot + DECISION metrics           |
| Cambio policy Family | Aggiornare Family note + decision boundary        |
| Nuovo hub            | Link da [[OBSIDIAN_HOME]] e questo MOC            |
