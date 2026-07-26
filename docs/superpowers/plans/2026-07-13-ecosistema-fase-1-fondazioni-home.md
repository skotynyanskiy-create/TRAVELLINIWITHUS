---
type: plan
area: website
status: active
priority: p0
owner: Rodrigo & Betta
created: 2026-07-13
tags:
  - website
  - homepage
  - navigation
  - ux
---

# Fase 1 — Fondazioni UX, Navigazione e Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rendere immediatamente coerenti navigazione, CTA, disponibilità delle superfici e homepage Atlante Vivo senza dipendere da metriche o contenuti privati.

**Architecture:** Un manifest JSON governa le superfici pubbliche in client e sitemap. Navbar, footer, route e homepage consumano lo stesso stato; le modifiche visive restano chirurgiche e non cambiano il design system.

**Tech Stack:** React 19, TypeScript, React Router, Tailwind CSS 4, Vitest, Testing Library, Playwright, Node.js ESM.

## Global Constraints

- Conservare `Atlante Vivo`, palette, tipografia e componenti esistenti.
- Menu desktop e mobile: Esplora, Mappa, Organizza, Chi siamo; Collabora separato; CTA audience separata.
- `/vieni-con-noi` non compare nel menu interno.
- Shop e Club sono nascosti finché lo stato non è `live`.
- Il lead magnet non viene promesso finché lo stato non è `live`.
- Nessuna modifica ai file backend ad alto rischio.

---

### Task 1: Manifest delle superfici pubbliche

**Files:**

- Create: `src/config/public-surfaces.json`
- Create: `src/config/publicSurfaces.ts`
- Test: `src/config/publicSurfaces.test.ts`

**Interfaces:**

- Produces: `PublicSurface`, `PublicSurfaceState`, `getSurfaceState(surface)`, `isSurfaceLive(surface)`, `getAudienceCta()`.
- Consumes: nessuna interfaccia applicativa.

- [ ] **Step 1: Scrivere il test fallente**

```ts
import { describe, expect, it } from 'vitest';
import { getAudienceCta, getSurfaceState, isSurfaceLive } from './publicSurfaces';

describe('publicSurfaces', () => {
  it('keeps unapproved commercial surfaces hidden', () => {
    expect(getSurfaceState('shop')).toBe('hidden');
    expect(getSurfaceState('club')).toBe('hidden');
    expect(isSurfaceLive('shop')).toBe(false);
  });

  it('falls back to the editorial newsletter while the guide is hidden', () => {
    expect(getAudienceCta()).toEqual({
      label: 'Ricevi i prossimi posti',
      to: '/#newsletter',
    });
  });
});
```

- [ ] **Step 2: Verificare il fallimento**

Run: `npm run test:unit -- src/config/publicSurfaces.test.ts`

Expected: FAIL perché `publicSurfaces.ts` non esiste.

- [ ] **Step 3: Creare manifest e wrapper tipizzato**

`src/config/public-surfaces.json`:

```json
{
  "shop": "hidden",
  "club": "hidden",
  "leadMagnet": "hidden",
  "favorites": "live",
  "account": "hidden"
}
```

`src/config/publicSurfaces.ts`:

```ts
import surfaceManifest from './public-surfaces.json';

export type PublicSurface = keyof typeof surfaceManifest;
export type PublicSurfaceState = 'live' | 'waitlist' | 'hidden';

const states: Record<PublicSurface, PublicSurfaceState> = surfaceManifest;

export function getSurfaceState(surface: PublicSurface): PublicSurfaceState {
  return states[surface];
}

export function isSurfaceLive(surface: PublicSurface): boolean {
  return getSurfaceState(surface) === 'live';
}

export function getAudienceCta(): { label: string; to: string } {
  return isSurfaceLive('leadMagnet')
    ? { label: 'Ricevi la guida', to: '/vieni-con-noi?path=guida' }
    : { label: 'Ricevi i prossimi posti', to: '/#newsletter' };
}
```

- [ ] **Step 4: Verificare test e tipi**

Run: `npm run test:unit -- src/config/publicSurfaces.test.ts && npm run typecheck`

Expected: PASS e typecheck exit code `0`.

- [ ] **Step 5: Commit selettivo**

