import { motion } from 'motion/react';
import { ArrowRight, Compass, MapPinned } from 'lucide-react';
import { Link } from 'react-router-dom';
import Section from '../Section';
import {
  DESTINATION_GROUPS,
  EXPERIENCE_TYPES,
  slugifyExperienceType,
} from '../../config/contentTaxonomy';
import { getExperienceVisual } from '../../config/experienceVisuals';
import type { HomeContent } from '../../config/siteContent';

const destinationCards = [
  {
    name: 'Italia',
    image:
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1200&auto=format&fit=crop',
    note: 'Borghi, tavole, weekend e citta che tornano utili davvero.',
  },
  {
    name: 'Europa',
    image:
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1200&auto=format&fit=crop',
    note: 'Capitali, fughe brevi e itinerari da costruire con piu criterio.',
  },
  {
    name: 'Asia',
    image:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop',
    note: 'Scelte piu grandi, ritmi diversi e logistica da capire bene.',
  },
  {
    name: 'Americhe',
    image:
      'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1200&auto=format&fit=crop',
    note: 'Road trip, metropoli e paesaggi che chiedono piu selezione.',
  },
  {
    name: 'Africa',
    image:
      'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1200&auto=format&fit=crop',
    note: 'Natura, viaggi forti e contesti da trattare con piu attenzione.',
  },
  {
    name: 'Oceania',
    image:
      'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=1200&auto=format&fit=crop',
    note: 'Spazi aperti, lunghi spostamenti e viaggi da preparare meglio.',
  },
] as const;

const featuredExperiences = EXPERIENCE_TYPES.slice(0, 6);

const experienceNotes: Record<string, string> = {
  'Posti particolari': 'Per chi cerca il luogo che cambia davvero il tono del viaggio.',
  'Food & Ristoranti': 'Tavole e soste che meritano una deviazione, non solo una foto.',
  'Locali insoliti': 'Atmosfera, carattere e indirizzi che non sembrano intercambiabili.',
  'Hotel con carattere': 'Strutture in cui il soggiorno diventa parte della storia.',
  'Weekend romantici': 'Idee di coppia con piu gusto e meno banalita.',
  "Borghi e citta d'arte": 'Un ingresso utile quando vuoi partire da centri storici e ritmo urbano.',
};

interface DestinationsGridProps {
  content: HomeContent['archive'];
}

export default function DestinationsGrid({ content }: DestinationsGridProps) {
  return (
    <Section className="bg-white" spacing="spacious">
      <div className="mb-12 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(260px,0.72fr)] lg:items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-[var(--color-accent)]">
            {content.eyebrow}
          </span>
          <h2 className="mt-4 max-w-4xl text-4xl font-serif leading-[1.02] text-[var(--color-ink)] md:text-5xl lg:text-[3.7rem]">
            {content.title}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-black/42">
            {content.helperLabel}
          </div>
          <p className="max-w-xl text-base leading-relaxed text-black/65">{content.description}</p>
        </div>
      </div>

      <div className="space-y-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.5fr)]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="relative overflow-hidden rounded-[2.1rem] bg-[var(--color-ink)] p-8 text-white shadow-[var(--shadow-editorial)] md:p-10"
          >
            <div className="absolute inset-0 bg-topo opacity-12" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(196,164,124,0.25),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_55%)]" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white/74">
                <MapPinned size={14} className="text-[var(--color-gold)]" />
                {content.destinations.eyebrow}
              </div>
              <h3 className="mt-6 max-w-sm text-3xl font-serif leading-tight md:text-4xl">
                {content.destinations.title}
              </h3>
              <p className="mt-4 max-w-sm text-base leading-relaxed text-white/78">
                {content.destinations.description}
              </p>
              <div className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-white/50">
                {content.destinations.helperLabel}
              </div>

              <Link
                to={content.destinations.ctaLink}
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-6 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white transition-all hover:border-transparent hover:bg-[var(--color-gold)]"
              >
                {content.destinations.ctaLabel}
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {destinationCards
              .filter((card) => DESTINATION_GROUPS.includes(card.name))
              .map((card, index) => (
                <motion.div
                  key={card.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.55 }}
                >
                  <Link
                    to={`/destinazioni?group=${encodeURIComponent(card.name)}`}
                    className="archive-card-geographic group bg-black"
                  >
                    <img
                      src={card.image}
                      alt={card.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0" style={{ background: 'var(--color-overlay-card-strong)' }} />

                    <div className="relative z-10 flex h-full flex-col justify-between p-5">
                      <div className="flex items-start justify-between gap-3">
                        <span className="rounded-full border border-white/14 bg-black/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/82 backdrop-blur-md">
                          {card.name}
                        </span>
                        <div className="rounded-full border border-white/14 bg-black/20 p-2 text-white/76 backdrop-blur-md transition-transform duration-300 group-hover:translate-x-1">
                          <ArrowRight size={14} />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-2xl font-serif leading-tight text-white">{card.name}</h4>
                        <p className="mt-3 max-w-[18rem] text-sm leading-relaxed text-white/74">
                          {card.note}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(300px,1fr)_minmax(0,1.35fr)]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="relative overflow-hidden rounded-[2.1rem] border border-black/5 bg-[linear-gradient(180deg,#fbf6ef_0%,#f4ede1_100%)] p-8 shadow-sm md:p-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(196,164,124,0.18),transparent_30%)]" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
                <Compass size={14} className="text-[var(--color-accent)]" />
                {content.experiences.eyebrow}
              </div>
              <h3 className="mt-6 max-w-sm text-3xl font-serif leading-tight text-[var(--color-ink)] md:text-4xl">
                {content.experiences.title}
              </h3>
              <p className="mt-4 max-w-sm text-base leading-relaxed text-black/64">
                {content.experiences.description}
              </p>
              <div className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-black/42">
                {content.experiences.helperLabel}
              </div>

              <Link
                to={content.experiences.ctaLink}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white transition-transform hover:translate-x-1"
              >
                {content.experiences.ctaLabel}
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {featuredExperiences.map((exp, index) => {
              const visual = getExperienceVisual(exp);
              const Icon = visual.icon;

              return (
                <motion.div
                  key={exp}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.55 }}
                >
                  <Link
                    to={`/esperienze?type=${slugifyExperienceType(exp)}`}
                    className="archive-card-thematic group"
                  >
                    <div
                      className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: visual.colorLight, color: visual.color }}
                    >
                      <Icon size={20} />
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <h4 className="text-xl font-serif leading-tight text-[var(--color-ink)]">
                        {exp}
                      </h4>
                      <ArrowRight
                        size={16}
                        className="mt-1 shrink-0 text-black/25 transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-black/60">
                      {experienceNotes[exp] ??
                        'Apri questa tipologia e restringi il viaggio dal lato giusto.'}
                    </p>

                    <div
                      className="mt-5 h-1.5 w-16 rounded-full transition-all duration-300 group-hover:w-24"
                      style={{ backgroundColor: visual.color }}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
