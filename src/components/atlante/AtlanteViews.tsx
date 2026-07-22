import { LayoutGrid, Map } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import { LITE_MODE } from '../../config/liteMode';

/**
 * Switch tra le due viste dell'atlante: la mappa (/mappa) e l'archivio a
 * griglia (/esplora). In LITE_MODE /esplora non esiste: niente switch.
 */
export default function AtlanteViews({ current }: { current: 'mappa' | 'archivio' }) {
  if (LITE_MODE) return null;

  return (
    <nav className="atlante-views" aria-label="Viste dell'atlante">
      <Link to="/mappa" aria-current={current === 'mappa' ? 'page' : undefined}>
        <Map size={14} aria-hidden="true" /> Mappa
      </Link>
      <Link to="/esplora" aria-current={current === 'archivio' ? 'page' : undefined}>
        <LayoutGrid size={14} aria-hidden="true" /> Archivio
      </Link>
    </nav>
  );
}
