import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Heart, MapPin } from 'lucide-react';
import OptimizedImage from '../OptimizedImage';
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
  linkState,
  onCardClick,
}: ArchiveCardProps) {
  const location = getArchiveLocationLabel(item);
  const label = badge || item.primaryExperience || item.category;
  const slug = extractSlug(item.link);
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(slug);

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
      className={`absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 ${
        saved
          ? 'bg-[var(--color-accent)] text-white shadow-md'
          : 'bg-white/85 text-[var(--color-ink)] hover:bg-white hover:text-[var(--color-accent)]'
      }`}
    >
      <Heart size={15} className={saved ? 'fill-current' : ''} strokeWidth={1.8} />
    </button>
  );

  if (variant === 'mood') {
    return (
      <motion.div
        variants={cardItem}
        className={`group relative overflow-hidden rounded-[var(--radius-xl)] ${className}`}
      >
        {favoriteButton}
        <Link
          to={item.link}
          state={linkState}
          onClick={onCardClick}
          className="block h-full w-full"
        >
          <div className="relative h-full w-full overflow-hidden">
            <OptimizedImage
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
              {showExperience && label && (
                <span className="mb-3 w-fit rounded-full bg-white/88 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.24em] text-[var(--color-ink)] backdrop-blur-sm">
                  {label}
                </span>
              )}
              <h3 className="max-w-[20rem] text-2xl font-serif leading-tight text-white md:text-3xl">
                {item.title}
              </h3>
              {showLocation && location && (
                <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/80">
                  <MapPin size={11} />
                  {location}
                </p>
              )}
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.article
      variants={cardItem}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-black/5 bg-white transition-all duration-500 hover:-translate-y-0.5 hover:border-black/10 hover:shadow-[0_20px_48px_-18px_rgba(17,17,17,0.22)] ${className}`}
    >
      {favoriteButton}
      <Link
        to={item.link}
        state={linkState}
        onClick={onCardClick}
        className="relative block aspect-[4/5] overflow-hidden"
      >
        <OptimizedImage
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {label && (
          <span className="absolute top-5 left-5 rounded-full bg-white/88 px-3.5 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-[var(--color-ink)] shadow-sm backdrop-blur-md">
            {label}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-6 md:p-7">
        {showLocation && location && (
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
            <MapPin size={11} />
            {location}
          </p>
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
                className="rounded-full bg-[var(--color-accent-soft)] px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-text)]"
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
            className="group/btn relative inline-flex w-full items-center justify-between text-[10px] font-bold uppercase tracking-[0.22em] text-black/40 transition-colors hover:text-[var(--color-accent)]"
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
