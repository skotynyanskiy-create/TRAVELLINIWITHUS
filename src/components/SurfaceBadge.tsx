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
    <>
      {' '}
      <span className="ml-1.5 rounded-full border border-current/30 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] opacity-70">
        {testo}
      </span>
    </>
  );
}
