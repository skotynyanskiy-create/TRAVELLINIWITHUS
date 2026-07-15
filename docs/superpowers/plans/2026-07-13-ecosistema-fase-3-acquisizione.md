---
type: plan
area: marketing
status: active
priority: p0
owner: Rodrigo & Betta
created: 2026-07-13
tags:
  - newsletter
  - lead-magnet
  - social
  - conversion
---

# Fase 3 — Acquisizione Social ed Email Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rendere `/vieni-con-noi`, newsletter e lead magnet un funnel proprietario coerente, misurabile e incapace di simulare iscrizioni o consegne riuscite.

**Architecture:** Il funnel usa il componente `Newsletter` come unico form client. La disponibilità del lead magnet deriva dal manifest della fase 1 e un registro di approvazione separato governa i dieci luoghi; generatore, email e CTA rispettano lo stesso gate.

**Tech Stack:** React 19, TypeScript, React Router, Vitest, Testing Library, Playwright, React PDF, Node.js ESM.

## Global Constraints

- La newsletter può essere promossa anche senza lead magnet.
- Il PDF viene promesso soltanto quando dieci luoghi e diritti d'uso sono approvati.
- In produzione un errore API resta un errore visibile; `localStorage` non simula un'iscrizione.
- `/vieni-con-noi` resta `noindex`, mobile-first e dedicata a Instagram/TikTok.
- La consegna via email e il download devono usare lo stesso stato pubblico.
- Nessuna modifica a `server.ts` in questa fase.

---

### Task 1: Registro e audit del lead magnet

**Files:**

- Create: `src/data/lead-magnet-approval.json`
- Create: `scripts/audit-lead-magnet.mjs`
- Modify: `package.json`
- Modify: `scripts/generate-lead-magnet.tsx`
- Test: `src/pdf/leadMagnetApproval.test.ts`

**Interfaces:**

- Produces: `npm run lead-magnet:audit`.
- Consumes: i dieci nomi già presenti in `LEAD_MAGNET_LOCATIONS` e `public-surfaces.json`.

- [ ] **Step 1: Creare il registro iniziale esatto**

```json
{
  "Specchia": { "status": "draft" },
  "Tricase Porto": { "status": "draft" },
  "Acaya": { "status": "draft" },
  "Vico del Gargano": { "status": "draft" },
  "Scanno": { "status": "draft" },
  "Rasiglia": { "status": "draft" },
  "Castelluccio di Norcia": { "status": "draft" },
  "Lago di Tovel": { "status": "draft" },
  "Val di Funes": { "status": "draft" },
  "Bosa": { "status": "draft" }
}
```

- [ ] **Step 2: Scrivere il test fallente del registro**

```ts
import { describe, expect, it } from 'vitest';
import approvals from '../data/lead-magnet-approval.json';

describe('lead magnet approval registry', () => {
  it('contains exactly ten unique editorial records', () => {
    expect(Object.keys(approvals)).toHaveLength(10);
    expect(new Set(Object.keys(approvals)).size).toBe(10);
  });

  it('does not claim unreviewed locations are approved', () => {
    expect(Object.values(approvals).every((item) => item.status === 'draft')).toBe(true);
  });
});
```

- [ ] **Step 3: Implementare l'audit**

Implementare lo script:

```js
import fs from 'node:fs';

const approvals = JSON.parse(fs.readFileSync('src/data/lead-magnet-approval.json', 'utf8'));
const surfaces = JSON.parse(fs.readFileSync('src/config/public-surfaces.json', 'utf8'));
const entries = Object.entries(approvals);

if (entries.length !== 10 || new Set(entries.map(([name]) => name)).size !== 10) {
  console.error('[lead-magnet:audit] il registro deve contenere dieci nomi unici');
  process.exit(1);
}

if (surfaces.leadMagnet !== 'live') {
  console.log(`[lead-magnet:audit] surface=${surfaces.leadMagnet} records=${entries.length}`);
  process.exit(0);
}

function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

const invalid = entries.flatMap(([name, record]) => {
  const reasons = [];
  if (record.status !== 'approved') reasons.push('status');
  if (!record.approvedBy) reasons.push('approvedBy');
  if (!record.approvedAt || Number.isNaN(Date.parse(record.approvedAt))) reasons.push('approvedAt');
  if (!record.sourceUrl || !isHttpsUrl(record.sourceUrl)) reasons.push('sourceUrl');
  return reasons.length > 0 ? [{ name, reasons }] : [];
});

for (const item of invalid) {
  console.error(`[lead-magnet:audit] ${item.name}: ${item.reasons.join(', ')}`);
}
if (invalid.length > 0) process.exitCode = 1;
else console.log('[lead-magnet:audit] 10/10 approved');
```

