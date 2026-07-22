# Promessa = sostanza — piano di implementazione

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allineare ciò che il sito annuncia a ciò che il sito mantiene, introducendo un registro unico dello stato delle superfici da cui derivano `noindex`, sitemap, etichette e pagine d'attesa.

**Architecture:** `scripts/public-route-manifest.js` — già un registro a metà, lato build — viene promosso a `src/config/surfaces.ts`, tipizzato ed esteso, e letto sia dall'app React sia dagli script di build. Da lì derivano indicizzabilità, sitemap e suffissi di navigazione. `src/config/liteMode.ts` e le sue tre copie sparse vengono cancellati. I nomi restano dove già vivono, in `siteContent.navigation`, che viene completato.

**Tech Stack:** React 19, TypeScript non-strict, Vite 6, Tailwind 4, Vitest (`vitest run`, progetto `unit`, jsdom, include `src/**/*.{test,spec}.{ts,tsx}`), Playwright per e2e.

**Spec:** [2026-07-22-promessa-sostanza-design.md](../specs/2026-07-22-promessa-sostanza-design.md) — approvata dall'owner.

## Global Constraints

- Nessuna rotta viene rimossa o smontata: tutte restano raggiungibili via URL diretto.
- File ad alto rischio — `server.ts`, `firestore.rules`, `src/config/admin.ts` — **non vanno toccati** da nessun task di questo piano.
- Copy pubblica italiana nuova: **non improvvisarla**. I task strutturali usano i testi già presenti; la copy definitiva arriva nel Task 11 via `travellini-seo-conversion-strategist`.
- Il nome dello Shop è **«Shop»**, deciso dall'owner. La stringa `'Shop Premium'` non deve sopravvivere in `src/`.
- `/preferiti` diventa `noindex` — deciso dall'owner.
- Linguaggio visivo invariato: Fraunces, sand `#faf8f4`, terracotta `#c2410c`, lucide-react, foto reali. Nessun redesign.
- Ogni pagina pubblica ha esattamente un `h1`.
- Dopo ogni modifica TypeScript: `npm run typecheck`.
- Commit frequenti, uno per task. Mai `git add -A`: stage selettivo per path.

---

### Task 1: Il registro delle superfici

**Files:**

- Create: `src/config/surfaces.ts`
- Test: `src/config/surfaces.test.ts`
- Read-only reference: `scripts/public-route-manifest.js` (contenuto da assorbire, cancellato nel Task 2)

**Interfaces:**

- Consumes: niente, è il primo task.
- Produces:
  - `type SurfaceState = 'live' | 'preview' | 'soon'`
  - `interface Surface { path: string; state: SurfaceState; private?: boolean; missing?: string }`
  - `SURFACES: Surface[]`
  - `findSurface(pathname: string): Surface | undefined`
  - `isIndexable(pathname: string): boolean`
  - `surfaceState(pathname: string): SurfaceState`
  - `sitemapPaths(): string[]`

- [ ] **Step 1: Scrivi il test che fallisce**

Crea `src/config/surfaces.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { SURFACES, findSurface, isIndexable, surfaceState, sitemapPaths } from './surfaces';

describe('registro delle superfici', () => {
  it('trova una superficie statica per pathname esatto', () => {
    expect(findSurface('/mappa')?.state).toBe('live');
  });

  it('trova una superficie dinamica per pattern', () => {
    expect(findSurface('/posto/emilia-granduca-di-campigna')?.path).toBe('/posto/:slug');
    expect(findSurface('/destinazione/italia')?.path).toBe('/destinazione/:zoneSlug');
  });

  it('preferisce la rotta statica a quella dinamica quando entrambe combaciano', () => {
    expect(findSurface('/itinerari/compare')?.path).toBe('/itinerari/compare');
  });

  it('considera indicizzabile solo cio che e live e non private', () => {
    expect(isIndexable('/mappa')).toBe(true);
    expect(isIndexable('/shop')).toBe(false);
    expect(isIndexable('/itinerari')).toBe(false);
    expect(isIndexable('/preferiti')).toBe(false);
  });

  it('espone lo stato di una superficie, con live come default per rotte ignote', () => {
    expect(surfaceState('/shop')).toBe('soon');
    expect(surfaceState('/itinerari')).toBe('preview');
    expect(surfaceState('/rotta-che-non-esiste')).toBe('live');
  });

  it('mette in sitemap solo le superfici statiche live e non private', () => {
    const paths = sitemapPaths();
    expect(paths).toContain('/destinazione');
    expect(paths).toContain('/mappa');
    expect(paths).not.toContain('/shop');
    expect(paths).not.toContain('/itinerari');
    expect(paths).not.toContain('/preferiti');
    expect(paths.every((p) => !p.includes(':'))).toBe(true);
  });

  it('non contiene duplicati di path', () => {
    const seen = SURFACES.map((s) => s.path);
    expect(new Set(seen).size).toBe(seen.length);
  });
});
```

- [ ] **Step 2: Esegui il test e verifica che fallisca**

```bash
npx vitest run src/config/surfaces.test.ts
```

Atteso: FAIL — `Failed to resolve import "./surfaces"`.

- [ ] **Step 3: Scrivi l'implementazione**

Crea `src/config/surfaces.ts`:

