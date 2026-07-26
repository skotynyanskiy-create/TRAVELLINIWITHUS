---
type: plan
area: content
status: active
priority: p0
owner: Rodrigo & Betta
created: 2026-07-13
tags:
  - content-system
  - instagram
  - discovery
  - map
---

# Fase 2 — Rete Editoriale Proprietaria Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fare di `ContentItem` la sorgente pubblica verificata per schede luogo, Esplora, Mappa, destinazioni, homepage e Reel, mantenendo i draft fuori dall'indice.

**Architecture:** Una funzione pura calcola la pubblicabilità di ogni record; i consumer pubblici usano esclusivamente getter filtrati. Un report generato localmente raccoglie i campi da approvare e un bridge opzionale collega i Reel a una scheda proprietaria pubblicata.

**Tech Stack:** TypeScript, JSON seed, React 19, Vitest, Testing Library, Playwright, Node.js ESM.

## Global Constraints

- Nessun record viene reso pubblico modificando soltanto un booleano.
- Permalink social valido, cover reale, testo curato, luogo, tassonomia e disclosure sono obbligatori.
- Coordinate, recensione, prezzo, deal e proof restano opzionali e non vengono inventati.
- I draft possono essere mostrati soltanto in sviluppo e sempre con `noindex`.
- Il sito deve funzionare anche con zero record pubblicabili.
- L'inserimento manuale resta supportato senza chiavi API.

---

### Task 1: Validatore di pubblicabilità

**Files:**

- Create: `src/lib/contentReadiness.ts`
- Create: `src/lib/contentReadiness.test.ts`
- Modify: `src/types/content.ts`

**Interfaces:**

- Produces: `ContentReadinessIssue`, `getContentReadinessIssues(item)`, `isContentPublishable(item)`.
- Consumes: `ContentItem`.

- [ ] **Step 1: Scrivere i test fallenti**

```ts
import { describe, expect, it } from 'vitest';
import type { ContentItem } from '../types/content';
import { getContentReadinessIssues, isContentPublishable } from './contentReadiness';

const completeItem: ContentItem = {
  id: 'batu-caves-kuala-lumpur',
  source: 'instagram',
  permalink: 'https://www.instagram.com/travelliniwithus/reel/ABC123/',
  mediaType: 'reel',
  cover: '/images/reels/reel-4-cover.webp',
  hook: 'Batu Caves: vale la pena?',
  title: 'Batu Caves a Kuala Lumpur',
  description: 'Ingresso, tempi e limiti raccontati dopo la visita.',
  place: { name: 'Batu Caves', city: 'Kuala Lumpur', country: 'Malesia' },
  zone: 'Asia',
  types: ['Posti particolari'],
  partnership: { kind: 'organic' },
  isPlaceholder: false,
};

describe('content readiness', () => {
  it('accepts a complete owned-content record', () => {
    expect(getContentReadinessIssues(completeItem)).toEqual([]);
    expect(isContentPublishable(completeItem)).toBe(true);
  });

  it('rejects a profile URL, missing cover and placeholder state', () => {
    const invalid = {
      ...completeItem,
      permalink: 'https://www.instagram.com/travelliniwithus/',
      cover: '',
      isPlaceholder: true,
    };
    expect(getContentReadinessIssues(invalid)).toEqual([
      'placeholder',
      'invalid-permalink',
      'missing-cover',
    ]);
    expect(isContentPublishable(invalid)).toBe(false);
  });
});
```

- [ ] **Step 2: Verificare il fallimento**

Run: `npm run test:unit -- src/lib/contentReadiness.test.ts`

Expected: FAIL perché il modulo non esiste.

- [ ] **Step 3: Implementare il validatore**

```ts
import type { ContentItem } from '../types/content';

export type ContentReadinessIssue =
  | 'placeholder'
  | 'invalid-permalink'
  | 'missing-cover'
  | 'missing-hook'
  | 'missing-title'
  | 'missing-description'
  | 'missing-place'
  | 'missing-type'
  | 'missing-partnership';

const SOCIAL_POST_URL =
  /^https:\/\/(www\.)?(instagram\.com\/(p|reel|tv)\/|tiktok\.com\/@[^/]+\/video\/)/i;

export function getContentReadinessIssues(item: ContentItem): ContentReadinessIssue[] {
  const issues: ContentReadinessIssue[] = [];
  if (item.isPlaceholder) issues.push('placeholder');
  if (!SOCIAL_POST_URL.test(item.permalink)) issues.push('invalid-permalink');
  if (!item.cover.trim()) issues.push('missing-cover');
  if (!item.hook.trim()) issues.push('missing-hook');
  if (!item.title.trim()) issues.push('missing-title');
  if (!item.description.trim()) issues.push('missing-description');
  if (!item.place.name.trim() || !item.place.country.trim()) issues.push('missing-place');
  if (item.types.length === 0) issues.push('missing-type');
  if (!item.partnership?.kind) issues.push('missing-partnership');
  return issues;
}

export function isContentPublishable(item: ContentItem): boolean {
  return getContentReadinessIssues(item).length === 0;
}
```