Quando `leadMagnet === 'live'`, lo script richiede per tutti i record:

```json
{
  "status": "approved",
  "approvedBy": "Rodrigo & Betta",
  "approvedAt": "2026-07-13",
  "sourceUrl": "https://www.travelliniwithus.it/"
}
```

`approvedAt` deve essere ISO valido e `sourceUrl` un URL HTTPS. In caso contrario termina `1` e stampa soltanto i nomi incompleti, senza dati sensibili.

- [ ] **Step 4: Rendere il generatore coerente con lo stato**

In testa al generatore aggiungere:

```ts
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const surfaceManifest = require('../src/config/public-surfaces.json') as {
  leadMagnet: 'live' | 'waitlist' | 'hidden';
};
```

All'inizio di `main()`, se `leadMagnet !== 'live'`:

```ts
if (surfaceManifest.leadMagnet !== 'live') {
  fs.rmSync(outputPath, { force: true });
  console.log('[generate-lead-magnet] skipped: public surface is not live');
  return;
}
```

Se live, eseguire l'audit prima di `renderToFile`; un registro incompleto interrompe la generazione.

- [ ] **Step 5: Registrare ed eseguire i comandi**

```json
{
  "lead-magnet:audit": "node scripts/audit-lead-magnet.mjs"
}
```

Run:

```powershell
npm run test:unit -- src/pdf/leadMagnetApproval.test.ts
npm run lead-magnet:audit
npm run generate:lead-magnet
Test-Path public/lead-magnet-posti-italiani.pdf
```

Expected: test e audit PASS; generatore skipped; `Test-Path` restituisce `False` mentre la superficie è hidden.

- [ ] **Step 6: Commit selettivo**

```powershell
git add src/data/lead-magnet-approval.json scripts/audit-lead-magnet.mjs scripts/generate-lead-magnet.tsx src/pdf/leadMagnetApproval.test.ts package.json public/lead-magnet-posti-italiani.pdf
git commit -m "feat(lead-magnet): gate delivery on editorial approval"
```

### Task 2: Un solo contratto Newsletter e nessun falso successo

**Files:**

- Modify: `src/components/Newsletter.tsx`
- Create: `src/components/Newsletter.test.tsx`
- Modify: `src/lib/email.ts`
- Create: `src/lib/email.test.ts`

**Interfaces:**

- Adds to `NewsletterProps`: `eventContext?: Record<string, string>`, `leadMagnet?: boolean`.
- `onSuccess` resta `() => void`.

- [ ] **Step 1: Scrivere i test client fallenti**

```tsx
it('shows an error instead of storing a production lead when the API fails', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
  render(<Newsletter source="home_newsletter" />);

  await userEvent.type(screen.getByLabelText(/La tua email/i), 'utente@example.com');
  await userEvent.click(screen.getByRole('button', { name: /Entra nella lista/i }));

  expect(await screen.findByRole('alert')).toHaveTextContent(/Iscrizione non riuscita/i);
  expect(localStorage.getItem('twu_newsletter_leads')).toBeNull();
});

it('unlocks the guide only for a successful live lead-magnet request', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
  render(<Newsletter source="vieni_con_noi_instagram" leadMagnet />);

  await userEvent.type(screen.getByLabelText(/La tua email/i), 'utente@example.com');
  await userEvent.click(screen.getByRole('button', { name: /Iscriviti/i }));

  await waitFor(() => expect(sessionStorage.getItem('twu_lead_magnet_unlocked')).toBe('1'));
});
```

- [ ] **Step 2: Verificare il fallimento**

Run: `npm run test:unit -- src/components/Newsletter.test.tsx`

Expected: FAIL perché il fallback locale produce successo e la prop non esiste.

- [ ] **Step 3: Aggiornare il contratto e il catch**

```ts
eventContext?: Record<string, string>;
leadMagnet?: boolean;
```

Aggiungere queste due proprietà alla fine dell'interfaccia `NewsletterProps`
esistente, senza cambiare le altre firme.

Unire `eventContext` ai parametri di `newsletter_submit_attempt` e `newsletter_signup`. Nel `catch` usare:

