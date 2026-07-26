---
type: plan
area: business
status: active
priority: p0
owner: Rodrigo & Betta
created: 2026-07-13
tags:
  - partnerships
  - affiliate
  - analytics
  - release
---

# Fase 4 — B2B, Monetizzazione e Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rendere Collaborazioni, Media kit, Press, affiliate e misurazione coerenti con dati approvati, quindi produrre un candidato locale completo per il predeploy.

**Architecture:** Metriche e proof passano da registri tipizzati con metadata di approvazione. Le pagine e il PDF consumano lo stesso selector; le risorse commerciali passano da un catalogo centrale e dall'attuale builder affiliate. Un wrapper analytics tipizzato normalizza gli eventi del programma.

**Tech Stack:** React 19, TypeScript, Vite, React PDF, Vitest, Testing Library, Playwright, script Node.js ESM, audit esistenti.

## Global Constraints

- Nessuna stima viene usata come metrica pubblica.
- Un dato Firestore non diventa pubblico senza approvazione esplicita e data.
- Case study e partner richiedono autorizzazione; una menzione pubblica resta etichettata come tale.
- Ogni link affiliate usa disclosure, tracking e stato di validità.
- Il funnel B2B resta separato dal funnel consumer.
- `server.ts`, deploy, DNS, bio social, pagamenti e invii commerciali sono owner-only.

---

### Task 1: Registro unico delle metriche approvate

**Files:**

- Create: `src/config/brand-proof.json`
- Create: `src/config/brandProof.ts`
- Create: `src/config/brandProof.test.ts`
- Create: `scripts/audit-business-data.mjs`
- Modify: `package.json`

**Interfaces:**

- Produces: `ApprovedBrandStat`, `getApprovedBrandStats()`, `getApprovedBrandStat(key)`, `npm run business-data:audit`.

- [ ] **Step 1: Creare il registro iniziale**

```json
{
  "instagramFollowers": {
    "label": "Follower Instagram",
    "value": "171.847",
    "status": "draft",
    "observedAt": "2026-07-13",
    "sourceUrl": "https://www.instagram.com/travelliniwithus/"
  },
  "tiktokFollowers": {
    "label": "Follower TikTok",
    "value": "",
    "status": "draft"
  },
  "monthlyReach": {
    "label": "Reach mensile",
    "value": "",
    "status": "draft"
  },
  "engagementRate": {
    "label": "Engagement rate",
    "value": "",
    "status": "draft"
  },
  "audienceTotal": {
    "label": "Audience totale",
    "value": "",
    "status": "draft"
  }
}
```

- [ ] **Step 2: Scrivere il test fallente**

```ts
import { describe, expect, it } from 'vitest';
import { getApprovedBrandStat, getApprovedBrandStats } from './brandProof';

describe('brand proof', () => {
  it('never exposes draft metrics', () => {
    expect(getApprovedBrandStats()).toEqual([]);
    expect(getApprovedBrandStat('instagramFollowers')).toBeUndefined();
  });
});
```

- [ ] **Step 3: Implementare il selector tipizzato**

```ts
import proof from './brand-proof.json';

export type BrandStatKey = keyof typeof proof;

export interface ApprovedBrandStat {
  key: BrandStatKey;
  label: string;
  value: string;
  approvedBy: string;
  approvedAt: string;
  observedAt?: string;
  sourceUrl?: string;
}

export function getApprovedBrandStats(): ApprovedBrandStat[] {
  return Object.entries(proof).flatMap(([key, item]) => {
    if (
      item.status !== 'approved' ||
      !item.value ||
      !('approvedBy' in item) ||
      !('approvedAt' in item)
    ) {
      return [];
    }
    return [{ key: key as BrandStatKey, ...item } as ApprovedBrandStat];
  });
}

export function getApprovedBrandStat(key: BrandStatKey): ApprovedBrandStat | undefined {
  return getApprovedBrandStats().find((item) => item.key === key);
}
```

- [ ] **Step 4: Creare l'audit**

Lo script verifica che ogni record `approved` abbia valore, approvatore, data approvazione ISO, data osservazione per le metriche numeriche e URL HTTPS della fonte. Non stampa dati privati, soltanto chiavi e motivi.

In `package.json` aggiungere:

```json
"business-data:audit": "node scripts/audit-business-data.mjs"
```

- [ ] **Step 5: Verificare**

Run: `npm run test:unit -- src/config/brandProof.test.ts && npm run business-data:audit && npm run typecheck`

Expected: PASS; zero metriche pubbliche finché tutte sono draft.

- [ ] **Step 6: Commit selettivo**