```ts
/**
 * Registro delle superfici pubbliche: quanto e vera ciascuna sezione del sito.
 * Fonte unica per noindex, sitemap e suffissi di navigazione.
 *
 * NON contiene le etichette: i nomi vivono in siteContent.navigation, che resta
 * editabile dall'admin. Una preoccupazione, una casa.
 *
 * NON sostituisce i flag per-contenuto (isPlaceholder, isDemo): quelli sono
 * proprieta del singolo item e si sommano in OR a quanto dice il registro.
 */

export type SurfaceState = 'live' | 'preview' | 'soon';

export interface Surface {
  /** Pattern di rotta come dichiarato in App.tsx. */
  path: string;
  state: SurfaceState;
  /** Reale per l'utente, invisibile ai crawler. Ortogonale allo stato. */
  private?: boolean;
  /** Cosa manca perche diventi 'live'. */
  missing?: string;
}

export const SURFACES: Surface[] = [
  { path: '/', state: 'live' },
  { path: '/esplora', state: 'live' },
  { path: '/destinazione', state: 'live' },
  { path: '/destinazione/:zoneSlug', state: 'live' },
  { path: '/destinazione/:zoneSlug/:subSlug', state: 'live' },
  { path: '/mappa', state: 'live' },
  { path: '/chi-siamo', state: 'live' },
  { path: '/collaborazioni', state: 'live' },
  { path: '/media-kit', state: 'live' },
  { path: '/press', state: 'live' },
  { path: '/contatti', state: 'live' },
  { path: '/strumenti', state: 'live' },
  { path: '/risorse', state: 'live' },
  { path: '/club', state: 'live' },
  { path: '/posto/:slug', state: 'live' },
  { path: '/articolo/:slug', state: 'live' },
  { path: '/privacy', state: 'live' },
  { path: '/cookie', state: 'live' },
  { path: '/termini', state: 'live' },
  { path: '/disclaimer', state: 'live' },

  { path: '/itinerari', state: 'preview', missing: 'itinerari reali al posto dei due demo' },
  { path: '/itinerari/compare', state: 'preview', missing: 'itinerari reali da confrontare' },
  { path: '/itinerari/:slug', state: 'preview', missing: 'itinerari reali al posto dei due demo' },
  { path: '/guide/:slug', state: 'preview', missing: 'guide vere al posto delle due demo' },

  { path: '/shop', state: 'soon', missing: 'prodotti acquistabili' },
  { path: '/shop/:slug', state: 'soon', missing: 'prodotti acquistabili' },

  { path: '/preferiti', state: 'live', private: true },
  { path: '/account/acquisti', state: 'live', private: true },
  { path: '/lead-magnet', state: 'live', private: true },
  { path: '/vieni-con-noi', state: 'live', private: true },
  { path: '/manifesto', state: 'live', private: true },
];

const toRegExp = (pattern: string) => new RegExp(`^${pattern.replace(/:[^/]+/g, '[^/]+')}/?$`);

/**
 * Le rotte statiche vincono sulle dinamiche: /itinerari/compare non deve
 * risolvere su /itinerari/:slug.
 */
const BY_SPECIFICITY = [...SURFACES].sort(
  (a, b) => Number(a.path.includes(':')) - Number(b.path.includes(':'))
);

export function findSurface(pathname: string): Surface | undefined {
  return BY_SPECIFICITY.find((s) => toRegExp(s.path).test(pathname));
}

export function surfaceState(pathname: string): SurfaceState {
  return findSurface(pathname)?.state ?? 'live';
}

export function isIndexable(pathname: string): boolean {
  const surface = findSurface(pathname);
  if (!surface) return true;
  return surface.state === 'live' && !surface.private;
}

export function sitemapPaths(): string[] {
  return SURFACES.filter((s) => s.state === 'live' && !s.private && !s.path.includes(':')).map(
    (s) => s.path
  );
}
```

- [ ] **Step 4: Esegui il test e verifica che passi**

```bash
npx vitest run src/config/surfaces.test.ts
```

Atteso: PASS, 7 test.

- [ ] **Step 5: Typecheck**

```bash
npm run typecheck
```

Atteso: nessun output di errore.

- [ ] **Step 6: Commit**

```bash
git add src/config/surfaces.ts src/config/surfaces.test.ts
git commit -m "feat(surfaces): un registro solo per dire quanto e vera ogni sezione"
```

---

### Task 2: La sitemap si genera dal registro

**Files:**

- Modify: `scripts/generate-sitemap.js:1-20` (import e logica lite)
- Delete: `scripts/public-route-manifest.js`
- Test: `src/config/surfaces.sitemap.test.ts`

**Interfaces:**

- Consumes: `sitemapPaths()` dal Task 1.
- Produces: `public/sitemap.xml` rigenerata, contenente `/destinazione` e le sue zone.

Nota per chi implementa: `scripts/generate-sitemap.js` è un modulo ESM eseguito da node.
Per importare da `src/` deve essere eseguito con `tsx`, come già fanno
`scripts/generate-lead-magnet.tsx` e `scripts/generate-media-kit.tsx`. Rinomina il file in
`scripts/generate-sitemap.mjs` **solo se** già non lo è, e aggiorna lo script in
`package.json` che lo invoca da `node scripts/generate-sitemap.js` a
`npx tsx scripts/generate-sitemap.js`.

- [ ] **Step 1: Registra la sitemap attuale come baseline**

```bash
grep -o '<loc>[^<]*</loc>' public/sitemap.xml | sed 's|<loc>https://travelliniwithus.it||;s|</loc>||' | sort > /tmp/sitemap-prima.txt
cat /tmp/sitemap-prima.txt
```

Atteso: 15 righe, senza `/destinazione`.

- [ ] **Step 2: Scrivi il test che fallisce**

Crea `src/config/surfaces.sitemap.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { sitemapPaths } from './surfaces';

/**
 * Guardia di non-regressione: i 15 URL gia in sitemap al 2026-07-22 devono
 * restarci, tranne quelli che l'owner ha deciso di togliere.
 */
const GIA_IN_SITEMAP = [
  '/',
  '/esplora',
  '/strumenti',
  '/press',
  '/mappa',
  '/chi-siamo',
  '/collaborazioni',
  '/media-kit',
  '/contatti',
  '/risorse',
  '/club',
  '/privacy',
  '/cookie',
  '/termini',
  '/disclaimer',
];

describe('sitemap dal registro', () => {
  it('non perde nessuno dei 15 URL gia pubblicati', () => {
    const paths = sitemapPaths();
    for (const url of GIA_IN_SITEMAP) {
      expect(paths, `${url} sparito dalla sitemap`).toContain(url);
    }
  });

  it('aggiunge /destinazione, che mancava', () => {
    expect(sitemapPaths()).toContain('/destinazione');
  });
});
```