```ts
const savedInDevelopment =
  import.meta.env.DEV &&
  appendLeadFallback('twu_newsletter_leads', {
    email: normalizedEmail,
    source,
    date: new Date().toISOString(),
  });

if (savedInDevelopment) {
  setIsSubscribed(true);
} else {
  setError('Iscrizione non riuscita. Riprova tra poco oppure scrivici direttamente via email.');
}
```

Sbloccare la guida soltanto quando `leadMagnet && isSurfaceLive('leadMagnet')`.

- [ ] **Step 4: Proteggere l'email di benvenuto senza toccare il server**

In `renderWelcomeEmail` importare `isSurfaceLive` e definire:

```ts
const effectiveLeadMagnetUrl = isSurfaceLive('leadMagnet') ? input.leadMagnetUrl : undefined;
```

Usare `effectiveLeadMagnetUrl` per blocco HTML e testo. Il test deve verificare che un URL passato non appaia quando la superficie è hidden.

- [ ] **Step 5: Verificare**

Run:

```powershell
npm run test:unit -- src/components/Newsletter.test.tsx src/lib/email.test.ts
npm run typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit selettivo**

```powershell
git add src/components/Newsletter.tsx src/components/Newsletter.test.tsx src/lib/email.ts src/lib/email.test.ts
git commit -m "fix(newsletter): report real subscription outcomes"
```

### Task 3: Trasformare VieniConNoi in bio hub adattivo

**Files:**

- Modify: `src/pages/VieniConNoi.tsx`
- Create: `src/pages/VieniConNoi.test.tsx`

**Interfaces:**

- Consumes: `Newsletter`, `getSurfaceState`, query UTM.
- Produces: eventi `bio_hub_view`, `bio_hub_path_click` e funnel guida solo quando live.

- [ ] **Step 1: Scrivere i test fallenti**

```tsx
it('renders discovery, planning and business paths without promising a hidden PDF', () => {
  renderVieniConNoi('/vieni-con-noi?utm_source=instagram&utm_medium=bio&utm_campaign=bio_hub');

  expect(screen.getByRole('link', { name: /Scopri/i })).toHaveAttribute(
    'href',
    expect.stringContaining('/esplora')
  );
  expect(screen.getByRole('link', { name: /Organizza/i })).toHaveAttribute(
    'href',
    expect.stringContaining('/risorse')
  );
  expect(screen.getByRole('link', { name: /Collabora/i })).toHaveAttribute(
    'href',
    expect.stringContaining('/media-kit')
  );
  expect(screen.queryByText(/Ricevi il PDF/i)).not.toBeInTheDocument();
  expect(screen.getByText(/Ricevi i prossimi posti/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Verificare il fallimento**

Run: `npm run test:unit -- src/pages/VieniConNoi.test.tsx`

Expected: FAIL sul copy PDF attuale.

- [ ] **Step 3: Eliminare il form duplicato**

Rimuovere stato email, honeypot, `handleSubmit`, `LeadForm` e import associati. Definire:

```ts
const leadMagnetLive = isSurfaceLive('leadMagnet');
const eventContext = {
  route: '/vieni-con-noi',
  utm_source: utmSource,
  utm_medium: searchParams.get('utm_medium') ?? 'direct',
  utm_campaign: utmCampaign,
};
```

Renderizzare:

```tsx
<Newsletter
  variant="white"
  source={source}
  eyebrow={leadMagnetLive ? 'Guida gratuita' : 'Newsletter Travellini'}
  title={
    leadMagnetLive ? '10 posti italiani che sembrano inventati' : 'Ricevi i prossimi posti giusti'
  }
  description={
    leadMagnetLive
      ? 'Dieci luoghi verificati, con periodo, costi e indicazioni pratiche.'
      : 'Una mail quando pubblichiamo un luogo, una guida o una risorsa che vale la pena salvare.'
  }
  ctaLabel={leadMagnetLive ? 'Ricevi la guida' : 'Entra nella lista'}
  leadMagnet={leadMagnetLive}
  eventContext={eventContext}
/>
```

- [ ] **Step 4: Allineare i nomi evento**

Sostituire `landing_view` con:

```ts
trackEvent('bio_hub_view', eventContext);
```

Ogni card usa `bio_hub_path_click` con `cta_id` stabile: `bio_hub_scopri`, `bio_hub_organizza`, `bio_hub_collabora`.

- [ ] **Step 5: Verificare**

Run: `npm run test:unit -- src/pages/VieniConNoi.test.tsx src/components/Newsletter.test.tsx && npm run typecheck`

Expected: PASS.

- [ ] **Step 6: Commit selettivo**

```powershell
git add src/pages/VieniConNoi.tsx src/pages/VieniConNoi.test.tsx
git commit -m "refactor(marketing): unify the social bio funnel"
```

### Task 4: Gating completo delle CTA lead magnet

**Files:**

- Modify: `src/pages/LeadMagnet.tsx`
- Modify: `src/components/ExitIntentPopup.tsx`
- Modify: `src/components/home/HomeLeadMagnet.tsx`
- Modify: `src/pages/Destinazione.tsx`
- Modify: `src/components/Newsletter.tsx`
- Create: `src/pages/LeadMagnetGate.test.tsx`

**Interfaces:**

- Consumes: `isSurfaceLive('leadMagnet')`, `getAudienceCta()`.

- [ ] **Step 1: Scrivere il test del gate**

```tsx
it('redirects the hidden lead magnet and exposes no direct PDF links', () => {
  renderApp('/lead-magnet');
  expect(screen.getByText(/Ricevi i prossimi posti/i)).toBeInTheDocument();
  expect(document.querySelector('a[href$="lead-magnet-posti-italiani.pdf"]')).toBeNull();
});
```

- [ ] **Step 2: Applicare il gate a tutti i consumer**

- `LeadMagnet.tsx`: se non live, `<Navigate to="/vieni-con-noi?from=lead-magnet" replace />` prima di leggere sessionStorage.
- `ExitIntentPopup.tsx`: se non live, usare copy newsletter e nessun `href` PDF.
- `HomeLeadMagnet.tsx`: se non live, restituire `null`.
- `Destinazione.tsx` e `Newsletter.tsx`: usare `getAudienceCta()` invece di link diretti quando non live.

- [ ] **Step 3: Verificare assenza di link diretti**

Run:

```powershell
npm run test:unit -- src/pages/LeadMagnetGate.test.tsx
rg -n "lead-magnet-posti-italiani\.pdf" src --glob "*.tsx"
```

Expected: test PASS; l'unico link diretto rimasto è dentro `LeadMagnet.tsx`, protetto dal gate live.

- [ ] **Step 4: Commit selettivo**

```powershell
git add src/pages/LeadMagnet.tsx src/components/ExitIntentPopup.tsx src/components/home/HomeLeadMagnet.tsx src/pages/Destinazione.tsx src/components/Newsletter.tsx src/pages/LeadMagnetGate.test.tsx
git commit -m "fix(marketing): hide unavailable guide promises"
```

### Task 5: Approvare e attivare il lead magnet

**Files:**

- Modify: `src/data/lead-magnet-approval.json`
- Modify: `src/config/public-surfaces.json`
- Modify: `scripts/generate-lead-magnet.tsx`
- Modify: `docs/MARKETING_OPERATIONS_HUB.md`
- Modify: `docs/10_Projects/PROJECT_RELEASE_READINESS.md`

**Interfaces:**

- Consumes: fact-check e approvazione R&B.
- Produces: PDF pubblico e funnel live.

- [ ] **Step 1: Eseguire fact-check prima dell'attivazione**

Usare la skill locale `verify-facts` sui dieci record: distanze, tempi, accesso, stagionalità, costi e restrizioni. Correggere i testi sorgente e conservare fonti/data nel report di verifica.

- [ ] **Step 2: Ottenere l'approvazione owner**

Rodrigo e Betta approvano i dieci record, le fotografie, il titolo e la promessa di consegna. Aggiornare ogni record con `status`, `approvedBy`, `approvedAt`, `sourceUrl`.

- [ ] **Step 3: Attivare la superficie**

Cambiare esclusivamente:

```json
"leadMagnet": "live"
```

Eseguire:

```powershell
npm run lead-magnet:audit
npm run generate:lead-magnet
npm run test:unit -- src/pdf/leadMagnetApproval.test.ts src/components/Newsletter.test.tsx src/pages/VieniConNoi.test.tsx src/pages/LeadMagnetGate.test.tsx
npm run build
npx playwright test e2e/home.spec.ts
```

Expected: tutti i comandi exit code `0`; PDF presente e download tracciato.

- [ ] **Step 4: Aggiornare le note e committare**

```powershell
git add src/data/lead-magnet-approval.json src/config/public-surfaces.json scripts/generate-lead-magnet.tsx public/lead-magnet-posti-italiani.pdf docs/MARKETING_OPERATIONS_HUB.md docs/10_Projects/PROJECT_RELEASE_READINESS.md
git commit -m "content(lead-magnet): publish approved Italian places guide"
```
