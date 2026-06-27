import { ArrowUpRight, MapPin } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import type { ContentItem, PartnershipKind } from '../../types/content';
import type { ContentType } from '../../config/contentTaxonomy';

/**
 * Card editoriale per un "posto particolare" (ContentItem). Linka al reel IG
 * reale. Gestisce sia cover presente sia placeholder (seed senza frame).
 * Mostra hook, luogo, prezzo e badge di trasparenza partnership (AGCOM).
 *
 * Cover-fallback: gradiente saturo deterministico per tipo — scelta editoriale
 * energica, non indicatore di dato mancante.
 */

/** Gradiente saturo per tipo canonical — coppia colori vivaci. */
const TYPE_GRADIENT: Record<ContentType | '_default', string> = {
  'Food & Ristoranti': 'linear-gradient(145deg, #b45309 0%, #dc2626 100%)',
  'Hotel con carattere': 'linear-gradient(145deg, #0f4c81 0%, #1e3a5f 100%)',
  Insolito: 'linear-gradient(145deg, #6d28d9 0%, #be185d 100%)',
  'Passeggiate panoramiche': 'linear-gradient(145deg, #065f46 0%, #0f766e 100%)',
  'Relax, terme e spa': 'linear-gradient(145deg, #0e7490 0%, #0c4a6e 100%)',
  'Posti particolari': 'linear-gradient(145deg, #92400e 0%, #b45309 100%)',
  "Borghi e città d'arte": 'linear-gradient(145deg, #7c3aed 0%, #4338ca 100%)',
  'Weekend romantici': 'linear-gradient(145deg, #9d174d 0%, #c2410c 100%)',
  _default: 'linear-gradient(145deg, #1c1917 0%, #292524 100%)',
};

const PARTNERSHIP_LABEL: Record<PartnershipKind, string> = {
  organic: '',
  adv: 'ADV',
  invited: 'Su invito',
  gifted: 'Gifted',
  collaboration: 'In collaborazione',
  affiliate: 'Affiliato',
};

export default function ContentCard({ item }: { item: ContentItem }) {
  const partnerLabel = PARTNERSHIP_LABEL[item.partnership.kind];
  const place = item.place.city ?? item.place.region ?? item.place.country;

  return (
    <Link
      to={`/posto/${item.id}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-black/5 bg-[var(--color-surface)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)]/20 hover:shadow-[var(--shadow-premium)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-ink-deep)]">
        {item.cover ? (
          <img
            src={item.cover}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col justify-end p-5"
            style={{ background: TYPE_GRADIENT[item.types[0]] ?? TYPE_GRADIENT._default }}
          >
            {/* Hook grande in primo piano — scelta editoriale, non placeholder */}
            <p className="font-serif text-xl leading-snug text-white drop-shadow-sm">{item.hook}</p>
            <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">
              {place}
            </p>
            {item.value?.price && (
              <p className="mt-1 text-sm font-bold text-white">{item.value.price}</p>
            )}
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[var(--color-ink)] backdrop-blur-md">
          {item.types[0]}
        </span>
        {partnerLabel && (
          <span className="absolute right-3 top-3 rounded-full bg-[var(--color-ink)]/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
            {partnerLabel}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-text)]">
          <MapPin size={11} /> {place}
        </p>
        <h3 className="mt-2 font-serif text-xl leading-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
          {item.hook}
        </h3>
        {item.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--color-muted-fg)]">
            {item.description}
          </p>
        )}
        <div className="mt-4 flex items-center gap-3 border-t border-black/5 pt-4">
          {item.value?.price && (
            <span className="text-xs font-bold text-[var(--color-ink)]">{item.value.price}</span>
          )}
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent-text)] transition-transform group-hover:translate-x-0.5">
            Guarda il reel <ArrowUpRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}
