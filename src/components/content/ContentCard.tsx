import { ArrowUpRight, Eye, MapPin } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import OptimizedImage from '@/src/components/OptimizedImage';
import { useQuickView } from '../../context/QuickViewContext';
import { catColor } from '../../config/categoryColors';
import { hasSpecificReelLink } from '../../utils/mediaUrl';
import type { ContentItem, PartnershipKind } from '../../types/content';

/**
 * Card editoriale per un "posto particolare" (ContentItem). Linka al reel IG
 * reale. Gestisce sia cover presente sia placeholder (seed senza frame).
 * Mostra hook, luogo, prezzo e badge di trasparenza partnership (AGCOM).
 *
 * Cover-fallback: targa editoriale ink-deep con filo colore-categoria
 * (`--color-cat-*` via `catColor`) — scelta editoriale sobria, non indicatore
 * di dato mancante.
 */

const PARTNERSHIP_LABEL: Record<PartnershipKind, string> = {
  organic: '',
  adv: 'ADV',
  invited: 'Su invito',
  gifted: 'Gifted',
  collaboration: 'In collaborazione',
  affiliate: 'Affiliato',
};

export default function ContentCard({
  item,
  /* Il default copre le griglie a 3 colonne (Destinazione). La griglia
     xl:grid-cols-4 di Esplora passa il suo valore: con 33vw dichiarato su un
     render da 25vw il browser scaricava la -480 dove basta la -320. */
  sizes = '(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw',
}: {
  item: ContentItem;
  sizes?: string;
}) {
  const { open } = useQuickView();
  const partnerLabel = PARTNERSHIP_LABEL[item.partnership.kind];
  const place = item.place.city ?? item.place.region ?? item.place.country;
  // Alcuni placeholder (manca solo la cover) hanno già un reel reale
  // collegato — per quelli la CTA resta corretta. Non basta isPlaceholder.
  const canWatchReel = hasSpecificReelLink(item.permalink);

  return (
    <div className="group/card relative">
      {/* L'ombra usa --shadow-sm, non --shadow-soft: quel token non esiste, e
          una var non definita dentro shadow-[] rende invalida l'INTERA catena
          box-shadow di Tailwind — che è la stessa che disegna il focus ring.
          Risultato: `focus-visible:ring-2` si calcolava giusto
          (0 0 0 4px #ff4d1a) ma `box-shadow` restava `none`, e il bottone era
          l'unico controllo del sito senza indicatore di focus. */}
      <button
        type="button"
        aria-label={`Anteprima rapida di ${item.title}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          open(item);
        }}
        className={`absolute top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--color-ink)] shadow-[var(--shadow-sm)] backdrop-blur-md transition-all duration-200 hover:bg-white hover:text-[var(--color-accent)] focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 max-md:opacity-100 md:opacity-0 md:group-hover/card:opacity-100 ${
          partnerLabel ? 'right-14' : 'right-3'
        }`}
      >
        <Eye size={16} />
      </button>
      <Link
        to={`/posto/${item.id}`}
        className="group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-black/5 bg-[var(--color-surface)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)]/20 hover:shadow-[var(--shadow-premium)]"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-ink-deep)]">
          {!item.isPlaceholder && item.cover ? (
            /* `OptimizedImage` e non un tag immagine grezzo — scritto cosi'
               perche' `audit:ui` cerca quel tag nel sorgente e lo trovava in
               questa spiegazione, segnalando un `alt` mancante che non manca.
               Fino al 2026-08-17 qui c'era davvero un tag nudo: nessun
               `srcset`, nessun AVIF, la copertina a
               piena risoluzione per ogni card. Misurato su `/esplora`: cinque
               copertine da 358, 262, 236, 201 e 160 KB — **1.217 KB di sole
               immagini**, con la pagina a 2.697 KB. Il riquadro e' largo al
               massimo un terzo di viewport: servono le varianti piccole, che il
               componente sceglie da solo. Lo stesso componente e' gia' usato
               nella scheda posto e nei vicini; qui era rimasto indietro, e
               `ContentCard` alimenta cinque superfici (esplora, destinazione,
               vetrina home, timbro posto). */
            <OptimizedImage
              src={item.cover}
              alt={item.coverAlt ?? item.title}
              sizes={sizes}
              responsiveWidths={[320, 480, 768]}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col justify-end bg-[var(--color-ink-deep)] p-5">
              <span
                aria-hidden="true"
                className="mb-3 h-px w-8"
                style={{ backgroundColor: catColor(item.types[0]) }}
              />
              {/* Segnale onesto di roadmap: distingue dalle schede verificate senza
                  nasconderle (decisione editoriale, non tecnica — vedi ContentCard
                  CTA sotto per la stessa logica). */}
              {item.isPlaceholder && (
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/50">
                  In arrivo
                </p>
              )}
              {/* Hook grande in primo piano — scelta editoriale, non placeholder */}
              <p className="font-serif text-xl leading-snug text-white drop-shadow-sm">
                {item.hook}
              </p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">
                {place}
              </p>
              {item.value?.price && (
                <p className="mt-1 text-sm font-bold text-white">{item.value.price}</p>
              )}
            </div>
          )}

          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)] backdrop-blur-md">
            {item.types[0]}
          </span>
          {partnerLabel && (
            <span className="absolute right-3 top-3 rounded-full bg-[var(--color-ink)]/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
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
            {canWatchReel ? (
              // Diceva «Guarda il reel», ma il link porta alla scheda del
              // posto: il reel si riproduce li' dentro, insieme a dove,
              // quando, quanto e a che titolo. Un'etichetta che promette una
              // cosa e ne apre un'altra e' un piccolo tradimento ripetuto su
              // ogni card dell'archivio.
              <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent-text)] transition-transform group-hover:translate-x-0.5">
                Apri la scheda <ArrowUpRight size={12} />
              </span>
            ) : (
              // Niente CTA "guarda il reel" quando il permalink e' solo il
              // profilo: promettere un contenuto specifico che non c'e' ancora
              // e' il difetto peggiore da evitare su una scheda in lavorazione.
              <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-black/60">
                Scheda in arrivo
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