```powershell
git add src/config/public-surfaces.json src/config/publicSurfaces.ts src/config/publicSurfaces.test.ts
git commit -m "feat(config): govern public surface availability"
```

### Task 2: Nuova architettura della Navbar

**Files:**

- Modify: `src/components/Navbar.tsx`
- Modify: `src/components/Navbar.test.tsx`

**Interfaces:**

- Consumes: `getAudienceCta()`, `isSurfaceLive()` da Task 1.
- Produces: menu desktop/mobile con la stessa IA e CTA.

- [ ] **Step 1: Aggiornare il test con la nuova IA**

Sostituire il test della navigazione con:

```ts
it('renders the approved internal information architecture', () => {
  const { getAllByText, queryByText } = renderNavbar();

  expect(getAllByText(/^Esplora$/i).length).toBeGreaterThan(0);
  expect(getAllByText(/^Mappa$/i).length).toBeGreaterThan(0);
  expect(getAllByText(/^Organizza$/i).length).toBeGreaterThan(0);
  expect(getAllByText(/^Chi siamo$/i).length).toBeGreaterThan(0);
  expect(getAllByText(/Collabora/i).length).toBeGreaterThan(0);
  expect(getAllByText(/Ricevi i prossimi posti/i).length).toBeGreaterThan(0);

  expect(queryByText(/^Destinazioni$/i)).not.toBeInTheDocument();
  expect(queryByText(/^Racconti$/i)).not.toBeInTheDocument();
  expect(queryByText(/^Shop$/i)).not.toBeInTheDocument();
  expect(queryByText(/^Vieni con noi$/i)).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Verificare il fallimento**

Run: `npm run test:unit -- src/components/Navbar.test.tsx`

Expected: FAIL sui label ancora presenti e sulla CTA mancante.

- [ ] **Step 3: Sostituire le definizioni del menu**

Importare:

```ts
import { getAudienceCta, isSurfaceLive } from '../config/publicSurfaces';
```

Dentro `Navbar`, definire:

```ts
const organizzaLinks = useMemo<NavSubLink[]>(
  () => [
    { name: 'Itinerari', href: '/itinerari', description: 'Percorsi e tappe da usare.' },
    { name: 'Strumenti', href: '/strumenti', description: 'Utility per decidere e partire.' },
    { name: 'Risorse', href: '/risorse', description: 'Servizi e gear scelti con criterio.' },
  ],
  []
);

const audienceCta = getAudienceCta();

const navItems = useMemo<NavItem[]>(() => {
  const all: NavItem[] = [
    { name: 'Esplora', href: '/esplora' },
    { name: 'Mappa', href: '/mappa' },
    { name: 'Organizza', href: '/itinerari', subLinks: organizzaLinks },
    {
      name: navigation.aboutLabel,
      href: '/chi-siamo',
      subLinks: [{ name: navigation.contactsLabel, href: '/contatti' }],
    },
  ];

  return LITE_MODE
    ? all.filter((item) => !['/esplora', '/itinerari'].includes(item.href ?? ''))
    : all;
}, [navigation, organizzaLinks]);
```

Rimuovere i blocchi `destinazioniLinks`, `destinazioniFeature` e
`raccontiLinks`. Prima del controllo generico di `item.href`, aggiungere a
`isItemActive`:

```ts
if (item.name === 'Organizza') {
  return (
    path.startsWith('/itinerari') || path.startsWith('/strumenti') || path.startsWith('/risorse')
  );
}
```

- [ ] **Step 4: Sostituire le CTA desktop e mobile**

Usare in entrambi i punti:

```tsx
<Link
  to={audienceCta.to}
  className="inline-flex items-center rounded-full bg-[var(--color-accent)] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white"
>
  {audienceCta.label}