- [ ] **Step 3: Esegui il test**

```bash
npx vitest run src/config/surfaces.sitemap.test.ts
```

Atteso: PASS — il Task 1 ha già reso vere entrambe le asserzioni. Se fallisce, il registro del Task 1 è incompleto: correggi `SURFACES` prima di procedere.

- [ ] **Step 4: Aggancia il generatore al registro**

In `scripts/generate-sitemap.js`, sostituisci le righe 1-21 (import del manifest, costanti lite, `allStaticRoutes`, `staticRoutes`) con:

```js
import fs from 'fs';
import path from 'path';
import { sitemapPaths } from '../src/config/surfaces.ts';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const contentSeed = require('../src/data/content-seed.json');

const BASE_URL = 'https://travelliniwithus.it';

// Lo stato delle superfici e la fonte unica: niente copia locale della logica
// lite, che qui era riscritta a mano ed era la terza in giro per il repo.
const staticRoutes = sitemapPaths();
```

Verifica che nel resto del file non restino riferimenti a `PUBLIC_ROUTE_MANIFEST`, `LITE_MODE`, `isLiteDisabled` o `allStaticRoutes`:

```bash
grep -nE "PUBLIC_ROUTE_MANIFEST|LITE_MODE|isLiteDisabled|allStaticRoutes" scripts/generate-sitemap.js
```

Atteso: nessun risultato.

- [ ] **Step 5: Rigenera e confronta**

```bash
npx tsx scripts/generate-sitemap.js
grep -o '<loc>[^<]*</loc>' public/sitemap.xml | sed 's|<loc>https://travelliniwithus.it||;s|</loc>||' | sort > /tmp/sitemap-dopo.txt
diff /tmp/sitemap-prima.txt /tmp/sitemap-dopo.txt
```

Atteso: unica differenza è l'aggiunta di `/destinazione`. Nessuna riga rimossa. Se qualcosa sparisce, è un errore nel registro: correggilo, non accettare la perdita.

- [ ] **Step 6: Cancella il manifest promosso**

```bash
git rm scripts/public-route-manifest.js
grep -rn "public-route-manifest" scripts/ src/ package.json
```

Atteso: nessun risultato.

- [ ] **Step 7: Commit**

```bash
git add scripts/generate-sitemap.js public/sitemap.xml src/config/surfaces.sitemap.test.ts
git commit -m "feat(sitemap): generala dal registro, cosi smette di dimenticare /destinazione"
```

---

### Task 3: `noindex` derivato dal registro

**Files:**

- Modify: `src/components/SEO.tsx:28-45`
- Modify: `src/pages/Shop.tsx:129` (rimuove `noindex={true}`)
- Modify: `src/pages/Itinerari.tsx:43` (rimuove `noindex`)
- Modify: `src/pages/ItinerariCompare.tsx:38` (rimuove `noindex`)
- Test: `src/components/SEO.noindex.test.tsx`

**Interfaces:**

- Consumes: `isIndexable(pathname)` dal Task 1.
- Produces: `SEO` con `noindex` opzionale che si somma in OR al registro.

- [ ] **Step 1: Scrivi il test che fallisce**

Crea `src/components/SEO.noindex.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import SEO from './SEO';

const robotsAt = (route: string, props: { noindex?: boolean } = {}) => {
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>
        <SEO title="T" description="D" {...props} />
      </MemoryRouter>
    </HelmetProvider>
  );
  return document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '';
};

describe('SEO: noindex derivato dal registro', () => {
  it('indicizza una superficie live', () => {
    expect(robotsAt('/mappa')).toContain('index, follow');
  });

  it('non indicizza una superficie soon, senza che la pagina lo chieda', () => {
    expect(robotsAt('/shop')).toBe('noindex, nofollow');
  });

  it('non indicizza una superficie preview', () => {
    expect(robotsAt('/itinerari')).toBe('noindex, nofollow');
  });

  it('non indicizza una superficie private', () => {
    expect(robotsAt('/preferiti')).toBe('noindex, nofollow');
  });

  it('somma in OR il noindex per-contenuto su una superficie live', () => {
    expect(robotsAt('/posto/qualsiasi', { noindex: true })).toBe('noindex, nofollow');
  });

  it('non permette a una pagina di forzare index su una superficie non live', () => {
    expect(robotsAt('/shop', { noindex: false })).toBe('noindex, nofollow');
  });
});
```

- [ ] **Step 2: Esegui il test e verifica che fallisca**

```bash
npx vitest run src/components/SEO.noindex.test.tsx
```

Atteso: FAIL sui casi `/shop`, `/itinerari`, `/preferiti` — oggi `SEO` non conosce il registro e restituisce `index, follow`.

- [ ] **Step 3: Aggancia SEO al registro**

In `src/components/SEO.tsx`, aggiungi l'import:

```tsx
import { isIndexable } from '../config/surfaces';
```

Cambia la firma del prop da `noindex = false` a `noindex` senza default, e sostituisci il calcolo di `resolvedCanonical` aggiungendo subito sotto:

```tsx
// Il registro decide se la superficie e indicizzabile; la pagina puo solo
// aggiungere noindex per ragioni per-contenuto (isDemo, isPlaceholder),
// mai toglierlo.
const resolvedNoindex = !isIndexable(pathname) || noindex === true;
```

Sostituisci l'uso di `noindex` nel meta robots con `resolvedNoindex`.

- [ ] **Step 4: Togli i `noindex` ora ridondanti dalle pagine**

