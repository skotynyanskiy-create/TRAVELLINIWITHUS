import { Link } from '../../TransitionLink';
import OptimizedImage from '../../OptimizedImage';
import { getContentById } from '../../../config/contentLibrary';
import { PARTNERSHIP_LABEL } from '../../../types/content';
import type { DirectiveConfig, DirectiveNode } from './types';

/**
 * `:::posto{id="praga-dog-cafe"}` — incorpora un posto del registro
 * (`content-seed.json`) dentro il corpo di un articolo.
 *
 * `toProps` legge solo l'attributo `id`: il lookup del `ContentItem` vive nel
 * componente (via `getContentById`, mai lettura diretta del JSON), cosi'
 * `toProps` resta puramente sintattico come negli altri file del registro
 * (fullbleed/source/verified).
 */
function toProps(directive: DirectiveNode): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  const attrs = directive.attributes || {};
  if (attrs.id) props['data-id'] = attrs.id;
  directive.children = []; /* :::posto non ha corpo markdown: i dati arrivano dal registro */
  return props;
}

function PostoDirective({ 'data-id': id }: { 'data-id'?: string }) {
  if (!id) {
    if (import.meta.env?.DEV) {
      console.warn('[:::posto] manca l\'attributo id, es. :::posto{id="praga-dog-cafe"}.');
    }
    return null;
  }

  const item = getContentById(id);
  if (!item) {
    if (import.meta.env?.DEV) {
      console.warn(`[:::posto] nessun posto trovato per id="${id}" in content-seed.json.`);
    }
    return null;
  }

  // Scheda ancora in lavorazione: niente da mostrare, non un ripiego.
  if (item.isPlaceholder) {
    if (import.meta.env?.DEV) {
      console.warn(
        `[:::posto] "${id}" e' ancora un placeholder (isPlaceholder: true): il blocco non si mostra finche' la scheda non e' pronta.`
      );
    }
    return null;
  }

  const luogo = item.place.city ?? item.place.region ?? item.place.country;
  const partnerLabel = PARTNERSHIP_LABEL[item.partnership.kind];

  return (
    <aside
      aria-label={`Posto dal registro: ${item.title}`}
      className="my-10 md:my-12 -mx-5 md:mx-0"
    >
      <div className="overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-surface)] md:grid md:grid-cols-[40%_60%] md:rounded-[var(--radius-lg)] md:border">
        <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-auto md:h-full">
          <OptimizedImage
            src={item.cover}
            alt={item.coverAlt || item.title}
            sizes="(min-width: 768px) 40vw, 100vw"
            responsiveWidths={[320, 480]}
            style={{ objectPosition: `50% ${item.coverFocusY ?? 50}%` }}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-5 md:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
            Dal registro
          </p>
          <h3 className="mt-2 font-serif text-xl leading-tight text-[var(--color-ink)] md:text-2xl">
            {item.title}
          </h3>
          {luogo && <p className="mt-1 text-sm text-[var(--color-muted-fg)]">{luogo}</p>}
          {/* Se manca il prezzo non si scrive nulla: mai un "n.d." che sembri una verifica. */}
          {item.value?.price && (
            <p className="mt-3 text-sm font-medium tabular-nums text-[var(--color-ink)]">
              {item.value.price}
            </p>
          )}
          {partnerLabel && (
            <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-fg)]">
              {partnerLabel}
              {item.partnership.partner ? ` · ${item.partnership.partner}` : ''}
            </p>
          )}
          <Link
            to={`/posto/${item.id}`}
            className="mt-4 inline-flex items-center text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--color-accent-text)] transition-colors hover:text-[var(--color-accent)]"
          >
            Scheda del posto →
          </Link>
        </div>
      </div>
    </aside>
  );
}

export const postoDirective: DirectiveConfig = {
  name: 'posto',
  hName: 'posto-directive',
  toProps,
  component: PostoDirective,
};
