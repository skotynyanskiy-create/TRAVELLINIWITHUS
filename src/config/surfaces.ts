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
  { path: '/guida-in-regalo', state: 'live', private: true },
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