- `src/pages/Shop.tsx:129` — elimina la riga `noindex={true}`
- `src/pages/Itinerari.tsx:43` — elimina la riga `noindex`
- `src/pages/ItinerariCompare.tsx:38` — elimina la riga `noindex`

Lascia invariati i `noindex` per-contenuto, che restano necessari: `Articolo.tsx:773`, `Guida.tsx:57`, `Itinerario.tsx:38`, `Posto.tsx:204`, `Esplora.tsx:395`, `ProductPage.tsx:106,162`, `NotFound.tsx:14`, `MieiAcquisti.tsx:153`, `Club.tsx:146`.

- [ ] **Step 5: Esegui i test e il typecheck**

```bash
npx vitest run src/components/SEO.noindex.test.tsx && npm run typecheck
```

Atteso: PASS, 6 test; typecheck pulito.

- [ ] **Step 6: Commit**

```bash
git add src/components/SEO.tsx src/components/SEO.noindex.test.tsx src/pages/Shop.tsx src/pages/Itinerari.tsx src/pages/ItinerariCompare.tsx
git commit -m "feat(seo): il registro decide l'indicizzabilita, la pagina puo solo aggiungere"
```

---

### Task 4: Pensione di `liteMode`

**Files:**

- Delete: `src/config/liteMode.ts`
- Modify: `src/App.tsx` (import riga 16, gate `!LITE_MODE &&` su 9 rotte)
- Modify: `src/components/Navbar.tsx:25,147-176`
- Modify: `src/components/Footer.tsx:8,103-158,175-184`
- Modify: `src/pages/NotFound.tsx:6,37,49`
- Modify: `src/pages/LeadMagnet.tsx:12,138`
- Modify: `src/pages/VieniConNoi.tsx:23,33,36`

**Interfaces:**

- Consumes: `surfaceState()` dal Task 1, per le voci che prima si nascondevano.
- Produces: nessuna API nuova. Rimozione pura.

Nota: le rotte in `App.tsx` condizionate da `!LITE_MODE` diventano incondizionate. Nessuna pagina sparisce, perché il flag è `false` in `.env.example` e tutte erano già online.

- [ ] **Step 1: Fotografa le rotte pubbliche prima**

```bash
grep -c "<Route" src/App.tsx
```

Annota il numero: deve restare identico a fine task.

- [ ] **Step 2: Rimuovi i gate da `App.tsx`**

Elimina l'import di riga 16 e trasforma ogni `{!LITE_MODE && <Route ... />}` nel solo `<Route ... />`. Le rotte interessate: `esplora`, `destinazioni`, `esperienze`, `blog`, `guide`, `itinerari`, `itinerari/compare`, `itinerari/:slug`, `quiz`, `preferiti`, `shop`, `shop/:slug`, `club`.

- [ ] **Step 3: Rimuovi i gate dagli altri cinque file**

- `Navbar.tsx` — elimina l'import e i due blocchi di filtro: in `raccontiLinks` (righe 147-149) resta `return all`; in `navItems` (righe 169-175) resta `return all`, e sparisce `disabledHrefs`.
- `Footer.tsx` — elimina l'import e i sei wrapper `{!LITE_MODE && ( ... )}`, lasciando i `<li>` che contengono.
- `NotFound.tsx`, `LeadMagnet.tsx`, `VieniConNoi.tsx` — elimina import e rami condizionali, tenendo il ramo `!LITE_MODE` (quello che oggi è attivo).

- [ ] **Step 4: Cancella il file e verifica che non resti nulla**

```bash
git rm src/config/liteMode.ts
grep -rniE "lite_?mode|isDisabled" src/ scripts/
```

Atteso: nessun risultato. Se `scripts/generate-sitemap.js` compare ancora, il Task 2 è incompleto.

- [ ] **Step 5: Verifica che il conteggio rotte non sia cambiato**

```bash
grep -c "<Route" src/App.tsx && npm run typecheck && npm run test
```

Atteso: stesso numero dello Step 1; typecheck pulito; tutti i test verdi.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/components/Navbar.tsx src/components/Footer.tsx src/pages/NotFound.tsx src/pages/LeadMagnet.tsx src/pages/VieniConNoi.tsx
git commit -m "refactor(lite): manda in pensione liteMode, che dichiarava spente tre pagine online"
```

---

### Task 5: Un nome solo per ogni pagina

**Files:**

- Modify: `src/config/siteContent.ts` (blocco `navigation`)
- Modify: `src/components/Navbar.tsx:151-168` (stringhe hardcoded)
- Modify: `src/components/Footer.tsx:103-200` (stringhe hardcoded, doppione Disclaimer)
- Modify: `src/pages/Shop.tsx` (title SEO e breadcrumb)
- Test: `src/components/Footer.nomi.test.tsx`

**Interfaces:**

- Consumes: `siteContentDefaults.navigation` esistente.
- Produces: chiavi nuove in `navigation` — `exploreLabel`, `mapLabel`, `storiesLabel`, `itinerariesLabel`, `clubLabel`, `pressLabel`, `whatWeUseLabel`. `shopLabel` esiste già e finalmente viene usata.

- [ ] **Step 1: Scrivi il test che fallisce**

Crea `src/components/Footer.nomi.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from './Footer';

vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ isAdmin: false }) }));
vi.mock('../hooks/useSiteContent', async () => {
  const { siteContentDefaults } = await import('../config/siteContent');
  return {
    useSiteContent: (key: keyof typeof siteContentDefaults) => ({ data: siteContentDefaults[key] }),
  };
});

const renderFooter = () =>
  render(
    <BrowserRouter>
      <Footer />
    </BrowserRouter>
  );

