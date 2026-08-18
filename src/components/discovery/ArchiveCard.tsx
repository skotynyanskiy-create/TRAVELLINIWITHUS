import { Link } from '@/src/components/TransitionLink';
import { motion } from 'motion/react';
import { ArrowRight, Heart, MapPin } from 'lucide-react';
import OptimizedImage from '../OptimizedImage';
import TiltCard from '../TiltCard';
import { cardItem } from '../../lib/animations';
import type { ArchiveItem } from '../../utils/contentArchive';
import { getArchiveLocationLabel } from '../../utils/contentArchive';
import { useFavorites } from '../../context/FavoritesContext';
import { trackEvent } from '../../services/analytics';

function extractSlug(link: string): string {
  return link.split('/').filter(Boolean).pop() || link;
}

type Variant = 'editorial' | 'mood';

interface ArchiveCardProps {
  item: ArchiveItem;
  variant?: Variant;
  badge?: string;
  className?: string;
  showExperience?: boolean;
  showLocation?: boolean;
  /** Il default copre le griglie standard. La feature card di Esplora
   *  (col-span-2, ~66vw) DEVE passare il suo: con 33vw dichiarato il browser
   *  serviva una -480 stirata a 773px — sfocata su desktop. */
  sizes?: string;
  /** Stato passato via React Router per preservare contesto (es. URL di partenza). */
  linkState?: Record<string, unknown>;
  /** Callback opzionale per tracking analytics al click della card.
   *  Attaccato al Link primario (immagine) — preserva semantica nativa e a11y
   *  rispetto a un wrapper <div onClick>. */
  onCardClick?: () => void;
}

export default function ArchiveCard({
  item,
  variant = 'editorial',
  badge,
  className = '',
  showExperience = true,
  showLocation = true,
  sizes = '(max-width: 768px) 92vw, (max-width: 1024px) 46vw, 33vw',
  linkState,
  onCardClick,
}: ArchiveCardProps) {
  const location = getArchiveLocationLabel(item);
  const label = badge || item.primaryExperience || item.category;
  const slug = extractSlug(item.link);
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(slug);
  /* Le varianti -320/-480/-768 esistono per le dir elencate in
     RESPONSIVE_DIRS (scripts/optimize-images.mjs) e per le immagini alla
     radice di /images: senza srcset la card scarica la cover base intera. */
  const hasResponsiveVariants =
    /^\/images\/(destinations|reels|atlante|family|experiences|brand|home-journal)\//.test(
      item.image
    ) || /^\/images\/[^/]+\.(png|jpe?g|webp)$/.test(item.image);
  const responsiveWidths = hasResponsiveVariants ? [320, 480, 768] : undefined;

  const handleFavoriteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(slug);
    trackEvent('archive_card_favorite_toggle', {
      slug,
      category: item.category,
      now_saved: !saved,
    });
  };

  const favoriteButton = (
    <button
      type="button"
      onClick={handleFavoriteClick}
      aria-label={saved ? 'Rimuovi dai preferiti' : 'Salva nei preferiti'}
      aria-pressed={saved}
      className={`absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
        saved
          ? 'bg-[var(--color-accent)] text-[var(--color-ink)] shadow-md'
          : 'bg-white text-[var(--color-ink)] shadow-sm hover:text-[var(--color-accent)]'
      }`}
    >
      <Heart size={15} className={saved ? 'fill-current' : ''} strokeWidth={1.8} />
    </button>
  );

  // Wash caldo soft-light: unifica le saturazioni disparate delle foto (alcune
  // calde, altre fredde) verso una palette editoriale coerente, senza scurire.
  const warmWash = (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[var(--color-accent)] opacity-[0.08] mix-blend-soft-light"
    />
  );

  if (variant === 'mood') {
    return (
      <motion.div
        variants={cardItem}
        className={`group relative overflow-hidden rounded-[var(--radius-xl)] ${className}`}
      >
        {favoriteButton}
        <TiltCard maxTilt={4} className="h-full w-full">
          <Link
            to={item.link}
            state={linkState}
            onClick={onCardClick}
            style={
              item.link.startsWith('/articolo/')
                ? { viewTransitionName: `article-${slug}` }
                : undefined
            }
            className="block h-full w-full"
          >
            <div className="relative h-full w-full overflow-hidden">
              <OptimizedImage
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                responsiveWidths={responsiveWidths}
                sizes={sizes}
              />
              {warmWash}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                {showExperience && label && (
                  <span className="mb-3 w-fit rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--color-ink)] shadow-sm">
                    {label}
                  </span>
                )}
                <h3 className="max-w-[20rem] text-2xl font-serif leading-tight text-white md:text-3xl">
                  {item.title}
                </h3>
                {showLocation && location && (
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/80">
                      <MapPin size={11} />
                      {location}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Link>
        </TiltCard>
      </motion.div>
    );
  }

  return (
    <motion.article
      variants={cardItem}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-black/5 bg-white shadow-sm transition-all duration-500 hover:-translate-y-0.5 hover:border-black/10 hover:shadow-[var(--shadow-premium)] ${className}`}
    >
      {favoriteButton}
      <Link
        to={item.link}
        state={linkState}
        onClick={onCardClick}
        style={
          item.link.startsWith('/articolo/') ? { viewTransitionName: `article-${slug}` } : undefined
        }
        className="relative block aspect-[4/5] overflow-hidden"
      >
        <OptimizedImage
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          responsiveWidths={responsiveWidths}
          sizes={sizes}
        />
        {warmWash}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {label && (
          <span className="absolute top-5 left-5 rounded-full bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-ink)] shadow-sm">
            {label}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-6 md:p-7">
        {showLocation && location && (
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
              <MapPin size={11} />
              {location}
            </p>
          </div>
        )}
        <Link to={item.link} state={linkState} className="block">
          <h3 className="line-clamp-2 text-xl font-serif leading-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)] md:text-2xl">
            {item.title}
          </h3>
        </Link>
        {showExperience && item.experienceTypes.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {item.experienceTypes.slice(0, 2).map((exp) => (
              <span
                key={exp}
                className="rounded-full bg-[var(--color-accent-soft)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-text)]"
              >
                {exp}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto border-t border-black/5 pt-5">
          <Link
            to={item.link}
            state={linkState}
            className="group/btn relative inline-flex w-full items-center justify-between py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-black/60 transition-colors hover:text-[var(--color-accent-text)]"
          >
            <span>Leggi</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover/btn:translate-x-1.5"
            />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
