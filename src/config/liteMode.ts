export const LITE_MODE = import.meta.env.VITE_LITE_MODE === 'true';

export const LITE_DISABLED_ROUTES: ReadonlyArray<string> = [
  '/esplora',
  '/itinerari',
  '/itinerari/compare',
  '/shop',
  '/club',
  '/preferiti',
  '/destinazioni',
  '/esperienze',
  '/guide',
  '/quiz',
  '/strumenti',
  '/press',
  '/risorse',
  '/futuro',
  '/lead-magnet',
];

const PREFIX_DISABLED = [
  '/esplora',
  '/itinerari',
  '/shop',
  '/club',
  '/preferiti',
  '/destinazioni',
  '/esperienze',
  '/guide',
  '/quiz',
  '/strumenti',
  '/press',
  '/risorse',
  '/futuro',
  '/lead-magnet',
];

export function isDisabled(path: string): boolean {
  if (!LITE_MODE) return false;
  return PREFIX_DISABLED.some(
    (p) => path === p || path.startsWith(`${p}/`) || path.startsWith(`${p}?`)
  );
}