</Link>
```

Mantenere `Collabora` come link secondario a `/collaborazioni`. Mostrare preferiti soltanto con `!LITE_MODE && isSurfaceLive('favorites')`.

- [ ] **Step 5: Verificare Navbar**

Run: `npm run test:unit -- src/components/Navbar.test.tsx && npm run typecheck`

Expected: PASS, nessun errore TypeScript.

- [ ] **Step 6: Commit selettivo**

```powershell
git add src/components/Navbar.tsx src/components/Navbar.test.tsx
git commit -m "feat(navbar): align internal information architecture"
```

### Task 3: Nascondere superfici premature in route, footer e sitemap

**Files:**

- Create: `src/components/PublicSurfaceRoute.tsx`
- Create: `src/components/PublicSurfaceRoute.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/Footer.tsx`
- Create: `src/components/Footer.test.tsx`
- Modify: `scripts/public-route-manifest.js`

**Interfaces:**

- Consumes: `PublicSurface`, `isSurfaceLive()`.
- Produces: `PublicSurfaceRoute({ surface, children })`.

- [ ] **Step 1: Scrivere il test del route gate**

```tsx
import { describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import PublicSurfaceRoute from './PublicSurfaceRoute';

describe('PublicSurfaceRoute', () => {
  it('redirects a hidden surface to the owned social hub', () => {
    render(
      <MemoryRouter initialEntries={['/shop']}>
        <Routes>
          <Route path="/vieni-con-noi" element={<div>Hub proprietario</div>} />
          <Route
            path="/shop"
            element={
              <PublicSurfaceRoute surface="shop">
                <div>Shop</div>
              </PublicSurfaceRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Hub proprietario')).toBeInTheDocument();
    expect(screen.queryByText('Shop')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Verificare il fallimento**

Run: `npm run test:unit -- src/components/PublicSurfaceRoute.test.tsx`

Expected: FAIL perché il componente non esiste.

- [ ] **Step 3: Implementare il route gate**

```tsx
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isSurfaceLive, type PublicSurface } from '../config/publicSurfaces';

interface PublicSurfaceRouteProps {
  surface: PublicSurface;
  children: ReactNode;
}

export default function PublicSurfaceRoute({ surface, children }: PublicSurfaceRouteProps) {
  return isSurfaceLive(surface) ? (
    children
  ) : (
    <Navigate to={`/vieni-con-noi?from=${surface}`} replace />
  );
}
```

Importare `PublicSurfaceRoute` e sostituire le route interessate con:

```tsx
{!LITE_MODE && (
  <Route
    path="shop"
    element={<PublicSurfaceRoute surface="shop"><Shop /></PublicSurfaceRoute>}
  />
)}
{!LITE_MODE && (
  <Route
    path="shop/:slug"
    element={<PublicSurfaceRoute surface="shop"><ProductPage /></PublicSurfaceRoute>}
  />
)}
{!LITE_MODE && (
  <Route
    path="club"
    element={<PublicSurfaceRoute surface="club"><Club /></PublicSurfaceRoute>}
  />
)}
{!LITE_MODE && (
  <Route
    path="preferiti"
    element={<PublicSurfaceRoute surface="favorites"><Preferiti /></PublicSurfaceRoute>}
  />
)}
<Route
  path="account/acquisti"
  element={<PublicSurfaceRoute surface="account"><MieiAcquisti /></PublicSurfaceRoute>}
/>
<Route
  path="lead-magnet"
  element={<PublicSurfaceRoute surface="leadMagnet"><LeadMagnet /></PublicSurfaceRoute>}
/>
```

- [ ] **Step 4: Testare e applicare il filtro Footer**

Nel nuovo test renderizzare `Footer` con i mock già usati da `Navbar.test.tsx` e verificare:

```ts
expect(screen.queryByRole('link', { name: /Shop Premium/i })).not.toBeInTheDocument();
expect(screen.queryByRole('link', { name: /^Club$/i })).not.toBeInTheDocument();
expect(screen.getByRole('link', { name: /^Mappa$/i })).toBeInTheDocument();
```

In `Footer.tsx` importare `isSurfaceLive` e sostituire i due guard con:

```tsx
{
  !LITE_MODE && isSurfaceLive('shop') && (
    <li>
      <Link
        to="/shop"
        className="inline-block text-base transition-colors hover:text-[var(--color-accent)]"
      >
        Shop Premium
      </Link>
    </li>
  );
}
{
  !LITE_MODE && isSurfaceLive('club') && (
    <li>
      <Link
        to="/club"
        className="inline-block text-base transition-colors hover:text-[var(--color-accent)]"
      >
        Club
      </Link>
    </li>
  );
}
```

- [ ] **Step 5: Allineare la sitemap**

In `scripts/public-route-manifest.js` importare il JSON con `createRequire` e impostare:

```js
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const surfaces = require('../src/config/public-surfaces.json');

const isLive = (surface) => surfaces[surface] === 'live';
```

Sostituire le voci interessate del manifest con:

```js
{ path: '/club', sitemap: isLive('club'), role: 'waitlist' },
{ path: '/shop', sitemap: isLive('shop'), role: 'preorder-waitlist' },
{ path: '/lead-magnet', sitemap: false, role: 'post-submit' },
```

- [ ] **Step 6: Verificare l'intero task**

Run:

```powershell
npm run test:unit -- src/components/PublicSurfaceRoute.test.tsx src/components/Footer.test.tsx
npm run typecheck
node scripts/generate-sitemap.js
Select-String -Path public/sitemap.xml -Pattern '/shop|/club'
```

Expected: test e typecheck PASS; la ricerca sitemap non restituisce risultati.

- [ ] **Step 7: Commit selettivo**

```powershell
git add src/components/PublicSurfaceRoute.tsx src/components/PublicSurfaceRoute.test.tsx src/App.tsx src/components/Footer.tsx src/components/Footer.test.tsx scripts/public-route-manifest.js public/sitemap.xml
git commit -m "feat(routes): gate unfinished public surfaces"
```

### Task 4: Correggere hero e aree geografiche

**Files:**

- Modify: `src/components/home/atlante/HeroCopertina.tsx`
- Modify: `src/components/home/atlante/ZoneBand.tsx`
- Create: `src/components/home/atlante/AtlanteHome.test.tsx`

**Interfaces:**

- Produces: hero con CTA Esplora/Mappa; `ZoneBand` senza card senza fotografia reale.

- [ ] **Step 1: Scrivere i test fallenti**

```tsx
import { describe, expect, it } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import HeroCopertina from './HeroCopertina';
import ZoneBand from './ZoneBand';

describe('Atlante Vivo entry points', () => {
  it('offers owned discovery and map actions in the hero', () => {
    render(
      <BrowserRouter>
        <HeroCopertina />
      </BrowserRouter>
    );
    expect(screen.getByRole('link', { name: /Scopri le destinazioni/i })).toHaveAttribute(
      'href',
      '/esplora'
    );
    expect(screen.getByRole('link', { name: /Apri la mappa/i })).toHaveAttribute('href', '/mappa');
    expect(screen.queryByRole('link', { name: /Guarda gli ultimi reel/i })).not.toBeInTheDocument();
  });

  it('does not render a geographic card without a real photo', () => {
    render(
      <BrowserRouter>
        <ZoneBand />
      </BrowserRouter>
    );
    expect(screen.getByRole('link', { name: /Esplora Italia/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Esplora Mondo/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Esplora Europa/i })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Verificare il fallimento**

Run: `npm run test:unit -- src/components/home/atlante/AtlanteHome.test.tsx`

Expected: FAIL sulla CTA secondaria e sulla card Europa.

- [ ] **Step 3: Modificare la hero**

```tsx
<Button variant="cta" size="lg" to="/esplora" magnetic trackingId="hero_esplora">
  Scopri le destinazioni
</Button>
<Button variant="outline-light" size="lg" to="/mappa" trackingId="hero_mappa">
  Apri la mappa
</Button>
```

- [ ] **Step 4: Eliminare il rendering delle card senza foto**

In `ZoneBand.tsx` rimuovere `PlaceholderZoneCard`, l'import `Compass` e la voce Europa. Tipizzare `ZONE_CARDS` come `PhotoZoneCard[]` e rendere sempre `OptimizedImage`; non lasciare un branch placeholder.

- [ ] **Step 5: Verificare componenti**

Run: `npm run test:unit -- src/components/home/atlante/AtlanteHome.test.tsx && npm run typecheck`

Expected: PASS.

- [ ] **Step 6: Commit selettivo**

```powershell
git add src/components/home/atlante/HeroCopertina.tsx src/components/home/atlante/ZoneBand.tsx src/components/home/atlante/AtlanteHome.test.tsx
git commit -m "feat(home): prioritize owned discovery paths"
```

### Task 5: Rendere il metodo verificabile e predisporre la foto approvata

**Files:**

- Modify: `src/config/site.ts`
- Modify: `src/components/home/atlante/MetodoBand.tsx`
- Create: `src/components/home/atlante/MetodoBand.test.tsx`

**Interfaces:**

- Produces: `BRAND_ASSETS.methodPortrait` con flag di approvazione; copy disclosure non assoluto.

- [ ] **Step 1: Scrivere il test fallente**

```tsx
it('uses a verifiable disclosure policy and hides an unapproved portrait', () => {
  render(
    <BrowserRouter>
      <MetodoBand />
    </BrowserRouter>
  );
  expect(
    screen.getByText('Trasparenza commerciale dichiarata nei contenuti curati')
  ).toBeInTheDocument();
  expect(screen.queryByRole('img', { name: /Rodrigo e Betta/i })).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Verificare il fallimento**

Run: `npm run test:unit -- src/components/home/atlante/MetodoBand.test.tsx`

Expected: FAIL sul testo attuale.

- [ ] **Step 3: Aggiungere il contratto asset e correggere il copy**

In `src/config/site.ts`:

```ts
export const BRAND_ASSETS = {
  methodPortrait: {
    src: '/images/brand/about-editorial.webp',
    alt: 'Rodrigo e Betta durante un viaggio per Travelliniwithus',
    approved: false,
  },
} as const;
```

Impostare:

```ts
disclosurePolicyLabel: 'Trasparenza commerciale dichiarata nei contenuti curati',
```

- [ ] **Step 4: Rendere la foto condizionale**

Importare `BRAND_ASSETS` e aggiungere prima della lista credenziali:

```tsx
{
  BRAND_ASSETS.methodPortrait.approved && (
    <OptimizedImage
      src={BRAND_ASSETS.methodPortrait.src}
      alt={BRAND_ASSETS.methodPortrait.alt}
      className="mb-5 aspect-[4/3] w-full rounded-[var(--radius-lg)] object-cover"
      responsiveWidths={[320, 480, 768]}
    />
  );
}
```

Il flag passa a `true` soltanto dopo conferma dei diritti d'uso da parte di R&B.

- [ ] **Step 5: Verificare**

Run: `npm run test:unit -- src/components/home/atlante/MetodoBand.test.tsx && npm run typecheck`

Expected: PASS.

- [ ] **Step 6: Commit selettivo**

```powershell
git add src/config/site.ts src/components/home/atlante/MetodoBand.tsx src/components/home/atlante/MetodoBand.test.tsx
git commit -m "content(home): make editorial method claims verifiable"
```

### Task 6: Browser regression e nota operativa

**Files:**

- Modify: `e2e/home.spec.ts`
- Modify: `docs/10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT.md`

**Interfaces:**

- Verifica il risultato combinato dei Task 1-5.

- [ ] **Step 1: Aggiungere il test Playwright**

```ts
test('approved home navigation exposes only ready primary paths', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('link', { name: /^Esplora$/ }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /^Mappa$/ }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /^Organizza$/ }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /Ricevi i prossimi posti/ }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /^Shop$/ })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /^Vieni con noi$/ })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Apri la mappa/ })).toBeVisible();
});
```

- [ ] **Step 2: Eseguire il gate della fase**

Run:

```powershell
npm run test:unit -- src/config/publicSurfaces.test.ts src/components/Navbar.test.tsx src/components/PublicSurfaceRoute.test.tsx src/components/Footer.test.tsx src/components/home/atlante/AtlanteHome.test.tsx src/components/home/atlante/MetodoBand.test.tsx
npm run typecheck
npm run lint
npm run build
npx playwright test e2e/home.spec.ts
```

Expected: tutti i comandi exit code `0`.

- [ ] **Step 3: Aggiornare la nota di progetto**

Registrare in `PROJECT_HOME_HERO_NAV_REFINEMENT.md`: IA applicata, superfici nascoste, CTA hero, Europa rimossa, asset metodo ancora non approvato, risultati dei comandi e hash dei commit.

- [ ] **Step 4: Commit selettivo**

```powershell
git add e2e/home.spec.ts docs/10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT.md
git commit -m "test(home): verify approved navigation paths"
```