describe('nomi nel footer', () => {
  it('chiama lo shop "Shop", non "Shop Premium"', () => {
    renderFooter();
    expect(screen.queryByText('Shop Premium')).toBeNull();
    expect(screen.getByText('Shop')).toBeTruthy();
  });

  it('chiama /risorse "Cosa usiamo"', () => {
    renderFooter();
    expect(screen.getByText('Cosa usiamo')).toBeTruthy();
  });

  it('non linka /disclaimer due volte con due nomi diversi', () => {
    const { container } = renderFooter();
    const disclaimerLinks = container.querySelectorAll('a[href="/disclaimer"]');
    expect(disclaimerLinks.length).toBe(1);
    expect(screen.queryByText('Affiliazioni')).toBeNull();
  });
});
```

- [ ] **Step 2: Esegui il test e verifica che fallisca**

```bash
npx vitest run src/components/Footer.nomi.test.tsx
```

Atteso: FAIL su tutti e tre — oggi il footer dice «Shop Premium», e linka `/disclaimer` due volte come «Affiliazioni» e «Disclaimer».

- [ ] **Step 3: Completa il registro dei nomi — interfaccia e default insieme**

`NavigationContent` è un'interfaccia TypeScript stretta: aggiungere chiavi ai soli default
fa fallire il typecheck. Vanno toccati **entrambi** i punti di `src/config/siteContent.ts`.

Nell'interfaccia `NavigationContent` (riga ~159 nel blocco `export interface`), aggiungi:

```ts
exploreLabel: string;
mapLabel: string;
storiesLabel: string;
itinerariesLabel: string;
clubLabel: string;
pressLabel: string;
whatWeUseLabel: string;
```

Nel blocco `navigation` di `siteContentDefaults` (riga ~431), aggiungi i valori:

```ts
    exploreLabel: 'Esplora',
    mapLabel: 'Mappa',
    storiesLabel: 'Racconti',
    itinerariesLabel: 'Itinerari',
    clubLabel: 'Club',
    pressLabel: 'Press',
    whatWeUseLabel: 'Cosa usiamo',
```

Due note per chi implementa:

- `navigation` **non** compare in `siteContentDefinitions`, quindi non è esposta nel form
  dell'admin: non serve toccare `SiteContentEditor`. Le etichette restano comunque
  sovrascrivibili da Firestore via `useSiteContent('navigation')`.
- L'interfaccia contiene già `destinationsAllLabel`, `guidesLabel` e `experiencesLabel`
  che oggi non usa nessuno. Usa `destinationsAllLabel` per la voce «Tutte le destinazioni»
  hardcoded in `Navbar.tsx:120`. **Non cancellare** `guidesLabel` ed `experiencesLabel`
  in questo task: sono fuori perimetro e la cancellazione va valutata a parte.

- [ ] **Step 4: Fai passare navbar e footer dal registro**

In `Navbar.tsx`, sostituisci le stringhe hardcoded di `navItems` con le chiavi: `navigation.destinationsLabel`, `navigation.exploreLabel`, `navigation.mapLabel`, `navigation.storiesLabel`, `navigation.shopLabel`. In `raccontiLinks` usa `navigation.itinerariesLabel` per Itinerari.

In `Footer.tsx`: `'Esplora'` → `navigation.exploreLabel`; `'Mappa'` → `navigation.mapLabel`; `'Itinerari'` → `navigation.itinerariesLabel`; `'Shop Premium'` → `navigation.shopLabel`; `'Club'` → `navigation.clubLabel`; `'Press'` → `navigation.pressLabel`; `'Cosa usiamo'` → `navigation.whatWeUseLabel`.

Elimina il `<li>` che linka `/disclaimer` con etichetta «Affiliazioni» (righe 193-200): resta il solo link «Disclaimer» nella riga legale.

- [ ] **Step 5: Allinea il title dello Shop**

In `src/pages/Shop.tsx`, cambia `title="Boutique di Viaggio — guide premium e planner"` in `title="Shop — guide e planner di viaggio"` e l'eyebrow `Boutique editoriale` in `Shop`. Il breadcrumb dice già «Shop»: lascialo.

- [ ] **Step 6: Verifica che «Shop Premium» sia sparito dal repo**

```bash
npx vitest run src/components/Footer.nomi.test.tsx && grep -rn "Shop Premium\|Boutique" src/ ; npm run typecheck
```

Atteso: 3 test PASS; il grep non restituisce nulla; typecheck pulito.

- [ ] **Step 7: Commit**

```bash
git add src/config/siteContent.ts src/components/Navbar.tsx src/components/Footer.tsx src/pages/Shop.tsx src/components/Footer.nomi.test.tsx
git commit -m "fix(nomi): un nome solo per lo Shop, per Cosa usiamo e per il Disclaimer"
```

---

### Task 6: Suffissi di stato nella navigazione

**Files:**

- Create: `src/components/SurfaceBadge.tsx`
- Modify: `src/components/Navbar.tsx` (voci `navItems`)
- Modify: `src/components/Footer.tsx` (voci Shop e Itinerari)
- Test: `src/components/SurfaceBadge.test.tsx`

**Interfaces:**

- Consumes: `surfaceState(path)` dal Task 1.
- Produces: `<SurfaceBadge path="/shop" />` — rende `null` per `live`, «presto» per `soon`, «anteprima» per `preview`.

- [ ] **Step 1: Scrivi il test che fallisce**

Crea `src/components/SurfaceBadge.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import SurfaceBadge from './SurfaceBadge';

describe('SurfaceBadge', () => {
  it('non mostra niente per una superficie live', () => {
    const { container } = render(<SurfaceBadge path="/mappa" />);
    expect(container.textContent).toBe('');
  });

  it('dice "presto" per una superficie soon', () => {
    const { container } = render(<SurfaceBadge path="/shop" />);
    expect(container.textContent).toBe('presto');
  });

  it('dice "anteprima" per una superficie preview', () => {
    const { container } = render(<SurfaceBadge path="/itinerari" />);
    expect(container.textContent).toBe('anteprima');
  });
});
```

- [ ] **Step 2: Esegui il test e verifica che fallisca**

```bash
npx vitest run src/components/SurfaceBadge.test.tsx
```

Atteso: FAIL — `Failed to resolve import "./SurfaceBadge"`.

- [ ] **Step 3: Scrivi il componente**

Crea `src/components/SurfaceBadge.tsx`:

```tsx
import { surfaceState } from '../config/surfaces';

