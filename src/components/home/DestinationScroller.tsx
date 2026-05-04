import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';
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
  return (
    <section className="bg-white py-10 md:py-14">
      <motion.div
        className="mx-auto max-w-[82rem] px-6 md:px-10 xl:px-12"
        initial={{ y: 8 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <MapPin size={16} />
          </div>
          <h2 className="text-xl font-serif leading-tight text-ink md:text-2xl">
            Dove vuoi andare?
          </h2>
        </div>

        <div className="relative">
          <div className="scrollbar-hidden flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 md:flex-wrap md:justify-center md:gap-10 md:overflow-visible md:pb-0">
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
