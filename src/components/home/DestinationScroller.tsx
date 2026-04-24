import { useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DESTINATION_GROUPS, type DestinationGroup } from '../../config/contentTaxonomy';
import { getDestinationVisual } from '../../config/destinationVisuals';
import { trackEvent } from '../../services/analytics';

function DestinationChip({ group }: { group: DestinationGroup }) {
  const visual = getDestinationVisual(group);

  return (
    <Link
      to={`/destinazioni?group=${encodeURIComponent(group)}`}
      onClick={() => trackEvent('destination_chip_click', { group, placement: 'home_scroller' })}
      className="group flex shrink-0 snap-start flex-col items-center gap-3 transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-transparent bg-[var(--color-sand)] shadow-sm transition-all duration-300 group-hover:border-[var(--color-accent)] group-hover:shadow-lg md:h-24 md:w-24">
        <img
          src={visual.image}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      <span className="text-xs font-semibold tracking-wide text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)] md:text-sm">
        {group}
      </span>
    </Link>
  );
}

export default function DestinationScroller() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.6;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="bg-white py-10 md:py-14">
      <motion.div
        className="mx-auto max-w-[82rem] px-6 md:px-10 xl:px-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
              <MapPin size={16} />
            </div>
            <div>
              <h2 className="text-xl font-serif leading-tight text-[var(--color-ink)] md:text-2xl">
                Dove vuoi andare?
              </h2>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label="Scorri a sinistra"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/8 bg-white text-black/40 transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <ArrowRight size={14} className="rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label="Scorri a destra"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/8 bg-white text-black/40 transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="scrollbar-hidden flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 md:gap-8 lg:justify-center lg:gap-10"
          >
            {DESTINATION_GROUPS.map((group) => (
              <DestinationChip key={group} group={group} />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white md:hidden" />
        </div>
      </motion.div>
    </section>
  );
}
