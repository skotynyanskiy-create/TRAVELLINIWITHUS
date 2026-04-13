import { motion } from 'motion/react';
import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DESTINATION_GROUPS,
  EXPERIENCE_TYPES,
  slugifyExperienceType,
} from '../../config/contentTaxonomy';
import { getExperienceVisual } from '../../config/experienceVisuals';

const featuredExperiences = EXPERIENCE_TYPES.slice(0, 8);

export default function DestinationsGrid() {
  return (
    <section className="bg-[var(--color-sand)] py-20 md:py-24">
      <motion.div
        className="mx-auto max-w-7xl px-6 md:px-12"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-10">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
            Archivio
          </span>
          <h2 className="mt-1 text-3xl font-serif text-ink md:text-4xl">
            Esplora per luogo e per stile.
          </h2>
        </div>

        <div className="space-y-8">
          <div>
            <div className="mb-3 flex items-center justify-between gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-black/45">
                Per luogo
              </h3>
              <Link
                to="/destinazioni"
                className="hidden items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent-text)] transition-colors hover:text-ink sm:inline-flex"
              >
                Tutte <ArrowRight size={12} />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-3 -mx-6 px-6 snap-x md:flex-wrap md:overflow-visible md:mx-0 md:px-0">
              {DESTINATION_GROUPS.map((group) => (
                <Link
                  key={group}
                  to={`/destinazioni?group=${encodeURIComponent(group)}`}
                  className="inline-flex snap-start items-center gap-2 rounded-full border border-black/8 bg-white px-5 py-3 text-sm font-medium text-ink shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-gold)] hover:text-[var(--color-accent-warm)]"
                >
                  <MapPin size={14} className="text-[var(--color-gold)]" />
                  {group}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-black/45">
                Per esperienza
              </h3>
              <Link
                to="/esperienze"
                className="hidden items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent-text)] transition-colors hover:text-ink sm:inline-flex"
              >
                Tutte <ArrowRight size={12} />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-3 -mx-6 px-6 snap-x md:flex-wrap md:overflow-visible md:mx-0 md:px-0">
              {featuredExperiences.map((type) => {
                const visual = getExperienceVisual(type);
                const Icon = visual.icon;

                return (
                  <Link
                    key={type}
                    to={`/esperienze?type=${slugifyExperienceType(type)}`}
                    style={{ backgroundColor: visual.colorLight, borderColor: visual.color }}
                    className="inline-flex snap-start items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-accent-warm)] hover:text-[var(--color-accent-warm)]"
                  >
                    <Icon size={13} style={{ color: visual.color }} />
                    {type}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