const TESTO = {
  live: null,
  preview: 'anteprima',
  soon: 'presto',
} as const;

/**
 * Dichiara accanto a una voce di nav che la sezione non e ancora vera.
 * Il testo non e salvato da nessuna parte: deriva dal registro, quindi non
 * puo divergere dall'etichetta.
 */
export default function SurfaceBadge({ path }: { path: string }) {
  const testo = TESTO[surfaceState(path)];
  if (!testo) return null;

  return (
    <span className="ml-1.5 rounded-full border border-current/30 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] opacity-70">
      {testo}
    </span>
  );
}
```

- [ ] **Step 4: Esegui il test e verifica che passi**

```bash
npx vitest run src/components/SurfaceBadge.test.tsx
```

Atteso: PASS, 3 test.

- [ ] **Step 5: Usa il badge in navbar e footer**

In `Navbar.tsx`, dentro il rendering di ogni voce di `navItems`, subito dopo il testo dell'etichetta, inserisci `<SurfaceBadge path={item.href?.split('?')[0] ?? ''} />`. Fai lo stesso nel dropdown «Racconti» per la voce Itinerari.

In `Footer.tsx`, aggiungi `<SurfaceBadge path="/shop" />` e `<SurfaceBadge path="/itinerari" />` accanto alle rispettive etichette.

- [ ] **Step 6: Typecheck e commit**

```bash
npm run typecheck
git add src/components/SurfaceBadge.tsx src/components/SurfaceBadge.test.tsx src/components/Navbar.tsx src/components/Footer.tsx
git commit -m "feat(nav): dichiara in navigazione cosa non e ancora vero"
```

---

### Task 7: Shop — l'attesa diventa una lista d'attesa

**Files:**

- Modify: `src/pages/Shop.tsx`
- Read-only reference: `src/components/Newsletter.tsx:16,130-141` (firma dei props)

**Interfaces:**

- Consumes: `Newsletter` esistente.
- Produces: niente di nuovo.

- [ ] **Step 1: Aggancia Newsletter alla pagina Shop**

Tutti i props di `NewsletterProps` sono opzionali — `variant`, `source`, `compact`,
`title`, `eyebrow`, `description`, `bullets`, `ctaLabel`, `onSuccess`, `stacked` — e la
copy di default arriva da `variantCopy[variant]`. Serve solo distinguere la sorgente per
l'analytics.

Aggiungi l'import in `src/pages/Shop.tsx`:

```tsx
import Newsletter from '../components/Newsletter';
```

e, sotto il blocco che contiene l'`h1` «Gli strumenti di viaggio / stanno prendendo forma»,
dentro la stessa `<Section>`:

```tsx
<div className="mt-12">
  <Newsletter source="shop_waitlist" />
</div>
```

Non riscrivere l'`h1` né il paragrafo, e non passare `title`/`description` a mano: la copy
resta quella di default fino al Task 11, che decide se serve una variante per lo Shop.

- [ ] **Step 3: Verifica nel browser**

Avvia il server con lo strumento di preview (mai `npm run dev` da bash), apri `/shop` e conferma: un solo `h1`, il modulo di iscrizione visibile e funzionante, nessun errore in console.

- [ ] **Step 4: Typecheck e commit**

```bash
npm run typecheck
git add src/pages/Shop.tsx
git commit -m "feat(shop): l'attesa diventa una lista d'attesa invece di un vicolo cieco"
```

---

### Task 8: Dichiarare l'anteprima dove c'è

**Files:**

- Modify: `src/pages/Esplora.tsx:326-329` (condizione `usingPreview`)
- Modify: `src/pages/Itinerari.tsx` (banner)
- Test: `src/pages/Esplora.preview.test.ts`

**Interfaces:**

- Consumes: `CONTENT_ITEMS` da `src/config/contentLibrary`.
- Produces: niente di nuovo.

- [ ] **Step 1: Scrivi il test che fallisce**

Crea `src/pages/Esplora.preview.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { CONTENT_ITEMS } from '../config/contentLibrary';

/**
 * Oggi tutti i 40 item del seed sono isPlaceholder, ma Esplora controlla
 * se i contenuti ESISTONO, non se sono VERI: la pagina risulta indicizzabile
 * e non dichiara niente. Questo test blocca il ritorno di quel difetto.
 */
describe('Esplora: anteprima dichiarata', () => {
  it('considera anteprima anche quando gli item esistono ma sono placeholder', () => {
    const soloPlaceholder =
      CONTENT_ITEMS.length > 0 && CONTENT_ITEMS.every((item) => item.isPlaceholder);
    expect(soloPlaceholder).toBe(true);
  });
});
```

- [ ] **Step 2: Esegui il test**

```bash
npx vitest run src/pages/Esplora.preview.test.ts
```

Atteso: PASS — documenta lo stato attuale del seed. Se fallisce, significa che i contenuti reali sono arrivati: allora rivedi con l'owner se `/esplora` debba ancora dichiarare l'anteprima.

- [ ] **Step 3: Correggi la condizione di Esplora**

In `src/pages/Esplora.tsx`, sostituisci la condizione alle righe 326-329 con:

```tsx
// Anteprima quando non ci sono contenuti REALI da mostrare, non quando non
// ce ne sono affatto: 40 item tutti isPlaceholder sono comunque un'anteprima.
const realContentItems = CONTENT_ITEMS.filter((item) => !item.isPlaceholder);
const usingPreview =
  realContentItems.length === 0 &&
  archiveItems.length > 0 &&
  archiveItems.some((item) => DEMO_ARCHIVE_SLUGS.includes(item.id));