```powershell
git add src/config/brand-proof.json src/config/brandProof.ts src/config/brandProof.test.ts scripts/audit-business-data.mjs package.json
git commit -m "feat(business): gate public metrics on approval"
```

### Task 2: Unificare dati di pagine, email e PDF

**Files:**

- Create: `src/components/business/ApprovedStats.tsx`
- Create: `src/components/business/ApprovedStats.test.tsx`
- Modify: `src/pages/ChiSiamo.tsx`
- Modify: `src/pages/Collaborazioni.tsx`
- Modify: `src/pages/MediaKit.tsx`
- Modify: `src/pages/Press.tsx`
- Modify: `src/components/article/SocialFollowCTA.tsx`
- Modify: `src/lib/email.ts`
- Modify: `scripts/generate-media-kit.tsx`

**Interfaces:**

- Consumes: `getApprovedBrandStats`, `getApprovedBrandStat`.
- Produces: `ApprovedStats({ keys?, className? })`.

- [ ] **Step 1: Scrivere il test fallente**

```tsx
it('renders no metric cards when the registry contains only drafts', () => {
  const { container } = render(<ApprovedStats />);
  expect(container).toBeEmptyDOMElement();
});
```

- [ ] **Step 2: Implementare il componente**

```tsx
import { getApprovedBrandStats, type BrandStatKey } from '../../config/brandProof';

interface ApprovedStatsProps {
  keys?: BrandStatKey[];
  className?: string;
}

export default function ApprovedStats({ keys, className = '' }: ApprovedStatsProps) {
  const approved = getApprovedBrandStats().filter((item) => !keys || keys.includes(item.key));
  if (approved.length === 0) return null;

  return (
    <dl className={className}>
      {approved.map((item) => (
        <div key={item.key}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
          {item.observedAt && <span>Dati osservati il {item.observedAt}</span>}
        </div>
      ))}
    </dl>
  );
}
```

- [ ] **Step 3: Migrare le superfici web**

Rimuovere l'uso diretto di `BRAND_STATS` dalle cinque superfici pubbliche e usare `ApprovedStats` o `getApprovedBrandStat`. Se un dato non è approvato, omettere l'intero blocco; non mostrare trattini o stime.

- [ ] **Step 4: Migrare email e PDF**

In `renderWelcomeEmail`, mostrare i link social senza conteggi quando le metriche sono assenti. In `generate-media-kit.tsx`, eliminare `fetchLiveAudienceStats` e il fallback `BRAND_STATS`; usare:

```ts
const audienceStats = getApprovedBrandStats().map(({ label, value }) => ({ label, value }));
```

Il PDF deve generarsi anche con array vuoto, mostrando soltanto offerta, metodo, proof e contatti.

- [ ] **Step 5: Verificare assenza di accessi legacy**

Run:

```powershell
npm run test:unit -- src/components/business/ApprovedStats.test.tsx src/config/brandProof.test.ts src/lib/email.test.ts
rg -n "BRAND_STATS" src/pages/ChiSiamo.tsx src/pages/Collaborazioni.tsx src/pages/MediaKit.tsx src/pages/Press.tsx src/components/article/SocialFollowCTA.tsx src/lib/email.ts scripts/generate-media-kit.tsx
npm run generate:media-kit
npm run typecheck
```

Expected: test, generatore e typecheck PASS; `rg` non restituisce risultati nei file elencati.

- [ ] **Step 6: Commit selettivo**

```powershell
git add src/components/business/ApprovedStats.tsx src/components/business/ApprovedStats.test.tsx src/pages/ChiSiamo.tsx src/pages/Collaborazioni.tsx src/pages/MediaKit.tsx src/pages/Press.tsx src/components/article/SocialFollowCTA.tsx src/lib/email.ts scripts/generate-media-kit.tsx public/media-kit.pdf
git commit -m "refactor(business): share approved proof across surfaces"
```

### Task 3: Catalogo affiliate e risorse governato

**Files:**

- Create: `src/config/resources.ts`
- Create: `src/config/resources.test.ts`
- Modify: `src/pages/Risorse.tsx`
- Modify: `src/lib/affiliateLink.ts`
- Modify: `src/lib/affiliateLink.test.ts`

**Interfaces:**

- Produces: `ResourceItem`, `getPublicResources(now?)`, `isResourceActive(resource, now?)`.
- Consumes: `buildAffiliateLink`, `AFFILIATE_ANCHOR_ATTRS`.

- [ ] **Step 1: Scrivere i test fallenti**