In `ContentItem` conservare temporaneamente `isPlaceholder` come campo obbligatorio per compatibilità; documentare che non è sufficiente a rendere pubblico un record.

- [ ] **Step 4: Verificare**

Run: `npm run test:unit -- src/lib/contentReadiness.test.ts && npm run typecheck`

Expected: PASS.

- [ ] **Step 5: Commit selettivo**

```powershell
git add src/lib/contentReadiness.ts src/lib/contentReadiness.test.ts src/types/content.ts
git commit -m "feat(content): validate editorial publishability"
```

### Task 2: Getter pubblici e separazione draft

**Files:**

- Modify: `src/config/contentLibrary.ts`
- Create: `src/config/contentLibrary.test.ts`
- Modify: `src/config/destinations.ts`
- Modify: `src/components/PostNavigation.tsx`

**Interfaces:**

- Produces: `PUBLISHED_CONTENT_ITEMS`, `getPublishedContentById`, `getPublishedContentByZone`, `getPublishedContentByRegion`, `getPublishedGeocodedContentItems`.
- Consumes: `isContentPublishable`.

- [ ] **Step 1: Scrivere il test fallente**

```ts
import { describe, expect, it } from 'vitest';
import { CONTENT_ITEMS, PUBLISHED_CONTENT_ITEMS, getPublishedContentById } from './contentLibrary';

describe('public content library', () => {
  it('keeps every incomplete seed outside the public collection', () => {
    expect(CONTENT_ITEMS.length).toBeGreaterThan(0);
    expect(PUBLISHED_CONTENT_ITEMS).toHaveLength(0);
    expect(getPublishedContentById(CONTENT_ITEMS[0].id)).toBeUndefined();
  });
});
```

- [ ] **Step 2: Verificare il fallimento**

Run: `npm run test:unit -- src/config/contentLibrary.test.ts`

Expected: FAIL sugli export mancanti.

- [ ] **Step 3: Implementare la libreria pubblica**

```ts
import { isContentPublishable } from '../lib/contentReadiness';

export const CONTENT_ITEMS: ContentItem[] = seed as unknown as ContentItem[];
export const PUBLISHED_CONTENT_ITEMS = CONTENT_ITEMS.filter(isContentPublishable);

export function getPublishedContentById(id: string): ContentItem | undefined {
  return PUBLISHED_CONTENT_ITEMS.find((item) => item.id === id);
}

export function getPublishedContentByZone(zone: ContentItem['zone']): ContentItem[] {
  return PUBLISHED_CONTENT_ITEMS.filter((item) => item.zone === zone);
}

export function getPublishedContentByRegion(region: string): ContentItem[] {
  return PUBLISHED_CONTENT_ITEMS.filter(
    (item) => item.place.region?.toLowerCase() === region.toLowerCase()
  );
}

export function getPublishedGeocodedContentItems(): ContentItem[] {
  return PUBLISHED_CONTENT_ITEMS.filter((item) => Boolean(item.place.coordinates));
}
```

Mantenere i getter non filtrati soltanto per admin/script e rinominarli con prefisso `getDraft` quando hanno consumer pubblici.

- [ ] **Step 4: Migrare destinazioni e navigazione tra posti**

In `src/config/destinations.ts`, sostituire `CONTENT_ITEMS` con `PUBLISHED_CONTENT_ITEMS` dentro `getContentForDestination`. In `PostNavigation.tsx` calcolare current, same-zone e pool solo da `PUBLISHED_CONTENT_ITEMS`; se il current non esiste, restituire `null`.

- [ ] **Step 5: Verificare**

Run:

