import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Link } from '../../TransitionLink';
import { getContentById } from '../../../config/contentLibrary';
import { canLoad, getConsent, onConsentChange, setConsent } from '../../../lib/consent';
import { useInViewOnce } from '../../../hooks/useInViewOnce';
import type { ContentItem } from '../../../types/content';
import type { DirectiveConfig, DirectiveNode } from './types';

const ArticleMiniMap = lazy(() => import('../editorial/ArticleMiniMap'));

function parsePostiIds(value?: string): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
}

function toProps(directive: DirectiveNode): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  const attrs = directive.attributes || {};
  if (attrs.posti) props['data-posti'] = attrs.posti;
  if (attrs.zoom) props['data-zoom'] = attrs.zoom;
  directive.children = []; /* :::mappa non ha corpo markdown: solo attributi. */
  return props;
}

function PlacesList({ items, dark }: { items: ContentItem[]; dark?: boolean }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.id}>
          <Link
            to={`/posto/${item.id}`}
            className={`group inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[15px] ${
              dark ? 'text-white' : 'text-[var(--color-ink)]'
            }`}
          >
            <MapPin
              size={13}
              className={`shrink-0 ${
                dark ? 'text-[var(--color-accent-on-dark,#e8834e)]' : 'text-[var(--color-accent)]'
              }`}
              aria-hidden="true"
            />
            <span className="font-medium underline-offset-2 group-hover:underline">
              {item.title}
            </span>
            <span className={dark ? 'text-white/60' : 'text-[var(--color-muted-fg)]'}>
              {[item.place.city, item.place.region || item.place.country]
                .filter(Boolean)
                .join(', ')}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function MappaDirective({
  'data-posti': postiAttr,
  'data-zoom': zoomAttr,
}: {
  'data-posti'?: string;
  'data-zoom'?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const inView = useInViewOnce(hostRef, '280px 0px');
  const [consentGranted, setConsentGranted] = useState(() => canLoad('marketing'));

  useEffect(() => onConsentChange((consent) => setConsentGranted(consent.marketing)), []);

  const activateMap = () => {
    const current = getConsent();
    setConsent({
      analytics: current.analytics,
      marketing: true,
      personalization: current.personalization,
    });
  };

  const ids = useMemo(() => parsePostiIds(postiAttr), [postiAttr]);

  const items = useMemo(() => {
    const found: ContentItem[] = [];
    for (const id of ids) {
      const item = getContentById(id);
      if (item) {
        found.push(item);
      } else if (import.meta.env?.DEV) {
        console.warn(`[mappa] Posto "${id}" non trovato nel registro: rimosso dal blocco.`);
      }
    }
    return found;
  }, [ids]);

  const geocodedItems = useMemo(
    () => items.filter((item) => Boolean(item.place.coordinates)),
    [items]
  );

  if (import.meta.env?.DEV && items.length > 0 && geocodedItems.length !== items.length) {
    console.warn(
      "[mappa] Alcuni posti citati non hanno coordinate: compaiono solo nell'elenco, non sulla mappa."
    );
  }

  if (items.length === 0) {
    if (import.meta.env?.DEV) {
      console.warn(
        '[mappa] Nessun posto valido nell\'attributo "posti": il blocco non renderizza.'
      );
    }
    return null;
  }

  const zoom = zoomAttr ? Number(zoomAttr) : 8;

  if (!consentGranted) {
    return (
      <aside aria-label="Mappa dei posti citati nell'articolo" className="my-12 md:my-16">
        <div className="rounded-[var(--radius-md)] bg-[var(--color-ink-deep)] p-6 md:p-8">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-on-dark,#e8834e)]">
            Posti citati in questo articolo
          </p>
          <PlacesList items={items} dark />
          <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-white/70">
            L&apos;anteprima della mappa è ferma: carica le tessere da un servizio esterno e parte
            solo con il consenso ai cookie di marketing.{' '}
            <button
              type="button"
              onClick={activateMap}
              className="py-1 font-semibold text-[var(--color-accent-on-dark,#e8834e)] underline underline-offset-2 hover:text-white cursor-pointer"
            >
              Attivala
            </button>
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Mappa dei posti citati nell'articolo"
      className="my-12 md:my-16 w-screen max-w-[1600px] mx-[calc(50%-50vw)] xl:max-w-full xl:mx-0 xl:w-full"
    >
      <div
        ref={hostRef}
        className="h-[220px] w-full overflow-hidden bg-[var(--color-ink-deep)] md:h-[320px] xl:rounded-[var(--radius-md)]"
      >
        {inView && geocodedItems.length > 0 ? (
          <Suspense
            fallback={
              <div className="h-full w-full bg-[var(--color-ink-deep)]" aria-hidden="true" />
            }
          >
            <ArticleMiniMap items={geocodedItems} zoom={zoom} />
          </Suspense>
        ) : (
          <div className="h-full w-full" aria-hidden="true" />
        )}
      </div>
      <div className="mx-auto max-w-3xl px-5 md:px-8 mt-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
          Posti citati in questo articolo
        </p>
        <PlacesList items={items} />
      </div>
    </aside>
  );
}

export const mappaDirective: DirectiveConfig = {
  name: 'mappa',
  hName: 'mappa-directive',
  toProps,
  component: MappaDirective,
};