```ts
it('keeps unapproved commercial resources private', () => {
  expect(getPublicResources().some((item) => item.name === 'Heymondo')).toBe(false);
  expect(getPublicResources().some((item) => item.name === 'Skyscanner')).toBe(true);
});

it('removes an approved deal after its expiry date', () => {
  const expired = { ...approvedResource, validUntil: '2026-01-01' };
  expect(isResourceActive(expired, new Date('2026-07-13'))).toBe(false);
});
```

- [ ] **Step 2: Estrarre il catalogo**

Spostare i record hard-coded di `Risorse.tsx` in `resources.ts` e aggiungere:

```ts
export interface ResourceItem {
  id: string;
  brand: 'travel' | 'family';
  name: string;
  description: string;
  link: string;
  tags: string[];
  commercialLabel: 'Affiliato' | 'Non affiliato' | 'Codice sconto';
  fit: string;
  avoid?: string;
  approved: boolean;
  validUntil?: string;
}

export function isResourceActive(item: ResourceItem, now = new Date()): boolean {
  if (item.commercialLabel !== 'Non affiliato' && !item.approved) return false;
  return !item.validUntil || new Date(item.validUntil) >= now;
}

export function getPublicResources(now = new Date()): ResourceItem[] {
  return RESOURCES.filter((item) => item.brand === 'travel' && isResourceActive(item, now));
}
```

I link non affiliati partono `approved: true`; tutti i link commerciali partono `approved: false` finché R&B non conferma programma, URL, codice, termini e scadenza.

- [ ] **Step 3: Centralizzare link e tracking**

Per partner supportati, costruire l'URL con `buildAffiliateLink`. Tutti i link commerciali usano `AFFILIATE_ANCHOR_ATTRS` e:

```ts
trackEvent('affiliate_outbound_click', {
  source: 'risorse',
  content_id: item.id,
  partner_kind: item.commercialLabel,
  route: '/risorse',
});
```

Le risorse Firestore vengono mostrate soltanto se `published === true` e possiedono una disclosure riconosciuta; in assenza del campo vengono scartate lato client.

- [ ] **Step 4: Verificare**

Run:

```powershell
npm run test:unit -- src/config/resources.test.ts src/lib/affiliateLink.test.ts
npm run typecheck
npm run lint
```

Expected: PASS.

- [ ] **Step 5: Commit selettivo**

```powershell
git add src/config/resources.ts src/config/resources.test.ts src/pages/Risorse.tsx src/lib/affiliateLink.ts src/lib/affiliateLink.test.ts
git commit -m "feat(resources): govern commercial recommendations"
```

### Task 4: Contratto analytics dell'ecosistema

**Files:**

- Create: `src/services/ecosystemAnalytics.ts`
- Create: `src/services/ecosystemAnalytics.test.ts`
- Modify: `src/services/analytics.ts`
- Modify: consumer modificati nelle fasi 1-4.

**Interfaces:**

- Produces: `EcosystemEventName`, `EcosystemEventParams`, `trackEcosystemEvent(name, params)`.

- [ ] **Step 1: Scrivere il test fallente**

```ts
it('forwards a normalized event to the shared tracker', () => {
  trackEcosystemEvent('content_item_view', {
    source: 'esplora',
    content_id: 'batu-caves-kuala-lumpur',
    route: '/posto/batu-caves-kuala-lumpur',
  });
  expect(trackEvent).toHaveBeenCalledWith('content_item_view', {
    source: 'esplora',
    content_id: 'batu-caves-kuala-lumpur',
    route: '/posto/batu-caves-kuala-lumpur',
  });
});
```

- [ ] **Step 2: Implementare il wrapper**

```ts
import { trackEvent } from './analytics';

export type EcosystemEventName =
  | 'bio_hub_view'
  | 'bio_hub_path_click'
  | 'content_item_view'
  | 'content_item_to_map'
  | 'content_item_to_related'
  | 'reel_play'
  | 'reel_to_owned_content'
  | 'newsletter_signup'
  | 'lead_magnet_download'
  | 'affiliate_outbound_click'
  | 'media_kit_view'
  | 'media_kit_submit'
  | 'partner_lead_submit';

export interface EcosystemEventParams {
  source: string;
  content_id?: string;
  cta_id?: string;
  partner_kind?: string;
  route?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
}

export function trackEcosystemEvent(name: EcosystemEventName, params: EcosystemEventParams) {
  trackEvent(name, params);
}
```

- [ ] **Step 3: Migrare gli eventi del programma**

Sostituire soltanto gli eventi elencati dal wrapper tipizzato. Lasciare gli eventi legacy non inclusi su `trackEvent`. Ogni chiamata deve fornire `source`; aggiungere `route`, `content_id` e `cta_id` quando disponibili.

- [ ] **Step 4: Verificare**