```powershell
npm run test:unit -- src/config/contentLibrary.test.ts src/lib/contentReadiness.test.ts
npm run typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit selettivo**

```powershell
git add src/config/contentLibrary.ts src/config/contentLibrary.test.ts src/config/destinations.ts src/components/PostNavigation.tsx
git commit -m "refactor(content): isolate published editorial records"
```

### Task 3: Report di approvazione editoriale

**Files:**

- Create: `scripts/generate-content-approval-pack.mjs`
- Create: `scripts/audit-content-readiness.mjs`
- Modify: `package.json`
- Create: `docs/13_Content/CONTENT_APPROVAL_PACK.md`

**Interfaces:**

- Produces commands: `npm run content:approval`, `npm run content:audit`.
- Consumes: `src/data/content-seed.json`.

- [ ] **Step 1: Creare il generatore del report**

Implementare il generatore completo:

```js
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const seedPath = path.join(root, 'src', 'data', 'content-seed.json');
const outputPath = path.join(root, 'docs', '13_Content', 'CONTENT_APPROVAL_PACK.md');
const items = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
const socialPostUrl =
  /^https:\/\/(www\.)?(instagram\.com\/(p|reel|tv)\/|tiktok\.com\/@[^/]+\/video\/)/i;

function issuesFor(item) {
  const issues = [];
  if (item.isPlaceholder) issues.push('placeholder');
  if (!socialPostUrl.test(item.permalink || '')) issues.push('invalid-permalink');
  if (!(item.cover || '').trim()) issues.push('missing-cover');
  if (!(item.hook || '').trim()) issues.push('missing-hook');
  if (!(item.title || '').trim()) issues.push('missing-title');
  if (!(item.description || '').trim()) issues.push('missing-description');
  if (!(item.place?.name || '').trim() || !(item.place?.country || '').trim()) {
    issues.push('missing-place');
  }
  if (!Array.isArray(item.types) || item.types.length === 0) issues.push('missing-type');
  if (!item.partnership?.kind) issues.push('missing-partnership');
  return issues;
}

const rows = items.map((item) => {
  const issues = issuesFor(item);
  return `| \`${item.id}\` | ${item.isPlaceholder ? 'draft' : 'candidate'} | ${
    issues.join(', ') || '—'
  } | Rodrigo & Betta | — |`;
});

const document = `---
type: checklist
area: content
status: active
owner: Rodrigo & Betta
---

# Content approval pack

Un record può diventare pubblico solo dopo verifica del permalink, della cover, dei testi, del luogo e della disclosure.

| ID | Stato | Problemi | Approvatore | Data |
| --- | --- | --- | --- | --- |
${rows.join('\n')}
`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, document, 'utf8');
console.log(`[content:approval] ${items.length} records written to ${outputPath}`);
```

L'header prodotto è:

```md
---
type: checklist
area: content
status: active
owner: Rodrigo & Betta
---

# Content approval pack

Un record può diventare pubblico solo dopo verifica del permalink, della cover, dei testi, del luogo e della disclosure.
```

La riga generata usa questo formato esatto:

```md
| `content-id` | draft | placeholder, missing-cover | Rodrigo & Betta | — |
```

- [ ] **Step 2: Creare l'audit bloccante**

Implementare l'audit completo riusando localmente la stessa funzione
`issuesFor` del generatore:

```js
import fs from 'node:fs';

const items = JSON.parse(fs.readFileSync('src/data/content-seed.json', 'utf8'));
const socialPostUrl =
  /^https:\/\/(www\.)?(instagram\.com\/(p|reel|tv)\/|tiktok\.com\/@[^/]+\/video\/)/i;

function issuesFor(item) {
  const issues = [];
  if (!socialPostUrl.test(item.permalink || '')) issues.push('invalid-permalink');
  if (!(item.cover || '').trim()) issues.push('missing-cover');
  if (!(item.hook || '').trim()) issues.push('missing-hook');
  if (!(item.title || '').trim()) issues.push('missing-title');
  if (!(item.description || '').trim()) issues.push('missing-description');
  if (!(item.place?.name || '').trim() || !(item.place?.country || '').trim()) {
    issues.push('missing-place');
  }
  if (!Array.isArray(item.types) || item.types.length === 0) issues.push('missing-type');
  if (!item.partnership?.kind) issues.push('missing-partnership');
  return issues;
}

const invalidCandidates = items
  .filter((item) => item.isPlaceholder === false)
  .map((item) => ({ id: item.id, issues: issuesFor(item) }))
  .filter((item) => item.issues.length > 0);

