import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, MapPin, Tag, X } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import OptimizedImage from './OptimizedImage';
import { useQuickView } from '../context/QuickViewContext';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useOverlayLayer } from '../hooks/useOverlayLayer';
import type { PartnershipKind } from '../types/content';

/**
 * Anteprima rapida di un ContentItem ("posto particolare"): drawer laterale
 * globale montato una sola volta in Layout. Permette di triage-are un posto
 * senza lasciare la pagina (archivio, destinazione, home). Guidato da
 * useQuickView() — nessuna prop.
 */

const PARTNERSHIP_LABEL: Record<PartnershipKind, string> = {
  organic: '',
  adv: 'ADV',
  invited: 'Su invito',
  gifted: 'Gifted',
  collaboration: 'In collaborazione',
  affiliate: 'Affiliato',
};

export default function QuickViewDrawer() {
  const { item, close } = useQuickView();
  const reduceMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const isTopLayer = useOverlayLayer(Boolean(item));

  useFocusTrap(Boolean(item), drawerRef, closeButtonRef, isTopLayer);

  useEffect(() => {
    if (!item || !isTopLayer) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [item, close, isTopLayer]);

  const partnerLabel = item ? PARTNERSHIP_LABEL[item.partnership.kind] : '';
  const locality = item
    ? [item.place.city ?? item.place.region, item.place.country].filter(Boolean).join(', ')
    : '';

  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={close}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Anteprima rapida: ${item.title}`}
            initial={reduceMotion ? { opacity: 0 } : { x: '100%' }}
            animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: '100%' }}
            transition={
              reduceMotion ? { duration: 0 } : { type: 'spring', damping: 30, stiffness: 300 }
            }
            className="fixed inset-y-0 right-0 z-[210] flex w-full max-w-md flex-col bg-[var(--color-surface)] shadow-[var(--shadow-premium)]"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              aria-label="Chiudi anteprima"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[var(--color-ink)] backdrop-blur-md transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
            >
              <X size={18} />
            </button>

            <div className="flex-1 overflow-y-auto">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-ink-deep)]">
                <OptimizedImage
                  src={item.cover}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[var(--color-ink)] backdrop-blur-md">
                  {item.types[0]}
                </span>
                {partnerLabel && (
                  <span className="absolute left-4 top-12 rounded-full bg-[var(--color-ink)]/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                    {partnerLabel}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-4 p-6">
                <div>
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-text)]">
                    <MapPin size={12} /> {item.place.name}
                  </p>
                  {locality && (
                    <p className="mt-1 text-xs text-[var(--color-muted-fg)]">{locality}</p>
                  )}
                </div>

                <h2 className="font-serif text-2xl leading-tight text-[var(--color-ink)]">
                  {item.hook}
                </h2>

                {item.description && (
                  <p className="line-clamp-4 text-sm leading-relaxed text-[var(--color-muted-fg)]">
                    {item.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 border-t border-black/5 pt-4">
                  {item.value?.price && (
                    <span className="text-sm font-bold text-[var(--color-ink)]">
                      {item.value.price}
                    </span>
                  )}
                  {item.deal && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)]">
                      <Tag size={11} /> Offerta
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-black/5 bg-[var(--color-surface)] p-6">
              <Link
                to={`/posto/${item.id}`}
                onClick={close}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                Apri la scheda <ArrowUpRight size={14} />
              </Link>
              <a
                href={item.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                Guarda il reel <ArrowUpRight size={14} />
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
