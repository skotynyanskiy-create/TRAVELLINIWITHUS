import { Link } from '@/src/components/TransitionLink';
import { PARTNERSHIP_LABEL } from '../../types/content';
import type { ContentItem } from '../../types/content';

/**
 * Riga del registro: voce numerata dell'indice dei posti provati.
 * Tipografica per scelta — la prova visiva vive nella pagina posto, e solo
 * quando la cover è reale certificata (imagery truth rule 2026-07-22).
 */
export default function AtlanteCard({ item, index }: { item: ContentItem; index: number }) {
  const num = String(index + 1).padStart(2, '0');
  const partnerLabel = PARTNERSHIP_LABEL[item.partnership.kind];
  const complete = !item.isPlaceholder;
  const meta = [
    [item.place.name, item.place.region ?? item.place.country].filter(Boolean).join(', '),
    item.types[0],
    item.value?.price,
    partnerLabel || null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <li>
      <Link to={`/posto/${item.id}`} className="atlante-ledger__row">
        <span className="atlante-ledger__num" aria-hidden="true">
          {num}
        </span>
        <span className="min-w-0">
          <span className="atlante-ledger__title block">{item.hook}</span>
          <span className="atlante-ledger__meta block">{meta}</span>
        </span>
        <span
          className={
            complete ? 'atlante-ledger__state atlante-ledger__state--done' : 'atlante-ledger__state'
          }
        >
          {complete ? 'Scheda completa' : 'Scheda in lavorazione'}
        </span>
      </Link>
    </li>
  );
}