console.log(
  `[content:audit] draft=${items.filter((item) => item.isPlaceholder).length} candidate=${
    items.length - items.filter((item) => item.isPlaceholder).length
  } invalid=${invalidCandidates.length}`
);
for (const item of invalidCandidates) {
  console.error(`[content:audit] ${item.id}: ${item.issues.join(', ')}`);
}
if (invalidCandidates.length > 0) process.exitCode = 1;
```

- [ ] **Step 3: Registrare gli script**

```json
{
  "content:approval": "node scripts/generate-content-approval-pack.mjs",
  "content:audit": "node scripts/audit-content-readiness.mjs"
}
```

Aggiungere le due chiavi dentro `scripts` senza alterare gli altri comandi.

- [ ] **Step 4: Eseguire il report e verificare lo stato reale**

Run:

```powershell
npm run content:approval
npm run content:audit
Select-String -Path docs/13_Content/CONTENT_APPROVAL_PACK.md -Pattern '| draft |'
```

Expected: 40 record draft nel report; audit exit code `0` perché nessun record dichiara falsamente di essere pubblico.

- [ ] **Step 5: Commit selettivo**

```powershell
git add scripts/generate-content-approval-pack.mjs scripts/audit-content-readiness.mjs package.json docs/13_Content/CONTENT_APPROVAL_PACK.md
git commit -m "chore(content): add editorial approval gates"
```

### Task 4: Collegare Reel e schede proprietarie

**Files:**

- Modify: `src/config/reels.ts`
- Create: `src/config/reels.test.ts`
- Modify: `src/components/home/atlante/PezzoForte.tsx`
- Modify: `src/components/home/atlante/ReelStrip.tsx`
- Create: `src/components/home/atlante/ReelOwnedPath.test.tsx`

**Interfaces:**

- Adds: `ReelEntry.contentId?: string`.
- Produces: `getOwnedContentForReel(reel)`.
- Consumes: `getPublishedContentById`.

- [ ] **Step 1: Scrivere il test del bridge**

```ts
it('does not expose an owned route for an unapproved content item', () => {
  const reel = REELS.find((item) => item.id === 'reel-malesia-batu-caves');
  expect(reel).toBeDefined();
  expect(getOwnedContentForReel(reel!)).toBeUndefined();
});
```

- [ ] **Step 2: Implementare il bridge**

```ts
import { getPublishedContentById } from './contentLibrary';
import type { ContentItem } from '../types/content';

export function getOwnedContentForReel(reel: ReelEntry): ContentItem | undefined {
  return reel.contentId ? getPublishedContentById(reel.contentId) : undefined;
}
```

Dentro l'interfaccia `ReelEntry` esistente, subito dopo `id: string`, aggiungere
esattamente:

```ts
/** ID della scheda proprietaria pubblicata collegata al Reel. */
contentId?: string;
```

Non assegnare `contentId` ai cinque Reel finché il relativo record non è approvato nel report.

- [ ] **Step 3: Rendere il Pezzo forte onesto**

In `PezzoForte`, ottenere `ownedContent`; se assente, restituire `null`. La CTA primaria diventa:

```tsx
<Link
  to={`/posto/${ownedContent.id}`}
  onClick={() =>
    trackEvent('reel_to_owned_content', { content_id: ownedContent.id, source: 'home_featured' })
  }
  className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white"
>
  Apri la scheda
  <ArrowRight size={14} />
</Link>
```

Il pulsante video resta secondario.

- [ ] **Step 4: Aggiornare ReelStrip**

Filtrare le card homepage con `getOwnedContentForReel`. Ogni card pubblicata espone link `/posto/:id`, pulsante video e link social; traccia `reel_to_owned_content`, `reel_play` e `reel_open_instagram` con lo stesso `content_id`.

- [ ] **Step 5: Verificare stato vuoto e bridge**

Run:

```powershell
npm run test:unit -- src/config/reels.test.ts src/components/home/atlante/ReelOwnedPath.test.tsx
npm run typecheck
```

Expected: PASS; con il seed attuale Pezzo forte e ReelStrip non promuovono schede incomplete.

- [ ] **Step 6: Commit selettivo**

```powershell
git add src/config/reels.ts src/config/reels.test.ts src/components/home/atlante/PezzoForte.tsx src/components/home/atlante/ReelStrip.tsx src/components/home/atlante/ReelOwnedPath.test.tsx
git commit -m "feat(content): connect reels to owned place pages"
```

### Task 5: Migrare Esplora, Mappa, destinazioni e Posto

**Files:**

- Modify: `src/pages/Esplora.tsx`
- Modify: `src/pages/Posto.tsx`
- Modify: `src/pages/Destinazione.tsx`
- Modify: `src/components/map/MapboxWorldMap.tsx`
- Create: `src/pages/PublicContentRoutes.test.tsx`

**Interfaces:**

- Consumes: getter pubblici di Task 2.
- Produces: nessun contenuto draft nelle superfici pubbliche.

- [ ] **Step 1: Scrivere i test di regressione**

```tsx
it('returns not found for a draft place', () => {
  renderRoute('/posto/emilia-granduca-di-campigna');
  expect(screen.getByText(/pagina non trovata/i)).toBeInTheDocument();
});

