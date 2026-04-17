import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, MapPin } from 'lucide-react';
import OptimizedImage from '../OptimizedImage';
import { cardItem } from '../../lib/animations';
import type { ArchiveItem } from '../../utils/contentArchive';
import { getArchiveLocationLabel } from '../../utils/contentArchive';

type Variant = 'editorial' | 'mood';

interface ArchiveCardProps {
  item: ArchiveItem;
  variant?: Variant;
  badge?: string;
  className?: string;
  showExperience?: boolean;
  showLocation?: boolean;
}

export default function ArchiveCard({
  item,
  variant = 'editorial',
  badge,
  className = '',
  showExperience = true,
  showLocation = true,
}: ArchiveCardProps) {
  const location = getArchiveLocationLabel(item);
  const label = badge || item.primaryExperience || item.category;

  if (variant === 'mood') {
    return (
      <motion.div
        variants={cardItem}
        className={`group relative overflow-hidden rounded-[var(--radius-xl)] ${className}`}
      >
        <Link to={item.link} className="block h-full w-full">
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
      className={`group flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-black/5 bg-white transition-all duration-500 hover:-translate-y-1 hover:border-black/10 hover:shadow-[0_20px_48px_-18px_rgba(17,17,17,0.22)] ${className}`}
    >
      <Link to={item.link} className="relative block aspect-[16/10] overflow-hidden">
        <OptimizedImage
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {label && (
          <span className="absolute top-5 left-5 rounded-full bg-white/92 px-3.5 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-[var(--color-ink)] shadow-sm backdrop-blur-md">
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
        <Link to={item.link} className="block">
          <h3 className="line-clamp-2 text-xl font-serif leading-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)] md:text-2xl">
            {item.title}
          </h3>
        </Link>
        {showExperience && item.experienceTypes.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {item.experienceTypes.slice(0, 2).map((exp) => (
              <span
                key={exp}
                className="rounded-full bg-[var(--color-gold-soft)] px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-text)]"
              >
                {exp}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto border-t border-black/5 pt-5">
          <Link
            to={item.link}
            className="group/btn relative inline-flex w-full items-center justify-between text-[10px] font-bold uppercase tracking-[0.22em] text-black/40 transition-colors hover:text-[var(--color-accent)]"
          >
            <span>Scopri</span>
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
