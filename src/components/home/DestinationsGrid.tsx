import { motion } from 'motion/react';
import { ArrowRight, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import Section from '../Section';
import { EXPERIENCE_TYPES } from '../../config/contentTaxonomy';
import { getExperienceVisual } from '../../config/experienceVisuals';

const featuredExperiences = EXPERIENCE_TYPES.slice(0, 6);

export default function DestinationsGrid() {
  return (
    <Section
      title="Esplora per filtro"
      subtitle="Destinazioni ed Esperienze"
      className="bg-white"
      ornament
    >
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Destinazioni card — dark with background image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl bg-ink p-8 md:p-10 text-white shadow-xl lg:col-span-7 flex flex-col justify-between relative overflow-hidden group bg-topo"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(196,164,124,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_26%)]" />
          <div className="absolute right-8 top-8 hidden rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 backdrop-blur-md md:inline-flex">
            Archivio per luogo
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-[var(--color-accent-warm)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10">
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent)] mb-3">
              <Compass className="inline-block mr-2" size={14} /> Destinazioni
            </div>
            <h3 className="text-3xl font-serif leading-tight md:text-4xl">
              Esplora per luogo.
              <br />
              <span className="font-script text-[var(--color-accent-warm)] text-[0.8em]">
                Italia, Europa e oltre.
              </span>
            </h3>
            <p className="mt-5 max-w-md text-base font-normal leading-relaxed text-white/85">
              I nostri itinerari e recensioni filtrati per paese, regione e singola città.
            </p>
          </div>
          <Link
            to="/destinazioni"
            className="mt-10 inline-flex self-start items-center gap-2 rounded-full border border-white/15 bg-[#1C1C1C] px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[var(--color-gold)] hover:border-transparent"
          >
            Apri destinazioni
            <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* Esperienze card — light */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="rounded-3xl border border-black/5 bg-[var(--color-gold-soft)] p-8 md:p-10 shadow-sm lg:col-span-5 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[var(--color-gold)]/20 rounded-tl-3xl pointer-events-none" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent)] mb-3">
              Esperienze
            </div>
            <h3 className="text-2xl font-serif leading-tight text-ink md:text-3xl">
              Lo stesso archivio, diviso per stile di viaggio.
            </h3>

            <div className="mt-5 flex flex-wrap gap-2">
              {featuredExperiences.map((exp) => {
                const visual = getExperienceVisual(exp);
                const Icon = visual.icon;
                return (
                  <span
                    key={exp}
                    style={{ backgroundColor: visual.colorLight }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-ink)]/5 px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest text-ink transition-all duration-300 cursor-pointer hover:shadow-sm hover:-translate-y-0.5 hover:border-[var(--color-accent-warm)] hover:text-[var(--color-accent-warm)]"
                  >
                    <Icon size={12} style={{ color: visual.color }} />
                    {exp}
                  </span>
                );
              })}
            </div>
          </div>
          <Link
            to="/esperienze"
            className="mt-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ink transition-colors hover:text-[var(--color-accent-warm)]"
          >
            Esplora per Esperienza
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </Section>
  );
}