it('does not expose draft content cards in Explore', () => {
  renderRoute('/esplora');
  expect(screen.queryByText(/Dream Lagoon a Marsa Alam/i)).not.toBeInTheDocument();
});
```

`renderRoute` usa `MemoryRouter`, `QueryClientProvider`, `HelmetProvider` e i mock Firestore già adottati nei test del progetto.

- [ ] **Step 2: Migrare i consumer**

- `Posto.tsx`: usare `getPublishedContentById`; un draft restituisce `NotFound`.
- `Esplora.tsx`: sostituire `CONTENT_ITEMS` con `PUBLISHED_CONTENT_ITEMS` per card, conteggi e `usingPreview`.
- `Destinazione.tsx`: usare soltanto getter pubblici.
- `MapboxWorldMap.tsx`: sostituire `getGeocodedContentItems` con `getPublishedGeocodedContentItems`.

- [ ] **Step 3: Impedire demo pubbliche in produzione**

In Esplora e Mappa definire:

```ts
const allowDemoContent = import.meta.env.DEV && demoSettings.showDestinationDemo;
```

Usare il fallback demo solo quando `allowDemoContent` è vero. In produzione, lo stato vuoto mostra copy editoriale e CTA newsletter, senza card o marker inventati.

- [ ] **Step 4: Verificare**

Run:

```powershell
npm run test:unit -- src/pages/PublicContentRoutes.test.tsx src/config/contentLibrary.test.ts src/lib/contentReadiness.test.ts
npm run typecheck
npm run lint
npm run build
```

Expected: tutti i comandi exit code `0`; sitemap con `posto: 0/40 reali` finché nessun record è approvato.

- [ ] **Step 5: Commit selettivo**

```powershell
git add src/pages/Esplora.tsx src/pages/Posto.tsx src/pages/Destinazione.tsx src/components/map/MapboxWorldMap.tsx src/pages/PublicContentRoutes.test.tsx
git commit -m "fix(content): keep editorial drafts out of public routes"
```

### Task 6: Attivare i primi record approvati

**Files:**

- Modify: `src/data/content-seed.json`
- Modify: `src/config/reels.ts`
- Modify: `docs/13_Content/CONTENT_APPROVAL_PACK.md`
- Modify: `docs/10_Projects/PROJECT_DESTINATIONS_SECTION_REVIEW.md`

**Interfaces:**

- Consumes: report di Task 3 e bridge di Task 4.
- Produces: almeno dieci schede pubbliche validate.

- [ ] **Step 1: Fermarsi al gate owner**

Non cambiare alcun record finché Rodrigo o Betta non approvano per iscritto permalink, cover, testi, luogo, partnership e diritti d'uso. L'approvazione deve indicare gli ID esatti.

- [ ] **Step 2: Aggiornare soltanto gli ID approvati**

Per ogni ID approvato, compilare i campi reali e impostare `isPlaceholder: false`. Aggiungere `contentId` al Reel corrispondente soltanto quando esiste una corrispondenza certa.

- [ ] **Step 3: Eseguire i gate**

Run:

```powershell
npm run content:approval
npm run content:audit
npm run test:unit -- src/lib/contentReadiness.test.ts src/config/contentLibrary.test.ts src/config/reels.test.ts
npm run build
```

Expected: zero errori; almeno dieci record in `PUBLISHED_CONTENT_ITEMS`.

- [ ] **Step 4: Browser smoke test**

Run:

```powershell
npx playwright test e2e/home.spec.ts
```

Verificare manualmente una scheda `/posto/:slug`, il relativo marker, la destinazione, Esplora e il link Reel.

- [ ] **Step 5: Aggiornare la nota e committare**

Registrare ID approvati, approvatore, data, fonte e risultato dei test. Poi:

```powershell
git add src/data/content-seed.json src/config/reels.ts docs/13_Content/CONTENT_APPROVAL_PACK.md docs/10_Projects/PROJECT_DESTINATIONS_SECTION_REVIEW.md
git commit -m "content(places): publish approved Travellini records"
```
