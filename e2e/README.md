# e2e/ — Playwright end-to-end tests

Guida sintetica per eseguire, estendere e debuggare la suite E2E del sito TRAVELLINIWITHUS. Gli agenti AI (`travellini-quality-auditor`, `browser-auditor`) e i contributori umani devono partire da qui prima di toccare `e2e/`.

## Cosa c'è dentro

| Spec                        | Cosa copre                                                               |
| --------------------------- | ------------------------------------------------------------------------ |
| `home.spec.ts`              | caricamento homepage, hero, CTA principali                               |
| `a11y-smoke.spec.ts`        | pass `@axe-core/playwright` su pagine pubbliche chiave                   |
| `forms.spec.ts`             | submit newsletter / contatti / media-kit → persistenza `leads` Firestore |
| `hotel-flow.spec.ts`        | navigazione da homepage a scheda hotel e back                            |
| `shop-and-checkout.spec.ts` | add-to-cart, drawer, checkout mock (richiede `ALLOW_MOCK_CHECKOUT=true`) |
| `visual-quality.spec.ts`    | screenshot regression su pagine critiche                                 |

## Config

`playwright.config.ts` in root:

- `baseURL: http://localhost:3000`
- `webServer`: avvia automaticamente `npm run dev` se non attivo (`reuseExistingServer` true in locale)
- Projects: `chromium` (desktop) + `Mobile Chrome` (Pixel 5)
- Su CI: `retries: 2`, `workers: 1`, `forbidOnly: true`

Non aggiungere progetti browser senza ragione: ogni progetto moltiplica il tempo di CI.

## Come eseguire

```bash
# Tutta la suite (entrambi i project)
npm run e2e

# Un singolo spec
npx playwright test e2e/home.spec.ts

# UI mode interattivo (raccomandato in dev)
npx playwright test --ui

# Solo un project
npx playwright test --project=chromium

# Shortcut audit dedicati (già in package.json)
npm run audit:visual     # solo visual-quality.spec.ts
npm run audit:a11y       # solo a11y-smoke.spec.ts, timeout 60s
npm run audit:forms      # solo forms.spec.ts
npm run audit:qa         # visual + a11y + forms in sequenza
```

## Debug

```bash
# Step-by-step con inspector
npx playwright test e2e/home.spec.ts --debug

# Headed (browser visibile)
npx playwright test e2e/home.spec.ts --headed

# Trace completo (aperto con `npx playwright show-trace`)
npx playwright test e2e/home.spec.ts --trace on

# Report HTML dell'ultima run
npx playwright show-report
```

## Aggiornare i visual snapshot

`visual-quality.spec.ts` confronta screenshot. Quando il redesign è intenzionale:

```bash
npx playwright test e2e/visual-quality.spec.ts --update-snapshots
```

Poi committare i nuovi PNG in `e2e/__snapshots__/` o la cartella dove Playwright li ha messi (ispeziona il diff prima di commit).

## Quando aggiungere uno spec

Soglia: **flow pubblico critico non ancora coperto + chiaro fail-case osservabile**. Esempi:

- nuova conversion route (es. `/collaborazioni` → lead Firestore): spec in `forms.spec.ts` o nuovo file.
- nuova pagina commerciale con meta/SEO specifiche: considera `seo-*.spec.ts`.
- bug regressivo che è già uscito una volta: sempre spec.

Naming: `<area>.spec.ts` (kebab-case). Un solo file per area.

## Cosa NON committare

`.gitignore` già esclude:

- `playwright-report/` (HTML report)
- `test-results/` (artifact)
- `qa-final/`, `qa-shots/`, `output/` (cartelle legacy audit)

## Prerequisiti locali

- Node ≥22
- Browser Playwright installati: `npx playwright install --with-deps chromium`
- Dev server raggiungibile su `http://localhost:3000` (la config lo avvia da sola se non c'è)
- `.env.local` opzionale. Per testare il checkout completo impostare `ALLOW_MOCK_CHECKOUT=true`

## Legati a

- [`docs/LAUNCH_CHECKLIST.md`](../docs/LAUNCH_CHECKLIST.md) — Definition of Done per release
- [`docs/DEPLOYMENT_RUNBOOK.md`](../docs/DEPLOYMENT_RUNBOOK.md) — cosa girare prima di promuovere in prod
- [`CONTRIBUTING.md`](../CONTRIBUTING.md) — Definition of Done e convenzioni commit
- [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) — il job `audit-visual` usa questa suite in CI