```

- [ ] **Step 4: Porta lo stesso banner su Itinerari e Guide**

La spec chiede il banner dichiarato su **entrambe** le superfici `preview`, non solo Itinerari.

In `src/pages/Itinerari.tsx`, sopra la griglia degli itinerari, inserisci lo stesso banner «anteprima editoriale» già usato in `Esplora.tsx:550`. Copia struttura e classi da lì: non inventare un componente nuovo e non cambiare il testo.

In `src/pages/Guida.tsx`, sopra il corpo della guida, inserisci lo stesso banner ma **solo quando** `guide.isDemo` è vero — lì il flag è per-contenuto, e una guida vera non deve mostrarlo:

```tsx
{guide.isDemo && (
  /* stessa struttura e stesse classi del banner in Esplora.tsx:550 */
)}
```

- [ ] **Step 5: Verifica nel browser**

Apri `/esplora`, `/itinerari` e `/guide/weekend-catania`: il banner d'anteprima è visibile su tutte e tre, e i robots meta dicono `noindex, nofollow`.

- [ ] **Step 6: Typecheck e commit**

```bash
npm run typecheck
git add src/pages/Esplora.tsx src/pages/Itinerari.tsx src/pages/Guida.tsx src/pages/Esplora.preview.test.ts
git commit -m "fix(anteprima): dichiarala guardando se i contenuti sono veri, non se esistono"
```

---

### Task 9: Testata editoriale su `/mappa`

**Files:**

- Modify: `src/components/map/FullScreenMapExperience.tsx:214` (contenitore)
- Modify: `src/pages/Mappa.tsx`
- Test: verifica nel browser, più `e2e/visual-quality.spec.ts` se già copre `/mappa`

**Interfaces:**

- Consumes: `CONTENT_ITEMS.length` per il conteggio.
- Produces: niente di nuovo.

- [ ] **Step 1: Conferma che oggi l'`h1` manca**

Apri `/mappa` nel browser ed esegui:

```js
document.querySelectorAll('h1').length;
```

Atteso: `0`. È il difetto da chiudere.

- [ ] **Step 2: Trasforma il contenitore in colonna**

In `src/components/map/FullScreenMapExperience.tsx`, il contenitore radice passa da

```tsx
<div className="relative mt-20 h-[calc(100dvh-80px)] w-full overflow-hidden bg-[#0a0705]">
```

a una colonna flex, con la testata `shrink-0` e la mappa `flex-1 min-h-0`:

```tsx
<div className="mt-20 flex h-[calc(100dvh-80px)] w-full flex-col overflow-hidden bg-[#0a0705]">
  <header className="shrink-0 px-4 pb-3 pt-5 sm:px-8 sm:pb-4 sm:pt-6">
    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent,#c85a32)]">
      Mappa delle tracce
    </span>
    <h1 className="mt-1.5 font-serif text-2xl font-medium leading-tight text-white sm:text-3xl">
      Dove siamo stati davvero
    </h1>
    <p className="mt-1.5 hidden text-sm text-white/60 sm:block">
      Ogni segno e un posto che abbiamo provato di persona. {allItems.length} in tutto.
    </p>
  </header>

  <div className="relative min-h-0 flex-1">
    {/* qui dentro finiscono la colonna dei controlli, la Map e la scheda */}
  </div>
