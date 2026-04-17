import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import OptimizedImage from '../OptimizedImage';
import type { ArchiveItem } from '../../utils/contentArchive';
import { getArchiveLocationLabel } from '../../utils/contentArchive';
import { formatDateValue, type DateValue } from '../../utils/dateValue';

interface FeaturedGuideCardProps {
  item: ArchiveItem;
  createdAt?: DateValue;
  readTime?: string;
}

export default function FeaturedGuideCard({ item, createdAt, readTime }: FeaturedGuideCardProps) {
  const location = getArchiveLocationLabel(item);
  const date = formatDateValue(createdAt);

  return (
    <article className="group relative overflow-hidden rounded-[var(--radius-2xl)] border border-black/5 bg-white shadow-sm transition-all duration-500 hover:shadow-[0_32px_64px_-24px_rgba(17,17,17,0.25)]">
      <Link to={item.link} className="flex flex-col md:flex-row">
        <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:w-[58%]">
          <OptimizedImage
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <span className="absolute top-6 left-6 rounded-full bg-white/92 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)] shadow-sm backdrop-blur-md">
            In evidenza
          </span>
        </div>

        <div className="flex flex-col justify-center gap-6 p-8 md:w-[42%] md:p-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
            Guida di viaggio
          </span>
          <h2 className="text-3xl font-serif leading-[1.1] tracking-tight text-[var(--color-ink)] md:text-4xl lg:text-5xl">
            {item.title}
          </h2>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-bold uppercase tracking-[0.22em] text-black/40">
            {location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={12} className="text-[var(--color-accent)]" />
                {location}
              </span>
            )}
            {date && <span>{date}</span>}
            {readTime && (
              <span className="inline-flex items-center gap-1.5">
                <Clock size={12} className="text-[var(--color-accent)]" />
                {readTime}
              </span>
            )}
          </div>

          <span className="mt-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
            Leggi la guida
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1.5"
            />
          </span>
        </div>
      </Link>
    </article>
  );
}