Run:

```powershell
npm run test:unit -- src/services/ecosystemAnalytics.test.ts
rg -n "trackEvent\('(bio_hub_view|bio_hub_path_click|content_item_view|content_item_to_map|content_item_to_related|reel_to_owned_content|affiliate_outbound_click|media_kit_view|media_kit_submit|partner_lead_submit)'" src
npm run typecheck
```

Expected: test e typecheck PASS; `rg` non restituisce chiamate legacy per gli eventi elencati.

- [ ] **Step 5: Commit selettivo**

```powershell
git add src/services/ecosystemAnalytics.ts src/services/ecosystemAnalytics.test.ts src
git commit -m "refactor(analytics): normalize ecosystem conversion events"
```

Prima del commit sostituire `git add src` con l'elenco esatto restituito da `git diff --name-only`; non usare staging globale.

### Task 5: Approvazione dati B2B e proof

**Files:**

- Modify: `src/config/brand-proof.json`
- Modify: `src/config/site.ts`
- Modify: `docs/12_Partnerships/CASE_STUDY_EMILIA_FANTASTICA_CASTELLI_DUCATO.md` soltanto se il progetto viene autorizzato come case study pubblico
- Modify: `docs/MARKETING_OPERATIONS_HUB.md`

**Interfaces:**

- Consumes: export Meta Business Suite/TikTok Analytics e autorizzazione partner.

- [ ] **Step 1: Fermarsi al gate owner**

Non attivare metriche, case study o logo partner finché R&B non approvano valori, periodo, fonte e diritti di pubblicazione.

- [ ] **Step 2: Aggiornare il registro con dati firmati**

Per ogni metrica approvata usare:

```json
{
  "status": "approved",
  "value": "171.847",
  "approvedBy": "Rodrigo & Betta",
  "approvedAt": "2026-07-13",
  "observedAt": "2026-07-13",
  "sourceUrl": "https://www.instagram.com/travelliniwithus/"
}
```

Per Insights privati, `sourceUrl` indica una nota interna senza includere screenshot o dati sensibili nel repository pubblico.

- [ ] **Step 3: Creare almeno un case study autorizzato**

La nota deve distinguere obiettivo, deliverable, metodo, risultati pubblicabili, fonte, periodo, autorizzazione e CTA. Il sito consuma solo un estratto approvato; nessun dato non autorizzato viene copiato.

- [ ] **Step 4: Eseguire i gate**

Run:

```powershell
npm run business-data:audit
npm run generate:media-kit
npm run test:unit -- src/config/brandProof.test.ts src/components/business/ApprovedStats.test.tsx
npm run build
```

Expected: PASS; sito e PDF espongono gli stessi valori e date.

- [ ] **Step 5: Commit selettivo**

```powershell
git add src/config/brand-proof.json src/config/site.ts public/media-kit.pdf docs/MARKETING_OPERATIONS_HUB.md
git commit -m "content(business): publish approved audience proof"
```

Aggiungere al comando soltanto la nota case study realmente creata e autorizzata.

### Task 6: Confine Travelliniwithus e TravelliniFamily

**Files:**

- Create: `src/config/brandArchitecture.ts`
- Create: `src/config/brandArchitecture.test.ts`
- Create: `docs/20_Decisions/DECISION_0003_TRAVELLINI_FAMILY_BOUNDARY.md`

**Interfaces:**

- Produces: `BRAND_ARCHITECTURE`, `canPublishFamilyOnMainSite()`.
- Consumes: campo `brand` delle risorse del Task 3.

- [ ] **Step 1: Scrivere il test fallente**

```ts
import { describe, expect, it } from 'vitest';
import { BRAND_ARCHITECTURE, canPublishFamilyOnMainSite } from './brandArchitecture';
import { getPublicResources } from './resources';

describe('brand architecture', () => {
  it('keeps the family sub-brand outside the main travel site until owner approval', () => {
    expect(BRAND_ARCHITECTURE.family.status).toBe('separate-pending-owner');
    expect(canPublishFamilyOnMainSite()).toBe(false);
    expect(getPublicResources().every((item) => item.brand === 'travel')).toBe(true);
  });
});
```

- [ ] **Step 2: Implementare il confine**