</div>
```

Sposta dentro `<div className="relative min-h-0 flex-1">` tutto ciò che oggi è figlio del contenitore radice: la colonna flottante, il `<Map>` e la scheda del posto. Le loro classi di posizionamento non cambiano — restano relative al nuovo contenitore.

La copy dell'`h1` e del deck è provvisoria: il Task 11 la conferma o la sostituisce.

- [ ] **Step 3: Allinea il fallback di caricamento**

In `src/pages/Mappa.tsx`, `MapLoaderFallback` usa `mt-20 h-[calc(100dvh-80px)]`: lascialo invariato, l'altezza totale della pagina non cambia.

- [ ] **Step 4: Verifica nel browser sulle 7 combinazioni**

Apri `/mappa` e, per ciascun viewport 375×667, 375×812, 640×720, 768×1024, 1024×640, 1280×720, 1440×900, con elenco, pannello filtri e scheda tutti aperti, verifica: esattamente un `h1`, nessuna collisione fra testata, barra controlli, pannello, elenco e scheda, controlli zoom e attribuzione OSM raggiungibili, nessun overflow orizzontale.

- [ ] **Step 5: Typecheck e commit**

```bash
npm run typecheck
git add src/components/map/FullScreenMapExperience.tsx src/pages/Mappa.tsx
git commit -m "feat(mappa): rimetti la testata editoriale sopra la mappa a tutto schermo"
```

---

### Task 10: Chiudere il debito

**Files:**

- Delete: `src/pages/Home.tsx`, `src/pages/HomeLegacy.tsx`, `src/pages/AtlanteLab.tsx`, `src/pages/V2/HomeV2.tsx`, `src/pages/Mappa.css`
- Modify: `docs/10_Projects/PROJECT_RELEASE_READINESS.md`

**Interfaces:**

- Consumes: niente.
- Produces: niente.

- [ ] **Step 1: Verifica che siano davvero morti**

```bash
for f in Home HomeLegacy AtlanteLab V2/HomeV2; do echo -n "$f: "; grep -rl "pages/$f'" src/ | wc -l; done
grep -rn "Mappa.css" src/
```

Atteso: `0` per tutti e cinque. Se un file risulta importato, **non cancellarlo** e segnala.

Attenzione: `src/components/map/MapboxWorldMap.tsx` **non** va cancellata — è ancora usata da `src/components/home/InteractiveMapSection.tsx`.

- [ ] **Step 2: Cancella, un commit per file**

```bash
git rm src/pages/Mappa.css && npm run typecheck && npm run build && git commit -m "chore(mappa): via 914 righe di CSS che non importava piu nessuno"
git rm src/pages/Home.tsx src/pages/HomeLegacy.tsx src/pages/AtlanteLab.tsx src/pages/V2/HomeV2.tsx && npm run typecheck && npm run build && git commit -m "chore(home): via le quattro home morte, i redirect restano"
```

Se `build` fallisce dopo una cancellazione, ripristina con `git checkout -- <file>` e segnala.

- [ ] **Step 3: Riallinea la documentazione**

In `docs/10_Projects/PROJECT_RELEASE_READINESS.md`, nella sezione «Mappa delle tracce — gate locale 2026-07-21», aggiungi in coda:

```markdown
**Aggiornamento 2026-07-22.** Questo gate certificava la mappa editoriale
(`MapboxWorldMap` + `Mappa.css`), sostituita dall'esperienza full-screen
`FullScreenMapExperience`. L'H1 era andato perso nella sostituzione ed e stato
reintrodotto come testata editoriale. Il gate va rieseguito sulla nuova slice:
i risultati qui sopra si riferiscono a una versione non piu in albero.
```

- [ ] **Step 4: Commit della documentazione**

```bash
git add docs/10_Projects/PROJECT_RELEASE_READINESS.md
git commit -m "docs(release): il gate mappa si riferiva a una versione non piu in albero"
```

---

### Task 11: Copy definitiva

**Files:**

- Create: `docs/50_Scratch/HANDOFF_promessa-sostanza_main_to_seo-strategist.md`
- Modify (dopo il ritorno del brief): `src/pages/Risorse.tsx`, `src/pages/Shop.tsx`, `src/components/map/FullScreenMapExperience.tsx`

**Interfaces:**

- Consumes: i testi provvisori lasciati dai task 5, 7 e 9.
- Produces: copy definitiva.

- [ ] **Step 1: Scrivi il brief di handoff**

Usa il template `docs/90_Templates/TPL_Agent_Handoff.md`. Il brief deve chiedere esattamente quattro cose, e nient'altro:

1. `<title>` e `h1` di `/risorse` — **senza la parola «Strumenti»**, che appartiene a `/strumenti`. Il nome della sezione è «Cosa usiamo», già deciso dall'owner.
2. Microcopy della lista d'attesa Shop: una riga sopra il modulo che dica cosa arriverà e cosa riceve chi si iscrive.
3. Testo del banner d'anteprima per `/itinerari`, coerente con quello già in uso su `/esplora`.
4. Conferma o sostituzione di `h1` e deck della testata `/mappa`: provvisori «Dove siamo stati davvero» e «Ogni segno e un posto che abbiamo provato di persona».

Vincoli da riportare nel brief: italiano, voce Rodrigo & Betta, nessun superlativo vuoto, nessun numero inventato — 40 posti è il solo dato verificato.

- [ ] **Step 2: Invoca l'agente**

Invoca `travellini-seo-conversion-strategist` passandogli il brief.

- [ ] **Step 3: Applica la copy restituita**

Sostituisci i testi provvisori. Non applicare copy che introduca numeri, prezzi o promesse non verificate: in quel caso rimanda indietro.

- [ ] **Step 4: Typecheck e commit**

```bash
npm run typecheck
git add src/pages/Risorse.tsx src/pages/Shop.tsx src/components/map/FullScreenMapExperience.tsx docs/50_Scratch/HANDOFF_promessa-sostanza_main_to_seo-strategist.md
git commit -m "feat(copy): copy definitiva per Cosa usiamo, attesa Shop e testata mappa"
```

---

### Task 12: Verifica finale contro i criteri della spec

**Files:** nessuna modifica prevista. Se una verifica fallisce, apri un fix mirato e ripeti.

- [ ] **Step 1: Gate statici**

```bash
npm run typecheck && npm run lint && npm run test && npm run build
```

Atteso: tutti verdi.

- [ ] **Step 2: `liteMode` non esiste più**

```bash
grep -rniE "lite_?mode|isDisabled|public-route-manifest" src/ scripts/
```

Atteso: nessun risultato.

- [ ] **Step 3: Un `h1` per pagina**

Nel browser, percorri le 20 rotte pubbliche — `/`, `/esplora`, `/destinazione`, `/destinazione/italia`, `/mappa`, `/chi-siamo`, `/collaborazioni`, `/media-kit`, `/press`, `/contatti`, `/itinerari`, `/strumenti`, `/risorse`, `/shop`, `/club`, `/preferiti`, `/privacy`, `/cookie`, `/termini`, `/disclaimer` — e conferma per ognuna `document.querySelectorAll('h1').length === 1`.

- [ ] **Step 4: Sitemap corretta**

```bash
npx tsx scripts/generate-sitemap.js
grep -c "<loc>" public/sitemap.xml
grep -E "destinazione|shop|itinerari|preferiti" public/sitemap.xml
```

Atteso: `/destinazione` presente; `/shop`, `/itinerari`, `/preferiti` assenti.

- [ ] **Step 5: Robots corretti nel browser**

Su `/shop`, `/itinerari` e `/preferiti`: `noindex, nofollow`. Su `/mappa`, `/destinazione` e `/chi-siamo`: `index, follow`.

- [ ] **Step 6: Nessun link interno rotto**

Ripeti il crawl delle 20 rotte raccogliendo ogni `a[href^="/"]` e risolvendolo contro i pattern di `SURFACES`. Atteso: 0 rotti su ~561.

- [ ] **Step 7: Nessun overflow orizzontale**

A 375, 768 e 1280, su tutte e 20 le rotte: `document.documentElement.scrollWidth <= window.innerWidth`.

- [ ] **Step 8: Audit di progetto**

```bash
npm run audit:ui && npm run e2e
```

Atteso: nessuna regressione rispetto ai warning pre-esistenti (PostoStamp, Button.stories).

- [ ] **Step 9: Commit finale**

```bash
git add public/sitemap.xml
git commit -m "chore(sitemap): rigenera dopo la verifica finale"
```
