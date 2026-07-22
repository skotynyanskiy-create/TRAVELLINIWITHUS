import { useId, useState, type CSSProperties } from 'react';
import { Play, Stamp } from 'lucide-react';
import OptimizedImage from '../OptimizedImage';
import SchedaVerifica from './SchedaVerifica';
import { PARTNERSHIP_LABEL } from '../../types/content';
import type { ContentItem } from '../../types/content';
import type { ContentType } from '../../config/contentTaxonomy';

/** Gradiente saturo per tipo canonical — stesso set di ContentCard, usato come
 *  fronte quando il posto non ha ancora una cover reale certificata. */
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

/**
 * La carta a due facce del posto: fronte "Sembra inventato" (la copertina),
 * retro "Esiste davvero" (la scheda di verifica). Il timbro gira la carta.
 *
 * Entrambe le facce restano nel DOM (SEO / no-JS: contenuto sempre presente);
 * la scatola ha aspect-ratio fisso e le facce sono in absolute → il flip non
 * sposta mai il layout (zero CLS). La faccia inattiva è `inert` così i suoi
 * link non entrano nel tab order. Le transition si azzerano da sole con
 * prefers-reduced-motion (regola globale in index.css).
 */
export default function PostoStamp({ item }: { item: ContentItem }) {
  const [flipped, setFlipped] = useState(false);
  const schedaId = useId();
  const partnerLabel = PARTNERSHIP_LABEL[item.partnership.kind];
  const gradient = TYPE_GRADIENT[item.types[0]] ?? TYPE_GRADIENT._default;
  const placeLabel = [item.place.city, item.place.region, item.place.country]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="atlante-stamp-card" data-flipped={flipped ? 'true' : 'false'}>
      {/* Fronte — Sembra inventato */}
      <div
        className="atlante-stamp-card__face atlante-stamp-card__face--fronte"
        inert={flipped || undefined}
      >
        {item.cover ? (
          <div
            className="atlante-stamp-card__media"
            style={{ '--atlante-focus-y': `${item.coverFocusY ?? 50}%` } as CSSProperties}
          >
            <OptimizedImage
              src={item.cover}
              alt={item.coverAlt ?? item.title}
              priority
              responsiveWidths={[320, 480, 768]}
              baseWidth={1600}
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        ) : (
          <div
            className="flex h-full w-full flex-col justify-end p-8 pb-24"
            style={{ background: gradient }}
          >
            <p className="font-serif text-2xl leading-snug text-white drop-shadow-sm md:text-3xl">
              {item.hook}
            </p>
            <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">
              {placeLabel}
            </p>
          </div>
        )}

        {/* Overlay play decorativo (hover) → reel. aria-hidden + non focusabile:
            il link accessibile è il CTA visibile "Guarda il reel" in pagina. */}
        <a
          href={item.permalink}
          target="_blank"
          rel="noreferrer"
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-white/40 transition-transform hover:scale-110">
            <Play size={28} className="translate-x-0.5 text-white" fill="white" />
          </span>
        </a>
      </div>

      {/* Retro — Esiste davvero */}
      <div
        id={schedaId}
        className="atlante-stamp-card__face atlante-stamp-card__face--retro"
        inert={!flipped || undefined}
      >
        <p className="atlante-kicker">Esiste davvero</p>
        <div className="mt-3">
          <SchedaVerifica item={item} />
        </div>
      </div>

      {/* Badge sempre visibili sopra entrambe le facce (tipo + disclosure) */}
      <span className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[var(--color-ink)] backdrop-blur-md">
        {item.types[0]}
      </span>
      {partnerLabel && (
        <span className="absolute right-4 top-4 z-10 rounded-full bg-[var(--color-ink)]/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
          {partnerLabel}
        </span>
      )}

      {/* Il timbro — gira la carta */}
      <div className="atlante-stamp-card__cta">
        <button
          type="button"
          className="atlante-stamp-btn"
          aria-expanded={flipped}
          aria-controls={schedaId}
          onClick={() => setFlipped((v) => !v)}
        >
          <Stamp size={14} aria-hidden="true" />
          {flipped ? 'Torna alla copertina' : 'Esiste davvero?'}
        </button>
      </div>
    </div>
  );
}