```ts
type FamilyBrandStatus = 'separate-pending-owner' | 'approved-subbrand';

interface BrandArchitecture {
  travel: {
    name: string;
    role: 'travel-editorial-main';
  };
  family: {
    name: string;
    status: FamilyBrandStatus;
    publicSiteSection: boolean;
  };
}

export const BRAND_ARCHITECTURE: BrandArchitecture = {
  travel: {
    name: 'Travelliniwithus',
    role: 'travel-editorial-main',
  },
  family: {
    name: 'TravelliniFamily',
    status: 'separate-pending-owner',
    publicSiteSection: false,
  },
};

export function canPublishFamilyOnMainSite(): boolean {
  return (
    BRAND_ARCHITECTURE.family.status === 'approved-subbrand' &&
    BRAND_ARCHITECTURE.family.publicSiteSection
  );
}
```

- [ ] **Step 3: Registrare la decisione operativa**

La decision note usa `type: decision`, `status: active`, `area: brand` e registra: travel come brand principale; family separato; cross-post solo pertinente; nessuna somma audience; prodotti baby esclusi dalle risorse travel; revisione owner necessaria prima di creare una sezione family.

- [ ] **Step 4: Verificare e committare**

Run: `npm run test:unit -- src/config/brandArchitecture.test.ts src/config/resources.test.ts && npm run typecheck`

Expected: PASS.

```powershell
git add src/config/brandArchitecture.ts src/config/brandArchitecture.test.ts src/config/resources.ts src/config/resources.test.ts docs/20_Decisions/DECISION_0003_TRAVELLINI_FAMILY_BOUNDARY.md
git commit -m "docs(brand): define TravelliniFamily boundary"
```

### Task 7: Gate qualità e candidato release

**Files:**

- Modify: `e2e/home.spec.ts`
- Create: `e2e/owned-ecosystem.spec.ts`
- Modify: `docs/10_Projects/PROJECT_RELEASE_READINESS.md`
- Create: `docs/RELEASE_2026-07-13_ecosistema-candidate.md`

**Interfaces:**

- Verifica tutte le fasi senza eseguire deploy.

- [ ] **Step 1: Scrivere il percorso E2E**

```ts
test('social entry reaches owned content and a measurable next action', async ({ page }) => {
  await page.goto('/vieni-con-noi?utm_source=instagram&utm_medium=bio&utm_campaign=bio_hub');
  await page.getByRole('link', { name: /Scopri/i }).click();
  await expect(page).toHaveURL(/\/esplora/);

  const firstOwnedCard = page.getByRole('link', { name: /Apri la scheda/i }).first();
  await expect(firstOwnedCard).toBeVisible();
  await firstOwnedCard.click();
  await expect(page).toHaveURL(/\/posto\//);
  await expect(page.getByRole('link', { name: /Apri sulla mappa/i })).toBeVisible();
});
```

- [ ] **Step 2: Eseguire audit specializzati**

Usare nell'ordine le skill locali `seo-check`, `ai-seo`, `a11y-check`, `responsive-check`, `perf-audit`, `security-audit` e `predeploy`. Ogni correzione individuata diventa un task separato con test mirato; non accorpare refactor non necessari.

- [ ] **Step 3: Eseguire il gate completo**

Run:

```powershell
npm run typecheck
npm run lint
npm run test
npm run build
npm run audit:ui
npm run audit:firebase
npm run audit:stripe
npm run audit:revenue
npm run audit:agents
npm run audit:obsidian
npm run audit:visual
npm run audit:size
npx playwright test
```

Expected: ogni comando exit code `0`; nessun errore console nelle rotte chiave.

- [ ] **Step 4: Registrare il candidato release**

La release note elenca commit, dati approvati, superfici live/hidden, risultati audit, limiti noti, piano rollback e azioni owner ancora necessarie.

- [ ] **Step 5: Commit selettivo**

```powershell
git add e2e/home.spec.ts e2e/owned-ecosystem.spec.ts docs/10_Projects/PROJECT_RELEASE_READINESS.md docs/RELEASE_2026-07-13_ecosistema-candidate.md
git commit -m "test(release): verify connected Travellini ecosystem"
```

### Task 8: Handoff owner-only

**Files:**

- Modify after owner action: `docs/10_Projects/PROJECT_RELEASE_READINESS.md`
- Modify after owner action: release note del Task 7.

- [ ] **Step 1: Presentare il candidato locale**

Consegnare URL locali, risultati audit, differenze rispetto al sito pubblico, rollback e lista esatta di azioni owner.

- [ ] **Step 2: Richiedere autorizzazioni separate**

Richiedere esplicitamente, una alla volta: deploy hosting, configurazione dominio/DNS, aggiornamento bio Instagram/TikTok, attivazione Shop/Club/pagamenti e invii commerciali.

- [ ] **Step 3: Non eseguire azioni esterne senza conferma**

Se l'owner non autorizza, il task termina con candidato locale verificato. Nessun comando deploy, push, DNS, Firebase write, Stripe write o modifica social viene eseguito.
