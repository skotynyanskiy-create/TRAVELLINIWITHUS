# TRAVELLINIWITHUS — Shared AI Operating Rules

This repository is the website and marketing operating system for the travel creator brand `@travelliniwithus`.

## Single source of truth

- Code truth: repo root
- Documentation and operational truth: `docs/`
- Obsidian vault: `docs/`, relativo alla radice del repo — mai un percorso assoluto di macchina
- Operational Obsidian notes: `docs/`
- Design-system truth for agents and design tools: `DESIGN.md`
- Agent stack truth: `docs/AI_AGENT_STACK.md`
- AI operations dashboard: `docs/AI_OPERATIONS_DASHBOARD.md`
- Marketing operating hub: `docs/MARKETING_OPERATIONS_HUB.md`
- Project hub: `docs/10_Projects/PROJECT_TRAVELLINIWITHUS_SITE.md`
- Editorial rules: `docs/EDITORIAL_GUIDE.md`
- Vault taxonomy and naming: `docs/OBSIDIAN_TAXONOMY.md`

## Cosa leggere, e quando

`CLAUDE.md` è il contratto operativo e **vince su questo file** ovunque i due si
sovrappongano: precedenza, limiti, routing, barra di qualità. Questo file esiste
per gli strumenti che leggono `AGENTS.md` e non `CLAUDE.md` — leggi comunque
`CLAUDE.md` per primo se puoi.

**Non precaricare `docs/`**: sono 319 note `.md` su 401 file. Apri solo la nota che il compito
richiede, dall'elenco qui sopra. Gli hub Obsidian (`OBSIDIAN_HOME`,
`OBSIDIAN_DASHBOARD`) si aprono quando si lavora sul vault, non a ogni sessione.

## Project context

- Brand: Rodrigo & Betta / Travelliniwithus
- Role of repository owner: marketing lead / website builder
- Primary language for UI and content: Italian
- Website goals:
  - brand clarity
  - editorial authority
  - partnerships / media kit conversion
  - lead capture
  - affiliate / shop monetization

## Working rules for any AI agent

- Do not treat Obsidian notes as optional side material. `docs/` is part of the working system.
- Use `.agents/skills` as the canonical local skill source. Run `npm run sync:agents` after editing skills.
- Use `DESIGN.md` for UI direction, Stitch/Figma prompts and design-system interpretation.
- Do not import external skill behavior directly into the repo without adapting it locally and documenting the source in `docs/AI_AGENT_STACK.md`.
- New AI/dev tooling is allowed in scouting. Follow `docs/AI_AGENT_STACK.md` and `docs/AI_TOOLING_RADAR.md`: research freely, test only in lab after confirmation, adopt only with a tooling evaluation card.
- Use `docs/AI_OPERATIONS_DASHBOARD.md` to choose SAFE / BUILD / OWNER ONLY before AI/dev workflow changes.
- Improve the AI operating system over time: when a task reveals a reusable lesson, tool candidate, guardrail, skill, workflow or simplification, capture it in the relevant AI operations note instead of leaving it only in chat.
- When changing important UI, flows, positioning or operations, update the relevant note in `docs/`.
- If a change affects homepage, navbar, collaborations, content architecture or release readiness, update or create a project note.
- If a change introduces or resolves a bug, create or update a bug note.
- If a new campaign, partner lead or content plan appears, use the marketing templates in `docs/90_Templates/`.

## Note operative di riferimento

- Homepage / UI: `docs/10_Projects/PROJECT_HOME_RICOMPOSIZIONE_2026-07-26.md`
  — il vecchio `docs/10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT.md` è
  archiviato, non usarlo
- Sezione destinazioni: `docs/10_Projects/PROJECT_DESTINATIONS_SECTION_REVIEW.md`
- Stato della release: `docs/10_Projects/PROJECT_RELEASE_READINESS.md`
- Cosa fare adesso: `docs/10_Projects/PROJECT_BACKLOG_UNICO_2026-07-31.md`
- Hub campagne: `docs/MARKETING_OPERATIONS_HUB.md`

## Code conventions

- React 19 + TypeScript + Vite 6
- Tailwind CSS 4 + CSS variables
- Prefer typed props and explicit interfaces
- Keep Firestore operations centralized unless there is a clear reason not to
- Preserve the existing visual language unless a redesign is explicitly requested

## File ad alto rischio

**Bloccati da un hook**, modificabili solo con conferma esplicita dell'owner:
`firestore.rules`, `src/config/admin.ts`. Vedi `CLAUDE.md` per la procedura di
sblocco, che va seguita alla lettera.

**Non bloccati da niente ma altrettanto delicati**, perché sono il codice che
serve davvero la produzione:

- `src/server/apiRoutes.ts` — qui vive il webhook Stripe
- `functions/src/index.ts` — la Cloud Function reale, con Admin SDK che scavalca
  `firestore.rules`
- `firebase.json`, `.firebaserc` — header, rewrite, e dove finisce un deploy

`server.ts` è il server di sviluppo e del self-host: **non viene eseguito su
Firebase Hosting**, che serve `dist/` come file statici. Toccarlo non cambia la
produzione; toccare `src/server/apiRoutes.ts` sì.

## Controlli da eseguire

I comandi stanno in `package.json` e il gate di ogni regola è dichiarato in
`CLAUDE.md`, accanto alla regola stessa. Due avvertenze che non si deducono dai
nomi: `npm run predeploy` **non** esegue performance né browser — quello è il
gate della skill `/predeploy`; e `npm run stato` rigenera `docs/STATO_DEL_SITO.md`,
che non va scritto a mano.

## Marketing-specific operating model

`docs/MARKETING_OPERATIONS_HUB.md` è la dashboard di marketing. I modelli vivono
tutti in `docs/90_Templates/`, un file per tipo di lavoro:

| Cosa stai tracciando                | Modello in `docs/90_Templates/`                         |
| ----------------------------------- | ------------------------------------------------------- |
| Campagna                            | `TPL_Campaign`                                          |
| Partner o collaborazione            | `TPL_Partner`, `TPL_Collaboration` (esteso)             |
| Piano editoriale                    | `TPL_Content_Brief`                                     |
| Articolo, guida, itinerario         | `TPL_Article`, `TPL_Destination_Guide`, `TPL_Itinerary` |
| Posto o hotel                       | `TPL_Place`                                             |
| Audit SEO di pagina                 | `TPL_SEO_Page`                                          |
| Prodotto                            | `TPL_Product`                                           |
| Checkpoint di release               | `TPL_Release_Note`                                      |
| Ritaglio web, riferimento di design | `TPL_Web_Clip`, `TPL_Design_Reference`                  |

## Public brand references

- Instagram: `https://www.instagram.com/travelliniwithus/?hl=it`
- Website: `https://www.travelliniwithus.it/`

Use the local note `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md` as the normalized reference.
